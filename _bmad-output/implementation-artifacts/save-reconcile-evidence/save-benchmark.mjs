import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {randomUUID} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {DatabaseSync} from 'node:sqlite';
import ts from '../../../node_modules/typescript/lib/typescript.js';
import {WorkspaceStore as CurrentStore} from '../../../src/infrastructure/workspace-storage.ts';
import {FileUniverseStorage} from '../../../src/infrastructure/universe-storage.ts';
import {FileProjectStorage} from '../../../src/infrastructure/project-storage.ts';
import {WorkspaceCoordinator} from '../../../src/infrastructure/workspace-coordinator.ts';
import {WorkspaceApplication} from '../../../src/application/workspace.ts';
import {UniverseApplication} from '../../../src/application/universe.ts';
import {ProjectApplication} from '../../../src/application/project.ts';
import {createRecord} from '../../../src/presentation/workspace/model.ts';
import {canonical,hash,jsonBytes} from '../../../src/infrastructure/universe-files.ts';
const sourceRoot=path.resolve(import.meta.dirname,'../../../src/infrastructure');
const original=fs.readFileSync('/tmp/writingtool-workspace-storage-baseline.ts','utf8').replace(/from (['"])(\.[^'"]+)\1/g,(_all,_quote,target)=>'from '+JSON.stringify(path.resolve(sourceRoot,target)+'.ts'));
fs.writeFileSync('/tmp/writingtool-workspace-storage-baseline.mjs',ts.transpileModule(original,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
const {WorkspaceStore:BaselineStore}=await import('/tmp/writingtool-workspace-storage-baseline.mjs');
const mode=process.argv.includes('--baseline')?'baseline':'optimized',Store=mode==='baseline'?BaselineStore:CurrentStore;
const results=[];
for(const history of [0,100,500,1000]){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-save-benchmark-'));
 for(const directory of ['profile','universe','project'])fs.mkdirSync(path.join(root,directory));
 const coordinator=new WorkspaceCoordinator(path.join(root,'profile'));
 const universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator));
 const projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);
 const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:value=>hash(canonical(value)),textDigest:hash,byteLength:text=>Buffer.byteLength(text).toString()});
 try{
 universes.create(path.join(root,'universe'),{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Benchmark',description:''}});
 projects.create(path.join(root,'project'),path.join(root,'universe'),{operationId:randomUUID()});
 for(const store of [projects.workspaceAuthority(),universes.workspaceAuthority()])Object.setPrototypeOf(store,Store.prototype);
 let snapshot=workspace.snapshot();
 const story=createRecord(snapshot,'story');story.data.title='Benchmark story';
 const chapter=createRecord(snapshot,'chapter',story.id);chapter.data.title='Benchmark chapter';
 const put=(record,text=null,version=null)=>({action:'put',record,expectedRecordVersion:version,manuscript:text});
 workspace.mutate({operationId:randomUUID(),submittedEditorRevision:'1',units:[{owner:snapshot.project.owner,expectedUnitGeneration:snapshot.project.generation,changes:[put(story),put(chapter,'')]}]});
 snapshot=workspace.snapshot();
 const live=snapshot.project.records.find(record=>record.id===chapter.id);
 // Synthetic fixture construction only: valid immutable historical bytes and index rows.
 const db=new DatabaseSync(path.join(root,'project/database/catalog.sqlite'));
 db.exec('BEGIN IMMEDIATE');
 const insert=db.prepare('INSERT INTO workspace_versions VALUES(?,?,?,?,?)');
 for(let i=0;i<history;i++){
  const old=structuredClone(live);old.recordVersion=randomUUID();old.data.formatting.recordVersion=old.recordVersion;
  const jsonPath=`history/objects/${old.recordVersion}/chapters/${old.id}.json`,textPath=`history/objects/${old.recordVersion}/chapters/${old.id}.wrt`;
  fs.mkdirSync(path.dirname(path.join(root,'project',jsonPath)),{recursive:true});
  fs.writeFileSync(path.join(root,'project',jsonPath),jsonBytes(old));fs.writeFileSync(path.join(root,'project',textPath),'');
  insert.run(old.recordVersion,old.id,'chapter',jsonPath,textPath);
 }
 db.exec('COMMIT');db.close();
 const samples=[];
 for(let attempt=0;attempt<3;attempt++){
  snapshot=workspace.snapshot();const record=structuredClone(snapshot.project.records.find(record=>record.id===chapter.id));
  const text=`Saved benchmark draft ${attempt}`;record.data.formatting.paragraphs[0].end=String(text.length);
  const input={operationId:randomUUID(),submittedEditorRevision:String(attempt+2),units:[{owner:snapshot.project.owner,expectedUnitGeneration:snapshot.project.generation,changes:[put(record,text,record.recordVersion)]}]};
  const stages={};const store=projects.workspaceAuthority(),wrapped=[];
  for(const method of ['prepare','publish','apply','finalize']){
   const fn=store[method];store[method]=function(...args){const start=performance.now();try{return fn.apply(this,args);}finally{stages[method]=(stages[method]??0)+performance.now()-start;}};wrapped.push([method,fn]);
  }
  const start=performance.now();workspace.mutate(input);const mutateMs=performance.now()-start;
  const replyStart=performance.now();const saved=workspace.snapshot();universes.current();const responseMs=performance.now()-replyStart;
  if(saved.project.manuscripts[chapter.id]!==text)throw new Error('Save verification failed');
  for(const [method,fn]of wrapped)store[method]=fn;
  samples.push({saveMs:mutateMs+responseMs,mutateMs,responseMs,stages});
 }
 const rounded=value=>Number(value.toFixed(2));
 results.push({mode,historyVersions:history,samples:samples.map(s=>({saveMs:rounded(s.saveMs),mutateMs:rounded(s.mutateMs),responseMs:rounded(s.responseMs),stages:Object.fromEntries(Object.entries(s.stages).map(([k,v])=>[k,rounded(v)]))}))});
 console.log(JSON.stringify(results.at(-1)));
 }finally{projects.close();universes.close();coordinator.close();fs.rmSync(root,{recursive:true,force:true});}
}
fs.writeFileSync(`/tmp/writingtool-save-${mode}.json`,JSON.stringify({node:process.version,scope:'Temporary synthetic stores; one story/chapter, empty historical text, three durable saves including response snapshot and native-context universe read',results},null,2)+'\n');
