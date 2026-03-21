---
category: implementation
status: active
last-reviewed: 2026-03-16
tags: [components, ui, inventory]
review-trigger: "when building or refactoring components"
---

# Component Inventory
_Doggo · Updated March 2026_

Working reference for every component and UI pattern in the codebase. Use it to guide Figma alignment, style guide expansion, and refactoring decisions.

---

## Status key

| Status | Meaning |
|--------|---------|
| `built · documented` | Has a style guide section with live demo |
| `built` | Works in the product, no style guide section yet |
| `needs update` | Works but has a known issue or improvement waiting |
| `on deck` | Clear need, not yet extracted or built |
| `archived` | In codebase but not imported anywhere — candidate for deletion |

---

## Folder structure

```
components/
  ui/           ← Primitives: ButtonAction, ButtonIcon, InputField, CheckboxRow,
                  Toggle, StatusBadge, Slider, DatePicker,
                  RecurringSchedulePicker, BookingRow
  layout/       ← App chrome: AppNav, BottomNav, FormHeader, FormFooter, GuestLayout
  overlays/     ← ModalSheet, BookingModal
  explore/      ← FilterPanelDesktop, FilterPanelMobile, FilterPanelShell, FilterBody, ProfileHeader,
                  CardExploreResult, MapView
  signup/       ← SignupProgressBar, SignupProfilePreview
  messaging/    ← InquiryForm, BookingProposalCard, InquiryChips
  landing/      ← HowItWorksTabs
```

---

## Group 1 — Primitives
_Reusable building blocks. No product-domain knowledge. Should work anywhere._

### ButtonAction · `built · documented`
`components/ui/ButtonAction.tsx`

The single action component for all clickable UI. Renders as `<button>`, `<Link>` (when `href` is set), or `<span aria-disabled>` (when `href` + `disabled`).

| Prop | Type | Notes |
|------|------|-------|
| `variant` | `primary \| secondary \| tertiary \| outline \| destructive \| white \| outline-white \| disabled` | `white`/`outline-white` for dark surfaces only |
| `size` | `sm \| md \| lg` | `lg` for marketing, `md` for in-app, `sm` for condensed |
| `cta` | boolean | Pill shape |
| `href` | string? | Renders as `<Link>` |
| `leftIcon / rightIcon` | ReactNode? | Phosphor icon |
| `disabled` | boolean? | Functional disabled. Separate from `variant="disabled"` which is visual-only |

---

### ButtonIcon · `built · documented`
`components/ui/ButtonIcon.tsx`

40px square touch-target for icon-only actions. Used in AppNav icon row. Always provide a `label` (becomes `aria-label`).

Icon spec: Phosphor `weight="light"`, `size={32}`.

| Prop | Type | Notes |
|------|------|-------|
| `label` | string | Required — accessibility |
| `showBadge` | boolean? | Notification dot |
| `badgeCount` | number? | Shown inside dot if > 0; caps at "9+" |
| `href` | string? | Renders as `<Link>` |

---

### InputField · `built · documented`
`components/ui/InputField.tsx`

Standard controlled text input with label row (primary + optional secondary label), helper text, and error state.

| Prop | Type | Notes |
|------|------|-------|
| `id` | string | Required — ties label to input |
| `label` | string | |
| `value / onChange` | string / fn | Controlled |
| `required` | boolean? | `*` indicator; turns green when filled |
| `secondaryLabel` | string? | Right-aligned in label row (e.g. "Optional") |
| `helper` | string? | Shown when no error |
| `error` | string? | Replaces helper, triggers `.input-invalid` |
| `type` | string? | Defaults to `"text"` |

---

### CheckboxRow · `built · documented`
`components/ui/CheckboxRow.tsx`

Unified checkbox for both layout directions. Custom 24px indicator with Phosphor Check icon. Native `<input>` is hidden inside the label (implicit association — no `id`/`htmlFor` needed). `label` accepts ReactNode for inline bold/links.

| Prop | Type | Notes |
|------|------|-------|
| `label` | ReactNode | String or inline JSX |
| `checked` | boolean | |
| `onChange` | (checked: boolean) => void | |
| `placement` | `"left" \| "right"` | Default: `"left"`. "right" = label fills width, indicator flush right |
| `id` | string? | Optional — implicit wrapping handles accessibility without it |

---

### Toggle · `built · documented`
`components/ui/Toggle.tsx`

On/off toggle for settings that take effect immediately (e.g. Public Profile). For multi-option selection use `CheckboxRow` or `MultiSelectSegmentBar`.

| Prop | Type | Notes |
|------|------|-------|
| `label` | string | Displayed text + `aria-label` |
| `checked` | boolean | |
| `onChange` | (checked: boolean) => void | |
| `labelPlacement` | `"left" \| "right"` | Default: `"left"` |

---

### StatusBadge · `built · documented`
`components/ui/StatusBadge.tsx`

Small coloured status label for contract lifecycle states. Maps each status to a semantic token pair (strong text + light background fill).

| Prop | Type |
|------|------|
| `status` | `"upcoming" \| "active" \| "completed" \| "cancelled" \| "paused"` |

Token mapping: `--status-{success/info/error/warning}-{strong/light}`.

---

## Group 2 — Selection & Input Controls
_More complex form inputs. All accept controlled values and use shared visual language._

### MultiSelectSegmentBar · `built · documented`
`components/ui/MultiSelectSegmentBar.tsx`

Segmented control, multi-select. Used for days of week, dog age bands, time windows. Add `subLabel` for two-line cells.

| Prop | Type |
|------|------|
| `options` | `{ value, label, subLabel? }[]` |
| `selectedValues` | string[] |
| `onToggle` | (value: string) => void |
| `ariaLabel` | string |

---

### Slider · `built · documented`
`components/ui/Slider.tsx`

Single component for both single-thumb and dual-thumb range inputs. Add `dual` prop for a min/max pair. Single thumb used for distance radius; dual used for price range. Pair with `.slider-row` and `.slider-value-box` for the value readout layout.

**Single thumb**

| Prop | Type |
|------|------|
| `min / max / step` | number |
| `value` | number |
| `onChange` | (value: number) => void |
| `id` | string? |

**Dual thumb** (`dual` prop required)

| Prop | Type |
|------|------|
| `min / max / step` | number |
| `minValue / maxValue` | number |
| `onMinChange / onMaxChange` | (value: number) => void |
| `style` | CSSProperties? |

---

### DatePicker · `built · documented`
`components/ui/DatePicker.tsx`

Two exports that always work together: `DateTrigger` (shows the selected value, opens on click) wraps a `ModalSheet` containing `DatePicker` (the calendar). Supports single-date and date-range modes.

**DateTrigger**

| Prop | Type |
|------|------|
| `label` | string |
| `value` | `string \| DateRange \| null` |
| `onClick` | () => void |

**DatePicker**

| Prop | Type | Notes |
|------|------|-------|
| `mode` | `"single" \| "range"` | |
| `value` | `string \| null` or `DateRange` | Depends on mode |
| `onChange` | fn | |
| `label` | string | |

Used in: `FilterBody`, `BookingModal`, `InquiryForm`.

---

### RecurringSchedulePicker · `built · documented`
`components/ui/RecurringSchedulePicker.tsx`

Selects a recurring walk schedule: days of week + time window. Rendered inside a `ModalSheet` in the inbox booking proposal flow.

| Prop | Type |
|------|------|
| `value` | `{ days, time, timeLabel }` |
| `onChange` | fn |

---

## Group 3 — Overlays
_Everything that renders on top of page content. All use a portal (`document.body`)._

### ModalSheet · `built · documented`
`components/overlays/ModalSheet.tsx`

The standard overlay container for the app. Desktop: centered card with blurred backdrop. Mobile (<804px): bottom sheet. Body scroll is locked while open. Click backdrop or × to close.

| Prop | Type | Notes |
|------|------|-------|
| `open` | boolean | |
| `onClose` | () => void | Backdrop click + × button |
| `title` | string | Header title + `aria-label` |
| `footer` | ReactNode? | Optional sticky footer below scrollable body |
| `children` | ReactNode | Scrollable body |

Used by: `DatePicker`, `RecurringSchedulePicker`, `BookingModal`.

---

### BookingModal · `built`
`components/overlays/BookingModal.tsx`

Full booking flow modal. Service picker + date range + message + success state. Wraps `ModalSheet`.

| Prop | Type | Notes |
|------|------|-------|
| `open` | boolean | |
| `onClose` | () => void | |
| `provider` | ProviderCard | |
| `services` | ProviderServiceOffering[] | Full offerings for service picker + pricing |
| `defaultService` | ServiceType? | Pre-selects on open |

Used in: provider profile page.

---

### NotificationsPanel · `built`
`components/ui/NotificationsPanel.tsx`

Dropdown notification panel anchored to the Bell icon in AppNav. Not a `ModalSheet` — renders as a positioned dropdown relative to its wrapper ref.

| Prop | Type | Notes |
|------|------|-------|
| `open` | boolean | |
| `onClose` | () => void | |
| `wrapperRef` | RefObject | Used to calculate position and close on outside click |

---

## Group 4 — App Layout
_Page-level chrome and structural wrappers. Route-aware. Not reusable across arbitrary contexts._

### AppNav · `built · documented`
`components/layout/AppNav.tsx`

Top navigation bar. Selects one of three link configurations based on the current route. Logo is always present and links to `/`. Uses contained (max-width) layout on `/`, `/signin`, `/signup/*`, `/styleguide/*`.

| Mode | Route condition | Right-side content |
|------|-----------------|--------------------|
| Guest | All other routes | Sign In (hidden on mobile) + Sign Up + ··· trigger |
| Signup / Styleguide | `/signup/*` or `/styleguide/*` | ··· trigger only |
| Logged | `/explore/*`, `/inbox/*`, `/bookings/*`, `/profile/*` | Search + Offer Care + icon row (Bell, Messages, Bookings) + avatar |

---

### BottomNav · `built · documented`
`components/layout/BottomNav.tsx`

Mobile-only 4-tab bar. Only visible on logged-in routes. Hidden on: provider profile, individual inbox threads, explore results when a service filter is active. Active tab uses Phosphor `weight="fill"`.

Tabs: Explore → `/explore/results`, Bookings → `/bookings`, Inbox → `/inbox`, Profile → `/profile`.

---

### FormHeader · `built · documented`
`components/layout/FormHeader.tsx`

Heading block for multi-step forms. Renders `<h1 className="heading">` + `<p className="subheading">`. Optionally shows `SignupProgressBar` — either auto-detected from `/signup/*` route or via explicit `showProgress` prop.

| Prop | Type |
|------|------|
| `title` | string |
| `subtitle` | string |
| `showProgress` | boolean? |

---

### FormFooter · `built · documented`
`components/layout/FormFooter.tsx`

Sticky back + continue nav for multi-step forms. Back = tertiary CTA, Continue = primary CTA.

| Prop | Type | Notes |
|------|------|-------|
| `onBack / onContinue` | () => void | |
| `disableContinue` | boolean? | |
| `continueLabel` | string? | Defaults to "Save & Continue" |

---

### GuestLayout · `built`
`components/layout/GuestLayout.tsx`

Layout wrapper for guest-only pages (landing, signin). Provides any guest-specific layout context.

---

## Group 5 — Content Cards
_Card components for displaying content. All render as links or contain clear interaction affordances._

### CardExploreResult · `built · documented`
`components/explore/CardExploreResult.tsx`

Provider result card. The entire card is a `<Link>`. `returnQuery` carries full filter state into the profile URL so back navigation can restore results.

| Prop | Type | Notes |
|------|------|-------|
| `provider` | ProviderCard | name, district, neighborhood, rating, reviewCount, priceFrom, priceUnit, blurb, avatarUrl, services[] |
| `activeService` | ServiceType? | Filter context |
| `returnQuery` | string? | Full query string for back-nav restoration |

Trust signals (conditional): `distanceKm`, `neighbourhoodMatch`, `mutualConnections`.

---

### BookingRow · `built`
`components/ui/BookingRow.tsx`

Booking list item. Used in both "My Bookings" and "My Services" tabs on the bookings page. Shows: avatar, provider name, schedule label, live session indicator dot, service chips, status badge, pricing.

| Prop | Type |
|------|------|
| `booking` | Booking |

---

### ProfileHeader · `built`
`components/explore/ProfileHeader.tsx`

Provider profile header with two display states controlled by scroll position.

| Prop | Type |
|------|------|
| `provider` | ProviderCard |
| `state` | `"expanded" \| "condensed"` |
| `onContact` | () => void |

**Expanded:** avatar, name, location, rating, trust signals, "Contact [Name]" CTA (md).
**Condensed:** avatar, name, location, "Contact" CTA (sm).

---

## Group 6 — Explore Feature
_Components specific to the Explore section. Live in `components/explore/`._

### FilterPanelDesktop · `built`
`components/explore/FilterPanelDesktop.tsx`

Left sidebar filter panel, visible at ≥804px. Two-page slide track: service chooser → filter fields. Contains `FilterBody`.

---

### FilterPanelMobile · `built`
`components/explore/FilterPanelMobile.tsx`

Full-screen filter panel for mobile. Slide-up from bottom. Opened via filter button. Contains `FilterBody`.

---

### FilterPanelShell · `built`
`components/explore/FilterPanelShell.tsx`

Shared layout shell for both desktop and mobile filter panels. Provides sticky header, scrollable body, and sticky footer slots. Used by `FilterPanelDesktop` and `FilterPanelMobile`.

---

### FilterBody · `built`
`components/explore/FilterBody.tsx`

Shared filter content used by both desktop and mobile panels. Contains: service type, date, distance radius, price range, sub-services, days of week, time windows. Uses: `CheckboxRow`, `Slider`, `MultiSelectSegmentBar`, `DatePicker`.

Contains an inline `Accordion` sub-component (open/close chevron pattern). If Accordion is needed elsewhere, extract it.

---

### MapView · `built`
`components/explore/MapView.tsx` + `MapViewInner.tsx`

Leaflet map with SSR-safe dynamic import wrapper (`MapView` wraps `MapViewInner` via `next/dynamic`). Displays provider pins on the explore results map view.

---

## Group 7 — Messaging (Inbox)
_Components specific to the inbox / conversation flow. Currently all inline in `ThreadClient.tsx`._

### InquiryForm · `built`
`components/messaging/InquiryForm.tsx`

The core inquiry submission form shown in a new conversation thread. Handles service type, sub-service, pet selection, booking type (one-off / ongoing), date range or recurring schedule, and auto-generated message draft. Exports `InquirySubmitData` type for `onSubmit` callback.

| Prop | Type |
|------|------|
| `conv` | Conversation |
| `initialService` | ServiceType? |
| `initialStart / initialEnd` | string? |
| `onSubmit` | (data: InquirySubmitData) => void |

---

### BookingProposalCard · `built`
`components/messaging/BookingProposalCard.tsx`

Message card for booking proposals sent by the provider. Shows: service, pets, dates/schedule, price breakdown. Owner can Accept (→ signing modal) or Decline. Accepted/declined states display a status label instead of actions.

| Prop | Type |
|------|------|
| `msg` | ChatMessage |
| `canRespond` | boolean |
| `onAccept / onDecline` | (msgId: string) => void |

---

### InquiryChips · `built`
`components/messaging/InquiryChips.tsx`

Summary chip row pinned above the message list once an inquiry is sent. Shows: service, sub-service, pets, dates/schedule, ongoing badge.

---

## Group 8 — Signup Flow
_Components that only appear in the `/signup/*` flow._

### SignupProgressBar · `built`
`components/signup/SignupProgressBar.tsx`

Step progress indicator. Auto-determines current step from route slug. Used by `FormHeader` when `showProgress` is true.

| Prop | Type |
|------|------|
| `slug` | string — e.g. `"profile"`, `"pet"` |
| `showMeta` | boolean |

---

### SignupProfilePreview · `built`
`components/signup/SignupProfilePreview.tsx`

Live preview card shown during the profile signup step. Updates in real-time as the user fills in name, bio, location.

---

## Group 9 — Landing
_Components used only on the public landing page._

### HowItWorksTabs · `built`
`components/landing/HowItWorksTabs.tsx`

Tab switcher for the "How it works" section. Owner / Sitter views.

---

## Group 10 — CSS Patterns
_No React wrapper. Applied via class names. Worth knowing about for consistency._

| Pattern | Key classes | Where used | Notes |
|---------|-------------|-----------|-------|
| **Pill (interactive)** | `.pill`, `.pill.active` | Explore results, availability slots | Multi-select toggle. Brand accent when active. |
| **Service switcher trigger** | `.filter-service-trigger` | FilterPanelDesktop sidebar header | Single dropdown trigger; icon + label + caret. |
| **Tag** _(canonical)_ | `.tag` | CardExploreResult, any compact label | Flat, 4px radius, 11px fine text. Replaces `.result-service-tag`. |
| **Chip** _(canonical)_ | `.chip` | Profile service bands, booking attrs | Pill radius, 12px, can contain icon (`chip > svg`). Replaces `.svc-weight-chip`, `.profile-service-chip`. |
| Inquiry chip | `.inbox-inquiry-chip` | Inbox thread | Read-only context chip — migrate to `.chip` when inbox is touched. |
| Booking chip | `.booking-chip` | Bookings detail page | Brand-tinted service label — migrate to `.tag` when bookings is touched. |
| Utility pill | `.sg-btn-ctrl-pill` | Style guide controls only | Mono, outline-only, active = text-primary stroke. |
| Group nav pill | `.sg-group-pill` | Style guide secondary nav | Larger interactive pill for page-level grouping. Canonical pill-as-tab pattern. |
| Avatar | `.avatar` | CardExploreResult, BookingRow | 40×40 circle image. |
| Filter accordion | `.filter-accordion`, `.filter-accordion-btn` | FilterBody | Inline in FilterBody. |

---

## Action backlog

_Ordered by impact vs. effort._

| # | Action | Type | Effort | Status | Covers |
|---|--------|------|--------|--------|--------|
| 1 | Delete `TopNavDesktop.tsx` | Cleanup | XS | ✅ Done | Dead code |
| 2 | Delete `ContactModal.tsx` | Cleanup | XS | ✅ Done | Dead code |
| 3 | Delete `CheckOptionRow.tsx` | Cleanup | XS | ✅ Done | Dead code |
| 4 | Rename `ProviderHeaderState` → `ProfileHeader` | Rename | S | ✅ Done | Rename candidates |
| 5 | Rename `ExploreFilterPanel*` → `FilterPanel*` | Rename | S | ✅ Done | Rename candidates |
| 6 | Rename `.left-*` CSS → `.filter-*` | CSS refactor | S | ✅ Done | CSS naming |
| 7 | Move `AppNav`, `BottomNav`, `GuestLayout`, `FormHeader`, `FormFooter` → `components/layout/` | Restructure | S | ✅ Done | Folder structure |
| 8 | Move `ModalSheet`, `BookingModal` → `components/overlays/` | Restructure | S | ✅ Done | Folder structure |
| 9 | Extract `BookingRow` → `components/ui/BookingRow.tsx` | Extract | M | ✅ Done | Inline components |
| 10 | Extract `InquiryForm`, `BookingProposalCard`, `InquiryChips` → `components/messaging/` | Extract | L | ✅ Done | Folder structure + inline components |
| 11 | Consolidate `RangeSlider` + `DualRangeSlider` → single `Slider` with `dual` prop | Consolidate | M | ✅ Done | Selection controls |
| 12 | Add style guide sections for: `DatePicker`, `RecurringSchedulePicker`, `BookingModal` | Document | M | ✅ Done | Style guide gaps |
| 13 | Add style guide sections for: `ProfileHeader`, `FilterBody` accordion pattern | Document | M | ✅ Done | Style guide gaps |
