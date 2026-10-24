# Local implementation and verification slice — 2026-10-24

This slice implements BUG-03/04/05 and reproduces BUG-01/02 evidence. Bug acceptance remains provisional until the build workflow review. It does not finish the broad delivery spec, accept additional stories, or close installed-platform, TECH, hardware or full release gates.

## Changes

- Debian maker uses `options.bin: WritingTool` and a module-name configuration entry. Forge's explicit `--targets @electron-forge/maker-deb` otherwise creates a default maker because an instance's name is `deb`, dropping its configured options. The exact requested make command now succeeds.
- Type checking runs inside ts-loader with `transpileOnly: false` and `onlyCompileBundledFiles: true`; shared webpack plugins contain no forked checker. Standalone `npm run typecheck` continues to check tests and configuration as well as source.
- Native protection queues recovered-context notification until it releases admission. Shell retains its roots on read failure, retries only known-unsent busy reads, verifies project/universe identity pairing and rejects refresh responses superseded by navigation or a successful profile result. Unknown writes and their evidence remain unchanged.
- Manuscript focus restoration waits for Lexical selection reconciliation and explicitly focuses the visible root. Actual Electron tests type at the restored selection, undo that test edit, and verify the durable matched manuscript.
- Desktop fixtures force busy reads and a delayed stale context response during newer project-close navigation. Calendar input waits for actual accepted values before submit.
- Seven new registered release-contract tests exercise real application/storage/protection infrastructure with temporary data. They cover project and universe ZIP activation after original-root deletion; exact permanent IDs, images and retained revision history; protective Replaced failure and successful capture; freshness/cancel/resume; chapter-only linked-event isolation and restored-calendar flag; exact large negative chronology, plot ordering, entities/100 personality labels/affiliations/decision status; atomic independent settings; missing-reference restoration; noncontiguous TXT/Markdown export ordering and live-source rejection.

## Reproduction and results

| Check | Result / evidence |
| --- | --- |
| Typecheck and deny-warning lint | Passed: [types](typecheck.txt), [lint](lint.txt) |
| Complete registered Node suite | **107 passed, zero failed/skipped**: [output](node-suite.txt), [counts](node-suite.json). Includes all new tests and exact retained-descriptor negative regressions. |
| Complete Electron suite | **24 registered scenarios + 3 restart continuations passed in one run**: [output](desktop-all.txt), [results](desktop-all.json); logs retained under `desktop-logs/writingtool-desktop-verification-CXvX9Q/`. |
| Focused Electron regression | Writing, reconcile-defer and reconcile-defer-restart passed: [scope](focused-desktop.json), logs under `desktop-logs/writingtool-desktop-verification-yOpEpt/`. |
| Real TypeScript diagnostic/watch | Invalid TS2322 compilation fails; corrected input passes; valid → invalid → valid watch recovery and close pass: [probe](verify-webpack.mjs), [output](webpack-check.txt), [result](webpack-check.json). |
| Actual Forge compile interruption | A temporary Node preload emits a marker when ts-loader loads TypeScript, then the actual Forge process group receives SIGINT. Process exits by SIGINT without worker EPIPE: [probe](verify-forge-interrupt.mjs), [output](forge-interrupt.txt), [result](forge-interrupt.json). The earlier missed-trigger and startup-only probe logs are retained separately. |
| Development smoke | Seven scenarios passed, all security checks true and all drains complete with zero unresolved operations: [output](smoke-development.txt), [results](smoke-development.json). |
| Fresh Linux package | Passed: [build](package-linux.txt); executable `out/WritingTool-linux-x64/WritingTool`. |
| Packaged smoke | Seven scenarios passed with restricted PATH; all security/drain checks passed: [output](smoke-packaged.txt), [results](smoke-packaged.json). |
| Debian make and extracted launch | Exact `npm run make -- --from-package --targets @electron-forge/maker-deb` passed. Temporary extraction confirms desktop command → packaged `usr/bin/writingtool` symlink → `usr/lib/writingtool/WritingTool`; healthy sandboxed launch, security and drain pass: [maker](make-debian.txt), [probe](verify-debian.mjs), [results](debian-results.json), [launch](debian-launch.txt). No system installation. |
| Real exports | TXT, Markdown, DOCX, PDF and both catalog scopes passed with source and shipped LibreOffice runtimes. DOCX exact paragraph validation, independent PDF text extraction, SQLite integrity/metadata and ZIP payload checks passed: [source](source-exports.json), [packaged](packaged-exports.json). Probe source is the preserved `../full-test-evidence-2026-10-24/export-probe.mts`; environment variables redirect results here. Full independent recovery activation is additionally covered by the registered tests above. |
| Schema / planning / sprint | Eight meta-schemas and 47 assertions passed via cached `uv run --offline --with jsonschema`; [schema results](schema-probe-results.json), [planning](planning.txt), [sprint](sprint.txt), [dry run](sprint-dry-run.txt). No story-status changes. |
| Preservation | Previous `out` retained as recorded in [previous-output.json](previous-output.json). Every initial `.webpack` file restored by exact SHA-256; new generated files retained separately: [preservation](preservation.json). No real writing or resource setup changed. |

The restricted executor prevented Chromium's process sandbox startup, and its git subprocess handling prevented the initial benchmark. Normal process-access reruns passed while Electron's own sandbox remained enabled. The initial Debian maker attempt reproduced the CLI override behavior before the module-name fix; the extraction probe initially assumed an absolute desktop Exec path rather than the correctly packaged command symlink. Those unsuccessful probes remain alongside the successful evidence. System Python lacked jsonschema; the already cached uv environment passed without network access.

## Matched-byte save performance

Run `node --import tsx _bmad-output/implementation-artifacts/todo-completion-evidence/save-benchmark.mjs` with normal git subprocess access. It obtains baseline storage source directly from canonical revision `03687967ba70c0adf49e746b5fa3eddbce997421`, records source SHA-256, restores the same byte-identical synthetic stores at the same paths before baseline/current measurements, performs three durable saves at each history size, and verifies original operation receipts, reopened matched text/formatting and unchanged historical hashes. [Raw output](save-performance.log), [environment/hashes/samples](save-performance.json), [probe](save-benchmark.mjs).

| Retained historical versions | Baseline median ms | Current median ms |
| --- | ---: | ---: |
| 0 | 164.70 | 175.30 |
| 100 | 221.30 | 227.98 |
| 500 | 871.09 | 429.63 |
| 1,000 | 2,325.86 | 708.44 |

These are three-run synthetic measurements including durable mutation, response snapshot and universe read, with warm sequential local conditions and nonempty Unicode historical text. They impose no absolute-time assertions and do not represent DEC-11 corpus, installed performance, UI paint/IPC timing, p95 budgets or four-core/16GB reference-hardware acceptance.

## Work remaining for the parent continuation

- Generate and instrument the full DEC-11 baseline and ten-times corpus, including actual image/history/archive sizes; measure normal save/open/capture/export and installed interactive behavior. Additional application-layer quadratic paths were identified by the parent and are not changed in this slice.
- Continue per-criterion story/TODO acceptance mapping. The seven integration tests establish their explicit behaviors, not all criteria of BUILD-04–23 or the remaining 47 stories.
- Add deeper applicable coverage still absent from this slice: independent automatic save/revision/backup scheduler start/change/resume/nonoverlap/failure behavior, destination cancellation/fallback/moved-destination cases, exhaustive missing-reference choices, detailed character birth/prompt/waiver and faction field transitions, and complete export cancellation/overwrite/visual fidelity checks.
- Complete required workflow reviews and address demonstrated findings before accepting bugs or the broad spec.
- Matching-host Windows/macOS native/installed tests, Linux distribution install/upgrade/uninstall tests, actual hardware fault laboratories and final accessibility/visual acceptance remain unavailable or unperformed. Extracting and launching a Debian package is scoped local evidence, not installed distribution acceptance.
