# Story 3.10 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.10: Associate chapter characters and display writing targets

As Jo,
I want to associate characters with chapters and see my chapter-count and word targets while writing,
So that the relevant cast and planning goals stay accessible beside the manuscript.

**Acceptance Criteria:**

**Given** an active chapter and characters in its project's authoritative universe,
**When** I select characters to associate with that chapter,
**Then** the chapter stores references to their existing universe/character identities,
**And** multiple characters can be associated without creating project-local character copies,
**And** saving the chapter requires no character association.

**Given** a chapter has associated characters,
**When** I plan or write that chapter,
**Then** its associated characters are visible and accessible through the existing character-sheet workflow,
**And** a saved character rename is reflected through the same canonical reference,
**And** switching chapters shows each chapter's own saved associations,
**And** faction-change history remains on the character sheet only and is not added to the universe timeline.

**Given** an association exists,
**When** I remove it from the chapter,
**Then** the current chapter association changes without deleting the character or its universe history,
**And** references needed by retained content remain protected under the shared integrity contract,
**And** another chapter's associations are unchanged.

**Given** I enter accepted chapter-count and per-chapter word targets,
**When** I save and view the relevant planning/writing workspace,
**Then** those informational targets are visible at the scope agreed under DEC-23,
**And** per-chapter word targets are associated with their intended chapter identities,
**And** target values do not change manuscript content, chapter identity or chronology.

**Given** a target has been reached or exceeded,
**When** I create another chapter, continue writing or save work,
**Then** the target never blocks that action or truncates content,
**And** an unset target remains valid under the agreed DEC-23 rules,
**And** no fixed chapter or word-count cap is introduced.

**Given** character associations and targets were successfully saved,
**When** I close and reopen the project,
**Then** the same character references and target values are restored,
**And** renaming a story or moving it between volumes preserves its chapters' associations and targets,
**And** characters from another universe cannot be associated.

**Given** I cancel edits, submit invalid target input or association/target publication fails,
**When** the operation ends,
**Then** cancellation preserves the prior saved values,
**And** target validation follows DEC-23 without imposing an unconfirmed zero/minimum/maximum policy,
**And** failure is reported without claiming persistence,
**And** the prior committed references, targets and manuscript remain consistent under the shared publication/editor-state contracts.

**Requirements:** FR-47; FR-44 shared-character reference integration and FR-48 character-sheet access; CAP-2; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.9 only. Resolve DEC-23 target scope/validation before implementation. Use TECH-01's chapter/character/reference/target schema, TECH-02/04/05/11 publication, writer, recovery and storage guarantees, and TECH-08's retained-reference preservation before association removal. Preserve DEC-15 pending manuscript edits. Capture association/target/editor interactions under PLAN-04 without imposing a layout or extra metric.

**Scope boundary:** This story adds character references and informational target values, not character duplication, automatic association of the character's events, scene POV roles, mandatory participation, word-count algorithms or enforcement. Chapter-period timeline context and explicit chapter/event links follow in later stories. Faction history visibility remains the accepted character-sheet-only contract.

**Verification:** Associate several same-universe characters, navigate chapters, rename a character, remove one association without deleting its record and reopen. Reject foreign-universe references and preserve other chapter links. Set/save/reopen targets, exceed them while creating/writing/saving and verify no caps. Add target-scope/unset/zero/validation cases once DEC-23 is resolved. Exercise canceled edits, failed publication, volume regrouping and unchanged manuscript/chronology.
