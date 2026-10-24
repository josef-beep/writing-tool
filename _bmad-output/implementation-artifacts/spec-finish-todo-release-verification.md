---
title: 'Finish the remaining WritingTool delivery checklist'
type: chore
created: 2026-10-24
status: in-progress
route: dispatch
baseline_commit: 4281f787f03b4b5cee3c377342f6e3634f2f60c2
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/TODO.md'
  - '{project-root}/_bmad-output/planning-artifacts/execution-approval.md'
  - '{project-root}/_bmad-output/specs/spec-WritingTool/planning-contract-index.md'
---

<frozen-after-approval reason="Jo requests finishing TODO; standing execution approval covers the full backlog, routine fixes/reviews and existing working-tree changes without repeated signoff">

## Intent

Complete the open TODO through demonstrated fixes, reproducible verification and accurate acceptance tracking. Preserve all approved capabilities and investigate failures instead of accepting source presence. Continue independent local work when a platform or hardware gate lacks access.

## Boundaries & Constraints

Preserve existing writing, operation evidence, unmatched acknowledgments, authority/durability protocols, generated bundles and prior documentation. Use temporary fixtures and destinations; never weaken validators, fsyncs, IPC authorization or Electron sandboxing. No publication, system installation, data migration or deletion of real writing. Platform gates need matching-host evidence and cannot be marked passed here. Existing approval covers the broad scope and dirty tree.

## I/O & Edge-Case Matrix

| State | Action | Required behavior | Failure handling |
| --- | --- | --- | --- |
| Busy recovered-context refresh | Protection finishes/host restarts | Shell retains matched roots; close targets active project | Retry known-unsent read; preserve uncertain writes |
| Profile and manuscript | Dismiss profile | Restore actual manuscript focus and selection | Retain visible text and saved receipt |
| Build shutdown | Close or interrupt compile | No checker worker pipe errors; real TS errors fail build | Preserve diagnostics and nonzero failures |
| Linux package | Build Debian installer | Maker locates shipped executable; extracted app runs | Preserve previous package; no system installation |
| Growing history | Save and reopen | Exact immutable history, matched text/formatting and receipt | Original operation evidence survives failure |
| Incomplete acceptance | Verify TODO item | Record reproducible evidence before checking it | Leave unavailable or failing gates explicit |

</frozen-after-approval>

## Code Map

- `forge.config.mts`: maker `options.bin` must match shipped `WritingTool` executable; smoke expects that name.
- `webpack.plugins.ts`, `webpack.rules.ts`: shared forked checker races Forge process exit; move checking into ts-loader while preserving compiler diagnostics.
- `src/presentation/index.tsx`: recovered-context reads currently clear Shell on temporary busy; profile dismissal/focus effects race refresh. Pair identities, reject stale refresh and restore actual focus.
- `src/desktop/main.ts`: recovered events can precede release of protection admission lock; retain strict authority rules.
- `tests/fixtures/desktop-integration.cjs`, `scripts/verify-desktop.mjs`: genuine Electron fault/focus/calendar tests; strengthen value/admission synchronization rather than extending arbitrary sleeps.
- `src/infrastructure/workspace-storage.ts`, `tests/workspace-coordinator.test.ts`: BUG-01/02 optimizations already present; measure baseline/current and preserve negative retained-descriptor regressions.
- Application/domain/storage/protection/presentation modules and canonical contracts supply existing implemented features. `TODO.md` and 49 story criteria determine remaining acceptance; previous test report is scoped evidence, not story acceptance.

## Tasks & Acceptance

- [ ] Fix BUG-03/05 in Forge/webpack configuration; reproduce actual TS errors, watch recovery, interrupted build and extracted Debian launch.
- [ ] Fix BUG-04 in Shell/native event sequencing and actual focus restoration. Extend desktop fixtures with forced busy refresh, newer-navigation protection and awaited calendar values.
- [ ] Reproduce BUG-01/02 measurements from version-control baseline with temporary matched fixtures; record raw timings, hashes, environment and reopen/history verification without absolute-time assertions.
- [ ] Exercise remaining application/recovery/settings/export contracts with meaningful tests, fix demonstrated defects and map results to TODO/story acceptance. Validate project/universe ZIP recovery after original-root loss, protective Replaced capture, freshness, references, calendars, entities, timers, retention and exports.
- [ ] Run typecheck/lint, complete Node suite, desktop suite, sequential Forge/package smoke, Debian maker/extracted acceptance and workflow reviews. Restore initial generated files by hash while retaining new build output separately.
- [ ] Update TODO, evidence ledger, specs and handoff only from proven outcomes; continue remaining locally achievable tasks. Record necessary unavailable platform/hardware facts without inventing acceptance.

Given transient authority contention, when recovery refreshes Shell, then context remains matched and Ctrl+W cannot target an associated universe erroneously. Given dismissal of a saved profile, when typing resumes, then the manuscript receives input at its restored selection. Given valid and invalid TypeScript, when compiled or watched, then validity and real diagnostics remain correct with no fork-checker EPIPE. Given a freshly built package, when Debian is made and extracted, then its executable, desktop entry and temporary-profile launch work. Given a TODO item, when it is marked complete, then its full applicable criteria have linked evidence and unresolved installed/hardware obligations remain explicit.

## Implementation Notes

Investigation used three read-only agents. BUG-01/02 code exists in the starting revision; reproduce its performance evidence before closure. BUG-04 includes both a concrete busy-refresh reset race and focus/input cases needing direct verification. No irreversible action or unresolved product choice is required for current local fixes. DEC-10 platform access remains an external acceptance dependency.

## Spec Change Log

## Review Triage Log

## Verification

Use repository commands from README and focused fixtures, followed by the complete suites after integration. Run desktop windows sequentially so focus tests do not compete. Build package and development smoke sequentially because they share `.webpack`. Evidence belongs in `_bmad-output/implementation-artifacts/todo-completion-evidence`; release/platform claims require their own complete matrix.
