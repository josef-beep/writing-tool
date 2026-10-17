# Approved by Jo — recorded in epics.md; DEC-28 unresolved

### Story 4.4: Link an established decision to a decision it leads to

As Jo,
I want to link a decision directly to another decision it leads to,
So that I can follow established chains of choices without inventing intermediate events.

**Acceptance Criteria:**

**Given** two eligible established decisions in the same universe,
**When** I explicitly link the first as leading to the second,
**Then** a directed relationship is saved between their canonical identities,
**And** no intermediate event, copied decision or placeholder record is created,
**And** each decision retains its own date, maker and text.

**Given** a saved direct decision relationship,
**When** I inspect either endpoint or reopen the universe,
**Then** I can distinguish the preceding and following decision and navigate to the same canonical records,
**And** projects sharing that universe see the same authoritative relationship,
**And** repeated linking of the same directed pair creates no duplicate relationship.

**Given** decisions also have resulting-event links,
**When** I add or remove a direct decision link,
**Then** event links and canonical event records remain unchanged,
**And** resolution is derived using the rule Jo accepts under DEC-28 rather than an independently edited flag,
**And** linking does not assume that resolving a downstream decision automatically resolves every predecessor.

**Given** a saved decision-to-decision link,
**When** I explicitly unlink it,
**Then** the relationship is removed without deleting or editing either decision,
**And** other relationships remain intact and affected statuses are recomputed under DEC-28.

**Given** foreign/missing endpoints, a duplicate or disallowed link, cancellation or a failed write,
**When** the operation is processed,
**Then** shared validation rejects invalid links under DEC-28 without inventing records,
**And** cancellation leaves saved relationships unchanged,
**And** failed publication reports failure without inconsistent links/status or false success,
**And** pending writing follows the accepted editor-navigation/retry rules.

**Requirements:** Amended FR-32 direct decision-to-decision links; FR-31/44; CAP-7; AD-3/6/8/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1–3 capabilities and Stories 4.1–4.3 only. Resolve DEC-28 resolution semantics and permitted cardinality/self-links/cycles/temporal validation before affected implementation. TECH-01 must include directed decision relationship DTOs, validation, errors and bidirectional queries; TECH-02/04/05/11 govern serialized crash-safe publication and persistence. Reuse DEC-15 editor navigation; PLAN-04 covers link/unlink interactions. Tree visualization follows as Story 4.5 and is not a dependency for creating/inspecting links.

**Scope boundary:** Direct established decision relationships only; no hypothetical alternatives, automatic inferred links, intermediate events, transitive resolution rule or decision deletion. Standalone events remain usable without decision links. Existing event-only status criteria in Stories 4.2–4.3 must be reconciled after DEC-28 is answered; approval of this proposal would not choose an unanswered rule.

**Verification:** Save and reopen A → B → C, inspect direction and canonical endpoints and navigate both ways. Mix decision-to-decision and decision-to-event links; unlink without endpoint mutation and verify the accepted DEC-28 resolution behavior. Exercise duplicate pairs, foreign/missing endpoints, accepted cardinality/temporal/self-link/cycle cases, cancellation, failed writes/restart and shared-universe isolation.
