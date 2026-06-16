---
status: active
last-reviewed: 2026-06-15
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Service Options & Booking Clarity — Walkthrough

Verification checklist for the Service Options & Booking Clarity phase. **Concise by design** — three priority categories instead of an exhaustive per-workstream checklist. Trust that automated checks + visual sanity passes ran during the build; surface only what's worth the reader's judgment, what risks regression, and what they should glance at to confirm the phase thesis lands.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Walk top-to-bottom — the categories are ordered by "needs your eyeballs most" → "least."

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. The Decisions log at the bottom is a plain log (append-only).

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), Eliška (adoption-curious), New User.

**Scope-call resolutions (2026-06-15):** B = keep-separate `appointmentLocations` (no walks migration) + curated 4-tuples · D = surface existing `triggers`/`healthNotes` (no new field) + shelter empty-state prompts. Full table on the phase board.

**Build order:** A (verify A1/A2/A3 + build A4/A6) → C + C5 + D → B. Committed per workstream.

---

## Open for your call

Decisions the author made that warrant a second look — direction, not bug-hunt. (See `CONTRIBUTING.md` → decide-and-flag.)

Identifier prefix: **`O`** (O1, O2, ...).

- [x] **O1. Walk-delivery price editor — RESOLVED (fold in).** PO 2026-06-15: build the walk `deliveryOptions` carer-edit UI here too. Built. See Decisions log. (Klára → `/profile?tab=services` → Edit → Walks & Check-ins card.)
- [x] **O2. Half-day default = 60% of full-day rate — RATIFIED (PO 2026-06-15).** Kept at 60%. A half-day isn't half the cost (fixed per-booking overhead); 60% matches the seed and is a tunable starting suggestion. (Tereza → `/profile?tab=services` → Edit → Day care → toggle off/on.)

---

## Worth verifying

Interaction nuance, complex state, persona round-trips. Identifier prefix: **`V`** (V1, V2, ...).

- [ ] **V2. Walk handoff-location override round-trip (C2/C3).** As a viewer who can book a meet-linked walk (e.g. Daniel → `/meets/meet-klara-stromovka` → "Have Klára walk your dog"): the location field defaults to your area on **Pickup** and to the **meet's park** on **Drop-off** (switch the segment to see it re-default). Type a custom spot, book, then open the booking under `/bookings` — the detail row + the Schedule card should read "picks up at {your spot}" / "drop off at {your spot}."
- [ ] **V1. Owner-facing day-care half-day flow (A3 + A6) — needs a viewer Connected to Tereza.** Tereza's day-care is circle-scoped ("Familiar dogs only"), so it doesn't appear in a stranger's `/discover/care`. As a persona Connected to Tereza, open her day-care inquiry: confirm the **Full day / Half day** radio shows 150 / 90, the live estimate updates on toggle, and the chosen duration carries through to the proposal price line + booking-detail "Half day"/"Full day" label. (Code path verified — `InquiryForm.tsx` `offersHalfDay`, `resolveBaseRate`, `bookings/[id]` label — but not clicked end-to-end this build.)

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions/design changes/rationale that surfaced during walkthrough. Append as you walk. Each entry carries a `→ target-doc.md` annotation for the phase-close propagation sweep.

- **Walk-delivery price carer-edit UI built (folds O1 into A4).** `ProfileServicesTab` walks_checkins card now offers drop-off + pickup as toggle rows, each with its own priced input; the standalone "Price" field is replaced by these rows for walks (no double-price confusion). `pricePerUnit` is kept pointed at the base (drop-off if offered, else pickup) for fallback surfaces. Pickup seeds to `round(dropoff × 1.2)` when first enabled. At-least-one-method guard prevents disabling both. The `deliveryOptions` axis had been mock-seed-only since the Walk Service Delivery phase (2026-05-20). → `features/explore-and-care.md` (Walk Service Delivery additions — the carer-edit UI now exists)
- **Day-care half-day carer-edit UI built (A4).** Half-day price seeds to 60% of full-day; full-day option kept in lockstep with `pricePerUnit`. → `features/explore-and-care.md`
- **Walk handoff location = single `Booking.deliveryLocation?` field, not a pickup/dropoff pair.** The `delivery` method already disambiguates, so one free-text field suffices (board sketched two). Event-aware default: meet-linked drop-off defaults to the meet's park; pickup to the owner's area. Editable = a proposal the carer reviews (no formal approve gate in V1 — chat covers it). → `features/explore-and-care.md`
- **C4 — walk handoff location is free-text V1; saved-address dropdown deferred.** Matches C1's free-text call; the meet-park default removes most typing. The Discover saved-address picker reuse can come with P65. → no feature-doc update needed
- **C5 — "Group walk" walk sub-service renamed `Small-group walk` globally.** Disambiguates the care delivery detail (≤4 clients' dogs) from a community group-walk Meet. `mockShelters` FC18 community group walk keeps "group walk" (it IS a meet). → `features/explore-and-care.md` + `strategy/Groups & Care Model.md`
- **Linked-care booking copy reframed.** Booking-sheet card subline drops the raw "Walks & Check-ins" label (read as a check-in) → "On the {park} group walk · no need to come along," surfacing the linked meet. "no need to come along" (positive framing) replaces "you don't come along" across the card, success screen, and `LinkedCareCallout` (PO 2026-06-16). → `features/explore-and-care.md`
