---
category: feature
status: built
last-reviewed: 2026-03-23
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

- **This Week / Coming Up** — upcoming meets split by time horizon
- **Your Care Bookings** (Phase 11) — active/upcoming bookings as owner, with carer avatar, service type, status badge. Links to booking detail.
- **Your Care Services** (Phase 11) — active/upcoming bookings as carer (if any), with owner avatar, service type, status badge.
- **Past** — completed meets and bookings
- **CTAs:** Create Meet, Find Care, Offer Care (all routing to correct destinations — Offer Care → `/profile?tab=services`)

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
            → "Offer Care" → `/profile?tab=services` (Phase 11)
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
