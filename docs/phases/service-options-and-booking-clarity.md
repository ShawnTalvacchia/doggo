---
status: draft
last-reviewed: 2026-06-02
review-trigger: When any task is completed or blocked
---

# Service Options & Booking Clarity

> **Status: draft.** Sized 2026-06-02 from PO user interviews (Roman). Not opened — pre-build scope calls below are unresolved. Workstreams A + C are straightforward extensions of patterns already shipped; Workstream B (Appointment meeting-options) carries real design work that needs to settle before code lands.

**Goal:** Carers can offer richer service configurations (duration variants, location variants), and owners see clear options + accurate pricing in every booking flow. Removes the "what am I actually booking?" gap from today's Appointment + walk booking sheets.

**Thesis:** The Walk Service Delivery phase (2026-05-20) shipped pickup-vs-drop-off as a delivery axis on walks. This phase generalises the pattern — different service configurations carry different prices and different logistics, and the booking flow needs to communicate both clearly. Three workstreams, all sharing the "booking-flow transparency" thesis but each touching a distinct axis.

**Depends on:**
- Existing `CarerCareServiceConfig` + `CarerAppointmentServiceConfig` shapes (`lib/types.ts`)
- Existing pricing engine (`lib/pricing.ts`) + `deliveryOptions` precedent for walks
- Existing booking sheets (`LinkedWalkBookingSheet`, `AppointmentBookingSheet`, `BookSessionSheet`, `ServiceBookingSheet`)

**Refs:** [[meetings/po-briefing-2026-06-02]] (source of insights), [[features/explore-and-care]] (pricing engine + booking flow), [[strategy/Groups & Care Model]] (Services as Catalog), [[phases/Open Questions & Assumptions Log]] §17 (the appointment meeting-options design question)

**Not in scope:**
- Half-day variants for walks_checkins, house_sitting, or boarding (only day_care this phase; revisit if needed)
- Generalising the model to be carer-defined free-form (curated tuples this phase if Workstream B's Q2 resolves that way)
- Vet locations (vets are not a Care service type; see [[strategy/Vets as a Credentialing Layer]])

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task and its referenced docs
- [ ] Resolve Pre-build scope calls (see below) — all four must be answered before A/B/C tasks move to `in_progress`
- [ ] Review Open Questions log — §17 (appointment meeting-options) is the central question this phase tries to answer; also check §6 for vet-retired-as-Care-category context
- [ ] Audit `lib/pricing.ts` to confirm `computeQuote` + `computeAppointmentQuote` patterns we'll extend
- [ ] Audit `LinkedWalkBookingSheet`, `AppointmentBookingSheet`, `BookSessionSheet` for the current shape we're extending
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Scan punch list for overlap (puppy meet seed + Monday-first-day-of-week are independent; nothing else expected)
- [ ] Confirm scope — no tasks that belong in Dog Profile, Carer Portfolio, or Vets thread

---

## Pre-build scope calls

These shape the workstream tasks. Each has a recommendation; the user picks before tasks open.

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
   - **Recommendation:** booking-level only — service-level defaults add complexity without solving the user-facing problem (carer's pickup address is usually owner's home address anyway).

---

## Workstream A — Day-care half-day SKU

The cleanest extension. Day-care today is priced per-day; this adds a per-half-day option.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Extend `CarerCareServiceConfig` with `durationOptions?: { duration: "full_day" \| "half_day"; price: number }[]` when `serviceType === "day_care"`. Document inline that half_day is optional opt-in; if absent, day_care behaves as today (single full-day rate via `pricePerUnit`). | [[features/explore-and-care]] pricing engine | todo |
| A2 | Extend `computeQuote` in `lib/pricing.ts` to resolve `durationOptions` from `inquiry.duration` (new optional inquiry field). Falls through to existing single-rate behaviour when `durationOptions` is absent. Stack modifiers normally on the resolved base. | A1 | todo |
| A3 | Inquiry form — add a "Full day / Half day" radio when the active service is `day_care` AND `durationOptions.length > 1`. Persist to `inquiry.duration`. Update live estimate to reflect the toggle. | A1, A2 | todo |
| A4 | Carer service-edit UI — `ProfileServicesTab` day-care card grows a half-day opt-in row with price input. Defaults: opt-in disabled (existing behaviour preserved); when enabled, defaults to 60% of full-day rate (sensible starting point). | A1 | todo |
| A5 | Mock data — Klára's `klara-day-care` (or whichever carer offers it) seeds a half-day price; one other day-care carer left as full-day-only for contrast. | A1, A4 | todo |
| A6 | Display — `BookingProposalCard` + `Booking` detail show "Half day" / "Full day" label inline with the price line so the owner sees what they booked. | A2 | todo |

---

## Workstream B — Appointment meeting-options

The Klára case. Where does a 1-on-1 training session actually happen? Today the booking sheet says nothing about it.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Decide the data shape (per Pre-build Q1 + Q2). If generalised + curated: introduce `meetingOptions: MeetingOption[]` shared across `CarerCareServiceConfig` + `CarerAppointmentServiceConfig`; deprecate `deliveryOptions` over a migration path. If appointment-only + curated: introduce `appointmentLocations: AppointmentLocation[]` on `CarerAppointmentServiceConfig` only. | Pre-build Q1, Q2 | blocked-on-pre-build |
| B2 | The four curated tuples (assuming curated lands): "Carer comes to you" / "You bring dog to carer" / "Carer picks up dog + meets at a public place" / "Owner + carer meet at a public place." Each carries `whoTravels`, `where`, `price`. Default-recommended: "Carer comes to you" for training (matches Prague mobile-modal market per P64); facility-based defaults to "You bring dog to carer." | B1 | blocked-on-B1 |
| B3 | Carer service-edit UI — Appointment service card grows a "Where do you meet" multi-select with each tuple as a row + price input. At least one option required. | B1, B2 | blocked-on-B1 |
| B4 | `AppointmentBookingSheet` — when service offers >1 option, show a picker; when service offers exactly 1, show a read-only line ("Klára will come to your address"). Price reflects the selected option. Persist to `Booking.appointmentLocation` or shared meeting-option field per B1's decision. | B1, B2, B3 | blocked-on-B1 |
| B5 | `computeAppointmentQuote` resolves the option's price as the base rate. (Today it's a flat `pricePerAppointment`; this introduces option-aware base resolution.) | B1, B4 | blocked-on-B1 |
| B6 | Mock data — Klára's `klara-1on1` offers "Carer comes to you" only (single option, shows read-only line). Seed a second appointment carer (or convert an existing one) with multiple options to exercise the picker. | B2 | blocked-on-B1 |
| B7 | Display — `BookingProposalCard` + `Booking` detail show the chosen location row alongside service title + price (mirrors the walks `delivery` line). | B4 | blocked-on-B4 |

---

## Workstream C — Walks pickup/drop-off address specificity

Smaller. The `LinkedWalkBookingSheet` today says "pickup" or "drop-off" but doesn't let the owner specify *where* if it's not their default address.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Extend `Booking.delivery` from `{ method, price }` to `{ method, price, pickupLocation?: string, dropoffLocation?: string }`. Locations are free-text for V1 (proper POI autocomplete is a separate ask — see [[features/explore-and-care]] Discover address picker P65). | [[features/explore-and-care]] Walk Service Delivery | todo |
| C2 | `LinkedWalkBookingSheet` — when method is "pickup," show "Pickup address" field defaulting to viewer's neighbourhood/saved address with edit affordance. When method is "drop-off," show "Drop-off location" field. Single field per method; bookings with non-default values render the override. | C1 | todo |
| C3 | `ScheduleCard` + `Booking` detail — render the address inline with the delivery hint ("Pick up at Pavla's address, Letná" or just "Pick up at Letná" if the address is opaque). | C1, C2 | todo |
| C4 | Reuse the saved-addresses pattern from Discover Care filter panel where it makes sense (Discover panel's address picker is functional — same dropdown shape, just in a different surface). | C2 | todo |

---

## Acceptance Criteria

- [ ] Day-care carers can opt in to a half-day price; owners see the toggle in the inquiry form and the resulting price line on the proposal + booking detail
- [ ] Appointment booking sheets surface location to the owner — read-only line for single-option services, picker for multi-option services
- [ ] Walks `LinkedWalkBookingSheet` lets the owner specify a non-default pickup/drop-off address per booking
- [ ] Pricing engine output is correct across all three new option dimensions
- [ ] Mock data exercises each new surface (half-day-offering day-care carer, multi-option Appointment carer, non-default-address walk booking)
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
