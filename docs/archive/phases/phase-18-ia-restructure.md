---
category: phase
status: complete
last-reviewed: 2026-04-04
tags: [phase-18, ia, navigation, discover, bookings, schedule, restructure]
review-trigger: "when modifying navigation, top-level routing, or page structure"
---

# Phase 18 — Information Architecture Restructure

**Goal:** Restructure the app's navigation and page hierarchy to resolve fragmentation in discovery (meets + care), booking management, and schedule access. New top-level structure: Home, Groups, Discover, Schedule, Bookings — with Inbox and Profile in the mobile header.

**Depends on:** Phase 17 (Activities tabs complete), Phase 16 (layout system)

**Reference:** `docs/strategy/Information Architecture.md`

---

## Scope Overview

This is the biggest structural change since the app was built. Breaking it into workstreams that can be built and verified incrementally.

| Workstream | What | Risk |
|------------|------|------|
| **A — Nav restructure** | New bottom nav (5 tabs), mobile top bar (Inbox + Avatar), updated sidebar | Medium — touches every page's chrome |
| **B — Discover page** | Unified `/discover` with Meets and Care tabs | Medium — merges two existing pages |
| **C — Schedule elevation** | Move MyScheduleTab to `/schedule` as top-level page | Low — mostly routing |
| **D — Bookings restructure** | `/bookings` with My Care + My Services tabs | Medium — new page, moves ServicesTab |
| **E — Detail page headers** | Back-button headers for detail pages, hide bottom nav | Low-Medium — systematic but straightforward |
| **F — Redirects & cleanup** | Old routes redirect, dead code removal | Low |
| **G — Doc updates** | Update all affected docs and flows | Low |

---

## Workstream A — Navigation Restructure

The foundation. Everything else depends on the nav being in place.

### A1 — Mobile top bar redesign

Redesign the logged-in mobile top bar. Currently shows horizontal nav links (Home, Communities, Activity, Find Care) + icon row. New design:

```
[DOGGO logo]                    [Inbox 🔴] [Avatar]
```

- DOGGO logo links to `/home` (Poppins Black, matches sidebar)
- Inbox icon: `ChatCircleDots` (light weight), links to `/inbox`, shows unread count badge
- Avatar: current user's photo, links to `/profile`, circular, ~28px
- Top bar visible on hub pages only
- Remove the horizontal nav links (desktop has sidebar, mobile has bottom nav)

**Modified files:** `components/layout/AppNav.tsx`, `app/globals.css`

### A2 — Bottom nav update

Update bottom nav from current 5 tabs to new 5 tabs:

| Current | New |
|---------|-----|
| Home | Home |
| Groups | Groups |
| Activities | Discover |
| Inbox | My Schedule |
| Profile | Bookings |

- Discover: `MagnifyingGlass`
- My Schedule: `CalendarDots` (reuse from current Activities)
- Bookings: `Briefcase`
- Update `loggedPrefixes` for route matching
- Update active state logic

**Modified files:** `components/layout/BottomNav.tsx`

### A3 — Sidebar update

Update desktop sidebar items:

```
DOGGO
Home
Groups
Discover
My Schedule
Bookings
Inbox
Profile
```

- Remove "Find Care" and "Activities"
- Add Discover, My Schedule, Bookings
- Update route matching for active states
- Discover: `MagnifyingGlass`
- My Schedule: `CalendarDots`
- Bookings: `Briefcase`

**Modified files:** `components/layout/Sidebar.tsx`

---

## Workstream B — Discover Page

Unified discovery page replacing Activities > Discover and `/explore/results`.

### B1 — Create `/discover` route

New page at `/discover` with two tabs: Meets | Care.

- TabBar at top (same pattern as current Activities)
- Default tab: `meets`
- Route: `/discover?tab=meets` and `/discover?tab=care`

**New files:** `app/discover/page.tsx`

### B2 — Meets tab

Move current `DiscoverTab` content into the Meets tab, upgraded with filter panel + map to match the Care tab pattern.

- **Filter panel** (new): type (Walk, Park Hangout, Playdate, Training), neighbourhood, date range, group, recurring/one-off. Same visual pattern as the Care filter panel but with meet-appropriate filters.
  - Desktop: filter column on the left (same as Care's `FilterPanelDesktop`)
  - Mobile: filter button → bottom sheet (same as Care's `FilterPanelMobile`)
- **Map view**: map showing meet locations, matching Care tab's `MapView` component
- **Results list**: `CardScheduleMeet` cards (browse context with CTAs)
- **"+ Create" CTA**: mobile + desktop
- Both tabs share the same page-level layout: `[filters] [results + map]`

**New files:** `components/discover/MeetsTab.tsx`, `components/discover/MeetsFilterPanel.tsx` (or adapt shared filter shell)
**Modified files:** Move/adapt from `components/activity/DiscoverTab.tsx`

### B3 — Care tab

Move current `/explore/results` content into the Care tab.

- Service type filter, price range, availability, distance
- Map view (existing `MapView` component)
- Provider cards (`CardExploreResult`)
- Community carers section
- Filter panels (desktop: side column, mobile: bottom sheet)
- Both tabs should share the same visual layout pattern: filter column (desktop) / filter sheet (mobile) + results list + map

This is the bigger lift — the explore page has its own layout with filter panels and map. Need to adapt it to work as a tab within the Discover page, while keeping the filter+map pattern consistent with the Meets tab.

**Modified files:** Move/adapt from `app/explore/results/page.tsx` and `components/explore/*`

### B4 — Provider profile route migration

Move provider profile from `/explore/profile/[id]` to `/discover/profile/[id]`.

- Move page file from `app/explore/profile/[providerId]/` to `app/discover/profile/[providerId]/`
- Add redirect from old route to new route
- Update all internal links pointing to `/explore/profile/`
- Remains a detail page with back-button header

**Modified files:** `app/discover/profile/[providerId]/page.tsx` (moved), links in `CardExploreResult`, `BookingListCard`, etc.

---

## Workstream C — Schedule Elevation

### C1 — Create `/schedule` route

Promote `MyScheduleTab` to a standalone page at `/schedule`.

- Move component content to new page (or keep component, import it)
- Full page container with Upcoming/History toggle, type filters, timeline
- Include mobile action buttons (Find Care + Create) as currently designed
- Remove the old redirect that sent `/schedule` → `/activity`

**New/modified files:** `app/schedule/page.tsx` (rewrite — currently a redirect), `components/activity/MyScheduleTab.tsx`

---

## Workstream D — Bookings Restructure

### D1 — Create `/bookings` hub page with tabs

Restructure `/bookings` (currently a redirect/list page) as the bookings hub with two tabs:

**My Care tab** (`/bookings?tab=care`)
- Bookings where logged-in user is the owner
- Active bookings, past bookings
- Empty state: "No care bookings yet" + "Find Care" CTA
- Cards link to `/bookings/[id]`

**My Services tab** (`/bookings?tab=services`)
- Current `ServicesTab` content (visibility, stats, service cards, requests, active bookings)
- Move from `/activity?tab=services`

**New/modified files:** `app/bookings/page.tsx` (rewrite), new `components/bookings/MyCareTab.tsx`

### D2 — Booking detail page enhancement

Enhance `/bookings/[id]` from a basic info page to a proper dashboard:

- Status header (booking status, next session)
- Contract summary card (service, schedule, price, terms)
- Sessions list (upcoming + past)
- Chat link / preview ("Open conversation" → inbox thread)
- Actions (modify, cancel, message, review)
- Detail page header (back button + booking title)

**Modified files:** `app/bookings/[bookingId]/page.tsx`

---

## Workstream E — Detail Page Headers

### E1 — Detail page header component

Create a reusable `DetailHeader` component:

```
[← Back]  Page Title            [Action?]
```

- Back button with label (e.g., "Groups", "Discover", "Bookings")
- Page title (bold)
- Optional right-side action (share, edit)
- Replaces the top bar on detail pages (mobile only — desktop keeps sidebar)

**New files:** `components/layout/DetailHeader.tsx`

### E2 — Apply to detail pages

Add `DetailHeader` and hide bottom nav on detail pages:

- `/communities/[id]` — back to Groups
- `/meets/[id]` — back to previous
- `/meets/create` — back to previous
- `/inbox/[conversationId]` — back to Inbox (already done)
- `/bookings/[id]` — back to Bookings
- `/bookings/[id]/checkout` — back to booking detail
- `/discover/profile/[id]` — back to Discover
- `/profile/[userId]` — back to previous
- `/posts/create` — back to previous

Some of these already hide bottom nav. This task is about making the pattern consistent.

**Modified files:** Multiple page files

---

## Workstream F — Redirects & Cleanup

### F1 — Add redirects for old routes

- `/activity` → `/discover`
- `/activity?tab=discover` → `/discover?tab=meets`
- `/activity?tab=schedule` → `/schedule`
- `/activity?tab=services` → `/bookings?tab=services`
- `/explore/results` → `/discover?tab=care`
- `/explore/profile/[id]` → `/discover/profile/[id]`

### F2 — Remove dead code

- Remove `app/activity/page.tsx` (after redirects work)
- Remove or archive `app/explore/results/page.tsx` (after Care tab works)
- Clean up unused component imports
- Remove "Find Care" references from old nav items

---

## Workstream G — Doc Updates

### G1 — Update strategy docs

- `Product Vision.md` — nav structure section
- `MVP Scope Boundaries.md` — nav restructure status
- `Information Architecture.md` — mark as implemented

### G2 — Update feature docs

- `schedule.md` — new route, standalone page
- `explore-and-care.md` — care discovery under Discover
- `meets.md` — meet discovery under Discover
- `messaging.md` — inbox access pattern

### G3 — Update flow docs

- `care-discovery.md` — entry point changes
- `meet-discovery.md` — entry point changes
- `booking-conversation.md` — booking detail page link

### G4 — Update implementation docs

- `component-inventory.md` — new/moved components
- `CLAUDE.md` — current phase, nav references

---

## Implementation Order

```
Phase 18a — Nav + My Schedule (foundation)
  A1  Mobile top bar redesign
  A2  Bottom nav update
  A3  Sidebar update
  C1  My Schedule as top-level page

Phase 18b — Discover page
  B1  Create /discover route with tabs
  B2  Meets tab (move DiscoverTab)
  B3  Care tab (move explore content)
  B4  Provider profile routing

Phase 18c — Bookings restructure
  D1  Bookings hub with My Care + My Services tabs
  D2  Booking detail page enhancement

Phase 18d — Detail headers + polish
  E1  DetailHeader component
  E2  Apply to all detail pages
  F1  Redirects
  F2  Dead code cleanup
  G*  All doc updates
```

**Why this order:**
- Nav first — everything else depends on the nav being right
- Schedule is low-risk and validates the new nav immediately
- Discover is the biggest UI lift but builds on existing components
- Bookings can be built while Discover is settling
- Detail headers and cleanup are polish — do last

---

## Verification Checklist

- [x] Mobile: 4 bottom nav tabs work (Home, Discover, My Schedule, Bookings)
- [x] Mobile: top bar shows logo + Inbox icon + avatar on hub pages
- [x] Mobile: top bar hidden on detail pages, replaced by back-button header (DetailHeader)
- [x] Mobile: bottom nav hidden on detail pages
- [x] Desktop: sidebar shows 6 items (Home, Discover, My Schedule, Bookings, Inbox, Profile)
- [x] Home > Feed tab shows social feed + upcoming strip
- [x] Home > Groups tab shows group browse with filter pills
- [x] Discover > Meets tab shows meets _(filter panel + map deferred to Phase 19)_
- [x] Discover > Care tab shows provider search with filters + map
- [x] Schedule page shows Upcoming/History toggle with unified timeline
- [x] Bookings > My Care shows owner bookings
- [x] Bookings > My Services shows provider dashboard
- [x] Booking detail page is a proper dashboard with next session info
- [x] All old routes redirect correctly (/activity, /communities, /explore/results, /explore/profile)
- [x] Empty states guide users to relevant features
- [x] DetailHeader component applied to detail pages
- [x] All docs updated (April 2 — strategy, feature, flow, and implementation docs aligned to Phase 18 final state)

---

## Resolved Decisions

1. **Discover icon:** MagnifyingGlass — consistent with the "Find Care" pattern users already know
2. **Terminology:** "Discover" (not "Explore") — warmer, more community-aligned. Used consistently in routes, components, nav labels
3. **Provider profile route:** `/discover/profile/[id]` — consistent with Discover as parent. Old `/explore/profile/[id]` redirects.
4. **Schedule label:** "My Schedule" — warmer, personal
5. **Bookings tab labels:** "My Care" / "My Services" — may iterate later
6. **Map on Meets tab:** Yes — build a map view for meets, matching the Care tab pattern. Both tabs share filter+map layout.
7. **Meets filter panel:** New filter panel with meet-appropriate filters (type, neighbourhood, date, etc.), matching the Care filter panel's visual pattern but with different filter content.
8. **Groups moved to Home tab:** Groups browse page becomes a tab within Home (Feed | Groups). Bottom nav drops from 5 to 4 tabs. Sidebar drops from 7 to 6 items. Rationale: browsing groups is infrequent; users join a few then interact within them from the feed. Groups don't earn a permanent nav slot.
9. **4-tab bottom nav:** Home | Discover | My Schedule | Bookings. Schedule stays top-level to encourage real-world engagement (booking meets + care). Clean and focused.
