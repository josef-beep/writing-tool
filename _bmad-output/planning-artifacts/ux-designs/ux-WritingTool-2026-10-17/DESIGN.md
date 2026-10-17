---
name: WritingTool
description: Approved Preview gray visual baseline for the local WritingTool desktop
  workspace.
status: final
phase: handoff
updated: '2026-10-17'
sources:
- ../../../specs/spec-WritingTool/SPEC.md
- ../../../specs/spec-WritingTool/contracts.md
- ../../../specs/spec-WritingTool/requirements.md
- ../../epics.md
- .memlog.md
- .working/color-themes-4.json
- .working/color-theme-contrast-check.json
- mockups/workspace.html
- mockups/chooser.html
- mockups/recovery.html
- mockups/timeline.html
- mockups/decision-tree.html
- ../../.working/database-export-scope-proposal.md
colors:
  surface: '#E7E7E7'
  surface-raised: '#F4F4F4'
  ink-primary: '#222222'
  ink-secondary: '#444444'
  border: '#666666'
  focus: '#111111'
  editor-background: '#C8C8C8'
  editor-ink: '#111111'
  editor-border: '#333333'
  editor-focus: '#111111'
  decision-foreground: '#17468A'
  decision-surface: '#DCE9FF'
  decision-ink: '#123868'
  event-foreground: '#8F1D1D'
  event-surface: '#FFE3E3'
  event-ink: '#7B1717'
  success: '#205A2A'
  success-surface: '#E1F0E3'
  success-ink: '#204C28'
  error: '#8F1D1D'
  error-surface: '#FFE3E3'
  error-ink: '#7B1717'
  selection: '#333333'
  selection-ink: '#FFFFFF'
  surface-dark: '#292929'
  surface-raised-dark: '#363636'
  ink-primary-dark: '#F2F2F2'
  ink-secondary-dark: '#CECECE'
  border-dark: '#AAAAAA'
  focus-dark: '#FFFFFF'
  editor-background-dark: '#B6B6B6'
  editor-ink-dark: '#111111'
  editor-border-dark: '#333333'
  editor-focus-dark: '#111111'
  decision-foreground-dark: '#9FC5FF'
  decision-surface-dark: '#203655'
  decision-ink-dark: '#DCEAFF'
  event-foreground-dark: '#FFB9B9'
  event-surface-dark: '#4A2727'
  event-ink-dark: '#FFE0E0'
  success-dark: '#B9EDBE'
  success-surface-dark: '#1C3D25'
  success-ink-dark: '#D9F7DD'
  error-dark: '#FFBBBB'
  error-surface-dark: '#4C2424'
  error-ink-dark: '#FFE1E1'
  selection-dark: '#D0D0D0'
  selection-ink-dark: '#202020'
typography:
  ui:
    fontFamily: system-ui, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: system-ui, sans-serif
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.5'
  title:
    fontFamily: system-ui, sans-serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  meta:
    fontFamily: system-ui, sans-serif
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
  editor-default:
    fontFamily: system-ui, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 2px
  md: 4px
  lg: 6px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
components:
  button:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.border}'
    radius: '{rounded.md}'
    padding: '{spacing.2} {spacing.3}'
  focus:
    outline: 2px solid {colors.focus}
    outlineOffset: 2px
    note: Against surrounding surface/surface-raised; editor uses editor-focus.
  selection:
    background: '{colors.selection}'
    foreground: '{colors.selection-ink}'
  editor:
    background: '{colors.editor-background}'
    foreground: '{colors.editor-ink}'
    boundary: '{colors.editor-border}'
    focus: '{colors.editor-focus}'
    note: App-wide user-selectable display family/size; default proposal only; export
      unchanged.
  decision-node:
    background: '{colors.decision-surface}'
    foreground: '{colors.decision-ink}'
    boundary: '{colors.decision-foreground}'
  event-node:
    background: '{colors.event-surface}'
    foreground: '{colors.event-ink}'
    boundary: '{colors.event-foreground}'
  error:
    background: '{colors.error-surface}'
    foreground: '{colors.error-ink}'
    boundary: '{colors.error}'
  status-bar:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    note: Quiet durable background outcomes and persistent calendar-update action;
      blocking warnings/failures remain dialogs.
  button-dark:
    background: '{colors.surface-raised-dark}'
    foreground: '{colors.ink-primary-dark}'
    border: '{colors.border-dark}'
    radius: '{rounded.md}'
    padding: '{spacing.2} {spacing.3}'
  focus-dark:
    outline: 2px solid {colors.focus-dark}
    outlineOffset: 2px
    note: Against surrounding surface/surface-raised; editor uses editor-focus.
  selection-dark:
    background: '{colors.selection-dark}'
    foreground: '{colors.selection-ink-dark}'
  editor-dark:
    background: '{colors.editor-background-dark}'
    foreground: '{colors.editor-ink-dark}'
    boundary: '{colors.editor-border-dark}'
    focus: '{colors.editor-focus-dark}'
    note: App-wide user-selectable display family/size; default proposal only; export
      unchanged.
  decision-node-dark:
    background: '{colors.decision-surface-dark}'
    foreground: '{colors.decision-ink-dark}'
    boundary: '{colors.decision-foreground-dark}'
  event-node-dark:
    background: '{colors.event-surface-dark}'
    foreground: '{colors.event-ink-dark}'
    boundary: '{colors.event-foreground-dark}'
  error-dark:
    background: '{colors.error-surface-dark}'
    foreground: '{colors.error-ink-dark}'
    boundary: '{colors.error-dark}'
  status-bar-dark:
    background: '{colors.surface-raised-dark}'
    foreground: '{colors.ink-primary-dark}'
    note: Quiet durable background outcomes and persistent calendar-update action;
      blocking warnings/failures remain dialogs.
---



# WritingTool — Design

**UX specifications are final for handoff.** Jo approved the catalog-only database-export scope and interaction, resolving the remaining UX-phase blocker. Technical contracts, backlog readiness, implementation and installed acceptance remain separate; final UX status does not claim their completion.

## Brand & Style

WritingTool puts Jo’s manuscript beside the universe context needed to write it. Jo selected **Preview gray**, including its shared UI defaults, from the [four-theme comparison](.working/color-themes-4.html) and [machine-readable proposals](.working/color-themes-4.json). Preview gray is now the approved visual baseline; other candidates remain proposals. Dark is first-launch default, with remembered/imported Light/Dark/System available.

The [original workspace](.working/workspace-preview.html) and [top-command update](.working/workspace-preview-v2.html) retain composition value, superseded by the vertical left timeline and later recorded choices. Their illustrative data, dimensions and control geometry are not adopted wholesale. Current spines govern over reference artifacts on conflict; [EXPERIENCE.md](EXPERIENCE.md) owns behavior.

This is the finalized UX baseline, not an implementation result or accessibility certification. Tokens below are adopted; remaining detailed composition is routine implementation work.

## Colors

All 24 unsuffixed semantic color keys are **Light**; each matching `-dark` key is **Dark**. System resolves to the OS mode. Component tokens use the same mapping: unsuffixed components for Light, `-dark` components for Dark; never combine a foreground from one mode with a background from the other.

| Role | Light references | Dark references | Use |
|---|---|---|---|
| Application surfaces | {colors.surface}, {colors.surface-raised} | {colors.surface-dark}, {colors.surface-raised-dark} | Base/raised chrome, menus and status |
| Primary/secondary text | {colors.ink-primary}, {colors.ink-secondary} | {colors.ink-primary-dark}, {colors.ink-secondary-dark} | Labels/content versus subordinate metadata |
| Boundary/focus | {colors.border}, {colors.focus} | {colors.border-dark}, {colors.focus-dark} | Essential boundaries and keyboard focus against chrome |
| Writing | {colors.editor-background}, {colors.editor-ink} | {colors.editor-background-dark}, {colors.editor-ink-dark} | Always gray, never white; no background-color picker |
| Writing boundary/focus | {colors.editor-border}, {colors.editor-focus} | {colors.editor-border-dark}, {colors.editor-focus-dark} | Dedicated dark focus on the lighter gray editor, not the chrome’s white focus |
| Selection | {colors.selection}, {colors.selection-ink} | {colors.selection-dark}, {colors.selection-ink-dark} | Selected fill/text with accessible selected-state semantics |
| Decisions | {colors.decision-foreground}, {colors.decision-surface}, {colors.decision-ink} | {colors.decision-foreground-dark}, {colors.decision-surface-dark}, {colors.decision-ink-dark} | Blue marks/boundaries; blue-toned graph nodes with readable ink |
| Events | {colors.event-foreground}, {colors.event-surface}, {colors.event-ink} | {colors.event-foreground-dark}, {colors.event-surface-dark}, {colors.event-ink-dark} | Red marks/boundaries and event graph nodes |
| Success/match | {colors.success}, {colors.success-surface}, {colors.success-ink} | {colors.success-dark}, {colors.success-surface-dark}, {colors.success-ink-dark} | Calendar match and actual successful outcomes, paired with text/icons |
| Error/mismatch | {colors.error}, {colors.error-surface}, {colors.error-ink} | {colors.error-dark}, {colors.error-surface-dark}, {colors.error-ink-dark} | Field/failure/mismatch feedback, paired with text/icons |

Engineering targets for specified pairs are normal text ≥4.5:1 and essential boundaries/focus ≥3:1. [Independent contrast calculations](.working/color-theme-contrast-check.json) cover 76 selected pairs: all pass; minimum normal text 6.64:1, minimum essential graphic 4.64:1. [W3C reference](.working/contrast-reference.md) explains scope. These numbers do not certify all future composites, platform rendering or full WCAG conformance. Recheck newly composed states against their actual surfaces.

## Typography

Use the adopted system UI stack and role tokens: {typography.ui}, {typography.label}, {typography.title} and {typography.meta}. The role ramp is 14 px regular UI, 14 px semibold labels, 18 px semibold titles and 12 px metadata/status, with tokenized line heights. Support system text scaling without treating these CSS defaults as physical screen dimensions.

Initial writing-display fallback is {typography.editor-default}: system-ui/sans-serif, 16 px regular, 1.6 line height. Jo can choose a font from the installed or bundled collection and adjust its display size. Remember both choices across projects and sessions. This is display-only; preserve saved bold/italic/indent/heading/scene-break formatting. Font inventory, size range and unavailable-family fallback mechanics remain routine platform/licensing specifications.

DOCX/PDF keep approved 12-point serif and 1.5 spacing, independently of editor display. See [DEC-06 export typography](../../../specs/spec-WritingTool/contracts.md#dec-06--manuscript-export-formatting-approved-2026-10-17-partial-decision).

## Layout & Spacing

Consolidated Preview gray references: [workspace](mockups/workspace.html), [launch chooser](mockups/chooser.html) and [recovery comparison/combined editor/final summary](mockups/recovery.html). These apply approved tokens to existing compositions; the workspace illustrates navigation hidden and timeline visible through independent View controls. [Surface coverage](.working/mock-coverage.md) distinguishes mocked, partial and spine-only surfaces; Jo approved continuing with written specifications for remaining partial/spine-only surfaces; no additional mocks are required for this UX handoff.

| Starting region | Adopted composition |
|---|---|
| Left | Project/volume/story/chapter navigation and independently visible dedicated vertical timeline |
| Center | Manuscript; selected record/utility editors or decision tree replace it under navigation guards |
| Right | Character/faction/plot/decision context tabs |
| Top | Project/Writing/Universe/View/Revisions/Backup & Recovery/Export/Settings category dropdowns |
| Bottom | Quiet actual background-success status and persistent calendar-update indicator/action |

Panels independently show/hide through View and support move/dock/float, resizing/collapse and one remembered app-wide layout. Floating close hides; missing-monitor fallback docks to main window. Exact simultaneous left-dock geometry is routine; do not force exclusive timeline/navigation tabs or reopen fixed placement as a compulsory user choice.

Use spacing {spacing.1}, {spacing.2}, {spacing.3}, {spacing.4}, {spacing.5}, {spacing.6}: 4/8/12/16/24/32 px. Standard control padding follows {components.button.padding}. Preview canvas sizes are not minimum windows or breakpoints. Practical panel sizes, overflow, display scaling and floating-window recovery require implementation verification.

The [chooser reference](mockups/chooser.html) establishes launch actions/recents. The [grouped timeline reference](mockups/timeline.html) establishes one same-date axis position and stacked selectable short codes/date label; later accepted proportional gaps and wheel/scrollbar/View zoom govern actual navigation. Neither example codes nor fictional-date placeholders become saved data.

## Elevation & Depth

Distinguish base/raised surfaces using semantic surface colors and essential boundaries. Adopt 1 px boundaries from shared component defaults. No shadow or floating-window elevation scale has been chosen; implement necessary window separation without adding decorative visual language. Preview dashed boxes and letter badges remain annotations.

## Shapes

Use {rounded.sm} for small/editor surfaces, {rounded.md} for standard controls/nodes and {rounded.lg} for large preview-level containers: 2/4/6 px. Icon family and panel-handle geometry remain routine specifications. Status/type meaning must also appear in labels/icons/accessible semantics, never solely color.

## Components

Light primitive defaults are {components.button}, {components.focus}, {components.selection}, {components.editor}, {components.decision-node}, {components.event-node}, {components.error}, {components.status-bar}; their `-dark` siblings explicitly reference Dark colors. Focus outline is 2 px with 2 px offset; editor uses its separate focus token. Selected controls use selection fill/ink. Named surface responsibilities match Experience Component Patterns below; they inherit these primitives rather than inventing another palette.

| Component | Adopted visual rule and remaining routine detail |
|---|---|
| Top command bar | Raised chrome, UI labels, essential boundaries and visible applicable shortcut hints; exact submenu geometry/bindings routine. |
| Project chooser | Approved primary Open project and secondary action/recents composition; apply neutral selection fill/ink for prominent primary action. List metadata remains routine. |
| Panel frame | Base/raised chrome, boundaries, 2/4/6 px radii as appropriate; handle/dock geometry routine. |
| Panel reopen controls | View show/hide; selection fill/ink and semantic checked/visible state; specific focus route routine. |
| Writing navigation | Left hierarchy; UI/meta text and selected fill/ink; hierarchy spacing from scale. |
| Manuscript editor | Editor background/ink/boundary/focus defaults; user-selectable display type; practical line width/padding routine. |
| Display font controls | Button/input primitives and clear selected values; installed/bundled availability handling routine. |
| Context tabs | Raised chrome, label type and selection/focus treatment; content details remain routine. |
| Universe timeline | Vertical initially left, blue decision/red event codes; same-date shared position/date label, proportional elapsed gaps; exact viewport geometry remains technical. |
| Visibility controls | Normal/selected/focus primitives, active indication, Show all, No maker and Hidden by filters; preserve text/semantic distinction. |
| Record editor | Center forms using UI labels, editor/raised surfaces and explicit error states; Save/departure behavior follows Experience. |
| Relationship view | Approved [decision-tree composition](mockups/decision-tree.html): center left-to-right boxes/arrows, code plus existing text/heading; decision/event primitives, textual decision status. Wrapping and viewport mechanics routine. |
| Bottom status bar | Status-bar primitive with meta text; success color plus actual outcome text/icon, persistent calendar-update action. |
| Outcome feedback | Blocking failure/warning dialogs use error/body/button primitives; manual progress center with supported Cancel. Focus/queue/cancellation mechanics require implementation. |
| Revision and backup view | Plain labeled current/selected side-by-side; inherited text/surface/boundary primitives, no diff highlighting. |
| Reconciliation controls | Approved [recovery reference](mockups/recovery.html): list/plain comparison, center combined editor, final summary; source contents remain unchanged until confirmed application. |
| Calendar update indicator | Persistent bottom status with text/icon and Update to current calendar; use primary/secondary text plus appropriate status semantics. |
| Export controls | Manuscript scope/format and catalog source/scope/limitation are clear before Save As. Database export is one consistent `.sqlite` catalog, not external content or complete recovery. Use existing labels/body/error/button primitives for the catalog-only notice, overwrite/live-source rejection, center progress/supported Cancel and saved-path/open actions; see Experience Database catalog export. |
| Settings controls | Center forms with inherited inputs/validation and explicit Save/departure prompt; field grouping routine. |

## Do's and Don'ts

| Do | Don't |
|---|---|
| Apply selected Preview gray Light/Dark tokens and shared defaults | Adopt other candidate palettes or old preview hex values |
| Keep gray editor in Light/Dark/System | Add a writing-background picker or white editor |
| Pair color with status/type text, labels or icons and clear focus | Rely on red/green/blue alone for meaning |
| Keep writing display preferences independent of exports | Change export fonts when writing display changes |
| Preserve panel content, identities and unsaved edits | Interpret panel close as application close or data deletion |
| Verify composed states/scaling/keyboard/platform behavior | Present static color-pair checks as full accessibility certification |
