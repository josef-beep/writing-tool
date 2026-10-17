# Story 1.4 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.4: Create, name and manually order stories in a project

As Jo,
I want to create named stories within a project and arrange their order,
So that I can organize my writing without having to group stories into volumes.

**Acceptance Criteria:**

**Given** an active project with its matching universe available,
**When** I create a story and supply its title,
**Then** the story is saved in that project with a permanent UUID and appears in the project's story list,
**And** it can exist without a volume, chapter, plot entry or fictional date,
**And** the application creates only the story storage required for this capability.

**Given** the project contains named stories,
**When** I select a story or change its title,
**Then** the workspace identifies the selected story and its owning project,
**And** renaming preserves its UUID, project ownership and manually assigned order,
**And** neither selection nor renaming changes the project's universe association.

**Given** multiple ungrouped stories exist in the project,
**When** I manually reorder them,
**Then** the list reflects my chosen order and retains every story's identity and ownership,
**And** title or creation time does not override the saved manual order,
**And** this ordering is independent of the later chronological chapter and plot rules.

**Given** story titles and order were successfully saved,
**When** I close and reopen the project,
**Then** the same stories, titles, identities and manual order are restored from the project's store,
**And** selecting a story requires no later manuscript or volume-management feature.

**Given** an active project has no stories,
**When** I view its story list,
**Then** the application shows the empty state and allows creation without requiring a volume,
**And** it imposes no fixed story count, chapter count or word limit.

**Given** saving a new story, title change or order change fails,
**When** the operation reports its result,
**Then** it does not claim an unsaved change was persisted,
**And** previously committed stories, identity and ordering remain intact under the agreed operation/publication protocol,
**And** no changes are applied to a different project or its universe records.

**Requirements:** CAP-1; AD-6/8/10; shared identity and volume-grouping contracts; FR-44 ownership foundation; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.3 only. Inherit shared TECH-01/02/04/05/11 storage, identity, writer and failure-handling gates where applicable. Required story-list interactions must be captured under PLAN-04. Exact title validation or additional story-profile fields are not silently settled by this proposal.

**Scope boundary:** This story delivers usable ungrouped story organization. Optional volumes and moving stories between groups follow in a later story; current ungrouped stories must remain usable when that feature is introduced. Manuscript editing and chapter ordering arrive in Epic 2; plots arrive in Epic 4. Story deletion and cross-project movement are not introduced here.

**Verification:** Create multiple ungrouped stories, select/rename them, manually reorder and reopen; verify stable UUIDs/project ownership, empty-project behavior and failed-save integrity. Check the absence of fixed count/word caps without inventing a performance budget.
