---
category: feature
status: built
last-reviewed: 2026-03-17
tags: [schedule, bookings, calendar, meets]
review-trigger: "when modifying schedule page, booking list, or calendar views"
---

# Schedule

A unified timeline of upcoming meets and care bookings — "what am I committed to?"

---

## Overview

Schedule is the third tab in the main navigation. It combines community meets and paid care in one chronological stream — because that's how your actual week works. The name "Schedule" (not "Bookings") reflects that this covers both social and transactional commitments.

---

## Current State

- **Pages:** `/schedule` (timeline view)
- **Components:** BookingRow, schedule section headers, CTAs
- **Data:** Mock bookings and meets populated in schedule
- **Status:** Built — shows upcoming meets and care bookings in timeline format

### What's displayed

- **Upcoming meets** — meets you've joined, with date/time, location, attendees preview
- **Care bookings** — as owner (your dog being cared for) or as carer (dogs you're caring for), with status
- **CTAs:** Create Meet, Find Care, Offer Care

---

## Key Decisions

1. **"Schedule" not "Bookings"** — "Bookings" is marketplace language. Schedule covers both community meets and paid care, reflecting the community-first product model.

2. **Unified timeline** — meets and bookings appear in the same chronological stream. Users don't have to check two places to know what's coming up.

3. **Owner + carer tabs** — for users who both receive and provide care, the schedule can be viewed from either perspective.

---

## User Flows

### View upcoming commitments

```
Schedule tab → See chronological list of upcoming meets + bookings
→ Tap a meet → Meet detail page
→ Tap a booking → Booking detail page
```

### Quick actions

```
Schedule tab → "Create Meet" → Meet creation flow
            → "Find Care" → Explore flow
            → "Offer Care" → Profile provider settings (future)
```

---

## Future

- **Calendar view** — visual calendar alongside the list view
- **Past activity** — history of attended meets and completed bookings
- **Recurring meet indicators** — visual distinction for recurring vs. one-off meets
- **Day-of notifications** — reminders for upcoming meets and bookings
- **Carer schedule management** — availability editor, blocked times, capacity limits

---

## Related Docs

- [[meets]] — meets that populate the schedule
- [[explore-and-care]] — bookings that populate the schedule
- [[Product Vision]] — schedule as the unified "what's next" view
