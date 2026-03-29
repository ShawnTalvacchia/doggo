---
category: phase
status: active
last-reviewed: 2026-03-29
tags: [phase-16, layout, navigation, sidebar, redesign, responsive]
review-trigger: "when modifying layout shell, navigation components, or page container patterns"
---

# Phase 16 — Layout Redesign

**Goal:** Replace the top navigation bar with a desktop sidebar, introduce a centered max-width content shell for all logged-in pages, rename "Communities" to "Groups" and "Activity" to "Activities" throughout, and update mobile bottom nav icons.

**Depends on:** Phase 14 (community & activity restructure), Phase 2 (app shell & navigation).

---

## Why

1. **The top navbar wastes vertical space.** A sidebar frees the full viewport height for content and feels more app-like at desktop widths.
2. **Page content is too wide.** The current 768px max-width makes feed cards and content uncomfortably wide. The redesign narrows the main column to 640px and adds an optional side panel or spacer to balance the layout.
3. **Naming has settled.** "Groups" is clearer than "Communities" for the audience. "Activities" better describes the meets/schedule/bookings hub.
4. **Mobile nav icon mismatch.** The Compass icon for Activity doesn't convey calendar/scheduling — CalendarDots is a better fit.

---

## Workstream A — Layout Shell

### A1 · CSS foundation

Add new layout tokens to `globals.css`:
- `--sidebar-width: 240px`
- `--content-max-width: 640px`
- `--side-panel-width: 320px`
- Responsive `--padding-main` (24px desktop, 0 mobile)

Add CSS for `.sidebar`, `.logged-shell`, `.logged-shell-main`, `.page-container`, `.page-side-panel`, `.page-spacer` with mobile overrides that hide the sidebar and go full-width.

**Modified files:** `app/globals.css`

### A2 · Sidebar component

New desktop sidebar nav with 6 items: Home, Groups, Activities, Inbox, Find Care, Profile. "DOGGO" logo at top in Poppins Black. Active state detection mirrors BottomNav logic. Icons: House, UsersThree, CalendarDots, ChatCircleDots, MagnifyingGlass, UserCircle (Phosphor, light weight, fill when active).

Find Care is desktop-sidebar-only — mobile gets contextual buttons per page.

**New files:** `components/layout/Sidebar.tsx`
**Modified files:** `app/layout.tsx` (add Poppins weight 900)

### A3 · LoggedInShell component

Minimal wrapper that renders Sidebar + main content area. All logged-in pages render inside this shell via GuestLayout.

**New files:** `components/layout/LoggedInShell.tsx`
**Modified files:** `components/layout/GuestLayout.tsx`

### A4 · Update BottomNav

- "Communities" → "Groups"
- "Activity" → "Activities"
- Compass icon → CalendarDots icon

**Modified files:** `components/layout/BottomNav.tsx`

---

## Workstream B — Page Migration

### B1 · Migrate Home page

Replace inline max-width/margin styles with `.page-container` class. The Home page has an optional side panel ("Your Upcoming") on desktop — add as a sibling column.

**Modified files:** `app/home/page.tsx`

### B2 · Migrate Activities page

Replace inline max-width/margin styles with `.page-container` class. Activities uses a spacer (no side panel) to keep content centered.

**Modified files:** `app/activity/page.tsx`

### B3 · Remaining page migration (incremental)

Other logged-in pages (communities, meets, profile, inbox, explore, bookings) render inside the new shell automatically. Their internal content keeps working at the old 768px max-width until individually redesigned in future phases.

**Modified files:** Individual page files as designs are completed

---

## Execution Order

1. A1 — CSS tokens and styles (foundation for everything)
2. A2 — Sidebar component
3. A3 — LoggedInShell + GuestLayout wiring (activates the new layout)
4. A4 — BottomNav updates
5. B1 — Home page migration
6. B2 — Activities page migration

---

## Verification

- [ ] Desktop: sidebar visible on left, content centered, no top nav on logged routes
- [ ] Mobile: no sidebar, bottom nav shows "Groups" + "Activities" labels with CalendarDots icon
- [ ] Guest routes (`/`, `/signin`, `/signup`): unchanged — top AppNav, no sidebar
- [ ] Un-migrated pages render inside shell without visual breakage
- [ ] Sidebar active states highlight correctly when navigating
- [ ] Responsive: sidebar hides/shows cleanly at 768px breakpoint
- [ ] Home page side panel visible on desktop, hidden on mobile

---

## Out of Scope

- Redesigning page content (feed cards, activity cards, meet detail) — separate phases
- Profile page redesign
- Inbox/messaging layout changes
- Explore/care layout changes
- Dark mode
