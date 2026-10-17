# Approved by Jo — recorded in epics.md

### Story 5.1: Capture and inspect complete scheduled revisions of current work

As Jo,
I want complete revisions of current work captured at a configurable interval,
So that I can inspect earlier saved states without relying on the latest autosave or a chain of older revisions.

**Acceptance Criteria:**

**Given** revision scheduling has not been customized,
**When** a project is open for current work,
**Then** complete revision capture defaults to a 10-minute interval,
**And** I can configure and persist an accepted revision interval using the existing settings contract,
**And** this interval is independent of 5-minute autosave and the separately configured 10-minute scheduled-backup interval,
**And** cadence, interval-change, sleep/resume, overlapping-attempt and retry behavior follow the accepted DEC-31 contract.

**Given** a scheduled revision capture is due while manuscript edits are pending,
**When** the capture runs,
**Then** it first synchronizes pending current-work manuscript text/formatting through application use cases and obtains durable acknowledgment,
**And** it captures the coordinated saved state rather than only an older autosaved document,
**And** concurrent edits and capture use TECH-02/03/04’s consistent boundary so the revision is not a mixture of incompatible states,
**And** failure to persist required pending edits prevents publishing that attempt as a complete revision.

**Given** the coordinated capture succeeds,
**When** the revision is published,
**Then** its complete manifest identifies the saved project/story/volume/chapter/manuscript/plot state and pinned historical universe checkpoint with its required dependency closure,
**And** that closure preserves exact required character/faction/event/decision/calendar/type-definition/assignment content, images, optional maker references, chapter depictions and both decision-result relationship kinds,
**And** optional maker rules, direct decision links, independent Universe Events, story-owned plots and character-sheet-only affiliation history remain faithfully represented,
**And** persisted context/filter settings join the applicable capture scope only where adopted under their accepted ownership contract,
**And** publication preserves one live universe authority; historical checkpoints are not additional live replicas.

**Given** successive revisions reference unchanged document versions, images or other content,
**When** complete manifests are stored,
**Then** unchanged immutable content is reused within its owning store,
**And** each retained revision resolves its exact saved state from its own complete manifest and referenced objects without replaying earlier revisions,
**And** current work and retained revision dependencies are preserved across owning project/universe stores,
**And** this story offers no deletion/expiry path that can remove protected content.

**Given** a completed revision is available,
**When** I select it in the revision history after capture or reopening,
**Then** I can inspect its recorded project and saved chapter/character/event content through read-only historical queries,
**And** inspection uses the pinned saved content rather than silently substituting newer live universe records,
**And** viewing history does not activate or restore it, change live records or discard pending writing,
**And** the history identifies the revision/capture state and distinguishes complete entries from failed/incomplete attempts under PLAN-04.

**Given** saving, cross-store/checkpoint publication or required asset capture fails, or the background host stops during capture,
**When** failure is reported or restart recovery runs,
**Then** partial state is not presented as a successful complete revision,
**And** previously completed revisions/current content retain their protected dependencies,
**And** the application reports the capture outcome and follows the accepted recovery/retry contract,
**And** an incomplete capture does not falsely acknowledge pending edits or claim a successful backup.

**Given** I inspect a revision with missing, invalid or unsupported content,
**When** its history content cannot be resolved safely,
**Then** an explicit error is shown rather than substituting current content, inventing records or blindly rewriting an unsupported schema,
**And** existing saved/live state remains unchanged.

**Requirements:** FR-18 scheduled complete revisions; FR-20 complete no-replay manifests; FR-21 within-store content reuse; FR-22 dependency protection; FR-2 read-only historical item inspection only. Supporting FR-1/28/29/43 and current FR-31/32/34/35/44/45 contracts; CAP-9/12; AD-3/4/6/8/10/13/14/18; NFR-1/2/3/4/5/6/7/9. Performance acceptance remains DEC-11.

**Dependencies:** Approved Epics 1–4 only. TECH-01 versioned document/manifest/identity/query contracts, TECH-02 consistent crash-safe publication, TECH-03 pending-edit acknowledgment/consistent snapshot, TECH-04 writer coordination, TECH-05 host-restart recovery, TECH-09 immutable object/checkpoint identities and cleanup roots, and TECH-11 persistence/migrations must be resolved before their affected implementation. Retain TECH-08 shared reference/history protection and DEC-07 settings validation. Resolve DEC-31 revision-scheduler timing/retry details; reuse DEC-15 pending-editor handling without treating autosave scheduling rules as automatically applying. PLAN-04 captures history/preview, settings and capture-error/retry interactions. Existing DEC-26–30 product gates still apply to their source records; revision approval does not settle them.

**Scope boundary:** A usable scheduled complete-revision/history-inspection workflow, with only the storage and queries it needs. No item/project restoration, Replaced-trigger UI, cleanup, independent ZIP backup or recovery-authority activation. Normal-close and pre-restoration captures are later integration obligations and must reuse this capture contract; they are not prerequisites for scheduled revision capture or historical inspection. Historical inspection must not trigger conflict resolution or mutate the authoritative universe.

**Verification:** Schedule capture with defaults and a changed valid revision interval, verifying independence from autosave/backup settings and reopen persistence. Capture pending formatted manuscript changes with chapter/plot state and required universe/image/type/maker/decision-link dependencies, then edit live records and verify the revision still resolves its exact historical values. Confirm complete-manifest resolution without reading/replaying earlier revision manifests, immutable reuse and protected shared dependencies. Inspect history without mutating live data, including chapter/event dates and faction-history visibility. Exercise missing assets/references, unsupported schemas, failed pending saves, concurrent writes, interruption at publication stages and restart recovery under the adopted protocols; no partial attempt may appear complete. Check agreed DEC-31 cadence/sleep/retry cases. Later restoration/backup/retention stories must add their own end-to-end checks against this same manifest/capture contract.
