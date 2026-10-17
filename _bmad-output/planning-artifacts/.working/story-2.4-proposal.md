# Story 2.4 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.4: Automatically save current work at a configurable interval

As Jo,
I want current work to save automatically at an interval I can configure,
So that ongoing writing is persisted without relying only on manual saves.

**Acceptance Criteria:**

**Given** autosave has not been customized,
**When** the application runs with pending current-work edits,
**Then** autosave defaults to a 5-minute interval,
**And** an autosave attempt persists pending work through the same application use cases and durable-save contract as manual saving,
**And** pending manuscript text and formatting are included rather than merely saving an older editor state.

**Given** I choose an accepted autosave interval in application settings,
**When** the value is successfully saved,
**Then** the autosave scheduler uses that configured interval according to DEC-17's agreed cadence/change behavior,
**And** closing/reopening preserves that configuration,
**And** changing autosave does not change the separately configured revision or backup intervals.

**Given** an autosave attempt has been submitted and further manuscript edits occur,
**When** durable persistence of the submitted state is acknowledged,
**Then** only the acknowledged state is identified as saved,
**And** subsequent edits remain pending until their own persistence is acknowledged,
**And** scheduled and manual saves follow the shared writer protocol so an older submitted state cannot overwrite a newer committed manuscript.

**Given** an autosave attempt fails,
**When** the application receives the failure,
**Then** it reports that current work has not been successfully saved,
**And** unsaved edits remain available for retry while the last committed content stays valid,
**And** subsequent attempts follow the agreed DEC-17 failure/retry behavior without reporting failed attempts as successful saves.

**Given** the system sleeps/resumes, interval settings change, or a scheduled attempt overlaps another save,
**When** autosave scheduling resumes or another attempt becomes due,
**Then** the scheduler follows the agreed DEC-17 timing/retry policy and shared serialization contract,
**And** it cannot create conflicting writers or falsely acknowledge pending edits as persisted.

**Given** autosave has successfully persisted current work,
**When** I close/reopen the project,
**Then** the saved manuscript text, formatting and associated current-work changes covered by the shared save contract are preserved,
**And** normal-close pending-edit protection continues to work independently of waiting for the next autosave interval.

**Given** a proposed interval is invalid under the accepted settings rules,
**When** I attempt to save it,
**Then** DEC-07 validation reports the problem and preserves the previously committed interval,
**And** no unconfirmed zero-value, disable, minimum or maximum policy is inferred.

**Requirements:** FR-43; CAP-12; AD-3/13/14/18 and save/settings convention; NFR-1/2/3/6/7/9. Future FR-28/29 settings round-trip must include this exact autosave setting.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.3 only. Resolve DEC-07 interval validation and DEC-17 scheduling semantics before implementation; DEC-15 continues to govern pending-edit navigation. Use TECH-01's document/settings/transport contracts, TECH-03's pending-edit acknowledgments and TECH-02/04/05's publication/writer/lifecycle/recovery guarantees. Inherit relevant TECH-11/12 persistence/editor integration checks. Capture the interval control and save-status interactions under PLAN-04.

**Scope boundary:** Autosave saves current work; it does not create recoverable historical revisions or backup ZIPs. Those services retain independent 10-minute defaults and are delivered in Epic 5. This story provides its own usable autosave interval control and persistence; it does not depend on future general-settings or JSON import/export stories. Those later stories must reuse its settings contract rather than add a separate autosave value.

**Verification:** Use controlled time to verify the 5-minute default and an accepted changed interval without waiting in real time; verify configuration reopening and saved-document round-trip. Exercise edits during save, overlapping manual/scheduled attempts, failures with retry and normal-close pending edits. Add explicit cadence, interval-change and sleep/resume cases once DEC-17 is resolved; verify invalid settings once DEC-07 is settled. Changing autosave must leave revision/backup configuration unchanged.
