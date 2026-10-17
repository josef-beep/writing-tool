# WritingTool PRD coaching notes

These notes record each coaching step. Confirmed requirements are distilled into `prd.md`; decisions and changes are also recorded in `.memlog.md`.

## Step 1: Starting input

- Jo chose the completed WritingTool product brief as the starting point.
- Preserve all capabilities agreed for the first release.

## Step 2: Release stakes

- Jo confirmed: “first release is just for me”.
- Evaluate first-release usefulness against Jo's writing needs.

## Step 3: Working mode

- Jo requested: “do the coaching path record each step”.
- Record answers, decisions, and open questions during each step.
- Jo clarified that this discussion was already completed. Use the brief and its supporting decisions rather than repeating vision, feature, or journey discovery.

## Step 4: Manuscript editing requirements

- Confirmed from the brief: write and edit manuscripts in the application; show chapter timeline context and associated characters; chapter-count and word-count targets are informational.
- Asked which formatting capabilities Jo needs, listing italics, bold, paragraph indents, headings, and scene breaks.
- Jo answered: “all of it”. All five listed capabilities are required.

## Step 5: Revision restoration scope

- Confirmed from the brief: automatic revision snapshots cover all project content; earlier versions can be viewed and restored.
- Jo answered: “both”. Individual-item restoration and whole-project restoration are required.

## Step 6: Restoring linked dates

- Confirmed from the brief: changing chapter dates updates the timeline and shifts main events by the same offset; flashback dates stay fixed.
- Jo answered: “use the state it was in when it was saved at that point”.
- Restoring a chapter restores the chapter and its linked main events to their saved snapshot state. Ordinary rescheduling continues to shift main events by the chapter's date offset.

## Step 7: Protecting current work during restoration

- Jo confirmed an automatic snapshot of current work before restoration.
- Jo requested that the snapshot be clearly marked as replaced and available to return to if restoration was a mistake.

## Step 8: Selecting timeline events to shift

- Jo added: “Also allow me to choose which timeline events should shift”.
- Jo answered: “both”. Selection applies to ordinary chapter date changes and restoration.
- This qualifies the earlier automatic main-event shifting and saved-state restoration rules: event changes must respect the selection.

## Step 9: Unselected timeline events

- Jo confirmed that unselected events keep their current dates and content during both chapter date changes and restoration.
- The brief's fixed historical flashback dates remain the baseline; whether flashbacks can be explicitly selected is not yet confirmed.

## Step 10: Flashback event selection

- Jo confirmed: “flashback dates should stay fixed. Flashbacks should be editable on their own and those dates should reflect”.
- Chapter date changes and chapter restoration do not change flashback historical dates; flashbacks are excluded from chapter-driven event date changes.
- Independent flashback date edits update their dates on the universe timeline, retaining the link to the depicting chapter.

## Step 11: Fictional calendar changes

- Confirmed from the brief: configurable days per year and month, optional months, and fixed 24-hour days with 60-minute hours.
- Jo confirmed that a universe calendar can be changed after dated chapters and events exist.

## Step 12: Existing dates after calendar changes

- Jo answered: “keep position”.
- Existing dated entries retain their elapsed universe-time positions. Displayed dates are recalculated using the revised calendar; chronological order and elapsed intervals remain unchanged.

## Step 13: Month and year consistency

- Jo confirmed that month lengths can differ and extra days outside months can fill out the year.
- Supported year forms: months only, months plus extra days outside months, or days only.

## Step 14: Calendar builder and placement of extra days

- Jo specified: “the tool to create the calender should be linear. i.e I should be able to add months or days on the tool in sequence to create the calendar.”
- Build the year as an ordered sequence of months and standalone days. Their position in the sequence determines their place in the year; standalone days are not restricted to year end.

## Step 15: Year length while building

- Jo requested a target year day count displayed in red when it differs from the total added days and green when it matches.
- Saving a mismatch is allowed and adjusts the target to equal the actual number of added days.
- Example: target 365, sequence total 360 → red before saving; saving sets the target to 360, producing a match.

## Step 16: Calendar names

- Jo confirmed that each month and standalone day can be named.

## Step 17: Year names

- Jo confirmed that year names are optional. A year can have just a number.

## Step 18: Leap-year rules

- Jo answered: “same”. The same calendar sequence repeats every year; leap-year rules are not required for the first release.

## Step 19: Year-only character births

- Confirmed from the brief: entering a character's birth year creates a timeline birth record.
- Jo answered: “day 1”. A year-only birth is placed on day 1 of that year on the timeline.
- This establishes timeline placement; the birth day was not supplied as known information.

## Step 20: Character types

- Confirmed from the brief: minor characters have fewer expected prompts; incidental characters require only basic identification; fuller prompts remain available.
- Jo specified: main, major, minor, extras.
- Use those four names in the PRD, replacing the brief's incidental label with extras.

## Step 21: Character development fields

- Jo supplied nine fields: name; rank or title (if civilian); background; description; image placeholder; motivation; personality traits; weaknesses; strengths.
- Background is optional for non-main characters; required for main characters.
- Image placeholder, motivation, personality traits, weaknesses, and strengths are optional.
- Personality traits allow multiple selections from Jo's supplied personality-types-list.md.
- Preserved a source copy in `sources/personality-types-list.md`; the original is `/home/jo/Documents/writing/docs/Research/personality-types-list.md`.

## Step 22: Required fields for extras

- Jo confirmed: “extras can just have names”.
- Name alone is sufficient for extras; rank/title, description, and fuller development fields are optional for them.

## Step 23: Personality descriptions

- The supplied personality source includes a short description for every label.
- Jo answered: “no”. The personality selector shows trait names only, without their descriptions alongside.

## Step 24: Automatic revision snapshot settings

- Confirmed from the brief: automatic snapshots cover all project content and are customizable; a pre-restoration snapshot is mandatory.
- Jo specified application close and a configurable interval, defaulting to 10 minutes.
- The mandatory pre-restoration snapshot remains required.
- This decision sets the revision snapshot interval, not the separately configurable autosave interval.

## Step 25: Revision retention — policy reconciliation in progress

- Jo specified PostgreSQL storage: retain until manually deleted.
- Jo specified SQLite storage: retain for one month.
- Jo also specified size-based retention excluding images: over 10 MB → one month; smaller → keep.
- Deletion must preserve the minimum required revisions so the restore sequence has no gaps.
- Open: precedence between database and size rules; treatment of exactly 10 MB; whether deletion removes a contiguous range or retains necessary intermediate revisions.

## Step 26: Retention policy precedence

- Jo confirmed PostgreSQL revisions stay until manually deleted, including those larger than 10 MB.
- Jo confirmed SQLite revisions smaller than 10 MB stay indefinitely; those over 10 MB, excluding images, are retained for one month.
- This resolves the overlapping conditions from Step 25. Exactly 10 MB and revision-chain deletion behavior remain open.

## Step 27: Deletion and revision dependencies

- Jo answered: “if a dependency is still used, do not delete it”.
- Preserve dependency records required by retained revisions during manual deletion and automatic expiry; do not delete dependent revisions to remove the dependency.

## Step 28: Retention threshold boundary and minimum revisions

- Jo confirmed exactly 10 MB is retained indefinitely; SQLite expiry applies only above 10 MB excluding images.
- Jo reiterated: “remember to apply the rule about minimum revisions to be kept”.
- Minimum required revisions and dependencies are preserved even when otherwise eligible for deletion or expiry. The retained sequence must remain gap-free and restorable.

## Step 29: Backup contents

- Confirmed from the brief: database export and backup are required.
- Initially open: whether a restorable backup includes images and revision history as well as current project content. Resolved by Step 31's confirmation of complete recovery, including referenced content.

## Step 30: Shared backup content and reference protection

- Jo requires that already-backed-up images, particular document versions, and other unchanged data are stored once.
- Subsequent revisions using that content add references to the existing item rather than copying it.
- Jo specified that an item cannot be removed while any active references remain.
- Apply this protection alongside the minimum-revision rule; deleting a revision must not delete shared content still in use.
- Complete backup recovery is confirmed in Step 31.

## Step 31: Standalone backup recovery

- Jo confirmed a backup must recover everything after loss of the original database, including all content its references require.
- This includes current project content, images, retained revision history, and required shared content; recovery cannot depend on the lost database.
- Shared content remains deduplicated, and minimum-revision/reference protections remain in effect.

## Step 32: Backup triggers

- Jo chose “combination” from manual backup, application close, and a configurable schedule. Record all three triggers.
- The default database backup schedule remains unspecified; the 10-minute default applies to revision snapshots.

## Step 33: Backup destination

- Jo confirmed a user-selectable destination folder, including a folder on an external drive.

## Step 34: Unavailable backup destination

- Jo chose to select another folder when the backup destination is unavailable, including for scheduled and application-close backups.

## Step 35: Canceling backup folder selection

- Jo specified a third behavior: create a new folder in the application folder root and save the backup there.
- On the next application launch, notify Jo of the new folder and ask to change the backup destination.

## Step 36: Fallback folder permissions

- Jo confirmed use of the user-data folder when the application root is not writable.
- The next-launch notification identifies the actual fallback location and asks to change the destination.

## Step 37: Manuscript export

- Confirmed from the brief: database export is required.
- Jo requires DOCX, PDF, Markdown (MD), and plain text (TXT) manuscript exports.

## Step 38: Manuscript export scope

- Jo confirmed both whole-story and selected-chapter exports.

## Step 39: System settings export

- Jo additionally requested system settings export as a JSON object into a `.json` file.

## Step 40: System settings import

- Jo confirmed that the exported `.json` settings file can be imported to restore settings.

## Step 41: System settings inventory

- Jo added theme to the discussed autosave interval, revision snapshot interval, backup schedule, and backup destination.

## Step 42: Theme options

- Jo selected light, dark, and system. System mode follows the operating system's theme.
- The theme mode is included in JSON settings export/import.

## Step 43: Established decision-tree content

- Confirmed from the brief: decision trees track established choices and consequences in character and story arcs, aligned with the timeline; hypothetical branches are excluded.
- Jo specified: place in the timeline, who made it, and what the decision was.
- Separate reason or consequence text fields were not requested. The brief's established-consequence tracking capability remains required.

## Step 44: Decision-tree connections

- Jo specified that decisions remain marked unresolved until a resulting event is created.
- The resulting event links back to the decision and is added to the timeline; the decision then becomes resolved.

## Step 45: Multiple consequences

- Jo confirmed that one decision can link to multiple resulting events, after adding the lookup requirement in Step 46.
- The first linked resulting event resolves the decision under Step 44; further events can still be added.

## Step 46: Unresolved-decisions lookup

- Jo requested a section where unresolved decisions can be looked up from the timeline.
- Provide access from the timeline in the selected universe context; decisions no longer appear as unresolved once resolved through a resulting event.
- Step 45 was subsequently resolved: multiple resulting events are allowed.

## Step 47: Removing the final consequence

- Jo confirmed that deleting or unlinking the last resulting event makes the decision unresolved again and returns it to the lookup section.
- If other resulting events remain linked, the decision stays resolved.

## Step 48: Multiple decisions leading to one event

- Jo confirmed that one resulting event can link back to multiple contributing decisions.
- Each decision's resolution status depends on its own linked resulting events. A shared event can resolve each linked decision.

## Step 49: Plot records

- Confirmed from the brief: plot tracking aligns with the timeline and established character and story arcs.
- Jo specified heading, optional timestamp, and number in the sequence.

## Step 50: Plot sequence numbers

- Jo chose automatic numbering from the offered automatic numbering with reordering option.
- Sequence numbers follow entry order and update when entries are reordered.

## Step 51: Undated plot entries

- Jo specified: “in the plot sequence at the top”.
- Undated entries appear at the top of the plot sequence.

## Step 52: Ordering dated plot entries

- Jo chose timestamp ordering for dated entries.
- Undated entries remain at the top; dated entries follow chronologically, with automatic numbering reflecting the resulting order.
- This qualifies Step 50's reordering interpretation: manual ordering does not override dated chronology.

## Step 53: Plot ownership

- Jo confirmed plot sequences belong to stories.

## Step 54: Faction records — in progress

- Confirmed from the brief: factions are shared by stories in the same universe, and characters can have a faction.
- Open: what fields Jo needs for a faction record.

## Step 55: Standalone universe events

- Jo added universal events on the timeline that are not linked to anything.
- Events belong to their universe but do not require links to a story, chapter, character, plot, or decision.
- Step 54's faction-fields question remains open while following this added requirement.

## Step 56: Standalone event fields

- Jo confirmed heading, date/time, and optional description.
- Standalone events remain owned by their universe without mandatory links to other content.

## Step 57: Faction profile example

- Jo selected `fero-kia-faction-profile.md` as the faction profile example, resolving Step 54's field-structure question.
- Extracted identity, government, leadership, strategic profile, and repeating military roster sections, plus head-of-military and head-of-intelligence fields.
- Preserved the supplied example in `sources/fero-kia-faction-profile.md`.
- Example values are not universal defaults. Numeric roster fields do not establish combat mechanics.

## Step 58: Faction required fields

- Jo answered: “all should be filled in”. All extracted faction profile fields are required for completeness.
- Jo subsequently amended this in Step 60: unit types are optional; the other profile fields remain required for completeness.

## Step 59: Incomplete faction drafts

- Jo confirmed after Step 60 that incomplete faction profiles can be saved as drafts. Required fields determine completeness rather than blocking draft saves.

## Step 60: Optional faction unit types

- Jo requested: “change the last selection. unit types must be optional”.
- The military roster/unit types are optional. A faction can be complete without unit entries; other faction profile fields remain required.
- Step 59 was subsequently resolved: incomplete drafts can be saved.

## Step 61: Character faction membership

- Confirmed from the brief: the character viewer includes faction information.
- Jo confirmed only one faction at a time.

## Step 62: Unaffiliated characters

- Jo confirmed a character may have no faction. Membership is optional and limited to one faction at a time.

## Step 63: Changes in faction membership

- Jo chose to record the change on the timeline.
- Faction changes are dated, preserve membership history, and update current affiliation while respecting one faction at a time.

## Step 64: Time precision

- Confirmed from the brief: 24 hours per day and 60 minutes per hour.
- Jo subsequently clarified that timeline timestamps only need a date. Hours, minutes, and seconds are not required.
- This replaces the date/time wording used in earlier event and faction-change discussions with date-only requirements.

## Step 65: Character background events

- Jo added character-specific events linked to the timeline as part of character background.
- Events link to their character and appear on the owning universe timeline; character and timeline views refer to the same event.
- Step 64's timestamp-precision question remains open while following this new requirement.

## Step 66: Background event fields

- Jo confirmed heading, date/time, and optional description, matching standalone events.
- Return to Step 64's unanswered timestamp-precision question next.

## Step 67: Timeline dates clarification

- Jo clarified: “if you are talking about timline timestamps, those really only need a date”.
- Updated timeline event, background event, faction-change, and optional plot timestamp requirements to date-only.
- The brief's time conventions do not require time-of-day entry in timeline records.

## Step 68: Multiple entries on the same date

- Jo confirmed manual ordering is available but not required.
- Same-date events can be created and saved without choosing their within-day order; manual ordering does not change dates or require times.

## Step 69: Chapter date ranges

- Confirmed from the brief: chapters have dates and provide a detailed view of their period.
- Jo confirmed start and end dates are supported but optional.
- This changes the brief's date-at-creation requirement: a chapter can be created before dates are assigned.

## Step 70: Undated chapters

- Jo specified that undated chapters appear in the sequence in which they were created.
- Their position relative to dated chapters remains open; the undated-at-top plot rule is not automatically applied to chapters.

## Step 71: Mixed dated and undated chapter list

- Jo specified dated chapters ordered by date, undated chapters in creation sequence, and unclear placement in front.
- Undated chapters without a chronological position appear in front, preserving creation order.

## Step 72: Sorting chapter date ranges

- Jo chose the start date as the sorting key.
- Do not substitute an end date; apply the existing unclear-placement rule when there is no start date.

## Step 73: Autosave default

- Confirmed from the brief: autosave uses a configurable interval. Revision snapshots default to 10 minutes under Step 24.
- Jo chose 5 minutes as the default autosave interval for current work; it remains configurable.
- Revision snapshots retain their separate 10-minute default.

## Step 74: Database backup schedule default

- Confirmed: manual backups, application-close backups, and a configurable backup schedule are required.
- Jo instructed: “use what we already have”. Interpret this as reusing the 10-minute revision snapshot interval for scheduled backups, recorded explicitly as an assumption. Autosave stays at 5 minutes.

## Step 75: PRD consolidation

- Consolidated the brief's universe/story workflow with all recorded coaching decisions.
- Added target-user jobs, glossary, first-release boundaries, cross-cutting quality requirements, success checks, and visible downstream open items.
- Preserved stable FR identifiers and the original source examples.
- The document remains a draft pending reconciliation and final review.

## Step 76: Source reconciliation

- Personality and faction source checks found no material omissions.
- Made the brief's guided prompts, waiver exemptions, character viewer, database export, and character/story arc alignment explicit.
- Preserved the original calendar date-format examples in the addendum.
- Checked 49 unique FR identifiers, cross-references, and local source links.

## Step 77: Character specialities

- The brief includes character specialities; Jo's later nine-field list does not address them.
- Jo confirmed specialities remain as an optional field in the character record and viewer.

## Step 78: Decision audit and quality review

- Mapped the recorded decisions and superseded intermediate rules in `decision-audit.md`.
- Quality rubric: no critical or high findings; one medium and two low findings.
- Clarified that main-character background is expected for completeness, with the brief's explicit waiver behavior preserved.
- Assigned chapter-range movement details to Jo/architecture before movement implementation, and plot tie ordering to Jo/UX before plot implementation.
- The 10-minute backup default remains an explicit, configurable assumption to revisit with Jo before backup implementation.

## Step 79: Document polish

- Moved draft status and the backup assumption near the scope, brought exclusions forward, and grouped timeline event rules together.
- Condensed the addendum's repeated policies into links while preserving source examples and architecture details.
- Applied the prose pass’s three clarity corrections without changing requirements.

## Step 80: PRD finalized

- Finalized after source reconciliation, decision audit, rubric review, and structure/prose polish.
- No critical or high findings remain. Downstream details have owners and revisit conditions.
- PRD status is final and ready for UX/architecture planning.
- No external handoffs or completion hooks were configured.
