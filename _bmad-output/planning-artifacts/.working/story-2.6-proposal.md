# Story 2.6 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.6: Configure independent saving and recovery settings

As Jo,
I want to configure save intervals, backup destination and retention,
So that WritingTool preserves my preferences without coupling separate save and recovery operations.

**Acceptance Criteria:**

**Given** save/recovery settings have not been customized,
**When** I view them,
**Then** autosave defaults to 5 minutes, revision snapshots to 10 minutes and scheduled backups to 10 minutes,
**And** retention defaults to 30 real elapsed days,
**And** these values use the shared settings contract rather than separate copies owned by each screen.

**Given** I change an accepted interval or retention value,
**When** I save settings,
**Then** the selected value is persisted independently,
**And** changing autosave, revision or backup interval does not change either other interval,
**And** retention is time-only and does not introduce a storage-size threshold or fixed minimum revision count.

**Given** I select a backup destination folder, including an available external-drive folder,
**When** that preference is successfully saved,
**Then** the selected location is retained as the configured backup destination,
**And** live project/universe folders and identities are unchanged,
**And** canceling the settings folder picker preserves the previously saved destination without initiating a backup attempt.

**Given** autosave and theme were already configured through Stories 2.4 and 2.5,
**When** I view or update those preferences in the settings workspace,
**Then** it uses those same persisted settings and existing behaviors,
**And** accepted autosave changes take effect according to DEC-17,
**And** the chosen light/dark/system mode is preserved rather than replaced with its resolved appearance.

**Given** accepted settings were successfully saved,
**When** I close and reopen WritingTool,
**Then** the three intervals, retention, selected backup destination and theme mode are preserved,
**And** changing preferences does not rewrite manuscript content or universe chronology.

**Given** a proposed value is invalid or settings persistence fails,
**When** I attempt to save,
**Then** validation follows DEC-07 without inventing minimums, maximums or disable semantics,
**And** the application reports invalid input or failed persistence accurately,
**And** previously committed settings and writing content remain consistent under the shared publication protocol.

**Requirements:** CAP-12; FR-28/29 settings-content foundation, FR-43 configuration and continued FR-30 behavior; FR-18/19/24/25 configuration foundation; AD-3/9/15/18 and save/settings convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.5 only. Resolve DEC-07 settings validation before implementation; reuse DEC-17 autosave cadence and existing TECH-01 settings/transport contracts. Inherit applicable TECH-02/04/05 persistence/publication/writer/lifecycle guarantees, DEC-15 pending-editor protections and PLAN-04 settings interactions. The user-selected backup destination's default is not invented by this proposal.

**Scope boundary:** This story provides usable settings persistence and existing autosave/theme integration. Revision capture, backup scheduling, destination-failure prompts, close fallback, retention cleanup and protected-archive enforcement are delivered in Epic 5 using these configured values; changing settings here does not claim those operations have run. JSON settings export/import is the next separate capability, using this same settings representation. A 30-day retention value never overrides the ten protected valid successful ZIPs or retained/current-reference protections in the later cleanup implementation.

**Verification:** Check default and customized values; change each interval independently and reopen. Exercise folder selection/cancellation, external-drive destination persistence, unchanged live roots and reuse of autosave/theme settings. Verify invalid-value handling once DEC-07 is resolved, failed persistence and unchanged manuscript/universe content. No archive deletion or scheduled-backup completion is claimed by configuration checks.
