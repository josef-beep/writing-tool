---
title: 'Release coding pass — workspace entities and durable editing backend'
type: feature
created: 2026-10-18
status: in-progress
route: dispatch
baseline_commit: a2c200bfd12c56be077e4c9afed731f42cba8eb3
context:
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/workspace-data-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/requirements.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/data-contracts.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/publication-contract.md
  - /home/jo/Documents/writing-tool/_bmad-output/specs/spec-WritingTool/coordination-contracts.md
---

<frozen-after-approval reason="Full release implementation is approved; user explicitly requires all coding before testing">

## Intent

Implement the complete authoritative editing backend for the remaining writing workspace (Stories 1.4–1.9, 2.1–2.7, 3.1–3.14 and 4.1–4.7). Story 1.3 supplies independently located projects/universes. This slice supplies closed domain types/validators, exact chronology, all accepted record mutations/queries, durable category-file/catalog publication, app settings and the secured transport. Full presentation and history/backup/export adapters follow in subsequent coding slices; do not stop at a placeholder or a proposed design.

## Boundaries & Constraints

Always use canonical approved requirements and later resolved decisions, Clean Architecture, permanent UUIDs, same-universe references, exact integer semantics and a single authority per root. WRT is plain LF text with matched companion JSON formatting. Typed closed payloads must be validated semantically against the candidate state before writes. Publish all affected JSON/WRT/index/code/counter/relationship changes as one unit operation under its existing lease/fence. Cross-unit writes use the adopted coordinator decision. Reopening must reconcile before activation and unknown outcomes must retain original operations.

Preserve the existing universe/profile/project APIs and legacy roots with explicit conservative feature-schema migrations. Keep base bindings separate, paths relative and all records in real category folders. Add no product caps or invented mandatory fields. Preserve chapter/event isolation, full case-folded shared codes, birth synchronization, character waivers, optional faction roster, graph validation and filter semantics.

No tests, lint, typecheck, smoke, builds, packaging or runtime probes during this coding pass. Do not change diagnostic expectations to make unrun tests appear passed. Do not mark stories done or gates verified. Leave existing generated `.webpack` changes alone. Do not add renderer filesystem/SQL/general IPC authority.

## I/O & Edge-Case Matrix

| Scenario | Input | Required result | Failure |
|---|---|---|---|
| Edit workspace records | Named entities and typed commands | Persist complete semantic state, exact versions and order | Retain prior state/pending edits |
| Write chapter | Text/format/dates/links | Matched WRT/JSON/catalog and acknowledgment revision | No mixed pair activation |
| Dates/calendar revision | Signed arbitrary years; populated config | Entered values survive; elapsed chronology preserved | Clear validation, no silent coercion |
| Linked mutations | Births, graph, chapter refs, affiliation | Validate ownership/references/graph and atomically publish | No partial link/content updates |
| Restart/retry | Interrupted journals or repeated operation | Conservative undo/redo/idempotent result | Preserve unknown evidence, block unsafe writes |
| Settings import | Partial/unknown/invalid known fields | Atomic accepted values, warnings, missing retained | Invalid known rejects entire import |

</frozen-after-approval>

## Code Map

- `src/application/project.ts`, `universe.ts` and their adapters: existing active ownership and candidate activation. Extend application ports for authoritative document access instead of opening a competing catalog/lease connection.
- `src/infrastructure/universe-storage.ts`, `project-storage.ts`, `universe-files.ts`: existing schema/session/lease/recovery helpers. Extend primary catalogs through named feature migrations; maintain one unit-generation sequence across profile/content mutations and dispatch recovery by closed journal type. Reuse anchored managed I/O.
- New `src/domain/workspace.ts`, `calendar.ts`, `manuscript.ts` (or cohesive modules): complete entity contracts/invariants, pure sorting/filtering/completeness/graph/chronology and accepted personality catalog.
- New `src/application/contracts/workspace.ts`, `src/application/workspace.ts`: versioned closed command/result unions, guarded aggregate queries, optimistic record/unit versions, operation receipts and all editing use cases.
- New `src/infrastructure/workspace-storage.ts`, settings/coordinator adapters: typed durable publication and app-wide settings persistence. Do not use a JSON-only substitute for catalog/relationships or SQLite-only payloads.
- `src/desktop/main.ts`, `utility-host.ts`, preload/global declarations and a bounded workspace client: purpose-bound commands; native asset/settings selection and validated readable PNG/JPEG/WebP import. Return display-safe image content through a constrained endpoint, not arbitrary paths.

## Tasks & Acceptance

- [ ] Domain: complete closed records and pure invariants for stories, volumes, chapters, calendar/events, plots, characters/factions/births/affiliations, decision types/relevance/results/filtering, exact 100 personality labels and matched manuscript paragraph/mark formatting.
- [ ] Application: complete typed mutation/query APIs, optimistic versions, durable receipts, validation, nonoverlapping serialized authority and unknown-outcome reconciliation.
- [ ] Infrastructure: complete per-unit category-file/catalog publication, migrations, interruption recovery, snapshots, immutable assets and shared-code allocation; expose ports reusable by later revision/archive/export adapters.
- [ ] Settings: atomic ID-named JSON settings with 5/10/10/30 defaults, layout/theme/font preferences and import/export semantics. Do not use browser localStorage as authoritative settings.
- [ ] Desktop: connect every backend use case through a named closed bounded bridge. Main owns native selectors, paths and image decoding; utility owns authoritative writing. Add no UI work beyond declarations needed by the existing shell; the next slice implements full presentation against this API.
- [ ] Documentation: publish exact consuming schemas/DDL/journal formats and a concise backend API map with commands, exported types and integration entry points so the next presentation slice can work without guessing.

Given an existing active unit, when any valid supported record mutation is submitted, then its full candidate state and references are validated and one durable generation is published. Given invalid/unowned/stale state, when saving, then committed bytes remain unchanged. Given old/new interrupted evidence, when reopening, then only a verified coherent cut is activated or the evidence is blocked and preserved.

## Implementation Notes

Standing authorization settles scope, routine design and no-repeat signoff. All existing source changes from Story 1.3 belong to this same coding pass and must be preserved. Backend completion is provisional until the later verification phase; record real remaining risks or missing parts. Implement working code in this slice rather than deferring difficult domain/persistence paths to a future reviewer. No irreversible migration of user data should be executed during implementation.

## Verification

Execution is explicitly deferred until all release coding is finished. Inspect source/contracts manually only; do not run validation commands. Leave status in-progress and give a precise API handoff plus any remaining incompleteness.

## Coding handoff — 2026-10-18

The domain, application, same-authority category/catalog publication, coordinator, settings and bounded desktop bridge source is implemented. The exact consuming types, DDL/journal formats and later capture/restore integration seams are documented in [workspace-backend-api.md](../specs/spec-WritingTool/workspace-backend-api.md). Unicode 17 full folding and canonical normalization data plus its license are pinned in source.

Source inspection only: no tests, lint, typecheck, builds, smoke, packaging or runtime probes ran. Tasks and release gates remain unverified; status remains in-progress. Existing Linux anchored I/O is reused; other platform primitives and the later presentation/history/archive/export adapters remain separate delivery work.
