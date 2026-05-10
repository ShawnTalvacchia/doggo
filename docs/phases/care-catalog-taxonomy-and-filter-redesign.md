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

## Phase decisions to settle at open

These are not pre-decided; the phase opens with a taxonomy discussion before any code change. The shape below is the **resolution direction surfaced during Discover Refinement walkthrough D-stream** — confirm or adjust at phase open.

1. **Four-service model.** Walks & Check-ins / Sitting (at owner's home) / Day care (carer's home, daytime) / Boarding (carer's home, overnight). Replaces today's three-service `walk_checkin | inhome_sitting | boarding`. Resolves the "Sitting" semantic ambiguity AND adds the missing "carer hosts during day" service cleanly.

2. **Where Drop-in Visits live.** Today bundled into `walk_checkin` as a sub-service. With Sitting newly meaning "at owner's home," does Drop-in stay in Walks (briefly visiting owner's home for a check-in) or move to Sitting (logically a short version of the same thing)?

3. **Sitting price unit.** Per visit, per night, both? Walks-and-check-ins is per visit; Day care per visit; Boarding per night. Sitting at owner's home could realistically be either (e.g. the carer comes for a 2-hour evening sit vs. stays the weekend).

4. **Avoid recurrence.** Whatever the resolved label, document it inline in `lib/types.ts` next to the enum so future-us doesn't drift the meaning again. Consider a longer label like "Sitting (at your home)" or "House sitting" if "Sitting" alone keeps ambiguous.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task and its referenced docs
- [ ] **Settle the four-service taxonomy decision** (Phase decisions §1–§4 above) — write the resolution into [[Groups & Care Model]] → Services as Catalog before code changes start
- [ ] Review Open Questions log — confirm §4 Care service taxonomy + filter cluster maps cleanly to the workstreams below
- [ ] Audit for conflicts between phase plan and current codebase — particularly the `ServiceType` enum (9 `Record<ServiceType, X>` consumers) and seeded carer service configs
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Confirm scope — no tasks that belong in a different phase

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
