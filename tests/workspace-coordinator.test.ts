import test, {type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {UniverseFailure} from '../src/application/universe';
import type {WorkspaceCommit, WorkspaceOperationRequest} from '../src/application/contracts/workspace-ports';
import type {WorkspaceReceipt} from '../src/application/contracts/workspace';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage';
import {FileProjectStorage} from '../src/infrastructure/project-storage';
import {WorkspaceCoordinator} from '../src/infrastructure/workspace-coordinator';
import {WorkspaceStore} from '../src/infrastructure/workspace-storage';
import {canonical, hash} from '../src/infrastructure/universe-files';

function fixture(t: TestContext) {
    const root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-coordinator-'));
    for(const name of ['user-data','universe','project'])fs.mkdirSync(path.join(root,name));
    const coordinator=new WorkspaceCoordinator(path.join(root,'user-data'));
    const universe=new FileUniverseStorage(undefined,coordinator).create(path.join(root,'universe'),{
        operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Coordinator fixture',description:''},
    }).store;
    const project=new FileProjectStorage(coordinator).create(path.join(root,'project'),{operationId:randomUUID()},universe.snapshot().ownerId,universe.location).store;
    t.after(()=>{try{project.releaseCandidate();universe.close();}finally{coordinator.close();fs.rmSync(root,{recursive:true,force:true});}});
    const universeWorkspace=universe.workspace;
    assert.ok(universeWorkspace instanceof WorkspaceStore);
    const stores=[project.workspace,universeWorkspace];
    const plans=stores.map(store=>{const s=store.snapshot();return{owner:s.owner,plan:{expectedGeneration:s.generation,records:s.records,manuscripts:s.manuscripts,counters:s.counters,assets:[]} satisfies WorkspaceCommit};});
    const operationId=randomUUID();
    const request:WorkspaceOperationRequest={protocolVersion:1,command:'workspace.restore',submittedEditorRevision:'0',plans};
    const digest=hash(canonical(request));
    const receipt:WorkspaceReceipt={protocolVersion:1,operationId,submittedEditorRevision:'0',units:plans.map(p=>({owner:p.owner,unitGeneration:(BigInt(p.plan.expectedGeneration)+1n).toString(),records:[]}))};
    return {root,universe,project,coordinator,stores,plans,operationId,request,digest,receipt};
}

for(const preparedCount of [0,1])test(`preparing interruption after ${preparedCount} participant journals aborts without advancing either unit`,t=>{
    const f=fixture(t),interrupted=f.stores[preparedCount],original=interrupted.prepare;
    interrupted.prepare=()=>{
        // Model the empty staging directory left between mkdir and journal publication.
        fs.mkdirSync(path.join(interrupted.location,`database/operations/${f.operationId}`),{recursive:true});
        throw new Error('Interrupted preparation');
    };
    try{assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),UniverseFailure);}
    finally{interrupted.prepare=original;}
    f.coordinator.recover(f.operationId);
    for(const [index,store] of f.stores.entries()){
        store.recover();
        assert.equal(store.snapshot().generation,f.plans[index].plan.expectedGeneration);
        assert.equal(store.receipt(f.operationId),undefined);
    }
    assert.equal(f.coordinator.receipt(f.operationId),undefined);
    assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),error=>
        error instanceof UniverseFailure&&error.code==='OPERATION_CONFLICT'&&error.outcome==='not-committed');
    // A fresh Save operation can publish the retained candidate after verified noncommit.
    const nextId=randomUUID(),nextReceipt={...f.receipt,operationId:nextId};
    assert.deepEqual(f.coordinator.commit(nextId,f.digest,f.plans,nextReceipt,f.request),nextReceipt);
});

test('a missing participant journal after the durable commit decision remains blocked',t=>{
    const f=fixture(t),first=f.stores[0],original=first.apply;
    first.apply=()=>{throw new Error('Interrupted after commit decision');};
    try{assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),UniverseFailure);}
    finally{first.apply=original;}
    const journal=path.join(first.location,`database/operations/${f.operationId}/journal.json`),bytes=fs.readFileSync(journal);
    fs.unlinkSync(journal);
    try{
        assert.throws(()=>f.coordinator.recover(f.operationId),UniverseFailure);
        assert.throws(()=>first.snapshot(),UniverseFailure);
        assert.equal(fs.existsSync(journal),false);
    }finally{fs.writeFileSync(journal,bytes);f.coordinator.recover(f.operationId);}
    assert.deepEqual(f.coordinator.receipt(f.operationId),f.receipt);
    for(const [index,store]of f.stores.entries())assert.equal(store.snapshot().generation,(BigInt(f.plans[index].plan.expectedGeneration)+1n).toString());
});

for(const preparedCount of [0,1])test(`actual universe reopen removes only aborted empty staging after ${preparedCount} preparations`,t=>{
 const f=fixture(t),interrupted=f.stores[preparedCount],original=interrupted.prepare;
 interrupted.prepare=()=>{fs.mkdirSync(path.join(interrupted.location,`database/operations/${f.operationId}`),{recursive:true});throw new Error('Interrupted preparation');};
 try{assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),UniverseFailure);}finally{interrupted.prepare=original;}
 f.coordinator.recover(f.operationId);f.project.releaseCandidate();f.universe.close();
 const reopened=new FileUniverseStorage(undefined,f.coordinator).open(path.join(f.root,'universe'));
 try{assert.equal(reopened.workspace.snapshot().generation,f.plans[1].plan.expectedGeneration);assert.equal(fs.existsSync(path.join(interrupted.location,`database/operations/${f.operationId}`)),false);}finally{reopened.close();}
});

test('fully prepared abort remains terminal when a stale commit retries its original ID',t=>{
 const f=fixture(t),first=f.stores[0],original=first.publish;
 first.publish=()=>{throw new Error('Interrupted before the commit decision');};
 try{assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),UniverseFailure);}finally{first.publish=original;}
 f.coordinator.recover(f.operationId);
 assert.equal(f.coordinator.decision(f.operationId,f.digest),'abort');
 assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),error=>error instanceof UniverseFailure&&error.code==='OPERATION_CONFLICT'&&error.outcome==='not-committed');
 assert.equal(f.coordinator.decision(f.operationId,f.digest),'abort');
 for(const [index,store]of f.stores.entries()){store.recover();assert.equal(store.snapshot().generation,f.plans[index].plan.expectedGeneration);}
});

test('unprepared nonempty evidence is preserved and prevents a completed abort',t=>{
 const f=fixture(t),interrupted=f.stores[0],original=interrupted.prepare,relative=`database/operations/${f.operationId}`;
 interrupted.prepare=()=>{fs.mkdirSync(path.join(interrupted.location,relative),{recursive:true});fs.writeFileSync(path.join(interrupted.location,relative,'unknown'),'preserve');throw new Error('Unknown preparation bytes');};
 try{assert.throws(()=>f.coordinator.commit(f.operationId,f.digest,f.plans,f.receipt,f.request),UniverseFailure);}finally{interrupted.prepare=original;}
 try{assert.throws(()=>f.coordinator.recover(f.operationId),UniverseFailure);assert.equal(fs.readFileSync(path.join(interrupted.location,relative,'unknown'),'utf8'),'preserve');}
 finally{fs.unlinkSync(path.join(interrupted.location,relative,'unknown'));f.coordinator.recover(f.operationId);for(const store of f.stores)store.recover();}
});

test('activation binding accepts a proven foreign replacement and rejects uncertain old authority',t=>{
 const f=fixture(t),identity=f.stores[0].identity(),old=f.stores[0].location,moved=old+'-moved';
 f.project.releaseCandidate();fs.renameSync(old,moved);fs.mkdirSync(old);
 fs.writeFileSync(path.join(old,'writingtool.json'),JSON.stringify({schemaVersion:1,kind:'project',id:randomUUID(),rootId:randomUUID()}));
 f.coordinator.locateActivationParticipant(identity.owner,identity.rootId,identity.universeId,moved);
 // Rebind to the old location, then leave uncertain authority bytes there.
 fs.rmSync(old,{recursive:true});fs.renameSync(moved,old);
 f.coordinator.locateActivationParticipant(identity.owner,identity.rootId,identity.universeId,old);
 fs.renameSync(old,moved);fs.mkdirSync(path.join(old,'database'),{recursive:true});
 assert.throws(()=>f.coordinator.locateActivationParticipant(identity.owner,identity.rootId,identity.universeId,moved),/unreadable authority evidence/);
});

test('activation binding accepts an old physical alias to the same relocated authority',{skip:process.platform==='win32'},t=>{
 const f=fixture(t),identity=f.stores[0].identity(),old=f.stores[0].location,moved=old+'-moved';
 f.project.releaseCandidate();fs.renameSync(old,moved);fs.symlinkSync(moved,old,'dir');
 assert.doesNotThrow(()=>f.coordinator.locateActivationParticipant(identity.owner,identity.rootId,identity.universeId,moved));
});

for(const kind of ['versions','assets'] as const)test(`retained ${kind} require exact immutable descriptors and reject removal, alteration and duplication`,t=>{
 const f=fixture(t),store=f.stores[1],base=store.prepare(f.operationId,f.digest,f.plans[1].plan,{...f.receipt,units:[f.receipt.units[1]]},f.request);
 const descriptors=Array.from({length:1000},()=>{
  const id=randomUUID(),recordVersion=randomUUID();
  return kind==='versions'?{recordVersion,recordId:id,recordType:'character',jsonPath:`history/objects/${recordVersion}/characters/${id}.json`,manuscriptPath:null}:{id,sha256:hash(id),mediaType:'image/png',relativePath:`images/${id}.png`,byteLength:'1'};
 });
 const valid=structuredClone(base);
 // Exercise the persisted-journal validator, including duplicate checks and canonical descriptor equality.
 Object.assign(valid.before,{[kind]:structuredClone(descriptors)});Object.assign(valid.after,{[kind]:structuredClone(descriptors)});
 const journalPath=path.join(store.location,`database/operations/${f.operationId}/journal.json`);
 const write=(journal:typeof base)=>{const {planDigest:_,...plan}=journal;fs.writeFileSync(journalPath,JSON.stringify({...plan,planDigest:hash(canonical(plan))}));};
 write(valid);assert.doesNotThrow(()=>store.readJournal(f.operationId));
 for(const change of ['removed','altered','duplicate'] as const){
  const journal=structuredClone(valid),rows=journal.after[kind];
  if(change==='removed')rows.pop();
  else if(change==='duplicate')rows.push(structuredClone(rows[0]) as never);
  else if(kind==='assets')journal.after.assets[0].byteLength='2';
  else{const v=journal.after.versions[0];v.recordId=randomUUID();v.jsonPath=`history/objects/${v.recordVersion}/characters/${v.recordId}.json`;}
  write(journal);assert.throws(()=>store.readJournal(f.operationId),error=>error instanceof UniverseFailure&&error.code==='INTEGRITY_MISMATCH',change);
 }
 // Descriptor order has no authority; equality is keyed by permanent identity.
 const reordered=structuredClone(valid);reordered.after[kind].reverse();write(reordered);assert.doesNotThrow(()=>store.readJournal(f.operationId));
 write(base);
});
