---
title: 'Allow retry and exit after project creation fails before writing'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Fix project creation failures that falsely require reconciliation and prevent Exit when no project creation has begun. Give clear universe/project selection guidance, reject an invalid universe before the second picker, preserve genuine uncertain/committed operations and pending edits, and verify failed creation followed by close in the same Electron session.

</frozen-after-approval>

## Implementation Notes

The new screenshot exactly matches FileUniverseStorage.open's unknown-outcome error. ProjectApplication.create stages the universe before invoking project storage, but propagates the universe-opening outcome as though it described project creation. Main retains pendingProjectCreation and Shell sets projectUncertain, despite the selected project folder remaining empty. Shell also rejects quit whenever any error dialog is open. Fix the outcome only for the pre-creation stage, preserve post-creation committed/unknown outcomes, and permit quit past a Shell error while retaining all pending/dirty/busy guards. Add regression tests for preflight failure and post-write activation failure. Main validates universe discovery before asking for a project destination and labels both selection steps.

Implemented known-not-committed project outcome for failed universe staging before project storage is called. Invalid universe discovery is rejected after the first picker; selection titles now explicitly say 1 of 2 and 2 of 2. Native quit may dismiss a plain Shell error while preserving busy, pending-operation, dirty-edit and workspace/protection guards.

## Review Triage Log

Independent review found no confirmed correctness or safety findings in the scoped changes. Existing post-creation activation failure semantics remain committed and covered by a regression test. Review noted an existing prior-authority failure before staging as outside the new catch; no broad remapping of post-write or active-authority uncertainty was introduced.

## Verification

- New project tests: failed universe preflight leaves destination empty, returns not-committed, and allows retry; successful create/reopen satisfies the transport contract; post-write activation failure retains committed outcome and can be reopened.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test` with subprocess support: 49/49 passed.
- Actual Electron scenario 1: empty/invalid universe selection rejected after one picker, no project-reconciliation warning, untouched empty destination; native Close while error dialog remains visible closes window and process exits 0.
- Actual Electron scenario 2: universe discovery present but underlying files absent reproduces the screenshot's original error; now reports no project created, two numbered pickers, no false uncertainty, and native Close exits 0 while the error remains visible.
- Actual Electron scenario 3: valid universe, two numbered creation pickers, successful create, required closing revision and complete backup, window close and exit 0.
- Actual Electron scenario 4: temporary copied and rebound `/home/jo/Documents/Stories` universe (Luminous), successful project create then complete closing protection and exit 0. Original user universe and Compendium folder were not modified.
- Forge-generated development main, renderer and sandboxed preload builds all passed under a temporary output directory.
- `git diff --check`: passed.

No commit across the user's existing mixed implementation work. Restart the development app to load main-process changes; select `/home/jo/Documents/Stories` in step 1 and `/home/jo/Documents/Stories/Projects/Compendium` in step 2.

### Normal Forge launch verification — continuation

Verified the application through `npm start -- --app-path <temporary test bootstrap> -- --no-sandbox`, exercising Forge's actual development compiler, HTTP renderer server, sandboxed preload and compiled utility host. All repository `.webpack` development bundles were rebuilt from the current source.

- Invalid first universe selection: only picker 1 opens, known validation error, no false project uncertainty, native close from the visible error dialog reaches WINDOW_CLOSED and exits 0. Log: `/tmp/writingtool-forge-invalid.log`.
- Successful creation using the temporary copy of Stories/Luminous: both numbered creation pickers, active project confirmed, required closing backup picker, WINDOW_CLOSED, normal exit 0. Log: `/tmp/writingtool-forge-valid-long.log`.
- Discovery metadata present but required universe files absent: reproduces the screenshot's opening failure after both pickers, returns not-committed/no-project-created, and exits normally from the visible error dialog. Log: `/tmp/writingtool-forge-broken.log`.

The first successful-creation check used a 12-second test-only deadline and interrupted a closing backup before publication; the deadline was increased to 60 seconds and UI status reporting added. The subsequent normal Forge run completed its backup and exit without application source changes. No pass is inferred merely from Forge's launcher exit code: the successful runs include explicit WINDOW_CLOSED and EXIT_RESULT records with exitCode 0. These tests used isolated profiles, temporary project folders and a copied universe; the original Stories and Compendium folders were not modified.

`git diff --check` passes. No additional application code or webpack configuration changes were needed in this continuation.
