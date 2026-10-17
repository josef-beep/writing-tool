# WritingTool — Step 4 final validation

Result: **CONCERNS — draft; 2 checks open; V01–V03 resolved.** All 49 stories are approved by Jo, but approval does not resolve the prerequisites recorded in the stories. The workflow cannot truthfully declare every story ready for development yet. Story creation is completed; final validation has run and has not passed.

## Checks performed

1. **FR coverage:** Checked FR-1–49 against inventory, per-epic coverage and story acceptance/verification contracts. Every FR has named story coverage; implementation readiness remains conditional on the explicit technical contracts. The traceability matrix below distinguishes mapping from development readiness.
2. **Architecture/starter/entities:** Story 1.1 substantively uses the official Forge Webpack/TypeScript starter with React and the adopted process/security boundaries. Its title now matches the step’s literal starter naming rule (V01 resolved at Jo’s request). Story 1.2 and subsequent entity stories explicitly introduce only their needed storage. Jo has selected JSON object files, plain-text WRT writing and the dedicated-folder ID/relationship/location catalog; AD-10/13 and canonical contracts are reconciled (V03 resolved). DEC-36 formatting is now settled in companion chapter JSON; DEC-10 platform-test access and coordinated publication schemas/protocols remain V04/V05.
3. **Story quality:** All 49 unique sequential stories have As/I want/So that, Given/When/Then criteria, requirement references and dependency sections. Several implementation outcomes remain parameterized by unresolved technical contracts (V05), so independently testable completion and single-agent implementation sizing cannot yet be certified for all stories. Broad shared workflows were deliberately consolidated (four manuscript formats; one backup pipeline), but must be bounded after their open contracts are settled rather than split purely by format.
4. **Epic structure/file churn:** Six epics deliver incremental user capabilities. Repeated extension of canonical event/character/selection/capture contracts is justified by first making standalone chronology usable, then writing, character context, decision relationships and recovery. There are no implemented core files to measure physical churn; the design intentionally reuses shared ports/records rather than duplicate stores. No epic consolidation is required solely from this overlap.
5. **Dependencies:** Basic Epics 1/2 workflows are usable before characters/decisions/recovery. ZIP creation (5.5) precedes project restore (5.6), satisfying its new reconciled-ZIP dependency. The amendment-introduced Epic 4 forward acceptance/verification dependencies are corrected (V02 resolved); mixed-link verification now follows both link capabilities, and filter integration is in 4.7. A mention of a later integration obligation is not itself treated as an implementation dependency.
6. **Formatting/save:** Six epic coverage tables, 49 explicit primary FR mappings and 49 unique sequential story IDs verified. No unresolved template markers in story headings/user-story fields. `status: draft` is retained. PLAN-04 UX preference, reference and written-coverage work is complete, including the approved one-owning-unit catalog-only `.sqlite` export workflow. The spines contain 48 selected mode colors, 19 component responsibilities and 16 source-grounded flows; five lasting references are promoted. Jo skipped optional UX validation; required editorial polish completed. Final handoff consistency checks apply to documents and static references, not installed/runtime/accessibility/performance acceptance.

## Validation findings

### V01 — Starter story title convention — resolved

Jo requested the heading rename. Story 1.1 is now titled “Set up initial project from starter template,” matching the workflow convention. Its acceptance criteria, scope and approval are unchanged. The heading was checked in the maintained epic plan; no full revalidation or implementation testing is claimed by this correction.

### V02 — Forward acceptance/verification dependencies — resolved

At Jo’s instruction, Story 4.2 now adds/selects/persists decision types without requiring category visibility controls. Story 4.7 explicitly accepts and verifies filtering a type created in 4.2 after reopening. Optional direct Universe Event maker-reference editing is explicitly delivered in 4.2 after the maker/character foundations; the standalone Epic 1 workflow needs neither maker services nor decision links.

Story 4.3 now tests event-only resolution and explicitly assigns combined-link integration to 4.4. Story 4.4 tests both removal directions: removing the last event link while a following-decision link remains and vice versa; only removing the final outgoing link across both kinds returns the source to unresolved. Canonical endpoint data/identities and the agreed either-result rule are preserved.

Checked the affected acceptance criteria, verification and scope paragraphs and their earlier-story dependency declarations. All 49 stories/FR mappings and approvals are retained. This correction does not resolve DEC-26/30 or other open behavior/contracts, and is not a full validation rerun or an implementation test result.

### V03 — Category storage/database architecture — resolved

Jo explicitly selected JSON-format `<object-id>.json` files for structured data/settings, plain-text `<chapter-id>.wrt` for writing and a database catalog recording IDs, filenames, relationships and object locations. Content lives in files; catalog state remains required for complete recovery. The database has its own folder inside each owning data root alongside category folders, and complete ZIPs include files, catalog and required history/assets. Jo further specified one separate base-location database record per root and root-relative object locations; moving the entire data folder updates only that base record, with all object IDs/path rows/relationships/files unchanged. AD-9/10 and Stories 1.2/1.3 now state this explicitly.

Updated architecture AD-10/13, reconciliation, canonical spec/requirements/contracts and affected editor/storage criteria. The previous persisted JSON manuscript payload is superseded. Basic representation and responsibility are settled, so V03 is closed. Jo subsequently resolved DEC-36: rich formatting lives in the matched chapter JSON while WRT stays plain text; exact schema/version/encoding, immutable revision namespaces and crash-safe file/catalog writes remain technical prerequisites under V05, not evidence of completed implementation.

### V04 — UX choices resolved; platform-test access remains unconfirmed

Product and principal UX choices are now settled in the canonical [requirements](../specs/spec-WritingTool/requirements.md), [contracts](../specs/spec-WritingTool/contracts.md) and the [Design](ux-designs/ux-WritingTool-2026-10-17/DESIGN.md)/[Experience](ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md) handoff. This supersedes earlier unresolved-preference and database-export-scope notes. All prior DEC resolutions and 49 story approvals are preserved; DEC-38 codes remain adopted and TECH-01 retains their exact schema/allocation gates.

FR-49 and Story 6.2 now specify one owning project/standalone-universe consistent `.sqlite` catalog snapshot, metadata/external references and explicit JSON/WRT/formatting/images/history exclusions. The source notice, pending-edit safeguards, local Save As/overwrite/live-source protection, center progress/supported Cancel, validation-before-publication, prior-output preservation, failures/retry/location/cancel and saved-path/open actions are approved. Complete ZIP backup remains independent recovery. TECH-13 now tracks technical mechanisms rather than an unselected product artifact.

DEC-09 platform targets and DEC-10's installed-verification matrix are approved, but actual Windows/Intel Mac/Apple Silicon hardware/VM/tester access remains unanswered. The current Zorin workstation is not evidence of passing installed tests. A concise access question is pending with Jo. V04 stays open for this access constraint; do not manufacture compatibility evidence. DEC-11 workload/timing specifications remain adopted, while fixture generation/measurements remain acceptance work.

This checkpoint reconciles the approved UX/export amendments; it does not rerun or pass the entire development-readiness workflow. Remaining correction: record real test access/constraints and carry verification limits into the implementation plan. Optional UX validation was skipped by Jo, not passed.

### V05 — Shared technical prerequisites prevent declaring the full backlog ready

Current technical progress: proposed [data foundations](../specs/spec-WritingTool/data-contracts.md) and [single-unit publication](../specs/spec-WritingTool/publication-contract.md) now make part of TECH-01/02 concrete. Two draft schemas passed meta-schema validation and 44 schema/example assertions. They are not adopted or complete gate contracts: per-entity/DTO/catalog/manifest/migration coverage, multi-unit coordination, writer leases and installed durability/interruption proof remain open. This document/static check does not alter the failed readiness verdict.

Evidence: all 13 TECH entries remain unchecked. Story 1.1 requires shared typed IPC (TECH-01) and candidate dependency verification (TECH-12); 1.2 adds writers/persistence (TECH-04/11). Revision/recovery stories require pending-edit consistency, crash-safe publication, authoritative comparisons/freshness and reference preservation (TECH-02–09). Cleanup requires archive discovery/protection (TECH-10); database export requires TECH-13. The source criteria explicitly state that these prerequisites are unresolved.

Required correction: resolve and publish the necessary versioned contracts and verify the required integration choices at the stated gates. Distinguish unimplemented functionality (normal at planning time) from missing specifications needed to implement/test it. Not every later technical gate must be complete before an unrelated early story, but the blanket Step 4 claim that every story is ready cannot pass while they are unresolved.

## Requirement traceability

These are coverage references, not claims that implementations or prerequisite decisions are complete.

| FR | Story coverage |
| --- | --- |
| FR-1 | 2.2 |
| FR-2 | 5.1–5.4 |
| FR-3 | 5.6–5.7 |
| FR-4 | 5.2–5.4, 5.6–5.7 |
| FR-5 | 2.3, 3.13, 5.2 |
| FR-6 | 3.12–3.13, 5.2, 5.4 |
| FR-7 | 1.9 and later dated-record integration |
| FR-8 | 1.6, 1.9 |
| FR-9 | 1.6, 1.9 |
| FR-10 | 1.6, 1.9 |
| FR-11 | 1.6, 1.9 |
| FR-12 | 1.6, 1.9 |
| FR-13 | 1.6, 1.9 |
| FR-14 | 3.5 |
| FR-15 | 3.1–3.2 |
| FR-16 | 3.1–3.4 |
| FR-17 | 3.3 |
| FR-18 | 5.1–5.4, 5.6, 5.9 |
| FR-19 | 5.10 |
| FR-20 | 5.1, 5.10 |
| FR-21 | 5.1, 5.5, 5.10 |
| FR-22 | 5.1–5.7, 5.10 |
| FR-23 | 5.5, 5.7 |
| FR-24 | 5.5, 5.8–5.9 |
| FR-25 | 5.5, 5.8–5.9 |
| FR-26 | 5.9 |
| FR-27 | 6.1 |
| FR-28 | 2.6–2.7 |
| FR-29 | 2.6–2.7 |
| FR-30 | 2.5, 2.7 |
| FR-31 | 4.2, 4.5, 4.7 |
| FR-32 | 4.3–4.5 |
| FR-33 | 4.6 |
| FR-34 | 4.1 |
| FR-35 | 1.7, 4.3, 4.7, 5.4–5.5 (later maker/folder amendments) |
| FR-36 | 3.7–3.8 |
| FR-37 | 3.9 |
| FR-38 | 3.9 |
| FR-39 | 3.6 |
| FR-40 | 1.7–1.8, 3.5–3.6, 4.1–4.2 |
| FR-41 | 1.8 and later canonical dated records |
| FR-42 | 2.1, 2.3 |
| FR-43 | 2.4, 2.6–2.7 |
| FR-44 | 1.2–1.3, 1.7 and later shared-record workflows |
| FR-45 | 3.14, 4.7 |
| FR-46 | 3.11, 3.13 |
| FR-47 | 3.10 |
| FR-48 | 3.2–3.4, 3.9–3.10 |
| FR-49 | 6.2 |

## Next action

Keep the 49 approvals and `status: draft`. V01–V03 are resolved. Resolve remaining decisions/contracts at their affected gates, then re-run Step 4. Do not offer the completion menu while failed checks remain. No sprint status or implementation-ready/final declaration is produced by this run.
