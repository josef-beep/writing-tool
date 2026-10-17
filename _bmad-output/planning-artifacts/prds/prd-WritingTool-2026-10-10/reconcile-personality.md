# Personality source reconciliation

Reconciled on 2026-10-10 against `prd.md` and `addendum.md` in this directory.

## Input and authority

Source: [Personality Types List](sources/personality-types-list.md), the preserved copy of Jo's supplied personality list. It contains 100 consecutively numbered, named entries, each followed by a short description. The opening explanation distinguishes established temperament/trait language from constructed blend-types. Both categories are part of the supplied selectable list; the source does not require separate categories in the interface.

Jo's later coaching decisions govern its use: personality traits are optional, multiple entries can be selected, and the selector shows names only without descriptions alongside them. The descriptions are source context, not additional required character fields or selector content.

## Requirement coverage

| Source or coaching input | PRD coverage | Result |
| --- | --- | --- |
| Use the supplied personality list as the source | FR-17 links the preserved source and identifies its 100 named entries | Covered |
| Include both common labels and constructed blend-types | FR-17 explicitly acknowledges both kinds of entry | Covered |
| Personality is optional | FR-16 marks the field optional; FR-17 permits no selection | Covered |
| Allow multiple selections | FR-16 and FR-17 require multiple selections; FR-17 also permits a single selection | Covered |
| Show names only | FR-17 acceptance requires source labels only and excludes descriptions alongside them | Covered |
| Retain selected traits on saved character records | FR-17 acceptance requires selections to survive saving and reopening | Covered |
| Extras can have just a name | FR-15 and FR-16 keep fuller fields, including personality, optional for extras | Covered |

The source names are the selectable labels, including their original spelling and hyphenation (for example, `Self-Centered`, `High-Energy Planner`, and `Control-Hungry Caregiver`). Descriptions and source numbering need not appear in the selector. FR-17's reference to the complete supplied source covers all 100 labels without duplicating the catalog in the PRD.

## Gaps and conflicts

No substantive gaps or conflicts were found. `addendum.md` contains no additional personality requirements; this does not reduce coverage because FR-16 and FR-17 retain the explicit requirements and source link in the main PRD.

The selector's layout, search, grouping, and ordering remain UX implementation choices. Neither the source nor Jo's decisions require those behaviors, so their absence is not a missing requirement. No type exclusivity, selection limit, description display, psychological assessment, or generated personality scoring should be inferred from the list.

## Recommended disposition

Keep FR-16 and FR-17 as written. Preserve the source file as the authoritative option catalog. No PRD amendment is required for this reconciliation.
