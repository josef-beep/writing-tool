# Approved by Jo — recorded in epics.md

### Story 4.7: Inspect established decisions in character, story-arc and writing context

As Jo,
I want to inspect relevant established decisions and their results in character/story-arc context alongside my manuscript,
So that I can understand the choices leading to the part of the story I am writing.

**Acceptance Criteria:**

**Given** established decisions have character/story-arc associations under the accepted DEC-26 contract,
**When** I inspect a character or story-arc context,
**Then** its relevant canonical decisions are accessible with their recorded dates, decision-makers and decision text,
**And** the context uses those agreed associations rather than inferring relevance solely from a shared date, chapter period or universe,
**And** character context does not assume every decision-maker is necessarily a character.

**Given** a chapter is selected in the existing manuscript/timeline workspace,
**When** I inspect decision context alongside writing,
**Then** established decisions are accessible through the existing owning-universe context surface together with the already available character/event context,
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
**And** makerless display/filter behavior follows DEC-30 without inventing a placeholder maker.

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

**Dependencies:** Approved Epic 1–3 capabilities, especially Story 3.14’s chapter/timeline/character/event workspace, and Stories 4.1–4.6 only. Resolve DEC-26 association meaning, ownership, creation/editing and relevance/query rules before implementing contextual associations; approval chooses no unanswered association rule or mandatory field. Initial categories and Personal/Story maker rules are settled; resolve DEC-30 custom-type/makerless details and DEC-29 filter selection/default/persistence/surface-interaction rules before affected filter implementation. Retain DEC-25 partial-date focus and DEC-15 pending-writing navigation. TECH-01 defines common context/selection/reference/filter contracts rather than a parallel decision store; inherit existing publication/writer/restart/persistence guarantees for any accepted association mutation. PLAN-04 must capture character/story-arc/writing layouts and navigation, including out-of-period decisions/results, visibility controls and filtered-empty/hidden-relationship presentation. DEC-11 performance acceptance remains open.

**Scope boundary:** Integrate established decisions and existing result relationships into existing character/story-arc/manuscript context, with decision-maker and event-type show/hide controls. Reuse shared filters for affected timeline/context presentation under DEC-29; no visibility action mutates records, links or resolution. Define and implement only associations required by the accepted DEC-26 contract; do not silently equate maker, chapter membership, timeline proximity or plot-entry identity with arc relevance. No hypothetical alternatives, separate reason/consequence text fields, inline chapter event edits, automatic chronology changes, event duplication or faction-history timeline entries. Recovery/export are later epics and not prerequisites for contextual writing.

**Verification:** Verify Personal requires a maker; Story permits none; Universe Events permit no maker/decision or optional direct links. Add a decision type through Story 4.2 and verify record assignments and its category filter after reopening. Hide/show decisions from different makers and events from each accepted type, independently and together; clear filters and verify reappearance under remaining context constraints. Include standalone events, a hidden event/decision that still resolves its source, active-filter empty states and foreign-universe isolation. Verify record counts/links/dates and unresolved-lookup membership are unchanged by filtering. Inspect agreed character/story-arc associations and the same decisions alongside writing; verify canonical navigation into decision chains and event results, including records outside the focused chapter period. Exercise dated/start-only/end-only/undated chapters under DEC-25, unrelated same-date decisions, empty context, shared-universe projects with distinct story associations/plots and foreign-universe records. Refresh/reopen after explicit edits, link/unlink changes and calendar conversion; verify combined outgoing-link status across context/tree/lookup. Protect pending manuscript edits through navigation, canceled edits, missing references and failed queries without changing chapter/event data or inventing relevance.
