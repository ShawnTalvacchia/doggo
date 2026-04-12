---
category: feature
status: built
last-reviewed: 2026-04-13
tags: [discover, care, booking, providers, map, payment, trust-gating]
review-trigger: "when modifying Discover Care tab, provider profiles, booking flows, payment, or map"
---

# Explore & Care

Provider discovery, care booking, payment, and session tracking — the care marketplace that emerges from community trust.

---

## Overview

Care discovery lives within the **Discover hub** as one of three doors. The Discover page (`/discover`) is now a hub with three category cards:

- **Meets** — `/discover/meets` — meet browse with filters
- **Groups** — `/discover/groups` — group browse with filters (Park, Community, Service archetypes)
- **Dog Care** — `/discover/care` — provider search with filters + map

Each door opens into its own sub-page using the **PageColumn** layout component (centered 640px single-column), which replaced the former DiscoverShell. All three doors follow the same single-page pattern: hub → results page with **FilterPillRow** (horizontal scrollable filter pills) and floating **Filters / View Results** buttons. Type picker pages have been removed — filtering happens inline via pills. Users can also reach care via "Find Care" CTAs on the Home feed. The flow covers service selection, filtered provider search with an interactive map, provider profiles with trust signals, booking conversations, payment, and session tracking.

Care arrangements sit inside existing trust relationships. Every provider card and profile shows the user's connection state with that person. **Connection state gates all care actions** (Phase 11): non-connected users cannot book care or initiate conversations.

---

## Current State

- **Pages:** `/discover` (hub with three doors: Meets, Groups, Dog Care), `/discover/care` (provider search with filters + map), `/discover/meets` (meet browse), `/discover/groups` (group browse), `/discover/profile/[providerId]` (provider profile), `/bookings/[bookingId]` (booking detail), `/bookings/[bookingId]/checkout` (payment mock)
- **Components:** CardExploreResult, FilterPillRow, FilterPanelDesktop/Mobile, MapView (Leaflet), ProfileHeader, TrustGateBanner, CancelBookingModal, BookingRow, StatusBadge, TabBar (on detail page)
- **Data:** Mock providers, mock bookings with payment status
- **Status:** Built — full explore flow, trust-gated CTAs, payment mock, booking management

### What's built

- **Single-page discover flow:** Each door (Meets, Groups, Care) opens a results page with FilterPillRow for type/category filtering and floating Filters/View Results buttons for advanced filters. Former type picker intermediate pages removed.
- **Service selection:** Three service cards (Walk & Check-ins, In-home Sitting, Boarding) as entry point
- **Provider results:** Filterable list with price, distance, rating, services. Map with price-marker pins. Community carers section for connected providers.
- **Care filter panel:** The filter panel at `/discover/care` uses **interactive UI primitives** — MultiSelectSegmentBar for day-of-week selection, dual Slider for price range, CheckboxRow for service toggles, and an accordion pattern for expanding service sub-types. All built from existing components, not custom markup.
- **Interactive map:** Leaflet with Carto Positron tiles, price markers, 3-column desktop layout
- **Provider profiles:** Info/Services/Reviews tabs, gallery, trust signals
- **Connection gating (Phase 11):** CTAs enforced by connection state:
  - **Connected:** "Message [name]" + "Book care" — full access
  - **Familiar:** "Connect with [name]" — must connect before booking. TrustGateBanner shows context.
  - **Pending:** "Request sent" (disabled)
  - **None:** "Meet [name] first" (disabled). TrustGateBanner explains: "Attend a meet together first"
- **Payment mock (Phase 11):** Checkout page at `/bookings/[bookingId]/checkout` with summary, price breakdown (including 12% platform fee), mock payment method, pay button, confirmation state
- **Booking detail (redesigned):** Tabbed layout (Info / Sessions / Chat). Owner view shows aggregate stats (sessions completed, relationship duration, next session), CTA pill buttons (Message + Cancel). Provider view shows "You're providing" pill, session check-in actions (Start / Complete / Add note). Chat tab embeds conversation thread from ConversationsContext.
- **Rolling weekly billing:** Recurring bookings use `billingCycle: "weekly"` with rolling session generation (one upcoming session at a time). No fixed session count for ongoing arrangements.
- **Care instructions:** Owner notes (`ownerNotes`) and provider notes (`carerNotes`) on bookings. Displayed on Info tab as a care instructions section.
- **Booking list cards:** Avatar combos, Tag icon for price, weekly billing labels, divider removed for cleaner recurring cards.
- **Booking actions:** Owner can cancel (with reason via CancelBookingModal) or message. Provider can start/complete sessions and add notes. "Leave a review" stub on completed bookings.
- **My Services tab:** Provider's active clients and upcoming sessions on `/bookings?tab=services`.
- **Schedule integration (Phase 11):** Active care bookings appear on the Schedule page alongside meets

---

## Key Decisions

1. **Discover is a three-door hub** — `/discover` shows three category cards (Meets, Groups, Dog Care) instead of tabs. This is a **three-door pattern**: each door leads to its own PageColumn-based sub-page (`/discover/meets`, `/discover/groups`, `/discover/care`). Phase 19 replaced the tabbed Meets|Care layout with this hub pattern. All three sub-pages follow the same single-page flow: FilterPillRow for type filtering + floating Filters/View Results buttons for advanced filters. Type picker intermediate pages removed. Care is also accessible via "Find Care" CTAs on the Home feed.

2. **Connection state gates actions, not just appearance** — (Phase 11) Non-connected users see disabled CTAs with contextual explanations. The TrustGateBanner component explains why and suggests next steps (attend a meet, send a connect request).

3. **One profile type** — providers use the same profile layout as any user, with additional sections. See [[profiles]].

4. **Interactive map with price markers** — Leaflet map with Carto Positron tiles. Provider pins show price. Desktop 3-column; mobile list with map toggle.

5. **Platform fee shown transparently** — the checkout page shows the 12% platform fee as a separate line item. Builds trust and aligns with "no hidden costs."

6. **Provider setup consolidated** — all "Offer Care" entry points route to `/profile?tab=services`. One place to set up and manage care services.

---

## User Flows

### Find and contact a provider

```
Discover hub → Dog Care door (or Home → "Find Care" CTA)
→ Filtered provider list + map → Tap provider card
→ Provider profile (Info / Services / Reviews)
→ CTA gated by connection state:
   - Connected: "Message" or "Book care" → booking conversation
   - Familiar: TrustGateBanner → "Connect" → once connected, book
   - None: TrustGateBanner → "Meet first" (disabled) → attend a meet together → connect → book
```

### Booking lifecycle

```
Booking conversation → Proposal card (dates, service, price, dog) [not yet built]
→ Accept → Contract signed
→ Booking created (status: Active, billingCycle: weekly for recurring)
→ Sessions generated rolling (one upcoming at a time for recurring)
→ Provider: Start session → In-progress → Complete → Add note
→ All sessions done → Completed → "Leave a review" CTA
→ Review submitted → visible on provider profile [review form not yet built]
```

### Owner booking management

```
Booking detail (Info tab) → CTA buttons:
→ "Message" → switches to Chat tab (embedded conversation)
→ "Cancel ▾" → CancelBookingModal → confirmation with optional reason → status: Cancelled
```

### Provider booking management

```
Booking detail (Info tab) → "You're providing" pill shown
→ Sessions tab → per-session actions:
  → "Start session" → status: in_progress (with checkedInAt timestamp)
  → "Complete" → status: completed
  → "Add note" → text input saved to session
```

---

## Future

- **Booking proposal card** — accept/counter/decline UI in conversation thread (deferred to Inbox & Notifications phase)
- **Review form** — full review submission flow after completed bookings (currently stub button only)
- **Connection indicators on result cards** — show connection state directly in search results, not just on profile
- **Availability filtering** — search respects provider availability (data exists, filtering not wired)
- **Walker service tiers** — neighbourhood walk vs. park walk, with different pricing
- **Business profiles** — groomers, vets, pet shops as separate listing type
- **Carer-side inbox actions** — accept/decline/counter incoming inquiries from inbox thread (deferred to Inbox & Notifications phase)
- **Provider dashboard** — earnings view, availability calendar, incoming requests management
- **Session photos** — `photoUrl` field exists on BookingSession type, UI not yet built

---

## Related Docs

- [[Product Vision]] — care marketplace emerges from community trust
- [[connections]] — connection states that gate care CTAs
- [[messaging]] — booking conversations
- [[profiles]] — provider profile sections, posts tab
- [[schedule]] — bookings appear in schedule timeline
- [[phase-11-booking-care-polish]] — connection gating, payment mock, booking actions
