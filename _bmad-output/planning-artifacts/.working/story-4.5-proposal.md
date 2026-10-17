# Approved by Jo — recorded in epics.md

### Story 4.5: Inspect established decision/result relationships in a tree view

As Jo,
I want a visual tree of established decisions, decisions they lead to and resulting events,
So that I can follow the recorded relationships that shape my universe’s history.

**Acceptance Criteria:**

**Given** established decisions and saved result links exist in the selected universe,
**When** I open the decision-tree view,
**Then** it displays established decision-to-decision and decision-to-event relationships using the existing canonical records,
**And** I can identify each decision by its recorded date, maker and decision text and each resulting event by its heading and date,
**And** the view identifies its owning universe and creates no separate timeline or event store.

**Given** a decision has multiple results or an event has multiple contributing decisions,
**When** I inspect the tree,
**Then** all those relationships can be inspected without treating the event as separate underlying records,
**And** visual occurrences of a shared event resolve to the same canonical event UUID,
**And** visual layout does not imply additional decision/event relationships or hypothetical alternatives.

**Given** a decision has neither outgoing result-event links nor following-decision links,
**When** it is displayed in the tree,
**Then** it is identifiable as unresolved with no invented result,
**And** an event with zero decision links remains independently saved and visible on the universe timeline without requiring a tree relationship or placeholder decision.

**Given** A leads to B and B has no outgoing results,
**When** I inspect their status in the tree,
**Then** A is resolved through its link to B and B remains unresolved,
**And** a decision with both outgoing event and decision links stays resolved until its last outgoing link across both kinds is removed,
**And** incoming links alone do not resolve the receiving decision.

**Given** I select a decision or event in the tree,
**When** I inspect its details or open its existing editor,
**Then** navigation resolves the same canonical same-universe record,
**And** inspecting or arranging the view does not change record dates/content, links, chapter dates or manuscripts,
**And** pending writing follows the existing editor-navigation contract.

**Given** a decision/event is explicitly edited, links are committed or removed, or the calendar is reconfigured,
**When** the view refreshes or reopens,
**Then** displayed relationships and per-decision status agree with the committed canonical records,
**And** dates reflect the current calendar while elapsed positions remain unchanged,
**And** removing links preserves endpoint records and recomputes each affected decision’s status from its remaining outgoing event and decision links.

**Given** I switch universes, the selected universe has no decisions, or a query/reference fails,
**When** the tree loads,
**Then** it shows only the selected universe’s records or an accurate empty state,
**And** a failure is reported rather than presented as a successful empty result,
**And** missing references do not create replacement records and viewing failures leave saved data unchanged.

**Requirements:** FR-32 established relationship-tree display; supporting FR-31/35/40/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/7/9. Quantitative performance acceptance remains DEC-11.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.4 only. Reuse TECH-01 canonical relationship queries, identities, errors and selection results; inherit DEC-03/04 date display, DEC-15 pending-editor navigation and Stories 4.3–4.4’s relationship contracts, including the accepted either-result resolution rule. DEC-28 validation rules remain an implementation gate. PLAN-04 must capture tree layout, shared-event presentation, navigation, empty/error states and readable access to all relationships before this UI implementation. The dedicated unresolved lookup and character/story/writing-context integration are later stories, not prerequisites.

**Scope boundary:** Visualize existing established decision/result relationships and navigate to existing details/editors. No hypothetical branches, automatic inferred links, new record types, independent timeline, generic graph-editing feature, event deletion or required links for standalone events. Tree layout must represent many-to-many relationships faithfully without prescribing a particular graph library or visual duplication strategy.

**Verification:** Display a decision-to-decision chain with a downstream event and mixed direct-decision/event links; verify direction, canonical endpoint identities and either-kind outgoing-link resolution, including A resolved/B unresolved for A → B with no outgoing B links. Display one-to-many and many-to-one links, follow every endpoint and verify canonical identity, date/maker/text or heading/date. Verify unresolved decisions, an empty universe, standalone events with no decision links and preservation after last-link removal. Refresh/reopen after edits, linking/unlinking and calendar changes; switch universes and exercise pending-writing navigation, failed queries and missing references without mutation or fabricated empty success. Shared-event visual occurrences must never create duplicate stored events.
