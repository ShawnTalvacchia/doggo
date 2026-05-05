---
status: active
last-reviewed: 2026-05-05
review-trigger: When any task is completed or blocked
---

# Sessions & Service Execution

**Goal:** After a contract signs, both sides experience a service that feels alive. Provider has a focused execution surface, owner sees the dog's care unfold, and a tangible visit report closes the loop.

**Depends on:** Pricing & Proposals (closed 2026-05-05 — proposal flow lands the owner directly on `/bookings/[id]`, so the Sessions tab is now the first post-contract surface). Meets Deep Pass (review-recent pattern reusable on the care side). Mock World Building (rich care data on Daniel ↔ Klára + Tomáš ↔ neighbour flows).

**Refs:** [[features/schedule]], [[features/explore-and-care]], [[Competitive Research - Time To Pet]], [[Trust & Connection Model]], [[Groups & Care Model]]

---

## Opening Checklist

Walked 2026-05-05.

- [x] **Read every task and its referenced docs.** Phase board, `features/schedule.md`, `features/explore-and-care.md` (Pricing model), `Competitive Research - Time To Pet`, `Groups & Care Model.md` (Services as Catalog).
- [x] **Review Open Questions log — flag anything affecting this phase.**
  - **§3** — per-occurrence cancellation parallels meets. Booking-side handled here (Workstream F); meets-side spun out as a side task once the booking shape lands.
  - **§4** — visit report composition, real-time updates, in-session pet info. All in scope.
  - **§6 sub-questions** (ongoing-vs-one-off pricing divergence, holiday line-item granularity) — deferred. Per-session pricing is scoped OUT (see G); avoiding the surface that forces these questions.
  - **§2** — "first service-context message → auto Familiar" stays with Inbox & Notifications.
- [x] **Audit for conflicts between phase plan and current codebase.**
  - `Booking.price.lineItems` now carries engine-computed line items with `triggerNote` — V7 picked up for verification.
  - `BookingProposalCard` accepted state links to `/bookings/[id]` — Sessions tab is the first post-contract surface, raising the polish bar.
  - Mutual Connected fires on contract sign — no UI conflict.
  - `BookingSession` shape today is minimal (`date`, `status`, `checkedInAt`, `note`, `photoUrl`). Visit report needs structured additions (Workstream A1).
- [x] **Update referenced docs with `last-reviewed` older than 2 weeks.** `Competitive Research - Time To Pet.md` bumped 2026-04-14 → 2026-05-05 (re-read for opening; content + action items unchanged).
- [x] **Confirm scope.** Phase rename to *Sessions & Service Execution* (file moved). Deferred / out of scope:
  - Helper-vs-Carer rename → Onboarding & In-Product Communication
  - Live GPS streaming → post-demo / technical
  - First-message auto-Familiar → Inbox & Notifications
  - Per-service visibility (third axis) → future Trust & Privacy refinement
  - Per-occurrence meet cancellation → side task once booking shape lands

---

## Phase thesis

After a contract signs, the service comes alive. Provider executes with confidence; owner watches care unfold; the visit report makes the whole thing tangible.

**Walkthrough verification:** Daniel ↔ Klára training booking + Tomáš ↔ neighbour boarding booking, end-to-end, both sides. Items that should work but aren't core to the thesis go to `verification-checklist.md`, not phase walkthrough.

---

## Workstream A — Visit report card (provider close-out)

Core deliverable. Replaces today's stub `Complete` action with a structured close-out artifact.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | **Visit report data shape.** Extend `BookingSession` with `report?: VisitReport` where `VisitReport = { photos: string[]; notes: string; checks: { fed?: bool; watered?: bool; walked?: bool; pottied?: bool; medsGiven?: bool }; walkDistanceKm?: number; walkDurationMin?: number; completedAt: string }`. Decide required-vs-optional: photos optional (≥0), notes required (≥1 char), checks all-optional, timestamps auto. | `lib/types.ts:323`, [[Competitive Research - Time To Pet]] §1 | todo |
| A2 | **`SessionCloseOutSheet` component.** Modal sheet (reuse `PostMeetReviewSheet` skeleton + step-indicator pattern). Fields: photos uploader → notes textarea → structured checks chip row → walk metrics (conditional on service type). Footer: "Send report" primary, "Save draft" secondary. | `components/meets/PostMeetReviewSheet.tsx` (skeleton), `components/messaging/InquiryFormModal.tsx` (modal sheet pattern) | todo |
| A3 | **Sessions tab rendering — completed session card.** Visit report appears inline: photos thumbnail row (tap → lightbox), notes paragraph, structured checks as chip row with checkmark icons, walk metrics line, "Completed at HH:MM" timestamp. Same rendering on owner and provider sides. | `app/bookings/[bookingId]/page.tsx` | todo |
| A4 | **Owner Schedule indicator.** Completed care session surfaces a "Visit report" affordance on the History tab card (or review-recent on Schedule). Tap → opens booking detail Sessions tab scrolled to that session. Mirrors meets review-recent pattern. | `components/activity/MyScheduleTab.tsx`, `lib/useDismissedReviews.ts` | todo |
| A5 | **Decision: close-out does NOT trigger billing.** Billing stays rolling-weekly, decoupled from session state. Documented in `features/explore-and-care.md` under Pricing/Sessions. Reasoning: weekly cycle handles each week independently; coupling close-out to billing would break the rolling model and create UX cliffs ("if I don't close out this session, do I not get paid?"). | `features/explore-and-care.md` | todo |
| A6 | **Notification stub.** `session_completed` already exists in `NotificationType`. Fire it on close-out (consumed by Inbox & Notifications phase, not delivered here). | `lib/types.ts:404` | todo |

---

## Workstream B — Provider in-session UI

Focused execution mode while a session is `in_progress`.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | **Pet info data shape.** Extend `Dog` type with `medications?: string`, `vetContact?: string`, `emergencyContact?: string`. Backfill mock data for at least one dog per persona. | `lib/types.ts` (Dog), `lib/mockData.ts` | todo |
| B2 | **Pet info section.** Surface on booking detail Sessions tab when an active or upcoming session exists for the provider. Above the session list. Read-only on owner side, read-only on provider side (owner edits via dog profile). | `app/bookings/[bookingId]/page.tsx` | todo |
| B3 | **Active session panel.** When `session.status === "in_progress"`, both sides surface a prominent "Active now" panel. Provider: photo upload, add note, mark complete (opens A2). Owner: latest photo + status + start time. | `app/bookings/[bookingId]/page.tsx` | todo |
| B4 | **Modal vs inline decision.** Lean inline expanded card on Sessions tab (not a separate route or modal) — keeps the surface unified. Confirm at design pass. | — | todo |

---

## Workstream C — Owner session view

How the owner experiences a service unfolding.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | **Live indicator.** When a session is `in_progress`, owner-side surfaces in two places: booking detail (the active panel from B3) + Schedule card (soft pulse / "Now in progress" pill). | `components/activity/MyScheduleTab.tsx`, `app/bookings/[bookingId]/page.tsx` | todo |
| C2 | **Mid-session photo updates.** Provider can add photos to an active session before close-out; owner sees them appear on the Active panel. Photos accumulate in `report.photos`, sealed when close-out submits. | `app/bookings/[bookingId]/page.tsx` | todo |
| C3 | **Aggregate stats panel refinement.** Already exists per features doc on Info tab (sessions completed, relationship duration, next session). Audit + polish — make it feel real on Daniel ↔ Klára (training, multiple sessions) and Tomáš ↔ neighbour (boarding). | `app/bookings/[bookingId]/page.tsx` | todo |
| C4 | **Review-recent prompt.** Care review-recent surface on owner Schedule for completed-but-unreviewed care sessions. Mirrors meets pattern from F7 in Meets Deep Pass. Wires into Workstream D's review sheet. | `components/activity/MyScheduleTab.tsx`, `lib/useDismissedReviews.ts` | todo |

---

## Workstream D — Care review sheet (owner)

Owner reviews carer post-session. Closes the loop, feeds the carer's profile reviews.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | **`CareReviewSheet` component.** Modal sheet (reuse `PostMeetReviewSheet` skeleton + step indicator). | `components/meets/PostMeetReviewSheet.tsx` | todo |
| D2 | **Decisions for v1.** Single 1-5 star rating (sliced rating deferred). Free-text "what went well" — single field, optional. Photo upload (post-session dog photo) — optional. "Would book again" — boolean, defaults true. **Visibility rule:** rating + text both present → public review on carer profile; rating-only → private feedback. | [[features/explore-and-care]] | todo |
| D3 | **Wire to `mockReviews`.** Submitted review appears on carer's profile Reviews tab on next render. Use `usePersistedState` pattern (mirrors `ConnectionsContext`). Storage key: `doggo-care-reviews`. | `lib/mockReviews.ts`, `lib/usePersistedState.ts` | todo |
| D4 | **Trigger surfaces.** (a) Completed booking on Sessions tab — wire the existing "Leave a review" stub. (b) Schedule review-recent (C4). | `app/bookings/[bookingId]/page.tsx` | todo |

---

## Workstream E — Schedule polish + Care tab

P3, sub-pill cut decision, History care-side population.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | **Operational header on care cards** (was Punch List P3). Surface drop-off time + address (or "Today 8am at Stromovka") on Schedule care cards. Today the body is generic. | `components/activity/MyScheduleTab.tsx`, `components/bookings/BookingBlock.tsx` | todo |
| E2 | **Care-tab sub-pill cut.** Propose **Owner / Provider perspectives** — Daniel sees his bookings (owner pill), Klára sees hers (provider pill), users who are both see both pills. Most teaching cut now that mock data has both sides on every persona. Confirm against real care data shape during implementation. | `components/activity/MyScheduleTab.tsx`, [[features/schedule]] | todo |
| E3 | **History tab — care-side population.** Past sessions, past visit reports, reviewed-state filter. Mirrors meets History from F7 in Meets Deep Pass. | `components/activity/MyScheduleTab.tsx` | todo |
| E4 | **Review-recent badge for care.** History tab badge counts pending care reviews (mirrors meets pattern from F7). | `lib/useDismissedReviews.ts`, `components/ui/TabBar.tsx` | todo |

---

## Workstream F — Per-occurrence booking cancellation

Booking-side parallel to the meets cancellation issue. Meets-side split to a side task.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | **`Booking.cancelledDates?: Record<string, { reason: string; cancelledAt: string }>` shape.** Persists provider cancellations of specific session dates without nuking the booking. | `lib/types.ts:332` | todo |
| F2 | **Provider cancel-this-session affordance.** Sessions tab control, separate from "Complete." Captures optional reason via small prompt sheet. | `app/bookings/[bookingId]/page.tsx` | todo |
| F3 | **Schedule rendering.** Cancelled session renders muted with "Cancelled — {reason}" caption; doesn't disappear (owner needs to see what was on the calendar and why it didn't happen). | `components/activity/MyScheduleTab.tsx` | todo |
| F4 | **Cancel-vs-skip distinction.** Cancel = provider action, affects everyone (owner notified). Skip semantically applies to meets, not bookings — confirm during F2 design. | — | todo |
| F5 | **Side task spawn.** Once F1 lands, spawn a focused session for **per-occurrence cancellation on meets** (was P26 in punch list). Booking shape lands first; meets reuses the pattern. | (spawn at end of F1) | todo |

---

## Workstream G — V7 verification (light)

No new pricing work. Per-session pricing scoped OUT (avoids §6 sub-questions structurally — sessions show care content, not money).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | **Walk V7.** Booking-detail Pricing breakdown: modifier rows prefixed `+` with italic `triggerNote`; base rows keep `/ visit` / `/ night`; total matches signed proposal. Test with B5's Christmas boarding (2,400 + 720 = 3,120 Kč). Same rendering on owner and provider sides. | `app/bookings/[bookingId]/page.tsx`, `verification-checklist.md` V7 | todo |

---

## Workstream H — Notification stubs

Light wiring so Inbox & Notifications phase has events to display.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| H1 | **Add `session_started` to `NotificationType`.** Fire when provider hits Start. | `lib/types.ts:386` | todo |
| H2 | **Confirm `session_completed` fires on close-out.** Overlap with A6. | `lib/types.ts:404` | todo |
| — | Real delivery + badge dispatch deferred to Inbox & Notifications phase. | — | — |

---

## Workstream I — Tab-bar polish (small)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| I1 | **Hosted-as-Meets-pill.** Confirm "fold into Going" decision at walkthrough. Revisit only if testers ask for separate Hosted pill. | `components/activity/MyScheduleTab.tsx` | todo |
| I2 | **Notification badges on Meets/Care tabs.** Propose **History-only stays** — Meets/Care tabs don't need badges, the in-tab content is itself the signal. Confirm at walkthrough. | `components/ui/TabBar.tsx` | todo |

---

## Acceptance Criteria

Phase thesis: after a contract signs, both sides experience a service that feels alive.

- [ ] Provider can close out a session with a structured visit report (photos, notes, checks, timestamps).
- [ ] Owner sees the visit report on booking detail Sessions tab and gets a Schedule indicator for completed sessions awaiting review.
- [ ] Provider has a focused in-session UI with pet info and quick actions during an active session.
- [ ] Owner sees a live indicator + mid-session photos during an active session.
- [ ] Owner can write a care review post-completion; review feeds the carer's profile reviews.
- [ ] Per-occurrence booking cancellation works (provider cancels one session, schedule reflects it).
- [ ] Schedule care cards show operational header info (drop-off time/address).
- [ ] Care tab sub-pill cut (Owner / Provider) lands and reads cleanly across personas.
- [ ] History tab populated with care-side content + review-recent badge.
- [ ] V7 verified (booking-detail Pricing breakdown unchanged with engine line items).
- [ ] `session_started` + `session_completed` notification stubs fire on the right events.
- [ ] Walkthrough on Daniel↔Klára training booking + Tomáš↔neighbour boarding booking confirms the thesis end-to-end.

---

## Closing Checklist

Per `docs/CONTRIBUTING.md` → "Closing a Phase."

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update affected feature docs (`features/schedule.md`, `features/explore-and-care.md`)
- [ ] Update Open Questions log — close §4 visit-report items, §3 per-occurrence booking cancellation; add anything new
- [ ] Update ROADMAP — move phase out of Current Phase
- [ ] Update CLAUDE.md — current phase, key decisions, any structural changes
- [ ] Review punch list for completed items
- [ ] Archive this phase board (`git mv` to `docs/archive/phases/`, mark `status: archived`)
- [ ] Trim pass on touched docs
- [ ] **Structural audit** (per CONTRIBUTING.md 8a):
    - `grep -rl "status: archived\|status: complete" docs/phases/` should return nothing legitimate.
    - Compare filenames in `docs/phases/` vs `docs/archive/phases/` — no overlap.
    - Scan `strategy/` `features/` `implementation/` for `last-reviewed` older than 21 days.
- [ ] **Strategic review** (per CONTRIBUTING.md 9): what changed, open questions worth resolving, alternatives, research suggestions, next phase readiness.
