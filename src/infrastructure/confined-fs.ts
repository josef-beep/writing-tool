/** Trusted main/utility-only filesystem adapter. Never expose handles or this API over IPC. */
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash, randomUUID } from 'node:crypto';

type Handle = object;
interface Identity { id: string; directory: boolean }
interface Binding {
    contractVersion: number;
    root(absolute: string): Handle;
    open(parent: Handle, name: string, mode: 'directory' | 'read' | 'new', reserved?: () => void): Handle;
    close(handle: Handle): void;
    stat(handle: Handle): Identity;
    read(handle: Handle, count: number): Buffer;
    write(handle: Handle, bytes: Buffer): void;
    sync(handle: Handle, directory: boolean): void;
    mkdir(parent: Handle, name: string): void;
    rename(parent: Handle, source: Handle, from: string, to: string, replace: boolean): void;
    unlink(parent: Handle, source: Handle, name: string): void;
}
let binding: Binding | undefined;
let configuredModule: string | undefined;
/** Call only from trusted bootstrap, before constructing the coordinator. */
export function configureConfinedFs(modulePath: string): void {
    if (!path.isAbsolute(modulePath) || path.basename(modulePath) !== 'confined_fs.node')
        throw new Error('Invalid trusted native module location');
    if (binding || (configuredModule !== undefined && configuredModule !== modulePath))
        throw new Error('Confined filesystem module location is already fixed');
    configuredModule = modulePath;
}
function native(): Binding {
    if (binding) return binding;
    if (!(process.platform === 'darwin' && ['x64', 'arm64'].includes(process.arch)) && !(process.platform === 'win32' && process.arch === 'x64'))
        throw new Error('Unsupported confined filesystem platform/architecture');
    if ((process as NodeJS.Process & { type?: string }).type === 'renderer')
        throw new Error('Confined filesystem is restricted to trusted host processes');
    const runtime = process as NodeJS.Process & { resourcesPath?: string; defaultApp?: boolean };
    const packaged = runtime.resourcesPath && !runtime.defaultApp;
    const filename = configuredModule ?? (packaged
        ? path.join(runtime.resourcesPath!, 'native', 'confined-fs', `${process.platform}-${process.arch}`, 'confined_fs.node')
        : path.resolve('native/confined-fs/build/Release/confined_fs.node'));
    try {
        const loaded = createRequire(path.join(process.cwd(), 'package.json'))(filename) as Binding;
        const operations = ['root', 'open', 'close', 'stat', 'read', 'write', 'sync', 'mkdir', 'rename', 'unlink'] as const;
        if (loaded.contractVersion !== 1 || operations.some(name => typeof loaded[name] !== 'function'))
            throw new Error('Incompatible confined filesystem contract');
        binding = loaded;
        return loaded;
    } catch (cause) {
        throw new Error(`Required confined filesystem addon unavailable: ${filename}`, { cause });
    }
}
function segments(relative: string): string[] {
    const result = relative.split('/');
    if (path.isAbsolute(relative) || result.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)))
        throw new Error('Unsafe managed path');
    return result;
}
function directory(absolute: string): Handle { return native().root(path.resolve(absolute)); }
function parent(root: string, relative: string): { handle: Handle; name: string } {
    const parts = segments(relative), name = parts.pop()!;
    let handle = directory(root);
    try {
        for (const part of parts) {
            const next = native().open(handle, part, 'directory');
            native().close(handle); handle = next;
        }
        return { handle, name };
    } catch (error) { native().close(handle); throw error; }
}
function regular(handle: Handle): Identity {
    const stat = native().stat(handle);
    if (stat.directory) throw new Error('Invalid managed file');
    return stat;
}
function digest(handle: Handle, copy?: Handle): string {
    const hash = createHash('sha256');
    for (;;) {
        const bytes = native().read(handle, 262144);
        if (!bytes.length) break;
        hash.update(bytes);
        if (copy) native().write(copy, bytes);
    }
    regular(handle);
    return hash.digest('hex');
}
function write(handle: Handle, data: Uint8Array): void {
    regular(handle);
    for (let offset = 0; offset < data.byteLength; offset += 262144)
        native().write(handle, Buffer.from(data.buffer, data.byteOffset + offset, Math.min(262144, data.byteLength - offset)));
    regular(handle);
    native().sync(handle, false);
}
function verify(parent: Handle, name: string, expected: Identity | undefined, expectedHash?: string): void {
    let handle: Handle | undefined;
    try {
        handle = native().open(parent, name, 'read');
        if (!expected || regular(handle).id !== expected.id || (expectedHash !== undefined && digest(handle) !== expectedHash))
            throw new Error('Managed target changed');
    } catch (error) {
        if (expected || (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    } finally { if (handle) native().close(handle); }
}
function previous(parent: Handle, name: string, expectedHash: string | null): Identity | undefined {
    let handle: Handle | undefined;
    try {
        handle = native().open(parent, name, 'read');
        const identity = regular(handle);
        if (expectedHash === null || digest(handle) !== expectedHash) throw new Error('Unexpected managed bytes');
        return identity;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || expectedHash !== null) throw error;
    } finally { if (handle) native().close(handle); }
}
function publish(root: string, relative: string, content: (handle: Handle) => void, options: {
    expectedHash?: string | null; existing?: boolean; staged?: () => void;
}): void {
    const p = parent(root, relative), temporary = `.publish-${randomUUID()}`;
    let target: Handle | undefined, original: Handle | undefined;
    try {
        native().sync(p.handle, true);
        let before: Identity | undefined;
        if (options.existing) { original = native().open(p.handle, p.name, 'read'); before = regular(original); }
        else if (options.expectedHash !== undefined) before = previous(p.handle, p.name, options.expectedHash);
        target = native().open(p.handle, temporary, 'new');
        regular(target); content(target); regular(target); native().sync(target, false);
        native().sync(p.handle, true);
        options.staged?.();
        verify(p.handle, p.name, before, options.expectedHash ?? undefined);
        native().rename(p.handle, target, temporary, p.name, before !== undefined);
        native().sync(p.handle, true);
    } finally {
        // Retain staging evidence on failure. No unverified cleanup deletes another object's bytes.
        if (original) native().close(original);
        if (target) native().close(target);
        native().close(p.handle);
    }
}
export const confinedFs = {
    syncDir(absolute: string): void { const h = directory(absolute); try { native().sync(h, true); } finally { native().close(h); } },
    writeExclusive(absolute: string, data: string, reserved?: () => void): void {
        const p = parent(path.dirname(absolute), path.basename(absolute)); let h: Handle | undefined;
        try { native().sync(p.handle, true); h = native().open(p.handle, p.name, 'new', reserved); write(h, Buffer.from(data)); native().sync(p.handle, true); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
    publishMarker(root: string, relative: string, data: string, staged?: () => void): void {
        publish(root, relative, h => write(h, Buffer.from(data)), { staged });
    },
    preserveMarker(root: string, relative: string): void {
        const p = parent(root, relative); let h: Handle | undefined;
        try { native().sync(p.handle, true); h = native().open(p.handle, p.name, 'read'); regular(h); native().rename(p.handle, h, p.name, `${p.name}.damaged-${randomUUID()}`, false); native().sync(p.handle, true); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
    readManaged(root: string, relative: string): Buffer {
        const p = parent(root, relative); let h: Handle | undefined;
        try { h = native().open(p.handle, p.name, 'read'); regular(h); const chunks: Buffer[] = []; for (;;) { const b = native().read(h, 262144); if (!b.length) break; chunks.push(b); } regular(h); return Buffer.concat(chunks); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
    replaceManaged(root: string, relative: string, data: string): void { publish(root, relative, h => write(h, Buffer.from(data)), { existing: true }); },
    ensureManagedDirectory(root: string, relative: string): void {
        const parts = segments(relative); let h = directory(root);
        try { for (const part of parts) { native().sync(h, true); try { native().mkdir(h, part); native().sync(h, true); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; } const next = native().open(h, part, 'directory'); native().close(h); h = next; } }
        finally { native().close(h); }
    },
    publishManagedBytes(root: string, relative: string, bytes: Uint8Array, expectedHash: string | null): void {
        publish(root, relative, h => write(h, bytes), { expectedHash });
    },
    removeManagedBytes(root: string, relative: string, expectedHash: string): void {
        const p = parent(root, relative); let h: Handle | undefined;
        try { native().sync(p.handle, true); h = native().open(p.handle, p.name, 'read'); const identity = regular(h); if (digest(h) !== expectedHash) throw new Error('Unexpected removal target'); verify(p.handle, p.name, identity, expectedHash); native().unlink(p.handle, h, p.name); native().close(h); h = undefined; native().sync(p.handle, true); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
    publishManagedFile(root: string, relative: string, source: string, expectedHash: string | null, expectedSourceHash: string): void {
        if (segments(relative).length !== 1) throw new Error('Unsafe output filename');
        const p = parent(path.dirname(source), path.basename(source)); let h: Handle | undefined;
        try { h = native().open(p.handle, p.name, 'read'); regular(h); const sourceHandle = h; publish(root, relative, output => { if (digest(sourceHandle, output) !== expectedSourceHash) throw new Error('Validated private output changed before publication'); }, { expectedHash }); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
    hashFile(absolute: string): string {
        const p = parent(path.dirname(absolute), path.basename(absolute)); let h: Handle | undefined;
        try { h = native().open(p.handle, p.name, 'read'); regular(h); return digest(h); }
        finally { if (h) native().close(h); native().close(p.handle); }
    },
};
