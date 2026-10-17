import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { FileUniverseStorage, type Boundary } from '../src/infrastructure/universe-storage';
import { UniverseApplication } from '../src/application/universe';
import { canonical, decode, hash, readManaged, replaceManaged, writeExclusive } from '../src/infrastructure/universe-files';
import { type CreateInput, type SaveInput, validUniverseRequest, validUniverseResult } from '../src/application/contracts/universe';
import { UniverseHostClient } from '../src/desktop/universe-host-client';
const temporary: string[] = [];
const folder = () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'writingtool-universe-'));
    temporary.push(root);
    return root;
};
const createInput = (): CreateInput => ({ operationId: randomUUID(), submittedEditorRevision: '1', data: { name: '  The Reach  ', description: '' } });
const saveInput = (s: {
    ownerId: string;
    generation: string;
    recordVersion: string;
}, name = 'Changed'): SaveInput => ({ operationId: randomUUID(), ownerId: s.ownerId, expectedUnitGeneration: s.generation, expectedRecordVersion: s.recordVersion, submittedEditorRevision: '2', data: { name, description: 'Exact\r\n detail 🌌' } });
const worker = (command: string, root: string, payload: unknown = {}, boundary = '') => spawnSync(process.execPath, ['--import', 'tsx', 'tests/universe-worker.ts', command, root, JSON.stringify(payload), boundary], { encoding: 'utf8' });
process.on('exit', () => {
    for (const root of temporary)
        fs.rmSync(root, { recursive: true, force: true });
});
test('persist profile JSON, catalog, exact receipts and reopen without a calendar', () => {
    const root = folder(), storage = new FileUniverseStorage(), input = createInput();
    const { store, receipt } = storage.create(root, input), first = store.snapshot();
    assert.equal(first.profile.name, 'The Reach');
    assert.equal(first.profile.description, '');
    assert.equal(receipt.unitGeneration, '1');
    const save = saveInput(first);
    const result = store.save(save);
    assert.deepEqual(store.save(save), result);
    assert.throws(() => store.save({ ...save, data: { ...save.data, name: 'Different' } }), /different content/);
    assert.throws(() => store.save({ ...save, operationId: randomUUID() }), /changed/);
    const second = store.snapshot();
    assert.equal(second.profile.description, save.data.description);
    store.close();
    const reopened = storage.open(root);
    assert.deepEqual(reopened.snapshot(), second);
    assert.equal(reopened.snapshot().profile.description, save.data.description);
    assert.deepEqual(reopened.save(save), result);
    reopened.close();
    const db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'), { readOnly: true });
    const row = db.prepare('SELECT * FROM records').get()!;
    assert.equal(row.sha256, hash(fs.readFileSync(path.join(root, String(row.relativePath)))));
    assert.deepEqual(db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(r => r.name), ['committed_operations', 'records', 'root_locations', 'unit_meta']);
    db.close();
});
test('validation, unrelated content, invalid candidate preserve previous activation and bytes', () => {
    const app = new UniverseApplication(new FileUniverseStorage()), root = folder();
    app.create(root, createInput());
    const before = app.current();
    assert.throws(() => app.create(folder(), { ...createInput(), data: { name: ' \t ', description: '' } }), /name/);
    const other = folder();
    fs.writeFileSync(path.join(other, 'precious.txt'), 'preserve');
    assert.throws(() => app.create(other, createInput()), /empty/);
    assert.equal(fs.readFileSync(path.join(other, 'precious.txt'), 'utf8'), 'preserve');
    assert.throws(() => app.open(other));
    assert.deepEqual(app.current(), before);
    app.close();
});
test('duplicate JSON keys, malformed unicode, BOM and invalid UTF8 are rejected before decoding', () => {
    for (const bytes of [Buffer.from('{"a":1,"a":2}'), Buffer.from('{"a":{"x":1,"\\u0078":2}}'), Buffer.from('"\\ud800"'), Buffer.from([0xef, 0xbb, 0xbf, 0x7b, 0x7d]), Buffer.from([0xff])])
        assert.throws(() => decode(bytes));
    assert.deepEqual(decode(Buffer.from('{"a":[{},true,null,1.2]}')), { a: [{}, true, null, 1.2] });
});
test('folder relocation updates only root binding, rejects a copied live original', () => {
    const storage = new FileUniverseStorage(), root = folder();
    const { store } = storage.create(root, createInput());
    const original = store.snapshot();
    store.close();
    const dbPath = path.join(root, 'database/catalog.sqlite');
    let db = new DatabaseSync(dbPath);
    const records = canonical(db.prepare('SELECT * FROM records').all());
    const meta = db.prepare('SELECT generation FROM unit_meta').get();
    const binding = db.prepare('SELECT * FROM root_locations').get()!;
    db.close();
    const copy = folder();
    fs.cpSync(root, copy, { recursive: true });
    assert.throws(() => storage.open(copy), /original/);
    const moved = root + '-moved';
    temporary.push(moved);
    fs.renameSync(root, moved);
    const reopened = storage.open(moved);
    const after = reopened.snapshot();
    assert.equal(after.ownerId, original.ownerId);
    assert.equal(after.rootId, original.rootId);
    assert.equal(after.recordVersion, original.recordVersion);
    assert.deepEqual(after.profile, original.profile);
    reopened.close();
    db = new DatabaseSync(path.join(moved, 'database/catalog.sqlite'));
    assert.equal(canonical(db.prepare('SELECT * FROM records').all()), records);
    assert.deepEqual(db.prepare('SELECT generation FROM unit_meta').get(), meta);
    const newBinding = db.prepare('SELECT * FROM root_locations').get()!;
    assert.equal(newBinding.basePath, moved);
    assert.notEqual(newBinding.bindingVersion, binding.bindingVersion);
    db.close();
});
test('unsupported catalog and profile corruption do not initialize replacement authority', () => {
    const storage = new FileUniverseStorage();
    const root = folder();
    const { store } = storage.create(root, createInput());
    const first = store.snapshot();
    store.close();
    let db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
    db.exec('PRAGMA user_version=2');
    db.close();
    const before = fs.readFileSync(path.join(root, 'database/catalog.sqlite'));
    assert.throws(() => storage.open(root), /unsupported/);
    assert.deepEqual(fs.readFileSync(path.join(root, 'database/catalog.sqlite')), before);
    db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
    db.exec('PRAGMA user_version=1');
    db.close();
    const profile = path.join(root, `profiles/${first.ownerId}.json`);
    fs.writeFileSync(profile, '{"foreign":"content"}');
    assert.throws(() => storage.open(root), /agree/);
    assert.equal(fs.readFileSync(profile, 'utf8'), '{"foreign":"content"}');
});
test('actual competing process cannot acquire the authoritative process lease', () => {
    const root = folder(), storage = new FileUniverseStorage();
    const { store } = storage.create(root, createInput());
    const competing = worker('open', root);
    assert.notEqual(competing.status, 0);
    assert.match(competing.stderr, /owns/);
    store.close();
    const available = worker('open', root);
    assert.equal(available.status, 0, available.stderr);
});
for (const boundary of ['creation-reserved', 'creation-schema', 'creation-files', 'creation-commit'] as Boundary[])
    test(`creation process death at ${boundary} never activates partial authority`, () => {
        const root = folder();
        const run = worker('create', root, createInput(), boundary);
        assert.equal(run.status, 23, run.stderr);
        const storage = new FileUniverseStorage();
        if (boundary === 'creation-commit') {
            const store = storage.open(root);
            assert.equal(store.snapshot().generation, '1');
            store.close();
        }
        else {
            assert.throws(() => storage.open(root));
            assert.ok(fs.existsSync(path.join(root, '.writingtool-creation.json')));
        }
    });
for (const boundary of ['journal', 'file', 'commit', 'finalized'] as Boundary[])
    test(`save process death at ${boundary} yields verified old/new and supports idempotent retry`, () => {
        const root = folder(), storage = new FileUniverseStorage();
        const { store } = storage.create(root, createInput());
        const before = store.snapshot(), input = saveInput(before);
        store.close();
        const run = worker('save', root, input, boundary);
        assert.equal(run.status, 23, run.stderr);
        const reopened = storage.open(root);
        assert.equal(reopened.snapshot().generation, boundary === 'journal' || boundary === 'file' ? '1' : '2');
        const r = reopened.save(input);
        assert.equal(r.unitGeneration, '2');
        assert.deepEqual(reopened.save(input), r);
        const newer = saveInput(reopened.snapshot(), 'Newest');
        reopened.save(newer);
        reopened.close();
        const again = storage.open(root);
        assert.equal(again.snapshot().profile.name, 'Newest');
        assert.deepEqual(again.save(input), r);
        assert.equal(again.snapshot().profile.name, 'Newest');
        again.close();
    });
test('unknown live bytes or missing staged journal preserve bytes and block activation', () => {
    const root = folder(), storage = new FileUniverseStorage();
    const { store } = storage.create(root, createInput());
    const before = store.snapshot(), input = saveInput(before);
    store.close();
    assert.equal(worker('save', root, input, 'file').status, 23);
    const profile = path.join(root, `profiles/${before.ownerId}.json`);
    fs.writeFileSync(profile, 'foreign bytes');
    assert.throws(() => storage.open(root), /Unexpected/);
    assert.equal(fs.readFileSync(profile, 'utf8'), 'foreign bytes');
});
test('lost lease inode and stale session fence stop writes before profile replacement', () => {
    for (const mode of ['inode', 'fence']) {
        const root = folder(), storage = new FileUniverseStorage();
        const { store } = storage.create(root, createInput());
        const before = store.snapshot();
        const bytes = fs.readFileSync(path.join(root, `profiles/${before.ownerId}.json`));
        const dbBefore = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
        const originalFence = dbBefore.prepare('SELECT sessionToken FROM unit_meta').get()!.sessionToken;
        dbBefore.close();
        if (mode === 'fence') {
            const db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
            db.prepare('UPDATE unit_meta SET sessionToken=?').run(randomUUID());
            db.close();
        }
        else {
            fs.renameSync(path.join(root, 'database/lease.sqlite'), path.join(root, 'database/old-lease.sqlite'));
            fs.copyFileSync(path.join(root, 'database/old-lease.sqlite'), path.join(root, 'database/lease.sqlite'));
        }
        assert.throws(() => store.save(saveInput(before)));
        assert.deepEqual(fs.readFileSync(path.join(root, `profiles/${before.ownerId}.json`)), bytes);
        if (mode === 'fence') {
            const db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
            db.prepare('UPDATE unit_meta SET sessionToken=?').run(String(originalFence));
            db.close();
        }
        else {
            fs.unlinkSync(path.join(root, 'database/lease.sqlite'));
            fs.renameSync(path.join(root, 'database/old-lease.sqlite'), path.join(root, 'database/lease.sqlite'));
        }
        store.close();
    }
});
test('closed universe transport rejects path authority, wrong correlations and unknown keys', () => {
    const request = { protocolVersion: 1 as const, requestId: randomUUID(), command: 'universe.create' as const, input: createInput() };
    assert.ok(validUniverseRequest(request));
    assert.equal(validUniverseRequest({ ...request, input: { ...request.input, data: { name: '\ud800', description: '\udc00' } } }), false);
    for (const bad of [{ ...request, basePath: '/tmp' }, { ...request, command: 'filesystem.read' }, { ...request, input: { ...request.input, extra: 1 } }, { ...request, protocolVersion: 2 }])
        assert.equal(validUniverseRequest(bad), false);
    assert.equal(validUniverseResult({ protocolVersion: 1, requestId: randomUUID(), command: request.command, status: 'canceled' }, request), false);
});
test('mutation timeout is unknown and late valid response does not poison later requests', async () => {
    const client = new UniverseHostClient({ postMessage() {
        } }, 5);
    const request = { protocolVersion: 1 as const, requestId: randomUUID(), command: 'universe.create' as const, input: createInput(), basePath: '/tmp/private' };
    const result = await client.request(request);
    assert.equal(result.status, 'error');
    if (result.status === 'error')
        assert.equal(result.outcome, 'unknown');
    client.receive({ protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'canceled' });
    const next = { ...request, requestId: randomUUID(), input: createInput() };
    const waiting = client.request(next);
    client.receive({ protocolVersion: 1, requestId: next.requestId, command: next.command, status: 'canceled' });
    assert.equal((await waiting).status, 'canceled');
});
for (const [saveBoundary, recoveryBoundary] of [['file', 'undo'], ['commit', 'redo']] as const)
    test(`interrupted ${recoveryBoundary} repeats from immutable evidence`, () => {
        const root = folder(), storage = new FileUniverseStorage();
        const { store } = storage.create(root, createInput());
        const input = saveInput(store.snapshot());
        store.close();
        assert.equal(worker('save', root, input, saveBoundary).status, 23);
        assert.equal(worker('recover', root, {}, recoveryBoundary).status, 23);
        const recovered = storage.open(root);
        assert.equal(recovered.snapshot().generation, recoveryBoundary === 'undo' ? '1' : '2');
        recovered.close();
    });
test('missing journal, symbolic paths and hardlink aliases block activation preserving evidence', () => {
    const storage = new FileUniverseStorage();
    for (const fault of ['missing-journal', 'symlink', 'hardlink']) {
        const root = folder();
        const { store } = storage.create(root, createInput());
        const first = store.snapshot(), input = saveInput(first);
        store.close();
        const profile = path.join(root, `profiles/${first.ownerId}.json`), expected = fs.readFileSync(profile);
        if (fault === 'missing-journal') {
            assert.equal(worker('save', root, input, 'journal').status, 23);
            fs.unlinkSync(path.join(root, 'database/operations', input.operationId, 'journal.json'));
        }
        else if (fault === 'symlink') {
            fs.renameSync(profile, profile + '.original');
            fs.symlinkSync(profile + '.original', profile);
        }
        else
            fs.linkSync(profile, profile + '.alias');
        assert.throws(() => storage.open(root));
        assert.deepEqual(fs.readFileSync(profile), expected);
    }
});
test('permission-denied roots never activate or replace content', { skip: process.platform === 'win32' || process.getuid?.() === 0 }, () => {
    const storage = new FileUniverseStorage(), empty = folder();
    fs.chmodSync(empty, 0o500);
    try {
        assert.throws(() => storage.create(empty, createInput()));
        assert.deepEqual(fs.readdirSync(empty), []);
    }
    finally {
        fs.chmodSync(empty, 0o700);
    }
    const root = folder();
    const { store } = storage.create(root, createInput());
    store.close();
    const catalog = path.join(root, 'database/catalog.sqlite'), before = fs.readFileSync(catalog);
    fs.chmodSync(catalog, 0o400);
    try {
        assert.throws(() => storage.open(root));
        assert.deepEqual(fs.readFileSync(catalog), before);
    }
    finally {
        fs.chmodSync(catalog, 0o600);
    }
});
test('command-specific success validation cannot turn malformed acknowledgment into a save', () => {
    const root = folder(), { store } = new FileUniverseStorage().create(root, createInput());
    const snapshot = store.snapshot(), input = saveInput(snapshot), request = { protocolVersion: 1 as const, requestId: randomUUID(), command: 'universe.profile.save' as const, input };
    const receipt = store.save(input), current = store.snapshot();
    store.close();
    const success = { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'ok', snapshot: current, receipt };
    assert.ok(validUniverseResult(success, request));
    for (const bad of [{ ...success, snapshot: null }, { ...success, receipt: undefined }, { ...success, receipt: { ...receipt, operationId: randomUUID() } }, { ...success, receipt: { ...receipt, submittedEditorRevision: '99' } }, { ...success, status: 'canceled' }])
        assert.equal(validUniverseResult(bad, request), false);
    const close = { requestId: randomUUID(), command: 'universe.close' as const };
    assert.equal(validUniverseResult({ ...success, requestId: close.requestId, command: close.command }, close), false);
    const open = { requestId: randomUUID(), command: 'universe.open' as const, reconcileOperationId: input.operationId };
    assert.ok(validUniverseResult({ ...success, requestId: open.requestId, command: open.command, reconciliation: { operationId: input.operationId, outcome: 'committed' } }, open));
    assert.equal(validUniverseResult({ ...success, requestId: open.requestId, command: open.command }, open), false);
});
test('supported SQLite hot journal recovers before application activation', () => {
    const root = folder(), storage = new FileUniverseStorage();
    const { store } = storage.create(root, createInput());
    const before = store.snapshot();
    store.close();
    assert.equal(worker('catalog-crash', root).status, 24);
    assert.ok(fs.existsSync(path.join(root, 'database/catalog.sqlite-journal')));
    const reopened = storage.open(root);
    assert.deepEqual(reopened.snapshot(), before);
    reopened.close();
});
test('known commands rejected before dispatch are not committed; original pending operations stay unknown', async () => {
    const request = { protocolVersion: 1 as const, requestId: randomUUID(), command: 'universe.create' as const, input: createInput(), basePath: folder() };
    const unavailable = await new UniverseHostClient(undefined).request(request);
    assert.equal(unavailable.status, 'error');
    if (unavailable.status === 'error') {
        assert.equal(unavailable.outcome, 'not-committed');
        assert.equal(unavailable.retry, 'new-request');
    }
    assert.deepEqual(fs.readdirSync(request.basePath), []);
    let posted = 0;
    const client = new UniverseHostClient({ postMessage() {
            posted++;
        } }, 5, 1);
    const pending = client.request(request);
    const capacity = await client.request({ ...request, requestId: randomUUID(), input: createInput() });
    if (capacity.status === 'error')
        assert.equal(capacity.outcome, 'not-committed');
    else
        assert.fail('Expected capacity rejection');
    const duplicate = await client.request({ ...request, requestId: randomUUID() });
    if (duplicate.status === 'error')
        assert.equal(duplicate.outcome, 'unknown');
    else
        assert.fail('Expected duplicate uncertainty');
    const timedOut = await pending;
    if (timedOut.status === 'error')
        assert.equal(timedOut.outcome, 'unknown');
    else
        assert.fail('Expected sent timeout');
    client.fail();
    const retried = await client.request({ ...request, requestId: randomUUID() });
    if (retried.status === 'error')
        assert.equal(retried.outcome, 'unknown');
    else
        assert.fail('Original operation must remain unknown');
    assert.equal(posted, 1);
});
test('creation reservation failure is known not committed; a later partial creation remains unknown', { skip: process.getuid?.() === 0 }, () => {
    const missing = folder();
    fs.rmdirSync(missing);
    assert.throws(() => new FileUniverseStorage().create(missing, createInput()), error => (error as {
        outcome: string;
    }).outcome === 'not-committed');
    const root = folder();
    fs.chmodSync(root, 0o500);
    try {
        assert.throws(() => new FileUniverseStorage().create(root, createInput()), error => (error as {
            outcome: string;
        }).outcome === 'not-committed');
        assert.deepEqual(fs.readdirSync(root), []);
    }
    finally {
        fs.chmodSync(root, 0o700);
    }
    const partial = folder();
    assert.throws(() => new FileUniverseStorage(point => {
        if (point === 'creation-reserved')
            throw new Error('interrupted');
    }).create(partial, createInput()), error => (error as {
        outcome: string;
    }).outcome === 'unknown');
    assert.ok(fs.existsSync(path.join(partial, '.writingtool-creation.json')));
});
test('torn finalized/aborted markers recover from journal and decision without replaying older generations', () => {
    for (const kind of ['finalized', 'aborted', 'later']) {
        const root = folder(), storage = new FileUniverseStorage();
        const { store } = storage.create(root, createInput());
        const input = saveInput(store.snapshot());
        if (kind === 'aborted') {
            store.close();
            assert.equal(worker('save', root, input, 'file').status, 23);
        }
        else {
            store.save(input);
            if (kind === 'later')
                store.save(saveInput(store.snapshot(), 'Newest survives'));
            store.close();
        }
        const name = kind === 'aborted' ? 'aborted' : 'finalized';
        const workspace = path.join(root, 'database/operations', input.operationId);
        fs.writeFileSync(path.join(workspace, `${name}.json`), '{"schemaVersion":');
        const reopened = storage.open(root);
        assert.equal(reopened.snapshot().generation, kind === 'aborted' ? '1' : kind === 'later' ? '3' : '2');
        if (kind === 'later')
            assert.equal(reopened.snapshot().profile.name, 'Newest survives');
        assert.ok(fs.readdirSync(workspace).some(entry => entry.startsWith(`${name}.json.damaged-`)));
        reopened.close();
    }
    const root = folder(), storage = new FileUniverseStorage();
    const { store } = storage.create(root, createInput());
    const input = saveInput(store.snapshot());
    store.close();
    assert.equal(worker('save', root, input, 'marker-staged').status, 23);
    const recovered = storage.open(root);
    assert.equal(recovered.snapshot().generation, '2');
    recovered.close();
});
test('reused former root path allows relocation while preserving exact content rows and bytes', () => {
    for (const replacement of ['empty', 'other-universe']) {
        const root = folder(), moved = root + '-moved';
        temporary.push(moved);
        const storage = new FileUniverseStorage(), { store } = storage.create(root, createInput());
        const before = store.snapshot();
        store.close();
        const bytes = fs.readFileSync(path.join(root, `profiles/${before.ownerId}.json`));
        const db = new DatabaseSync(path.join(root, 'database/catalog.sqlite'));
        const rows = canonical(db.prepare('SELECT * FROM records').all());
        db.close();
        fs.renameSync(root, moved);
        fs.mkdirSync(root);
        if (replacement === 'other-universe')
            storage.create(root, createInput()).store.close();
        const reopened = storage.open(moved);
        assert.equal(reopened.snapshot().ownerId, before.ownerId);
        assert.equal(reopened.snapshot().rootId, before.rootId);
        reopened.close();
        assert.deepEqual(fs.readFileSync(path.join(moved, `profiles/${before.ownerId}.json`)), bytes);
        const afterDb = new DatabaseSync(path.join(moved, 'database/catalog.sqlite'));
        assert.equal(canonical(afterDb.prepare('SELECT * FROM records').all()), rows);
        afterDb.close();
    }
});
test('directory retarget during actual read/write/replace cannot touch or return an unrelated sentinel', () => {
    for (const operation of ['read', 'exclusive', 'replace']) {
        const root = folder(), outside = folder();
        fs.mkdirSync(path.join(root, 'profiles'));
        const relative = 'profiles/value.json', file = path.join(root, relative), sentinel = path.join(outside, 'value.json');
        fs.writeFileSync(file, 'OWNED');
        fs.writeFileSync(sentinel, 'UNRELATED SENTINEL');
        const originalOpen = fs.openSync;
        let swapped = false;
        fs.openSync = ((p: fs.PathLike, ...args: unknown[]) => {
            const value = String(p);
            const trigger = value.startsWith('/proc/self/fd/') && (operation === 'replace' ? value.includes('/.publish-') : value.endsWith(operation === 'exclusive' ? '/new.json' : '/value.json'));
            if (!swapped && trigger) {
                swapped = true;
                fs.renameSync(path.join(root, 'profiles'), path.join(root, 'held'));
                fs.symlinkSync(outside, path.join(root, 'profiles'));
            }
            return Reflect.apply(originalOpen, fs, [p, ...args]);
        }) as typeof fs.openSync;
        try {
            if (operation === 'read')
                assert.equal(readManaged(root, relative).toString(), 'OWNED');
            else if (operation === 'exclusive')
                writeExclusive(path.join(root, 'profiles/new.json'), 'NEW');
            else
                replaceManaged(root, relative, 'REPLACED');
            assert.ok(swapped);
            assert.equal(fs.readFileSync(sentinel, 'utf8'), 'UNRELATED SENTINEL');
            assert.deepEqual(fs.readdirSync(outside), ['value.json']);
        }
        finally {
            fs.openSync = originalOpen;
            if (swapped) {
                fs.unlinkSync(path.join(root, 'profiles'));
                fs.renameSync(path.join(root, 'held'), path.join(root, 'profiles'));
            }
        }
    }
});
test('private pending reconciliation accepts a physical alias and moved owner, rejects foreign/copy/payload mismatch', () => {
    const storage = new FileUniverseStorage(), app = new UniverseApplication(storage), root = folder();
    app.create(root, createInput());
    const before = app.current()!;
    const input = saveInput(before);
    const saved = app.save(input);
    const expected = { identity: { ownerId: before.ownerId, rootId: before.rootId }, mutation: { command: 'universe.profile.save' as const, input } };
    const alias = root + '-alias';
    temporary.push(alias);
    fs.symlinkSync(root, alias);
    assert.equal(app.open(alias, expected).ownerId, before.ownerId);
    assert.deepEqual(app.reconcile(input.operationId, expected), saved.receipt);
    const foreign = folder();
    storage.create(foreign, createInput()).store.close();
    const foreignBytes = fs.readFileSync(path.join(foreign, 'database/catalog.sqlite'));
    assert.throws(() => app.open(foreign, expected), /owning universe/);
    assert.equal(app.current()!.ownerId, before.ownerId);
    assert.deepEqual(fs.readFileSync(path.join(foreign, 'database/catalog.sqlite')), foreignBytes);
    const copy = folder();
    fs.cpSync(root, copy, { recursive: true });
    assert.throws(() => app.open(copy, expected), /original/);
    assert.throws(() => app.open(root, { ...expected, mutation: { ...expected.mutation, input: { ...input, data: { ...input.data, description: 'wrong original payload' } } } }), /original operation payload/);
    const moved = root + '-moved';
    temporary.push(moved);
    fs.renameSync(root, moved);
    const reopened = app.open(moved, expected);
    assert.equal(reopened.ownerId, before.ownerId);
    assert.equal(reopened.profile.description, input.data.description);
    assert.deepEqual(app.reconcile(input.operationId, expected), saved.receipt);
    app.close();
});
test('creation preflights old context and preserves committed receipt if later activation fails', () => {
    const firstRoot = folder(), secondRoot = folder();
    let corruptOnCommit = false;
    let firstProfile = '';
    let original: Buffer;
    const storage = new FileUniverseStorage(boundary => {
        if (corruptOnCommit && boundary === 'creation-commit')
            fs.writeFileSync(firstProfile, '{"foreign":true}');
    });
    const app = new UniverseApplication(storage);
    const first = app.create(firstRoot, createInput()).snapshot;
    firstProfile = path.join(firstRoot, `profiles/${first.ownerId}.json`);
    original = fs.readFileSync(firstProfile);
    fs.writeFileSync(firstProfile, '{"foreign":true}');
    assert.throws(() => app.create(secondRoot, createInput()), error => (error as {
        outcome: string;
    }).outcome === 'not-committed');
    assert.deepEqual(fs.readdirSync(secondRoot), []);
    fs.writeFileSync(firstProfile, original);
    corruptOnCommit = true;
    const input = createInput();
    let committed: {
        operationId: string;
    } | undefined;
    assert.throws(() => app.create(secondRoot, input), error => {
        const failure = error as {
            outcome: string;
            committedReceipt?: {
                operationId: string;
            };
        };
        committed = failure.committedReceipt;
        return failure.outcome === 'committed';
    });
    assert.equal(committed?.operationId, input.operationId);
    assert.equal(fs.readFileSync(firstProfile, 'utf8'), '{"foreign":true}');
    assert.throws(() => storage.open(firstRoot), /owns/);
    const reopened = storage.open(secondRoot);
    assert.equal(reopened.reconcile(input.operationId)?.operationId, input.operationId);
    reopened.close();
    fs.writeFileSync(firstProfile, original);
    corruptOnCommit = false;
    app.close();
});
