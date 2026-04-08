---
category: phase
status: active
last-reviewed: 2026-03-21
tags:
  - phase-7
  - care
  - booking
  - community
  - provider
  - payment
review-trigger: this is the current phase — check before every session
kanban-plugin: board
---

# Phase 7 — Community-Native Care

## Backlog

- [ ] Tiered booking formality #booking
	- QuickArrangementSheet for Connected users (simpler than full InquiryForm)
	- ArrangementCard (casual variant of BookingProposalCard)
	- Branch rendering in ThreadClient based on connection state

- [ ] Add mock payment messages to existing conversations #payment
	- Add payment_summary message to a completed booking thread
	- Show the full pay flow: summary → "Pay through Doggo" → confirmed


## In Progress


## Done

- [x] Types & mock data #data
	- `openToHelping` on UserProfile type
	- `PaymentSummary` type + `payment_summary`/`payment_confirmed` message types
	- `CommunityCarer` type + `communityCarers` mock data in mockConnections
	- `getCommunityCarers()` helper
	- `calculatePaymentSummary()` in pricing.ts (12% platform fee)

- [x] Provider onboarding via profile edit mode #profile
	- "Open to helping" toggle as first element in Services tab edit mode
	- Toggle reveals: care bio textarea, service cards (add/edit/remove), editable availability grid, search visibility (Public/Connections only)
	- Three visibility levels: OFF → ON + Connections only → ON + Public
	- View mode shows "Open to helping" badge with visibility status
	- Reuses existing Toggle, InputField, pill pattern components

- [x] Unified profile route `/profile/[userId]` #profile
	- Renders any user's profile from connection + provider mock data
	- Connection state badge (Connected/Familiar) + trust context (meets together)
	- Relationship-aware CTAs: Message + Book care (Connected), Connect (Familiar), Contact (None)
	- About and Services tabs with provider data

- [x] Community-first care discovery #explore
	- "From your community" section on `/explore/results` above marketplace results
	- Shows Connected users who offer care, filtered by selected service type
	- Cards link to `/profile/[userId]` with meets-together context
	- "Care from your network" section on `/home` with carer count + cards
	- Connection state badges on `CardExploreResult` (Connected/Familiar pills)

- [x] Relationship context banner in booking conversations #booking
	- Banner at top of booking threads showing: connection state, meets together, met through Doggo
	- Rendered from `getConnectionState()` + `getCommunityCarers()` cross-reference
	- Only shown for booking conversations (not direct messages)

- [x] Payment summary + confirmation cards #payment
	- `PaymentCard` component renders inline in conversation threads
	- Shows line items, platform fee (12%), total, "Pay through Doggo" mock button
	- Paid state shows green checkmark confirmation
	- Renders for `payment_summary` and `payment_confirmed` message types

- [x] Trust signals on booking detail page #booking
	- `CarerTrustCard` shows connection state, meets together, location, profile link
	- Displayed between hero section and schedule on booking detail page


## Notes

**Phase goal:** Rethink the booking/care layer through the community/dog-first lens. Make care discovery, provider setup, and booking conversations feel like natural extensions of the community — not a marketplace bolted on.

**Key principle:** The dial, not the switch. Offering care is a volume knob on your existing profile.

**Exit criteria:**
1. Users can set up care offerings directly from their profile (no separate onboarding)
2. Care discovery surfaces community connections before marketplace results
3. Booking conversations show relationship context
4. Payment mock demonstrates platform fee transparency
5. Trust signals visible throughout the booking flow

**Depends on:** Phase 6 (audit & alignment) ✓
**Start date:** 2026-03-21
