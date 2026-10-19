import fs from 'node:fs';
import path from 'node:path';
import {app,dialog,shell,type BrowserWindow} from 'electron';
import {RecentRoots} from '../infrastructure/recent-roots';
import {safeDisplayName} from '../domain/capture-time';
import {closed} from '../domain/validation';
import {activationPath,activationRootAt,activationDestinationAvailable,validActivationDecision,type ActivationLocation} from '../infrastructure/recovery-activation';
import {protectionOperationId,validProposal,digest,type ProtectionRequest,type ProtectionHostRequest,type ProtectionResult} from '../application/contracts/protection';
import {decode,hash,publishManagedBytes,readManaged,ensureManagedDirectory,jsonBytes,hashFile} from '../infrastructure/universe-files';
export function nativeProtection(deps:{window:()=>BrowserWindow;roots:()=>string[];activeOwners:()=>import('../domain/workspace').Owner[];originalRequest:(operationId:string)=>ProtectionHostRequest|undefined;originalUniverse:(operationId:string)=>ActivationLocation|undefined;settings:()=>Promise<{backupDestination:string|null}>;sourceName:(r:ProtectionRequest)=>Promise<string>;openRoot:(owner:import('../domain/workspace').Owner,location:string)=>Promise<{project:string|null;universe:string}>;send:(r:ProtectionHostRequest)=>Promise<ProtectionResult>}){
 const recents=new RecentRoots(app.getPath('userData'));
 const outputs=new Map<string,{path:string;hash:string}>();
 const verifyOutput=(operationId:string,output:{path:string}):string=>{
  const job=decode(readManaged(app.getPath('userData'),`protection/jobs/${operationId}.json`));
  if(!job||typeof job!=='object'||!('state'in job)||job.state!=='complete'||!('destination'in job)||!closed(job.destination,['path','expectedHash'])||job.destination.path!==output.path||!('digest'in job)||!digest(job.digest))throw new Error('The completed output has no matching durable publication proof. Reconcile the original operation.');
  const observed=hashFile(output.path);if(observed!==job.digest)throw new Error('The completed output changed before acknowledgement. Preserve it and reconcile the original operation.');return observed;
 };
 const inside=(file:string,root:string)=>{const relative=path.relative(root,file);return !relative||relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative);};
 function checkBackupFolder(folder:string,roots:string[]):string{if(roots.some(root=>inside(folder,root)))throw new Error('Choose a backup folder outside active writing roots.');return folder;}
 async function chooseFile(title:string,extension:string,suggested:string,roots:string[]):Promise<{path:string;expectedHash:string|null}|null>{for(;;){const result=await dialog.showSaveDialog(deps.window(),{title,defaultPath:suggested,filters:[{name:extension.toUpperCase(),extensions:[extension]}],properties:['showOverwriteConfirmation','createDirectory']});if(result.canceled||!result.filePath)return null;const file=path.resolve(result.filePath.toLowerCase().endsWith('.'+extension)?result.filePath:result.filePath+'.'+extension),parent=fs.realpathSync(path.dirname(file)),resolved=path.join(parent,path.basename(file));if(roots.some(root=>inside(resolved,root)))throw new Error('Choose an output outside all active writing roots.');let expectedHash:string|null=null;try{const stat=fs.lstatSync(resolved);if(!stat.isFile()||stat.nlink!==1||stat.isSymbolicLink())throw new Error('Choose a regular unaliased output.');expectedHash=hashFile(resolved);}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}return{path:resolved,expectedHash};}}
 async function backupFolder(closing:boolean,choose:boolean):Promise<string|null>{let folder=(await deps.settings()).backupDestination;if(folder&&!choose)try{fs.accessSync(folder,fs.constants.W_OK);return fs.realpathSync(folder);}catch{}const selected=await dialog.showOpenDialog(deps.window(),{title:closing?'Choose the required closing backup folder':'Choose backup folder',properties:['openDirectory','createDirectory']});if(!selected.canceled&&selected.filePaths[0])return fs.realpathSync(selected.filePaths[0]);if(!closing)return null;for(const root of [path.dirname(app.getPath('exe')),app.getPath('userData')]){try{ensureManagedDirectory(root,'Backups');folder=path.join(root,'Backups');const notice=Buffer.from(jsonBytes({schemaVersion:1,folder,createdAt:new Date().toISOString(),used:false,actualPath:null}));const userData=app.getPath('userData'),relative='protection/close-fallback.json';ensureManagedDirectory(userData,'protection');const old=fs.existsSync(path.join(userData,relative))?hash(readManaged(userData,relative)):null;publishManagedBytes(userData,relative,notice,old);return folder;}catch{}}throw new Error('Neither approved closing backup fallback is writable. Choose another folder or cancel closing.');}
 return async(request:ProtectionRequest):Promise<ProtectionResult>=>{const base={protocolVersion:1 as const,requestId:request.requestId,command:request.command};let sent=false;try{
 if(request.command==='protection.recents')return{...base,status:'ok',value:{recents:recents.list().map(r=>({id:r.id,owner:r.owner,name:r.name,available:recents.available(r)}))}};
 if(request.command==='protection.recent'){const recent=recents.list().find(r=>r.id===request.id);if(!recent)throw new Error('That recent root is unavailable.');if(request.action==='remove'){recents.remove(recent.id);return{...base,status:'ok',value:{recents:recents.list().map(r=>({id:r.id,owner:r.owner,name:r.name,available:recents.available(r)}))}};}let location=recent.location;if(request.action==='locate'){const selected=await dialog.showOpenDialog(deps.window(),{title:'Locate '+recent.name,properties:['openDirectory']});if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};location=fs.realpathSync(selected.filePaths[0]);}const candidate={...recent,location};if(!recents.available(candidate))throw new Error('Locate the matching permanent root identity or recover a complete ZIP.');const activated=await deps.openRoot(recent.owner,location);const warnings:string[]=[];try{recents.remember(recent.owner,recent.rootId,recent.name,location);}catch{warnings.push('The owning roots opened, but the recent-root list could not be updated.');}return{...base,status:'ok',value:{activated,warnings}};}
 if(request.command==='protection.open'){const output=outputs.get(request.outputId);if(!output||hashFile(output.path)!==output.hash)throw new Error('This completed output is unavailable or changed.');if(request.folder)shell.showItemInFolder(output.path);else{const error=await shell.openPath(output.path);if(error)throw new Error(error);}return{...base,status:'ok',value:{}};}
 const original=request.command==='protection.reconcile'?deps.originalRequest(request.operationId):request;let host:ProtectionHostRequest={...request};const roots=deps.roots().map(root=>fs.realpathSync(root));
 if(request.command==='protection.reconcile'&&original?.command==='protection.apply'){
  const relative=activationPath(request.operationId),userData=app.getPath('userData');
  if(fs.existsSync(path.join(userData,relative))){
   const decision=decode(readManaged(userData,relative));
   if(!validActivationDecision(decision)||decision.requestId!==request.operationId||decision.proposalId!==original.proposalId)throw new Error('The original activation evidence is invalid.');
   const locations:ActivationLocation[]=[];
   for(const participant of decision.participants){
    const staged=activationRootAt(participant.stage,participant),published=activationRootAt(participant.destination,participant);
    if(staged&&published)throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
    if(published)continue;
    if(staged&&activationDestinationAvailable(participant.destination,staged))continue;
    let location=staged;
    if(!location){
     const selected=await dialog.showOpenDialog(deps.window(),{title:`Locate the original recovered ${participant.owner.kind} (${participant.owner.id})`,properties:['openDirectory']});
     if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};
     location=activationRootAt(fs.realpathSync(selected.filePaths[0]),participant);
     if(!location)throw new Error('Locate the matching permanent recovery root identity.');
    }
    let destination:string|undefined;
    if(staged||decision.state==='await-coordinator'){
     const selectedDestination=await dialog.showOpenDialog(deps.window(),{title:`Choose an empty folder for publishing the recovered ${participant.owner.kind}`,defaultPath:path.dirname(location),properties:['openDirectory','createDirectory']});
     if(selectedDestination.canceled||!selectedDestination.filePaths[0])return{...base,status:'canceled'};
     destination=fs.realpathSync(selectedDestination.filePaths[0]);
     if(!activationDestinationAvailable(destination,location))throw new Error('Choose an empty publication folder on the same filesystem as the staged recovery root.');
    }
    locations.push({owner:participant.owner,rootId:participant.rootId,location,...(destination?{destination}:{})});
   }
   const universe=deps.originalUniverse(request.operationId);
   if(universe&&!decision.participants.some(p=>p.owner.kind==='universe'))locations.push(universe);
   if(locations.length)host={...host,nativeActivationLocations:locations};
  }
 }
 if(request.command==='protection.reconcile'&&request.chooseLocation){
  if(original?.command==='protection.export'){
   const destination=await chooseFile('Retry saved '+(original.format==='sqlite'?'catalog':'manuscript')+' export',original.format,`${safeDisplayName(await deps.sourceName(original))}.${original.format}`,[...roots,app.getPath('userData')]);
   if(!destination)return{...base,status:'canceled'};
   host={...host,nativeDestination:destination,nativeRuntime:runtimePath()};
  }else{
   if(original?.command!=='protection.backup'&&original?.command!=='protection.apply')throw new Error('Only an original backup, recovery or export operation can choose another output location.');
   const folder=await backupFolder(original.command==='protection.backup'&&original.closing,true);if(!folder)return{...base,status:'canceled'};host={...host,nativeBackupFolder:checkBackupFolder(folder,roots)};
  }
 }
 if(request.command==='protection.export'){const destination=await chooseFile('Export saved '+(request.format==='sqlite'?'catalog':'manuscript'),request.format,`${safeDisplayName(await deps.sourceName(request))}${request.format==='sqlite'?'_catalog':request.chapterIds!==null?'_selected_chapters':''}.${request.format}`,[...roots,app.getPath('userData')]);if(!destination)return{...base,status:'canceled'};host={...host,nativeDestination:destination,nativeRuntime:runtimePath()};}
 if(request.command==='protection.backup'){const folder=await backupFolder(request.closing,request.chooseLocation);if(!folder)return{...base,status:'canceled'};host={...host,nativeBackupFolder:checkBackupFolder(folder,roots)};}
 if(request.command==='protection.archive-locate'||request.command==='protection.recover'&&!request.revisionId){const selected=await dialog.showOpenDialog(deps.window(),{title:'Recover independent complete ZIP',properties:['openFile'],filters:[{name:'Complete WritingTool backup',extensions:['zip']}]});if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};host={...host,nativeArchive:fs.realpathSync(selected.filePaths[0])};}
 if(request.command==='protection.apply'){const proposal=decode(readManaged(app.getPath('userData'),`protection/proposals/${request.proposalId}.json`));if(!validProposal(proposal)||proposal.id!==request.proposalId)throw new Error('The recovery proposal is unavailable or invalid.');if(!deps.activeOwners().some(owner=>owner.kind===proposal.owner.kind&&owner.id===proposal.owner.id)){const chosen=await dialog.showOpenDialog(deps.window(),{title:'Choose an empty folder for recovered owning roots',properties:['openDirectory','createDirectory']});if(chosen.canceled||!chosen.filePaths[0])return{...base,status:'canceled'};const root=fs.realpathSync(chosen.filePaths[0]);if(roots.some(live=>inside(root,live)||inside(live,root)))throw new Error('Choose a recovery folder separate from the active writing roots.');if(fs.readdirSync(root).length)throw new Error('Choose an empty recovery folder.');host={...host,nativeActivation:{project:path.join(root,'Project'),universe:path.join(root,'Universe')}};const folder=await backupFolder(false,false);if(!folder)return{...base,status:'canceled'};host={...host,nativeBackupFolder:checkBackupFolder(folder,roots)};}else{const folder=await backupFolder(false,false);if(!folder)return{...base,status:'canceled'};host={...host,nativeBackupFolder:checkBackupFolder(folder,roots)};}}
 sent=true;const result=await deps.send(host);const outputDigest=result.status==='ok'&&result.value.output?verifyOutput(protectionOperationId(request),result.value.output):undefined;if(result.status==='ok'&&result.value.output&&original?.command==='protection.backup'&&original.closing){const root=app.getPath('userData'),relative='protection/close-fallback.json';if(fs.existsSync(path.join(root,relative))){const bytes=readManaged(root,relative),notice=decode(bytes);if(!closed(notice,['schemaVersion','folder','createdAt','used','actualPath'])||notice.schemaVersion!==1||typeof notice.folder!=='string'||!path.isAbsolute(notice.folder)||typeof notice.createdAt!=='string'||!Number.isFinite(Date.parse(notice.createdAt))||typeof notice.used!=='boolean'||notice.actualPath!==null&&typeof notice.actualPath!=='string')throw new Error('Closing backup location evidence is invalid. Reconcile before closing.');if(path.relative(notice.folder,path.dirname(result.value.output.path))==='')publishManagedBytes(root,relative,Buffer.from(jsonBytes({schemaVersion:1,folder:notice.folder,createdAt:new Date().toISOString(),used:true,actualPath:result.value.output.path})),hash(bytes));}}if(result.status==='ok'&&result.value.output)outputs.set(result.value.output.id,{path:result.value.output.path,hash:outputDigest!});return result;
 }catch(e){return{...base,status:'error',message:e instanceof Error?e.message:'Native protection selection failed.',outcome:sent?'unknown':'not-committed',operationId:sent?protectionOperationId(request):null};}};
}
export function runtimePath():string{const resources=app.isPackaged?process.resourcesPath:path.join(app.getAppPath(),'resources');const root=path.join(resources,'libreoffice');return process.platform==='win32'?path.join(root,'program/soffice.exe'):process.platform==='darwin'?path.join(root,'LibreOffice.app/Contents/MacOS/soffice'):path.join(root,'program/soffice');}
