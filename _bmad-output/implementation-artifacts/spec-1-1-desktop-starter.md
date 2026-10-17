---
title: 'Story 1.1 — Secured desktop starter'
type: feature
created: 2026-10-17
status: done
route: dispatch
baseline_commit: NO_VCS
baseline_snapshot: /tmp/writingtool-story-1-1-baseline.json
review_loop_iteration: 0
context:
  - /home/jo/RiderProjects/WritingTool/_bmad-output/implementation-artifacts/epic-1-context.md
  - /home/jo/RiderProjects/WritingTool/_bmad-output/specs/spec-WritingTool/readiness-contract.md
---

<frozen-after-approval reason="Story 1.1 and standing execution pack approved by Jo">

## Intent

**Problem:** WritingTool has approved planning but no runnable desktop application. Jo needs the local application foundation before writing/universe features can be added.

**Approach:** Adapt the official Electron Forge Webpack/TypeScript starter with React into a secured desktop window, using a typed non-mutating readiness round trip through the dedicated utility-process application host. Verify development and locally packaged runtime paths.

## Boundaries & Constraints

**Always:** Preserve existing planning/IDE/solution files. Source boundaries are `src/domain`, `src/application`, `src/presentation`, `src/infrastructure`, `src/desktop`; adapters depend inward. Main owns windows/lifecycle, utility process hosts application use cases. Sandbox/contextIsolation true; nodeIntegration false; bounded bridge and validated sender/request/result/correlation. Follow readiness-contract.md. Apply the adopted Dark palette to the small shell, clearly showing ready/unavailable; expose no future functionality as working. Record actual dependency/build evidence. Standing authorization covers routine implementation/review/fixes without phase approval.

**Never:** Generic filesystem/SQL/IPC bridge, remote navigation/new privileged windows, renderer Node access, readiness that creates writing data, future feature tables, full-editor/recovery/installer claims, global sandbox disabling as production behavior, modifying frozen approved product intent. Only Story1.1 is being implemented now.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Ready | Trusted renderer; live utility application host | Valid correlated protocol1 ready result; UI ready | No writing store mutations |
| Bad request | Unknown keys/version/query/invalid UUID | Reject before host dispatch | No generic bridge or privileged action |
| Bad result | Wrong shape/version/request correlation | UI unavailable with INVALID_RESPONSE | Never falsely ready |
| Host unavailable | Fork failure, process exit or timeout | UI unavailable with defined code | Bounded wait/pending cleanup; no crash/hang |
| Untrusted renderer | Other frame/origin or new navigation | Deny IPC/navigation/window creation | Do not expose application privileges |
| Packaged | Local Linux package; bundled Electron runtime | Same React/preload/utility readiness path works | Clear failure report/nonzero smoke exit |

</frozen-after-approval>

## Code Map

- Repository currently contains planning/IDE/solution files; no application package/source. VCS unavailable (`git status` reports no repository); keep baseline NO_VCS and stage a before/after filesystem diff for review.
- Official scaffold is installed successfully under the path recorded in `/tmp/writingtool-starter-path.txt`; use its files as the starter provenance, not a hand-built substitute. Forge8 replaced `webpack-typescript` with `--template webpack --typescript`; preserve Webpack/TS choice.
- Registry verified create-electron-app/Forge8.0.1, Electron44.9.0, React19.3.1, TypeScript latest7.0.2. Starter selects its compatible TS6 range; verify actual installed versions and adjust normal dependency compatibility as needed. Do not claim untested candidates verified.
- Root `package.json`, `forge.config.mts`, Webpack/TypeScript configs and `src/` are new; preserve `_bmad`, `_bmad-output`, `.idea`, WritingTool.sln and existing synthetic `.git`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, lockfile, Forge/Webpack/TS configs, `.gitignore` — import/adapt official starter; add React; configure strict types, executable checks, utility-host bundling and package inclusion.
- [x] `src/application/contracts/readiness.ts`, `src/application/readiness.ts` — implement closed shared types/runtime validation and non-mutating application query; no framework imports inward.
- [x] `src/desktop/*` — bounded preload, trusted-window main bridge, correlated utility communication, lifecycle/timeout/failure cleanup, packaged host path and navigation security.
- [x] `src/presentation/*`, local HTML/CSS — render the Dark shell and observable readiness/unavailable states, with accessible status/focus; do not invent project/editor behavior.
- [x] `tests/*`, `scripts/*` — meaningful protocol/error/security/boundary tests and real development/packaged smoke automation exercising the bridge and failure path. Cover every matrix row; do not rely only on mocks/config assertions.
- [x] `README.md`, evidence note in implementation-artifacts — document install/start/typecheck/test/lint/package/smoke commands, verified versions, actual local results and platform limitations.

**Acceptance Criteria:**
- Given a clean checkout and documented prerequisites, when installation/start runs, then the official Forge Webpack/TS-based React desktop shell opens and inner layers remain framework-independent.
- Given the secured local window, when readiness is requested, then it traverses preload/main/live utility/application and returns only a validated result; no writing data is created.
- Given malformed/unauthorized communication or failed utility startup/response, when checked, then privileges are denied or readiness becomes unavailable, with bounded cleanup and no false-ready acknowledgment.
- Given a local packaged executable, when started using its bundled runtime, then the renderer/preload/utility path works without a separate Node executable for the app; automated smoke evidence records both success and host failure.
- Given the starter, when inspected, then no future database/editor/recovery functionality or untested full platform coverage is claimed.

## Implementation Notes

Official scaffold adapted and clean install, typecheck, lint, fifteen tests and seven scenarios each in real development and packaged Linux passed. See [evidence](story-1-1-evidence.md). Parent independently read source diff, protocol/security tests and evidence; added canonical UUID trailing-line-ending negative vectors (current JavaScript regex already rejects them). Matrix coverage: malformed requests/results and correlation in tests1/3/5; live query/nonmutation in2/4 and both smoke suites; host startup/exit/timeout/bounds/cleanup in5/6 and smoke modes; unauthorized/frame/origin in7 and live foreign-window/navigation probes; packaged path verified without Node on app PATH. All three independent review layers completed; sixteen individual findings resolved in grouped patches. Parent verified patches, strict types, all15tests, deny-warning lint, seven development scenarios, rebuilt package and seven packaged scenarios. No story finding deferred; inherited toolchain advisories and actual Windows/macOS acceptance remain open.

Standing approval: execution-approval.md adopted 2026-10-17. No intent gaps; no user data/external publishing/irreversible actions. The new package/source/tests are a cohesive shell-only story. Implementation may choose routine bundling/test details and record them here.

## Spec Change Log

## Review Triage Log


| Finding | Verdict | Evidence and route |
|---|---|---|
| blind1: late valid reply poisons client | medium | Reproduced: timeout followed by its valid reply makes next request INVALID_RESPONSE permanently. Patch bounded expired-correlation handling. |
| blind2: later failure erases first diagnostic | low | fail() overwrites failure; invalid response then exit loses the original cause. Direct first-terminal-failure preservation patch. |
| blind3: missing Squirrel lifecycle hook | medium | Maker/dependency configured but main lacks standard startup handling; Windows lifecycle args enter normal startup. Patch handler without claiming installed Windows acceptance. |
| blind4: macOS packaged path | medium | Harness constructs flat executable while bundle executable is nested. Direct platform path patch; actual macOS verification remains open. |
| blind5: Windows npm.cmd launch | medium | spawn has no shell and .cmd is not a native executable. Patch use of Node/Forge JS entry instead of shell launching. |
| blind6: parsing on exit before streams close | medium | Output is parsed at exit although streams may still contain final marker. Patch wait for close and bounded parse failure handling. |
| blind7: Windows descendants survive timeout | medium | child.kill() targets launcher only. Patch bounded process-tree termination; actual Windows test still unverified. |
| blind8: profile cleanup races termination | medium | Timer rejects immediately after signal, finally deletes profile before process closure. Patch await shutdown/close with force fallback before cleanup. |
| blind9: correctness warnings do not fail lint | low | Imported lint policy permits warnings with zero exit; current tests pass but future correctness warnings could silently pass the quality check. Direct deny-warnings flag patch. |
| blind10: throwing transport untested | medium | postMessage catch path not exercised by existing unit transports. Add targeted result/pending/terminal cleanup regression test. |
| edge1: late reply after timeout | medium | Same reproduced root cause as blind1; retain this finding separately, group patch with blind1. |
| edge2: macOS packaged path | medium | Same verified platform path defect as blind4; group patch. |
| edge3: Windows dev launch | medium | Same verified command-script spawn defect as blind5; group patch. |
| verification1: permission handlers lack live coverage | medium | Preverified regression gap: smoke tests check node/bridge/navigation but never permission check/request; mutating handlers would evade checks. Add bounded live permission query/request and prove denial handlers are exercised. |
| verification2: transport exception cleanup gap | medium | Preverified missing catch-branch test; group with blind10 and verify pending timers/results on throwing transport. |
| parent1: utility FatalError has no error listener | medium | Electron documents utility error event and EventEmitter semantics; main registers only message/exit. Handle error as unavailable/host exited, preserving root failure and avoiding main-process unhandled error. Add focused event-path evidence. |

All groups were patched and verified (see evidence note); no open story findings remain. All groups route to patch: existing states/callers are demonstrated, fixes are internal and add no public application interface or change in frozen intent. No intent/spec loopback or additional approval is required. Windows/macOS fixes do not establish platform acceptance. Remaining inherited development-tool advisories remain documented in existing evidence.

## Verification

Run documented equivalents of install, typecheck, lint, protocol/security/boundary tests, development smoke (ready and host failure), package, and packaged smoke. Use the available DISPLAY=:1 for actual Electron checks; environmental sandbox/display limits must be reported accurately. Production security settings must remain intact. Record command outputs and actual tested OS/runtime. Do not mark done with unmet shell acceptance.
