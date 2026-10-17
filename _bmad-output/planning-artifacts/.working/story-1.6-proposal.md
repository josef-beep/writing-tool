# Story 1.6 proposal

Approved by Jo and appended to Epic 1 in epics.md. No implementation has started. epics.md is the maintained approved breakdown; this file preserves the reviewed proposal.

### Story 1.6: Build and save a universe's repeating fictional calendar

As Jo,
I want to compose my universe's year from months and standalone days,
So that I can use a calendar suited to my setting before recording dated content.

**Acceptance Criteria:**

**Given** an available universe without dated content,
**When** I build its year using the ordered calendar builder,
**Then** I can configure months only, unequal-length months with standalone days, or a year expressed only in days,
**And** months are optional,
**And** standalone days can appear before, between or after months in the configured sequence,
**And** I can assign names to months and standalone days.

**Given** I have composed a valid year sequence and entered a target number of days,
**When** the builder compares the target with the sum of month lengths and standalone days,
**Then** it displays the target in green when equal and red when different,
**And** each standalone day counts toward the total.

**Given** the sequence contains 360 days and the target is 365,
**When** I save the valid calendar configuration,
**Then** the mismatch does not block saving,
**And** the persisted target becomes 360 to match the actual sequence total,
**And** the application does not silently add days or alter month lengths to meet the old target.

**Given** the calendar configuration is saved,
**When** its numbered years and dates are displayed or converted using the agreed chronology contract,
**Then** each year repeats the same ordered sequence and total length,
**And** a year name is optional and a year number alone remains usable,
**And** the established day-of-year and month/day/year format examples are preserved,
**And** there are no required leap-year or time-of-day fields.

**Given** the calendar belongs to a saved universe,
**When** I close and reopen that universe or open it through an associated project,
**Then** its sequence, month lengths, element names, actual/target year length and configured year names are preserved,
**And** all associated projects use that universe's same calendar authority.

**Given** I cancel editing or saving fails,
**When** the operation ends,
**Then** cancellation leaves the persisted configuration unchanged,
**And** a failure is reported without claiming the proposed calendar was saved,
**And** the prior committed configuration remains consistent under the shared publication protocol.

**Requirements:** CAP-4; FR-8–13 and initial configuration support for FR-7; AD-3/6/8/10 and chronology convention; NFR-1/2/3/6/9.

**Dependencies:** Approved Stories 1.1–1.5 only; no future event or chapter story is required to build/use this calendar configuration. Resolve DEC-03 (elapsed coordinate/epoch/year bounds), DEC-04 (standalone-day/year-name display) and DEC-13 (builder validation) before their affected implementation. Inherit applicable TECH-01/02/04/05/11 storage/write gates; capture the builder interactions under PLAN-04. None of these unresolved details is decided by scope approval.

**Scope boundary:** This story builds and edits a calendar for a universe with no dated content. Reconfiguring a populated universe while preserving every elapsed position, ordering and interval under FR-7 will be a later Epic 1 story after standalone events are available. That later extension must use this same calendar contract and store, not a separate calendar implementation. This story creates no dated event/chapter tables solely for future features.

**Verification:** Exercise months-only, unequal-month/standalone-day and days-only configurations; standalone days before/between/after months; named and unnamed years; equal/mismatched target totals including 365/360; repeated-year conversion and reopen/shared-universe persistence. Verify canceled edits and failed publication. Empty/invalid sequence cases follow DEC-13 once resolved.
