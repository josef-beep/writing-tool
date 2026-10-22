---
title: 'Continue writing after failed backup reconciliation'
type: bugfix
created: 2026-10-22
status: done
route: oneshot
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="User requested fixing writing and supplied renderer configuration">

## Intent

Restore working chapter manuscript editing in the Electron renderer. Verify that real text input, formatting, saving and reopening preserve the manuscript using the existing isolated renderer and authoritative storage.

User clarified that failed reconciliation blocks subsequent work and explicitly requested a way past it. Provide Continue writing for unfinished backups, exports and revision captures, retaining their original durable metadata and payloads for later reconciliation. Persist this choice across restarts. Keep uncertain live document saves and recovery application protected. A deferred operation must never be reported as completed. Normal close still creates a fresh complete revision and backup.

</frozen-after-approval>

## Implementation Notes

- No unresolved product choices or irreversible operations. Use temporary project/universe fixtures for verification.
- Investigated `webpack.renderer.config.ts`, shared loader rules, installed Lexical 0.52 exports, manuscript editor/adapter and the desktop test harness. Typechecking passes. The generated development bundle has one Lexical instance; duplicate-module aliasing is unsupported by current evidence.
- Expected footprint: a focused runtime/configuration correction plus a manuscript scenario in `scripts/verify-desktop.mjs` and `tests/fixtures/desktop-integration.cjs`.
- Added a real Electron writing regression: create story/chapter through forms; click manuscript; insert Unicode text; type Enter and a letter; apply keyboard bold and heading style; verify authoritative saved text/formatting; close/reopen project and confirm formatting. This passes without any application or Webpack configuration changes. Evidence: `/tmp/writingtool-desktop-verification-zBAGW8/writing.log` and `results.json`.
- A temporary production-mode build also passed basic typing/saving (`/tmp/writingtool-desktop-verification-LH0APc`). Removed that temporary test mode after the probe. `npm start` itself has not been exercised in this investigation.
- No root cause or user-facing fix established. Do not mark this issue resolved. Requested the exact symptom asynchronously; stop dependent repair work until reproduction details arrive.
- Continuation: user supplied the failure. Local read-only metadata inspection found an attempted Close backup with a started job. Both UI guards and main's unresolved authority set prevent progress after reconciliation fails.
- Updated scope is a small reversible lifecycle extension: a named protection.defer command, optional deferred metadata on safe native pending jobs, shared classification, Continue writing controls, pending-capture retention protection, and desktop failure/restart regression coverage. No product choice remains unresolved. Never mutate the real user profile during verification.
- Implemented `protection.defer` for backup/capture/export operations. Persist the deferred marker before removing only that operation's authority block; startup validates the marker and preserves its nonblocking state. Original native metadata, durable job and captured bytes remain available. Uncertain recovery/live saves cannot be deferred.
- Both recovery and background failure surfaces offer Continue writing. Multiple jobs stay visible until each blocker is resolved or safely set aside. Deferred jobs remain labeled for later reconciliation. Reopen a crashed utility host's active roots before continuing; synchronize the Shell when deferred reconciliation changes context, including canceled/error attempts. Do not notify a successful recovery context while unrelated unresolved authority work remains.
- Pending revision/archive identities now participate in retention and manual deletion checks. New captures can complete without deleting older deferred operation evidence. Normal closing still captures the latest writing and creates a complete ZIP.
- The real local profile was inspected read-only to identify the stuck job. All reproduction, publication failure, permission failure, crash, restart, editing, deletion and closing checks used temporary fixtures only.

## Code Map

- `webpack.renderer.config.ts`, `webpack.rules.ts`: inspected renderer loaders; no evidence for a configuration correction.
- `src/presentation/manuscript/ManuscriptEditor.tsx`, `adapter.ts`: Lexical editor and WRT/formatting conversion; exercised successfully in desktop test.
- `scripts/verify-desktop.mjs`, `tests/fixtures/desktop-integration.cjs`: registered new `writing` desktop scenario.
- `src/application/contracts/protection.ts`: closed deferral protocol, original-operation correlation, saved-copy classifier, validated pending/deferrable/deferred result sets.
- `src/desktop/main.ts`: durable native pending state, explicit deferral, original-result correlation, safe host restart and authoritative context synchronization.
- `src/presentation/workspace/ProtectionPanel.tsx`, `Workspace.tsx`, `src/presentation/index.tsx`: Continue writing controls, remaining-job guards, retained-job discovery, authoritative Shell refresh after deferral.
- `src/infrastructure/protection-service.ts`: pending revision/archive retention protection; native-only deferral cannot execute in the utility service.
- `tests/protection-deferral.test.ts`: seven registered contract and real storage/publication/retention tests.

## Review Triage Log

- Medium, patched: canceled reconciliation of an already deferred operation can switch the host's owning project while leaving the renderer on its previous context. Synchronize authoritative context on canceled/error outcomes and notify only when unrelated authority blocks permit refresh.
- Medium, patched: missing coverage for utility-host death before Continue writing. The native desktop fixture kills the actual utility host after reconciliation fails; deferral reopens the original active identities and subsequent edits/saves succeed.
- Medium, patched: missing coverage for failed deferred-marker publication. The Linux desktop fixture makes the pending directory unwritable, observes EACCES, verifies the marker remains unset and project opening remains blocked, restores permissions and retries successfully.
- Medium, patched: classifier-only proof that recovery application cannot be deferred. The desktop fixture now seeds an actual pending apply operation, checks native deferral rejection and unchanged metadata, then reconciles its proven-unsent preparation normally.
- Low, limited verification: the combined fault sequence of an unknown live manuscript save alongside an already deferred backup is not exercised end to end. Checked that native deferral requires a pendingProtection entry, removes only its own UUID and leaves pendingWorkspace untouched. Added an explicit notification guard while any unrelated unresolved authority remains. More fault plumbing is disproportionate to this remaining test gap; no bypass of live saves was found.
- Medium, patched: missing desktop coverage for the background escape after canceled closing. The fixture changes a real completed output before native verification, cancels the failed close, uses Continue writing from the background dialog, saves more writing and closes normally. The scheduled-failure surface uses the same handler.
- Low, rejected: additional startup-corruption tests for invalid deferred flags. The loader explicitly rejects deferred:false and deferred:true on every command outside the saved-copy classifier; the only application writer emits true after classification. Closed request/result validation and actual persisted restart are tested. No normal application path emits the proposed invalid records.
- Medium, patched: closing checks did not inspect new output bytes. Desktop verification now opens the actual closing ZIP and checks it contains the manuscript written after deferral/restart. Original deferred evidence remains present.

## Verification

- `npm test`: 94 passed, zero failed. Includes seven new tests using real catalogs, workspaces, backups, export pins and retention rules.
- `npm run typecheck`, `npm run lint`, `git diff --check`: passed.
- `npm run test:desktop -- reconcile-defer reconcile-background`: passed, including the second-process restart scenario. Final evidence: `/tmp/writingtool-desktop-verification-1cY4dM`.
- Desktop coverage: actual failed backup reconciliation; native rejection of live recovery deferral; unwritable-marker failure retaining the authority block; real utility-host death/reopen; multiple pending operations; pointer/keyboard writing, bold/headings, save/reopen; retained evidence across full application restart; canceled failed closing/background escape; fresh closing ZIP content.
- Windows/macOS execution was not performed. Permission-denial injection is Unix-specific; the writing/defer implementation remains cross-platform.
