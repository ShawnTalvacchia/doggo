---
status: active
last-reviewed: 2026-05-20
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Walk Service Delivery — Walkthrough

Verification checklist for the Walk Service Delivery phase. **For checking only** — decisions land in the phase board or feature docs; emergent stuff goes in "Decisions surfaced" at the bottom.

**Phase thesis to verify:** Delivery (pickup vs drop-off — *who travels* for the handoff) is a first-class priced axis on `walks_checkins` services. The config-#2 booking shape (book ≠ attend) keeps its data model but loses the "drop-off" copy and is now called "linked-care booking." The two axes compose freely and never collide.

**How to use:**
1. Dev server runs on port 3000 (already running per `.claude/launch.json`).
2. Switch personas via `?as=<personaId>` URL param.
3. Tick items as you go.

**Personas you'll use:** Daniel (locked profile, owner of Bára), Klára (trainer, hosts the Stromovka walk + carer for the linked walks), Filip (Klára's existing client, owner of Toby), Tereza (default).

**Pre-staged data worth knowing:**
- Klára's `klara-walks` Care service has both delivery options: **drop-off 300 Kč / pickup 380 Kč**.
- `booking-klara-toby` (Filip ↔ Klára) is set to `delivery: "pickup"` to match Beat 2's narrative (Klára collects Toby on the way to Stromovka).
- Other walks_checkins carers all offer **both methods** by default; **Pawel is pickup-only narratively** (no `CarerCareServiceConfig` — his offerings live in `Group.serviceListings`, with existing copy that says "Pickup available in Vinohrady and Žižkov").

---

## Workstream A — Discover & book a linked walk (the new picker)

Verifies the LinkedCareCallout, the renamed booking sheet, the picker, and the price-flip behaviour. This is the highest-leverage path the phase touched.

- [x] **A1. Daniel → `/meets/meet-klara-stromovka?as=daniel`.** On the Stromovka walk detail (Details tab), the linked-care callout reads:
  - Heading: **"Have Klára walk your dog"**
  - Subtitle: **"Klára takes your dog on this walk. You don't come along."** *(no "Drop-off — " prefix)*
  - One price row: **"From 300 Kč"** + caret — the floor of the two delivery options; the picker inside the booking sheet is where the choice happens.
  - Below: the free **Interested / Invite** RSVP row is still there — book ≠ attend intact.

- [x] **A2. Daniel → tap the callout.** The booking sheet opens with title **"Book a walk"** (not "Book a drop-off walk"). The top of the sheet shows:
  - Carer + dog summary, "Walks & Check-ins · you don't come along," current price **380 Kč**.
  - **"Pickup or drop-off?"** picker — a compact two-segment bar (canonical `MultiSelectSegmentBar`, neutral active state, same pattern as Available times / day-of-week filters). **Pickup pre-selected**, label + price subline ("Pickup / 380 Kč") on the left, ("Drop-off / 300 Kč") on the right.
  - Helper line below the bar names the choice: *"Klára comes to {your-name}'s address."*
  - Date picker below (6 upcoming Wednesdays).

- [x] **A3. Tap Drop-off in the picker.** Active highlight slides to the right segment; top-right service price flips **380 → 300 Kč**; helper line updates to *"Bring {dog} to Stromovka at the start."*; footer CTA flips to **"Book — 300 Kč"**.

- [ ] **A4. Pick a date + tap Book.** Confirmation screen shows:
  - "Klára walks Bára — {date}"
  - A sentence naming the method ("Bring Bára to Stromovka at the start of the walk." or pickup variant)
  - **"Drop-off · 300 Kč · paid on the day"** (or pickup variant if you switched back)
  - Tap Done.

- [ ] **A5. After A4, return to `/meets/meet-klara-stromovka?as=daniel`.** The date you just booked on the Upcoming dates list now shows a **"Walk booked"** pill (info-blue chrome) instead of the Skip / Join buttons. Tapping the pill routes to `/bookings/{id}`.

---

## Workstream B — Beat 2 (Klára's POV — the demo's anchor)

Verifies Beat 2's data still hangs together: the Toby pickup reads correctly across schedule + booking + carer notes.

- [ ] **B1. Klára → `/schedule?as=klara`.** Today's section shows the Toby session card with:
  - Time **9:40–11:15am**, **Weekly** chip, **Providing** tag (carer side).
  - Title **Group walk**, "Walking Toby for Filip Novotný."
  - Operational hint: **"Pick up at Holešovice"** *(was hard-coded "Pick up at owner's neighbourhood" before — now reads `Booking.delivery`)*
  - **Start session** button.

- [ ] **B2. Klára → `/bookings/booking-klara-toby?as=klara`.** The Info tab details list shows:
  - Schedule row · Price row (**380 Kč / per session**, **Billed weekly**) · Pets row (Toby) · **a new delivery row**: **"Klára picks up at the owner's address" / "Pickup"**.
  - Care instructions: **"Your notes"** (Klára's perspective) reads *"I swing by your building at 9:40 and we walk over together..."* — pickup-aware copy.

- [ ] **B3. Filip → `/bookings/booking-klara-toby?as=filip`.** Same booking, owner's perspective:
  - The same delivery row renders ("Klára picks up at the owner's address / Pickup").
  - "Your notes" is now Filip's notes (about Toby's energy + leash habits); Klára's notes attributed as **"From Klára."**
  - Price: 380 Kč / per session.

---

## Workstream C — Provider services tab (the catalogue)

Verifies the Profile Services tab shows the delivery options inline when a carer offers both.

- [ ] **C1. Anyone → `/profile/klara?tab=services` (any persona).** Klára's Walks & Check-ins card shows:
  - **"From 300 Kč / visit"** at the top right *(the "From" prefix telegraphs that 300 is the floor; pickup is higher)*.
  - Two inline rows below the sub-services chips:
    - **"Pickup — Klára comes to you · 380 Kč"** *(first)*
    - **"Drop-off — meet at the start · 300 Kč"**
  - The "Book a session" CTA stays in place.

- [ ] **C2. Anyone → `/profile/pawel?tab=services` (any persona).** Pawel has no `CarerCareServiceConfig` (legacy `Group.serviceListings` shape). The profile shouldn't show structured delivery options — the verification here is **absence of a broken card**, not presence of delivery rows. *(If you see a Services tab at all, it should render gracefully without the delivery row.)*

- [ ] **C3. Anyone → `/profile/tereza?tab=services` (any persona).** Tereza's Walks card shows **"From 200 Kč / visit"** + two inline rows (Pickup 220 / Drop-off 200) — confirms the audit-default (both methods) propagated across other carers.

---

## Workstream D — Schedule card consistency across booking shapes

Verifies that the operational hint reads `Booking.delivery` for walks but keeps the implicit-by-service rule elsewhere, AND that the one-off chip rename landed.

- [ ] **D1. Klára → `/schedule?as=klara`.** Scroll through the upcoming list:
  - The Toby walk (Today) reads **"Pick up at Holešovice"** *(walks_checkins, delivery=pickup)*.
  - Saturday/Sunday Group training session cards (Magda, Tomáš, Jana) read **"Drop off in Holešovice"** *(Meet-type training at Klára's location — implicit-by-service rule)*.
  - **One-off bookings show a chip labelled "One-off"** *(not "Drop-off" — that copy retired)*.

- [ ] **D2. Hana → `/schedule?as=hana` (or any other owner with a walks booking).** Any walks_checkins card on the Reactive dog session should still read "Drop off in Holešovice" because it's a Meet-type booking, not a walks-delivery booking. *(Confirms the delivery axis is walks-only.)*

---

## Workstream E — Two axes don't collide

Sanity check that the disambiguation actually stuck — pickup/drop-off and linked-care booking are now independent.

- [ ] **E1.** Open `/meets/meet-klara-stromovka` (any persona) and confirm:
  - The free RSVP path (Interested / Invite + Upcoming-dates Join/Skip) is intact and untouched.
  - The linked-care callout is a separate card *next to* the free path, not in front of it.
  - Nothing on the page uses the phrase "Drop-off Care" or "drop-off booking" as a label for the booking shape itself.

- [ ] **E2.** From the LinkedCareCallout, book once with **pickup** and once with **drop-off** (on different dates). Both bookings appear in `/bookings?as=<your persona>` with the same booking shape (Care booking, no roster entry) — only the `delivery` field + price differ. Confirms axis 1 (booking shape) is independent of axis 2 (delivery method).

---

## Decisions surfaced during walkthrough

A running **log** of decisions, design changes, or rationale that surface as you walk. Append as you go.

- **LinkedCareCallout shows "From {floor}" instead of listing every option.** The original landing listed pickup + drop-off with their prices on the card; that over-specced the affordance (the picker inside the modal is where the choice belongs). Card now shows "From 300 Kč" + caret when multiple options exist, single price otherwise. Picker inside the modal still pickup-defaults (380 Kč) — the price drop to 300 on drop-off select is the Q3 happy-surprise mechanic. → `features/explore-and-care.md` (W4.1 description)
- **Delivery picker uses canonical `MultiSelectSegmentBar` instead of bespoke two-card layout.** The original landing was two large side-by-side cards with brand-tinted active state — too heavy for an in-modal commit picker, and the brand-green active leaked into a care (info-blue) surface. Replaced with the codebase's canonical segmented control (same component as Available times / day-of-week filters in `FilterBody`), used as single-select with `label` + `subLabel` carrying method + price. Form variant (neutral active) is appropriate for commit context vs the brand-tinted filter variant. Helper line below the bar names what the chosen method means in plain English. → no feature-doc update needed (W3.1 description in the phase board covers it)
