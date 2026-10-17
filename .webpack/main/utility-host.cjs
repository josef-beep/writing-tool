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

/***/ "./src/application/readiness.ts"
/*!**************************************!*\
  !*** ./src/application/readiness.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readiness: () => (/* binding */ readiness)
/* harmony export */ });
/* harmony import */ var _contracts_readiness__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contracts/readiness */ "./src/application/contracts/readiness.ts");

/** A non-mutating application query. No persistence or infrastructure is initialized. */
function readiness(request) {
    if (!(0,_contracts_readiness__WEBPACK_IMPORTED_MODULE_0__.validRequest)(request))
        throw new Error('Invalid readiness request');
    return { protocolVersion: 1, requestId: request.requestId, status: 'ready' };
}


/***/ },

/***/ "./src/application/universe.ts"
/*!*************************************!*\
  !*** ./src/application/universe.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UniverseApplication: () => (/* binding */ UniverseApplication),
/* harmony export */   UniverseFailure: () => (/* binding */ UniverseFailure)
/* harmony export */ });
class UniverseFailure extends Error {
    code;
    outcome;
    committedReceipt;
    constructor(code, message, outcome = 'not-committed', committedReceipt) {
        super(message);
        this.code = code;
        this.outcome = outcome;
        this.committedReceipt = committedReceipt;
    }
}
class UniverseApplication {
    storage;
    active;
    constructor(storage) {
        this.storage = storage;
    }
    current() {
        return this.active?.snapshot() ?? null;
    }
    create(basePath, input) {
        // Refuse predictable departure failures before reserving another root.
        this.active?.snapshot();
        const { store, receipt } = this.storage.create(basePath, input);
        try {
            return { snapshot: this.activate(store), receipt };
        }
        catch {
            throw new UniverseFailure('RECOVERY_REQUIRED', 'The universe was created and saved in the selected folder, but activation failed. The previous context and the durable creation receipt were preserved.', 'committed', receipt);
        }
    }
    open(basePath, expected) {
        if (this.active?.location === this.storage.physicalPath(basePath)) {
            if (expected)
                this.active.validateExpected(expected);
            this.active.recover();
            return this.active.snapshot();
        }
        if (expected)
            this.active?.prepareRelocatedReopen(this.storage.physicalPath(basePath), expected);
        return this.activate(this.storage.open(basePath, expected));
    }
    reconcile(operationId, expected) {
        return this.active?.reconcile(operationId, expected);
    }
    save(input) {
        if (!this.active)
            throw new UniverseFailure('VALIDATION', 'Open a universe before saving.');
        const receipt = this.active.save(input);
        return { snapshot: this.active.snapshot(), receipt };
    }
    close() {
        this.active?.close();
        this.active = undefined;
    }
    activate(store) {
        try {
            const snapshot = store.snapshot();
            this.active?.close();
            this.active = store;
            return snapshot;
        }
        catch (error) {
            store.close();
            throw error;
        }
    }
}


/***/ },

/***/ "./src/domain/universe.ts"
/*!********************************!*\
  !*** ./src/domain/universe.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   profileData: () => (/* binding */ profileData),
/* harmony export */   validEnvelope: () => (/* binding */ validEnvelope)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");

function profileData(data) {
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(data) || !data.name.trim())
        throw new Error('A universe name is required.');
    return { name: data.name.trim(), description: data.description };
}
function validEnvelope(v) {
    return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) && v.schemaVersion === 1 && v.recordType === 'universe-profile' && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) && v.universeId === v.id && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) && v.owner.kind === 'universe' && v.owner.id === v.id && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.validProfile)(v.data) && !!v.data.name.trim() && v.data.name === v.data.name.trim();
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

/***/ "./src/infrastructure/universe-ddl.ts"
/*!********************************************!*\
  !*** ./src/infrastructure/universe-ddl.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CATALOG_DDL: () => (/* binding */ CATALOG_DDL),
/* harmony export */   LEASE_DDL: () => (/* binding */ LEASE_DDL)
/* harmony export */ });
// Version one creates only Story 1.2 authority, profile indexing and durable receipts.
const CATALOG_DDL = `
PRAGMA application_id=1465140300;
PRAGMA user_version=1;
CREATE TABLE unit_meta (singleton INTEGER PRIMARY KEY CHECK(singleton=1), schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1), ownerId TEXT NOT NULL, rootId TEXT NOT NULL, generation TEXT NOT NULL, sessionToken TEXT NOT NULL, creationOperationId TEXT NOT NULL, creationDigest TEXT NOT NULL, creationState TEXT NOT NULL CHECK(creationState IN ('preparing','complete')));
CREATE TABLE root_locations (rootId TEXT PRIMARY KEY, ownerKind TEXT NOT NULL CHECK(ownerKind='universe'), ownerId TEXT NOT NULL, basePath TEXT NOT NULL, bindingVersion TEXT NOT NULL);
CREATE TABLE records (id TEXT PRIMARY KEY, rootId TEXT NOT NULL REFERENCES root_locations(rootId), recordType TEXT NOT NULL CHECK(recordType='universe-profile'), relativePath TEXT NOT NULL UNIQUE, recordVersion TEXT NOT NULL, sha256 TEXT NOT NULL);
CREATE TABLE committed_operations (operationId TEXT PRIMARY KEY, requestDigest TEXT NOT NULL, generation TEXT NOT NULL, resultDigest TEXT NOT NULL, receiptData TEXT NOT NULL);
`;
const LEASE_DDL = `PRAGMA application_id=1465140300; PRAGMA user_version=1; CREATE TABLE lease_identity (singleton INTEGER PRIMARY KEY CHECK(singleton=1), schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1), ownerId TEXT NOT NULL, rootId TEXT NOT NULL);`;


/***/ },

/***/ "./src/infrastructure/universe-files.ts"
/*!**********************************************!*\
  !*** ./src/infrastructure/universe-files.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonical: () => (/* binding */ canonical),
/* harmony export */   checked: () => (/* binding */ checked),
/* harmony export */   decode: () => (/* binding */ decode),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   jsonBytes: () => (/* binding */ jsonBytes),
/* harmony export */   preserveMarker: () => (/* binding */ preserveMarker),
/* harmony export */   publishMarker: () => (/* binding */ publishMarker),
/* harmony export */   readManaged: () => (/* binding */ readManaged),
/* harmony export */   replaceManaged: () => (/* binding */ replaceManaged),
/* harmony export */   syncDir: () => (/* binding */ syncDir),
/* harmony export */   writeExclusive: () => (/* binding */ writeExclusive)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);



const hash = (bytes) => (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.createHash)('sha256').update(bytes).digest('hex');
// RFC8785 for the closed JSON-only slice: keys are UTF-16 sorted; no domain numbers.
function canonical(v) {
    if (v === null || typeof v !== 'object')
        return JSON.stringify(v);
    if (Array.isArray(v))
        return '[' + v.map(canonical).join(',') + ']';
    const o = v;
    return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}';
}
const jsonBytes = (v) => canonical(v) + '\n';
// Scan keys before JSON.parse can erase duplicates, while retaining normal JSON grammar.
function decode(bytes) {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
        throw new Error('BOM is unsupported');
    const s = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    let i = 0;
    const ws = () => {
        while (/[\x20\t\r\n]/.test(s[i] ?? '') && i < s.length)
            i++;
    };
    const string = () => {
        const start = i++;
        while (i < s.length) {
            const c = s[i++];
            if (c === '\\')
                i++;
            else if (c === '"') {
                const v = JSON.parse(s.slice(start, i));
                if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v))
                    throw new Error('Malformed Unicode');
                return v;
            }
        }
        throw new Error('Unterminated JSON string');
    };
    const value = () => {
        ws();
        const c = s[i];
        if (c === '"') {
            string();
            return;
        }
        if (c === '{') {
            i++;
            ws();
            const keys = new Set();
            if (s[i] === '}') {
                i++;
                return;
            }
            while (i < s.length) {
                ws();
                if (s[i] !== '"')
                    throw new Error('Invalid object');
                const k = string();
                if (keys.has(k))
                    throw new Error('Duplicate JSON key');
                keys.add(k);
                ws();
                if (s[i++] !== ':')
                    throw new Error('Invalid object');
                value();
                ws();
                if (s[i] === '}') {
                    i++;
                    return;
                }
                if (s[i++] !== ',')
                    throw new Error('Invalid object');
            }
        }
        else if (c === '[') {
            i++;
            ws();
            if (s[i] === ']') {
                i++;
                return;
            }
            while (i < s.length) {
                value();
                ws();
                if (s[i] === ']') {
                    i++;
                    return;
                }
                if (s[i++] !== ',')
                    throw new Error('Invalid array');
            }
        }
        else {
            const match = /^(?:null|true|false|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(s.slice(i));
            if (!match)
                throw new Error('Invalid JSON');
            i += match[0].length;
            return;
        }
        throw new Error('Invalid JSON');
    };
    value();
    ws();
    if (i !== s.length)
        throw new Error('Trailing JSON bytes');
    return JSON.parse(s);
}
// The supported local primitive is Linux directory-descriptor-relative I/O.
// Walking with O_NOFOLLOW pins each directory before resolving the next segment.
// Paths through /proc/self/fd refer to the open directory, even after a rename.
function directoryHandle(p) {
    if (process.platform !== 'linux')
        throw new Error('Verified directory-relative I/O is unavailable on this platform');
    let fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync('/', (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
    try {
        for (const segment of node_path__WEBPACK_IMPORTED_MODULE_1___default().resolve(p).split('/').filter(Boolean)) {
            const next = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(`/proc/self/fd/${fd}/${segment}`, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            fd = next;
        }
        return fd;
    }
    catch (error) {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        throw error;
    }
}
function anchored(p) {
    const fd = directoryHandle(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(p));
    return { fd, file: `/proc/self/fd/${fd}/${node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(p)}` };
}
function regular(fd) {
    const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1)
        throw new Error('Aliased or invalid managed file');
    return stat;
}
function syncDir(p) {
    const fd = directoryHandle(p);
    try {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}
function writeExclusive(p, data, reserved) {
    const parent = anchored(p);
    let fd;
    try {
        fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        reserved?.();
        regular(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (fd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
// Atomically publish metadata; keep a torn legacy marker under a distinct name.
function publishMarker(root, relative, data, staged) {
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, relative));
    const temporary = `/proc/self/fd/${parent.fd}/.marker-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`;
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        staged?.();
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            throw new Error('Publication marker already exists');
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function preserveMarker(root, relative) {
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, relative));
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            regular(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(parent.file, parent.file + '.damaged-' + (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)());
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function checked(root, relative, directory = false) {
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(relative))
        throw new Error('Unsafe managed path');
    let p = root;
    for (let i = 0; i < segments.length; i++) {
        p = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(p, segments[i]);
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(p);
        const dir = i < segments.length - 1 || directory;
        if (stat.isSymbolicLink() || (dir ? !stat.isDirectory() : (!stat.isFile() || stat.nlink !== 1)))
            throw new Error('Aliased or invalid managed path');
    }
    return p;
}
function readManaged(root, relative) {
    const p = checked(root, relative);
    const parent = anchored(p);
    let fd;
    try {
        fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        regular(fd);
        return node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd);
    }
    finally {
        if (fd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function replaceManaged(root, relative, data) {
    const target = checked(root, relative);
    const parent = anchored(target);
    const temporary = `/proc/self/fd/${parent.fd}/.publish-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`;
    let original;
    try {
        original = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        const expected = regular(original);
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data, 'utf8');
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
        if (!current.isFile() || current.nlink !== 1 || current.ino !== expected.ino || current.dev !== expected.dev)
            throw new Error('Publication target identity changed');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (original !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(original);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}


/***/ },

/***/ "./src/infrastructure/universe-storage.ts"
/*!************************************************!*\
  !*** ./src/infrastructure/universe-storage.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileUniverseStorage: () => (/* binding */ FileUniverseStorage)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _domain_universe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../domain/universe */ "./src/domain/universe.ts");
/* harmony import */ var _universe_ddl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./universe-ddl */ "./src/infrastructure/universe-ddl.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");









const requireValid = (condition, message = 'Universe integrity validation failed.') => {
    if (!condition)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('INTEGRITY_MISMATCH', message);
};
function transaction(db, fn) {
    db.exec('BEGIN IMMEDIATE');
    try {
        fn();
        db.exec('COMMIT');
    }
    catch (e) {
        if (db.isTransaction)
            db.exec('ROLLBACK');
        throw e;
    }
}
function configure(db) {
    db.exec('PRAGMA busy_timeout=0; PRAGMA foreign_keys=ON; PRAGMA journal_mode=DELETE; PRAGMA synchronous=EXTRA;');
    requireValid(db.prepare('PRAGMA journal_mode').get()?.journal_mode === 'delete' && db.prepare('PRAGMA synchronous').get()?.synchronous === 3 && db.prepare('PRAGMA foreign_keys').get()?.foreign_keys === 1, 'Required SQLite durability settings are unavailable.');
}
function supported(db) {
    if (db.prepare('PRAGMA user_version').get()?.user_version !== 1 || db.prepare('PRAGMA application_id').get()?.application_id !== 1465140300)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe database version is unsupported.');
    requireValid(db.prepare('PRAGMA quick_check').get()?.quick_check === 'ok', 'The universe database is corrupt.');
}
function connect(p, create = false) {
    if (!create) {
        // Read format/version from the fixed SQLite header before a writable
        // connection can recover a hot journal. A read-only SQL probe itself
        // cannot recover SQLite after a process dies mid-transaction.
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(p, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        const header = Buffer.alloc(100);
        try {
            requireValid(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(fd, header, 0, 100, 0) === 100 && header.subarray(0, 16).toString('ascii') === 'SQLite format 3\0', 'The SQLite header is invalid.');
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        if (header.readUInt32BE(60) !== 1 || header.readUInt32BE(68) !== 1465140300 || header[18] !== 1 || header[19] !== 1)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe database format is unsupported.');
        // SQLite owns only the derived rollback sidecar. Never follow a linked
        // journal or interpret a foreign WAL as this rollback-only format.
        for (const suffix of ['-journal', '-wal', '-shm']) {
            const sidecar = p + suffix;
            let stat;
            try {
                stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(sidecar);
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    continue;
                throw error;
            }
            requireValid(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1, 'The SQLite recovery sidecar is aliased.');
            requireValid(suffix === '-journal', 'Unsupported SQLite recovery sidecar.');
        }
    }
    const db = new node_sqlite__WEBPACK_IMPORTED_MODULE_3__.DatabaseSync(p);
    try {
        configure(db);
        if (!create)
            supported(db);
        return db;
    }
    catch (e) {
        db.close();
        throw e;
    }
}
function descriptor(root) {
    const d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(root, 'writingtool.json'));
    if (typeof d === 'object' && d !== null && 'schemaVersion' in d && d.schemaVersion !== 1)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe descriptor version is unsupported.');
    requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.closed)(d, ['schemaVersion', 'kind', 'id', 'rootId', 'creationOperationId']) && d.schemaVersion === 1 && d.kind === 'universe' && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(d.id) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(d.rootId) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(d.creationOperationId));
    return d;
}
function validateExpectedDescriptor(d, expected) {
    const identity = expected.identity;
    const matches = 'ownerId' in identity ? d.id === identity.ownerId && d.rootId === identity.rootId : d.creationOperationId === identity.creationOperationId;
    if (!matches)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('INTEGRITY_MISMATCH', 'Select the owning universe of the original pending operation.', 'unknown');
}
const saveDigest = (input) => (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)({ protocolVersion: 1, command: 'universe.profile.save', owner: { kind: 'universe', id: input.ownerId }, expectedUnitGeneration: input.expectedUnitGeneration, expectedRecordVersions: { [input.ownerId]: input.expectedRecordVersion }, submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
const createDigest = (input) => (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)({ protocolVersion: 1, command: 'universe.create', submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
function receipt(operationId, id, generation, version, revision) {
    return { protocolVersion: 1, operationId, owner: { kind: 'universe', id }, unitGeneration: generation, recordId: id, recordVersion: version, submittedEditorRevision: revision };
}
function storeReceipt(db, r, digest) {
    const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(r);
    db.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(r.operationId, digest, r.unitGeneration, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(bytes), bytes);
}
function validRecord(v) {
    return (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.closed)(v, ['id', 'rootId', 'recordType', 'relativePath', 'recordVersion', 'sha256']) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.id) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.rootId) && v.recordType === 'universe-profile' && v.relativePath === `profiles/${v.id}.json` && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(v.recordVersion) && typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256);
}
class FileUniverseStorage {
    fault;
    constructor(fault) {
        this.fault = fault;
    }
    physicalPath(basePath) {
        const root = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(basePath);
        requireValid(node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(root).isDirectory(), 'Select an existing directory.');
        return root;
    }
    create(basePath, input) {
        let data;
        try {
            data = (0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.profileData)(input.data);
        }
        catch (e) {
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('VALIDATION', String(e.message));
        }
        let root;
        try {
            root = this.physicalPath(basePath);
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(root).length)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('VALIDATION', 'Choose an empty folder. Existing content was preserved.');
        }
        catch (error) {
            if (error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure)
                throw error;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('IO_FAILURE', 'The folder could not be inspected before creation. No creation was started.', 'not-committed');
        }
        const id = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), rootId = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), version = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), digest = createDigest(input);
        const envelope = { schemaVersion: 1, recordType: 'universe-profile', id, owner: { kind: 'universe', id }, universeId: id, recordVersion: version, data };
        const d = { schemaVersion: 1, kind: 'universe', id, rootId, creationOperationId: input.operationId };
        let db, lease;
        let reserved = false;
        try {
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, '.writingtool-creation.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, operationId: input.operationId, ownerId: id, rootId, requestDigest: digest, profile: envelope }), () => {
                reserved = true;
            });
            this.fault?.('creation-reserved');
            for (const p of ['database', 'profiles', 'images', 'database/operations']) {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, p), { mode: 0o700 });
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, p)));
            }
            for (const p of ['database/catalog.sqlite', 'database/lease.sqlite'])
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, p), '');
            lease = connect(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database/lease.sqlite'), true);
            lease.exec(_universe_ddl__WEBPACK_IMPORTED_MODULE_7__.LEASE_DDL);
            lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(id, rootId);
            lease.exec('BEGIN EXCLUSIVE');
            db = connect(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database/catalog.sqlite'), true);
            db.exec(_universe_ddl__WEBPACK_IMPORTED_MODULE_7__.CATALOG_DDL);
            const session = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)();
            transaction(db, () => {
                db.prepare('INSERT INTO unit_meta VALUES(1,1,?,?,?,?,?,?,?)').run(id, rootId, '0', session, input.operationId, digest, 'preparing');
                db.prepare('INSERT INTO root_locations VALUES(?,?,?,?,?)').run(rootId, 'universe', id, root, (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)());
            });
            this.fault?.('creation-schema');
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)(envelope);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, `profiles/${id}.json`), bytes);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'writingtool.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)(d));
            this.fault?.('creation-files');
            const r = receipt(input.operationId, id, '1', version, input.submittedEditorRevision);
            transaction(db, () => {
                db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?)').run(id, rootId, 'universe-profile', `profiles/${id}.json`, version, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(bytes));
                db.prepare("UPDATE unit_meta SET generation='1',creationState='complete'").run();
                storeReceipt(db, r, digest);
            });
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database'));
            this.fault?.('creation-commit');
            const store = new FileUniverseStore(root, db, lease, d, session, this.fault);
            store.snapshot();
            return { store, receipt: r };
        }
        catch (e) {
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (!reserved)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('IO_FAILURE', 'The empty folder could not be reserved. No creation was started; your edits remain unsaved.', 'not-committed');
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure(e.code, e.message, 'unknown');
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'Creation could not finish. The selected folder and recovery evidence were preserved.', 'unknown');
        }
    }
    open(basePath, expected) {
        const root = this.physicalPath(basePath);
        let db, lease;
        try {
            const d = descriptor(root);
            if (expected)
                validateExpectedDescriptor(d, expected);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(root, 'images', true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(root, 'profiles', true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(root, 'database/operations', true);
            const leasePath = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(root, 'database/lease.sqlite');
            const catalogPath = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(root, 'database/catalog.sqlite');
            try {
                lease = connect(leasePath);
            }
            catch (e) {
                if (String(e).includes('locked') || String(e).includes('busy'))
                    throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
                throw e;
            }
            try {
                lease.exec('BEGIN EXCLUSIVE');
            }
            catch {
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
            }
            requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.closed)(lease.prepare('SELECT * FROM lease_identity').get(), ['singleton', 'schemaVersion', 'ownerId', 'rootId']) && lease.prepare('SELECT * FROM lease_identity').get()?.ownerId === d.id && lease.prepare('SELECT * FROM lease_identity').get()?.rootId === d.rootId && lease.prepare('SELECT * FROM lease_identity').get()?.schemaVersion === 1);
            db = connect(catalogPath);
            const store = new FileUniverseStore(root, db, lease, d, undefined, this.fault);
            if (expected)
                store.validateExpected(expected);
            store.checkBinding();
            store.recover();
            store.snapshot();
            store.rebind();
            store.mintSession();
            return store;
        }
        catch (e) {
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure)
                throw e;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'The folder is missing, invalid, inaccessible or requires recovery. Its bytes were preserved.', 'unknown');
        }
    }
}
class FileUniverseStore {
    location;
    db;
    lease;
    d;
    session;
    fault;
    failed = false;
    released = false;
    rootIdentity;
    identities;
    constructor(location, db, lease, d, session, fault) {
        this.location = location;
        this.db = db;
        this.lease = lease;
        this.d = d;
        this.session = session;
        this.fault = fault;
        this.rootIdentity = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(location);
        this.identities = ['database/catalog.sqlite', 'database/lease.sqlite'].map(relative => ({ relative, ...node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(location, relative)) }));
    }
    meta() {
        const m = this.db.prepare('SELECT * FROM unit_meta').get();
        requireValid(m && m.schemaVersion === 1 && m.ownerId === this.d.id && m.rootId === this.d.rootId && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isGeneration)(m.generation) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(m.sessionToken) && m.creationState === 'complete' && m.creationOperationId === this.d.creationOperationId, 'Creation is incomplete or identity is inconsistent.');
        return m;
    }
    record() {
        const rows = this.db.prepare('SELECT * FROM records').all();
        requireValid(rows.length === 1 && validRecord(rows[0]));
        return rows[0];
    }
    health() {
        const physical = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(this.location);
        requireValid(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(this.location) === this.location && physical.ino === this.rootIdentity.ino && physical.dev === this.rootIdentity.dev, 'Physical root changed.');
        for (const identity of this.identities) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, identity.relative));
            requireValid(current.ino === identity.ino && current.dev === identity.dev, 'Authority file identity changed.');
        }
        requireValid(this.lease.isTransaction, 'Writer ownership was lost.');
        const i = this.lease.prepare('SELECT * FROM lease_identity').get();
        requireValid(i?.ownerId === this.d.id && i?.rootId === this.d.rootId && i?.schemaVersion === 1);
        const d = descriptor(this.location);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(d) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(this.d), 'Root identity changed.');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, 'database/lease.sqlite');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, 'database/catalog.sqlite');
        if (this.session)
            requireValid(this.meta().sessionToken === this.session, 'Writer fencing token is stale.');
    }
    mintSession() {
        this.health();
        const token = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)();
        transaction(this.db, () => {
            this.db.prepare('UPDATE unit_meta SET sessionToken=? WHERE singleton=1').run(token);
        });
        this.session = token;
    }
    snapshot() {
        if (this.released)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'Reopen the relocated universe to reacquire its verified authority.', 'unknown');
        if (this.failed)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'Reopen this universe to reconcile the interrupted operation.', 'unknown');
        this.health();
        const m = this.meta(), r = this.record();
        requireValid(r.id === m.ownerId && r.rootId === m.rootId);
        const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, r.relativePath), p = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(bytes);
        requireValid((0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.validEnvelope)(p) && p.id === m.ownerId && p.recordVersion === r.recordVersion && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(bytes) === r.sha256, 'Profile bytes and catalog do not agree.');
        const creation = this.operation(m.creationOperationId);
        requireValid(creation && creation.requestDigest === m.creationDigest && creation.generation === '1', 'Creation decision is missing.');
        const operations = this.db.prepare('SELECT operationId FROM committed_operations').all().map(row => this.operation(String(row.operationId))).sort((a, b) => BigInt(a.generation) < BigInt(b.generation) ? -1 : 1);
        requireValid(operations.every((op, index) => op.generation === (BigInt(index) + 1n).toString()) && operations.at(-1)?.generation === m.generation, 'The catalog generation has no complete decision history.');
        const latest = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(operations.at(-1).receiptData));
        requireValid(latest.recordVersion === r.recordVersion, 'The current profile version has no matching receipt.');
        return { ownerId: m.ownerId, rootId: m.rootId, generation: m.generation, recordVersion: r.recordVersion, profile: p.data, location: this.location };
    }
    checkBinding() {
        const m = this.meta();
        const rows = this.db.prepare('SELECT * FROM root_locations').all();
        const row = rows[0];
        requireValid(rows.length === 1 && row.rootId === m.rootId && row.ownerKind === 'universe' && row.ownerId === m.ownerId && typeof row.basePath === 'string' && node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(row.basePath) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(row.bindingVersion));
        if (row.basePath === this.location)
            return;
        let original;
        try {
            original = node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(String(row.basePath));
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
        if (original && original !== this.location) {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(original);
            if (!stat.isDirectory())
                return; // A regular file cannot be the former owning folder.
            const entries = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(original);
            if (!entries.some(name => ['writingtool.json', '.writingtool-creation.json', 'database'].includes(name)))
                return;
            // Missing/corrupt discovery beside authority evidence is uncertain.
            const prior = descriptor(original);
            if (prior.id === this.d.id || prior.rootId === this.d.rootId)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('INTEGRITY_MISMATCH', 'The original universe folder still exists. This copy cannot become a second authority.');
        }
    }
    rebind() {
        this.checkBinding();
        const m = this.meta();
        const row = this.db.prepare('SELECT * FROM root_locations').get();
        if (row.basePath === this.location)
            return;
        transaction(this.db, () => {
            const result = this.db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=? AND bindingVersion=?').run(this.location, (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), m.rootId, String(row.bindingVersion));
            requireValid(result.changes === 1);
        });
    }
    operation(id) {
        const row = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(id);
        if (row) {
            requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(row.operationId) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isGeneration)(row.generation) && /^[a-f0-9]{64}$/.test(row.requestDigest));
            const r = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(row.receiptData));
            requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.validReceipt)(r) && r.operationId === id && r.owner.id === this.d.id && r.unitGeneration === row.generation && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(row.receiptData) === row.resultDigest);
        }
        return row;
    }
    prepareRelocatedReopen(basePath, expected) {
        if (this.released || basePath === this.location)
            return;
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(basePath);
        if (stat.ino !== this.rootIdentity.ino || stat.dev !== this.rootIdentity.dev)
            return;
        validateExpectedDescriptor(descriptor(basePath), expected);
        this.validateExpected(expected);
        for (const identity of this.identities) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(basePath, identity.relative));
            requireValid(current.ino === identity.ino && current.dev === identity.dev, 'Moved authority files changed identity.');
        }
        // SQLite canonicalizes its VFS name. Reopen the same verified moved
        // files instead of trying to write through obsolete connection names.
        this.db.close();
        if (this.lease.isTransaction)
            this.lease.exec('ROLLBACK');
        this.lease.close();
        this.released = true;
    }
    validateExpected(expected) {
        validateExpectedDescriptor(this.d, expected);
        const mutation = expected.mutation;
        const op = this.operation(mutation.input.operationId);
        const digest = mutation.command === 'universe.create' ? createDigest(mutation.input) : saveDigest(mutation.input);
        if (op && op.requestDigest !== digest)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('OPERATION_CONFLICT', 'The selected unit does not contain the original operation payload.', 'unknown');
    }
    reconcile(operationId, expected) {
        if (expected)
            this.validateExpected(expected);
        this.snapshot();
        const op = this.operation(operationId);
        return op ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(op.receiptData)) : undefined;
    }
    save(input) {
        const digest = saveDigest(input);
        this.snapshot();
        const prior = this.operation(input.operationId);
        if (prior) {
            if (prior.requestDigest !== digest)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('OPERATION_CONFLICT', 'This operation ID was already used for different content.');
            return (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(prior.receiptData));
        }
        let data;
        try {
            data = (0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.profileData)(input.data);
        }
        catch (e) {
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('VALIDATION', e.message);
        }
        const m = this.meta(), beforeRecord = this.record();
        if (input.ownerId !== m.ownerId || input.expectedUnitGeneration !== m.generation || input.expectedRecordVersion !== beforeRecord.recordVersion)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('GENERATION_CONFLICT', 'The saved universe changed. Reopen it before saving again.');
        const existingWork = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, 'database/operations', input.operationId);
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(existingWork)) {
            const priorJournal = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, `database/operations/${input.operationId}/journal.json`));
            this.validateJournal(priorJournal, input.operationId);
            const j = priorJournal;
            if (j.requestDigest !== digest)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('OPERATION_CONFLICT', 'The operation journal belongs to different content.');
            // A definitively aborted operation can retry its original immutable plan.
            // The new authority adopts only the operational fence; content IDs stay fixed.
            const aborted = `database/operations/${input.operationId}/aborted.json`;
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, aborted);
            requireValid(j.expectedGeneration === m.generation && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(j.beforeRecord) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(beforeRecord));
            // Do not rewrite journal bytes: the current fence is checked separately on retry.
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().unlinkSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, aborted));
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.syncDir)(existingWork);
            return this.publishRetry(j);
        }
        const before = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, beforeRecord.relativePath).toString('utf8');
        const envelope = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(before));
        const afterEnvelope = { ...envelope, data, recordVersion: (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)() };
        const after = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)(afterEnvelope);
        const target = (BigInt(m.generation) + 1n).toString(), r = receipt(input.operationId, m.ownerId, target, afterEnvelope.recordVersion, input.submittedEditorRevision);
        const afterRecord = { ...beforeRecord, recordVersion: afterEnvelope.recordVersion, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(after) };
        const journal = { schemaVersion: 1, scope: 'single-unit', command: 'universe.profile.save', ownerId: m.ownerId, rootId: m.rootId, operationId: input.operationId, request: input, requestDigest: digest, expectedGeneration: m.generation, targetGeneration: target, fencingToken: m.sessionToken, before, after, beforeHash: (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(before), afterHash: (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(after), beforeLength: Buffer.byteLength(before).toString(), afterLength: Buffer.byteLength(after).toString(), expectedRecordVersion: beforeRecord.recordVersion, beforeRecord, afterRecord, receipt: r };
        try {
            this.health();
            const work = node_path__WEBPACK_IMPORTED_MODULE_1___default().join((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, 'database/operations', true), input.operationId);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(work, { mode: 0o700 });
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(work));
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(work, 'journal.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)(journal));
            this.fault?.('journal');
            this.expect(journal);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.replaceManaged)(this.location, beforeRecord.relativePath, after);
            this.fault?.('file');
            transaction(this.db, () => {
                this.expect(journal);
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(afterRecord.recordVersion, afterRecord.sha256, m.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(target);
                storeReceipt(this.db, r, digest);
            });
            this.fault?.('commit');
            this.verifyJournalState(journal, true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishMarker)(this.location, `database/operations/${input.operationId}/finalized.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, operationId: input.operationId, requestDigest: digest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            this.snapshot();
            return r;
        }
        catch {
            this.failed = true;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'Save outcome requires reconciliation. Keep the submitted edits and reopen this universe.', 'unknown');
        }
    }
    publishRetry(j) {
        try {
            this.health();
            const expected = () => {
                this.health();
                requireValid(this.meta().generation === j.expectedGeneration && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(this.record()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(j.beforeRecord));
            };
            expected();
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.replaceManaged)(this.location, j.beforeRecord.relativePath, j.after);
            this.fault?.('file');
            transaction(this.db, () => {
                expected();
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(j.afterRecord.recordVersion, j.afterRecord.sha256, j.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(j.targetGeneration);
                storeReceipt(this.db, j.receipt, j.requestDigest);
            });
            this.fault?.('commit');
            this.verifyJournalState(j, true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishMarker)(this.location, `database/operations/${j.operationId}/finalized.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, operationId: j.operationId, requestDigest: j.requestDigest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            return j.receipt;
        }
        catch {
            this.failed = true;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'The retried save needs reconciliation.', 'unknown');
        }
    }
    expect(j) {
        this.health();
        const m = this.meta(), r = this.record();
        if (m.generation !== j.expectedGeneration || m.sessionToken !== j.fencingToken || r.recordVersion !== j.expectedRecordVersion || (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(r) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(j.beforeRecord))
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('GENERATION_CONFLICT', 'The publication expectations changed.');
    }
    verifyJournalState(j, committed) {
        const r = this.record();
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(r) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(committed ? j.afterRecord : j.beforeRecord) && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, r.relativePath)) === (committed ? j.afterHash : j.beforeHash));
    }
    recover() {
        try {
            this.health();
            const m = this.meta();
            for (const opId of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, 'database/operations', true)).sort()) {
                requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(opId), 'Unknown operation workspace.');
                const rel = `database/operations/${opId}`;
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.checked)(this.location, rel, true);
                const j = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, `${rel}/journal.json`));
                this.validateJournal(j, opId);
                const journal = j;
                const op = this.operation(opId);
                if (op)
                    requireValid(op.requestDigest === journal.requestDigest && op.receiptData === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(journal.receipt), 'Operation evidence conflicts.');
                const markerNames = ['finalized', 'aborted'];
                const validMarkers = new Set();
                for (const name of markerNames) {
                    const markerRel = `${rel}/${name}.json`;
                    if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, markerRel)))
                        continue;
                    let marker;
                    try {
                        marker = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, markerRel));
                    }
                    catch {
                        ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.preserveMarker)(this.location, markerRel);
                        continue;
                    }
                    if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.closed)(marker, ['schemaVersion', 'operationId', 'requestDigest'])) {
                        (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.preserveMarker)(this.location, markerRel);
                        continue;
                    }
                    requireValid(marker.schemaVersion === 1 && marker.operationId === opId && marker.requestDigest === journal.requestDigest, 'Conflicting publication marker.');
                    validMarkers.add(name);
                }
                requireValid(validMarkers.size < 2, 'Conflicting finalization decisions.');
                if (validMarkers.size) {
                    requireValid(validMarkers.has('finalized') ? !!op && BigInt(m.generation) >= BigInt(journal.targetGeneration) : !op && BigInt(m.generation) >= BigInt(journal.expectedGeneration));
                    continue;
                }
                // A later verified catalog/profile history proves this old operation
                // already passed its publication gate. Repair metadata, never replay bytes.
                if (BigInt(m.generation) > BigInt(op ? journal.targetGeneration : journal.expectedGeneration)) {
                    const wasFailed = this.failed;
                    this.failed = false;
                    try {
                        this.snapshot();
                    }
                    finally {
                        this.failed = wasFailed;
                    }
                    ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishMarker)(this.location, `${rel}/${op ? 'finalized' : 'aborted'}.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }));
                    continue;
                }
                const committed = !!op;
                requireValid(m.generation === (committed ? journal.targetGeneration : journal.expectedGeneration), 'Unexplained publication generation.');
                const liveHash = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.readManaged)(this.location, journal.beforeRecord.relativePath));
                requireValid(liveHash === journal.beforeHash || liveHash === journal.afterHash, 'Unexpected profile bytes were preserved.');
                requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(this.record()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(committed ? journal.afterRecord : journal.beforeRecord));
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.replaceManaged)(this.location, journal.beforeRecord.relativePath, committed ? journal.after : journal.before);
                this.fault?.(committed ? 'redo' : 'undo');
                this.verifyJournalState(journal, committed);
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.publishMarker)(this.location, `${rel}/${committed ? 'finalized' : 'aborted'}.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.jsonBytes)({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }), () => this.fault?.('marker-staged'));
            }
            this.failed = false;
        }
        catch (e) {
            this.failed = true;
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure(e.code, e.message, 'unknown');
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_5__.UniverseFailure('RECOVERY_REQUIRED', 'Publication evidence is incomplete or corrupt. The folder was preserved.', 'unknown');
        }
    }
    validateJournal(value, opId) {
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.closed)(value, ['schemaVersion', 'scope', 'command', 'ownerId', 'rootId', 'operationId', 'request', 'requestDigest', 'expectedGeneration', 'targetGeneration', 'fencingToken', 'before', 'after', 'beforeHash', 'afterHash', 'beforeLength', 'afterLength', 'expectedRecordVersion', 'beforeRecord', 'afterRecord', 'receipt']));
        const j = value;
        requireValid(j.schemaVersion === 1 && j.scope === 'single-unit' && j.command === 'universe.profile.save');
        requireValid(j.ownerId === this.d.id && j.rootId === this.d.rootId && j.operationId === opId && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isUuid)(j.fencingToken));
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isGeneration)(j.expectedGeneration) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.isGeneration)(j.targetGeneration));
        requireValid(BigInt(j.targetGeneration) === BigInt(j.expectedGeneration) + 1n);
        requireValid(typeof j.before === 'string' && typeof j.after === 'string');
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.validUniverseRequest)({ protocolVersion: 1, requestId: opId, command: j.command, input: j.request }));
        requireValid(j.request.operationId === opId && j.request.ownerId === j.ownerId);
        requireValid(j.request.expectedUnitGeneration === j.expectedGeneration && j.request.expectedRecordVersion === j.expectedRecordVersion);
        requireValid(saveDigest(j.request) === j.requestDigest);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(j.before) === j.beforeHash && (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.hash)(j.after) === j.afterHash);
        requireValid(Buffer.byteLength(j.before).toString() === j.beforeLength && Buffer.byteLength(j.after).toString() === j.afterLength);
        requireValid(validRecord(j.beforeRecord) && validRecord(j.afterRecord));
        const before = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(j.before)), after = (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.decode)(Buffer.from(j.after));
        requireValid((0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.validEnvelope)(before) && (0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.validEnvelope)(after));
        const beforeEnvelope = before, afterEnvelope = after;
        requireValid(beforeEnvelope.id === j.ownerId && afterEnvelope.id === j.ownerId);
        requireValid(beforeEnvelope.recordVersion === j.expectedRecordVersion && j.beforeRecord.recordVersion === beforeEnvelope.recordVersion);
        requireValid(j.afterRecord.recordVersion === afterEnvelope.recordVersion);
        requireValid(j.beforeRecord.sha256 === j.beforeHash && j.afterRecord.sha256 === j.afterHash);
        requireValid(j.beforeRecord.id === j.ownerId && j.afterRecord.id === j.ownerId);
        requireValid(j.beforeRecord.rootId === j.rootId && j.afterRecord.rootId === j.rootId);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(afterEnvelope.data) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)((0,_domain_universe__WEBPACK_IMPORTED_MODULE_6__.profileData)(j.request.data)));
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_4__.validReceipt)(j.receipt));
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(j.receipt) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_8__.canonical)(receipt(opId, j.ownerId, j.targetGeneration, afterEnvelope.recordVersion, j.request.submittedEditorRevision)));
    }
    close() {
        if (this.released)
            return;
        if (this.failed)
            this.recover();
        this.snapshot();
        this.db.close();
        if (this.lease.isTransaction)
            this.lease.exec('ROLLBACK');
        this.lease.close();
    }
}


/***/ },

/***/ "node:crypto"
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
(module) {

module.exports = require("node:crypto");

/***/ },

/***/ "node:fs"
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
(module) {

module.exports = require("node:fs");

/***/ },

/***/ "node:path"
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
(module) {

module.exports = require("node:path");

/***/ },

/***/ "node:sqlite"
/*!******************************!*\
  !*** external "node:sqlite" ***!
  \******************************/
(module) {

module.exports = require("node:sqlite");

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
/*!*************************************!*\
  !*** ./src/desktop/utility-host.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _infrastructure_universe_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../infrastructure/universe-storage */ "./src/infrastructure/universe-storage.ts");
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _application_readiness__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../application/readiness */ "./src/application/readiness.ts");
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");





const universes = new _application_universe__WEBPACK_IMPORTED_MODULE_0__.UniverseApplication(new _infrastructure_universe_storage__WEBPACK_IMPORTED_MODULE_1__.FileUniverseStorage());
const port = process.parentPort;
if (!port)
    throw new Error('Application host requires a parent port');
const fault = process.argv.find(arg => arg.startsWith('--diagnostic-fault='))?.split('=')[1];
if (fault === 'exit')
    process.exit(1);
port.on('message', ({ data }) => {
    if ((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_2__.validUniverseRequest)(data, true)) {
        const base = { protocolVersion: 1, requestId: data.requestId, command: data.command };
        let result;
        try {
            switch (data.command) {
                case 'universe.create':
                    result = { ...base, status: 'ok', ...universes.create(data.basePath, data.input) };
                    break;
                case 'universe.open': {
                    const snapshot = universes.open(data.basePath, data.reconcileExpected);
                    const receipt = data.reconcileOperationId ? universes.reconcile(data.reconcileOperationId, data.reconcileExpected) : undefined;
                    result = { ...base, status: 'ok', snapshot, ...(receipt ? { receipt } : {}), ...(data.reconcileOperationId ? { reconciliation: { operationId: data.reconcileOperationId, outcome: receipt ? 'committed' : 'not-committed' } } : {}) };
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
            const failure = error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure ? error : new _application_universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('IO_FAILURE', 'The universe operation failed. Existing content was preserved.', data.command === 'universe.create' || data.command === 'universe.profile.save' ? 'unknown' : 'not-committed');
            result = { ...base, status: 'error', code: failure.code, message: failure.message, outcome: failure.outcome, retry: failure.outcome === 'unknown' ? 'after-recovery' : 'new-request' };
        }
        port.postMessage(result);
        return;
    }
    if (!(0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_4__.validRequest)(data))
        return;
    if (fault === 'timeout')
        return;
    if (fault === 'invalid') {
        port.postMessage({ ...(0,_application_readiness__WEBPACK_IMPORTED_MODULE_3__.readiness)(data), extra: true });
        return;
    }
    port.postMessage((0,_application_readiness__WEBPACK_IMPORTED_MODULE_3__.readiness)(data));
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=utility-host.cjs.map