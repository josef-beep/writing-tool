# Approved by Jo — recorded in epics.md

### Story 5.8: Create complete backups on an independent configurable schedule

As Jo,
I want complete project and standalone-universe backups to run at a configurable interval,
So that recovery archives stay current without requiring a manual backup each time.

**Acceptance Criteria:**

**Given** scheduled-backup settings have not been customized,
**When** the application schedules eligible project/standalone-universe backup units under the accepted DEC-34 contract,
**Then** the backup interval defaults to 10 minutes,
**And** this is independent of 5-minute autosave and 10-minute revision capture,
**And** a project ZIP’s embedded universe snapshot does not count as a separately scheduled standalone-universe backup.

**Given** I save a valid changed backup interval in existing settings or import accepted exported settings,
**When** the change is durably acknowledged,
**Then** scheduling uses that interval under DEC-34’s accepted cadence/change rules,
**And** its value survives reopen and settings export/import,
**And** configuring backup timing does not change autosave/revision intervals or the independent live-storage locations,
**And** invalid input follows DEC-07 rather than silently adopting an unaccepted value.

**Given** a scheduled attempt becomes due,
**When** backup capture executes,
**Then** it uses Story 5.5’s complete independent ZIP pipeline rather than a reduced scheduled format,
**And** required pending manuscript edits are durably saved before consistent capture,
**And** the ZIP includes actual category folders/content, required database/index state, retained history, images and complete current/historical reference closure,
**And** UUIDs, one authority and exact retained immutable content remain valid,
**And** overlapping scheduled/manual/revision work uses the accepted writer/capture coordination contract rather than inconsistent simultaneous publication.

**Given** the configured destination is unavailable when a scheduled backup is attempted,
**When** that attempt cannot complete there,
**Then** I am prompted to select an alternative folder,
**And** canceling selection skips only that attempt, shows it incomplete with a retry option and preserves the configured destination for later attempts,
**And** it does not silently disable later scheduling or invoke normal-close fallback,
**And** handling additional due attempts while a prompt/retry is pending follows DEC-34 without assuming an unagreed backlog or repeated-dialog policy.

**Given** a scheduled ZIP is successfully published,
**When** I inspect its saved filename,
**Then** it contains the relevant universe/volume/project names plus a real-world date and time stamp clearly identifying its contents,
**And** it uses the same naming contract as manual, close-time/fallback and post-reconciliation ZIPs,
**And** the accepted DEC-35 template handles portable names, timezone/precision and collisions without overwriting completed archives,
**And** the manifest retains original display names, UUIDs and capture/completion metadata rather than treating the filename as identity.

**Given** scheduled backup capture and validation succeed,
**When** the complete ZIP is durably published,
**Then** the application records/reports its actual completion and location using the same outcome contract as manual backups,
**And** only valid successfully completed ZIPs count toward the protected per-project/standalone-universe set,
**And** failed, canceled and partial attempts do not displace protected completed archives or damage earlier backups.

**Given** the system sleeps/resumes, the interval changes, an attempt fails or the host restarts,
**When** scheduled execution continues,
**Then** eligible unit selection, start/reset, missed-attempt, overlap and retry behavior follow DEC-34 and the durable operation/restart contracts,
**And** failure does not falsely mark pending work saved or a ZIP complete,
**And** existing current/retained dependencies and completed archives remain protected,
**And** distinct save/revision/backup outcomes remain truthful and visible.

**Requirements:** FR-24 scheduled complete backups; FR-25 destination/alternative cancellation; supporting FR-19/21/23/28/29/43 and independent interval/category-folder/capture contracts; CAP-10/12; AD-3/5/6/8/9/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.7 only. Reuse Story 5.5 ZIP creation/validation, settings import/export and common capture/publication/error contracts. DEC-34 must define scheduled-unit eligibility, cadence/start/reset, interval change, sleep/resume, overlap, pending destination prompts and retry/backlog behavior before affected implementation. DEC-35 supplies the shared ZIP filename/template/timezone/collision/volume representation rules. DEC-07 validates settings; DEC-15 protects pending writing. TECH-01 shared contracts, TECH-02/03 consistent capture/publication, TECH-04 writers, TECH-05 host recovery, TECH-09 protected manifests, TECH-10 archive discovery/accounting and TECH-11 persistence apply; DEC-33 category layout remains binding. PLAN-04 captures schedule configuration, status/progress, destination prompt, skipped-attempt/retry and error visibility. Autosave DEC-17 and revision DEC-31 do not automatically determine backup cadence. No later close/fallback or cleanup story is needed for this schedule.

**Scope boundary:** The scheduled trigger/settings integration for existing complete project and standalone-universe backups. No cloud service, operating-system backup daemon while the application is closed, new archive format, new disable/default policy, close-time fallback or archive deletion. Eligible units and interval ownership are governed by DEC-34 rather than assuming all known projects or every embedded universe receive a separate job. Later normal-close capture and retention reuse this same pipeline/outcome metadata.

**Verification:** Check completed scheduled filenames contain the correct owner names and real date/time; exercise names needing filename-safe representation, matching timestamps and projects with the accepted volume configurations under DEC-35. Ensure naming matches the manual pipeline and preserves manifest identity/protection metadata. Run default and changed valid backup schedules and settings export/import/reopen while confirming autosave/revision independence. Validate a scheduled project ZIP and a scheduled standalone-universe ZIP under accepted unit eligibility, including actual category folders/content, pending writing, retained images/history and references; recover from a scheduled ZIP with Story 5.7. Exercise shared universes without miscounting embedded snapshots as standalone backups. Verify unavailable/disappearing destinations, alternative-folder cancellation, retry and the preserved configured destination/later scheduling. Exercise accepted sleep/resume, missed ticks, interval changes, long captures, overlapping manual/revision work and host interruption/restart. Fail save/capture/write/validation and confirm no false completion, lost dependencies or protected-set displacement. Later normal-close/cleanup stories add their own integration checks.
