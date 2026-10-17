# Epic 1 Context: Build and organize a chronological writing universe

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Deliver the local desktop foundation for creating/opening independently located projects and universes, organizing stories into optional volumes, defining a fictional calendar and recording/browsing standalone chronology. Projects sharing a universe must resolve one authoritative setting, while writing organization remains project-owned. Begin with a secured, packaged application shell; add persistence only as its applicable contracts and verification become available.

## Stories

- Story 1.1: Set up initial project from starter template
- Story 1.2: Create and reopen a universe in a chosen folder
- Story 1.3: Create and reopen a project linked to a universe
- Story 1.4: Create, name and manually order stories in a project
- Story 1.5: Organize stories into optional, manually ordered volumes
- Story 1.6: Build and save a universe's repeating fictional calendar
- Story 1.7: Record standalone events on the universe timeline
- Story 1.8: Manually arrange timeline events sharing a date
- Story 1.9: Revise a populated calendar without changing elapsed chronology

## Requirements & Constraints

- Operate locally. Project/universe folders are user-selected independently of installation/backup destinations. Permanent UUIDs survive renaming and relocation. Preserve existing content; reject missing, invalid, unsupported or unwritable stores without replacement authority or false activation. Cancellation preserves the active workspace; partial creation must never look complete.
- A universe has a required name and optional description and works without project, calendar or dates. Persist its profile in ID-named category JSON correlated with its own catalog and managed image root. Add only currently needed storage, not future character/calendar/event/project tables.
- Projects share one authoritative universe without live project-local copies. Stories support manual order and zero or one same-project volume; volumes are optional and manually ordered. No fixed counts/word limits.
- Calendars support days-only, optional unequal months and ordered standalone days. Signed arbitrary-precision years include zero; lengths are positive whole numbers. Repeat the sequence without leap rules. Valid target mismatches save with actual length; populated changes preserve elapsed positions/order/intervals while recalculating display. Invent no defaults or artificial year offset.
- Standalone events need heading/date, optional description and no mandatory links/time. Generated editable E/D codes are stable, nonblank/trimmed, unique across both kinds per universe and expand beyond 999. New/date-moved events go last within their date group; manual order changes no dates.

## Technical Decisions

- Retain Clean Architecture: domain/application depend inward; adapters own React, Electron, SQLite and filesystem APIs. Main owns windows/dialogs/lifecycle; a utility process hosts application use cases and infrastructure. Sandbox/context-isolate renderer, disable Node integration and expose bounded typed commands. Validate sender, request and result; no renderer SQL, filesystem paths or arbitrary channels. Preserve local-content navigation protections.
- Discover current canonical companions under `../specs/spec-WritingTool/`: `data-contracts.md`, `publication-contract.md`, `readiness-contract.md` and `coordination-contracts.md`, alongside SPEC/requirements/contracts and schemas. They supersede older planning deferrals while retaining their stated coverage limits.
- Data foundations define canonical UUIDs, exact decimal-string generations, UTF-8 versioned envelopes, confined root-relative paths and correlated/idempotent receipts. The common envelope leaves payload data open: each production entity/command still needs closed schemas and semantic validation. SQLite binding/engine/migrations and catalog/category registry require verification before adoption.
- Each owning root contains its SQLite catalog in a dedicated database folder plus category-owned JSON, managed images and later matched chapter WRT/formatting JSON. Store base-path binding once; objects retain root ID plus relative path. Relocation validates UUID, drains operations, acquires authority and compares binding version; update only the root binding, never object rows/IDs/files.
- Single-unit publication stages durable before/after bytes, gates readers, replaces files and commits catalog decision evidence, then verifies/finalizes before acknowledgment or further mutations. Reconcile unfinished work before writable reopen. Unknown outcomes preserve evidence and block affected writes/captures. Interrupted creation needs an explicit safe completion/recovery contract.
- Ownership uses a dedicated `database/lease.sqlite` private rollback-journal connection holding `BEGIN EXCLUSIVE` throughout authority. Initialize only in valid creation/supported migration. No timeout takeover or lock-file replacement. Lost lease health stops writes/captures; revalidate fresh session/fencing token and expected generation. Acquire multiple units in canonical kind/ID order. Cross-unit publication uses a durable user-data coordinator decision ledger, not two independent successful saves. Concrete adapter behavior remains evidence-gated.
- Readiness stays a closed protocol-1 non-mutating query: validated correlated ready/unavailable, five-second timeout, bounded requests and lifecycle cleanup. It creates no writing stores; future universe commands require separately published contracts rather than changing readiness into initialization.

## UX & Interaction Patterns

- Final DESIGN/EXPERIENCE govern Preview gray Light/Dark tokens, first-launch Dark, clear keyboard focus/labels, text beside status colors, system scaling and reduced motion. Keyboard and mouse work; routine geometry/bindings need no renewed preference approval.
- Launch chooser prioritizes Open project, includes standalone Open universe and does not automatically reopen the last project. For the current increment expose functioning universe creation/open/profile paths and an accurate named active-universe empty state. Do not expose nonfunctional later recovery/project/calendar actions or invent fictional dates. Exact universe selector/form geometry remains routine specification.
- Workspace commands use top category dropdowns. Navigation and the initially left-docked vertical timeline show/hide independently; remember one app-wide movable/dockable/floating layout as those panels arrive. Timeline codes stack at shared date positions with fictional-date labels and elapsed-time gaps; wheel/scrollbar/View zoom affect presentation only.
- Record/calendar Save stays open. Pending departure offers Save/Discard/Cancel; failed Save retains edits. Failures use blocking dialogs with operation-specific actions; quiet bottom status reports actual successful background publication. Busy ownership preserves context rather than silently switching authority.

## Cross-Story Dependencies

Story 1.1 is completed with reviewed local development/package readiness and failure evidence on Zorin Linux x64. The bundled runtime launched without separate Node; this establishes the shell continuity only. Preserve its security/readiness behavior while adding bounded universe commands. Native SQLite, editor, full installers and Windows/macOS remain unverified; existing development-tool advisories remain recorded in `story-1-1-evidence.md`.

Storage proceeds universe → linked project → stories → optional volumes; calendar precedes events, same-date ordering and populated revision. Before authoritative storage delivery, satisfy applicable TECH-01/02/04/05/11/12 schema, publication/restart, ownership and native/package checks. Adopted coordination algorithms and an earlier Python lease probe do not verify Electron binding behavior. Other TECH-01–13 portions stay open until their evidence exists; unrelated future gates do not block independent work.

Jo's approved execution pack authorizes routine contracts, implementation, internal review and local verification without phase reapproval. Preserve approved product/UX/data guarantees; full installed-platform acceptance remains separate, and unavailable tester access does not block local progress.
