---
title: 'Make saved factions easy to reopen'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: 'ff7464caa5ab7f0f82d2518429eaebbfcaba6ef0'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="User reports being unable to reopen a created faction; standing approval covers routine UI fixes">

## Intent

Provide a clear way to find and reopen saved faction profiles after creating them. Named incomplete drafts must remain editable, with saved fields preserved. Preserve save/discard/cancel protections, universe ownership and existing faction data.

</frozen-after-approval>

## Implementation Notes

The clean-profile Electron reproduction successfully creates a faction through Universe → New faction, saves its name, returns to writing and reopens it from the context Factions tab. This did not reproduce a persistence failure. The current Universe menu has no command for browsing saved factions and creation leaves the default Characters tab selected. Make the navigation path explicit rather than changing working storage code.

No unresolved intent choices, irreversible changes or new public APIs. Add Universe → Factions… to open a central saved-faction list independent of context-panel visibility. Reuse canonical `open`/`create` and navigation guards, and show the Factions context tab when creating/opening a faction. The browser lists current universe records and an empty state. Keep incomplete drafts saveable. The renderer config needs no change.

Files: `Workspace.tsx` for navigation/center route; a small faction browser component with registered render coverage if useful; `scripts/verify-desktop.mjs` and `tests/fixtures/desktop-integration.cjs` for isolated create/save/reopen/edit/hidden-context/floating/guard regression. Preserve the pre-existing generated bundles and the user's previous uncommitted commented-out timeline button in Chronology and its related test block. Build into temporary output and use only temporary project/universe/profile fixtures. Run typecheck/lint, presentation tests, targeted native regression and configured independent review.

Implemented Universe → Factions… with an accessible central saved-faction list and empty state. Opening or creating a faction selects the Factions context tab. Faction editors entered from the browser return through Back to factions; the destination is captured before pending-edit guards so discarding a newly created draft still returns to the browser. Return-to-browser state only carries between faction editor/browser routes and does not override tree or writing navigation.

The native regression creates and saves a named incomplete faction, reopens it from context, edits its description and reopens it with context hidden. It tests switching from Characters before opening, Back to factions, Cancel/Discard/Save-on-navigation and discarded unnamed drafts. It closes both project and universe, reopens the project and verifies the saved description, then reopens the canonical record from floating context. The standalone universe between project close and universe close also exposes the saved faction through the browser. Save checks wait for the actual acknowledged Saved. state rather than matching initial editor status text.

## Review Triage Log

- Low, patched — Editors opened/created through the browser lacked a return route. Added Back to factions, preserved through save/discard guards, with native return and unnamed-draft discard checks.
- Low, patched — A generic div's aria-label did not identify the collection semantically. Use a named `ul` with individual `li` entries and normal button actions.
- Low, patched — Earlier tests never changed context away from Factions before opening. Select Characters from the browser, reopen the faction and assert Factions is selected.
- Low, patched — Navigation coverage omitted Save. Save the pending description while navigating, reopen and verify it, including after closing/reopening stored owners.
- Low, patched — Same-session snapshots alone did not establish durable reopening. Close the project and universe, reopen the project and verify the same saved faction and description.

Final checks pass: `npm run typecheck`, `npm run lint`, 17 registered presentation tests, `node --check tests/fixtures/desktop-integration.cjs`, `git diff --check`, and `npm run test:desktop -- factions`. The final native flow includes every guard and reload assertion above, and completes a required closing revision and complete backup before exit. No stored-data or webpack configuration changes were made. All five review findings are resolved and none were deferred.

Evidence: [native result](faction-reopening-evidence/results.json), [final Electron log](faction-reopening-evidence/factions.txt), [baseline context-tab reopening](faction-reopening-evidence/baseline.txt). The baseline did not reproduce data loss or a failure to open an existing context-list button; this change supplies the missing direct toolbar navigation and preserves existing storage behavior. The prior commented timeline button and its associated test block remain in the working tree outside the faction commit.
