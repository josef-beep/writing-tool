---
title: WritingTool Product Brief
status: complete
created: 2026-10-10
updated: 2026-10-10
---

# WritingTool Product Brief

## Purpose and users

WritingTool is a desktop application for authors to plan and write stories while keeping track of chronology, plots, and established character decisions. It is intended for Jo's own writing and for other authors. Commercial goals and distribution plans remain open.

The core problem is losing track of where the author is in the story and what decisions have led there. WritingTool connects manuscript writing to a chronological universe overview, so the author can see a chapter's place in time alongside its characters and plot consequences.

All functionality operates on one machine. The requirement to “run anywhere” is interpreted within the desktop scope as Windows, macOS, and Linux support; supported versions remain to be defined.

## First-release scope

All capabilities described in this brief are required for the first release. Implementation can be sequenced, but guided character creation, the decision-tree view, and the other discussed capabilities are not deferred.

## Universe timeline and story workflow

The universe timeline is the backbone of the application. Its overview always follows chronological order. Chapters also progress chronologically, with each chapter providing a detailed view of its period. A visible universe timeline lets the author zoom into a chapter's section.

Stories set in the same universe share its timeline, characters, and factions. Sharing is limited to that universe. Every timeline identifies its universe. Linked universe/timeline selectors keep the selected context synchronized across timeline views.

Planning and writing work in both directions. An author can select a spot on an existing timeline to populate chapter events, or create a chapter that automatically appears on the timeline. Chapter dates are required at creation and can be changed later. Changes to linked dates, including recorded character birth years, update the timeline.

Moving a chapter automatically shifts its main events by the same time offset. Flashbacks record their historical period. Their events appear at those dates on the universe timeline and remain linked to the chapter that depicts them. Moving the chapter does not move those historical events.

Plot tracking and decision trees align with the timeline and show established events, choices, and consequences in character and story arcs. Hypothetical alternative branches are excluded because they would make the overview confusing.

## Fictional calendar

Authors can configure days per year and days per month, with months optional. Dates can use day-of-year or month-based formats, with exact formats and an example preserved in the addendum.

Time is separate from date formatting and always uses 24 hours per day, with 60 minutes per hour.

## Character development

The character creator uses prompts to help authors develop backstories and flesh out characters. Responses are optional. An unanswered expected prompt is marked incomplete unless the author explicitly waives it as unimportant.

Minor characters have a smaller expected prompt set; incidental characters require only basic identification. Prompts outside that expected set need no individual waiver. Fuller prompts remain available for further development. All characters stay viewable and accessible, with filtering by character type.

The character viewer includes an image placeholder, background, personality, description, faction, and specialities.

## Writing and protecting work

Authors write and edit the manuscript inside the application. They can set chapter-count and per-chapter word-count targets, associate characters with each chapter, and inspect its timeline context. Targets are visible planning indicators only; no target or limit is enforced.

Autosave runs on a configurable interval. Customizable automatic revision snapshots cover all project content, including manuscript text, characters, plots, and timeline events. Authors can view earlier versions and restore them.

Data is stored on the same machine using SQLite or PostgreSQL; the database choice remains open. Database export and backup functionality is required.

## Success criteria

The primary success outcome is an easy overview of story position, chronology, plot, and established decisions. Observable checks derived from the agreed requirements are:

- An author can write a chapter while seeing its timeline section, involved characters, and established plot decisions.
- Creating chapters or recording character birth years populates the timeline; changing linked dates updates it consistently.
- Rescheduling a chapter shifts its main events while preserving flashback dates.
- Stories in the same universe use shared records, while other universes remain separate.
- An author can view and restore earlier project content, and export and back up the database.

Quantitative success thresholds and evaluation with other authors remain to be defined.

## Decisions for requirements and architecture

The supporting addendum preserves detailed examples and questions for downstream work. Open decisions include calendar validation and year names; year-only birth display; exact character prompts; snapshot triggers, retention, and restoration scope; database selection; backup contents and restore behavior; and supported platform versions. These are unresolved details, not deferred capabilities.
