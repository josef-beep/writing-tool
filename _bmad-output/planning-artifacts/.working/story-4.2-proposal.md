# Approved by Jo — recorded in epics.md

### Story 4.2: Record established decisions on the universe timeline

As Jo,
I want to record when a decision was made, who made it and what was decided,
So that established choices remain visible in the history of my universe.

**Acceptance Criteria:**

**Given** an authoritative universe is selected,
**When** I save an established decision with a fictional date, decision-maker and decision text,
**Then** it receives a permanent UUID in that universe and appears at its recorded timeline position,
**And** no hours, minutes or seconds are required,
**And** recording it requires no resulting event or story/plot association.

**Given** a decision has been saved without resulting-event links,
**When** I inspect it,
**Then** it is unresolved because it has no linked result,
**And** saving or editing its text, maker or date does not mark it resolved,
**And** no independently editable resolved flag is introduced.

**Given** I open an existing established decision,
**When** I explicitly save changes to its date, maker or decision text,
**Then** the same canonical record is updated and its timeline placement reflects the accepted date,
**And** edits survive close/reopen without changing unrelated events, chapters or plots,
**And** the same-universe projects resolve the same authoritative decision.

**Given** the fictional calendar is reconfigured or timeline/universe selection changes,
**When** decisions are displayed,
**Then** elapsed decision positions are preserved while displayed dates are recalculated,
**And** chronology and the existing optional same-date ordering contract apply,
**And** the timeline identifies its universe and excludes records from other universes.

**Given** required decision information is invalid, a reference is missing/foreign, I cancel, or saving fails,
**When** the operation completes,
**Then** invalid input is reported under the shared validation contract and cancellation leaves saved records unchanged,
**And** failed writes do not claim success or publish a partial decision/timeline update,
**And** pending edits follow the agreed navigation/retry contract without silently discarding writing.

**Requirements:** FR-31 decision recording and timeline context; initial FR-32 link-derived unresolved state; supporting FR-7/40/41/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Story 4.1 only; no future result-link/tree/lookup/context story is needed to record and inspect decisions. Resolve DEC-26 decision-maker representation/validation before the affected model/editor; TECH-01 defines shared decision DTOs, reference/date validation and query commands. Inherit DEC-03/04 chronology/display, DEC-14 timeline insertion and DEC-15 pending-editor navigation, and applicable TECH-02/04/05/11 persistence/publication/writer/restart guarantees. PLAN-04 covers decision-editor and timeline interactions.

**Scope boundary:** Record, inspect and explicitly edit established decisions in the existing universe timeline. Later stories add resulting-event links, relationship-tree display, unresolved lookup and character/story/writing-context navigation. No hypothetical alternatives, separate reason/consequence text fields, automatic event creation or decision deletion. Maker representation and context-association rules are tracked in DEC-26 rather than assumed.

**Verification:** Save/edit/reopen a decision with all three fields, verify canonical identity and timeline placement, shared-universe visibility and isolation from another universe. Confirm new decisions remain unresolved without links, calendar conversion preserves elapsed positions and same-date ordering follows the shared contract. Exercise invalid/missing/foreign references, canceled edits, failed writes and pending manuscript navigation without data loss.
