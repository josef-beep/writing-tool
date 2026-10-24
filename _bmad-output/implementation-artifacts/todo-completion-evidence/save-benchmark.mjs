import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import ts from '../../../node_modules/typescript/lib/typescript.js';
import {WorkspaceStore} from '../../../src/infrastructure/workspace-storage.ts';
import {FileUniverseStorage} from '../../../src/infrastructure/universe-storage.ts';
import {FileProjectStorage} from '../../../src/infrastructure/project-storage.ts';
import {WorkspaceCoordinator} from '../../../src/infrastructure/workspace-coordinator.ts';
import {UniverseApplication} from '../../../src/application/universe.ts';
import {ProjectApplication} from '../../../src/application/project.ts';
import {WorkspaceApplication} from '../../../src/application/workspace.ts';
import {createRecord,putChange} from '../../../src/presentation/workspace/model.ts';
import {canonical,hash,jsonBytes} from '../../../src/infrastructure/universe-files.ts';
const revision='03687967ba70c0adf49e746b5fa3eddbce997421';
const baseline=execFileSync('git',['show',revision+':src/infrastructure/workspace-storage.ts'],{encoding:'utf8'});
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-matched-benchmark-'));
const baselineFile=path.join(temp,'baseline.mjs'),sourceRoot=path.resolve('src/infrastructure');
fs.writeFileSync(baselineFile,ts.transpileModule(baseline.replace(/from (['"])(\.[^'"]+)\1/g,(_match,_quote,target)=>'from '+JSON.stringify(path.resolve(sourceRoot,target)+'.ts')),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
const {WorkspaceStore:Baseline}=await import(baselineFile);
const treeHashes=root=>Object.fromEntries(fs.readdirSync(root,{recursive:true,withFileTypes:true}).filter(d=>d.isFile()).map(d=>{const file=path.join(d.parentPath,d.name);return[path.relative(root,file),hash(fs.readFileSync(file))];}).sort((a,b)=>a[0].localeCompare(b[0])));
function open(root,create=false){const profile=path.join(root,'profile'),coordinator=new WorkspaceCoordinator(profile),universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator)),projects=new ProjectApplication(new FileProjectStorage(coordinator),universes),workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:v=>hash(canonical(v)),textDigest:hash,byteLength:t=>Buffer.byteLength(t).toString()});
 if(create){universes.create(path.join(root,'universe'),{operationId:randomUUID(),submittedEditorRevision:'0',data:{name:'Matched benchmark',description:''}});projects.create(path.join(root,'project'),path.join(root,'universe'),{operationId:randomUUID()});}else projects.open(path.join(root,'project'),path.join(root,'universe'));
 return{universes,projects,workspace,close(){projects.close();universes.close();coordinator.close();}};
}
const results=[];
for(const history of [0,100,500,1000]){
 const root=path.join(temp,'fixture-'+history),seed=root+'-seed';fs.mkdirSync(root);for(const d of ['profile','universe','project'])fs.mkdirSync(path.join(root,d));
 let app=open(root,true),chapterId;
 try{let before=app.workspace.snapshot();const story=createRecord(before,'story');story.data.title='Matched story';const chapter=createRecord(before,'chapter',story.id);chapterId=chapter.id;chapter.data.title='Matched chapter';
 app.workspace.mutate({operationId:randomUUID(),submittedEditorRevision:'1',units:[{owner:before.project.owner,expectedUnitGeneration:before.project.generation,changes:[putChange(before,story,null),putChange(before,chapter,'')]}]});
 const live=app.workspace.snapshot().project.records.find(r=>r.id===chapterId),db=new DatabaseSync(path.join(root,'project/database/catalog.sqlite'));db.exec('BEGIN IMMEDIATE');const insert=db.prepare('INSERT INTO workspace_versions VALUES(?,?,?,?,?)');
 for(let i=0;i<history;i++){const old=structuredClone(live),text=`Historical ${i}: café 🌍 immutable text.`;old.recordVersion=randomUUID();old.data.formatting.recordVersion=old.recordVersion;old.data.formatting.text={...old.data.formatting.text,sha256:hash(text),byteLength:String(Buffer.byteLength(text)),scalarLength:String(Array.from(text).length)};old.data.formatting.paragraphs=[{id:randomUUID(),start:'0',end:String(Array.from(text).length),indent:'1',kind:'body',marks:[]}];const jsonPath=`history/objects/${old.recordVersion}/chapters/${old.id}.json`,textPath=jsonPath.replace(/\.json$/,'.wrt');fs.mkdirSync(path.dirname(path.join(root,'project',jsonPath)),{recursive:true});fs.writeFileSync(path.join(root,'project',jsonPath),jsonBytes(old));fs.writeFileSync(path.join(root,'project',textPath),text);insert.run(old.recordVersion,old.id,'chapter',jsonPath,textPath);}
 db.exec('COMMIT');db.close();}finally{app.close();}
 fs.cpSync(root,seed,{recursive:true});const seedHash=hash(canonical(treeHashes(seed))),historyHashes=fs.existsSync(path.join(root,'project/history'))?treeHashes(path.join(root,'project/history')):{};
 const operations=Array.from({length:3},()=>randomUUID());
 for(const [mode,Store]of [['baseline',Baseline],['current',WorkspaceStore]]){
 fs.rmSync(root,{recursive:true});fs.cpSync(seed,root,{recursive:true});if(hash(canonical(treeHashes(root)))!==seedHash)throw new Error('Fixture bytes differ');app=open(root);
 try{for(const store of [app.projects.workspaceAuthority(),app.universes.workspaceAuthority()])Object.setPrototypeOf(store,Store.prototype);const samples=[];
 for(let attempt=0;attempt<3;attempt++){const before=app.workspace.snapshot(),record=structuredClone(before.project.records.find(r=>r.id===chapterId)),text=`Saved matched draft ${attempt} café 🌍`;record.data.formatting.paragraphs[0].end=String(Array.from(text).length);const input={operationId:operations[attempt],submittedEditorRevision:String(attempt+2),units:[{owner:before.project.owner,expectedUnitGeneration:before.project.generation,changes:[putChange(before,record,text)]}]};const start=performance.now(),receipt=app.workspace.mutate(input);const after=app.workspace.snapshot();app.universes.current();const ms=performance.now()-start;if(after.project.manuscripts[chapterId]!==text||after.project.records.find(r=>r.id===chapterId).data.formatting.recordVersion!==after.project.records.find(r=>r.id===chapterId).recordVersion||receipt.operationId!==input.operationId)throw new Error('Matched save or receipt failed');samples.push({saveMs:ms,operationId:input.operationId,textHash:hash(text),generation:after.project.generation});}
 const afterHistory=fs.existsSync(path.join(root,'project/history'))?treeHashes(path.join(root,'project/history')):{};for(const [file,digest]of Object.entries(historyHashes))if(afterHistory[file]!==digest)throw new Error('Immutable history changed');app.close();app=open(root);const reopened=app.workspace.snapshot();if(reopened.project.manuscripts[chapterId]!=='Saved matched draft 2 café 🌍')throw new Error('Reopen lost saved text');const final=reopened.project.records.find(r=>r.id===chapterId);if(final.data.formatting.text.sha256!==hash(reopened.project.manuscripts[chapterId]))throw new Error('Reopen formatting mismatch');const result={mode,historyVersions:history,fixtureHash:seedHash,historyHash:hash(canonical(historyHashes)),historyFiles:Object.keys(historyHashes).length,samples,reopenVerified:true,historyVerified:true};results.push(result);console.log(JSON.stringify(result));
 }finally{app.close();}
 }
}
const summary={scope:'Byte-identical synthetic stores restored at the same path for each version; three durable saves with response snapshots; immutable history and reopened pairs verified',baselineRevision:revision,baselineStorageSha256:hash(baseline),currentRevision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),currentStorageSha256:hash(fs.readFileSync('src/infrastructure/workspace-storage.ts')),environment:{node:process.version,platform:process.platform,arch:process.arch,cpus:os.cpus()[0]?.model,cpuCount:os.cpus().length,memoryBytes:os.totalmem(),kernel:os.release()},fixtureRoot:temp,results};
fs.writeFileSync(new URL('./save-performance.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
