---
title: 'Calendar-based timeline intervals'
type: 'feature'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: '833e27804002bf19b4db6694b194a08597a9a70e'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="Explicit user request and standing implementation approval">

## Intent

Let the timeline display days, months, years, decades or centuries through an interval selector. Change its scale and period labels, keeping every matching event individually selectable and ordered oldest first. Use the universe's configured calendar, synchronize the interval between docked and floating panels, and preserve zoom, range navigation, chapter/event focus, filters and canonical data.

</frozen-after-approval>

## Implementation Notes

No irreversible actions or unresolved intent questions. Existing generated renderer bundle edits belong to the development app and stay outside this change. This is one presentation feature; no stored-data migration, dependency or renderer webpack change is needed.

Calendar choices: days retain exact daily groups; months use actual configured month boundaries, with standalone calendar days kept as separate named positions. Calendars without months disable Months with an explanatory hint rather than inventing a month length. Years use current calendar year boundaries, decades span floor-aligned multiples of ten years, centuries multiples of one hundred, including negative years. Coarse groups retain all exact-dated event/decision buttons, displaying each record's full date alongside its code.

Use one shared interval field on `TimelineView`, validated through the existing native presentation boundary. A small presentation arithmetic module derives exact bigint period starts/labels and calendar-based default ranges (existing daily overview; one calendar year of months; ten years/decades/centuries respectively). Zoom adjusts the visible span; chapter/event focus retains its exact requested range. Selecting an interval starts at the containing period and resets zoom; earlier/later navigation remains range based. If calendar edits remove months, fall back to Days without changing any event. Scale pixels by the selected unit rather than allocating day-sized gaps to centuries.

Files: `src/domain/calendar.ts` (month availability); `src/application/contracts/presentation.ts` (interval type/default/validation); new `src/presentation/workspace/timeline-interval.ts` (calendar period arithmetic); `Chronology.tsx` (selector, coarse labels/grouping, scale/range); `Workspace.tsx` (calendar-change fallback); presentation tests (calendar boundaries/negative years/unequal months/standalone days/validation/focus/all records); desktop verifier/fixture (all five UI choices, zoom/navigation, floating roundtrip and existing timeline regressions). Keep chronology/selection/filter logic and intrinsic nonoverlapping rows. Give the event picker a stable accessible selector so a second select cannot change test targeting. Run typecheck, lint, relevant registered tests and actual isolated Electron checks, then configured independent review and fixes.

Implemented all five choices through the shared timeline view. Coarse labels use current-calendar boundaries while event dates are converted only for display; records retain their original calendar version/date. All buttons remain in exact oldest-first order, with full dates shown in coarse views. Native validators reject unsupported month intervals; the owner falls back to Days if a calendar edit removes months. Month pixel averaging affects spacing only, never month boundaries or event selection. Default ranges and zoom remain bigint-safe.

Interaction fixes found during review: First/Last record anchors to the actual record so high zoom cannot miss it. Coarse label clicks focus the entire represented period at normal zoom. The focused-range span now equals the distance between its inclusive endpoints, preventing an extra day beyond the requested end. New-event creation uses the visible clipped mark's date. Point focus retains its existing 31-day overview behavior.

Final validation: `npm run typecheck`, `npm run lint`, `git diff --check`, **87 registered tests** via `npm test`, and `npm run test:desktop -- intervals timeline` pass. The 17 presentation tests cover all-unit population/order, unequal months, standalone days, negative/very large years, nonzero anchors, historical versions with different year lengths, view validation, focus and floating serialization. Native scenarios verify every coarse event's exact displayed date, nonoverlap and pointer reachability; late-century Last record at 64×, full-period focus, clipped creation, zoom/navigation, month removal, floating/docking synchronization and the earlier timeline/date-order regressions. Every native scenario completes its required closing revision and complete backup. All builds, profiles and mutations use temporary fixtures; existing user data and generated bundles remain untouched.

Evidence: [native results](timeline-intervals-evidence/results.json), [interval scenario](timeline-intervals-evidence/intervals.txt), [timeline regression](timeline-intervals-evidence/timeline.txt), [verification summary](timeline-intervals-evidence/summary.json).

## Review Triage Log

- Medium, patched — Bucket-start First/Last navigation could hide the selected record at high zoom. Anchor to the actual record; native coverage moves a record to year 99 of its century and confirms Last record shows it at 64×.
- Medium, patched — Coarse label clicks reused single-date focus. Periods now expose exact inclusive ends and label clicks focus the full period at normal zoom; native coverage restores all century events after the 64× Last record test.
- Medium, patched — A clipped coarse group could create a new event before the visible range. Create at the rendered/clipped position; native coverage focuses a year view from day 2 and verifies the unsaved event is prefilled with day 2, then discards the fixture draft.
- Low, patched — Arithmetic coverage lacked nonzero anchors and mixed year lengths. Added anchor year 42, a historical 100-day configuration and current 61-day calendar; assert exact current bucket starts/ends and unchanged historical dates.
- Low, patched — The declared standalone day had no native event. Added a Festival event and require its named monthly group and exact date in every coarse view.
- Low, patched — Coarse native coverage counted buttons only. Verify every visible event's exact date, group bounds and reachable hit target in Months/Years/Decades/Centuries, and open a late-century canonical record.

All configured findings are resolved. No new issues were deferred.
