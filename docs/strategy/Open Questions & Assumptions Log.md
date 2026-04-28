---
category: strategy
status: active
last-reviewed: 2026-04-27
tags: [questions, risks, assumptions]
review-trigger: "before starting a new phase, after any strategic discussion"
---

# Open Questions & Assumptions Log

Tracks known unknowns, assumptions, and risks. Reviewed at the start and end of every phase.

---

## 1. Community Adoption

**Assumption:** Prague dog owners will use an app for social dog meets rather than sticking with WhatsApp/Facebook groups.

**Open:**
- What's the minimum neighbourhood density for community features to feel alive?
- How do we seed initial activity without it feeling artificial?
- What's the "aha moment" — the first experience that makes a user come back?

---

## 2. Trust & Connection Model

**Assumption:** The four-state connection model (None → Familiar → Pending → Connected) maps to real trust-building.

**Resolved:** Familiar is one-sided, silent (no notification), Connected is mutual. Post-meet review flow is the primary trigger for Familiar marking — card stack of attendees with Mark Familiar / Connect / Skip actions, plus batch "Mark all" option. Care services gate on Connected status. Connection model is universal (no separate provider relationships). Trust ladder replaced by contextual signals. Only locked-profile users can mark Familiar (Open users skip to Connect). You can only mark someone Familiar if their profile is visible to you (not locked).

**Open:**
- How many IRL interactions before users feel comfortable going Familiar → Connected?
- Will Locked users feel excluded or empowered?
- Should the post-meet review flow trigger immediately after the meet ends, or after a delay (e.g. next morning)?
- **Hybrid trust model:** Should Doggo offer lightweight top-down trust signals (verified ID, community participation score, "X shared connections") alongside community-built trust? Fluv's vetting-first model shows users want some confidence before committing, even if Doggo's community trust is deeper long-term. See `docs/strategy/Competitive Research - Fluv.md`.
- Should there be an "intro session" (free/reduced first meeting) for owners booking a provider they haven't met at community events?

---

## 3. Groups & Meets

**Assumption:** Groups are the right persistent container for community — meets alone aren't enough.

**Resolved:** Four group types (park/neighbor/interest/care). Park groups auto-generated. Group detail tabs vary by type. No Chat tab on groups — Feed with flat comments for async (built), meet-level chat for real-time coordination (built). Going/Interested RSVP states with interactive cycle (Going/Interested/Leave). Meet detail tabs (Details · People · Chat) — built with photo gallery. Schedule tabs: Upcoming / Care / Interested. Care tab has sub-filter pills (All / Getting Care / Providing). Interested tab auto-populates from joined groups. Discover flow refactored: hub → results with FilterPillRow + floating Filters button (no more type picker pages). Care group discovery path resolved: Discover > Dog Care with filter pills for service type.

**Resolved (2026-04-27):** Recurring-meet RSVP model. `Meet.cadence` (`one_off | weekly | biweekly | monthly`) is the discriminator. For recurring series, RSVP is always per-occurrence: `Meet.attendeesByDate` keyed by ISO date holds the authoritative roster, with each upcoming row offering Going + Skip (Skip persists via `useDismissedReviews`, mutes-in-place with inline Undo). Series-level subscription is a separate "Interested" toggle (data on `Meet.followers`). Per-occurrence Interested was considered and dropped — "maybe to a specific Wednesday" added noise without much value. Schedule renders one card per (meet, occurrence-date). Cards across the app show "Next: [date]" for recurring meets. Out of scope: per-occurrence editing/cancellation, end-of-series UI, full notification delivery for Following. See `archive/phases/meet-recurrence-model.md`.

**Open:**
- Can the platform suggest meets based on patterns? ("3 regulars walk near Letná on Tuesdays")
- What's the right max group size for different meet types?
- Should meet discovery include a map view?
- Park group scaling — what happens when a park group hits 500 members?
- Can neighborhood groups be auto-suggested based on user density?
- **Cross-category groups (partially resolved).** A trainer running sessions at a specific park is a Care group with the park as its context. Recurring park meets surface in Parks too via the service-intersection rule (see `Groups & Care Model.md` → Care Group Admin Model). Open: exact rules for when a Care group's meets appear in Parks search vs only in Dog Care search.
- **Group-to-group crossover meets.** A trainer co-hosting a workshop between their Care group and the reactive dog support group — how does this work? Dual-listed? Shared event?
- **Series subscription notifications.** Following a recurring series should produce notifications when new dates are added to a series with an irregular cadence and possibly 24h-before reminders for upcoming occurrences. The `meet_series_update` notification type is wired (stubbed entry on meet-7), but real triggering, batching, and opt-out behaviour are deferred. Belongs with the broader notifications work — not Mock World Building.
- **Series ending semantics.** Recurring meets carry an optional `seriesEndDate`, but UI for end-of-series (last occurrence past, no further dates) is unbuilt. Treat as inactive series for now; design when a real series in mock data hits its end date.

---

## 4. Provider Model

**Assumption:** Users are comfortable evolving owner → helper → provider when framed as community contribution. No separate provider identity — it's a dial, not a switch.

**Resolved:** No separate provider signup. Provider toggle from existing profile. Same layout with additional sections. Care groups created by providers with config options per category. Rolling weekly billing model for recurring bookings — sessions generate one at a time, no fixed session count. Provider session actions: Start → Complete → Add note. Booking detail page works for both owner and provider perspectives with tabbed layout (Info / Sessions / Chat).

**Open:**
- At what point does "helping" feel like a job?
- Where does pricing surface before a formal arrangement?
- Should creating a Care group require having services listed first?
- Should providers be able to set cancellation policies (e.g. 24hr notice)?
- What does the session completion flow look like for providers? (Visit report card: photos, notes, GPS summary, timestamps — see `docs/strategy/Competitive Research - Time To Pet.md`)
- Should owners receive real-time updates during active care sessions (live GPS, mid-session photos)?
- What pet info should surface in the provider's "in-session" view? (medication, vet contact, behavioural notes, emergency info)
- **Lock vs. Tier reconciliation.** Profile Lock (privacy) and Provider Tier (Helper/Provider service visibility) currently overlap in how they describe service visibility. `features/profiles.md` describes Lock as the gate for service visibility ("only Familiar/Connected can see services when Locked"); `Groups & Care Model.md` says Helper tier = Connected-only service visibility. Needs a product decision: are these coexisting mechanisms (Lock = general profile privacy, Tier = service-specific visibility) or does one supersede the other? Feature doc alignment follows the decision. Best resolved during Community & Groups Deep Pass or Discover & Care Deep Pass.

---

## 5. Safety & Liability

**Open:**
- Platform liability during meets?
- Does blocking someone remove you from shared public meets/groups?
- What incidents require trust regression (removing Connected status)?

---

## 6. Monetization

**Assumption:** Trust must exist before monetization. Community features stay free. Pet service businesses (training, walking, grooming, boarding, rehab, venue, vet) are represented on Doggo as Care groups. Pet product retailers and other non-service adjacent businesses are not Doggo members.

**Open:**
- What user behaviour indicates readiness for paid transactions?
- Platform-mediated payment from the start, or peer-to-peer first?
- Do Prague pet businesses see value in a community-embedded directory?
- **Adjacent-business advertising (post-MVP).** Can localized promotional placements for adjacent businesses (salons that don't want a Care group, toy shops, pet food retailers) be a post-MVP revenue line that points to external sites? What's the right gate — max one promo per session, per surface, user-toggleable? Does advertising threaten the community trust thesis if not carefully framed?
- **Group revenue share (post-MVP).** Can Care group admins take a small cooperative-fee percentage of member bookings? See Groups & Care Model: Care Group Admin Model.

---

## 7. Prague, Cold Start & Go-to-Market

**Assumption:** Prague dog culture values routine, parks, informal socialisation. Seeding with providers who use meets as a client acquisition channel solves both sides of the marketplace.

**Refs:** `Competitive Research - Prague Dog Care Scene.md` (trust patterns, badge taxonomy, seeding strategy)

**Open:**
- Need to map Czech-language informal networks (Facebook groups, forums) beyond the English expat ones we've found
- What expectations exist around verification/identity in Czech culture?
- Are Vinohrady/Letná/Vršovice the densest neighbourhoods for dog owners?
- Can we recruit 3-5 providers willing to host weekly meets? What's the pitch?
- What's the ROI timeline — how many weeks before meet attendees convert to paying clients?
- Does provider-hosted meets feel organic or salesy?
- Should Doggo offer seed provider incentives (free period, reduced fee, featured placement)?

---

## 8. Trust Badges & Hybrid Trust

**Assumption:** Community-earned trust is primary, but lightweight top-down signals (verified ID, network overlap, credentials) bridge the gap for users who haven't built connections yet.

**Refs:** `Competitive Research - Prague Dog Care Scene.md` (badge taxonomy), `Competitive Research - Fluv.md` (hybrid trust model)

**Open:**
- Which badges matter most to owners for MVP? Prioritise from the full taxonomy.
- Self-declared credentials only at launch, or verify any?
- How do badges display on compact cards vs. full profiles? Max count before clutter?
- Does "Trusted by your network" require Connected, or does Familiar count?
- Should there be an "intro session" (free/reduced) for the direct-discovery booking path?

---

## 9. Navigation & UX

**Resolved:** Mobile bottom nav: Community | Discover | My Schedule | Bookings | Profile (5 tabs). Desktop sidebar: Community, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items). Mobile header: create + notifications + inbox. Home renamed to Community with category sub-tabs. All pages unified to PageColumn single-column layout (640px centered). Sidebar tightened to 180px. MasterDetailShell and DiscoverShell deleted. Sidebar active state: neutral (transparent-dark-4 + text-primary). Header action buttons: CTA pill variant (brand for primary, outline for secondary). DetailHeader and PageColumn headers aligned (40px, 16px padding). Scroll-to-hide nav restored via page-column-panel-body class. Bottom-nav visibility regex updated to keep nav on hub-route sub-tabs (`/schedule?view=meets`, `/profile?tab=posts`, `/bookings?tab=services`) — fixed during Persona Wiring.

**Resolved:** New-user feed populated by `getNewUserFeed()` — picks public/nearby content, completed-meet recaps from open groups, "find your park" prompts. Switcher persona `new-user` previews this state across every surface (`useIsNewUser()`). Closed by Persona & Demo Mode Wiring (2026-04-26).

**Open:**
- (none currently — all nav/UX questions resolved or deferred to surface-specific phases)

---

## 10. Demo & Presentation

**Resolved:** Four journey personas (Tereza, Daniel, Klára, Tomáš) plus Shawn (default) and a synthetic "New User" persona for empty-state previews. Mock data layer built with 20 users, 24 meets, 35 posts, 13 reviews, 10 bookings, 8 conversations, 20 group message threads. Image generation prompts prepared (40 prompts across 7 tiers).

**Resolved:** Persona switching works via React context (`CurrentUserContext`) backed by `localStorage`, with a SSR fallback to Shawn. Three switcher surfaces — profile-page name dropdown (primary), `/demo` route (canonical entry, shareable URL), `?as=<personaId>` URL param (non-persistent preview). "New user" is a regular persona option in the picker rather than a separate boolean toggle. Full spec in `docs/features/demo-mode.md`. Closed by Persona & Demo Mode Wiring (2026-04-26).

**Open:**
- Should the demo entry page present scenarios ("See what it's like as a...") or user profiles? — Defer to Demo Presentation phase. The infrastructure supports either; the framing is a marketing/storytelling decision, not a technical one.
- Should the demo include a guided tour or let users explore freely? — Defer to Demo Presentation phase.
- What does each persona's "highlight reel" look like — which 3-4 pages tell their story best? — Surface during Mock World Building. The persona switcher is the foundation; the highlight reels need rich per-persona content first.

---

## 11. Technical

**Resolved:** Chat uses mock data, designed for Supabase Realtime swap.

**Open:**
- Notification strategy — what triggers push vs. quiet delivery?
- Supabase data model for production — design before building backend.
- Image storage/hosting for galleries and meet photos.
- Provider ID dualism — **partially resolved**: `userId` bridge field added to ProviderCard, `nikola-r` maps to `nikola`. All profile links now use `/profile/[userId]` pattern. Remaining providers (`olga-m`, `jana-k`) still need `userId` mapping — not blocking demo but needed before real backend. Refined further during Persona Wiring (see punch-list P4): the real shape is providers exist as a directory-only surface in `mockData.ts` with no `UserProfile` counterparts in `mockUsers.ts`. Either backfill profiles for every provider (Mock World Building) or formalise the bridge pattern.
- Connection state is Shawn-only — `getConnectionState(userId, viewerId)` returns `undefined` for non-Shawn viewers. Mock World Building needs to seed per-persona connection rosters so attendee tier rendering works for Daniel / Klára / Tomáš views. Surfaced during Persona Wiring C4.
