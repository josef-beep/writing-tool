---
title: 'Allow explicit application exit after errors while retaining recovery data'
type: bugfix
created: 2026-10-22
status: done
route: oneshot
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="User explicitly requested fixing applications refusing to close after errors">

## Intent

An error must not trap the user in the application. Replace the native OK-only close refusal with a choice to keep working or quit, and provide the same quit action from error and failed-close dialogs. Before an explicit error exit, retain current editor drafts and the original pending operation inputs in a local recovery copy, without declaring uncertain operations successful or deleting their evidence. Preserve the normal save/discard/cancel flow.

</frozen-after-approval>

## Implementation Notes

- Screenshot matches the combined native close gate in main.ts, which reports transient work and unknown mutations with the same unhelpful message. The real profile currently contains an attempted protection.capture; that safe-copy record alone does not explain the native blocker. User writing/profile records were inspected read-only.
- Current source has no alternative exit from that native guard. Error exit will be explicit and confirmed, with current drafts and main-process recovery context saved before releasing the process. Interrupted transaction journals and native protection records remain available.
- Reuse the purpose-bound quit notification and normal Electron shutdown cleanup. Add a constrained recovery-quit notification, draft collection events from Shell/Workspace, a reusable quit button for error dialogs, and focused native/renderer failure desktop checks. No new service, external side effect or irreversible migration. Existing generated .webpack changes belong to this session's build and are excluded from source edits/commit.
- Also prevent verified phantom blockers: recent-root bookkeeping must not hide acknowledged universe creation; reconciliation without an existing native pending operation must not invent an unresolved operation.

- Implemented confirmed native error exit from both the native close gate and renderer error/failed-backup dialogs. Error exit can preempt a stalled renderer close decision. It sets the normal Electron shutdown permit after retaining recovery context, releases the utility through existing before-quit cleanup, and leaves pending protection records/journals intact. It does not report the interrupted operation as successful.
- Recovery copies contain exact main-process profile/workspace/protection inputs, active owning identities, latest Shell/Workspace/proposal drafts, queued layout settings, current Lexical state and visible editor text. Readable manuscript/profile text files accompany recovery.json. A startup notice opens the saved recovery directory.
- Collection has a five-second deadline, validates expected collectors and records collector errors. If collection or publication fails, a separate explicit choice permits exit without a complete copy; Keep application open restores interactivity. The application never chooses that data-loss option automatically.
- Recovery exit tracks ownership of its drain lock. Canceling a second close attempt cannot admit new authority requests while the first native root-close response remains pending.

## Review Triage Log

- Medium, patched: normal close could wait indefinitely for a renderer decision and silently ignore further close attempts. A subsequent native close now offers the explicit recovery exit; close-stalled holds the first renderer decision and verifies the escape.
- High, patched: missing or failed collectors could silently produce an incomplete recovery copy. Each hook reports failures, and native collection requires both Shell and Workspace state before treating the copy as complete. Failures retain available data and require the explicit no-complete-copy decision.
- High, patched: manuscript adapter errors can leave Workspace state older than visible text. Recovery now captures current Lexical state and raw editor contents independently; desktop coverage verifies newer visible text is retained alongside the last submitted workspace mutation.
- Medium, patched: pending panel layout patches were absent from settingsDraft. Workspace collects the queue applied to the current saved layouts through a live getter, retaining failed layout changes.
- Medium, patched: copies were difficult to find after relaunch. A startup notice opens the retained recovery directory; recovery-notice verifies discovery in a second Electron process using the same temporary profile. Empty failed-publication directories do not count as saved copies.
- Medium, patched: collection timeout lacked runtime verification. error-quit-timeout withholds executeJavaScript indefinitely, then verifies the bounded warning and successful explicit exit with native pending inputs retained.
- Medium, patched: recovery-write-failure cancellation was untested. error-quit-copy-keep blocks the recovery path, declines no-copy exit, verifies the document is interactive and the manuscript remains intact, then repairs the test path and successfully quits with a copy. A separate scenario confirms the explicit no-copy exit remains available.
- Medium, patched: profile and combined-proposal collectors lacked runtime checks. error-profile-quit verifies dirty profile text and original pending save inputs. combined-error-quit creates an actual revision/conflict, edits a combined chapter proposal, injects its save error and verifies exact proposal text and heading formatting in the recovery copy.
- High, patched (follow-up): canceling a second close could clear another request's drain lock. Only the flow that acquired the drain lock can clear it. close-drain-cancel holds an actual utility project.close response, cancels the second exit, verifies authority remains blocked, then releases the first close. Independent follow-up inspection confirms resolution.

No review findings deferred.

## Verification

- npm run typecheck and npm run lint passed; git diff --check passed.
- npm test: all 98 tests passed with zero failures (/tmp/writingtool-error-exit-tests.log).
- All seven Forge startup/host-fault scenarios passed with normal native drain (/tmp/writingtool-error-exit-forge.log).
- Screenshot-equivalent pending close, stalled native decision, canceling an overlapping native drain, and dirty-profile exit passed against the final source (/tmp/writingtool-desktop-verification-DSXkur).
- Manuscript error exit, relaunch discovery, collection timeout, failed-copy cancellation, combined-proposal exit, failed closing-backup exit, explicit no-copy exit, existing continue-writing-after-failed-close behavior and read queuing all passed (/tmp/writingtool-desktop-verification-15ALRP).
- Existing read-failure and reconciliation deferral/restart checks passed (/tmp/writingtool-desktop-verification-LYGwsv). That batch exposed one intermittent existing heading-selection fixture timeout in its last writing scenario; the subsequent focused rerun completed the entire scenario successfully.
- All runtime mutations used temporary profiles, projects and recovery folders. The real profile and original pending protection records were inspected read-only. No user process was terminated or restarted.
- Final-source Forge rebuild and healthy lifecycle verification passed (/tmp/writingtool-error-exit-final-build.log), including dirty-save decisions, native cancellation, exact profile saving, recovery and normal shutdown. Generated bundles remain outside the source commit.
