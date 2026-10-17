# Approved by Jo — recorded in epics.md

### Story 5.2: Restore a chapter revision while preserving replaced work

As Jo,
I want to restore a chapter’s saved content and dates while preserving the work it replaces,
So that I can recover earlier writing without losing my current version or changing linked event history.

**Acceptance Criteria:**

**Given** a saved chapter revision can be inspected through the existing revision history,
**When** I select that chapter’s historical state for restoration,
**Then** I can inspect the saved chapter content/dates and identify the selected chapter/revision before confirming the restoration,
**And** previewing does not change live content or activate the historical universe checkpoint.

**Given** I confirm chapter restoration while current manuscript edits are pending,
**When** the application prepares the operation,
**Then** it durably acknowledges required pending edits and captures the complete current-work revision using Story 5.1’s manifest/checkpoint contract,
**And** that protective revision is explicitly marked Replaced and remains viewable in history,
**And** no chapter replacement begins until required edits and the complete Replaced capture are durably persisted,
**And** a previous scheduled revision is not silently substituted for the current pre-restoration state.

**Given** protective capture succeeds and the selected saved state passes the shared reference/schema/date contracts,
**When** chapter restoration commits,
**Then** the selected chapter’s saved manuscript formatting/content and independent start/end date values replace its current corresponding values through application use cases,
**And** the same chapter identity is preserved and the chapter list reflects the restored start-date sorting rule,
**And** optional missing dates remain missing without invented bounds or automatic date correction,
**And** unselected chapters, story plots and unrelated live records remain unchanged.

**Given** the selected chapter revision’s saved calendar format/configuration differs from the current authoritative calendar,
**When** the affected data is restored,
**Then** the affected restored data’s old calendar format is visibly flagged as needing an update,
**And** its historical calendar association is retained so the old format is not silently treated as current,
**And** viewing/reopening alone does not clear the pending-update flag,
**And** detection/update/confirmation and flag-clearing behavior follow the accepted DEC-32 contract,
**And** flagging does not overwrite the live universe calendar or change linked event dates/content.

**Given** the chapter has linked main events or flashbacks,
**When** its saved content/dates are restored,
**Then** every linked event keeps its current authoritative date/content,
**And** no event is shifted, restored from the chapter checkpoint or edited inline,
**And** no chapter-restoration event-selection or linked-update control is offered,
**And** any chapter-local association/dependency restoration follows the accepted TECH-08 scope without silently recreating, deleting, relinking or overwriting shared records.

**Given** the work replaced by a successful chapter restoration is needed again,
**When** I open the Replaced revision and select that chapter for restoration,
**Then** I can inspect and restore its saved chapter content/dates through this same protected workflow,
**And** the new restoration first captures the then-current work in another Replaced revision,
**And** linked event date/content isolation and retained historical dependency protection still apply.

**Given** the historical revision/reference is missing, incompatible, foreign or cannot safely resolve against the current authority, or pending-save/Replaced capture fails,
**When** restoration is validated or prepared,
**Then** the chapter replacement is blocked with an accurate error and no false success,
**And** no historical universe copy is promoted to authority or conflicting shared data silently overwritten,
**And** reference/history integrity is preserved and unsupported schemas are not blindly rewritten,
**And** valid current work and earlier completed revisions remain available; already acknowledged current saves are not described as a completed restoration.

**Given** I cancel before replacement commits, a concurrent write invalidates the prepared state, or the host stops during publication,
**When** the operation is canceled, revalidated or recovered,
**Then** cancellation does not apply the selected historical chapter state,
**And** applicable freshness/serialization rules prevent replacing newer current work using stale preparation or stale protective capture,
**And** the coordinated publication/restart contract avoids a partially restored chapter or falsely completed restoration,
**And** any completed Replaced capture remains protected and inspectable even if replacement is canceled or fails.

**Requirements:** FR-2 chapter restoration/read-only preview; FR-4 mandatory recoverable Replaced capture; FR-18 pre-restoration trigger; supporting FR-1/5/6/7/20/21/22/42/44 and the restored calendar-format flag contract; CAP-9; AD-3/6/8/10/13/14/18 and superseding chapter-only restoration/event-isolation contracts; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Story 5.1 only. Resolve TECH-08 partial-item association/dependency scope and shared-history protection before implementing affected restoration. TECH-01 manifest/document/reference/error schemas, TECH-02/03 consistent capture/publication, TECH-04 serialization, TECH-05 restart recovery, TECH-07 applicable freshness/commit checks, TECH-09 immutable protected dependency roots and TECH-11 persistence/migrations govern the operation. Resolve DEC-32 calendar-format mismatch detection/update/flag-clearing rules before the affected implementation, without presuming automatic conversion or a new restoration-blocking rule. Inherit DEC-01 date-range validity, DEC-03/04 date/display, DEC-15 pending editor/navigation and DEC-16 chapter ties. PLAN-04 specifies old-calendar update flags and the accepted update interactions, preview/confirmation, Replaced history labels and blocked/canceled/failed restoration/retry presentation. No future character/event/project restoration, reconciliation UI or backup story is needed to restore a valid chapter with resolvable dependencies.

**Scope boundary:** A usable chapter-only restore plus recovery of the chapter’s replaced work. This story restores saved chapter content/dates and only chapter-local dependencies explicitly accepted under TECH-08; it introduces no automatic shared-record conflict resolution. Shared-universe conflicts block this operation until safely resolved under the agreed authority contract, never silently overwrite. Character/event-item restoration, whole-project reconciliation and ZIP recovery are later stories with their own coverage. Complete protective captures retain the full required historical closure; chapter-only application does not restore all of that captured universe content.

**Verification:** Capture a chapter under an older calendar, change the authoritative calendar format/configuration, then restore and verify the affected data’s visible update flag, historical calendar association and preservation across view/reopen. Verify flag clearing only through the accepted DEC-32 completion rule, no silent live-calendar replacement and unchanged linked event dates/content. Also exercise a matching calendar without a false mismatch flag under the accepted detection rule. Restore formatted manuscript with neither/one/both chapter dates and confirm identity, list order and independent saved values. Before replacement, edit current writing beyond its last autosave and verify that exact state exists in the completed Replaced revision; restore it through the same workflow and verify a fresh protective capture. Use linked main events/flashbacks changed since the chapter revision and confirm all current event dates/content remain unchanged through chapter restore and Replaced recovery. Verify unselected chapters/plots, retained history, valid chapter references and one universe authority. Exercise cancellation, missing/foreign dependencies, incompatible schema, pending-save/Replaced failure, concurrent changes and crash/restart during commit under the adopted contracts. Failures must not claim restoration or lose current/protected content. Later item/project recovery stories add their own shared-record conflict integration checks.
