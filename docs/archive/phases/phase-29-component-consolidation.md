---
status: complete
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Phase 29 — Component Consolidation & Cleanup

**Goal:** Consolidate duplicate components and patterns across the built-out pages (Home, Discover, Schedule). Reduce maintenance burden, establish shared utilities, and clean up the codebase before fleshing out remaining pages.

**Depends on:** Phase 28 (bookings polish), Phase 23 (CardMeet simplification).

---

## Workstream A — Date/Time Utils Extraction (foundation)

| Task | Description | Status |
|------|-------------|--------|
| A1 | Create `lib/dateUtils.ts` with canonical `formatMeetDateTime`, `formatMeetDate`, `formatShortDate`, `formatDateRange`, `formatCompactDateTime`, `formatRelativeTime` | done |
| A2 | Update all consumers (CardMeet, FeedUpcomingMeet, schedule, inbox, notifications, NotificationsPanel, BookingRow, bookings, messaging×6, UpcomingPanel, UpcomingStrip, MyScheduleTab, MeetDetailPanel, meets/[id]) | done |
| A3 | Clean up `lib/meetUtils.ts` — remove `formatMeetDate`, keep `getMeetRole` | done |

## Workstream B — SectionLabel Component

| Task | Description | Status |
|------|-------------|--------|
| B1 | Create `components/ui/SectionLabel.tsx` (uppercase label pattern) | done |
| B2 | Replace inline instances in schedule (2), bookings (6), MeetDetailPanel (6) | done |

## Workstream C — StatusBadge Widening

| Task | Description | Status |
|------|-------------|--------|
| C1 | Widen `StatusBadge` to accept session statuses (`in_progress`) alongside `ContractStatus` | done |
| C2 | Replace inline session status badges in schedule page + bookings page | done |

## Workstream D — Schedule Page Extraction

| Task | Description | Status |
|------|-------------|--------|
| D1 | Extract `components/schedule/SessionRow.tsx` from schedule page | done |
| D2 | Extract `components/schedule/SessionDetailContent.tsx` from schedule page | done |
| D3 | Update schedule page imports (567 → 344 lines) | done |

## Workstream E — CardMeet Consolidation

| Task | Description | Status |
|------|-------------|--------|
| E1 | Verify CardMeet covers all variant needs vs old components | done |
| E2 | Add discover-specific "spots left" logic to CardMeet | done |
| E3 | Add host RSVP signal for schedule variant | done |
| E4 | Migrate DiscoverTab from CardScheduleMeet → CardMeet variant="discover" | done |
| E5 | Migrate MyScheduleTab from CardMyMeet → CardMeet variant="schedule" | done |
| E6 | Delete dead components: MeetCard, CardScheduleMeet, CardMyMeet | done |

## Workstream F — Docs

| Task | Description | Status |
|------|-------------|--------|
| F1 | Update content-audit.md — mark consolidated items done | done |
| F2 | Update component-inventory.md | done |
| F3 | Phase board + roadmap + CLAUDE.md | done |

---

## Sequencing

```
A (dateUtils)  ──────────────────────────────────┐
                                                  │
B (SectionLabel)  ────────┐                       │
                          ├──→  D (SessionRow/    │
C (StatusBadge)  ─────────┘     SessionDetail)    │
                                                  │
A complete  ──────────────────→  E (CardMeet) ◄───┘
```

- A first (foundation for everything)
- B + C in parallel
- D after B + C
- E after A (can parallel with D)

## Key Decisions

- **FeedUpcomingMeet stays separate** — wraps in FeedCard with CTA button, fundamentally different layout from CardMeet. Refine in place, don't merge.
- **MeetCardCompact stays separate** — 200px horizontal scroll card, different layout purpose.
- **SectionLabel as standalone component** (not LayoutSection prop) — more flexible, can be used outside LayoutSection.
- **StatusBadge widened** via union type `BadgeStatus = ContractStatus | "in_progress"`, mapping `in_progress` → "In progress" label + `--active` CSS class.

## Files Overview

| Action | Files |
|--------|-------|
| Create | `lib/dateUtils.ts`, `components/ui/SectionLabel.tsx`, `components/schedule/SessionRow.tsx`, `components/schedule/SessionDetailContent.tsx` |
| Modify | `components/meets/CardMeet.tsx`, `components/ui/StatusBadge.tsx`, `app/schedule/page.tsx`, `app/bookings/page.tsx`, `app/inbox/page.tsx`, `app/notifications/page.tsx`, `components/ui/NotificationsPanel.tsx`, `components/activity/DiscoverTab.tsx`, `components/activity/MyScheduleTab.tsx`, `lib/meetUtils.ts` |
| Delete | `components/meets/MeetCard.tsx`, `components/activity/CardScheduleMeet.tsx`, `components/activity/CardMyMeet.tsx` |
