---
status: active
last-reviewed: 2026-06-15
review-trigger: When any task is completed or blocked
---

# Service Options & Booking Clarity

> **Status: active — opened 2026-06-15.** Sized 2026-06-02 from PO user interviews (Roman); **expanded 2026-06-13** with a fresh round of PO feedback (relayed during the Adoption-Curious close); **opened 2026-06-15** — pre-build scope calls resolved (see below). Workstreams A + C are straightforward extensions of patterns already shipped; Workstream B (Appointment meeting-options) carries real design work; **Workstream D (dog health/profile fields)** is net-new from the 2026-06-13 round.
>
> **Opening-audit correction (2026-06-15): Workstream A is only partly shipped.** The pricing engine (`durationOptions`/`dayCareDuration` resolution in `resolveBaseRate`, `lib/pricing.ts`) and the inquiry-form full-day/half-day radio (`InquiryForm.tsx`) are built + seeded — but the **carer service-edit UI (A4)** has no duration-options editor in `ProfileServicesTab` (and no `deliveryOptions` editor either — the walk delivery axis has been mock-seed-only since 2026-05-20). So A is "verify A1/A2/A3 + build A4/A6," not a pure tick.
>
> **2026-06-13 scope decision (PO):** this is a deliberately *meaty* phase, not a shrunk palate-cleanser. Workstream B stays IN (its design questions are worth resolving, not deferring). The phase is the next one to open, slotting before the Design-System Audit. Added this round: Workstream D, the "Group walk" service relabel (C5), and the event-aware drop-off default (C2).

**Goal:** Carers can offer richer service configurations (duration variants, location variants), and owners see clear options + accurate pricing in every booking flow. Removes the "what am I actually booking?" gap from today's Appointment + walk booking sheets.

**Thesis:** The Walk Service Delivery phase (2026-05-20) shipped pickup-vs-drop-off as a delivery axis on walks. This phase generalises the pattern — different service configurations carry different prices and different logistics, and the booking flow needs to communicate both clearly. Workstreams A/B/C share the "booking-flow transparency" thesis, each touching a distinct axis. **Workstream D (added 2026-06-13)** is a different axis — dog health/profile data richness — bundled in as a coherent "clear up what the PO flagged" round rather than spun into its own micro-phase.

**Depends on:**
- Existing `CarerCareServiceConfig` + `CarerAppointmentServiceConfig` shapes (`lib/types.ts`)
- Existing pricing engine (`lib/pricing.ts`) + `deliveryOptions` precedent for walks
- Existing booking sheets (`LinkedWalkBookingSheet`, `AppointmentBookingSheet`, `BookSessionSheet`, `ServiceBookingSheet`)

**Refs:** [[meetings/po-briefing-2026-06-02]] (source of insights), [[features/explore-and-care]] (pricing engine + booking flow), [[strategy/Groups & Care Model]] (Services as Catalog), [[planning/Open Questions & Assumptions Log]] §17 (the appointment meeting-options design question)

**Not in scope:**
- Half-day variants for walks_checkins, house_sitting, or boarding (only day_care this phase; revisit if needed)
- Generalising the model to be carer-defined free-form (curated tuples this phase if Workstream B's Q2 resolves that way)
- Vet locations (vets are not a Care service type; see [[strategy/Vets as a Credentialing Layer]])

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Resolve Pre-build scope calls (see below) — **resolved 2026-06-15** (all five recorded below; B Q1/Q2 + D Q5a confirmed with PO; #1/#4/#5b/#5c taken as already-decided)
- [x] Review Open Questions log — §17 (appointment meeting-options) is the central question this phase answers (closes on phase close); §6 confirms vets out of Care taxonomy (no conflict)
- [x] Audit `lib/pricing.ts` — confirmed `computeQuote` (delivery + duration resolution via `resolveBaseRate`) + `computeAppointmentQuote` (flat single-line, no option-aware base yet) patterns
- [x] Audit `LinkedWalkBookingSheet` (meet-aware, no owner address field), `AppointmentBookingSheet` (no location surfaced, flat quote), `InquiryForm`/`ProfileServicesTab` (half-day radio shipped; carer-edit option UI NOT built — A4 gap)
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — checked; `explore-and-care`, `Groups & Care Model`, Open Questions all current (≤2 wk)
- [x] Scan punch list for overlap — no hard overlap. P81 (trim walk-recap posts) is content-adjacent to Workstream D's shelter-dog seed pass; fold opportunistically. P79/P80/P78/P76 independent. (Board's old "puppy meet seed / Monday-first-day" note was stale.)
- [x] Confirm scope — no tasks belong in Dog Profile, Carer Portfolio, or Vets thread; D's fields are net-new dog-profile data but explicitly scoped here per the 2026-06-13 PO round

---

## Pre-build scope calls

These shape the workstream tasks. Each has a recommendation; the user picks before tasks open. **All resolved 2026-06-15 (PO).**

| # | Call | Resolution (2026-06-15) |
|---|------|-------------------------|
| 1 | Day-care half-day SKU shape | **Yes — confirmed by existing code.** Already implemented exactly as recommended (`durationOptions` on `CarerCareServiceConfig`). |
| 2 (B-Q1) | Generalise meeting-options across walks+appointments vs keep separate | **Keep separate.** Appointment-only `appointmentLocations`; walks `deliveryOptions` untouched (zero migration risk). Generalise later as a clean refactor if both shapes prove out. |
| 3 (B-Q2) | Curated tuples vs free-form | **Curated tuples** (~4 named patterns). Comparable across Discover cards; free-form deferred. |
| 4 | Walks address Booking-level vs Service-level | **Booking-level**, via the existing inquiry→ProposalForm proposal→provider-review model (PO confirmed 2026-06-13). |
| 5a (D) | Special-instructions new field vs reuse | **Surface existing** `preferences.triggers` + `healthNotes`; no redundant field. Lightweight empty-state prompts on shelter dogs. |
| 5b (D) | Placement of chip# / exercise-needs / instructions | Chip# → quiet identity line under Health; exercise-needs + instructions → near preferences/personality (care-handling, not medical). Settle exact layout at build time. |
| 5c (D) | Empty-state on shelter dogs | **Yes** — lightweight prompts so shelter staff know to fill them (the Tonda gap). |

Original detail (kept for reasoning):

1. **Day-care half-day SKU shape.** Mirror existing `deliveryOptions` pattern with `durationOptions: { duration: "full_day" | "half_day", price }[]` on `CarerCareServiceConfig` when `serviceType === "day_care"`? **Recommended: yes** — consistent with the existing pattern, low cognitive load.

2. **Workstream B Q1 — generalise data shape across walks + appointments, or keep separate?**
   - **Generalise:** introduce a shared `meetingOptions: { whoTravels, where, price }[]` abstraction on `CarerCareServiceConfig` + `CarerAppointmentServiceConfig`. Walks `deliveryOptions` migrates to use it. Cleaner model long-term.
   - **Keep separate:** appointments grow their own `appointmentLocations` field; walks `deliveryOptions` stays as-is. Less migration risk.
   - **Recommendation:** generalise — but only if Q2 (curated vs free-form) lands on curated. A free-form generalised shape across services has too many degrees of freedom to render comparably.

3. **Workstream B Q2 — curated tuples or carer-defined free-form?**
   - **Curated:** ship ~4 named tuples ("Carer comes to you" / "You bring dog to carer" / "Carer picks up dog + meets at a public place" / "Owner + carer meet at a public place"). Each tuple is a known pattern; renders consistently across cards.
   - **Free-form:** carer defines their own options (label + price). Matches reality (carers have varied setups), but inconsistent across cards.
   - **Recommendation:** curated — comparable across Discover cards is a real value; free-form can be added later if data shows curated misses too many cases.

4. **Walks pickup/drop-off address fields — Booking-level or Service-level default?**
   - **Booking-level:** owner sets non-default addresses per booking on the inquiry form; persists on `Booking.delivery.pickupLocation` + `dropoffLocation`.
   - **Service-level default:** carer's service config carries default addresses; owner can override per booking.
   - **Recommendation:** booking-level only — service-level defaults add complexity without solving the user-facing problem (carer's pickup address is usually owner's home address anyway). **(PO 2026-06-13 confirmed this model:** start from a default, let the owner select/propose another; it's a *proposal* the provider reviews and decides — fits the existing inquiry → ProposalForm flow. Not free-pick-anything.)

5. **Workstream D — "special instructions" field: new vs reuse; and where do D's fields render?**
   - The data model already has `preferences.triggers` (hidden when empty) and `healthNotes`/owner `ownerNotes`; chip/registration # and exercise needs are net-new.
   - **Q5a — special instructions:** add a dedicated `specialInstructions?` field, or surface existing `healthNotes`/`triggers` more prominently? **Recommendation:** surface what exists (don't add a redundant field) + ensure shelter dogs carry triggers/instructions in seed; revisit a dedicated field only if the existing ones prove too coarse.
   - **Q5b — placement:** do chip #, exercise needs, and instructions live inside the existing **Health** section, or a small new **Identity / Care-needs** block? **Recommendation:** chip/registration → a quiet identity line in/under Health; exercise needs + instructions → near the personality/preferences area (they're care-handling info, not medical). Settle at build time.
   - **Q5c — empty-state on shelter dogs:** the preferences/instructions sections hide when empty, so shelter staff get no prompt to fill them. Show empty-state prompts on shelter-managed dogs? **Recommendation:** yes, lightweight (the PO's Tonda screenshot is exactly this gap).

---

## Workstream A — Day-care half-day SKU

The cleanest extension. Day-care today is priced per-day; this adds a per-half-day option.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Extend `CarerCareServiceConfig` with `durationOptions?: { duration: "full_day" \| "half_day"; price: number }[]` when `serviceType === "day_care"`. Document inline that half_day is optional opt-in; if absent, day_care behaves as today (single full-day rate via `pricePerUnit`). | [[features/explore-and-care]] pricing engine | done (verified — code audit) |
| A2 | Extend `computeQuote` in `lib/pricing.ts` to resolve `durationOptions` from `inquiry.duration` (new optional inquiry field). Falls through to existing single-rate behaviour when `durationOptions` is absent. Stack modifiers normally on the resolved base. | A1 | done (verified — `resolveBaseRate`, `inquiry.dayCareDuration`) |
| A3 | Inquiry form — add a "Full day / Half day" radio when the active service is `day_care` AND `durationOptions.length > 1`. Persist to `inquiry.duration`. Update live estimate to reflect the toggle. | A1, A2 | done (code verified; live click-through → walkthrough V1) |
| A4 | Carer service-edit UI — `ProfileServicesTab` day-care card grows a half-day opt-in row with price input. Defaults: opt-in disabled (existing behaviour preserved); when enabled, defaults to 60% of full-day rate (sensible starting point). **+ O1 (PO 2026-06-15): also built the walk `deliveryOptions` carer-edit UI** (drop-off/pickup toggle rows, each priced; replaces the standalone Price field for walks; pickup seeds +20%; at-least-one guard). | A1 | **done 2026-06-15** — both editors built + live-verified |
| A5 | Mock data — Klára's `klara-day-care` (or whichever carer offers it) seeds a half-day price; one other day-care carer left as full-day-only for contrast. | A1, A4 | done (verified — Tereza `day_care` 150/90; other day-care carers full-day-only) |
| A6 | Display — `BookingProposalCard` + `Booking` detail show "Half day" / "Full day" label inline with the price line so the owner sees what they booked. | A2 | done (code verified — `bookings/[id]` label + quote line suffix; live → walkthrough V1) |

---

## Workstream B — Appointment meeting-options

The Klára case. Where does a 1-on-1 training session actually happen? Today the booking sheet says nothing about it.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | **DECIDED 2026-06-15 (keep separate + curated):** introduce `appointmentLocations: AppointmentLocation[]` on `CarerAppointmentServiceConfig` only; walks `deliveryOptions` untouched (no migration). Tuple shape carries `whoTravels`, `where`, `price`. | Pre-build Q1, Q2 | done (decision) |
| B2 | The four curated tuples: "Carer comes to you" / "You bring dog to carer" / "Carer picks up dog + meets at a public place" / "Owner + carer meet at a public place." Each carries `whoTravels`, `where`, `price`. Default-recommended: "Carer comes to you" for training (matches Prague mobile-modal market per P64); facility-based defaults to "You bring dog to carer." | B1 | todo |
| B3 | Carer service-edit UI — Appointment service card grows a "Where do you meet" multi-select with each tuple as a row + price input. At least one option required. | B1, B2 | todo |
| B4 | `AppointmentBookingSheet` — when service offers >1 option, show a picker; when service offers exactly 1, show a read-only line ("Klára will come to your address"). Price reflects the selected option. Persist to `Booking.appointmentLocation`. | B1, B2, B3 | todo |
| B5 | `computeAppointmentQuote` resolves the option's price as the base rate. (Today it's a flat `pricePerAppointment`; this introduces option-aware base resolution.) | B1, B4 | todo |
| B6 | Mock data — Klára's `klara-1on1` offers "Carer comes to you" only (single option, shows read-only line). Seed a second appointment carer (or convert an existing one) with multiple options to exercise the picker. | B2 | todo |
| B7 | Display — `BookingProposalCard` + `Booking` detail show the chosen location row alongside service title + price (mirrors the walks `delivery` line). | B4 | todo |

---

## Workstream C — Walks pickup/drop-off address specificity

Smaller. The `LinkedWalkBookingSheet` today says "pickup" or "drop-off" but doesn't let the owner specify *where* if it's not their default address.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Extend `Booking.delivery` … add location. **Shipped as a single `Booking.deliveryLocation?: string`** (not the sketched `pickupLocation`/`dropoffLocation` pair) — `delivery` (the method) disambiguates which kind of location it is, so one field suffices and avoids two mutually-exclusive fields. Free-text V1 (POI autocomplete deferred — P65). | [[features/explore-and-care]] Walk Service Delivery | **done 2026-06-15** |
| C2 | `LinkedWalkBookingSheet` — pickup → "Pickup address" defaulting to viewer's neighbourhood; drop-off → "Drop-off location" defaulting to the **linked Meet's park** (event-aware). Single editable field, re-defaults on method switch; the value is a *proposal* the carer reviews. | C1 | **done 2026-06-15** — live-verified (pickup→Holešovice, drop-off→Stromovka) |
| C3 | `ScheduleCard` (`handoverLabel` prefers `deliveryLocation`) + `Booking` detail row render the address ("picks up at Holešovice"). | C1, C2 | **done 2026-06-15** — live-verified on booking detail |
| C4 | Reuse saved-addresses dropdown from Discover Care filter panel. **Decided: free-text V1** (matches C1's free-text call); the meet-park default already removes most typing. Saved-address dropdown reuse deferred — see walkthrough. | C2 | done (free-text V1; dropdown deferred) |
| C5 | **"Group walk" relabel + meet-link clarity (PO 2026-06-13).** Done two ways: (1) global rename of the canonical walk sub-service `Group walk` → **`Small-group walk`** across `SUB_SERVICES`, `FilterBody`, all mock data (users/bookings/conversations) + the booking-sheet label — `mockShelters` FC18 community group-walk stays "group walk" (genuinely a meet). (2) the booking-sheet card subline no longer shows the raw "Walks & Check-ins" service label (read as a check-in) — now **"On the {park} group walk · no need to come along"**, surfacing the linked meet. Same "no need to come along" reframe applied to `LinkedCareCallout` + success screen (PO 2026-06-16 — less negative than "you don't come along"). | [[lib/mockUsers]] `klara-walks`, [[strategy/Groups & Care Model]] | **done 2026-06-15** |

---

## Workstream D — Dog health / profile fields

Net-new from the 2026-06-13 PO round (comment on Tonda's health section). Today shelter dogs surface vaccinations + neutered only; chip/registration #, exercise needs, and special instructions/triggers don't show. See Pre-build scope call #5 for the field/placement/empty-state decisions.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Add `microchipNumber?: string` to `PetProfile`; render as a quiet identity line under the Health section (dog page `DogHealthSection` + owner-profile `PetCard`). | Pre-build Q5b | **done 2026-06-15** |
| D2 | Add `exerciseNeeds?: string` to `PetProfile` (the prescription vs `energyLevel` the level); render as an "Exercise" row in the standing-preferences section. | Pre-build Q5b | **done 2026-06-15** |
| D3 | Surface existing `preferences.triggers` (already rendered) + **also surface `spayedNeutered` + `vetInfo.conditions`** on the dog page (they only rendered on `PetCard` before). Lightweight empty-state prompt on shelter-managed dogs when no care notes ("No care notes yet. Add likes, triggers, and exercise needs…"). | Pre-build Q5a, Q5c | **done 2026-06-15** — live-verified (Tonda populated, Líza empty-state) |
| D4 | Mock data — Tonda (full: chip, exercise, likes/triggers/play), Maja (reactive management notes), Šimon (senior + a `conditions` value) seeded; Líza + thin-shelter dogs left empty to exercise the prompt. One owned dog (Bára) seeded too so `PetCard` is populated. | D1, D2, D3 | **done 2026-06-15** |
| D5 | Edit affordance — owned dogs edit `exerciseNeeds` (preferences section) + `microchipNumber` (Health & vet) via `PetEditCard`. Shelter-dog operator editing stays V3+ (FC16); seed shelter dogs read-only. | D1, D2, D3 | **done 2026-06-15** (typecheck; live edit → walkthrough) |

---

## Acceptance Criteria

- [ ] Day-care carers can opt in to a half-day price; owners see the toggle in the inquiry form and the resulting price line on the proposal + booking detail
- [ ] Appointment booking sheets surface location to the owner — read-only line for single-option services, picker for multi-option services
- [ ] Walks `LinkedWalkBookingSheet` lets the owner specify a non-default pickup/drop-off address per booking; meet-linked walks default the drop-off to the linked Meet's location
- [ ] The "Group walk" subService no longer reads as a community Meet on the Walks & Check-ins card (C5)
- [ ] Dog health/profile fields surface for shelter dogs: chip/registration #, exercise needs, and triggers/instructions show on a seeded dog (e.g. Tonda), with empty-state prompts where unfilled (Workstream D)
- [ ] Pricing engine output is correct across all the new option dimensions
- [ ] Mock data exercises each new surface (half-day-offering day-care carer, multi-option Appointment carer, non-default-address walk booking, a fully-populated shelter dog health section)
- [ ] Pre-build scope calls are recorded as resolved in this board (with the decision logged)
- [ ] Open Question §17 is closed by this phase OR explicitly punted with reason
- [ ] No regressions on walks `deliveryOptions` (which may migrate per B1's decision)
- [ ] TypeScript compiles clean

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update `docs/features/explore-and-care.md` with the new booking-flow patterns
- [ ] Update Open Questions log — close §17; add any new ones (the Q2 free-form possibility is a likely future Q)
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update if any new principle lands (booking-flow transparency rule?)
- [ ] Review Punch List items added during the phase — update affected feature docs
- [ ] Archive this phase board AND walkthrough — copy to `archive/phases/`, mark `status: archived`, then `git mv`
- [ ] **Structural audit** — see CONTRIBUTING.md closing checklist for the full sweep
- [ ] **Strategic review** — does the booking flow read clearly to a new tester? What surfaces still under-communicate the "what am I booking" question? Anything to feed back into Demo Narrative or Cold-Start Playbook?
