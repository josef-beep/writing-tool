# Epic 3: Develop characters and factions alongside chapter chronology

Jo can develop and find characters/factions, maintain dated affiliations and background events, associate characters with chapters, see chapter targets/context and plan from either a chapter or the timeline while controlling which main events move.

Primary requirements: FR-5/6/14–17/36–39/45–48. Reuse canonical universe records, shared chronology and secure application writes. DEC-02/05 and the applicable shared integrity/publication gates remain prerequisites for their affected stories. Existing name/type fields can be delivered before guided prompts, factions and chapter associations; no future story may be required for this first character workflow. Required UX interactions remain tracked under PLAN-04.

## Review status

Story 3.1 was approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.1: Create and filter universe characters by type

As Jo,
I want to create named characters and classify/filter them as main, major, minor or extras,
So that I can find the relevant cast while keeping every character accessible.

**Acceptance Criteria:**

**Given** an available universe,
**When** I create a named character and classify it as main, major, minor or extras,
**Then** it is saved as a universe-owned record with a permanent UUID and owning-universe identity,
**And** creation requires no project, story, chapter, fictional date, faction or development response,
**And** only the character fields/storage needed by this story are introduced.

**Given** I am recording an extra,
**When** I supply only the character's name as profile content,
**Then** the character can be saved and reopened without filling any further development fields,
**And** a missing name cannot be accepted as a valid named character for any type.

**Given** the universe contains characters of different types,
**When** I apply a type filter,
**Then** the list shows characters of the selected type,
**And** clearing/changing the filter makes the other saved characters accessible again,
**And** filtering does not delete, reclassify or change any character record.

**Given** a character exists,
**When** I select it, change its name or change its type,
**Then** I can inspect the saved name/type and save the accepted changes,
**And** its UUID and owning universe remain unchanged,
**And** the record appears under its resulting type filter after saving,
**And** reclassification does not discard existing saved content or require a duplicate character.

**Given** multiple projects use the same authoritative universe,
**When** I access its character list through those projects or directly,
**Then** they resolve the same character records and saved edits,
**And** selecting another universe shows only that universe's characters,
**And** no live project-local character copy is created.

**Given** character names/types were successfully saved,
**When** I close and reopen the universe,
**Then** names, classifications, identities and ownership are preserved,
**And** a universe with no characters shows an accurate empty state and supports creating its first character.

**Given** I cancel an edit or persistence fails,
**When** the operation ends,
**Then** cancellation leaves the saved character unchanged,
**And** a failed save is not reported as successful,
**And** the last committed record remains consistent without writing into a different universe.

**Requirements:** FR-15; FR-16 required-name foundation; character-sharing extension of FR-44; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.7 only. Use shared TECH-01 identity/transport/storage contracts and applicable TECH-02/04/05/11 publication, writer, recovery and SQLite guarantees. Capture basic character-list/create/filter interactions under PLAN-04. No text-search feature, automatic default type, unique-name restriction or additional profile field is silently selected by this proposal.

**Scope boundary:** This story provides a usable basic character directory without depending on later guided development, personality catalog, images, birth records, background events, faction membership or chapter associations. Expected fields do not block saving, and a name-only main/major/minor record must not be claimed to have completed later guided development. Subsequent stories extend these same records with all agreed fields and completeness/waiver behavior; fuller optional development remains available to extras. Character deletion is not introduced here and must satisfy TECH-08 before future implementation.

**Verification:** Create all four types, including a name-only extra; reject a missing name; select/rename/reclassify/filter characters and reopen. Confirm filtering preserves all records, reclassification preserves UUID/content, projects share one universe's records and other universes remain isolated. Exercise empty state, canceled edits, failed writes and wrong-universe requests.
