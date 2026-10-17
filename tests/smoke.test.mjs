import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {smokeCommand, parseSmoke, runSmokeProcess} from '../scripts/smoke.mjs';
const quiet = {write: () => {}};
test('smoke resolves native Forge JS launch and platform bundle paths', () => {
 const dev = smokeCommand(false, undefined, 'win32', process.execPath);
 assert.equal(dev.command, process.execPath);
 assert.ok(dev.args[0].endsWith('electron-forge.js'));
 assert.equal(dev.args[1], 'start');
 assert.ok(smokeCommand(true, 'app-darwin-arm64', 'darwin').command.endsWith(path.join('WritingTool.app', 'Contents', 'MacOS', 'WritingTool')));
 assert.ok(smokeCommand(true, 'app-win32-x64', 'win32').command.endsWith('WritingTool.exe'));
 assert.ok(smokeCommand(true, 'app-linux-x64', 'linux').command.endsWith(path.join('app-linux-x64', 'WritingTool')));
});
test('smoke result parsing rejects missing, duplicate, malformed and failed results deterministically', () => {
 assert.deepEqual(parseSmoke('WRITINGTOOL_SMOKE {"passed":true}\n', 0, 'none'), {passed: true});
 for (const output of ['', 'WRITINGTOOL_SMOKE {oops}\n', 'WRITINGTOOL_SMOKE {"passed":false}\n', 'WRITINGTOOL_SMOKE {"passed":true}\nWRITINGTOOL_SMOKE {"passed":true}\n']) assert.throws(() => parseSmoke(output, 0, 'test'), /Smoke failed/);
 assert.throws(() => parseSmoke('WRITINGTOOL_SMOKE {"passed":true}\n', 1, 'test'), /exit 1/);
});
test('runner drains final stdout before parsing and handles malformed JSON without uncaught errors', async () => {
 const script = `process.stdout.write('WRITINGTOOL_SMOKE ' + JSON.stringify({passed: true}) + String.fromCharCode(10), () => process.exit(0))`;
 const result = await runSmokeProcess(process.execPath, ['-e', script], {...quiet, fault: 'drain'});
 assert.equal(result.passed, true);
 await assert.rejects(runSmokeProcess(process.execPath, ['-e', 'console.log("WRITINGTOOL_SMOKE {oops}")'], {...quiet, fault: 'malformed'}), /malformed result JSON/);
 await assert.rejects(runSmokeProcess(path.join(os.tmpdir(), 'writingtool-no-such-executable'), [], {...quiet, fault: 'spawn'}), /ENOENT/);
});
test('timeout waits for a stubborn descendant to stop before returning', {skip: process.platform === 'win32'}, async () => {
 const folder = await mkdtemp(path.join(os.tmpdir(), 'writingtool-runner-test-'));
 const pidFile = path.join(folder, 'pid');
 const script = `const {spawn}=require('node:child_process');const {writeFileSync}=require('node:fs');process.on('SIGTERM',()=>{});const child=spawn(process.execPath,['-e','process.on("SIGTERM",()=>{});setInterval(()=>{},100)'],{stdio:'inherit'});writeFileSync(${JSON.stringify(pidFile)},String(child.pid));setInterval(()=>{},100);`;
 try {
  await assert.rejects(runSmokeProcess(process.execPath, ['-e', script], {...quiet, fault: 'timeout', timeoutMs: 200}), /Smoke timed out/);
  const pid = Number(await readFile(pidFile, 'utf8'));
  if (process.platform === 'linux') {
   try {
    const stat = await readFile(`/proc/${pid}/stat`, 'utf8');
    assert.equal(stat.slice(stat.lastIndexOf(')') + 2).split(' ')[0], 'Z');
   } catch (error) { if (error.code !== 'ENOENT') throw error; }
  } else assert.throws(() => process.kill(pid, 0), /ESRCH/);
 } finally { await rm(folder, {recursive: true, force: true}); }
});
