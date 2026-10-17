# Story 1.3 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.3: Create and reopen a project linked to a universe

As Jo,
I want to create a project in a chosen folder and link it to an existing universe,
So that my writing has its own storage while sharing the authoritative setting with other projects.

**Acceptance Criteria:**

**Given** an existing universe is available through Story 1.2,
**When** I select that universe, choose an available writable project folder and confirm creation,
**Then** WritingTool creates the project's own SQLite store and managed image-storage root with a permanent project UUID,
**And** the project records the owning universe UUID separately from its resolved folder location,
**And** live project/universe folders are user-selected independently of backup destinations,
**And** only the project metadata and associations required by this story are introduced; future story, volume, chapter and plot tables are not created prematurely.

**Given** a project was successfully created,
**When** I close and reopen WritingTool and select that project folder,
**Then** the saved project identity and universe association are preserved,
**And** the active workspace identifies the project and its matching authoritative universe,
**And** the application activates the project only after resolving that universe identity.

**Given** two projects refer to the same universe,
**When** either project is opened,
**Then** both resolve to the same authoritative universe UUID and store,
**And** neither creates a competing live project-local copy of universe data,
**And** selecting another project does not silently change either project's universe association.

**Given** a project's saved universe location is missing or has moved,
**When** I open the project and locate its universe folder,
**Then** WritingTool verifies the folder's universe UUID before activation,
**And** locating the same universe updates location resolution without changing project/universe identities,
**And** a folder containing a different universe does not silently reassign the project,
**And** cancellation or failure leaves that project inactive and preserves its saved association.

**Given** I cancel project creation, choose a destination containing existing content, or encounter a persistence failure,
**When** the create/open operation ends,
**Then** existing data is not overwritten and no incomplete project is reported as successfully created or activated,
**And** canceled creation leaves the previously active workspace unchanged,
**And** failures are reported according to the shared operation/error contract.

**Given** a project store is unsupported or another session owns the relevant writer lease,
**When** I attempt to open it for writing,
**Then** the shared schema/concurrent-open contract prevents unsupported rewriting or an independent second writer,
**And** the application does not silently create a replacement project or universe.

**Requirements:** FR-44 project/universe association foundation; AD-2/3/6/8/9/10/18; NFR-1/2/3/6/7/9; permanent UUID/location contract. Universe-owned character/faction/event context is added when those record types are implemented.

**Dependencies:** Approved Stories 1.1 and 1.2 only. Inherit the applicable TECH-01/02/04/05/11/12 prerequisites for identity, storage publication, operation recovery, writer coordination and native packaging. DEC-12 remains open for universe information; this story does not add universe profile fields. No project metadata fields beyond the agreed identity/association/storage needs are silently specified.

**Scope boundary:** Project creation and opening must work without future story/volume/calendar/manuscript features. Missing-universe backup recovery and full reconciliation are delivered in Epic 5; this story supplies matching-folder location and inactive-project protection and must not expose nonfunctional recovery actions.

**Verification:** Create/reopen a project; open two projects against one universe; locate a moved matching universe; reject a mismatched UUID; cancel creation/location; handle unavailable/unsupported/occupied stores and interrupted creation without overwriting or false activation. Follow the agreed writer and storage-publication protocols.
