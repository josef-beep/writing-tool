---
title: WritingTool Product Requirements Document
status: final
created: 2026-10-10
updated: 2026-10-10
---

# PRD: WritingTool

## Document purpose

This draft develops the agreed [product brief](../../briefs/brief-WritingTool-2026-10-10/brief.md) into requirements for design, architecture, and implementation. Requirements are grouped by capability with stable FR identifiers. The coaching notes retain each discussion step; the decision log records changes and assumptions. Supporting source examples and architecture details are in addendum.md.

## Vision

WritingTool is a desktop application for authors to plan and write stories while tracking chronology, plots, and established character decisions. A chronological universe timeline connects manuscript writing to the characters, events, and consequences that explain where the author is in the story.

## Confirmed scope

The first release is for Jo's own writing. Broader distribution is not a first-release goal.

All capabilities in the product brief are required for the first release, including guided character creation and the decision-tree view. Implementation may be sequenced without deferring these capabilities.

The application operates on one machine and targets Windows, macOS, and Linux. Stories within a universe share its timeline, characters, and factions; sharing is limited to that universe.

Excluded from this release: hypothetical alternative decision branches, leap-year rules, enforced chapter/word limits, and public-launch or monetization work. Browser/mobile clients, cloud synchronization, and collaboration were not requested and are not implied by the desktop scope.

## Assumptions requiring confirmation

- Scheduled database backups default to 10 minutes by reusing the existing revision snapshot interval. Jo instructed us to use the existing settings rather than naming a separate interval.

## Coaching and review status

The brief and recorded coaching decisions have been consolidated, audited, reconciled against the supplied sources, and reviewed. This PRD is ready for UX and architecture planning. Implementation details with owners and revisit conditions remain in the open-items table.

## Target user and jobs

Jo is the first-release user, planning and writing fiction on one machine. Other authors may use a later release; this PRD does not require launch, monetization, or distribution work.

- Write a manuscript while seeing where a chapter fits in the universe timeline and which characters and decisions matter.
- Preserve established chronology and character history across stories in the same universe.
- Recover earlier work without losing the ability to return to replaced work.
- Export writing and settings, and recover the project after database loss.

Separate persona and journey discovery is omitted for this personal release: the existing brief supplies the writing workflow, and Jo requested that prior discovery not be repeated.

## Glossary

- **Universe:** Shared setting that owns a timeline, calendar, characters, and factions.
- **Story:** Manuscript and plot sequence within one universe.
- **Chapter:** A manuscript section with optional start and end dates and associated characters and events.
- **Main event:** An event linked to a chapter's main period, eligible for selected chapter-driven changes.
- **Flashback:** A depiction of a historical event linked to a chapter; its historical date is edited independently.
- **Standalone universe event:** A timeline event with no required story, chapter, character, plot, or decision links.
- **Background event:** A character-linked event recorded as part of that character's background.
- **Established decision:** A recorded choice with a timeline position and decision-maker; unresolved until a resulting event is linked.
- **Resulting event:** An event linked to one or more decisions that contributed to it.
- **Plot entry:** A heading, optional date, and automatic position in a story's plot sequence.
- **Revision snapshot:** A recoverable saved state of project content.
- **Backup:** Stored recovery content sufficient to recover without the original database, including required shared content and retained revisions.
- **Autosave:** Saving current work at an interval, separate from revision snapshots and backups.
- **Active reference:** A reference from retained revision or current content that requires a stored item to remain available.

## Features

### Universe and story workflow

#### FR-44: Shared universe context

Stories in the same universe share its timeline, characters, and factions. Stories' plot sequences remain story-specific under FR-34.

**Acceptance:** Selecting a different universe uses that universe's records. Records are not shared across universes. Every timeline identifies its owning universe, and linked universe/timeline selectors remain synchronized across timeline views.

#### FR-45: Chronological timeline and chapter context

The universe overview follows chronological order. Jo can zoom into a chapter's period and inspect its events, associated characters, and established decisions alongside manuscript writing.

**Acceptance:** Dated timeline content is displayed chronologically. Selecting a dated chapter exposes its period and related context. Undated chapter-list ordering follows FR-42 without inventing dates for those chapters.

#### FR-46: Plan from the timeline or chapter

Jo can select a position on an existing timeline to populate chapter events or create a chapter and have its dated content appear on the timeline. Linked date edits update the corresponding timeline records.

**Acceptance:** Both entry directions refer to the same linked records. Creating an undated chapter is permitted under FR-42. Subsequent date changes respect event selection and fixed flashback dates under FR-5 and FR-6.

#### FR-47: Chapter characters and planning targets

Jo can associate characters with chapters and set chapter-count and per-chapter word-count targets.

**Acceptance:** Associated characters and targets are visible while planning and writing. Targets are informational: they do not prevent writing, creating chapters, or saving work beyond the target.

### Timeline events

#### FR-35: Record standalone universe events

Jo can record an event directly on the universe timeline without linking it to a story, chapter, character, plot, or decision. The event belongs to the selected universe and contains a heading, date, and optional description.

**Acceptance:** Creating and displaying a standalone universe event requires no linked story or other content record. It supports a heading and date and can be saved without a description. It appears at its recorded position on that universe's timeline.

#### FR-40: Date-only timeline timestamps

Timeline entries use dates; hours, minutes, and seconds are not required. This applies to standalone events, character background events, faction changes, established decisions, and dated plot entries.

**Acceptance:** Timeline entries can be created and displayed using a date alone. Optional plot timestamps are optional dates.

#### FR-41: Optionally order events within a date

Jo can manually arrange events that share a timeline date. Choosing a within-day order is optional.

**Acceptance:** Same-date events can be created and saved without manual ordering. Jo can subsequently arrange their order within that date without changing their dates. This does not introduce a time-of-day requirement.

### Manuscript editing

#### FR-1: Manuscript formatting

Jo can apply italics, bold, paragraph indents, and headings, and insert scene breaks while writing and editing a manuscript.

**Acceptance:** Each of the five formatting capabilities is available in the manuscript editor. Formatting is preserved when the manuscript is saved and reopened.

#### FR-27: Export manuscripts

Jo can export either the whole story manuscript or selected chapters as DOCX, PDF, Markdown (MD), or plain text (TXT), in addition to the database export required by the brief.

**Acceptance:** All four manuscript export formats support both the whole story and selected chapters. Format-specific presentation remains to be specified.

#### FR-42: Optional chapter date ranges

Jo can assign start and end dates to a chapter so it can span several days. Both dates are optional; a chapter can be created before dates are assigned. This supersedes the brief's requirement for dates at chapter creation.

**Acceptance:** Creating and saving a chapter does not require start or end dates. Both fields are available when needed. Dated chapters show their period in the timeline context and are ordered by start date. An end date is not used as a substitute sorting key. Chapters without a start date remain in creation order and appear in front when chronological placement is unclear.

#### FR-43: Configurable autosave

WritingTool automatically saves current work at a configurable interval, defaulting to 5 minutes.

**Acceptance:** Autosave defaults to 5 minutes and Jo can change the interval. This setting is included in JSON settings export/import. Autosave saves current work; revision snapshots retain the separately configurable 10-minute default under FR-18.

### System settings

#### FR-28: Export system settings as JSON

Jo can export system settings as a JSON object into a `.json` file.

**Acceptance:** Export produces a valid `.json` file containing system settings represented by a JSON object, including autosave interval, revision snapshot interval, backup schedule, backup destination, and theme. The file can be imported under FR-29.

#### FR-29: Import system settings

Jo can import an exported system-settings `.json` file to restore settings.

**Acceptance:** Importing a settings file produced by FR-28 restores its exported setting values, including theme.

#### FR-30: Choose the application theme

Jo can choose light, dark, or system theme mode. System mode follows the operating system's theme.

**Acceptance:** All three modes are available. Light and dark apply the selected appearance; system follows operating-system theme changes. The selected mode is included in settings export and restored by settings import.

### Revision recovery

#### FR-2: Restore individual items

Jo can view earlier revisions and restore an individual item, such as a chapter, character, or event, from an automatic revision snapshot.

**Acceptance:** Jo can select an individual item for restoration without selecting whole-project restoration. Restoring a chapter restores its content and date to their saved state at the selected revision. Jo chooses which linked timeline events participate; selected events use their saved state at that revision. Ordinary chapter rescheduling shifts selected events by the chapter's date offset. In both operations, unselected events retain their current dates and content. Other linked-record restoration details remain to be specified.

#### FR-3: Restore the whole project

Jo can view an earlier project revision and restore the whole project from an automatic revision snapshot covering manuscript text, characters, plots, and timeline events.

**Acceptance:** Whole-project restoration is available separately from individual-item restoration and restores the covered content to the selected revision.

#### FR-4: Recover work replaced by restoration

Before individual-item or whole-project restoration, WritingTool automatically creates a revision snapshot of current work. Jo can identify it as the work replaced by that restoration and restore it again if the restoration was a mistake.

**Acceptance:** The snapshot is created before the restoration changes content, is clearly marked “Replaced”, and remains available for viewing and restoration.

#### FR-18: Automatic revision snapshot triggers

WritingTool automatically captures revision snapshots of all project content when the application closes and at a configurable interval. The default interval is 10 minutes. The pre-restoration snapshots required by FR-4 are additional triggers.

**Acceptance:** The default interval is 10 minutes and Jo can change it. Both interval and application-close snapshots cover manuscript text, characters, plots, and timeline events. On normal application close, the closing snapshot captures current project content before shutdown completes. The snapshot interval is distinct from the configurable autosave interval. Retention follows FR-19 through FR-22.

#### FR-19: Retain revisions by storage and size policy

Revision retention depends on storage and snapshot size, excluding images from the size calculation:

- PostgreSQL revisions remain until manually deleted, regardless of size.
- SQLite revisions over 10 MB are retained for one month; revisions of 10 MB or less remain indefinitely.

**Acceptance:** The size-based expiry applies only to SQLite. The minimum-revision rule in FR-20 takes priority over all deletion and expiry: retain every record needed for a gap-free, restorable retained sequence even when otherwise eligible for removal.

#### FR-20: Preserve a usable revision sequence during deletion

Deleting revisions must preserve the minimum records required for a restore sequence without gaps. A dependency still used by any retained revision must not be deleted.

**Acceptance:** Both manual deletion and automatic expiry preserve the minimum revisions and dependency records needed for a gap-free, restorable retained sequence. Deleting a dependency does not cascade into deleting later dependent revisions; the required dependency is kept. No fixed minimum revision count has been specified; the minimum is determined by what the retained revisions require.

#### FR-21: Store shared backup content once

An image, a particular document version, or other unchanged data already backed up is stored only once. Subsequent revisions using the same content reference the existing stored item instead of creating another copy.

**Acceptance:** Multiple revisions using the same image or unchanged document version reuse one stored item. Restoring any retained revision resolves its references to the corresponding saved content.

#### FR-22: Protect actively referenced content

A stored item cannot be removed while any active references to it remain.

**Acceptance:** Manual deletion and automatic expiry preserve content referenced by retained revisions or current project content. Expiring or deleting one revision does not remove a shared item still used elsewhere. This protection applies alongside the minimum-revision rule in FR-20. Having no references makes an item eligible for removal, without specifying when cleanup must occur.

#### FR-23: Recover without the original database

Jo can restore a backup after the original database is lost. The backup includes all current project content, images, retained revision history, and the content required to resolve every backed-up reference.

**Acceptance:** Recovery succeeds without access to the original database. Restored current content and retained revisions have no missing referenced items. Shared content remains stored once and reused by reference under FR-21; minimum-revision and active-reference protections remain in effect under FR-20 and FR-22. The backup packaging and storage layout are architecture decisions.

#### FR-24: Manual and automatic database backups

Jo can create a database backup manually. WritingTool also creates backups on application close and on a configurable schedule. Each backup supports complete recovery under FR-23 and shared-content storage under FR-21.

**Acceptance:** All three triggers are available. Jo can configure the automatic backup schedule. [ASSUMPTION: The scheduled backup default reuses the existing 10-minute revision snapshot interval, following Jo’s instruction to use what we already have.] Autosave remains separately configured at 5 minutes.

#### FR-25: Choose a backup destination

Jo can choose the destination folder for backups, including a folder on an external drive.

**Acceptance:** The selected folder is used for manual and automatic backups. External-drive folders are supported when available. If the destination is unavailable, WritingTool asks Jo to choose another folder, including during scheduled and application-close backups. Canceling that choice during application close invokes FR-26.

#### FR-26: Fall back to a folder in the application root

If Jo cancels alternate backup folder selection during application close, WritingTool creates a new folder in the root of the application folder and saves the backup there. On the next launch, it notifies Jo of the new folder and asks Jo to change the backup destination.

**Acceptance:** The backup is saved in the newly created folder before normal close completes. If the application root is not writable, WritingTool uses the user-data folder instead. The next launch identifies the actual fallback location and prompts for a changed destination.

### Timeline event movement

#### FR-5: Choose events to shift

Jo can choose which timeline events participate both when changing a chapter's date and when restoring an earlier revision. This selection qualifies the brief's automatic main-event shifting rule and the earlier chapter restoration rule.

**Acceptance:** Event selection is available for both operations. On an ordinary chapter date change, selected main events shift by the chapter's date offset. On restoration, selected main events return to their saved state at the selected revision. Unselected events retain their current dates and content in both operations. Flashback historical dates stay fixed during chapter date changes and chapter restoration, and are excluded from these chapter-driven date changes.

#### FR-6: Edit flashbacks independently

Jo can edit a flashback independently, including its historical date. The universe timeline reflects that edited date while the flashback remains linked to the chapter that depicts it.

**Acceptance:** Editing a flashback's historical date updates its placement on the universe timeline. Moving or restoring its depicting chapter does not change that historical date.

### Fictional calendar

#### FR-7: Change a populated universe's calendar

Jo can change a universe's calendar configuration after chapters and events have dates. The calendar supports configurable days per year and per month, with months optional. Timeline timestamps require dates only; time-of-day fields are not required. The brief’s 24-hour day and 60-minute hour convention applies if time is represented elsewhere.

**Acceptance:** Existing dated chapters and events do not prevent calendar editing. Calendar changes preserve the elapsed universe-time positions of existing dated entries and recalculate their displayed dates using the revised calendar. Chronological order and elapsed intervals remain unchanged.

#### FR-8: Compose a fictional year

Jo can configure a year using months only, months plus extra days outside months, or days only. Months can have different lengths. Extra days outside months can complete the configured year length.

**Acceptance:** All three year forms are supported. A month-based year can contain unequal month lengths, and the combined month days and extra days can account for the configured year length. Extra days occupy their configured positions in the year sequence.

#### FR-9: Build a calendar in sequence

Jo can create a calendar through a linear builder, adding months or standalone days in sequence. This ordered sequence defines their placement within the year.

**Acceptance:** Jo can build a year by adding months, standalone days, or a mixture in the desired order. A standalone day can appear before, between, or after months according to its position in the sequence.

#### FR-10: Compare and reconcile the target year length

Jo can enter a target number of days for the year. The calendar builder compares that target with the total days in the ordered sequence, counting every month's length and each standalone day.

**Acceptance:** The target day count appears red when the totals differ and green when they match. A mismatch does not prevent saving. Saving a mismatch changes the target to equal the actual sequence total. For example, saving a sequence of 360 days against a target of 365 sets the saved target to 360. Changes to a populated calendar continue to preserve existing elapsed universe-time positions under FR-7.

#### FR-11: Name calendar elements

Jo can assign a name to each month and standalone day in the calendar sequence.

**Acceptance:** Both month entries and standalone-day entries support names in the calendar builder.

#### FR-12: Optional year names

Jo can use numbered years without names or supply year names when needed.

**Acceptance:** A year name is not required to create, save, or display a date. Dates remain usable with a year number alone.

#### FR-13: Repeat the calendar each year

The configured calendar sequence repeats unchanged each year. The first release does not require leap-year rules.

**Acceptance:** Each year follows the same ordered months and standalone days and has the same total length under the current calendar configuration.

### Characters

#### FR-14: Place year-only births on the timeline

Entering a character's birth year creates a linked birth record on the universe timeline. When only the year is supplied, the record is placed on day 1 of that year. Editing the birth year updates its timeline placement.

**Acceptance:** A year-only birth appears at day 1 of the entered year, including when the calendar starts with a standalone day. Changing the birth year updates the linked record.

#### FR-15: Classify and filter characters

Jo can classify characters as main, major, minor, or extras. All characters remain viewable and accessible, with filtering by these types.

**Acceptance:** All four types are available for classification and filtering. Filtering does not remove character records. Extras can have just a name, with fuller development fields optionally available. The PRD uses extras for the brief's incidental-character category; remaining prompt details are still to be specified.

#### FR-16: Character traits and development fields

Character records support these fields:

| Field | Requirement |
| --- | --- |
| Name | Required for all character types |
| Rank or title | Expected for main, major, and minor; title if civilian; optional for extras |
| Background | Expected for main characters; optional for non-main characters |
| Description | Expected for main, major, and minor; optional for extras |
| Image placeholder | Optional |
| Motivation | Optional |
| Personality traits | Optional; multiple selections from the supplied source |
| Weaknesses | Optional |
| Strengths | Optional |
| Specialities | Optional |

Extras can have just a name; all other development fields are optional for them. Main-character background is required for completeness unless explicitly waived as unimportant. The brief's prompt waiver behavior remains in effect for expected development fields: unanswered expected prompts are marked incomplete unless explicitly waived, but do not prevent saving.

#### FR-17: Select multiple personality traits

Jo can select multiple personality traits for a character from the supplied [Personality Types List](sources/personality-types-list.md). This source contains 100 named entries with accompanying descriptions, including both common labels and constructed blend-types.

**Acceptance:** The selectable options show the supplied source labels only, without descriptions alongside them. A character can have no personality selection, one selection, or multiple selections. Selections are preserved when saving and reopening the character.

#### FR-37: Single current faction membership

A character can belong to at most one faction at a time, within that character's universe. The character viewer shows the assigned faction.

**Acceptance:** A character can have no faction or one current faction, but cannot have multiple simultaneous faction memberships.

#### FR-38: Record faction membership changes

Changing a character's faction records a dated change on the universe timeline, preserving membership history while updating the character's current faction.

**Acceptance:** A faction change records the character, previous affiliation, new affiliation, and date on the timeline. A change can enter or leave an unaffiliated state under FR-37. Membership history respects one faction at a time.

#### FR-39: Create character background events

Jo can create character-specific events as part of a character's background, with a heading, date, and optional description. Each event links to the character and appears on the universe timeline at its recorded date.

**Acceptance:** Character background events are accessible as part of the character's background and on the owning universe's timeline. Both views refer to the same event. Each event supports a heading and date and can be saved without a description.

#### FR-48: Guided character development and viewer

The character creator uses prompts to develop backstory and character details. Jo can leave responses unanswered; an expected prompt is marked incomplete until answered or explicitly waived as unimportant. Prompts outside a type's expected set need no individual waiver, and fuller prompts remain available for optional development.

**Acceptance:** Completion distinguishes answered, incomplete, and waived expected prompts. Extras need only a name; the expected fields for other types follow FR-16. The character viewer exposes the recorded image placeholder, background, personality selections, description, faction, and optional specialities.

### Established decisions

Plot tracking and the decision tree align established events, choices, and resulting events with the timeline and relevant character and story arcs. They record the established story rather than hypothetical alternatives.

#### FR-31: Record an established decision

Jo can record a decision's place in the universe timeline, who made it, and what the decision was.

**Acceptance:** Each established decision records those three fields and can be viewed in its timeline context. Only established decisions are included; hypothetical alternatives remain excluded as agreed in the brief. Separate fields for reasons or consequence text have not been requested.

#### FR-32: Resolve decisions through resulting events

An established decision is marked unresolved until a resulting event is created. The resulting event links back to the decision and is added to the universe timeline. Creating that linked event resolves the decision.

One resulting event can link back to multiple contributing decisions. It counts toward resolution for each linked decision. Unlinking it affects only the decisions whose links are removed; each decision's status depends on whether it still has any linked resulting events.

**Acceptance:** A newly recorded decision with no resulting event is marked unresolved. Creating the first resulting event links it to the decision, displays it at its own position on the universe timeline, and changes the decision to resolved. One decision can link to multiple resulting events; further events can be added after resolution. Deleting or unlinking the last resulting event makes the decision unresolved again and returns it to the lookup section in FR-33. Removing one event while others remain linked leaves the decision resolved. The decision tree shows these established decision-to-event relationships.

#### FR-33: Look up unresolved decisions from the timeline

Jo can access a section from the timeline to look up unresolved decisions in the selected universe and inspect their recorded timeline position, decision-maker, and decision.

**Acceptance:** The section makes unresolved decisions discoverable from the timeline. It reflects decision status: a decision resolved through a resulting event under FR-32 is no longer listed as unresolved. Universe context remains synchronized with the timeline as required by the brief.

### Plot tracking

#### FR-34: Record plot entries

Plot sequences belong to individual stories. Jo can record a plot entry with a heading, an optional date, and a number in its story's sequence.

**Acceptance:** Each plot entry supports a heading and an automatically assigned sequence number. An entry can be recorded without a date. Undated entries appear at the top of the plot sequence; dated entries follow in chronological date order. Sequence numbers reflect that resulting order and update when dates change. Manual reordering cannot override dated chronology; ordering among undated entries or entries with the same date remains unspecified.

### Factions

#### FR-36: Record faction profiles

Jo can create universe-owned faction profiles using the structure of the supplied [Fero-Kia example](sources/fero-kia-faction-profile.md). Stories in the same universe share faction records as agreed in the brief.

Supported profile information:

- Identity: faction name, description, and identifier image or pictogram.
- Government: type and notes.
- Leadership: leader image, name, age, public reputation, and narrative profile; head of military and head of intelligence.
- Strategic profile: overview, strengths, and weaknesses.
- Optional military roster (unit types): repeating unit entries with name, role, description, base strength, movement points, and base modifier points.

**Acceptance:** All profile fields outside the optional military roster must be filled in for a faction profile to be complete. Incomplete profiles can be saved as drafts and reopened for further editing. A faction can be complete without any unit types. When provided, the roster supports multiple entries with the listed unit fields. Example names, prose, images, and numeric values are not fixed defaults. Supporting a roster does not by itself require combat simulation or other military mechanics.

### Database export

#### FR-49: Export the database

Jo can export the locally stored database, separately from manuscript and settings exports.

**Acceptance:** A database export can be created from the project. Its exact format follows the selected SQLite or local PostgreSQL storage choice; recovery guarantees for backups remain covered by FR-23.

## Cross-cutting quality requirements

- **Data integrity:** Linked views use consistent records. Calendar edits preserve elapsed chronology; event changes and restoration follow the selected scope.
- **Recoverability:** Backups restore without the original database. Deletion and expiry preserve active references and minimum required revisions.
- **Space efficiency:** Unchanged backed-up content is stored once and reused by reference.
- **Local operation:** Writing, planning, revision recovery, and backups operate on one machine.
- **Persistence:** Saved manuscript formatting, character data, dates, settings, and record relationships survive closing and reopening.

No quantitative latency or project-size targets were supplied. Define measurable performance budgets against Jo's real project during architecture and verification rather than inventing launch-scale targets.

## Success checks

- **SM-1:** Jo can write a chapter while inspecting its timeline context, characters, and established decisions (FR-1, FR-45, FR-47).
- **SM-2:** Linked date edits and calendar changes produce the agreed chronology, selected event movement, and fixed flashback dates (FR-5 through FR-7, FR-14).
- **SM-3:** Decisions remain discoverable when unresolved and update correctly as resulting events are linked or removed (FR-31 through FR-33).
- **SM-4:** Jo can recover individual items, a project, replaced work, and a backup without broken dependencies (FR-2 through FR-4, FR-20 through FR-23).
- **SM-5:** Story and chapter exports and settings round-trips work in the agreed formats (FR-27 through FR-29).
- **Counter-check:** Reduced storage use must not remove required revisions or referenced content; no recovery success check is satisfied by silently losing retained work. Word-count targets must not restrict writing.

These are personal-release acceptance outcomes rather than commercial adoption metrics.

## Open items and downstream ownership

| Item | Owner | Revisit condition |
| --- | --- | --- |
| Scheduled backup default interpreted as 10 minutes | Jo | Before backup implementation or when configuring backups; retain the existing interval unless changed |
| Database choice: SQLite or local PostgreSQL | Architecture with Jo | Before persistence implementation; apply the matching retention policy |
| Deduplicated backup layout and reference/dependency model | Architecture | Before backup and revision storage implementation; prove recovery without the source database |
| Definition of snapshot size excluding images and one-month expiry calculation | Architecture with Jo | Before retention implementation |
| Supported OS versions and processor architectures | Jo with architecture | Before packaging and platform verification |
| Export formatting for each output format | UX with Jo | Before manuscript export implementation |
| Exact guided prompt wording | Jo with UX | Before character creator implementation; keep the supplied fields, optional specialities, and waiver behavior |
| Date display for standalone calendar days and optional year names | UX with Jo | Before calendar date-entry/display implementation; preserve the source formats in the addendum |
| Chapter date-range movement and first assignment of an optional start date | Jo with architecture | Before chapter movement implementation; define the shift offset and end-date behavior without inventing an offset for an undated chapter |
| Ordering plot entries with equal dates or no date | Jo with UX | Before plot-sequence implementation; preserve undated-first and dated chronological ordering |
| Partial item restoration involving other shared records | Architecture with Jo | Before restoration implementation; preserve linked-record integrity and user-selected event scope |
| Backup destination cancellation outside application close | Jo with UX | Before scheduled/manual backup error handling |

These items remain visible rather than being silently decided during PRD drafting.
