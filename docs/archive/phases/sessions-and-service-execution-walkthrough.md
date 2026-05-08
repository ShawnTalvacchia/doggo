---
status: active
last-reviewed: 2026-05-07
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Sessions & Service Execution — Walkthrough

Verification checklist for the Sessions & Service Execution phase. **This document is for checking, not record-keeping** — decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs.

**Scope rule.** Walkthroughs verify the **phase thesis** — *after a contract signs, both sides experience a service that feels alive*. Items that should work but aren't core to the thesis go in `verification-checklist.md`.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Anchor demo flows:**

| Booking | Personas | What it shows |
|---|---|---|
| `booking-klara-daniel` (recurring training, weekly Wed 10am, 5 completed + 1 upcoming) | Daniel (owner), Klára (provider) | Active session lifecycle, visit report, pet info, review loop |
| `booking-shawn-carer-tomas` (completed walks, Feb 2026) | Tomáš (owner) viewing — Shawn was carer | Owner-side review-recent prompt, leave-a-review path on a finished booking |
| `booking-tereza-walks-marek` (ongoing walks, Tue/Thu 8am, Tereza walks Marek's Benny) | **Tereza (default persona)** | GPS tracking flow — testable without any URL injection. Today's session is upcoming → Schedule quick-start affordance shows up. |
| `booking-olga-walks` (ongoing walks, Shawn↔Olga) | View as Olga (`?as=olga-m`) | Sanity check on a separate carer; alternative GPS path. |

**Pre-seeded visit reports:** `kd-5` on the Klára↔Daniel training booking + `s-olga-6` on the Olga↔Shawn walks. Use these to verify the "completed session shows visit report inline" rendering before walking the full create flow.

**Pet info backfill:** Bára (Daniel's dog) + Hugo (Tomáš's dog) carry full `vetInfo`. The PetInfoSection on a provider's booking detail Info tab should show medications / conditions / vet contact for both.

---

## Workstream A — Visit report card (provider close-out)

The artifact that closes the loop. Provider sends, owner reads.

- [x] **A1. Klára → `/bookings/booking-klara-daniel?tab=sessions` (`?as=klara`).** Sessions tab loads; **5 past sessions** + **1 upcoming**. The `kd-5` past row (April 9) renders the inline visit report: photo of Bára, multi-paragraph notes, *60 min* walk metric, "Completed at HH:MM" timestamp.
- [x] **A2. Daniel → `/bookings/booking-klara-daniel?tab=sessions` (`?as=daniel`).** Same `kd-5` row renders the **same visit report** (photo, notes, checks, metrics, timestamp). The owner and provider see one shared artifact.
- [x] **A3. Klára → upcoming session (`kd-6`) → "Start session" button.** Status flips to *In progress*. The kd-6 row **disappears from the Upcoming list** (in-progress is no longer shown there — it lives only on the Active panel above). Active panel renders at the top of the Sessions tab with: amber-pill "Active now" status, UPDATES section with three peer soft-tile buttons (Add a note · Send a photo update · Log route with GPS on walks), Notes textarea hidden behind "Add a note" button, Finish session as the only primary CTA. **Finish is always enabled** — a quiet session where nothing notable happened is valid; the owner gets a "Completed at HH:MM" record either way. A small **"Started by accident? Undo"** link sits below the button while the session is empty (covers the only real failure mode). *(Care checks chip row removed 2026-05-07 — see Open Questions §4 → "Care checks — dormant.")*
- [x] **A3.1 Quick-start from Schedule.** Klára → `/schedule?view=care` (`?as=klara`) → kd-6 card. Because kd-6 is scheduled for today, the card carries a primary **"▶ Start session"** button at the bottom. Single tap → flips status to in_progress + routes directly to `/bookings/booking-klara-daniel?tab=sessions` with the Active panel already open. Saves the carer ~3 taps on the most-frequent provider path. Affordance only renders when (a) viewer is the carer, (b) session is upcoming, (c) session.date === today.
- [x] **A4. Klára → compose updates inline on the Active panel.** Tap "Add a note" → text area expands inline with autofocus. Tap "Send a photo update" → photo lands above the structured sections. All composition happens directly on the Active panel — no modal needed. *(Care-check chip row was removed 2026-05-07; this step previously included tapping Fed/Walked/Pottied chips.)*
- [x] **A5. Klára → tap "Finish session".** Single-tap seal — no confirmation modal. The Active panel disappears; the `kd-6` row appears in the Past section as *Done*; visit report renders inline with whatever was composed (photo, notes, checks, walk metrics). If GPS was tracking, it auto-stops on Finish and the simulated km/min seal into the report. Edit-after-submission is documented on the Inbox phase board as a deferred feature; until that lands, Finish is irreversible (the Undo link covered the only real failure mode pre-Finish).
- [x] **A6. Daniel → `/bookings` (`?as=daniel`).** The Klára↔Daniel booking card on the My Care list shows a **brand-tinted "New visit report from Klára · {today's date} ›"** strip at the bottom of the card (date is dynamic — `kd-6` runs on whatever day you walk this; the strip reflects when A5 sealed). Tapping the card routes **straight to `?tab=sessions`** (skipping the Info tab) — one tap from `/bookings` to the new report. After viewing, navigate elsewhere and return to `/bookings`: indicator is gone (the visit was marked as seen). Provider side does not show this indicator (the report came from them).

---

## Workstream B — Provider in-session UI

Pet info reference + active session panel.

- [x] **B1. Klára → `/bookings/booking-klara-daniel?tab=info` (`?as=klara`).** **Pet info** section renders above the Details block (clusters with care-instruction reference data, including `ownerNotes` below). Collapsed by default — shows just Bára's avatar row (avatar + name + breed/weight/age) with a chevron at the right edge. Tap the avatar row to expand → *Medications* (Trazodone before high-stim walks), *Conditions* (mild leash reactivity, sensitive stomach), *Around dogs* (reactive note), *Vet* (Veterina Smíchov · phone). Section is **provider-only** — same URL with `?as=daniel` does NOT show this block.
- [x] **B2. Klára → `/bookings/booking-klara-daniel?tab=sessions` → tap Start on the upcoming session.** Active panel renders with the toned-down treatment: white surface, 4px amber left stripe, amber **"Active now"** pill at top, date + "started HH:MM" alongside. Layout: UPDATES section header → soft-tile button row (*Add a note* / *Send a photo update* / *Log route with GPS* on walks). Notes is collapsed behind a button (most sessions don't need them). Primary CTA at bottom: **"Finish session"** — always enabled. **"Started by accident? Undo"** link only when no artifacts have been added yet.
- [x] **B3. Klára → Active panel → "Send a photo update".** Native file picker opens. Choose any image. Photo appears in the panel as a 16:9 preview. Button label changes to "Add another photo." Tap again to add a second; the latest replaces the preview and a small **"2 photos"** badge appears in the bottom-right of the image.
- [x] **B4. Klára → fill fields inline (notes, checks, photos) → tap "Finish session".** Single-tap seal — no preview modal. Status flips to completed immediately; the row moves from Active to Past with the visit report rendered inline. Quiet sessions (nothing composed) seal cleanly with just "Completed at HH:MM."
- [x] **B5. Daniel-side mirror:** with a session in progress for Klára (use a separate browser tab on `?as=klara` to start one, then switch the other tab to `?as=daniel`), Daniel sees an Active panel with "The session is in progress. You'll get a visit report when it wraps up." copy — no composition fields, no Finish button. If Klára added photos, the latest is visible to Daniel too.
- [x] **B6. Active session banner (presence across the app).** With a session in_progress for Klára, navigate Klára away from `/bookings/booking-klara-daniel` to e.g. `/schedule` or `/discover`. **Mobile:** an amber strip appears at the top of the content area below the AppNav — pet thumbnail + "Active now · NN min" status + service-aware copy ("Sitting Bára") + chevron. Tap → returns to the booking's Sessions tab. **Desktop:** the same data appears as an amber card pinned just below the regular sidebar nav items (under Profile). Same data, different chrome per viewport. Banner / sidebar item disappears when no session is active.
- [x] **B7. GPS stub (walks only).** Default persona path: Tereza → `/bookings/booking-tereza-walks-marek?tab=sessions` (`booking-tereza-walks-marek` lives on the default persona so testers can demo this without URL injection). Today's session (`tw-marek-5`, dated `daysFromNow(0)`) is the upcoming row, also surfaces a Schedule quick-start affordance. Alternative cross-persona path for sanity: `/bookings/booking-olga-walks?tab=sessions&as=olga-m` (Olga's not on the picker, only reachable via `?as=`). Reset demo state via `/demo` if the upcoming session was already started. Tap **Start session** on the upcoming row. The Active panel renders with **"Log route with GPS"** as a third button in the UPDATES row (next to *Add a note* and *Send a photo update*) — this button is **only present on walks**, hidden on `inhome_sitting` / `boarding`. Tap it → warning-palette tracking row appears reading **"Tracking route · 0.0 km · 0 min"** with a **Stop** affordance on the right. Wait a minute (or fake-tick by mucking with the system clock) — distance + duration tick up at ~3.6 km/hr (60s = ~0.06 km, +1 min). Tap **Stop** → the warning bar is replaced in-place by a success-palette **"Walk recorded · 3.2 km · 45 min"** confirmation pill; the simulated km/min seal into `walkDistanceKm` / `walkDurationMin`; the **"Log route with GPS"** button hides (one-shot per session — see Open Questions §4 → "Multi-leg tracking" for the deferred resume case). Alternatively, tap **Finish session** while tracking is still active — GPS auto-stops on Finish and the metrics seal automatically. Either way the completed session shows the metrics inline on the visit report. *Sub-minute Start→Stop is a non-event — 0 km / 0 min won't seal, won't render, and the button stays available.*

---

## Workstream C — Owner session view

Mid-session experience + aggregate stats.

- [x] **C1. Daniel → `/bookings/booking-klara-daniel?tab=info` (`?as=daniel`).** Aggregate stats panel renders (3-up grid): *N sessions completed* / *Since DATE* / *Next session DATE*. Numbers match reality (5 completed, Feb 10 start, kd-6 next).
- [x] **C2. Daniel → `/schedule` (`?as=daniel`).** When kd-6 is upcoming and not yet started, the Schedule renders the recurring care card with normal styling. When Klára starts the session (A3), the same card on Daniel's Schedule flips to the **"Active now"** state — warning-tinted pill replaces the time, ahead of the rest of the row.
- [x] **C3. Daniel → `/bookings/booking-klara-daniel?tab=sessions` (`?as=daniel`)** during an active session. Active panel shows the latest mid-session photo Klára sent + reassuring copy ("The session is in progress. You'll get a visit report when it wraps up.") + (if walk_checkin + GPS active) an **"On the move · NN km · NN min"** pill. NO composition affordances on the owner side — no photo button, no notes, no Finish.

---

## Workstream D — Care review sheet

Owner closes the loop on a completed booking.

- [x] **D1. Tomáš → `/schedule?view=history` (`?as=tomas`).** History tab loads with a count badge on the tab pill (≥1, the unreviewed Shawn booking). At the top of the History pane, the **Review recent activity** section surfaces a care card for the completed `booking-shawn-carer-tomas`: carer name (Shawn) + service ("Solo walk") + "How was it?" copy. Footer action bar mirrors the meet review card — **Skip** (tertiary, X icon) on the left + **Review** (brand, CaretRight) on the right. "Skip all" header link clears all visible review items. *Why History (not Upcoming): past stuff lives on History; the badge calls attention to "you have something to review here."*
- [x] **D2. Tomáš → tap Review on the card.** `CareReviewSheet` opens directly — no booking-detail navigation in between. Tap-anywhere-but-Skip on the card body fires the same. *Alternative path (verify separately): from `/bookings/booking-shawn-carer-tomas`, the action row shows a "Leave a review" secondary CTA (filled star icon) next to Message; tap → same sheet. That path exists for someone who's on the booking detail for other reasons and decides to review while there.*
- [x] **D3. CareReviewSheet contents.** Heading: "How was working with Shawn?" Star row (1–5). Free-text "What went well?" textarea (optional). Photo uploader (optional). "I'd book Shawn again" toggle row, default ON. Footer: "Maybe later" + "Send review." **Send is disabled** until at least one star is selected.
- [x] **D4. Visibility hint.** With text empty: helper says *"Without text, your rating stays private feedback to Shawn."* With text typed: helper says *"This will appear on Shawn's profile."*
- [x] **D5. Submit a review.** Sheet closes. The Sessions tab action row replaces the "Leave a review" button with a muted **"⭐ Reviewed"** chip — provider has been reviewed; can't review again.
- [x] **D6. Tomáš → reload `/schedule?view=history`.** The booking-shawn-carer-tomas review-recent card is gone, History tab badge count drops by one. Persistence: state survives page reload (localStorage `doggo-care-reviews` + `doggo:dismissedReviews`).

---

## Workstream E — Schedule polish + Care tab

Schedule reads correctly across roles + states.

- [x] **E1. Daniel → `/schedule?view=care` (`?as=daniel`).** Care tab loads. Sub-pill row: *All / Getting Care / Providing*. **Getting Care** shows Daniel's owner-side bookings (the Klára training). **Providing** shows none (Daniel doesn't carer). **All** shows everything.
- [x] **E2. Klára → `/schedule?view=care` (`?as=klara`).** Same sub-pills. **Providing** shows Klára's *active* carer-side bookings — Daniel + Hana (both ongoing). **Getting Care** shows none. **All** shows everything. Filip's booking is completed (Jan–Feb) and lives on History only. Same UI both sides — semantics differ per persona.
- [x] **E3. Klára → `/schedule` (Upcoming, `?as=klara`).** Upcoming care card for the `kd-6` session renders. Below the avatar+relationship line, a small **"Drop off in Smíchov"** location hint appears (pulled from Daniel's neighbourhood — `inhome_sitting` reads as *drop-off at the carer*; for `walk_checkin` it would read *Pick up at OWNER_NEIGHBOURHOOD*).
- [x] **E4. Daniel → `/schedule?view=history` (`?as=daniel`).** History tab badge shows pending review count (≥1 if there's a recent unreviewed completed session). Past meets the user attended render in the Earlier section.
- [x] **E5. Tomáš → `/schedule?view=history` (`?as=tomas`).** Review-recent section header reads **"Review your carer"** (since Tomáš only has a care item pending — adapts to context). If a meet review item also exists, header would read "Review recent activity"; meet-only would read "Review recent meets."
- [x] **E6. Klára → `/schedule` (`?as=klara`)** during an active session. **Setup:** start Klára's upcoming Daniel-training session first if it isn't already active — fastest path is A3.1's Schedule quick-start (▶ button on the card). Don't tap Finish yet — E6 verifies the active-state rendering. *(If A5 already sealed the session, reset demo state via `/demo` to get the upcoming session back.)* With a session in `in_progress`, the recurring care card on Klára's Schedule flips to the **Active now** state — amber pill replaces the time, day-of-week + drop-off rows hide (the logistics info is stale; the session is currently being consumed). Tap-through still navigates to the booking detail.

---

## Workstream F — Per-occurrence booking cancellation

Provider cancels a single session without ending the booking.

- [x] **F1. Klára → `/bookings/booking-klara-daniel?tab=sessions` (`?as=klara`).** On the upcoming `kd-6` row, two provider buttons: **Start session** + **Cancel** (outline variant).
- [x] **F2. Klára → tap Cancel.** `CancelSessionModal` opens. Title: "Cancel this session." Body explains *cancel just the {date} session, the rest of the booking stays in place*. Reason textarea (optional). Footer: Keep session (tertiary) + Cancel session (destructive).
- [x] **F3. Klára → enter a reason → Cancel session.** Modal closes. The kd-6 row flips to *Cancelled*; status icon flips red; below the status line a small italic line shows the reason Klára typed.
- [x] **F4. Daniel → `/bookings/booking-klara-daniel?tab=sessions` (`?as=daniel`).** Same `kd-6` row renders cancelled with the reason inline. Owner sees the cancellation immediately on their side.
- [x] **F5. Daniel → `/schedule` (`?as=daniel`).** Schedule's Upcoming list shows the cancelled `kd-6` care card with a muted **"Cancelled"** pill in place of the time, line-through title, and the reason as a caption row. Card doesn't disappear — the calendar still shows what was scheduled.
- [x] **F6. Booking is still active.** The `booking-klara-daniel` booking status remains *active*; only the single occurrence got cancelled. Future occurrences are unaffected.

---

## Workstream J — Bookings list polish (`/bookings`)

The list surface where owners and carers land for their day-to-day. Role-aware structure + visual treatments tie back to the phase thesis (the loop closure surface).

- [x] **J1. Other party's name on cards.** Klára (`?as=klara`) → `/bookings`. The booking cards under My Services read **"Daniel Procházka"** (the owner) — NOT her own name. Mirrors the booking-detail header pattern: cards always show the through-line (the other party). Same view from Daniel's side reads **"Klára Horáčková"**.
- [x] **J2. Past + live card treatments.** Past bookings (status: completed/cancelled) render with a muted treatment: surface-base background, neutral left-stripe (no brand accent), text-secondary title color, slightly desaturated avatars, dim progress fill. Active-session bookings (a session in_progress on this booking) render with an amber treatment: light amber surface, amber left-stripe, retinted "Active" pill + "In progress" row + pulse dot to match the warning palette.
- [x] **J3. Single-mode for solo-role users.** Klára (`?as=klara`) lands on `/bookings` and sees **My Services content directly — no tabs**. Below the booking list, a soft upsell card reads "Need care for your dog? Find someone you trust in your community →" linking to `/discover/care`. Daniel (`?as=daniel`) lands on `/bookings` and sees **My Care content directly — no tabs**. Below: "Offer to help your neighbours? Set up a service on your profile →" linking to `/profile?tab=services`. Tabs come back when the viewer has bookings on both sides (test by switching to a persona with both — Tomáš has owner-side via `booking-shawn-carer-tomas`; if you want to verify both-tabs explicitly you'd need a persona with both kinds, which the mock world doesn't currently seed).

---

## Workstream G — V7 verification (booking-detail Pricing breakdown)

Sessions phase touches the booking detail page; this verifies the Pricing & Proposals output still renders correctly.

- [x] **G1. Shawn (`?as=shawn`) → `/bookings/booking-nikola-boarding?tab=info`.** Pricing breakdown renders the engine line items: base "Overnight boarding" row at 480 Kč / per night, modifier rows prefixed `+` with italic trigger note, total line matches signed proposal.
- [x] **G2. Provider-side parity.** View the same booking with the carer persona where possible. Same line-items, same total, same trigger notes. (Per-session pricing is **not** surfaced — that was scoped out, see [explore-and-care.md → Pricing model](../features/explore-and-care.md).)

---

## Workstream H — Notification rendering

Confirms the session-related notification types render correctly in the UI. Actual delivery (firing notifications when sessions start / finish) lands in Inbox & Notifications phase.

- [x] **H1. Open `/notifications` as the persona that has a seeded `session_completed`** (currently Daniel — `mockNotifications.ts` line 140). The notification renders with the **CheckCircle icon** and **"Care" label**. Tapping routes to the booking detail.

> `session_started` type exists in `NotificationType` and is wired in `NotificationsPanel.tsx` + `app/notifications/page.tsx`, but no mock seed fires one yet — actual delivery is Inbox & Notifications scope. Type-system check moved to verification-checklist V13.

---

## Workstream I — Tab-bar polish (decisions to confirm)

These are walkthrough decisions, not code changes — confirm the lean and adjust if testing shows otherwise.

- [x] **I1. Hosted-as-Meets sub-pill.** Current behavior: hosting-role meets fold into the *Going* sub-pill (no separate Hosted pill). Walking the Meets tab as Klára (who hosts Saturday training) should feel natural — hosted meets sit alongside joined meets without being lost. **Decision lean: keep folded.** Revisit only if a tester says "I expected a separate Hosted view."
- [x] **I2. Notification badges on Meets/Care tabs.** Current behavior: only the History tab carries a count badge. **Decision lean: keep History-only.** The in-tab content itself is the signal for Meets/Care; a count there would be noise.

---

## End-to-end walkthrough — the phase thesis

Walk this end-to-end with a fresh demo state (`/demo` → reset). It should feel like a single coherent story; if any seam jars, capture it.

- [x] **T1. Klára (`?as=klara`) → `/bookings/booking-klara-daniel?tab=sessions`.** See pet info for Bára. Start the upcoming session.
- [x] **T2. Klára → Active panel → send a photo update.** Photo lands.
- [x] **T3. Switch to Daniel (`?as=daniel`) → `/bookings/booking-klara-daniel?tab=sessions`.** Active panel shows the photo Klára sent. Reassuring "in progress" copy. Schedule reflects active state too.
- [x] **T4. Switch to Klára → fill notes + checks inline on the Active panel → tap Finish session.** Single-tap seal. Visit report saved.
- [x] **T5. Switch to Daniel.** The kd-6 row now shows Klára's full visit report inline. Aggregate stats updated (sessions completed went from 5 → 6).
- [x] **T6. Daniel → `/schedule?view=history`.** Review-recent prompt for the Klára booking surfaces (the just-completed session is reviewable; the History tab pill carries a +1 badge). Tap "Leave a review →" → CareReviewSheet → submit a 5-star with text.
- [x] **T7. Daniel → `/bookings/booking-klara-daniel?tab=info`.** Action row shows muted "⭐ Reviewed" chip.
- [x] **T8. Switch to Klára → her profile Reviews tab.** Daniel's review appears (since rating + text were both present, it landed public).

If T1–T8 reads as one coherent story — a session feels alive — the thesis is verified.

---

## Decisions surfaced during walkthrough

Emergent decisions / changes / rationale that came up during verification and need to land in their proper home docs. **Append as you walk.** **At phase close, sweep this list** — update each named doc, mark each entry `[x]`. Don't archive the walkthrough until every entry is processed (or explicitly marked "no doc update needed").

- [ ] **Visit-report "new" indicator now uses a 5-day recency window.** Reports older than 5 days don't trigger the indicator even if unviewed — pre-seeded mock reports stop false-triggering after demo reset. → `features/messaging.md` (booking conversation flow → "New visit report" indicator behavior)
- [ ] **Mock booking dates moved to relative (`daysAgo`/`daysFromNow`) instead of fixed historical dates.** kd-1 through kd-5 now use weekly cadence relative to today; kd-5's `report.completedAt` follows. Demo always reads as a live ongoing arrangement. → `implementation/mock-data-plan.md` (date strategy)
- [ ] **Cross-side role-expansion CTA on `/bookings`** moved from card-bottom to slim dismissable top banner. Persistent dismiss via `doggo-bookings-upsell-dismissed`. Aligns with "everyone-on-the-same-dial" — the role-expansion path is now actively encouraged on entry rather than buried at list end. → `features/explore-and-care.md` (Bookings list section) and possibly `strategy/Groups & Care Model.md` (Provider Tier dial reinforcement)
- [ ] **Tereza (default persona) now has dual-role bookings.** Owner-side: Olga walks Franta (recurring Tue/Thu, ongoing). Carer-side: existing Marek bookings. Triggers dual-tab UI on `/bookings` for the default persona without `?as=` trickery. → `features/demo-mode.md` (persona registry) and `implementation/mock-data-plan.md`
- [ ] **`usePersistedState` rewritten to use `useSyncExternalStore` with `getServerSnapshot`.** Eliminates SSR/CSR hydration mismatch warnings. Consumer API unchanged. → no feature-doc update needed (implementation only)
- [ ] **Demo reset (`/demo` + profile dropdown) now clears both localStorage AND the in-memory `usePersistedState` cache.** Previous behavior: localStorage cleared, but module-level cache held stale state until full page reload. Reset is now reliable without page refresh. → `features/demo-mode.md` (Reset behavior)
- [ ] **localStorage key naming inconsistency** logged as P57 in punch list (`doggo-care-reviews` vs `doggo:dismissedReviews`). Migration deferred to that punch-list item. → no feature-doc update needed (tracked in punch list)
- [ ] **Notifications full-page row redesign.** Unread indicator moved from a left-side dot column to a corner badge on the avatar (`.notif-unread-badge`). Category label moved from a third body line to a small uppercase letter-spaced tag (`.notif-cat-tag`) paired with the timestamp on the top row, separated by a `·`. Dropdown panel (`NotificationsPanel.tsx`) left at the older pattern — same updates apply if we want consistency. Surfaced when Daniel's `/notifications` walkthrough flagged the dot+avatar collision and category-as-text-continuation. → `features/messaging.md` (Notifications → Surfaces)
- [ ] **`notif-10` mock notification updated** to be Daniel-relevant (Bára's reactive dog session with Klára) and to use a relative date (`daysAgoIso(7)`). Previous version referenced Spot (Shawn's dog) and was hardcoded to a date that aged out of the visible window. → `implementation/mock-data-plan.md` (or `features/demo-mode.md` if mock notifications get documented there)
- [ ] **Avatar shape rule (Rule B): People = circle, Dogs = rounded square.** Adopted 2026-05-08 as the consistent rule across the app. Fixed visual identity per entity type rather than per-context shape. Applied immediately to Pet info section (`PetInfoSection`, bumped 36→48px) and the new `SessionsPetHeader` (64px). Codebase-wide audit logged as P58 in punch list. → `implementation/design-system.md` (avatar patterns) and possibly `features/profiles.md` (PetCard treatment)
- [ ] **Sessions tab gets a pet-as-protagonist hero.** New `SessionsPetHeader` component renders a **full-width hero photo** (rounded-panel, max-height 240px mobile / 360px desktop, aspect-preserving) of the pet at the top of the Sessions tab on `/bookings/[id]`, followed by a 28px name heading. **No supporting line** — the photo + name carry identity, and the active panel below already surfaces session state; service/cadence info lives on the Info tab. Decision principle (per 2026-05-08): for an app rooted in trust around your dog, the dog IS the experience. Hero treatment over a small avatar is a deliberate Theory-2 choice — encourages bonding, scrolling-recall across `/bookings`, and a behavioral nudge for owners to upload quality photos. Visible to both owner and provider. Multi-pet uses primary photo + name "&" join for now; full multi-pet design when a multi-pet booking lands in mock data. → `features/explore-and-care.md` (Booking detail surfaces / Sessions tab anatomy) and `strategy/Product Vision.md` if pet-as-protagonist becomes a stated principle
- [ ] **`ActiveSessionBanner` (mobile) avatar removed** — brought in line with `SidebarActiveSessionLink` (desktop). Status + service-icon + copy carry the active state; pet thumbnail was competing for attention in the slim banner format. → `features/explore-and-care.md` (Active session banner / sidebar pattern)
