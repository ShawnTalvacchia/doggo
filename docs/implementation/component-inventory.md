---
category: implementation
status: active
last-reviewed: 2026-04-06
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
                  RecurringSchedulePicker, BookingRow, EmptyState,
                  TabBar, ConnectionIcon, DefaultAvatar
  layout/       ← App chrome: AppNav, BottomNav, Sidebar, LoggedInShell, FormHeader, FormFooter, GuestLayout, DetailHeader, MasterDetailShell, PanelBody, Spacer, LayoutSection, LayoutList
  overlays/     ← ModalSheet, BookingModal
  explore/      ← FilterPanelDesktop, FilterPanelMobile, FilterPanelShell, FilterBody, ProfileHeader,
                  CardExploreResult, MapView
  signup/       ← SignupProgressBar, SignupProfilePreview
  messaging/    ← InquiryForm, BookingProposalCard, InquiryChips, InquiryResponseCard,
                  ProposalForm, RelationshipBanner, PaymentCard, ContractCard, SigningModal
  activity/     ← CardScheduleMeet, CardMyMeet, MyScheduleTab, ServicesTab
  bookings/     ← CancelBookingModal, BookingListCard
  landing/      ← HowItWorksTabs
  posts/        ← TagPill, PostPhotoGrid, PawReaction, TagAutocomplete
  discover/     ← DiscoverShell
  feed/         ← FeedCard, FeedMeetRecap,
                  FeedUpcomingMeet, FeedConnectionActivity, FeedConnectionNudge,
                  FeedCarePrompt, FeedMilestone, FeedDogMoment, FeedCareReview,
                  FeedCTA, MomentCard, MomentCardFromPost
  meets/        ← MeetCard, MeetCardCompact, ParticipantCard, ParticipantList,
                  PostMeetReveal, ShareMeetModal
  chat/         ← SystemMessage
  groups/       ← GroupCard
  home/         ← UpcomingPanel
  profile/      ← ProfileHeaderOwn, TrustSignalBadges, PostsTab, TagApprovalSetting,
                  PetCard, PetEditCard, ProfileAboutTab, ProfileServicesTab
hooks/            ← useScrollHideNav
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

### EmptyState · `built`
`components/ui/EmptyState.tsx`

Standardised empty state pattern. Icon + title + optional subtitle + optional CTA action slot. Used on Schedule page empty sections and anywhere a "nothing here yet" state is needed.

| Prop | Type | Notes |
|------|------|-------|
| `icon` | ReactNode | Phosphor icon, renders in `text-fg-tertiary` |
| `title` | string | Primary message |
| `subtitle` | string? | Secondary message |
| `action` | ReactNode? | Optional CTA (ButtonAction) |

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
| Logged (hub pages) | `/home`, `/discover`, `/schedule`, `/bookings` | Logo + Create (+) + Notifications bell (with badge) + Inbox chat (with badge) |

---

### BottomNav · `built · documented`
`components/layout/BottomNav.tsx`

Mobile-only 5-tab bar. Only visible on hub pages. Hidden on detail pages (replaced by DetailHeader). Active tab uses Phosphor `weight="fill"`.

Tabs: Home → `/home`, Discover → `/discover`, My Schedule → `/schedule`, Bookings → `/bookings`, Profile → `/profile`.

Icons: House, MagnifyingGlass, CalendarDots, Briefcase, UserCircle (Phosphor, regular/fill).

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

### DetailHeader · `built`
`components/layout/DetailHeader.tsx`

Reusable back-button header for detail pages. Replaces inline back links/buttons across the app. Sticky, with optional centred title and right-side action slot.

| Prop | Type | Notes |
|------|------|-------|
| `backHref` | string? | Fixed back destination. If omitted, uses `router.back()` |
| `backLabel` | string? | Label next to back arrow. Defaults to "Back" |
| `title` | string? | Optional centred page title |
| `rightAction` | ReactNode? | Optional right-side action element |

**Used on:** Group detail, meet detail, booking detail, checkout, user profile.

---

### Sidebar · `built`
`components/layout/Sidebar.tsx`

Desktop-only sidebar nav (200px). 7 items: Home, Discover, My Schedule, Bookings, Inbox, Notifications, Profile. "DOGGO" logo at top in Poppins Black. Active state detection mirrors BottomNav logic. Icons: House, MagnifyingGlass, CalendarDots, Briefcase, ChatCircleDots, Bell, UserCircle (Phosphor, light weight, fill when active).

---

### LoggedInShell · `built`
`components/layout/LoggedInShell.tsx`

Layout wrapper for all logged-in pages. Renders Sidebar + centered content area (max-width 640px) + optional side panel or spacer. All logged-in pages render inside this shell via GuestLayout.

---

### MasterDetailShell · `built`
`components/layout/MasterDetailShell.tsx`

Reusable two-or-three column layout used across Home, My Schedule, Inbox, and Discover. Desktop: panels side by side (list 320px | detail flex | optional info 280px). Mobile: one panel visible at a time via `mobileView` prop ("list" | "detail" | "info"). Three-column mode enabled by passing `infoPanel`.

| Prop | Type | Notes |
|------|------|-------|
| `listPanel` | ReactNode | Left panel content |
| `detailPanel` | ReactNode? | Center/right panel content |
| `infoPanel` | ReactNode? | Right panel (three-column mode, e.g. Inbox) |
| `mobileView` | "list" \| "detail" \| "info" | Controls which panel shows on mobile. Default: "list" |

---

### PanelBody · `built`
`components/layout/PanelBody.tsx`

Scrollable body area inside any panel. Replaces the old `list-panel-scroll` / `detail-panel-scroll` wrappers. Use inside raw `<div className="list-panel">` or `<div className="detail-panel">` divs.

| Prop | Type | Notes |
|------|------|-------|
| `children` | ReactNode | Panel body content (LayoutSection, LayoutList, Spacer, etc.) |
| `className` | string? | Additional class names |

---

### Spacer · `built`
`components/layout/Spacer.tsx`

Flex-fill element placed at the bottom of PanelBody. Fills remaining vertical space with `surface-popout` background, giving a "content floating on inset" feel. Has a min-height to ensure bottom breathing room.

| Prop | Type | Notes |
|------|------|-------|
| `size` | "sm" \| "md" \| "lg" | Min-height variant: sm (24px), md (48px, default), lg (80px) |
| `className` | string? | Additional class names |

---

### LayoutSection · `built`
`components/layout/LayoutSection.tsx`

Padded content block inside PanelBody. Provides 16px horizontal padding for content that isn't edge-to-edge cards.

| Prop | Type | Notes |
|------|------|-------|
| `py` | "lg" \| "xl"? | Vertical padding variant |
| `fill` | boolean? | Fill remaining vertical space instead of hugging content |
| `children` | ReactNode | Section content |
| `className` | string? | Additional class names |

---

### LayoutList · `built`
`components/layout/LayoutList.tsx`

Edge-to-edge list container inside PanelBody. No horizontal padding — cards go flush to panel edges.

| Prop | Type | Notes |
|------|------|-------|
| `gap` | "xs" \| "sm" \| "md" \| "lg"? | Gap between items |
| `direction` | "column" \| "row"? | Flex direction (default: column) |
| `children` | ReactNode | List content (cards, rows) |
| `className` | string? | Additional class names |

---

### GuestLayout · `built`
`components/layout/GuestLayout.tsx`

Layout wrapper that switches between guest (AppNav) and logged-in (LoggedInShell) layouts based on route.

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
_Components specific to the inbox / conversation flow._

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

### InquiryResponseCard · `built`
`components/messaging/InquiryResponseCard.tsx`

Shown to the carer when a booking inquiry exists but no proposal has been sent yet. Displays inquiry summary as pills and three action buttons: Send Proposal, Suggest Changes, Decline (with optional reason).

---

### ProposalForm · `built`
`components/messaging/ProposalForm.tsx`

Simplified proposal builder for carers. Opens in a ModalSheet. Pre-fills from inquiry data (service, pets, schedule). Carer can adjust sub-service and price before sending.

---

### RelationshipBanner · `built`
`components/messaging/RelationshipBanner.tsx`

Trust context banner shown at the top of booking conversation threads. Shows connection state, meets shared, and how they met. Extracted from ThreadClient.tsx in Phase 12.

---

### PaymentCard · `built`
`components/messaging/PaymentCard.tsx`

Payment summary/confirmation card rendered in booking conversations. Shows line items, platform fee, total. Uses ButtonAction for the "Pay through Doggo" CTA. Extracted from ThreadClient.tsx in Phase 12.

---

### ContractCard · `built`
`components/messaging/ContractCard.tsx`

Contract signed confirmation card. Shows service, pets, start date, carer name, and link to booking detail. Extracted from ThreadClient.tsx in Phase 12.

---

### SigningModal · `built`
`components/messaging/SigningModal.tsx`

Contract review modal (ModalSheet). Shows carer info, service details, schedule, pricing breakdown, and "Sign & Book" / "Not yet" actions using ButtonAction. Extracted from ThreadClient.tsx in Phase 12.

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
_Components used only on the public landing page. Inline sub-components in `app/page.tsx`._

### HowItWorksTabs · `built`
`components/landing/HowItWorksTabs.tsx`

Tab switcher for the "How it works" section. Owner / Sitter views.

---

### MeetTypeCard · `built`
`app/page.tsx` (inline)

Photo card for the "Meets for every dog" section. SVG illustration + title + description.

| Prop | Type |
|------|------|
| `imgSrc` | string |
| `title` | string |
| `description` | string |

---

### ArchetypeCard · `built`
`app/page.tsx` (inline)

Card with coloured left ribbon for the "Everyone uses Doggo differently" section. Icon in a tinted circle + label + description. Accent colour passed as CSS variable.

| Prop | Type | Notes |
|------|------|-------|
| `icon` | ReactNode | Phosphor icon |
| `label` | string | e.g. "The Regular" |
| `description` | string | |
| `accentColor` | string | CSS variable, e.g. `var(--status-info-main)` |

---

### TestimonialCard · `built`
`app/page.tsx` (inline)

Social proof card with quote, author name, detail line, and avatar.

| Prop | Type |
|------|------|
| `quote` | string |
| `name` | string |
| `detail` | string |
| `avatarUrl` | string |

---

## Group 10 — Booking & Care (Phase 7)
_Components added for the community-native care layer._

_RelationshipBanner and PaymentCard moved to `components/messaging/` in Phase 12. See Group 7._

### CommunityCarersSection · `built`
`app/explore/results/page.tsx` (inline)

"From your community" section shown above marketplace results on the explore page. Filters Connected carers by selected service type.

### CareFromNetwork · `built`
`app/home/page.tsx` (inline)

"Care from your network" section on the Home page. Shows Connected users who offer care with meets-together context and pricing.

### CarerTrustCard · `built`
`app/bookings/[bookingId]/page.tsx` (inline)

Trust context card on booking detail page. Shows carer's connection state, shared meets, location, and profile link.

---

## Group 11 — CSS Patterns
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

---

## Phase 8 — New Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `HomeWelcome` | `components/home/HomeWelcome.tsx` | New user welcome hero on Home (personalised greeting, dog photos, CTAs) | `built` |
| `DogsNearYou` | `components/home/DogsNearYou.tsx` | Horizontal scroll of neighbourhood dogs from meet attendees | `built` |
| `MeetCard` | `components/meets/MeetCard.tsx` | Meet list card: type badge, group link, meta row, type-specific summary pills (pace/distance for walks, drop-in window for hangouts, age/play style for playdates, skills for training), energy level badge, attendee avatars, spots remaining, activity indicator | `built` |
| `MeetRecapHeader` | `components/meets/MeetRecapHeader.tsx` | Post-meet recap summary (title, date, people/dogs/duration stats) | `built` |
| `MeetPhotoGallery` | `components/meets/MeetPhotoGallery.tsx` | Responsive photo grid for completed meets + "Add yours" placeholder | `built` |
| `ShareMeetModal` | `components/meets/ShareMeetModal.tsx` | Share/invite modal using ModalSheet (preview card, copy link, share-via icons) | `built` |
| `TrustSignalBadges` | `components/profile/TrustSignalBadges.tsx` | Relationship depth badges ("Walked together X times", "Known since", "Met at") | `built` |

---

## Phase 9 — New Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `GroupCard` | `components/groups/GroupCard.tsx` | Community card for browse/list. Shows: circular cover photo, bold name, type badge (Park/Community/Hosted with icon), visibility badge (Approval), location, member count, dog count, upcoming events count. Badges derived from group archetype. | `built` |
| `MessageBubble` | `components/chat/MessageBubble.tsx` | Shared chat bubble (extracted from meet detail, used by meet + group chat) | `built` |

---

## Phase 10 — New Components

### Post Components (`components/posts/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `TagPill` / `TagPillRow` | `components/posts/TagPill.tsx` | Tag display pill with 4 variants (dog/person/community/place), tappable links | `built` |
| `PostPhotoGrid` | `components/posts/PostPhotoGrid.tsx` | Responsive photo layout: 1=full, 2=side-by-side, 3=1+2, 4=2x2 grid | `built` |
| `PawReaction` | `components/posts/PawReaction.tsx` | Paw-print reaction toggle with count + "Paws" label | `built` |
| `TagAutocomplete` | `components/posts/TagAutocomplete.tsx` | Search input for tagging dogs, people, communities, places with grouped dropdown | `built` |

### Feed Components (`components/feed/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `FeedCard` | `components/feed/FeedCard.tsx` | Shared card wrapper: author header, timestamp, group badge, connection context | `built` |
| ~~`FeedPersonalPost`~~ | ~~`components/feed/FeedPersonalPost.tsx`~~ | Superseded by `MomentCard`. Deleted Phase 20. | `archived` |
| ~~`FeedCommunityPost`~~ | ~~`components/feed/FeedCommunityPost.tsx`~~ | Superseded by `MomentCard`. Deleted Phase 20. | `archived` |
| `FeedMeetRecap` | `components/feed/FeedMeetRecap.tsx` | Meet recap card: photo strip, attendee count, "View recap" link | `built` |
| `FeedUpcomingMeet` | `components/feed/FeedUpcomingMeet.tsx` | Upcoming meet card: compact meet info + "Join" pill | `built` |
| `FeedConnectionActivity` | `components/feed/FeedConnectionActivity.tsx` | Connection event card: "[Name] added [service]" + context | `built` |
| `FeedConnectionNudge` | `components/feed/FeedConnectionNudge.tsx` | Connection suggestion: shared meets context + "Say hi" button | `built` |
| `FeedCarePrompt` | `components/feed/FeedCarePrompt.tsx` | Contextual care CTA: find care or offer care prompt | `built` |
| `FeedMilestone` | `components/feed/FeedMilestone.tsx` | Ambient stat card: neighbourhood milestone, no CTA | `built` |
| `FeedDogMoment` | `components/feed/FeedDogMoment.tsx` | Dog event card: birthday, new dog, tagged notification | `built` |
| `FeedCareReview` | `components/feed/FeedCareReview.tsx` | Care review card: reviewer/carer avatars, star rating, quote | `built` |
| ~~`CompactGreeting`~~ | ~~`components/feed/CompactGreeting.tsx`~~ | Unused after Phase 19 home redesign. Deleted Phase 20. | `archived` |
| ~~`ShareMomentBar`~~ | ~~`components/feed/ShareMomentBar.tsx`~~ | Unused after Phase 19 home redesign. Deleted Phase 20. | `archived` |
| ~~`UpcomingStrip`~~ | ~~`components/feed/UpcomingStrip.tsx`~~ | Replaced by `UpcomingPanel`. Deleted Phase 20. | `archived` |
| ~~`HomeFAB`~~ | ~~`components/feed/HomeFAB.tsx`~~ | Create action moved to header. Deleted Phase 20. | `archived` |

### Profile Components (`components/profile/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `PostsTab` | `components/profile/PostsTab.tsx` | Profile Posts tab: full post cards with photos/tags/reactions + "New post" CTA | `built` |
| `TagApprovalSetting` | `components/profile/TagApprovalSetting.tsx` | Three-option selector for tag approval (auto/approve/none) | `built` |

---

## Phase 11 — New Components

### Explore Components (`components/explore/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `TrustGateBanner` | `components/explore/TrustGateBanner.tsx` | Contextual banner explaining why care actions are locked (none/familiar/pending states) | `built` |

### Booking Components (`components/bookings/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `CancelBookingModal` | `components/bookings/CancelBookingModal.tsx` | Modal for cancelling a booking with optional reason textarea | `built` |

### New Pages

| Page | Path | Purpose | Status |
|------|------|---------|--------|
| Checkout | `app/bookings/[bookingId]/checkout/page.tsx` | Payment mock: summary card, price breakdown with platform fee, mock payment method, pay button + confirmation state | `built` |

---

## Phase 12 — New & Extracted Components

### UI Primitives (`components/ui/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `EmptyState` | `components/ui/EmptyState.tsx` | Standardised empty state: icon + title + optional subtitle + optional CTA | `built` |

### Messaging Components (`components/messaging/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `InquiryResponseCard` | `components/messaging/InquiryResponseCard.tsx` | Carer inquiry response: inquiry summary pills + Send Proposal / Suggest Changes / Decline actions | `built` |
| `ProposalForm` | `components/messaging/ProposalForm.tsx` | Carer proposal builder (ModalSheet): pre-fills from inquiry, editable price | `built` |
| `RelationshipBanner` | `components/messaging/RelationshipBanner.tsx` | Trust context banner (extracted from ThreadClient) | `built` |
| `PaymentCard` | `components/messaging/PaymentCard.tsx` | Payment summary card (extracted from ThreadClient, uses ButtonAction) | `built` |
| `ContractCard` | `components/messaging/ContractCard.tsx` | Contract signed card (extracted from ThreadClient) | `built` |
| `SigningModal` | `components/messaging/SigningModal.tsx` | Contract review modal (extracted from ThreadClient, uses ButtonAction) | `built` |

### Booking Components (`components/bookings/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `BookingListCard` | `components/bookings/BookingListCard.tsx` | Compact booking row for schedule/list views (extracted from schedule page) | `built` |

### Profile Components (`components/profile/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `PetCard` | `components/profile/PetCard.tsx` | Pet view card: photo, identity, energy/play badges, socialisation, vet info, photo gallery | `built` |
| `PetEditCard` | `components/profile/PetEditCard.tsx` | Pet edit form: all fields editable, photo upload, vet info, play styles | `built` |
| `ProfileAboutTab` | `components/profile/ProfileAboutTab.tsx` | About tab: bio, dogs (view/add/edit), connections, tag prefs, care CTAs | `built` |
| `ProfileServicesTab` | `components/profile/ProfileServicesTab.tsx` | Services tab: offer care toggle, service configs, availability grid, visibility | `built` |

### Key Refactors

| File | Before | After | Change |
|------|--------|-------|--------|
| `ThreadClient.tsx` | 664 lines | 492 lines | 4 components extracted to `components/messaging/`, carer actions added |
| `profile/page.tsx` | 1,438 lines | 297 lines | 4 components extracted to `components/profile/` |
| `schedule/page.tsx` | 226 lines | 216 lines | Booking cards extracted to `BookingListCard`, inline styles removed, `EmptyState` adopted |
| `globals.css` | 9,720 lines | 8,873 lines | 95 dead classes removed |

---

## Phase 14 — New Components

### UI Primitives (`components/ui/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `TabBar` | `components/ui/TabBar.tsx` | Reusable tab bar with active state, used by Activity page and other tabbed views | `built` |

### Activity Components (`components/activity/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| ~~`DiscoverTab`~~ | ~~`components/activity/DiscoverTab.tsx`~~ | Superseded by Discover hub pages. Deleted Phase 20. | `archived` |
| `MyScheduleTab` | `components/activity/MyScheduleTab.tsx` | Personal schedule — Upcoming/History toggle, unified meet + booking timeline | `built` |
| `ServicesTab` | `components/activity/ServicesTab.tsx` | Provider dashboard — visibility, stats, service cards, requests, active bookings (replaced BookingsTab in Phase 17) | `built` |

### Chat Components (`components/chat/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `SystemMessage` | `components/chat/SystemMessage.tsx` | Centered muted system/activity message in group chat (member_joined, meet_posted, rsvp_milestone) | `built` |

### Meet Components (`components/meets/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `MeetCardCompact` | `components/meets/MeetCardCompact.tsx` | Compact horizontal meet card for event card strip at top of community chat | `built` |
| `ParticipantCard` | `components/meets/ParticipantCard.tsx` | Attendee card with connection icon, relationship signals, dog breed, neighbourhood, and Connect CTA | `built` |
| `ParticipantList` | `components/meets/ParticipantList.tsx` | Tiered participant list: Connected (Tier 1) → Familiar/Open (Tier 2) → hidden count (Tier 3). Splits going/interested. | `built` |
| `PostMeetReveal` | `components/meets/PostMeetReveal.tsx` | Post-meet reveal of hidden (Tier 3) attendees with Familiar/Connect/Skip actions and bulk "Mark all" | `built` |

### Connection & Trust (`components/ui/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `ConnectionIcon` | `components/ui/ConnectionIcon.tsx` | Phosphor icon for connection state (Connected=handshake, Familiar=eye/check, Open=globe). Optional label. | `built` |
| `DefaultAvatar` | `components/ui/DefaultAvatar.tsx` | Initials-on-colour avatar for users with no photo. Colour derived from name for consistency. | `built` |

---

## Phase 16 — New Components

### Layout Components (`components/layout/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `Sidebar` | `components/layout/Sidebar.tsx` | Desktop sidebar nav (200px): Home, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Logo in Poppins Black. Active state with fill icons. | `built` |
| `LoggedInShell` | `components/layout/LoggedInShell.tsx` | Layout wrapper: Sidebar + max-width content (640px) + optional side panel or spacer | `built` |

### Key Changes

| File | Change |
|------|--------|
| `BottomNav.tsx` | Phase 16: 4→5 tabs, Communities→Groups, Activity→Activities. Phase 18: 5→4 tabs (Home, Discover, My Schedule, Bookings). Phase 19: 4→5 tabs (added Profile). |
| `GuestLayout.tsx` | Now routes logged-in pages through LoggedInShell |
| `globals.css` | Added `--sidebar-width`, `--content-max-width`, `.sidebar`, `.logged-shell`, `.page-container` |
| `layout.tsx` | Added Poppins weight 900 for sidebar logo |

---

## Phase 17 — New & Updated Components

### Activity Components (`components/activity/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `CardMyMeet` | `components/activity/CardMyMeet.tsx` | My Schedule card variant: role badge (Hosting/Joining/Interested), 5 attendee avatars, hosting left border, history muted variant. No CTA buttons. | `built` |
| `CardScheduleMeet` | `components/activity/CardScheduleMeet.tsx` | Discover tab card (unchanged from Phase 16): browsing context with CTA, social proof, spots left | `built` |
| `ServicesTab` | `components/activity/ServicesTab.tsx` | Provider dashboard replacing BookingsTab: visibility status, stats strip, service cards, requests, active bookings | `built` |

### Key Changes

| File | Change |
|------|--------|
| `MyScheduleTab.tsx` | Redesigned: Upcoming/History toggle, type filter pills, unified timeline (meets + bookings via BookingBlock), CardMyMeet replaces MeetCard |
| `BookingsTab.tsx` | Removed — replaced by ServicesTab |
| `globals.css` | Added `.schedule-toggle`, `.schedule-toggle-btn`, `.card-my-meet--hosting`, `.card-my-meet--history`, `.card-my-meet-badge`, `.services-toggle` |

---

## Phase 19 — New & Updated Components

### Layout Components (`components/layout/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `MasterDetailShell` | `components/layout/MasterDetailShell.tsx` | Reusable 2-or-3 column layout (list \| detail \| optional info). Desktop: side by side. Mobile: one panel at a time via `mobileView` prop. | `built` |
| `PanelBody` | `components/layout/PanelBody.tsx` | Scrollable body area inside any panel (replaces list-panel-scroll / detail-panel-scroll). | `built` |
| `Spacer` | `components/layout/Spacer.tsx` | Flex-fill bottom element with surface-popout background and min-height variants. | `built` |
| `LayoutSection` | `components/layout/LayoutSection.tsx` | Padded content block (16px horizontal) inside PanelBody. | `built` |
| `LayoutList` | `components/layout/LayoutList.tsx` | Edge-to-edge list container inside PanelBody. | `built` |

### Discover Components (`components/discover/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `DiscoverShell` | `components/discover/DiscoverShell.tsx` | Shared three-panel layout shell for all Discover sub-pages (Meets, Groups, Dog Care). Provides hub panel (left), results panel (middle), and map panel (right) on desktop. On mobile, supports tabbed Results/Filters view via TabBar. Accepts custom `hubPanel`, `resultsContent`, and `rightPanel` as props. Props: `hubPanel: ReactNode`, `resultsTitle: string`, `resultsIcon?: ReactNode`, `activeService?: ServiceType`, `maxResults?: number`, `resultsContent?: ReactNode`, `rightPanel?: ReactNode`, `hideRightPanel?: boolean`, `mobileShowResults?: boolean`. | `built` |

### Feed Components (`components/feed/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `MomentCard` | `components/feed/MomentCard.tsx` | Unified photo moment card — replaces FeedPersonalPost, FeedCommunityPost, and FeedMeetRecap as the primary feed content type. Shows photo(s) with caption, author, group/meet context, tags, and paw reaction. | `built` |
| `MomentCardFromPost` | `components/feed/MomentCard.tsx` | Convenience wrapper that accepts a `Post` object and maps it to `MomentCard` props. | `built` |
| ~~`FeedUpdate`~~ | ~~`components/feed/FeedUpdate.tsx`~~ | Never imported. Deleted Phase 20. | `archived` |
| `FeedCTA` | `components/feed/FeedCTA.tsx` | Call-to-action card in the feed prompting user engagement (e.g. complete profile, try a feature). | `built` |

### Home Components (`components/home/`)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `UpcomingPanel` | `components/home/UpcomingPanel.tsx` | Upcoming events sidebar panel on home page showing scheduled meets and bookings. Contains internal `CardUpcomingEvent` sub-component. | `built` |

### Hooks (`hooks/`)

| Hook | Path | Purpose | Status |
|------|------|---------|--------|
| `useScrollHideNav` | `hooks/useScrollHideNav.ts` | Detects scroll direction inside mobile scroll containers and toggles `nav-hidden` class on `<body>` to auto-hide top/bottom nav bars. Includes cooldown timer (400ms) to prevent feedback loops during CSS transitions, and a content-depth threshold so it only activates on pages with enough scrollable content. Only active on viewports ≤ 767px. | `built` |

### Key Changes

| File | Change |
|------|--------|
| `BottomNav.tsx` | 4→5 tabs: added Profile (UserCircle icon) |
| `AppNav.tsx` | Logged header: avatar removed, Create (+) button added. Icons: Plus (create), Bell (notifications), ChatCircleDots (inbox). Fixed `unread` → `unreadCount` type error. |
| `Sidebar.tsx` | 6→7 items: added Notifications (Bell icon) |
| `globals.css` | Added `.md-shell`, `.list-panel`, `.detail-panel` CSS with mobile collapse rules |
| `app/notifications/page.tsx` | New placeholder page for `/notifications` route |
