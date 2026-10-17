import { UniverseApplication, UniverseFailure } from '../application/universe';
import { FileUniverseStorage } from '../infrastructure/universe-storage';
import { validUniverseRequest, type UniverseResult } from '../application/contracts/universe';
import { readiness } from '../application/readiness';
import { validRequest } from '../application/contracts/readiness';
const universes = new UniverseApplication(new FileUniverseStorage());
const port = process.parentPort;
if (!port)
    throw new Error('Application host requires a parent port');
const fault = process.argv.find(arg => arg.startsWith('--diagnostic-fault='))?.split('=')[1];
if (fault === 'exit')
    process.exit(1);
port.on('message', ({ data }: {
    data: unknown;
}) => {
    if (validUniverseRequest(data, true)) {
        const base = { protocolVersion: 1 as const, requestId: data.requestId, command: data.command };
        let result: UniverseResult;
        try {
            switch (data.command) {
                case 'universe.create':
                    result = { ...base, status: 'ok', ...universes.create(data.basePath!, data.input) };
                    break;
                case 'universe.open': {
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
