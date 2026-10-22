---
title: 'Keep writing usable after backup failures and restore predictable keyboard controls'
type: bugfix
created: 2026-10-22
status: done
route: oneshot
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="User reports the previous fix still blocks everything and requests usable keyboard controls">

## Intent

Fix the repeated reconciliation failure and remove global document-editing locks caused by unfinished backup/export/revision copies. Retain original evidence without requiring successful reconciliation or writing another metadata marker to return to normal editing. Unknown document saves and live recovery mutations remain protected. Fix keyboard conflicts, standard Save/Close behavior and modal focus so recovery and writing can be operated predictably.

</frozen-after-approval>

## Implementation Notes

- Small reversible continuation of the previous fix; no unresolved product choices, migrations or data deletion. Preserve the user's generated .webpack changes. Validate only temporary fixtures and copies of the real immutable recovery evidence.
- Found a second failed Close backup after the first was deferred; both durable jobs are started with no output publication evidence. A saved-copy failure still enters the global authority set and recreates the lock on every close.
- ProtectionPanel also blocks Back/navigation for safe pending jobs, and continuing requires successful marker publication. The policy should distinguish copies from live mutations directly, across restarts.
- Global keyboard handlers ignore handled/composing/Alt events and intercept modified shortcuts. Save handlers compete, Ctrl+W attempts to close a universe while a project is open, timeline zoom consumes editor shortcuts, and dialog focus overrides React autoFocus with Retry.
- Code map: `src/desktop/main.ts` authority checks; `src/presentation/workspace/ProtectionPanel.tsx` and `Workspace.tsx` local guards; `src/presentation/index.tsx` Shell recovery refresh/keyboard; `Dialog.tsx` focus; shared keyboard classifier and focused integration tests. Root-cause investigation works from copied history under /tmp.
- Actual backup failure reproduced from copied real history: all 27 project and 14 universe captures passed independent content/catalog validation. ZIP creation then failed its own reader with Corrupt archive bytes on a 1,953,863-byte PNG, although an independent ZIP reader verified all 59 archive entries. `ArchiveStorage.read` reused the same 262,144-byte input buffer while fflate retained views of earlier chunks. Copying each input chunk fixes the exact real-history reproduction. Original stores were never opened for writing or mutated.
- Native authority checks now distinguish unfinished saved copies from uncertain live changes. Safe pending jobs stay discoverable, preserve their immutable captures and retention protections, and no longer block project/universe operations, saves or normal close. Back/Continue does not depend on another successful metadata write. Existing explicit deferral protocol remains compatible.
- Failed safe-copy reconciliation cannot silently switch another active project: it asks the user to open the original owning project/universe through normal saved-work guards. Reconciliation attempts preserve the original job identity even when a concurrent authority operation rejects the attempt.
- Allowed authority commands restore a crashed utility host consistently. A separate restoration flag remains set until original permanent identities are verified, allowing retries after reopening fails without accepting an empty or foreign workspace.
- Shared keyboard classification excludes handled, composing, Alt/AltGr, repeated and unsupported modified commands. Shell and Workspace have explicit Save ownership; Ctrl/Cmd+W closes the profile or current project. Text editing does not change timeline zoom. Dialogs preserve autofocus, contain Escape/Tab and restore their opener. Profile close restores the visible manuscript's focus.

## Review Triage Log

- Medium, patched: a failed authority reopen cleared hostExited too early and let later attempts skip restoration. Keep authorityRestorePending true until complete identity validation succeeds.
- Medium, patched: only workspace requests revived the host after Continue. Centralized restoration is now used by allowed project/universe/workspace/protection operations; the desktop test kills the host and immediately invokes Edit universe profile before saving.
- Medium, patched: safe-copy reconciliation could open project A while editing B and discard local panel context. Refuse cross-context copy reconciliation with an actionable message; switching owning roots must use the existing saved-work navigation flow.
- Medium, patched: Shell's separate dialog captured focus after React autofocus. Capture the opener before the modal commits and restore it on cancellation; the actual Electron test verifies textarea focus after Escape.
- Medium, patched: live-operation protection was tested only through defer rejection. Desktop regression now asserts project, workspace and universe operations stay blocked and native close does not start captures while an actual live recovery operation is pending, alongside safe copies.
- Medium, patched: shortcut unit results alone missed listener ordering and focus behavior. Actual desktop input now covers manuscript/profile Ctrl+S, project/profile Ctrl+W, editor zoom preservation, both modal implementations, Enter on Continue, Tab/Shift+Tab containment, Escape cancellation and manuscript focus restoration.

## Verification

- `npm test`: 98 tests passed, zero failed. Includes a new large-archive roundtrip regression proven to fail with the original reader, plus keyboard classification cases.
- `npm run typecheck`, `npm run lint`, `git diff --check`: passed.
- `npm run test:desktop -- reconcile-defer reconcile-background menus`: passed, including the separate restart scenario. Evidence: `/tmp/writingtool-desktop-verification-IrNPjk`.
- Desktop checks retain multiple old backup jobs without blocking startup/edit/save/close; Continue works with read-only pending metadata and after host death; unknown live recovery still blocks authority changes. Final closing ZIP contains writing saved after the failure.
- Exact copied real-history backup now writes and validates successfully with the fixed source. Live application profile/writing data remained untouched. Linux executed; Windows/macOS were not exercised.
- User's pre-existing generated `.webpack` modifications are preserved and excluded from the source commit. Restarting the development app is required to load the new source.
