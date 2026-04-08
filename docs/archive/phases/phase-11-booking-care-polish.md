---
category: phase
status: complete
last-reviewed: 2026-03-24
tags: [phase-11, booking, care, payments, provider, trust-gating]
review-trigger: "when modifying booking or care flows"
---

# Phase 11 — Booking & Care Polish

**Goal:** Make the booking and care flows demo-ready. Enforce connection-based trust gating, add payment mock, consolidate provider setup, and add booking management actions for both owners and carers. The full care funnel — from discovery to payment — should work end-to-end in a convincing demo.

**Depends on:** Phase 10 (feed & posts complete), Phase 7 (community-native care — existing booking/care system).

---

## Why

The booking/care system is ~80% built. Pages exist, the happy path works (browse → profile → message → propose → book), but the demo falls short in three ways:

1. **Trust model isn't enforced.** Connection badges are shown but anyone can book anyone — contradicts the core thesis ("trust enables care").
2. **The funnel stops at contract signing.** No payment mock means the booking flow has no payoff moment.
3. **Provider setup is fragmented.** Signup collects care preferences but data doesn't flow to profile. Users re-enter everything.

---

## Tasks

### 1. Connection Gating on Care CTAs

Enforce the trust model in the UI — not just badges, but actual interaction gating.

| Connection state | Allowed actions | CTA shown |
|-----------------|-----------------|-----------|
| **None** | View public profile only | "Attend a meet together first" (disabled) |
| **Familiar** | View profile, send message request | "Connect with [name]" |
| **Pending** | View profile | "Request sent" (disabled) |
| **Connected** | Full messaging, book care | "Message [name]" + "Book care" |

**Files to modify:**
- `app/explore/profile/[providerId]/page.tsx` — gate CTAs by connection state
- `components/explore/CardExploreResult.tsx` — show connection state on result cards, gate "Book" action
- `app/profile/[userId]/page.tsx` — already partially gated, finish enforcement

**New component:**
- `TrustGateBanner` — contextual banner explaining why an action is locked ("You've met at 2 walks — connect to book care")

### 2. Payment Mock

Add a checkout/payment step after contract signing. Not real payments — a convincing mock.

**Flow:** Contract signed → "Proceed to payment" → Checkout page → Mock confirmation

**New page: `/bookings/[bookingId]/checkout`**
- Summary card: service, dates, pets, carer name/avatar
- Price breakdown (line items + platform fee, already computed in `lib/pricing.ts`)
- Mock payment method selector (saved card ending in •••• 4242, or "Add payment method")
- "Pay [amount] Kč" button
- Confirmation state: green checkmark, "Booking confirmed & paid", link to booking detail

**Files to modify:**
- `app/bookings/[bookingId]/page.tsx` — add "Proceed to payment" CTA for unpaid bookings
- `lib/types.ts` — add `paymentStatus: "unpaid" | "paid"` to Booking
- `lib/mockBookings.ts` — update mock data with payment status

### 3. Provider Setup Consolidation

One clean flow for setting up care services, accessible from the Profile Services tab. Remove duplication with signup.

**Current problem:** Signup collects care preferences at `/signup/care-preferences`, `/signup/pricing`, `/signup/hosting` — but that data doesn't persist to the profile's CarerProfile state. Users must re-enter everything.

**Solution:** The profile Services tab becomes the single source of truth for provider setup. The signup flow's care steps should be simplified or removed (signup just sets `openToHelping: true`, full setup happens in profile).

**Steps:**
- [ ] Simplify signup: remove care-specific steps (preferences, pricing, hosting). Signup success page links to profile Services tab for full setup.
- [ ] Enhance the profile Services tab as a complete provider setup wizard:
  - Toggle "Offer care" (existing)
  - Service selection with inline pricing (per service)
  - Availability grid (day + time slots, existing)
  - Carer bio (existing)
  - "Your profile is visible to connections" confirmation
- [ ] Ensure the Services tab works as both setup (first time) and management (editing)
- [ ] Update "Offer Care" CTAs across the app to link to `/profile?tab=services`

### 4. Booking Actions — Owner Side

Owners should be able to manage their active bookings, not just view them.

**On `/bookings/[bookingId]`:**
- **Cancel booking** — "Cancel" button with confirmation modal. Sets status to `cancelled`. Shows cancellation reason (optional text input).
- **Request modification** — "Modify" button opens a simple form (change dates, add/remove sessions for ongoing bookings). Mock: just shows a "Modification requested" state.
- **Contact carer** — "Message [name]" links to the existing conversation thread.

**On individual sessions (for ongoing bookings):**
- **Cancel session** — already partially exists, ensure it works
- **Add note** — text input on completed sessions (e.g., "Spot was great today")

### 5. Booking Actions — Provider/Carer Side

Carers should be able to respond to inquiries and manage their bookings.

**On incoming inquiry (in inbox thread):**
- **Accept inquiry** — creates a booking proposal (existing flow)
- **Decline inquiry** — "Not available" button with optional message. Closes the conversation with a declined state.
- **Counter-propose** — modify dates/pricing and send back (mock: shows "Counter-proposal sent" state)

**On `/bookings/[bookingId]` (carer view):**
- **Check in session** — "Start session" button for upcoming sessions (existing, verify it works)
- **Complete session** — "Complete" button for in-progress sessions (existing, verify)
- **Cancel session** — with reason
- **Add session note** — "How did it go?" text input after completing

**On bookings list (Schedule page, carer tab):**
- Incoming requests section (conversations with pending inquiries)
- Active bookings section
- Past bookings section

### 6. UI Consistency Pass

Bring booking/care pages up to the design standard set in Phase 10.

- [ ] Booking detail page: ensure it uses semantic tokens, card patterns, and ButtonAction consistently
- [ ] Explore results page: verify responsive design still works after Phase 10 changes
- [ ] Provider profile page: ensure tabs match the new About/Posts/Services pattern where applicable
- [ ] Inbox thread: verify message bubbles and proposal cards look consistent

---

## Verification

- [ ] As a **non-connected user**: cannot book care, sees "attend a meet together first" message
- [ ] As a **familiar user**: can message but cannot book, sees "connect first" prompt
- [ ] As a **connected user**: can message and book care, full flow works
- [ ] Booking flow end-to-end: browse → profile → message → propose → contract → **payment** → confirmed
- [ ] Owner can cancel a booking and sees cancellation state
- [ ] Owner can request modification (mock state)
- [ ] Carer can decline an inquiry with a message
- [ ] Carer can check in / complete / cancel sessions
- [ ] Provider setup works from profile Services tab (no signup duplication)
- [ ] Payment mock shows correct pricing breakdown with platform fee

---

## Open Questions

1. **Should the checkout page show platform fee to the owner?** Currently pricing.ts computes a 12% fee. FB Marketplace doesn't show the fee to buyers. Leaning: show it transparently — it builds trust and aligns with the "no hidden costs" vibe.
2. **Cancellation policy mock** — should there be a cancellation window (e.g., "free cancellation 24h before")? For prototype, probably just a simple cancel with no penalty logic.
3. **Provider earnings** — the Schedule page's carer tab shows earnings. Should this be enhanced in Phase 11 or deferred to Phase 12? Leaning: defer, keep Phase 11 focused.
