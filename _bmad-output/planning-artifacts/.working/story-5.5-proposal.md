# Approved by Jo — recorded in epics.md

### Story 5.5: Create independent complete project and universe ZIP backups

As Jo,
I want to create a complete backup of a project or standalone universe in a folder I choose,
So that its saved content, images and retained history are available even if the original stores are lost.

**Acceptance Criteria:**

**Given** a project and its authoritative universe are available,
**When** I request a manual project backup,
**Then** required pending manuscript edits are durably saved before a coordinated consistent capture,
**And** one independently complete ZIP contains the project’s saved database state, retained revisions and required immutable content/images,
**And** it also contains the authoritative universe recovery snapshot and complete required historical dependency closure,
**And** project/story/volume/chapter/manuscript/plot data, calendar associations, character/faction/event/decision content, added type definitions/assignments, optional makers and both decision-result relationship kinds are preserved according to their accepted ownership/reference contracts,
**And** persisted calendar-update flags and context/filter settings are included where adopted under their owning capture contract.

**Given** timelines, characters or any other saved object category exist,
**When** the application saves them in their owning project/universe unit and captures that unit for backup,
**Then** each category’s actual saved content resides in its own category folder under the accepted DEC-33 layout,
**And** timeline content is grouped in a timelines folder and character content in a characters folder, with equivalent separation for other categories,
**And** the complete ZIP includes the category folders and their saved content, required retained versions/assets and manifest/database/index state,
**And** empty placeholder folders or archive-only category labels do not satisfy the live-save requirement,
**And** the adopted representation preserves UUIDs, one authority, immutable versions, protected dependencies and content reuse without creating duplicate authoritative category copies.

**Given** a standalone authoritative universe is available without a project,
**When** I request a manual universe backup,
**Then** one complete ZIP includes its consistent saved database state, retained universe history and all required content/images/reference closure,
**And** no project, manuscript or project database is required,
**And** an embedded universe snapshot in a project ZIP does not count as a standalone-universe backup.

**Given** I choose a backup destination,
**When** I select an available folder, including an available external drive,
**Then** the archive is written there independently of the live project/universe folders,
**And** live logical identities and managed relative asset references are preserved,
**And** choosing a backup location does not move live data or create another universe authority.

**Given** the destination is unavailable before or during the manual attempt,
**When** the application cannot complete there,
**Then** I am prompted to select another folder,
**And** canceling that selection skips only the current attempt, reports it incomplete and offers retry,
**And** cancellation preserves the configured destination for future attempts,
**And** no close-time fallback is silently substituted for this manual cancellation path.

**Given** the archive is assembled,
**When** its immutable content and manifests are written and validated,
**Then** shared content is stored once within that complete ZIP and unchanged owning-store content remains reusable,
**And** each ZIP is independently complete even if that duplicates content across different ZIPs,
**And** exact retained revision content resolves without replaying older revision manifests or reading another archive,
**And** staged validation can resolve the captured database/manifests and required content with original-store and other-ZIP access unavailable,
**And** this validation does not activate recovered data or replace the live authority.

**Given** consistent capture, writing and completion validation succeed,
**When** the ZIP is durably published,
**Then** the application reports its completed status and actual location,
**And** completion/identity metadata makes it discoverable for later independent recovery and protected-backup accounting,
**And** only valid successfully completed archives count toward the per-project or standalone-universe protected set,
**And** the ten newest such archives per owning unit, or all if fewer, remain protected under the shared contract; this story introduces no archive deletion/expiry controls.

**Given** saving pending edits, capture, asset/reference inclusion, writing or validation fails, or the host stops during publication,
**When** the attempt is reported or reconciled after restart,
**Then** a partial archive is not presented as a valid completed backup or counted toward the protected set,
**And** previously completed backups and live/current/retained dependencies remain intact,
**And** the application reports the real save/capture/backup outcome without claiming success and offers retry under the accepted error contract,
**And** retry/publication uses the shared operation identity/recovery rules without corrupting an existing completed ZIP.

**Requirements:** FR-23 independent complete project/standalone-universe backups; FR-24 manual trigger; FR-25 destinations/outside-close cancellation; FR-21 within-ZIP reuse; FR-19 valid-completion accounting/ten protected archive contract; supporting FR-18/20/22 and adopted capture/authority/typed-content contracts; CAP-10; AD-3/4/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.4 only. Resolve DEC-33 category-folder layout/content formats and database/index authority responsibilities before affected implementation; the later live-category-folder contract takes precedence over prior database-only assumptions. TECH-01 versioned archive/database/category-file/manifest/reference schemas, TECH-02/03 crash-safe coordinated publication/consistent capture, TECH-04 writers, TECH-05 restart recovery, TECH-09 immutable object/history closure, TECH-10 archive discovery/protection identity and TECH-11 consistent SQLite snapshot handling must be settled before affected implementation. Reuse existing backup-destination settings and DEC-07 validation; PLAN-04 defines backup entry point, destination dialog, progress/outcome, unavailable-folder prompt and retry UI. DEC-11 performance and installed/native acceptance remain open. No later restore/cleanup/scheduled-backup story is needed to create and validate a complete manual ZIP.

**Scope boundary:** Apply the accepted shared live category-folder layout and package its actual content in manual independently complete project and standalone-universe archive creation with completion validation and protected-set metadata. User-facing recovery/import/activation, whole-project reconciliation, scheduled triggers, normal-close/fallback capture and retention/manual deletion follow separately and must reuse this pipeline. Backup is not manuscript/settings/database export. Historical embedded universe snapshots never become live authorities merely because a ZIP is created or inspected. Exact post-failure temporary-file cleanup is governed by publication/recovery contracts rather than invented here.

**Verification:** Save timelines, characters and other supported object categories and inspect actual live category folders; create the ZIP and verify their category paths/content and manifest resolution from that ZIP alone. Cover populated categories, added supported categories and identical display names across owning units without identity collisions, lost history or duplicate authoritative copies. Merely creating empty category directories must fail acceptance. Create project and standalone-universe ZIPs, including a universe with no project and a project sharing its universe with another project. Validate consistent captured database/reference closure with pending formatted writing, retained revisions, historical changed images, plots, custom decision types/optional makers/both relationship kinds and calendar-format associations/flags. Resolve exact revision content from one staged ZIP with original-store/other-archive access unavailable, without a user-facing restore dependency. Verify within-ZIP deduplication, independent later ZIP completeness, destination independence, external-drive paths and actual completion location. Exercise unavailable/disappearing destinations, alternate-folder cancellation, save/capture/write/validation failure and interrupted publication/restart/retry; previous valid backups survive and partial attempts never count toward protection. Later recovery/scheduling/close/retention stories must add end-to-end integration checks using this same archive contract.
