---
category: strategy
status: active
last-reviewed: 2026-06-13
tags: [groups, community, carers, care, navigation, demo, mentor-session]
review-trigger: "when touching group features, Community tab, Care groups, care model, or demo planning"
---

# Groups & Care Model

Groups are the connective tissue of Doggo. They're where strangers become regulars, where trust is built through showing up, and where care arrangements emerge from real relationships.

Doggo promotes more community for our pets — getting them cared for more, and more social. In building that out, we create a network that's more trustworthy than credentials alone. Care on Doggo is a byproduct of that community, not a marketplace layered on top. Providers and Care groups succeed because they're rooted in the community, not despite it.

Depends on: [[Trust & Connection Model]], [[Content Visibility Model]], [[User Archetypes]], [[Product Vision]], [[profiles]]

---

## Group Taxonomy

Four group types, each serving a different motivation. Users don't see taxonomy — they see groups. The platform frames them as answers to what users are looking for.

### Parks

Auto-generated, open groups anchored to known dog parks and walking spots. The lowest-friction entry point.

- Auto-generated for known parks (seeded at launch)
- Open by default — anyone can join and browse
- No designated admin — any member can post a meet
- Community-moderated (report → review queue)
- Content publicly visible

**User-facing:** "Parks" tab. Tagline: "See who's at your park."

**Why it matters for launch:** Instant utility before critical mass. Even 3 users in "Riegrovy Sady Dog Walks" with one Thursday walk posted = value delivered.

### Neighbors

Small, hyperlocal groups organized around where you live. The primary use case is mutual aid.

- User-created, creator is admin
- Default private (invite/request to join)
- Typically small (5–20 people)
- High trust, high utility, low content volume
- The natural birthplace of casual care arrangements

**User-facing:** "Neighbors" tab. Tagline: "Meet the dog owners on your block."

**What makes this different from Interest:** Organizing principle is proximity, not shared characteristic.

### Interest

Groups organized around a shared characteristic, activity, or need that crosses neighborhood boundaries.

- User-created, creator is admin
- Can be open or private
- Medium-sized (10–100+)
- More discussion-oriented

**Subtypes:** Breed/type groups, need-based groups (reactive dog support, first-time owners), activity groups (hiking, agility, trail running).

**User-facing:** "Interest" tab. Tagline: "Find your people."

### Care

Groups created by care providers as a community-wrapped service channel. This is where the provider model lives.

- Created by a user who has care services listed
- "Hosted by" badge linking to provider profile
- Events can have service attachments (booking CTAs, pricing, capacity)
- Open or private (provider chooses)
- Provider is admin, can add co-admins

**User-facing:** "Care" tab. Tagline: "Care from people you can see in action."

---

## Group visibility + join flow

Three visibility states map to three join behaviours. The disclosure pattern is two layers: a chip in the hero names the state at a glance, and a helper line under the Join CTA teaches the behaviour at the moment of action.

### Visibility states

| State | Discoverable? | Joining | Use cases |
|---|---|---|---|
| `open` | Yes | One-tap, instant | Parks, broad-interest groups, public park-anchored crews |
| `approval` | Yes | Request → admin reviews | Privacy-sensitive interest groups (reactive dogs, first-time owners), trainer client groups |
| `private` | No (hidden from non-members) | Invite-only in practice | Neighborhood groups, small care provider client circles |

Both `approval` and `private` use admin approval; the difference is whether non-members can find the group. The chip + helper line teach this without forcing the user to read a help page.

### Chip + helper line pattern (resolved 2026-05-11, Cross-Cutting Flow Testing)

**Hero chip** (`GroupVisibilityChip`) — one of three with parallel icon + single-word label + tap-tooltip explainer. Tri-state treatment (including Open) so users learn the system regardless of which type of group they encounter first.

**Helper line** under the Join / Joined CTA — small tertiary text, computed per (visibility × member-state × request-state). Two jobs:
- *Non-member, action context:* Tell them what the button will do. "Anyone can join — no approval needed" / "[Admin name] will review your request" / "Awaiting [Admin name]'s response."
- *Member, ambient reassurance:* Remind them what the group is. Open is silent (nothing to reassure). Approval renders "New members reviewed by admin." Private renders "Members-only — content stays in the group" — the privacy guarantee that makes sensitive sharing safe.

### Request-to-join modal (approval only)

Approval-only groups open a modal on Request to join. The modal:
- Names the admin reviewing ("Eva will review your request and let you know.")
- Offers an optional context note ("Tell Eva about your dog (optional)") — pre-populates a line the admin can read while approving
- Two buttons: Cancel + Send request

Open + private groups never trigger this modal. Open is one-tap join; private is one-tap accept-invite (the invite was explicit consent on the inviter's side).

**Why the modal earns its keep.** The original "Request to join" tap was a blind state flip. The admin received the request with no context and no signal of fit. The optional note pre-populates context that's useful exactly when admin judgement matters — privacy-sensitive support groups where fit beats follower count.

**Implementation:** `components/groups/RequestToJoinModal.tsx` + `getJoinHelperText()` in `app/communities/[id]/page.tsx`. Mock-only: the note isn't persisted yet (no admin-side approval queue surface). The note shape lives in the modal for when that pipeline lands.

### Out of scope (filed as follow-ups)

- Admin-side approval queue + notification when a request lands.
- Per-request note storage + the admin-side surface that reads it.
- Invited-but-not-yet-accepted state for `private` groups (modal copy "Invited by [admin name]" was scoped but the data model doesn't carry that state yet).

---

## The Friendship-Meets-Contract Problem

One of Doggo's most important strategic insights. When neighbors become friends through their dogs, informal care naturally follows — "Can you grab Max on your way to the park?" But informal favors are hard to keep balanced, and the awkwardness of raising that imbalance can poison the friendship.

**Doggo's answer: the platform normalizes transactional clarity between friends.**

When anyone can list a service with a rate and anyone can book through the app, the platform provides social cover for being clear about expectations. The booking system protects the friendship:

- No one's counting favors
- Expectations are explicit (times, duration, needs)
- Payment is handled cleanly
- Both people have a record

**Key messaging:** "You trust each other more because the arrangement is clear, not less." The pitch isn't "monetize your friendships" — it's "keep your friendships healthy by keeping care arrangements simple."

The neighborhood group is where this plays out most naturally: park group → neighborhood circle → regular walking together → booking care from someone who already knows your dog by name.

---

## Provider Types & Configuration

Prague market research identified distinct provider categories, each with a different relationship to community. Care groups support different configurations rather than forcing all providers into one template.

### Provider Categories

| Category | Market context | Primary group use | Gallery mode |
|----------|---------------|-------------------|-------------|
| **Training** | Solo freelancers, ~800 CZK/session, personal brand | Events + discussion + social proof photos | Standard |
| **Walking** | Mix of freelancers/services, ~755 CZK/day | Daily photo updates + schedule + capacity | Updates |
| **Grooming** | 43+ salons in Prague, portfolio-driven | Before/after showcase + service menu + booking | Portfolio |
| **Boarding** | 58+ facilities, trust is #1 barrier | Daily photo updates (anxiety reduction) + booking | Updates |
| **Venue** | Dog-friendly cafés, growing segment | Event hosting + cross-promotion with park groups | Standard |

Vets and rehab are out of scope as first-class carer categories. Both have sticky existing systems, niche audiences, and weak community-first fit (vet selection runs on location + reputation + emergency; rehab is referral-driven and clinical). Their likely landing place long-term is an Adjacent-business advertising surface — external pointers, not first-class Doggo accounts.

### Adjacent care types (non-paid)

Two activity threads exist outside the paid-carer frame and don't appear in the Configuration Model or Suggested Defaults tables below:

- **Shelter dog walking** — volunteer walks of non-owned dogs from partner shelters. Not a Booking, not a Service. Generates trust signals and adoption outcomes rather than revenue. Walker reputation accrues via documented engagements; per-shelter policy gates what's permitted (solo walks vs group walks, walker tier requirements). See [[Cold-Start Playbook]] → "The shelter angle" + "Walker credentialing as a shelter trust layer."
- **Fostering** — temporary care of a shelter dog by a private home. Adjacent to but distinct from paid boarding (no fee, institutional partner).

Both run on different mechanics from paid Care. Called out here so the paid-carer model isn't mistaken for the whole care surface.

### Configuration Model

Care groups get a set of configuration toggles. Platform suggests defaults based on provider category.

| Option | Description |
|--------|------------|
| **Category** | Training / Walking / Grooming / Boarding / Venue / Other |
| **Visibility** | Open or Private |
| **Events enabled** | Can host events/meets |
| **Booking CTAs** | Events can link to booking flow |
| **Discussion** | Post feed active |
| **Service listings** | Show service menu in group |
| **Location type** | Fixed address / Area-based / Mobile |
| **Capacity indicators** | Show available spots |
| **Gallery mode** | Standard / Portfolio (before-after) / Updates (date-grouped) |
| **"Hosted by" badge** | Automatic for all Care groups |

### Suggested Defaults

| Category | Events | Booking | Discussion | Gallery | Location |
|----------|--------|---------|------------|---------|----------|
| Training | Yes | Yes | Active | Standard | Mobile |
| Walking | Yes | Yes | Light | Updates | Mobile |
| Grooming | Optional | Yes | Light | Portfolio | Fixed |
| Boarding | Yes | Yes | Active | Updates | Fixed |
| Venue | Yes | Optional | Light | Standard | Fixed |

---

## Services as Catalog: Care vs Meet vs Appointment vs Mentor Session

**Services** is the umbrella label on a provider's profile — the catalog of everything they offer for money. Under the catalog, offerings split into **four** types, distinguished by *what booking them produces*. This split is the core monetisation model, and getting the language right is what makes Doggo legible to both providers and owners.

### The four offering types

**Care-type offerings** — Walks & Check-ins, House sitting, Day care, Boarding. The provider takes the dog (or in the case of House sitting, comes to the dog). The owner doesn't sign up to a specific scheduled session; they buy the service and the provider delivers it. Booking produces a **Booking** record. No meet, no calendar event the owner attends.

**Meet-type offerings** — Training sessions, paid group walks, workshops. The owner signs up to a specific date/time. Booking produces an attendance on a specific **Meet**. Has a calendar instance with a roster.

> **Meet variant — the mixed group shelter walk** (Adoption-Curious Journey / FC18, 2026-06-12). A community Meet (green) linked to a shelter via `Meet.shelterWalk?: { shelterId }` so it can source shelter dogs. It's **dog-first and mixed**: most attendees bring their own dog; a **vouched** walker can pick up a shelter dog on the way (the dog rides in the existing `MeetAttendee.dogNames`, badged on the People tab); newcomers don't tag along dogless — they discover the walk and take the violet "Walk with a mentor" on-ramp. The Meet stays a community object (green, discovery via the host's care group); `shelterWalk` only sources the dogs (the green→violet funnel boundary). Full surface detail in [[features/shelters]] → "Group shelter walk (FC18)."

**Appointment-type offerings** — grooming, training. The owner books a specific time slot but doesn't attend a "session" with other dogs (no roster). Booking produces a **Booking** record like Care, but is *tied to a fixed time slot* like Meet — solo. Specialised category (grooming vs. training) influences card icon and copy.

**Mentor-session-type offerings** (`kind: "mentor_session"`, the fourth shape — Cross-Shelter Mentor Network 2026-06-09) — a Super Volunteer's paid, supervised *first walk* at a shelter, the path by which a new walker gets vouched to walk solo. Modeled on Appointment (solo, fixed `pricePerSession`, no quote/modifiers) plus `shelterIds[]` (participating shelters) and a recommended price band. Its product isn't pet care — it's **graduation progress at a shelter** — so it routes through a bespoke `MentorSessionBookingSheet` (no inquiry→proposal round-trip) and lands on the **Volunteering** tab, not the paid Care/Services tabs. Full mechanism in [[features/shelters]] → "Shelter-walking journey & mentor network."

The two test questions distinguish the core three; the fourth is identified by *context* (a shelter-walking credential, not care for the owner's dog):
- **Does someone sign up to a specific time?** No → Care. Yes → Meet *or* Appointment.
- **Are there other dogs / a roster?** Yes → Meet. No → Appointment.
- **Is it a supervised shelter first-walk toward a vouch?** → Mentor Session.

### Care taxonomy — the four services (resolved Care Catalog Taxonomy & Filter Redesign, 2026-05-10)

The Care offering shape splits into four services, distinguished by *whose home* and *day vs overnight*. The earlier three-service model (`walk_checkin | inhome_sitting | boarding`) drifted — `inhome_sitting` was originally intended as the babysitter-metaphor "carer comes to owner's home" but every seeded config drifted to "carer hosts dog at carer's home, daytime." This taxonomy decision separates the two cleanly and adds Day care as a peer service.

| Service (`ServiceType`) | Whose home | Day / Overnight | Default price unit | Notes |
|---|---|---|---|---|
| **Walks & Check-ins** (`walks_checkins`) | Outdoor / public | Day | Per visit | Outdoor activity with the dog. Solo walks, group walks, walk-and-potty check-ins. Excludes home visits. |
| **House sitting** (`house_sitting`) | **Owner's** home | Day (default) or overnight | Per visit (default), per night optional | Carer goes to the owner's home. Includes drop-in visits (short version) through to overnight stays. The babysitter metaphor — Sitting *at your house*. |
| **Day care** (`day_care`) | **Carer's** home | Day | Per visit | Carer hosts the dog at the carer's home during the daytime. Returns to owner same day. |
| **Boarding** (`boarding`) | **Carer's** home | Overnight | Per night | Carer hosts the dog at the carer's home overnight. |

**Where Drop-in Visits live.** Drop-ins move into House sitting, not Walks. A drop-in (carer briefly visits owner's home for feeding / potty / medication / company) is a short version of House sitting — same shape, finite duration, same `homeType: owner` semantics. Walks & Check-ins narrows to *outdoor activity with the dog*; pure indoor home visits live under House sitting as a sub-service.

**House sitting price unit.** Per-visit by default; per-night available when the carer offers overnight stays. Same carer can plausibly do both shapes (a 2-hour evening sit vs a weekend stay-over) so the data model supports either via the existing `priceUnit: "per_visit" | "per_night"` field — no engine change. Walks → per-visit only; Day care → per-visit only; Boarding → per-night only.

**Avoiding future drift.** The enum variant names carry the intent — `house_sitting` (owner's home) vs `day_care` (carer's home, day) vs `boarding` (carer's home, night) — and the inline doc next to the enum in `lib/types.ts` documents whose home and day-vs-overnight for each variant. Future code reviews should treat any drift back toward an ambiguous "sitting" label as a regression.

### What goes where

| Offering | Type | Why |
|---|---|---|
| Group walk (provider takes 4 dogs to the park) | Care · Walks & Check-ins | Drop-off; outdoor; owner doesn't attend |
| Training walk (provider walks the dog and works on recall during the walk) | Care · Walks & Check-ins | Drop-off; framing is "walk + training included," not a class |
| Drop-in visit (carer feeds the dog and lets them out at lunch) | Care · House sitting | Short visit to owner's home — same shape as a longer sit |
| Pet sitter comes to owner's flat for the weekend | Care · House sitting (per night) | Owner's home, overnight |
| Carer hosts dog at their flat 9–5 while owner works | Care · Day care | Carer's home, daytime |
| Carer keeps dog at their flat for a week while owner travels | Care · Boarding | Carer's home, overnight |
| Group training session (owner brings dog, joins paid class) | Meet | Specific time, owner signs up to roster |
| 1-on-1 training session (owner books a slot at Stromovka 3pm Tues) | Meet | Specific time, owner signs up |
| Recurring training package (8 sessions over 2 months) | Meet (series) | Generates 8 meet instances, all private to participants |
| Grooming appointment, training appointment | Appointment | Specific time, no roster — solo by design |

**Bio-level mention is fine.** A Care provider saying "I work on basic recall during my walks" inside their walking-service description is *marketing inside a Care offering*, not a separate Training service. If they actually want to *offer* Training as a service (people sign up to a session), it's a Meet.

### The Services tab is comprehensive

The Services tab on a provider's profile lists **all** paid offerings — both Care and Meet types in one place. Users don't see "Care" and "Meet" as labelled categories; they see a single catalogue where offerings *behave differently when tapped*:

- **Care offering tap** → request-booking flow ("Tell me about your dog") → Booking record.
- **Meet offering tap** → "see my upcoming sessions" → user picks a session → book a spot in that meet.

Each offering's row needs to know its own type so the tap routes correctly. This is a small data field on the offering, not a UI segmentation of the tab.

### Service ↔ Meet linkage (resolved 2026-05-13, see Open Q §13 for the full model)

**Services and Meets are independent entities that can be linked.** Neither owns the other. The link itself has properties (required vs optional, one service → N meets).

Four canonical configurations:
1. **Free unlinked Meet.** Tereza's Sunday park walk. No service.
2. **Free Meet + linked-care booking.** Tereza's Thursday neighbourhood walk is free to join. *Separately*, she offers a **Walks & Check-ins Care service** linked to that walk — book it and she walks your dog; you don't come. Two distinct paths on the same scheduled walk: **join free as a walker**, or **book the Care service as an owner**. A user does one, never both — **booking ≠ attending**. *(Remodelled 2026-05-17. Renamed from "drop-off Care service" to "linked-care booking" in the Walk Service Delivery phase, 2026-05-20 — "drop-off" was doing double duty as both the booking shape and the literal delivery method, see "Two axes" below.)*
3. **Meet + required service.** Klára's "Group training session" — to RSVP you must book the service. The booking IS the RSVP.
4. **Service with no Meet.** Pure Care (boarding, house-sitting). Booking produces a Booking record; no roster.

### Two axes: booking shape vs delivery method (Walk Service Delivery, 2026-05-20)

A walks_checkins service carries **two orthogonal axes**. Conflating them caused a long-standing copy mess; calling them out separately is the fix.

**Axis 1 — booking shape (config #2 vs the rest).** Does booking the service add the owner to a meet's roster? **Linked-care booking** (config #2 above) is the shape where it doesn't — book ≠ attend; the owner books the carer to walk the dog, only the dog goes. The opposite is a required-link Meet-type service (config #3), where booking IS the RSVP. The discriminator is `Meet.linkedServices[].required` + the typed field `Booking.dropoffMeetId` (kept named for ripple reasons even though "drop-off" is no longer the user-facing copy).

**Axis 2 — delivery method (pickup vs drop-off).** *Who travels* for the handoff. **Pickup** = carer comes to the owner's address. **Drop-off** = owner brings the dog to the carer / meet point. The owner picks one at booking time and the choice persists on `Booking.delivery`. Per-method pricing lives on `CarerCareServiceConfig.deliveryOptions[]`; the carer can offer one or both (Pawel is canonical pickup-only). Walks-only — boarding / house-sitting / day-care have implicit delivery semantics (whose home implies who travels).

The two axes compose freely: a linked-care booking can be either pickup or drop-off; a non-linked one-off solo walk can be either; a required-link Meet-type session has neither (the owner attends, so nobody's "delivering"). Pricing for axis 2 reads from `deliveryOptions[]` via `computeQuote`; axis 1 stays a structural data discriminator with no price implication beyond the choice of service.

**Copy rules.** Internal field names keep historical strings (`dropoffMeetId`) to avoid a churning rename. User-facing copy uses **"linked-care booking"** for the axis-1 shape and **"pickup" / "drop-off"** strictly for axis-2 delivery. Don't combine them: "drop-off-only" services aren't a thing — a carer can offer a linked-care service with both delivery options, neither makes it more or less linked-care.

**The Service is the monetization wrapper.** It owns: price, pricing modifiers, sub-services / what's included, notes, enabled toggle, audience (circle vs anyone). For Care-type services it also owns the structural fields (service type, price unit) since there's no Meet to delegate to. The Meet, when present, owns the operational fields — location, cadence, occurrences, attendee cap, RSVP rules.

**Cardinality is one-to-many.** One service can link to multiple meets. Klára's "Group training session" service is one product offered on her Tuesday cohort AND her Saturday cohort — same description, same price, same modifiers, available at different scheduled times. Forcing one-service-per-meet would mean duplicating the service entry per scheduled occurrence; she's not selling separate products, she's selling one product at several scheduled times. Data model: `Meet.linkedServiceIds[]` (typically 0–1 per meet in practice).

**Book routes through one flow from both doorways.** Tap Book on the meet detail page OR on the carer's Services tab → same booking sheet. When the service links to multiple meets, the booking sheet shows a session picker so the owner chooses which occurrence; one-meet link defaults to next occurrence. The Booking record is created; the attendee is added to the meet's roster (when linked).

**Meet card UX by link type.** When a meet links an *optional* linked-care Walks service (config #2), the meet card's primary CTA stays "Join free" — the meet's identity is "community walk, free to join." The Care service surfaces inline as a *separate* supplementary callout ("Have a carer walk your dog") routing to the linked-walk booking flow (`LinkedWalkBookingSheet`) where the owner picks pickup or drop-off — book and join are distinct paths, never combined. When the link is *required* (config #3), the free CTA collapses; the card shows "Book session → 350 Kč" as the sole CTA.

**Discovery cross-surfacing.** Meets with required services appear in both `/discover/meets` and `/discover/care` (under the appointment-type filter). Two doorways for two user intents (browsing community calendar vs shopping for paid services). Filter de-duplication and result-count semantics need deliberate design — see Open Q §13.

**Current status (Service ↔ Meet Linkage phase, 2026-05-17).** Authoring UI is live. The carer authors all service kinds — Care, Meet, and Appointment — in one place (the Services tab edit): per-kind edit cards, a search-and-add linked-meets picker, the per-link required flag. Booking routes through one flow (`BookSessionSheet`) from both doorways (the carer's Services tab and a linked meet's detail page); a session booking creates a `Booking` record and adds the owner to the meet roster. The data model is the two-sided link (`CarerMeetServiceConfig.linkedMeetIds[]` ↔ `Meet.linkedServices[]` with the per-link `required` flag).

The phase shipped all three meet-linkage configs: **free unlinked** (#1), **required-link** (#3 — Klára's training/workshops: a paid session you attend, booking = RSVP), and **config #2** (a free meet + a linked drop-off **Care** service). **Config #2 was remodelled mid-phase** (see §13 correction) — it isn't "a free meet + optional Meet-type service / mixed roster," it's "a free meet + linked drop-off Care service, where **booking ≠ attending**" — then rebuilt as Workstream H: the meet detail shows a drop-off-Care callout; booking it creates a Care `Booking` without adding the owner to the meet roster. The one remaining slice is the link-*authoring* UI (the phase seeds the meet↔Care link) — a scheduled follow-on.

Remaining open items live in Open Q §13 — chiefly: the auto-pricing-engine extension to Meet-type services (Meet/Appointment keep flat rates for now), `/discover/care` cross-surfacing of Meet services + multi-doorway filter dedup, meet-cancellation handling for attached service-bookings, the free→paid mid-meet upsell, and a per-service publish/draft model.

### Meet-type service visibility

A meet-type service can produce instances at different visibility levels:

- **Public** — open enrollment. Visible on the group's Meets tab, in Discover, on the provider's catalogue. Anyone can book a spot.
- **Group-only** — open enrollment to group members only. Visible inside the group, hidden from Discover.
- **Participants-only (private/contracted)** — instances generated by a package or contracted 1-on-1. Visible only to creator + roster (the booked owner). NOT discoverable on the group's Meets tab. Lives on the participants' schedules.

The Services tab catalogue links to *publicly bookable* sessions only. Private/contracted instances live on Schedule (the participants' calendar surface) and don't appear in any catalogue or discovery surface.

This adds a new visibility level beyond today's `public | group_only` for meets — see [[Content Visibility Model]] §1 for the access table.

### In-product communication

The Care vs Meet split is a **teaching surface**, not a labelled UI segmentation. Users won't see "Care" and "Meet" as two tabs — but the *behaviour* of tapping a card teaches them the distinction implicitly.

Onboarding copy when a provider adds an offering should ask the routing question in human terms, not data-model terms:

- "How does this work?"
  - **I take the dog** (Walks & Check-ins, House sitting at owner's home, Day care or Boarding at my home) — routes to Care offering shape
  - **I run a session people sign up for** (Training, Workshop, Group meet) — routes to Meet offering shape

Provider doesn't need to know "Care vs Meet"; the routing question handles it.

For owners browsing, no copy distinction is required — the card content does the work. A Care card shows price-per-visit, availability days, "Request booking." A Meet card shows next-upcoming-date(s), "Book a spot." Different signal, same surface.

### Why this matters for monetisation

The core revenue line is platform-mediated transactions (per [[Product Vision]] → Business Model). That works only if the catalogue is legible to both sides:
- Providers need to know how to publish what they offer (Care service or Meet session?) without a confused junk-drawer of half-defined offerings.
- Owners need to know what they're booking — a discrete session at a specific time, or an arrangement they're handing the dog over for.

If Care and Meet collapse into one ambiguous "service" concept on the provider's catalogue, the booking flow can't differ correctly and the trust model (sign up vs. hand off) breaks. Keeping the model crisp is a precondition for monetisation, not a polish concern.

### Pricing model (Care offerings, Pricing & Proposals 2026-05-05)

Care offerings carry structured pricing — base rate per service + a starter modifier set. **Provider configures pricing once; auto-pricing engine produces the quote; provider reviews and sends.** This structurally enforces the no-bargaining principle: provider doesn't compose the price, the system does.

- **Engine:** `computeQuote(config, inquiry, today)` in `lib/pricing.ts`. Pure function: per-service config × inquiry data × today's date → `BookingPrice` with stacked line items.
- **Starter modifier set** (`PricingModifier` discriminated union on `CarerCareServiceConfig.modifiers`): Holiday surcharge, Weekend rate, Multi-pet, Last-minute. All work with already-captured inquiry data — no inquiry-form expansion required for v1.
- **Override path** stays available — provider can deviate from the engine quote — but deviations are visibly flagged on the owner's `BookingProposalCard` with optional reason. Override is a documented exception, not silent bargaining.
- **Three-surface visibility.** Engine output appears at three points so both parties see the same number through the lifecycle: InquiryForm live estimate (owner) → InquiryCard estimate (chat artifact, both sides) → ProposalForm "System quote" header (provider review).

Meet and Appointment offerings retain flat-rate pricing for v1 (no modifier dimensions yet). Future modifier passes (longer-walk, off-hours, boarding-specific, add-ons, packages) will need inquiry-form expansion; tracked in `features/explore-and-care.md` → "Future inquiry-form fields."

See `features/explore-and-care.md` → "Pricing model" for the full breakdown.

---

## Carers on Profiles

The "care dial" lives on profiles, not on groups. Every user starts as an Owner and can become a Carer as their comfort with offering care grows. Progression is always visible, never transactional — copy never frames care as "earning income" or "becoming a Provider."

### One role: Carer

A user is either an Owner (no `carerProfile`) or a Carer (has a `carerProfile` with services configured). There is no separate "Provider" tier; the earlier Owner / Helper / Provider three-tier framing collapsed during Discover Refinement (2026-05-10) when we accepted that Helper and Provider weren't different roles, just two settings of the same audience configuration on the single Carer role. The previous "Provider tier action axis" goes away — what's left is one boolean on the Carer's profile: `publicProfile`.

### Carer audience: circle vs anyone

A Carer's services have an audience setting that controls who can act on them — book, inquire, transact. Same role; what changes is the audience reached.

| Audience setting (`carerProfile.publicProfile`) | Who can act on services | Appears in `/discover/care`? |
|---|---|---|
| `false` — "open to your circle" | Connected viewers only | No |
| `true` — "open to anyone" | Anyone (subject to Lock visibility — Locked profile narrows actionable viewers to those who can see the profile) | Yes |

Composition with **Lock** (the profile-visibility setting from [[Trust & Connection Model]]) is documented at `features/profiles.md` → Lock + Carer audience: two settings, one role.

### Group co-membership as a third visibility path (Demo Narrative V2, 2026-05-19)

A `publicProfile: false` Carer's offering doesn't show up in `/discover/care` (audience = circle) and is gated by Connection on their profile's Services tab — both correct for "casual care between people who already know each other." But a fellow **private-group member** is a third class of "person who already knows you" — even if they're not 1:1 Connected. The "Care from neighbours" surface (`components/groups/GroupNeighbourCare.tsx`) lives on a private group's **Members tab** and lists members' circle-scoped Care offerings; **group co-membership grants the visibility** (not 1:1 Connection). Booking reuses `InquiryFormModal` — the same machinery as a marketplace Care booking.

Why: the private-group mutual-care concept is "a closed circle of neighbours where members offer care to each other." Without this surface, a new member can be inside the circle but unable to see what their fellow members offer. The surface is **members-only** (guests / non-members don't see the section) and **scoped to non-Care groups** — Care groups foreground their providers via the hero instead.

### Individual Carers and Care groups are both first-class

Neither requires the other.

- **Individual Carer.** Services live on the profile. With `publicProfile: true`, appears in `/discover/care` on their own merit. No group required. (Tereza's journey: sits for neighbours at a modest rate, no group; her audience setting could be circle or anyone depending on whether she wants to take strangers.)
- **Care group.** A team or small-service-business container. Group appears in Dog Care search and in Groups. Individual member-carers are surfaced through the group — see Care Group Admin Model below. (Pawz: team of trainers. Klára could run her solo practice as a Care group if she wants a community-wrapped channel — but she doesn't have to.)

A Carer can be both — services on their profile *and* membership/admin of a Care group. The two surfaces reinforce each other.

### Copy rules

- **Never:** "Become a Provider." "Start earning." "List your services."
- **Instead:** "Offer to walk for friends?" "Ready to open this to your neighbourhood?"
- The progression is always framed as opening the audience wider — from nobody, to your circle, to anyone. Commitment scales with reach.
- **Narrative and copy are a living discipline, not a one-time exercise.** Every phase includes a pass on the language of its surfaces. We move toward copy that sounds natural, specific, and un-transactional — and revisit existing copy as the model sharpens.

---

## Care Group Admin Model

A Care group is a community-wrapped container for a team or small service business. The admin curates the group's context; they do not run members' individual practices.

### Group hero anatomy (resolved Discover & Care 2026-05-02)

The Care-group hero serves a double role: community attribution AND a low-friction handoff to the provider's full profile. Tension: bias toward *too much* and the page reads as a marketplace storefront; bias toward *too little* and providers can't see Doggo as a viable channel.

**Decision: lean restrained. Hero surfaces:**

- **Provider avatar(s)** — single avatar for one-provider groups, small overlapping stack (≤3 visible) with "+N" tail for multi-provider.
- **Primary attribution name(s)** — "[Name]" for single, "[Name1], [Name2]" for two, "[Name1] + N others" for 3+.
- **Category badge** — Training, Grooming, etc.
- **Tagline** — first two sentences from primary provider's `carerProfile.bio`. Optional; omitted for multi-provider since one bio doesn't represent the team.
- **Top 1-2 community-earned trust badges** — "Trusted by N in your circle," "Community Regular." Wired in Discover & Care D5/D6.
- **"View profile" link** — handoff to the full profile (richer credentials, full services, posts).

**Hero does NOT surface:** full credentials list, services menu (lives on profile Services tab), reviews preview (also profile-side), pricing summary. The hero is attribution + community signal; depth lives on the profile.

**Single vs multi-provider:** the layout doesn't change shape — same vertical card. Avatar, attribution, and tagline behave per the rules above. For multi-provider, the View profile link opens the *primary* provider; B-stream future work could surface a member-list expander if needed.

**Admins can:**
- Brand the group (logo, name, methodology statement)
- Define the group's context (location, neighbourhood, service focus, methodology)
- Add and remove carer-members
- Define the group's service catalog (taxonomy, not pricing)
- Host meets and events under the group banner
- Broadcast announcements to group followers

**Admins cannot:**
- Set rates for member-providers (rates live on individual profiles)
- Override member services (services live on individual profiles)
- Redirect payment (payment flows to the individual provider, always)

### Service intersection rule

Services displayed in a Care group are the intersection of:

- Services offered by member-providers (on their individual profiles)
- Services matching the group's context (location, service type, methodology)

A provider in multiple Care groups only has the contextually-relevant subset of their services surfaced in each group.

**Example:** Klára offers Private Training at Stromovka and at Riegrovy Sady. She is a member of two Care groups: "Stromovka Collective" (anchored at Stromovka) and "Vinohrady Training" (anchored in Vinohrady). Stromovka Collective surfaces her Stromovka offering. Vinohrady Training surfaces her Riegrovy Sady offering. Her profile shows both.

### Admin onboarding

The admin-creator of a Care group is guided through context-setting, member-adding, and how services will be surfaced. Onboarding teaches the admin that they curate context, not pricing or service delivery. Exact UX is a design question for the phase that builds it.

### Future considerations (post-MVP)

- **Group revenue share.** Can admins take a small percentage of member bookings as a cooperative fee? Park until monetization work.
- **Pricing drift.** If a member prices oddly relative to the group's brand, admins can remove them. No system-level fix needed.

---

## Community Tab Structure

The Community tab uses MasterDetailShell: left panel (group list filtered by category tabs) + right panel (feed or group detail).

### Tabs

| Tab | Left panel | Right panel default |
|-----|-----------|-------------------|
| All | All your groups, sorted by recent activity | Feed: all group + connection posts |
| Parks | Park groups near you | Feed: park group content |
| Neighbors | Neighborhood groups | Feed: neighbor group content |
| Interest | Interest/breed/activity groups | Feed: interest group content |
| Care | Provider groups you follow | Feed: care group content |

Selecting a group replaces the right panel with that group's detail view.

### Group Detail Tabs (per type)

| Group type | Tabs |
|-----------|------|
| Park | Feed · Meets · Members |
| Neighbor | Feed · Meets · Members |
| Interest | Feed · Meets · Members |
| Care | Feed · Events · Services · Members · Gallery |

**No Chat tab on groups.** Feed posts have flat comments for async discussion. Real-time coordination lives on meet-level chat (see below). Private messaging lives in Inbox. Three clear surfaces, no overlap.

**Who can post:** Parks/Neighbors/Interest — any member. Care groups — provider/admin posts, members comment and react.

### Members tab structure

The Members tab uses the same section-grouped + attendance-gated pattern as the meet People tab. Same `PersonRow` component, same `OwnerDogAvatar` cards, same disclosure model.

**Section grouping (top to bottom):**

1. **ADMINS** — group admins (role-based grouping, regardless of connection state). Admin badge renders on each row.
2. **MetaDivider** between Admins and the rest if both groups have content.
3. **CONNECTED** — non-admin Connected members, with the viewer pinned to the top of the subsection.
4. **FAMILIAR** — non-admin members the viewer has marked Familiar (outbound).
5. **Other tier-1/2** — non-admin members with Pending state, Open profile, or inbound `theyMarkedFamiliar`. Unlabeled — preserves deniability for inbound Familiar marks.
6. **LOCKED PROFILES** chip list — non-admin tier-3 members (locked + no relationship + no inbound signal). Names + small avatars only, no card affordance.

**Action availability: group co-membership is the context signal.** The Members tab does NOT gate on past meet attendance. Reasoning: users recognise each other from real-world meetings (outside the platform) or from group context itself; gating on platform attendance is overly strict. Each row's actions resolve from the matrix without a context filter.

**Visual pattern matches the People tab.** Same `PersonRow` rendering — inline Familiar/Pending pill on the left, single inline action affordance on the right. The only difference between People tab and Members tab is the gating rule (People: attendance-based; Members: always-available); the visual treatment is unified so users learn one pattern across surfaces.

**Trade-off acknowledged:** Members tab IS less restrictive than People tab. The community-first thesis (meets build trust) is preserved at the meet level — meets remain the canonical Familiar trigger via the post-meet review sheet. The Members tab is a secondary path for users who recognise someone from real life or group context.

**No Carer-status badge on PersonRow.** Discover Refinement (2026-05-10) retired the per-row tier pill — connection grouping + section labels do the work, and trust badges (Community Regular, Trusted by Your Network, etc.) reclaim the badge real estate. Carer audience signaling (`publicProfile`) lives at the surface level (Discover Care section structure, profile hero) and not on individual rows.

Implementation: `MembersTab` in `app/communities/[id]/page.tsx`. Section primitives (SectionHeader, MetaDivider, LockedChipList) shared with `ParticipantList` via `components/people/PersonSections.tsx`.

### Meet Detail Tabs

All meets use a tabbed detail view:

| Tab | Content |
|-----|---------|
| Details | Logistics, type-specific info, RSVP actions, group link |
| People | Attendee list tiered by connection state, post-meet reveal |
| Chat | Event-scoped coordination thread ("running late", "great walk!") |

Meet chat is time-bound and scoped — the right surface for real-time coordination. Requires RSVP to participate.

---

## Tagging Privacy Within Groups

Groups are shared spaces, but individual privacy still applies per the Content Visibility Model.

### Who can tag whom

| Relationship | Can tag? |
|---|---|
| Connected | Yes (approval request sent) |
| Familiar (tagger → tagged only) | No — one-sided |
| Familiar (tagged → tagger, or mutual) | Yes (approval request sent) |
| None | No |

### Who sees tags

Tags on a photo are filtered per viewer. You only see tags for people you have visibility access to (relationship gate). The photo is communal; the identity metadata is personal.

**Example:** Users A, B, C in a group. A and B are Connected. A marked C as Familiar. C is Locked. A posts a photo and tags everyone. B sees A's tag but not C's (no relationship with Locked user C). C sees A's tag (trusts A). A sees all their own tags.

---

## Group Properties Summary

| Property | Park | Neighbor | Interest | Care |
|---|---|---|---|---|
| Created by | Auto-generated | Any user | Any user | User with care services |
| Default visibility | Open | Private | Open or Private | Provider chooses |
| Admin | None (community-moderated) | Creator | Creator | Provider |
| Service CTAs on meets | No | No | No | Yes |
| "Hosted by" section | No | No | No | Yes |
| Content visibility | Public | Members only | Follows setting | Follows setting |
| Typical size | Large (50+) | Small (5–20) | Medium (10–100+) | Medium (10–50) |
| Primary value | Discovery | Mutual aid | Shared interest | Service + community |

---

## Four User Journeys

### Tereza — Routine Owner → Neighborhood Anchor

Park group → recognizes regulars → creates private neighborhood group → neighbors walk together → informal care emerges → lists sitting at a modest rate → booking system makes it sustainable. Provider dial: zero → barely turned.

### Daniel — Anxious New Owner → Finding His Crew

Reactive dog support group (private, interest) → lurks, then attends small meet → connects with members → discovers one is a trainer (Klára) → joins her care group → books training. Entire experience built around a specific need.

### Klára — Trainer Building a Practice Through Community

Creates open care group with training sessions → also joins park groups as regular owner → builds connections organically → park group members discover her services via profile → join her care group → book sessions. Community IS the marketing.

### Tomáš — Newcomer Finding His Bearings

New to Prague → joins park groups near apartment → attends meets → gets invited to neighborhood group → neighborhood becomes his anchor → emergency booking from a neighbor he already trusts. Uses Doggo purely as utility — no content creation, no provider aspirations.

---

## Language & Presentation

**Never use "archetype" or "taxonomy" with users.** They see groups, not categories.

| Internal term | User-facing | Tab label |
|--------------|-------------|-----------|
| Park group | Park name | Parks |
| Neighbor group | Neighborhood group | Neighbors |
| Interest group | Community / topic name | Interest |
| Care group | Provider/business name | Care |

**Business representation.** Care groups are how teams and small service businesses are represented on Doggo. Pet product retailers (toy shops, food, retail) and other non-service adjacent businesses are not Doggo members; a future advertising line may serve them externally. See the Open Questions & Assumptions Log, Monetization section.

**To providers creating a Care group:** "Build your client community. A group gives your clients a place to see your work, follow your schedule, and book when they're ready."

**To new users:** "Your dog's community starts here. Groups are where you meet people, find walks, and build trust."

---

## Open Questions

Open questions for this domain live in the canonical log — see `Open Questions & Assumptions Log.md` → section 3 (Groups & Meets) and section 4 (Provider Model).

---

## Related Docs

- [[Product Vision]] — community-first thesis, business model
- [[Trust & Connection Model]] — connection states, profile visibility
- [[Content Visibility Model]] — who sees what content and why
- [[User Archetypes]] — behavioral profiles, two ramps
- [[profiles]] — profile structure, provider dial
- [[meets]] — meet structure, attendee lists
