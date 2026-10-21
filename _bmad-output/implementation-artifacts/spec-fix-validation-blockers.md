---
title: 'Clear validation blockers for the recovery build'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Continue the close/reconciliation fix by clearing the reported build and lint blockers and verifying that the normal Electron build can run. Preserve existing implementation changes, validation rules, recovery evidence and user data.

</frozen-after-approval>

## Implementation Notes

No intent gaps or irreversible actions. Changes are limited to explicit inferred string parameter types, stable local references for TypeScript narrowing, unused imports/bindings, and documented intentional control-character checks. Smoke-runner tests pass outside the restricted subprocess sandbox; no runner change is needed. Use the existing build workflow's one-shot path. Preserve the user's mixed working tree without committing it.

Implemented stable local references for validated styles, birth components, calendar data and revision units; explicit string defaults for revision/archive IDs; object validation before typed job-field reads. Removed unused imports and bindings, and added line-local explanations for deliberate control-character matching and scope snapshot iteration. No schema or recovery rule changes.

## Review Triage Log

- Low, patched: the initial manifest narrowing guard duplicated its closed-object and array checks; removed the redundant checks and consistently reused the validated units local.
- Independent review found no correctness regression in the scoped cleanup. The reviewer measured the overall mixed diff rather than this cleanup, so its size arithmetic is not evidence about this patch's scope.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed without warnings.
- `npm test` with actual subprocess support outside the restricted sandbox: 46/46 passed (11 readiness, 31 universe, 4 smoke runner).
- Full development configuration generated through Forge's WebpackConfigGenerator using the repository's actual main/renderer configurations and plugins: main, renderer and sandboxed preload bundles all passed, emitted under /tmp/writingtool-forge-build-3GjrR4.
- Final actual Electron regression using copied profile and universe: menu recovery available, multiple unfinished jobs reconciled, pending warning cleared, required closing revision/backup succeeded, window closed, process exited 0. A late presentation IPC after handler disposal logged during shutdown; shutdown still completed normally.
- `git diff --check`: passed.
- Original user profile and writing roots preserved. Temporary test backups stayed under the copied test profile. No commit made across the user's mixed implementation work.
