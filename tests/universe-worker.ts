import { DatabaseSync } from 'node:sqlite';
import { FileUniverseStorage } from '../src/infrastructure/universe-storage';
import { type CreateInput, type SaveInput } from '../src/application/contracts/universe';
const [command, root, payload, boundary] = process.argv.slice(2);
const storage = new FileUniverseStorage(point => {
    if (point === boundary)
        process.exit(23);
});
if (command === 'catalog-crash') {
    const db = new DatabaseSync(root + '/database/catalog.sqlite');
    db.exec('PRAGMA cache_size=1; BEGIN IMMEDIATE;');
    db.prepare('UPDATE unit_meta SET sessionToken=?').run('x'.repeat(100000));
    process.exit(24);
}
else if (command === 'create')
    storage.create(root, JSON.parse(payload) as CreateInput).store.close();
else if (command === 'save') {
    const store = storage.open(root);
    store.save(JSON.parse(payload) as SaveInput);
    store.close();
}
else if (command === 'hold') {
    const store = storage.open(root);
    console.log('OWNED');
    process.on('SIGTERM', () => {
        store.close();
        process.exit(0);
    });
    setInterval(() => {
    }, 1000);
}
else if (command === 'recover') {
    const store = storage.open(root);
    store.close();
}
else if (command === 'open') {
    const store = storage.open(root);
    console.log(JSON.stringify(store.snapshot()));
    store.close();
}
