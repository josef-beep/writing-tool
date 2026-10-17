# Input reconciliation review

Verdict: **Pass with two targeted clarifications before handoff.** No surviving coaching decision is contradicted. The retention, date-movement and backup amendments correctly supersede the original PRD. One cross-store revision coverage invariant needs explicit wording; the Replaced marker should explicitly cover item restoration.

Reviewed: finalized `prd.md` (FR-1–49), PRD decision log, `addendum.md`, preserved faction/trait sources, architecture `.memlog.md`, `ARCHITECTURE-SPINE.md` and `RECONCILIATION.md`. This is input reconciliation, not independent verification of technology release claims.

## Findings

### IR-1 — Make shared-universe revision coverage explicit (medium)

**Sources:** FR-2 permits restoring a character/event; FR-3 and FR-18 require whole-project and automatic snapshots to cover manuscript, characters, plots and timeline events. AD-6/8/10 correctly put canonical characters/events in a separate authoritative universe store. AD-14 says each revision is a complete logical state and reuses content within its owning store, but does not explicitly bind project revision capture to the associated universe's saved state.

**Divergence:** One builder could capture only project-owned records at each interval while another captures the associated universe revision too. Both might consider their own store complete, yet the first cannot recover the character/event state that FR-2/18 require at that snapshot. The independent backup invariant does cover bundled universe recovery, but cannot substitute for ordinary revision coverage.

**Fix:** Add a short rule that project revision manifests cover project-owned content and identify the saved universe-owned content needed for the agreed character/event recovery, preserving those versions as dependencies. This is historical recovery content, never another live universe authority. Leave its exact checkpoint/manifest representation and manual reconciliation protocol deferred. The source's whole-project coverage remains subject to the later authoritative-universe reconciliation rule.

### IR-2 — State Replaced marking for every restoration scope (low)

**Sources:** FR-4 requires a snapshot clearly marked Replaced before both individual-item and whole-project restoration. AD-7 explicitly requires that marker under project recovery; AD-14 requires a pre-restoration capture and distinguishes item/whole-project restore, but does not expressly say the item restore capture is also marked Replaced.

**Fix:** In AD-14 specify that every item or whole-project restoration creates the pre-restoration snapshot marked Replaced before mutation. This avoids the marker being implemented only for AD-7 project recovery. The source requirement remains binding even without the clarification.

## Reconciliation results

| Input group | Result |
| --- | --- |
| FR-1/27/49, manuscript and exports | Preserved in AD-12/13 and capability map; export presentation/library choices appropriately deferred. |
| FR-2–4/18, revisions and restoration | Preserved subject to IR-1/2; newest single universe authority and manual conflicts supersede any interpretation that blindly rewinds shared records. |
| FR-19–26, retention/dependencies/ZIP recovery | Correctly superseded: time only, configurable 30 elapsed days, oldest eligible first, ten newest valid successful backups protected separately per project/universe, no ten-revision minimum, no size calculation. Complete ZIPs deduplicate internally and may repeat content across ZIPs. Fallback and next-launch notification preserved. |
| FR-5/6/42, chapter dates | Correct: first assignment/clearing affect start only; existing-start movement has linked updates enabled by default and switchable off; existing end only, selected main events only; end-only edit affects end only; flashback dates fixed in chapter moves/restoration. Simultaneous start/end editing appropriately deferred. |
| FR-7–14/40/41, calendar and chronology | Elapsed-position preservation and date-only universe chronology retained. Calendar builder, optional names, repeating year, year-only birth placement and optional same-day order remain source requirements; these UI/domain details need not all become separate ADs. |
| FR-15–17/36–39/48, characters and factions | Universe ownership, external managed images, one current faction with history, draft/completeness distinction retained. Supplied 100 trait labels, waiver semantics, optional specialities and faction-source field inventory remain binding through the PRD/reconciliation. |
| FR-28–30/43, settings/autosave | Five-minute autosave distinct from ten-minute revisions; JSON settings, theme and retention retained. Ten-minute scheduled backup default remains visibly an inherited assumption, not a new user-confirmed fact. |
| FR-31–35/44–47, decision/plot/timeline/planning | Canonical universe records and story-owned plot sequences retained; many-to-many decision links and derived resolution retained. Informational targets and synchronized universe context remain in the source contract. |
| Later platform/process/storage choices | Electron, Clean Architecture, SQLite initially/PostgreSQL later, selected separate roots/databases, TypeScript/React/Lexical, app-owned versioned document and dedicated background host all match surviving decisions. Windows 10+, macOS 13+, normal installation and broad requested Linux families preserved without unsupported universal promises. |
| Latest organization answer | Unlimited volumes/stories and no imposed chapter/word cap retained. Optional project-level volume grouping follows the accepted coaching proposal; no nested hierarchy or membership cardinality is invented. Workload estimate is context only. |

## Provenance and scope

The preserved PRD and its addendum still describe obsolete size-based retention and an open database choice. `RECONCILIATION.md` openly identifies the later replacements, and the spine links to it; this is a documented upstream discrepancy, not a hidden architecture contradiction. Refresh those upstream sections during the planned spec/PRD adoption so a builder reading the addendum alone does not apply the old policy.

Exact schemas, cross-store crash consistency, archive discovery across changed destinations, equal/divergent authority recovery, image version publication, processor/distro baselines and measurable performance budgets are explicitly deferred with pre-implementation gates. They are unresolved design work, not missing user decisions or claims that these mechanisms have been proven.

No additional audience-facing document is required by the input: Jo selected coaching and implementation guidance for Jo only.
