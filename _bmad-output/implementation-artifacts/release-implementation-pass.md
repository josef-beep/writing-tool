# Release implementation pass

User direction on 2026-10-18: finish **all remaining coding** before running tests. Continue through all 49 approved stories; finishing one story is not the stopping point. Defer tests, lint, typecheck, development launches, packaging and reviews requiring execution until the coding pass is finished. Source inspection and implementation planning continue. Do not mark unchecked technical/platform gates complete.

Latest continuation: Jo repeated “continue with coding, leave the tests.” Continue implementation and keep tests/execution checks deferred; completion of a coding slice does not itself authorize starting verification in this continuation. The old agent names below describe a previous session. The current presentation handoff is active, followed sequentially by protection/export and platform I/O.

Standing product and technical authority: `../planning-artifacts/execution-approval.md`, canonical SPEC/requirements/contracts and final DESIGN/EXPERIENCE. The user has accepted the full release scope; do not ask to split or repeat routine signoff. Generated `.webpack` changes predate this pass and belong to the running app session; preserve them.

| Story | Coding | Verification |
|---|---|---|
| 1.1 — Set up initial project from starter template | Complete | Previously passed |
| 1.2 — Create and reopen a universe in a chosen folder | Complete | Previously passed |
| 1.3 — Create and reopen a project linked to a universe | Coded; source inspection only | Deferred until coding pass finishes |
| 1.4 — Create, name and manually order stories in a project | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 1.5 — Organize stories into optional, manually ordered volumes | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 1.6 — Build and save a universe's repeating fictional calendar | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 1.7 — Record standalone events on the universe timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 1.8 — Manually arrange timeline events sharing a date | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 1.9 — Revise a populated calendar without changing elapsed chronology | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.1 — Create and organize undated chapters within a story | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.2 — Write, format and save chapter manuscripts | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.3 — Set independent chapter dates and view chapters chronologically | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.4 — Automatically save current work at a configurable interval | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.5 — Choose light, dark or system application appearance | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.6 — Configure independent saving and recovery settings | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 2.7 — Export and import application settings as JSON | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.1 — Create and filter universe characters by type | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.2 — Develop character profiles with guided prompts and explicit waivers | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.3 — Select and view multiple character personality labels | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.4 — Add and view optional character images | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.5 — Record character birth years on the universe timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.6 — Record character background events on the shared timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.7 — Record faction profiles and track completeness | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.8 — Record optional military unit types in faction profiles | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.9 — Track faction affiliation history on the character sheet | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.10 — Associate chapter characters and display writing targets | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.11 — Plan linked chapter events from the chapter or timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.12 — Edit flashback historical dates independently of chapter dates | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.13 — Open the event editor from a chapter without chapter-driven event changes | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 3.14 — Inspect chapter chronology and characters alongside manuscript writing | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.1 — Maintain a story’s dated and undated plot sequence | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.2 — Record established decisions on the universe timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.3 — Link established decisions to their resulting events | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.4 — Link an established decision to a decision it leads to | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.5 — Inspect established decision/result relationships in a tree view | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.6 — Find unresolved decisions from the universe timeline | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 4.7 — Inspect established decisions in character, story-arc and writing context | Backend and presentation coded; source inspection only | Deferred until coding pass finishes |
| 5.1 — Capture and inspect complete scheduled revisions of current work | Pending | Deferred until coding pass finishes |
| 5.2 — Restore a chapter revision while preserving replaced work | Pending | Deferred until coding pass finishes |
| 5.3 — Restore a character revision against the authoritative universe | Pending | Deferred until coding pass finishes |
| 5.4 — Restore an event revision without changing its depicting chapters | Pending | Deferred until coding pass finishes |
| 5.5 — Create independent complete project and universe ZIP backups | Pending | Deferred until coding pass finishes |
| 5.6 — Restore a whole project against its authoritative universe | Pending | Deferred until coding pass finishes |
| 5.7 — Recover a project or standalone universe from one complete ZIP | Pending | Deferred until coding pass finishes |
| 5.8 — Create complete backups on an independent configurable schedule | Pending | Deferred until coding pass finishes |
| 5.9 — Finish normal close with complete revisions and backups, including fallback recovery | Pending | Deferred until coding pass finishes |
| 5.10 — Apply time-based retention and safe manual deletion | Pending | Deferred until coding pass finishes |
| 6.1 — Export a whole story or selected chapters as DOCX, PDF, Markdown or text | Pending | Deferred until coding pass finishes |
| 6.2 — Export local database content through a separate consistent-export workflow | Pending | Deferred until coding pass finishes |

## Active coding checkpoint

- Story 1.3 project roots/association/native commands/UI are coded and have received source inspection only.
- Workspace domain modules are written: `calendar.ts`, `manuscript.ts`, `workspace.ts`, `personality.ts`, `code-fold.ts`. Backend authority/catalog/coordinator/settings/bridge integration is coded and source-inspected only; consuming map is `../specs/spec-WritingTool/workspace-backend-api.md`. Presentation implementation has handed off implemented-unverified; consuming map is `workspace-presentation-api.md`.
- Subsequent prepared coding slices: `spec-release-presentation.md`, then `spec-release-protection-export.md`, then `spec-release-platform-io.md` to address the existing non-Linux filesystem coding gap. Do not start them before their predecessor's API handoff exists. Do not stop after one slice.
- LibreOffice 26.8.1 Linux runtime is downloaded, checksum-matched to official metadata and extracted under `/tmp/writingtool-libreoffice-sysroot/opt/libreoffice26.8`; no runtime execution. `bundled-runtime-handoff.json` pins all four target-platform distributions and licenses/font sources.
- No tests, lint, typecheck, app launch, build or package commands have run during this coding pass.

## Integration constraints

- Complete project storage/lifecycle first, then reusable entity publication and the chapter text/format pair, then the connected writing/chronology/profile/decision surfaces. Revisions, independent complete ZIPs, reconciliation/cleanup, schedulers and exports consume those same contracts.
- Domain fields/commands must have closed versioned schemas and semantic validation before authoritative writes. Use permanent IDs, same-universe references, exact decimals, expected generations/versions and original operation IDs for uncertain outcomes.
- One owning catalog per root maintains relative file paths and relationship indexes. Category JSON/WRT files remain authoritative payloads. Atomic publication and recovery must cover matched chapter pairs and all same-unit multi-record changes.
- Cross-unit changes require the adopted durable coordinator decision; do not call two independent successful saves an atomic operation. Captures pin a complete saved-generation cut after required manuscript acknowledgment.
- Keep this ledger and RESUME current. Implementation is provisional until the later full verification phase.

## Presentation handoff — 2026-10-18

Connected renderer, Lexical editor/adapter, manual/manuscript guards and acknowledgment/reconciliation, calendar/timeline/tree/filter/context forms, app-wide settings/theme/layout and secure mirrored native panels are written. Pinned Lexical packages/lockfile are installed; declarations/source only were inspected. API/ownership/scheduling seams and limitations are in `workspace-presentation-api.md`. No execution checks ran; all verification stays deferred. Existing generated `.webpack` changes were preserved.

Next is sequential protection/export implementation: working revisions/backup/recovery/export menu/center surfaces, capture/restore/reconciliation/schedulers/retention, required close revision/backup, chooser recovery/recents integration and bundled font registration/resources. Do not call the coding pass complete before that slice and platform I/O.
