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
const bridge: WritingToolBridge & UniverseBridge = Object.freeze({
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
