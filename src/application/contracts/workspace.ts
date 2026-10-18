import {universeErrorCodes,type UniverseErrorCode} from './universe';
import {closed,isUuid} from '../../domain/validation';
import {unsignedInteger,positiveInteger,signedInteger,scalarText} from '../../domain/calendar';
import {recordCategory,validateWorkspaceRecord,type WorkspaceRecord,type WorkspaceRecordType,type Owner,type ManagedImage} from '../../domain/workspace';
export const WORKSPACE_CHANNEL='writingtool:workspace:v1';
export type WorkspaceChange = {action:'put';record:WorkspaceRecord;expectedRecordVersion:string|null;manuscript:string|null}|{action:'delete';id:string;expectedRecordVersion:string};
export type UnitMutation={owner:Owner;expectedUnitGeneration:string;changes:WorkspaceChange[]};
export type WorkspaceMutation={operationId:string;submittedEditorRevision:string;units:UnitMutation[]};
export type WorkspaceReceipt={protocolVersion:1;operationId:string;submittedEditorRevision:string;units:{owner:Owner;unitGeneration:string;records:{id:string;recordVersion:string;deleted:boolean}[]}[]};
export type AssetData=ManagedImage & {base64:string};
export type WorkspaceUnitSnapshot={owner:Owner;rootId:string;universeId:string;generation:string;records:WorkspaceRecord[];manuscripts:Record<string,string>;assets:ManagedImage[];counters:{event:string;decision:string;story:string;chapter:string}};
export type WorkspaceSnapshot={project:WorkspaceUnitSnapshot|null;universe:WorkspaceUnitSnapshot|null};
export type PanelLayout={id:string;visible:boolean;collapsed:boolean;placement:'left'|'right'|'bottom'|'center'|'floating';order:string;width:string;height:string;monitor:string|null;x:string;y:string};
export type AppSettings={schemaVersion:1;id:string;recordVersion:string;autosaveMinutes:string;revisionMinutes:string;backupMinutes:string;retentionDays:string;backupDestination:string|null;theme:'light'|'dark'|'system';fontFamily:string;fontSize:string;panels:PanelLayout[]};
export type WorkspaceCommand=
 | {command:'workspace.query'}
 | {command:'workspace.mutate';input:WorkspaceMutation}
 | {command:'workspace.reconcile';operationId:string}
 | {command:'workspace.asset.import';owner:Owner;operationId:string;expectedUnitGeneration:string}
 | {command:'workspace.asset.read';owner:Owner;assetId:string}
 | {command:'settings.get'}
 | {command:'settings.save';expectedRecordVersion:string;values:AppSettings}
 | {command:'settings.import'}
 | {command:'settings.export'}
 | {command:'settings.select-backup'};
export type WorkspaceRequest={protocolVersion:1;requestId:string}&WorkspaceCommand;
export type WorkspaceHostRequest=WorkspaceRequest & {nativeAsset?:AssetData;nativeSettings?:unknown;nativeDestination?:string};
export type WorkspaceResult={protocolVersion:1;requestId:string;command:WorkspaceCommand['command']} & (
 {status:'ok';snapshot:WorkspaceSnapshot;receipt:WorkspaceReceipt|null;settings:AppSettings|null;warnings:string[];asset:AssetData|null;destination:string|null}
 |{status:'canceled'}
 |{status:'error';code:UniverseErrorCode;message:string;outcome:'not-committed'|'committed'|'unknown';retry:'same-operation'|'new-request'|'after-recovery'|'not-retryable';issues:{field:string;message:string}[]});
export interface WorkspaceBridge {workspace(command:WorkspaceCommand):Promise<WorkspaceResult>}
export const validOwner=(v:unknown):v is Owner=>closed(v,['kind','id'])&&['project','universe'].includes(String(v.kind))&&isUuid(v.id);
export function validWorkspaceMutation(v:unknown):v is WorkspaceMutation {
 if(!closed(v,['operationId','submittedEditorRevision','units'])||!isUuid(v.operationId)||!unsignedInteger(v.submittedEditorRevision)||!Array.isArray(v.units)||v.units.length<1||v.units.length>2)return false;
 const owners=new Set<string>();
 return v.units.every(u=>{
  if(!closed(u,['owner','expectedUnitGeneration','changes'])||!validOwner(u.owner)||!unsignedInteger(u.expectedUnitGeneration)||!Array.isArray(u.changes)||owners.has(u.owner.kind+u.owner.id))return false;owners.add(u.owner.kind+u.owner.id);
  const ids=new Set<string>();return u.changes.every(c=>{
   if(typeof c!=='object'||!c)return false;
   if(c.action==='delete'){if(!closed(c,['action','id','expectedRecordVersion'])||!isUuid(c.id)||!isUuid(c.expectedRecordVersion)||ids.has(c.id))return false;ids.add(c.id);return true;}
   if(!closed(c,['action','record','expectedRecordVersion','manuscript'])||c.action!=='put'||!closed(c.record,['schemaVersion','recordType','id','owner','universeId','recordVersion','data'])||c.record.schemaVersion!==1||!isUuid(c.record.id)||!isUuid(c.record.recordVersion)||!isUuid(c.record.universeId)||!validOwner(c.record.owner)||!Object.hasOwn(recordCategory,String(c.record.recordType))||(c.expectedRecordVersion!==null&&!isUuid(c.expectedRecordVersion))||(c.manuscript!==null&&!scalarText(c.manuscript))||ids.has(c.record.id))return false;
   ids.add(c.record.id);return true;
  });
 });
}
export function validWorkspaceRequest(v:unknown,internal=false):v is WorkspaceHostRequest {
 if(typeof v!=='object'||!v)return false;const x=v as Record<string,unknown>;if(x.protocolVersion!==1||!isUuid(x.requestId))return false;
 const base=['protocolVersion','requestId','command'];let keys:string[];
 switch(x.command){
 case 'workspace.query':case 'settings.get':case 'settings.export':keys=[];break;
 case 'workspace.mutate':keys=['input'];if(!validWorkspaceMutation(x.input))return false;break;
 case 'workspace.reconcile':keys=['operationId'];if(!isUuid(x.operationId))return false;break;
 case 'workspace.asset.import':keys=['owner','operationId','expectedUnitGeneration'];if(!validOwner(x.owner)||x.owner.kind!=='universe'||!isUuid(x.operationId)||!unsignedInteger(x.expectedUnitGeneration))return false;if(internal&&Object.hasOwn(x,'nativeAsset')){if(!validAssetData(x.nativeAsset))return false;keys.push('nativeAsset');}break;
 case 'workspace.asset.read':keys=['owner','assetId'];if(!validOwner(x.owner)||!isUuid(x.assetId))return false;break;
 case 'settings.save':keys=['expectedRecordVersion','values'];if(!isUuid(x.expectedRecordVersion)||!validAppSettings(x.values))return false;break;
 case 'settings.import':keys=internal&&Object.hasOwn(x,'nativeSettings')?['nativeSettings']:[];break;
 case 'settings.select-backup':keys=internal&&Object.hasOwn(x,'nativeDestination')?['nativeDestination']:[];if(keys.length&&(!scalarText(x.nativeDestination)||!x.nativeDestination||x.nativeDestination.includes('\0')))return false;break;
 default:return false;
 }
 return closed(x,[...base,...keys]);
}
export function validWorkspaceReceipt(v:unknown):v is WorkspaceReceipt {
 return closed(v,['protocolVersion','operationId','submittedEditorRevision','units'])&&v.protocolVersion===1&&isUuid(v.operationId)&&unsignedInteger(v.submittedEditorRevision)&&Array.isArray(v.units)&&v.units.length>0&&v.units.every(u=>closed(u,['owner','unitGeneration','records'])&&validOwner(u.owner)&&unsignedInteger(u.unitGeneration)&&Array.isArray(u.records)&&u.records.every(r=>closed(r,['id','recordVersion','deleted'])&&isUuid(r.id)&&isUuid(r.recordVersion)&&typeof r.deleted==='boolean'));
}
export const SETTINGS_ID='b5a83e04-1e76-4c44-a17d-9ebd3ae09b2f';
export function validAppSettings(v:unknown):v is AppSettings {
 if(!closed(v,['schemaVersion','id','recordVersion','autosaveMinutes','revisionMinutes','backupMinutes','retentionDays','backupDestination','theme','fontFamily','fontSize','panels'])||v.schemaVersion!==1||v.id!==SETTINGS_ID||!isUuid(v.recordVersion)||!['autosaveMinutes','revisionMinutes','backupMinutes','retentionDays'].every(k=>positiveInteger(v[k]))||(v.backupDestination!==null&&(!scalarText(v.backupDestination)||!v.backupDestination||v.backupDestination.includes('\0')))||!['light','dark','system'].includes(String(v.theme))||!scalarText(v.fontFamily)||!v.fontFamily.trim()||typeof v.fontSize!=='string'||!/^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.[0-9]*[1-9][0-9]*)$/.test(v.fontSize)||!Array.isArray(v.panels))return false;
 return v.panels.every(p=>closed(p,['id','visible','collapsed','placement','order','width','height','monitor','x','y'])&&scalarText(p.id)&&!!p.id&&typeof p.visible==='boolean'&&typeof p.collapsed==='boolean'&&['left','right','bottom','center','floating'].includes(String(p.placement))&&unsignedInteger(p.order)&&positiveInteger(p.width)&&positiveInteger(p.height)&&(p.monitor===null||scalarText(p.monitor))&&signedInteger(p.x)&&signedInteger(p.y))&&new Set(v.panels.map(p=>p.id)).size===v.panels.length;
}
export function validManagedImage(v:unknown):v is ManagedImage{return closed(v,['id','sha256','mediaType'])&&isUuid(v.id)&&typeof v.sha256==='string'&&/^[a-f0-9]{64}$/.test(v.sha256)&&['image/png','image/jpeg','image/webp'].includes(String(v.mediaType));}
export function validAssetData(v:unknown):v is AssetData{if(!closed(v,['id','sha256','mediaType','base64']))return false;const {base64,...image}=v;return validManagedImage(image)&&typeof base64==='string'&&/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64);}
export function validWorkspaceUnit(v:unknown):v is WorkspaceUnitSnapshot {
 if(!closed(v,['owner','rootId','universeId','generation','records','manuscripts','assets','counters'])||!validOwner(v.owner)||!isUuid(v.rootId)||!isUuid(v.universeId)||!unsignedInteger(v.generation)||v.owner.kind==='universe'&&v.owner.id!==v.universeId||!Array.isArray(v.records)||!v.records.every(validateWorkspaceRecord)||new Set(v.records.map(r=>r.id)).size!==v.records.length||!v.records.every(r=>r.owner.kind===(v.owner as Owner).kind&&r.owner.id===(v.owner as Owner).id&&r.universeId===v.universeId)||typeof v.manuscripts!=='object'||!v.manuscripts||Array.isArray(v.manuscripts)||!Array.isArray(v.assets)||!v.assets.every(validManagedImage)||new Set(v.assets.map(a=>a.id)).size!==v.assets.length||!closed(v.counters,['event','decision','story','chapter'])||!unsignedInteger(v.counters.event)||!unsignedInteger(v.counters.decision)||!unsignedInteger(v.counters.story)||!unsignedInteger(v.counters.chapter))return false;
 const manuscripts=v.manuscripts as Record<string,unknown>,chapters=v.records.filter(r=>r.recordType==='chapter');return Object.keys(manuscripts).length===chapters.length&&chapters.every(c=>scalarText(manuscripts[c.id])&&!(manuscripts[c.id] as string).includes('\r'));
}
export function validWorkspaceResult(v:unknown,r:Pick<WorkspaceRequest,'requestId'|'command'>&{input?:WorkspaceMutation;operationId?:string;owner?:Owner;assetId?:string}):v is WorkspaceResult {
 if(typeof v!=='object'||!v)return false;const x=v as Record<string,unknown>,base=['protocolVersion','requestId','command','status'];if(x.protocolVersion!==1||x.requestId!==r.requestId||x.command!==r.command)return false;
 if(x.status==='canceled')return ['workspace.asset.import','settings.import','settings.export','settings.select-backup'].includes(r.command)&&closed(v,base);
 if(x.status==='error')return closed(v,[...base,'code','message','outcome','retry','issues'])&&universeErrorCodes.includes(x.code as UniverseErrorCode)&&scalarText(x.message)&&['not-committed','committed','unknown'].includes(String(x.outcome))&&['same-operation','new-request','after-recovery','not-retryable'].includes(String(x.retry))&&Array.isArray(x.issues)&&x.issues.every(i=>closed(i,['field','message'])&&scalarText(i.field)&&scalarText(i.message));
 if(x.status!=='ok'||!closed(v,[...base,'snapshot','receipt','settings','warnings','asset','destination'])||!closed(x.snapshot,['project','universe'])||(x.snapshot.project!==null&&!validWorkspaceUnit(x.snapshot.project))||(x.snapshot.universe!==null&&!validWorkspaceUnit(x.snapshot.universe))||(x.receipt!==null&&!validWorkspaceReceipt(x.receipt))||(x.settings!==null&&!validAppSettings(x.settings))||(x.asset!==null&&!validAssetData(x.asset))||!Array.isArray(x.warnings)||!x.warnings.every(scalarText)||(x.destination!==null&&!scalarText(x.destination)))return false;
 const snapshot=x.snapshot as WorkspaceSnapshot;if(snapshot.project&&(!snapshot.universe||snapshot.project.universeId!==snapshot.universe.owner.id))return false;
 if(r.command.startsWith('settings.'))return x.settings!==null&&x.receipt===null&&x.asset===null;
 if(x.settings!==null)return false;
 if(['workspace.mutate','workspace.asset.import'].includes(r.command)&&x.receipt===null)return false;
 if(['workspace.query','workspace.asset.read'].includes(r.command)&&x.receipt!==null)return false;
 if(['workspace.asset.read','workspace.asset.import'].includes(r.command)!==(x.asset!==null))return false;
 if(x.receipt){const receipt=x.receipt as WorkspaceReceipt;if(r.input&&(receipt.operationId!==r.input.operationId||receipt.submittedEditorRevision!==r.input.submittedEditorRevision||!r.input.units.every(u=>receipt.units.some(saved=>saved.owner.kind===u.owner.kind&&saved.owner.id===u.owner.id&&saved.unitGeneration===(BigInt(u.expectedUnitGeneration)+1n).toString()))))return false;if(r.operationId&&receipt.operationId!==r.operationId)return false;for(const unit of receipt.units){const current=[snapshot.project,snapshot.universe].find(s=>s?.owner.kind===unit.owner.kind&&s.owner.id===unit.owner.id);if(!current||BigInt(current.generation)<BigInt(unit.unitGeneration))return false;if(current.generation===unit.unitGeneration&&!unit.records.every(record=>record.deleted?!current.records.some(r=>r.id===record.id):current.records.some(r=>r.id===record.id&&r.recordVersion===record.recordVersion)))return false;}}
 if(r.command==='workspace.asset.read'&&r.assetId&&(x.asset as AssetData).id!==r.assetId)return false;
 return true;
}
export type {WorkspaceRecord,WorkspaceRecordType,Owner,ManagedImage};
