# WritingTool

WritingTool is a local Electron desktop application. Story 1.2 adds independently located universes: create one in an empty folder, reopen an existing universe, and edit its required name and optional description. A universe works without a project, calendar or fictional date. Project, calendar, manuscript and backup features are not implemented yet.

The gray Dark workspace has top File and Universe dropdowns and a centered profile editor. The command bar remains available while editing. Universe → Save profile (`Ctrl+S`) saves and keeps the editor open; Close profile (`Ctrl+W`) leaves it. File provides New universe (`Ctrl+N`), Open universe (`Ctrl+O`), Close universe (`Ctrl+Shift+W`) and Exit. Dirty departures offer Save, Discard and Cancel. Failed saves retain edits. A save whose outcome is unknown retains its original operation and submitted edits, blocks ordinary discard, and offers a same-folder reopen to reconcile the durable outcome. A command rejected before dispatch leaves edits available without creating a recovery obligation.

## Run locally

Development requires Node.js 22.16+ (verified with 24.19.0), npm, network access for initial dependency/runtime downloads, and a desktop session with Electron's platform libraries. Linux needs a working Chromium sandbox (user namespaces or a correctly installed sandbox helper). Keep the sandbox enabled.

```bash
npm ci
npm start
```

The root postinstall obtains the official Electron runtime even when npm's dependency-script policy skips its dependency postinstall. In environments with restricted cache writes, use writable npm/runtime cache locations. Windows/macOS makers remain scaffold configuration and have not been verified.

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

Managed JSON I/O uses verified Linux directory handles so a retargeted parent cannot redirect a read, write or replacement. Other platforms fail safely until an equivalent primitive is verified. SQLite canonicalizes its native VFS paths; database/lease identities are revalidated, but this evidence does not claim its VFS is descriptor-anchored or that adversarial native VFS path races have been proven safe.

Profile payloads live in JSON. SQLite uses the bundled `node:sqlite` adapter with DELETE journals, synchronous EXTRA, foreign keys and zero busy timeout. A dedicated exclusive lease prevents competing writers; publication/reopen reconciles interrupted work before activation. Moving the complete folder preserves its UUIDs and relative object paths and updates the separate root binding. A copied root is refused while its original still exists. Finalized operation evidence is retained; it is not a full backup.

## Checks

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

`npm run package` creates a local application directory in `out/`; the verified Linux executable is `out/WritingTool-linux-x64/WritingTool`. Packaged smoke launches it with `PATH` restricted to its directory, proving the application and utility host use bundled Electron/SQLite without a separate Node executable or SQLite addon installation. The smoke harness itself uses Node. Windows/macOS file replacement, directory flush, locking, installers and installed acceptance remain unverified. Hardware power-loss, physical disk-full and removed-drive laboratory acceptance also remain open.

## Source boundaries

`domain` owns profile rules; `application` owns contracts, use cases and storage ports; `infrastructure` owns SQLite, confined filesystem access and durable publication/recovery. Main owns windows, native dialogs and draining shutdown. The isolated preload exposes only named readiness and universe create/open/current/profile-save/close methods. The renderer cannot choose arbitrary paths, SQL or IPC channels.

Readiness remains a separate non-mutating five-second query. Universe transport validates closed versioned request/result shapes and correlation, bounds pending requests to 32 and uses a separate mutation timeout/outcome model. The utility process serializes authoritative use cases. Renderer Node integration is disabled; sandbox/context isolation, strict CSP and local-content navigation protections remain in force.

Fault injection requires `WRITINGTOOL_DIAGNOSTIC=1`; normal launches ignore diagnostic fault/profile/location settings. Adapted from official `create-electron-app` 8.0.1 and Forge's TypeScript Webpack template. The utility host is a separate Webpack entry included in the packaged ASAR.

See [Story 1.2 evidence](_bmad-output/implementation-artifacts/story-1-2-evidence.md) for runtime versions, results and limits, and [Story 1.1 evidence](_bmad-output/implementation-artifacts/story-1-1-evidence.md) for the retained shell/security baseline and development-tool advisories.
