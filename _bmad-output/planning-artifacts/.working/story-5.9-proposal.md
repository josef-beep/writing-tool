# Approved by Jo — recorded in epics.md

### Story 5.9: Finish normal close with complete revisions and backups, including fallback recovery

As Jo,
I want normal application close to save current work, capture revisions and create complete backups even when my usual backup destination is unavailable,
So that closing the application preserves my work and tells me where fallback backups were saved.

**Acceptance Criteria:**

**Given** I request normal application close with current project/universe work open,
**When** coordinated shutdown begins,
**Then** required pending manuscript edits are durably acknowledged before closing capture,
**And** complete normal-close revisions use Story 5.1’s manifest/checkpoint/protected dependency contract,
**And** complete normal-close backups use Story 5.5’s independent project/standalone-universe ZIP contract for the units required by the accepted lifecycle scope,
**And** this capture does not rely on waiting for a scheduled autosave, revision or backup tick.

**Given** manual/scheduled captures or authoritative writes are still in progress,
**When** normal-close capture runs,
**Then** TECH-02/03/04/05’s serialized, consistent shutdown-draining contract coordinates them and any remaining pending edits,
**And** current category files/folders, required database/index state, retained revisions, images and historical references are captured consistently,
**And** no process holding required state is terminated before the close contract has completed its required work,
**And** eligibility of multiple open projects/shared universes and handling further input follow the accepted TECH-05/PLAN-04 lifecycle contract rather than an invented duplicate-job policy.

**Given** the configured close-time backup destination is available,
**When** the complete ZIP is published and validated,
**Then** it uses the configured destination and the shared relevant-name/date/time filename contract,
**And** only a valid durably completed archive is recorded as successful and counted toward protected-backup accounting,
**And** a successful normal-close outcome requires completion of the required saves, revisions and backups before close finishes.

**Given** the configured destination is unavailable at normal close,
**When** backup cannot complete there,
**Then** I am prompted to select another folder, including an available external-drive folder,
**And** selecting an available alternative completes the required backup through the same ZIP pipeline,
**And** canceling this folder selection follows the normal-close fallback below rather than merely skipping the required attempt.

**Given** I cancel alternate-folder selection during normal close,
**When** fallback capture is prepared,
**Then** the application creates a new backup folder under the application root if writable,
**And** if that location is not writable it creates the fallback under user-data,
**And** the complete required ZIP backup is saved/validated there before successful close finishes,
**And** relevant universe/volume/project names plus real date/time remain in each completed ZIP filename,
**And** actual fallback location and the need to choose a new destination are durably recorded for the next launch.

**Given** the previous normal close used a fallback location,
**When** I next launch the application,
**Then** it identifies the actual folder used and requests a new backup destination,
**And** the notification resolves persisted actual-location metadata rather than guessing from the installation path or filename,
**And** further destination selection/cancellation and persistence follow the accepted DEC-08/TECH-05/PLAN-04 lifecycle rules without silently losing fallback archive discovery or protection.

**Given** pending-save, revision, backup/fallback write or validation fails, or the host stops during shutdown,
**When** the close operation reports failure, retries or is recovered after restart,
**Then** failed work is not labeled as successful saving, revision capture or completed backup,
**And** DEC-08/TECH-05 define retry/close behavior, including failure at both fallback locations; this story does not invent a forced-close or data-discard choice,
**And** durable current/protected work, valid earlier archives and actual completion/location state remain recoverable,
**And** a partial ZIP is not counted as successful or allowed to displace protected completed archives.

**Requirements:** FR-18 normal-close complete revisions; FR-24 normal-close complete backups; FR-25 unavailable-destination selection; FR-26 canceled-folder fallback and next-launch notification; supporting FR-19/20/21/22/23 and shared category-folder/naming/capture contracts; CAP-9/10/12; AD-3/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.8 only. TECH-05 must define shutdown scope/draining, cross-session ownership, host restart and lifecycle state, incorporating DEC-08 close/fallback failure/retry and next-launch handling. TECH-01 typed lifecycle/manifest/location/error schemas, TECH-02/03 consistent capture/publication, TECH-04 writer coordination, TECH-09 protected immutable state, TECH-10 archive discovery/protection across fallback destinations and TECH-11 persistence apply. Reuse DEC-15 pending edits, DEC-33 category layout and DEC-35 archive naming, plus DEC-07 settings validation; DEC-34 scheduling does not silently decide close scope. PLAN-04 captures close progress/errors, alternate-folder prompt, fallback status and next-launch destination notification/selection. No later retention/manual-delete story is required for a successful normal close with complete captures.

**Scope boundary:** Normal-close saving/revision/backup coordination and the agreed fallback/next-launch workflow. No guarantee of running shutdown callbacks on abrupt power loss or process termination, no hypothetical force-close override and no change to manual/scheduled cancellation: outside close, canceling another-folder selection still skips only that attempt and preserves destination. Normal-close capture preserves standalone-universe independence and does not treat embedded universe snapshots as standalone backups. No archive deletion/expiry controls are introduced here.

**Verification:** Close with pending formatted writing newer than the last autosave and verify exact content in a completed revision and independently recoverable complete ZIP; cover required project/standalone-universe units under accepted lifecycle scope. Check category files/assets/retained closure, filename/actual location and coordination with in-flight writes/manual/scheduled attempts. Exercise unavailable destination, accepted alternative folder, canceled selection with writable application-root fallback and unwritable application-root with user-data fallback. Relaunch and verify actual fallback-folder notification/new destination request and protected archive discovery. Fail pending saves, revision capture, primary/fallback writes, validation and both fallback locations; verify accepted DEC-08 retry/close behavior without false success. Interrupt shutdown stages and verify durable recovery/location state and source/protected work survive. Retest outside-close cancellation to ensure it does not invoke this fallback.
