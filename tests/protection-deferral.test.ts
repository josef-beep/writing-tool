import test,{type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {UniverseApplication,UniverseFailure} from '../src/application/universe';
import {ProjectApplication} from '../src/application/project';
import {WorkspaceApplication} from '../src/application/workspace';
import {canDeferProtection,protectionOperationId,validProtectionRequest,validProtectionResult,validProtectionValue,type ProtectionRequest,type ProtectionHostRequest} from '../src/application/contracts/protection';
import type {WorkspaceRecordOf} from '../src/domain/workspace';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage';
import {FileProjectStorage} from '../src/infrastructure/project-storage';
import {WorkspaceCoordinator} from '../src/infrastructure/workspace-coordinator';
import {SettingsStorage} from '../src/infrastructure/settings-storage';
import {ProtectionService} from '../src/infrastructure/protection-service';
import {canonical,hash} from '../src/infrastructure/universe-files';
import {createRecord,putChange} from '../src/presentation/workspace/model';

test('only saved-copy operations can be deferred; live recovery and authority changes remain blocked',()=>{
 for(const command of ['protection.capture','protection.backup','protection.export'] as const)assert.equal(canDeferProtection(command),true,command);
 for(const command of ['protection.apply','protection.recent','protection.recover','protection.resolve','protection.reference','protection.delete','protection.reconcile','protection.defer'] as const)assert.equal(canDeferProtection(command),false,command);
});

test('defer accepts only its closed renderer protocol and correlates uncertainty to the original operation',()=>{
 const request:ProtectionRequest={protocolVersion:1,requestId:randomUUID(),command:'protection.defer',operationId:randomUUID()};
 assert.equal(validProtectionRequest(request),true);
 assert.equal(protectionOperationId(request),request.operationId);
 for(const invalid of [{...request,operationId:'invalid'},{...request,operationId:undefined},{...request,chooseLocation:true},{...request,deferred:true},{...request,nativeBackupFolder:'/tmp/output'}])assert.equal(validProtectionRequest(invalid),false);
 const result={protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',message:'The deferred marker could not be confirmed.',outcome:'unknown',operationId:request.operationId};
 assert.equal(validProtectionResult(result,request),true);
 assert.equal(validProtectionResult({...result,operationId:request.requestId},request),false);
 assert.equal(validProtectionResult({...result,requestId:randomUUID()},request),false);
 assert.equal(validProtectionResult({...result,outcome:'not-committed',operationId:null},request),true);
 assert.equal(validProtectionResult({protocolVersion:1,requestId:request.requestId,command:request.command,status:'ok',value:{}},request),true);
 assert.equal(validProtectionResult({protocolVersion:1,requestId:request.requestId,command:request.command,status:'ok',value:{reconciliation:{operationId:request.operationId,outcome:'not-committed'}}},request),false);
});

test('pending eligibility must reference distinct, valid pending operation identities',()=>{
 const safe=randomUUID(),live=randomUUID(),foreign=randomUUID();
 assert.equal(validProtectionValue({pending:[safe,live],deferrable:[safe]}),true);
 assert.equal(validProtectionValue({pending:[safe,live]}),true);
 assert.equal(validProtectionValue({pending:[],deferrable:[],deferred:[]}),true);
 assert.equal(validProtectionValue({pending:[safe,live],deferrable:[safe],deferred:[safe]}),true);
 for(const invalid of [{deferrable:[safe]},{pending:[safe],deferrable:[foreign]},{pending:[safe],deferrable:[safe,safe]},{pending:[safe],deferrable:['invalid']},{pending:[safe],deferrable:true},{pending:[safe,live],deferrable:[safe],deferred:[live]},{pending:[safe],deferred:[safe]},{pending:[safe],deferrable:[safe],deferred:[safe,safe]},{pending:[safe],deferrable:[safe],deferred:['invalid']}])assert.equal(validProtectionValue(invalid),false);
});

function fixture(t:TestContext){
 const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'writingtool-deferral-'));
 const userData=path.join(root,'user-data'),universePath=path.join(root,'universe'),projectPath=path.join(root,'project'),output=path.join(root,'output');
 for(const directory of [userData,universePath,projectPath,output])fs.mkdirSync(directory);
 const coordinator=new WorkspaceCoordinator(userData);
 const universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator));
 const projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);
 const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:value=>hash(canonical(value)),textDigest:hash,byteLength:text=>Buffer.byteLength(text).toString()});
 const settings=new SettingsStorage(userData,fn=>coordinator.settingsGate(fn));
 const current=settings.get();settings.save({...current,retentionDays:'1',backupDestination:output},current.recordVersion);
 universes.create(universePath,{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Deferral fixture',description:''}});
 projects.create(projectPath,universePath,{operationId:randomUUID()});
 const service=new ProtectionService(workspace,settings,userData,coordinator);
 t.after(()=>{try{projects.close();universes.close();}finally{coordinator.close();fs.rmSync(root,{recursive:true,force:true});}});
 const story=createRecord(workspace.snapshot(),'story');assert.equal(story.recordType,'story');story.data.title='Retained story';
 const save=(record:WorkspaceRecordOf<'story'>|WorkspaceRecordOf<'chapter'>,text:string|null)=>{const before=workspace.snapshot();assert.ok(before.project);workspace.mutate({operationId:randomUUID(),submittedEditorRevision:'1',units:[{owner:before.project.owner,expectedUnitGeneration:before.project.generation,changes:[putChange(before,record,text)]}]});};
 save(story,null);
 const chapter=createRecord(workspace.snapshot(),'chapter',story.id);assert.equal(chapter.recordType,'chapter');chapter.data.title='Retained chapter';
 const write=(text:string)=>{const current=workspace.snapshot().project?.records.find(record=>record.id===chapter.id);const candidate=structuredClone(current??chapter);assert.equal(candidate.recordType,'chapter');candidate.data.formatting.paragraphs=[{id:randomUUID(),start:'0',end:Array.from(text).length.toString(),indent:'0',kind:'body',marks:[]}];save(candidate,text);};
 write('Original captured manuscript.');
 const owner=workspace.snapshot().project!.owner;
 const pending=(request:ProtectionHostRequest)=>{const project=projects.current()!,universe=universes.current()!;const directory=path.join(userData,'protection/native-pending');fs.mkdirSync(directory,{recursive:true});const file=path.join(directory,request.requestId+'.json');fs.writeFileSync(file,JSON.stringify({request,project:project.location,universe:universe.location,projectIdentity:{id:project.ownerId,rootId:project.rootId},universeIdentity:{id:universe.ownerId,rootId:universe.rootId},dispatch:'attempted',deferred:true}));return file;};
 return{root,userData,output,workspace,service,owner,chapterId:chapter.id,storyId:story.id,write,pending};
}

for(const kind of ['backup','export'] as const)test(`a failed ${kind} retains its original manuscript while later writing saves and reconciliation publishes the original capture`,async t=>{
 const f=fixture(t),destination=path.join(f.output,'occupied.'+(kind==='backup'?'zip':'txt'));
 fs.writeFileSync(destination,'Unrelated output must survive.');
 const request:ProtectionHostRequest=kind==='backup'?{protocolVersion:1,requestId:randomUUID(),command:'protection.backup',owner:f.owner,reason:'Manual',chooseLocation:false,closing:false,nativeDestination:{path:destination,expectedHash:null}}:{protocolVersion:1,requestId:randomUUID(),command:'protection.export',owner:f.owner,format:'txt',storyId:f.storyId,chapterIds:null,nativeRuntime:path.join(f.root,'unused-converter'),nativeDestination:{path:destination,expectedHash:null}};
 const pendingFile=f.pending(request);
 await assert.rejects(f.service.execute(request),error=>error instanceof UniverseFailure&&error.outcome==='unknown');
 const jobFile=path.join(f.userData,'protection/jobs',request.requestId+'.json');
 assert.equal(JSON.parse(fs.readFileSync(jobFile,'utf8')).state,'prepared');
 f.write('New writing saved after deferral.');
 assert.equal(f.workspace.snapshot().project?.manuscripts[f.chapterId],'New writing saved after deferral.');
 // Preserve the conflicting file before retrying: changed output evidence must
 // remain a recovery block even when another publication location is selected.
 const preservedDestination=destination+'.preserved';fs.renameSync(destination,preservedDestination);
 const result=await f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.reconcile',operationId:request.requestId,...(kind==='backup'?{nativeBackupFolder:f.output}:{nativeDestination:{path:path.join(f.output,'reconciled.txt'),expectedHash:null}})});
 assert.ok(result.output);
 if(kind==='backup'){
  const archive=await f.service.archives.read(result.output.path,{canceled:false,cancelable:true,phase:'Checking retained archive'});
  const captured=f.service.revisions.resolve(archive.manifest.revision,(_owner,object)=>{const bytes=archive.objects.get(object.sha256);assert.ok(bytes);return bytes;});
  assert.equal(captured.find(unit=>unit.owner.kind==='project')?.manuscripts[f.chapterId],'Original captured manuscript.');
 }else{
  assert.match(fs.readFileSync(result.output.path,'utf8'),/Original captured manuscript\./);
  assert.doesNotMatch(fs.readFileSync(result.output.path,'utf8'),/New writing saved after deferral/);
 }
 assert.equal(f.workspace.snapshot().project?.manuscripts[f.chapterId],'New writing saved after deferral.');
 assert.equal(fs.readFileSync(preservedDestination,'utf8'),'Unrelated output must survive.');
 assert.equal(fs.existsSync(pendingFile),true);
 assert.equal(JSON.parse(fs.readFileSync(jobFile,'utf8')).state,'complete');
});

test('deferred capture evidence survives automatic revision retention and manual deletion until reconciled',async t=>{
 const f=fixture(t);t.mock.timers.enable({apis:['Date'],now:new Date('2020-01-01T00:00:00Z')});
 const request:ProtectionHostRequest={protocolVersion:1,requestId:randomUUID(),command:'protection.capture',owner:f.owner,reason:'Manual'};
 const pendingFile=f.pending(request),captured=await f.service.execute(request);assert.ok(captured.manifest);
 const original=canonical(captured.manifest);
 t.mock.timers.setTime(new Date('2020-01-03T00:00:00Z').getTime());
 f.write('Later writing after an expired capture.');
 await f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.capture',owner:f.owner,reason:'Automatic'});
 assert.equal(canonical(f.service.revisions.get(f.owner,request.requestId)),original);
 await assert.rejects(f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.delete',owner:f.owner,kind:'revision',id:request.requestId}),/references this revision/);
 fs.unlinkSync(pendingFile);
 await f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.capture',owner:f.owner,reason:'Automatic'});
 assert.equal(f.service.revisions.list(f.owner).some(manifest=>manifest.id===request.requestId),false);
});

test('a deferred archive older than the newest ten survives retention and explicit deletion',async t=>{
 const f=fixture(t);t.mock.timers.enable({apis:['Date'],now:new Date('2020-01-01T00:00:00Z')});
 const request:ProtectionHostRequest={protocolVersion:1,requestId:randomUUID(),command:'protection.backup',owner:f.owner,reason:'Manual',chooseLocation:false,closing:false,nativeBackupFolder:f.output};
 const pendingFile=f.pending(request),first=await f.service.execute(request);assert.ok(first.output);
 const bytes=fs.readFileSync(first.output.path);
 for(let index=0;index<10;index++){
  t.mock.timers.setTime(new Date('2020-01-03T00:00:00Z').getTime()+index*1000);
  await f.service.execute({...request,requestId:randomUUID()});
 }
 assert.equal(f.service.archives.registry().length,11);
 assert.deepEqual(fs.readFileSync(first.output.path),bytes);
 await assert.rejects(f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.delete',owner:f.owner,kind:'archive',id:request.requestId}),/unfinished operation still references this archive/);
 fs.unlinkSync(pendingFile);
 await f.service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.capture',owner:f.owner,reason:'Automatic'});
 assert.equal(fs.existsSync(first.output.path),false);
 assert.equal(f.service.archives.registry().length,10);
});
