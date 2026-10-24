import test, {type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {randomUUID} from 'node:crypto';
import {LocateProjectUniverse,ProjectApplication} from '../src/application/project';
import {UniverseApplication, UniverseFailure} from '../src/application/universe';
import {validProjectResult} from '../src/application/contracts/project';
import {FileProjectStorage} from '../src/infrastructure/project-storage';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage';

function fixture(t: TestContext) {
    const root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-project-'));
    const universe=path.join(root,'universe'),project=path.join(root,'project');
    fs.mkdirSync(universe);fs.mkdirSync(project);
    const universes=new UniverseApplication(new FileUniverseStorage());
    const projects=new ProjectApplication(new FileProjectStorage(),universes);
    t.after(()=>{projects.close();universes.close();fs.rmSync(root,{recursive:true,force:true});});
    const createUniverse=()=>universes.create(universe,{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Project fixture',description:''}});
    return {universe,project,universes,projects,createUniverse};
}

test('a universe preflight failure never leaves project creation uncertain or writes the project folder',t=>{
    const f=fixture(t);
    assert.throws(()=>f.projects.create(f.project,f.universe,{operationId:randomUUID()}),error=>
        error instanceof UniverseFailure&&error.outcome==='not-committed'&&error.message.startsWith('No project was created.'));
    assert.deepEqual(fs.readdirSync(f.project),[]);
    assert.equal(f.projects.current(),null);
    f.createUniverse();
    assert.equal(f.projects.create(f.project,f.universe,{operationId:randomUUID()}).snapshot.universe.location,f.universe);
});

test('successful project creation and reopen satisfy the transport contract',t=>{
    const f=fixture(t);f.createUniverse();
    const input={operationId:randomUUID()},request={protocolVersion:1 as const,requestId:randomUUID(),command:'project.create' as const,input};
    const created=f.projects.create(f.project,f.universe,input);
    const {input:_input,...responseBase}=request;
    assert.equal(validProjectResult({...responseBase,status:'ok',...created},request),true);
    f.projects.close();
    const snapshot=f.projects.open(f.project);
    assert.equal(snapshot.ownerId,created.snapshot.ownerId);
    assert.equal(snapshot.universeLocation,f.universe);
});

test('an activation failure after durable creation retains its committed outcome and can be reopened',t=>{
    const f=fixture(t);f.createUniverse();
    const stage=f.universes.stage.bind(f.universes);
    f.universes.stage=(...args)=>({...stage(...args),commit:()=>{throw new Error('Lost activation acknowledgment');}});
    const operationId=randomUUID();
    assert.throws(()=>f.projects.create(f.project,f.universe,{operationId}),error=>
        error instanceof UniverseFailure&&error.outcome==='committed');
    assert.equal(fs.existsSync(path.join(f.project,'writingtool.json')),true);
    f.universes.stage=stage;
    assert.equal(f.projects.open(f.project,undefined,operationId).creationOperationId,operationId);
});


test('projects sharing one universe reuse its authority and new project creation adds no future feature tables',t=>{
 const f=fixture(t),u=f.createUniverse().snapshot,workspace=f.universes.workspaceAuthority();
 const first=f.projects.create(f.project,f.universe,{operationId:randomUUID()}).snapshot;
 const secondPath=path.join(path.dirname(f.project),'second');fs.mkdirSync(secondPath);
 const second=f.projects.create(secondPath,f.universe,{operationId:randomUUID()}).snapshot;
 assert.notEqual(first.ownerId,second.ownerId);assert.equal(second.universe.ownerId,u.ownerId);assert.equal(f.universes.workspaceAuthority(),workspace);
 f.projects.open(f.project);assert.equal(f.universes.workspaceAuthority(),workspace);
 const db=new DatabaseSync(path.join(f.project,'database/catalog.sqlite'),{readOnly:true});
 try{assert.deepEqual(db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(r=>r.name),['committed_operations','records','root_locations','unit_meta','universe_locations']);const rows=db.prepare('SELECT relativePath FROM records').all();assert.equal(rows.length,1);assert.equal(rows[0].relativePath,'projects/'+first.ownerId+'.json');}finally{db.close();}
});

test('moving a project changes only its base binding while permanent IDs and relative payloads survive',t=>{
 const f=fixture(t);f.createUniverse();const before=f.projects.create(f.project,f.universe,{operationId:randomUUID()}).snapshot;
 f.projects.close();const moved=path.join(path.dirname(f.project),'moved-project');fs.renameSync(f.project,moved);
 const dbBefore=new DatabaseSync(path.join(moved,'database/catalog.sqlite'),{readOnly:true});let prior:Record<string,unknown[]>;
 try{prior=Object.fromEntries(['records','unit_meta','universe_locations','committed_operations'].map(table=>[table,dbBefore.prepare('SELECT * FROM '+table).all()]));}finally{dbBefore.close();}
 const bytes=fs.readFileSync(path.join(moved,'projects',before.ownerId+'.json')),after=f.projects.open(moved);assert.equal(after.ownerId,before.ownerId);assert.equal(after.rootId,before.rootId);assert.equal(after.recordVersion,before.recordVersion);assert.equal(after.universeId,before.universeId);assert.equal(after.location,moved);assert.deepEqual(fs.readFileSync(path.join(moved,'projects',before.ownerId+'.json')),bytes);
 const db=new DatabaseSync(path.join(moved,'database/catalog.sqlite'),{readOnly:true});try{for(const table of ['records','universe_locations','committed_operations'])assert.deepEqual(db.prepare('SELECT * FROM '+table).all(),prior[table]);const [oldMeta]=prior.unit_meta as Record<string,unknown>[],newMeta=db.prepare('SELECT * FROM unit_meta').get()!;assert.deepEqual({...newMeta,sessionToken:oldMeta.sessionToken},{...oldMeta});assert.equal(db.prepare('SELECT basePath FROM root_locations').get()?.basePath,moved);}finally{db.close();}
});

test('missing or wrong universe candidates preserve the prior active project until a matching moved universe is selected',t=>{
 const f=fixture(t),original=f.createUniverse().snapshot;const first=f.projects.create(f.project,f.universe,{operationId:randomUUID()}).snapshot;
 const candidatePath=path.join(path.dirname(f.project),'candidate');fs.mkdirSync(candidatePath);const candidate=f.projects.create(candidatePath,f.universe,{operationId:randomUUID()}).snapshot;
 f.projects.close();f.universes.close();const moved=path.join(path.dirname(f.universe),'moved-universe');fs.renameSync(f.universe,moved);
 assert.throws(()=>f.projects.open(candidatePath),e=>e instanceof LocateProjectUniverse&&e.universeId===original.ownerId);assert.equal(f.projects.current(),null);
 f.projects.open(f.project,moved);const held=f.universes.workspaceAuthority();
 const wrong=path.join(path.dirname(f.universe),'wrong');fs.mkdirSync(wrong);const other=new UniverseApplication(new FileUniverseStorage());other.create(wrong,{operationId:randomUUID(),submittedEditorRevision:'0',data:{name:'Wrong',description:''}});other.close();
 assert.throws(()=>f.projects.open(candidatePath,wrong),e=>e instanceof UniverseFailure&&e.code==='INTEGRITY_MISMATCH');assert.equal(f.projects.current()?.ownerId,first.ownerId);assert.equal(f.universes.workspaceAuthority(),held);
 const opened=f.projects.open(candidatePath,moved);assert.equal(opened.ownerId,candidate.ownerId);assert.equal(opened.universeId,original.ownerId);assert.equal(opened.universeLocation,moved);assert.equal(f.universes.workspaceAuthority(),held);
});

test('occupied and unsupported project roots are refused without replacing active context or unrelated files',t=>{
 const f=fixture(t);f.createUniverse();const before=f.projects.create(f.project,f.universe,{operationId:randomUUID()}).snapshot;
 const occupied=path.join(path.dirname(f.project),'occupied');fs.mkdirSync(occupied);fs.writeFileSync(path.join(occupied,'notes.txt'),'Keep these notes');
 assert.throws(()=>f.projects.create(occupied,f.universe,{operationId:randomUUID()}));assert.equal(fs.readFileSync(path.join(occupied,'notes.txt'),'utf8'),'Keep these notes');assert.equal(f.projects.current()?.ownerId,before.ownerId);
 const bad=path.join(path.dirname(f.project),'unsupported');fs.mkdirSync(bad);const descriptor=JSON.stringify({schemaVersion:999,kind:'project'});fs.writeFileSync(path.join(bad,'writingtool.json'),descriptor);
 assert.throws(()=>f.projects.open(bad));assert.equal(fs.readFileSync(path.join(bad,'writingtool.json'),'utf8'),descriptor);assert.equal(f.projects.current()?.ownerId,before.ownerId);
});
