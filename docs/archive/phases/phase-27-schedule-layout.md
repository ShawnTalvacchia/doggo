---
status: complete
last-reviewed: 2026-04-07
review-trigger: When any task is completed or blocked
---

# Phase 27 — Schedule Layout Fix + Meet Detail Extraction

**Goal:** Fix Schedule page layout issues introduced during Phase 25-26 work and extract the meet detail view into a reusable component.

**Depends on:** Phase 26 (schedule responsive fix), Phase 22 (panel architecture).

---

## Workstream A — Immediate Layout Fixes

| Task | Description | Status |
|------|-------------|--------|
| A1 | Restore "My Schedule" title in list-panel-header (matching Discover pattern) | done |
| A2 | Add `py="lg"` to all detail panel LayoutSections | done |
| A3 | Remove relic activity-mobile-actions (Create button) | done |
| A4 | Fix list-panel-filters: add surface-popout background + even padding | done |

## Workstream B — Meet Detail Extraction

| Task | Description | Status |
|------|-------------|--------|
| B1 | Create `lib/meetUtils.ts` with `getMeetRole` and `formatMeetDate` | done |
| B2 | Create `components/meets/MeetDetailPanel.tsx` (extracted from schedule page) | done |
| B3 | Replace inline meetDetailContent in schedule page with `<MeetDetailPanel>` | done |
| B4 | Update `/meets/[id]/page.tsx` to use shared `formatMeetDate` from meetUtils | done |

## Workstream C — Docs

| Task | Description | Status |
|------|-------------|--------|
| C1 | Phase board + roadmap + CLAUDE.md | done |

---

## Key Decisions

- **list-panel-filters** gets `background: var(--surface-popout)` and `padding: var(--space-sm) var(--space-md)` for even spacing
- **MeetDetailPanel** is self-contained — derives all computed values (role, counts, organizers) internally from meet prop
- **meetUtils** exports shared functions used by both schedule page and meets detail page
- **Full meets page adoption** of MeetDetailPanel deferred to a future phase (the standalone `/meets/[id]` page has significantly different layout and features like group chat, post-meet reveal)

## Files Modified

| File | Changes |
|------|---------|
| `app/schedule/page.tsx` | Restored title, fixed padding, removed Create button, replaced inline detail with MeetDetailPanel |
| `app/meets/[id]/page.tsx` | Imported `formatMeetDate` from shared utils |
| `app/globals.css` | Added surface-popout + even padding to `.list-panel-filters` |
| `lib/meetUtils.ts` | New — `getMeetRole`, `formatMeetDate` |
| `components/meets/MeetDetailPanel.tsx` | New — extracted meet detail panel component |
