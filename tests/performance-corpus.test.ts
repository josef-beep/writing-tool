import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {inflateSync,crc32} from 'node:zlib';
import {generateCorpus,corpusCounts,corpusImage} from '../scripts/generate-performance-corpus.mjs';
import {measureCorpus} from '../scripts/measure-performance-corpus.mjs';
import {UniverseApplication} from '../src/application/universe';
import {ProjectApplication} from '../src/application/project';
import {WorkspaceApplication} from '../src/application/workspace';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage';
import {FileProjectStorage} from '../src/infrastructure/project-storage';
import {WorkspaceStore} from '../src/infrastructure/workspace-storage';
import {WorkspaceCoordinator} from '../src/infrastructure/workspace-coordinator';
import {canonical,hash} from '../src/infrastructure/universe-files';
import {randomUUID} from 'node:crypto';

test('approved workload counts scale exactly and generated images contain distinct valid RGB pixels',()=>{
 const base=corpusCounts(1),growth=corpusCounts(10);
 for(const key of ['stories','chapters','events','characters','factions','decisions','images','volumes'] as const)assert.equal(growth[key],base[key]*10);
 assert.equal(base.chapters*base.wordsPerChapter,250000);
 const image=corpusImage(1,16,16);assert.notDeepEqual(image,corpusImage(2,16,16));
 let cursor=8,idat:Buffer|undefined;
 while(cursor<image.length){const length=image.readUInt32BE(cursor),kind=image.toString('ascii',cursor+4,cursor+8),data=image.subarray(cursor+8,cursor+8+length);assert.equal(image.readUInt32BE(cursor+8+length),crc32(image.subarray(cursor+4,cursor+8+length)));if(kind==='IDAT')idat=data;cursor+=length+12;}
 assert.ok(idat);const rows=inflateSync(idat);assert.equal(rows.length,16*(16*3+1));for(let row=0;row<16;row++)assert.equal(rows[row*(16*3+1)],0);
});

test('seeded isolated corpus opens through production validators with exact ownership, text, assets and history',async t=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-corpus-test-')),root=path.join(parent,'corpus');
 t.after(()=>fs.rmSync(parent,{recursive:true,force:true}));
 const manifest=generateCorpus(root,1,true);assert.equal(manifest.words,200);assert.throws(()=>generateCorpus(root,1,true),/EEXIST/);
 const coordinator=new WorkspaceCoordinator(path.join(root,'profile')),universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator)),projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);
 const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:v=>hash(canonical(v)),textDigest:hash,byteLength:text=>String(Buffer.byteLength(text))});
 try{
  const opened=projects.open(path.join(root,'project'));assert.equal(opened.universe.ownerId,manifest.universeIdentity.ownerId);
  const before=workspace.snapshot();assert.equal(before.project?.records.filter(r=>r.recordType==='chapter').length,4);assert.equal(before.universe?.records.filter(r=>r.recordType==='event').length,12);assert.equal(before.universe?.assets.length,2);
  assert.equal(Object.values(before.project!.manuscripts).reduce((n,text)=>n+text.trim().split(/\s+/u).length,0),200);
  const chapter=structuredClone(before.project!.records.find(r=>r.recordType==='chapter')!);assert.equal(chapter.recordType,'chapter');
  const text=before.project!.manuscripts[chapter.id];workspace.mutate({operationId:randomUUID(),submittedEditorRevision:'1',units:[{owner:before.project!.owner,expectedUnitGeneration:before.project!.generation,changes:[{action:'put',record:chapter,expectedRecordVersion:chapter.recordVersion,manuscript:text}]}]});
  projects.close();universes.close();projects.open(path.join(root,'project'));const reopened=workspace.snapshot();assert.equal(reopened.project!.manuscripts[chapter.id],text);assert.equal(reopened.universe!.assets.length,2);
 }finally{projects.close();universes.close();coordinator.close();}
 const measured=await measureCorpus(root,path.join(parent,'measurement.json'),1,false);assert.equal(measured.status,'backend-probe-complete');assert.equal(measured.historyPreserved,true);assert.equal(measured.measurements.find(m=>m.operation==='durable-save')?.samplesMs.length,1);assert.equal(measured.referenceMachineMatches,false);
});


test('workspace snapshots read each unit once and reject later corruption without reusing prior content',t=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-read-bundle-')),root=path.join(parent,'corpus');generateCorpus(root,1,true);
 const coordinator=new WorkspaceCoordinator(path.join(root,'profile')),universes=new UniverseApplication(new FileUniverseStorage(undefined,coordinator)),projects=new ProjectApplication(new FileProjectStorage(coordinator),universes);
 const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:v=>hash(canonical(v)),textDigest:hash,byteLength:text=>String(Buffer.byteLength(text))});
 t.after(()=>{try{projects.close();universes.close();}finally{coordinator.close();fs.rmSync(parent,{recursive:true,force:true});}});
 projects.open(path.join(root,'project'));
 const original=WorkspaceStore.prototype.snapshot,counts=new Map<string,number>();
 WorkspaceStore.prototype.snapshot=function(){counts.set(this.location,(counts.get(this.location)??0)+1);return original.call(this);};
 try{
  const snapshot=workspace.snapshot();assert.equal(counts.get(path.join(root,'project')),1);assert.equal(counts.get(path.join(root,'universe')),1);
  counts.clear();assert.equal(workspace.location(snapshot.project!.owner),path.join(root,'project'));assert.equal(workspace.location(snapshot.universe!.owner),path.join(root,'universe'));assert.equal(counts.size,0);
  const chapter=snapshot.project!.records.find(r=>r.recordType==='chapter')!;
  const cases=[path.join(root,'project/chapters',chapter.id+'.wrt'),path.join(root,'project/chapters',chapter.id+'.json'),path.join(root,'universe/profiles',snapshot.universe!.owner.id+'.json'),path.join(root,'project/projects',snapshot.project!.owner.id+'.json'),path.join(root,'universe/images',snapshot.universe!.assets[0].id+'.png')];
  const history=(folder:string):string=>{for(const e of fs.readdirSync(folder,{withFileTypes:true})){const f=path.join(folder,e.name);if(e.isDirectory())return history(f);if(e.isFile())return f;}throw new Error('Missing fixture history.');};
  cases.push(history(path.join(root,'project/history/objects')),history(path.join(root,'universe/history/objects')));
  for(const file of cases){const bytes=fs.readFileSync(file);try{fs.writeFileSync(file,Buffer.concat([bytes,Buffer.from('altered')]));assert.throws(()=>workspace.snapshot(),file);assert.deepEqual(fs.readFileSync(file),Buffer.concat([bytes,Buffer.from('altered')]));}finally{fs.writeFileSync(file,bytes);}assert.ok(workspace.snapshot().project);}
 }finally{WorkspaceStore.prototype.snapshot=original;}
});
