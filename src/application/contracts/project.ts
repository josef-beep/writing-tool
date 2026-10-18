import { closed, isUuid, isGeneration, validSnapshot, universeErrorCodes, type UniverseSnapshot, type UniverseErrorCode } from './universe';
export const PROJECT_CHANNEL = 'writingtool:project:v1';
export const projectCommands = ['project.create', 'project.open', 'project.current', 'project.close'] as const;
export type ProjectCommand = typeof projectCommands[number];
export type ProjectCreateInput = { operationId: string };
export type ProjectRequest = { protocolVersion: 1; requestId: string } & ({command: 'project.create'; input: ProjectCreateInput} | {command: 'project.open' | 'project.current' | 'project.close'});
export type ProjectHostRequest = ProjectRequest & { basePath?: string; universePath?: string; expectedCreationOperationId?: string };
export type ProjectIdentity = { ownerId: string; rootId: string; universeId: string; generation: string; recordVersion: string; location: string; universeLocation: string; creationOperationId: string };
export type ProjectSnapshot = ProjectIdentity & { universe: UniverseSnapshot };
export type ProjectReceipt = { protocolVersion: 1; operationId: string; owner: {kind: 'project'; id: string}; unitGeneration: '1'; recordId: string; recordVersion: string };
export type ProjectResult = { protocolVersion: 1; requestId: string; command: ProjectCommand } & ({status: 'ok'; snapshot: ProjectSnapshot | null; receipt?: ProjectReceipt} | {status: 'canceled'} | {status: 'error'; code: UniverseErrorCode; message: string; outcome: 'not-committed' | 'committed' | 'unknown'; retry: 'same-operation' | 'new-request' | 'after-recovery' | 'not-retryable'});
export type ProjectHostResult = ProjectResult | {protocolVersion: 1; requestId: string; command: ProjectCommand; status: 'locate'; universeId: string};
export interface ProjectBridge {
    createProject(input: ProjectCreateInput): Promise<ProjectResult>;
    openProject(): Promise<ProjectResult>;
    currentProject(): Promise<ProjectResult>;
    closeProject(): Promise<ProjectResult>;
}
export function validProjectRequest(v: unknown, internal = false): v is ProjectHostRequest {
    if (typeof v !== 'object' || v === null) return false;
    const x = v as Record<string, unknown>;
    if (x.protocolVersion !== 1 || !isUuid(x.requestId) || !projectCommands.includes(x.command as ProjectCommand)) return false;
    const selecting = x.command === 'project.create' || x.command === 'project.open';
    const extras = internal && selecting ? ['basePath', ...(Object.hasOwn(x, 'universePath') ? ['universePath'] : []), ...(Object.hasOwn(x, 'expectedCreationOperationId') ? ['expectedCreationOperationId'] : [])] : [];
    return closed(v, ['protocolVersion', 'requestId', 'command', ...(x.command === 'project.create' ? ['input'] : []), ...extras]) && (!extras.length || (typeof x.basePath === 'string' && (!Object.hasOwn(x, 'universePath') || typeof x.universePath === 'string') && (!Object.hasOwn(x, 'expectedCreationOperationId') || isUuid(x.expectedCreationOperationId)))) && (x.command !== 'project.create' || (closed(x.input, ['operationId']) && isUuid(x.input.operationId)));
}
export function validProjectIdentity(v: unknown): v is ProjectIdentity {
    return closed(v, ['ownerId','rootId','universeId','generation','recordVersion','location','universeLocation','creationOperationId']) && isUuid(v.ownerId) && isUuid(v.rootId) && isUuid(v.universeId) && isGeneration(v.generation) && isUuid(v.recordVersion) && typeof v.location === 'string' && typeof v.universeLocation === 'string' && isUuid(v.creationOperationId);
}
export function validProjectReceipt(v: unknown): v is ProjectReceipt {
    return closed(v, ['protocolVersion','operationId','owner','unitGeneration','recordId','recordVersion']) && v.protocolVersion === 1 && isUuid(v.operationId) && closed(v.owner,['kind','id']) && v.owner.kind === 'project' && isUuid(v.owner.id) && v.recordId === v.owner.id && v.unitGeneration === '1' && isUuid(v.recordVersion);
}
export function validProjectResult(v: unknown, request: Pick<ProjectRequest,'requestId'|'command'> & {input?: ProjectCreateInput}, internal = false): v is ProjectHostResult {
    if (typeof v !== 'object' || v === null) return false;
    const x = v as Record<string, unknown>, base = ['protocolVersion','requestId','command','status'];
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command) return false;
    if (x.status === 'locate') return internal && request.command === 'project.open' && closed(v,[...base,'universeId']) && isUuid(x.universeId);
    if (x.status === 'canceled') return ['project.create','project.open'].includes(request.command) && closed(v,base);
    if (x.status === 'error') return closed(v,[...base,'code','message','outcome','retry']) && universeErrorCodes.includes(x.code as UniverseErrorCode) && typeof x.message === 'string' && !!x.message && ['not-committed','committed','unknown'].includes(String(x.outcome)) && ['same-operation','new-request','after-recovery','not-retryable'].includes(String(x.retry));
    if (x.status !== 'ok' || !closed(v,[...base,'snapshot',...(Object.hasOwn(x,'receipt') ? ['receipt'] : [])])) return false;
    if (x.snapshot === null) return ['project.current','project.close'].includes(request.command) && !Object.hasOwn(x,'receipt');
    if (request.command === 'project.close' || typeof x.snapshot !== 'object' || x.snapshot === null) return false;
    const {universe, ...identity} = x.snapshot as Record<string,unknown>;
    if (!validProjectIdentity(identity) || !validSnapshot(universe) || universe.ownerId !== identity.universeId || universe.location !== identity.universeLocation) return false;
    return Object.hasOwn(x,'receipt') ? request.command === 'project.create' && validProjectReceipt(x.receipt) && x.receipt.owner.id === identity.ownerId && x.receipt.recordVersion === identity.recordVersion && (!request.input || x.receipt.operationId === request.input.operationId) : request.command !== 'project.create';
}
