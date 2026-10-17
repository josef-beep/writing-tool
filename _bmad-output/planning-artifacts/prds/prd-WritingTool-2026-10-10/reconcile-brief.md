# Product brief input reconciliation

## Inputs and method

Read the original `brief.md`, supporting `addendum.md`, and `.memlog.md` in `briefs/brief-WritingTool-2026-10-10`, and compare them against the consolidated PRD, PRD addendum, and coaching notes in this workspace. Later user decisions take precedence. This is extraction and reconciliation, not a requirements review or proposed scope expansion. The PRD was not changed.

## Reconciliation status after parent corrections

Re-read the updated PRD and addendum. The following source gaps are resolved; this extraction task did not change the PRD.

1. **Resolved: exact date formats and example.** The addendum now preserves `dayofyear/year`, `month/dayofmonth/yearnumber/yearname`, and `362/6976`, with example-only 365-day qualification and optional year names.
2. **Resolved: character viewer presentation.** FR-48 explicitly exposes image placeholder, background, personality selections, description, and faction. Specialities intentionally remain a visible Jo/UX open item for the next coaching question, not a silently dropped requirement.
3. **Resolved: guided creator and prompt states.** FR-48 provides prompts, answered/incomplete/waived completion states, optional fuller development, and no individual waiver for prompts outside the expected set. FR-16 preserves type-specific expectations without hard save validation.
4. **Resolved: database export clarity.** FR-49 explicitly requires database export separately from manuscript/settings exports; exact format follows the open database choice.
5. **Remaining thin traceability: character/story arc alignment.** FR-31/32 retain established decision relationships and timeline position; FR-34 retains story-owned chronological plots. Original character/story arc alignment is broadly present in vision/jobs but less explicit in acceptance. This is a traceability observation, not a confirmed missing capability; do not invent link fields.

## Requirement-by-requirement mapping

| Original input | Consolidated coverage | Reconciliation result |
| --- | --- | --- |
| Desktop author workspace connecting manuscript, chronology, plots and established decisions | Vision, jobs, FR-45, success SM-1 | Preserved |
| For Jo and other authors; commercial/distribution open | Personal first release; coaching Step 1 | Later override: Jo only for first release, broader distribution later |
| All discussed capabilities first release; guided creator and decision tree not deferred | Confirmed scope, boundaries, FR-32 and FR-16 | Preserved scope and explicit creator acceptance under FR-48 |
| All functionality on one machine | Confirmed scope and local quality requirement | Preserved |
| “Run anywhere” interpreted as Windows/macOS/Linux; versions open | Scope and downstream platform item | Preserved interpretation, not additional mobile/browser demand |
| Universe timeline chronological backbone; chapters zoom into detailed period | FR-45/46 | Preserved |
| Chapters progress chronologically | FR-42; coaching Steps 69–72 | Later refinement: dated chapters sort by start date; missing-start chapters at front in creation order. Do not reinstate mandatory chronological placement of undated chapters |
| Select timeline position to populate chapter events; create chapter populates timeline | FR-46 | Preserved with later optional-date override |
| Chapter date required on creation | FR-42; coaching Step 69 | Superseded: optional start/end date range |
| Linked date edits propagate | FR-46, FR-14 | Preserved |
| Main events shift automatically by chapter offset | FR-5; coaching Steps 8–10 | Qualified: author chooses participating events, unselected records remain unchanged |
| Flashbacks have historical dates and remain linked to depicting chapter | FR-6 and glossary | Preserved; independently editable, excluded from chapter-driven shifting/restoration |
| Stories within universe share timeline, characters, factions; other universes separate | FR-44 | Preserved |
| Explicit timeline universe ownership; synchronized selectors both directions | FR-44 | Preserved; do not imply ownership reassignment |
| Established decisions/choices/consequences only; no hypothetical alternatives | FR-31/32 and boundaries | Preserved and expanded through resulting-event links |
| Plots and decision trees align with timeline and established character/story arcs | FR-31/32/34; vision/jobs | Broad intent retained; explicit acceptance context thin |
| Configurable days/year and month; optional months | FR-7–13 | Preserved and resolved with ordered builder, standalone days, repeat-year rule |
| Source format strings and `362/6976` example | PRD addendum calendar examples | Preserved; resolved |
| Fixed 24-hour day, 60-minute hour | FR-7/40; coaching Steps 64/67 | Convention preserved; later timeline records require date only, not time of day |
| Guided backstory prompts; answers optional; expected unanswered prompts incomplete unless waived | FR-16 and scope | Preserved explicitly under FR-48; resolved |
| Minor smaller expected set; incidental basic identification; fuller prompts available; out-of-set no waiver | FR-15/16; coaching Steps 20–22 | Later types/field expectations control. Extras-name sufficiency retained. Out-of-set waiver exemption is explicit under FR-48 |
| Every character accessible, type filter | FR-15 | Preserved |
| Viewer: image, background, personality, description, faction, specialities | FR-16/17/37; specialities open item | Viewer explicit under FR-48; specialities intentionally awaiting Jo/UX clarification |
| In-app writing/editing, chapter-count and word-count targets informational, chapter associations and context | FR-1/45/47 | Preserved, later formatting/export additions |
| Configurable autosave interval | FR-43 | Preserved; later 5-minute default |
| Customizable automatic snapshots of everything, view and restore earlier versions | FR-2/3/18–22 | Preserved, later trigger/retention/restore decisions |
| Local SQLite or PostgreSQL, choice open | PRD addendum and downstream item | Preserved; conditional policies do not select database |
| Database export and backup | FR-49 and FR-23–26 | Export and backup explicit; resolved |
| Primary easy overview success; observational checks | SM-1–5, FR-44–47 | Preserved; commercial metrics superseded by personal-release outcomes |

## Later overrides that must remain intact

- Personal first release for Jo; no repeated persona/journey discovery.
- Main, major, minor, extras types; extras require name only; supplied field expectations and names-only multiselect personality labels.
- Optional chapter date ranges, start-date sorting, missing-start chapters at front in creation order.
- User-selected main-event shifting/restoration scope; unselected content unchanged; historical flashbacks fixed except independent edits.
- Editable populated calendars preserve elapsed position; ordered months/standalone days; save mismatches adjust target; optional year names; no first-release leap rules; year-only birth display uses day 1.
- Timeline timestamps require dates only; same-date manual ordering optional.
- Five-minute autosave, ten-minute revision snapshots; ten-minute scheduled-backup default remains an explicit assumption.
- Item and whole-project restoration; marked pre-restoration “Replaced” snapshot; conditional retention, dependency protection, deduplication and standalone backup recovery.
- Optional military roster, incomplete faction drafts, optional single current faction and dated membership history.

## Downstream handling

Parent corrections resolved calendar example preservation, explicit guided creator/viewer acceptance, and database export. Specialities and exact prompt wording remain visible Jo/UX decisions. Arc-alignment wording can be clarified without new link fields or reopening chronological workflow. No confirmed first-release capability is missing from the corrected inputs.
