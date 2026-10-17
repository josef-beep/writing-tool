# Approved by Jo — recorded in epics.md

### Story 5.3: Restore a character revision against the authoritative universe

As Jo,
I want to restore a character’s saved state with explicit review of shared-universe changes,
So that I can recover earlier character development while preserving current work and valid shared references.

**Acceptance Criteria:**

**Given** a saved character state exists in a retained revision,
**When** I select it for restoration,
**Then** I can inspect its saved content/images and identify the character UUID, owning universe and revision,
**And** the preview resolves immutable historical content rather than substituting the current live character,
**And** previewing does not change live records or activate a second universe authority.

**Given** the saved character differs from the current authoritative character with the same universe/record identity,
**When** restoration is prepared,
**Then** that difference is presented for manual resolution with keep live, use recovered or edit a combined version,
**And** identical records need no conflict review,
**And** confirmed universe changes target the single authority and their effect on other projects sharing that character is made clear,
**And** neither the newest-looking timestamp nor the historical copy automatically wins.

**Given** I confirm a character replacement under the accepted partial-item/reference contract,
**When** it is prepared for commit,
**Then** required pending edits receive durable acknowledgment and the current work that will be replaced is durably captured in a complete revision marked Replaced,
**And** protective capture includes the current authoritative character and required historical/image dependencies under TECH-03/08/09, not merely an older project checkpoint,
**And** failure to save pending work or complete protective capture blocks replacement,
**And** the Replaced character remains viewable and restorable through this same protected character-restoration workflow.

**Given** the accepted character restoration scope includes fields, images or relationships with dependent records,
**When** references are validated before application,
**Then** the accepted TECH-08 partial-item contract determines which character-owned values/associations are restored and which referenced canonical records remain current,
**And** missing, foreign or incompatible references are reported and resolved explicitly under that contract before commit,
**And** a character restore does not silently restore birth/background events, faction profiles, calendar configuration, chapter manuscripts or decision/result records merely because they appeared in its historical dependency closure,
**And** zero-or-one current faction and character-sheet-only affiliation history remain valid under the accepted dependency/affiliation scope,
**And** unselected/unrelated records and retained historical dependencies remain protected.

**Given** affected restored character data links to an old calendar format/configuration differing from the current authority,
**When** the restoration is applied,
**Then** that affected data is visibly flagged as needing a calendar-format update,
**And** its historical calendar association is retained and viewing/reopening alone does not clear the flag,
**And** DEC-32 governs detection/update/confirmation/clearing without silently replacing the live calendar or selecting an unagreed conversion/blocking policy.

**Given** conflict choices and protective capture were prepared against a particular live state,
**When** the authoritative state is checked immediately before commit,
**Then** intervening changes require renewed review only for affected conflicts while preserving unaffected choices,
**And** current work replaced by the final commit has a valid fresh protective capture,
**And** validation and commit use the accepted race-free serialized protocol rather than applying stale choices.

**Given** the protected, validated restoration commits,
**When** I reopen the character through its sheet or another same-universe project,
**Then** the same authoritative character identity resolves the confirmed content and image versions,
**And** existing chapter/decision/maker references resolve under the accepted integrity contract,
**And** no duplicate live universe or copied character identity is introduced.

**Given** I cancel reconciliation, required dependencies cannot be resolved, publication fails or the host stops,
**When** the operation is canceled, blocked or recovered,
**Then** proposed restoration changes are not silently applied or reported as successful,
**And** cancellation preserves pending reconciliation work for later resumption without applying its choices,
**And** completed Replaced revisions remain protected and inspectable,
**And** live records and references remain consistent under the coordinated publication/restart contract and required failures are reported accurately.

**Requirements:** FR-2 character-item restoration; FR-4 recoverable Replaced protection; FR-18 pre-restoration capture; supporting FR-14/15/16/17/20/21/22/37/38/39/44/48 and restored calendar-format update contract; CAP-5/6/9; AD-3/4/6/7/8/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.2 only. TECH-08 must settle exact character-item scope, required/shared reference handling and protection of current state affected across projects; existing DEC-19/20/22 character/birth/background/affiliation gates remain applicable rather than answered here. TECH-01 schemas/reference/comparison contracts, TECH-02/03 coordinated capture/publication, TECH-04 writers, TECH-05 restart recovery, TECH-06 version/equality metadata, TECH-07 freshness/commit, TECH-09 immutable assets/manifests and TECH-11 persistence/migrations apply. DEC-32 governs calendar-format flags; DEC-15 pending edits and PLAN-04 preview/conflict/confirmation/Replaced/cancel-resume/error layouts apply. This story supplies the character-specific manual conflict/restore workflow itself, not a dependency on later whole-project reconciliation or ZIP recovery UI.

**Scope boundary:** One selected existing character’s historical restoration with confirmed shared-authority changes, protected replaced state and resolvable dependencies. The accepted TECH-08 scope governs character-owned associations; no blanket restoration of all records in the pinned universe checkpoint. Missing authority must use the existing locate/recovery gate, never create a second live authority; restoring a project or bootstrapping a universe from a ZIP is later scope. Event-item restoration remains a separate action. Type-dependent decision-maker requirements and optional Universe Event makers do not change merely because they reference this character.

**Verification:** Restore differing character fields/image versions, inspect historical versus live values and exercise keep/use/combined conflict choices with identical-record bypass. Verify Replaced captures the actual authoritative character/current pending work and recover its character state through the same workflow. Use two projects sharing the character and verify canonical identity, reference consistency and the stated shared effects. Exercise accepted birth/background/affiliation/association scope without silently rolling back independent events or faction/decision/chapter data. Restore calendar-linked data after calendar changes and verify update flags and agreed clearing behavior. Test missing/foreign dependencies, incompatible versions, failed pending-save/Replaced capture, canceled/resumed review, intervening live edits and interruption during publication. Confirm no stale application, partial success, duplicate authority or loss of retained images/history.
