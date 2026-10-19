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
| 5.1 — Capture and inspect complete scheduled revisions of current work | Source present; integration unverified | Deferred until coding pass finishes |
| 5.2 — Restore a chapter revision while preserving replaced work | Source present; integration unverified | Deferred until coding pass finishes |
| 5.3 — Restore a character revision against the authoritative universe | Source present; integration unverified | Deferred until coding pass finishes |
| 5.4 — Restore an event revision without changing its depicting chapters | Source present; integration unverified | Deferred until coding pass finishes |
| 5.5 — Create independent complete project and universe ZIP backups | Source present; integration unverified | Deferred until coding pass finishes |
| 5.6 — Restore a whole project against its authoritative universe | Source present; integration unverified | Deferred until coding pass finishes |
| 5.7 — Recover a project or standalone universe from one complete ZIP | Source present; integration unverified | Deferred until coding pass finishes |
| 5.8 — Create complete backups on an independent configurable schedule | Source present; integration unverified | Deferred until coding pass finishes |
| 5.9 — Finish normal close with complete revisions and backups, including fallback recovery | Source present; integration unverified | Deferred until coding pass finishes |
| 5.10 — Apply time-based retention and safe manual deletion | Source present; integration unverified | Deferred until coding pass finishes |
| 6.1 — Export a whole story or selected chapters as DOCX, PDF, Markdown or text | Source present; integration unverified | Deferred until coding pass finishes |
| 6.2 — Export local database content through a separate consistent-export workflow | Source present; integration unverified | Deferred until coding pass finishes |

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

## Continuation — 2026-10-19

Protection/export source from the saved WIP commit is present across application contracts, immutable revisions/ZIPs/recovery/export infrastructure, native selection/bridge, renderer panels/schedules/close capture, resources and fonts. This continuation inspected its integration and corrected owner-identity activation selection and postcommit/postpublication error classification. It also applies backup destination separation to recovery/reconciliation and uses streamed output hashing. These source changes do not establish story acceptance; the protection spec's unchecked acceptance tasks remain verification obligations.

Native source/dispatch/build/resource hooks are now written. See `spec-release-platform-io.md` and `../../native/confined-fs/README.md`. Linux helper bodies are preserved. macOS source uses pinned relative operations and full file flushing. Windows relative operations are written, but a supported directory metadata durability implementation is still a **coding/release blocker**; native mutations reject this capability before changing files. Do not treat the platform coding slice or whole coding pass as finished. All native compilation, automated checks, app/runtime/packaging and formal reviews remain deferred. No generated .webpack files were changed.

Next work: resolve the Windows directory durability primitive without weakening the adopted preservation contract, then continue the remaining source/acceptance audit across the prepared protection/platform slices. Tests remain deferred until Jo changes that direction. No stories beyond the earlier 1.1/1.2 are marked done.

### Later Windows source correction — 2026-10-19

The unconditional Windows directory-sync rejection above has now been replaced with a concrete NTFS-only native flush path after further primary-source investigation. It upgrades the pinned object via ReOpenFile, validates identity, invokes NtFlushBuffersFileEx flags 0, and requires both direct and completion success. Non-NTFS and unavailable/denied primitives still fail before mutation. The earlier missing-implementation blocker is closed at source level; all runtime/installed/physical-durability gates remain open. Native platform coding tasks have source, with no compilation or execution checks. Remaining work is the deferred formal acceptance/review and verification of the full coding pass; no story acceptance is implied. Continue honoring Jo's instruction to leave tests and execution checks deferred.

## Lifecycle and reconciliation source audit — 2026-10-19

Implemented normal-close input locking through native drain with safe canceled/failed-close unlock and root refresh after partial release. Header and floating-panel blocks now react to protection/dialog state. Scheduled backup cancellation reports an incomplete retryable attempt; retry protects newer pending edits, manual Discard resets visible draft content, due jobs retain separate attempt clocks, and autosave responds to system resume.

Reconciliation now retains the original operation ID through every transport-error layer and validates that correlation. Native pending metadata survives output validation and fallback-notice bookkeeping, with durable cleanup before removing in-memory blockers. Reconciled closing backups retain their original close/fallback context. Failed initial job recording now releases the in-memory busy slot. Unknown outcomes canceled during close remain actionable through reconciliation/alternative-location controls.

No tests, lint, typecheck, app launch, native compilation, build or package commands were run. Source/behavior remains provisional; full release acceptance and platform gates remain open. Generated .webpack changes were already present at the start of this continuation and were left untouched by assistant commands. Continue the remaining source/acceptance audit under the coding-only direction; do not report all 49 stories verified or repeat routine approvals.


## Further source corrections — 2026-10-19

Fixed automatic backup retention's protected-revision refusal after successful publication, with oldest-first eligible cleanup; moved capture SQLite copies into finally-cleaned private temporary directories; and staged full archive-history/catalog/identity validation before imported manifests reach live history. Backup closure now validates every retained catalog. Existing user-root capture artifacts are preserved.

Main/floating timeline focus now carries both endpoints explicitly, so point jumps and undated chapter navigation cannot reuse an unrelated chapter endpoint. Calendar-update status/action is persistent in the Shell footer and uses both profile/workspace pending-edit guards. Conversion locks input and updates open record versions through success/reconciliation without resetting manuscript bytes or unrelated settings.

Coding-only status continues: no tests/typecheck/lint/app launch/native compilation/build/package. Deferred cases are recorded in the protection/export and presentation specs. Release acceptance remains open.


## Protection/navigation/retention continuation — 2026-10-19

Implemented persistent original-operation reconciliation controls and immediate panel serialization; corrected alternate-location retry, cancellation progress identity, stale deletion selection and explicit conflict selection. Locked committed/backup-required/canceled proposal changes in backend/UI, returning the applied view after prepared-output reconciliation. Connected profile Save/Discard/Cancel to workspace menu navigation and disabled hidden writing commands/shortcuts while the profile covers it.

Fixed indefinite local-revision retention caused by available self-contained ZIPs pinning their embedded manifests. Uncertain/offline archive evidence, explicit retained dependencies and pending/canceled recovery proposals still protect entries; immutable object deletion remains deferred. Revision retention now runs independently of successful backups. Cleanup failure is a typed warning beside a completed capture, with newest-ten and oldest-first rules preserved.

Synchronized native/renderer current-root context as a complete pair after recovery/recent navigation, including partial-open failure and clearing absent roots. Native postprocessing failures keep original pending IDs blocked. Recents-bookkeeping failure after an acknowledged open is a warning.

All changes are source-only and unverified. No tests/typecheck/lint/launch/native compilation/build/package ran; generated .webpack changes are preserved. Deferred scenarios and the next source-audit targets (native metadata publication before initial host-job recording, moved original reconciliation participants) are recorded in the protection/presentation specs. Release/story acceptance remains open.


## Preparation and relocation continuation — 2026-10-19

Mutating protection dispatch now has durable native prepared/attempted markers and a utility ready-job acknowledgement. Prepared-but-unsent work reconciles as not-committed and prompts/retries the actual original command rather than being counted as a completed capture. Job records have strict state-specific validation, and legacy markerless records stay conservative. Failed reads/cancel signals do not create orphan mutation IDs; native pending/proposal inventory remains accessible after host failure. Read-only history/inspection no longer writes perpetual job records; resume is durably prepared because it changes a proposal.

Reconciliation can locate moved original project/universe identities, persist the matching paths, wait for the previous host to release authority and reopen/recheck both participants without replacing the original ID. Replayed backup/export output paths are checked against the current roots. Export reconciliation supports a new Save As capability; existing published-output evidence is checked first.

No execution checks ran, and no story/platform acceptance changed. Detailed deferred fault scenarios are in the protection spec. Next source targets include exact durable export capture pinning across restart, conversion validation, and partial activation when roots/destinations relocate. Generated .webpack changes remain preserved.


## Durable export capture continuation — 2026-10-19

Exports now pin their original saved text/formatting, chapter order/calendar, catalog and real capture timestamp in private user-data manifests with shared immutable payloads. Retry/reconciliation consumes that same cut instead of recapturing newer live work. Shared captured-state validation is reused with revisions/archives; export pins do not create user-visible revisions or widen catalog-only output scope.

Added aborted export job evidence and terminal-only cache reclamation under the cross-host coordinator gate, preserving unresolved/shared pins and retrying interrupted cleanup. Completed jobs retain publication digests; service reconciliation and native acknowledgement verify original output bytes. Conversion timeout/cancellation is idempotent and cannot turn a timeout into success. Improved FODT whitespace/exact indent handling and DOCX content comparison for empty paragraphs and line breaks. Unsupported XML controls fail before output publication without changing saved writing.

Source changes only, no execution checks. DOCX/PDF rendered fidelity, cache/replay fault cases and platform durability remain unverified; PDF validation remains structural. Next source target is partial recovery activation and moved stage/destination reconciliation. The coding pass and full release acceptance are not complete; preserve generated .webpack edits.
