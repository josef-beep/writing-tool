# Approved by Jo — recorded in epics.md

### Story 4.3: Link established decisions to their resulting events

As Jo,
I want to connect established decisions with the events that resulted from them,
So that I can track their consequences and see which decisions still lack a recorded result.

**Acceptance Criteria:**

**Given** I want to record an event without a contributing decision,
**When** I create and save it through the existing standalone-event editor,
**Then** it can exist with zero decision links and appears at its own universe date,
**And** no decision selection or placeholder decision is required to save, edit or reopen it,
**And** eligible standalone events can later be linked as results without changing their UUID or content.

**Given** an established decision in the selected universe,
**When** I explicitly create a resulting event through the dedicated canonical event editor and save its link to that decision,
**Then** the event appears at its own recorded universe date and the decision becomes resolved after the relationship is committed,
**And** the event and link follow the shared coordinated-publication/recovery contract without leaving a partially published result,
**And** no event is created merely by viewing or saving the decision.

**Given** eligible canonical events and established decisions in the same universe,
**When** I link an existing event as a result,
**Then** one decision can have multiple resulting events and one event can result from multiple decisions,
**And** linking reuses the existing event UUID rather than copying its content,
**And** adding a link does not change either record’s date/content, chapter dates or depiction links,
**And** repeated linking of the same pair does not duplicate the relationship or result count.

**Given** a decision already has a resulting event,
**When** I add further resulting-event links,
**Then** it remains resolved and all its saved links remain accessible,
**And** each event stays at its own timeline position rather than being moved to the decision’s date.

**Given** a decision has one or more resulting-event links,
**When** I explicitly remove a link,
**Then** it stays resolved if any result links remain and becomes unresolved if none remain,
**And** unlinking does not delete or edit the canonical event,
**And** removing an event’s last decision link leaves it saved and visible on the universe timeline at its unchanged date,
**And** other decisions linked to that event retain their links and independently derived status.

**Given** I inspect a decision or resulting event after committed changes or reopening,
**When** its relationships are loaded,
**Then** I can inspect its linked counterparts in both directions using canonical same-universe identities,
**And** resolution is computed from remaining links rather than a separately editable flag,
**And** projects sharing the universe see the same authoritative relationships.

**Given** a proposed link has an unavailable, foreign-universe or otherwise ineligible endpoint, I cancel, or persistence fails,
**When** the operation is processed,
**Then** invalid links are rejected without inventing replacement records,
**And** cancellation leaves saved relationships unchanged,
**And** failure is reported without claiming successful creation/linking/unlinking or publishing inconsistent status,
**And** pending manuscript edits follow the existing navigation/retry contract.

**Requirements:** FR-32 many-to-many resulting-event relationships and link-derived resolution; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.2 only. TECH-01 defines relationship identity, endpoint validation, reverse queries and shared commands; TECH-02/04/05/11 govern coordinated publication, serialization, restart recovery and persistence. Resolve DEC-27 result-event eligibility and temporal validation before linking implementation. Inherit DEC-03/04 chronology/display, DEC-14 event insertion and DEC-15 pending-edit navigation. PLAN-04 covers result creation/link/unlink interactions. No future tree, lookup, recovery or context story is needed to create and inspect these links.

**Scope boundary:** Decision links are optional for events; the existing FR-35 standalone-event workflow remains independently usable. Explicit resulting-event creation via the existing editor, existing-event linking, unlinking and bidirectional relationship inspection. Tree visualization and the dedicated unresolved lookup follow in later stories. No hypothetical branches, separate consequence text field, chapter-driven event edits or faction-history timeline entries. Canonical event deletion is not introduced here; before any later event-deletion path, TECH-08 must protect references/history and FR-32 requires recomputing every affected decision from surviving links, including unresolved lookup updates once available.

**Verification:** Create/edit/reopen an event with zero decision links; later link it and remove its last decision link, verifying unchanged identity, content and timeline placement. Create a result, link an existing event, connect two decisions to one event and multiple events to one decision. Verify duplicate-pair prevention, adding after resolution, removing one versus the last link and independent status of other decisions. Confirm both-direction inspection, identity/date/content preservation, reopening and shared-universe visibility. Exercise foreign/missing/ineligible endpoints, DEC-27 temporal cases, canceled event/link actions and failure/restart during coordinated event/link publication. Later tree/lookup stories verify the same relationships and status; later deletion work must verify last-result removal with retained-history protection.
