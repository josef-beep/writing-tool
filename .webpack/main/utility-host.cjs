/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/application/contracts/project.ts"
/*!**********************************************!*\
  !*** ./src/application/contracts/project.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROJECT_CHANNEL: () => (/* binding */ PROJECT_CHANNEL),
/* harmony export */   projectCommands: () => (/* binding */ projectCommands),
/* harmony export */   validProjectIdentity: () => (/* binding */ validProjectIdentity),
/* harmony export */   validProjectReceipt: () => (/* binding */ validProjectReceipt),
/* harmony export */   validProjectRequest: () => (/* binding */ validProjectRequest),
/* harmony export */   validProjectResult: () => (/* binding */ validProjectResult)
/* harmony export */ });
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe */ "./src/application/contracts/universe.ts");

const PROJECT_CHANNEL = 'writingtool:project:v1';
const projectCommands = ['project.create', 'project.open', 'project.current', 'project.close'];
function validProjectRequest(v, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.requestId) || !projectCommands.includes(x.command))
        return false;
    const selecting = x.command === 'project.create' || x.command === 'project.open';
    const extras = internal && selecting ? ['basePath', ...(Object.hasOwn(x, 'universePath') ? ['universePath'] : []), ...(Object.hasOwn(x, 'expectedCreationOperationId') ? ['expectedCreationOperationId'] : [])] : [];
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'requestId', 'command', ...(x.command === 'project.create' ? ['input'] : []), ...extras]) && (!extras.length || (typeof x.basePath === 'string' && (!Object.hasOwn(x, 'universePath') || typeof x.universePath === 'string') && (!Object.hasOwn(x, 'expectedCreationOperationId') || (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.expectedCreationOperationId)))) && (x.command !== 'project.create' || ((0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(x.input, ['operationId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.input.operationId)));
}
function validProjectIdentity(v) {
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['ownerId', 'rootId', 'universeId', 'generation', 'recordVersion', 'location', 'universeLocation', 'creationOperationId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.ownerId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.rootId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.universeId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isGeneration)(v.generation) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && typeof v.location === 'string' && typeof v.universeLocation === 'string' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.creationOperationId);
}
function validProjectReceipt(v) {
    return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['protocolVersion', 'operationId', 'owner', 'unitGeneration', 'recordId', 'recordVersion']) && v.protocolVersion === 1 && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.operationId) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) && v.owner.kind === 'project' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) && v.recordId === v.owner.id && v.unitGeneration === '1' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion);
}
function validProjectResult(v, request, internal = false) {
    if (typeof v !== 'object' || v === null)
        return false;
    const x = v, base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.protocolVersion !== 1 || x.requestId !== request.requestId || x.command !== request.command)
        return false;
    if (x.status === 'locate')
        return internal && request.command === 'project.open' && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'universeId']) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.isUuid)(x.universeId);
    if (x.status === 'canceled')
        return ['project.create', 'project.open'].includes(request.command) && (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, base);
    if (x.status === 'error')
        return (0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry']) && _universe__WEBPACK_IMPORTED_MODULE_0__.universeErrorCodes.includes(x.code) && typeof x.message === 'string' && !!x.message && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry));
    if (x.status !== 'ok' || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...base, 'snapshot', ...(Object.hasOwn(x, 'receipt') ? ['receipt'] : [])]))
        return false;
    if (x.snapshot === null)
        return ['project.current', 'project.close'].includes(request.command) && !Object.hasOwn(x, 'receipt');
    if (request.command === 'project.close' || typeof x.snapshot !== 'object' || x.snapshot === null)
        return false;
    const { universe, ...identity } = x.snapshot;
    if (!validProjectIdentity(identity) || !(0,_universe__WEBPACK_IMPORTED_MODULE_0__.validSnapshot)(universe) || universe.ownerId !== identity.universeId || universe.location !== identity.universeLocation)
        return false;
    return Object.hasOwn(x, 'receipt') ? request.command === 'project.create' && validProjectReceipt(x.receipt) && x.receipt.owner.id === identity.ownerId && x.receipt.recordVersion === identity.recordVersion && (!request.input || x.receipt.operationId === request.input.operationId) : request.command !== 'project.create';
}


/***/ },

/***/ "./src/application/contracts/protection.ts"
/*!*************************************************!*\
  !*** ./src/application/contracts/protection.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CATALOG_NOTICE: () => (/* binding */ CATALOG_NOTICE),
/* harmony export */   PROTECTION_CHANNEL: () => (/* binding */ PROTECTION_CHANNEL),
/* harmony export */   digest: () => (/* binding */ digest),
/* harmony export */   protectionHasDurableEffects: () => (/* binding */ protectionHasDurableEffects),
/* harmony export */   protectionOperationId: () => (/* binding */ protectionOperationId),
/* harmony export */   validArchiveRecord: () => (/* binding */ validArchiveRecord),
/* harmony export */   validCapturedUnit: () => (/* binding */ validCapturedUnit),
/* harmony export */   validObjectRef: () => (/* binding */ validObjectRef),
/* harmony export */   validProposal: () => (/* binding */ validProposal),
/* harmony export */   validProtectionRequest: () => (/* binding */ validProtectionRequest),
/* harmony export */   validProtectionResult: () => (/* binding */ validProtectionResult),
/* harmony export */   validProtectionValue: () => (/* binding */ validProtectionValue),
/* harmony export */   validRecoveryView: () => (/* binding */ validRecoveryView),
/* harmony export */   validResolution: () => (/* binding */ validResolution),
/* harmony export */   validRevisionManifest: () => (/* binding */ validRevisionManifest)
/* harmony export */ });
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./workspace */ "./src/application/contracts/workspace.ts");




const PROTECTION_CHANNEL = 'writingtool:protection:v1';
const CATALOG_NOTICE = 'Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.';
/** Reconciliation retains the operation being reconciled, even if its transport attempt fails. */
function protectionOperationId(request) { return request.command === 'protection.reconcile' ? request.operationId : request.requestId; }
/** Read failures and cancellation signals do not create a new uncertain mutation. */
function protectionHasDurableEffects(request) { return !['protection.history', 'protection.inspect', 'protection.pending', 'protection.recents', 'protection.open', 'protection.cancel'].includes(request.command); }
function validProtectionRequest(v, internal = false) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.requestId))
        return false;
    let keys = [];
    switch (x.command) {
        case 'protection.archives':
            keys = ['owner'];
            break;
        case 'protection.archive-locate':
            keys = ['owner', 'id'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id))
                return false;
            break;
        case 'protection.recents':
        case 'protection.pending':
            keys = [];
            break;
        case 'protection.recent':
            keys = ['id', 'action'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id) || !['open', 'locate', 'remove'].includes(String(x.action)))
                return false;
            break;
        case 'protection.history':
            keys = ['owner'];
            break;
        case 'protection.capture':
            keys = ['owner', 'reason'];
            break;
        case 'protection.inspect':
            keys = ['owner', 'revisionId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.revisionId))
                return false;
            break;
        case 'protection.backup':
            keys = ['owner', 'reason', 'chooseLocation', 'closing'];
            if (typeof x.chooseLocation !== 'boolean' || typeof x.closing !== 'boolean')
                return false;
            break;
        case 'protection.delete':
            keys = ['owner', 'kind', 'id'];
            if (!['revision', 'archive'].includes(String(x.kind)) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.id))
                return false;
            break;
        case 'protection.recover':
            keys = ['owner', 'revisionId', 'scope'];
            if (x.owner !== null && !(0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(x.owner) || x.revisionId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.revisionId) || x.scope !== null && (!Array.isArray(x.scope) || !x.scope.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)))
                return false;
            break;
        case 'protection.reference':
            keys = ['proposalId', 'sourceId', 'targetId', 'action', 'replacementId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.sourceId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.targetId) || !['restore', 'replacement', 'remove'].includes(String(x.action)) || x.replacementId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.replacementId))
                return false;
            break;
        case 'protection.resume':
        case 'protection.apply':
        case 'protection.cancel-recovery':
            keys = ['proposalId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId))
                return false;
            break;
        case 'protection.resolve':
            keys = ['proposalId', 'resolution'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.proposalId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.resolution, ['recordId', 'liveFingerprint', 'recoveredFingerprint', 'choice', 'record', 'manuscript']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.resolution.recordId) || !validResolution(x.resolution))
                return false;
            break;
        case 'protection.export':
            keys = ['owner', 'format', 'storyId', 'chapterIds'];
            if (!['md', 'txt', 'docx', 'pdf', 'sqlite'].includes(String(x.format)) || x.storyId !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.storyId) || x.chapterIds !== null && (!Array.isArray(x.chapterIds) || !x.chapterIds.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)))
                return false;
            break;
        case 'protection.reconcile':
            keys = ['operationId', ...(Object.hasOwn(x, 'chooseLocation') ? ['chooseLocation'] : [])];
            if (Object.hasOwn(x, 'chooseLocation') && typeof x.chooseLocation !== 'boolean' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'protection.cancel':
            keys = ['operationId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'protection.open':
            keys = ['outputId', 'folder'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.outputId) || typeof x.folder !== 'boolean')
                return false;
            break;
        default: return false;
    }
    if (keys.includes('owner') && x.command !== 'protection.recover' && !(0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(x.owner))
        return false;
    if (keys.includes('reason') && !['Manual', 'Automatic', 'Close', 'Replaced', 'Recovered'].includes(String(x.reason)))
        return false;
    if (internal) {
        if (Object.hasOwn(x, 'nativeActivationLocations')) {
            if (x.command !== 'protection.reconcile' || !Array.isArray(x.nativeActivationLocations) || x.nativeActivationLocations.length > 2 || !x.nativeActivationLocations.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(p, ['owner', 'rootId', 'location', ...(Object.hasOwn(p, 'destination') ? ['destination'] : [])]) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(p.rootId) && nativePath(p.location) && (!Object.hasOwn(p, 'destination') || nativePath(p.destination))))
                return false;
            keys.push('nativeActivationLocations');
        }
        if (Object.hasOwn(x, 'nativePrepareOnly')) {
            if (x.nativePrepareOnly !== true)
                return false;
            keys.push('nativePrepareOnly');
        }
        if (Object.hasOwn(x, 'nativeDestination') && (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.nativeDestination, ['path', 'expectedHash']) || !nativePath(x.nativeDestination.path) || x.nativeDestination.expectedHash !== null && !digest(x.nativeDestination.expectedHash)))
            return false;
        if (Object.hasOwn(x, 'nativeBackupFolder') && !nativePath(x.nativeBackupFolder))
            return false;
        if (Object.hasOwn(x, 'nativeArchive') && !nativePath(x.nativeArchive) || Object.hasOwn(x, 'nativeRuntime') && !nativePath(x.nativeRuntime))
            return false;
        if (Object.hasOwn(x, 'nativeActivation') && (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.nativeActivation, ['project', 'universe']) || x.nativeActivation.project !== null && !nativePath(x.nativeActivation.project) || !nativePath(x.nativeActivation.universe)))
            return false;
        keys.push(...['nativeDestination', 'nativeArchive', 'nativeActivation', 'nativeRuntime', 'nativeBackupFolder'].filter(k => Object.hasOwn(x, k)));
    }
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, ['protocolVersion', 'requestId', 'command', ...keys]);
}
function validProtectionResult(v, r) { if (typeof v !== 'object' || !v)
    return false; const x = v, base = ['protocolVersion', 'requestId', 'command', 'status']; return x.protocolVersion === 1 && x.requestId === r.requestId && x.command === r.command && (x.status === 'ok' ? (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, 'value']) && validProtectionValue(x.value) && (!x.value.reconciliation || r.command === 'protection.reconcile' && x.value.reconciliation.operationId === r.operationId) : x.status === 'canceled' ? (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, base) : x.status === 'error' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, 'message', 'outcome', 'operationId']) && typeof x.message === 'string' && ['not-committed', 'unknown'].includes(String(x.outcome)) && (x.outcome === 'unknown' ? x.operationId === protectionOperationId(r) : x.operationId === null)); }
const digest = (v) => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const nativePath = (v) => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v) && !!v && !v.includes('\0') && (/^(?:\/|[A-Za-z]:[\\/])/.test(v));
const uuidList = (v) => Array.isArray(v) && v.every(_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid) && new Set(v).size === v.length;
const validObjectRef = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['sha256', 'byteLength']) && digest(v.sha256) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.byteLength);
const validCapturedUnit = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['snapshot', 'files']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v.snapshot, ['owner', 'rootId', 'universeId', 'generation', 'assets', 'counters', 'recordIds']) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)(Object.fromEntries([...Object.entries(v.snapshot).filter(([k]) => k !== 'recordIds'), ['records', []], ['manuscripts', {}]])) && uuidList(v.snapshot.recordIds) && Array.isArray(v.files) && v.files.every(f => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(f, ['relativePath', 'object']) && safePath(f.relativePath) && validObjectRef(f.object)) && new Set(v.files.map(f => f.relativePath.toLowerCase())).size === v.files.length;
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const safePath = (v) => typeof v === 'string' && !!v && !v.startsWith('/') && !v.split('/').some(p => !p || p === '.' || p === '..' || /[\\\0:\x00-\x1f]/.test(p) || /[. ]$/.test(p));
function validRevisionManifest(v) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'kind', 'id', 'owner', 'reason', 'capturedAt', 'completedAt', 'localCaptureStart', 'offsetMinutes', 'timeZone', 'displayName', 'universeDisplayName', 'units', 'retainedRevisionIds']) || !Array.isArray(v.units))
    return false; const units = v.units; return v.schemaVersion === 1 && v.kind === 'complete-revision' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && ['Manual', 'Automatic', 'Close', 'Replaced', 'Recovered'].includes(String(v.reason)) && typeof v.capturedAt === 'string' && Number.isFinite(Date.parse(v.capturedAt)) && typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.localCaptureStart) && typeof v.offsetMinutes === 'string' && /^-?(0|[1-9][0-9]*)$/.test(v.offsetMinutes) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.timeZone) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.displayName) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.universeDisplayName) && units.every(validCapturedUnit) && units.length === (v.owner.kind === 'project' ? 2 : 1) && units.some(u => u.snapshot.owner.kind === v.owner.kind && u.snapshot.owner.id === v.owner.id) && new Set(units.map(u => u.snapshot.owner.kind + u.snapshot.owner.id)).size === units.length && uuidList(v.retainedRevisionIds) && (v.owner.kind === 'universe' || units.some(u => u.snapshot.owner.kind === 'universe' && u.snapshot.owner.id === units.find(p => p.snapshot.owner.kind === 'project')?.snapshot.universeId)); }
function validResolution(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['recordId', 'liveFingerprint', 'recoveredFingerprint', 'choice', 'record', 'manuscript']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.recordId) && (v.liveFingerprint === null || digest(v.liveFingerprint)) && digest(v.recoveredFingerprint) && ['keep-live', 'use-recovered', 'combined'].includes(String(v.choice)) && (v.choice === 'combined' ? (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(v.record) && v.record.id === v.recordId && (v.record.recordType === 'chapter' ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.manuscript) : v.manuscript === null) : v.record === null && v.manuscript === null); }
function validProposal(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'revisionId', 'owner', 'status', 'scope', 'expected', 'choices', 'operationId', 'replacedRevisionId']) && v.schemaVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.revisionId) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && ['review', 'canceled', 'applied', 'backup-required'].includes(String(v.status)) && (v.scope === null || uuidList(v.scope)) && Array.isArray(v.expected) && v.expected.length <= 2 && v.expected.every(e => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(e, ['owner', 'generation']) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(e.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.generation)) && Array.isArray(v.choices) && v.choices.every(validResolution) && new Set(v.choices.map(c => c.recordId)).size === v.choices.length && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) && (v.replacedRevisionId === null || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.replacedRevisionId)); }
function validRecoveryView(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['proposal', 'conflicts', 'issues', 'missing']) && validProposal(v.proposal) && Array.isArray(v.conflicts) && v.conflicts.every(c => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['id', 'live', 'recovered', 'liveText', 'recoveredText', 'resolved', 'liveFingerprint', 'recoveredFingerprint']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.id) && (c.live === null || (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(c.live) && c.live.id === c.id) && (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.validateWorkspaceRecord)(c.recovered) && c.recovered.id === c.id && (c.liveText === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.liveText)) && (c.recoveredText === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.recoveredText)) && typeof c.resolved === 'boolean' && (c.liveFingerprint === null || digest(c.liveFingerprint)) && digest(c.recoveredFingerprint)) && Array.isArray(v.issues) && v.issues.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText) && Array.isArray(v.missing) && v.missing.every(m => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(m, ['sourceId', 'targetId', 'label', 'canRemove']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(m.sourceId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(m.targetId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(m.label) && typeof m.canRemove === 'boolean'); }
function validProtectionValue(v) { if (typeof v !== 'object' || !v || Array.isArray(v))
    return false; const x = v, keys = ['reconciliation', 'warnings', 'assets', 'archives', 'recents', 'pending', 'proposals', 'history', 'manifest', 'units', 'recovery', 'output', 'deleted', 'activated']; if (Object.keys(x).some(k => !keys.includes(k)))
    return false; return (!Object.hasOwn(x, 'reconciliation') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.reconciliation, ['operationId', 'outcome']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.reconciliation.operationId) && x.reconciliation.outcome === 'not-committed') && (!Object.hasOwn(x, 'warnings') || Array.isArray(x.warnings) && x.warnings.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)) && (!Object.hasOwn(x, 'assets') || Array.isArray(x.assets) && x.assets.every(_workspace__WEBPACK_IMPORTED_MODULE_3__.validAssetData)) && (!Object.hasOwn(x, 'archives') || Array.isArray(x.archives) && x.archives.every(validArchiveRecord)) && (!Object.hasOwn(x, 'pending') || uuidList(x.pending)) && (!Object.hasOwn(x, 'proposals') || uuidList(x.proposals)) && (!Object.hasOwn(x, 'recents') || Array.isArray(x.recents) && x.recents.every(r => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(r, ['id', 'owner', 'name', 'available']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(r.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(r.name) && typeof r.available === 'boolean')) && (!Object.hasOwn(x, 'history') || Array.isArray(x.history) && x.history.every(validRevisionManifest)) && (!Object.hasOwn(x, 'manifest') || validRevisionManifest(x.manifest)) && (!Object.hasOwn(x, 'units') || Array.isArray(x.units) && x.units.every(_workspace__WEBPACK_IMPORTED_MODULE_3__.validWorkspaceUnit)) && (!Object.hasOwn(x, 'recovery') || validRecoveryView(x.recovery)) && (!Object.hasOwn(x, 'output') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.output, ['id', 'path', 'notice']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.output.id) && nativePath(x.output.path) && (x.output.notice === null || x.output.notice === CATALOG_NOTICE)) && (!Object.hasOwn(x, 'deleted') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.deleted)) && (!Object.hasOwn(x, 'activated') || (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.activated, ['project', 'universe']) && (x.activated.project === null || nativePath(x.activated.project)) && nativePath(x.activated.universe)); }
function validArchiveRecord(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'owner', 'sha256', 'capturedAt', 'completedAt', 'locations', 'evidence', 'revisionIds', 'state']) && v.schemaVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && (0,_workspace__WEBPACK_IMPORTED_MODULE_3__.validOwner)(v.owner) && digest(v.sha256) && typeof v.capturedAt === 'string' && Number.isFinite(Date.parse(v.capturedAt)) && typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt)) && Array.isArray(v.locations) && v.locations.every(nativePath) && Array.isArray(v.evidence) && v.evidence.every(e => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(e, ['path', 'device', 'inode']) && nativePath(e.path) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.device) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(e.inode)) && uuidList(v.revisionIds) && ['valid', 'uncertain'].includes(String(v.state)); }


/***/ },

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

/***/ "./src/application/contracts/workspace.ts"
/*!************************************************!*\
  !*** ./src/application/contracts/workspace.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SETTINGS_ID: () => (/* binding */ SETTINGS_ID),
/* harmony export */   WORKSPACE_CHANNEL: () => (/* binding */ WORKSPACE_CHANNEL),
/* harmony export */   validAppSettings: () => (/* binding */ validAppSettings),
/* harmony export */   validAssetData: () => (/* binding */ validAssetData),
/* harmony export */   validManagedImage: () => (/* binding */ validManagedImage),
/* harmony export */   validOwner: () => (/* binding */ validOwner),
/* harmony export */   validWorkspaceMutation: () => (/* binding */ validWorkspaceMutation),
/* harmony export */   validWorkspaceReceipt: () => (/* binding */ validWorkspaceReceipt),
/* harmony export */   validWorkspaceRequest: () => (/* binding */ validWorkspaceRequest),
/* harmony export */   validWorkspaceResult: () => (/* binding */ validWorkspaceResult),
/* harmony export */   validWorkspaceUnit: () => (/* binding */ validWorkspaceUnit)
/* harmony export */ });
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../domain/workspace */ "./src/domain/workspace.ts");




const WORKSPACE_CHANNEL = 'writingtool:workspace:v1';
const validOwner = (v) => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['kind', 'id']) && ['project', 'universe'].includes(String(v.kind)) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id);
function validWorkspaceMutation(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['operationId', 'submittedEditorRevision', 'units']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.submittedEditorRevision) || !Array.isArray(v.units) || v.units.length < 1 || v.units.length > 2)
        return false;
    const owners = new Set();
    return v.units.every(u => {
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(u, ['owner', 'expectedUnitGeneration', 'changes']) || !validOwner(u.owner) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(u.expectedUnitGeneration) || !Array.isArray(u.changes) || owners.has(u.owner.kind + u.owner.id))
            return false;
        owners.add(u.owner.kind + u.owner.id);
        const ids = new Set();
        return u.changes.every(c => {
            if (typeof c !== 'object' || !c)
                return false;
            if (c.action === 'delete') {
                if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['action', 'id', 'expectedRecordVersion']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.id) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.expectedRecordVersion) || ids.has(c.id))
                    return false;
                ids.add(c.id);
                return true;
            }
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c, ['action', 'record', 'expectedRecordVersion', 'manuscript']) || c.action !== 'put' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(c.record, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) || c.record.schemaVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.id) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.recordVersion) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.record.universeId) || !validOwner(c.record.owner) || !Object.hasOwn(_domain_workspace__WEBPACK_IMPORTED_MODULE_3__.recordCategory, String(c.record.recordType)) || (c.expectedRecordVersion !== null && !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(c.expectedRecordVersion)) || (c.manuscript !== null && !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(c.manuscript)) || ids.has(c.record.id))
                return false;
            ids.add(c.record.id);
            return true;
        });
    });
}
function validWorkspaceRequest(v, internal = false) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v;
    if (x.protocolVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.requestId))
        return false;
    const base = ['protocolVersion', 'requestId', 'command'];
    let keys;
    switch (x.command) {
        case 'workspace.query':
        case 'settings.get':
        case 'settings.export':
            keys = [];
            break;
        case 'workspace.mutate':
            keys = ['input'];
            if (!validWorkspaceMutation(x.input))
                return false;
            break;
        case 'workspace.reconcile':
            keys = ['operationId'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId))
                return false;
            break;
        case 'workspace.asset.import':
            keys = ['owner', 'operationId', 'expectedUnitGeneration'];
            if (!validOwner(x.owner) || x.owner.kind !== 'universe' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.operationId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(x.expectedUnitGeneration))
                return false;
            if (internal && Object.hasOwn(x, 'nativeAsset')) {
                if (!validAssetData(x.nativeAsset))
                    return false;
                keys.push('nativeAsset');
            }
            break;
        case 'workspace.asset.read':
            keys = ['owner', 'assetId'];
            if (!validOwner(x.owner) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.assetId))
                return false;
            break;
        case 'settings.save':
            keys = ['expectedRecordVersion', 'values'];
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(x.expectedRecordVersion) || !validAppSettings(x.values))
                return false;
            break;
        case 'settings.import':
            keys = internal && Object.hasOwn(x, 'nativeSettings') ? ['nativeSettings'] : [];
            break;
        case 'settings.select-backup':
            keys = internal && Object.hasOwn(x, 'nativeDestination') ? ['nativeDestination'] : [];
            if (keys.length && (!(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.nativeDestination) || !x.nativeDestination || x.nativeDestination.includes('\0')))
                return false;
            break;
        default: return false;
    }
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x, [...base, ...keys]);
}
function validWorkspaceReceipt(v) {
    return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['protocolVersion', 'operationId', 'submittedEditorRevision', 'units']) && v.protocolVersion === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.operationId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.submittedEditorRevision) && Array.isArray(v.units) && v.units.length > 0 && v.units.every(u => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(u, ['owner', 'unitGeneration', 'records']) && validOwner(u.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(u.unitGeneration) && Array.isArray(u.records) && u.records.every(r => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(r, ['id', 'recordVersion', 'deleted']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(r.recordVersion) && typeof r.deleted === 'boolean'));
}
const SETTINGS_ID = 'b5a83e04-1e76-4c44-a17d-9ebd3ae09b2f';
function validAppSettings(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['schemaVersion', 'id', 'recordVersion', 'autosaveMinutes', 'revisionMinutes', 'backupMinutes', 'retentionDays', 'backupDestination', 'theme', 'fontFamily', 'fontSize', 'panels']) || v.schemaVersion !== 1 || v.id !== SETTINGS_ID || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.recordVersion) || !['autosaveMinutes', 'revisionMinutes', 'backupMinutes', 'retentionDays'].every(k => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(v[k])) || (v.backupDestination !== null && (!(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.backupDestination) || !v.backupDestination || v.backupDestination.includes('\0'))) || !['light', 'dark', 'system'].includes(String(v.theme)) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(v.fontFamily) || !v.fontFamily.trim() || typeof v.fontSize !== 'string' || !/^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.[0-9]*[1-9][0-9]*)$/.test(v.fontSize) || !Array.isArray(v.panels))
        return false;
    return v.panels.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(p, ['id', 'visible', 'collapsed', 'placement', 'order', 'width', 'height', 'monitor', 'x', 'y']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(p.id) && !!p.id && typeof p.visible === 'boolean' && typeof p.collapsed === 'boolean' && ['left', 'right', 'bottom', 'center', 'floating'].includes(String(p.placement)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(p.order) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(p.width) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.positiveInteger)(p.height) && (p.monitor === null || (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(p.monitor)) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.signedInteger)(p.x) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.signedInteger)(p.y)) && new Set(v.panels.map(p => p.id)).size === v.panels.length;
}
function validManagedImage(v) { return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['id', 'sha256', 'mediaType']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.id) && typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256) && ['image/png', 'image/jpeg', 'image/webp'].includes(String(v.mediaType)); }
function validAssetData(v) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['id', 'sha256', 'mediaType', 'base64']))
    return false; const { base64, ...image } = v; return validManagedImage(image) && typeof base64 === 'string' && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64); }
function validWorkspaceUnit(v) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, ['owner', 'rootId', 'universeId', 'generation', 'records', 'manuscripts', 'assets', 'counters']) || !validOwner(v.owner) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.rootId) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.isUuid)(v.universeId) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.generation) || v.owner.kind === 'universe' && v.owner.id !== v.universeId || !Array.isArray(v.records) || !v.records.every(_domain_workspace__WEBPACK_IMPORTED_MODULE_3__.validateWorkspaceRecord) || new Set(v.records.map(r => r.id)).size !== v.records.length || !v.records.every(r => r.owner.kind === v.owner.kind && r.owner.id === v.owner.id && r.universeId === v.universeId) || typeof v.manuscripts !== 'object' || !v.manuscripts || Array.isArray(v.manuscripts) || !Array.isArray(v.assets) || !v.assets.every(validManagedImage) || new Set(v.assets.map(a => a.id)).size !== v.assets.length || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v.counters, ['event', 'decision', 'story', 'chapter']) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.event) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.decision) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.story) || !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.unsignedInteger)(v.counters.chapter))
        return false;
    const manuscripts = v.manuscripts, chapters = v.records.filter(r => r.recordType === 'chapter');
    return Object.keys(manuscripts).length === chapters.length && chapters.every(c => (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(manuscripts[c.id]) && !manuscripts[c.id].includes('\r'));
}
function validWorkspaceResult(v, r) {
    if (typeof v !== 'object' || !v)
        return false;
    const x = v, base = ['protocolVersion', 'requestId', 'command', 'status'];
    if (x.protocolVersion !== 1 || x.requestId !== r.requestId || x.command !== r.command)
        return false;
    if (x.status === 'canceled')
        return ['workspace.asset.import', 'settings.import', 'settings.export', 'settings.select-backup'].includes(r.command) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, base);
    if (x.status === 'error')
        return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, [...base, 'code', 'message', 'outcome', 'retry', 'issues']) && _universe__WEBPACK_IMPORTED_MODULE_0__.universeErrorCodes.includes(x.code) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.message) && ['not-committed', 'committed', 'unknown'].includes(String(x.outcome)) && ['same-operation', 'new-request', 'after-recovery', 'not-retryable'].includes(String(x.retry)) && Array.isArray(x.issues) && x.issues.every(i => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(i, ['field', 'message']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(i.field) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(i.message));
    if (x.status !== 'ok' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(v, [...base, 'snapshot', 'receipt', 'settings', 'warnings', 'asset', 'destination']) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_1__.closed)(x.snapshot, ['project', 'universe']) || (x.snapshot.project !== null && !validWorkspaceUnit(x.snapshot.project)) || (x.snapshot.universe !== null && !validWorkspaceUnit(x.snapshot.universe)) || (x.receipt !== null && !validWorkspaceReceipt(x.receipt)) || (x.settings !== null && !validAppSettings(x.settings)) || (x.asset !== null && !validAssetData(x.asset)) || !Array.isArray(x.warnings) || !x.warnings.every(_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText) || (x.destination !== null && !(0,_domain_calendar__WEBPACK_IMPORTED_MODULE_2__.scalarText)(x.destination)))
        return false;
    const snapshot = x.snapshot;
    if (snapshot.project && (!snapshot.universe || snapshot.project.universeId !== snapshot.universe.owner.id))
        return false;
    if (r.command.startsWith('settings.'))
        return x.settings !== null && x.receipt === null && x.asset === null;
    if (x.settings !== null)
        return false;
    if (['workspace.mutate', 'workspace.asset.import'].includes(r.command) && x.receipt === null)
        return false;
    if (['workspace.query', 'workspace.asset.read'].includes(r.command) && x.receipt !== null)
        return false;
    if (['workspace.asset.read', 'workspace.asset.import'].includes(r.command) !== (x.asset !== null))
        return false;
    if (x.receipt) {
        const receipt = x.receipt;
        if (r.input && (receipt.operationId !== r.input.operationId || receipt.submittedEditorRevision !== r.input.submittedEditorRevision || !r.input.units.every(u => receipt.units.some(saved => saved.owner.kind === u.owner.kind && saved.owner.id === u.owner.id && saved.unitGeneration === (BigInt(u.expectedUnitGeneration) + 1n).toString()))))
            return false;
        if (r.operationId && receipt.operationId !== r.operationId)
            return false;
        for (const unit of receipt.units) {
            const current = [snapshot.project, snapshot.universe].find(s => s?.owner.kind === unit.owner.kind && s.owner.id === unit.owner.id);
            if (!current || BigInt(current.generation) < BigInt(unit.unitGeneration))
                return false;
            if (current.generation === unit.unitGeneration && !unit.records.every(record => record.deleted ? !current.records.some(r => r.id === record.id) : current.records.some(r => r.id === record.id && r.recordVersion === record.recordVersion)))
                return false;
        }
    }
    if (r.command === 'workspace.asset.read' && r.assetId && x.asset.id !== r.assetId)
        return false;
    return true;
}


/***/ },

/***/ "./src/application/project.ts"
/*!************************************!*\
  !*** ./src/application/project.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocateProjectUniverse: () => (/* binding */ LocateProjectUniverse),
/* harmony export */   ProjectApplication: () => (/* binding */ ProjectApplication)
/* harmony export */ });
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./universe */ "./src/application/universe.ts");


class LocateProjectUniverse extends Error {
    universeId;
    constructor(universeId) {
        super('Locate the associated universe.');
        this.universeId = universeId;
    }
}
class ProjectApplication {
    storage;
    universes;
    active;
    retired = [];
    constructor(storage, universes) {
        this.storage = storage;
        this.universes = universes;
    }
    workspaceAuthority() { return this.active?.workspace; }
    associatedUniverseId() { return this.active?.snapshot().universeId; }
    current() {
        if (!this.active)
            return null;
        const p = this.active.snapshot(), universe = this.universes.current();
        if (!universe || universe.ownerId !== p.universeId)
            throw new _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure('INTEGRITY_MISMATCH', 'The project universe authority is unavailable.');
        return { ...p, universeLocation: universe.location, universe };
    }
    create(basePath, universePath, input) {
        this.current();
        let candidateUniverse;
        try {
            candidateUniverse = this.universes.stage(universePath);
        }
        catch (error) {
            // Project storage has not been called. A universe-opening failure
            // cannot leave this project creation committed or uncertain.
            throw new _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure(error instanceof _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure ? error.code : 'IO_FAILURE', 'No project was created. The selected universe could not be opened. ' + (error instanceof Error ? error.message : 'Select an existing universe folder.'), 'not-committed');
        }
        let candidate, receipt;
        try {
            const created = this.storage.create(basePath, input, candidateUniverse.snapshot.ownerId, candidateUniverse.snapshot.location);
            candidate = created.store;
            receipt = created.receipt;
            const identity = candidate.snapshot();
            (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.assertWorkspaceState)([...candidate.workspace.snapshot().records, ...candidateUniverse.workspace.snapshot().records]);
            const previous = this.active;
            const universe = candidateUniverse.commit();
            this.active = candidate;
            candidate = undefined;
            if (previous)
                this.retired.push(previous);
            this.releaseRetired();
            return { snapshot: { ...identity, universe }, receipt };
        }
        catch (e) {
            candidate?.releaseCandidate();
            candidateUniverse.cancel();
            if (receipt)
                throw new _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure('RECOVERY_REQUIRED', 'The project was created but activation failed. Reopen its folder before continuing.', 'committed');
            throw e;
        }
    }
    open(basePath, universePath, expectedCreationOperationId) {
        const location = this.storage.physicalPath(basePath);
        const same = this.active?.location === location;
        const relocated = !same && !!this.active?.prepareRelocatedReopen(location);
        if (this.active && !relocated)
            this.current();
        const candidate = same ? this.active : this.storage.open(basePath, expectedCreationOperationId);
        let staged;
        try {
            if (same)
                this.current();
            const p = candidate.snapshot();
            if (expectedCreationOperationId && p.creationOperationId !== expectedCreationOperationId)
                throw new _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure('INTEGRITY_MISMATCH', 'Reopen the project belonging to the pending creation.');
            try {
                staged = this.universes.stage(universePath ?? p.universeLocation, p.universeId);
            }
            catch (e) {
                if (!universePath)
                    throw new LocateProjectUniverse(p.universeId);
                throw e;
            }
            ;(0,_domain_workspace__WEBPACK_IMPORTED_MODULE_0__.assertWorkspaceState)([...candidate.workspace.snapshot().records, ...staged.workspace.snapshot().records]);
            candidate.bind(staged.snapshot.location);
            const identity = candidate.snapshot(), previous = this.active;
            const universe = staged.commit();
            this.active = candidate;
            if (!same && previous)
                this.retired.push(previous);
            this.releaseRetired();
            return { ...identity, universe };
        }
        catch (e) {
            if (!same)
                candidate.releaseCandidate();
            staged?.cancel();
            throw e;
        }
    }
    releaseRetired() {
        this.retired = this.retired.filter(store => { try {
            store.close();
            return false;
        }
        catch {
            return true;
        } });
    }
    close() {
        this.active?.close();
        this.active = undefined;
        this.releaseRetired();
        if (this.retired.length)
            throw new _universe__WEBPACK_IMPORTED_MODULE_1__.UniverseFailure('RECOVERY_REQUIRED', 'Previous project ownership could not be drained. Retry closing before shutdown.', 'unknown');
    }
}


/***/ },

/***/ "./src/application/protection.ts"
/*!***************************************!*\
  !*** ./src/application/protection.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProtectionApplication: () => (/* binding */ ProtectionApplication)
/* harmony export */ });
class ProtectionApplication {
    port;
    constructor(port) {
        this.port = port;
    }
    get busy() { return this.port.busy; }
    execute(request) { return this.port.execute(request); }
    cancel(operationId) { return this.port.cancel(operationId); }
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
    retired = [];
    constructor(storage) {
        this.storage = storage;
    }
    workspaceAuthority() { return this.active?.workspace; }
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
    stage(basePath, expectedId) {
        // Validate existing authority before preparing any candidate transition.
        this.active?.snapshot();
        const location = this.storage.physicalPath(basePath);
        if (this.active?.location === location) {
            const snapshot = this.active.snapshot();
            if (expectedId && snapshot.ownerId !== expectedId)
                throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
            return { snapshot, workspace: this.active.workspace, commit: () => snapshot, cancel: () => undefined };
        }
        if (expectedId && this.storage.identity(basePath).ownerId !== expectedId)
            throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
        const candidate = this.storage.open(basePath);
        let consumed = false;
        try {
            const snapshot = candidate.snapshot();
            if (expectedId && snapshot.ownerId !== expectedId)
                throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
            return { snapshot, workspace: candidate.workspace, commit: () => {
                    // No fallible candidate I/O remains after this authority switch.
                    if (!consumed) {
                        if (this.active)
                            this.retired.push(this.active);
                        this.active = candidate;
                        consumed = true;
                        this.releaseRetired();
                    }
                    return snapshot;
                }, cancel: () => { if (!consumed) {
                    consumed = true;
                    candidate.close();
                } } };
        }
        catch (e) {
            if (!consumed)
                candidate.close();
            throw e;
        }
    }
    releaseRetired() {
        this.retired = this.retired.filter(store => {
            try {
                store.close();
                return false;
            }
            catch {
                return true;
            } // Retain ownership for a later drain attempt.
        });
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
        this.releaseRetired();
        if (this.retired.length)
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Previous universe ownership could not be drained. Retry closing before shutdown.', 'unknown');
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

/***/ "./src/application/workspace.ts"
/*!**************************************!*\
  !*** ./src/application/workspace.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkspaceApplication: () => (/* binding */ WorkspaceApplication)
/* harmony export */ });
/* harmony import */ var _universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe */ "./src/application/universe.ts");
/* harmony import */ var _contracts_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _domain_manuscript__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../domain/manuscript */ "./src/domain/manuscript.ts");





const ownerKey = (o) => o.kind + '/' + o.id;
class WorkspaceApplication {
    projects;
    universes;
    publication;
    identity;
    constructor(projects, universes, publication, identity) {
        this.projects = projects;
        this.universes = universes;
        this.publication = publication;
        this.identity = identity;
    }
    recoveryProject;
    withRecoveryProject(port, location, work) { if (this.projects.workspaceAuthority() || this.recoveryProject)
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Close the active project before recovery activation.'); this.recoveryProject = { port, location }; try {
        return work();
    }
    finally {
        this.recoveryProject = undefined;
    } }
    units() { return [this.recoveryProject?.port ?? this.projects.workspaceAuthority(), this.universes.workspaceAuthority()].filter((p) => !!p); }
    unit(owner) { const found = this.units().find(u => ownerKey(u.snapshot().owner) === ownerKey(owner)); if (!found)
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Open the owning project or universe before editing.'); return found; }
    snapshot() { this.universes.current(); this.projects.current(); const project = (this.recoveryProject?.port ?? this.projects.workspaceAuthority())?.snapshot() ?? null, universe = this.universes.workspaceAuthority()?.snapshot() ?? null; if (project && (!universe || project.universeId !== universe.owner.id))
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('INTEGRITY_MISMATCH', 'The project universe authority is unavailable.'); if (!this.recoveryProject)
        (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.assertWorkspaceState)([...(project?.records ?? []), ...(universe?.records ?? [])]); return { project, universe }; }
    reconcile(operationId) { this.publication.recover(operationId); for (const u of this.units())
        u.recover(); return this.publication.receipt(operationId) ?? this.units().map(u => u.receipt(operationId)).find(Boolean); }
    mutate(input) { try {
        return this.mutateValidated(input);
    }
    catch (e) {
        if (e instanceof _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure || e instanceof _domain_workspace__WEBPACK_IMPORTED_MODULE_2__.WorkspaceValidationError)
            throw e;
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', e instanceof Error ? e.message : 'Invalid workspace candidate.');
    } }
    mutateValidated(input) {
        if (!(0,_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validWorkspaceMutation)(input))
            throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'The workspace command has invalid fields.');
        const request = { protocolVersion: 1, command: 'workspace.mutate', units: input.units, submittedEditorRevision: input.submittedEditorRevision };
        const digest = this.identity.digest(request);
        const prior = this.publication.receipt(input.operationId, digest) ?? this.units().map(u => u.receipt(input.operationId, digest)).find(Boolean);
        if (prior)
            return prior;
        const before = this.snapshot(), snapshots = [before.project, before.universe].filter((s) => !!s), beforeRecords = snapshots.flatMap(s => s.records), candidate = new Map(beforeRecords.map(r => [r.id, structuredClone(r)])), texts = Object.assign({}, ...snapshots.map(s => s.manuscripts));
        const changed = new Set(), explicit = new Set(), touched = new Set(), counters = new Map(snapshots.map(s => [ownerKey(s.owner), { ...s.counters }]));
        for (const unit of input.units) {
            const s = snapshots.find(s => ownerKey(s.owner) === ownerKey(unit.owner));
            if (!s || s.generation !== unit.expectedUnitGeneration)
                throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('GENERATION_CONFLICT', 'The owning unit changed. Reload before saving.');
            touched.add(ownerKey(unit.owner));
            for (const change of unit.changes) {
                const id = change.action === 'put' ? change.record.id : change.id, old = candidate.get(id);
                if (change.expectedRecordVersion === null ? !!old || this.unit(unit.owner).hasIdentity(id) : !old || old.recordVersion !== change.expectedRecordVersion)
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('GENERATION_CONFLICT', 'A record changed or its permanent identity was already used.');
                if (old && ownerKey(old.owner) !== ownerKey(unit.owner))
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'The record belongs to another unit.');
                explicit.add(id);
                changed.add(id);
                if (change.action === 'delete') {
                    if (old?.recordType === 'decision-type' || old?.recordType === 'calendar')
                        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Calendar and decision type deletion is unsupported.');
                    candidate.delete(id);
                    continue;
                }
                const record = structuredClone(change.record);
                if (ownerKey(record.owner) !== ownerKey(unit.owner) || record.universeId !== s.universeId)
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'The record has foreign ownership.');
                if (old && old.recordType !== record.recordType)
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Record types are permanent.');
                if (record.recordType === 'decision-type' && old && this.identity.digest(old.data) !== this.identity.digest(record.data))
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Decision type definitions are immutable.');
                if (change.manuscript !== null) {
                    if (record.recordType !== 'chapter')
                        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Only chapters have manuscripts.');
                    texts[id] = change.manuscript;
                }
                candidate.set(id, record);
            }
        }
        const uuid = () => this.identity.uuid();
        const allocate = (r) => { const counter = counters.get(ownerKey(r.owner)), kind = r.recordType; let n = BigInt(counter[kind]); const keys = new Set([...candidate.values()].filter((r) => r.recordType === 'event' || r.recordType === 'decision').filter(x => x.id !== r.id).map(x => (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.canonicalCodeKey)(x.data.code))); let code; do {
            n++;
            code = (kind === 'event' ? 'E' : 'D') + n.toString().padStart(3, '0');
        } while (keys.has((0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.canonicalCodeKey)(code))); counter[kind] = n.toString(); return code; };
        // Named built-ins are ordinary durable universe records, initialized in the first content operation.
        if (before.universe && touched.has(ownerKey(before.universe.owner))) {
            const owner = before.universe.owner;
            for (const data of _domain_workspace__WEBPACK_IMPORTED_MODULE_2__.BUILTIN_DECISION_TYPES) {
                if (![...candidate.values()].some(r => r.recordType === 'decision-type' && r.data.builtin === data.builtin)) {
                    const r = { schemaVersion: 1, recordType: 'decision-type', id: uuid(), owner, universeId: owner.id, recordVersion: uuid(), data: { ...data } };
                    candidate.set(r.id, r);
                    changed.add(r.id);
                    touched.add(ownerKey(owner));
                }
            }
        }
        let calendar = [...candidate.values()].find((r) => r.recordType === 'calendar');
        const previousCalendar = beforeRecords.find((r) => r.recordType === 'calendar');
        if (calendar) {
            calendar = { ...calendar, data: (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.normalizeCalendarData)(calendar.data, previousCalendar?.data ?? null) };
            candidate.set(calendar.id, calendar);
            if (previousCalendar && calendar.data.currentVersion !== previousCalendar.data.currentVersion) {
                for (const r of candidate.values()) {
                    if ('calendarUpdateRequired' in r.data && r.data.calendarUpdateRequired)
                        continue;
                    const updated = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.updateRecordCalendar)(r, calendar.data, _domain_calendar__WEBPACK_IMPORTED_MODULE_3__.convertDate);
                    if (this.identity.digest(updated) !== this.identity.digest(r)) {
                        candidate.set(r.id, updated);
                        changed.add(r.id);
                        touched.add(ownerKey(r.owner));
                    }
                }
            }
        }
        for (const [id, r] of candidate) {
            const old = beforeRecords.find(x => x.id === id);
            if (r.recordType === 'story' || r.recordType === 'chapter') {
                if (old && (old.recordType === 'story' || old.recordType === 'chapter'))
                    r.data.creationSequence = old.data.creationSequence;
                else {
                    const counter = counters.get(ownerKey(r.owner)), sequence = (BigInt(counter[r.recordType]) + 1n).toString();
                    counter[r.recordType] = sequence;
                    r.data.creationSequence = sequence;
                }
            }
            if (r.recordType === 'calendar')
                continue;
            if (r.recordType === 'event' || r.recordType === 'decision') {
                if (!old) {
                    const generated = allocate(r);
                    r.data.code = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.trimmedCode)(r.data.code) || generated;
                }
                else
                    r.data.code = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.trimmedCode)(r.data.code);
            }
            if (r.recordType === 'faction')
                r.data = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.normalizeFaction)(r.data);
            if (r.recordType === 'decision-type' && (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.canonicalCodeKey)(r.data.name) === (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.canonicalCodeKey)('Universe Events'))
                throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Universe Events is a reserved category name.');
        }
        // Birth identity and both displayed years are published in the same owning-universe generation.
        for (const [id, r] of candidate) {
            if (r.recordType !== 'character')
                continue;
            const old = beforeRecords.find((x) => x.id === id && x.recordType === 'character');
            r.data = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.normalizeCharacter)(r.data, [...candidate.values()].some(x => x.recordType === 'event' && x.data.kind === 'background' && x.data.characterId === id));
            if (!r.data.birth) {
                if (old?.data.birthEventId) {
                    candidate.delete(old.data.birthEventId);
                    changed.add(old.data.birthEventId);
                }
                r.data.birthEventId = null;
                continue;
            }
            if (!calendar)
                throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Configure a calendar before recording a birth.');
            const oldEvent = old?.data.birthEventId ? candidate.get(old.data.birthEventId) : undefined;
            const birthEdited = !old || this.identity.digest(old.data.birth) !== this.identity.digest(r.data.birth);
            let event = oldEvent?.recordType === 'event' ? oldEvent : undefined;
            if (!event) {
                const eventId = old?.data.birthEventId ?? uuid();
                event = { schemaVersion: 1, recordType: 'event', id: eventId, owner: r.owner, universeId: r.universeId, recordVersion: uuid(), data: { heading: r.data.name + ' born', description: null, date: (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.birthPosition)(r.data.birth, calendar.data), code: '', order: '0', maker: null, kind: 'birth', characterId: id } };
                event.data.code = allocate(event);
                changed.add(eventId);
            }
            else if (birthEdited && !(old?.data.calendarUpdateRequired && !r.data.calendarUpdateRequired)) {
                event = { ...event, data: { ...event.data, date: (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.birthPosition)(r.data.birth, calendar.data) } };
                changed.add(event.id);
            }
            r.data.birthEventId = event.id;
            r.data.birth = { ...r.data.birth, year: event.data.date.year };
            candidate.set(event.id, event);
        }
        for (const old of beforeRecords)
            if (old.recordType === 'character' && !candidate.has(old.id) && old.data.birthEventId) {
                candidate.delete(old.data.birthEventId);
                changed.add(old.data.birthEventId);
            }
        const dated = (r) => ['event', 'decision', 'plot', 'affiliation'].includes(r.recordType);
        const dateEqual = (a, b) => a === null || b === null ? a === b : calendar ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.compareDates)(a, b, calendar.data) === 0 : this.identity.digest(a) === this.identity.digest(b);
        const moved = new Set([...candidate.values()].filter(dated).filter(r => { const old = beforeRecords.find(x => x.id === r.id); return !old || !dated(old) || !dateEqual(old.data.date, r.data.date); }).map(r => r.id));
        const processed = new Set();
        for (const r of candidate.values())
            if (dated(r) && moved.has(r.id)) {
                let max = -1n;
                for (const other of candidate.values())
                    if (dated(other) && other.id !== r.id && other.recordType === r.recordType && (!moved.has(other.id) || processed.has(other.id)) && (r.recordType !== 'plot' || other.recordType === 'plot' && other.data.storyId === r.data.storyId) && (r.recordType !== 'affiliation' || other.recordType === 'affiliation' && other.data.characterId === r.data.characterId) && dateEqual(other.data.date, r.data.date) && BigInt(other.data.order) > max)
                        max = BigInt(other.data.order);
                r.data.order = (max + 1n).toString();
                processed.add(r.id);
            }
        // Issue versions after all derived changes, then bind formatting to exactly those versions and bytes.
        for (const [id, r] of candidate) {
            const old = beforeRecords.find(x => x.id === id);
            if (!old || this.identity.digest(r) !== this.identity.digest(old) || changed.has(id)) {
                r.recordVersion = uuid();
                changed.add(id);
                touched.add(ownerKey(r.owner));
            }
            if (r.recordType === 'chapter') {
                if (calendar && old?.recordType === 'chapter' && old.data.calendarUpdateRequired && !r.data.calendarUpdateRequired) {
                    r.data.start = old.data.start ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.convertDate)(old.data.start, calendar.data) : null;
                    r.data.end = old.data.end ? (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.convertDate)(old.data.end, calendar.data) : null;
                }
                if (calendar)
                    Object.assign(r.data, (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_3__.correctChapterRange)(r.data.start, r.data.end, calendar.data));
                const text = texts[id];
                if (typeof text !== 'string')
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'A new chapter requires its manuscript text.');
                (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_4__.assertManuscript)(text, r.data.formatting.paragraphs);
                r.data.formatting = { ...r.data.formatting, chapterId: id, recordVersion: r.recordVersion, text: { relativePath: `chapters/${id}.wrt`, sha256: this.identity.textDigest(text), byteLength: this.identity.byteLength(text), scalarLength: Array.from(text).length.toString() } };
            }
        }
        const final = [...candidate.values()];
        for (const r of final)
            if (!(0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.validateWorkspaceRecord)(r))
                throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'A record contains invalid fields, formatting or exact numbers.');
        (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.assertWorkspaceState)(final);
        if (before.universe)
            this.publication.assertUnreferenced(before.universe.owner.id, beforeRecords.filter(r => r.owner.kind === 'universe' && !candidate.has(r.id)).map(r => r.id), before.project ? [before.project.owner.id] : []);
        const allAssets = snapshots.flatMap(s => s.assets);
        for (const r of final) {
            const assets = r.recordType === 'character' ? [r.data.image] : r.recordType === 'faction' ? [r.data.image, r.data.leaderImage] : [];
            for (const a of assets)
                if (a && !allAssets.some(x => x.id === a.id && x.sha256 === a.sha256 && x.mediaType === a.mediaType))
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Import the image into this universe before using it.');
        }
        const plans = snapshots.filter(s => touched.has(ownerKey(s.owner))).map(s => ({ owner: s.owner, plan: { expectedGeneration: s.generation, records: final.filter(r => ownerKey(r.owner) === ownerKey(s.owner)), manuscripts: Object.fromEntries(Object.entries(texts).filter(([id]) => final.some(r => r.id === id && ownerKey(r.owner) === ownerKey(s.owner)))), counters: counters.get(ownerKey(s.owner)), assets: [] } }));
        const receipt = { protocolVersion: 1, operationId: input.operationId, submittedEditorRevision: input.submittedEditorRevision, units: plans.map(p => ({ owner: p.owner, unitGeneration: (BigInt(p.plan.expectedGeneration) + 1n).toString(), records: [...changed].flatMap(id => { const r = candidate.get(id), old = beforeRecords.find(r => r.id === id); if (ownerKey((r ?? old).owner) !== ownerKey(p.owner))
                    return []; return [{ id, recordVersion: r?.recordVersion ?? uuid(), deleted: !r }]; }) })) };
        return plans.length === 1 ? this.unit(plans[0].owner).commit(input.operationId, digest, plans[0].plan, receipt, request) : this.publication.commit(input.operationId, digest, plans, receipt, request);
    }
    importAsset(owner, operationId, expectedGeneration, asset) { const unit = this.unit(owner), s = unit.snapshot(), request = { protocolVersion: 1, command: 'workspace.asset.import', owner, expectedGeneration, asset }, digest = this.identity.digest(request); const canonicalAsset = s.assets.find(a => a.sha256 === asset.sha256 && a.mediaType === asset.mediaType); if (canonicalAsset)
        asset = { ...canonicalAsset, base64: asset.base64 }; const prior = unit.receipt(operationId, digest); if (prior)
        return { receipt: prior, asset }; if (owner.kind !== 'universe' || s.generation !== expectedGeneration)
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('GENERATION_CONFLICT', 'The universe changed before the image import.'); const receipt = { protocolVersion: 1, operationId, submittedEditorRevision: '0', units: [{ owner, unitGeneration: (BigInt(s.generation) + 1n).toString(), records: [] }] }; return { receipt: unit.commit(operationId, digest, { expectedGeneration, records: s.records, manuscripts: s.manuscripts, counters: s.counters, assets: [asset] }, receipt, request), asset }; }
    readAsset(owner, id) { return this.unit(owner).readAsset(id); }
    capture(owner) { return this.unit(owner).capture(); }
    displayName(owner) { if (owner.kind === 'universe') {
        const s = this.universes.current();
        if (s?.ownerId === owner.id)
            return s.profile.name;
    } return owner.kind; }
    location(owner) { if (owner.kind === 'project' && this.recoveryProject?.port.snapshot().owner.id === owner.id)
        return this.recoveryProject.location; const s = owner.kind === 'project' ? this.projects.current() : this.universes.current(); if (!s || s.ownerId !== owner.id)
        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Open the owning unit first.'); return s.location; }
    /** Trusted complete candidate path for protection. Ordinary edits cannot resurrect tombstones. */
    restore(operationId, expected, candidates) {
        const before = this.recoveryProject ? { project: this.recoveryProject.port.snapshot(), universe: this.universes.workspaceAuthority()?.snapshot() ?? null } : this.snapshot(), live = [before.project, before.universe].filter((s) => !!s), records = live.flatMap(s => candidates.find(c => ownerKey(c.snapshot.owner) === ownerKey(s.owner))?.snapshot.records ?? s.records);
        if (!candidates.length || candidates.length > 2 || new Set(candidates.map(c => ownerKey(c.snapshot.owner))).size !== candidates.length)
            throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Invalid restore participants.');
        (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.assertWorkspaceState)(records);
        const plans = candidates.map(({ snapshot, assets }) => {
            const current = live.find(s => ownerKey(s.owner) === ownerKey(snapshot.owner)), generation = expected.find(e => ownerKey(e.owner) === ownerKey(snapshot.owner))?.generation;
            if (!current || generation !== current.generation || snapshot.rootId !== current.rootId || snapshot.universeId !== current.universeId)
                throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('GENERATION_CONFLICT', 'Restore authority changed. Review affected choices again.');
            const available = [...current.assets, ...assets];
            for (const a of assets)
                if (!(0,_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validAssetData)(a))
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Invalid image.');
            for (const r of snapshot.records) {
                if (!(0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.validateWorkspaceRecord)(r) || ownerKey(r.owner) !== ownerKey(current.owner) || r.universeId !== current.universeId)
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Restore candidate has foreign content.');
                const prior = current.records.find(p => p.id === r.id);
                if (prior && prior.recordType !== r.recordType)
                    throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Permanent record type cannot change.');
                if (r.recordType === 'chapter') {
                    const text = snapshot.manuscripts[r.id];
                    (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_4__.assertManuscript)(text, r.data.formatting.paragraphs);
                    if (this.identity.textDigest(text) !== r.data.formatting.text.sha256 || this.identity.byteLength(text) !== r.data.formatting.text.byteLength)
                        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Restored text and formatting do not match.');
                }
                for (const a of r.recordType === 'character' ? [r.data.image] : r.recordType === 'faction' ? [r.data.image, r.data.leaderImage] : [])
                    if (a && !available.some(x => x.id === a.id && x.sha256 === a.sha256 && x.mediaType === a.mediaType))
                        throw new _universe__WEBPACK_IMPORTED_MODULE_0__.UniverseFailure('VALIDATION', 'Restored image is unavailable.');
            }
            const counters = { ...current.counters };
            for (const k of ['event', 'decision', 'story', 'chapter'])
                if (BigInt(snapshot.counters[k]) > BigInt(counters[k]))
                    counters[k] = snapshot.counters[k];
            return { owner: current.owner, plan: { expectedGeneration: current.generation, records: snapshot.records, manuscripts: snapshot.manuscripts, counters, assets } };
        });
        if (before.universe)
            this.publication.assertUnreferenced(before.universe.owner.id, before.universe.records.filter(r => !records.some(c => c.id === r.id)).map(r => r.id), before.project ? [before.project.owner.id] : []);
        const request = { protocolVersion: 1, command: 'workspace.restore', submittedEditorRevision: '0', plans }, digest = this.identity.digest(request), prior = this.publication.receipt(operationId, digest) ?? this.units().map(u => u.receipt(operationId, digest)).find(Boolean);
        if (prior)
            return prior;
        const receipt = { protocolVersion: 1, operationId, submittedEditorRevision: '0', units: plans.map(p => ({ owner: p.owner, unitGeneration: (BigInt(p.plan.expectedGeneration) + 1n).toString(), records: [...p.plan.records.map(r => ({ id: r.id, recordVersion: r.recordVersion, deleted: false })), ...live.find(s => ownerKey(s.owner) === ownerKey(p.owner)).records.filter(r => !p.plan.records.some(c => c.id === r.id)).map(r => ({ id: r.id, recordVersion: this.identity.uuid(), deleted: true }))] })) };
        return plans.length === 1 ? this.unit(plans[0].owner).commit(operationId, digest, plans[0].plan, receipt, request) : this.publication.commit(operationId, digest, plans, receipt, request);
    }
}


/***/ },

/***/ "./src/domain/calendar.ts"
/*!********************************!*\
  !*** ./src/domain/calendar.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   birthPosition: () => (/* binding */ birthPosition),
/* harmony export */   compareDates: () => (/* binding */ compareDates),
/* harmony export */   configuration: () => (/* binding */ configuration),
/* harmony export */   convertDate: () => (/* binding */ convertDate),
/* harmony export */   correctChapterRange: () => (/* binding */ correctChapterRange),
/* harmony export */   displayDate: () => (/* binding */ displayDate),
/* harmony export */   elapsedPosition: () => (/* binding */ elapsedPosition),
/* harmony export */   floorDivide: () => (/* binding */ floorDivide),
/* harmony export */   normalizeCalendarData: () => (/* binding */ normalizeCalendarData),
/* harmony export */   positiveInteger: () => (/* binding */ positiveInteger),
/* harmony export */   scalarText: () => (/* binding */ scalarText),
/* harmony export */   signedInteger: () => (/* binding */ signedInteger),
/* harmony export */   unsignedInteger: () => (/* binding */ unsignedInteger),
/* harmony export */   validCalendarConfiguration: () => (/* binding */ validCalendarConfiguration),
/* harmony export */   validCalendarData: () => (/* binding */ validCalendarData),
/* harmony export */   validDatePosition: () => (/* binding */ validDatePosition)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");

const signedInteger = (v) => typeof v === 'string' && /^(0|-?[1-9][0-9]*)$/.test(v);
const unsignedInteger = (v) => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
const positiveInteger = (v) => unsignedInteger(v) && v !== '0';
const scalarText = (v) => typeof v === 'string' && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v);
function validCalendarConfiguration(v) {
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'elements', 'daysOnly', 'actualDays', 'targetDays', 'enteredYear', 'yearNames']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !signedInteger(v.enteredYear) || !positiveInteger(v.actualDays) || !positiveInteger(v.targetDays) || !Array.isArray(v.elements) || !Array.isArray(v.yearNames))
        return false;
    const ids = new Set();
    for (const e of v.elements) {
        if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['id', 'kind', 'name', 'days']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.id) || ids.has(e.id) || !scalarText(e.name) || !positiveInteger(e.days) || !['month', 'standalone'].includes(e.kind) || (e.kind === 'standalone' && e.days !== '1'))
            return false;
        ids.add(e.id);
    }
    if (v.elements.length ? v.daysOnly !== null || v.elements.reduce((n, e) => n + BigInt(e.days), 0n).toString() !== v.actualDays : !positiveInteger(v.daysOnly) || v.daysOnly !== v.actualDays)
        return false;
    const years = new Set();
    return v.yearNames.every(n => { if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(n, ['year', 'name']) || !signedInteger(n.year) || !scalarText(n.name) || years.has(n.year))
        return false; years.add(n.year); return true; });
}
function validCalendarData(v) {
    return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['currentVersion', 'anchor', 'versions']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.currentVersion) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.anchor, ['year', 'day']) && signedInteger(v.anchor.year) && v.anchor.day === '1' && Array.isArray(v.versions) && v.versions.length > 0 && v.versions.every(validCalendarConfiguration) && new Set(v.versions.map(c => c.id)).size === v.versions.length && v.versions.some(c => c.id === v.currentVersion);
}
function validDatePosition(v) { return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['calendarVersion', 'year', 'day']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.calendarVersion) && signedInteger(v.year) && positiveInteger(v.day); }
function configuration(calendar, id) { const c = calendar.versions.find(c => c.id === id); if (!c)
    throw new Error('Unknown calendar configuration.'); return c; }
function elapsedPosition(date, calendar) {
    if (!validDatePosition(date))
        throw new Error('Invalid calendar date.');
    const c = configuration(calendar, date.calendarVersion);
    if (BigInt(date.day) > BigInt(c.actualDays))
        throw new Error('Day exceeds the calendar year length.');
    return (BigInt(date.year) - BigInt(calendar.anchor.year)) * BigInt(c.actualDays) + BigInt(date.day) - 1n;
}
function floorDivide(n, d) { const q = n / d; return n % d < 0n ? q - 1n : q; }
function convertDate(date, calendar, targetVersion = calendar.currentVersion) {
    const position = elapsedPosition(date, calendar), days = BigInt(configuration(calendar, targetVersion).actualDays), years = floorDivide(position, days);
    return { calendarVersion: targetVersion, year: (BigInt(calendar.anchor.year) + years).toString(), day: (position - years * days + 1n).toString() };
}
function compareDates(a, b, calendar) { const x = elapsedPosition(a, calendar), y = elapsedPosition(b, calendar); return x < y ? -1 : x > y ? 1 : 0; }
function displayDate(date, calendar) {
    elapsedPosition(date, calendar);
    const c = configuration(calendar, date.calendarVersion), name = c.yearNames.find(n => n.year === date.year)?.name || '';
    if (!c.elements.length)
        return `${date.day}/${date.year}`;
    let remaining = BigInt(date.day), monthOrdinal = 0n;
    for (const e of c.elements) {
        if (e.kind === 'month')
            monthOrdinal++;
        if (remaining <= BigInt(e.days)) {
            if (e.kind === 'standalone')
                return `${name ? `${name}/` : ''}${e.name ? `${e.name}-` : ''}${date.day}/${date.year}`;
            return [e.name || monthOrdinal.toString(), remaining.toString(), date.year, name].filter(Boolean).join('/');
        }
        remaining -= BigInt(e.days);
    }
    throw new Error('Invalid calendar date.');
}
function correctChapterRange(start, end, calendar) {
    if (start)
        elapsedPosition(start, calendar);
    if (end)
        elapsedPosition(end, calendar);
    return { start, end: start && end && compareDates(end, start, calendar) < 0 ? { ...start } : end };
}
function birthPosition(birth, calendar) {
    if (!signedInteger(birth.year) || (birth.day !== null && !positiveInteger(birth.day)))
        throw new Error('Invalid recorded birth components.');
    const c = configuration(calendar, calendar.currentVersion);
    let day = 1n;
    if (birth.elementId !== null) {
        const index = c.elements.findIndex(e => e.id === birth.elementId);
        if (index >= 0) {
            const e = c.elements[index], component = BigInt(birth.day ?? '1');
            if (component <= BigInt(e.days))
                day = c.elements.slice(0, index).reduce((n, e) => n + BigInt(e.days), 0n) + component;
        }
    }
    else if (birth.day !== null && BigInt(birth.day) <= BigInt(c.actualDays))
        day = BigInt(birth.day);
    return { calendarVersion: c.id, year: birth.year, day: day.toString() };
}
/** Form targets may differ; committed configurations use their calculated actual total. */
function normalizeCalendarData(candidate, previous = null) {
    const normalized = { ...candidate, anchor: { ...candidate.anchor }, versions: candidate.versions.map(c => {
            const actual = c.elements.length ? c.elements.reduce((n, e) => { if (!positiveInteger(e.days))
                throw new Error('Calendar element days must be positive integers.'); return n + BigInt(e.days); }, 0n).toString() : c.daysOnly;
            if (!positiveInteger(actual) || !positiveInteger(c.targetDays))
                throw new Error('Calendar day totals must be positive integers.');
            return { ...c, actualDays: actual, targetDays: actual };
        }) };
    if (!validCalendarData(normalized))
        throw new Error('Invalid calendar configuration.');
    if (!previous && normalized.anchor.year !== normalized.versions[0].enteredYear)
        throw new Error('The calendar anchor must use the first entered year.');
    if (previous) {
        if (previous.anchor.year !== normalized.anchor.year || previous.anchor.day !== normalized.anchor.day)
            throw new Error('Calendar lineage anchor is immutable.');
        for (const old of previous.versions) {
            const retained = normalized.versions.find(v => v.id === old.id);
            if (!retained || stableCalendarJSON(old) !== stableCalendarJSON(retained))
                throw new Error('Existing calendar configurations are immutable.');
        }
    }
    return normalized;
}
function stableCalendarJSON(value) { if (value === null || typeof value !== 'object')
    return JSON.stringify(value); if (Array.isArray(value))
    return '[' + value.map(stableCalendarJSON).join(',') + ']'; return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stableCalendarJSON(value[k])).join(',') + '}'; }


/***/ },

/***/ "./src/domain/capture-time.ts"
/*!************************************!*\
  !*** ./src/domain/capture-time.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureTime: () => (/* binding */ captureTime),
/* harmony export */   safeDisplayName: () => (/* binding */ safeDisplayName)
/* harmony export */ });
function captureTime(date = new Date()) { const two = (n) => String(n).padStart(2, '0'); return { utc: date.toISOString(), local: `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}_${two(date.getHours())}-${two(date.getMinutes())}-${two(date.getSeconds())}`, offsetMinutes: String(-date.getTimezoneOffset()), zone: Intl.DateTimeFormat().resolvedOptions().timeZone }; }
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
function safeDisplayName(name) { const value = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/g, '').trim(); return value && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(value) ? value : 'WritingTool'; }


/***/ },

/***/ "./src/domain/code-fold.ts"
/*!*********************************!*\
  !*** ./src/domain/code-fold.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canonicalCodeKey: () => (/* binding */ canonicalCodeKey),
/* harmony export */   trimmedCode: () => (/* binding */ trimmedCode)
/* harmony export */ });
/* harmony import */ var _unicode_normalization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unicode-normalization */ "./src/domain/unicode-normalization.ts");

// Unicode License V3: resources/licenses/Unicode-LICENSE.txt
// Full default case folding, Unicode 17.0.0 CaseFolding.txt (C/F; Turkic excluded).
const FOLD = { "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f", "G": "g", "H": "h", "I": "i", "J": "j", "K": "k", "L": "l", "M": "m", "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r", "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x", "Y": "y", "Z": "z", "\u00b5": "\u03bc", "\u00c0": "\u00e0", "\u00c1": "\u00e1", "\u00c2": "\u00e2", "\u00c3": "\u00e3", "\u00c4": "\u00e4", "\u00c5": "\u00e5", "\u00c6": "\u00e6", "\u00c7": "\u00e7", "\u00c8": "\u00e8", "\u00c9": "\u00e9", "\u00ca": "\u00ea", "\u00cb": "\u00eb", "\u00cc": "\u00ec", "\u00cd": "\u00ed", "\u00ce": "\u00ee", "\u00cf": "\u00ef", "\u00d0": "\u00f0", "\u00d1": "\u00f1", "\u00d2": "\u00f2", "\u00d3": "\u00f3", "\u00d4": "\u00f4", "\u00d5": "\u00f5", "\u00d6": "\u00f6", "\u00d8": "\u00f8", "\u00d9": "\u00f9", "\u00da": "\u00fa", "\u00db": "\u00fb", "\u00dc": "\u00fc", "\u00dd": "\u00fd", "\u00de": "\u00fe", "\u00df": "ss", "\u0100": "\u0101", "\u0102": "\u0103", "\u0104": "\u0105", "\u0106": "\u0107", "\u0108": "\u0109", "\u010a": "\u010b", "\u010c": "\u010d", "\u010e": "\u010f", "\u0110": "\u0111", "\u0112": "\u0113", "\u0114": "\u0115", "\u0116": "\u0117", "\u0118": "\u0119", "\u011a": "\u011b", "\u011c": "\u011d", "\u011e": "\u011f", "\u0120": "\u0121", "\u0122": "\u0123", "\u0124": "\u0125", "\u0126": "\u0127", "\u0128": "\u0129", "\u012a": "\u012b", "\u012c": "\u012d", "\u012e": "\u012f", "\u0130": "i\u0307", "\u0132": "\u0133", "\u0134": "\u0135", "\u0136": "\u0137", "\u0139": "\u013a", "\u013b": "\u013c", "\u013d": "\u013e", "\u013f": "\u0140", "\u0141": "\u0142", "\u0143": "\u0144", "\u0145": "\u0146", "\u0147": "\u0148", "\u0149": "\u02bcn", "\u014a": "\u014b", "\u014c": "\u014d", "\u014e": "\u014f", "\u0150": "\u0151", "\u0152": "\u0153", "\u0154": "\u0155", "\u0156": "\u0157", "\u0158": "\u0159", "\u015a": "\u015b", "\u015c": "\u015d", "\u015e": "\u015f", "\u0160": "\u0161", "\u0162": "\u0163", "\u0164": "\u0165", "\u0166": "\u0167", "\u0168": "\u0169", "\u016a": "\u016b", "\u016c": "\u016d", "\u016e": "\u016f", "\u0170": "\u0171", "\u0172": "\u0173", "\u0174": "\u0175", "\u0176": "\u0177", "\u0178": "\u00ff", "\u0179": "\u017a", "\u017b": "\u017c", "\u017d": "\u017e", "\u017f": "s", "\u0181": "\u0253", "\u0182": "\u0183", "\u0184": "\u0185", "\u0186": "\u0254", "\u0187": "\u0188", "\u0189": "\u0256", "\u018a": "\u0257", "\u018b": "\u018c", "\u018e": "\u01dd", "\u018f": "\u0259", "\u0190": "\u025b", "\u0191": "\u0192", "\u0193": "\u0260", "\u0194": "\u0263", "\u0196": "\u0269", "\u0197": "\u0268", "\u0198": "\u0199", "\u019c": "\u026f", "\u019d": "\u0272", "\u019f": "\u0275", "\u01a0": "\u01a1", "\u01a2": "\u01a3", "\u01a4": "\u01a5", "\u01a6": "\u0280", "\u01a7": "\u01a8", "\u01a9": "\u0283", "\u01ac": "\u01ad", "\u01ae": "\u0288", "\u01af": "\u01b0", "\u01b1": "\u028a", "\u01b2": "\u028b", "\u01b3": "\u01b4", "\u01b5": "\u01b6", "\u01b7": "\u0292", "\u01b8": "\u01b9", "\u01bc": "\u01bd", "\u01c4": "\u01c6", "\u01c5": "\u01c6", "\u01c7": "\u01c9", "\u01c8": "\u01c9", "\u01ca": "\u01cc", "\u01cb": "\u01cc", "\u01cd": "\u01ce", "\u01cf": "\u01d0", "\u01d1": "\u01d2", "\u01d3": "\u01d4", "\u01d5": "\u01d6", "\u01d7": "\u01d8", "\u01d9": "\u01da", "\u01db": "\u01dc", "\u01de": "\u01df", "\u01e0": "\u01e1", "\u01e2": "\u01e3", "\u01e4": "\u01e5", "\u01e6": "\u01e7", "\u01e8": "\u01e9", "\u01ea": "\u01eb", "\u01ec": "\u01ed", "\u01ee": "\u01ef", "\u01f0": "j\u030c", "\u01f1": "\u01f3", "\u01f2": "\u01f3", "\u01f4": "\u01f5", "\u01f6": "\u0195", "\u01f7": "\u01bf", "\u01f8": "\u01f9", "\u01fa": "\u01fb", "\u01fc": "\u01fd", "\u01fe": "\u01ff", "\u0200": "\u0201", "\u0202": "\u0203", "\u0204": "\u0205", "\u0206": "\u0207", "\u0208": "\u0209", "\u020a": "\u020b", "\u020c": "\u020d", "\u020e": "\u020f", "\u0210": "\u0211", "\u0212": "\u0213", "\u0214": "\u0215", "\u0216": "\u0217", "\u0218": "\u0219", "\u021a": "\u021b", "\u021c": "\u021d", "\u021e": "\u021f", "\u0220": "\u019e", "\u0222": "\u0223", "\u0224": "\u0225", "\u0226": "\u0227", "\u0228": "\u0229", "\u022a": "\u022b", "\u022c": "\u022d", "\u022e": "\u022f", "\u0230": "\u0231", "\u0232": "\u0233", "\u023a": "\u2c65", "\u023b": "\u023c", "\u023d": "\u019a", "\u023e": "\u2c66", "\u0241": "\u0242", "\u0243": "\u0180", "\u0244": "\u0289", "\u0245": "\u028c", "\u0246": "\u0247", "\u0248": "\u0249", "\u024a": "\u024b", "\u024c": "\u024d", "\u024e": "\u024f", "\u0345": "\u03b9", "\u0370": "\u0371", "\u0372": "\u0373", "\u0376": "\u0377", "\u037f": "\u03f3", "\u0386": "\u03ac", "\u0388": "\u03ad", "\u0389": "\u03ae", "\u038a": "\u03af", "\u038c": "\u03cc", "\u038e": "\u03cd", "\u038f": "\u03ce", "\u0390": "\u03b9\u0308\u0301", "\u0391": "\u03b1", "\u0392": "\u03b2", "\u0393": "\u03b3", "\u0394": "\u03b4", "\u0395": "\u03b5", "\u0396": "\u03b6", "\u0397": "\u03b7", "\u0398": "\u03b8", "\u0399": "\u03b9", "\u039a": "\u03ba", "\u039b": "\u03bb", "\u039c": "\u03bc", "\u039d": "\u03bd", "\u039e": "\u03be", "\u039f": "\u03bf", "\u03a0": "\u03c0", "\u03a1": "\u03c1", "\u03a3": "\u03c3", "\u03a4": "\u03c4", "\u03a5": "\u03c5", "\u03a6": "\u03c6", "\u03a7": "\u03c7", "\u03a8": "\u03c8", "\u03a9": "\u03c9", "\u03aa": "\u03ca", "\u03ab": "\u03cb", "\u03b0": "\u03c5\u0308\u0301", "\u03c2": "\u03c3", "\u03cf": "\u03d7", "\u03d0": "\u03b2", "\u03d1": "\u03b8", "\u03d5": "\u03c6", "\u03d6": "\u03c0", "\u03d8": "\u03d9", "\u03da": "\u03db", "\u03dc": "\u03dd", "\u03de": "\u03df", "\u03e0": "\u03e1", "\u03e2": "\u03e3", "\u03e4": "\u03e5", "\u03e6": "\u03e7", "\u03e8": "\u03e9", "\u03ea": "\u03eb", "\u03ec": "\u03ed", "\u03ee": "\u03ef", "\u03f0": "\u03ba", "\u03f1": "\u03c1", "\u03f4": "\u03b8", "\u03f5": "\u03b5", "\u03f7": "\u03f8", "\u03f9": "\u03f2", "\u03fa": "\u03fb", "\u03fd": "\u037b", "\u03fe": "\u037c", "\u03ff": "\u037d", "\u0400": "\u0450", "\u0401": "\u0451", "\u0402": "\u0452", "\u0403": "\u0453", "\u0404": "\u0454", "\u0405": "\u0455", "\u0406": "\u0456", "\u0407": "\u0457", "\u0408": "\u0458", "\u0409": "\u0459", "\u040a": "\u045a", "\u040b": "\u045b", "\u040c": "\u045c", "\u040d": "\u045d", "\u040e": "\u045e", "\u040f": "\u045f", "\u0410": "\u0430", "\u0411": "\u0431", "\u0412": "\u0432", "\u0413": "\u0433", "\u0414": "\u0434", "\u0415": "\u0435", "\u0416": "\u0436", "\u0417": "\u0437", "\u0418": "\u0438", "\u0419": "\u0439", "\u041a": "\u043a", "\u041b": "\u043b", "\u041c": "\u043c", "\u041d": "\u043d", "\u041e": "\u043e", "\u041f": "\u043f", "\u0420": "\u0440", "\u0421": "\u0441", "\u0422": "\u0442", "\u0423": "\u0443", "\u0424": "\u0444", "\u0425": "\u0445", "\u0426": "\u0446", "\u0427": "\u0447", "\u0428": "\u0448", "\u0429": "\u0449", "\u042a": "\u044a", "\u042b": "\u044b", "\u042c": "\u044c", "\u042d": "\u044d", "\u042e": "\u044e", "\u042f": "\u044f", "\u0460": "\u0461", "\u0462": "\u0463", "\u0464": "\u0465", "\u0466": "\u0467", "\u0468": "\u0469", "\u046a": "\u046b", "\u046c": "\u046d", "\u046e": "\u046f", "\u0470": "\u0471", "\u0472": "\u0473", "\u0474": "\u0475", "\u0476": "\u0477", "\u0478": "\u0479", "\u047a": "\u047b", "\u047c": "\u047d", "\u047e": "\u047f", "\u0480": "\u0481", "\u048a": "\u048b", "\u048c": "\u048d", "\u048e": "\u048f", "\u0490": "\u0491", "\u0492": "\u0493", "\u0494": "\u0495", "\u0496": "\u0497", "\u0498": "\u0499", "\u049a": "\u049b", "\u049c": "\u049d", "\u049e": "\u049f", "\u04a0": "\u04a1", "\u04a2": "\u04a3", "\u04a4": "\u04a5", "\u04a6": "\u04a7", "\u04a8": "\u04a9", "\u04aa": "\u04ab", "\u04ac": "\u04ad", "\u04ae": "\u04af", "\u04b0": "\u04b1", "\u04b2": "\u04b3", "\u04b4": "\u04b5", "\u04b6": "\u04b7", "\u04b8": "\u04b9", "\u04ba": "\u04bb", "\u04bc": "\u04bd", "\u04be": "\u04bf", "\u04c0": "\u04cf", "\u04c1": "\u04c2", "\u04c3": "\u04c4", "\u04c5": "\u04c6", "\u04c7": "\u04c8", "\u04c9": "\u04ca", "\u04cb": "\u04cc", "\u04cd": "\u04ce", "\u04d0": "\u04d1", "\u04d2": "\u04d3", "\u04d4": "\u04d5", "\u04d6": "\u04d7", "\u04d8": "\u04d9", "\u04da": "\u04db", "\u04dc": "\u04dd", "\u04de": "\u04df", "\u04e0": "\u04e1", "\u04e2": "\u04e3", "\u04e4": "\u04e5", "\u04e6": "\u04e7", "\u04e8": "\u04e9", "\u04ea": "\u04eb", "\u04ec": "\u04ed", "\u04ee": "\u04ef", "\u04f0": "\u04f1", "\u04f2": "\u04f3", "\u04f4": "\u04f5", "\u04f6": "\u04f7", "\u04f8": "\u04f9", "\u04fa": "\u04fb", "\u04fc": "\u04fd", "\u04fe": "\u04ff", "\u0500": "\u0501", "\u0502": "\u0503", "\u0504": "\u0505", "\u0506": "\u0507", "\u0508": "\u0509", "\u050a": "\u050b", "\u050c": "\u050d", "\u050e": "\u050f", "\u0510": "\u0511", "\u0512": "\u0513", "\u0514": "\u0515", "\u0516": "\u0517", "\u0518": "\u0519", "\u051a": "\u051b", "\u051c": "\u051d", "\u051e": "\u051f", "\u0520": "\u0521", "\u0522": "\u0523", "\u0524": "\u0525", "\u0526": "\u0527", "\u0528": "\u0529", "\u052a": "\u052b", "\u052c": "\u052d", "\u052e": "\u052f", "\u0531": "\u0561", "\u0532": "\u0562", "\u0533": "\u0563", "\u0534": "\u0564", "\u0535": "\u0565", "\u0536": "\u0566", "\u0537": "\u0567", "\u0538": "\u0568", "\u0539": "\u0569", "\u053a": "\u056a", "\u053b": "\u056b", "\u053c": "\u056c", "\u053d": "\u056d", "\u053e": "\u056e", "\u053f": "\u056f", "\u0540": "\u0570", "\u0541": "\u0571", "\u0542": "\u0572", "\u0543": "\u0573", "\u0544": "\u0574", "\u0545": "\u0575", "\u0546": "\u0576", "\u0547": "\u0577", "\u0548": "\u0578", "\u0549": "\u0579", "\u054a": "\u057a", "\u054b": "\u057b", "\u054c": "\u057c", "\u054d": "\u057d", "\u054e": "\u057e", "\u054f": "\u057f", "\u0550": "\u0580", "\u0551": "\u0581", "\u0552": "\u0582", "\u0553": "\u0583", "\u0554": "\u0584", "\u0555": "\u0585", "\u0556": "\u0586", "\u0587": "\u0565\u0582", "\u10a0": "\u2d00", "\u10a1": "\u2d01", "\u10a2": "\u2d02", "\u10a3": "\u2d03", "\u10a4": "\u2d04", "\u10a5": "\u2d05", "\u10a6": "\u2d06", "\u10a7": "\u2d07", "\u10a8": "\u2d08", "\u10a9": "\u2d09", "\u10aa": "\u2d0a", "\u10ab": "\u2d0b", "\u10ac": "\u2d0c", "\u10ad": "\u2d0d", "\u10ae": "\u2d0e", "\u10af": "\u2d0f", "\u10b0": "\u2d10", "\u10b1": "\u2d11", "\u10b2": "\u2d12", "\u10b3": "\u2d13", "\u10b4": "\u2d14", "\u10b5": "\u2d15", "\u10b6": "\u2d16", "\u10b7": "\u2d17", "\u10b8": "\u2d18", "\u10b9": "\u2d19", "\u10ba": "\u2d1a", "\u10bb": "\u2d1b", "\u10bc": "\u2d1c", "\u10bd": "\u2d1d", "\u10be": "\u2d1e", "\u10bf": "\u2d1f", "\u10c0": "\u2d20", "\u10c1": "\u2d21", "\u10c2": "\u2d22", "\u10c3": "\u2d23", "\u10c4": "\u2d24", "\u10c5": "\u2d25", "\u10c7": "\u2d27", "\u10cd": "\u2d2d", "\u13f8": "\u13f0", "\u13f9": "\u13f1", "\u13fa": "\u13f2", "\u13fb": "\u13f3", "\u13fc": "\u13f4", "\u13fd": "\u13f5", "\u1c80": "\u0432", "\u1c81": "\u0434", "\u1c82": "\u043e", "\u1c83": "\u0441", "\u1c84": "\u0442", "\u1c85": "\u0442", "\u1c86": "\u044a", "\u1c87": "\u0463", "\u1c88": "\ua64b", "\u1c89": "\u1c8a", "\u1c90": "\u10d0", "\u1c91": "\u10d1", "\u1c92": "\u10d2", "\u1c93": "\u10d3", "\u1c94": "\u10d4", "\u1c95": "\u10d5", "\u1c96": "\u10d6", "\u1c97": "\u10d7", "\u1c98": "\u10d8", "\u1c99": "\u10d9", "\u1c9a": "\u10da", "\u1c9b": "\u10db", "\u1c9c": "\u10dc", "\u1c9d": "\u10dd", "\u1c9e": "\u10de", "\u1c9f": "\u10df", "\u1ca0": "\u10e0", "\u1ca1": "\u10e1", "\u1ca2": "\u10e2", "\u1ca3": "\u10e3", "\u1ca4": "\u10e4", "\u1ca5": "\u10e5", "\u1ca6": "\u10e6", "\u1ca7": "\u10e7", "\u1ca8": "\u10e8", "\u1ca9": "\u10e9", "\u1caa": "\u10ea", "\u1cab": "\u10eb", "\u1cac": "\u10ec", "\u1cad": "\u10ed", "\u1cae": "\u10ee", "\u1caf": "\u10ef", "\u1cb0": "\u10f0", "\u1cb1": "\u10f1", "\u1cb2": "\u10f2", "\u1cb3": "\u10f3", "\u1cb4": "\u10f4", "\u1cb5": "\u10f5", "\u1cb6": "\u10f6", "\u1cb7": "\u10f7", "\u1cb8": "\u10f8", "\u1cb9": "\u10f9", "\u1cba": "\u10fa", "\u1cbd": "\u10fd", "\u1cbe": "\u10fe", "\u1cbf": "\u10ff", "\u1e00": "\u1e01", "\u1e02": "\u1e03", "\u1e04": "\u1e05", "\u1e06": "\u1e07", "\u1e08": "\u1e09", "\u1e0a": "\u1e0b", "\u1e0c": "\u1e0d", "\u1e0e": "\u1e0f", "\u1e10": "\u1e11", "\u1e12": "\u1e13", "\u1e14": "\u1e15", "\u1e16": "\u1e17", "\u1e18": "\u1e19", "\u1e1a": "\u1e1b", "\u1e1c": "\u1e1d", "\u1e1e": "\u1e1f", "\u1e20": "\u1e21", "\u1e22": "\u1e23", "\u1e24": "\u1e25", "\u1e26": "\u1e27", "\u1e28": "\u1e29", "\u1e2a": "\u1e2b", "\u1e2c": "\u1e2d", "\u1e2e": "\u1e2f", "\u1e30": "\u1e31", "\u1e32": "\u1e33", "\u1e34": "\u1e35", "\u1e36": "\u1e37", "\u1e38": "\u1e39", "\u1e3a": "\u1e3b", "\u1e3c": "\u1e3d", "\u1e3e": "\u1e3f", "\u1e40": "\u1e41", "\u1e42": "\u1e43", "\u1e44": "\u1e45", "\u1e46": "\u1e47", "\u1e48": "\u1e49", "\u1e4a": "\u1e4b", "\u1e4c": "\u1e4d", "\u1e4e": "\u1e4f", "\u1e50": "\u1e51", "\u1e52": "\u1e53", "\u1e54": "\u1e55", "\u1e56": "\u1e57", "\u1e58": "\u1e59", "\u1e5a": "\u1e5b", "\u1e5c": "\u1e5d", "\u1e5e": "\u1e5f", "\u1e60": "\u1e61", "\u1e62": "\u1e63", "\u1e64": "\u1e65", "\u1e66": "\u1e67", "\u1e68": "\u1e69", "\u1e6a": "\u1e6b", "\u1e6c": "\u1e6d", "\u1e6e": "\u1e6f", "\u1e70": "\u1e71", "\u1e72": "\u1e73", "\u1e74": "\u1e75", "\u1e76": "\u1e77", "\u1e78": "\u1e79", "\u1e7a": "\u1e7b", "\u1e7c": "\u1e7d", "\u1e7e": "\u1e7f", "\u1e80": "\u1e81", "\u1e82": "\u1e83", "\u1e84": "\u1e85", "\u1e86": "\u1e87", "\u1e88": "\u1e89", "\u1e8a": "\u1e8b", "\u1e8c": "\u1e8d", "\u1e8e": "\u1e8f", "\u1e90": "\u1e91", "\u1e92": "\u1e93", "\u1e94": "\u1e95", "\u1e96": "h\u0331", "\u1e97": "t\u0308", "\u1e98": "w\u030a", "\u1e99": "y\u030a", "\u1e9a": "a\u02be", "\u1e9b": "\u1e61", "\u1e9e": "ss", "\u1ea0": "\u1ea1", "\u1ea2": "\u1ea3", "\u1ea4": "\u1ea5", "\u1ea6": "\u1ea7", "\u1ea8": "\u1ea9", "\u1eaa": "\u1eab", "\u1eac": "\u1ead", "\u1eae": "\u1eaf", "\u1eb0": "\u1eb1", "\u1eb2": "\u1eb3", "\u1eb4": "\u1eb5", "\u1eb6": "\u1eb7", "\u1eb8": "\u1eb9", "\u1eba": "\u1ebb", "\u1ebc": "\u1ebd", "\u1ebe": "\u1ebf", "\u1ec0": "\u1ec1", "\u1ec2": "\u1ec3", "\u1ec4": "\u1ec5", "\u1ec6": "\u1ec7", "\u1ec8": "\u1ec9", "\u1eca": "\u1ecb", "\u1ecc": "\u1ecd", "\u1ece": "\u1ecf", "\u1ed0": "\u1ed1", "\u1ed2": "\u1ed3", "\u1ed4": "\u1ed5", "\u1ed6": "\u1ed7", "\u1ed8": "\u1ed9", "\u1eda": "\u1edb", "\u1edc": "\u1edd", "\u1ede": "\u1edf", "\u1ee0": "\u1ee1", "\u1ee2": "\u1ee3", "\u1ee4": "\u1ee5", "\u1ee6": "\u1ee7", "\u1ee8": "\u1ee9", "\u1eea": "\u1eeb", "\u1eec": "\u1eed", "\u1eee": "\u1eef", "\u1ef0": "\u1ef1", "\u1ef2": "\u1ef3", "\u1ef4": "\u1ef5", "\u1ef6": "\u1ef7", "\u1ef8": "\u1ef9", "\u1efa": "\u1efb", "\u1efc": "\u1efd", "\u1efe": "\u1eff", "\u1f08": "\u1f00", "\u1f09": "\u1f01", "\u1f0a": "\u1f02", "\u1f0b": "\u1f03", "\u1f0c": "\u1f04", "\u1f0d": "\u1f05", "\u1f0e": "\u1f06", "\u1f0f": "\u1f07", "\u1f18": "\u1f10", "\u1f19": "\u1f11", "\u1f1a": "\u1f12", "\u1f1b": "\u1f13", "\u1f1c": "\u1f14", "\u1f1d": "\u1f15", "\u1f28": "\u1f20", "\u1f29": "\u1f21", "\u1f2a": "\u1f22", "\u1f2b": "\u1f23", "\u1f2c": "\u1f24", "\u1f2d": "\u1f25", "\u1f2e": "\u1f26", "\u1f2f": "\u1f27", "\u1f38": "\u1f30", "\u1f39": "\u1f31", "\u1f3a": "\u1f32", "\u1f3b": "\u1f33", "\u1f3c": "\u1f34", "\u1f3d": "\u1f35", "\u1f3e": "\u1f36", "\u1f3f": "\u1f37", "\u1f48": "\u1f40", "\u1f49": "\u1f41", "\u1f4a": "\u1f42", "\u1f4b": "\u1f43", "\u1f4c": "\u1f44", "\u1f4d": "\u1f45", "\u1f50": "\u03c5\u0313", "\u1f52": "\u03c5\u0313\u0300", "\u1f54": "\u03c5\u0313\u0301", "\u1f56": "\u03c5\u0313\u0342", "\u1f59": "\u1f51", "\u1f5b": "\u1f53", "\u1f5d": "\u1f55", "\u1f5f": "\u1f57", "\u1f68": "\u1f60", "\u1f69": "\u1f61", "\u1f6a": "\u1f62", "\u1f6b": "\u1f63", "\u1f6c": "\u1f64", "\u1f6d": "\u1f65", "\u1f6e": "\u1f66", "\u1f6f": "\u1f67", "\u1f80": "\u1f00\u03b9", "\u1f81": "\u1f01\u03b9", "\u1f82": "\u1f02\u03b9", "\u1f83": "\u1f03\u03b9", "\u1f84": "\u1f04\u03b9", "\u1f85": "\u1f05\u03b9", "\u1f86": "\u1f06\u03b9", "\u1f87": "\u1f07\u03b9", "\u1f88": "\u1f00\u03b9", "\u1f89": "\u1f01\u03b9", "\u1f8a": "\u1f02\u03b9", "\u1f8b": "\u1f03\u03b9", "\u1f8c": "\u1f04\u03b9", "\u1f8d": "\u1f05\u03b9", "\u1f8e": "\u1f06\u03b9", "\u1f8f": "\u1f07\u03b9", "\u1f90": "\u1f20\u03b9", "\u1f91": "\u1f21\u03b9", "\u1f92": "\u1f22\u03b9", "\u1f93": "\u1f23\u03b9", "\u1f94": "\u1f24\u03b9", "\u1f95": "\u1f25\u03b9", "\u1f96": "\u1f26\u03b9", "\u1f97": "\u1f27\u03b9", "\u1f98": "\u1f20\u03b9", "\u1f99": "\u1f21\u03b9", "\u1f9a": "\u1f22\u03b9", "\u1f9b": "\u1f23\u03b9", "\u1f9c": "\u1f24\u03b9", "\u1f9d": "\u1f25\u03b9", "\u1f9e": "\u1f26\u03b9", "\u1f9f": "\u1f27\u03b9", "\u1fa0": "\u1f60\u03b9", "\u1fa1": "\u1f61\u03b9", "\u1fa2": "\u1f62\u03b9", "\u1fa3": "\u1f63\u03b9", "\u1fa4": "\u1f64\u03b9", "\u1fa5": "\u1f65\u03b9", "\u1fa6": "\u1f66\u03b9", "\u1fa7": "\u1f67\u03b9", "\u1fa8": "\u1f60\u03b9", "\u1fa9": "\u1f61\u03b9", "\u1faa": "\u1f62\u03b9", "\u1fab": "\u1f63\u03b9", "\u1fac": "\u1f64\u03b9", "\u1fad": "\u1f65\u03b9", "\u1fae": "\u1f66\u03b9", "\u1faf": "\u1f67\u03b9", "\u1fb2": "\u1f70\u03b9", "\u1fb3": "\u03b1\u03b9", "\u1fb4": "\u03ac\u03b9", "\u1fb6": "\u03b1\u0342", "\u1fb7": "\u03b1\u0342\u03b9", "\u1fb8": "\u1fb0", "\u1fb9": "\u1fb1", "\u1fba": "\u1f70", "\u1fbb": "\u1f71", "\u1fbc": "\u03b1\u03b9", "\u1fbe": "\u03b9", "\u1fc2": "\u1f74\u03b9", "\u1fc3": "\u03b7\u03b9", "\u1fc4": "\u03ae\u03b9", "\u1fc6": "\u03b7\u0342", "\u1fc7": "\u03b7\u0342\u03b9", "\u1fc8": "\u1f72", "\u1fc9": "\u1f73", "\u1fca": "\u1f74", "\u1fcb": "\u1f75", "\u1fcc": "\u03b7\u03b9", "\u1fd2": "\u03b9\u0308\u0300", "\u1fd3": "\u03b9\u0308\u0301", "\u1fd6": "\u03b9\u0342", "\u1fd7": "\u03b9\u0308\u0342", "\u1fd8": "\u1fd0", "\u1fd9": "\u1fd1", "\u1fda": "\u1f76", "\u1fdb": "\u1f77", "\u1fe2": "\u03c5\u0308\u0300", "\u1fe3": "\u03c5\u0308\u0301", "\u1fe4": "\u03c1\u0313", "\u1fe6": "\u03c5\u0342", "\u1fe7": "\u03c5\u0308\u0342", "\u1fe8": "\u1fe0", "\u1fe9": "\u1fe1", "\u1fea": "\u1f7a", "\u1feb": "\u1f7b", "\u1fec": "\u1fe5", "\u1ff2": "\u1f7c\u03b9", "\u1ff3": "\u03c9\u03b9", "\u1ff4": "\u03ce\u03b9", "\u1ff6": "\u03c9\u0342", "\u1ff7": "\u03c9\u0342\u03b9", "\u1ff8": "\u1f78", "\u1ff9": "\u1f79", "\u1ffa": "\u1f7c", "\u1ffb": "\u1f7d", "\u1ffc": "\u03c9\u03b9", "\u2126": "\u03c9", "\u212a": "k", "\u212b": "\u00e5", "\u2132": "\u214e", "\u2160": "\u2170", "\u2161": "\u2171", "\u2162": "\u2172", "\u2163": "\u2173", "\u2164": "\u2174", "\u2165": "\u2175", "\u2166": "\u2176", "\u2167": "\u2177", "\u2168": "\u2178", "\u2169": "\u2179", "\u216a": "\u217a", "\u216b": "\u217b", "\u216c": "\u217c", "\u216d": "\u217d", "\u216e": "\u217e", "\u216f": "\u217f", "\u2183": "\u2184", "\u24b6": "\u24d0", "\u24b7": "\u24d1", "\u24b8": "\u24d2", "\u24b9": "\u24d3", "\u24ba": "\u24d4", "\u24bb": "\u24d5", "\u24bc": "\u24d6", "\u24bd": "\u24d7", "\u24be": "\u24d8", "\u24bf": "\u24d9", "\u24c0": "\u24da", "\u24c1": "\u24db", "\u24c2": "\u24dc", "\u24c3": "\u24dd", "\u24c4": "\u24de", "\u24c5": "\u24df", "\u24c6": "\u24e0", "\u24c7": "\u24e1", "\u24c8": "\u24e2", "\u24c9": "\u24e3", "\u24ca": "\u24e4", "\u24cb": "\u24e5", "\u24cc": "\u24e6", "\u24cd": "\u24e7", "\u24ce": "\u24e8", "\u24cf": "\u24e9", "\u2c00": "\u2c30", "\u2c01": "\u2c31", "\u2c02": "\u2c32", "\u2c03": "\u2c33", "\u2c04": "\u2c34", "\u2c05": "\u2c35", "\u2c06": "\u2c36", "\u2c07": "\u2c37", "\u2c08": "\u2c38", "\u2c09": "\u2c39", "\u2c0a": "\u2c3a", "\u2c0b": "\u2c3b", "\u2c0c": "\u2c3c", "\u2c0d": "\u2c3d", "\u2c0e": "\u2c3e", "\u2c0f": "\u2c3f", "\u2c10": "\u2c40", "\u2c11": "\u2c41", "\u2c12": "\u2c42", "\u2c13": "\u2c43", "\u2c14": "\u2c44", "\u2c15": "\u2c45", "\u2c16": "\u2c46", "\u2c17": "\u2c47", "\u2c18": "\u2c48", "\u2c19": "\u2c49", "\u2c1a": "\u2c4a", "\u2c1b": "\u2c4b", "\u2c1c": "\u2c4c", "\u2c1d": "\u2c4d", "\u2c1e": "\u2c4e", "\u2c1f": "\u2c4f", "\u2c20": "\u2c50", "\u2c21": "\u2c51", "\u2c22": "\u2c52", "\u2c23": "\u2c53", "\u2c24": "\u2c54", "\u2c25": "\u2c55", "\u2c26": "\u2c56", "\u2c27": "\u2c57", "\u2c28": "\u2c58", "\u2c29": "\u2c59", "\u2c2a": "\u2c5a", "\u2c2b": "\u2c5b", "\u2c2c": "\u2c5c", "\u2c2d": "\u2c5d", "\u2c2e": "\u2c5e", "\u2c2f": "\u2c5f", "\u2c60": "\u2c61", "\u2c62": "\u026b", "\u2c63": "\u1d7d", "\u2c64": "\u027d", "\u2c67": "\u2c68", "\u2c69": "\u2c6a", "\u2c6b": "\u2c6c", "\u2c6d": "\u0251", "\u2c6e": "\u0271", "\u2c6f": "\u0250", "\u2c70": "\u0252", "\u2c72": "\u2c73", "\u2c75": "\u2c76", "\u2c7e": "\u023f", "\u2c7f": "\u0240", "\u2c80": "\u2c81", "\u2c82": "\u2c83", "\u2c84": "\u2c85", "\u2c86": "\u2c87", "\u2c88": "\u2c89", "\u2c8a": "\u2c8b", "\u2c8c": "\u2c8d", "\u2c8e": "\u2c8f", "\u2c90": "\u2c91", "\u2c92": "\u2c93", "\u2c94": "\u2c95", "\u2c96": "\u2c97", "\u2c98": "\u2c99", "\u2c9a": "\u2c9b", "\u2c9c": "\u2c9d", "\u2c9e": "\u2c9f", "\u2ca0": "\u2ca1", "\u2ca2": "\u2ca3", "\u2ca4": "\u2ca5", "\u2ca6": "\u2ca7", "\u2ca8": "\u2ca9", "\u2caa": "\u2cab", "\u2cac": "\u2cad", "\u2cae": "\u2caf", "\u2cb0": "\u2cb1", "\u2cb2": "\u2cb3", "\u2cb4": "\u2cb5", "\u2cb6": "\u2cb7", "\u2cb8": "\u2cb9", "\u2cba": "\u2cbb", "\u2cbc": "\u2cbd", "\u2cbe": "\u2cbf", "\u2cc0": "\u2cc1", "\u2cc2": "\u2cc3", "\u2cc4": "\u2cc5", "\u2cc6": "\u2cc7", "\u2cc8": "\u2cc9", "\u2cca": "\u2ccb", "\u2ccc": "\u2ccd", "\u2cce": "\u2ccf", "\u2cd0": "\u2cd1", "\u2cd2": "\u2cd3", "\u2cd4": "\u2cd5", "\u2cd6": "\u2cd7", "\u2cd8": "\u2cd9", "\u2cda": "\u2cdb", "\u2cdc": "\u2cdd", "\u2cde": "\u2cdf", "\u2ce0": "\u2ce1", "\u2ce2": "\u2ce3", "\u2ceb": "\u2cec", "\u2ced": "\u2cee", "\u2cf2": "\u2cf3", "\ua640": "\ua641", "\ua642": "\ua643", "\ua644": "\ua645", "\ua646": "\ua647", "\ua648": "\ua649", "\ua64a": "\ua64b", "\ua64c": "\ua64d", "\ua64e": "\ua64f", "\ua650": "\ua651", "\ua652": "\ua653", "\ua654": "\ua655", "\ua656": "\ua657", "\ua658": "\ua659", "\ua65a": "\ua65b", "\ua65c": "\ua65d", "\ua65e": "\ua65f", "\ua660": "\ua661", "\ua662": "\ua663", "\ua664": "\ua665", "\ua666": "\ua667", "\ua668": "\ua669", "\ua66a": "\ua66b", "\ua66c": "\ua66d", "\ua680": "\ua681", "\ua682": "\ua683", "\ua684": "\ua685", "\ua686": "\ua687", "\ua688": "\ua689", "\ua68a": "\ua68b", "\ua68c": "\ua68d", "\ua68e": "\ua68f", "\ua690": "\ua691", "\ua692": "\ua693", "\ua694": "\ua695", "\ua696": "\ua697", "\ua698": "\ua699", "\ua69a": "\ua69b", "\ua722": "\ua723", "\ua724": "\ua725", "\ua726": "\ua727", "\ua728": "\ua729", "\ua72a": "\ua72b", "\ua72c": "\ua72d", "\ua72e": "\ua72f", "\ua732": "\ua733", "\ua734": "\ua735", "\ua736": "\ua737", "\ua738": "\ua739", "\ua73a": "\ua73b", "\ua73c": "\ua73d", "\ua73e": "\ua73f", "\ua740": "\ua741", "\ua742": "\ua743", "\ua744": "\ua745", "\ua746": "\ua747", "\ua748": "\ua749", "\ua74a": "\ua74b", "\ua74c": "\ua74d", "\ua74e": "\ua74f", "\ua750": "\ua751", "\ua752": "\ua753", "\ua754": "\ua755", "\ua756": "\ua757", "\ua758": "\ua759", "\ua75a": "\ua75b", "\ua75c": "\ua75d", "\ua75e": "\ua75f", "\ua760": "\ua761", "\ua762": "\ua763", "\ua764": "\ua765", "\ua766": "\ua767", "\ua768": "\ua769", "\ua76a": "\ua76b", "\ua76c": "\ua76d", "\ua76e": "\ua76f", "\ua779": "\ua77a", "\ua77b": "\ua77c", "\ua77d": "\u1d79", "\ua77e": "\ua77f", "\ua780": "\ua781", "\ua782": "\ua783", "\ua784": "\ua785", "\ua786": "\ua787", "\ua78b": "\ua78c", "\ua78d": "\u0265", "\ua790": "\ua791", "\ua792": "\ua793", "\ua796": "\ua797", "\ua798": "\ua799", "\ua79a": "\ua79b", "\ua79c": "\ua79d", "\ua79e": "\ua79f", "\ua7a0": "\ua7a1", "\ua7a2": "\ua7a3", "\ua7a4": "\ua7a5", "\ua7a6": "\ua7a7", "\ua7a8": "\ua7a9", "\ua7aa": "\u0266", "\ua7ab": "\u025c", "\ua7ac": "\u0261", "\ua7ad": "\u026c", "\ua7ae": "\u026a", "\ua7b0": "\u029e", "\ua7b1": "\u0287", "\ua7b2": "\u029d", "\ua7b3": "\uab53", "\ua7b4": "\ua7b5", "\ua7b6": "\ua7b7", "\ua7b8": "\ua7b9", "\ua7ba": "\ua7bb", "\ua7bc": "\ua7bd", "\ua7be": "\ua7bf", "\ua7c0": "\ua7c1", "\ua7c2": "\ua7c3", "\ua7c4": "\ua794", "\ua7c5": "\u0282", "\ua7c6": "\u1d8e", "\ua7c7": "\ua7c8", "\ua7c9": "\ua7ca", "\ua7cb": "\u0264", "\ua7cc": "\ua7cd", "\ua7ce": "\ua7cf", "\ua7d0": "\ua7d1", "\ua7d2": "\ua7d3", "\ua7d4": "\ua7d5", "\ua7d6": "\ua7d7", "\ua7d8": "\ua7d9", "\ua7da": "\ua7db", "\ua7dc": "\u019b", "\ua7f5": "\ua7f6", "\uab70": "\u13a0", "\uab71": "\u13a1", "\uab72": "\u13a2", "\uab73": "\u13a3", "\uab74": "\u13a4", "\uab75": "\u13a5", "\uab76": "\u13a6", "\uab77": "\u13a7", "\uab78": "\u13a8", "\uab79": "\u13a9", "\uab7a": "\u13aa", "\uab7b": "\u13ab", "\uab7c": "\u13ac", "\uab7d": "\u13ad", "\uab7e": "\u13ae", "\uab7f": "\u13af", "\uab80": "\u13b0", "\uab81": "\u13b1", "\uab82": "\u13b2", "\uab83": "\u13b3", "\uab84": "\u13b4", "\uab85": "\u13b5", "\uab86": "\u13b6", "\uab87": "\u13b7", "\uab88": "\u13b8", "\uab89": "\u13b9", "\uab8a": "\u13ba", "\uab8b": "\u13bb", "\uab8c": "\u13bc", "\uab8d": "\u13bd", "\uab8e": "\u13be", "\uab8f": "\u13bf", "\uab90": "\u13c0", "\uab91": "\u13c1", "\uab92": "\u13c2", "\uab93": "\u13c3", "\uab94": "\u13c4", "\uab95": "\u13c5", "\uab96": "\u13c6", "\uab97": "\u13c7", "\uab98": "\u13c8", "\uab99": "\u13c9", "\uab9a": "\u13ca", "\uab9b": "\u13cb", "\uab9c": "\u13cc", "\uab9d": "\u13cd", "\uab9e": "\u13ce", "\uab9f": "\u13cf", "\uaba0": "\u13d0", "\uaba1": "\u13d1", "\uaba2": "\u13d2", "\uaba3": "\u13d3", "\uaba4": "\u13d4", "\uaba5": "\u13d5", "\uaba6": "\u13d6", "\uaba7": "\u13d7", "\uaba8": "\u13d8", "\uaba9": "\u13d9", "\uabaa": "\u13da", "\uabab": "\u13db", "\uabac": "\u13dc", "\uabad": "\u13dd", "\uabae": "\u13de", "\uabaf": "\u13df", "\uabb0": "\u13e0", "\uabb1": "\u13e1", "\uabb2": "\u13e2", "\uabb3": "\u13e3", "\uabb4": "\u13e4", "\uabb5": "\u13e5", "\uabb6": "\u13e6", "\uabb7": "\u13e7", "\uabb8": "\u13e8", "\uabb9": "\u13e9", "\uabba": "\u13ea", "\uabbb": "\u13eb", "\uabbc": "\u13ec", "\uabbd": "\u13ed", "\uabbe": "\u13ee", "\uabbf": "\u13ef", "\ufb00": "ff", "\ufb01": "fi", "\ufb02": "fl", "\ufb03": "ffi", "\ufb04": "ffl", "\ufb05": "st", "\ufb06": "st", "\ufb13": "\u0574\u0576", "\ufb14": "\u0574\u0565", "\ufb15": "\u0574\u056b", "\ufb16": "\u057e\u0576", "\ufb17": "\u0574\u056d", "\uff21": "\uff41", "\uff22": "\uff42", "\uff23": "\uff43", "\uff24": "\uff44", "\uff25": "\uff45", "\uff26": "\uff46", "\uff27": "\uff47", "\uff28": "\uff48", "\uff29": "\uff49", "\uff2a": "\uff4a", "\uff2b": "\uff4b", "\uff2c": "\uff4c", "\uff2d": "\uff4d", "\uff2e": "\uff4e", "\uff2f": "\uff4f", "\uff30": "\uff50", "\uff31": "\uff51", "\uff32": "\uff52", "\uff33": "\uff53", "\uff34": "\uff54", "\uff35": "\uff55", "\uff36": "\uff56", "\uff37": "\uff57", "\uff38": "\uff58", "\uff39": "\uff59", "\uff3a": "\uff5a", "\ud801\udc00": "\ud801\udc28", "\ud801\udc01": "\ud801\udc29", "\ud801\udc02": "\ud801\udc2a", "\ud801\udc03": "\ud801\udc2b", "\ud801\udc04": "\ud801\udc2c", "\ud801\udc05": "\ud801\udc2d", "\ud801\udc06": "\ud801\udc2e", "\ud801\udc07": "\ud801\udc2f", "\ud801\udc08": "\ud801\udc30", "\ud801\udc09": "\ud801\udc31", "\ud801\udc0a": "\ud801\udc32", "\ud801\udc0b": "\ud801\udc33", "\ud801\udc0c": "\ud801\udc34", "\ud801\udc0d": "\ud801\udc35", "\ud801\udc0e": "\ud801\udc36", "\ud801\udc0f": "\ud801\udc37", "\ud801\udc10": "\ud801\udc38", "\ud801\udc11": "\ud801\udc39", "\ud801\udc12": "\ud801\udc3a", "\ud801\udc13": "\ud801\udc3b", "\ud801\udc14": "\ud801\udc3c", "\ud801\udc15": "\ud801\udc3d", "\ud801\udc16": "\ud801\udc3e", "\ud801\udc17": "\ud801\udc3f", "\ud801\udc18": "\ud801\udc40", "\ud801\udc19": "\ud801\udc41", "\ud801\udc1a": "\ud801\udc42", "\ud801\udc1b": "\ud801\udc43", "\ud801\udc1c": "\ud801\udc44", "\ud801\udc1d": "\ud801\udc45", "\ud801\udc1e": "\ud801\udc46", "\ud801\udc1f": "\ud801\udc47", "\ud801\udc20": "\ud801\udc48", "\ud801\udc21": "\ud801\udc49", "\ud801\udc22": "\ud801\udc4a", "\ud801\udc23": "\ud801\udc4b", "\ud801\udc24": "\ud801\udc4c", "\ud801\udc25": "\ud801\udc4d", "\ud801\udc26": "\ud801\udc4e", "\ud801\udc27": "\ud801\udc4f", "\ud801\udcb0": "\ud801\udcd8", "\ud801\udcb1": "\ud801\udcd9", "\ud801\udcb2": "\ud801\udcda", "\ud801\udcb3": "\ud801\udcdb", "\ud801\udcb4": "\ud801\udcdc", "\ud801\udcb5": "\ud801\udcdd", "\ud801\udcb6": "\ud801\udcde", "\ud801\udcb7": "\ud801\udcdf", "\ud801\udcb8": "\ud801\udce0", "\ud801\udcb9": "\ud801\udce1", "\ud801\udcba": "\ud801\udce2", "\ud801\udcbb": "\ud801\udce3", "\ud801\udcbc": "\ud801\udce4", "\ud801\udcbd": "\ud801\udce5", "\ud801\udcbe": "\ud801\udce6", "\ud801\udcbf": "\ud801\udce7", "\ud801\udcc0": "\ud801\udce8", "\ud801\udcc1": "\ud801\udce9", "\ud801\udcc2": "\ud801\udcea", "\ud801\udcc3": "\ud801\udceb", "\ud801\udcc4": "\ud801\udcec", "\ud801\udcc5": "\ud801\udced", "\ud801\udcc6": "\ud801\udcee", "\ud801\udcc7": "\ud801\udcef", "\ud801\udcc8": "\ud801\udcf0", "\ud801\udcc9": "\ud801\udcf1", "\ud801\udcca": "\ud801\udcf2", "\ud801\udccb": "\ud801\udcf3", "\ud801\udccc": "\ud801\udcf4", "\ud801\udccd": "\ud801\udcf5", "\ud801\udcce": "\ud801\udcf6", "\ud801\udccf": "\ud801\udcf7", "\ud801\udcd0": "\ud801\udcf8", "\ud801\udcd1": "\ud801\udcf9", "\ud801\udcd2": "\ud801\udcfa", "\ud801\udcd3": "\ud801\udcfb", "\ud801\udd70": "\ud801\udd97", "\ud801\udd71": "\ud801\udd98", "\ud801\udd72": "\ud801\udd99", "\ud801\udd73": "\ud801\udd9a", "\ud801\udd74": "\ud801\udd9b", "\ud801\udd75": "\ud801\udd9c", "\ud801\udd76": "\ud801\udd9d", "\ud801\udd77": "\ud801\udd9e", "\ud801\udd78": "\ud801\udd9f", "\ud801\udd79": "\ud801\udda0", "\ud801\udd7a": "\ud801\udda1", "\ud801\udd7c": "\ud801\udda3", "\ud801\udd7d": "\ud801\udda4", "\ud801\udd7e": "\ud801\udda5", "\ud801\udd7f": "\ud801\udda6", "\ud801\udd80": "\ud801\udda7", "\ud801\udd81": "\ud801\udda8", "\ud801\udd82": "\ud801\udda9", "\ud801\udd83": "\ud801\uddaa", "\ud801\udd84": "\ud801\uddab", "\ud801\udd85": "\ud801\uddac", "\ud801\udd86": "\ud801\uddad", "\ud801\udd87": "\ud801\uddae", "\ud801\udd88": "\ud801\uddaf", "\ud801\udd89": "\ud801\uddb0", "\ud801\udd8a": "\ud801\uddb1", "\ud801\udd8c": "\ud801\uddb3", "\ud801\udd8d": "\ud801\uddb4", "\ud801\udd8e": "\ud801\uddb5", "\ud801\udd8f": "\ud801\uddb6", "\ud801\udd90": "\ud801\uddb7", "\ud801\udd91": "\ud801\uddb8", "\ud801\udd92": "\ud801\uddb9", "\ud801\udd94": "\ud801\uddbb", "\ud801\udd95": "\ud801\uddbc", "\ud803\udc80": "\ud803\udcc0", "\ud803\udc81": "\ud803\udcc1", "\ud803\udc82": "\ud803\udcc2", "\ud803\udc83": "\ud803\udcc3", "\ud803\udc84": "\ud803\udcc4", "\ud803\udc85": "\ud803\udcc5", "\ud803\udc86": "\ud803\udcc6", "\ud803\udc87": "\ud803\udcc7", "\ud803\udc88": "\ud803\udcc8", "\ud803\udc89": "\ud803\udcc9", "\ud803\udc8a": "\ud803\udcca", "\ud803\udc8b": "\ud803\udccb", "\ud803\udc8c": "\ud803\udccc", "\ud803\udc8d": "\ud803\udccd", "\ud803\udc8e": "\ud803\udcce", "\ud803\udc8f": "\ud803\udccf", "\ud803\udc90": "\ud803\udcd0", "\ud803\udc91": "\ud803\udcd1", "\ud803\udc92": "\ud803\udcd2", "\ud803\udc93": "\ud803\udcd3", "\ud803\udc94": "\ud803\udcd4", "\ud803\udc95": "\ud803\udcd5", "\ud803\udc96": "\ud803\udcd6", "\ud803\udc97": "\ud803\udcd7", "\ud803\udc98": "\ud803\udcd8", "\ud803\udc99": "\ud803\udcd9", "\ud803\udc9a": "\ud803\udcda", "\ud803\udc9b": "\ud803\udcdb", "\ud803\udc9c": "\ud803\udcdc", "\ud803\udc9d": "\ud803\udcdd", "\ud803\udc9e": "\ud803\udcde", "\ud803\udc9f": "\ud803\udcdf", "\ud803\udca0": "\ud803\udce0", "\ud803\udca1": "\ud803\udce1", "\ud803\udca2": "\ud803\udce2", "\ud803\udca3": "\ud803\udce3", "\ud803\udca4": "\ud803\udce4", "\ud803\udca5": "\ud803\udce5", "\ud803\udca6": "\ud803\udce6", "\ud803\udca7": "\ud803\udce7", "\ud803\udca8": "\ud803\udce8", "\ud803\udca9": "\ud803\udce9", "\ud803\udcaa": "\ud803\udcea", "\ud803\udcab": "\ud803\udceb", "\ud803\udcac": "\ud803\udcec", "\ud803\udcad": "\ud803\udced", "\ud803\udcae": "\ud803\udcee", "\ud803\udcaf": "\ud803\udcef", "\ud803\udcb0": "\ud803\udcf0", "\ud803\udcb1": "\ud803\udcf1", "\ud803\udcb2": "\ud803\udcf2", "\ud803\udd50": "\ud803\udd70", "\ud803\udd51": "\ud803\udd71", "\ud803\udd52": "\ud803\udd72", "\ud803\udd53": "\ud803\udd73", "\ud803\udd54": "\ud803\udd74", "\ud803\udd55": "\ud803\udd75", "\ud803\udd56": "\ud803\udd76", "\ud803\udd57": "\ud803\udd77", "\ud803\udd58": "\ud803\udd78", "\ud803\udd59": "\ud803\udd79", "\ud803\udd5a": "\ud803\udd7a", "\ud803\udd5b": "\ud803\udd7b", "\ud803\udd5c": "\ud803\udd7c", "\ud803\udd5d": "\ud803\udd7d", "\ud803\udd5e": "\ud803\udd7e", "\ud803\udd5f": "\ud803\udd7f", "\ud803\udd60": "\ud803\udd80", "\ud803\udd61": "\ud803\udd81", "\ud803\udd62": "\ud803\udd82", "\ud803\udd63": "\ud803\udd83", "\ud803\udd64": "\ud803\udd84", "\ud803\udd65": "\ud803\udd85", "\ud806\udca0": "\ud806\udcc0", "\ud806\udca1": "\ud806\udcc1", "\ud806\udca2": "\ud806\udcc2", "\ud806\udca3": "\ud806\udcc3", "\ud806\udca4": "\ud806\udcc4", "\ud806\udca5": "\ud806\udcc5", "\ud806\udca6": "\ud806\udcc6", "\ud806\udca7": "\ud806\udcc7", "\ud806\udca8": "\ud806\udcc8", "\ud806\udca9": "\ud806\udcc9", "\ud806\udcaa": "\ud806\udcca", "\ud806\udcab": "\ud806\udccb", "\ud806\udcac": "\ud806\udccc", "\ud806\udcad": "\ud806\udccd", "\ud806\udcae": "\ud806\udcce", "\ud806\udcaf": "\ud806\udccf", "\ud806\udcb0": "\ud806\udcd0", "\ud806\udcb1": "\ud806\udcd1", "\ud806\udcb2": "\ud806\udcd2", "\ud806\udcb3": "\ud806\udcd3", "\ud806\udcb4": "\ud806\udcd4", "\ud806\udcb5": "\ud806\udcd5", "\ud806\udcb6": "\ud806\udcd6", "\ud806\udcb7": "\ud806\udcd7", "\ud806\udcb8": "\ud806\udcd8", "\ud806\udcb9": "\ud806\udcd9", "\ud806\udcba": "\ud806\udcda", "\ud806\udcbb": "\ud806\udcdb", "\ud806\udcbc": "\ud806\udcdc", "\ud806\udcbd": "\ud806\udcdd", "\ud806\udcbe": "\ud806\udcde", "\ud806\udcbf": "\ud806\udcdf", "\ud81b\ude40": "\ud81b\ude60", "\ud81b\ude41": "\ud81b\ude61", "\ud81b\ude42": "\ud81b\ude62", "\ud81b\ude43": "\ud81b\ude63", "\ud81b\ude44": "\ud81b\ude64", "\ud81b\ude45": "\ud81b\ude65", "\ud81b\ude46": "\ud81b\ude66", "\ud81b\ude47": "\ud81b\ude67", "\ud81b\ude48": "\ud81b\ude68", "\ud81b\ude49": "\ud81b\ude69", "\ud81b\ude4a": "\ud81b\ude6a", "\ud81b\ude4b": "\ud81b\ude6b", "\ud81b\ude4c": "\ud81b\ude6c", "\ud81b\ude4d": "\ud81b\ude6d", "\ud81b\ude4e": "\ud81b\ude6e", "\ud81b\ude4f": "\ud81b\ude6f", "\ud81b\ude50": "\ud81b\ude70", "\ud81b\ude51": "\ud81b\ude71", "\ud81b\ude52": "\ud81b\ude72", "\ud81b\ude53": "\ud81b\ude73", "\ud81b\ude54": "\ud81b\ude74", "\ud81b\ude55": "\ud81b\ude75", "\ud81b\ude56": "\ud81b\ude76", "\ud81b\ude57": "\ud81b\ude77", "\ud81b\ude58": "\ud81b\ude78", "\ud81b\ude59": "\ud81b\ude79", "\ud81b\ude5a": "\ud81b\ude7a", "\ud81b\ude5b": "\ud81b\ude7b", "\ud81b\ude5c": "\ud81b\ude7c", "\ud81b\ude5d": "\ud81b\ude7d", "\ud81b\ude5e": "\ud81b\ude7e", "\ud81b\ude5f": "\ud81b\ude7f", "\ud81b\udea0": "\ud81b\udebb", "\ud81b\udea1": "\ud81b\udebc", "\ud81b\udea2": "\ud81b\udebd", "\ud81b\udea3": "\ud81b\udebe", "\ud81b\udea4": "\ud81b\udebf", "\ud81b\udea5": "\ud81b\udec0", "\ud81b\udea6": "\ud81b\udec1", "\ud81b\udea7": "\ud81b\udec2", "\ud81b\udea8": "\ud81b\udec3", "\ud81b\udea9": "\ud81b\udec4", "\ud81b\udeaa": "\ud81b\udec5", "\ud81b\udeab": "\ud81b\udec6", "\ud81b\udeac": "\ud81b\udec7", "\ud81b\udead": "\ud81b\udec8", "\ud81b\udeae": "\ud81b\udec9", "\ud81b\udeaf": "\ud81b\udeca", "\ud81b\udeb0": "\ud81b\udecb", "\ud81b\udeb1": "\ud81b\udecc", "\ud81b\udeb2": "\ud81b\udecd", "\ud81b\udeb3": "\ud81b\udece", "\ud81b\udeb4": "\ud81b\udecf", "\ud81b\udeb5": "\ud81b\uded0", "\ud81b\udeb6": "\ud81b\uded1", "\ud81b\udeb7": "\ud81b\uded2", "\ud81b\udeb8": "\ud81b\uded3", "\ud83a\udd00": "\ud83a\udd22", "\ud83a\udd01": "\ud83a\udd23", "\ud83a\udd02": "\ud83a\udd24", "\ud83a\udd03": "\ud83a\udd25", "\ud83a\udd04": "\ud83a\udd26", "\ud83a\udd05": "\ud83a\udd27", "\ud83a\udd06": "\ud83a\udd28", "\ud83a\udd07": "\ud83a\udd29", "\ud83a\udd08": "\ud83a\udd2a", "\ud83a\udd09": "\ud83a\udd2b", "\ud83a\udd0a": "\ud83a\udd2c", "\ud83a\udd0b": "\ud83a\udd2d", "\ud83a\udd0c": "\ud83a\udd2e", "\ud83a\udd0d": "\ud83a\udd2f", "\ud83a\udd0e": "\ud83a\udd30", "\ud83a\udd0f": "\ud83a\udd31", "\ud83a\udd10": "\ud83a\udd32", "\ud83a\udd11": "\ud83a\udd33", "\ud83a\udd12": "\ud83a\udd34", "\ud83a\udd13": "\ud83a\udd35", "\ud83a\udd14": "\ud83a\udd36", "\ud83a\udd15": "\ud83a\udd37", "\ud83a\udd16": "\ud83a\udd38", "\ud83a\udd17": "\ud83a\udd39", "\ud83a\udd18": "\ud83a\udd3a", "\ud83a\udd19": "\ud83a\udd3b", "\ud83a\udd1a": "\ud83a\udd3c", "\ud83a\udd1b": "\ud83a\udd3d", "\ud83a\udd1c": "\ud83a\udd3e", "\ud83a\udd1d": "\ud83a\udd3f", "\ud83a\udd1e": "\ud83a\udd40", "\ud83a\udd1f": "\ud83a\udd41", "\ud83a\udd20": "\ud83a\udd42", "\ud83a\udd21": "\ud83a\udd43" };
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const SPACE = /^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
const trimmedCode = (code) => code.replace(SPACE, "");
function canonicalCodeKey(code) { return (0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFC)((0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFD)(Array.from((0,_unicode_normalization__WEBPACK_IMPORTED_MODULE_0__.unicode17NFD)(code), c => FOLD[c] ?? c).join(""))); }


/***/ },

/***/ "./src/domain/manuscript.ts"
/*!**********************************!*\
  !*** ./src/domain/manuscript.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assertManuscript: () => (/* binding */ assertManuscript),
/* harmony export */   scalarOffsetFromUtf16: () => (/* binding */ scalarOffsetFromUtf16),
/* harmony export */   utf16OffsetFromScalar: () => (/* binding */ utf16OffsetFromScalar),
/* harmony export */   validChapterFormatting: () => (/* binding */ validChapterFormatting),
/* harmony export */   validParagraph: () => (/* binding */ validParagraph)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");
/* harmony import */ var _calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar */ "./src/domain/calendar.ts");


function validParagraph(v) {
    if (typeof v !== 'object' || !v)
        return false;
    const kind = v.kind;
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'start', 'end', 'kind', 'indent', 'marks', ...(kind === 'heading' ? ['headingLevel'] : [])]) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.end) || BigInt(v.end) < BigInt(v.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.indent) || !['body', 'heading', 'scene-break'].includes(v.kind) || !Array.isArray(v.marks) || (kind === 'heading' && ![1, 2, 3, 4, 5, 6].includes(v.headingLevel)))
        return false;
    let previous = null;
    for (const m of v.marks) {
        if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['start', 'end', 'styles']) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(m.start) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(m.end) || BigInt(m.start) < BigInt(v.start) || BigInt(m.end) > BigInt(v.end) || BigInt(m.start) >= BigInt(m.end) || !Array.isArray(m.styles) || m.styles.length < 1 || m.styles.length > 2 || new Set(m.styles).size !== m.styles.length || !m.styles.every(s => s === 'bold' || s === 'italic'))
            return false;
        const styles = m.styles;
        if (previous && (BigInt(previous.end) > BigInt(m.start) || (previous.end === m.start && previous.styles.length === m.styles.length && previous.styles.every(s => styles.includes(s)))))
            return false;
        previous = m;
    }
    return kind !== 'scene-break' || v.marks.length === 0;
}
function validChapterFormatting(v) {
    return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['formatVersion', 'chapterId', 'recordVersion', 'text', 'paragraphs']) && v.formatVersion === 1 && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.chapterId) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.text, ['relativePath', 'sha256', 'byteLength', 'scalarLength']) && v.text.relativePath === `chapters/${v.chapterId}.wrt` && typeof v.text.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.text.sha256) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.text.byteLength) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.text.scalarLength) && Array.isArray(v.paragraphs) && v.paragraphs.length > 0 && v.paragraphs.every(validParagraph) && new Set(v.paragraphs.map(p => p.id)).size === v.paragraphs.length;
}
function assertManuscript(text, paragraphs) {
    if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || text.includes('\r') || text.startsWith('\uFEFF') || !Array.isArray(paragraphs) || !paragraphs.every(validParagraph) || new Set(paragraphs.map(p => p.id)).size !== paragraphs.length)
        throw new Error('Invalid LF manuscript or formatting.');
    const lines = text.split('\n');
    if (lines.length !== paragraphs.length)
        throw new Error('Paragraphs do not match manuscript.');
    let start = 0n;
    for (let i = 0; i < lines.length; i++) {
        const p = paragraphs[i], end = start + BigInt(Array.from(lines[i]).length);
        if (p.start !== start.toString() || p.end !== end.toString() || (p.kind === 'scene-break' && lines[i] !== '***'))
            throw new Error('Paragraph ranges do not match manuscript.');
        start = end + 1n;
    }
}
function scalarOffsetFromUtf16(text, offset) {
    if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || !Number.isSafeInteger(offset) || offset < 0 || offset > text.length || (offset > 0 && offset < text.length && /[\uD800-\uDBFF]/.test(text[offset - 1]) && /[\uDC00-\uDFFF]/.test(text[offset])))
        throw new Error('Offset splits a Unicode scalar.');
    return Array.from(text.slice(0, offset)).length.toString();
}
function utf16OffsetFromScalar(text, offset) { if (!(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(text) || !(0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(offset))
    throw new Error('Invalid scalar offset.'); let n = 0n, utf16 = 0; for (const s of text) {
    if (n === BigInt(offset))
        return utf16;
    n++;
    utf16 += s.length;
} if (n === BigInt(offset))
    return utf16; throw new Error('Scalar offset exceeds text.'); }


/***/ },

/***/ "./src/domain/personality.ts"
/*!***********************************!*\
  !*** ./src/domain/personality.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERSONALITY_LABELS: () => (/* binding */ PERSONALITY_LABELS)
/* harmony export */ });
const PERSONALITY_LABELS = [
    "Sanguine",
    "Choleric",
    "Phlegmatic",
    "Melancholic",
    "Average",
    "Reserved",
    "Self-Centered",
    "Role Model",
    "High Openness",
    "High Conscientiousness",
    "High Extraversion",
    "High Agreeableness",
    "High Neuroticism",
    "Curious Organizer",
    "Quiet Organizer",
    "Warm Strategist",
    "Bold Mediator",
    "Calm Explorer",
    "Intense Visionary",
    "Social Idealist",
    "Guarded Analyst",
    "Dutiful Helper",
    "Restless Achiever",
    "Steady Caregiver",
    "Practical Diplomat",
    "Reflective Builder",
    "Driven Commander",
    "Gentle Traditionalist",
    "Adventurous Connector",
    "Methodical Skeptic",
    "Creative Loyalist",
    "Cautious Reformer",
    "High-Energy Planner",
    "Low-Key Harmonizer",
    "Competitive Organizer",
    "Empathic Visionary",
    "Reserved Perfectionist",
    "Charismatic Stabilizer",
    "Independent Thinker",
    "Sensitive Collaborator",
    "Disciplined Explorer",
    "Expressive Reformer",
    "Peace-Seeking Planner",
    "Tactical Caregiver",
    "Bold Innovator",
    "Stoic Executor",
    "Imaginative Realist",
    "Structured Idealist",
    "Loyal Protector",
    "Adaptive Diplomat",
    "Abrasive Commander",
    "Cold Opportunist",
    "Anxious Controller",
    "Bitter Traditionalist",
    "Paranoid Strategist",
    "Self-Important Critic",
    "Manipulative Charmer",
    "Volatile Achiever",
    "Resentful Follower",
    "Rigid Perfectionist",
    "Detached Elitist",
    "Defensive Skeptic",
    "Impulsive Schemer",
    "Cowardly Bully",
    "Jealous Rival",
    "Passive Saboteur",
    "Martyr Complex",
    "Smug Reformer",
    "Disloyal Survivor",
    "Pessimistic Planner",
    "Control-Hungry Caregiver",
    "Restless Dissenter",
    "Guilt Weaponizer",
    "Emotionally Withholding",
    "Petty Scorekeeper",
    "Grandiose Visionary",
    "Cynical Manipulator",
    "Unstable Loyalist",
    "Status Addict",
    "Harsh Pragmatist",
    "Catastrophizer",
    "Suspicious Isolator",
    "Domineering Organizer",
    "Blame Shifter",
    "Moral Showboater",
    "Insecure Braggart",
    "Compulsive Doubter",
    "Predatory Networker",
    "Cruel Realist",
    "Envious Imitator",
    "Neglectful Dreamer",
    "Fearful Conformist",
    "Vindictive Idealist",
    "Attention Drainer",
    "Reckless Evangelist",
    "Secretly Contemptuous Ally",
    "Boundary Breaker",
    "Tyrannical Protector",
    "Hopeless Defeatist",
    "Corrosive Diplomat"
];


/***/ },

/***/ "./src/domain/references.ts"
/*!**********************************!*\
  !*** ./src/domain/references.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recordReferences: () => (/* binding */ recordReferences)
/* harmony export */ });
/** All persisted record links; exact calendar-version/image identities have their own closure checks. */
function recordReferences(record) {
    const refs = [];
    const field = (name, id, optional = false) => { if (id)
        refs.push({ targetId: id, label: name, canRemove: optional, replace: (r, value) => ({ ...r, data: { ...r.data, [name]: value } }) }); };
    const list = (name, ids) => ids.forEach(id => refs.push({ targetId: id, label: name, canRemove: true, replace: (r, value) => ({ ...r, data: { ...r.data, [name]: r.data[name].flatMap(v => v === id ? value ? [value] : [] : [v]) } }) }));
    const maker = () => { if ('maker' in record.data && record.data.maker) {
        const id = record.data.maker.id;
        refs.push({ targetId: id, label: 'maker', canRemove: true, replace: (r, value) => ({ ...r, data: { ...r.data, maker: value ? { ...r.data.maker, id: value } : null } }) });
    } };
    switch (record.recordType) {
        case 'story':
            field('volumeId', record.data.volumeId, true);
            break;
        case 'chapter':
            field('storyId', record.data.storyId);
            list('characterIds', record.data.characterIds);
            record.data.events.forEach(link => refs.push({ targetId: link.eventId, label: 'chapter event', canRemove: true, replace: (r, value) => r.recordType === 'chapter' ? { ...r, data: { ...r.data, events: r.data.events.flatMap(e => e.eventId === link.eventId ? value ? [{ ...e, eventId: value }] : [] : [e]) } } : r }));
            break;
        case 'plot':
            field('storyId', record.data.storyId);
            break;
        case 'decision-context':
            field('storyId', record.data.storyId);
            field('decisionId', record.data.decisionId);
            break;
        case 'decision':
            field('typeId', record.data.typeId);
            list('characterIds', record.data.characterIds);
            list('eventIds', record.data.eventIds);
            list('followingDecisionIds', record.data.followingDecisionIds);
            maker();
            break;
        case 'event':
            field('characterId', record.data.characterId, record.data.kind === 'ordinary');
            maker();
            break;
        case 'character':
            field('birthEventId', record.data.birthEventId);
            break;
        case 'affiliation':
            field('characterId', record.data.characterId);
            field('factionId', record.data.factionId, true);
            break;
        case 'view':
            record.data.makers.forEach(m => { if (m.kind !== 'none')
                refs.push({ targetId: m.id, label: 'visibility maker', canRemove: true, replace: (r, value) => r.recordType === 'view' ? { ...r, data: { ...r.data, makers: r.data.makers.flatMap(x => x.kind !== 'none' && x.id === m.id ? value ? [{ ...x, id: value }] : [] : [x]) } } : r }); });
            record.data.categories.forEach(c => { if (c.kind === 'decision-type')
                refs.push({ targetId: c.id, label: 'visibility category', canRemove: true, replace: (r, value) => r.recordType === 'view' ? { ...r, data: { ...r.data, categories: r.data.categories.flatMap(x => x.kind === 'decision-type' && x.id === c.id ? value ? [{ ...x, id: value }] : [] : [x]) } } : r }); });
            break;
    }
    return refs;
}


/***/ },

/***/ "./src/domain/unicode-normalization-data.ts"
/*!**************************************************!*\
  !*** ./src/domain/unicode-normalization-data.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMBINING: () => (/* binding */ COMBINING),
/* harmony export */   COMPOSITION: () => (/* binding */ COMPOSITION),
/* harmony export */   DECOMPOSITION: () => (/* binding */ DECOMPOSITION)
/* harmony export */ });
// Generated from Unicode 17.0.0 UnicodeData.txt and Full_Composition_Exclusion.
// Unicode License V3: resources/licenses/Unicode-LICENSE.txt
// writingtool-UnicodeData-17.0.0.txt: SHA-256 2e1efc1dcb59c575eedf5ccae60f95229f706ee6d031835247d843c11d96470c
// writingtool-DerivedNormalizationProps-17.0.0.txt: SHA-256 71fd6a206a2c0cdd41feb6b7f656aa31091db45e9cedc926985d718397f9e488
const DECOMPOSITION = { "192": [65, 768], "193": [65, 769], "194": [65, 770], "195": [65, 771], "196": [65, 776], "197": [65, 778], "199": [67, 807], "200": [69, 768], "201": [69, 769], "202": [69, 770], "203": [69, 776], "204": [73, 768], "205": [73, 769], "206": [73, 770], "207": [73, 776], "209": [78, 771], "210": [79, 768], "211": [79, 769], "212": [79, 770], "213": [79, 771], "214": [79, 776], "217": [85, 768], "218": [85, 769], "219": [85, 770], "220": [85, 776], "221": [89, 769], "224": [97, 768], "225": [97, 769], "226": [97, 770], "227": [97, 771], "228": [97, 776], "229": [97, 778], "231": [99, 807], "232": [101, 768], "233": [101, 769], "234": [101, 770], "235": [101, 776], "236": [105, 768], "237": [105, 769], "238": [105, 770], "239": [105, 776], "241": [110, 771], "242": [111, 768], "243": [111, 769], "244": [111, 770], "245": [111, 771], "246": [111, 776], "249": [117, 768], "250": [117, 769], "251": [117, 770], "252": [117, 776], "253": [121, 769], "255": [121, 776], "256": [65, 772], "257": [97, 772], "258": [65, 774], "259": [97, 774], "260": [65, 808], "261": [97, 808], "262": [67, 769], "263": [99, 769], "264": [67, 770], "265": [99, 770], "266": [67, 775], "267": [99, 775], "268": [67, 780], "269": [99, 780], "270": [68, 780], "271": [100, 780], "274": [69, 772], "275": [101, 772], "276": [69, 774], "277": [101, 774], "278": [69, 775], "279": [101, 775], "280": [69, 808], "281": [101, 808], "282": [69, 780], "283": [101, 780], "284": [71, 770], "285": [103, 770], "286": [71, 774], "287": [103, 774], "288": [71, 775], "289": [103, 775], "290": [71, 807], "291": [103, 807], "292": [72, 770], "293": [104, 770], "296": [73, 771], "297": [105, 771], "298": [73, 772], "299": [105, 772], "300": [73, 774], "301": [105, 774], "302": [73, 808], "303": [105, 808], "304": [73, 775], "308": [74, 770], "309": [106, 770], "310": [75, 807], "311": [107, 807], "313": [76, 769], "314": [108, 769], "315": [76, 807], "316": [108, 807], "317": [76, 780], "318": [108, 780], "323": [78, 769], "324": [110, 769], "325": [78, 807], "326": [110, 807], "327": [78, 780], "328": [110, 780], "332": [79, 772], "333": [111, 772], "334": [79, 774], "335": [111, 774], "336": [79, 779], "337": [111, 779], "340": [82, 769], "341": [114, 769], "342": [82, 807], "343": [114, 807], "344": [82, 780], "345": [114, 780], "346": [83, 769], "347": [115, 769], "348": [83, 770], "349": [115, 770], "350": [83, 807], "351": [115, 807], "352": [83, 780], "353": [115, 780], "354": [84, 807], "355": [116, 807], "356": [84, 780], "357": [116, 780], "360": [85, 771], "361": [117, 771], "362": [85, 772], "363": [117, 772], "364": [85, 774], "365": [117, 774], "366": [85, 778], "367": [117, 778], "368": [85, 779], "369": [117, 779], "370": [85, 808], "371": [117, 808], "372": [87, 770], "373": [119, 770], "374": [89, 770], "375": [121, 770], "376": [89, 776], "377": [90, 769], "378": [122, 769], "379": [90, 775], "380": [122, 775], "381": [90, 780], "382": [122, 780], "416": [79, 795], "417": [111, 795], "431": [85, 795], "432": [117, 795], "461": [65, 780], "462": [97, 780], "463": [73, 780], "464": [105, 780], "465": [79, 780], "466": [111, 780], "467": [85, 780], "468": [117, 780], "469": [220, 772], "470": [252, 772], "471": [220, 769], "472": [252, 769], "473": [220, 780], "474": [252, 780], "475": [220, 768], "476": [252, 768], "478": [196, 772], "479": [228, 772], "480": [550, 772], "481": [551, 772], "482": [198, 772], "483": [230, 772], "486": [71, 780], "487": [103, 780], "488": [75, 780], "489": [107, 780], "490": [79, 808], "491": [111, 808], "492": [490, 772], "493": [491, 772], "494": [439, 780], "495": [658, 780], "496": [106, 780], "500": [71, 769], "501": [103, 769], "504": [78, 768], "505": [110, 768], "506": [197, 769], "507": [229, 769], "508": [198, 769], "509": [230, 769], "510": [216, 769], "511": [248, 769], "512": [65, 783], "513": [97, 783], "514": [65, 785], "515": [97, 785], "516": [69, 783], "517": [101, 783], "518": [69, 785], "519": [101, 785], "520": [73, 783], "521": [105, 783], "522": [73, 785], "523": [105, 785], "524": [79, 783], "525": [111, 783], "526": [79, 785], "527": [111, 785], "528": [82, 783], "529": [114, 783], "530": [82, 785], "531": [114, 785], "532": [85, 783], "533": [117, 783], "534": [85, 785], "535": [117, 785], "536": [83, 806], "537": [115, 806], "538": [84, 806], "539": [116, 806], "542": [72, 780], "543": [104, 780], "550": [65, 775], "551": [97, 775], "552": [69, 807], "553": [101, 807], "554": [214, 772], "555": [246, 772], "556": [213, 772], "557": [245, 772], "558": [79, 775], "559": [111, 775], "560": [558, 772], "561": [559, 772], "562": [89, 772], "563": [121, 772], "832": [768], "833": [769], "835": [787], "836": [776, 769], "884": [697], "894": [59], "901": [168, 769], "902": [913, 769], "903": [183], "904": [917, 769], "905": [919, 769], "906": [921, 769], "908": [927, 769], "910": [933, 769], "911": [937, 769], "912": [970, 769], "938": [921, 776], "939": [933, 776], "940": [945, 769], "941": [949, 769], "942": [951, 769], "943": [953, 769], "944": [971, 769], "970": [953, 776], "971": [965, 776], "972": [959, 769], "973": [965, 769], "974": [969, 769], "979": [978, 769], "980": [978, 776], "1024": [1045, 768], "1025": [1045, 776], "1027": [1043, 769], "1031": [1030, 776], "1036": [1050, 769], "1037": [1048, 768], "1038": [1059, 774], "1049": [1048, 774], "1081": [1080, 774], "1104": [1077, 768], "1105": [1077, 776], "1107": [1075, 769], "1111": [1110, 776], "1116": [1082, 769], "1117": [1080, 768], "1118": [1091, 774], "1142": [1140, 783], "1143": [1141, 783], "1217": [1046, 774], "1218": [1078, 774], "1232": [1040, 774], "1233": [1072, 774], "1234": [1040, 776], "1235": [1072, 776], "1238": [1045, 774], "1239": [1077, 774], "1242": [1240, 776], "1243": [1241, 776], "1244": [1046, 776], "1245": [1078, 776], "1246": [1047, 776], "1247": [1079, 776], "1250": [1048, 772], "1251": [1080, 772], "1252": [1048, 776], "1253": [1080, 776], "1254": [1054, 776], "1255": [1086, 776], "1258": [1256, 776], "1259": [1257, 776], "1260": [1069, 776], "1261": [1101, 776], "1262": [1059, 772], "1263": [1091, 772], "1264": [1059, 776], "1265": [1091, 776], "1266": [1059, 779], "1267": [1091, 779], "1268": [1063, 776], "1269": [1095, 776], "1272": [1067, 776], "1273": [1099, 776], "1570": [1575, 1619], "1571": [1575, 1620], "1572": [1608, 1620], "1573": [1575, 1621], "1574": [1610, 1620], "1728": [1749, 1620], "1730": [1729, 1620], "1747": [1746, 1620], "2345": [2344, 2364], "2353": [2352, 2364], "2356": [2355, 2364], "2392": [2325, 2364], "2393": [2326, 2364], "2394": [2327, 2364], "2395": [2332, 2364], "2396": [2337, 2364], "2397": [2338, 2364], "2398": [2347, 2364], "2399": [2351, 2364], "2507": [2503, 2494], "2508": [2503, 2519], "2524": [2465, 2492], "2525": [2466, 2492], "2527": [2479, 2492], "2611": [2610, 2620], "2614": [2616, 2620], "2649": [2582, 2620], "2650": [2583, 2620], "2651": [2588, 2620], "2654": [2603, 2620], "2888": [2887, 2902], "2891": [2887, 2878], "2892": [2887, 2903], "2908": [2849, 2876], "2909": [2850, 2876], "2964": [2962, 3031], "3018": [3014, 3006], "3019": [3015, 3006], "3020": [3014, 3031], "3144": [3142, 3158], "3264": [3263, 3285], "3271": [3270, 3285], "3272": [3270, 3286], "3274": [3270, 3266], "3275": [3274, 3285], "3402": [3398, 3390], "3403": [3399, 3390], "3404": [3398, 3415], "3546": [3545, 3530], "3548": [3545, 3535], "3549": [3548, 3530], "3550": [3545, 3551], "3907": [3906, 4023], "3917": [3916, 4023], "3922": [3921, 4023], "3927": [3926, 4023], "3932": [3931, 4023], "3945": [3904, 4021], "3955": [3953, 3954], "3957": [3953, 3956], "3958": [4018, 3968], "3960": [4019, 3968], "3969": [3953, 3968], "3987": [3986, 4023], "3997": [3996, 4023], "4002": [4001, 4023], "4007": [4006, 4023], "4012": [4011, 4023], "4025": [3984, 4021], "4134": [4133, 4142], "6918": [6917, 6965], "6920": [6919, 6965], "6922": [6921, 6965], "6924": [6923, 6965], "6926": [6925, 6965], "6930": [6929, 6965], "6971": [6970, 6965], "6973": [6972, 6965], "6976": [6974, 6965], "6977": [6975, 6965], "6979": [6978, 6965], "7680": [65, 805], "7681": [97, 805], "7682": [66, 775], "7683": [98, 775], "7684": [66, 803], "7685": [98, 803], "7686": [66, 817], "7687": [98, 817], "7688": [199, 769], "7689": [231, 769], "7690": [68, 775], "7691": [100, 775], "7692": [68, 803], "7693": [100, 803], "7694": [68, 817], "7695": [100, 817], "7696": [68, 807], "7697": [100, 807], "7698": [68, 813], "7699": [100, 813], "7700": [274, 768], "7701": [275, 768], "7702": [274, 769], "7703": [275, 769], "7704": [69, 813], "7705": [101, 813], "7706": [69, 816], "7707": [101, 816], "7708": [552, 774], "7709": [553, 774], "7710": [70, 775], "7711": [102, 775], "7712": [71, 772], "7713": [103, 772], "7714": [72, 775], "7715": [104, 775], "7716": [72, 803], "7717": [104, 803], "7718": [72, 776], "7719": [104, 776], "7720": [72, 807], "7721": [104, 807], "7722": [72, 814], "7723": [104, 814], "7724": [73, 816], "7725": [105, 816], "7726": [207, 769], "7727": [239, 769], "7728": [75, 769], "7729": [107, 769], "7730": [75, 803], "7731": [107, 803], "7732": [75, 817], "7733": [107, 817], "7734": [76, 803], "7735": [108, 803], "7736": [7734, 772], "7737": [7735, 772], "7738": [76, 817], "7739": [108, 817], "7740": [76, 813], "7741": [108, 813], "7742": [77, 769], "7743": [109, 769], "7744": [77, 775], "7745": [109, 775], "7746": [77, 803], "7747": [109, 803], "7748": [78, 775], "7749": [110, 775], "7750": [78, 803], "7751": [110, 803], "7752": [78, 817], "7753": [110, 817], "7754": [78, 813], "7755": [110, 813], "7756": [213, 769], "7757": [245, 769], "7758": [213, 776], "7759": [245, 776], "7760": [332, 768], "7761": [333, 768], "7762": [332, 769], "7763": [333, 769], "7764": [80, 769], "7765": [112, 769], "7766": [80, 775], "7767": [112, 775], "7768": [82, 775], "7769": [114, 775], "7770": [82, 803], "7771": [114, 803], "7772": [7770, 772], "7773": [7771, 772], "7774": [82, 817], "7775": [114, 817], "7776": [83, 775], "7777": [115, 775], "7778": [83, 803], "7779": [115, 803], "7780": [346, 775], "7781": [347, 775], "7782": [352, 775], "7783": [353, 775], "7784": [7778, 775], "7785": [7779, 775], "7786": [84, 775], "7787": [116, 775], "7788": [84, 803], "7789": [116, 803], "7790": [84, 817], "7791": [116, 817], "7792": [84, 813], "7793": [116, 813], "7794": [85, 804], "7795": [117, 804], "7796": [85, 816], "7797": [117, 816], "7798": [85, 813], "7799": [117, 813], "7800": [360, 769], "7801": [361, 769], "7802": [362, 776], "7803": [363, 776], "7804": [86, 771], "7805": [118, 771], "7806": [86, 803], "7807": [118, 803], "7808": [87, 768], "7809": [119, 768], "7810": [87, 769], "7811": [119, 769], "7812": [87, 776], "7813": [119, 776], "7814": [87, 775], "7815": [119, 775], "7816": [87, 803], "7817": [119, 803], "7818": [88, 775], "7819": [120, 775], "7820": [88, 776], "7821": [120, 776], "7822": [89, 775], "7823": [121, 775], "7824": [90, 770], "7825": [122, 770], "7826": [90, 803], "7827": [122, 803], "7828": [90, 817], "7829": [122, 817], "7830": [104, 817], "7831": [116, 776], "7832": [119, 778], "7833": [121, 778], "7835": [383, 775], "7840": [65, 803], "7841": [97, 803], "7842": [65, 777], "7843": [97, 777], "7844": [194, 769], "7845": [226, 769], "7846": [194, 768], "7847": [226, 768], "7848": [194, 777], "7849": [226, 777], "7850": [194, 771], "7851": [226, 771], "7852": [7840, 770], "7853": [7841, 770], "7854": [258, 769], "7855": [259, 769], "7856": [258, 768], "7857": [259, 768], "7858": [258, 777], "7859": [259, 777], "7860": [258, 771], "7861": [259, 771], "7862": [7840, 774], "7863": [7841, 774], "7864": [69, 803], "7865": [101, 803], "7866": [69, 777], "7867": [101, 777], "7868": [69, 771], "7869": [101, 771], "7870": [202, 769], "7871": [234, 769], "7872": [202, 768], "7873": [234, 768], "7874": [202, 777], "7875": [234, 777], "7876": [202, 771], "7877": [234, 771], "7878": [7864, 770], "7879": [7865, 770], "7880": [73, 777], "7881": [105, 777], "7882": [73, 803], "7883": [105, 803], "7884": [79, 803], "7885": [111, 803], "7886": [79, 777], "7887": [111, 777], "7888": [212, 769], "7889": [244, 769], "7890": [212, 768], "7891": [244, 768], "7892": [212, 777], "7893": [244, 777], "7894": [212, 771], "7895": [244, 771], "7896": [7884, 770], "7897": [7885, 770], "7898": [416, 769], "7899": [417, 769], "7900": [416, 768], "7901": [417, 768], "7902": [416, 777], "7903": [417, 777], "7904": [416, 771], "7905": [417, 771], "7906": [416, 803], "7907": [417, 803], "7908": [85, 803], "7909": [117, 803], "7910": [85, 777], "7911": [117, 777], "7912": [431, 769], "7913": [432, 769], "7914": [431, 768], "7915": [432, 768], "7916": [431, 777], "7917": [432, 777], "7918": [431, 771], "7919": [432, 771], "7920": [431, 803], "7921": [432, 803], "7922": [89, 768], "7923": [121, 768], "7924": [89, 803], "7925": [121, 803], "7926": [89, 777], "7927": [121, 777], "7928": [89, 771], "7929": [121, 771], "7936": [945, 787], "7937": [945, 788], "7938": [7936, 768], "7939": [7937, 768], "7940": [7936, 769], "7941": [7937, 769], "7942": [7936, 834], "7943": [7937, 834], "7944": [913, 787], "7945": [913, 788], "7946": [7944, 768], "7947": [7945, 768], "7948": [7944, 769], "7949": [7945, 769], "7950": [7944, 834], "7951": [7945, 834], "7952": [949, 787], "7953": [949, 788], "7954": [7952, 768], "7955": [7953, 768], "7956": [7952, 769], "7957": [7953, 769], "7960": [917, 787], "7961": [917, 788], "7962": [7960, 768], "7963": [7961, 768], "7964": [7960, 769], "7965": [7961, 769], "7968": [951, 787], "7969": [951, 788], "7970": [7968, 768], "7971": [7969, 768], "7972": [7968, 769], "7973": [7969, 769], "7974": [7968, 834], "7975": [7969, 834], "7976": [919, 787], "7977": [919, 788], "7978": [7976, 768], "7979": [7977, 768], "7980": [7976, 769], "7981": [7977, 769], "7982": [7976, 834], "7983": [7977, 834], "7984": [953, 787], "7985": [953, 788], "7986": [7984, 768], "7987": [7985, 768], "7988": [7984, 769], "7989": [7985, 769], "7990": [7984, 834], "7991": [7985, 834], "7992": [921, 787], "7993": [921, 788], "7994": [7992, 768], "7995": [7993, 768], "7996": [7992, 769], "7997": [7993, 769], "7998": [7992, 834], "7999": [7993, 834], "8000": [959, 787], "8001": [959, 788], "8002": [8000, 768], "8003": [8001, 768], "8004": [8000, 769], "8005": [8001, 769], "8008": [927, 787], "8009": [927, 788], "8010": [8008, 768], "8011": [8009, 768], "8012": [8008, 769], "8013": [8009, 769], "8016": [965, 787], "8017": [965, 788], "8018": [8016, 768], "8019": [8017, 768], "8020": [8016, 769], "8021": [8017, 769], "8022": [8016, 834], "8023": [8017, 834], "8025": [933, 788], "8027": [8025, 768], "8029": [8025, 769], "8031": [8025, 834], "8032": [969, 787], "8033": [969, 788], "8034": [8032, 768], "8035": [8033, 768], "8036": [8032, 769], "8037": [8033, 769], "8038": [8032, 834], "8039": [8033, 834], "8040": [937, 787], "8041": [937, 788], "8042": [8040, 768], "8043": [8041, 768], "8044": [8040, 769], "8045": [8041, 769], "8046": [8040, 834], "8047": [8041, 834], "8048": [945, 768], "8049": [940], "8050": [949, 768], "8051": [941], "8052": [951, 768], "8053": [942], "8054": [953, 768], "8055": [943], "8056": [959, 768], "8057": [972], "8058": [965, 768], "8059": [973], "8060": [969, 768], "8061": [974], "8064": [7936, 837], "8065": [7937, 837], "8066": [7938, 837], "8067": [7939, 837], "8068": [7940, 837], "8069": [7941, 837], "8070": [7942, 837], "8071": [7943, 837], "8072": [7944, 837], "8073": [7945, 837], "8074": [7946, 837], "8075": [7947, 837], "8076": [7948, 837], "8077": [7949, 837], "8078": [7950, 837], "8079": [7951, 837], "8080": [7968, 837], "8081": [7969, 837], "8082": [7970, 837], "8083": [7971, 837], "8084": [7972, 837], "8085": [7973, 837], "8086": [7974, 837], "8087": [7975, 837], "8088": [7976, 837], "8089": [7977, 837], "8090": [7978, 837], "8091": [7979, 837], "8092": [7980, 837], "8093": [7981, 837], "8094": [7982, 837], "8095": [7983, 837], "8096": [8032, 837], "8097": [8033, 837], "8098": [8034, 837], "8099": [8035, 837], "8100": [8036, 837], "8101": [8037, 837], "8102": [8038, 837], "8103": [8039, 837], "8104": [8040, 837], "8105": [8041, 837], "8106": [8042, 837], "8107": [8043, 837], "8108": [8044, 837], "8109": [8045, 837], "8110": [8046, 837], "8111": [8047, 837], "8112": [945, 774], "8113": [945, 772], "8114": [8048, 837], "8115": [945, 837], "8116": [940, 837], "8118": [945, 834], "8119": [8118, 837], "8120": [913, 774], "8121": [913, 772], "8122": [913, 768], "8123": [902], "8124": [913, 837], "8126": [953], "8129": [168, 834], "8130": [8052, 837], "8131": [951, 837], "8132": [942, 837], "8134": [951, 834], "8135": [8134, 837], "8136": [917, 768], "8137": [904], "8138": [919, 768], "8139": [905], "8140": [919, 837], "8141": [8127, 768], "8142": [8127, 769], "8143": [8127, 834], "8144": [953, 774], "8145": [953, 772], "8146": [970, 768], "8147": [912], "8150": [953, 834], "8151": [970, 834], "8152": [921, 774], "8153": [921, 772], "8154": [921, 768], "8155": [906], "8157": [8190, 768], "8158": [8190, 769], "8159": [8190, 834], "8160": [965, 774], "8161": [965, 772], "8162": [971, 768], "8163": [944], "8164": [961, 787], "8165": [961, 788], "8166": [965, 834], "8167": [971, 834], "8168": [933, 774], "8169": [933, 772], "8170": [933, 768], "8171": [910], "8172": [929, 788], "8173": [168, 768], "8174": [901], "8175": [96], "8178": [8060, 837], "8179": [969, 837], "8180": [974, 837], "8182": [969, 834], "8183": [8182, 837], "8184": [927, 768], "8185": [908], "8186": [937, 768], "8187": [911], "8188": [937, 837], "8189": [180], "8192": [8194], "8193": [8195], "8486": [937], "8490": [75], "8491": [197], "8602": [8592, 824], "8603": [8594, 824], "8622": [8596, 824], "8653": [8656, 824], "8654": [8660, 824], "8655": [8658, 824], "8708": [8707, 824], "8713": [8712, 824], "8716": [8715, 824], "8740": [8739, 824], "8742": [8741, 824], "8769": [8764, 824], "8772": [8771, 824], "8775": [8773, 824], "8777": [8776, 824], "8800": [61, 824], "8802": [8801, 824], "8813": [8781, 824], "8814": [60, 824], "8815": [62, 824], "8816": [8804, 824], "8817": [8805, 824], "8820": [8818, 824], "8821": [8819, 824], "8824": [8822, 824], "8825": [8823, 824], "8832": [8826, 824], "8833": [8827, 824], "8836": [8834, 824], "8837": [8835, 824], "8840": [8838, 824], "8841": [8839, 824], "8876": [8866, 824], "8877": [8872, 824], "8878": [8873, 824], "8879": [8875, 824], "8928": [8828, 824], "8929": [8829, 824], "8930": [8849, 824], "8931": [8850, 824], "8938": [8882, 824], "8939": [8883, 824], "8940": [8884, 824], "8941": [8885, 824], "9001": [12296], "9002": [12297], "10972": [10973, 824], "12364": [12363, 12441], "12366": [12365, 12441], "12368": [12367, 12441], "12370": [12369, 12441], "12372": [12371, 12441], "12374": [12373, 12441], "12376": [12375, 12441], "12378": [12377, 12441], "12380": [12379, 12441], "12382": [12381, 12441], "12384": [12383, 12441], "12386": [12385, 12441], "12389": [12388, 12441], "12391": [12390, 12441], "12393": [12392, 12441], "12400": [12399, 12441], "12401": [12399, 12442], "12403": [12402, 12441], "12404": [12402, 12442], "12406": [12405, 12441], "12407": [12405, 12442], "12409": [12408, 12441], "12410": [12408, 12442], "12412": [12411, 12441], "12413": [12411, 12442], "12436": [12358, 12441], "12446": [12445, 12441], "12460": [12459, 12441], "12462": [12461, 12441], "12464": [12463, 12441], "12466": [12465, 12441], "12468": [12467, 12441], "12470": [12469, 12441], "12472": [12471, 12441], "12474": [12473, 12441], "12476": [12475, 12441], "12478": [12477, 12441], "12480": [12479, 12441], "12482": [12481, 12441], "12485": [12484, 12441], "12487": [12486, 12441], "12489": [12488, 12441], "12496": [12495, 12441], "12497": [12495, 12442], "12499": [12498, 12441], "12500": [12498, 12442], "12502": [12501, 12441], "12503": [12501, 12442], "12505": [12504, 12441], "12506": [12504, 12442], "12508": [12507, 12441], "12509": [12507, 12442], "12532": [12454, 12441], "12535": [12527, 12441], "12536": [12528, 12441], "12537": [12529, 12441], "12538": [12530, 12441], "12542": [12541, 12441], "63744": [35912], "63745": [26356], "63746": [36554], "63747": [36040], "63748": [28369], "63749": [20018], "63750": [21477], "63751": [40860], "63752": [40860], "63753": [22865], "63754": [37329], "63755": [21895], "63756": [22856], "63757": [25078], "63758": [30313], "63759": [32645], "63760": [34367], "63761": [34746], "63762": [35064], "63763": [37007], "63764": [27138], "63765": [27931], "63766": [28889], "63767": [29662], "63768": [33853], "63769": [37226], "63770": [39409], "63771": [20098], "63772": [21365], "63773": [27396], "63774": [29211], "63775": [34349], "63776": [40478], "63777": [23888], "63778": [28651], "63779": [34253], "63780": [35172], "63781": [25289], "63782": [33240], "63783": [34847], "63784": [24266], "63785": [26391], "63786": [28010], "63787": [29436], "63788": [37070], "63789": [20358], "63790": [20919], "63791": [21214], "63792": [25796], "63793": [27347], "63794": [29200], "63795": [30439], "63796": [32769], "63797": [34310], "63798": [34396], "63799": [36335], "63800": [38706], "63801": [39791], "63802": [40442], "63803": [30860], "63804": [31103], "63805": [32160], "63806": [33737], "63807": [37636], "63808": [40575], "63809": [35542], "63810": [22751], "63811": [24324], "63812": [31840], "63813": [32894], "63814": [29282], "63815": [30922], "63816": [36034], "63817": [38647], "63818": [22744], "63819": [23650], "63820": [27155], "63821": [28122], "63822": [28431], "63823": [32047], "63824": [32311], "63825": [38475], "63826": [21202], "63827": [32907], "63828": [20956], "63829": [20940], "63830": [31260], "63831": [32190], "63832": [33777], "63833": [38517], "63834": [35712], "63835": [25295], "63836": [27138], "63837": [35582], "63838": [20025], "63839": [23527], "63840": [24594], "63841": [29575], "63842": [30064], "63843": [21271], "63844": [30971], "63845": [20415], "63846": [24489], "63847": [19981], "63848": [27852], "63849": [25976], "63850": [32034], "63851": [21443], "63852": [22622], "63853": [30465], "63854": [33865], "63855": [35498], "63856": [27578], "63857": [36784], "63858": [27784], "63859": [25342], "63860": [33509], "63861": [25504], "63862": [30053], "63863": [20142], "63864": [20841], "63865": [20937], "63866": [26753], "63867": [31975], "63868": [33391], "63869": [35538], "63870": [37327], "63871": [21237], "63872": [21570], "63873": [22899], "63874": [24300], "63875": [26053], "63876": [28670], "63877": [31018], "63878": [38317], "63879": [39530], "63880": [40599], "63881": [40654], "63882": [21147], "63883": [26310], "63884": [27511], "63885": [36706], "63886": [24180], "63887": [24976], "63888": [25088], "63889": [25754], "63890": [28451], "63891": [29001], "63892": [29833], "63893": [31178], "63894": [32244], "63895": [32879], "63896": [36646], "63897": [34030], "63898": [36899], "63899": [37706], "63900": [21015], "63901": [21155], "63902": [21693], "63903": [28872], "63904": [35010], "63905": [35498], "63906": [24265], "63907": [24565], "63908": [25467], "63909": [27566], "63910": [31806], "63911": [29557], "63912": [20196], "63913": [22265], "63914": [23527], "63915": [23994], "63916": [24604], "63917": [29618], "63918": [29801], "63919": [32666], "63920": [32838], "63921": [37428], "63922": [38646], "63923": [38728], "63924": [38936], "63925": [20363], "63926": [31150], "63927": [37300], "63928": [38584], "63929": [24801], "63930": [20102], "63931": [20698], "63932": [23534], "63933": [23615], "63934": [26009], "63935": [27138], "63936": [29134], "63937": [30274], "63938": [34044], "63939": [36988], "63940": [40845], "63941": [26248], "63942": [38446], "63943": [21129], "63944": [26491], "63945": [26611], "63946": [27969], "63947": [28316], "63948": [29705], "63949": [30041], "63950": [30827], "63951": [32016], "63952": [39006], "63953": [20845], "63954": [25134], "63955": [38520], "63956": [20523], "63957": [23833], "63958": [28138], "63959": [36650], "63960": [24459], "63961": [24900], "63962": [26647], "63963": [29575], "63964": [38534], "63965": [21033], "63966": [21519], "63967": [23653], "63968": [26131], "63969": [26446], "63970": [26792], "63971": [27877], "63972": [29702], "63973": [30178], "63974": [32633], "63975": [35023], "63976": [35041], "63977": [37324], "63978": [38626], "63979": [21311], "63980": [28346], "63981": [21533], "63982": [29136], "63983": [29848], "63984": [34298], "63985": [38563], "63986": [40023], "63987": [40607], "63988": [26519], "63989": [28107], "63990": [33256], "63991": [31435], "63992": [31520], "63993": [31890], "63994": [29376], "63995": [28825], "63996": [35672], "63997": [20160], "63998": [33590], "63999": [21050], "64000": [20999], "64001": [24230], "64002": [25299], "64003": [31958], "64004": [23429], "64005": [27934], "64006": [26292], "64007": [36667], "64008": [34892], "64009": [38477], "64010": [35211], "64011": [24275], "64012": [20800], "64013": [21952], "64016": [22618], "64018": [26228], "64021": [20958], "64022": [29482], "64023": [30410], "64024": [31036], "64025": [31070], "64026": [31077], "64027": [31119], "64028": [38742], "64029": [31934], "64030": [32701], "64032": [34322], "64034": [35576], "64037": [36920], "64038": [37117], "64042": [39151], "64043": [39164], "64044": [39208], "64045": [40372], "64046": [37086], "64047": [38583], "64048": [20398], "64049": [20711], "64050": [20813], "64051": [21193], "64052": [21220], "64053": [21329], "64054": [21917], "64055": [22022], "64056": [22120], "64057": [22592], "64058": [22696], "64059": [23652], "64060": [23662], "64061": [24724], "64062": [24936], "64063": [24974], "64064": [25074], "64065": [25935], "64066": [26082], "64067": [26257], "64068": [26757], "64069": [28023], "64070": [28186], "64071": [28450], "64072": [29038], "64073": [29227], "64074": [29730], "64075": [30865], "64076": [31038], "64077": [31049], "64078": [31048], "64079": [31056], "64080": [31062], "64081": [31069], "64082": [31117], "64083": [31118], "64084": [31296], "64085": [31361], "64086": [31680], "64087": [32244], "64088": [32265], "64089": [32321], "64090": [32626], "64091": [32773], "64092": [33261], "64093": [33401], "64094": [33401], "64095": [33879], "64096": [35088], "64097": [35222], "64098": [35585], "64099": [35641], "64100": [36051], "64101": [36104], "64102": [36790], "64103": [36920], "64104": [38627], "64105": [38911], "64106": [38971], "64107": [24693], "64108": [148206], "64109": [33304], "64112": [20006], "64113": [20917], "64114": [20840], "64115": [20352], "64116": [20805], "64117": [20864], "64118": [21191], "64119": [21242], "64120": [21917], "64121": [21845], "64122": [21913], "64123": [21986], "64124": [22618], "64125": [22707], "64126": [22852], "64127": [22868], "64128": [23138], "64129": [23336], "64130": [24274], "64131": [24281], "64132": [24425], "64133": [24493], "64134": [24792], "64135": [24910], "64136": [24840], "64137": [24974], "64138": [24928], "64139": [25074], "64140": [25140], "64141": [25540], "64142": [25628], "64143": [25682], "64144": [25942], "64145": [26228], "64146": [26391], "64147": [26395], "64148": [26454], "64149": [27513], "64150": [27578], "64151": [27969], "64152": [28379], "64153": [28363], "64154": [28450], "64155": [28702], "64156": [29038], "64157": [30631], "64158": [29237], "64159": [29359], "64160": [29482], "64161": [29809], "64162": [29958], "64163": [30011], "64164": [30237], "64165": [30239], "64166": [30410], "64167": [30427], "64168": [30452], "64169": [30538], "64170": [30528], "64171": [30924], "64172": [31409], "64173": [31680], "64174": [31867], "64175": [32091], "64176": [32244], "64177": [32574], "64178": [32773], "64179": [33618], "64180": [33775], "64181": [34681], "64182": [35137], "64183": [35206], "64184": [35222], "64185": [35519], "64186": [35576], "64187": [35531], "64188": [35585], "64189": [35582], "64190": [35565], "64191": [35641], "64192": [35722], "64193": [36104], "64194": [36664], "64195": [36978], "64196": [37273], "64197": [37494], "64198": [38524], "64199": [38627], "64200": [38742], "64201": [38875], "64202": [38911], "64203": [38923], "64204": [38971], "64205": [39698], "64206": [40860], "64207": [141386], "64208": [141380], "64209": [144341], "64210": [15261], "64211": [16408], "64212": [16441], "64213": [152137], "64214": [154832], "64215": [163539], "64216": [40771], "64217": [40846], "64285": [1497, 1460], "64287": [1522, 1463], "64298": [1513, 1473], "64299": [1513, 1474], "64300": [64329, 1473], "64301": [64329, 1474], "64302": [1488, 1463], "64303": [1488, 1464], "64304": [1488, 1468], "64305": [1489, 1468], "64306": [1490, 1468], "64307": [1491, 1468], "64308": [1492, 1468], "64309": [1493, 1468], "64310": [1494, 1468], "64312": [1496, 1468], "64313": [1497, 1468], "64314": [1498, 1468], "64315": [1499, 1468], "64316": [1500, 1468], "64318": [1502, 1468], "64320": [1504, 1468], "64321": [1505, 1468], "64323": [1507, 1468], "64324": [1508, 1468], "64326": [1510, 1468], "64327": [1511, 1468], "64328": [1512, 1468], "64329": [1513, 1468], "64330": [1514, 1468], "64331": [1493, 1465], "64332": [1489, 1471], "64333": [1499, 1471], "64334": [1508, 1471], "67017": [67026, 775], "67044": [67034, 775], "69786": [69785, 69818], "69788": [69787, 69818], "69803": [69797, 69818], "69934": [69937, 69927], "69935": [69938, 69927], "70475": [70471, 70462], "70476": [70471, 70487], "70531": [70530, 70601], "70533": [70532, 70587], "70542": [70539, 70594], "70545": [70544, 70601], "70597": [70594, 70594], "70599": [70594, 70584], "70600": [70594, 70601], "70843": [70841, 70842], "70844": [70841, 70832], "70846": [70841, 70845], "71098": [71096, 71087], "71099": [71097, 71087], "71992": [71989, 71984], "90401": [90398, 90398], "90402": [90398, 90409], "90403": [90398, 90399], "90404": [90409, 90399], "90405": [90398, 90400], "90406": [90401, 90399], "90407": [90402, 90399], "90408": [90401, 90400], "93544": [93543, 93543], "93545": [93539, 93543], "93546": [93545, 93543], "119134": [119127, 119141], "119135": [119128, 119141], "119136": [119135, 119150], "119137": [119135, 119151], "119138": [119135, 119152], "119139": [119135, 119153], "119140": [119135, 119154], "119227": [119225, 119141], "119228": [119226, 119141], "119229": [119227, 119150], "119230": [119228, 119150], "119231": [119227, 119151], "119232": [119228, 119151], "194560": [20029], "194561": [20024], "194562": [20033], "194563": [131362], "194564": [20320], "194565": [20398], "194566": [20411], "194567": [20482], "194568": [20602], "194569": [20633], "194570": [20711], "194571": [20687], "194572": [13470], "194573": [132666], "194574": [20813], "194575": [20820], "194576": [20836], "194577": [20855], "194578": [132380], "194579": [13497], "194580": [20839], "194581": [20877], "194582": [132427], "194583": [20887], "194584": [20900], "194585": [20172], "194586": [20908], "194587": [20917], "194588": [168415], "194589": [20981], "194590": [20995], "194591": [13535], "194592": [21051], "194593": [21062], "194594": [21106], "194595": [21111], "194596": [13589], "194597": [21191], "194598": [21193], "194599": [21220], "194600": [21242], "194601": [21253], "194602": [21254], "194603": [21271], "194604": [21321], "194605": [21329], "194606": [21338], "194607": [21363], "194608": [21373], "194609": [21375], "194610": [21375], "194611": [21375], "194612": [133676], "194613": [28784], "194614": [21450], "194615": [21471], "194616": [133987], "194617": [21483], "194618": [21489], "194619": [21510], "194620": [21662], "194621": [21560], "194622": [21576], "194623": [21608], "194624": [21666], "194625": [21750], "194626": [21776], "194627": [21843], "194628": [21859], "194629": [21892], "194630": [21892], "194631": [21913], "194632": [21931], "194633": [21939], "194634": [21954], "194635": [22294], "194636": [22022], "194637": [22295], "194638": [22097], "194639": [22132], "194640": [20999], "194641": [22766], "194642": [22478], "194643": [22516], "194644": [22541], "194645": [22411], "194646": [22578], "194647": [22577], "194648": [22700], "194649": [136420], "194650": [22770], "194651": [22775], "194652": [22790], "194653": [22810], "194654": [22818], "194655": [22882], "194656": [136872], "194657": [136938], "194658": [23020], "194659": [23067], "194660": [23079], "194661": [23000], "194662": [23142], "194663": [14062], "194664": [14076], "194665": [23304], "194666": [23358], "194667": [23358], "194668": [137672], "194669": [23491], "194670": [23512], "194671": [23527], "194672": [23539], "194673": [138008], "194674": [23551], "194675": [23558], "194676": [24403], "194677": [23586], "194678": [14209], "194679": [23648], "194680": [23662], "194681": [23744], "194682": [23693], "194683": [138724], "194684": [23875], "194685": [138726], "194686": [23918], "194687": [23915], "194688": [23932], "194689": [24033], "194690": [24034], "194691": [14383], "194692": [24061], "194693": [24104], "194694": [24125], "194695": [24169], "194696": [14434], "194697": [139651], "194698": [14460], "194699": [24240], "194700": [24243], "194701": [24246], "194702": [24266], "194703": [172946], "194704": [24318], "194705": [140081], "194706": [140081], "194707": [33281], "194708": [24354], "194709": [24354], "194710": [14535], "194711": [144056], "194712": [156122], "194713": [24418], "194714": [24427], "194715": [14563], "194716": [24474], "194717": [24525], "194718": [24535], "194719": [24569], "194720": [24705], "194721": [14650], "194722": [14620], "194723": [24724], "194724": [141012], "194725": [24775], "194726": [24904], "194727": [24908], "194728": [24910], "194729": [24908], "194730": [24954], "194731": [24974], "194732": [25010], "194733": [24996], "194734": [25007], "194735": [25054], "194736": [25074], "194737": [25078], "194738": [25104], "194739": [25115], "194740": [25181], "194741": [25265], "194742": [25300], "194743": [25424], "194744": [142092], "194745": [25405], "194746": [25340], "194747": [25448], "194748": [25475], "194749": [25572], "194750": [142321], "194751": [25634], "194752": [25541], "194753": [25513], "194754": [14894], "194755": [25705], "194756": [25726], "194757": [25757], "194758": [25719], "194759": [14956], "194760": [25935], "194761": [25964], "194762": [143370], "194763": [26083], "194764": [26360], "194765": [26185], "194766": [15129], "194767": [26257], "194768": [15112], "194769": [15076], "194770": [20882], "194771": [20885], "194772": [26368], "194773": [26268], "194774": [32941], "194775": [17369], "194776": [26391], "194777": [26395], "194778": [26401], "194779": [26462], "194780": [26451], "194781": [144323], "194782": [15177], "194783": [26618], "194784": [26501], "194785": [26706], "194786": [26757], "194787": [144493], "194788": [26766], "194789": [26655], "194790": [26900], "194791": [15261], "194792": [26946], "194793": [27043], "194794": [27114], "194795": [27304], "194796": [145059], "194797": [27355], "194798": [15384], "194799": [27425], "194800": [145575], "194801": [27476], "194802": [15438], "194803": [27506], "194804": [27551], "194805": [27578], "194806": [27579], "194807": [146061], "194808": [138507], "194809": [146170], "194810": [27726], "194811": [146620], "194812": [27839], "194813": [27853], "194814": [27751], "194815": [27926], "194816": [27966], "194817": [28023], "194818": [27969], "194819": [28009], "194820": [28024], "194821": [28037], "194822": [146718], "194823": [27956], "194824": [28207], "194825": [28270], "194826": [15667], "194827": [28363], "194828": [28359], "194829": [147153], "194830": [28153], "194831": [28526], "194832": [147294], "194833": [147342], "194834": [28614], "194835": [28729], "194836": [28702], "194837": [28699], "194838": [15766], "194839": [28746], "194840": [28797], "194841": [28791], "194842": [28845], "194843": [132389], "194844": [28997], "194845": [148067], "194846": [29084], "194847": [148395], "194848": [29224], "194849": [29237], "194850": [29264], "194851": [149000], "194852": [29312], "194853": [29333], "194854": [149301], "194855": [149524], "194856": [29562], "194857": [29579], "194858": [16044], "194859": [29605], "194860": [16056], "194861": [16056], "194862": [29767], "194863": [29788], "194864": [29809], "194865": [29829], "194866": [29898], "194867": [16155], "194868": [29988], "194869": [150582], "194870": [30014], "194871": [150674], "194872": [30064], "194873": [139679], "194874": [30224], "194875": [151457], "194876": [151480], "194877": [151620], "194878": [16380], "194879": [16392], "194880": [30452], "194881": [151795], "194882": [151794], "194883": [151833], "194884": [151859], "194885": [30494], "194886": [30495], "194887": [30495], "194888": [30538], "194889": [16441], "194890": [30603], "194891": [16454], "194892": [16534], "194893": [152605], "194894": [30798], "194895": [30860], "194896": [30924], "194897": [16611], "194898": [153126], "194899": [31062], "194900": [153242], "194901": [153285], "194902": [31119], "194903": [31211], "194904": [16687], "194905": [31296], "194906": [31306], "194907": [31311], "194908": [153980], "194909": [154279], "194910": [154279], "194911": [31470], "194912": [16898], "194913": [154539], "194914": [31686], "194915": [31689], "194916": [16935], "194917": [154752], "194918": [31954], "194919": [17056], "194920": [31976], "194921": [31971], "194922": [32000], "194923": [155526], "194924": [32099], "194925": [17153], "194926": [32199], "194927": [32258], "194928": [32325], "194929": [17204], "194930": [156200], "194931": [156231], "194932": [17241], "194933": [156377], "194934": [32634], "194935": [156478], "194936": [32661], "194937": [32762], "194938": [32773], "194939": [156890], "194940": [156963], "194941": [32864], "194942": [157096], "194943": [32880], "194944": [144223], "194945": [17365], "194946": [32946], "194947": [33027], "194948": [17419], "194949": [33086], "194950": [23221], "194951": [157607], "194952": [157621], "194953": [144275], "194954": [144284], "194955": [33281], "194956": [33284], "194957": [36766], "194958": [17515], "194959": [33425], "194960": [33419], "194961": [33437], "194962": [21171], "194963": [33457], "194964": [33459], "194965": [33469], "194966": [33510], "194967": [158524], "194968": [33509], "194969": [33565], "194970": [33635], "194971": [33709], "194972": [33571], "194973": [33725], "194974": [33767], "194975": [33879], "194976": [33619], "194977": [33738], "194978": [33740], "194979": [33756], "194980": [158774], "194981": [159083], "194982": [158933], "194983": [17707], "194984": [34033], "194985": [34035], "194986": [34070], "194987": [160714], "194988": [34148], "194989": [159532], "194990": [17757], "194991": [17761], "194992": [159665], "194993": [159954], "194994": [17771], "194995": [34384], "194996": [34396], "194997": [34407], "194998": [34409], "194999": [34473], "195000": [34440], "195001": [34574], "195002": [34530], "195003": [34681], "195004": [34600], "195005": [34667], "195006": [34694], "195007": [17879], "195008": [34785], "195009": [34817], "195010": [17913], "195011": [34912], "195012": [34915], "195013": [161383], "195014": [35031], "195015": [35038], "195016": [17973], "195017": [35066], "195018": [13499], "195019": [161966], "195020": [162150], "195021": [18110], "195022": [18119], "195023": [35488], "195024": [35565], "195025": [35722], "195026": [35925], "195027": [162984], "195028": [36011], "195029": [36033], "195030": [36123], "195031": [36215], "195032": [163631], "195033": [133124], "195034": [36299], "195035": [36284], "195036": [36336], "195037": [133342], "195038": [36564], "195039": [36664], "195040": [165330], "195041": [165357], "195042": [37012], "195043": [37105], "195044": [37137], "195045": [165678], "195046": [37147], "195047": [37432], "195048": [37591], "195049": [37592], "195050": [37500], "195051": [37881], "195052": [37909], "195053": [166906], "195054": [38283], "195055": [18837], "195056": [38327], "195057": [167287], "195058": [18918], "195059": [38595], "195060": [23986], "195061": [38691], "195062": [168261], "195063": [168474], "195064": [19054], "195065": [19062], "195066": [38880], "195067": [168970], "195068": [19122], "195069": [169110], "195070": [38923], "195071": [38923], "195072": [38953], "195073": [169398], "195074": [39138], "195075": [19251], "195076": [39209], "195077": [39335], "195078": [39362], "195079": [39422], "195080": [19406], "195081": [170800], "195082": [39698], "195083": [40000], "195084": [40189], "195085": [19662], "195086": [19693], "195087": [40295], "195088": [172238], "195089": [19704], "195090": [172293], "195091": [172558], "195092": [172689], "195093": [40635], "195094": [19798], "195095": [40697], "195096": [40702], "195097": [40709], "195098": [40719], "195099": [40726], "195100": [40763], "195101": [173568] };
const COMBINING = { "768": 230, "769": 230, "770": 230, "771": 230, "772": 230, "773": 230, "774": 230, "775": 230, "776": 230, "777": 230, "778": 230, "779": 230, "780": 230, "781": 230, "782": 230, "783": 230, "784": 230, "785": 230, "786": 230, "787": 230, "788": 230, "789": 232, "790": 220, "791": 220, "792": 220, "793": 220, "794": 232, "795": 216, "796": 220, "797": 220, "798": 220, "799": 220, "800": 220, "801": 202, "802": 202, "803": 220, "804": 220, "805": 220, "806": 220, "807": 202, "808": 202, "809": 220, "810": 220, "811": 220, "812": 220, "813": 220, "814": 220, "815": 220, "816": 220, "817": 220, "818": 220, "819": 220, "820": 1, "821": 1, "822": 1, "823": 1, "824": 1, "825": 220, "826": 220, "827": 220, "828": 220, "829": 230, "830": 230, "831": 230, "832": 230, "833": 230, "834": 230, "835": 230, "836": 230, "837": 240, "838": 230, "839": 220, "840": 220, "841": 220, "842": 230, "843": 230, "844": 230, "845": 220, "846": 220, "848": 230, "849": 230, "850": 230, "851": 220, "852": 220, "853": 220, "854": 220, "855": 230, "856": 232, "857": 220, "858": 220, "859": 230, "860": 233, "861": 234, "862": 234, "863": 233, "864": 234, "865": 234, "866": 233, "867": 230, "868": 230, "869": 230, "870": 230, "871": 230, "872": 230, "873": 230, "874": 230, "875": 230, "876": 230, "877": 230, "878": 230, "879": 230, "1155": 230, "1156": 230, "1157": 230, "1158": 230, "1159": 230, "1425": 220, "1426": 230, "1427": 230, "1428": 230, "1429": 230, "1430": 220, "1431": 230, "1432": 230, "1433": 230, "1434": 222, "1435": 220, "1436": 230, "1437": 230, "1438": 230, "1439": 230, "1440": 230, "1441": 230, "1442": 220, "1443": 220, "1444": 220, "1445": 220, "1446": 220, "1447": 220, "1448": 230, "1449": 230, "1450": 220, "1451": 230, "1452": 230, "1453": 222, "1454": 228, "1455": 230, "1456": 10, "1457": 11, "1458": 12, "1459": 13, "1460": 14, "1461": 15, "1462": 16, "1463": 17, "1464": 18, "1465": 19, "1466": 19, "1467": 20, "1468": 21, "1469": 22, "1471": 23, "1473": 24, "1474": 25, "1476": 230, "1477": 220, "1479": 18, "1552": 230, "1553": 230, "1554": 230, "1555": 230, "1556": 230, "1557": 230, "1558": 230, "1559": 230, "1560": 30, "1561": 31, "1562": 32, "1611": 27, "1612": 28, "1613": 29, "1614": 30, "1615": 31, "1616": 32, "1617": 33, "1618": 34, "1619": 230, "1620": 230, "1621": 220, "1622": 220, "1623": 230, "1624": 230, "1625": 230, "1626": 230, "1627": 230, "1628": 220, "1629": 230, "1630": 230, "1631": 220, "1648": 35, "1750": 230, "1751": 230, "1752": 230, "1753": 230, "1754": 230, "1755": 230, "1756": 230, "1759": 230, "1760": 230, "1761": 230, "1762": 230, "1763": 220, "1764": 230, "1767": 230, "1768": 230, "1770": 220, "1771": 230, "1772": 230, "1773": 220, "1809": 36, "1840": 230, "1841": 220, "1842": 230, "1843": 230, "1844": 220, "1845": 230, "1846": 230, "1847": 220, "1848": 220, "1849": 220, "1850": 230, "1851": 220, "1852": 220, "1853": 230, "1854": 220, "1855": 230, "1856": 230, "1857": 230, "1858": 220, "1859": 230, "1860": 220, "1861": 230, "1862": 220, "1863": 230, "1864": 220, "1865": 230, "1866": 230, "2027": 230, "2028": 230, "2029": 230, "2030": 230, "2031": 230, "2032": 230, "2033": 230, "2034": 220, "2035": 230, "2045": 220, "2070": 230, "2071": 230, "2072": 230, "2073": 230, "2075": 230, "2076": 230, "2077": 230, "2078": 230, "2079": 230, "2080": 230, "2081": 230, "2082": 230, "2083": 230, "2085": 230, "2086": 230, "2087": 230, "2089": 230, "2090": 230, "2091": 230, "2092": 230, "2093": 230, "2137": 220, "2138": 220, "2139": 220, "2199": 230, "2200": 230, "2201": 220, "2202": 220, "2203": 220, "2204": 230, "2205": 230, "2206": 230, "2207": 230, "2250": 230, "2251": 230, "2252": 230, "2253": 230, "2254": 230, "2255": 220, "2256": 220, "2257": 220, "2258": 220, "2259": 220, "2260": 230, "2261": 230, "2262": 230, "2263": 230, "2264": 230, "2265": 230, "2266": 230, "2267": 230, "2268": 230, "2269": 230, "2270": 230, "2271": 230, "2272": 230, "2273": 230, "2275": 220, "2276": 230, "2277": 230, "2278": 220, "2279": 230, "2280": 230, "2281": 220, "2282": 230, "2283": 230, "2284": 230, "2285": 220, "2286": 220, "2287": 220, "2288": 27, "2289": 28, "2290": 29, "2291": 230, "2292": 230, "2293": 230, "2294": 220, "2295": 230, "2296": 230, "2297": 220, "2298": 220, "2299": 230, "2300": 230, "2301": 230, "2302": 230, "2303": 230, "2364": 7, "2381": 9, "2385": 230, "2386": 220, "2387": 230, "2388": 230, "2492": 7, "2509": 9, "2558": 230, "2620": 7, "2637": 9, "2748": 7, "2765": 9, "2876": 7, "2893": 9, "3021": 9, "3132": 7, "3149": 9, "3157": 84, "3158": 91, "3260": 7, "3277": 9, "3387": 9, "3388": 9, "3405": 9, "3530": 9, "3640": 103, "3641": 103, "3642": 9, "3656": 107, "3657": 107, "3658": 107, "3659": 107, "3768": 118, "3769": 118, "3770": 9, "3784": 122, "3785": 122, "3786": 122, "3787": 122, "3864": 220, "3865": 220, "3893": 220, "3895": 220, "3897": 216, "3953": 129, "3954": 130, "3956": 132, "3962": 130, "3963": 130, "3964": 130, "3965": 130, "3968": 130, "3970": 230, "3971": 230, "3972": 9, "3974": 230, "3975": 230, "4038": 220, "4151": 7, "4153": 9, "4154": 9, "4237": 220, "4957": 230, "4958": 230, "4959": 230, "5908": 9, "5909": 9, "5940": 9, "6098": 9, "6109": 230, "6313": 228, "6457": 222, "6458": 230, "6459": 220, "6679": 230, "6680": 220, "6752": 9, "6773": 230, "6774": 230, "6775": 230, "6776": 230, "6777": 230, "6778": 230, "6779": 230, "6780": 230, "6783": 220, "6832": 230, "6833": 230, "6834": 230, "6835": 230, "6836": 230, "6837": 220, "6838": 220, "6839": 220, "6840": 220, "6841": 220, "6842": 220, "6843": 230, "6844": 230, "6845": 220, "6847": 220, "6848": 220, "6849": 230, "6850": 230, "6851": 220, "6852": 220, "6853": 230, "6854": 230, "6855": 230, "6856": 230, "6857": 230, "6858": 220, "6859": 230, "6860": 230, "6861": 230, "6862": 230, "6863": 230, "6864": 230, "6865": 230, "6866": 230, "6867": 230, "6868": 230, "6869": 230, "6870": 230, "6871": 230, "6872": 230, "6873": 230, "6874": 230, "6875": 230, "6876": 230, "6877": 220, "6880": 230, "6881": 230, "6882": 230, "6883": 230, "6884": 230, "6885": 230, "6886": 220, "6887": 230, "6888": 230, "6889": 230, "6890": 230, "6891": 234, "6964": 7, "6980": 9, "7019": 230, "7020": 220, "7021": 230, "7022": 230, "7023": 230, "7024": 230, "7025": 230, "7026": 230, "7027": 230, "7082": 9, "7083": 9, "7142": 7, "7154": 9, "7155": 9, "7223": 7, "7376": 230, "7377": 230, "7378": 230, "7380": 1, "7381": 220, "7382": 220, "7383": 220, "7384": 220, "7385": 220, "7386": 230, "7387": 230, "7388": 220, "7389": 220, "7390": 220, "7391": 220, "7392": 230, "7394": 1, "7395": 1, "7396": 1, "7397": 1, "7398": 1, "7399": 1, "7400": 1, "7405": 220, "7412": 230, "7416": 230, "7417": 230, "7616": 230, "7617": 230, "7618": 220, "7619": 230, "7620": 230, "7621": 230, "7622": 230, "7623": 230, "7624": 230, "7625": 230, "7626": 220, "7627": 230, "7628": 230, "7629": 234, "7630": 214, "7631": 220, "7632": 202, "7633": 230, "7634": 230, "7635": 230, "7636": 230, "7637": 230, "7638": 230, "7639": 230, "7640": 230, "7641": 230, "7642": 230, "7643": 230, "7644": 230, "7645": 230, "7646": 230, "7647": 230, "7648": 230, "7649": 230, "7650": 230, "7651": 230, "7652": 230, "7653": 230, "7654": 230, "7655": 230, "7656": 230, "7657": 230, "7658": 230, "7659": 230, "7660": 230, "7661": 230, "7662": 230, "7663": 230, "7664": 230, "7665": 230, "7666": 230, "7667": 230, "7668": 230, "7669": 230, "7670": 232, "7671": 228, "7672": 228, "7673": 220, "7674": 218, "7675": 230, "7676": 233, "7677": 220, "7678": 230, "7679": 220, "8400": 230, "8401": 230, "8402": 1, "8403": 1, "8404": 230, "8405": 230, "8406": 230, "8407": 230, "8408": 1, "8409": 1, "8410": 1, "8411": 230, "8412": 230, "8417": 230, "8421": 1, "8422": 1, "8423": 230, "8424": 220, "8425": 230, "8426": 1, "8427": 1, "8428": 220, "8429": 220, "8430": 220, "8431": 220, "8432": 230, "11503": 230, "11504": 230, "11505": 230, "11647": 9, "11744": 230, "11745": 230, "11746": 230, "11747": 230, "11748": 230, "11749": 230, "11750": 230, "11751": 230, "11752": 230, "11753": 230, "11754": 230, "11755": 230, "11756": 230, "11757": 230, "11758": 230, "11759": 230, "11760": 230, "11761": 230, "11762": 230, "11763": 230, "11764": 230, "11765": 230, "11766": 230, "11767": 230, "11768": 230, "11769": 230, "11770": 230, "11771": 230, "11772": 230, "11773": 230, "11774": 230, "11775": 230, "12330": 218, "12331": 228, "12332": 232, "12333": 222, "12334": 224, "12335": 224, "12441": 8, "12442": 8, "42607": 230, "42612": 230, "42613": 230, "42614": 230, "42615": 230, "42616": 230, "42617": 230, "42618": 230, "42619": 230, "42620": 230, "42621": 230, "42654": 230, "42655": 230, "42736": 230, "42737": 230, "43014": 9, "43052": 9, "43204": 9, "43232": 230, "43233": 230, "43234": 230, "43235": 230, "43236": 230, "43237": 230, "43238": 230, "43239": 230, "43240": 230, "43241": 230, "43242": 230, "43243": 230, "43244": 230, "43245": 230, "43246": 230, "43247": 230, "43248": 230, "43249": 230, "43307": 220, "43308": 220, "43309": 220, "43347": 9, "43443": 7, "43456": 9, "43696": 230, "43698": 230, "43699": 230, "43700": 220, "43703": 230, "43704": 230, "43710": 230, "43711": 230, "43713": 230, "43766": 9, "44013": 9, "64286": 26, "65056": 230, "65057": 230, "65058": 230, "65059": 230, "65060": 230, "65061": 230, "65062": 230, "65063": 220, "65064": 220, "65065": 220, "65066": 220, "65067": 220, "65068": 220, "65069": 220, "65070": 230, "65071": 230, "66045": 220, "66272": 220, "66422": 230, "66423": 230, "66424": 230, "66425": 230, "66426": 230, "68109": 220, "68111": 230, "68152": 230, "68153": 1, "68154": 220, "68159": 9, "68325": 230, "68326": 220, "68900": 230, "68901": 230, "68902": 230, "68903": 230, "68969": 230, "68970": 230, "68971": 230, "68972": 230, "68973": 230, "69291": 230, "69292": 230, "69370": 220, "69371": 220, "69373": 220, "69374": 220, "69375": 220, "69446": 220, "69447": 220, "69448": 230, "69449": 230, "69450": 230, "69451": 220, "69452": 230, "69453": 220, "69454": 220, "69455": 220, "69456": 220, "69506": 230, "69507": 220, "69508": 230, "69509": 220, "69702": 9, "69744": 9, "69759": 9, "69817": 9, "69818": 7, "69888": 230, "69889": 230, "69890": 230, "69939": 9, "69940": 9, "70003": 7, "70080": 9, "70090": 7, "70197": 9, "70198": 7, "70377": 7, "70378": 9, "70459": 7, "70460": 7, "70477": 9, "70502": 230, "70503": 230, "70504": 230, "70505": 230, "70506": 230, "70507": 230, "70508": 230, "70512": 230, "70513": 230, "70514": 230, "70515": 230, "70516": 230, "70606": 9, "70607": 9, "70608": 9, "70722": 9, "70726": 7, "70750": 230, "70850": 9, "70851": 7, "71103": 9, "71104": 7, "71231": 9, "71350": 9, "71351": 7, "71467": 9, "71737": 9, "71738": 7, "71997": 9, "71998": 9, "72003": 7, "72160": 9, "72244": 9, "72263": 9, "72345": 9, "72767": 9, "73026": 7, "73028": 9, "73029": 9, "73111": 9, "73537": 9, "73538": 9, "90415": 9, "92912": 1, "92913": 1, "92914": 1, "92915": 1, "92916": 1, "92976": 230, "92977": 230, "92978": 230, "92979": 230, "92980": 230, "92981": 230, "92982": 230, "94192": 6, "94193": 6, "113822": 1, "119141": 216, "119142": 216, "119143": 1, "119144": 1, "119145": 1, "119149": 226, "119150": 216, "119151": 216, "119152": 216, "119153": 216, "119154": 216, "119163": 220, "119164": 220, "119165": 220, "119166": 220, "119167": 220, "119168": 220, "119169": 220, "119170": 220, "119173": 230, "119174": 230, "119175": 230, "119176": 230, "119177": 230, "119178": 220, "119179": 220, "119210": 230, "119211": 230, "119212": 230, "119213": 230, "119362": 230, "119363": 230, "119364": 230, "122880": 230, "122881": 230, "122882": 230, "122883": 230, "122884": 230, "122885": 230, "122886": 230, "122888": 230, "122889": 230, "122890": 230, "122891": 230, "122892": 230, "122893": 230, "122894": 230, "122895": 230, "122896": 230, "122897": 230, "122898": 230, "122899": 230, "122900": 230, "122901": 230, "122902": 230, "122903": 230, "122904": 230, "122907": 230, "122908": 230, "122909": 230, "122910": 230, "122911": 230, "122912": 230, "122913": 230, "122915": 230, "122916": 230, "122918": 230, "122919": 230, "122920": 230, "122921": 230, "122922": 230, "123023": 230, "123184": 230, "123185": 230, "123186": 230, "123187": 230, "123188": 230, "123189": 230, "123190": 230, "123566": 230, "123628": 230, "123629": 230, "123630": 230, "123631": 230, "124140": 232, "124141": 232, "124142": 220, "124143": 230, "124398": 230, "124399": 220, "124643": 230, "124646": 230, "124654": 230, "124655": 230, "124661": 230, "125136": 220, "125137": 220, "125138": 220, "125139": 220, "125140": 220, "125141": 220, "125142": 220, "125252": 230, "125253": 230, "125254": 230, "125255": 230, "125256": 230, "125257": 230, "125258": 7 };
const COMPOSITION = { "65,768": 192, "65,769": 193, "65,770": 194, "65,771": 195, "65,776": 196, "65,778": 197, "67,807": 199, "69,768": 200, "69,769": 201, "69,770": 202, "69,776": 203, "73,768": 204, "73,769": 205, "73,770": 206, "73,776": 207, "78,771": 209, "79,768": 210, "79,769": 211, "79,770": 212, "79,771": 213, "79,776": 214, "85,768": 217, "85,769": 218, "85,770": 219, "85,776": 220, "89,769": 221, "97,768": 224, "97,769": 225, "97,770": 226, "97,771": 227, "97,776": 228, "97,778": 229, "99,807": 231, "101,768": 232, "101,769": 233, "101,770": 234, "101,776": 235, "105,768": 236, "105,769": 237, "105,770": 238, "105,776": 239, "110,771": 241, "111,768": 242, "111,769": 243, "111,770": 244, "111,771": 245, "111,776": 246, "117,768": 249, "117,769": 250, "117,770": 251, "117,776": 252, "121,769": 253, "121,776": 255, "65,772": 256, "97,772": 257, "65,774": 258, "97,774": 259, "65,808": 260, "97,808": 261, "67,769": 262, "99,769": 263, "67,770": 264, "99,770": 265, "67,775": 266, "99,775": 267, "67,780": 268, "99,780": 269, "68,780": 270, "100,780": 271, "69,772": 274, "101,772": 275, "69,774": 276, "101,774": 277, "69,775": 278, "101,775": 279, "69,808": 280, "101,808": 281, "69,780": 282, "101,780": 283, "71,770": 284, "103,770": 285, "71,774": 286, "103,774": 287, "71,775": 288, "103,775": 289, "71,807": 290, "103,807": 291, "72,770": 292, "104,770": 293, "73,771": 296, "105,771": 297, "73,772": 298, "105,772": 299, "73,774": 300, "105,774": 301, "73,808": 302, "105,808": 303, "73,775": 304, "74,770": 308, "106,770": 309, "75,807": 310, "107,807": 311, "76,769": 313, "108,769": 314, "76,807": 315, "108,807": 316, "76,780": 317, "108,780": 318, "78,769": 323, "110,769": 324, "78,807": 325, "110,807": 326, "78,780": 327, "110,780": 328, "79,772": 332, "111,772": 333, "79,774": 334, "111,774": 335, "79,779": 336, "111,779": 337, "82,769": 340, "114,769": 341, "82,807": 342, "114,807": 343, "82,780": 344, "114,780": 345, "83,769": 346, "115,769": 347, "83,770": 348, "115,770": 349, "83,807": 350, "115,807": 351, "83,780": 352, "115,780": 353, "84,807": 354, "116,807": 355, "84,780": 356, "116,780": 357, "85,771": 360, "117,771": 361, "85,772": 362, "117,772": 363, "85,774": 364, "117,774": 365, "85,778": 366, "117,778": 367, "85,779": 368, "117,779": 369, "85,808": 370, "117,808": 371, "87,770": 372, "119,770": 373, "89,770": 374, "121,770": 375, "89,776": 376, "90,769": 377, "122,769": 378, "90,775": 379, "122,775": 380, "90,780": 381, "122,780": 382, "79,795": 416, "111,795": 417, "85,795": 431, "117,795": 432, "65,780": 461, "97,780": 462, "73,780": 463, "105,780": 464, "79,780": 465, "111,780": 466, "85,780": 467, "117,780": 468, "220,772": 469, "252,772": 470, "220,769": 471, "252,769": 472, "220,780": 473, "252,780": 474, "220,768": 475, "252,768": 476, "196,772": 478, "228,772": 479, "550,772": 480, "551,772": 481, "198,772": 482, "230,772": 483, "71,780": 486, "103,780": 487, "75,780": 488, "107,780": 489, "79,808": 490, "111,808": 491, "490,772": 492, "491,772": 493, "439,780": 494, "658,780": 495, "106,780": 496, "71,769": 500, "103,769": 501, "78,768": 504, "110,768": 505, "197,769": 506, "229,769": 507, "198,769": 508, "230,769": 509, "216,769": 510, "248,769": 511, "65,783": 512, "97,783": 513, "65,785": 514, "97,785": 515, "69,783": 516, "101,783": 517, "69,785": 518, "101,785": 519, "73,783": 520, "105,783": 521, "73,785": 522, "105,785": 523, "79,783": 524, "111,783": 525, "79,785": 526, "111,785": 527, "82,783": 528, "114,783": 529, "82,785": 530, "114,785": 531, "85,783": 532, "117,783": 533, "85,785": 534, "117,785": 535, "83,806": 536, "115,806": 537, "84,806": 538, "116,806": 539, "72,780": 542, "104,780": 543, "65,775": 550, "97,775": 551, "69,807": 552, "101,807": 553, "214,772": 554, "246,772": 555, "213,772": 556, "245,772": 557, "79,775": 558, "111,775": 559, "558,772": 560, "559,772": 561, "89,772": 562, "121,772": 563, "168,769": 901, "913,769": 902, "917,769": 904, "919,769": 905, "921,769": 906, "927,769": 908, "933,769": 910, "937,769": 911, "970,769": 912, "921,776": 938, "933,776": 939, "945,769": 940, "949,769": 941, "951,769": 942, "953,769": 943, "971,769": 944, "953,776": 970, "965,776": 971, "959,769": 972, "965,769": 973, "969,769": 974, "978,769": 979, "978,776": 980, "1045,768": 1024, "1045,776": 1025, "1043,769": 1027, "1030,776": 1031, "1050,769": 1036, "1048,768": 1037, "1059,774": 1038, "1048,774": 1049, "1080,774": 1081, "1077,768": 1104, "1077,776": 1105, "1075,769": 1107, "1110,776": 1111, "1082,769": 1116, "1080,768": 1117, "1091,774": 1118, "1140,783": 1142, "1141,783": 1143, "1046,774": 1217, "1078,774": 1218, "1040,774": 1232, "1072,774": 1233, "1040,776": 1234, "1072,776": 1235, "1045,774": 1238, "1077,774": 1239, "1240,776": 1242, "1241,776": 1243, "1046,776": 1244, "1078,776": 1245, "1047,776": 1246, "1079,776": 1247, "1048,772": 1250, "1080,772": 1251, "1048,776": 1252, "1080,776": 1253, "1054,776": 1254, "1086,776": 1255, "1256,776": 1258, "1257,776": 1259, "1069,776": 1260, "1101,776": 1261, "1059,772": 1262, "1091,772": 1263, "1059,776": 1264, "1091,776": 1265, "1059,779": 1266, "1091,779": 1267, "1063,776": 1268, "1095,776": 1269, "1067,776": 1272, "1099,776": 1273, "1575,1619": 1570, "1575,1620": 1571, "1608,1620": 1572, "1575,1621": 1573, "1610,1620": 1574, "1749,1620": 1728, "1729,1620": 1730, "1746,1620": 1747, "2344,2364": 2345, "2352,2364": 2353, "2355,2364": 2356, "2503,2494": 2507, "2503,2519": 2508, "2887,2902": 2888, "2887,2878": 2891, "2887,2903": 2892, "2962,3031": 2964, "3014,3006": 3018, "3015,3006": 3019, "3014,3031": 3020, "3142,3158": 3144, "3263,3285": 3264, "3270,3285": 3271, "3270,3286": 3272, "3270,3266": 3274, "3274,3285": 3275, "3398,3390": 3402, "3399,3390": 3403, "3398,3415": 3404, "3545,3530": 3546, "3545,3535": 3548, "3548,3530": 3549, "3545,3551": 3550, "4133,4142": 4134, "6917,6965": 6918, "6919,6965": 6920, "6921,6965": 6922, "6923,6965": 6924, "6925,6965": 6926, "6929,6965": 6930, "6970,6965": 6971, "6972,6965": 6973, "6974,6965": 6976, "6975,6965": 6977, "6978,6965": 6979, "65,805": 7680, "97,805": 7681, "66,775": 7682, "98,775": 7683, "66,803": 7684, "98,803": 7685, "66,817": 7686, "98,817": 7687, "199,769": 7688, "231,769": 7689, "68,775": 7690, "100,775": 7691, "68,803": 7692, "100,803": 7693, "68,817": 7694, "100,817": 7695, "68,807": 7696, "100,807": 7697, "68,813": 7698, "100,813": 7699, "274,768": 7700, "275,768": 7701, "274,769": 7702, "275,769": 7703, "69,813": 7704, "101,813": 7705, "69,816": 7706, "101,816": 7707, "552,774": 7708, "553,774": 7709, "70,775": 7710, "102,775": 7711, "71,772": 7712, "103,772": 7713, "72,775": 7714, "104,775": 7715, "72,803": 7716, "104,803": 7717, "72,776": 7718, "104,776": 7719, "72,807": 7720, "104,807": 7721, "72,814": 7722, "104,814": 7723, "73,816": 7724, "105,816": 7725, "207,769": 7726, "239,769": 7727, "75,769": 7728, "107,769": 7729, "75,803": 7730, "107,803": 7731, "75,817": 7732, "107,817": 7733, "76,803": 7734, "108,803": 7735, "7734,772": 7736, "7735,772": 7737, "76,817": 7738, "108,817": 7739, "76,813": 7740, "108,813": 7741, "77,769": 7742, "109,769": 7743, "77,775": 7744, "109,775": 7745, "77,803": 7746, "109,803": 7747, "78,775": 7748, "110,775": 7749, "78,803": 7750, "110,803": 7751, "78,817": 7752, "110,817": 7753, "78,813": 7754, "110,813": 7755, "213,769": 7756, "245,769": 7757, "213,776": 7758, "245,776": 7759, "332,768": 7760, "333,768": 7761, "332,769": 7762, "333,769": 7763, "80,769": 7764, "112,769": 7765, "80,775": 7766, "112,775": 7767, "82,775": 7768, "114,775": 7769, "82,803": 7770, "114,803": 7771, "7770,772": 7772, "7771,772": 7773, "82,817": 7774, "114,817": 7775, "83,775": 7776, "115,775": 7777, "83,803": 7778, "115,803": 7779, "346,775": 7780, "347,775": 7781, "352,775": 7782, "353,775": 7783, "7778,775": 7784, "7779,775": 7785, "84,775": 7786, "116,775": 7787, "84,803": 7788, "116,803": 7789, "84,817": 7790, "116,817": 7791, "84,813": 7792, "116,813": 7793, "85,804": 7794, "117,804": 7795, "85,816": 7796, "117,816": 7797, "85,813": 7798, "117,813": 7799, "360,769": 7800, "361,769": 7801, "362,776": 7802, "363,776": 7803, "86,771": 7804, "118,771": 7805, "86,803": 7806, "118,803": 7807, "87,768": 7808, "119,768": 7809, "87,769": 7810, "119,769": 7811, "87,776": 7812, "119,776": 7813, "87,775": 7814, "119,775": 7815, "87,803": 7816, "119,803": 7817, "88,775": 7818, "120,775": 7819, "88,776": 7820, "120,776": 7821, "89,775": 7822, "121,775": 7823, "90,770": 7824, "122,770": 7825, "90,803": 7826, "122,803": 7827, "90,817": 7828, "122,817": 7829, "104,817": 7830, "116,776": 7831, "119,778": 7832, "121,778": 7833, "383,775": 7835, "65,803": 7840, "97,803": 7841, "65,777": 7842, "97,777": 7843, "194,769": 7844, "226,769": 7845, "194,768": 7846, "226,768": 7847, "194,777": 7848, "226,777": 7849, "194,771": 7850, "226,771": 7851, "7840,770": 7852, "7841,770": 7853, "258,769": 7854, "259,769": 7855, "258,768": 7856, "259,768": 7857, "258,777": 7858, "259,777": 7859, "258,771": 7860, "259,771": 7861, "7840,774": 7862, "7841,774": 7863, "69,803": 7864, "101,803": 7865, "69,777": 7866, "101,777": 7867, "69,771": 7868, "101,771": 7869, "202,769": 7870, "234,769": 7871, "202,768": 7872, "234,768": 7873, "202,777": 7874, "234,777": 7875, "202,771": 7876, "234,771": 7877, "7864,770": 7878, "7865,770": 7879, "73,777": 7880, "105,777": 7881, "73,803": 7882, "105,803": 7883, "79,803": 7884, "111,803": 7885, "79,777": 7886, "111,777": 7887, "212,769": 7888, "244,769": 7889, "212,768": 7890, "244,768": 7891, "212,777": 7892, "244,777": 7893, "212,771": 7894, "244,771": 7895, "7884,770": 7896, "7885,770": 7897, "416,769": 7898, "417,769": 7899, "416,768": 7900, "417,768": 7901, "416,777": 7902, "417,777": 7903, "416,771": 7904, "417,771": 7905, "416,803": 7906, "417,803": 7907, "85,803": 7908, "117,803": 7909, "85,777": 7910, "117,777": 7911, "431,769": 7912, "432,769": 7913, "431,768": 7914, "432,768": 7915, "431,777": 7916, "432,777": 7917, "431,771": 7918, "432,771": 7919, "431,803": 7920, "432,803": 7921, "89,768": 7922, "121,768": 7923, "89,803": 7924, "121,803": 7925, "89,777": 7926, "121,777": 7927, "89,771": 7928, "121,771": 7929, "945,787": 7936, "945,788": 7937, "7936,768": 7938, "7937,768": 7939, "7936,769": 7940, "7937,769": 7941, "7936,834": 7942, "7937,834": 7943, "913,787": 7944, "913,788": 7945, "7944,768": 7946, "7945,768": 7947, "7944,769": 7948, "7945,769": 7949, "7944,834": 7950, "7945,834": 7951, "949,787": 7952, "949,788": 7953, "7952,768": 7954, "7953,768": 7955, "7952,769": 7956, "7953,769": 7957, "917,787": 7960, "917,788": 7961, "7960,768": 7962, "7961,768": 7963, "7960,769": 7964, "7961,769": 7965, "951,787": 7968, "951,788": 7969, "7968,768": 7970, "7969,768": 7971, "7968,769": 7972, "7969,769": 7973, "7968,834": 7974, "7969,834": 7975, "919,787": 7976, "919,788": 7977, "7976,768": 7978, "7977,768": 7979, "7976,769": 7980, "7977,769": 7981, "7976,834": 7982, "7977,834": 7983, "953,787": 7984, "953,788": 7985, "7984,768": 7986, "7985,768": 7987, "7984,769": 7988, "7985,769": 7989, "7984,834": 7990, "7985,834": 7991, "921,787": 7992, "921,788": 7993, "7992,768": 7994, "7993,768": 7995, "7992,769": 7996, "7993,769": 7997, "7992,834": 7998, "7993,834": 7999, "959,787": 8000, "959,788": 8001, "8000,768": 8002, "8001,768": 8003, "8000,769": 8004, "8001,769": 8005, "927,787": 8008, "927,788": 8009, "8008,768": 8010, "8009,768": 8011, "8008,769": 8012, "8009,769": 8013, "965,787": 8016, "965,788": 8017, "8016,768": 8018, "8017,768": 8019, "8016,769": 8020, "8017,769": 8021, "8016,834": 8022, "8017,834": 8023, "933,788": 8025, "8025,768": 8027, "8025,769": 8029, "8025,834": 8031, "969,787": 8032, "969,788": 8033, "8032,768": 8034, "8033,768": 8035, "8032,769": 8036, "8033,769": 8037, "8032,834": 8038, "8033,834": 8039, "937,787": 8040, "937,788": 8041, "8040,768": 8042, "8041,768": 8043, "8040,769": 8044, "8041,769": 8045, "8040,834": 8046, "8041,834": 8047, "945,768": 8048, "949,768": 8050, "951,768": 8052, "953,768": 8054, "959,768": 8056, "965,768": 8058, "969,768": 8060, "7936,837": 8064, "7937,837": 8065, "7938,837": 8066, "7939,837": 8067, "7940,837": 8068, "7941,837": 8069, "7942,837": 8070, "7943,837": 8071, "7944,837": 8072, "7945,837": 8073, "7946,837": 8074, "7947,837": 8075, "7948,837": 8076, "7949,837": 8077, "7950,837": 8078, "7951,837": 8079, "7968,837": 8080, "7969,837": 8081, "7970,837": 8082, "7971,837": 8083, "7972,837": 8084, "7973,837": 8085, "7974,837": 8086, "7975,837": 8087, "7976,837": 8088, "7977,837": 8089, "7978,837": 8090, "7979,837": 8091, "7980,837": 8092, "7981,837": 8093, "7982,837": 8094, "7983,837": 8095, "8032,837": 8096, "8033,837": 8097, "8034,837": 8098, "8035,837": 8099, "8036,837": 8100, "8037,837": 8101, "8038,837": 8102, "8039,837": 8103, "8040,837": 8104, "8041,837": 8105, "8042,837": 8106, "8043,837": 8107, "8044,837": 8108, "8045,837": 8109, "8046,837": 8110, "8047,837": 8111, "945,774": 8112, "945,772": 8113, "8048,837": 8114, "945,837": 8115, "940,837": 8116, "945,834": 8118, "8118,837": 8119, "913,774": 8120, "913,772": 8121, "913,768": 8122, "913,837": 8124, "168,834": 8129, "8052,837": 8130, "951,837": 8131, "942,837": 8132, "951,834": 8134, "8134,837": 8135, "917,768": 8136, "919,768": 8138, "919,837": 8140, "8127,768": 8141, "8127,769": 8142, "8127,834": 8143, "953,774": 8144, "953,772": 8145, "970,768": 8146, "953,834": 8150, "970,834": 8151, "921,774": 8152, "921,772": 8153, "921,768": 8154, "8190,768": 8157, "8190,769": 8158, "8190,834": 8159, "965,774": 8160, "965,772": 8161, "971,768": 8162, "961,787": 8164, "961,788": 8165, "965,834": 8166, "971,834": 8167, "933,774": 8168, "933,772": 8169, "933,768": 8170, "929,788": 8172, "168,768": 8173, "8060,837": 8178, "969,837": 8179, "974,837": 8180, "969,834": 8182, "8182,837": 8183, "927,768": 8184, "937,768": 8186, "937,837": 8188, "8592,824": 8602, "8594,824": 8603, "8596,824": 8622, "8656,824": 8653, "8660,824": 8654, "8658,824": 8655, "8707,824": 8708, "8712,824": 8713, "8715,824": 8716, "8739,824": 8740, "8741,824": 8742, "8764,824": 8769, "8771,824": 8772, "8773,824": 8775, "8776,824": 8777, "61,824": 8800, "8801,824": 8802, "8781,824": 8813, "60,824": 8814, "62,824": 8815, "8804,824": 8816, "8805,824": 8817, "8818,824": 8820, "8819,824": 8821, "8822,824": 8824, "8823,824": 8825, "8826,824": 8832, "8827,824": 8833, "8834,824": 8836, "8835,824": 8837, "8838,824": 8840, "8839,824": 8841, "8866,824": 8876, "8872,824": 8877, "8873,824": 8878, "8875,824": 8879, "8828,824": 8928, "8829,824": 8929, "8849,824": 8930, "8850,824": 8931, "8882,824": 8938, "8883,824": 8939, "8884,824": 8940, "8885,824": 8941, "12363,12441": 12364, "12365,12441": 12366, "12367,12441": 12368, "12369,12441": 12370, "12371,12441": 12372, "12373,12441": 12374, "12375,12441": 12376, "12377,12441": 12378, "12379,12441": 12380, "12381,12441": 12382, "12383,12441": 12384, "12385,12441": 12386, "12388,12441": 12389, "12390,12441": 12391, "12392,12441": 12393, "12399,12441": 12400, "12399,12442": 12401, "12402,12441": 12403, "12402,12442": 12404, "12405,12441": 12406, "12405,12442": 12407, "12408,12441": 12409, "12408,12442": 12410, "12411,12441": 12412, "12411,12442": 12413, "12358,12441": 12436, "12445,12441": 12446, "12459,12441": 12460, "12461,12441": 12462, "12463,12441": 12464, "12465,12441": 12466, "12467,12441": 12468, "12469,12441": 12470, "12471,12441": 12472, "12473,12441": 12474, "12475,12441": 12476, "12477,12441": 12478, "12479,12441": 12480, "12481,12441": 12482, "12484,12441": 12485, "12486,12441": 12487, "12488,12441": 12489, "12495,12441": 12496, "12495,12442": 12497, "12498,12441": 12499, "12498,12442": 12500, "12501,12441": 12502, "12501,12442": 12503, "12504,12441": 12505, "12504,12442": 12506, "12507,12441": 12508, "12507,12442": 12509, "12454,12441": 12532, "12527,12441": 12535, "12528,12441": 12536, "12529,12441": 12537, "12530,12441": 12538, "12541,12441": 12542, "67026,775": 67017, "67034,775": 67044, "69785,69818": 69786, "69787,69818": 69788, "69797,69818": 69803, "69937,69927": 69934, "69938,69927": 69935, "70471,70462": 70475, "70471,70487": 70476, "70530,70601": 70531, "70532,70587": 70533, "70539,70594": 70542, "70544,70601": 70545, "70594,70594": 70597, "70594,70584": 70599, "70594,70601": 70600, "70841,70842": 70843, "70841,70832": 70844, "70841,70845": 70846, "71096,71087": 71098, "71097,71087": 71099, "71989,71984": 71992, "90398,90398": 90401, "90398,90409": 90402, "90398,90399": 90403, "90409,90399": 90404, "90398,90400": 90405, "90401,90399": 90406, "90402,90399": 90407, "90401,90400": 90408, "93543,93543": 93544, "93539,93543": 93545, "93545,93543": 93546 };


/***/ },

/***/ "./src/domain/unicode-normalization.ts"
/*!*********************************************!*\
  !*** ./src/domain/unicode-normalization.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unicode17NFC: () => (/* binding */ unicode17NFC),
/* harmony export */   unicode17NFD: () => (/* binding */ unicode17NFD)
/* harmony export */ });
/* harmony import */ var _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unicode-normalization-data */ "./src/domain/unicode-normalization-data.ts");

const S_BASE = 0xac00, L_BASE = 0x1100, V_BASE = 0x1161, T_BASE = 0x11a7, L_COUNT = 19, V_COUNT = 21, T_COUNT = 28, N_COUNT = V_COUNT * T_COUNT, S_COUNT = L_COUNT * N_COUNT;
const ccc = (cp) => _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.COMBINING[String(cp)] ?? 0;
function decompose(cp, result) {
    const syllable = cp - S_BASE;
    if (syllable >= 0 && syllable < S_COUNT) {
        result.push(L_BASE + Math.floor(syllable / N_COUNT), V_BASE + Math.floor((syllable % N_COUNT) / T_COUNT));
        const tail = syllable % T_COUNT;
        if (tail)
            result.push(T_BASE + tail);
        return;
    }
    const mapping = _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.DECOMPOSITION[String(cp)];
    if (mapping)
        for (const value of mapping)
            decompose(value, result);
    else
        result.push(cp);
}
function decomposed(text) {
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text))
        throw new Error('Malformed Unicode scalar text.');
    const raw = [];
    for (const char of text)
        decompose(char.codePointAt(0), raw);
    const result = [], marks = [];
    const flush = () => { marks.sort((a, b) => ccc(a) - ccc(b)); for (const cp of marks)
        result.push(cp); marks.length = 0; };
    for (const cp of raw) {
        if (ccc(cp) === 0) {
            flush();
            result.push(cp);
        }
        else
            marks.push(cp);
    }
    flush();
    return result;
}
const stringOf = (values) => values.map(cp => String.fromCodePoint(cp)).join('');
const unicode17NFD = (text) => stringOf(decomposed(text));
function composedPair(first, second) {
    const leading = first - L_BASE, vowel = second - V_BASE;
    if (leading >= 0 && leading < L_COUNT && vowel >= 0 && vowel < V_COUNT)
        return S_BASE + (leading * V_COUNT + vowel) * T_COUNT;
    const syllable = first - S_BASE, tail = second - T_BASE;
    if (syllable >= 0 && syllable < S_COUNT && syllable % T_COUNT === 0 && tail > 0 && tail < T_COUNT)
        return first + tail;
    return _unicode_normalization_data__WEBPACK_IMPORTED_MODULE_0__.COMPOSITION[`${first},${second}`];
}
function unicode17NFC(text) {
    const input = decomposed(text);
    if (!input.length)
        return '';
    const result = [input[0]];
    let starter = 0, lastClass = ccc(input[0]);
    for (let i = 1; i < input.length; i++) {
        const cp = input[i], currentClass = ccc(cp), combined = composedPair(result[starter], cp);
        if (combined !== undefined && (lastClass < currentClass || lastClass === 0)) {
            result[starter] = combined;
        }
        else {
            if (currentClass === 0)
                starter = result.length;
            result.push(cp);
            lastClass = currentClass;
        }
    }
    return stringOf(result);
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

/***/ "./src/domain/workspace.ts"
/*!*********************************!*\
  !*** ./src/domain/workspace.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILTIN_DECISION_TYPES: () => (/* binding */ BUILTIN_DECISION_TYPES),
/* harmony export */   CHARACTER_PROMPTS: () => (/* binding */ CHARACTER_PROMPTS),
/* harmony export */   PERSONALITY_LABELS: () => (/* reexport safe */ _personality__WEBPACK_IMPORTED_MODULE_3__.PERSONALITY_LABELS),
/* harmony export */   WorkspaceValidationError: () => (/* binding */ WorkspaceValidationError),
/* harmony export */   affiliationHistory: () => (/* binding */ affiliationHistory),
/* harmony export */   appendMovedGroupOrder: () => (/* binding */ appendMovedGroupOrder),
/* harmony export */   assertWorkspaceState: () => (/* binding */ assertWorkspaceState),
/* harmony export */   canonicalCodeKey: () => (/* reexport safe */ _code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey),
/* harmony export */   characterCompleteness: () => (/* binding */ characterCompleteness),
/* harmony export */   compareOptionalDates: () => (/* binding */ compareOptionalDates),
/* harmony export */   decisionResolved: () => (/* binding */ decisionResolved),
/* harmony export */   factionCompleteness: () => (/* binding */ factionCompleteness),
/* harmony export */   nextGroupOrder: () => (/* binding */ nextGroupOrder),
/* harmony export */   normalizeCharacter: () => (/* binding */ normalizeCharacter),
/* harmony export */   normalizeFaction: () => (/* binding */ normalizeFaction),
/* harmony export */   orderedChapters: () => (/* binding */ orderedChapters),
/* harmony export */   orderedDated: () => (/* binding */ orderedDated),
/* harmony export */   orderedPlots: () => (/* binding */ orderedPlots),
/* harmony export */   ownerKindForType: () => (/* binding */ ownerKindForType),
/* harmony export */   recordCategory: () => (/* binding */ recordCategory),
/* harmony export */   synchronizedBirth: () => (/* binding */ synchronizedBirth),
/* harmony export */   trimmedCode: () => (/* reexport safe */ _code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode),
/* harmony export */   updateRecordCalendar: () => (/* binding */ updateRecordCalendar),
/* harmony export */   validWorkspaceData: () => (/* binding */ validWorkspaceData),
/* harmony export */   validateWorkspaceRecord: () => (/* binding */ validateWorkspaceRecord),
/* harmony export */   visibleRecord: () => (/* binding */ visibleRecord),
/* harmony export */   writingContextDecisions: () => (/* binding */ writingContextDecisions)
/* harmony export */ });
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation */ "./src/domain/validation.ts");
/* harmony import */ var _calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _manuscript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manuscript */ "./src/domain/manuscript.ts");
/* harmony import */ var _personality__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./personality */ "./src/domain/personality.ts");
/* harmony import */ var _code_fold__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./code-fold */ "./src/domain/code-fold.ts");






const recordCategory = { story: 'stories', volume: 'volumes', chapter: 'chapters', plot: 'plots', 'decision-context': 'decision-context', calendar: 'calendars', event: 'events', decision: 'decisions', 'decision-type': 'decision-types', character: 'characters', faction: 'factions', affiliation: 'affiliations', view: 'views' };
const ownerKindForType = (type) => ['story', 'volume', 'chapter', 'plot', 'decision-context'].includes(type) ? 'project' : 'universe';
class WorkspaceValidationError extends Error {
    field;
    constructor(message, field = '') {
        super(message);
        this.field = field;
        this.name = 'WorkspaceValidationError';
    }
}
const fail = (message, field = '') => { throw new WorkspaceValidationError(message, field); };
const named = (v) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v) && !!v.trim();
const nullable = (v, f) => v === null || f(v);
const ids = (v) => Array.isArray(v) && v.every(_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && new Set(v).size === v.length;
const texts = (v, fields) => fields.every(k => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v[k]));
const maker = (v) => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['kind', 'id']) && (v.kind === 'character' || v.kind === 'faction') && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id);
const image = (v) => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['id', 'sha256', 'mediaType']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) && typeof v.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.sha256) && ['image/png', 'image/jpeg', 'image/webp'].includes(v.mediaType);
const code = (v) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v) && !!(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode)(v) && v === (0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.trimmedCode)(v);
const exactDecimal = (v, signed) => typeof v === 'string' && (signed ? /^(?:0|-?[1-9][0-9]*)(?:\.[0-9]+)?$|^-0\.[0-9]*[1-9][0-9]*$/ : /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/).test(v);
const CHARACTER_FIELDS = ['rankTitle', 'background', 'description', 'motivation', 'weaknesses', 'strengths', 'specialities'];
const FACTION_TEXT = ['description', 'governmentType', 'governmentNotes', 'leaderName', 'leaderAge', 'leaderReputation', 'leaderProfile', 'militaryHead', 'intelligenceHead', 'overview', 'strengths', 'weaknesses', 'population', 'resources', 'culture'];
const flagKeys = (v) => typeof v === 'object' && v !== null && Object.hasOwn(v, 'calendarUpdateRequired') ? ['calendarUpdateRequired'] : [];
const calendarFlag = (v) => !flagKeys(v).length || typeof v.calendarUpdateRequired === 'boolean';
function validWorkspaceData(type, v) {
    switch (type) {
        case 'story': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'creationSequence', 'order', 'volumeId', 'chapterTarget']) && named(v.title) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.creationSequence) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.volumeId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && nullable(v.chapterTarget, _calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger);
        case 'volume': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'order']) && named(v.title) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order);
        case 'chapter': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['title', 'storyId', 'creationSequence', 'start', 'end', 'characterIds', 'events', 'wordTarget', 'calendarUpdateRequired', 'formatting']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(v.title) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.creationSequence) && nullable(v.start, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && nullable(v.end, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && ids(v.characterIds) && Array.isArray(v.events) && v.events.every(e => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(e, ['eventId', 'role']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(e.eventId) && ['main', 'flashback'].includes(e.role)) && new Set(v.events.map(e => e.eventId)).size === v.events.length && nullable(v.wordTarget, _calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger) && typeof v.calendarUpdateRequired === 'boolean' && (0,_manuscript__WEBPACK_IMPORTED_MODULE_2__.validChapterFormatting)(v.formatting);
        case 'plot': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'storyId', 'heading', 'date', 'order']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && named(v.heading) && nullable(v.date, _calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order);
        case 'decision-context': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['storyId', 'decisionId']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.storyId) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.decisionId);
        case 'calendar': return (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validCalendarData)(v);
        case 'event': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'heading', 'description', 'date', 'code', 'order', 'maker', 'kind', 'characterId']) && named(v.heading) && nullable(v.description, _calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && code(v.code) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.maker, maker) && ['ordinary', 'birth', 'background'].includes(v.kind) && nullable(v.characterId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.kind === 'ordinary' ? v.characterId === null : v.characterId !== null);
        case 'decision': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'text', 'date', 'typeId', 'code', 'order', 'maker', 'characterIds', 'eventIds', 'followingDecisionIds']) && named(v.text) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.typeId) && code(v.code) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.maker, maker) && ids(v.characterIds) && ids(v.eventIds) && ids(v.followingDecisionIds);
        case 'decision-type': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['name', 'makerRequired', 'builtin']) && named(v.name) && v.name === v.name.trim() && typeof v.makerRequired === 'boolean' && (v.builtin === null || v.builtin === 'personal' && v.name === 'Personal Decisions' && v.makerRequired || v.builtin === 'story' && v.name === 'Story Decisions' && !v.makerRequired);
        case 'character': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'name', 'type', ...CHARACTER_FIELDS, 'waivers', 'personalities', 'image', 'birth', 'birthEventId']) && named(v.name) && ['main', 'major', 'minor', 'extra'].includes(v.type) && texts(v, CHARACTER_FIELDS) && Array.isArray(v.waivers) && v.waivers.every(w => CHARACTER_FIELDS.includes(w)) && new Set(v.waivers).size === v.waivers.length && Array.isArray(v.personalities) && v.personalities.every(p => _personality__WEBPACK_IMPORTED_MODULE_3__.PERSONALITY_LABELS.includes(p)) && new Set(v.personalities).size === v.personalities.length && nullable(v.image, image) && (v.birth === null || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.birth, ['year', 'elementId', 'day']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.signedInteger)(v.birth.year) && nullable(v.birth.elementId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.birth.day === null || (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.birth.day) && v.birth.day !== '0')) && nullable(v.birthEventId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid) && (v.birth === null) === (v.birthEventId === null);
        case 'faction': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['name', ...FACTION_TEXT, 'image', 'leaderImage', 'locations', 'military']) && named(v.name) && texts(v, FACTION_TEXT) && nullable(v.image, image) && nullable(v.leaderImage, image) && Array.isArray(v.locations) && v.locations.every(l => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(l, ['name', 'notes']) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(l.name) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.scalarText)(l.notes)) && Array.isArray(v.military) && v.military.every(m => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['name', 'role', 'description', 'baseStrength', 'movementPoints', 'baseModifierPoints']) && texts(m, ['name', 'role', 'description']) && [m.baseStrength, m.movementPoints].every(n => n === null || exactDecimal(n, false)) && (m.baseModifierPoints === null || exactDecimal(m.baseModifierPoints, true)));
        case 'affiliation': return calendarFlag(v) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, [...flagKeys(v), 'characterId', 'date', 'order', 'factionId']) && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.characterId) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.validDatePosition)(v.date) && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(v.order) && nullable(v.factionId, _validation__WEBPACK_IMPORTED_MODULE_0__.isUuid);
        case 'view': return (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['makers', 'categories']) && Array.isArray(v.makers) && v.makers.every(m => maker(m) || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(m, ['kind']) && m.kind === 'none') && Array.isArray(v.categories) && v.categories.every(c => (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(c, ['kind']) && c.kind === 'events' || (0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(c, ['kind', 'id']) && c.kind === 'decision-type' && (0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(c.id)) && new Set(v.makers.map(m => JSON.stringify(m))).size === v.makers.length && new Set(v.categories.map(c => JSON.stringify(c))).size === v.categories.length;
        default: return false;
    }
}
function validateWorkspaceRecord(v) {
    if (!(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) || v.schemaVersion !== 1 || typeof v.recordType !== 'string' || !Object.hasOwn(recordCategory, v.recordType) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.id) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.universeId) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.recordVersion) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(v.owner, ['kind', 'id']) || !(0,_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(v.owner.id) || v.owner.kind !== ownerKindForType(v.recordType) || v.owner.kind === 'universe' && v.owner.id !== v.universeId || !validWorkspaceData(v.recordType, v.data))
        return false;
    if (v.recordType === 'chapter') {
        const f = v.data.formatting;
        return f.chapterId === v.id && f.recordVersion === v.recordVersion;
    }
    return true;
}
/** Validate the complete candidate closure, including the project's authoritative universe. */
function assertWorkspaceState(records) {
    const map = new Map();
    for (const r of records) {
        if (!validateWorkspaceRecord(r))
            fail('Invalid closed workspace record.');
        if (map.has(r.id))
            fail('Duplicate permanent identity.');
        map.set(r.id, r);
    }
    const calendars = records.filter((r) => r.recordType === 'calendar');
    const calendarFor = (r) => { const found = calendars.filter(c => c.universeId === r.universeId); if (found.length !== 1)
        return fail('Exactly one authoritative calendar is required for dated content.'); return found[0].data; };
    const ref = (r, id, type, project = false) => { const target = map.get(id); if (!target || target.recordType !== type || target.universeId !== r.universeId || project && (target.owner.kind !== r.owner.kind || target.owner.id !== r.owner.id))
        return fail('Missing or foreign record reference.', id); return target; };
    const keys = new Set(), typeNames = new Set(), builtin = new Set(), contexts = new Set();
    const date = (r, d) => { if (d)
        (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.elapsedPosition)(d, calendarFor(r)); };
    for (const r of records) {
        const d = r.data;
        switch (r.recordType) {
            case 'calendar':
                if (r.data.versions.some(c => c.targetDays !== c.actualDays))
                    fail('Saved calendar target must equal its actual length.');
                if (calendars.filter(c => c.universeId === r.universeId).length !== 1)
                    fail('Only one calendar per universe is permitted.');
                break;
            case 'story':
                if (r.data.volumeId)
                    ref(r, r.data.volumeId, 'volume', true);
                break;
            case 'chapter': {
                const c = r.data;
                ref(r, c.storyId, 'story', true);
                c.characterIds.forEach(id => ref(r, id, 'character'));
                c.events.forEach(e => ref(r, e.eventId, 'event'));
                date(r, c.start);
                date(r, c.end);
                if (c.start && c.end && (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(c.end, c.start, calendarFor(r)) < 0)
                    fail('Chapter end must be corrected to start.');
                break;
            }
            case 'plot':
                ref(r, r.data.storyId, 'story', true);
                date(r, r.data.date);
                break;
            case 'decision-context': {
                ref(r, r.data.storyId, 'story', true);
                ref(r, r.data.decisionId, 'decision');
                const k = `${r.owner.id}/${r.data.storyId}/${r.data.decisionId}`;
                if (contexts.has(k))
                    fail('Duplicate story decision relevance.');
                contexts.add(k);
                break;
            }
            case 'event':
            case 'decision': {
                const e = r.data;
                date(r, e.date);
                const key = `${r.universeId}/${(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey)(e.code)}`;
                if (keys.has(key))
                    fail('Timeline code is already in use.', 'code');
                keys.add(key);
                if (e.maker)
                    ref(r, e.maker.id, e.maker.kind);
                if (r.recordType === 'event') {
                    if (r.data.characterId)
                        ref(r, r.data.characterId, 'character');
                    if (r.data.kind === 'birth') {
                        const c = ref(r, r.data.characterId, 'character');
                        if (c.data.birthEventId !== r.id || !c.data.birth || c.data.birth.year !== r.data.date.year)
                            fail('Canonical birth association is inconsistent.');
                    }
                }
                else {
                    const decision = r.data, t = ref(r, decision.typeId, 'decision-type');
                    if (t.data.makerRequired && !decision.maker)
                        fail('This decision type requires a maker.', 'maker');
                    decision.characterIds.forEach(id => ref(r, id, 'character'));
                    for (const id of decision.eventIds) {
                        const target = ref(r, id, 'event');
                        if ((0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(target.data.date, decision.date, calendarFor(r)) < 0)
                            fail('Result event predates its source decision.');
                    }
                    for (const id of decision.followingDecisionIds) {
                        const target = ref(r, id, 'decision');
                        if (id === r.id || (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(target.data.date, decision.date, calendarFor(r)) < 0)
                            fail('Invalid following decision date or self-link.');
                    }
                }
                break;
            }
            case 'decision-type': {
                const t = r.data, k = `${r.universeId}/${(0,_code_fold__WEBPACK_IMPORTED_MODULE_4__.canonicalCodeKey)(t.name)}`;
                if (typeNames.has(k))
                    fail('Decision type names must be unique.');
                typeNames.add(k);
                if (t.builtin) {
                    const b = `${r.universeId}/${t.builtin}`;
                    if (builtin.has(b))
                        fail('Duplicate built-in decision type.');
                    builtin.add(b);
                }
                break;
            }
            case 'character':
                if (r.data.birthEventId) {
                    const e = ref(r, r.data.birthEventId, 'event');
                    if (e.data.kind !== 'birth' || e.data.characterId !== r.id || e.data.date.year !== r.data.birth.year)
                        fail('Birth event must be the character’s canonical birth.');
                }
                break;
            case 'affiliation':
                ref(r, r.data.characterId, 'character');
                if (r.data.factionId)
                    ref(r, r.data.factionId, 'faction');
                date(r, r.data.date);
                break;
            case 'view':
                if (records.filter(x => x.recordType === 'view' && x.universeId === r.universeId).length > 1)
                    fail('Only one synchronized visibility configuration is permitted per universe.');
                for (const m of r.data.makers)
                    if (m.kind !== 'none')
                        ref(r, m.id, m.kind);
                for (const c of r.data.categories)
                    if (c.kind === 'decision-type')
                        ref(r, c.id, 'decision-type');
                break;
        }
        void d;
    }
    const done = new Set(), visiting = new Set();
    // Author-sized graphs must not depend on the JavaScript recursion limit.
    for (const record of records) {
        if (record.recordType !== 'decision' || done.has(record.id))
            continue;
        const stack = [{ id: record.id, next: 0 }];
        visiting.add(record.id);
        while (stack.length) {
            const frame = stack[stack.length - 1], decision = map.get(frame.id);
            if (frame.next === decision.data.followingDecisionIds.length) {
                visiting.delete(frame.id);
                done.add(frame.id);
                stack.pop();
                continue;
            }
            const id = decision.data.followingDecisionIds[frame.next++];
            if (visiting.has(id))
                fail('Decision result graph contains a cycle.');
            if (!done.has(id)) {
                visiting.add(id);
                stack.push({ id, next: 0 });
            }
        }
    }
}
const decisionResolved = (d) => d.eventIds.length + d.followingDecisionIds.length > 0;
const exactCompare = (a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0;
function compareOptionalDates(a, b, c) { return a === null ? (b === null ? 0 : -1) : b === null ? 1 : c ? (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(a, b, c) : fail('A calendar is required for dated ordering.'); }
function orderedChapters(chapters, calendar = null) { return [...chapters].sort((a, b) => compareOptionalDates(a.data.start, b.data.start, calendar) || exactCompare(a.data.creationSequence, b.data.creationSequence) || a.id.localeCompare(b.id)); }
function orderedPlots(plots, calendar = null) { return [...plots].sort((a, b) => compareOptionalDates(a.data.date, b.data.date, calendar) || exactCompare(a.data.order, b.data.order) || a.id.localeCompare(b.id)); }
function orderedDated(records, calendar) { return [...records].sort((a, b) => (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.compareDates)(a.data.date, b.data.date, calendar) || exactCompare(a.data.order, b.data.order) || a.id.localeCompare(b.id)); }
function nextGroupOrder(records, date, calendar) { let max = -1n; for (const r of records)
    if (compareOptionalDates(r.data.date, date, calendar) === 0 && BigInt(r.data.order) > max)
        max = BigInt(r.data.order); return (max + 1n).toString(); }
function affiliationHistory(records, calendar) { let previous = null; return orderedDated(records, calendar).map(record => { const entry = { record, previousFactionId: previous, factionId: record.data.factionId }; previous = record.data.factionId; return entry; }); }
function visibleRecord(record, view) { const m = record.data.maker; return (!view.makers.length || view.makers.some(f => m ? f.kind !== 'none' && f.kind === m.kind && f.id === m.id : f.kind === 'none')) && (!view.categories.length || view.categories.some(c => record.recordType === 'event' ? c.kind === 'events' : c.kind === 'decision-type' && c.id === record.data.typeId)); }
function writingContextDecisions(decisions, contexts, storyId, chapterCharacters) { const story = new Set(contexts.filter(c => c.data.storyId === storyId).map(c => c.data.decisionId)); return decisions.filter(d => story.has(d.id) || d.data.characterIds.some(id => chapterCharacters.includes(id))); }
function characterCompleteness(character, events) { const c = character.data, expected = c.type === 'extra' ? [] : ['rankTitle', 'description', ...(c.type === 'main' ? ['background'] : [])]; const states = {}; states.name = c.name.trim() ? 'answered' : 'incomplete'; for (const f of CHARACTER_FIELDS) {
    const answered = !!c[f].trim() || f === 'background' && events.some(e => e.universeId === character.universeId && e.data.kind === 'background' && e.data.characterId === character.id);
    states[f] = answered ? 'answered' : c.waivers.includes(f) ? 'waived' : expected.includes(f) ? 'incomplete' : 'optional';
} return states; }
function normalizeCharacter(character, hasBackgroundEvent = false) { return { ...character, waivers: character.waivers.filter(f => !character[f].trim() && !(f === 'background' && hasBackgroundEvent)) }; }
function factionCompleteness(f) { const fields = ['name', ...FACTION_TEXT.filter(k => !['population', 'resources', 'culture'].includes(k))]; const missing = fields.filter(k => !f[k].trim()); if (!f.image)
    missing.push('image'); if (!f.leaderImage)
    missing.push('leaderImage'); return { complete: !missing.length, missing }; }
function normalizeFaction(f) { return { ...f, military: f.military.filter(m => m.name.trim() || m.role.trim() || m.description.trim() || m.baseStrength !== null || m.movementPoints !== null || m.baseModifierPoints !== null) }; }
function synchronizedBirth(character, event, calendar, direction) { const birth = character.data.birth; if (event.data.kind !== 'birth' || event.data.characterId !== character.id || character.data.birthEventId !== event.id || !birth)
    return fail('Birth synchronization requires the canonical association.'); return direction === 'character-to-event' ? { character, event: { ...event, data: { ...event.data, date: (0,_calendar__WEBPACK_IMPORTED_MODULE_1__.birthPosition)(birth, calendar) } } } : { character: { ...character, data: { ...character.data, birth: { ...birth, year: event.data.date.year } } }, event }; }
const BUILTIN_DECISION_TYPES = [
    { name: 'Personal Decisions', makerRequired: true, builtin: 'personal' },
    { name: 'Story Decisions', makerRequired: false, builtin: 'story' },
];
/** Advance group position only for insertion or a real elapsed-date change. */
function appendMovedGroupOrder(before, candidate, calendar) {
    const old = before.find(r => r.id === candidate.id);
    return !old || compareOptionalDates(old.data.date, candidate.data.date, calendar) !== 0 ? { ...candidate, data: { ...candidate.data, order: nextGroupOrder(before.filter(r => r.id !== candidate.id), candidate.data.date, calendar) } } : candidate;
}
/** Explicit calendar update converts display metadata while retaining elapsed chronology. */
function updateRecordCalendar(record, calendar, convert) {
    switch (record.recordType) {
        case 'chapter': return { ...record, data: { ...record.data, start: record.data.start ? convert(record.data.start, calendar) : null, end: record.data.end ? convert(record.data.end, calendar) : null, calendarUpdateRequired: false } };
        case 'plot': return { ...record, data: { ...record.data, date: record.data.date ? convert(record.data.date, calendar) : null, ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'event': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'decision': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        case 'affiliation': return { ...record, data: { ...record.data, date: convert(record.data.date, calendar), ...(Object.hasOwn(record.data, 'calendarUpdateRequired') ? { calendarUpdateRequired: false } : {}) } };
        default: return record;
    }
}
const CHARACTER_PROMPTS = { rankTitle: 'What rank or title does this character hold?', background: 'What experiences shaped this character?', description: 'How would you describe this character?', motivation: 'What does this character want, and why?', weaknesses: 'What weaknesses or limitations affect this character?', strengths: 'What strengths help this character?', specialities: 'What skills or areas of expertise distinguish this character?' };


/***/ },

/***/ "./src/infrastructure/archives.ts"
/*!****************************************!*\
  !*** ./src/infrastructure/archives.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArchiveStorage: () => (/* binding */ ArchiveStorage),
/* harmony export */   OperationCanceled: () => (/* binding */ OperationCanceled),
/* harmony export */   checkCancel: () => (/* binding */ checkCancel),
/* harmony export */   checkpoint: () => (/* binding */ checkpoint),
/* harmony export */   publishOutput: () => (/* binding */ publishOutput)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:os */ "node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var fflate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fflate */ "./node_modules/fflate/esm/index.mjs");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _revisions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./revisions */ "./src/infrastructure/revisions.ts");
/* harmony import */ var _recovery__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./recovery */ "./src/infrastructure/recovery.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");










const checkpoint = () => new Promise(resolve => setImmediate(resolve));
class OperationCanceled extends Error {
    constructor() { super('Operation canceled. Previous output was preserved.'); }
}
function checkCancel(c) { if (c.canceled && c.cancelable)
    throw new OperationCanceled(); }
/** Recheck expected destination bytes immediately before durable same-folder publication. */
function publishOutput(destination, staged, control) { checkCancel(control); const digest = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(staged); control.beforePublish?.(destination, digest); control.cancelable = false; control.phase = 'Publishing verified output'; (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedFile)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(destination.path), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(destination.path), staged, destination.expectedHash, digest); }
class ArchiveStorage {
    revisions;
    userData;
    constructor(revisions, userData) {
        this.revisions = revisions;
        this.userData = userData;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(userData, 'protection');
    }
    registryPath = 'protection/archives.json';
    registry() { if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, this.registryPath)))
        return []; const v = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, this.registryPath)); if (!Array.isArray(v) || !v.every(_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.validArchiveRecord))
        throw new Error('Archive protection evidence is unreadable. Cleanup is blocked.'); return v; }
    evidence(file) { const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(file)); return { path: file, device: stat.dev.toString(), inode: stat.ino.toString() }; }
    saveRegistry(records) { const old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, this.registryPath)) ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, this.registryPath) : null; (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(this.userData, this.registryPath, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(records)), old ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(old) : null); }
    protectedRevisionIds() {
        const discovery = 'protection/archive-discovery.json';
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, discovery))) {
            const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, discovery));
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(value, ['schemaVersion', 'uncertain', 'checkedAt', 'directories']) || value.schemaVersion !== 1 || typeof value.uncertain !== 'boolean' || typeof value.checkedAt !== 'string' || !Number.isFinite(Date.parse(value.checkedAt)) || !Array.isArray(value.directories) || !value.directories.every(directory => typeof directory === 'string' && node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(directory)) || value.uncertain)
                throw new Error('Uncertain archive discovery evidence blocks revision deletion.');
        }
        // Valid ZIPs embed their manifests and bytes. Their local history entries can expire
        // independently; uncertain or unavailable archive evidence still pins those entries.
        return new Set(this.registry().filter(r => r.state !== 'valid' || !r.locations.length || r.locations.some(file => { try {
            return (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(file) !== r.sha256;
        }
        catch {
            return true;
        } })).flatMap(r => r.revisionIds));
    }
    async write(revision, destination, control, id = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()) {
        ;(0,_recovery__WEBPACK_IMPORTED_MODULE_8__.validateCaptureCatalogs)(revision, this.revisions);
        const retained = [...this.revisions.list(revision.owner), ...(revision.owner.kind === 'project' ? revision.units.filter(u => u.snapshot.owner.kind === 'universe').flatMap(u => this.revisions.list(u.snapshot.owner)) : [])], all = [revision, ...retained.filter(r => r.id !== revision.id)], sources = new Map(all.flatMap(m => m.units.flatMap(u => u.files.map(f => [f.object.sha256, m.owner])))), objects = new Map(all.flatMap(m => m.units.flatMap(u => u.files.map(f => [f.object.sha256, f.object]))));
        for (const m of all) {
            this.revisions.validate(m);
            (0,_recovery__WEBPACK_IMPORTED_MODULE_8__.validateCaptureCatalogs)(m, this.revisions);
        }
        const preferred = new Map();
        for (const unit of revision.units)
            for (const file of unit.files)
                if (!file.relativePath.startsWith('history/') && !preferred.has(file.object.sha256))
                    preferred.set(file.object.sha256, `${unit.snapshot.owner.kind}/${unit.snapshot.owner.id}/${file.relativePath}`);
        const manifest = { schemaVersion: 1, kind: 'complete-backup', id, capturedAt: revision.capturedAt, revision, retained: all.filter(m => m.id !== revision.id), files: [...objects].map(([sha, object]) => ({ relativePath: preferred.get(sha) ?? `objects/${sha}`, object })) };
        const temp = node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir()), 'writingtool-archive-')), staged = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, `${manifest.id}.zip`);
        let fd;
        try {
            fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(staged, 'wx', 0o600);
            let zipError;
            const zip = new fflate__WEBPACK_IMPORTED_MODULE_4__.Zip((error, data) => { if (error) {
                zipError = error;
                return;
            } if (data)
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeSync(fd, data); });
            const add = async (name, bytes) => { checkCancel(control); const stream = new fflate__WEBPACK_IMPORTED_MODULE_4__.ZipDeflate(name, { level: 6 }); zip.add(stream); for (let offset = 0; offset < bytes.length; offset += 262144) {
                checkCancel(control);
                stream.push(bytes.subarray(offset, offset + 262144), offset + 262144 >= bytes.length);
                if (zipError)
                    throw zipError;
                await checkpoint();
            } if (!bytes.length)
                stream.push(bytes, true); };
            control.phase = 'Writing complete manifest';
            await add('writingtool-backup.json', Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(manifest)));
            for (const f of manifest.files) {
                control.phase = `Archiving ${f.relativePath}`;
                await add(f.relativePath, this.revisions.object(sources.get(f.object.sha256), f.object));
            }
            await add('writingtool-completion.json', Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)({ schemaVersion: 1, manifestId: manifest.id, manifestSha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(manifest))), payloadCompletedAt: new Date().toISOString(), payloadCount: manifest.files.length.toString() })));
            zip.end();
            if (zipError)
                throw zipError;
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            fd = undefined;
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(staged));
            control.phase = 'Validating independent archive';
            const verified = await this.read(staged, control);
            if (verified.manifest.id !== manifest.id)
                throw new Error('Archive validation identity mismatch.');
            publishOutput(destination, staged, control);
            const record = { schemaVersion: 1, id: manifest.id, owner: revision.owner, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(destination.path), capturedAt: manifest.capturedAt, completedAt: new Date().toISOString(), locations: [destination.path], evidence: [this.evidence(destination.path)], revisionIds: all.map(m => m.id), state: 'valid' };
            const registry = this.registry();
            registry.push(record);
            this.saveRegistry(registry);
            return record;
        }
        finally {
            if (fd !== undefined)
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmSync(temp, { recursive: true, force: true });
        }
    }
    async read(file, control) {
        let manifest, error, payloadCompletedAt, manifestDigest;
        const objects = new Map(), names = new Set(), expected = new Map();
        const unzip = new fflate__WEBPACK_IMPORTED_MODULE_4__.Unzip(entry => { try {
            if (!(0,_revisions__WEBPACK_IMPORTED_MODULE_7__.safeRelative)(entry.name) || names.has(entry.name.toLocaleLowerCase('en-US')))
                throw new Error('Unsafe or duplicate archive path.');
            names.add(entry.name.toLocaleLowerCase('en-US'));
            if (entry.name !== 'writingtool-backup.json' && !manifest)
                throw new Error('The versioned backup manifest must precede payloads.');
            if (entry.name !== 'writingtool-backup.json' && entry.name !== 'writingtool-completion.json' && !expected.has(entry.name))
                throw new Error('Unexpected archive payload.');
            const chunks = [];
            let count = 0n;
            entry.ondata = (e, bytes, final) => { if (e) {
                error = e;
                return;
            } if (error)
                return; count += BigInt(bytes.length); if (entry.name !== 'writingtool-backup.json' && entry.name !== 'writingtool-completion.json' && count > BigInt(expected.get(entry.name))) {
                error = new Error('Archive payload exceeds its declared length.');
                return;
            } chunks.push(bytes); if (final) {
                try {
                    const data = Buffer.concat(chunks);
                    if (entry.name === 'writingtool-backup.json') {
                        const v = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(data);
                        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(v, ['schemaVersion', 'kind', 'id', 'capturedAt', 'revision', 'retained', 'files']) || v.schemaVersion !== 1 || v.kind !== 'complete-backup' || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(v.id) || !(0,_revisions__WEBPACK_IMPORTED_MODULE_7__.validRevision)(v.revision) || !Array.isArray(v.retained) || !v.retained.every(_revisions__WEBPACK_IMPORTED_MODULE_7__.validRevision) || !Array.isArray(v.files))
                            throw new Error('Unsupported or corrupt archive manifest.');
                        manifest = v;
                        manifestDigest = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(data);
                        const refs = new Map([manifest.revision, ...manifest.retained].flatMap(m => m.units.flatMap(u => u.files.map(f => [f.object.sha256, f.object]))));
                        const preferred = new Map();
                        for (const unit of manifest.revision.units)
                            for (const file of unit.files)
                                if (!file.relativePath.startsWith('history/') && !preferred.has(file.object.sha256))
                                    preferred.set(file.object.sha256, `${unit.snapshot.owner.kind}/${unit.snapshot.owner.id}/${file.relativePath}`);
                        for (const f of manifest.files) {
                            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(f, ['relativePath', 'object']) || !refs.has(f.object.sha256) || f.relativePath !== (preferred.get(f.object.sha256) ?? `objects/${f.object.sha256}`) || !(0,_revisions__WEBPACK_IMPORTED_MODULE_7__.safeRelative)(f.relativePath) || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(f.object) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(refs.get(f.object.sha256)) || expected.has(f.relativePath))
                                throw new Error('Archive manifest closure is invalid.');
                            expected.set(f.relativePath, f.object.byteLength);
                        }
                        if (manifest.files.length !== refs.size || new Set(manifest.files.map(f => f.object.sha256)).size !== refs.size)
                            throw new Error('Incomplete immutable history closure.');
                    }
                    else if (entry.name === 'writingtool-completion.json') {
                        const completion = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(data);
                        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(completion, ['schemaVersion', 'manifestId', 'manifestSha256', 'payloadCompletedAt', 'payloadCount']) || completion.schemaVersion !== 1 || completion.manifestId !== manifest.id || completion.manifestSha256 !== manifestDigest || typeof completion.payloadCompletedAt !== 'string' || !Number.isFinite(Date.parse(completion.payloadCompletedAt)) || completion.payloadCount !== expected.size.toString() || names.size !== expected.size + 2)
                            throw new Error('Incomplete archive completion evidence.');
                        payloadCompletedAt = completion.payloadCompletedAt;
                    }
                    else {
                        const sha = manifest.files.find(f => f.relativePath === entry.name).object.sha256;
                        if (count.toString() !== expected.get(entry.name) || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(data) !== sha)
                            throw new Error('Corrupt archive bytes.');
                        objects.set(sha, data);
                    }
                }
                catch (e) {
                    error = e;
                }
            } };
            entry.start();
        }
        catch (e) {
            error = e;
        } });
        unzip.register(fflate__WEBPACK_IMPORTED_MODULE_4__.UnzipInflate);
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().fstatSync(fd);
            if (!stat.isFile() || stat.nlink !== 1)
                throw new Error('Choose a regular unaliased backup archive.');
            const initialHash = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd));
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(fd, Buffer.alloc(0), 0, 0, 0);
            let position = 0;
            const bytes = Buffer.alloc(262144);
            let n;
            while ((n = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(fd, bytes, 0, bytes.length, position)) > 0) {
                position += n;
                checkCancel(control);
                unzip.push(bytes.subarray(0, n));
                if (error)
                    throw error;
                await checkpoint();
            }
            const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(file);
            if (current.ino !== stat.ino || current.dev !== stat.dev || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(file), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(file))) !== initialHash)
                throw new Error('Selected archive changed during recovery.');
            unzip.push(new Uint8Array(), true);
            if (error)
                throw error;
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        if (!manifest || !payloadCompletedAt || names.size !== expected.size + 2 || manifest.files.some(f => !objects.has(f.object.sha256)))
            throw new Error('Archive payload closure is incomplete.');
        return { manifest, objects, payloadCompletedAt };
    }
    async import(file, control) {
        const { manifest, objects } = await this.read(file, control), all = [manifest.revision, ...manifest.retained];
        const object = (_owner, ref) => { const bytes = objects.get(ref.sha256); if (!bytes || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes) !== ref.sha256 || bytes.length.toString() !== ref.byteLength)
            throw new Error('Corrupt staged revision payload.'); return bytes; };
        const staged = { object, resolve: (m) => this.revisions.resolve(m, object) }, identities = new Map();
        // Validate the entire archive before publishing any manifest into live history.
        for (const m of all) {
            checkCancel(control);
            const key = (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(m.owner) + '/' + m.id, content = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(m);
            if (identities.has(key) && identities.get(key) !== content)
                throw new Error('Conflicting archived revision identities.');
            identities.set(key, content);
            this.revisions.validate(m, object);
            (0,_recovery__WEBPACK_IMPORTED_MODULE_8__.validateCaptureCatalogs)(m, staged);
            this.revisions.assertImportable(m);
            await checkpoint();
        }
        checkCancel(control);
        for (const m of all) {
            for (const u of m.units)
                for (const f of u.files)
                    this.revisions.putObject(m.owner, object(m.owner, f.object));
            this.revisions.import(m);
        }
        return manifest.revision;
    }
    async registerCompleted(file, control) { const { manifest } = await this.read(file, control); const record = { schemaVersion: 1, id: manifest.id, owner: manifest.revision.owner, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(file), capturedAt: manifest.capturedAt, completedAt: new Date().toISOString(), locations: [file], evidence: [this.evidence(file)], revisionIds: [manifest.revision, ...manifest.retained].map(m => m.id), state: 'valid' }; const registry = this.registry(), prior = registry.find(r => r.id === record.id); if (prior) {
        if (prior.sha256 !== record.sha256)
            throw new Error('Archive identity/content conflict.');
        prior.locations = [...new Set([...prior.locations, file])];
        prior.evidence = [...prior.evidence.filter(e => e.path !== file), this.evidence(file)];
    }
    else
        registry.push(record); this.saveRegistry(registry); return record; }
    async locate(owner, id, file, control) { const registry = this.registry(), record = registry.find(r => r.id === id && (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(r.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(owner)); if (!record)
        throw new Error('Unknown protected archive.'); const { manifest } = await this.read(file, control); if (manifest.id !== id || (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(manifest.revision.owner) !== (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(owner) || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(file) !== record.sha256)
        throw new Error('The chosen ZIP does not match this archive identity and digest.'); const locations = []; let uncertain = false; for (const old of record.locations) {
        if (old === file)
            continue;
        try {
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(old)) {
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(old) !== record.sha256)
                    uncertain = true;
                locations.push(old);
            }
            else {
                const expected = record.evidence.find(e => e.path === old), stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(old));
                if (!expected || stat.dev.toString() !== expected.device || stat.ino.toString() !== expected.inode) {
                    locations.push(old);
                    uncertain = true;
                }
            }
        }
        catch {
            locations.push(old);
            uncertain = true;
        }
    } record.locations = [...new Set([...locations, file])]; record.evidence = [...record.evidence.filter(e => record.locations.includes(e.path) && e.path !== file), this.evidence(file)]; record.state = uncertain ? 'uncertain' : 'valid'; this.saveRegistry(registry); return registry.filter(r => (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(r.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(owner)); }
    async discover(owner, folders, control) { const known = this.registry(), directories = new Set([...folders.filter((p) => !!p), ...known.flatMap(r => r.locations.map(p => node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(p)))]); let uncertain = false; for (const directory of directories) {
        try {
            for (const name of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(directory).filter(n => n.toLowerCase().endsWith('.zip'))) {
                checkCancel(control);
                const file = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(directory, name);
                try {
                    const { manifest } = await this.read(file, control);
                    const record = this.registry().find(r => r.id === manifest.id);
                    if (record && record.sha256 !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(file)) {
                        uncertain = true;
                        continue;
                    }
                    await this.registerCompleted(file, control);
                }
                catch (e) {
                    if (e instanceof OperationCanceled)
                        throw e;
                    uncertain = true;
                }
            }
        }
        catch (e) {
            if (e instanceof OperationCanceled)
                throw e;
            uncertain = true;
        }
    } const relative = 'protection/archive-discovery.json', old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)) ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, relative)) : null; (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(this.userData, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)({ schemaVersion: 1, uncertain, checkedAt: new Date().toISOString(), directories: [...directories] })), old); }
    remove(owner, id, retentionDays, manual = false) { const discovery = 'protection/archive-discovery.json'; if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, discovery)) && (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, discovery)).uncertain)
        throw new Error('Uncertain or offline archive discovery evidence blocks deletion.'); const registry = this.registry(), mine = registry.filter(r => (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(r.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_7__.ownerKey)(owner)).sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt)), record = mine.find(r => r.id === id); if (!record)
        throw new Error('Unknown archive identity.'); if (mine.some(r => r.state !== 'valid' || r.locations.some(p => { try {
        return !node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(p) || (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hashFile)(p) !== r.sha256;
    }
    catch {
        return true;
    } })))
        throw new Error('Offline or uncertain archive evidence blocks deletion.'); if (mine.slice(0, 10).some(r => r.id === id))
        throw new Error('The ten newest valid complete ZIPs are protected.'); if (!manual && BigInt(Date.now() - Date.parse(record.capturedAt)) < BigInt(retentionDays) * 86400000n)
        return; for (const location of record.locations) {
        const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(location), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(location));
        if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes) !== record.sha256)
            throw new Error('Archive content changed. Deletion is blocked.');
    } for (const location of record.locations)
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.removeManagedBytes)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(location), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(location), record.sha256); this.saveRegistry(registry.filter(r => r.id !== id)); }
}


/***/ },

/***/ "./src/infrastructure/captured-state.ts"
/*!**********************************************!*\
  !*** ./src/infrastructure/captured-state.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveCapturedState: () => (/* binding */ resolveCapturedState),
/* harmony export */   validCapturedState: () => (/* binding */ validCapturedState),
/* harmony export */   validateCapturedState: () => (/* binding */ validateCapturedState)
/* harmony export */ });
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");




function validCapturedState(value) {
    if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validOwner)(value.owner) || !Array.isArray(value.units) || !value.units.every(_application_contracts_protection__WEBPACK_IMPORTED_MODULE_0__.validCapturedUnit) || value.units.length !== (value.owner.kind === 'project' ? 2 : 1) || new Set(value.units.map(u => u.snapshot.owner.kind + '/' + u.snapshot.owner.id)).size !== value.units.length)
        return false;
    const primary = value.units.find(u => u.snapshot.owner.kind === value.owner.kind && u.snapshot.owner.id === value.owner.id);
    return !!primary && (value.owner.kind === 'universe' || value.units.some(u => u.snapshot.owner.kind === 'universe' && u.snapshot.owner.id === primary.snapshot.universeId));
}
function resolveCapturedState(state, object) { return state.units.map(unit => { const { recordIds, ...identity } = unit.snapshot, files = new Map(unit.files.map(f => [f.relativePath, f.object])), records = recordIds.map(id => { const file = unit.files.find(f => f.relativePath.endsWith('/' + id + '.json') && !f.relativePath.startsWith('history/')); if (!file)
    throw new Error('Missing current record payload.'); return (0,_universe_files__WEBPACK_IMPORTED_MODULE_3__.decode)(object(state.owner, file.object)); }), manuscripts = {}; for (const r of records)
    if (r.recordType === 'chapter') {
        const ref = files.get(r.data.formatting.text.relativePath);
        if (!ref)
            throw new Error('Missing chapter manuscript.');
        manuscripts[r.id] = new TextDecoder('utf-8', { fatal: true }).decode(object(state.owner, ref));
    } return { ...identity, records, manuscripts }; }); }
function validateCapturedState(state, object) {
    if (!validCapturedState(state))
        throw new Error('Invalid complete captured state.');
    const units = resolveCapturedState(state, object);
    (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_2__.assertWorkspaceState)(units.flatMap(u => u.records));
    for (let i = 0; i < state.units.length; i++) {
        const unit = state.units[i], snapshot = units[i], files = new Map(unit.files.map(f => [f.relativePath, object(state.owner, f.object)]));
        if (!files.has('writingtool.json') || !files.has('database/catalog.sqlite'))
            throw new Error('The complete capture lacks discovery or catalog.');
        if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validWorkspaceUnit)(snapshot))
            throw new Error('Invalid resolved unit.');
        for (const r of snapshot.records) {
            const bytes = files.get(`${recordCategory(r.recordType)}/${r.id}.json`);
            if (!bytes || (0,_universe_files__WEBPACK_IMPORTED_MODULE_3__.canonical)((0,_universe_files__WEBPACK_IMPORTED_MODULE_3__.decode)(bytes)) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_3__.canonical)(r))
                throw new Error('Captured record bytes do not match the saved state.');
            if (r.recordType === 'chapter') {
                const text = files.get(r.data.formatting.text.relativePath);
                if (!text || (0,_universe_files__WEBPACK_IMPORTED_MODULE_3__.hash)(text) !== r.data.formatting.text.sha256 || text.toString('utf8') !== snapshot.manuscripts[r.id])
                    throw new Error('Captured manuscript and formatting do not match.');
            }
        }
        for (const f of unit.files)
            object(state.owner, f.object);
    }
}
const recordCategory = (type) => _domain_workspace__WEBPACK_IMPORTED_MODULE_2__.recordCategory[type];


/***/ },

/***/ "./src/infrastructure/confined-fs.ts"
/*!*******************************************!*\
  !*** ./src/infrastructure/confined-fs.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   configureConfinedFs: () => (/* binding */ configureConfinedFs),
/* harmony export */   confinedFs: () => (/* binding */ confinedFs)
/* harmony export */ });
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:module */ "node:module");
/* harmony import */ var node_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_module__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);
/** Trusted main/utility-only filesystem adapter. Never expose handles or this API over IPC. */



let binding;
let configuredModule;
/** Call only from trusted bootstrap, before constructing the coordinator. */
function configureConfinedFs(modulePath) {
    if (!node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(modulePath) || node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(modulePath) !== 'confined_fs.node')
        throw new Error('Invalid trusted native module location');
    if (binding || (configuredModule !== undefined && configuredModule !== modulePath))
        throw new Error('Confined filesystem module location is already fixed');
    configuredModule = modulePath;
}
function native() {
    if (binding)
        return binding;
    if (!(process.platform === 'darwin' && ['x64', 'arm64'].includes(process.arch)) && !(process.platform === 'win32' && process.arch === 'x64'))
        throw new Error('Unsupported confined filesystem platform/architecture');
    if (process.type === 'renderer')
        throw new Error('Confined filesystem is restricted to trusted host processes');
    const runtime = process;
    const packaged = runtime.resourcesPath && !runtime.defaultApp;
    const filename = configuredModule ?? (packaged
        ? node_path__WEBPACK_IMPORTED_MODULE_0___default().join(runtime.resourcesPath, 'native', 'confined-fs', `${process.platform}-${process.arch}`, 'confined_fs.node')
        : node_path__WEBPACK_IMPORTED_MODULE_0___default().resolve('native/confined-fs/build/Release/confined_fs.node'));
    try {
        const loaded = (0,node_module__WEBPACK_IMPORTED_MODULE_1__.createRequire)(node_path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), 'package.json'))(filename);
        const operations = ['root', 'open', 'close', 'stat', 'read', 'write', 'sync', 'mkdir', 'rename', 'unlink'];
        if (loaded.contractVersion !== 1 || operations.some(name => typeof loaded[name] !== 'function'))
            throw new Error('Incompatible confined filesystem contract');
        binding = loaded;
        return loaded;
    }
    catch (cause) {
        throw new Error(`Required confined filesystem addon unavailable: ${filename}`, { cause });
    }
}
function segments(relative) {
    const result = relative.split('/');
    if (node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(relative) || result.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)))
        throw new Error('Unsafe managed path');
    return result;
}
function directory(absolute) { return native().root(node_path__WEBPACK_IMPORTED_MODULE_0___default().resolve(absolute)); }
function parent(root, relative) {
    const parts = segments(relative), name = parts.pop();
    let handle = directory(root);
    try {
        for (const part of parts) {
            const next = native().open(handle, part, 'directory');
            native().close(handle);
            handle = next;
        }
        return { handle, name };
    }
    catch (error) {
        native().close(handle);
        throw error;
    }
}
function regular(handle) {
    const stat = native().stat(handle);
    if (stat.directory)
        throw new Error('Invalid managed file');
    return stat;
}
function digest(handle, copy) {
    const hash = (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.createHash)('sha256');
    for (;;) {
        const bytes = native().read(handle, 262144);
        if (!bytes.length)
            break;
        hash.update(bytes);
        if (copy)
            native().write(copy, bytes);
    }
    regular(handle);
    return hash.digest('hex');
}
function write(handle, data) {
    regular(handle);
    for (let offset = 0; offset < data.byteLength; offset += 262144)
        native().write(handle, Buffer.from(data.buffer, data.byteOffset + offset, Math.min(262144, data.byteLength - offset)));
    regular(handle);
    native().sync(handle, false);
}
function verify(parent, name, expected, expectedHash) {
    let handle;
    try {
        handle = native().open(parent, name, 'read');
        if (!expected || regular(handle).id !== expected.id || (expectedHash !== undefined && digest(handle) !== expectedHash))
            throw new Error('Managed target changed');
    }
    catch (error) {
        if (expected || error.code !== 'ENOENT')
            throw error;
    }
    finally {
        if (handle)
            native().close(handle);
    }
}
function previous(parent, name, expectedHash) {
    let handle;
    try {
        handle = native().open(parent, name, 'read');
        const identity = regular(handle);
        if (expectedHash === null || digest(handle) !== expectedHash)
            throw new Error('Unexpected managed bytes');
        return identity;
    }
    catch (error) {
        if (error.code !== 'ENOENT' || expectedHash !== null)
            throw error;
    }
    finally {
        if (handle)
            native().close(handle);
    }
}
function publish(root, relative, content, options) {
    const p = parent(root, relative), temporary = `.publish-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`;
    let target, original;
    try {
        native().sync(p.handle, true);
        let before;
        if (options.existing) {
            original = native().open(p.handle, p.name, 'read');
            before = regular(original);
        }
        else if (options.expectedHash !== undefined)
            before = previous(p.handle, p.name, options.expectedHash);
        target = native().open(p.handle, temporary, 'new');
        regular(target);
        content(target);
        regular(target);
        native().sync(target, false);
        native().sync(p.handle, true);
        options.staged?.();
        verify(p.handle, p.name, before, options.expectedHash ?? undefined);
        native().rename(p.handle, target, temporary, p.name, before !== undefined);
        native().sync(p.handle, true);
    }
    finally {
        // Retain staging evidence on failure. No unverified cleanup deletes another object's bytes.
        if (original)
            native().close(original);
        if (target)
            native().close(target);
        native().close(p.handle);
    }
}
const confinedFs = {
    syncDir(absolute) { const h = directory(absolute); try {
        native().sync(h, true);
    }
    finally {
        native().close(h);
    } },
    writeExclusive(absolute, data, reserved) {
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(absolute), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(absolute));
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'new', reserved);
            write(h, Buffer.from(data));
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    publishMarker(root, relative, data, staged) {
        publish(root, relative, h => write(h, Buffer.from(data)), { staged });
    },
    preserveMarker(root, relative) {
        const p = parent(root, relative);
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            native().rename(p.handle, h, p.name, `${p.name}.damaged-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`, false);
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    readManaged(root, relative) {
        const p = parent(root, relative);
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            const chunks = [];
            for (;;) {
                const b = native().read(h, 262144);
                if (!b.length)
                    break;
                chunks.push(b);
            }
            regular(h);
            return Buffer.concat(chunks);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    replaceManaged(root, relative, data) { publish(root, relative, h => write(h, Buffer.from(data)), { existing: true }); },
    ensureManagedDirectory(root, relative) {
        const parts = segments(relative);
        let h = directory(root);
        try {
            for (const part of parts) {
                native().sync(h, true);
                try {
                    native().mkdir(h, part);
                    native().sync(h, true);
                }
                catch (error) {
                    if (error.code !== 'EEXIST')
                        throw error;
                }
                const next = native().open(h, part, 'directory');
                native().close(h);
                h = next;
            }
        }
        finally {
            native().close(h);
        }
    },
    publishManagedBytes(root, relative, bytes, expectedHash) {
        publish(root, relative, h => write(h, bytes), { expectedHash });
    },
    removeManagedBytes(root, relative, expectedHash) {
        const p = parent(root, relative);
        let h;
        try {
            native().sync(p.handle, true);
            h = native().open(p.handle, p.name, 'read');
            const identity = regular(h);
            if (digest(h) !== expectedHash)
                throw new Error('Unexpected removal target');
            verify(p.handle, p.name, identity, expectedHash);
            native().unlink(p.handle, h, p.name);
            native().close(h);
            h = undefined;
            native().sync(p.handle, true);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    publishManagedFile(root, relative, source, expectedHash, expectedSourceHash) {
        if (segments(relative).length !== 1)
            throw new Error('Unsafe output filename');
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(source), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(source));
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            const sourceHandle = h;
            publish(root, relative, output => { if (digest(sourceHandle, output) !== expectedSourceHash)
                throw new Error('Validated private output changed before publication'); }, { expectedHash });
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
    hashFile(absolute) {
        const p = parent(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(absolute), node_path__WEBPACK_IMPORTED_MODULE_0___default().basename(absolute));
        let h;
        try {
            h = native().open(p.handle, p.name, 'read');
            regular(h);
            return digest(h);
        }
        finally {
            if (h)
                native().close(h);
            native().close(p.handle);
        }
    },
};


/***/ },

/***/ "./src/infrastructure/converter-process.ts"
/*!*************************************************!*\
  !*** ./src/infrastructure/converter-process.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConverterTerminationError: () => (/* binding */ ConverterTerminationError),
/* harmony export */   runConverter: () => (/* binding */ runConverter)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:child_process */ "node:child_process");
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_2__);



class ConverterTerminationError extends Error {
    constructor(message) { super(message); this.name = 'ConverterTerminationError'; }
}
const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
function groupRunning(pid) {
    try {
        process.kill(-pid, 0);
    }
    catch (error) {
        if (error.code === 'ESRCH')
            return false;
        throw error;
    }
    if (process.platform !== 'linux')
        return true;
    // Orphan zombies cannot touch conversion files; some init processes reap them late.
    for (const name of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync('/proc')) {
        if (!/^[0-9]+$/.test(name))
            continue;
        let stat;
        try {
            stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`/proc/${name}/stat`, 'utf8');
        }
        catch (error) {
            if (error.code === 'ENOENT')
                continue;
            return true;
        }
        const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
        if (Number(fields[2]) === pid && fields[0] !== 'Z' && fields[0] !== 'X')
            return true;
    }
    return false;
}
async function terminateTree(pid, graceMs) {
    if (process.platform === 'win32') {
        await new Promise((resolve, reject) => {
            const killer = (0,node_child_process__WEBPACK_IMPORTED_MODULE_2__.spawn)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(pid), '/T', '/F'], { shell: false, windowsHide: true, stdio: 'ignore' });
            const timer = setTimeout(() => { killer.kill(); reject(new Error('Windows taskkill did not finish confirming process-tree termination.')); }, 15000);
            killer.once('error', error => { clearTimeout(timer); reject(error); });
            killer.once('close', code => { clearTimeout(timer); if (code === 0)
                resolve();
            else
                reject(new Error('Windows taskkill did not confirm process-tree termination.')); });
        });
        return;
    }
    const signal = (value) => { try {
        process.kill(-pid, value);
    }
    catch (error) {
        if (error.code !== 'ESRCH')
            throw error;
    } };
    signal('SIGTERM');
    const graceEnd = Date.now() + graceMs;
    while (groupRunning(pid) && Date.now() < graceEnd)
        await delay(Math.min(25, Math.max(1, graceEnd - Date.now())));
    if (!groupRunning(pid))
        return;
    signal('SIGKILL');
    const killEnd = Date.now() + 5000;
    while (groupRunning(pid) && Date.now() < killEnd)
        await delay(25);
    if (groupRunning(pid))
        throw new Error('The original converter process group did not finish terminating.');
}
/** Host-only converter runner. Cancellation/timeout waits for the original tree before returning. */
async function runConverter(command, args, control, options = {}) {
    const child = (0,node_child_process__WEBPACK_IMPORTED_MODULE_2__.spawn)(command, args, { shell: false, detached: process.platform !== 'win32', windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '', timedOut = false, termination, terminationFailure;
    let rejectTermination;
    const failedTermination = new Promise((_resolve, reject) => { rejectTermination = reject; });
    const terminate = () => {
        if (termination || !child.pid)
            return;
        termination = terminateTree(child.pid, options.graceMs ?? 3000).catch(error => { terminationFailure = new ConverterTerminationError(`Converter termination could not be confirmed; temporary files were retained. ${error instanceof Error ? error.message : String(error)}`); rejectTermination(terminationFailure); });
    };
    child.stderr.on('data', bytes => { if (stderr.length < 8192)
        stderr += String(bytes).slice(0, 8192 - stderr.length); });
    const poll = setInterval(() => { if (control.canceled)
        terminate(); }, 100);
    const timeout = setTimeout(() => { timedOut = true; terminate(); }, options.timeoutMs ?? 300000);
    try {
        const closed = new Promise((resolve, reject) => { child.once('error', reject); child.once('close', resolve); });
        const code = await Promise.race([closed, failedTermination]);
        if (control.canceled || timedOut)
            terminate();
        // A close from the wrapper is independent of the descendant termination promise.
        if (termination)
            await termination;
        if (terminationFailure)
            throw terminationFailure;
        return { code, stderr, timedOut };
    }
    catch (error) {
        if (termination)
            await termination;
        if (terminationFailure)
            throw terminationFailure;
        throw error;
    }
    finally {
        clearInterval(poll);
        clearTimeout(timeout);
    }
}


/***/ },

/***/ "./src/infrastructure/export-captures.ts"
/*!***********************************************!*\
  !*** ./src/infrastructure/export-captures.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExportCaptureStorage: () => (/* binding */ ExportCaptureStorage)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _captured_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./captured-state */ "./src/infrastructure/captured-state.ts");
/* harmony import */ var _recovery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./recovery */ "./src/infrastructure/recovery.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");







const scopeOf = ({ owner, format, storyId, chapterIds }) => ({ owner, format, storyId, chapterIds });
/** Immutable saved-generation pins are separate from user-visible revision history. */
class ExportCaptureStorage {
    workspace;
    userData;
    gate;
    constructor(workspace, userData, gate) {
        this.workspace = workspace;
        this.userData = userData;
        this.gate = gate;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.ensureManagedDirectory)(userData, 'protection/export-captures');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.ensureManagedDirectory)(userData, 'protection/export-objects');
    }
    relative(id) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(id))
        throw new Error('Invalid export operation identity.'); return `protection/export-captures/${id}.json`; }
    parse(bytes, id) {
        const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.decode)(bytes);
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value, ['schemaVersion', 'kind', 'operationId', 'capturedAt', 'scope', 'units']) || value.schemaVersion !== 1 || value.kind !== 'export-capture' || value.operationId !== id || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(value.operationId) || typeof value.capturedAt !== 'string' || !Number.isFinite(Date.parse(value.capturedAt)) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value.scope, ['owner', 'format', 'storyId', 'chapterIds']) || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_2__.validProtectionRequest)({ protocolVersion: 1, requestId: id, command: 'protection.export', ...value.scope }) || !(0,_captured_state__WEBPACK_IMPORTED_MODULE_4__.validCapturedState)({ owner: value.scope.owner, units: value.units }))
            throw new Error('The original export capture is invalid. Preserve its recovery evidence.');
        return value;
    }
    bytes(ref) {
        const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.readManaged)(this.userData, `protection/export-objects/${ref.sha256}`);
        if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.hash)(bytes) !== ref.sha256 || bytes.length.toString() !== ref.byteLength)
            throw new Error('The original export payload is missing or corrupt.');
        return bytes;
    }
    object = (_owner, ref) => this.bytes(ref);
    put(bytes) {
        const ref = { sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.hash)(bytes), byteLength: bytes.length.toString() }, relative = `protection/export-objects/${ref.sha256}`;
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)))
            this.bytes(ref);
        else
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.publishManagedBytes)(this.userData, relative, bytes, null);
        return ref;
    }
    state(pin) { return { owner: pin.scope.owner, units: pin.units }; }
    validate(pin) {
        const state = this.state(pin);
        (0,_captured_state__WEBPACK_IMPORTED_MODULE_4__.validateCapturedState)(state, this.object);
        (0,_recovery__WEBPACK_IMPORTED_MODULE_5__.validateCaptureCatalogs)(state, { resolve: captured => (0,_captured_state__WEBPACK_IMPORTED_MODULE_4__.resolveCapturedState)(captured, this.object), object: this.object });
    }
    load(request) {
        return this.gate(() => {
            const relative = this.relative(request.requestId);
            let pin;
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative))) {
                pin = this.parse((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.readManaged)(this.userData, relative), request.requestId);
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(pin.scope) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(scopeOf(request)))
                    throw new Error('The export operation scope does not match its saved capture.');
            }
            else {
                const before = this.workspace.snapshot(), primary = request.owner.kind === 'project' ? before.project : before.universe;
                if (!primary || (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(primary.owner) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(request.owner))
                    throw new Error('Open the selected owning unit before exporting.');
                const capturedAt = new Date().toISOString(), captures = [this.workspace.capture(request.owner)];
                if (request.owner.kind === 'project') {
                    if (!before.universe)
                        throw new Error('The matching universe is required to pin chapter order.');
                    captures.push(this.workspace.capture(before.universe.owner));
                }
                const units = captures.map(capture => { const { records, manuscripts: _manuscripts, ...identity } = capture.snapshot; return { snapshot: { ...identity, recordIds: records.map(record => record.id) }, files: capture.files.map(file => { const bytes = Buffer.from(file.base64, 'base64'); if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.hash)(bytes) !== file.sha256)
                        throw new Error('Export capture payload hash mismatch.'); return { relativePath: file.relativePath, object: this.put(bytes) }; }) }; });
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(before) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(this.workspace.snapshot()))
                    throw new Error('The saved generation changed during export capture.');
                pin = { schemaVersion: 1, kind: 'export-capture', operationId: request.requestId, capturedAt, scope: scopeOf(request), units };
                this.validate(pin);
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.publishManagedBytes)(this.userData, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.jsonBytes)(pin)), null);
            }
            this.validate(pin);
            const state = this.state(pin), units = (0,_captured_state__WEBPACK_IMPORTED_MODULE_4__.resolveCapturedState)(state, this.object), unit = units.find(candidate => (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(candidate.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(request.owner)), source = pin.units.find(candidate => (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(candidate.snapshot.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.canonical)(request.owner)), catalog = source.files.find(file => file.relativePath === 'database/catalog.sqlite');
            if (!catalog)
                throw new Error('The pinned export has no consistent catalog.');
            const universe = units.find(candidate => candidate.owner.kind === 'universe'), calendar = universe?.records.find(record => record.recordType === 'calendar');
            return { unit, calendar: calendar?.recordType === 'calendar' ? calendar.data : null, catalog: this.object(request.owner, catalog.object), files: source.files.map(file => ({ relativePath: file.relativePath, sha256: file.object.sha256 })), capturedAt: pin.capturedAt };
        });
    }
    ids() { return node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, 'protection/export-captures')).map(name => { if (!name.endsWith('.json') || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(name.slice(0, -5)))
        throw new Error('Unrecognized export-capture evidence.'); return name.slice(0, -5); }); }
    /** Caller must first durably record that this operation is terminal. */
    release(id) {
        this.gate(() => {
            const relative = this.relative(id), retained = new Set();
            for (const other of this.ids()) {
                const pin = this.parse((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.readManaged)(this.userData, this.relative(other)), other);
                if (other !== id)
                    for (const unit of pin.units)
                        for (const file of unit.files)
                            retained.add(file.object.sha256);
            }
            // The shared coordinator gate covers creation and reclamation across hosts.
            // Keep the terminal pin until its unshared objects are removed, so interruption
            // can repeat cleanup without needing the captured payloads to remain readable.
            for (const name of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, 'protection/export-objects'))) {
                if (!/^[a-f0-9]{64}$/.test(name))
                    throw new Error('Unrecognized immutable export payload.');
                if (!retained.has(name))
                    (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.removeManagedBytes)(this.userData, `protection/export-objects/${name}`, name);
            }
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)))
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.removeManagedBytes)(this.userData, relative, (0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_6__.readManaged)(this.userData, relative)));
        });
    }
}


/***/ },

/***/ "./src/infrastructure/exports.ts"
/*!***************************************!*\
  !*** ./src/infrastructure/exports.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportSaved: () => (/* binding */ exportSaved),
/* harmony export */   serializeManuscript: () => (/* binding */ serializeManuscript)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:os */ "node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _converter_process__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./converter-process */ "./src/infrastructure/converter-process.ts");
/* harmony import */ var fflate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fflate */ "./node_modules/fflate/esm/index.mjs");
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! node:url */ "node:url");
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_url__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _domain_manuscript__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../domain/manuscript */ "./src/domain/manuscript.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var _archives__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./archives */ "./src/infrastructure/archives.ts");












// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const xml = (s) => { if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/u.test(s))
    throw new Error('DOCX/PDF cannot represent a saved control character. Export Markdown or text to preserve those bytes.'); return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
const xmlText = (s) => xml(s).replace(/ /g, '<text:s/>').replace(/\t/g, '<text:tab/>').replace(/\n/g, '<text:line-break/>').replace(/\r/g, '&#13;');
const md = (s) => s.replace(/[\\`*_{}[\]<>#+.!|~-]/g, '\\$&');
function spans(c, p, format) { const chars = Array.from(c.text), start = Number(p.start), end = Number(p.end); let at = start, out = ''; const escape = format === 'md' ? md : xmlText; for (const m of p.marks) {
    out += escape(chars.slice(at, Number(m.start)).join(''));
    let text = escape(chars.slice(Number(m.start), Number(m.end)).join(''));
    if (format === 'md') {
        const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
        text = match[2];
        if (text) {
            if (m.styles.includes('italic'))
                text = `*${text}*`;
            if (m.styles.includes('bold'))
                text = `**${text}**`;
        }
        text = match[1] + text + match[3];
    }
    else
        text = `<text:span text:style-name="${m.styles.includes('bold') ? m.styles.includes('italic') ? 'BI' : 'B' : 'I'}">${text}</text:span>`;
    out += text;
    at = Number(m.end);
} return out + escape(chars.slice(at, end).join('')); }
function serializeManuscript(chapters, format) {
    for (const c of chapters)
        (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_8__.assertManuscript)(c.text, c.paragraphs);
    if (format === 'txt')
        return chapters.map(c => c.title + '\n\n' + c.paragraphs.map(p => '    '.repeat(Number(p.indent)) + Array.from(c.text).slice(Number(p.start), Number(p.end)).join('')).join('\n')).join('\n\n') + '\n';
    if (format === 'md')
        return chapters.map(c => '# ' + md(c.title) + '\n\n' + c.paragraphs.map(p => p.kind === 'scene-break' ? '\\*\\*\\*' : (p.kind === 'heading' ? '#'.repeat(p.headingLevel) + ' ' : '') + spans(c, p, 'md')).join('\n\n')).join('\n\n') + '\n';
    const styles = new Map();
    const para = (p) => { const key = `P${p.indent}_${p.kind === 'heading' ? p.headingLevel : 0}`; styles.set(key, `<style:style style:name="${key}" style:family="paragraph" style:parent-style-name="Body"><style:paragraph-properties fo:margin-left="${BigInt(p.indent) / 2n}${BigInt(p.indent) % 2n ? '.5' : ''}in"/></style:style>`); return key; };
    const body = chapters.map((c, i) => `<text:h text:style-name="${i ? 'Chapter' : 'FirstChapter'}" text:outline-level="1">${xmlText(c.title)}</text:h>` + c.paragraphs.map(p => { const style = para(p), tag = p.kind === 'heading' ? 'text:h' : 'text:p'; return `<${tag} text:style-name="${style}"${p.kind === 'heading' ? ` text:outline-level="${p.headingLevel}"` : ''}>${spans(c, p, 'xml').replace(/\t/g, '<text:tab/>').replace(/ {2,}/g, m => `<text:s text:c="${m.length}"/>`)}</${tag}>`; }).join('')).join('');
    return `<?xml version="1.0" encoding="UTF-8"?><office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.text"><office:styles><style:default-style style:family="paragraph"><style:paragraph-properties fo:line-height="150%"/><style:text-properties style:font-name="Liberation Serif" fo:font-family="Liberation Serif" fo:font-size="12pt"/></style:default-style><style:style style:name="Body" style:family="paragraph"/><style:style style:name="FirstChapter" style:family="paragraph" style:parent-style-name="Body" style:master-page-name="Standard"/><style:style style:name="Chapter" style:family="paragraph" style:parent-style-name="Body"><style:paragraph-properties fo:break-before="page"/></style:style><style:style style:name="B" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style><style:style style:name="I" style:family="text"><style:text-properties fo:font-style="italic"/></style:style><style:style style:name="BI" style:family="text"><style:text-properties fo:font-style="italic" fo:font-weight="bold"/></style:style></office:styles><office:automatic-styles><style:page-layout style:name="A4"><style:page-layout-properties fo:page-width="21cm" fo:page-height="29.7cm" fo:margin="2.54cm" style:print-orientation="portrait"/></style:page-layout>${[...styles.values()].join('')}</office:automatic-styles><office:master-styles><style:master-page style:name="Standard" style:page-layout-name="A4"/></office:master-styles><office:body><office:text>${body}</office:text></office:body></office:document>`;
}
async function exportSaved(source, format, storyId, chapterIds, destination, runtime, control) {
    const unit = source.unit, owner = unit.owner, temp = node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir()), 'writingtool-export-'));
    let retainTemp = false;
    try {
        (0,_archives__WEBPACK_IMPORTED_MODULE_11__.checkCancel)(control);
        let output;
        if (format === 'sqlite') {
            output = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'catalog.sqlite');
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(output, source.catalog, { flag: 'wx', mode: 0o600 });
            const db = new node_sqlite__WEBPACK_IMPORTED_MODULE_6__.DatabaseSync(output);
            try {
                if (db.prepare('PRAGMA quick_check').get()?.quick_check !== 'ok')
                    throw new Error('Catalog export validation failed.');
                const m = db.prepare('SELECT * FROM unit_meta').get();
                if (m?.ownerId !== owner.id || m.rootId !== unit.rootId || m.generation !== unit.generation)
                    throw new Error('Catalog capture identity mismatch.');
                db.exec('CREATE TABLE writingtool_export_metadata(schemaVersion INTEGER NOT NULL,sourceKind TEXT NOT NULL,ownerId TEXT NOT NULL,rootId TEXT NOT NULL,generation TEXT NOT NULL,capturedAt TEXT NOT NULL,scope TEXT NOT NULL,dependencyNotice TEXT NOT NULL,externalDependencies TEXT NOT NULL)');
                db.prepare('INSERT INTO writingtool_export_metadata VALUES(1,?,?,?,?,?,?,?,?)').run(owner.kind, owner.id, unit.rootId, unit.generation, source.capturedAt, 'catalog-only', _application_contracts_protection__WEBPACK_IMPORTED_MODULE_9__.CATALOG_NOTICE, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)({ universeId: unit.universeId, externalFiles: source.files.filter(f => f.relativePath !== 'database/catalog.sqlite').map(f => ({ relativePath: f.relativePath, sha256: f.sha256 })) }));
                if (db.prepare('PRAGMA quick_check').get()?.quick_check !== 'ok')
                    throw new Error('Catalog metadata validation failed.');
            }
            finally {
                db.close();
            }
        }
        else {
            if (owner.kind !== 'project' || !storyId || !unit.records.some(r => r.recordType === 'story' && r.id === storyId))
                throw new Error('Select one active project story.');
            const calendar = source.calendar;
            const eligible = (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_7__.orderedChapters)(unit.records.filter((r) => r.recordType === 'chapter' && r.data.storyId === storyId), calendar);
            if (chapterIds && chapterIds.some(id => !eligible.some(c => c.id === id)))
                throw new Error('Selected chapters do not belong to this story.');
            const chapters = eligible.filter(c => chapterIds === null || chapterIds.includes(c.id)).map(c => ({ title: c.data.title, text: unit.manuscripts[c.id], paragraphs: c.data.formatting.paragraphs }));
            if (!chapters.length)
                throw new Error('Select at least one chapter to export.');
            if (format === 'md' || format === 'txt') {
                output = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, `manuscript.${format}`);
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(output, serializeManuscript(chapters, format), { flag: 'wx', mode: 0o600 });
            }
            else {
                if (!runtime || !node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(runtime))
                    throw new Error('The pinned bundled LibreOffice runtime is unavailable. Set up application resources before exporting.');
                const input = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'manuscript.fodt');
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(input, serializeManuscript(chapters, 'fodt'), { flag: 'wx', mode: 0o600 });
                control.phase = 'Converting with bundled LibreOffice';
                await convert(runtime, input, temp, format, control);
                output = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, `manuscript.${format}`);
                const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(temp, node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(output));
                validateConverted(bytes, format, chapters);
            }
        }
        ;(0,_archives__WEBPACK_IMPORTED_MODULE_11__.checkCancel)(control);
        await (0,_archives__WEBPACK_IMPORTED_MODULE_11__.checkpoint)();
        if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(output).size)
            throw new Error('Export output is empty.');
        control.phase = 'Validating export';
        (0,_archives__WEBPACK_IMPORTED_MODULE_11__.publishOutput)(destination, output, control);
    }
    catch (error) {
        retainTemp = error instanceof _converter_process__WEBPACK_IMPORTED_MODULE_3__.ConverterTerminationError;
        throw error;
    }
    finally {
        if (!retainTemp)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmSync(temp, { recursive: true, force: true });
    }
}
async function convert(runtime, input, temp, format, control) {
    const result = await (0,_converter_process__WEBPACK_IMPORTED_MODULE_3__.runConverter)(runtime, [`-env:UserInstallation=${(0,node_url__WEBPACK_IMPORTED_MODULE_5__.pathToFileURL)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'profile')).href}`, '--headless', '--nologo', '--nodefault', '--norestore', '--nolockcheck', '--convert-to', format === 'docx' ? 'docx:Office Open XML Text' : 'pdf:writer_pdf_Export', '--outdir', temp, input], control);
    if (control.canceled)
        throw new _archives__WEBPACK_IMPORTED_MODULE_11__.OperationCanceled();
    if (result.timedOut)
        throw new Error('LibreOffice conversion timed out. Previous output was preserved.');
    if (result.code !== 0)
        throw new Error(`LibreOffice conversion failed: ${result.stderr}`);
}
function validateConverted(bytes, format, chapters) {
    if (format === 'pdf') {
        // Structural completion only; rendered text/format fidelity remains a release gate.
        if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-')) || !bytes.subarray(Math.max(0, bytes.length - 2048)).includes(Buffer.from('%%EOF')) || !bytes.includes(Buffer.from('/Pages')))
            throw new Error('The converted PDF is incomplete.');
        return;
    }
    const files = (0,fflate__WEBPACK_IMPORTED_MODULE_4__.unzipSync)(bytes), document = files['word/document.xml'];
    if (!files['[Content_Types].xml'] || !files['_rels/.rels'] || !document)
        throw new Error('Converted DOCX lacks required package/document parts.');
    const text = new TextDecoder('utf-8', { fatal: true }).decode(document);
    if (!text.includes('wordprocessingml/2006/main') || /<!DOCTYPE|<!ENTITY/i.test(text))
        throw new Error('Invalid converted DOCX XML.');
    const decodeText = (value) => {
        if (/&(?!(?:amp|lt|gt|quot|apos|#x[0-9a-fA-F]+|#[0-9]+);)/.test(value))
            throw new Error('Invalid DOCX text entity.');
        const decoded = value.replace(/&(?:amp|lt|gt|quot|apos|#x[0-9a-fA-F]+|#[0-9]+);/g, entity => {
            const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
            return named[entity] ?? String.fromCodePoint(parseInt(entity.slice(entity[2] === 'x' ? 3 : 2, -1), entity[2] === 'x' ? 16 : 10));
        });
        xml(decoded);
        return decoded;
    };
    // Empty paragraphs and explicit text line breaks are content too. Page/column
    // breaks affect layout and must not introduce extra manuscript characters.
    const paragraphs = [...text.matchAll(/<w:p(?=[\s/>])(?:[^>]*\/>|[^>]*>([\s\S]*?)<\/w:p>)/g)].map(paragraph => {
        let result = '';
        for (const token of (paragraph[1] ?? '').matchAll(/<w:t(?=[\s/>])(?:[^>]*\/>|[^>]*>([\s\S]*?)<\/w:t>)|<w:(tab|cr|br)(?=[\s/>])([^>]*?)(?:\/>|>\s*<\/w:\2>)/g)) {
            if (token[0].startsWith('<w:t') && !token[2])
                result += decodeText(token[1] ?? '');
            else if (token[2] === 'tab')
                result += '\t';
            else if (token[2] === 'cr' || token[2] === 'br' && !/w:type\s*=\s*["'](?:page|column)["']/.test(token[3]))
                result += '\n';
        }
        return result;
    });
    const expected = chapters.flatMap(chapter => [chapter.title, ...chapter.text.split('\n')]);
    if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(paragraphs) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(expected))
        throw new Error('Converted DOCX manuscript/title content did not match the saved selection.');
}


/***/ },

/***/ "./src/infrastructure/project-storage.ts"
/*!***********************************************!*\
  !*** ./src/infrastructure/project-storage.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileProjectStorage: () => (/* binding */ FileProjectStorage),
/* harmony export */   FileProjectStore: () => (/* binding */ FileProjectStore)
/* harmony export */ });
/* harmony import */ var _workspace_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./workspace-storage */ "./src/infrastructure/workspace-storage.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _application_contracts_project__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../application/contracts/project */ "./src/application/contracts/project.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var _universe_storage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./universe-storage */ "./src/infrastructure/universe-storage.ts");











const APP_ID = 1465140301;
const DDL = `PRAGMA application_id=1465140301; PRAGMA user_version=1;
CREATE TABLE unit_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1),ownerId TEXT NOT NULL,rootId TEXT NOT NULL,universeId TEXT NOT NULL,generation TEXT NOT NULL,sessionToken TEXT NOT NULL,creationOperationId TEXT NOT NULL,creationDigest TEXT NOT NULL,creationState TEXT NOT NULL CHECK(creationState IN ('preparing','complete')));
CREATE TABLE root_locations(rootId TEXT PRIMARY KEY,ownerKind TEXT NOT NULL CHECK(ownerKind='project'),ownerId TEXT NOT NULL,basePath TEXT NOT NULL,bindingVersion TEXT NOT NULL);
CREATE TABLE universe_locations(universeId TEXT PRIMARY KEY,basePath TEXT NOT NULL,bindingVersion TEXT NOT NULL);
CREATE TABLE records(id TEXT PRIMARY KEY,rootId TEXT NOT NULL REFERENCES root_locations(rootId),recordType TEXT NOT NULL CHECK(recordType='project-metadata'),relativePath TEXT NOT NULL UNIQUE,recordVersion TEXT NOT NULL,sha256 TEXT NOT NULL);
CREATE TABLE committed_operations(operationId TEXT PRIMARY KEY,requestDigest TEXT NOT NULL,generation TEXT NOT NULL,resultDigest TEXT NOT NULL,receiptData TEXT NOT NULL);`;
const LEASE_DDL = `PRAGMA application_id=1465140301; PRAGMA user_version=1; CREATE TABLE lease_identity(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1),ownerId TEXT NOT NULL,rootId TEXT NOT NULL);`;
const ensure = (v, message = 'Project integrity validation failed.') => { if (!v)
    throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('INTEGRITY_MISMATCH', message); };
function discovery(root) {
    const d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(root, 'writingtool.json'));
    if (typeof d === 'object' && d !== null && 'schemaVersion' in d && d.schemaVersion !== 1)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('UNSUPPORTED_VERSION', 'This project version is unsupported.');
    ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(d, ['schemaVersion', 'kind', 'id', 'rootId', 'creationOperationId']) && d.schemaVersion === 1 && d.kind === 'project' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.rootId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.creationOperationId));
    return d;
}
class FileProjectStorage {
    coordinator;
    constructor(coordinator) {
        this.coordinator = coordinator;
    }
    physicalPath(basePath) { const p = node_fs__WEBPACK_IMPORTED_MODULE_3___default().realpathSync(basePath); ensure(node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync(p).isDirectory(), 'Select an existing project directory.'); return p; }
    create(basePath, input, universeId, universeLocation) {
        ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(input.operationId) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(universeId));
        let root;
        try {
            root = this.physicalPath(basePath);
            if (node_fs__WEBPACK_IMPORTED_MODULE_3___default().readdirSync(root).length)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', 'Choose an empty folder for the project. Existing content was preserved.');
        }
        catch (e) {
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw e;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('IO_FAILURE', 'The project folder could not be inspected. No creation was started.');
        }
        const id = (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)(), rootId = (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)(), recordVersion = (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)(), session = (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)();
        const d = { schemaVersion: 1, kind: 'project', id, rootId, creationOperationId: input.operationId };
        const metadata = { schemaVersion: 1, recordType: 'project-metadata', id, owner: { kind: 'project', id }, universeId, recordVersion, data: {} };
        const digest = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)({ protocolVersion: 1, command: 'project.create', payload: { universeId } }));
        const receipt = { protocolVersion: 1, operationId: input.operationId, owner: { kind: 'project', id }, unitGeneration: '1', recordId: id, recordVersion };
        let db, lease, reserved = false;
        try {
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, '.writingtool-creation.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)({ schemaVersion: 1, operationId: input.operationId, ownerId: id, rootId, requestDigest: digest, metadata }), () => { reserved = true; });
            for (const p of ['database', 'projects', 'images']) {
                node_fs__WEBPACK_IMPORTED_MODULE_3___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, p), { mode: 0o700 });
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.syncDir)(root);
            }
            for (const p of ['database/catalog.sqlite', 'database/lease.sqlite'])
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, p), '');
            lease = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.connect)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, 'database/lease.sqlite'), true, APP_ID);
            lease.exec(LEASE_DDL);
            lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(id, rootId);
            lease.exec('BEGIN EXCLUSIVE');
            db = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.connect)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, 'database/catalog.sqlite'), true, APP_ID);
            db.exec(DDL);
            (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.transaction)(db, () => {
                db.prepare('INSERT INTO unit_meta VALUES(1,1,?,?,?,?,?,?,?,?)').run(id, rootId, universeId, '0', session, input.operationId, digest, 'preparing');
                db.prepare('INSERT INTO root_locations VALUES(?,?,?,?,?)').run(rootId, 'project', id, root, (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)());
                db.prepare('INSERT INTO universe_locations VALUES(?,?,?)').run(universeId, universeLocation, (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)());
            });
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(metadata);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, `projects/${id}.json`), bytes);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, 'writingtool.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(d));
            (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.transaction)(db, () => {
                db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?)').run(id, rootId, 'project-metadata', `projects/${id}.json`, recordVersion, (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes));
                db.prepare("UPDATE unit_meta SET generation='1',creationState='complete' WHERE singleton=1").run();
                const result = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(receipt);
                db.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(input.operationId, digest, '1', (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(result), result);
            });
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_4___default().join(root, 'database'));
            const store = new FileProjectStore(root, d, db, lease, session, this.coordinator);
            store.snapshot();
            store.workspace.attach();
            return { store, receipt };
        }
        catch {
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (!reserved)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('IO_FAILURE', 'The project folder could not be reserved. No creation was started.');
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Project creation needs recovery. Its folder and evidence were preserved.', 'unknown');
        }
    }
    open(basePath, expectedCreationOperationId) {
        const root = this.physicalPath(basePath);
        if (node_fs__WEBPACK_IMPORTED_MODULE_3___default().readdirSync(root).length === 0)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', 'This folder is empty and does not contain a saved project. Use Create project, select its existing universe, then choose this empty folder.');
        let db, lease, store;
        try {
            const d = discovery(root);
            if (expectedCreationOperationId)
                ensure(d.creationOperationId === expectedCreationOperationId, 'Reopen the project folder belonging to the pending creation.');
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(root, 'projects', true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(root, 'images', true);
            const leasePath = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(root, 'database/lease.sqlite'), catalog = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(root, 'database/catalog.sqlite');
            try {
                lease = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.connect)(leasePath, false, APP_ID);
                lease.exec('BEGIN EXCLUSIVE');
            }
            catch (e) {
                if (String(e).includes('locked') || String(e).includes('busy'))
                    throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this project. Close it there and try again.');
                throw e;
            }
            const identity = lease.prepare('SELECT * FROM lease_identity').all();
            ensure(identity.length === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(identity[0], ['singleton', 'schemaVersion', 'ownerId', 'rootId']) && identity[0].singleton === 1 && identity[0].schemaVersion === 1 && identity[0].ownerId === d.id && identity[0].rootId === d.rootId);
            db = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.connect)(catalog, false, APP_ID);
            const session = (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)();
            store = new FileProjectStore(root, d, db, lease, undefined, this.coordinator);
            store.checkBinding();
            store.workspace.attach();
            store.workspace.recover();
            store.snapshot();
            (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.transaction)(db, () => { db.prepare('UPDATE unit_meta SET sessionToken=? WHERE singleton=1').run(session); });
            store.session = session;
            return store;
        }
        catch (e) {
            store?.workspace.detach();
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw e;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The project is missing, incomplete, invalid or inaccessible. Existing bytes were preserved.');
        }
    }
}
class FileProjectStore {
    location;
    d;
    db;
    lease;
    session;
    workspace;
    released = false;
    databaseClosed = false;
    releaseStarted = false;
    rootIdentity;
    identities;
    constructor(location, d, db, lease, session, coordinator) {
        this.location = location;
        this.d = d;
        this.db = db;
        this.lease = lease;
        this.session = session;
        this.rootIdentity = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync(location);
        this.identities = ['database/catalog.sqlite', 'database/lease.sqlite'].map(relative => { const stat = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(location, relative)); return { relative, dev: stat.dev, ino: stat.ino }; });
        this.workspace = new _workspace_storage__WEBPACK_IMPORTED_MODULE_0__.WorkspaceStore(location, db, () => { const m = db.prepare('SELECT * FROM unit_meta WHERE singleton=1').get(); return { owner: { kind: 'project', id: d.id }, rootId: d.rootId, universeId: String(m.universeId), generation: String(m.generation), sessionToken: String(m.sessionToken) }; }, () => this.health(), coordinator);
    }
    health() {
        ensure(!this.released && !this.releaseStarted && this.lease.isTransaction, 'Project ownership is unavailable.');
        const root = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync(this.location);
        ensure(node_fs__WEBPACK_IMPORTED_MODULE_3___default().realpathSync(this.location) === this.location && root.dev === this.rootIdentity.dev && root.ino === this.rootIdentity.ino, 'Physical project root changed.');
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(discovery(this.location)) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(this.d), 'Project discovery identity changed.');
        for (const i of this.identities) {
            const s = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(this.location, i.relative));
            ensure(s.dev === i.dev && s.ino === i.ino, 'Project authority file identity changed.');
        }
        const identity = this.lease.prepare('SELECT * FROM lease_identity').get();
        ensure(identity?.ownerId === this.d.id && identity?.rootId === this.d.rootId && identity?.schemaVersion === 1, 'Project ownership identity changed.');
        if (this.session)
            ensure(this.db.prepare('SELECT sessionToken FROM unit_meta WHERE singleton=1').get()?.sessionToken === this.session, 'Project writer fencing token is stale.');
    }
    snapshot() {
        this.health();
        this.workspace.snapshot();
        const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(r => r.name);
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(tables) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(['committed_operations', 'records', 'root_locations', 'unit_meta', 'universe_locations', ...(this.workspace.featureInstalled() ? _workspace_storage__WEBPACK_IMPORTED_MODULE_0__.WORKSPACE_TABLES : [])].sort()));
        const rows = this.db.prepare('SELECT * FROM unit_meta').all(), m = rows[0];
        ensure(rows.length === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(m, ['singleton', 'schemaVersion', 'ownerId', 'rootId', 'universeId', 'generation', 'sessionToken', 'creationOperationId', 'creationDigest', 'creationState']) && m.singleton === 1 && m.schemaVersion === 1 && m.ownerId === this.d.id && m.rootId === this.d.rootId && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(m.universeId) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_2__.isGeneration)(m.generation) && m.creationState === 'complete' && m.creationOperationId === this.d.creationOperationId && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(m.sessionToken) && (!this.session || this.session === m.sessionToken));
        const records = this.db.prepare('SELECT * FROM records').all(), r = records[0];
        ensure(records.length === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(r, ['id', 'rootId', 'recordType', 'relativePath', 'recordVersion', 'sha256']) && r.id === m.ownerId && r.rootId === m.rootId && r.recordType === 'project-metadata' && r.relativePath === `projects/${m.ownerId}.json` && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(r.recordVersion));
        const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.location, String(r.relativePath)), p = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(bytes);
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(bytes) === r.sha256 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(p, ['schemaVersion', 'recordType', 'id', 'owner', 'universeId', 'recordVersion', 'data']) && p.schemaVersion === 1 && p.recordType === 'project-metadata' && p.id === m.ownerId && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(p.owner, ['kind', 'id']) && p.owner.kind === 'project' && p.owner.id === m.ownerId && p.universeId === m.universeId && p.recordVersion === r.recordVersion && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(p.data, []));
        const locations = this.db.prepare('SELECT * FROM universe_locations').all(), u = locations[0];
        ensure(locations.length === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(u, ['universeId', 'basePath', 'bindingVersion']) && u.universeId === m.universeId && typeof u.basePath === 'string' && node_path__WEBPACK_IMPORTED_MODULE_4___default().isAbsolute(u.basePath) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(u.bindingVersion));
        this.binding();
        const operations = this.db.prepare('SELECT * FROM committed_operations').all(), op = operations.find(o => o.operationId === m.creationOperationId);
        const ordered = [...operations].sort((a, b) => BigInt(String(a.generation)) < BigInt(String(b.generation)) ? -1 : 1);
        ensure(ordered.every((o, i) => o.generation === (BigInt(i) + 1n).toString() && typeof o.receiptData === 'string' && (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(o.receiptData) === o.resultDigest && (o.operationId === m.creationOperationId || (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validWorkspaceReceipt)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(Buffer.from(String(o.receiptData)))))) && ordered.at(-1)?.generation === m.generation);
        ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(op, ['operationId', 'requestDigest', 'generation', 'resultDigest', 'receiptData']) && op.operationId === m.creationOperationId && op.generation === '1' && op.requestDigest === m.creationDigest && op.requestDigest === (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)({ protocolVersion: 1, command: 'project.create', payload: { universeId: m.universeId } })) && typeof op.receiptData === 'string' && (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(op.receiptData) === op.resultDigest);
        const receipt = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)(Buffer.from(String(op.receiptData)));
        ensure((0,_application_contracts_project__WEBPACK_IMPORTED_MODULE_8__.validProjectReceipt)(receipt) && receipt.operationId === m.creationOperationId && receipt.owner.id === m.ownerId && receipt.recordVersion === r.recordVersion);
        return { ownerId: String(m.ownerId), rootId: String(m.rootId), universeId: String(m.universeId), generation: String(m.generation), recordVersion: String(r.recordVersion), location: this.location, universeLocation: String(u.basePath), creationOperationId: String(m.creationOperationId) };
    }
    binding() {
        const rows = this.db.prepare('SELECT * FROM root_locations').all(), b = rows[0];
        ensure(rows.length === 1 && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.closed)(b, ['rootId', 'ownerKind', 'ownerId', 'basePath', 'bindingVersion']) && b.rootId === this.d.rootId && b.ownerKind === 'project' && b.ownerId === this.d.id && typeof b.basePath === 'string' && node_path__WEBPACK_IMPORTED_MODULE_4___default().isAbsolute(b.basePath) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(b.bindingVersion));
        return b;
    }
    checkBinding() {
        const b = this.binding();
        if (b.basePath === this.location)
            return;
        let original;
        try {
            original = node_fs__WEBPACK_IMPORTED_MODULE_3___default().realpathSync(String(b.basePath));
        }
        catch (e) {
            if (e.code === 'ENOENT')
                return;
            throw e;
        }
        if (original === this.location || !node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync(original).isDirectory())
            return;
        if (node_fs__WEBPACK_IMPORTED_MODULE_3___default().readdirSync(original).some(n => ['writingtool.json', '.writingtool-creation.json', 'database'].includes(n))) {
            // An unreadable/missing descriptor alongside authority evidence is
            // uncertain, not proof that this is an independent movable root.
            const prior = discovery(original);
            ensure(prior.id !== this.d.id && prior.rootId !== this.d.rootId, 'The original project folder still exists. This copy cannot become a second authority.');
        }
    }
    bind(universeLocation) {
        this.snapshot();
        this.checkBinding();
        const b = this.binding(), u = this.db.prepare('SELECT * FROM universe_locations').get();
        (0,_universe_storage__WEBPACK_IMPORTED_MODULE_10__.transaction)(this.db, () => {
            this.health();
            if (b.basePath !== this.location)
                ensure(this.db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=? AND bindingVersion=?').run(this.location, (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)(), this.d.rootId, String(b.bindingVersion)).changes === 1);
            if (u.basePath !== universeLocation)
                ensure(this.db.prepare('UPDATE universe_locations SET basePath=?,bindingVersion=? WHERE universeId=? AND bindingVersion=?').run(universeLocation, (0,node_crypto__WEBPACK_IMPORTED_MODULE_5__.randomUUID)(), String(u.universeId), String(u.bindingVersion)).changes === 1);
        });
    }
    prepareRelocatedReopen(basePath) {
        if (this.released || basePath === this.location)
            return false;
        const root = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync(basePath);
        if (root.ino !== this.rootIdentity.ino || root.dev !== this.rootIdentity.dev)
            return false;
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(discovery(basePath)) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(this.d), 'Moved project identity changed.');
        for (const identity of this.identities) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_3___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.checked)(basePath, identity.relative));
            ensure(current.dev === identity.dev && current.ino === identity.ino, 'Moved project authority identity changed.');
        }
        // Reopen SQLite at its new VFS path only after validating the same root
        // and authority files; never release ownership for an unrelated copy.
        this.releaseCandidate();
        return true;
    }
    close() { if (this.released)
        return; if (!this.releaseStarted)
        this.snapshot(); this.releaseCandidate(); }
    releaseCandidate() {
        if (this.released)
            return;
        this.releaseStarted = true;
        if (!this.databaseClosed) {
            this.workspace.detach();
            this.db.close();
            this.databaseClosed = true;
        }
        if (this.lease.isTransaction)
            this.lease.exec('ROLLBACK');
        this.lease.close();
        this.released = true;
    }
}


/***/ },

/***/ "./src/infrastructure/protection-service.ts"
/*!**************************************************!*\
  !*** ./src/infrastructure/protection-service.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProtectionService: () => (/* binding */ ProtectionService)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _revisions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./revisions */ "./src/infrastructure/revisions.ts");
/* harmony import */ var _archives__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./archives */ "./src/infrastructure/archives.ts");
/* harmony import */ var _recovery__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./recovery */ "./src/infrastructure/recovery.ts");
/* harmony import */ var _exports__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./exports */ "./src/infrastructure/exports.ts");
/* harmony import */ var _export_captures__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./export-captures */ "./src/infrastructure/export-captures.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_capture_time__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../domain/capture-time */ "./src/domain/capture-time.ts");
/* harmony import */ var _project_storage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./project-storage */ "./src/infrastructure/project-storage.ts");
/* harmony import */ var _recovery_activation__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./recovery-activation */ "./src/infrastructure/recovery-activation.ts");

















class ProtectionService {
    workspace;
    settings;
    userData;
    coordinator;
    openRecovered;
    revisions;
    archives;
    recovery;
    exportCaptures;
    operations = new Map();
    constructor(workspace, settings, userData, coordinator, openRecovered = () => { }) {
        this.workspace = workspace;
        this.settings = settings;
        this.userData = userData;
        this.coordinator = coordinator;
        this.openRecovered = openRecovered;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(userData, 'protection/recovered');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(userData, 'protection/jobs');
        this.revisions = new _revisions__WEBPACK_IMPORTED_MODULE_6__.RevisionStorage(workspace, owner => { try {
            return workspace.location(owner);
        }
        catch {
            const relative = `protection/recovered/${owner.kind}/${owner.id}`;
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(userData, relative);
            return node_path__WEBPACK_IMPORTED_MODULE_1___default().join(userData, relative);
        } });
        this.archives = new _archives__WEBPACK_IMPORTED_MODULE_7__.ArchiveStorage(this.revisions, userData);
        this.recovery = new _recovery__WEBPACK_IMPORTED_MODULE_8__.RecoveryStorage(workspace, this.revisions, userData);
        this.exportCaptures = new _export_captures__WEBPACK_IMPORTED_MODULE_10__.ExportCaptureStorage(workspace, userData, fn => coordinator.settingsGate(fn));
        this.cleanupExportCaptures();
    }
    cancel(id) { const control = this.operations.get(id); if (!control || !control.cancelable)
        return false; control.canceled = true; return true; }
    get busy() { return this.operations.size > 0; }
    progress() { return [...this.operations].map(([operationId, c]) => ({ operationId, phase: c.phase, cancelable: c.cancelable })); }
    job(id, value) { const relative = `protection/jobs/${id}.json`, old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)) ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.userData, relative)) : null; (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(this.userData, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(value)), old); }
    readJob(id) {
        const relative = `protection/jobs/${id}.json`;
        if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)))
            throw new Error('No durable protection job exists for that operation. Preserve its original recovery evidence.');
        const decoded = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.userData, relative));
        if (!decoded || typeof decoded !== 'object' || !('state' in decoded) || !['ready', 'started', 'prepared', 'complete', 'aborted'].includes(String(decoded.state)))
            throw new Error('The original protection job evidence is invalid.');
        const value = decoded;
        const outputEvidence = Object.hasOwn(value, 'destination') || Object.hasOwn(value, 'digest'), keys = ['schemaVersion', 'state', 'request', ...(value.state === 'complete' ? ['value'] : []), ...(value.state === 'prepared' || value.state === 'complete' && outputEvidence ? ['destination', 'digest'] : [])];
        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_12__.closed)(value, keys))
            throw new Error('The original protection job evidence is invalid.');
        if (value.schemaVersion !== 1 || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.validProtectionRequest)(value.request, true) || value.request.nativePrepareOnly || value.request.command === 'protection.reconcile' || value.request.command === 'protection.cancel' || value.request.requestId !== id || value.state === 'complete' && (!(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.validProtectionValue)(value.value) || !!value.value.reconciliation) || outputEvidence && (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_12__.closed)(value.destination, ['path', 'expectedHash']) || typeof value.destination.path !== 'string' || !node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(value.destination.path) || value.destination.expectedHash !== null && !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.digest)(value.destination.expectedHash) || !(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.digest)(value.digest)) || value.state === 'prepared' && !outputEvidence || outputEvidence && !['protection.backup', 'protection.apply', 'protection.export'].includes(value.request.command))
            throw new Error('The original protection job evidence is invalid.');
        return value;
    }
    prepare(request) {
        if (this.busy)
            throw new Error('Wait for the current protection operation before preparing another.');
        if (request.command === 'protection.reconcile' || request.command === 'protection.cancel')
            throw new Error('Only an original protection command can be prepared.');
        const relative = `protection/jobs/${request.requestId}.json`;
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative))) {
            const prior = this.readJob(request.requestId);
            if (prior.state !== 'ready' || (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(prior.request) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(request))
                throw new Error('The protection request identity already has different durable evidence.');
            return;
        }
        this.job(request.requestId, { schemaVersion: 1, state: 'ready', request });
    }
    releaseExportCapture(id) {
        try {
            this.exportCaptures.release(id);
            return [];
        }
        catch {
            return ['The output result is recorded, but temporary export-capture cleanup was deferred.'];
        }
    }
    cleanupExportCaptures() {
        let ids;
        try {
            ids = this.exportCaptures.ids();
        }
        catch {
            return;
        }
        for (const id of ids)
            try {
                const job = this.readJob(id);
                if (job.request.command === 'protection.export' && (job.state === 'complete' || job.state === 'aborted'))
                    this.releaseExportCapture(id);
            }
            catch { /* Preserve ambiguous or incomplete evidence. */ }
    }
    completeJob(id, request, value, prepared) {
        if (value.output && (!prepared?.destination || !prepared.digest || prepared.destination.path !== value.output.path))
            throw new Error('The completed output lacks matching publication evidence.');
        const evidence = prepared?.destination && prepared.digest ? { destination: prepared.destination, digest: prepared.digest } : {};
        this.job(id, { schemaVersion: 1, state: 'complete', request, value, ...evidence });
        if (request.command === 'protection.export') {
            const warnings = this.releaseExportCapture(id);
            if (warnings.length)
                value = { ...value, warnings: [...(value.warnings ?? []), ...warnings] };
        }
        return value;
    }
    async execute(request, replaying = false) {
        if (request.nativePrepareOnly) {
            const { nativePrepareOnly: _nativePrepareOnly, ...original } = request;
            this.prepare(original);
            return {};
        }
        if (request.command === 'protection.reconcile') {
            const job = this.readJob(request.operationId);
            if (job.request.command === 'protection.apply') {
                this.relocateActivation(job.request, request.nativeActivationLocations ?? []);
                // Reopen published roots even when only the ZIP acknowledgement was lost.
                if (this.readActivation(job.request))
                    this.resumeActivation(job.request);
            }
            if (job.state === 'aborted')
                return { reconciliation: { operationId: request.operationId, outcome: 'not-committed' } };
            if (job.state === 'complete') {
                if (job.value?.output) {
                    if (!job.destination || !job.digest || job.destination.path !== job.value.output.path)
                        throw new Error('The completed output lacks original digest evidence. Preserve the output and recovery metadata.');
                    if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(job.destination.path), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(job.destination.path))) !== job.digest)
                        throw new Error('The completed output changed or moved. Preserve the original operation for recovery.');
                }
                if (job.request.command === 'protection.export')
                    this.releaseExportCapture(request.operationId);
                return job.value;
            }
            if (job.destination && job.digest && node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(job.destination.path)) {
                const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(job.destination.path), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(job.destination.path));
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === job.digest) {
                    if (job.request.command === 'protection.backup' || job.request.command === 'protection.apply') {
                        await this.archives.registerCompleted(job.destination.path, { canceled: false, phase: 'Reconciling published archive', cancelable: false });
                        if (job.request.command === 'protection.apply')
                            this.recovery.markApplied(job.request.proposalId);
                    }
                    const value = { output: { id: request.operationId, path: job.destination.path, notice: job.request.command === 'protection.export' && job.request.format === 'sqlite' ? _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.CATALOG_NOTICE : null }, ...(job.request.command === 'protection.apply' ? { recovery: this.recovery.view(job.request.proposalId) } : {}) };
                    return this.completeJob(request.operationId, job.request, value, job);
                }
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) !== job.destination.expectedHash)
                    throw new Error('Output evidence changed. Preserve the original operation for recovery.');
            }
            if (request.nativeDestination && job.request.command === 'protection.export')
                job.request = { ...job.request, nativeDestination: request.nativeDestination, nativeRuntime: request.nativeRuntime ?? job.request.nativeRuntime };
            if (request.nativeBackupFolder && (job.request.command === 'protection.backup' || job.request.command === 'protection.apply')) {
                job.request = { ...job.request, nativeBackupFolder: request.nativeBackupFolder };
                delete job.request.nativeDestination;
            }
            return this.execute(job.request, true);
        }
        const previous = replaying ? this.readJob(request.requestId) : undefined;
        let value;
        try {
            value = await this.executeRecorded(request, previous);
        }
        catch (error) {
            if (request.command === 'protection.export' && !replaying && !(error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure && error.outcome !== 'not-committed')) {
                // Record definite failure/cancellation before reclaiming its private capture.
                // If recording is unconfirmed, reconciliation still owns the original pin.
                try {
                    this.job(request.requestId, { schemaVersion: 1, state: 'aborted', request });
                }
                catch (recording) {
                    throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('RECOVERY_REQUIRED', recording instanceof Error ? recording.message : 'The export failure outcome needs reconciliation.', 'unknown');
                }
                this.releaseExportCapture(request.requestId);
            }
            throw error;
        }
        if ((0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.protectionHasDurableEffects)(request)) {
            try {
                const prepared = value.output ? this.readJob(request.requestId) : undefined;
                value = this.completeJob(request.requestId, request, value, prepared);
            }
            catch (error) {
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('RECOVERY_REQUIRED', error instanceof Error ? error.message : 'Completion recording failed. Reconcile the original operation.', 'unknown');
            }
        }
        return value;
    }
    async executeRecorded(request, previous) {
        if (request.command === 'protection.cancel') {
            this.cancel(request.operationId);
            return {};
        }
        if (this.busy)
            throw new Error('Wait for the current protection operation to finish.');
        const control = { canceled: false, phase: 'Preparing saved capture', cancelable: true };
        this.operations.set(request.requestId, control);
        try {
            if ((0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.protectionHasDurableEffects)(request) && previous?.state !== 'prepared')
                this.job(request.requestId, { schemaVersion: 1, state: 'started', request });
            control.beforePublish = (destination, digest) => this.job(request.requestId, { schemaVersion: 1, state: 'prepared', request, destination, digest });
            switch (request.command) {
                case 'protection.archives':
                    await this.archives.discover(request.owner, [this.settings.get().backupDestination], control);
                    return { archives: this.archives.registry().filter(r => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(r.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(request.owner)) };
                case 'protection.archive-locate':
                    if (!request.nativeArchive)
                        throw new _archives__WEBPACK_IMPORTED_MODULE_7__.OperationCanceled();
                    return { archives: await this.archives.locate(request.owner, request.id, request.nativeArchive, control) };
                case 'protection.pending': return { pending: [], proposals: node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, 'protection/proposals')).filter(n => /^[a-f0-9-]{36}\.json$/.test(n)).map(n => n.slice(0, -5)) };
                case 'protection.recents':
                case 'protection.recent': throw new Error('Recent roots are selected by the native capability owner.');
                case 'protection.history': return { history: this.revisions.list(request.owner) };
                case 'protection.capture': {
                    const manifest = this.revisions.capture(request.owner, request.reason, request.requestId);
                    (0,_recovery__WEBPACK_IMPORTED_MODULE_8__.validateCaptureCatalogs)(manifest, this.revisions);
                    return { manifest, warnings: this.retentionWarnings(request.owner) };
                }
                case 'protection.inspect':
                    {
                        const manifest = this.revisions.get(request.owner, request.revisionId);
                        return this.inspection(manifest);
                    }
                    // removed by dead control flow

                case 'protection.backup': {
                    const manifest = this.revisions.capture(request.owner, request.reason, request.requestId), destination = this.backupDestination(request.nativeDestination, request.owner, manifest, request.nativeBackupFolder);
                    const record = await this.archives.write(manifest, destination, control, request.requestId);
                    return { manifest, output: { id: record.id, path: destination.path, notice: null }, warnings: this.retentionWarnings(request.owner) };
                }
                case 'protection.delete': {
                    const settings = this.settings.get();
                    if (request.kind === 'archive')
                        this.archives.remove(request.owner, request.id, settings.retentionDays, true);
                    else
                        this.revisions.remove(request.owner, request.id, this.protectedIds(request.owner), settings.retentionDays, true);
                    return { deleted: request.id };
                }
                case 'protection.recover': {
                    const manifest = request.revisionId && request.owner ? this.revisions.get(request.owner, request.revisionId) : request.nativeArchive ? await this.archives.import(request.nativeArchive, control) : null;
                    if (!manifest)
                        throw new Error('Choose a complete ZIP or retained revision.');
                    return { ...this.inspection(manifest), recovery: this.recovery.begin(manifest, request.scope) };
                }
                case 'protection.reference': return { recovery: this.recovery.reference(request.proposalId, request.sourceId, request.targetId, request.action, request.replacementId) };
                case 'protection.resume':
                    {
                        const recovery = this.recovery.resume(request.proposalId);
                        return { ...this.inspection(this.recovery.manifest(recovery.proposal)), recovery };
                    }
                    // removed by dead control flow

                case 'protection.resolve': return { recovery: this.recovery.resolve(request.proposalId, request.resolution) };
                case 'protection.cancel-recovery': return { recovery: this.recovery.cancel(request.proposalId) };
                case 'protection.apply': return await this.applyRecovery(request, control);
                case 'protection.export': {
                    if (!request.nativeDestination)
                        throw new _archives__WEBPACK_IMPORTED_MODULE_7__.OperationCanceled();
                    this.assertOutputOutsideRoots(request.nativeDestination.path, true);
                    control.phase = 'Pinning the saved export generation';
                    await (0,_exports__WEBPACK_IMPORTED_MODULE_9__.exportSaved)(this.exportCaptures.load(request), request.format, request.storyId, request.chapterIds, request.nativeDestination, request.nativeRuntime, control);
                    return { output: { id: (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), path: request.nativeDestination.path, notice: request.format === 'sqlite' ? _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.CATALOG_NOTICE : null } };
                }
                case 'protection.reconcile': throw new Error('Reconciliation must retain its original job.');
                case 'protection.open': throw new Error('Completed outputs are opened by the native capability owner.');
            }
        }
        catch (error) {
            if (!control.cancelable)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('RECOVERY_REQUIRED', error instanceof Error ? error.message : 'Publication outcome requires reconciliation.', 'unknown');
            throw error;
        }
        finally {
            this.operations.delete(request.requestId);
        }
    }
    inspection(manifest) { const assets = manifest.units.flatMap(unit => unit.snapshot.assets.map(asset => { const file = unit.files.find(f => f.relativePath.startsWith(`images/${asset.id}.`)); if (!file)
        throw new Error('Captured profile image is missing from the immutable closure.'); return { ...asset, base64: this.revisions.object(manifest.owner, file.object).toString('base64') }; })); return { manifest, units: this.revisions.resolve(manifest), assets }; }
    assertOutputOutsideRoots(file, includeUserData = false) {
        const resolved = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(file)), node_path__WEBPACK_IMPORTED_MODULE_1___default().basename(file)), snapshot = this.workspace.snapshot(), roots = [snapshot.project?.owner, snapshot.universe?.owner].filter((owner) => !!owner).map(owner => this.workspace.location(owner));
        if (includeUserData)
            roots.push(this.userData);
        for (const root of roots) {
            const relative = node_path__WEBPACK_IMPORTED_MODULE_1___default().relative(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(root), resolved);
            if (!relative || relative !== '..' && !relative.startsWith('..' + (node_path__WEBPACK_IMPORTED_MODULE_1___default().sep)) && !node_path__WEBPACK_IMPORTED_MODULE_1___default().isAbsolute(relative))
                throw new Error('The output destination is inside an active writing root. Choose another output location.');
        }
    }
    backupDestination(selected, owner, manifest, nativeFolder) {
        if (selected) {
            this.assertOutputOutsideRoots(selected.path);
            return selected;
        }
        const folder = nativeFolder ?? this.settings.get().backupDestination;
        if (!folder)
            throw new Error('Choose a backup destination.');
        const stem = `${(0,_domain_capture_time__WEBPACK_IMPORTED_MODULE_13__.safeDisplayName)(manifest.displayName)}${owner.kind === 'project' ? '_' + (0,_domain_capture_time__WEBPACK_IMPORTED_MODULE_13__.safeDisplayName)(manifest.universeDisplayName) : ''}_${manifest.localCaptureStart}`;
        let name = stem + '.zip', suffix = 2;
        while (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(folder, name)))
            name = `${stem}_${suffix++}.zip`;
        const destination = { path: node_path__WEBPACK_IMPORTED_MODULE_1___default().join(folder, name), expectedHash: null };
        this.assertOutputOutsideRoots(destination.path);
        return destination;
    }
    protectedIds(owner) { const ids = this.archives.protectedRevisionIds(); const live = this.workspace.snapshot(), owners = [owner, ...[live.project?.owner, live.universe?.owner].filter((o) => !!o)]; for (const candidate of new Map(owners.map(o => [(0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(o), o])).values())
        for (const manifest of this.revisions.list(candidate))
            for (const id of manifest.retainedRevisionIds)
                ids.add(id); for (const name of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, 'protection/proposals')).filter(n => /^[a-f0-9-]{36}\.json$/.test(n))) {
        try {
            const proposal = this.recovery.get(name.replace(/\.json$/, ''));
            if (proposal.status !== 'applied') {
                ids.add(proposal.revisionId);
                if (proposal.replacedRevisionId)
                    ids.add(proposal.replacedRevisionId);
            }
        }
        catch {
            throw new Error('Uncertain pending recovery evidence blocks retention.');
        }
    } return ids; }
    retentionWarnings(owner) { try {
        this.retain(owner);
        return [];
    }
    catch (error) {
        return ['The capture completed, but automatic cleanup was deferred. ' + (error instanceof Error ? error.message : 'Retained evidence could not be checked.')];
    } }
    retain(owner) {
        const settings = this.settings.get(), protectedIds = this.protectedIds(owner);
        for (const m of this.revisions.list(owner).reverse())
            if (!protectedIds.has(m.id))
                this.revisions.remove(owner, m.id, protectedIds, settings.retentionDays);
        const archives = this.archives.registry().filter(a => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(a.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(owner)).sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt)), newestTen = new Set(archives.slice(0, 10).map(a => a.id));
        for (const archive of archives.reverse()) {
            if (newestTen.has(archive.id) || BigInt(Date.now() - Date.parse(archive.capturedAt)) < BigInt(settings.retentionDays) * 86400000n)
                continue;
            this.archives.remove(owner, archive.id, settings.retentionDays);
        }
    }
    async applyRecovery(request, control) {
        let activated, manifest;
        const existing = this.readActivation(request);
        if (existing) {
            control.cancelable = false;
            control.phase = 'Resuming confirmed activation';
            activated = this.resumeActivation(request);
            manifest = this.revisions.capture(this.recovery.get(request.proposalId).owner, 'Recovered', request.requestId);
        }
        else {
            const result = this.recovery.apply(request.proposalId, undefined, () => { control.cancelable = false; control.phase = 'Applying confirmed recovery'; }, request.requestId);
            manifest = result.manifest;
            if (result.needsActivation) {
                if (!request.nativeActivation)
                    throw new Error('Choose an empty recovery destination before activation.');
                const live = this.workspace.snapshot(), coordinated = !!live.universe && manifest.owner.kind === 'project';
                const locations = { project: manifest.owner.kind === 'project' ? request.nativeActivation.project : null, universe: coordinated ? this.workspace.location(live.universe.owner) : request.nativeActivation.universe };
                if (!coordinated && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(result.units) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(this.revisions.resolve(manifest)))
                    throw new Error('The confirmed recovery differs from the captured catalogs. Preserve the proposal for reconciliation.');
                const proposal = this.recovery.get(request.proposalId);
                (0,_recovery__WEBPACK_IMPORTED_MODULE_8__.validateCaptureCatalogs)(manifest, this.revisions);
                const staged = new Map();
                let decision;
                try {
                    const participants = this.revisions.resolve(manifest).filter(u => !coordinated || u.owner.kind === 'project').map(unit => this.stageActivation(manifest, unit, locations, staged));
                    decision = { schemaVersion: 2, requestId: request.requestId, proposalId: proposal.id, manifestId: manifest.id, operationId: proposal.operationId, state: coordinated ? 'await-coordinator' : 'commit', locations, participants };
                    if (!(0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.validActivationDecision)(decision))
                        throw new Error('Recovery destinations must be separate from every owning and staging root.');
                }
                catch (error) {
                    this.discardUnpublishedStages(staged);
                    throw error;
                }
                // Every staged tree is durable before the one publication decision is made.
                control.cancelable = false;
                control.phase = 'Activating confirmed recovery';
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(this.userData, (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationPath)(request.requestId), Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(decision)), null);
                activated = this.resumeActivation(request);
                manifest = this.revisions.capture(manifest.owner, 'Recovered', request.requestId);
            }
            else
                control.cancelable = false;
        }
        const destination = this.backupDestination(request.nativeDestination, manifest.owner, manifest, request.nativeBackupFolder), record = await this.archives.write(manifest, destination, control, request.requestId);
        this.recovery.markApplied(request.proposalId);
        return { recovery: this.recovery.view(request.proposalId), ...(activated ? { activated } : {}), output: { id: record.id, path: destination.path, notice: null } };
    }
    readActivation(request) {
        const relative = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationPath)(request.requestId), proposal = this.recovery.get(request.proposalId);
        if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative))) {
            // Legacy decisions lack a binding to the original Apply request. Never guess.
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, `protection/activation-${proposal.revisionId}.json`)))
                throw new Error('Legacy activation evidence needs explicit identity reconciliation. Preserve the existing roots and decision.');
            return undefined;
        }
        const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.userData, relative));
        if (!(0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.validActivationDecision)(value) || value.requestId !== request.requestId || value.proposalId !== proposal.id || value.manifestId !== proposal.revisionId || value.operationId !== proposal.operationId)
            throw new Error('The original activation decision is invalid. Preserve all recovery evidence.');
        const manifest = this.recovery.manifest(proposal);
        if (!value.participants.every(p => manifest.units.some(u => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(u.snapshot.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(p.owner) && u.snapshot.rootId === p.rootId)) || proposal.owner.kind === 'project' && value.locations.project === null || !value.participants.some(p => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(p.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(proposal.owner)))
            throw new Error('Activation participants do not match the confirmed capture.');
        return value;
    }
    saveActivation(decision) { const relative = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationPath)(decision.requestId); (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(this.userData, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(decision)), (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.userData, relative))); }
    assertActivationIdentity(root, participant) {
        const discovery = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(root, 'writingtool.json'));
        if (!discovery || typeof discovery !== 'object' || !('kind' in discovery) || !('id' in discovery) || !('rootId' in discovery) || discovery.kind !== participant.owner.kind || discovery.id !== participant.owner.id || discovery.rootId !== participant.rootId)
            throw new Error('An activation participant identity changed. Locate the original owning root.');
    }
    stageActivation(manifest, unit, locations, staged) {
        const destination = unit.owner.kind === 'project' ? locations.project : locations.universe;
        if (!destination)
            throw new Error('A project recovery needs both owning destinations.');
        this.assertEmptyDestination(destination);
        const stage = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(destination), `.recovery-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}`);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(stage, { mode: 0o700 });
        const identity = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(stage);
        staged.set(stage, { dev: identity.dev, ino: identity.ino });
        for (const directory of ['images', 'profiles', 'projects', 'database/operations'])
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(stage, directory), { recursive: true, mode: 0o700 });
        for (const file of manifest.units.find(u => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(u.snapshot.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(unit.owner)).files) {
            const target = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(stage, file.relativePath);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(target), { recursive: true, mode: 0o700 });
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(target, this.revisions.object(manifest.owner, file.object), { flag: 'wx', mode: 0o600 });
        }
        const catalog = new node_sqlite__WEBPACK_IMPORTED_MODULE_3__.DatabaseSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(stage, 'database/catalog.sqlite'));
        try {
            const binding = catalog.prepare('SELECT basePath FROM root_locations').get();
            if (binding && node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(String(binding.basePath))) {
                const previous = String(binding.basePath);
                if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(previous, 'writingtool.json'))) {
                    const discovery = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(previous, 'writingtool.json'));
                    if (discovery.id === unit.owner.id || discovery.rootId === unit.rootId)
                        throw new Error('The original authority is accessible. Locate and reconcile with it before activation.');
                }
                else if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(previous, 'database/catalog.sqlite')))
                    throw new Error('The original authority identity is uncertain. Locate it before activation.');
            }
        }
        finally {
            catalog.close();
        }
        ;(0,_recovery__WEBPACK_IMPORTED_MODULE_8__.rebindCapturedCatalog)(stage, unit, locations.universe);
        this.copyProtectionClosure(stage, unit.owner);
        this.flushTree(stage);
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(stage));
        return { stage, destination, owner: unit.owner, rootId: unit.rootId };
    }
    discardUnpublishedStages(staged) {
        for (const [stage, identity] of staged)
            try {
                const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(stage);
                if (!stat.isDirectory() || stat.isSymbolicLink() || stat.dev !== identity.dev || stat.ino !== identity.ino || node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(stage) !== stage)
                    continue;
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmSync(stage, { recursive: true });
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(stage));
            }
            catch { /* Uncertain private staging evidence is preserved; no activation decision was published. */ }
    }
    assertEmptyDestination(destination) {
        if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(destination))
            return;
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(destination);
        if (!stat.isDirectory() || stat.isSymbolicLink() || node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(destination).length)
            throw new Error('Recovery destination changed. Preserve the staged roots and original decision.');
    }
    relocateActivation(request, locations) {
        if (!locations.length)
            return;
        const decision = this.readActivation(request);
        if (!decision)
            throw new Error('No original activation decision exists for these locations.');
        if (new Set(locations.map(p => p.rootId)).size !== locations.length)
            throw new Error('Duplicate activation location capabilities.');
        for (const selected of locations) {
            const participant = decision.participants.find(p => p.rootId === selected.rootId && (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(p.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(selected.owner));
            if (!participant) {
                const universe = this.recovery.manifest(this.recovery.get(request.proposalId)).units.find(u => u.snapshot.owner.kind === 'universe').snapshot;
                if (selected.destination)
                    throw new Error('A universe location cannot change a staged publication destination.');
                if (decision.participants.length !== 1 || decision.participants[0].owner.kind !== 'project' || (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(selected.owner) !== (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(universe.owner) || selected.rootId !== universe.rootId)
                    throw new Error('The selected root is outside the original activation.');
                this.assertActivationIdentity(selected.location, { owner: universe.owner, rootId: universe.rootId });
                decision.locations.universe = selected.location;
                continue;
            }
            const staged = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(participant.stage, participant), published = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(participant.destination, participant), location = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(selected.location, participant);
            if (!location)
                throw new Error('The selected activation location has a different permanent identity.');
            if (published && published !== location || staged && staged !== location)
                throw new Error('An original activation authority remains accessible. Reconcile it before rebinding.');
            if (selected.destination) {
                if (published)
                    throw new Error('A published activation retains its located publication root.');
                if (!(0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationDestinationAvailable)(selected.destination, location))
                    throw new Error('Choose an empty publication destination on the same filesystem as the staged recovery root.');
                participant.stage = location;
                participant.destination = selected.destination;
                if (participant.owner.kind === 'project')
                    decision.locations.project = selected.destination;
                else
                    decision.locations.universe = selected.destination;
            }
            else if (decision.state === 'await-coordinator')
                throw new Error('Choose the empty publication destination for the relocated staged project.');
            else {
                participant.destination = location;
                if (participant.owner.kind === 'project')
                    decision.locations.project = location;
                else
                    decision.locations.universe = location;
            }
        }
        if (!(0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.validActivationDecision)(decision))
            throw new Error('The selected activation locations overlap.');
        this.saveActivation(decision);
    }
    resumeActivation(request) {
        const decision = this.readActivation(request);
        if (!decision)
            throw new Error('No activation decision exists.');
        if (decision.participants.length === 1 && decision.participants[0].owner.kind === 'project') {
            const universe = this.recovery.manifest(this.recovery.get(request.proposalId)).units.find(u => u.snapshot.owner.kind === 'universe').snapshot;
            this.assertActivationIdentity(decision.locations.universe, { owner: universe.owner, rootId: universe.rootId });
            const project = decision.participants[0], projectRoot = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(project.stage, project) ?? (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(project.destination, project);
            if (!projectRoot)
                throw new Error('Locate the original recovered project before activation reconciliation.');
            this.assertActivationIdentity(projectRoot, project);
            this.coordinator.locateActivationParticipant(universe.owner, universe.rootId, universe.universeId, decision.locations.universe);
            this.coordinator.locateActivationParticipant(project.owner, project.rootId, universe.universeId, projectRoot);
            const current = this.workspace.snapshot();
            if (!current.universe)
                this.openRecovered({ project: null, universe: decision.locations.universe });
            else if (current.universe.rootId !== universe.rootId || (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(current.universe.owner) !== (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(universe.owner))
                throw new Error('The original universe is required for activation reconciliation.');
        }
        if (decision.state === 'await-coordinator') {
            const live = this.workspace.snapshot(), manifest = this.recovery.manifest(this.recovery.get(request.proposalId)), universe = manifest.units.find(u => u.snapshot.owner.kind === 'universe').snapshot;
            if (!live.universe || (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(live.universe.owner) !== (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(universe.owner) || live.universe.rootId !== universe.rootId)
                throw new Error('Reopen the original universe before reconciling its project activation.');
            decision.locations.universe = this.workspace.location(live.universe.owner);
            const participant = decision.participants[0];
            this.assertActivationIdentity(participant.stage, participant);
            // Opening registers the exact staged root at its current location before coordinator recovery.
            const store = new _project_storage__WEBPACK_IMPORTED_MODULE_14__.FileProjectStorage(this.coordinator).open(participant.stage);
            try {
                store.bind(decision.locations.universe);
                this.workspace.withRecoveryProject(store.workspace, participant.stage, () => {
                    const proposal = this.recovery.get(request.proposalId);
                    if (!proposal.expected.some(e => (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(e.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_6__.ownerKey)(participant.owner)))
                        this.recovery.bindStaged(proposal.id, participant.owner, store.workspace.snapshot().generation);
                    if (proposal.status === 'review')
                        this.recovery.apply(proposal.id, live.universe.owner, () => { }, request.requestId);
                    if (!this.workspace.reconcile(decision.operationId))
                        throw new Error('Activation remains pending its original coordinator decision.');
                });
            }
            finally {
                store.close();
            }
            decision.state = 'commit';
            this.saveActivation(decision);
        }
        // Validate the whole participant set before publishing even the first rename.
        const stagedParticipants = decision.participants.filter(participant => {
            const staged = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(participant.stage, participant), published = (0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationRootAt)(participant.destination, participant);
            if (staged && published)
                throw new Error('Both recovery locations contain the original identity. Preserve both roots before reconciliation.');
            if (!staged && !published)
                throw new Error('Locate the original recovered owning root before activation reconciliation.');
            if (staged && !(0,_recovery_activation__WEBPACK_IMPORTED_MODULE_15__.activationDestinationAvailable)(participant.destination, staged))
                throw new Error('Choose an empty publication destination on the staged recovery filesystem.');
            return !!staged;
        });
        if (decision.state !== 'complete' || stagedParticipants.length) {
            for (const participant of stagedParticipants) {
                this.assertActivationIdentity(participant.stage, participant);
                this.assertEmptyDestination(participant.destination);
                if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(participant.destination))
                    node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmdirSync(participant.destination);
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(participant.stage, participant.destination);
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(participant.destination));
                if (node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(participant.stage) !== node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(participant.destination))
                    (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(participant.stage));
            }
            decision.state = 'complete';
            this.saveActivation(decision);
        }
        // Choice locking survives failure to open or publish the mandatory reconciled ZIP.
        this.recovery.markBackupRequired(request.proposalId);
        this.openRecovered(decision.locations);
        return decision.locations;
    }
    flushTree(root) { for (const entry of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(root, { withFileTypes: true })) {
        const file = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, entry.name);
        if (entry.isDirectory())
            this.flushTree(file);
        else {
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
        }
    } ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(root); }
    copyProtectionClosure(root, owner) { ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(root, 'history/protection/manifests'); (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(root, 'history/protection/objects'); for (const m of this.revisions.list(owner)) {
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(root, `history/protection/manifests/${m.id}.json`, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(m)), null);
        for (const u of m.units)
            for (const f of u.files) {
                const relative = `history/protection/objects/${f.object.sha256}`;
                if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, relative)))
                    (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(root, relative, this.revisions.object(owner, f.object), null);
            }
    } }
}


/***/ },

/***/ "./src/infrastructure/recovery-activation.ts"
/*!***************************************************!*\
  !*** ./src/infrastructure/recovery-activation.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activationDestinationAvailable: () => (/* binding */ activationDestinationAvailable),
/* harmony export */   activationPath: () => (/* binding */ activationPath),
/* harmony export */   activationRootAt: () => (/* binding */ activationRootAt),
/* harmony export */   validActivationDecision: () => (/* binding */ validActivationDecision)
/* harmony export */ });
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");





const activationPath = (requestId) => `protection/activation-${requestId}.json`;
const absolute = (value) => typeof value === 'string' && node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(value) && !value.includes('\0');
const inside = (file, root) => { const relative = node_path__WEBPACK_IMPORTED_MODULE_0___default().relative(root, file); return !relative || relative !== '..' && !relative.startsWith('..' + (node_path__WEBPACK_IMPORTED_MODULE_0___default().sep)) && !node_path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(relative); };
/** An empty/foreign replacement at an old path is not the missing participant. */
function activationRootAt(root, participant) {
    let location;
    try {
        location = node_fs__WEBPACK_IMPORTED_MODULE_1___default().realpathSync(root);
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return null;
        throw error;
    }
    let discovery;
    try {
        discovery = (0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_4__.readManaged)(location, 'writingtool.json'));
    }
    catch (error) {
        if (error.code === 'ENOENT' && !['database', '.writingtool-creation.json'].some(name => node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_0___default().join(location, name))))
            return null;
        throw new Error('An original recovery path has unreadable authority evidence. Preserve it before locating the participant.');
    }
    if (!discovery || typeof discovery !== 'object' || !('kind' in discovery) || !('id' in discovery) || !('rootId' in discovery))
        throw new Error('An original recovery path has invalid authority evidence.');
    if (discovery.kind === participant.owner.kind && discovery.id === participant.owner.id && discovery.rootId === participant.rootId)
        return location;
    if (discovery.id === participant.owner.id || discovery.rootId === participant.rootId)
        throw new Error('A recovery path has conflicting permanent owner identity.');
    return null;
}
function activationDestinationAvailable(destination, stage) {
    try {
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_1___default().lstatSync(destination);
        if (!stat.isDirectory() || stat.isSymbolicLink() || node_fs__WEBPACK_IMPORTED_MODULE_1___default().readdirSync(destination).length)
            return false;
    }
    catch (error) {
        if (error.code !== 'ENOENT')
            throw error;
    }
    try {
        return node_fs__WEBPACK_IMPORTED_MODULE_1___default().statSync(node_fs__WEBPACK_IMPORTED_MODULE_1___default().realpathSync(node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(destination))).dev === node_fs__WEBPACK_IMPORTED_MODULE_1___default().statSync(stage).dev;
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return false;
        throw error;
    }
}
function validActivationDecision(value) {
    if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value, ['schemaVersion', 'requestId', 'proposalId', 'manifestId', 'operationId', 'state', 'locations', 'participants']) || value.schemaVersion !== 2 || ![value.requestId, value.proposalId, value.manifestId, value.operationId].every(_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid) || !['await-coordinator', 'commit', 'complete'].includes(String(value.state)) || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(value.locations, ['project', 'universe']) || value.locations.project !== null && !absolute(value.locations.project) || !absolute(value.locations.universe) || !Array.isArray(value.participants) || !value.participants.length || value.participants.length > 2)
        return false;
    const locations = value.locations;
    if (!value.participants.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.closed)(p, ['stage', 'destination', 'owner', 'rootId']) && absolute(p.stage) && absolute(p.destination) && p.stage !== p.destination && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_2__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_3__.isUuid)(p.rootId) && p.destination === (p.owner.kind === 'project' ? locations.project : locations.universe)))
        return false;
    const participants = value.participants;
    const roots = participants.flatMap(p => [p.stage, p.destination]);
    if (!participants.some(p => p.owner.kind === 'universe'))
        roots.push(locations.universe);
    return new Set(participants.map(p => p.owner.kind)).size === participants.length && new Set(participants.map(p => p.rootId)).size === participants.length && roots.every((root, index) => roots.slice(index + 1).every(other => !inside(root, other) && !inside(other, root))) && (value.state !== 'await-coordinator' || participants.length === 1 && participants[0].owner.kind === 'project');
}


/***/ },

/***/ "./src/infrastructure/recovery.ts"
/*!****************************************!*\
  !*** ./src/infrastructure/recovery.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RecoveryStorage: () => (/* binding */ RecoveryStorage),
/* harmony export */   rebindCapturedCatalog: () => (/* binding */ rebindCapturedCatalog),
/* harmony export */   validateCaptureCatalogs: () => (/* binding */ validateCaptureCatalogs)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:os */ "node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _revisions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./revisions */ "./src/infrastructure/revisions.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var _universe_storage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./universe-storage */ "./src/infrastructure/universe-storage.ts");
/* harmony import */ var _project_storage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./project-storage */ "./src/infrastructure/project-storage.ts");
/* harmony import */ var _domain_references__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../domain/references */ "./src/domain/references.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../domain/calendar */ "./src/domain/calendar.ts");















const fingerprint = (r) => r ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(r)) : null;
const contextualFingerprint = (r, records) => r ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)({ record: r, dependencies: (0,_domain_references__WEBPACK_IMPORTED_MODULE_12__.recordReferences)(r).map(ref => ({ id: ref.targetId, version: records.find(record => record.id === ref.targetId)?.recordVersion ?? null })).sort((a, b) => a.id.localeCompare(b.id)), calendar: ['chapter', 'event', 'decision', 'plot', 'affiliation', 'character'].includes(r.recordType) ? records.find(record => record.recordType === 'calendar')?.recordVersion ?? null : null })) : null;
/** Recreate runtime ownership only. Logical creation and complete committed-generation evidence remain untouched. */
function rebindCapturedCatalog(root, unit, universeRoot) {
    const file = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database/catalog.sqlite'), db = new node_sqlite__WEBPACK_IMPORTED_MODULE_4__.DatabaseSync(file);
    try {
        if (db.prepare('PRAGMA quick_check').get()?.quick_check !== 'ok')
            throw new Error('Recovered catalog integrity failed.');
        const meta = db.prepare('SELECT * FROM unit_meta').get();
        if (meta?.ownerId !== unit.owner.id || meta.rootId !== unit.rootId || meta.generation !== unit.generation || meta.creationState !== 'complete')
            throw new Error('Recovered catalog owner/generation mismatch.');
        const rows = db.prepare('SELECT * FROM root_locations').all();
        if (rows.length !== 1 || rows[0].rootId !== unit.rootId || rows[0].ownerId !== unit.owner.id)
            throw new Error('Foreign root binding.');
        db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=?').run(root, (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)(), unit.rootId);
        if (unit.owner.kind === 'project') {
            const bindings = db.prepare('SELECT * FROM universe_locations').all();
            if (bindings.length !== 1 || bindings[0].universeId !== unit.universeId)
                throw new Error('Foreign universe binding.');
            db.prepare('UPDATE universe_locations SET basePath=?,bindingVersion=? WHERE universeId=?').run(universeRoot, (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)(), unit.universeId);
        }
        db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    }
    finally {
        db.close();
    }
    const lease = new node_sqlite__WEBPACK_IMPORTED_MODULE_4__.DatabaseSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database/lease.sqlite'));
    try {
        lease.exec(`PRAGMA application_id=${unit.owner.kind === 'project' ? 1465140301 : 1465140300}; PRAGMA user_version=1; PRAGMA journal_mode=DELETE; PRAGMA synchronous=EXTRA; CREATE TABLE lease_identity(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1),ownerId TEXT NOT NULL,rootId TEXT NOT NULL);`);
        lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(unit.owner.id, unit.rootId);
    }
    finally {
        lease.close();
    }
    ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, 'database'));
}
/** Full existing-store readers verify exact schemas, creation receipts, generations, history, chapter pairs and indexes. */
function validateCaptureCatalogs(manifest, revisions) {
    const units = revisions.resolve(manifest), temp = node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir()), 'writingtool-validate-'));
    try {
        for (let i = 0; i < units.length; i++) {
            const root = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, units[i].owner.kind);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(root);
            for (const directory of ['images', 'profiles', 'projects', 'database/operations'])
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, directory), { recursive: true, mode: 0o700 });
            for (const file of manifest.units[i].files) {
                const target = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, file.relativePath);
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(target), { recursive: true, mode: 0o700 });
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(target, revisions.object(manifest.owner, file.object), { flag: 'wx', mode: 0o600 });
            }
        }
        for (const unit of units)
            rebindCapturedCatalog(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, unit.owner.kind), unit, node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'universe'));
        const universe = units.find(u => u.owner.kind === 'universe');
        if (universe) {
            const opened = new _universe_storage__WEBPACK_IMPORTED_MODULE_10__.FileUniverseStorage().open(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'universe'));
            try {
                opened.snapshot();
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(opened.workspace.snapshot()) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(universe))
                    throw new Error('Resolved universe snapshot disagrees with catalog.');
            }
            finally {
                opened.close();
            }
        }
        const project = units.find(u => u.owner.kind === 'project');
        if (project) {
            const opened = new _project_storage__WEBPACK_IMPORTED_MODULE_11__.FileProjectStorage().open(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'project'));
            try {
                opened.snapshot();
                if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(opened.workspace.snapshot()) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(project))
                    throw new Error('Resolved project snapshot disagrees with catalog.');
            }
            finally {
                opened.close();
            }
        }
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmSync(temp, { recursive: true, force: true });
    }
}
class RecoveryStorage {
    workspace;
    revisions;
    userData;
    manifestByProposal = new Map();
    constructor(workspace, revisions, userData) {
        this.workspace = workspace;
        this.revisions = revisions;
        this.userData = userData;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(userData, 'protection/proposals');
    }
    path(id) { return `protection/proposals/${id}.json`; }
    save(p) { const relative = this.path(p.id), old = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative)) ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, relative) : null; (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(this.userData, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(p)), old ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(old) : null); }
    get(id) { const v = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, this.path(id))); if (!(0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_6__.validProposal)(v) || v.id !== id)
        throw new Error('Unsupported recovery proposal.'); return v; }
    manifest(p) { return this.manifestByProposal.get(p.id) ?? this.revisions.get(p.owner, p.revisionId); }
    // oxlint-disable-next-line unicorn/no-useless-spread -- Snapshot the selected scope before adding linked birth records.
    begin(manifest, scope) { this.revisions.validate(manifest); validateCaptureCatalogs(manifest, this.revisions); this.pin(manifest); const units = this.live(); if (units.length && !units.some(u => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(u.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(manifest.owner)) && !(manifest.owner.kind === 'project' && units.length === 1 && units[0].owner.kind === 'universe' && units[0].owner.id === manifest.units.find(u => u.snapshot.owner.kind === 'project')?.snapshot.universeId))
        throw new Error('Close the current roots before recovering another identity.'); if (scope?.some(id => !this.revisions.resolve(manifest).some(u => u.records.some(r => r.id === id))))
        throw new Error('Selected restore item is absent from this capture.'); if (scope) {
        scope = [...scope];
        const records = this.revisions.resolve(manifest).flatMap(u => u.records);
        for (const id of [...scope]) {
            const record = records.find(r => r.id === id);
            const linked = record?.recordType === 'character' ? record.data.birthEventId : record?.recordType === 'event' && record.data.kind === 'birth' ? record.data.characterId : null;
            if (linked && !scope.includes(linked))
                scope.push(linked);
        }
    } const proposal = { schemaVersion: 1, id: (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)(), revisionId: manifest.id, owner: manifest.owner, status: 'review', scope, expected: units.map(u => ({ owner: u.owner, generation: u.generation })), choices: [], operationId: (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)(), replacedRevisionId: null }; this.manifestByProposal.set(proposal.id, manifest); this.save(proposal); return this.view(proposal.id); }
    pin(manifest) { const relative = `protection/recovered/${manifest.owner.kind}/${manifest.owner.id}`, root = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, relative); (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(this.userData, relative); (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(root, 'history/protection/manifests'); (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.ensureManagedDirectory)(root, 'history/protection/objects'); const p = `history/protection/manifests/${manifest.id}.json`; if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, p)))
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(root, p, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)(manifest)), null); for (const unit of manifest.units)
        for (const file of unit.files) {
            const p = `history/protection/objects/${file.object.sha256}`;
            if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(root, p)))
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(root, p, this.revisions.object(manifest.owner, file.object), null);
        } }
    live() { const s = this.workspace.snapshot(); return [s.project, s.universe].filter((u) => !!u); }
    view(id) {
        const proposal = this.get(id), manifest = this.manifest(proposal), live = this.live(), recovered = this.revisions.resolve(manifest), current = live.flatMap(u => u.records), incoming = recovered.flatMap(u => u.records).filter(r => !proposal.scope || proposal.scope.includes(r.id));
        const terminal = proposal.status !== 'review';
        let changed = false;
        const recoveredRecords = recovered.flatMap(u => u.records);
        const conflicts = incoming.filter(r => { const l = current.find(c => c.id === r.id); return !!l && fingerprint(l) !== fingerprint(r) || proposal.choices.some(c => c.recordId === r.id && c.liveFingerprint !== contextualFingerprint(l, current)); }).map(r => { const l = current.find(c => c.id === r.id); const choice = proposal.choices.find(c => c.recordId === r.id); if (!terminal && choice && (choice.liveFingerprint !== contextualFingerprint(l, current) || choice.recoveredFingerprint !== contextualFingerprint(r, recoveredRecords))) {
            proposal.choices = proposal.choices.filter(c => c !== choice);
            changed = true;
        } return { id: r.id, live: l ?? null, recovered: r, liveText: live.find(u => u.manuscripts[r.id] !== undefined)?.manuscripts[r.id] ?? null, recoveredText: recovered.find(u => u.manuscripts[r.id] !== undefined)?.manuscripts[r.id] ?? null, resolved: proposal.choices.some(c => c.recordId === r.id), liveFingerprint: contextualFingerprint(l, current), recoveredFingerprint: contextualFingerprint(r, recoveredRecords) }; });
        const expected = live.map(u => ({ owner: u.owner, generation: u.generation }));
        if (!terminal && (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(expected) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(proposal.expected)) {
            proposal.expected = expected;
            changed = true;
        }
        if (changed) {
            proposal.status = 'review';
            this.save(proposal);
        }
        const issues = [];
        try {
            const candidates = this.candidates(proposal);
            (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_7__.assertWorkspaceState)([...candidates.flatMap(u => u.records), ...live.filter(u => !candidates.some(c => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(c.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(u.owner))).flatMap(u => u.records)]);
        }
        catch (e) {
            issues.push(e instanceof Error ? e.message : 'Resolve missing references before activation.');
        }
        const candidates = this.candidates(proposal), known = new Set([...candidates.flatMap(u => u.records), ...live.filter(u => !candidates.some(c => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(c.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(u.owner))).flatMap(u => u.records)].map(r => r.id));
        const missing = candidates.flatMap(u => u.records.flatMap(r => (0,_domain_references__WEBPACK_IMPORTED_MODULE_12__.recordReferences)(r).filter(ref => !known.has(ref.targetId)).map(ref => ({ sourceId: r.id, targetId: ref.targetId, label: ref.label, canRemove: ref.canRemove }))));
        return { proposal, conflicts, issues, missing };
    }
    resolve(id, resolution) { const view = this.view(id); if (view.proposal.status !== 'review')
        throw new Error('Resume a canceled proposal before editing; committed recovery choices cannot be changed.'); const conflict = view.conflicts.find(c => c.id === resolution.recordId); if (!conflict)
        throw new Error('This conflict changed. Review the current proposal.'); if (resolution.liveFingerprint !== conflict.liveFingerprint || resolution.recoveredFingerprint !== conflict.recoveredFingerprint)
        throw new Error('Conflict values changed. Review them again.'); if (resolution.choice === 'combined' && (!resolution.record || !(0,_domain_workspace__WEBPACK_IMPORTED_MODULE_7__.validateWorkspaceRecord)(resolution.record) || resolution.record.id !== resolution.recordId))
        throw new Error('The combined record is invalid.'); view.proposal.choices = view.proposal.choices.filter(c => c.recordId !== resolution.recordId); view.proposal.choices.push(resolution); view.proposal.status = 'review'; this.save(view.proposal); return this.view(id); }
    reference(id, sourceId, targetId, action, replacementId) { const p = this.get(id); if (p.status !== 'review')
        throw new Error('Resume a canceled proposal before editing; committed recovery choices cannot be changed.'); const manifest = this.manifest(p), historical = this.revisions.resolve(manifest).flatMap(u => u.records), live = this.live().flatMap(u => u.records), source = this.candidates(p).flatMap(u => u.records).find(r => r.id === sourceId), ref = source && (0,_domain_references__WEBPACK_IMPORTED_MODULE_12__.recordReferences)(source).find(r => r.targetId === targetId); if (!source || !ref)
        throw new Error('The missing reference changed. Review the proposal.'); if (action === 'restore') {
        if (!historical.some(r => r.id === targetId))
            throw new Error('This backup has no matching dependency to restore.');
        if (p.scope && !p.scope.includes(targetId))
            p.scope.push(targetId);
    }
    else {
        if (action === 'remove' && !ref.canRemove)
            throw new Error('This required reference needs restoration or a replacement.');
        if (action === 'replacement' && (!replacementId || !live.some(r => r.id === replacementId)))
            throw new Error('Choose an existing replacement record.');
        const record = ref.replace(source, action === 'remove' ? null : replacementId);
        p.choices = p.choices.filter(c => c.recordId !== sourceId);
        p.choices.push({ recordId: sourceId, liveFingerprint: contextualFingerprint(live.find(r => r.id === sourceId), live), recoveredFingerprint: contextualFingerprint(historical.find(r => r.id === sourceId), historical), choice: 'combined', record, manuscript: this.candidates(p).find(u => u.manuscripts[sourceId] !== undefined)?.manuscripts[sourceId] ?? null });
    } this.save(p); return this.view(id); }
    candidates(p) {
        const live = this.live(), recovered = this.revisions.resolve(this.manifest(p));
        const candidates = recovered.map(unit => {
            const current = live.find(u => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(u.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(unit.owner));
            if (p.scope && !current)
                throw new Error('An item restore needs its active owning authority.');
            const result = structuredClone(p.scope ? current : unit);
            if (!current)
                return result;
            const incoming = p.scope ? unit.records.filter(r => p.scope.includes(r.id)) : unit.records;
            const map = new Map((p.scope ? current.records : []).map(r => [r.id, r]));
            for (const r of incoming) {
                const c = p.choices.find(c => c.recordId === r.id), liveRecord = current.records.find(c => c.id === r.id);
                const chosen = c?.choice === 'keep-live' ? liveRecord : c?.choice === 'combined' ? c.record : r;
                if (chosen)
                    map.set(chosen.id, structuredClone(chosen));
                if (chosen?.recordType === 'chapter') {
                    const text = c?.choice === 'keep-live' ? current.manuscripts[r.id] : c?.choice === 'combined' ? c.manuscript : unit.manuscripts[r.id];
                    if (text === null || text === undefined)
                        throw new Error('A restored chapter needs matched manuscript text.');
                    result.manuscripts[r.id] = text;
                }
            }
            // Universe conflicts include live-only records, which are preserved unless an explicit candidate removes a reference.
            if (unit.owner.kind === 'universe')
                for (const r of current.records)
                    if (!map.has(r.id))
                        map.set(r.id, r);
            result.records = [...map.values()];
            result.manuscripts = Object.fromEntries(result.records.filter(r => r.recordType === 'chapter').map(r => [r.id, result.manuscripts[r.id]]));
            result.rootId = current.rootId;
            return result;
        }).filter(u => !p.scope || u.records.some(r => p.scope.includes(r.id)));
        return this.calendarCandidates(candidates, live, recovered, p);
    }
    calendarCandidates(candidates, live, historical, proposal) {
        let universe = candidates.find(u => u.owner.kind === 'universe'), currentUniverse = live.find(u => u.owner.kind === 'universe');
        const historicalCalendar = historical.flatMap(u => u.records).find((r) => r.recordType === 'calendar');
        if (!universe && currentUniverse) {
            universe = structuredClone(currentUniverse);
        }
        const calendar = universe?.records.find((r) => r.recordType === 'calendar');
        if (calendar && historicalCalendar) {
            const versions = [...calendar.data.versions];
            for (const version of historicalCalendar.data.versions) {
                const existing = versions.find(v => v.id === version.id);
                if (existing && (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(existing) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(version))
                    throw new Error('A calendar configuration identity has conflicting content. Choose the matching authority before restoring.');
                if (!existing)
                    versions.push(version);
            }
            const liveCalendar = currentUniverse?.records.find((r) => r.recordType === 'calendar');
            for (const v of liveCalendar?.data.versions ?? [])
                if (!versions.some(c => c.id === v.id))
                    versions.push(v);
            if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(versions) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(calendar.data.versions)) {
                calendar.data = { ...calendar.data, versions };
                calendar.recordVersion = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)();
                if (!candidates.some(u => u.owner.kind === 'universe'))
                    candidates.push(universe);
            }
        }
        for (const unit of candidates) {
            unit.records = unit.records.map(original => { let r = structuredClone(original); const selected = !proposal.scope || proposal.scope.includes(r.id); if (!selected)
                return r; const dates = r.recordType === 'chapter' ? [r.data.start, r.data.end] : r.recordType === 'event' || r.recordType === 'decision' || r.recordType === 'plot' || r.recordType === 'affiliation' ? [r.data.date] : r.recordType === 'character' ? [historical.flatMap(u => u.records).find(e => e.id === (r.recordType === 'character' ? r.data.birthEventId : null) && e.recordType === 'event')].flatMap(e => e?.recordType === 'event' ? [e.data.date] : []) : []; const flag = !!calendar && dates.some(date => date && date.calendarVersion !== calendar.data.currentVersion); let changed = proposal.choices.some(c => c.recordId === r.id && c.choice === 'combined'); if (flag && ['chapter', 'event', 'decision', 'plot', 'affiliation', 'character'].includes(r.recordType) && !('calendarUpdateRequired' in r.data && r.data.calendarUpdateRequired)) {
                r = { ...r, data: { ...r.data, calendarUpdateRequired: true } };
                changed = true;
            } if (changed)
                r.recordVersion = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)(); if (r.recordType === 'chapter') {
                const text = unit.manuscripts[r.id];
                r.data.formatting = { ...r.data.formatting, recordVersion: r.recordVersion, text: { ...r.data.formatting.text, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.hash)(text), byteLength: Buffer.byteLength(text).toString(), scalarLength: Array.from(text).length.toString() } };
            } return r; });
        }
        return candidates;
    }
    resume(id) { const p = this.get(id); if (p.status === 'canceled') {
        p.status = 'review';
        this.save(p);
    } return this.view(id); }
    cancel(id) { const p = this.get(id); if (p.status === 'applied' || p.status === 'backup-required')
        throw new Error('This recovery is already committed. Complete its required reconciled backup.'); p.status = 'canceled'; this.save(p); return this.view(id); }
    apply(id, protectiveOwner, beforeRestore = () => { }, captureId) {
        let p = this.get(id);
        const attemptPath = `protection/proposals/${id}.attempt.json`;
        if (p.status === 'applied')
            throw new Error('This recovery has already been applied.');
        if (p.status === 'canceled')
            throw new Error('Resume and review the canceled recovery proposal before applying it.');
        if (p.status === 'backup-required') {
            beforeRestore();
            return { manifest: this.revisions.capture(p.owner, 'Recovered', captureId), needsActivation: false, units: this.live() };
        }
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, attemptPath))) {
            const attempt = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.readManaged)(this.userData, attemptPath));
            if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_13__.closed)(attempt, ['schemaVersion', 'operationId', 'expected', 'candidates']) || attempt.schemaVersion !== 1 || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_13__.isUuid)(attempt.operationId) || attempt.operationId !== p.operationId || !Array.isArray(attempt.expected) || !attempt.expected.every(e => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_13__.closed)(e, ['owner', 'generation']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validOwner)(e.owner) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_14__.unsignedInteger)(e.generation)) || !Array.isArray(attempt.candidates) || !attempt.candidates.every(c => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_13__.closed)(c, ['snapshot', 'assets']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validWorkspaceUnit)(c.snapshot) && Array.isArray(c.assets) && c.assets.every(_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validAssetData)))
                throw new Error('The frozen restore attempt is invalid. Preserve all recovery evidence.');
            const receipt = this.workspace.reconcile(attempt.operationId);
            if (receipt) {
                beforeRestore();
                p.status = 'backup-required';
                this.save(p);
                return { manifest: this.revisions.capture(p.owner, 'Recovered', captureId), needsActivation: false, units: this.live() };
            }
            if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(attempt.expected) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(this.live().map(u => ({ owner: u.owner, generation: u.generation })))) {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, attemptPath), node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.userData, attemptPath + '.noncommit-' + (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()));
                p.operationId = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)();
                p.replacedRevisionId = null;
                this.save(p);
                this.view(id);
                throw new Error('Live work changed after the previous attempt was confirmed not committed. Review affected choices and confirm again.');
            }
            beforeRestore();
            this.workspace.restore(attempt.operationId, attempt.expected, attempt.candidates);
            p.status = 'backup-required';
            this.save(p);
            return { manifest: this.revisions.capture(p.owner, 'Recovered', captureId), needsActivation: false, units: this.live() };
        }
        const expectedBefore = (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(p.expected), view = this.view(id);
        p = view.proposal;
        if (expectedBefore !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.canonical)(p.expected))
            throw new Error('Live authority changed. Review affected choices before confirming again.');
        if (view.conflicts.some(c => !c.resolved) || view.issues.length)
            throw new Error('Resolve all conflicts and missing references before applying recovery.');
        const units = this.candidates(p), live = this.live();
        if (!live.some(u => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(u.owner) === (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(p.owner)))
            return { manifest: this.manifest(p), needsActivation: true, units };
        const protective = this.revisions.capture(protectiveOwner ?? p.owner, 'Replaced');
        p.replacedRevisionId = protective.id;
        this.save(p);
        const manifest = this.manifest(p), assets = manifest.units.flatMap(u => u.snapshot.assets.map(asset => { const file = u.files.find(f => f.relativePath.startsWith('images/' + asset.id + '.')); if (!file)
            throw new Error('Recovered image closure is missing.'); return { ...asset, base64: this.revisions.object(manifest.owner, file.object).toString('base64') }; }));
        const candidates = units.map(snapshot => ({ snapshot, assets: assets.filter(() => snapshot.owner.kind === 'universe') }));
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.publishManagedBytes)(this.userData, attemptPath, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_9__.jsonBytes)({ schemaVersion: 1, operationId: p.operationId, expected: p.expected, candidates })), null);
        beforeRestore();
        this.workspace.restore(p.operationId, p.expected, candidates);
        p.status = 'backup-required';
        this.save(p);
        return { manifest: this.revisions.capture(p.owner, 'Recovered', captureId), needsActivation: false, units };
    }
    bindStaged(id, owner, generation) { const p = this.get(id); p.expected = [...p.expected.filter(e => (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(e.owner) !== (0,_revisions__WEBPACK_IMPORTED_MODULE_8__.ownerKey)(owner)), { owner, generation }].sort((a, b) => a.owner.kind.localeCompare(b.owner.kind)); this.save(p); }
    markBackupRequired(id) { const p = this.get(id); if (p.status === 'canceled')
        throw new Error('The recovery proposal was canceled. Preserve its activation evidence.'); if (p.status === 'review') {
        p.status = 'backup-required';
        this.save(p);
    } }
    markApplied(id) { const p = this.get(id); p.status = 'applied'; this.save(p); }
}


/***/ },

/***/ "./src/infrastructure/revisions.ts"
/*!*****************************************!*\
  !*** ./src/infrastructure/revisions.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RevisionStorage: () => (/* binding */ RevisionStorage),
/* harmony export */   ownerKey: () => (/* binding */ ownerKey),
/* harmony export */   safeRelative: () => (/* binding */ safeRelative),
/* harmony export */   validRevision: () => (/* binding */ validRevision)
/* harmony export */ });
/* harmony import */ var _captured_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./captured-state */ "./src/infrastructure/captured-state.ts");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _domain_capture_time__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../domain/capture-time */ "./src/domain/capture-time.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");








const ownerKey = (o) => `${o.kind}/${o.id}`;
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
function safeRelative(p) { return typeof p === 'string' && p.length > 0 && !p.startsWith('/') && !p.split('/').some(s => !s || s === '.' || s === '..' || /[\\\0:\x00-\x1f]/.test(s) || /[. ]$/.test(s) || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s)); }
const validRevision = _application_contracts_protection__WEBPACK_IMPORTED_MODULE_5__.validRevisionManifest;
/** Complete manifests point to immutable saved bytes, never to current-file replay. */
class RevisionStorage {
    workspace;
    rootFor;
    constructor(workspace, rootFor) {
        this.workspace = workspace;
        this.rootFor = rootFor;
    }
    base(owner) { const root = this.rootFor(owner); (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.ensureManagedDirectory)(root, 'history/protection/manifests'); (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.ensureManagedDirectory)(root, 'history/protection/objects'); return root; }
    list(owner) { const root = this.base(owner); return node_fs__WEBPACK_IMPORTED_MODULE_1___default().readdirSync(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, 'history/protection/manifests')).map(name => { if (!/^[a-f0-9-]{36}\.json$/.test(name))
        throw new Error('Unrecognized retained revision evidence.'); const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.readManaged)(root, `history/protection/manifests/${name}`)); if (!validRevision(value) || ownerKey(value.owner) !== ownerKey(owner))
        throw new Error('Invalid retained revision manifest.'); return value; }).sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt)); }
    get(owner, id) { if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_6__.isUuid)(id))
        throw new Error('Invalid revision identity.'); const v = (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.readManaged)(this.base(owner), `history/protection/manifests/${id}.json`)); if (!validRevision(v) || ownerKey(v.owner) !== ownerKey(owner))
        throw new Error('Invalid complete revision.'); this.validate(v); return v; }
    object(owner, ref) { const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.readManaged)(this.base(owner), `history/protection/objects/${ref.sha256}`); if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.hash)(bytes) !== ref.sha256 || bytes.length.toString() !== ref.byteLength)
        throw new Error('Immutable revision payload is missing or corrupt.'); return bytes; }
    putObject(owner, bytes) { const root = this.base(owner), ref = { sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.hash)(bytes), byteLength: bytes.length.toString() }, relative = `history/protection/objects/${ref.sha256}`; if (node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)))
        this.object(owner, ref);
    else
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.publishManagedBytes)(root, relative, bytes, null); return ref; }
    capture(owner, reason, id = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()) {
        if (node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(this.base(owner), `history/protection/manifests/${id}.json`)))
            return this.get(owner, id);
        // This synchronous pin occurs within the utility authority's one serialized event.
        const time = (0,_domain_capture_time__WEBPACK_IMPORTED_MODULE_4__.captureTime)(), capturedAt = time.utc, before = this.workspace.snapshot(), primary = owner.kind === 'project' ? before.project : before.universe;
        if (!primary || ownerKey(primary.owner) !== ownerKey(owner))
            throw new Error('Open the owning unit before capturing.');
        const captures = [this.workspace.capture(owner)];
        if (owner.kind === 'project') {
            if (!before.universe)
                throw new Error('The matching universe authority is required.');
            captures.push(this.workspace.capture(before.universe.owner));
        }
        const units = captures.map(c => ({ snapshot: (() => { const { records, manuscripts: _manuscripts, ...identity } = c.snapshot; return { ...identity, recordIds: records.map(r => r.id) }; })(), files: c.files.map(f => { const bytes = Buffer.from(f.base64, 'base64'); if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.hash)(bytes) !== f.sha256)
                throw new Error('Capture payload hash mismatch.'); return { relativePath: f.relativePath, object: this.putObject(owner, bytes) }; }) }));
        if ((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.canonical)(before) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.canonical)(this.workspace.snapshot()))
            throw new Error('The saved generation changed during capture.');
        const manifest = { schemaVersion: 1, kind: 'complete-revision', id, owner, reason, capturedAt, completedAt: new Date().toISOString(), localCaptureStart: time.local, offsetMinutes: time.offsetMinutes, timeZone: time.zone, displayName: owner.kind === 'project' ? node_path__WEBPACK_IMPORTED_MODULE_2___default().basename(this.rootFor(owner)) : this.workspace.displayName(owner), universeDisplayName: this.workspace.displayName({ kind: 'universe', id: primary.universeId }), units, retainedRevisionIds: [] };
        this.validate(manifest);
        this.import(manifest);
        return manifest;
    }
    assertImportable(manifest) { const root = this.base(manifest.owner), relative = `history/protection/manifests/${manifest.id}.json`; if (node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)) && !(0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.readManaged)(root, relative).equals(Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.jsonBytes)(manifest))))
        throw new Error('Revision identity/content conflict.'); }
    import(manifest) { if (!validRevision(manifest))
        throw new Error('Unsupported revision schema.'); this.validate(manifest); this.assertImportable(manifest); const root = this.base(manifest.owner), relative = `history/protection/manifests/${manifest.id}.json`; if (!node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)))
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.publishManagedBytes)(root, relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.jsonBytes)(manifest)), null); }
    resolve(manifest, object = (owner, ref) => this.object(owner, ref)) { return (0,_captured_state__WEBPACK_IMPORTED_MODULE_0__.resolveCapturedState)(manifest, object); }
    validate(manifest, object = (owner, ref) => this.object(owner, ref)) { if (!validRevision(manifest))
        throw new Error('Invalid revision schema.'); (0,_captured_state__WEBPACK_IMPORTED_MODULE_0__.validateCapturedState)(manifest, object); }
    remove(owner, id, protectedIds, retentionDays, manual = false) { const m = this.get(owner, id); if (protectedIds.has(id))
        throw new Error('A retained capture or archive references this revision.'); if (!manual && BigInt(Date.now() - Date.parse(m.capturedAt)) < BigInt(retentionDays) * 86400000n)
        return; const relative = `history/protection/manifests/${id}.json`, root = this.base(owner); (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.removeManagedBytes)(root, relative, (0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_7__.readManaged)(root, relative))); /* Objects remain until all known archive/reference evidence is available. */ }
}


/***/ },

/***/ "./src/infrastructure/settings-storage.ts"
/*!************************************************!*\
  !*** ./src/infrastructure/settings-storage.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SETTINGS_ID: () => (/* reexport safe */ _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.SETTINGS_ID),
/* harmony export */   SettingsStorage: () => (/* binding */ SettingsStorage),
/* harmony export */   defaultSettings: () => (/* binding */ defaultSettings),
/* harmony export */   validAppSettings: () => (/* reexport safe */ _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");







const fields = ['schemaVersion', 'id', 'recordVersion', 'autosaveMinutes', 'revisionMinutes', 'backupMinutes', 'retentionDays', 'backupDestination', 'theme', 'fontFamily', 'fontSize', 'panels'];
const defaultSettings = () => ({ schemaVersion: 1, id: _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.SETTINGS_ID, recordVersion: (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)(), autosaveMinutes: '5', revisionMinutes: '10', backupMinutes: '10', retentionDays: '30', backupDestination: null, theme: 'dark', fontFamily: 'system-ui, sans-serif', fontSize: '16', panels: [] });
class SettingsStorage {
    userData;
    gate;
    relative = `settings/${_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.SETTINGS_ID}.json`;
    constructor(userData, gate = fn => fn()) {
        this.userData = userData;
        this.gate = gate;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.ensureManagedDirectory)(userData, 'settings');
        this.gate(() => { if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(userData, this.relative)))
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.publishManagedBytes)(userData, this.relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.jsonBytes)(defaultSettings())), null); });
    }
    get() { const v = (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.readManaged)(this.userData, this.relative)); if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)(v))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('UNSUPPORTED_VERSION', 'The app settings are invalid or use an unsupported schema.'); return v; }
    save(values, expectedVersion) { return this.gate(() => this.saveLocked(values, expectedVersion)); }
    saveLocked(values, expectedVersion) { if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)(values))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('VALIDATION', 'Settings contain invalid fields or intervals.'); const before = (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.readManaged)(this.userData, this.relative), current = this.get(); if (current.recordVersion !== expectedVersion)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('GENERATION_CONFLICT', 'Settings changed. Reopen the form before saving.'); const next = { ...values, recordVersion: (0,node_crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)() }; try {
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.publishManagedBytes)(this.userData, this.relative, Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.jsonBytes)(next)), (0,_universe_files__WEBPACK_IMPORTED_MODULE_5__.hash)(before));
        return next;
    }
    catch {
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('RECOVERY_REQUIRED', 'Settings publication could not be confirmed. Read settings again before retrying.', 'unknown');
    } }
    import(value) { if (typeof value !== 'object' || !value || Array.isArray(value))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('VALIDATION', 'Settings import requires a JSON object.'); const supplied = value, current = this.get(), next = { ...current }; const warnings = Object.keys(supplied).filter(k => !fields.includes(k)).map(k => `Ignored unknown settings field: ${k}`); for (const k of fields)
        if (Object.hasOwn(supplied, k))
            next[k] = supplied[k]; if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_3__.validAppSettings)(next))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_4__.UniverseFailure('VALIDATION', 'A known settings field is invalid. No imported values were applied.'); return { settings: this.save({ ...next, recordVersion: current.recordVersion }, current.recordVersion), warnings }; }
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
/* harmony export */   ensureManagedDirectory: () => (/* binding */ ensureManagedDirectory),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   hashFile: () => (/* binding */ hashFile),
/* harmony export */   jsonBytes: () => (/* binding */ jsonBytes),
/* harmony export */   preserveMarker: () => (/* binding */ preserveMarker),
/* harmony export */   publishManagedBytes: () => (/* binding */ publishManagedBytes),
/* harmony export */   publishManagedFile: () => (/* binding */ publishManagedFile),
/* harmony export */   publishMarker: () => (/* binding */ publishMarker),
/* harmony export */   readManaged: () => (/* binding */ readManaged),
/* harmony export */   removeManagedBytes: () => (/* binding */ removeManagedBytes),
/* harmony export */   replaceManaged: () => (/* binding */ replaceManaged),
/* harmony export */   syncDir: () => (/* binding */ syncDir),
/* harmony export */   writeExclusive: () => (/* binding */ writeExclusive)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _confined_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./confined-fs */ "./src/infrastructure/confined-fs.ts");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);




const hash = (bytes) => (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256').update(bytes).digest('hex');
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
        for (const segment of node_path__WEBPACK_IMPORTED_MODULE_2___default().resolve(p).split('/').filter(Boolean)) {
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
    const fd = directoryHandle(node_path__WEBPACK_IMPORTED_MODULE_2___default().dirname(p));
    return { fd, file: `/proc/self/fd/${fd}/${node_path__WEBPACK_IMPORTED_MODULE_2___default().basename(p)}` };
}
function regular(fd) {
    const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1)
        throw new Error('Aliased or invalid managed file');
    return stat;
}
function syncDir(p) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.syncDir(p);
    const fd = directoryHandle(p);
    try {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}
function writeExclusive(p, data, reserved) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.writeExclusive(p, data, reserved);
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
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishMarker(root, relative, data, staged);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    const temporary = `/proc/self/fd/${parent.fd}/.marker-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
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
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.preserveMarker(root, relative);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            regular(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(parent.file, parent.file + '.damaged-' + (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)());
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function checked(root, relative, directory = false) {
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || node_path__WEBPACK_IMPORTED_MODULE_2___default().isAbsolute(relative))
        throw new Error('Unsafe managed path');
    let p = root;
    for (let i = 0; i < segments.length; i++) {
        p = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(p, segments[i]);
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(p);
        const dir = i < segments.length - 1 || directory;
        if (stat.isSymbolicLink() || (dir ? !stat.isDirectory() : (!stat.isFile() || stat.nlink !== 1)))
            throw new Error('Aliased or invalid managed path');
    }
    return p;
}
function readManaged(root, relative) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.readManaged(root, relative);
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
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.replaceManaged(root, relative, data);
    const target = checked(root, relative);
    const parent = anchored(target);
    const temporary = `/proc/self/fd/${parent.fd}/.publish-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
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
/** Managed binary publication shares the anchored, durable primitive used by WRT/JSON. */
function ensureManagedDirectory(root, relative) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.ensureManagedDirectory(root, relative);
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)))
        throw new Error('Unsafe managed directory');
    let fd = directoryHandle(root);
    try {
        for (const segment of segments) {
            const p = `/proc/self/fd/${fd}/${segment}`;
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(p, { mode: 0o700 });
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
            }
            catch (e) {
                if (e.code !== 'EEXIST')
                    throw e;
            }
            const next = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(p, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_DIRECTORY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            fd = next;
        }
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
    }
}
function publishManagedBytes(root, relative, data, expectedHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishManagedBytes(root, relative, data, expectedHash);
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || node_path__WEBPACK_IMPORTED_MODULE_2___default().isAbsolute(relative))
        throw new Error('Unsafe managed path');
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)), temporary = `/proc/self/fd/${parent.fd}/.workspace-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    try {
        let previous;
        try {
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                previous = regular(fd);
                if (expectedHash === null || hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                    throw new Error('Unexpected managed bytes');
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
        }
        catch (e) {
            if (e.code !== 'ENOENT' || expectedHash !== null)
                throw e;
        }
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(fd, data);
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        if (previous) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            if (current.ino !== previous.ino || current.dev !== previous.dev || current.nlink !== 1 || !current.isFile())
                throw new Error('Managed target changed');
        }
        else {
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
                throw new Error('Managed target appeared');
            }
            catch (e) {
                if (e.code !== 'ENOENT')
                    throw e;
            }
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function removeManagedBytes(root, relative, expectedHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.removeManagedBytes(root, relative, expectedHash);
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative));
    try {
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        try {
            regular(fd);
            if (hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                throw new Error('Unexpected removal target');
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().unlinkSync(parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
/** Stream a verified private artifact through the same anchored destination publication protocol. */
function publishManagedFile(root, relative, source, expectedHash, expectedSourceHash) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.publishManagedFile(root, relative, source, expectedHash, expectedSourceHash);
    if (relative.includes('/') || !relative || /[\\\0:]/.test(relative) || relative === '.' || relative === '..')
        throw new Error('Unsafe output filename');
    const parent = anchored(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(root, relative)), temporary = `/proc/self/fd/${parent.fd}/.output-${(0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)()}`;
    let sourceFd, targetFd;
    try {
        let before;
        try {
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(parent.file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                before = regular(fd);
                if (expectedHash === null || hash(node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(fd)) !== expectedHash)
                    throw new Error('Output changed since Save As.');
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
        }
        catch (e) {
            if (e.code !== 'ENOENT' || expectedHash !== null)
                throw e;
        }
        sourceFd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(source, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
        regular(sourceFd);
        targetFd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(temporary, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_WRONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_CREAT | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_EXCL | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW, 0o600);
        const digest = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256'), buffer = Buffer.alloc(262144);
        let count;
        while ((count = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(sourceFd, buffer)) > 0) {
            const bytes = buffer.subarray(0, count);
            digest.update(bytes);
            let offset = 0;
            while (offset < count)
                offset += node_fs__WEBPACK_IMPORTED_MODULE_0___default().writeSync(targetFd, bytes, offset, count - offset);
        }
        if (digest.digest('hex') !== expectedSourceHash)
            throw new Error('Validated private output changed before publication.');
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(targetFd);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(targetFd);
        targetFd = undefined;
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
        if (before) {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
            if (stat.ino !== before.ino || stat.dev !== before.dev || !stat.isFile() || stat.nlink !== 1)
                throw new Error('Output identity changed.');
        }
        else {
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(parent.file);
                throw new Error('Output appeared after Save As.');
            }
            catch (e) {
                if (e.code !== 'ENOENT')
                    throw e;
            }
        }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().renameSync(temporary, parent.file);
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(parent.fd);
    }
    finally {
        if (sourceFd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(sourceFd);
        if (targetFd !== undefined)
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(targetFd);
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().unlinkSync(temporary);
        }
        catch { }
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(parent.fd);
    }
}
function hashFile(file) {
    if (process.platform !== 'linux')
        return _confined_fs__WEBPACK_IMPORTED_MODULE_1__.confinedFs.hashFile(file);
    const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(file, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
    try {
        regular(fd);
        const digest = (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)('sha256'), bytes = Buffer.alloc(262144);
        let n;
        while ((n = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readSync(fd, bytes)) > 0)
            digest.update(bytes.subarray(0, n));
        return digest.digest('hex');
    }
    finally {
        node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
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
/* harmony export */   FileUniverseStorage: () => (/* binding */ FileUniverseStorage),
/* harmony export */   connect: () => (/* binding */ connect),
/* harmony export */   transaction: () => (/* binding */ transaction)
/* harmony export */ });
/* harmony import */ var _workspace_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./workspace-storage */ "./src/infrastructure/workspace-storage.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _domain_universe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../domain/universe */ "./src/domain/universe.ts");
/* harmony import */ var _universe_ddl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./universe-ddl */ "./src/infrastructure/universe-ddl.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");











const requireValid = (condition, message = 'Universe integrity validation failed.') => {
    if (!condition)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('INTEGRITY_MISMATCH', message);
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
function supported(db, applicationId = 1465140300) {
    if (db.prepare('PRAGMA user_version').get()?.user_version !== 1 || db.prepare('PRAGMA application_id').get()?.application_id !== applicationId)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe database version is unsupported.');
    requireValid(db.prepare('PRAGMA quick_check').get()?.quick_check === 'ok', 'The universe database is corrupt.');
}
function connect(p, create = false, applicationId = 1465140300) {
    if (!create) {
        // Read format/version from the fixed SQLite header before a writable
        // connection can recover a hot journal. A read-only SQL probe itself
        // cannot recover SQLite after a process dies mid-transaction.
        const fd = node_fs__WEBPACK_IMPORTED_MODULE_2___default().openSync(p, (node_fs__WEBPACK_IMPORTED_MODULE_2___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_2___default().constants).O_NOFOLLOW);
        const header = Buffer.alloc(100);
        try {
            requireValid(node_fs__WEBPACK_IMPORTED_MODULE_2___default().readSync(fd, header, 0, 100, 0) === 100 && header.subarray(0, 16).toString('ascii') === 'SQLite format 3\0', 'The SQLite header is invalid.');
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_2___default().closeSync(fd);
        }
        if (header.readUInt32BE(60) !== 1 || header.readUInt32BE(68) !== applicationId || header[18] !== 1 || header[19] !== 1)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe database format is unsupported.');
        // SQLite owns only the derived rollback sidecar. Never follow a linked
        // journal or interpret a foreign WAL as this rollback-only format.
        for (const suffix of ['-journal', '-wal', '-shm']) {
            const sidecar = p + suffix;
            let stat;
            try {
                stat = node_fs__WEBPACK_IMPORTED_MODULE_2___default().lstatSync(sidecar);
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
    const db = new node_sqlite__WEBPACK_IMPORTED_MODULE_5__.DatabaseSync(p);
    try {
        configure(db);
        if (!create)
            supported(db, applicationId);
        return db;
    }
    catch (e) {
        db.close();
        throw e;
    }
}
function descriptor(root) {
    const d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, 'writingtool.json'));
    if (typeof d === 'object' && d !== null && 'schemaVersion' in d && d.schemaVersion !== 1)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('UNSUPPORTED_VERSION', 'This universe descriptor version is unsupported.');
    requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.closed)(d, ['schemaVersion', 'kind', 'id', 'rootId', 'creationOperationId']) && d.schemaVersion === 1 && d.kind === 'universe' && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.id) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.rootId) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(d.creationOperationId));
    return d;
}
function validateExpectedDescriptor(d, expected) {
    const identity = expected.identity;
    const matches = 'ownerId' in identity ? d.id === identity.ownerId && d.rootId === identity.rootId : d.creationOperationId === identity.creationOperationId;
    if (!matches)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('INTEGRITY_MISMATCH', 'Select the owning universe of the original pending operation.', 'unknown');
}
const saveDigest = (input) => (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)({ protocolVersion: 1, command: 'universe.profile.save', owner: { kind: 'universe', id: input.ownerId }, expectedUnitGeneration: input.expectedUnitGeneration, expectedRecordVersions: { [input.ownerId]: input.expectedRecordVersion }, submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
const createDigest = (input) => (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)({ protocolVersion: 1, command: 'universe.create', submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
function receipt(operationId, id, generation, version, revision) {
    return { protocolVersion: 1, operationId, owner: { kind: 'universe', id }, unitGeneration: generation, recordId: id, recordVersion: version, submittedEditorRevision: revision };
}
function storeReceipt(db, r, digest) {
    const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(r);
    db.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(r.operationId, digest, r.unitGeneration, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(bytes), bytes);
}
function validRecord(v) {
    return (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.closed)(v, ['id', 'rootId', 'recordType', 'relativePath', 'recordVersion', 'sha256']) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(v.id) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(v.rootId) && v.recordType === 'universe-profile' && v.relativePath === `profiles/${v.id}.json` && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(v.recordVersion) && typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256);
}
class FileUniverseStorage {
    fault;
    coordinator;
    constructor(fault, coordinator) {
        this.fault = fault;
        this.coordinator = coordinator;
    }
    identity(basePath) {
        const d = descriptor(this.physicalPath(basePath));
        return { ownerId: d.id, rootId: d.rootId };
    }
    physicalPath(basePath) {
        const root = node_fs__WEBPACK_IMPORTED_MODULE_2___default().realpathSync(basePath);
        requireValid(node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(root).isDirectory(), 'Select an existing directory.');
        return root;
    }
    create(basePath, input) {
        let data;
        try {
            data = (0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.profileData)(input.data);
        }
        catch (e) {
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', String(e.message));
        }
        let root;
        try {
            root = this.physicalPath(basePath);
            if (node_fs__WEBPACK_IMPORTED_MODULE_2___default().readdirSync(root).length)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', 'Choose an empty folder. Existing content was preserved.');
        }
        catch (error) {
            if (error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw error;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('IO_FAILURE', 'The folder could not be inspected before creation. No creation was started.', 'not-committed');
        }
        const id = (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)(), rootId = (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)(), version = (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)(), digest = createDigest(input);
        const envelope = { schemaVersion: 1, recordType: 'universe-profile', id, owner: { kind: 'universe', id }, universeId: id, recordVersion: version, data };
        const d = { schemaVersion: 1, kind: 'universe', id, rootId, creationOperationId: input.operationId };
        let db, lease, store;
        let reserved = false;
        try {
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, '.writingtool-creation.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)({ schemaVersion: 1, operationId: input.operationId, ownerId: id, rootId, requestDigest: digest, profile: envelope }), () => {
                reserved = true;
            });
            this.fault?.('creation-reserved');
            for (const p of ['database', 'profiles', 'images', 'database/operations']) {
                node_fs__WEBPACK_IMPORTED_MODULE_2___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, p), { mode: 0o700 });
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_3___default().dirname(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, p)));
            }
            for (const p of ['database/catalog.sqlite', 'database/lease.sqlite'])
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, p), '');
            lease = connect(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, 'database/lease.sqlite'), true);
            lease.exec(_universe_ddl__WEBPACK_IMPORTED_MODULE_9__.LEASE_DDL);
            lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(id, rootId);
            lease.exec('BEGIN EXCLUSIVE');
            db = connect(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, 'database/catalog.sqlite'), true);
            db.exec(_universe_ddl__WEBPACK_IMPORTED_MODULE_9__.CATALOG_DDL);
            const session = (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)();
            transaction(db, () => {
                db.prepare('INSERT INTO unit_meta VALUES(1,1,?,?,?,?,?,?,?)').run(id, rootId, '0', session, input.operationId, digest, 'preparing');
                db.prepare('INSERT INTO root_locations VALUES(?,?,?,?,?)').run(rootId, 'universe', id, root, (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)());
            });
            this.fault?.('creation-schema');
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)(envelope);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, `profiles/${id}.json`), bytes);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, 'writingtool.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)(d));
            this.fault?.('creation-files');
            const r = receipt(input.operationId, id, '1', version, input.submittedEditorRevision);
            transaction(db, () => {
                db.prepare('INSERT INTO records VALUES(?,?,?,?,?,?)').run(id, rootId, 'universe-profile', `profiles/${id}.json`, version, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(bytes));
                db.prepare("UPDATE unit_meta SET generation='1',creationState='complete'").run();
                storeReceipt(db, r, digest);
            });
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, 'database'));
            this.fault?.('creation-commit');
            store = new FileUniverseStore(root, db, lease, d, session, this.fault, this.coordinator);
            store.snapshot();
            store.workspace.attach();
            return { store, receipt: r };
        }
        catch (e) {
            store?.workspace.detach();
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (!reserved)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('IO_FAILURE', 'The empty folder could not be reserved. No creation was started; your edits remain unsaved.', 'not-committed');
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure(e.code, e.message, 'unknown');
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Creation could not finish. The selected folder and recovery evidence were preserved.', 'unknown');
        }
    }
    open(basePath, expected) {
        const root = this.physicalPath(basePath);
        let db, lease, store;
        try {
            const d = descriptor(root);
            if (expected)
                validateExpectedDescriptor(d, expected);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'images', true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'profiles', true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/operations', true);
            const leasePath = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/lease.sqlite');
            const catalogPath = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/catalog.sqlite');
            try {
                lease = connect(leasePath);
            }
            catch (e) {
                if (String(e).includes('locked') || String(e).includes('busy'))
                    throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
                throw e;
            }
            try {
                lease.exec('BEGIN EXCLUSIVE');
            }
            catch {
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
            }
            requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.closed)(lease.prepare('SELECT * FROM lease_identity').get(), ['singleton', 'schemaVersion', 'ownerId', 'rootId']) && lease.prepare('SELECT * FROM lease_identity').get()?.ownerId === d.id && lease.prepare('SELECT * FROM lease_identity').get()?.rootId === d.rootId && lease.prepare('SELECT * FROM lease_identity').get()?.schemaVersion === 1);
            db = connect(catalogPath);
            store = new FileUniverseStore(root, db, lease, d, undefined, this.fault, this.coordinator);
            if (expected)
                store.validateExpected(expected);
            store.checkBinding();
            store.workspace.attach();
            store.recover();
            store.snapshot();
            store.rebind();
            store.mintSession();
            return store;
        }
        catch (e) {
            store?.workspace.detach();
            try {
                db?.close();
            }
            finally {
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw e;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The folder is missing, invalid, inaccessible or requires recovery. Its bytes were preserved.', 'unknown');
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
    workspace;
    failed = false;
    released = false;
    databaseClosed = false;
    releaseStarted = false;
    rootIdentity;
    identities;
    constructor(location, db, lease, d, session, fault, coordinator) {
        this.location = location;
        this.db = db;
        this.lease = lease;
        this.d = d;
        this.session = session;
        this.fault = fault;
        this.rootIdentity = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(location);
        this.identities = ['database/catalog.sqlite', 'database/lease.sqlite'].map(relative => ({ relative, ...node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(location, relative)) }));
        this.workspace = new _workspace_storage__WEBPACK_IMPORTED_MODULE_0__.WorkspaceStore(location, db, () => { const m = this.meta(); return { owner: { kind: 'universe', id: m.ownerId }, rootId: m.rootId, universeId: m.ownerId, generation: m.generation, sessionToken: m.sessionToken }; }, () => this.health(), coordinator);
    }
    meta() {
        const m = this.db.prepare('SELECT * FROM unit_meta').get();
        requireValid(m && m.schemaVersion === 1 && m.ownerId === this.d.id && m.rootId === this.d.rootId && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isGeneration)(m.generation) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(m.sessionToken) && m.creationState === 'complete' && m.creationOperationId === this.d.creationOperationId, 'Creation is incomplete or identity is inconsistent.');
        return m;
    }
    record() {
        const rows = this.db.prepare('SELECT * FROM records').all();
        requireValid(rows.length === 1 && validRecord(rows[0]));
        return rows[0];
    }
    health() {
        const physical = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(this.location);
        requireValid(node_fs__WEBPACK_IMPORTED_MODULE_2___default().realpathSync(this.location) === this.location && physical.ino === this.rootIdentity.ino && physical.dev === this.rootIdentity.dev, 'Physical root changed.');
        for (const identity of this.identities) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, identity.relative));
            requireValid(current.ino === identity.ino && current.dev === identity.dev, 'Authority file identity changed.');
        }
        requireValid(this.lease.isTransaction, 'Writer ownership was lost.');
        const i = this.lease.prepare('SELECT * FROM lease_identity').get();
        requireValid(i?.ownerId === this.d.id && i?.rootId === this.d.rootId && i?.schemaVersion === 1);
        const d = descriptor(this.location);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(d) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(this.d), 'Root identity changed.');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, 'database/lease.sqlite');
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, 'database/catalog.sqlite');
        if (this.session)
            requireValid(this.meta().sessionToken === this.session, 'Writer fencing token is stale.');
    }
    mintSession() {
        this.health();
        const token = (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)();
        transaction(this.db, () => {
            this.db.prepare('UPDATE unit_meta SET sessionToken=? WHERE singleton=1').run(token);
        });
        this.session = token;
    }
    snapshot() {
        if (this.released)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Reopen the relocated universe to reacquire its verified authority.', 'unknown');
        if (this.failed)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Reopen this universe to reconcile the interrupted operation.', 'unknown');
        this.health();
        this.workspace.snapshot();
        const m = this.meta(), r = this.record();
        requireValid(r.id === m.ownerId && r.rootId === m.rootId);
        const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, r.relativePath), p = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(bytes);
        requireValid((0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.validEnvelope)(p) && p.id === m.ownerId && p.recordVersion === r.recordVersion && (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(bytes) === r.sha256, 'Profile bytes and catalog do not agree.');
        const creation = this.operation(m.creationOperationId);
        requireValid(creation && creation.requestDigest === m.creationDigest && creation.generation === '1', 'Creation decision is missing.');
        const operations = this.db.prepare('SELECT operationId FROM committed_operations').all().map(row => this.operation(String(row.operationId))).sort((a, b) => BigInt(a.generation) < BigInt(b.generation) ? -1 : 1);
        requireValid(operations.every((op, index) => op.generation === (BigInt(index) + 1n).toString()) && operations.at(-1)?.generation === m.generation, 'The catalog generation has no complete decision history.');
        const profileReceipts = operations.map(op => (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(op.receiptData))).filter(_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.validReceipt);
        requireValid(profileReceipts.at(-1)?.recordVersion === r.recordVersion, 'The current profile version has no matching receipt.');
        return { ownerId: m.ownerId, rootId: m.rootId, generation: m.generation, recordVersion: r.recordVersion, profile: p.data, location: this.location };
    }
    checkBinding() {
        const m = this.meta();
        const rows = this.db.prepare('SELECT * FROM root_locations').all();
        const row = rows[0];
        requireValid(rows.length === 1 && row.rootId === m.rootId && row.ownerKind === 'universe' && row.ownerId === m.ownerId && typeof row.basePath === 'string' && node_path__WEBPACK_IMPORTED_MODULE_3___default().isAbsolute(row.basePath) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(row.bindingVersion));
        if (row.basePath === this.location)
            return;
        let original;
        try {
            original = node_fs__WEBPACK_IMPORTED_MODULE_2___default().realpathSync(String(row.basePath));
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
        if (original && original !== this.location) {
            const stat = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(original);
            if (!stat.isDirectory())
                return; // A regular file cannot be the former owning folder.
            const entries = node_fs__WEBPACK_IMPORTED_MODULE_2___default().readdirSync(original);
            if (!entries.some(name => ['writingtool.json', '.writingtool-creation.json', 'database'].includes(name)))
                return;
            // Missing/corrupt discovery beside authority evidence is uncertain.
            const prior = descriptor(original);
            if (prior.id === this.d.id || prior.rootId === this.d.rootId)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('INTEGRITY_MISMATCH', 'The original universe folder still exists. This copy cannot become a second authority.');
        }
    }
    rebind() {
        this.checkBinding();
        const m = this.meta();
        const row = this.db.prepare('SELECT * FROM root_locations').get();
        if (row.basePath === this.location)
            return;
        transaction(this.db, () => {
            const result = this.db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=? AND bindingVersion=?').run(this.location, (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)(), m.rootId, String(row.bindingVersion));
            requireValid(result.changes === 1);
        });
    }
    operation(id) {
        const row = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(id);
        if (row) {
            requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(row.operationId) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isGeneration)(row.generation) && /^[a-f0-9]{64}$/.test(row.requestDigest));
            const r = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(row.receiptData));
            requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(row.receiptData) === row.resultDigest && ((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.validReceipt)(r) && r.operationId === id && r.owner.id === this.d.id && r.unitGeneration === row.generation || (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_1__.validWorkspaceReceipt)(r) && r.operationId === id && r.units.some(u => u.owner.kind === 'universe' && u.owner.id === this.d.id && u.unitGeneration === row.generation)));
        }
        return row;
    }
    prepareRelocatedReopen(basePath, expected) {
        if (this.released || basePath === this.location)
            return;
        const stat = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(basePath);
        if (stat.ino !== this.rootIdentity.ino || stat.dev !== this.rootIdentity.dev)
            return;
        validateExpectedDescriptor(descriptor(basePath), expected);
        this.validateExpected(expected);
        for (const identity of this.identities) {
            const current = node_fs__WEBPACK_IMPORTED_MODULE_2___default().statSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(basePath, identity.relative));
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
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('OPERATION_CONFLICT', 'The selected unit does not contain the original operation payload.', 'unknown');
    }
    reconcile(operationId, expected) {
        if (expected)
            this.validateExpected(expected);
        this.snapshot();
        const op = this.operation(operationId);
        return op ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(op.receiptData)) : undefined;
    }
    save(input) {
        const digest = saveDigest(input);
        this.snapshot();
        const prior = this.operation(input.operationId);
        if (prior) {
            if (prior.requestDigest !== digest)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('OPERATION_CONFLICT', 'This operation ID was already used for different content.');
            return (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(prior.receiptData));
        }
        let data;
        try {
            data = (0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.profileData)(input.data);
        }
        catch (e) {
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', e.message);
        }
        const m = this.meta(), beforeRecord = this.record();
        if (input.ownerId !== m.ownerId || input.expectedUnitGeneration !== m.generation || input.expectedRecordVersion !== beforeRecord.recordVersion)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('GENERATION_CONFLICT', 'The saved universe changed. Reopen it before saving again.');
        const existingWork = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(this.location, 'database/operations', input.operationId);
        if (node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(existingWork)) {
            const priorJournal = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, `database/operations/${input.operationId}/journal.json`));
            this.validateJournal(priorJournal, input.operationId);
            const j = priorJournal;
            if (j.requestDigest !== digest)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('OPERATION_CONFLICT', 'The operation journal belongs to different content.');
            // A definitively aborted operation can retry its original immutable plan.
            // The new authority adopts only the operational fence; content IDs stay fixed.
            const aborted = `database/operations/${input.operationId}/aborted.json`;
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, aborted);
            requireValid(j.expectedGeneration === m.generation && (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(j.beforeRecord) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(beforeRecord));
            // Do not rewrite journal bytes: the current fence is checked separately on retry.
            node_fs__WEBPACK_IMPORTED_MODULE_2___default().unlinkSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(this.location, aborted));
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.syncDir)(existingWork);
            return this.publishRetry(j);
        }
        const before = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, beforeRecord.relativePath).toString('utf8');
        const envelope = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(before));
        const afterEnvelope = { ...envelope, data, recordVersion: (0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)() };
        const after = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)(afterEnvelope);
        const target = (BigInt(m.generation) + 1n).toString(), r = receipt(input.operationId, m.ownerId, target, afterEnvelope.recordVersion, input.submittedEditorRevision);
        const afterRecord = { ...beforeRecord, recordVersion: afterEnvelope.recordVersion, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(after) };
        const journal = { schemaVersion: 1, scope: 'single-unit', command: 'universe.profile.save', ownerId: m.ownerId, rootId: m.rootId, operationId: input.operationId, request: input, requestDigest: digest, expectedGeneration: m.generation, targetGeneration: target, fencingToken: m.sessionToken, before, after, beforeHash: (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(before), afterHash: (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(after), beforeLength: Buffer.byteLength(before).toString(), afterLength: Buffer.byteLength(after).toString(), expectedRecordVersion: beforeRecord.recordVersion, beforeRecord, afterRecord, receipt: r };
        try {
            this.health();
            const work = node_path__WEBPACK_IMPORTED_MODULE_3___default().join((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, 'database/operations', true), input.operationId);
            node_fs__WEBPACK_IMPORTED_MODULE_2___default().mkdirSync(work, { mode: 0o700 });
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_3___default().dirname(work));
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(work, 'journal.json'), (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)(journal));
            this.fault?.('journal');
            this.expect(journal);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.replaceManaged)(this.location, beforeRecord.relativePath, after);
            this.fault?.('file');
            transaction(this.db, () => {
                this.expect(journal);
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(afterRecord.recordVersion, afterRecord.sha256, m.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(target);
                storeReceipt(this.db, r, digest);
            });
            this.fault?.('commit');
            this.verifyJournalState(journal, true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.publishMarker)(this.location, `database/operations/${input.operationId}/finalized.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)({ schemaVersion: 1, operationId: input.operationId, requestDigest: digest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            this.snapshot();
            return r;
        }
        catch {
            this.failed = true;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Save outcome requires reconciliation. Keep the submitted edits and reopen this universe.', 'unknown');
        }
    }
    publishRetry(j) {
        try {
            this.health();
            const expected = () => {
                this.health();
                requireValid(this.meta().generation === j.expectedGeneration && (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(this.record()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(j.beforeRecord));
            };
            expected();
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.replaceManaged)(this.location, j.beforeRecord.relativePath, j.after);
            this.fault?.('file');
            transaction(this.db, () => {
                expected();
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(j.afterRecord.recordVersion, j.afterRecord.sha256, j.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(j.targetGeneration);
                storeReceipt(this.db, j.receipt, j.requestDigest);
            });
            this.fault?.('commit');
            this.verifyJournalState(j, true);
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.publishMarker)(this.location, `database/operations/${j.operationId}/finalized.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)({ schemaVersion: 1, operationId: j.operationId, requestDigest: j.requestDigest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            return j.receipt;
        }
        catch {
            this.failed = true;
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The retried save needs reconciliation.', 'unknown');
        }
    }
    expect(j) {
        this.health();
        const m = this.meta(), r = this.record();
        if (m.generation !== j.expectedGeneration || m.sessionToken !== j.fencingToken || r.recordVersion !== j.expectedRecordVersion || (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(r) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(j.beforeRecord))
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('GENERATION_CONFLICT', 'The publication expectations changed.');
    }
    verifyJournalState(j, committed) {
        const r = this.record();
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(r) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(committed ? j.afterRecord : j.beforeRecord) && (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, r.relativePath)) === (committed ? j.afterHash : j.beforeHash));
    }
    recover() {
        try {
            this.health();
            this.workspace.recover();
            const m = this.meta();
            for (const opId of node_fs__WEBPACK_IMPORTED_MODULE_2___default().readdirSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, 'database/operations', true)).sort()) {
                requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(opId), 'Unknown operation workspace.');
                const rel = `database/operations/${opId}`;
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(this.location, rel, true);
                const j = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, `${rel}/journal.json`));
                if (typeof j === 'object' && j !== null && 'command' in j && j.command === 'workspace.publish')
                    continue;
                this.validateJournal(j, opId);
                const journal = j;
                const op = this.operation(opId);
                if (op)
                    requireValid(op.requestDigest === journal.requestDigest && op.receiptData === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(journal.receipt), 'Operation evidence conflicts.');
                const markerNames = ['finalized', 'aborted'];
                const validMarkers = new Set();
                for (const name of markerNames) {
                    const markerRel = `${rel}/${name}.json`;
                    if (!node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(this.location, markerRel)))
                        continue;
                    let marker;
                    try {
                        marker = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, markerRel));
                    }
                    catch {
                        ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.preserveMarker)(this.location, markerRel);
                        continue;
                    }
                    if (!(0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.closed)(marker, ['schemaVersion', 'operationId', 'requestDigest'])) {
                        (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.preserveMarker)(this.location, markerRel);
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
                    ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.publishMarker)(this.location, `${rel}/${op ? 'finalized' : 'aborted'}.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }));
                    continue;
                }
                const committed = !!op;
                requireValid(m.generation === (committed ? journal.targetGeneration : journal.expectedGeneration), 'Unexplained publication generation.');
                const liveHash = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(this.location, journal.beforeRecord.relativePath));
                requireValid(liveHash === journal.beforeHash || liveHash === journal.afterHash, 'Unexpected profile bytes were preserved.');
                requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(this.record()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(committed ? journal.afterRecord : journal.beforeRecord));
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.replaceManaged)(this.location, journal.beforeRecord.relativePath, committed ? journal.after : journal.before);
                this.fault?.(committed ? 'redo' : 'undo');
                this.verifyJournalState(journal, committed);
                (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.publishMarker)(this.location, `${rel}/${committed ? 'finalized' : 'aborted'}.json`, (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.jsonBytes)({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }), () => this.fault?.('marker-staged'));
            }
            this.failed = false;
        }
        catch (e) {
            this.failed = true;
            if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure(e.code, e.message, 'unknown');
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'Publication evidence is incomplete or corrupt. The folder was preserved.', 'unknown');
        }
    }
    validateJournal(value, opId) {
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.closed)(value, ['schemaVersion', 'scope', 'command', 'ownerId', 'rootId', 'operationId', 'request', 'requestDigest', 'expectedGeneration', 'targetGeneration', 'fencingToken', 'before', 'after', 'beforeHash', 'afterHash', 'beforeLength', 'afterLength', 'expectedRecordVersion', 'beforeRecord', 'afterRecord', 'receipt']));
        const j = value;
        requireValid(j.schemaVersion === 1 && j.scope === 'single-unit' && j.command === 'universe.profile.save');
        requireValid(j.ownerId === this.d.id && j.rootId === this.d.rootId && j.operationId === opId && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isUuid)(j.fencingToken));
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isGeneration)(j.expectedGeneration) && (0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.isGeneration)(j.targetGeneration));
        requireValid(BigInt(j.targetGeneration) === BigInt(j.expectedGeneration) + 1n);
        requireValid(typeof j.before === 'string' && typeof j.after === 'string');
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.validUniverseRequest)({ protocolVersion: 1, requestId: opId, command: j.command, input: j.request }));
        requireValid(j.request.operationId === opId && j.request.ownerId === j.ownerId);
        requireValid(j.request.expectedUnitGeneration === j.expectedGeneration && j.request.expectedRecordVersion === j.expectedRecordVersion);
        requireValid(saveDigest(j.request) === j.requestDigest);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(j.before) === j.beforeHash && (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)(j.after) === j.afterHash);
        requireValid(Buffer.byteLength(j.before).toString() === j.beforeLength && Buffer.byteLength(j.after).toString() === j.afterLength);
        requireValid(validRecord(j.beforeRecord) && validRecord(j.afterRecord));
        const before = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(j.before)), after = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(j.after));
        requireValid((0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.validEnvelope)(before) && (0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.validEnvelope)(after));
        const beforeEnvelope = before, afterEnvelope = after;
        requireValid(beforeEnvelope.id === j.ownerId && afterEnvelope.id === j.ownerId);
        requireValid(beforeEnvelope.recordVersion === j.expectedRecordVersion && j.beforeRecord.recordVersion === beforeEnvelope.recordVersion);
        requireValid(j.afterRecord.recordVersion === afterEnvelope.recordVersion);
        requireValid(j.beforeRecord.sha256 === j.beforeHash && j.afterRecord.sha256 === j.afterHash);
        requireValid(j.beforeRecord.id === j.ownerId && j.afterRecord.id === j.ownerId);
        requireValid(j.beforeRecord.rootId === j.rootId && j.afterRecord.rootId === j.rootId);
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(afterEnvelope.data) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)((0,_domain_universe__WEBPACK_IMPORTED_MODULE_8__.profileData)(j.request.data)));
        requireValid((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_6__.validReceipt)(j.receipt));
        requireValid((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(j.receipt) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(receipt(opId, j.ownerId, j.targetGeneration, afterEnvelope.recordVersion, j.request.submittedEditorRevision)));
    }
    close() {
        if (this.released)
            return;
        if (!this.releaseStarted) {
            if (this.failed)
                this.recover();
            this.snapshot();
            this.releaseStarted = true;
        }
        if (!this.databaseClosed) {
            this.workspace.detach();
            this.db.close();
            this.databaseClosed = true;
        }
        if (this.lease.isTransaction)
            this.lease.exec('ROLLBACK');
        this.lease.close();
        this.released = true;
    }
}


/***/ },

/***/ "./src/infrastructure/workspace-coordinator.ts"
/*!*****************************************************!*\
  !*** ./src/infrastructure/workspace-coordinator.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkspaceCoordinator: () => (/* binding */ WorkspaceCoordinator)
/* harmony export */ });
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _workspace_storage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./workspace-storage */ "./src/infrastructure/workspace-storage.ts");
/* harmony import */ var _universe_storage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./universe-storage */ "./src/infrastructure/universe-storage.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");











const APP_ID = 1465140302;
class WorkspaceCoordinator {
    userData;
    id;
    db;
    stores = new Map();
    recovering = new Set();
    constructor(userData) {
        this.userData = userData;
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.ensureManagedDirectory)(userData, 'database');
        const filename = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(userData, 'database/workspace-coordinator.sqlite'), exists = node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(filename);
        if (!exists)
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.writeExclusive)(filename, '');
        this.db = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_9__.connect)(filename, !exists, APP_ID);
        if (!exists) {
            this.db.exec(`PRAGMA application_id=${APP_ID};PRAGMA user_version=1;CREATE TABLE coordinator_identity(singleton INTEGER PRIMARY KEY CHECK(singleton=1),id TEXT NOT NULL);CREATE TABLE coordinator_operations(operationId TEXT PRIMARY KEY,requestDigest TEXT NOT NULL,state TEXT NOT NULL,record TEXT NOT NULL);CREATE TABLE coordinator_bindings(rootId TEXT PRIMARY KEY,ownerKind TEXT NOT NULL,ownerId TEXT NOT NULL,universeId TEXT NOT NULL,basePath TEXT NOT NULL);`);
            this.db.prepare('INSERT INTO coordinator_identity VALUES(1,?)').run((0,node_crypto__WEBPACK_IMPORTED_MODULE_4__.randomUUID)());
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_3___default().dirname(filename));
        }
        const identity = this.db.prepare('SELECT id FROM coordinator_identity WHERE singleton=1').get();
        if (!identity || !(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(identity.id))
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The coordinator identity is missing.', 'unknown');
        this.id = String(identity.id);
    }
    register(store) { const m = store.identity(); this.db.prepare('INSERT INTO coordinator_bindings VALUES(?,?,?,?,?) ON CONFLICT(rootId) DO UPDATE SET basePath=excluded.basePath').run(m.rootId, m.owner.kind, m.owner.id, m.universeId, store.location); this.stores.set(m.rootId, store); }
    /** Purpose-bound recovery location, before opening either side of an interrupted coordinated activation. */
    locateActivationParticipant(owner, rootId, universeId, location) {
        const root = node_fs__WEBPACK_IMPORTED_MODULE_2___default().realpathSync(location), discovery = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, 'writingtool.json'));
        if (discovery.kind !== owner.kind || discovery.id !== owner.id || discovery.rootId !== rootId)
            throw new Error('The activation location has a different permanent identity.');
        const prior = this.db.prepare('SELECT * FROM coordinator_bindings WHERE rootId=?').get(rootId);
        if (prior) {
            if (prior.ownerKind !== owner.kind || prior.ownerId !== owner.id || prior.universeId !== universeId)
                throw new Error('The original coordinator binding has a different owner.');
            if (String(prior.basePath) !== root && node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(String(prior.basePath)) && node_fs__WEBPACK_IMPORTED_MODULE_2___default().realpathSync(String(prior.basePath)) !== root && ['writingtool.json', 'database', '.writingtool-creation.json'].some(name => node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(String(prior.basePath), name))))
                throw new Error('The original activation authority is still accessible.');
        }
        this.db.prepare('INSERT INTO coordinator_bindings VALUES(?,?,?,?,?) ON CONFLICT(rootId) DO UPDATE SET basePath=excluded.basePath').run(rootId, owner.kind, owner.id, universeId, root);
    }
    unregister(store) { for (const [id, current] of this.stores)
        if (current === store)
            this.stores.delete(id); }
    record(id, digest) { const row = this.db.prepare('SELECT * FROM coordinator_operations WHERE operationId=?').get(id); if (!row || typeof row.record !== 'string')
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The original coordinated decision is unavailable.', 'unknown'); const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)(Buffer.from(row.record)); if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(value, ['schemaVersion', 'operationId', 'requestDigest', 'participants', 'receipt', 'state']))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The coordinator record schema is invalid.', 'unknown'); const r = value; if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_6__.validWorkspaceReceipt)(r.receipt) || r.receipt.operationId !== id || !Array.isArray(r.participants) || r.participants.length !== 2 || !r.participants.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.closed)(p, ['owner', 'rootId', 'expectedGeneration', 'targetGeneration', 'fencingToken', 'planDigest']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_6__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(p.rootId) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(p.expectedGeneration) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_1__.unsignedInteger)(p.targetGeneration) && BigInt(p.targetGeneration) === BigInt(p.expectedGeneration) + 1n && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(p.fencingToken) && (p.planDigest === '' && (r.state === 'preparing' || r.state === 'aborted') || /^[a-f0-9]{64}$/.test(p.planDigest))) || new Set(r.participants.map(p => p.rootId)).size !== r.participants.length || !['preparing', 'prepared', 'commit', 'complete', 'aborted'].includes(r.state))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The coordinator plan is invalid.', 'unknown'); if (r.schemaVersion !== 1 || r.operationId !== id || r.requestDigest !== row.requestDigest || r.state !== row.state || digest && digest !== r.requestDigest)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('OPERATION_CONFLICT', 'The coordinated operation does not match its original request.', 'unknown'); return r; }
    save(record) { const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(record); (0,_universe_storage__WEBPACK_IMPORTED_MODULE_9__.transaction)(this.db, () => { this.db.prepare('INSERT INTO coordinator_operations VALUES(?,?,?,?) ON CONFLICT(operationId) DO UPDATE SET state=excluded.state,record=excluded.record').run(record.operationId, record.requestDigest, record.state, bytes); }); }
    decision(id, digest) { const r = this.record(id, digest); return r.state === 'commit' || r.state === 'complete' ? 'commit' : 'abort'; }
    receipt(id, digest) { if (!this.db.prepare('SELECT operationId FROM coordinator_operations WHERE operationId=?').get(id))
        return; const r = this.record(id, digest); if (r.state === 'commit' || r.state === 'complete') {
        if (r.state !== 'complete')
            this.recover(id);
        return r.receipt;
    } if (r.state !== 'aborted')
        this.recover(id); const reconciled = this.record(id, digest); if (digest && reconciled.state === 'aborted' && reconciled.participants.some(p => !p.planDigest))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('OPERATION_CONFLICT', 'This operation was confirmed not committed before every participant was prepared. Retry the retained edits with a new operation ID.', 'not-committed'); return; }
    commit(operationId, digest, plans, receipt, request) {
        const prior = this.receipt(operationId, digest);
        if (prior)
            return prior;
        const resolved = plans.map(p => { const store = [...this.stores.values()].find(s => (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(s.identity().owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(p.owner)); if (!store)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'A required authority is unavailable.', 'unknown'); return { store, plan: p.plan }; });
        const ordered = resolved.sort((a, b) => { const x = a.store.identity().owner, y = b.store.identity().owner; return (x.kind + '/' + x.id).localeCompare(y.kind + '/' + y.id); });
        let record = { schemaVersion: 1, operationId, requestDigest: digest, participants: ordered.map(p => { const m = p.store.identity(); return { owner: m.owner, rootId: m.rootId, expectedGeneration: m.generation, targetGeneration: (BigInt(m.generation) + 1n).toString(), fencingToken: m.sessionToken, planDigest: '' }; }), receipt, state: 'preparing' };
        this.save(record);
        try {
            const journals = ordered.map(p => ({ store: p.store, journal: p.store.prepare(operationId, digest, p.plan, receipt, request, true) }));
            if (!journals.every(p => (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(p.journal.receipt) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(journals[0].journal.receipt)))
                throw new Error('Participant receipt mismatch');
            record = { ...record, state: 'prepared', participants: journals.map(p => ({ ...record.participants.find(x => x.rootId === p.journal.rootId), planDigest: p.journal.planDigest, expectedGeneration: p.journal.expectedGeneration, targetGeneration: p.journal.targetGeneration, fencingToken: p.journal.fencingToken })), receipt: journals[0].journal.receipt };
            this.save(record);
            journals.forEach(p => p.store.publish(p.journal, p.journal.fencingToken !== p.store.identity().sessionToken));
            record = { ...record, state: 'commit' };
            this.save(record);
            journals.forEach(p => p.store.apply(p.journal, p.journal.fencingToken !== p.store.identity().sessionToken));
            journals.forEach(p => p.store.finalize(p.journal));
            this.save({ ...record, state: 'complete' });
            return record.receipt;
        }
        catch {
            ordered.forEach(p => p.store.markBlocked());
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The coordinated save requires reconciliation of every original participant.', 'unknown');
        }
    }
    recover(id) {
        if (!this.db.prepare('SELECT operationId FROM coordinator_operations WHERE operationId=?').get(id))
            return;
        if (this.recovering.has(id))
            return;
        this.recovering.add(id);
        const temporary = [];
        try {
            let r = this.record(id);
            if (r.state === 'complete' || r.state === 'aborted')
                return;
            const participants = [...r.participants].sort((a, b) => (a.owner.kind + '/' + a.owner.id).localeCompare(b.owner.kind + '/' + b.owner.id));
            // Reuse existing authority; absent participants acquire their existing lease, never a competing live store.
            const stores = participants.map(p => { let store = this.stores.get(p.rootId); if (store) {
                store.identity();
                return { store, p };
            } const binding = this.db.prepare('SELECT * FROM coordinator_bindings WHERE rootId=?').get(p.rootId); if (!binding || binding.ownerId !== p.owner.id || binding.ownerKind !== p.owner.kind)
                throw new Error('Missing participant binding'); const root = String(binding.basePath), d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, 'writingtool.json')); if (d.id !== p.owner.id || d.rootId !== p.rootId || d.kind !== p.owner.kind)
                throw new Error('Participant identity mismatch'); const appId = p.owner.kind === 'project' ? 1465140301 : 1465140300; const lease = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_9__.connect)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/lease.sqlite'), false, appId); let db; try {
                lease.exec('BEGIN EXCLUSIVE');
                const identity = lease.prepare('SELECT * FROM lease_identity').get();
                if (identity?.ownerId !== p.owner.id || identity?.rootId !== p.rootId)
                    throw new Error('Participant lease mismatch');
                db = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_9__.connect)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/catalog.sqlite'), false, appId);
                const catalog = db;
                const health = () => { if (!lease.isTransaction)
                    throw new Error('Lost participant lease'); const current = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, 'writingtool.json')); if (current.id !== p.owner.id || current.rootId !== p.rootId)
                    throw new Error('Participant root changed'); };
                store = new _workspace_storage__WEBPACK_IMPORTED_MODULE_8__.WorkspaceStore(root, catalog, () => { health(); const m = catalog.prepare('SELECT * FROM unit_meta WHERE singleton=1').get(); return { owner: p.owner, rootId: p.rootId, universeId: p.owner.kind === 'universe' ? p.owner.id : String(m.universeId), generation: String(m.generation), sessionToken: String(m.sessionToken) }; }, health, this);
                this.register(store);
                temporary.push({ store, db: catalog, lease });
                return { store, p };
            }
            catch (e) {
                db?.close();
                if (lease.isTransaction)
                    lease.exec('ROLLBACK');
                lease.close();
                throw e;
            } });
            const plans = stores.flatMap(({ store, p }) => {
                if (r.state === 'preparing' && !p.planDigest && store.abortUnprepared(id, p.expectedGeneration))
                    return [];
                const journal = store.readJournal(id);
                if (journal.scope !== 'coordinated' || journal.coordinatorId !== this.id || journal.requestDigest !== r.requestDigest || (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(journal.receipt) !== (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(r.receipt) || (p.planDigest && p.planDigest !== journal.planDigest))
                    throw new Error('Coordinated plan mismatch');
                return [{ store, journal }];
            });
            if (r.state === 'commit') {
                plans.forEach(p => p.store.publish(p.journal, true));
                plans.forEach(p => p.store.apply(p.journal, true));
                plans.forEach(p => p.store.finalize(p.journal));
                r = { ...r, state: 'complete' };
            }
            else {
                plans.forEach(p => p.store.undo(p.journal));
                r = { ...r, state: 'aborted', participants: r.participants.map(p => ({ ...p, planDigest: plans.find(plan => plan.journal.rootId === p.rootId)?.journal.planDigest ?? p.planDigest })) };
            }
            this.save(r);
        }
        catch {
            try {
                for (const participant of this.record(id).participants)
                    this.stores.get(participant.rootId)?.markBlocked();
            }
            catch { }
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'The original coordinator or a required participant cannot be reconciled. All evidence was retained.', 'unknown');
        }
        finally {
            for (const t of temporary.reverse()) {
                this.unregister(t.store);
                t.db.close();
                if (t.lease.isTransaction)
                    t.lease.exec('ROLLBACK');
                t.lease.close();
            }
            this.recovering.delete(id);
        }
    }
    /** Empty participant staging is recoverable only under its original durable abort. */
    recoverUnprepared(operationId, rootId) {
        if (!this.db.prepare('SELECT operationId FROM coordinator_operations WHERE operationId=?').get(operationId))
            return false;
        let record = this.record(operationId);
        const participant = record.participants.find(p => p.rootId === rootId);
        if (!participant || participant.planDigest || !['preparing', 'aborted'].includes(record.state))
            return false;
        this.recover(operationId);
        record = this.record(operationId);
        return record.state === 'aborted';
    }
    assertUnreferenced(universeId, removedIds, validatedProjectIds) {
        if (!removedIds.length)
            return;
        for (const binding of this.db.prepare("SELECT * FROM coordinator_bindings WHERE ownerKind='project' AND universeId=? ORDER BY ownerId").all(universeId)) {
            const projectId = String(binding.ownerId);
            if (validatedProjectIds.includes(projectId))
                continue;
            let lease, catalog;
            try {
                const root = String(binding.basePath), d = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, 'writingtool.json'));
                if (d.kind !== 'project' || d.id !== projectId || d.rootId !== binding.rootId)
                    throw new Error('Project binding changed');
                lease = (0,_universe_storage__WEBPACK_IMPORTED_MODULE_9__.connect)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/lease.sqlite'), false, 1465140301);
                lease.exec('BEGIN EXCLUSIVE');
                const identity = lease.prepare('SELECT * FROM lease_identity').get();
                if (identity?.ownerId !== projectId || identity.rootId !== binding.rootId)
                    throw new Error('Project ownership mismatch');
                catalog = new node_sqlite__WEBPACK_IMPORTED_MODULE_5__.DatabaseSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/catalog.sqlite'), { readOnly: true });
                if (catalog.prepare('PRAGMA quick_check').get()?.quick_check !== 'ok' || catalog.prepare('PRAGMA user_version').get()?.user_version !== 1 || catalog.prepare('PRAGMA application_id').get()?.application_id !== 1465140301)
                    throw new Error('Unrecognized dependency catalog');
                const meta = catalog.prepare('SELECT * FROM unit_meta WHERE singleton=1').get();
                if (meta?.ownerId !== projectId || meta.rootId !== binding.rootId || meta.creationState !== 'complete')
                    throw new Error('Project identity mismatch');
                if (meta.universeId !== universeId)
                    continue;
                const operations = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, 'database/operations');
                if (node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(operations))
                    for (const id of node_fs__WEBPACK_IMPORTED_MODULE_2___default().readdirSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.checked)(root, 'database/operations', true))) {
                        if (!(0,_domain_validation__WEBPACK_IMPORTED_MODULE_0__.isUuid)(id))
                            throw new Error('Unknown project operation');
                        const journal = (0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_10__.readManaged)(root, `database/operations/${id}/journal.json`));
                        if (journal.command !== 'workspace.publish' || journal.operationId !== id)
                            throw new Error('Unknown dependency operation');
                        const finalized = node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, `database/operations/${id}/finalized.json`)), aborted = node_fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, `database/operations/${id}/aborted.json`));
                        if (finalized === aborted)
                            throw new Error('Unfinished project dependency operation');
                        if (journal.scope === 'coordinated' && this.record(id).state !== 'complete' && this.record(id).state !== 'aborted')
                            throw new Error('Unfinished coordinated dependency');
                    }
                const feature = catalog.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='workspace_features'").get();
                if (!feature)
                    continue;
                const features = catalog.prepare('SELECT * FROM workspace_features').all();
                if (features.length !== 1 || features[0].name !== 'workspace-content' || features[0].version !== 1)
                    throw new Error('Unsupported dependency feature');
                const dependencyCatalog = catalog;
                const health = () => { if (!lease?.isTransaction)
                    throw new Error('Dependency lease lost'); };
                const dependency = new _workspace_storage__WEBPACK_IMPORTED_MODULE_8__.WorkspaceStore(root, dependencyCatalog, () => ({ owner: { kind: 'project', id: projectId }, rootId: String(binding.rootId), universeId, generation: String(meta.generation), sessionToken: String(meta.sessionToken) }), health);
                const snapshot = dependency.snapshot();
                const references = snapshot.records.flatMap(r => r.recordType === 'chapter' ? [...r.data.characterIds, ...r.data.events.map(e => e.eventId)] : r.recordType === 'decision-context' ? [r.data.decisionId] : []);
                if (references.some(id => removedIds.includes(id)))
                    throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('VALIDATION', 'A known project still references a record being removed. Open that project and resolve its references first.');
            }
            catch (e) {
                if (e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure && e.code === 'VALIDATION')
                    throw e;
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_7__.UniverseFailure('RECOVERY_REQUIRED', 'A known project dependency is unavailable or unfinished. Reopen it before removing shared records.');
            }
            finally {
                catalog?.close();
                if (lease?.isTransaction)
                    lease.exec('ROLLBACK');
                lease?.close();
            }
        }
    }
    settingsGate(fn) { this.db.exec('BEGIN IMMEDIATE'); try {
        const result = fn();
        this.db.exec('COMMIT');
        return result;
    }
    catch (e) {
        if (this.db.isTransaction)
            this.db.exec('ROLLBACK');
        throw e;
    } }
    close() { this.db.close(); }
}


/***/ },

/***/ "./src/infrastructure/workspace-storage.ts"
/*!*************************************************!*\
  !*** ./src/infrastructure/workspace-storage.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WORKSPACE_DDL: () => (/* binding */ WORKSPACE_DDL),
/* harmony export */   WORKSPACE_TABLES: () => (/* binding */ WORKSPACE_TABLES),
/* harmony export */   WorkspaceStore: () => (/* binding */ WorkspaceStore)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs */ "node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ "node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:os */ "node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:sqlite */ "node:sqlite");
/* harmony import */ var node_sqlite__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_sqlite__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _domain_manuscript__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../domain/manuscript */ "./src/domain/manuscript.ts");
/* harmony import */ var _domain_validation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../domain/validation */ "./src/domain/validation.ts");
/* harmony import */ var _domain_calendar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../domain/calendar */ "./src/domain/calendar.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _universe_files__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./universe-files */ "./src/infrastructure/universe-files.ts");












const WORKSPACE_DDL = `
CREATE TABLE workspace_features(name TEXT PRIMARY KEY,version INTEGER NOT NULL);
INSERT INTO workspace_features VALUES('workspace-content',1);
CREATE TABLE workspace_records(id TEXT PRIMARY KEY,recordType TEXT NOT NULL,recordVersion TEXT NOT NULL,relativePath TEXT NOT NULL UNIQUE,sha256 TEXT NOT NULL,tombstone INTEGER NOT NULL CHECK(tombstone IN(0,1)),deletedVersion TEXT);
CREATE TABLE workspace_files(relativePath TEXT PRIMARY KEY,recordId TEXT NOT NULL,recordVersion TEXT NOT NULL,role TEXT NOT NULL,sha256 TEXT NOT NULL,byteLength TEXT NOT NULL);
CREATE TABLE workspace_relationships(sourceId TEXT NOT NULL,relation TEXT NOT NULL,targetId TEXT NOT NULL,targetUniverseId TEXT NOT NULL,PRIMARY KEY(sourceId,relation,targetId));
CREATE TABLE workspace_codes(recordId TEXT PRIMARY KEY,code TEXT NOT NULL,codeKey TEXT NOT NULL COLLATE BINARY UNIQUE);
CREATE TABLE workspace_counters(kind TEXT PRIMARY KEY CHECK(kind IN('event','decision','story','chapter')),issued TEXT NOT NULL);
INSERT INTO workspace_counters VALUES('event','0'),('decision','0'),('story','0'),('chapter','0');
CREATE TABLE workspace_assets(id TEXT PRIMARY KEY,sha256 TEXT NOT NULL,mediaType TEXT NOT NULL,relativePath TEXT NOT NULL UNIQUE,byteLength TEXT NOT NULL);
CREATE TABLE workspace_versions(recordVersion TEXT PRIMARY KEY,recordId TEXT NOT NULL,recordType TEXT NOT NULL,jsonPath TEXT NOT NULL,manuscriptPath TEXT);
`;
const WORKSPACE_TABLES = ['workspace_assets', 'workspace_codes', 'workspace_counters', 'workspace_features', 'workspace_files', 'workspace_records', 'workspace_relationships', 'workspace_versions'];
const lexical = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const ensure = (v, message = 'Workspace integrity validation failed.') => { if (!v)
    throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('INTEGRITY_MISMATCH', message, 'unknown'); };
function transact(db, fn) { db.exec('BEGIN IMMEDIATE'); try {
    fn();
    db.exec('COMMIT');
}
catch (e) {
    if (db.isTransaction)
        db.exec('ROLLBACK');
    throw e;
} }
class WorkspaceStore {
    location;
    db;
    authority;
    health;
    ledger;
    blocked = false;
    installed = false;
    constructor(location, db, authority, health, ledger) {
        this.location = location;
        this.db = db;
        this.authority = authority;
        this.health = health;
        this.ledger = ledger;
        this.inspectFeature();
    }
    inspectFeature() {
        this.health();
        const exists = this.db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='workspace_features'").get();
        if (!exists) {
            const foreign = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'workspace_%'").all();
            ensure(!foreign.length, 'Unrecognized partial workspace schema.');
            this.installed = false;
            return;
        }
        const features = this.db.prepare('SELECT * FROM workspace_features').all();
        if (features.length !== 1 || features[0].name !== 'workspace-content' || features[0].version !== 1)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('UNSUPPORTED_VERSION', 'This workspace feature schema is unsupported.');
        this.installed = true;
    }
    attach() { this.ledger?.register(this); }
    detach() { this.ledger?.unregister?.(this); }
    featureInstalled() { return this.installed; }
    initializeFeature() { this.health(); if (!this.installed) {
        transact(this.db, () => this.db.exec(WORKSPACE_DDL));
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, 'database'));
        this.installed = true;
    } for (const category of new Set([...Object.values(_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory), 'images', 'history/objects', 'database/operations']))
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(this.location, category); }
    assertReady() { if (this.blocked)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('RECOVERY_REQUIRED', 'Reconcile the original workspace operation before continuing.', 'unknown'); this.health(); }
    identity() { this.health(); return this.authority(); }
    indexes() { if (!this.installed)
        return { records: [], files: [], relationships: [], codes: [], counters: { event: '0', decision: '0', story: '0', chapter: '0' }, assets: [], versions: [] }; return { records: this.db.prepare('SELECT * FROM workspace_records ORDER BY id').all(), files: this.db.prepare('SELECT * FROM workspace_files ORDER BY relativePath').all(), relationships: this.db.prepare('SELECT * FROM workspace_relationships ORDER BY sourceId,relation,targetId').all(), codes: this.db.prepare('SELECT * FROM workspace_codes ORDER BY recordId').all(), counters: { event: String(this.db.prepare("SELECT issued FROM workspace_counters WHERE kind='event'").get()?.issued), decision: String(this.db.prepare("SELECT issued FROM workspace_counters WHERE kind='decision'").get()?.issued), story: String(this.db.prepare("SELECT issued FROM workspace_counters WHERE kind='story'").get()?.issued), chapter: String(this.db.prepare("SELECT issued FROM workspace_counters WHERE kind='chapter'").get()?.issued) }, assets: this.db.prepare('SELECT * FROM workspace_assets ORDER BY id').all(), versions: this.db.prepare('SELECT * FROM workspace_versions ORDER BY recordVersion').all() }; }
    snapshot() {
        this.assertReady();
        const m = this.authority(), indexes = this.indexes();
        this.assertPlan(indexes);
        const records = [], manuscripts = {};
        ensure((0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(indexes.counters.event) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(indexes.counters.decision));
        for (const r of indexes.records) {
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.recordVersion) && [0, 1].includes(r.tombstone) && Object.hasOwn(_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory, r.recordType) && r.relativePath === `${_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory[r.recordType]}/${r.id}.json`);
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, r.relativePath);
            ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === r.sha256, 'Workspace file/catalog mismatch.');
            if (r.tombstone)
                continue;
            const record = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)(bytes);
            ensure((0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.validateWorkspaceRecord)(record));
            const typed = record;
            ensure(typed.id === r.id && typed.recordVersion === r.recordVersion && typed.recordType === r.recordType && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(typed.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(m.owner) && typed.universeId === m.universeId);
            records.push(typed);
            if (typed.recordType === 'chapter') {
                const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, typed.data.formatting.text.relativePath);
                const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
                ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === typed.data.formatting.text.sha256 && bytes.length.toString() === typed.data.formatting.text.byteLength && Array.from(text).length.toString() === typed.data.formatting.text.scalarLength);
                (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_7__.assertManuscript)(text, typed.data.formatting.paragraphs);
                manuscripts[typed.id] = text;
            }
        }
        for (const f of indexes.files) {
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, f.relativePath);
            ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === f.sha256 && bytes.length.toString() === f.byteLength);
        }
        for (const a of indexes.assets) {
            const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, a.relativePath);
            ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === a.sha256 && bytes.length.toString() === a.byteLength);
        }
        const relationships = records.flatMap(r => this.relationships(r)).sort((a, b) => lexical(a.sourceId, b.sourceId) || lexical(a.relation, b.relation) || lexical(a.targetId, b.targetId));
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(relationships) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(indexes.relationships));
        const codes = records.filter((r) => r.recordType === 'event' || r.recordType === 'decision').map(r => ({ recordId: r.id, code: r.data.code, codeKey: (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.canonicalCodeKey)(r.data.code) })).sort((a, b) => lexical(a.recordId, b.recordId));
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(codes) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(indexes.codes));
        for (const v of indexes.versions) {
            const r = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, v.jsonPath));
            ensure((0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.validateWorkspaceRecord)(r));
            const record = r;
            ensure(record.id === v.recordId && record.recordVersion === v.recordVersion && record.recordType === v.recordType && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(record.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(m.owner) && record.universeId === m.universeId);
            if (record.recordType === 'chapter') {
                ensure(v.manuscriptPath);
                const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, v.manuscriptPath), text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
                ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === record.data.formatting.text.sha256 && bytes.length.toString() === record.data.formatting.text.byteLength && Array.from(text).length.toString() === record.data.formatting.text.scalarLength);
                (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_7__.assertManuscript)(text, record.data.formatting.paragraphs);
            }
        }
        if (m.owner.kind === 'universe')
            (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.assertWorkspaceState)(records);
        return { owner: m.owner, rootId: m.rootId, universeId: m.universeId, generation: m.generation, records, manuscripts, assets: indexes.assets.map(({ id, sha256, mediaType }) => ({ id, sha256, mediaType })), counters: indexes.counters };
    }
    readAsset(id) { this.assertReady(); const a = this.indexes().assets.find(a => a.id === id); if (!a)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('VALIDATION', 'The managed image does not exist.'); const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, a.relativePath); ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === a.sha256); return { id: a.id, sha256: a.sha256, mediaType: a.mediaType, base64: bytes.toString('base64') }; }
    hasIdentity(id) { if (!this.installed)
        return false; return !!this.db.prepare('SELECT id FROM workspace_records WHERE id=?').get(id); }
    receipt(operationId, digest) { this.assertReady(); const op = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(operationId); if (!op)
        return; ensure(typeof op.receiptData === 'string' && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(op.receiptData) === op.resultDigest); if (digest && op.requestDigest !== digest)
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('OPERATION_CONFLICT', 'This operation ID belongs to different content.'); const r = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)(Buffer.from(String(op.receiptData))); if (!(0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validWorkspaceReceipt)(r))
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('OPERATION_CONFLICT', 'This operation ID belongs to another command.'); return r; }
    prepare(operationId, digest, commit, receipt, request, coordinated = false) {
        this.assertReady();
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(request)) === digest && this.validOperationRequest(request, operationId), 'The original operation request does not match its digest.');
        const m = this.authority();
        if (commit.expectedGeneration !== m.generation)
            throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('GENERATION_CONFLICT', 'The owning unit changed. Reload before saving.');
        this.initializeFeature();
        const existing = `database/operations/${operationId}/journal.json`;
        if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, existing))) {
            const j = this.readJournal(operationId);
            if (j.requestDigest !== digest)
                throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('OPERATION_CONFLICT', 'The operation journal belongs to different content.');
            ensure(j.expectedGeneration === m.generation && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.before) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(this.indexes()), 'Retry no longer matches its original prepared state.');
            const aborted = `database/operations/${operationId}/aborted.json`;
            ensure(node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, aborted)), 'Reconcile the original unfinished operation before retrying.');
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.removeManagedBytes)(this.location, aborted, (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, aborted)));
            return j;
        }
        const before = this.indexes(), after = { records: [], files: [], relationships: [], codes: [], counters: commit.counters, assets: [...before.assets], versions: [...before.versions] }, files = [];
        const stage = (relativePath, bytes) => { let prior = null; try {
            prior = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, relativePath);
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        } if (prior && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(prior) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes))
            return; files.push({ relativePath, before: prior?.toString('base64') ?? null, after: bytes.toString('base64'), beforeHash: prior ? (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(prior) : null, afterHash: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes), beforeByteLength: prior?.length.toString() ?? null, byteLength: bytes.length.toString() }); };
        const live = new Set(commit.records.map(r => r.id));
        for (const r of before.records)
            if (!live.has(r.id))
                after.records.push({ ...r, tombstone: 1, deletedVersion: r.deletedVersion ?? receipt.units.flatMap(u => u.records).find(x => x.id === r.id && x.deleted)?.recordVersion ?? (0,node_crypto__WEBPACK_IMPORTED_MODULE_3__.randomUUID)() });
        for (const record of commit.records) {
            const relativePath = `${_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory[record.recordType]}/${record.id}.json`, bytes = Buffer.from((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(record));
            after.records.push({ id: record.id, recordType: record.recordType, recordVersion: record.recordVersion, relativePath, sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes), tombstone: 0, deletedVersion: null });
            stage(relativePath, bytes);
            after.files.push({ relativePath, recordId: record.id, recordVersion: record.recordVersion, role: 'json', sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes), byteLength: bytes.length.toString() });
            const jsonPath = `history/objects/${record.recordVersion}/${relativePath}`, manuscriptPath = record.recordType === 'chapter' ? `history/objects/${record.recordVersion}/chapters/${record.id}.wrt` : null;
            if (!after.versions.some(v => v.recordVersion === record.recordVersion)) {
                stage(jsonPath, bytes);
                after.versions.push({ recordVersion: record.recordVersion, recordId: record.id, recordType: record.recordType, jsonPath, manuscriptPath });
            }
            if (record.recordType === 'chapter') {
                const text = commit.manuscripts[record.id];
                ensure(typeof text === 'string');
                (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_7__.assertManuscript)(text, record.data.formatting.paragraphs);
                const bytes = Buffer.from(text);
                ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === record.data.formatting.text.sha256);
                const p = record.data.formatting.text.relativePath;
                stage(p, bytes);
                if (manuscriptPath)
                    stage(manuscriptPath, bytes);
                after.files.push({ relativePath: p, recordId: record.id, recordVersion: record.recordVersion, role: 'wrt', sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes), byteLength: bytes.length.toString() });
            }
            if (record.recordType === 'event' || record.recordType === 'decision')
                after.codes.push({ recordId: record.id, code: record.data.code, codeKey: (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.canonicalCodeKey)(record.data.code) });
            this.relationships(record).forEach(r => after.relationships.push(r));
        }
        for (const asset of commit.assets) {
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(asset.id) && /^[a-f0-9]{64}$/.test(asset.sha256) && ['image/png', 'image/jpeg', 'image/webp'].includes(asset.mediaType));
            const bytes = Buffer.from(asset.base64, 'base64');
            ensure(bytes.toString('base64') === asset.base64 && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === asset.sha256);
            const existing = after.assets.find(a => a.id === asset.id);
            if (existing) {
                ensure(existing.sha256 === asset.sha256 && existing.mediaType === asset.mediaType);
                continue;
            }
            const extension = asset.mediaType === 'image/png' ? 'png' : asset.mediaType === 'image/jpeg' ? 'jpg' : 'webp', relativePath = `images/${asset.id}.${extension}`;
            stage(relativePath, bytes);
            after.assets.push({ id: asset.id, sha256: asset.sha256, mediaType: asset.mediaType, relativePath, byteLength: bytes.length.toString() });
        }
        after.records.sort((a, b) => lexical(a.id, b.id));
        after.files.sort((a, b) => lexical(a.relativePath, b.relativePath));
        after.assets.sort((a, b) => lexical(a.id, b.id));
        after.versions.sort((a, b) => lexical(a.recordVersion, b.recordVersion));
        after.relationships.sort((a, b) => lexical(a.sourceId, b.sourceId) || lexical(a.relation, b.relation) || lexical(a.targetId, b.targetId));
        after.codes.sort((a, b) => lexical(a.recordId, b.recordId));
        const plan = { schemaVersion: 1, scope: coordinated ? 'coordinated' : 'single-unit', command: 'workspace.publish', owner: m.owner, rootId: m.rootId, universeId: m.universeId, operationId, requestDigest: digest, request, expectedGeneration: m.generation, targetGeneration: (BigInt(m.generation) + 1n).toString(), fencingToken: m.sessionToken, coordinatorId: coordinated ? this.ledger.id : null, before, after, files, receipt };
        const journal = { ...plan, planDigest: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(plan)) };
        this.validateJournalPlans(journal);
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(this.location, `database/operations/${operationId}`);
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.writeExclusive)(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, existing), (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(journal));
        return journal;
    }
    relationships(r) { const result = []; const add = (relation, targetId) => result.push({ sourceId: r.id, relation, targetId, targetUniverseId: r.universeId }); switch (r.recordType) {
        case 'story':
            if (r.data.volumeId)
                add('volume', r.data.volumeId);
            break;
        case 'chapter':
            add('story', r.data.storyId);
            r.data.characterIds.forEach(id => add('character', id));
            r.data.events.forEach(e => add(`depicts:${e.role}`, e.eventId));
            break;
        case 'plot':
            add('story', r.data.storyId);
            break;
        case 'decision-context':
            add('story', r.data.storyId);
            add('decision', r.data.decisionId);
            break;
        case 'decision':
            add('type', r.data.typeId);
            r.data.characterIds.forEach(id => add('relevant-character', id));
            r.data.eventIds.forEach(id => add('result-event', id));
            r.data.followingDecisionIds.forEach(id => add('following-decision', id));
            if (r.data.maker)
                add('maker', r.data.maker.id);
            break;
        case 'event':
            if (r.data.maker)
                add('maker', r.data.maker.id);
            if (r.data.characterId)
                add(r.data.kind, r.data.characterId);
            break;
        case 'character':
            if (r.data.birthEventId)
                add('birth', r.data.birthEventId);
            break;
        case 'affiliation':
            add('character', r.data.characterId);
            if (r.data.factionId)
                add('faction', r.data.factionId);
            break;
    } return result; }
    publish(j, recovery = false) { this.health(); const m = this.authority(); ensure(m.generation === j.expectedGeneration || recovery && m.generation === j.targetGeneration); if (!recovery)
        ensure(m.sessionToken === j.fencingToken); for (const file of j.files) {
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.ensureManagedDirectory)(this.location, node_path__WEBPACK_IMPORTED_MODULE_1___default().posix.dirname(file.relativePath));
        let current = null;
        try {
            current = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, file.relativePath));
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
        ensure(current === file.beforeHash || current === file.afterHash, 'Unexpected live file preserved.');
        if (current !== file.afterHash)
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(this.location, file.relativePath, Buffer.from(file.after, 'base64'), current);
    } }
    apply(j, recovery = false) { this.health(); const op = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(j.operationId); if (op) {
        ensure(op.requestDigest === j.requestDigest && op.receiptData === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.receipt));
        return;
    } transact(this.db, () => { const m = this.authority(); ensure(m.generation === j.expectedGeneration && (!recovery ? m.sessionToken === j.fencingToken : true)); ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(this.indexes()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.before), 'Prepared catalog expectations changed.'); this.writeIndexes(j.after); this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(j.targetGeneration); const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.receipt); this.db.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(j.operationId, j.requestDigest, j.targetGeneration, (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes), bytes); }); }
    writeIndexes(p) { for (const table of ['workspace_records', 'workspace_files', 'workspace_relationships', 'workspace_codes', 'workspace_counters', 'workspace_assets', 'workspace_versions'])
        this.db.exec(`DELETE FROM ${table}`); for (const r of p.records)
        this.db.prepare('INSERT INTO workspace_records VALUES(?,?,?,?,?,?,?)').run(r.id, r.recordType, r.recordVersion, r.relativePath, r.sha256, r.tombstone, r.deletedVersion); for (const f of p.files)
        this.db.prepare('INSERT INTO workspace_files VALUES(?,?,?,?,?,?)').run(f.relativePath, f.recordId, f.recordVersion, f.role, f.sha256, f.byteLength); for (const r of p.relationships)
        this.db.prepare('INSERT INTO workspace_relationships VALUES(?,?,?,?)').run(r.sourceId, r.relation, r.targetId, r.targetUniverseId); for (const c of p.codes)
        this.db.prepare('INSERT INTO workspace_codes VALUES(?,?,?)').run(c.recordId, c.code, c.codeKey); for (const kind of ['event', 'decision', 'story', 'chapter'])
        this.db.prepare('INSERT INTO workspace_counters VALUES(?,?)').run(kind, p.counters[kind]); for (const a of p.assets)
        this.db.prepare('INSERT INTO workspace_assets VALUES(?,?,?,?,?)').run(a.id, a.sha256, a.mediaType, a.relativePath, a.byteLength); for (const v of p.versions)
        this.db.prepare('INSERT INTO workspace_versions VALUES(?,?,?,?,?)').run(v.recordVersion, v.recordId, v.recordType, v.jsonPath, v.manuscriptPath); }
    finalize(j) { this.health(); ensure(this.authority().generation === j.targetGeneration && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(this.indexes()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.after)); for (const f of j.files)
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, f.relativePath)) === f.afterHash); this.marker(j, 'finalized'); this.blocked = false; }
    marker(j, state) { const relative = `database/operations/${j.operationId}/${state}.json`, value = { schemaVersion: 1, operationId: j.operationId, requestDigest: j.requestDigest }; if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, relative)))
        ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, relative))) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(value));
    else
        (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishMarker)(this.location, relative, (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.jsonBytes)(value)); }
    undo(j) { this.health(); ensure(this.authority().generation === j.expectedGeneration && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(this.indexes()) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.before)); for (const f of [...j.files].reverse()) {
        let current = null;
        try {
            current = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, f.relativePath));
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
        ensure(current === f.beforeHash || current === f.afterHash, 'Unexpected bytes prevent rollback.');
        if (current === f.beforeHash)
            continue;
        if (f.before === null)
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.removeManagedBytes)(this.location, f.relativePath, f.afterHash);
        else
            (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.publishManagedBytes)(this.location, f.relativePath, Buffer.from(f.before, 'base64'), current);
    } this.marker(j, 'aborted'); this.blocked = false; }
    markBlocked() { this.blocked = true; }
    /** Before a coordinator reaches prepared, a participant may have no journal yet. */
    abortUnprepared(operationId, expectedGeneration) {
        this.health();
        ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(operationId));
        try {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().lstatSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, `database/operations/${operationId}/journal.json`));
            return false;
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
        ensure(this.authority().generation === expectedGeneration && !this.db.prepare('SELECT operationId FROM committed_operations WHERE operationId=?').get(operationId), 'The unprepared participant changed or has committed publication evidence.');
        this.blocked = false;
        return true;
    }
    validOperationRequest(value, operationId) {
        if (typeof value !== 'object' || !value)
            return false;
        const v = value;
        if (v.protocolVersion !== 1)
            return false;
        if (v.command === 'workspace.mutate')
            return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(v, ['protocolVersion', 'command', 'submittedEditorRevision', 'units']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validWorkspaceMutation)({ operationId, submittedEditorRevision: v.submittedEditorRevision, units: v.units });
        if (v.command === 'workspace.asset.import')
            return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(v, ['protocolVersion', 'command', 'owner', 'expectedGeneration', 'asset']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validOwner)(v.owner) && v.owner.kind === 'universe' && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(v.expectedGeneration) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validAssetData)(v.asset);
        if (v.command === 'workspace.restore')
            return (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(v, ['protocolVersion', 'command', 'submittedEditorRevision', 'plans']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(v.submittedEditorRevision) && Array.isArray(v.plans) && v.plans.length > 0 && v.plans.length <= 2 && v.plans.every(p => (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(p, ['owner', 'plan']) && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validOwner)(p.owner) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(p.plan, ['expectedGeneration', 'records', 'manuscripts', 'counters', 'assets']) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(p.plan.expectedGeneration) && Array.isArray(p.plan.records) && p.plan.records.every(_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.validateWorkspaceRecord) && typeof p.plan.manuscripts === 'object' && p.plan.manuscripts !== null && !Array.isArray(p.plan.manuscripts) && Object.values(p.plan.manuscripts).every(t => typeof t === 'string') && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(p.plan.counters, ['event', 'decision', 'story', 'chapter']) && Object.values(p.plan.counters).every(_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger) && Array.isArray(p.plan.assets) && p.plan.assets.every(_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validAssetData));
        return false;
    }
    assertPlan(value) {
        ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(value, ['records', 'files', 'relationships', 'codes', 'counters', 'assets', 'versions']));
        const p = value, m = this.authority();
        ensure([p.records, p.files, p.relationships, p.codes, p.assets, p.versions].every(Array.isArray) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(p.counters, ['event', 'decision', 'story', 'chapter']) && Object.values(p.counters).every(_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger));
        const digest = (s) => typeof s === 'string' && /^[a-f0-9]{64}$/.test(s), unique = (values) => new Set(values).size === values.length;
        for (const r of p.records)
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(r, ['id', 'recordType', 'recordVersion', 'relativePath', 'sha256', 'tombstone', 'deletedVersion']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.id) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.recordVersion) && Object.hasOwn(_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory, r.recordType) && (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.ownerKindForType)(r.recordType) === m.owner.kind && r.relativePath === `${_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory[r.recordType]}/${r.id}.json` && digest(r.sha256) && [0, 1].includes(r.tombstone) && (r.tombstone ? (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.deletedVersion) : r.deletedVersion === null));
        ensure(unique(p.records.map(r => r.id)) && unique(p.records.map(r => r.relativePath)));
        for (const f of p.files) {
            const r = p.records.find(r => r.id === f.recordId && !r.tombstone);
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(f, ['relativePath', 'recordId', 'recordVersion', 'role', 'sha256', 'byteLength']) && r && f.recordVersion === r.recordVersion && digest(f.sha256) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(f.byteLength) && (f.role === 'json' && f.relativePath === r.relativePath && f.sha256 === r.sha256 || f.role === 'wrt' && r.recordType === 'chapter' && f.relativePath === `chapters/${r.id}.wrt`));
        }
        ensure(unique(p.files.map(f => f.relativePath)) && p.records.filter(r => !r.tombstone).every(r => p.files.filter(f => f.recordId === r.id).length === (r.recordType === 'chapter' ? 2 : 1)));
        for (const a of p.assets)
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(a, ['id', 'sha256', 'mediaType', 'relativePath', 'byteLength']) && m.owner.kind === 'universe' && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(a.id) && digest(a.sha256) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(a.byteLength) && ['image/png', 'image/jpeg', 'image/webp'].includes(a.mediaType) && a.relativePath === `images/${a.id}.${a.mediaType === 'image/png' ? 'png' : a.mediaType === 'image/jpeg' ? 'jpg' : 'webp'}`);
        ensure(unique(p.assets.map(a => a.id)) && unique(p.assets.map(a => a.sha256 + '/' + a.mediaType)));
        for (const v of p.versions)
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(v, ['recordVersion', 'recordId', 'recordType', 'jsonPath', 'manuscriptPath']) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(v.recordVersion) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(v.recordId) && Object.hasOwn(_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory, v.recordType) && (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.ownerKindForType)(v.recordType) === m.owner.kind && v.jsonPath === `history/objects/${v.recordVersion}/${_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.recordCategory[v.recordType]}/${v.recordId}.json` && (v.recordType === 'chapter' ? v.manuscriptPath === `history/objects/${v.recordVersion}/chapters/${v.recordId}.wrt` : v.manuscriptPath === null));
        ensure(unique(p.versions.map(v => v.recordVersion)));
        for (const c of p.codes) {
            const r = p.records.find(r => r.id === c.recordId && !r.tombstone);
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(c, ['recordId', 'code', 'codeKey']) && r && ['event', 'decision'].includes(r.recordType) && typeof c.code === 'string' && c.codeKey === (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.canonicalCodeKey)(c.code));
        }
        ensure(unique(p.codes.map(c => c.recordId)) && unique(p.codes.map(c => c.codeKey)));
        for (const r of p.relationships)
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(r, ['sourceId', 'relation', 'targetId', 'targetUniverseId']) && p.records.some(s => s.id === r.sourceId && !s.tombstone) && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(r.targetId) && r.targetUniverseId === m.universeId && ['volume', 'story', 'character', 'depicts:main', 'depicts:flashback', 'decision', 'type', 'relevant-character', 'result-event', 'following-decision', 'maker', 'birth', 'background', 'faction'].includes(r.relation));
        ensure(unique(p.relationships.map(r => r.sourceId + '/' + r.relation + '/' + r.targetId)));
    }
    validateJournalPlans(j) {
        this.assertPlan(j.before);
        this.assertPlan(j.after);
        ensure(BigInt(j.after.counters.event) >= BigInt(j.before.counters.event) && BigInt(j.after.counters.decision) >= BigInt(j.before.counters.decision) && BigInt(j.after.counters.story) >= BigInt(j.before.counters.story) && BigInt(j.after.counters.chapter) >= BigInt(j.before.counters.chapter));
        for (const a of j.before.assets)
            ensure(j.after.assets.some(v => (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(v) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(a)));
        for (const v of j.before.versions)
            ensure(j.after.versions.some(x => (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(x) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(v)));
        const allowed = new Map();
        for (const r of j.after.records)
            allowed.set(r.relativePath, r.sha256);
        for (const f of j.after.files)
            allowed.set(f.relativePath, f.sha256);
        for (const a of j.after.assets)
            allowed.set(a.relativePath, a.sha256);
        for (const v of j.after.versions) {
            allowed.set(v.jsonPath, null);
            if (v.manuscriptPath)
                allowed.set(v.manuscriptPath, null);
        }
        ensure(new Set(j.files.map(f => f.relativePath)).size === j.files.length);
        for (const f of j.files) {
            ensure(allowed.has(f.relativePath) && (allowed.get(f.relativePath) === null || allowed.get(f.relativePath) === f.afterHash), 'Journal path has no typed content role.');
            if (f.relativePath.startsWith('history/') || f.relativePath.startsWith('images/'))
                ensure(f.before === null, 'Immutable bytes cannot be replaced.');
            const beforeFile = j.before.files.find(v => v.relativePath === f.relativePath);
            if (beforeFile)
                ensure(beforeFile.sha256 === f.beforeHash);
        }
        const bytesFor = (relative, after) => { const f = j.files.find(f => f.relativePath === relative); if (f) {
            const bytes = after ? f.after : f.before;
            if (bytes === null)
                throw new Error('Missing typed before bytes');
            return Buffer.from(bytes, 'base64');
        } return (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, relative); };
        for (const p of [j.before, j.after]) {
            const records = [];
            for (const r of p.records) {
                const bytes = bytesFor(r.relativePath, p === j.after);
                ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === r.sha256);
                const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)(bytes);
                ensure((0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.validateWorkspaceRecord)(value));
                const record = value;
                ensure(record.id === r.id && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(record.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.owner) && record.universeId === j.universeId && record.recordType === r.recordType && record.recordVersion === r.recordVersion);
                if (r.tombstone)
                    continue;
                records.push(record);
                if (record.recordType === 'chapter') {
                    const bytes = bytesFor(record.data.formatting.text.relativePath, p === j.after), text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
                    (0,_domain_manuscript__WEBPACK_IMPORTED_MODULE_7__.assertManuscript)(text, record.data.formatting.paragraphs);
                    ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) === record.data.formatting.text.sha256 && bytes.length.toString() === record.data.formatting.text.byteLength && Array.from(text).length.toString() === record.data.formatting.text.scalarLength);
                }
            }
            const expected = records.flatMap(r => this.relationships(r)).sort((a, b) => lexical(a.sourceId, b.sourceId) || lexical(a.relation, b.relation) || lexical(a.targetId, b.targetId));
            ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(expected) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(p.relationships));
            const codes = records.filter((r) => r.recordType === 'event' || r.recordType === 'decision').map(r => ({ recordId: r.id, code: r.data.code, codeKey: (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.canonicalCodeKey)(r.data.code) })).sort((a, b) => lexical(a.recordId, b.recordId));
            ensure((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(codes) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(p.codes));
            if (j.owner.kind === 'universe')
                (0,_domain_workspace__WEBPACK_IMPORTED_MODULE_6__.assertWorkspaceState)(records);
        }
    }
    readJournal(id) { const value = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, `database/operations/${id}/journal.json`)); ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(value, ['schemaVersion', 'scope', 'command', 'owner', 'rootId', 'universeId', 'operationId', 'requestDigest', 'request', 'expectedGeneration', 'targetGeneration', 'fencingToken', 'coordinatorId', 'before', 'after', 'files', 'receipt', 'planDigest'])); const j = value, { planDigest, ...plan } = j, m = this.authority(); ensure(j.schemaVersion === 1 && j.command === 'workspace.publish' && ['single-unit', 'coordinated'].includes(j.scope) && (j.scope === 'single-unit' ? j.coordinatorId === null : (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(j.coordinatorId)) && j.operationId === id && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(id) && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(m.owner) && j.rootId === m.rootId && j.universeId === m.universeId && (0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(j.fencingToken) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(j.expectedGeneration) && (0,_domain_calendar__WEBPACK_IMPORTED_MODULE_9__.unsignedInteger)(j.targetGeneration) && BigInt(j.targetGeneration) === BigInt(j.expectedGeneration) + 1n && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(plan)) === planDigest && (0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_5__.validWorkspaceReceipt)(j.receipt) && j.receipt.operationId === id && j.receipt.units.length === (j.scope === 'single-unit' ? 1 : 2) && j.receipt.units.some(u => (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(u.owner) === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.owner) && u.unitGeneration === j.targetGeneration) && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.request)) === j.requestDigest && this.validOperationRequest(j.request, id) && Array.isArray(j.files)); for (const f of j.files)
        ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.closed)(f, ['relativePath', 'before', 'after', 'beforeHash', 'afterHash', 'beforeByteLength', 'byteLength']) && typeof f.relativePath === 'string' && typeof f.after === 'string' && Buffer.from(f.after, 'base64').toString('base64') === f.after && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(Buffer.from(f.after, 'base64')) === f.afterHash && Buffer.from(f.after, 'base64').length.toString() === f.byteLength && (f.before === null ? f.beforeHash === null && f.beforeByteLength === null : typeof f.before === 'string' && Buffer.from(f.before, 'base64').toString('base64') === f.before && (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(Buffer.from(f.before, 'base64')) === f.beforeHash && Buffer.from(f.before, 'base64').length.toString() === f.beforeByteLength)); this.assertPlan(j.before); this.assertPlan(j.after); const committed = this.db.prepare('SELECT operationId FROM committed_operations WHERE operationId=?').get(id); const advanced = BigInt(m.generation) > BigInt(committed ? j.targetGeneration : j.expectedGeneration); if (!advanced)
        this.validateJournalPlans(j); return j; }
    recover() { try {
        this.health();
        if (!this.installed || !node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, 'database/operations'))) {
            this.blocked = false;
            return;
        }
        for (const id of node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.checked)(this.location, 'database/operations', true)).sort()) {
            ensure((0,_domain_validation__WEBPACK_IMPORTED_MODULE_8__.isUuid)(id));
            const directory = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.checked)(this.location, `database/operations/${id}`, true);
            if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(directory).length === 0 && this.ledger?.recoverUnprepared?.(id, this.authority().rootId))
                continue;
            const raw = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.decode)((0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, `database/operations/${id}/journal.json`));
            if (!raw || typeof raw !== 'object' || !('command' in raw))
                throw new Error('Unknown operation journal');
            if (raw.command !== 'workspace.publish') {
                ensure(this.authority().owner.kind === 'universe' && raw.command === 'universe.profile.save', 'Unsupported journal command.');
                continue;
            }
            const j = this.readJournal(id);
            let op = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(id);
            if (op)
                ensure(op.requestDigest === j.requestDigest && op.receiptData === (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.canonical)(j.receipt));
            const finalized = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, `database/operations/${id}/finalized.json`)), aborted = node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(this.location, `database/operations/${id}/aborted.json`));
            ensure(!(finalized && aborted));
            if (j.scope === 'coordinated') {
                ensure(this.ledger && this.ledger.id === j.coordinatorId, 'The original coordinator is unavailable.');
                this.ledger.recover(id);
                op = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(id);
            }
            if (finalized || aborted) {
                this.marker(j, finalized ? 'finalized' : 'aborted');
                ensure(finalized ? !!op && BigInt(this.authority().generation) >= BigInt(j.targetGeneration) : !op && BigInt(this.authority().generation) >= BigInt(j.expectedGeneration));
                continue;
            }
            if (j.scope === 'coordinated') {
                ensure(this.ledger && this.ledger.id === j.coordinatorId, 'The original coordinator is unavailable.');
                this.ledger.recover(id);
                continue;
            }
            if (BigInt(this.authority().generation) > BigInt(op ? j.targetGeneration : j.expectedGeneration)) {
                const wasBlocked = this.blocked;
                this.blocked = false;
                try {
                    this.snapshot();
                }
                finally {
                    this.blocked = wasBlocked;
                }
                this.marker(j, op ? 'finalized' : 'aborted');
                continue;
            }
            if (op) {
                this.publish(j, true);
                this.finalize(j);
            }
            else
                this.undo(j);
        }
        this.blocked = false;
    }
    catch (e) {
        this.blocked = true;
        throw e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure ? new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure(e.code, e.message, 'unknown') : new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('RECOVERY_REQUIRED', 'Workspace evidence is incomplete. Preserve the folder and reconcile.', 'unknown');
    } }
    commit(operationId, digest, plan, receipt, request) { const prior = this.receipt(operationId, digest); if (prior)
        return prior; try {
        const j = this.prepare(operationId, digest, plan, receipt, request);
        const adoptedRetry = j.fencingToken !== this.authority().sessionToken;
        this.publish(j, adoptedRetry);
        this.apply(j, adoptedRetry);
        this.finalize(j);
        return j.receipt;
    }
    catch {
        this.blocked = true;
        throw new _application_universe__WEBPACK_IMPORTED_MODULE_10__.UniverseFailure('RECOVERY_REQUIRED', 'The workspace save outcome needs reconciliation. Retain the original operation and edits.', 'unknown');
    } }
    /** A complete synchronous pin. No renderer path access; callers own the returned immutable bytes. */
    capture() {
        const snapshot = this.snapshot(), indexes = this.indexes(), temp = node_fs__WEBPACK_IMPORTED_MODULE_0___default().mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(node_fs__WEBPACK_IMPORTED_MODULE_0___default().realpathSync(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir()), 'writingtool-capture-')), destination = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(temp, 'catalog.sqlite');
        try {
            this.db.prepare('VACUUM main INTO ?').run(destination);
            const fd = node_fs__WEBPACK_IMPORTED_MODULE_0___default().openSync(destination, (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_RDONLY | (node_fs__WEBPACK_IMPORTED_MODULE_0___default().constants).O_NOFOLLOW);
            try {
                const stat = node_fs__WEBPACK_IMPORTED_MODULE_0___default().fstatSync(fd);
                ensure(stat.isFile() && stat.nlink === 1);
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().fsyncSync(fd);
            }
            finally {
                node_fs__WEBPACK_IMPORTED_MODULE_0___default().closeSync(fd);
            }
            ;(0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.syncDir)(node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(destination));
            const verify = new node_sqlite__WEBPACK_IMPORTED_MODULE_4__.DatabaseSync(destination, { readOnly: true });
            try {
                ensure(verify.prepare('PRAGMA quick_check').get()?.quick_check === 'ok');
                const m = verify.prepare('SELECT * FROM unit_meta WHERE singleton=1').get();
                ensure(m?.ownerId === snapshot.owner.id && m.rootId === snapshot.rootId && m.generation === snapshot.generation);
            }
            finally {
                verify.close();
            }
            const paths = new Set(['writingtool.json', ...indexes.records.map(r => r.relativePath), ...indexes.files.map(f => f.relativePath), ...indexes.assets.map(a => a.relativePath), ...indexes.versions.flatMap(v => [v.jsonPath, ...(v.manuscriptPath ? [v.manuscriptPath] : [])])]);
            this.db.prepare('SELECT relativePath FROM records').all().forEach(r => paths.add(String(r.relativePath)));
            const files = [...paths].sort().map(relativePath => { const bytes = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(this.location, relativePath); return { relativePath, base64: bytes.toString('base64'), sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(bytes) }; });
            const catalog = (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.readManaged)(temp, 'catalog.sqlite');
            files.push({ relativePath: 'database/catalog.sqlite', base64: catalog.toString('base64'), sha256: (0,_universe_files__WEBPACK_IMPORTED_MODULE_11__.hash)(catalog) });
            this.assertReady();
            ensure(this.authority().generation === snapshot.generation);
            return { snapshot, files };
        }
        finally {
            node_fs__WEBPACK_IMPORTED_MODULE_0___default().rmSync(temp, { recursive: true, force: true });
        }
    }
}


/***/ },

/***/ "node:child_process"
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
(module) {

module.exports = require("node:child_process");

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

/***/ "node:module"
/*!******************************!*\
  !*** external "node:module" ***!
  \******************************/
(module) {

module.exports = require("node:module");

/***/ },

/***/ "node:os"
/*!**************************!*\
  !*** external "node:os" ***!
  \**************************/
(module) {

module.exports = require("node:os");

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

/***/ },

/***/ "node:url"
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
(module) {

module.exports = require("node:url");

/***/ },

/***/ "worker_threads"
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
(module) {

module.exports = require("worker_threads");

/***/ },

/***/ "./node_modules/fflate/esm/index.mjs"
/*!*******************************************!*\
  !*** ./node_modules/fflate/esm/index.mjs ***!
  \*******************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncCompress: () => (/* binding */ AsyncGzip),
/* harmony export */   AsyncDecompress: () => (/* binding */ AsyncDecompress),
/* harmony export */   AsyncDeflate: () => (/* binding */ AsyncDeflate),
/* harmony export */   AsyncGunzip: () => (/* binding */ AsyncGunzip),
/* harmony export */   AsyncGzip: () => (/* binding */ AsyncGzip),
/* harmony export */   AsyncInflate: () => (/* binding */ AsyncInflate),
/* harmony export */   AsyncUnzipInflate: () => (/* binding */ AsyncUnzipInflate),
/* harmony export */   AsyncUnzlib: () => (/* binding */ AsyncUnzlib),
/* harmony export */   AsyncZipDeflate: () => (/* binding */ AsyncZipDeflate),
/* harmony export */   AsyncZlib: () => (/* binding */ AsyncZlib),
/* harmony export */   Compress: () => (/* binding */ Gzip),
/* harmony export */   DecodeUTF8: () => (/* binding */ DecodeUTF8),
/* harmony export */   Decompress: () => (/* binding */ Decompress),
/* harmony export */   Deflate: () => (/* binding */ Deflate),
/* harmony export */   EncodeUTF8: () => (/* binding */ EncodeUTF8),
/* harmony export */   FlateErrorCode: () => (/* binding */ FlateErrorCode),
/* harmony export */   Gunzip: () => (/* binding */ Gunzip),
/* harmony export */   Gzip: () => (/* binding */ Gzip),
/* harmony export */   Inflate: () => (/* binding */ Inflate),
/* harmony export */   Unzip: () => (/* binding */ Unzip),
/* harmony export */   UnzipInflate: () => (/* binding */ UnzipInflate),
/* harmony export */   UnzipPassThrough: () => (/* binding */ UnzipPassThrough),
/* harmony export */   Unzlib: () => (/* binding */ Unzlib),
/* harmony export */   Zip: () => (/* binding */ Zip),
/* harmony export */   ZipDeflate: () => (/* binding */ ZipDeflate),
/* harmony export */   ZipPassThrough: () => (/* binding */ ZipPassThrough),
/* harmony export */   Zlib: () => (/* binding */ Zlib),
/* harmony export */   compress: () => (/* binding */ gzip),
/* harmony export */   compressSync: () => (/* binding */ gzipSync),
/* harmony export */   decompress: () => (/* binding */ decompress),
/* harmony export */   decompressSync: () => (/* binding */ decompressSync),
/* harmony export */   deflate: () => (/* binding */ deflate),
/* harmony export */   deflateSync: () => (/* binding */ deflateSync),
/* harmony export */   gunzip: () => (/* binding */ gunzip),
/* harmony export */   gunzipSync: () => (/* binding */ gunzipSync),
/* harmony export */   gzip: () => (/* binding */ gzip),
/* harmony export */   gzipSync: () => (/* binding */ gzipSync),
/* harmony export */   inflate: () => (/* binding */ inflate),
/* harmony export */   inflateSync: () => (/* binding */ inflateSync),
/* harmony export */   strFromU8: () => (/* binding */ strFromU8),
/* harmony export */   strToU8: () => (/* binding */ strToU8),
/* harmony export */   unzip: () => (/* binding */ unzip),
/* harmony export */   unzipSync: () => (/* binding */ unzipSync),
/* harmony export */   unzlib: () => (/* binding */ unzlib),
/* harmony export */   unzlibSync: () => (/* binding */ unzlibSync),
/* harmony export */   zip: () => (/* binding */ zip),
/* harmony export */   zipSync: () => (/* binding */ zipSync),
/* harmony export */   zlib: () => (/* binding */ zlib),
/* harmony export */   zlibSync: () => (/* binding */ zlibSync)
/* harmony export */ });

var require = /* createRequire() */ undefined;
// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var _a;
// Mediocre shim
var Worker;
var isMarkedAsUntransferable;
var workerAdd = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";
try {
    (_a = __webpack_require__(/*! worker_threads */ "worker_threads"), Worker = _a.Worker, isMarkedAsUntransferable = _a.isMarkedAsUntransferable);
}
catch (e) {
}
var wk = Worker ? function (c, _, msg, transfer, cb) {
    var done = false;
    var w = new Worker(c + workerAdd, { eval: true })
        .on('error', function (e) { return cb(e, null); })
        .on('message', function (m) { return cb(null, m); })
        .on('exit', function (c) {
        if (c && !done)
            cb(new Error('exited with code ' + c), null);
    });
    if (isMarkedAsUntransferable)
        transfer = transfer.filter(function (t) { return !isMarkedAsUntransferable(t); });
    w.postMessage(msg, transfer);
    w.terminate = function () {
        done = true;
        return Worker.prototype.terminate.call(w);
    };
    return w;
} : function (_, __, ___, ____, cb) {
    setImmediate(function () { return cb(new Error('async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)'), null); });
    var NOP = function () { };
    return {
        terminate: NOP,
        postMessage: NOP
    };
};

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
/**
 * Codes for errors generated within this library
 */
var FlateErrorCode = {
    UnexpectedEOF: 0,
    InvalidBlockType: 1,
    InvalidLengthLiteral: 2,
    InvalidDistance: 3,
    StreamFinished: 4,
    NoStreamHandler: 5,
    InvalidHeader: 6,
    NoCallback: 7,
    InvalidUTF8: 8,
    ExtraFieldTooLong: 9,
    InvalidDate: 10,
    FilenameTooLong: 11,
    StreamFinishing: 12,
    InvalidZipData: 13,
    UnknownCompressionMethod: 14
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    , // determined by compression function
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
;
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, st, buf, dict) {
    // source length       dict length
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
        return buf || new u8(0);
    var noBuf = !buf;
    // have to estimate size
    var resize = noBuf || st.i != 2;
    // no state
    var noSt = st.i;
    // Assumes roughly 33% compression ratio average
    if (noBuf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (resize)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17
        if (resize)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (resize)
                    cbuf(bt + 131072);
                var end = bt + add;
                if (bt < dt) {
                    var shift = dl - dt, dend = Math.min(dt, end);
                    if (shift + bt < 0)
                        err(3);
                    for (; bt < dend; ++bt)
                        buf[bt] = dict[shift + bt];
                }
                for (; bt < end; ++bt)
                    buf[bt] = buf[bt - dt];
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    // don't reallocate for streams or user buffers
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return { t: new u8(tr), l: mbt };
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return { c: cl.subarray(0, cli), n: s };
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Adler32
var adler = function () {
    var a = 1, b = 0;
    return {
        p: function (d) {
            // closures have awful performance
            var n = a, m = b;
            var l = d.length | 0;
            for (var i = 0; i != l;) {
                var e = Math.min(i + 2655, l);
                for (; i < e; ++i)
                    m += n += d[i];
                n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
        },
        d: function () {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a & 0xFF00) << 8 | (b & 255) << 8 | (b >> 8);
        }
    };
};
;
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/\s+/g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return fnStr;
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
    }
    var td = mrg({}, ch[id].e);
    return wk(ch[id].c + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt]; };
var bDflt = function () { return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zls]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get opts
var gopt = function (o) { return o && {
    out: o.size && new u8(o.size),
    dictionary: o.dictionary
}; };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// auto stream
var astrm = function (strm) {
    strm.ondata = function (dat, final) { return postMessage([dat, final], [dat.buffer]); };
    return function (ev) {
        if (ev.data[0]) {
            strm.push(ev.data[0], ev.data[1]);
            postMessage([ev.data[0].length]);
        }
        else
            strm.flush(ev.data[1]);
    };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id, flush, ext) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else if (!Array.isArray(dat))
            ext(dat);
        else if (dat.length == 1) {
            strm.queuedSize -= dat[0];
            if (strm.ondrain)
                strm.ondrain(dat[0]);
        }
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.queuedSize = 0;
    strm.push = function (d, f) {
        if (!strm.ondata)
            err(5);
        if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
        strm.queuedSize += d.length;
        // can fail for cross-realm Uint8Array, but ok - only a small performance penalty
        w.postMessage([d, t = f], d.buffer instanceof ArrayBuffer ? [d.buffer] : []);
    };
    strm.terminate = function () { w.terminate(); };
    if (flush) {
        strm.flush = function (sync) { w.postMessage([0, sync]); };
    }
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
// read 8 bytes
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + (o.filename ? o.filename.length + 1 : 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (o.dictionary && 32);
    c[1] |= 31 - ((c[0] << 8) | c[1]) % 31;
    if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
    }
};
// zlib start
var zls = function (d, dict) {
    if ((d[0] & 15) != 8 || (d[0] >> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if ((d[1] >> 5 & 1) == +!dict)
        err(6, 'invalid zlib data: ' + (d[1] & 32 ? 'need' : 'unexpected') + ' dictionary');
    return (d[1] >> 3 & 4) + 2;
};
function StrmOpt(opts, cb) {
    if (typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        // Buffer length must always be 0 mod 32768 for index calculations to be correct when modifying head and prev
        // 98304 = 32768 (lookback) + 65536 (common chunk size)
        this.b = new u8(98304);
        if (this.o.dictionary) {
            var dict = this.o.dictionary.subarray(-32768);
            this.b.set(dict, 32768 - dict.length);
            this.s.i = 32768 - dict.length;
        }
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, this.s), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
            if (endLen > 2 * this.b.length - 32768) {
                var newBuf = new u8(endLen & -32768);
                newBuf.set(this.b.subarray(0, this.s.z));
                this.b = newBuf;
            }
            var split = this.b.length - this.s.z;
            this.b.set(chunk.subarray(0, split), this.s.z);
            this.s.z = this.b.length;
            this.p(this.b, false);
            this.b.set(this.b.subarray(-32768));
            this.b.set(chunk.subarray(split), 32768);
            this.s.z = chunk.length - split + 32768;
            this.s.i = 32766, this.s.w = 32768;
        }
        else {
            this.b.set(chunk, this.s.z);
            this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
            this.p(this.b, final || false);
            this.s.w = this.s.i, this.s.i -= 2;
        }
        if (final) {
            // cleanup unneeded buffers/state to reduce memory usage
            this.s = this.o = {};
            this.b = et;
        }
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * deflated output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible. A separate DEFLATE stream may be concatenated
     *             with the current output after a sync flush.
     */
    Deflate.prototype.flush = function (sync) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
        // could technically skip writing the type-0 block for (this.s.r & 7) == 0,
        // but the deterministic trailer (00 00 FF FF) is useful in some situations
        if (sync) {
            var c = new u8(6);
            c[0] = this.s.r >> 3;
            // write empty, non-final type-0 block
            var ep = wfblk(c, this.s.r, et);
            this.s.r = 0;
            this.ondata(c.subarray(0, ep >> 3), false);
        }
    };
    return Deflate;
}());

/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate = /*#__PURE__*/ (function () {
    function AsyncDeflate(opts, cb) {
        astrmify([
            bDflt,
            function () { return [astrm, Deflate]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6, 1);
    }
    return AsyncDeflate;
}());

function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    function Inflate(opts, cb) {
        // no StrmOpt here to avoid adding to workerizer
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
            this.o.set(dict);
    }
    Inflate.prototype.e = function (c) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        if (!this.p.length)
            this.p = c;
        else if (c.length) {
            var n = new u8(this.p.length + c.length);
            n.set(this.p), n.set(c, this.p.length), this.p = n;
        }
    };
    Inflate.prototype.c = function (final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, (this.s.p / 8) | 0), this.s.p &= 7;
    };
    /**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
    Inflate.prototype.push = function (chunk, final) {
        this.e(chunk), this.c(final);
    };
    return Inflate;
}());

/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate = /*#__PURE__*/ (function () {
    function AsyncInflate(opts, cb) {
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Inflate(ev.data);
            onmessage = astrm(strm);
        }, 7, 0);
    }
    return AsyncInflate;
}());

function inflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt
    ], function (ev) { return pbf(inflateSync(ev.data[0], gopt(ev.data[1]))); }, 1, cb);
}
function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip = /*#__PURE__*/ (function () {
    function Gzip(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gzip.prototype.push = function (chunk, final) {
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * GZIPped output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Gzip.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
    };
    return Gzip;
}());

/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip = /*#__PURE__*/ (function () {
    function AsyncGzip(opts, cb) {
        astrmify([
            bDflt,
            gze,
            function () { return [astrm, Deflate, Gzip]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8, 1);
    }
    return AsyncGzip;
}());

function gzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        gze,
        function () { return [gzipSync]; }
    ], function (ev) { return pbf(gzipSync(ev.data[0], ev.data[1])); }, 2, cb);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Streaming single or multi-member GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    function Gunzip(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
            var p = this.p.subarray(this.v - 1);
            var s = p.length > 3 ? gzs(p) : 4;
            if (s > p.length) {
                if (!final)
                    return;
            }
            else if (this.v > 1 && this.onmember) {
                this.onmember(this.r - p.length);
            }
            this.p = p.subarray(s), this.v = 0;
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, 0);
        // process concatenated GZIP
        if (this.s.f && !this.s.l) {
            this.v = shft(this.s.p) + 9;
            this.s = { i: 0 };
            this.o = new u8(0);
            this.push(new u8(0), final);
        }
        else if (final) {
            Inflate.prototype.c.call(this, final);
        }
    };
    return Gunzip;
}());

/**
 * Asynchronous streaming single or multi-member GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    function AsyncGunzip(opts, cb) {
        var _this = this;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gunzip(ev.data);
            strm.onmember = function (offset) { return postMessage(offset); };
            onmessage = astrm(strm);
        }, 9, 0, function (offset) { return _this.onmember && _this.onmember(offset); });
    }
    return AsyncGunzip;
}());

function gunzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        guze,
        function () { return [gunzipSync]; }
    ], function (ev) { return pbf(gunzipSync(ev.data[0], ev.data[1])); }, 3, cb);
}
function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
        err(6, 'invalid gzip data');
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
/**
 * Streaming Zlib compression
 */
var Zlib = /*#__PURE__*/ (function () {
    function Zlib(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Zlib.prototype.push = function (chunk, final) {
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * zlibbed output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Zlib.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
    };
    return Zlib;
}());

/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib = /*#__PURE__*/ (function () {
    function AsyncZlib(opts, cb) {
        astrmify([
            bDflt,
            zle,
            function () { return [astrm, Deflate, Zlib]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10, 1);
    }
    return AsyncZlib;
}());

function zlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        zle,
        function () { return [zlibSync]; }
    ], function (ev) { return pbf(zlibSync(ev.data[0], ev.data[1])); }, 4, cb);
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data, opts) {
    if (!opts)
        opts = {};
    var a = adler();
    a.p(data);
    var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    function Unzlib(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 6 && !final)
                return;
            this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
        }
        if (final) {
            if (this.p.length < 4)
                err(6, 'invalid zlib data');
            this.p = this.p.subarray(0, -4);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Unzlib;
}());

/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib = /*#__PURE__*/ (function () {
    function AsyncUnzlib(opts, cb) {
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Unzlib(ev.data);
            onmessage = astrm(strm);
        }, 11, 0);
    }
    return AsyncUnzlib;
}());

function unzlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        zule,
        function () { return [unzlibSync]; }
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gopt(ev.data[1]))); }, 5, cb);
}
function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
// Default algorithm for compression (used because having a known output size allows faster decompression)


/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    function Decompress(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
    }
    // init substream
    // overriden by AsyncDecompress
    Decompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (dat, final) {
            _this.ondata(dat, final);
        };
    };
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Decompress.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (!this.s) {
            if (this.p && this.p.length) {
                var n = new u8(this.p.length + chunk.length);
                n.set(this.p), n.set(chunk, this.p.length);
            }
            else
                this.p = chunk;
            if (this.p.length > 2) {
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(this.o)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(this.o)
                        : new this.Z(this.o);
                this.i();
                this.s.push(this.p, final);
                this.p = null;
            }
        }
        else
            this.s.push(chunk, final);
    };
    return Decompress;
}());

/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress = /*#__PURE__*/ (function () {
    function AsyncDecompress(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
    }
    AsyncDecompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (err, dat, final) {
            _this.ondata(err, dat, final);
        };
        this.s.ondrain = function (size) {
            _this.queuedSize -= size;
            if (_this.ondrain)
                _this.ondrain(size);
        };
    };
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        this.queuedSize += chunk.length;
        Decompress.prototype.push.call(this, chunk, final);
    };
    return AsyncDecompress;
}());

function decompress(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzip(data, opts, cb)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflate(data, opts, cb)
            : unzlib(data, opts, cb);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function decompressSync(data, opts) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, opts)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, opts)
            : unzlibSync(data, opts);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (ArrayBuffer.isView(val))
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return { s: r, r: slc(d, i - 1) };
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Streaming UTF-8 decoding
 */
var DecodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is decoded
     */
    function DecodeUTF8(cb) {
        this.ondata = cb;
        if (tds)
            this.t = new TextDecoder();
        else
            this.p = et;
    }
    /**
     * Pushes a chunk to be decoded from UTF-8 binary
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    DecodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        final = !!final;
        if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
                if (this.t.decode().length)
                    err(8);
                this.t = null;
            }
            return;
        }
        if (!this.p)
            err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (final) {
            if (r.length)
                err(8);
            this.p = null;
        }
        else
            this.p = r;
        this.ondata(s, final);
    };
    return DecodeUTF8;
}());

/**
 * Streaming UTF-8 encoding
 */
var EncodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is encoded
     */
    function EncodeUTF8(cb) {
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be encoded to UTF-8
     * @param chunk The string data to push
     * @param final Whether this is the last chunk
     */
    EncodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
    };
    return EncodeUTF8;
}());

/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td) {
        return td.decode(dat);
    }
    else {
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (r.length)
            err(8);
        return s;
    }
}
;
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
// read zip64 header sizes
var z64hs = function (d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
        for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
            if (b2(d, b) == 1) {
                return [
                    nsc ? b8(d, b + 4 + 8 * nsu) : sc,
                    nsu ? b8(d, b + 4) : su,
                    noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
                    1
                ];
            }
        }
        // z == 2 for unknown whether or not zip64
        if (z < 2)
            err(13);
    }
    return [sc, su, off, 0];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        // we shouldn't really do this cast, but properly handling ArrayBufferLike
        // makes the API unergonomic with Buffer
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());

// I don't extend because TypeScript extension adds 1kB of runtime bloat
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
var ZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function ZipDeflate(filename, opts) {
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
    }
    ZipDeflate.prototype.process = function (chunk, final) {
        try {
            this.d.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return ZipDeflate;
}());

/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
var AsyncZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this.ondata(err, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
    }
    AsyncZipDeflate.prototype.process = function (chunk, final) {
        this.d.push(chunk, final);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return AsyncZipDeflate;
}());

// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this = this;
        if (!this.ondata)
            err(5);
        // finishing or finished
        if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || (o && (com.length != o.length));
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
                this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this.ondata(null, chk, false);
                }
                chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
                f: f,
                u: u,
                o: o,
                t: function () {
                    if (file.terminate)
                        file.terminate();
                },
                r: function () {
                    pAll_1();
                    if (tr_1) {
                        var nxt = _this.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this.ondata(err, dat, final);
                    _this.terminate();
                }
                else {
                    cl_1 += dat.length;
                    chks_1.push(dat);
                    if (final) {
                        var dd = new u8(16);
                        wbytes(dd, 0, 0x8074B50);
                        wbytes(dd, 4, file.crc);
                        wbytes(dd, 8, cl_1);
                        wbytes(dd, 12, file.size);
                        chks_1.push(dd);
                        uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                        if (tr_1)
                            uf_1.r();
                        tr_1 = 1;
                    }
                    else if (tr_1)
                        pAll_1();
                }
            };
            this.u.push(uf_1);
        }
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this.d & 1))
                        return;
                    _this.u.splice(-1, 1);
                    _this.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());

function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cbd(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cbd(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cbd(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl(err(11, 0, 1), null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            err(11);
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (chunk, final) {
        // same as ZipPassThrough: cast to retain Buffer ergonomics
        this.ondata(null, chunk, final);
    };
    UnzipPassThrough.compression = 0;
    return UnzipPassThrough;
}());

/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
var UnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function UnzipInflate() {
        var _this = this;
        this.i = new Inflate(function (dat, final) {
            _this.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (chunk, final) {
        try {
            this.i.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    UnzipInflate.compression = 8;
    return UnzipInflate;
}());

/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
var AsyncUnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function AsyncUnzipInflate(_, sz) {
        var _this = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (chunk, final) {
        if (this.i.terminate)
            chunk = slc(chunk, 0);
        this.i.push(chunk, final);
    };
    AsyncUnzipInflate.compression = 8;
    return AsyncUnzipInflate;
}());

/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
var Unzip = /*#__PURE__*/ (function () {
    /**
     * Creates a ZIP decompression stream
     * @param cb The callback to call whenever a file in the ZIP archive is found
     */
    function Unzip(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
            0: UnzipPassThrough
        };
        this.p = et;
    }
    /**
     * Pushes a chunk to be unzipped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzip.prototype.push = function (chunk, final) {
        var _this = this;
        if (!this.onfile)
            err(5);
        if (!this.p)
            err(4);
        if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
                this.d.push(toAdd, !this.c);
            else
                this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
                return this.push(chunk, final);
        }
        else {
            var f = 0, i = 0, is = void 0, buf = void 0;
            if (!this.p.length)
                buf = chunk;
            else if (!chunk.length)
                buf = this.p;
            else {
                buf = new u8(this.p.length + chunk.length);
                buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function () {
                var sig = b4(buf, i);
                if (sig == 0x4034B50) {
                    f = 1, is = i;
                    this_1.d = null;
                    this_1.c = 0;
                    var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
                    if (l > i + 30 + fnl + es) {
                        var chks_3 = [];
                        this_1.k.unshift(chks_3);
                        f = 2;
                        var lsc = b4(buf, i + 18), lsu = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        var _a = z64hs(buf, i, es, 2, lsc, lsu, 0), sc_1 = _a[0], su_1 = _a[1], z64 = _a[3];
                        if (dd)
                            sc_1 = -1 - z64;
                        i += es;
                        this_1.c = sc_1;
                        var d_1;
                        var file_1 = {
                            name: fn_1,
                            compression: cmp_1,
                            start: function () {
                                if (!file_1.ondata)
                                    err(5);
                                if (!sc_1)
                                    file_1.ondata(null, et, true);
                                else {
                                    var ctr = _this.o[cmp_1];
                                    if (!ctr)
                                        file_1.ondata(err(14, 'unknown compression type ' + cmp_1, 1), null, false);
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                                        var dat = chks_4[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this.k[0] == chks_3 && _this.c)
                                        _this.d = d_1;
                                    else
                                        d_1.push(et, true);
                                }
                            },
                            terminate: function () {
                                if (d_1 && d_1.terminate)
                                    d_1.terminate();
                            }
                        };
                        if (sc_1 >= 0)
                            file_1.size = sc_1, file_1.originalSize = su_1;
                        this_1.onfile(file_1);
                    }
                    return "break";
                }
                else if (oc) {
                    if (sig == 0x8074B50) {
                        is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                        return "break";
                    }
                    else if (sig == 0x2014B50) {
                        is = i -= 4, f = 3, this_1.c = 0;
                        return "break";
                    }
                }
            };
            var this_1 = this;
            for (; i < l - 4; ++i) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            this.p = et;
            if (oc < 0) {
                var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
                if (add)
                    add.push(dat, !!f);
                else
                    this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
                return this.push(buf.subarray(i), final);
            this.p = buf.subarray(i);
        }
        if (final) {
            if (this.c)
                err(13);
            this.p = null;
        }
    };
    /**
     * Registers a decoder with the stream, allowing for files compressed with
     * the compression type provided to be expanded correctly
     * @param decoder The decoder constructor
     */
    Unzip.prototype.register = function (decoder) {
        this.o[decoder.compression] = decoder;
    };
    return Unzip;
}());

var mt = typeof queueMicrotask == 'function' ? queueMicrotask : typeof setTimeout == 'function' ? setTimeout : function (fn) { fn(); };
function unzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var files = {};
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
        }
    }
    ;
    var lft = b2(data, e + 8);
    if (lft) {
        var c = lft;
        var o = b4(data, e + 16);
        var z = b4(data, e - 20) == 0x7064B50;
        if (z) {
            var ze = b4(data, e - 12);
            z = b4(data, ze) == 0x6064B50;
            if (z) {
                c = lft = b4(data, ze + 32);
                o = b4(data, ze + 48);
            }
        }
        var fltr = opts && opts.filter;
        var _loop_3 = function (i) {
            var _a = zh(data, o, z), c_1 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
            o = no;
            var cbl = function (e, d) {
                if (e) {
                    tAll();
                    cbd(e, null);
                }
                else {
                    if (d)
                        files[fn] = d;
                    if (!--lft)
                        cbd(null, files);
                }
            };
            if (!fltr || fltr({
                name: fn,
                size: sc,
                originalSize: su,
                compression: c_1
            })) {
                if (!c_1)
                    cbl(null, slc(data, b, b + sc));
                else if (c_1 == 8) {
                    var infl = data.subarray(b, b + sc);
                    // Synchronously decompress under 512KB, or barely-compressed data
                    if (su < 524288 || sc > 0.8 * su) {
                        try {
                            cbl(null, inflateSync(infl, { out: new u8(su) }));
                        }
                        catch (e) {
                            cbl(e, null);
                        }
                    }
                    else
                        term.push(inflate(infl, { size: su }, cbl));
                }
                else
                    cbl(err(14, 'unknown compression type ' + c_1, 1), null);
            }
            else
                cbl(null, null);
        };
        for (var i = 0; i < c; ++i) {
            _loop_3(i);
        }
    }
    else
        cbd(null, {});
    return tAll;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @param opts The ZIP extraction options
 * @returns The decompressed files
 */
function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 0x7064B50;
    if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 0x6064B50;
        if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
        }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
        })) {
            if (!c_2)
                files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
                files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}


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
/* harmony import */ var _infrastructure_confined_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../infrastructure/confined-fs */ "./src/infrastructure/confined-fs.ts");
/* harmony import */ var _application_protection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application/protection */ "./src/application/protection.ts");
/* harmony import */ var _infrastructure_protection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../infrastructure/protection-service */ "./src/infrastructure/protection-service.ts");
/* harmony import */ var _application_contracts_protection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../application/contracts/protection */ "./src/application/contracts/protection.ts");
/* harmony import */ var _infrastructure_archives__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../infrastructure/archives */ "./src/infrastructure/archives.ts");
/* harmony import */ var _application_workspace__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../application/workspace */ "./src/application/workspace.ts");
/* harmony import */ var _infrastructure_workspace_coordinator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../infrastructure/workspace-coordinator */ "./src/infrastructure/workspace-coordinator.ts");
/* harmony import */ var _infrastructure_settings_storage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../infrastructure/settings-storage */ "./src/infrastructure/settings-storage.ts");
/* harmony import */ var _application_contracts_workspace__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../application/contracts/workspace */ "./src/application/contracts/workspace.ts");
/* harmony import */ var _domain_workspace__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../domain/workspace */ "./src/domain/workspace.ts");
/* harmony import */ var _infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../infrastructure/universe-files */ "./src/infrastructure/universe-files.ts");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! node:crypto */ "node:crypto");
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _application_project__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../application/project */ "./src/application/project.ts");
/* harmony import */ var _infrastructure_project_storage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../infrastructure/project-storage */ "./src/infrastructure/project-storage.ts");
/* harmony import */ var _application_contracts_project__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../application/contracts/project */ "./src/application/contracts/project.ts");
/* harmony import */ var _application_universe__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../application/universe */ "./src/application/universe.ts");
/* harmony import */ var _infrastructure_universe_storage__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../infrastructure/universe-storage */ "./src/infrastructure/universe-storage.ts");
/* harmony import */ var _application_contracts_universe__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../application/contracts/universe */ "./src/application/contracts/universe.ts");
/* harmony import */ var _application_readiness__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../application/readiness */ "./src/application/readiness.ts");
/* harmony import */ var _application_contracts_readiness__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../application/contracts/readiness */ "./src/application/contracts/readiness.ts");




















const userData = process.argv.find(arg => arg.startsWith('--user-data='))?.slice('--user-data='.length);
if (!userData)
    throw new Error('Application host requires its native user-data location');
const nativeModule = process.argv.find(arg => arg.startsWith('--writingtool-native-module='))?.slice('--writingtool-native-module='.length);
if (!nativeModule)
    throw new Error('Application host requires its trusted native module location');
(0,_infrastructure_confined_fs__WEBPACK_IMPORTED_MODULE_0__.configureConfinedFs)(nativeModule);
const coordinator = new _infrastructure_workspace_coordinator__WEBPACK_IMPORTED_MODULE_6__.WorkspaceCoordinator(userData);
const settings = new _infrastructure_settings_storage__WEBPACK_IMPORTED_MODULE_7__.SettingsStorage(userData, fn => coordinator.settingsGate(fn));
const universes = new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseApplication(new _infrastructure_universe_storage__WEBPACK_IMPORTED_MODULE_16__.FileUniverseStorage(undefined, coordinator));
const projects = new _application_project__WEBPACK_IMPORTED_MODULE_12__.ProjectApplication(new _infrastructure_project_storage__WEBPACK_IMPORTED_MODULE_13__.FileProjectStorage(coordinator), universes);
const workspace = new _application_workspace__WEBPACK_IMPORTED_MODULE_5__.WorkspaceApplication(projects, universes, coordinator, { uuid: node_crypto__WEBPACK_IMPORTED_MODULE_11__.randomUUID, digest: value => (0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash)((0,_infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_10__.canonical)(value)), textDigest: _infrastructure_universe_files__WEBPACK_IMPORTED_MODULE_10__.hash, byteLength: text => Buffer.byteLength(text).toString() });
const protectionService = new _infrastructure_protection_service__WEBPACK_IMPORTED_MODULE_2__.ProtectionService(workspace, settings, userData, coordinator, locations => { if (locations.project)
    projects.open(locations.project, locations.universe);
else
    universes.open(locations.universe); });
const protection = new _application_protection__WEBPACK_IMPORTED_MODULE_1__.ProtectionApplication(protectionService);
const port = process.parentPort;
if (!port)
    throw new Error('Application host requires a parent port');
setInterval(() => { for (const progress of protectionService.progress())
    port.postMessage({ kind: 'protection.progress', ...progress }); }, 150);
const fault = process.argv.find(arg => arg.startsWith('--diagnostic-fault='))?.split('=')[1];
if (fault === 'exit')
    process.exit(1);
port.on('message', ({ data }) => {
    if ((0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_3__.validProtectionRequest)(data, true)) {
        const base = { protocolVersion: 1, requestId: data.requestId, command: data.command };
        void protection.execute(data).then(value => port.postMessage({ ...base, status: 'ok', value })).catch(error => port.postMessage(error instanceof _infrastructure_archives__WEBPACK_IMPORTED_MODULE_4__.OperationCanceled ? { ...base, status: 'canceled' } : { ...base, status: 'error', message: error instanceof Error ? error.message : 'Protection operation failed.', outcome: (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_3__.protectionHasDurableEffects)(data) && error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure && error.outcome !== 'not-committed' ? 'unknown' : 'not-committed', operationId: (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_3__.protectionHasDurableEffects)(data) && error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure && error.outcome !== 'not-committed' ? (0,_application_contracts_protection__WEBPACK_IMPORTED_MODULE_3__.protectionOperationId)(data) : null }));
        return;
    }
    if (protection.busy) {
        if (typeof data === 'object' && data && 'requestId' in data && 'command' in data)
            port.postMessage({ protocolVersion: 1, requestId: data.requestId, command: data.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'Wait for the protection operation to finish.', outcome: 'not-committed', retry: 'new-request', issues: [] });
        return;
    }
    if ((0,_application_contracts_workspace__WEBPACK_IMPORTED_MODULE_8__.validWorkspaceRequest)(data, true)) {
        const base = { protocolVersion: 1, requestId: data.requestId, command: data.command };
        let result;
        let mutationApplied = false;
        try {
            let receipt = null;
            let values = null;
            let asset = null;
            let destination = null, warnings = [];
            switch (data.command) {
                case 'workspace.query': break;
                case 'workspace.mutate':
                    receipt = workspace.mutate(data.input);
                    break;
                case 'workspace.reconcile':
                    receipt = workspace.reconcile(data.operationId) ?? null;
                    break;
                case 'workspace.asset.import':
                    if (!data.nativeAsset)
                        throw new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', 'Choose a readable supported image.');
                    ({ receipt, asset } = workspace.importAsset(data.owner, data.operationId, data.expectedUnitGeneration, data.nativeAsset));
                    break;
                case 'workspace.asset.read':
                    asset = workspace.readAsset(data.owner, data.assetId);
                    break;
                case 'settings.get':
                case 'settings.export':
                    values = settings.get();
                    break;
                case 'settings.save':
                    values = settings.save(data.values, data.expectedRecordVersion);
                    break;
                case 'settings.import': {
                    const imported = settings.import(data.nativeSettings);
                    values = imported.settings;
                    warnings = imported.warnings;
                    break;
                }
                case 'settings.select-backup': {
                    if (!data.nativeDestination)
                        throw new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', 'Choose a backup folder.');
                    const current = settings.get();
                    values = settings.save({ ...current, backupDestination: data.nativeDestination }, current.recordVersion);
                    destination = data.nativeDestination;
                    break;
                }
            }
            mutationApplied = receipt !== null;
            result = { ...base, status: 'ok', snapshot: data.command.startsWith('settings.') ? { project: null, universe: null } : workspace.snapshot(), receipt, settings: values, warnings, asset, destination };
        }
        catch (e) {
            let f = e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure ? e : e instanceof _domain_workspace__WEBPACK_IMPORTED_MODULE_9__.WorkspaceValidationError ? new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', e.message) : new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('IO_FAILURE', e instanceof Error ? e.message : 'The workspace operation failed.', data.command === 'workspace.mutate' || data.command === 'workspace.asset.import' ? 'unknown' : 'not-committed');
            if (mutationApplied)
                f = new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure(f.code, f.message, 'unknown');
            result = { ...base, status: 'error', code: f.code, message: f.message, outcome: f.outcome, retry: f.outcome === 'unknown' ? 'after-recovery' : 'new-request', issues: e instanceof _domain_workspace__WEBPACK_IMPORTED_MODULE_9__.WorkspaceValidationError ? [{ field: e.field, message: e.message }] : [] };
        }
        port.postMessage(result);
        return;
    }
    if ((0,_application_contracts_project__WEBPACK_IMPORTED_MODULE_14__.validProjectRequest)(data, true)) {
        const base = { protocolVersion: 1, requestId: data.requestId, command: data.command };
        let result;
        try {
            switch (data.command) {
                case 'project.create':
                    result = { ...base, status: 'ok', ...projects.create(data.basePath, data.universePath, data.input) };
                    break;
                case 'project.open':
                    result = { ...base, status: 'ok', snapshot: projects.open(data.basePath, data.universePath, data.expectedCreationOperationId) };
                    break;
                case 'project.current':
                    result = { ...base, status: 'ok', snapshot: projects.current() };
                    break;
                case 'project.close':
                    projects.close();
                    result = { ...base, status: 'ok', snapshot: null };
                    break;
            }
        }
        catch (e) {
            if (e instanceof _application_project__WEBPACK_IMPORTED_MODULE_12__.LocateProjectUniverse)
                result = { ...base, status: 'locate', universeId: e.universeId };
            else {
                const f = e instanceof _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure ? e : new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('IO_FAILURE', 'The project operation failed. Existing content was preserved.', data.command === 'project.create' ? 'unknown' : 'not-committed');
                result = { ...base, status: 'error', code: f.code, message: f.message, outcome: f.outcome, retry: f.outcome === 'unknown' ? 'after-recovery' : 'new-request' };
            }
        }
        port.postMessage(result);
        return;
    }
    if ((0,_application_contracts_universe__WEBPACK_IMPORTED_MODULE_17__.validUniverseRequest)(data, true)) {
        const base = { protocolVersion: 1, requestId: data.requestId, command: data.command };
        let result;
        try {
            switch (data.command) {
                case 'universe.create':
                    if (projects.associatedUniverseId())
                        throw new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', 'Close the active project before changing its universe.');
                    result = { ...base, status: 'ok', ...universes.create(data.basePath, data.input) };
                    break;
                case 'universe.open': {
                    const associatedId = projects.associatedUniverseId();
                    if (associatedId && !(data.reconcileExpected && 'ownerId' in data.reconcileExpected.identity && data.reconcileExpected.identity.ownerId === associatedId))
                        throw new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', 'Close the active project before changing its universe.');
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
                    if (projects.associatedUniverseId())
                        throw new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('VALIDATION', 'Close the active project before closing its universe.');
                    universes.close();
                    result = { ...base, status: 'ok', snapshot: null };
                    break;
            }
        }
        catch (error) {
            const failure = error instanceof _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure ? error : new _application_universe__WEBPACK_IMPORTED_MODULE_15__.UniverseFailure('IO_FAILURE', 'The universe operation failed. Existing content was preserved.', data.command === 'universe.create' || data.command === 'universe.profile.save' ? 'unknown' : 'not-committed');
            result = { ...base, status: 'error', code: failure.code, message: failure.message, outcome: failure.outcome, retry: failure.outcome === 'unknown' ? 'after-recovery' : 'new-request' };
        }
        port.postMessage(result);
        return;
    }
    if (!(0,_application_contracts_readiness__WEBPACK_IMPORTED_MODULE_19__.validRequest)(data))
        return;
    if (fault === 'timeout')
        return;
    if (fault === 'invalid') {
        port.postMessage({ ...(0,_application_readiness__WEBPACK_IMPORTED_MODULE_18__.readiness)(data), extra: true });
        return;
    }
    port.postMessage((0,_application_readiness__WEBPACK_IMPORTED_MODULE_18__.readiness)(data));
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=utility-host.cjs.map