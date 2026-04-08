---
status: complete
last-reviewed: 2026-04-08
review-trigger: When any task is completed or blocked
---

# Phase 28 — Bookings Page Polish

**Goal:** Bring the Bookings page up to the same standard as Schedule (phases 25-27) — panel-tabbar, title, LayoutSection/LayoutList detail, auto-selection, booking management actions, and My Services restructure.

**Depends on:** Phase 27 (schedule layout), Phase 22 (panel architecture).

---

## Workstream A — Layout & Responsive Fixes

| Task | Description | Status |
|------|-------------|--------|
| A1 | Add `panel-tabbar` for collapsed/mobile tabs (matching Home/Schedule pattern) | done |
| A2 | Desktop: inline "Bookings" title + TabBar in single `list-panel-header` row | done |
| A3 | Wrap list content in LayoutList | done |
| A4 | Auto-select first booking on My Care tab (active > upcoming > any) | done |

## Workstream B — Detail Panel Restructure

| Task | Description | Status |
|------|-------------|--------|
| B1 | Restructure BookingDetail with LayoutSection/LayoutList (4 sections: Overview, Schedule & Pricing, Sessions, Actions) | done |
| B2 | Improve session display (upcoming vs past grouping, date + time labels) | done |
| B3 | Add booking management actions (Pause, Cancel, Leave review) | done |
| B4 | Make BookingDetail perspective-aware (owner: "with carer", carer: "for owner") | done |

## Workstream C — My Services Restructure

| Task | Description | Status |
|------|-------------|--------|
| C1 | Left panel: carer-side bookings list grouped by status (replaces ServicesTab in list) | done |
| C2 | Right panel: ServicesTab dashboard as default detail content | done |
| C3 | Right panel: show BookingDetail when a carer booking is clicked | done |
| C4 | Click handling: prevent Link navigation, fill right panel instead | done |
| C5 | Active highlight on selected booking in list | done |
| C6 | "Back to dashboard" action in carer booking detail | done |
| C7 | Verify mobile/collapsed responsive behavior | deferred — UI polish pass later |

## Workstream D — Docs

| Task | Description | Status |
|------|-------------|--------|
| D1 | Phase board + roadmap + CLAUDE.md | done |

---

## Key Decisions

- **My Services layout**: left panel = carer-side bookings, right panel = dashboard (default) or booking detail (on click). Mirrors the My Care tab pattern but with ServicesTab as the empty/default state.
- **Auto-selection**: only on My Care tab. My Services defaults to dashboard view (no booking pre-selected).
- **Perspective-aware detail**: BookingDetail takes `perspective` prop — shows other party's avatar/name, adjusts "with"/"for" label and message action.
- **Click interception**: wrapper div with `pointerEvents: "none"` on inner BookingRow/BookingListCard prevents Link navigation while allowing onClick to fill the detail panel.
- **Inline desktop header**: title + TabBar on same row in `list-panel-header` (option 1 from design discussion).
- **Session display** splits into upcoming (with time labels) and past (simpler) groups.
- **Actions** are contextual: active = Pause + Cancel, upcoming = Cancel, completed = Leave Review.
- **C7 deferred**: mobile/collapsed responsive verification deferred to a future UI polish phase.

## Files Modified

| File | Changes |
|------|---------|
| `app/bookings/page.tsx` | Full rewrite: panel-tabbar, inline title+tabs, MyServicesContent, perspective-aware BookingDetail, click interception, active highlight, back-to-dashboard |
| `app/globals.css` | Added `booking-list-item--active` style |
| `components/bookings/BookingListCard.tsx` | Used for carer-side bookings in My Services list (already had perspective prop) |
| `components/activity/ServicesTab.tsx` | Moved to detail panel (no code changes, just rendered in different location) |
| `docs/phases/phase-28-bookings-polish.md` | Phase board |
| `docs/ROADMAP.md` | Phase 28 entry |
| `CLAUDE.md` | Update current phase |
