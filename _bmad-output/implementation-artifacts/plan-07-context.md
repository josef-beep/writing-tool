# PLAN-07 — Repository instructions and verified commands

Completed 2026-10-22 under Jo's [standing execution approval](../planning-artifacts/execution-approval.md). [AGENTS.md](../../AGENTS.md) now supplies the root instructions; [README.md](../../README.md#checks) supplies development/check commands and their prerequisites. No application source, dependency or Webpack configuration change was needed.

## Discovery and instruction decisions

No existing AGENTS, CLAUDE, GEMINI, project-context or cursor rule file required migration. This is setup, with no existing instruction ledger, deletion or relocation. The existing Epic 1 context is a scoped planning artifact and is retained. The package is one root npm application; the native addon is an infrastructure build target, not a separate agent-instruction scope. No child instruction file is needed.

The `bmad-project-context` skill's parallel discovery inspected executable commands/configuration separately from canonical contracts and observed recovery/keyboard failures. All instructions naming local files were path-checked. The complete managed block was shown before writing. Jo's standing authorization covers routine repository setup and supersedes the skill's default repeat write-approval step. No new governance or external commitment was inferred.

| Decision | Evidence / reason |
| --- | --- |
| Keep root instructions short and link current handoffs | Forty lines, including markers/provenance and section spacing. No copied stack inventory, changing story counts, full command catalogue or duplicated acceptance criteria. The current story handoff stays in TODO/RESUME rather than becoming a stale root instruction. |
| Keep project authorization and actual-writing protection at root | These apply before entering a source directory and cannot be delegated safely to a child file. Tests must use temporary writing data and preserve the user's running-session generated files. |
| Keep cross-component authority/publication rules | Renderer/utility boundaries, matched WRT/JSON/catalog state, one universe, original operation IDs and saved-cut/reference retention affect multiple adapters and cannot be inferred safely from one edited file. |
| Retain observed recovery/exit/keyboard lessons | The October 22 fix specs document trapped reconciliation, failed-close escape and competing keyboard/focus handlers. Rules link back to current contracts rather than perpetuating historical blanket close refusal. |
| Add command caveats, not a duplicate package manifest | Direct focused tests, positional desktop scenarios, shared Forge output, native-hook bypass and guarded resource replacement are not explained by script names. Obvious script definitions remain in package.json and command examples in README. |
| Correct stale README statements | Root README no longer says coding integration is unfinished or that resource setup writes notices. Domain/infrastructure/native READMEs distinguish prior source-only work from actual local checks, retaining unverified macOS/Windows and installed-durability gates. |
| Preserve existing evidence scope | No story was newly accepted; Stories 1.1/1.2 remain done and 47 remain in review. Local passes do not close TECH/platform/release acceptance. |

The root file is `AGENTS.md`, the repository instruction entry point for Codex sessions started at this root. Other harnesses can point their own rule entry point at it; no unverified nested-file loading or other-harness import mechanism was introduced. The current session read the file directly. No branch/PR policy was invented and no commit was created. Refresh the block after significant command/architecture changes; record demonstrated agent mistakes when they happen, preferring an executable check where one can enforce the actual rule. Existing runtime validation and regression checks remain in place; no prose-only rule was replaced by a partial automation claim.

## Fresh verification

Host: Linux x64; Node v24.19.0 and npm 11.17.0. These are the observed verification environment, not new minimum supported versions. `package.json` declares Node >=22.16.0. Code baseline: `03687967ba70c0adf49e746b5fa3eddbce997421` plus the current documentation working tree.

| Command | Fresh result | Practical limits |
| --- | --- | --- |
| `npm run typecheck` | PASS | TypeScript compilation check; no app launch. |
| `npm run lint` | PASS | Deny-warning lint over src/tests/scripts; not architecture or runtime certification. |
| `npm test` | PASS, 98/98 tests across ten chained files; zero failures/skips/cancellations | Ran outside the managed execution sandbox's previously observed subprocess-stream restriction; Electron's own security settings were not relaxed. Converter/runner fixtures are Node processes, not actual LibreOffice conversion or Electron smoke. |
| `npm run test:desktop -- writing menus error-quit` | PASS, selected writing/menu/error-exit scenarios plus automatic recovery-notice relaunch | Real secured Electron with temporary Forge bundles, profile/project/universe/backup fixtures. Only these four results, not every registered desktop scenario or installed platform. |
| `npm run build:native` | PASS for Linux branch | Linux intentionally skips addon compilation. No Windows/macOS binary or installed-loader claim. |
| Planning helper checks | PASS; see [summary](plan-07-evidence/summary.json) | Story structure/traceability and sprint format/refresh checks do not test product behavior. |

Command output is retained in [typecheck.txt](plan-07-evidence/typecheck.txt), [lint.txt](plan-07-evidence/lint.txt), [tests.txt](plan-07-evidence/tests.txt), [desktop.txt](plan-07-evidence/desktop.txt) and [native.txt](plan-07-evidence/native.txt). The desktop [results](plan-07-evidence/desktop-results.json) and selected scenario logs are copied here; the original temporary evidence path is printed in desktop.txt. [Summary](plan-07-evidence/summary.json) records command exits, input hashes, Node test totals, desktop scope and unchanged `.webpack` fingerprints.

## Commands inspected without repeating execution

- `npm ci` / `npm run setup:resources`: require initial downloads; resource setup is guarded against an existing LibreOffice tree. The script checks pinned bytes, extracts a matching-host runtime, copies fonts and writes a receipt. Notices are maintained separately. No dependencies/resources were replaced for this task.
- `npm start` / `npm run smoke`: ordinary launch and seven-fault Forge smoke share `.webpack`; do not run concurrently with packaging. Actual development smoke was not rerun here.
- `npm run package` / `npm run smoke:packaged` / `npm run make`: packaging requires matching-host native resources, converter receipt, executable, fonts and notices. A pre-existing `out` bundle is not current-source evidence. No package, installer, release upload or installed acceptance ran.
- Focused `.ts` / `.tsx` Node commands documented in README have the same loader form used by the freshly passed registered suite. `npm test -- <filter>` is not the targeting interface for this chained test script.
- Desktop scenarios are positional and inherit a working display; they bypass Forge hooks, so macOS/Windows require their native addon built first. The default runs all registered scenarios, whose list belongs in `scripts/verify-desktop.mjs` rather than a copied count in instructions.

## Remaining delivery work

PLAN-01–07 are complete. Resume Story 1.3 review/acceptance against the existing implementation, then follow story dependencies. Full conformance, interruption/durability, export fidelity, accessibility, performance and installed-platform/native/runtime evidence remain the existing TECH/BUILD/VERIFY work. Windows/Intel Mac/Apple Silicon test access remains unconfirmed. This task neither reimplemented existing features nor accepted the remaining 47 stories.
