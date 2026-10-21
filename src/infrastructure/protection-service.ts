import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {UniverseFailure} from '../application/universe';
import type {WorkspaceApplication} from '../application/workspace';
import type {ProtectionHostRequest,ProtectionValue,RevisionManifest} from '../application/contracts/protection';
import {CATALOG_NOTICE} from '../application/contracts/protection';
import type {SettingsStorage} from './settings-storage';
import {RevisionStorage,ownerKey} from './revisions';
import {ArchiveStorage,type OperationControl,type NativeDestination,OperationCanceled} from './archives';
import {RecoveryStorage,validateCaptureCatalogs,rebindCapturedCatalog} from './recovery';
import {exportSaved} from './exports';
import {ExportCaptureStorage} from './export-captures';
import {ensureManagedDirectory,publishManagedBytes,hash,readManaged,jsonBytes,syncDir,decode,canonical} from './universe-files';
import {closed} from '../domain/validation';
import {validProtectionRequest,validProtectionValue,protectionHasDurableEffects,digest} from '../application/contracts/protection';
import {safeDisplayName} from '../domain/capture-time';
import {FileProjectStorage} from './project-storage';
import type {WorkspaceCoordinator} from './workspace-coordinator';
import type {Owner} from '../domain/workspace';
import {activationPath,activationRootAt,activationDestinationAvailable,relocateActivationParticipant,validActivationPath,validActivationDecision,type ActivationDecision,type ActivationParticipant,type ActivationLocation} from './recovery-activation';
type ProtectionJob={schemaVersion:1;request:ProtectionHostRequest;state:'ready'|'started'|'prepared'|'complete'|'aborted';value?:ProtectionValue;destination?:NativeDestination;digest?:string};
export class ProtectionService{
 readonly revisions:RevisionStorage;readonly archives:ArchiveStorage;readonly recovery:RecoveryStorage;
 private readonly exportCaptures:ExportCaptureStorage;
 private operations=new Map<string,OperationControl>();
 constructor(private workspace:WorkspaceApplication,private settings:SettingsStorage,private userData:string,private coordinator:WorkspaceCoordinator,private openRecovered:(locations:{project:string|null;universe:string})=>void=()=>{}){ensureManagedDirectory(userData,'protection/recovered');ensureManagedDirectory(userData,'protection/jobs');this.revisions=new RevisionStorage(workspace,owner=>{try{return workspace.location(owner);}catch{const relative=`protection/recovered/${owner.kind}/${owner.id}`;ensureManagedDirectory(userData,relative);return path.join(userData,relative);}});this.archives=new ArchiveStorage(this.revisions,userData);this.recovery=new RecoveryStorage(workspace,this.revisions,userData);this.exportCaptures=new ExportCaptureStorage(workspace,userData,fn=>coordinator.settingsGate(fn));this.cleanupExportCaptures();}
 cancel(id:string):boolean{const control=this.operations.get(id);if(!control||!control.cancelable)return false;control.canceled=true;return true;}
 get busy(){return this.operations.size>0;}
 progress(){return [...this.operations].map(([operationId,c])=>({operationId,phase:c.phase,cancelable:c.cancelable}));}
 private job(id:string,value:unknown){const relative=`protection/jobs/${id}.json`,old=fs.existsSync(path.join(this.userData,relative))?hash(readManaged(this.userData,relative)):null;publishManagedBytes(this.userData,relative,Buffer.from(jsonBytes(value)),old);}
 private readJob(id:string):ProtectionJob{
  const relative=`protection/jobs/${id}.json`;
  if(!fs.existsSync(path.join(this.userData,relative)))throw new Error('No durable protection job exists for that operation. Preserve its original recovery evidence.');
  const decoded=decode(readManaged(this.userData,relative));
  if(!decoded||typeof decoded!=='object'||!('state'in decoded)||!['ready','started','prepared','complete','aborted'].includes(String(decoded.state)))throw new Error('The original protection job evidence is invalid.');
  const value=decoded as Record<string,unknown>;
  const outputEvidence=Object.hasOwn(value,'destination')||Object.hasOwn(value,'digest'),keys=['schemaVersion','state','request',...(value.state==='complete'?['value']:[]),...(value.state==='prepared'||value.state==='complete'&&outputEvidence?['destination','digest']:[])];
  if(!closed(value,keys))throw new Error('The original protection job evidence is invalid.');
  if(value.schemaVersion!==1||!validProtectionRequest(value.request,true)||value.request.nativePrepareOnly||value.request.command==='protection.reconcile'||value.request.command==='protection.cancel'||value.request.requestId!==id||value.state==='complete'&&(!validProtectionValue(value.value)||!!value.value.reconciliation)||outputEvidence&&(!closed(value.destination,['path','expectedHash'])||typeof value.destination.path!=='string'||!path.isAbsolute(value.destination.path)||value.destination.expectedHash!==null&&!digest(value.destination.expectedHash)||!digest(value.digest))||value.state==='prepared'&&!outputEvidence||outputEvidence&&!['protection.backup','protection.apply','protection.export'].includes(value.request.command))throw new Error('The original protection job evidence is invalid.');
  return value as ProtectionJob;
 }
 private prepare(request:ProtectionHostRequest):void{
  if(this.busy)throw new Error('Wait for the current protection operation before preparing another.');
  if(request.command==='protection.reconcile'||request.command==='protection.cancel')throw new Error('Only an original protection command can be prepared.');
  const relative=`protection/jobs/${request.requestId}.json`;
  if(fs.existsSync(path.join(this.userData,relative))){const prior=this.readJob(request.requestId);if(prior.state!=='ready'||canonical(prior.request)!==canonical(request))throw new Error('The protection request identity already has different durable evidence.');return;}
  this.job(request.requestId,{schemaVersion:1,state:'ready',request});
 }
 private releaseExportCapture(id:string):string[]{
  try{this.exportCaptures.release(id);return[];}catch{return['The output result is recorded, but temporary export-capture cleanup was deferred.'];}
 }
 private cleanupExportCaptures():void{
  let ids:string[];try{ids=this.exportCaptures.ids();}catch{return;}
  for(const id of ids)try{const job=this.readJob(id);if(job.request.command==='protection.export'&&(job.state==='complete'||job.state==='aborted'))this.releaseExportCapture(id);}catch{/* Preserve ambiguous or incomplete evidence. */}
 }
 private completeJob(id:string,request:ProtectionHostRequest,value:ProtectionValue,prepared?:ProtectionJob):ProtectionValue{
  if(value.output&&(!prepared?.destination||!prepared.digest||prepared.destination.path!==value.output.path))throw new Error('The completed output lacks matching publication evidence.');
  const evidence=prepared?.destination&&prepared.digest?{destination:prepared.destination,digest:prepared.digest}:{};
  this.job(id,{schemaVersion:1,state:'complete',request,value,...evidence});
  if(request.command==='protection.export'){const warnings=this.releaseExportCapture(id);if(warnings.length)value={...value,warnings:[...(value.warnings??[]),...warnings]};}
  return value;
 }
 async execute(request:ProtectionHostRequest,replaying=false):Promise<ProtectionValue>{
  if(request.nativePrepareOnly){const {nativePrepareOnly:_nativePrepareOnly,...original}=request;this.prepare(original);return{};}
  if(request.command==='protection.reconcile'){
   const job=this.readJob(request.operationId);
   if(job.request.command==='protection.apply'){
    this.relocateActivation(job.request,request.nativeActivationLocations??[]);
    // Reopen published roots even when only the ZIP acknowledgement was lost.
    if(this.readActivation(job.request))this.resumeActivation(job.request);
   }
   if(job.state==='aborted')return{reconciliation:{operationId:request.operationId,outcome:'not-committed'}};
   if(job.state==='complete'){
    if(job.value?.output){
     if(!job.destination||!job.digest||job.destination.path!==job.value.output.path)throw new Error('The completed output lacks original digest evidence. Preserve the output and recovery metadata.');
     if(hash(readManaged(path.dirname(job.destination.path),path.basename(job.destination.path)))!==job.digest)throw new Error('The completed output changed or moved. Preserve the original operation for recovery.');
    }
    if(job.request.command==='protection.export')this.releaseExportCapture(request.operationId);
    return job.value!;
   }
   if(job.destination&&job.digest&&fs.existsSync(job.destination.path)){
    const bytes=readManaged(path.dirname(job.destination.path),path.basename(job.destination.path));
    if(hash(bytes)===job.digest){
     if(job.request.command==='protection.backup'||job.request.command==='protection.apply'){
      await this.archives.registerCompleted(job.destination.path,{canceled:false,phase:'Reconciling published archive',cancelable:false});
      if(job.request.command==='protection.apply')this.recovery.markApplied(job.request.proposalId);
     }
     const value:ProtectionValue={output:{id:request.operationId,path:job.destination.path,notice:job.request.command==='protection.export'&&job.request.format==='sqlite'?CATALOG_NOTICE:null},...(job.request.command==='protection.apply'?{recovery:this.recovery.view(job.request.proposalId)}:{})};
     return this.completeJob(request.operationId,job.request,value,job);
    }
    if(hash(bytes)!==job.destination.expectedHash)throw new Error('Output evidence changed. Preserve the original operation for recovery.');
   }
   if(request.nativeDestination&&job.request.command==='protection.export')job.request={...job.request,nativeDestination:request.nativeDestination,nativeRuntime:request.nativeRuntime??job.request.nativeRuntime};
   if(request.nativeBackupFolder&&(job.request.command==='protection.backup'||job.request.command==='protection.apply')){job.request={...job.request,nativeBackupFolder:request.nativeBackupFolder};delete job.request.nativeDestination;}
   return this.execute(job.request,true);
  }
  const previous=replaying?this.readJob(request.requestId):undefined;
  let value:ProtectionValue;
  try{value=await this.executeRecorded(request,previous);}
  catch(error){
   if(request.command==='protection.export'&&!replaying&&!(error instanceof UniverseFailure&&error.outcome!=='not-committed')){
    // Record definite failure/cancellation before reclaiming its private capture.
    // If recording is unconfirmed, reconciliation still owns the original pin.
    try{this.job(request.requestId,{schemaVersion:1,state:'aborted',request});}catch(recording){throw new UniverseFailure('RECOVERY_REQUIRED',recording instanceof Error?recording.message:'The export failure outcome needs reconciliation.','unknown');}
    this.releaseExportCapture(request.requestId);
   }
   throw error;
  }
  if(protectionHasDurableEffects(request)){
   try{const prepared=value.output?this.readJob(request.requestId):undefined;value=this.completeJob(request.requestId,request,value,prepared);}
   catch(error){throw new UniverseFailure('RECOVERY_REQUIRED',error instanceof Error?error.message:'Completion recording failed. Reconcile the original operation.','unknown');}
  }
  return value;
 }
 private async executeRecorded(request:ProtectionHostRequest,previous?:ProtectionJob):Promise<ProtectionValue>{
  if(request.command==='protection.cancel'){this.cancel(request.operationId);return{};}if(this.busy)throw new Error('Wait for the current protection operation to finish.');const control:OperationControl={canceled:false,phase:'Preparing saved capture',cancelable:true};this.operations.set(request.requestId,control);
  try{if(protectionHasDurableEffects(request)&&previous?.state!=='prepared')this.job(request.requestId,{schemaVersion:1,state:'started',request});control.beforePublish=(destination,digest)=>this.job(request.requestId,{schemaVersion:1,state:'prepared',request,destination,digest});switch(request.command){
   case 'protection.archives':await this.archives.discover(request.owner,[this.settings.get().backupDestination],control);return{archives:this.archives.registry().filter(r=>ownerKey(r.owner)===ownerKey(request.owner))};
   case 'protection.archive-locate':if(!request.nativeArchive)throw new OperationCanceled();return{archives:await this.archives.locate(request.owner,request.id,request.nativeArchive,control)};
   case 'protection.pending':return{pending:[],proposals:fs.readdirSync(path.join(this.userData,'protection/proposals')).filter(n=>/^[a-f0-9-]{36}\.json$/.test(n)).map(n=>n.slice(0,-5))};
   case 'protection.recents':case 'protection.recent':throw new Error('Recent roots are selected by the native capability owner.');
   case 'protection.history':return{history:this.revisions.list(request.owner)};
   case 'protection.capture':{const manifest=this.revisions.capture(request.owner,request.reason,request.requestId);validateCaptureCatalogs(manifest,this.revisions);return{manifest,warnings:this.retentionWarnings(request.owner)};}
   case 'protection.inspect':{const manifest=this.revisions.get(request.owner,request.revisionId);return this.inspection(manifest);};
   case 'protection.backup':{const manifest=this.revisions.capture(request.owner,request.reason,request.requestId),destination=this.backupDestination(request.nativeDestination,request.owner,manifest,request.nativeBackupFolder);const record=await this.archives.write(manifest,destination,control,request.requestId);return{manifest,output:{id:record.id,path:destination.path,notice:null},warnings:this.retentionWarnings(request.owner)};}
   case 'protection.delete':{const settings=this.settings.get();if(request.kind==='archive')this.archives.remove(request.owner,request.id,settings.retentionDays,true);else this.revisions.remove(request.owner,request.id,this.protectedIds(request.owner),settings.retentionDays,true);return{deleted:request.id};}
   case 'protection.recover':{const manifest=request.revisionId&&request.owner?this.revisions.get(request.owner,request.revisionId):request.nativeArchive?await this.archives.import(request.nativeArchive,control):null;if(!manifest)throw new Error('Choose a complete ZIP or retained revision.');return{...this.inspection(manifest),recovery:this.recovery.begin(manifest,request.scope)};}
   case 'protection.reference':return{recovery:this.recovery.reference(request.proposalId,request.sourceId,request.targetId,request.action,request.replacementId)};
   case 'protection.resume':{const recovery=this.recovery.resume(request.proposalId);return{...this.inspection(this.recovery.manifest(recovery.proposal)),recovery};};
   case 'protection.resolve':return{recovery:this.recovery.resolve(request.proposalId,request.resolution)};
   case 'protection.cancel-recovery':return{recovery:this.recovery.cancel(request.proposalId)};
   case 'protection.apply':return await this.applyRecovery(request,control);
   case 'protection.export':{if(!request.nativeDestination)throw new OperationCanceled();this.assertOutputOutsideRoots(request.nativeDestination.path,true);control.phase='Pinning the saved export generation';await exportSaved(this.exportCaptures.load(request),request.format,request.storyId,request.chapterIds,request.nativeDestination,request.nativeRuntime,control);return{output:{id:randomUUID(),path:request.nativeDestination.path,notice:request.format==='sqlite'?CATALOG_NOTICE:null}};}
   case 'protection.reconcile':throw new Error('Reconciliation must retain its original job.');
   case 'protection.open':throw new Error('Completed outputs are opened by the native capability owner.');
  }}catch(error){if(!control.cancelable)throw new UniverseFailure('RECOVERY_REQUIRED',error instanceof Error?error.message:'Publication outcome requires reconciliation.','unknown');throw error;}finally{this.operations.delete(request.requestId);}
 }
 private inspection(manifest:RevisionManifest):ProtectionValue{const assets=manifest.units.flatMap(unit=>unit.snapshot.assets.map(asset=>{const file=unit.files.find(f=>f.relativePath.startsWith(`images/${asset.id}.`));if(!file)throw new Error('Captured profile image is missing from the immutable closure.');return{...asset,base64:this.revisions.object(manifest.owner,file.object).toString('base64')};}));return{manifest,units:this.revisions.resolve(manifest),assets};}
 private assertOutputOutsideRoots(file:string,includeUserData=false):void{
  const resolved=path.join(fs.realpathSync(path.dirname(file)),path.basename(file)),snapshot=this.workspace.snapshot(),roots=[snapshot.project?.owner,snapshot.universe?.owner].filter((owner):owner is Owner=>!!owner).map(owner=>this.workspace.location(owner));
  if(includeUserData)roots.push(this.userData);
  for(const root of roots){const relative=path.relative(fs.realpathSync(root),resolved);if(!relative||relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative))throw new Error('The output destination is inside an active writing root. Choose another output location.');}
 }
 private backupDestination(selected:NativeDestination|undefined,owner:Owner,manifest:RevisionManifest,nativeFolder?:string):NativeDestination{
  if(selected){this.assertOutputOutsideRoots(selected.path);return selected;}
  const folder=nativeFolder??this.settings.get().backupDestination;if(!folder)throw new Error('Choose a backup destination.');
  const stem=`${safeDisplayName(manifest.displayName)}${owner.kind==='project'?'_'+safeDisplayName(manifest.universeDisplayName):''}_${manifest.localCaptureStart}`;let name=stem+'.zip',suffix=2;
  while(fs.existsSync(path.join(folder,name)))name=`${stem}_${suffix++}.zip`;
  const destination={path:path.join(folder,name),expectedHash:null};this.assertOutputOutsideRoots(destination.path);return destination;
 }

 private protectedIds(owner:Owner){const ids=this.archives.protectedRevisionIds();const live=this.workspace.snapshot(),owners=[owner,...[live.project?.owner,live.universe?.owner].filter((o):o is Owner=>!!o)];for(const candidate of new Map(owners.map(o=>[ownerKey(o),o])).values())for(const manifest of this.revisions.list(candidate))for(const id of manifest.retainedRevisionIds)ids.add(id);for(const name of fs.readdirSync(path.join(this.userData,'protection/proposals')).filter(n=>/^[a-f0-9-]{36}\.json$/.test(n))){try{const proposal=this.recovery.get(name.replace(/\.json$/,''));if(proposal.status!=='applied'){ids.add(proposal.revisionId);if(proposal.replacedRevisionId)ids.add(proposal.replacedRevisionId);}}catch{throw new Error('Uncertain pending recovery evidence blocks retention.');}}return ids;}
 private retentionWarnings(owner:Owner):string[]{try{this.retain(owner);return[];}catch(error){return['The capture completed, but automatic cleanup was deferred. '+(error instanceof Error?error.message:'Retained evidence could not be checked.')];}}
 private retain(owner:Owner){
  const settings=this.settings.get(),protectedIds=this.protectedIds(owner);
  for(const m of this.revisions.list(owner).reverse())if(!protectedIds.has(m.id))this.revisions.remove(owner,m.id,protectedIds,settings.retentionDays);
  const archives=this.archives.registry().filter(a=>ownerKey(a.owner)===ownerKey(owner)).sort((a,b)=>Date.parse(b.capturedAt)-Date.parse(a.capturedAt)),newestTen=new Set(archives.slice(0,10).map(a=>a.id));
  for(const archive of archives.reverse()){
   if(newestTen.has(archive.id)||BigInt(Date.now()-Date.parse(archive.capturedAt))<BigInt(settings.retentionDays)*86400000n)continue;
   this.archives.remove(owner,archive.id,settings.retentionDays);
  }
 }

 private async applyRecovery(request:ProtectionHostRequest&{command:'protection.apply'},control:OperationControl):Promise<ProtectionValue>{
  let activated:{project:string|null;universe:string}|undefined,manifest:RevisionManifest;
  const existing=this.readActivation(request);
  if(existing){control.cancelable=false;control.phase='Resuming confirmed activation';activated=this.resumeActivation(request);manifest=this.revisions.capture(this.recovery.get(request.proposalId).owner,'Recovered',request.requestId);}
  else{
   const result=this.recovery.apply(request.proposalId,undefined,()=>{control.cancelable=false;control.phase='Applying confirmed recovery';},request.requestId);
   manifest=result.manifest;
   if(result.needsActivation){
    if(!request.nativeActivation)throw new Error('Choose an empty recovery destination before activation.');
    const live=this.workspace.snapshot(),coordinated=!!live.universe&&manifest.owner.kind==='project';
    const locations={project:manifest.owner.kind==='project'?request.nativeActivation.project:null,universe:coordinated?this.workspace.location(live.universe!.owner):request.nativeActivation.universe};
    if(!coordinated&&canonical(result.units)!==canonical(this.revisions.resolve(manifest)))throw new Error('The confirmed recovery differs from the captured catalogs. Preserve the proposal for reconciliation.');
    const proposal=this.recovery.get(request.proposalId);
    validateCaptureCatalogs(manifest,this.revisions);
    const staged=new Map<string,{dev:number;ino:number}>();let decision:ActivationDecision;
    try{
     const participants=this.revisions.resolve(manifest).filter(u=>!coordinated||u.owner.kind==='project').map(unit=>this.stageActivation(manifest,unit,locations,staged));
     decision={schemaVersion:2,requestId:request.requestId,proposalId:proposal.id,manifestId:manifest.id,operationId:proposal.operationId,state:coordinated?'await-coordinator':'commit',locations,participants};
     if(!validActivationDecision(decision))throw new Error('Recovery destinations must be separate from every owning and staging root.');
    }catch(error){this.discardUnpublishedStages(staged);throw error;}
    // Every staged tree is durable before the one publication decision is made.
    control.cancelable=false;control.phase='Activating confirmed recovery';
    publishManagedBytes(this.userData,activationPath(request.requestId),Buffer.from(jsonBytes(decision)),null);
    activated=this.resumeActivation(request);
    manifest=this.revisions.capture(manifest.owner,'Recovered',request.requestId);
   }else control.cancelable=false;
  }
  const destination=this.backupDestination(request.nativeDestination,manifest.owner,manifest,request.nativeBackupFolder),record=await this.archives.write(manifest,destination,control,request.requestId);
  this.recovery.markApplied(request.proposalId);
  return{recovery:this.recovery.view(request.proposalId),...(activated?{activated}:{}),output:{id:record.id,path:destination.path,notice:null}};
 }
 private readActivation(request:ProtectionHostRequest&{command:'protection.apply'}):ActivationDecision|undefined{
  const relative=activationPath(request.requestId),proposal=this.recovery.get(request.proposalId);
  if(!fs.existsSync(path.join(this.userData,relative))){
   // Legacy decisions lack a binding to the original Apply request. Never guess.
   if(fs.existsSync(path.join(this.userData,`protection/activation-${proposal.revisionId}.json`)))throw new Error('Legacy activation evidence needs explicit identity reconciliation. Preserve the existing roots and decision.');
   return undefined;
  }
  const value=decode(readManaged(this.userData,relative));
  if(!validActivationDecision(value)||value.requestId!==request.requestId||value.proposalId!==proposal.id||value.manifestId!==proposal.revisionId||value.operationId!==proposal.operationId)throw new Error('The original activation decision is invalid. Preserve all recovery evidence.');
  const manifest=this.recovery.manifest(proposal);
  if(!value.participants.every(p=>manifest.units.some(u=>ownerKey(u.snapshot.owner)===ownerKey(p.owner)&&u.snapshot.rootId===p.rootId))||proposal.owner.kind==='project'&&value.locations.project===null||!value.participants.some(p=>ownerKey(p.owner)===ownerKey(proposal.owner)))throw new Error('Activation participants do not match the confirmed capture.');
  return value;
 }
 private saveActivation(decision:ActivationDecision){const relative=activationPath(decision.requestId);publishManagedBytes(this.userData,relative,Buffer.from(jsonBytes(decision)),hash(readManaged(this.userData,relative)));}
 private assertActivationIdentity(root:string,participant:Pick<ActivationParticipant,'owner'|'rootId'>){
  const discovery=decode(readManaged(root,'writingtool.json'));
  if(!discovery||typeof discovery!=='object'||!('kind'in discovery)||!('id'in discovery)||!('rootId'in discovery)||discovery.kind!==participant.owner.kind||discovery.id!==participant.owner.id||discovery.rootId!==participant.rootId)throw new Error('An activation participant identity changed. Locate the original owning root.');
 }
 private stageActivation(manifest:RevisionManifest,unit:import('../application/contracts/workspace').WorkspaceUnitSnapshot,locations:{project:string|null;universe:string},staged:Map<string,{dev:number;ino:number}>):ActivationParticipant{
  const destination=unit.owner.kind==='project'?locations.project:locations.universe;
  if(!destination)throw new Error('A project recovery needs both owning destinations.');
  this.assertEmptyDestination(destination);
  const stage=path.join(path.dirname(destination),`.recovery-${randomUUID()}`);fs.mkdirSync(stage,{mode:0o700});
  const identity=fs.lstatSync(stage);staged.set(stage,{dev:identity.dev,ino:identity.ino});
  for(const directory of ['images','profiles','projects','database/operations'])fs.mkdirSync(path.join(stage,directory),{recursive:true,mode:0o700});
  for(const file of manifest.units.find(u=>ownerKey(u.snapshot.owner)===ownerKey(unit.owner))!.files){const target=path.join(stage,file.relativePath);fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});fs.writeFileSync(target,this.revisions.object(manifest.owner,file.object),{flag:'wx',mode:0o600});}
  const catalog=new DatabaseSync(path.join(stage,'database/catalog.sqlite'));
  try{const binding=catalog.prepare('SELECT basePath FROM root_locations').get();if(binding&&fs.existsSync(String(binding.basePath))){const previous=String(binding.basePath);if(fs.existsSync(path.join(previous,'writingtool.json'))){const discovery=decode(readManaged(previous,'writingtool.json')) as {id?:string;rootId?:string};if(discovery.id===unit.owner.id||discovery.rootId===unit.rootId)throw new Error('The original authority is accessible. Locate and reconcile with it before activation.');}else if(fs.existsSync(path.join(previous,'database/catalog.sqlite')))throw new Error('The original authority identity is uncertain. Locate it before activation.');}}finally{catalog.close();}
  rebindCapturedCatalog(stage,unit,locations.universe);this.copyProtectionClosure(stage,unit.owner);this.flushTree(stage);syncDir(path.dirname(stage));
  return{stage,destination,owner:unit.owner,rootId:unit.rootId};
 }
 private discardUnpublishedStages(staged:Map<string,{dev:number;ino:number}>):void{
  for(const [stage,identity]of staged)try{
   const stat=fs.lstatSync(stage);
   if(!stat.isDirectory()||stat.isSymbolicLink()||stat.dev!==identity.dev||stat.ino!==identity.ino||fs.realpathSync(stage)!==stage)continue;
   fs.rmSync(stage,{recursive:true});syncDir(path.dirname(stage));
  }catch{/* Uncertain private staging evidence is preserved; no activation decision was published. */}
 }
 private assertEmptyDestination(destination:string){
  if(!fs.existsSync(destination))return;
  const stat=fs.lstatSync(destination);
  if(!stat.isDirectory()||stat.isSymbolicLink()||fs.readdirSync(destination).length)throw new Error('Recovery destination changed. Preserve the staged roots and original decision.');
 }
 private relocateActivation(request:ProtectionHostRequest&{command:'protection.apply'},locations:ActivationLocation[]){
  if(!locations.length)return;
  const decision=this.readActivation(request);if(!decision)throw new Error('No original activation decision exists for these locations.');
  if(new Set(locations.map(p=>p.rootId)).size!==locations.length)throw new Error('Duplicate activation location capabilities.');
  for(const selected of locations){
   if(!validActivationPath(selected.location)||selected.destination!==undefined&&!validActivationPath(selected.destination))throw new Error('Invalid activation path bytes.');
   const participant=decision.participants.find(p=>p.rootId===selected.rootId&&ownerKey(p.owner)===ownerKey(selected.owner));
   if(!participant){
    const universe=this.recovery.manifest(this.recovery.get(request.proposalId)).units.find(u=>u.snapshot.owner.kind==='universe')!.snapshot;
    if(selected.destination)throw new Error('A universe location cannot change a staged publication destination.');
    if(decision.participants.length!==1||decision.participants[0].owner.kind!=='project'||ownerKey(selected.owner)!==ownerKey(universe.owner)||selected.rootId!==universe.rootId)throw new Error('The selected root is outside the original activation.');
    this.assertActivationIdentity(selected.location,{owner:universe.owner,rootId:universe.rootId});
    decision.locations.universe=selected.location;continue;
   }
   const relocated=relocateActivationParticipant(participant,decision.state,selected);
   Object.assign(participant,relocated);
   if(participant.owner.kind==='project')decision.locations.project=participant.destination;else decision.locations.universe=participant.destination;
  }
  if(!validActivationDecision(decision))throw new Error('The selected activation locations overlap.');
  this.saveActivation(decision);
 }
 private resumeActivation(request:ProtectionHostRequest&{command:'protection.apply'}):{project:string|null;universe:string}{
  const decision=this.readActivation(request);if(!decision)throw new Error('No activation decision exists.');
  if(decision.participants.length===1&&decision.participants[0].owner.kind==='project'){
   const universe=this.recovery.manifest(this.recovery.get(request.proposalId)).units.find(u=>u.snapshot.owner.kind==='universe')!.snapshot;
   this.assertActivationIdentity(decision.locations.universe,{owner:universe.owner,rootId:universe.rootId});
   const project=decision.participants[0],projectRoot=activationRootAt(project.stage,project)??activationRootAt(project.destination,project);
   if(!projectRoot)throw new Error('Locate the original recovered project before activation reconciliation.');
   this.assertActivationIdentity(projectRoot,project);
   this.coordinator.locateActivationParticipant(universe.owner,universe.rootId,universe.universeId,decision.locations.universe);
   this.coordinator.locateActivationParticipant(project.owner,project.rootId,universe.universeId,projectRoot);
   const current=this.workspace.snapshot();
   if(!current.universe)this.openRecovered({project:null,universe:decision.locations.universe});
   else if(current.universe.rootId!==universe.rootId||ownerKey(current.universe.owner)!==ownerKey(universe.owner))throw new Error('The original universe is required for activation reconciliation.');
  }
  if(decision.state==='await-coordinator'){
   const live=this.workspace.snapshot(),manifest=this.recovery.manifest(this.recovery.get(request.proposalId)),universe=manifest.units.find(u=>u.snapshot.owner.kind==='universe')!.snapshot;
   if(!live.universe||ownerKey(live.universe.owner)!==ownerKey(universe.owner)||live.universe.rootId!==universe.rootId)throw new Error('Reopen the original universe before reconciling its project activation.');
   decision.locations.universe=this.workspace.location(live.universe.owner);
   const participant=decision.participants[0];this.assertActivationIdentity(participant.stage,participant);
   // Opening registers the exact staged root at its current location before coordinator recovery.
   const store=new FileProjectStorage(this.coordinator).open(participant.stage);
   try{store.bind(decision.locations.universe);this.workspace.withRecoveryProject(store.workspace,participant.stage,()=>{
    const proposal=this.recovery.get(request.proposalId);
    if(!proposal.expected.some(e=>ownerKey(e.owner)===ownerKey(participant.owner)))this.recovery.bindStaged(proposal.id,participant.owner,store.workspace.snapshot().generation);
    if(proposal.status==='review')this.recovery.apply(proposal.id,live.universe!.owner,()=>{},request.requestId);
    if(!this.workspace.reconcile(decision.operationId))throw new Error('Activation remains pending its original coordinator decision.');
   });}finally{store.close();}
   decision.state='commit';this.saveActivation(decision);
  }
  // Validate the whole participant set before publishing even the first rename.
  const stagedParticipants=decision.participants.filter(participant=>{
   const staged=activationRootAt(participant.stage,participant),published=activationRootAt(participant.destination,participant);
   if(staged&&published)throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
   if(!staged&&!published)throw new Error('Locate the original recovered owning root before activation reconciliation.');
   if(staged&&!activationDestinationAvailable(participant.destination,staged))throw new Error('Choose an empty publication destination on the staged recovery filesystem.');
   return !!staged;
  });
  if(decision.state!=='complete'||stagedParticipants.length){
   for(const participant of stagedParticipants){
    this.assertActivationIdentity(participant.stage,participant);this.assertEmptyDestination(participant.destination);
    if(fs.existsSync(participant.destination))fs.rmdirSync(participant.destination);
    fs.renameSync(participant.stage,participant.destination);syncDir(path.dirname(participant.destination));if(path.dirname(participant.stage)!==path.dirname(participant.destination))syncDir(path.dirname(participant.stage));
   }
   decision.state='complete';this.saveActivation(decision);
  }
  // Choice locking survives failure to open or publish the mandatory reconciled ZIP.
  this.recovery.markBackupRequired(request.proposalId);
  this.openRecovered(decision.locations);
  return decision.locations;
 }
 private flushTree(root:string){for(const entry of fs.readdirSync(root,{withFileTypes:true})){const file=path.join(root,entry.name);if(entry.isDirectory())this.flushTree(file);else{const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}}syncDir(root);}
 private copyProtectionClosure(root:string,owner:Owner){ensureManagedDirectory(root,'history/protection/manifests');ensureManagedDirectory(root,'history/protection/objects');for(const m of this.revisions.list(owner)){publishManagedBytes(root,`history/protection/manifests/${m.id}.json`,Buffer.from(jsonBytes(m)),null);for(const u of m.units)for(const f of u.files){const relative=`history/protection/objects/${f.object.sha256}`;if(!fs.existsSync(path.join(root,relative)))publishManagedBytes(root,relative,this.revisions.object(owner,f.object),null);}}}

}
