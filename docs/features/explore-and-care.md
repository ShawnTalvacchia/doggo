---
category: feature
status: built
last-reviewed: 2026-04-08
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

Each door opens into its own sub-page built on the **DiscoverShell** layout component, which provides a shared three-panel structure (hub navigation + results list + map) reused across all Discover sub-pages. Users can also reach care via "Find Care" CTAs on the Home feed. The flow covers service selection, filtered provider search with an interactive map, provider profiles with trust signals, booking conversations, payment, and session tracking.

Care arrangements sit inside existing trust relationships. Every provider card and profile shows the user's connection state with that person. **Connection state gates all care actions** (Phase 11): non-connected users cannot book care or initiate conversations.

---

## Current State

- **Pages:** `/discover` (hub with three doors: Meets, Groups, Dog Care), `/discover/care` (provider search with filters + map), `/discover/meets` (meet browse), `/discover/groups` (group browse), `/discover/profile/[providerId]` (provider profile), `/bookings/[bookingId]` (booking detail), `/bookings/[bookingId]/checkout` (payment mock)
- **Components:** CardExploreResult, FilterPanelDesktop/Mobile, MapView (Leaflet), ProfileHeader, TrustGateBanner, CancelBookingModal, BookingRow, StatusBadge
- **Data:** Mock providers, mock bookings with payment status
- **Status:** Built — full explore flow, trust-gated CTAs, payment mock, booking management

### What's built

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
- **Booking detail:** Session status flow, price breakdown, review section, payment status badge (Paid/Unpaid)
- **Booking actions (Phase 11):** Owner can cancel (with reason) or request modification. "Proceed to payment" CTA for unpaid bookings.
- **Schedule integration (Phase 11):** Active care bookings appear on the Schedule page alongside meets

---

## Key Decisions

1. **Discover is a three-door hub** — `/discover` shows three category cards (Meets, Groups, Dog Care) instead of tabs. This is a **three-door pattern**: each door leads to its own DiscoverShell-based sub-page (`/discover/meets`, `/discover/groups`, `/discover/care`) with consistent hub + results + map layout. Phase 19 replaced the tabbed Meets|Care layout with this hub pattern. Care is also accessible via "Find Care" CTAs on the Home feed.

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
Booking conversation → Proposal card (dates, service, price, dog)
→ Accept → Contract signed
→ Checkout page → Pay [amount] Kč → Payment confirmed
→ Booking created (status: Upcoming, paymentStatus: Paid)
→ Day of care → In-progress
→ Care completed → Completed → Review prompt
→ Review submitted → visible on provider profile
```

### Owner booking management (Phase 11)

```
Booking detail → Owner actions row:
→ "Message [carer]" → inbox conversation
→ "Request change" → modification requested banner
→ "Cancel" → CancelBookingModal → confirmation with optional reason → status: Cancelled
```

---

## Future

- **Connection indicators on result cards** — show connection state directly in search results, not just on profile
- **Availability filtering** — search respects provider availability (data exists, filtering not wired)
- **Walker service tiers** — neighbourhood walk vs. park walk, with different pricing
- **Business profiles** — groomers, vets, pet shops as separate listing type
- **Carer-side inbox actions** — accept/decline/counter incoming inquiries from inbox thread
- **Provider dashboard** — earnings view, availability calendar, incoming requests management

---

## Related Docs

- [[Product Vision]] — care marketplace emerges from community trust
- [[connections]] — connection states that gate care CTAs
- [[messaging]] — booking conversations
- [[profiles]] — provider profile sections, posts tab
- [[schedule]] — bookings appear in schedule timeline
- [[phase-11-booking-care-polish]] — connection gating, payment mock, booking actions
