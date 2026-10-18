---
title: 'Story 1.3 — Create and reopen a project linked to a universe'
type: feature
created: 2026-10-18
status: in-progress
route: dispatch
baseline_commit: a2c200bfd12c56be077e4c9afed731f42cba8eb3
review_loop_iteration: 0
context:
  - /home/jo/Documents/writing-tool/_bmad-output/implementation-artifacts/epic-1-context.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/data-contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/publication-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/coordination-contracts.md
---

<frozen-after-approval reason="Standing execution approval plus explicit instruction to finish all coding before testing">

## Intent

Create and reopen independently located projects linked to one authoritative universe, implementing all Story 1.3 acceptance criteria in `planning-artifacts/epics.md` lines 610–668. The user requests completing the entire remaining release implementation before running tests; this is the first coding slice, not completion of that broader request.

## Boundaries & Constraints

Always retain independent project/universe roots, permanent UUIDs, owning-universe references, root-relative paths and a separate base binding. Use the established SQLite adapter, dedicated database folder, OS-backed lease, durable publication and conservative recovery. Preserve active context on cancellation or invalid candidate. Missing universe requires a native matching-folder selection; do not activate until UUID is resolved. Reject copies, occupied authority, incomplete and unsupported roots. Keep one shared universe authority rather than project-local live copies. Retain all existing universe and readiness behavior/security. Expose named, closed, bounded project bridge methods. UI follows gray Dark center surfaces and top categories with pending-edit guards.

Never overwrite unrelated content, report partial creation as success, or precreate future story/chapter tables. No tests, lint, typecheck, builds, smoke, package or runtime probes during this coding pass. Source inspection is permitted; record every deferred check honestly.

## I/O & Edge-Case Matrix

| Scenario | Input | Expected behavior | Error |
|---|---|---|---|
| Create/reopen | Empty project folder plus existing universe | Persist own project UUID and universe association | Preserve partial evidence on uncertainty |
| Shared authority | Two projects sharing universe | Reuse same universe connection/identity | No independent copy |
| Missing universe | Moved matching folder | Native locate, verify UUID, bind location | Wrong UUID/cancel leaves project inactive |
| Invalid candidate | Foreign/nonempty/unsupported/owned | Preserve prior active context and bytes | Clear error, retry |
| Project relocation | Whole project moved | Only own base binding changes | Identity validation before activation |

</frozen-after-approval>

## Code Map

- `src/application/universe.ts`: active UniverseStore lifetime and candidate activation. Extend through explicit application ports if needed; avoid bypassing authority.
- `src/infrastructure/universe-storage.ts`, `universe-files.ts`, `universe-ddl.ts`: reuse verified path helpers and adapter patterns. Universe catalog is exact v1/profile-only; do not blindly repurpose its constrained rows.
- `src/application/contracts/project.ts`, `src/application/project.ts`, `src/infrastructure/project-storage.ts`: new closed DTOs, project lifetime and own adapter. Publish exact project storage/transport contract before writes.
- `src/desktop/main.ts`, `preload.ts`, `utility-host.ts`: own native project/universe selections, typed routing, bounded client and draining both owning stores.
- `src/presentation/index.tsx`, `global.d.ts`, `shell.css`: connect real Create/Open/Close project UI and identify linked universe; preserve current profile/dirty/unknown operation protections.

## Tasks & Acceptance

- [ ] `specs/spec-WritingTool/project-storage-contract.md`: exact versioned discovery, metadata, catalog, association, activation and recovery contract.
- [ ] `src/application/contracts/project.ts`, domain/application files: closed commands and results, identity and operation outcomes.
- [ ] `src/infrastructure/project-storage.ts`: durable independent root create/open, lease, relocation, validation and safe release.
- [ ] `src/desktop/*`: bounded purpose-bound native selection/routing and coordinated lifetime.
- [ ] `src/presentation/*`: functioning project commands and workspace context through existing pending edits.

Given a saved project, when reopened, then its UUID/association survive and its matching universe is resolved before activation. Given wrong/missing/owned/unsupported candidates or cancellation, when opening, then no unrelated bytes or prior workspace are replaced. Given a whole-root move, when reopened, then permanent identity/object paths remain stable and only location binding changes.

## Implementation Notes

No intent gaps: standing approved Story 1.3 supplies behavior. User explicitly approved broad scope and coding-first order. No user data migration/deletion or external publication is authorized by this increment. Existing dirty `.webpack` files are generated by the user's ongoing app session: leave them alone. Coordinate project switching without mutating two authoritative roots as independent partial transactions. This slice adds project metadata/associations only; later entities are subsequent coding slices.

## Verification

Deferred by explicit user instruction until the entire coding pass is finished. Do not run tests or validation commands. Report source inspection and remaining risk; leave this spec in-progress until later verification and reviews complete.

### Coding pass — 2026-10-18

Implemented the versioned metadata-only project contract, independent SQLite catalog/lease and managed metadata/image roots; permanent project/universe associations; conservative incomplete-creation handling; copy checks and separate binding updates; project candidate lifetime sharing the existing universe authority; native matching-folder resolution; closed bounded project bridge/client routing; project-before-universe shutdown; and Create/Open/Close project UI through existing pending-edit guards. Project creation uncertainty retains its identity barrier until a matching project reopens. Located universe UUID is inspected before writable open.

Source inspection only. No tests, lint, typecheck, build, smoke, package, runtime or other validation commands ran. Required restart/interruption, concurrency, transport, relocation and packaged-platform verification is deferred until the entire release coding pass finishes. Incomplete creation deliberately remains blocked with evidence; broader recovery UI is outside this story. Existing generated `.webpack` files were not edited. Status remains in-progress pending the deferred verification/review phase.
