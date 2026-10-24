import type {WorkspaceUnitSnapshot} from './contracts/workspace';
import type {WorkspaceUnitPort} from './contracts/workspace-ports';
import { type CreateInput, type SaveInput, type SaveReceipt, type UniverseSnapshot, type UniverseErrorCode, type ReconciliationExpectation } from './contracts/universe';
export class UniverseFailure extends Error {
    constructor(public code: UniverseErrorCode, message: string, public outcome: 'not-committed' | 'committed' | 'unknown' = 'not-committed', public committedReceipt?: SaveReceipt) {
        super(message);
    }
}
export interface UniverseStore {
    readonly location: string;
    workspace: WorkspaceUnitPort;
    snapshot(): UniverseSnapshot;
    readSnapshot(): {identity:UniverseSnapshot;workspace:WorkspaceUnitSnapshot};
    save(input: SaveInput): SaveReceipt;
    recover(): void;
    prepareRelocatedReopen(basePath: string, expected: ReconciliationExpectation): void;
    validateExpected(expected: ReconciliationExpectation): void;
    reconcile(operationId: string, expected?: ReconciliationExpectation): SaveReceipt | undefined;
    close(): void;
}
export interface UniverseStorage {
    create(basePath: string, input: CreateInput): {
        store: UniverseStore;
        receipt: SaveReceipt;
    };
    open(basePath: string, expected?: ReconciliationExpectation): UniverseStore;
    physicalPath(basePath: string): string;
    identity(basePath: string): {ownerId: string; rootId: string};
}
export class UniverseApplication {
    private active: UniverseStore | undefined;
    private retired: UniverseStore[] = [];
    constructor(private storage: UniverseStorage) {
    }
    workspaceAuthority(): WorkspaceUnitPort | undefined { return this.active?.workspace; }
    readWorkspace(): {identity:UniverseSnapshot;workspace:WorkspaceUnitSnapshot} | null {
        return this.active?.readSnapshot() ?? null;
    }
    current(): UniverseSnapshot | null {
        return this.active?.snapshot() ?? null;
    }
    create(basePath: string, input: CreateInput): {
        snapshot: UniverseSnapshot;
        receipt: SaveReceipt;
    } {
        // Refuse predictable departure failures before reserving another root.
        this.active?.snapshot();
        const { store, receipt } = this.storage.create(basePath, input);
        try {
            return { snapshot: this.activate(store), receipt };
        }
        catch {
            throw new UniverseFailure('RECOVERY_REQUIRED', 'The universe was created and saved in the selected folder, but activation failed. The previous context and the durable creation receipt were preserved.', 'committed', receipt);
        }
    }
    open(basePath: string, expected?: ReconciliationExpectation): UniverseSnapshot {
        if (this.active?.location === this.storage.physicalPath(basePath)) {
            if (expected)
                this.active.validateExpected(expected);
            this.active.recover();
            return this.active.snapshot();
        }
        if (expected)
            this.active?.prepareRelocatedReopen(this.storage.physicalPath(basePath), expected);
        return this.activate(this.storage.open(basePath, expected));
    }
    stage(basePath: string, expectedId?: string): { snapshot: UniverseSnapshot; workspace:WorkspaceUnitPort; commit(): UniverseSnapshot; cancel(): void } {
        // Validate existing authority before preparing any candidate transition.
        this.active?.snapshot();
        const location = this.storage.physicalPath(basePath);
        if (this.active?.location === location) {
            const snapshot = this.active.snapshot();
            if (expectedId && snapshot.ownerId !== expectedId)
                throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
            return { snapshot, workspace:this.active.workspace, commit: () => snapshot, cancel: () => undefined };
        }
        if (expectedId && this.storage.identity(basePath).ownerId !== expectedId)
            throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
        const candidate = this.storage.open(basePath);
        let consumed = false;
        try {
            const snapshot = candidate.snapshot();
            if (expectedId && snapshot.ownerId !== expectedId)
                throw new UniverseFailure('INTEGRITY_MISMATCH', 'Select the universe associated with this project.');
            return { snapshot, workspace:candidate.workspace, commit: () => {
                // No fallible candidate I/O remains after this authority switch.
                if (!consumed) {
                    if (this.active) this.retired.push(this.active);
                    this.active = candidate;
                    consumed = true;
                    this.releaseRetired();
                }
                return snapshot;
            }, cancel: () => { if (!consumed) { consumed = true; candidate.close(); } } };
        } catch (e) { if (!consumed) candidate.close(); throw e; }
    }
    private releaseRetired(): void {
        this.retired = this.retired.filter(store => {
            try { store.close(); return false; }
            catch { return true; } // Retain ownership for a later drain attempt.
        });
    }
    reconcile(operationId: string, expected?: ReconciliationExpectation): SaveReceipt | undefined {
        return this.active?.reconcile(operationId, expected);
    }
    save(input: SaveInput): {
        snapshot: UniverseSnapshot;
        receipt: SaveReceipt;
    } {
        if (!this.active)
            throw new UniverseFailure('VALIDATION', 'Open a universe before saving.');
        const receipt = this.active.save(input);
        return { snapshot: this.active.snapshot(), receipt };
    }
    close(): void {
        this.active?.close();
        this.active = undefined;
        this.releaseRetired();
        if (this.retired.length)
            throw new UniverseFailure('RECOVERY_REQUIRED', 'Previous universe ownership could not be drained. Retry closing before shutdown.', 'unknown');
    }
    private activate(store: UniverseStore): UniverseSnapshot {
        try {
            const snapshot = store.snapshot();
            this.active?.close();
            this.active = store;
            return snapshot;
        }
        catch (error) {
            store.close();
            throw error;
        }
    }
}
