# WritingTool

WritingTool is a local Electron desktop application. The current release coding pass includes independent project/universe roots, stories/volumes, formatted plain-text manuscripts, fictional calendars, timeline events, character/faction profiles, decisions, revisions, complete ZIP recovery and manuscript/catalog exports. The release features have source implementations, with the final integration pass tracked in the release ledger. Focused Linux regression checks have passed; full story acceptance, export fidelity, performance and the supported-platform matrix remain open.

The gray workspace uses top Project, Universe, Writing, View, Revisions, Backup & Recovery, Export and Settings menus, with a manuscript editor and movable context panels. Source includes pending-edit guards, original-operation reconciliation, complete recovery captures and immutable export captures reused after restart. Native protection preparation distinguishes unsent work from completed output; recovery can locate moved original roots. Cleanup and publication feedback remain separate. Recovery fault cases, export fidelity and platform delivery require the full release verification phase.

## Run locally

Development requires Node.js 22.16+ (verified with 24.19.0), npm, network access for initial dependency/runtime downloads, and a desktop session with Electron's platform libraries. Linux needs a working Chromium sandbox (user namespaces or a correctly installed sandbox helper). Keep the sandbox enabled.

```bash
npm ci
npm run setup:resources
npm start
```

The root postinstall obtains the official Electron runtime even when npm's dependency-script policy skips its dependency postinstall. Resource setup downloads and checksum-verifies the pinned LibreOffice distribution without executing it and stages bundled fonts/notices. DOCX/PDF conversion uses that bundled runtime. In environments with restricted cache writes, use writable npm/runtime cache locations.

Forge start/package hooks invoke `npm run build:native`'s script on the matching host. macOS/Windows development therefore requires the native compiler toolchain, Python and access to the matching Electron headers. Packaging copies the addon outside ASAR; installed users need no compiler. Cross-platform/architecture packaging is refused by this setup. Linux retains its existing descriptor implementation and skips native compilation. The Linux hook and Forge development builds have run. The macOS and Windows native sources still require compilation and installed verification on matching hosts.

**Native storage remains unverified:** Windows directory synchronization now uses a pinned-object writable handle and full native metadata/storage flushing on local NTFS. Unsupported filesystems or unavailable primitives fail before mutation; no weaker flush is substituted. Both macOS and Windows native compilation, loading and actual durability require the deferred platform checks. See the [native adapter contract](native/confined-fs/README.md).

## Universe folders

Creation uses a native directory chooser and requires an existing empty folder. Opening validates the permanent UUID, supported versions, catalog/profile agreement and ownership before changing the active context. Cancellation and failed candidate opens preserve the previous context. An incomplete, unrelated or unsupported store is preserved and refused rather than initialized or overwritten.

A universe owns these paths:

- `writingtool.json`: permanent root discovery identity.
- `profiles/<universe-id>.json`: the versioned name and description.
- `images/`: the managed image root.
- `database/catalog.sqlite`: identity, root binding, relative paths, hashes, versions, generations and durable operation receipts.
- `database/lease.sqlite`: exclusive OS-backed writer ownership.
- `database/operations/<operation-id>/`: durable before/after publication and recovery evidence.
- `.writingtool-creation.json`: the exclusive creation reservation, retained as evidence.

Managed JSON/WRT/binary I/O uses Linux directory handles or the new trusted native adapter so actual operations remain relative to pinned directories. Native implementations remain unverified, and Windows directory publication requires the NTFS/native capabilities described above. SQLite canonicalizes its native VFS paths; database/lease identities are revalidated, but this evidence does not claim its VFS is descriptor-anchored or that adversarial native VFS path races have been proven safe.

Profile payloads live in JSON. SQLite uses the bundled `node:sqlite` adapter with DELETE journals, synchronous EXTRA, foreign keys and zero busy timeout. A dedicated exclusive lease prevents competing writers; publication/reopen reconciles interrupted work before activation. Moving the complete folder preserves its UUIDs and relative object paths and updates the separate root binding. A copied root is refused while its original still exists. Finalized operation evidence is retained; it is not a full backup.

## Checks

Typecheck, lint, the registered regression suite and focused actual Electron create/reconcile/close checks have run during the reported bug fixes. Finish the source integration pass before broadening release verification. These commands cover the local checks and separate packaging phase:

```bash
npm run typecheck
npm run lint
npm test
npm run smoke
npm run package
npm run smoke:packaged
```

Run Forge development and packaging commands sequentially because both use `.webpack`. Smoke needs a graphical display (`DISPLAY=:1` was tested). It launches real secured windows with temporary application profiles and universe folders. The healthy flow exercises profile forms, pending departures, persistence, lost-acknowledgment reconciliation and utility restart. Failure scenarios cover host startup/exit, invalid responses, timeout and the documented fatal-error event. Security checks retain malformed-request and foreign-window rejection, denied permissions/navigation/windows, absent renderer Node globals, exact bridge methods and pending-request cleanup.

Native selections/cancellation and the lost acknowledgment are injected only in explicit diagnostic mode. These checks do not claim manual OS-dialog acceptance. The runner drains streams and stops the process tree before deleting its temporary profiles. In restricted execution sandboxes that suppress subprocess stdout, run the registered process-runner tests outside that execution restriction; Electron's own sandbox remains enabled.

`npm run package` creates a local application directory in `out/`. The existing Linux executable and smoke evidence concern the earlier Story 1.2 revision, not the current source. The smoke harness itself uses Node. Windows/macOS file replacement, directory flush, locking, installers and installed acceptance remain unverified. Hardware power-loss, physical disk-full and removed-drive laboratory acceptance also remain open.

## Source boundaries

`domain` owns record/calendar/manuscript rules; `application` owns contracts, use cases and storage ports; `infrastructure` owns SQLite, confined filesystem access and durable publication/recovery. Main owns windows, native dialogs, output capabilities and draining shutdown. The isolated preload exposes named readiness, project, universe, workspace, settings and protection operations. The renderer cannot choose arbitrary filesystem paths, executables, SQL or IPC channels. Native handles never cross IPC.

Readiness remains a separate non-mutating five-second query. Universe transport validates closed versioned request/result shapes and correlation, bounds pending requests to 32 and uses a separate mutation timeout/outcome model. The utility process serializes authoritative use cases. Renderer Node integration is disabled; sandbox/context isolation, strict CSP and local-content navigation protections remain in force.

Fault injection requires `WRITINGTOOL_DIAGNOSTIC=1`; normal launches ignore diagnostic fault/profile/location settings. Adapted from official `create-electron-app` 8.0.1 and Forge's TypeScript Webpack template. The utility host is a separate Webpack entry included in the packaged ASAR.

See [Story 1.2 evidence](_bmad-output/implementation-artifacts/story-1-2-evidence.md) for runtime versions, results and limits, and [Story 1.1 evidence](_bmad-output/implementation-artifacts/story-1-1-evidence.md) for the retained shell/security baseline and development-tool advisories.
