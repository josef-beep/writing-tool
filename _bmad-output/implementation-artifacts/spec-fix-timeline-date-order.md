---
title: 'Order timeline records oldest first everywhere'
type: 'bugfix'
created: '2026-10-21'
status: 'done'
route: 'oneshot'
baseline_commit: '876810fbfac3ea439c21160fdf322d1317dd2e48'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="Explicit user instruction and standing implementation approval">

## Intent

Order timeline events by fictional date, with the oldest at the top and newest at the bottom. Apply one chronology to the graphic, event/decision picker and unresolved-decision list, including after date edits and in floating panels. Preserve complete in-range population, same-date tie order, visibility filters, canonical records and bigint/calendar precision.

</frozen-after-approval>

## Implementation Notes

No unresolved intent choices, irreversible actions or new interfaces. Existing dirty renderer bundles belong to the running development app and remain outside this change. The renderer webpack config needs no change.

Investigation: `Chronology.tsx` sorts only the filtered records used to construct graphic date groups. Its raw event-then-decision array feeds the picker and unresolved list without sorting. Storage snapshots are read in record-ID order, so those surfaces expose arbitrary order. Sort the shared dated-record array once using the existing exact calendar comparator, same-date order and ID tie-break; reuse it for all three surfaces. Keep filtering/grouping and layout behavior intact.

Files: `src/presentation/workspace/Chronology.tsx`; registered presentation tests for arbitrary storage order, negative years, calendar versions, same-date ties and lookup/list order; the existing isolated Electron timeline scenario for real picker order in docked/floating panels and reordering after a date edit. Run the regression before/after, typecheck/lint, relevant registered tests and native Electron scenario, then configured independent review. Preserve existing application data and generated bundles.

Implemented one memoized chronological record array using `compareDates` (exact elapsed positions), then numeric same-date order and the existing UUID tie-break. Graphic grouping, the picker and unresolved list now all consume that array. No stored dates, record order values or IDs are modified by rendering.

The new pre-fix picker assertion failed with AFTER/END appearing before BEFORE and the same-date records in reversed storage order. It now passes. A second fixture verifies negative years, two calendar versions with different year lengths, interleaved events/decisions, numeric same-day ordering, oldest-first unresolved lookup and date-edit reordering. The native Electron scenario verifies actual picker and graphic order before and after changing a saved event's date, then carries that order into the floating panel, resized/scrolled display and compressed wide interval. Native close completes its required revision and backup.

Verification: typecheck, deny-warning lint, whitespace check, 15 registered presentation tests and `npm run test:desktop -- timeline` pass. Fixture data, builds and profiles are temporary. Existing generated renderer bundle edits remain outside this change. Evidence is retained under `timeline-date-order-evidence`.

## Review Triage Log

- Low, patched — The first event date edit preceded floating-panel creation. Added another saved event date edit with the panel already open, then verified the mounted graphic and picker both reorder chronologically.
- Low, patched — A fresh server render did not verify mounted unresolved-list updates. Added real decisions to the open floating panel, enabled unresolved-only mode, changed a decision's saved date, and verified the existing lookup, graphic and picker reorder.
- Low, patched — Distinct same-date order values left the ID tie-break untested. Added equal-date/equal-order events with reversed deterministic UUIDs and asserted ascending ID order.
- Low, patched — Existing ties could pass with events always ahead of decisions. Added a decision with lower order than its same-date event and asserted it appears first across the shared chronology.

All configured review findings are resolved; no new issues were deferred. Final typecheck/lint, all 15 presentation tests, whitespace check and Electron timeline scenario pass after these additions. Required closing revision and backup complete normally.
