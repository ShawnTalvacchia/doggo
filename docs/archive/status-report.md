---
category: reference
status: current
last-reviewed: 2026-03-21
tags: [status-report, prototype, sitemap]
review-trigger: "update after each phase or major feature addition"
---

# Doggo Prototype — Status Report

**Last updated:** 2026-03-21
**Current phase:** 7 — Community-Native Care
**Previous report:** `docs/archive/status-report-2026-03-15.md`

---

## Site Map

### Public / Guest (2 pages)

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero with photo background, emotional hook section, value props, archetype cards (The Regular / Connector / Organiser), care section, testimonials, bottom CTA |
| `/signin` | Email + password form (demo navigation only) |

### Signup Flow (10 steps)

| Route | Description |
|-------|-------------|
| `/signup/start` | Entry — location + email |
| `/signup/role` | Owner / Provider / Both selection |
| `/signup/profile` | Name, photo, bio |
| `/signup/care-preferences` | What care the user is looking for |
| `/signup/walking` | Walking service preferences |
| `/signup/hosting` | Hosting/boarding preferences |
| `/signup/pricing` | Rate configuration |
| `/signup/visibility` | Profile visibility settings |
| `/signup/pet` | Dog profile — name, breed, temperament |
| `/signup/success` | Completion + next steps |

### Home (1 page, logged-in)

| Route | Description |
|-------|-------------|
| `/home` | Greeting with dog photos, quick actions (Create Meet / Find Care), upcoming meets, people you've met (connection suggestions), **care from your network** (Phase 7), neighbourhood highlights |

### Meets (4 pages)

| Route | Description |
|-------|-------------|
| `/meets` | Browse upcoming and past meets |
| `/meets/create` | Create a new meet — type, location, date/time, capacity |
| `/meets/[id]` | Meet detail — attendees, dogs, map, join CTA |
| `/meets/[id]/connect` | Post-meet connection prompt for attendees |

### Schedule (1 page)

| Route | Description |
|-------|-------------|
| `/schedule` | Calendar view of upcoming meets and bookings |

### Explore / Find Care (2 pages)

| Route | Description |
|-------|-------------|
| `/explore/results` | Provider search with filters (service type, rate, times, dates), **"From your community" section** (Phase 7) above marketplace results, interactive map, connection badges on cards |
| `/explore/profile/[id]` | Provider detail — Info / Services / Reviews tabs, contact modal, trust signals |

### Messaging (2 pages)

| Route | Description |
|-------|-------------|
| `/inbox` | Conversation list — booking conversations + direct messages, carer perspective badge |
| `/inbox/[conversationId]` | Message thread — inquiry form, inquiry chips, booking proposals, contract cards, **relationship context banner** (Phase 7), **payment summary/confirmation cards** (Phase 7), compose bar |

### Bookings (2 pages)

| Route | Description |
|-------|-------------|
| `/bookings` | Owner + Carer views, booking cards with status badges |
| `/bookings/[bookingId]` | Booking detail — carer hero, **carer trust card** (Phase 7), schedule, sessions (ongoing), pricing, review (completed), contract meta |

### Profile (2 pages)

| Route | Description |
|-------|-------------|
| `/profile` | Own profile — About + Services tabs, edit mode with **"Open to helping" toggle** (Phase 7), care bio, service management, availability grid, visibility control |
| `/profile/[userId]` | Other user's profile (Phase 7) — connection badge, trust context, relationship-aware CTAs (Message/Book care/Connect), About + Services tabs |

### System (3 pages)

| Route | Description |
|-------|-------------|
| `/pages` | Prototype hub / internal navigation |
| `/status` | System status placeholder |
| `/styleguide/*` | Design system reference — Colors, Typography, Tokens, Components (4 sub-pages) |

**Total: 33 pages across 9 product areas**

---

## Data Architecture

| Layer | What | Where |
|-------|------|-------|
| Supabase (read-only) | Provider profiles, service offerings, rates | Fetched server-side on Explore pages via `lib/data/providersClient.ts` |
| Mock data (static) | Users, pets, meets, connections, community carers | `lib/mock*.ts` files |
| React Context (client-side, resets on refresh) | Conversations, bookings, reviews, notifications | `contexts/*.tsx` |
| URL state | Explore filters (service, rate range, times, dates) | Query params on `/explore/results` |

---

## What's Built (by phase)

| Phase | Focus | Status |
|-------|-------|--------|
| 1 — Design System | Tokens, globals.css, Tailwind v4 mapping, styleguide pages | Complete |
| 2 — App Shell | Nav (guest/logged), routing, layout system | Complete |
| 3 — Community Core | Meets (CRUD, detail, connect), Explore (filters, map, cards), Inbox (threads, proposals, contracts), Bookings (sessions, reviews) | Complete |
| 4 — Polish & UX | Home page, schedule, notifications, visual refinements | Complete |
| 5 — Care Profile | Provider profile sections, connection model, booking flow enhancements | Complete |
| 6 — Audit & Alignment | Landing page rewrite (community-first copy, emotional hook, archetype cards), docs reorganization | Complete |
| 7 — Community-Native Care | Provider onboarding toggle, community care discovery, unified profile route, relationship context in conversations, payment mock, trust signals | In progress |

---

## Known Issues / Open Items

### UX / Visual
- Surface color inconsistencies — some pages don't apply proper background hierarchy (popout body vs base sections)
- Inbox thread header/footer backgrounds don't extend full viewport width
- Booking detail page has no explicit surface background
- Signup flow not yet updated for community-first model (provider onboarding now lives on profile, not signup)
- Mobile responsiveness needs review on newer Phase 7 components

### Data / Architecture
- No real authentication (Supabase Auth not wired)
- All booking/messaging state resets on refresh (client-only contexts)
- Payment is mock-only (no Stripe integration)
- Map shows pins but no real geocoding

### Strategic
- Tiered booking formality not yet built (QuickArrangementSheet for Connected users)
- Signup flow needs rethinking for community-first model
- Review/rating system is minimal (single review per booking, no aggregate scoring)
