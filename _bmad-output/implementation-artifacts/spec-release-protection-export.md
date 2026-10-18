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
