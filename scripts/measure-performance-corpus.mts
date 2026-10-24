import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {performance} from 'node:perf_hooks';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {UniverseApplication} from '../src/application/universe';
import {ProjectApplication} from '../src/application/project';
import {WorkspaceApplication} from '../src/application/workspace';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage';
import {FileProjectStorage} from '../src/infrastructure/project-storage';
import {WorkspaceCoordinator} from '../src/infrastructure/workspace-coordinator';
import {SettingsStorage} from '../src/infrastructure/settings-storage';
import {ProtectionService} from '../src/infrastructure/protection-service';
import {canonical,hash} from '../src/infrastructure/universe-files';
import {orderedChapters,visibleRecord,type WorkspaceRecordOf} from '../src/domain/workspace';
import type {CalendarData} from '../src/domain/calendar';

function tree(root:string):{bytes:number;files:number}{let bytes=0,files=0;if(!fs.existsSync(root))return{bytes,files};for(const e of fs.readdirSync(root,{withFileTypes:true})){const file=path.join(root,e.name);if(e.isDirectory()){const v=tree(file);bytes+=v.bytes;files+=v.files;}else if(e.isFile()){bytes+=fs.statSync(file).size;files++;}}return{bytes,files};}
function historyDigest(root:string){const digest=createHash('sha256');const visit=(folder:string)=>{if(!fs.existsSync(folder))return;for(const e of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:1)){const file=path.join(folder,e.name);if(e.isDirectory())visit(file);else if(e.isFile())digest.update(path.relative(root,file)).update('\0').update(hash(fs.readFileSync(file))).update('\0');}};visit(path.join(root,'project/history/objects'));visit(path.join(root,'universe/history/objects'));return digest.digest('hex');}
const quantile=(values:number[],fraction:number)=>[...values].sort((a,b)=>a-b)[Math.max(0,Math.ceil(values.length*fraction)-1)];

export async function measureCorpus(root:string,output:string,runs=3,includeProtection=true){
 root=fs.realpathSync(root);if(!root.startsWith(fs.realpathSync(os.tmpdir())+path.sep))throw new Error('Performance measurements require a marked OS-temporary fixture.');
 const marker=JSON.parse(fs.readFileSync(path.join(root,'.writingtool-performance-fixture.json'),'utf8')),corpus=JSON.parse(fs.readFileSync(path.join(root,'corpus.json'),'utf8'));
 if(marker.schemaVersion!==1||marker.state!=='seeded'||corpus.root!==root||!Number.isSafeInteger(runs)||runs<1)throw new Error('Invalid generated fixture or sample count.');
 const measurements:{operation:string;samplesMs:number[];p95Ms:number;medianMs:number;scope:string}[]=[],startedAt=new Date().toISOString(),profile=path.join(root,'profile');
 const record=(operation:string,samplesMs:number[],scope:string)=>{const result={operation,samplesMs,p95Ms:quantile(samplesMs,.95),medianMs:quantile(samplesMs,.5),scope};measurements.push(result);console.log(JSON.stringify({event:'measured',...result,rss:process.memoryUsage().rss}));};
 const report={schemaVersion:1,root,scale:corpus.scale,tiny:corpus.tiny,startedAt,runs,corpusCounts:corpus.counts,corpusWords:corpus.words,imageBytes:corpus.imageBytes,measurements,hardware:{cpu:os.cpus()[0]?.model,logicalCpus:os.cpus().length,memoryBytes:os.totalmem(),platform:os.platform(),release:os.release()},referenceMachineMatches:false,installedInteractiveMeasured:false,cacheConditions:'Normal local filesystem cache; fresh authority open, then warm sequential operations. No OS cache eviction or forced GC.',scope:'Production backend and converter operations through Node with real temporary stores. Does not certify installed UI latency or reference-machine p95 budgets.',status:'running',historyPreserved:false,sizes:{} as Record<string,unknown>,error:null as string|null};
 const persist=()=>fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');persist();
 let coordinator:WorkspaceCoordinator|undefined,universes:UniverseApplication|undefined,projects:ProjectApplication|undefined;
 try{
  console.log(JSON.stringify({event:'start',operation:'open',root}));const openedAt=performance.now();
  coordinator=new WorkspaceCoordinator(profile);universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator));projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);projects.open(path.join(root,'project'));
  const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:v=>hash(canonical(v)),textDigest:hash,byteLength:text=>String(Buffer.byteLength(text))});
  let snapshot=workspace.snapshot();record('open',[performance.now()-openedAt],'Authority open plus fully validated project/universe snapshot; excludes renderer/IPC readiness.');persist();
  const expected=corpus.recordCounts as Record<string,number>,records=[...snapshot.project!.records,...snapshot.universe!.records];for(const [kind,count] of Object.entries(expected))if(records.filter(r=>r.recordType===kind).length!==count)throw new Error('Runtime count mismatch: '+kind);
  if(snapshot.universe!.assets.length!==corpus.counts.images)throw new Error('Runtime image count mismatch.');
  if(Object.values(snapshot.project!.manuscripts).reduce((sum,text)=>sum+text.trim().split(/\s+/u).length,0)!==corpus.words)throw new Error('Runtime manuscript word count mismatch.');
  const chapterId=corpus.chapterIds[0] as string,owner=snapshot.project!.owner,beforeHistory=historyDigest(root),originalHistoryFiles=new Map<string,string>();
  for(const location of ['project','universe']){const base=path.join(root,location,'history/objects');const visit=(folder:string)=>{for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory())visit(file);else if(entry.isFile())originalHistoryFiles.set(file,hash(fs.readFileSync(file)));}};visit(base);}
  const calendar=snapshot.universe!.records.find(r=>r.recordType==='calendar')!.data as CalendarData;
  const queryTimes:number[]=[],saveTimes:number[]=[],contextTimes:number[]=[];
  for(let run=0;run<runs;run++){
   console.log(JSON.stringify({event:'start',operation:'snapshot',run}));let start=performance.now();snapshot=workspace.snapshot();queryTimes.push(performance.now()-start);
   start=performance.now();orderedChapters(snapshot.project!.records.filter((r):r is WorkspaceRecordOf<'chapter'>=>r.recordType==='chapter'),calendar);snapshot.universe!.records.filter((r):r is WorkspaceRecordOf<'event'>|WorkspaceRecordOf<'decision'>=>r.recordType==='event'||r.recordType==='decision').filter(r=>visibleRecord(r,{makers:[],categories:[]}));contextTimes.push(performance.now()-start);
   const current=structuredClone(snapshot.project!.records.find((r):r is WorkspaceRecordOf<'chapter'>=>r.id===chapterId&&r.recordType==='chapter')!),suffix=`·probe${run}`,text=snapshot.project!.manuscripts[chapterId]+suffix,last=current.data.formatting.paragraphs.at(-1)!;
   last.end=String(BigInt(last.end)+BigInt(Array.from(suffix).length));const operationId=randomUUID();console.log(JSON.stringify({event:'start',operation:'durable-save',run}));start=performance.now();
   const receipt=workspace.mutate({operationId,submittedEditorRevision:String(run+1),units:[{owner,expectedUnitGeneration:snapshot.project!.generation,changes:[{action:'put',record:current,expectedRecordVersion:current.recordVersion,manuscript:text}]}]});snapshot=workspace.snapshot();saveTimes.push(performance.now()-start);
   if(receipt.operationId!==operationId||snapshot.project!.manuscripts[chapterId]!==text||workspace.reconcile(operationId)?.operationId!==operationId)throw new Error('Durable save/receipt validation failed.');persist();
  }
  record('snapshot',queryTimes,'Complete backend snapshot with all stored hashes and immutable history validation.');record('chapter-and-filter-computation',contextTimes,'Pure ordering/filter computation on loaded records; excludes DOM rendering.');record('durable-save',saveTimes,'Durable chapter mutation and validated response snapshot; excludes IPC and UI.');persist();
  const settings=new SettingsStorage(profile,fn=>coordinator!.settingsGate(fn)),saved=settings.get();settings.save({...saved,backupDestination:path.join(root,'output')},saved.recordVersion);
  if(includeProtection){
   const service=new ProtectionService(workspace,settings,profile,coordinator);
   for(const operation of ['revision','backup','txt','md','docx','pdf','sqlite'] as const){
    console.log(JSON.stringify({event:'start',operation}));const start=performance.now(),requestId=randomUUID();
    if(operation==='revision')await service.execute({protocolVersion:1,requestId,command:'protection.capture',owner,reason:'Manual'});
    else if(operation==='backup')await service.execute({protocolVersion:1,requestId,command:'protection.backup',owner,reason:'Manual',chooseLocation:false,closing:false,nativeBackupFolder:path.join(root,'output')});
    else await service.execute({protocolVersion:1,requestId,command:'protection.export',owner,format:operation,storyId:operation==='sqlite'?null:corpus.storyIds[0],chapterIds:null,nativeRuntime:path.resolve('resources/libreoffice/program/soffice'),nativeDestination:{path:path.join(root,'output','measured.'+operation),expectedHash:null}});
    record(operation,[performance.now()-start],'Single production backend/converter sample; repeated reference-machine and installed acceptance remain required.');persist();
   }
  }
  for(const [file,digest] of originalHistoryFiles)if(hash(fs.readFileSync(file))!==digest)throw new Error('Original historical payload changed: '+file);
  report.historyPreserved=true;report.sizes={project:tree(path.join(root,'project')),universe:tree(path.join(root,'universe')),history:{project:tree(path.join(root,'project/history')),universe:tree(path.join(root,'universe/history'))},outputs:tree(path.join(root,'output')),originalHistoryFiles:originalHistoryFiles.size,originalHistoryDigest:beforeHistory};report.status='backend-probe-complete';
 }catch(error){report.status='failed';report.error=error instanceof Error?error.stack??error.message:String(error);throw error;}finally{try{projects?.close();universes?.close();}finally{coordinator?.close();persist();}}
 return report;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const args=process.argv.slice(2),root=args.find(a=>a.startsWith('--root='))?.slice(7),output=args.find(a=>a.startsWith('--output='))?.slice(9);if(!root||!output)throw new Error('Provide --root=<generated temporary fixture> and --output=<JSON evidence file>.');void measureCorpus(root,path.resolve(output),Number(args.find(a=>a.startsWith('--runs='))?.slice(7)??'3'),!args.includes('--without-protection')).catch(error=>{console.error(error);process.exitCode=1;});}
