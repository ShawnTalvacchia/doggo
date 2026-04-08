---
category: feature
status: built
last-reviewed: 2026-04-08
tags: [schedule, meets, bookings, timeline]
review-trigger: "when modifying the My Schedule page or unified timeline"
---

# My Schedule

The Schedule page (`/schedule`) is a top-level destination showing the user's personal timeline of committed meets and care bookings.

---

## Overview

My Schedule answers: **"What am I committed to this week and beyond?"**

It's one of five bottom nav tabs (Home | Discover | **My Schedule** | Bookings | Profile) and lives at `/schedule` as a standalone page. Previously this was a sub-tab within the Activities page (`/activity?tab=schedule`) — Phase 18 elevated it to top-level.

Meet discovery moved to `/discover` (Discover hub > Meets door). Care services/provider dashboard moved to `/bookings` (Bookings > My Services tab). See [[explore-and-care]] and [[meets]] for those features.

---

## My Schedule Page

### Current state

- **Route:** `/schedule` (top-level page, bottom nav tab)
- **Component:** `app/schedule/page.tsx` (imports `MyScheduleTab` from `components/activity/MyScheduleTab.tsx`)
- **Data:** `getUserMeets("shawn")` from `lib/mockMeets.ts`, plus bookings from `BookingsContext`
- **Card components:** `CardMyMeet` (role-badge variant), `BookingBlock` (compact booking row for timeline)

### Layout

- **Desktop:** Master-detail layout via `MasterDetailShell` — schedule list in the left `ListPanel`, selected meet/booking detail in the right `DetailPanel`
- **Mobile:** Single-column list; tapping an item navigates to its detail page
- **Filter tabs:** Joining / Invited / Care (replaces the previous Upcoming/History toggle + type pills)
- **Search bar** — text filter for quickly finding a specific meet or booking by name
- **Unified timeline** — meets and bookings merged chronologically within each filter tab

### Card design (CardMyMeet)

- **Role badge replaces CTA:** "Hosting" (brand bg, flag icon) / "Joining" (dark bg) / "Interested" (outline) instead of action buttons
- **Hosting distinction:** 3px left border in brand colour for hosting cards
- **5 attendee avatars** (vs 3 in Discover) — you care who's coming
- **Stronger date emphasis** — semi-bold time formatting in upcoming view
- **History variant:** muted background (surface-inset), past-tense badges ("Hosted" / "Attended" / "Interested")
- **No star icon** — you're already committed. Share retained.

### Key decisions

- **Unified timeline.** Meets and care bookings appear together, sorted by date. BookingBlock renders bookings inline alongside CardMyMeet cards.
- **Master-detail on desktop.** Schedule uses `MasterDetailShell` so users can browse the list and view detail side by side without navigating away.
- **Joining / Invited / Care filters.** Replaces the Upcoming/History toggle and type pills. "Joining" shows meets you've RSVP'd to, "Invited" shows meets you've been invited to, "Care" shows care bookings.
- **No location filter.** Unlike Discover, My Schedule shows everything you've committed to regardless of location.
- **Role context matters.** Cards indicate whether you're hosting or joining (different responsibility level).

---

---

## History

- **Phase 2:** Original `/schedule` route built as standalone page
- **Phase 11:** Care bookings section added to Schedule, owner booking actions (cancel/modify/message)
- **Phase 12:** Carer inquiry response flow, incoming requests section, BookingListCard extracted
- **Phase 14:** Schedule content extracted into `MyScheduleTab` and `BookingsTab` components under `/activity`. Old `/schedule` route redirects to `/activity`.
- **Phase 16:** "Activity" renamed to "Activities" in nav labels
- **Phase 17:** My Schedule redesigned (Upcoming/History toggle, CardMyMeet with role badges, hosting distinction, unified timeline with BookingBlock). Bookings tab renamed to Services, rebuilt as provider dashboard.
- **Phase 18:** My Schedule elevated back to top-level at `/schedule`. Discover tab moved to `/discover`. Services tab moved to `/bookings?tab=services`. `/activity` now redirects to `/discover`.
- **Phase 19:** Filters replaced with Joining / Invited / Care tabs. Master-detail layout via MasterDetailShell on desktop. Search bar added. Bottom nav gains Profile as 5th tab.

---

## Future

- **Calendar view** — visual calendar alongside the list
- **Recurring meet indicators** — visual distinction for recurring vs one-off
- **Day-of reminders** — notifications for upcoming meets and bookings
- **Carer schedule management** — availability editor, blocked times, capacity limits

---

## Related Docs

- [[meets]] — meets that populate the schedule
- [[explore-and-care]] — bookings that populate the schedule timeline
- [[Product Vision]] — navigation structure rationale
