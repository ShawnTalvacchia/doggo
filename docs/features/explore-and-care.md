---
category: feature
status: built
last-reviewed: 2026-03-17
tags: [explore, care, booking, providers, map]
review-trigger: "when modifying explore results, provider profiles, booking flows, or map"
---

# Explore & Care

Provider discovery, care booking, and session tracking — the care marketplace that emerges from community trust.

---

## Overview

Explore is how users find care for their dog. It's accessed via "Find Care" CTAs (not a default tab), reinforcing that care discovery is an intentional action within a community context. The flow covers service selection, filtered provider search with an interactive map, provider profiles with trust signals, booking conversations, and session tracking.

Care arrangements sit inside existing trust relationships. Every provider card and profile shows the user's connection state with that person. The path is: meet regularly → Connect → see that someone offers help → arrange care.

---

## Current State

- **Pages:** `/explore` (service selection → results with filters + map), `/explore/profile/[providerId]` (provider profile), `/bookings/[bookingId]` (booking detail)
- **Components:** CardExploreResult, ExploreFilterPanelDesktop/Mobile, MapView (Leaflet + Carto Positron), ProfileHeader (with trust signals), BookingModal, BookingRow
- **Data:** Mock providers, mock bookings with status flow
- **Status:** Built — full explore flow with interactive map, provider profiles with trust signals, booking detail with session tracking and reviews

### What's built

- **Service selection:** Three service cards (Walk & Check-ins, In-home Sitting, Boarding) as entry point
- **Provider results:** Filterable list with price, distance, rating, services. Map with price-marker pins.
- **Interactive map:** Leaflet with Carto Positron tiles, price markers, 3-column desktop layout (filters | list | map)
- **Provider profiles:** About/Services/Reviews tabs, gallery, trust signals (connection badge, relationship-aware CTAs)
- **Trust signals on profiles:** Connection state badge (Connected/Familiar/None), relationship-aware CTAs:
  - Connected → "Message [name]" + "Book care"
  - Familiar → "Connect with [name]"
  - None → "Contact [name]"
- **Booking detail:** Session status flow (requested → confirmed → in-progress → completed), price breakdown, review section
- **Booking list:** Owner/carer tab views in schedule

---

## Key Decisions

1. **Care is accessed via CTA, not a tab** — "Find Care" lives on the Home feed and desktop nav. Provider search is intentional, not the default surface. This reinforces the community-first hierarchy.

2. **Trust signals on every provider card** — connection state badge, mutual connections, shared meet history. Care is never "cold" — users always know their relationship with a provider.

3. **Relationship-aware CTAs** — the action button on a provider profile changes based on connection state. Connected users can message and book directly. Others must connect first. This enforces the trust-before-care principle.

4. **One profile type** — providers don't have a separate profile page. They use the same profile layout as any user, with additional sections (services, availability, reviews) visible. See [[profiles]].

5. **Interactive map with price markers** — Leaflet map (CDN-loaded) with Carto Positron tiles. Provider pins show price. Desktop shows 3-column layout; mobile shows list with map toggle.

6. **Session status flow** — bookings progress through: Requested → Confirmed → In-progress → Completed. Each state has appropriate actions and displays.

---

## User Flows

### Find and contact a provider

```
Home → "Find Care" CTA → Service selection (3 options)
→ Results page (filtered list + map) → Tap provider card
→ Provider profile (About / Services / Reviews)
→ CTA based on connection:
   - Connected: "Message" or "Book care" → booking conversation
   - Familiar: "Connect" → connect request → once connected, book
   - None: "Contact" → message request → connect → book
```

### Booking lifecycle

```
Booking conversation → Proposal card (dates, service, price, dog)
→ Accept → Booking created (status: Confirmed)
→ Day of care → In-progress (status card in Schedule)
→ Care completed → Completed → Review prompt
→ Review submitted → visible on provider profile
```

---

## Future

- **Payment mock** — fake checkout/confirmation screen at end of booking flow
- **Connection indicators on result cards** — show connection state directly in the search results list, not just on the profile
- **Provider onboarding tools** — calendar editor, availability setup, pricing configuration from profile
- **"Open to helping" toggle** — profile signal that surfaces users in care results for their Connected network
- **Walker service tiers** — neighbourhood walk vs. park walk, with different pricing

---

## Related Docs

- [[Product Vision]] — care marketplace emerges from community trust
- [[connections]] — connection states that gate care CTAs
- [[messaging]] — booking conversations
- [[profiles]] — provider profile sections
- [[schedule]] — bookings appear in schedule timeline
