# Doggo Prototype — Status Report

_March 15, 2026 — Product Owner Review_

---

## Summary

Doggo is a prototype for a neighbourhood dog-care marketplace set in Prague. The app now covers the full owner journey end-to-end: discover a carer, message them, agree on a booking, manage sessions, and leave a review. 23 pages across 6 product areas, built on Next.js + TypeScript + Supabase.

---

## Site Map

### Public / Guest

| Page | Route | What it does |
|------|-------|-------------|
| Landing | `/` | Marketing homepage — hero, service cards, how-it-works toggle, trust props, CTAs |
| Sign In | `/signin` | Email + password form (demo navigation only) |

### Signup Flow (9 steps, progress bar, role-adaptive)

| Step | Route | What it does |
|------|-------|-------------|
| Start | `/signup/start` | SSO options + email form + T&C checkboxes |
| Role | `/signup/role` | Pick roles: Pet Owner, Walker, Host |
| Profile | `/signup/profile` | Photo upload, bio, location, visibility toggle |
| Care Preferences | `/signup/care-preferences` | Dog size, age, and temperament filters |
| Walking | `/signup/walking` | Service radius slider + day/time availability |
| Hosting | `/signup/hosting` | Home type, outdoor space, drop-off/pickup times |
| Pricing | `/signup/pricing` | Set rates per service (role-based) |
| Pet | `/signup/pet` | Pet card: photo, breed, size, temperament, health notes |
| Success | `/signup/success` | Confirmation + CTAs + profile preview |

### Explore (logged-in)

| Page | Route | What it does |
|------|-------|-------------|
| Results | `/explore/results` | Provider cards with filters (service, price, availability), map placeholder |
| Provider Profile | `/explore/profile/[id]` | Info / Services / Reviews tabs, photo gallery, contact modal |

### Messaging

| Page | Route | What it does |
|------|-------|-------------|
| Inbox | `/inbox` | Conversation list with avatars, unread dots, service chips, previews |
| Thread | `/inbox/[conversationId]` | Message bubbles, inquiry card, booking proposal cards (Accept/Decline) |

### Bookings

| Page | Route | What it does |
|------|-------|-------------|
| My Bookings | `/bookings` | Owner view (Active/Upcoming/Past) + Carer view (earnings, clients) |
| Booking Detail | `/bookings/[bookingId]` | Session management, price breakdown, review submission, contract info |

### Profile & System

| Page | Route | What it does |
|------|-------|-------------|
| Profile | `/profile` | About tab (bio, pet cards) + Offering tab (services, pricing, availability) |
| Prototype Hub | `/pages` | Internal nav page for jumping between prototype sections |
| Styleguide | `/styleguide/*` | Design system reference — Colors, Typography, Tokens, Components |

---

## How Data Works Today

The prototype uses two data layers, with a clear path to consolidate them:

**Supabase (read-only)** — Provider profiles, service offerings, and rates are seeded in the database and fetched server-side on Explore and Provider Profile pages. This data is real and will carry forward.

**Mock data + React Context (client-side)** — Conversations, bookings, notifications, reviews, and the logged-in user are loaded from static mock files into four React context providers. Sending a message or accepting a booking updates context state in the browser session, but resets on refresh.

**Why it works this way:** Auth isn't wired up yet, so there's no logged-in user to write data for. The context layer is intentionally designed to swap in Supabase calls later without rebuilding any UI — the components don't know or care where the data comes from.

---

## Open Considerations

These are decisions or discussions worth having before the next build phase:

**Authentication strategy** — Supabase Auth is the assumed path, but we haven't decided on: email-only vs. SSO providers (Google, Apple, Facebook buttons exist as stubs), magic link vs. password, or whether to gate any explore features behind login.

**Chat: "message first, book when ready"** — The product identity is built around chat as the primary trust-building mechanism, not a support channel. The current UI follows a hybrid approach: full realistic UI now, local-state send, schema designed to swap in Supabase Realtime later. Do we want to invest in real-time chat for MVP, or is session-only sufficient for launch?

**Booking as coordination vs. transaction** — Right now a booking proposal is a lightweight in-chat card (service + dates + price) that either party can Accept/Decline. There's no payment, no platform fee, no cancellation policy. This is intentional — it keeps the feel of a direct human arrangement. When do we want to introduce payment, and does that change the booking UX?

**Map investment** — The map container exists on Explore results but has no interactive pins. A proper map with clustering, geolocation, and provider pins is a meaningful build. Is this a priority for demo/investor readiness, or can it wait?

**Calendar page** — `/calendar` is linked in the bottom nav but has no page yet. Should this be a simple list of upcoming bookings, or a full calendar view with availability management? The answer affects scope significantly.

**Profile editing** — The Profile page displays data but has no edit mode. Users can't change their bio, services, or photos after signup. How important is this for the next phase?

---

## What's Next

### Short Term — Next Sprint

Focus: make the prototype feel real enough to demo with confidence.

1. **Supabase Auth** — wire up real login/signup; unblocks all write paths
2. **Signup writes to DB** — persist profiles and service offerings on completion
3. **Contact → real conversation** — tapping Contact on a provider profile creates a conversation and navigates to the thread
4. **Profile edit mode** — edit bio, services, photos from `/profile`
5. **Interactive map** — pin clusters on explore results

### Long Term — Post-MVP

These are on the radar but not in active planning:

- **Supabase Realtime for chat** — live message delivery
- **Calendar page** — visual booking schedule + availability management
- **Search by location** — real geocoding, not text field
- **Payment integration** — platform-mediated transactions
- **Push / email notifications** — booking confirmations, message alerts
- **Provider trust signals** — response rate, verification badges
- **Saved providers** — favourites list for owners
- **Admin dashboard** — provider verification, dispute resolution
- **Community features** — parked until Provider MVP validated

---

_Last updated: 2026-03-15_
