import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {UniverseApplication} from '../../../src/application/universe.ts';
import {ProjectApplication} from '../../../src/application/project.ts';
import {WorkspaceApplication} from '../../../src/application/workspace.ts';
import {FileUniverseStorage} from '../../../src/infrastructure/universe-storage.ts';
import {FileProjectStorage} from '../../../src/infrastructure/project-storage.ts';
import {WorkspaceCoordinator} from '../../../src/infrastructure/workspace-coordinator.ts';
import {SettingsStorage} from '../../../src/infrastructure/settings-storage.ts';
import {ProtectionService} from '../../../src/infrastructure/protection-service.ts';
import {canonical,hash} from '../../../src/infrastructure/universe-files.ts';
import {createRecord,putChange} from '../../../src/presentation/workspace/model.ts';
import {serializeManuscript} from '../../../src/infrastructure/exports.ts';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-export-probe-'));
const userData=path.join(root,'profile'),universePath=path.join(root,'universe'),projectPath=path.join(root,'project'),output=path.join(root,'output');
for(const p of [userData,universePath,projectPath,output])fs.mkdirSync(p);
const coordinator=new WorkspaceCoordinator(userData);
const universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator));
const projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);
const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:v=>hash(canonical(v)),textDigest:hash,byteLength:t=>Buffer.byteLength(t).toString()});
const settings=new SettingsStorage(userData,fn=>coordinator.settingsGate(fn));
const results=[];
try{
 universes.create(universePath,{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Export verification',description:''}});
 projects.create(projectPath,universePath,{operationId:randomUUID()});
 const service=new ProtectionService(workspace,settings,userData,coordinator);
 const save=(record:any,text:string|null)=>{const before=workspace.snapshot();workspace.mutate({operationId:randomUUID(),submittedEditorRevision:'1',units:[{owner:before.project!.owner,expectedUnitGeneration:before.project!.generation,changes:[putChange(before,record,text)]}]});};
 const story=createRecord(workspace.snapshot(),'story');story.data.title='Temporary export story';save(story,null);
 const texts=['Heading\nBold italic plain café\n\nTabs\tand  double spaces\n***\nIndented ending.','Second chapter text.'];
 const chapters=texts.map((text,index)=>{
  const chapter=createRecord(workspace.snapshot(),'chapter',story.id);chapter.data.title=`Chapter ${index+1}`;
  let at=0;chapter.data.formatting.paragraphs=text.split('\n').map((line,i)=>{const start=at;at+=Array.from(line).length+1;return{id:randomUUID(),start:String(start),end:String(at-1),indent:i===5?'2':'0',kind:line==='***'?'scene-break':i===0&&index===0?'heading':'body',...(i===0&&index===0?{headingLevel:2}:{}),marks:i===1?[{start:String(start),end:String(start+4),styles:['bold']},{start:String(start+5),end:String(start+11),styles:['italic']}]:[]};});save(chapter,text);return chapter;
 });
 const owner=workspace.snapshot().project!.owner;
 const runtime=path.resolve(process.env.WRITINGTOOL_PROBE_RUNTIME??'resources/libreoffice/program/soffice');
 for(const format of ['txt','md','docx','pdf','sqlite'] as const){
  const dest=path.join(output,'manuscript.'+format),started=performance.now();
  const result=await service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.export',owner,format,storyId:format==='sqlite'?null:story.id,chapterIds:null,nativeRuntime:runtime,nativeDestination:{path:dest,expectedHash:null}});
  assert.equal(result.output?.path,dest);assert.ok(fs.statSync(dest).size>0);
  if(format==='txt'||format==='md')assert.equal(fs.readFileSync(dest,'utf8'),serializeManuscript(chapters.map((c,i)=>({title:c.data.title,text:texts[i],paragraphs:c.data.formatting.paragraphs})),format));
  if(format==='sqlite'){const db=new DatabaseSync(dest);try{assert.equal(db.prepare('PRAGMA quick_check').get()!.quick_check,'ok');const meta=db.prepare('SELECT * FROM writingtool_export_metadata').get()!;assert.equal(meta.ownerId,owner.id);assert.equal(meta.scope,'catalog-only');assert.ok(String(meta.dependencyNotice).length>0);}finally{db.close();}}
  if(format==='pdf'){const extracted=execFileSync('/usr/bin/pdftotext',[dest,'-'],{encoding:'utf8'});for(const phrase of ['Chapter 1','Heading','Bold italic plain café','Indented ending.','Chapter 2','Second chapter text.'])assert.ok(extracted.includes(phrase),phrase);}
  results.push({format,bytes:fs.statSync(dest).size,ms:Math.round(performance.now()-started)});console.log(format+': passed');
 }
 const universeOwner=workspace.snapshot().universe!.owner;
 const universeExport=await service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.export',owner:universeOwner,format:'sqlite',storyId:null,chapterIds:null,nativeDestination:{path:path.join(output,'universe.sqlite'),expectedHash:null}});
 assert.ok(universeExport.output);results.push({format:'standalone-universe catalog',passed:true});
 const archivePaths=[];
 for(const backupOwner of [owner,universeOwner]){const result=await service.execute({protocolVersion:1,requestId:randomUUID(),command:'protection.backup',owner:backupOwner,reason:'Manual',chooseLocation:false,closing:false,nativeBackupFolder:output});assert.ok(result.output);archivePaths.push(result.output.path);}
 projects.close();universes.close();
 fs.renameSync(projectPath,projectPath+'-unavailable');fs.renameSync(universePath,universePath+'-unavailable');
 for(const file of archivePaths){const archive=await service.archives.read(file,{canceled:false,cancelable:true,phase:'Verifying ZIP without original roots'});const resolved=service.revisions.resolve(archive.manifest.revision,(_owner,object)=>{const bytes=archive.objects.get(object.sha256);assert.ok(bytes);return bytes;});if(archive.manifest.revision.owner.kind==='project'){const restored=resolved.find(u=>u.owner.kind==='project')!;for(let i=0;i<chapters.length;i++)assert.equal(restored.manuscripts[chapters[i].id],texts[i]);}results.push({format:archive.manifest.revision.owner.kind+' ZIP',originalRootsUnavailable:true,payloads:archive.objects.size});}
 fs.writeFileSync(new URL(process.env.WRITINGTOOL_PROBE_RESULT??'./export-probe-results.json',import.meta.url),JSON.stringify({root,results,limits:'PDF checks extracted text and structure; visual layout and full recovery activation remain unverified.'},null,2)+'\n');
 console.log('All export/catalog/ZIP probes passed. Temporary artifacts: '+root);
}finally{projects.close();universes.close();coordinator.close();}
