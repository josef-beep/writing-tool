---
title: 'Finish release coding integration'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'dispatch'
baseline_commit: '5e209b10c7bc90ad5422b878c5063b3eaf1dacbc'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="Existing full-release execution approval and repeated instruction to finish coding; routine integration work needs no further signoff">

## Intent

Finish the existing release implementation by closing the final recovery, panel and shutdown integration gaps. Preserve all existing source and user data. The referenced renderer configuration already supports fonts/CSS; change it only if actual compilation identifies a remaining problem.

## Boundaries & Constraints

Keep permanent identities, one authority, original uncertain-operation IDs, durable coordinator decisions, pending edits, required closing save/revision/backup and conservative handling of unreadable evidence. Source implementation comes before execution checks. Preserve the mixed working tree, generated `.webpack` content and real writing roots. Use temporary output/profiles for verification; no commit, launch against real user data, migration or publication. This finishes code, without claiming all 49 stories or untested operating systems accepted.

## Tasks & Acceptance

**Execution:**
- [x] `src/infrastructure/workspace-storage.ts`, `workspace-coordinator.ts`: after a complete original coordinator abort, remove only verified empty unprepared operation directories durably so actual universe reopen succeeds; retain unknown/nonempty evidence. Prevent terminal aborted IDs from being overwritten by stale retries. Allow identity-proven foreign replacements at old activation bindings while blocking conflicting or uncertain authority evidence.
- [x] `src/desktop/protection.ts`, `src/infrastructure/protection-service.ts`, `recovery-activation.ts`: when locating a missing participant before activation completion, explicitly collect/validate an empty publication destination and preserve the staged-versus-published distinction. Reject ambiguous host relocation and invalid path bytes. Existing coordinated-universe locator in main remains authoritative.
- [x] `src/presentation/workspace/Workspace.tsx`, `src/desktop/main.ts`, `protection.ts`: serialize startup/retry snapshot/settings reads; recover a failed read transport where safe. Distinguish unloaded snapshot from confirmed no active root so failed reads cannot bypass closing protection. Explicit backup location selection must work without a successful settings read. Pending mutations continue to block shutdown.
- [x] `src/application/contracts/presentation.ts`, `src/desktop/presentation.ts`, `src/presentation/workspace/{Workspace,FloatingPanel}.tsx` and shared components: floating and docked panels offer the same navigation grouping/order/edit/reorder, character/context filtering, plot details/order and decision status/selection controls. Route new typed, narrowly validated actions through guarded main-controller handlers. Share timeline zoom/focus so visible floating timeline responds to main commands. Preserve dates and manuscript state.
- [x] Panel source/styles: retain and coalesce queued layout patches until acknowledgement, expose real retry and drain layout changes before departure/quit. Preserve unsaved settings fields and uncertain mutations. Implement collapse/dock controls, height resizing and persisted panel ordering consistently. Prefer shared content over duplicating panel markup.
- [x] `tests/workspace-coordinator.test.ts`, `tests/recovery-activation.test.ts`, relevant new integration tests and `package.json`: cover corrected failure paths with meaningful regression tests and register existing converter tests. Execute checks only after source fixes are complete.
- [x] `_bmad-output/RESUME.md`, release ledger, `TODO.md`: record final source completion, actual checks and remaining platform/acceptance limits accurately.

**Acceptance Criteria:**
- Given interrupted preparation and an original durable abort, when the actual universe is reopened, then both units retain their prior generations and unknown evidence is preserved; stale retry never replaces terminal decision evidence.
- Given partial activation and a moved remaining stage, when its identity and empty publication destination are selected, then reconciliation retains the original IDs and publishes only to that destination; occupied/ambiguous roots remain untouched.
- Given an active root with a failed initial read, when close is requested, then required captures cannot be skipped; retry/location controls can recover without discarding edits or uncertainty.
- Given a floating panel or queued resize, when its main-window commands or departure run, then controls act on the selected current records and layout changes are durably saved or remain visibly retryable before departure.

</frozen-after-approval>

## Code Map

- `workspace-storage.ts`: `recover`, `abortUnprepared`; `universe-storage.ts` performs a second legacy journal sweep after workspace recovery.
- `workspace-coordinator.ts`: `receipt`, `commit`, `locateActivationParticipant`; existing interruption tests stop at workspace recovery and miss actual reopen.
- `desktop/protection.ts`: `nativeProtection` activation location loop, `backupFolder`; missing commit-stage currently omits destination. `protection-service.ts` owns `relocateActivation` and `resumeActivation`.
- `Workspace.tsx`: initial effect and Retry loading launch concurrent reads; `guard`, `closeProtection`, `changePanel` and `panelPatches` own departure/layout guards. `main.ts` rejects concurrent workspace requests and owns original-root locator and transport reset.
- `FloatingPanel.tsx` duplicates reduced panel markup. `PanelMirror` lacks timeline view state; `PanelAction` lacks edit/reorder intents. Existing main actions already enforce saved-work navigation.
- `webpack.renderer.config.ts`: existing font asset and CSS loaders; shared rules/plugins align with Forge renderer/preload configuration.

## Implementation Notes

No unresolved product choices or irreversible actions. Standing approval covers the final integration scope and existing mixed working tree. A pre-edit source snapshot is retained at `/tmp/writingtool-final-baseline-o_66cb04` for scoped review.

Implemented coordinator/activation recovery, shared panel content/actions, acknowledged layout persistence, startup/close read safeguards, app-wide fonts and explicit timeline focus request identities. Existing preload already serializes workspace transport; sequential loading additionally gives coherent close retry. Added registered regression tests, including converter process-tree tests, and included TSX tests in typecheck. Renderer config required no source change.

## Review Triage Log

| Finding | Verdict | Evidence and resolution |
|---|---|---|
| Blind 1: raw rejected layout-save promise skips readback | false | Preload.workspace catches IPC rejection and returns an unknown WorkspaceResult, which drainPanels already reads back. A separate real known-generation-conflict retry issue was identified and fixed. |
| Blind 2: newer same-field settings edits overwritten | medium | Inputs remain editable while a layout save awaits acknowledgement; merge lacked a submitted draft snapshot. Preserve edits made after submission. |
| Blind 3: ordinary pointer release starts resize save | medium | Rendered size can differ from saved size under viewport limits; pointerup ran before descendant click. Compare actual gesture start/end bounds. |
| Blind 4: collapsed width never saved | low | CSS allows horizontal resizing while handler returns on collapsed panels. Save changed width without replacing expanded height. |
| Blind 5: timeline pan/filter lost across floating transition | medium | Anchor, period and unresolved state remained local despite shared zoom/focus. Included the view state in the shared controller projection. |
| Blind 6: semantically invalid timeline focus | high | A stale other-universe projection can carry a structurally valid unavailable calendar version into elapsedPosition. Validate against the current calendar at dispatch and consumption. |
| Blind 7: covered workspace receives view/layout actions | medium | covered was absent from mirror blocking and view-only handlers skipped navigation guards. Block through current controller refs and projection. |
| Blind 8: panel.flush IPC rejection escapes guard | false | Preload presentation catches IPC rejection and returns status:error; guard already handles that result and retains the queue. |
| Blind 9: local floating controls steal focus | medium | Native dispatch focused the owner for every action. Limit focus transfer to actions opening main-window content. |
| Blind 10: failed-batch test tautology | medium | Applying a queue twice proves no failure path. Replace it with persistence-loop fault cases and add real desktop verification. |
| Edge 1: partial imported panel set loops forever | high | validAppSettings accepts nonempty subsets; fallback panels render but absent IDs never acknowledge. Complete the known panel set before persistence. |
| Edge 2: stale timeline date | high | Same concrete invalid-calendar path as Blind 6; same validation correction. |
| Edge 3: rejected IPC after durable settings save | false | Same preload readback refutation as Blind 1; unknown result is handled. Passing desktop verification injects lost acknowledgements through that actual result path. |
| Edge 4: focus cancels overlapping renderer reads | false | Preload workspaceTransport serializes all renderer workspace calls, so query reset cannot cancel an overlapping renderer settings request. |
| Verification 1: consumer persistence/flush lacks executable coverage | medium | Existing helper tests did not invoke controller persistence or native flush. Add the extracted persistence loop to registered tests and test:desktop for real immediate-close persistence. |
| Verification 2: context actions lack observing-consumer coverage | medium | Static markup supplies its own desired state. Add a real floating-tab/classification IPC roundtrip and assert mirrored state and filtered records. |
| Parent: known settings generation conflict retries stale version | medium | A known not-committed GENERATION_CONFLICT skipped readback, so retained queue repeatedly reused an obsolete recordVersion. Refresh/rebase before retry and verify with actual fault injection. |


## Verification

After all source changes: typecheck, deny-warning lint, registered tests, Forge-generated main/renderer/preload compilation under temporary output, and isolated Electron integration if available. Review the actual scoped diff and do not infer runtime/platform acceptance from source presence.

Final evidence: typecheck, deny-warning lint and diff whitespace checks pass; **83 registered tests pass** outside the managed subprocess pipe restriction. `npm run test:desktop` compiles actual Forge main/utility, renderer and sandboxed preload bundles into temporary output, then passes five actual isolated Electron scenarios. These cover shared timeline zoom, final native bounds before debounce, failed-read close/retry, lost layout acknowledgement and generation conflict/retry, partial imported layouts, and floating context/filter roundtrip with displayed-record assertions. Every scenario completes required closing revision/ZIP and native exit. See [summary](final-coding-evidence/summary.json), [desktop results](final-coding-evidence/desktop-results.json) and logs alongside them.

The confirmed review findings above were fixed with the existing controller/action surfaces and shared internal helpers; no product-intent change or destructive re-derivation was needed. Remaining release/installed-platform and full per-story acceptance is tracked separately. Original roots and the preexisting mixed work were preserved. No commit.
