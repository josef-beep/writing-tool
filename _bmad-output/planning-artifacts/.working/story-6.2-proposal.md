# Approved by Jo — recorded in epics.md

### Story 6.2: Export local database content through a separate consistent-export workflow

As Jo,
I want to export locally stored database content separately from manuscripts, settings and backups,
So that I can obtain the database-export artifact without changing live writing or creating another live universe authority.

**Acceptance Criteria:**

**Given** a supported local database export source is available,
**When** I open database export,
**Then** the selected source/owning identity and the scope defined by the accepted TECH-13 contract are clear,
**And** I can choose a local destination for its supported export artifact,
**And** the operation is distinct from manuscript export, settings JSON and complete project/universe ZIP backup,
**And** it does not silently combine independent project/universe authorities or promise a full disaster-recovery archive.

**Given** SQLite or a similar database is used for the selected source,
**When** I locate its live storage or create a complete backup through existing backup workflows,
**Then** database files are in their own dedicated database subfolder inside the owning project/universe data folder tree, alongside the other category folders,
**And** every complete ZIP includes that database folder with a consistent recoverable copy of the database and the other required data,
**And** this backup inclusion requires no separate database-export request,
**And** the distinct export operation does not move the live database outside its owning data tree.

**Given** export is confirmed,
**When** the saved source state is captured,
**Then** it follows TECH-13’s consistent SQLite/database-export contract and TECH-01/03/04’s shared schema/capture/writer rules,
**And** pending edits and capture-boundary behavior are explicitly defined by that contract rather than silently substituting stale data,
**And** concurrent writes cannot produce an inconsistent mixture of source states,
**And** pending-writing navigation and failures follow DEC-15 without discarding edits or falsely acknowledging saves.

**Given** category objects are stored in separate live folders under DEC-33,
**When** the export artifact is assembled,
**Then** TECH-13 explicitly defines the exported database/index data, reference representation and any category files/assets required for its promised scope,
**And** it does not assume all category content is still stored in one SQLite file,
**And** if external category data or assets are outside the accepted export scope, their reference/dependency limitations are made clear rather than presented as a complete independent backup,
**And** required IDs, ownership and supported schema versions remain accurate,
**And** no unselected unit’s data is silently included merely because records share display names or folder locations.

**Given** capture, artifact generation and validation succeed,
**When** output is durably published,
**Then** a valid artifact matching the accepted TECH-13 format/scope is written and its actual location/completion is reported,
**And** it can be inspected with the appropriate reader/validator for that accepted artifact format,
**And** the workflow operates locally through application-owned infrastructure ports,
**And** exporting does not mutate source category files, current records, images, retained history, relationships, dates or live-authority registration,
**And** it does not count as a completed protected backup ZIP merely because an output file exists.

**Given** a source schema/export version is unsupported or required capture/reference data is unavailable,
**When** export is validated,
**Then** the operation reports the incompatibility or missing requirement rather than blindly rewriting the source or silently producing a misleading artifact,
**And** accepted migrations/compatibility checks occur only under the shared persistence contract,
**And** failed export leaves live source data and previously valid outputs intact.

**Given** I cancel, choose an invalid/unavailable destination, encounter a write/publication failure or the host stops,
**When** the operation ends or recovery runs,
**Then** cancellation/failure is distinguishable from a completed database export,
**And** partial artifacts are not reported as valid completed output,
**And** output filename/overwrite/collision, retry and restart handling follow the accepted TECH-13/PLAN-04 publication contract without silently damaging an existing output,
**And** live current/retained dependencies and the single authoritative universe remain unaffected.

**Requirements:** FR-49 separate local database export; CAP-11; AD-2/3/6/8/9/10/18 and category-folder contract; NFR-1/2/3/6/7/8/9. DEC-11 governs quantitative performance acceptance.

**Dependencies:** Earlier approved runtime, selected-unit identity/storage and shared consistent-capture capabilities; Story 6.1 may supply common local export UX/publication plumbing, but manuscript conversion adapters are not a prerequisite to database capture. TECH-13 must define source unit/scope selection, exact artifact format, capture/pending-edit semantics, database/index/category-file/reference/assets inclusion, validation and compatibility before implementation. The dedicated database subfolder within its owning data tree and automatic folder/database inclusion in complete ZIPs are settled; DEC-33 reconciles the remaining exact within-root category/database layout and authority responsibilities. TECH-01 versioned export/schema/error/identity contracts, TECH-03 consistent capture, TECH-04 writers and TECH-11 SQLite/native/migration strategy apply; TECH-02/05 govern affected publication/restart paths. DEC-15 protects pending writing; PLAN-04 defines source/destination selection, scope/dependency explanation, output naming/overwrite/progress/error/cancel/retry interactions. No future story is required to export the artifact once these explicit contracts are settled.

**Scope boundary:** One local database-export operation with an agreed supported artifact, separately from existing backup/manuscript/settings workflows. Approval does not select a raw SQLite copy, SQL dump, joined project/universe database, ZIP bundle or new storage provider. Database import, disaster recovery and activating an exported store as authority are not introduced. The backup ZIP owner/date/time naming requirement does not automatically prescribe this artifact’s filename. Exact dependency inclusion is a TECH-13 gate rather than an implicit promise of full recovery closure.

**Verification:** Locate the live database in its dedicated subfolder within the owning data tree and verify that a complete ZIP contains that database folder and consistent database state plus other required saved/category content without first invoking export. Confirm separately exporting leaves that live location and complete-backup obligation unchanged. Use the accepted TECH-13 source scopes and artifact format; inspect/validate exported schema, identity and representative saved data with an appropriate reader, including Unicode, typed decisions/optional makers, relationships and category references where in scope. Verify consistent capture with concurrent writes and the accepted pending-edit behavior. Exercise DEC-33 external-category/index cases and accurately explain any assets/dependencies outside scope. Confirm source records/folders/history, current edits, UUID/authority state and protected-backup accounting are unchanged. Test unsupported schemas, missing required references, canceled dialogs, invalid/unavailable destinations, overwrite/collision rules, write/publication interruption and retry/restart. Verify installed SQLite/native/export dependencies on the adopted targets before acceptance; do not merely assert file existence.
