---
status: draft
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
currentStep: step-04-final-validation
currentEpic: 6
sessionStatus: awaiting-validation-corrections
resumeAt: step-04-open-checks
resumeCheckpoint: _bmad-output/RESUME.md
storyStatus: all-stories-approved-final-validation-concerns
epic6StoryCount: 2
epic5StoryCount: 10
epic4StoryCount: 7
epic3StoryCount: 14
epic2StoryCount: 7
epic1StoryCount: 9
validationStatus: concerns
validationOpenChecks: 2
validationReport: _bmad-output/planning-artifacts/final-validation.md
requirementsStatus: confirmed
epicDesignStatus: approved
inputDocuments:
  - _bmad-output/specs/spec-WritingTool/SPEC.md
  - _bmad-output/specs/spec-WritingTool/requirements.md
  - _bmad-output/specs/spec-WritingTool/contracts.md
  - _bmad-output/planning-artifacts/architecture/architecture-WritingTool-2026-10-10/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/prds/prd-WritingTool-2026-10-10/prd.md
  - _bmad-output/planning-artifacts/prds/prd-WritingTool-2026-10-10/addendum.md
  - _bmad-output/planning-artifacts/prds/prd-WritingTool-2026-10-10/sources/personality-types-list.md
  - _bmad-output/planning-artifacts/prds/prd-WritingTool-2026-10-10/sources/fero-kia-faction-profile.md
  - TODO.md
  - _bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md
---

# WritingTool - Epic Breakdown

## Overview

Jo confirmed the requirements inventory and approved the six-epic structure. Story creation is in progress, processing epics in order and reviewing each story before adding it to the approved breakdown.

## Source precedence and scope

The canonical spec and its companions include later accepted decisions. Their reconciled rules govern where older PRD/addendum/architecture wording differs. The root TODO tracks outstanding work and is not a requirement source for unanswered choices. Inputs were confirmed by Jo before extraction.

All 12 capabilities and FR-1–49 are first-release scope. Jo confirmed the requirements inventory. The epic structure and coverage below are approved; individual stories are being developed. An unresolved decision blocks only its affected implementation once its stated gate is reached.

Superseded wording must not re-enter stories: size-based retention and PostgreSQL-first alternatives; replay-dependent revision chains; automatic chapter-end shifting and chapter-driven main-event movement/restoration; ambiguous volume membership/plot tie ordering; inherited scheduled-backup assumptions; faction changes appearing on the universe timeline; and unresolved outside-close backup-folder cancellation. Current contracts settle these. PostgreSQL, hypothetical branches, leap rules, enforced count/word limits, browser/mobile, cloud/collaboration, signing, automatic software updates and public distribution remain outside this first release.

## Requirements Inventory

### Functional Requirements

FR-1: **Manuscript formatting.** Bold, italics, paragraph indents, headings and scene breaks are editable and survive save/reopen.

FR-2: **Item restoration.** View and restore individual chapter/character/event revisions. Chapters restore saved content/dates without changing linked event dates or content. Event-item restoration is a separate recovery action. Capture the Replaced revision first and resolve shared-universe conflicts manually where applicable; other partial-item dependencies remain a gate. Flag affected restored data linked to an old calendar format differing from the current authority as needing an update; DEC-32 governs the remaining workflow.

FR-3: **Project restoration.** Restore manuscript, plots and required saved character/event state from complete project revisions against the current authoritative universe. Resolve conflicts manually before activation; update restored project and create a new reconciled ZIP. Failed ZIP creation remains visible/retryable. Flag affected restored data linked to an old calendar format differing from the current authority as needing an update; DEC-32 governs the remaining workflow.

FR-4: **Recover replaced work.** Before item or project restoration persist current work in a viewable/restorable revision marked Replaced; failure blocks restoration.

FR-5: **Independent event editing.** Chapter start and end dates are set independently; editing, assigning or clearing one never automatically changes the other, and editing both uses both entered values. Chapter date changes never modify linked main-event or flashback dates/content. The chapter view provides a link to the dedicated event editor; existing event dates/content change through an explicit event edit, not inline chapter fields or chapter-triggered shifts. Chapter operations offer no linked-update toggle or event movement/restoration selection. DEC-01 exception: an existing inverted pair is equalized by setting end to start, with linked events unchanged.

FR-6: **Independent flashbacks.** Editing a flashback historical date in the event editor updates universe placement and retains depicting-chapter links; moving/restoring its depicting chapter never changes that event date/content.

FR-7: **Populated calendar edits.** Configure days/year and days/month with optional months; revise populated calendars while preserving elapsed positions, chronology and intervals and recalculating displayed dates. Dates alone suffice; if time is represented elsewhere it uses 24 hours/day and 60 minutes/hour.

FR-8: **Year composition.** Support months only, unequal months plus standalone days, or days only; standalone days count toward year length and occupy configured positions.

FR-9: **Ordered calendar builder.** Add months/standalone days linearly in any order, including standalone days before/between/after months.

FR-10: **Target year length.** Compare target with summed month lengths and standalone days: red on mismatch, green on match. Saving mismatch is permitted and sets target to actual total; 365 target/360 actual saves 360. Populated-calendar position preservation still applies.

FR-11: **Element names.** Both months and standalone days support names.

FR-12: **Optional year names.** Numbered years without names can be created, saved and displayed; names may be supplied.

FR-13: **Repeating years.** The ordered year sequence and total length repeat unchanged each year under the current configuration; no leap rules.

FR-14: **Year-only births.** Entering/editing birth year creates/updates a linked universe record placed on day 1, even when the year starts with a standalone day.

FR-15: **Character types/filter.** Main, major, minor and extras classification/filtering retains every record’s accessibility; extras need only a name, with fuller optional development available.

FR-16: **Character fields.** Support the field matrix below; expected fields govern completeness with explicit waivers, not a save barrier. Main background is expected unless waived; specialities are optional.

FR-17: **Personality selection.** Use all 100 exact supplied labels in the adopted catalog, names only in the selector. Zero, one or multiple selections survive save/reopen; source descriptions are reference material, not selector text.

FR-18: **Revision triggers.** Capture complete current-work revisions every configurable interval (default 10 minutes), on normal close and before restoration. Include manuscript, plots and pinned historical universe character/event dependencies; durable pending-edit acknowledgment precedes capture/close. Autosave is separate.

FR-19: **Time-only retention.** Architecture replaces PRD size/provider expiry rules: configurable 30-elapsed-day default applies to revisions and completed ZIPs, oldest eligible first, never by size. Protect current/retained dependencies and the ten newest valid completed ZIPs per project/standalone universe, even against manual deletion; if fewer exist protect all.

FR-20: **Restorable retained revisions.** Every revision has a complete manifest referencing immutable content, without replay of earlier revisions; manual deletion/expiry preserves required objects/metadata and cross-unit checkpoints. No fixed minimum revision count.

FR-21: **Shared-content reuse.** Reuse unchanged images/document versions/content within their owning store and within each complete ZIP; distinct independent ZIPs may duplicate bytes. Retained revisions resolve exact saved content.

FR-22: **Active-reference protection.** No stored object needed by current content or retained revisions may be removed, including cross-unit history/assets. Deleting one revision must not delete shared dependencies; no references establishes eligibility without prescribing cleanup time.

FR-23: **Disaster recovery.** Each independent complete ZIP includes a consistent current database state, retained revisions and all required images/content/reference closure. Project ZIP includes universe recovery content; standalone universe ZIP needs no project. Recover without original databases/other ZIPs; establish/reconcile one authority before project activation. Flag affected restored data linked to an old calendar format differing from the current authority as needing an update; DEC-32 governs the remaining workflow. Every saved object category has its own live-storage folder, included with actual category content in complete ZIPs; DEC-33 reconciles the prior database layout. SQLite/similar live database files must reside in their own dedicated database folder within their owning data folder tree and included as a consistent recoverable copy in every complete ZIP, automatically.

FR-24: **Backup triggers.** Manual, configurable scheduled and normal-close backups all provide complete recovery. Scheduled backups default to 10 minutes, independently configurable from 5-minute autosave and 10-minute revisions. Failed/partial attempts never count as valid completed archives. Every completed ZIP filename includes relevant universe/volume/project names and a real date/time stamp under the shared naming contract/DEC-35.

FR-25: **Backup destination.** Select folders including available external drives, independently of live roots. Unavailable destinations prompt for another folder for manual/scheduled/close backups. Canceling alternate selection outside normal close skips only that attempt, reports it incomplete with retry and preserves the configured destination. Normal-close cancellation follows FR-26.

FR-26: **Close fallback.** Canceled alternate-folder choice on normal close creates a new application-root backup folder, falling back to user-data if not writable. Save before close finishes; next launch identifies actual folder and requests a new destination. Outside-close cancellation follows FR-25; fallback-save failure and close retry behavior remain in the coordinated lifecycle gate.

FR-27: **Manuscript exports.** DOCX, PDF, MD and TXT each support whole-story and selected-chapter exports using the shared versioned manuscript contract and approved DEC-06 selection/presentation/publication rules. Bundle LibreOffice for DOCX/PDF; use application-owned TypeScript serializers for MD/TXT.

FR-28: **Settings export.** Export a valid .json file with a JSON object containing autosave/revision intervals, backup schedule/destination, theme and retention.

FR-29: **Settings import.** Import exported settings and restore every exported value, including theme and retention.

FR-30: **Theme.** Offer light, dark and system; system follows OS theme changes. Selection survives settings export/import.

FR-31: **Established decisions and types.** Each decision requires an automatically generated, subsequently editable short name/code displayed on timeline, separate from UUID and full text; defaults E001… events/D001… decisions expand beyond 999 with per-universe uniqueness across both kinds; DEC-38 resolved: trim/nonblank/case-insensitive uniqueness, forward creation-order generation, stable date/order edits, live refresh and retained history; exact schemas/allocation/migration remain technical work. Record timeline position, decision type and decision text; Personal Decisions require a maker, Story Decisions permit none. Neither requires an event link. Support adding more decision types later in the application, saved across reopening and available for category filtering. View in timeline/character/story-arc context. Custom-type maker/ownership rules follow approved DEC-30 below. Hypothetical alternatives and separate reason/consequence text fields are not implied.

FR-32: **Resulting events and decisions.** Established decisions can lead to events or directly to other established decisions, without an intermediate event. Decision/event links remain many-to-many. A decision is resolved when it has at least one outgoing result-event or following-decision link; with neither it is unresolved. Removing a link makes it unresolved only if no outgoing result links of either kind remain. Incoming links do not resolve the receiving decision. Each record retains its own date, and the tree shows the established directed relationships. Decision-link cardinality, self-links/cycles and temporal validation remain open under DEC-28.

FR-33: **Unresolved lookup.** A timeline-accessible section lists selected-universe unresolved decisions with position/maker/decision and reflects current link-derived status and synchronized context.

FR-34: **Story plots.** Each story owns entries with heading, optional date and automatic sequence number. Undated entries first, manually ordered within that group; dated entries chronological, manually ordered within each same-date group. New entries and entries whose dates change go last in their destination group. Numbering follows resulting order and updates after date or ordering changes. Manual reordering cannot override dated chronology or undated-first placement.

FR-35: **Standalone universe events.** Each event requires an automatically generated, subsequently editable short name/code displayed on timeline, separate from UUID and full heading; defaults E001… events/D001… decisions expand beyond 999 with per-universe uniqueness across both kinds; DEC-38 resolved: trim/nonblank/case-insensitive uniqueness, forward creation-order generation, stable date/order edits, live refresh and retained history; exact schemas/allocation/migration remain technical work. Universe Events have heading/date/optional description and require no story/chapter/character/plot/decision or maker link. They may optionally link to decisions and/or a decision-maker and appear at their own recorded positions.

FR-36: **Faction profiles.** Support the field matrix below; all non-roster fields determine completeness but incomplete drafts save/reopen. Optional repeating military units support listed fields. Example values/layout/images are not defaults or combat mechanics. Jo’s universe inventory adds population size, resources, culture notes and an applicable worlds/cities list to faction profiles under DEC-37.

FR-37: **Current affiliation.** Each character has zero or one current faction in its universe, visible in the viewer; simultaneous memberships are excluded.

FR-38: **Affiliation history.** Changing faction records character, previous affiliation, new affiliation and date on the character sheet only, not on the universe timeline; enter/leave unaffiliated state and preserve one-faction-at-a-time history.

FR-39: **Background events.** Character-linked heading/date/optional-description events are the same records in background and owning-universe timeline views.

FR-40: **Date precision.** Standalone/background events, established decisions and optional plot dates require no hours/minutes/seconds. Character-sheet affiliation history also uses date-only values and is excluded from the universe timeline.

FR-41: **Same-date order.** Allow optional manual ordering within a date without changing dates or introducing time-of-day requirements; saving needs no manual order.

FR-42: **Chapter ranges/order.** Start/end dates both optional; dates may span days. Chapters with start dates sort by start; end alone is no fallback. Missing-start chapters appear first in creation order without invented dates. Mutation follows FR-5 and contracts.md; independent start/end editing supersedes AD-16 automatic end shifting. DEC-01 exception: an existing inverted pair is equalized by setting end to start, with linked events unchanged.

FR-43: **Autosave.** Configurable current-work autosave defaults to 5 minutes and round-trips in settings; distinct from 10-minute revisions.

FR-44: **Universe context.** Same-universe stories share timeline/characters/factions/calendar, while plots remain story-specific and other universes separate. Every timeline explicitly identifies its universe; universe/timeline selection synchronizes both ways using ownership.

FR-45: **Timeline overview.** Show dated content chronologically, zoom into dated chapters’ periods, and expose characters/events/established decisions alongside manuscript writing; undated chapters follow FR-42. Show/hide decisions by decision-maker and events by event type without changing records, links or decision resolution; initial categories are Universe Events, Personal Decisions and Story Decisions with added decision types supported; filter behavior follows approved DEC-29; custom-type/makerless rules follow approved DEC-30 below.

FR-46: **Bidirectional planning.** Select a timeline position or a chapter event action to open the event editor for canonical universe event creation/editing. Both entry directions use shared linked records; the chapter view displays linked events and an edit-event link rather than mutating event data inline. Undated chapters remain permitted, chapter dates remain independent, and chapter changes leave all linked event dates/content unchanged.

FR-47: **Associations/targets.** Associate characters with chapters; display chapter-count/per-chapter word targets while planning/writing. Targets never prevent creating, writing or saving beyond them.

FR-48: **Guided creator/viewer.** Offer backstory/development prompts with answered/incomplete/explicitly-waived expected states. Out-of-set prompts need no waiver; fuller development stays available. Viewer exposes image placeholder/background/personality/description/faction/optional specialities.

FR-49: **Database export.** Export locally stored database separately from manuscript/settings/backup operations using adopted SQLite storage; exact artifact format remains a shared export contract to settle before implementation.

#### Required field matrices and date examples

These details belong to the acceptance contract for FR-7–17/36/48 and must be preserved in stories.

##### Character fields

| Field | Completeness expectation |
| --- | --- |
| Name | Required for all types |
| Rank/title (title for civilians) | Expected for main/major/minor; optional for extras |
| Background | Expected for main unless explicitly waived; optional otherwise |
| Description | Expected for main/major/minor; optional for extras |
| Image placeholder, motivation, weaknesses, strengths, specialities | Optional for every type |
| Personality traits | Optional names-only multiselect from the adopted 100-entry catalog |

Expected unanswered development fields mark incomplete without blocking saves; explicit waivers satisfy completeness. Prompts outside the expected set need no waiver. Birth-year day-1 placement is a timeline convention, not evidence of a precisely known birth date.

##### Faction fields

| Group | Supported fields |
| --- | --- |
| Identity | Name, description, identifier image/pictogram |
| Government | Type, notes |
| Leadership | Leader image, name, age, public reputation, narrative profile; military head; intelligence head |
| Strategic profile | Overview, strengths, weaknesses |
| Optional repeating military roster | Unit name, role, description, base strength, movement points, base modifier points |

All fields outside the optional roster determine completeness; incomplete drafts remain saveable. Narrative fields can preserve organization, technology, resources, doctrine, intelligence, troop numbers and allies without extra mandatory structured fields. The Fero-Kia example supplies structure, not fixed prose/names/values/layout or relationship/combat functionality.

##### Calendar display examples

Preserve `dayofyear/year` and `month/dayofmonth/yearnumber/yearname`; year names remain optional. `362/6976` means day 362 of year 6976 in an example 365-day calendar without months; 365 is not a required default. Standalone-day display remains open. Fictional dates and real revision/archive creation timestamps are separate contracts.


### NonFunctional Requirements

NFR-1: **Local operation.** All first-release writing, planning, persistence, recovery, backup and export capabilities operate on one machine with open-source tools and no hosted service dependency. [PRD quality requirements; spec constraints; AD-1/3.]

NFR-2: **Persistence.** Saved manuscript formatting, character/faction content, dates, settings and record relationships survive close/reopen. Versioned document migrations preserve saved content; unsupported future document schemas must not be blindly rewritten. [PRD persistence; AD-13.]

NFR-3: **Data integrity.** Linked views refer to consistent canonical records. Preserve elapsed chronology across calendar changes, explicit event-editing and item/project recovery scope, independent chapter dates, fixed flashback historical dates and same-universe ownership. [PRD data integrity; FR-5–7/44; shared contracts.]

NFR-4: **Recoverability.** An independent complete ZIP restores current content, retained history, required images and reference closure without original stores or other ZIPs. Current/retained dependencies survive deletion and expiry. Item/project restore first durably captures Replaced; failures block restoration. [FR-2–4/20/22/23.]

NFR-5: **Space efficiency.** Reuse immutable unchanged content within its owning store and once within each complete ZIP; separate independent ZIPs may duplicate content. Revision restoration requires no replay chain. [FR-20/21; AD-14.]

NFR-6: **Crash and concurrency consistency.** Prove crash/restart and partial-failure consistency for cross-store/assets publication, pending-edit capture and backup cuts; serialize authoritative writes per owning identity across sessions. Detailed protocols remain TECH-02–05 gates, not proven implementations. [AD-10/14/18.]

NFR-7: **Desktop security boundaries.** Use isolated sandboxed renderer/preload with Node integration disabled; validate bounded typed transport, forbid generic SQL/filesystem bridges, prevent remote/imported content from gaining window privilege and validate/confine imports to managed roots. [AD-18.]

NFR-8: **Supported installation.** Provide normal installed operation, bundled runtime and menu integration for approved DEC-09 Windows 10/11 x64 .exe, macOS 13+ Intel/Apple Silicon .dmg and Ubuntu 22.04+/Debian 12+ x64 .deb, including bundled LibreOffice. Verify Pop!_OS/Zorin/Mint individually; Windows/Linux ARM deferred. Verify installed compatibility and native assets via DEC-10 and TECH-11/12 before acceptance. [AD-17; spec constraints.]

NFR-9: **Truthful failure reporting.** Distinguish save, reconciliation and backup outcomes. Failed/partial backups never count as successful; unresolved recovery never activates a project; unavailable live data never silently creates replacement authority. [AD-7/8/18; visibility/error convention.]

NFR-10: **Performance acceptance.** Use the approved DEC-11 generated baseline and ten-times-content growth corpus below; these are test workloads, never application limits. Corpus generation is pending. Approved DEC-11 budgets/reference-machine/measurement conditions are recorded below; generate fixtures and measure actual installed performance under VERIFY-10 before acceptance. [PRD quality requirements; spec open questions; DEC-11.]

### Additional Requirements

**Starter requirement for Epic 1, Story 1:** The adopted seed is the official Electron Forge Webpack + TypeScript template with React added (AD-11). Adapt it to the Clean Architecture/runtime boundaries. Verify template/editor/background/native integration before adopting package pins; the architecture's versions remain untested candidates. This requirement does not yet define or approve an epic or story.

- **AR-01 (AD-1) — Electron desktop host:** Deliver a local Electron desktop application with its runtime bundled in separate platform builds. All first-release capabilities operate locally.

- **AR-02 (AD-2) — SQLite first; PostgreSQL later:** Initially implement SQLite through application-owned persistence ports. PostgreSQL is deferred. Provider-specific migrations, backups, export and transaction behavior belong to infrastructure; another provider must satisfy the same application contracts.

- **AR-03 (AD-3) — Inward dependencies throughout:** Domain imports no Electron, React, Lexical, database, filesystem or archive APIs. Application depends on domain and defines infrastructure ports. Adapters depend inward. Editor conversion, transport validation and storage mapping occur outside the inner layers. Select open-source tools; required first-release functionality must work locally.

- **AR-04 (AD-4) — Managed external images:** Copy imported images into the owning unit's managed image folder. SQLite stores references relative to that unit's storage root, never image bytes or a dependency on the original import path. Saved versions referenced by current work or retained revisions remain available. Every backup includes its required images.

- **AR-05 (AD-5) — Independent complete ZIP backups:** Every completed backup is a separate ZIP containing a consistent saved database state, retained revisions and all required content/images. Store shared content once within that archive; duplication across separate archives is permitted. Backup triggers are manual, configurable schedule and normal application close. Destination selection and unavailable-destination prompts follow FR-25/26, including application-root then user-data fallback on canceled close-time selection and next-launch notification.

- **AR-06 (AD-6) — Distinct project and universe units:** A project associates with a separately owned universe and can contain multiple stories, optionally grouped into volumes. Volume, story and chapter counts are unrestricted; word targets are informational. Universe data is shared only within that universe. Project ZIPs include the project's complete state and a backup of its universe. Standalone universe ZIPs require no project. Project grouping and manuscript/plot data do not become universe-owned.

- **AR-07 (AD-7) — Reconcile project recovery against the live universe:** Preserve a pre-restoration revision marked Replaced. Restore the older project against the newest authoritative universe state; present conflicts for manual resolution. Do not silently overwrite shared records or activate an unresolved restored state. Update the restored project after resolution, then create a new project ZIP with its reconciled universe snapshot. Failure to create that ZIP must remain visible and retryable, not reported as completed backup.

- **AR-08 (AD-8) — One authoritative universe:** Every associated project refers to the same authoritative universe. Backup copies are recovery snapshots, not live authorities. Universe changes use the authority's application use cases; any explicit manual resolution that changes universe data changes that authority. If authority is missing, establish one through recovery before activating the project. Universe recovery must reconcile against an existing authority rather than create a second live copy with the same identity.

- **AR-09 (AD-9) — User-selected live folders:** Let Jo choose live project and universe folders independently of backup destinations. Asset references remain relative to their owning root. Moving a folder requires resolving its identity/location; it must not silently create another authoritative universe.

- **AR-10 (AD-10) — Separate databases by ownership unit:** Each project and each universe owns its SQLite database and managed image storage. Projects reference their universe and its records by identity. The application validates cross-database references; it must not assume SQLite foreign keys enforce them. Changing a folder path does not change logical identity. Cross-store mutation and backup require consistent state; the crash-safe coordination protocol is a pre-implementation gate below.

- **AR-11 (AD-11) — TypeScript and React:** Write application code in TypeScript; use React in presentation. Start from the official Electron Forge Webpack + TypeScript template with React added; adapt its directory/import boundaries to AD-3/18.

- **AR-12 (AD-12) — Lexical editor adapter:** Use Lexical through a React presentation adapter. Preserve bold, italics, paragraph indentation, headings and scene breaks across editing, save/reopen and revision recovery. Editor undo history does not replace automatic revisions.

- **AR-13 (AD-13) — WritingTool-owned manuscript contract:** Persist an explicitly versioned structured JSON manuscript owned by WritingTool. Map Lexical state at the adapter boundary. Revisions and DOCX/PDF/Markdown/plain-text exports consume this same contract for whole-story and selected-chapter output. Schema migrations must preserve saved content; unsupported future schema versions must not be rewritten blindly.

- **AR-14 (AD-14) — Complete revisions with shared immutable content:** Each revision is a complete logical state indexed by a complete manifest referencing immutable saved content. It restores without replaying earlier revisions. Project revisions cover manuscript/plots and the saved universe-owned character/event content needed for the revision, through a pinned historical universe checkpoint; this is historical state, not a live replica. Reuse unchanged content within its owning store; preserve every object/record required by current content or a retained revision, including cross-unit checkpoint/asset dependencies. Project ZIPs include that historical dependency closure as well as the current universe snapshot. Capture at a configurable interval (default 10 minutes), on normal close and before restoration. Before capture of current work, backup or normal close, synchronize pending manuscript edits through application use cases and obtain durable acknowledgment; never snapshot only an older autosaved document while claiming to capture current work. Before either item or whole-project restoration, capture current state in a revision marked Replaced. Do not apply restoration if pending edits or that protective snapshot cannot be persisted. Restore selected items to saved state and leave unselected records unchanged; any conflict with the authoritative universe requires manual reconciliation under AD-7/8.

- **AR-15 (AD-15) — Time-only cleanup and ten protected backups:** Configurable retention defaults to 30 elapsed days for revisions and completed backup ZIPs. Size never determines expiry. Remove oldest eligible entries first. For each project and each standalone universe independently, protect the ten newest successfully completed, valid backup ZIPs regardless of age; if fewer exist, protect all. Embedded universe snapshots do not replace standalone universe backups. This protection also applies to manual archive deletion. Retain referenced revision/current-content dependencies; no ten-revision minimum is specified. Deleting an archive never deletes live-store assets. Include retention settings in JSON export/import.

- **AR-16 (AD-16, superseded chapter/event mutation rules) — Independent chapter dates and explicit event editing:** Chapter start and end dates are independently set. Editing, assigning or clearing either changes only explicitly edited chapter fields; changing both uses both entered values. Changing chapter dates never shifts or edits any linked event, whether main or flashback. Chapter views show linked event information and provide an Edit event link that opens the dedicated editor for the same canonical event UUID and owning-universe identity. Existing event dates/content change through explicit event editing, not inline chapter fields or chapter save/rescheduling. Creating a new event from chapter context also opens the event editor; links reference its resulting canonical record. Chapter association changes may link/unlink records but do not edit/delete event content. The former linked-update toggle, main-event selection defaults and chapter-driven elapsed-day event shifting are superseded. Calendar reconfiguration continues to preserve elapsed event positions while recalculating displayed dates; it is not chapter-driven event editing. Chapter-only restoration restores the chapter's saved content/dates without modifying any linked main-event or flashback date/content. Persist the mandatory protective Replaced revision before restoration and apply the shared reference/authority integrity rules. There is no chapter-restoration event-selection control. This supersedes earlier selected linked-event saved-state restoration. Explicit event-item restoration and whole-project/universe recovery remain separate supported operations under the existing Replaced, dependency-protection and manual-reconciliation contracts; this chapter-editing rule does not remove those recovery capabilities.

- **AR-17 (AD-17) — Supported installed desktop targets:** Normal installation with desktop/application-menu integration under approved DEC-09: Windows 10/11 x64 .exe; macOS 13+ Intel/Apple Silicon .dmg; Ubuntu 22.04+/Debian 12+ x64 .deb; bundled LibreOffice. Verify Pop!_OS/Zorin/Mint individually; Windows/Linux ARM deferred. Actual installed compatibility remains to verify. Keep live writing folders separate from installation. Use maintained runtime versions compatible with these floors.

- **AR-18 (AD-18) — Dedicated background application boundary:** React/Lexical renderer presents and edits, with context isolation and sandbox enabled and Node integration disabled. Preload exposes bounded typed commands/queries. Electron main handles windows, native dialogs and lifecycle, and routes messages to an internal Electron utility process hosting application use cases and infrastructure. All authoritative writes pass through those use cases, serialized by one writer coordinator for each project/universe identity across every open session; another host cannot independently write that same unit. Validate messages at transport adapters; no generic SQL/filesystem access through the bridge. Load packaged application content in the privileged window; remote navigation and imported manuscript/archive content cannot acquire that privilege. Import adapters validate schemas and confine extracted files/references to managed roots. Coordinate normal shutdown so pending work is saved, closing revisions and backups finish, and failures receive the agreed recovery handling before close completes.

#### Cross-cutting conventions

| Concern | Contract |
| --- | --- |
| Identity | Project, universe and record identity survives relocation and backup. Cross-unit references carry owning universe identity; paths are locations, not identities. Final identifier wire format must be shared before persistence/IPC work starts. |
| Fictional chronology | One universe-owned date-only chronology; all date conversion goes through its calendar rules. Calendar edits preserve elapsed positions/order/intervals and recalculate displayed dates. The common persisted coordinate/epoch contract must be fixed before calendar/persistence work. |
| Real time | Snapshot/archive age uses real elapsed time, independent of fictional dates; clocks and timestamps use a common documented contract before retention implementation. |
| Event ownership | Universe owns canonical timeline records; project/story/chapter views link to those records. Chapter depiction links distinguish main events and flashbacks. Standalone universe records require no project; loss of project data must not make its universe unreadable. |
| Derived state | Decision resolution derives from remaining decision/resulting-event links (many-to-many). Plot numbering derives from each story's undated-first/dated-chronological order. Current faction/history follow one faction at a time. Draft completeness is separate from save validity. |
| Visibility and errors | Report persistence, reconciliation and backup outcomes independently. Never label a failed or partial archive successful; unavailable live data never triggers silent replacement. |
| Settings and save | Autosave defaults to 5 minutes, separately configurable from 10-minute revisions. Preserve theme, intervals, backup destination/schedule and retention through settings JSON import/export. Scheduled backups are confirmed at a 10-minute default, independently configurable from autosave and revisions; the shared contracts supersede the older assumption. |

#### Accepted shared contracts

## Identity

Projects, universes and records have permanent UUIDs; folder paths are separately resolved locations, never identities. Moving a folder or restoring the same data preserves UUIDs. References to universe-owned records include universe UUID and record UUID and must resolve within that universe. Recovery copies retain identity but do not become additional live authorities.

UUIDs do not define version recency or resolve conflicts. Those recovery protocols remain open in SPEC.md.

##### Volume grouping

Volumes are optional project-owned groups of stories. A story is either ungrouped or belongs to one volume at a time within its project; stories can move between volumes or return to ungrouped. Jo can manually order volumes and stories, including ungrouped stories. Grouping does not change story ownership of chapters/plots or shared universe identity. Volume/story/chapter counts and word length have no enforced limits; no nested-volume behavior is implied.

##### Plot ordering

Plot sequences remain story-owned. Undated entries come first and can be manually ordered within that group. Dated entries follow in chronological date order; entries sharing a date can be manually ordered within that date. Manual ordering cannot move an entry across these date groups or override chronology. A new entry or an entry whose date changes goes last within its destination undated or same-date group, ready for manual reordering. Automatic sequence numbers reflect the resulting order and update after date or ordering changes.

##### Chapter dates and event editing

Chapter start and end dates are independently set. Editing, assigning or clearing either changes only explicitly edited chapter fields; changing both uses both entered values. Changing chapter dates never shifts or edits any linked event, whether main or flashback. Chapter views show linked event information and provide an Edit event link that opens the dedicated editor for the same canonical event UUID and owning-universe identity. Existing event dates/content change through explicit event editing, not inline chapter fields or chapter save/rescheduling. Creating a new event from chapter context also opens the event editor; links reference its resulting canonical record. Chapter association changes may link/unlink records but do not edit/delete event content. The former linked-update toggle, main-event selection defaults and chapter-driven elapsed-day event shifting are superseded. Calendar reconfiguration continues to preserve elapsed event positions while recalculating displayed dates; it is not chapter-driven event editing.

##### Chapter restoration and event isolation

Chapter-only restoration restores the chapter's saved content/dates without modifying any linked main-event or flashback date/content. Persist the mandatory protective Replaced revision before restoration and apply the shared reference/authority integrity rules. There is no chapter-restoration event-selection control. This supersedes earlier selected linked-event saved-state restoration. Explicit event-item restoration and whole-project/universe recovery remain separate supported operations under the existing Replaced, dependency-protection and manual-reconciliation contracts; this chapter-editing rule does not remove those recovery capabilities.

##### Missing universe authority

If the live universe folder is missing, prompt Jo to locate it or select a backup to recover. Keep the associated project inactive until the matching universe is available as its single authority. Folder relocation and backup recovery preserve universe UUID; a backup is not an additional live authority.

##### Universe conflicts

When recovered data conflicts with an existing live universe, present the conflicting records for manual resolution. Preserve live data until Jo confirms changes; any confirmed universe changes target the same single authoritative universe. Unresolved restored projects remain inactive. Record equality and conflicts follow the record comparison contract; version ordering remains open, and cancellation and intervening changes follow their separate contracts.

##### Record comparison

Compare matching records by UUID within the same owning universe. If the saved content differs, flag a conflict for manual resolution. Identical records require no review. Leave unrelated live records unchanged; absence from recovered data alone does not authorize deletion. Missing references follow the separate missing-reference contract. The common persisted content comparison representation remains part of the shared schema contract.

##### Conflict resolution choices

For each conflicting record, offer keep the live record, use the recovered record, or edit a combined version. Choices remain proposed until confirmed and must pass the reconciliation freshness check and shared-record integrity rules before application. Confirmed changes update the single authoritative universe and affect every project sharing it. No automatic merge or conflict winner is implied.

##### Missing references

When a recovered project references a character, faction or event missing from its live universe, flag the reference for manual resolution before project activation. Offer restoring the missing record from recovery content, linking to an existing replacement in the same universe, or removing the reference. Apply chosen changes only after confirmation and freshness/integrity validation; never leave dangling references in an activated project. Restored records belong to the single authoritative universe. Removing a reference is not permission to delete protected retained-history content.

##### Reconciliation cancellation

Canceling reconciliation leaves live data unchanged and keeps the restored project inactive. Preserve the pending recovery and reconciliation work so Jo can resume later. Cancellation does not activate the restored project or apply proposed changes.

##### Changes during reconciliation

Before applying confirmed reconciliation choices, recheck the authoritative live universe against the state used to make those choices. If it changed, require review again only for affected conflicts; preserve choices for unaffected records. Do not apply stale choices to changed records. Once required reviews are complete, apply against the rechecked authoritative state through the coordinated write protocol. The race-free validation/commit mechanism remains a shared implementation gate.

##### Save and backup intervals

Scheduled backups default to 10 minutes. Autosave defaults to 5 minutes and revision snapshots to 10 minutes. All three intervals are independently configurable and round-trip through settings JSON; configuring one interval does not change the other two.

This confirmation supersedes the adopted architecture companion’s inherited backup-default assumption.

##### Backup destination cancellation

Outside normal application close, canceling selection of an alternative backup folder skips only the current manual or scheduled backup attempt. Show that attempt as incomplete with a retry option and preserve the configured destination for future attempts. An incomplete attempt does not count toward the protected ten successful valid backups. On normal close, cancellation still uses the agreed application-root then user-data fallback with next-launch notification under FR-26.

##### Faction affiliation history

Record faction entry, exit and changes as dated character affiliation history. Each change identifies the character, previous affiliation, new affiliation and fictional date. Display current affiliation and its history only on the character sheet; faction changes must not appear on the universe timeline or create visible timeline entries. Keep zero or one faction at a time and retain the same authoritative universe-owned history across projects. Calendar changes preserve affiliation elapsed positions and intervals. Same-date/out-of-order history sequencing and correction rules remain open under DEC-22; timeline-event ordering does not decide affiliation-history order. This later decision supersedes older source requirements placing faction changes on the universe timeline.

### UX Design Requirements

No dedicated DESIGN.md/EXPERIENCE.md pair or legacy UX specification was found. No visual tokens, component library, layouts, accessibility standards or extra UI behavior have been invented. Existing functional interaction requirements remain binding. PLAN-04 tracks whether dedicated UX documents are needed and requires the relevant layouts/interactions/error flows before affected UI stories.

#### Open decision and technical gates

These are unresolved work items, not accepted answers. Resolve them by their stated implementation gates and record resulting decisions in the canonical contracts. References point to [TODO.md](../../TODO.md).

- [ ] DEC-01 — Decide what happens when a chapter end date is earlier than its start date: block saving, allow with a warning, or another agreed behavior. **Jo / UX / architecture; before chapter date validation.** Start and end remain independently set; no automatic correction has been agreed.
- [x] DEC-02 — Resolved by Jo: replace chapter-linked update/event-selection controls with an Edit event link to the dedicated editor. Chapter date changes and chapter-only restoration leave linked event dates/content unchanged. The decision is settled; UI implementation remains tracked by BUILD-07 and PLAN-04.
- [ ] DEC-03 — Define the fictional calendar's elapsed-day coordinate/epoch and supported year bounds. **Architecture / Jo; before date persistence.**
- [ ] DEC-04 — Define standalone-day and optional year-name display, preserving the existing date-format examples. **Jo / UX; before calendar UI.**
- [ ] DEC-05 — Settle exact guided character-development prompt wording while preserving all agreed fields and waiver/completeness behavior. **Jo / UX; before the guided creator.**
- [x] DEC-06 — Product/tool choices resolved: approved selection/order/capture, format mappings/presentation and Save As/publication rules; bundled LibreOffice for DOCX/PDF, application-owned TypeScript MD/TXT serializers. Exact integration/installed verification remains TECH-12.
- [ ] DEC-07 — Define settings validation, including accepted interval and retention values and invalid-input feedback. **Jo / UX; before settings and scheduler implementation.**
- [ ] DEC-08 — Define behavior when normal-close fallback saving fails, including retry and close behavior. **Jo / architecture / UX; before coordinated shutdown.**
- [x] DEC-09 — Approved Windows 10/11 x64 .exe, macOS 13+ Intel/Apple Silicon .dmg and Ubuntu 22.04+/Debian 12+ x64 .deb; menu integration and bundled LibreOffice. Individually verify Pop!_OS/Zorin/Mint; Windows/Linux ARM deferred. Installed tests remain DEC-10/TECH-11/12.
- [ ] DEC-10 — Platform verification plan approved (see later DEC-10 amendment); actual hardware/VM/tester access remains unconfirmed before installed acceptance.
- [x] DEC-11 — Generated baseline/growth corpus and timing/reference-machine/measurement conditions approved in the later DEC-11 amendments. Fixture generation and installed measurements remain VERIFY-10 work.
- [ ] TECH-01 — Publish shared versioned DTO, error, manuscript-document and backup-manifest schemas; retain the agreed permanent UUID and owning-universe identity rules. **Before persistence, IPC or recovery.**
- [ ] TECH-02 — Define crash-safe cross-store and asset publication, durable operation identity and restart recovery. **Before linked mutation or backups.**
- [ ] TECH-03 — Define consistent snapshot/backup capture, including durable acknowledgment of pending manuscript edits. **Before revisions, backups or close capture.**
- [ ] TECH-04 — Define per-unit writer leases, concurrent-open handling and mutation serialization across sessions. **Before authoritative writes.**
- [ ] TECH-05 — Define background-host crash/restart, unfinished-operation reconciliation and shutdown draining, incorporating DEC-08. **Before lifecycle/recovery implementation.**
- [ ] TECH-06 — Define universe version ordering and equality/divergence metadata and the persisted content-comparison representation. **Before recovery.** Record-conflict choices are already agreed.
- [ ] TECH-07 — Define race-free freshness validation and commit for recovery reconciliation. **Before applying recovered changes.**
- [ ] TECH-08 — Define shared-record reference/history preservation and partial-item restoration scope. **Before deletion or item restoration.**
- [ ] TECH-09 — Define revision manifest/object identity, immutable image versions and cleanup roots, including cross-store retained dependencies. **Before revisions or cleanup.**
- [ ] TECH-10 — Define discovery and protection of backup archives across moved destinations. **Before archive cleanup or manual deletion.**
- [ ] TECH-11 — Choose and verify the SQLite binding/engine, journaling and migration strategy in installed builds. **Before persistence.**
- [ ] TECH-12 — Verify Forge/TypeScript/React/Lexical integration, isolated renderer/preload, background-host bundling and native assets before adopting dependency pins and a lockfile.
- [ ] TECH-13 — Define the SQLite database-export artifact and consistent capture contract, separately from backup ZIPs. **Before database export.**

### FR Coverage Map

Primary ownership covers each FR once. Supporting epics complete cross-feature integration when those records/features are introduced; no early epic relies on a later epic to operate. Full-release acceptance still covers each entire FR.

FR-1: Epic 2 — Manuscript formatting.
FR-2: Epic 5 — Item restoration.
FR-3: Epic 5 — Project restoration.
FR-4: Epic 5 — Recover replaced work.
FR-5: Epic 3 — Independent event editing through chapter-view edit links; Epic 2 preserves independent chapter dates and Epic 5 preserves chapter-only restoration isolation.
FR-6: Epic 3 — Independent flashbacks.
FR-7: Epic 1 — Populated calendar edits.
FR-8: Epic 1 — Year composition.
FR-9: Epic 1 — Ordered calendar builder.
FR-10: Epic 1 — Target year length.
FR-11: Epic 1 — Element names.
FR-12: Epic 1 — Optional year names.
FR-13: Epic 1 — Repeating years.
FR-14: Epic 3 — Year-only births.
FR-15: Epic 3 — Character types/filter.
FR-16: Epic 3 — Character fields.
FR-17: Epic 3 — Personality selection.
FR-18: Epic 5 — Revision triggers.
FR-19: Epic 5 — Time-only retention.
FR-20: Epic 5 — Restorable retained revisions.
FR-21: Epic 5 — Shared-content reuse.
FR-22: Epic 5 — Active-reference protection.
FR-23: Epic 5 — Disaster recovery.
FR-24: Epic 5 — Backup triggers.
FR-25: Epic 5 — Backup destination.
FR-26: Epic 5 — Close fallback.
FR-27: Epic 6 — Manuscript exports.
FR-28: Epic 2 — Settings export.
FR-29: Epic 2 — Settings import.
FR-30: Epic 2 — Theme.
FR-31: Epic 4 — Typed established decisions, added decision types and contextual views.
FR-32: Epic 4 — Decision-to-event and direct decision-to-decision links, either-result resolution and tree.
FR-33: Epic 4 — Unresolved lookup.
FR-34: Epic 4 — Story plots.
FR-35: Epic 1 — Standalone Universe Events; Epics 4/5 preserve optional decision/maker links and recovery.
FR-36: Epic 3 — Faction profiles.
FR-37: Epic 3 — Current affiliation.
FR-38: Epic 3 — Affiliation history.
FR-39: Epic 3 — Background events.
FR-40: Epic 1 — Date precision; Epics 3/4 apply the common date-only rule to their event types.
FR-41: Epic 1 — Same-date order.
FR-42: Epic 2 — Chapter ranges/order.
FR-43: Epic 2 — Autosave.
FR-44: Epic 1 — Universe context; Epics 3/4 extend shared-universe context to their records.
FR-45: Epic 3 — Chapter/timeline/character/event writing context; Epic 4 completes decisions and maker/category visibility.
FR-46: Epic 3 — Bidirectional planning.
FR-47: Epic 3 — Associations/targets.
FR-48: Epic 3 — Guided creator/viewer.
FR-49: Epic 6 — Database export.

## Epic List

**Approved by Jo.** Each epic delivers a usable workflow and introduces the infrastructure it needs. Later epics can extend earlier capabilities; earlier workflows must not call or require future functionality. All epics remain required for the first release.

### Epic 1: Build and organize a chronological writing universe

Jo can create/open project and universe folders, organize stories into optional volumes, build a fictional calendar, record standalone events and browse their chronology with the correct universe selected.

**FRs covered (primary):** FR-7, FR-8, FR-9, FR-10, FR-11, FR-12, FR-13, FR-35, FR-40, FR-41, FR-44.

**Dependencies:** No earlier epic. Provides usable local universe planning before manuscript editing, character development or decision tracking.

**Implementation considerations:** Include the official Forge Webpack/TypeScript starter with React as the first story, then establish shared contracts and secure hosts as needed for this usable slice. Introduce schema only for implemented features. Permanent UUIDs, separate project/universe stores, selected live roots, optional volume membership/manual order and one authoritative universe are binding. Calendar conversion preserves elapsed chronology and optional within-date ordering. Later event types reuse these records and chronology rather than duplicate them.

**TODO gates:** TECH-01–05 and TECH-11/12 before their affected bootstrap/persistence/write paths; DEC-03/04 before calendar persistence/display. DEC-09/10 before installed-platform acceptance. PLAN-04 applies to required UI flows.

### Epic 2: Write and save manuscripts in the workspace

Jo can write formatted chapters within the organized stories, set independent optional start/end dates, save/reopen work with autosave, choose appearance and import/export application settings.

**FRs covered (primary):** FR-1, FR-28, FR-29, FR-30, FR-42, FR-43.

**Dependencies:** Builds on Epic 1 project/story organization, calendar and local storage; works without character, decision, recovery or export features from later epics.

**Implementation considerations:** Use the WritingTool-owned document schema through the Lexical adapter. Preserve chapter ordering and both absent dates without inventing dates. Configure independent 5-minute autosave, 10-minute revision and 10-minute backup defaults plus 30-day retention; configuring future services does not claim those services are running. Settings round-trip all agreed values. Advanced record associations and dedicated event-editor links arrive in Epic 3; chapter operations never move events.

**TODO gates:** TECH-01/03/12 before affected editor/capture paths; DEC-01 before chapter range validation and DEC-07 before settings validation. Unanswered date validation must not silently become automatic date correction.

### Epic 3: Develop characters and factions alongside chapter chronology

Jo can develop and find characters/factions, maintain dated affiliations on character sheets and background events on the timeline, associate characters with chapters, see chapter targets/context and plan from either a chapter or the timeline while controlling which main events move.

**FRs covered (primary):** FR-5, FR-6, FR-14, FR-15, FR-16, FR-17, FR-36, FR-37, FR-38, FR-39, FR-45, FR-46, FR-47, FR-48.

**Dependencies:** Builds on Epics 1 and 2. Character/faction/context workflows work before decision trees in Epic 4; no later feature is required to create or use these records.

**Implementation considerations:** Keep canonical universe records shared across views and projects. Implement all character/faction fields, the exact 100-label personality selector, draft completeness/waivers, birth-year day-1 events and one-faction-at-a-time history. Chapter start/end remain independent, and chapter operations leave all linked events unchanged. The chapter view opens the dedicated event editor to explicitly change an event. Epic 5 preserves this separation for chapter-only restoration while retaining separate event-item and whole-project recovery. FR-45 decision context is completed in Epic 4 when decision records exist.

**TODO gates:** DEC-05 before creator UI; DEC-02 selection controls are superseded by event-editor navigation under PLAN-04/DEC-15; TECH-02/04 before cross-store mutations. TECH-08 before any shared-record deletion. Inherit all earlier chronology and identity gates.

### Epic 4: Track plots and established decisions

Jo can maintain each story’s ordered plot sequence, inspect established decision/result relationships in timeline and arc context, and find decisions without a remaining linked result.

**FRs covered (primary):** FR-31, FR-32, FR-33, FR-34.

**Dependencies:** Builds on the universe, manuscript and character/context workflows in Epics 1–3. Requires no later recovery or export epic to use plots and decisions.

**Implementation considerations:** Consolidate decision recording, many-to-many result-event links, direct decision-to-decision links, tree display and unresolved lookup into one outcome. Direct decision links require no intermediate event; either an outgoing event or decision link resolves its source. DEC-28 still gates link validation. Integrate decisions into the existing FR-45 context, reusing FR-40 date-only positions and FR-44 universe ownership. Keep plots story-owned: undated-first then chronological, manual order only within the undated/same-date group, destination-group-last insertion and derived numbering. Shared timeline/query use is intentional; no separate decision timeline or parallel event store.

**TODO gates:** TECH-08 before deletion that affects shared references/history. Required decision/plot layouts remain covered by PLAN-04; do not invent hypothetical branching or extra mandatory fields.

### Epic 5: Protect work and recover earlier or lost data

Jo can inspect and restore items, projects and replaced work; create independent complete project/universe backups; recover after original-store loss; and safely retain or remove old history and archives.

**FRs covered (primary):** FR-2, FR-3, FR-4, FR-18, FR-19, FR-20, FR-21, FR-22, FR-23, FR-24, FR-25, FR-26.

**Dependencies:** Builds on Epics 1–4 to protect all implemented manuscript, plot and universe content. Does not depend on manuscript/database exports in Epic 6; complete backup ZIPs remain a separate recovery product.

**Implementation considerations:** Keep revisions, deduplication, retention, backups and restoration together because they share manifests, immutable objects and protected dependency closure. Persist pending edits before capture; failed Replaced capture prevents restore. Chapter-only restoration leaves linked events unchanged; explicit event-item and whole-project recovery remain separate. Implement manual/scheduled/normal-close capture, fallback/retry behavior, the ten protected valid ZIPs per unit, and manual conflict/missing-reference reconciliation against one universe authority with resumable cancellation and freshness rechecks. Never report a partial ZIP or unresolved recovery as success.

**TODO gates:** TECH-02–10 and DEC-08 before affected recovery/capture/cleanup/lifecycle paths. DEC-07 validation applies to scheduled services. Prove crash/restart and partial-failure consistency before dependent feature acceptance.

### Epic 6: Export writing and database content

Jo can export whole stories or selected chapters to DOCX/PDF/MD/TXT and separately export the local database.

**FRs covered (primary):** FR-27, FR-49.

**Dependencies:** Builds on manuscript/document/storage contracts from Epics 1 and 2. Can be scheduled after Epic 2 once its own gates are resolved; its numbered position is not a dependency on Epics 3–5. Must remain compatible with all subsequently added content.

**Implementation considerations:** All manuscript formats consume the shared versioned document contract. Database export has its own consistent-capture contract; it does not substitute for the complete recovery ZIPs. Keep the four manuscript formats in one export workflow to avoid repeatedly redesigning the same selection/document interface.

**TODO gates:** DEC-06 product/tool choices are resolved; TECH-12 verifies bundled LibreOffice conversion and TECH-13 defines database export before affected implementation; TECH-03 wherever consistent current-work capture is required.

### Cross-cutting acceptance and overlap

All NFRs and applicable AR-01–18 constrain each affected story. Architecture boundaries, security, persistence and failure reporting begin with the first usable slice; they are not postponed to a separate technical-layer epic. The final installed product must pass the agreed platform matrix and the complete spec success scenario. DEC-09–11 and VERIFY-09/10/12 remain release-acceptance gates.

Shared timeline/calendar queries, identity, storage ports and application transport are intentional common foundations, not separate copies per epic. Manuscript/formatting/settings remain together in Epic 2; character/faction development and chapter associations together in Epic 3; decision/result/lookup/tree and plot ordering together in Epic 4; protection/recovery/cleanup together in Epic 5; manuscript format variants together in Epic 6. There are no application source files yet to audit for concrete file overlap; check actual module overlap during story design and implementation.

Epics 3/4/5 follow the main chronology; Epic 6 can move earlier after Epic 2 without invalidating the dependency model. No quantitative performance targets, UX tokens, export libraries or unanswered TODO decisions are adopted by this epic structure.

## Epic 1: Build and organize a chronological writing universe

Jo can create/open project and universe folders, organize stories into optional volumes, build a fictional calendar, record standalone events and browse their chronology with the correct universe selected.

**Story planning status:** All nine Epic 1 stories (1.1–1.9) approved by Jo. Jo confirmed proceeding to Epic 2 story planning. Approval records scope and acceptance criteria, not implementation completion.

### Story 1.1: Set up initial project from starter template

As Jo,
I want WritingTool to launch as a local desktop application,
So that I have a working application in which subsequent stories can add writing and universe planning.

**Acceptance Criteria:**

**Given** a clean development checkout with documented prerequisites,
**When** the documented install and development-start commands are run,
**Then** the official Electron Forge Webpack + TypeScript starter, adapted to include React, opens a WritingTool desktop window,
**And** application source follows the adopted domain, application, presentation, infrastructure and desktop boundaries without framework imports in the inner layers.

**Given** the desktop window is running,
**When** its runtime configuration and permitted communication paths are checked,
**Then** the renderer is sandboxed and context-isolated with Node integration disabled,
**And** preload exposes only the bounded typed application interface defined by the shared contracts,
**And** Electron main owns window/lifecycle handling and routes a minimal non-mutating readiness query to the background application host,
**And** the UI receives a validated readiness result without generic SQL or filesystem access.

**Given** the shared readiness contract defines failure results,
**When** the background host cannot start or the readiness query fails,
**Then** the application reports that it is unavailable and does not claim to be ready,
**And** no project/universe files are created as a side effect of this smoke check.

**Given** the application has been packaged for the available development platform,
**When** the packaged executable is opened,
**Then** the bundled runtime loads the local React window, preload and background host successfully,
**And** the same readiness query succeeds without a separate Node installation,
**And** runtime versions, verified commands, check results and packaging limitations are recorded.

**Given** this starter is delivered,
**When** its scope is inspected,
**Then** it introduces no future feature database tables or invented calendar/editor/recovery behavior,
**And** it makes no claim that Lexical, SQLite/native integration, the full installer matrix or the whole TECH-12 gate has been verified by this shell-only story.

**Requirements:** AD-1/3/11/18 (AR-01/03/11/18); NFR-1/7/9. This is the architecture-required starter story for Epic 1.

**Dependencies:** No earlier story. TECH-01's shared versioned contracts must be published before implementing IPC; candidate dependencies remain subject to TECH-12 verification before lockfile adoption. Record bootstrap compatibility evidence for the components actually exercised here. DEC-09/10 govern full installed-platform acceptance; this local packaged smoke check does not settle that matrix.

**Verification:** Development launch, local packaged launch, bounded readiness request/result validation, host-start failure reporting, renderer security configuration and inner-layer import checks. No timing budget is invented.

### Story 1.2: Create and reopen a universe in a chosen folder

As Jo,
I want to create a universe in a folder I choose and reopen an existing universe,
So that my shared writing setting has a persistent home independent of an installation or project.

**Acceptance Criteria:**

**Given** WritingTool is running and I choose to create a universe,
**When** I provide a universe name, select an available writable live folder and confirm creation,
**Then** the application creates the universe's own SQLite store and managed image-storage root using the shared storage contract,
**And** it assigns a permanent universe UUID, records its location separately and shows that universe as the active context,
**And** it creates only the metadata and storage needed by this story, without future character, calendar, project or event tables.

**Given** I create or edit the universe profile,
**When** I save its name and optional free-text description,
**Then** a name is required and an omitted description does not prevent saving,
**And** the profile is persisted in the universe’s ID-named JSON using the shared category-folder/catalog contract,
**And** its permanent UUID and separately stored base-folder identity remain stable.

**Given** a universe was successfully created,
**When** I close the application, reopen it and select that universe folder,
**Then** the same universe UUID, saved name and optional description are loaded through application use cases,
**And** opening it does not create a new universe or copy its live database into an application or project folder.

**Given** the selected folder already contains a universe or unrelated files,
**When** I attempt creation there,
**Then** the application does not overwrite existing content or silently replace a universe,
**And** it reports the situation so I can select an appropriate location or open an existing universe.

**Given** I cancel folder selection or creation,
**When** the action ends,
**Then** the active universe remains unchanged and no new universe is activated.

**Given** a selected universe is missing, invalid, unsupported or cannot be read or written as required,
**When** I attempt to open it or creation fails,
**Then** the application reports the failure without reporting success, silently creating replacement authority or rewriting an unsupported store,
**And** partial creation cannot subsequently be mistaken for a valid completed universe under the agreed storage-publication protocol,
**And** existing writing data remains unchanged.

**Given** another session already owns the writer lease for a universe,
**When** this session attempts to acquire write access to that same universe identity,
**Then** the agreed concurrent-open contract prevents a second independent writer,
**And** the application communicates the outcome without silently forking the universe.

**Given** a new universe has no calendar or content yet,
**When** its workspace is displayed,
**Then** it identifies the active universe and accurately shows the empty state,
**And** opening it requires no project, story, dates or later-epic functionality,
**And** it invents no calendar configuration or default fictional dates.

**Given** the entire universe data folder has moved and I locate it again,
**When** its owning UUID is validated and the relocation is saved,
**Then** only its separate base-folder location record is updated,
**And** all object locations resolve from that base plus their existing relative paths,
**And** no object IDs, object-path rows, relationships or JSON/WRT payload files need rewriting,
**And** other independently located project/universe roots remain unchanged.

**Requirements:** FR-44 foundation; AD-2/3/4/8/9/10/18 (AR-02/03/04/08/09/10/18); NFR-1/2/6/7/9; permanent UUID/location contract. Character/faction/event sharing under FR-44 is completed by the corresponding later stories.

**Dependencies:** Approved Story 1.1 only. TECH-01 must publish the shared identity/storage/transport contracts before their implementation; TECH-04 must settle writer ownership and concurrent-open behavior; TECH-11 must choose and verify the SQLite binding, engine and migration strategy; TECH-12 must verify affected native/background packaging before dependency adoption. The applicable TECH-02/05 publication and operation-recovery rules must cover failed/interrupted universe creation before it is accepted. These are unresolved technical prerequisites, not implicit decisions or completed work.

**Verification:** Create/save/reopen a universe with a name and optional description; confirm that missing names are rejected and omitted descriptions are accepted. Verify profile JSON/catalog consistency and unchanged UUID/base location on profile edits. Exercise cancellation, existing-content protection, missing/unsupported/unwritable stores, interrupted creation and duplicate-writer attempts using the agreed protocol. Verify SQLite/native loading in the local packaged build. Full backup recovery remains Epic 5; this story introduces neither backup archives nor project associations.

**Resolved product decision:** DEC-12 inventory is complete: required universe name, optional free-text description, existing calendar/timeline/character/faction capabilities and accepted faction extensions. No separate world/city profiles are added. Technical schemas/publication remain unresolved before implementation.

### Story 1.3: Create and reopen a project linked to a universe

As Jo,
I want to create a project in a chosen folder and link it to an existing universe,
So that my writing has its own storage while sharing the authoritative setting with other projects.

**Acceptance Criteria:**

**Given** an existing universe is available through Story 1.2,
**When** I select that universe, choose an available writable project folder and confirm creation,
**Then** WritingTool creates the project's own SQLite store and managed image-storage root with a permanent project UUID,
**And** the project records the owning universe UUID separately from its resolved folder location,
**And** live project/universe folders are user-selected independently of backup destinations,
**And** only the project metadata and associations required by this story are introduced; future story, volume, chapter and plot tables are not created prematurely.

**Given** a project was successfully created,
**When** I close and reopen WritingTool and select that project folder,
**Then** the saved project identity and universe association are preserved,
**And** the active workspace identifies the project and its matching authoritative universe,
**And** the application activates the project only after resolving that universe identity.

**Given** two projects refer to the same universe,
**When** either project is opened,
**Then** both resolve to the same authoritative universe UUID and store,
**And** neither creates a competing live project-local copy of universe data,
**And** selecting another project does not silently change either project's universe association.

**Given** a project's saved universe location is missing or has moved,
**When** I open the project and locate its universe folder,
**Then** WritingTool verifies the folder's universe UUID before activation,
**And** locating the same universe updates location resolution without changing project/universe identities,
**And** a folder containing a different universe does not silently reassign the project,
**And** cancellation or failure leaves that project inactive and preserves its saved association.

**Given** I cancel project creation, choose a destination containing existing content, or encounter a persistence failure,
**When** the create/open operation ends,
**Then** existing data is not overwritten and no incomplete project is reported as successfully created or activated,
**And** canceled creation leaves the previously active workspace unchanged,
**And** failures are reported according to the shared operation/error contract.

**Given** a project store is unsupported or another session owns the relevant writer lease,
**When** I attempt to open it for writing,
**Then** the shared schema/concurrent-open contract prevents unsupported rewriting or an independent second writer,
**And** the application does not silently create a replacement project or universe.

**Given** the entire project data folder has moved and I locate it again,
**When** its owning UUID is validated and the relocation is saved,
**Then** only its separate base-folder location record is updated,
**And** all object locations resolve from that base plus their existing relative paths,
**And** no object IDs, object-path rows, relationships or JSON/WRT payload files need rewriting,
**And** other independently located project/universe roots remain unchanged.

**Requirements:** FR-44 project/universe association foundation; AD-2/3/6/8/9/10/18; NFR-1/2/3/6/7/9; permanent UUID/location contract. Universe-owned character/faction/event context is added when those record types are implemented.

**Dependencies:** Approved Stories 1.1 and 1.2 only. Inherit the applicable TECH-01/02/04/05/11/12 prerequisites for identity, storage publication, operation recovery, writer coordination and native packaging. DEC-12 inventory is resolved; universe profile fields are delivered by Story 1.2. No project metadata fields beyond the agreed identity/association/storage needs are silently specified.

**Scope boundary:** Project creation and opening must work without future story/volume/calendar/manuscript features. Missing-universe backup recovery and full reconciliation are delivered in Epic 5; this story supplies matching-folder location and inactive-project protection and must not expose nonfunctional recovery actions.

**Verification:** Create/reopen a project; open two projects against one universe; locate a moved matching universe; reject a mismatched UUID; cancel creation/location; handle unavailable/unsupported/occupied stores and interrupted creation without overwriting or false activation. Follow the agreed writer and storage-publication protocols.

### Story 1.4: Create, name and manually order stories in a project

As Jo,
I want to create named stories within a project and arrange their order,
So that I can organize my writing without having to group stories into volumes.

**Acceptance Criteria:**

**Given** an active project with its matching universe available,
**When** I create a story and supply its title,
**Then** the story is saved in that project with a permanent UUID and appears in the project's story list,
**And** it can exist without a volume, chapter, plot entry or fictional date,
**And** the application creates only the story storage required for this capability.

**Given** the project contains named stories,
**When** I select a story or change its title,
**Then** the workspace identifies the selected story and its owning project,
**And** renaming preserves its UUID, project ownership and manually assigned order,
**And** neither selection nor renaming changes the project's universe association.

**Given** multiple ungrouped stories exist in the project,
**When** I manually reorder them,
**Then** the list reflects my chosen order and retains every story's identity and ownership,
**And** title or creation time does not override the saved manual order,
**And** this ordering is independent of the later chronological chapter and plot rules.

**Given** story titles and order were successfully saved,
**When** I close and reopen the project,
**Then** the same stories, titles, identities and manual order are restored from the project's store,
**And** selecting a story requires no later manuscript or volume-management feature.

**Given** an active project has no stories,
**When** I view its story list,
**Then** the application shows the empty state and allows creation without requiring a volume,
**And** it imposes no fixed story count, chapter count or word limit.

**Given** saving a new story, title change or order change fails,
**When** the operation reports its result,
**Then** it does not claim an unsaved change was persisted,
**And** previously committed stories, identity and ordering remain intact under the agreed operation/publication protocol,
**And** no changes are applied to a different project or its universe records.

**Requirements:** CAP-1; AD-6/8/10; shared identity and volume-grouping contracts; FR-44 ownership foundation; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.3 only. Inherit shared TECH-01/02/04/05/11 storage, identity, writer and failure-handling gates where applicable. Required story-list interactions must be captured under PLAN-04. Exact title validation or additional story-profile fields are not silently settled by this proposal.

**Scope boundary:** This story delivers usable ungrouped story organization. Optional volumes and moving stories between groups follow in a later story; current ungrouped stories must remain usable when that feature is introduced. Manuscript editing and chapter ordering arrive in Epic 2; plots arrive in Epic 4. Story deletion and cross-project movement are not introduced here.

**Verification:** Create multiple ungrouped stories, select/rename them, manually reorder and reopen; verify stable UUIDs/project ownership, empty-project behavior and failed-save integrity. Check the absence of fixed count/word caps without inventing a performance budget.

### Story 1.5: Organize stories into optional, manually ordered volumes

As Jo,
I want to group stories into optional volumes and arrange those groups and their stories,
So that the project structure follows my writing while still supporting ungrouped stories.

**Acceptance Criteria:**

**Given** an active project,
**When** I create a named volume or rename an existing volume,
**Then** it is saved as a project-owned group with a permanent UUID,
**And** renaming preserves its identity, project ownership and story memberships,
**And** an empty volume is usable without requiring a story or a nested-volume structure.

**Given** a story belongs to the active project,
**When** I assign it to a volume in that project,
**Then** it belongs to exactly that one volume,
**And** its story UUID and owning project/universe association remain unchanged,
**And** grouping does not duplicate the story or change ownership of its content.

**Given** a story is already in a volume,
**When** I move it to another volume or return it to the ungrouped list,
**Then** its previous membership is replaced by the chosen membership or no membership,
**And** the story remains available exactly once in its resulting group,
**And** no other story's membership is changed.

**Given** the project has volumes and grouped or ungrouped stories,
**When** I manually arrange volumes or the stories within a group,
**Then** the workspace reflects the chosen volume and story orders,
**And** ungrouped stories retain manual ordering,
**And** existing story order is preserved when optional volume support is introduced,
**And** ordering changes do not alter story ownership or its chapter/plot chronology rules.

**Given** volume names, memberships and manual orders were saved,
**When** I close and reopen the project,
**Then** all of those values and identities are preserved,
**And** projects without any volumes and stories without membership remain usable,
**And** no fixed volume count or stories-per-volume limit is imposed.

**Given** a proposed destination volume belongs to another project,
**When** an assignment is attempted through any application entry point,
**Then** the operation is rejected without changing membership or project/universe ownership.

**Given** a membership or ordering operation fails,
**When** the application reports the result,
**Then** the last committed grouping/order remains consistent under the agreed publication protocol,
**And** the story is not duplicated, lost or assigned to two volumes,
**And** the application does not report an unsaved change as successfully persisted.

**Requirements:** CAP-1; AD-6/8/10; shared volume-grouping and permanent-identity contracts; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.4 only. Inherit the applicable shared TECH-01/02/04/05/11 contracts and writer/storage-failure gates. Capture grouping and ordering interactions under PLAN-04 before implementation. Default insertion positions and exact name validation are not silently adopted here; manual order must be explicitly controllable.

**Scope boundary:** Volumes group stories only within their existing project. This story adds no nested volumes, simultaneous multi-volume membership, cross-project story transfer, deletion semantics or fixed writing limits. Chapter editing and plot sequencing remain later-epic capabilities and are not dependencies of this grouping workflow.

**Verification:** Create/rename volumes; assign, move and ungroup stories; order volumes and grouped/ungrouped stories; reopen; reject foreign-project destinations; verify prior ungrouped ordering survives introduction of volumes. Exercise failed membership/order publication without duplicate membership or loss.

### Story 1.6: Build and save a universe's repeating fictional calendar

As Jo,
I want to define my universe's year by its day count and year number, with optional months and standalone-day structure,
So that I can use a calendar suited to my setting before recording dated content.

**Acceptance Criteria:**

**Given** an available universe without dated content,
**When** I build its year using the ordered calendar builder,
**Then** I can configure months only, unequal-length months with standalone days, or a year expressed only in days,
**And** months are optional,
**And** standalone days can appear before, between or after months in the configured sequence,
**And** I can assign names to months and standalone days.

**Given** I want a days-only calendar,
**When** I supply the year number and the number of days in that year,
**Then** those values satisfy the minimum year structure without any months or explicit standalone-day components,
**And** year/element names and additional composition remain optional/configurable,
**And** the entered day count is the actual year length rather than an empty component list being treated as zero,
**And** no default 365-day year is invented.

**Given** calendar numeric values are entered,
**When** I save or validate them,
**Then** day count, configured month lengths and any supplied target are positive whole numbers, and the year number is a whole number,
**And** missing required values, fractions or nonnumeric values show a clear error without rounding or invented defaults,
**And** absent optional months/names are allowed,
**And** a valid composition/target-total mismatch remains saveable under FR-10,
**And** DEC-03 allows arbitrarily large signed whole year numbers without fixed bounds, rounding or artificial epoch remapping.

**Given** any negative, zero or positive whole year number is entered,
**When** I save or compare years,
**Then** negative, zero and positive year numbers are supported in continuous order … -2, -1, 0, 1, 2 …,
**And** year zero is not skipped and no era selector is required,
**And** entered year/day numbers are retained as-is rather than shifted to an artificial “year 0/day 1 = day 0” counter,
**And** arbitrarily large year values are saved, reopened and compared exactly without native integer/floating-point bounds,
**And** an optional year name does not replace the numeric ordering.

**Given** I have composed a valid year sequence and entered a target number of days,
**When** the builder compares the target with the sum of month lengths and standalone days,
**Then** it displays the target in green when equal and red when different,
**And** each standalone day counts toward the total.

**Given** the sequence contains 360 days and the target is 365,
**When** I save the valid calendar configuration,
**Then** the mismatch does not block saving,
**And** the persisted target becomes 360 to match the actual sequence total,
**And** the application does not silently add days or alter month lengths to meet the old target.

**Given** the calendar configuration is saved,
**When** its numbered years and dates are displayed or converted using the agreed chronology contract,
**Then** each year repeats the same ordered sequence and total length,
**And** a year name is optional and a year number alone remains usable,
**And** the established day-of-year and month/day/year format examples are preserved,
**And** there are no required leap-year or time-of-day fields.

**Given** the calendar belongs to a saved universe,
**When** I close and reopen that universe or open it through an associated project,
**Then** its sequence, month lengths, element names, actual/target year length and configured year names are preserved,
**And** all associated projects use that universe's same calendar authority.

**Given** I cancel editing or saving fails,
**When** the operation ends,
**Then** cancellation leaves the persisted configuration unchanged,
**And** a failure is reported without claiming the proposed calendar was saved,
**And** the prior committed configuration remains consistent under the shared publication protocol.

**Given** a year and its standalone day both have names,
**When** that standalone date is displayed,
**Then** its field order is `name-of-year/dayname-daynumber/yearnumber`, such as `Dragon/Festival-40/6976`,
**And** when the year has no name, the display is `dayname-daynumber/yearnumber`, such as `Festival-40/6976`, with no leading slash or placeholder,
**And** day number is the position within the whole year (e.g. `Festival-40` is its 40th day),
**And** an unnamed standalone day displays `Dragon/40/6976` for a named year or `40/6976` for an unnamed year, without empty name segments or an orphan hyphen,
**And** numeric year values are not offset, rounded or truncated.

**Requirements:** CAP-4; FR-8–13 and initial configuration support for FR-7; AD-3/6/8/10 and chronology convention; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.5 only; no future event or chapter story is required to build/use this calendar configuration. DEC-03 negative/zero/positive continuous year numbering and DEC-13 minimum/numeric validation are settled. DEC-03 rejects an artificial zero-based epoch and keeps supplied year/day numbers; the no-fixed-year-limit choice is also settled; publish the exact arbitrary-precision chronology/conversion schema under TECH-01 before affected implementation; DEC-04 standalone-day/daynumber/optional-year-name display is accepted. Inherit applicable TECH-01/02/04/05/11 storage/write gates; capture the builder interactions under PLAN-04. None of these unresolved details is decided by scope approval.

**Scope boundary:** This story builds and edits a calendar for a universe with no dated content. Reconfiguring a populated universe while preserving every elapsed position, ordering and interval under FR-7 will be a later Epic 1 story after standalone events are available. That later extension must use this same calendar contract and store, not a separate calendar implementation. This story creates no dated event/chapter tables solely for future features.

**Verification:** Save/reopen negative, zero and positive year numbers; check ordering across -1/0/1 and optional unnamed years, including very large values beyond fixed-width numeric limits, with no positive-year-only restriction or precision loss. Reject missing required/nonnumeric/fractional values, zero/negative day/month/supplied-target counts and preserve previous configuration on failure. Accept arbitrarily large signed integer year numbers exactly under DEC-03, optional empty names/month lists and valid target/total mismatch without silently rounding. Save/reopen a days-only calendar with only a year number and day count; verify no month/name/explicit standalone-day entries are required and empty optional components do not zero the year length. Configure optional components afterward using the shared composition contract. Exercise months-only, unequal-month/standalone-day and days-only configurations; standalone days before/between/after months; named and unnamed years; equal/mismatched target totals including 365/360; repeated-year conversion and reopen/shared-universe persistence. Verify canceled edits and failed publication. Empty/invalid sequence cases follow DEC-13 once resolved.

### Story 1.7: Record standalone events on the universe timeline

As Jo,
I want to record dated events directly in a universe and browse them chronologically,
So that I can establish its history without first creating stories or characters.

**Acceptance Criteria:**

**Given** an available universe with a configured calendar,
**When** I create an event with a heading and date, generating its required short name/code automatically,
**Then** it is saved as a universe-owned record with a permanent UUID,
**And** its short name/code is saved as a display field separate from its UUID and heading and may be edited later without changing identity/dates/relationships,
**And** its timeline mark displays that short label rather than its full heading,
**And** event defaults E001, E002, … expand beyond 999 and are unique against event/decision codes in the same universe,
**And** its description is optional,
**And** it needs no project, story, chapter, character, plot or decision link,
**And** no hours, minutes or seconds are required.

**Given** the universe has dated standalone events,
**When** I view its timeline,
**Then** the timeline identifies its owning universe and presents events in chronological elapsed-day order using that universe's calendar,
**And** the same-date group accepts events without requiring manual ordering,
**And** year names are optional and dates at month, standalone-day and year boundaries use the agreed chronology/display contracts.

**Given** a standalone event is saved,
**When** I edit its heading, optional description or date,
**Then** the same event UUID is retained and the timeline reflects the saved changes,
**And** changing the date places it last in the destination date group without creating a duplicate event, preserving the relative order of remaining events in both groups,
**And** unrelated event dates and content remain unchanged,
**And** editing without changing the date preserves the event’s existing position.

**Given** multiple projects refer to the same authoritative universe,
**When** its timeline is accessed through those projects or directly,
**Then** all views use the same universe-owned event records,
**And** selecting a different universe or its timeline synchronizes the owning context in both directions,
**And** events from another universe are not mixed into the selected timeline.

**Given** an event and its edits were successfully saved,
**When** I close and reopen its universe,
**Then** its identity, short name/code, heading, date, optional description and chronological placement are preserved,
**And** a universe with no events accurately shows an empty timeline.

**Given** I cancel event editing or an event write fails,
**When** the operation ends,
**Then** cancellation leaves the persisted event unchanged,
**And** failures are reported without claiming a successful save,
**And** the last committed timeline state remains consistent under the shared publication protocol.

**Given** an event code is generated or edited,
**When** the change is validated and saved,
**Then** the code is trimmed, nonblank and case-insensitively unique across event/decision records in the same universe,
**And** generated numbers follow creation order and advance past previously issued numbers and occupied codes,
**And** date/reordering changes leave the code stable; explicit code edits refresh live views without changing UUID/dates/links,
**And** invalid/duplicate input reports an error and preserves pending edits and committed data.

**Requirements:** CAP-3; FR-35, standalone-event application of FR-40 and timeline/event sharing under FR-44; optional-order entry support for FR-41. AD-3/6/8/10/18 and canonical event-ownership/chronology conventions; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Stories 1.1–1.6 only. Direct universe operation does not require a project, although project entry uses the already approved association workflow. Inherit applicable TECH-01/02/04/05/11 identity/storage/publication/writer gates and DEC-03/04 chronology/display contracts. Apply resolved DEC-38 short-label rules and include the required field in TECH-01 schemas. Capture timeline/event-entry interactions under PLAN-04. Date input must use the agreed bounds and conversion contract; no additional time precision is inferred.

**History integration:** Later revision/recovery stories preserve captured short codes; this story needs no revision UI or future history capability to save/display a live code.

**Scope boundary:** No event deletion, chapter association, character background, faction change, decision graph or plot feature is introduced here. Optional manual arrangement within a date follows in another Epic 1 story; saving events without that arrangement must already work here. Populated-calendar editing follows in its own Epic 1 story and must preserve these events' elapsed positions. Until that implementation exists, this story must not enable an unsafe calendar rewrite of dated content.

**Verification:** Verify trim/blank/case-duplicate rejection, occupied/issued-code skipping, growth beyond 999, creation-order allocation, date/reorder stability, edited-label live refresh, UUID/link preservation while preserving future historical-code integration under TECH-09; revision behavior is verified in Story 5.1, not a prerequisite here. Round-trip/display the required short name/code separately from UUID/full heading under approved DEC-38 rules. Create a standalone event with no project or description; edit its content/date without changing UUID; check chronological order, same-date creation, standalone-day/year-boundary dates and reopen persistence. Exercise shared-project access, switching universes, empty state, canceled edits and failed publication without cross-universe writes or duplicate records.

### Story 1.8: Manually arrange timeline events sharing a date

As Jo,
I want to optionally arrange events that happen on the same fictional date,
So that I can express their order without assigning times of day or changing chronology.

**Acceptance Criteria:**

**Given** a universe timeline contains multiple events on the same date,
**When** I manually arrange those events,
**Then** the timeline shows the chosen order within that date,
**And** every event keeps its UUID, date, content and owning universe,
**And** no time-of-day value is introduced or required.

**Given** the timeline contains events on different dates,
**When** I arrange events within one date,
**Then** dates remain in chronological order,
**And** other dates' event order is unchanged,
**And** a reordering action cannot move an event into a different date or universe.

**Given** I create or save an event without choosing a manual order,
**When** it appears on the timeline,
**Then** saving succeeds without manual arrangement,
**And** events remain discoverable within their correct date group,
**And** a new event is placed last within its date group, and a redated event last in its destination group,
**And** the other events retain their existing relative/manual order in both affected groups,
**And** editing an event without changing its date preserves its existing position (resolved DEC-14).

**Given** a same-date order was saved,
**When** I close and reopen the universe or access it through another associated project,
**Then** the saved order is preserved in the same authoritative universe,
**And** it is not replaced by a project-specific copy or by sorting event headings.

**Given** the selected date contains zero events or one event,
**When** I view that date,
**Then** the timeline remains usable without requiring an ordering action.

**Given** I cancel arrangement or its save fails,
**When** the operation ends,
**Then** cancellation leaves the saved order unchanged,
**And** failures are reported without claiming persistence,
**And** the prior committed order and event records remain consistent under the shared publication protocol.

**Requirements:** FR-41; FR-40 date-only chronology and FR-44 authoritative universe context; AD-3/8/10/18; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.7 only. Apply resolved DEC-14 new/redated destination-group-last placement and same-date edit position preservation; these are explicitly accepted timeline rules. Capture the ordering interaction under PLAN-04. Inherit the existing TECH-01/02/04/05/11 storage, identity, publication and writer contracts.

**Scope boundary:** Apply ordering to the standalone events available now, using a shared timeline contract that later character/background/decision event types can also use. Those future record types are not prerequisites. This story introduces no clock times, cross-date manual ordering, event deletion, plot-order changes or calendar reconfiguration.

**Verification:** Save without manual order; reorder several same-date events; reopen and view through another project sharing that universe; verify unchanged dates/content/UUIDs and unaffected neighboring groups. Check empty/single-event groups, invalid cross-date/universe reorder requests and canceled/failed writes. Verify creation into an ordered group appends last, redating appends last in the destination while preserving other events’ relative order in both groups, and same-date content edits retain position; verify these outcomes after reopen.

### Story 1.9: Revise a populated calendar without changing elapsed chronology

As Jo,
I want to change my universe's calendar after recording events,
So that I can refine how dates are expressed while preserving when events happen and the time between them.

**Acceptance Criteria:**

**Given** a universe calendar already has dated timeline events,
**When** I change its valid ordered sequence, month lengths or total year length and save,
**Then** the existing dated content does not prevent calendar editing,
**And** every existing event retains its elapsed universe-time position,
**And** displayed dates are recalculated using the revised calendar,
**And** event UUIDs, headings, descriptions and owning universe remain unchanged.

**Given** events span month, standalone-day and year boundaries,
**When** the calendar changes between months-only, mixed-month/standalone-day or days-only configurations,
**Then** chronological order and the elapsed-day interval between every pair of events remain unchanged,
**And** no event is silently dropped or shifted to keep its old displayed date,
**And** conversion follows the agreed epoch/year-bound contract rather than an invented migration offset.

**Given** multiple events share an elapsed date and have a saved manual order,
**When** their dates are redisplayed under the revised calendar,
**Then** they continue to share the same chronological position and retain their manual within-date order,
**And** no time-of-day values are introduced.

**Given** a valid edited sequence totals 360 days while its entered target remains 365,
**When** I save the populated calendar,
**Then** the target is corrected to 360 and saving is permitted under FR-10,
**And** elapsed positions, intervals and order are preserved just as for a matching target,
**And** optional year names and named calendar elements use the agreed display rules.

**Given** multiple projects share the universe,
**When** the calendar change is committed and the timeline is queried through each project,
**Then** all views use the same authoritative calendar and show its recalculated dates,
**And** closing/reopening preserves that calendar and the same elapsed chronology,
**And** other universes are unchanged.

**Given** I cancel the edit or publication fails or is interrupted,
**When** the operation ends or the application restarts,
**Then** cancellation preserves the prior committed calendar and timeline,
**And** the agreed publication/recovery protocol prevents a mixed or partially published calendar state,
**And** the application does not report an incomplete calendar change as successful or lose existing dated content.

**Requirements:** CAP-4; FR-7 with continued FR-8–13/40/41/44 behavior; AD-3/6/8/10/18 and the common fictional-chronology convention; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.8 only. Resolve DEC-03/04/13 chronology, display and calendar-validation contracts before implementation. Use TECH-01's common chronology contract and TECH-02/04/05's consistent publication, writer serialization and operation-recovery guarantees; inherit relevant TECH-11 persistence verification. Capture populated-calendar editing interactions under PLAN-04.

**Scope boundary:** Extend the existing calendar and event model rather than introducing another source of chronology. Standalone events provide the current integration evidence. Later chapter, background, birth, faction, decision and plot stories must use this same calendar contract and add acceptance checks that their elapsed positions/intervals also survive calendar changes. They are not prerequisites for implementing or accepting this story's current standalone-event workflow. Real elapsed revision/backup age remains independent of fictional calendar changes.

**Verification:** Compare all saved event positions and pairwise elapsed intervals before/after calendar edits, including events at year/month/standalone-day boundaries and manually ordered same-date groups. Exercise all three calendar forms, changed year lengths, target mismatches, optional year names, shared-project views and reopening. Verify canceled edits, publication failure and restart recovery under the agreed protocol without changing unrelated universe data.

### Epic 1 planning completion and coverage

All nine stories are approved. Each story depends only on earlier stories and the explicitly tracked shared technical/product gates. The independent universe workflow is available without projects; project associations, stories and volumes build on that foundation. Calendar configuration precedes dated events, same-date ordering and populated-calendar changes. No application implementation or integration verification is claimed.

| Epic 1 primary requirement | Approved story coverage |
| --- | --- |
| FR-7 — Change populated calendars while preserving elapsed chronology | 1.6 initial configuration; 1.9 populated editing and preservation |
| FR-8 — Months, mixed months/standalone days or days-only years | 1.6; 1.9 reconfiguration |
| FR-9 — Ordered linear calendar builder | 1.6; 1.9 continued editing |
| FR-10 — Target comparison and mismatch-save correction | 1.6; 1.9 populated mismatch example |
| FR-11 — Named months and standalone days | 1.6; 1.9 preservation |
| FR-12 — Optional year names | 1.6; 1.9 continued display |
| FR-13 — Repeating year sequence without leap rules | 1.6; 1.9 revised configuration |
| FR-35 — Standalone universe events | 1.7 |
| FR-40 — Date-only positions | 1.6–1.9 for currently implemented record types; later typed-event stories must apply the same rule |
| FR-41 — Optional manual same-date order | 1.7 saving without arrangement; 1.8 manual arrangement; 1.9 calendar-change preservation |
| FR-44 — Shared universe context and synchronized timeline ownership | 1.2/1.3 authoritative universe and project association; 1.7 synchronized timeline context; 1.9 shared calendar. Character/faction and established-decision integrations remain explicit later-epic obligations |

The architecture-required starter is Story 1.1. Optional project story/volume organization is covered by Stories 1.4/1.5 and the CAP-1 grouping contract. All 11 primary FR identifiers are mapped; cross-feature obligations above remain required for complete first-release acceptance.

**Open implementation gates:** DEC-03/04/12/13/14 and the applicable TECH-01/02/04/05/11/12 items remain unresolved where noted; approval does not choose their answers or mark them done. PLAN-04 still governs required UX interactions. Installed-platform/performance/release verification remains tracked in TODO.md. Other technical gates apply when their affected future feature is introduced.

**Epic transition:** Jo confirmed proceeding to Epic 2, Write and save manuscripts in the workspace. Step 3 remains in progress until all six epics have approved stories.

## Epic 2: Write and save manuscripts in the workspace

Jo can write formatted chapters within organized stories, set independent optional start/end dates, save/reopen work with autosave, choose appearance and import/export application settings.

**Story planning status:** All seven Epic 2 stories (2.1–2.7) approved by Jo. Jo confirmed proceeding to Epic 3 story planning. Approval records scope and acceptance criteria, not implementation completion.

### Story 2.1: Create and organize undated chapters within a story

As Jo,
I want to create named chapters and select them within a story before assigning dates,
So that I can outline the manuscript as the structure becomes clear.

**Acceptance Criteria:**

**Given** an active project and an existing story,
**When** I create a chapter with a title,
**Then** it is saved as a chapter owned by that story with a permanent UUID,
**And** neither a start date nor an end date is required or invented,
**And** creation requires no manuscript text, character/event association, plot entry or word target,
**And** only the chapter storage required for this capability is introduced.

**Given** the story contains chapters without start dates,
**When** I view the chapter list,
**Then** those chapters appear in creation order,
**And** I can select a chapter and identify its owning story/project,
**And** the list introduces neither arbitrary fictional dates nor a manual order that contradicts FR-42.

**Given** a chapter exists,
**When** I change its title,
**Then** its UUID, story ownership and creation-order position are preserved,
**And** its dates remain absent unless explicitly assigned through the later date-editing capability.

**Given** chapter titles and identities were saved,
**When** I close and reopen the project and story,
**Then** the same chapters, titles and creation order are restored,
**And** an empty story remains usable and can accept its first chapter,
**And** the application imposes no fixed chapter count or word limit.

**Given** a story has chapters,
**When** I rename that story or move it between volumes and ungrouped using the existing organization workflow,
**Then** the chapters remain attached to the same story UUID,
**And** neither grouping nor renaming duplicates chapters or changes their owning project/universe association.

**Given** chapter creation or title persistence fails,
**When** the operation reports its result,
**Then** it does not claim the change was saved,
**And** the previously committed chapter list, identities, titles and ownership remain consistent under the shared publication protocol,
**And** no chapter is silently written to a different story or project.

**Requirements:** FR-42 undated creation/ordering foundation; CAP-2 and AD-3/6/8/10/13/18; NFR-1/2/3/6/7/9. Full dated ordering and independent date editing follow within Epic 2.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 only. Inherit applicable TECH-01/02/04/05/11 contracts for chapter identity, storage publication, operation recovery and writer coordination. Any initialized empty manuscript must follow TECH-01's versioned WritingTool document contract rather than a new local format; the editing adapter is not a prerequisite for outlining. Capture chapter-list interactions under PLAN-04.

**Scope boundary:** This story delivers usable chapter outlining/selection and title persistence. Formatted text editing, manual manuscript save, dates, autosave, themes and settings round-trip will be subsequent Epic 2 stories. Later dates must extend this chapter identity/ownership model and retain FR-42's missing-start creation order. Chapter deletion, manual chapter reordering and cross-story transfer are not introduced here. Title-input validation remains a detail to settle before implementing that input; no additional chapter-profile fields are adopted.

**Verification:** Create multiple chapters without dates or text, select/rename them and reopen. Check creation-order stability, empty-story behavior, story rename/volume regrouping with existing chapters and failed-write integrity, including wrong-owner requests. No timing budget or enforced writing cap is invented.

### Story 2.2: Write, format and save chapter manuscripts

As Jo,
I want to write and format chapter text and save it within the application,
So that my manuscript and its presentation survive reopening.

**Acceptance Criteria:**

**Given** a chapter exists in the active story,
**When** I select it and write or edit its manuscript,
**Then** the React/Lexical editor supports bold, italics, paragraph indentation, headings and scene breaks,
**And** a new chapter can begin with an empty manuscript,
**And** editing requires no fictional dates, character associations or word target.

**Given** I have edited a chapter manuscript,
**When** I explicitly save it,
**Then** the Lexical adapter maps writing to plain-text `<chapter-id>.wrt` and chapter details plus bold/italic/indent/heading/scene-break metadata to companion `<chapter-id>.json` under the shared versioned application contract,
**And** application use cases coordinate those files with the ID/location/relationship database catalog through the background host,
**And** domain/application contracts do not depend on Lexical runtime objects,
**And** no direct renderer SQL or arbitrary filesystem access is introduced.

**Given** a chapter’s plain-text WRT and companion JSON formatting form one saved manuscript version,
**When** I save, reopen, capture a revision, restore, back up or export that chapter,
**Then** the text and formatting metadata correspond to the same chapter ID and saved version,
**And** durable acknowledgment covers the required text/JSON/catalog publication rather than just one successfully written file,
**And** editing text updates its corresponding formatting under the shared adapter/schema contract,
**And** missing or mismatched components are reported without silently applying another version’s formatting or losing writing.

**Given** a save request is in progress,
**When** the background host acknowledges durable persistence,
**Then** the application identifies the acknowledged manuscript state as saved,
**And** edits made after the submitted state are not falsely reported as persisted by that acknowledgment.

**Given** a chapter with mixed text and all five required formatting features was saved,
**When** I close and reopen the project and select that chapter,
**Then** its text, bold, italics, paragraph indents, headings and scene breaks are preserved,
**And** its UUID, owning story, title and dates are unchanged,
**And** other chapters' manuscripts remain unchanged.

**Given** manuscript persistence fails,
**When** the failure is reported,
**Then** the application does not claim the unsaved manuscript is saved,
**And** the last committed document remains valid under the shared publication protocol,
**And** current unsaved edits remain available for retry under the agreed editor-state contract.

**Given** a saved document has an unsupported future schema version or cannot be validated,
**When** it is opened through the editor adapter,
**Then** the application reports that it cannot safely load it for editing,
**And** it does not silently rewrite, downgrade or overwrite the saved content.

**Given** unsaved manuscript edits exist,
**When** I switch chapters/projects, navigate away or normally close the application,
**Then** the application automatically saves pending writing and matching JSON metadata before navigation,
**And** navigation proceeds only after durable acknowledgment of the required saved version,
**And** if saving fails it shows an unsaved-writing warning, retains the pending edits in the current editor and offers retry or cancel navigation,
**And** normal close synchronizes pending manuscript edits and obtains durable acknowledgment according to TECH-03/05 before reporting completion,
**And** the implementation does not assume future autosave or revision history will protect unpersisted edits.

**Requirements:** FR-1; CAP-2; AD-3/10/11/12/13/14/18; NFR-1/2/3/6/7/9. This story delivers manual manuscript persistence; FR-43 autosave follows within Epic 2.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Story 2.1 only. TECH-01 must define the manuscript schema, adapter mapping, validation and version-handling contract before document persistence. TECH-03/05 must settle pending-edit acknowledgments, navigation/close coordination and failures; TECH-12 must verify Lexical integration and round-trip behavior before candidate pins are adopted. Inherit applicable TECH-02/04/11 storage-publication, writer and SQLite contracts. DEC-15 is resolved: save automatically before navigation; warn and retain edits with retry/cancel on failure. Capture those editor interactions under PLAN-04 before implementation.

**Scope boundary:** No autosave scheduler, revision history, restore, manuscript export, additional formatting feature or enforced writing limit is introduced here. Later autosave/revision/backup/export stories consume the same document and durable-save contracts rather than inventing a second persisted representation. An editor's undo stack does not substitute for Epic 5 revisions.

**Verification:** Switch chapters/projects and open the event editor with pending writing newer than the periodic autosave; verify successful automatic matched-file save before navigation. Fail that save and verify a warning, retained visible edits, retry/cancel behavior and no false saved state or changed scheduling intervals. Inspect the plain-text WRT and companion chapter JSON; verify all five rich-format features after edits/reopen and matched-version revision/restore/backup/export. Exercise mismatch/missing-component and interrupted paired-save cases under the shared protocol without false success or source loss. Round-trip representative documents with each formatting feature and mixed combinations through Lexical, plain-text WRT/companion JSON and the database catalog; verify empty and multiple chapters and wrong-owner save rejection. Exercise failed saves with retry, edits during an outstanding save, unsupported schema protection and the agreed navigation/normal-close paths. Verify the adapter in the packaged application; performance budgets remain DEC-11.

### Story 2.3: Set independent chapter dates and view chapters chronologically

As Jo,
I want to set or clear a chapter's start and end dates independently,
So that I can place my writing in the universe chronology without inventing dates or automatically changing its range.

**Acceptance Criteria:**

**Given** a chapter exists and its universe has a configured calendar,
**When** I set, edit or clear its start or end date,
**Then** either date can remain absent and both can be absent,
**And** each entered date uses the owning universe's date-only calendar,
**And** assigning, moving or clearing one date never automatically changes the other,
**And** editing both uses the explicitly entered values, subject to DEC-01: if both dates exist and end is earlier than start, set end equal to start.

**Given** a chapter has a start and end date,
**When** I move its start date,
**Then** the end remains at its existing elapsed position unless explicitly edited or the resulting pair is inverted, in which case DEC-01 sets end equal to start,
**And** chapter UUID, title, manuscript and story ownership are unchanged,
**And** neither the old chapter duration nor the old end-date offset is automatically preserved by shifting the end.

**Given** both chapter dates are present,
**When** a date edit would save an end earlier than the start,
**Then** end is automatically set equal to start before commit,
**And** start remains the reference when both dates are entered together,
**And** start day 20/end day 10 saves as start day 20/end day 20,
**And** an already equal/valid range or absent date is not changed by this correction,
**And** linked event dates/content and manuscript writing remain unchanged.

**Given** a story has chapters with and without start dates,
**When** the chapter list is displayed after a saved date change,
**Then** chapters without starts appear first in creation order,
**And** chapters with starts follow in chronological start-date order,
**And** an end date alone never substitutes for a missing start in sorting,
**And** chapters sharing a start date retain their saved creation order within that date under DEC-16, without borrowing manual plot/event ordering rules.

**Given** chapter dates were saved,
**When** I close and reopen its project,
**Then** both dates, including either absent value, are preserved,
**And** chapter ordering is recalculated from those saved values using the same rules,
**And** the chapter manuscript and formatting remain intact.

**Given** one or more projects contain dated chapters and share a universe with timeline events,
**When** that universe's populated calendar is revised through Story 1.9,
**Then** each chapter start and end retains its elapsed position and only its displayed calendar date changes,
**And** chapter chronological order, elapsed start/end intervals and universe-event positions remain unchanged,
**And** the shared publication/chronology contract keeps all associated project views consistent.

**Given** I cancel date edits, a value fails the agreed validation or date persistence fails,
**When** the operation ends,
**Then** cancellation preserves previously committed dates,
**And** invalid syntax/calendar bounds are reported through common validation; a valid but inverted date pair uses the accepted DEC-01 end-equals-start correction,
**And** persistence failure is reported without claiming success or corrupting the saved chapter,
**And** pending manuscript edits remain protected by the existing editor-state contract.

**Requirements:** FR-42; independent chapter-field behavior under FR-5 and contracts.md; continued FR-7 preservation for newly introduced chapter dates; CAP-2/3/4; AD-3/6/8/10/13/18 and AD-16 as superseded by independent date fields; NFR-1/2/3/6/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.2 only. DEC-01 is resolved (inverted pair sets end equal to start); DEC-16 is resolved (same-start chapters use saved creation order). Use DEC-03/04's chronology bounds/display contract, TECH-01's common date representation and TECH-02/04/05's coordinated publication/writer/recovery guarantees, including cross-store consistency where needed. Inherit TECH-11 persistence and DEC-15 pending-editor-state protections. Capture date-entry/list interactions under PLAN-04.

**Scope boundary:** No timeline zoom, chapter/event association, event-editor navigation or restoration UI is introduced here. Those later workflows must use these same independent date fields. Changing a chapter's dates never changes any linked or unrelated universe events; FR-5 requires a chapter-view link to the dedicated event editor for explicit event changes. No automatic end shift is reintroduced.

**Verification:** Exercise end before start from start-only/end-only edits, first assignment and simultaneous date entry; verify end equals start, equal/valid ranges remain unchanged, absent dates stay absent and events/manuscript are unchanged. Reopen the corrected dates and test cancellation/failed saves. Exercise neither/start-only/end-only/both dates; first assignment, moving, clearing and editing both; missing-start creation order and dated chronology; reopen without manuscript-format loss. Test month/standalone-day/year boundaries and calendar reconfiguration with chapters across shared-universe projects. Verify tied-start chapters keep creation order after redating, renaming and reopen, alongside accepted DEC-01 equalization; verify cancellation, failed writes and unchanged event records.

### Story 2.4: Automatically save current work at a configurable interval

As Jo,
I want current work to save automatically at an interval I can configure,
So that ongoing writing is persisted without relying only on manual saves.

**Acceptance Criteria:**

**Given** autosave has not been customized,
**When** the application runs with pending current-work edits,
**Then** autosave defaults to a 5-minute interval,
**And** an autosave attempt persists pending work through the same application use cases and durable-save contract as manual saving,
**And** pending manuscript text and formatting are included rather than merely saving an older editor state.

**Given** I choose an accepted autosave interval in application settings,
**When** the value is successfully saved,
**Then** the autosave timer restarts using the durably saved configured interval,
**And** opening a project starts its autosave timer with that setting,
**And** closing/reopening preserves that configuration,
**And** changing autosave does not change the separately configured revision or backup intervals.

**Given** an autosave attempt has been submitted and further manuscript edits occur,
**When** durable persistence of the submitted state is acknowledged,
**Then** only the acknowledged state is identified as saved,
**And** subsequent edits remain pending until their own persistence is acknowledged,
**And** scheduled and manual saves follow the shared writer protocol so an older submitted state cannot overwrite a newer committed manuscript.

**Given** an autosave attempt fails,
**When** the application receives the failure,
**Then** it reports that current work has not been successfully saved,
**And** unsaved edits remain available for retry while the last committed content stays valid,
**And** a clear warning identifies that saving failed, the next configured interval retries pending changes and Retry now is available,
**And** retries use the same non-overlapping versioned save contract without false success.

**Given** the system sleeps/resumes, interval settings change, or a scheduled attempt overlaps another save,
**When** autosave scheduling resumes or another attempt becomes due,
**Then** an overdue resume runs one save for pending changes rather than replaying missed intervals,
**And** changing the interval restarts its timer, while the shared serialization contract prevents overlapping saves,
**And** navigation-triggered saves remain immediate under DEC-15,
**And** it cannot create conflicting writers or falsely acknowledge pending edits as persisted.

**Given** autosave has successfully persisted current work,
**When** I close/reopen the project,
**Then** the saved manuscript text, formatting and associated current-work changes covered by the shared save contract are preserved,
**And** normal-close pending-edit protection continues to work independently of waiting for the next autosave interval.

**Given** a proposed interval is invalid under the accepted settings rules,
**When** I attempt to save it,
**Then** DEC-07 validation reports the problem and preserves the previously committed interval,
**And** no unconfirmed zero-value, disable, minimum or maximum policy is inferred.

**Requirements:** FR-43; CAP-12; AD-3/13/14/18 and save/settings convention; NFR-1/2/3/6/7/9. Future FR-28/29 settings round-trip must include this exact autosave setting.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.3 only. DEC-17 timing/retry semantics are settled above; resolve DEC-07 interval validation before affected implementation; DEC-15 continues to govern pending-edit navigation. Use TECH-01's document/settings/transport contracts, TECH-03's pending-edit acknowledgments and TECH-02/04/05's publication/writer/lifecycle/recovery guarantees. Inherit relevant TECH-11/12 persistence/editor integration checks. Capture the interval control and save-status interactions under PLAN-04.

**Scope boundary:** Autosave saves current work; it does not create recoverable historical revisions or backup ZIPs. Those services retain independent 10-minute defaults and are delivered in Epic 5. This story provides its own usable autosave interval control and persistence; it does not depend on future general-settings or JSON import/export stories. Those later stories must reuse its settings contract rather than add a separate autosave value.

**Verification:** Use controlled time to verify the 5-minute default and an accepted changed interval without waiting in real time; verify configuration reopening and saved-document round-trip. Exercise edits during save, overlapping manual/scheduled attempts, failures with retry and normal-close pending edits. Verify timer start on project open, restart on interval change, one overdue save after sleep, non-overlap and warning/retained edits with next-interval and Retry-now paths; verify invalid settings once DEC-07 is settled. Changing autosave must leave revision/backup configuration unchanged.

### Story 2.5: Choose light, dark or system application appearance

As Jo,
I want to choose light, dark or system appearance,
So that the writing workspace uses my preferred theme or follows my operating system.

**Acceptance Criteria:**

**Given** the application workspace is open,
**When** I choose light or dark appearance,
**Then** the application applies that explicit theme to the workspace and its existing editor/timeline/settings surfaces,
**And** operating-system theme changes do not override an explicitly selected light or dark mode.

**Given** I choose system appearance,
**When** the operating system indicates light or dark appearance,
**Then** the application follows that appearance,
**And** later operating-system theme changes are reflected while the application remains open,
**And** the stored selection remains system rather than being replaced with the currently resolved light/dark value.

**Given** the chosen theme mode was successfully saved,
**When** I close and reopen the application,
**Then** that same selected mode is restored,
**And** system mode resolves using the operating system's current appearance,
**And** theme persistence uses the existing shared application-settings contract.

**Given** a manuscript has saved formatting and may also have pending edits,
**When** I change the application theme,
**Then** chapter text, semantic formatting, identity, dates and ownership are unchanged,
**And** pending edits remain available under the editor-state contract,
**And** changing appearance does not rewrite the manuscript document or alter save/revision/backup intervals.

**Given** theme preference persistence fails,
**When** the failure is reported,
**Then** the application does not claim that preference was durably saved,
**And** previously committed settings and writing content remain intact,
**And** reopening uses the last successfully committed selection.

**Requirements:** FR-30 appearance behavior and persistence; CAP-12; AD-3/11/18 and settings convention; NFR-1/2/3/7/9. FR-28/29 import/export will round-trip this selected mode in a later Epic 2 story.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.4 only. Use the shared TECH-01 settings/transport contract and existing settings-persistence/failure guarantees; retain DEC-15 pending-edit protections. PLAN-04 must capture the appearance control and required light/dark visual treatment before implementation. This proposal does not select colors, typography, UI libraries, accessibility thresholds or a first-install default theme. Full installed-platform verification remains DEC-09/10 and VERIFY-09.

**Scope boundary:** This story delivers a usable appearance setting with persistence without depending on future settings import/export. The later JSON settings story must reuse the same mode field and preserve system as a choice. Native OS-controlled dialogs follow platform capabilities; no unsupported native styling promise is introduced.

**Verification:** Select each mode; reopen; change mocked/real operating-system appearance while system mode is active and while explicit light/dark is active. Verify saved system selection versus resolved appearance, representative editor/timeline/settings surfaces, pending edits and failed preference persistence. Confirm writing content and unrelated settings are unchanged. Record platform-specific evidence rather than assuming all targets were exercised.

### Story 2.6: Configure independent saving and recovery settings

As Jo,
I want to configure save intervals, backup destination and retention,
So that WritingTool preserves my preferences without coupling separate save and recovery operations.

**Acceptance Criteria:**

**Given** save/recovery settings have not been customized,
**When** I view them,
**Then** autosave defaults to 5 minutes, revision snapshots to 10 minutes and scheduled backups to 10 minutes,
**And** retention defaults to 30 real elapsed days,
**And** these values use the shared settings contract rather than separate copies owned by each screen.

**Given** I change an accepted interval or retention value,
**When** I save settings,
**Then** the selected value is persisted independently,
**And** changing autosave, revision or backup interval does not change either other interval,
**And** retention is time-only and does not introduce a storage-size threshold or fixed minimum revision count.

**Given** I select a backup destination folder, including an available external-drive folder,
**When** that preference is successfully saved,
**Then** the selected location is retained as the configured backup destination,
**And** live project/universe folders and identities are unchanged,
**And** canceling the settings folder picker preserves the previously saved destination without initiating a backup attempt.

**Given** autosave and theme were already configured through Stories 2.4 and 2.5,
**When** I view or update those preferences in the settings workspace,
**Then** it uses those same persisted settings and existing behaviors,
**And** accepted autosave changes take effect according to DEC-17,
**And** the chosen light/dark/system mode is preserved rather than replaced with its resolved appearance.

**Given** accepted settings were successfully saved,
**When** I close and reopen WritingTool,
**Then** the three intervals, retention, selected backup destination and theme mode are preserved,
**And** changing preferences does not rewrite manuscript content or universe chronology.

**Given** a proposed value is invalid or settings persistence fails,
**When** I attempt to save,
**Then** intervals must be positive whole minutes and retention positive whole days under resolved DEC-07; zero does not disable a feature,
**And** the application reports invalid input or failed persistence accurately,
**And** previously committed settings and writing content remain consistent under the shared publication protocol.

**Given** the configured backup folder is unavailable,
**When** settings are saved,
**Then** unavailability alone does not invalidate or erase the configured destination,
**And** actual backup attempts follow the approved prompt/retry/fallback rules.

**Requirements:** CAP-12; FR-28/29 settings-content foundation, FR-43 configuration and continued FR-30 behavior; FR-18/19/24/25 configuration foundation; AD-3/9/15/18 and save/settings convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.5 only. Apply resolved DEC-07 settings validation; reuse DEC-17 autosave cadence and existing TECH-01 settings/transport contracts. Inherit applicable TECH-02/04/05 persistence/publication/writer/lifecycle guarantees, DEC-15 pending-editor protections and PLAN-04 settings interactions. The user-selected backup destination's default is not invented by this proposal.

**Scope boundary:** This story provides usable settings persistence and existing autosave/theme integration. Revision capture, backup scheduling, destination-failure prompts, close fallback, retention cleanup and protected-archive enforcement are delivered in Epic 5 using these configured values; changing settings here does not claim those operations have run. JSON settings export/import is the next separate capability, using this same settings representation. A 30-day retention value never overrides the ten protected valid successful ZIPs or retained/current-reference protections in the later cleanup implementation.

**Verification:** Check default and customized values; change each interval independently and reopen. Exercise folder selection/cancellation, external-drive destination persistence, unchanged live roots and reuse of autosave/theme settings. Verify rejection of zero, negative, fractional and other invalid values with clear field feedback and committed settings retained, failed persistence and unchanged manuscript/universe content. No archive deletion or scheduled-backup completion is claimed by configuration checks.

### Story 2.7: Export and import application settings as JSON

As Jo,
I want to export my settings to a JSON file and import them again,
So that I can preserve and restore my application preferences.

**Acceptance Criteria:**

**Given** application settings are available,
**When** I export them to a selected file location,
**Then** WritingTool writes a valid .json file whose top-level value is a JSON object,
**And** it includes the configured autosave interval, revision interval, backup schedule/interval, backup destination, retention and light/dark/system theme selection,
**And** the exported values come from the same persisted settings contract used by the application controls.

**Given** I export customized accepted settings and then change the application preferences,
**When** I import the exported file,
**Then** every exported setting is restored to its exported value,
**And** closing/reopening preserves the restored settings,
**And** the three save/revision/backup intervals remain independently configured.

**Given** a settings file contains an accepted theme selection,
**When** I import it,
**Then** the application applies that selection through Story 2.5's theme behavior,
**And** an imported system mode remains system and follows current/later OS appearance changes rather than being replaced with the exporting machine's resolved light/dark appearance.

**Given** an accepted import changes the autosave interval,
**When** it is committed,
**Then** the existing scheduler uses the imported value under DEC-17's agreed timing policy,
**And** no duplicate autosave setting or scheduler is introduced,
**And** pending manuscript edits remain protected by the existing durable-save/editor-state contracts.

**Given** a valid exported file includes a backup destination,
**When** it is imported,
**Then** the configured destination value is restored without relocating live project/universe folders,
**And** importing settings does not itself create a backup, perform cleanup or claim a destination is currently available,
**And** backup-attempt destination failures follow the required Epic 5 workflow when those operations are implemented.

**Given** I cancel file selection, select malformed JSON or a non-object value, submit invalid settings under DEC-07, or encounter a read/persistence failure,
**When** the operation ends,
**Then** cancellation leaves settings unchanged,
**And** errors are reported without claiming successful import,
**And** previously committed settings and writing content are preserved without a partially applied import,
**And** missing fields retain their current values, unknown fields are ignored with a warning, and any invalid known field rejects the entire import before applying any value.

**Given** a settings export cannot be written completely,
**When** the file operation reports its result,
**Then** the application does not report successful export,
**And** the source settings and manuscript/universe data remain unchanged,
**And** file publication follows the shared safe-write contract.

**Requirements:** FR-28/29; full FR-30 and FR-43 settings round-trip integration; CAP-12; AD-3/15/18 and settings convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.6 only. Publish the shared settings JSON serialization/validation contract under TECH-01; apply resolved DEC-07 missing/unknown/invalid-field behavior, with exact schema compatibility defined under TECH-01. Use existing TECH-02/04/05 settings publication/writer/lifecycle guarantees, DEC-17 scheduler behavior and DEC-15 pending-editor protections. Capture file-selection, result and error interactions under PLAN-04. This proposal does not require a new version field or pick field names/units independently of the shared schema.

**Scope boundary:** The artifact contains application settings, not manuscript content, database exports or recovery ZIPs. Existing local revision/backup preferences can be round-tripped before Epic 5 services exist; the later services must consume those same settings. No settings import can bypass protected-archive/dependency rules or trigger an unrequested data relocation.

**Verification:** Export default and customized settings, parse the top-level object, change each setting, import and compare every exported value after reopening. Cover all three theme modes and independent interval values; verify autosave adopts an accepted imported interval. Exercise file-picker cancellation, malformed JSON, arrays/scalars, invalid values and read/write/commit failures with no partial settings application. Check missing fields retain current values, unknown fields produce a warning without being applied, and a valid field alongside an invalid known field leaves all settings unchanged. Check zero/negative/fractional interval and retention rejection, plus valid positive whole values and unavailable destination acceptance; verify exact schema compatibility under TECH-01. Confirm manuscript/universe data and live roots are unchanged.

### Epic 2 planning completion and coverage

All seven stories are approved. They progress from undated chapter outlining through formatted manuscript editing, independent dates, autosave, appearance, settings configuration and JSON round-trip. Each story uses only earlier approved story capabilities plus explicitly tracked shared product/technical gates. No implementation, runtime integration or platform test completion is claimed.

| Epic 2 primary requirement | Approved story coverage |
| --- | --- |
| FR-1 — Manuscript formatting persists after save/reopen | 2.2; 2.4 autosave preserves the same document and formatting |
| FR-28 — Export settings as a JSON object in a .json file | 2.6 shared settings content; 2.7 complete export |
| FR-29 — Import exported settings and restore every value | 2.7, including intervals, destination, retention and theme |
| FR-30 — Light/dark/system theme and settings round-trip | 2.5 theme selection/OS-following/persistence; 2.7 import/export |
| FR-42 — Optional chapter dates and start-date ordering | 2.1 undated creation/creation-order foundation; 2.3 independent dates, missing-start-first ordering and end-only behavior |
| FR-43 — Configurable 5-minute-default current-work autosave | 2.4 scheduler/configuration/persistence; 2.6 independent shared settings; 2.7 imported interval application and round-trip |

All six Epic 2 primary FR identifiers are mapped. Story 2.3 extends FR-7 calendar-change preservation to chapter dates and retains FR-5's independent fields with no event mutation; chapter-view event-editor navigation is Epic 3 work, and separate item/project recovery remains Epic 5 work. Chapter-character associations and targets under FR-47 and timeline zoom/context under FR-45 remain assigned to Epic 3. Revision/backup/cleanup preferences in 2.6/2.7 do not claim delivery of those Epic 5 services. Manuscript and database export remain Epic 6 work.

**Open implementation gates:** DEC-01/07/15/16/17 product rules are resolved by the later accepted amendments for date correction, settings/import validation, pending-edit navigation, chapter ties and autosave scheduling; shared implementation contracts remain open. Inherit DEC-03/04 chronology/display and the applicable TECH-01–05/11/12 contracts/proofs as stated in the stories. PLAN-04 still governs required chapter/editor/settings/appearance interactions; the theme proposal does not choose visual tokens or a first-install default. Scope approval does not close these TODO items or count as implementation acceptance.

**Epic transition:** Jo confirmed proceeding to Epic 3, Develop characters and factions alongside chapter chronology. Step 3 remains in progress until all six epics have approved stories.

## Epic 3: Develop characters and factions alongside chapter chronology

Jo can develop and find characters/factions, maintain dated affiliations on character sheets and background events on the timeline, associate characters with chapters, see chapter targets/context and plan from either a chapter or the timeline while controlling which main events move.

**Story planning status:** All fourteen Epic 3 stories (3.1–3.14) approved by Jo. Awaiting confirmation to begin Epic 4 story planning. Approval records scope and acceptance criteria, not implementation completion.

### Story 3.1: Create and filter universe characters by type

As Jo,
I want to create named characters and classify/filter them as main, major, minor or extras,
So that I can find the relevant cast while keeping every character accessible.

**Acceptance Criteria:**

**Given** an available universe,
**When** I create a named character and classify it as main, major, minor or extras,
**Then** it is saved as a universe-owned record with a permanent UUID and owning-universe identity,
**And** creation requires no project, story, chapter, fictional date, faction or development response,
**And** only the character fields/storage needed by this story are introduced.

**Given** I am recording an extra,
**When** I supply only the character's name as profile content,
**Then** the character can be saved and reopened without filling any further development fields,
**And** a missing name cannot be accepted as a valid named character for any type.

**Given** the universe contains characters of different types,
**When** I apply a type filter,
**Then** the list shows characters of the selected type,
**And** clearing/changing the filter makes the other saved characters accessible again,
**And** filtering does not delete, reclassify or change any character record.

**Given** a character exists,
**When** I select it, change its name or change its type,
**Then** I can inspect the saved name/type and save the accepted changes,
**And** its UUID and owning universe remain unchanged,
**And** the record appears under its resulting type filter after saving,
**And** reclassification does not discard existing saved content or require a duplicate character.

**Given** multiple projects use the same authoritative universe,
**When** I access its character list through those projects or directly,
**Then** they resolve the same character records and saved edits,
**And** selecting another universe shows only that universe's characters,
**And** no live project-local character copy is created.

**Given** character names/types were successfully saved,
**When** I close and reopen the universe,
**Then** names, classifications, identities and ownership are preserved,
**And** a universe with no characters shows an accurate empty state and supports creating its first character.

**Given** I cancel an edit or persistence fails,
**When** the operation ends,
**Then** cancellation leaves the saved character unchanged,
**And** a failed save is not reported as successful,
**And** the last committed record remains consistent without writing into a different universe.

**Requirements:** FR-15; FR-16 required-name foundation; character-sharing extension of FR-44; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.7 only. Use shared TECH-01 identity/transport/storage contracts and applicable TECH-02/04/05/11 publication, writer, recovery and SQLite guarantees. Capture basic character-list/create/filter interactions under PLAN-04. No text-search feature, automatic default type, unique-name restriction or additional profile field is silently selected by this proposal.

**Scope boundary:** This story provides a usable basic character directory without depending on later guided development, personality catalog, images, birth records, background events, faction membership or chapter associations. Expected fields do not block saving, and a name-only main/major/minor record must not be claimed to have completed later guided development. Subsequent stories extend these same records with all agreed fields and completeness/waiver behavior; fuller optional development remains available to extras. Character deletion is not introduced here and must satisfy TECH-08 before future implementation.

**Verification:** Create all four types, including a name-only extra; reject a missing name; select/rename/reclassify/filter characters and reopen. Confirm filtering preserves all records, reclassification preserves UUID/content, projects share one universe's records and other universes remain isolated. Exercise empty state, canceled edits, failed writes and wrong-universe requests.

### Story 3.2: Develop character profiles with guided prompts and explicit waivers

As Jo,
I want guided character-development fields with clear incomplete and waived states,
So that I can build characters gradually without being forced to answer every prompt before saving.

**Acceptance Criteria:**

**Given** a character exists in the selected universe,
**When** I open its development profile,
**Then** I can record rank/title (title for civilians), background, description, motivation, weaknesses, strengths and specialities alongside its existing name/type,
**And** the creator presents the exact seven rank/title, background, description, motivation, weaknesses, strengths and specialities prompts in the resolved DEC-05 contract,
**And** these fields extend the same universe-owned character UUID rather than a separate creator record.

**Given** a character is main, major, minor or extras,
**When** development completeness is evaluated,
**Then** name remains required for every type,
**And** rank/title and description are expected for main, major and minor, and optional for extras,
**And** background is expected for main characters unless explicitly waived, and optional otherwise,
**And** motivation, weaknesses, strengths and specialities are optional for every type.

**Given** an expected development prompt has no answer,
**When** I save the named character,
**Then** the unanswered expected prompt is marked incomplete without blocking the save,
**And** I can explicitly waive it as unimportant,
**And** completeness distinguishes answered, incomplete and waived expected prompts,
**And** a waiver satisfies that development-completeness expectation without inventing an answer,
**And** required name validation cannot be bypassed by a development waiver.

**Given** a prompt is outside the character type's expected set,
**When** it remains unanswered,
**Then** no individual waiver is required and it does not make the character incomplete,
**And** fuller optional development remains available for every type,
**And** an extra can remain a name-only profile.

**Given** development responses and explicit waivers were saved,
**When** I close/reopen the universe and inspect the character,
**Then** responses and recorded waiver/completeness states are preserved according to the shared contract,
**And** the viewer exposes saved background, description, optional specialities and the other textual profile fields,
**And** it provides the agreed image placeholder when no image is available.

**Given** a character's type changes or an existing answer is cleared,
**When** the profile is reevaluated,
**Then** completeness uses the new type's expected-field matrix,
**And** existing profile content is not discarded simply because its field becomes optional,
**And** existing explicit waivers are preserved across type changes,
**And** a newly expected unanswered field is incomplete unless already explicitly waived,
**And** answering a waived field clears its waiver and makes it answered,
**And** clearing an answer leaves an expected field incomplete until explicitly waived again,
**And** optional fields do not affect completeness, and name cannot be waived.

**Given** multiple projects use this universe,
**When** character development is viewed through those projects or directly,
**Then** all access the same authoritative responses and completeness states,
**And** another universe's characters remain separate.

**Given** I cancel edits or profile persistence fails,
**When** the operation ends,
**Then** cancellation preserves the saved profile,
**And** a failed write is reported without claiming the responses/waivers were saved,
**And** the last committed profile and its identity remain consistent under the shared publication protocol.

**Accepted prompt wording — DEC-05 resolved:**

Use these exact prompts for the existing character-development fields:

| Field | Prompt |
| --- | --- |
| Rank/title | What rank or title does this character hold? |
| Background | What experiences shaped this character? |
| Description | How would you describe this character? |
| Motivation | What does this character want, and why? |
| Weaknesses | What weaknesses or limitations affect this character? |
| Strengths | What strengths help this character? |
| Specialities | What skills or areas of expertise distinguish this character? |

**Requirements:** FR-16 textual field matrix and completeness; FR-48 guided prompts, expected states and textual viewer; continued FR-15 extras behavior and FR-44 sharing; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Story 3.1 only. Apply resolved DEC-05 exact prompt wording and accepted waiver transitions. Use TECH-01's character/profile/state contracts and the applicable TECH-02/04/05/11 publication, writer, recovery and persistence guarantees. Capture creator/viewer and completeness interactions under PLAN-04. No additional expected prompt is invented by this proposal.

**Scope boundary:** This story provides usable textual character development and its viewer. Personality selection, managed image import/display, birth/background timeline events and faction affiliation are subsequent Epic 3 stories, using these same character records. Until those features exist, the viewer must not invent personality/faction values or require those future services to save a profile. Their eventual integration is still required to satisfy the complete FR-48 viewer contract. Character deletion and revision restoration remain outside this story.

**Verification:** Exercise every character type against the field matrix, expected unanswered saves, explicit waivers, answered states and optional unanswered prompts without waivers. Reopen and compare responses/states; verify name-only extras, required names, type changes and shared-universe access. Verify answering clears a waiver, clearing an answer makes an expected field incomplete, explicit re-waiving satisfies that expectation, and type changes preserve answers/explicit waivers while newly expected unanswered unwaived fields become incomplete. Verify optional fields do not affect completeness and name cannot be waived. Compare each displayed prompt with the exact accepted DEC-05 wording, preserving the existing expected/optional field matrix. Verify image-placeholder behavior, cancellation and failed writes without lost prior profile content.

### Story 3.3: Select and view multiple character personality labels

As Jo,
I want to choose optional personality labels for a character from the supplied catalog,
So that I can record the combination that fits the character and see it in the profile.

**Acceptance Criteria:**

**Given** I open the personality selector for a universe character,
**When** the available options are displayed,
**Then** all 100 exact labels from the adopted Personality Types List are selectable,
**And** options show the source labels only, without their accompanying descriptions,
**And** the application does not substitute another personality catalog or silently rename the supplied labels.

**Given** a character of any supported type,
**When** I choose no label, one label or multiple distinct labels and save,
**Then** that exact selection is persisted on the same universe-owned character,
**And** each label appears at most once in the selection,
**And** personality remains optional and requires no completeness waiver when unselected,
**And** extras retain the ability to have only a name.

**Given** a character has saved personality selections,
**When** I add or remove selections, including removing the last one,
**Then** the resulting selection can be saved and viewed,
**And** the character UUID, name, type, other responses and development waivers are unchanged,
**And** the application does not assign replacement labels automatically.

**Given** personality selections were successfully saved,
**When** I close/reopen the universe and inspect the character viewer,
**Then** the same exact selected labels are displayed,
**And** selecting no labels remains a valid empty selection,
**And** projects sharing this universe view the same authoritative character selection,
**And** another universe's characters are unaffected.

**Given** I change a character's type using the existing character workflow,
**When** I reopen its personality field,
**Then** the saved selections remain available,
**And** no character type makes this optional field mandatory or restricts it to a single choice.

**Given** I cancel a selection edit or its save fails,
**When** the operation ends,
**Then** cancellation preserves the previously saved selection,
**And** a failed save is reported without claiming the new set was persisted,
**And** the prior committed character remains consistent under the shared publication protocol.

**Requirements:** FR-17; FR-16 optional personality field; FR-48 viewer integration; FR-44 authoritative character sharing; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Catalog source:** [Personality Types List](../prds/prd-WritingTool-2026-10-10/sources/personality-types-list.md). Labels are the contract; source descriptions remain reference material rather than selector content.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.2 only. TECH-01 must specify the common persisted catalog-selection representation before implementation, without exposing a separate adapter-specific format. Inherit applicable TECH-02/04/05/11 writer, publication, recovery and storage guarantees. Capture multiselect/viewer interactions under PLAN-04. No catalog-editing, custom-label, search, display-order or extra scoring feature is silently adopted here.

**Scope boundary:** Extend the existing character profile and viewer. This story does not depend on image import, faction assignment, birth/background events or chapter associations. All agreed later viewer fields remain required in their respective stories. Optional personality labels do not replace guided development responses or change character-type completeness rules.

**Verification:** Compare the implemented catalog label-for-label with all 100 source entries and verify descriptions are absent from selector options. Round-trip zero/one/multiple selections; remove the last label; reopen; reclassify; view through projects sharing a universe. Verify unchanged other profile fields/waivers, canceled edits and failed writes without partial selection persistence.

### Story 3.4: Add and view optional character images

As Jo,
I want to attach an image to a character and view it in the profile,
So that I can keep a visual reference alongside the character's recorded details.

**Acceptance Criteria:**

**Given** a character exists in an available universe,
**When** I select a supported local image and save it as the character's image,
**Then** WritingTool validates that the content is a readable PNG, JPEG or WebP rather than trusting its extension, and keeps an unchanged copy in that universe’s managed image storage,
**And** the character references its managed asset relative to the owning universe root,
**And** SQLite stores the asset reference rather than image bytes or a dependency on the original import path,
**And** the viewer fits the image within its display area while preserving proportions, without cropping or stretching (resolved DEC-18).

**Given** the image import was successfully committed,
**When** I move or remove the original source file and reopen the character,
**Then** its image still displays from managed storage,
**And** projects sharing the universe use the same authoritative character/image reference,
**And** moving the universe folder and resolving its unchanged identity preserves the relative asset reference.

**Given** a character has a saved image,
**When** I replace it with another supported image or clear its image selection,
**Then** the character viewer shows the new image or the agreed no-image placeholder,
**And** the character UUID, other profile content, personality selection and waivers remain unchanged,
**And** previously saved assets are not mutated in place or deleted while any current/retained references require them.

**Given** a character of any type has no image,
**When** I save or view it,
**Then** the image placeholder is shown and saving is permitted,
**And** an absent image does not make the character incomplete or require a waiver,
**And** an extra can still be a name-only profile.

**Given** I cancel import, choose invalid/unsupported content or encounter a copy/reference-publication failure,
**When** the operation ends,
**Then** cancellation preserves the saved image selection,
**And** validation failures or persistence errors are reported without claiming success,
**And** the shared asset-publication/recovery protocol preserves the prior valid character/reference state without a dangling committed reference,
**And** the source file and unrelated managed assets are unchanged.

**Given** imported content or an asset reference attempts to escape its permitted managed root or owning universe,
**When** it passes through the import/transport adapters,
**Then** the shared validation contract rejects that access,
**And** no generic renderer filesystem access or imported-content privilege is introduced.

**Requirements:** FR-16 optional image support; FR-48 character viewer; FR-44 shared universe context; CAP-5; AD-3/4/8/9/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.3 only. Apply resolved DEC-18 PNG/JPEG/WebP readable-content validation, unchanged managed copying and aspect-preserving fit without cropping/stretching. TECH-01 must define the shared asset-reference contract, TECH-02/04/05 must cover coordinated asset publication/writer/restart recovery, and TECH-09's immutable image-version/object-identity rules must be settled before replacement or removal is implemented. Inherit TECH-11 persistence verification and capture image selection/placeholder/display interactions under PLAN-04.

**Scope boundary:** Deliver character image import/display using the existing universe profile. This does not require future faction profiles or Epic 5 revision/backup UI; those later features must reuse the managed-asset contracts and carry required image versions/reference closure. Clearing a character's current image reference does not authorize immediate file deletion. No image transformation, gallery or additional image field is selected by this proposal.

**Verification:** Import each of PNG, JPEG and WebP; reject unsupported/unreadable content even with a supported extension, retaining the previous image. Compare managed bytes to source and verify wide/tall images fit without cropping or stretching; reopen; remove/move its source; view through shared-universe projects; relocate the owning universe using identity resolution. Replace/clear the image and check unchanged profile/personality/waiver data and referenced immutable assets. Verify no-image completeness for every type, cancellation, invalid files, asset-copy/reference-write failures and rejected foreign-root/universe references using the agreed contracts.

### Story 3.5: Record character birth years on the universe timeline

As Jo,
I want a character's entered birth year to appear on the universe timeline,
So that its place in the setting's history stays linked to the character.

**Acceptance Criteria:**

**Given** a character exists in a universe with a configured calendar,
**When** I enter and save an accepted birth year,
**Then** the application creates a birth record in that universe linked to the same character identity,
**And** the birth is placed on day 1 of the entered year,
**And** no month, day-of-month, hour, minute or second input is required for a year-only birth,
**And** inferred day-1 placement is distinguished from an explicitly recorded birth month/day,
**And** a character can still be saved without a birth year.

**Given** the configured year begins with a standalone day,
**When** I save a character's year-only birth,
**Then** its timeline record is placed on that first standalone day,
**And** the application does not substitute the first day of the first month.

**Given** a character already has a linked birth record,
**When** I save a changed birth year,
**Then** any recorded birth month or day is preserved when valid in the new year,
**And** if the recorded month/day does not exist in that year, the year change succeeds and the birth moves to the first month/day of that year, using its actual day 1 including a leading standalone day or a days-only calendar,
**And** a year-only birth without recorded month/day also uses the day-1 placement convention,
**And** its event UUID and character/universe association remain unchanged,
**And** repeated saving does not create duplicate birth records,
**And** unrelated character fields and events are unchanged.

**Given** a character has a linked birth event,
**When** I clear its birth year,
**Then** affected current links must be resolved before committing the clearing operation,
**And** successful clearing removes the event from the active timeline and clears the character’s current birth association,
**And** retained history and its dependencies remain preserved,
**And** publication failures do not leave dangling references or a partially cleared character/event state.

**Given** the birth record has been committed,
**When** I view the character and its owning-universe timeline, including through associated projects,
**Then** both use the same linked birth information,
**And** the record appears at its chronological position and participates in the common optional same-date ordering contract,
**And** year-only day-1 placement is not presented as evidence that the precise historical birth day is known.

**Given** dated birth records exist,
**When** the universe calendar is reconfigured through Story 1.9,
**Then** their elapsed positions, chronological ordering and intervals are preserved while displayed dates are recalculated,
**And** an existing birth is not automatically shifted back to day 1 of a newly calculated year,
**And** the profile displays the year containing the preserved birth position, without moving the event back to day 1,
**And** directly editing the linked birth event’s date updates the character’s displayed birth year from the same canonical date (resolved DEC-19).

**Given** a character birth year and linked record were saved,
**When** I close and reopen the universe,
**Then** their association and saved information remain intact,
**And** characters without birth information remain valid without invented dates.

**Given** I cancel editing, enter a year outside the accepted calendar bounds or a coordinated save fails,
**When** the operation ends,
**Then** cancellation preserves the saved character/birth record,
**And** invalid years and persistence failures are reported without claiming success,
**And** the shared publication/recovery protocol prevents a partially applied character field or orphaned/duplicate birth event.

**Requirements:** FR-14; birth-event application of FR-40/41/44 and FR-7 chronology preservation; CAP-3/5; AD-3/6/8/10/18 and canonical timeline ownership; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.4 only. Use DEC-03/04's year-bounds/chronology/display contracts and DEC-14's event insertion/date-transition ordering. Apply accepted DEC-19 recorded month/day preservation when valid and first-month/day-of-target-year fallback when unavailable. Apply accepted DEC-19 birth clearing with affected-link resolution before commit and retained-history protection. Apply resolved DEC-19 direct-edit synchronization and preserved-position post-calendar year display; TECH-01 must represent supplied precision separately from inferred day-1 placement. Use TECH-01's common character/event/reference schema and TECH-02/04/05/11 publication, writer, operation-recovery and persistence guarantees. TECH-08 applies before any removal affecting shared references/history. Capture character birth entry and timeline presentation under PLAN-04.

**Scope boundary:** This story supports year-only births and preserves any recorded birth month/day when the year changes. It adds no precise-birthdate requirement, age calculation, death record, independent duplicate birth event, chapter relationship or new character completeness requirement. Generic character background events follow as a separate capability using the same timeline infrastructure. DEC-19 clearing is accepted: active removal and association clearing after affected-link resolution, with retained history protected. Direct birth-event date edits synchronize the displayed birth year, and calendar reconfiguration displays the year of the preserved birth position without moving the event to day 1 (DEC-19 resolved).

**Verification:** Save year-only births in months-only, mixed and days-only calendars, including a year starting with a standalone day. Change a year-only birth year using day-1 placement, and change a birth year with explicitly recorded month/day while preserving valid components. Exercise a target year lacking that month/day and verify successful fallback to the year’s first month/day (including leading standalone-day and days-only calendars), unchanged event UUID and no duplicate; distinguish inferred day 1 from recorded precision. Repeat saves without duplicate records; reopen and view through shared-universe projects. Reconfigure the populated calendar and compare elapsed positions/intervals; retain optional same-date order. Exercise no birth year, invalid year bounds, canceled changes and failed coordinated saves. Verify clearing with no affected links removes the active birth and association, and clearing with affected links cannot commit until resolution. Verify retained history remains available, cancellation preserves prior state and publication failure cannot partially clear the character/event. Edit the linked birth date directly and confirm the character year synchronizes without duplicate events. Reconfigure the calendar so the displayed birth year changes and verify the profile reflects that year while the event’s elapsed position remains unchanged, including a birth no longer on day 1. Reopen and verify consistent profile/timeline display.

### Story 3.6: Record character background events on the shared timeline

As Jo,
I want to record dated events as part of a character's background,
So that the character's history and universe chronology refer to the same information.

**Acceptance Criteria:**

**Given** a character exists in an available universe with a configured calendar,
**When** I create a background event with a heading and date,
**Then** it is saved as a canonical universe event linked to that character,
**And** its description is optional,
**And** no project, story, chapter, plot or established decision is required,
**And** no hours, minutes or seconds are required.

**Given** the background event was successfully saved,
**When** I inspect the character's background or its owning-universe timeline,
**Then** both views resolve the same event UUID and character/universe reference,
**And** the timeline shows it at its recorded chronological position,
**And** displaying the event in both places does not create a copied event record.

**Given** a background event is accessible through the character or timeline view,
**When** I save changes to its heading, date or optional description through either entry point,
**Then** both views reflect the same committed changes,
**And** the event UUID and character/universe association are preserved,
**And** changing its date updates chronological placement without duplicating it,
**And** unrelated events and profile responses remain unchanged.

**Given** background events share a date with other timeline events,
**When** I save them without manual ordering or arrange that date through Story 1.8,
**Then** saving requires no ordering action,
**And** optional arrangement uses the same canonical date-group order,
**And** no date is changed to express within-day order,
**And** creation/date-transition placement follows DEC-14.

**Given** a universe with background events is reconfigured through Story 1.9,
**When** its calendar changes,
**Then** those events retain their elapsed positions, chronological order and elapsed intervals,
**And** only displayed dates are recalculated under the revised calendar.

**Given** background events were saved,
**When** I reopen the universe or access it through an associated project,
**Then** their headings, dates, descriptions, identities and character associations are preserved,
**And** other universes' characters/events remain separate,
**And** a character with no background events remains saveable.

**Given** structured background events and guided development coexist,
**When** character completeness is evaluated,
**Then** a narrative background answer or at least one linked background event satisfies the expected background field,
**And** an explicit background waiver also satisfies that expectation,
**And** without any qualifying answer/event or explicit waiver, the expected field is incomplete,
**And** removing the last qualifying answer/event makes it incomplete unless explicitly waived, while any remaining answer or qualifying event continues to satisfy it,
**And** this feature does not silently invent additional required prompts or automatic waivers,
**And** unanswered expected background information still does not block a named character's save.

**Given** I cancel editing or event/link publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved event and association,
**And** failures are reported without claiming success,
**And** the agreed publication/recovery protocol prevents a dangling link or partially updated event,
**And** a cross-universe character reference is rejected without changing existing records.

**Requirements:** FR-39; FR-40/41/44 background-event integration; FR-7 calendar preservation; related FR-16/48 background presentation; CAP-3/5; AD-3/6/8/10/18 and canonical event-ownership convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.5 only. Use DEC-03/04's shared chronology/display contract and DEC-14's event-placement rules. Apply resolved DEC-20 alternative narrative/event/explicit-waiver background completeness, using the existing type-specific expected-field matrix. Reuse TECH-01's event/character/reference schemas and applicable TECH-02/04/05/11 publication, writer, recovery and storage guarantees. Capture the background/event-entry interactions under PLAN-04. TECH-08 remains a gate before future shared-record deletion or unlinking semantics.

**Scope boundary:** Extend the existing universe event model and character background view. This story does not create an independent project-local history, require a project, introduce multi-character association rules, decide event deletion/unlinking, or add faction/chapter/decision relationships. Later chapter depiction and decision-result workflows must link the same canonical events rather than copy background content.

**Verification:** Create a background event with no description or project, verify the same UUID through character/timeline views, edit from both entry points and reopen through shared-universe projects. Verify same-date behavior, changed dates and populated-calendar conversion without elapsed-position changes. Exercise no events, foreign-universe links, canceled edits and failed event/link publication. Verify a main character’s narrative-only background, event-only background and explicit waiver each satisfy the expectation. Check no answer/event/waiver is incomplete yet saveable; removing the last qualifying answer/event makes it incomplete unless explicitly waived, while a remaining answer/event still satisfies it. Verify background remains optional for other types and completeness does not mutate canonical events.

### Story 3.7: Record faction profiles and track completeness

As Jo,
I want to record faction profiles and save unfinished drafts,
So that I can develop the setting's organizations gradually and see which profile information remains incomplete.

**Acceptance Criteria:**

**Given** an available universe,
**When** I create or edit a faction profile,
**Then** the profile is a universe-owned record with a permanent UUID,
**And** it supports faction name, description and identifier image/pictogram,
**And** it supports government type and notes,
**And** it supports leader image, name, age, public reputation and narrative profile, plus military head and intelligence head,
**And** it supports strategic overview, strengths and weaknesses.
**And** it supports population size, resources and culture notes,
**And** it supports a list of worlds or cities where applicable, without requiring a separate world/city record system.

**Given** population size, resources, culture notes or worlds/cities are being entered,
**When** I save the faction profile,
**Then** population accepts an exact count, estimate, range or “unknown” without requiring numeric-only input,
**And** resources and culture notes preserve free text,
**And** worlds/cities preserve an optional list of names and notes without requiring separate location records,
**And** all these added fields may be blank without making the profile incomplete.

**Given** some original non-roster completeness information is unanswered,
**When** I save the draft,
**Then** incomplete profile information does not block saving,
**And** the profile remains identifiable and reopenable as an incomplete draft,
**And** the application does not fill missing fields with Fero-Kia example values or invent additional required fields.

**Given** faction profile completeness is evaluated,
**When** the original non-roster completeness fields are filled,
**Then** the faction is complete without requiring any military roster entry,
**And** unanswered original completeness fields leave it incomplete while still saveable; the added population/resources/culture/world-city fields are optional and blank values do not make the profile incomplete,
**And** character-specific optional-image or prompt-waiver rules are not automatically applied to faction completeness.

**Given** I select a readable PNG, JPEG or WebP identifier or leader image,
**When** the image/reference update is committed,
**Then** the existing managed-asset service validates readable content rather than extension alone and copies it unchanged into the owning universe’s storage,
**And** the profile stores a relative asset reference rather than bytes or the original import path,
**And** reopening or removing the source file does not remove the managed image,
**And** images fit their display areas without cropping/stretching, preserving proportions under resolved DEC-18,
**And** replacing/clearing an image preserves protected immutable assets and updates profile completeness without blocking draft saving.

**Given** narrative faction information includes organization, technology, resources, doctrine, intelligence, troop numbers or allies,
**When** I record it in the relevant existing narrative fields,
**Then** the content is preserved without requiring separate mandatory structured fields for every topic,
**And** the source example does not impose fixed names, images, numeric values, layout, relationship tracking or combat mechanics.

**Given** a faction profile and any images were successfully saved,
**When** I reopen the universe or inspect its factions through an associated project,
**Then** the same profile identity, field values, images and completeness state are available,
**And** other universes' profiles remain separate,
**And** creating/viewing a faction requires no character membership or military roster feature.

**Given** I cancel profile edits, an image fails validation or publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved profile,
**And** failures are reported without claiming success,
**And** the shared publication/recovery contract preserves consistent profile and image references without changing unrelated records.

**Requirements:** FR-36 non-roster profile fields, draft saving and completeness; FR-44 faction sharing; CAP-6; AD-3/4/6/8/9/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Apply resolved DEC-37: population accepts exact counts, estimates, ranges or unknown; resources/culture are free text, worlds/cities an optional names-and-notes list, and these added fields do not determine completeness; DEC-12 universe inventory is resolved. Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.6 only. Reuse Story 3.4's asset contracts/service under DEC-18 and TECH-09; do not copy its character-specific optional-field completeness rule. Use TECH-01's common faction/asset/state schema and the applicable TECH-02/04/05/11 writer, publication, operation-recovery and persistence guarantees. Capture faction form, draft/completeness and image interactions under PLAN-04. Exact field validation follows the shared contract rather than inferred example defaults.

**Scope boundary:** Deliver complete non-roster faction development using the source field matrix. Optional repeating military units follow in a separate story, without being a dependency of saving or completing this profile. Character membership/history follows afterward and must reference this same faction UUID. Faction deletion, hypothetical relationships, combat simulation and additional mandatory profile fields are not introduced here.

**Verification:** Save/edit/reopen population size, resource information, culture notes and a worlds/cities list; exercise exact/estimated/ranged/unknown population, free-text resources/culture, optional names-and-notes worlds/cities and blank added fields without inventing location records. Confirm blank added fields do not affect completeness. Verify faction JSON and its catalog identity/location preserve the extended profile. Exercise every non-roster field, partially filled draft saving/reopening and complete profile saving with no roster. Remove one completeness field and confirm an incomplete draft still saves. Import/replace/clear both image roles under the managed-asset contract; remove source files and reopen. Verify shared-project access, universe isolation, narrative preservation, cancellation and failed profile/asset publication.

### Story 3.8: Record optional military unit types in faction profiles

As Jo,
I want an optional repeating military roster within a faction profile,
So that I can record the faction's unit types and their descriptive values when useful to my setting.

**Acceptance Criteria:**

**Given** a faction profile exists,
**When** I add unit-type entries to its military roster,
**Then** it supports multiple entries containing unit name, role, description, base strength, movement points and base modifier points,
**And** each entry is associated with the same faction and owning universe under the shared identity contract,
**And** no example name, prose or numeric value is inserted as an assumed default.

**Given** a faction has no military roster,
**When** I save or inspect its profile,
**Then** the faction remains saveable,
**And** completeness follows Story 3.7’s original non-roster field rules, excluding its accepted optional added fields,
**And** no unit entry is required to mark a fully filled non-roster profile complete.

**Given** existing roster entries are available,
**When** I edit an entry or remove it from the current roster,
**Then** the saved roster reflects that change without altering other entries or faction fields,
**And** the faction UUID and owning universe remain unchanged,
**And** removal respects the shared retained-reference/history contract rather than deleting protected historical content.

**Given** unit values are entered or an entry is partially filled,
**When** the application validates it,
**Then** partially filled entries can be saved and entirely blank rows are ignored,
**And** unit name, role and description preserve free text,
**And** strength and movement accept non-negative numbers including decimals,
**And** modifier points accept positive, zero or negative numbers including decimals,
**And** blank numeric fields remain unset and invalid supplied values produce a field error without being committed as valid numbers,
**And** the application does not infer numeric limits, zero defaults or mandatory row completeness from the supplied example,
**And** roster content does not redefine faction-profile completeness.

**Given** the roster was successfully saved,
**When** I close/reopen the universe or view the faction through another associated project,
**Then** every saved entry and field value is preserved on the same authoritative faction,
**And** no project-local roster copy is created,
**And** another universe's factions/rosters remain unaffected.

**Given** I cancel roster edits or persistence fails,
**When** the operation ends,
**Then** cancellation preserves the saved roster,
**And** failure is reported without claiming success,
**And** the shared publication/recovery protocol preserves the previously committed entries and faction profile without partial row updates.

**Requirements:** FR-36 optional repeating military roster; FR-44 faction sharing; CAP-6; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.7 only. Apply resolved DEC-21 partial-entry/free-text/numeric-validation rules. Reuse TECH-01's faction/unit/reference schemas and applicable TECH-02/04/05/11 publication, writer, recovery and storage guarantees. Resolve TECH-08's reference/history preservation before implementing removal; deleting a current entry must not undermine retained revisions. Capture roster entry/edit/removal interactions under PLAN-04.

**Scope boundary:** These are optional recorded unit-type fields, not combat simulation, movement calculation, troop counting, individual military-character membership or new mandatory faction fields. No custom roster ordering, cross-faction unit sharing or extra statistics are introduced. The existing faction profile remains usable without this feature, and character affiliation/history remains a subsequent story.

**Verification:** Save zero, one and multiple entries; round-trip every field through reopening and shared-project views. Edit/remove an entry and confirm other entries, profile fields, ownership and completeness are unchanged and protected references survive. Verify partially filled entries save, entirely blank rows are ignored and blank numeric values stay unset. Round-trip zero/positive decimal strength/movement and signed decimal modifiers. Reject negative strength/movement and nonnumeric/nonfinite supplied values with field errors and prior committed state preserved; do not change faction completeness. Verify cancellation, failed publication and rejected foreign-faction/universe writes without importing example defaults.

### Story 3.9: Track faction affiliation history on the character sheet

As Jo,
I want to record a character's faction changes and dates,
So that I can see its current affiliation and the history leading to it on the character sheet only.

**Acceptance Criteria:**

**Given** a character and available faction profiles in the same universe,
**When** I record an accepted dated affiliation change,
**Then** the character has zero or one current faction under the agreed history/current-state contract,
**And** no operation can assign simultaneous memberships,
**And** faction references include the owning-universe identity and refer to the existing canonical faction records.

**Given** an affiliation change is committed,
**When** I inspect the character sheet,
**Then** the canonical dated record identifies the character, previous affiliation, new affiliation and fictional date,
**And** the previous affiliation derives from the preceding change (or unaffiliated before the first), while the new affiliation preserves the recorded faction choice,
**And** associated projects resolve the same authoritative character history rather than a copied project-local history.

**Given** faction entry, change or exit history exists,
**When** I view the universe timeline directly or through an associated project,
**Then** faction affiliation changes are absent from that timeline,
**And** saving an affiliation change does not create a visible timeline entry,
**And** current affiliation and its dated history remain available on the character sheet only.

**Given** a character is unaffiliated or already belongs to a faction,
**When** I record joining a faction, changing to another faction or leaving for the unaffiliated state,
**Then** the corresponding dated transition is preserved,
**And** the resulting history respects one faction at a time,
**And** the character viewer shows its current faction or no current faction according to the same contract.

**Given** a proposed affiliation change is out of chronological order or shares a date with another change,
**When** it is validated and committed,
**Then** changes are ordered by fictional date regardless of entry order,
**And** same-date changes have an editable sequence, with new entries placed last within that date,
**And** the final change in that sequence determines the current faction, including unaffiliated,
**And** backdated entries and corrections recalculate the previous/new chain while preserving other recorded faction choices and retained history,
**And** the application does not invent a time of day, silently overwrite earlier history or assume edit order equals fictional chronology,
**And** character-sheet history sequencing does not borrow timeline-event ordering or create timeline entries.

**Given** affiliation data was successfully committed,
**When** I close/reopen the universe or access it through another associated project,
**Then** the same current affiliation and complete recorded transition history are available on the character sheet,
**And** a character without affiliation remains valid,
**And** another universe's faction cannot be assigned.

**Given** affiliation history contains dated changes,
**When** the universe calendar is revised through Story 1.9,
**Then** transition elapsed positions, order and intervals remain unchanged,
**And** displayed dates are recalculated without introducing overlapping memberships or changing unrelated character data.

**Given** I cancel a change, submit an invalid reference/date or coordinated publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved affiliation and history,
**And** errors are reported without claiming a completed change,
**And** the shared publication/recovery protocol prevents a partially updated current affiliation or missing/duplicate transition,
**And** previously committed character, faction and affiliation-history records remain consistent.

**Requirements:** FR-37/38 and the accepted character-sheet-only affiliation contract; FR-48 faction viewer integration; FR-7/40/44 date-only chronology/sharing integration; CAP-6; AD-3/6/8/10/18 and derived-state/ownership conventions; NFR-1/2/3/6/7/9. FR-41 timeline-event ordering does not define affiliation-history ordering.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.8 only. Apply resolved DEC-22 chronological/same-date sequencing, final-change current-state derivation and reference-safe correction rules. Use DEC-03/04 shared dates/display. Reuse TECH-01 character/faction/affiliation-history/reference contracts and TECH-02/04/05/11 publication, writer, recovery and storage guarantees. TECH-08 applies to any corrections involving removal or protected references/history. Capture assignment/history/viewer interactions under PLAN-04. DEC-14 timeline-event placement is not a dependency of character-sheet affiliation history.

**Scope boundary:** Use existing faction profiles and universe-owned character history; no project-local faction, character or history copy is created. Faction changes are shown only on the character sheet, never as universe timeline entries. Character affiliation is distinct from the optional military-unit roster and does not imply individual unit membership, multiple concurrent allegiances, combat behavior or an additional required character-development field. Faction deletion and project recovery remain separate work governed by their own integrity gates. This visibility change supersedes older FR-38 source wording; Jo approved the revised character-sheet-only Story 3.9; DEC-22 sequencing/current-state/correction rules are now resolved.

**Verification:** Record unaffiliated-to-faction, faction-to-faction and faction-to-unaffiliated changes; verify dated history/current affiliation on the character sheet after reopening and through shared projects. Confirm no faction-change entries appear in any universe timeline view while unrelated events remain unchanged. Reject foreign-universe references. Verify out-of-order insertion is sorted by fictional date, same-date additions append and manual sequencing changes the chain consistently. Verify current faction derives from the final change rather than latest edit, including unaffiliated. Correct/backdate a change and verify recalculated previous/new values, unchanged other recorded choices and preserved retained history; test calendar edits, cancellation and failed/interrupted publication without overlapping membership or duplicate transitions.

### Story 3.10: Associate chapter characters and display writing targets

As Jo,
I want to associate characters with chapters and see my chapter-count and word targets while writing,
So that the relevant cast and planning goals stay accessible beside the manuscript.

**Acceptance Criteria:**

**Given** an active chapter and characters in its project's authoritative universe,
**When** I select characters to associate with that chapter,
**Then** the chapter stores references to their existing universe/character identities,
**And** multiple characters can be associated without creating project-local character copies,
**And** saving the chapter requires no character association.

**Given** a chapter has associated characters,
**When** I plan or write that chapter,
**Then** its associated characters are visible and accessible through the existing character-sheet workflow,
**And** a saved character rename is reflected through the same canonical reference,
**And** switching chapters shows each chapter's own saved associations,
**And** faction-change history remains on the character sheet only and is not added to the universe timeline.

**Given** an association exists,
**When** I remove it from the chapter,
**Then** the current chapter association changes without deleting the character or its universe history,
**And** references needed by retained content remain protected under the shared integrity contract,
**And** another chapter's associations are unchanged.

**Given** a new chapter is created,
**When** its initial writing target is shown,
**Then** its word-count target defaults to 2,500 words,
**And** this default does not overwrite existing saved target values or impose a writing/saving limit.

**Given** I enter accepted chapter-count and per-chapter word targets,
**When** I save and view the relevant planning/writing workspace,
**Then** the optional chapter-count target belongs to the story and the word target belongs to the chapter,
**And** both are visible in the relevant planning/writing workspace,
**And** per-chapter word targets are associated with their intended chapter identities,
**And** target values do not change manuscript content, chapter identity or chronology.

**Given** a target has been reached or exceeded,
**When** I create another chapter, continue writing or save work,
**Then** the target never blocks that action or truncates content,
**And** either target can be cleared, with blank meaning unset and zero remaining a distinct explicit target,
**And** no fixed chapter or word-count cap is introduced.

**Given** character associations and targets were successfully saved,
**When** I close and reopen the project,
**Then** the same character references and target values are restored,
**And** renaming a story or moving it between volumes preserves its chapters' associations and targets,
**And** characters from another universe cannot be associated.

**Given** I cancel edits, submit invalid target input or association/target publication fails,
**When** the operation ends,
**Then** cancellation preserves the prior saved values,
**And** targets accept whole numbers of zero or more, and negative, fractional or nonnumeric values produce a field error rather than being committed or silently rounded,
**And** failure is reported without claiming persistence,
**And** the prior committed references, targets and manuscript remain consistent under the shared publication/editor-state contracts.

**Requirements:** FR-47; FR-44 shared-character reference integration and FR-48 character-sheet access; CAP-2; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.9 only. Apply resolved DEC-23: optional per-story chapter-count target, default 2,500-word per-chapter target, both clearable, and non-negative whole-number validation with zero distinct from unset. Use TECH-01's chapter/character/reference/target schema, TECH-02/04/05/11 publication, writer, recovery and storage guarantees, and TECH-08's retained-reference preservation before association removal. Preserve DEC-15 pending manuscript edits. Capture association/target/editor interactions under PLAN-04 without imposing a layout or extra metric.

**Scope boundary:** This story adds character references and informational target values, not character duplication, automatic association of the character's events, scene POV roles, mandatory participation, word-count algorithms or enforcement. Chapter-period timeline context and explicit chapter/event links follow in later stories. Faction history visibility remains the accepted character-sheet-only contract.

**Verification:** Associate several same-universe characters, navigate chapters, rename a character, remove one association without deleting its record and reopen. Reject foreign-universe references and preserve other chapter links. Verify a new chapter defaults to 2,500 words without overwriting existing saved targets. Set/save/reopen targets, exceed them while creating/writing/saving and verify no caps. Verify each story has its own optional chapter-count target and each chapter its own word target. Clear either target and reopen; compare unset with explicit zero. Reject negative, fractional and nonnumeric values with field errors and prior saved values preserved. Verify the 2,500-word default does not overwrite saved targets, including cleared ones. Exercise canceled edits, failed publication, volume regrouping and unchanged manuscript/chronology.

### Story 3.11: Plan linked chapter events from the chapter or timeline

As Jo,
I want to plan chapter events from either my chapter or a universe timeline position,
So that the manuscript and the universe's history refer to the same events.

**Acceptance Criteria:**

**Given** a chapter belongs to a project with an authoritative universe,
**When** I associate any existing canonical event in the same universe, including a birth or background event, with that chapter,
**Then** the chapter links the event's existing UUID and owning-universe identity,
**And** each chapter/event pair has one depiction role, main event or flashback,
**And** the same event may be linked to multiple chapters,
**And** either role may link events outside the chapter’s dates without changing any dates,
**And** linking does not duplicate the event, move its recorded date or alter either optional chapter date.

**Given** I am planning a chapter,
**When** I use its event action to open the dedicated event editor and save a new dated event,
**Then** it is saved as a canonical event in the same universe and linked with the selected depiction role,
**And** its dated content appears automatically at the same recorded position on the universe timeline,
**And** chapter and timeline views use the same event content/identity rather than independent copies,
**And** the chapter view does not provide inline event content/date editing.

**Given** I select a position on the universe timeline to populate chapter events,
**When** I choose or create the relevant chapter through the existing chapter workflow, complete event data in the dedicated event editor and save the accepted event/link inputs,
**Then** the selected timeline date prefills a new event’s date, which remains editable in the dedicated editor,
**And** choosing an existing event preserves its recorded date instead of replacing it with the selected timeline date,
**And** the resulting chapter/event link is the same kind used by chapter-first planning,
**And** the application does not require inventing an optional chapter start/end date or silently changing one.

**Given** a chapter has linked main events and flashbacks,
**When** I inspect its event associations or their universe timeline records,
**Then** their saved roles, canonical records and historical dates remain distinguishable,
**And** the chapter can still exist without any event links or dates,
**And** cross-universe events and character-sheet-only faction history cannot be presented as valid timeline-event link choices.

**Given** a current chapter/event link exists,
**When** I remove that depiction link,
**Then** only the chosen current association is removed,
**And** the canonical universe event and any other links remain intact,
**And** protected retained references/history are preserved under the shared integrity contract.

**Given** linked planning data was committed,
**When** I close/reopen the project or inspect the universe through another associated project,
**Then** the same canonical events, owning identities and chapter depiction links are resolved,
**And** the existing calendar-change contract preserves linked events' elapsed positions and optional within-date order.

**Given** I cancel planning, submit invalid ownership/role/date inputs or event/link publication fails,
**When** the operation ends,
**Then** cancellation preserves the committed chapter and universe state,
**And** DEC-24 validation and persistence errors are reported without claiming success,
**And** the coordinated publication/recovery protocol prevents partially created chapter/event/link state or duplicate canonical events,
**And** pending manuscript edits remain protected.

**Requirements:** FR-46; main/flashback link foundation for FR-5/6; event-context foundation for FR-45; continued FR-7/40/41/42/44; CAP-3; AD-3/6/8/10/18 and event ownership; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.10 only. Apply resolved DEC-24 same-universe canonical-event eligibility, one role per chapter/event pair, multi-chapter reuse, out-of-range linking without date changes and editable new-event date prefill. Reuse DEC-03/04 chronology/display, DEC-14 event insertion and existing optional chapter-date validation. TECH-01 must define the common chapter/event/depiction-role contract; TECH-02/04/05 must prove coordinated cross-project/universe publication, writer serialization and restart recovery before these linked writes. Use TECH-08 before removing links, TECH-11 persistence guarantees and DEC-15 pending-editor protection. Capture both entry directions under PLAN-04.

**Scope boundary:** Deliver canonical chapter/event planning without requiring future decision trees, restoration or timeline zoom. Direct flashback historical-date editing in the event editor, Edit event links for existing chapter events and chapter-period context follow in separate stories using these links. Chapter dates retain independent field behavior; a link alone never moves an event. Faction affiliation history remains on the character sheet only and is not converted into timeline events.

**Verification:** Link an existing same-universe event as main/flashback; create linked events by opening the dedicated event editor from a chapter; plan from a selected timeline position using existing/new chapters. Verify one canonical UUID through both entry paths, unchanged dates on link-only changes, undated/no-link chapters, removal without event deletion and saved links after reopening. Exercise calendar conversion, foreign-universe/affiliation-history rejection, canceled edits and cross-store publication/restart failures. Verify birth/background event eligibility, one role per chapter/event pair and the same event in multiple chapters. Link both roles outside chapter dates without changes to any dates. Verify selected timeline dates prefill new events and can be edited, while linking existing events preserves their dates.

### Story 3.12: Edit flashback historical dates independently of chapter dates

As Jo,
I want to edit a flashback's historical date independently,
So that I can correct when an event happened without changing the chapters that depict it.

**Acceptance Criteria:**

**Given** a canonical universe event is linked to a chapter as a flashback,
**When** I explicitly edit its historical date in the dedicated event editor and save an accepted value,
**Then** the same event moves to the corresponding position on its owning-universe timeline,
**And** its event UUID, content and existing depicting-chapter links are preserved,
**And** the edit does not change any depicting chapter's start/end dates, manuscript or identity.

**Given** the event has more than one existing depiction link,
**When** its new historical date is committed,
**Then** linked chapter views and associated-project timeline views resolve that same updated canonical event,
**And** the application does not create chapter-specific copies or silently remove valid depiction links,
**And** role/range validation follows DEC-24 without silently rewriting chapter dates to fit the event.

**Given** a chapter depicts a flashback,
**When** I assign, clear or move that chapter's start/end dates using the existing independent-date workflow,
**Then** the flashback event retains its elapsed historical position and content,
**And** its depicting-chapter link remains intact,
**And** flashback protection does not depend on a chapter having both dates.

**Given** a flashback date edit changes its date group,
**When** the timeline displays the committed event,
**Then** cross-date order is chronological and date-group placement follows DEC-14,
**And** no hours, minutes or seconds are required,
**And** unrelated event dates/content are unchanged.

**Given** a universe with flashbacks is reconfigured through Story 1.9,
**When** its calendar changes,
**Then** flashback elapsed positions, chronological order and intervals are preserved,
**And** only displayed calendar dates are recalculated,
**And** chapter depiction links are preserved.

**Given** the explicit historical-date change was successfully saved,
**When** I close and reopen the project/universe,
**Then** the same historical event date and chapter links are restored,
**And** events belonging to another universe remain separate.

**Given** I cancel the edit, submit an invalid date/ownership reference or persistence fails,
**When** the operation ends,
**Then** cancellation preserves the saved event and links,
**And** validation or persistence failure is reported without claiming success,
**And** the shared publication/recovery protocol preserves the prior consistent event/link/chapter state,
**And** pending manuscript edits remain protected.

**Requirements:** FR-6 direct historical-date editing and ordinary chapter-movement protection; FR-5 independent event editing and no chapter-driven mutation; continued FR-7/40/41/44/46; CAP-3; AD-3/6/8/10/18 and the accepted chapter-date contracts; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.11 only. Use DEC-03/04 chronology/display, DEC-14 event placement, DEC-24 depiction-role/range validation and DEC-15 pending-editor behavior. Reuse TECH-01's event/depiction/reference/date contracts and applicable TECH-02/04/05/11 coordinated publication, writer, restart-recovery and persistence guarantees. Capture explicit flashback-date editing under PLAN-04.

**Scope boundary:** This story requires an explicit historical-event edit to move a flashback. The chapter view links to the dedicated event editor; chapter date changes never move main events or flashbacks. Epic 5 chapter restoration must preserve the same flashback historical-date invariant and add restoration integration checks; its UI is not a dependency here. This story introduces no automatic chapter rescheduling, event copying or affiliation timeline entries.

**Verification:** Edit a linked flashback date, verify the same event UUID through timeline and chapter views and reopen. Exercise multiple existing depiction links, chapters with neither/one/both dates and each chapter-field edit without flashback movement. Verify date-group placement, populated-calendar conversion and unchanged unrelated events/manuscripts. Test invalid ownership/date input, canceled edits and failed publication. Later chapter-view navigation/restoration stories must verify that all linked event data remains unchanged by chapter operations.

### Story 3.13: Open the event editor from a chapter without chapter-driven event changes

As Jo,
I want an Edit event link beside a chapter's linked events,
So that I can explicitly edit the event itself while chapter changes leave its recorded history unchanged.

**Acceptance Criteria:**

**Given** a chapter has linked main events or flashbacks,
**When** I view the chapter,
**Then** linked event dates/content are displayed without inline event-editing fields,
**And** each linked event provides an Edit event link to its dedicated editor,
**And** opening that link resolves the same canonical event UUID and owning-universe identity rather than a chapter-local copy.

**Given** I open an event through the chapter's Edit event link,
**When** I explicitly save accepted event changes in the dedicated editor,
**Then** that event's canonical date/content is updated through the existing event application use cases,
**And** returning to the chapter reflects those committed changes through the same event reference,
**And** other views/projects sharing the event reflect the same authoritative record,
**And** the event edit does not automatically change chapter dates, manuscript content or depiction links.

**Given** a chapter has linked events,
**When** I assign, move or clear its start/end dates, save its manuscript or change chapter metadata,
**Then** every linked main event and flashback keeps its recorded date/content,
**And** chapter start/end remain independent and use only explicitly entered values,
**And** no elapsed-day event shifting, linked-update toggle or event movement selection is offered.

**Given** pending chapter manuscript edits exist,
**When** I follow an Edit event link and later return to the chapter,
**Then** the existing DEC-15 editor-navigation contract protects those edits,
**And** opening the link does not silently discard pending writing or mutate the event,
**And** event saves cannot falsely acknowledge unsaved chapter edits as persisted.

**Given** I cancel an event edit or its persistence fails,
**When** I return to the chapter,
**Then** cancellation leaves the saved event unchanged,
**And** failure is reported without claiming the event changes were saved,
**And** committed event/chapter records remain consistent under the shared publication/recovery contract,
**And** unsaved state is handled according to the accepted editor-navigation/retry rules.

**Given** a link points to an unavailable event or a different universe,
**When** it is resolved,
**Then** the application reports the missing/invalid reference rather than editing another record or silently creating a replacement,
**And** the chapter and valid event records remain unchanged.

**Given** a saved chapter links to existing events,
**When** I close/reopen the project and follow an Edit event link,
**Then** it still opens the same valid authoritative event,
**And** character-sheet faction affiliation history is not exposed as a timeline event choice.

**Requirements:** FR-5 independent event editing and required chapter-view Edit event link; FR-6 flashback independence; continued FR-42/44/46; CAP-3; AD-3/6/8/10/18 and the superseding chapter/event-isolation contracts; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.12 only. Reuse the dedicated canonical event editor and Story 3.11 depiction references. Capture link placement/navigation/return interactions under PLAN-04; DEC-15 must cover opening the event editor with pending manuscript edits. TECH-01 defines the common event-editor command/reference contract; inherit TECH-02/04/05/11 publication, writer, restart-recovery and persistence guarantees. DEC-24 governs valid links/roles; DEC-02's chapter-event selection controls are superseded, not an unresolved implementation prerequisite.

**Scope boundary:** Chapter operations do not edit linked events. Chapter-only restoration in Epic 5 must preserve all linked event dates/content; separate event-item and whole-project/universe recovery remain supported under their own protective contracts. Creating an event from chapter context opens the event editor as in Story 3.11; it does not introduce inline chapter event editing. Chapter association link/unlink actions remain distinct from editing/deleting the canonical event. Main/flashback depiction roles, calendar elapsed-position preservation and character-sheet-only faction history remain binding.

**Verification:** From a chapter, open and explicitly edit a main event and a flashback; verify the same canonical UUID and unchanged chapter data. Move start day 10 to day 20 with end day 30: end stays 30, a linked main event at day 12 stays 12, and a flashback at day 2 stays 2. Repeat first assignment, clearing, end-only, explicit-both-date and manuscript/title saves with all event content unchanged. Verify no inline event fields or linked-shift controls, pending-edit navigation, event cancellation/failure, missing/foreign-universe references and reopening. Epic 5 must add chapter-only restoration isolation checks without removing separate event/project recovery.

### Story 3.14: Inspect chapter chronology and characters alongside manuscript writing

As Jo,
I want to see my chapter's place in the universe timeline and its linked characters/events while writing,
So that I can keep the manuscript consistent with the setting's history without losing my current work.

**Acceptance Criteria:**

**Given** a selected chapter has an accepted start/end period,
**When** I open its timeline context while writing,
**Then** I can focus/zoom the owning-universe timeline into that recorded period,
**And** dated content remains in chronological elapsed-day order with the accepted optional same-date arrangement,
**And** the workspace identifies the chapter and the timeline's owning universe,
**And** changing the view does not change chapter dates or any event data.

**Given** the chapter has associated characters and linked main events/flashbacks,
**When** I inspect its context alongside the manuscript,
**Then** the existing character associations and canonical event links remain accessible,
**And** main/flashback roles and recorded historical dates are distinguishable,
**And** opening a character uses its existing character sheet,
**And** each event's Edit event link opens the dedicated event editor rather than enabling inline chapter event changes.

**Given** a linked flashback lies outside the chapter period,
**When** I inspect that chapter's context,
**Then** the linked historical event remains listed with “Go to event” and “Return to chapter period” actions,
**And** these actions change only the view using the accepted chapter focus rule,
**And** its date is not shifted or reinterpreted as the chapter period,
**And** focusing the timeline does not remove the depiction link.

**Given** the chapter has only one date or neither date,
**When** I select it or request timeline focus,
**Then** a start-only or end-only chapter focuses its recorded date without inventing another date,
**And** an undated chapter keeps the current timeline view,
**And** chapters without a start remain first in creation order in the chapter list,
**And** an end-only chapter does not gain a substitute start-date sorting key,
**And** writing and accessing existing associated records remain possible.

**Given** I switch project, universe or chapter,
**When** the context is refreshed through the common query/selection contracts,
**Then** chapter-specific character/event associations and the correct authoritative universe are resolved,
**And** universe/timeline selection stays synchronized in both directions,
**And** another universe's records are not mixed into the chapter's context,
**And** faction affiliation changes remain on character sheets only and never appear as timeline entries.

**Given** a valid event was explicitly edited through its editor or the universe calendar was changed,
**When** I return to or refresh the chapter context,
**Then** it resolves the same canonical record with the committed content and current displayed dates,
**And** calendar changes preserve elapsed event/chapter positions,
**And** chapter changes themselves still leave every linked event date/content unchanged.

**Given** pending manuscript edits exist or a context query/reference cannot be resolved,
**When** I navigate between context and writing surfaces,
**Then** DEC-15's editor-state/navigation behavior protects those edits,
**And** unavailable/invalid context is reported without inventing replacement records or claiming changes were saved,
**And** existing valid chapter/event records are unchanged by a failed view operation.

**Requirements:** FR-45 chapter-period zoom and character/event writing context; FR-44 synchronized ownership; continued FR-5/6/7/40/41/42/46/47; CAP-2/3; AD-3/6/8/10/18; NFR-1/2/3/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.13 only. Apply resolved DEC-25 range/single-date/undated focus and out-of-period Go to event/Return to chapter period navigation; retain DEC-01 range validation, DEC-03/04 shared chronology/display, DEC-14 event order, DEC-16 chapter ties and DEC-15 pending-edit navigation. TECH-01 defines common context query/selection/reference results; reuse the existing authoritative stores, secure transport and dedicated editors rather than a separate timeline database. Capture chapter-context/editor layout and interactions under PLAN-04; quantitative performance budgets remain DEC-11.

**Scope boundary:** This story completes Epic 3's chapter/character/event timeline context using already available records. Established-decision context under FR-45 is added in Epic 4 when decision records exist, reusing this same context surface and selection contracts; it is not a dependency for current writing/context use. No new event type, event duplication, inline chapter event editor, automatic chapter/event date shift, hypothetical branch or faction-history timeline entry is introduced.

**Verification:** Focus a dated chapter and inspect associated characters/main events/flashbacks while writing. Exercise same-date order and out-of-period linked events, verifying they remain listed and Go to event/Return to chapter period change only the view. Verify start-only/end-only chapters focus the recorded date, undated chapters retain the current view, and both dates focus the start-to-end period; no dates, links or sorting keys are fabricated. Check empty context. Switch chapters/projects/universes, follow editor/sheet links, refresh after explicit event edits/calendar changes and verify correct canonical records without chapter-driven mutation. Confirm pending edits survive the agreed navigation paths and failed/missing-context queries do not alter writing data. Epic 4 must add established-decision context checks.

### Epic 3 planning completion and coverage

All fourteen stories are approved. They build on Epics 1/2, proceeding from character records and development through personality/images, birth/background history, faction profiles/units, character-sheet affiliation history, chapter associations/targets, canonical event links, independent event editing and manuscript/timeline context. Each story depends only on earlier approved capabilities and its explicitly tracked product/technical gates. No software implementation or integration-test completion is claimed.

| Epic 3 primary requirement | Approved story coverage |
| --- | --- |
| FR-5 — Independent event editing and chapter-view edit link | 3.13; 3.11 routes chapter-context creation through the event editor; 2.3 independent chapter fields remain binding |
| FR-6 — Independent flashback editing and chapter-operation protection | 3.12; 3.13 protects all linked events; Epic 5 must verify chapter-only restoration isolation |
| FR-14 — Year-only birth records on day 1 | 3.5, including years beginning with a standalone day |
| FR-15 — Main/major/minor/extras classification and filtering | 3.1; 3.2 retains name-only extras with optional fuller development |
| FR-16 — Character fields and completeness/waivers | 3.1 required name; 3.2 textual fields/states; 3.3 optional personality; 3.4 optional images |
| FR-17 — Exact 100-label personality multiselect | 3.3 |
| FR-36 — Faction profiles, draft completeness and optional repeating units | 3.7 profile fields/images/drafts; 3.8 optional military roster |
| FR-37 — Zero or one current faction | 3.9; current affiliation is visible on the character sheet |
| FR-38 — Dated affiliation history on the character sheet only | 3.9; no faction-change universe-timeline entries |
| FR-39 — Shared character background/timeline events | 3.6 |
| FR-45 — Chapter-period timeline zoom and contextual writing | 3.14 character/event context; Epic 4 must add established-decision context using the same surface |
| FR-46 — Bidirectional chapter/timeline event planning | 3.11 canonical event links and event-editor creation routes; 3.13 dedicated Edit event links |
| FR-47 — Chapter-character associations and informational targets | 3.10, without enforced chapter/word caps |
| FR-48 — Guided creator, expected states and character viewer | 3.2 prompts/text/states; 3.3 personality; 3.4 image/placeholder; 3.9 faction; 3.10 character-sheet access |

All fourteen primary FR identifiers are mapped. Shared date-only chronology, optional event ordering, universe ownership and populated-calendar preservation from Epic 1 apply to the new birth/background/depiction records. Character-sheet affiliation history uses the same fictional calendar without appearing on the timeline or inheriting timeline-event ordering. Project/volume regrouping does not change character/event ownership or chapter references.

**Accepted amendments:** Faction entry/change/exit history is shown only on character sheets. Chapter date/content changes never edit linked main events or flashbacks; chapter views provide dedicated Edit event links and no inline event fields or linked-shift controls. Chapter-only restoration must likewise leave linked event data unchanged, while separate event-item and whole-project/universe recovery remain required in Epic 5. Older source wording and the unapproved main-event-shifting proposal do not override these contracts. DEC-02's former selection-control question is resolved/superseded, not implemented functionality.

**Open implementation gates:** DEC-05/18–24 product rules are resolved by the later accepted amendments. DEC-25 focus/navigation rules are also resolved by the later accepted amendment; shared technical/design gates remain. Inherit DEC-01/03/04/14/15/16 chronology, date/order and pending-edit-navigation rules where referenced. Apply TECH-01–05/08/09/11/12 before their affected schema, cross-store mutation, shared-reference, image and packaged/native integration work. PLAN-04 still governs the required layouts/interactions; performance/platform acceptance stays tracked in TODO.md. Story approval chooses none of the unresolved answers and closes no implementation task.

**Later-epic obligations:** Epic 4 adds established decisions/result links/lookup and their FR-45 writing-context integration. Epic 5 must preserve and recover these universe records, images, chapter links and retained historical dependencies, applying the current chapter/event-isolation and authority/reconciliation contracts. Epic 6 exports use the same manuscript/database contracts. Earlier delivered workflows must remain usable without these future features.

**Next planning checkpoint:** Confirm moving to Epic 4, Track plots and established decisions. Step 3 remains in progress until all six epics have approved stories.


## Epic 4: Track plots and established decisions

Maintain story-owned plot sequences and universe-owned established decisions, resulting-event relationships and unresolved lookup, integrating decision context with the existing writing workspace. Primary requirements: FR-31–34; supporting FR-45.

### Story 4.1: Maintain a story’s dated and undated plot sequence

As Jo,
I want to record and arrange plot entries for each story,
So that I can follow its planned progression while keeping dated entries in chronological order.

**Acceptance Criteria:**

**Given** a story is selected,
**When** I create a plot entry with a heading and an optional fictional date,
**Then** it belongs to that story and receives an automatic sequence number,
**And** no time of day is required,
**And** leaving the date unset does not invent a date or create a universe event.

**Given** the story contains dated and undated entries,
**When** I view its plot sequence,
**Then** undated entries appear first in their saved manual order,
**And** dated entries follow in chronological elapsed-day order, with saved manual order within each same-date group,
**And** automatic numbering reflects that resulting sequence.

**Given** I create an entry or change an existing entry’s date, including setting or clearing it,
**When** I save successfully,
**Then** it goes last within its destination undated or same-date group,
**And** the relative order of other entries is preserved and numbering updates,
**And** editing only a heading or saving an unchanged date preserves its current position.

**Given** several entries share a date or are undated,
**When** I manually reorder entries within that group,
**Then** their order and automatic numbering update and survive reopening,
**And** manual ordering cannot move an entry across date groups, change its date or place dated entries before undated entries.

**Given** I switch stories, projects or optional volume groups,
**When** I view the selected story’s plots,
**Then** each story retains its own entries and sequence even when stories share a universe,
**And** volume regrouping does not change plot ownership, dates or order.

**Given** the owning universe’s populated calendar is reconfigured,
**When** plot dates are displayed again,
**Then** dated entries retain their elapsed positions and chronological relationships while displayed dates are recalculated,
**And** undated entries remain undated and manual group order remains intact.

**Given** an entry is canceled, invalid under the shared heading/date contract, or cannot be persisted,
**When** the operation finishes,
**Then** cancellation or rejection leaves the saved sequence unchanged,
**And** persistence failure is reported without claiming success or publishing a partially changed sequence,
**And** pending edits follow the agreed editor-navigation/retry contract.

**Requirements:** FR-34; supporting FR-7/40/44; CAP-8; AD-3/6/8/10/18 and shared plot-ordering contract; NFR-1/2/3/6/7/9.

**Dependencies:** Earlier approved Epic 1–3 capabilities only. TECH-01 must define the plot command/query, heading validation, date and derived-order contracts; inherit DEC-03/04 chronology/display, DEC-15 pending-editor navigation and applicable TECH-02/04/05/11 publication, writer/restart and persistence guarantees. Capture plot layout/reordering/error interactions under PLAN-04. No later decision, revision, backup or export story is needed to use this sequence.

**Scope boundary:** Story-owned plot entry creation, heading/date editing, listing and within-group manual ordering. No plot deletion, universe-event creation, decision/result links, hypothetical branches or additional mandatory plot fields. Recovery integration follows in Epic 5.

**Verification:** Mix undated entries and multiple dates with ties; verify create/redate/clear insertion, within-group reorder, unchanged-date/heading-only preservation and numbering after reopen. Check story isolation, volume regrouping, calendar conversion, invalid input, cancellation and failed writes. Attempt forbidden cross-group moves and confirm dates/chronology remain unchanged.


### Story 4.2: Record established decisions on the universe timeline

As Jo,
I want to record when a decision was made, who made it and what was decided,
So that established choices remain visible in the history of my universe.

**Acceptance Criteria:**

**Given** an authoritative universe is selected,
**When** I save an established decision with a fictional date, decision type, decision text, an automatically generated required short name/code and a maker when required by its type,
**Then** it receives a permanent UUID in that universe and appears at its recorded timeline position,
**And** its short name/code is saved separately from its UUID/full decision text, displayed on its timeline mark and may be edited later without changing identity/dates/relationships,
**And** decision defaults D001, D002, … expand beyond 999 and are unique against event/decision codes in the same universe,
**And** no hours, minutes or seconds are required,
**And** Personal Decisions require a maker while Story Decisions permit none,
**And** a maker is at most one existing character or faction in the same universe, referenced by canonical identity so renames appear automatically,
**And** recording either type requires no resulting event or automatic story/plot association.

**Given** I need an additional decision type,
**When** I add it through the application under the accepted DEC-30 validation/ownership contract,
**Then** it becomes selectable for decision records,
**And** its name and saved record assignments survive reopening,
**And** Personal and Story are not hard-coded as the only decision types,
**And** the type belongs to the universe and is shared across its projects,
**And** creation offers Maker required, defaulting to optional,
**And** blank names and names duplicating any custom or built-in category name in that universe are rejected ignoring case and surrounding spaces.

**Given** I change an existing decision's type,
**When** I save it,
**Then** its content and links are preserved and any maker required by the new type must be selected before saving,
**And** assigning Story type alone creates no story association,
**And** invalid changes leave the saved record unchanged.

**Given** an existing standalone Universe Event and an existing character or faction in the same universe,
**When** I explicitly set or clear its optional maker reference through the existing event editor,
**Then** the same canonical event saves that maker reference or no maker without requiring a decision link,
**And** its date and identity remain unchanged,
**And** the event has at most one maker, stored as a canonical reference with automatic rename reflection,
**And** invalid or foreign-universe maker references are rejected under the shared reference contract.

**Given** a decision has been saved without outgoing result-event or following-decision links,
**When** I inspect it,
**Then** it is unresolved because it has no outgoing result link of either kind,
**And** saving or editing its text, maker or date does not mark it resolved,
**And** no independently editable resolved flag is introduced.

**Given** I open an existing established decision,
**When** I explicitly save changes to its date, maker or decision text,
**Then** the same canonical record is updated and its timeline placement reflects the accepted date,
**And** edits survive close/reopen without changing unrelated events, chapters or plots,
**And** the same-universe projects resolve the same authoritative decision.

**Given** the fictional calendar is reconfigured or timeline/universe selection changes,
**When** decisions are displayed,
**Then** elapsed decision positions are preserved while displayed dates are recalculated,
**And** chronology and the existing optional same-date ordering contract apply,
**And** the timeline identifies its universe and excludes records from other universes.

**Given** required decision information is invalid, a reference is missing/foreign, I cancel, or saving fails,
**When** the operation completes,
**Then** invalid input is reported under the shared validation contract and cancellation leaves saved records unchanged,
**And** failed writes do not claim success or publish a partial decision/timeline update,
**And** pending edits follow the agreed navigation/retry contract without silently discarding writing.

**Given** a decision code is generated or edited,
**When** the change is validated and saved,
**Then** the code is trimmed, nonblank and case-insensitively unique across event/decision records in the same universe,
**And** generated numbers follow creation order and advance past previously issued numbers and occupied codes,
**And** date/reordering changes leave the code stable; explicit code edits refresh live views without changing UUID/dates/links,
**And** invalid/duplicate input reports an error and preserves pending edits and committed data.

**Requirements:** FR-31 decision recording and timeline context; initial FR-32 link-derived unresolved state; supporting FR-7/40/41/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Apply resolved DEC-38 automatic/editable short-label format, validation, uniqueness, stability and history rules and add the field to TECH-01. Apply Personal-required/Story-optional maker rules; apply approved DEC-30 custom-type maker/ownership/name rules below. Approved Epic 1–3 capabilities and Story 4.1 only; no future result-link/tree/lookup/context story is needed to record and inspect decisions. Apply accepted DEC-26 maker eligibility/cardinality/reference rules and require affected-reference resolution before maker removal; TECH-01 defines shared decision DTOs, reference/date validation and query commands. Inherit DEC-03/04 chronology/display, DEC-14 timeline insertion and DEC-15 pending-editor navigation, and applicable TECH-02/04/05/11 persistence/publication/writer/restart guarantees. PLAN-04 covers decision-editor and timeline interactions.

**History integration:** Later revision/recovery stories preserve captured short codes; this story needs no revision UI or future history capability to save/display a live code.

**Scope boundary:** Record, inspect and explicitly edit established decisions in the existing universe timeline. Later stories add resulting-event links, relationship-tree display, unresolved lookup and character/story/writing-context navigation. Category-filter integration for added types is delivered and verified in Story 4.7; adding/selecting/saving types here needs no visibility controls. Optional direct Universe Event maker-reference editing is delivered here using the shared maker contract after Epic 3; Story 1.7 remains usable without maker services. No hypothetical alternatives, separate reason/consequence text fields, automatic event creation or decision deletion. DEC-26 maker representation is accepted; its character/story context-association rules remain open.

**Verification:** Verify trim/blank/case-duplicate rejection, occupied/issued-code skipping, growth beyond 999, creation-order allocation, date/reorder stability, edited-label live refresh, UUID/link preservation while preserving future historical-code integration under TECH-09; revision behavior is verified in Story 5.1, not a prerequisite here. Round-trip/display required short name/code separately from UUID/full decision text under approved DEC-38 rules. Verify universe-shared types and cross-universe isolation, default-optional Maker required creation choice, blank/case/space-equivalent built-in/custom duplicate-name rejection and maker-required type-change validation with content/link preservation and no automatic story association. Add a decision type, select it for decisions and verify its name/assignments survive reopen without invoking category controls. Verify character and faction maker choices, at-most-one cardinality, rename reflection and affected-reference resolution before maker removal. Reject missing/ineligible/foreign-universe makers and missing Personal makers. Set/clear an optional Universe Event maker reference independently of decision links; reopen and verify identity/date and ownership validation. Save/edit/reopen a decision with all three fields, verify canonical identity and timeline placement, shared-universe visibility and isolation from another universe. Confirm new decisions remain unresolved without links, calendar conversion preserves elapsed positions and same-date ordering follows the shared contract. Exercise invalid/missing/foreign references, canceled edits, failed writes and pending manuscript navigation without data loss.


### Story 4.3: Link established decisions to their resulting events

As Jo,
I want to connect established decisions with the events that resulted from them,
So that I can track their consequences and see which decisions still lack a recorded result.

**Acceptance Criteria:**

**Given** I want to record an event without a contributing decision,
**When** I create and save it through the existing standalone-event editor,
**Then** it can exist with zero decision links and appears at its own universe date,
**And** no decision selection or placeholder decision is required to save, edit or reopen it,
**And** eligible standalone events can later be linked as results without changing their UUID or content.

**Given** an established decision in the selected universe,
**When** I explicitly create a resulting event through the dedicated canonical event editor and save its link to that decision,
**Then** the event appears at its own recorded universe date and the source decision is resolved after the relationship is committed,
**And** the event and link follow the shared coordinated-publication/recovery contract without leaving a partially published result,
**And** no event is created merely by viewing or saving the decision.

**Given** canonical events (including birth and background events) and established decisions in the same universe,
**When** I link an existing event as a result,
**Then** one decision can have multiple resulting events and one event can result from multiple decisions,
**And** a result date equal to or later than the contributing decision date is accepted,
**And** an earlier result date is rejected with a clear error without automatically moving either date,
**And** character-sheet faction-affiliation history is excluded from result-event choices,
**And** linking reuses the existing event UUID rather than copying its content,
**And** adding a link does not change either record’s date/content, chapter dates or depiction links,
**And** repeated linking of the same pair does not duplicate the relationship or result count.

**Given** a decision already has a resulting event,
**When** I add further resulting-event links,
**Then** it remains resolved and all its saved links remain accessible,
**And** each event stays at its own timeline position rather than being moved to the decision’s date.

**Given** a decision has one or more resulting-event links and no outgoing following-decision links,
**When** I explicitly remove a link,
**Then** it stays resolved if any resulting-event links remain and becomes unresolved when its last resulting-event link is removed,
**And** unlinking does not delete or edit the canonical event,
**And** removing an event’s last decision link leaves it saved and visible on the universe timeline at its unchanged date,
**And** other decisions linked to that event retain their links and independently derived status.

**Given** I inspect a decision or resulting event after committed changes or reopening,
**When** its relationships are loaded,
**Then** I can inspect its linked counterparts in both directions using canonical same-universe identities,
**And** this event-only workflow computes resolution from the remaining resulting-event links rather than a separately editable flag,
**And** projects sharing the universe see the same authoritative relationships.

**Given** a proposed link has an unavailable, foreign-universe or otherwise ineligible endpoint, I cancel, or persistence fails,
**When** the operation is processed,
**Then** invalid links are rejected without inventing replacement records,
**And** cancellation leaves saved relationships unchanged,
**And** failure is reported without claiming successful creation/linking/unlinking or publishing inconsistent status,
**And** pending manuscript edits follow the existing navigation/retry contract.

**Requirements:** FR-32 many-to-many resulting-event relationships and link-derived resolution; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.2 only. TECH-01 defines relationship identity, endpoint validation, reverse queries and shared commands; TECH-02/04/05/11 govern coordinated publication, serialization, restart recovery and persistence. Apply resolved DEC-27 all-canonical-event eligibility and result-date-on-or-after-decision validation, excluding faction-affiliation history and never shifting dates automatically. Inherit DEC-03/04 chronology/display, DEC-14 event insertion and DEC-15 pending-edit navigation. PLAN-04 covers result creation/link/unlink interactions. No future tree, lookup, recovery or context story is needed to create and inspect these links.

**Scope boundary:** This story delivers and verifies event-result workflows without requiring following-decision link creation. Story 4.4 extends the shared resolver and verifies both outgoing link kinds together, retaining the accepted rule that either kind resolves its source. Decision links are optional for events; the existing FR-35 standalone-event workflow remains independently usable. Explicit resulting-event creation via the existing editor, existing-event linking, unlinking and bidirectional relationship inspection. Tree visualization and the dedicated unresolved lookup follow in later stories. No hypothetical branches, separate consequence text field, chapter-driven event edits or faction-history timeline entries. Canonical event deletion is not introduced here; before any later event-deletion path, TECH-08 must protect references/history and FR-32 requires recomputing every affected decision from surviving links, including unresolved lookup updates once available.

**Verification:** Create/edit/reopen an event with zero decision links; later link it and remove its last decision link, verifying unchanged identity, content and timeline placement. Create a result, link an existing event, connect two decisions to one event and multiple events to one decision. Verify duplicate-pair prevention, adding after resolution, removing one versus the last link and independent status of other decisions. Confirm both-direction inspection, identity/date/content preservation, reopening and shared-universe visibility. Exercise foreign/missing/ineligible endpoints, same-date/later-date acceptance and earlier-result rejection with clear errors and unchanged dates/relationships, birth/background eligibility and affiliation-history exclusion, canceled event/link actions and failure/restart during coordinated event/link publication. Mixed event/following-decision link verification belongs to Story 4.4, once both link kinds can be created. Later tree/lookup stories verify the same relationships and status; later deletion work must verify last-result removal with retained-history protection.


**Epic 4 scope amendment — decisions leading to decisions:** Jo added direct established decision-to-decision relationships. These are first-release scope under FR-32/CAP-7 and must be represented in the tree. Approved Stories 4.2–4.3 retain their recorded approval; their event-only status criteria must be reconciled with DEC-28 before affected implementation. Proposed Story 4.4 now covers direct decision links; the prior unapproved tree proposal is moved to Story 4.5 so it depends only on earlier linking capabilities. No additional story is approved by this amendment.


### Story 4.4: Link an established decision to a decision it leads to

As Jo,
I want to link a decision directly to another decision it leads to,
So that I can follow established chains of choices without inventing intermediate events.

**Acceptance Criteria:**

**Given** two eligible established decisions in the same universe,
**When** I explicitly link the first as leading to the second,
**Then** a directed relationship is saved between their canonical identities,
**And** each decision may have multiple preceding and multiple following decisions,
**And** the following decision may have the same date or a later date,
**And** earlier following dates, self-links and links creating any directed cycle are rejected with dates/existing links unchanged,
**And** no intermediate event, copied decision or placeholder record is created,
**And** each decision retains its own date, maker and text.

**Given** a saved direct decision relationship,
**When** I inspect either endpoint or reopen the universe,
**Then** I can distinguish the preceding and following decision and navigate to the same canonical records,
**And** projects sharing that universe see the same authoritative relationship,
**And** repeated linking of the same directed pair creates no duplicate relationship.

**Given** decisions also have resulting-event links,
**When** I add or remove a direct decision link,
**Then** event links and canonical event records remain unchanged,
**And** either an outgoing following-decision link or an outgoing result-event link resolves the source decision, without an independently edited flag,
**And** an incoming link alone does not resolve the receiving decision; each decision’s status depends on its own outgoing links.

**Given** a decision has both an outgoing result-event link and an outgoing following-decision link,
**When** I remove its last result-event link while its following-decision link remains,
**Then** it stays resolved,
**And** the event remains saved at its own date with other records/relationships intact.

**Given** a decision has both outgoing result kinds,
**When** I remove its last following-decision link while a result-event link remains,
**Then** it stays resolved,
**And** removing its final outgoing link across both kinds makes it unresolved,
**And** the linked decisions/events remain saved without an independently editable status flag.

**Given** a saved decision-to-decision link,
**When** I explicitly unlink it,
**Then** the relationship is removed without deleting or editing either decision,
**And** other relationships remain intact; the source becomes unresolved only if it has no outgoing links of either kind.

**Given** foreign/missing endpoints, a duplicate or disallowed link, cancellation or a failed write,
**When** the operation is processed,
**Then** shared validation rejects invalid links under DEC-28 without inventing records,
**And** cancellation leaves saved relationships unchanged,
**And** failed publication reports failure without inconsistent links/status or false success,
**And** pending writing follows the accepted editor-navigation/retry rules.

**Requirements:** Amended FR-32 direct decision-to-decision links; FR-31/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.3 only. Apply resolved DEC-28 many-to-many cardinality, self-link/cycle rejection and following-date-on-or-after-source validation; either outgoing result kind resolves its source under the accepted shared contract. TECH-01 must include directed decision relationship DTOs, validation, errors and bidirectional queries; TECH-02/04/05/11 govern serialized crash-safe publication and persistence. Reuse DEC-15 editor navigation; PLAN-04 covers link/unlink interactions. Tree visualization follows as Story 4.5 and is not a dependency for creating/inspecting links.

**Scope boundary:** Direct established decision relationships only; no hypothetical alternatives, automatic inferred links, intermediate events, transitive resolution rule or decision deletion. Standalone events remain usable without decision links. The accepted resolution rule supersedes earlier event-only status criteria in Stories 4.2–4.3. DEC-28 link-validation choices are resolved by the accepted many-to-many, cycle-free and same/later-date rules.

**Verification:** Complete Story 4.3’s deferred mixed-link integration: remove the last event-result link while a following-decision link remains, then the reverse; verify resolution persists until the last outgoing link of either kind is removed, including after reopen. Preserve endpoint identities/content and independent incoming-link status. Save and reopen A → B → C, inspect direction and canonical endpoints and navigate both ways. Mix decision-to-decision and decision-to-event links; unlink without endpoint mutation and verify either kind of outgoing link resolves its source, both kinds can coexist and only removing the last link across both kinds returns it to unresolved. Exercise duplicate pairs, foreign/missing endpoints, multiple predecessors/successors, same/later following-date acceptance, earlier following-date rejection, self-links and short/long cycles including same-date cycles, with dates/existing links preserved on validation errors, cancellation, failed writes/restart and shared-universe isolation.


**Accepted resolution amendment:** Jo specified “either” when asked whether a following decision or resulting event resolves its source. Either outgoing result kind qualifies; unresolved means no outgoing links of either kind. Canonical Stories 4.2–4.4 are reconciled above. DEC-28 still gates link validation, not this settled resolution rule.


### Story 4.5: Inspect established decision/result relationships in a tree view

As Jo,
I want a visual tree of established decisions, decisions they lead to and resulting events,
So that I can follow the recorded relationships that shape my universe’s history.

**Acceptance Criteria:**

**Given** established decisions and saved result links exist in the selected universe,
**When** I open the decision-tree view,
**Then** it displays established decision-to-decision and decision-to-event relationships using the existing canonical records,
**And** I can identify each decision by its recorded date, maker and decision text and each resulting event by its heading and date,
**And** the view identifies its owning universe and creates no separate timeline or event store.

**Given** a decision has multiple results or an event has multiple contributing decisions,
**When** I inspect the tree,
**Then** all those relationships can be inspected without treating the event as separate underlying records,
**And** visual occurrences of a shared event resolve to the same canonical event UUID,
**And** visual layout does not imply additional decision/event relationships or hypothetical alternatives.

**Given** a decision has neither outgoing result-event links nor following-decision links,
**When** it is displayed in the tree,
**Then** it is identifiable as unresolved with no invented result,
**And** an event with zero decision links remains independently saved and visible on the universe timeline without requiring a tree relationship or placeholder decision.

**Given** A leads to B and B has no outgoing results,
**When** I inspect their status in the tree,
**Then** A is resolved through its link to B and B remains unresolved,
**And** a decision with both outgoing event and decision links stays resolved until its last outgoing link across both kinds is removed,
**And** incoming links alone do not resolve the receiving decision.

**Given** I select a decision or event in the tree,
**When** I inspect its details or open its existing editor,
**Then** navigation resolves the same canonical same-universe record,
**And** inspecting or arranging the view does not change record dates/content, links, chapter dates or manuscripts,
**And** pending writing follows the existing editor-navigation contract.

**Given** a decision/event is explicitly edited, links are committed or removed, or the calendar is reconfigured,
**When** the view refreshes or reopens,
**Then** displayed relationships and per-decision status agree with the committed canonical records,
**And** dates reflect the current calendar while elapsed positions remain unchanged,
**And** removing links preserves endpoint records and recomputes each affected decision’s status from its remaining outgoing event and decision links.

**Given** I switch universes, the selected universe has no decisions, or a query/reference fails,
**When** the tree loads,
**Then** it shows only the selected universe’s records or an accurate empty state,
**And** a failure is reported rather than presented as a successful empty result,
**And** missing references do not create replacement records and viewing failures leave saved data unchanged.

**Requirements:** FR-32 established relationship-tree display; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/7/9. Quantitative performance acceptance remains DEC-11.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.4 only. Reuse TECH-01 canonical relationship queries, identities, errors and selection results; inherit DEC-03/04 date display, DEC-15 pending-editor navigation and Stories 4.3–4.4’s relationship contracts, including the accepted either-result resolution rule. DEC-28 validation rules remain an implementation gate. PLAN-04 must capture tree layout, shared-event presentation, navigation, empty/error states and readable access to all relationships before this UI implementation. The dedicated unresolved lookup and character/story/writing-context integration are later stories, not prerequisites.

**Scope boundary:** Visualize existing established decision/result relationships and navigate to existing details/editors. No hypothetical branches, automatic inferred links, new record types, independent timeline, generic graph-editing feature, event deletion or required links for standalone events. Tree layout must represent many-to-many relationships faithfully without prescribing a particular graph library or visual duplication strategy.

**Verification:** Display a decision-to-decision chain with a downstream event and mixed direct-decision/event links; verify direction, canonical endpoint identities and either-kind outgoing-link resolution, including A resolved/B unresolved for A → B with no outgoing B links. Display one-to-many and many-to-one links, follow every endpoint and verify canonical identity, date/maker/text or heading/date. Verify unresolved decisions, an empty universe, standalone events with no decision links and preservation after last-link removal. Refresh/reopen after edits, linking/unlinking and calendar changes; switch universes and exercise pending-writing navigation, failed queries and missing references without mutation or fabricated empty success. Shared-event visual occurrences must never create duplicate stored events.


### Story 4.6: Find unresolved decisions from the universe timeline

As Jo,
I want to open a list of unresolved decisions from the universe timeline,
So that I can find established choices that still have no recorded result.

**Acceptance Criteria:**

**Given** a universe timeline is selected,
**When** I open its unresolved-decision section,
**Then** it lists exactly that universe’s decisions with neither outgoing result-event links nor outgoing following-decision links,
**And** each entry shows its recorded timeline position, decision-maker and decision text,
**And** the section identifies its owning universe and uses the same canonical records and shared resolution query as the tree.

**Given** an unresolved decision is listed,
**When** its first outgoing resulting-event or following-decision link is committed through the existing linking workflows,
**Then** that decision becomes resolved and leaves the unresolved list when the committed state is refreshed,
**And** no independently editable resolved flag or separate lookup copy is introduced.

**Given** a decision has outgoing event and/or following-decision links,
**When** one link is removed,
**Then** the decision stays out of the unresolved list while any outgoing link of either kind remains,
**And** removing its last outgoing link makes it unresolved and returns it to the list,
**And** unlinking preserves the canonical endpoint records and their dates/content.

**Given** A leads to B and B has no outgoing links,
**When** I open the lookup,
**Then** A is excluded as resolved and B is included as unresolved,
**And** an incoming relationship alone does not resolve B,
**And** standalone events without decision links are not listed as unresolved decisions and remain independently available on the timeline.

**Given** I select a listed decision,
**When** I inspect its details or follow its existing timeline/tree/editor navigation,
**Then** the same canonical decision and owning universe are resolved,
**And** inspecting the lookup does not change decisions, relationships, events or writing,
**And** pending manuscript edits follow the accepted navigation/retry contract.

**Given** I switch the universe or timeline selection, edit a decision or reconfigure its calendar,
**When** the lookup refreshes or reopens,
**Then** the selected universe and timeline remain synchronized in both directions,
**And** only the selected universe’s current unresolved decisions appear with their committed maker/text and recalculated displayed dates,
**And** calendar changes preserve elapsed decision positions and existing links,
**And** projects sharing the same universe query the same authoritative status.

**Given** there are no unresolved decisions or the query/reference cannot be loaded,
**When** I open or refresh the section,
**Then** a successful empty result is distinguishable from a reported load failure,
**And** failure does not silently present an incomplete result as a successful empty list, invent replacement records or modify saved state,
**And** canceled or failed link operations do not falsely remove or add decisions based on uncommitted changes.

**Requirements:** FR-33; FR-32 combined outgoing-result resolution; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.5 only. Reuse TECH-01 canonical decision/relationship queries, error contracts, identity/selection and committed-state refresh. Inherit DEC-03/04 chronology/display, DEC-15 pending-writing navigation and existing validated link operations; DEC-26/27/28 remain gates only for their unanswered maker/context and link-validation details. PLAN-04 captures lookup entry point, list/detail navigation, refresh and empty/error presentation. Character/story-arc and writing-context integration follows separately; no future context, recovery or export story is needed to use this lookup.

**Scope boundary:** A timeline-accessible unresolved-decision section scoped to the selected universe. No new decision type, hypothetical alternatives, standalone-event resolution requirement, automatic linking or custom status flag. Display ordering/filtering beyond the agreed lookup content is not prescribed. Canonical deletion is not introduced; later deletion paths must update this same lookup consistently while preserving retained dependencies under TECH-08.

**Verification:** Exercise initial unresolved decisions, first event-result link, first following-decision link, multiple/mixed outgoing links, removal of some versus all links and A → B with unresolved B. Confirm standalone events remain independent. Navigate to the same canonical record, switch universes/timelines/projects, edit details, reconfigure the calendar and reopen. Verify empty versus failed loads, canceled/failed link writes, missing references and pending-writing navigation without stale committed status or saved-data mutation. Later deletion work must verify lookup updates after removing affected live relationships with retained-history protection.


**Epic 4 visibility amendment:** Jo requires showing/hiding decisions by decision-maker and events by event type. Proposed Story 4.7 now includes these context visibility controls under amended FR-45. Hidden records retain canonical data and relationships and continue to count toward resolution. DEC-29 tracks event categories and remaining filter UX/ownership rules. Story 4.7 remains unapproved; approved count is unchanged.


**Accepted category amendment:** The initial timeline categories are **Universe (Universe Events)**, **Personal (Personal Decisions)** and **Story (Story Decisions)**. Universe Events may exist without a decision or decision-maker and can optionally link to either. Personal Decisions require a decision-maker but need no event link. Story Decisions may have a decision-maker and event links, but require neither. Decisions may still lead directly to other decisions, and either kind of outgoing result link resolves its source. Category labels do not change existing canonical universe/project ownership or imply an automatic story association.

Jo must be able to add additional decision types later through the application. Newly added types must be selectable for decision records and available in the category visibility controls; their names/assignments survive reopening. Do not hard-code Personal and Story as the only possible decision types. DEC-30 must define custom-type maker requirements, owning scope/sharing, names/validation, category-change validation and missing-maker presentation/filtering before the affected implementation. Type rename/delete or arbitrary custom fields are not implied.

The maker-required rule is now type-dependent: Personal requires a maker; Story permits none. This supersedes older universal requirements for every decision to have a maker. Universe Events remain canonical events, and Personal/Story remain canonical decisions, while the visibility controls expose the supplied three categories. Universe Events can optionally reference a maker directly without requiring a placeholder decision. Event-maker links and optional decision-maker fields must use the common identity/reference contracts. Event/decision links remain optional except for Personal’s required maker relationship; link-derived resolution still applies to decisions, not to standalone events.

These later type-dependent maker rules supersede older blanket maker-required wording in approved story displays/validation. Story 1.7 must support optional direct Universe Event maker links without requiring a decision. Story 4.2 now includes type selection/addition and maker validation. Story 4.7 includes category visibility and added types. Approved count remains 36; Story 4.7 awaits approval.


### Story 4.7: Inspect established decisions in character, story-arc and writing context

As Jo,
I want to inspect relevant established decisions and their results in character/story-arc context alongside my manuscript,
So that I can understand the choices leading to the part of the story I am writing.

**Acceptance Criteria:**

**Given** decisions have explicit relevant-to associations with any number of same-universe characters/stories, separate from their maker,
**When** I inspect a character or story-arc context,
**Then** its explicitly associated canonical decisions are accessible with their recorded dates, decision-makers and decision text,
**And** character associations are universe-owned and story associations project-owned,
**And** associations can be added/removed through the decision editor without deleting the decision or other associations,
**And** the context uses those agreed associations rather than inferring relevance solely from a shared date, chapter period or universe,
**And** character context does not assume every decision-maker is necessarily a character.

**Given** a chapter is selected in the existing manuscript/timeline workspace,
**When** I inspect decision context alongside writing,
**Then** the context combines decisions associated with the selected story and decisions associated with the chapter’s characters, showing each matching canonical decision once,
**And** these decisions are accessible through the existing owning-universe context surface together with the already available character/event context,
**And** chapter-period timeline focus reuses Story 3.14 and DEC-25 without fabricating missing chapter dates,
**And** chapter dates, event dates/content and manuscript text remain unchanged by viewing or focusing context.

**Given** the selected universe/context contains decisions from different decision-makers,
**When** I use the decision-maker visibility control,
**Then** I can show or hide decisions according to who made them,
**And** the selected visibility is reflected in the displayed context without editing decisions or inventing character/story associations.

**Given** the selected universe/context contains Universe Events, Personal Decisions, Story Decisions and added decision types,
**When** I use the event-type visibility control,
**Then** I can show or hide Universe Events, Personal Decisions, Story Decisions and added decision types by category, including standalone Universe Events without decision links,
**And** maker and event-type controls can be used independently together,
**And** categories do not conflate main/flashback depiction roles or decision-link status,
**And** Personal Decisions require a maker, Story Decisions permit none, and Universe Events permit neither a maker nor a decision link,
**And** makerless records display No maker with a matching maker-filter option, initially visible and excluded when only named makers are selected, without inventing a canonical maker.

**Given** an additional decision type was added and assigned using Story 4.2,
**When** I open the category visibility controls after saving/reopening,
**Then** that type is available for showing/hiding its assigned decisions,
**And** clearing its filter reveals the same records under the remaining context constraints,
**And** type definitions, saved assignments, canonical relationships and resolution remain unchanged by filtering.

**Given** no visibility selection has been saved for the universe,
**When** I open its timeline, decision tree, writing context or unresolved lookup,
**Then** all makers/categories are initially shown within existing context constraints.

**Given** I select multiple makers and categories,
**When** visibility refreshes,
**Then** matches use OR within each filter group and AND between groups,
**And** selections persist per universe across reopening and synchronize across timeline/tree/writing-context/lookup,
**And** an active-filter indicator and Show all reset expose and clear these visibility restrictions,
**And** a relationship endpoint excluded by filters has a Hidden by filters marker without changing the link or resolution.

**Given** a decision/event is hidden by a visibility filter,
**When** the display and status refresh or I clear the relevant filter,
**Then** the record and its canonical relationships remain unchanged and it becomes available again when no active context/filter constraint excludes it,
**And** hidden outgoing result links still count toward the source decision’s resolution,
**And** hiding a following decision or event never makes its source unresolved or changes unresolved-lookup membership,
**And** the presentation makes a filtered view distinguishable from an unfiltered empty result under DEC-29.

**Given** I inspect a relevant decision,
**When** I follow its established relationships,
**Then** I can access its following decisions and resulting events through the existing relationship/tree/detail navigation,
**And** each endpoint retains its own canonical identity and recorded date even when outside the currently focused period,
**And** context/navigation for out-of-period records is captured under PLAN-04 without moving records into the chapter period,
**And** events without decision links remain independently available through existing event/timeline views.

**Given** decisions have outgoing decision and/or event links,
**When** their status is shown in context,
**Then** either outgoing link kind resolves its source and neither kind means unresolved,
**And** incoming links alone do not resolve the receiving decision,
**And** context, tree and unresolved lookup agree on the same committed relationship-derived status.

**Given** I follow a decision, character or event link while manuscript edits are pending,
**When** I inspect its details/editor and return to writing,
**Then** the accepted DEC-15 navigation/save/failure behavior protects pending edits,
**And** opening or returning from context does not claim unpersisted writing was saved,
**And** existing records change only through their explicit application edit/link operations.

**Given** I switch chapter, story, project or universe, edit a decision/link through its explicit workflow, or reconfigure the calendar,
**When** context refreshes or reopens,
**Then** character/story-arc relevance follows the current accepted associations and selected story,
**And** timeline/universe selection remains synchronized and records from other universes are excluded,
**And** same-universe projects share the same canonical decision records while story plots and story-specific associations remain scoped under their accepted ownership contract,
**And** calendar display recalculates without changing elapsed positions or relationships.

**Given** relevant decisions are absent, a reference is unavailable/invalid or a context query fails,
**When** I inspect the context,
**Then** an empty context is distinguishable from a reported load/reference failure,
**And** no replacement records, inferred associations or fabricated dates are created,
**And** the failure does not modify saved writing, relationships or other valid records.

**Requirements:** Completes FR-31 character/story-arc context and Epic 4’s amended FR-45 established-decision context and decision-maker/event-type visibility alongside writing; supporting FR-32/33/35/40/44 and chapter/event independence under FR-5/6/42; CAP-2/3/7; AD-3/6/8/10/18; NFR-1/2/3/7/9.

**Dependencies:** Approved Epic 1–3 capabilities, especially Story 3.14’s chapter/timeline/character/event workspace, and Stories 4.1–4.6 only. Apply resolved DEC-26 explicit relevant-to associations, universe-owned character/project-owned story links, decision-editor add/remove and selected-story/ chapter-character union relevance; these do not create a separate arc entity or infer associations from maker/date. Initial categories and Personal/Story maker rules are settled; apply approved DEC-29 filter selection/default/persistence/surface-interaction rules below; apply approved DEC-30 custom-type/makerless rules below. Retain DEC-25 partial-date focus and DEC-15 pending-writing navigation. TECH-01 defines common context/selection/reference/filter contracts rather than a parallel decision store; inherit existing publication/writer/restart/persistence guarantees for any accepted association mutation. PLAN-04 must capture character/story-arc/writing layouts and navigation, including out-of-period decisions/results, visibility controls and filtered-empty/hidden-relationship presentation. DEC-11 performance acceptance remains open.

**Scope boundary:** Integrate established decisions and existing result relationships into existing character/story-arc/manuscript context, with decision-maker and event-type show/hide controls. Reuse shared filters for affected timeline/context presentation under DEC-29; no visibility action mutates records, links or resolution. Define and implement only associations required by the accepted DEC-26 contract; do not silently equate maker, chapter membership, timeline proximity or plot-entry identity with arc relevance. No hypothetical alternatives, separate reason/consequence text fields, inline chapter event edits, automatic chronology changes, event duplication or faction-history timeline entries. Recovery/export are later epics and not prerequisites for contextual writing.

**Verification:** Verify No maker display/filter option, default inclusion and exclusion when only named makers are selected. Verify initial all-visible state, multi-select OR within/AND across filter groups, per-universe reopen persistence and synchronization across timeline/tree/writing-context/lookup, active-filter indicator/Show all reset and Hidden by filters endpoints. Verify Personal requires a maker; Story permits none; Universe Events permit no maker/decision or optional direct links. Add a decision type through Story 4.2 and verify record assignments and its category filter after reopening. Hide/show decisions from different makers and events from each accepted type, independently and together; clear filters and verify reappearance under remaining context constraints. Include standalone events, a hidden event/decision that still resolves its source, active-filter empty states and foreign-universe isolation. Verify record counts/links/dates and unresolved-lookup membership are unchanged by filtering. Create/edit/remove multiple same-universe character/story associations through the decision editor. Verify maker selection alone does not associate a character, character/story views use explicit matches and writing context unions story/chapter-character matches without duplicates. Verify story association isolation across projects and removal without decision deletion or protected-reference loss. Inspect the same decisions alongside writing; verify canonical navigation into decision chains and event results, including records outside the focused chapter period. Exercise dated/start-only/end-only/undated chapters under DEC-25, unrelated same-date decisions, empty context, shared-universe projects with distinct story associations/plots and foreign-universe records. Refresh/reopen after explicit edits, link/unlink changes and calendar conversion; verify combined outgoing-link status across context/tree/lookup. Protect pending manuscript edits through navigation, canceled edits, missing references and failed queries without changing chapter/event data or inventing relevance.

### Epic 4 planning completion and coverage

All seven stories are approved. Story 4.1 covers story-owned plot sequences; 4.2 records typed decisions and supports adding decision types; 4.3 links result events while preserving independent Universe Events; 4.4 links decisions directly; 4.5 displays the established relationship tree; 4.6 provides unresolved lookup; 4.7 integrates character/story/writing context and category/maker visibility. Stories depend on earlier capabilities and explicitly tracked implementation gates, not later recovery/export stories. Planning approval does not establish implementation readiness or test completion.

| Epic 4 requirement | Approved story coverage |
| --- | --- |
| FR-31 — Established decisions, types and contextual views | 4.2 records decisions, Personal/Story type rules and added decision types; 4.7 character/story-arc context; 4.5 timeline/tree navigation |
| FR-32 — Result relationships and tree | 4.3 many-to-many event links; 4.4 directed decision links; 4.5 tree; 4.6/4.7 consistent status |
| FR-33 — Timeline-accessible unresolved lookup | 4.6, using absence of both outgoing result kinds |
| FR-34 — Story plot sequence | 4.1 undated-first, chronological dated groups, manual within-group ordering, destination-group-last insertion and derived numbering |
| FR-45 — Established decisions alongside writing and visibility filters | 4.7 reuses Story 3.14 context and adds maker/category show/hide controls |
| FR-35 amendment — Independent Universe Events with optional direct maker/decision links | Existing 1.7 gains optional maker references under the accepted category amendment; 4.3 preserves independent events and 4.7 verifies optional links/category visibility |

**Accepted amendments:** Universe Events require neither maker nor decision, but may link to either. Personal Decisions require a maker and no event link; Story Decisions require neither maker nor event. Additional decision types can be added in the application, selected and filtered after reopening (4.2/4.7). Either an outgoing event-result or following-decision link resolves its source; only absence of both kinds is unresolved. Incoming links alone do not resolve a decision. Visibility filters preserve canonical data, relationships and resolution, including when results are hidden. These current contracts supersede older event-only status and universal-maker wording. All 49 FR and 12 CAP identifiers remain stable.

**Open implementation gates:** DEC-26 maker representation/character-story associations; DEC-27 event-result eligibility/temporal validation; DEC-28 direct-decision link cardinality/self-links/cycles/temporal validation; DEC-29 filter interaction/persistence/surface presentation; DEC-30 custom-type ownership/validation/makerless handling. Retain DEC-03/04 chronology/display, DEC-15 pending writing, DEC-25 partial-date focus, TECH-01 shared schemas and the applicable TECH-02/04/05/08/11 integrity/persistence contracts. PLAN-04 layouts and DEC-11 performance acceptance remain open. Initial categories, Personal/Story maker requirements and either-result resolution are settled; other unchecked decisions are not implied by approval.

**Later-epic obligations:** Epic 5 must protect and recover typed decisions, added type definitions/assignments, optional maker references, both relationship kinds and their historical dependency closure, alongside plots and existing universe/project records. Apply current Replaced/reference/authority/reconciliation contracts and preserve chapter-only restoration isolation from linked events. Removal/restoration of live links must yield consistent resolution, tree, context and unresolved lookup while protecting retained history. Persisted filter settings, if adopted under DEC-29, join the applicable capture scope. Epic 6 database export must remain compatible with this expanded content; manuscript exports retain the shared manuscript contract.

**Next planning checkpoint:** Confirm moving to Epic 5, Protect work and recover earlier or lost data. Step 3 remains incomplete until all six epics have approved stories; final validation and sprint planning have not run.


## Epic 5: Protect work and recover earlier or lost data

Inspect and restore earlier work while preserving replaced content; create complete independent backups, recover against one authoritative universe and clean up only eligible unprotected history/archives. Primary requirements: FR-2–4 and FR-18–26. Current chapter/event-isolation and typed decision/reference contracts remain binding.

### Story 5.1: Capture and inspect complete scheduled revisions of current work

As Jo,
I want complete revisions of current work captured at a configurable interval,
So that I can inspect earlier saved states without relying on the latest autosave or a chain of older revisions.

**Acceptance Criteria:**

**Given** revision scheduling has not been customized,
**When** a project is open for current work,
**Then** complete revision capture defaults to a 10-minute interval,
**And** I can configure and persist an accepted revision interval using the existing settings contract,
**And** this interval is independent of 5-minute autosave and the separately configured 10-minute scheduled-backup interval,
**And** opening the project starts the revision timer and changing its interval restarts it,
**And** after sleep one overdue revision is captured rather than replaying missed intervals,
**And** revision captures do not overlap and use the shared writer/capture coordination contract.

**Given** a scheduled revision capture is due while manuscript edits are pending,
**When** the capture runs,
**Then** it first synchronizes pending current-work manuscript text/formatting through application use cases and obtains durable acknowledgment,
**And** it captures the coordinated saved state rather than only an older autosaved document,
**And** concurrent edits and capture use TECH-02/03/04’s consistent boundary so the revision is not a mixture of incompatible states,
**And** failure to persist required pending edits prevents publishing that attempt as a complete revision.

**Given** the coordinated capture succeeds,
**When** the revision is published,
**Then** its complete manifest identifies the saved project/story/volume/chapter/manuscript/plot state and pinned historical universe checkpoint with its required dependency closure,
**And** that closure preserves exact required character/faction/event/decision/calendar/type-definition/assignment content, images, optional maker references, chapter depictions and both decision-result relationship kinds,
**And** historical event/decision short codes retain their captured values after later live label edits, rather than substituting current labels,
**And** optional maker rules, direct decision links, independent Universe Events, story-owned plots and character-sheet-only affiliation history remain faithfully represented,
**And** persisted context/filter settings join the applicable capture scope only where adopted under their accepted ownership contract,
**And** publication preserves one live universe authority; historical checkpoints are not additional live replicas.

**Given** successive revisions reference unchanged document versions, images or other content,
**When** complete manifests are stored,
**Then** unchanged immutable content is reused within its owning store,
**And** each retained revision resolves its exact saved state from its own complete manifest and referenced objects without replaying earlier revisions,
**And** current work and retained revision dependencies are preserved across owning project/universe stores,
**And** this story offers no deletion/expiry path that can remove protected content.

**Given** a completed revision is available,
**When** I select it in the revision history after capture or reopening,
**Then** I can inspect its recorded project and saved chapter/character/event content through read-only historical queries,
**And** inspection uses the pinned saved content rather than silently substituting newer live universe records,
**And** viewing history does not activate or restore it, change live records or discard pending writing,
**And** the history identifies the revision/capture state and distinguishes complete entries from failed/incomplete attempts under PLAN-04.

**Given** saving, cross-store/checkpoint publication or required asset capture fails, or the background host stops during capture,
**When** failure is reported or restart recovery runs,
**Then** partial state is not presented as a successful complete revision,
**And** previously completed revisions/current content retain their protected dependencies,
**And** the application warns about the failed capture, preserves current work/completed revisions and retries at the next revision interval with Retry now available,
**And** restart/publication recovery follows the shared operation contract without treating an incomplete capture as complete,
**And** an incomplete capture does not falsely acknowledge pending edits or claim a successful backup.

**Given** I inspect a revision with missing, invalid or unsupported content,
**When** its history content cannot be resolved safely,
**Then** an explicit error is shown rather than substituting current content, inventing records or blindly rewriting an unsupported schema,
**And** existing saved/live state remains unchanged.

**Requirements:** FR-18 scheduled complete revisions; FR-20 complete no-replay manifests; FR-21 within-store content reuse; FR-22 dependency protection; FR-2 read-only historical item inspection only. Supporting FR-1/28/29/43 and current FR-31/32/34/35/44/45 contracts; CAP-9/12; AD-3/4/6/8/10/13/14/18; NFR-1/2/3/4/5/6/7/9. Performance acceptance remains DEC-11.

**Dependencies:** Approved Epics 1–4 only. TECH-01 versioned document/manifest/identity/query contracts, TECH-02 consistent crash-safe publication, TECH-03 pending-edit acknowledgment/consistent snapshot, TECH-04 writer coordination, TECH-05 host-restart recovery, TECH-09 immutable object/checkpoint identities and cleanup roots, and TECH-11 persistence/migrations must be resolved before their affected implementation. Retain TECH-08 shared reference/history protection and DEC-07 settings validation. DEC-31 timing/retry is settled (project-open timer, restart on interval change, one overdue resume capture, no overlap, warning and next-interval/Retry-now paths); reuse DEC-15 pending-editor handling without treating autosave scheduling rules as automatically applying. PLAN-04 captures history/preview, settings and capture-error/retry interactions. Existing DEC-26–30 product gates still apply to their source records; revision approval does not settle them.

**Scope boundary:** A usable scheduled complete-revision/history-inspection workflow, with only the storage and queries it needs. No item/project restoration, Replaced-trigger UI, cleanup, independent ZIP backup or recovery-authority activation. Normal-close and pre-restoration captures are later integration obligations and must reuse this capture contract; they are not prerequisites for scheduled revision capture or historical inspection. Historical inspection must not trigger conflict resolution or mutate the authoritative universe.

**Verification:** Schedule capture with defaults and a changed valid revision interval, verifying independence from autosave/backup settings and reopen persistence. Capture pending formatted manuscript changes with chapter/plot state and required universe/image/type/maker/decision-link dependencies, then edit live records and verify the revision still resolves its exact historical values. Confirm complete-manifest resolution without reading/replaying earlier revision manifests, immutable reuse and protected shared dependencies. Inspect history without mutating live data, including chapter/event dates and faction-history visibility. Exercise missing assets/references, unsupported schemas, failed pending saves, concurrent writes, interruption at publication stages and restart recovery under the adopted protocols; no partial attempt may appear complete. Use controlled time to verify timer start on project open, restart on revision-interval change, single overdue capture after sleep, non-overlap and failure warning with next-interval/Retry-now recovery; preserve pending edits and existing complete revisions. Later restoration/backup/retention stories must add their own end-to-end checks against this same manifest/capture contract.


**Epic 5 calendar-restoration amendment:** When restoration uses data linked to a saved calendar format/configuration that differs from the current authoritative calendar, visibly flag the affected restored data’s old calendar format as needing an update. Retain the saved calendar association needed to identify the mismatch; do not silently present the old format as current or clear the flag merely because the data was reopened/viewed. This applies to item restoration, project restoration and backup recovery wherever the restored calendar-linked data differs from the authority established for that recovery.

Detection/flagging does not authorize overwriting the live universe calendar or changing linked event dates/content during chapter-only restoration. Preserve elapsed chronology and reference/authority protections. DEC-32 must define what format/configuration differences require the flag, how affected records are identified, the update/confirmation workflow, flag persistence/clearing criteria and whether unresolved updates block any subsequent actions. Jo has required the flag; automatic conversion, automatic calendar replacement or a new restoration-blocking rule has not been selected.

Proposed Story 5.2 includes chapter-restoration mismatch flagging. Later character/event/project/ZIP recovery stories must carry the same obligation; no story approval or new implementation decision is implied by this amendment.


### Story 5.2: Restore a chapter revision while preserving replaced work

As Jo,
I want to restore a chapter’s saved content and dates while preserving the work it replaces,
So that I can recover earlier writing without losing my current version or changing linked event history.

**Acceptance Criteria:**

**Given** a saved chapter revision can be inspected through the existing revision history,
**When** I select that chapter’s historical state for restoration,
**Then** I can inspect the saved chapter content/dates and identify the selected chapter/revision before confirming the restoration,
**And** previewing does not change live content or activate the historical universe checkpoint.

**Given** I confirm chapter restoration while current manuscript edits are pending,
**When** the application prepares the operation,
**Then** it durably acknowledges required pending edits and captures the complete current-work revision using Story 5.1’s manifest/checkpoint contract,
**And** that protective revision is explicitly marked Replaced and remains viewable in history,
**And** no chapter replacement begins until required edits and the complete Replaced capture are durably persisted,
**And** a previous scheduled revision is not silently substituted for the current pre-restoration state.

**Given** protective capture succeeds and the selected saved state passes the shared reference/schema/date contracts,
**When** chapter restoration commits,
**Then** the selected chapter’s saved manuscript formatting/content and independent start/end date values replace its current corresponding values through application use cases,
**And** the same chapter identity is preserved and the chapter list reflects the restored start-date sorting rule,
**And** optional missing dates remain missing without invented bounds or automatic date correction,
**And** unselected chapters, story plots and unrelated live records remain unchanged.

**Given** the selected chapter revision’s saved calendar format/configuration differs from the current authoritative calendar,
**When** the affected data is restored,
**Then** the affected restored data’s old calendar format is visibly flagged as needing an update,
**And** its historical calendar association is retained so the old format is not silently treated as current,
**And** viewing/reopening alone does not clear the pending-update flag,
**And** detection/update/confirmation and flag-clearing behavior follow the accepted DEC-32 contract,
**And** flagging does not overwrite the live universe calendar or change linked event dates/content.

**Given** the chapter has linked main events or flashbacks,
**When** its saved content/dates are restored,
**Then** every linked event keeps its current authoritative date/content,
**And** no event is shifted, restored from the chapter checkpoint or edited inline,
**And** no chapter-restoration event-selection or linked-update control is offered,
**And** any chapter-local association/dependency restoration follows the accepted TECH-08 scope without silently recreating, deleting, relinking or overwriting shared records.

**Given** the work replaced by a successful chapter restoration is needed again,
**When** I open the Replaced revision and select that chapter for restoration,
**Then** I can inspect and restore its saved chapter content/dates through this same protected workflow,
**And** the new restoration first captures the then-current work in another Replaced revision,
**And** linked event date/content isolation and retained historical dependency protection still apply.

**Given** the historical revision/reference is missing, incompatible, foreign or cannot safely resolve against the current authority, or pending-save/Replaced capture fails,
**When** restoration is validated or prepared,
**Then** the chapter replacement is blocked with an accurate error and no false success,
**And** no historical universe copy is promoted to authority or conflicting shared data silently overwritten,
**And** reference/history integrity is preserved and unsupported schemas are not blindly rewritten,
**And** valid current work and earlier completed revisions remain available; already acknowledged current saves are not described as a completed restoration.

**Given** I cancel before replacement commits, a concurrent write invalidates the prepared state, or the host stops during publication,
**When** the operation is canceled, revalidated or recovered,
**Then** cancellation does not apply the selected historical chapter state,
**And** applicable freshness/serialization rules prevent replacing newer current work using stale preparation or stale protective capture,
**And** the coordinated publication/restart contract avoids a partially restored chapter or falsely completed restoration,
**And** any completed Replaced capture remains protected and inspectable even if replacement is canceled or fails.

**Given** restored data is flagged for a calendar configuration/display-format mismatch,
**When** I choose Update to current calendar,
**Then** displayed dates are recalculated from the preserved elapsed positions using the current authoritative calendar,
**And** the affected flag clears only after updated current metadata is durably saved,
**And** failure leaves the flag visible with retry available,
**And** writing remains possible while flagged, without changing chronology, linked-event positions/content, source immutable history or the authoritative calendar.

**Requirements:** FR-2 chapter restoration/read-only preview; FR-4 mandatory recoverable Replaced capture; FR-18 pre-restoration trigger; supporting FR-1/5/6/7/20/21/22/42/44 and the restored calendar-format flag contract; CAP-9; AD-3/6/8/10/13/14/18 and superseding chapter-only restoration/event-isolation contracts; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Story 5.1 only. Resolve TECH-08 partial-item association/dependency scope and shared-history protection before implementing affected restoration. TECH-01 manifest/document/reference/error schemas, TECH-02/03 consistent capture/publication, TECH-04 serialization, TECH-05 restart recovery, TECH-07 applicable freshness/commit checks, TECH-09 immutable protected dependency roots and TECH-11 persistence/migrations govern the operation. DEC-32 mismatch/update/clearing behavior is accepted: explicit display update from preserved elapsed positions, clear on successful save, retry on failure and writing allowed while flagged. Shared comparison/publication schemas remain technical gates. Inherit DEC-01 date-range validity, DEC-03/04 date/display, DEC-15 pending editor/navigation and DEC-16 chapter ties. PLAN-04 specifies old-calendar update flags and the accepted update interactions, preview/confirmation, Replaced history labels and blocked/canceled/failed restoration/retry presentation. No future character/event/project restoration, reconciliation UI or backup story is needed to restore a valid chapter with resolvable dependencies.

**Scope boundary:** A usable chapter-only restore plus recovery of the chapter’s replaced work. This story restores saved chapter content/dates and only chapter-local dependencies explicitly accepted under TECH-08; it introduces no automatic shared-record conflict resolution. Shared-universe conflicts block this operation until safely resolved under the agreed authority contract, never silently overwrite. Character/event-item restoration, whole-project reconciliation and ZIP recovery are later stories with their own coverage. Complete protective captures retain the full required historical closure; chapter-only application does not restore all of that captured universe content.

**Verification:** Capture a chapter under an older calendar, change the authoritative calendar format/configuration, then restore and verify the affected data’s visible update flag, historical calendar association and preservation across view/reopen. Verify flag clearing only through the accepted DEC-32 completion rule, no silent live-calendar replacement and unchanged linked event dates/content. Also exercise a matching calendar without a false mismatch flag under the accepted detection rule. Restore formatted manuscript with neither/one/both chapter dates and confirm identity, list order and independent saved values. Before replacement, edit current writing beyond its last autosave and verify that exact state exists in the completed Replaced revision; restore it through the same workflow and verify a fresh protective capture. Use linked main events/flashbacks changed since the chapter revision and confirm all current event dates/content remain unchanged through chapter restore and Replaced recovery. Verify unselected chapters/plots, retained history, valid chapter references and one universe authority. Exercise cancellation, missing/foreign dependencies, incompatible schema, pending-save/Replaced failure, concurrent changes and crash/restart during commit under the adopted contracts. Failures must not claim restoration or lose current/protected content. Later item/project recovery stories add their own shared-record conflict integration checks.


### Story 5.3: Restore a character revision against the authoritative universe

As Jo,
I want to restore a character’s saved state with explicit review of shared-universe changes,
So that I can recover earlier character development while preserving current work and valid shared references.

**Acceptance Criteria:**

**Given** a saved character state exists in a retained revision,
**When** I select it for restoration,
**Then** I can inspect its saved content/images and identify the character UUID, owning universe and revision,
**And** the preview resolves immutable historical content rather than substituting the current live character,
**And** previewing does not change live records or activate a second universe authority.

**Given** the saved character differs from the current authoritative character with the same universe/record identity,
**When** restoration is prepared,
**Then** that difference is presented for manual resolution with keep live, use recovered or edit a combined version,
**And** identical records need no conflict review,
**And** confirmed universe changes target the single authority and their effect on other projects sharing that character is made clear,
**And** neither the newest-looking timestamp nor the historical copy automatically wins.

**Given** I confirm a character replacement under the accepted partial-item/reference contract,
**When** it is prepared for commit,
**Then** required pending edits receive durable acknowledgment and the current work that will be replaced is durably captured in a complete revision marked Replaced,
**And** protective capture includes the current authoritative character and required historical/image dependencies under TECH-03/08/09, not merely an older project checkpoint,
**And** failure to save pending work or complete protective capture blocks replacement,
**And** the Replaced character remains viewable and restorable through this same protected character-restoration workflow.

**Given** the accepted character restoration scope includes fields, images or relationships with dependent records,
**When** references are validated before application,
**Then** the accepted TECH-08 partial-item contract determines which character-owned values/associations are restored and which referenced canonical records remain current,
**And** missing, foreign or incompatible references are reported and resolved explicitly under that contract before commit,
**And** a character restore does not silently restore birth/background events, faction profiles, calendar configuration, chapter manuscripts or decision/result records merely because they appeared in its historical dependency closure,
**And** zero-or-one current faction and character-sheet-only affiliation history remain valid under the accepted dependency/affiliation scope,
**And** unselected/unrelated records and retained historical dependencies remain protected.

**Given** affected restored character data links to an old calendar format/configuration differing from the current authority,
**When** the restoration is applied,
**Then** that affected data is visibly flagged as needing a calendar-format update,
**And** its historical calendar association is retained and viewing/reopening alone does not clear the flag,
**And** DEC-32 governs detection/update/confirmation/clearing without silently replacing the live calendar or selecting an unagreed conversion/blocking policy.

**Given** conflict choices and protective capture were prepared against a particular live state,
**When** the authoritative state is checked immediately before commit,
**Then** intervening changes require renewed review only for affected conflicts while preserving unaffected choices,
**And** current work replaced by the final commit has a valid fresh protective capture,
**And** validation and commit use the accepted race-free serialized protocol rather than applying stale choices.

**Given** the protected, validated restoration commits,
**When** I reopen the character through its sheet or another same-universe project,
**Then** the same authoritative character identity resolves the confirmed content and image versions,
**And** existing chapter/decision/maker references resolve under the accepted integrity contract,
**And** no duplicate live universe or copied character identity is introduced.

**Given** I cancel reconciliation, required dependencies cannot be resolved, publication fails or the host stops,
**When** the operation is canceled, blocked or recovered,
**Then** proposed restoration changes are not silently applied or reported as successful,
**And** cancellation preserves pending reconciliation work for later resumption without applying its choices,
**And** completed Replaced revisions remain protected and inspectable,
**And** live records and references remain consistent under the coordinated publication/restart contract and required failures are reported accurately.

**Given** restored data is flagged for a calendar configuration/display-format mismatch,
**When** I choose Update to current calendar,
**Then** displayed dates are recalculated from the preserved elapsed positions using the current authoritative calendar,
**And** the affected flag clears only after updated current metadata is durably saved,
**And** failure leaves the flag visible with retry available,
**And** writing remains possible while flagged, without changing chronology, linked-event positions/content, source immutable history or the authoritative calendar.

**Requirements:** FR-2 character-item restoration; FR-4 recoverable Replaced protection; FR-18 pre-restoration capture; supporting FR-14/15/16/17/20/21/22/37/38/39/44/48 and restored calendar-format update contract; CAP-5/6/9; AD-3/4/6/7/8/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.2 only. TECH-08 must settle exact character-item scope, required/shared reference handling and protection of current state affected across projects; existing DEC-19/20/22 character/birth/background/affiliation gates remain applicable rather than answered here. TECH-01 schemas/reference/comparison contracts, TECH-02/03 coordinated capture/publication, TECH-04 writers, TECH-05 restart recovery, TECH-06 version/equality metadata, TECH-07 freshness/commit, TECH-09 immutable assets/manifests and TECH-11 persistence/migrations apply. DEC-32 calendar-format update workflow is accepted; DEC-15 pending edits and PLAN-04 preview/conflict/confirmation/Replaced/cancel-resume/error layouts apply. This story supplies the character-specific manual conflict/restore workflow itself, not a dependency on later whole-project reconciliation or ZIP recovery UI.

**Scope boundary:** One selected existing character’s historical restoration with confirmed shared-authority changes, protected replaced state and resolvable dependencies. The accepted TECH-08 scope governs character-owned associations; no blanket restoration of all records in the pinned universe checkpoint. Missing authority must use the existing locate/recovery gate, never create a second live authority; restoring a project or bootstrapping a universe from a ZIP is later scope. Event-item restoration remains a separate action. Type-dependent decision-maker requirements and optional Universe Event makers do not change merely because they reference this character.

**Verification:** Restore differing character fields/image versions, inspect historical versus live values and exercise keep/use/combined conflict choices with identical-record bypass. Verify Replaced captures the actual authoritative character/current pending work and recover its character state through the same workflow. Use two projects sharing the character and verify canonical identity, reference consistency and the stated shared effects. Exercise accepted birth/background/affiliation/association scope without silently rolling back independent events or faction/decision/chapter data. Restore calendar-linked data after calendar changes and verify update flags and agreed clearing behavior. Test missing/foreign dependencies, incompatible versions, failed pending-save/Replaced capture, canceled/resumed review, intervening live edits and interruption during publication. Confirm no stale application, partial success, duplicate authority or loss of retained images/history.


### Story 5.4: Restore an event revision without changing its depicting chapters

As Jo,
I want to explicitly restore an event’s saved state while preserving replaced work and shared references,
So that I can recover recorded history without moving its chapters or creating another copy of the event.

**Acceptance Criteria:**

**Given** a saved event state is available in retained history,
**When** I select that event for restoration,
**Then** I can preview its saved heading, date and optional description and identify its event UUID, owning universe and revision,
**And** preview resolves historical content without modifying live records,
**And** Universe Events require no decision or maker link merely to be inspected or restored.

**Given** the saved event differs from the current authoritative record with the same identity,
**When** restoration is prepared,
**Then** differences are presented for manual keep-live, use-recovered or combined-content resolution using Story 5.3’s shared review contracts,
**And** identical records need no conflict review,
**And** confirmed changes target the single authoritative universe and their effects on same-universe projects are made clear,
**And** a historical checkpoint is never activated as a second live authority.

**Given** I confirm event replacement,
**When** preparation reaches the protected commit stage,
**Then** required pending edits are durably acknowledged and complete current work is captured in a revision marked Replaced,
**And** that capture includes the actual current authoritative event and required protected relationships/dependencies rather than only an older project checkpoint,
**And** pending-save or protective-capture failure blocks replacement,
**And** the Replaced event remains inspectable/restorable through this same protected workflow.

**Given** protection, reference checks and manual resolution succeed,
**When** the explicit event-item restoration commits,
**Then** the same canonical event receives the confirmed saved content/date and appears at that date in its owning timeline,
**And** linked chapter manuscript/start/end dates remain unchanged,
**And** main/flashback depiction links remain valid under the accepted TECH-08 association scope without silently copying events or dropping chapter references,
**And** every view/project resolves the same authoritative event,
**And** unrelated events, characters, decisions and story plots remain unchanged except for explicitly accepted dependent updates under the shared integrity contract.

**Given** the event participates in background/birth/maker or decision-result relationships,
**When** its restoration scope and dependent references are checked,
**Then** TECH-08 determines which saved event-owned associations can be restored and which current shared references must remain,
**And** missing/foreign/incompatible dependencies are explicitly resolved or block application before commit,
**And** birth-field interactions follow DEC-19 rather than silently overwriting a character’s birth year,
**And** standalone events may retain zero decision/maker links,
**And** any accepted relationship changes yield consistent tree/context/unresolved lookup using both outgoing decision-result kinds; hiding a record never alters resolution,
**And** character-sheet affiliation history is not introduced as a timeline event or event-restoration choice.

**Given** restored event data uses an old calendar format/configuration differing from the current authority,
**When** it is restored,
**Then** the affected data is visibly flagged as needing a calendar-format update with its historical calendar association retained,
**And** viewing/reopening alone does not clear the flag,
**And** DEC-32 defines detection/update/confirmation/clearing without assuming automatic conversion or overwriting the live calendar,
**And** chronological positions/date interpretation use the shared accepted calendar/restoration contract rather than silently reinterpreting an old display string.

**Given** live content changes after review or protective capture,
**When** the event restoration is about to commit,
**Then** the accepted race-free freshness/serialized publication contract rechecks affected state,
**And** only affected conflicts require renewed review while unaffected choices are preserved,
**And** the final replacement is protected by a valid capture of the work actually being replaced.

**Given** review is canceled, validation fails, publication fails or the host stops,
**When** the operation is canceled, blocked or recovered,
**Then** no proposed changes are silently applied or reported as a completed restoration,
**And** canceled reconciliation preserves pending review work for resumption without applying choices,
**And** complete Replaced revisions and required immutable dependencies remain available,
**And** the shared publication/restart protocol preserves consistent event/reference state and reports the actual outcome.

**Given** restored data is flagged for a calendar configuration/display-format mismatch,
**When** I choose Update to current calendar,
**Then** displayed dates are recalculated from the preserved elapsed positions using the current authoritative calendar,
**And** the affected flag clears only after updated current metadata is durably saved,
**And** failure leaves the flag visible with retry available,
**And** writing remains possible while flagged, without changing chronology, linked-event positions/content, source immutable history or the authoritative calendar.

**Requirements:** FR-2 event-item restoration; FR-4 Replaced recovery; FR-18 pre-restoration capture; supporting FR-5/6/7/14/20/21/22/32/35/39/40/41/42/44 and restored calendar-format update contract; CAP-3/7/9; AD-3/6/7/8/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.3 only. Reuse capture/history/protection and shared manual-conflict/recheck contracts. TECH-08 must settle exact event-item association/dependency scope and retained/current cross-project protection. TECH-01 common schemas/reference/comparison rules, TECH-02/03 consistent capture/publication, TECH-04 writers, TECH-05 restart recovery, TECH-06 equality/version metadata, TECH-07 freshness, TECH-09 immutable manifests and TECH-11 persistence apply. Retain DEC-03/04 chronology/display, DEC-14 same-date insertion, DEC-15 pending-writing navigation, DEC-19 birth-field interaction, DEC-24 depiction validity, DEC-27/28 result-link validity and DEC-32 restored-calendar flags. PLAN-04 specifies event-history preview, confirmation, conflicts, Replaced recovery, flags and failure/cancel-resume presentation. No later whole-project restore or ZIP recovery UI is required for a valid event-item restore against an available authority.

**Scope boundary:** An explicit selected event-item restore, separate from chapter-only restoration. Event restoration may explicitly change the selected event’s date/content; chapter restoration still never does. No chapter date shifting, automatic shared-record rollback, decision-item restore, event deletion or universe recovery from ZIP. Eligible existing event kinds and partial dependencies follow their accepted contracts rather than inferred universal rules; a background event remains the same canonical record in character and timeline views.

**Verification:** Restore a standalone Universe Event, linked main event, flashback and eligible background/birth record under the accepted scope. Verify canonical identity, historical preview, confirmed date/content, optional maker/decision links, shared-project refresh and unchanged chapter manuscript/start/end values. Capture current edits in Replaced and restore its event through the same workflow. Check accepted depiction/background/birth/result-link scope and both-kind resolution consistency without unapproved dependent rollback. Restore after a calendar-format change and verify the update flag/history association plus agreed date interpretation/clearing. Exercise manual keep/use/combined review, identical-record bypass, missing/foreign dependencies, pending-save/Replaced failure, canceled/resumed review, intervening live writes and publication interruption/restart. Preserve retained history, valid references and one universe authority.


**Accepted saved-category folder amendment:** Every category/type of saved object must have its own folder within its owning project or universe storage root. For example, timelines are saved under a timelines folder and characters under a characters folder; the same separation applies to other saved object categories, including categories introduced later. These folders must contain the actual saved category content, not merely empty labels around a database that holds all category content elsewhere. Folder names in these examples express the required separation; exact names, nesting and file formats remain DEC-33.

Complete ZIP backups must include these category folders and their saved content, together with retained history, required assets, manifests and reference closure. Category folder organization applies to live saving as well as archive organization. Preserve project/universe ownership boundaries, stable UUIDs, one live universe authority, exact immutable historical versions, protected dependencies and within-store/within-ZIP content reuse. Category folders do not imply that every decision type or chapter depiction role gets its own storage category, nor that a second authoritative copy is created in another unit.

This later user requirement takes precedence over an interpretation of AD-10 in which all object categories exist only as tables in one database file. DEC-33/TECH-01/02/09/11 must reconcile category content files/folders, database/index responsibilities and authoritative representation before affected persistence or backup implementation. No choice of one database per category, one file per object, JSON files, duplicated authoritative snapshots or an automatic database replacement is implied. Capture/publication, migrations, restoration and cleanup must consistently cover whatever category files and database/index state that accepted design requires.

Earlier approved storage/capture/history stories, including owning-unit storage in Epic 1 and Story 5.1, must satisfy this category-folder contract before implementation. Proposed Story 5.5 includes packaging and validating those actual category folders. Later restoration/recovery/export/cleanup stories must handle their identities and content consistently. Older database-only storage wording does not override this amendment. Story 5.5 remains proposed; approved count stays 41.


### Story 5.5: Create independent complete project and universe ZIP backups

As Jo,
I want to create a complete backup of a project or standalone universe in a folder I choose,
So that its saved content, images and retained history are available even if the original stores are lost.

**Acceptance Criteria:**

**Given** a project and its authoritative universe are available,
**When** I request a manual project backup,
**Then** required pending manuscript edits are durably saved before a coordinated consistent capture,
**And** one independently complete ZIP contains the project’s saved database state, retained revisions and required immutable content/images,
**And** it also contains the authoritative universe recovery snapshot and complete required historical dependency closure,
**And** project/story/volume/chapter/manuscript/plot data, calendar associations, character/faction/event/decision content, added type definitions/assignments, optional makers and both decision-result relationship kinds are preserved according to their accepted ownership/reference contracts,
**And** persisted calendar-update flags and context/filter settings are included where adopted under their owning capture contract.

**Given** SQLite or a similar database stores project or universe state,
**When** the unit is saved and backed up,
**Then** its live database files reside in their own dedicated database subfolder inside that unit’s data folder tree, alongside other category folders,
**And** every complete ZIP includes the dedicated database folder with a consistent recoverable database copy together with other category folders, objects, assets and retained history,
**And** no separate database-export action is required for database inclusion in a backup,
**And** complete backup validation fails if required database state is absent or inconsistent with the captured category content.

**Given** timelines, characters or any other saved object category exist,
**When** the application saves them in their owning project/universe unit and captures that unit for backup,
**Then** each category’s actual saved content resides in its own category folder under the accepted DEC-33 layout,
**And** timeline content is grouped in a timelines folder and character content in a characters folder, with equivalent separation for other categories,
**And** the complete ZIP includes the category folders and their saved content, required retained versions/assets and manifest/database/index state,
**And** empty placeholder folders or archive-only category labels do not satisfy the live-save requirement,
**And** the adopted representation preserves UUIDs, one authority, immutable versions, protected dependencies and content reuse without creating duplicate authoritative category copies.

**Given** a standalone authoritative universe is available without a project,
**When** I request a manual universe backup,
**Then** one complete ZIP includes its consistent saved database state, retained universe history and all required content/images/reference closure,
**And** no project, manuscript or project database is required,
**And** an embedded universe snapshot in a project ZIP does not count as a standalone-universe backup.

**Given** I choose a backup destination,
**When** I select an available folder, including an available external drive,
**Then** the archive is written there independently of the live project/universe folders,
**And** live logical identities and managed relative asset references are preserved,
**And** choosing a backup location does not move live data or create another universe authority.

**Given** the destination is unavailable before or during the manual attempt,
**When** the application cannot complete there,
**Then** I am prompted to select another folder,
**And** canceling that selection skips only the current attempt, reports it incomplete and offers retry,
**And** cancellation preserves the configured destination for future attempts,
**And** no close-time fallback is silently substituted for this manual cancellation path.

**Given** the archive is assembled,
**When** its immutable content and manifests are written and validated,
**Then** shared content is stored once within that complete ZIP and unchanged owning-store content remains reusable,
**And** each ZIP is independently complete even if that duplicates content across different ZIPs,
**And** exact retained revision content resolves without replaying older revision manifests or reading another archive,
**And** staged validation can resolve the captured database/manifests and required content with original-store and other-ZIP access unavailable,
**And** this validation does not activate recovered data or replace the live authority.

**Given** the ZIP is ready for completion,
**When** its final filename is assigned,
**Then** a project ZIP is named `<ProjectName>_<UniverseName>_YYYY-MM-DD_HH-mm-ss.zip` and a standalone-universe ZIP `<UniverseName>_YYYY-MM-DD_HH-mm-ss.zip`,
**And** the timestamp is local real capture-start time in 24-hour format to seconds, with safe display-name characters and `_2`, `_3`, etc. suffixes before `.zip` on collision,
**And** project ZIPs contain all volumes without listing individual volume names in the filename,
**And** the same shared naming rule applies to every backup trigger and post-reconciliation archive,
**And** filename handling follows DEC-35’s accepted timezone/template/name/collision rules without overwriting a completed archive,
**And** original names, UUIDs and authoritative timestamps remain in the manifest independently of the filename.

**Given** consistent capture, writing and completion validation succeed,
**When** the ZIP is durably published,
**Then** the application reports its completed status and actual location,
**And** completion/identity metadata makes it discoverable for later independent recovery and protected-backup accounting,
**And** only valid successfully completed archives count toward the per-project or standalone-universe protected set,
**And** the ten newest such archives per owning unit, or all if fewer, remain protected under the shared contract; this story introduces no archive deletion/expiry controls.

**Given** saving pending edits, capture, asset/reference inclusion, writing or validation fails, or the host stops during publication,
**When** the attempt is reported or reconciled after restart,
**Then** a partial archive is not presented as a valid completed backup or counted toward the protected set,
**And** previously completed backups and live/current/retained dependencies remain intact,
**And** the application reports the real save/capture/backup outcome without claiming success and offers retry under the accepted error contract,
**And** retry/publication uses the shared operation identity/recovery rules without corrupting an existing completed ZIP.

**Requirements:** FR-23 independent complete project/standalone-universe backups; FR-24 manual trigger; FR-25 destinations/outside-close cancellation; FR-21 within-ZIP reuse; FR-19 valid-completion accounting/ten protected archive contract; supporting FR-18/20/22 and adopted capture/authority/typed-content contracts; CAP-10; AD-3/4/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** DEC-35 template/local capture-start clock/numbered collisions/project-wide volume label rules are settled; exact filename normalization and atomic reservation remain shared technical details. Approved Epics 1–4 and Stories 5.1–5.4 only. Resolve DEC-33 category-folder layout/content formats and database/index authority responsibilities before affected implementation; the later live-category-folder contract takes precedence over prior database-only assumptions. TECH-01 versioned archive/database/category-file/manifest/reference schemas, TECH-02/03 crash-safe coordinated publication/consistent capture, TECH-04 writers, TECH-05 restart recovery, TECH-09 immutable object/history closure, TECH-10 archive discovery/protection identity and TECH-11 consistent SQLite snapshot handling must be settled before affected implementation. Reuse existing backup-destination settings and DEC-07 validation; PLAN-04 defines backup entry point, destination dialog, progress/outcome, unavailable-folder prompt and retry UI. DEC-11 performance and installed/native acceptance remain open. No later restore/cleanup/scheduled-backup story is needed to create and validate a complete manual ZIP.

**Scope boundary:** Apply the accepted shared live category-folder layout and package its actual content in manual independently complete project and standalone-universe archive creation with completion validation and protected-set metadata. User-facing recovery/import/activation, whole-project reconciliation, scheduled triggers, normal-close/fallback capture and retention/manual deletion follow separately and must reuse this pipeline. Backup is not manuscript/settings/database export. Historical embedded universe snapshots never become live authorities merely because a ZIP is created or inspected. Exact post-failure temporary-file cleanup is governed by publication/recovery contracts rather than invented here.

**Verification:** Save timelines, characters and other supported object categories and inspect actual live category folders; create the ZIP and verify their category paths/content and manifest resolution from that ZIP alone. Cover populated categories, added supported categories and identical display names across owning units without identity collisions, lost history or duplicate authoritative copies. Merely creating empty category directories must fail acceptance. Create project and standalone-universe ZIPs, including a universe with no project and a project sharing its universe with another project. Validate consistent captured database/reference closure with pending formatted writing, retained revisions, historical changed images, plots, custom decision types/optional makers/both relationship kinds and calendar-format associations/flags. Resolve exact revision content from one staged ZIP with original-store/other-archive access unavailable, without a user-facing restore dependency. Verify within-ZIP deduplication, independent later ZIP completeness, destination independence, external-drive paths and actual completion location. Exercise unavailable/disappearing destinations, alternate-folder cancellation, save/capture/write/validation failure and interrupted publication/restart/retry; previous valid backups survive and partial attempts never count toward protection. Later recovery/scheduling/close/retention stories must add end-to-end integration checks using this same archive contract.


### Story 5.6: Restore a whole project against its authoritative universe

As Jo,
I want to restore a complete project revision while reviewing differences against its live universe,
So that I can recover earlier writing and planning without silently replacing shared history or losing the work being replaced.

**Acceptance Criteria:**

**Given** a retained complete project revision is available,
**When** I select it for whole-project restoration,
**Then** I can identify/inspect its saved project/story/volume/chapter/manuscript/plot state and required pinned historical universe dependencies,
**And** its saved category files/folders, images, type definitions/assignments, optional makers and both decision-result relationship kinds resolve through the complete manifest,
**And** preview/staging leaves the live project and universe unchanged and does not activate a historical universe replica.

**Given** I confirm the restoration workflow,
**When** current work is prepared for replacement,
**Then** required pending edits are durably acknowledged and complete current work is captured in a viewable/restorable revision marked Replaced,
**And** the protected capture covers the actual current project and any authoritative universe state that confirmed recovery changes will replace,
**And** no replacement is applied if required pending saves or complete protective capture fail,
**And** the Replaced project can itself be selected later through this same protected whole-project restoration workflow.

**Given** the saved project refers to an available live universe,
**When** reconciliation compares saved dependencies with the current authoritative state,
**Then** matching UUIDs are compared within the owning universe using the accepted persisted-content comparison contract,
**And** differing records are presented for manual keep-live, use-recovered or edit-combined choices,
**And** identical records need no conflict review and unrelated live records remain unchanged,
**And** absence from the older project revision alone does not authorize deleting current universe records,
**And** confirmed shared-universe changes affect its single authority and the effect on other projects is made clear.

**Given** a required recovered reference is absent from the live universe,
**When** it is presented for resolution,
**Then** the agreed choices are restore the missing record from recovery content, link to an existing valid same-universe replacement or remove the reference,
**And** each choice must pass the accepted required-reference/type/ownership integrity contract before application,
**And** additional decision/type/maker/relationship dependencies follow the same shared-schema/reference rules under TECH-01/08,
**And** no activated project has dangling references and removing a live reference never deletes protected historical content.

**Given** the authoritative universe cannot be located or required reconciliation remains incomplete,
**When** activation is requested,
**Then** the restored project remains inactive and the missing-authority or unresolved-reference/conflict condition is reported,
**And** Jo can use the existing locate-authority path without silently creating a replacement,
**And** recovering a missing authority from a ZIP remains a separate later workflow, not a prerequisite for restoring this project against an available authority.

**Given** reconciliation has pending choices,
**When** I cancel or live universe content changes before application,
**Then** cancellation applies no proposed restoration changes and preserves the pending restoration/review work for resumption,
**And** before commit a race-free freshness check requires renewed review only for affected conflicts while retaining unaffected choices,
**And** current state actually replaced by the final commit has a valid fresh Replaced capture,
**And** stale choices are not silently applied to newer live records.

**Given** confirmed reconciliation passes protection, freshness and integrity validation,
**When** restoration is committed through the coordinated publication contract,
**Then** the restored project is updated to reference the reconciled authoritative records and becomes eligible for activation only after required reconciliation is complete,
**And** category folders/actual content and required database/index state follow the accepted DEC-33 layout and preserve identities, assets and retained immutable history,
**And** plots remain story-owned, chapter fields remain independent and faction affiliation history stays character-sheet-only,
**And** decision status derives from surviving outgoing event or decision links and agrees across tree/context/unresolved lookup,
**And** whole-project recovery applies only explicitly confirmed universe changes; it does not introduce chapter-driven event edits or change chapter-only restoration isolation.

**Given** restored data’s saved calendar format/configuration differs from the current authoritative calendar,
**When** the reconciled restoration is applied,
**Then** affected restored data is visibly flagged as needing a calendar-format update with its historical association retained,
**And** viewing/reopening alone does not clear that flag,
**And** DEC-32 governs update/confirmation/clearing and date interpretation without presuming automatic conversion, live-calendar replacement or a new blocking policy.

**Given** the restored project and reconciled universe have been committed,
**When** the post-restoration backup runs,
**Then** the application creates a new independently complete project ZIP using Story 5.5’s capture/category-folder/archive pipeline,
**And** the ZIP contains the reconciled project/universe and required retained history/images/reference closure,
**And** its actual completed location is reported,
**And** failed/skipped/incomplete ZIP creation remains visible and retryable rather than reported as a successful backup,
**And** restoration/reconciliation and backup outcomes are reported independently without assuming a silent rollback of committed restoration.

**Given** validation, publication or host execution fails,
**When** the operation is blocked or recovered after restart,
**Then** unresolved recovered state is not activated or reported as restored,
**And** coordinated commit/restart rules prevent partial project/universe/category-file publication,
**And** previous live/protected state remains recoverable and the actual failure is reported without inventing a second authority.

**Given** restored data is flagged for a calendar configuration/display-format mismatch,
**When** I choose Update to current calendar,
**Then** displayed dates are recalculated from the preserved elapsed positions using the current authoritative calendar,
**And** the affected flag clears only after updated current metadata is durably saved,
**And** failure leaves the flag visible with retry available,
**And** writing remains possible while flagged, without changing chronology, linked-event positions/content, source immutable history or the authoritative calendar.

**Requirements:** FR-3 whole-project restoration; FR-4 Replaced recovery; FR-18 pre-restoration capture; supporting FR-20/21/22/23 and current category-folder/calendar-format/authority contracts; CAP-9/10; AD-3/4/5/6/7/8/9/10/13/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.5 only. Reuse complete capture/history, manual conflict/freshness/replaced-state protection and complete ZIP creation rather than a later backup capability. TECH-01 comparison/identity/reference/manifest/category schemas, TECH-02/03 coordinated capture/publication, TECH-04 writers, TECH-05 resumable host recovery, TECH-06 version/equality metadata, TECH-07 race-free validation/commit, TECH-08 shared-reference/history integrity, TECH-09 immutable dependency closure, TECH-10 archive accounting and TECH-11 persistence/migrations apply. DEC-33 storage representation and DEC-32 calendar-update workflow are accepted; shared physical schemas/coordination remain technical gates; retain existing DEC-15/26–30 record/link/type/association gates. PLAN-04 covers whole-project preview, staged inactive state, conflicts/missing references, confirmation/cancel-resume, calendar flags and independent restore/ZIP outcomes. No later disaster-recovery, scheduler, close or retention story is required to restore against an available authority and create its reconciled ZIP.

**Scope boundary:** Whole-project restoration from a retained complete revision against an available authoritative universe, with complete manual reconciliation and post-restoration ZIP. This differs from chapter-only restore: historical universe dependencies can change only through explicit confirmed reconciliation, never automatic chapter restoration. ZIP import/authority establishment after original-store loss follows separately; user-facing restoration of standalone decisions/types is not introduced as a new partial-item feature. Missing-reference choices may not bypass required maker/type/reference validation.

**Verification:** Restore a prior multi-story/volume manuscript/plot revision with changed current universe content and shared projects. Exercise identical records, differing character/event/decision/type/maker/relationship state and unrelated newer universe records; verify manual keep/use/combined results and no deletion based on historical absence. Test missing-reference restore/relink/remove under accepted validation, saved category folders and exact required images/history. Recover the replaced project through the same workflow and verify fresh Replaced protection. Cancel/resume review, change live state mid-review and verify affected-only rechecks and no stale commit. Restore after a calendar-format change and verify pending-update flags. Confirm correct canonical links and resolution across timeline/tree/context/lookup, then validate the new independent reconciled ZIP. Exercise unavailable authority, failed pending-save/Replaced capture, corrupt/incompatible dependencies, publication interruption and post-commit ZIP failure/cancellation/retry; distinguish restore and backup outcomes and preserve recoverable state/one authority.


### Story 5.7: Recover a project or standalone universe from one complete ZIP

As Jo,
I want to recover a project or universe from a single complete backup ZIP after losing its original stores,
So that I can resume writing with saved content, images and retained history intact.

**Acceptance Criteria:**

**Given** one complete project ZIP is available and the original project/universe stores and other ZIPs are unavailable,
**When** I select it for recovery,
**Then** its project state, universe recovery content, retained revisions, category folders and required images/immutable reference closure can be recovered from that ZIP alone,
**And** I can inspect the archive’s owning identities and select live project/universe destination folders independently of the backup destination,
**And** recovery preserves permanent UUIDs and logical ownership rather than using old absolute folder paths as identities.

**Given** a standalone universe ZIP is available with no project,
**When** I recover it,
**Then** its saved content, category folders/assets and retained universe history are recoverable without requiring a project or original universe store,
**And** no project is silently invented,
**And** the recovered universe is established or reconciled as the single authority for that identity.

**Given** a ZIP is selected,
**When** it is validated and staged before activation,
**Then** manifest/schema/content/reference completeness and supported versions are checked,
**And** archive extraction and saved references are validated/confined to managed staging/live roots under the shared import contract,
**And** invalid, incomplete, incompatible or unsafe archive content is rejected without changing live stores or blindly rewriting unsupported schemas,
**And** category folder content and required database/index state follow DEC-33 rather than assuming one database file contains every saved object,
**And** the source archive remains available and staging does not create an active authority.

**Given** the live authority for the archived universe identity is missing,
**When** I confirm establishing it from valid recovery content,
**Then** the recovered universe identity is registered at the selected live location through the common identity/location/writer contracts,
**And** required current and retained historical content/assets are available there,
**And** a recovered project stays inactive until that authority and its references are valid,
**And** a backup snapshot or pinned historical checkpoint is not registered as an additional authority.

**Given** an authoritative universe with the same identity already exists or becomes available during recovery,
**When** recovered content is reconciled,
**Then** manual keep-live, use-recovered or edit-combined choices use the same record-comparison/freshness contracts as Stories 5.3–5.6,
**And** identical records need no review while unrelated live content is preserved,
**And** missing references use explicit restore/relink/remove choices subject to accepted required-reference/type validation,
**And** recovery never creates a competing live copy or automatically selects an archive by filename/timestamp as the conflict winner,
**And** changed category/type/maker/decision relationships remain valid under the current accepted integrity contracts.

**Given** existing current project/universe work will be replaced,
**When** confirmed recovery changes are prepared for commit,
**Then** required pending edits are durably acknowledged and actual current state is captured in a complete viewable/restorable Replaced revision before replacement,
**And** failure of either step blocks replacement,
**And** no fictitious current revision is required for stores genuinely absent after loss,
**And** a race-free freshness/authority check prevents stale review or a second authority between validation and commit.

**Given** I cancel reconciliation, required review is incomplete or a live record changes while review is pending,
**When** the recovery workflow pauses or resumes,
**Then** proposed changes are not applied and the recovered project remains inactive,
**And** pending recovery/review work is preserved for resumption,
**And** intervening changes require renewed review only for affected conflicts with unaffected choices retained.

**Given** a valid recovery is confirmed and required reconciliation/protection succeeds,
**When** coordinated publication completes,
**Then** the selected live stores/category folders resolve their current and retained saved content, images and references consistently,
**And** recovered project manuscript formatting, plots, volume/story order and valid canonical universe references survive reopen,
**And** type definitions/assignments, optional makers and both decision-result link kinds produce the same authoritative tree/context/unresolved status,
**And** affiliation history remains character-sheet-only and independent chapter/event dates retain their accepted meaning,
**And** a recovered project is activated only after required authority/reference reconciliation is complete.

**Given** restored data’s saved calendar format/configuration differs from the authority established/reconciled for recovery,
**When** that data is recovered,
**Then** affected data is visibly flagged as needing a calendar-format update with its historical association retained,
**And** opening/reopening alone does not clear the flag,
**And** DEC-32 governs update/confirmation/clearing and date interpretation without silently replacing the chosen authoritative calendar or assuming automatic conversion.

**Given** project recovery/reconciliation has committed,
**When** the required new reconciled project ZIP is created using the existing complete backup pipeline,
**Then** it captures the recovered project with the reconciled universe and required retained history/assets/reference closure,
**And** recovery and backup outcomes are reported independently,
**And** failed/skipped/partial ZIP creation remains visible/retryable and never counts as a completed backup.

**Given** staging, protection, storage publication or host execution fails,
**When** failure is reported or restart recovery runs,
**Then** no incomplete recovered project is falsely activated or reported as recovered,
**And** existing valid live data, retained/protected state and the source archive remain safe under the publication/restart contract,
**And** recovery resumes or retries according to its durable operation identity without silently forking authority or leaving partially published category/reference state.

**Given** restored data is flagged for a calendar configuration/display-format mismatch,
**When** I choose Update to current calendar,
**Then** displayed dates are recalculated from the preserved elapsed positions using the current authoritative calendar,
**And** the affected flag clears only after updated current metadata is durably saved,
**And** failure leaves the flag visible with retry available,
**And** writing remains possible while flagged, without changing chronology, linked-event positions/content, source immutable history or the authoritative calendar.

**Requirements:** FR-23 independent project/standalone-universe disaster recovery; supporting FR-3/4/18/20/21/22/25 and current authority/category-folder/calendar-format contracts; CAP-9/10; AD-3/4/5/6/7/8/9/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.6 only. Reuse complete ZIP validation/capture, current/retained manifest resolution, protected replacement and manual project/shared-record reconciliation. TECH-01 versioned import/manifest/comparison/identity/reference/category contracts, TECH-02/03 crash-safe capture/publication, TECH-04 writer/authority coordination, TECH-05 durable restart/cancel-resume, TECH-06 recency/equality/divergence metadata, TECH-07 race-free review/commit, TECH-08 retained/current shared integrity, TECH-09 immutable historical closure, TECH-10 archive identities and TECH-11 installed persistence/migrations apply. DEC-32 update behavior and DEC-33 storage representation are accepted; exact comparison/category schemas and coordinated publication remain technical gates. Existing required maker/type/link/association validation remains applicable. PLAN-04 covers select/inspect ZIP, destination selection, missing-authority establishment, existing-authority conflict review, inactive staging, confirmation, resumable cancellation and independent recovery/backup errors. No later scheduler/close/cleanup story is needed to recover one valid ZIP.

**Scope boundary:** User-facing recovery from one independent complete project or standalone-universe ZIP, including missing-authority establishment or existing-authority reconciliation. No hosted service, archive-chain reconstruction, silent overwrite, duplicate authority, automatic calendar-format conversion or arbitrary additional export format. Retained history is recovered as historical content, not multiple live replicas. Recovery from a project ZIP does not demand a separate standalone-universe ZIP.

**Verification:** Remove access to original stores and every other ZIP; recover one project ZIP and independently one standalone-universe ZIP with no project. Verify categories/actual saved files, required database/index state, current/revision manuscript/images/plots and universe/type/maker/relationship closure after reopen; recover a retained chapter/character/event revision using earlier workflows. Test changed destination paths with stable UUIDs, missing-authority establishment and an existing same-identity authority with manual differences/missing references. Exercise Replaced protection where live state exists, cancellation/resumption, live changes mid-review and authority discovery races. Verify old-calendar update flags only where mismatch exists under DEC-32. Reject incomplete/corrupt/unsupported/unsafe archive paths without live mutation. Interrupt extraction/publication and retry/resume under the adopted protocol; preserve source/protected history and one authority. Confirm required new reconciled project ZIP and distinguish its failure from a committed recovery.


**Accepted ZIP filename amendment:** Every completed backup ZIP must have a readable filename containing a real-world date and time stamp plus the relevant universe, volume and/or project name so Jo can recognize its contents. Apply the same naming contract to manual, scheduled, normal-close/fallback and post-restoration/reconciliation ZIPs. Standalone universe ZIP names identify their universe; project ZIP names identify their project with applicable universe/volume context. Naming must accurately describe the archive’s scope; mentioning volumes does not itself introduce a new volume-only backup product or change complete project/universe capture scope.

Filenames must remain valid on supported operating systems, and distinct completed backups must not overwrite one another when names/timestamps coincide. Archive manifests preserve original display names, owning UUIDs and documented real capture/completion timestamps; filenames are labels, not authority identity, conflict precedence or the sole basis for retention/protected-backup accounting. Fictional calendar dates do not supply the backup timestamp.

DEC-35 must settle the exact filename template, timezone and timestamp semantics/precision, filename-safe display-name handling, collision suffixes and volume/hierarchy representation for projects with zero/one/multiple volumes. These implementation details do not postpone the accepted requirement for recognizable owner names plus date and time in every completed ZIP filename.

The maintained Story 5.5 filename criteria now cover the shared archive pipeline; proposed Story 5.8 verifies scheduled naming. Later normal-close/fallback archives and existing post-reconciliation ZIP flows use the same naming contract. Story 5.8 remains proposed; approved count stays 44.


### Story 5.8: Create complete backups on an independent configurable schedule

As Jo,
I want complete project and standalone-universe backups to run at a configurable interval,
So that recovery archives stay current without requiring a manual backup each time.

**Acceptance Criteria:**

**Given** scheduled-backup settings have not been customized,
**When** the application schedules each open project and each independently opened standalone universe, keyed by owning identity,
**Then** the backup interval defaults to 10 minutes,
**And** this is independent of 5-minute autosave and 10-minute revision capture,
**And** a project ZIP’s embedded universe snapshot does not count as a separately scheduled standalone-universe backup.

**Given** I save a valid changed backup interval in existing settings or import accepted exported settings,
**When** the change is durably acknowledged,
**Then** that unit’s timer uses the durably saved interval and restarts when it changes,
**And** opening an eligible unit starts its backup timer,
**And** its value survives reopen and settings export/import,
**And** configuring backup timing does not change autosave/revision intervals or the independent live-storage locations,
**And** invalid input follows DEC-07 rather than silently adopting an unaccepted value.

**Given** a scheduled attempt becomes due,
**When** backup capture executes,
**Then** it uses Story 5.5’s complete independent ZIP pipeline rather than a reduced scheduled format,
**And** required pending manuscript edits are durably saved before consistent capture,
**And** the ZIP includes actual category folders/content, required database/index state, retained history, images and complete current/historical reference closure,
**And** UUIDs, one authority and exact retained immutable content remain valid,
**And** overlapping scheduled/manual/revision work uses the accepted writer/capture coordination contract rather than inconsistent simultaneous publication.

**Given** the configured destination is unavailable when a scheduled backup is attempted,
**When** that attempt cannot complete there,
**Then** I am prompted to select an alternative folder,
**And** canceling selection skips only that attempt, shows it incomplete with a retry option and preserves the configured destination for later attempts,
**And** it does not silently disable later scheduling or invoke normal-close fallback,
**And** only one alternative-folder prompt is shown at a time, with no duplicate prompt stack or burst of replayed missed attempts,
**And** pending due/retry work uses the shared serialized job contract.

**Given** a scheduled ZIP is successfully published,
**When** I inspect its saved filename,
**Then** it uses the accepted project/universe-name template with local capture-start `YYYY-MM-DD_HH-mm-ss` and filesystem-safe names,
**And** it uses the same naming contract as manual, close-time/fallback and post-reconciliation ZIPs,
**And** existing-name collisions add `_2`, `_3`, etc. before `.zip` without overwriting; project-wide ZIPs do not list volume names,
**And** the manifest retains original display names, UUIDs and capture/completion metadata rather than treating the filename as identity.

**Given** scheduled backup capture and validation succeed,
**When** the complete ZIP is durably published,
**Then** the application records/reports its actual completion and location using the same outcome contract as manual backups,
**And** only valid successfully completed ZIPs count toward the protected per-project/standalone-universe set,
**And** failed, canceled and partial attempts do not displace protected completed archives or damage earlier backups.

**Given** the system sleeps/resumes, the interval changes, an attempt fails or the host restarts,
**When** scheduled execution continues,
**Then** one overdue attempt runs after sleep rather than replaying missed intervals,
**And** captures do not overlap; failure shows a warning, preserves prior valid work/archives and offers Retry now plus retry at the next backup interval,
**And** durable operation/restart recovery follows the shared contracts,
**And** failure does not falsely mark pending work saved or a ZIP complete,
**And** existing current/retained dependencies and completed archives remain protected,
**And** distinct save/revision/backup outcomes remain truthful and visible.

**Requirements:** FR-24 scheduled complete backups; FR-25 destination/alternative cancellation; supporting FR-19/21/23/28/29/43 and independent interval/category-folder/capture contracts; CAP-10/12; AD-3/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.7 only. Reuse Story 5.5 ZIP creation/validation, settings import/export and common capture/publication/error contracts. DEC-34 is resolved: open project/independently opened standalone-universe jobs, independent default 10-minute open/change timer, single overdue resume, no overlap, warning with next-interval/Retry-now, one destination prompt at a time and attempt-only cancellation. Exact serialized job/publication/restart implementation stays in the technical contracts. DEC-35 filename template, local capture-start clock and numbered collision/project-wide naming rules are accepted; shared technical contracts define safe normalization/reservation. DEC-07 validates settings; DEC-15 protects pending writing. TECH-01 shared contracts, TECH-02/03 consistent capture/publication, TECH-04 writers, TECH-05 host recovery, TECH-09 protected manifests, TECH-10 archive discovery/accounting and TECH-11 persistence apply; DEC-33 category layout remains binding. PLAN-04 captures schedule configuration, status/progress, destination prompt, skipped-attempt/retry and error visibility. Autosave DEC-17 and revision DEC-31 do not automatically determine backup cadence. No later close/fallback or cleanup story is needed for this schedule.

**Scope boundary:** The scheduled trigger/settings integration for existing complete project and standalone-universe backups. No cloud service, operating-system backup daemon while the application is closed, new archive format, new disable/default policy, close-time fallback or archive deletion. Eligible units are open projects and independently opened standalone universes; closed known projects or merely embedded universe dependencies do not gain separate standalone jobs. Later normal-close capture and retention reuse this same pipeline/outcome metadata.

**Verification:** Open/close eligible units and verify one job per owner, no job for a closed known project or merely dependency-loaded universe, and an independent standalone job when that universe is explicitly opened. Use controlled time to verify open/change timer, single overdue resume, no overlap, warning/preserved work plus next-interval/Retry-now. Hold a destination prompt while more attempts become due and verify one prompt without replay bursts; cancel and verify destination/schedule remain intact. Check completed scheduled filenames contain the correct owner names and real date/time; exercise names needing filename-safe representation, matching timestamps and projects with the accepted volume configurations under DEC-35. Ensure naming matches the manual pipeline and preserves manifest identity/protection metadata. Run default and changed valid backup schedules and settings export/import/reopen while confirming autosave/revision independence. Validate a scheduled project ZIP and a scheduled standalone-universe ZIP under accepted unit eligibility, including actual category folders/content, pending writing, retained images/history and references; recover from a scheduled ZIP with Story 5.7. Exercise shared universes without miscounting embedded snapshots as standalone backups. Verify unavailable/disappearing destinations, alternative-folder cancellation, retry and the preserved configured destination/later scheduling. Exercise accepted sleep/resume, missed ticks, interval changes, long captures, overlapping manual/revision work and host interruption/restart. Fail save/capture/write/validation and confirm no false completion, lost dependencies or protected-set displacement. Later normal-close/cleanup stories add their own integration checks.


### Story 5.9: Finish normal close with complete revisions and backups, including fallback recovery

As Jo,
I want normal application close to save current work, capture revisions and create complete backups even when my usual backup destination is unavailable,
So that closing the application preserves my work and tells me where fallback backups were saved.

**Acceptance Criteria:**

**Given** I request normal application close with current project/universe work open,
**When** coordinated shutdown begins,
**Then** required pending manuscript edits are durably acknowledged before closing capture,
**And** complete normal-close revisions use Story 5.1’s manifest/checkpoint/protected dependency contract,
**And** complete normal-close backups use Story 5.5’s independent project/standalone-universe ZIP contract for the units required by the accepted lifecycle scope,
**And** this capture does not rely on waiting for a scheduled autosave, revision or backup tick.

**Given** manual/scheduled captures or authoritative writes are still in progress,
**When** normal-close capture runs,
**Then** TECH-02/03/04/05’s serialized, consistent shutdown-draining contract coordinates them and any remaining pending edits,
**And** current category files/folders, required database/index state, retained revisions, images and historical references are captured consistently,
**And** no process holding required state is terminated before the close contract has completed its required work,
**And** eligibility of multiple open projects/shared universes and handling further input follow the accepted TECH-05/PLAN-04 lifecycle contract rather than an invented duplicate-job policy.

**Given** the configured close-time backup destination is available,
**When** the complete ZIP is published and validated,
**Then** it uses the configured destination and the shared relevant-name/date/time filename contract,
**And** only a valid durably completed archive is recorded as successful and counted toward protected-backup accounting,
**And** a successful normal-close outcome requires completion of the required saves, revisions and backups before close finishes.

**Given** the configured destination is unavailable at normal close,
**When** backup cannot complete there,
**Then** I am prompted to select another folder, including an available external-drive folder,
**And** selecting an available alternative completes the required backup through the same ZIP pipeline,
**And** canceling this folder selection follows the normal-close fallback below rather than merely skipping the required attempt.

**Given** I cancel alternate-folder selection during normal close,
**When** fallback capture is prepared,
**Then** the application creates a new backup folder under the application root if writable,
**And** if that location is not writable it creates the fallback under user-data,
**And** the complete required ZIP backup is saved/validated there before successful close finishes,
**And** each completed ZIP uses the accepted project/universe-name template, local capture-start date/time and numbered collision suffixes under DEC-35,
**And** actual fallback location and the need to choose a new destination are durably recorded for the next launch.

**Given** the previous normal close used a fallback location,
**When** I next launch the application,
**Then** it identifies the actual folder used and requests a new backup destination,
**And** the notification resolves persisted actual-location metadata rather than guessing from the installation path or filename,
**And** further destination selection/cancellation and persistence follow the accepted DEC-08/TECH-05/PLAN-04 lifecycle rules without silently losing fallback archive discovery or protection.

**Given** pending-save, revision, backup/fallback write or validation fails, or the host stops during shutdown,
**When** the close operation reports failure, retries or is recovered after restart,
**Then** failed work is not labeled as successful saving, revision capture or completed backup,
**And** any required close-save/revision/backup failure, including both fallback locations, keeps the application open and preserves pending edits and completed work,
**And** I can Retry, Choose another backup folder where applicable, or Cancel closing and return to the workspace,
**And** normal close completes only after required saves/revision/backup succeed, with no silent discard or forced-close override,
**And** durable current/protected work, valid earlier archives and actual completion/location state remain recoverable,
**And** a partial ZIP is not counted as successful or allowed to displace protected completed archives.

**Requirements:** FR-18 normal-close complete revisions; FR-24 normal-close complete backups; FR-25 unavailable-destination selection; FR-26 canceled-folder fallback and next-launch notification; supporting FR-19/20/21/22/23 and shared category-folder/naming/capture contracts; CAP-9/10/12; AD-3/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.8 only. TECH-05 must define shutdown scope/draining, cross-session ownership, host restart and lifecycle state, implementing accepted DEC-08 failure behavior (remain open; preserve work; Retry/alternative backup folder/Cancel closing; close only after required success), with next-launch handling captured under PLAN-04. TECH-01 typed lifecycle/manifest/location/error schemas, TECH-02/03 consistent capture/publication, TECH-04 writer coordination, TECH-09 protected immutable state, TECH-10 archive discovery/protection across fallback destinations and TECH-11 persistence apply. Reuse DEC-15 pending edits, DEC-33 category layout and DEC-35 archive naming, plus DEC-07 settings validation; DEC-34 scheduling does not silently decide close scope. PLAN-04 captures close progress/errors, alternate-folder prompt, fallback status and next-launch destination notification/selection. No later retention/manual-delete story is required for a successful normal close with complete captures.

**Scope boundary:** Normal-close saving/revision/backup coordination and the agreed fallback/next-launch workflow. No guarantee of running shutdown callbacks on abrupt power loss or process termination, no hypothetical force-close override and no change to manual/scheduled cancellation: outside close, canceling another-folder selection still skips only that attempt and preserves destination. Normal-close capture preserves standalone-universe independence and does not treat embedded universe snapshots as standalone backups. No archive deletion/expiry controls are introduced here.

**Verification:** Close with pending formatted writing newer than the last autosave and verify exact content in a completed revision and independently recoverable complete ZIP; cover required project/standalone-universe units under accepted lifecycle scope. Check category files/assets/retained closure, filename/actual location and coordination with in-flight writes/manual/scheduled attempts. Exercise unavailable destination, accepted alternative folder, canceled selection with writable application-root fallback and unwritable application-root with user-data fallback. Relaunch and verify actual fallback-folder notification/new destination request and protected archive discovery. Fail pending saves, revision capture, primary/fallback writes, validation and both fallback locations; verify the app remains open with edits/completed work retained and Retry/alternative folder/Cancel closing available; finish close only after required success without false success. Interrupt shutdown stages and verify durable recovery/location state and source/protected work survive. Retest outside-close cancellation to ensure it does not invoke this fallback.


### Story 5.10: Apply time-based retention and safe manual deletion

As Jo,
I want old revisions and backup ZIPs cleaned up under configurable retention while protected content cannot be deleted,
So that storage can be managed without losing current work or retained recovery options.

**Acceptance Criteria:**

**Given** retention has not been customized,
**When** automatic cleanup evaluates revisions and completed backup ZIPs,
**Then** the default retention period is 30 real elapsed days,
**And** I can configure an accepted retention value that survives reopen and settings export/import,
**And** expiry depends on elapsed age, never archive/store size or fictional calendar dates,
**And** eligible old entries are processed oldest first under the shared timestamp/clock contract,
**And** no minimum count of retained revisions is invented.

**Given** a project or standalone universe has valid successfully completed backup ZIPs,
**When** cleanup or application manual deletion is evaluated,
**Then** its ten newest such ZIPs are protected regardless of age,
**And** if fewer than ten exist all are protected,
**And** protection is calculated independently per project and per standalone universe,
**And** an embedded universe snapshot in a project ZIP does not replace a standalone-universe backup,
**And** canceled/failed/partial/invalid archives do not count toward the protected valid set.

**Given** a revision is selected for expiry or manual deletion,
**When** removal is committed,
**Then** only the selected eligible revision entry is removed and surviving retained revisions remain individually resolvable from their complete manifests without replay,
**And** immutable objects, images, category content, comparison/identity metadata and cross-unit checkpoints required by current content or any retained revision remain available,
**And** deleting a revision that shared content with another revision does not delete the remaining revision’s required content,
**And** Replaced revisions follow the same accepted retention/reference protection contract without assuming a new permanent exemption.

**Given** stored content has no remaining current or retained references,
**When** cleanup determines storage eligibility,
**Then** it may be reclaimed only under TECH-08/09’s accepted dependency/root and publication rules,
**And** no-reference status establishes eligibility without promising immediate physical deletion,
**And** live current/retained data cannot be removed because a single project stopped referencing shared universe content.

**Given** I manually select a revision or archive for deletion in the application,
**When** the request is validated and confirmed under PLAN-04,
**Then** the same protected-reference and protected-ten rules apply as in automatic cleanup,
**And** the application blocks protected removal and explains the reason,
**And** removing an eligible backup archive never deletes live project/universe files or assets,
**And** canceled deletion does not remove selected entries.

**Given** backup destinations have changed or archives were moved, including earlier close-time fallback folders,
**When** archive discovery and protection accounting run,
**Then** TECH-10’s identity/location contract evaluates known completed archives across those destinations without relying only on the currently configured folder or readable filename,
**And** moved/renamed archives do not silently lose logical owning identity or bypass protected-set membership,
**And** unavailable/uncertain archive locations are handled under the accepted discovery/protection contract rather than assumed absent to justify unsafe deletion,
**And** existing readable names/date/time and original manifest metadata remain labels/provenance rather than the sole authority for ownership or age.

**Given** a new revision/backup is published or restoration changes references during cleanup,
**When** deletion reaches commit,
**Then** the coordinated writer/root/publication contract revalidates affected dependencies and protected sets without racing authoritative writes,
**And** staged/in-progress capture or recovery content is protected under the accepted TECH-09 operation-root contract,
**And** no content needed by the committed current/retained state is reclaimed by a stale cleanup plan.

**Given** deletion fails, a destination disappears or the host stops during cleanup,
**When** cleanup reports its outcome or restart recovery runs,
**Then** it does not falsely report undeleted entries as removed,
**And** partial progress and resumable/retry behavior follow the accepted operation/metadata contract,
**And** current work, retained dependency closure and protected valid archives remain consistent and recoverable,
**And** no failed/partial backup is retroactively labeled valid to fill a protection count.

**Requirements:** FR-19 time-only retention/ten protected ZIPs; FR-20 retained no-replay revisions and manual deletion; FR-22 current/retained reference protection; supporting FR-21/23/28/29 and category-folder/naming/authority contracts; CAP-9/10/12; AD-3/4/6/8/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.9 only. TECH-08 shared-reference/history integrity, TECH-09 complete root/dependency graph, immutable identity/metadata and safe reclamation, and TECH-10 archive discovery/protection across locations must be settled before any deletion path. TECH-01 real elapsed timestamp/clock/schema/error contracts, TECH-02/04 coordinated serialized mutation, TECH-05 restart recovery and TECH-11 persistence/migrations apply. DEC-07 validates retention input; DEC-33 category layout and DEC-35 archive names are preserved. PLAN-04 specifies revision/archive selection, protection explanations, confirmation/cancel, cleanup outcome and unavailable-destination/error presentation. Cleanup cadence and clock-boundary/uncertain-location details must be documented in these shared contracts before implementation; this story does not silently choose them. No later export story is needed for safe retention.

**Scope boundary:** Application-managed time-based expiry, manual revision/archive deletion and eligible immutable-content reclamation with dependency/protected-set enforcement. Does not control someone deleting files outside the application, introduce size limits, guarantee immediate garbage collection, require ten revisions, permanently exempt every Replaced revision or weaken independent complete ZIPs. Category directories may be managed only while preserving their still-referenced content and the accepted category layout; deletion of an archive cannot cascade into live category storage.

**Verification:** Evaluate 30-day/default and changed valid retention, settings export/import, real elapsed age boundary under the documented clock contract and size-independence. Use fewer/exactly/more than ten valid ZIPs per project/standalone universe, equal-time cases under accepted ordering, embedded snapshots and failed/partial attempts; protect the correct sets for both expiry/manual deletion. Delete eligible revisions sharing images/documents/checkpoints and prove current/surviving histories remain exact and no-replay resolvable, including Replaced histories and cross-project references. Validate eligibility versus deferred reclamation and absence of a revision minimum. Move/rename destinations/archives, include fallback folders and unavailable locations under TECH-10. Exercise cancel/block/error paths, new capture/restoration racing deletion and crash/restart at removal/reclamation stages. Recover from surviving ZIPs and restore retained items after cleanup using earlier stories; live categories/assets must remain intact.

### Epic 5 planning completion and coverage

All ten stories are approved. They progress from complete scheduled revisions/history (5.1), protected chapter/character/event-item restoration (5.2–5.4), complete manual ZIPs (5.5), whole-project reconciliation/new reconciled ZIP (5.6), single-ZIP disaster recovery (5.7), scheduled backups (5.8), coordinated normal close/fallback (5.9) and safe retention/deletion (5.10). ZIP creation precedes project restoration so the required reconciled backup has no future-story dependency. Each story builds on earlier capabilities and explicitly tracked technical/product gates. Planning approval does not establish implementation readiness, runtime correctness or completed platform/recovery testing.

| Epic 5 primary requirement | Approved story coverage |
| --- | --- |
| FR-2 — Inspect/restore individual chapter, character and event revisions | 5.1 historical inspection; 5.2 chapter restore; 5.3 character restore; 5.4 explicit event restore |
| FR-3 — Restore/reconcile whole project and create new reconciled ZIP | 5.6, using 5.5 archive creation; 5.7 applies shared reconciliation to ZIP recovery |
| FR-4 — Capture and recover protected Replaced state | 5.2–5.4 selected items; 5.6 whole project; 5.7 where recovery replaces existing state |
| FR-18 — Complete revisions at all required triggers | 5.1 configurable scheduled/default 10 minutes; 5.2–5.4/5.6 pre-restoration; 5.9 normal close |
| FR-19 — Time-only retention and ten protected valid ZIPs | 5.10 cleanup/manual protection; 5.5/5.8/5.9 valid-completion/protection metadata |
| FR-20 — Complete no-replay retained revisions and safe deletion | 5.1 complete manifests; 5.10 retained dependency/no-replay guarantees after removal |
| FR-21 — Reuse unchanged content | 5.1 within owning stores; 5.5 within each independently complete ZIP; 5.10 preserves shared content still needed |
| FR-22 — Protect active/retained references and historical assets | 5.1 capture roots; 5.2–5.7 recovery integrity; 5.10 cross-unit reference-safe reclamation |
| FR-23 — Independent complete project/universe ZIP and disaster recovery | 5.5 complete archives; 5.7 recovery from one ZIP without source stores/other archives |
| FR-24 — Manual/scheduled/normal-close complete backups | 5.5 manual; 5.8 independent configurable/default 10-minute schedule; 5.9 normal close; shared readable name/date/time filenames |
| FR-25 — Destinations/alternative selection/outside-close cancellation | 5.5 manual; 5.8 scheduled; 5.9 close-time alternative selection with separate fallback rules |
| FR-26 — Close fallback and next-launch actual-folder notification | 5.9 application-root then user-data fallback, completed save before successful close and new-destination request |

**Accepted amendments:** Every saved object category has its own live folder with actual category content, included in complete ZIPs; empty or archive-only labels are insufficient. Every completed ZIP identifies its relevant universe/volume/project names plus real date/time, using shared safe collision/identity rules. Restored data linked to an old calendar format/configuration differing from the current authority is visibly flagged for update, retaining its historical association; no automatic conversion or new blocking policy is inferred. Complete captures include required added decision types/assignments, optional maker references and both event-result/following-decision links. Chapter-only restoration never changes linked event dates/content; explicit event-item and confirmed whole-project/universe recovery remain separate. Character affiliation history stays only on character sheets. All 49 FR and 12 CAP identifiers remain stable.

**Open implementation gates:** TECH-01–11 shared schemas, category-file/database/index identity and migrations, consistent capture/publication, writer/authority coordination, host restart/shutdown, equality/version comparisons, freshness/commit, partial-item/reference scope, immutable protected roots and moved-archive discovery remain required before their affected implementation. DEC-08 close/fallback failure/retry, DEC-31 revision cadence, DEC-32 calendar mismatch/update/clearing, DEC-33 physical category layout/formats/authority, DEC-34 backup schedule eligibility/cadence and DEC-35 filename/timezone/collision/volume representation remain open. Retain DEC-07 settings validation and source-record DEC-19/22/24/26–30 rules where applicable. PLAN-04 recovery/error layouts, DEC-11 performance and installed-build acceptance remain unverified. Approval chooses none of the unchecked answers.

**Verification obligations:** Exercise the accepted failure/cancel/resume/concurrency/restart paths and source-store-loss recovery through the story verification cases; demonstrate protected current/retained closure after cleanup and actual valid ZIP recovery. These are required future checks, not test results from this planning session. Root VERIFY-01–12 and implementation tasks stay open.

**Later-epic obligations:** Epic 6 manuscript exports consume the same versioned manuscript contract for whole stories/selected chapters. Database export stays distinct from complete backup ZIPs and must reconcile the category-folder/database/index representation under DEC-33/TECH-13 without losing identity/reference consistency. Existing restoration/backup/cleanup flows must remain compatible with later export adapters.

**Next planning checkpoint:** Confirm moving to Epic 6, Export writing and database content. Step 3 remains incomplete until Epic 6 has approved stories; final validation and sprint planning have not run.


## Epic 6: Export writing and database content

Export whole stories or selected chapters as DOCX/PDF/MD/TXT and provide a distinct local database-export operation. Primary requirements: FR-27 and FR-49. Reuse shared manuscript/storage/capture contracts and preserve the later category-folder requirement without treating database export as a complete recovery ZIP.

### Story 6.1: Export a whole story or selected chapters as DOCX, PDF, Markdown or text

As Jo,
I want to export a whole story or selected chapters in DOCX, PDF, Markdown or plain-text format,
So that I can read and use my manuscript outside WritingTool.

**Acceptance Criteria:**

**Given** a story is selected,
**When** I open manuscript export,
**Then** I can choose DOCX, PDF, MD or TXT and either the whole story or selected chapters,
**And** all four formats support both scopes through the same selection/document workflow,
**And** the selected story/chapters and output format are clear before writing the output file,
**And** export is limited to one story at a time,
**And** export is disabled with an explanation if the story has no chapters or no chapters are selected.

**Given** the selected chapters have current manuscript edits,
**When** I confirm export,
**Then** the accepted current-work capture contract includes the intended current text/formatting rather than silently exporting only an older autosave,
**And** pending manuscript edits are saved before capture under DEC-15 and a save failure offers retry or cancellation,
**And** the document snapshot is consistent under concurrent edits and follows TECH-01/03’s versioned capture contract,
**And** a required save/capture failure is reported without claiming a completed export.

**Given** a valid whole-story or selected-chapter scope,
**When** the output document is assembled,
**Then** only that scope’s manuscript is included, without skipped or duplicated selected chapters,
**And** selected chapters retain the story’s chapter order regardless of selection order,
**And** chapter titles and manuscript text are included, including titles for empty chapters,
**And** dates, planning notes, characters and timeline context are excluded,
**And** DOCX/PDF start each chapter on a new page with its title; Markdown uses headings and TXT uses plain chapter titles,
**And** independent chapter dates and timeline/calendar sorting remain unchanged by exporting,
**And** universe context, decision trees, hidden/filter state and backup history do not silently become manuscript text.

**Given** the captured manuscript contains bold, italics, paragraph indents, headings and scene breaks,
**When** any format adapter produces output,
**Then** it consumes the same explicitly versioned WritingTool-owned manuscript contract used for persistence/revisions rather than saving a Lexical-specific payload as an export,
**And** DOCX/PDF preserve bold, italics, paragraph indents and headings with A4 pages, 2.54 cm margins, 12-point serif body text and 1.5 line spacing,
**And** Markdown uses Markdown bold, italics and headings, omitting paragraph indentation but preserving text and paragraph breaks,
**And** TXT uses plain titles/text with four spaces for indented paragraphs, preserves paragraph breaks and omits bold/italic markers,
**And** all four formats represent scene breaks as `***`,
**And** manuscript text and structural content are not silently omitted because a destination format lacks a rich-style feature,
**And** unsupported future/malformed document schemas fail safely without rewriting the source manuscript.

**Given** I choose where to export,
**When** Save As opens,
**Then** I can choose the folder and filename, initially suggested as `<StoryName>.<extension>` for a whole story or `<StoryName>_selected-chapters.<extension>` for selected chapters,
**And** filename-invalid characters are replaced and the extension matches the selected format,
**And** replacing an existing file requires confirmation; declining returns to Save As.

**Given** a supported local destination is selected,
**When** output conversion and file publication succeed,
**Then** the finished file is published only after conversion succeeds,
**And** the saved path is shown with Open file and Open folder actions,
**And** DOCX/PDF are converted headlessly using the bundled compatible LibreOffice runtime from a styled temporary document derived from the matched manuscript snapshot,
**And** MD/TXT use application-owned TypeScript serializers,
**And** the workflow operates locally without requiring a separate LibreOffice installation or hosted conversion service,
**And** it does not move live project/universe category files or alter manuscript content, links, dates, plots, revisions or backups,
**And** export presentation/library/runtime compatibility is verified in the required installed targets before acceptance.

**Given** I cancel scope/destination selection, select invalid data, encounter an unavailable destination or conversion/writing fails,
**When** the operation ends,
**Then** cancellation or failure is distinguishable from success,
**And** no partially generated file is reported as a completed valid export,
**And** source writing and required current/retained dependencies remain intact,
**And** any existing output is preserved if export fails,
**And** failure shows the error and offers Retry, Choose another location or Cancel.

**Requirements:** FR-27 all four formats and whole-story/selected-chapter scopes; supporting FR-1 manuscript content/formatting and adopted document/capture contracts; CAP-11; AD-1/3/11/12/13/18; NFR-1/2/3/6/7/8/9. DEC-11 governs quantitative performance acceptance.

**Dependencies:** Earlier approved manuscript/story/storage/settings/runtime capabilities, especially Stories 2.1–2.4 and the shared manuscript/capture contracts. No future database-export story is required. Apply approved DEC-06 one-story selection/order, empty-scope and pre-capture save rules above; apply approved DEC-06 formatting above and apply approved Save As/naming/replacement/publication/result rules above and use approved bundled LibreOffice for DOCX/PDF and application-owned TypeScript serializers for MD/TXT; verify exact runtime/version/packaging/fonts/conversion lifecycle under TECH-12 before installed acceptance. TECH-01 defines manuscript versions, export command/result/errors and consistent snapshot identity; TECH-03 protects intended current-work capture and TECH-04/05 apply where persistence/host lifecycle is involved. DEC-15 protects pending edits. PLAN-04 captures export format/scope selection, destination, progress/result/error/cancel/retry interactions. DEC-09/10 and TECH-12 govern installed/runtime dependency acceptance; DEC-33 storage/category layout remains binding without prescribing manuscript-export packaging.

**Scope boundary:** One user-facing manuscript export workflow with four adapters; all consume the same document contract and reuse selection/capture/publication handling. No manuscript import, whole-universe/decision-tree export, volume-only export, database/settings export or complete ZIP recovery feature. A backup ZIP’s required owner/date/time naming does not automatically dictate manuscript export naming. Earlier recovery/backup/retention remains unchanged and export does not count as a protected recovery archive.

**Verification:** Verify DOCX/PDF with bundled LibreOffice on a clean machine without a separately installed LibreOffice, isolation from an already open user LibreOffice session, conversion failure/cancellation and prior-output preservation. Check compatible runtime packaging/notices, fonts/Unicode, styles and pagination. Verify Save As suggestions for both scopes and all extensions, invalid-character replacement, overwrite confirmation/decline, preservation of prior output on conversion/publication failure, failure retry/location/cancel and successful saved-path/Open file/Open folder actions. Verify selection order does not override story order, empty chapters retain titles, no-chapter/no-selection export is disabled with explanation and pending-save failure offers retry/cancel without export. Export whole stories and non-contiguous selected chapters to each of DOCX/PDF/MD/TXT using representative manuscript text, Unicode, bold/italics, indents, headings and scene breaks. Open/inspect outputs with suitable format readers/parsers and compare expected text, chapter inclusion/order and DEC-06 format-specific representations; do not merely assert that files exist. Include pending changes newer than autosave, chapters with missing dates, empty/invalid selection under its accepted contract and concurrent edit/capture cases. Verify exports do not include excluded context/filter/history or mutate source records. Exercise canceled dialogs, unavailable destinations, accepted overwrite/collision behavior, conversion/write/publication failure and unsupported schema. Check local installed dependencies across the adopted platform matrix and performance against the agreed corpus before acceptance.


**Accepted database co-location/backup amendment:** If SQLite or a similar database is used, its live database files must be stored inside the same owning project or universe data folder tree as the other saved content/category folders. They must not exist only in a separate global application/cache location outside that data tree. Exact database filenames and placement within the owning tree remain part of the accepted DEC-33 layout.

Every complete ZIP backup must include a consistent recoverable copy of the database state together with the owning category folders, saved objects, images, retained history and all required dependencies. A project ZIP includes its project database and required universe database/recovery content; a standalone-universe ZIP includes its universe database without requiring a project. This applies to every backup trigger and post-reconciliation ZIP. Database inclusion is automatic as part of complete backup, not conditional on separately requesting database export.

Use the coordinated database/category-file snapshot contract to produce complete recovery content; an inconsistent raw copy of an actively changing database is not a successful backup. Store/index/provider choices and file layout must retain one live authority, stable identities and complete protected reference closure. This settles database co-location and ZIP inclusion; DEC-33/TECH-11 still govern physical layout/capture implementation and TECH-13 governs only the distinct database-export artifact, if provided.

Maintained Story 5.5 covers automatic complete-backup inclusion; earlier owning-store/revision stories and recovery validation must obey the shared co-location/capture rule. Proposed Story 6.2 records the distinction between guaranteed complete database backup and the separately specified export artifact. Story 6.2 remains proposed, approved count unchanged at 48.


**Dedicated database folder clarification:** The live SQLite or similar database must have its own dedicated database folder inside its owning project or universe data folder tree, alongside the other category folders. It must not sit loose at the data root or share a character/timeline/other object-category folder. Complete ZIP backups include that database folder and a consistent recoverable database copy with the other required category content, images and history. Exact folder name and database filenames remain DEC-33 implementation details; the dedicated subfolder requirement is settled.

This refines the accepted co-location requirement without adding a separate live authority or changing project/universe ownership. Story 6.2 remains proposed; approved total 48.


### Story 6.2: Export local database content through a separate consistent-export workflow

As Jo,
I want to export locally stored database content separately from manuscripts, settings and backups,
So that I can obtain the database-export artifact without changing live writing or creating another live universe authority.

**Acceptance Criteria:**

**Given** a supported local database export source is available,
**When** I open database export,
**Then** I select one owning project or standalone-universe catalog, with its source identity and catalog-only scope clearly shown in the center export surface,
**And** unavailable/unsupported sources explain why export is disabled,
**And** the output is a consistent `.sqlite` snapshot with the notice “Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.”,
**And** the operation is distinct from manuscript export, settings JSON and complete project/universe ZIP backup,
**And** it does not silently combine independent project/universe authorities or promise a full disaster-recovery archive.

**Given** SQLite or a similar database is used for the selected source,
**When** I locate its live storage or create a complete backup through existing backup workflows,
**Then** database files are in their own dedicated database subfolder inside the owning project/universe data folder tree, alongside the other category folders,
**And** every complete ZIP includes that database folder with a consistent recoverable copy of the database and the other required data,
**And** this backup inclusion requires no separate database-export request,
**And** the distinct export operation does not move the live database outside its owning data tree.

**Given** I choose a destination,
**When** Save As is shown,
**Then** it suggests a filesystem-safe `<SourceName>_catalog.sqlite` filename with matching extension,
**And** replacement requires confirmation and declining returns to Save As,
**And** the live catalog or another active source file cannot be used as the output destination,
**And** output is validated in a temporary artifact before publication, preserving an existing output on failure/cancellation.

**Given** export is confirmed,
**When** the saved source state is captured,
**Then** it follows TECH-13’s consistent SQLite/database-export contract and TECH-01/03/04’s shared schema/capture/writer rules,
**And** existing manuscript automatic-save and manual-editor Save/Discard/Cancel guards protect pending edits before capture,
**And** failed saves retain edits and block capture while Cancel preserves live state; exact saved-generation capture coordination remains technical work,
**And** concurrent writes cannot produce an inconsistent mixture of source states,
**And** pending-writing navigation and failures follow DEC-15 without discarding edits or falsely acknowledging saves.

**Given** category objects are stored in separate live folders under DEC-33,
**When** the export artifact is assembled,
**Then** the snapshot includes saved catalog IDs, ownership, relationships, schema/version information and stored relative object paths/root identities with accurate external-reference/dependency information,
**And** external JSON objects, WRT manuscript text, chapter-formatting JSON, images and revision/backup payloads are excluded,
**And** it does not assume all category content is still stored in one SQLite file,
**And** these external dependencies and exclusions are explained before confirmation and with the successful output, without presenting the catalog as an independent recovery archive,
**And** required IDs, ownership and supported schema versions remain accurate,
**And** no unselected unit’s data is silently included merely because records share display names or folder locations.

**Given** capture, artifact generation and validation succeed,
**When** output is durably published,
**Then** a validated consistent `.sqlite` catalog snapshot is published and its actual saved path, Open file and Open folder are shown,
**And** it can be inspected with the appropriate reader/validator for that accepted artifact format,
**And** the workflow operates locally through application-owned infrastructure ports,
**And** exporting does not mutate source category files, current records, images, retained history, relationships, dates or live-authority registration,
**And** it does not count as a completed protected backup ZIP merely because an output file exists.

**Given** a source schema/export version is unsupported or required capture/reference data is unavailable,
**When** export is validated,
**Then** the operation reports the incompatibility or missing requirement rather than blindly rewriting the source or silently producing a misleading artifact,
**And** accepted migrations/compatibility checks occur only under the shared persistence contract,
**And** failed export leaves live source data and previously valid outputs intact.

**Given** I cancel, choose an invalid/unavailable destination, encounter a write/publication failure or the host stops,
**When** the operation ends or recovery runs,
**Then** cancellation/failure is distinguishable from a completed database export,
**And** partial artifacts are not reported as valid completed output,
**And** failure offers Retry / Choose another location / Cancel and preserves source data and any prior valid output,
**And** center progress provides Cancel where supported and the operation reaches its outcome before returning to the original writing context,
**And** exact interruption/restart and safe cancellation/publication boundaries follow TECH-13 and shared publication contracts,
**And** live current/retained dependencies and the single authoritative universe remain unaffected.

**Requirements:** FR-49 separate local database export; CAP-11; AD-2/3/6/8/9/10/18 and category-folder contract; NFR-1/2/3/6/7/8/9. DEC-11 governs quantitative performance acceptance.

**Dependencies:** Earlier approved runtime, selected-unit identity/storage and shared consistent-capture capabilities; Story 6.1 may supply common local export UX/publication plumbing, but manuscript converters are not required. Product scope and source/Save As/pending-edit/progress/cancel/error/success UX are adopted in the FR-49 catalog-only contract. TECH-13 must still publish exact export metadata/schema compatibility, saved-generation capture, ownership validation/filtering, external-dependency representation, snapshot validation and safe publication/cancellation/restart mechanisms. TECH-01 versioned schema/error/identity contracts, TECH-03 consistent capture, TECH-04 writers, TECH-11 SQLite/native/migration strategy and TECH-02/05 publication/restart apply. DEC-15 and shared manual-editor guards protect pending edits. Dedicated within-root database storage and complete-ZIP inclusion remain settled.

**Scope boundary:** One owning-unit consistent `.sqlite` catalog-only snapshot, excluding external object/manuscript/formatting/image/history/backup payloads with truthful dependency limitations. Preserve original ownership/references and live location; never silently join a project and shared-universe catalog, include unrelated units, import/restore or activate an exported store as authority. A complete ZIP remains the independent recovery artifact. Exact technical mechanisms stay gated by TECH-13; the product format/scope and interactions are approved.

**Verification:** Locate the live database in its dedicated subfolder within the owning data tree and verify that a complete ZIP contains that database folder and consistent database state plus other required saved/category content without first invoking export. Confirm separately exporting leaves that live location and complete-backup obligation unchanged. Use the adopted one-owning-unit catalog-only `.sqlite` scope; inspect/validate exported schema, identity and representative saved data with an appropriate reader, including Unicode, typed decisions/optional makers, relationships and category references where in scope. Verify consistent capture with concurrent writes and the accepted pending-edit behavior. Exercise DEC-33 external-category/index cases; confirm excluded JSON/WRT/formatting/images/history payloads are absent and external dependencies are described. Verify source identity, naming/extension, live-source rejection, overwrite decline returning to Save As, pending-edit guards and actual-path success/open actions. Confirm source records/folders/history, current edits, UUID/authority state and protected-backup accounting are unchanged. Test unsupported schemas, missing required references, canceled dialogs, invalid/unavailable destinations, overwrite/collision rules, write/publication interruption and retry/restart. Verify installed SQLite/native/export dependencies on the adopted targets before acceptance; do not merely assert file existence.

### Epic 6 planning completion and coverage

Both stories are approved: 6.1 provides one manuscript-export workflow supporting DOCX/PDF/MD/TXT for whole stories and selected chapters; 6.2 supplies the separate consistent local database export. Both depend on earlier delivered capabilities and explicitly tracked implementation contracts. Final workflow validation and implementation readiness have not been performed.

| Epic 6 primary requirement | Approved story coverage |
| --- | --- |
| FR-27 — Four manuscript formats and both selection scopes | 6.1 shared versioned manuscript/current-work capture, one selection workflow, format adapters and meaningful output validation |
| FR-49 — Separate local database export | 6.2 explicit source/scope, consistent capture, agreed artifact and truthful validation/outcomes, distinct from settings/manuscript/backup |

**Accepted storage clarification:** SQLite or a similar database lives in its own dedicated database subfolder within its owning project/universe data root, alongside other category folders. Complete ZIPs automatically include that folder with a consistent recoverable database copy and all other required data, without a separate export request. The distinct database-export artifact does not move live storage or replace complete backup. Category layout and current/retained identity/reference protections remain binding.

**Open implementation gates:** DEC-06 is resolved (including bundled LibreOffice for DOCX/PDF and TypeScript MD/TXT serializers); verify actual conversion/runtime/font/packaging behavior under TECH-12; TECH-13 exact database export source/scope/artifact/capture/dependency/compatibility/validation; DEC-33 exact category/database file layout. Retain TECH-01/03/04/05/11/12 shared schemas, consistent capture, writers, lifecycle, installed SQLite/native/runtime integration, DEC-15 pending edits, PLAN-04 UX interactions and DEC-09–11 platform/performance acceptance. Dedicated database-folder placement and automatic complete-ZIP inclusion are settled; the remaining detailed format/layout choices are not selected by story approval.

### All-epic story-creation checkpoint

All six epics now have approved stories: Epic 1 = 9, Epic 2 = 7, Epic 3 = 14, Epic 4 = 7, Epic 5 = 10, Epic 6 = 2; total **49 approved stories**. All 49 functional requirement identifiers have primary epic mappings and the per-epic story coverage tables are present. All 12 capability identifiers remain first-release scope. Later amendments are recorded in the canonical spec/requirements/contracts and reflected in the maintained story/coverage contracts; historical proposal files are not a competing authority.

No dedicated UX requirement artifact/UX-DR inventory was adopted; existing functional UX and PLAN-04 gates still apply. NFR/AR contracts and unresolved implementation gates remain binding. Source-record, capture/recovery, installation, performance and complete-release verification tasks are still open; approving the breakdown is not implementation or testing.

Step 3 awaits its final menu selection: **[A] Advanced Elicitation [P] Party Mode [C] Continue**. Only Continue marks story creation completed in workflow tracking and advances to Step 4 final validation. That validation has not yet run; do not mark PLAN-05 finalized, declare implementation readiness or create sprint status from this checkpoint alone.


### Step 4 final-validation result

Final validation ran after Jo selected C. Result: **CONCERNS; 2 checks open** after Jo’s starter-heading, Epic 4 sequencing and explicit storage decisions (V01–V03 resolved), documented in [final-validation.md](final-validation.md). All 49 story approvals are preserved and all FR identifiers have mappings. Open checks are unanswered product/UX behavior (including DEC-36 formatting) and shared technical prerequisites. `status: draft` is retained; Step 4 is not completed and no completion menu, implementation-readiness result or sprint status is issued. Re-run after corrections; do not treat prior historical “not run” checkpoints as the current validation result.


**Accepted storage representation — supersedes earlier payload assumptions:** Object content, including character data, timeline information, project metadata, settings and other non-manuscript structured data, is saved in JSON-format `.json` files inside the appropriate category folders. Writing content, including chapter manuscripts, is saved as plain text in `.wrt` files. Each saved object’s filename stem is its permanent object ID: `<object-id>.json` for structured data and `<chapter-id>.wrt` for chapter writing. A chapter can have JSON metadata and a plain-text manuscript with the same ID stem and different extensions. Human-readable titles/names are editable data, not file identities.

The database catalogs object IDs, filenames, locations, links and relationships. JSON/.wrt files are the source of object content; the database is the maintained identity/location/relationship catalog, not a second independently editable copy of manuscript or character/timeline/settings payloads. This does not imply the relationship database is disposable or automatically reconstructible: it must be saved and backed up with the files. Exact versioned JSON/relationship schemas, encoding, internal filenames for other asset/manifest kinds and catalog repair behavior remain shared technical-contract work. Revision version containers/addresses must retain immutable older files even when their logical object filenames share the same ID; TECH-09 defines that layout.

Existing ownership remains: project files hold project/story/chapter/plot content, universe files hold universe/timeline/character/faction/event/decision content. Settings are JSON in their accepted owning scope; the settings object ID/location schema does not silently change application-wide settings into per-project settings. Each project/universe database stays in its own dedicated database folder under that unit’s root. Each category’s content stays in its category folder. Complete ZIPs include consistent database catalogs, JSON/.wrt content, images, retained history and required reference closure; neither the catalog nor the files alone substitute for complete recovery.

Application writes must coordinate content-file publication with ID/location/relationship catalog updates before durable acknowledgment, revision/backup completion or recovery activation. The crash/restart/serialization/consistent-capture protocol remains TECH-02–05/09/11, not presumed atomic because SQLite is used. DEC-33’s content representation and catalog responsibility are now settled by Jo’s explicit choice. This supersedes the earlier AD-13 requirement to persist the manuscript itself as structured JSON. Rich-formatting requirements remain agreed unless Jo changes them; DEC-36 must resolve how bold/italics/indents/headings/scene breaks are represented alongside plain-text .wrt writing. Do not silently put JSON, HTML, Markdown markers or rich-text payloads inside `.wrt`, or silently remove formatting requirements.

Affected storage/editor/capture/recovery/export story implementations must use this representation. Story 2.2 persistence criteria are reconciled above; every complete ZIP includes the database catalog and JSON/WRT files. Earlier statements that the file representation/database role were undecided are historical. V03 is resolved at the storage-decision level; DEC-36 rich-format representation is a product/editor gate under V04 and crash-safe schema/publication contracts remain V05. All 49 approvals and FR identifiers remain intact.


**Accepted single-base relocation amendment:** For each independently located project or universe data root, the database stores its base-folder location once in a separate root-location record. Object locations store the owning root identity and a path relative to that base, never a repeated absolute prefix. Resolve an object as its owning base folder plus its relative path, including category JSON files, WRT writing, managed assets and the database subfolder as applicable.

When Jo locates an entire data folder after moving it, validate the same owning UUID and update only that root’s base-folder location. Object IDs, filenames, per-object relative paths, content and relationships remain unchanged; do not rewrite every object row or JSON/WRT file. Same-universe projects resolve the universe through its UUID/root mapping rather than persisting their own repeated absolute universe paths. Projects and universes keep their independent roots, so changing one does not relocate the other.

ZIPs and retained manifests preserve logical root identities and relative paths so recovery at a new location can bind the root once without rewriting each object. No historical absolute base path overrides the confirmed current location. This changes location resolution, not content chronology or live authority. Moving an individual object within a root is a separate explicit location update, not the whole-folder rebind operation. Root discovery/bootstrap and atomic validation/publication of the base record remain in TECH-01/02/04/11; no additional global database or mandatory new registry location is implied.

Maintained Stories 1.2/1.3 now explicitly accept whole-root relocation by updating only one base-location record. Storage/capture/recovery/export use the same root-relative identities, including moving a universe shared by projects and recovering at a different base. Verify object ID/path/relationship rows and file contents remain unchanged across a root move; only the correct root mapping changes. All 49 story approvals remain, V04/V05 stay open and DEC-36 formatting is still unanswered.


**Accepted DEC-36 chapter formatting:** Each chapter’s writing is plain text in `chapters/<chapter-id>.wrt`. Its companion `chapters/<chapter-id>.json` holds chapter metadata and the formatting needed to render that text, including bold, italics, paragraph indentation, headings and scene breaks. Both files use the same permanent chapter ID. These paths illustrate the chapter-category relationship; root-relative resolution and the accepted category layout apply. Rich formatting must not be embedded as JSON/HTML/Markdown payload in the WRT text.

Editing and reopening combine the matched text and JSON formatting metadata through the editor adapter. Application edits update formatting anchors/structure with the changed text under one versioned manuscript contract. Saves acknowledge success only when the required text, metadata and database catalog state are durably published as a consistent version. Revisions, Replaced capture, backups, restoration and manuscript export consume the corresponding matched text/metadata versions; restoring one saved chapter must not mix its historical text with live formatting or vice versa. Root relocation preserves the relative paths and paired chapter identity.

If either component is missing, incompatible or belongs to another text version, do not silently apply mismatched formatting, discard source content or claim a complete save/restore/export. Report the condition and use the accepted validation/recovery contract. TECH-01 defines exact metadata fields, text/format association/version validation, paragraph/range anchoring, encoding and migrations; TECH-02/03/09 define crash-safe paired publication/capture and retained version identity. These technical details remain gates, but the choice of JSON formatting metadata alongside plain-text WRT is settled (DEC-36).

Story 2.2 now explicitly accepts paired text/JSON/catalog saving and round-trip; Stories 5.1–5.10 preserve matched immutable pairs during capture/recovery/cleanup and Story 6.1 exports through the same combined contract. DEC-36 is resolved, while V04’s other product/UX decisions and V05’s exact schemas/publication protocols stay open. Approved total remains 49.


**DEC-12 universe inventory, accepted item 1:** As part of DEC-12’s universe-content inventory, Jo confirmed universe-owned factions with faction profiles containing leadership information, government type, population size, resources, culture notes and a list of worlds or cities where applicable to the universe. These extend the already agreed faction fields rather than replace leadership/government/strategic/image/roster support. Faction content is stored in the faction’s ID-named JSON file in its category folder; its ID/location/relationships are tracked by the universe database catalog and included with required data in complete ZIPs.

The worlds/cities requirement is a faction-profile list, not an adopted separate world/city entity model, ownership/exclusivity rule or automatic story association. A universe without applicable worlds/cities must not acquire invented location records. DEC-37 must define validation/presentation and completeness treatment of the added population/resources/culture/world-city fields, plus whether list entries are names/notes or references if separate locations are later adopted. Existing draft-save support remains binding and no extra numeric defaults, resource simulation or mandatory location system is implied. DEC-12 remains open while Jo supplies the rest of the universe-content inventory and its own profile fields.

Story 3.7 now includes these added faction fields; remaining universe-content choices await Jo’s continuation. Existing 49 story approvals are retained; V04/V05 remain open.


**Accepted invalid chapter range correction:** If both chapter dates are present and the end is earlier than the start, automatically set the end equal to the start before committing the date change. Use the start as the correction reference, including when both values are supplied together. For example, start day 20/end day 10 becomes start day 20/end day 20. If the range is valid or either date is absent, retain normal independent optional-date behavior; do not invent a missing bound or preserve an old duration by shifting dates.

This is the specific invalid-range exception to otherwise independent start/end fields. It changes only the chapter’s end value needed to equalize an inverted pair, never linked main-event/flashback dates/content, manuscript text or ownership. Persist/display the resulting equal values and use the saved start for chapter ordering. Invalid date syntax/calendar bounds remain the common validation contract; equalization is not a rule for manufacturing a valid date from invalid input. Cancel/failure leaves previously committed dates unchanged under the shared save contract. Chapter-only restore/recovery applies this agreed range-validation contract without changing linked events.

Story 2.3 criteria are updated. This later explicit exception takes precedence over older unconditional “changing one date never changes the other” wording; it introduces no chapter-driven event mutation. DEC-01 is resolved; other V04/V05 questions remain open and 49 story approvals are retained.


**Accepted DEC-16 chapter tie rule:** Chapters sharing the same start date are ordered by their saved creation order within that date. Chapters with different start dates remain chronological. Chapters with no start date remain first in creation order; an end-only chapter has no substitute start sorting key. Date edits, renames, saves, reopen and calendar display changes do not reset chapter creation order. This is the chapter-list tie rule, not manual timeline/plot within-date ordering.

Story 2.3 explicitly reflects this accepted rule. It does not close chronology/schema/publication or other unchecked gates. All 49 approvals are retained; V04/V05 remain open.


**Accepted DEC-15 navigation save:** Before switching chapters/projects, opening the event editor or otherwise leaving pending manuscript writing, automatically save the pending text and its companion JSON formatting/metadata through the normal coordinated application save contract. Do not wait for the periodic autosave timer. Continue navigation only after durable acknowledgment covers the required text/metadata/catalog version; edits made after the submitted version must not be falsely acknowledged or discarded.

If automatic saving fails, show a clear warning that the writing has not been saved, keep the pending edits available in the current editor and leave navigation pending. Offer retry or cancel navigation; never silently discard work or report a failed save as successful. Canceling navigation keeps the current editor and writing. Retrying reuses the accepted save/publication contract. This navigation-triggered save does not change the independently configured periodic autosave, revision or backup intervals and does not itself claim a revision/backup was completed. Normal-close capture retains its separate complete revision/backup requirements.

Story 2.2 accepts this behavior, and its existing DEC-15 consumers (chapter/event/context/history/export navigation) reuse it. The user choice is resolved; exact coordinated save/host/retry schemas remain technical gates. All 49 approvals and V04/V05 status are preserved.


**Accepted DEC-17 periodic autosave rules:** Periodic autosave starts its timer when a project opens and restarts that timer when its configured interval changes. The default interval remains 5 minutes. At each due interval, save pending changes through the same coordinated WRT/companion-JSON/catalog save contract; unchanged content needs no redundant write. A navigation-triggered save remains immediate under DEC-15 rather than waiting for this timer.

After system sleep, if an autosave is overdue and changes are pending, run one overdue save rather than replaying every missed interval. Autosaves must not overlap or create competing writers with manual/navigation saves; the common writer/version contract preserves newer edits and prevents stale saves from overwriting newer content. Low-level timer/serialization implementation remains in the shared contracts.

If autosave fails, show a warning that current changes were not saved, retain pending edits and the last valid committed state, retry at the next configured interval and provide Retry now. Retry uses the same non-overlapping save contract. Acknowledgment marks only its actual matched text/metadata version saved; later edits stay pending. Autosave does not change revision or backup intervals or claim that either completed. Revision/backup schedules still have their separately tracked DEC-31/34 rules.

Story 2.4 explicitly accepts/tests these cases; existing settings import/interval consumers reuse them. DEC-07 input validation and TECH scheduling/publication implementation remain gates. All 49 approvals and open V04/V05 are unchanged.


**Accepted DEC-31 revision timing:** Revision scheduling uses an independent configurable interval, default 10 minutes. Start its timer when a project opens and restart it when the revision interval changes. After system sleep, perform one overdue revision capture rather than replaying every missed interval. Revision captures must not overlap; writer/capture coordination also keeps them consistent with autosave, navigation saves and backups.

Each attempt first durably saves required pending writing, including matching WRT text, companion JSON formatting and catalog state, then captures a complete revision with its required historical dependency closure. A failed prerequisite save or incomplete capture never becomes a completed revision. On failure warn, preserve current work and existing completed revisions, retry at the next revision interval and provide Retry now. Captures/retries reuse the same complete-manifest/publication contract. These timing choices do not change periodic autosave or backup intervals, and normal-close/pre-restoration revisions still run at their explicit triggers.

Story 5.1 now accepts/tests this timing and retry behavior. Shared capture/publication implementation and backup eligibility/cadence remain separate gates; all 49 approvals and V04/V05 remain.


**Accepted DEC-34 scheduled backups:** Scheduled backups target each open project and each universe opened independently as a standalone universe. A universe merely loaded as a project dependency does not acquire an additional standalone backup job; its recovery content remains required inside the project ZIP. An explicitly opened standalone universe is backed up independently even if projects also share it. Jobs are keyed by owning project/universe identity rather than repeated views of the same open unit.

Backup timing has an independent configurable 10-minute default, using the accepted revision-style rules: start when an eligible unit opens, restart when its backup interval changes, run one overdue attempt after sleep rather than replaying missed intervals, and prevent overlapping captures through the shared writer/backup coordination contract. Each attempt uses the complete ZIP pipeline and durably saves required pending writing first. Changing backup timing does not change autosave/revision intervals.

On failure show a warning, preserve valid prior archives/current work, offer Retry now and retry at the next backup interval. Only complete validated durably published ZIPs count as successful. For an unavailable destination, show one alternative-folder selection prompt at a time rather than a stack of repeated prompts. Additional due attempts do not create duplicate prompts or a burst of replayed missed backups; their retry/execution uses the same serialized job contract. Canceling alternate-folder selection skips that attempt, marks it incomplete, preserves the configured destination and later schedule, and leaves retry available. This outside-close path does not invoke normal-close fallback.

Story 5.8 explicitly reflects these rules; close-time lifecycle scope/fallback remains its own Story 5.9/TECH-05 contract. All 49 approvals and open V04/V05 remain.


**Accepted DEC-35 ZIP filename format:** Completed project ZIP filenames use `<ProjectName>_<UniverseName>_<YYYY-MM-DD>_<HH-mm-ss>.zip`. Completed standalone-universe ZIP filenames use `<UniverseName>_<YYYY-MM-DD>_<HH-mm-ss>.zip`. The timestamp is the real local date/time at the start of that backup’s capture, using a 24-hour clock and seconds; it is not a fictional date or the later completion time.

A complete project archive contains all its volumes, so its filename identifies the project and universe rather than listing individual volume names. No new volume-only backup scope is introduced. Apply the same template to manual, scheduled, normal-close/fallback and post-reconciliation project archives, using the actual names at capture.

Replace characters that the target filesystem cannot accept in filenames with safe characters; exact normalization/replacement and reserved-name/length handling remain a documented cross-platform filename-encoding detail under TECH-01/PLAN-04. Preserve original display names and owning IDs in the manifest. If the intended completed filename exists, choose `_2`, `_3`, etc. before `.zip` until a free name is reserved without overwriting an existing archive. Concurrent publication must make that name reservation safe under the shared publication contract.

Manifests retain the corresponding real capture/completion timestamps, owning identities and sufficient clock/timezone metadata for consistent accounting; local filename display is not the sole basis of retention/protected-set ordering. Recovery/authority identity remains UUID-based. Changing a project/universe name affects later filenames, not existing archive identity.

Shared archive creation and scheduled/normal-close consumers use this accepted naming contract, including reconciled project ZIPs. Original “universe/volume/project” naming intent is refined by project/universe labels for project-wide archives; all volumes remain included. All 49 approvals and open V04/V05 remain.


**Accepted DEC-08 normal-close failures:** If required saving, revision capture or backup fails during normal close, including failure of both application-root and user-data fallback locations, show the failure and keep the application open. Preserve pending edits, successfully saved current state, completed revisions and valid backups; report their outcomes separately rather than rolling them back or calling the whole close successful.

Offer Retry, Choose another backup folder where applicable to a backup/destination failure, and Cancel closing. Retry follows the coordinated operation contract and does not damage already completed output. Cancel closing returns to the workspace with writing retained. Complete normal close only after the required pending saves, complete revision and complete backup succeed. There is no silent discard or forced-close override. This concerns application-managed normal close; abrupt process termination remains the separate crash/restart recovery contract.

Story 5.9 implements this behavior under TECH-05 rather than treating failure policy as undecided. Shared host/operation restart and paired-write protocols remain technical prerequisites. All 49 approvals and V04/V05 remain.


**Accepted DEC-32 restored-calendar workflow:** After item/project/ZIP restoration, flag affected data when its saved calendar configuration or display format differs from the current authoritative calendar. Preserve the historical calendar association and the pending-update state across reopening; merely viewing the data does not clear the flag. Compare the actual applicable configuration/format under the shared schema contract, not just an unrelated filename or a version number that implies no format difference.

Provide an explicit Update to current calendar action. It recalculates displayed dates from the saved elapsed-day positions using the current authoritative calendar and saves the updated current-data calendar/display metadata. Preserve elapsed positions, chronology, relationships and writing; do not overwrite the authoritative calendar or change linked event positions/content as a side effect of updating a restored chapter’s display. Retained immutable revisions keep their exact historical content/format metadata.

Clear the affected current-data flag only after its update saves successfully. On failure report it, retain the flag and offer retry; do not claim the update completed or discard the restored data. Allow manuscript writing while an update is pending and visibly identify the unresolved calendar-format state. This flag does not waive required authority/reference/schema checks before recovery activation. TECH-01/02/03/09 define exact comparison/metadata/publication/version handling; those technical details do not reopen the accepted user workflow.

Restoration Stories 5.2–5.4/5.6–5.7 explicitly accept the action/clear/failure/writing behavior. Earlier statements leaving that choice open are superseded; other product and technical gates remain. All 49 approvals and V04/V05 are retained.


**Accepted minimum year definition:** The minimum valid year definition is its year number and the number of days in that year. A days-only calendar can be created/saved with those values without defining any months or explicit standalone-day entries. Months, year/element names and the richer year structure are configurable options, not prerequisites for the days-only mode. Do not require at least one month/standalone-day component or invent a default 365-day year.

In days-only mode the entered day count defines the actual year length; an empty optional component list does not mean zero days. When months/standalone components are configured, retain the existing ordered composition, actual-total/target mismatch and repeating-year contracts. Calendar changes affecting populated data still preserve elapsed positions/intervals under FR-7. A universe may still exist before a calendar is configured under Story 1.2.

This settles DEC-13’s minimum structure, optional months and names. Exact numeric range/precision validation for day counts/month lengths and year numbers still needs the accepted DEC-03/DEC-13 shared calendar schema; the earlier proposed validation bundle was not accepted wholesale. Do not silently decide year zero/negative bounds, maximum days or invalid numeric input behavior from this minimum-field choice.

Story 1.6 now explicitly accepts days-only year number/day count without requiring component entries. Other accepted calendar composition/display/chronology rules stay binding. DEC-13 numerical validation and DEC-03 year/epoch details remain open; 49 approvals and V04/V05 unchanged.


**Accepted DEC-13 numeric calendar rules:** Calendar day count and each configured month length must be positive whole numbers. A supplied target year length must also be a positive whole number. The required year number must be a whole number. Missing required values, fractions and nonnumeric input show a clear validation error and cannot be committed as a valid calendar configuration; do not silently round fractions or substitute invented values.

The minimum days-only definition remains year number plus day count; months, names and explicit standalone-day component entries remain optional. Optional names do not create a missing-required-field error. If a valid configured month/standalone-day composition differs from a valid target, the existing red/green comparison and save-with-target-corrected-to-actual-total rule remains allowed; mismatch is not invalid numeric input. Year zero, negative years, epoch and supported year bounds remain DEC-03; this decision requires integer year numbers but does not select their range. TECH-01 defines integer representation/precision and parsing/error schemas before implementation.

Story 1.6 explicitly accepts/tests these rules. Minimum structure and numeric validation are settled; DEC-03 year numbering/bounds/epoch and exact technical schemas remain open. All 49 approvals and V04/V05 remain.


**Accepted DEC-03 year numbering:** Fictional year numbers are whole numbers that may be negative, zero or positive. Their chronological sequence is … -2, -1, 0, 1, 2 … with no skipped year zero. No separate before/after-era system is required by this decision. Optional year names remain optional and do not replace the numeric chronology. A day-only year still needs its year number and day count; configured month/day compositions remain optional and obey the existing repeating-year rules.

This settles DEC-03 year-zero/negative support, not its remaining internal elapsed-day epoch and supported numeric bounds. Shared date input/comparison/conversion must consistently accept the chosen numbering within those eventual bounds; do not apply a positive-year-only validator or treat a negative year as an error merely because it is negative.

Story 1.6 explicitly supports this numbering; all chronology consumers must share it. Internal epoch and supported numeric bounds remain to settle. All 49 approvals and V04/V05 remain.


**Accepted date-number clarification:** Jo rejected the proposed artificial origin “day 1 of year 0 = elapsed day 0” and instructed using the entered numbers as-is. Preserve supplied year/day values in the application’s versioned calendar date representation; do not replace them with a remapped zero-origin counter or subtract an artificial year/day offset when saving/displaying ordinary dates. The accepted continuous year numbering still includes negative, zero and positive years.

Calendar arithmetic/comparison must use the configured calendar and the supplied values under the shared chronology contract; this instruction does not choose a new artificial epoch. It does not revoke the earlier requirement that reconfiguring a populated calendar preserves elapsed chronology/intervals and consistently recalculates displayed dates, nor the explicit restored-calendar update workflow. TECH-01 must reconcile versioned date/configuration identity, comparison and conversion with those invariants without introducing an unapproved persisted zero-based origin. DEC-03’s supported numeric bounds remain open; do not present the rejected epoch as an outstanding product choice to approve again.

This supersedes earlier proposals/gates asking Jo to adopt a year-zero-based internal day counter. Existing calendar-reconfiguration/recovery invariants remain binding. All 49 approvals and V04/V05 remain.


**Accepted DEC-03 unbounded years:** Year numbering has no fixed upper or lower limit. Accept arbitrarily large positive or negative whole year numbers, including zero, retaining the entered numeric value exactly. Do not impose calendar-year cutoffs, 32/64-bit integer bounds, floating-point safe-integer bounds or silent rounding/truncation on the product’s year field. The continuous order remains … -2, -1, 0, 1, 2 …; no artificial epoch remapping is adopted.

Use arbitrary-precision integer semantics for year storage, comparison and calendar arithmetic. TECH-01 must define an exact versioned JSON/wire representation and parsing that round-trips arbitrarily large year values through object files, editor/date UI, catalog queries if needed, revisions, ZIP recovery and export; native JSON/SQLite/JavaScript numeric limits must not silently constrain the year domain. Exact encoding is technical-contract work, not permission to add an application year limit. Year numbers remain whole numbers; nonnumeric/fractional/missing required inputs still follow the accepted validation contract. This decision concerns year numbers and does not silently change every other numeric field’s validation.

DEC-03’s product choices are settled: signed continuous years with zero, input numbers preserved as-is without the proposed artificial zero-origin counter, and no fixed year bounds. TECH-01 chronology/conversion/schema and TECH-11 adapter integration must implement this while preserving prior elapsed chronology/intervals during calendar changes.

Story 1.6 accepts exact arbitrarily large year values; every dependent chronology/date consumer must preserve that domain. Earlier year-bound/epoch proposals are superseded, while exact schemas/calculation/publication remain V05 technical gates. All 49 approvals and V04/V05 remain.


**Accepted standalone date order:** For a named standalone day when the year has a name, display exactly `name-of-year/dayname-daynumber/yearnumber`: year name first, then the day name joined to its day number with a hyphen, then the numeric year. For example, `Dragon/Festival-40/6976` illustrates that field order. This supersedes the proposed standalone `name/day-of-year/year` layout and any proposal to append the year name at the end of this standalone format.

Year names remain optional and numeric years remain exact, including negative/very large values. DEC-04 still needs the fallback format when the year or standalone day is unnamed and the exact day-number interpretation/formatting details; do not silently require a year name, assume leading empty separators or treat this correction as approval of every other proposed date layout. Existing days-only/month-based source examples remain unchanged unless Jo revises them.

Story 1.6 names/display criteria and all consuming date views must use the accepted order. Remaining DEC-04 fallbacks are not inferred. All 49 approvals/V04/V05 remain.


**Accepted DEC-04 unnamed-year fallback:** For a named standalone day in a year without a year name, omit the year-name segment and its separator: `dayname-daynumber/yearnumber`, for example `Festival-40/6976`. Do not show a leading slash or an invented placeholder year name. When a year name exists, retain the approved `name-of-year/dayname-daynumber/yearnumber`. This resolves the unnamed-year fallback for named standalone days; exact day-number meaning and the unnamed-day fallback remain DEC-04.

All 49 approvals/V04/V05 remain; no unrelated display rule is inferred.


**Accepted DEC-04 completion:** In a standalone-day display, daynumber is the day’s position within the whole year, not an ordinal within only the standalone days. For example, `Festival-40` means the 40th day of that year. If the day has no name, omit its name and hyphen: a named year displays `name-of-year/daynumber/yearnumber` (e.g. `Dragon/40/6976`), and an unnamed year displays `daynumber/yearnumber` (e.g. `40/6976`).

Together with earlier accepted cases, the standalone display matrix is: named year/named day => `name-of-year/dayname-daynumber/yearnumber`; unnamed year/named day => `dayname-daynumber/yearnumber`; named year/unnamed day => `name-of-year/daynumber/yearnumber`; unnamed year/unnamed day => `daynumber/yearnumber`. Do not insert empty segments, leading separators, placeholder names or an orphan hyphen. Numeric years remain exactly as entered, including zero, negative and arbitrarily large integers.

This resolves DEC-04 standalone-day/daynumber/optional-year-name behavior. Existing days-only `dayofyear/year` and month-based `month/dayofmonth/yearnumber/yearname` source formats remain in force; omit an absent optional year-name segment rather than requiring a name. The rejected standalone day-name-first layout is not reinstated. Shared schema/rendering/escaping details remain technical implementation work.

Story 1.6 now accepts the four standalone naming cases; later calendar/event/character/chapter/recovery views reuse that display contract. DEC-04 is resolved, while unrelated product/technical checks remain open. All 49 approvals/V04/V05 retained.

## Settings validation and atomic import — DEC-07 resolved

Autosave, revision and backup intervals accept positive whole minutes; retention accepts positive whole days. Zero does not disable these features. Reject zero, negative, fractional or otherwise invalid values with clear field feedback and retain committed settings. Defaults remain 5/10/10 minutes and 30 elapsed days, with independently configured intervals.

Settings import retains current values for missing fields, ignores unknown fields with a warning, and rejects the entire import if any known field is invalid. Validate before applying; commit all accepted known values together, with no partial settings change on validation or persistence failure. Existing malformed-JSON/non-object rejection and light/dark/system theme rules remain. An unavailable backup folder may remain configured, including through import; availability alone does not invalidate the settings. Actual backup attempts use the approved destination prompt/retry/close-fallback rules, and import itself triggers no backup or relocation.

Exact shared field names, serialization/schema compatibility and safe publication remain TECH-01/02 implementation contracts; this decision does not invent schema fields or numeric coercion. These accepted product rules supersede earlier DEC-07 deferrals.


## Added faction-field validation and completeness — DEC-37 resolved

Population size accepts an exact count, an estimate, a range or “unknown”; preserve the author's representation without requiring a numeric-only value or inventing a numeric default. Resources and culture notes are free text. Worlds/cities are an optional list of names and notes, without requiring separate location records. These four added fields are optional and blank values do not make the faction profile incomplete. Original non-roster completeness rules remain unchanged, military rosters remain optional, and incomplete drafts remain saveable.

Save/reopen and associated-project access preserve these values in the same universe-owned faction JSON and catalog identity. Exact serialization remains TECH-01; this decision does not add resource mechanics or a world/city entity system. DEC-37 is resolved, while DEC-12's remaining universe inventory and own-profile choices remain open. This amendment supersedes earlier deferrals of the added fields' validation/completeness.


## Universe own-profile fields — DEC-12 partial decision

A universe has a required name and an optional free-text description, alongside its already agreed calendar, timelines, characters and factions. Creation requires a name; an omitted description does not prevent saving or reopening. Save/reopen preserves the profile in the universe's ID-named JSON under the shared category-folder/catalog contract. The permanent universe UUID remains its identity; its name is not a replacement for that UUID or its separately stored base-folder location.

These own-profile fields are accepted. DEC-12 remains open only for the remaining universe-content inventory; no additional entity types or mandatory profile fields are inferred from this approval. In particular the faction worlds/cities names-and-notes list does not by itself introduce separate world/city records. Exact schema and persistence protocols remain technical gates.


## Universe-content inventory complete — DEC-12 resolved

Jo confirmed the universe-content inventory is complete. The universe has a required name and optional free-text description, plus the already agreed calendars, timelines/events/decisions, characters and factions and their accepted relationships/profile fields. Faction profiles include leadership/government, population, resources, culture notes and optional worlds/cities names-and-notes lists under resolved DEC-37. No separate world/city profile capability is added by this inventory.

DEC-12 is resolved. This confirmation closes the remaining inventory question and supersedes earlier statements that further universe content or own-profile fields were awaiting an answer. It preserves all existing approved story capabilities; exact schemas, persistence and other open product/UX choices remain their respective gates.


## Same-date timeline insertion and editing — DEC-14 resolved

A new timeline event is placed last in its date group. An event whose date changes is placed last in the destination date group; the relative order of the other events in both the old and destination groups is preserved. Editing an event without changing its date preserves its position. Existing manual ordering stays intact apart from inserting or moving the affected event. Saving never requires manual arrangement, changes no unrelated dates/content, and introduces no time-of-day value. Saved ordering is preserved across reopen and associated-project access to the same universe.

DEC-14 is resolved. This accepted timeline rule supersedes earlier deferred insertion/date-transition outcomes; it is explicitly adopted for timeline events rather than inferred from plot ordering. Exact order serialization and coordinated publication remain shared technical contracts.


## Character waiver-state transitions — DEC-05 partial decision

Answering a waived character-development field clears its waiver and makes it answered. Clearing an answer leaves an expected field incomplete; it may then be explicitly waived again. A character-type change preserves answers and existing explicit waivers. An unanswered field newly expected for the selected type is incomplete unless it already has an explicit waiver. Fields outside that type's expected set remain optional and do not affect completeness; retained explicit waivers do not create an expectation for optional fields. Name remains required and cannot be waived. Incomplete development never blocks saving a named character.

These waiver transitions are accepted. DEC-05 remains open only for exact guided character-development prompt wording. Shared serialization/publication and UX interaction details remain technical/design gates. This amendment supersedes earlier deferrals of these state-transition outcomes.


## Guided character-development prompt wording — DEC-05 resolved

Use these exact prompts for the existing character-development fields:

| Field | Prompt |
| --- | --- |
| Rank/title | What rank or title does this character hold? |
| Background | What experiences shaped this character? |
| Description | How would you describe this character? |
| Motivation | What does this character want, and why? |
| Weaknesses | What weaknesses or limitations affect this character? |
| Strengths | What strengths help this character? |
| Specialities | What skills or areas of expertise distinguish this character? |

These prompts add no fields or completeness expectations. The existing character-type expected-field matrix and accepted waiver transitions remain in force: answering clears a waiver; clearing an answer makes an expected field incomplete until explicitly waived; type changes preserve answers and explicit waivers; a newly expected unanswered field is incomplete unless already explicitly waived. Optional fields do not affect completeness, name cannot be waived, and incomplete named drafts save. DEC-05 is resolved; earlier prompt/waiver deferrals are superseded. Shared schema/publication and PLAN-04 interaction design remain implementation gates.


## Profile-image formats, validation and display — DEC-18 resolved

Character and faction profile images support PNG, JPEG and WebP. Validate that the selected content is a readable supported image rather than trusting its filename extension. A successful import keeps an unchanged copy in the owning universe's managed storage; profile/catalog references use the shared relative managed-asset contract and never depend on the original source path. Display images fitted within their display area while preserving aspect ratio, without cropping or stretching. Failed imports report an error and preserve the previous image/reference.

Existing immutable asset-version and retained-reference protections remain binding for replacement/clearing. Character images remain optional; faction completeness continues to use its own accepted field rules. DEC-18 is resolved; earlier format/validation/display deferrals are superseded. Exact display-area dimensions belong to PLAN-04; shared asset schema, publication/recovery and reference-safe retention remain TECH-01/02/04/05/09 contracts. No image transformation or additional image fields are introduced.


## Preserve recorded birth month/day on year edits — DEC-19 partial decision

Jo specified that changing a character's birth year must not change any recorded birth month or day. The day-1 convention applies to a year-only birth when no month/day has been recorded; an inferred day-1 timeline placement must not be treated as a precisely recorded birth day. Editing the year of a birth with recorded month/day preserves those supplied components and the existing linked birth-event identity. Preserve any supplied month or day without silently replacing it with day 1 or a different component.

This explicitly supersedes unconditional birth-year-edit-to-day-1 wording in FR-14/Story 3.5 and prior proposals. Shared schemas must distinguish recorded date components from the placement convention. DEC-19 remains open for handling a preserved component combination unavailable in the target year, birth clearing, direct-edit synchronization and post-calendar profile display. The earlier proposed clearing/direct-edit/display rules were not approved by this correction; do not infer their acceptance. Existing calendar-reconfiguration elapsed-position preservation remains binding.


## Birth-year edit fallback for unavailable month/day — DEC-19 partial decision

When a character's birth year changes, preserve its recorded month/day if that combination exists in the target year. If the recorded month/day does not exist there, accept the year change and reset the date to the first month/day of the target year. Use that year's actual calendar start, consistent with the existing day-1 convention: if a standalone day begins the year, use it; a days-only year uses day 1. Do not invent a month in a calendar without months. Preserve the linked birth-event UUID and character/universe association; repeated saves must not duplicate the birth event.

This is Jo's accepted fallback and supersedes the unapproved proposal to reject the year change or keep the old date. It qualifies the recorded-month/day preservation rule only when those components are unavailable in the target year. DEC-19 remains open for birth-year clearing, direct birth-record editing and post-calendar profile-year display; the earlier proposals for those behaviors remain unapproved. Calendar reconfiguration itself still preserves elapsed positions under the existing contract, rather than invoking this explicit year-edit fallback. Exact date precision and coordinated publication remain shared technical contracts.


## Clearing character birth information — DEC-19 partial decision

Clearing a character's birth year removes its linked birth event from the active timeline and clears the character's current birth association, while preserving retained history. Resolve any affected current links before committing the removal; do not leave dangling references or silently discard linked content. Until those links are resolved, the clearing operation must not be committed as complete. The shared coordinated publication protocol keeps the character and active birth-event/reference state consistent. Retained historical records and dependencies remain protected under the existing history/reference contracts.

Jo approved this clearing rule. DEC-19 remains open for direct birth-event edit synchronization and the profile year displayed after calendar reconfiguration. Valid recorded month/day preservation and the accepted first-month/day fallback for explicit year changes remain in force. This decision does not change the elapsed-position-preserving calendar-reconfiguration rule or authorize immediate deletion of retained data.


## Birth-event/profile synchronization — DEC-19 resolved

Editing a linked birth event's date directly updates the character's displayed birth year from that same canonical date. After calendar reconfiguration, the character profile shows the year containing the birth event's preserved elapsed position, without moving the event back to day 1. Character and timeline views resolve the same linked birth information; no independent competing birth date or duplicate event is created.

Together with the accepted year-edit and clearing rules, this resolves DEC-19. Explicit year edits preserve recorded month/day when valid, otherwise fall back to the target year's first month/day; year-only births use day-1 placement. Clearing the year removes the active linked birth/current association only after affected-link resolution, preserving retained history/dependencies. Calendar reconfiguration preserves elapsed positions and does not invoke the explicit-year-edit fallback. Shared date precision, schemas and coordinated publication remain technical gates. Earlier deferrals of these product behaviors are superseded.


## Character background completeness — DEC-20 resolved

A narrative background answer or at least one linked character background event satisfies the expected background field. An explicit background waiver also satisfies that expectation. Without an answer, qualifying linked background event or explicit waiver, the expected background field is incomplete, but the named character remains saveable. Removing the last qualifying answer/event makes the field incomplete unless it is explicitly waived. If either another qualifying event or the narrative answer remains, completeness stays satisfied.

This applies to the existing expected-field matrix: background is expected for main characters and optional otherwise. No new mandatory prompts, automatic waiver or duplicated timeline event is introduced. Background events remain the same canonical character-linked universe events in both views; completeness evaluation does not create, edit or delete them. DEC-20 is resolved and earlier deferrals are superseded. Existing reference/history protections and shared schema/publication contracts still govern event/link changes.


## Optional faction military-roster validation — DEC-21 resolved

Partially filled military-unit entries can be saved; entirely blank rows are ignored. Unit name, role and description are free text. Base strength and movement points accept non-negative numbers, including decimals. Base modifier points accept positive, zero and negative numbers, including decimals. Blank numeric fields remain unset rather than becoming zero. Invalid supplied values produce a field error and are not committed as valid numeric values; preserve the previously committed roster under the existing publication contract. Roster entries never affect faction completeness.

DEC-21 is resolved. This defines recorded values only and adds no combat/movement calculations, example defaults or artificial numeric upper bounds. Shared exact numeric representation, schemas and coordinated persistence remain technical contracts. Existing optional roster scope, protected-history removal and unchanged faction identity/ownership remain in force; earlier validation deferrals are superseded.


## Faction-affiliation history sequencing and current state — DEC-22 resolved

Order a character's affiliation changes by fictional date, regardless of entry order. Changes sharing a date have an editable sequence; new entries are placed last within that date. The final change in the chronological/same-date sequence determines the current faction, including the unaffiliated state. Backdated entries and corrections recalculate the previous/new affiliation chain while preserving other recorded faction choices. Corrections preserve retained history and its dependencies under the shared integrity contract.

Each transition's previous affiliation derives from the preceding transition's resulting affiliation (or unaffiliated before the first recorded change); its new affiliation is the recorded choice. At any point the character has zero or one faction. Sequencing does not invent time-of-day values, overwrite other choices or infer fictional chronology from edit order. Affiliation history/current faction remain on the character sheet only, never as universe timeline events; associated projects use the same canonical universe-owned history. DEC-22 is resolved, superseding earlier deferred sequencing/current-state/correction rules. Exact order serialization, reference preservation and coordinated derived-state publication remain technical contracts.


## Default chapter word-count target — DEC-23 partial decision

The default word-count target for each chapter is 2,500 words. This is the per-chapter writing target, not a target of 2,500 chapters. Targets remain informational and never prevent chapter creation, continued writing or saving beyond the target. A default is not a command to overwrite existing saved target values.

Jo has specified this default. DEC-23 remains open for chapter-count target scope, whether targets can be cleared/unset, acceptance of zero and other numeric validation. The preceding proposal for those remaining rules has not been approved by this default-setting instruction. Shared schema/publication and UX details remain implementation gates.


## Writing-target scope and validation — DEC-23 resolved

Each story has an optional chapter-count target. Each chapter has a word-count target defaulting to 2,500 words; either kind of target can be cleared, with blank meaning unset. Targets accept whole numbers of zero or more. Negative, fractional or nonnumeric values produce a field error rather than being silently rounded or committed as valid targets. Zero is an explicit numeric target, distinct from unset. Existing saved targets are not overwritten by the default.

Targets are informational: they never limit chapter creation, writing or saving beyond them, truncate content or change chronology. Per-story chapter-count targets remain attached to that story and per-chapter word targets to that chapter identity through rename/volume regrouping and save/reopen. DEC-23 is resolved and earlier target-scope/unset/zero/validation deferrals are superseded. Exact numeric serialization and safe settings/object publication remain shared technical contracts.


## Chapter/event link eligibility and entry defaults — DEC-24 resolved

Any canonical event in the same universe can be linked to a chapter, including birth and character background events. Each chapter/event pair has exactly one depiction role, main event or flashback; the same event may be linked to multiple chapters. Either role may reference an event outside the chapter's dates without changing the event date or chapter dates. Character-sheet-only faction-affiliation history remains excluded from event choices.

A selected timeline date prefills a new event's date in the dedicated editor, where it remains editable. Linking an existing event preserves its date; the selected timeline date does not overwrite it. Links refer to canonical event UUIDs and owning-universe identity without creating copies. DEC-24 is resolved; earlier eligibility/role/range/prefill deferrals are superseded. Existing independent-date, dedicated-editor, pending-save and retained-reference contracts remain binding. Exact schemas and cross-store publication remain technical gates.


## Chapter timeline focus and out-of-period navigation — DEC-25 resolved

For a chapter with both dates, focus the timeline on its start-to-end period. For a start-only or end-only chapter, focus the recorded date without inventing another date. For an undated chapter, keep the current timeline view. These focus rules do not alter the chapter-list sorting contract: chapters without a start remain first in creation order, and an end date is not a substitute sorting key.

Linked events outside the focused period remain listed, with “Go to event” and “Return to chapter period” actions. These actions only change the view; they never shift event dates, change chapter dates/content or remove depiction links. Returning uses the chapter's accepted focus rule, including its single-date or undated view behavior. DEC-25 is resolved, superseding earlier partial/absent-date and out-of-period-navigation deferrals. Existing pending-manuscript-save protections apply to navigation; exact layout/query contracts remain PLAN-04/TECH-01 work.


## Decision-maker eligibility and references — DEC-26 partial decision

A maker is an existing character or faction in the same universe. Each decision/event has at most one maker. Store its canonical identity reference so renames appear automatically without copying names or creating project-local makers. Personal Decisions require a maker; Story Decisions and Universe Events allow none. Removing a referenced maker requires resolving affected references first, while preserving retained history/dependencies under the shared integrity contract.

These maker rules are accepted; foreign-universe, missing or ineligible references are invalid. This approval does not choose maker requirements for custom decision types, which remain DEC-30. DEC-26 remains open for explicit character/story-arc context association meaning, ownership, editing and relevance/query rules. Maker identity alone is not an approval of any automatic context association. Shared schemas, validation and safe publication remain technical gates.


## Decision contextual associations and relevance — DEC-26 resolved

A decision can be explicitly associated with multiple characters and multiple stories sharing its universe. An association means “relevant to”, independently of the maker; maker selection, a shared date or timeline proximity does not automatically create a context association. Character associations belong to the universe; story associations belong to the owning project and reference the canonical universe decision. Add/remove associations through the decision editor without deleting the decision or other associations, preserving protected retained references.

Character views show decisions explicitly associated with that character. Story/story-arc context shows decisions explicitly associated with that story, without adding a separate arc entity. Writing context combines decisions associated with the selected story with decisions associated with the selected chapter's characters, presenting each canonical decision once when multiple associations match. These relevance rules are subject to the separately agreed view/filter constraints; they do not create new chapter dates or move records into the chapter period. Associated projects share universe decisions/character associations while keeping their story associations scoped to their own project.

Together with the accepted at-most-one same-universe character/faction maker rules, this resolves DEC-26. Exact cross-root association schemas, commands, reference preservation and coordinated publication remain technical gates; filter rules remain DEC-29/30. Earlier context-association deferrals are superseded.


## Decision-result event eligibility and chronology — DEC-27 resolved

Any canonical event in the same universe can be a decision result, including birth and character background events. The result event may occur on the decision's date or later. Reject an earlier result date with a clear validation error; never move either date automatically to make a link valid. Character-sheet-only faction-affiliation history remains excluded from result-event choices. Use the shared exact elapsed chronology for comparison rather than display strings.

Existing many-to-many event-result relationships, canonical UUID reuse, optional standalone events and link-derived resolution remain unchanged. DEC-27 is resolved, superseding earlier event-eligibility/temporal-validation deferrals. Shared validation/publication contracts must preserve this relationship invariant through linked writes without partially changing relationships or status; exact schemas/protocols remain technical gates.


## Direct decision-link validation — DEC-28 resolved

A decision may lead to multiple decisions and have multiple preceding decisions. Direct decision relationships are many-to-many, directed and confined to canonical decisions in the same universe. Reject self-links and any new link that would create a directed cycle, including cycles among same-date decisions. A following decision may occur on the source decision's date or later; reject an earlier following date. Validation errors leave dates and existing links unchanged, with no automatic date shifts. Existing duplicate-pair prevention remains in force.

Either an outgoing following-decision link or an outgoing result-event link resolves its source; neither means unresolved. Incoming links alone do not resolve the receiving decision, and downstream status does not propagate. DEC-28 is resolved and earlier cardinality/self-link/cycle/temporal deferrals are superseded. Shared graph/date validation and coordinated publication must preserve these invariants through linked writes; exact schemas and protocols remain technical gates.


## DEC-30 — Custom decision types and makerless records (approved 2026-10-17)

Custom decision types belong to their universe and are shared by projects using it. At type creation, choose **Maker required**, defaulting to optional. Names must be nonblank and unique within that universe, ignoring case and surrounding spaces, including built-in category names. Existing Personal-required/Story-optional maker rules remain binding; type rename/delete and arbitrary custom fields are not added.

Changing a decision's type preserves its content and links. If the new type requires a maker, saving requires selecting one eligible same-universe character or faction under DEC-26; invalid changes do not publish a partial update. Story-type assignment alone never creates a story association.

Makerless records display **No maker**, with a matching maker-filter option. They appear by default; selecting only named makers hides them. No maker is a display/filter choice, not a fabricated canonical maker. It participates in the approved DEC-29 OR-within/AND-across filtering rules. Type definitions and assignments survive reopening; exact versioned schemas, publication and layouts remain technical/UX work.

## DEC-06 — Bundled LibreOffice export engine (approved 2026-10-17; decision resolved)

Jo selected **Bundle** after discussing LibreOffice as the alternative export engine. Bundle a compatible LibreOffice runtime with each supported WritingTool build, using it headlessly for DOCX and PDF conversion. Users do not need a separate LibreOffice installation or hosted conversion service. Build a styled temporary document from the same matched WritingTool-owned manuscript text/formatting snapshot, then convert through LibreOffice and publish under the approved Save As/replacement/failure contract. Keep Markdown and TXT as application-owned TypeScript serializers implementing their approved mappings. The earlier docx-library/Electron-printToPDF proposal is superseded, not an adopted fallback.

Live manuscript storage remains plain-text WRT plus companion JSON and coordinated catalog state. All approved chapter selection/order/capture, formatting, naming, replacement and result/failure behavior remains binding. DEC-06 is resolved at the product/tool-selection level, not evidence of completed conversion or packaging.

Before installed acceptance, select and pin compatible LibreOffice builds for each accepted OS/architecture; verify runtime bundling, applicable redistribution notices/source obligations, font availability/embedding rights where relevant, A4/margins/spacing/style fidelity, Unicode, scene markers and chapter pagination. Use a dedicated writable conversion profile and temporary workspace; coordinate subprocess completion/failure/cancellation and final publication through application infrastructure without granting a renderer authoritative filesystem access. TECH-01/02/03/05/12 and DEC-09/10/11 cover exact intermediate format/conversion schemas, safe publication/lifecycle, dependency integration, installed platform and performance verification. These are implementation gates, not unanswered product choices under DEC-06.

## DEC-09 — First-release installers and platform targets (approved 2026-10-17)

| Platform | First-release target | Installer |
| --- | --- | --- |
| Windows | Windows 10/11, x64 | `.exe` |
| macOS | macOS 13+, Intel x64 and Apple Silicon ARM64 | `.dmg` |
| Linux | Ubuntu 22.04+ and Debian 12+, x64 | `.deb` |

Each build includes desktop/application-menu integration and the approved bundled LibreOffice export runtime, alongside the bundled application runtime. Verify compatibility with Pop!_OS, Zorin and Mint individually. Windows and Linux ARM builds are deferred beyond first release. Keep live writing folders separate from installation.

DEC-09 settles the intended support targets and installer formats, not proof of compatibility. DEC-10 must establish platform test access and verification, and TECH-11/12 must verify compatible actual runtime/native/LibreOffice versions and packaging. A minimum-version target is not an assertion that every future OS version is already verified.

## DEC-10 — Installed-platform verification plan (approved 2026-10-17; access pending)

Test clean installation, launch, menu integration, upgrade and uninstall while preserving writing data. Test editing/save/reopen, backup/restore and all four manuscript export formats. Verify the bundled LibreOffice conversion runtime on machines without a separate LibreOffice installation. Cover minimum supported OS versions under DEC-09 and both Intel and Apple Silicon Mac architectures. Verify Pop!_OS, Zorin and Mint individually, recording exact tested versions.

Jo approved this plan but did not identify Windows, Intel Mac or Apple Silicon Mac hardware, VM or tester access. The current workstation was observed as Zorin OS 18.1 x86_64; that observation is not an installed-build test result. DEC-10 remains open for establishing actual test access/coverage. Do not infer device access, paid-service authorization or passed tests from approval. Continue independent DEC-11 performance/corpus planning while access is pending.

## DEC-11 — Performance corpus specification (approved 2026-10-17; timing targets pending)

Use a generated baseline containing ten stories, 100 chapters total, approximately 250,000 words across two volumes, 10,000 events, 200 characters, 20 factions, 1,000 linked decisions and 100 images totaling approximately 500 MB. Include rich formatting, Unicode, custom calendars, revisions and backups. Add a larger dataset with ten times the content to test growth. These are test workloads, not application limits.

Jo approved this corpus specification; no dataset has yet been generated or performance test run. Fixture generation must create valid same-universe ownership/relationships and matched manuscript/formatting versions under the shared contracts. Record actual generated sizes and retained-history/backup content so measurements can be reproduced. Approved budgets and reference-machine/measurement conditions follow below; DEC-11 is resolved, while fixture generation and actual measurement remain VERIFY-10 work.

## DEC-11 — Performance budgets and measurement conditions (approved 2026-10-17; decision resolved)

| Operation | Baseline target | Ten-times-content target |
| --- | --- | --- |
| Keystroke to visible text | ≤50 ms | ≤100 ms |
| Switch chapter | ≤300 ms | ≤600 ms |
| Refresh timeline or filters | ≤500 ms | ≤1 second |
| Save changed chapter durably | ≤1 second | ≤2 seconds |
| Open project, ready to write | ≤5 seconds | ≤10 seconds |
| Capture revision | ≤10 seconds | ≤100 seconds |
| Complete ZIP backup | ≤60 seconds | ≤600 seconds |
| Export whole story, any format | ≤60 seconds | ≤600 seconds |

Measure installed builds on a reference machine with four CPU cores, 16 GB RAM and a local SSD, recording exact hardware and dataset sizes. Targets must hold for at least 95% of measured runs. For the ten-times dataset, allow twice the interactive latency and ten times the revision/backup/export duration as shown above. Typing must remain responsive during background work.

These conditions join the approved generated baseline and ten-times-content corpus specification. They define acceptance targets, not measured results or new application limits/minimum supported hardware. Fixture generation, instrumentation, reproducible run counts/cache conditions and exact hardware records remain verification work under VERIFY-10; preserve durable-save/complete-capture semantics when measuring instead of acknowledging early. DEC-11 is resolved. No fixtures have been generated and no performance results are claimed by this planning update.

## PLAN-04 — Main writing workspace layout (approved 2026-10-17; UX discovery in progress)

Jo approved dedicated DESIGN.md for appearance and EXPERIENCE.md for interactions. Main workspace: left project/volume/story/chapter navigation, center manuscript editor, bottom universe timeline with maker/category filters, and right tabs for character/faction/plot/decision context. Side and bottom panels are resizable and collapsible, and their arrangement is remembered. Exact dimensions, arrangement-persistence scope, visual identity, smaller-window behavior and remaining surfaces/recovery-error interactions still need capture.

UX discovery workspace: `planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/` under `_bmad-output`. Its spines remain draft/frontmatter-only during discovery; accepted intake decisions are in its append-only memlog. No approved colors, typefaces, spacing scale or UI component library is inferred from this layout approval.

## PLAN-04 — Movable panels and visual preferences (2026-10-17)

Jo requires UI panels to be movable as well as resizable/collapsible, with remembered arrangement. The approved left/center/bottom/right workspace is the starting arrangement, not fixed placement. Exact panel scope, docking/floating and arrangement persistence scope remain to be clarified in UX discovery.

Jo prefers darker UI colours and requires a non-white writing-panel background. Light gray is a tentative candidate, not a committed color token. No exact palette, text colors or typography are inferred. These decisions are captured in the UX workspace memlog; draft DESIGN.md/EXPERIENCE.md remain in Discovery.

## PLAN-04 — Docked and floating panels (approved 2026-10-17)

Jo selected both movement modes: panels can dock elsewhere inside the application and detach into independent floating windows, including placement on another monitor. Remembered arrangement, resizing/collapsing and the approved initial workspace remain binding. Docked and floating presentations use the same canonical selected-unit content and established save/navigation protections; floating is not a new copy of the manuscript or another live universe authority.

Exact eligible-panel inventory, docking targets, persistence scope, floating-window close behavior and recovery when a saved monitor is unavailable remain UX Discovery questions. No window-management implementation or platform testing is claimed.

## PLAN-04 — Closing floating panels (approved 2026-10-17)

Closing a floating panel hides it until reopened; it does not automatically dock back into the main window. Hiding preserves the panel's content and pending edits under existing save/lifecycle contracts and does not delete records or initiate whole-application close. The panel-reopen entry point and unavailable-monitor/off-screen placement behavior remain to be defined in UX discovery.

## PLAN-04 — Unavailable monitor fallback (approved 2026-10-17)

When a floating panel's saved monitor is unavailable/disconnected, dock the panel in the main window rather than reopening it as a floating window on another monitor. Preserve content, pending edits and canonical identity under the existing save/lifecycle rules. This fallback does not alter the separate approved rule that explicitly closing a floating panel hides it until reopened. Exact fallback docking position, subsequent monitor-reconnection behavior, hidden-panel reopen entry point and arrangement persistence scope remain UX discovery details.

## PLAN-04 — Hidden-panel reopen controls (approved 2026-10-17)

Provide controls at the top of the main window to reopen hidden panels. Jo selected the top location; exact menu/button presentation, labels and visual treatment remain unspecified. Preserve the approved hide-on-floating-close and dock-on-unavailable-monitor behavior.

## PLAN-04 — App-wide remembered panel layout (approved 2026-10-17)

Remember one panel layout for the whole application, shared across projects, rather than separate per-project layouts. Apply the accepted movable/dockable/floating/resizable/collapsible panel behavior and remembered arrangement at that app-wide scope. Top-of-main-window hidden-panel controls, hide-until-reopened on floating-panel close and main-window docking when a saved monitor is unavailable remain binding. Exact layout persistence schema, docking/reconnection details and visual styling remain implementation/discovery work.

## PLAN-04 — Gray writing-panel background (approved 2026-10-17)

Jo confirmed gray for the writing-panel background. Gray is accepted; exact shade/lightness and manuscript text color remain unselected. This supersedes the earlier tentative light-gray suggestion without fixing a light-gray token. Preserve the darker overall UI preference and non-white writing-background requirement.

## PLAN-04 — Selectable manuscript font (approved 2026-10-17)

The manuscript font must be selectable, not fixed to one typeface. Default font, available-font source, preference scope/persistence and whether selection changes editor display only or saved manuscript/export formatting remain to be clarified. This answer alone does not alter the approved DOCX/PDF 12-point serif export defaults or add per-selection font-family metadata to the shared manuscript contract.

## PLAN-04 — Writing-panel-only font choice (approved 2026-10-17)

The selectable manuscript font affects writing-panel display only. It does not alter saved manuscript font-family formatting or the approved DOCX/PDF 12-point serif export defaults. Existing bold/italic/indent/heading/scene-break formatting remains binding. Available font source/default, display size controls and preference persistence scope remain unspecified.

## PLAN-04 — Adjustable writing-panel font size (approved 2026-10-17)

Writing-panel font size must be adjustable, alongside selectable font family. Both are display preferences only: do not change saved manuscript font-family/size metadata or approved DOCX/PDF typography. Exact size defaults/range/control presentation, available font source and preference persistence scope remain unspecified.

## PLAN-04 — App-wide writing-panel typography preferences (approved 2026-10-17)

Remember the chosen writing-panel font family and size app-wide across sessions and projects, rather than separately per project. Both remain display preferences only and do not alter approved export typography or saved manuscript formatting contracts. Available font source/default, exact size range/control and unavailable-font fallback remain unspecified.

## PLAN-04 — Installed and bundled writing fonts (approved 2026-10-17)

The writing-panel font picker offers both fonts installed on the computer and a bundled font collection. Exact collection members/default font, font-size range/control and unavailable-font fallback remain unselected. Font family/size remain app-wide remembered display preferences; export typography and saved manuscript formatting contracts stay unchanged. Verify installed-font discovery and bundled-font licensing/packaging on the approved desktop platforms under TECH-12 before acceptance.

## PLAN-04 — Always-gray writing background (approved 2026-10-17)

Jo chose always gray rather than a customizable writing-panel background. Do not add a writing-panel background color picker. Exact gray shade remains unspecified. Preserve the darker overall UI preference, existing light/dark/system application themes and app-wide display-only selectable writing font family/size.

## PLAN-04 — Center event editor from writing (approved 2026-10-17)

Opening **Edit event** from a chapter uses the center of the main workspace, temporarily replacing the writing panel with the dedicated canonical event editor. Existing save-before-navigation protection and canonical event/date independence remain binding. Return control, event save/cancel behavior, restored writing position/focus and navigation with pending event edits remain unspecified; this choice alone does not settle other record-editor placements.

## PLAN-04 — Event editor stays open after save (approved 2026-10-17)

After a successful event save, keep the dedicated center event editor open rather than automatically returning to the chapter. Existing validation, canonical identity and save/failure protections remain binding. Explicit return control, chapter/caret/scroll restoration and leaving with pending event edits remain to be defined.

## PLAN-04 — Leaving an event editor with unsaved changes (approved 2026-10-17)

When leaving the event editor with unsaved changes, ask **Save / Discard / Cancel** rather than automatically saving. Save must succeed before the requested departure; validation/write failure retains pending edits and blocks departure. Discard explicitly abandons pending event edits without deleting or changing the previously saved canonical event. Cancel keeps the event editor and pending changes.

Ordinary event Save keeps the editor open. Save chosen in the departure prompt permits that requested departure only after success. The existing manuscript save-before-navigation and required normal whole-application close/save/revision/backup rules remain binding; this event-navigation prompt does not bypass those guarantees.

## PLAN-04 — Shared center record-editor behavior (approved 2026-10-17)

Character, faction, decision and plot editors follow the approved event-editor pattern: open in the center, stay open after ordinary Save, and ask **Save / Discard / Cancel** before leaving unsaved edits. Prompt Save must succeed before departure; failures retain edits and block departure. Discard abandons only unsaved changes; Cancel keeps the editor and pending edits. Retain each type's established validation, completeness/saveable-draft and canonical ownership rules.

This approval does not select calendar, recovery/reconciliation, settings or export containers. Explicit return-to-writing control and chapter/caret/scroll restoration remain unspecified.

## PLAN-04 — Back to writing (approved 2026-10-17)

Provide **Back to writing** from the shared center record editors, restoring the same chapter, cursor position and scroll position. If the record editor has unsaved changes, first apply its approved Save / Discard / Cancel prompt. Return after successful Save or explicit Discard; Cancel or failed Save retains the editor and pending edits. Returning does not mutate canonical content or dates. Exact button position/appearance and handling if the original chapter is unavailable remain unspecified.

## PLAN-04 — Project chooser on launch (approved 2026-10-17)

Show a project chooser when WritingTool launches, rather than automatically reopening the last project. Opening a selected project remains subject to the accepted matching-universe authority/schema/reference gates. Preserve remembered app-wide panel layout and writing display preferences. Exact chooser actions/content, recent-project behavior, standalone-universe entry and empty/missing-project presentation remain unspecified.

## PLAN-04 — Project chooser action hierarchy (approved 2026-10-17)

**Open project** is the main chooser action, alongside secondary **New project**, **Open universe** for standalone work and **Recover from backup** actions. Existing project/universe authority and recovery gates remain binding. Showing recent projects has not yet been explicitly confirmed; exact chooser composition, controls and empty/missing states remain unspecified.

## PLAN-04 — Recent projects in launch chooser (approved 2026-10-17)

Show a recent-project list in the launch chooser for quick reopening. Open project remains primary; New project, standalone Open universe and Recover from backup remain secondary. List capacity/order/metadata, missing-path/remove behavior and precise appearance are not selected by this approval.

## PLAN-04 — Approved project chooser reference (2026-10-17)

Jo approved `planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/.working/chooser-preview.html` under `_bmad-output` as the launch chooser layout/reference, including Open project primary, three secondary actions and recent-project area. Styling/list details explicitly marked provisional are not silently final tokens. Missing/moved recent-project behavior remains unspecified.

## PLAN-04 — Missing or moved recent project (approved 2026-10-17)

When a recent project has moved or cannot be found, offer all three: **Locate project** to find its new location, **Remove from recents** to remove only the list entry while leaving files untouched, and **Cancel** to return to the chooser. Locating remains subject to matching project/root identity and authority/schema checks; it must not silently activate different data. Existing root-relative relocation and single-base-record rebinding contracts remain binding. Exact error/control presentation and list metadata remain unspecified.

## PLAN-04 — Center calendar, settings and recovery surfaces (approved 2026-10-17)

Calendar setup, settings, revisions and backup/recovery screens use the center area. Provide **Back to writing** when opened from a chapter, restoring its writing position under the existing navigation guarantees when that chapter is available.

This approval settles placement and return availability, not new save/cancel semantics. Preserve each workflow's calendar chronology/validation, settings atomic validation/import, protective Replaced capture, reconciliation cancellation/confirmation/freshness and authority gates. Do not copy record-editor Discard behavior into recovery or bypass an active operation's integrity rules. Active-operation return/cancel handling, no-chapter return routes and detailed screen composition remain unspecified.

## PLAN-04 — Manual backup/export finishes before writing return (approved 2026-10-17)

A manual backup or export must finish before returning to writing; do not allow Back to writing while that manual operation remains active. Preserve the existing operation-specific failure/retry/location/cancellation paths, without treating failed/canceled output as a completed artifact. Required normal-close operations still follow their separate success-before-close rules.

This choice does not replace independent scheduled save/revision/backup background behavior or its typing-responsiveness requirement, and does not establish a global lock on unrelated projects. Exact progress/cancel/terminal-return presentation remains unspecified.

## PLAN-04 — Top commands grouped by category (approved 2026-10-17)

All commands must be available at the top. Group related commands into a dropdown for each category. This includes access to Export, Backup, Revisions, Settings and reopening hidden panels. Preserve the approved left hierarchy/right context navigation and source-required contextual actions such as Edit event; this requirement does not remove those navigation paths.

Exact dropdown categories, command membership/order, shortcut behavior and appearance remain unspecified.

## PLAN-04 — Approved top dropdown categories (2026-10-17)

| Dropdown | Commands |
|---|---|
| Project | Create/open projects, stories and volumes |
| Writing | Chapters, formatting, targets and plots |
| Universe | Calendar, events, characters, factions and decisions |
| View | Panels, layout and writing-display preferences |
| Revisions | View and restore earlier work |
| Backup & Recovery | Create backups and recover work |
| Export | Manuscript and database exports |
| Settings | Schedules, retention, destinations, themes and settings import/export |

All commands remain accessible from the top category dropdowns, with existing hierarchy/contextual links preserved. Grouping does not change canonical ownership or add features beyond accepted scope. Exact item order/submenus, keyboard behavior and styling remain to specify.

## PLAN-04 — Dark first-launch theme (approved 2026-10-17)

Default the application to **Dark** on first launch. Retain Light, Dark and System theme choices and preserve saved/imported preferences on subsequent launches. System mode follows OS changes when selected. Writing-panel background remains gray; this decision does not select exact palette tokens or replace display-only app-wide font preferences.

## PLAN-04 — Keyboard, mouse and visible shortcuts (approved 2026-10-17)

Support both keyboard and mouse operation for commands and panel interactions. Show keyboard shortcuts for applicable commands, including alongside commands in top category dropdowns. Moving/docking panels needs keyboard as well as mouse operation; exact control mechanism and shortcut bindings remain to define. No shortcut customization feature is inferred.

Platform-specific bindings, precise keyboard/focus behavior and separate accessibility targets/screen-reader semantics remain unspecified. Do not treat this answer as approval of a particular conformance claim.

## PLAN-04 — Side-by-side revision comparison (approved 2026-10-17)

Before restoring a revision, show the current and selected versions side by side in the center revision/restoration surface, clearly distinguishing them before confirmation. Preserve mandatory protective Replaced capture and all existing restoration/reference/authority/freshness gates.

This does not select automatic diff highlighting, merge/edit functionality, synchronized scrolling or additional partial-restore granularity. Detailed comparison composition for manuscripts, structured records, images and project scope remains unspecified.

## PLAN-04 — Plain revision comparison (approved 2026-10-17)

Show current and selected revision side by side with clear version labels and without highlighting added, removed or changed text/fields. Preserve restore confirmation, protective Replaced capture and all reference/authority rules. Comparison scrolling and recovered-record conflict presentation are not settled by this decision.

## PLAN-04 — Live/Recovered conflict comparison (approved 2026-10-17)

For recovery conflicts, use the same plain side-by-side comparison layout, labeled **Live** and **Recovered**, without change highlighting. Expose the existing **Keep live / Use recovered / Edit combined** choices. Preserve all accepted per-record resolution, missing-reference, confirmation, protective history, freshness and resumable-cancellation/inactive-recovery rules.

This does not introduce automatic merging or select conflict ordering, batch actions, Edit combined form or list/detail navigation.

## PLAN-04 — Selectable recovery conflict list (approved 2026-10-17)

Show recovery conflicts in a selectable list beside the plain Live/Recovered comparison. Selecting an entry displays that conflict for inspection/resolution; selection alone does not apply recovered data. Preserve per-record choices and explicit final confirmation. No batch resolution, search/order feature or automatic/default conflict choice is introduced. Exact list metadata/status presentation and Edit combined form remain unspecified.

## PLAN-04 — Separate Edit combined editor (approved 2026-10-17)

Recovery **Edit combined** opens a separate editor for the proposed result rather than a third editable pane alongside Live and Recovered. Preserve both source versions and the existing proposed-choice/confirmation/freshness/reference gates before applying recovery.

“Separate editor” does not itself imply an operating-system floating window. Exact container, return path and draft-save/cancel behavior remain unspecified; preserve resumable recovery cancellation and do not mutate live source data merely by editing the proposal.

## PLAN-04 — Center Edit combined editor (approved 2026-10-17)

The separate **Edit combined** editor opens in the center, temporarily replacing the recovery conflict comparison rather than opening a floating window. Preserve the conflict-list/comparison navigation context and both source versions. Combined edits remain proposed recovery choices until the existing confirmation/freshness/reference gates pass. Exact draft-save/cancel/return behavior remains unspecified.

## PLAN-04 — Advance after saving a combined proposal (approved 2026-10-17)

After successful validation/save of an Edit combined proposal, open the next unresolved conflict. If no conflicts remain, close the conflict editor. Failed validation/save retains the proposed edits and does not advance.

Closing the conflict editor is not automatic recovery application or whole-application close. Preserve missing-reference resolution, explicit final recovery confirmation, protective history, freshness/authority and other accepted activation gates. Exact conflict ordering and whether Keep live/Use recovered choices also advance remain unspecified.

## PLAN-04 — Shared conflict-choice progression (approved 2026-10-17)

Successfully recording **Keep live** or **Use recovered** opens the next unresolved conflict, just like successful Edit combined save. When none remain, close the conflict editor. Failed choice recording preserves the current state and does not advance or claim resolution. Existing final recovery confirmation, missing-reference, protective, freshness and authority gates remain binding; no batch or automatic conflict choice is added.

## PLAN-04 — Unsaved Edit combined departure (approved 2026-10-17)

Before leaving Edit combined with unsaved proposal edits, ask **Save proposal / Discard / Cancel**. Save proposal must validate and record successfully, then follows the approved next-unresolved-conflict/close-editor progression. Failure retains the editor and pending edits without advancing. Discard abandons only current unsaved combined edits, preserving both source versions and any previously recorded choices; the conflict stays unresolved unless an earlier valid choice remains. Cancel keeps the editor and pending edits.

This is distinct from canceling overall resumable recovery. Final confirmation, missing-reference, protective, freshness and authority gates remain binding.

## PLAN-04 — Final recovery summary and actions (approved 2026-10-17)

Before applying recovery, show a final summary of affected items and chosen resolutions, with **Apply recovery / Review choices / Cancel recovery**. Cancel recovery preserves the pending recovery for later. Review choices returns to inspection/change of recorded choices without applying live changes.

Apply recovery remains subject to all accepted missing-reference, protective, schema, freshness and authority gates. Closing the last conflict editor does not apply recovery or claim completion; unresolved gates must still be resolved before activation.

## PLAN-04 — Approved recovery-flow reference (2026-10-17)

Jo approved `planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/.working/recovery-flow-preview.html` under `_bmad-output` as the recovery conflict/combine/final-summary composition reference. All previously approved integrity, progression, cancellation and final-confirmation rules remain binding. Exact styling, placeholder content and list metadata marked provisional remain unspecified.

## PLAN-04 — Left-to-right timeline (approved 2026-10-17)

Display timeline time horizontally from left to right, earlier to later, under the accepted fictional calendar and elapsed-chronology rules. Preserve date-only records, exact arbitrary-precision years, chapter-focus navigation, same-date ordering and visibility contracts. Lane/category arrangement, scale/zoom, overlapping-record presentation and exact styling remain unspecified.

## PLAN-04 — Vertical graphical timeline (override approved 2026-10-17)

This supersedes the earlier left-to-right timeline choice. Display the timeline vertically in its own control, using a straight line from top to bottom with intersecting horizontal marks/lines for records. Decisions are blue; events are red. The record marks are selectable.

Own control does not itself require a separate operating-system window or choose a new initial docking position. Preserve movable/dockable/floating panel behavior and all existing fictional chronology, date-only/arbitrary-precision year, filter, canonical identity and same-date ordering contracts. Exact blue/red shades, labels/date placement, selected-state treatment, same-date collision arrangement and selection-versus-editor activation remain unspecified. No category-row choice was selected.

## PLAN-04 — Left-docked vertical timeline (override approved 2026-10-17)

Initially dock the dedicated vertical graphical timeline control on the left. This supersedes its earlier bottom starting position. Keep its straight top-to-bottom axis, selectable blue decision/red event horizontal marks and all approved movable/dockable/floating/resizable/collapsible behavior with one app-wide remembered arrangement.

Project/volume/story/chapter navigation was also originally left; its precise coexistence/repositioning relative to the timeline remains to be clarified. This decision does not silently move navigation to another edge or combine the two controls into tabs. Selection effect, labels, same-date arrangement and scale/zoom remain unspecified.

## PLAN-04 — Independently visible/hidden workspace controls (approved 2026-10-17)

Workspace controls/panels, including timeline and project/chapter navigation, can be shown or hidden independently through the top **View** category. Remember visibility in the one app-wide panel arrangement. Hiding preserves content and pending edits; it does not delete records or force mutually exclusive tabs.

The timeline still initially docks left. This visibility choice does not specify a new fixed navigation position or exact geometry when multiple left-docked controls are simultaneously visible; retain the approved movable/dockable layout behavior.

## PLAN-04 — Timeline selection opens center editor (approved 2026-10-17)

Selecting a blue decision or red event timeline mark opens that canonical record's editor in the center. Apply existing manuscript save-before-navigation and record-editor Save / Discard / Cancel protections before switching. Failed Save or Cancel retains the current editor and pending edits. Ordinary Save stays in the selected record editor; Back to writing restores the original chapter/cursor/scroll under accepted rules.

No required double-click or separate read-only details step is introduced. Exact record/date labels, same-date mark arrangement and scale/zoom remain unspecified.

## DEC-38 — Event/decision short name or code (accepted requirement 2026-10-17; rules pending)

Each canonical event and decision must have a short name or code. Display that short label on its timeline mark, rather than the full event heading or decision text. This is a display field separate from keyboard shortcuts and the permanent UUID used for identity/relationships. Retain existing event heading/optional description and decision text; the new label does not replace them or add universe context to manuscript exports.

Required field behavior is accepted; whether labels are entered/generated, uniqueness scope, exact validation/length/characters, editing/rename behavior and existing-record migration remain to specify under DEC-38/TECH-01 before affected implementation. No uniqueness, auto-generation or normalization rule is inferred. The preceding date-placement question was not answered by this requirement.

## DEC-38 — Automatically generated timeline labels (approved 2026-10-17; rules pending)

WritingTool automatically generates each event/decision's required short name or code for display on its timeline mark. Manual entry is not required. Exact format/prefix/sequence, uniqueness scope, editability/rename behavior and existing-record backfill remain unspecified. No E/D numbering, immutable-label rule or keyboard shortcut is inferred; permanent UUID and full heading/text remain unchanged.

## DEC-38 — Editable generated timeline codes (approved 2026-10-17; rules pending)

Automatically generated event/decision short names or codes may be edited afterward. Code changes alter the display label, not the permanent UUID, canonical identity, dates or relationships. Exact generation format/prefix/sequence, uniqueness scope, edit validation and migration/backfill remain unspecified; no renumbering/reuse rule is inferred.

## DEC-38 — Generated code format and uniqueness (approved 2026-10-17; remaining rules pending)

Generate event defaults **E001, E002, …** and decision defaults **D001, D002, …**. Numbering expands beyond 999; it is not a record limit. Require codes to be unique across both event and decision records within the same universe. Codes remain editable and separate from permanent UUIDs.

Exact case/whitespace normalization and validation, generation assignment/reuse/stability, live rename propagation and missing-code backfill details remain to settle under DEC-38/TECH-01; no normalization or renumbering rule is inferred by this approval.

## DEC-38 — Final timeline-code rules (approved 2026-10-17; decision resolved)

Each event/decision has a required, automatically generated but editable short code displayed on its timeline mark, separate from permanent UUID and full event heading/decision text. Event defaults are E001, E002, …; decision defaults D001, D002, …, expanding beyond 999.

Require nonblank codes and trim surrounding spaces. Enforce case-insensitive uniqueness across both event and decision records within the same universe. Allocate generated numbers in creation order, advancing past previously issued numbers and occupied codes. Date changes and record reordering keep codes stable. Code edits refresh all live views; retained revisions preserve their original codes and identities.

DEC-38 is resolved at the product-rule level. TECH-01/02/04/09/11 still define exact versioned fields/canonicalization, durable atomic allocation and conflict validation, missing-code backfill/migration, history and coordinated publication. No runtime implementation, migration or verification result is claimed. Required-field/duplicate failure preserves pending edits and previously committed state under existing validation/publication contracts.

## PLAN-04 — Same-date timeline groups (approved 2026-10-17)

Group events/decisions sharing the same date at one vertical timeline position, with their short codes stacked beside it. Each remains individually selectable, with decisions blue and events red. Preserve exact dates, canonical identities and applicable saved same-date order. Visual stacking must not invent times of day or different chronological dates. Exact date-label position, group geometry and scale/zoom presentation remain unspecified.

## PLAN-04 — Fictional-date group labels (approved 2026-10-17)

Display the fictional date beside each same-date timeline group, using the owning universe's accepted calendar/display contract. Preserve the vertical top-to-bottom line, initial left docking, blue decision/red event short-code stack and individual selection opening the center editor. Grouping must not invent dates or times. Exact date-label geometry/style, spacing and scale/zoom remain unspecified.

## PLAN-04 — Approved vertical timeline grouping reference (2026-10-17)

Jo approved `planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/.working/timeline-preview-v2.html` under `_bmad-output` as the vertical timeline code/date-group composition reference. Preserve all accepted chronology, short-code, filter, panel and editor-selection rules. Exact styling/geometry and illustrative placeholder data remain provisional; scrolling/zoom presentation remains unspecified.

## PLAN-04 — Elapsed-time timeline gaps (approved 2026-10-17)

At the selected zoom scale, vertical gaps between date groups reflect elapsed time: longer elapsed intervals produce larger gaps. Same-date records still share one position with individually selectable stacked codes. Use the accepted exact fictional chronology/calendar contract; visual spacing must not invent dates, times or chronological offsets. Exact scroll/zoom controls, label-collision handling and viewport/scale numeric mapping remain unspecified.

## PLAN-04 — Timeline scroll and zoom controls (approved 2026-10-17)

Navigate the vertical timeline with the mouse wheel and scrollbar. Provide **Zoom in / Zoom out** under the top View dropdown, showing their keyboard shortcuts. Preserve elapsed-time-proportional gaps, shared same-date positions, exact fictional chronology, record selection and existing chapter-period focus/return behavior; zoom changes view only.

Exact shortcut bindings, zoom increments/anchor and numeric viewport mapping remain implementation specifications. Do not turn display scale into a record/date limit or mutate stored dates through zoom.

## PLAN-04 — Decision-tree boxes and arrows (approved 2026-10-17)

Display established decision relationships as connected boxes with directional arrows. Preserve canonical same-universe identity, directed decision/event result links, cycle/date validation, link-derived resolution, explicit relevance and synchronized filtering. This is not a hypothetical-branch or new status system. Exact orientation/container, box content/colors and interaction/navigation remain unspecified.

## PLAN-04 — Left-to-right decision tree (approved 2026-10-17)

The decision relationship tree's connected boxes and directional arrows flow left to right. This is separate from the vertical timeline and does not change its orientation. Preserve all accepted relationship, chronology, resolution and filter rules. Tree container, box content/colors and navigation remain unspecified.

## PLAN-04 — Center decision tree (approved 2026-10-17)

Open the left-to-right connected-box/arrow decision tree in the center area. Apply existing pending-manuscript/record-edit navigation safeguards before replacing the current surface, and retain all graph/status/filter rules. This does not add a dedicated floating tree control or new graph-edit commands. Node content/colors, activation and explicit return behavior remain unspecified.

## PLAN-04 — Decision-tree box content (approved 2026-10-17)

Each decision-tree box displays its short code plus the canonical decision text or event heading, rather than code alone. Reuse existing fields; do not add a separate summary field. Preserve center placement, left-to-right arrows, accepted graph/status/filter behavior and live code-label refresh. Exact wrapping/truncation, node colors/selection, activation and return behavior remain unspecified.

## PLAN-04 — Tree-to-editor and Back to tree (approved 2026-10-17)

Selecting a decision-tree box opens its canonical record editor. Provide **Back to tree** to restore the selected node and tree view. Apply existing pending-manuscript save and record-editor Save / Discard / Cancel guards before switching or returning; failed Save or Cancel retains the current surface and pending edits. Ordinary Save stays open under the shared editor rule. Preserve protected Back to writing context. Exact viewport-state implementation, node colors and status presentation remain unspecified.

## PLAN-04 — Decision-tree colors and status text (approved 2026-10-17)

Use blue for decision-tree decision boxes and red for event boxes, matching timeline record colors. Decision boxes display **Resolved / Unresolved** text from the accepted link-derived rule: any outgoing event/following-decision result resolves its source; incoming links alone do not. Filters preserve that status. Do not add decision status to standalone events.

Retain center placement, left-to-right arrows, code plus decision text/event heading, select-to-editor and Back to tree. Exact color tokens, box shapes and status styling remain provisional pending the visual system.

## PLAN-04 — Approved decision-tree reference (2026-10-17)

Jo approved `planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/.working/decision-tree-preview.html` under `_bmad-output` as the center left-to-right connected-box/arrow composition reference. Preserve accepted code/text labels, blue decisions/red events, canonical textual status, selection/editor/return and graph/filter rules. Exact styling/placeholder data remain provisional.

## PLAN-04 — Pop-up failure and warning dialogs (approved 2026-10-17)

Show save failures and background backup/revision warnings in pop-up dialogs, rather than persistent top banners. Preserve the existing operation-specific retry/cancel/location/normal-close actions, pending edits and prior valid output. Do not add a generic Discard action or change failure/capture semantics merely because feedback uses a dialog.

This choice does not select focus/blocking behavior, warning queue/duplication, successful-operation notifications, manual progress layout or restored-calendar flag placement; those details remain unspecified.

## PLAN-04 — Blocking failure/warning dialogs (approved 2026-10-17)

Save-failure and background backup/revision warning pop-ups block interaction until the user responds. Preserve pending edits, prior valid output and all approved operation-specific Retry/Cancel/location/normal-close behavior. UI modality does not itself add a database lock or replace independent scheduler/writer/operation protocols. Multi-window coordination, dialog ordering and focus mechanics remain implementation details; success/manual-progress/calendar-format feedback is not selected by this answer.

## PLAN-04 — Quiet background-success indicator (approved 2026-10-17)

Successful background saves, revisions and backups use a quiet status indicator rather than a pop-up. Indicate success only after the required durable save or complete revision/backup publication succeeds. Blocking failure/warning dialogs remain binding. Exact indicator placement/detail/persistence remains unspecified; manual export saved-path/Open file/Open folder and other approved explicit outcomes remain unchanged.

## PLAN-04 — Bottom status bar (approved 2026-10-17)

Place the quiet indicator for successful background saves/revisions/backups in a bottom status bar. Reflect only actual durable/complete outcomes. Keep commands in top category dropdowns and failures/warnings in blocking dialogs. Exact wording/detail/history and visual treatment remain routine specifications; persistent calendar-format flag and manual-progress presentation remain unspecified.

## PLAN-04 — Bottom calendar-update indicator (approved 2026-10-17)

Persistently show affected restored data's calendar-update indicator in the bottom status bar, with **Update to current calendar** available. Writing remains allowed while pending. Preserve DEC-32 comparison against current authority/configuration, explicit elapsed-position-preserving update, successful-save-only flag clearing, failed-update retry and protected history/reference/authority rules. Exact contextual aggregation/copy is routine specification; this is not a blocking dialog or automatic calendar replacement.

## PLAN-04 — Center manual-operation progress (approved 2026-10-17)

Show manual backup/export progress in the center, with **Cancel** where cancellation is supported. The operation must reach its outcome before returning to writing. Preserve approved failure/retry/location options, source/prior-output preservation, incomplete-versus-complete distinction and separate required normal-close rules. Exact phase/percentage/spinner rendering and safe cancellation/publication boundaries are implementation specifications, not a change to accepted outcomes.

## PLAN-04 — Calendar/settings form save and departure (approved 2026-10-17)

Manual calendar and settings forms use explicit **Save**, applying valid changes while keeping the form open. Before leaving unsaved manual changes, ask **Save / Discard / Cancel**. Save must validate/publish successfully before requested departure; failed Save preserves the form and pending edits. Discard abandons only unsaved manual edits; Cancel stays.

Preserve approved calendar target correction/elapsed chronology and settings atomic validation/import/missing-field/unknown-field behavior. Do not discard previously saved/imported settings or reinterpret the separate writing-display toolbar preference behavior. Exact field grouping/prompt styling remains implementation specification.

## PLAN-04 — Practical accessibility baseline (approved 2026-10-17)

Provide clear keyboard-focus indicators, screen-reader labels for controls, support for system text scaling and reduced motion, and text/icons alongside status colors. Retain both keyboard/mouse operation, keyboard panel alternatives and visible shortcut hints. Exact focus order/announcements, target geometry and platform behavior remain implementation specifications to verify, especially across floating windows. This approval is not a formal accessibility-conformance certification or passing test result.
