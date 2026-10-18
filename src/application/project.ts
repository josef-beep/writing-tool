import {assertWorkspaceState} from '../domain/workspace';
import type {WorkspaceUnitPort} from './contracts/workspace-ports';
import {UniverseApplication, UniverseFailure} from './universe';
import {type ProjectCreateInput, type ProjectIdentity, type ProjectReceipt, type ProjectSnapshot} from './contracts/project';
export interface ProjectStore {
    readonly location: string;
    workspace: WorkspaceUnitPort;
    snapshot(): ProjectIdentity;
    bind(universeLocation: string): void;
    close(): void;
    releaseCandidate(): void;
    prepareRelocatedReopen(basePath: string): boolean;
}
export interface ProjectStorage {
    physicalPath(basePath: string): string;
    create(basePath: string, input: ProjectCreateInput, universeId: string, universeLocation: string): {store: ProjectStore; receipt: ProjectReceipt};
    open(basePath: string, expectedCreationOperationId?: string): ProjectStore;
}
export class LocateProjectUniverse extends Error {constructor(readonly universeId: string) {super('Locate the associated universe.');}}
export class ProjectApplication {
    private active: ProjectStore | undefined;
    private retired: ProjectStore[] = [];
    constructor(private storage: ProjectStorage, private universes: UniverseApplication) {}
    workspaceAuthority(): WorkspaceUnitPort | undefined { return this.active?.workspace; }
    associatedUniverseId(): string | undefined {return this.active?.snapshot().universeId;}
    current(): ProjectSnapshot | null {
        if (!this.active) return null;
        const p=this.active.snapshot(), universe=this.universes.current();
        if(!universe || universe.ownerId!==p.universeId) throw new UniverseFailure('INTEGRITY_MISMATCH','The project universe authority is unavailable.');
        return {...p,universeLocation:universe.location,universe};
    }
    create(basePath: string, universePath: string, input: ProjectCreateInput): {snapshot: ProjectSnapshot; receipt: ProjectReceipt} {
        this.current();
        const candidateUniverse=this.universes.stage(universePath);
        let candidate: ProjectStore | undefined, receipt: ProjectReceipt | undefined;
        try {
            const created=this.storage.create(basePath,input,candidateUniverse.snapshot.ownerId,candidateUniverse.snapshot.location);
            candidate=created.store; receipt=created.receipt;
            const identity=candidate.snapshot();
            assertWorkspaceState([...candidate.workspace.snapshot().records,...candidateUniverse.workspace.snapshot().records]);
            const previous=this.active;
            const universe=candidateUniverse.commit();
            this.active=candidate; candidate=undefined;
            if(previous) this.retired.push(previous);
            this.releaseRetired();
            return {snapshot:{...identity,universe},receipt};
        } catch(e) {
            candidate?.releaseCandidate(); candidateUniverse.cancel();
            if(receipt) throw new UniverseFailure('RECOVERY_REQUIRED','The project was created but activation failed. Reopen its folder before continuing.','committed');
            throw e;
        }
    }
    open(basePath: string, universePath?: string, expectedCreationOperationId?: string): ProjectSnapshot {
        const location=this.storage.physicalPath(basePath);
        const same=this.active?.location===location;
        const relocated=!same && !!this.active?.prepareRelocatedReopen(location);
        if(this.active && !relocated) this.current();
        const candidate=same ? this.active! : this.storage.open(basePath,expectedCreationOperationId);
        let staged: ReturnType<UniverseApplication['stage']> | undefined;
        try {
            if(same) this.current();
            const p=candidate.snapshot();
            if(expectedCreationOperationId && p.creationOperationId!==expectedCreationOperationId) throw new UniverseFailure('INTEGRITY_MISMATCH','Reopen the project belonging to the pending creation.');
            try {staged=this.universes.stage(universePath ?? p.universeLocation,p.universeId);}
            catch(e) {if(!universePath) throw new LocateProjectUniverse(p.universeId); throw e;}
            assertWorkspaceState([...candidate.workspace.snapshot().records,...staged.workspace.snapshot().records]);
            candidate.bind(staged.snapshot.location);
            const identity=candidate.snapshot(), previous=this.active;
            const universe=staged.commit(); this.active=candidate;
            if(!same && previous) this.retired.push(previous);
            this.releaseRetired();
            return {...identity,universe};
        } catch(e) {if(!same) candidate.releaseCandidate(); staged?.cancel(); throw e;}
    }
    private releaseRetired(): void {
        this.retired=this.retired.filter(store=>{try {store.close();return false;} catch {return true;}});
    }
    close(): void {
        this.active?.close(); this.active=undefined; this.releaseRetired();
        if(this.retired.length) throw new UniverseFailure('RECOVERY_REQUIRED','Previous project ownership could not be drained. Retry closing before shutdown.','unknown');
    }
}
