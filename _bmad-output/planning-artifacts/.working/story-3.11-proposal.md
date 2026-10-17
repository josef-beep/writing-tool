# Story 3.11 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.11: Plan linked chapter events from the chapter or timeline

As Jo,
I want to plan chapter events from either my chapter or a universe timeline position,
So that the manuscript and the universe's history refer to the same events.

**Acceptance Criteria:**

**Given** a chapter belongs to a project with an authoritative universe,
**When** I associate an eligible existing event with that chapter,
**Then** the chapter links the event's existing UUID and owning-universe identity,
**And** the depiction link distinguishes a main event from a flashback,
**And** linking does not duplicate the event, move its recorded date or alter either optional chapter date.

**Given** I am planning a chapter,
**When** I use its event action to open the dedicated event editor and save a new dated event,
**Then** it is saved as a canonical event in the same universe and linked with the selected depiction role,
**And** its dated content appears automatically at the same recorded position on the universe timeline,
**And** chapter and timeline views use the same event content/identity rather than independent copies,
**And** the chapter view does not provide inline event content/date editing.

**Given** I select a position on the universe timeline to populate chapter events,
**When** I choose or create the relevant chapter through the existing chapter workflow, complete event data in the dedicated event editor and save the accepted event/link inputs,
**Then** the selected position supplies the date input according to DEC-24's agreed entry rules,
**And** the resulting chapter/event link is the same kind used by chapter-first planning,
**And** the application does not require inventing an optional chapter start/end date or silently changing one.

**Given** a chapter has linked main events and flashbacks,
**When** I inspect its event associations or their universe timeline records,
**Then** their saved roles, canonical records and historical dates remain distinguishable,
**And** the chapter can still exist without any event links or dates,
**And** cross-universe events and character-sheet-only faction history cannot be presented as valid timeline-event link choices.

**Given** a current chapter/event link exists,
**When** I remove that depiction link,
**Then** only the chosen current association is removed,
**And** the canonical universe event and any other links remain intact,
**And** protected retained references/history are preserved under the shared integrity contract.

**Given** linked planning data was committed,
**When** I close/reopen the project or inspect the universe through another associated project,
**Then** the same canonical events, owning identities and chapter depiction links are resolved,
**And** the existing calendar-change contract preserves linked events' elapsed positions and optional within-date order.

**Given** I cancel planning, submit invalid ownership/role/date inputs or event/link publication fails,
**When** the operation ends,
**Then** cancellation preserves the committed chapter and universe state,
**And** DEC-24 validation and persistence errors are reported without claiming success,
**And** the coordinated publication/recovery protocol prevents partially created chapter/event/link state or duplicate canonical events,
**And** pending manuscript edits remain protected.

**Requirements:** FR-46; main/flashback link foundation for FR-5/6; event-context foundation for FR-45; continued FR-7/40/41/42/44; CAP-3; AD-3/6/8/10/18 and event ownership; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.10 only. Resolve DEC-24 eligibility/role/range/date-entry rules before implementation. Reuse DEC-03/04 chronology/display, DEC-14 event insertion and existing optional chapter-date validation. TECH-01 must define the common chapter/event/depiction-role contract; TECH-02/04/05 must prove coordinated cross-project/universe publication, writer serialization and restart recovery before these linked writes. Use TECH-08 before removing links, TECH-11 persistence guarantees and DEC-15 pending-editor protection. Capture both entry directions under PLAN-04.

**Scope boundary:** Deliver canonical chapter/event planning without requiring future decision trees, restoration or timeline zoom. Direct flashback historical-date editing in the event editor, Edit event links for existing chapter events and chapter-period context follow in separate stories using these links. Chapter dates retain independent field behavior; a link alone never moves an event. Faction affiliation history remains on the character sheet only and is not converted into timeline events.

**Verification:** Link an existing same-universe event as main/flashback; create linked events by opening the dedicated event editor from a chapter; plan from a selected timeline position using existing/new chapters. Verify one canonical UUID through both entry paths, unchanged dates on link-only changes, undated/no-link chapters, removal without event deletion and saved links after reopening. Exercise calendar conversion, foreign-universe/affiliation-history rejection, canceled edits and cross-store publication/restart failures. Add eligible-type/role/range/date-prefill cases once DEC-24 is resolved.
