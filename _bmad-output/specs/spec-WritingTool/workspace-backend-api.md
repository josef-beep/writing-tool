---
status: implemented-unverified
contractVersion: 1
updated: 2026-10-18
---
# Workspace backend integration map

This is the consuming contract for the release coding pass. Source inspection only; no test, lint, typecheck, build, smoke, package or runtime probe has run. Story/spec status remains in progress. Existing project/universe methods remain available.

## Renderer entry point

`window.writingTool.workspace(command: WorkspaceCommand): Promise<WorkspaceResult>` is the only new public bridge method. Import its types from `src/application/contracts/workspace.ts`. Preload creates the protocol/version/request UUID; renderers provide no native paths, SQL, IPC channel or executable command. Main authenticates the owning main frame, owns selectors/image decoding, and forwards typed commands to the existing utility authority. There are at most 32 transport requests in flight, not a record/content limit. The main workspace gate serializes context transitions and mutations. Utility operations are synchronous and never overlap on the live authorities.

| Command | Exact additional keys | Successful value |
|---|---|---|
| `workspace.query` | none | `snapshot` |
| `workspace.mutate` | `input: WorkspaceMutation` | `receipt` and the resulting `snapshot` |
| `workspace.reconcile` | `operationId: UUID` | original `receipt`, or null after verified noncommit; current `snapshot` |
| `workspace.asset.import` | `owner`, `operationId`, `expectedUnitGeneration` | native image chooser; unchanged managed bytes in `asset`, committed `receipt`, current `snapshot` |
| `workspace.asset.read` | `owner`, `assetId` | display-safe `{id,sha256,mediaType,base64}` in `asset` |
| `settings.get` | none | current `settings` |
| `settings.save` | `expectedRecordVersion`, `values: AppSettings` | saved `settings` |
| `settings.import` | none | native JSON chooser; atomic `settings`, unknown-field `warnings` |
| `settings.export` | none | native Save As; complete exported `settings`, actual `destination` |
| `settings.select-backup` | none | native directory chooser; saved `settings` and actual `destination` |

`owner` is `{kind:'project'|'universe',id:UUID}`. Images belong to a universe. PNG/JPEG/WebP content is decoded by Electron in main; the original bytes are preserved. Repeated same-hash/media imports reuse their canonical managed ID. Render images with aspect-preserving contain/fit. Import failure leaves profile references unchanged. A profile edit subsequently selects the returned `ManagedImage` reference.

Every result has `{protocolVersion:1,requestId,command,status}`. An `ok` result has all six additional keys: `snapshot`, `receipt`, `settings`, `warnings`, `asset`, `destination`. Unused values are null, except warnings is always an array. `snapshot` is exactly `{project:WorkspaceUnitSnapshot|null,universe:WorkspaceUnitSnapshot|null}`. Settings responses use a null/null snapshot and are independent of writing-root failures. A canceled native chooser has only the common result keys. An error additionally has `code`, `message`, `outcome:'not-committed'|'committed'|'unknown'`, `retry:'same-operation'|'new-request'|'after-recovery'|'not-retryable'`, `issues:[{field,message}]`. Closed nested validators check records, settings, assets, owner/generation identities and receipt correlation.

Unknown workspace operations retain the original operation/request and native import bytes in main, block context changes/native shutdown, and must use `workspace.reconcile`. A transport timeout does not authorize a replacement operation. The client resets on reconciliation while retaining the same utility authority; after utility death it reopens the remembered exact project/universe locations before reconciliation. Reopen dispatches durable journals before activation. After whole-app restart, open the original roots before reconciling a retained operation UUID. Settings publication uncertainty uses `settings.get` read-back and the returned record version before a new save; it does not block unrelated writing-root recovery.

## Mutation and acknowledgment

`WorkspaceMutation` is exactly `{operationId,submittedEditorRevision,units}`. Revision and all generations/whole-number quantities are canonical decimal strings. `units` contains the active project and/or its one authoritative universe, each exactly `{owner,expectedUnitGeneration,changes}`. No per-unit object-count cap exists.

A put is exactly `{action:'put',record:WorkspaceRecord,expectedRecordVersion:UUID|null,manuscript:string|null}`. Initialize a new chapter form with wordTarget `2500`; explicit null clears it. New records use permanent IDs generated once by the editor and `expectedRecordVersion:null`; existing records use the saved version. The input envelope has a valid UUID version placeholder; the authority issues the committed version. Keep the entire original request unchanged for retry. Nonchapter manuscript is null; existing chapters may use null to retain saved text; a new chapter supplies LF text. A delete is `{action:'delete',id,expectedRecordVersion}`. Deletes create catalog tombstones and retain category/history bytes. Calendar/type deletion and type rename/definition changes are not exposed product actions.

The authority validates the complete candidate closure before publication, including same-universe/project references and the decision graph. It assigns permanent story/chapter creation sequences, automatic E/D codes and counters, appends new/redated records to destination groups, normalizes blank military rows/answered waivers, synchronizes canonical births, corrects inverted chapter ends and computes matched WRT/formatting hashes/lengths. New records with custom event/decision spellings still consume one issued default number. Empty new code requests allocation; empty existing codes reject. Initial Personal/Story types are added in the first universe content mutation. `BUILTIN_DECISION_TYPES` supplies the creation definitions; custom types use `builtin:null` and maker-optional default in the form. `Universe Events` is reserved.

A universe calendar change retains prior immutable configurations and anchor, converts the current dated closure with exact elapsed arithmetic, and may therefore add the active project as a coordinated participant. A flagged restored chapter retains its old association until an explicit put clears `calendarUpdateRequired`; that action derives its new display metadata from preserved elapsed positions. No chapter operation moves an event. Birth clearing/deletion rejects until all affected current links are resolved in the same candidate. Universe record removal also checks known inactive project references through separate coordinator bindings; unavailable/unfinished project evidence blocks removal.

A receipt is exactly `{protocolVersion:1,operationId,submittedEditorRevision,units:[{owner,unitGeneration,records:[{id,recordVersion,deleted}]}]}`. Derived records are included. Each affected owner advances one generation. A successful acknowledgment covers only its echoed submitted editor revision; newer editor changes stay dirty. Same operation/digest returns the durable original receipt and never reallocates IDs/codes/versions. Same operation/different digest rejects. A later-generation retry receipt describes the earlier commit, not the current latest object version.

## Closed entity and manuscript schemas

`src/domain/workspace.ts` is the exact consuming schema: `WorkspaceDataMap`, `WorkspaceRecordType`, `WorkspaceRecordOf<K>`, the discriminated `WorkspaceRecord` union, `Owner`, `ManagedImage`, `Maker`, `CharacterData`, `FactionData`, `ViewData` and `MilitaryUnit`. All persisted envelopes are exactly `{schemaVersion:1,recordType,id,owner,universeId,recordVersion,data}`. Every data member is closed; null represents unset. All prose is Unicode scalar text without global normalization. Profile image references are exactly `{id,sha256,mediaType}`; paths never appear in them.

| Record type | Owner | Category |
|---|---|---|
| story | project | stories |
| volume | project | volumes |
| chapter | project | chapters |
| plot | project | plots |
| decision-context | project | decision-context |
| calendar | universe | calendars |
| event | universe | events |
| decision | universe | decisions |
| decision-type | universe | decision-types |
| character | universe | characters |
| faction | universe | factions |
| affiliation | universe | affiliations |
| view | universe | views |

Each category contains actual `<record-id>.json`; chapters also contain `<chapter-id>.wrt`. `ChapterFormatting` and `Paragraph` from `src/domain/manuscript.ts` match `chapter-format.schema.json`. Formatting is embedded as `chapter.data.formatting`. Marks use disjoint/coalesced half-open Unicode-scalar ranges. Text/paragraphs must match exactly, including the empty paragraph after a trailing LF. Scene breaks contain literal `***`. Fonts/sizes are absent. `scalarOffsetFromUtf16`/`utf16OffsetFromScalar` support the later editor adapter. The authority replaces formatting identity/hash/length members; the editor supplies paragraph/mark data.

`CalendarData`, `CalendarConfiguration`, `CalendarElement`, `DatePosition`, `BirthComponents` and exact validators/normalizers are in `src/domain/calendar.ts`. Date positions preserve `{calendarVersion,year,day}`; use `convertDate` before displaying old-version dates in a current-format view. `elapsedPosition`, `compareDates`, `floorDivide`, `birthPosition`, `displayDate`, `correctChapterRange`, `normalizeCalendarData` are pure. Anchor is actual day 1 of the first entered year and is immutable. Existing configuration IDs/content cannot be rewritten or removed; append a new configuration and set currentVersion. Save corrects actual/target totals. Years and counts have no fixed-width limits.

Pure workspace selectors include `orderedChapters`, `orderedPlots`, `orderedDated`, `affiliationHistory`, `decisionResolved`, `visibleRecord`, `writingContextDecisions`, `characterCompleteness`, `factionCompleteness`. Call filtering consistently for timeline/tree/context/lookup; resolution derives from unfiltered outgoing links. Views permit one synchronized per-universe filter record. No maker is `{kind:'none'}` in filter choices. Empty maker/category arrays show all. Character prompts are `CHARACTER_PROMPTS`; exact names-only personality choices are `PERSONALITY_LABELS` from `personality.ts`. Unicode code comparison is `canonicalCodeKey`/`trimmedCode` using pinned Unicode 17 C/F fold and White_Space data in `code-fold.ts`; canonical normalization is pinned too in `unicode-normalization.ts`/`unicode-normalization-data.ts`, including canonical decompositions, combining classes, full composition exclusions and algorithmic Hangul. The official Unicode license is retained in `resources/licenses/Unicode-LICENSE.txt`; conformance execution remains deferred.

## Settings schema

`AppSettings`, `PanelLayout`, `SETTINGS_ID` and `validAppSettings` are exported by `application/contracts/workspace.ts`. The authoritative file is `<userData>/settings/b5a83e04-1e76-4c44-a17d-9ebd3ae09b2f.json`. Whole-minute defaults are autosave `5`, revisions `10`, backup `10`; retention whole days `30`. Initial theme is `dark`; writing display is `system-ui, sans-serif`, `16` px. `theme` supports light/dark/system; the presentation subscribes to OS theme changes. Gray writing background is not configurable. Panels are an app-wide array of the exact typed placements/visibility/dimensions/monitor/position fields; empty uses the presentation's default layout.

`settings.save` validates every known field and the optimistic equality version before atomic durable replacement. A coordinator write gate serializes app-wide settings publications across hosts. Import merges known supplied fields into current settings before one validation/commit, retains missing fields, ignores unknown fields with warnings, and rejects any invalid known field. A configured unavailable backup destination remains valid. Export/import includes layout/font preferences as well as the required scheduling/theme/retention values. Renderer localStorage is not authoritative.

## Owning catalog and journal formats

The original `database/catalog.sqlite`, `database/lease.sqlite`, profile/metadata APIs and root bindings remain authoritative. No second payload connection or category database is opened. Legacy profile-only query/open is read-only with respect to workspace feature state. The first already-validated content mutation installs named feature `workspace-content` version 1 and category directories through an explicit conservative transaction. Unknown/partial/newer feature state rejects writes. Existing creation/profile receipts and workspace receipts share the same complete unit-generation sequence.

The exact feature DDL is exported as `WORKSPACE_DDL` in `src/infrastructure/workspace-storage.ts`. It adds `workspace_features`, `workspace_records`, `workspace_files`, `workspace_relationships`, `workspace_codes`, `workspace_counters`, `workspace_assets`, `workspace_versions`. The original `records` table continues indexing the profile/metadata only. Workspace records index id/type/version/relative path/hash/tombstone/deletion-version. Files index record/version/role/hash/byte length. Relationships index source/relation/target/universe. Code keys use binary uniqueness. Exact high-water counters cover event, decision, story and chapter; deletion does not recycle sequences. Asset rows index immutable unchanged managed images; immutable record JSON/WRT is indexed under `history/objects/<recordVersion>/<category>/<id>.*`.

`WorkspaceJournal` is exported from `workspace-storage.ts`. Its exact closed keys are schemaVersion, scope, command, owner, rootId, universeId, operationId, requestDigest, request, expectedGeneration, targetGeneration, fencingToken, coordinatorId, before, after, files, receipt, planDigest. Scope is single-unit/coordinated; command is `workspace.publish`; schemaVersion is 1. The original closed `WorkspaceOperationRequest` is retained as request and rehashed against requestDigest on recovery. Before/after contain closed typed complete catalog-index plans. Each file contains relativePath, before (base64 or null), after (base64), beforeHash (or null), afterHash, beforeByteLength (or null), byteLength (after length). `planDigest` hashes canonical JSON of the other members. Paths must derive from typed category/WRT/immutable-version/image roles; journals cannot target discovery, profiles, catalogs or leases. The complete journal is flushed under `database/operations/<operationId>/journal.json` before publication. Finalized/aborted markers contain `{schemaVersion:1,operationId,requestDigest}`. Before/after evidence and committed receipts are retained; there is no arbitrary cleanup of them.

Normal publication revalidates lease/session/generation, flushes matched files, applies all typed indexes/counters plus one original-catalog receipt transaction, verifies and durably finalizes before acknowledgment. Recovery dispatches legacy profile saves separately from workspace publication. Unknown commands, missing bytes, unexpected hashes, identities or generations preserve evidence and block. Verified prior-generation finalized operations never replay old bytes. An aborted identical retry adopts only the current operational fence and retains its original content/version/code/receipt plan.

`src/infrastructure/workspace-coordinator.ts` owns `<userData>/database/workspace-coordinator.sqlite`, application id 1465140302/version 1. DDL is in its constructor: coordinator_identity(singleton,id), coordinator_operations(operationId,requestDigest,state,record), coordinator_bindings(rootId,ownerKind,ownerId,universeId,basePath). The closed operation record stores schemaVersion, operationId, requestDigest, participants, receipt, state. Each participant stores owner, rootId, expectedGeneration, targetGeneration, fencingToken, planDigest. States are preparing/prepared/commit/complete/aborted. A durable commit decision is the sole multi-root decision. Participant journals identify that permanent coordinator UUID. Recovery reuses active authorities and acquires absent existing leases with zero busy wait, consults the original decision and finishes all participants or blocks. Missing/incompatible original coordinator evidence is never treated as permission to undo/adopt a new coordinator.

## Trusted history/archive/export seams

Application ports are in `src/application/contracts/workspace-ports.ts`: `WorkspaceUnitPort`, `WorkspaceCommit`, `WorkspaceCapture`, `WorkspacePublicationPort`. `ProjectApplication.workspaceAuthority()` and `UniverseApplication.workspaceAuthority()` return the existing active owning-unit port. `WorkspaceApplication.capture(owner)` returns a complete synchronous pin: snapshot plus immutable copied `{relativePath,base64,sha256}` bytes. Capture includes discovery/profile/metadata, all category files, matched WRT, managed images, all indexed immutable versions and a validated `VACUUM INTO` SQLite snapshot at `database/catalog.sqlite`. It excludes lease files, hot rollback files and operation staging. Operational capture temp directories remain retained for later managed cleanup.

`WorkspaceUnitPort.commit(operationId,digest,fullPlan,receipt,request)` is a trusted host-only full-candidate publication seam. `request` is the closed `WorkspaceOperationRequest` union, including a trusted `workspace.restore` variant with typed owner/full-plan entries; digest is SHA-256 of its canonical JSON. `fullPlan` is exactly `{expectedGeneration,records,manuscripts,counters,assets}`. It preserves supplied historical record versions and can reactivate a tombstoned identity; unlike ordinary editor mutate, it performs no creation-sequence/order/birth rewriting. Later restore adapters must validate full cross-root candidate semantics, freshness, Replaced capture, conflicts and dependency closure before calling this seam. Single-owner commit validates typed file/index plans and universe semantics; project external references must be pinned/validated by its consuming application. Multi-root restore uses `WorkspacePublicationPort.commit` with the same owner/full-plan list, aggregate receipt and original typed request. Do not implement restore as successive independent single-owner saves.

Later revision/ZIP/restore/retention/export/scheduler/presentation adapters remain separate release slices. Backend coding is provisional. Platform file primitives currently deliberately support the existing Linux anchored-I/O implementation; Windows/macOS remain blocked pending their adapter delivery/verification. Catalog export metadata, archive manifests, protection registry and conversion/font resources are not claimed by this backend slice. No stories/gates were marked done or verified.
