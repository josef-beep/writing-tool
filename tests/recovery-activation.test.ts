import test,{type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {activationRootAt,activationDestinationAvailable,validActivationDecision,relocateActivationParticipant,type ActivationParticipant,type ActivationDecision} from '../src/infrastructure/recovery-activation';

function fixture(t:TestContext){
 const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'writingtool-activation-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const folder=(name:string)=>{const location=path.join(root,name);fs.mkdirSync(location,{recursive:true});return location;};
 const participant=(kind:'project'|'universe'):ActivationParticipant=>({owner:{kind,id:randomUUID()},rootId:randomUUID(),stage:folder('stage-'+kind),destination:folder('published-'+kind)});
 const writeIdentity=(location:string,p:ActivationParticipant)=>fs.writeFileSync(path.join(location,'writingtool.json'),JSON.stringify({schemaVersion:1,kind:p.owner.kind,id:p.owner.id,rootId:p.rootId,creationOperationId:randomUUID()}));
 const decision=(participants:ActivationParticipant[]):ActivationDecision=>({schemaVersion:2,requestId:randomUUID(),proposalId:randomUUID(),manifestId:randomUUID(),operationId:randomUUID(),state:'commit',participants,locations:{project:participants.find(p=>p.owner.kind==='project')?.destination??null,universe:participants.find(p=>p.owner.kind==='universe')?.destination??folder('live-universe')}});
 return{root,folder,participant,writeIdentity,decision};
}

test('an empty leftover destination does not hide a moved recovery participant',t=>{
 const f=fixture(t),p=f.participant('project'),emptyDestination=p.destination;f.writeIdentity(p.stage,p);
 const relocated=path.join(f.root,'moved-project');fs.renameSync(p.stage,relocated);
 assert.equal(activationRootAt(p.stage,p),null);
 assert.equal(activationRootAt(p.destination,p),null);
 assert.equal(activationRootAt(relocated,p),relocated);
 const decision=f.decision([p]);decision.participants[0].destination=relocated;decision.locations.project=relocated;
 assert.equal(validActivationDecision(decision),true);
 assert.deepEqual(fs.readdirSync(emptyDestination),[]);
});

test('a partially published recovery can locate the remaining moved stage independently',t=>{
 const f=fixture(t),project=f.participant('project'),universe=f.participant('universe');
 f.writeIdentity(project.stage,project);f.writeIdentity(universe.stage,universe);
 fs.rmdirSync(universe.destination);fs.renameSync(universe.stage,universe.destination);
 const relocated=path.join(f.root,'moved-stage');fs.renameSync(project.stage,relocated);
 assert.equal(activationRootAt(universe.destination,universe),universe.destination);
 assert.equal(activationRootAt(universe.stage,universe),null);
 assert.equal(activationRootAt(project.stage,project),null);
 assert.equal(activationRootAt(project.destination,project),null);
 assert.equal(activationRootAt(relocated,project),relocated);
 const selected=f.folder('replacement-publication');
 assert.equal(activationDestinationAvailable(selected,relocated),true);
 const decision=f.decision([project,universe]);project.stage=relocated;project.destination=selected;decision.locations.project=selected;
 assert.equal(validActivationDecision(decision),true);
});

test('a moved publication parent requires a new empty folder and preserves occupied output',t=>{
 const f=fixture(t),p=f.participant('project');f.writeIdentity(p.stage,p);
 const missing=path.join(f.root,'missing-parent','project');
 assert.equal(activationDestinationAvailable(missing,p.stage),false);
 fs.writeFileSync(path.join(p.destination,'unrelated.txt'),'preserve this');
 assert.equal(activationDestinationAvailable(p.destination,p.stage),false);
 const selected=f.folder('new-publication');
 assert.equal(activationDestinationAvailable(selected,p.stage),true);
 assert.equal(fs.readFileSync(path.join(p.destination,'unrelated.txt'),'utf8'),'preserve this');
});

test('uncertain authority evidence and conflicting owner identities block relocation',t=>{
 const f=fixture(t),p=f.participant('universe');
 fs.mkdirSync(path.join(p.stage,'database'));
 assert.throws(()=>activationRootAt(p.stage,p),/unreadable authority evidence/);
 f.writeIdentity(p.stage,{...p,rootId:randomUUID()});
 assert.throws(()=>activationRootAt(p.stage,p),/conflicting permanent owner identity/);
 const foreign={...p,owner:{...p.owner,id:randomUUID()},rootId:randomUUID()};
 f.writeIdentity(p.stage,foreign);
 assert.equal(activationRootAt(p.stage,p),null);
 assert.equal(activationRootAt(p.stage,foreign),p.stage);
});

test('publication never nests owning roots, staging roots or the live coordinated universe',t=>{
 const f=fixture(t),project=f.participant('project'),universe=f.participant('universe'),decision=f.decision([project,universe]);
 assert.equal(validActivationDecision(decision),true);
 const nested=structuredClone(decision);nested.participants[0].destination=path.join(universe.destination,'Project');nested.locations.project=nested.participants[0].destination;
 assert.equal(validActivationDecision(nested),false);
 const coordinated=f.decision([project]);coordinated.state='await-coordinator';
 assert.equal(validActivationDecision(coordinated),true);
 coordinated.locations.universe=path.dirname(project.stage);
 assert.equal(validActivationDecision(coordinated),false);
});

test('a moved remaining commit-stage requires an explicit empty destination and remains staged',t=>{
 const f=fixture(t),p=f.participant('project');f.writeIdentity(p.stage,p);
 const location=path.join(f.root,'moved-remaining');fs.renameSync(p.stage,location);
 const selected={owner:p.owner,rootId:p.rootId,location};
 assert.throws(()=>relocateActivationParticipant(p,'commit',selected),/empty publication destination/);
 const destination=f.folder('selected-output');
 const relocated=relocateActivationParticipant(p,'commit',{...selected,destination});
 assert.equal(relocated.stage,location);assert.equal(relocated.destination,destination);
 assert.equal(activationRootAt(relocated.stage,p),location);assert.equal(activationRootAt(destination,p),null);
 fs.writeFileSync(path.join(destination,'unrelated'),'preserve');
 assert.throws(()=>relocateActivationParticipant(p,'commit',{...selected,destination}),/empty publication destination/);
 assert.equal(fs.readFileSync(path.join(destination,'unrelated'),'utf8'),'preserve');
});

test('ambiguous original roots and invalid native path bytes cannot rebind activation',t=>{
 const f=fixture(t),p=f.participant('universe');f.writeIdentity(p.stage,p);f.writeIdentity(p.destination,p);
 assert.throws(()=>relocateActivationParticipant(p,'commit',{owner:p.owner,rootId:p.rootId,location:p.stage,destination:f.folder('other')}),/Both recovery locations/);
 for(const invalid of [p.stage+'\0ignored',p.stage+'\uD800']){
  assert.throws(()=>activationRootAt(invalid,p),/path bytes/);
  assert.throws(()=>activationDestinationAvailable(invalid,p.stage),/path bytes/);
  assert.throws(()=>relocateActivationParticipant(p,'commit',{owner:p.owner,rootId:p.rootId,location:invalid}),/path bytes/);
 }
});

test('an identity-proven completed publication may move without becoming a new stage',t=>{
 const f=fixture(t),p=f.participant('universe');f.writeIdentity(p.destination,p);
 const location=path.join(f.root,'moved-published');fs.renameSync(p.destination,location);
 const relocated=relocateActivationParticipant(p,'complete',{owner:p.owner,rootId:p.rootId,location});
 assert.equal(relocated.stage,p.stage);assert.equal(relocated.destination,location);
 assert.throws(()=>relocateActivationParticipant(p,'complete',{owner:p.owner,rootId:p.rootId,location,destination:f.folder('extra')}),/published activation/);
});
