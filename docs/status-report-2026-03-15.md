# Doggo Prototype — Status Report

_Prepared 2026-03-15 for Product Owner review_

---

## Executive Summary

Since the last push, the Doggo prototype has grown from a marketing site + signup flow + explore/discovery into a **near-complete end-to-end MVP**. Four major systems were added — Inbox/Chat, Bookings, Notifications, and Profile — along with a component reorganization, expanded design system, and rich mock data layer. The app now demonstrates the full owner journey: land → sign up → explore providers → message a provider → receive a booking proposal → manage bookings → leave reviews.

---

## What Was There Before (Last Push)

| Area | Status |
|------|--------|
| Landing page (`/`) | Complete — hero, services, how-it-works, trust props, CTAs |
| Sign In (`/signin`) | Complete — demo only, no real auth |
| Signup flow (9 steps) | Complete — role-adaptive, context-based draft state |
| Explore results (`/explore/results`) | Complete — filters, service categories, provider cards, map placeholder |
| Provider profile (`/explore/profile/[id]`) | Complete — Info/Services/Reviews tabs, photo gallery, contact modal |
| Styleguide (`/styleguide`) | Complete — Colors, Typography, Tokens, Components tabs |
| Design token system | Complete — primitives, semantic tokens, component CSS |
| Calendar / Inbox | Linked in bottom nav, returned 404 |
| Notifications | Bell icon in nav, non-functional |
| Profile page | Prototype hub / internal nav page only |

---

## What's Been Built Since

### 1. Inbox & Messaging System

**Routes:** `/inbox`, `/inbox/[conversationId]`

- Conversation list with avatars, unread indicators, service chips, message previews, relative timestamps
- Full message thread view with date-grouped bubbles, local-state message sending
- **Structured inquiry flow** — when contacting a provider, the owner selects service type, sub-service, pets, dates (one-off or recurring), and a message; this creates an inquiry card pinned at the top of the conversation
- **Booking proposal cards** — inline structured cards (service + dates + price + status) with Accept/Decline actions
- Components: `InquiryForm`, `BookingProposalCard`, `InquiryChips`, `ThreadClient`

### 2. Bookings System

**Routes:** `/bookings`, `/bookings/[bookingId]`

- **My Bookings tab** — owner view with Active/Upcoming/Past status filters
- **My Services tab** — carer perspective with earnings summary, client bookings list
- **Booking detail page** — full contract lifecycle:
  - Hero with carer info, service, pets, status badge
  - Schedule display (recurring or date-range)
  - Session management: start/complete/cancel individual sessions, add new sessions, completion notes
  - Price breakdown with line items
  - Review submission (star picker + comment) for completed bookings
  - Contract metadata (signed date, booking ID, conversation link)
- Components: `BookingRow`, `StatusBadge`

### 3. Notifications

- `NotificationsPanel` dropdown from bell icon in top nav
- Notification types: session completed, new message, booking proposal, booking confirmed
- Mark read / mark all read actions
- Unread count badge on bell icon (9+ overflow)

### 4. Profile Page (`/profile`)

Upgraded from prototype hub to a real **owner + carer profile view**:

- **About tab** — bio, pet cards grid with photos/breed/age/notes
- **Offering tab** — carer bio, services list with pricing, availability grid (7 days x 3 time slots), visibility toggle
- Empty state when user has no carer profile

### 5. Component Architecture Reorganization

Old flat structure replaced with logical grouping:

| Directory | Components |
|-----------|-----------|
| `components/layout/` | AppNav, BottomNav, GuestLayout, FormHeader, FormFooter |
| `components/overlays/` | ModalSheet (responsive: desktop modal / mobile bottom sheet), BookingModal |
| `components/messaging/` | InquiryForm, BookingProposalCard, InquiryChips |
| `components/explore/` | FilterPanelDesktop, FilterPanelMobile, FilterPanelShell, FilterBody, ProfileHeader, CardExploreResult |
| `components/ui/` | ButtonAction, ButtonIcon, CheckboxRow, DatePicker, Slider, Toggle, StatusBadge, RecurringSchedulePicker, MultiSelectSegmentBar, NotificationsPanel, BookingRow |

### 6. State Management Layer

Four new React context providers (all wired into root layout):

| Context | Purpose |
|---------|---------|
| `BookingsContext` | Booking CRUD, session management, status updates |
| `ConversationsContext` | Conversation CRUD, message append, proposal status updates |
| `NotificationsContext` | Notification list, mark read, unread count |
| `ReviewsContext` | Review storage, duplicate check, submission |

### 7. Mock Data Layer

Comprehensive mock datasets that simulate realistic app state:

- **mockBookings** — 3 bookings (active ongoing walks, upcoming boarding, completed drop-ins) with full session histories
- **mockConversations** — 3 provider conversations with message threads, inquiry details, booking proposals
- **mockNotifications** — 4 sample notifications across all types
- **mockReviews** — sample review data
- **mockUser** — logged-in user profile with pets and carer offering

### 8. Enhanced Existing Components

| Component | What Changed |
|-----------|-------------|
| ButtonAction | 8 variants, CTA pill mode, icon support, link mode |
| ButtonIcon | Badge count support for notifications |
| FilterBody | Full multi-service filter UI with accordion groups, dual-range sliders, recurring schedule options |
| DatePicker | Portal-based modal picker, range and single modes |
| CheckboxRow | Left/right placement, larger touch targets |
| Slider | Dual-thumb range mode for price filtering |
| MultiSelectSegmentBar | Variant prop (form/filter), sub-labels |
| CardExploreResult | Filter state preservation on back navigation |

### 9. CSS Additions (~500+ new lines in globals.css)

New component styles for: notification panel, badge counts, review section (star picker, textarea, submitted card), booking earnings card, profile service pricing, booking row, status badges, thread messages, inquiry chips, proposal cards.

---

## Current Page Map

| Route | Status | Notes |
|-------|--------|-------|
| `/` | Complete | Marketing landing page |
| `/signin` | Complete | Demo only — no real auth |
| `/signup/start` | Complete | Account creation with SSO stubs |
| `/signup/role` | Complete | Multi-role selection |
| `/signup/profile` | Complete | Photo, bio, location, visibility |
| `/signup/care-preferences` | Complete | Dog size/age/temperament filters |
| `/signup/walking` | Complete | Service area + availability |
| `/signup/hosting` | Complete | Home details + availability |
| `/signup/pricing` | Complete | Role-based service pricing |
| `/signup/pet` | Complete | Pet card form |
| `/signup/success` | Complete | Celebration + CTAs + carer preview |
| `/explore/results` | Complete | Filters, cards, map, responsive |
| `/explore/profile/[id]` | Complete | Info/Services/Reviews, gallery, contact |
| `/inbox` | Complete | Conversation list |
| `/inbox/[conversationId]` | Complete | Message thread, proposals, local send |
| `/bookings` | Complete | Owner + carer views, status filters |
| `/bookings/[bookingId]` | Complete | Full booking detail + session mgmt |
| `/profile` | Complete | About + Offering tabs |
| `/styleguide/*` | Complete | Design system reference |
| `/pages` | Complete | Internal prototype navigation hub |

---

## Known Limitations (Current State)

| Item | Detail |
|------|--------|
| No real authentication | Sign-in is demo navigation; no Supabase Auth, no sessions |
| No data persistence | All state is mock data + React context; refreshing resets everything |
| Map is placeholder | Leaflet container exists but no interactive pin/cluster integration |
| Signup doesn't write to DB | Draft state lives in `SignupContext` only |
| Send messages are session-only | Messages appended to local state, lost on refresh |
| No real-time updates | No Supabase Realtime; notifications and messages are static mock |
| Profile header scroll | Toggle-based condensed/expanded, not scroll-linked |
| SSO buttons are stubs | Facebook/Google/Apple on signup start — no OAuth integration |
| No payment processing | Booking proposals are coordination records, not transactions |

---

## What's Next — Short Term (Next Sprint)

These items would complete the prototype for demo/investor readiness:

| Priority | Item | Why |
|----------|------|-----|
| 1 | **Supabase Auth integration** | Unblocks all write paths; enables real sessions |
| 2 | **Signup → Supabase write** | Persist profiles and service offerings to DB |
| 3 | **Conversation seeding from profile** | Contact button on provider profile → create real conversation → navigate to thread |
| 4 | **Interactive map** | Replace placeholder with pin clusters on explore results |
| 5 | **Profile edit mode** | Allow users to edit bio, services, photos from `/profile` |

## What's Next — Medium Term

| Item | Why |
|------|-----|
| Supabase Realtime for chat | Live message delivery without refresh |
| Calendar view (`/calendar`) | Visual booking schedule — currently no route |
| Booking → calendar wiring | Accept proposal → creates calendar entry |
| Provider availability management | Sitters manage open/blocked dates |
| Search by location (geocoding) | Real address lookup, not just text field |
| Scroll-linked profile header | Replace toggle with real scroll behavior |

## What's Next — Long Term (Post-MVP)

| Item | Why |
|------|-----|
| Payment integration | Platform-mediated transactions, fees |
| Push / in-app notifications | Real notification delivery |
| Provider response rate | Trust signal on cards |
| Saved / favourited providers | Owner convenience |
| Review moderation | Quality control |
| Community features | Parked until Provider MVP validated |
| Email / SMS notifications | Booking confirmations, message alerts |
| Admin dashboard | Provider verification, dispute resolution |

---

## Architecture Notes

**Stack:** Next.js (App Router) + TypeScript + plain CSS tokens + Supabase (DB seeded, auth pending)

**Design system:** 3-layer token architecture (primitives → semantic → component CSS). 10,000+ lines of CSS in `globals.css`. Fonts: Poppins (headings) + Open Sans (body). Icons: Phosphor Icons (light weight).

**State:** React Context for client-side state (4 providers). Supabase for server-side data (providers, services, rates — read-only currently). Mock data files bridge the gap until auth enables write paths.

**Component count:** 40+ built and documented components across 6 directories. All use token-based styling, no raw inline styles in product surfaces.

---

_Last updated: 2026-03-15_
