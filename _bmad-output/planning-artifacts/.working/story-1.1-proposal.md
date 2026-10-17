# Epic 1: Build and organize a chronological writing universe

Jo can create/open project and universe folders, organize stories into optional volumes, build a fictional calendar, record standalone events and browse their chronology with the correct universe selected.

Primary coverage: FR-7–13/35/40/41/44 and the volume/identity contracts. Story 1.1 establishes the desktop host required for these capabilities; it does not complete a functional requirement by itself.

## Review status

Approved by Jo and appended to epics.md under Epic 1. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.1: Launch the local desktop workspace

As Jo,
I want WritingTool to launch as a local desktop application,
So that I have a working application in which subsequent stories can add writing and universe planning.

**Acceptance Criteria:**

**Given** a clean development checkout with documented prerequisites,
**When** the documented install and development-start commands are run,
**Then** the official Electron Forge Webpack + TypeScript starter, adapted to include React, opens a WritingTool desktop window,
**And** application source follows the adopted domain, application, presentation, infrastructure and desktop boundaries without framework imports in the inner layers.

**Given** the desktop window is running,
**When** its runtime configuration and permitted communication paths are checked,
**Then** the renderer is sandboxed and context-isolated with Node integration disabled,
**And** preload exposes only the bounded typed application interface defined by the shared contracts,
**And** Electron main owns window/lifecycle handling and routes a minimal non-mutating readiness query to the background application host,
**And** the UI receives a validated readiness result without generic SQL or filesystem access.

**Given** the shared readiness contract defines failure results,
**When** the background host cannot start or the readiness query fails,
**Then** the application reports that it is unavailable and does not claim to be ready,
**And** no project/universe files are created as a side effect of this smoke check.

**Given** the application has been packaged for the available development platform,
**When** the packaged executable is opened,
**Then** the bundled runtime loads the local React window, preload and background host successfully,
**And** the same readiness query succeeds without a separate Node installation,
**And** runtime versions, verified commands, check results and packaging limitations are recorded.

**Given** this starter is delivered,
**When** its scope is inspected,
**Then** it introduces no future feature database tables or invented calendar/editor/recovery behavior,
**And** it makes no claim that Lexical, SQLite/native integration, the full installer matrix or the whole TECH-12 gate has been verified by this shell-only story.

**Requirements:** AD-1/3/11/18 (AR-01/03/11/18); NFR-1/7/9. This is the architecture-required starter story for Epic 1.

**Dependencies:** No earlier story. TECH-01's shared versioned contracts must be published before implementing IPC; candidate dependencies remain subject to TECH-12 verification before lockfile adoption. Record bootstrap compatibility evidence for the components actually exercised here. DEC-09/10 govern full installed-platform acceptance; this local packaged smoke check does not settle that matrix.

**Verification:** Development launch, local packaged launch, bounded readiness request/result validation, host-start failure reporting, renderer security configuration and inner-layer import checks. No timing budget is invented.
