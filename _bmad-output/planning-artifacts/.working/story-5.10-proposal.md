# Approved by Jo — recorded in epics.md

### Story 5.10: Apply time-based retention and safe manual deletion

As Jo,
I want old revisions and backup ZIPs cleaned up under configurable retention while protected content cannot be deleted,
So that storage can be managed without losing current work or retained recovery options.

**Acceptance Criteria:**

**Given** retention has not been customized,
**When** automatic cleanup evaluates revisions and completed backup ZIPs,
**Then** the default retention period is 30 real elapsed days,
**And** I can configure an accepted retention value that survives reopen and settings export/import,
**And** expiry depends on elapsed age, never archive/store size or fictional calendar dates,
**And** eligible old entries are processed oldest first under the shared timestamp/clock contract,
**And** no minimum count of retained revisions is invented.

**Given** a project or standalone universe has valid successfully completed backup ZIPs,
**When** cleanup or application manual deletion is evaluated,
**Then** its ten newest such ZIPs are protected regardless of age,
**And** if fewer than ten exist all are protected,
**And** protection is calculated independently per project and per standalone universe,
**And** an embedded universe snapshot in a project ZIP does not replace a standalone-universe backup,
**And** canceled/failed/partial/invalid archives do not count toward the protected valid set.

**Given** a revision is selected for expiry or manual deletion,
**When** removal is committed,
**Then** only the selected eligible revision entry is removed and surviving retained revisions remain individually resolvable from their complete manifests without replay,
**And** immutable objects, images, category content, comparison/identity metadata and cross-unit checkpoints required by current content or any retained revision remain available,
**And** deleting a revision that shared content with another revision does not delete the remaining revision’s required content,
**And** Replaced revisions follow the same accepted retention/reference protection contract without assuming a new permanent exemption.

**Given** stored content has no remaining current or retained references,
**When** cleanup determines storage eligibility,
**Then** it may be reclaimed only under TECH-08/09’s accepted dependency/root and publication rules,
**And** no-reference status establishes eligibility without promising immediate physical deletion,
**And** live current/retained data cannot be removed because a single project stopped referencing shared universe content.

**Given** I manually select a revision or archive for deletion in the application,
**When** the request is validated and confirmed under PLAN-04,
**Then** the same protected-reference and protected-ten rules apply as in automatic cleanup,
**And** the application blocks protected removal and explains the reason,
**And** removing an eligible backup archive never deletes live project/universe files or assets,
**And** canceled deletion does not remove selected entries.

**Given** backup destinations have changed or archives were moved, including earlier close-time fallback folders,
**When** archive discovery and protection accounting run,
**Then** TECH-10’s identity/location contract evaluates known completed archives across those destinations without relying only on the currently configured folder or readable filename,
**And** moved/renamed archives do not silently lose logical owning identity or bypass protected-set membership,
**And** unavailable/uncertain archive locations are handled under the accepted discovery/protection contract rather than assumed absent to justify unsafe deletion,
**And** existing readable names/date/time and original manifest metadata remain labels/provenance rather than the sole authority for ownership or age.

**Given** a new revision/backup is published or restoration changes references during cleanup,
**When** deletion reaches commit,
**Then** the coordinated writer/root/publication contract revalidates affected dependencies and protected sets without racing authoritative writes,
**And** staged/in-progress capture or recovery content is protected under the accepted TECH-09 operation-root contract,
**And** no content needed by the committed current/retained state is reclaimed by a stale cleanup plan.

**Given** deletion fails, a destination disappears or the host stops during cleanup,
**When** cleanup reports its outcome or restart recovery runs,
**Then** it does not falsely report undeleted entries as removed,
**And** partial progress and resumable/retry behavior follow the accepted operation/metadata contract,
**And** current work, retained dependency closure and protected valid archives remain consistent and recoverable,
**And** no failed/partial backup is retroactively labeled valid to fill a protection count.

**Requirements:** FR-19 time-only retention/ten protected ZIPs; FR-20 retained no-replay revisions and manual deletion; FR-22 current/retained reference protection; supporting FR-21/23/28/29 and category-folder/naming/authority contracts; CAP-9/10/12; AD-3/4/6/8/10/14/15/18; NFR-1/2/3/4/5/6/7/9.

**Dependencies:** Approved Epics 1–4 and Stories 5.1–5.9 only. TECH-08 shared-reference/history integrity, TECH-09 complete root/dependency graph, immutable identity/metadata and safe reclamation, and TECH-10 archive discovery/protection across locations must be settled before any deletion path. TECH-01 real elapsed timestamp/clock/schema/error contracts, TECH-02/04 coordinated serialized mutation, TECH-05 restart recovery and TECH-11 persistence/migrations apply. DEC-07 validates retention input; DEC-33 category layout and DEC-35 archive names are preserved. PLAN-04 specifies revision/archive selection, protection explanations, confirmation/cancel, cleanup outcome and unavailable-destination/error presentation. Cleanup cadence and clock-boundary/uncertain-location details must be documented in these shared contracts before implementation; this story does not silently choose them. No later export story is needed for safe retention.

**Scope boundary:** Application-managed time-based expiry, manual revision/archive deletion and eligible immutable-content reclamation with dependency/protected-set enforcement. Does not control someone deleting files outside the application, introduce size limits, guarantee immediate garbage collection, require ten revisions, permanently exempt every Replaced revision or weaken independent complete ZIPs. Category directories may be managed only while preserving their still-referenced content and the accepted category layout; deletion of an archive cannot cascade into live category storage.

**Verification:** Evaluate 30-day/default and changed valid retention, settings export/import, real elapsed age boundary under the documented clock contract and size-independence. Use fewer/exactly/more than ten valid ZIPs per project/standalone universe, equal-time cases under accepted ordering, embedded snapshots and failed/partial attempts; protect the correct sets for both expiry/manual deletion. Delete eligible revisions sharing images/documents/checkpoints and prove current/surviving histories remain exact and no-replay resolvable, including Replaced histories and cross-project references. Validate eligibility versus deferred reclamation and absence of a revision minimum. Move/rename destinations/archives, include fallback folders and unavailable locations under TECH-10. Exercise cancel/block/error paths, new capture/restoration racing deletion and crash/restart at removal/reclamation stages. Recover from surviving ZIPs and restore retained items after cleanup using earlier stories; live categories/assets must remain intact.
