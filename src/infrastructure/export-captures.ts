import fs from 'node:fs';
import path from 'node:path';
import type {WorkspaceApplication} from '../application/workspace';
import type {WorkspaceCapture} from '../application/contracts/workspace-ports';
import type {WorkspaceUnitSnapshot} from '../application/contracts/workspace';
import {validProtectionRequest,type ProtectionHostRequest,type ObjectRef,type CapturedUnit} from '../application/contracts/protection';
import type {CalendarData} from '../domain/calendar';
import type {Owner} from '../domain/workspace';
import {closed,isUuid} from '../domain/validation';
import {resolveCapturedState,validateCapturedState,validCapturedState,type CapturedState} from './captured-state';
import {validateCaptureCatalogs} from './recovery';
import {canonical,decode,hash,jsonBytes,ensureManagedDirectory,publishManagedBytes,readManaged,removeManagedBytes} from './universe-files';

type ExportRequest=Extract<ProtectionHostRequest,{command:'protection.export'}>;
type ExportScope=Pick<ExportRequest,'owner'|'format'|'storyId'|'chapterIds'>;
type ExportPin={schemaVersion:1;kind:'export-capture';operationId:string;capturedAt:string;scope:ExportScope;units:CapturedUnit[]};
export type PinnedExportSource={unit:WorkspaceUnitSnapshot;calendar:CalendarData|null;catalog:Buffer;files:{relativePath:string;sha256:string}[];capturedAt:string};
const scopeOf=({owner,format,storyId,chapterIds}:ExportRequest):ExportScope=>({owner,format,storyId,chapterIds});

/** Immutable saved-generation pins are separate from user-visible revision history. */
export class ExportCaptureStorage{
 constructor(private workspace:WorkspaceApplication,private userData:string,private gate:<T>(fn:()=>T)=>T){
  ensureManagedDirectory(userData,'protection/export-captures');
  ensureManagedDirectory(userData,'protection/export-objects');
 }
 private relative(id:string){if(!isUuid(id))throw new Error('Invalid export operation identity.');return `protection/export-captures/${id}.json`;}
 private parse(bytes:Buffer,id:string):ExportPin{
  const value=decode(bytes);
  if(!closed(value,['schemaVersion','kind','operationId','capturedAt','scope','units'])||value.schemaVersion!==1||value.kind!=='export-capture'||value.operationId!==id||!isUuid(value.operationId)||typeof value.capturedAt!=='string'||!Number.isFinite(Date.parse(value.capturedAt))||!closed(value.scope,['owner','format','storyId','chapterIds'])||!validProtectionRequest({protocolVersion:1,requestId:id,command:'protection.export',...value.scope})||!validCapturedState({owner:value.scope.owner as Owner,units:value.units as CapturedUnit[]}))throw new Error('The original export capture is invalid. Preserve its recovery evidence.');
  return value as ExportPin;
 }
 private bytes(ref:ObjectRef):Buffer{
  const bytes=readManaged(this.userData,`protection/export-objects/${ref.sha256}`);
  if(hash(bytes)!==ref.sha256||bytes.length.toString()!==ref.byteLength)throw new Error('The original export payload is missing or corrupt.');
  return bytes;
 }
 private object=(_owner:Owner,ref:ObjectRef)=>this.bytes(ref);
 private put(bytes:Buffer):ObjectRef{
  const ref={sha256:hash(bytes),byteLength:bytes.length.toString()},relative=`protection/export-objects/${ref.sha256}`;
  if(fs.existsSync(path.join(this.userData,relative)))this.bytes(ref);
  else publishManagedBytes(this.userData,relative,bytes,null);
  return ref;
 }
 private state(pin:ExportPin):CapturedState{return{owner:pin.scope.owner,units:pin.units};}
 private validate(pin:ExportPin){
  const state=this.state(pin);validateCapturedState(state,this.object);
  validateCaptureCatalogs(state,{resolve:captured=>resolveCapturedState(captured,this.object),object:this.object});
 }
 load(request:ExportRequest):PinnedExportSource{
  return this.gate(()=>{
   const relative=this.relative(request.requestId);let pin:ExportPin;
   if(fs.existsSync(path.join(this.userData,relative))){
    pin=this.parse(readManaged(this.userData,relative),request.requestId);
    if(canonical(pin.scope)!==canonical(scopeOf(request)))throw new Error('The export operation scope does not match its saved capture.');
   }else{
    const before=this.workspace.snapshot(),primary=request.owner.kind==='project'?before.project:before.universe;
    if(!primary||canonical(primary.owner)!==canonical(request.owner))throw new Error('Open the selected owning unit before exporting.');
    const capturedAt=new Date().toISOString(),captures:WorkspaceCapture[]=[this.workspace.capture(request.owner)];
    if(request.owner.kind==='project'){if(!before.universe)throw new Error('The matching universe is required to pin chapter order.');captures.push(this.workspace.capture(before.universe.owner));}
    const units:CapturedUnit[]=captures.map(capture=>{const {records,manuscripts:_manuscripts,...identity}=capture.snapshot;return{snapshot:{...identity,recordIds:records.map(record=>record.id)},files:capture.files.map(file=>{const bytes=Buffer.from(file.base64,'base64');if(hash(bytes)!==file.sha256)throw new Error('Export capture payload hash mismatch.');return{relativePath:file.relativePath,object:this.put(bytes)};})};});
    if(canonical(before)!==canonical(this.workspace.snapshot()))throw new Error('The saved generation changed during export capture.');
    pin={schemaVersion:1,kind:'export-capture',operationId:request.requestId,capturedAt,scope:scopeOf(request),units};
    this.validate(pin);
    publishManagedBytes(this.userData,relative,Buffer.from(jsonBytes(pin)),null);
   }
   this.validate(pin);
   const state=this.state(pin),units=resolveCapturedState(state,this.object),unit=units.find(candidate=>canonical(candidate.owner)===canonical(request.owner))!,source=pin.units.find(candidate=>canonical(candidate.snapshot.owner)===canonical(request.owner))!,catalog=source.files.find(file=>file.relativePath==='database/catalog.sqlite');
   if(!catalog)throw new Error('The pinned export has no consistent catalog.');
   const universe=units.find(candidate=>candidate.owner.kind==='universe'),calendar=universe?.records.find(record=>record.recordType==='calendar');
   return{unit,calendar:calendar?.recordType==='calendar'?calendar.data:null,catalog:this.object(request.owner,catalog.object),files:source.files.map(file=>({relativePath:file.relativePath,sha256:file.object.sha256})),capturedAt:pin.capturedAt};
  });
 }
 ids(){return fs.readdirSync(path.join(this.userData,'protection/export-captures')).map(name=>{if(!name.endsWith('.json')||!isUuid(name.slice(0,-5)))throw new Error('Unrecognized export-capture evidence.');return name.slice(0,-5);});}
 /** Caller must first durably record that this operation is terminal. */
 release(id:string):void{
  this.gate(()=>{
   const relative=this.relative(id),retained=new Set<string>();
   for(const other of this.ids()){
    const pin=this.parse(readManaged(this.userData,this.relative(other)),other);
    if(other!==id)for(const unit of pin.units)for(const file of unit.files)retained.add(file.object.sha256);
   }
   // The shared coordinator gate covers creation and reclamation across hosts.
   // Keep the terminal pin until its unshared objects are removed, so interruption
   // can repeat cleanup without needing the captured payloads to remain readable.
   for(const name of fs.readdirSync(path.join(this.userData,'protection/export-objects'))){
    if(!/^[a-f0-9]{64}$/.test(name))throw new Error('Unrecognized immutable export payload.');
    if(!retained.has(name))removeManagedBytes(this.userData,`protection/export-objects/${name}`,name);
   }
   if(fs.existsSync(path.join(this.userData,relative)))removeManagedBytes(this.userData,relative,hash(readManaged(this.userData,relative)));
  });
 }
}
