---
status: implementation-design
contractVersion: 1
updated: 2026-10-18
scope: Remaining release entity contracts and implementation order
---
# Workspace entities and publication design

This document specializes the adopted [data foundations](data-contracts.md), [publication](publication-contract.md) and [coordination](coordination-contracts.md) for the coding pass. Product behavior remains governed by [requirements](requirements.md), the later resolved decisions in [contracts](contracts.md), all approved stories and final UX. It is an implementation design, not verification evidence or permission to weaken those guarantees.

## Records and ownership

Every persisted record uses the shared closed envelope, permanent UUID, owning unit, associated universe UUID and version UUID. Runtime validators close each payload and validate references against the candidate complete state before preparing writes. User text is Unicode scalar text; do not normalize prose. Exact integral fields use canonical decimal strings. Unset optional values use null, distinct from zero and an empty string where meaningful. Entity JSON contains no absolute filesystem paths.

| Root | Record/category | Required state and relationships |
|---|---|---|
| Project | Story / `stories` | Title, stable creation sequence, saved manual order, optional volume UUID, optional nonnegative chapter-count target |
| Project | Volume / `volumes` | Title and saved manual order; story membership is zero-or-one and same-project |
| Project | Chapter / `chapters` | Title, story UUID, permanent creation sequence, independent optional start/end positions, same-universe character references, event depiction pairs with main/flashback role, optional word target default 2500, calendar-update metadata, matched WRT/formatting version |
| Project | Plot / `plots` | Story UUID, heading, optional date position, within-group order; undated first, then chronology; insertion/date moves append to destination group |
| Project | Decision relevance / `decision-context` | Story UUID and same-universe decision UUID; this does not copy or own the decision |
| Universe | Calendar / `calendars` | Ordered month/standalone-day elements with UUID/name/positive day counts (standalone=1), optional composition, positive days-only count, corrected actual/target total, entered year, optional year names, immutable configuration versions |
| Universe | Event / `events` | Heading, optional description, required date, issued editable unique code, same-date order, optional maker, event kind (ordinary/birth/background), optional associated character |
| Universe | Decision / `decisions` | Required text/date/type/code, optional eligible maker subject to type, explicit character relevance, outgoing event UUIDs and following-decision UUIDs |
| Universe | Decision type / `decision-types` | Nonblank trimmed unique name (including built-ins), maker-required flag; Personal Decisions required, Story Decisions optional; custom default optional |
| Universe | Character / `characters` | Required name; main/major/minor/extra type; rank/title, background, description, motivation, weaknesses, strengths, specialities; explicit field waivers; exact personality labels; optional managed image; optional recorded birth components/linked canonical birth event |
| Universe | Faction / `factions` | Required name; all accepted identity/government/leadership/strategic fields, optional population/resources/culture/world-city list, optional military roster; optional managed identity and leader images |
| Universe | Affiliation / `affiliations` | Character UUID, date, same-date order, resulting faction UUID or null. Derive previous/current from sorted history; never create timeline events |
| Universe | Visibility / `views` | Maker and category selections; show-all empty restrictions; synchronized OR-within/AND-between projection, no mutation of record/link/status |

Expected character fields affect completeness only: rank/title and description for main/major/minor; background additionally for main. Background narrative or a linked background event satisfies it. Answering clears its waiver; clearing an answer makes it incomplete unless explicitly waived again. Preserve answers/waivers on type change. Name cannot be waived. Optional faction fields and military roster do not affect original non-roster completeness. Roster numeric values are exact decimal strings, optional; strength/movement nonnegative, modifier signed; blank rows ignored and partial valid rows accepted. Population preserves exact/estimate/range/unknown author text.

## Dates and order

Persist entered `{calendarVersion, year, day}` using exact signed year and positive day-of-year strings; validate against that version's actual year length. Display month/standalone components from the configured ordered sequence. Never replace saved ordinary dates with a synthetic year-zero offset.

Each immutable calendar lineage has an anchor taken from the user's first supplied year and actual day 1. Calendar revisions retain that anchor. Relative elapsed arithmetic uses `(year-anchor.year)*yearLength + (day-anchor.day)` internally, not as a persisted date replacement. Map that relative distance into another configuration of the same lineage using exact floor division (including negative years), anchored to the same entered year/day. This preserves elapsed positions/intervals during populated reconfiguration without introducing an artificial year-zero epoch. Preserve original configuration references in retained history; an explicit restored-calendar update changes display metadata only after durable publication.

Chapters without start dates sort first by creation sequence; dated chapters sort by exact position then creation sequence. End is independent; only a valid inverted start/end pair corrects end to start. Chapter date/save/restore never changes an event's date/content. Timeline events insert last on creation/date move, preserving all other order; ordinary edits preserve order. Plots use undated-first/date groups with within-group ordering. Decision links require same-universe, nonduplicate, nonself, acyclic directed pairs and nondecreasing dates. Result events require same-universe and date on/after source. Outgoing event or following-decision links alone determine source resolution, independently of filters.

## Text and formatting

Use the existing `chapter-format.schema.json` contract: UTF-8 LF WRT; companion JSON with identical chapter/version identity, exact hash/byte/scalar length and paragraph/range metadata. Body, headings 1–6, indentation and literal scene-break paragraphs, disjoint/coalesced bold/italic scalar intervals. The Lexical adapter converts editor UTF-16 offsets and history to this representation; editor JSON is never the authoritative manuscript. Font/size are app-wide preferences, absent from manuscript payloads. Newer in-flight edits remain dirty after acknowledgment of an older submitted revision.

## Catalog and publication extension

Reuse each owning unit's existing authority connection, lease/fence and primary catalog. Do not create a second live payload authority or an independently locked category database. Add explicit versioned feature migrations and typed content-record/file/relationship indexes to the owning catalog, preserving legacy profiles and receipts. Unsupported feature versions remain non-writable. Every content operation advances the same owning unit generation exactly once; profile-only and content publication/recovery must agree on complete operation history.

A typed same-unit mutation plans all affected category JSON/WRT/index/relationship/code-counter changes before any live bytes change. Stage a durable complete before/after journal, freeze operation digest/expected generation/record versions/editor revision, publish matched files, commit one catalog decision, verify and atomically finalize. Recovery dispatches by the closed journal command/version. Unknown outcomes block affected writes/captures until reconciled with the original operation. Deletion uses tombstones and retained immutable data; no direct unlink of referenced payloads. Export/capture uses the same authoritative cut and all catalog indexes, not only legacy profile rows.

Acquire cross-root participants by canonical owning kind/UUID and reuse existing ownership; do not create a second universe connection for a project sharing the active universe. A mutation changing two roots uses the adopted durable coordinator ledger with prepared typed participant plans and a single commit decision. A project-owned reference mutation only needs its project write plus validation/pinning of its authoritative universe dependency; do not manufacture a universe mutation for a read-only dependency.

## Schedulers, history and archives

App-wide settings are closed versioned ID-named JSON under user-data with atomic publication. Independent positive whole-minute defaults: autosave 5, revisions 10, backups 10; retention positive whole days default 30. Import validates all known supplied fields before one commit, retaining missing fields and warning about unknowns. Light/dark/system follows OS changes; writing background stays gray. Layout and font preferences are app-wide.

A capture first acknowledges required pending manuscript edits, then serializes/pins complete finalized project and universe state. Immutable content-addressed versions plus complete manifests allow inspection without replay or substitution of current objects. Capture exact images, calendar/configuration/type definitions, links and code spellings. A project checkpoint is historical dependency content, never another live universe. Replaced capture must succeed before restore. Restoration compares canonical identity/content and demands explicit keep-live/use-recovered/edit-combined conflicts, resolves missing references, revalidates freshness and uses coordinated publication for multi-root changes. Cancel retains proposals without applying live changes.

Complete ZIPs include catalogs and actual category files/WRT/images/history/manifest closure, with recovery independent of original roots/coordinator/other ZIPs. Use the approved local capture-start names and collision-safe `_2` suffixes, validate before completion. Archive identity/owner/capture time/content digest and known destinations form the protection registry. Protect the ten newest valid completed archives per owning unit and all current/retained dependencies; unknown/offline protection evidence prevents destructive cleanup. Retention is elapsed-time-only, no size cap or minimum revision count.

Manual/scheduled backup destination cancellation skips that attempt and preserves settings; normal close uses the approved application-root then user-data fallback and reports the actual location next launch. Required close save/revision/backup failure keeps the app open with retry/location/cancel-closing; no silent override. Independent schedulers start on eligible root open, restart on interval change, run one overdue attempt after sleep and do not overlap.

## Exports and integration status

MD/TXT are application-owned serializers of ordered titles and matched text/styles, with no planning context. DOCX/PDF use the bundled LibreOffice headless adapter, dedicated writable profile/temp/process cancellation and validated temporary output; A4, 2.54 cm margins, 12-point serif, 1.5 spacing, chapter pagination and literal `***`. Save As/overwrite/publication preserves prior output and offers retry/location/cancel plus actual-path/open actions. Never fall back to an unapproved conversion engine or require an external LibreOffice installation.

Database export captures one complete owning catalog, adds versioned truthful external-dependency metadata, validates the consistent SQLite output and atomically publishes after live-source/alias rejection. It excludes external payloads and shows the exact approved catalog-only notice. Packaging must carry actual pinned platform-specific LibreOffice/font resources and notices; missing assets are an explicit unfinished delivery gate, not a working bundled export claim. All implementation remains unverified until the user's requested later testing phase.
