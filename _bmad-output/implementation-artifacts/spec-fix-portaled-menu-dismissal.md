---
title: 'Dismiss toolbar menus after portaled commands'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: 'ba62f6f78fba1419f830cd314bfd986cf115016c'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="User continued the recorded menu-command follow-up; existing execution approval covers routine UI fixes">

## Intent

Close an application's toolbar dropdown when its enabled command executes, including commands rendered through Workspace portals. Preserve command execution, keyboard/pointer activation, menu exclusivity, independent visibility disclosures and panel controls. Preserve current writing data and existing generated development bundles.

</frozen-after-approval>

## Implementation Notes

No unresolved intent gaps, irreversible actions or new APIs. The working tree contains only pre-existing generated `.webpack` edits. Scope is the Shell toolbar handler, the existing menus desktop regression, this record and verification evidence. The supplied renderer config needs no change.

`src/presentation/index.tsx`: Workspace is a logical descendant of Shell's main element, while its menus portal into header nav. Move the React close-on-command handler from nav to main; restrict matching to toolbar command buttons and named dropdowns so unrelated buttons/disclosures/panel controls retain their behavior. This handles React portal propagation after the command's own handler without global listeners or duplicated handlers on every portal.

`tests/fixtures/desktop-integration.cjs`: extend the menus scenario to assert that a portaled View command both opens Settings and dismisses its menu, using actual pointer input. Cover keyboard command activation, existing Shell commands, disabled commands and non-toolbar buttons. Continue using temporary Forge bundles and fixture roots only. Verify the regression fails before the fix, then run typecheck, lint, diff check and the menu Electron scenario. Run the configured independent review and triage its findings before completion.

Implemented the close handler on Shell's main element, which receives portal clicks through React ancestry. It matches enabled buttons under the application toolbar nav and only closes their nearest named dropdown. This preserves command-first React bubbling, native summary activation and independent disclosures without listener lifecycle changes.

Before the fix, the Electron check timed out waiting for View to close after its pointer-activated Font and layout command successfully opened Settings. After the fix, `npm run typecheck`, `npm run lint`, `git diff --check` and `npm run test:desktop -- menus` pass. The scenario verifies native pointer View command dismissal, Enter activation/dismissal of Settings, Shell Edit/Close profile command execution/dismissal, disabled Writing commands keeping their menu open, and Back to writing outside the toolbar preserving the open menu. The independent visibility disclosure remains open and the original exclusivity, panel Move and summary-keyboard checks still pass. Native close completes its required revision and backup.

Builds, profiles and data roots are temporary. Existing generated `.webpack` files remain untouched. Evidence is retained in `portaled-menu-dismissal-evidence`.

Review follow-up: native command dismissal initially moved focus from the hidden command to the page body. If focus remains inside the dropdown when it closes, restore it to that dropdown's summary; leave a command's independently moved focus alone. Electron now asserts the Settings summary is the visible active element after both Enter and Space command activation. Disabled-command coverage uses a native pointer click and asserts both unchanged menu state and unchanged Settings content.

## Review Triage Log

- Medium, patched — Keyboard focus after dismissal had no useful destination. Runtime showed `BODY` active after Enter command execution; restore the summary only when focus is still inside the closing dropdown. Final native Enter/Space tests verify visible Settings summary focus.
- Low, patched — Programmatic `.click()` on a disabled button dispatches no click event. Replaced it with native pointer input and confirmed the dropdown remains open and the Settings view unchanged.
- Low, patched — Space previously covered summaries only. Added native Space button activation and verified command execution, dismissal and summary focus on key release.

Final verification after these fixes: `npm run typecheck`, `npm run lint`, `git diff --check` and `npm run test:desktop -- menus` pass. The original command-dismissal deferred entry is marked resolved; no new issues were deferred.
