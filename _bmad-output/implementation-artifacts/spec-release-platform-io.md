---
title: 'Release coding pass — native platform filesystem adapters'
type: feature
created: 2026-10-18
status: in-progress
baseline_commit: a54f9e3039a606cc735898bede2405d06d0761fd
route: dispatch
context:
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/data-contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/publication-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/coordination-contracts.md
---

<frozen-after-approval reason="Approved Windows/macOS/Linux release targets; user requests all coding before testing">

## Intent

Complete the filesystem-adapter code needed for the already approved Windows and macOS targets. The current managed-file implementation explicitly throws outside Linux. Retain its verified Linux directory-descriptor approach while adding concrete native platform sources, an internal adapter and build/bundling hooks. Actual platform/runtime/physical-durability proof is the later verification phase and must remain unclaimed.

## Boundaries & Constraints

Preserve directory-handle-relative actual I/O, no-follow/reparse rejection through every path segment, single-link regular files, expected file identity/content checks, exclusive reservations, file/directory flush and atomic publication. Never replace the Linux confinement with path-check-then-write or silently weaken preservation/durability guarantees. A failed/unsupported native primitive must remain a clear failure/unknown outcome, never a false durable acknowledgment. Keep renderer isolated; the native module is used only by trusted main/utility infrastructure. No new user-facing settings, storage formats, data limits or authority copies.

Native code may use stable Node-API and platform OS APIs, with packaged binaries built for each accepted target by the existing Forge pipeline. Users must not need a compiler or separate addon installation. Keep binary artifacts out of Git; source and reproducible build/resource configuration are tracked. Do not execute tests, typecheck, lint, native compilation, builds, app/runtime probes or packaging during this coding pass. Inspect primary documentation and source only.

## I/O & Edge-Case Matrix

| Scenario | Input | Required behavior | Failure |
|---|---|---|---|
| Managed read/write/replace | Root-relative owned path | Actual I/O remains bound to verified directory handles | Preserve unrelated bytes |
| Directory retarget/symlink/reparse/hardlink | Changed parent/target | Reject or operate only on the pinned owned object | No namespace escape |
| Reservation/publication/flush | Create or replace | Track first possible write and acknowledge only completed durability steps | Preserve unknown outcome/evidence |
| Unsupported primitive/addon | Missing or incompatible native implementation | Clear safe error | No unsafe fallback |

</frozen-after-approval>

## Code Map

- `src/infrastructure/universe-files.ts`: managed helpers currently rely on Linux `/proc/self/fd`; directoryHandle throws on non-Linux. Integrate a narrow native backend without changing caller semantics for readManaged/writeExclusive/replaceManaged/publishMarker/preserveMarker/syncDir and newer workspace binary/directory helpers.
- New native source under `native/confined-fs/` plus a typed trusted wrapper: macOS openat/renameat/unlinkat with O_NOFOLLOW/O_DIRECTORY and appropriate flush; Windows handle-relative NtCreateFile RootDirectory and handle-relative rename/delete, rejecting reparse points and aliases. Pin every traversed directory; do not reopen absolute paths after checking.
- `forge.config.mts`, package/build scripts and webpack/native-loader configuration: build/copy/unpack the platform module with the bundled Electron runtime and package it as a trusted resource. Preserve existing LibreOffice/fonts/resources from the earlier slice.
- `README.md`, source contract and release ledger: describe the actual code and unverified platform limits accurately.

## Tasks & Acceptance

- [x] Inspect each current helper and provide an equivalent concrete native operation with exact error/outcome handling.
- [x] Add macOS and Windows native sources with secure handle ownership/cleanup, validation and exclusive/replace/flush operations.
- [x] Add a typed internal platform dispatch adapter, keeping Linux behavior intact and failing safely if a required native capability is missing.
- [x] Add stable Node-API build/bundling configuration for accepted architectures without executing compilation during this pass.
- [x] Record source inspection and all platform/flush/installer verification still required; do not claim execution success.

Given a supported packaged target, when the native module is present, then managed operations use equivalent confined platform APIs by design. Given missing/unsupported primitives or identity changes, when operating, then no unsafe path fallback or false commit is allowed. Given Linux, when using existing helpers, then its descriptor-relative implementation is preserved.

## Implementation Notes

Primary sources inspected during planning: Microsoft NtCreateFile documents RootDirectory-relative ObjectName and FILE_OPEN_REPARSE_POINT (https://learn.microsoft.com/en-us/windows/win32/api/winternl/nf-winternl-ntcreatefile); SetFileInformationByHandle provides handle-based metadata changes (https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfileinformationbyhandle); Node-API supplies the stable addon ABI (https://nodejs.org/api/n-api.html); Apple open documentation describes no-follow and directory flags (https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/open.2.html). Consult the exact platform-relative rename/flush APIs before writing code; do not assume Windows directory flushing matches POSIX. This task closes a coding gap, while actual availability/durability remains a required later gate. SQLite's own VFS paths remain separately documented; do not claim descriptor anchoring of SQLite itself.

## Verification

Deferred until all coding, including this slice, is complete. No native build/probe/test execution during implementation.

### Continuation source inspection — 2026-10-18

Intent gaps: no new product decisions; actual Windows/macOS access remains an unverified later prerequisite. Source/build-script changes are reversible and do not authorize running compilation or mutating user writing roots in this pass. Footprint is the native Node-API source, typed infrastructure dispatch, existing managed helper call sites, native build setup, Forge resource configuration and delivery notes. Keep the completed protection/font resource packaging intact.

Every current helper in `universe-files.ts` needs dispatch: `syncDir`, `writeExclusive` (including first-reservation callback), `publishMarker` (including staged callback), `preserveMarker`, `readManaged`, `replaceManaged`, `ensureManagedDirectory`, `publishManagedBytes`, `removeManagedBytes`. `checked` supplies discovery validation but cannot replace handle-relative actual I/O. Native callbacks must occur at the same first-possible-mutation boundaries, including on a subsequent flush failure. Preserve thrown outcome evidence and clean up handles on both callback and OS errors.

Primary documentation checked during this continuation: [Apple fsync](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/fsync.2.html) describes `F_FULLFSYNC` for strict buffered-drive ordering; distinguish regular-file full flush from directory metadata synchronization. [Microsoft FlushFileBuffers](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers) requires appropriate write rights and does not document ordinary directory handles as equivalent to POSIX directory fsync. A missing flush capability must fail explicitly; do not swallow failure or substitute a successful file-only flush. [FILE_RENAME_INFO](https://learn.microsoft.com/en-us/windows/win32/api/winbase/ns-winbase-file_rename_info) permits a relative target with a directory handle and a nonreplace mode. Use that handle-relative target rather than an absolute path reopening after validation. Retain the stated filesystem/hardware verification gate even with concrete code.

### Resumed investigation — 2026-10-19

Standing execution approval covers this prepared slice and all routine technical choices; no new product gaps or irreversible actions were found. Complete the existing native-platform specification without a further approval checkpoint. Dispatch implementation sequentially, retaining the user’s no-tests/no-builds direction.

The latest source also adds `publishManagedFile(root, relative, source, expectedHash, expectedSourceHash)` and `hashFile(file)` to `universe-files.ts`. Cover both in native dispatch. Output publication streams private artifacts in bounded chunks, validates the source digest before final rename, and preserves existing output on prepublication errors. Do not replace this with whole-artifact buffering. Native bindings must propagate first-mutation callbacks synchronously; missing flush support must throw rather than claim durability. Keep unsupported paths/capabilities explicit. All existing helpers and their consumers retain the same TypeScript signatures. Include a native source/build README with primary API references and exact remaining gates.

### Implemented source — 2026-10-19

Native Node-API v8 sources, typed dispatch and trusted bootstrap now exist. macOS uses pinned openat/no-follow traversal, full file flush, directory fsync and no-replace rename; Windows uses relative NT handles and handle-based rename/delete/read, but **directory metadata durability is unresolved**. Native mutation helpers preflight directory synchronization, so Windows rejects writes before mutation. The first two execution tasks above remain incomplete for the Windows durable-write contract; no native platform is accepted by source inspection.

`native/confined-fs/README.md` records exact APIs, supported native targets and limitations. `scripts/build-native.mjs`, the pinned existing node-gyp 12.4.0 dependency and Forge preStart/prePackage hooks provide matching-host Electron-header compilation and unpacked resource copying. These hooks/scripts were written but not run. Main fixes the module location and passes it to utility bootstrap before storage setup; Webpack leaves this adapter's createRequire call for Node runtime loading. Trusted private temporary parent paths are canonicalized before allocation, preserving strict no-follow managed walks on macOS. Linux helper bodies remain unchanged behind dispatch guards.

The adjacent protection integration pass replaces directory-name inference with permanent owner identity for activation dialogs, checks backup folder separation in recovery/reconciliation as well as manual backup, streams completed-output hashing, and retains unknown outcomes after restore or completion-record failures. Tests/typecheck/lint/native compilation/launch/build/package and the formal review/matrix audit remain deferred by the standing user instruction. Keep status in-progress; do not advance to done or mark platform gates complete.

### Windows flush implementation — 2026-10-19 (supersedes the unavailable-primitive checkpoint above)

Further primary-source investigation located `NtFlushBuffersFileEx` normal flags 0, which requests metadata and underlying-storage synchronization. MS-FSA 2.1.5.7 explicitly covers directory streams; product note 80 limits directory-structure persistence to NTFS (other filesystems can return success without performing it). Implemented filesystem-name validation through the pinned handle, NTFS-only mutation support, `ReOpenFile` rights upgrade of the same object with identity validation, dynamically resolved native flush, and strict direct/completion status checks. Ancestor traversal retains read rights; only the destination directory is upgraded. No absolute-path reopen, privilege escalation or weaker fallback occurs. The preflight rejects unavailable/denied/non-NTFS cases before mutation. This closes the previously identified source stub, while syscall/export/handle interoperability, actual filesystem behavior and physical durability remain unverified acceptance gates. Primary references are in the native README. All coding tasks now have source; status remains in-progress because verification and formal review were explicitly deferred.
