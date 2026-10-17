# Story 1.8 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

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
**And** new-event/redated-event placement follows the separately agreed DEC-14 contract.

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

**Dependencies:** Approved Stories 1.1–1.7 only. Resolve DEC-14 before insertion/date-transition placement is implemented; the plot-specific FR-34 placement rule is not a timeline default. Capture the ordering interaction under PLAN-04. Inherit the existing TECH-01/02/04/05/11 storage, identity, publication and writer contracts.

**Scope boundary:** Apply ordering to the standalone events available now, using a shared timeline contract that later character/background/decision event types can also use. Those future record types are not prerequisites. This story introduces no clock times, cross-date manual ordering, event deletion, plot-order changes or calendar reconfiguration.

**Verification:** Save without manual order; reorder several same-date events; reopen and view through another project sharing that universe; verify unchanged dates/content/UUIDs and unaffected neighboring groups. Check empty/single-event groups, invalid cross-date/universe reorder requests and canceled/failed writes. Add creation/date-transition placement checks once DEC-14 is resolved.
