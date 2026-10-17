# Story 3.12 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

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
