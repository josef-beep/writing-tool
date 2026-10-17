import { spawn } from 'node:child_process';
import { mkdtemp, rm, readdir, readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';
const require = createRequire(import.meta.url);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function smokeCommand(packaged, folder, platform = process.platform, node = process.execPath) {
  if (!packaged) return {command: node, args: [require.resolve('@electron-forge/cli/dist/electron-forge.js'), 'start']};
  const executable = platform === 'darwin' ? ['WritingTool.app', 'Contents', 'MacOS', 'WritingTool'] : [platform === 'win32' ? 'WritingTool.exe' : 'WritingTool'];
  return {command: path.resolve('out', folder, ...executable), args: []};
}
export function parseSmoke(output, code, fault) {
  const lines = output.split(/\r?\n/).filter(line => line.startsWith('WRITINGTOOL_SMOKE '));
  if (lines.length !== 1) throw new Error(`Smoke failed (${fault}): expected one result, received ${lines.length}`);
  let result;
  try { result = JSON.parse(lines[0].slice('WRITINGTOOL_SMOKE '.length)); }
  catch { throw new Error(`Smoke failed (${fault}): malformed result JSON`); }
  if (code !== 0 || result?.passed !== true) throw new Error(`Smoke failed (${fault}), exit ${code}`);
  return result;
}
async function windowsTreeKill(pid, force) {
  const killer = spawn(path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(pid), '/T', ...(force ? ['/F'] : [])], {stdio: 'ignore', windowsHide: true});
  const code = await new Promise(resolve => {
    const timer = setTimeout(() => { killer.kill(); resolve(undefined); }, 1500);
    killer.once('error', () => { clearTimeout(timer); resolve(undefined); });
    killer.once('close', code => { clearTimeout(timer); resolve(code); });
  });
  // 128 means the target process no longer exists. Other force-kill failures retain the profile.
  if (force && code !== 0 && code !== 128) throw new Error(`taskkill failed: ${code}`);
}
async function stopTree(pid, force = false) {
  if (!pid) return;
  if (process.platform === 'win32') { await windowsTreeKill(pid, force); return; }
  try { process.kill(-pid, force ? 'SIGKILL' : 'SIGTERM'); }
  catch (error) { if (error.code !== 'ESRCH') throw error; }
}
async function groupRunning(pid) {
  try { process.kill(-pid, 0); } catch (error) { if (error.code === 'ESRCH') return false; throw error; }
  if (process.platform !== 'linux') return true;
  // A reaped launcher can leave orphan zombies; these cannot write profile files.
  for (const entry of await readdir('/proc')) {
    if (!/^\d+$/.test(entry)) continue;
    try {
      const stat = await readFile(`/proc/${entry}/stat`, 'utf8');
      const [state, , group] = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      if (Number(group) === pid && state !== 'Z' && state !== 'X') return true;
    } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ESRCH') throw error; }
  }
  return false;
}
async function waitForGroup(pid) {
  if (!pid || process.platform === 'win32') return true;
  const deadline = Date.now() + 1500;
  do {
    if (!await groupRunning(pid)) return true;
    await delay(50);
  } while (Date.now() < deadline);
  return false;
}
/** Return only once child close has drained both streams and tree cleanup has completed. */
export async function runSmokeProcess(command, args, {env, fault, timeoutMs = 90000, write = data => process.stdout.write(data)} = {}) {
  const child = spawn(command, args, {env, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32'});
  let output = '';
  const append = data => { output += data; write(data); };
  child.stdout.on('data', append); child.stderr.on('data', append);
  let spawnError;
  child.once('error', error => { spawnError = error; });
  const closed = new Promise(resolve => child.once('close', (code, signal) => resolve({code, signal})));
  let timeout;
  const timedOut = new Promise(resolve => { timeout = setTimeout(() => resolve({timeout: true}), timeoutMs); });
  const exited = new Promise(resolve => {
    child.once('exit', (code, signal) => resolve({code, signal}));
    child.once('error', () => resolve({error: true}));
  });
  const outcome = await Promise.race([exited, timedOut]);
  clearTimeout(timeout);
  // Terminate descendants even when the launcher has already exited.
  let closeResult;
  let treeStopped = false;
  try {
    await stopTree(child.pid);
    closeResult = await Promise.race([closed, delay(1000).then(() => undefined)]);
    // A descendant can close its streams while still running: always send the force fallback.
    await stopTree(child.pid, true);
    treeStopped = await waitForGroup(child.pid);
    closeResult ??= await Promise.race([closed, delay(1500).then(() => undefined)]);
  } catch (cause) {
    const error = new Error(`Smoke tree cleanup failed (${fault}); profile retained`, {cause});
    error.code = 'SMOKE_CLEANUP_FAILED';
    throw error;
  }
  if (!closeResult || !treeStopped) {
    child.stdout.destroy(); child.stderr.destroy();
    const error = new Error(`Smoke process tree did not close (${fault}); profile retained`);
    error.code = 'SMOKE_CLEANUP_FAILED';
    throw error;
  }
  if (spawnError) throw spawnError;
  if (outcome.timeout) throw new Error(`Smoke timed out (${fault})`);
  return parseSmoke(output, closeResult.code, fault);
}
export async function main() {
  const packaged = process.argv.includes('--packaged');
  const faults = ['none', 'start', 'exit', 'invalid', 'timeout', 'exit-after-ready', 'fatal-error'];
  let folder;
  if (packaged) {
    folder = (await readdir('out')).find(name => name.endsWith(`-${process.platform}-${process.arch}`));
    if (!folder) throw new Error('Run npm run package first');
  }
  const {command, args} = smokeCommand(packaged, folder);
  for (const fault of faults) {
    const profile = await mkdtemp(path.join(os.tmpdir(), 'writingtool-smoke-'));
    const universeFolder = path.join(profile, 'universe');
    await mkdir(universeFolder);
    let cleanupSafe = true;
    try {
      await runSmokeProcess(command, args, {fault, env: {...process.env, DISPLAY: process.env.DISPLAY ?? ':1', ...(packaged ? {PATH: path.dirname(command)} : {}), WRITINGTOOL_DIAGNOSTIC: '1', WRITINGTOOL_HOST_FAULT: fault === 'none' ? '' : fault, WRITINGTOOL_PROFILE: profile, WRITINGTOOL_UNIVERSE_FOLDER: universeFolder}});
    } catch (error) {
      cleanupSafe = error.code !== 'SMOKE_CLEANUP_FAILED';
      if (!cleanupSafe) console.error(`Retained smoke profile: ${profile}`);
      throw error;
    } finally { if (cleanupSafe) await rm(profile, {recursive: true, force: true}); }
  }
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) await main();
