---
title: 'Restore reconciliation and closing after an unfinished backup'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Fix the recovery flow that leaves Electron unable to close after an unfinished protection operation. Users must be able to find and reconcile pending operations, refresh the authoritative project/universe state successfully, and close after recovery. Preserve existing edits, writing data, archive proof and shutdown protections.

</frozen-after-approval>

## Implementation Notes

Investigation reproduced the exact persisted prepared backup using temporary copies of the application data and owning universe. The ZIP passes validation and matches its durable digest. Reconciliation succeeds and removes native pending metadata, but Shell's concurrent currentProject/currentUniverse refresh races the main process's exclusive authority guard and raises 'Universe request denied'. The Universe reconciliation menu is disabled for protection operations because it only considers profile saves. Recovery's recent-root read is also unnecessarily rejected while pending work exists.

No intent gaps or irreversible actions. Scope: Shell recovery refresh/discovery, main read-only recents access, targeted regression verification. Use the one-shot route. Preserve all unrelated working-tree changes; do not commit the user's mixed in-progress implementation.

Implemented: sequential authoritative context reads; preserve the recovery panel while other protection operations remain pending; startup/close-abort recovery warning; general reconciliation menu routes to recovery when no profile save is pending; read-only recent roots remain available during recovery; prepared native reconciliation notifies the UI so cleared operations disappear.

## Review Triage Log

- Medium, patched: native prepared/no-execution reconciliation cleared metadata without notifying the pending banner. Emit the existing recovered-context notification after clearing.
- Medium, patched: with multiple pending operations, project.current remains blocked after the first reconciliation. Check pending protection operations before refreshing roots and keep the recovery panel until they are all resolved.

## Verification

- Read-only inspection of the real pending job and archive: exact SHA-256 match; complete archive validation passed. Original user profile/writing roots were never mutated.
- Temporary copied profile + cloned universe with rebound test catalog, compiled source main/utility/renderer, actual Electron: reproduced pre-fix 'Universe request denied' and false refresh error after successful reconciliation.
- Same Electron fixture after fixes: Universe reconciliation menu enabled; recent roots shown; published archive reconciled; a second prepared/no-execution operation reconciled without false refresh errors; pending metadata empty; warning cleared; owning universe restored; closing revision and backup completed into temporary profile; window closed and Electron exited successfully (exit 0).
- `npm test`: readiness 11/11 and universe 31/31 passed; smoke runner 3/4, with the existing stdout-drain test failing ('expected one result, received 0'). Focused rerun reproduces the same smoke failure. No smoke-runner code changed.
- `npm run typecheck`: blocked by existing errors in contracts/protection, domain/manuscript/workspace, infrastructure/protection-service/recovery and Workspace. No errors reported for this fix's Shell/main changes.
- `npm run lint`: blocked by existing warnings across the repository. Focused Shell lint passes; main has its pre-existing unused WorkspaceRequest import warning.
- `git diff --check` for edited source passes.

No changes were made to webpack resolution: the reproduced failure was authority-request concurrency and recovery access, rather than module resolution. No commit was created because the working tree contains a large mixed implementation already in progress, including both edited source files; preserve those existing changes for the user's intended commit boundary.

### Continuation verification — 2026-10-19

The smoke runner's prior failure was traced to restricted subprocess execution in the tool sandbox, rather than runner code. All four runner tests pass outside it. The continuation validation cleanup clears typecheck/lint and all 46 tests pass; all three Forge development bundles compile. Final isolated Electron verification again reconciles both prepared and published pending jobs and closes normally. See spec-fix-validation-blockers.md.
