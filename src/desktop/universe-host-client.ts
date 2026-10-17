import { type UniverseHostRequest, type UniverseRequest, type UniverseResult, validUniverseResult } from '../application/contracts/universe';
export function hostUnavailable(request: Pick<UniverseRequest, 'requestId' | 'command'>): UniverseResult {
    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'HOST_UNAVAILABLE', message: 'The application host did not confirm the operation. Reopen the selected universe to reconcile before continuing.', outcome: request.command === 'universe.create' || request.command === 'universe.profile.save' ? 'unknown' : 'not-committed', retry: 'after-recovery' };
}
export class UniverseHostClient {
    private pending = new Map<string, {
        request: UniverseHostRequest;
        resolve: (r: UniverseResult) => void;
        timer: ReturnType<typeof setTimeout>;
    }>();
    private expired = new Map<string, UniverseHostRequest>();
    private failed = false;
    private uncertainOperations = new Set<string>();
    constructor(private host: {
        postMessage(data: unknown): void;
    } | undefined, private timeoutMs = 15000, private limit = 32) {
        this.failed = !host;
    }
    request(request: UniverseHostRequest): Promise<UniverseResult> {
        const operationId = 'input' in request ? request.input.operationId : undefined;
        if (this.pending.has(request.requestId) || this.expired.has(request.requestId)) return Promise.resolve(hostUnavailable(request));
        const originalMayHaveRun = !!operationId && (this.uncertainOperations.has(operationId) || Array.from(this.pending.values()).some(entry => 'input' in entry.request && entry.request.input.operationId === operationId));
        if (this.failed || this.pending.size >= this.limit) {
            if (originalMayHaveRun) return Promise.resolve(hostUnavailable(request));
            return Promise.resolve({
                protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error',
                code: 'HOST_UNAVAILABLE', message: 'The command was not sent to the application host. Your edits are still available. Try again when the host is available.',
                outcome: 'not-committed', retry: 'new-request'
            });
        }
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                if (operationId) this.uncertainOperations.add(operationId);
                this.expired.set(request.requestId, request);
                if (this.expired.size > this.limit)
                    this.expired.delete(this.expired.keys().next().value!);
                this.finish(request.requestId, hostUnavailable(request));
            }, this.timeoutMs);
            this.pending.set(request.requestId, { request, resolve, timer });
            try {
                this.host!.postMessage(request);
            }
            catch {
                this.fail();
            }
        });
    }
    receive(value: unknown): void {
        const id = typeof value === 'object' && value !== null && 'requestId' in value ? value.requestId : undefined;
        if (typeof id !== 'string') {
            this.fail();
            return;
        }
        const entry = this.pending.get(id), expired = this.expired.get(id);
        if (!entry) {
            if (expired && validUniverseResult(value, expired))
                return;
            this.fail();
            return;
        }
        if (!validUniverseResult(value, entry.request)) {
            this.fail();
            return;
        }
        this.finish(id, value);
    }
    fail(): void {
        this.failed = true;
        for (const [id, entry] of this.pending) {
            if ('input' in entry.request) this.uncertainOperations.add(entry.request.input.operationId);
            this.finish(id, hostUnavailable(entry.request));
        }
    }
    private finish(id: string, result: UniverseResult): void {
        const entry = this.pending.get(id);
        if (!entry)
            return;
        clearTimeout(entry.timer);
        this.pending.delete(id);
        entry.resolve(result);
    }
}
