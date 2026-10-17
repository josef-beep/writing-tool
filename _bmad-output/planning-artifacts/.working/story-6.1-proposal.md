# Approved by Jo — recorded in epics.md

### Story 6.1: Export a whole story or selected chapters as DOCX, PDF, Markdown or text

As Jo,
I want to export a whole story or selected chapters in DOCX, PDF, Markdown or plain-text format,
So that I can read and use my manuscript outside WritingTool.

**Acceptance Criteria:**

**Given** a story is selected,
**When** I open manuscript export,
**Then** I can choose DOCX, PDF, MD or TXT and either the whole story or selected chapters,
**And** all four formats support both scopes through the same selection/document workflow,
**And** the selected story/chapters and output format are clear before writing the output file,
**And** selection cannot mix another story’s manuscript without an explicitly adopted scope contract.

**Given** the selected chapters have current manuscript edits,
**When** I confirm export,
**Then** the accepted current-work capture contract includes the intended current text/formatting rather than silently exporting only an older autosave,
**And** pending manuscript state is protected through DEC-15’s accepted save/navigation/failure rules,
**And** the document snapshot is consistent under concurrent edits and follows TECH-01/03’s versioned capture contract,
**And** a required save/capture failure is reported without claiming a completed export.

**Given** a valid whole-story or selected-chapter scope,
**When** the output document is assembled,
**Then** only that scope’s manuscript is included, without skipped or duplicated selected chapters,
**And** chapter ordering, titles/separators and empty-story/empty-selection handling follow the accepted DEC-06 presentation/selection contract,
**And** independent chapter dates and timeline/calendar sorting remain unchanged by exporting,
**And** universe context, decision trees, hidden/filter state and backup history do not silently become manuscript text.

**Given** the captured manuscript contains bold, italics, paragraph indents, headings and scene breaks,
**When** any format adapter produces output,
**Then** it consumes the same explicitly versioned WritingTool-owned manuscript contract used for persistence/revisions rather than saving a Lexical-specific payload as an export,
**And** DOCX/PDF represent supported formatting under DEC-06’s accepted presentation mapping,
**And** Markdown/plain-text use DEC-06’s accepted structural/text representations where rich styling cannot be represented,
**And** manuscript text and structural content are not silently omitted because a destination format lacks a rich-style feature,
**And** unsupported future/malformed document schemas fail safely without rewriting the source manuscript.

**Given** a supported local destination is selected,
**When** output conversion and file publication succeed,
**Then** a valid file matching the selected format is written and its actual location/completion is reported,
**And** the workflow operates locally with accepted open-source tools and requires no hosted conversion service,
**And** it does not move live project/universe category files or alter manuscript content, links, dates, plots, revisions or backups,
**And** export presentation/library/runtime compatibility is verified in the required installed targets before acceptance.

**Given** I cancel scope/destination selection, select invalid data, encounter an unavailable destination or conversion/writing fails,
**When** the operation ends,
**Then** cancellation or failure is distinguishable from success,
**And** no partially generated file is reported as a completed valid export,
**And** source writing and required current/retained dependencies remain intact,
**And** destination overwrite/collision, partial-file publication and retry behavior follow the accepted export/publication UX contract without silently damaging a prior valid output.

**Requirements:** FR-27 all four formats and whole-story/selected-chapter scopes; supporting FR-1 manuscript content/formatting and adopted document/capture contracts; CAP-11; AD-1/3/11/12/13/18; NFR-1/2/3/6/7/8/9. DEC-11 governs quantitative performance acceptance.

**Dependencies:** Earlier approved manuscript/story/storage/settings/runtime capabilities, especially Stories 2.1–2.4 and the shared manuscript/capture contracts. No future database-export story is required. Resolve DEC-06 format-specific presentation and accepted open-source libraries, chapter selection/order, empty-scope behavior and destination/filename/overwrite interactions before affected implementation. TECH-01 defines manuscript versions, export command/result/errors and consistent snapshot identity; TECH-03 protects intended current-work capture and TECH-04/05 apply where persistence/host lifecycle is involved. DEC-15 protects pending edits. PLAN-04 captures export format/scope selection, destination, progress/result/error/cancel/retry interactions. DEC-09/10 and TECH-12 govern installed/runtime dependency acceptance; DEC-33 storage/category layout remains binding without prescribing manuscript-export packaging.

**Scope boundary:** One user-facing manuscript export workflow with four adapters; all consume the same document contract and reuse selection/capture/publication handling. No manuscript import, whole-universe/decision-tree export, volume-only export, database/settings export or complete ZIP recovery feature. A backup ZIP’s required owner/date/time naming does not automatically dictate manuscript export naming. Earlier recovery/backup/retention remains unchanged and export does not count as a protected recovery archive.

**Verification:** Export whole stories and non-contiguous selected chapters to each of DOCX/PDF/MD/TXT using representative manuscript text, Unicode, bold/italics, indents, headings and scene breaks. Open/inspect outputs with suitable format readers/parsers and compare expected text, chapter inclusion/order and DEC-06 format-specific representations; do not merely assert that files exist. Include pending changes newer than autosave, chapters with missing dates, empty/invalid selection under its accepted contract and concurrent edit/capture cases. Verify exports do not include excluded context/filter/history or mutate source records. Exercise canceled dialogs, unavailable destinations, accepted overwrite/collision behavior, conversion/write/publication failure and unsupported schema. Check local installed dependencies across the adopted platform matrix and performance against the agreed corpus before acceptance.
