/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/application/contracts/readiness.ts"
/*!************************************************!*\
  !*** ./src/application/contracts/readiness.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_CODES: () => (/* binding */ ERROR_CODES),
/* harmony export */   PROTOCOL_VERSION: () => (/* binding */ PROTOCOL_VERSION),
/* harmony export */   QUERY: () => (/* binding */ QUERY),
/* harmony export */   unavailable: () => (/* binding */ unavailable),
/* harmony export */   validRequest: () => (/* binding */ validRequest),
/* harmony export */   validResult: () => (/* binding */ validResult)
/* harmony export */ });
const PROTOCOL_VERSION = 1;
const QUERY = 'application.readiness';
const ERROR_CODES = ['HOST_START_FAILED', 'HOST_EXITED', 'TIMEOUT', 'INVALID_RESPONSE', 'UNAVAILABLE'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function closed(value, keys) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}
function validRequest(value) {
    return closed(value, ['protocolVersion', 'requestId', 'query']) && value.protocolVersion === 1 && typeof value.requestId === 'string' && uuid.test(value.requestId) && value.query === QUERY;
}
function validResult(value, requestId) {
    if (typeof value !== 'object' || value === null)
        return false;
    const candidate = value;
    const ready = candidate.status === 'ready';
    return closed(value, ready ? ['protocolVersion', 'requestId', 'status'] : ['protocolVersion', 'requestId', 'status', 'code']) && candidate.protocolVersion === 1 && uuid.test(requestId) && candidate.requestId === requestId && (ready || (candidate.status === 'unavailable' && ERROR_CODES.includes(candidate.code)));
}
function unavailable(requestId, code) {
    return { protocolVersion: 1, requestId, status: 'unavailable', code };
}


/***/ },

/***/ "./src/application/contracts/universe.ts"
/*!***********************************************!*\
  !*** ./src/application/contracts/universe.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UNIVERSE_CHANNEL: () => (/* binding */ UNIVERSE_CHANNEL),
/* harmony export */   closed: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed),
/* harmony export */   commands: () => (/* binding */ commands),
/* harmony export */   isGeneration: () => (/* binding */ isGeneration),
/* harmony export */   isUuid: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid),
/* harmony export */   universeErrorCodes: () => (/* binding */ universeErrorCodes),
/* harmony export */   validProfile: () => (/* reexport safe */ _domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile),
/* harmony export */   validReceipt: () => (/* binding */ validReceipt),
/* harmony export */   validSnapshot: () => (/* binding */ validSnapshot),
/* harmony export */   validUniverseRequest: () => (/* binding */ validUniverseRequest),
/* harmony export */   validUniverseResult: () => (/* binding */ validUniverseResult)
/* harmony export */ });
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
const UNIVERSE_CHANNEL = 'writingtool:universe:v1';
const commands = ['universe.create', 'universe.open', 'universe.current', 'universe.profile.save', 'universe.close'];


const universeErrorCodes = ['VALIDATION', 'UNSUPPORTED_VERSION', 'GENERATION_CONFLICT', 'LEASE_UNAVAILABLE', 'IO_FAILURE', 'INTEGRITY_MISMATCH', 'RECOVERY_REQUIRED', 'OPERATION_CONFLICT', 'HOST_UNAVAILABLE'];
const isGeneration = (v) => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
function validUniverseRequest(v, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.requestId) || !commands.includes(x.command))
        return false;
    const mutation = x.command === 'universe.create' || x.command === 'universe.profile.save';
    const keys = ['protocolVersion', 'requestId', 'command', ...(mutation ? ['input'] : []), ...(x.command === 'universe.open' && Object.hasOwn(x, 'reconcileOperationId') ? ['reconcileOperationId'] : []), ...(internal && x.command === 'universe.open' && Object.hasOwn(x, 'reconcileExpected') ? ['reconcileExpected'] : []), ...(internal && (x.command === 'universe.create' || x.command === 'universe.open') ? ['basePath'] : [])];
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, keys) || (keys.includes('basePath') && typeof x.basePath !== 'string'))
        return false;
    if (Object.hasOwn(x, 'reconcileExpected')) {
        const e = x.reconcileExpected;
        if (!internal || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.reconcileOperationId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['identity', 'mutation']))
            return false;
        if (!((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.identity, ['ownerId', 'rootId']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.identity.ownerId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.identity.rootId)) && !((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.identity, ['creationOperationId']) && e.identity.creationOperationId === x.reconcileOperationId))
            return false;
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e.mutation, ['command', 'input']) || !['universe.create', 'universe.profile.save'].includes(String(e.mutation.command)))
            return false;
        if (!validUniverseRequest({ protocolVersion: 1, requestId: x.requestId, ...e.mutation }) || e.mutation.input.operationId !== x.reconcileOperationId)
            return false;
    }
    if (!mutation)
        return !Object.hasOwn(x, 'reconcileOperationId') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.reconcileOperationId);
    const save = x.command === 'universe.profile.save';
    const i = x.input;
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(i, ['operationId', 'submittedEditorRevision', 'data', ...(save ? ['ownerId', 'expectedUnitGeneration', 'expectedRecordVersion'] : [])]) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.operationId) && isGeneration(i.submittedEditorRevision) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(i.data) && (!save || ((0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.ownerId) && isGeneration(i.expectedUnitGeneration) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(i.expectedRecordVersion)));
}
function validSnapshot(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['ownerId', 'rootId', 'generation', 'recordVersion', 'profile', 'location']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.ownerId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.rootId) && isGeneration(v.generation) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(v.profile) && !!v.profile.name.trim() && v.profile.name === v.profile.name.trim() && typeof v.location === 'string';
}
function validReceipt(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'operationId', 'owner', 'unitGeneration', 'recordId', 'recordVersion', 'submittedEditorRevision']) && v.protocolVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.operationId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) && v.owner.kind === 'universe' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) && v.recordId === v.owner.id && isGeneration(v.unitGeneration) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && isGeneration(v.submittedEditorRevision);
}
function validUniverseResult(v, request) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command)
        return false;
    const base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.status === 'canceled')
        return (request.command === 'universe.create' || request.command === 'universe.open') && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, base);
    if (x.status === 'ok') {
        const hasReceipt = Object.hasOwn(x, 'receipt');
        const hasReconciliation = Object.hasOwn(x, 'reconciliation');
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'snapshot', ...(hasReceipt ? ['receipt'] : []), ...(hasReconciliation ? ['reconciliation'] : [])]))
            return false;
        if (request.command === 'universe.open' && request.reconcileOperationId) {
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(x.reconciliation, ['operationId', 'outcome']) || x.reconciliation.operationId !== request.reconcileOperationId || !['committed', 'not-committed'].includes(String(x.reconciliation.outcome)) || hasReceipt !== (x.reconciliation.outcome === 'committed'))
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
    return x.status === 'error' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry']) && universeErrorCodes.includes(x.code) && typeof x.message === 'string' && x.message.length > 0 && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry));
}


/***/ },

/***/ "./src/desktop/security.ts"
/*!*********************************!*\
  !*** ./src/desktop/security.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   READINESS_CHANNEL: () => (/* binding */ READINESS_CHANNEL),
/* harmony export */   trustedSender: () => (/* binding */ trustedSender)
/* harmony export */ });
const READINESS_CHANNEL = 'writingtool:readiness:v1';
function trustedSender(senderId, ownedId, isMainFrame, actualUrl, expectedUrl) {
    return senderId === ownedId && isMainFrame && actualUrl === expectedUrl;
}


/***/ },

/***/ "./src/desktop/universe-host-client.ts"
/*!*********************************************!*\
  !*** ./src/desktop/universe-host-client.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UniverseHostClient: () => (/* binding */ UniverseHostClient),
/* harmony export */   hostUnavailable: () => (/* binding */ hostUnavailable)
/* harmony export */ });
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");

function hostUnavailable(request) {
    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'HOST_UNAVAILABLE', message: 'The application host did not confirm the operation. Reopen the selected universe to reconcile before continuing.', outcome: request.command === 'universe.create' || request.command === 'universe.profile.save' ? 'unknown' : 'not-committed', retry: 'after-recovery' };
}
class UniverseHostClient {
    host;
    timeoutMs;
    limit;
    pending = new Map();
    expired = new Map();
    failed = false;
    uncertainOperations = new Set();
    constructor(host, timeoutMs = 15000, limit = 32) {
        this.host = host;
        this.timeoutMs = timeoutMs;
        this.limit = limit;
        this.failed = !host;
    }
    request(request) {
        const operationId = 'input' in request ? request.input.operationId : undefined;
        if (this.pending.has(request.requestId) || this.expired.has(request.requestId))
            return Promise.resolve(hostUnavailable(request));
        const originalMayHaveRun = !!operationId && (this.uncertainOperations.has(operationId) || Array.from(this.pending.values()).some(entry => 'input' in entry.request && entry.request.input.operationId === operationId));
        if (this.failed || this.pending.size >= this.limit) {
            if (originalMayHaveRun)
                return Promise.resolve(hostUnavailable(request));
            return Promise.resolve({
                protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error',
                code: 'HOST_UNAVAILABLE', message: 'The command was not sent to the application host. Your edits are still available. Try again when the host is available.',
                outcome: 'not-committed', retry: 'new-request'
            });
        }
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                if (operationId)
                    this.uncertainOperations.add(operationId);
                this.expired.set(request.requestId, request);
                if (this.expired.size > this.limit)
                    this.expired.delete(this.expired.keys().next().value);
                this.finish(request.requestId, hostUnavailable(request));
            }, this.timeoutMs);
            this.pending.set(request.requestId, { request, resolve, timer });
            try {
                this.host.postMessage(request);
            }
            catch {
                this.fail();
            }
        });
    }
    receive(value) {
        const id = typeof value === 'object' && value !== null && 'requestId' in value ? value.requestId : undefined;
        if (typeof id !== 'string') {
            this.fail();
            return;
        }
        const entry = this.pending.get(id), expired = this.expired.get(id);
        if (!entry) {
            if (expired && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseResult)(value, expired))
                return;
            this.fail();
            return;
        }
        if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseResult)(value, entry.request)) {
            this.fail();
            return;
        }
        this.finish(id, value);
    }
    fail() {
        this.failed = true;
        for (const [id, entry] of this.pending) {
            if ('input' in entry.request)
                this.uncertainOperations.add(entry.request.input.operationId);
            this.finish(id, hostUnavailable(entry.request));
        }
    }
    finish(id, result) {
        const entry = this.pending.get(id);
        if (!entry)
            return;
        clearTimeout(entry.timer);
        this.pending.delete(id);
        entry.resolve(result);
    }
}


/***/ },

/***/ "./src/domain/validation.ts"
/*!**********************************!*\
  !*** ./src/domain/validation.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closed: () => (/* binding */ closed),
/* harmony export */   isUuid: () => (/* binding */ isUuid),
/* harmony export */   validProfile: () => (/* binding */ validProfile)
/* harmony export */ });
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v);
function closed(v, keys) {
    return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
}
function validProfile(v) {
    return closed(v, ['name', 'description']) && typeof v.name === 'string' && typeof v.description === 'string' && [v.name, v.description].every(text => !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text));
}


/***/ },

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

module.exports = require("electron");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/desktop/preload.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _universe_host_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./universe-host-client */ "./src/desktop/universe-host-client.ts");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./security */ "./src/desktop/security.ts");





if (!process.sandboxed || !process.contextIsolated)
    throw new Error('Secure preload isolation is required');
async function universe(command, input, reconcileOperationId) {
    const request = { protocolVersion: 1, requestId: crypto.randomUUID(), command, ...(input === undefined ? {} : { input }), ...(reconcileOperationId ? { reconcileOperationId } : {}) };
    if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseRequest)(request))
        return { protocolVersion: 1, requestId: request.requestId, command, status: 'error', code: 'VALIDATION', message: 'The universe command contains invalid fields or Unicode.', outcome: 'not-committed', retry: 'new-request' };
    try {
        const result = await electron__WEBPACK_IMPORTED_MODULE_2__.ipcRenderer.invoke(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.UNIVERSE_CHANNEL, request);
        return (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_0__.validUniverseResult)(result, request) ? result : (0,_universe_host_client__WEBPACK_IMPORTED_MODULE_1__.hostUnavailable)(request);
    }
    catch {
        return (0,_universe_host_client__WEBPACK_IMPORTED_MODULE_1__.hostUnavailable)(request);
    }
}
const bridge = Object.freeze({
    createUniverse: (input) => universe('universe.create', input),
    openUniverse: (operationId) => universe('universe.open', undefined, operationId),
    currentUniverse: () => universe('universe.current'),
    saveUniverseProfile: (input) => universe('universe.profile.save', input),
    closeUniverse: () => universe('universe.close'),
    async readiness() {
        const requestId = crypto.randomUUID();
        try {
            const result = await electron__WEBPACK_IMPORTED_MODULE_2__.ipcRenderer.invoke(_security__WEBPACK_IMPORTED_MODULE_4__.READINESS_CHANNEL, { protocolVersion: 1, requestId, query: _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__.QUERY });
            return (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__.validResult)(result, requestId) ? result : (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__.unavailable)(requestId, 'INVALID_RESPONSE');
        }
        catch {
            return (0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__.unavailable)(requestId, 'UNAVAILABLE');
        }
    },
});
electron__WEBPACK_IMPORTED_MODULE_2__.contextBridge.exposeInMainWorld('writingTool', bridge);
// Purpose-bound lifecycle notification; no extra public bridge or renderer payload.
document.addEventListener('writingtool-request-quit', () => electron__WEBPACK_IMPORTED_MODULE_2__.ipcRenderer.send('writingtool:quit-request:v1', { protocolVersion: 1, requestId: crypto.randomUUID(), command: 'application.quit' }));
// Explicit diagnostic-only probe; probes never expose arbitrary renderer IPC.
if (process.argv.includes('--writingtool-smoke')) {
    const request = { protocolVersion: 1, requestId: crypto.randomUUID(), query: _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_3__.QUERY };
    void Promise.all([
        { ...request, extra: true }, { ...request, protocolVersion: 2 },
        { ...request, query: 'filesystem.read' }, { ...request, requestId: 'invalid' },
    ].map(async (invalid) => {
        try {
            await electron__WEBPACK_IMPORTED_MODULE_2__.ipcRenderer.invoke(_security__WEBPACK_IMPORTED_MODULE_4__.READINESS_CHANNEL, invalid);
            return false;
        }
        catch {
            return true;
        }
    })).then(results => console.log('WRITINGTOOL_INVALID_REQUESTS ' + results.every(Boolean)));
}

})();

/******/ })()
;
//# sourceMappingURL=preload.cjs.map