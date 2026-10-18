import {WorkspaceStore, WORKSPACE_TABLES, type WorkspaceDecisionLedger} from './workspace-storage';
import {validWorkspaceReceipt} from '../application/contracts/workspace';
import {isGeneration} from '../application/contracts/universe';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {type DatabaseSync} from 'node:sqlite';
import {closed, isUuid} from '../domain/validation';
import {UniverseFailure} from '../application/universe';
import {type ProjectCreateInput, type ProjectIdentity, type ProjectReceipt, validProjectReceipt} from '../application/contracts/project';
import {canonical, checked, decode, hash, jsonBytes, readManaged, syncDir, writeExclusive} from './universe-files';
import {connect, transaction} from './universe-storage';
const APP_ID = 1465140301;
const DDL = `PRAGMA application_id=1465140301; PRAGMA user_version=1;
CREATE TABLE unit_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1),ownerId TEXT NOT NULL,rootId TEXT NOT NULL,universeId TEXT NOT NULL,generation TEXT NOT NULL,sessionToken TEXT NOT NULL,creationOperationId TEXT NOT NULL,creationDigest TEXT NOT NULL,creationState TEXT NOT NULL CHECK(creationState IN ('preparing','complete')));
CREATE TABLE root_locations(rootId TEXT PRIMARY KEY,ownerKind TEXT NOT NULL CHECK(ownerKind='project'),ownerId TEXT NOT NULL,basePath TEXT NOT NULL,bindingVersion TEXT NOT NULL);
CREATE TABLE universe_locations(universeId TEXT PRIMARY KEY,basePath TEXT NOT NULL,bindingVersion TEXT NOT NULL);
CREATE TABLE records(id TEXT PRIMARY KEY,rootId TEXT NOT NULL REFERENCES root_locations(rootId),recordType TEXT NOT NULL CHECK(recordType='project-metadata'),relativePath TEXT NOT NULL UNIQUE,recordVersion TEXT NOT NULL,sha256 TEXT NOT NULL);
CREATE TABLE committed_operations(operationId TEXT PRIMARY KEY,requestDigest TEXT NOT NULL,generation TEXT NOT NULL,resultDigest TEXT NOT NULL,receiptData TEXT NOT NULL);`;
const LEASE_DDL = `PRAGMA application_id=1465140301; PRAGMA user_version=1; CREATE TABLE lease_identity(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1),ownerId TEXT NOT NULL,rootId TEXT NOT NULL);`;
type Descriptor = {schemaVersion: 1; kind: 'project'; id: string; rootId: string; creationOperationId: string};
const ensure = (v: unknown, message = 'Project integrity validation failed.'): void => {if (!v) throw new UniverseFailure('INTEGRITY_MISMATCH',message);};
function discovery(root: string): Descriptor {
    const d = decode(readManaged(root,'writingtool.json'));
    if (typeof d === 'object' && d !== null && 'schemaVersion' in d && d.schemaVersion !== 1) throw new UniverseFailure('UNSUPPORTED_VERSION','This project version is unsupported.');
    ensure(closed(d,['schemaVersion','kind','id','rootId','creationOperationId']) && d.schemaVersion === 1 && d.kind === 'project' && isUuid(d.id) && isUuid(d.rootId) && isUuid(d.creationOperationId));
    return d as Descriptor;
}
export class FileProjectStorage {
    constructor(private coordinator?: WorkspaceDecisionLedger) {}
    physicalPath(basePath: string): string { const p = fs.realpathSync(basePath); ensure(fs.statSync(p).isDirectory(),'Select an existing project directory.'); return p; }
    create(basePath: string, input: ProjectCreateInput, universeId: string, universeLocation: string): {store: FileProjectStore; receipt: ProjectReceipt} {
        ensure(isUuid(input.operationId) && isUuid(universeId));
        let root: string;
        try {
            root=this.physicalPath(basePath);
            if(fs.readdirSync(root).length) throw new UniverseFailure('VALIDATION','Choose an empty folder for the project. Existing content was preserved.');
        } catch(e) {if(e instanceof UniverseFailure) throw e; throw new UniverseFailure('IO_FAILURE','The project folder could not be inspected. No creation was started.');}
        const id = randomUUID(), rootId = randomUUID(), recordVersion = randomUUID(), session = randomUUID();
        const d: Descriptor = {schemaVersion:1,kind:'project',id,rootId,creationOperationId: input.operationId};
        const metadata = {schemaVersion:1,recordType:'project-metadata',id,owner:{kind:'project',id},universeId,recordVersion,data:{}};
        const digest = hash(canonical({protocolVersion:1,command:'project.create',payload:{universeId}}));
        const receipt: ProjectReceipt = {protocolVersion:1,operationId: input.operationId,owner:{kind:'project',id},unitGeneration:'1',recordId:id,recordVersion};
        let db: DatabaseSync | undefined, lease: DatabaseSync | undefined, reserved = false;
        try {
            writeExclusive(path.join(root,'.writingtool-creation.json'),jsonBytes({schemaVersion:1,operationId:input.operationId,ownerId:id,rootId,requestDigest:digest,metadata}),() => {reserved=true;});
            for (const p of ['database','projects','images']) {fs.mkdirSync(path.join(root,p),{mode:0o700}); syncDir(root);}
            for (const p of ['database/catalog.sqlite','database/lease.sqlite']) writeExclusive(path.join(root,p),'');
            lease = connect(path.join(root,'database/lease.sqlite'),true,APP_ID);
            lease.exec(LEASE_DDL); lease.prepare('INSERT INTO lease_identity VALUES(1,1,?,?)').run(id,rootId); lease.exec('BEGIN EXCLUSIVE');
            db = connect(path.join(root,'database/catalog.sqlite'),true,APP_ID); db.exec(DDL);
            transaction(db,() => {
                db!.prepare('INSERT INTO unit_meta VALUES(1,1,?,?,?,?,?,?,?,?)').run(id,rootId,universeId,'0',session,input.operationId,digest,'preparing');
                db!.prepare('INSERT INTO root_locations VALUES(?,?,?,?,?)').run(rootId,'project',id,root,randomUUID());
                db!.prepare('INSERT INTO universe_locations VALUES(?,?,?)').run(universeId,universeLocation,randomUUID());
            });
            const bytes = jsonBytes(metadata);
            writeExclusive(path.join(root,`projects/${id}.json`),bytes); writeExclusive(path.join(root,'writingtool.json'),jsonBytes(d));
            transaction(db,() => {
                db!.prepare('INSERT INTO records VALUES(?,?,?,?,?,?)').run(id,rootId,'project-metadata',`projects/${id}.json`,recordVersion,hash(bytes));
                db!.prepare("UPDATE unit_meta SET generation='1',creationState='complete' WHERE singleton=1").run();
                const result = canonical(receipt);
                db!.prepare('INSERT INTO committed_operations VALUES(?,?,?,?,?)').run(input.operationId,digest,'1',hash(result),result);
            });
            syncDir(path.join(root,'database'));
            const store = new FileProjectStore(root,d,db,lease,session,this.coordinator); store.snapshot(); store.workspace.attach(); return {store,receipt};
        } catch (e) {
            try {db?.close();} finally {if (lease?.isTransaction) lease.exec('ROLLBACK'); lease?.close();}
            if (!reserved) throw new UniverseFailure('IO_FAILURE','The project folder could not be reserved. No creation was started.');
            throw new UniverseFailure('RECOVERY_REQUIRED','Project creation needs recovery. Its folder and evidence were preserved.','unknown');
        }
    }
    open(basePath: string, expectedCreationOperationId?: string): FileProjectStore {
        const root = this.physicalPath(basePath);
        let db: DatabaseSync | undefined, lease: DatabaseSync | undefined,store:FileProjectStore|undefined;
        try {
            const d = discovery(root);
            if (expectedCreationOperationId) ensure(d.creationOperationId === expectedCreationOperationId,'Reopen the project folder belonging to the pending creation.');
            checked(root,'projects',true); checked(root,'images',true);
            const leasePath = checked(root,'database/lease.sqlite'), catalog = checked(root,'database/catalog.sqlite');
            try {lease=connect(leasePath,false,APP_ID); lease.exec('BEGIN EXCLUSIVE');}
            catch (e) {if (String(e).includes('locked') || String(e).includes('busy')) throw new UniverseFailure('LEASE_UNAVAILABLE','Another application owns this project. Close it there and try again.'); throw e;}
            const identity = lease.prepare('SELECT * FROM lease_identity').all();
            ensure(identity.length === 1 && closed(identity[0],['singleton','schemaVersion','ownerId','rootId']) && identity[0].singleton === 1 && identity[0].schemaVersion === 1 && identity[0].ownerId === d.id && identity[0].rootId === d.rootId);
            db=connect(catalog,false,APP_ID);
            const session = randomUUID();store=new FileProjectStore(root,d,db,lease,undefined,this.coordinator);
            store.checkBinding(); store.workspace.attach(); store.workspace.recover(); store.snapshot();
            transaction(db,() => {db!.prepare('UPDATE unit_meta SET sessionToken=? WHERE singleton=1').run(session);});
            store.session=session;
            return store;
        } catch(e) {
            store?.workspace.detach();
            try {db?.close();} finally {if(lease?.isTransaction) lease.exec('ROLLBACK'); lease?.close();}
            if(e instanceof UniverseFailure) throw e;
            throw new UniverseFailure('RECOVERY_REQUIRED','The project is missing, incomplete, invalid or inaccessible. Existing bytes were preserved.');
        }
    }
}
export class FileProjectStore {
    readonly workspace: WorkspaceStore;
    private released=false;
    private databaseClosed=false;
    private releaseStarted=false;
    private rootIdentity: {dev:number;ino:number};
    private identities: {relative: string; dev: number; ino: number}[];
    constructor(readonly location: string, private d: Descriptor, private db: DatabaseSync, private lease: DatabaseSync, public session: string | undefined,coordinator?:WorkspaceDecisionLedger) {
        this.rootIdentity=fs.statSync(location);
        this.identities=['database/catalog.sqlite','database/lease.sqlite'].map(relative=>{const stat=fs.statSync(checked(location,relative)); return {relative,dev:stat.dev,ino:stat.ino};});
        this.workspace=new WorkspaceStore(location,db,()=>{const m=db.prepare('SELECT * FROM unit_meta WHERE singleton=1').get()!;return{owner:{kind:'project',id:d.id},rootId:d.rootId,universeId:String(m.universeId),generation:String(m.generation),sessionToken:String(m.sessionToken)};},()=>this.health(),coordinator);
    }
    private health(): void {
        ensure(!this.released && !this.releaseStarted && this.lease.isTransaction,'Project ownership is unavailable.');
        const root=fs.statSync(this.location);
        ensure(fs.realpathSync(this.location)===this.location && root.dev===this.rootIdentity.dev && root.ino===this.rootIdentity.ino,'Physical project root changed.');
        ensure(canonical(discovery(this.location))===canonical(this.d),'Project discovery identity changed.');
        for(const i of this.identities) {const s=fs.statSync(checked(this.location,i.relative)); ensure(s.dev===i.dev && s.ino===i.ino,'Project authority file identity changed.');}
        const identity=this.lease.prepare('SELECT * FROM lease_identity').get();
        ensure(identity?.ownerId===this.d.id && identity?.rootId===this.d.rootId && identity?.schemaVersion===1,'Project ownership identity changed.');
        if(this.session)ensure(this.db.prepare('SELECT sessionToken FROM unit_meta WHERE singleton=1').get()?.sessionToken===this.session,'Project writer fencing token is stale.');
    }
    snapshot(): ProjectIdentity {
        this.health();
        this.workspace.snapshot();
        const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map(r=>r.name);
        ensure(canonical(tables)===canonical(['committed_operations','records','root_locations','unit_meta','universe_locations',...(this.workspace.featureInstalled()?WORKSPACE_TABLES:[])].sort()));
        const rows=this.db.prepare('SELECT * FROM unit_meta').all(), m=rows[0];
        ensure(rows.length===1 && closed(m,['singleton','schemaVersion','ownerId','rootId','universeId','generation','sessionToken','creationOperationId','creationDigest','creationState']) && m.singleton===1 && m.schemaVersion===1 && m.ownerId===this.d.id && m.rootId===this.d.rootId && isUuid(m.universeId) && isGeneration(m.generation) && m.creationState==='complete' && m.creationOperationId===this.d.creationOperationId && isUuid(m.sessionToken) && (!this.session || this.session===m.sessionToken));
        const records=this.db.prepare('SELECT * FROM records').all(), r=records[0];
        ensure(records.length===1 && closed(r,['id','rootId','recordType','relativePath','recordVersion','sha256']) && r.id===m.ownerId && r.rootId===m.rootId && r.recordType==='project-metadata' && r.relativePath===`projects/${m.ownerId}.json` && isUuid(r.recordVersion));
        const bytes=readManaged(this.location,String(r.relativePath)), p=decode(bytes);
        ensure(hash(bytes)===r.sha256 && closed(p,['schemaVersion','recordType','id','owner','universeId','recordVersion','data']) && p.schemaVersion===1 && p.recordType==='project-metadata' && p.id===m.ownerId && closed(p.owner,['kind','id']) && p.owner.kind==='project' && p.owner.id===m.ownerId && p.universeId===m.universeId && p.recordVersion===r.recordVersion && closed(p.data,[]));
        const locations=this.db.prepare('SELECT * FROM universe_locations').all(), u=locations[0];
        ensure(locations.length===1 && closed(u,['universeId','basePath','bindingVersion']) && u.universeId===m.universeId && typeof u.basePath==='string' && path.isAbsolute(u.basePath) && isUuid(u.bindingVersion));
        this.binding();
        const operations=this.db.prepare('SELECT * FROM committed_operations').all(), op=operations.find(o=>o.operationId===m.creationOperationId)!;
        const ordered=[...operations].sort((a,b)=>BigInt(String(a.generation))<BigInt(String(b.generation))?-1:1);
        ensure(ordered.every((o,i)=>o.generation===(BigInt(i)+1n).toString()&&typeof o.receiptData==='string'&&hash(o.receiptData)===o.resultDigest&&(o.operationId===m.creationOperationId||validWorkspaceReceipt(decode(Buffer.from(String(o.receiptData))))))&&ordered.at(-1)?.generation===m.generation);
        ensure(closed(op,['operationId','requestDigest','generation','resultDigest','receiptData']) && op.operationId===m.creationOperationId && op.generation==='1' && op.requestDigest===m.creationDigest && op.requestDigest===hash(canonical({protocolVersion:1,command:'project.create',payload:{universeId:m.universeId}})) && typeof op.receiptData==='string' && hash(op.receiptData)===op.resultDigest);
        const receipt=decode(Buffer.from(String(op.receiptData)));
        ensure(validProjectReceipt(receipt) && receipt.operationId===m.creationOperationId && receipt.owner.id===m.ownerId && receipt.recordVersion===r.recordVersion);
        return {ownerId:String(m.ownerId),rootId:String(m.rootId),universeId:String(m.universeId),generation:String(m.generation),recordVersion:String(r.recordVersion),location:this.location,universeLocation:String(u.basePath),creationOperationId:String(m.creationOperationId)};
    }
    private binding() {
        const rows=this.db.prepare('SELECT * FROM root_locations').all(), b=rows[0];
        ensure(rows.length===1 && closed(b,['rootId','ownerKind','ownerId','basePath','bindingVersion']) && b.rootId===this.d.rootId && b.ownerKind==='project' && b.ownerId===this.d.id && typeof b.basePath==='string' && path.isAbsolute(b.basePath) && isUuid(b.bindingVersion)); return b;
    }
    checkBinding(): void {
        const b=this.binding();
        if(b.basePath===this.location) return;
        let original: string;
        try {original=fs.realpathSync(String(b.basePath));}
        catch(e) {if((e as NodeJS.ErrnoException).code==='ENOENT') return; throw e;}
        if(original===this.location || !fs.statSync(original).isDirectory()) return;
        if(fs.readdirSync(original).some(n=>['writingtool.json','.writingtool-creation.json','database'].includes(n))) {
            // An unreadable/missing descriptor alongside authority evidence is
            // uncertain, not proof that this is an independent movable root.
            const prior=discovery(original);
            ensure(prior.id!==this.d.id && prior.rootId!==this.d.rootId,'The original project folder still exists. This copy cannot become a second authority.');
        }
    }
    bind(universeLocation: string): void {
        this.snapshot(); this.checkBinding(); const b=this.binding(), u=this.db.prepare('SELECT * FROM universe_locations').get()!;
        transaction(this.db,()=>{
            this.health();
            if(b.basePath!==this.location) ensure(this.db.prepare('UPDATE root_locations SET basePath=?,bindingVersion=? WHERE rootId=? AND bindingVersion=?').run(this.location,randomUUID(),this.d.rootId,String(b.bindingVersion)).changes===1);
            if(u.basePath!==universeLocation) ensure(this.db.prepare('UPDATE universe_locations SET basePath=?,bindingVersion=? WHERE universeId=? AND bindingVersion=?').run(universeLocation,randomUUID(),String(u.universeId),String(u.bindingVersion)).changes===1);
        });
    }
    prepareRelocatedReopen(basePath: string): boolean {
        if(this.released || basePath===this.location) return false;
        const root=fs.statSync(basePath);
        if(root.ino!==this.rootIdentity.ino || root.dev!==this.rootIdentity.dev) return false;
        ensure(canonical(discovery(basePath))===canonical(this.d),'Moved project identity changed.');
        for(const identity of this.identities) {
            const current=fs.statSync(checked(basePath,identity.relative));
            ensure(current.dev===identity.dev && current.ino===identity.ino,'Moved project authority identity changed.');
        }
        // Reopen SQLite at its new VFS path only after validating the same root
        // and authority files; never release ownership for an unrelated copy.
        this.releaseCandidate();
        return true;
    }
    close(): void {if(this.released) return; if(!this.releaseStarted) this.snapshot(); this.releaseCandidate();}
    releaseCandidate(): void {
        if(this.released) return;
        this.releaseStarted=true;
        if(!this.databaseClosed) {this.workspace.detach();this.db.close(); this.databaseClosed=true;}
        if(this.lease.isTransaction) this.lease.exec('ROLLBACK');
        this.lease.close(); this.released=true;
    }
}
