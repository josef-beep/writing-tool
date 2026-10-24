---
status: published-planning-baseline
contractVersion: 1
updated: 2026-10-22
scope: PLAN-05 story prerequisites; not installed-platform or release acceptance
---
# Story prerequisite contracts

This index supplies the current consuming definitions for the 49 approved stories. It supersedes historical statements that a product decision, UX handoff or technical mechanism is still unspecified. It does **not** close a TECH checkbox, certify all implementations or replace the installed and fault-injection evidence required by PLAN-06/BUILD-25/VERIFY. Product rules come from [requirements](requirements.md), [contracts](contracts.md) and the final [Experience](../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md), including Jo's 2026-10-22 error-exit amendment.

Closed TypeScript types **and their runtime validators** below are the exact version-one consuming schemas. A foundation JSON Schema with an open payload is not an alternative entity validator. The source contract is reproducible from the repository revision recorded in [PLAN-05 validation](../../planning-artifacts/plan-05-validation.json). Existing JSON Schema files remain additional conformance fixtures. Implementation acceptance must exercise both shape and semantic validation; a link to source alone is not proof that an adapter conforms.

## TECH-01

**Data, messages and migrations.** Use [data foundations](data-contracts.md), [workspace entity design](workspace-data-contract.md) and the [backend integration map](workspace-backend-api.md). Exact closed record unions, required/optional fields, ownership, references and category names are in [workspace domain](../../../src/domain/workspace.ts); dates and unbounded decimal arithmetic in [calendar](../../../src/domain/calendar.ts); paired text/formatting and scalar anchors in [manuscript](../../../src/domain/manuscript.ts). [Workspace commands/settings](../../../src/application/contracts/workspace.ts), [universe](../../../src/application/contracts/universe.ts), [project](../../../src/application/contracts/project.ts), [readiness](../../../src/application/contracts/readiness.ts), [presentation](../../../src/application/contracts/presentation.ts) and [protection](../../../src/application/contracts/protection.ts) define command-specific DTOs, correlated results and validators.

Schema and protocol versions are independent of package version and of each other: entity/transport/manifest version 1 and the activation decision version defined by its own validator are not interchangeable. Read rejects duplicate JSON keys, malformed Unicode, unknown persisted fields and unsupported versions. Settings import alone retains its explicit missing/unknown-field exception. Known catalog/feature initialization/migration lives in [universe DDL](../../../src/infrastructure/universe-ddl.ts) and [workspace storage](../../../src/infrastructure/workspace-storage.ts); initialization cannot repair a foreign, missing or unsupported live catalog. No legacy missing-code payload is silently backfilled, renumbered or rewritten: unsupported input remains non-writable until an explicit deterministic migration supports it. A future migration must preserve creation order, IDs, issued code counters and retained spellings and fail on collisions before publication.

Code keys use the pinned Unicode normalization/folding implementation, not SQL's locale-dependent default. An owning-universe operation allocates counters and registry keys atomically with the record. Receipt acceptance covers only the echoed submitted editor revision, not later edits.

**Acceptance work:** exhaustive per-command/record negative cases, schema/runtime conformance, supported migration and rejection fixtures, and cross-store semantic/reference validation. Stories introduce their own entities when needed; the starter does not populate future entity categories.

## TECH-02

**Publication.** Follow [single-unit publication](publication-contract.md), [cross-unit coordination](coordination-contracts.md), [universe storage](universe-storage-contract.md) and [project storage](project-storage-contract.md). Exact planned files, expected generations/record versions, request digest and receipt are frozen before live publication. Durable before/after journals precede file replacement; the catalog or coordinator decision determines undo/redo; finalization precedes later mutations. Acknowledgment loss retains the original operation ID and payload. Same ID/digest is idempotent; changed payload under the same ID rejects.

[WorkspaceCoordinator](../../../src/infrastructure/workspace-coordinator.ts) owns durable participant preparation, canonical owner ordering, one commit decision and restart discovery. [Workspace storage](../../../src/infrastructure/workspace-storage.ts) implements matched JSON/WRT/catalog/asset publication. Missing participants, invalid plans, stale generations/fences or aliased paths keep affected authority non-writable. Relocation changes validated root bindings, not logical IDs or relative object paths.

**Acceptance work:** interruptions at every prepare/file/decision/catalog/finalization step, unavailable participants, retries, later-generation replay rejection, and installed filesystem durability.

## TECH-03

**Saved cuts.** Renderer guards acknowledge required pending edits before capture. [Workspace ports](../../../src/application/contracts/workspace-ports.ts) and [WorkspaceApplication](../../../src/application/workspace.ts) provide an identified complete generation cut; [captured-state validation](../../../src/infrastructure/captured-state.ts), [RevisionStorage](../../../src/infrastructure/revisions.ts) and [ExportCaptureStorage](../../../src/infrastructure/export-captures.ts) pin immutable file/catalog/text/formatting/asset closure. Compare the saved snapshot again before completion. A project cut includes its necessary universe checkpoint without making another live authority. Never reconstruct a historical export by rereading newer live data.

**Acceptance work:** edits during acknowledgment/capture, mixed-generation rejection, interrupted pin/release, original-cut reconciliation after later edits and restart, and complete ZIP independence.

## TECH-04

**Ownership.** Use the existing per-root exclusive OS-backed SQLite lease and session/fence identity described in [coordination](coordination-contracts.md). Reuse an active matching universe; acquire cross-unit participants in canonical owning-kind/UUID order. Another host gets a busy result with its pending context retained. Never steal a writer based on heartbeat age. Revalidate lease, fence and expected versions before publication and after reopening; do not run a parallel category-store authority.

**Acceptance work:** competing processes, owner death, stale session/fence, shared-universe projects, network/unsupported filesystems and each installed target's lock/flush behavior.

## TECH-05

**Lifecycle and error exit.** [Main lifecycle](../../../src/desktop/main.ts), [isolated preload](../../../src/desktop/preload.ts) and host clients enforce sender/command correlation, bounded requests, timeouts and exclusive authority transitions. Read-only workspace/settings work has a completion boundary so a pending read is not falsely called an uncertain mutation. Restore the original owning roots/identities after a host restart before authority-sensitive current/save/close commands. A deliberate universe close clears cached context so later restart cannot reopen it.

Protection execution durably records native context as prepared, obtains a utility ready-job acknowledgment, then records attempted dispatch. Utility job states are ready/started/prepared/complete/aborted, validated with original request identity and output proof. Reconciliation preserves the original operation ID and cannot invent a new unresolved mutation for a failed read or absent job. Only capture/backup/export saved-copy operations can be set aside for writing; live recovery and unknown live saves retain their integrity gates.

Normal close saves, captures the required revision/ZIP, drains project then universe, and releases authority. Jo's [error-exit amendment](contracts.md#dec-08--explicit-error-exit-amendment-2026-10-22) adds a separately confirmed exit, including from a stalled close. It preserves available current profile/workspace/combined-proposal drafts, current Lexical/visible text, queued layout changes and exact pending operation inputs in a private recovery copy; journals and original pending records remain. Collection is bounded; an incomplete copy requires a separate explicit quit-without-copy decision. This is an interrupted exit, not successful normal close, successful backup or successful reconciliation. A flow clears only a drain lock it owns. Relaunch offers access to saved copies; these files are not silently replayed into live authority.

**Acceptance work:** death and lost acknowledgment before/after dispatch/publication, exact identity restoration, canceled overlapping close, failed copy, stalled renderer, pending/live-operation distinctions and next-launch recovery-copy/fallback discovery. Focused evidence is in the three October 22 recovery-fix specs; it does not replace every story's acceptance.

## TECH-06

**Comparison.** [RecoveryStorage](../../../src/infrastructure/recovery.ts) compares owner/root/record identity and canonical content fingerprints, including contextual dependencies. Record-version UUIDs are equality tokens; generations order commits only within their own unit history. Paths, names, machine clocks and larger unrelated generation values never choose a recovery winner. Identical validated records bypass conflict choices; differing records require the agreed manual live/recovered/combined choice. Preserve captured identities and lineage metadata through restore and reject unsupported or foreign identity evidence.

**Acceptance work:** equal/changed records, different contexts, forked copies, relocated roots, preserved historical versions and no timestamp-based automatic overwrite.

## TECH-07

**Freshness and activation.** Recovery proposals retain expected owning generations plus live/recovered fingerprints and explicit choices. Recheck authority and candidate closure under leases and the shared coordinator gate before Replaced capture and final application. Refresh only affected choices after intervening live changes. [Recovery](../../../src/infrastructure/recovery.ts), [protection service](../../../src/infrastructure/protection-service.ts) and [activation decisions](../../../src/infrastructure/recovery-activation.ts) define durable review/apply/backup-required states, original operation identities and staged/published participant identity checks. Cancellation retains an inactive resumable proposal. Failure of the reconciled ZIP is a distinct incomplete follow-up, not permission to repeat or silently roll back an already committed recovery.

**Acceptance work:** races at review/capture/commit, unavailable or moved participants, partial activation, resumed choices, stale replay and failed reconciled ZIP.

## TECH-08

**References and item scope.** Candidate validation in [workspace domain](../../../src/domain/workspace.ts), [WorkspaceApplication](../../../src/application/workspace.ts) and [RecoveryStorage](../../../src/infrastructure/recovery.ts) operates on the resulting complete same-universe state. Current and retained reference closure constrains removal. Unknown/inactive project evidence is not proof that a universe object is unreferenced. Deletion must validate or explicitly resolve affected references and retain required historical objects.

Chapter-only restore changes selected chapter text/formatting/dates/accepted chapter-owned associations, leaving canonical linked events and their dates/content untouched. Character/event restore does not blanket-replace the pinned universe: validate the selected object and minimally required dependencies against current authority; offer the approved missing-reference restore/replacement/removal choices where allowed, otherwise block application. Birth/background/affiliation and result-link invariants remain binding. A character-sheet affiliation does not become a timeline event. Capture Replaced before any accepted replacement.

**Acceptance work:** partial scopes, same-universe/foreign references, inactive projects, birth/depiction/result-link dependencies, retained assets and unchanged unselected records.

## TECH-09

**Immutable identity and reclamation.** [Protection schemas](../../../src/application/contracts/protection.ts) define complete revision manifests, captured units and object refs (SHA-256 plus decimal byte length). [RevisionStorage](../../../src/infrastructure/revisions.ts) resolves full immutable manifests without replay. [Captured-state validation](../../../src/infrastructure/captured-state.ts) checks hashes, paths, matched pairs, catalog identity and closure. Current work, retained revisions/checkpoints, open capture/export pins, pending proposals/jobs and uncertain archives are reclamation roots. Replaced revisions follow the same reachability/time rules; do not invent an eternal exemption or minimum revision count. Revalidate deletion under serialization; eligibility does not promise immediate physical reclamation.

**Acceptance work:** shared immutable versions, pending old captures, partial deletion/restart, current/retained cross-unit references and one-ZIP recovery after original-store loss.

## TECH-10

**Archive discovery and protection.** [ArchiveStorage](../../../src/infrastructure/archives.ts) uses versioned archive records with owner, digest, real capture/completion timestamps, known locations and filesystem identity evidence. Validate complete contents before state valid. Moved/offline/uncertain locations remain conservative protection evidence; a filename or configured destination alone does not prove identity or disappearance. Automatic and manual deletion protect the newest ten valid successful archives per owner, or all if fewer; preserve the durable registry order for equal capture timestamps rather than inventing a new wall-clock or filename order. Failed/partial archives do not fill that set. Retention uses elapsed real age and positive day settings; cleanup rechecks protected sets before removal.

**Acceptance work:** moves, renamed/duplicate/offline destinations, fallback locations, tied timestamps, discovery uncertainty, protected manual deletion and interrupted cleanup.

## TECH-11

**Catalog engine and platform proof.** The selected application adapter uses built-in node:sqlite behind ports, a dedicated owning-root database directory, application/user/feature version validation, foreign keys, rollback-journal DELETE, synchronous EXTRA and validated snapshots. Exact DDL and migrations live in [universe DDL](../../../src/infrastructure/universe-ddl.ts) and [workspace storage](../../../src/infrastructure/workspace-storage.ts). [Confined filesystem contract](../../../native/confined-fs/README.md) defines platform-specific relative-I/O/identity/flush guarantees. Windows NTFS and macOS sources are present; they are not compiled or accepted on this Linux machine.

**Acceptance work:** installed engine/binding/ABI, migrations, locking, supported filesystems, flush/interruption behavior and every target architecture. Keep BUILD-25/VERIFY-04/09 open.

## TECH-12

**Runtime integration and delivery.** [package-lock](../../../package-lock.json), [Forge configuration](../../../forge.config.mts), [renderer configuration](../../../webpack.renderer.config.ts), source process boundaries and the [bundled runtime handoff](../../implementation-artifacts/bundled-runtime-handoff.json) record consuming versions/resources. Use the approved Electron/TypeScript/React/Lexical stack, application-owned MD/TXT and bundled LibreOffice DOCX/PDF conversion. Conversion uses private profiles/staging, bounded process lifecycle and safe cancellation; [converter process](../../../src/infrastructure/converter-process.ts) and [exports](../../../src/infrastructure/exports.ts) specify those boundaries. Installed fonts/resources/notices belong to the produced app, not an assumed separate office installation.

**Acceptance work:** actual installers, bundled runtime/resources/licenses/fonts, typography/Unicode/rendered DOCX/PDF fidelity, accessibility, performance corpus/budgets and platform matrix. Existing local Forge/unit/desktop checks are useful scoped evidence, not installed acceptance of all platforms.

## TECH-13

**Catalog-only export.** [exportSaved](../../../src/infrastructure/exports.ts) consumes a validated captured owner/root/generation cut and emits one SQLite catalog with writingtool_export_metadata (schemaVersion, sourceKind, ownerId, rootId, generation, capturedAt, scope, dependencyNotice, externalDependencies). Verify SQLite integrity/metadata/ownership against that captured unit. Metadata truthfully describes external JSON/WRT/formatting/images/history dependencies; this artifact is not independent recovery and does not activate a live authority. Native Save As rejects live-source/alias destinations and preserves expected prior destination bytes; publish a verified staged output atomically. Reconciliation uses the original durable export capture/destination proof; cancellation is available only before the publication boundary.

**Acceptance work:** both source kinds, metadata/dependency/schema compatibility, matched captured generation, source alias/overwrite rejection, cancellation, corrupt/partial output, original-cut retry and installed SQLite interoperability. No manuscript converter or later story is a dependency of catalog export.

## Platform access and release constraints

| Target | Planning requirement | Access/evidence at this checkpoint |
|---|---|---|
| Windows 10/11 x64 | .exe; native relative I/O/NTFS durability; bundled runtime/menu integration | Hardware/VM/tester access unconfirmed; installed acceptance blocked |
| macOS 13+ Intel | .dmg; matching native ABI/resources; bundled runtime/menu integration | Access unconfirmed; installed acceptance blocked |
| macOS 13+ Apple Silicon | Same guarantees on arm64 | Access unconfirmed; installed acceptance blocked |
| Ubuntu 22.04+ / Debian 12+ x64 | .deb; native/resources/desktop integration | Target-version installed evidence absent |
| Pop!_OS / Zorin / Mint x64 | Test each named distribution/version separately | Local /etc/os-release identifies Zorin OS 18.1; this is not installed acceptance of any distribution |

The platform specification is sufficient to plan implementation and test work. Obtaining test access and passing these checks remain DEC-10/BUILD-24/25/VERIFY-09; they are not hidden prerequisites of creating a calendar, drafting a character or completing PLAN-05. The DEC-11 baseline/growth corpus and ≥95%-of-runs budgets remain VERIFY-10 and cannot be accepted from small integration fixtures.
