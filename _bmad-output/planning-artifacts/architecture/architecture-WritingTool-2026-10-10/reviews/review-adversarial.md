# Adversarial review — architecture spine

Verdict: **Conditional pass for architecture handoff. One small shared capture-boundary clarification is recommended; the declared recovery, storage and lifecycle gates must remain implementation preconditions.**

Reviewed ARCHITECTURE-SPINE.md and RECONCILIATION.md against the superseding coaching decisions. This review does not reopen Electron, Clean Architecture, SQLite, external images, separate ownership units, canonical universe recovery, open-ended story/volume counts, time-only retention or ten protected backups.

## 1. Medium — capture frontier between editing and recovery is still ambiguous

**Affected:** AD-5, AD-14, AD-18; settings/save convention; editor and revision epics.

Two independently implemented epics can satisfy the stated boundaries yet disagree:

- The editor epic keeps the newest Lexical draft in presentation and sends it to the application only at autosave. The revision epic takes a complete immutable manifest of the last saved database state at its timer. Every authoritative write still passes through application use cases, manifests are complete, and the backup contains a consistent saved database state.
- The recovery epic requests a renderer flush before every revision or restoration checkpoint and expects the checkpoint to include edits made since autosave. Its manifests, cross-store references and persistence also comply with every AD.

These designs produce different recoverable content when the two configurable intervals diverge or a user restores while the editor is dirty. Close is explicitly coordinated, but the same boundary is not stated for interval snapshots and especially the pre-restoration Replaced snapshot. The source FR-4 requires the snapshot of current work before restoration, and FR-18 describes snapshots of current project content.

**Minimal enforceable rule:** Identify one application-owned capture frontier shared by save, revision and recovery. At least before any destructive restoration, all current editor changes must be submitted and durably included in the Replaced checkpoint before mutation starts; a failed capture prevents restoration. State explicitly whether scheduled revisions capture the current draft or only the last saved state, and make both editor and revision implementations obey that contract. This is a small shared semantic decision, not a request for a complete IPC schema. The pre-restoration part follows the existing requirement; any remaining interval/draft ambiguity can be resolved in the shared save/revision contract gate without inventing a user preference.

## 2. Cross-store checkpoint ownership — gated, not a new missing-format defect

**Affected:** AD-4/10/14/15; revision-manifest/cleanup gate.

One proposed storage epic can pin immutable universe checkpoints through a project manifest; another universe cleanup epic can independently expire checkpoints by universe age. Both proposals have the right ownership and age policies, but they cannot be shipped together if the universe garbage collector cannot see the project's retained reference. The manifest/object identity and cleanup-roots gate already requires a single store-wide contract and proof that referenced objects survive. An implementation that skips that gate or deletes a required checkpoint violates AD-14/15; it is not a valid counterexample to the spine.

**Gate acceptance condition:** A retained project revision in an unopened or moved project must either continue to protect its complete historical dependency closure or carry that closure in independently recoverable storage under the common protocol. Do not assume only currently open projects count as roots. Project ZIP recovery must prove current and historical assets resolve without either original live store.

No new user blocker is required for this protocol choice.

## 3. Complete historical restore versus newest authority — deliberately gated

**Affected:** AD-7/8/14; reconciliation and universe-integrity gates.

One recovery proposal can treat an absent canonical character as a conflict requiring manual resolution; another can recreate it from a historical checkpoint as part of an explicitly confirmed resolution. Both are compatible with the high-level requirement only after sharing conflict, cancellation and authority-version rules. A proposal that silently activates the historical universe or overwrites the canonical record is already prohibited. Complete revision availability does not promise automatic restoration over the newest shared universe.

**Gate acceptance condition:** Fix the authority state against which a reconciliation is reviewed; detect changes before committing. Define what is restored when a referenced canonical record has been deleted, and whether an explicitly approved universe change is committed globally. Cancel or unresolved conflicts must leave the project inactive and the authority unchanged by that restoration. A failed post-resolution ZIP is a visible retryable backup failure, as AD-7 already requires.

These are already named architecture/Jo recovery gates. Do not create an automatic conflict winner or a second authoritative copy to fill the gap.

## 4. Backup minimum and cleanup — coherent, discovery protocol remains mandatory

**Affected:** AD-5/15; archive-discovery and close/retry gates.

One archive epic could count the ten valid archives known in the current destination; another cleanup epic could count only its own catalog after the destination moves. That incompatibility is caught by the explicitly shared archive-discovery gate. The durable user invariant is already clear: ten newest successfully completed valid ZIPs per project and per standalone universe remain protected, including manual deletion; embedded snapshots do not count as standalone universe backups; age applies only beyond the protected minimum.

**Gate acceptance condition:** Test changed/unavailable destinations, partial ZIPs and catalog restart together. Cleanup must not turn lack of visibility into permission to delete a protected backup. Publishing a new valid archive and recalculating the protected set must agree across backup and cleanup implementations. No size policy or ten-revision minimum may reappear.

## 5. Dates and utility-process lifecycle — no additional initiative blocker found

AD-16 prevents the plausible incompatible chapter implementations: first assignment/clearing affects only start; existing-start movement uses the universe's elapsed-day delta; linked movement defaults on and is switchable off; only selected main events and an existing end shift; end-only editing leaves everything else alone; flashbacks retain historical dates. Simultaneous explicit start/end editing and invalid ranges are named gates, so selecting an unconfirmed precedence now would be an invented preference.

AD-18 gives the renderer, host and utility process distinct responsibilities and puts every authoritative mutation through application use cases. Its durable-operation/retry/close gate must unify worker restart, partial application operations and close-triggered save/revision/ZIP work. Separate epics cannot choose incompatible retry identities or assume that a restarted worker has completed an interrupted request. Because that shared protocol is already a pre-implementation gate, absence of its full schema is not an initiative-level defect.

## Recommended disposition

Clarify the editing-to-checkpoint capture boundary in the spine or add it explicitly to the common save/revision gate. Keep the existing gates binding and assign the shared contract before affected epics implement it. The remaining attempted counterexamples either violate existing ADs or deliberately bypass an already declared shared gate; they do not justify reopening the settled architecture or requesting more per-story detail here.
