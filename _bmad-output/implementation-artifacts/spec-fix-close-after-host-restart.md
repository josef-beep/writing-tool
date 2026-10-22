---
title: 'Preserve universe context when closing a project after host restart'
type: bugfix
created: 2026-10-22
status: done
route: oneshot
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="User requested continuation of reconciliation and keyboard fixes">

## Intent

Finish verification of recovery and keyboard behavior through the normal development launch. Closing a project after its utility host dies must preserve its associated open universe. Closed universe context must stay closed across later host restarts. Keep normal saved-work guards, root identity checks and all saved writing intact.

</frozen-after-approval>

## Implementation Notes

- All 13 existing desktop scenarios pass on the current source. A new actual Electron test kills the host immediately before Ctrl+W and reproduces loss of the associated universe: project.close starts a fresh host without restoring its active roots.
- Small reversible change in `src/desktop/main.ts`: restore roots for project.close; update cached universe context on successful current/save/close responses. Extend `tests/fixtures/desktop-integration.cjs` with host-close/universe preservation checks.
- Normal Forge startup compiles all three bundles, but its embedded smoke flow races background workspace loading when directly requesting currentUniverse and then dereferences a missing snapshot. Diagnostic-only idle synchronization and an explicit async failure handler make that verification deterministic and fail promptly. No authority/security guard is relaxed.
- No unresolved product choices or irreversible changes. All runtime validation uses temporary application profiles/projects, and the real profile was inspected read-only. The actual saved pending-operation queue is empty.

- Restored the active roots for universe.close as well, so closing a universe after a crash still respects its associated open project's guard. Successful universe current/save/close responses refresh the cached snapshot and location.
- Background workspace.query/settings.get reads now expose a completion promise. Project, universe, reconciliation and native close wait for that read to finish before applying their existing authority gates. The finally block releases waiters on both success and failure; callers recheck shutdown after the wait. Mutation serialization and unresolved-operation checks remain in force.
- A real Forge fault run reproduced an empty-window shutdown hang: workspace.query recreated a transport around a child that had already exited. Replacement read clients now receive no host when hostExited is true, so they fail immediately instead of waiting for a response from a dead process.
- Empty unavailable windows can approve close without reloading an impossible workspace snapshot, provided the Shell has no project/universe or utility open. Profile dirty-state decisions and native unresolved-operation/authority checks still apply. Native shutdown sends root-close requests only when it actually has an active owning root.
- Added a desktop read-queue scenario which holds an actual utility reply before it reaches the main client. Project/current, universe/current and protection reconciliation remain pending until it is released. A deliberately failed read also releases its queued project request. Added host-crash checks around project/universe closure and a second profile save after restart.

## Acceptance Evidence

- Given an open project and a crashed host, when Ctrl+W closes the project, its associated universe stays open. Direct universe closure while that project is active returns VALIDATION even after a crash.
- Given an intentionally closed standalone universe, when the host subsequently restarts, workspace.query returns neither a project nor a universe.
- Given a successfully saved universe profile, when the host restarts, its generation, record version and description are preserved and another Ctrl+S saves using the restored context.
- Given an outstanding workspace read, when project/current, universe/current or protection reconciliation arrives, it waits until the read is released. A failed read also releases waiters.
- Given a host that cannot start or exits during startup with no active roots, when normal quit is requested, the unavailable window drains and exits successfully.

## Review Triage Log

- Medium, patched: universe.close previously started a fresh empty host after a crash, bypassing the associated-project guard. It now restores the roots before closure; actual Electron coverage asserts VALIDATION and subsequent successful project closure.
- Medium, patched: project requests and protection reconciliation needed to recheck draining after awaiting the background read. Both now recheck; native closing likewise waits for reads before its final authority gate.
- Medium, patched: timing-only read verification would miss the request-admission race. The new read-queue scenario holds the real utility message, asserts each dependent request remains unresolved, releases the response and verifies success; it also injects a failed read to check cleanup.
- Medium, patched: profile cache synchronization lacked a save/restart/save regression. The writing scenario now verifies the restored generation, record version and saved description, then performs another durable Ctrl+S.
- Follow-up independent inspection of the final source diff found no concrete remaining regression; no findings deferred. Generated bundles were excluded from source review.

## Verification

- npm run typecheck and npm run lint passed.
- npm test passed all 98 tests with zero failures: /tmp/writingtool-continuation-unit.log.
- npm run smoke passed all seven scenarios (healthy, start failure, exit, invalid response, timeout, exit-after-ready and fatal error), each with successful normal native drain: /tmp/writingtool-forge-continuation-final2.log.
- The expanded writing desktop scenario passed, including keyboard input/formatting, durable manuscript save/reopen, crash-aware closure, focus/modal controls and save/restart/save: /tmp/writingtool-desktop-verification-pQvgPp/writing.log.
- Read-queue, read-failure, reconcile-defer, reconcile-defer-restart and reconcile-background all passed: /tmp/writingtool-desktop-verification-i2PCKc. The failed-read close guard remains effective; failed reconciliation preserves original evidence while later writing and closing backups include newly saved text.
- All runtime checks use temporary profiles and projects. User writing and pending-operation evidence were not changed. Forge regenerated tracked .webpack files; these build outputs are excluded from the source commit.
- Final-source rerun of writing and read-queue passed: /tmp/writingtool-desktop-verification-w3E7FB.
