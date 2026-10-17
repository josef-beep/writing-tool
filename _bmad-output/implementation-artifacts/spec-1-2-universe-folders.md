---
title: 'Story 1.2 — Create and reopen a universe in a chosen folder'
type: feature
created: 2026-10-17
status: in-review
baseline_commit: NO_VCS
baseline_snapshot: /tmp/writingtool-story-1-2-baseline.json
route: dispatch
review_loop_iteration: 0
context:
  - /home/jo/RiderProjects/WritingTool/_bmad-output/implementation-artifacts/epic-1-context.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/data-contracts.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/publication-contract.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/coordination-contracts.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/readiness-contract.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/universe-storage-contract.md
---

<frozen-after-approval reason="Story1.2 product intent approved; standing authorization covers routine engineering decisions">

## Intent

**Problem:** The desktop starter cannot persist an independently located universe. Jo needs a permanent shared setting that survives restart and folder moves.

**Approach:** Add native folder selection, universe creation/opening and profile editing through application use cases in the utility host. Persist required name and optional description in UUID-named JSON correlated with a universe-owned SQLite catalog and managed image root.

## Boundaries & Constraints

**Always:** Preserve UUIDs and root-relative object paths. Keep base location separate. Validate permanent identity, versions, bytes and authority before activation. Use OS-backed writer ownership, fencing and durable publication/restart reconciliation. Preserve pending edits and prior active context on cancellation/failure. Keep renderer isolated and transport bounded/closed. Top category dropdowns expose working commands and shortcut hints; use approved gray Dark styling, center profile editor, stay open after Save, pending-departure Save/Discard/Cancel and blocking errors. A named empty universe requires no calendar/project/date. Preserve Story1.1 readiness/security behavior.

**Never:** Overwrite nonempty/unrelated folders, silently create replacement authority, activate partial/unsupported stores, mutate unsupported schema versions, put profile payloads only in SQLite, expose arbitrary filesystem/SQL IPC, precreate future feature tables, or claim full backup/installer/platform acceptance.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Create/save/reopen | Writable selected empty folder; name; optional description | Same UUID/profile after restart; exact JSON/catalog agreement | Durable success receipt only |
| Validation/cancel | Blank name or canceled chooser/form | No new activation; prior context preserved | Field feedback or silent cancellation |
| Existing/invalid folder | Existing content, missing/corrupt/newer store, denied access | Refuse unsafe creation/open; preserve bytes | Blocking explanation and retry/location choice |
| Competing owner | Another process holds lease | Refuse second writer; retain context | No heartbeat stealing/forking |
| Interrupted mutation | Creation/save interrupted at publication boundaries | Verified old/new state or blocked preserved evidence | No mixed activation/false success |
| Relocated folder | Same UUID/root selected at new base | Change only root binding with expected version | Reject identity/authority mismatch |
| Lost acknowledgment/host | Mutating request times out or host dies | Reconcile operation before retry/activation | Unknown outcome cannot become ordinary discard |

</frozen-after-approval>

## Code Map

- `src/desktop/main.ts`: existing window/sender guards; add owner-bound native dialogs and shutdown draining before releasing authority. Current immediate utility kill must change for persistence.
- `src/desktop/preload.ts`, `host-client.ts`, `utility-host.ts`: readiness-specific bridge/client/dispatch; add named universe operations and command-specific validation. Mutating timeout differs from readiness timeout.
- `src/application/contracts/readiness.ts`: retain protocol1 query; separately publish universe DTOs. `src/domain`/`application` currently have no persistence ports.
- `src/infrastructure`: new SQLite/filesystem adapters. Webpack externalizes node: imports; actual utility probe passed built-in node:sqlite, but packaged integration remains unverified.
- `src/presentation/index.tsx`, `shell.css`: starter status only; replace with current-increment chooser/profile/empty workspace. Do not present future actions as functioning.
- `tests/readiness.test.ts`, `tests/smoke.test.mjs`, `scripts/smoke.mjs`: retain existing meaningful security/failure coverage while extending bridge assertions for explicitly approved methods.

## Tasks & Acceptance

**Execution:**
- [x] `specs/spec-WritingTool` companions/schemas — settle closed universe profile/command/error/result formats, catalog DDL/category registry, root discovery/completion marker, migrations, interrupted creation/save/rebind and host drain before authoritative implementation.
- [x] `src/domain`, `src/application` — validation/use cases/ports with stable identity and correlated idempotent receipts.
- [x] `src/infrastructure` — verified SQLite/catalog/lease and durable JSON publication/recovery adapters with confined paths.
- [x] `src/desktop` — purpose-bound native selection, typed routing, lifecycle/reconciliation and no generic path authority.
- [x] `src/presentation` — functional top commands, create/open/profile and named empty context with pending-edit guards.
- [x] `tests`, `scripts`, evidence — execute every matrix case, actual competing processes and packaged SQLite; preserve starter checks and document limitations.

**Acceptance Criteria:**
- All approved Story1.2 acceptance criteria in epics.md hold, including profile edits, cancellation, interrupted creation, concurrent ownership and relocation changing only the separate binding.
- Actual packaged Linux runtime loads SQLite and the saved profile through the same secured host path; no separate runtime/addon installation is required.
- TECH gates close only for proven portions; future schema families and installed-platform acceptance remain visible.

## Implementation Notes

Planning investigation complete; universe-storage-contract.md publishes the specialized format, registry, creation/publication/recovery/transport/lifecycle rules. Implement closed runtime/JSON schemas and exact SQL DDL first, then adapters; no authoritative writes before those definitions exist. No unresolved product question or irreversible migration/external action. Footprint is a cohesive cross-layer universe slice with new application ports and command validators. Standing execution approval remains effective. Local SQLite probe evidence is `sqlite-runtime-probe.md`; completed shell continuity is `spec-1-1-desktop-starter.md`.

Parent acceptance audit read the source, closed schemas, DDL and stored evidence. All seven matrix rows have registered passing coverage: profile/create/reopen and malformed inputs in universe tests, validation/cancel/dirty departure in the healthy renderer flow, preserved invalid/unsupported/unwritable roots in integration fixtures, real competing processes and termination, journal/file/decision/finalization plus undo/redo, binding-only relocation, and separate timeout/lost-acknowledgment reconciliation. Eight schema meta-checks and16adapter-fixture assertions passed, including exact submitted revision9007199254740993. Acceptance corrections restored mouse-accessible top commands with Save/Close profile, distinguished pre-dispatch not-committed commands and updated README. Types/lint/two targeted transport tests and healthy real mouse/renderer checks pass after those corrections. Final full checks/package will be rerun after independent review.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence and route |
|---|---|---|
| blind1: stale close acknowledgment loses new draft | high | Verified main flag survives Close universe; a new renderer-only draft does not reset it, so native close bypasses dirty guard. Patch one-use quit authorization through the existing renderer guard. |
| blind2: incomplete journal blocks reopen | false | Missing/corrupt published journals are explicitly recovery-required with preserved evidence under the adopted contract; registered missing-journal fixture proves that intended conservative behavior. A blocked preserved state is an allowed interrupted-operation outcome, not false activation or data loss. Reject proposed weakening of that rule. |
| blind3: torn finalization markers override valid decision | medium | writeExclusive writes final marker directly; a truncated marker is parsed before catalog-guided redo and blocks a known committed valid journal. Patch atomic marker publication and conservative completion from matching decision evidence; preserve damaged metadata. |
| blind4: idle host death prevents normal exit | medium | Failed client returns an error for close even when host definitely exited and no mutation is unresolved. Native/renderer quit cannot receive an impossible acknowledgment. Patch known-dead/no-pending close while retaining dirty and unknown-outcome guards. |
| blind5: failed close retains authority | false | This is intentional: failed recovery cannot acknowledge a drained close, and failed candidate activation must preserve the previous active context. Successful close releases both connections. Unconditional disposal after failed reconciliation would change the approved preservation/normal-close guarantee. |
| blind6: unrelated reuse of former pathname blocks move | medium | Reproduced moving root then recreating its old empty directory: checkBinding rejects without inspecting its identity. Patch distinguish the same owning universe from an unrelated directory; uncertain old authority remains blocked. |
| blind7: parent-directory retarget escapes confinement | high | Deterministic /tmp probe retargeted profiles between check and temporary open; an unrelated sentinel outside the root was overwritten, then save returned unknown. Patch directory-bound actual I/O and retain/revalidate physical identity, with the demonstrated race regression. No new public filesystem authority. |
| blind8: unbounded input resource exhaustion | maybe-false | No concrete representative failing input/measurement establishes impact. Arbitrary name/description/integer caps are explicitly unapproved. Defer unverified medium resource/timeout measurement under DEC-11; preserve unbounded semantic formats. |
| blind9: cumulative snapshot history cost | low | Every current consumer is a low-frequency universe-profile operation; no measured ordinary-use failure. A cache changes validated state/history assumptions beyond a direct correction. Reject low finding under the workflow's complexity/everyday-use rule; retain release performance gate. |
| blind10: reservation failure falsely unknown | medium | /tmp chmod probe: exclusive reservation denied, folder remains empty, yet outcome unknown. Patch distinguish failure before reservation creation from possibly changed bytes; preserve unknown after any possible write. |
| edge1: stale close acknowledgment | high | Same source-verified draft-loss sequence as blind1. Retain separate finding; group patch with blind1. |
| edge2: denied creation reservation traps pending state | medium | Same empty-folder/outcome probe as blind10. Group patch, preserving later uncertainty. |
| verification1: submitted description never asserted | medium | Preverified mutation returning empty description passed universe tests. Add exact submitted whitespace/CRLF/Unicode assertions after save/reopen and actual smoke. |
| verification2: production native-close guards bypassed | high | Preverified: diagnostic mode bypasses native close/before-quit and smoke dispatches only a synthetic renderer event. Exercise actual native close and app quit through production guard, including Cancel/dirty retention and drained completion. |
| verification3: edits during outstanding save unverified | medium | Preverified missing changed-revision branch: current smoke never types while reply is pending. Add controlled delayed acknowledgment for ordinary Save and Save-departure, asserting newer draft stays dirty/open. |
| verification4: stale acknowledged flag loses draft | high | Verified separately at main close bypass and renderer-only New draft; group with blind1/edge1. |
| parent1: reconciliation pins pathname rather than identity | medium | Main compares path.resolve strings while storage resolves realpath. An alias of the same selected root is rejected; moving that same root also prevents reaching recovery. Patch private canonical/owning-identity validation before activation, retaining original operation and foreign-root rejection. |
| parent2: clean dead host cannot acknowledge close | medium | Source-traced same failure as blind4; group patch, with actual native lifecycle regression rather than diagnostic bypass. |
| parent3: creation commit misreported after activation fails | medium | Reproduced creating a second universe while the prior active profile contains valid foreign JSON: second descriptor/catalog are complete, but previous close fails and create propagates not-committed. Patch preserve the known durable creation outcome independently of activation failure; optional preflight must not falsely rollback a completed creation. |

All retained defects concern demonstrated existing states and internal guards/primitive use; their fixes add no public feature or filesystem/SQL authority and do not change frozen product intent. Route the eleven internal correction/test groups to patch. No intent/spec loopback. One unverified medium resource-measurement issue is deferred; installed-platform, hardware-failure and full technical gates remain open.

## Verification

Run strict types, lint, registered unit/integration tests, real development smoke, package and packaged smoke sequentially. Use temporary user roots/profiles for interruption, stale generation/fence, retry, competing-process, corrupt/unsupported/unwritable and relocation fixtures. Compare preserved bytes/IDs/path rows, not just reported success. Document unavailable Windows/macOS evidence without inventing acceptance.
