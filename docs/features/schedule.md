---
category: feature
status: built
last-reviewed: 2026-03-30
tags: [schedule, activities, meets, bookings]
review-trigger: "when modifying the My Schedule or Bookings tabs within the Activities page"
---

# Activities — My Schedule & Bookings

The Activities page (`/activity`) consolidates meet discovery, personal scheduling, and care bookings into a single tabbed view.

---

## Overview

Activities has three sub-tabs, accessible via query param:

| Tab | Param | Purpose |
|-----|-------|---------|
| **Discover** | `?tab=discover` | Browse all upcoming meets, filter by type and neighbourhood |
| **My Schedule** | `?tab=schedule` | Your committed meets — what you're hosting, joining, or interested in |
| **Bookings** | `?tab=bookings` | Care arrangements — owner bookings, incoming carer requests, active services |

**Why three tabs?** Meets are social; bookings are transactional. Mixing them creates cognitive load. Users looking for "when's my next walk?" shouldn't have to mentally filter past paid care sessions. My Schedule answers "what am I doing?"; Bookings answers "what care am I managing?"; Discover answers "what's available?"

---

## My Schedule Tab

**Question it answers:** "What am I committed to this week and beyond?"

### Current state

- **Route:** `/activity?tab=schedule`
- **Component:** `components/activity/MyScheduleTab.tsx`
- **Data:** `getUserMeets("shawn")` from `lib/mockMeets.ts`, plus past bookings from `BookingsContext`
- **Card component:** `MeetCard` (from `components/meets/MeetCard.tsx`)

### Sections

1. **This Week** — meets within the next 7 days
2. **Coming Up** — meets beyond this week
3. **Past** — completed meets and past owner bookings (unified history)

### Key decisions

- **Only meets in the active sections.** Active/upcoming care bookings live in the Bookings tab, not here. The one exception: past bookings appear in the Past section for a unified history view.
- **No location filter.** Unlike Discover, My Schedule shows everything you've committed to regardless of location.
- **Role context matters.** Cards should indicate whether you're hosting or joining a meet (different responsibility level).

### Planned redesign (Phase 17)

- Replace time-grouped sections with Upcoming/Completed toggle
- Keep type filter pills (All / Walks / Park Hangouts / Playdates / Training)
- Cards evolved from Discover style: same skeleton, role badge (Hosting/Joining/Interested) instead of CTA, stronger time emphasis, more attendee avatars
- See Phase 17 board for full spec

---

## Bookings Tab

**Question it answers:** "What care am I giving or receiving?"

### Current state

- **Route:** `/activity?tab=bookings`
- **Component:** `components/activity/BookingsTab.tsx`
- **Data:** `BookingsContext` filtered by `ownerId` / `carerId`
- **Card component:** `BookingListCard` (from `components/bookings/BookingListCard.tsx`)

### Sections

1. **Your Care Bookings** (as owner) — upcoming/active bookings where you receive care
2. **Incoming Requests** (as carer) — booking inquiries from conversations, no proposal sent yet
3. **Your Care Services** (as carer) — active bookings where you provide care

### CTAs

- **Find Care** → `/explore/results`
- **Offer Care** → `/profile?tab=services`

---

## History

- **Phase 2:** Original `/schedule` route built as standalone page
- **Phase 11:** Care bookings section added to Schedule, owner booking actions (cancel/modify/message)
- **Phase 12:** Carer inquiry response flow, incoming requests section, BookingListCard extracted
- **Phase 14:** Schedule content extracted into `MyScheduleTab` and `BookingsTab` components under `/activity`. Old `/schedule` route redirects to `/activity`.
- **Phase 16:** "Activity" renamed to "Activities" in nav labels

---

## Future

- **Calendar view** — visual calendar alongside the list
- **Recurring meet indicators** — visual distinction for recurring vs one-off
- **Day-of reminders** — notifications for upcoming meets and bookings
- **Carer schedule management** — availability editor, blocked times, capacity limits

---

## Related Docs

- [[meets]] — meets that populate the schedule
- [[explore-and-care]] — bookings that populate the Bookings tab
- [[Product Vision]] — Activities tab structure rationale
