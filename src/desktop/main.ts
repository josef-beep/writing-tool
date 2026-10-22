import {activationPath,activationRootAt,validActivationDecision} from '../infrastructure/recovery-activation';
import {configureConfinedFs} from '../infrastructure/confined-fs';
import {RecentRoots} from '../infrastructure/recent-roots';
import {nativeProtection} from './protection';
import {PROTECTION_CHANNEL,validProtectionRequest,protectionHasDurableEffects,canDeferProtection,type ProtectionResult} from '../application/contracts/protection';
import {ProtectionHostClient} from './protection-host-client';
import {registerPresentation} from './presentation';
import {WORKSPACE_CHANNEL,validWorkspaceRequest,type WorkspaceHostRequest,type WorkspaceResult} from '../application/contracts/workspace';
import {WorkspaceHostClient,workspaceUnavailable} from './workspace-host-client';
import {decode,hash,publishManagedBytes,readManaged,ensureManagedDirectory,removeManagedBytes,jsonBytes} from '../infrastructure/universe-files';
import { PROJECT_CHANNEL, validProjectRequest, type ProjectHostRequest, type ProjectResult } from '../application/contracts/project';
import { ProjectHostClient, projectUnavailable } from './project-host-client';
import { randomUUID } from 'node:crypto';
import { UNIVERSE_CHANNEL, validUniverseRequest, closed, isUuid, type SaveReceipt, type ReconciliationExpectation, type UniverseSnapshot } from '../application/contracts/universe';
import { UniverseHostClient, hostUnavailable } from './universe-host-client';
import { app, BrowserWindow, dialog, ipcMain, utilityProcess, nativeImage, powerMonitor, type IpcMainInvokeEvent, type UtilityProcess } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import squirrelStartup from 'electron-squirrel-startup';
import { validRequest } from '../application/contracts/readiness';
import { HostClient } from './host-client';
import { READINESS_CHANNEL, trustedSender } from './security';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const diagnostic = process.env.WRITINGTOOL_DIAGNOSTIC === '1';
const fault = diagnostic ? process.env.WRITINGTOOL_HOST_FAULT : undefined;
if (diagnostic && process.env.WRITINGTOOL_PROFILE)
    app.setPath('userData', process.env.WRITINGTOOL_PROFILE);
let window: BrowserWindow | undefined;
let disposePresentation:(()=>void)|undefined;
let child: UtilityProcess | undefined;
let client: HostClient | undefined;
let universeClient: UniverseHostClient | undefined;
let projectClient: ProjectHostClient | undefined;
let workspaceClient:WorkspaceHostClient|undefined;
let protectionClient:ProtectionHostClient|undefined;
let protectionInFlight=false;
type PendingProtection={request:import('../application/contracts/protection').ProtectionHostRequest;project:string|null;universe:string|null;projectIdentity:{id:string;rootId:string}|null;universeIdentity:{id:string;rootId:string}|null;dispatch:'prepared'|'attempted';deferred?:true};
const pendingProtection=new Map<string,PendingProtection>();
let activeProjectLocation:string|undefined;
let activeProjectIdentity:{id:string;rootId:string}|undefined;
let workspaceInFlight=false;
const pendingWorkspace=new Map<string,{request:WorkspaceHostRequest;projectLocation:string|undefined;universeLocation:string|undefined;projectIdentity:{id:string;rootId:string}|undefined;universeIdentity:{id:string;rootId:string}|undefined}>();
let projectInFlight = false;
let universeInFlight = false;
let pendingProjectCreation: {operationId: string; location: string} | undefined;
let hostExited = false;
let authorityRestorePending=false;
let drained = false;
let draining = false;
let quitPermit: 'window' | 'app' | undefined;
let quitDecisionInFlight = false;
const mutationLocations = new Map<string, {
    location: string;
    expected: ReconciliationExpectation;
}>();
const unresolvedOperations = new Set<string>();
function hasBlockingOperations():boolean{return [...unresolvedOperations].some(id=>{const operation=pendingProtection.get(id);return !operation||!canDeferProtection(operation.request.command);});}
function pendingProtectionPath(id:string){return `protection/native-pending/${id}.json`;}
function savePendingProtection(id:string,value:PendingProtection){const root=app.getPath('userData');ensureManagedDirectory(root,'protection/native-pending');const relative=pendingProtectionPath(id),old=fs.existsSync(path.join(root,relative))?hash(readManaged(root,relative)):null;publishManagedBytes(root,relative,Buffer.from(jsonBytes(value)),old);}
function forgetPendingProtection(id:string){const root=app.getPath('userData'),relative=pendingProtectionPath(id);try{if(fs.existsSync(path.join(root,relative)))removeManagedBytes(root,relative,hash(readManaged(root,relative)));}catch(error){unresolvedOperations.add(id);throw error;}pendingProtection.delete(id);unresolvedOperations.delete(id);}
function pendingProtectionState(){return{pending:[...pendingProtection.keys()],deferrable:[...pendingProtection].filter(([,pending])=>canDeferProtection(pending.request.command)).map(([id])=>id),deferred:[...pendingProtection].filter(([,pending])=>pending.deferred).map(([id])=>id)};}
function loadPendingProtection(){
 const root=app.getPath('userData');fs.mkdirSync(root,{recursive:true,mode:0o700});ensureManagedDirectory(root,'protection/native-pending');
 for(const name of fs.readdirSync(path.join(root,'protection/native-pending'))){
  const value=decode(readManaged(root,'protection/native-pending/'+name));
  if(!closed(value,['request','project','universe','projectIdentity','universeIdentity',...(typeof value==='object'&&value!==null&&Object.hasOwn(value,'dispatch')?['dispatch']:[]),...(typeof value==='object'&&value!==null&&Object.hasOwn(value,'deferred')?['deferred']:[])])||!validProtectionRequest(value.request,true)||value.request.nativePrepareOnly||value.request.command==='protection.defer'||Object.hasOwn(value,'deferred')&&(value.deferred!==true||!canDeferProtection(value.request.command))||name!==value.request.requestId+'.json'||Object.hasOwn(value,'dispatch')&&!['prepared','attempted'].includes(String(value.dispatch))||![value.projectIdentity,value.universeIdentity].every(identity=>identity===null||closed(identity,['id','rootId'])&&isUuid(identity.id)&&isUuid(identity.rootId))||(value.project!==null&&(typeof value.project!=='string'||!path.isAbsolute(value.project)))||(value.universe!==null&&(typeof value.universe!=='string'||!path.isAbsolute(value.universe))))throw new Error('Pending protection metadata is invalid. Preserve application data for recovery.');
  const pending:PendingProtection={request:value.request,project:value.project as string|null,universe:value.universe as string|null,projectIdentity:value.projectIdentity as PendingProtection['projectIdentity'],universeIdentity:value.universeIdentity as PendingProtection['universeIdentity'],dispatch:value.dispatch==='prepared'?'prepared':'attempted',...(value.deferred===true?{deferred:true as const}:{})};
  pendingProtection.set(value.request.requestId,pending);if(!pending.deferred)unresolvedOperations.add(value.request.requestId);
 }
}

function rememberMutation(id: string, location: string, expected: ReconciliationExpectation): void {
    mutationLocations.set(id, { location, expected });
    unresolvedOperations.add(id);
    for (const oldId of mutationLocations.keys()) {
        if (mutationLocations.size <= 32)
            break;
        if (!unresolvedOperations.has(oldId))
            mutationLocations.delete(oldId);
    }
}
let activeLocation: string | undefined;
let activeSnapshot: UniverseSnapshot | null = null;
let diagnosticChooserCanceled = false;
let diagnosticLoseSaveAck = false;
let diagnosticLostReceipt: SaveReceipt | undefined;
let diagnosticDelaySaveAck = false;
let diagnosticAckRelease: (() => void) | undefined;
let shutdown = false;
let invalidRequestsRejected = false;
let permissionChecks = 0;
let permissionRequests = 0;
let hostErrors = 0;
function nativeModulePath():string {return app.isPackaged?path.join(process.resourcesPath,'native/confined-fs',`${process.platform}-${process.arch}`,'confined_fs.node'):path.join(app.getAppPath(),'native/confined-fs/build/Release/confined_fs.node');}
function launchApplicationHost(args: string[] = []): void {
    fs.mkdirSync(app.getPath('userData'),{recursive:true,mode:0o700});
    child = utilityProcess.fork(path.join(__dirname, 'utility-host.cjs'), [...args,'--user-data='+app.getPath('userData'),'--writingtool-native-module='+nativeModulePath()], {serviceName:'WritingTool application host'});
    client = new HostClient(child);
    universeClient = new UniverseHostClient(child);
    projectClient = new ProjectHostClient(child);
    workspaceClient = new WorkspaceHostClient(child);
    protectionClient=new ProtectionHostClient(child);
    hostExited = false;
    child.on('message', message => {
        if(typeof message==='object'&&message!==null&&'kind'in message&&message.kind==='protection.progress'){window?.webContents.send('writingtool:protection-progress:v1',message);}
        else if(typeof message==='object'&&message!==null&&'command'in message&&String(message.command).startsWith('protection.'))protectionClient?.receive(message);
        else if(typeof message==='object' && message!==null && 'command' in message && (String(message.command).startsWith('workspace.')||String(message.command).startsWith('settings.'))) workspaceClient?.receive(message);
        else if(typeof message==='object' && message!==null && 'command' in message && String(message.command).startsWith('project.')) projectClient?.receive(message);
        else if(typeof message==='object' && message!==null && 'command' in message) universeClient?.receive(message);
        else client?.receive(message);
    });
    child.on('exit',()=>{hostExited=true;client?.fail('HOST_EXITED');universeClient?.fail();projectClient?.fail();workspaceClient?.fail();protectionClient?.fail();});
    child.on('error',()=>{hostErrors++;client?.fail('HOST_EXITED');universeClient?.fail();projectClient?.fail();workspaceClient?.fail();protectionClient?.fail();});
}
function authorized(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>): boolean {
    return !!window && !window.isDestroyed() && !!event.senderFrame && trustedSender(event.sender.id, window.webContents.id, event.senderFrame === window.webContents.mainFrame, event.senderFrame.url, MAIN_WINDOW_WEBPACK_ENTRY);
}
async function ensureApplicationHost(restoreActive=true):Promise<void>{
    if(fault||hasBlockingOperations()||pendingProjectCreation)return;
    if(hostExited){launchApplicationHost();authorityRestorePending=!!(activeProjectLocation||activeLocation);}
    if(!restoreActive||!authorityRestorePending)return;
    if(activeProjectLocation){
        const opened=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:activeProjectLocation,universePath:activeLocation});
        if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==activeProjectIdentity?.id||opened.snapshot.rootId!==activeProjectIdentity?.rootId||opened.snapshot.universe.ownerId!==activeSnapshot?.ownerId||opened.snapshot.universe.rootId!==activeSnapshot?.rootId)throw new Error('Reopen the saved project before continuing.');
    }else if(activeLocation){
        const opened=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.open',basePath:activeLocation});
        if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==activeSnapshot?.ownerId||opened.snapshot.rootId!==activeSnapshot?.rootId)throw new Error('Reopen the saved universe before continuing.');
    }
    authorityRestorePending=false;
}
if (squirrelStartup)
    app.quit();
else
    app.whenReady().then(async () => {
        try {
            if (fault === 'start')
                throw new Error('Diagnostic startup failure');
            configureConfinedFs(nativeModulePath());
            loadPendingProtection();
            launchApplicationHost(fault ? [`--diagnostic-fault=${fault}`] : []);
            // Exercise Electron's documented FatalError event path without inducing a crash.
            if (fault === 'fatal-error')
                child!.emit('error', 'FatalError', 'diagnostic', '{}');
        }
        catch {
            client = new HostClient(undefined);
            universeClient = new UniverseHostClient(undefined);
            projectClient = new ProjectHostClient(undefined);
            hostExited = true;
        }
        ipcMain.on('writingtool:quit-request:v1', (event, value: unknown) => {
            if (authorized(event) && closed(value, ['protocolVersion', 'requestId', 'command']) && value.protocolVersion === 1 && isUuid(value.requestId) && value.command === 'application.quit')
                void requestNativeQuit('app');
        });
        ipcMain.handle(READINESS_CHANNEL, (event, request: unknown) => {
            if (!authorized(event) || !validRequest(request))
                throw new Error('Readiness request denied');
            return client!.request(request);
        });
        ipcMain.handle(PROJECT_CHANNEL, async (event, value: unknown): Promise<ProjectResult> => {
            if (!authorized(event) || !validProjectRequest(value) || draining)
                throw new Error('Project request denied');
            const request=value, base={protocolVersion:1 as const,requestId:request.requestId,command:request.command};
            if (projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight || hasBlockingOperations() || (pendingProjectCreation && !['project.open','project.current'].includes(request.command)))
                return {...base,status:'error',code:'RECOVERY_REQUIRED',message:'Finish or reconcile the pending operation before changing projects.',outcome:pendingProjectCreation?'unknown':'not-committed',retry:'after-recovery'};
            projectInFlight=true;
            let sent=false;
            try {
                await ensureApplicationHost(request.command==='project.current');
                let basePath: string | undefined, universePath: string | undefined;
                if(request.command==='project.create' || request.command==='project.open') {
                    if(request.command==='project.create') {
                        const universe=await dialog.showOpenDialog(window!,{title:'Create project — 1 of 2: Choose the existing universe folder',properties:['openDirectory']});
                        if(universe.canceled || !universe.filePaths[0]) return {...base,status:'canceled'};
                        universePath=universe.filePaths[0];
                        try {
                            const descriptor=decode(readManaged(universePath,'writingtool.json'));
                            if(!closed(descriptor,['schemaVersion','kind','id','rootId','creationOperationId'])||descriptor.schemaVersion!==1||descriptor.kind!=='universe'||!isUuid(descriptor.id)||!isUuid(descriptor.rootId)||!isUuid(descriptor.creationOperationId))throw new Error('Invalid universe discovery.');
                        } catch {
                            return {...base,status:'error',code:'VALIDATION',message:'No project was created. First choose an existing universe folder containing writingtool.json. The empty project folder is selected in the next step.',outcome:'not-committed',retry:'new-request'};
                        }
                    }
                    const selected=await dialog.showOpenDialog(window!,{title:request.command==='project.create'?'Create project — 2 of 2: Choose an empty project folder':'Open project folder',properties:['openDirectory']});
                    if(selected.canceled || !selected.filePaths[0]) return {...base,status:'canceled'};
                    basePath=selected.filePaths[0];
                }
                if(request.command==='project.open' && hostExited && !fault) launchApplicationHost();
                if(request.command==='project.open' && pendingProjectCreation && !hostExited) {projectClient?.fail(); projectClient=new ProjectHostClient(child);}
                const hostRequest={...request,...(basePath?{basePath}:{}),...(universePath?{universePath}:{}),...(pendingProjectCreation && request.command==='project.open'?{expectedCreationOperationId:pendingProjectCreation.operationId}:{})} as ProjectHostRequest;
                if(request.command==='project.create') pendingProjectCreation={operationId:request.input.operationId,location:basePath!};
                sent=true;
                let result=await projectClient!.request(hostRequest);
                if(result.status==='locate') {
                    const selected=await dialog.showOpenDialog(window!,{title:`Locate the project's universe (${result.universeId})`,properties:['openDirectory']});
                    if(selected.canceled || !selected.filePaths[0]) return {...base,status:'canceled'};
                    result=await projectClient!.request({...hostRequest,requestId:randomUUID(),universePath:selected.filePaths[0]});
                    result={...result,requestId:request.requestId};
                }
                if(result.status==='locate') return {...base,status:'error',code:'INTEGRITY_MISMATCH',message:'The matching universe could not be resolved.',outcome:'not-committed',retry:'new-request'};
                if(request.command==='project.create' && !(result.status==='error' && result.outcome!=='not-committed')) pendingProjectCreation=undefined;
                if(request.command==='project.open' && result.status==='ok') pendingProjectCreation=undefined;
                if(result.status==='ok') {authorityRestorePending=false;activeProjectLocation=result.snapshot?.location;activeProjectIdentity=result.snapshot?{id:result.snapshot.ownerId,rootId:result.snapshot.rootId}:undefined;if(result.snapshot){activeSnapshot=result.snapshot.universe;activeLocation=activeSnapshot.location;}if(result.snapshot)new RecentRoots(app.getPath('userData')).remember({kind:'project',id:result.snapshot.ownerId},result.snapshot.rootId,path.basename(result.snapshot.location),result.snapshot.location);}
                return result;
            } catch {
                if(!sent) return {...base,status:'error',code:'IO_FAILURE',message:'The project folder chooser could not complete. Try again.',outcome:'not-committed',retry:'new-request'};
                return projectUnavailable(request);
            } finally {projectInFlight=false;}
        });
        ipcMain.handle(UNIVERSE_CHANNEL, async (event, value: unknown) => {
            if (!authorized(event) || !validUniverseRequest(value) || draining || projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight)
                throw new Error('Universe request denied');
            universeInFlight=true;
            try {
            const request = value;
            const reconcilesPending = request.command === 'universe.open' && request.reconcileOperationId && mutationLocations.has(request.reconcileOperationId);
            if ((pendingProjectCreation || hasBlockingOperations()) && request.command !== 'universe.current' && !reconcilesPending)
                return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'Reconcile the pending operation in its original folder before another operation or close.', outcome: 'unknown', retry: 'after-recovery' };
            await ensureApplicationHost(request.command==='universe.current'||request.command==='universe.profile.save');
            if (request.command === 'universe.create' || request.command === 'universe.open') {
                const injected = diagnostic ? process.env.WRITINGTOOL_UNIVERSE_FOLDER : undefined;
                let selection: {
                    canceled: boolean;
                    filePaths: string[];
                };
                try {
                    selection = diagnostic && diagnosticChooserCanceled ? { canceled: true, filePaths: [] } : injected ? { canceled: false, filePaths: [injected] } : await dialog.showOpenDialog(window!, { title: request.command === 'universe.create' ? 'Choose an empty folder for the universe' : 'Open universe folder', properties: ['openDirectory'] });
                }
                catch {
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The folder chooser could not open. Try selecting a location again.', outcome: 'not-committed', retry: 'new-request' };
                }
                if (selection.canceled || !selection.filePaths[0])
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'canceled' };
                let basePath: string;
                try {
                    basePath = fs.realpathSync(selection.filePaths[0]);
                }
                catch {
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The selected folder is unavailable. Your edits were retained.', outcome: request.command === 'universe.open' && request.reconcileOperationId ? 'unknown' : 'not-committed', retry: request.command === 'universe.open' && request.reconcileOperationId ? 'after-recovery' : 'new-request' };
                }
                const pending = request.command === 'universe.open' && request.reconcileOperationId ? mutationLocations.get(request.reconcileOperationId) : undefined;
                if (request.command === 'universe.open' && request.reconcileOperationId && !pending)
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'The original operation context is unavailable. Preserve the pending edits.', outcome: 'unknown', retry: 'after-recovery' };
                if (request.command === 'universe.create')
                    rememberMutation(request.input.operationId, basePath, { identity: { creationOperationId: request.input.operationId }, mutation: { command: request.command, input: request.input } });
                const result = await universeClient!.request({ ...request, basePath, ...(pending ? { reconcileExpected: pending.expected } : {}) });
                if (result.status === 'ok') {
                    activeLocation = result.snapshot?.location;
                    activeSnapshot = result.snapshot;
                    if(result.snapshot)new RecentRoots(app.getPath('userData')).remember({kind:'universe',id:result.snapshot.ownerId},result.snapshot.rootId,result.snapshot.profile.name,result.snapshot.location);
                }
                if (request.command === 'universe.create' && !(result.status === 'error' && result.outcome === 'unknown'))
                    unresolvedOperations.delete(request.input.operationId);
                if(result.status==='ok'&&['universe.open','universe.create','universe.close'].includes(request.command))authorityRestorePending=false;
                if (request.command === 'universe.open' && result.status === 'ok' && request.reconcileOperationId)
                    unresolvedOperations.delete(request.reconcileOperationId);
                return result;
            }
            if (request.command === 'universe.profile.save' && activeLocation && activeSnapshot)
                rememberMutation(request.input.operationId, activeLocation, { identity: { ownerId: activeSnapshot.ownerId, rootId: activeSnapshot.rootId }, mutation: { command: request.command, input: request.input } });
            let result = await universeClient!.request(request);
            if (diagnostic && diagnosticDelaySaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                diagnosticDelaySaveAck = false;
                await new Promise<void>(resolve => {
                    diagnosticAckRelease = () => {
                        diagnosticAckRelease = undefined;
                        resolve();
                    };
                });
            }
            if (diagnostic && diagnosticLoseSaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                diagnosticLoseSaveAck = false;
                diagnosticLostReceipt = result.receipt;
                result = hostUnavailable(request);
            }
            if (request.command === 'universe.profile.save' && !(result.status === 'error' && result.outcome === 'unknown'))
                unresolvedOperations.delete(request.input.operationId);
            return result;
            } finally {universeInFlight=false;}
        });
        const locateProtectionRoot=async(location:string|null,identity:PendingProtection['projectIdentity'],kind:'project'|'universe'):Promise<string|null>=>{
            if(!location&&!identity)return null;
            if(!location||!identity)throw new Error('The original protection participant identity is incomplete. Preserve its recovery metadata.');
            const matching=(folder:string|undefined):string|null=>{if(!folder)return null;try{const resolved=fs.realpathSync(folder),value=decode(readManaged(resolved,'writingtool.json'));return value&&typeof value==='object'&&'kind'in value&&'id'in value&&'rootId'in value&&value.kind===kind&&value.id===identity.id&&value.rootId===identity.rootId?resolved:null;}catch{return null;}};
            const original=matching(location);if(original)return original;
            const chosen=await dialog.showOpenDialog(window!,{title:`Locate the original ${kind} (${identity.id})`,properties:['openDirectory']});
            const resolved=matching(chosen.filePaths[0]);
            if(chosen.canceled||!resolved)throw new Error('The original owning identity is required. The protection operation remains pending.');
            return resolved;
        };
        const synchronizeProtectionContext=async(notify=true)=>{
            const [project,universe]=await Promise.all([
                projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.current'}),
                universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.current'}),
            ]);
            if(project.status!=='ok'||universe.status!=='ok'){
                if(notify)window?.webContents.send('writingtool:recovered-context:v1');
                throw new Error('The active recovery participants could not be confirmed. Reopen the saved owning roots.');
            }
            if(project.snapshot&&(!universe.snapshot||project.snapshot.universe.ownerId!==universe.snapshot.ownerId||project.snapshot.universe.rootId!==universe.snapshot.rootId))throw new Error('The active project and universe identities do not match.');
            activeProjectLocation=project.snapshot?.location;
            activeProjectIdentity=project.snapshot?{id:project.snapshot.ownerId,rootId:project.snapshot.rootId}:undefined;
            activeLocation=universe.snapshot?.location;
            activeSnapshot=universe.snapshot;authorityRestorePending=false;
            if(notify)window?.webContents.send('writingtool:recovered-context:v1');
        };
        const runProtection=nativeProtection({openRoot:async(owner,location)=>{try{if(owner.kind==='project'){let result=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:location});if(result.status==='locate'){const chosen=await dialog.showOpenDialog(window!,{title:'Locate matching universe',properties:['openDirectory']});if(chosen.canceled||!chosen.filePaths[0])throw new Error('The matching universe is required.');result=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:location,universePath:chosen.filePaths[0]});}if(result.status!=='ok'||!result.snapshot)throw new Error(result.status==='error'?result.message:'Project opening was not acknowledged.');return{project:result.snapshot.location,universe:result.snapshot.universeLocation};}if(activeProjectLocation){const closed=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.close'});if(closed.status!=='ok')throw new Error('Close the active project before changing universes.');}const opened=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.open',basePath:location});if(opened.status!=='ok'||!opened.snapshot)throw new Error(opened.status==='error'?opened.message:'Universe opening was not acknowledged.');return{project:null,universe:opened.snapshot.location};}finally{await synchronizeProtectionContext(false);}},window:()=>window!,originalRequest:id=>pendingProtection.get(id)?.request,originalUniverse:id=>{const pending=pendingProtection.get(id);return pending?.universe&&pending.universeIdentity?{owner:{kind:'universe' as const,id:pending.universeIdentity.id},rootId:pending.universeIdentity.rootId,location:pending.universe}:undefined;},roots:()=>[activeProjectLocation,activeLocation].filter((p):p is string=>!!p),activeOwners:()=>[...(activeProjectIdentity?[{kind:'project' as const,id:activeProjectIdentity.id}]:[]),...(activeSnapshot?[{kind:'universe' as const,id:activeSnapshot.ownerId}]:[])],sourceName:async r=>{if(r.command==='protection.export'&&r.storyId){const result=await workspaceClient!.request({protocolVersion:1,requestId:randomUUID(),command:'workspace.query'});if(result.status==='ok'){const story=result.snapshot.project?.records.find(record=>record.recordType==='story'&&record.id===r.storyId);if(story?.recordType==='story')return story.data.title;}}return r.command==='protection.export'&&r.owner.kind==='project'&&activeProjectLocation?path.basename(activeProjectLocation):activeSnapshot?.profile.name??'WritingTool';},settings:async()=>{workspaceClient?.fail();workspaceClient=new WorkspaceHostClient(child);const result=await workspaceClient!.request({protocolVersion:1,requestId:randomUUID(),command:'settings.get'});if(result.status!=='ok'||!result.settings)throw new Error('Read backup settings before continuing.');return result.settings;},send:async r=>{
            const persist=r.command!=='protection.reconcile'&&protectionHasDurableEffects(r);
            if(persist){
                const entry:PendingProtection={request:r,project:activeProjectLocation??null,universe:activeLocation??null,projectIdentity:activeProjectIdentity??null,universeIdentity:activeSnapshot?{id:activeSnapshot.ownerId,rootId:activeSnapshot.rootId}:null,dispatch:'prepared'};
                // No ordinary command is posted until both native context and a no-effects
                // utility job are durable. Prepared native records prove execution never began.
                pendingProtection.set(r.requestId,entry);savePendingProtection(r.requestId,entry);
                const ready=await protectionClient!.request({...r,nativePrepareOnly:true});
                if(ready.status!=='ok')throw new Error(ready.status==='error'?ready.message:'The protection job was not prepared. Reconcile before retrying.');
                const attempted:PendingProtection={...entry,dispatch:'attempted'};savePendingProtection(r.requestId,attempted);pendingProtection.set(r.requestId,attempted);
            }
            return protectionClient!.request(r);
        }});
        ipcMain.handle(PROTECTION_CHANNEL,async(event,value:unknown):Promise<ProtectionResult>=>{
            if(!authorized(event)||!validProtectionRequest(value))throw new Error('Protection request denied');
            if(draining)return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:'Wait for normal closing to finish.',outcome:'not-committed',operationId:null};
            if(value.command==='protection.pending'){
                try{const root=app.getPath('userData'),relative='protection/proposals';ensureManagedDirectory(root,relative);const proposals=fs.readdirSync(path.join(root,relative)).filter(name=>name.endsWith('.json')&&isUuid(name.slice(0,-5))).map(name=>name.slice(0,-5));return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'ok',value:{...pendingProtectionState(),proposals}};}
                catch(error){return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:error instanceof Error?error.message:'Pending recovery metadata could not be read.',outcome:'not-committed',operationId:null};}
            }
            if(value.command==='protection.cancel')return protectionClient!.request(value);
            if(value.command==='protection.defer'){
                const base={protocolVersion:1 as const,requestId:value.requestId,command:value.command};
                if(protectionInFlight||workspaceInFlight||projectInFlight||universeInFlight)return{...base,status:'error',message:'Wait for the active operation before continuing.',outcome:'not-committed',operationId:null};
                const pending=pendingProtection.get(value.operationId);
                if(!pending||!canDeferProtection(pending.request.command))return{...base,status:'error',message:'This operation changes live writing and must be reconciled before continuing.',outcome:'not-committed',operationId:null};
                protectionInFlight=true;
                try{
                    if(hostExited){
                        launchApplicationHost();
                        if(activeProjectLocation){
                            const opened=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:activeProjectLocation,universePath:activeLocation});
                            if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==activeProjectIdentity?.id||opened.snapshot.rootId!==activeProjectIdentity?.rootId)throw new Error('Reopen the saved project before continuing writing.');
                        }else if(activeLocation){
                            const opened=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.open',basePath:activeLocation});
                            if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==activeSnapshot?.ownerId||opened.snapshot.rootId!==activeSnapshot?.rootId)throw new Error('Reopen the saved universe before continuing writing.');
                        }
                        await synchronizeProtectionContext(false);
                    }
                    const deferred:PendingProtection={...pending,deferred:true};
                    savePendingProtection(value.operationId,deferred);
                    pendingProtection.set(value.operationId,deferred);unresolvedOperations.delete(value.operationId);
                    if(!hasBlockingOperations()&&!pendingProjectCreation)window?.webContents.send('writingtool:recovered-context:v1');
                    return{...base,status:'ok',value:{...pendingProtectionState(),warnings:['The unfinished operation is retained for later reconciliation. It has not been marked complete.']}};
                }catch(error){return{...base,status:'error',message:error instanceof Error?error.message:'The operation could not be set aside. Retry or reconcile it.',outcome:'unknown',operationId:value.operationId};}
                finally{protectionInFlight=false;}
            }
            // Listing recent roots has no authority effects and must remain available during recovery.
            if(value.command==='protection.recents')return runProtection(value);
            if(value.command==='protection.reconcile'){
                if(protectionInFlight||workspaceInFlight||projectInFlight||universeInFlight)return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:'Wait for the active authority operation before reconciliation.',outcome:'not-committed',operationId:null};
                protectionInFlight=true;
                try{
                    let pending=pendingProtection.get(value.operationId);
                    if(pending&&canDeferProtection(pending.request.command)){
                        const current=activeProjectIdentity??(activeSnapshot?{id:activeSnapshot.ownerId,rootId:activeSnapshot.rootId}:undefined),original=pending.projectIdentity??pending.universeIdentity;
                        if(current&&(!original||!!activeProjectIdentity!==!!pending.projectIdentity||current.id!==original.id||current.rootId!==original.rootId))return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:'Open the original project or universe to reconcile this copy. You can continue writing in the current project.',outcome:'not-committed',operationId:null};
                    }
                    if(pending?.dispatch==='prepared'&&!hostExited){
                        // Execution was never sent; reset a failed preparation transport too.
                        protectionClient?.fail();protectionClient=new ProtectionHostClient(child);
                        forgetPendingProtection(value.operationId);
                        window?.webContents.send('writingtool:recovered-context:v1');
                        return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'ok',value:{reconciliation:{operationId:value.operationId,outcome:'not-committed'}}};
                    }
                    let moved=false;
                    if(pending){
                        const project=await locateProtectionRoot(pending.project,pending.projectIdentity,'project'),universe=await locateProtectionRoot(pending.universe,pending.universeIdentity,'universe');
                        moved=project!==pending.project||universe!==pending.universe;
                        if(moved){const relocated:PendingProtection={...pending,project,universe};savePendingProtection(value.operationId,relocated);pendingProtection.set(value.operationId,relocated);pending=relocated;}
                    }
                    moved=moved||!!(pending?.project&&activeProjectLocation&&activeProjectIdentity?.id===pending.projectIdentity?.id&&activeProjectIdentity?.rootId===pending.projectIdentity?.rootId&&activeProjectLocation!==pending.project)||!!(!pending?.project&&pending?.universe&&activeLocation&&activeSnapshot?.ownerId===pending.universeIdentity?.id&&activeSnapshot?.rootId===pending.universeIdentity?.rootId&&activeLocation!==pending.universe);
                    const activationFile=path.join(app.getPath('userData'),activationPath(value.operationId));
                    let activation=false;
                    if(pending?.request.command==='protection.apply'&&fs.existsSync(activationFile)){
                        const decision=decode(readManaged(app.getPath('userData'),activationPath(value.operationId)));
                        if(!validActivationDecision(decision)||decision.requestId!==value.operationId||decision.proposalId!==pending.request.proposalId)throw new Error('Original activation evidence is invalid.');
                        activation=true;
                        // Published roots may have opened before a ZIP acknowledgement failed.
                        // Release a host holding their old VFS paths before native relocation.
                        for(const participant of decision.participants){
                            const location=activationRootAt(participant.stage,participant)??activationRootAt(participant.destination,participant);
                            const active=participant.owner.kind==='project'?activeProjectIdentity:activeSnapshot?{id:activeSnapshot.ownerId,rootId:activeSnapshot.rootId}:undefined;
                            const activePath=participant.owner.kind==='project'?activeProjectLocation:activeLocation;
                            if(!location||active?.id===participant.owner.id&&active.rootId===participant.rootId&&activePath!==location)moved=true;
                        }
                    }
                    if(moved&&!hostExited&&child){
                        const original=child;
                        await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>{original.removeListener('exit',exited);reject(new Error('Wait for the original application host to release its authority before retrying.'));},15000);const exited=()=>{clearTimeout(timer);resolve();};original.once('exit',exited);try{original.kill();}catch(error){clearTimeout(timer);original.removeListener('exit',exited);reject(error);}});
                    }
                    const hostRestarted=hostExited;
                    if(hostRestarted){
                        launchApplicationHost();
                        if(activation){activeProjectLocation=undefined;activeProjectIdentity=undefined;activeLocation=undefined;activeSnapshot=null;}
                    }
                    else{protectionClient?.fail();protectionClient=new ProtectionHostClient(child);}
                    // Activation owns reopening its staged participants before the live universe;
                    // either may need the other's coordinator journal during recovery.
                    if(!activation&&pending?.project&&(hostRestarted||moved||activeProjectLocation!==pending.project||activeProjectIdentity?.id!==pending.projectIdentity?.id||activeProjectIdentity?.rootId!==pending.projectIdentity?.rootId)){
                        const opened=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:pending.project,universePath:pending.universe??undefined});
                        if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==pending.projectIdentity?.id||opened.snapshot.rootId!==pending.projectIdentity?.rootId||opened.snapshot.universe.ownerId!==pending.universeIdentity?.id||opened.snapshot.universe.rootId!==pending.universeIdentity?.rootId)throw new Error('Reopen the original participants before protection reconciliation.');
                        activeProjectLocation=opened.snapshot.location;activeProjectIdentity={id:opened.snapshot.ownerId,rootId:opened.snapshot.rootId};activeLocation=opened.snapshot.universeLocation;activeSnapshot=opened.snapshot.universe;
                    }else if(!activation&&pending?.universe&&(hostRestarted||moved||activeLocation!==pending.universe||activeSnapshot?.ownerId!==pending.universeIdentity?.id||activeSnapshot?.rootId!==pending.universeIdentity?.rootId)){
                        const opened=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.open',basePath:pending.universe});
                        if(opened.status!=='ok'||!opened.snapshot||opened.snapshot.ownerId!==pending.universeIdentity?.id||opened.snapshot.rootId!==pending.universeIdentity?.rootId)throw new Error('Reopen the original universe before protection reconciliation.');
                        activeProjectLocation=undefined;activeProjectIdentity=undefined;activeLocation=opened.snapshot.location;activeSnapshot=opened.snapshot;
                    }
                    if(pending?.dispatch==='prepared'){
                        await synchronizeProtectionContext();forgetPendingProtection(value.operationId);
                        return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'ok',value:{reconciliation:{operationId:value.operationId,outcome:'not-committed'}}};
                    }
                    const result=await runProtection(value);
                    if(result.status==='ok'){await synchronizeProtectionContext();forgetPendingProtection(value.operationId);}
                    if(result.status!=='ok'&&pending&&canDeferProtection(pending.request.command))await synchronizeProtectionContext();
                    if(result.status==='error'){
                        return{...result,outcome:'unknown',operationId:value.operationId};
                    }
                    return result;
                }catch(error){if(!canDeferProtection(pendingProtection.get(value.operationId)?.request.command??'protection.reconcile'))unresolvedOperations.add(value.operationId);else if(!hasBlockingOperations())window?.webContents.send('writingtool:recovered-context:v1');return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:error instanceof Error?error.message:'Protection reconciliation remains unconfirmed.',outcome:'unknown',operationId:value.operationId};}
                finally{protectionInFlight=false;}
            }

            if(protectionInFlight||workspaceInFlight||projectInFlight||universeInFlight||hasBlockingOperations())return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:'Finish or reconcile the pending authority operation first.',outcome:'not-committed',operationId:null};
            protectionInFlight=true;try{await ensureApplicationHost();const result=await runProtection(value);if(result.status==='ok'&&result.value.activated||value.command==='protection.recent'&&value.action!=='remove')await synchronizeProtectionContext();if(result.status==='error'&&result.outcome==='unknown')unresolvedOperations.add(value.requestId);else forgetPendingProtection(value.requestId);return result;}catch(error){const uncertain=pendingProtection.has(value.requestId);if(uncertain)unresolvedOperations.add(value.requestId);return{protocolVersion:1,requestId:value.requestId,command:value.command,status:'error',message:error instanceof Error?error.message:'The native protection result could not be confirmed.',outcome:uncertain?'unknown':'not-committed',operationId:uncertain?value.requestId:null};}finally{protectionInFlight=false;}
        });
        ipcMain.handle(WORKSPACE_CHANNEL,async(event,value:unknown):Promise<WorkspaceResult>=>{
            if(!authorized(event)||!validWorkspaceRequest(value)||draining||projectInFlight||universeInFlight||workspaceInFlight||protectionInFlight)throw new Error('Workspace request denied');
            const request=value,base={protocolVersion:1 as const,requestId:request.requestId,command:request.command};
            if((hasBlockingOperations()||pendingProjectCreation)&&request.command!=='workspace.reconcile'&&request.command!=='settings.get'&&request.command!=='workspace.query')return{...base,status:'error',code:'RECOVERY_REQUIRED',message:'Reconcile the original pending operation before continuing.',outcome:'unknown',retry:'after-recovery',issues:[]};
            workspaceInFlight=true;let sent=false;
            try{
                await ensureApplicationHost();
                if(request.command==='workspace.reconcile'&&!fault){
                    const pending=pendingWorkspace.get(request.operationId);
                    if(pending){
                        const locate=async(original:string|undefined,identity:{id:string;rootId:string}|undefined,label:string):Promise<string|undefined>=>{if(!identity)return undefined;const valid=(folder:string|undefined):string|undefined=>{if(!folder)return;try{const resolved=fs.realpathSync(folder),d=decode(fs.readFileSync(path.join(resolved,'writingtool.json'))) as {id:string;rootId:string};if(d.id===identity.id&&d.rootId===identity.rootId)return resolved;}catch{}return;};const existing=valid(original);if(existing)return existing;const selected=await dialog.showOpenDialog(window!,{title:`Locate the original ${label} (${identity.id})`,properties:['openDirectory']});const chosen=valid(selected.filePaths[0]);if(selected.canceled||!chosen)throw new Error('The original owning identity is required for reconciliation');return chosen;};
                        const projectLocation=await locate(pending.projectLocation,pending.projectIdentity,'project'),universeLocation=await locate(pending.universeLocation,pending.universeIdentity,'universe');
                        const moved=projectLocation!==pending.projectLocation||universeLocation!==pending.universeLocation;
                        pending.projectLocation=projectLocation;pending.universeLocation=universeLocation;
                        if(moved&&!hostExited&&child){const original=child;await new Promise<void>(resolve=>{original.once('exit',()=>resolve());original.kill();});}
                        if(hostExited){launchApplicationHost();if(projectLocation){const reopened=await projectClient!.request({protocolVersion:1,requestId:randomUUID(),command:'project.open',basePath:projectLocation,...(universeLocation?{universePath:universeLocation}:{})});if(reopened.status!=='ok'||!reopened.snapshot||reopened.snapshot.ownerId!==pending.projectIdentity?.id||reopened.snapshot.rootId!==pending.projectIdentity?.rootId)throw new Error('Original project participants could not be reopened');}else if(universeLocation){const reopened=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.open',basePath:universeLocation});if(reopened.status!=='ok'||!reopened.snapshot||reopened.snapshot.ownerId!==pending.universeIdentity?.id||reopened.snapshot.rootId!==pending.universeIdentity?.rootId)throw new Error('Original universe could not be reopened');}}
                    }else if(hostExited)throw new Error('Original operation locations are unavailable');
                }
                if(request.command==='workspace.reconcile'||request.command==='settings.get'||request.command==='workspace.query'){workspaceClient?.fail();workspaceClient=new WorkspaceHostClient(child);}
                let internal:WorkspaceHostRequest=request;
                if(request.command==='workspace.asset.import'){
                    const frozen=pendingWorkspace.get(request.operationId);if(frozen)internal={...frozen.request,requestId:request.requestId};else{
                        const selected=await dialog.showOpenDialog(window!,{title:'Choose profile image',properties:['openFile'],filters:[{name:'Images',extensions:['png','jpg','jpeg','webp']}]});if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};
                        const bytes=fs.readFileSync(selected.filePaths[0]);const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=bytes.subarray(0,4).toString('ascii')==='RIFF'&&bytes.subarray(8,12).toString('ascii')==='WEBP';if((!png&&!jpeg&&!webp)||nativeImage.createFromBuffer(bytes).isEmpty())return{...base,status:'error',code:'VALIDATION',message:'Choose a readable PNG, JPEG or WebP image. The previous image was retained.',outcome:'not-committed',retry:'new-request',issues:[]};
                        internal={...request,nativeAsset:{id:randomUUID(),sha256:hash(bytes),mediaType:png?'image/png':jpeg?'image/jpeg':'image/webp',base64:bytes.toString('base64')}};
                    }
                }
                if(request.command==='settings.import'){
                    const selected=await dialog.showOpenDialog(window!,{title:'Import settings',properties:['openFile'],filters:[{name:'Settings',extensions:['json']}]});if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};internal={...request,nativeSettings:decode(fs.readFileSync(selected.filePaths[0]))};
                }
                if(request.command==='settings.select-backup'){
                    const selected=await dialog.showOpenDialog(window!,{title:'Choose backup destination',properties:['openDirectory']});if(selected.canceled||!selected.filePaths[0])return{...base,status:'canceled'};internal={...request,nativeDestination:fs.realpathSync(selected.filePaths[0])};
                }
                let exportPath:string|undefined;
                if(request.command==='settings.export'){
                    const selected=await dialog.showSaveDialog(window!,{title:'Export settings',defaultPath:'WritingTool-settings.json',filters:[{name:'Settings',extensions:['json']}],properties:['showOverwriteConfirmation']});if(selected.canceled||!selected.filePath)return{...base,status:'canceled'};exportPath=selected.filePath;
                    const parent=fs.realpathSync(path.dirname(exportPath)),target=path.join(parent,path.basename(exportPath));for(const root of [activeLocation,activeProjectLocation,app.getPath('userData')].filter((p):p is string=>!!p)){const relative=path.relative(fs.realpathSync(root),target);if(!relative||relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative))throw new Error('Settings export cannot replace live application data');}
                }
                if(request.command==='workspace.mutate'||request.command==='workspace.asset.import'){const id=request.command==='workspace.mutate'?request.input.operationId:request.operationId;pendingWorkspace.set(id,{request:internal,projectLocation:activeProjectLocation,universeLocation:activeLocation,projectIdentity:activeProjectIdentity,universeIdentity:activeSnapshot?{id:activeSnapshot.ownerId,rootId:activeSnapshot.rootId}:undefined});unresolvedOperations.add(id);}
                sent=true;let result=await workspaceClient!.request(internal);
                if(result.status==='ok'&&exportPath&&result.settings){const parent=fs.realpathSync(path.dirname(exportPath)),name=path.basename(exportPath);let expected:string|null=null;try{const stat=fs.lstatSync(exportPath);if(!stat.isFile()||stat.isSymbolicLink()||stat.nlink!==1)throw new Error('Aliased export destination');expected=hash(fs.readFileSync(exportPath));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}publishManagedBytes(parent,name,Buffer.from(JSON.stringify(result.settings,null,2)+'\n'),expected);result={...result,destination:exportPath};}
                const id=request.command==='workspace.mutate'?request.input.operationId:request.command==='workspace.asset.import'||request.command==='workspace.reconcile'?request.operationId:undefined;
                if(request.command==='workspace.reconcile'&&result.status==='ok'){const original=pendingWorkspace.get(request.operationId);if(original&&((original.projectIdentity&&(!result.snapshot.project||result.snapshot.project.owner.id!==original.projectIdentity.id||result.snapshot.project.rootId!==original.projectIdentity.rootId))||(original.universeIdentity&&(!result.snapshot.universe||result.snapshot.universe.owner.id!==original.universeIdentity.id||result.snapshot.universe.rootId!==original.universeIdentity.rootId))))return{...base,status:'error',code:'INTEGRITY_MISMATCH',message:'Reconciliation did not return the original owning identities. Preserve the pending operation.',outcome:'unknown',retry:'after-recovery',issues:[]};}
                if(request.command==='workspace.reconcile'&&result.status==='ok'){const original=pendingWorkspace.get(request.operationId);if(original){activeProjectLocation=original.projectLocation;activeLocation=original.universeLocation;}}
                if(id&&(request.command==='workspace.reconcile'?result.status==='ok':!(result.status==='error'&&result.outcome==='unknown'))){unresolvedOperations.delete(id);pendingWorkspace.delete(id);}
                if(result.status==='ok'&&activeLocation){const current=await universeClient!.request({protocolVersion:1,requestId:randomUUID(),command:'universe.current'});if(current.status==='ok'){activeSnapshot=current.snapshot;activeLocation=current.snapshot?.location;}}
                return result;
            }catch{return sent?workspaceUnavailable(request):{...base,status:'error',code:'IO_FAILURE',message:'The native workspace selection or file operation could not complete. Existing content was retained.',outcome:'not-committed',retry:'new-request',issues:[]};}
            finally{workspaceInFlight=false;}
        });
        disposePresentation = registerPresentation(() => window, MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
        window = new BrowserWindow({ width: 960, height: 680, minWidth: 360, minHeight: 360, backgroundColor: '#292929', show: false, webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, additionalArguments: diagnostic ? ['--writingtool-smoke'] : [] } });
        powerMonitor.on('resume',()=>{if(window&&!window.isDestroyed())window.webContents.send('writingtool:system-resume:v1');});
        window.webContents.on('console-message', (_event, _level, message) => {
            if (diagnostic && message === 'WRITINGTOOL_INVALID_REQUESTS true')
                invalidRequestsRejected = true;
        });
        window.removeMenu();
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        window.webContents.on('will-navigate', event => event.preventDefault());
        window.webContents.on('will-redirect', event => event.preventDefault());
        window.webContents.on('will-attach-webview', event => event.preventDefault());
        window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => {
            permissionRequests++;
            callback(false);
        });
        window.webContents.session.setPermissionCheckHandler(() => {
            permissionChecks++;
            return false;
        });
        window.webContents.on('will-prevent-unload', event => {
            if (drained)
                event.preventDefault();
        });
        window.on('close', event => {
            if (drained || quitPermit === 'window') {
                quitPermit = undefined;
                drained = true;
                return;
            }
            event.preventDefault();
            void requestNativeQuit('window');
        });
        window.on('closed', () => {
            client?.fail('UNAVAILABLE');
            window = undefined;
        });
        window.once('ready-to-show', () => window?.show());
        await window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        const fallbackRelative='protection/close-fallback.json',fallbackRoot=app.getPath('userData');
        if(!diagnostic&&fs.existsSync(path.join(fallbackRoot,fallbackRelative))){const bytes=readManaged(fallbackRoot,fallbackRelative),notice=decode(bytes);if(closed(notice,['schemaVersion','folder','createdAt','used','actualPath'])&&notice.schemaVersion===1&&notice.used===true&&typeof notice.folder==='string'&&typeof notice.actualPath==='string'){const answer=await dialog.showMessageBox(window,{type:'info',title:'Closing backup saved in another folder',message:'Your required closing backup was saved at:\n'+notice.actualPath,detail:'Choose a new backup destination for future backups.',buttons:['Choose backup folder…','Remind me next launch'],defaultId:0,cancelId:1});if(answer.response===0){const chosen=await dialog.showOpenDialog(window,{title:'Choose future backup folder',properties:['openDirectory','createDirectory']});if(!chosen.canceled&&chosen.filePaths[0]){const saved=await workspaceClient!.request({protocolVersion:1,requestId:randomUUID(),command:'settings.select-backup',nativeDestination:fs.realpathSync(chosen.filePaths[0])});if(saved.status==='ok')removeManagedBytes(fallbackRoot,fallbackRelative,hash(bytes));}}}}

        if (diagnostic)
            void smoke();
    }).catch(error => {
        console.error(error);
        app.exit(1);
    });
async function smoke(): Promise<void> {
    const deadline = Date.now() + 14000;
    let observed: Record<string, unknown> = {};
    while (Date.now() < deadline && window && !window.isDestroyed()) {
        observed = await window.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
        if (observed.state === 'ready' || observed.state === 'unavailable')
            break;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (fault === 'exit-after-ready' && observed.state === 'ready') {
        child?.kill();
        while (Date.now() < deadline) {
            observed = await window!.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
            if (observed.state === 'unavailable')
                break;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    let universeFlow: unknown = undefined;
    if (!fault && process.env.WRITINGTOOL_UNIVERSE_FOLDER) {
        diagnosticChooserCanceled = true;
        const canceled = await window!.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        diagnosticChooserCanceled = false;
        const presentation = await window!.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const setName=(input,value)=>{ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true})); };
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            let form=document.querySelector('.profile form'); form.requestSubmit(); await tick();
            const requiredName=!!document.querySelector('#name-error');
            let input=document.querySelector('.profile input'); setName(input,'Unsaved smoke draft'); await tick();
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const pendingGuard=document.querySelector('#pending-heading')?.textContent==='Save your changes?';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click(); await tick();
            const preservedDraft=input.value==='Unsaved smoke draft';
            setName(input,'   '); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save')?.click(); await tick();
            const failedSaveRetains=!!document.querySelector('#name-error') && input.value==='   ';
            setName(input,'Discarded draft'); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click(); await tick();
            const discarded=!document.querySelector('.profile');
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            form=document.querySelector('.profile form'); input=document.querySelector('.profile input'); setName(input,'Smoke universe'); await tick(); form.requestSubmit();
            for(let i=0;i<100 && document.querySelector('#profile-heading')?.textContent!=='Universe profile';i++) await tick();
            const staysOpen=document.querySelector('#profile-heading')?.textContent==='Universe profile';
            return {requiredName,pendingGuard,preservedDraft,failedSaveRetains,discarded,staysOpen};
        })()`);
        const created = await window!.webContents.executeJavaScript('window.writingTool.currentUniverse()');
        const mouseClick = async (selector: string) => {
            const point = await window!.webContents.executeJavaScript(`(() => {const rect=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:Math.round(rect.x+rect.width/2),y:Math.round(rect.y+rect.height/2)};})()`);
            window!.webContents.sendInputEvent({ type: 'mouseDown', button: 'left', clickCount: 1, ...point });
            window!.webContents.sendInputEvent({ type: 'mouseUp', button: 'left', clickCount: 1, ...point });
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-close]');
        const mouseCloseProfile = await window!.webContents.executeJavaScript(`!document.querySelector('.profile')`);
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-edit]');
        const mouseEditProfile = await window!.webContents.executeJavaScript(`!!document.querySelector('.profile') && !document.querySelector('header').inert`);
        diagnosticLoseSaveAck = true;
        await window!.webContents.executeJavaScript(`(async () => {
            const input=document.querySelector('.profile input'), description=document.querySelector('.profile textarea');
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Saved smoke universe'); input.dispatchEvent(new Event('input',{bubbles:true}));
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(description,'Persisted through the secured utility host.'); description.dispatchEvent(new Event('input',{bubbles:true}));
            await new Promise(resolve=>setTimeout(resolve,70));
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        const mouseMenuUsable = await window!.webContents.executeJavaScript(`document.querySelector('nav details:nth-child(2)').open && !document.querySelector('[data-top-profile-save]').disabled`);
        await mouseClick('[data-top-profile-save]');
        const recovery = await window!.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const input=document.querySelector('.profile input');
            for(let i=0;i<100 && !document.querySelector('#error-heading');i++) await tick();
            const unknownRetained=!!document.querySelector('#error-heading') && document.querySelector('[data-profile-save]').disabled;
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const ordinaryDiscardBlocked=!document.querySelector('#pending-heading') && input.value==='Saved smoke universe';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Return to editor')?.click();
            return {unknownRetained,ordinaryDiscardBlocked};
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        recovery.mouseReconcile = await window!.webContents.executeJavaScript(`!document.querySelector('[data-top-reconcile]').disabled`);
        await mouseClick('[data-top-reconcile]');
        recovery.reconciled = await window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,70));return !document.querySelector('#error-heading')&&!document.querySelector('[data-profile-save]').disabled&&document.querySelector('.profile input').value==='Saved smoke universe';})()`);
        const delayedAck = async (departure: boolean, submittedName: string, newerName: string) => {
            diagnosticDelaySaveAck = true;
            await window!.webContents.executeJavaScript(`(async () => {
                const input=document.querySelector('.profile input');
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(submittedName)}); input.dispatchEvent(new Event('input',{bubbles:true}));
                await new Promise(resolve=>setTimeout(resolve,70));
                if(${departure}) {document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save').click();}
                else document.querySelector('[data-top-profile-save]').click();
            })()`);
            for (let i = 0; i < 100 && !diagnosticAckRelease; i++)
                await new Promise(resolve => setTimeout(resolve, 30));
            if (!diagnosticAckRelease)
                return false;
            await window!.webContents.executeJavaScript(`(() => {const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(newerName)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
            diagnosticAckRelease();
            return window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('.profile')&&document.querySelector('.profile input').value===${JSON.stringify(newerName)};document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));const dirty=!!document.querySelector('#pending-heading');Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained&&dirty;})()`);
        };
        const typingAfterSave = await delayedAck(false, 'First delayed submission', 'Newer retained draft');
        const departureSaveRetainsNewer = await delayedAck(true, 'Departure submitted draft', 'Even newer retained draft');
        await window!.webContents.executeJavaScript(`(async()=>{document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard').click();})()`);
        const exactDescription = '  Exact\r\n Ω🌌 \t';
        const exactSaved = await window!.webContents.executeJavaScript(`(async()=>{const current=await window.writingTool.currentUniverse();const s=current.snapshot;return window.writingTool.saveUniverseProfile({operationId:crypto.randomUUID(),ownerId:s.ownerId,expectedUnitGeneration:s.generation,expectedRecordVersion:s.recordVersion,submittedEditorRevision:'999',data:{name:'Saved smoke universe',description:${JSON.stringify(exactDescription)}}});})()`);
        const exactDescriptionSaved = exactSaved.status === 'ok' && exactSaved.snapshot?.profile.description === exactDescription;
        diagnosticChooserCanceled = true;
        const activeCancellation = await window!.webContents.executeJavaScript(`(async () => { const before=await window.writingTool.currentUniverse(); const result=await window.writingTool.openUniverse(); const after=await window.writingTool.currentUniverse(); return result.status==='canceled' && JSON.stringify(before.snapshot)===JSON.stringify(after.snapshot); })()`);
        diagnosticChooserCanceled = false;
        const closed = await window!.webContents.executeJavaScript('window.writingTool.closeUniverse()');
        const oldChild = child;
        const exited = new Promise(resolve => oldChild?.once('exit', resolve));
        oldChild?.kill();
        await exited;
        const reopened = await window!.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        await window!.webContents.executeJavaScript(`(async()=>{await window.writingTool.closeUniverse();document.dispatchEvent(new Event('writingtool-recovered-context'));await new Promise(resolve=>setTimeout(resolve,150));Array.from(document.querySelectorAll('nav button')).find(button=>button.textContent.startsWith('New universe')).click();await new Promise(resolve=>setTimeout(resolve,70));const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Unsaved native close draft');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
        const cancelNative = async (kind: 'window' | 'app') => {
            if (kind === 'window')
                window!.close();
            else
                app.quit();
            const preserved = await window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('#pending-heading')&&document.querySelector('.profile input')?.value==='Unsaved native close draft';Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained;})()`);
            await new Promise(resolve => setTimeout(resolve, 70));
            return preserved && !!window && !window.isDestroyed();
        };
        const nativeWindowCancel = await cancelNative('window');
        const nativeAppCancel = await cancelNative('app');
        universeFlow = {
            passed: nativeWindowCancel && nativeAppCancel && canceled.status === 'canceled' && activeCancellation && Object.values(presentation).every(Boolean) && Object.values(recovery).every(Boolean) && mouseCloseProfile && mouseEditProfile && mouseMenuUsable && created.status === 'ok' && closed.status === 'ok' && reopened.status === 'ok' && reopened.snapshot?.ownerId === created.snapshot?.ownerId && reopened.snapshot?.profile?.name === 'Saved smoke universe' && reopened.snapshot?.generation === exactSaved.snapshot?.generation && reopened.snapshot?.profile.description === exactDescription && exactDescriptionSaved && typingAfterSave && departureSaveRetainsNewer,
            receipt: diagnosticLostReceipt, nativeWindowCancel, nativeAppCancel, presentation, typingAfterSave, departureSaveRetainsNewer, exactDescriptionSaved, topCommands: { mouseCloseProfile, mouseEditProfile, mouseMenuUsable, mouseSave: recovery.unknownRetained, mouseReconcile: recovery.mouseReconcile }, recovery, activeCancellation, reopened,
            nativePickerBoundary: 'explicit diagnostic selection and cancellation',
            acknowledgmentBoundary: 'explicit diagnostic loss after durable host reply'
        };
    }
    const expected = fault ? 'unavailable' : 'ready';
    const untrusted = new BrowserWindow({ show: false, webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await untrusted.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    const untrustedResult = await untrusted.webContents.executeJavaScript('window.writingTool.readiness()');
    const untrustedUniverse = await untrusted.webContents.executeJavaScript('window.writingTool.currentUniverse()');
    const untrustedWorkspace = await untrusted.webContents.executeJavaScript("window.writingTool.workspace({command:'workspace.query'})");
    const untrustedProtection = await untrusted.webContents.executeJavaScript("window.writingTool.protection({command:'protection.pending'})");
    const senderDenied = untrustedUniverse.status === 'error' && untrustedUniverse.code === 'HOST_UNAVAILABLE' && untrustedWorkspace.status === 'error' && untrustedWorkspace.code === 'HOST_UNAVAILABLE' && untrustedProtection.status === 'error' && untrustedResult.status === 'unavailable' && untrustedResult.code === 'UNAVAILABLE';
    untrusted.destroy();
    const checksBefore = permissionChecks;
    const requestsBefore = permissionRequests;
    const permissions = await window!.webContents.executeJavaScript(`Promise.race([
    (async () => {
      const query = await navigator.permissions.query({name: 'geolocation'});
      const request = await new Promise(resolve => navigator.geolocation.getCurrentPosition(
        () => resolve('granted'), error => resolve(error.code === 1 ? 'denied' : 'error'),
        {timeout: 1000, maximumAge: 0}
      ));
      return {query: query.state, request};
    })(),
    new Promise(resolve => setTimeout(() => resolve({query: 'timeout', request: 'timeout'}), 2000))
  ])`);
    const permissionsDenied = permissions.query === 'denied' && permissions.request === 'denied' && permissionChecks > checksBefore && permissionRequests > requestsBefore;
    const before = window!.webContents.getURL();
    const windowCount = BrowserWindow.getAllWindows().length;
    await window!.webContents.executeJavaScript(`window.open('https://example.invalid'); location.href='https://example.invalid';`);
    await new Promise(resolve => setTimeout(resolve, 150));
    const security = observed.node === 'undefined' && observed.process === 'undefined' && JSON.stringify(observed.keys) === '["protection","workspace","createProject","openProject","currentProject","closeProject","createUniverse","openUniverse","currentUniverse","saveUniverseProfile","closeUniverse","readiness"]' && window!.webContents.getURL() === before && BrowserWindow.getAllWindows().length === windowCount;
    const expectedCode = ({ start: 'HOST_START_FAILED', exit: 'HOST_EXITED', invalid: 'INVALID_RESPONSE', timeout: 'TIMEOUT', 'exit-after-ready': 'HOST_EXITED', 'fatal-error': 'HOST_EXITED' } as Record<string, string>)[fault ?? ''];
    const universePassed = !universeFlow || (universeFlow as {
        passed: boolean;
    }).passed;
    const passed = universePassed && observed.state === expected && client?.pendingCount === 0 && security && senderDenied && invalidRequestsRejected && permissionsDenied && (fault !== 'fatal-error' || hostErrors === 1) && (!expectedCode || String(observed.text).includes(expectedCode));
    console.log('WRITINGTOOL_SMOKE ' + JSON.stringify({ passed, packaged: app.isPackaged, fault: fault ?? 'none', observed, security, senderDenied, invalidRequestsRejected, permissionsDenied, permissionChecks, permissionRequests, hostErrors, pending: client?.pendingCount, universeFlow, versions: process.versions }));
    if (!passed) {
        app.exit(1);
        return;
    }
    // Success exits through the same production dirty decision and host drain.
    app.quit();
    if (window && !window.isDestroyed())
        await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click();})()`).catch(() => {
        });
}
async function requestNativeQuit(kind: 'window' | 'app'): Promise<void> {
    if (quitDecisionInFlight || draining)
        return;
    quitDecisionInFlight = true;
    let authorityReleased = false;
    try {
        const owned = window;
        if (owned && !owned.isDestroyed()) {
            const token = randomUUID();
            const approved = await owned.webContents.executeJavaScript(`new Promise(resolve => {
                const token=${JSON.stringify(token)};
                const listener=event=>{if(event.detail?.token!==token)return;document.removeEventListener('writingtool-quit-decision',listener);resolve(event.detail.approved===true);};
                document.addEventListener('writingtool-quit-decision',listener);
                document.dispatchEvent(new CustomEvent('writingtool-window-close',{detail:{token}}));
            })`);
            if (!approved)
                return;
        }
        if (hasBlockingOperations() || pendingProjectCreation || projectInFlight || universeInFlight || workspaceInFlight || protectionInFlight) {
            dialog.showErrorBox('Unable to close universe', 'Reconcile the unresolved operation before closing.');
            return;
        }
        draining = true;
        if (!hostExited) {
            // Reuse the same process, never create replacement authority. A
            // failed readiness/transport client is not a shutdown acknowledgment.
            universeClient?.fail();
            universeClient = new UniverseHostClient(child);
            projectClient?.fail();
            projectClient = new ProjectHostClient(child);
            const projectResult = await projectClient.request({protocolVersion:1,requestId:randomUUID(),command:'project.close'});
            if(projectResult.status!=='ok' && !hostExited) {
                dialog.showErrorBox('Unable to close project',projectResult.status==='error'?projectResult.message:'Shutdown was not acknowledged.');
                return;
            }
            if (projectResult.status === 'ok') {
                authorityReleased ||= !!activeProjectLocation;
                activeProjectLocation = undefined;
                activeProjectIdentity = undefined;
            }
            const result = await universeClient.request({ protocolVersion: 1, requestId: randomUUID(), command: 'universe.close' });
            if (result.status !== 'ok' && !hostExited) {
                dialog.showErrorBox('Unable to close universe', result.status === 'error' ? result.message : 'Shutdown was not acknowledged.');
                return;
            }
            if (result.status === 'ok') {
                authorityReleased ||= !!activeLocation;
                activeLocation = undefined;
                activeSnapshot = null;
            }
        }
        if (diagnostic)
            console.log('WRITINGTOOL_DRAIN ' + JSON.stringify({ kind, hostAlreadyExited: hostExited, unresolved: unresolvedOperations.size, drained: true }));
        disposePresentation?.();
        disposePresentation=undefined;
        quitPermit = kind;
        if (kind === 'window' && window && !window.isDestroyed())
            window.close();
        else
            app.quit();
    }
    catch (error) {
        console.error('Normal close remains pending', error);
    }
    finally {
        draining = false;
        quitDecisionInFlight = false;
        if (!drained && window && !window.isDestroyed()) {
            window.webContents.send('writingtool:close-aborted:v1', authorityReleased);
        }
    }
}
app.on('before-quit', event => {
    if (drained || quitPermit === 'app') {
        quitPermit = undefined;
        drained = true;
        if (!shutdown) {
            shutdown = true;
            ipcMain.removeHandler(READINESS_CHANNEL);
            ipcMain.removeHandler(UNIVERSE_CHANNEL);
            ipcMain.removeHandler(PROJECT_CHANNEL);
            ipcMain.removeHandler(WORKSPACE_CHANNEL);
            ipcMain.removeHandler(PROTECTION_CHANNEL);
            ipcMain.removeAllListeners('writingtool:quit-request:v1');
            client?.fail('UNAVAILABLE');
            child?.kill();
        }
        return;
    }
    event.preventDefault();
    void requestNativeQuit('app');
});
app.on('window-all-closed', () => app.quit());
