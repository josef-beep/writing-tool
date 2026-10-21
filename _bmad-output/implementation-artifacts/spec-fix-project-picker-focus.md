---
title: 'Prevent folder-picker focus refresh from interrupting project navigation'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Opening or creating a project must survive native folder-picker focus changes without unrelated workspace errors. Preserve pending edits and existing project data. Investigate the follow-up incomplete-project error using the selected folder when available; never initialize or overwrite an existing incomplete project merely to open it.

</frozen-after-approval>

## Implementation Notes

The supplied first screenshot shows the Workspace error dialog and a project-creation reconciliation warning. Actual Electron reproduction with temporary universe/project folders and focus events during both creation pickers yields 'Workspace request denied' and the exact workspace-unavailable dialog. The Workspace focus effect is unaware of Shell's project/navigation busy state. Add a parent-navigation busy prop and stable ref to suppress background workspace refreshes while native project/universe navigation is active; preserve explicit guarded navigation and saved-edit handling. Verify open/create and canceled pickers with focus events. User's selected folder path remains requested for diagnosing the separate missing/incomplete project report.

Implemented Shell-to-Workspace navigation-busy state and a stable ref checked by the background focus refresh handler. Explicit initial and post-navigation refreshes remain unchanged. Independent review found no correctness issues in the scoped change.

## Verification

- Actual Electron pre-fix reproduction: focus events during both project-creation pickers caused denied workspace IPC and the exact first screenshot's Workspace error.
- Final actual Electron test with fresh temporary universe and empty project folders: both creation pickers followed by focus events succeeded; project.current returned the created project and matching universe; no denied workspace IPC or spurious dialog.
- Actual Electron Open project test with focus event and valid temporary existing project: succeeded; no blocking dialog; authoritative project.current confirmed identity.
- Actual Electron canceled Open project picker with focus event: no error, no active project, UI remained usable.
- `npm run typecheck` and `npm run lint`: passed.
- `git diff --check`: passed.

## Remaining investigation

The second screenshot reports an incomplete/invalid/inaccessible selected project. The exact selected folder path has been requested and has not yet been provided. No user project folder has been modified or repaired; the fixture tests use temporary data only. Keep status in-progress until this remaining report is diagnosed or the user confirms the navigation fix resolves it. No commit across the mixed existing working tree.

### Selected-folder diagnosis — 2026-10-19

User supplied `/home/jo/Documents/Stories/Projects/Compendium`. Read-only inspection confirms it contains no files, including no project discovery metadata or database. `/home/jo/Documents/Stories/writingtool.json` identifies the existing Luminous universe. The second error therefore reflects an empty destination that has not yet been initialized as a project, rather than damaged project data.

Added a read-only empty-folder precheck to FileProjectStorage.open that returns VALIDATION with explicit Create project guidance instead of the generic incomplete/inaccessible error. Verified against a temporary empty folder: the expected message/code is returned and directory contents remain empty. Independent review found no correctness issues. Typecheck, lint, and diff whitespace checks pass. The actual user folder was never modified. Use Create project with Stories as existing universe and Compendium as empty project destination after restarting the app with the picker-focus fix.
