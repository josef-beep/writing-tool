# WritingTool Supporting Details

## First-release scope

All capabilities discussed in the brief are required for the first release. The user rejected deferring guided character prompts or the decision-tree view. Implementation may be sequenced, but that sequencing does not remove capabilities from the first-release commitment.

## Timeline-linked creation

Multiple stories set in the same universe share its timeline, character records, and factions. Shared records are limited to that universe; stories set in other universes have separate timelines, characters, and factions.

Each timeline must have an explicit field specifying the universe it belongs to. Application views that handle timelines provide linked universe and timeline selectors. Selecting a universe loads that universe's timeline. Selecting a timeline loads the universe it belongs to. The selectors stay synchronized and use the existing ownership relationship.

The author can select a spot on an existing timeline and use it to populate events for a chapter. Conversely, creating a chapter must automatically add it to the timeline. Creating a character with a birth year must record that birth year on the timeline.

Chapter dates must be supplied when creating a chapter and can be changed later. Changes to linked dates must propagate to the timeline, including changes to a character's recorded birth year.

Moving a chapter automatically shifts its main events by the same time offset. Flashbacks retain their original historical dates.

Not yet decided: how to display character births when only the year is known, without inventing a precise date.

## Fictional calendar and time

Days per year and days per month are configurable. Authors can specify months, but months are not mandatory; a calendar can use day-of-year dates without months.

User-supplied date formats:

- `dayofyear/year`
- `month/dayofmonth/yearnumber/yearname`

Example: `362/6976` means day 362 of year 6976. This example calendar has 365 days per year and does not use months.

Time is separate from dates and always uses a 24-hour day, with 60 minutes per hour.

Not yet decided: whether year names are optional, how configured month lengths relate to the year length, and any leap-year rules. The example's 365-day year is not established as a universal default.

## Character creation and visibility

Character development uses prompts that authors can choose whether to answer. Minor characters have smaller expected prompt sets; incidental characters require only basic identification. Fuller prompts remain available for further development. An unanswered expected prompt is marked incomplete unless the author explicitly waives it as unimportant. Prompts outside the expected set require no waiver. Minor and incidental characters remain viewable and accessible, and a character-type filter is required.

Not yet decided: the full set of character types, the exact prompts for each type, and the fields that constitute basic identification.

## Writing, revisions, and data storage

Authors write the manuscript within the app. Chapter-count and per-chapter word-count targets must be visible but are informational planning indicators only. No target or limit is enforced.

All functionality should work on one machine. Autosave uses a configurable interval. Revisions are automatic snapshots covering all project content, including chapter text, characters, plots, and timeline events; authors must be able to view earlier versions and restore them. Snapshot triggers, retention settings, and whether restoration acts on individual items or the whole project have not yet been defined.

Data must be saved in a SQLite or PostgreSQL database on the same machine. These are user-specified alternatives; no selection has been made. Database export and backup functionality is required. Backup contents and destinations, and database restore behavior remain open.

## Desktop platform coverage

The user requires the app to run anywhere. Within the established desktop scope, the working interpretation is Windows, macOS, and Linux support. Specific supported operating-system versions and processor architectures remain undefined; mobile and browser support have not been requested.
