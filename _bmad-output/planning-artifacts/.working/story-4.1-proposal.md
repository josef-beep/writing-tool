# Approved by Jo — recorded in epics.md

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
