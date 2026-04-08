---
status: complete
last-reviewed: 2026-04-07
review-trigger: When any task is completed or blocked
---

# Phase 26 — Schedule Responsive Fix + Care Session Detail

**Goal:** Fix Schedule page responsive breakpoints, remove relic UI, and add session-level detail for care bookings in the schedule.

**Depends on:** Phase 25 (schedule polish), Phase 22 (panel architecture).

---

## Workstream A — Responsive & Mobile Fixes

| Task | Description | Status |
|------|-------------|--------|
| A1 | Add `panel-tabbar` for collapsed/mobile tabs (matching Home pattern) | done |
| A2 | Remove "Find Care" button from mobile actions | done |
| A3 | Mobile page title via panel-tabbar tabs (no AppNav change needed) | done |
| A4 | Fix default selection: find first meet regardless of position | done |
| A5 | Merge TabBar into `list-panel-header` (remove separate filters div) | done |

## Workstream B — Care Session Detail Panel

| Task | Description | Status |
|------|-------------|--------|
| B1 | Flatten bookings into session-level items in Upcoming tab | done |
| B2 | Discriminated selection state (meet vs session) | done |
| B3 | Session detail content (info, actions, booking context) | done |
| B4 | Session row component for list panel | done |

## Workstream C — Docs

| Task | Description | Status |
|------|-------------|--------|
| C1 | Phase board + roadmap + CLAUDE.md | done |

---

## Key Decisions

- **Upcoming tab** shows both confirmed meets AND individual care sessions (flattened from booking sessions), sorted by date
- **Care tab** shows booking-level blocks (contract view) for quick access to full bookings
- **Session detail** shows session-level info with quick actions (start, complete, add note, message) and a "View full booking" link
- **panel-tabbar** pattern reused from Home — hidden on wide desktop, visible on collapsed/mobile
- **No AppNav changes** — tabs provide sufficient page context on mobile

## Session vs Contract Model

| Context | Unit | View |
|---------|------|------|
| Schedule (Upcoming) | Individual session | Session detail with quick actions |
| Schedule (Care tab) | Booking contract | Link to Bookings page |
| Bookings page | Booking contract | Full dashboard with all sessions |
