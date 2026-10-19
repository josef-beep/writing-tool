import fs from 'node:fs';
import { confinedFs } from './confined-fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
export const hash = (bytes: string | Uint8Array): string => createHash('sha256').update(bytes).digest('hex');
// RFC8785 for the closed JSON-only slice: keys are UTF-16 sorted; no domain numbers.
export function canonical(v: unknown): string {
    if (v === null || typeof v !== 'object')
        return JSON.stringify(v);
    if (Array.isArray(v))
        return '[' + v.map(canonical).join(',') + ']';
    const o = v as Record<string, unknown>;
    return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}';
}
export const jsonBytes = (v: unknown): string => canonical(v) + '\n';
// Scan keys before JSON.parse can erase duplicates, while retaining normal JSON grammar.
export function decode(bytes: Uint8Array): unknown {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
        throw new Error('BOM is unsupported');
    const s = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    let i = 0;
    const ws = () => {
        while (/[\x20\t\r\n]/.test(s[i] ?? '') && i < s.length)
            i++;
    };
    const string = (): string => {
        const start = i++;
        while (i < s.length) {
            const c = s[i++];
            if (c === '\\')
                i++;
            else if (c === '"') {
                const v = JSON.parse(s.slice(start, i)) as string;
                if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v))
                    throw new Error('Malformed Unicode');
                return v;
            }
        }
        throw new Error('Unterminated JSON string');
    };
    const value = (): void => {
        ws();
        const c = s[i];
        if (c === '"') {
            string();
            return;
        }
        if (c === '{') {
            i++;
            ws();
            const keys = new Set<string>();
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
function directoryHandle(p: string): number {
    if (process.platform !== 'linux')
        throw new Error('Verified directory-relative I/O is unavailable on this platform');
    let fd = fs.openSync('/', fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW);
    try {
        for (const segment of path.resolve(p).split('/').filter(Boolean)) {
            const next = fs.openSync(`/proc/self/fd/${fd}/${segment}`, fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW);
            fs.closeSync(fd);
            fd = next;
        }
        return fd;
    }
    catch (error) {
        fs.closeSync(fd);
        throw error;
    }
}
function anchored(p: string): {
    fd: number;
    file: string;
} {
    const fd = directoryHandle(path.dirname(p));
    return { fd, file: `/proc/self/fd/${fd}/${path.basename(p)}` };
}
function regular(fd: number): fs.Stats {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.nlink !== 1)
        throw new Error('Aliased or invalid managed file');
    return stat;
}
export function syncDir(p: string): void {
    if (process.platform !== 'linux') return confinedFs.syncDir(p);
    const fd = directoryHandle(p);
    try {
        fs.fsyncSync(fd);
    }
    finally {
        fs.closeSync(fd);
    }
}
export function writeExclusive(p: string, data: string, reserved?: () => void): void {
    if (process.platform !== 'linux') return confinedFs.writeExclusive(p, data, reserved);
    const parent = anchored(p);
    let fd: number | undefined;
    try {
        fd = fs.openSync(parent.file, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
        reserved?.();
        regular(fd);
        fs.writeFileSync(fd, data, 'utf8');
        fs.fsyncSync(fd);
        fs.fsyncSync(parent.fd);
    }
    finally {
        if (fd !== undefined)
            fs.closeSync(fd);
        fs.closeSync(parent.fd);
    }
}
// Atomically publish metadata; keep a torn legacy marker under a distinct name.
export function publishMarker(root: string, relative: string, data: string, staged?: () => void): void {
    if (process.platform !== 'linux') return confinedFs.publishMarker(root, relative, data, staged);
    const parent = anchored(path.join(root, relative));
    const temporary = `/proc/self/fd/${parent.fd}/.marker-${randomUUID()}`;
    try {
        const fd = fs.openSync(temporary, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            fs.writeFileSync(fd, data, 'utf8');
            fs.fsyncSync(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        fs.fsyncSync(parent.fd);
        staged?.();
        try {
            fs.lstatSync(parent.file);
            throw new Error('Publication marker already exists');
        }
        catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
                throw error;
        }
        fs.renameSync(temporary, parent.file);
        fs.fsyncSync(parent.fd);
    }
    finally {
        fs.closeSync(parent.fd);
    }
}
export function preserveMarker(root: string, relative: string): void {
    if (process.platform !== 'linux') return confinedFs.preserveMarker(root, relative);
    const parent = anchored(path.join(root, relative));
    try {
        const fd = fs.openSync(parent.file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
        try {
            regular(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        fs.renameSync(parent.file, parent.file + '.damaged-' + randomUUID());
        fs.fsyncSync(parent.fd);
    }
    finally {
        fs.closeSync(parent.fd);
    }
}
export function checked(root: string, relative: string, directory = false): string {
    const segments = relative.split('/');
    if (segments.some(s => !s || s === '.' || s === '..' || /[\\\0:]/.test(s)) || path.isAbsolute(relative))
        throw new Error('Unsafe managed path');
    let p = root;
    for (let i = 0; i < segments.length; i++) {
        p = path.join(p, segments[i]);
        const stat = fs.lstatSync(p);
        const dir = i < segments.length - 1 || directory;
        if (stat.isSymbolicLink() || (dir ? !stat.isDirectory() : (!stat.isFile() || stat.nlink !== 1)))
            throw new Error('Aliased or invalid managed path');
    }
    return p;
}
export function readManaged(root: string, relative: string): Buffer {
    if (process.platform !== 'linux') return confinedFs.readManaged(root, relative);
    const p = checked(root, relative);
    const parent = anchored(p);
    let fd: number | undefined;
    try {
        fd = fs.openSync(parent.file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
        regular(fd);
        return fs.readFileSync(fd);
    }
    finally {
        if (fd !== undefined)
            fs.closeSync(fd);
        fs.closeSync(parent.fd);
    }
}
export function replaceManaged(root: string, relative: string, data: string): void {
    if (process.platform !== 'linux') return confinedFs.replaceManaged(root, relative, data);
    const target = checked(root, relative);
    const parent = anchored(target);
    const temporary = `/proc/self/fd/${parent.fd}/.publish-${randomUUID()}`;
    let original: number | undefined;
    try {
        original = fs.openSync(parent.file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
        const expected = regular(original);
        const fd = fs.openSync(temporary, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
        try {
            regular(fd);
            fs.writeFileSync(fd, data, 'utf8');
            fs.fsyncSync(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        fs.fsyncSync(parent.fd);
        const current = fs.lstatSync(parent.file);
        if (!current.isFile() || current.nlink !== 1 || current.ino !== expected.ino || current.dev !== expected.dev)
            throw new Error('Publication target identity changed');
        fs.renameSync(temporary, parent.file);
        fs.fsyncSync(parent.fd);
    }
    finally {
        if (original !== undefined)
            fs.closeSync(original);
        fs.closeSync(parent.fd);
    }
}
/** Managed binary publication shares the anchored, durable primitive used by WRT/JSON. */
export function ensureManagedDirectory(root:string,relative:string):void {
    if (process.platform !== 'linux') return confinedFs.ensureManagedDirectory(root, relative);
    const segments=relative.split('/');if(segments.some(s=>!s||s==='.'||s==='..'||/[\\\0:]/.test(s)))throw new Error('Unsafe managed directory');
    let fd=directoryHandle(root);
    try {for(const segment of segments){const p=`/proc/self/fd/${fd}/${segment}`;try{fs.mkdirSync(p,{mode:0o700});fs.fsyncSync(fd);}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}const next=fs.openSync(p,fs.constants.O_RDONLY|fs.constants.O_DIRECTORY|fs.constants.O_NOFOLLOW);fs.closeSync(fd);fd=next;}}finally{fs.closeSync(fd);}
}
export function publishManagedBytes(root:string,relative:string,data:Uint8Array,expectedHash:string|null):void {
    if (process.platform !== 'linux') return confinedFs.publishManagedBytes(root, relative, data, expectedHash);
    const segments=relative.split('/');if(segments.some(s=>!s||s==='.'||s==='..'||/[\\\0:]/.test(s))||path.isAbsolute(relative))throw new Error('Unsafe managed path');
    const parent=anchored(path.join(root,relative)),temporary=`/proc/self/fd/${parent.fd}/.workspace-${randomUUID()}`;
    try {
        let previous:fs.Stats|undefined;
        try{const fd=fs.openSync(parent.file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{previous=regular(fd);if(expectedHash===null||hash(fs.readFileSync(fd))!==expectedHash)throw new Error('Unexpected managed bytes');}finally{fs.closeSync(fd);}}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT'||expectedHash!==null)throw e;}
        const fd=fs.openSync(temporary,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600);try{regular(fd);fs.writeFileSync(fd,data);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.fsyncSync(parent.fd);
        if(previous){const current=fs.lstatSync(parent.file);if(current.ino!==previous.ino||current.dev!==previous.dev||current.nlink!==1||!current.isFile())throw new Error('Managed target changed');}
        else{try{fs.lstatSync(parent.file);throw new Error('Managed target appeared');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}
        fs.renameSync(temporary,parent.file);fs.fsyncSync(parent.fd);
    }finally{fs.closeSync(parent.fd);}
}
export function removeManagedBytes(root:string,relative:string,expectedHash:string):void {
    if (process.platform !== 'linux') return confinedFs.removeManagedBytes(root, relative, expectedHash);
    const parent=anchored(path.join(root,relative));try{const fd=fs.openSync(parent.file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{regular(fd);if(hash(fs.readFileSync(fd))!==expectedHash)throw new Error('Unexpected removal target');}finally{fs.closeSync(fd);}fs.unlinkSync(parent.file);fs.fsyncSync(parent.fd);}finally{fs.closeSync(parent.fd);}
}
/** Stream a verified private artifact through the same anchored destination publication protocol. */
export function publishManagedFile(root:string,relative:string,source:string,expectedHash:string|null,expectedSourceHash:string):void{
    if (process.platform !== 'linux') return confinedFs.publishManagedFile(root, relative, source, expectedHash, expectedSourceHash);
 if(relative.includes('/')||!relative||/[\\\0:]/.test(relative)||relative==='.'||relative==='..')throw new Error('Unsafe output filename');const parent=anchored(path.join(root,relative)),temporary=`/proc/self/fd/${parent.fd}/.output-${randomUUID()}`;let sourceFd:number|undefined,targetFd:number|undefined;try{let before:fs.Stats|undefined;try{const fd=fs.openSync(parent.file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{before=regular(fd);if(expectedHash===null||hash(fs.readFileSync(fd))!==expectedHash)throw new Error('Output changed since Save As.');}finally{fs.closeSync(fd);}}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT'||expectedHash!==null)throw e;}sourceFd=fs.openSync(source,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);regular(sourceFd);targetFd=fs.openSync(temporary,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_NOFOLLOW,0o600);const digest=createHash('sha256'),buffer=Buffer.alloc(262144);let count:number;while((count=fs.readSync(sourceFd,buffer))>0){const bytes=buffer.subarray(0,count);digest.update(bytes);let offset=0;while(offset<count)offset+=fs.writeSync(targetFd,bytes,offset,count-offset);}if(digest.digest('hex')!==expectedSourceHash)throw new Error('Validated private output changed before publication.');fs.fsyncSync(targetFd);fs.closeSync(targetFd);targetFd=undefined;fs.fsyncSync(parent.fd);if(before){const stat=fs.lstatSync(parent.file);if(stat.ino!==before.ino||stat.dev!==before.dev||!stat.isFile()||stat.nlink!==1)throw new Error('Output identity changed.');}else{try{fs.lstatSync(parent.file);throw new Error('Output appeared after Save As.');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}fs.renameSync(temporary,parent.file);fs.fsyncSync(parent.fd);}finally{if(sourceFd!==undefined)fs.closeSync(sourceFd);if(targetFd!==undefined)fs.closeSync(targetFd);try{fs.unlinkSync(temporary);}catch{}fs.closeSync(parent.fd);}}
export function hashFile(file:string):string{
    if (process.platform !== 'linux') return confinedFs.hashFile(file);
    const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{regular(fd);const digest=createHash('sha256'),bytes=Buffer.alloc(262144);let n:number;while((n=fs.readSync(fd,bytes))>0)digest.update(bytes.subarray(0,n));return digest.digest('hex');}finally{fs.closeSync(fd);}}
