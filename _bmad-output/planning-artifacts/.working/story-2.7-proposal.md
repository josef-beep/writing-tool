# Story 2.7 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.7: Export and import application settings as JSON

As Jo,
I want to export my settings to a JSON file and import them again,
So that I can preserve and restore my application preferences.

**Acceptance Criteria:**

**Given** application settings are available,
**When** I export them to a selected file location,
**Then** WritingTool writes a valid .json file whose top-level value is a JSON object,
**And** it includes the configured autosave interval, revision interval, backup schedule/interval, backup destination, retention and light/dark/system theme selection,
**And** the exported values come from the same persisted settings contract used by the application controls.

**Given** I export customized accepted settings and then change the application preferences,
**When** I import the exported file,
**Then** every exported setting is restored to its exported value,
**And** closing/reopening preserves the restored settings,
**And** the three save/revision/backup intervals remain independently configured.

**Given** a settings file contains an accepted theme selection,
**When** I import it,
**Then** the application applies that selection through Story 2.5's theme behavior,
**And** an imported system mode remains system and follows current/later OS appearance changes rather than being replaced with the exporting machine's resolved light/dark appearance.

**Given** an accepted import changes the autosave interval,
**When** it is committed,
**Then** the existing scheduler uses the imported value under DEC-17's agreed timing policy,
**And** no duplicate autosave setting or scheduler is introduced,
**And** pending manuscript edits remain protected by the existing durable-save/editor-state contracts.

**Given** a valid exported file includes a backup destination,
**When** it is imported,
**Then** the configured destination value is restored without relocating live project/universe folders,
**And** importing settings does not itself create a backup, perform cleanup or claim a destination is currently available,
**And** backup-attempt destination failures follow the required Epic 5 workflow when those operations are implemented.

**Given** I cancel file selection, select malformed JSON or a non-object value, submit invalid settings under DEC-07, or encounter a read/persistence failure,
**When** the operation ends,
**Then** cancellation leaves settings unchanged,
**And** errors are reported without claiming successful import,
**And** previously committed settings and writing content are preserved without a partially applied import,
**And** missing/unrecognized fields or incompatible representations follow DEC-07's agreed compatibility rules rather than an invented silent defaulting policy.

**Given** a settings export cannot be written completely,
**When** the file operation reports its result,
**Then** the application does not report successful export,
**And** the source settings and manuscript/universe data remain unchanged,
**And** file publication follows the shared safe-write contract.

**Requirements:** FR-28/29; full FR-30 and FR-43 settings round-trip integration; CAP-12; AD-3/15/18 and settings convention; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.6 only. Publish the shared settings JSON serialization/validation contract under TECH-01; settle missing/unrecognized field and compatibility behavior under DEC-07 before implementation. Use existing TECH-02/04/05 settings publication/writer/lifecycle guarantees, DEC-17 scheduler behavior and DEC-15 pending-editor protections. Capture file-selection, result and error interactions under PLAN-04. This proposal does not require a new version field or pick field names/units independently of the shared schema.

**Scope boundary:** The artifact contains application settings, not manuscript content, database exports or recovery ZIPs. Existing local revision/backup preferences can be round-tripped before Epic 5 services exist; the later services must consume those same settings. No settings import can bypass protected-archive/dependency rules or trigger an unrequested data relocation.

**Verification:** Export default and customized settings, parse the top-level object, change each setting, import and compare every exported value after reopening. Cover all three theme modes and independent interval values; verify autosave adopts an accepted imported interval. Exercise file-picker cancellation, malformed JSON, arrays/scalars, invalid values and read/write/commit failures with no partial settings application. Add missing/unrecognized/compatibility cases once DEC-07 is resolved. Confirm manuscript/universe data and live roots are unchanged.
