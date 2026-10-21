---
title: 'Close the previous menu when another opens'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: 'f8a95fcd3368832c866ab8e6d9e5979b2128694e'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="Explicit user request to fix menu exclusivity; existing execution approval covers routine UI corrections">

## Intent

Opening a dropdown menu closes the previously open menu in that window. Apply this to the main toolbar, including portaled workspace menus, and panel Move menus. Preserve native mouse/keyboard toggling, existing commands and independent non-menu disclosure panels. Keep current writing data and generated development bundles intact.

</frozen-after-approval>

## Implementation Notes

No unresolved intent choices or irreversible actions. The source is clean; existing dirty `.webpack` files belong to the running app and are outside this change. Do not commit or replace those files.

The toolbar menus in `src/presentation/index.tsx` and `src/presentation/workspace/Workspace.tsx`, plus Move menus in `PanelContent.tsx`, are independent native details elements. Give every dropdown the same native details name, which enforces exclusivity across their DOM locations without adding application state. Visibility filter disclosures remain independent. The supplied renderer configuration needs no change.

Add a targeted real-browser regression to the existing desktop verifier: click each toolbar category, switch between toolbar and panel Move menus, toggle the same summary closed, and open another category by keyboard. Confirm one menu remains open, independent disclosures retain their state, and normal closing captures succeed. Compile with the actual Forge configurations into temporary output; use fresh test profiles/roots only. Run typecheck/lint and the targeted desktop scenario, then independent review.

Completed 2026-10-21. All eight toolbar menus and three panel Move menus share `name="writingtool-menu"`; independent visibility disclosures remain unnamed. The regression covers every toolbar category, toolbar/panel transitions, same-summary closing, native pointer targeting, Enter and Space activation, independent disclosure opening, and the portaled View → Font and layout command followed by opening another menu. The evaluator propagates renderer exceptions explicitly. The desktop verifier accepts scenario names and retains all scenarios as its default.

Validation: `npm run typecheck`, `npm run lint`, `git diff --check`, and `npm run test:desktop -- menus` pass. The final Electron run completed a required closing revision and complete backup before exiting. Builds and profiles are temporary; existing `.webpack` modifications were left intact. The initial managed run could not initialize Chromium's sandbox; the successful run used approved process access. Retained evidence: [menus desktop result](exclusive-menu-evidence/results.json) and [Electron log](exclusive-menu-evidence/menus.txt).

## Review Triage Log

- Low, patched — Programmatic summary clicks do not exercise pointer targeting. Added native pointer toolbar-to-toolbar and panel-to-toolbar transitions with exclusive-open assertions.
- Low, patched — Keyboard coverage omitted Space, panel Move activation and closing. Added native Enter/Space input, a panel summary and same-summary Space closing.
- Low, patched — Independent disclosure coverage was one-directional. Open its summary while a panel menu is open and confirm both survive; then switch to a toolbar menu and confirm disclosure state survives.
- Low, patched — No command was executed after switching menus. Invoke the portaled View → Font and layout command, verify the Settings form, then open Project and confirm it is the only open menu.
- Medium, deferred — The command check exposed pre-existing dropdown dismissal failure for portaled commands. The Settings form opens, but View remains open until another summary is activated. Baseline `f8a95fcd3368832c866ab8e6d9e5979b2128694e` already places the close-on-command React handler on Shell's nav while rendering commands through Workspace portals; portal events follow the React ancestry rather than the nav's DOM ancestry. Menu exclusivity still passes. Recorded separately in `deferred-work.md`.
