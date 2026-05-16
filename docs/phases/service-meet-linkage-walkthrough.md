---
status: active
last-reviewed: 2026-05-16
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Service ↔ Meet Linkage — Walkthrough

Verification checklist for the Service ↔ Meet Linkage phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, Open Questions §13, or feature docs. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom.

**Scope rule.** Walkthroughs verify the **phase thesis** — here: services and meets are independent entities that link, the carer authors all service kinds in one place, and booking routes through one flow. Not edge cases or cross-persona permutations.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

**Phase-specific seed context:**
- **Klára now demos all three service kinds.** Care: *Walks & Check-ins* (300 Kč). Meet: *Group training session* (350 Kč), *Reactive dog session* (600 Kč), *Puppy basics* (400 Kč). Appointment: *1-on-1 training session* (800 Kč).
- `klara-1on1` was **reclassified** Meet → Appointment in A4 (1-on-1 = solo + scheduled + no roster = Appointment, not Meet).
- **New seed meet** `meet-care-puppy-basics` ("Puppy Basics — Foundations Cohort") — a recurring weekly Klára cohort, linked to her *Puppy basics* service.
- **Tereza** gained a Meet-type *Group walk* service (200 Kč) linked to `meet-15` ("Thursday morning — Riegrovy sady") with `required: false` — the optional-link / mixed-roster demo case.
- Klára's *Group training* (`meet-care-1`) and *Reactive dog session* (`meet-care-workshop-1`) are **required-link** meets (`required: true`).

**Status:** Workstreams A + B + A5 walkable now. C/D/E/F/G land in later passes — their items are appended here as they ship.

---

## Workstream A — Data model + mock migration

The foundation: `seriesMeetId` → `linkedMeetIds[]` (one-to-many), the inverse `Meet.linkedServices[]`, and Klára/Tereza mock data. Verified through the surfaces that read the migrated data.

- [ ] **A1. Klára → `/profile?tab=services`.** Her Services tab renders without errors — the `seriesMeetId → linkedMeetIds` migration didn't break view-mode rendering. Five service cards total.
- [x] **A2. Klára → `/meets/meet-care-1`.** The group-training meet detail page still renders cleanly — adding the `linkedServices` field to the meet didn't break the meet-detail surface.
- [ ] **A3. `klara-1on1` is now an Appointment.** On Klára's Services tab, *1-on-1 training session* renders as an **Appointment** card — price reads **"800 Kč / appointment"**, a **"Training visit"** chip, *not* a session/cadence card. (It was a Meet-type entry before A4.)
- [x] **A4. New puppy-basics meet → `/meets/meet-care-puppy-basics`.** Renders "Puppy Basics — Foundations Cohort" — recurring weekly, hosted by Klára, at Stromovka, with upcoming dates and per-occurrence Book/Skip rows.
- [x] **A5. Klára's catalogue spans all three kinds.** On her Services tab: one Care service (*Walks & Check-ins*), three Meet services (*Group training*, *Reactive dog session*, *Puppy basics*), one Appointment (*1-on-1 training session*).
- [x] **A6. Tereza → `/profile?tab=services`.** Among Tereza's services, a Meet-type **"Group walk"** card appears (200 Kč / session) — the mixed-roster demo service — alongside her three Care services.

---

## Workstream B — Service authoring UI

The thesis surface: the carer authors Care + Meet + Appointment services in one Services-tab edit. The dishonest "managed separately" footnote is gone.

- [ ] **B1. Klára → `/profile?tab=services` → tap Edit.** The "Services" section lists **all** service cards in edit mode: one Care card, three "Session offering" cards, one "Appointment" card. There is **no** "managed separately" / "lands in a future phase" footnote.
- [ ] **B2. Edit mode — Meet card fields.** Each "Session offering" card has: session name, price (Kč / session), Format pills (1-on-1 / Small group / Workshop), Cadence pills (Weekly / Every 2 weeks / Monthly / By arrangement), session length (min), notes, and a "Show on your profile" toggle.
- [ ] **B3. Edit mode — linked-meets picker.** Inside a Session-offering card, an "Offered on these meets" list shows Klára's hosted meets with checkboxes. For *Group training session*, **"Calm Dog Group Session — Stromovka" is checked**; each row shows a schedule line ("Weekly · next …").
- [ ] **B4. Edit mode — per-link required toggle.** Under a *checked* meet, a "Booking required to RSVP" toggle appears. For *Group training session* → Calm Dog Group Session, it is **ON** (helper: "Only paid bookings — no free RSVP for this meet"). Toggling it off changes the helper line.
- [ ] **B5. Edit mode — Appointment card.** The *1-on-1 training session* card has: appointment name, price (Kč / appointment), Type pills (Training visit / Grooming — Training visit selected), appointment length, notes, "Show on your profile" toggle. No linked-meets picker (appointments have no roster).
- [ ] **B6. Add a service.** Below the cards: "+ Session offering" and "+ Appointment" buttons (plus per-Care-type buttons for unconfigured Care types). Tapping "+ Session offering" adds a fresh blank Session-offering card.
- [ ] **B7. Delete a service with bookings → soft-archive.** Tap the red trash on *Group training session* (its linked meet has a roster). The card collapses to a muted strip: **"Archived — existing bookings keep running"** with an **Undo** link. Undo restores the full card.
- [ ] **B8. Delete a fresh service → hard-delete.** Add a new "+ Session offering", then immediately delete it — it disappears entirely (no archived strip), since a service added this session has no bookings.
- [ ] **B9. Save persists.** Make an edit (e.g. change a price), tap Save — the page returns to view mode and the change holds. No console errors.
- [ ] **B10. View mode — B7 schedule grounding.** On Klára's Services tab (view mode), each Meet service card shows a linked-meet schedule line under the chips — e.g. *Group training session* → **"Weekly · next Tue …, 10:00 · Stromovka, Prague 7"**.
- [ ] **B11. View mode on another carer's profile → `/profile/klara`** (as Tomáš). Klára's Meet service cards show the same linked-meet schedule lines. The Meet-card CTA ("See upcoming sessions") routes to the linked meet.
- [ ] **B12. Non-carer empty state.** Daniel → `/profile?tab=services` — the "Want to offer care?" empty state still renders correctly (no regression from the editServices widening).

---

## Workstream C — Booking flow integration

One booking flow (`BookSessionSheet`) reached from two doorways — the carer's Services tab and a linked meet's detail page. Booking a session creates a real `Booking` record AND adds the owner to the meet's roster. Verify as **Tomáš** (owner, no carer profile).

- [ ] **C1. Tomáš → `/profile/klara?tab=services`.** Each of Klára's Meet-service cards (*Group training session*, *Reactive dog session*, *Puppy basics*) shows a **"Book a session"** CTA. Her Appointment (*1-on-1 training session*) shows "Ask about this" (no linked meets).
- [ ] **C2. Tap "Book a session" on *Group training session*.** A `BookSessionSheet` opens — header "Book a session", a service summary (avatar · *Group training session* · with Klára · 350 Kč), a **"Pick a session"** list of upcoming occurrences (soonest selected), an optional message field, and a "Book — 350 Kč" footer.
- [ ] **C3. Session picker.** Tap a later occurrence row — the selection moves (highlight + filled calendar icon). The list spans every linked meet's upcoming occurrences, ordered by date.
- [ ] **C4. Confirm the booking.** Tap "Book — 350 Kč" → a "You're booked" success state names the chosen date and says it's on your bookings + the meet.
- [ ] **C5. Tomáš → `/bookings`.** The session booking appears as a row under **Upcoming** — "Klára Horáčková · {dog} · Group training session · {date} · 350 Kč / session". It renders like a Care booking row (avatars, status badge).
- [ ] **C6. Tap the session-booking row.** It routes to **the linked meet** (`/meets/meet-care-1`) — not a booking-detail page. The meet IS the session detail.
- [ ] **C7. Roster updated.** On `/meets/meet-care-1`, the booked occurrence's row shows Tomáš committed (Booked) — the booking added him to the meet roster, not just a Booking record.
- [ ] **C8. Meet-detail doorway → `/meets/meet-care-1`.** Tap "Book" on an *unbooked* upcoming-dates row → the same `BookSessionSheet` opens, scoped to this meet, with **that tapped date pre-selected**.
- [ ] **C9. Required-link meet collapses free RSVP → `/meets/meet-care-1`.** There is no free "Going / Interested" RSVP dropdown — the service-card Book CTA is the only way onto the roster (required-service gate).
- [ ] **C10. Optional-link meet keeps free RSVP → `/meets/meet-15`** (Tereza's "Thursday morning — Riegrovy sady" walk). The free "Going / Interested" RSVP control IS present — the optional service link does not gate joining. *(The inline service callout itself is Workstream D2.)*

---

## Decisions surfaced during walkthrough

A running **log** of decisions, design changes, or rationale that surface during walkthrough discussion. Append as you walk; each entry carries a `→ target-doc.md` annotation for the phase-close sweep.

- **A4 reclassified `klara-1on1` Meet → Appointment.** 1-on-1 = solo + scheduled + no roster → Appointment per §13's roster test. Also gave the otherwise-empty `"training"` Appointment category its first seeded entry. → `Groups & Care Model.md` (Services as Catalog), `features/explore-and-care.md`
- **Appointment edit card built (scope addition beyond the Care+Meet board).** A4's reclassification meant `klara-1on1` would be a new "uneditable here" gap without it; user approved building `AppointmentServiceEditCard` so the catalogue is coherent across all three kinds. → `features/profiles.md`
- **B5 soft-archive uses the meet roster as the booking proxy.** `Booking` carries no `serviceId` back-reference, so "has active bookings" can't be matched precisely for Meet-type services. Proxy: a Meet service soft-archives if any linked meet has a roster (non-host attendees); a service added this session hard-deletes. → `features/profiles.md` + Open Questions §13
- **A5's optional-link service is Meet-type, not Care.** The phase board's A5 wording said "Group walk *Care* service," but only Meet-type services carry `linkedMeetIds` (A1/A6). Corrected to a `kind: "meet"` service. → no feature-doc update needed (board wording, resolved)
- **`/profile` renders a hidden 0×0 duplicate of its content under `<body>`.** Observation, not a phase decision — invisible, not a Workstream B regression (B changes were state/logic only). Flagged for a separate look; may be a dev-mode artifact. → punch list / separate investigation
- **`Booking` type extended for Meet-service bookings (C2).** `serviceType` made optional + new `meetBooking: { serviceId, serviceTitle, meetId, occurrenceDate }`. A Meet-service booking has no Care `ServiceType`; renderers branch on `meetBooking` first (`bookingServiceLabel` helper). → `features/explore-and-care.md` + Open Questions §13
- **Meet-service bookings show on `/bookings` as list rows that route to the linked meet (C).** No Care-lifecycle retrofit of the 1305-line booking-detail page — the meet IS the session detail, so the `/bookings` row's `href` is `/meets/{meetId}`. → `features/explore-and-care.md`
- **C6 required-RSVP gate folded into D1.** The required-link meets already collapse free RSVP (they carry `serviceCTA`, which the meet detail already treats as RSVP-suppressing). The clean `isMeetRequiringService`-based gate — independent of the legacy `serviceCTA` field — lands with D1's meet-card three-state chrome (C6 and D1 are the same surface). → phase board (D1)
- **Two booking sheets coexist post-C.** `BookSessionSheet` (new, linkage model) + `ServiceBookingSheet` (legacy, `serviceCTA`-bound — still used by meets that have `serviceCTA` but no resolvable linked service, e.g. Pawel's `meet-care-2`). `ServiceBookingSheet` retires when `serviceCTA` is fully removed (future cleanup, not in this phase). → no feature-doc update needed
