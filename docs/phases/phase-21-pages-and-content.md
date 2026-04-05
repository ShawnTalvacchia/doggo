---
category: phase
status: active
last-reviewed: 2026-04-05
tags: [phase-21, pages, content, layout, discover, groups, bookings, notifications]
review-trigger: "when completing workstreams or closing this phase"
---

# Phase 21 — Pages & Content Build-out

**Goal:** Flesh out the inner content across all app pages. Bring remaining pages into the shared layout system. Add filtering, group detail content, and interactive elements that make the prototype feel alive. Hold off on mock data overhaul and demo welcome page for a later phase.

**Depends on:** Phase 20 (docs aligned, dead code removed, layout system proven across Home + Discover)

---

## Current State (audit summary)

| Page | Layout | Content | Gaps |
|------|--------|---------|------|
| Home | MasterDetailShell | ✅ Full | — |
| Discover Hub | DiscoverShell | ✅ Full | — |
| Discover / Care | DiscoverShell | ✅ Interactive filters | — |
| Discover / Meets | DiscoverShell | ⚠️ Hub-only | Type cards were static — now has filter panel (21a in progress) |
| Discover / Groups | DiscoverShell | ⚠️ Hub-only | Type cards are static (no filter panel on selection), no map |
| Schedule | MasterDetailShell | ✅ Full | — |
| Bookings | Custom TabBar | ⚠️ Partial | Not using MasterDetailShell; Services tab delegated to component |
| Inbox | MasterDetailShell (3-panel) | ✅ Full | — |
| Profile | Custom 2-col | ✅ Full | — |
| Communities/[id] | Custom scroll | ✅ Rich | Not using shared layout — works well as-is |
| Notifications | Raw stub | ❌ Placeholder | Completely unbuilt |

---

## Workstream Overview

| Workstream | What | Effort |
|---|---|---|
| **A — Discover inner content** | Interactive filter panels for Meets and Groups, results filtering, map panels, GroupCard enrichment | High — most visible |
| **B — Layout migration** | Bookings and Notifications into MasterDetailShell | Medium |
| **C — Notifications** | Full build from stub: types, list, detail, mock data, unread badge | Medium |
| **D — Page polish** | Wire UpcomingPanel, bookings detail, schedule meet detail | Low |

---

## Workstream A — Discover Inner Content

Bring Meets and Groups discover pages up to the same interactive level as Care.

**Docs to consult:** `docs/features/meets.md`, `docs/features/explore-and-care.md`, `docs/strategy/Groups Strategy.md`, `docs/flows/meet-discovery.md`, `docs/flows/care-discovery.md` (Care pattern to follow)

### A1 — Meets: filter panel ✓

When a meet type is selected via `?type=walk` etc., show an interactive filter panel matching the Care pattern. Filters: day picker (MultiSelectSegmentBar), energy level, leash rule, dog size, max group size (Slider), and type-specific preferences accordion (walk: pace/distance/terrain, park: amenities/vibe, playdate: age/style, training: skills/experience/trainer).

**Files:** `app/discover/meets/page.tsx`
**Components used:** MultiSelectSegmentBar, Slider, CheckboxRow, accordion pattern

### A2 — Meets: mobile tab view ✓

Enable `mobileShowResults` when a meet type is selected so mobile gets Results/Filters tab switching via DiscoverShell's TabBar.

**Files:** `app/discover/meets/page.tsx`

### A3 — Meets: results filtering ✓

Wire selected type to actually filter the results list (only show meets matching the selected type). Results should update as the type changes.

**Files:** `app/discover/meets/page.tsx`

### A4 — Groups: filter panel

When a group type is selected, show an interactive filter panel. Filters: distance/neighbourhood, member count range, activity level, dog size preference. Follow Care filter panel pattern.

**Docs:** `docs/strategy/Groups Strategy.md`, `docs/flows/groups.md`
**Files:** `app/discover/groups/page.tsx`
**Components:** MultiSelectSegmentBar, Slider, CheckboxRow

### A5 — Groups: results filtering

Wire type selection to filter the results list. Only show groups matching the selected archetype (park/community/service).

**Files:** `app/discover/groups/page.tsx`

### A6 — Groups: mobile tab view

Enable `mobileShowResults` when a group type is selected.

**Files:** `app/discover/groups/page.tsx`

### A7 — GroupCard enrichment

Ensure GroupCard shows: member count, dog count, recent activity indicator, group type badge (Park/Community/Service), neighbourhood. Check against Figma designs.

**Docs:** `docs/implementation/component-inventory.md`
**Files:** `components/groups/GroupCard.tsx`

---

## Workstream B — Layout Migration

Move remaining pages into shared layout patterns where it makes sense.

**Docs to consult:** `docs/implementation/frontend-style.md`, `docs/implementation/component-inventory.md`

### B1 — Bookings → MasterDetailShell

Wrap bookings page in MasterDetailShell with booking list (left) + booking detail (right). Keep My Care / My Services tabs. Desktop: list + detail side by side. Mobile: list view with tap-to-detail.

**Files:** `app/bookings/page.tsx`

### B2 — Notifications → MasterDetailShell

Build notifications page using MasterDetailShell. List panel shows notification items, detail panel shows full context.

**Files:** `app/notifications/page.tsx`

---

## Workstream C — Notifications Build-out

Build the notifications page from stub to functional demo.

**Docs to consult:** `docs/features/meets.md` (meet invites), `docs/features/connections.md` (connection requests), `docs/features/explore-and-care.md` (booking updates)

### C1 — Notification types and mock data

Define notification types: meet invite, connection request accepted, booking update, group activity, meet reminder, care review received. Create mock data in `lib/mockNotifications.ts` tied to existing user journeys.

**New files:** `lib/mockNotifications.ts`

### C2 — NotificationRow component

Build NotificationRow with: icon (type-specific), title, subtitle/preview, timestamp, read/unread indicator. Follow existing card patterns (like ConversationRow in Inbox).

**New files:** `components/notifications/NotificationRow.tsx`
**Docs to update:** `docs/implementation/component-inventory.md`

### C3 — Notification detail panel

Detail panel showing full notification context with action buttons (accept invite, view booking, view profile, etc.). Renders in the DetailPanel of MasterDetailShell.

**Files:** `app/notifications/page.tsx`

### C4 — Unread badge on bell icon

Wire notification count to AppNav bell icon. Show badge count on both mobile header and desktop sidebar.

**Files:** `components/layout/AppNav.tsx`, `components/layout/Sidebar.tsx`

---

## Workstream D — Page Polish

Smaller improvements across existing pages.

### D1 — Wire UpcomingPanel into home

Connect `components/home/UpcomingPanel.tsx` into the home page. Currently built but not imported by any page.

**Files:** `app/home/page.tsx`, `components/home/UpcomingPanel.tsx`

### D2 — Bookings detail view

Add booking detail panel showing provider info, service type, schedule, status, and action buttons (message, cancel, reschedule).

**Files:** `app/bookings/page.tsx`

### D3 — Schedule meet detail enrichment

Enhance the detail panel in schedule page with richer meet info (description, attendees, what to bring, map preview).

**Files:** `app/schedule/page.tsx`

---

## Implementation Order

1. **21a** — Discover Meets filter panel + mobile tabs (A1, A2, A3) — highest impact
2. **21b** — Discover Groups filter + results + mobile tabs (A4, A5, A6, A7)
3. **21c** — Notifications build-out (C1, C2, C3, C4 + B2)
4. **21d** — Bookings layout (B1, D2)
5. **21e** — Page polish (D1, D3) — as time allows

---

## Out of Scope (deferred)

- Mock data overhaul (full user journey data) — future phase
- Demo welcome page (entry point for demo sessions) — future phase
- Real-time messaging / live chat — future phase
- Backend persistence (profile edits, booking management) — future phase
- Landing page refresh — future phase

---

## Verification Checklist

- [ ] Discover/Meets has interactive filter panel with type selection → filter → results
- [ ] Discover/Groups has interactive filter panel with type selection → filter → results
- [ ] Both Discover sub-pages support mobile Results/Filters tab switching
- [ ] Notifications page has list of mock notifications with detail view
- [ ] Bookings page uses MasterDetailShell layout
- [ ] All new components added to component-inventory.md
- [ ] Affected feature docs updated (meets.md, explore-and-care.md)
- [ ] Affected flow docs updated (meet-discovery.md)
- [ ] Build passes clean (`npm run build`)
