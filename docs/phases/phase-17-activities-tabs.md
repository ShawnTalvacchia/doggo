---
category: phase
status: active
last-reviewed: 2026-03-30
tags: [phase-17, activities, schedule, bookings, cards, redesign]
review-trigger: "when modifying Activities page tabs, meet cards, or schedule/booking views"
---

# Phase 17 — Activities Tab Redesign

**Goal:** Redesign the My Schedule and Bookings tabs within the Activities page. Evolve card designs for each tab context, add Upcoming/Completed toggle to My Schedule, and ensure card differentiation across Discover, My Schedule, and Bookings.

**Depends on:** Phase 16 (layout redesign), Phase 14 (activity tab structure).

---

## Why

1. **My Schedule and Bookings tabs are functional but undesigned.** They use the same card components without adapting to their context. A user browsing available meets (Discover) has different needs than reviewing their own commitments (My Schedule).
2. **Cards should reflect context.** Discover cards answer "should I join?" — My Schedule cards answer "what am I doing and when?" — Booking cards answer "what care am I managing?" Each needs different emphasis.
3. **Upcoming/Completed toggle.** The current time-grouped sections (This Week / Coming Up / Past) work but don't match the Figma direction. A simpler toggle with filters is cleaner.

---

## Workstream A — My Schedule Tab Redesign

### A1 - Upcoming/Completed toggle

Replace the location picker area with a segmented control (Upcoming / Completed). Keep the type filter pills (All / Walks / Park Hangouts / Playdates / Training) below the toggle.

- Upcoming: shows all future meets the user is hosting, joining, or interested in
- Completed: shows past meets + past owner bookings (unified history)
- Consider: should cancelled meets appear in Completed with a visual treatment, or be hidden?

**Modified files:** `components/activity/MyScheduleTab.tsx`

### A2 - My Schedule card variant

Evolve the meet card for the "my committed meets" context. Same card skeleton as Discover (`CardScheduleMeet`), with these changes:

- **Role badge replaces CTA:** "Hosting" (with flag icon, brand accent) / "Joining" (dark fill) / "Interested" (outline) instead of "Ask to Join" / "Joining" button
- **Drop the star icon** — you're already committed. Keep share.
- **Show more attendee avatars** (4-5 instead of 3) — you care who's coming
- **Stronger date emphasis** — time is the primary info in a schedule context
- **Consider reducing vertical padding** for higher card density (schedule scanning)

Decision needed: Should this be a variant of `CardScheduleMeet` (via props) or a new `CardMyMeet` component?

**Modified/new files:** Card component, `MyScheduleTab.tsx`

### A3 - Hosting visual distinction

Cards where the user is the host should have a subtle visual differentiator beyond the badge — e.g., thin left border in brand colour, or a subtle background tint. This communicates responsibility level at a glance.

**Modified files:** Card component CSS

---

## Workstream B — Bookings Tab Polish

### B1 - Bookings tab review

Review the current BookingsTab layout and BookingListCard design. Identify any gaps or rough edges. Current sections: Your Care Bookings, Incoming Requests, Your Care Services.

### B2 - Bookings card consistency

Ensure BookingListCard follows the same visual language as the meet cards (spacing, radius, shadow, typography tokens). It doesn't need the same layout — bookings are compact rows, not full cards — but it should feel like the same design system.

**Modified files:** `components/bookings/BookingListCard.tsx`, CSS

---

## Workstream C — Cross-tab consistency

### C1 - Card differentiation audit

Verify that each tab's cards are clearly distinct in purpose:
- Discover: browsing emphasis (CTA, social proof, spots left)
- My Schedule: commitment emphasis (role badge, time, attendees)
- Bookings: management emphasis (status, other party, service type)

### C2 - Empty states

Review empty states for My Schedule (no upcoming meets) and Bookings (no bookings). Ensure CTAs route to the right places (Create Meet, Find Care).

---

## Execution Order

1. A1 — Upcoming/Completed toggle (structural change)
2. A2 — My Schedule card variant (visual change)
3. A3 — Hosting distinction (polish)
4. B1 — Bookings tab review
5. B2 — Bookings card consistency
6. C1 — Cross-tab audit
7. C2 — Empty states

---

## Verification

- [ ] My Schedule shows Upcoming/Completed toggle, defaulting to Upcoming
- [ ] Type filter pills work in both Upcoming and Completed views
- [ ] Cards show role badge (Hosting/Joining/Interested) instead of CTA
- [ ] Hosting cards have visual distinction
- [ ] Completed view shows past meets and past bookings
- [ ] Bookings tab cards follow design system tokens
- [ ] Empty states have appropriate CTAs
- [ ] Mobile and desktop layouts work correctly

---

## Out of Scope

- Discover tab changes (already redesigned in Phase 16)
- Calendar view for schedule
- Booking detail page redesign
- Real-time updates or notifications
