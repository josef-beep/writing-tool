---
title: 'Keep every event in the visible timeline interval accessible'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: 'cd00f57f15ecfec0c78e43010b33940ca7b1673e'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="Explicit user requirement; standing execution approval covers routine implementation and verification">

## Intent

Show every event within the timeline's current visible date interval. Keep same-date events individually selectable and prevent overlapping date groups from hiding records when labels wrap, fonts grow or a long interval compresses nearby dates. Preserve chronology, range boundaries, existing selected filters, decisions, zoom/panning and canonical editor navigation in docked and floating timelines.

</frozen-after-approval>

## Implementation Notes

No unresolved intent choices, irreversible actions or public interfaces. The working tree is clean at baseline. `Chronology.tsx` already selects all matching records using inclusive bigint interval comparisons. The presentation can nevertheless hide them: absolute group tops use estimated per-record heights, which do not account for wrapping, font size, New event controls or capped long-range scaling. The shared component is used in both docked and floating panels.

Replace absolute placement with intrinsic-height chronological rows in normal flow. Retain proportional minimum date gaps and the existing bounded pixel conversion, but allow content to expand each row and the axis. Keep all same-date codes in their group, including the final group, and allow narrow code columns to wrap. No renderer webpack config change is needed.

Files: `src/presentation/workspace/Chronology.tsx` for row spacing/axis sizing; `workspace.css` for intrinsic flow/wrapping; `tests/presentation-integration.test.tsx` for inclusive range, complete same-date population, order and filter preservation; `scripts/verify-desktop.mjs` and `tests/fixtures/desktop-integration.cjs` for a temporary-data Electron timeline scenario proving nonoverlap, scroll reachability and record selection in docked/floating panels with narrow width and large text. Verify a pre-fix failure, then typecheck/lint, relevant registered tests and Electron scenario; run the configured independent review and retain evidence.

Implemented normal-flow flex rows with date-relative minimum heights and an intrinsically expanding axis. Narrow code columns can shrink and wrap. Browser-managed content heights now prevent overlap without measuring/guessing text sizes or introducing extra React state. The last date group contributes its full height to the scrollable axis. Existing bigint range selection, order, filters, chronology and click handlers are unchanged.

Pre-fix Electron reproduction measured **15,859.28125 pixels of overlap** between occupied date groups with 32px application text, a narrow timeline and long labels. Final isolated Electron verification passes for all 16 expected events in an inclusive 31-day interval, excluding records immediately outside both boundaries. It checks every event's actual hit target after scrolling, nonoverlap, reflow after resizing an already scrolled floating panel, a huge interval that reaches the pixel cap, and selection opening the canonical event editor. Both docked and floating panels are covered; native close completes its required revision and backup. Test profiles/records/builds are temporary and existing application data/bundles are untouched.

Registered presentation tests pass (14 tests), including a 60-event same-date fixture with negative years beyond Number precision, birth/background events, chronological ordering, inclusive boundaries, category/maker filters, Show all, unresolved and resolved decisions. Typecheck, deny-warning lint and whitespace checks pass. Evidence: [Electron result](timeline-visible-events-evidence/results.json), [successful log](timeline-visible-events-evidence/timeline.txt), [pre-fix overlap](timeline-visible-events-evidence/before-fix.txt).

## Review Triage Log

- Low, patched — Large absolute years alone did not test compressed relative positions. Added an actual floating timeline interval of 10^30 days with adjacent occupied dates, checking complete population, nonoverlap and hit targets at the pixel cap.
- Low, patched — A button's horizontal center may be outside its visible clipped region. Browser hit testing now intersects button, viewport, screen and scroll-clipping ancestor rectangles on both axes before choosing its point.
- Low, patched — Initial narrow layout omitted reflow after scrolling. Assert the floating viewport is scrolled, resize its width and recheck every group and event's reachability.
- Low, patched — Positive unresolved coverage did not prove resolved records were excluded. Added a resolved decision linked to an in-range event and assert it appears normally but is excluded in unresolved-only mode.

All configured review findings are resolved; no new issues were deferred. Final commands: `npm run typecheck`, `npm run lint`, `node --import tsx tests/presentation-integration.test.tsx`, `git diff --check`, `npm run test:desktop -- timeline`.
