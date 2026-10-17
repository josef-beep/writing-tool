# Approved by Jo — recorded in epics.md

### Story 4.6: Find unresolved decisions from the universe timeline

As Jo,
I want to open a list of unresolved decisions from the universe timeline,
So that I can find established choices that still have no recorded result.

**Acceptance Criteria:**

**Given** a universe timeline is selected,
**When** I open its unresolved-decision section,
**Then** it lists exactly that universe’s decisions with neither outgoing result-event links nor outgoing following-decision links,
**And** each entry shows its recorded timeline position, decision-maker and decision text,
**And** the section identifies its owning universe and uses the same canonical records and shared resolution query as the tree.

**Given** an unresolved decision is listed,
**When** its first outgoing resulting-event or following-decision link is committed through the existing linking workflows,
**Then** that decision becomes resolved and leaves the unresolved list when the committed state is refreshed,
**And** no independently editable resolved flag or separate lookup copy is introduced.

**Given** a decision has outgoing event and/or following-decision links,
**When** one link is removed,
**Then** the decision stays out of the unresolved list while any outgoing link of either kind remains,
**And** removing its last outgoing link makes it unresolved and returns it to the list,
**And** unlinking preserves the canonical endpoint records and their dates/content.

**Given** A leads to B and B has no outgoing links,
**When** I open the lookup,
**Then** A is excluded as resolved and B is included as unresolved,
**And** an incoming relationship alone does not resolve B,
**And** standalone events without decision links are not listed as unresolved decisions and remain independently available on the timeline.

**Given** I select a listed decision,
**When** I inspect its details or follow its existing timeline/tree/editor navigation,
**Then** the same canonical decision and owning universe are resolved,
**And** inspecting the lookup does not change decisions, relationships, events or writing,
**And** pending manuscript edits follow the accepted navigation/retry contract.

**Given** I switch the universe or timeline selection, edit a decision or reconfigure its calendar,
**When** the lookup refreshes or reopens,
**Then** the selected universe and timeline remain synchronized in both directions,
**And** only the selected universe’s current unresolved decisions appear with their committed maker/text and recalculated displayed dates,
**And** calendar changes preserve elapsed decision positions and existing links,
**And** projects sharing the same universe query the same authoritative status.

**Given** there are no unresolved decisions or the query/reference cannot be loaded,
**When** I open or refresh the section,
**Then** a successful empty result is distinguishable from a reported load failure,
**And** failure does not silently present an incomplete result as a successful empty list, invent replacement records or modify saved state,
**And** canceled or failed link operations do not falsely remove or add decisions based on uncommitted changes.

**Requirements:** FR-33; FR-32 combined outgoing-result resolution; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.5 only. Reuse TECH-01 canonical decision/relationship queries, error contracts, identity/selection and committed-state refresh. Inherit DEC-03/04 chronology/display, DEC-15 pending-writing navigation and existing validated link operations; DEC-26/27/28 remain gates only for their unanswered maker/context and link-validation details. PLAN-04 captures lookup entry point, list/detail navigation, refresh and empty/error presentation. Character/story-arc and writing-context integration follows separately; no future context, recovery or export story is needed to use this lookup.

**Scope boundary:** A timeline-accessible unresolved-decision section scoped to the selected universe. No new decision type, hypothetical alternatives, standalone-event resolution requirement, automatic linking or custom status flag. Display ordering/filtering beyond the agreed lookup content is not prescribed. Canonical deletion is not introduced; later deletion paths must update this same lookup consistently while preserving retained dependencies under TECH-08.

**Verification:** Exercise initial unresolved decisions, first event-result link, first following-decision link, multiple/mixed outgoing links, removal of some versus all links and A → B with unresolved B. Confirm standalone events remain independent. Navigate to the same canonical record, switch universes/timelines/projects, edit details, reconfigure the calendar and reopen. Verify empty versus failed loads, canceled/failed link writes, missing references and pending-writing navigation without stale committed status or saved-data mutation. Later deletion work must verify lookup updates after removing affected live relationships with retained-history protection.
