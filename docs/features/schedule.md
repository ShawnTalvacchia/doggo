---
category: feature
status: built
last-reviewed: 2026-03-31
tags: [schedule, activities, meets, services]
review-trigger: "when modifying the My Schedule or Services tabs within the Activities page"
---

# Activities — My Schedule & Services

The Activities page (`/activity`) consolidates meet discovery, personal scheduling, and care services into a single tabbed view.

---

## Overview

Activities has three sub-tabs, accessible via query param:

| Tab | Param | Purpose |
|-----|-------|---------|
| **Discover** | `?tab=discover` | Browse all upcoming meets, filter by type and neighbourhood |
| **My Schedule** | `?tab=schedule` | Your committed meets + bookings in a unified timeline |
| **Services** | `?tab=services` | Provider dashboard — your care services, incoming requests, active bookings |

**Why three tabs?** Meets are social; care services are transactional. Mixing them creates cognitive load. Users looking for "when's my next walk?" shouldn't have to mentally filter past paid care sessions. My Schedule answers "what am I doing?"; Services answers "what care am I offering?"; Discover answers "what's available?"

---

## My Schedule Tab

**Question it answers:** "What am I committed to this week and beyond?"

### Current state

- **Route:** `/activity?tab=schedule`
- **Component:** `components/activity/MyScheduleTab.tsx`
- **Data:** `getUserMeets("shawn")` from `lib/mockMeets.ts`, plus bookings from `BookingsContext`
- **Card components:** `CardMyMeet` (role-badge variant), `BookingBlock` (compact booking row for timeline)

### Layout

- **Upcoming / History toggle** — segmented control at the top, defaults to Upcoming
- **Type filter pills** — All / Walks / Park Hangouts / Playdates / Training (applies to both views)
- **Unified timeline** — meets and bookings merged chronologically (upcoming: ascending, history: descending)

### Card design (CardMyMeet)

- **Role badge replaces CTA:** "Hosting" (brand bg, flag icon) / "Joining" (dark bg) / "Interested" (outline) instead of action buttons
- **Hosting distinction:** 3px left border in brand colour for hosting cards
- **5 attendee avatars** (vs 3 in Discover) — you care who's coming
- **Stronger date emphasis** — semi-bold time formatting in upcoming view
- **History variant:** muted background (surface-inset), past-tense badges ("Hosted" / "Attended" / "Interested")
- **No star icon** — you're already committed. Share retained.

### Key decisions

- **Unified timeline.** Meets and care bookings appear together, sorted by date. BookingBlock renders bookings inline alongside CardMyMeet cards.
- **No location filter.** Unlike Discover, My Schedule shows everything you've committed to regardless of location.
- **Role context matters.** Cards indicate whether you're hosting or joining (different responsibility level).

---

## Services Tab

**Question it answers:** "What care services am I offering, and what's the status of my bookings?"

### Current state

- **Route:** `/activity?tab=services`
- **Component:** `components/activity/ServicesTab.tsx`
- **Data:** `mockUser` carer config, `BookingsContext`, `ConversationsContext`

### Layout

1. **Status bar** — visibility chip ("Open to everyone" / "Connected only" / "Familiar & above") + "Accepting bookings" toggle
2. **Stats strip** — sessions completed, total earned (Kč), unique dogs cared for
3. **Your Services** — service cards showing icon, name, price, enabled/paused status, subservices, notes, Edit link
4. **Requests** — incoming booking inquiries (where user is provider)
5. **Active** — carer-perspective active bookings using BookingListCard

### Empty state

When no services configured: briefcase icon, explanatory text, CTA to set up services via profile.

### CTAs

- **Edit** (per service) → `/profile?tab=services`
- **Set up services** (empty state) → `/profile?tab=services`

---

## History

- **Phase 2:** Original `/schedule` route built as standalone page
- **Phase 11:** Care bookings section added to Schedule, owner booking actions (cancel/modify/message)
- **Phase 12:** Carer inquiry response flow, incoming requests section, BookingListCard extracted
- **Phase 14:** Schedule content extracted into `MyScheduleTab` and `BookingsTab` components under `/activity`. Old `/schedule` route redirects to `/activity`.
- **Phase 16:** "Activity" renamed to "Activities" in nav labels
- **Phase 17:** My Schedule redesigned (Upcoming/History toggle, CardMyMeet with role badges, hosting distinction, unified timeline with BookingBlock). Bookings tab renamed to Services, rebuilt as provider dashboard (visibility, stats, service cards, requests, active bookings).

---

## Future

- **Calendar view** — visual calendar alongside the list
- **Recurring meet indicators** — visual distinction for recurring vs one-off
- **Day-of reminders** — notifications for upcoming meets and bookings
- **Carer schedule management** — availability editor, blocked times, capacity limits

---

## Related Docs

- [[meets]] — meets that populate the schedule
- [[explore-and-care]] — bookings that populate the Services tab
- [[Product Vision]] — Activities tab structure rationale
