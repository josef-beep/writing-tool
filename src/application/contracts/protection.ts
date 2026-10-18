import {validateWorkspaceRecord,type Owner,type WorkspaceRecord} from '../../domain/workspace';
import type {WorkspaceUnitSnapshot,AssetData} from './workspace';
import {closed,isUuid} from '../../domain/validation';
import {unsignedInteger,scalarText} from '../../domain/calendar';
import {validOwner,validWorkspaceUnit,validAssetData} from './workspace';
export const PROTECTION_CHANNEL='writingtool:protection:v1';
export const CATALOG_NOTICE='Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.';
export type ObjectRef={sha256:string;byteLength:string};
export type CapturedUnit={snapshot:Omit<WorkspaceUnitSnapshot,'records'|'manuscripts'> & {recordIds:string[]};files:{relativePath:string;object:ObjectRef}[]};
export type RevisionManifest={schemaVersion:1;kind:'complete-revision';id:string;owner:Owner;reason:'Manual'|'Automatic'|'Close'|'Replaced'|'Recovered';capturedAt:string;completedAt:string;localCaptureStart:string;offsetMinutes:string;timeZone:string;displayName:string;universeDisplayName:string;units:CapturedUnit[];retainedRevisionIds:string[]};
export type ArchiveManifest={schemaVersion:1;kind:'complete-backup';id:string;capturedAt:string;revision:RevisionManifest;retained:RevisionManifest[];files:{relativePath:string;object:ObjectRef}[]};
export type ArchiveRecord={schemaVersion:1;id:string;owner:Owner;sha256:string;capturedAt:string;completedAt:string;locations:string[];evidence:{path:string;device:string;inode:string}[];revisionIds:string[];state:'valid'|'uncertain';};
export type Resolution={recordId:string;liveFingerprint:string|null;recoveredFingerprint:string;choice:'keep-live'|'use-recovered'|'combined';record:WorkspaceRecord|null;manuscript:string|null};
export type RecoveryProposal={schemaVersion:1;id:string;revisionId:string;owner:Owner;status:'review'|'canceled'|'applied'|'backup-required';scope:string[]|null;expected:{owner:Owner;generation:string}[];choices:Resolution[];operationId:string;replacedRevisionId:string|null;};
export type RecoveryView={proposal:RecoveryProposal;conflicts:{id:string;live:WorkspaceRecord|null;recovered:WorkspaceRecord;liveText:string|null;recoveredText:string|null;resolved:boolean;liveFingerprint:string|null;recoveredFingerprint:string}[];issues:string[];missing:{sourceId:string;targetId:string;label:string;canRemove:boolean}[]};
export type ProtectionCommand=
 |{command:'protection.archives';owner:Owner}
 |{command:'protection.archive-locate';owner:Owner;id:string}
 |{command:'protection.recents'}
 |{command:'protection.pending'}
 |{command:'protection.recent';id:string;action:'open'|'locate'|'remove'}
 |{command:'protection.history';owner:Owner}
 |{command:'protection.capture';owner:Owner;reason:RevisionManifest['reason']}
 |{command:'protection.inspect';owner:Owner;revisionId:string}
 |{command:'protection.backup';owner:Owner;reason:RevisionManifest['reason'];chooseLocation:boolean;closing:boolean}
 |{command:'protection.delete';owner:Owner;kind:'revision'|'archive';id:string}
 |{command:'protection.recover';owner:Owner|null;revisionId:string|null;scope:string[]|null}
 |{command:'protection.resume';proposalId:string}
 |{command:'protection.resolve';proposalId:string;resolution:Resolution}
 |{command:'protection.reference';proposalId:string;sourceId:string;targetId:string;action:'restore'|'replacement'|'remove';replacementId:string|null}
 |{command:'protection.apply';proposalId:string}
 |{command:'protection.cancel-recovery';proposalId:string}
 |{command:'protection.export';owner:Owner;format:'md'|'txt'|'docx'|'pdf'|'sqlite';storyId:string|null;chapterIds:string[]|null}
 |{command:'protection.reconcile';operationId:string;chooseLocation?:boolean}
 |{command:'protection.cancel';operationId:string}
 |{command:'protection.open';outputId:string;folder:boolean};
export type ProtectionRequest={protocolVersion:1;requestId:string}&ProtectionCommand;
/** Native locations never cross the renderer boundary. Main adds these after purpose-specific selection. */
export type ProtectionHostRequest=ProtectionRequest&{nativeDestination?:{path:string;expectedHash:string|null};nativeArchive?:string;nativeActivation?:{project:string|null;universe:string};nativeRuntime?:string;nativeBackupFolder?:string};
export type ProtectionValue={history?:RevisionManifest[];manifest?:RevisionManifest;units?:WorkspaceUnitSnapshot[];assets?:AssetData[];recovery?:RecoveryView;output?:{id:string;path:string;notice:string|null};archives?:ArchiveRecord[];recents?:{id:string;owner:Owner;name:string;available:boolean}[];pending?:string[];proposals?:string[];deleted?:string;activated?:{project:string|null;universe:string};};
export type ProtectionResult={protocolVersion:1;requestId:string;command:ProtectionCommand['command']} & ({status:'ok';value:ProtectionValue}|{status:'canceled'}|{status:'error';message:string;outcome:'not-committed'|'unknown';operationId:string|null});
export interface ProtectionBridge{protection(command:ProtectionCommand):Promise<ProtectionResult>}
export function validProtectionRequest(v:unknown,internal=false):v is ProtectionHostRequest{
 if(typeof v!=='object'||!v)return false;const x=v as Record<string,unknown>;if(x.protocolVersion!==1||!isUuid(x.requestId))return false;let keys:string[]=[];
 switch(x.command){
 case 'protection.archives':keys=['owner'];break;
 case 'protection.archive-locate':keys=['owner','id'];if(!isUuid(x.id))return false;break;
 case 'protection.recents':case 'protection.pending':keys=[];break;
 case 'protection.recent':keys=['id','action'];if(!isUuid(x.id)||!['open','locate','remove'].includes(String(x.action)))return false;break;
 case 'protection.history':keys=['owner'];break;
 case 'protection.capture':keys=['owner','reason'];break;
 case 'protection.inspect':keys=['owner','revisionId'];if(!isUuid(x.revisionId))return false;break;
 case 'protection.backup':keys=['owner','reason','chooseLocation','closing'];if(typeof x.chooseLocation!=='boolean'||typeof x.closing!=='boolean')return false;break;
 case 'protection.delete':keys=['owner','kind','id'];if(!['revision','archive'].includes(String(x.kind))||!isUuid(x.id))return false;break;
 case 'protection.recover':keys=['owner','revisionId','scope'];if(x.owner!==null&&!validOwner(x.owner)||x.revisionId!==null&&!isUuid(x.revisionId)||x.scope!==null&&(!Array.isArray(x.scope)||!x.scope.every(isUuid)))return false;break;
 case 'protection.reference':keys=['proposalId','sourceId','targetId','action','replacementId'];if(!isUuid(x.proposalId)||!isUuid(x.sourceId)||!isUuid(x.targetId)||!['restore','replacement','remove'].includes(String(x.action))||x.replacementId!==null&&!isUuid(x.replacementId))return false;break;
 case 'protection.resume':case 'protection.apply':case 'protection.cancel-recovery':keys=['proposalId'];if(!isUuid(x.proposalId))return false;break;
 case 'protection.resolve':keys=['proposalId','resolution'];if(!isUuid(x.proposalId)||!closed(x.resolution,['recordId','liveFingerprint','recoveredFingerprint','choice','record','manuscript'])||!isUuid(x.resolution.recordId)||!validResolution(x.resolution))return false;break;
 case 'protection.export':keys=['owner','format','storyId','chapterIds'];if(!['md','txt','docx','pdf','sqlite'].includes(String(x.format))||x.storyId!==null&&!isUuid(x.storyId)||x.chapterIds!==null&&(!Array.isArray(x.chapterIds)||!x.chapterIds.every(isUuid)))return false;break;
 case 'protection.reconcile':keys=['operationId',...(Object.hasOwn(x,'chooseLocation')?['chooseLocation']:[])];if(Object.hasOwn(x,'chooseLocation')&&typeof x.chooseLocation!=='boolean'||!isUuid(x.operationId))return false;break;
 case 'protection.cancel':keys=['operationId'];if(!isUuid(x.operationId))return false;break;
 case 'protection.open':keys=['outputId','folder'];if(!isUuid(x.outputId)||typeof x.folder!=='boolean')return false;break;
 default:return false;
 }
 if(keys.includes('owner')&&x.command!=='protection.recover'&&!validOwner(x.owner))return false;
 if(keys.includes('reason')&&!['Manual','Automatic','Close','Replaced','Recovered'].includes(String(x.reason)))return false;
 if(internal){if(Object.hasOwn(x,'nativeDestination')&&(!closed(x.nativeDestination,['path','expectedHash'])||!nativePath(x.nativeDestination.path)||x.nativeDestination.expectedHash!==null&&!digest(x.nativeDestination.expectedHash)))return false;if(Object.hasOwn(x,'nativeBackupFolder')&&!nativePath(x.nativeBackupFolder))return false;if(Object.hasOwn(x,'nativeArchive')&&!nativePath(x.nativeArchive)||Object.hasOwn(x,'nativeRuntime')&&!nativePath(x.nativeRuntime))return false;if(Object.hasOwn(x,'nativeActivation')&&(!closed(x.nativeActivation,['project','universe'])||x.nativeActivation.project!==null&&!nativePath(x.nativeActivation.project)||!nativePath(x.nativeActivation.universe)))return false;keys.push(...['nativeDestination','nativeArchive','nativeActivation','nativeRuntime','nativeBackupFolder'].filter(k=>Object.hasOwn(x,k)));}
 return closed(x,['protocolVersion','requestId','command',...keys]);
}
export function validProtectionResult(v:unknown,r:ProtectionRequest):v is ProtectionResult{if(typeof v!=='object'||!v)return false;const x=v as Record<string,unknown>,base=['protocolVersion','requestId','command','status'];return x.protocolVersion===1&&x.requestId===r.requestId&&x.command===r.command&&(x.status==='ok'?closed(x,[...base,'value'])&&validProtectionValue(x.value):x.status==='canceled'?closed(x,base):x.status==='error'&&closed(x,[...base,'message','outcome','operationId'])&&typeof x.message==='string'&&['not-committed','unknown'].includes(String(x.outcome))&&(x.operationId===null||isUuid(x.operationId)));}

export const digest=(v:unknown):v is string=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const nativePath=(v:unknown):v is string=>scalarText(v)&&!!v&&!v.includes('\0')&&(/^(?:\/|[A-Za-z]:[\\/])/.test(v));
const uuidList=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(isUuid)&&new Set(v).size===v.length;
export const validObjectRef=(v:unknown):v is ObjectRef=>closed(v,['sha256','byteLength'])&&digest(v.sha256)&&unsignedInteger(v.byteLength);
export const validCapturedUnit=(v:unknown):v is CapturedUnit=>closed(v,['snapshot','files'])&&closed(v.snapshot,['owner','rootId','universeId','generation','assets','counters','recordIds'])&&validWorkspaceUnit(Object.fromEntries([...Object.entries(v.snapshot).filter(([k])=>k!=='recordIds'),['records',[]],['manuscripts',{}]]))&&uuidList(v.snapshot.recordIds)&&Array.isArray(v.files)&&v.files.every(f=>closed(f,['relativePath','object'])&&safePath(f.relativePath)&&validObjectRef(f.object))&&new Set(v.files.map(f=>f.relativePath.toLowerCase())).size===v.files.length;
const safePath=(v:unknown):v is string=>typeof v==='string'&&!!v&&!v.startsWith('/')&&!v.split('/').some(p=>!p||p==='.'||p==='..'||/[\\\0:\x00-\x1f]/.test(p)||/[. ]$/.test(p));
export function validRevisionManifest(v:unknown):v is RevisionManifest{return closed(v,['schemaVersion','kind','id','owner','reason','capturedAt','completedAt','localCaptureStart','offsetMinutes','timeZone','displayName','universeDisplayName','units','retainedRevisionIds'])&&v.schemaVersion===1&&v.kind==='complete-revision'&&isUuid(v.id)&&validOwner(v.owner)&&['Manual','Automatic','Close','Replaced','Recovered'].includes(String(v.reason))&&typeof v.capturedAt==='string'&&Number.isFinite(Date.parse(v.capturedAt))&&typeof v.completedAt==='string'&&Number.isFinite(Date.parse(v.completedAt))&&scalarText(v.localCaptureStart)&&typeof v.offsetMinutes==='string'&&/^-?(0|[1-9][0-9]*)$/.test(v.offsetMinutes)&&scalarText(v.timeZone)&&scalarText(v.displayName)&&scalarText(v.universeDisplayName)&&Array.isArray(v.units)&&v.units.every(validCapturedUnit)&&v.units.length===(v.owner.kind==='project'?2:1)&&v.units.some(u=>u.snapshot.owner.kind===(v.owner as Owner).kind&&u.snapshot.owner.id===(v.owner as Owner).id)&&new Set(v.units.map(u=>u.snapshot.owner.kind+u.snapshot.owner.id)).size===v.units.length&&uuidList(v.retainedRevisionIds)&&(v.owner.kind==='universe'||v.units.some(u=>u.snapshot.owner.kind==='universe'&&u.snapshot.owner.id===v.units.find(p=>p.snapshot.owner.kind==='project')?.snapshot.universeId));}
export function validResolution(v:unknown):v is Resolution{return closed(v,['recordId','liveFingerprint','recoveredFingerprint','choice','record','manuscript'])&&isUuid(v.recordId)&&(v.liveFingerprint===null||digest(v.liveFingerprint))&&digest(v.recoveredFingerprint)&&['keep-live','use-recovered','combined'].includes(String(v.choice))&&(v.choice==='combined'?validateWorkspaceRecord(v.record)&&v.record.id===v.recordId&&(v.record.recordType==='chapter'?scalarText(v.manuscript):v.manuscript===null):v.record===null&&v.manuscript===null);}
export function validProposal(v:unknown):v is RecoveryProposal{return closed(v,['schemaVersion','id','revisionId','owner','status','scope','expected','choices','operationId','replacedRevisionId'])&&v.schemaVersion===1&&isUuid(v.id)&&isUuid(v.revisionId)&&validOwner(v.owner)&&['review','canceled','applied','backup-required'].includes(String(v.status))&&(v.scope===null||uuidList(v.scope))&&Array.isArray(v.expected)&&v.expected.length<=2&&v.expected.every(e=>closed(e,['owner','generation'])&&validOwner(e.owner)&&unsignedInteger(e.generation))&&Array.isArray(v.choices)&&v.choices.every(validResolution)&&new Set(v.choices.map(c=>c.recordId)).size===v.choices.length&&isUuid(v.operationId)&&(v.replacedRevisionId===null||isUuid(v.replacedRevisionId));}
export function validRecoveryView(v:unknown):v is RecoveryView{return closed(v,['proposal','conflicts','issues','missing'])&&validProposal(v.proposal)&&Array.isArray(v.conflicts)&&v.conflicts.every(c=>closed(c,['id','live','recovered','liveText','recoveredText','resolved','liveFingerprint','recoveredFingerprint'])&&isUuid(c.id)&&(c.live===null||validateWorkspaceRecord(c.live)&&c.live.id===c.id)&&validateWorkspaceRecord(c.recovered)&&c.recovered.id===c.id&&(c.liveText===null||scalarText(c.liveText))&&(c.recoveredText===null||scalarText(c.recoveredText))&&typeof c.resolved==='boolean'&&(c.liveFingerprint===null||digest(c.liveFingerprint))&&digest(c.recoveredFingerprint))&&Array.isArray(v.issues)&&v.issues.every(scalarText)&&Array.isArray(v.missing)&&v.missing.every(m=>closed(m,['sourceId','targetId','label','canRemove'])&&isUuid(m.sourceId)&&isUuid(m.targetId)&&scalarText(m.label)&&typeof m.canRemove==='boolean');}
export function validProtectionValue(v:unknown):v is ProtectionValue{if(typeof v!=='object'||!v||Array.isArray(v))return false;const x=v as Record<string,unknown>,keys=['assets','archives','recents','pending','proposals','history','manifest','units','recovery','output','deleted','activated'];if(Object.keys(x).some(k=>!keys.includes(k)))return false;return (!Object.hasOwn(x,'assets')||Array.isArray(x.assets)&&x.assets.every(validAssetData))&&(!Object.hasOwn(x,'archives')||Array.isArray(x.archives)&&x.archives.every(validArchiveRecord))&&(!Object.hasOwn(x,'pending')||uuidList(x.pending))&&(!Object.hasOwn(x,'proposals')||uuidList(x.proposals))&&(!Object.hasOwn(x,'recents')||Array.isArray(x.recents)&&x.recents.every(r=>closed(r,['id','owner','name','available'])&&isUuid(r.id)&&validOwner(r.owner)&&scalarText(r.name)&&typeof r.available==='boolean'))&&(!Object.hasOwn(x,'history')||Array.isArray(x.history)&&x.history.every(validRevisionManifest))&&(!Object.hasOwn(x,'manifest')||validRevisionManifest(x.manifest))&&(!Object.hasOwn(x,'units')||Array.isArray(x.units)&&x.units.every(validWorkspaceUnit))&&(!Object.hasOwn(x,'recovery')||validRecoveryView(x.recovery))&&(!Object.hasOwn(x,'output')||closed(x.output,['id','path','notice'])&&isUuid(x.output.id)&&nativePath(x.output.path)&&(x.output.notice===null||x.output.notice===CATALOG_NOTICE))&&(!Object.hasOwn(x,'deleted')||isUuid(x.deleted))&&(!Object.hasOwn(x,'activated')||closed(x.activated,['project','universe'])&&(x.activated.project===null||nativePath(x.activated.project))&&nativePath(x.activated.universe));}

export function validArchiveRecord(v:unknown):v is ArchiveRecord{return closed(v,['schemaVersion','id','owner','sha256','capturedAt','completedAt','locations','evidence','revisionIds','state'])&&v.schemaVersion===1&&isUuid(v.id)&&validOwner(v.owner)&&digest(v.sha256)&&typeof v.capturedAt==='string'&&Number.isFinite(Date.parse(v.capturedAt))&&typeof v.completedAt==='string'&&Number.isFinite(Date.parse(v.completedAt))&&Array.isArray(v.locations)&&v.locations.every(nativePath)&&Array.isArray(v.evidence)&&v.evidence.every(e=>closed(e,['path','device','inode'])&&nativePath(e.path)&&unsignedInteger(e.device)&&unsignedInteger(e.inode))&&uuidList(v.revisionIds)&&['valid','uncertain'].includes(String(v.state));}
