# Story 3.6 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.6: Record character background events on the shared timeline

As Jo,
I want to record dated events as part of a character's background,
So that the character's history and universe chronology refer to the same information.

**Acceptance Criteria:**

**Given** a character exists in an available universe with a configured calendar,
**When** I create a background event with a heading and date,
**Then** it is saved as a canonical universe event linked to that character,
**And** its description is optional,
**And** no project, story, chapter, plot or established decision is required,
**And** no hours, minutes or seconds are required.

**Given** the background event was successfully saved,
**When** I inspect the character's background or its owning-universe timeline,
**Then** both views resolve the same event UUID and character/universe reference,
**And** the timeline shows it at its recorded chronological position,
**And** displaying the event in both places does not create a copied event record.

**Given** a background event is accessible through the character or timeline view,
**When** I save changes to its heading, date or optional description through either entry point,
**Then** both views reflect the same committed changes,
**And** the event UUID and character/universe association are preserved,
**And** changing its date updates chronological placement without duplicating it,
**And** unrelated events and profile responses remain unchanged.

**Given** background events share a date with other timeline events,
**When** I save them without manual ordering or arrange that date through Story 1.8,
**Then** saving requires no ordering action,
**And** optional arrangement uses the same canonical date-group order,
**And** no date is changed to express within-day order,
**And** creation/date-transition placement follows DEC-14.

**Given** a universe with background events is reconfigured through Story 1.9,
**When** its calendar changes,
**Then** those events retain their elapsed positions, chronological order and elapsed intervals,
**And** only displayed dates are recalculated under the revised calendar.

**Given** background events were saved,
**When** I reopen the universe or access it through an associated project,
**Then** their headings, dates, descriptions, identities and character associations are preserved,
**And** other universes' characters/events remain separate,
**And** a character with no background events remains saveable.

**Given** structured background events and guided development coexist,
**When** character completeness is evaluated,
**Then** the relationship between events and the expected background field follows DEC-20's agreed rule,
**And** this feature does not silently invent additional required prompts or automatic waivers,
**And** unanswered expected background information still does not block a named character's save.

**Given** I cancel editing or event/link publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved event and association,
**And** failures are reported without claiming success,
**And** the agreed publication/recovery protocol prevents a dangling link or partially updated event,
**And** a cross-universe character reference is rejected without changing existing records.

**Requirements:** FR-39; FR-40/41/44 background-event integration; FR-7 calendar preservation; related FR-16/48 background presentation; CAP-3/5; AD-3/6/8/10/18 and canonical event-ownership convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.5 only. Use DEC-03/04's shared chronology/display contract and DEC-14's event-placement rules. Resolve DEC-20 before integrating structured events with guided background completeness. Reuse TECH-01's event/character/reference schemas and applicable TECH-02/04/05/11 publication, writer, recovery and storage guarantees. Capture the background/event-entry interactions under PLAN-04. TECH-08 remains a gate before future shared-record deletion or unlinking semantics.

**Scope boundary:** Extend the existing universe event model and character background view. This story does not create an independent project-local history, require a project, introduce multi-character association rules, decide event deletion/unlinking, or add faction/chapter/decision relationships. Later chapter depiction and decision-result workflows must link the same canonical events rather than copy background content.

**Verification:** Create a background event with no description or project, verify the same UUID through character/timeline views, edit from both entry points and reopen through shared-universe projects. Verify same-date behavior, changed dates and populated-calendar conversion without elapsed-position changes. Exercise no events, foreign-universe links, canceled edits and failed event/link publication. Add completeness cases once DEC-20 is resolved.
