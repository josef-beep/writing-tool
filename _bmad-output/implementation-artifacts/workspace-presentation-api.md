---
status: implemented-unverified
updated: 2026-10-18
---
# Presentation integration handoff

Source implementation only. No tests, typecheck, lint, app, build, packaging or runtime probes were run. Existing generated `.webpack` files were not edited. The release spec remains in progress because protection/export and execution acceptance are subsequent work.

## Owning shell and controller

`src/presentation/index.tsx` retains the existing Shell and native token decision. It mounts one keyed `Workspace` for the active project/universe identity, including a no-root instance for app-wide settings. Before its project/universe/open/close/quit/profile transitions, Shell calls the same `WorkspaceHandle.guard()`. Legacy profile opening first queries its current authoritative profile/generation because content saves share that generation. Profile Ctrl+S stops propagation to the workspace handler.

`Workspace` is `forwardRef<WorkspaceHandle>` from `src/presentation/workspace/Workspace.tsx`. Props are `{identity, universeName, onStatus, onCenterChange?}`. Handle methods:

- `guard(): Promise<boolean>` waits an active manuscript save, protects manual drafts with Save/Discard/Cancel and blocks unknown outcomes/active utility operations. A false result retains the editor/context. Manuscript departures save again if newer edits exist; only echoed submitted revisions acknowledge that editor origin.
- `save(): Promise<boolean>` submits the current editor. A successful old submission can leave newer edits dirty; callers requiring a clean capture must use `guard()`, rather than treating one `save()` response as an all-edits acknowledgment.
- `refresh(): Promise<void>` queries the authoritative workspace. Call after protection restore/recovery changes before presenting new canonical state. Existing in-progress drafts are not silently replaced.
- `openUtility(content: ReactNode): Promise<boolean>` resolves the same guard, saves writing scroll context and switches the center to the supplied React surface. The content is rendered under `#workspace-utility-slot`.
- `setUtilityBusy(value: boolean): void` blocks departure/native close while the external manual operation is active. Clear this only at a terminal outcome; do not use it to claim a canceled operation completed.
- `backToWriting(): Promise<void>` runs the guard and restores writing chapter/editor selection and saved scroll through the retained mounted Lexical editor.

Menus are portals into Shell's `#project-workspace-menu`, `#universe-workspace-menu` and `#workspace-menus`. Protection integration replaces the current explanatory content inside `#workspace-revisions-menu`, `#workspace-backup-menu` and `#workspace-export-menu` with working commands. Use `openUtility` for their center surfaces; history/recovery/export are deliberately not implemented by this slice. The subsequent normal-close integration must capture required revision/backup after the shared draft guard, before native permission/drain.

`Draft` and mutation state remain controller-owned. `execute` groups all changes by typed owning unit/generation. A retained `Pending` stores the exact command, original operation UUID, editor origin and submitted revision. Unknown outcomes use `workspace.reconcile`; no replacement mutation is sent until noncommit or the receipt is confirmed. Manual and manuscript revision counters are independent. Settings uncertainty reads back with `settings.get`. The preload serializes workspace transport calls to respect main's single context gate, including query/settings/image reads triggered together by mounting.

## Components and domain integration

`model.ts` contains typed selectors/factories, permanent creation identities and display helpers. `RecordForm.tsx`, `CalendarForm.tsx`, `Fields.tsx` and `SettingsForm.tsx` render ordinary forms. They consume exact domain prompts, personality choices, completeness, affiliation-history, date-conversion and order helpers. The authority handles birth synchronization, code allocation, closure validation and final hashes/versions. Calendar edits append immutable versions, including subsequent edits after an ordinary Save. Fields keep exact decimal strings.

`Chronology.tsx` contains synchronized saved filters, a vertical exact-date window with proportional gaps and same-date stacks, full unresolved lookup, and the left-to-right decision graph. Zoom changes an exact bigint visible interval. Earlier/later and canonical-record jumps allow arbitrary signed chronology without converting saved years to native numbers. The retained tree DOM and viewport are used for Back to tree.

## Manuscript adapter

Lexical family packages are pinned to exact `0.52.0` in package.json/package-lock.json. Installed declarations were read before implementation. `src/presentation/manuscript/adapter.ts` exports `importManuscript(Manuscript, ParagraphIdentities)` and `exportManuscript(ParagraphIdentities)`; call them only inside a Lexical update/read respectively. Authoritative content is LF plain WRT plus scalar paragraph/mark metadata. JSON editor state stays transient. Supported blocks are body/headings 1–6, exact indentation and literal `***`; bold/italic spans are coalesced and use Unicode scalars. Empty trailing paragraphs persist. Unsupported blocks/nested content and indentation outside safe editor representation reject with an error instead of silently producing a lossy save.

`ManuscriptEditor` retains its instance while center records replace writing. It registers headings, rich-text, history and change plugins. Persistent paragraph IDs follow keys through typing/history and are transferred on paragraph-style replacement. Split paragraphs receive new identities; merged paragraphs retain the surviving node identity. `writingtool-format` dispatches supported toolbar/top-menu commands. `writingtool-restore-writing-focus` restores the retained editor selection.

## Native presentation boundary

`application/contracts/presentation.ts` defines `window.writingToolPresentation` separately from the persistence bridge:

- `presentation({command:'inventory'})`: primary-only installed font names and monitor work areas.
- `presentation({command:'panel.sync',layouts,mirror})`: primary-only validated app layout plus read-only typed `PanelMirror`; creates/hides/updates sandboxed owned floating windows.
- `presentation({command:'panel.read'})`: child-only initial projection/PanelId.
- `presentation({command:'panel.action',action})`: child-only allowed select/create/tree intent forwarded to the primary guard. Select IDs must belong to the current projection. Child windows cannot invoke workspace/project/universe persistence successfully because those handlers retain primary main-frame URL/sender authorization.
- `onPresentation(listener): unsubscribe`: mirror updates, primary action requests and layout patches. `PanelAction` contains only permanent record IDs and a closed creation-type set; no paths, SQL or arbitrary IPC.

`desktop/presentation.ts` uses fixed OS font-inventory commands without shell interpolation. Failure returns no installed inventory and preserves the system-family fallback. Font resources/licenses are still the next resource-packaging slice; this implementation makes no bundled-font availability claim. Floating URLs have an exact `#floating-{PanelId}` suffix; navigation/redirect/new-window/webview and inherited permissions remain restricted. Main native close calls the returned disposer only after the existing drain succeeds, destroys child windows, clears their timers and removes its presentation listener/handler.

Floating close persists hidden state. Removed/unavailable saved monitors dock to the main window. Move/resize patches persist app-wide settings through the primary controller. `FloatingPanel.tsx` renders a read-only navigation/timeline/context projection, including synchronized decisions/filter markers and selected-story plots; user selection returns to the guarded primary editor.

## Scheduling seam and remaining delivery work

The renderer owns manuscript autosave only: bounded one-second polling compares bigint elapsed milliseconds with the positive whole-minute setting; window focus checks overdue work, no saves overlap, failure retains edits and opens the blocking error. Revision/backup schedulers and required close captures belong to the following slice and must reuse `guard()` before capture, not duplicate the autosave timer or make floating windows writers.

Protection/export top commands, recovery chooser/recents as required by that subsequent slice, complete close captures, bundled font resource registration/packaging and all execution/installed-platform/accessibility/performance acceptance remain outstanding. Extremely wide chapter date windows can visually compress close marks at browser pixel resolution; zoom, exact period paging, canonical-record jumps and full unresolved lookup remain available. No performance/corpus, OS-font discovery or multi-monitor runtime result is claimed.

Source follow-up: a `same-operation` noncommit retry retains and resubmits the unchanged original command before allowing departure. The legacy profile close refreshes workspace generations. Floating synchronization uses `showInactive()` only for previously hidden windows so repeated save/mirror updates do not take writing focus. Tree selection is retained and exposed with `aria-pressed`.
