# Story 2.3 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

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
**And** editing both uses the explicitly entered values, subject to the separately agreed DEC-01 validation rule.

**Given** a chapter has a start and end date,
**When** I move its start date,
**Then** the end remains at its existing elapsed position unless explicitly edited,
**And** chapter UUID, title, manuscript and story ownership are unchanged,
**And** neither the old chapter duration nor the old end-date offset is automatically preserved by shifting the end.

**Given** a story has chapters with and without start dates,
**When** the chapter list is displayed after a saved date change,
**Then** chapters without starts appear first in creation order,
**And** chapters with starts follow in chronological start-date order,
**And** an end date alone never substitutes for a missing start in sorting,
**And** same-start ties follow DEC-16 once resolved, without borrowing unrelated plot/event ordering rules.

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
**And** invalid input is handled according to DEC-01 and the common calendar bounds without silently correcting the other date,
**And** persistence failure is reported without claiming success or corrupting the saved chapter,
**And** pending manuscript edits remain protected by the existing editor-state contract.

**Requirements:** FR-42; independent chapter-field behavior under FR-5 and contracts.md; continued FR-7 preservation for newly introduced chapter dates; CAP-2/3/4; AD-3/6/8/10/13/18 and AD-16 as superseded by independent date fields; NFR-1/2/3/6/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.2 only. Resolve DEC-01 (end-before-start behavior) and DEC-16 (same-start chapter ties) before implementing those cases. Use DEC-03/04's chronology bounds/display contract, TECH-01's common date representation and TECH-02/04/05's coordinated publication/writer/recovery guarantees, including cross-store consistency where needed. Inherit TECH-11 persistence and DEC-15 pending-editor-state protections. Capture date-entry/list interactions under PLAN-04.

**Scope boundary:** No timeline zoom, chapter/event association, event-editor navigation or restoration UI is introduced here. Those later workflows must use these same independent date fields. Changing a chapter's dates never changes any linked or unrelated universe events; FR-5 requires a chapter-view link to the dedicated event editor for explicit event changes. No automatic end shift is reintroduced.

**Verification:** Exercise neither/start-only/end-only/both dates; first assignment, moving, clearing and editing both; missing-start creation order and dated chronology; reopen without manuscript-format loss. Test month/standalone-day/year boundaries and calendar reconfiguration with chapters across shared-universe projects. Add DEC-01/16 cases when resolved, and verify cancellation, failed writes and unchanged event records.
