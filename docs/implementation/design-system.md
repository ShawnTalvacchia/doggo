---
category: implementation
status: active
last-reviewed: 2026-04-12
tags: [design-system, components, patterns, css]
review-trigger: "when building or refactoring components, adding CSS patterns, or consolidating styles"
---

# Design System

Living reference for tokens, components, and CSS patterns. This doc should get **shorter** over time — consolidate, don't accumulate.

**Tokens:** Full Figma→CSS mapping in `design-tokens.md`. Tailwind v4 mapping in the `@theme` block of `globals.css`.

---

## Principles

1. **Use what exists.** Check `components/ui/` and `components/layout/` before building anything from scratch.
2. **Tokens first.** All colors, spacing, radii, and typography via CSS custom properties. Never raw values.
3. **Tailwind for simple styles.** 1-3 property patterns go in JSX as utilities. CSS classes only for complex patterns (pseudo-elements, animations, multi-state, 9+ properties).
4. **Consolidate aggressively.** If two patterns do the same thing, merge them. Flag candidates in the Consolidation Queue below.

---

## Primitives (`components/ui/`)

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `ButtonAction` | All clickable actions — buttons, links, CTAs | `variant` (primary/secondary/tertiary/outline/destructive/white), `size` (sm/md/lg), `href`, `cta` |
| `ButtonIcon` | Icon-only buttons (40px square) | `icon`, `badge` (notification dot) |
| `InputField` | Text inputs with label, helper, error | `label`, `error`, `helper` |
| `CheckboxRow` | Labeled checkbox | `checked`, `label`, `placement` |
| `Toggle` | On/off switch for immediate settings | `checked`, `onChange` |
| `TabBar` | Horizontal tab row | `tabs`, `activeKey`, `onChange` |
| `StatusBadge` | Contract lifecycle + session state labels | `status` |
| `SectionLabel` | Section heading in lists/panels | `label` |
| `EmptyState` | Zero-content placeholder | `icon`, `title`, `subtitle`, `action` |
| `Slider` | Single or dual-thumb range slider | `min`, `max`, `value`, `dual` |
| `MultiSelectSegmentBar` | Joined multi-select buttons (days, time windows) | `options`, `selected` |
| `DatePicker` | Single-date and range date picker | `mode` (single/range) |
| `RecurringSchedulePicker` | Days + time picker in ModalSheet | — |
| `ConnectionIcon` | Visual connection state indicator | `state` |
| `DefaultAvatar` | Fallback avatar with initials | `name`, `size` |
| `BookingRow` | Booking list item (My Bookings + My Services) | `booking`, `perspective` |
| `FilterPillRow` | Unified horizontal scrollable filter pills | `pills`, `activePill`, `onChange` |
| `CameraPlusFill` | Camera icon with plus badge (photo upload prompt) | `size`, `className` |
| `NotificationsPanel` | Dropdown notifications list | — |

## Layout (`components/layout/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| `LoggedInShell` | Top-level shell: Sidebar + content area | Wraps all logged-in routes. Calls `useScrollHideNav`. |
| `Sidebar` | Desktop 7-item nav (Community → Profile) | Hidden on mobile. Width: 180px. |
| `AppNav` | Top navigation bar (3 modes: Guest, Signup, Logged) | Mobile only for logged-in routes. |
| `BottomNav` | Mobile 5-tab nav | Community, Discover, My Schedule, Bookings, Profile. |
| `PageColumn` | Canonical single-column page layout | Centered 640px column. Used by all pages (Community, Schedule, Discover sub-pages, Inbox, Bookings, etc.). Replaced MasterDetailShell and DiscoverShell (both deleted). `abovePanel` prop for content above the panel (e.g. filter pills). |
| `PanelBody` | Scrollable panel interior | Use inside raw `<div className="list-panel">` or `<div className="detail-panel">`. |
| `LayoutSection` | Padded content block inside PanelBody | Adds horizontal padding. |
| `LayoutList` | Edge-to-edge card list inside PanelBody | No horizontal padding. |
| `Spacer` | Bottom spacer (last child of PanelBody) | Prevents content from being clipped by panel border-radius. |
| `DetailHeader` | Back-button header for detail/subpages | Back target wraps arrow + title as single clickable area. Uses `router.back()`. |
| `FormHeader` / `FormFooter` | Multi-step form page header and footer | Back/Continue button row. |
| `GuestLayout` | Layout shell for public/guest routes | — |
| `ListPanel` | *(Legacy — avoid for new code)* | Wrapper for list panels. Use `PanelBody` inside raw div instead. |
| `DetailPanel` | *(Legacy — avoid for new code)* | Wrapper for detail panels. Use `PanelBody` inside raw div instead. |

## Overlays (`components/overlays/`)

| Component | Purpose |
|-----------|---------|
| `ModalSheet` | Desktop centered card / mobile bottom sheet |
| `BookingModal` | Service picker + date range + message + success flow |

---

## CSS Pattern Classes

Shared CSS classes in `globals.css` that are used across multiple components. Use these instead of recreating with Tailwind.

| Class | Purpose | Notes |
|-------|---------|-------|
| `.pill-group` + `.pill` / `.pill.active` | Multi-select filter pills | Toggle on/off, brand color when active |
| `.tag` | Compact label (4px radius) | For post tags, metadata labels |
| `.chip` | Pill-shaped label (12px radius) | Service chips, booking chips |
| `.avatar` | 40×40 circle image | Standard user/dog avatar |
| `.card-schedule-meet` | Schedule/booking card | Left accent border, consistent padding |
| `.feed-card-*` | Feed card layout system | Two-column (avatar + content), two-row header |
| `.feed-card-provider-badge` | "Carer" badge on feed cards | Shown on posts by care providers |
| `FeedShareNudge` | Share prompt in community feed | Encourages photo/content sharing |
| `.sched-card-days` | Day chips on schedule care cards | Shows recurring day abbreviations |
| `.sched-card-role--providing` | Provider role badge on schedule cards | Distinguishes provider vs owner perspective |
| `.filter-pill-row` | Unified horizontal filter pill row | Used by all Discover sub-pages and Schedule Care tab. Replaced `discover-type-pill` CSS. |
| `.booking-card` | Redesigned booking/care card | Full accent border for provider/host cards, action verb labels |
| `.filter-accordion` | Inline collapsible filter sections | Used in FilterBody |
| `.md-shell` / `.list-panel` / `.detail-panel` | *(Deleted)* MasterDetailShell panels | Replaced by PageColumn |

---

## Page Shell Patterns

Single-panel pages (Community, Schedule) use their own shell classes instead of MasterDetailShell:

| Page | Shell class | Panel class | Notes |
|------|-------------|-------------|-------|
| Community | `.community-page-shell` | `.community-panel` | Feed/Groups tabs, category filter pills |
| Schedule | `.schedule-page-shell` | `.schedule-panel` | Upcoming/Interested/Care tabs, simple single-panel |
| Group detail | `.group-detail-page` | — | Banner + info + sticky tabs |
| Meet detail | `.meet-detail-page` | — | Tabbed: Details · People · Chat |

All pages now use PageColumn. MasterDetailShell and DiscoverShell have been deleted.

---

## Consolidation Queue

Active list of things to merge, simplify, or remove. Work these down over time.

| Item | Issue | Proposed fix |
|------|-------|-------------|
| `ListPanel` / `DetailPanel` | Legacy components still in codebase, CLAUDE.md says don't use | Remove files, update any remaining imports to use `PanelBody` + raw divs |
| `MasterDetailShell` / `DiscoverShell` | Deleted — replaced by PageColumn | Remove any lingering CSS or references |
| Provider ID mismatch | `mockData.ts` uses `olga-m`, `nikola-r`; `mockUsers.ts` uses `jana`, `nikola` | Unify to one naming scheme before backend work |
| `frontend-style.md` | Retired — content merged into CONTRIBUTING.md and this doc | Delete file after confirming no remaining references |
| `component-inventory.md` | Retired — replaced by this doc | Archive to `archive/implementation/` |
| Duplicate CSS for single-panel pages | Community and Schedule shells follow the same pattern but have separate CSS | Consider a shared `.single-panel-shell` base class |
| `.feed-card-body--simple` variant | Only used for authorless cards; may be removable | Audit usage, consider removing if unused |
| `discover-type-pill` CSS | Consolidated into `.filter-pill-row` | Remove old class if no remaining references |

---

## When to update this doc

- **Adding a component:** Add it to the appropriate table above.
- **Removing a component:** Remove from table, add to Consolidation Queue if cleanup is needed elsewhere.
- **Adding a CSS pattern class:** Add to the CSS Pattern Classes table.
- **Spotting duplication:** Add to Consolidation Queue.
- **Completing a consolidation:** Remove from queue, update tables.
