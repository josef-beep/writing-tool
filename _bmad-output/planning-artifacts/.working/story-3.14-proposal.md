# Story 3.14 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

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
**Then** the linked historical event remains discoverable through the navigation agreed under DEC-25,
**And** its date is not shifted or reinterpreted as the chapter period,
**And** focusing the timeline does not remove the depiction link.

**Given** the chapter has only one date or neither date,
**When** I select it or request timeline focus,
**Then** context/navigation follows DEC-25 without fabricating a start or end,
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

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.13 only. Resolve DEC-25 partial/absent-date focus and out-of-period navigation before implementation; retain DEC-01 range validation, DEC-03/04 shared chronology/display, DEC-14 event order, DEC-16 chapter ties and DEC-15 pending-edit navigation. TECH-01 defines common context query/selection/reference results; reuse the existing authoritative stores, secure transport and dedicated editors rather than a separate timeline database. Capture chapter-context/editor layout and interactions under PLAN-04; quantitative performance budgets remain DEC-11.

**Scope boundary:** This story completes Epic 3's chapter/character/event timeline context using already available records. Established-decision context under FR-45 is added in Epic 4 when decision records exist, reusing this same context surface and selection contracts; it is not a dependency for current writing/context use. No new event type, event duplication, inline chapter event editor, automatic chapter/event date shift, hypothetical branch or faction-history timeline entry is introduced.

**Verification:** Focus a dated chapter and inspect associated characters/main events/flashbacks while writing. Exercise same-date order, flashbacks outside the focused period, start-only/end-only/undated chapters and empty context under DEC-25. Switch chapters/projects/universes, follow editor/sheet links, refresh after explicit event edits/calendar changes and verify correct canonical records without chapter-driven mutation. Confirm pending edits survive the agreed navigation paths and failed/missing-context queries do not alter writing data. Epic 4 must add established-decision context checks.
