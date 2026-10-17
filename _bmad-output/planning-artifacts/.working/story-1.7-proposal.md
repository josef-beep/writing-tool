# Story 1.7 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.7: Record standalone events on the universe timeline

As Jo,
I want to record dated events directly in a universe and browse them chronologically,
So that I can establish its history without first creating stories or characters.

**Acceptance Criteria:**

**Given** an available universe with a configured calendar,
**When** I create an event with a heading and date,
**Then** it is saved as a universe-owned record with a permanent UUID,
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
**And** changing the date updates its chronological placement without creating a duplicate event,
**And** unrelated event dates and content remain unchanged.

**Given** multiple projects refer to the same authoritative universe,
**When** its timeline is accessed through those projects or directly,
**Then** all views use the same universe-owned event records,
**And** selecting a different universe or its timeline synchronizes the owning context in both directions,
**And** events from another universe are not mixed into the selected timeline.

**Given** an event and its edits were successfully saved,
**When** I close and reopen its universe,
**Then** its identity, heading, date, optional description and chronological placement are preserved,
**And** a universe with no events accurately shows an empty timeline.

**Given** I cancel event editing or an event write fails,
**When** the operation ends,
**Then** cancellation leaves the persisted event unchanged,
**And** failures are reported without claiming a successful save,
**And** the last committed timeline state remains consistent under the shared publication protocol.

**Requirements:** CAP-3; FR-35, standalone-event application of FR-40 and timeline/event sharing under FR-44; optional-order entry support for FR-41. AD-3/6/8/10/18 and canonical event-ownership/chronology conventions; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Stories 1.1–1.6 only. Direct universe operation does not require a project, although project entry uses the already approved association workflow. Inherit applicable TECH-01/02/04/05/11 identity/storage/publication/writer gates and DEC-03/04 chronology/display contracts. Capture timeline/event-entry interactions under PLAN-04. Date input must use the agreed bounds and conversion contract; no additional time precision is inferred.

**Scope boundary:** No event deletion, chapter association, character background, faction change, decision graph or plot feature is introduced here. Optional manual arrangement within a date follows in another Epic 1 story; saving events without that arrangement must already work here. Populated-calendar editing follows in its own Epic 1 story and must preserve these events' elapsed positions. Until that implementation exists, this story must not enable an unsafe calendar rewrite of dated content.

**Verification:** Create a standalone event with no project or description; edit its content/date without changing UUID; check chronological order, same-date creation, standalone-day/year-boundary dates and reopen persistence. Exercise shared-project access, switching universes, empty state, canceled edits and failed publication without cross-universe writes or duplicate records.
