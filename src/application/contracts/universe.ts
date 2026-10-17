export const UNIVERSE_CHANNEL = 'writingtool:universe:v1';
export const commands = ['universe.create', 'universe.open', 'universe.current', 'universe.profile.save', 'universe.close'] as const;
export type UniverseCommand = typeof commands[number];
import { closed, isUuid, validProfile, type ProfileData } from '../../domain/validation';
export { closed, isUuid, validProfile, type ProfileData } from '../../domain/validation';
export type SaveInput = {
    operationId: string;
    ownerId: string;
    expectedUnitGeneration: string;
    expectedRecordVersion: string;
    submittedEditorRevision: string;
    data: ProfileData;
};
export type CreateInput = {
    operationId: string;
    submittedEditorRevision: string;
    data: ProfileData;
};
export type UniverseRequest = {
    protocolVersion: 1;
    requestId: string;
} & ({
    command: 'universe.create';
    input: CreateInput;
} | {
    command: 'universe.profile.save';
    input: SaveInput;
} | {
    command: 'universe.open';
    reconcileOperationId?: string;
} | {
    command: 'universe.current' | 'universe.close';
});
export type ReconciliationExpectation = {
    identity: {
        ownerId: string;
        rootId: string;
    } | {
        creationOperationId: string;
    };
    mutation: {
        command: 'universe.create';
        input: CreateInput;
    } | {
        command: 'universe.profile.save';
        input: SaveInput;
    };
};
export type UniverseHostRequest = UniverseRequest & {
    basePath?: string;
    reconcileExpected?: ReconciliationExpectation;
};
export type UniverseSnapshot = {
    ownerId: string;
    rootId: string;
    generation: string;
    recordVersion: string;
    profile: ProfileData;
    location: string;
};
export type SaveReceipt = {
    protocolVersion: 1;
    operationId: string;
    owner: {
        kind: 'universe';
        id: string;
    };
    unitGeneration: string;
    recordId: string;
    recordVersion: string;
    submittedEditorRevision: string;
};
export const universeErrorCodes = ['VALIDATION', 'UNSUPPORTED_VERSION', 'GENERATION_CONFLICT', 'LEASE_UNAVAILABLE', 'IO_FAILURE', 'INTEGRITY_MISMATCH', 'RECOVERY_REQUIRED', 'OPERATION_CONFLICT', 'HOST_UNAVAILABLE'] as const;
export type UniverseErrorCode = typeof universeErrorCodes[number];
export type UniverseResult = {
    protocolVersion: 1;
    requestId: string;
    command: UniverseCommand;
} & ({
    status: 'ok';
    snapshot: UniverseSnapshot | null;
    receipt?: SaveReceipt;
    reconciliation?: {
        operationId: string;
        outcome: 'committed' | 'not-committed';
    };
} | {
    status: 'canceled';
} | {
    status: 'error';
    code: UniverseErrorCode;
    message: string;
    outcome: 'not-committed' | 'committed' | 'unknown';
    retry: 'same-operation' | 'new-request' | 'after-recovery' | 'not-retryable';
});
export interface UniverseBridge {
    createUniverse(input: CreateInput): Promise<UniverseResult>;
    openUniverse(reconcileOperationId?: string): Promise<UniverseResult>;
    currentUniverse(): Promise<UniverseResult>;
    saveUniverseProfile(input: SaveInput): Promise<UniverseResult>;
    closeUniverse(): Promise<UniverseResult>;
}
export const isGeneration = (v: unknown): v is string => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
export function validUniverseRequest(v: unknown, internal = false): v is UniverseHostRequest {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v as Record<string, unknown>;
    if (x.protocolVersion !== 1 || !isUuid(x.requestId) || !commands.includes(x.command as UniverseCommand))
        return false;
    const mutation = x.command === 'universe.create' || x.command === 'universe.profile.save';
    const keys = ['protocolVersion', 'requestId', 'command', ...(mutation ? ['input'] : []), ...(x.command === 'universe.open' && Object.hasOwn(x, 'reconcileOperationId') ? ['reconcileOperationId'] : []), ...(internal && x.command === 'universe.open' && Object.hasOwn(x, 'reconcileExpected') ? ['reconcileExpected'] : []), ...(internal && (x.command === 'universe.create' || x.command === 'universe.open') ? ['basePath'] : [])];
    if (!closed(v, keys) || (keys.includes('basePath') && typeof x.basePath !== 'string'))
        return false;
    if (Object.hasOwn(x, 'reconcileExpected')) {
        const e = x.reconcileExpected;
        if (!internal || !isUuid(x.reconcileOperationId) || !closed(e, ['identity', 'mutation']))
            return false;
        if (!(closed(e.identity, ['ownerId', 'rootId']) && isUuid(e.identity.ownerId) && isUuid(e.identity.rootId)) && !(closed(e.identity, ['creationOperationId']) && e.identity.creationOperationId === x.reconcileOperationId))
            return false;
        if (!closed(e.mutation, ['command', 'input']) || !['universe.create', 'universe.profile.save'].includes(String(e.mutation.command)))
            return false;
        if (!validUniverseRequest({ protocolVersion: 1, requestId: x.requestId, ...e.mutation }) || (e.mutation.input as CreateInput).operationId !== x.reconcileOperationId)
            return false;
    }
    if (!mutation)
        return !Object.hasOwn(x, 'reconcileOperationId') || isUuid(x.reconcileOperationId);
    const save = x.command === 'universe.profile.save';
    const i = x.input;
    return closed(i, ['operationId', 'submittedEditorRevision', 'data', ...(save ? ['ownerId', 'expectedUnitGeneration', 'expectedRecordVersion'] : [])]) && isUuid(i.operationId) && isGeneration(i.submittedEditorRevision) && validProfile(i.data) && (!save || (isUuid(i.ownerId) && isGeneration(i.expectedUnitGeneration) && isUuid(i.expectedRecordVersion)));
}
export function validSnapshot(v: unknown): v is UniverseSnapshot {
    return closed(v, ['ownerId', 'rootId', 'generation', 'recordVersion', 'profile', 'location']) && isUuid(v.ownerId) && isUuid(v.rootId) && isGeneration(v.generation) && isUuid(v.recordVersion) && validProfile(v.profile) && !!v.profile.name.trim() && v.profile.name === v.profile.name.trim() && typeof v.location === 'string';
}
export function validReceipt(v: unknown): v is SaveReceipt {
    return closed(v, ['protocolVersion', 'operationId', 'owner', 'unitGeneration', 'recordId', 'recordVersion', 'submittedEditorRevision']) && v.protocolVersion === 1 && isUuid(v.operationId) && closed(v.owner, ['kind', 'id']) && v.owner.kind === 'universe' && isUuid(v.owner.id) && v.recordId === v.owner.id && isGeneration(v.unitGeneration) && isUuid(v.recordVersion) && isGeneration(v.submittedEditorRevision);
}
export function validUniverseResult(v: unknown, request: Pick<UniverseRequest, 'requestId' | 'command'> & {
    input?: CreateInput | SaveInput;
    reconcileOperationId?: string;
}): v is UniverseResult {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v as Record<string, unknown>;
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command)
        return false;
    const base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.status === 'canceled')
        return (request.command === 'universe.create' || request.command === 'universe.open') && closed(v, base);
    if (x.status === 'ok') {
        const hasReceipt = Object.hasOwn(x, 'receipt');
        const hasReconciliation = Object.hasOwn(x, 'reconciliation');
        if (!closed(v, [...base, 'snapshot', ...(hasReceipt ? ['receipt'] : []), ...(hasReconciliation ? ['reconciliation'] : [])]))
            return false;
        if (request.command === 'universe.open' && request.reconcileOperationId) {
            if (!closed(x.reconciliation, ['operationId', 'outcome']) || x.reconciliation.operationId !== request.reconcileOperationId || !['committed', 'not-committed'].includes(String(x.reconciliation.outcome)) || hasReceipt !== (x.reconciliation.outcome === 'committed'))
                return false;
        }
        else if (hasReconciliation)
            return false;
        if (request.command === 'universe.close')
            return x.snapshot === null && !hasReceipt;
        if (request.command === 'universe.current')
            return !hasReceipt && (x.snapshot === null || validSnapshot(x.snapshot));
        if (!validSnapshot(x.snapshot))
            return false;
        if (request.command === 'universe.open' && !hasReceipt)
            return true;
        if (!validReceipt(x.receipt) || x.receipt.owner.id !== x.snapshot.ownerId || BigInt(x.receipt.unitGeneration) > BigInt(x.snapshot.generation))
            return false;
        if (x.receipt.unitGeneration === x.snapshot.generation && x.receipt.recordVersion !== x.snapshot.recordVersion)
            return false;
        if (request.command === 'universe.open')
            return !!request.reconcileOperationId && x.receipt.operationId === request.reconcileOperationId;
        return !!request.input && x.receipt.operationId === request.input.operationId && x.receipt.submittedEditorRevision === request.input.submittedEditorRevision && (!('ownerId' in request.input) || x.receipt.owner.id === request.input.ownerId);
    }
    return x.status === 'error' && closed(v, [...base, 'code', 'message', 'outcome', 'retry']) && universeErrorCodes.includes(x.code as UniverseErrorCode) && typeof x.message === 'string' && x.message.length > 0 && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry));
}
