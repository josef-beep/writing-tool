import {PROTECTION_CHANNEL,validProtectionRequest,validProtectionResult,type ProtectionBridge,type ProtectionCommand,type ProtectionRequest,type ProtectionResult} from '../application/contracts/protection';
import {PRESENTATION_CHANNEL,type PresentationCommand,type PresentationResult,type PresentationEvent} from '../application/contracts/presentation';
import {WORKSPACE_CHANNEL,validWorkspaceRequest,validWorkspaceResult,type WorkspaceBridge,type WorkspaceCommand,type WorkspaceRequest,type WorkspaceResult} from '../application/contracts/workspace';
import {workspaceUnavailable} from './workspace-host-client';
import {PROJECT_CHANNEL, validProjectRequest, validProjectResult, type ProjectBridge, type ProjectCreateInput, type ProjectRequest, type ProjectResult} from '../application/contracts/project';
import {projectUnavailable} from './project-host-client';
import { UNIVERSE_CHANNEL, validUniverseResult, validUniverseRequest, type UniverseResult, type UniverseBridge, type UniverseRequest, type CreateInput, type SaveInput } from '../application/contracts/universe';
import { hostUnavailable } from './universe-host-client';
import { contextBridge, ipcRenderer } from 'electron';
import { type WritingToolBridge, QUERY, unavailable, validResult } from '../application/contracts/readiness';
import { READINESS_CHANNEL } from './security';
if (!process.sandboxed || !process.contextIsolated)
    throw new Error('Secure preload isolation is required');
async function universe(command: UniverseRequest['command'], input?: unknown, reconcileOperationId?: string): Promise<UniverseResult> {
    const request = { protocolVersion: 1 as const, requestId: crypto.randomUUID(), command, ...(input === undefined ? {} : { input }), ...(reconcileOperationId ? { reconcileOperationId } : {}) } as UniverseRequest;
    if (!validUniverseRequest(request))
        return { protocolVersion: 1, requestId: request.requestId, command, status: 'error', code: 'VALIDATION', message: 'The universe command contains invalid fields or Unicode.', outcome: 'not-committed', retry: 'new-request' };
    try {
        const result: unknown = await ipcRenderer.invoke(UNIVERSE_CHANNEL, request);
        return validUniverseResult(result, request) ? result : hostUnavailable(request);
    }
    catch {
        return hostUnavailable(request);
    }
}
async function project(command: ProjectRequest['command'], input?: ProjectCreateInput): Promise<ProjectResult> {
    const request={protocolVersion:1 as const,requestId:crypto.randomUUID(),command,...(input?{input}:{})} as ProjectRequest;
    if(!validProjectRequest(request)) return {protocolVersion:1,requestId:request.requestId,command,status:'error',code:'VALIDATION',message:'The project command contains invalid fields.',outcome:'not-committed',retry:'new-request'};
    try {const result:unknown=await ipcRenderer.invoke(PROJECT_CHANNEL,request);return validProjectResult(result,request) && result.status!=='locate'?result:projectUnavailable(request);}
    catch {return projectUnavailable(request);}
}
let workspaceTransport:Promise<unknown>=Promise.resolve();
const bridge: WritingToolBridge & UniverseBridge & ProjectBridge & WorkspaceBridge & ProtectionBridge = Object.freeze({
    protection:async(command:ProtectionCommand):Promise<ProtectionResult>=>{const request={...command,protocolVersion:1 as const,requestId:crypto.randomUUID()} as ProtectionRequest;try{document.dispatchEvent(new CustomEvent('writingtool-protection-progress',{detail:{operationId:request.requestId,phase:'Preparing operation',cancelable:!['protection.open','protection.cancel'].includes(request.command)}}));if(!validProtectionRequest(request))throw new Error('Invalid protection command.');const result:unknown=await ipcRenderer.invoke(PROTECTION_CHANNEL,request);if(validProtectionResult(result,request))return result;throw new Error('Unconfirmed protection result.');}catch(e){return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',message:e instanceof Error?e.message:'Protection service unavailable.',outcome:'unknown',operationId:request.requestId};}},
    workspace: (command:WorkspaceCommand):Promise<WorkspaceResult>=>{const run=async():Promise<WorkspaceResult>=>{const request={...command,protocolVersion:1 as const,requestId:crypto.randomUUID()} as WorkspaceRequest;if(!validWorkspaceRequest(request))return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',code:'VALIDATION',message:'Invalid workspace command.',outcome:'not-committed',retry:'new-request',issues:[]};try{const result:unknown=await ipcRenderer.invoke(WORKSPACE_CHANNEL,request);return validWorkspaceResult(result,request)?result:workspaceUnavailable(request);}catch{return workspaceUnavailable(request);}};const response=workspaceTransport.then(run,run);workspaceTransport=response.then(()=>undefined,()=>undefined);return response;},
    createProject: (input: ProjectCreateInput) => project('project.create',input),
    openProject: () => project('project.open'),
    currentProject: () => project('project.current'),
    closeProject: () => project('project.close'),
    createUniverse: (input: CreateInput) => universe('universe.create', input),
    openUniverse: (operationId?: string) => universe('universe.open', undefined, operationId),
    currentUniverse: () => universe('universe.current'),
    saveUniverseProfile: (input: SaveInput) => universe('universe.profile.save', input),
    closeUniverse: () => universe('universe.close'),
    async readiness() {
        const requestId = crypto.randomUUID();
        try {
            const result: unknown = await ipcRenderer.invoke(READINESS_CHANNEL, { protocolVersion: 1, requestId, query: QUERY });
            return validResult(result, requestId) ? result : unavailable(requestId, 'INVALID_RESPONSE');
        }
        catch {
            return unavailable(requestId, 'UNAVAILABLE');
        }
    },
});
contextBridge.exposeInMainWorld('writingTool', bridge);
// Purpose-bound lifecycle notification; no extra public bridge or renderer payload.
document.addEventListener('writingtool-request-quit', () => ipcRenderer.send('writingtool:quit-request:v1', { protocolVersion: 1, requestId: crypto.randomUUID(), command: 'application.quit' }));
// Explicit diagnostic-only probe; probes never expose arbitrary renderer IPC.
if (process.argv.includes('--writingtool-smoke')) {
    const request = { protocolVersion: 1, requestId: crypto.randomUUID(), query: QUERY };
    void Promise.all([
        { ...request, extra: true }, { ...request, protocolVersion: 2 },
        { ...request, query: 'filesystem.read' }, { ...request, requestId: 'invalid' },
    ].map(async (invalid) => {
        try {
            await ipcRenderer.invoke(READINESS_CHANNEL, invalid);
            return false;
        }
        catch {
            return true;
        }
    })).then(results => console.log('WRITINGTOOL_INVALID_REQUESTS ' + results.every(Boolean)));
}

contextBridge.exposeInMainWorld('writingToolPresentation', Object.freeze({
 presentation: async (command:PresentationCommand):Promise<PresentationResult> => { try { return await ipcRenderer.invoke(PRESENTATION_CHANNEL,command) as PresentationResult; } catch { return {status:'error',message:'Desktop presentation service unavailable.'}; } },
 onPresentation: (listener:(event:PresentationEvent)=>void) => { const receive=(_event:Electron.IpcRendererEvent,value:PresentationEvent)=>listener(value);ipcRenderer.on('writingtool:presentation-event:v1',receive);return ()=>ipcRenderer.removeListener('writingtool:presentation-event:v1',receive); }
}));

ipcRenderer.on('writingtool:system-resume:v1',()=>document.dispatchEvent(new Event('writingtool-system-resume')));

ipcRenderer.on('writingtool:protection-progress:v1',(_event,value:unknown)=>{if(typeof value==='object'&&value&&'operationId'in value&&'phase'in value&&'cancelable'in value&&typeof value.operationId==='string'&&typeof value.phase==='string'&&typeof value.cancelable==='boolean')document.dispatchEvent(new CustomEvent('writingtool-protection-progress',{detail:value}));});

ipcRenderer.on('writingtool:recovered-context:v1',()=>document.dispatchEvent(new Event('writingtool-recovered-context')));
