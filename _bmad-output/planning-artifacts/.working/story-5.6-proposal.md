# Approved by Jo — recorded in epics.md

### Story 5.6: Restore a whole project against its authoritative universe

As Jo,
I want to restore a complete project revision while reviewing differences against its live universe,
So that I can recover earlier writing and planning without silently replacing shared history or losing the work being replaced.

**Acceptance Criteria:**

**Given** a retained complete project revision is available,
**When** I select it for whole-project restoration,
**Then** I can identify/inspect its saved project/story/volume/chapter/manuscript/plot state and required pinned historical universe dependencies,
**And** its saved category files/folders, images, type definitions/assignments, optional makers and both decision-result relationship kinds resolve through the complete manifest,
**And** preview/staging leaves the live project and universe unchanged and does not activate a historical universe replica.

**Given** I confirm the restoration workflow,
**When** current work is prepared for replacement,
**Then** required pending edits are durably acknowledged and complete current work is captured in a viewable/restorable revision marked Replaced,
**And** the protected capture covers the actual current project and any authoritative universe state that confirmed recovery changes will replace,
**And** no replacement is applied if required pending saves or complete protective capture fail,
**And** the Replaced project can itself be selected later through this same protected whole-project restoration workflow.

**Given** the saved project refers to an available live universe,
**When** reconciliation compares saved dependencies with the current authoritative state,
**Then** matching UUIDs are compared within the owning universe using the accepted persisted-content comparison contract,
**And** differing records are presented for manual keep-live, use-recovered or edit-combined choices,
**And** identical records need no conflict review and unrelated live records remain unchanged,
**And** absence from the older project revision alone does not authorize deleting current universe records,
**And** confirmed shared-universe changes affect its single authority and the effect on other projects is made clear.

**Given** a required recovered reference is absent from the live universe,
**When** it is presented for resolution,
**Then** the agreed choices are restore the missing record from recovery content, link to an existing valid same-universe replacement or remove the reference,
**And** each choice must pass the accepted required-reference/type/ownership integrity contract before application,
**And** additional decision/type/maker/relationship dependencies follow the same shared-schema/reference rules under TECH-01/08,
**And** no activated project has dangling references and removing a live reference never deletes protected historical content.

**Given** the authoritative universe cannot be located or required reconciliation remains incomplete,
**When** activation is requested,
**Then** the restored project remains inactive and the missing-authority or unresolved-reference/conflict condition is reported,
**And** Jo can use the existing locate-authority path without silently creating a replacement,
**And** recovering a missing authority from a ZIP remains a separate later workflow, not a prerequisite for restoring this project against an available authority.

**Given** reconciliation has pending choices,
**When** I cancel or live universe content changes before application,
**Then** cancellation applies no proposed restoration changes and preserves the pending restoration/review work for resumption,
**And** before commit a race-free freshness check requires renewed review only for affected conflicts while retaining unaffected choices,
**And** current state actually replaced by the final commit has a valid fresh Replaced capture,
**And** stale choices are not silently applied to newer live records.

**Given** confirmed reconciliation passes protection, freshness and integrity validation,
**When** restoration is committed through the coordinated publication contract,
**Then** the restored project is updated to reference the reconciled authoritative records and becomes eligible for activation only after required reconciliation is complete,
**And** category folders/actual content and required database/index state follow the accepted DEC-33 layout and preserve identities, assets and retained immutable history,
**And** plots remain story-owned, chapter fields remain independent and faction affiliation history stays character-sheet-only,
**And** decision status derives from surviving outgoing event or decision links and agrees across tree/context/unresolved lookup,
**And** whole-project recovery applies only explicitly confirmed universe changes; it does not introduce chapter-driven event edits or change chapter-only restoration isolation.

**Given** restored data’s saved calendar format/configuration differs from the current authoritative calendar,
**When** the reconciled restoration is applied,
**Then** affected restored data is visibly flagged as needing a calendar-format update with its historical association retained,
**And** viewing/reopening alone does not clear that flag,
**And** DEC-32 governs update/confirmation/clearing and date interpretation without presuming automatic conversion, live-calendar replacement or a new blocking policy.

**Given** the restored project and reconciled universe have been committed,
**When** the post-restoration backup runs,
**Then** the application creates a new independently complete project ZIP using Story 5.5’s capture/category-folder/archive pipeline,
**And** the ZIP contains the reconciled project/universe and required retained history/images/reference closure,
**And** its actual completed location is reported,
**And** failed/skipped/incomplete ZIP creation remains visible and retryable rather than reported as a successful backup,
**And** restoration/reconciliation and backup outcomes are reported independently without assuming a silent rollback of committed restoration.

**Given** validation, publication or host execution fails,
**When** the operation is blocked or recovered after restart,
**Then** unresolved recovered state is not activated or reported as restored,
**And** coordinated commit/restart rules prevent partial project/universe/category-file publication,
**And** previous live/protected state remains recoverable and the actual failure is reported without inventing a second authority.

**Requirements:** FR-3 whole-project restoration; FR-4 Replaced recovery; FR-18 pre-restoration capture; supporting FR-20/21/22/23 and current category-folder/calendar-format/authority contracts; CAP-9/10; AD-3/4/5/6/7/8/9/10/13/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.5 only. Reuse complete capture/history, manual conflict/freshness/replaced-state protection and complete ZIP creation rather than a later backup capability. TECH-01 comparison/identity/reference/manifest/category schemas, TECH-02/03 coordinated capture/publication, TECH-04 writers, TECH-05 resumable host recovery, TECH-06 version/equality metadata, TECH-07 race-free validation/commit, TECH-08 shared-reference/history integrity, TECH-09 immutable dependency closure, TECH-10 archive accounting and TECH-11 persistence/migrations apply. Resolve DEC-33 category-file/database/index layout and DEC-32 calendar-flag workflow before affected implementation; retain existing DEC-15/26–30 record/link/type/association gates. PLAN-04 covers whole-project preview, staged inactive state, conflicts/missing references, confirmation/cancel-resume, calendar flags and independent restore/ZIP outcomes. No later disaster-recovery, scheduler, close or retention story is required to restore against an available authority and create its reconciled ZIP.

**Scope boundary:** Whole-project restoration from a retained complete revision against an available authoritative universe, with complete manual reconciliation and post-restoration ZIP. This differs from chapter-only restore: historical universe dependencies can change only through explicit confirmed reconciliation, never automatic chapter restoration. ZIP import/authority establishment after original-store loss follows separately; user-facing restoration of standalone decisions/types is not introduced as a new partial-item feature. Missing-reference choices may not bypass required maker/type/reference validation.

**Verification:** Restore a prior multi-story/volume manuscript/plot revision with changed current universe content and shared projects. Exercise identical records, differing character/event/decision/type/maker/relationship state and unrelated newer universe records; verify manual keep/use/combined results and no deletion based on historical absence. Test missing-reference restore/relink/remove under accepted validation, saved category folders and exact required images/history. Recover the replaced project through the same workflow and verify fresh Replaced protection. Cancel/resume review, change live state mid-review and verify affected-only rechecks and no stale commit. Restore after a calendar-format change and verify pending-update flags. Confirm correct canonical links and resolution across timeline/tree/context/lookup, then validate the new independent reconciled ZIP. Exercise unavailable authority, failed pending-save/Replaced capture, corrupt/incompatible dependencies, publication interruption and post-commit ZIP failure/cancellation/retry; distinguish restore and backup outcomes and preserve recoverable state/one authority.
