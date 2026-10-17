# Proposed schema validation evidence

2026-10-17. Draft foundation and chapter-format schemas checked with temporary `jsonschema 4.26.0` using its Draft202012Validator; no dependency was added to the application or lockfile. Both schemas passed meta-schema validation. Forty-four schema/example assertions passed: canonical decimal strings (including values beyond JavaScript safe integers), malformed numeric strings/newline endings, invalid/escaping/Windows/empty relative paths, paired text hashes/lengths, Unicode scalar paragraph/mark positions, heading conditions, unique styles, display-font exclusion and save-receipt structure.

The synthetic example has 8 Unicode scalars, 12 UTF-8 bytes and 9 UTF-16 units, covering an astral character, accented text, a scene break and final empty paragraph. This checks the proposed anchor distinction, not a Lexical adapter implementation.

No application save/crash/power-loss/platform test ran. Per-entity payload completeness, semantic ownership/reference closure, runtime path containment, Unicode17 normalization/folding conformance and cross-unit coordination were not validated by these schema checks. Jo subsequently adopted these foundations through the execution approval. TECH-01/02 stay open for complete contract coverage and verification. See [data contract](../data-contracts.md) and [publication protocol](../publication-contract.md).
