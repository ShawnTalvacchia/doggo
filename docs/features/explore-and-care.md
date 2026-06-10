---
category: feature
status: built
last-reviewed: 2026-06-09

tags: [discover, care, booking, carers, map, payment, trust-gating]
review-trigger: "when modifying Discover Care tab, Carer profiles, booking flows, payment, or map"
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
- **Service selection (closed in Care Catalog Taxonomy 2026-05-11):** Four-service Care taxonomy on the filter pills — Walks & Check-ins / House sitting (carer goes to owner's home) / Day care (carer's home, daytime) / Boarding (carer's home, overnight) — plus the Appointment pill (grooming / training visit; vet retired 2026-05-11). Replaces the older three-service `walk_checkin | inhome_sitting | boarding` model. Canonical labels + meanings + sub-services live in `lib/constants/services.ts`; documented inline next to the `ServiceType` enum in `lib/types.ts` to prevent re-drift. See [[Groups & Care Model]] → "Care taxonomy — the four services."
- **Provider results:** Filterable list with price, distance, rating, services. Map with price-marker pins. Community-first ordering — Connected/Familiar carers render above broader marketplace with distinct chrome (`var(--brand-subtle)` background + 3px brand-main left stripe, viewer self-excluded). Discover Refinement 2026-05-10.
- **Care filter panel (redesigned in Care Catalog Taxonomy 2026-05-11):** Self-contained filtering surface with five new structural moves:
  1. **`Filters` heading + in-panel service-type dropdown** at the top of the panel. Dropdown trigger is a commanding affordance (24px icon + heading-style label + descriptive subline + caret). Tap opens a 6-row menu with title + subline per service, teaching the where/when axes (e.g. *Day care · Daytime at the carer's home* vs *Boarding · Overnight at the carer's home*). The page-level pill row hides while the panel is open (fixes mobile overflow); pills reappear when the panel closes. Selecting a service inside the panel keeps the panel open, just reshapes the fields below.
  2. **Pets row functional + persisted.** Wired to `viewer.pets[]` via `useCurrentUser()`. Multi-select checkboxes; selection persists across reloads + persona switches via `usePersistedState` keyed by `doggo-care-filters-${viewerId}`. Drives the multi-pet capacity predicate on Day care + Boarding configs (gates carers whose `maxDogs < selectedPetIds.length`). Empty-state for users without pets: CTA link to `/profile` to add one.
  3. **Address picker functional.** Saved-addresses dropdown derived from `viewer.neighbourhood`. Map-dropper item is a stub (logged in punch list P65); km-radius filtering deferred. Empty-state CTA for users without a neighbourhood.
  4. **Sub-services accordion.** Per-service multi-select chip group rendered from `SUB_SERVICES` in `lib/constants/services.ts`. Sub-services are intersection-gated — picking "Solo walk" + "Group walk" widens, doesn't narrow.
  5. **Service-aware field shapes** keyed off active service pill:
     - **Walks & Check-ins:** Walk pace + Leash policy
     - **House sitting:** universal context + sub-services only (no carer-home fields — sitting happens at owner's home)
     - **Day care:** Home setting + Other dogs at home
     - **Boarding:** Home setting + Other dogs at home + Has yard
- **Filter primitives:** MultiSelectSegmentBar for day-of-week + time-of-day + walk pace + leash + home setting + sub-services + other-dogs-at-home, dual Slider for price range, CheckboxRow for the lone yard toggle. All built from existing components.
- **Time-of-day granularity:** Morning / Afternoon / Evening. Decision settled at phase open (Care Catalog Taxonomy 2026-05-11): finer-grained bands would invent data the carer never entered; underlying `CarerAvailabilitySlot.slots` is `TimeSlot[]` keyed morning/afternoon/evening.
- **Interactive map:** Leaflet with Carto Positron tiles, price markers, 3-column desktop layout
- **Provider profiles:** Unified at `/profile/[userId]` — About/Posts/Services tabs, trust signals. Old `/discover/profile/[providerId]` redirects via `userId` bridge field on ProviderCard. `ProfileHeader` component deleted.
- **Connection gating (Phase 11):** CTAs enforced by connection state:
  - **Connected:** "Message [name]" + "Book care" — full access
  - **Familiar:** "Connect with [name]" — must connect before booking. TrustGateBanner shows context.
  - **Pending:** "Request sent" (disabled)
  - **None:** "Meet [name] first" (disabled). TrustGateBanner explains: "Attend a meet together first"
- **Payment mock (Phase 11):** Checkout page at `/bookings/[bookingId]/checkout` with summary, price breakdown (including 12% platform fee), mock payment method, pay button, confirmation state
- **Booking detail (redesigned):** Tabbed layout (Info / Sessions). Header reads `{otherFirstName} · {service}` so the relationship through-line is in the title (Discover & Care 2026-05-04). **Info tab structure** (Dog Profile phase iteration, 2026-06-03):
  - **Header strip** — `OwnerDogAvatar` combo + owner name + verb-line ("Walking Bára") + "You're providing" pill (provider) + `StatusBadge`. Status badge hides when `status === "upcoming"` because the Next session row below carries the same signal in more useful framing.
  - **Action buttons** — Message / Cancel / Sign / etc. depending on state.
  - **Details list** — vertical row stack with consistent chrome. Sits above PetInfoSection (booking facts before pet reference). Rows: **Next session** (date + relative framing "Today" / "Tomorrow" / "In N days" / "N days overdue" — Care bookings use `nextSession.date`, meet bookings fall back to `booking.startDate`; Start CTA renders inline when `isProvider && daysUntil <= 0`), **Schedule cadence** (e.g. "Thu · 12pm–1pm · Recurring"), **Activity** (ongoing Care bookings only — "N sessions completed · Since {date}"; replaces the retired 3-tile aggregate stats grid), **Price**, **Delivery** (walks_checkins only).
  - **PetInfoSection** (provider-only) — avatar (40px rounded-square) + pet name + "View profile →" link routing to `/dogs/[id]` (the canonical dog surface). Below: inline rows for Medications, Conditions, Around dogs, Likes, Dislikes, Triggers, Play, Vet (whichever the pet has data for). No expand/collapse — always visible. The identity row (avatar + name + breed/weight/age) that used to live here was retired (redundant with the booking header above).
  - **Care instructions + Pricing breakdown** below.
  - Sessions tab Start button shares the Next-session row's threshold — only renders when the session is today or overdue; future sessions render info-only.
- **Rolling weekly billing:** Recurring bookings use `billingCycle: "weekly"` with rolling session generation (one upcoming session at a time). No fixed session count for ongoing arrangements.
- **Care instructions:** Owner notes (`ownerNotes`) and provider notes (`carerNotes`) on bookings. Displayed on Info tab as a care instructions section.
- **Booking list cards:** Avatar combos, Tag icon for price, weekly billing labels, divider removed for cleaner recurring cards.
- **Booking actions:** Owner can cancel (with reason via CancelBookingModal) or message. Provider can start/complete sessions and add notes. "Leave a review" on completed bookings opens the `CareReviewSheet` modal (5★ + text); submission lands on the carer's profile + threads a system message in the conversation (credentialing-moat phase, 2026-06-09). **Pending bookings (Discover & Care G5, 2026-05-04):** owner sees Message + **Review & sign** (primary) which opens the SigningModal in-place; provider sees Message-only (they sent the proposal, they wait).
- **My Services tab:** Provider's active clients and upcoming sessions on `/bookings?tab=services`.
- **Schedule integration (Phase 11):** Active care bookings appear on the Schedule page alongside meets

### Discover & Care additions (closed 2026-05-04)

- **Services-as-Catalog** (`CarerServiceConfig` discriminated union): three offering shapes — **Care** (drop-off / per-visit / per-night work; produces a Booking), **Meet** (sessions with rosters owners sign up to — training, workshops; produces an RSVP on the linked meet), **Appointment** (grooming / training visit — solo, fixed time slot; produces a Booking like Care but tied to a single time). Profile Services tab renders all three first-class with shape-aware tap routing. See [[Groups & Care Model]] → Services as Catalog.
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
  - Klára Horáčková + Lenka Nováková directory entries with full credentials *(Lenka was originally seeded as a vet — repurposed as a groomer at Mánesova Grooming Salon during Discover Refinement walkthrough D1, 2026-05-10, per Open Q §6)*
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

### Walk Service Delivery additions (closed 2026-05-20)

- **Delivery is a first-class axis on walks_checkins.** A `CarerCareServiceConfig` for walks can carry `deliveryOptions: { method: "pickup" | "dropoff"; price: number }[]`. **Pickup** = carer collects from the owner's address; **drop-off** = owner brings the dog to the carer / meet point. The owner picks one at booking time; the choice persists on `Booking.delivery`. Walks-only — boarding / day-care / house-sitting have implicit delivery semantics (whose home implies who travels) and don't carry the field.
- **Per-method pricing.** Each option in `deliveryOptions[]` carries its own price; `computeQuote` reads `inquiry.delivery` to resolve the base rate, then stacks modifiers normally. Klára's `klara-walks`: 300 Kč drop-off / 380 Kč pickup. Pawel is canonical **pickup-only** — his `Group.serviceListings` already advertise the route (no `CarerCareServiceConfig` to extend).
- **Default selected = pickup.** Research-backed (most owners prefer pickup); pre-selecting the expected option means owners who deviate to drop-off see the price drop, which reads as a happy surprise rather than an upsell.
- **Linked-care booking (config #2) renamed.** Internally `Booking.dropoffMeetId` stays as a stable field name; user-facing copy retires "drop-off" as the booking-shape label, in favour of "linked-care booking" (book ≠ attend). The previous overload — "drop-off" meant both the booking shape *and* a delivery method — caused a long-standing copy mess. Two axes are now explicit (see [[Groups & Care Model]] → "Two axes").
- **Component rename.** `DropoffBookingSheet` → **`LinkedWalkBookingSheet`** (`components/meets/`). The sheet now hosts a delivery picker (when the carer offers both) above the date picker. Single-option services skip the picker. The confirmation step names the chosen method + price.
- **`LinkedCareCallout`** on the free meet detail shows "From {floor} Kč" + caret when the carer offers multiple delivery options — the picker inside the booking sheet is where the choice happens, so the card stays the affordance, not the catalogue. Single-option services show that one price. The previous "Drop-off — Klára takes your dog on this walk" prefix copy was retired.
- **Meet occurrence pill on the meet detail page** now reads **"Walk booked"** (was "Drop-off booked") for dates the viewer has a linked-care booking on. The pill names the commitment, not the delivery method.
- **`ScheduleCard`** now reads `Booking.delivery` for the operational hint on walks ("Pick up at Holešovice" / "Drop off at Stromovka") instead of inferring from `serviceType`. Non-walk Care bookings still infer from service shape. The one-off chip ("Drop-off" for one-off Care bookings) was renamed to **"One-off"** — the chip's actual meaning was always "single discrete event," not "drop-off."
- **Booking detail page** surfaces the chosen delivery as a row in the details list, alongside schedule / pets / price.
- **Auto-Familiar on inquiry send and trust-related signals** unchanged. The auto-pricing engine `computeQuote` gained delivery-aware base resolution but no new modifier dimension.

### Service ↔ Meet Linkage additions (closed 2026-05-17)

- **Carer authors all three service kinds in one place.** The Services-tab edit (`ProfileServicesTab`) now holds Care + **Meet** + **Appointment** cards — `MeetServiceEditCard` + `AppointmentServiceEditCard` joined the Care card; the dishonest "managed separately" footnote is gone. Authoring detail: [[profiles]].
- **`klara-1on1` reclassified Meet → Appointment** (`appointmentCategory: "training"`) — 1-on-1 = solo + scheduled + no roster = Appointment per the §13 roster test. First seeded entry for the `"training"` Appointment variant.
- **`Booking` extended for Meet-service bookings.** `serviceType` is now optional; a new `meetBooking: { serviceId, serviceTitle, meetId, occurrenceDate }` identifies a booking produced by a Meet-type service. Renderers branch on `meetBooking` first, then `serviceType` (`bookingServiceLabel` helper). These bookings show on `/bookings` as list rows routing to `/meets/{meetId}` — the meet IS the session detail, no Care-lifecycle booking-detail page.
- **`Booking.dropoffMeetId`** — config #2 drop-off Care bookings carry a back-reference to the free meet they run on (book ≠ attend; no `meetBooking`, no roster entry). Lets the meet's Upcoming-dates row show a "Drop-off booked" pill. See [[meets]] → Service ↔ Meet linkage.
- **Booking sheets:** `BookSessionSheet` (Meet-type — creates a `Booking` + adds to the meet roster via `setMeetRsvp`) and `LinkedWalkBookingSheet` (config #2 linked-care booking — creates a plain Care `Booking`, no roster; renamed from `DropoffBookingSheet` in the Walk Service Delivery phase). Both reachable from the carer's Services tab and a linked meet's detail page.
- **Soft-archive on service delete.** Deleting a Meet/Appointment service with active bookings soft-archives it (`enabled: false` + `softDeletedAt`) rather than hard-deleting; existing bookings keep resolving their service reference. `Booking` carries no `serviceId`, so "has active bookings" is proxied by the linked meet's roster. No-booking services hard-delete.
- **`CarerCareServiceConfig.id?`** — set only when a Care service is meet-linked (config #2); resolved by `getServiceById`. `CarerMeetServiceConfig.seriesMeetId` (singular) retired in favour of `linkedMeetIds: string[]` (one-to-many).

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
- **Session close-out does NOT trigger billing** (Sessions & Service Execution, 2026-05-05). Billing stays decoupled from session state — rolling-weekly cycles handle each week independently. Coupling close-out to billing would create a UX cliff ("if I don't close out, do I not get paid?") and break the rolling model. The visit report is the artifact that closes the loop emotionally; the billing loop runs on its own schedule.
- **Per-session pricing is intentionally NOT surfaced** in the Sessions tab (Sessions & Service Execution scope decision, 2026-05-05). Session views show care content (photos, notes, structured checks, walk metrics, timestamps) — not money. Pricing stays at booking total + week-level for ongoing bookings. Avoiding per-session pricing avoids two structural sub-questions (ongoing-vs-one-off engine divergence, holiday line-item granularity) that would force engine changes without a real product reason. See `Open Questions §6`.

**Future modifier passes** — see "Future inquiry-form fields" under Future section. Longer-walk, off-hours, boarding-specific (yard / house type / max-dogs), add-on opt-ins (bath, grooming, photo updates), package selection (bundles).

---

## Booking detail surfaces

`/bookings/[bookingId]` — the deep surface for a single booking. Two tabs: **Info** + **Sessions**.

### Sessions tab anatomy (Sessions & Service Execution, 2026-05-08)

Top of the Sessions tab leads with the dog. **`SessionsPetHeader`** renders a full-width hero photo (rounded-panel, max-height 240px mobile / 360px desktop, aspect-preserving) + 28px name heading. No supporting line — photo + name carry identity; the active panel below surfaces session state; service/cadence info lives on the Info tab.

This is a deliberate **pet-as-protagonist** design choice. For an app rooted in trust around your dog, the dog is the experience. Hero treatment over a small avatar:

- Encourages emotional bonding — the dog visually anchors every session interaction
- Makes scrolling `/bookings` recall each dog instantly
- Behavioral nudge: owners who see their dog rendered at hero scale tend to upload better photos

Aspect ratio is preserved (no forced crop), so owner-uploaded photos render honestly. If a photo is bad, the hero amplifies that — accepted trade-off (the cost is "this dog has a bad photo," which nudges the owner to fix it).

Multi-pet bookings use primary photo + name "&" join for now; full multi-pet design lands when a multi-pet booking enters mock data.

Below the hero: optional booking-cancelled banner → active session panel (when in_progress) → upcoming sessions → past sessions.

### Active session — multi-surface presence

When a session is `in_progress`, four surfaces signal it:

1. **Active session sub-page** (`/bookings/[id]/active`) — focused full-bleed surface dedicated to the live session. Pet hero + ActiveSessionPanel (composition tools — note + photo, GPS for walks) + sticky Finish/Undo footer. Page-level frame with a 4px left amber accent stripe. The page IS the active surface; the panel within renders content only (no card chrome). See "Active session sub-page" below.
2. **Sessions tab Active card** — slim "Active session · Tap for live updates" link card on the parent's Sessions tab (warning-tinted, live-pulse dot + chevron). Routes into the sub-page. The Sessions tab does NOT inline the full composition surface anymore — that lives in the sub-page.
3. **Mobile: floating banner** above bottom nav — `[ACTIVE]  🏠 Sitting Bára · 24 min  ›` (single line, dark pill with yellow text against amber-tinted shell, slim height). Tap routes directly to the active sub-page.
4. **Desktop: sidebar item** below regular nav — same data, different chrome. Routes directly to the active sub-page.

Both mobile banner and desktop sidebar item are avatar-less by design — the status pill + service icon + copy carry the active state without a thumbnail competing for attention in slim formats.

### Active session sub-page (Inbox & Notifications H, 2026-05-08)

Promoted from a query-state branch on the parent (`?view=active`) to a real sub-route at `/bookings/[bookingId]/active` so the live session reads as its own focused page rather than a re-render of the chronicle with content swapped out. Hierarchy:

```
/bookings                      — list
/bookings/[id]                 — detail (Info / Sessions tabs, chronicle)
/bookings/[id]/active          — active session (pet hero + composition + sticky footer)
```

**Routing in:** booking-detail Start button, Schedule quick-start, mobile cross-app banner, desktop sidebar item — all route directly to the sub-page when a session is in_progress. The carer's most-frequent post-Start path is the engagement surface, not the chronicle.

**Routing out:** Finish / Undo / cancel route to `/bookings/[id]?tab=sessions` so the just-completed session appears at the top of the past list with its visit report inline.

**Back navigation goes UP a level**, not browser-history back. Mobile back arrow rendered via `setDetailHeader` (AppNav). Desktop back arrow rendered via `<DetailHeader>` in `PageColumn`'s `abovePanel` slot — `setDetailHeader` only fires on `max-width: 767px`, so desktop needs the explicit `<DetailHeader>` partner. Same dual-back-button pattern as `/bookings/[id]` → `/bookings`.

**Stale-URL guard:** if the URL is hit when there's no in_progress session for this booking (already finished, never started, cancelled), the page redirects to the parent. Prevents a broken empty state.

**Composition surface — note + photo unified.** The active panel uses one composer for either or without (note alone, photo alone, both together) rather than separate add-photo + add-note affordances. Earlier dashed full-frame photo tile was removed in favor of a slim attach-photo control inside the input. Single composition target reduces cognitive overhead during a live session.

### Bookings list (`/bookings`)

Single-mode for solo-role users: owner-only personas (Daniel, Tomáš) see "My Care" content directly with no tabs; carer-only personas (Klára) see "My Services" directly. Tabs return when a viewer has bookings on both sides (Tereza, Tomáš in mock world).

**Cross-side role-expansion banner (2026-05-08):** in single-mode, a slim dismissable banner sits at the top of the panel — for owners, "Offer to help your neighbours? Set up a service on your profile →"; for carers, "Need care for your dog? Find someone you trust →". Aligns with the "everyone-on-the-same-dial" principle from Provider Tier strategy. Persistent dismiss via `doggo-bookings-upsell-dismissed` — once X'd, it's gone for good. Replaces the older bottom-of-list card placement, which got buried as users accumulated bookings.

---

## Key Decisions

1. **Discover is a three-door hub** — `/discover` shows three category cards (Meets, Groups, Dog Care) instead of tabs. This is a **three-door pattern**: each door leads to its own PageColumn-based sub-page (`/discover/meets`, `/discover/groups`, `/discover/care`). Phase 19 replaced the tabbed Meets|Care layout with this hub pattern. All three sub-pages follow the same single-page flow: FilterPillRow for type filtering + floating Filters/View Results buttons for advanced filters. Type picker intermediate pages removed. Care is also accessible via "Find Care" CTAs on the Home feed.

2. **Connection state gates actions, not just appearance** — (Phase 11) Non-connected users see disabled CTAs with contextual explanations. The TrustGateBanner component explains why and suggests next steps (attend a meet, send a connect request).

3. **One profile type** — providers use the same profile layout as any user, with additional sections. See [[profiles]].

   **Individual Providers and Care groups are both first-class** in Dog Care search results. Individual services live on profiles; team services live in Care groups that curate context (location, service focus) and surface their member-providers' matching services via an intersection rule. See `strategy/Groups & Care Model.md` → Provider Tiers on Profiles + Care Group Admin Model.

4. **Interactive map with price markers** — Leaflet map with Carto Positron tiles. Provider pins show price. Desktop 3-column; mobile list with map toggle.

5. **Platform fee shown transparently** — the checkout page shows the 12% platform fee as a separate line item. Builds trust and aligns with "no hidden costs."

6. **Provider setup consolidated** — all "Offer Care" entry points route to `/profile?tab=services`. One place to set up and manage care services.

7. **Active session is a sub-route, not a query state (Inbox & Notifications H, 2026-05-08).** `/bookings/[id]/active` is its own page; the parent Sessions tab carries a slim link card. See "Active session sub-page" above.

8. **Owner-to-provider communication: three surfaces, three jobs (Inbox & Notifications E4, 2026-05-08).** Adopted principle:
   - **Chat** = conversation, time-stamped, bidirectional, ephemeral context. ("Running late, be there 10 mins.")
   - **`Booking.ownerNotes`** = persistent care instructions, true for every session of this booking. ("Key under the blue pot. Bára gets one treat after walks.") Provider-side counterpart: `Booking.carerNotes`.
   - **`BookingSession.ownerNote`** *(deferred — not yet built)* = forward-looking, date-anchored note for a single session. Expires after that session. Symmetric with `BookingSession.report` (provider's backward-looking date-anchored artifact). Use case: "Today only, please skip the leash — vet said her paw needs another day."

   Build status: Chat + `ownerNotes` are live. Per-session `ownerNote` was sketched + decided as the right shape, but build is deferred — adopting it adds a third comms surface that warrants its own walkthrough. Today, owners use chat for "today only" messages. Revisit if the deferred third surface earns its keep. Inbox & Notifications phase resolved the principle, not the build.

9. **Meet-type service bookings have no Care-lifecycle detail page (Service ↔ Meet Linkage, 2026-05-17).** A booking produced by a Meet-type service (`meetBooking` set) is one occurrence of one meet — `serviceType` / `sessions` / the Care contract lifecycle don't apply. Its `/bookings` row routes to `/meets/{meetId}`; the meet IS the session detail. A config #2 drop-off booking (`dropoffMeetId` set) is the inverse — a *Care* booking that runs on a meet but **book ≠ attend**, so it keeps the normal Care booking detail and never touches the roster. See [[meets]] → Service ↔ Meet linkage + [[Groups & Care Model]].

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
→ All sessions done → Completed → "Leave a review" CTA opens CareReviewSheet (modal — 5★ rating + free-text)
→ Submit → review lands on provider's profile in the Reviews section + becomes preview + count increments + system message threads in conversation
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
- **Discover Refinement (closed 2026-05-10):** community-first Discover ordering shipped — Carers in viewer's circle render distinctly above the broader marketplace. Helper/Provider tier collapsed into a single Carer role with an audience setting (`publicProfile`). Appointment filter pill, per-service pricing, service-aware filters, ProviderCard ↔ UserProfile bridging, vet sunset → grooming repurpose all landed. See `docs/archive/phases/discover-refinement.md`.
- **Care Catalog Taxonomy & Filter Redesign (active phase, opened 2026-05-10):** four-service taxonomy resolved (Walks & Check-ins / House sitting / Day care / Boarding) replacing the drifted three-service model. Filter panel redesign in progress — functional Pets checkboxes, real address picker, sub-services accordion, time-of-day granularity, header pattern, service-aware filter shapes per the resolved taxonomy. See [[ROADMAP]] and [[care-catalog-taxonomy-and-filter-redesign]].
- **Inquiry-driven trust transitions:** the auto-Familiar shipped here is a stop-gap. Full model — mutual Familiar on inquiry send, mutual Connected on contract accept, first-service-message detection, decline rollback rules — logged in [[Open Questions & Assumptions Log]] §2 for Inbox & Notifications.
- ~~**Review form** — full review submission flow after completed bookings (currently stub button only).~~ → **Shipped 2026-06-09** (Carer Portfolio + Shelter Walker Credentialing phase, F1–F7). `BookingReview` shape on `Booking`, `CareReviewSheet` modal, system-message integration in the conversation thread, aggregate review count + average on the Reviews section header.
- **Provider dashboard** — earnings view, availability calendar, incoming requests management.
- **Session photos** — `photoUrl` field exists on BookingSession type, UI not yet built.
- **Native camera trigger for in-session photos.** Today the "Send a photo update" button on the Active panel opens a generic file picker (works fine, lets the provider grab a photo from gallery or camera). On mobile, the HTML `capture="environment"` attribute on the file input would prompt the rear camera directly — a small no-cost improvement. Beyond that, a true camera-first flow (full-screen camera UI with shutter, gallery toggle, retake) matches Time To Pet's pattern and feels much more "in-session" than a file dialog. Worth a mock-screen pass during Demo Presentation if we want the in-session flow to feel native; full implementation is post-prototype. Sessions & Service Execution walkthrough B4, 2026-05-05.
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
