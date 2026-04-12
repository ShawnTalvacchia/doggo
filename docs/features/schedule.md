---
category: feature
status: built
last-reviewed: 2026-04-13
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

- **Single-panel layout** — uses `PageColumn` (centered 640px column). Simple scrollable list with sticky filter tabs.
- **Desktop:** Centered panel (max-width 640px) with page header above
- **Mobile:** Full-width panel, page header hidden (AppNav handles title)
- **Filter tabs:** Upcoming / Interested / Care (sticky, glassmorphism background)
- **Care tab filter pills:** All / Getting Care / Providing — lets users filter care bookings by role
- **Interested tab** auto-populates from meets in the user's joined groups
- **Unified timeline** — meets and bookings merged chronologically, grouped by date headers

### Card design (CardMyMeet)

- **Role badge replaces CTA:** "Hosting" (brand bg, flag icon) / "Joining" (dark bg) / "Interested" (outline) instead of action buttons
- **Card type borders:** Meet cards have 3px brand-coloured left border. Care cards where user is provider or host have full accent border (all four sides). History cards use muted border colour.
- **Care card labels:** Action verb format — e.g. "Olga walking Spot" — showing provider, service, and dog name.
- **Tag badge variants:** Hosting cards use solid brand background tag. Providing cards use solid info-main background with "Providing" text. Standard joining/booked tags use default styles.
- **Care card details:** Sub-service names (e.g. "30-min walk"), recurring day chips, and provider/owner role badges ("Providing" / "Booked") on care cards.
- **Redundant elements removed:** "Upcoming" status badge hidden when already on Upcoming tab. "Book a spot" CTA hidden when user is already joining/hosting.
- **5 attendee avatars** (vs 3 in Discover) — you care who's coming
- **Stronger date emphasis** — semi-bold time formatting in upcoming view
- **History variant:** muted background (surface-inset), past-tense badges ("Hosted" / "Attended" / "Interested")
- **No star icon** — you're already committed. Share retained.

### Key decisions

- **Unified timeline.** Meets and care bookings appear together, sorted by date. BookingBlock renders bookings inline alongside CardMyMeet cards. Recurring bookings use rolling weekly billing — only one upcoming session shown at a time.
- **Single-panel layout.** Schedule is a simple scrollable list using PageColumn. Tapping a card navigates to the meet/booking detail page.
- **Upcoming / Interested / Care filters.** Replaces the Upcoming/History toggle and type pills. "Upcoming" shows meets you've RSVP'd to (joining or hosting), "Interested" shows meets you've saved/starred (auto-populated from joined groups), "Care" shows care bookings with sub-filter pills (All / Getting Care / Providing).
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
- **Page Content & Interactions:** Schedule cards redesigned — care cards show action verb labels, provider/host cards get full accent borders, tag badges inverted for hosting (solid brand) and providing (solid info-main). Care tab gains filter pills (All / Getting Care / Providing). Interested tab auto-populates from joined groups. Mock data dates updated to April 2026.

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
