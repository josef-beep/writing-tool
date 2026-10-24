---
title: 'Keep ordinary saves fast and free of unnecessary reconciliation'
type: bugfix
created: 2026-10-22
status: in-review
route: dispatch
baseline_commit: 03687967ba70c0adf49e746b5fa3eddbce997421
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="User requests both recurring reconciliation and slow saving fixed; standing execution approval covers routine implementation and verification">

## Intent

Ordinary writing repeatedly encounters reconciliation and saving takes too long. Correct undispatched-operation outcome classification, keep genuine unfinished saved copies discoverable without repeated recovery alarms, and remove measured redundant history-comparison work from durable saves.

## Boundaries & Constraints

Preserve typed IPC, sender authorization, genuine unknown live-save/recovery gates, original operation identities, current/history validation, journals, catalog decisions, fences and every durability flush. Keep actual writing and its unfinished backup evidence untouched; verify only temporary fixtures. Preserve pre-existing planning and `.webpack` changes. Both reported tasks are expressly in scope. No migrations, automatic discard/replay of unknown work or product-rule changes.

## I/O & Edge-Case Matrix

| Scenario | Input | Expected behavior | Failure behavior |
| --- | --- | --- | --- |
| Authority overlap | Authorized valid save arrives while another operation owns the gate | Correlated not-committed busy/retry response; draft retained; no invented pending save | Unauthorized/malformed requests still reject |
| Real interruption | A sent save loses its acknowledgment | Original operation and genuine reconciliation remain | Never falsely report not committed |
| Retained history | Same live records with growing valid history | Validation preserves exact descriptor equality with linear identity lookup; faster measured preparation | Removed/altered/duplicate immutable descriptors still reject |
| Old backup copy | Pending capture/backup/export exists on restart | Remains available in recovery with a quiet nonblocking status | Unknown live operations retain attention and authority gates |
| Completion | Pending copy reconciles successfully | Inventory/banner reflects removal without relaunch | Failed reconciliation preserves original evidence |

</frozen-after-approval>

## Code Map

- `src/infrastructure/workspace-storage.ts`: validateJournalPlans uses nested canonical comparison over retained versions, measured 1,268 ms for 1,000 descriptors. prepare repeatedly scans versions; writeIndexes prepares INSERT per row; snapshot rereads live paths through both records/files. Reuse local maps, prepared statements and per-snapshot read buffers only; no global cache or skipped integrity checks.
- `src/desktop/main.ts`: workspace/universe gate rejection throws before dispatch, causing preload to classify a new save as unknown. Separate authorization/shape rejection from known unsent busy responses. Existing RECOVERY_REQUIRED code plus not-committed/new-request are legal protocol values. Preserve pending operations for genuinely sent originals. Pending protection cleanup lacks a dedicated inventory-change event.
- `src/desktop/preload.ts`, `src/presentation/index.tsx`: bridge pending-inventory changes and distinguish safe unfinished copies from blocking live operations. Current startup banner counts every pending ID and demands reconciliation. Reuse pending/deferrable arrays; keep recovery access and exact evidence.
- `tests/workspace-coordinator.test.ts`, `tests/universe.test.ts`, `tests/fixtures/desktop-integration.cjs`, `scripts/verify-desktop.mjs`: extend registered semantic/integrity regressions and real Electron harness. Add one desktop scenario for busy unsent saves and pending inventory transitions, using held utility acknowledgments and temporary roots. Keep existing lost-ack and recovery tests.
- Existing application snapshots repeat full project/universe validation. Avoid broad port redesign or long-lived caching in this fix; report any remaining cost honestly.

## Tasks & Acceptance

- [ ] Optimize storage's repeated retained-version/asset comparisons, version membership and SQLite statement preparation without changing publication/validation semantics; reuse duplicate reads within one snapshot if useful.
- [ ] Return valid known-unsent results at native gates, including existing-blocking-operation rejection of a new save; keep original unresolved operations protected.
- [ ] Publish pending-inventory notifications and show safe saved copies as nonblocking status with review access, while retaining live recovery warnings.
- [ ] Add and run negative retained-history regressions, busy/uncertain distinction and actual desktop inventory/normal-close regressions. Record before/after comparison timings and representative complete temporary saves without flaky absolute-time test assertions.
- [ ] Run typecheck/lint, registered regression suite and focused actual desktop checks; document limitations and preserve unrelated files.

Given unchanged valid historical descriptors, when a chapter saves, then exact immutable-history guarantees and durable receipts remain while comparison work scales linearly. Given an unsent save overlapping background work, when it is refused, then retrying later needs no reconciliation for that new save. Given successful normal close/reopen, when startup checks pending work, then no pending job is fabricated. Given a real old failed backup, when writing resumes, then its evidence remains available without an urgent live-write warning.

## Implementation Notes

- Investigation read only live protection metadata: one attempted Close backup remains started without output proof; 103 completed job files are not pending sources. Do not delete or mark that old operation complete. The save-validation CPU bottleneck and overlapping native gate classification are independently reproduced from source/isolated fixtures.
- Dirty tree contains prior authorized planning and generated bundles; preserve them. No human-only decisions or irreversible actions are needed. Standing approval covers proceeding without another phase checkpoint.

## Verification

Use existing registered Node tests, typecheck/lint and temporary Forge desktop scenarios. Retain performance/evidence under implementation artifacts; distinguish isolated comparison speed from end-to-end save latency and local checks from installed-platform acceptance.
