export const PROTOCOL_VERSION = 1 as const;
export const QUERY = 'application.readiness' as const;
export const ERROR_CODES = ['HOST_START_FAILED', 'HOST_EXITED', 'TIMEOUT', 'INVALID_RESPONSE', 'UNAVAILABLE'] as const;
export type HostErrorCode = typeof ERROR_CODES[number];
export type ReadinessRequest = { protocolVersion: 1; requestId: string; query: typeof QUERY };
export type ReadinessResult = { protocolVersion: 1; requestId: string } & ({status: 'ready'} | {status: 'unavailable'; code: HostErrorCode});
export interface WritingToolBridge { readiness(): Promise<ReadinessResult> }
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function closed(value: unknown, keys: string[]): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}
export function validRequest(value: unknown): value is ReadinessRequest {
  return closed(value, ['protocolVersion', 'requestId', 'query']) && value.protocolVersion === 1 && typeof value.requestId === 'string' && uuid.test(value.requestId) && value.query === QUERY;
}
export function validResult(value: unknown, requestId: string): value is ReadinessResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const ready = candidate.status === 'ready';
  return closed(value, ready ? ['protocolVersion', 'requestId', 'status'] : ['protocolVersion', 'requestId', 'status', 'code']) && candidate.protocolVersion === 1 && uuid.test(requestId) && candidate.requestId === requestId && (ready || (candidate.status === 'unavailable' && ERROR_CODES.includes(candidate.code as HostErrorCode)));
}
export function unavailable(requestId: string, code: HostErrorCode): ReadinessResult {
  return {protocolVersion: 1, requestId, status: 'unavailable', code};
}
