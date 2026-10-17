# Approved by Jo — recorded in epics.md

### Story 5.4: Restore an event revision without changing its depicting chapters

As Jo,
I want to explicitly restore an event’s saved state while preserving replaced work and shared references,
So that I can recover recorded history without moving its chapters or creating another copy of the event.

**Acceptance Criteria:**

**Given** a saved event state is available in retained history,
**When** I select that event for restoration,
**Then** I can preview its saved heading, date and optional description and identify its event UUID, owning universe and revision,
**And** preview resolves historical content without modifying live records,
**And** Universe Events require no decision or maker link merely to be inspected or restored.

**Given** the saved event differs from the current authoritative record with the same identity,
**When** restoration is prepared,
**Then** differences are presented for manual keep-live, use-recovered or combined-content resolution using Story 5.3’s shared review contracts,
**And** identical records need no conflict review,
**And** confirmed changes target the single authoritative universe and their effects on same-universe projects are made clear,
**And** a historical checkpoint is never activated as a second live authority.

**Given** I confirm event replacement,
**When** preparation reaches the protected commit stage,
**Then** required pending edits are durably acknowledged and complete current work is captured in a revision marked Replaced,
**And** that capture includes the actual current authoritative event and required protected relationships/dependencies rather than only an older project checkpoint,
**And** pending-save or protective-capture failure blocks replacement,
**And** the Replaced event remains inspectable/restorable through this same protected workflow.

**Given** protection, reference checks and manual resolution succeed,
**When** the explicit event-item restoration commits,
**Then** the same canonical event receives the confirmed saved content/date and appears at that date in its owning timeline,
**And** linked chapter manuscript/start/end dates remain unchanged,
**And** main/flashback depiction links remain valid under the accepted TECH-08 association scope without silently copying events or dropping chapter references,
**And** every view/project resolves the same authoritative event,
**And** unrelated events, characters, decisions and story plots remain unchanged except for explicitly accepted dependent updates under the shared integrity contract.

**Given** the event participates in background/birth/maker or decision-result relationships,
**When** its restoration scope and dependent references are checked,
**Then** TECH-08 determines which saved event-owned associations can be restored and which current shared references must remain,
**And** missing/foreign/incompatible dependencies are explicitly resolved or block application before commit,
**And** birth-field interactions follow DEC-19 rather than silently overwriting a character’s birth year,
**And** standalone events may retain zero decision/maker links,
**And** any accepted relationship changes yield consistent tree/context/unresolved lookup using both outgoing decision-result kinds; hiding a record never alters resolution,
**And** character-sheet affiliation history is not introduced as a timeline event or event-restoration choice.

**Given** restored event data uses an old calendar format/configuration differing from the current authority,
**When** it is restored,
**Then** the affected data is visibly flagged as needing a calendar-format update with its historical calendar association retained,
**And** viewing/reopening alone does not clear the flag,
**And** DEC-32 defines detection/update/confirmation/clearing without assuming automatic conversion or overwriting the live calendar,
**And** chronological positions/date interpretation use the shared accepted calendar/restoration contract rather than silently reinterpreting an old display string.

**Given** live content changes after review or protective capture,
**When** the event restoration is about to commit,
**Then** the accepted race-free freshness/serialized publication contract rechecks affected state,
**And** only affected conflicts require renewed review while unaffected choices are preserved,
**And** the final replacement is protected by a valid capture of the work actually being replaced.

**Given** review is canceled, validation fails, publication fails or the host stops,
**When** the operation is canceled, blocked or recovered,
**Then** no proposed changes are silently applied or reported as a completed restoration,
**And** canceled reconciliation preserves pending review work for resumption without applying choices,
**And** complete Replaced revisions and required immutable dependencies remain available,
**And** the shared publication/restart protocol preserves consistent event/reference state and reports the actual outcome.

**Requirements:** FR-2 event-item restoration; FR-4 Replaced recovery; FR-18 pre-restoration capture; supporting FR-5/6/7/14/20/21/22/32/35/39/40/41/42/44 and restored calendar-format update contract; CAP-3/7/9; AD-3/6/7/8/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.3 only. Reuse capture/history/protection and shared manual-conflict/recheck contracts. TECH-08 must settle exact event-item association/dependency scope and retained/current cross-project protection. TECH-01 common schemas/reference/comparison rules, TECH-02/03 consistent capture/publication, TECH-04 writers, TECH-05 restart recovery, TECH-06 equality/version metadata, TECH-07 freshness, TECH-09 immutable manifests and TECH-11 persistence apply. Retain DEC-03/04 chronology/display, DEC-14 same-date insertion, DEC-15 pending-writing navigation, DEC-19 birth-field interaction, DEC-24 depiction validity, DEC-27/28 result-link validity and DEC-32 restored-calendar flags. PLAN-04 specifies event-history preview, confirmation, conflicts, Replaced recovery, flags and failure/cancel-resume presentation. No later whole-project restore or ZIP recovery UI is required for a valid event-item restore against an available authority.

**Scope boundary:** An explicit selected event-item restore, separate from chapter-only restoration. Event restoration may explicitly change the selected event’s date/content; chapter restoration still never does. No chapter date shifting, automatic shared-record rollback, decision-item restore, event deletion or universe recovery from ZIP. Eligible existing event kinds and partial dependencies follow their accepted contracts rather than inferred universal rules; a background event remains the same canonical record in character and timeline views.

**Verification:** Restore a standalone Universe Event, linked main event, flashback and eligible background/birth record under the accepted scope. Verify canonical identity, historical preview, confirmed date/content, optional maker/decision links, shared-project refresh and unchanged chapter manuscript/start/end values. Capture current edits in Replaced and restore its event through the same workflow. Check accepted depiction/background/birth/result-link scope and both-kind resolution consistency without unapproved dependent rollback. Restore after a calendar-format change and verify the update flag/history association plus agreed date interpretation/clearing. Exercise manual keep/use/combined review, identical-record bypass, missing/foreign dependencies, pending-save/Replaced failure, canceled/resumed review, intervening live writes and publication interruption/restart. Preserve retained history, valid references and one universe authority.
