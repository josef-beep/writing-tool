import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import { validRequest, validResult, unavailable, type ReadinessRequest } from '../src/application/contracts/readiness';
import { readiness } from '../src/application/readiness';
import { HostClient } from '../src/desktop/host-client';
import { trustedSender } from '../src/desktop/security';
const id = '7de83010-27da-4f74-a42d-6a042b2c03f1';
const secondId = '7de83010-27da-4f74-a42d-6a042b2c03f2';
const request: ReadinessRequest = {protocolVersion: 1, requestId: id, query: 'application.readiness'};
test('closed requests reject malformed input before application execution', () => {
 assert.ok(validRequest(request));
 for (const bad of [null, [], {...request, extra: 1}, {...request, protocolVersion: 2}, {...request, query: 'filesystem.read'}, {...request, requestId: id.toUpperCase()}, {...request, requestId: 'x'}, {...request, requestId: id+'\n'}, {...request, requestId: id+'\r\n'}]) {
   assert.equal(validRequest(bad), false);
   assert.throws(() => readiness(bad as ReadinessRequest));
 }
});
test('non-mutating query preserves input and returns a closed correlated result', () => {
 const input = Object.freeze({...request});
 assert.deepEqual(readiness(input), {protocolVersion: 1, requestId: id, status: 'ready'});
 assert.deepEqual(input, request);
});
test('result validation rejects unknown fields, mismatched correlation and invalid errors', () => {
 const ready = readiness(request);
 assert.ok(validResult(ready, id));
 for (const bad of [null, {...ready, extra: true}, {...ready, requestId: secondId}, {...ready, protocolVersion: 2}, {...ready, status: 'ready', code: 'TIMEOUT'}, {...ready, status: 'unavailable', code: 'OTHER'}]) assert.equal(validResult(bad, id), false);
 assert.ok(validResult(unavailable(id, 'TIMEOUT'), id));
});
test('host round trip routes actual application query and cleans its pending entry', async () => {
 let client: HostClient;
 client = new HostClient({postMessage: message => queueMicrotask(() => client.receive(readiness(message)))});
 assert.deepEqual(await client.request(request), readiness(request));
 assert.equal(client.pendingCount, 0);
});
test('host startup, exit, invalid shape/correlation and timeout never report ready', async () => {
 assert.equal((await new HostClient(undefined).request(request)).status, 'unavailable');
 for (const message of [{...readiness(request), extra: true}, {...readiness(request), requestId: secondId}, null]) {
  const client = new HostClient({postMessage: () => {}}, 100);
  const pending = client.request(request);
  client.receive(message);
  assert.deepEqual(await pending, unavailable(id, 'INVALID_RESPONSE'));
  assert.equal(client.pendingCount, 0);
 }
 const timeout = new HostClient({postMessage: () => {}}, 10);
 assert.deepEqual(await timeout.request(request), unavailable(id, 'TIMEOUT'));
 assert.equal(timeout.pendingCount, 0);
 const exited = new HostClient({postMessage: () => {}}, 100);
 const pending = exited.request(request);
 exited.fail('HOST_EXITED');
 assert.deepEqual(await pending, unavailable(id, 'HOST_EXITED'));
 assert.deepEqual(await exited.request(request), unavailable(id, 'HOST_EXITED'));
 assert.equal(exited.pendingCount, 0);
});
test('pending requests are bounded, duplicate correlation cannot replace entries, destruction cleans all', async () => {
 const client = new HostClient({postMessage: () => {}}, 100, 1);
 const first = client.request(request);
 assert.deepEqual(await client.request(request), unavailable(id, 'UNAVAILABLE'));
 assert.deepEqual(await client.request({...request, requestId: secondId}), unavailable(secondId, 'UNAVAILABLE'));
 client.fail('UNAVAILABLE');
 assert.deepEqual(await first, unavailable(id, 'UNAVAILABLE'));
 assert.equal(client.pendingCount, 0);
});
test('sender authorization requires owned webContents, exact local URL, and main frame', () => {
 const url = 'file:///app/index.html';
 assert.equal(trustedSender(1, 1, true, url, url), true);
 for (const args of [[2,1,true,url,url], [1,1,false,url,url], [1,1,true,'https://evil.invalid',url], [1,1,true,url+'?x',url]] as const) assert.equal(trustedSender(args[0], args[1], args[2], args[3], args[4]), false);
});
test('inner application/domain layers import no frameworks or infrastructure', () => {
 function check(dir: string): void {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
   const file = path.join(dir, entry.name);
   if (entry.isDirectory()) check(file);
   else if (file.endsWith('.ts')) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(|require\s*\()\s*['"]([^'"]+)/g)) {
     assert.ok(match[1].startsWith('.'), `${file} imports external dependency ${match[1]}`);
     const resolved = path.resolve(dir, match[1]);
     assert.ok(resolved.startsWith(path.resolve('src/application') + path.sep) || resolved.startsWith(path.resolve('src/domain') + path.sep), `${file} imports outward dependency ${match[1]}`);
    }
   }
  }
 }
 check('src/application'); check('src/domain');
});

test('timeout followed by a valid late reply leaves the next query healthy', async () => {
 const client = new HostClient({postMessage: () => {}}, 10);
 assert.deepEqual(await client.request(request), unavailable(id, 'TIMEOUT'));
 client.receive(readiness(request));
 const nextRequest = {...request, requestId: secondId};
 const pending = client.request(nextRequest);
 client.receive(readiness(nextRequest));
 assert.deepEqual(await pending, readiness(nextRequest));
 assert.equal(client.pendingCount, 0);
});
test('invalid late replies still fail and exit preserves the first terminal cause', async () => {
 const client = new HostClient({postMessage: () => {}}, 10);
 await client.request(request);
 client.receive({...readiness(request), extra: true});
 client.fail('HOST_EXITED');
 assert.deepEqual(await client.request({...request, requestId: secondId}), unavailable(secondId, 'INVALID_RESPONSE'));
});
test('throwing postMessage settles every pending request and clears their timers', async context => {
 let sends = 0;
 const clear = context.mock.method(globalThis, 'clearTimeout');
 const client = new HostClient({postMessage: () => { if (++sends === 2) throw new Error('Transport disconnected'); }}, 1000);
 const first = client.request(request);
 const second = client.request({...request, requestId: secondId});
 assert.deepEqual(await first, unavailable(id, 'HOST_EXITED'));
 assert.deepEqual(await second, unavailable(secondId, 'HOST_EXITED'));
 assert.equal(client.pendingCount, 0);
 assert.equal(clear.mock.calls.length, 2);
 client.fail('UNAVAILABLE');
 assert.deepEqual(await client.request(request), unavailable(id, 'HOST_EXITED'));
});
