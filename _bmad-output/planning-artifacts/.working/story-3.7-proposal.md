# Story 3.7 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.7: Record faction profiles and track completeness

As Jo,
I want to record faction profiles and save unfinished drafts,
So that I can develop the setting's organizations gradually and see which profile information remains incomplete.

**Acceptance Criteria:**

**Given** an available universe,
**When** I create or edit a faction profile,
**Then** the profile is a universe-owned record with a permanent UUID,
**And** it supports faction name, description and identifier image/pictogram,
**And** it supports government type and notes,
**And** it supports leader image, name, age, public reputation and narrative profile, plus military head and intelligence head,
**And** it supports strategic overview, strengths and weaknesses.

**Given** some non-roster profile information is unanswered,
**When** I save the draft,
**Then** incomplete profile information does not block saving,
**And** the profile remains identifiable and reopenable as an incomplete draft,
**And** the application does not fill missing fields with Fero-Kia example values or invent additional required fields.

**Given** faction profile completeness is evaluated,
**When** all non-roster fields are filled,
**Then** the faction is complete without requiring any military roster entry,
**And** an unanswered non-roster field leaves it incomplete while still saveable,
**And** character-specific optional-image or prompt-waiver rules are not automatically applied to faction completeness.

**Given** I select a supported identifier or leader image,
**When** the image/reference update is committed,
**Then** the existing managed-asset service copies it into the owning universe's storage,
**And** the profile stores a relative asset reference rather than bytes or the original import path,
**And** reopening or removing the source file does not remove the managed image,
**And** replacing/clearing an image preserves protected immutable assets and updates profile completeness without blocking draft saving.

**Given** narrative faction information includes organization, technology, resources, doctrine, intelligence, troop numbers or allies,
**When** I record it in the relevant existing narrative fields,
**Then** the content is preserved without requiring separate mandatory structured fields for every topic,
**And** the source example does not impose fixed names, images, numeric values, layout, relationship tracking or combat mechanics.

**Given** a faction profile and any images were successfully saved,
**When** I reopen the universe or inspect its factions through an associated project,
**Then** the same profile identity, field values, images and completeness state are available,
**And** other universes' profiles remain separate,
**And** creating/viewing a faction requires no character membership or military roster feature.

**Given** I cancel profile edits, an image fails validation or publication fails,
**When** the operation ends,
**Then** cancellation preserves the saved profile,
**And** failures are reported without claiming success,
**And** the shared publication/recovery contract preserves consistent profile and image references without changing unrelated records.

**Requirements:** FR-36 non-roster profile fields, draft saving and completeness; FR-44 faction sharing; CAP-6; AD-3/4/6/8/9/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.6 only. Reuse Story 3.4's asset contracts/service under DEC-18 and TECH-09; do not copy its character-specific optional-field completeness rule. Use TECH-01's common faction/asset/state schema and the applicable TECH-02/04/05/11 writer, publication, operation-recovery and persistence guarantees. Capture faction form, draft/completeness and image interactions under PLAN-04. Exact field validation follows the shared contract rather than inferred example defaults.

**Scope boundary:** Deliver complete non-roster faction development using the source field matrix. Optional repeating military units follow in a separate story, without being a dependency of saving or completing this profile. Character membership/history follows afterward and must reference this same faction UUID. Faction deletion, hypothetical relationships, combat simulation and additional mandatory profile fields are not introduced here.

**Verification:** Exercise every non-roster field, partially filled draft saving/reopening and complete profile saving with no roster. Remove one completeness field and confirm an incomplete draft still saves. Import/replace/clear both image roles under the managed-asset contract; remove source files and reopen. Verify shared-project access, universe isolation, narrative preservation, cancellation and failed profile/asset publication.
