# Story 3.3 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.3: Select and view multiple character personality labels

As Jo,
I want to choose optional personality labels for a character from the supplied catalog,
So that I can record the combination that fits the character and see it in the profile.

**Acceptance Criteria:**

**Given** I open the personality selector for a universe character,
**When** the available options are displayed,
**Then** all 100 exact labels from the adopted Personality Types List are selectable,
**And** options show the source labels only, without their accompanying descriptions,
**And** the application does not substitute another personality catalog or silently rename the supplied labels.

**Given** a character of any supported type,
**When** I choose no label, one label or multiple distinct labels and save,
**Then** that exact selection is persisted on the same universe-owned character,
**And** each label appears at most once in the selection,
**And** personality remains optional and requires no completeness waiver when unselected,
**And** extras retain the ability to have only a name.

**Given** a character has saved personality selections,
**When** I add or remove selections, including removing the last one,
**Then** the resulting selection can be saved and viewed,
**And** the character UUID, name, type, other responses and development waivers are unchanged,
**And** the application does not assign replacement labels automatically.

**Given** personality selections were successfully saved,
**When** I close/reopen the universe and inspect the character viewer,
**Then** the same exact selected labels are displayed,
**And** selecting no labels remains a valid empty selection,
**And** projects sharing this universe view the same authoritative character selection,
**And** another universe's characters are unaffected.

**Given** I change a character's type using the existing character workflow,
**When** I reopen its personality field,
**Then** the saved selections remain available,
**And** no character type makes this optional field mandatory or restricts it to a single choice.

**Given** I cancel a selection edit or its save fails,
**When** the operation ends,
**Then** cancellation preserves the previously saved selection,
**And** a failed save is reported without claiming the new set was persisted,
**And** the prior committed character remains consistent under the shared publication protocol.

**Requirements:** FR-17; FR-16 optional personality field; FR-48 viewer integration; FR-44 authoritative character sharing; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Catalog source:** [Personality Types List](../prds/prd-WritingTool-2026-10-10/sources/personality-types-list.md). Labels are the contract; source descriptions remain reference material rather than selector content.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.2 only. TECH-01 must specify the common persisted catalog-selection representation before implementation, without exposing a separate adapter-specific format. Inherit applicable TECH-02/04/05/11 writer, publication, recovery and storage guarantees. Capture multiselect/viewer interactions under PLAN-04. No catalog-editing, custom-label, search, display-order or extra scoring feature is silently adopted here.

**Scope boundary:** Extend the existing character profile and viewer. This story does not depend on image import, faction assignment, birth/background events or chapter associations. All agreed later viewer fields remain required in their respective stories. Optional personality labels do not replace guided development responses or change character-type completeness rules.

**Verification:** Compare the implemented catalog label-for-label with all 100 source entries and verify descriptions are absent from selector options. Round-trip zero/one/multiple selections; remove the last label; reopen; reclassify; view through projects sharing a universe. Verify unchanged other profile fields/waivers, canceled edits and failed writes without partial selection persistence.
