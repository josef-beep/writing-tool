# WritingTool PRD supporting details

## Preserved calendar display examples

The brief's addendum records `dayofyear/year` and `month/dayofmonth/yearnumber/yearname`. The example `362/6976` means day 362 of year 6976 in an example 365-day calendar without months; 365 days is not a default requirement. Year names are optional under the later coaching decision. Formatting standalone days outside months remains a UX detail to resolve before date-entry implementation.

## Revision storage and retention

The normative retention and dependency rules are in [FR-19 and FR-20](prd.md#fr-19-retain-revisions-by-storage-and-size-policy). Jo's later confirmation resolves the initial overlapping conditions: the size rule applies only to SQLite, while required dependencies take priority over expiry. Database selection remains open between SQLite and local PostgreSQL.

## Shared content storage

Shared-content reuse, active-reference protection, and recovery without the original database are specified in [FR-21 through FR-23](prd.md#fr-21-store-shared-backup-content-once). Content identity detection, reference representation, backup packaging, storage layout, and cleanup scheduling remain architecture decisions. The design must satisfy both recovery and storage-efficiency requirements.

## Fallback backup location

Fallback locations and the next-launch notification are specified in [FR-26](prd.md#fr-26-fall-back-to-a-folder-in-the-application-root). Platform-specific user-data paths remain architecture details.

## Faction profile source

Jo selected [Fero-Kia faction profile](sources/fero-kia-faction-profile.md) as the example for faction fields. Original location: `/home/jo/Documents/writing/docs/Faction Profiles/fero-kia-faction-profile.md`.

The example combines faction identity, government, leader details, overview, strengths, weaknesses, and a military roster. Its frontmatter also includes empty head-of-military and head-of-intelligence fields. Its narrative explores organization, technology, resources, doctrine, intelligence limitations, troop numbers, and allies. The preserved source retains this depth without requiring separate structured fields for every narrative topic.

The example's HTML/Markdown layout is not a mandated application layout. Its faction names, images, leader details, military units, and numeric values are examples. Character linkage, relationship tracking, and combat mechanics are not implied by this source.
