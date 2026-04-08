---
status: complete
last-reviewed: 2026-04-06
review-trigger: When any task is completed or blocked
---

# Phase 23 — Schedule Page & CardMeet Rebuild

**Goal:** Rebuild the My Schedule detail panel content, simplify CardMeet per the content audit, and remove old orphaned card components.

**Depends on:** Phase 22 (panel architecture — PanelBody, Spacer, LayoutList).

**References:**
- `docs/implementation/content-audit.md` — Card-Meet Redesign section
- `docs/features/schedule.md`
- `components/meets/CardMeet.tsx` — unified card component
- `app/schedule/page.tsx` — Schedule page

---

## Workstream A — Schedule Detail Panel Rebuild

Rebuild the right panel to match the design. Structure:

| Task | Description | Status |
|------|-------------|--------|
| A1 | Detail header strip: type pills + attribute chips + share/star action icons | done |
| A2 | Title + group link + description block | done |
| A3 | Attendance strip: avatar stack + "X spots left" + role badge | done |
| A4 | Logistics grid (2x2): date/time, duration, location+leash, people+spots | done |
| A5 | Participant sections: ORGANIZERS + CONFIRMED with avatar rows | done |

**Files:** `app/schedule/page.tsx`

---

## Workstream B — CardMeet Simplification

| Task | Description | Status |
|------|-------------|--------|
| B1 | Remove leash/energy attribute chips from card Row 1 | done |
| B2 | Verify variant-specific attendee text (no change expected) | done |
| B3 | Clean up dead CSS from old card components | done |

**Files:** `components/meets/CardMeet.tsx`, `app/globals.css`

---

## Workstream C — Old Component Removal

| Task | Description | Status |
|------|-------------|--------|
| C1 | Delete CardScheduleMeet, CardMyMeet, MeetCard | done |
| C2 | Delete orphaned DiscoverTab, MyScheduleTab (if no live imports) | done |

**Files:** `components/activity/`, `components/meets/MeetCard.tsx`

---

## Workstream D — Schedule List Panel Polish

| Task | Description | Status |
|------|-------------|--------|
| D1 | Header: ensure text-xl, Create button in header row | done |
| D2 | Verify search + filters match other page patterns | done |

**Files:** `app/schedule/page.tsx`

---

## Verification

- ✅ Preview at 1500px: two-panel layout, detail shows attendance strip + grid + participant sections
- ✅ CardMeet in Discover still works (type pill + status badge only)
- ✅ TypeScript compiles clean
- ✅ No imports reference deleted components
