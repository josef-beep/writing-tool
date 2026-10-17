---
status: adopted
protocolVersion: 1
scope: Story 1.1 non-mutating readiness
updated: 2026-10-17
---
# Application readiness contract

Published under Jo's approved execution direction before IPC implementation. This closes only the shell's TECH-01 transport slice; it defines no persistence, filesystem, SQL or future-feature command.

Request: exactly `{protocolVersion: 1, requestId: canonical-lowercase-UUID, query: "application.readiness"}`. Preload exposes only `window.writingTool.readiness(): Promise<ReadinessResult>` and creates a fresh request ID itself. The renderer cannot choose a channel, query or host filesystem path. Main validates the top-level sender against its owned window/frame and expected local content URL before forwarding validated input to the utility host.

Success: exactly `{protocolVersion: 1, requestId: matching-UUID, status: "ready"}`. Failure: exactly `{protocolVersion: 1, requestId: matching-UUID, status: "unavailable", code: HostErrorCode}`. Codes: `HOST_START_FAILED`, `HOST_EXITED`, `TIMEOUT`, `INVALID_RESPONSE`, `UNAVAILABLE`. Closed shapes; reject unknown keys, wrong versions/types or mismatched correlation. Main validates utility results and preload validates returned results. Invalid caller input is rejected without dispatch; invalid/failed background communication becomes unavailable rather than ready.

Use a finite timeout (5 seconds), a bounded pending-request map and deterministic cleanup on reply/timeout/exit/window destruction/application shutdown. Host exit invalidates readiness. No automatic readiness response is manufactured on a timeout or fork success. Readiness succeeds only after the live utility process executes the non-mutating application query and returns the valid correlated result. Main retains window/lifecycle ownership; application code imports no Electron APIs.

The utility host and IPC handlers create no universe/project/catalog/user content. Electron's isolated application profile/cache during smoke checks may use a temporary folder; no writing store is initialized. Fault injection for host startup/exit/invalid responses belongs to tests or an explicit diagnostic mode, never a renderer privilege.

Renderer is sandboxed/context-isolated with Node integration disabled. Navigation/window opening is restricted to trusted local app content; failures render a clearly labeled unavailable state. Theme follows adopted Dark Preview gray for this shell; later stories add chooser/workspace commands. Development and packaged local smoke checks must exercise the renderer→preload→main→utility→application path and failure behavior, not merely inspect a static config or mock all processes.
