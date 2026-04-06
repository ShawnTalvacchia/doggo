---
category: phase
status: active
last-reviewed: 2026-04-06
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
| Home | MasterDetailShell | ✅ Full + UpcomingPanel | — |
| Discover Hub | DiscoverShell | ✅ Full | — |
| Discover / Care | DiscoverShell | ✅ Interactive filters | — |
| Discover / Meets | DiscoverShell | ✅ Interactive filters | Picker → Filter pattern with type-specific accordions |
| Discover / Groups | DiscoverShell | ✅ Interactive filters | Picker → Filter pattern with neighbourhood accordion |
| Schedule | MasterDetailShell | ✅ Full + enriched detail | — |
| Bookings | MasterDetailShell | ✅ Full | Migrated from Custom TabBar; detail panel with sessions |
| Inbox | MasterDetailShell (3-panel) | ✅ Full | — |
| Profile | Custom 2-col | ✅ Full | — |
| Communities/[id] | Custom scroll | ✅ Rich | Not using shared layout — works well as-is |
| Notifications | MasterDetailShell | ✅ Full | Types, list, detail, mock data, unread badge |

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

### A4 — Groups: filter panel ✓

When a group type is selected, show an interactive filter panel. Filters: visibility (MultiSelectSegmentBar, hidden for park), max members (Slider), neighbourhood accordion (7 Prague neighbourhoods). Follows Care filter panel pattern.

**Docs:** `docs/strategy/Groups Strategy.md`, `docs/flows/groups.md`
**Files:** `app/discover/groups/page.tsx`
**Components:** MultiSelectSegmentBar, Slider, CheckboxRow

### A5 — Groups: results filtering ✓

Wire type selection to filter the results list. Only show groups matching the selected archetype (park/community/service). Excludes user's own groups.

**Files:** `app/discover/groups/page.tsx`

### A6 — Groups: mobile tab view ✓

Enable `mobileShowResults` when a group type is selected.

**Files:** `app/discover/groups/page.tsx`

### A7 — GroupCard enrichment ✓

GroupCard now shows: member count, dog count, upcoming events count, group type badge (Park/Community/Hosted) with icon, visibility badge (Approval), neighbourhood.

**Docs:** `docs/implementation/component-inventory.md`
**Files:** `components/groups/GroupCard.tsx`

---

## Workstream B — Layout Migration

Move remaining pages into shared layout patterns where it makes sense.

**Docs to consult:** `docs/implementation/frontend-style.md`, `docs/implementation/component-inventory.md`

### B1 — Bookings → MasterDetailShell ✓

Bookings page migrated to MasterDetailShell. List panel has TabBar (My Care / My Services), detail panel shows provider info, service type, pets, schedule, price, sessions list with status badges, message action.

**Files:** `app/bookings/page.tsx`

### B2 — Notifications → MasterDetailShell ✓

Notifications page built using MasterDetailShell. List panel shows notification rows (unread dot, avatar, title, body, timestamp). Detail panel shows centered layout with type badge, avatar, title, body, contextual action button.

**Files:** `app/notifications/page.tsx`

---

## Workstream C — Notifications Build-out

Build the notifications page from stub to functional demo.

**Docs to consult:** `docs/features/meets.md` (meet invites), `docs/features/connections.md` (connection requests), `docs/features/explore-and-care.md` (booking updates)

### C1 — Notification types and mock data ✓

10 notifications tied to user journeys (Jana, Martin, Klára, Eva, Tereza, Tomáš). Types: meet_invite, connection_request, booking_confirmed, group_activity, meet_reminder, connection_accepted, care_review, session_completed. `getUnreadCount()` helper added.

**Files:** `lib/mockNotifications.ts`, `lib/types.ts` (NotificationType expanded)

### C2 — NotificationRow component ✓

NotificationRow built inline in notifications page: unread dot, avatar fallback to type icon, title (bold if unread), body, relative timestamp, active highlight. Follows ConversationRow pattern.

**Files:** `app/notifications/page.tsx`

### C3 — Notification detail panel ✓

Centered detail layout with avatar, type badge (TYPE_LABELS map), title, body, timestamp, contextual action button (View Meet/Profile/Group/Booking/Review/Message depending on notification type).

**Files:** `app/notifications/page.tsx`

### C4 — Unread badge on bell icon ✓

Already wired via NotificationsContext → useNotifications() → AppNav ButtonIcon `showBadge`/`badgeCount` props. No additional work needed.

**Files:** `components/layout/AppNav.tsx` (already connected)

---

## Workstream D — Page Polish

Smaller improvements across existing pages.

### D1 — Wire UpcomingPanel into home ✓

Connected UpcomingPanel as `infoPanel` on MasterDetailShell. Shows upcoming meets in a side panel on desktop.

**Files:** `app/home/page.tsx`

### D2 — Bookings detail view ✓

Booking detail panel shows: provider avatar/name, StatusBadge, service type + sub-service, pets, schedule (recurring or date range), price with billing cycle, sessions list with status badges, message CTA.

**Files:** `app/bookings/page.tsx`

### D3 — Schedule meet detail enrichment ✓

Enriched detail panel with: type badge, recurring indicator, full date/time/duration, location, group name, attendee/dog count, energy level, leash rule, description, what to bring list, accessibility notes, attendees preview (avatars + dog names), organizer info, view full details CTA.

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

- [x] Discover/Meets has interactive filter panel with type selection → filter → results
- [x] Discover/Groups has interactive filter panel with type selection → filter → results
- [x] Both Discover sub-pages support mobile Results/Filters tab switching
- [x] Notifications page has list of mock notifications with detail view
- [x] Bookings page uses MasterDetailShell layout
- [x] Unread badge wired on AppNav bell icon
- [x] UpcomingPanel wired into home page
- [x] Schedule detail panel enriched
- [x] Bookings detail panel built
- [x] All new components added to component-inventory.md
- [x] Affected feature docs updated (meets.md, explore-and-care.md)
- [x] Affected flow docs updated (meet-discovery.md, care-discovery.md)
- [x] Build passes clean (`npm run build`)
