---
category: implementation
status: active
last-reviewed: 2026-05-08
tags: [design-system, components, patterns, css]
review-trigger: "when building or refactoring components, adding CSS patterns, or consolidating styles"
---

# Design System

Living reference for tokens, components, and CSS patterns. This doc should get **shorter** over time — consolidate, don't accumulate.

**Tokens:** Full Figma→CSS mapping in `design-tokens.md`. Tailwind v4 mapping in the `@theme` block of `globals.css`.

---

## Principles

1. **Use what exists.** Check `components/ui/`, `components/layout/`, and `components/people/` before building anything from scratch.
2. **Tokens first.** All colors, spacing, radii, and typography via CSS custom properties. Never raw values.
3. **Tailwind for simple styles.** 1-3 property patterns go in JSX as utilities. CSS classes only for complex patterns (pseudo-elements, animations, multi-state, 9+ properties).
4. **Consolidate aggressively.** If two patterns do the same thing, merge them. Flag candidates in the Consolidation Queue below.
5. **Avatar shape Rule B (entity identity, 2026-05-08).** People are circles. Dogs are rounded squares (`rounded-panel` / `--radius-panel`). The shape encodes the entity type, not the layout role — same dog renders the same way wherever it appears (`PetCard`, booking row, schedule card, hero treatment, Pet info section). This gives entity types a fixed visual identity. Codebase-wide audit tracked in punch list P58. Caveat: shapes encoding *relationship* (Familiar/Connected ring on Discover provider cards) are an orthogonal pattern and not affected by Rule B.
6. **Pet-as-protagonist (Sessions & Service Execution, 2026-05-08).** For surfaces that frame care of a specific dog (booking detail Sessions tab, future session-cards on the schedule), the dog is the visual centerpiece. Hero photo treatment over avatar-as-thumbnail. Encourages emotional bonding, instant recall, and a behavioral nudge for owners to upload quality photos. Currently applied on `SessionsPetHeader`; candidate for codification in `strategy/Product Vision.md` if extended elsewhere.

---

## Primitives (`components/ui/`)

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `ButtonAction` | All clickable actions — buttons, links, CTAs | `variant` (primary/secondary/tertiary/outline/neutral/brand-subtle/destructive/white), `size` (sm/md/lg), `href`, `cta`. **`neutral`** is filled `--surface-inset` with no border — use for inactive toggle states (RSVP not yet, Join community before joining) and quiet secondary actions (Decline, Skip). **`brand-subtle`** is filled `--brand-subtle` with `--brand-strong` text and no border — use for ACTIVE toggle states (Going, Interested, Joined, Following). The toggle pattern (FB Events "Interested" model): brand color appears ONLY on active state — never on inactive — so the brand presence reads as "your committed state, celebrated." Inactive is quiet (`neutral`) so the active state's brand identity isn't competed with. |
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

## People (`components/people/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| `PersonRow` | Canonical row for rendering a person — meet attendees, group members, inbox conversations | Variants: `meet-attendee`, `group-member`, `inbox-conversation`, `default`. Non-inbox variants render with the `OwnerDogAvatar` combo (owner + overlapping dogs) on the left, identity column on the right. Identity column locked to 64px height; name-row is `h-8 -ml-3` (32px tall, pulled 12px LEFT toward the owner — the asymmetric offset that gives consecutive cards visual distinction). Pet text below uses `text-sub` (13px) with `leading-8`. Inbox variant is denser (44px owner circle, paw-icon + text dog line, no overlapping dog avatars). Action set resolves automatically via `lib/personActions.ts:resolvePersonActions` per the Trust & Visibility action matrix; pass `actions={[]}` for info-only mode (suppresses CTAs and Familiar toggle pill — Pending status pill still renders). Connection-state pill suppressed on `none + theyMarkedFamiliar` per the deniability guardrail (see `Trust & Connection Model.md`). Care tier badge resolves from caller's `careTier?: "helper" \| "provider"` prop — Helper-tier visibility is the caller's responsibility to gate on Connected status. |
| `OwnerDogAvatar` | Owner-forward avatar primitive — owner circle (64px) + dog cluster overlapping bottom-right | Inline-flex combo. Dog cluster lives in a 44px right-aligned slot anchored to the owner via `margin-left: -16px`. Dog size dynamic: 36px when single-slot rendered (lone dog), 32px when two-slot (2 dogs OR 1 dog + chip). Cap at 2 slots max — 3+ dogs collapse to 1 dog avatar + "+N" chip. Owner stays a circle (humans = circles); dogs use `--radius-md` 12px-rounded squares with a `box-shadow` ring on the outside (so the image stays a true 32×32). Used by `PersonRow` non-inbox variants and by `PostMeetReviewSheet`'s AttendeeActionCard. Internal dog-image lookup via `getDogImageByOwnerAndName`. |
| `PersonSections` | Shared section primitives for person-row surfaces | Exports `SectionHeader` (uppercase tracking-wider label between row groups — CONNECTED, FAMILIAR, ADMINS), `MetaDivider` (hairline rule + `mt-md`, separates higher-level groupings like Going block vs Interested or Admins block vs the rest), `LockedChipList` (chip list for tier-3 rows that don't render as cards). Used by `ParticipantList` (meet People tab) and `MembersTab` (group detail Members tab). |

## Overlays (`components/overlays/`)

| Component | Purpose |
|-----------|---------|
| `ModalSheet` | Desktop centered card / mobile bottom sheet |
| `BookingModal` | Open-ended provider booking — service picker + date range + message + success flow |
| `ServiceBookingSheet` | Lightweight "book this scheduled session" — pre-filled date/time/provider/price, optional message, confirm. Used by paid (care-group) meet detail pages — service info card Book CTA on one-off, per-row Book on recurring. |

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
| `.person-row` + `.person-row--*` variants | Shared person-row chrome | Used by `PersonRow`. Variant modifiers: `--meet-attendee`, `--group-member`, `--inbox-conversation`, `--default`. Row uses `gap: var(--space-xl)` (20px) between avatar combo and identity column. Inbox variant is denser + transparent (sits inside flush conversation list); others are panel-bordered cards. |
| `.person-row-pill` + `.person-row-pill--familiar` / `--pending` / `--admin` / `--provider` / `--helper` | Connection-state, role, and tier pills inside `PersonRow` | Familiar/pending/admin use `surface-inset` neutral. Provider tier uses `brand-subtle` (public, professional). Helper tier uses `surface-inset` (informal, Connected-only privacy gate enforced by caller). Connected status renders no pill (the Message CTA carries the signal). `.person-row-pill--care` retained as legacy alias of `--provider`. |
| `.person-avatar-*` | OwnerDogAvatar primitive (combo container, owner img, dogs slot, dog avatars, "+N" chip) | `.person-avatar-combo` is inline-flex with `align-items: flex-end`, `height: 64px`. `.person-avatar-dogs` is the 44px right-aligned slot with `margin-left: -16px` anchoring it to the owner. Dog size set inline (36px / 32px) per slot count. |

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
