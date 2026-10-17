import { type CreateInput, type SaveInput, type SaveReceipt, type UniverseSnapshot, type UniverseErrorCode, type ReconciliationExpectation } from './contracts/universe';
export class UniverseFailure extends Error {
    constructor(public code: UniverseErrorCode, message: string, public outcome: 'not-committed' | 'committed' | 'unknown' = 'not-committed', public committedReceipt?: SaveReceipt) {
        super(message);
    }
}
export interface UniverseStore {
    readonly location: string;
    snapshot(): UniverseSnapshot;
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
}
export class UniverseApplication {
    private active: UniverseStore | undefined;
    constructor(private storage: UniverseStorage) {
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
