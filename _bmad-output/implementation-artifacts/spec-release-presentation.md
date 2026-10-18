---
title: 'Release coding pass — connected writing workspace presentation'
type: feature
created: 2026-10-18
status: in-progress
route: dispatch
baseline_commit: a2c200bfd12c56be077e4c9afed731f42cba8eb3
context:
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/workspace-backend-api.md
  - /home/jo/Documents/writing-tool/_bmad-output/implementation-artifacts/workspace-presentation-map.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/workspace-data-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/requirements.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/DESIGN.md
  - /home/jo/Documents/writing-tool/_bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md
---

<frozen-after-approval reason="Approved full release plus explicit coding-first implementation order">

## Intent

Connect the complete authoritative workspace backend to the real desktop UI for Stories 1.4–4.7. Deliver writing organization, Lexical manuscript editing, calendar/timeline, profiles, plots, decisions/tree/context, settings/theme, images and layout as working connected surfaces. History/recovery/export controls are supplied by the subsequent protection/export slice and must be connected there before the coding pass ends.

## Boundaries & Constraints

Preserve approved gray Light/Dark tokens, first-launch Dark, system theme changes, always-gray writing background, top Project/Writing/Universe/View/Revisions/Backup & Recovery/Export/Settings dropdowns, center editors and independent movable/dockable/floating panels. Keep native path authority in main, persistence in the utility host and the renderer isolated. No fake data, disconnected buttons, raw JSON editors as replacement for normal forms, HTML-in-WRT, browser localStorage as authoritative data or silent save failures.

Use the approved exact prompts, personality labels, calendar display/arithmetic, canonical event isolation, link/type/graph/filter rules and saveable incomplete profiles. Backend runtime types/validators and API map are authoritative technical APIs; inspect exports before writing adapters. Same-universe references must remain canonical. Ordinary record/calendar/settings Save stays open. Pending manual forms use Save/Discard/Cancel; manuscript departures auto-save and wait for acknowledgment of the actual required version, retaining newer edits. Back to writing restores chapter/cursor/scroll; Back to tree restores tree context. Native close/project/universe changes must use these same guards.

User explicitly requires all coding before testing: do not run tests, typecheck, lint, development app, builds, packaging or probes. Existing generated `.webpack` changes predate this pass; preserve them. Do not mark implementation verified.

## I/O & Edge-Case Matrix

| Scenario | Input | Expected outcome | Failure |
|---|---|---|---|
| Organize/write | Project, stories/volumes/chapters | Persisted order, independent dates, targets/characters, rich styles | Pending writing retained |
| Calendar/timeline | Signed arbitrary years, configuration/records | Exact labels, proportional vertical gaps and same-date code stacks | Clear validation |
| Profiles/context | Character/faction/decision/plot input | Complete field forms, optional drafts, canonical links/status | Save/Discard/Cancel |
| Navigate/quit | Pending manual or manuscript edits | Required version saved before leaving; newer edits remain dirty | Retry/cancel retains editor |
| Preferences | Theme/font/layout/filter | Persisted app-wide preferences and per-universe synchronized filters | Preserve last committed values |

</frozen-after-approval>

## Code Map

- `src/presentation/index.tsx`: existing Shell owns secure readiness, project/universe opening and profile/native-close guards. Integrate full workspace, do not mount a second disconnected application. Keep current create/open/profile behavior usable.
- `src/presentation/workspace/*`: add cohesive navigation, editor and profile components; use typed backend snapshots/mutations through the preload bridge and requery on activation/reconciliation.
- `src/domain/*`, `src/application/contracts/workspace.ts`, backend API map under implementation artifacts: consume domain helpers for exact dates, sorting, completeness, graph and filters rather than duplicating incompatible rules in UI.
- `src/presentation/manuscript/*`: Lexical adapter round-trips plain WRT and scalar-based formatting. Native editor JSON is transient only; register supported rich nodes, undo/redo and controlled formatting tools.
- `src/presentation/shell.css` or scoped styles: approved tokens, responsive workspace/panels/forms/accessible dialogs and gray writing paper.
- `src/desktop/*`: narrowly extend native installed-font discovery/floating-panel lifecycle if the backend bridge does not already supply it. Child windows retain sandbox/sender/URL protections and cannot become independent writers.

## Tasks & Acceptance

- [ ] Project/story/volume/chapter navigation with real create/rename/order/group controls, chapter targets/dates/character/event associations and usable empty states.
- [ ] Rich text toolbar/editor supporting bold, italic, heading, indent, literal scene breaks, undo/redo, word count and matched save state; import/export adapter preserves Unicode-scalar spans and paragraph identity.
- [ ] Ordered calendar builder, year names, days-only/month/standalone modes, valid mismatch feedback and populated revision preserving elapsed positions.
- [ ] Vertical scrollable/zoomable timeline with same-date red event/blue decision code stacks, fictional date labels, selectable center editors, period focus and out-of-range Go to event/Return to chapter period.
- [ ] Full character/faction forms/viewers with exact guided prompts/waivers, 100-label multiselect, birth/background links, image import/fit, optional roster, population/locations and character-sheet-only affiliations/current faction.
- [ ] Plot ordering, decision type/maker/relevance/result-link editor, acyclic left-to-right connected decision tree, resolved text/unresolved lookup and synchronized persistent filters with Hidden by filters markers.
- [ ] Settings forms/import/export, light/dark/system, installed/bundled font selection and app-wide font size/layout, independent show/hide/dock/floating panel controls with missing-monitor fallback.
- [ ] Unified pending-work navigation/native-close guard, blocking errors with meaningful retry/cancel, quiet bottom status, focus trap/labels/keyboard shortcuts/system scaling/reduced-motion support.
- [ ] Document source integration and coding-only status; leave execution/review to the later test phase.

Given saved workspace records, when using their UI forms/commands, then edits reach authoritative persistence and survive query/reopen by design. Given newer edits while saving, when an older reply arrives, then those newer edits remain pending. Given cancellation/failure, when leaving, then the current draft and context are retained. Given filters or zoom, when changing presentation, then canonical records/links/dates/status remain unchanged.

## Implementation Notes

This spec is staged pending backend completion; inspect its actual public API before implementation. Dependency installation is coding setup, not test execution; use pinned compatible Lexical packages within the approved stack and commit lockfile changes. Do not claim bundled font/runtime availability without actual resources. The next protection/export slice completes the remaining top categories and scheduled operations.

## Verification

Deferred entirely until the release coding pass is complete. Source inspection only; no runtime/compile/lint/test commands.

Dependency metadata retrieved from npm on 2026-10-18: `lexical` and `@lexical/react` are both 0.52.0. Install the needed Lexical family packages at the same exact 0.52.0 version and inspect installed type declarations instead of guessing APIs. Official API reference: https://lexical.dev/docs/react/plugins . No compatibility/runtime checks have run. Parent has prepared Liberation Serif/Sans/Mono font sources inside the actual staged LibreOffice runtime; the resource handoff JSON records locations and notices. Coordinate final resource packaging in the protection/export slice.

## Coding handoff — 2026-10-18

Source implementation added the connected workspace/controller/forms, pinned Lexical adapter/editor, calendar/timeline/tree/context/filter surfaces, settings/theme/layout and secure native font/monitor/mirrored-panel boundary. The existing Shell remains the project/universe/native-close owner. Exact consuming seams, ownership, retained-request acknowledgment behavior and subsequent protection integration are recorded in [workspace-presentation-api.md](workspace-presentation-api.md).

Status remains in progress, implemented-unverified. No tests, typecheck, lint, app, build, packaging or runtime probes were run. Source inspection and installed dependency declarations only. Existing generated `.webpack` changes were preserved. Protection/export/required close captures, bundled font resources/registration, chooser recovery/recents integration and execution/platform/accessibility/performance acceptance remain subsequent release work; this handoff does not claim the coding pass or acceptance complete.
