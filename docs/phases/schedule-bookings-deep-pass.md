---
status: planned
last-reviewed: 2026-05-03
review-trigger: When opening this phase, or when adding new deferred items
---

# Schedule & Bookings Deep Pass

**Goal:** The operational backbone of the product — schedule, bookings, sessions, and care reviews — feels considered, complete, and trustworthy. Owners can review their carer; providers can close out sessions with a real visit report; both surfaces feel native to the schedule rhythm.

**Depends on:** Meets Deep Pass (done — IA scaffolding + review-recent pattern), Mock World Building (richer care data).

**Refs:** [[features/schedule]], [[features/explore-and-care]], [[Competitive Research - Time To Pet]], [[Trust & Connection Model]]

---

## Pre-loaded Scope (deferred from Meets Deep Pass — 2026-04-25)

These items were raised during the Meets Deep Pass walkthrough when designing the review-recent pattern on Schedule. The IA restructure (F-workstream) was done in Meets; the care-side flows below need real design work and were deferred here so they get treated properly rather than bolted on.

### Care review sheet (owner-facing)

When a care booking session completes, the owner gets a "Review your carer" prompt on the Upcoming review section.

Open questions:
- Star rating dimensions — single 1-5, or sliced (communication, care quality, on-time, etc.)?
- Free-text feedback structure — single field or prompted by question?
- Photo upload — does the owner add a photo of the dog post-session?
- "Would book again" — yes/no, or implicit from rating?
- How does this feed `mockReviews` / the carer's profile reviews list?
- Visibility — public reviews, or private feedback to the carer?

Reusable: `PostMeetReviewSheet`'s ModalSheet skeleton, step indicator pattern.

### Provider session close-out (visit report card)

When a provider finishes a session, they need to close it out with a visit report. Per Time To Pet research, this is a structured artifact: photos, behavioral notes, "fed/watered/walked" checks, timestamp.

Open questions:
- Required fields vs optional?
- Does close-out trigger billing? If yes, does that constrain the UX (no "skip" affordance)?
- Where does the report appear after close-out — on the booking detail Sessions tab? On the owner's Upcoming?
- Does the owner see a notification when a report is filed?
- Photo upload mechanics — same as meet photos, or different (since these are care photos)?

Probably needs its own component (`SessionCloseOutSheet` or similar). Lives in Schedule (Care tab) and possibly Bookings detail.

### Notification badge wiring beyond History

History tab badge landed in F7 (count of pending review items). Remaining open questions for this phase:
- Should Meets or Care tabs ever show badges (e.g. invites, RSVP changes from others)? Currently only History does.
- How does this interplay with the global notification surface (mobile header bell, desktop sidebar Notifications)?
- Persistence: badge state cross-device — currently localStorage-only via `useDismissedReviews`.

The `TabBar` component already supports an optional `badge` prop — wiring more tabs is just a data-flow exercise.

### Sub-pill structure for Care tab

Meets tab gets Going / Interested sub-pills in F1. Care needs an analogous sub-structure but the right cuts aren't obvious.

Candidates:
- Owner / Provider perspectives (if user is both, show both pills)
- Active / Past
- Recurring / One-off
- By service type (walking, sitting, training)

Decide during this phase, after looking at real care data shape.

### Hosted as a Meets sub-pill

F1 ships Going / Interested. "Hosted" was raised but punted — does someone hosting want a separate sub-pill, or does Hosted roll into Going (since you're definitely going to a meet you're hosting)?

Lean: Hosted rolls into Going by default, with hosting visually called out per-card (which already happens via `sched-card--providing`). Add Hosted as a third pill only if testers ask for it.

### History tab — care-side population

History tab landed in F7 with meets-only "Earlier" section. Care side (past sessions, past care reviews, past visit reports) is architected for but not populated.

Open questions:
- What does a past care card look like in the Earlier section — same `isPast` muted styling, or care-specific?
- Reviewed care reviews and provider visit reports — do they appear inline on their card, or is there a separate "view your review" affordance?
- Filtering — sub-pills under History (e.g. All / Meets / Care)?
- "Reviewed" state — once tracked, does a reviewed item leave History, stay forever, or have its own filter?

---

## Pre-loaded Scope (deferred from punch list — 2026-05-03)

Two items raised on the punch list belonging to this phase.

### Per-occurrence cancellation for recurring meets (was P26)

Today's `cancellationReason` field handles series-level / one-off cancellation, but recurring series cancel one date at a time ("this Wednesday is rained out") far more often than the whole series ends. Needs: (a) `Meet.cancelledDates?: Record<string, { reason: string; cancelledAt: string }>` shape; (b) host-side cancel-this-occurrence affordance (no UI exists today — meets get cancelled by editing mock data); (c) per-date Schedule filtering + per-date cancelled rendering on the Upcoming Dates section; (d) cancel-vs-skip distinction (cancel = host action, affects everyone; skip = user action, affects only you); (e) notification triggering for affected attendees. Booking flows have the same shape problem and should be designed alongside. Touches `lib/types.ts` (Meet shape), `app/meets/[id]/page.tsx` (RecurringUpcomingDates), `app/schedule/page.tsx` (filter), `lib/meetUtils.ts` (instance helpers). Surfaced 2026-04-27.

### Schedule care cards need header info (was P3)

Care cards on `/schedule` lack the operational header detail an owner expects — drop-off time, address, or other relevant scheduling context. Currently the card body is generic; the visible upcoming-care-session affordance needs to communicate "where am I taking the dog and when" at a glance. Surfaced 2026-04-10.

---

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.
