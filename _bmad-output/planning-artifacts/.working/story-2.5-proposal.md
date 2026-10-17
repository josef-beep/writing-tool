# Story 2.5 proposal

Approved by Jo and appended to Epic 2 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 2.5: Choose light, dark or system application appearance

As Jo,
I want to choose light, dark or system appearance,
So that the writing workspace uses my preferred theme or follows my operating system.

**Acceptance Criteria:**

**Given** the application workspace is open,
**When** I choose light or dark appearance,
**Then** the application applies that explicit theme to the workspace and its existing editor/timeline/settings surfaces,
**And** operating-system theme changes do not override an explicitly selected light or dark mode.

**Given** I choose system appearance,
**When** the operating system indicates light or dark appearance,
**Then** the application follows that appearance,
**And** later operating-system theme changes are reflected while the application remains open,
**And** the stored selection remains system rather than being replaced with the currently resolved light/dark value.

**Given** the chosen theme mode was successfully saved,
**When** I close and reopen the application,
**Then** that same selected mode is restored,
**And** system mode resolves using the operating system's current appearance,
**And** theme persistence uses the existing shared application-settings contract.

**Given** a manuscript has saved formatting and may also have pending edits,
**When** I change the application theme,
**Then** chapter text, semantic formatting, identity, dates and ownership are unchanged,
**And** pending edits remain available under the editor-state contract,
**And** changing appearance does not rewrite the manuscript document or alter save/revision/backup intervals.

**Given** theme preference persistence fails,
**When** the failure is reported,
**Then** the application does not claim that preference was durably saved,
**And** previously committed settings and writing content remain intact,
**And** reopening uses the last successfully committed selection.

**Requirements:** FR-30 appearance behavior and persistence; CAP-12; AD-3/11/18 and settings convention; NFR-1/2/3/7/9. FR-28/29 import/export will round-trip this selected mode in a later Epic 2 story.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9 and Epic 2 Stories 2.1–2.4 only. Use the shared TECH-01 settings/transport contract and existing settings-persistence/failure guarantees; retain DEC-15 pending-edit protections. PLAN-04 must capture the appearance control and required light/dark visual treatment before implementation. This proposal does not select colors, typography, UI libraries, accessibility thresholds or a first-install default theme. Full installed-platform verification remains DEC-09/10 and VERIFY-09.

**Scope boundary:** This story delivers a usable appearance setting with persistence without depending on future settings import/export. The later JSON settings story must reuse the same mode field and preserve system as a choice. Native OS-controlled dialogs follow platform capabilities; no unsupported native styling promise is introduced.

**Verification:** Select each mode; reopen; change mocked/real operating-system appearance while system mode is active and while explicit light/dark is active. Verify saved system selection versus resolved appearance, representative editor/timeline/settings surfaces, pending edits and failed preference persistence. Confirm writing content and unrelated settings are unchanged. Record platform-specific evidence rather than assuming all targets were exercised.
