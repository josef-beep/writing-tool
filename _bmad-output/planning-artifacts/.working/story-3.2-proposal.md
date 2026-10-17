# Story 3.2 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.2: Develop character profiles with guided prompts and explicit waivers

As Jo,
I want guided character-development fields with clear incomplete and waived states,
So that I can build characters gradually without being forced to answer every prompt before saving.

**Acceptance Criteria:**

**Given** a character exists in the selected universe,
**When** I open its development profile,
**Then** I can record rank/title (title for civilians), background, description, motivation, weaknesses, strengths and specialities alongside its existing name/type,
**And** the creator presents backstory/development prompts using the wording accepted under DEC-05,
**And** these fields extend the same universe-owned character UUID rather than a separate creator record.

**Given** a character is main, major, minor or extras,
**When** development completeness is evaluated,
**Then** name remains required for every type,
**And** rank/title and description are expected for main, major and minor, and optional for extras,
**And** background is expected for main characters unless explicitly waived, and optional otherwise,
**And** motivation, weaknesses, strengths and specialities are optional for every type.

**Given** an expected development prompt has no answer,
**When** I save the named character,
**Then** the unanswered expected prompt is marked incomplete without blocking the save,
**And** I can explicitly waive it as unimportant,
**And** completeness distinguishes answered, incomplete and waived expected prompts,
**And** a waiver satisfies that development-completeness expectation without inventing an answer,
**And** required name validation cannot be bypassed by a development waiver.

**Given** a prompt is outside the character type's expected set,
**When** it remains unanswered,
**Then** no individual waiver is required and it does not make the character incomplete,
**And** fuller optional development remains available for every type,
**And** an extra can remain a name-only profile.

**Given** development responses and explicit waivers were saved,
**When** I close/reopen the universe and inspect the character,
**Then** responses and recorded waiver/completeness states are preserved according to the shared contract,
**And** the viewer exposes saved background, description, optional specialities and the other textual profile fields,
**And** it provides the agreed image placeholder when no image is available.

**Given** a character's type changes or an existing answer is cleared,
**When** the profile is reevaluated,
**Then** completeness uses the new type's expected-field matrix,
**And** existing profile content is not discarded simply because its field becomes optional,
**And** waiver-state transitions follow DEC-05's agreed rules without silently turning an unanswered expectation into an accepted waiver.

**Given** multiple projects use this universe,
**When** character development is viewed through those projects or directly,
**Then** all access the same authoritative responses and completeness states,
**And** another universe's characters remain separate.

**Given** I cancel edits or profile persistence fails,
**When** the operation ends,
**Then** cancellation preserves the saved profile,
**And** a failed write is reported without claiming the responses/waivers were saved,
**And** the last committed profile and its identity remain consistent under the shared publication protocol.

**Requirements:** FR-16 textual field matrix and completeness; FR-48 guided prompts, expected states and textual viewer; continued FR-15 extras behavior and FR-44 sharing; CAP-5; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Story 3.1 only. Resolve DEC-05 prompt wording and waiver transitions before implementation. Use TECH-01's character/profile/state contracts and the applicable TECH-02/04/05/11 publication, writer, recovery and persistence guarantees. Capture creator/viewer and completeness interactions under PLAN-04. No additional expected prompt is invented by this proposal.

**Scope boundary:** This story provides usable textual character development and its viewer. Personality selection, managed image import/display, birth/background timeline events and faction affiliation are subsequent Epic 3 stories, using these same character records. Until those features exist, the viewer must not invent personality/faction values or require those future services to save a profile. Their eventual integration is still required to satisfy the complete FR-48 viewer contract. Character deletion and revision restoration remain outside this story.

**Verification:** Exercise every character type against the field matrix, expected unanswered saves, explicit waivers, answered states and optional unanswered prompts without waivers. Reopen and compare responses/states; verify name-only extras, required names, type changes and shared-universe access. Add exact wording and waiver-transition cases once DEC-05 is resolved. Verify image-placeholder behavior, cancellation and failed writes without lost prior profile content.
