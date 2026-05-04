---
category: strategy
status: active
last-reviewed: 2026-05-04
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

**Resolved:** Familiar is one-sided, silent (no notification). Connected is mutual. Post-meet review flow is the primary trigger for Familiar marking. Care services gate on Connected status. Connection model is universal (no separate provider relationships).

**Resolved (2026-04-27, Trust & Visibility Pass + Meets Deep Pass walkthrough):**

- **Action matrix v3 — Familiar gates Connect app-wide for locked viewers.** Locked viewers see only Familiar in the unmarked state; Connect appears only after marking. The trust gradient (Familiar before Connect) is now enforced in the UI. Open viewers skip Familiar entirely (it's redundant — their profile is already public).
- **Deniability principle.** Privacy of Familiar marks is preserved by deniability about the cause, not by absence of effect. When a card is bumped to Tier 2 in the receiver's view, multiple actions could explain it (bulk Familiar, profile-visibility toggle, etc.) — the receiver cannot infer specific intent. Implementation guardrails: no UI surface explains WHY a row was promoted; surface contextual signals like "you were both at last week's walk" instead. Lives in `lib/personActions.ts` (matrix), `lib/meetUtils.ts:getAttendeeTier` (tier logic, bumps on inbound `theyMarkedFamiliar`), `components/people/PersonRow.tsx` (pill suppression rules), `components/ui/ConnectionIcon.tsx` (single rendering across directions).
- **Post-meet review architecture.** Owner-forward `AttendeeActionCard` with state-grouped sections (Not Familiar / Familiar / Connected / Locked profiles), inline-pill-evolves footer pattern (Familiar → Connect → Connect ✓ + ✓Familiar/Undo footer), profile-state-aware explainer. Skip removed (section position carries the "I'm not acting on this" meaning).

**Open:**
- How many IRL interactions before users feel comfortable going Familiar → Connected?
- Will Locked users feel excluded or empowered?
- Should the post-meet review flow trigger immediately after the meet ends, or after a delay (e.g. next morning)?
- **Pre-meet vs post-meet disclosure model on the People tab (P32).** Should information about meet attendees be openly visible pre-meet (current model) or gated by attendance (community-first thesis)? Direction emerging: **information** stays open (drives conversion + lets users scope events); **action / relationship building** is gated by attendance (Familiar / Connect pills appear only post-meet for attendees, never for no-shows). The "earned reward" for showing up is the deepening, not the visibility. Implementation cascade depends on P27 (avatar pattern) — to ship before first-round testing.
- **Hybrid trust model:** Should Doggo offer lightweight top-down trust signals (verified ID, community participation score, "X shared connections") alongside community-built trust? Fluv's vetting-first model shows users want some confidence before committing, even if Doggo's community trust is deeper long-term. See `docs/strategy/Competitive Research - Fluv.md`.
- Should there be an "intro session" (free/reduced first meeting) for owners booking a provider they haven't met at community events?
- **Soft Familiar indicator across the app (P29).** Showing "you've marked this person Familiar" on profile cards / group members / attendee lists — privacy-safe (your own data), but a real product call about how visible to make the user's own relationship state.
- **Bulk "Mark everyone Familiar" on group Members tab.** Convenience optimization for routine groups where the user knows everyone. Tension: the Familiar mark's value is its deliberateness — it means "I recognize this person." Bulk-marking everyone in a group dilutes that signal, and applies expanded profile-visibility grants to people the user may have never met. The post-meet review's bulk-mark works because attendance IS the shared trust event; group membership doesn't carry that same per-person signal. Two implementation paths if pursued: (a) dynamic auto-marking — new members who join later are auto-Familiar-ed (privacy concern: granting visibility to future strangers); (b) snapshot — only current members at click time get marked, new members miss the bulk action. Both have drawbacks. Defer until we have more data on how users actually want this to behave; revisit during user testing or after Mock World Building when we can dogfood the manual per-row flow more.
- **Inquiry-driven trust transitions (transactional path to Familiar/Connected).** Surfaced 2026-05-04 during G3 walkthrough. Today's trust model assumes Familiar is earned through community interaction (meets, shared groups). The Discover→Inquiry path bypasses this entirely: a stranger can send a structured booking inquiry to a provider they've never met. The provider then can't see the owner's profile (locked) and has no context to write a proposal — broken loop. **Proposed model:** (1) Sending an inquiry auto-marks **mutual** Familiar — both parties. The deniability principle that keeps Familiar one-sided in stranger-encounter contexts doesn't apply here, since the inquiry is explicit and known to both parties. (2) Accepted contract auto-promotes both to Connected — strongest possible "we're working together" signal. (3) Declined / withdrawn inquiry doesn't roll back Familiar — once you've reached out, the awareness exists. (4) First service-context message in any conversation between non-Connected users triggers the same auto-mutual-Familiar (covers the Appointment-type "Ask about this" path from C1, where there's no structured inquiry, just a pre-filled message). **Stop-gap shipped 2026-05-04:** `InquiryFormModal.handleSubmit` calls `markFamiliar` in both directions on send — clears the immediate locked-profile-blocks-proposal blocker. Full model (proposal-accept hooks, contract-sign auto-Connect, first-service-message detection, edge cases for withdrawn flows) belongs in Inbox & Notifications phase. See [[Trust & Connection Model]] → "Inquiry-driven transitions" stub.

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
- **Group admin controls for meet creation.** Today any group member can create a meet in any group they belong to (including private/approval groups). For some groups that's right (Vinohrady Evening Walkers benefits from any regular calling a walk); for others it's a problem (a Care group's meets are part of the provider's offering, not random member events). Open: should each group have an "anyone / admins / approval-required" setting on meet creation? Should there be type-level constraints (e.g. Care groups → admin-only by default; Interest support groups → approval; Park/Neighbour → anyone)? Should admins be able to set per-meet constraints (max size, leash policy, reactive-dog-friendly tags) that all member-created meets in the group inherit? Long-term — not blocking demo. Surfaced 2026-04-30 during meet-create flow walkthrough on Vinohrady Morning Crew.
- **Group visibility chip clarity.** `group.visibility` is a single enum (`open | approval | private`) — three mutually exclusive states on a continuum: open (visible + free join), approval (visible + gated join), private (hidden + gated join). Current chip rendering: open → no chip, approval → "Approval required", private → "Private". Each label carries half the meaning: "Approval required" doesn't communicate that content is still visible to non-members; "Private" doesn't communicate that joining still requires a request. Together with the description users mostly figure it out, but it's a teaching moment that's underdone. Possible refinements: "Approval to join" (action-y), "Private · approval to join" (combine in chip), or hover/tap tooltip with the explainer. Belongs in the Onboarding & In-Product Communication phase. Surfaced 2026-04-30 during Mock World Building C7 walkthrough.
- ~~**Care group provider presence — community vs. marketplace tension.**~~ **Resolved 2026-05-04 (Discover & Care B1–B4):** Care-group hero anatomy decided — restrained provider attribution (avatar + name + category badge + 1–2 community-earned trust badges + "View profile" button + tagline from carer bio for single-provider, suppressed for multi). Multi-provider support shipped via `Group.providers: GroupProviderRef[]` (replaces single `hostedBy: string`); avatar stack with "+ N" tail; primary provider for "View profile" routing. Service-intersection rule passes through as a helper (`getCareGroupServices`) — full per-service location/methodology metadata is future work. See [[Groups & Care Model]] → Care Group Admin Model + Care-group hero anatomy.
- **Meet location — structured place selection.** Meet location is free-text today. `Meet.lat` / `Meet.lng` exist on the type but aren't collected, so attendees can't tap for directions and there's no way to disambiguate (Stromovka big field vs east gate). Three paths: (a) Prague-specific POI autocomplete from a curated list of 40-60 dog parks + tram stops + addresses — backfills lat/lng, no API dependency, feels locally considered; (b) full map picker (Google/Mapbox); (c) text + optional drop-a-pin. Care groups at fixed locations have the same need. Belongs to a Geo & Discovery pass or Discover & Care follow-up. Surfaced 2026-04-25.
- **Frequent-attendee signal on recurring meet People tabs.** All-attendees view lists everyone who's ever been associated with the series flatly — no signal that someone came to 5 of the last 6 walks vs. one walk a year ago. Options: (a) "Regular" pill next to the name; (b) attendance-frequency line ("Came to 5 of last 6"); (c) sort priority — regulars first within each relationship-state section; (d) some combination. Pairs with the soft Familiar indicator (E-stream, Discover & Care). Would need a `getAttendanceFrequency(meet, userId)` helper. Surfaced 2026-04-29.

---

## 4. Provider Model

**Assumption:** Users are comfortable evolving owner → helper → provider when framed as community contribution. No separate provider identity — it's a dial, not a switch.

**Resolved:** No separate provider signup. Provider toggle from existing profile. Same layout with additional sections. Care groups created by providers with config options per category. Rolling weekly billing model for recurring bookings — sessions generate one at a time, no fixed session count. Provider session actions: Start → Complete → Add note. Booking detail page works for both owner and provider perspectives with tabbed layout (Info / Sessions / Chat).

**Resolved (2026-05-02 — Services-as-catalog model):** Services is the umbrella label on a provider's profile — the comprehensive catalogue of all paid offerings. Under it, two offering types distinguished by what booking produces: **Care-type** (Walking / Sitting / Boarding — drop-off, owner doesn't sign up to a specific time, booking produces a Booking record) and **Meet-type** (Training sessions / Workshops / paid Group walks — owner signs up to a specific time, booking produces a Meet attendance). Test: "does someone sign up to a specific time?" — yes = Meet, no = Care. Bio-level mention is fine ("I work on basic recall during my walks" inside a walking-service description is marketing inside Care, not a separate Training service). Profile Services tab is comprehensive — both types listed in one tab; tap routing differs by offering type. Full spec in [[Groups & Care Model]] → Services as Catalog.

**Open:**
- At what point does "helping" feel like a job?
- Where does pricing surface before a formal arrangement?
- Should creating a Care group require having services listed first?
- Should providers be able to set cancellation policies (e.g. 24hr notice)?
- What does the session completion flow look like for providers? (Visit report card: photos, notes, GPS summary, timestamps — see `docs/strategy/Competitive Research - Time To Pet.md`)
- Should owners receive real-time updates during active care sessions (live GPS, mid-session photos)?
- What pet info should surface in the provider's "in-session" view? (medication, vet contact, behavioural notes, emergency info)
- ~~**Lock vs. Tier reconciliation.**~~ **Resolved 2026-04-29 (Community & Groups Deep Pass F1):** Lock = visibility (privacy axis — who can see the profile). Tier = action (action axis — who can act on services). Independent settings that compose. Provider tier on a Locked profile narrows the action audience to Familiar/Connected viewers (intersection of Lock visibility + Tier action gate); platform shows a banner advising Open for Provider-tier carers. Updated `features/profiles.md` and `Groups & Care Model.md` with the framing + composition matrix.
- **Helper vs Carer terminology for the casual tier.** Today the three tiers are Owner / Helper / Provider, with "Helper" badge label rendered on PersonRow + member surfaces. Surfaced 2026-04-30 during Mock World Building C4 walkthrough — Shawn flagged "Helper" reads vague (helping with the group? helping with what?) and proposed renaming to **Carer**. Renaming would make terminology consistent with the surrounding "Care services / Care group / Care category" vocabulary, but introduces some risk of overlap with the broader Provider-tier-also-being-a-carer concept (Carer = casual, Provider = professional — same underlying activity, different dial position). Other candidates: "Casual Carer" (clearer but verbose), keep Helper but improve the in-app explainer. Bigger than a copy nit — affects badge labels, strategy docs (Groups & Care Model + User Archetypes), feature docs (profiles + connections), the onboarding flow when it ships. Strong recommendation: pair the rename decision with the broader "explain the trust + tier model in-product" work (see ROADMAP — onboarding/comms phase). Defer until that phase opens.
- **In-product communication of the Services / Care / Meet model.** The data model has a clear split (Care-type vs Meet-type offerings — see [[Groups & Care Model]] → Services as Catalog). The user-facing copy doesn't yet teach this. Two surfaces that need design work: **(1) Provider onboarding when adding an offering** — the routing question ("How does this work? — I take the dog (Walking/Sitting/Boarding) — I run a session people sign up for (Training/Workshop)") needs UX treatment so providers fall into the right shape without seeing data-model jargon. **(2) Owner-facing card differentiation** — Care cards (price-per-visit, availability days, "Request booking") vs Meet cards (next-upcoming-date, "Book a spot"). Same Services tab surface, different card behaviour. No labelled "Care vs Meet" segmentation — the card content does the work. Belongs in the Onboarding & In-Product Communication phase. Surfaced 2026-05-02 during Mock World Building C11 walkthrough.
- ~~**Vet & grooming offerings — neither pure Care nor pure Meet.**~~ **Resolved 2026-05-02 (Discover & Care C1):** Third **Appointment-type** offering shape. `CarerAppointmentServiceConfig` carries `appointmentCategory: "vet" | "grooming"`, fixed `pricePerAppointment` and `durationMinutes`. Two test questions distinguish all three offering types: *Does someone sign up to a specific time?* (No → Care. Yes → Meet or Appointment.) *Are there other dogs / a roster?* (Yes → Meet. No → Appointment.) Tap routing: Appointment → request appointment / slot picker (chat-based for prototype). See [[Groups & Care Model]] → Services as Catalog.
- ~~**Meet visibility level: `participants_only`.**~~ **Resolved 2026-05-02 (Discover & Care A1):** Added `"participants_only"` to `MeetVisibility`. `isMeetVisibleTo(meet, viewerId)` helper in `lib/meetUtils.ts` enforces — `participants_only` is visible only to creator + attendees. `getGroupMeets` filters accordingly. Backfilled `meet-care-6` (Hana's 1-on-1 with Klára) so it stops leaking onto the public Klára-group Meets tab. The "auto-apply when package generates an instance" behaviour is groundwork for Pricing & Proposals; today `participants_only` is set explicitly on seeded contracted instances.
- **Per-service visibility (third axis).** Today the trust model has two orthogonal axes: **Lock** (profile visibility — who can see) and **Tier** (Helper / Provider — who can act on services). A natural extension is a third axis: per-service visibility, where a Helper-tier user offers Service A to all Connected viewers but Service B only to a curated subset. Use case: Tereza is comfortable boarding for her three closest neighbours but doesn't want her general Connected network seeing the boarding offer. Sketch: each `CarerServiceConfig` gets `visibilityScope: "all_connected" | "specific" | "group"` and an allowlist; service cards filter per viewer; "Book a session" CTA only renders for eligible viewers. Pairs with the existing Helper/Connected gate. Belongs to a future Trust & Privacy refinement. Surfaced 2026-05-02.
- **Discover Care surface gaps.** Five related gaps surfaced 2026-05-04 during walkthrough — cluster for a future Discover refinement pass. **(1) No Appointment filter pill on `/discover/care`.** Filter pills derive from `ServiceType` (`walk_checkin | inhome_sitting | boarding`); appointment-type offerings (vet, grooming) aren't `ServiceType` so they only surface on "All". A future pill set might split into "Walks / Sitting / Boarding / Vet / Grooming" or use a more abstract filter axis. **Visible symptom (observed 2026-05-04):** Dr. Lenka Nováková's card appears in the "All" list with no service tags and no category badge — `services: []` is intentional (`lib/mockData.ts:157`), but it leaves her looking incomplete. Resolution depends on §7 vet-role decision: commit → add Appointment pill; drop → remove her ProviderCard. **(2) ProviderCard ↔ UserProfile fragmentation.** Today's directory has both directory-only `ProviderCard` entries (no real account) and bridged entries that link to a `UserProfile` via `userId`. Demo prototypes need both — but in production, every provider should be a real user. The bridge contract is fine as a transitional pattern; eventually the directory should derive entirely from `UserProfile` records with `publicProfile: true`. **(3) Per-service pricing on cards.** ProviderCard has a single `priceFrom` + `priceUnit` even when `services` lists multiple types. Filtering by "Home sitting" still shows a "per walk" price for a provider who offers both. The right model: extend ProviderCard with `pricesByService?: Partial<Record<ServiceType, { priceFrom; priceUnit }>>`, backfill mock data, have `CardExploreResult` swap the displayed price based on the active filter (already has `activeService` as a prop). Optional: hide the service-chip row when a specific filter is active (context is implied). Pairs with the cold-start prioritization question (§7) and per-service visibility above. **(4) Service-aware filters.** The filter panel on `/discover/care` shows the same field set regardless of service — Walks, Sitting, and Boarding all get Repeat Weekly cadence, same price slider behaviour, no home-attribute fields. The Rover/Hlídačky pattern is service-aware filters that reflect what each service's trust model actually demands: Walks → pace, leash rules, group tolerance; Sitting → home type, has own dogs, schedule coverage; Boarding → yard / fenced, has own dogs, max dogs at a time, house type. Strategic argument: the filter shape *teaches* the user about each service's trust dimensions, so flattening them implicitly says "all care is the same" — contradicting the Friendship-Meets-Contract framing. Implementation sketch: a `service → fields` mapping that drives `FilterBody`/`FilterPanel*` rendering; extend `ProviderCard` + `CarerCareServiceConfig` with new attributes (yard, fence, houseType, hasOwnDogs, maxDogsAtOnce, etc.); backfill on directory carers + UserProfile carer profiles; wire predicates. ~4–6 hours focused work — non-trivial sub-workstream. Surfaced 2026-05-04 during F walkthrough. **Sub-note: time-of-day windows.** Discover today has no time filter; the InquiryForm has a specific time picker. Defensible split — exact time-of-day is a *negotiation point* (handled in inquiry/proposal), not a *filter predicate* (most carers flex an hour or two; pre-filtering by exact time over-constrains). But a coarse "morning / afternoon / evening" availability *window* filter on Discover would help. Pairs with this service-aware refactor since the field is service-conditional (walks have meaningful morning/evening distinction; boarding doesn't). Implementation sketch: add `availableTimes: ("morning" | "afternoon" | "evening")[]` to ProviderCard + CarerProfile, backfill, surface as a segment bar on Discover. Surfaced 2026-05-04 during G3 walkthrough. **(5) Filter panel is unwired.** `CareResultsList` in `app/discover/care/page.tsx` (lines 144–148) only filters by the top pill (`serviceFilter`); it ignores all `CareFilters` state — `selectedDays`, `visitMode`, price slider, services accordion are all visual-only no-ops. No filter-panel combination reduces results to 0, which means the empty state design (correctly implemented at lines 150–162) can't be triggered through normal user action. Closely tied to (4) — when service-aware filters land, predicate-wiring should land with them (no point wiring the current shape only to refactor it). Until then, the panel is misleading: it suggests narrowing affordances that don't exist. Surfaced 2026-05-04 during F1 walkthrough.

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
- **Provider discounts, including group-anchored ones.** Providers should be able to set discounts on their services — flat or percentage — including auto-applied discounts tied to group membership. Strongest demo case: a trainer offers 15% off services to members of their Care group ("join the group, get the discount" — community → care funnel made explicit). Open: where do discounts live (per-service field vs. separate `discounts: Discount[]` array on `CarerProfile`), how are they communicated (badge on service card vs. line item on the proposal), can owners stack them, do they have expiry / usage caps. Pairs with intro session offers. Belongs to a future Bookings & Monetisation pass. Surfaced 2026-05-02.
- **Intro session as a proposal toggle.** Per Fluv research, a free / reduced first session bridges the trust gap for direct-discovery bookings — owners who haven't built a community relationship with the provider yet. Provider toggles "Include intro session" on a proposal → first session free or reduced, subsequent sessions at full rate. Connects to the broader discount infrastructure above. Open: per-service vs per-arrangement, who decides which session is "intro," what happens if owner cancels after the intro. Belongs to the same Bookings & Monetisation pass. Surfaced 2026-05-02.
- **Structured pricing model + no-bargaining principle (next phase: Pricing & Proposals).** Surfaced 2026-05-04 during G3 walkthrough. Today's `CarerCareServiceConfig` carries a single `pricePerUnit` + `priceUnit`. The ProposalForm auto-calculates a base line item from that and lets the provider edit before sending. **The "no bargaining" principle is structurally undermined by today's "provider edits the line item" pattern.** The provider edits because the system can't compute the right number — which IS bargaining at the structural level. Rover/Hlídačky models capture rich modifier dimensions: Walking has Holiday surcharge, Longer Walk, Last-Minute, Off-Hours, Weekend; Sitting adds Multi-Pet; Boarding adds Yard, House Type, Multi-Pet, Add-on services (bath, grooming reinforcement, photo updates), and sometimes flat package rates (5-day bundle vs 5 × per-night). To make "no bargaining" real: (1) provider pricing config schema with base + enumerable modifiers, (2) inquiry data captures all dimensions needed to apply modifiers (date for holiday lookup, pet count, walk duration, etc.), (3) auto-pricing engine takes (config × inquiry) → quote — pure function, (4) proposal step shrinks to "review system quote and confirm" with optional override flagged as a deviation ("offering 800 Kč vs system 900 Kč — repeat client?"), (5) provider onboarding UI for pricing setup. Intersects cleanly with the service-aware filter refactor (§4.4) and per-service pricing on cards (§4.3) — same data shape, same provider-config pass. **Decision:** open as a dedicated phase ("Pricing & Proposals") immediately after Discover & Care closes. Reorganized roadmap reflects services-as-core priority (services flow rock-solid before social/onboarding polish). Pairs with the discount and intro-session entries above — they all live in the same provider pricing config.

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
- **Provider category prioritization.** Not all care categories are equally adoptable. Training, grooming, and walking/sitting often run on light tech (WhatsApp + spreadsheets) — Doggo replaces nothing painful, easy switch. Vets are the opposite: existing PMS/billing software (eVet, Provet, ezyVet) is sticky, compliance-integrated, and their relationship to owners is less community-shaped (vet selection is location + reputation + emergency, not community fit). Cold-start should prioritize training and grooming (and walking/sitting); vets are post-MVP at best, possibly never. May also affect demo polish allocation — Appointment-type is the right *shape* in the data model but exercised in the demo arc less than Care/Meet. Surfaced 2026-05-04 during Discover & Care walkthrough.

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
- **Terminology consistency sweep.** Some concepts have two names that drift in usage:
  - **Private vs Locked** — surfaced 2026-04-30. Data model uses `profileVisibility: "open" | "locked"`. UX copy and walkthrough now standardise on **Private** / **Public** (gentler, matches Instagram/Threads conventions, doesn't carry punitive feel of "locked"). Code field rename from `"open" | "locked"` → `"public" | "private"` is deferred (mechanical rename, ~30 callsites, can land any time).
  - **Groups vs Communities** — `Group` is the data type and `groupType` is the schema field; "Communities" is the bottom-nav tab label and the route prefix (`/communities/[id]`). The two are used interchangeably in conversation. Open: pick one canonical user-facing word and apply consistently. Current preference (informal): keep "Communities" as the navigation/route name (it's the destination — a community of people), keep "Group" as the data noun in code (it's a record). External UI copy should pick one and stop alternating ("post in this community" vs "post in this group").
  - Pattern: make a sweep at any phase close to catch new drift. Not blocking demo; quality-of-prose issue.

---

## 10. Demo & Presentation

**Resolved:** Four journey personas (Tereza, Daniel, Klára, Tomáš) plus Shawn (default) and a synthetic "New User" persona for empty-state previews. Mock data layer built with 20 users, 24 meets, 35 posts, 13 reviews, 10 bookings, 8 conversations, 20 group message threads. Image generation prompts prepared (40 prompts across 7 tiers).

**Resolved:** Persona switching works via React context (`CurrentUserContext`) backed by `localStorage`. Five-persona picker (Tereza / Daniel / Klára / Tomáš / New User); Shawn removed from picker 2026-04-26 but remains in mock-world data. Default is Tereza. Three switcher surfaces — profile-page name dropdown (primary), `/demo` route (canonical entry, shareable URL), `?as=<personaId>` URL param (non-persistent preview). Full spec in `docs/features/demo-mode.md`. Closed by Persona & Demo Mode Wiring (2026-04-26).

**Resolved (Mock World Building, 2026-05-02):** Per-persona highlight reels documented in `docs/features/demo-mode.md` → "Highlight reels." 3–4 surfaces per persona where their story reads strongest, mapped to URLs reviewers can click through.

**Open:**
- Should the demo entry page present scenarios ("See what it's like as a...") or user profiles? — Defer to Demo Presentation phase. The infrastructure supports either; the framing is a marketing/storytelling decision, not a technical one.
- Should the demo include a guided tour or let users explore freely? — Defer to Demo Presentation phase.

---

## 11. Technical

**Resolved:** Chat uses mock data, designed for Supabase Realtime swap.

**Resolved (Mock World Building A1 / 2026-04-30):** Provider ID dualism — bridge contract formalised. Bridge documented at top of `providers` array in `mockData.ts`: providers may exist as directory-only `ProviderCard` entries (no `UserProfile`) or be linked via `userId` to a real user. `getUserOrProvider` synthesises minimal profiles for directory-only providers. No phantom IDs remain in active code paths.

**Resolved (Mock World Building / 2026-04-30):** Connection state per-persona — `mockConnectionsByViewer` now keyed for Shawn (12), Tereza (8), Daniel (5), Klára (10), Tomáš (6). Tier rendering works correctly across all personas. New User intentionally has zero connections (empty-state preview).

**Open:**
- Notification strategy — what triggers push vs. quiet delivery? Belongs to Inbox & Notifications phase.
- Supabase data model for production — design before building backend.
- Image storage/hosting for galleries and meet photos.
