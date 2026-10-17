# Story 2.2 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.2: Write, format and save chapter manuscripts

As Jo,
I want to write and format chapter text and save it within the application,
So that my manuscript and its presentation survive reopening.

**Acceptance Criteria:**

**Given** a chapter exists in the active story,
**When** I select it and write or edit its manuscript,
**Then** the React/Lexical editor supports bold, italics, paragraph indentation, headings and scene breaks,
**And** a new chapter can begin with an empty manuscript,
**And** editing requires no fictional dates, character associations or word target.

**Given** I have edited a chapter manuscript,
**When** I explicitly save it,
**Then** the Lexical adapter maps the editor state into the shared, explicitly versioned WritingTool-owned structured JSON document,
**And** application use cases persist it in the owning project's store through the background host,
**And** domain/application contracts do not depend on Lexical runtime objects,
**And** no direct renderer SQL or arbitrary filesystem access is introduced.

**Given** a save request is in progress,
**When** the background host acknowledges durable persistence,
**Then** the application identifies the acknowledged manuscript state as saved,
**And** edits made after the submitted state are not falsely reported as persisted by that acknowledgment.

**Given** a chapter with mixed text and all five required formatting features was saved,
**When** I close and reopen the project and select that chapter,
**Then** its text, bold, italics, paragraph indents, headings and scene breaks are preserved,
**And** its UUID, owning story, title and dates are unchanged,
**And** other chapters' manuscripts remain unchanged.

**Given** manuscript persistence fails,
**When** the failure is reported,
**Then** the application does not claim the unsaved manuscript is saved,
**And** the last committed document remains valid under the shared publication protocol,
**And** current unsaved edits remain available for retry under the agreed editor-state contract.

**Given** a saved document has an unsupported future schema version or cannot be validated,
**When** it is opened through the editor adapter,
**Then** the application reports that it cannot safely load it for editing,
**And** it does not silently rewrite, downgrade or overwrite the saved content.

**Given** unsaved manuscript edits exist,
**When** I switch chapters/projects, navigate away or normally close the application,
**Then** navigation follows the separately agreed DEC-15 behavior without silently discarding those edits,
**And** normal close synchronizes pending manuscript edits and obtains durable acknowledgment according to TECH-03/05 before reporting completion,
**And** the implementation does not assume future autosave or revision history will protect unpersisted edits.

**Requirements:** FR-1; CAP-2; AD-3/10/11/12/13/14/18; NFR-1/2/3/6/7/9. This story delivers manual manuscript persistence; FR-43 autosave follows within Epic 2.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Story 2.1 only. TECH-01 must define the manuscript schema, adapter mapping, validation and version-handling contract before document persistence. TECH-03/05 must settle pending-edit acknowledgments, navigation/close coordination and failures; TECH-12 must verify Lexical integration and round-trip behavior before candidate pins are adopted. Inherit applicable TECH-02/04/11 storage-publication, writer and SQLite contracts. Resolve DEC-15 and capture editor interactions under PLAN-04 before their implementation. Scope approval does not pick unsaved-navigation behavior.

**Scope boundary:** No autosave scheduler, revision history, restore, manuscript export, additional formatting feature or enforced writing limit is introduced here. Later autosave/revision/backup/export stories consume the same document and durable-save contracts rather than inventing a second persisted representation. An editor's undo stack does not substitute for Epic 5 revisions.

**Verification:** Round-trip representative documents with each formatting feature and mixed combinations through Lexical, canonical JSON and SQLite reopening; verify empty and multiple chapters and wrong-owner save rejection. Exercise failed saves with retry, edits during an outstanding save, unsupported schema protection and the agreed navigation/normal-close paths. Verify the adapter in the packaged application; performance budgets remain DEC-11.
