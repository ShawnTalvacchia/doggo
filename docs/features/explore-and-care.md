---
category: feature
status: built
last-reviewed: 2026-05-05
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

- **Pages:** `/discover` (hub with three doors: Meets, Groups, Dog Care), `/discover/care` (provider search with filters + map), `/discover/meets` (meet browse), `/discover/groups` (group browse), `/profile/[userId]` (unified profile — provider profiles redirect here from `/discover/profile/[providerId]`), `/bookings/[bookingId]` (booking detail), `/bookings/[bookingId]/checkout` (payment mock)
- **Components:** CardExploreResult, FilterPillRow, FilterPanelDesktop/Mobile, MapView (Leaflet), TrustGateBanner, CancelBookingModal, BookingRow, StatusBadge, TabBar (on detail page)
- **Data:** Mock providers, mock bookings with payment status
- **Status:** Built — full explore flow, trust-gated CTAs, payment mock, booking management

### What's built

- **Single-page discover flow:** Each door (Meets, Groups, Care) opens a results page with FilterPillRow for type/category filtering and floating Filters/View Results buttons for advanced filters. Former type picker intermediate pages removed.
- **Service selection:** Three service cards (Walk & Check-ins, In-home Sitting, Boarding) as entry point
- **Provider results:** Filterable list with price, distance, rating, services. Map with price-marker pins. Community carers section for connected providers.
- **Care filter panel:** The filter panel at `/discover/care` uses **interactive UI primitives** — MultiSelectSegmentBar for day-of-week selection, dual Slider for price range, CheckboxRow for service toggles, and an accordion pattern for expanding service sub-types. All built from existing components, not custom markup.
- **Interactive map:** Leaflet with Carto Positron tiles, price markers, 3-column desktop layout
- **Provider profiles:** Unified at `/profile/[userId]` — About/Posts/Services tabs, trust signals. Old `/discover/profile/[providerId]` redirects via `userId` bridge field on ProviderCard. `ProfileHeader` component deleted.
- **Connection gating (Phase 11):** CTAs enforced by connection state:
  - **Connected:** "Message [name]" + "Book care" — full access
  - **Familiar:** "Connect with [name]" — must connect before booking. TrustGateBanner shows context.
  - **Pending:** "Request sent" (disabled)
  - **None:** "Meet [name] first" (disabled). TrustGateBanner explains: "Attend a meet together first"
- **Payment mock (Phase 11):** Checkout page at `/bookings/[bookingId]/checkout` with summary, price breakdown (including 12% platform fee), mock payment method, pay button, confirmation state
- **Booking detail (redesigned):** Tabbed layout (Info / Sessions). Owner view shows aggregate stats (sessions completed, relationship duration, next session). Provider view shows "You're providing" pill, session check-in actions (Start / Complete / Add note). Header reads `{otherFirstName} · {service}` so the relationship through-line is in the title (Discover & Care 2026-05-04).
- **Rolling weekly billing:** Recurring bookings use `billingCycle: "weekly"` with rolling session generation (one upcoming session at a time). No fixed session count for ongoing arrangements.
- **Care instructions:** Owner notes (`ownerNotes`) and provider notes (`carerNotes`) on bookings. Displayed on Info tab as a care instructions section.
- **Booking list cards:** Avatar combos, Tag icon for price, weekly billing labels, divider removed for cleaner recurring cards.
- **Booking actions:** Owner can cancel (with reason via CancelBookingModal) or message. Provider can start/complete sessions and add notes. "Leave a review" stub on completed bookings. **Pending bookings (Discover & Care G5, 2026-05-04):** owner sees Message + **Review & sign** (primary) which opens the SigningModal in-place; provider sees Message-only (they sent the proposal, they wait).
- **My Services tab:** Provider's active clients and upcoming sessions on `/bookings?tab=services`.
- **Schedule integration (Phase 11):** Active care bookings appear on the Schedule page alongside meets

### Discover & Care additions (closed 2026-05-04)

- **Services-as-Catalog** (`CarerServiceConfig` discriminated union): three offering shapes — **Care** (drop-off / per-visit / per-night work; produces a Booking), **Meet** (sessions with rosters owners sign up to — training, workshops; produces an RSVP on the linked meet), **Appointment** (vet / grooming — solo, fixed time slot; produces a Booking like Care but tied to a single time). Profile Services tab renders all three first-class with shape-aware tap routing. See [[Groups & Care Model]] → Services as Catalog.
- **`participants_only` meet visibility:** contracted/private meets (e.g. a 1-on-1 generated from a package booking) are hidden from public Meets tabs — only the creator and roster see them. Shipped via `MeetVisibility` enum + `isMeetVisibleTo` helper + `getGroupMeets` filter. Discover & Care A1.
- **Care-group multi-provider hero:** `Group.providers: GroupProviderRef[]` replaces the single `hostedBy: string` field. Groups with multiple providers render an avatar stack + "Run by X + N" tail; tagline suppressed in multi-provider mode (one bio doesn't represent the team). Discover & Care B1–B4. See [[Groups & Care Model]] → Care-group hero anatomy.
- **Trust badges MVP** on Discover cards + provider hero. Six badges across three categories (community-earned: Community Regular, Trusted by Your Network, Repeat Clients; credential: Certified Trainer, X Years Experience; platform: Verified Identity). Priority rule: community-earned > credential > platform. Discover cards trim to top 2; profile hero shows the full earned set. Implementation: `lib/trustBadges.ts` + `components/badges/TrustBadgeStrip.tsx`. See [[implementation/badges]].
- **Connection signals on Discover cards:** "N in your circle" / "Met at N walks" / "Your neighbourhood" inline-icon row sits ABOVE service tags + blurb (community context before service catalogue). Reads from `ConnectionsContext` + meet history.
- **Soft Familiar avatar ring (P29) — Discover-only:** brand-tinted ring on Discover provider cards where the viewer has marked the provider Familiar, neutral ring on Discover where Connected (paired hierarchy at different intensities). NOT applied on AttendeeAvatarStack or any meet/group surface — relationship is already signaled there via section grouping + labels + CTAs. Decision logged 2026-05-04.
- **Structured inquiry → proposal → contract flow** (Discover & Care G):
  - **InquiryFormModal** opens over the provider's Services tab when the owner taps "Book a session." Captures pets, service, sub-service, frequency (one-off with single-day or multi-day; ongoing with weekly schedule), and free-text notes. Single-day allowed for walks/sitting; boarding requires multi-day (overnight implies ≥1 night).
  - On send, posts an **InquiryCard** (structured artifact, status pill: pending / responded / withdrawn) into the (owner, provider) conversation thread — replaces the old templated-text format.
  - Provider opens the inquiry → "Respond with proposal" → **ProposalForm** modal pre-fills with the inquiry context + auto-calculated price (`pricePerUnit × occurrences`). 12% platform fee shown transparently.
  - Owner sees **BookingProposalCard** with three actions: Not now (tertiary, left), Suggest changes (outline), Review & sign (primary, right). Suggest changes opens ProposalForm pre-filled — counters go both ways.
  - **SigningModal** confirms terms; on sign, booking flips proposed → upcoming, proposal flips to "accepted", a contract message lands in the thread.
  - Single Booking record per conversation — counters update fields in place (no duplicate records).
  - Inbox row preview is status-aware: ✦-glyph + brand-tinted text for system messages ("New inquiry", "Proposal accepted", etc.) — distinct from plain text messages.
- **Auto-Familiar on inquiry send (stop-gap):** sending an inquiry mutually marks both parties Familiar so the provider can see the owner's locked profile to write a meaningful proposal. Logged in [[Open Questions & Assumptions Log]] §2 — full inquiry-driven trust transitions model (mutual Connected on contract accept, edge cases) belongs to the Inbox & Notifications phase.
- **State persistence:** `usePersistedState` hook mirrors `ConversationsContext`, `ConnectionsContext`, and `BookingsContext` to localStorage so demo state (new inquiries, Familiar marks, signed contracts) survives page reloads + URL-based persona switches. Reset via `/demo` page or the persona dropdown. Bridges to a future Supabase migration.
- **Conversation ID format:** new conversations created via `getOrCreateServiceConversation` use `${ownerId}-${providerId}-conv` (collision-safe across personas). Legacy provider-only-prefixed seeded conv IDs renamed to `shawn-${provider}-conv` for consistency.
- **Inbox sort & unread are viewer-aware:** `hasUnread` is computed from "did the counterparty send the last message?" (replaces the side-specific `unreadCount` field). Providers no longer see stale owner-side unread counts on threads where they're the carer.
- **Mock-data seeds (Discover & Care 2026-05-04):**
  - `conn-daniel-nikola` (Familiar) — gives Daniel a positive ring case on `/discover/care`
  - `conn-klara-pavel` (Familiar) — directory-only ProviderCard match (no UserProfile bridge), tests both ProviderCard shape paths
  - Klára Horáčková + Dr. Lenka Nováková directory entries with full credentials
  - Pre-existing directory carers backfilled with `credentials` blocks (Olga, Jana, Tomáš, Markéta, Pavel, Simona, Martin, Lenka S., Petr V.)

### Pricing & Proposals additions (closed 2026-05-05)

- **Auto-pricing engine (`computeQuote(config, inquiry, today)` in `lib/pricing.ts`).** Pure function: per-service config × inquiry data × today's date → `BookingPrice` with stacked line items. Replaces the prior "compose price freely" pattern. Engine is unit-test verified across four scenarios.
- **Starter modifier set (4) — `PricingModifier` discriminated union on `CarerCareServiceConfig.modifiers`:**
  - **Holiday surcharge** (% on subtotal) — Czech public holidays table in `lib/holidays.ts`
  - **Weekend rate** (% on subtotal) — `recurringSchedule.days` or `startDate` weekday match
  - **Multi-pet** (flat Kč per extra pet over 1) — `inquiry.pets.length`
  - **Last-minute** (% on subtotal) — `today + N days < startDate` threshold-configurable
  - Stacking order: flat-per-unit modifiers first; percentage modifiers compound on the subtotal. Each modifier renders its own `PriceLineItem` with `triggerNote` so the proposal can show "*Holiday surcharge — 3 Czech public holidays fall in this booking*" inline.
- **No-bargaining principle, structurally enforced.** Engine output is the canonical answer at three surfaces:
  1. **InquiryForm live estimate** — updates as the owner fills in fields
  2. **InquiryCard estimate** — same total + modifier chips persist on the chat artifact, both sides
  3. **ProposalForm "System quote"** — read-only by default; provider can ship in one tap
- **Override mode** — provider opts in via "Adjust this quote." Edited rows tinted amber (`--warning-25`); a "You're sending a custom quote" callout appears with optional reason input + "Reset to system quote" link. Owner-side `BookingProposalCard` renders a "CUSTOM QUOTE" callout in the body when `isOverride: true`. Provider can override; provider cannot silently override.
- **Inquiry decline path** — provider can decline an inline with optional reason. Inquiry status flips to `declined`; system message lands in thread; reason callout persists below title even when card collapses. Counter-suggestion at the inquiry stage was deliberately skipped — negotiation happens at proposal stage via "Suggest changes."
- **InquiryCard + BookingProposalCard collapse on response.** Once an inquiry is responded/declined or a proposal is countered/declined/accepted, the body collapses to header + service line. Footer carries the truth — accepted proposals link to `/bookings/{id}`. Decline reason callout persists through the collapse.
- **Mutual Connected on contract sign** — signing a proposal mutually marks both parties Connected (resolves part of [[Open Questions & Assumptions Log]] §2 — inquiry-driven trust transitions). Pairs with the auto-Familiar-on-inquiry stop-gap that already shipped in Discover & Care.
- **Per-service pricing on Discover Care cards** — `ProviderCard.pricesByService` lookup keyed by active service filter. When filter is "All", falls back to single `priceFrom` + `priceUnit`. Service-tag chip row hides under specific filters (context implied).
- **Provider modifier-config UI** — `PricingModifiersEditor` accordion in `ProfileServicesTab` (default-collapsed; "N on" badge). All four modifier kinds always render so providers can flip any on. Reasonable defaults so opt-in is one tap.
- **Persistent persona override (`?as=...`).** `useCurrentUser` hook now mirrors `?as=<personaId>` URL param to `sessionStorage["doggo-as-preview"]` so directory-only personas (Petra, Shawn, Nikola) survive route changes during a session. Picker actions clear the sessionStorage + strip the URL param via custom event.

---

## Pricing model

The auto-pricing engine is the canonical source of truth for proposal prices. Provider configures pricing once (per Care service); engine produces the quote from inquiry data; provider reviews and sends.

**Files:**
- `lib/pricing.ts` — `computeQuote`, evaluators per modifier kind, `quotesMatch`, `defaultModifiers`
- `lib/holidays.ts` — Czech public holidays 2026/2027 + range helpers
- `lib/types.ts` — `PricingModifier` union, `CarerCareServiceConfig.modifiers`, `BookingProposal.isOverride/overrideReason`, `PriceLineItem.triggerNote`, `ProviderCard.pricesByService`

**Decision principles:**
- Engine output visible at three surfaces (InquiryForm, InquiryCard, ProposalForm)
- Override possible but visibly flagged with optional reason
- Each modifier produces its own line item with a `triggerNote` so the math is legible
- Recurring/ongoing bookings skip holiday + last-minute (rolling weekly billing handles each week independently)
- Modifiers are per-service opt-in; carers without modifiers configured fall through with single line item

**Future modifier passes** — see "Future inquiry-form fields" under Future section. Longer-walk, off-hours, boarding-specific (yard / house type / max-dogs), add-on opt-ins (bath, grooming, photo updates), package selection (bundles).

---

## Key Decisions

1. **Discover is a three-door hub** — `/discover` shows three category cards (Meets, Groups, Dog Care) instead of tabs. This is a **three-door pattern**: each door leads to its own PageColumn-based sub-page (`/discover/meets`, `/discover/groups`, `/discover/care`). Phase 19 replaced the tabbed Meets|Care layout with this hub pattern. All three sub-pages follow the same single-page flow: FilterPillRow for type filtering + floating Filters/View Results buttons for advanced filters. Type picker intermediate pages removed. Care is also accessible via "Find Care" CTAs on the Home feed.

2. **Connection state gates actions, not just appearance** — (Phase 11) Non-connected users see disabled CTAs with contextual explanations. The TrustGateBanner component explains why and suggests next steps (attend a meet, send a connect request).

3. **One profile type** — providers use the same profile layout as any user, with additional sections. See [[profiles]].

   **Individual Providers and Care groups are both first-class** in Dog Care search results. Individual services live on profiles; team services live in Care groups that curate context (location, service focus) and surface their member-providers' matching services via an intersection rule. See `strategy/Groups & Care Model.md` → Provider Tiers on Profiles + Care Group Admin Model.

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

- **Future inquiry-form fields (deferred from Pricing & Proposals v1).** The starter modifier set (holiday / weekend / multi-pet / last-minute) works with already-captured inquiry data, so the inquiry form didn't need to grow in v1. Future modifier passes will need new fields:
  - **`durationMinutes`** on the inquiry → enables a *longer-walk* modifier (flat or % bump for walks > base duration). Walk-only.
  - **Time-of-day** (`startTime`, picker or morning/afternoon/evening segment) → enables an *off-hours* modifier (% bump for early-morning / late-evening / overnight). Walk-only initially; could extend to per-visit sitting.
  - **Home-attribute fields** (yard size, fenced, has-own-dogs, max-dogs-at-once) — these belong on the carer config (where they describe the home), not the inquiry. They feed *boarding-specific* modifiers and the service-aware filter refactor in §4 of Open Questions.
  - **Add-on opt-ins** (bath, grooming reinforcement, photo updates) → multi-select on the inquiry, each one a flat add-on line item on the proposal. Boarding-only initially.
  - **Package selection** (e.g. "5-night bundle" vs "5 × per-night") → radio on the inquiry when the carer offers one. Affects the base line item, not a stacked modifier.

  Form-shape sketch: each new field is service-conditional (don't ask Hugo's owner about boarding-yard requirements when she's booking a walk). The InquiryForm already conditionally renders by `bookingType`; service-conditional fields slot into the same pattern.
- **Discover Refinement (scheduled phase, after Sessions & Service Execution)**: bundles the §4 cluster items (Appointment filter pill, ProviderCard ↔ UserProfile fragmentation, per-service pricing, service-aware filters, unwired filter panel) with the **community-first Discover ordering** thesis — surface Helper-tier Connected carers distinctly above Providers. See [[ROADMAP]] → Discover Refinement.
- **Inquiry-driven trust transitions:** the auto-Familiar shipped here is a stop-gap. Full model — mutual Familiar on inquiry send, mutual Connected on contract accept, first-service-message detection, decline rollback rules — logged in [[Open Questions & Assumptions Log]] §2 for Inbox & Notifications.
- **Review form** — full review submission flow after completed bookings (currently stub button only).
- **Provider dashboard** — earnings view, availability calendar, incoming requests management.
- **Session photos** — `photoUrl` field exists on BookingSession type, UI not yet built.
- **Walker service tiers** — neighbourhood walk vs. park walk with different pricing (folds into Pricing & Proposals).
- **Availability window filter on Discover** (morning / afternoon / evening) — currently no time filter; sub-note inside the service-aware filter refactor.

---

## Related Docs

- [[Product Vision]] — care marketplace emerges from community trust
- [[connections]] — connection states that gate care CTAs
- [[messaging]] — booking conversations
- [[profiles]] — provider profile sections, posts tab
- [[schedule]] — bookings appear in schedule timeline
- [[phase-11-booking-care-polish]] — connection gating, payment mock, booking actions
