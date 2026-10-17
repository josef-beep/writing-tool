# Story 1.2 implementation evidence

Implemented on 2026-10-17 on Linux x64 (kernel 7.0.0-38-generic). This evidence covers the universe folder/profile increment; it does not close the complete TECH schema, coordination, backup or platform gates.

## Delivered behavior

The gray Dark desktop now has working File/Universe dropdown commands and keyboard hints, a native folder chooser, a centered create/profile editor, and a named empty universe workspace. Name is required and trimmed; description is optional in the form and defaults to empty. Save stays open. Dirty departures offer Save/Discard/Cancel; failed saves retain edits. Unknown save outcomes retain the original operation and submitted revision, block ordinary discard/switch/close, and require an explicit reopen of the original selected folder. Reconciliation distinguishes the current verified snapshot from a retained historical receipt or a proven noncommit.

The utility host owns application use cases and filesystem/SQLite adapters. Closed runtime DTO validators and JSON schemas define profile, descriptor, bootstrap, operation journal/markers and command-specific transport. Renderer methods cannot choose paths, SQL or arbitrary IPC channels. Readiness remains its separate non-mutating five-second protocol. Exact sender/frame/URL checks and sandbox/context isolation remain in force.

A reserved empty root gets only the discovery descriptor, UUID-named profile JSON, managed images directory, v1 catalog, dedicated lease database and operation workspaces. Payloads remain JSON. Unsupported/missing/corrupt stores do not initialize replacement authority. The catalog indexes identity, root-relative paths, version/hash, exact decimal generation and durable receipts. SQLite uses DELETE journal mode, synchronous EXTRA, foreign keys ON and zero busy timeout; adapter startup checks the actual settings. A fixed SQLite header check validates supported format/application/schema before writable recovery, including hot-journal recovery.

The dedicated lease holds BEGIN EXCLUSIVE throughout authority. Root/database physical identities, descriptor identity, session fence and generation/version expectations are rechecked before publication and in the catalog commit. Profile publication stages complete before/after bytes, hashes, lengths, typed record metadata and semantic digest; flushes files/directories; replaces the live profile; commits catalog/receipt; then verifies/finalizes before acknowledging. Recovery undoes definitively uncommitted work, finishes committed work, and blocks unexplained/missing/foreign evidence. Older finalized journals cannot overwrite newer generations. Whole-folder relocation changes the separate root binding plus the fresh operational session fence; content generation, permanent IDs, profile bytes and indexed object paths stay intact.

Normal close/switch drains the serialized utility work and closes the catalog and ownership connection before acknowledgment. Main releases/kills the utility only after that acknowledgment; forced termination is treated as a crash.

## Checks and results

Executed sequentially against the finalized source:

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, deny warnings |
| `npm test` | Passed: 11 readiness, 24 universe, 4 process-runner tests |
| `npm run smoke` | Passed all seven real Electron development scenarios |
| `npm run package` | Passed, ASAR package at `out/WritingTool-linux-x64` |
| `npm run smoke:packaged` | Passed all seven packaged scenarios, bundled executable with PATH restricted to its directory |

Node integration tests used Node 24.19.0 / SQLite 3.53.3. Actual development and packaged utility runs used Electron 44.9.0, bundled Node 24.22.0 and SQLite 3.53.4. The same secured renderer/preload/main/utility/application path created a universe, saved its profile, reconciled a deliberately lost acknowledgment, drained close, restarted the utility and reopened the saved UUID/profile at generation 2. No external Node executable or SQLite addon/runtime installation was needed by the packaged application.

The healthy Electron scenario additionally asserts real renderer behavior: blank-name feedback; pending departure Cancel; a failed pending Save retaining the draft; Discard; the editor staying open; native selection cancellation preserving the active snapshot; and the separate unknown-outcome path retaining submitted edits, blocking ordinary discard, and successfully reconciling. Native selection/cancellation and acknowledgment loss are explicitly diagnostic injections, not claims of OS-dialog automation or an actual network timeout. The ordinary host-client timeout and late-reply behavior are separate registered tests.

The six failure scenarios preserve the starter coverage: host startup failure, host exit, invalid response, timeout, exit after ready and the documented fatal-error event. Every smoke scenario also checks sender rejection, rejected malformed readiness requests, denied permissions/navigation/windows, absent renderer Node globals, exact approved bridge methods and zero pending readiness requests. Universe access from an unowned window is also rejected.

## Matrix coverage

| Spec scenario | Registered evidence |
|---|---|
| Create/save/reopen, required name/optional description | JSON/catalog hash/version agreement, durable receipt and reopen tests; actual development and package flows |
| Validation/cancel | Blank input and malformed Unicode vectors; dirty Save/Discard/Cancel and native cancellation with unchanged active snapshot in Electron smoke |
| Existing/invalid/unwritable roots | Unrelated file preservation, invalid candidate preserving the previous activation, unsupported version byte comparison, corrupt profile preservation, missing journal, permission-denied, symlink and hardlink fixtures |
| Competing owner and owner death | Actual Node child process denied the owning process's exclusive lease; terminated creation/save/recovery workers release OS ownership and permit verified reopen |
| Interrupted creation | Process exits after reservation, schema creation, profile/descriptor files and committed creation; partial stores block, committed stores reopen |
| Interrupted save/publication | Process exits after durable journal, live file replacement, catalog commit and finalization; restart verifies old/new and equal-operation retries |
| Interrupted undo/redo | Recovery worker exits during each; next reopen repeats from retained immutable evidence |
| Unexpected bytes/corrupt evidence | Foreign live profile bytes stay untouched and activation blocks; missing journal and aliased paths block |
| Stale generation/fence/authority | Stale record/generation, changed session token and replaced lease inode stop writes before profile replacement |
| Same/different retry and later generations | Original receipts retained across reopen; different semantic payload rejected; older receipts/journals never replay over the newest profile |
| SQLite interrupted transaction | A killed worker leaves a hot catalog journal; supported writable recovery restores the verified saved state before activation |
| Relocation | Moved folder preserves UUIDs/profile and exact record rows/content generation; only root location/version and operational session metadata change; copied root rejected while original exists |
| Lost acknowledgment/host | Real Electron diagnostic loss after a durable utility reply retains pending editor state and resolves by original operation ID; utility restart reloads saved profile through the secured path |

Raw logs and parsed actual Electron results are in [story-1-2-evidence](story-1-2-evidence/). The restricted execution sandbox suppresses stdout from asynchronous child processes; the existing process-runner tests pass outside that sandbox. The final complete registered test suite and real Electron checks ran outside that execution restriction, with Electron's production sandbox retained. Packaging's upstream checksum fetch also required network access outside the restricted execution sandbox.

## Remaining limits

Windows/macOS replacement, directory-flush, locking, installers and installed acceptance remain unverified. Automated chooser tests inject native selections in explicit diagnostic mode; no manual native-dialog acceptance is claimed. Process-boundary interruption tests exercise software recovery, not hardware power-loss, physical disk-full or removed-drive fault laboratories. Competing-process integration uses the Node binding/version stated above; packaged SQLite loading and persistence are independently proven through the real utility path.

Incomplete/unrecognized creation is intentionally blocked with preserved evidence; no destructive cleanup or general recovery wizard is added. Finalized operation staging and durable receipts are retained. No revision/backup/archive, future entity tables, project/calendar/date behavior, cross-root coordinated publication or full TECH-01/02/04/05/11/12 closure is claimed. The previously recorded development-tool dependency advisories remain separate from this increment.

## Acceptance correction follow-up

The profile editor now occupies the center workspace and leaves the top File/Universe command bar available to mouse and keyboard. Universe exposes Save profile and Close profile; only blocking errors and Save/Discard/Cancel dialogs are modal. Closing the editor restores focus to the visible Universe category. The README now documents the delivered feature, storage, commands and limits.

Before-dispatch host/capacity rejection of a new operation now reports `not-committed`, so an untouched selected folder does not become an unknown recovery obligation. A pending/expired duplicate of an original operation that may have run retains `unknown`; an available host can still admit an idempotent retry with a fresh transport request ID. Two targeted transport tests pass, along with typecheck and deny-warning lint.

A targeted real Electron healthy scenario passes after these corrections. Native mouse input opens the Universe category, closes/reopens the center profile editor and saves from the top dropdown. All existing renderer dirty-departure and unknown-outcome predicates still pass. The corresponding logs/results are `acceptance-corrections-targeted-*` in the evidence directory. The earlier full-run logs above precede these acceptance corrections; the parent review workflow will perform the final full verification.

## Review correction verification

The review corrections replace persistent universe-close approval with one-use, nonce-correlated quit decisions. Native window close and app quit now use the production renderer Save/Discard/Cancel decision even in diagnostics, then drain the existing utility before exit. The public bridge stays unchanged; renderer menu Exit uses a closed, sender-checked private lifecycle notification, and private DOM events complete the decision. Definite host exit with no unresolved operation needs no impossible acknowledgment. The focused healthy scenario exercises Close universe → new dirty draft → native window close/Cancel and app quit/Cancel, retaining the window and draft, and then exits through an acknowledged production drain. The focused exited-host scenario exits through that same decision path with `hostAlreadyExited:true` and no unresolved operations. These paths no longer use the old diagnostic lifecycle bypass.

The healthy renderer scenario also delays an actual durable utility acknowledgment, accepts newer edits while waiting, and proves the newer draft remains visible and dirty. A separate pending-departure Save repeats this check and does not leave the editor after acknowledging an older submitted revision. Exact nonempty description data—including surrounding whitespace, CRLF, Unicode and a tab—is asserted after publication and restart. Recovery can be chosen with real mouse input from the top Universe dropdown after dismissing its error dialog; all top-command and recovery predicates pass.

Storage regressions cover denied/missing initial reservation (`not-committed`), failure after reservation (`unknown` with evidence), atomically staged marker interruption, torn final/abort marker archival and conservative repair from matching journal/catalog decisions, later-generation replay protection, reuse of the old folder by an empty directory or unrelated universe, physical alias and active same-inode relocation while reconciling, and foreign/copy/original-operation-digest rejection before activation. Creation preflights the prior context; if creation commits but later activation fails, it reports `committed` and retains the creation receipt while preserving the prior authority and foreign bytes.

Managed JSON reads, exclusive writes, replacement and marker publication now pin verified Linux directory handles and perform actual I/O relative to those descriptors. A regression retargets the parent directory during each real read/write/replace system call, confirms the race actually happened, and verifies the outside sentinel and namespace remain untouched. Unsupported directory-relative primitives fail safely. This proof applies to the managed file helpers: Node SQLite canonicalizes native VFS paths. Database/lease identities remain revalidated, but no descriptor-anchored SQLite VFS or adversarial VFS race proof is claimed.

Targeted verification only: 31 universe/application/file-adapter tests passed; the two final creation regressions passed separately after the last reservation preflight adjustment; strict types and deny-warning lint passed; the focused healthy and definitely-exited-host Electron scenarios passed. Logs and parsed results are `review-fix-*` in the evidence directory. Final full verification remains the parent review workflow's responsibility.
