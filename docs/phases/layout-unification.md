---
status: archived
last-reviewed: 2026-04-12
review-trigger: When any task is completed or blocked
---

# Layout Unification

**Goal:** Unify every page to a single centered content column (max-width 640px) using one canonical `PageColumn` component. Tighten the sidebar. Remove multi-panel layout code. Inspired by Threads' layout consistency.

**Depends on:** Review & Polish (done). Runs alongside Page Content & Interactions.

**Refs:** [[design-system]], [[component-inventory]], [[frontend-style]]

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review current layout components and CSS
- [x] Audit multi-panel pages (Discover, Inbox, Bookings, Profile)
- [x] Confirm routing structure supports drill-down navigation
- [x] Scope confirmed — 8 workstreams, ~7 focused sessions

---

## Tasks

### W1: Build `PageColumn` component
- [ ] Create `components/layout/PageColumn.tsx` with props: `title`, `headerAction`, `hideHeader`, `children`, `className`
- [ ] Add `.page-column`, `.page-column-header`, `.page-column-panel` CSS (modeled on `.community-page-shell` + `.community-panel`)
- [ ] Verify renders correctly at desktop and mobile widths

### W2: Migrate single-column pages
- [ ] Community (`app/home/page.tsx`) — replace `.community-page-shell` + `.community-panel` with PageColumn
- [ ] Schedule (`app/schedule/page.tsx`) — replace `.schedule-page-shell` + `.schedule-panel` with PageColumn
- [ ] Notifications (`app/notifications/page.tsx`) — replace MasterDetailShell with PageColumn
- [ ] Delete orphaned CSS: `.community-page-shell`, `.community-page-header`, `.community-page-title`, `.community-panel`, `.schedule-page-shell`, `.schedule-page-header`, `.schedule-panel`, `.schedule-body`

### W7: Tighten sidebar
- [ ] Reduce `--sidebar-width` 200px → 180px
- [ ] Compact logo, nav items, spacing (see plan for exact values)
- [ ] Update icon size 24px → 22px in `Sidebar.tsx`

### W4: Migrate Bookings
- [ ] `/bookings` — strip MasterDetailShell, render list in PageColumn
- [ ] `/bookings/[bookingId]` — strip MasterDetailShell, render detail in PageColumn with DetailHeader
- [ ] Delete `.bookings-page-shell` CSS

### W3: Migrate Inbox
- [ ] `/inbox` — strip MasterDetailShell, render conversation list in PageColumn
- [ ] `/inbox/[conversationId]` — strip MasterDetailShell, render thread in PageColumn with DetailHeader
- [ ] Handle contact info (header action or inline section instead of third panel)
- [ ] Delete `.inbox-page-shell`, `.panel-tabbar` CSS

### W5: Migrate Discover
- [ ] `/discover` — strip DiscoverShell, render hub in PageColumn
- [ ] `/discover/meets|groups|care` — strip DiscoverShell, render results in PageColumn with DetailHeader
- [ ] Handle map (toggle or remove for now)
- [ ] Delete `DiscoverShell.tsx` and all `.discover-*` layout CSS

### W6: Migrate Profile
- [ ] Remove desktop two-column grid, use PageColumn everywhere
- [ ] Delete `.profile-desktop-layout`, `.profile-desktop-left-col`, `.profile-desktop-right-col` CSS

### W8: Delete dead layout code
- [ ] Delete: `MasterDetailShell.tsx`, `ListPanel.tsx`, `DetailPanel.tsx`, `DiscoverShell.tsx`
- [ ] Delete all `.md-shell-*`, `.list-panel-*`, `.detail-panel-*` CSS
- [ ] Delete `.page-container`, `.page-side-panel`, `.page-spacer` if unused
- [ ] Grep for orphan class references and component imports
- [ ] Update docs: design-system.md, component-inventory.md, ROADMAP.md

---

## Execution Order

1. W1 + W2 — Build PageColumn, migrate easy pages (validates the pattern)
2. W7 — Tighten sidebar
3. W4 — Bookings (simplest multi-panel)
4. W3 — Inbox (most complex)
5. W5 — Discover (biggest CSS deletion)
6. W6 — Profile
7. W8 — Cleanup + docs
