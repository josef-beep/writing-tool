---
status: adopted
contractVersion: 1
scope: TECH-01 shared foundations
updated: 2026-10-17
---
# Shared data contract — adopted foundation

Jo adopted this technical foundation through the execution approval on 2026-10-17. Approved product rules remain binding. [Contracts](contracts.md) and final [Experience](../../planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md) remain binding. TECH-01 stays open until the complete schema family, migrations and consuming adapters are defined. [Foundation schema](schemas/foundation.schema.json) and [chapter-format schema](schemas/chapter-format.schema.json) define only the explicitly named structures below.

**Current planning status (2026-10-22):** The [prerequisite index](planning-contract-index.md) links the now-published closed consuming entity/command/settings/manifests, chronology, catalog and export definitions. Historical “remains open” shape/algorithm notes below are specialized there and in the workspace/storage contracts. TECH-01's full adapter/schema/migration conformance evidence remains open; publishing those definitions is not gate acceptance.

## Identity, versions and locations

| Value | Proposed representation and rule |
|---|---|
| Identity | Lowercase canonical UUID string, never a path/name/code. Existing permanent IDs are preserved. UUID generation algorithm remains an adapter choice. |
| Owning unit | `{kind: project|universe, id: UUID}`. Universe-record references carry `universeId` plus `recordId`. Project records also identify their associated universe. Validate ownership semantically, including cross-file references. |
| Record version | New UUID for each changed saved object version. Undo and retained versions preserve captured IDs. A version UUID is an equality token, not chronological ordering. |
| Unit generation | Non-negative canonical decimal string, advanced by one in each successful unit mutation. Compare numerically using exact integers. This is local commit order, not the still-open recovery divergence/version protocol (TECH-06). |
| Exact integers | Decimal strings: `0`, positive digits without leading zeroes, optional minus for signed quantities; no `+`, `-0`, exponent or floating-point conversion. No fixed year/counter limit. Coordinate epoch and calendar conversion remain open. |
| Root location | Separate catalog `root_locations(rootId, ownerKind, ownerId, basePath, bindingVersion)` record, with a UUID equality token for `bindingVersion`; root ID and owning identity are stable. `basePath` is machine-local and never embedded in record JSON/reference identity. Validated relocation changes this one binding with expected old binding version; object-relative paths remain unchanged. |
| Relative path | Slash-separated relative segments. Reject empty/`.`/`..`, absolute/drive/UNC paths, NUL/backslash, resolved symlink/reparse-point escape and destination aliases. Schema checks are lexical only; host must check resolved containment/identity. No arbitrary product filename length limit is added. |
| File identity | Category files use `<object-id>.json`; manuscript `<chapter-id>.wrt` and its companion JSON share the ID stem. Catalog stores root ID + relative path, role, SHA-256 and matched version. The exact category-name registry remains part of TECH-01/11. |
| Serialization | UTF-8 without BOM; WRT uses LF. Reject malformed Unicode and duplicate JSON keys before ordinary JSON decoding can erase duplicates. Domain strings are not globally normalized. Schema version is independent of app/package version. |

Proposed common JSON envelope: `schemaVersion`, `recordType`, `id`, `owner`, `universeId`, `recordVersion`, `data`. `schemaVersion=1` is a proposed first format, not a software dependency pin. The adopted foundation schema deliberately leaves `data` open: it is **not** a complete entity validator. Each record type still needs its closed payload schema from approved field matrices; do not accept arbitrary payloads for production persistence. Unknown/newer document versions are non-writable until an explicit migration supports them. Settings import preserves its already-approved missing/unknown-field rules; that workflow is not a generic record decoder.

## Chapter text and formatting pair

For a chapter save, freeze the submitted editor revision; encode plain text as UTF-8/LF WRT. JSON carries the same chapter/version identity, `text.sha256` over exact WRT bytes, decimal `byteLength`, `scalarLength`, and formatting. Catalog entries for both files identify that same record version and operation. Read verifies all three identities and hashes before applying formatting. Missing/mismatched data is an error preserving source bytes, never a reason to silently strip formatting.

Ranges are half-open `[start,end)` Unicode-scalar offsets in decoded LF text, represented by decimal strings. They are neither UTF-8 byte indexes nor JavaScript UTF-16 indexes; the editor adapter converts explicitly. Unpaired surrogates are invalid. Paragraph descriptors cover each LF-separated paragraph in order, excluding separator LF from its range; an empty file has one empty paragraph and a trailing LF has a final empty paragraph. Paragraph IDs survive ordinary edits where identity is retained; split keeps the original for the first part and allocates new IDs for others; merge retains the first. Anchors are valid only for the matched text version.

Kinds: `body`, `heading` (level 1–6) or `scene-break`; indent is a non-negative integer-string level. Scene-break paragraphs contain literal `***` and no inline marks. Marks contain a nonempty subset of `bold`/`italic`; intervals must be nonempty, remain inside their paragraph, and use one merged style set for each disjoint covered interval. Sort intervals by start, coalesce adjacent identical style sets and reject conflicting/overlapping intervals. Do not store editor font-family/size: these remain app-wide display preferences. This foundation does not add a new user-facing formatting command/range.

## Event and decision codes

Store `code` as the original spelling after trimming Unicode 17.0 `White_Space` at both ends, with no added length, ASCII-only or punctuation restriction. Require nonblank. Compute comparison key by canonical Unicode normalization plus locale-independent **full default** case folding from Unicode 17.0: `NFC(NFD(fullCaseFold(NFD(code))))`. Preserve the display spelling; uniqueness uses a catalog binary comparison on the computed key. No locale-specific casing or compatibility-width folding is implied. Pin the normalization/folding data version; upgrading it requires collision preflight/migration, not silent reinterpretation.

A single unique universe code-key registry covers events and decisions. New committed records allocate E/D plus at least three digits from separate exact decimal high-water counters. Advance past issued numbers and occupied folded keys; persist allocation, counter and object/catalog rows in the same unit operation. Never recycle a committed issued sequence after deletion/rename. A pre-save UI suggestion is provisional, not an issued canonical code. Concurrent creation uses the unit writer/expected-generation contract, not timestamps. Date/order edits preserve codes; history stores original spelling. Backfill needs an explicit deterministic creation-order/migration plan before TECH-01 closes.

## Transport and save acknowledgment

Application-owned DTOs carry protocol version, request UUID and opaque root/entity IDs; renderers never supply authoritative filesystem paths. A mutation adds operation UUID, expected unit generation, submitted editor revision and validated payload. For an existing object include expected record version. The host resolves ownership/paths and checks those expectations before publication; no blind last-writer-wins overwrite.

A successful save receipt echoes operation ID, owner, committed unit generation, record/version and submitted editor revision. The receipt schema is not proof of durability: [publication contract](publication-contract.md) defines when it may be sent. New editor changes after submission remain dirty even if the older revision succeeds. Same operation ID + same request digest returns the recorded outcome; same ID + different request is rejected. Compute the digest as SHA-256 of UTF-8 [RFC8785 canonical JSON](https://www.rfc-editor.org/rfc/rfc8785) for `{protocolVersion, command, owner, expectedUnitGeneration, expectedRecordVersions, submittedEditorRevision, payload}` using the command-specific required fields. Exclude transport request ID, operation ID and diagnostic timestamps so an identical retry can use a new transport request ID. Canonicalization does not normalize domain strings. Exact field schemas and RFC conformance belong to the consuming command adapters; no implementation conformance is claimed here.

Error DTO: protocol version/request ID, stable code, message, outcome `not-committed|committed|unknown`, retry classification `same-operation|new-request|after-recovery|not-retryable`, and optional field issues. Core codes: validation, unsupported version, generation conflict, lease unavailable, I/O failure, integrity mismatch and recovery required. Platform diagnostics remain host-side. Outcome unknown cannot become a normal retry/discard or success; reconcile by operation ID first. Exact command-specific DTOs and errors remain TECH-01 work.

## Evidence and remaining coverage

The schema dialect is [JSON Schema 2020-12](https://json-schema.org/draft/2020-12). Text shapes do not validate ownership, path containment, version agreement, cryptographic bytes, range ordering or complete dependency closure; those need semantic validation. SQLite documents ASCII-limited default case matching, so Unicode code comparison must be explicit rather than delegated to default SQL matching. [SQLite expressions](https://www.sqlite.org/lang_expr.html), [Unicode 17 case-fold data](https://www.unicode.org/Public/17.0.0/ucd/CaseFolding.txt), [normalization specification](https://www.unicode.org/reports/tr15/).

TECH-01 still requires per-type entity/transport/settings payloads, exact catalog DDL and category registry, calendar representation, migration/backfill, revision/ZIP manifests and export metadata, plus adapter conformance. TECH-02/03/04/06/09/11 remain their own gates. This foundation adds no data limit and claims no runtime or installed validation.
