import path from 'node:path';
import fs from 'node:fs';
import type {Owner} from '../domain/workspace';
import {validOwner} from '../application/contracts/workspace';
import {closed,isUuid} from '../domain/validation';
import {decode,readManaged} from './universe-files';

export type ActivationParticipant={stage:string;destination:string;owner:Owner;rootId:string};
export type ActivationDecision={schemaVersion:2;requestId:string;proposalId:string;manifestId:string;operationId:string;state:'await-coordinator'|'commit'|'complete';locations:{project:string|null;universe:string};participants:ActivationParticipant[]};
export type ActivationLocation={owner:Owner;rootId:string;location:string;destination?:string};
export const activationPath=(requestId:string)=>`protection/activation-${requestId}.json`;
export const validActivationPath=(value:unknown):value is string=>typeof value==='string'&&path.isAbsolute(value)&&!value.includes('\0')&&!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value);
const absolute=validActivationPath;
const inside=(file:string,root:string)=>{const relative=path.relative(root,file);return !relative||relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative);};
/** An empty/foreign replacement at an old path is not the missing participant. */
export function activationRootAt(root:string,participant:Pick<ActivationParticipant,'owner'|'rootId'>):string|null{
 if(!absolute(root))throw new Error('Invalid activation path bytes.');
 let location:string;
 try{location=fs.realpathSync(root);}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}
 let discovery:unknown;
 try{discovery=decode(readManaged(location,'writingtool.json'));}catch(error){
  if((error as NodeJS.ErrnoException).code==='ENOENT'&&!['database','.writingtool-creation.json'].some(name=>fs.existsSync(path.join(location,name))))return null;
  throw new Error('An original recovery path has unreadable authority evidence. Preserve it before locating the participant.');
 }
 if(!discovery||typeof discovery!=='object'||!('schemaVersion'in discovery)||discovery.schemaVersion!==1||!('kind'in discovery)||!['project','universe'].includes(String(discovery.kind))||!('id'in discovery)||!isUuid(discovery.id)||!('rootId'in discovery)||!isUuid(discovery.rootId))throw new Error('An original recovery path has invalid authority evidence.');
 if(discovery.kind===participant.owner.kind&&discovery.id===participant.owner.id&&discovery.rootId===participant.rootId)return location;
 if(discovery.id===participant.owner.id||discovery.rootId===participant.rootId)throw new Error('A recovery path has conflicting permanent owner identity.');
 return null;
}
export function activationDestinationAvailable(destination:string,stage:string):boolean{
 if(!absolute(destination)||!absolute(stage))throw new Error('Invalid activation path bytes.');
 try{
  const stat=fs.lstatSync(destination);
  if(!stat.isDirectory()||stat.isSymbolicLink()||fs.readdirSync(destination).length)return false;
 }catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
 try{return fs.statSync(fs.realpathSync(path.dirname(destination))).dev===fs.statSync(stage).dev;}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return false;throw error;}
}
/** Only a destination capability identifies a relocated, unpublished stage. */
export function relocateActivationParticipant(participant:ActivationParticipant,state:ActivationDecision['state'],selected:ActivationLocation):ActivationParticipant{
 if(!absolute(selected.location)||selected.destination!==undefined&&!absolute(selected.destination))throw new Error('Invalid activation path bytes.');
 const staged=activationRootAt(participant.stage,participant),published=activationRootAt(participant.destination,participant),location=activationRootAt(selected.location,participant);
 if(staged&&published)throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
 if(!location)throw new Error('The selected activation location has a different permanent identity.');
 if(published&&published!==location||staged&&staged!==location)throw new Error('An original activation authority remains accessible. Reconcile it before rebinding.');
 if(selected.destination!==undefined){
  if(published||state==='complete')throw new Error('A published activation retains its located publication root.');
  if(!activationDestinationAvailable(selected.destination,location))throw new Error('Choose an empty publication destination on the same filesystem as the staged recovery root.');
  return {...participant,stage:location,destination:selected.destination};
 }
 if(staged||!published&&state!=='complete')throw new Error('Choose an empty publication destination for the relocated staged root.');
 return {...participant,destination:location};
}
export function validActivationDecision(value:unknown):value is ActivationDecision{
 if(!closed(value,['schemaVersion','requestId','proposalId','manifestId','operationId','state','locations','participants'])||value.schemaVersion!==2||![value.requestId,value.proposalId,value.manifestId,value.operationId].every(isUuid)||!['await-coordinator','commit','complete'].includes(String(value.state))||!closed(value.locations,['project','universe'])||value.locations.project!==null&&!absolute(value.locations.project)||!absolute(value.locations.universe)||!Array.isArray(value.participants)||!value.participants.length||value.participants.length>2)return false;
 const locations=value.locations as ActivationDecision['locations'];
 if(!value.participants.every(p=>closed(p,['stage','destination','owner','rootId'])&&absolute(p.stage)&&absolute(p.destination)&&p.stage!==p.destination&&validOwner(p.owner)&&isUuid(p.rootId)&&p.destination===(p.owner.kind==='project'?locations.project:locations.universe)))return false;
 const participants=value.participants as ActivationParticipant[];
 const roots=participants.flatMap(p=>[p.stage,p.destination]);if(!participants.some(p=>p.owner.kind==='universe'))roots.push(locations.universe);
 return new Set(participants.map(p=>p.owner.kind)).size===participants.length&&new Set(participants.map(p=>p.rootId)).size===participants.length&&roots.every((root,index)=>roots.slice(index+1).every(other=>!inside(root,other)&&!inside(other,root)))&&(value.state!=='await-coordinator'||participants.length===1&&participants[0].owner.kind==='project');
}
