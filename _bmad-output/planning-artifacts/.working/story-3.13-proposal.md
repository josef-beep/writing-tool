# Story 3.13 proposal

Replacement story approved by Jo and appended to Epic 3 in epics.md. The earlier chapter-driven main-event shifting proposal is superseded and was not approved. No implementation has started; epics.md is the maintained approved breakdown.

### Story 3.13: Open the event editor from a chapter without chapter-driven event changes

As Jo,
I want an Edit event link beside a chapter's linked events,
So that I can explicitly edit the event itself while chapter changes leave its recorded history unchanged.

**Acceptance Criteria:**

**Given** a chapter has linked main events or flashbacks,
**When** I view the chapter,
**Then** linked event dates/content are displayed without inline event-editing fields,
**And** each linked event provides an Edit event link to its dedicated editor,
**And** opening that link resolves the same canonical event UUID and owning-universe identity rather than a chapter-local copy.

**Given** I open an event through the chapter's Edit event link,
**When** I explicitly save accepted event changes in the dedicated editor,
**Then** that event's canonical date/content is updated through the existing event application use cases,
**And** returning to the chapter reflects those committed changes through the same event reference,
**And** other views/projects sharing the event reflect the same authoritative record,
**And** the event edit does not automatically change chapter dates, manuscript content or depiction links.

**Given** a chapter has linked events,
**When** I assign, move or clear its start/end dates, save its manuscript or change chapter metadata,
**Then** every linked main event and flashback keeps its recorded date/content,
**And** chapter start/end remain independent and use only explicitly entered values,
**And** no elapsed-day event shifting, linked-update toggle or event movement selection is offered.

**Given** pending chapter manuscript edits exist,
**When** I follow an Edit event link and later return to the chapter,
**Then** the existing DEC-15 editor-navigation contract protects those edits,
**And** opening the link does not silently discard pending writing or mutate the event,
**And** event saves cannot falsely acknowledge unsaved chapter edits as persisted.

**Given** I cancel an event edit or its persistence fails,
**When** I return to the chapter,
**Then** cancellation leaves the saved event unchanged,
**And** failure is reported without claiming the event changes were saved,
**And** committed event/chapter records remain consistent under the shared publication/recovery contract,
**And** unsaved state is handled according to the accepted editor-navigation/retry rules.

**Given** a link points to an unavailable event or a different universe,
**When** it is resolved,
**Then** the application reports the missing/invalid reference rather than editing another record or silently creating a replacement,
**And** the chapter and valid event records remain unchanged.

**Given** a saved chapter links to existing events,
**When** I close/reopen the project and follow an Edit event link,
**Then** it still opens the same valid authoritative event,
**And** character-sheet faction affiliation history is not exposed as a timeline event choice.

**Requirements:** FR-5 independent event editing and required chapter-view Edit event link; FR-6 flashback independence; continued FR-42/44/46; CAP-3; AD-3/6/8/10/18 and the superseding chapter/event-isolation contracts; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.12 only. Reuse the dedicated canonical event editor and Story 3.11 depiction references. Capture link placement/navigation/return interactions under PLAN-04; DEC-15 must cover opening the event editor with pending manuscript edits. TECH-01 defines the common event-editor command/reference contract; inherit TECH-02/04/05/11 publication, writer, restart-recovery and persistence guarantees. DEC-24 governs valid links/roles; DEC-02's chapter-event selection controls are superseded, not an unresolved implementation prerequisite.

**Scope boundary:** Chapter operations do not edit linked events. Chapter-only restoration in Epic 5 must preserve all linked event dates/content; separate event-item and whole-project/universe recovery remain supported under their own protective contracts. Creating an event from chapter context opens the event editor as in Story 3.11; it does not introduce inline chapter event editing. Chapter association link/unlink actions remain distinct from editing/deleting the canonical event. Main/flashback depiction roles, calendar elapsed-position preservation and character-sheet-only faction history remain binding.

**Verification:** From a chapter, open and explicitly edit a main event and a flashback; verify the same canonical UUID and unchanged chapter data. Move start day 10 to day 20 with end day 30: end stays 30, a linked main event at day 12 stays 12, and a flashback at day 2 stays 2. Repeat first assignment, clearing, end-only, explicit-both-date and manuscript/title saves with all event content unchanged. Verify no inline event fields or linked-shift controls, pending-edit navigation, event cancellation/failure, missing/foreign-universe references and reopening. Epic 5 must add chapter-only restoration isolation checks without removing separate event/project recovery.
