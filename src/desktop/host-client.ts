import { type HostErrorCode, type ReadinessRequest, type ReadinessResult, unavailable, validResult } from '../application/contracts/readiness';
export interface HostTransport { postMessage(message: ReadinessRequest): void }
type Pending = {resolve: (result: ReadinessResult) => void; timer: ReturnType<typeof setTimeout>};

export class HostClient {
  
  private pending = new Map<string, Pending>();
  private expired = new Set<string>();
  private failure: HostErrorCode | undefined;
  
  constructor(private host: HostTransport | undefined, private timeoutMs = 5000, private limit = 32) {
    if (!host) this.failure = 'HOST_START_FAILED';
  }
  
  get pendingCount(): number { return this.pending.size; }
  
  request(request: ReadinessRequest): Promise<ReadinessResult> {
    if (this.failure) return Promise.resolve(unavailable(request.requestId, this.failure));
    if (this.pending.size >= this.limit || this.pending.has(request.requestId) || this.expired.has(request.requestId)) return Promise.resolve(unavailable(request.requestId, 'UNAVAILABLE'));
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        this.expired.add(request.requestId);
        if (this.expired.size > this.limit) this.expired.delete(this.expired.values().next().value!);
        this.finish(request.requestId, unavailable(request.requestId, 'TIMEOUT'));
      }, this.timeoutMs);
      this.pending.set(request.requestId, {resolve, timer});
      try { this.host?.postMessage(request); } catch { this.fail('HOST_EXITED'); }
    });
  }
  
  receive(message: unknown): void {
    const id = typeof message === 'object' && message !== null && 'requestId' in message ? message.requestId : undefined;
    if (typeof id === 'string' && this.expired.has(id) && validResult(message, id)) return;
    if (typeof id !== 'string' || !this.pending.has(id)) { this.fail('INVALID_RESPONSE'); return; }
    if (!validResult(message, id)) { this.fail('INVALID_RESPONSE'); return; }
    this.finish(id, message);
  }
  
  fail(code: HostErrorCode): void {
    this.failure ??= code;
    for (const id of this.pending.keys()) this.finish(id, unavailable(id, this.failure));
  }
  
  private finish(id: string, result: ReadinessResult): void {
    const entry = this.pending.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    this.pending.delete(id);
    entry.resolve(result);
  }
}
