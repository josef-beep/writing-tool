# Story 1.9 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.9: Revise a populated calendar without changing elapsed chronology

As Jo,
I want to change my universe's calendar after recording events,
So that I can refine how dates are expressed while preserving when events happen and the time between them.

**Acceptance Criteria:**

**Given** a universe calendar already has dated timeline events,
**When** I change its valid ordered sequence, month lengths or total year length and save,
**Then** the existing dated content does not prevent calendar editing,
**And** every existing event retains its elapsed universe-time position,
**And** displayed dates are recalculated using the revised calendar,
**And** event UUIDs, headings, descriptions and owning universe remain unchanged.

**Given** events span month, standalone-day and year boundaries,
**When** the calendar changes between months-only, mixed-month/standalone-day or days-only configurations,
**Then** chronological order and the elapsed-day interval between every pair of events remain unchanged,
**And** no event is silently dropped or shifted to keep its old displayed date,
**And** conversion follows the agreed epoch/year-bound contract rather than an invented migration offset.

**Given** multiple events share an elapsed date and have a saved manual order,
**When** their dates are redisplayed under the revised calendar,
**Then** they continue to share the same chronological position and retain their manual within-date order,
**And** no time-of-day values are introduced.

**Given** a valid edited sequence totals 360 days while its entered target remains 365,
**When** I save the populated calendar,
**Then** the target is corrected to 360 and saving is permitted under FR-10,
**And** elapsed positions, intervals and order are preserved just as for a matching target,
**And** optional year names and named calendar elements use the agreed display rules.

**Given** multiple projects share the universe,
**When** the calendar change is committed and the timeline is queried through each project,
**Then** all views use the same authoritative calendar and show its recalculated dates,
**And** closing/reopening preserves that calendar and the same elapsed chronology,
**And** other universes are unchanged.

**Given** I cancel the edit or publication fails or is interrupted,
**When** the operation ends or the application restarts,
**Then** cancellation preserves the prior committed calendar and timeline,
**And** the agreed publication/recovery protocol prevents a mixed or partially published calendar state,
**And** the application does not report an incomplete calendar change as successful or lose existing dated content.

**Requirements:** CAP-4; FR-7 with continued FR-8–13/40/41/44 behavior; AD-3/6/8/10/18 and the common fictional-chronology convention; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.8 only. Resolve DEC-03/04/13 chronology, display and calendar-validation contracts before implementation. Use TECH-01's common chronology contract and TECH-02/04/05's consistent publication, writer serialization and operation-recovery guarantees; inherit relevant TECH-11 persistence verification. Capture populated-calendar editing interactions under PLAN-04.

**Scope boundary:** Extend the existing calendar and event model rather than introducing another source of chronology. Standalone events provide the current integration evidence. Later chapter, background, birth, faction, decision and plot stories must use this same calendar contract and add acceptance checks that their elapsed positions/intervals also survive calendar changes. They are not prerequisites for implementing or accepting this story's current standalone-event workflow. Real elapsed revision/backup age remains independent of fictional calendar changes.

**Verification:** Compare all saved event positions and pairwise elapsed intervals before/after calendar edits, including events at year/month/standalone-day boundaries and manually ordered same-date groups. Exercise all three calendar forms, changed year lengths, target mismatches, optional year names, shared-project views and reopening. Verify canceled edits, publication failure and restart recovery under the agreed protocol without changing unrelated universe data.
