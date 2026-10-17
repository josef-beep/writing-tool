# Faction source reconciliation

Input: `sources/fero-kia-faction-profile.md`, compared with `prd.md` (FR-36 through FR-38), `addendum.md` (Faction profile source), and `coaching-notes.md` (Steps 54–63).

## Result

No material source-to-requirement gaps were found. FR-36 captures the example's profile information and preserves the later user decisions: all non-roster fields are required for completeness, unit types are optional, and incomplete profiles may be saved and reopened as drafts. The PRD was not changed by this reconciliation.

## Field mapping

| Source information | PRD coverage | Reconciliation |
| --- | --- | --- |
| Faction name in frontmatter and body | FR-36 identity | Covered; the repeated value is one logical field. |
| Faction description | FR-36 identity description | Covered. |
| Faction identifier pictogram | FR-36 identifier image or pictogram | Covered. The supplied asset and HTML dimensions are examples, not fixed defaults. |
| Government type in frontmatter and body | FR-36 government type | Covered; repeated values do not require separate fields. |
| Government notes | FR-36 government notes | Covered. |
| Faction leader in frontmatter; body name | FR-36 leadership name | Covered. |
| Leader image, age, and public reputation | FR-36 leadership | Covered. |
| Leader narrative under the second “Faction Profile” label | FR-36 leadership narrative profile | Covered without confusing it with the overall faction profile. |
| Empty head-of-military and head-of-intelligence fields | FR-36 leadership | Both covered. Their empty example values do not override the user's later requirement that non-roster fields be filled for completeness; an incomplete record can remain a draft. |
| Overview | FR-36 strategic overview | Covered. |
| Faction strengths and weaknesses | FR-36 strategic profile | Covered. The example lists three entries in each; no fixed count is inferred. |
| Military roster rows | FR-36 optional repeating unit entries | Covered; a complete faction need not have any unit types. |
| Unit name, role, short description | FR-36 unit name, role, description | Covered. |
| Base strength, movement points, base modifier points | FR-36 unit numeric fields | Covered; example numbers do not establish combat mechanics. |
| Organization, technology, resources, doctrine, intelligence limitations, numbers, allies | Description, leadership profile, overview, strengths, weaknesses; addendum explicitly preserves narrative depth | Covered as prose without inventing separate structured fields. |
| Frontmatter type and tags | Not independently required | These identify and organize the source document. The user selected the example as a profile model, not an import schema; their omission is not a confirmed requirement gap. |

## Decision precedence and consistency

- Coaching Step 57 records the source selection and extracted structure.
- Step 58's “all should be filled in” governs completeness, amended by Step 60 to make unit types optional.
- Step 59, answered after that amendment, permits incomplete drafts. Required fields therefore do not block draft saves.
- FR-36 incorporates all three decisions; the addendum supplies source interpretation and does not contradict their requiredness.
- Steps 61–63 and FR-37/FR-38 additionally capture optional, single current faction membership and dated membership changes. These are direct later user requirements, not implied by the profile example.

## Implementation detail still unspecified

The PRD supports roster fields but does not define whether every field in a voluntarily added unit row must be filled. It also does not prescribe list-editing controls, image formats, or numeric validation ranges. The source gives examples rather than rules for these details, so none should be presented as a missing confirmed requirement or require renewed discovery now.
