# Story 3.9 proposal

Revised character-sheet-only story approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.9: Track faction affiliation history on the character sheet

As Jo,
I want to record a character's faction changes and dates,
So that I can see its current affiliation and the history leading to it on the character sheet only.

**Acceptance Criteria:**

**Given** a character and available faction profiles in the same universe,
**When** I record an accepted dated affiliation change,
**Then** the character has zero or one current faction under the agreed history/current-state contract,
**And** no operation can assign simultaneous memberships,
**And** faction references include the owning-universe identity and refer to the existing canonical faction records.

**Given** an affiliation change is committed,
**When** I inspect the character sheet,
**Then** the canonical dated record identifies the character, previous affiliation, new affiliation and fictional date,
**And** the previous/new affiliation values follow the chronological history rules from DEC-22,
**And** associated projects resolve the same authoritative character history rather than a copied project-local history.

**Given** faction entry, change or exit history exists,
**When** I view the universe timeline directly or through an associated project,
**Then** faction affiliation changes are absent from that timeline,
**And** saving an affiliation change does not create a visible timeline entry,
**And** current affiliation and its dated history remain available on the character sheet only.

**Given** a character is unaffiliated or already belongs to a faction,
**When** I record joining a faction, changing to another faction or leaving for the unaffiliated state,
**Then** the corresponding dated transition is preserved,
**And** the resulting history respects one faction at a time,
**And** the character viewer shows its current faction or no current faction according to the same contract.

**Given** a proposed affiliation change is out of chronological order or shares a date with another change,
**When** it is validated and committed,
**Then** sequencing, correction and current-state determination follow DEC-22's agreed rules,
**And** the application does not invent a time of day, silently overwrite earlier history or assume edit order equals fictional chronology,
**And** character-sheet history sequencing does not borrow timeline-event ordering or create timeline entries.

**Given** affiliation data was successfully committed,
**When** I close/reopen the universe or access it through another associated project,
**Then** the same current affiliation and complete recorded transition history are available on the character sheet,
**And** a character without affiliation remains valid,
**And** another universe's faction cannot be assigned.

**Given** affiliation history contains dated changes,
**When** the universe calendar is revised through Story 1.9,
**Then** transition elapsed positions, order and intervals remain unchanged,
**And** displayed dates are recalculated without introducing overlapping memberships or changing unrelated character data.

**Given** I cancel a change, submit an invalid reference/date or coordinated publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved affiliation and history,
**And** errors are reported without claiming a completed change,
**And** the shared publication/recovery protocol prevents a partially updated current affiliation or missing/duplicate transition,
**And** previously committed character, faction and affiliation-history records remain consistent.

**Requirements:** FR-37/38 and the accepted character-sheet-only affiliation contract; FR-48 faction viewer integration; FR-7/40/44 date-only chronology/sharing integration; CAP-6; AD-3/6/8/10/18 and derived-state/ownership conventions; NFR-1/2/3/6/7/9. FR-41 timeline-event ordering does not define affiliation-history ordering.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.8 only. Resolve DEC-22 character-history sequencing/current-state/correction rules before implementation. Use DEC-03/04 shared dates/display. Reuse TECH-01 character/faction/affiliation-history/reference contracts and TECH-02/04/05/11 publication, writer, recovery and storage guarantees. TECH-08 applies to any corrections involving removal or protected references/history. Capture assignment/history/viewer interactions under PLAN-04. DEC-14 timeline-event placement is not a dependency of character-sheet affiliation history.

**Scope boundary:** Use existing faction profiles and universe-owned character history; no project-local faction, character or history copy is created. Faction changes are shown only on the character sheet, never as universe timeline entries. Character affiliation is distinct from the optional military-unit roster and does not imply individual unit membership, multiple concurrent allegiances, combat behavior or an additional required character-development field. Faction deletion and project recovery remain separate work governed by their own integrity gates. This visibility change supersedes older FR-38 source wording; Jo approved the revised character-sheet-only Story 3.9; DEC-22 remains unresolved.

**Verification:** Record unaffiliated-to-faction, faction-to-faction and faction-to-unaffiliated changes; verify dated history/current affiliation on the character sheet after reopening and through shared projects. Confirm no faction-change entries appear in any universe timeline view while unrelated events remain unchanged. Reject foreign-universe references. Exercise same-date/out-of-order cases and current-state derivation once DEC-22 is resolved; test calendar edits, cancellation and failed/interrupted publication without overlapping membership or duplicate transitions.
