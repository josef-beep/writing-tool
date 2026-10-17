---
status: approved
updated: 2026-10-17
scope: Remaining technical planning, local implementation and verification of the approved first release
---
# One approval for the remaining work

Jo approved this pack on 2026-10-17, adopting the foundations and authorizing the remaining engineering work below. After approval, continue without routine contract, story, sprint or internal-review signoffs. Preserve the approved product and UX; use the existing 49 stories as the delivery scope.

This pack approves a direction and delegated engineering decisions. A technical gate closes only when its contract or required evidence exists. It does not label unbuilt functionality, untested platforms or all stories ready merely because approval was given.

## Already settled

All 12 capabilities and FR-1–49 are first-release scope. The final [Design](ux-designs/ux-WritingTool-2026-10-17/DESIGN.md) and [Experience](ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md) govern appearance and interaction. Retain local Electron/TypeScript/React/Lexical boundaries, separate project/universe ownership, one live universe authority, ID-named JSON/WRT files with a dedicated SQLite catalog folder, immutable retained work, complete ZIP backups, bundled LibreOffice DOCX/PDF and separate catalog-only `.sqlite` export. Existing save/cancel/conflict/date/filter/code rules remain binding.

## Foundations adopted by this approval

- [Shared data contract](../specs/spec-WritingTool/data-contracts.md): versioned identities/envelopes, exact decimal strings, root-relative paths, hash/version-matched WRT and chapter formatting, Unicode-scalar anchors, pinned locale-independent code comparison and correlated/idempotent save receipts.
- [Coordinated publication](../specs/spec-WritingTool/publication-contract.md): single-owning-unit durable before/after journal, gated file publication and catalog commit decision, durable finalization before later mutations, conservative restart reconciliation and no stale replay over newer work.
- The two proposed schemas and their [validation evidence](../specs/spec-WritingTool/schemas/validation-notes.md) are the first schema foundation, not complete validation of every entity. Two schemas and 44 checks passed; application crash and installed conformance tests remain work.

## Remaining technical directions

Complete the exact formats, algorithms, adapter choices, failure cases and verification under these directions. Choose routine details within them without additional signoff; record the decisions and evidence in the canonical specification and task tracking.

| Gate | Approved direction | Work required before closing it |
|---|---|---|
| TECH-01 | Build on the shared foundation above. Keep domain payloads closed/versioned, exact integers unbounded and canonical identities independent of paths. | Complete per-entity/command/error schemas, chapter pair/catalog mapping, calendar representation, settings, revision/ZIP/export manifests and explicit migration/code-backfill rules. |
| TECH-02 | Use the proposed staged journal for one unit. Extend cross-unit work with durable participant preparation and one durable coordinator commit decision; gate participating readers/writers until recovery can establish a consistent outcome. | Specify and validate multi-unit decision storage/discovery, participant recovery/availability, file/asset/root-binding publication and idempotency. Do not substitute two independently successful saves for one atomic operation. |
| TECH-03 | Capture an identified saved-generation cut after required pending-edit acknowledgments, with matching catalogs, files and dependencies. | Define capture leases/pins or immutable staging, reference closure, completion manifests, cancellation and release; prove concurrent saves cannot mix versions. |
| TECH-04 | One authoritative writer per owning unit. Use OS-backed ownership plus session/fencing identity and deterministic multi-unit acquisition order. | Verify cross-process lock behavior, stale-owner recovery, revalidation and concurrent-open outcomes. Do not steal ownership merely because a heartbeat timed out. |
| TECH-05 | Persist operation outcomes and reconcile unfinished work before writable reopen; drain required normal-close operations under the approved failure rules. | Define host restart, IPC acknowledgment loss, recovery ordering, supported cancellation and shutdown/retry behavior. |
| TECH-06 | Order versions by durable lineage/generation metadata, preserving original identities; compare canonical content rather than wall-clock timestamps or folder location. | Define equality/divergence representation and hashes, migration and fork detection consistent with the accepted same-record conflict rules. |
| TECH-07 | Apply recovery choices under authoritative leases and expected-version checks. | Define race-free freshness/commit, re-review only affected choices, and safe cross-unit activation without overwriting intervening changes. |
| TECH-08 | Preserve current and retained reference graphs; deletion and partial restore must respect their closure and accepted missing-reference choices. | Specify tombstone/removal behavior, minimal valid restoration scope, protected historical dependencies and validation failures. |
| TECH-09 | Use immutable captured object/asset versions and explicit manifests; cleanup follows reachability from current work, retained revisions and protected captures. | Define version identities, deduplication boundaries, pins, cleanup roots and cross-store retained dependencies. |
| TECH-10 | Track archive identities, owners and destinations; validate archive contents before considering them a completed protected backup. | Define moved-destination discovery, offline/unknown archive treatment and the ten-newest-valid protection rule across locations. Do not delete uncertain protected content. |
| TECH-11 | Keep SQLite behind application ports. Select compatible binding/engine/migrations and a durability configuration that satisfies the publication protocol. | Verify actual native/host/platform integration, filesystem locking and flush assumptions, migrations and interruption behavior before adoption. |
| TECH-12 | Verify and pin compatible dependencies within the already approved stack. Package the isolated renderer/preload/background host, managed fonts and bundled LibreOffice. | Perform compatibility/security/export/font/packaging spikes and record exact versions, notices and installed limitations. No unverified lockfile is a completed integration gate. |
| TECH-13 | Produce the approved one-unit catalog-only `.sqlite` export with accurate external-dependency limitations and safe local publication. | Define metadata/compatibility, consistent snapshot mechanism, source/destination identity protection, validation, cancellation and retry/restart details. |

These directions do not grant a completed technical contract by description alone. If a proposed mechanism fails verification, correct routine implementation details within the approved guarantees; surface a material tradeoff if the guarantees cannot be preserved.

## Execution sequence covered by this approval

1. Complete prerequisite technical contracts in dependency order. Use isolated compatibility experiments where evidence is needed, including the starter/native host/editor/LibreOffice integration. Preserve the existing architecture and final UX.
2. Reconcile requirements/story criteria, run readiness checks and create sprint tracking. Keep readiness limitations explicit and never mark a failed check passed to advance a workflow.
3. Implement the 49 approved stories in their dependency order, beginning with the approved starter setup and then project/universe storage. Satisfy each story's applicable technical gates before its authoritative writes or recovery behavior are delivered.
4. Run appropriate unit/integration/end-to-end checks, internal reviews, fixes and local packaging/installer verification. Keep failures and platform gaps visible, preserving a working increment rather than repeatedly asking for routine approvals.

Approval covers local files, development dependencies within the approved stack, test fixtures, reversible experiments, local application builds and verification. Publish/deploy/send externally only when separately instructed.

## When input is still needed

Continue independently through normal engineering choices, testing, internal review and reversible fixes. Ask only when:

- A new decision changes an approved capability, UX behavior, storage/authority model or data-preservation guarantee.
- Necessary user information cannot be inferred, such as actual access to Windows, Intel Mac or Apple silicon testers. Continue unrelated work while that information is pending.
- A required action needs a new cost, credential, external destination or environment-enforced approval.

Existing unknown platform access remains unknown. This approval is not a claim of test coverage and does not block independent work on the available environment.

## Decision record

**Current status:** approved by Jo on 2026-10-17. Standing authorization is recorded in the spec memory log. Continue the execution sequence without repeat approval at ordinary phase boundaries. Technical gates remain evidence-based.
