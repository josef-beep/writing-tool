---
id: SPEC-WritingTool
companions:
- requirements.md
- contracts.md
- ../../planning-artifacts/architecture/architecture-WritingTool-2026-10-10/ARCHITECTURE-SPINE.md
- ../../planning-artifacts/prds/prd-WritingTool-2026-10-10/sources/personality-types-list.md
- ../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/DESIGN.md
- ../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md
- data-contracts.md
- publication-contract.md
- readiness-contract.md
- coordination-contracts.md
- universe-storage-contract.md
sources:
- ../../planning-artifacts/briefs/brief-WritingTool-2026-10-10/brief.md
- ../../planning-artifacts/briefs/brief-WritingTool-2026-10-10/addendum.md
- ../../planning-artifacts/prds/prd-WritingTool-2026-10-10/prd.md
- ../../planning-artifacts/prds/prd-WritingTool-2026-10-10/addendum.md
- ../../planning-artifacts/prds/prd-WritingTool-2026-10-10/sources/fero-kia-faction-profile.md
---

> **Canonical contract.** Read this SPEC and every companion together. Older source requirements are superseded where reconciled here; sources provide audit traceability.

# WritingTool

> **Adopted technical foundations:** Jo approved `data-contracts.md` and `publication-contract.md` through the execution approval on 2026-10-17. Read their limits: these foundations do not close the full TECH-01/02 gates or override approved product/UX contracts.

## Why

Jo needs a local desktop workspace that connects manuscript writing to chronological universe context, characters, plots and established decisions, so story position and the history leading to it remain visible and recoverable. The first release serves Jo's own writing.

## Capabilities

- **CAP-1**
  - **intent:** Organize writing within shared universes.
  - **success:** Projects support multiple stories and optional manually ordered volumes without count caps; each story is ungrouped or belongs to one volume and can move between groups. Story order is manual. Linked universe/timeline selectors use one authoritative universe, sharing its calendar, characters, factions and timeline only within that universe. See FR-44–47, AD-6/8–10 and contracts.md.

- **CAP-2**
  - **intent:** Write and plan chapters in the application.
  - **success:** Bold, italics, paragraph indents, headings and scene breaks survive save/reopen; optional chapter ranges, character associations and informational chapter/word targets remain usable while inspecting timeline context. Jo can show/hide decisions by maker and events by type without changing their saved data, links or decision resolution; initial categories are Universe Events, Personal Decisions and Story Decisions with additional decision types supported; filter defaults/combination/persistence follow approved DEC-29 below; custom-type rules follow approved DEC-30 below. See FR-1/42/45/47.

- **CAP-3**
  - **intent:** Plan chronological events from either chapters or the universe timeline.
  - **success:** Both entry directions use the same canonical records; standalone/background/birth events appear at recorded dates; same-date ordering is optional. The chapter view links to the event editor; chapter date changes leave all linked main-event and flashback dates/content unchanged. See FR-5/6/14/35/39–42/46 and contracts.md.

- **CAP-4**
  - **intent:** Define and revise a fictional calendar without changing elapsed story chronology.
  - **success:** Named months and standalone days form any ordered repeating year; target-length mismatch saves with target corrected; optional year names work; changing a populated calendar preserves positions, order and intervals. See FR-7–13 and requirements.md.

- **CAP-5**
  - **intent:** Develop and find characters using optional guided prompts.
  - **success:** Main/major/minor/extras filters preserve access; expected prompts distinguish answered/incomplete/waived without blocking saves; extras need only a name; all agreed viewer fields and zero/one/multiple names-only personality selections persist. See FR-15–17/39/48 and requirements.md.

- **CAP-6**
  - **intent:** Record factions and dated character affiliations.
  - **success:** Faction drafts save before completion; all non-roster profile fields determine completeness, optional repeating unit types remain supported, and a character has zero or one current faction with dated entry/exit/change history shown only on the character sheet, not the universe timeline. See FR-36–38, requirements.md and contracts.md.

- **CAP-7**
  - **intent:** Track typed established decisions, decisions they lead to and resulting events in timeline and arc context; add more decision types as needed.
  - **success:** Decision trees show established decision-to-event and direct decision-to-decision relationships. Either kind of outgoing link resolves its source decision; with neither it appears in the selected universe’s unresolved lookup. Removing the last outgoing link across both kinds returns it to unresolved. Incoming links alone do not resolve a decision. Link validation remains DEC-28. See FR-31–33.

- **CAP-8**
  - **intent:** Track each story’s plot sequence.
  - **success:** Entries have headings, optional dates and automatic sequence numbers; undated entries precede chronological dated entries. Jo can manually order undated entries and entries sharing a date. Numbering follows date and ordering changes, while manual ordering cannot override chronology or undated-first placement. See FR-34 and contracts.md.

- **CAP-9**
  - **intent:** View earlier work and restore items or whole projects while retaining replaced work.
  - **success:** Automatic complete revisions cover current manuscript, plots and required historical universe content; item/project restoration first saves a Replaced revision and reconciles shared-universe conflicts manually. Chapter-only restoration leaves linked event dates/content unchanged; separate event-item and whole-project recovery remain supported. Referenced content survives cleanup. See FR-2–4/18–22 and contracts.md.

- **CAP-10**
  - **intent:** Back up and recover project and universe data without the original stores.
  - **success:** Manual, scheduled and normal-close backups produce independent complete ZIPs with required images and retained history; project ZIPs include universe recovery content, standalone universe ZIPs need no project, and protected ten-backup sets survive cleanup. Completed ZIP filenames identify their contents with relevant universe/volume/project names and a real date/time stamp; DEC-35 is settled: project/universe names plus local capture-start YYYY-MM-DD_HH-mm-ss, with safe names and numbered collision suffixes. Destination failures follow the agreed prompt/fallback workflow. See FR-23–26 and AD-5–10/15.

- **CAP-11**
  - **intent:** Export manuscripts and databases for use outside the application.
  - **success:** Whole stories and selected chapters export as DOCX/PDF/MD/TXT; local database export is separate from manuscript, settings and backup operations. See FR-27/49 and AD-13.

- **CAP-12**
  - **intent:** Configure saving, recovery and appearance and round-trip settings.
  - **success:** Autosave defaults to 5 minutes, revisions and scheduled backups each to 10 minutes with independent interval settings, and retention to 30 elapsed days; intervals, schedule, destination, retention and light/dark/system theme round-trip through a JSON object in a .json file. System theme follows OS changes. See FR-28–30/43 and AD-15/18 and contracts.md.

## Constraints

- All twelve capabilities and all reconciled FR-1–49 are first-release scope; implementation sequencing does not defer capabilities.
- Operate on one machine using open-source tools. Use approved DEC-09 first-release targets: Windows 10/11 x64 .exe; macOS 13+ Intel/Apple Silicon .dmg; Ubuntu 22.04+/Debian 12+ x64 .deb, with individually verified Pop!_OS/Zorin/Mint compatibility. Bundle Electron and LibreOffice and provide menu integration; Windows/Linux ARM deferred. Installed compatibility still requires verification.
- Follow the adopted architecture: Clean Architecture, TypeScript, React, Lexical adapter, WritingTool-owned versioned JSON manuscript, separate SQLite project/universe stores and managed external images. Technical boundaries, security, ownership and storage rules are in the architecture companion.
- Maintain one authoritative universe and identity across folder moves and recovery. Project-local historical checkpoints and ZIP snapshots never become competing live authorities. User-selected live folders are independent of backup destinations.
- Persist pending manuscript edits before current-work snapshots, backups or normal close. A failed protective Replaced revision prevents restoration; failed/conflicted recovery or partial ZIP creation cannot be reported as complete.
- Use complete logical revisions with immutable shared content, protected cross-store dependencies and independent ZIP recovery. Deduplicate within owning stores and each ZIP; duplication across separate ZIPs is permitted.
- Apply configurable time-only retention, default 30 elapsed days, oldest eligible first. Protect the ten newest successful valid ZIPs independently per project and standalone universe, including manual deletion; preserve all current/retained references. No size threshold or ten-revision minimum applies.
- Date-only fictional chronology is distinct from real elapsed retention time. Calendar changes preserve elapsed positions; chapter date edits and chapter-only restoration preserve all linked event dates/content. Full event-editing and recovery rules are in requirements.md and contracts.md, superseding earlier AD-16 movement rules.
- Publish shared identity/document/transport/recovery/chronology contracts and prove crash consistency before affected persistence, IPC, mutation or recovery implementation. Architecture candidate package pins are untested seeds requiring integration verification, not a tested lockfile.
- Use the permanent UUID and location-separation contract in contracts.md for every project, universe and record; references to universe-owned records include owning-universe identity.
- When a live universe folder is missing, offer locating it or selecting a recovery backup; do not activate the associated project until the matching single authority is available.
- Show recovered/live universe record conflicts for manual resolution; preserve live data until Jo confirms changes, and direct confirmed changes to its single authority.
- Canceling reconciliation leaves live data unchanged and the restored project inactive, while retaining pending reconciliation for later resumption.
- Recheck the live universe before applying reconciliation choices; intervening changes require renewed review of affected conflicts only, preserving unaffected choices and preventing stale changes.
- Offer all three per-record conflict resolutions: keep live, use recovered, or edit a combined version; confirmed universe changes affect all associated projects.
- Resolve missing recovered-project character/faction/event references before activation; offer restore missing record, link a same-universe replacement, or remove the reference, subject to confirmation and retained-history integrity.
- Same owning-universe UUID and record UUID with different saved content requires manual conflict resolution; identical records need no review and unrelated live records remain unchanged.
- Scheduled backups default to 10 minutes and remain independently configurable from autosave and revision snapshots; all intervals round-trip through settings JSON.
- Outside normal close, canceled alternate backup-folder selection skips the current attempt, reports it incomplete with retry, and keeps the configured destination; normal-close fallback remains required.
- Volumes optionally group stories within a project; each story has zero or one volume membership, with manual volume/story order and unrestricted counts. Grouping never changes the owning project or universe.
- Plot manual ordering is restricted to the undated group or one same-date group; undated-first placement and chronological order across dates remain binding.
- Place new plot entries and entries whose dates change last within their destination undated or same-date group, permitting manual reordering afterward.
- Chapter start/end dates are independent, and chapter date changes never change any linked event dates/content. Provide an Edit event link in the chapter view to the dedicated canonical event editor; no inline event editing or chapter-driven event shifting is allowed.
- Chapter-only restoration leaves all linked main-event and flashback dates/content unchanged. Separate event-item and whole-project/universe recovery retain their existing protection and reconciliation rules.

- Show faction affiliation changes and their dated history only on the character sheet; exclude them from the universe timeline. Retain date-only history and zero-or-one faction membership.

## Non-goals

- Hypothetical alternative decision branches, leap-year rules, enforced chapter/story/volume/word limits, and combat simulation inferred from faction unit fields.
- First-release PostgreSQL, browser/mobile clients, cloud synchronization, collaboration, public distribution, monetization, signing and automatic software updates.

## Success signal

- Demonstrate Jo writing a chapter with its chronology, characters, plot and established decisions visible; then demonstrate independent calendar/chapter edits and explicit event editing, decision resolution, item/project/Replaced recovery, standalone ZIP recovery after original-store loss, and manuscript/settings exports without missing dependencies or loss of retained work. Verify persistence after reopen and installed operation on the agreed platform matrix.

## Open Questions

- Architecture/spec, before persistence/IPC/recovery: settle DTO/error, manuscript and backup-manifest schemas as one versioned contract; UUID identity is resolved in contracts.md.
- Architecture/spec, before linked mutation/backup: define crash-safe cross-store/asset publication, consistent backup cuts, durable operation recovery, per-unit writer leases across sessions, pending-edit acknowledgments and shutdown/retry behavior.
- Jo/architecture, before recovery: define universe version ordering and equality/divergence metadata. Record-content conflict criteria, missing-reference choices, missing-authority entry, manual confirmation, resumable cancellation and freshness review are resolved in contracts.md. Shared content representation and race-free validation/commit remain in their implementation gates.
- Architecture/spec, before deletion/item restoration: define shared-record reference/history preservation and partial-item scope while keeping the universe independently usable.
- Architecture/spec, before snapshot/cleanup: define manifest/object identity, immutable image versions, cleanup roots and protected-archive discovery across moved destinations.
- Architecture/build, before persistence: choose and verify SQLite binding/engine, journaling and migrations in installed builds; before lockfile adoption verify Forge/React/Lexical/background-host/native integration.
- Jo/architecture/UX, before calendar UI/persistence: define elapsed coordinate/epoch, year bounds, invalid date-range handling and standalone-day/year-name display while preserving the agreed format examples.
- Jo/UX/spec, before relevant stories: capture chapter-to-event-editor navigation and return behavior under PLAN-04/DEC-15. Independent chapter dates and no chapter-driven event mutation are resolved in contracts.md; volume membership/order and plot group ordering/insertion are also resolved.
- Jo/UX/build, before export/creator: settle exact guided prompt wording and format-specific export presentation/libraries while retaining all agreed fields, formats and waiver behavior.
- Jo/architecture/build, before packaging/performance acceptance: apply approved DEC-09 installer formats/Linux baselines/processor coverage; settle platform test access and measurable budgets using a representative corpus; roughly ten stories/~100 chapters/two volumes is context, never a cap.
- Jo/UX, before scheduler/error handling: settle setting validation; the independent 10-minute scheduled backup default and outside-close destination cancellation are resolved in contracts.md. Fallback-save failure and close retry behavior remain in the coordinated lifecycle gate.
- Architecture/build, before database export: product scope and UX are approved as one owning-unit catalog-only `.sqlite` snapshot; define the exact versioned schema/metadata, consistent capture/validation/publication/cancellation and external-dependency mechanisms under TECH-13, separately from complete backup ZIPs.


## Restored calendar-format flag

Restored data linked to a calendar format/configuration different from the current authoritative calendar must visibly flag its old calendar format as needing an update. Applies to CAP-9/10 and FR-2/3/23. Preserve elapsed chronology, one authority and chapter-only event isolation; DEC-32 tracks detection/update/clearing interactions without assuming automatic conversion or a new blocking rule. See contracts.md.

## Category-based saved-object folders

Every saved object category has its own folder in the owning project/universe live storage root (for example, timelines and characters); complete ZIPs include those category folders and their actual saved content. Preserve UUIDs, unit ownership, one authority, immutable history and content reuse. This later requirement constrains prior database-layout assumptions; DEC-33 tracks reconciliation of file formats and database/index responsibilities before persistence/capture/recovery implementation. See contracts.md.

## Database location and backup inclusion

If SQLite or a similar database is used, its live files reside in their own dedicated database subfolder within the owning project/universe data folder tree, alongside the other category folders. Every complete backup ZIP automatically includes a consistent recoverable database copy with all other required data; separate database export is not required for database backup. Exact within-root placement and consistent capture remain DEC-33/TECH-11 implementation details. See contracts.md.

## Adopted object-file and database responsibilities

Structured object data and settings are JSON-format `<object-id>.json` files in category folders. Chapter writing is plain text in `<chapter-id>.wrt` files. The dedicated-folder database tracks object IDs, filenames, relationships and locations; object payloads live in their files. Complete backups include both coordinated catalog state and files/history/assets. This later decision supersedes JSON manuscript payload persistence. DEC-36 is resolved: the chapter’s companion JSON stores rich-format metadata matched to its plain-text WRT; TECH-01/02/09/11 still define exact schemas and crash-safe publication/versioning. See contracts.md.

## Relocatable base folders

Each project/universe database records its owning base-folder location separately once. Object locations reference that root and store only relative paths. Moving the whole folder updates only its base-location record, preserving all object rows/IDs/relationships and JSON/WRT content. Shared-universe projects resolve its one root by universe identity. ZIP recovery binds a new base location without rewriting every object. See contracts.md.

## Paired chapter text and formatting

Jo selected plain-text `<chapter-id>.wrt` writing with chapter details and bold/italic/indent/heading/scene-break metadata in `<chapter-id>.json`. Save, reopen, revision, restore, backup and export use matched text/JSON versions. Database catalog entries keep root-relative file locations and shared chapter identity. DEC-36 is settled; exact versioned metadata/anchoring and consistent multi-file publication remain TECH-01/02/03/09. See contracts.md.

## Universe inventory in progress — factions

Jo confirmed factions with profiles covering leadership, government type, population size, resources, culture notes and a worlds/cities list where applicable. These extend CAP-6/FR-36 and are stored as faction JSON under the existing universe catalog/storage rules. DEC-12 stays open for further universe content/profile fields; DEC-37 tracks added-field validation/completeness and list representation without inventing separate world/city entities. See contracts.md.

## Chapter invalid-range correction

DEC-01 is settled: when both dates exist and chapter end is earlier than start, set end equal to start. This is the explicit exception to independent chapter-date editing; valid ranges/missing dates retain their existing behavior and linked events remain unchanged. See contracts.md.

## Chapter date ties

DEC-16 is settled: same-start chapters retain saved creation order within that date. Other start dates remain chronological; missing-start chapters remain first in creation order. See contracts.md.

## Pending writing during navigation

DEC-15 is settled: automatically save pending writing/companion JSON before navigation; on failure warn, retain edits and keep navigation pending with retry/cancel. Never claim success before durable matched-version acknowledgment. Periodic save/revision/backup intervals remain independent. See contracts.md.

## Autosave timing

DEC-17 is settled: timer starts on project open and restarts on interval change; save pending changes at each interval (default 5 minutes), perform one overdue save after sleep, prevent overlap, and on failure warn/retain edits/retry next interval with Retry now available. Navigation saves remain immediate; revision and backup intervals remain independent. See contracts.md.

## Revision timing

DEC-31 is settled: independent default 10-minute timer on project open, restart on revision-interval change, one overdue capture after sleep and no overlapping captures. Failure warns, preserves existing work/revisions and offers next-interval retry or Retry now. Complete capture still requires durable pending-save acknowledgment. See contracts.md.

## Scheduled backup units and timing

DEC-34 is settled: back up each open project and independently opened standalone universe, keyed by unit identity. Independent default 10-minute timer starts on open/restarts on change, one overdue attempt after sleep, no overlap. Failure warns with next-interval retry and Retry now. One destination prompt at a time; cancellation skips only the attempt and preserves destination/scheduling. Embedded universe snapshots do not count as standalone backups. See contracts.md.

## ZIP filename format

DEC-35 is settled: project ZIP `<ProjectName>_<UniverseName>_YYYY-MM-DD_HH-mm-ss.zip`; standalone-universe ZIP `<UniverseName>_YYYY-MM-DD_HH-mm-ss.zip`. Use local real capture-start time, filesystem-safe names and `_2`, `_3` collision suffixes. Project ZIPs include every volume and need no individual volume names in their filenames. See contracts.md.

## Normal-close failure behavior

If required saving, revision capture or backup fails during normal close, including failure of both application-root and user-data fallback locations, show the failure and keep the application open. Preserve pending edits, successfully saved current state, completed revisions and valid backups; report their outcomes separately rather than rolling them back or calling the whole close successful.

Offer Retry, Choose another backup folder where applicable to a backup/destination failure, and Cancel closing. Retry follows the coordinated operation contract and does not damage already completed output. Cancel closing returns to the workspace with writing retained. Complete normal close only after the required pending saves, complete revision and complete backup succeed. There is no silent discard or forced-close override. This concerns application-managed normal close; abrupt process termination remains the separate crash/restart recovery contract.

## Accepted restored-calendar update action

After item/project/ZIP restoration, flag affected data when its saved calendar configuration or display format differs from the current authoritative calendar. Preserve the historical calendar association and the pending-update state across reopening; merely viewing the data does not clear the flag. Compare the actual applicable configuration/format under the shared schema contract, not just an unrelated filename or a version number that implies no format difference.

Provide an explicit Update to current calendar action. It recalculates displayed dates from the saved elapsed-day positions using the current authoritative calendar and saves the updated current-data calendar/display metadata. Preserve elapsed positions, chronology, relationships and writing; do not overwrite the authoritative calendar or change linked event positions/content as a side effect of updating a restored chapter’s display. Retained immutable revisions keep their exact historical content/format metadata.

Clear the affected current-data flag only after its update saves successfully. On failure report it, retain the flag and offer retry; do not claim the update completed or discard the restored data. Allow manuscript writing while an update is pending and visibly identify the unresolved calendar-format state. This flag does not waive required authority/reference/schema checks before recovery activation. TECH-01/02/03/09 define exact comparison/metadata/publication/version handling; those technical details do not reopen the accepted user workflow.

## Minimum calendar year

The minimum valid year definition is its year number and the number of days in that year. A days-only calendar can be created/saved with those values without defining any months or explicit standalone-day entries. Months, year/element names and the richer year structure are configurable options, not prerequisites for the days-only mode. Do not require at least one month/standalone-day component or invent a default 365-day year.

In days-only mode the entered day count defines the actual year length; an empty optional component list does not mean zero days. When months/standalone components are configured, retain the existing ordered composition, actual-total/target mismatch and repeating-year contracts. Calendar changes affecting populated data still preserve elapsed positions/intervals under FR-7. A universe may still exist before a calendar is configured under Story 1.2.

This settles DEC-13’s minimum structure, optional months and names. Exact numeric range/precision validation for day counts/month lengths and year numbers still needs the accepted DEC-03/DEC-13 shared calendar schema; the earlier proposed validation bundle was not accepted wholesale. Do not silently decide year zero/negative bounds, maximum days or invalid numeric input behavior from this minimum-field choice.

## Accepted calendar numeric validation

Calendar day count and each configured month length must be positive whole numbers. A supplied target year length must also be a positive whole number. The required year number must be a whole number. Missing required values, fractions and nonnumeric input show a clear validation error and cannot be committed as a valid calendar configuration; do not silently round fractions or substitute invented values.

The minimum days-only definition remains year number plus day count; months, names and explicit standalone-day component entries remain optional. Optional names do not create a missing-required-field error. If a valid configured month/standalone-day composition differs from a valid target, the existing red/green comparison and save-with-target-corrected-to-actual-total rule remains allowed; mismatch is not invalid numeric input. Year zero, negative years, epoch and supported year bounds remain DEC-03; this decision requires integer year numbers but does not select their range. TECH-01 defines integer representation/precision and parsing/error schemas before implementation.

## Year zero and negative years

Fictional year numbers are whole numbers that may be negative, zero or positive. Their chronological sequence is … -2, -1, 0, 1, 2 … with no skipped year zero. No separate before/after-era system is required by this decision. Optional year names remain optional and do not replace the numeric chronology. A day-only year still needs its year number and day count; configured month/day compositions remain optional and obey the existing repeating-year rules.

This settles DEC-03 year-zero/negative support, not its remaining internal elapsed-day epoch and supported numeric bounds. Shared date input/comparison/conversion must consistently accept the chosen numbering within those eventual bounds; do not apply a positive-year-only validator or treat a negative year as an error merely because it is negative.

## Unshifted date numbers

Jo rejected the proposed artificial origin “day 1 of year 0 = elapsed day 0” and instructed using the entered numbers as-is. Preserve supplied year/day values in the application’s versioned calendar date representation; do not replace them with a remapped zero-origin counter or subtract an artificial year/day offset when saving/displaying ordinary dates. The accepted continuous year numbering still includes negative, zero and positive years.

Calendar arithmetic/comparison must use the configured calendar and the supplied values under the shared chronology contract; this instruction does not choose a new artificial epoch. It does not revoke the earlier requirement that reconfiguring a populated calendar preserves elapsed chronology/intervals and consistently recalculates displayed dates, nor the explicit restored-calendar update workflow. TECH-01 must reconcile versioned date/configuration identity, comparison and conversion with those invariants without introducing an unapproved persisted zero-based origin. DEC-03’s supported numeric bounds remain open; do not present the rejected epoch as an outstanding product choice to approve again.

## No fixed year limit

Year numbering has no fixed upper or lower limit. Accept arbitrarily large positive or negative whole year numbers, including zero, retaining the entered numeric value exactly. Do not impose calendar-year cutoffs, 32/64-bit integer bounds, floating-point safe-integer bounds or silent rounding/truncation on the product’s year field. The continuous order remains … -2, -1, 0, 1, 2 …; no artificial epoch remapping is adopted.

Use arbitrary-precision integer semantics for year storage, comparison and calendar arithmetic. TECH-01 must define an exact versioned JSON/wire representation and parsing that round-trips arbitrarily large year values through object files, editor/date UI, catalog queries if needed, revisions, ZIP recovery and export; native JSON/SQLite/JavaScript numeric limits must not silently constrain the year domain. Exact encoding is technical-contract work, not permission to add an application year limit. Year numbers remain whole numbers; nonnumeric/fractional/missing required inputs still follow the accepted validation contract. This decision concerns year numbers and does not silently change every other numeric field’s validation.

DEC-03’s product choices are settled: signed continuous years with zero, input numbers preserved as-is without the proposed artificial zero-origin counter, and no fixed year bounds. TECH-01 chronology/conversion/schema and TECH-11 adapter integration must implement this while preserving prior elapsed chronology/intervals during calendar changes.

## Named standalone-day field order

For a named standalone day when the year has a name, display exactly `name-of-year/dayname-daynumber/yearnumber`: year name first, then the day name joined to its day number with a hyphen, then the numeric year. For example, `Dragon/Festival-40/6976` illustrates that field order. This supersedes the proposed standalone `name/day-of-year/year` layout and any proposal to append the year name at the end of this standalone format.

Year names remain optional and numeric years remain exact, including negative/very large values. DEC-04 still needs the fallback format when the year or standalone day is unnamed and the exact day-number interpretation/formatting details; do not silently require a year name, assume leading empty separators or treat this correction as approval of every other proposed date layout. Existing days-only/month-based source examples remain unchanged unless Jo revises them.

## Unnamed-year standalone display

For a named standalone day in a year without a year name, omit the year-name segment and its separator: `dayname-daynumber/yearnumber`, for example `Festival-40/6976`. Do not show a leading slash or an invented placeholder year name. When a year name exists, retain the approved `name-of-year/dayname-daynumber/yearnumber`. This resolves the unnamed-year fallback for named standalone days; exact day-number meaning and the unnamed-day fallback remain DEC-04.

## Standalone day-number semantics and unnamed fallback

In a standalone-day display, daynumber is the day’s position within the whole year, not an ordinal within only the standalone days. For example, `Festival-40` means the 40th day of that year. If the day has no name, omit its name and hyphen: a named year displays `name-of-year/daynumber/yearnumber` (e.g. `Dragon/40/6976`), and an unnamed year displays `daynumber/yearnumber` (e.g. `40/6976`).

Together with earlier accepted cases, the standalone display matrix is: named year/named day => `name-of-year/dayname-daynumber/yearnumber`; unnamed year/named day => `dayname-daynumber/yearnumber`; named year/unnamed day => `name-of-year/daynumber/yearnumber`; unnamed year/unnamed day => `daynumber/yearnumber`. Do not insert empty segments, leading separators, placeholder names or an orphan hyphen. Numeric years remain exactly as entered, including zero, negative and arbitrarily large integers.

This resolves DEC-04 standalone-day/daynumber/optional-year-name behavior. Existing days-only `dayofyear/year` and month-based `month/dayofmonth/yearnumber/yearname` source formats remain in force; omit an absent optional year-name segment rather than requiring a name. The rejected standalone day-name-first layout is not reinstated. Shared schema/rendering/escaping details remain technical implementation work.

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

These maker rules are accepted; foreign-universe, missing or ineligible references are invalid. This approval does not choose maker requirements for custom decision types, which are now resolved by the later DEC-30 contract below. DEC-26 remains open for explicit character/story-arc context association meaning, ownership, editing and relevance/query rules. Maker identity alone is not an approval of any automatic context association. Shared schemas, validation and safe publication remain technical gates.


## Decision contextual associations and relevance — DEC-26 resolved

A decision can be explicitly associated with multiple characters and multiple stories sharing its universe. An association means “relevant to”, independently of the maker; maker selection, a shared date or timeline proximity does not automatically create a context association. Character associations belong to the universe; story associations belong to the owning project and reference the canonical universe decision. Add/remove associations through the decision editor without deleting the decision or other associations, preserving protected retained references.

Character views show decisions explicitly associated with that character. Story/story-arc context shows decisions explicitly associated with that story, without adding a separate arc entity. Writing context combines decisions associated with the selected story with decisions associated with the selected chapter's characters, presenting each canonical decision once when multiple associations match. These relevance rules are subject to the separately agreed view/filter constraints; they do not create new chapter dates or move records into the chapter period. Associated projects share universe decisions/character associations while keeping their story associations scoped to their own project.

Together with the accepted at-most-one same-universe character/faction maker rules, this resolves DEC-26. Exact cross-root association schemas, commands, reference preservation and coordinated publication remain technical gates; filter rules follow approved DEC-29 below; custom-type/makerless rules follow approved DEC-30 below. Earlier context-association deferrals are superseded.


## Decision-result event eligibility and chronology — DEC-27 resolved

Any canonical event in the same universe can be a decision result, including birth and character background events. The result event may occur on the decision's date or later. Reject an earlier result date with a clear validation error; never move either date automatically to make a link valid. Character-sheet-only faction-affiliation history remains excluded from result-event choices. Use the shared exact elapsed chronology for comparison rather than display strings.

Existing many-to-many event-result relationships, canonical UUID reuse, optional standalone events and link-derived resolution remain unchanged. DEC-27 is resolved, superseding earlier event-eligibility/temporal-validation deferrals. Shared validation/publication contracts must preserve this relationship invariant through linked writes without partially changing relationships or status; exact schemas/protocols remain technical gates.


## Direct decision-link validation — DEC-28 resolved

A decision may lead to multiple decisions and have multiple preceding decisions. Direct decision relationships are many-to-many, directed and confined to canonical decisions in the same universe. Reject self-links and any new link that would create a directed cycle, including cycles among same-date decisions. A following decision may occur on the source decision's date or later; reject an earlier following date. Validation errors leave dates and existing links unchanged, with no automatic date shifts. Existing duplicate-pair prevention remains in force.

Either an outgoing following-decision link or an outgoing result-event link resolves its source; neither means unresolved. Incoming links alone do not resolve the receiving decision, and downstream status does not propagate. DEC-28 is resolved and earlier cardinality/self-link/cycle/temporal deferrals are superseded. Shared graph/date validation and coordinated publication must preserve these invariants through linked writes; exact schemas and protocols remain technical gates.


## DEC-29 — Visibility filters (approved 2026-10-17)

Initially show all makers and categories. Allow multiple selections, matching OR within the maker filter and OR within the category filter, with AND between the two filter groups. Persist filter selections per universe across reopening and synchronize them across timeline, decision tree, writing context and unresolved lookup. Existing universe and context constraints still apply.

Show an active-filter indicator and a **Show all** reset that clears these visibility restrictions. Present a relationship endpoint excluded by filters with a **Hidden by filters** marker. Filtering never changes canonical records, dates, links or link-derived resolution; hidden results still resolve their source. The unresolved lookup applies visibility to presentation without changing canonical unresolved membership. Makerless presentation/filtering follows the later approved DEC-30 contract below, without a placeholder canonical maker. Exact schemas, synchronization protocols and layouts remain TECH-01 and PLAN-04.

## DEC-30 — Custom decision types and makerless records (approved 2026-10-17)

Custom decision types belong to their universe and are shared by projects using it. At type creation, choose **Maker required**, defaulting to optional. Names must be nonblank and unique within that universe, ignoring case and surrounding spaces, including built-in category names. Existing Personal-required/Story-optional maker rules remain binding; type rename/delete and arbitrary custom fields are not added.

Changing a decision's type preserves its content and links. If the new type requires a maker, saving requires selecting one eligible same-universe character or faction under DEC-26; invalid changes do not publish a partial update. Story-type assignment alone never creates a story association.

Makerless records display **No maker**, with a matching maker-filter option. They appear by default; selecting only named makers hides them. No maker is a display/filter choice, not a fabricated canonical maker. It participates in the approved DEC-29 OR-within/AND-across filtering rules. Type definitions and assignments survive reopening; exact versioned schemas, publication and layouts remain technical/UX work.

## DEC-06 — Manuscript export selection and capture (approved 2026-10-17; partial decision)

Export one story at a time, either all chapters or selected chapters. Selected chapters retain the story's chapter order regardless of selection order. Include chapter titles and manuscript text; exclude dates, planning notes, characters and timeline context. Include empty chapters with their titles. Disable export when the story has no chapters or no chapters are selected, with a clear explanation.

Save pending manuscript edits before capturing the export. If saving fails, offer retry or cancellation and do not claim a completed export. Capture the matched current text/formatting state under the shared consistent-capture contract. Format mappings/presentation are approved in the later DEC-06 formatting contract below; destination/filename/overwrite are approved in the later DEC-06 destination/publication contract below; export engines are selected in the later bundled-LibreOffice DEC-06 contract below.

## DEC-06 — Manuscript export formatting (approved 2026-10-17; partial decision)

DOCX and PDF preserve bold, italics, paragraph indents and headings. Each chapter starts on a new page with its title. Use A4 pages, 2.54 cm margins, 12-point serif body text and 1.5 line spacing.

Markdown uses Markdown bold, italics and headings. Omit paragraph indentation while preserving text and paragraph breaks. TXT uses plain chapter titles and text, four spaces for indented paragraphs and no bold/italic markers; preserve paragraph breaks. All four formats represent scene breaks as `***` (render the literal marker rather than accidentally converting it into a different visual element).

These mappings join the previously approved selection/order/capture rules. Destination/filename/overwrite behavior is approved in the later DEC-06 contract below; export tools are now selected in the later bundled-LibreOffice DEC-06 contract below.

## DEC-06 — Manuscript export destination and publication (approved 2026-10-17; partial decision)

Use a Save As dialog to choose the folder and filename. Suggest `<StoryName>.<extension>` for whole stories and `<StoryName>_selected-chapters.<extension>` for selections, replacing filename-invalid characters. Match the extension to the selected format. Ask before replacing an existing file; declining returns to Save As.

Publish the finished export only after conversion succeeds, preserving any existing file if export fails. On failure, show the error and offer **Retry**, **Choose another location**, or **Cancel**. On success, show the saved path with **Open file** and **Open folder** actions.

These rules join approved selection/order/capture and formatting. Export tools are now selected in the later bundled-LibreOffice DEC-06 contract below; DEC-06 is resolved. Exact safe filename normalization, race-free destination replacement/publication and installed behavior remain technical implementation/verification work.

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

Jo approved this corpus specification; no dataset has yet been generated or performance test run. Fixture generation must create valid same-universe ownership/relationships and matched manuscript/formatting versions under the shared contracts. Record actual generated sizes and retained-history/backup content so measurements can be reproduced. Measurable timing targets and reference-machine/measurement conditions are now approved in the later DEC-11 budget contract below; DEC-11 is resolved.

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

## FR-49 — Database-export scope and UX resolved (approved 2026-10-17)

Jo approved one selected owning project or standalone-universe consistent `.sqlite` catalog snapshot. It includes saved catalog IDs, ownership, relationships, supported schema/version information and stored root-relative paths/identities and external references; it excludes external JSON/WRT/chapter-formatting JSON/images and revision/backup payloads. Clearly describe these limitations and direct independent recovery to complete ZIP backups. A project catalog may reference its universe without silently exporting another unit or authority.

The approved [shared contract](contracts.md#fr-49--catalog-only-database-export-approved-2026-10-17) defines source notice, pending-edit protection, Save As/name/overwrite/live-source rejection, center progress/supported Cancel, safe validated publication, failure/retry/location actions and actual-path success/open actions before returning to writing. These choices supersede earlier artifact/scope/UX deferrals. TECH-13 remains open for exact schema, capture, dependency representation, compatibility/validation, publication and cancellation mechanisms. No import/restore, live-authority activation, complete-backup credit or implementation result is introduced.

## PLAN-04 — Final UX handoff (2026-10-17)

[DESIGN.md](../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/DESIGN.md) and [EXPERIENCE.md](../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md) are final for UX handoff. Their approved Preview gray Light/Dark tokens and interaction contracts supersede earlier discovery/draft/provisional visual and layout deferrals. Five promoted references illustrate workspace, chooser, recovery, timeline and decision tree; Jo accepted written specifications for remaining partial/spine-only surfaces and skipped optional UX validation. Required editorial structure/prose polish completed. The approved catalog-only database export resolves the last UX scope blocker.

This closes UX preference/document work, not technical schemas/mechanisms, implementation, installed accessibility/platform/performance acceptance or full backlog readiness. TECH-01–13 remain tracked; DEC-10 actual test access remains unconfirmed. Routine bindings, geometry, focus/queue/fallback and scale/collision mechanics must preserve the adopted contracts.
