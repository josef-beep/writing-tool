# Approved by Jo — recorded in epics.md

### Story 5.7: Recover a project or standalone universe from one complete ZIP

As Jo,
I want to recover a project or universe from a single complete backup ZIP after losing its original stores,
So that I can resume writing with saved content, images and retained history intact.

**Acceptance Criteria:**

**Given** one complete project ZIP is available and the original project/universe stores and other ZIPs are unavailable,
**When** I select it for recovery,
**Then** its project state, universe recovery content, retained revisions, category folders and required images/immutable reference closure can be recovered from that ZIP alone,
**And** I can inspect the archive’s owning identities and select live project/universe destination folders independently of the backup destination,
**And** recovery preserves permanent UUIDs and logical ownership rather than using old absolute folder paths as identities.

**Given** a standalone universe ZIP is available with no project,
**When** I recover it,
**Then** its saved content, category folders/assets and retained universe history are recoverable without requiring a project or original universe store,
**And** no project is silently invented,
**And** the recovered universe is established or reconciled as the single authority for that identity.

**Given** a ZIP is selected,
**When** it is validated and staged before activation,
**Then** manifest/schema/content/reference completeness and supported versions are checked,
**And** archive extraction and saved references are validated/confined to managed staging/live roots under the shared import contract,
**And** invalid, incomplete, incompatible or unsafe archive content is rejected without changing live stores or blindly rewriting unsupported schemas,
**And** category folder content and required database/index state follow DEC-33 rather than assuming one database file contains every saved object,
**And** the source archive remains available and staging does not create an active authority.

**Given** the live authority for the archived universe identity is missing,
**When** I confirm establishing it from valid recovery content,
**Then** the recovered universe identity is registered at the selected live location through the common identity/location/writer contracts,
**And** required current and retained historical content/assets are available there,
**And** a recovered project stays inactive until that authority and its references are valid,
**And** a backup snapshot or pinned historical checkpoint is not registered as an additional authority.

**Given** an authoritative universe with the same identity already exists or becomes available during recovery,
**When** recovered content is reconciled,
**Then** manual keep-live, use-recovered or edit-combined choices use the same record-comparison/freshness contracts as Stories 5.3–5.6,
**And** identical records need no review while unrelated live content is preserved,
**And** missing references use explicit restore/relink/remove choices subject to accepted required-reference/type validation,
**And** recovery never creates a competing live copy or automatically selects an archive by filename/timestamp as the conflict winner,
**And** changed category/type/maker/decision relationships remain valid under the current accepted integrity contracts.

**Given** existing current project/universe work will be replaced,
**When** confirmed recovery changes are prepared for commit,
**Then** required pending edits are durably acknowledged and actual current state is captured in a complete viewable/restorable Replaced revision before replacement,
**And** failure of either step blocks replacement,
**And** no fictitious current revision is required for stores genuinely absent after loss,
**And** a race-free freshness/authority check prevents stale review or a second authority between validation and commit.

**Given** I cancel reconciliation, required review is incomplete or a live record changes while review is pending,
**When** the recovery workflow pauses or resumes,
**Then** proposed changes are not applied and the recovered project remains inactive,
**And** pending recovery/review work is preserved for resumption,
**And** intervening changes require renewed review only for affected conflicts with unaffected choices retained.

**Given** a valid recovery is confirmed and required reconciliation/protection succeeds,
**When** coordinated publication completes,
**Then** the selected live stores/category folders resolve their current and retained saved content, images and references consistently,
**And** recovered project manuscript formatting, plots, volume/story order and valid canonical universe references survive reopen,
**And** type definitions/assignments, optional makers and both decision-result link kinds produce the same authoritative tree/context/unresolved status,
**And** affiliation history remains character-sheet-only and independent chapter/event dates retain their accepted meaning,
**And** a recovered project is activated only after required authority/reference reconciliation is complete.

**Given** restored data’s saved calendar format/configuration differs from the authority established/reconciled for recovery,
**When** that data is recovered,
**Then** affected data is visibly flagged as needing a calendar-format update with its historical association retained,
**And** opening/reopening alone does not clear the flag,
**And** DEC-32 governs update/confirmation/clearing and date interpretation without silently replacing the chosen authoritative calendar or assuming automatic conversion.

**Given** project recovery/reconciliation has committed,
**When** the required new reconciled project ZIP is created using the existing complete backup pipeline,
**Then** it captures the recovered project with the reconciled universe and required retained history/assets/reference closure,
**And** recovery and backup outcomes are reported independently,
**And** failed/skipped/partial ZIP creation remains visible/retryable and never counts as a completed backup.

**Given** staging, protection, storage publication or host execution fails,
**When** failure is reported or restart recovery runs,
**Then** no incomplete recovered project is falsely activated or reported as recovered,
**And** existing valid live data, retained/protected state and the source archive remain safe under the publication/restart contract,
**And** recovery resumes or retries according to its durable operation identity without silently forking authority or leaving partially published category/reference state.

**Requirements:** FR-23 independent project/standalone-universe disaster recovery; supporting FR-3/4/18/20/21/22/25 and current authority/category-folder/calendar-format contracts; CAP-9/10; AD-3/4/5/6/7/8/9/10/14/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.6 only. Reuse complete ZIP validation/capture, current/retained manifest resolution, protected replacement and manual project/shared-record reconciliation. TECH-01 versioned import/manifest/comparison/identity/reference/category contracts, TECH-02/03 crash-safe capture/publication, TECH-04 writer/authority coordination, TECH-05 durable restart/cancel-resume, TECH-06 recency/equality/divergence metadata, TECH-07 race-free review/commit, TECH-08 retained/current shared integrity, TECH-09 immutable historical closure, TECH-10 archive identities and TECH-11 installed persistence/migrations apply. DEC-32/33 calendar flags/category layout remain implementation gates. Existing required maker/type/link/association validation remains applicable. PLAN-04 covers select/inspect ZIP, destination selection, missing-authority establishment, existing-authority conflict review, inactive staging, confirmation, resumable cancellation and independent recovery/backup errors. No later scheduler/close/cleanup story is needed to recover one valid ZIP.

**Scope boundary:** User-facing recovery from one independent complete project or standalone-universe ZIP, including missing-authority establishment or existing-authority reconciliation. No hosted service, archive-chain reconstruction, silent overwrite, duplicate authority, automatic calendar-format conversion or arbitrary additional export format. Retained history is recovered as historical content, not multiple live replicas. Recovery from a project ZIP does not demand a separate standalone-universe ZIP.

**Verification:** Remove access to original stores and every other ZIP; recover one project ZIP and independently one standalone-universe ZIP with no project. Verify categories/actual saved files, required database/index state, current/revision manuscript/images/plots and universe/type/maker/relationship closure after reopen; recover a retained chapter/character/event revision using earlier workflows. Test changed destination paths with stable UUIDs, missing-authority establishment and an existing same-identity authority with manual differences/missing references. Exercise Replaced protection where live state exists, cancellation/resumption, live changes mid-review and authority discovery races. Verify old-calendar update flags only where mismatch exists under DEC-32. Reject incomplete/corrupt/unsupported/unsafe archive paths without live mutation. Interrupt extraction/publication and retry/resume under the adopted protocol; preserve source/protected history and one authority. Confirm required new reconciled project ZIP and distinguish its failure from a committed recovery.
