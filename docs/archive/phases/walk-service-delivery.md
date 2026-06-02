---
status: archived
last-reviewed: 2026-06-01
review-trigger: archived — phase closed 2026-06-01
---

# Walk Service Delivery — Pickup & Drop-off

**Goal:** Make delivery (who travels — owner or carer) a real product affordance on walk services. A walks_checkins service offers up to two priced options — **drop-off** (owner brings dog to the carer / meet point) and **pickup** (carer collects from owner's address) — and the owner picks one when booking, with the choice persisted on the Booking record and reflected on schedule + meet surfaces.

**Why now:** Surfaced 2026-05-20 while reviewing the demo — Klára's `klara-walks` service card on the meet reads "Drop-off — Klára takes your dog on this walk. You don't come along." with a single 300 Kč price, and the booking sheet doubles down on the same framing. The word "drop-off" is doing two jobs: (a) the **config-#2 model name** (book ≠ attend — the owner doesn't join the walk), (b) a **literal delivery method** (where the handoff happens). This phase disambiguates them by making delivery an explicit, priced choice while config #2 stays the booking-shape name. Also: `ScheduleCard` already renders `"Pick up at {neighbourhood}"` for `walks_checkins` bookings — that hint is real product copy that has no backing data today. This phase makes the data match the UI.

**Depends on:** Service ↔ Meet Linkage (closed 2026-05-17). This refines the config-#2 model, doesn't replace it. The existing `Booking.dropoffMeetId` field stays — it names the link to the meet, not the delivery method.

**Refs:**
- `docs/strategy/Groups & Care Model.md` → "Services as Catalog" + config #2 definition (must update — see W7)
- `docs/features/explore-and-care.md` — service pricing model (must update — see W7)
- `docs/strategy/Demo Narrative.md` → Beat 2 (Toby's booking is narratively a pickup; mock data should agree)
- `docs/strategy/Open Questions & Assumptions Log.md` → §13 (linked services — context, not blocked here)
- `lib/types.ts` — `CarerCareServiceConfig`, `Booking`, related shapes
- `lib/mockBookings.ts` — `klaraDropoffToby`, every walks_checkins booking needs a pass
- `lib/personas.ts` / wherever carer service configs are seeded — `klara-walks`, `pawel-walks`, etc.
- `lib/pricing.ts` — `computeQuote`
- `components/meets/LinkedCareCallout.tsx` — the card on the meet
- `components/meets/DropoffBookingSheet.tsx` — the booking flow (may want renaming)
- `components/schedule/ScheduleCard.tsx` — already has the `"Pick up at…"` / `"Drop off in…"` split logic; align with new field
- `app/meets/[id]/page.tsx` — `dropoffByDate` + "Drop-off booked" pill copy

---

## Opening Checklist

Complete before writing any code.

- [x] Read every Workstream task + the referenced docs
- [x] Review Open Questions §13 (linked services) for anything affecting this phase
- [x] Audit the codebase for every place that says "drop-off" — separate the **config-#2-model** usages from the **delivery-method** usages so the rename in W1 doesn't leak — *found four senses in active use, not two; logged in Decisions surfaced*
- [x] Confirm scope — walks_checkins delivery only; house_sitting / day_care / boarding / appointment are NOT in scope
- [x] Update any referenced doc whose `last-reviewed` is older than 2 weeks at open time — *Groups & Care Model 2026-05-17, explore-and-care 2026-05-17, Demo Narrative 2026-05-19 all current*

---

## Open questions to resolve in W1

These need answers BEFORE any code lands. Surfacing now so the new chat's first work is making these calls explicitly.

- **Q1 — Data shape.** Which of these wins:
  - (a) **Delivery options array** on the service config: `deliveryOptions: { method: "dropoff" | "pickup"; price: number }[]` — flexible, lets some carers offer only one method.
  - (b) **Two optional price fields**: `dropoffPrice?: number` + `pickupPrice?: number` — simpler, also lets carers opt out of one method (the absent field).
  - (c) **Single price + a delivery surcharge**: one base price, optional `pickupSurcharge` for the carer-comes-to-you uplift. Pricing logic stays simple but limits modelling.
  - *Recommendation to consider: (a) — it scales to other delivery variants later (e.g. "neighbourhood drop-off point", "carer's home") without another schema rev.*
- **Q2 — Defaults across carers.** Klára offers both. Do all walks_checkins carers? Possibilities:
  - (a) Every walks_checkins carer offers both, defaults set by W2 audit.
  - (b) Some carers (Pawel, Tereza) opt in to one or the other based on their persona (busy professionals might want pickup-only).
  - *This is a mock-data calibration decision — easier to make case-by-case during W2.*
- **Q3 — Default selected option in the booking sheet.** Pickup or drop-off? Suggest **pickup** (matches the audience's likely preference; drop-off is a step-down).
- **Q4 — Pricing model.** Independent prices per method (a in Q1), or base price + surcharge (c)? If carers can set independent prices, the auto-quote engine needs to know which one the owner selected.
- **Q5 — Should config-#2 be renamed?** The model name "drop-off Care" becomes confusing when delivery is a *separate* axis. Options:
  - (a) Keep "drop-off Care" as the config name — accept the overload, lean on doc clarity.
  - (b) Rename internally (TypeScript field name stays `dropoffMeetId` because it's a typed field across many surfaces, but documentation calls it "linked-care booking" or "book-not-attend").
  - *Recommendation: (b). The field name stays; the documentation language separates concerns.*
- **Q6 — Meet occurrence pill copy.** "Drop-off booked" is shown on the occurrence row when the viewer has a config-#2 booking on that date. With delivery now a choice, options:
  - (a) Keep "Drop-off booked" — it names the booking type, not the delivery.
  - (b) Switch to "Care booked" — neutral.
  - (c) Reflect the choice: "Pickup booked" / "Drop-off booked" based on `Booking.delivery`.
  - *Recommendation: (b) "Care booked" or "Walk booked" — least confusing, ties to the meet's own copy.*

---

## Workstream W1 — Decisions + types

Make the open questions concrete; commit to a schema. Doc + type work only.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W1.1 | Resolve Q1–Q6 with explicit decisions; record them in this board's "Decisions surfaced" log (added at bottom on first decision). | this file | done |
| W1.2 | Update `lib/types.ts` — extend `CarerCareServiceConfig` (or its walks_checkins variant) per Q1, and add `Booking.delivery: "pickup" \| "dropoff"` (nullable for non-walk bookings) per Q4. | `lib/types.ts` | done |
| W1.3 | Type-check + grep for every existing reference to fields that changed — no dangling consumers. | — | done |

---

## Workstream W2 — Mock data + pricing engine

Update existing data + the auto-quote engine so the booking flow has real numbers to show.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W2.1 | Update Klára's `klara-walks` service config — both delivery options + their prices (300 Kč drop-off / 400-ish Kč pickup — calibrate). | wherever carer service configs are seeded | done — 300 drop-off / 380 pickup |
| W2.2 | Audit all other walks_checkins carer service configs (Pawel, Tereza, others) — set their delivery options per Q2's per-carer call. | mock data files | done — 10 carers updated to "both"; Pawel has no `CarerCareServiceConfig` (legacy `Group.serviceListings`), narrative pickup-only holds via existing copy |
| W2.3 | Update `computeQuote` in `lib/pricing.ts` to factor `Booking.delivery` into the price line items + total. | `lib/pricing.ts` | done — `resolveBaseRate` helper resolves via `deliveryOptions[]` |
| W2.4 | Reconcile `klaraDropoffToby` in `lib/mockBookings.ts` — set `Booking.delivery: "pickup"` so the demo's Beat 2 narrative (Klára picks Toby up at 9:40) matches the data. Update `carerNotes` / `timeLabel` if needed. | `lib/mockBookings.ts` | done — pickup at 380 Kč, carerNotes updated |
| W2.5 | Audit other existing walks_checkins bookings — backfill `Booking.delivery`. | `lib/mockBookings.ts` | done — 7 backfills, all pickup (matches historical hard-coded rule, no narrative ruptures) |

---

## Workstream W3 — Booking flow UI

The owner-facing path through booking.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W3.1 | Add a delivery picker to `DropoffBookingSheet` — two-option toggle (pickup / drop-off) with their respective prices visible; selection updates the displayed quote. Default per Q3. | `components/meets/DropoffBookingSheet.tsx` | done — pickup default, drop-off second; price updates 380 → 300 on switch (verified) |
| W3.2 | Decide the sheet name. `DropoffBookingSheet` is now misleading (it handles both methods). Candidates: `LinkedWalkBookingSheet`, `WalkServiceBookingSheet`, `CareWalkBookingSheet`. | naming call | done — `LinkedWalkBookingSheet` (names what it produces — a booking on a linked walk-meet, agnostic to delivery method) |
| W3.3 | Update the sheet's confirmation step — show the chosen delivery method + final price in the booked confirmation. | same | done — confirmation names method ("Pickup" / "Drop-off") + price + a sentence about who travels |

---

## Workstream W4 — Display surfaces

Everywhere the service or booking appears on screen.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W4.1 | Update `LinkedCareCallout` (the card on the meet) — list both delivery options with their prices, or land on a primary-with-secondary layout. The current "Drop-off — Klára takes your dog on this walk. You don't come along." copy needs rewriting per Q5. | `components/meets/LinkedCareCallout.tsx` | done — pickup + drop-off rows with prices, "Drop-off — …" prefix copy retired |
| W4.2 | `ScheduleCard` (`components/schedule/ScheduleCard.tsx`) already chooses `"Pick up at…"` vs `"Drop off in…"` based on `serviceType`. Wire it to `Booking.delivery` instead so the hint reflects the actual choice, not just the service category. | `components/schedule/ScheduleCard.tsx` | done — walks read `Booking.delivery`; non-walks keep implicit-by-service rule; one-off chip renamed "Drop-off" → "One-off" (audit finding) |
| W4.3 | Decide + apply the meet occurrence pill copy per Q6 — `app/meets/[id]/page.tsx`. | `app/meets/[id]/page.tsx` | done — "Walk booked" |
| W4.4 | Profile Services tab — Klára's services list should show the same delivery options Klára's card shows. Audit `app/profile/[userId]/page.tsx`. | `app/profile/[userId]/page.tsx` | done — "From {floor}" pricing + two-row delivery option list when both are offered; "Care-type ... drop-off services" comment scrubbed |
| W4.5 | Booking detail page (`SessionDetailContent`) — surface the delivery method somewhere visible (a small chip or a sentence in the booking summary). | `components/schedule/SessionDetailContent.tsx` | done — landed on `/bookings/[id]` page detail list (the higher-leverage surface), not `SessionDetailContent` — that one is per-session, not per-booking |

---

## Workstream W5 — Beat 2 reconciliation + walkthrough sanity

The demo's Beat 2 explicitly frames Toby's booking as a pickup. Confirm everything still hangs together.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W5.1 | Walk through Beat 2 end-to-end with the new delivery model. Schedule card hint reads "Pick up at Holešovice" (or similar). Active session matches. Visit report copy unaffected. | `lib/walkthroughBeats.ts` | done — verified in browser: "Pick up at Holešovice" on Klára's schedule; booking detail shows "Klára picks up at the owner's address / Pickup / 380 Kč"; callout pickup-first |
| W5.2 | Add a tiny narrative touch if useful — e.g. Beat 2's My Schedule step copy could lean into the pickup ("first, picks up Toby" already exists; maybe sharper now). Only if it adds; don't over-narrate. | `lib/walkthroughBeats.ts` | done (no-op) — existing Beat 2 copy already says "she's got a dog to pick up" / "she picks up on the way." Data work makes the existing copy land. |

---

## Workstream W6 — Documentation

Update the strategy + feature docs so the disambiguation is recorded.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| W6.1 | Update `docs/strategy/Groups & Care Model.md` — separate the **config-#2 booking shape** from the **delivery method**. Add a clear "Two axes" callout. | `docs/strategy/Groups & Care Model.md` | done — "Two axes" section added; config #2 renamed "linked-care booking"; copy rules called out |
| W6.2 | Update `docs/features/explore-and-care.md` — document the delivery options on walks_checkins, the booking field, the pricing implications. | `docs/features/explore-and-care.md` | done — "Walk Service Delivery additions" subsection covers data model, default, rename, surfaces |
| W6.3 | Update `docs/strategy/Demo Narrative.md` if Beat 2 copy materially changes (per W5.2). | `docs/strategy/Demo Narrative.md` | done — scrubbed config-#2 "drop-off Care booking" → "linked-care booking" throughout; Beat 2 step copy unchanged (W5.2 no-op) |
| W6.4 | Update CLAUDE.md "Key decisions" to record the new delivery-vs-shape distinction (one-line entry under the Service ↔ Meet Linkage section). | `CLAUDE.md` | done — Key decision entry added; Current Phases updated; types.ts JSDoc "Care-type ... Drop-off" umbrella scrubbed (audit finding) |

---

## Acceptance Criteria

- [x] Klára's `LinkedCareCallout` on the Stromovka walk shows two priced delivery options (drop-off + pickup) — verified in browser
- [x] Opening the booking sheet from that card presents a delivery picker; selecting an option updates the quoted price — verified (380 → 300 Kč on switch)
- [x] After booking, the `Booking` record persists the chosen delivery method — `Booking.delivery` wired through `LinkedWalkBookingSheet.handleConfirm`
- [x] `ScheduleCard` for a walks_checkins booking shows the correct "Pick up at…" / "Drop off in…" hint based on `Booking.delivery` (not the bare serviceType) — verified
- [x] Toby's `klaraDropoffToby` booking has `Booking.delivery: "pickup"`, and Beat 2 walks cleanly — verified in browser
- [x] All other walks_checkins carer service configs in mock data have valid delivery options — 10 configs updated; Pawel is pickup-only narratively (no `CarerCareServiceConfig`, legacy `Group.serviceListings`)
- [x] `Groups & Care Model.md` + `explore-and-care.md` document the disambiguation
- [x] No raw-neutral leaks; no dangling consumers of removed/changed fields — `tsc` clean throughout the phase

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close anything resolved here, add what surfaced
- [ ] Update ROADMAP.md — mark phase complete with one-paragraph summary
- [ ] Review CLAUDE.md — update Current Phase, Key Decisions, structural changes
- [ ] Archive this phase board (copy to `docs/archive/phases/`, mark `status: archived`, delete original)
- [ ] **Structural audit:**
  - Any files in `docs/phases/` with `status: archived`/`complete`? Delete.
  - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
  - Any doc in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
  - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md`? Fix.
- [ ] Check next-phase scope for conflicts with what was just built

---

## Decisions surfaced

*Populate as Q1–Q6 are resolved in W1. Each entry: one line, the call + the why.*

**Q1 — Data shape: delivery options array.** `deliveryOptions?: { method: "dropoff" | "pickup"; price: number }[]` on `CarerCareServiceConfig`. Absent = single drop-off (current world is the degenerate fallback). *Why: presence-based opt-in (Pawel pickup-only) avoids phantom-zero semantics; scales to future variants ("neighbourhood drop-off point") without another schema rev.*

**Q2 — Defaults across carers: both for everyone, with Pawel as the deliberate pickup-only exception.** *Why: three existing mock surfaces (`mockNotifications.ts:394`, `mockBookings.ts:544`, `mockGroups.ts:576`) already say Pawel runs a pickup route. Pickup-only aligns data to existing copy and gives the demo a second walker silhouette next to Klára.*

**Q3 — Default selected method in the booking sheet: pickup (both doorways).** *Why: research suggests pickup is the dominant choice; pre-selecting the expected option matches reality. Owners who deviate to drop-off see the price drop, which reads as a happy surprise rather than an upsell. Argued out 2026-05-20.*

**Q4 — Pricing model: independent prices per method (follows Q1a).** Extend `InquiryDetails.delivery` + `Booking.delivery` (both optional). `computeQuote` resolves base via `deliveryOptions[].find(d => d.method === inquiry.delivery)?.price ?? config.pricePerUnit`. Modifiers stack normally on the resolved base.

**Q5 — Config-#2 rename: keep field name, retire visible "drop-off" copy, rename concept to "linked-care booking" in docs and UI. Component renamed `DropoffBookingSheet` → `LinkedWalkBookingSheet`.** *Why: typed field `dropoffMeetId` ripples too far to rename; visible copy "Drop-off — Klára takes your dog…" was always doing the job that delivery now does properly. "Linked-care booking" pairs with existing "linked services" terminology in Open Q §13.*

**Q6 — Meet occurrence pill: "Walk booked".** *Why: (a) keeps "drop-off" overloaded; (c) puts too much info on a chip whose job is "this date has a booking." "Walk" matches surrounding meet copy better than "Care."*

**Audit additions to scope (uncovered during the read pass — not on the board as drafted):**

- **W4.2 also kills the one-off "Drop-off" chip in ScheduleCard** ([ScheduleCard.tsx:450](../../components/schedule/ScheduleCard.tsx) and 589). The chip means "one-off Care booking" — a *third* sense of "drop-off" the board didn't flag. Collides with the W4.2 delivery hint (a one-off pickup booking would render the chip "Drop-off" above a "Pick up at…" hint, contradicting itself).
- **W6 docs sweep also scrubs "drop-off" as Care-offering umbrella** — types.ts JSDoc (line 1126) and profile page comment (line 959) both use "drop-off" as shorthand for "Care-type offering shape." This is a fourth sense. Replace with the "I take the dog" framing already used in Groups & Care Model onboarding routing.
- **W2.5 backfill is per-booking, not blanket.** Existing one-off walks_checkins bookings have silently rendered as pickup via ScheduleCard's hard-coded `serviceType === "walks_checkins"` rule. Each needs an explicit `delivery` per the carer's offering + narrative fit.
