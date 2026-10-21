import test, {type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {ProjectApplication} from '../src/application/project';
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
