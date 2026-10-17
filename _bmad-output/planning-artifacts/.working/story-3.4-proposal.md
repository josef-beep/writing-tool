# Story 3.4 proposal

Approved by Jo and appended to Epic 3 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 3.4: Add and view optional character images

As Jo,
I want to attach an image to a character and view it in the profile,
So that I can keep a visual reference alongside the character's recorded details.

**Acceptance Criteria:**

**Given** a character exists in an available universe,
**When** I select a supported local image and save it as the character's image,
**Then** WritingTool validates the import and copies the image into that universe's managed image storage,
**And** the character references its managed asset relative to the owning universe root,
**And** SQLite stores the asset reference rather than image bytes or a dependency on the original import path,
**And** the viewer displays the image according to DEC-18's accepted display rules.

**Given** the image import was successfully committed,
**When** I move or remove the original source file and reopen the character,
**Then** its image still displays from managed storage,
**And** projects sharing the universe use the same authoritative character/image reference,
**And** moving the universe folder and resolving its unchanged identity preserves the relative asset reference.

**Given** a character has a saved image,
**When** I replace it with another supported image or clear its image selection,
**Then** the character viewer shows the new image or the agreed no-image placeholder,
**And** the character UUID, other profile content, personality selection and waivers remain unchanged,
**And** previously saved assets are not mutated in place or deleted while any current/retained references require them.

**Given** a character of any type has no image,
**When** I save or view it,
**Then** the image placeholder is shown and saving is permitted,
**And** an absent image does not make the character incomplete or require a waiver,
**And** an extra can still be a name-only profile.

**Given** I cancel import, choose invalid/unsupported content or encounter a copy/reference-publication failure,
**When** the operation ends,
**Then** cancellation preserves the saved image selection,
**And** validation failures or persistence errors are reported without claiming success,
**And** the shared asset-publication/recovery protocol preserves the prior valid character/reference state without a dangling committed reference,
**And** the source file and unrelated managed assets are unchanged.

**Given** imported content or an asset reference attempts to escape its permitted managed root or owning universe,
**When** it passes through the import/transport adapters,
**Then** the shared validation contract rejects that access,
**And** no generic renderer filesystem access or imported-content privilege is introduced.

**Requirements:** FR-16 optional image support; FR-48 character viewer; FR-44 shared universe context; CAP-5; AD-3/4/8/9/10/18; NFR-1/2/3/6/7/9.

**Dependencies:** Approved Epic 1 Stories 1.1–1.9, Epic 2 Stories 2.1–2.7 and Epic 3 Stories 3.1–3.3 only. Resolve DEC-18 supported formats/import validation/display treatment before implementation. TECH-01 must define the shared asset-reference contract, TECH-02/04/05 must cover coordinated asset publication/writer/restart recovery, and TECH-09's immutable image-version/object-identity rules must be settled before replacement or removal is implemented. Inherit TECH-11 persistence verification and capture image selection/placeholder/display interactions under PLAN-04.

**Scope boundary:** Deliver character image import/display using the existing universe profile. This does not require future faction profiles or Epic 5 revision/backup UI; those later features must reuse the managed-asset contracts and carry required image versions/reference closure. Clearing a character's current image reference does not authorize immediate file deletion. No image transformation, gallery or additional image field is selected by this proposal.

**Verification:** Import a supported image; reopen; remove/move its source; view through shared-universe projects; relocate the owning universe using identity resolution. Replace/clear the image and check unchanged profile/personality/waiver data and referenced immutable assets. Verify no-image completeness for every type, cancellation, invalid files, asset-copy/reference-write failures and rejected foreign-root/universe references using the agreed contracts.
