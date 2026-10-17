# Epic 2: Write and save manuscripts in the workspace

Jo can write formatted chapters within organized stories, set independent optional start/end dates, save/reopen work with autosave, choose appearance and import/export application settings.

Primary requirements: FR-1/28/29/30/42/43. Applicable quality/architecture requirements include manuscript round-trip persistence, the WritingTool-owned versioned document contract, the Lexical presentation adapter, independent save schedules and secure background application writes. Required manuscript/settings layouts remain tracked under PLAN-04; no dedicated UX contract exists yet.

## Review status

Story 2.1 was approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.1: Create and organize undated chapters within a story

As Jo,
I want to create named chapters and select them within a story before assigning dates,
So that I can outline the manuscript as the structure becomes clear.

**Acceptance Criteria:**

**Given** an active project and an existing story,
**When** I create a chapter with a title,
**Then** it is saved as a chapter owned by that story with a permanent UUID,
**And** neither a start date nor an end date is required or invented,
**And** creation requires no manuscript text, character/event association, plot entry or word target,
**And** only the chapter storage required for this capability is introduced.

**Given** the story contains chapters without start dates,
**When** I view the chapter list,
**Then** those chapters appear in creation order,
**And** I can select a chapter and identify its owning story/project,
**And** the list introduces neither arbitrary fictional dates nor a manual order that contradicts FR-42.

**Given** a chapter exists,
**When** I change its title,
**Then** its UUID, story ownership and creation-order position are preserved,
**And** its dates remain absent unless explicitly assigned through the later date-editing capability.

**Given** chapter titles and identities were saved,
**When** I close and reopen the project and story,
**Then** the same chapters, titles and creation order are restored,
**And** an empty story remains usable and can accept its first chapter,
**And** the application imposes no fixed chapter count or word limit.

**Given** a story has chapters,
**When** I rename that story or move it between volumes and ungrouped using the existing organization workflow,
**Then** the chapters remain attached to the same story UUID,
**And** neither grouping nor renaming duplicates chapters or changes their owning project/universe association.

**Given** chapter creation or title persistence fails,
**When** the operation reports its result,
**Then** it does not claim the change was saved,
**And** the previously committed chapter list, identities, titles and ownership remain consistent under the shared publication protocol,
**And** no chapter is silently written to a different story or project.

**Requirements:** FR-42 undated creation/ordering foundation; CAP-2 and AD-3/6/8/10/13/18; NFR-1/2/3/6/7/9. Full dated ordering and independent date editing follow within Epic 2.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 only. Inherit applicable TECH-01/02/04/05/11 contracts for chapter identity, storage publication, operation recovery and writer coordination. Any initialized empty manuscript must follow TECH-01's versioned WritingTool document contract rather than a new local format; the editing adapter is not a prerequisite for outlining. Capture chapter-list interactions under PLAN-04.

**Scope boundary:** This story delivers usable chapter outlining/selection and title persistence. Formatted text editing, manual manuscript save, dates, autosave, themes and settings round-trip will be subsequent Epic 2 stories. Later dates must extend this chapter identity/ownership model and retain FR-42's missing-start creation order. Chapter deletion, manual chapter reordering and cross-story transfer are not introduced here. Title-input validation remains a detail to settle before implementing that input; no additional chapter-profile fields are adopted.

**Verification:** Create multiple chapters without dates or text, select/rename them and reopen. Check creation-order stability, empty-story behavior, story rename/volume regrouping with existing chapters and failed-write integrity, including wrong-owner requests. No timing budget or enforced writing cap is invented.
