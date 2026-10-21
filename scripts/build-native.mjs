/** Native build setup. Invoked by Forge on the matching build host, never by installed apps. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const platform = option('platform', process.platform);
const arch = option('arch', process.arch);
const target = `${platform}-${arch}`;
if (!['linux-x64', 'win32-x64', 'darwin-x64', 'darwin-arm64'].includes(target))
  throw new Error(`No approved native build target: ${target}`);
if (platform !== process.platform || arch !== process.arch)
  throw new Error('Build native resources on the matching platform and architecture.');
if (platform !== 'linux') {
  const directory = path.join(root, 'native/confined-fs');
  const version = require('electron/package.json').version;
  execFileSync(process.execPath, [require.resolve('node-gyp/bin/node-gyp.js'), 'rebuild',
    `--target=${version}`, `--arch=${arch}`, '--dist-url=https://electronjs.org/headers'],
  { cwd: directory, stdio: 'inherit' });
  const binary = path.join(directory, 'build/Release/confined_fs.node');
  if (!fs.statSync(binary).isFile()) throw new Error('Native build did not produce confined_fs.node.');
  const destination = path.join(root, 'resources/native/confined-fs', target);
  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(binary, path.join(destination, 'confined_fs.node'));
  fs.writeFileSync(path.join(destination, 'build-receipt.json'), JSON.stringify({
    schemaVersion: 1, target, electron: version, napi: 8,
    sha256: createHash('sha256').update(fs.readFileSync(binary)).digest('hex'),
  }, null, 2) + '\n');
}
