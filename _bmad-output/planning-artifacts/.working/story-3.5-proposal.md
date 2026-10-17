# Story 3.5 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.5: Record character birth years on the universe timeline

As Jo,
I want a character's entered birth year to appear on the universe timeline,
So that its place in the setting's history stays linked to the character.

**Acceptance Criteria:**

**Given** a character exists in a universe with a configured calendar,
**When** I enter and save an accepted birth year,
**Then** the application creates a birth record in that universe linked to the same character identity,
**And** the birth is placed on day 1 of the entered year,
**And** no month, day-of-month, hour, minute or second input is required from me,
**And** a character can still be saved without a birth year.

**Given** the configured year begins with a standalone day,
**When** I save a character's year-only birth,
**Then** its timeline record is placed on that first standalone day,
**And** the application does not substitute the first day of the first month.

**Given** a character already has a linked birth record,
**When** I save a changed birth year,
**Then** the same linked record is updated to day 1 of the new year,
**And** its event UUID and character/universe association remain unchanged,
**And** repeated saving does not create duplicate birth records,
**And** unrelated character fields and events are unchanged.

**Given** the birth record has been committed,
**When** I view the character and its owning-universe timeline, including through associated projects,
**Then** both use the same linked birth information,
**And** the record appears at its chronological position and participates in the common optional same-date ordering contract,
**And** year-only day-1 placement is not presented as evidence that the precise historical birth day is known.

**Given** dated birth records exist,
**When** the universe calendar is reconfigured through Story 1.9,
**Then** their elapsed positions, chronological ordering and intervals are preserved while displayed dates are recalculated,
**And** an existing birth is not automatically shifted back to day 1 of a newly calculated year,
**And** the profile's year-only display and direct-edit/clearing interactions follow the separately agreed DEC-19 contract.

**Given** a character birth year and linked record were saved,
**When** I close and reopen the universe,
**Then** their association and saved information remain intact,
**And** characters without birth information remain valid without invented dates.

**Given** I cancel editing, enter a year outside the accepted calendar bounds or a coordinated save fails,
**When** the operation ends,
**Then** cancellation preserves the saved character/birth record,
**And** invalid years and persistence failures are reported without claiming success,
**And** the shared publication/recovery protocol prevents a partially applied character field or orphaned/duplicate birth event.

**Requirements:** FR-14; birth-event application of FR-40/41/44 and FR-7 chronology preservation; CAP-3/5; AD-3/6/8/10/18 and canonical timeline ownership; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.4 only. Use DEC-03/04's year-bounds/chronology/display contracts and DEC-14's event insertion/date-transition ordering. Resolve DEC-19 before birth clearing/direct-edit and post-calendar profile display behavior is implemented. Use TECH-01's common character/event/reference schema and TECH-02/04/05/11 publication, writer, operation-recovery and persistence guarantees. TECH-08 applies before any removal affecting shared references/history. Capture character birth entry and timeline presentation under PLAN-04.

**Scope boundary:** This story records a year-only birth and its linked timeline position. It adds no precise-birthdate requirement, age calculation, death record, independent duplicate birth event, chapter relationship or new character completeness requirement. Generic character background events follow as a separate capability using the same timeline infrastructure. DEC-19 remains an unanswered decision; scope approval does not authorize a particular clearing/deletion rule.

**Verification:** Save year-only births in months-only, mixed and days-only calendars, including a year starting with a standalone day. Change the year and repeat saves without duplicate records; reopen and view through shared-universe projects. Reconfigure the populated calendar and compare elapsed positions/intervals; retain optional same-date order. Exercise no birth year, invalid year bounds, canceled changes and failed coordinated saves. Add direct-edit/clearing/profile-display cases once DEC-19 is resolved.
