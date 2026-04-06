---
category: phase
status: active
last-reviewed: 2026-04-06
tags: [phase-22, panels, layout, components, architecture]
review-trigger: "when completing workstreams or closing this phase"
---

# Phase 22 — Panel Architecture & Page Alignment

**Goal:** Establish a canonical panel component system (Panel → Body → Section/List → Spacer) and migrate all pages to use it. This creates consistency across the app and makes building new pages faster. Work through pages in order, starting with Home and Discover.

**Depends on:** Phase 21 (all pages now using MasterDetailShell, content built out)

---

## Design Spec

### Panel (outer container)

The panel is the top-level wrapper inside MasterDetailShell slots. It replaces the current ListPanel/DetailPanel components.

- Height/width fills parent
- No scroll on panel itself
- border-strong between panels (handled by md-shell, not the panel)
- surface-inset background (handled by md-shell, not the panel)
- Top radius: `var(--radius-panel)` (20px)
- Bottom radius: `var(--radius-panel)` on mobile only, 0 on desktop
- No gap, no padding
- Max-width utility class: `panel-sm` (400px) or `panel-lg` (640px)

### Panel children (top to bottom, all optional)

1. **TabBar** — hidden on desktop, visible on mobile/collapsed. Used for panel switching (Home: Groups/Feed) or content tabs (Bookings: My Care/My Services).
2. **PanelHeader** — hidden on mobile, visible on desktop. Fixed 64px strip with title, actions.
3. **PanelBody** — the single scroll container.

### PanelBody

- Height/width fills remaining space
- Vertical scroll (`overflow-y: auto`)
- Contains any combination of: inner-header, LayoutSection, LayoutList
- Ends with **Spacer** component at bottom

### Spacer

- Fills horizontally and vertically (`flex: 1`)
- Has `min-height` (ensures small bottom space even when content fills, takes up remaining space when content is short)
- `surface-popout` background — gives the "content floating on inset" feel
- Utility classes for min-height: `spacer-sm`, `spacer-md`, `spacer-lg`

### LayoutSection

- Horizontal padding: `var(--space-lg)` (16px)
- Vertical padding via utility class: `section-py-lg` (16px) or `section-py-xl` (24px)
- Fills horizontally
- Utility class for vertical hug (`section-hug`) or fill (`section-fill`)

### LayoutList

- No padding — content goes edge-to-edge
- Flex column by default
- Utility classes for direction and gap

---

## Current State → Target

| Component | Current | Target |
|---|---|---|
| `ListPanel` | Fixed header + search + filters + scroll wrapper | Evolve into Panel with PanelHeader + PanelBody |
| `DetailPanel` | Fixed header + scroll wrapper + footer | Evolve into Panel with PanelHeader + PanelBody + footer |
| `MasterDetailShell` | Outer flex container with panel slots | Keep as-is — panels plug in |
| `DiscoverShell` | Custom three-panel layout | Keep outer shell — migrate inner panel content to use PanelBody + LayoutSection/List |
| Page content | Inline padding, ad-hoc structure | LayoutSection (padded blocks) + LayoutList (edge-to-edge cards) + Spacer |

---

## Workstream A — Component Build

Build the new components and CSS classes. These are additive — existing components keep working.

### A1 — PanelBody + Spacer components

Build `PanelBody` and `Spacer` components. PanelBody is the scroll container that replaces `list-panel-scroll` / `detail-panel-scroll`. Spacer is a flex-fill element with surface-popout and min-height variants.

**New files:** `components/layout/PanelBody.tsx`, `components/layout/Spacer.tsx`
**CSS:** Add `.panel-body`, `.spacer`, `.spacer-sm`, `.spacer-md`, `.spacer-lg` to globals.css
**Docs:** `docs/implementation/component-inventory.md`

### A2 — LayoutSection + LayoutList components

Build `LayoutSection` and `LayoutList`. LayoutSection is a padded content wrapper. LayoutList is a zero-padding flex container for card lists.

**New files:** `components/layout/LayoutSection.tsx`, `components/layout/LayoutList.tsx`
**CSS:** Add `.layout-section`, `.section-py-lg`, `.section-py-xl`, `.section-hug`, `.section-fill`, `.layout-list` to globals.css
**Docs:** `docs/implementation/component-inventory.md`

### A3 — PanelHeader responsive visibility

Add mobile-hide logic to PanelHeader (the existing `list-panel-header` / `detail-panel-header`). On mobile/collapsed, the header hides and TabBar (if present) becomes the top element.

**Files:** globals.css (add responsive rules), possibly refactor ListPanel/DetailPanel header rendering
**Docs:** `docs/implementation/component-inventory.md`

### A4 — Panel bottom radius

Add `var(--radius-panel-no-desktop)` token — 20px on mobile, 0 on desktop. Apply to panel containers so they get rounded bottoms on mobile only.

**Files:** globals.css (new token + responsive rule)

### A5 — Styleguide entry

Add a Panel Architecture section to the styleguide showing Panel → PanelBody → LayoutSection/LayoutList → Spacer composition with live examples.

**Files:** `app/styleguide/components/page.tsx` or new sub-page

---

## Workstream B — Home Page

Migrate Home to use the new panel components. Home is already close — main work is adopting PanelBody, LayoutSection/LayoutList, and Spacer.

### B1 — Home groups panel

Migrate the groups list panel: PanelHeader ("My Groups"), PanelBody containing a LayoutList of GroupCards, Spacer at bottom.

**Files:** `app/home/page.tsx`

### B2 — Home feed panel

Migrate the feed panel: PanelBody containing FeedCTA as a LayoutSection, feed items as a LayoutList, Spacer at bottom.

**Files:** `app/home/page.tsx`

### B3 — Home collapsed/mobile verification

Verify the collapsed and mobile breakpoints still work correctly with the new components. TabBar should show on collapsed, PanelHeader should hide on mobile.

**Files:** `app/home/page.tsx`, globals.css

---

## Workstream C — Discover

Migrate Discover hub and sub-pages. DiscoverShell stays as the outer layout — inner panel content adopts new components.

### C1 — Discover hub panel

Migrate the hub panel body to use PanelBody + LayoutSections (the three door cards) + Spacer.

**Files:** `app/discover/page.tsx`

### C2 — Discover Meets hub + filter panels

Migrate MeetsPickerPanel and MeetsFilterPanel to use LayoutSection for padded filter groups and LayoutList for card grids.

**Files:** `app/discover/meets/page.tsx`

### C3 — Discover Groups hub + filter panels

Same as C2 for Groups.

**Files:** `app/discover/groups/page.tsx`

### C4 — Discover Care filters

Migrate Care filter panel content to use LayoutSection/LayoutList.

**Files:** `app/discover/care/page.tsx`

### C5 — Discover results panels

Migrate results list panels across all three sub-pages to use PanelBody + LayoutList + Spacer.

**Files:** `app/discover/meets/page.tsx`, `app/discover/groups/page.tsx`, `app/discover/care/page.tsx`

---

## Workstream D — Schedule, Bookings, Notifications

Migrate the remaining MasterDetailShell pages.

### D1 — Schedule page

Migrate list panel (meet cards) and detail panel (meet info) to new components.

**Files:** `app/schedule/page.tsx`

### D2 — Bookings page

Migrate list panel (booking cards) and detail panel (booking info) to new components.

**Files:** `app/bookings/page.tsx`

### D3 — Notifications page

Migrate list panel (notification rows) and detail panel (notification detail) to new components.

**Files:** `app/notifications/page.tsx`

### D4 — Inbox page

Migrate list panel (conversation rows), detail panel (messages), and info panel (contact info) to new components.

**Files:** `app/inbox/page.tsx`

---

## Workstream E — Cleanup & Documentation

### E1 — Deprecate old panel components

Once all pages are migrated, mark ListPanel/DetailPanel as deprecated or refactor them to be thin wrappers around the new components.

**Files:** `components/layout/ListPanel.tsx`, `components/layout/DetailPanel.tsx`

### E2 — Update component inventory

Add all new components (PanelBody, Spacer, LayoutSection, LayoutList) with descriptions and usage examples.

**Files:** `docs/implementation/component-inventory.md`

### E3 — Update CLAUDE.md component usage table

Add the new layout components to the "Always use existing components" table.

**Files:** `CLAUDE.md`

### E4 — Close phase

Update phase board, roadmap, and review affected docs.

**Files:** `docs/phases/phase-22-panel-architecture.md`, `docs/ROADMAP.md`

---

## Implementation Order

1. **22a** — Build components (A1–A5) — foundation
2. **22b** — Home page migration (B1–B3) — prove the pattern
3. **22c** — Discover migration (C1–C5) — extend to DiscoverShell
4. **22d** — Remaining pages (D1–D4) — roll out everywhere
5. **22e** — Cleanup and docs (E1–E4) — close the loop

---

## Out of Scope (deferred)

- Card component audit and standardisation — separate phase
- Full-panel views (group detail, meet detail) — separate phase
- Mock data overhaul — separate phase
- Demo welcome page — separate phase

---

## Verification Checklist

- [ ] PanelBody, Spacer, LayoutSection, LayoutList components built
- [ ] Spacer renders surface-popout background, fills remaining space
- [ ] PanelHeader hides on mobile, TabBar hides on desktop
- [ ] Home page uses new panel components
- [ ] Discover hub + sub-pages use new panel components
- [ ] Schedule, Bookings, Notifications, Inbox migrated
- [ ] All new components added to component-inventory.md and styleguide
- [ ] CLAUDE.md updated with new component usage rules
- [ ] Build passes clean (`npm run build`)
