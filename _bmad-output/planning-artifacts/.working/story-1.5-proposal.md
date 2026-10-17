# Story 1.5 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.5: Organize stories into optional, manually ordered volumes

As Jo,
I want to group stories into optional volumes and arrange those groups and their stories,
So that the project structure follows my writing while still supporting ungrouped stories.

**Acceptance Criteria:**

**Given** an active project,
**When** I create a named volume or rename an existing volume,
**Then** it is saved as a project-owned group with a permanent UUID,
**And** renaming preserves its identity, project ownership and story memberships,
**And** an empty volume is usable without requiring a story or a nested-volume structure.

**Given** a story belongs to the active project,
**When** I assign it to a volume in that project,
**Then** it belongs to exactly that one volume,
**And** its story UUID and owning project/universe association remain unchanged,
**And** grouping does not duplicate the story or change ownership of its content.

**Given** a story is already in a volume,
**When** I move it to another volume or return it to the ungrouped list,
**Then** its previous membership is replaced by the chosen membership or no membership,
**And** the story remains available exactly once in its resulting group,
**And** no other story's membership is changed.

**Given** the project has volumes and grouped or ungrouped stories,
**When** I manually arrange volumes or the stories within a group,
**Then** the workspace reflects the chosen volume and story orders,
**And** ungrouped stories retain manual ordering,
**And** existing story order is preserved when optional volume support is introduced,
**And** ordering changes do not alter story ownership or its chapter/plot chronology rules.

**Given** volume names, memberships and manual orders were saved,
**When** I close and reopen the project,
**Then** all of those values and identities are preserved,
**And** projects without any volumes and stories without membership remain usable,
**And** no fixed volume count or stories-per-volume limit is imposed.

**Given** a proposed destination volume belongs to another project,
**When** an assignment is attempted through any application entry point,
**Then** the operation is rejected without changing membership or project/universe ownership.

**Given** a membership or ordering operation fails,
**When** the application reports the result,
**Then** the last committed grouping/order remains consistent under the agreed publication protocol,
**And** the story is not duplicated, lost or assigned to two volumes,
**And** the application does not report an unsaved change as successfully persisted.

**Requirements:** CAP-1; AD-6/8/10; shared volume-grouping and permanent-identity contracts; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.4 only. Inherit the applicable shared TECH-01/02/04/05/11 contracts and writer/storage-failure gates. Capture grouping and ordering interactions under PLAN-04 before implementation. Default insertion positions and exact name validation are not silently adopted here; manual order must be explicitly controllable.

**Scope boundary:** Volumes group stories only within their existing project. This story adds no nested volumes, simultaneous multi-volume membership, cross-project story transfer, deletion semantics or fixed writing limits. Chapter editing and plot sequencing remain later-epic capabilities and are not dependencies of this grouping workflow.

**Verification:** Create/rename volumes; assign, move and ungroup stories; order volumes and grouped/ungrouped stories; reopen; reject foreign-project destinations; verify prior ungrouped ordering survives introduction of volumes. Exercise failed membership/order publication without duplicate membership or loss.
