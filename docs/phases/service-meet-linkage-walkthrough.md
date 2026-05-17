---
status: active
last-reviewed: 2026-05-17
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
- **Tereza** offers a drop-off **"Group walk"** as a sub-service of her `walks_checkins` **Care** service. *(Config #2 was remodelled 2026-05-17 — the earlier `tereza-group-walk` Meet-type service + `meet-15` link were removed; `meet-15` is now a plain free walk. See the Decisions log + Open Q §13.)*
- Klára's *Group training* (`meet-care-1`) and *Reactive dog session* (`meet-care-workshop-1`) are **required-link** meets (`required: true`).

**Status:** Workstreams A + B + A5 walkable now. C/D/E/F/G land in later passes — their items are appended here as they ship.

---

## Workstream A — Data model + mock migration

The foundation: `seriesMeetId` → `linkedMeetIds[]` (one-to-many), the inverse `Meet.linkedServices[]`, and Klára/Tereza mock data. Verified through the surfaces that read the migrated data.

- [x] **A1. Klára → `/profile?tab=services`.** Her Services tab renders without errors — the `seriesMeetId → linkedMeetIds` migration didn't break view-mode rendering. Five service cards total.
- [x] **A2. Klára → `/meets/meet-care-1`.** The group-training meet detail page still renders cleanly — adding the `linkedServices` field to the meet didn't break the meet-detail surface.
- [x] **A3. `klara-1on1` is now an Appointment.** On Klára's Services tab, *1-on-1 training session* renders as an **Appointment** card — price reads **"800 Kč / appointment"**, a **"Training visit"** chip, *not* a session/cadence card. (It was a Meet-type entry before A4.)
- [x] **A4. New puppy-basics meet → `/meets/meet-care-puppy-basics`.** Renders "Puppy Basics — Foundations Cohort" — recurring weekly, hosted by Klára, at Stromovka, with upcoming dates and per-occurrence Book/Skip rows.
- [x] **A5. Klára's catalogue spans all three kinds.** On her Services tab: one Care service (*Walks & Check-ins*), three Meet services (*Group training*, *Reactive dog session*, *Puppy basics*), one Appointment (*1-on-1 training session*).
- [x] **A6. Tereza → `/profile?tab=services`.** ~~A Meet-type "Group walk" card appears~~ — **revised 2026-05-17** (config #2 remodel): Tereza has **three Care services**; her `walks_checkins` ("Walks & Check-ins") card carries **"Group walk"** as a sub-service chip. There is no Meet-type "Group walk" card — a drop-off group walk is Care, not Meet-type.

---

## Workstream B — Service authoring UI

The thesis surface: the carer authors Care + Meet + Appointment services in one Services-tab edit. The dishonest "managed separately" footnote is gone.

- [x] **B1. Klára → `/profile?tab=services` → tap Edit.** The "Services" section lists **all** service cards in edit mode: one Care card, three "Session offering" cards, one "Appointment" card. There is **no** "managed separately" / "lands in a future phase" footnote.
- [x] **B2. Edit mode — Meet card fields.** Each "Session offering" card has: session name, price (Kč / session), Format pills (1-on-1 / Small group / Workshop), Cadence pills (Weekly / Every 2 weeks / Monthly / By arrangement), session length (min), and notes.
- [x] **B3. Edit mode — linked-meets picker (search-and-add).** Inside a Session-offering card, "Offered on these meets" shows only the **linked** meets as rows — for *Group training session*, just **"Calm Dog Group Session — Stromovka"** (schedule line + an × to unlink). A **"+ Link a meet"** control expands a searchable list of the carer's *other* hosted meets — typing filters; tapping `+` links one. (Not a list-all checkbox list — a carer with many meets would otherwise see the full list on every session card.)
- [x] **B4. Edit mode — per-link required toggle.** Under a *linked* meet, a "Booking required to RSVP" toggle appears. For *Group training session* → Calm Dog Group Session, it is **ON** (helper: "Only paid bookings — no free RSVP for this meet"). Toggling it off changes the helper line.
- [x] **B5. Edit mode — Appointment card.** The *1-on-1 training session* card has: appointment name, price (Kč / appointment), Type pills (Training visit / Grooming — Training visit selected), appointment length, and notes. No linked-meets picker (appointments have no roster).
- [x] **B6. Add a service.** Below the cards: "+ Session offering" and "+ Appointment" buttons (plus per-Care-type buttons for unconfigured Care types). Tapping "+ Session offering" adds a fresh blank Session-offering card.
- [x] **B7. Delete a service with bookings → soft-archive.** Tap the red trash on *Group training session* (its linked meet has a roster). The card collapses to a muted strip: **"Archived — existing bookings keep running"** with an **Undo** link. Undo restores the full card.
- [x] **B8. Delete a fresh service → hard-delete.** Add a new "+ Session offering", then immediately delete it — it disappears entirely (no archived strip), since a service added this session has no bookings.
- [x] **B9. Save persists.** Make an edit (e.g. change a price), tap Save — the page returns to view mode and the change holds. No console errors.
- [x] **B10. View mode — B7 schedule grounding.** On Klára's Services tab (view mode), each Meet service card shows a linked-meet schedule line under the chips — e.g. *Group training session* → **"Weekly · next Tue …, 10:00 · Stromovka, Prague 7"**.
- [x] **B11. View mode on another carer's profile → `/profile/klara`** (as Tomáš). Klára's Meet service cards show the same linked-meet schedule lines. The Meet-card CTA ("See upcoming sessions") routes to the linked meet.
- [x] **B12. Non-carer empty state.** Daniel → `/profile?tab=services` — the "Want to offer care?" empty state still renders correctly (no regression from the editServices widening).

---

## Workstream C — Booking flow integration

One booking flow (`BookSessionSheet`) reached from two doorways — the carer's Services tab and a linked meet's detail page. Booking a session creates a real `Booking` record AND adds the owner to the meet's roster. Verify as **Tomáš** (owner, no carer profile).

- [x] **C1. Tomáš → `/profile/klara?tab=services`.** Each of Klára's Meet-service cards (*Group training session*, *Reactive dog session*, *Puppy basics*) shows a **"Book a session"** CTA. Her Appointment (*1-on-1 training session*) shows "Ask about this" (no linked meets).
- [x] **C2. Tap "Book a session" on *Group training session*.** A `BookSessionSheet` opens — header "Book a session", a service summary (avatar · *Group training session* · with Klára · 350 Kč), a **"Pick a session"** list of upcoming occurrences (soonest selected), an optional message field, and a "Book — 350 Kč" footer.
- [x] **C3. Session picker.** Tap a later occurrence row — the selection moves (highlight + filled calendar icon). The list spans every linked meet's upcoming occurrences, ordered by date.
- [x] **C4. Confirm the booking.** Tap "Book — 350 Kč" → a "You're booked" success state names the chosen date and says it's on your bookings + the meet.
- [x] **C5. Tomáš → `/bookings`.** The session booking appears as a row under **Upcoming** — "Klára Horáčková · {dog} · Group training session · {date} · 350 Kč / session". It renders like a Care booking row (avatars, status badge).
- [x] **C6. Tap the session-booking row.** It routes to **the linked meet** (`/meets/meet-care-1`) — not a booking-detail page. The meet IS the session detail.
- [x] **C7. Roster updated.** On `/meets/meet-care-1`, the booked occurrence's row shows Tomáš committed (Booked) — the booking added him to the meet roster, not just a Booking record.
- [x] **C8. Meet-detail doorway → `/meets/meet-care-1`.** Tap "Book" on an *unbooked* upcoming-dates row → the same `BookSessionSheet` opens, scoped to this meet, with **that tapped date pre-selected**.
- [x] **C9. Required-link meet — booking is the only roster path → `/meets/meet-care-1`.** In the **Upcoming dates** section, each date's primary action is **Book** (opens `BookSessionSheet`) — there is no free per-occurrence "Join". Booking is the only way onto a required-link meet's roster. *(The series-level **Interested** toggle is still shown — it's a soft series-follow, identical on every recurring meet, and is deliberately **not** gated: Interested ≠ joining the roster.)*
- [x] ~~**C10. Optional-link meet — free join stays.**~~ **Superseded 2026-05-17** (config #2 remodel — see Decisions log). `meet-15` no longer carries a linked service; it's a plain free recurring walk (covered by D3). The optional-link config (free meet + drop-off Care service, book ≠ attend) is a scheduled follow-on phase — its walkthrough items move there.

---

## Workstream D — Meet card UX

The meet detail page reads correctly for the two configurations this phase ships: **free unlinked** and **required service link**. *(The optional-link / mixed-roster config #2 was remodelled 2026-05-17 — see the Decisions log; its walkthrough items D2/D4 are superseded and move to the follow-on phase.)*

- [ ] **D1. Required-link meet → `/meets/meet-care-1`.** Reads as a paid session: "Paid session" badge, the "About this service" card with the Book CTA, no free RSVP dropdown — booking is the only path onto the roster.
- [x] ~~**D2. Optional-link callout.**~~ **Superseded 2026-05-17** — `LinkedServiceCallout` was deleted in the config #2 remodel. The corrected optional-link callout (a *drop-off Care* callout) was rebuilt as `LinkedCareCallout` — see **Workstream H** below.
- [ ] **D3. Free unlinked meet → any park walk with no linked service** (e.g. a `park-*` group meet). Normal Going / Skip / Interested — no service callout, no "Paid session" badge.
- [x] ~~**D4. Mixed-roster People tab.**~~ **Superseded 2026-05-17** — the corrected config #2 has no mixed *attendee* roster (book ≠ attend; the booked owner isn't a roster entry). See Workstream H.

---

## Workstream H — Config #2 (free meet + drop-off Care service)

Added 2026-05-17 — the corrected config #2 (see the Decisions log + Open Q §13). A free community-walk meet links a drop-off **Care** service; the owner books a carer to walk their dog *without* joining the roster. Verify as **Tomáš** on `meet-15` (Tereza's free Thursday walk, linked to her `walks_checkins` Care service).

- [ ] **H1. The callout → `/meets/meet-15`.** Below the when/where card, a **"Have Tereza walk your dog"** callout — Tereza's avatar, "Drop-off — Tereza takes your dog on this walk. You don't come along," **200 Kč**, chevron. *Below it*, the free RSVP is intact — the series **Interested** toggle + per-date **Join** rows. Two separate paths.
- [ ] **H2. Tap the callout → `DropoffBookingSheet`.** Opens "Book a drop-off walk" — summary ("Tereza walks {your dog}", "Walks & Check-ins · drop-off — you don't come along", 200 Kč), a **Pick a date** list of the meet's upcoming dates, an optional message, "Book — 200 Kč".
- [ ] **H3. Confirm the booking.** "You're booked — Tereza walks {dog} — {date}" with copy that says you don't need to come; she'll send a report after.
- [ ] **H4. Tomáš → `/bookings`.** The drop-off booking appears as a **Care** booking row (Tereza · {dog} · Walks & Check-ins · {date} · 200 Kč). Tapping it routes to the **Care booking detail** — *not* the meet (it's a Care booking, not a Meet-service booking).
- [ ] **H5. Book ≠ attend → back on `/meets/meet-15`.** Tomáš is **not** on the roster: "Who's coming" count is unchanged, and the per-date rows still show **Join** (not Joined/Booked) for him. Booking the drop-off service did not RSVP him to the walk.
- [ ] **H6. Carer-side link authoring → Tereza `/profile?tab=services` → Edit.** Her "Walks & Check-ins" Care card has an **"Offered on these meets"** section — a checkbox list of her free walk meets, with "Thursday morning — Riegrovy sady" (`meet-15`) checked. Toggling a meet + Save + re-Edit round-trips. *(Only the `walks_checkins` Care card shows this — other Care types happen at a home, not on a meet.)*

---

## Workstreams E & F — status (autonomous pass, 2026-05-16)

**Workstream F — N/A.** F assumed MeetComposer renders service-owned fields that need locking. In the actual architecture there's nothing to lock: `MeetComposer` is **create-only** (no edit-existing mode) and a `Meet` carries **no price field** — price lives on `CarerMeetServiceConfig.pricePerSession`, never on the meet. Services own price / notes / modifiers; meets own location / cadence / roster; the two never share an editable field. The ownership model F sought to enforce is already structurally clean. No surface to build. *(Logged for review.)*

**Workstream E — partially done, rest deferred for review.**
- [ ] **E2 (required-link price chip) → `/discover/meets`.** Service-linked meets that carry a `serviceCTA` (all required-link meets — `meet-care-1`, `meet-care-workshop-1`, `meet-care-puppy-basics`) already show a price chip on their `CardMeet` ("350 Kč · N spots left · Book this session →"). Verify this still reads correctly.
- **E1 (Meet services in `/discover/care`) — deferred.** `/discover/care` is a ~1100-line page built entirely around the four-service Care taxonomy (filter pills, `ServiceType`-keyed price resolution, sub-service accordions). Surfacing Meet-type services there is a substantial integration that needs deliberate filter/card design — not safe to land hastily. Deferred for a focused follow-up. Open Q §13 already flags the cross-surface filter-dedup question.
- **E2 (optional-link chip) — deferred.** An optional-link meet with no `serviceCTA` (e.g. `meet-15`) shows no service chip on its `CardMeet`. Adding one needs carer-resolution inside `CardMeet` (a hot list component); deferred with E1.

---

## Things to look out for (Open Q §13 build-time questions)

Per the phase board, these §13 items were watch-points during the build — note anything surprising:

- **Booking-sheet session picker** — `BookSessionSheet` uses one unified occurrence list (soonest default) for both 1-link and N-link services, rather than a dropdown/route split. Watch whether the list feels long for a service on many meets.
- **Service delete with active bookings** — soft-archive vs hard-delete uses the linked-meet **roster** as the booking proxy (`Booking` carries no `serviceId`). Watch B7/B8.
- **Meet cancellation with attached service-bookings** — not addressed this phase; the existing cancellation flow doesn't yet handle refund/reschedule for Meet-service bookings. Deferred.
- **Multi-doorway filter counts** — a required-service meet can appear in both `/discover/meets` and (once E1 lands) `/discover/care`. Result-count dedup is deferred — flag if it looks confusing.
- **Free → paid upsell** — an owner who joined a meet free can't later upgrade to the paid service in-context. Deferred; flagged so the booking sheet doesn't paint into a corner.
- **Privacy on the link** — a circle-only carer's service on a public meet: the meet stays public for free attendees; the service gates on the carer's audience. Verify on Tereza's `meet-15` (her carer profile is `connected_only`).

---

## Decisions surfaced during walkthrough

A running **log** of decisions, design changes, or rationale that surface during walkthrough discussion. Append as you walk; each entry carries a `→ target-doc.md` annotation for the phase-close sweep.

- **Config #2 built in-phase as Workstream H (2026-05-17).** After the remodel (entry below), the corrected config #2 was pulled *into* this phase rather than deferred to a follow-on — the phase is literally "Service ↔ Meet Linkage"; shipping it without a whole canonical config would leave the thesis half-done. Built + verified: `CarerCareServiceConfig` gained an optional `id` (set when meet-linked) + a `getServiceById` resolver; `meet-15` re-links Tereza's `walks_checkins` Care service (`required: false`); `LinkedCareCallout` renders a drop-off-Care callout on the meet detail, separate from the intact free RSVP; `DropoffBookingSheet` creates a Care `Booking` with **no** `setMeetRsvp`. Verified in-preview — the drop-off booking lands on `/bookings` as a Care booking (no `meetBooking`) and the meet roster count is unchanged (**book ≠ attend**). Link **authoring** shipped too (H4) — a carer-side picker: the Care service edit card has an "Offered on these meets" checkbox list of the carer's free walk meets (`CarerCareServiceConfig` gained an optional `linkedMeetIds`); profile Save flushes via `syncMeetLinksForService`. **Only deferred:** multi-carer linking (a meet host advertising *other* carers' services — needs a meet-side surface). → phase board Workstream H + Open Q §13 + ROADMAP
- **Config #2 remodelled — "Group walk" is a Care service, not Meet-type; mixed-roster reverted (2026-05-17).** A Workstream D finding that grew into a model correction. Config #2 ("Meet + optional service / mixed roster") was built on a miscategorisation: a drop-off "Group walk" (owner pays, doesn't attend) is a **Care** service per the Groups & Care routing test ("I take the dog → Care"), not Meet-type. The build had made `tereza-group-walk` a Meet-type service so it could carry `linkedMeetIds` and link to `meet-15`; booking it called `setMeetRsvp("going")`, faking roster attendance. **Corrected config #2:** a *free* meet linking drop-off **Care** services — two separate paths (free RSVP as a walker / book a carer to walk your dog), **book ≠ attend**, the booked owner is not a roster attendee. **Done now:** `tereza-group-walk` removed (folded into Tereza's existing `walks_checkins` Care service as a "Group walk" sub-service); `meet-15.linkedServices` dropped (plain free walk now); `LinkedServiceCallout.tsx` + its meet-detail branch/import deleted. Open Q §13 (correction note), `Groups & Care Model.md`, the phase board (remodel note + A5/G2/D1–D4), and this walkthrough were all corrected. **Build:** the corrected config #2 was then built **in-phase** as Workstream H — see the entry above. (Only the link-*authoring* UI + multi-carer linking remain as a follow-on.) The required-link config (#3, Klára's training) is unaffected — a paid session you attend is real. → Open Q §13 + `Groups & Care Model.md` + phase board + ROADMAP
- **A4 reclassified `klara-1on1` Meet → Appointment.** 1-on-1 = solo + scheduled + no roster → Appointment per §13's roster test. Also gave the otherwise-empty `"training"` Appointment category its first seeded entry. → `Groups & Care Model.md` (Services as Catalog), `features/explore-and-care.md`
- **Appointment edit card built (scope addition beyond the Care+Meet board).** A4's reclassification meant `klara-1on1` would be a new "uneditable here" gap without it; user approved building `AppointmentServiceEditCard` so the catalogue is coherent across all three kinds. → `features/profiles.md`
- **B5 soft-archive uses the meet roster as the booking proxy.** `Booking` carries no `serviceId` back-reference, so "has active bookings" can't be matched precisely for Meet-type services. Proxy: a Meet service soft-archives if any linked meet has a roster (non-host attendees); a service added this session hard-deletes. → `features/profiles.md` + Open Questions §13
- **A5's optional-link service is Meet-type, not Care.** The phase board's A5 wording said "Group walk *Care* service," but only Meet-type services carry `linkedMeetIds` (A1/A6). Corrected to a `kind: "meet"` service. → no feature-doc update needed (board wording, resolved)
- **`/profile` renders a hidden 0×0 duplicate of its content under `<body>`.** Observation, not a phase decision — invisible, not a Workstream B regression (B changes were state/logic only). Flagged for a separate look; may be a dev-mode artifact. → punch list / separate investigation
- **`Booking` type extended for Meet-service bookings (C2).** `serviceType` made optional + new `meetBooking: { serviceId, serviceTitle, meetId, occurrenceDate }`. A Meet-service booking has no Care `ServiceType`; renderers branch on `meetBooking` first (`bookingServiceLabel` helper). → `features/explore-and-care.md` + Open Questions §13
- **Meet-service bookings show on `/bookings` as list rows that route to the linked meet (C).** No Care-lifecycle retrofit of the 1305-line booking-detail page — the meet IS the session detail, so the `/bookings` row's `href` is `/meets/{meetId}`. → `features/explore-and-care.md`
- **C6 required-RSVP gate folded into D1.** The required-link meets already collapse free RSVP (they carry `serviceCTA`, which the meet detail already treats as RSVP-suppressing). The clean `isMeetRequiringService`-based gate — independent of the legacy `serviceCTA` field — lands with D1's meet-card three-state chrome (C6 and D1 are the same surface). → phase board (D1)
- **Two booking sheets coexist post-C.** `BookSessionSheet` (new, linkage model) + `ServiceBookingSheet` (legacy, `serviceCTA`-bound — still used by meets that have `serviceCTA` but no resolvable linked service, e.g. Pawel's `meet-care-2`). `ServiceBookingSheet` retires when `serviceCTA` is fully removed (future cleanup, not in this phase). → no feature-doc update needed
- **Meet-detail "About this service" card links to the provider's profile, not the group.** Walkthrough finding (meet-detail surface): the card's sub-link re-pointed at the Care group — but the group is already linked prominently under the meet header, so it was redundant. "About this service" is *provider* context; changed to `/profile/{providerUserId}` ("View profile →"), giving viewers a path to the provider's full service catalogue. → `features/meets.md`
- **Linked-meets picker is search-and-add, not list-all (B2/B3).** Walkthrough finding: listing every hosted meet as a checkbox row on each Meet-service card doesn't scale — a carer with 8 meets × 3 session-services = a wall of repeated rows. Reworked: the card shows only the *linked* meets; a "+ Link a meet" control expands a searchable list of the carer's other hosted meets. → `features/profiles.md`
- **Required-toggle indent restyled.** `margin-left` `--space-md` → `--space-sm`, radius `--radius-form` → `--radius-sm` — tighter nesting under the linked-meet row. → no feature-doc update needed
- **"Published" / per-service publish toggle deferred — removed from the edit cards.** It was on Meet + Appointment cards only (build-history artifact, not design) and the off-state had an unresolved implication for required-link meets (unpublishing the service removes the meet's only booking path). Per-service draft/publish is its own concern — defer until that model is designed (alongside the Meet-type pricing-modifier extension). The `enabled` field stays in the data model (soft-archive + view-mode filtering use it internally); only the user-facing toggle is gone. → Open Questions §13
- **Pricing modifiers stay Care-only (confirmed intentional).** Holiday / weekend / multi-pet / last-minute surcharges are not on Meet/Appointment cards by design — the phase board's "Not in scope" defers the auto-pricing-engine extension to Meet-type services; Meet/Appointment keep flat rates. → Open Questions §13 (already logged)
- **D2 linked-service callout (new component).** `LinkedServiceCallout` surfaces an *optional* linked Meet-type service on the meet detail page — free RSVP stays, the callout adds the paid option. Rendered for meets that link a service but have no legacy `serviceCTA`. Required-link meets keep the `serviceCTA` "About this service" card. → `features/meets.md`
- **Workstream F is N/A.** `MeetComposer` is create-only and `Meet` carries no price field — price lives on `CarerMeetServiceConfig.pricePerSession`. Services own price/notes; meets own location/cadence/roster; no shared editable field, so nothing to render read-only. The ownership split is already structurally clean. → no feature-doc update needed
- **Workstream E partially deferred (autonomous pass).** E2's required-link price chip on `/discover/meets` is already covered by the existing `CardMeet` `serviceCTA` chip. E1 (Meet services in `/discover/care`) + the optional-link chip are deferred — `/discover/care` is a Care-taxonomy-shaped page; surfacing Meet services there is a substantial follow-up needing deliberate filter design. → phase board (E) + Open Questions §13
- **C9/C10 reframed — the required-link gate is per-occurrence, not series-level.** Walkthrough finding: C9/C10 were written as if a recurring meet has a series-level "Going/Interested RSVP dropdown" that a required link suppresses. It doesn't — for *any* recurring meet the series-level control is just the **Interested** toggle (soft follow, `Meet.followers`), and joining is per-occurrence on the Upcoming-dates rows. So the required-vs-optional distinction shows up *only* on those rows: required-link → per-date **Book**; optional/free → per-date **Join** (`RecurringUpcomingDates` keys this off `meet.serviceCTA`). The Interested toggle is identical on both and correctly ungated. C9/C10 rewritten to verify the per-date rows. → walkthrough items (resolved)
- **C6 — booking sheet now skips already-booked occurrences (fixed); roster-without-Booking data gap handed off.** Walkthrough finding (Tomáš booking Klára's *Group training session*). **(1) Fixed (`49280bc`):** `BookSessionSheet`'s picker offered occurrences the viewer was already on the roster for. Each occurrence now carries `alreadyBooked`; booked ones render non-interactive with a "Booked" tag, the default selection skips to the soonest still-bookable date, and an all-booked note covers the edge case. **(2) Open data gap — for the Demo Narrative & Personas phase:** Tomáš sits on `meet-care-1`'s May 20 roster but has **no backing `Booking` record**, so the session never appears on `/bookings`. Mechanism — `seedRecurringAttendeesByDate` (`mockMeets.ts`) spreads a recurring meet's base `attendees` across its next occurrences but only writes rosters, never `Booking`s. `meet-care-1` is a `required`-link meet (paid-only roster), so by the linkage model every non-creator attendee *should* have a matching `Booking`. Fix = seed `Booking` records for the pre-seeded roster members of every `required`-link meet (`meet-care-1`, `meet-care-workshop-1`, `meet-care-puppy-basics`) — a mock-world data sweep. Not done here: `mockMeets.ts` is a flagged danger file and that roster is authored/owned by the Demo Narrative & Personas phase. → **Demo Narrative & Personas phase (W3 — mock-world data adjustments)**
