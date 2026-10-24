import {WorkspaceStore, type WorkspaceDecisionLedger} from './workspace-storage';
import {validWorkspaceReceipt} from '../application/contracts/workspace';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { type CreateInput, type SaveInput, type SaveReceipt, type UniverseSnapshot, type ReconciliationExpectation, closed, isUuid, isGeneration, validReceipt, validUniverseRequest } from '../application/contracts/universe';
import { UniverseFailure, type UniverseStorage, type UniverseStore } from '../application/universe';
import { profileData, validEnvelope, type ProfileEnvelope } from '../domain/universe';
import { CATALOG_DDL, LEASE_DDL } from './universe-ddl';
import { canonical, checked, decode, hash, jsonBytes, readManaged, replaceManaged, syncDir, writeExclusive, publishMarker, preserveMarker } from './universe-files';
type Meta = {
    ownerId: string;
    rootId: string;
    generation: string;
    sessionToken: string;
    creationOperationId: string;
    creationDigest: string;
    creationState: string;
    schemaVersion: number;
};
type RecordRow = {
    id: string;
    rootId: string;
    recordType: string;
    relativePath: string;
    recordVersion: string;
    sha256: string;
};
type Operation = {
    operationId: string;
    requestDigest: string;
    generation: string;
    resultDigest: string;
    receiptData: string;
};
type Descriptor = {
    schemaVersion: 1;
    kind: 'universe';
    id: string;
    rootId: string;
    creationOperationId: string;
};
type Journal = {
    schemaVersion: 1;
    scope: 'single-unit';
    command: 'universe.profile.save';
    ownerId: string;
    rootId: string;
    operationId: string;
    request: SaveInput;
    requestDigest: string;
    expectedGeneration: string;
    targetGeneration: string;
    fencingToken: string;
    before: string;
    after: string;
    beforeHash: string;
    afterHash: string;
    beforeLength: string;
    afterLength: string;
    expectedRecordVersion: string;
    beforeRecord: RecordRow;
    afterRecord: RecordRow;
    receipt: SaveReceipt;
};
export type Boundary = 'creation-reserved' | 'creation-schema' | 'creation-files' | 'creation-commit' | 'journal' | 'file' | 'commit' | 'finalized' | 'undo' | 'redo' | 'marker-staged';
export type FaultHook = (boundary: Boundary) => void;
const requireValid = (condition: unknown, message = 'Universe integrity validation failed.'): void => {
    if (!condition)
        throw new UniverseFailure('INTEGRITY_MISMATCH', message);
};
export function transaction(db: DatabaseSync, fn: () => void): void {
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
function configure(db: DatabaseSync): void {
    db.exec('PRAGMA busy_timeout=0; PRAGMA foreign_keys=ON; PRAGMA journal_mode=DELETE; PRAGMA synchronous=EXTRA;');
    requireValid(db.prepare('PRAGMA journal_mode').get()?.journal_mode === 'delete' && db.prepare('PRAGMA synchronous').get()?.synchronous === 3 && db.prepare('PRAGMA foreign_keys').get()?.foreign_keys === 1, 'Required SQLite durability settings are unavailable.');
}
function supported(db: DatabaseSync, applicationId = 1465140300): void {
    if (db.prepare('PRAGMA user_version').get()?.user_version !== 1 || db.prepare('PRAGMA application_id').get()?.application_id !== applicationId)
        throw new UniverseFailure('UNSUPPORTED_VERSION', 'This universe database version is unsupported.');
    requireValid(db.prepare('PRAGMA quick_check').get()?.quick_check === 'ok', 'The universe database is corrupt.');
}
export function connect(p: string, create = false, applicationId = 1465140300): DatabaseSync {
    if (!create) {
        // Read format/version from the fixed SQLite header before a writable
        // connection can recover a hot journal. A read-only SQL probe itself
        // cannot recover SQLite after a process dies mid-transaction.
        const fd = fs.openSync(p, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
        const header = Buffer.alloc(100);
        try {
            requireValid(fs.readSync(fd, header, 0, 100, 0) === 100 && header.subarray(0, 16).toString('ascii') === 'SQLite format 3\0', 'The SQLite header is invalid.');
        }
        finally {
            fs.closeSync(fd);
        }
        if (header.readUInt32BE(60) !== 1 || header.readUInt32BE(68) !== applicationId || header[18] !== 1 || header[19] !== 1)
            throw new UniverseFailure('UNSUPPORTED_VERSION', 'This universe database format is unsupported.');
        // SQLite owns only the derived rollback sidecar. Never follow a linked
        // journal or interpret a foreign WAL as this rollback-only format.
        for (const suffix of ['-journal', '-wal', '-shm']) {
            const sidecar = p + suffix;
            let stat: fs.Stats;
            try {
                stat = fs.lstatSync(sidecar);
            }
            catch (error) {
                if ((error as NodeJS.ErrnoException).code === 'ENOENT')
                    continue;
                throw error;
            }
            requireValid(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1, 'The SQLite recovery sidecar is aliased.');
            requireValid(suffix === '-journal', 'Unsupported SQLite recovery sidecar.');
        }
    }
    const db = new DatabaseSync(p);
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
function descriptor(root: string): Descriptor {
    const d = decode(readManaged(root, 'writingtool.json'));
    if (typeof d === 'object' && d !== null && 'schemaVersion' in d && d.schemaVersion !== 1)
        throw new UniverseFailure('UNSUPPORTED_VERSION', 'This universe descriptor version is unsupported.');
    requireValid(closed(d, ['schemaVersion', 'kind', 'id', 'rootId', 'creationOperationId']) && d.schemaVersion === 1 && d.kind === 'universe' && isUuid(d.id) && isUuid(d.rootId) && isUuid(d.creationOperationId));
    return d as Descriptor;
}
function validateExpectedDescriptor(d: Descriptor, expected: ReconciliationExpectation): void {
    const identity = expected.identity;
    const matches = 'ownerId' in identity ? d.id === identity.ownerId && d.rootId === identity.rootId : d.creationOperationId === identity.creationOperationId;
    if (!matches)
        throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the owning universe of the original pending operation.', 'unknown');
}
const saveDigest = (input: SaveInput): string => hash(canonical({ protocolVersion: 1, command: 'universe.profile.save', owner: { kind: 'universe', id: input.ownerId }, expectedUnitGeneration: input.expectedUnitGeneration, expectedRecordVersions: { [input.ownerId]: input.expectedRecordVersion }, submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
const createDigest = (input: CreateInput): string => hash(canonical({ protocolVersion: 1, command: 'universe.create', submittedEditorRevision: input.submittedEditorRevision, payload: input.data }));
function receipt(operationId: string, id: string, generation: string, version: string, revision: string): SaveReceipt {
    return { protocolVersion: 1, operationId, owner: { kind: 'universe', id }, unitGeneration: generation, recordId: id, recordVersion: version, submittedEditorRevision: revision };
}
function storeReceipt(db: DatabaseSync, r: SaveReceipt, digest: string): void {
    const bytes = canonical(r);
    db.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(r.operationId, digest, r.unitGeneration, hash(bytes), bytes);
}
function validRecord(v: unknown): v is RecordRow {
    return closed(v, ['id', 'rootId', 'recordType', 'relativePath', 'recordVersion', 'sha256']) && isUuid(v.id) && isUuid(v.rootId) && v.recordType === 'universe-profile' && v.relativePath === `profiles/${v.id}.json` && isUuid(v.recordVersion) && typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256);
}
export class FileUniverseStorage implements UniverseStorage {
    constructor(private fault?: FaultHook, private coordinator?: WorkspaceDecisionLedger) {
    }
    identity(basePath: string): {ownerId: string; rootId: string} {
        const d = descriptor(this.physicalPath(basePath));
        return {ownerId: d.id, rootId: d.rootId};
    }
    physicalPath(basePath: string): string {
        const root = fs.realpathSync(basePath);
        requireValid(fs.statSync(root).isDirectory(), 'Select an existing directory.');
        return root;
    }
    create(basePath: string, input: CreateInput): {
        store: UniverseStore;
        receipt: SaveReceipt;
    } {
        let data;
        try {
            data = profileData(input.data);
        }
        catch (e) {
            throw new UniverseFailure('VALIDATION', String((e as Error).message));
        }
        let root: string;
        try {
            root = this.physicalPath(basePath);
            if (fs.readdirSync(root).length)
                throw new UniverseFailure('VALIDATION', 'Choose an empty folder. Existing content was preserved.');
        }
        catch (error) {
            if (error instanceof UniverseFailure)
                throw error;
            throw new UniverseFailure('IO_FAILURE', 'The folder could not be inspected before creation. No creation was started.', 'not-committed');
        }
        const id = randomUUID(), rootId = randomUUID(), version = randomUUID(), digest = createDigest(input);
        const envelope: ProfileEnvelope = { schemaVersion: 1, recordType: 'universe-profile', id, owner: { kind: 'universe', id }, universeId: id, recordVersion: version, data };
        const d: Descriptor = { schemaVersion: 1, kind: 'universe', id, rootId, creationOperationId: input.operationId };
        let db: DatabaseSync | undefined, lease: DatabaseSync | undefined, store:FileUniverseStore|undefined;
        let reserved = false;
        try {
            writeExclusive(path.join(root, '.writingtool-creation.json'), jsonBytes({ schemaVersion: 1, operationId: input.operationId, ownerId: id, rootId, requestDigest: digest, profile: envelope }), () => {
                reserved = true;
            });
            this.fault?.('creation-reserved');
            for (const p of ['database', 'profiles', 'images', 'database/operations']) {
                fs.mkdirSync(path.join(root, p), { mode: 0o700 });
                syncDir(path.dirname(path.join(root, p)));
            }
            for (const p of ['database/catalog.sqlite', 'database/lease.sqlite'])
                writeExclusive(path.join(root, p), '');
            lease = connect(path.join(root, 'database/lease.sqlite'), true);
            lease.exec(LEASE_DDL);
            lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(id, rootId);
            lease.exec('BEGIN EXCLUSIVE');
            db = connect(path.join(root, 'database/catalog.sqlite'), true);
            db.exec(CATALOG_DDL);
            const session = randomUUID();
            transaction(db, () => {
                db!.prepare('INSERT INTO unit_meta VALUES(1,1,?,?,?,?,?,?,?)').run(id, rootId, '0', session, input.operationId, digest, 'preparing');
                db!.prepare('INSERT INTO root_locations VALUES(?,?,?,?,?)').run(rootId, 'universe', id, root, randomUUID());
            });
            this.fault?.('creation-schema');
            const bytes = jsonBytes(envelope);
            writeExclusive(path.join(root, `profiles/${id}.json`), bytes);
            writeExclusive(path.join(root, 'writingtool.json'), jsonBytes(d));
            this.fault?.('creation-files');
            const r = receipt(input.operationId, id, '1', version, input.submittedEditorRevision);
            transaction(db, () => {
                db!.prepare('INSERT INTO records VALUES(?,?,?,?,?,?)').run(id, rootId, 'universe-profile', `profiles/${id}.json`, version, hash(bytes));
                db!.prepare("UPDATE unit_meta SET generation='1',creationState='complete'").run();
                storeReceipt(db!, r, digest);
            });
            syncDir(path.join(root, 'database'));
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
                throw new UniverseFailure('IO_FAILURE', 'The empty folder could not be reserved. No creation was started; your edits remain unsaved.', 'not-committed');
            if (e instanceof UniverseFailure)
                throw new UniverseFailure(e.code, e.message, 'unknown');
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Creation could not finish. The selected folder and recovery evidence were preserved.', 'unknown');
        }
    }
    open(basePath: string, expected?: ReconciliationExpectation): UniverseStore {
        const root = this.physicalPath(basePath);
        let db: DatabaseSync | undefined, lease: DatabaseSync | undefined, store:FileUniverseStore|undefined;
        try {
            const d = descriptor(root);
            if (expected)
                validateExpectedDescriptor(d, expected);
            checked(root, 'images', true);
            checked(root, 'profiles', true);
            checked(root, 'database/operations', true);
            const leasePath = checked(root, 'database/lease.sqlite');
            const catalogPath = checked(root, 'database/catalog.sqlite');
            try {
                lease = connect(leasePath);
            }
            catch (e) {
                if (String(e).includes('locked') || String(e).includes('busy'))
                    throw new UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
                throw e;
            }
            try {
                lease.exec('BEGIN EXCLUSIVE');
            }
            catch {
                throw new UniverseFailure('LEASE_UNAVAILABLE', 'Another application owns this universe. Close it there and try again.');
            }
            requireValid(closed(lease.prepare('SELECT * FROM lease_identity').get(), ['singleton', 'schemaVersion', 'ownerId', 'rootId']) && lease.prepare('SELECT * FROM lease_identity').get()?.ownerId === d.id && lease.prepare('SELECT * FROM lease_identity').get()?.rootId === d.rootId && lease.prepare('SELECT * FROM lease_identity').get()?.schemaVersion === 1);
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
            if (e instanceof UniverseFailure)
                throw e;
            throw new UniverseFailure('RECOVERY_REQUIRED', 'The folder is missing, invalid, inaccessible or requires recovery. Its bytes were preserved.', 'unknown');
        }
    }
}
class FileUniverseStore implements UniverseStore {
    readonly workspace: WorkspaceStore;
    private failed = false;
    private released = false;
    private databaseClosed = false;
    private releaseStarted = false;
    private rootIdentity: {
        ino: number;
        dev: number;
    };
    private identities: Array<{
        relative: string;
        ino: number;
        dev: number;
    }>;
    constructor(readonly location: string, private db: DatabaseSync, private lease: DatabaseSync, private d: Descriptor, private session?: string, private fault?: FaultHook, coordinator?: WorkspaceDecisionLedger) {
        this.rootIdentity = fs.statSync(location);
        this.identities = ['database/catalog.sqlite', 'database/lease.sqlite'].map(relative => ({ relative, ...fs.statSync(checked(location, relative)) }));
        this.workspace = new WorkspaceStore(location, db, () => {const m=this.meta();return {owner:{kind:'universe',id:m.ownerId},rootId:m.rootId,universeId:m.ownerId,generation:m.generation,sessionToken:m.sessionToken};}, () => this.health(), coordinator);
    }
    private meta(): Meta {
        const m = this.db.prepare('SELECT * FROM unit_meta').get() as unknown as Meta;
        requireValid(m && m.schemaVersion === 1 && m.ownerId === this.d.id && m.rootId === this.d.rootId && isGeneration(m.generation) && isUuid(m.sessionToken) && m.creationState === 'complete' && m.creationOperationId === this.d.creationOperationId, 'Creation is incomplete or identity is inconsistent.');
        return m;
    }
    private record(): RecordRow {
        const rows = this.db.prepare('SELECT * FROM records').all();
        requireValid(rows.length === 1 && validRecord(rows[0]));
        return rows[0] as unknown as RecordRow;
    }
    private health(): void {
        const physical = fs.statSync(this.location);
        requireValid(fs.realpathSync(this.location) === this.location && physical.ino === this.rootIdentity.ino && physical.dev === this.rootIdentity.dev, 'Physical root changed.');
        for (const identity of this.identities) {
            const current = fs.statSync(checked(this.location, identity.relative));
            requireValid(current.ino === identity.ino && current.dev === identity.dev, 'Authority file identity changed.');
        }
        requireValid(this.lease.isTransaction, 'Writer ownership was lost.');
        const i = this.lease.prepare('SELECT * FROM lease_identity').get();
        requireValid(i?.ownerId === this.d.id && i?.rootId === this.d.rootId && i?.schemaVersion === 1);
        const d = descriptor(this.location);
        requireValid(canonical(d) === canonical(this.d), 'Root identity changed.');
        checked(this.location, 'database/lease.sqlite');
        checked(this.location, 'database/catalog.sqlite');
        if (this.session)
            requireValid(this.meta().sessionToken === this.session, 'Writer fencing token is stale.');
    }
    mintSession(): void {
        this.health();
        const token = randomUUID();
        transaction(this.db, () => {
            this.db.prepare('UPDATE unit_meta SET sessionToken=? WHERE singleton=1').run(token);
        });
        this.session = token;
    }
    snapshot(): UniverseSnapshot {return this.readSnapshot().identity;}
    readSnapshot(): ReturnType<UniverseStore['readSnapshot']> {
        if (this.released)
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Reopen the relocated universe to reacquire its verified authority.', 'unknown');
        if (this.failed)
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Reopen this universe to reconcile the interrupted operation.', 'unknown');
        this.health();
        const workspace=this.workspace.snapshot();
        const m = this.meta(), r = this.record();
        requireValid(r.id === m.ownerId && r.rootId === m.rootId);
        const bytes = readManaged(this.location, r.relativePath), p = decode(bytes);
        requireValid(validEnvelope(p) && p.id === m.ownerId && p.recordVersion === r.recordVersion && hash(bytes) === r.sha256, 'Profile bytes and catalog do not agree.');
        const creation = this.operation(m.creationOperationId);
        requireValid(creation && creation.requestDigest === m.creationDigest && creation.generation === '1', 'Creation decision is missing.');
        const operations = this.db.prepare('SELECT operationId FROM committed_operations').all().map(row => this.operation(String(row.operationId))!).sort((a, b) => BigInt(a.generation) < BigInt(b.generation) ? -1 : 1);
        requireValid(operations.every((op, index) => op.generation === (BigInt(index) + 1n).toString()) && operations.at(-1)?.generation === m.generation, 'The catalog generation has no complete decision history.');
        const profileReceipts = operations.map(op => decode(Buffer.from(op.receiptData))).filter(validReceipt);
        requireValid(profileReceipts.at(-1)?.recordVersion === r.recordVersion, 'The current profile version has no matching receipt.');
        return {workspace,identity:{ ownerId: m.ownerId, rootId: m.rootId, generation: m.generation, recordVersion: r.recordVersion, profile: (p as ProfileEnvelope).data, location: this.location }};
    }
    checkBinding(): void {
        const m = this.meta();
        const rows = this.db.prepare('SELECT * FROM root_locations').all();
        const row = rows[0];
        requireValid(rows.length === 1 && row.rootId === m.rootId && row.ownerKind === 'universe' && row.ownerId === m.ownerId && typeof row.basePath === 'string' && path.isAbsolute(row.basePath) && isUuid(row.bindingVersion));
        if (row.basePath === this.location)
            return;
        let original: string | undefined;
        try {
            original = fs.realpathSync(String(row.basePath));
        }
        catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'ENOENT')
                throw e;
        }
        if (original && original !== this.location) {
            const stat = fs.statSync(original);
            if (!stat.isDirectory())
                return; // A regular file cannot be the former owning folder.
            const entries = fs.readdirSync(original);
            if (!entries.some(name => ['writingtool.json', '.writingtool-creation.json', 'database'].includes(name)))
                return;
            // Missing/corrupt discovery beside authority evidence is uncertain.
            const prior = descriptor(original);
            if (prior.id === this.d.id || prior.rootId === this.d.rootId)
                throw new UniverseFailure('INTEGRITY_MISMATCH', 'The original universe folder still exists. This copy cannot become a second authority.');
        }
    }
    rebind(): void {
        this.checkBinding();
        const m = this.meta();
        const row = this.db.prepare('SELECT * FROM root_locations').get()!;
        if (row.basePath === this.location)
            return;
        transaction(this.db, () => {
            const result = this.db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=? AND bindingVersion=?').run(this.location, randomUUID(), m.rootId, String(row.bindingVersion));
            requireValid(result.changes === 1);
        });
    }
    private operation(id: string): Operation | undefined {
        const row = this.db.prepare('SELECT * FROM committed_operations WHERE operationId=?').get(id) as unknown as Operation | undefined;
        if (row) {
            requireValid(isUuid(row.operationId) && isGeneration(row.generation) && /^[a-f0-9]{64}$/.test(row.requestDigest));
            const r = decode(Buffer.from(row.receiptData));
            requireValid(hash(row.receiptData) === row.resultDigest && (validReceipt(r) && r.operationId === id && r.owner.id === this.d.id && r.unitGeneration === row.generation || validWorkspaceReceipt(r) && r.operationId === id && r.units.some(u => u.owner.kind === 'universe' && u.owner.id === this.d.id && u.unitGeneration === row.generation)));
        }
        return row;
    }
    prepareRelocatedReopen(basePath: string, expected: ReconciliationExpectation): void {
        if (this.released || basePath === this.location)
            return;
        const stat = fs.statSync(basePath);
        if (stat.ino !== this.rootIdentity.ino || stat.dev !== this.rootIdentity.dev)
            return;
        validateExpectedDescriptor(descriptor(basePath), expected);
        this.validateExpected(expected);
        for (const identity of this.identities) {
            const current = fs.statSync(checked(basePath, identity.relative));
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
    validateExpected(expected: ReconciliationExpectation): void {
        validateExpectedDescriptor(this.d, expected);
        const mutation = expected.mutation;
        const op = this.operation(mutation.input.operationId);
        const digest = mutation.command === 'universe.create' ? createDigest(mutation.input) : saveDigest(mutation.input);
        if (op && op.requestDigest !== digest)
            throw new UniverseFailure('OPERATION_CONFLICT', 'The selected unit does not contain the original operation payload.', 'unknown');
    }
    reconcile(operationId: string, expected?: ReconciliationExpectation): SaveReceipt | undefined {
        if (expected)
            this.validateExpected(expected);
        this.snapshot();
        const op = this.operation(operationId);
        return op ? decode(Buffer.from(op.receiptData)) as SaveReceipt : undefined;
    }
    save(input: SaveInput): SaveReceipt {
        const digest = saveDigest(input);
        this.snapshot();
        const prior = this.operation(input.operationId);
        if (prior) {
            if (prior.requestDigest !== digest)
                throw new UniverseFailure('OPERATION_CONFLICT', 'This operation ID was already used for different content.');
            return decode(Buffer.from(prior.receiptData)) as SaveReceipt;
        }
        let data;
        try {
            data = profileData(input.data);
        }
        catch (e) {
            throw new UniverseFailure('VALIDATION', (e as Error).message);
        }
        const m = this.meta(), beforeRecord = this.record();
        if (input.ownerId !== m.ownerId || input.expectedUnitGeneration !== m.generation || input.expectedRecordVersion !== beforeRecord.recordVersion)
            throw new UniverseFailure('GENERATION_CONFLICT', 'The saved universe changed. Reopen it before saving again.');
        const existingWork = path.join(this.location, 'database/operations', input.operationId);
        if (fs.existsSync(existingWork)) {
            const priorJournal = decode(readManaged(this.location, `database/operations/${input.operationId}/journal.json`));
            this.validateJournal(priorJournal, input.operationId);
            const j = priorJournal as Journal;
            if (j.requestDigest !== digest)
                throw new UniverseFailure('OPERATION_CONFLICT', 'The operation journal belongs to different content.');
            // A definitively aborted operation can retry its original immutable plan.
            // The new authority adopts only the operational fence; content IDs stay fixed.
            const aborted = `database/operations/${input.operationId}/aborted.json`;
            checked(this.location, aborted);
            requireValid(j.expectedGeneration === m.generation && canonical(j.beforeRecord) === canonical(beforeRecord));
            // Do not rewrite journal bytes: the current fence is checked separately on retry.
            fs.unlinkSync(path.join(this.location, aborted));
            syncDir(existingWork);
            return this.publishRetry(j);
        }
        const before = readManaged(this.location, beforeRecord.relativePath).toString('utf8');
        const envelope = decode(Buffer.from(before)) as ProfileEnvelope;
        const afterEnvelope: ProfileEnvelope = { ...envelope, data, recordVersion: randomUUID() };
        const after = jsonBytes(afterEnvelope);
        const target = (BigInt(m.generation) + 1n).toString(), r = receipt(input.operationId, m.ownerId, target, afterEnvelope.recordVersion, input.submittedEditorRevision);
        const afterRecord = { ...beforeRecord, recordVersion: afterEnvelope.recordVersion, sha256: hash(after) };
        const journal: Journal = { schemaVersion: 1, scope: 'single-unit', command: 'universe.profile.save', ownerId: m.ownerId, rootId: m.rootId, operationId: input.operationId, request: input, requestDigest: digest, expectedGeneration: m.generation, targetGeneration: target, fencingToken: m.sessionToken, before, after, beforeHash: hash(before), afterHash: hash(after), beforeLength: Buffer.byteLength(before).toString(), afterLength: Buffer.byteLength(after).toString(), expectedRecordVersion: beforeRecord.recordVersion, beforeRecord, afterRecord, receipt: r };
        try {
            this.health();
            const work = path.join(checked(this.location, 'database/operations', true), input.operationId);
            fs.mkdirSync(work, { mode: 0o700 });
            syncDir(path.dirname(work));
            writeExclusive(path.join(work, 'journal.json'), jsonBytes(journal));
            this.fault?.('journal');
            this.expect(journal);
            replaceManaged(this.location, beforeRecord.relativePath, after);
            this.fault?.('file');
            transaction(this.db, () => {
                this.expect(journal);
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(afterRecord.recordVersion, afterRecord.sha256, m.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(target);
                storeReceipt(this.db, r, digest);
            });
            this.fault?.('commit');
            this.verifyJournalState(journal, true);
            publishMarker(this.location, `database/operations/${input.operationId}/finalized.json`, jsonBytes({ schemaVersion: 1, operationId: input.operationId, requestDigest: digest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            this.snapshot();
            return r;
        }
        catch {
            this.failed = true;
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Save outcome requires reconciliation. Keep the submitted edits and reopen this universe.', 'unknown');
        }
    }
    private publishRetry(j: Journal): SaveReceipt {
        try {
            this.health();
            const expected = () => {
                this.health();
                requireValid(this.meta().generation === j.expectedGeneration && canonical(this.record()) === canonical(j.beforeRecord));
            };
            expected();
            replaceManaged(this.location, j.beforeRecord.relativePath, j.after);
            this.fault?.('file');
            transaction(this.db, () => {
                expected();
                this.db.prepare('UPDATE records SET recordVersion=?,sha256=? WHERE id=?').run(j.afterRecord.recordVersion, j.afterRecord.sha256, j.ownerId);
                this.db.prepare('UPDATE unit_meta SET generation=? WHERE singleton=1').run(j.targetGeneration);
                storeReceipt(this.db, j.receipt, j.requestDigest);
            });
            this.fault?.('commit');
            this.verifyJournalState(j, true);
            publishMarker(this.location, `database/operations/${j.operationId}/finalized.json`, jsonBytes({ schemaVersion: 1, operationId: j.operationId, requestDigest: j.requestDigest }), () => this.fault?.('marker-staged'));
            this.fault?.('finalized');
            return j.receipt;
        }
        catch {
            this.failed = true;
            throw new UniverseFailure('RECOVERY_REQUIRED', 'The retried save needs reconciliation.', 'unknown');
        }
    }
    private expect(j: Journal): void {
        this.health();
        const m = this.meta(), r = this.record();
        if (m.generation !== j.expectedGeneration || m.sessionToken !== j.fencingToken || r.recordVersion !== j.expectedRecordVersion || canonical(r) !== canonical(j.beforeRecord))
            throw new UniverseFailure('GENERATION_CONFLICT', 'The publication expectations changed.');
    }
    private verifyJournalState(j: Journal, committed: boolean): void {
        const r = this.record();
        requireValid(canonical(r) === canonical(committed ? j.afterRecord : j.beforeRecord) && hash(readManaged(this.location, r.relativePath)) === (committed ? j.afterHash : j.beforeHash));
    }
    recover(): void {
        try {
            this.health();
            this.workspace.recover();
            const m = this.meta();
            for (const opId of fs.readdirSync(checked(this.location, 'database/operations', true)).sort()) {
                requireValid(isUuid(opId), 'Unknown operation workspace.');
                const rel = `database/operations/${opId}`;
                checked(this.location, rel, true);
                const j = decode(readManaged(this.location, `${rel}/journal.json`));
                if (typeof j === 'object' && j !== null && 'command' in j && j.command === 'workspace.publish') continue;
                this.validateJournal(j, opId);
                const journal = j as Journal;
                const op = this.operation(opId);
                if (op)
                    requireValid(op.requestDigest === journal.requestDigest && op.receiptData === canonical(journal.receipt), 'Operation evidence conflicts.');
                const markerNames = ['finalized', 'aborted'] as const;
                const validMarkers = new Set<string>();
                for (const name of markerNames) {
                    const markerRel = `${rel}/${name}.json`;
                    if (!fs.existsSync(path.join(this.location, markerRel)))
                        continue;
                    let marker: unknown;
                    try {
                        marker = decode(readManaged(this.location, markerRel));
                    }
                    catch {
                        preserveMarker(this.location, markerRel);
                        continue;
                    }
                    if (!closed(marker, ['schemaVersion', 'operationId', 'requestDigest'])) {
                        preserveMarker(this.location, markerRel);
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
                    publishMarker(this.location, `${rel}/${op ? 'finalized' : 'aborted'}.json`, jsonBytes({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }));
                    continue;
                }
                const committed = !!op;
                requireValid(m.generation === (committed ? journal.targetGeneration : journal.expectedGeneration), 'Unexplained publication generation.');
                const liveHash = hash(readManaged(this.location, journal.beforeRecord.relativePath));
                requireValid(liveHash === journal.beforeHash || liveHash === journal.afterHash, 'Unexpected profile bytes were preserved.');
                requireValid(canonical(this.record()) === canonical(committed ? journal.afterRecord : journal.beforeRecord));
                replaceManaged(this.location, journal.beforeRecord.relativePath, committed ? journal.after : journal.before);
                this.fault?.(committed ? 'redo' : 'undo');
                this.verifyJournalState(journal, committed);
                publishMarker(this.location, `${rel}/${committed ? 'finalized' : 'aborted'}.json`, jsonBytes({ schemaVersion: 1, operationId: opId, requestDigest: journal.requestDigest }), () => this.fault?.('marker-staged'));
            }
            this.failed = false;
        }
        catch (e) {
            this.failed = true;
            if (e instanceof UniverseFailure)
                throw new UniverseFailure(e.code, e.message, 'unknown');
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Publication evidence is incomplete or corrupt. The folder was preserved.', 'unknown');
        }
    }
    private validateJournal(value: unknown, opId: string): void {
        requireValid(closed(value, ['schemaVersion', 'scope', 'command', 'ownerId', 'rootId', 'operationId', 'request', 'requestDigest', 'expectedGeneration', 'targetGeneration', 'fencingToken', 'before', 'after', 'beforeHash', 'afterHash', 'beforeLength', 'afterLength', 'expectedRecordVersion', 'beforeRecord', 'afterRecord', 'receipt']));
        const j = value as Journal;
        requireValid(j.schemaVersion === 1 && j.scope === 'single-unit' && j.command === 'universe.profile.save');
        requireValid(j.ownerId === this.d.id && j.rootId === this.d.rootId && j.operationId === opId && isUuid(j.fencingToken));
        requireValid(isGeneration(j.expectedGeneration) && isGeneration(j.targetGeneration));
        requireValid(BigInt(j.targetGeneration) === BigInt(j.expectedGeneration) + 1n);
        requireValid(typeof j.before === 'string' && typeof j.after === 'string');
        requireValid(validUniverseRequest({ protocolVersion: 1, requestId: opId, command: j.command, input: j.request }));
        requireValid(j.request.operationId === opId && j.request.ownerId === j.ownerId);
        requireValid(j.request.expectedUnitGeneration === j.expectedGeneration && j.request.expectedRecordVersion === j.expectedRecordVersion);
        requireValid(saveDigest(j.request) === j.requestDigest);
        requireValid(hash(j.before) === j.beforeHash && hash(j.after) === j.afterHash);
        requireValid(Buffer.byteLength(j.before).toString() === j.beforeLength && Buffer.byteLength(j.after).toString() === j.afterLength);
        requireValid(validRecord(j.beforeRecord) && validRecord(j.afterRecord));
        const before = decode(Buffer.from(j.before)), after = decode(Buffer.from(j.after));
        requireValid(validEnvelope(before) && validEnvelope(after));
        const beforeEnvelope = before as ProfileEnvelope, afterEnvelope = after as ProfileEnvelope;
        requireValid(beforeEnvelope.id === j.ownerId && afterEnvelope.id === j.ownerId);
        requireValid(beforeEnvelope.recordVersion === j.expectedRecordVersion && j.beforeRecord.recordVersion === beforeEnvelope.recordVersion);
        requireValid(j.afterRecord.recordVersion === afterEnvelope.recordVersion);
        requireValid(j.beforeRecord.sha256 === j.beforeHash && j.afterRecord.sha256 === j.afterHash);
        requireValid(j.beforeRecord.id === j.ownerId && j.afterRecord.id === j.ownerId);
        requireValid(j.beforeRecord.rootId === j.rootId && j.afterRecord.rootId === j.rootId);
        requireValid(canonical(afterEnvelope.data) === canonical(profileData(j.request.data)));
        requireValid(validReceipt(j.receipt));
        requireValid(canonical(j.receipt) === canonical(receipt(opId, j.ownerId, j.targetGeneration, afterEnvelope.recordVersion, j.request.submittedEditorRevision)));
    }
    close(): void {
        if (this.released)
            return;
        if (!this.releaseStarted) {
            if (this.failed) this.recover();
            this.snapshot();
            this.releaseStarted = true;
        }
        if (!this.databaseClosed) { this.workspace.detach(); this.db.close(); this.databaseClosed = true; }
        if (this.lease.isTransaction)
            this.lease.exec('ROLLBACK');
        this.lease.close();
        this.released = true;
    }
}
