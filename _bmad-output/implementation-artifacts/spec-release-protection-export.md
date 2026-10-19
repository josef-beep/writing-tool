---
title: 'Release coding pass — revisions, complete backups, recovery and exports'
type: feature
created: 2026-10-18
status: in-progress
route: dispatch
baseline_commit: a2c200bfd12c56be077e4c9afed731f42cba8eb3
context:
  - /home/jo/Documents/writing-tool/_bmad-output/implementation-artifacts/workspace-presentation-api.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/workspace-backend-api.md
  - /home/jo/Documents/writing-tool/_bmad-output/implementation-artifacts/protection-export-map.md
  - /home/jo/Documents/writing-tool/_bmad-output/implementation-artifacts/bundled-runtime-handoff.json
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/workspace-data-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/requirements.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/publication-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/coordination-contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md
---

<frozen-after-approval reason="Entire approved release; explicit user instruction finishes all coding before tests">

## Intent

Finish all remaining protection/export/lifecycle code for approved Stories 5.1–5.10 and 6.1–6.2 and integrate independent scheduling, required normal-close operations and actual bundled runtime/font packaging. Reuse the real workspace domain/storage/bridge and presentation from the preceding coding slices. Complete working pipelines and connected UI; do not substitute TODOs, mock results, raw JSON forms or unimplemented commands for difficult recovery paths.

## Boundaries & Constraints

Respect every adopted recovery/capture/reference/authority/retention/close/export guarantee. A revision is a complete no-replay manifest of immutable saved content and exact historical universe dependencies/images/type/link/code/calendar state. Capture only after actual pending text/format acknowledgment. Immutable content is reused within owning stores. Replaced capture failure blocks restore. Chapter-only restore never changes canonical events. Cross-root confirmed changes use one durable coordinator decision and freshness-checked participant publication; no independent partial saves.

Independent complete ZIPs contain consistent catalogs, actual category JSON/WRT/images/history/manifest closure and recover without original roots/coordinator/other ZIPs. Recovery must establish one matching universe authority; manual identity/content conflicts offer keep-live/use-recovered/edit-combined. Resolve missing references through restore/replacement/removal before activation; cancellation retains proposals and live data unchanged. Recheck freshness, re-review affected conflicts only, preserve unaffected choices. Flag restored calendar mismatches and explicitly update display without moving elapsed positions.

Keep user-selected live roots and backup destinations independent. Independent 5/10/10-minute defaults and 30-day retention remain. Ten newest valid ZIPs per owner plus all active/retained references are protected even against manual deletion; uncertain/offline archives block unsafe deletion. Normal-close required save/revision/backup failure keeps app open with retry/location/cancel-closing. Use the approved application-root then user-data fallback and next-launch actual-location notice.

Manuscript exports include ordered titles and matched manuscript only; DOCX/PDF use actual bundled LibreOffice with A4/2.54cm/12-point-serif/1.5 spacing/chapter pagination, MD/TXT use application serializers, all preserve literal scene marker. Database export is one truthful catalog-only SQLite snapshot with the exact dependency notice. Save As/overwrite/cancel/failure preserves previous output; success follows validation/publication only.

Do not run tests, typecheck, lint, smoke, builds, packaging, LibreOffice or other runtime probes during this coding pass. Installing/fetching/extracting required pinned dependencies/assets is implementation setup; source inspection is permitted. Preserve existing generated `.webpack` changes. Do not mark stories done or claim test/platform acceptance.

## I/O & Edge-Case Matrix

| Scenario | Input | Expected result | Error |
|---|---|---|---|
| Capture | Pending formatted writing + shared context | Complete immutable saved-generation revision/ZIP | No partial success |
| Item/project restore | Historical state with live changes | Protective Replaced, manual conflicts, confirmed fresh atomic result | Retain proposals and live state |
| ZIP disaster recovery | One archive, sources absent | Validate closure/safe paths and establish one authority | Unsupported/foreign/corrupt never overwrites |
| Scheduling/close | Due jobs/sleep/failure/canceled location | Single overdue nonoverlap; required close operations/fallback | Retry/location/cancel closing |
| Retention | Old revisions/archives, shared references | Oldest eligible elapsed-time removal only | Protect newest ten, retained/current and uncertain evidence |
| Export | Story selection or one catalog | Validated chosen destination and truthful saved-path actions | Previous output preserved |

</frozen-after-approval>

## Code Map

- `src/domain/*`, `src/application/workspace.ts`, workspace backend API map: typed snapshots/records/manuscript/versions and authoritative publication/capture ports. Inspect actual exports first.
- New `src/application/protection.ts`, `contracts/protection.ts`: capture/history/archive/recovery/export command/result schemas, errors, progress, supported cancellation, schedules and source/destination validation.
- New `src/infrastructure/revisions.ts`, `archives.ts`, `recovery.ts`, `exports.ts` (or cohesive modules): immutable store/manifests, ZIP streaming, protected archive registry, conflict proposals/freshness/references, safe publication, MD/TXT/FODT serializers and bundled LibreOffice subprocess lifecycle.
- `src/desktop/*`: purpose-bound native Save As/folder/archive selection, operation capabilities rather than renderer paths, open completed outputs, shutdown draining, system resume and recovery of unfinished operations.
- `src/presentation/workspace/*`: center revision comparison/history, recovery/conflict/combined-edit/summary, backup/progress, exports and retry/results; same pending-work guards and Back to writing context.
- `forge.config.mts`, scripts/resources/package dependencies: pinned real platform runtimes/fonts/notices, reproducible asset setup, supported installers, offline application conversion. Parent has staged official Linux LibreOffice 26.8.1 resources and all four platform release metadata for this slice; use the resource handoff in implementation notes once added.

## Tasks & Acceptance

- [ ] Publish concrete versioned manifest/object/archive/coordinator/recovery/export schemas and closure/freshness/retention algorithms before storage paths.
- [ ] Complete immutable revision capture/inspect/item restore/Replaced protection and explicit calendar-update handling.
- [ ] Complete standalone/project ZIP capture, validation and independent disaster recovery with safe extraction and single-authority reconciliation.
- [ ] Complete manual conflicts, combined editor, missing-reference choices, resumable cancellation, confirmation/freshness and reconciled ZIP publication.
- [ ] Complete independent nonoverlapping autosave/revision/backup schedules and safe retention/manual deletion across moved/offline known destinations.
- [ ] Complete required normal-close save/revision/backup, destination prompts/fallback/retry/cancel and actual-folder next-launch notice.
- [ ] Complete whole/selected manuscript serializers and bundled conversion, catalog-only SQLite capture/metadata/safety, atomic destination publication and success/open actions.
- [ ] Complete real resources, pins/notices/setup and installer code; update README and release ledger with implemented/unverified state and actual missing parts.

Given a complete retained capture, when inspected/restored, then exact captured content is resolved without current substitution and protective/freshness/reference guarantees hold by design. Given cancellation, invalid archive, failed capture/conversion or unsupported state, when handling the operation, then no previous live/output state is destroyed or falsely reported complete. Given a protected archive or active/retained dependency, when cleanup is requested, then deletion is refused.

## Implementation Notes

All scope and routine design are approved. Execute this slice only after the preceding backend/presentation code is available, using their exact API map. All validation is deferred until all release coding is finished. Do not stop after one protection story: this slice must connect every protection/export path in the approved scope. Separate runtime/hardware/platform proof remains the later phase.

## Verification

Explicitly deferred. Source inspection only; no compile/lint/runtime/test/build/package execution until the full coding pass is complete.

Resource handoff: the official Linux archive has been downloaded and checksum-checked against its official release metadata; all 42 .deb payloads were extracted without installation into `/tmp/writingtool-libreoffice-sysroot`. Bundle `/tmp/writingtool-libreoffice-sysroot/opt/libreoffice26.8` as the Linux resource tree, retaining LICENSE/NOTICE and fonts. The handoff JSON pins all four platform URLs/sizes/SHA-256 values. Neither LibreOffice nor any export has been executed. Create reproducible native-platform download/extraction/setup scripts and package resources; do not store the large runtime binaries in Git. Include the pinned upstream corresponding-source location and distribution notices.

Dependency metadata retrieved from npm on 2026-10-18: `fflate` 0.8.3 for ZIP streaming, `@electron-forge/maker-dmg` 8.0.1 to match existing Forge 8.0.1. Use exact pins and preserve the existing stack/lockfile; no global npm upgrade. Official sources: https://github.com/101arrowz/fflate and https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html . No integration acceptance is claimed by metadata retrieval.

### Continuation source inspection — 2026-10-18

Intent gaps: none beyond already documented platform-test access, which does not block coding. This pass edits source and resource setup only; it does not migrate or delete user data, launch the app or publish externally. Footprint includes the typed protection port, utility-host dispatch, authenticated main/preload transport, connected center surfaces, resource setup and Forge configuration. Keep the presentation native/font/panel bridge delivered by the preceding slice.

The actual `WorkspaceApplication.capture(owner)` delegates to the active unit synchronously. Unit captures include discovery, legacy profile/metadata, current records/manuscripts/assets, indexed immutable versions and a checked `VACUUM INTO` catalog. They do not yet include protection manifests. Add the retained protection closure explicitly to complete ZIPs. The active utility host currently processes synchronous authority operations in one event callback; asynchronous compression/conversion must hold immutable pins and serialize later publication rather than interleave mutable authority work.

For independent activation, regenerate the owning lease database with the captured owner/root identity and rebind the catalog's one `root_locations` record plus a project's `universe_locations` record. Preserve the captured creation receipt and complete committed-operation generation chain: both project and universe reopen validate them. Captures intentionally exclude operation journals and active lease files; activation must not require the original coordinator. Do not call an extracted catalog independently recoverable until its exact schemas, receipt chain, payload hashes, chapter pairs and history/reference closure validate. Existing `FileProjectStore.snapshot()` checks an exact table list, so export metadata belongs only in the exported copy, and any deliberate live schema extension must update its compatibility registry.

The trusted restore request is already a closed `workspace.restore` union in `contracts/workspace-ports.ts` and `WorkspaceStore.validOperationRequest`. Expose a trusted application method with complete candidate/reference validation, expected generations, immutable asset validation, monotonic counters and aggregate receipt creation rather than reaching private authority fields from infrastructure. Use one coordinator commit for two participants. Restored calendar flags or normalization that change captured bytes need fresh record versions and a matching chapter formatting version; immutable historical version bytes must never be rewritten.

Native main tracks project/universe locations and unresolved operations. Protection mutations must join that same gate and shutdown blocking/reconciliation. Normal-close capture belongs after the renderer's required pending-save acknowledgment and before `requestNormalClose` releases either authority. Keep unknown outcomes tied to their original operation ID. Choose/read/write/open native destinations through purpose-bound main-owned capabilities; the renderer supplies neither paths nor executables.

### Lifecycle source audit — 2026-10-19

Continue the adopted coding-only pass without execution checks. Concrete gaps identified in Story 5.9/5.8 integration: further editor/header/floating-panel input can arrive after final save acknowledgement while closing archives are written; native drain failure has no renderer-unlock notification; a canceled scheduled backup is silently dropped instead of reporting its incomplete attempt with retry. Implement an input lock retained through native drain, an internal purpose-bound abort notification that releases it on canceled/failed close, reactive blocking of detached controls and saved-work retries. Preserve pending edits, successful revision/output evidence, independent timers and original unknown operation IDs. Canonical scope is normal application close; no new close trigger is inferred for project navigation. Generated .webpack files observed changed at continuation start are external running-app artifacts and must be preserved.

### Implemented lifecycle corrections — 2026-10-19

- Shell now holds an input/command lock from the final saved-work guard through native close. Workspace navigation, layout writes, autosave and floating actions respect it. Native abort notification releases it; after a partially released authority, renderer current-root queries finish before input is reenabled. Failure to refresh exposes the chooser and saved-work reopening notice instead of an editable released root.
- Header/panel blocked state is reactive, covering capture/retry work and each warning/dialog rather than directly mutating a header DOM property. Normal close reports progress in the status bar. Alternate-location actions are shown only for backup failures, including unresolved backup outcomes after Cancel closing.
- Canceled scheduled destination selection is visibly incomplete and retryable. Retries protect newly pending writing/manual drafts. Discard resets a visible manual editor to its committed content, or exits an unsaved new-draft editor, rather than marking edited draft bytes saved. Due revision/backup timers advance separately when actually attempted. Autosave listens for system resume.
- `protectionOperationId` preserves the original operation throughout reconciliation transport errors. Closed result validation now requires an unknown result to name that exact operation; native, utility, host-client and preload fallbacks use the same mapping.
- Native pending-participant metadata survives host success until native output validation, fallback-notice recording and context bookkeeping finish. Cleanup removes durable metadata before dropping in-memory blocking evidence. A failed initial durable job write now reaches the operations-map finally cleanup rather than leaving the service permanently busy.
- Reconciled closing backups reuse the original pending request's close context for alternate-folder cancellation/fallback and idempotent actual-location notice recording before pending metadata is removed.

Source inspection only, including one independent read-only lifecycle trace; no test/typecheck/lint/runtime/build/package commands ran. The focused trace identified missing alternate-location retry and reconciliation fallback-notice completion; both are now addressed in source. Required later execution checks include typing/shortcuts/floating input during close; cancel/retry/drain failure and partial authority release; canceled scheduled destinations; dirty retries/discard; repeated reconciliation transport failures; output/notice/pending-metadata flush failures and initial job-record failure. No story is marked accepted.


### Retention and archive-import source corrections — 2026-10-19

Continued coding-only inspection found automatic retention attempting to remove every revision, including IDs protected by the newly completed archive. Skip protected revisions before deletion and process eligible revision/archive candidates oldest first; preserve uncertain evidence and the existing newest-ten archive floor. This prevents the normal protection refusal from turning a successfully published backup into an unknown outcome.

Workspace catalog capture now uses a private directory under the canonical temporary root and removes it in finally after returning immutable bytes or on failure. New captures no longer accumulate duplicate SQLite catalogs in each writing root; this change does not delete old user-root artifacts. Validation resolves manifests before creating its temporary tree so invalid object closure cannot leak an empty validation directory.

Archive import validates the complete incoming set against staged object bytes, full existing-store catalog readers and existing revision identities before publishing any incoming manifest. Invalid retained members and conflicting duplicate IDs reject the whole input before history publication. Backup creation also validates every retained manifest/catalog included in its closure. Revision resolve/validate accept a staged object reader; ordinary live reads retain the existing hash/length checks. I/O failure during publication remains a recoverable failure; this is not a new cross-store import transaction.

Verification remains deferred. Later checks must exercise successful close/backup with protected revisions; expiry order, newest-ten and offline protection; repeated/simulated-failed captures and temporary cleanup; a valid archive with a corrupt retained catalog or conflicting identity; and valid complete-history import/independent reopening. No test, lint, typecheck, launch, build, native compilation or packaging ran. No story acceptance changed.


### Protection controls, terminal proposals and independent retention — 2026-10-19

Continued the authorized coding-only pass. ProtectionPanel now serializes its own commands with an immediate ref guard, retains unknown original IDs/command context after dismissing an error, disables unrelated controls until original reconciliation and keeps reconciliation buttons visible. Alternate-folder recovery of unknown backups uses the original reconciliation command; it cannot start a replacement backup. Native alternate-folder selection rejects original operations other than backup/apply. Progress initializes with the original reconciliation ID and stays noncancelable until utility progress confirms cancellation is available; cancel/open requests do not overwrite tracked progress. Transport/UI failures are caught and retained. Completed deletion clears stale selected history/archive rows. Conflict selection has an explicit selected ID, so previously reviewed conflicts can be inspected rather than always jumping back to the first unresolved row.

Committed or backup-required recovery choices cannot be edited; canceled proposals must be explicitly resumed before changes/apply. These rules are enforced in RecoveryStorage as well as UI controls. Prepared-output reconciliation returns the applied RecoveryView and refreshes the live workspace, rather than leaving the old Apply screen active. Cancel retains the proposal and returns via the existing workspace guard.

Retention now distinguishes embedded archive history from external live-store dependencies: verified, available, self-contained ZIPs do not pin their local revision index entries forever. Unknown/offline/changed archive evidence still pins the recorded revisions; uncertain/malformed discovery evidence blocks deletion. Explicit retained-manifest references and unapplied/canceled recovery proposal sources/Replaced cuts remain pinned, and immutable objects are not garbage-collected. Revision retention runs after a complete revision as well as backup, so it does not depend on a working backup destination. Eligible entries remain oldest-first, with the newest ten ZIPs protected. Cleanup failure returns typed warnings alongside the successful capture/output and remains visible in panel/status; it does not create an unreconcilable failed-capture loop. Unexpected archive cleanup failures are no longer silently swallowed.

Native recovery/recent-root context synchronization queries both current authorities, validates the project/universe association, clears absent identities and sends the renderer one complete refresh notification after opening/reconciliation. Partial recent-navigation failures refresh context too. A failure updating recents after successful opening is an explicit warning. Post-result native failures retain pending-operation blocking evidence with a typed original-ID unknown result. Renderer current-root queries are batched before changing identity state; a failed refresh exposes saved-root reopening instead of leaving an editor attached to a released authority.

No tests, typecheck, lint, runtime launch, build, package or native compilation ran. Deferred cases: dismissing/retrying unknown outcomes and selecting an alternate folder; duplicate clicks and cancellation ID/phase; reviewed-conflict selection; attempted edits/apply of terminal/canceled proposals; prepared-output apply reconciliation; expiry with available ZIPs, offline/changed copies, pending proposals and referenced manifests; cleanup permission failures preserving successful outputs; partial recent opens, missing current roots and context-refresh failure. Further source audit should cover native-pending metadata publication failures before the first utility job and reconciliation after original-root relocation; these are not verified guarantees.


### Native preparation and moved-participant reconciliation — 2026-10-19

Implemented a no-effects preparation handshake before dispatching mutating protection commands. Native pending metadata records `prepared` before asking the utility to durably record a `ready` job, then durably records `attempted` before posting execution. A failure before dispatch remains actionable even when no ordinary job was started. Reconciliation of a native `prepared` record confirms not-committed, clears its metadata durably and returns a closed, original-ID-correlated reconciliation result. It never claims that a revision/ZIP/export completed. Close retries the actual required capture; scheduled retry keeps a retryable original command; ProtectionPanel clears its unknown lock and offers the original command again. A failed preparation transport is reset before retry. Legacy native pending records without a dispatch field are conservatively treated as attempted; missing legacy job evidence remains unresolved rather than guessed away.

Added strict per-state utility-job validation for ready/started/prepared/complete, exact request identity, expected output digest/path evidence, and completed values. Preparation-only transport fields are main-to-utility only and never persisted in original requests. Conflicting/reused request IDs do not overwrite existing job evidence. Ready jobs replay through the original operation ID after a crash between the dispatch marker and execution. Read-only history/inspection/list requests and cancellation signals no longer create fake uncertain mutation IDs or perpetual job files. Recovery resume is classified as a metadata mutation and gets durable preparation. Main supplies the native pending/proposal inventory without needing a functioning utility host. Read-only workspace query is allowed while an original operation remains unresolved; authoritative readers still enforce their own integrity checks. Passive focus refresh waits while capture/close work is active.

Protection reconciliation now locates unavailable original project/universe folders by exact kind, owner ID and root ID, rejects wrong/canceled selections, durably updates pending locations and waits for the old utility host to exit before reopening relocated authorities. Both project and universe identities are checked again after reopen. A failed/slow authority release keeps the operation pending; repeat attempts still recognize an active authority at the old location. No identity or original operation ID is replaced.

Replayed backup/export destinations are checked against the currently active canonical roots, including roots moved since the original request. Export also excludes user-data. Unknown export reconciliation can choose another purpose-bound Save As destination while retaining the original format/scope/ID; completed original output evidence wins before any new destination is used. Backups retain folder selection and close fallback semantics. Original output conflicts remain blocked and preserved.

Source inspection/editing only. No tests, lint, typecheck, runtime launch, native compilation, build or packaging ran. Deferred fault checks include each native/utility preparation write and lost acknowledgement, crash before/after dispatch, failed cleanup of native metadata, startup legacy records, read failure during recovery, native pending inventory with dead host, same/wrong/canceled/moved root selection, release timeout and repeat retry, root replacement between validation/open, and replay destinations now inside writing roots. Further source work should audit durable pinning of exact export capture bytes across conversion/restart, conversion validation and partial activation after source/destination relocation. These remaining paths and all platform/runtime guarantees are unverified.


### Durable export input and converter lifecycle — 2026-10-19

Implemented private export-capture manifests and content-addressed payloads in user-data, keyed by the original operation ID and exact owner/format/story/chapter selection. Captures retain a complete saved owning-unit cut and matching historical universe/calendar for project chapter order. Their logical closure, record/manuscript pairs and full existing-store catalog readers are validated before conversion. Shared capture resolve/validate helpers now serve revisions, archives and export pins. A replay loads the original capture instead of querying newer live text, formatting, calendar order or catalog bytes. Changing the native output capability does not change the pinned export scope. Catalog-only exports still contain only the selected catalog, with its original capture timestamp/generation and genuine external dependency notice; the private validation pin does not widen exported scope or add a user-visible revision.

Export-cache publication and reclamation share the coordinator's cross-host gate. Known original export failure/cancellation is durably recorded as an aborted job before its cache can be reclaimed. Publication/completion ambiguity retains the pin. Replaying incomplete operations keeps their capture and prepared output evidence. Terminal cleanup checks every other pin and preserves shared immutable objects; it reclaims orphaned unreferenced payloads too. Cleanup interruption can repeat against a terminal pin, and malformed/ambiguous evidence blocks reclamation. Startup retries cleanup only for export jobs with validated terminal evidence. Cleanup failure is a warning beside a completed output rather than an output failure. Definite noncompletion uses the original correlated reconciliation marker and prompts/retries an actual export/capture; it is never reported as saved output.

Completion jobs now retain their output destination/digest proof. Reconciliation checks a completed output against that original digest instead of trusting whatever bytes happen to occupy its path later. Native acknowledgement also compares the file against durable publication proof before fallback-notice completion and Open file/Open folder registration. Legacy completed-output jobs without sufficient digest evidence are preserved and remain unresolved rather than guessed valid.

Converter lifecycle corrections: cancellation/timeout initiates one process-tree termination attempt, a timeout stays failed even if the converter subsequently exits zero, Windows termination helper failure is handled and runtime windows are hidden, and stderr is bounded. Existing output is preserved on failure/cancel. FODT generation preserves title spaces/tabs/explicit line breaks, computes indentation with exact integer arithmetic and rejects characters that XML cannot represent instead of silently dropping saved text; Markdown/TXT retain their plain-text path. DOCX comparison now includes self-closing empty paragraphs, tabs and explicit line breaks while excluding layout-only page/column breaks. Both self-closing and paired empty break tokens are supported.

No test, typecheck, lint, app/LibreOffice launch, native compilation, build or packaging ran. Source-only deferred cases include later edits/calendar reordering after a lost export acknowledgement; original saved text/format/order and catalog capture timestamps after restart/new Save As; missing/corrupt pins and shared objects; every pin/job/completion/cleanup interruption; cross-host cache creation/reclamation; canceled/failed conversion and stale prepared output; changed outputs before native acknowledgement; empty paragraphs/titles, repeated spaces/tabs, soft breaks, astral Unicode, headings/marks/indents and literal scene breaks; timeout followed by zero exit and process-tree termination on all platforms. DOCX validation checks content/package closure; PDF validation remains structural only. Rendered DOCX/PDF content/style fidelity, physical durability and all release/platform acceptance remain open. Next source-audit focus: partially activated recovery roots and relocation of staging/destination paths.
