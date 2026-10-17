# Decision audit

The append-only decision log was checked against the PRD, coaching notes, addendum, and source copies. Later answers supersede earlier intermediate answers without deleting the conversation record.

| Discussion group | Capture |
| --- | --- |
| Starting brief, personal first release, recorded coaching, avoid repeat discovery | Document purpose, target user, boundaries, coaching notes |
| Manuscript formatting, export formats/scopes, chapter dates/order, autosave | FR-1, FR-27, FR-42, FR-43 |
| Individual/project recovery, replaced snapshots, event selection, flashbacks | FR-2 through FR-6 |
| Calendar edits, elapsed positions, sequence builder, lengths, labels, repeated years | FR-7 through FR-13; calendar examples in addendum |
| Character birth placement, types, fields, personality source and names-only selection | FR-14 through FR-17; preserved personality source |
| Snapshot triggers, retention conditions and threshold, minimum revisions, references | FR-18 through FR-22 |
| Full recovery, backup triggers, destination/fallback and notification | FR-23 through FR-26 |
| Settings JSON round-trip and theme modes | FR-28 through FR-30 |
| Decision fields, resolution, lookup, many-to-many resulting events | FR-31 through FR-33 |
| Story plots, numbering, dates and undated placement | FR-34 |
| Standalone universe events | FR-35 |
| Faction example, required profile, optional units and draft saving | FR-36; preserved faction source and addendum |
| Optional single faction, membership history and background events | FR-37 through FR-39 |
| Date-only timestamps and optional same-day ordering | FR-40, FR-41 |
| Brief's shared universe, context, workflow, targets, prompts/viewer and database export | FR-44 through FR-49 |
| Character specialities retained optionally | FR-16, FR-48 |

## Superseded intermediate rules

- Chapter dates required at creation → optional start/end dates; sort by start date, creation order in front when placement is unclear.
- All main events move automatically → select participating main events; unselected events stay unchanged and flashback dates remain independent.
- All faction fields required → optional military unit types; other fields determine completeness and incomplete drafts may be saved.
- Ambiguous SQLite retention → only snapshots above 10 MB excluding images expire after one month; retain all dependencies and minimum revisions needed by retained content.
- Event date/time precision → dates only.
- General plot reordering interpretation → dated plot entries sort by date; undated entries appear first.

## Items retained for downstream work

The PRD's open-items table assigns owners and revisit conditions for database/storage details, supported platforms, export presentation, prompt wording, calendar display, shared-record restoration, and backup cancellation outside close. These are not omitted requirements.

The one explicit assumption is a 10-minute scheduled backup default, interpreting Jo's instruction to reuse existing settings. Jo can revisit that configurable value before backup implementation.
