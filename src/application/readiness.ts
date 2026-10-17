import { type ReadinessRequest, type ReadinessResult, validRequest } from './contracts/readiness';
/** A non-mutating application query. No persistence or infrastructure is initialized. */
export function readiness(request: ReadinessRequest): ReadinessResult {
  if (!validRequest(request)) throw new Error('Invalid readiness request');
  return {protocolVersion: 1, requestId: request.requestId, status: 'ready'};
}
