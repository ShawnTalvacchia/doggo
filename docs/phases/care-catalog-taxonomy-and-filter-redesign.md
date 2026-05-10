---
status: active
last-reviewed: 2026-05-10
review-trigger: When any task is completed or blocked
---

# Care Catalog Taxonomy & Filter Redesign

**Goal:** Resolve the service taxonomy that drifted (`inhome_sitting` ended up meaning carer-side day care, not the babysitter-metaphor "sitting at owner's home" originally intended), then redesign the Discover Care filter panel against the resolved model. Ships a four-service taxonomy + a filter panel that *teaches* the trust model rather than presenting it as a flat field grid.

**Depends on:** Discover Refinement (community-first ordering, ProviderCard ↔ UserProfile bridging, Carer Identity badge, service-aware `CarerCareServiceConfig` fields, `applyAllFilters` wiring) — all live; this phase reshapes the taxonomy underneath them.

**Must land before:** Cross-Cutting Flow Testing — those flows depend on the service model being right; testing on top of a broken taxonomy is wasted.

**Refs:** [[Open Questions & Assumptions Log]] §4 (Care service taxonomy + filter cluster), [[Groups & Care Model]] (Services as Catalog), [[explore-and-care]], [[discover-refinement]] (archived) — partial filter-panel work that this phase reshapes, [[badges]]

---

## Phase decisions — resolved at open (2026-05-10)

Settled at phase open. Full reasoning landed in [[Groups & Care Model]] → "Care taxonomy — the four services."

1. **Four-service model — confirmed.** `walks_checkins` / `house_sitting` / `day_care` / `boarding`. **"House sitting"** chosen over "Sitting (at your home)" because the English convention bakes the location into the noun (a house-sitter goes to your house) — no parenthetical needed. Replaces today's three-service `walk_checkin | inhome_sitting | boarding`.

2. **Drop-in visits move to House sitting.** Same shape as a longer house-sit (carer goes to owner's home, finite duration), so Drop-in becomes a House-sitting sub-service. Walks & Check-ins narrows to *outdoor activity with the dog*.

3. **House sitting price unit — both, default per-visit.** Carer can flip to per-night when offering overnight stays. Walks → per-visit only; Day care → per-visit only; Boarding → per-night only. No engine change — `priceUnit: "per_visit" | "per_night"` already supports either.

4. **Naming + drift-prevention.** Variant names carry intent (`house_sitting` = owner's home; `day_care` = carer's home, day; `boarding` = carer's home, night). Inline doc next to the enum in `lib/types.ts` documents whose home and day-vs-overnight per variant. Drift to ambiguous "sitting" labels treated as a regression in future reviews. Czech-naming check (does "House sitting" / "Day care" map cleanly to *hlídání u vás doma* / *psí školka*?) bundled into Workstream A2 before labels lock.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] **Settle the four-service taxonomy decision** (Phase decisions §1–§4 above) — written into [[Groups & Care Model]] → "Care taxonomy — the four services" (2026-05-10)
- [x] Review Open Questions log — §4 Care service taxonomy + filter cluster maps cleanly: bullets 1–4 resolve in Workstream A; "Filter panel redesign" sub-bullet maps to Workstream B
- [x] Audit for conflicts between phase plan and current codebase — see "Audit findings" below. Migration footprint is broader than the phase board's "9 consumers" estimate (~36 files referencing `ServiceType` or its string literals); seeded `inhome_sitting` drift confirmed total (every config describes carer's home, not owner's home)
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — all referenced docs (Open Questions, Groups & Care Model, explore-and-care, CONTRIBUTING) reviewed within 2 weeks
- [x] Confirm scope — no tasks belong in a different phase. Out-of-scope items (Carer audience-setting toggle UI, "Open to bookings" status pill P63, per-service visibility, multi-pet booking treatment, free intro session toggle) listed below. P60 (Carer sub-specifications on Identity badge) inherits cleaner vocabulary from this phase but stays on the punch list — separate work.

### Audit findings (recorded at open, 2026-05-10)

- **Drift confirmed total.** Every seeded `inhome_sitting` config describes carer-side day care at the carer's home — notes consistently reference "my flat" / "my home" / "Day sitting at my flat"; configs carry `homeType` / `hasOwnDogs` fields that only describe the carer's premises. One entry mixed `subServices: ["Day sitting", "Overnight"]`, conflating day care and boarding. Zero seeded configs match the original "babysitter at owner's home" intent.

- **Adjacent fingerprint.** [`SUB_SERVICES.boarding`](../../lib/constants/services.ts) already encoded `["Day care", "Overnight"]` — Day care was always trying to be a peer service but got cobbled in at the sub-services layer. The migration promotes it cleanly.

- **Migration scope (revised vs phase board's ~9 consumers).** Direct `ServiceType` references span ~36 files: `lib/` (types, pricing, constants/services, mockUsers, mockBookings, mockConversations, mockConnections, mockData, query, draftToProfile, notificationBuilders, useActiveSession, data/providers, data/providerContent), `app/` (discover/care, signup/pricing, profile, bookings, inbox, styleguide), `components/` (explore × 6, discover, profile, messaging × 3, bookings × 3, schedule, overlays). Most are display-chrome (icon/copy keying) — easy. The hard ones: `mockUsers.ts` (every seeded carer's services need re-keying + new `house_sitting` configs added for carers who'd plausibly offer it), `mockBookings.ts` (existing bookings reference `inhome_sitting`), `mockConversations.ts` (inquiry/proposal artifacts in seeded threads). **Realistic "build green again" effort: closer to a full day than a half-day.**

- **Sub-service migration map.** Today: `walk_checkin: ["Drop-in visit", "Solo walk", "Group walk"]`, `inhome_sitting: ["Full-time care", "Special feeding", "Medication", "Walking", "Walking +30 mins"]`, `boarding: ["Day care", "Overnight"]`. After: `walks_checkins: ["Solo walk", "Group walk"]` (Drop-in moves out; Walking moves out from inhome_sitting), `house_sitting: ["Drop-in visit", "Full-time care", "Special feeding", "Medication"]` (Drop-in arrives; Full-time / Special feeding / Medication retain), `day_care: ["Special feeding", "Medication"]` (carer's-home daytime — the seeded `inhome_sitting` configs migrate here), `boarding: ["Special feeding", "Medication"]` (Day care promoted to peer; Overnight is the implicit default of boarding so removed). Final sub-service lists settle in Workstream B3 (sub-services accordion design).

- **P60 alignment.** Punch list P60 (Carer sub-specifications on the Identity badge) lists candidate sub-specs as Trainer / Walker / Sitter / Boarder / Day-care. After this phase, "Sitter" / "Day-care" map cleanly to `house_sitting` / `day_care`. No action needed — P60 inherits sharper vocabulary for free.

---

## Workstream A — Taxonomy resolution + data model

Land the new `ServiceType` enum and migrate every seeded carer's services. Foundation for everything else.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Update `ServiceType` in `lib/types.ts` to the four-service model. Add inline comments documenting the meaning of each variant so future-us doesn't drift again. | `lib/types.ts` | todo |
| A2 | Update `lib/constants/services.ts` — `SERVICE_TYPE_LABELS`, `SERVICE_TYPE_ICONS`, ordering. Decide on display labels per Phase decision §4. | `lib/constants/services.ts` | todo |
| A3 | Audit and update all 9+ `Record<ServiceType, X>` consumers (filter pills, price floors in `lib/pricing.ts`, inquiry form, proposal form, Discover Card chip rendering). | App-wide | todo |
| A4 | Migrate every seeded carer's services in `lib/mockUsers.ts`. Today's `inhome_sitting` configs all describe carer-home day care — re-key as `daycare`. Add new `sitting` (at owner's home) configs to a few carers who would realistically offer it. Verify drop-in placement (per Phase decision §2). | `lib/mockUsers.ts` | todo |
| A5 | Update `lib/mockData.ts` ProviderCard `services` arrays to match. | `lib/mockData.ts` | todo |
| A6 | Doc cascade: [[Groups & Care Model]] → Services as Catalog (the resolved taxonomy with the documented meanings), [[explore-and-care]] (service-by-service spec rewrite), [[badges]] (if Carer Identity sub-spec resolution shifts with the new taxonomy). | Multiple docs | todo |

---

## Workstream B — Filter panel redesign

Today's filter panel is partial: Pets + Address rows are non-functional placeholders, no sub-services accordion, no real address picker, time-of-day granularity is coarse, the applied-vs-floating button pattern needs a settle. Apply the resolved taxonomy from Workstream A.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Functional Pets checkboxes — wire to `viewer.pets[]`, persist selection across sessions, filter results to carers whose `maxDogs >= selectedPets.length`. Today the Pets row is a placeholder. | `app/discover/care/page.tsx`, `components/explore/CareFilterPanel.tsx` | todo |
| B2 | Real address picker — replace today's locked Vinohrady text with a chooser (saved addresses + map dropper, even if the map is a stub). Filter by km radius from selected address. | `app/discover/care/page.tsx` | todo |
| B3 | Sub-services accordion (Feeding / Medication / Special needs / etc.) — design and wire. Surfaced in Discover Refinement decisions as missing. Per-service: which sub-services apply (Feeding lives on Sitting + Day care + Boarding; Medication everywhere except Walks; Pickup/dropoff only on Day care + Boarding; etc.). | `components/explore/CareFilterPanel.tsx`, `lib/types.ts:CarerCareServiceConfig` | todo |
| B4 | Time-of-day granularity — settle Morning / Afternoon / Evening (today's coarse) vs the older specific bands (07-10, 10-14, etc.) referenced in the original design. Decide based on what the underlying `availability[].slots` data supports. | `app/discover/care/page.tsx` | todo |
| B5 | Header pattern — settle `{service} • Filters` header per service vs single Filters header. Pairs with the floating "View N results" button vs old "Apply Filters" footer. | `components/explore/CareFilterPanel.tsx` | todo |
| B6 | Service-aware filter shapes per the resolved taxonomy — home features (yard, type) only on Day care + Boarding; pet pickup location for Sitting; walk pace + leash for Walks. | `app/discover/care/page.tsx`, `lib/types.ts:CarerCareServiceConfig` | todo |
| B7 | Walkthrough verification — every persona × every taxonomy + filter combination renders sensibly. Self-exclusion, in-circle ordering preserved from Discover Refinement. | All personas | todo |

---

## Acceptance Criteria

- [ ] Four-service `ServiceType` enum landed with documented meanings inline.
- [ ] All seeded carers migrated; no `inhome_sitting` references remain in mock data.
- [ ] Discover Care filter pill row reflects the four-service model.
- [ ] Pets + Address rows on the filter panel are functional, not placeholders.
- [ ] Sub-services accordion lives in the panel and filters results.
- [ ] Service-aware fields render contextually based on the active service pill.
- [ ] Filter panel pattern settled (header treatment + applied-vs-floating button decision).
- [ ] Walkthrough verified across personas — community-first ordering + per-service pricing + filter predicates all behave correctly under the new taxonomy.
- [ ] [[Groups & Care Model]] → Services as Catalog rewritten to the four-service model with documented meanings.

---

## Out of Scope (deferred elsewhere)

- **Carer audience-setting toggle UI** (`publicProfile` circle↔anyone progression) → Onboarding & In-Product Communication or Profiles Deep Pass D7
- **"Open to bookings" status pill on profile hero** (Punch List P63) → small isolated decision; surface during this phase if it naturally pops up, otherwise stays on punch list
- **Per-service visibility (third axis of trust)** → future Trust & Privacy refinement
- **Multi-pet booking treatment** → defer until a multi-pet booking enters mock data
- **Free intro session toggle on proposals** → future Bookings & Monetisation pass

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep walkthrough's "Decisions surfaced" section — every emergent decision lands in a feature doc or is marked "no doc update needed"
- [ ] Update all affected feature docs in `docs/features/` (especially `explore-and-care.md`)
- [ ] Update Open Questions log — close §4 Care service taxonomy + filter cluster (resolved by this phase); add anything new that emerged
- [ ] Update ROADMAP.md — move Care Catalog Taxonomy out of Current
- [ ] Review CLAUDE.md — update key decisions (taxonomy + filter pattern), current phase pointer
- [ ] Punch list audit — any new surface drift from the taxonomy migration gets logged
- [ ] Archive this phase board (frontmatter `status: archived`, then `git mv`)
- [ ] Strategic review — see CONTRIBUTING.md → Closing Checklist step 10
- [ ] **Structural audit** — see CONTRIBUTING.md step 9a
- [ ] Check next phase scope (Cross-Cutting Flow Testing) for conflicts with what was just built
