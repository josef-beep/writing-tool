import {ProtectionApplication} from '../application/protection';
import {ProtectionService} from '../infrastructure/protection-service';
import {validProtectionRequest,type ProtectionResult} from '../application/contracts/protection';
import {OperationCanceled} from '../infrastructure/archives';
import {WorkspaceApplication} from '../application/workspace';
import {WorkspaceCoordinator} from '../infrastructure/workspace-coordinator';
import {SettingsStorage} from '../infrastructure/settings-storage';
import {validWorkspaceRequest,type WorkspaceResult} from '../application/contracts/workspace';
import {WorkspaceValidationError} from '../domain/workspace';
import {canonical,hash} from '../infrastructure/universe-files';
import {randomUUID} from 'node:crypto';
import { ProjectApplication, LocateProjectUniverse } from '../application/project';
import { FileProjectStorage } from '../infrastructure/project-storage';
import { validProjectRequest, type ProjectHostResult } from '../application/contracts/project';
import { UniverseApplication, UniverseFailure } from '../application/universe';
import { FileUniverseStorage } from '../infrastructure/universe-storage';
import { validUniverseRequest, type UniverseResult } from '../application/contracts/universe';
import { readiness } from '../application/readiness';
import { validRequest } from '../application/contracts/readiness';
const userData=process.argv.find(arg=>arg.startsWith('--user-data='))?.slice('--user-data='.length);
if(!userData)throw new Error('Application host requires its native user-data location');
const coordinator=new WorkspaceCoordinator(userData);
const settings=new SettingsStorage(userData,fn=>coordinator.settingsGate(fn));
const universes = new UniverseApplication(new FileUniverseStorage(undefined,coordinator));
const projects = new ProjectApplication(new FileProjectStorage(coordinator), universes);
const workspace=new WorkspaceApplication(projects,universes,coordinator,{uuid:randomUUID,digest:value=>hash(canonical(value)),textDigest:hash,byteLength:text=>Buffer.byteLength(text).toString()});
const protectionService=new ProtectionService(workspace,settings,userData,coordinator,locations=>{if(locations.project)projects.open(locations.project,locations.universe);else universes.open(locations.universe);});
const protection=new ProtectionApplication(protectionService);
const port = process.parentPort;
if (!port)
    throw new Error('Application host requires a parent port');
setInterval(()=>{for(const progress of protectionService.progress())port.postMessage({kind:'protection.progress',...progress});},150);
const fault = process.argv.find(arg => arg.startsWith('--diagnostic-fault='))?.split('=')[1];
if (fault === 'exit')
    process.exit(1);
port.on('message', ({ data }: {
    data: unknown;
}) => {
    if(validProtectionRequest(data,true)){
        const base={protocolVersion:1 as const,requestId:data.requestId,command:data.command};
        void protection.execute(data).then(value=>port.postMessage({...base,status:'ok',value} satisfies ProtectionResult)).catch(error=>port.postMessage(error instanceof OperationCanceled?{...base,status:'canceled'}:{...base,status:'error',message:error instanceof Error?error.message:'Protection operation failed.',outcome:error instanceof UniverseFailure&&error.outcome!=='not-committed'?'unknown':'not-committed',operationId:error instanceof UniverseFailure&&error.outcome==='unknown'?data.requestId:null}));return;
    }
    if(protection.busy){if(typeof data==='object'&&data&&'requestId'in data&&'command'in data)port.postMessage({protocolVersion:1,requestId:data.requestId,command:data.command,status:'error',code:'RECOVERY_REQUIRED',message:'Wait for the protection operation to finish.',outcome:'not-committed',retry:'new-request',issues:[]});return;}
    if(validWorkspaceRequest(data,true)) {
        const base={protocolVersion:1 as const,requestId:data.requestId,command:data.command};
        let result:WorkspaceResult;let mutationApplied=false;
        try {
            let receipt:import('../application/contracts/workspace').WorkspaceReceipt|null=null;
            let values:import('../application/contracts/workspace').AppSettings|null=null;
            let asset:import('../application/contracts/workspace').AssetData|null=null;
            let destination:string|null=null,warnings:string[]=[];
            switch(data.command){
            case 'workspace.query':break;
            case 'workspace.mutate':receipt=workspace.mutate(data.input);break;
            case 'workspace.reconcile':receipt=workspace.reconcile(data.operationId)??null;break;
            case 'workspace.asset.import':if(!data.nativeAsset)throw new UniverseFailure('VALIDATION','Choose a readable supported image.');({receipt,asset}=workspace.importAsset(data.owner,data.operationId,data.expectedUnitGeneration,data.nativeAsset));break;
            case 'workspace.asset.read':asset=workspace.readAsset(data.owner,data.assetId);break;
            case 'settings.get':case 'settings.export':values=settings.get();break;
            case 'settings.save':values=settings.save(data.values,data.expectedRecordVersion);break;
            case 'settings.import':{const imported=settings.import(data.nativeSettings);values=imported.settings;warnings=imported.warnings;break;}
            case 'settings.select-backup':{if(!data.nativeDestination)throw new UniverseFailure('VALIDATION','Choose a backup folder.');const current=settings.get();values=settings.save({...current,backupDestination:data.nativeDestination},current.recordVersion);destination=data.nativeDestination;break;}
            }
            mutationApplied=receipt!==null;
            result={...base,status:'ok',snapshot:data.command.startsWith('settings.')?{project:null,universe:null}:workspace.snapshot(),receipt,settings:values,warnings,asset,destination};
        }catch(e){let f=e instanceof UniverseFailure?e:e instanceof WorkspaceValidationError?new UniverseFailure('VALIDATION',e.message):new UniverseFailure('IO_FAILURE',e instanceof Error?e.message:'The workspace operation failed.',data.command==='workspace.mutate'||data.command==='workspace.asset.import'?'unknown':'not-committed');if(mutationApplied)f=new UniverseFailure(f.code,f.message,'unknown');result={...base,status:'error',code:f.code,message:f.message,outcome:f.outcome,retry:f.outcome==='unknown'?'after-recovery':'new-request',issues:e instanceof WorkspaceValidationError?[{field:e.field,message:e.message}]:[]};}
        port.postMessage(result);return;
    }
    if (validProjectRequest(data, true)) {
        const base={protocolVersion:1 as const,requestId:data.requestId,command:data.command};
        let result: ProjectHostResult;
        try {
            switch(data.command) {
                case 'project.create': result={...base,status:'ok',...projects.create(data.basePath!,data.universePath!,data.input)}; break;
                case 'project.open': result={...base,status:'ok',snapshot:projects.open(data.basePath!,data.universePath,data.expectedCreationOperationId)}; break;
                case 'project.current': result={...base,status:'ok',snapshot:projects.current()}; break;
                case 'project.close': projects.close(); result={...base,status:'ok',snapshot:null}; break;
            }
        } catch(e) {
            if(e instanceof LocateProjectUniverse) result={...base,status:'locate',universeId:e.universeId};
            else {const f=e instanceof UniverseFailure?e:new UniverseFailure('IO_FAILURE','The project operation failed. Existing content was preserved.',data.command==='project.create'?'unknown':'not-committed'); result={...base,status:'error',code:f.code,message:f.message,outcome:f.outcome,retry:f.outcome==='unknown'?'after-recovery':'new-request'};}
        }
        port.postMessage(result); return;
    }
    if (validUniverseRequest(data, true)) {
        const base = { protocolVersion: 1 as const, requestId: data.requestId, command: data.command };
        let result: UniverseResult;
        try {
            switch (data.command) {
                case 'universe.create':
                    if (projects.associatedUniverseId()) throw new UniverseFailure('VALIDATION', 'Close the active project before changing its universe.');
                    result = { ...base, status: 'ok', ...universes.create(data.basePath!, data.input) };
                    break;
                case 'universe.open': {
                    const associatedId = projects.associatedUniverseId();
                    if (associatedId && !(data.reconcileExpected && 'ownerId' in data.reconcileExpected.identity && data.reconcileExpected.identity.ownerId === associatedId)) throw new UniverseFailure('VALIDATION', 'Close the active project before changing its universe.');
                    const snapshot = universes.open(data.basePath!, data.reconcileExpected);
                    const receipt = data.reconcileOperationId ? universes.reconcile(data.reconcileOperationId, data.reconcileExpected) : undefined;
                    result = { ...base, status: 'ok', snapshot, ...(receipt ? { receipt } : {}), ...(data.reconcileOperationId ? { reconciliation: { operationId: data.reconcileOperationId, outcome: receipt ? 'committed' as const : 'not-committed' as const } } : {}) };
                    break;
                }
                case 'universe.current':
                    result = { ...base, status: 'ok', snapshot: universes.current() };
                    break;
                case 'universe.profile.save':
                    result = { ...base, status: 'ok', ...universes.save(data.input) };
                    break;
                case 'universe.close':
                    if (projects.associatedUniverseId()) throw new UniverseFailure('VALIDATION', 'Close the active project before closing its universe.');
                    universes.close();
                    result = { ...base, status: 'ok', snapshot: null };
                    break;
            }
        }
        catch (error) {
            const failure = error instanceof UniverseFailure ? error : new UniverseFailure('IO_FAILURE', 'The universe operation failed. Existing content was preserved.', data.command === 'universe.create' || data.command === 'universe.profile.save' ? 'unknown' : 'not-committed');
            result = { ...base, status: 'error', code: failure.code, message: failure.message, outcome: failure.outcome, retry: failure.outcome === 'unknown' ? 'after-recovery' : 'new-request' };
        }
        port.postMessage(result);
        return;
    }
    if (!validRequest(data))
        return;
    if (fault === 'timeout')
        return;
    if (fault === 'invalid') {
        port.postMessage({ ...readiness(data), extra: true });
        return;
    }
    port.postMessage(readiness(data));
});
