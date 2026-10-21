import type {CapturedUnit,ObjectRef} from '../application/contracts/protection';
import {validCapturedUnit} from '../application/contracts/protection';
import {validOwner,validWorkspaceUnit,type WorkspaceUnitSnapshot} from '../application/contracts/workspace';
import {assertWorkspaceState,recordCategory as categories,type Owner} from '../domain/workspace';
import {canonical,decode,hash} from './universe-files';
export type CapturedState={owner:Owner;units:CapturedUnit[]};
export type CaptureObjectReader=(owner:Owner,ref:ObjectRef)=>Buffer;
export function validCapturedState(value:CapturedState):boolean{
 if(!validOwner(value.owner)||!Array.isArray(value.units)||!value.units.every(validCapturedUnit)||value.units.length!==(value.owner.kind==='project'?2:1)||new Set(value.units.map(u=>u.snapshot.owner.kind+'/'+u.snapshot.owner.id)).size!==value.units.length)return false;
 const primary=value.units.find(u=>u.snapshot.owner.kind===value.owner.kind&&u.snapshot.owner.id===value.owner.id);
 return !!primary&&(value.owner.kind==='universe'||value.units.some(u=>u.snapshot.owner.kind==='universe'&&u.snapshot.owner.id===primary.snapshot.universeId));
}
export function resolveCapturedState(state:CapturedState,object:CaptureObjectReader):WorkspaceUnitSnapshot[]{return state.units.map(unit=>{const {recordIds,...identity}=unit.snapshot,files=new Map(unit.files.map(f=>[f.relativePath,f.object])),records=recordIds.map(id=>{const file=unit.files.find(f=>f.relativePath.endsWith('/'+id+'.json')&&!f.relativePath.startsWith('history/'));if(!file)throw new Error('Missing current record payload.');return decode(object(state.owner,file.object)) as import('../domain/workspace').WorkspaceRecord;}),manuscripts:Record<string,string>={};for(const r of records)if(r.recordType==='chapter'){const ref=files.get(r.data.formatting.text.relativePath);if(!ref)throw new Error('Missing chapter manuscript.');manuscripts[r.id]=new TextDecoder('utf-8',{fatal:true}).decode(object(state.owner,ref));}return{...identity,records,manuscripts};});}
export function validateCapturedState(state:CapturedState,object:CaptureObjectReader):void{
 if(!validCapturedState(state))throw new Error('Invalid complete captured state.');
 const units=resolveCapturedState(state,object);assertWorkspaceState(units.flatMap(u=>u.records));for(let i=0;i<state.units.length;i++){const unit=state.units[i],snapshot=units[i],files=new Map(unit.files.map(f=>[f.relativePath,object(state.owner,f.object)]));if(!files.has('writingtool.json')||!files.has('database/catalog.sqlite'))throw new Error('The complete capture lacks discovery or catalog.');if(!validWorkspaceUnit(snapshot))throw new Error('Invalid resolved unit.');for(const r of snapshot.records){const bytes=files.get(`${recordCategory(r.recordType)}/${r.id}.json`);if(!bytes||canonical(decode(bytes))!==canonical(r))throw new Error('Captured record bytes do not match the saved state.');if(r.recordType==='chapter'){const text=files.get(r.data.formatting.text.relativePath);if(!text||hash(text)!==r.data.formatting.text.sha256||text.toString('utf8')!==snapshot.manuscripts[r.id])throw new Error('Captured manuscript and formatting do not match.');}}for(const f of unit.files)object(state.owner,f.object);}
}
const recordCategory=(type:keyof typeof categories)=>categories[type];
