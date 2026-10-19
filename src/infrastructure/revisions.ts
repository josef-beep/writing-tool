import {resolveCapturedState,validateCapturedState,type CapturedState,type CaptureObjectReader} from './captured-state';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Owner} from '../domain/workspace';
import type {WorkspaceApplication} from '../application/workspace';
import type {WorkspaceCapture} from '../application/contracts/workspace-ports';
import type {RevisionManifest,ObjectRef,CapturedUnit} from '../application/contracts/protection';
import {captureTime} from '../domain/capture-time';
import {validRevisionManifest} from '../application/contracts/protection';
import {isUuid} from '../domain/validation';
import {canonical,decode,hash,jsonBytes,ensureManagedDirectory,publishManagedBytes,readManaged,removeManagedBytes} from './universe-files';
export const ownerKey=(o:Owner)=>`${o.kind}/${o.id}`;
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
export function safeRelative(p:string):boolean{return typeof p==='string'&&p.length>0&&!p.startsWith('/')&&!p.split('/').some(s=>!s||s==='.'||s==='..'||/[\\\0:\x00-\x1f]/.test(s)||/[. ]$/.test(s)||/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s));}
export const validRevision=validRevisionManifest;
/** Complete manifests point to immutable saved bytes, never to current-file replay. */
export class RevisionStorage{
 constructor(private workspace:WorkspaceApplication,readonly rootFor:(owner:Owner)=>string){}
 private base(owner:Owner){const root=this.rootFor(owner);ensureManagedDirectory(root,'history/protection/manifests');ensureManagedDirectory(root,'history/protection/objects');return root;}
 list(owner:Owner):RevisionManifest[]{const root=this.base(owner);return fs.readdirSync(path.join(root,'history/protection/manifests')).map(name=>{if(!/^[a-f0-9-]{36}\.json$/.test(name))throw new Error('Unrecognized retained revision evidence.');const value=decode(readManaged(root,`history/protection/manifests/${name}`));if(!validRevision(value)||ownerKey(value.owner)!==ownerKey(owner))throw new Error('Invalid retained revision manifest.');return value;}).sort((a,b)=>Date.parse(b.capturedAt)-Date.parse(a.capturedAt));}
 get(owner:Owner,id:string):RevisionManifest{if(!isUuid(id))throw new Error('Invalid revision identity.');const v=decode(readManaged(this.base(owner),`history/protection/manifests/${id}.json`));if(!validRevision(v)||ownerKey(v.owner)!==ownerKey(owner))throw new Error('Invalid complete revision.');this.validate(v);return v;}
 object(owner:Owner,ref:ObjectRef):Buffer{const bytes=readManaged(this.base(owner),`history/protection/objects/${ref.sha256}`);if(hash(bytes)!==ref.sha256||bytes.length.toString()!==ref.byteLength)throw new Error('Immutable revision payload is missing or corrupt.');return bytes;}
 putObject(owner:Owner,bytes:Buffer):ObjectRef{const root=this.base(owner),ref={sha256:hash(bytes),byteLength:bytes.length.toString()},relative=`history/protection/objects/${ref.sha256}`;if(fs.existsSync(path.join(root,relative)))this.object(owner,ref);else publishManagedBytes(root,relative,bytes,null);return ref;}
 capture(owner:Owner,reason:RevisionManifest['reason'],id:string=randomUUID()):RevisionManifest{if(fs.existsSync(path.join(this.base(owner),`history/protection/manifests/${id}.json`)))return this.get(owner,id);
  // This synchronous pin occurs within the utility authority's one serialized event.
  const time=captureTime(),capturedAt=time.utc,before=this.workspace.snapshot(),primary=owner.kind==='project'?before.project:before.universe;if(!primary||ownerKey(primary.owner)!==ownerKey(owner))throw new Error('Open the owning unit before capturing.');
  const captures:WorkspaceCapture[]=[this.workspace.capture(owner)];if(owner.kind==='project'){if(!before.universe)throw new Error('The matching universe authority is required.');captures.push(this.workspace.capture(before.universe.owner));}
  const units:CapturedUnit[]=captures.map(c=>({snapshot:(()=>{const {records,manuscripts:_manuscripts,...identity}=c.snapshot;return{...identity,recordIds:records.map(r=>r.id)};})(),files:c.files.map(f=>{const bytes=Buffer.from(f.base64,'base64');if(hash(bytes)!==f.sha256)throw new Error('Capture payload hash mismatch.');return{relativePath:f.relativePath,object:this.putObject(owner,bytes)};})}));
  if(canonical(before)!==canonical(this.workspace.snapshot()))throw new Error('The saved generation changed during capture.');
  const manifest:RevisionManifest={schemaVersion:1,kind:'complete-revision',id,owner,reason,capturedAt,completedAt:new Date().toISOString(),localCaptureStart:time.local,offsetMinutes:time.offsetMinutes,timeZone:time.zone,displayName:owner.kind==='project'?path.basename(this.rootFor(owner)):this.workspace.displayName(owner),universeDisplayName:this.workspace.displayName({kind:'universe',id:primary.universeId}),units,retainedRevisionIds:[]};this.validate(manifest);this.import(manifest);return manifest;
 }
 assertImportable(manifest:RevisionManifest):void{const root=this.base(manifest.owner),relative=`history/protection/manifests/${manifest.id}.json`;if(fs.existsSync(path.join(root,relative))&&!readManaged(root,relative).equals(Buffer.from(jsonBytes(manifest))))throw new Error('Revision identity/content conflict.');}
 import(manifest:RevisionManifest):void{if(!validRevision(manifest))throw new Error('Unsupported revision schema.');this.validate(manifest);this.assertImportable(manifest);const root=this.base(manifest.owner),relative=`history/protection/manifests/${manifest.id}.json`;if(!fs.existsSync(path.join(root,relative)))publishManagedBytes(root,relative,Buffer.from(jsonBytes(manifest)),null);}
 resolve(manifest:CapturedState,object:CaptureObjectReader=(owner,ref)=>this.object(owner,ref)):import('../application/contracts/workspace').WorkspaceUnitSnapshot[]{return resolveCapturedState(manifest,object);}
 validate(manifest:RevisionManifest,object:CaptureObjectReader=(owner,ref)=>this.object(owner,ref)):void{if(!validRevision(manifest))throw new Error('Invalid revision schema.');validateCapturedState(manifest,object);}

 remove(owner:Owner,id:string,protectedIds:Set<string>,retentionDays:string,manual=false):void{const m=this.get(owner,id);if(protectedIds.has(id))throw new Error('A retained capture or archive references this revision.');if(!manual&&BigInt(Date.now()-Date.parse(m.capturedAt))<BigInt(retentionDays)*86400000n)return;const relative=`history/protection/manifests/${id}.json`,root=this.base(owner);removeManagedBytes(root,relative,hash(readManaged(root,relative)));/* Objects remain until all known archive/reference evidence is available. */}
}
