# Key-screen coverage — current draft

2026-10-17. Consolidated references after Jo skipped optional UX validation. This maps all **17 IA surface rows** in [EXPERIENCE.md](../EXPERIENCE.md#information-architecture), not every possible state. Jo explicitly approved continuing with written specifications for remaining partial/spine-only surfaces. This accepts documentation coverage, not unimplemented behavior or technical-gate completion. Adopted Preview gray tokens/shared defaults govern the promoted references; examples are not saved data. All three promoted references show Dark; Light/System tokens remain specified in [DESIGN.md](../DESIGN.md).

`Mocked` = core composition illustrated; `Partial` = only some of that surface/state illustrated; `Spine-only` = behavior specified without a dedicated content/composition mock. Existing approved sketches retain composition value but do not override adopted palette or later behavior.

| IA surface | Coverage | References and limits |
|---|---|---|
| Project chooser | Mocked | [key-chooser.html](../mockups/chooser.html), approved [chooser-preview.html](chooser-preview.html): primary/secondary actions and empty recents. Missing-path Locate/Remove/Cancel alternate state remains spine-only. |
| Main workspace | Mocked | [key-workspace.html](../mockups/workspace.html): top eight categories, left visible timeline, gray writing, right context, bottom status. Navigation intentionally hidden via View in this illustrated configuration; no new coexistence requirement. Earlier [workspace-preview-v2.html](workspace-preview-v2.html) supplies top-command composition. |
| Project/volume/story organization | Partial | Approved hierarchy in [workspace-preview.html](workspace-preview.html); new main reference hides navigation. Create/open/regroup/reorder forms are spine-only. |
| Manuscript/chapter details | Partial | [key-workspace.html](../mockups/workspace.html): blank gray writing and display family/size controls. Chapter dates/characters/targets/formatting-control detail states remain spine-only. |
| Calendar setup | Spine-only | Center placement, manual Save/departure, calendar fields/validation/chronology in spine. Palette state samples are not calendar configuration mocks. |
| Universe selection/profile | Spine-only | Shared identity/name/description and synchronized selection specified; no dedicated selection/profile composition. |
| Universe timeline | Mocked | [key-workspace.html](../mockups/workspace.html) and approved [timeline-preview-v2.html](../mockups/timeline.html): vertical axis, date groups/codes, blue/red and filter region. Actual zoom/scroll/overlap and filtered-empty states require implementation; placeholder spacing does not supply dates/intervals. |
| Event editor | Spine-only | Approved center/editor/Save/departure/Back-to-writing contract; no full event-field composition. Recovery combined editor is a different workflow. |
| Character/faction development | Spine-only | Context tabs appear in workspace but do not constitute profile/creator/image/affiliation-history mocks. Fields and behavior remain source/spine-backed. |
| Story plot | Spine-only | Context-tab label is illustrated; actual ordered plot content/editor is not. |
| Decision editor/types | Spine-only | Center editor/type/maker/association rules specified; graph nodes and timeline codes are not the decision editor/type form. |
| Decision tree/unresolved lookup | Partial | Approved [decision-tree-preview.html](../mockups/decision-tree.html): center left-to-right boxes/arrows, labels/status/return rules. Promoted copy applies adopted tokens; unresolved lookup itself remains spine-only. |
| Revisions/restoration | Spine-only | Plain current/selected side-by-side composition and protective restore contract specified, but no dedicated revision-selection/current-versus-revision mock. Live/Recovered comparison does not substitute for all restoration states. |
| Backup/recovery/reconciliation | Partial | [key-recovery.html](../mockups/recovery.html) preserves all three approved [recovery-flow-preview.html](recovery-flow-preview.html) states: conflict list/plain comparison, separate center combined proposal, final summary/actions. Manual backup destination/progress, missing-reference/freshness/restart variations remain spine-only. |
| Manuscript export | Spine-only | Scope/format/Save As/progress/result/error contracts specified; no dedicated export selection/progress mock. Palette status/control samples are not an export screen. |
| Settings/import/export | Spine-only | Center/manual Save/departure, independent schedules/theme/settings JSON atomic rules specified; no full settings form/import composition. |
| Database export | Spine-only | Export entry/scope distinction exists; Jo approved one-source catalog-only `.sqlite` export, limitation notice, guarded Save As/progress/outcome workflow; written coverage is accepted. TECH-13 exact metadata/schema/capture/validation/publication remains implementation work; no dedicated mock requested. |

Totals: **3 mocked, 4 partial, 10 spine-only**. Coverage is accepted by Jo for this UX handoff; the counts are not a quality grade or evidence of implementation.

## Reference constraints and checks

- New HTML uses inline selected Dark CSS colors, system fonts and adopted UI spacing/radii; no scripts, imports or network. HTML parses offline. Controls are static affordances; no navigation/save/recovery state is implemented.
- Top categories are Project/Writing/Universe/View/Revisions/Backup & Recovery/Export/Settings. Exact shortcut bindings remain unspecified, so none are fabricated. View commands/shortcuts required by the spine still need implementation.
- New main reference illustrates independently visible timeline and hidden navigation, preserving their remembered show/hide/dock/float behavior. It does not approve a forced exclusive mode or move project navigation elsewhere.
- Codes E001/D001/D002/E002, Fictional date A/B and conditional calendar-update indicator are explicitly illustrative. No real calendar/manuscript/recent data, conflict names/counts or successful-operation claims are invented.
- Recovery choices/source preservation/progression and final activation checks remain as specified. Comparison, Edit combined and final summary are all retained.
- Five lasting references promoted to mockups/: workspace, chooser, recovery, timeline and decision-tree. Historical originals remain in .working/. Spines link promoted copies; both spines are final/handoff after database-export scope approval; technical implementation gates remain separate. No optional reviewers or new preference choices.

2026-10-17 final checkpoint: Jo approved catalog-only database export and its full interaction. All17 surface rows retain accepted coverage (3 mocked/4 partial/10 spine-only); database-export product scope is settled in Experience. Both spines are final/handoff. This does not assert backlog or implementation readiness.
