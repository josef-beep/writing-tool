---
status: adopted
contractVersion: 1
scope: TECH-02 and TECH-04 coordination algorithm
updated: 2026-10-17
---
# Writer ownership and coordinated publication

Adopted engineering detail under Jo's standing execution approval. This extends [single-unit publication](publication-contract.md); it does not claim a verified Electron binding, complete command payload schemas or installed crash consistency. Those gates remain open until their evidence exists.

## Writer ownership

Each owning root has a dedicated `database/lease.sqlite`. Initialize it only during valid unit creation or an explicit supported migration, never as a substitute for an unrecognized/missing catalog. A private connection uses rollback journal mode and holds `BEGIN EXCLUSIVE` for the full authoritative host session. Other connections attempting ownership receive busy, not a second writer. This separate lease database does not hold the content catalog's transaction open.

No heartbeat timeout permits takeover. Retain the private lease connection until all operations are drained; never delete/recreate a locked lease file or replace it during a folder move. If ownership connection health is lost, stop new file/catalog writes and captures, retain recovery evidence and reacquire/reconcile before reopening. Cross-process ownership is a verified adapter obligation, not merely an in-process mutex.

On acquisition and before content writes, reconcile unfinished operations, then publish a fresh host-session UUID/fencing token in operating metadata. Every planned mutation captures that token and expected unit generation. Revalidate before file publication and within the catalog commit. A stale session token rejects the write. Runtime fencing/session metadata is not a user record or a content-version ordering timestamp.

Acquire multi-unit leases and publication gates in canonical `(kind,id)` lexicographic order; remove duplicate participants first. On acquisition failure release newly acquired unused resources without partial mutation; do not hold one while waiting indefinitely for another. Discover any additional participants required by unfinished operations before mutation. If discovery expands the set after acquisition, release the unused set and reacquire the complete closure in canonical order; never acquire a lower-order root while holding a higher-order one. All application reads/captures of participants respect publication gates. An unrelated unit and already-loaded editor can continue working.

A second host/session cannot independently edit a unit held by another authority. Report the busy/unavailable condition and retain pending UI context. Do not automatically switch authority or kill the other process. The existing missing-authority/locate/recovery workflow remains separate.

## Durable coordinator records

The background authority owns an application-runtime SQLite coordinator ledger, identified by a permanent coordinator UUID. It lives in application user-data, outside user writing roots. This is operational decision metadata, not another live universe copy or a complete backup. Participants reference coordinator/operation UUIDs and root IDs; paths remain resolved locations through the separate root-binding contract rather than copied into every operation/object.

A coordinator operation records version, operation UUID, semantic request digest, ordered participants, expected/target unit generations, fencing tokens, participant-plan digests and state `preparing|prepared|commit|complete|aborted`. Each participant's durable journal identifies the same operation/coordinator and full before/after bytes plus an exact typed catalog mutation plan. Raw renderer SQL is never a plan. The ledger also stores the deterministic aggregate result/receipt needed for retry. Duplicate operation IDs require an identical request digest.

The `commit` ledger transaction is the only multi-unit commit decision. Never infer it from wall clocks, existence of a staged file, a subset of local catalog commits, an IPC success or disappearance of another participant. A missing/incompatible/unreadable decision ledger is unknown outcome, not permission to abort or adopt a new coordinator identity.

## Cross-unit sequence

1. Resolve all participating root identities and binding versions; acquire their authoritative leases/gates in order. Recover previous work first. Check expected generations, fencing tokens, reference/domain invariants and all participant identities. Write a durable `preparing` ledger entry before any participant can change live files.
2. Stage complete before/after bytes and typed before/after catalog plans in every participant. Flush each journal/files/directory and verify hashes/expected generations. Mark every participant prepared, then durably mark the coordinator `prepared`. No live content is changed yet.
3. Publish every participant's staged after-files and flush required file/directory entries while all gates remain held. Revalidate lease/fence/generation expectations. If the commit decision is still definitively absent and a failure occurs, undo all participants through their journals; incomplete undo blocks them for recovery.
4. Write the coordinator's durable `commit` decision containing the verified participant-plan digests. An ambiguous ledger commit must be reconciled by reopening/recovering that ledger. After a confirmed commit, cancellation cannot change it into an abort.
5. Apply each participant's typed catalog plan transactionally, checking its expected generation/fence and writing its local committed-operation evidence. This local transaction is a participant application step, not a new independent decision. Verify after-file/catalog identities and versions. A failure now requires committed redo, never undo of an already-decided operation.
6. Durably mark every participant finalized and record coordinator `complete` before releasing any participant gate or acknowledging the aggregate operation. Later mutations cannot begin while this operation is unfinished. Release gates only when all participants agree with the committed cut. Cleanup may happen afterward without rewriting old files over newer generations.

A local journal distinguishes `single-unit` from `coordinated` scope. Single-unit recovery uses its catalog operation row. Coordinated recovery consults the identified coordinator decision even if one local catalog has no operation row yet. Do not run single-unit rollback logic on an externally committed participant.

## Restart and unavailable participants

| Evidence | Required behavior |
|---|---|
| Matching durable coordinator `commit`/`complete` and valid participant plans | Finish committed file/catalog application and finalization idempotently. Missing local commit evidence does not authorize rollback. |
| Valid coordinator ledger definitively `preparing`/`prepared`, no commit decision | Restore every participant's before state; durably mark aborted only after rollback verifies. Retain incomplete rollback for restart. |
| Decision unreadable/missing, mismatched identities/digests/generations, or required participant unavailable | Preserve evidence and block affected participant writes/captures/activation. Locate/recover the required identity through accepted workflows; no guessed winner or partial success. |
| Finalized operation and verified later generations | Return recorded prior receipt for an identical retry; cleanup only. Never replay its obsolete bytes over current work. |

Recovery reacquires all needed leases before modifying participants. Process death releases OS ownership; it does not establish an operation outcome. A removed drive can delay recovery of a decided operation. The application must describe that limitation accurately rather than presenting one participant as independently completed.

## Captures, archives and moves

A revision/ZIP/export cut cannot include participants with unfinished publication. TECH-03 must pin or stage a complete identified saved generation after required edit acknowledgment; a database snapshot alone does not synchronize external files. Independent complete ZIPs contain finalized logical catalog/content/history and manifest closure, not a dependency on a live coordinator ledger or active lease. Runtime lock files, uncommitted SQLite journal state and in-flight staging are not independent recovery content. Exact manifest normalization, captured finalized-operation metadata and restore activation are required under TECH-01/03/09 before capture/recovery delivery.

Root relocation requires drained operations, validated owning identity, exclusive authority and compare-and-swap on the one root binding version. Do not move/rebind only one participant during an unfinished operation. A copied live folder is not automatically another authority or a legitimate unlocked replica. Exact root discovery and filesystem replacement primitives remain part of adapter verification.

## Evidence and exit criteria

A temporary two-process experiment on this Linux machine using Python SQLite3.45.1 verified that the second exclusive lease was denied and ownership became available after terminating the first process. It did not test Electron's binding, fencing, multi-unit publication, other filesystems or Windows/macOS. It is a mechanism probe, not completion of TECH-04/11.

Required tests cover competing opens, owner death, lost lease connection, every prepare/file/decision/catalog/finalization interruption, unavailable participants, corrupt plans, retry with equal/different digest, stale fencing/generations, interrupted undo/redo, restored archives without live runtime metadata and later-generation replay protection. Until these and the concrete adapter/schema obligations pass, TECH-02/04 remain open.

SQLite documents its OS locking and transaction behavior in [file locking](https://www.sqlite.org/lockingv3.html) and [transactions](https://www.sqlite.org/lang_transaction.html). This application coordinator is our design for arbitrary external files and separate roots; SQLite's built-in multi-database commit is not assumed to cover them.
