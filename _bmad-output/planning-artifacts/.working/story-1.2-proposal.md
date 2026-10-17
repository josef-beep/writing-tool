# Story 1.2 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.2: Create and reopen a universe in a chosen folder

As Jo,
I want to create a universe in a folder I choose and reopen an existing universe,
So that my shared writing setting has a persistent home independent of an installation or project.

**Acceptance Criteria:**

**Given** WritingTool is running and I choose to create a universe,
**When** I select an available writable live folder and confirm creation,
**Then** the application creates the universe's own SQLite store and managed image-storage root using the shared storage contract,
**And** it assigns a permanent universe UUID, records its location separately and shows that universe as the active context,
**And** it creates only the metadata and storage needed by this story, without future character, calendar, project or event tables.

**Given** a universe was successfully created,
**When** I close the application, reopen it and select that universe folder,
**Then** the same universe UUID and saved metadata are loaded through application use cases,
**And** opening it does not create a new universe or copy its live database into an application or project folder.

**Given** the selected folder already contains a universe or unrelated files,
**When** I attempt creation there,
**Then** the application does not overwrite existing content or silently replace a universe,
**And** it reports the situation so I can select an appropriate location or open an existing universe.

**Given** I cancel folder selection or creation,
**When** the action ends,
**Then** the active universe remains unchanged and no new universe is activated.

**Given** a selected universe is missing, invalid, unsupported or cannot be read or written as required,
**When** I attempt to open it or creation fails,
**Then** the application reports the failure without reporting success, silently creating replacement authority or rewriting an unsupported store,
**And** partial creation cannot subsequently be mistaken for a valid completed universe under the agreed storage-publication protocol,
**And** existing writing data remains unchanged.

**Given** another session already owns the writer lease for a universe,
**When** this session attempts to acquire write access to that same universe identity,
**Then** the agreed concurrent-open contract prevents a second independent writer,
**And** the application communicates the outcome without silently forking the universe.

**Given** a new universe has no calendar or content yet,
**When** its workspace is displayed,
**Then** it identifies the active universe and accurately shows the empty state,
**And** opening it requires no project, story, dates or later-epic functionality,
**And** it invents no calendar configuration or default fictional dates.

**Requirements:** FR-44 foundation; AD-2/3/4/8/9/10/18 (AR-02/03/04/08/09/10/18); NFR-1/2/6/7/9; permanent UUID/location contract. Character/faction/event sharing under FR-44 is completed by the corresponding later stories.

**Dependencies:** Approved Story 1.1 only. TECH-01 must publish the shared identity/storage/transport contracts before their implementation; TECH-04 must settle writer ownership and concurrent-open behavior; TECH-11 must choose and verify the SQLite binding, engine and migration strategy; TECH-12 must verify affected native/background packaging before dependency adoption. The applicable TECH-02/05 publication and operation-recovery rules must cover failed/interrupted universe creation before it is accepted. These are unresolved technical prerequisites, not implicit decisions or completed work.

**Verification:** Create and reopen a universe, cancellation, existing-content protection, missing/unsupported/unwritable stores, interrupted creation and duplicate-writer attempts using the agreed protocol. Verify SQLite/native loading in the local packaged build. Full backup recovery remains Epic 5; this story introduces neither backup archives nor project associations.

**Open product decision:** DEC-12 in TODO.md tracks Jo's request to define what information a universe can store. Resolve the applicable fields before finalizing this story's universe metadata/data model; this proposal does not settle that information catalog. Jo approved the story scope; DEC-12 remains unresolved before data-model finalization.
