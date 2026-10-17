# Architecture rubric review

Reviewed: `ARCHITECTURE-SPINE.md`, `RECONCILIATION.md`, the architecture skill's good-spine checklist, and the source PRD's capability inventory and calendar/event clauses.

## Verdict

**Ready to become the shared input to a spec after two small boundary clarifications; not ready for implementation.** No critical/high finding or user decision is required to retain the accepted initiative-level design. The explicitly gated contracts must be settled centrally before affected features can be delegated to builders.

The latest requirement lands correctly: project story/volume/chapter counts are unrestricted, volumes are optional organizational groups, and ten stories/~100 chapters/two volumes is workload context only. The source PRD's old size-dependent retention is explicitly superseded. No fixed word or organization limit has been introduced.

## Findings

### Medium — Runtime trust policy remains implicit

AD-18 fixes the process boundary and bounded validated messages, but neither it nor Deferred explicitly fixes renderer privileges, permitted content origins/navigation, and which process may possess live-folder capabilities. Two compliant presentation/desktop implementations could choose incompatible trust models, one enabling Node or permissive navigation while the other assumes a sandboxed local renderer. Import, settings import and recovery also accept external files, so the local-only deployment does not remove the boundary.

**Triage: autofix.** State the renderer/preload trust invariant centrally: no direct Node/database/filesystem authority in renderer; context isolation and sandboxed renderer; load only packaged application content; reject unapproved navigation/new windows. If exact policy details are not yet selected, gate one shared transport/content-origin/archive-validation policy before bootstrap/import/recovery work. This is a boundary invariant, not a request for a compliance checklist or per-message schema.

### Medium — Shared-universe writer ownership is not named

AD-8 establishes one authoritative logical state, and AD-10/Deferred correctly require crash-safe cross-store coordination. They do not explicitly cover two windows, application instances, or background operations opening the same selected universe folder concurrently. A single logical database can still have conflicting coordinators that each believe they own an operation or retention sweep. Individual adapters could independently choose global single-instance behavior, per-store ownership, or only SQLite transaction locking.

**Triage: autofix/defer to the existing coordination gate.** Add concurrent-open/writer ownership and operation serialization to that centrally owned protocol's scope. Require authoritative mutation, checkpoint capture and cleanup to share its coordination model. The exact locking scheme can stay gated; no user decision is needed now.

## Checklist assessment

| Dimension | Assessment |
| --- | --- |
| Paradigm/dependencies | Decided. Clean Architecture imports point inward; adapters own framework conversion; runtime hosts do not masquerade as layers. |
| Actual feature divergences | Decided or gated. Project/universe ownership, one authority, date mutation scope, complete revisions, manuscript ownership, image location and archive independence are strong convergence rules. |
| Enforceable AD rules | Generally pass. The rules say what callers/adapters may and may not do. Verification implementation remains build work. Add the two boundary scopes above. |
| State and transaction model | Correctly gated. Cross-file consistency is not falsely promised by SQLite. Consistent backup cuts and crash/restart recovery need one contract before affected implementation. |
| Recovery conflicts | Correctly gated. Newest-authority semantics, cancellation, divergence detection and races must be settled before recovery implementation. Manual conflict resolution is binding. |
| Shared identity/wire formats | Correctly gated centrally. This is safe for a shared spec handoff, unsafe for independent builders starting IPC/persistence now. |
| Organization and data seed | Appropriate altitude. ER diagram illustrates ownership, not a premature exhaustive schema. Open-ended volumes/stories are preserved. Deferring membership/order detail does not invalidate the initiative architecture. |
| Capability coverage | Pass. The map accounts for FR-1–49. Quiet requirements remain binding through the map/reconciliation: optional same-day order, draft completeness, specialities, calendar forms, year naming, traits and guided creation. They need not each become ADs. |
| Retention | Pass. Configurable 30-day default, no size expiry, ten newest valid successful archives independently per unit, dependency roots protected, no ten-revision minimum. |
| Platform/install/environment | Decided and gated. Installed bundled Electron, Windows 10+/macOS 13+, broad named Linux families; concrete packaging baselines/architectures and native bindings require verification. |
| Provider/infrastructure | Decided and gated. SQLite first, provider adapters, no external server required; PostgreSQL is deferred rather than promised equivalent. |
| Operations | Mostly pass. Normal-close draining, backup errors, unavailable-drive handling, fallback/next-launch notification, cleanup and retry behavior are present. Crash coordination, migration/native installation and performance acceptance are explicit gates; release automation/signing/software updates are deliberately deferred. Writer ownership needs the addition above. |
| Security/trust | Partial coverage in typed isolated transport. Explicitly name the shared runtime/import trust policy rather than leaving this dimension implicit. |
| Current technology | Exact candidates have official-source links/date and an integration gate. This review did not independently rerun release-page checks; it does not assert tested compatibility. Pins are seeds, while selected frameworks are decisions. |
| Brownfield/inherited constraints | No substantive implementation is claimed to exist; no inherited parent spine is supplied. No unsupported ratification of code conventions. |

## Handoff scope

The deferred table is unusually explicit about ownership and preconditions. It is not permission for feature builders to invent separate identity, calendar, document, snapshot or operation contracts. Resolve these through the common spec/architecture before implementation starts in their dependent areas. Treat integration/platform testing and performance evidence as build acceptance, not as work already proven by this document.

No additional per-story tables, detailed use-case inventory, arbitrary performance cap or package choice is necessary to finalize an initiative-level spine. Preserve stable AD identifiers when carrying the decisions into the shared spec.
