# Story 3.8 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.8: Record optional military unit types in faction profiles

As Jo,
I want an optional repeating military roster within a faction profile,
So that I can record the faction's unit types and their descriptive values when useful to my setting.

**Acceptance Criteria:**

**Given** a faction profile exists,
**When** I add unit-type entries to its military roster,
**Then** it supports multiple entries containing unit name, role, description, base strength, movement points and base modifier points,
**And** each entry is associated with the same faction and owning universe under the shared identity contract,
**And** no example name, prose or numeric value is inserted as an assumed default.

**Given** a faction has no military roster,
**When** I save or inspect its profile,
**Then** the faction remains saveable,
**And** completeness still depends only on the non-roster fields from Story 3.7,
**And** no unit entry is required to mark a fully filled non-roster profile complete.

**Given** existing roster entries are available,
**When** I edit an entry or remove it from the current roster,
**Then** the saved roster reflects that change without altering other entries or faction fields,
**And** the faction UUID and owning universe remain unchanged,
**And** removal respects the shared retained-reference/history contract rather than deleting protected historical content.

**Given** unit values are entered or an entry is partially filled,
**When** the application validates it,
**Then** missing-field and numeric validation follow DEC-21's agreed rules,
**And** the application does not infer numeric limits, zero defaults or mandatory row completeness from the supplied example,
**And** roster content does not redefine faction-profile completeness.

**Given** the roster was successfully saved,
**When** I close/reopen the universe or view the faction through another associated project,
**Then** every saved entry and field value is preserved on the same authoritative faction,
**And** no project-local roster copy is created,
**And** another universe's factions/rosters remain unaffected.

**Given** I cancel roster edits or persistence fails,
**When** the operation ends,
**Then** cancellation preserves the saved roster,
**And** failure is reported without claiming success,
**And** the shared publication/recovery protocol preserves the previously committed entries and faction profile without partial row updates.

**Requirements:** FR-36 optional repeating military roster; FR-44 faction sharing; CAP-6; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.7 only. Resolve DEC-21 entry validation before implementation. Reuse TECH-01's faction/unit/reference schemas and applicable TECH-02/04/05/11 publication, writer, recovery and storage guarantees. Resolve TECH-08's reference/history preservation before implementing removal; deleting a current entry must not undermine retained revisions. Capture roster entry/edit/removal interactions under PLAN-04.

**Scope boundary:** These are optional recorded unit-type fields, not combat simulation, movement calculation, troop counting, individual military-character membership or new mandatory faction fields. No custom roster ordering, cross-faction unit sharing or extra statistics are introduced. The existing faction profile remains usable without this feature, and character affiliation/history remains a subsequent story.

**Verification:** Save zero, one and multiple entries; round-trip every field through reopening and shared-project views. Edit/remove an entry and confirm other entries, profile fields, ownership and completeness are unchanged and protected references survive. Add missing/partial/numeric-value cases after DEC-21 is resolved. Verify cancellation, failed publication and rejected foreign-faction/universe writes without importing example defaults.
