---
name: WritingTool
description: Approved desktop layouts, interactions, states and journeys for WritingTool.
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
---




# WritingTool — Experience

**UX specifications are final for handoff.** Jo approved the catalog-only database-export scope and interaction, resolving the remaining UX-phase blocker. Technical contracts, backlog readiness, implementation and installed acceptance remain separate; final UX status does not claim their completion.

## Foundation

Jo selected **Preview gray** and shared UI defaults from the [palette reference](.working/color-themes-4.html)/[tokens](.working/color-themes-4.json). [DESIGN.md](DESIGN.md) now defines Light unsuffixed and Dark `-dark` color/component tokens. Dark first launch and remembered Light/Dark/System remain. [Contrast checks](.working/color-theme-contrast-check.json) pass all 76 selected declared pairs, not full accessibility/runtime certification.

Jo writes locally on one machine, connecting manuscript work to a shared universe's chronology, characters, factions, plots and established decisions. All CAP-1–12 and reconciled FR-1–49 remain first-release scope; [SPEC.md](../../../specs/spec-WritingTool/SPEC.md), [requirements.md](../../../specs/spec-WritingTool/requirements.md) and later resolved [contracts.md](../../../specs/spec-WritingTool/contracts.md) own domain/validation rules. This document distills their UX consequences without replacing their full field matrices or technical gates.

The approved [workspace preview](.working/workspace-preview.html) establishes the main composition and darker/gray direction. Its exact controls and measurements remain provisional. [DESIGN.md](DESIGN.md) owns visual constraints; apply the adopted mode mapping and component defaults. Spines govern over illustrative references when a recorded decision differs.

Local operation requires no cloud service. Missing/unwritable local files, unavailable drives, failed saves, conversion errors and conflicting recovery data are meaningful failure states. Offline network status alone does not prevent local writing/export. Use a top command bar with category dropdowns for all commands; preserve approved hierarchy/context navigation and contextual actions. Keyboard and mouse operation are required, with shortcut hints shown for applicable commands. Exact bindings, component library and modal focus/queue mechanics remain implementation specifications. Resolve recovery conflicts through manual choices and explicit confirmation. Do not merge automatically.

## Information Architecture

Approved references: [workspace](mockups/workspace.html), [chooser](mockups/chooser.html), [recovery comparison/combined editor/final summary](mockups/recovery.html), [vertical timeline](mockups/timeline.html) and [left-to-right decision tree](mockups/decision-tree.html). They apply Preview gray to approved compositions; sample records and geometry remain illustrative. The workspace shows navigation hidden and timeline visible through independent View controls. The [earlier top-category sketch](.working/workspace-preview-v2.html) remains historical context. Jo accepted written specifications for remaining partial/spine-only surfaces in the [coverage map](.working/mock-coverage.md); no additional mocks are required.

“Unresolved” below means behavior exists in scope but a route or container has not been chosen; it does not defer that capability.

| Surface | Accepted entry or position | Purpose and unresolved form |
|---|---|---|
| Project chooser | Application launch | Open project primary; New project/Open universe/Recover from backup secondary; recent-project list for quick reopening; missing/moved entry offers Locate project/Remove from recents/Cancel; exact list metadata/state styling unresolved |
| Main workspace | Selected through project chooser on launch; no automatic last-project reopen | Left hierarchy, center writing, left-docked vertical timeline, right context tabs; independent View visibility; simultaneous left-dock geometry routine; approved preview |
| Project/volume/story organization | Writing navigation and top category dropdown commands; Project commands; exact forms routine | Select and organize project-owned stories/optional volumes |
| Manuscript/chapter details | Chapter selection | Writing, independent dates, character associations and informational targets; detail-field placement unresolved |
| Calendar setup | Universe dropdown opens center; Back to writing from chapter context | Configure chronology under accepted calendar rules; detailed form/active-operation handling unresolved |
| Universe selection/profile | Universe/timeline selection synchronize; exact controls unresolved | Identify one owning universe, name/description and shared content |
| Universe timeline | Left initially (supersedes bottom); movable; dedicated vertical graphical control with top-to-bottom line and selectable intersecting horizontal marks: blue decisions, red events | Chronology, chapter focus, new-event entry and contextual visibility |
| Event editor | Timeline position or chapter event action/Edit event link | Dedicated canonical event editor in the center, temporarily replacing writing when opened from a chapter; ordinary Save keeps it open; Back to writing restores the chapter/cursor/scroll after resolving unsaved changes |
| Character/faction development | Right context tabs expose context; full editors open in center, exact entry control unresolved | Profiles, guided creator, images, background events and character-sheet-only affiliation history; profile editors open in center, stay after Save and prompt on pending-edit departure |
| Story plot | Plot context tab; full editing route unresolved | Story-specific ordered plot entries; center editor, stay after Save, prompt on pending-edit departure |
| Decision editor/types | Decision context; precise editing/type-creation route unresolved | Maker/type/text/date, explicit relevance and validated relationships; center editor, stay after Save, prompt on pending-edit departure |
| Decision tree/unresolved lookup | Tree in center, left-to-right boxes/arrows; exact command entry unresolved; timeline-accessible lookup | Established relationships and unresolved universe decisions |
| Revisions/restoration | Revisions dropdown opens center; side-by-side current/selected versions before restore; Back to writing from chapter context | View/restore items/projects with protective Replaced revisions |
| Backup/recovery/reconciliation | Center; chooser recovery or Backup & Recovery dropdown; Back to writing from chapter context; missing authority prompts locate/recover | Manual ZIPs, standalone-universe recovery and confirmation of conflicts/references |
| Manuscript export | Export dropdown; Save As destination approved | One story, all/selected chapters, four formats and local outcome |
| Settings/import/export | Settings dropdown opens center; Back to writing from chapter context | Independent save/revision/backup/retention, destination, themes and display preferences |
| Database export | Export > Database opens center | One selected project or standalone-universe `.sqlite` catalog snapshot; show source identity/scope and catalog-only limitation. Save As, edit guards, progress/cancel and outcomes follow the adopted workflow; TECH-13 owns exact capture/schema/validation mechanisms. |

## Voice and Tone

Use existing domain terms consistently: maker, relevant to, Universe Events, Personal Decisions, Story Decisions, No maker, Replaced and universe authority. Do not call chapter main/flashback roles “event categories.” A maker can be a faction as well as a character.

Approved action/indicator wording includes **Show all**, **Hidden by filters**, **No maker**, **Edit event**, **Go to event**, **Return to chapter period**, **Update to current calendar**, **Retry now**, **Choose another location**, **Open file** and **Open folder**. Warnings must state what failed and what remains unsaved/incomplete. Never describe failed capture/export as completed. Use approved blocking failure dialogs, quiet bottom-bar success/calendar indicators and center manual progress; surrounding microcopy is routine.

## Component Patterns

Visual counterparts use identical names in [DESIGN.md](DESIGN.md#components). Named components describe responsibilities, not an adopted UI toolkit or container pattern.

| Component | Behavioral contract |
|---|---|
| Top command bar | All commands available at top, grouped into related-category dropdowns; preserve hierarchy/context links. Categories/grouping approved below; keyboard/mouse support and shown shortcut hints required; exact item order/submenus/bindings unresolved. |
| Project chooser | At launch, Open project is the main action; New project, standalone Open universe and Recover from backup are secondary. Recent-project list enables quick reopening; missing/moved entry offers Locate project/Remove from recents/Cancel; exact list metadata/state styling unresolved; retain authority/validation gates. |
| Panel frame | Support independent show/hide through top View commands, approved movement/docking/floating, resizing/collapse and remembered app-wide arrangement including visibility. Floating close hides and retains content; missing saved monitor docks in main window. Eligible panels/targets unresolved. |
| Panel reopen controls | Top View dropdown exposes independent show/hide for workspace controls/panels, including timeline/navigation; visibility is remembered app-wide. Exact focus destination/restored dock geometry unresolved. |
| Writing navigation | Organize/select hierarchy with accepted story/volume ordering; save pending manuscript before leaving. Chapter chronology uses source tie rules, not arbitrary drag ordering. |
| Manuscript editor | Rich formatting and matched current text/metadata survive saves/reopen/recovery. Leaving waits for save acknowledgment; failure retains editor/edits and pending navigation. |
| Display font controls | Installed plus bundled font family/size choices; remember across projects/sessions; display-only with no document/export typography changes. Initial system UI fallback follows {typography.editor-default}; size range and unavailable-family fallback remain routine platform specifications. |
| Context tabs | Expose character/faction/plot/decision context beside writing. Decision relevance unions selected-story/chapter-character explicit associations and deduplicates canonical decisions. |
| Universe timeline | Dedicated vertical graphic: straight top-to-bottom line with selectable intersecting horizontal marks, blue for decisions and red for events, each labeled with its required short name/code; mouse wheel/scrollbar navigate and View Zoom in/Zoom out show keyboard shortcuts; vertical group gaps reflect elapsed time at the selected zoom; same-date records share one timeline position with individually selectable codes stacked beside it and the fictional date displayed beside each group; selecting a mark opens its canonical center editor after pending-edit safeguards; explicit universe identity and synchronized selection. Chapter range/single-date/undated focus rules; linked out-of-period navigation changes view only. |
| Visibility controls | Initially all, OR within maker/category groups and AND between them; persist per universe and synchronize timeline/tree/context/lookup. Reset restrictions without altering relationships/resolution. |
| Record editor | Event/character/faction/decision/plot editors open in center and stay open after ordinary Save. Before leaving pending edits, Save/Discard/Cancel: Save must succeed, Discard abandons only unsaved changes, Cancel stays. Back to writing restores the same chapter/cursor/scroll after resolving edits. Apply per-type validation/saveable-draft rules; preserve canonical event identity and independence. Selected timeline date prefills new events only. |
| Relationship view | Draw established relationships as connected boxes with directional arrows flowing left to right in center, with pending-edit guards before replacing current surface; boxes show short code plus decision text/event heading, blue decisions/red events with textual Resolved/Unresolved on decisions; selecting opens canonical editor and Back to tree restores selected node/view under pending-edit guards. Show directed established decision/result links; source resolved iff outgoing result exists. Reject earlier results/following decisions, self-links/cycles without shifting dates or partial changes. |
| Bottom status bar | Persistent calendar-update flag and Update to current calendar while writing remains allowed; quiet indicators for successful background saves/revisions/backups only after durable/complete publication. Exact wording/detail/persistence routine; failures remain blocking dialogs. |
| Outcome feedback | Save failures and background backup/revision warnings use blocking pop-up dialogs until the user responds. Preserve operation-specific actions; successful background save/revision/backup uses quiet indicator in bottom status bar; exact indicator detail and modal focus/queue remains routine; manual backup/export progress in center with supported Cancel. Report save/capture/export outcomes accurately; preserve pending edits and prior valid output; supply operation-specific retries/cancel/location choices. Detailed geometry/focus/queue handling remains routine. |
| Revision and backup view | Open in center with Back to writing when reached from a chapter; show current/selected revision side by side before restore without added/removed/changed text/field highlighting, retaining protective Replaced capture and workflow-specific cancellation rules. View retained work, Replaced revisions and complete independent ZIPs. Protect required dependencies and newest valid ten archives per owner, including manual deletion. |
| Reconciliation controls | Selectable conflict list beside plain side-by-side Live/Recovered without change highlighting; Keep live/Use recovered/Edit combined (combined result in a separate center editor replacing the comparison, not a third comparison pane or floating window), missing-reference choices and explicit confirmation; recheck live authority and refresh affected choices only. Cancellation remains resumable/inactive. |
| Calendar update indicator | Persistent bottom-status-bar flag with Update to current calendar; writing remains allowed while pending. Persist restored-format flag until explicit current-calendar update saves; failure retains flag/retry, writing remains allowed. |
| Export controls | Manuscript export retains its one-story/all-or-selected chapters/four-format contract. Database export shows one source identity/scope and catalog-only notice, protects pending edits, uses local `.sqlite` Save As with replacement confirmation and active-source rejection, validates before publication, preserves prior output on cancel/failure and offers the approved progress/result/error actions. |
| Settings controls | Center with Back to writing; manual Save stays open and pending departure asks Save/Discard/Cancel, successful Save required to leave. Preserve atomic settings validation/import. Independent positive-whole intervals/retention, first-launch Dark with retained light/dark/system choices and saved preferences, and JSON round-trip; atomic import validation, unknown-field warning, missing-value retention. |

## State Patterns

| Applicable state | Accepted behavior or unresolved decision |
|---|---|
| Cold open / opening project | Restore applicable app-wide panel/font preferences; do not activate project without matching universe authority. Launch shows a project chooser instead of automatic last-project reopen; Open project is primary, with New project/Open universe/Recover from backup secondary; recent-project list is approved; exact list metadata/composition, opening feedback and crash-recovery presentation remain unresolved. |
| Missing/moved recent project | Offer Locate project, Remove from recents (entry only; files untouched), or Cancel back to chooser. Validate identity/authority before opening a located project. Exact error presentation unresolved. |
| Empty project/story/chapter | Counts have no enforced limits and empty chapter text is valid. Exact first-record/empty writing presentation unresolved; export disables no-chapter/no-selection with explanation. |
| Empty timeline/context/tree/lookup | Honor universe/context/filter constraints; distinguish filtered results from unfiltered emptiness. Copy, visual state and reset placement unresolved. |
| Pending/failed manuscript save | Retain pending edits; pop-up warning with Retry/Cancel navigation when leaving. Periodic failure offers Retry now and next-interval retry. Success acknowledges only saved version. |
| Incomplete/invalid profile | Incomplete expected fields do not prevent named character/faction drafts saving; explicit waiver transitions and field validation follow source matrices. Failed image import keeps prior image. |
| Invalid dates/targets/links/types/settings | Field feedback; preserve prior committed data under source rules. Inverted valid chapter dates specifically equalize end to start; do not invent general silent coercion. |
| Active/filtered timeline and context | Active-filter indication, Show all, No maker and Hidden by filters. Hidden outgoing links retain resolution effect. Exact selected/focus visuals unresolved. |
| Save/revision/backup due or resumed | Independent schedules, one overdue attempt after sleep and non-overlap. Failure preserves work/valid output, warns in blocking pop-up dialog and retries; exact focus/queue and busy/progress treatment unresolved. |
| Unavailable/permission-denied folder | Destination chooser/retry/close fallback per operation; missing universe locate/recover while project inactive. Generic filesystem-error presentation unresolved. |
| Recovery conflicts/missing references | Proposed choices not applied before confirmation/freshness checks; cancel preserves pending recovery and leaves live unchanged. |
| Restored calendar mismatch | Persistent bottom-status-bar flag, Update to current calendar; save failure retains retryable flag, writing stays available. |
| Export converting/canceled/failed/completed | Manual export finishes before writing return; do not enable Back to writing during active conversion/publication. Local conversion; publish complete output only. Distinguish cancellation/failure/success, preserve prior output, show approved error actions or saved path/open actions. Progress/cancel timing unresolved. |
| Panel hidden/floating/monitor missing | Floating close hides, top reopen; missing saved monitor docks to main window. Exact focus and docking location unresolved. |
| Theme changed/font unavailable | System follows OS changes; gray editor retained in every theme. Font-unavailable substitution/presentation and scaled-layout behavior unresolved. |
| Application close fails | Keep open; retain edits/completed work and report save/revision/backup outcomes separately; Retry/backup folder/Cancel closing. No silent discard override. |
| Database export unavailable/invalid/active/completed | No supported active source explains unavailability. Reject a live catalog or another active source file as destination. Pending-edit failure blocks capture with edits retained. Validate temporary output before publication; cancellation/failure preserves existing destination, never reports partial output complete. Success shows actual path/Open file/Open folder and limitation; failure offers Retry/Choose another location/Cancel. |
| Local operation without network | Writing, backup to available local destinations and local exports remain functional. No sync/account/offline-service workflow added. |

## Interaction Primitives

All commands are available in top category dropdowns, including exports, backups, revisions, settings and hidden-panel reopening. Preserve left hierarchy/right context navigation and contextual actions such as Edit event; the category table below defines grouping.

Support keyboard and mouse for commands and panels, including moving/docking alternatives. Show applicable shortcuts in top menus. Exact gestures, platform bindings, focus mechanics and modal composition remain implementation specifications; shortcut customization is outside scope. Do not require dragging for movement or manual ordering.

Accepted operations are select, edit, associate/link/unlink, manually order eligible groups, resize/collapse, dock/float, hide/reopen, confirm/cancel and retry.

Before leaving pending manuscript writing, automatically save; navigation proceeds only on durable acknowledgment. Failure leaves navigation pending and offers Retry or Cancel navigation. Separate periodic autosave/revision/backup schedules do not substitute for that protection. Panel visibility changes preserve content and cannot silently discard edits.

Normal close requires pending saves, a complete revision and complete backup. If alternate backup-folder selection is canceled during close, use application-root then user-data fallback and notify next launch of actual location/request a new destination. Failed required operation keeps app open. Outside close, canceling alternate folder skips only that backup attempt and retains configured destination.

Recovery changes stay proposed until confirmation and freshness/integrity validation. Per-record keep-live/use-recovered/edit-combined differs from missing-reference restore/link-replacement/remove-reference. Neither selection implies deletion of protected historical content.

## Shared interaction rules

The approved [recovery-flow preview](mockups/recovery.html) is the reference for conflict list/plain comparison, center Edit combined and final summary. Exact styling and placeholder list/content remain provisional.

### Event-editor departure prompt

When leaving the event editor with unsaved changes, ask **Save / Discard / Cancel** rather than automatically saving. Save must succeed before the requested departure; validation/write failure retains pending edits and blocks departure. Discard explicitly abandons pending event edits without deleting or changing the previously saved canonical event. Cancel keeps the event editor and pending changes.

Ordinary event Save keeps the editor open. Save chosen in the departure prompt permits that requested departure only after success. The existing manuscript save-before-navigation and required normal whole-application close/save/revision/backup rules remain binding; this event-navigation prompt does not bypass those guarantees.

### Return from center record editing

Provide **Back to writing** from the shared center record editors, restoring the same chapter, cursor position and scroll position. If the record editor has unsaved changes, first apply its approved Save / Discard / Cancel prompt. Return after successful Save or explicit Discard; Cancel or failed Save retains the editor and pending edits. Returning does not mutate canonical content or dates. Exact button position/appearance and handling if the original chapter is unavailable remain unspecified.

### Center utility and recovery surfaces

Calendar setup, settings, revisions and backup/recovery screens use the center area. Provide **Back to writing** when opened from a chapter, restoring its writing position under the existing navigation guarantees when that chapter is available.

Placement and return are settled. Manual calendar/settings forms now use the explicit Save/departure contract below. Preserve calendar chronology/validation, settings atomic validation/import, protective Replaced capture, reconciliation cancellation/confirmation/freshness and authority gates. Do not copy record-editor Discard behavior into recovery or bypass an active operation's integrity rules. Active-operation return/cancel handling, no-chapter return routes and detailed screen composition remain unspecified.

### Manual backup/export and writing return

A manual backup or export must finish before returning to writing; do not allow Back to writing while that manual operation remains active. Preserve the existing operation-specific failure/retry/location/cancellation paths, without treating failed/canceled output as a completed artifact. Required normal-close operations still follow their separate success-before-close rules.

This choice does not replace independent scheduled save/revision/backup background behavior or its typing-responsiveness requirement, and does not establish a global lock on unrelated projects. Exact progress/cancel/terminal-return presentation remains unspecified.


### Approved top command categories

| Dropdown | Commands |
|---|---|
| Project | Create/open projects, stories and volumes |
| Writing | Chapters, formatting, targets and plots |
| Universe | Calendar, events, characters, factions and decisions |
| View | Panels, layout and writing-display preferences |
| Revisions | View and restore earlier work |
| Backup & Recovery | Create backups and recover work |
| Export | Manuscript and database exports |
| Settings | Schedules, retention, destinations, themes and settings import/export |

Preserve contextual links and canonical ownership. Exact item ordering/submenus and keyboard/appearance details remain open.

### Initial application theme

Default the application to **Dark** on first launch. Retain Light, Dark and System theme choices and preserve saved/imported preferences on subsequent launches. System mode follows OS changes when selected. Writing-panel background remains gray; adopted Preview gray mode tokens now supply exact colors without replacing display-only app-wide font preferences.


### Progression after Edit combined

After successful validation/save of an Edit combined proposal, open the next unresolved conflict. If no conflicts remain, close the conflict editor. Failed validation/save retains the proposed edits and does not advance.

Closing the conflict editor is not automatic recovery application or whole-application close. Preserve missing-reference resolution, explicit final recovery confirmation, protective history, freshness/authority and other accepted activation gates. Keep live and Use recovered follow the same successful-choice progression. Exact conflict ordering remains unspecified.

### Unsaved combined proposal

Before leaving Edit combined with unsaved proposal edits, ask **Save proposal / Discard / Cancel**. Save proposal must validate and record successfully, then follows the approved next-unresolved-conflict/close-editor progression. Failure retains the editor and pending edits without advancing. Discard abandons only current unsaved combined edits, preserving both source versions and any previously recorded choices; the conflict stays unresolved unless an earlier valid choice remains. Cancel keeps the editor and pending edits.

This is distinct from canceling overall resumable recovery. Final confirmation, missing-reference, protective, freshness and authority gates remain binding.

### Final recovery summary

Before applying recovery, show a final summary of affected items and chosen resolutions, with **Apply recovery / Review choices / Cancel recovery**. Cancel recovery preserves the pending recovery for later. Review choices returns to inspection/change of recorded choices without applying live changes.

Apply recovery remains subject to all accepted missing-reference, protective, schema, freshness and authority gates. Closing the last conflict editor does not apply recovery or claim completion; unresolved gates must still be resolved before activation.

### Adopted visual interaction defaults

Use {components.button} / {components.button-dark} for normal controls; {components.selection} / {components.selection-dark} for selected controls; {components.focus} / {components.focus-dark} for 2 px focus with 2 px offset. Use {components.editor} / {components.editor-dark} so editor focus remains legible against its gray background. Node type surfaces follow {components.decision-node}, {components.decision-node-dark}, {components.event-node}, {components.event-node-dark}; labels and textual decision status accompany colors.

Bottom status uses {components.status-bar} / {components.status-bar-dark} with {typography.meta}; it reflects actual durable outcomes, never an illustrative sample's success. All dimensions/types are scalable defaults, not a bypass of system text scaling or user-selected writing-display preferences.

### Vertical timeline control

The approved [grouped timeline reference](mockups/timeline.html) governs the control composition. It supersedes the [first control sketch](.working/timeline-preview.html) for grouping/labels. Placeholder dates/codes and exact geometry remain illustrative; adopted palette tokens govern; real labels use the owning universe's accepted calendar formatting.

| Aspect | Approved behavior |
|---|---|
| Graphic/orientation | Dedicated control, straight vertical top-to-bottom line with intersecting horizontal marks. Earlier horizontal orientation is superseded. |
| Placement/visibility | Initially docked left, superseding bottom; independently show/hide through View, with movable/dockable/floating/resizable/collapsible behavior and one app-wide remembered arrangement. |
| Record display | Blue decisions, red events; show each record's short code rather than its full heading/text. |
| Date groups | One position per fictional date, date displayed beside group, individually selectable short codes stacked beside it; preserve exact chronology and applicable saved same-date order. |
| Spacing | Vertical gaps proportional to elapsed time at chosen zoom; visual stacking never invents dates or times. |
| Selection | Select a code/mark to open its canonical center editor after manuscript-save/record-departure safeguards; ordinary Save stays open, Back to writing restores chapter/cursor/scroll. |
| Navigation | Wheel and scrollbar; View Zoom in/Zoom out with shown keyboard shortcuts. Zoom changes view only and preserves accepted chapter-period focus/return. |
| Filtering | Accepted maker/category OR-within/AND-across filters, per-universe synchronized persistence, Show all/No maker/Hidden by filters; record dates/links/resolution unchanged. |

Project/chapter navigation remains independently visible/movable; simultaneous dock geometry does not require exclusive tabs or another compulsory placement decision. Exact panel sizes, date-label geometry, collision handling, zoom parameters/anchor and numeric viewport mapping are implementation specifications that must preserve the accepted behavior.

#### Timeline code rules — DEC-38 resolved

Each event/decision has a required automatically generated but editable code, separate from permanent UUID, keyboard shortcuts and full event heading/decision text. Event defaults E001, E002, …; decision defaults D001, D002, …, expanding beyond 999.

Trim surrounding spaces, reject blank values and enforce case-insensitive uniqueness across event/decision records within each universe. Generated numbers follow creation order, advancing past issued numbers and occupied codes. Date/order changes preserve codes; explicit edits refresh live views; retained revisions preserve captured original labels/identities.

TECH-01/02/04/09/11 own exact versioned fields/canonicalization, atomic allocation, missing-code backfill/migration and coordinated current/history publication. Invalid/duplicate input preserves pending edits and committed state. These technical gates are not unanswered DEC-38 product choices; no runtime or migration result is claimed.

### Operation feedback

Use blocking pop-up dialogs for save failures and background backup/revision warnings, quiet bottom-bar indicators for background success/calendar status, and center progress for manual operations. Dialog queue, duplicate warnings, focus and progress representation remain implementation specifications.

#### Failure/warning modality

Save-failure and background backup/revision warning dialogs block interaction until Jo responds. Retain pending edits and prior valid output. Preserve the retry, cancellation, destination and normal-close behavior approved for that operation; do not add a generic Discard action. UI modality does not add a database lock or replace scheduler/writer protocols. Multi-window coordination and dialog ordering remain implementation details.

#### Background success feedback

Show success only after a durable save or complete revision or backup publication. Use a quiet bottom-status indicator; its detail and persistence remain routine. Preserve explicit manual-export saved-path, Open file and Open folder outcomes.

#### Calendar-update status

Persistently show affected restored data's calendar-update indicator in the bottom status bar, with **Update to current calendar** available. Writing remains allowed while pending. Preserve DEC-32 comparison against current authority/configuration, explicit elapsed-position-preserving update, successful-save-only flag clearing, failed-update retry and protected history/reference/authority rules. Exact contextual aggregation/copy is routine specification; this is not a blocking dialog or automatic calendar replacement.

#### Manual progress placement

Show manual backup/export progress in the center, with **Cancel** where cancellation is supported. The operation must reach its outcome before returning to writing. Preserve approved failure/retry/location options, source/prior-output preservation, incomplete-versus-complete distinction and separate required normal-close rules. Exact phase/percentage/spinner rendering and safe cancellation/publication boundaries are implementation specifications, not a change to accepted outcomes.

### Calendar and settings manual edits

Manual calendar and settings forms use explicit **Save**, applying valid changes while keeping the form open. Before leaving unsaved manual changes, ask **Save / Discard / Cancel**. Save must validate/publish successfully before requested departure; failed Save preserves the form and pending edits. Discard abandons only unsaved manual edits; Cancel stays.

Preserve approved calendar target correction/elapsed chronology and settings atomic validation/import/missing-field/unknown-field behavior. Do not discard previously saved/imported settings or reinterpret the separate writing-display toolbar preference behavior. Exact field grouping/prompt styling remains implementation specification.

### Database catalog export

Jo approved the [catalog-only scope and interaction](../../.working/database-export-scope-proposal.md), as recorded in the decision memlog. Export one selected owning project or independently opened standalone-universe catalog as a consistent `.sqlite` snapshot. Show source identity and scope before confirmation. Do not combine live authorities or include unrelated units because paths/names match. A project catalog’s shared-universe references do not include that universe’s separate catalog or content.

Include saved IDs, ownership, relationships, schema/version information, stored relative object paths/root identities and genuine external-reference/dependency information. Preserve identity; exporting neither creates a new live authority nor provides import/restore. Exclude external JSON object files, WRT manuscript text, chapter-formatting JSON, images and revision/backup payloads. Show this notice before confirmation and with successful output:

> Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.

**Export > Database** opens the center source/notice surface. If no supported source is active, explain why export is unavailable. Before capture, protect pending manuscript edits through automatic save and pending manual-editor edits through their Save/Discard/Cancel rules. Failed Save retains edits and blocks capture; Cancel preserves live state.

Save As chooses a local `.sqlite` destination, suggesting a filesystem-safe source name plus `_catalog.sqlite`. Confirm replacement; declining returns to Save As. Reject the live catalog and other active source files as destinations. Show center progress and Cancel where supported. Capture consistent saved catalog state, validate temporary output and publish only after success; cancellation/failure preserves any existing destination. Never report partial output as complete.

Success shows the actual saved path, Open file, Open folder and the catalog-only limitation. Failure offers Retry, Choose another location or Cancel. Return to writing only after the operation reaches its outcome, preserving original chapter context under the shared return rules. TECH-13 and applicable TECH-01–04/11 still define metadata/schema compatibility, capture generation/pending-edit boundaries, ownership/dependency validation, temporary-output validation and safe destination/publication/cancellation mechanisms before implementation. Those are technical gates, not unresolved product scope.

## Accessibility Floor

Approved baseline: both keyboard and mouse operation, including panel movement alternatives; visible shortcut hints; clear keyboard-focus indicators; screen-reader labels for controls; support for system text scaling and reduced motion; text/icons accompanying status colors. Preserve accessible distinctions for unsaved/incomplete warnings, field errors, active filters, hidden endpoints and calendar-format flags.

Implement and verify focus order/restoration, modal focus containment, multi-window/monitor behavior, control names/roles/announcements, practical target sizes and resizing/overflow. These are implementation specifications, not further compulsory questions for Jo. Actual contrast/scaling/assistive-technology results and any formal conformance claim require evidence; none is claimed by this UX handoff.

## Responsive & Platform

Desktop targets follow [DEC-09/10](../../../specs/spec-WritingTool/contracts.md#dec-09--first-release-installers-and-platform-targets-approved-2026-10-17). This is not a browser/mobile product. Actual Windows/Intel Mac/Apple Silicon test access remains unresolved; accepted target list is not evidence of tested builds.

Support multiple displays through floating panels; saved missing-monitor panels dock in main window. One app-wide layout persists across projects. Minimum window/floating-window sizes, resize overflow, DPI/scaling, docking fallback location and reconnection behavior remain open. The preview's 1280 × 760 frame is illustrative, not a minimum/breakpoint.

Light/dark/system remain available; system follows OS changes and editor background remains gray in all themes. Family/size preference is application-wide writing display only. Installed-font discovery and bundled-font licensing/packaging require platform verification.

## Key Flows

Each numbered flow uses Jo as protagonist and captures supported behavior. “Opens” does not prescribe a new screen/menu/modal route where IA marks that route unresolved. See upstream sources for exhaustive fields and technical publication contracts.

### Flow 1 — Organize writing within shared universes (CAP-1; FR-44/47)

1. Jo starts at the launch chooser with Open project as the main action, a recent-project list and secondary New project/Open universe/Recover from backup actions; Jo opens/selects a project and its matching authoritative universe.
2. Jo creates/selects stories and optional volumes, moves stories between groups or ungrouped, and orders volumes/stories manually.
3. Jo selects a chapter; universe-owned context is shared with stories using that universe, while plots remain story-specific.
4. **Climax:** Jo writes in the selected story with the correct universe visible and ownership preserved.

Failure: missing authority offers locate/recover and keeps project inactive; changing project/chapter first invokes Flow 2's save protection. Missing/moved recent entries offer Locate project, Remove from recents (files untouched) or Cancel to chooser. Exact chooser/list controls and empty-project presentation remain unresolved.

### Flow 2 — Write and plan chapters (CAP-2; FR-1/42/43/47)

1. Jo selects a chapter and writes with supported rich formatting on the gray editor.
2. Jo sets optional independent dates, character associations and informational targets; valid inverted date pairs equalize end to start without changing events.
3. Jo leaves for another chapter/project or event editor; application saves pending writing before proceeding.
4. **Climax:** The destination opens only after the required text/metadata version is durably saved; reopening preserves formatting.

Failure: save warning retains edits/current editor and offers Retry or Cancel navigation. Periodic autosave separately offers Retry now/next interval on failure. Field/control placement is unresolved.

### Flow 3 — Arrange panels and writing display (approved UX conversation)

1. Jo independently shows/hides workspace controls through View, docks a panel elsewhere or floats it including another monitor, and adjusts size/collapse state.
2. Jo closes a floating panel to hide it, then reopens hidden panels using top-of-main-window controls.
3. Jo chooses installed/bundled font family and size for writing-panel display.
4. **Climax:** Across projects/sessions Jo retains one app-wide arrangement and writing display preference, preserving manuscript/export typography.

Failure: unavailable saved monitor docks panel in main window without losing content; exact position/reconnection, eligible panels, focus behavior and unavailable-font fallback remain unresolved.

### Flow 4 — Plan chronological events from chapters or timeline (CAP-3; FR-5/6/35/40–42/46)

1. Jo selects a blue decision/red event mark to open its canonical center editor under pending-edit protection, or selects a timeline position/chapter event action for event creation/editing; Edit event from a chapter opens in the center, temporarily replacing writing. Timeline date prefills new records only.
2. Jo creates/edits a canonical same-universe event, views the dedicated vertical top-to-bottom graphical timeline with selectable blue decision/red event marks, and optionally links it to chapters as main or flashback; existing event dates remain independent of chapter dates.
3. Jo inspects the selected chapter period; out-of-period linked events remain listed with Go to event/Return to chapter period.
4. **Climax:** Jo sees the same event from either context without copies, date shifts or changed writing.

Failure: pending writing save must succeed first; invalid event data fails validation. Center placement and keeping the editor open after ordinary Save are approved. Leaving pending event edits asks Save/Discard/Cancel: Save must succeed before departure, Discard abandons only pending edits, Cancel stays. Back to writing restores the same chapter/cursor/scroll after resolving the departure prompt. Exact control/prompt presentation and unavailable-chapter fallback remain unresolved.

### Flow 5 — Define and revise a fictional calendar (CAP-4; FR-7–13)

1. Jo defines year number/day count, optionally months, standalone days and names under source validation/display rules.
2. Jo compares target length with actual: red mismatch/green match; saving mismatch corrects target to actual.
3. Jo revises a populated calendar while elapsed positions, order and intervals remain preserved.
4. **Climax:** Chronology displays using the revised calendar without moving the underlying story history.

Failure: invalid required/numeric/date input receives field feedback; center placement/Back to writing and manual Save-stays-open/unsaved Save-Discard-Cancel approved; failed Save retains draft. Exact field grouping/change-result visuals remain routine; chronology/atomic publication gates remain technical. Restored-format mismatch uses Flow 12.

### Flow 6 — Develop and find characters (CAP-5; FR-14–17/39/48)

1. Jo selects main/major/minor/extras or opens the guided creator with the exact source prompts.
2. Jo records name, answers/explicit waivers, optional details, names-only personality selections and eligible image; expected incompleteness does not block named drafts.
3. Jo supplies birth/background information under the accepted synchronization rules and filters classifications without losing access.
4. **Climax:** The saved viewer exposes the developed character and canonical background/birth context across its universe.

Failure: invalid image keeps prior image; invalid input retains committed values, clearing an expected answer resets incompleteness unless explicitly waived again. Character editor center placement and shared save/departure behavior are approved; Back to writing restores chapter/cursor/scroll after resolving unsaved changes; viewer composition and precise entry/control presentation remain unresolved.

### Flow 7 — Record factions and dated affiliations (CAP-6; FR-36–38)

1. Jo records faction profile fields and optional roster rows under the source field matrix; incomplete drafts remain saveable.
2. Jo records character affiliation changes, including unaffiliated, and adjusts same-date sequence/corrects backdated entries.
3. Jo inspects the character sheet's zero-or-one current faction and recalculated historical chain.
4. **Climax:** Jo sees canonical affiliation history on the character sheet, shared across projects and excluded from universe timeline.

Failure: invalid supplied roster numbers receive field errors; failed image import preserves existing image. Faction editor center placement/shared save-departure behavior are approved; Back to writing restores chapter/cursor/scroll; form, exact entry controls and history-order controls remain unresolved.

### Flow 8 — Track established decisions and outcomes (CAP-7; FR-31–33)

1. Jo creates/edits a decision with date/type/text, eligible optional/required maker and explicit relevant-to associations.
2. Jo optionally creates universe-shared custom types with Maker required default optional and validated unique names.
3. Jo links same-universe result events/following decisions and inspects established relationships as left-to-right connected boxes with directional arrows, plus unresolved lookup.
4. **Climax:** The source resolves when an outgoing result exists; removing the last outgoing result returns it to unresolved, independently of incoming/downstream status.

Failure: earlier-date links, self-links/cycles and invalid required maker/type names show errors with no partial relationship/date change. Decision editor center placement/shared save-departure behavior are approved; Back to writing restores chapter/cursor/scroll; center left-to-right connected-box/arrow tree with code plus text/heading and select-to-editor/Back to tree approved; blue-decision/red-event and textual decision status approved; type-creation forms and precise entry remain unresolved.

### Flow 9 — Inspect and filter writing context (FR-33/44/45; Story 4.7)

1. Jo selects story/chapter context; character/story relevance uses explicit associations, not maker/date inference.
2. Jo selects makers/categories, including No maker or added decision types; OR within groups, AND across groups applies.
3. Jo inspects timeline/tree/writing context/lookup with synchronized per-universe visibility, active indication and Hidden by filters endpoints; Show all clears restrictions.
4. **Climax:** Jo sees relevant canonical context beside writing while links, chronology and source resolution remain unchanged.

Failure/empty: distinguish filtered-out results from unfiltered emptiness; hiding results never creates unresolved decisions. Exact picker, empty-state wording and tree navigation remain unresolved.

### Flow 10 — Track each story's plot sequence (CAP-8; FR-34)

1. Jo records a story plot heading and optional date.
2. Jo manually orders undated entries or same-date entries; new/redated entries start last in their destination group.
3. Jo changes dates/order and sees automatic numbering follow undated-first then chronology.
4. **Climax:** The selected story retains its plot sequence independently of other stories and universe records.

Failure: invalid input/reordering cannot bypass chronology or commit invalid data. Plot editor center placement/shared save-departure behavior are approved; Back to writing restores chapter/cursor/scroll; exact entry, empty state, ordering affordance and save-error presentation remain unresolved.

### Flow 11 — View and restore earlier work (CAP-9; FR-2–4/18–22)

1. Jo views clearly labeled current and selected chapter/character/event or project revision side by side without change highlighting before restoring and selects the existing restoration scope.
2. Application first saves current work as a viewable/restorable Replaced revision; whole-project recovery includes required saved dependencies.
3. Jo resolves applicable universe conflicts/references through Flow 12; chapter-only restoration leaves linked events unchanged.
4. **Climax:** Jo can use the restored content and still recover the work it replaced; failed reconciled ZIP remains visible/retryable.

Failure: failed protective revision blocks restoration and preserves work; unresolved reconciliation keeps recovered project inactive. Center placement, Back to writing and side-by-side current/selected revision comparison approved; change highlighting declined; precise comparison layout/scrolling and entry controls and partial-item dependency presentation remain unresolved.

### Flow 12 — Back up and recover without original stores (CAP-10; FR-23–26; DEC-32)

1. Jo requests backup or configured schedule/normal close captures required saved work as an independent complete ZIP with approved owner/date/time naming.
2. Jo recovers from a ZIP; if authority is missing, locates or establishes the matching single universe before project activation.
3. Jo selects a conflict from the list beside plain side-by-side Live/Recovered values without change highlighting, resolves conflicting records by Keep live/Use recovered/Edit combined (a separate center proposed-result editor replacing comparison) and missing references by restore/link replacement/remove reference, then confirms after freshness checks.
4. Successfully recording Keep live/Use recovered or saving a valid combined proposal opens the next unresolved conflict, or closes the conflict editor when none remain; resolve references, then review final affected-items/resolutions summary with Apply recovery/Review choices/Cancel recovery before activation; Cancel preserves pending recovery.
5. **Climax:** Recovery activates consistent project/universe data, retains protected history and produces required reconciled ZIP; old calendar-format data stays flagged until explicit successful Update to current calendar.

Failure: unavailable backup destination offers another folder; outside-close cancel marks attempt incomplete/retryable and preserves destination. Reconciliation cancel preserves resumable pending recovery/live data unchanged; changed authority renews affected review only. Calendar update failure keeps flag/retry and permits writing. Center placement/Back to writing from chapter context approved; manual backup must finish before writing return, with existing failure/cancellation rules preserved. Approved recovery-flow reference governs conflict/combine/final-summary composition and top-menu/chooser entry. Detailed feedback/progress/freshness presentation remains to specify.

### Flow 13 — Export manuscripts for use outside the application (CAP-11; FR-27; Story 6.1)

1. Jo chooses one story, all/selected chapters and DOCX/PDF/MD/TXT; selected chapters retain story order, empty chapters retain titles and excluded context stays excluded.
2. Application saves pending writing and captures matched current text/formatting; Jo chooses Save As folder/name and confirms replacement if needed.
3. Local converters apply approved format mappings; bundled LibreOffice handles DOCX/PDF, own serializers MD/TXT; publish after success.
4. **Climax:** Jo sees the saved path with Open file/Open folder, with source data and prior recovery archives preserved.

Failure: no chapters/no selection disables with explanation; prerequisite save failure offers retry/cancel; conversion/publication failure preserves existing output and offers Retry/Choose another location/Cancel. Declined replacement returns to Save As. Manual export progress appears in center with Cancel where supported and finishes before writing return. Exact progress representation and safe cancellation/publication boundary remain technical/visual implementation details.

### Flow 14 — Export the local database separately (CAP-11; FR-49)

1. Jo chooses **Export > Database**. The center export surface identifies one selected owning project or standalone-universe source and explains that only its catalog is included; external writing/object/image/history payloads require complete ZIP backup for independent recovery.
2. Jo confirms that source/scope after existing manuscript automatic-save and manual-editor Save/Discard/Cancel guards resolve pending edits. Failed Save retains edits and blocks capture; Cancel preserves live state.
3. Jo uses local Save As with a filesystem-safe `<SourceName>_catalog.sqlite` suggestion. Replacement requires confirmation; declining returns to Save As. A live catalog or another active source file is rejected as destination.
4. Center progress offers supported Cancel while consistent saved catalog state is captured, temporary output validated and completed output published. Cancellation or failure preserves prior destination output; return to writing waits for the operation’s outcome.
5. **Climax:** Jo sees the actual saved path with Open file/Open folder and the catalog-only limitation, while live identities/content remain intact and original writing context is preserved on return.

Failure/empty: no supported active source explains unavailability. Capture/validation/publication failure offers Retry, Choose another location or Cancel without claiming a partial export complete. The Database catalog export rules above define included metadata, excluded external payloads and authority boundaries. TECH-13 retains exact schema/capture/validation/publication mechanisms as implementation gates; no export code or passing platform result is claimed.

### Flow 15 — Configure saving, recovery and appearance (CAP-12; FR-28–30/43)

1. Jo sets independent autosave/revision/backup intervals, destination and retention, or selects light/dark/system appearance.
2. Jo exports settings JSON or imports it; missing values retain current, unknown warn/ignore, invalid known value rejects whole import.
3. Accepted changes apply together, including theme/retention round-trip; system theme follows OS changes and gray writing background remains.
4. **Climax:** Jo retains preferred schedules/appearance without partial import changes, unintended backup or live-folder relocation.

Failure: intervals require positive whole minutes and retention positive whole days; persistence/validation failure keeps prior settings. Unavailable backup folder may remain configured and is handled when backup runs. Settings center placement/Back to writing from chapter context and first-launch Dark default approved; retain saved/imported themes. Manual Save stays open; leaving pending manual changes asks Save/Discard/Cancel, failed Save retains draft. Exact field grouping/prompt visuals remain routine.

### Flow 16 — Finish a writing session safely (FR-18/24–26; DEC-08)

1. Jo closes the application; required pending saves, complete revision and complete backup run.
2. For unavailable backup location, Jo chooses another folder; cancel uses approved fallback and next-launch notification.
3. **Climax:** Application closes only when required operations succeed, preserving current work and valid recovery output.

Failure: any required failure keeps application open with outcomes reported separately; Retry, another backup folder where applicable or Cancel closing returns control without discarding writing. Progress/focus and restart-crash recovery UI remain unresolved.


## October 22 error-exit amendment

The user's later [DEC-08 instruction](../../../specs/spec-WritingTool/contracts.md#dec-08--explicit-error-exit-amendment-2026-10-22) supersedes Flow 16's implication that failed operations can prevent every exit. Preserve normal-close save/capture requirements and operation-specific retry/cancel behavior. Error and failed-close dialogs also offer confirmed Quit application; a subsequent native close can escape a stalled decision. Preserve available exact drafts/pending inputs and original recovery evidence before this interrupted exit, bound collection, separately confirm any exit without a complete copy, restore interactivity/lock ownership when canceled and expose saved copies after relaunch. Do not show success for the interrupted operation or silently replay a draft.
