# Full local verification — 2026-10-24

Testing found unresolved failures. All available Linux check families were exercised, but this is not a clean complete desktop run or release acceptance. Tested application revision: `4281f787f03b4b5cee3c377342f6e3634f2f60c2`, initially clean working tree, Linux x64, Node 24.19.0, Electron 44.9.0. Application source was not changed. See [summary.json](summary.json) for exact commands, durations, results and artifact identities.

| Check | Result | Evidence |
| --- | --- | --- |
| Typecheck and deny-warning lint | Passed | [Types](typecheck.txt), [lint](lint.txt) |
| Complete registered suite | 100 passed, zero failures/skips | [Suite output](unit-suite-host.txt) |
| Desktop integration | 23/24 registered scenarios eventually passed across batches; `reconcile-defer` failed | [First batch](desktop-all-host.txt), [remaining cases](desktop-remaining-host.txt), [writing retry](desktop-final-host.txt), [inventory/reconciliation](desktop-reconciliation-host.txt) |
| Extra desktop relaunch checks | Recovery notice and busy-inventory restart passed | Same desktop outputs |
| Development smoke | All seven scenarios passed | [Development smoke](smoke-development.txt) |
| Fresh Linux package | Passed | [Package build](package-linux.txt) |
| Packaged smoke with restricted PATH | All seven scenarios passed | [Packaged smoke](smoke-packaged.txt) |
| Source and packaged LibreOffice exports | TXT, Markdown, DOCX, PDF and project catalog passed; standalone-universe catalog also passed | [Source probe](export-probe-results.json), [packaged-runtime probe](packaged-export-probe-results.json), [probe source](export-probe.mts) |
| Complete ZIP contents | Project and universe ZIPs validated with original fixture roots unavailable, using both runtime probes | Same probe results |
| JSON Schema | Eight schemas passed meta-validation; 47 positive/negative assertions passed | [Results](schema-probe-results.json), [probe](schema-probe.py) |
| Dependencies | Top-level dependency tree valid | [Dependency output](dependencies.txt) |
| Planning and sprint | Structural/traceability validation passed; sprint valid and dry-run in sync, with no status changes | [Plan](planning-host.txt), [sprint](sprint-validation-host.txt), [dry-run](sprint-dry-run.txt) |
| Native build invocation | Passed Linux no-compilation branch; provides no Windows/macOS addon evidence | [Native invocation](native-build.txt) |
| Debian installer | Failed: executable-name mismatch | [Debian output](make-debian.txt) |
| RPM installer | Blocked: `rpmbuild` unavailable | [RPM output](make-rpm.txt) |

The smoke scenarios cover healthy operation and host start, exit, malformed reply, timeout, exit-after-ready and fatal-error handling. Every smoke result reported passing security checks; all fourteen native shutdowns drained with zero unresolved operations. Denied-request errors in those outputs are expected security probes, not failed assertions.

The export fixture contains two chapters with headings, bold/italic spans, an empty paragraph, tabs, double spaces, accented text, a scene break and indentation. TXT/Markdown are compared with serialization output; DOCX passes the application's exact paragraph/title validation; PDF passes structural validation and independent text extraction. Catalogs pass SQLite integrity/identity/metadata checks. Project ZIP payloads reproduce both manuscripts after original roots are renamed away; universe ZIP payloads also validate. These are representative checks, not rendered-layout fidelity or full recovery activation. The packaged-runtime probe runs application infrastructure through Node using the packaged LibreOffice copy; it does not exercise the complete packaged export UI.

Two failures remain actionable:

- **BUG-03 — Debian installer naming.** After successful `npm run package`, `npm run make -- --from-package --targets @electron-forge/maker-deb` looks for `out/WritingTool-linux-x64/writingtool`. The actual executable is `out/WritingTool-linux-x64/WritingTool`. No installer was produced and nothing was installed.
- **BUG-04 — Deferred-reconciliation close/focus.** `npm run test:desktop -- reconcile-defer` fails after retaining the failed backup and returning to writing. One fixture timed out at project close, showing empty shell context together with an active manuscript and “Close the active project before closing its universe.” A second isolated run progressed further but timed out restoring manuscript focus after profile close. This was reproduced without a competing desktop test. The precise cause remains undetermined. See [first failing continuation](desktop-final-host.txt), [isolated reproduction](desktop-defer-reproduction.txt), [first detailed failure](desktop-logs/writingtool-desktop-verification-ROT46N/reconcile-defer.txt) and [second detailed failure](desktop-logs/writingtool-desktop-verification-aFXCqi/reconcile-defer.txt). The `reconcile-defer-restart` continuation was not reached.

Two other desktop cases passed on retry: `partial-layout` first rejected calendar day totals during synthetic input, and `writing` first timed out restoring focus while development smoke was also opening windows. That concurrent launch may have affected focus; it is not an established root cause. Failed attempts remain in the evidence. VERIFY-13 tracks a clean complete run and investigation of timing/focus behavior. No all-green desktop suite is claimed.

Initial sandbox attempts could not access the display or provide normal subprocess behavior. The planning validator's git subprocess and converter fixtures also encountered documented execution restrictions. Host-access reruns resolved those environment failures while retaining Electron's sandbox. The first supplemental schema probe mistakenly validated the example wrapper instead of its `formatting` member; correcting that probe produced the passing results above. These setup/probe failures are retained separately from application failures.

Remaining acceptance work includes Windows/Intel Mac/Apple silicon native and installed behavior, actual hardware power loss/disk full/removed-drive laboratories, approved baseline and ten-times-content performance workloads, full visual export/accessibility/manual acceptance, recovery activation and remaining story/FR/NFR/TECH acceptance. This run does not close VERIFY-01–12 or BUILD-25, and does not accept any additional stories. BUG-01/02 also remain open; regression coverage is not a completed performance comparison or fix-workflow acceptance.

Only temporary profiles, projects, universes, destinations and converter profiles were used. Existing LibreOffice resources were preserved. [Preservation evidence](preservation.json) confirms every initial `.webpack` file was restored byte-for-byte; newly generated bundles and the previous package were retained separately in temporary folders. The fresh package remains at `out/WritingTool-linux-x64/WritingTool`. [Desktop fixture locations](desktop-evidence-paths.json), durable desktop logs and export-probe results retain reproduction context; OS-temporary fixtures may later be cleaned by the system.
