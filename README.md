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

The root postinstall obtains the official Electron runtime even when npm's dependency-script policy skips its dependency postinstall. Resource setup downloads and checksum-verifies the pinned LibreOffice distribution without executing it and stages bundled fonts and a runtime receipt. Notices are maintained under `resources/notices` and checked separately by packaging. DOCX/PDF conversion uses that bundled runtime. In environments with restricted cache writes, use writable npm/runtime cache locations. Setup refuses an existing `resources/libreoffice` tree; inspect and preserve the existing setup before explicitly replacing it.

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

The source integration pass is complete; full story and installed-release acceptance remain open. Run commands from the repository root. `npm test` does not include typecheck or lint. These commands cover the local checks and separate packaging phase:

```bash
npm run typecheck
npm run lint
npm test
npm run smoke
npm run package
npm run smoke:packaged
```

The registered suite chains individual Node test files. To target a test file, run it directly rather than appending an npm test filter:

```bash
node --import tsx tests/workspace-domain.test.ts
node --import tsx tests/presentation-integration.test.tsx
node tests/smoke.test.mjs
```

`tests/smoke.test.mjs` tests the process runner using Node fixtures; it does not launch Electron. Converter-process tests likewise test Node fixtures rather than installed LibreOffice. Both require normal child-process streams and process-tree control.

For actual desktop integration, select scenarios positionally. With no arguments, the runner executes all registered scenarios; read `scripts/verify-desktop.mjs` for the current list.

```bash
npm run test:desktop -- writing menus error-quit
```

The desktop runner compiles the real Forge main/utility, renderer and sandboxed preload configurations into a fresh OS-temporary directory and uses temporary profiles, writing roots and backup folders. It retains scenario logs and `results.json` at the printed evidence path. Unlike the smoke command, it inherits `DISPLAY` without supplying a default: on Linux, use a working desktop session (for example, `DISPLAY=:1 npm run test:desktop -- writing` when that display exists). It bypasses Forge's native build hooks; run `npm run build:native` first on macOS/Windows. Linux skips addon compilation, so that command's success is not native-platform acceptance.

PLAN-07 freshly verified typecheck, lint, all 98 registered tests and the desktop command above, including its additional recovery-notice relaunch check. See [development/check evidence](_bmad-output/implementation-artifacts/plan-07-context.md) for the exact scope, logs and retained platform limitations. Setup/downloads, ordinary Forge launch, current packaging and installers were not rerun for PLAN-07.

For planning changes, `node scripts/validate-plan.mjs` checks story structure and traceability; `--write` refreshes its JSON evidence after an intentional input change. It needs read-only git subprocess access for the exact revision. Sprint format/status checks use `.agents/skills/bmad-sprint-planning/scripts/sprint_plan.py`; exact invocations are in [sprint reconciliation](_bmad-output/implementation-artifacts/sprint-reconciliation.md#deterministic-tracking-checks). In this managed environment, prefix `uv run` with `UV_CACHE_DIR=/tmp/writingtool-uv-cache` to avoid an unwritable home cache. Dependency downloads need network access; these helpers do not verify application behavior.

Run Forge development and packaging commands sequentially because both use `.webpack`. Smoke needs a graphical display (`DISPLAY=:1` was tested). It launches real secured windows with temporary application profiles and universe folders. The healthy flow exercises profile forms, pending departures, persistence, lost-acknowledgment reconciliation and utility restart. Failure scenarios cover host startup/exit, invalid responses, timeout and the documented fatal-error event. Security checks retain malformed-request and foreign-window rejection, denied permissions/navigation/windows, absent renderer Node globals, exact bridge methods and pending-request cleanup.

Native selections/cancellation and the lost acknowledgment are injected only in explicit diagnostic mode. These checks do not claim manual OS-dialog acceptance. The runner drains streams and stops the process tree before deleting its temporary profiles. In restricted execution sandboxes that suppress subprocess stdout, run the registered process-runner tests outside that execution restriction; Electron's own sandbox remains enabled.

`npm run package` creates a local application directory in `out/`. The existing Linux executable and smoke evidence concern the earlier Story 1.2 revision, not the current source. The smoke harness itself uses Node. Windows/macOS file replacement, directory flush, locking, installers and installed acceptance remain unverified. Hardware power-loss, physical disk-full and removed-drive laboratory acceptance also remain open.

## Source boundaries

`domain` owns record/calendar/manuscript rules; `application` owns contracts, use cases and storage ports; `infrastructure` owns SQLite, confined filesystem access and durable publication/recovery. Main owns windows, native dialogs, output capabilities and draining shutdown. The isolated preload exposes named readiness, project, universe, workspace, settings and protection operations. The renderer cannot choose arbitrary filesystem paths, executables, SQL or IPC channels. Native handles never cross IPC.

Readiness remains a separate non-mutating five-second query. Universe transport validates closed versioned request/result shapes and correlation, bounds pending requests to 32 and uses a separate mutation timeout/outcome model. The utility process serializes authoritative use cases. Renderer Node integration is disabled; sandbox/context isolation, strict CSP and local-content navigation protections remain in force.

Fault injection requires `WRITINGTOOL_DIAGNOSTIC=1`; normal launches ignore diagnostic fault/profile/location settings. Adapted from official `create-electron-app` 8.0.1 and Forge's TypeScript Webpack template. The utility host is a separate Webpack entry included in the packaged ASAR.

Repository agent instructions live in [AGENTS.md](AGENTS.md). Read [TODO.md](TODO.md), the [current checkpoint](_bmad-output/RESUME.md) and [sprint status](_bmad-output/implementation-artifacts/sprint-status.yaml) before resuming delivery. See [Story 1.2 evidence](_bmad-output/implementation-artifacts/story-1-2-evidence.md) for historical runtime versions, results and limits, and [Story 1.1 evidence](_bmad-output/implementation-artifacts/story-1-1-evidence.md) for the retained shell/security baseline and development-tool advisories.
