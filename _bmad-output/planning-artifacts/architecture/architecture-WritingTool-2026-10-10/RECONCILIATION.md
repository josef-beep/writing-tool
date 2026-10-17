# Requirements reconciliation

Source: finalized [PRD](../../prds/prd-WritingTool-2026-10-10/prd.md), its decision log and this architecture coaching session. The source PRD is preserved; this companion records the later decisions to adopt when refreshing the spec/PRD.

| Source | Later decision to carry forward |
| --- | --- |
| FR-19 size-based SQLite retention; PostgreSQL indefinite retention | Current implementation uses configurable time-only cleanup, default 30 days, for revisions and ZIP archives. Remove size thresholds and image-size accounting entirely. PostgreSQL implementation remains later; reconcile its policy when designed. |
| FR-20/22 dependency protection | Complete logical revisions reuse immutable content; current/retained references remain protected. No replay-dependent revision chain and no fixed minimum revision count. |
| FR-21 unchanged backup content stored once | Once within each complete independent archive/store; unchanged images may occur in multiple separate ZIPs. |
| FR-23/24 whole-project backup | Project and universe are separate database/image/recovery units. Project ZIP includes project content plus its universe snapshot. Universe ZIP excludes project-owned content and is independently usable. |
| FR-25 selected backup destinations | Live project/universe folders are also user-selected, independently of backup destinations. |
| Retention not specified for separate archives | Ten newest successful valid backups per project and per standalone universe are always protected, including manual deletion. Only older archives beyond the configurable age are eligible. |
| FR-2/3 project restoration | Use the one authoritative newest universe. Conflicts resolved manually; update the older project and make a new project ZIP after reconciliation. Replaced pre-restoration snapshots still apply. |
| FR-5/42 date movement | Optional automatic linked updates enabled by default. Existing-start moves shift existing end and only selected main events when enabled. First assigning/clearing start and end-only edits change only that field. Flashbacks never shift through chapter operations. |
| Project/story organizational scope | Project contains multiple stories; optional volumes group them. Counts and word length unrestricted. Ten stories/~100 chapters is workload context only. |
| Supported-platform open item | Windows 10+, macOS 13+; broad Ubuntu/Debian-based Linux including Pop!_OS, Zorin, Mint. Exact distro baseline and architecture matrix require packaging verification. Windows 8 dropped explicitly after Electron support check. |
| Database and technical choices open | Clean Architecture throughout; Electron, TypeScript, React, Lexical; WritingTool-owned versioned JSON manuscript; separate SQLite units initially and PostgreSQL later. Managed external image copies and relative links. Dedicated background use-case host and typed UI bridge. |
| FR-28/29 settings inventory | Include configurable retention along with autosave/revision/backup intervals, destination and theme. |

Unaffected requirements remain binding, including all first-release capabilities, draft saves/completeness, optional specialities, supplied trait/faction structures, established decisions only, optional same-day ordering, date-only calendars and shared universe selection context. No technology integration or performance claim is validated by this design document alone.

## Later explicit storage decision

Jo selected JSON object/settings files, plain-text .wrt chapter writing, ID filename stems and an ID/relationship/location catalog database in its dedicated folder. AD-10/13 and canonical contracts now record this; older JSON-manuscript/database-payload rows above are superseded for persistence. DEC-36 formatting representation and the shared TECH publication/capture/migration gates remain open. All files and database catalog remain required complete-ZIP content.

Jo subsequently resolved DEC-36: chapter JSON stores rich-format metadata paired with the chapter ID’s plain-text WRT. The prior note that rich-format representation was undecided is superseded; exact schemas/anchors and crash-safe paired publication remain technical gates.

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

