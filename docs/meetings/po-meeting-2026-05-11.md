---
category: meetings
status: active
last-reviewed: 2026-05-11
tags: [po, user-testing, demo]
---

# PO Meeting — 2026-05-11

**Purpose.** Show her what the prototype does now. Walk through the demo together. Open up considerations for what's next, including a bigger strategic direction that's been emerging.

**Suggested flow (~60-90 min):**

1. Context (3-5 min)
2. Demo walkthrough (15-20 min)
3. Considerations for additions or later versions (10 min)
4. Trainers / foster angle + larger positioning question (15-20 min)
5. User testing + next steps (5-10 min)

---

## 1. Context

Short — set the frame, don't recap history.

- We're a dog community platform that monetizes through people booking care for their dogs, supported by community features. That's still the thesis.
- The prototype covers the full loop now: people find each other through community → trust builds via meets and connections → owners book care from people they've come to trust → sessions happen and get tracked. There's depth at every stage.
- Honest about what's not in the prototype: no real auth (persona-switching stands in), no real payment, mock data. The point is to feel real to a tester, not be production-ready.

If she asks "what's in there," the short answer is:

- A community side: feed, groups (park / neighborhood / interest / care), meets with RSVP
- A trust side: relationship states between people (Familiar, Connected), trust badges, post-meet reviews
- A discovery side: filter-driven Discover Care with community-first ordering
- A booking side: structured inquiry → auto-priced proposal → contract → sessions → visit reports
- A profile side: every user has the same profile shape, with a Carer "dial" they can turn up to offer services

---

## 2. Demo walkthrough

15-20 min, mostly Tereza-led since her surfaces are richest. Concepts get taught in flow — don't pre-load lists.

### A. Land it (1 min)

- Open `/` cold. Hero reads "Doggo prototype · Prague."
- Skim the Three Doors framing (Find Your Park / People / Help) — they're the spine of how we think about how people enter the platform.
- Click **Walk me through Tereza's day** to enter the tour. *(Or open `/demo` and pick Tereza — either works.)*

### B. Tereza — the community side (5-6 min)

URL anchor: `?as=tereza`

1. **`/home?as=tereza`** — her feed. Notice it's dominated by neighbourhood activity (Vinohrady Evening Walkers, Riegrovy posts). Reads as someone embedded in a place.
2. **`/communities/group-tereza-neighbourhood`** — she's admin here. Recurring evening loop. Members tab shows her neighbour cluster.
3. **`/meets/meet-1`** (Riegrovy morning) — meet detail. **Talking point:** "Notice the People tab groups attendees by relationship state — Connected at top, then Familiar, then a chip list for Locked profiles. The relationship model isn't an abstraction; it's how every people-surface in the app works."
4. **`/profile?as=tereza`** — Open profile. She's got **two pets** (Franta + Bella). Carer with circle audience. Services: Day care, House sitting, Walks. **Talking point:** "Tereza is a Carer who serves her circle — not a professional. We don't have separate accounts for owners vs. providers. It's a dial on every profile. She turned it up modestly."

### C. Discover → booking funnel (6-8 min)

The transactional spine. **Demo this from both sides explicitly** — flip personas mid-flow so she sees the proposal cards land in both directions. This is the structural beat that's different from her spec (see §3a) and seeing it click together is the best way to land it. Best demoed by Tereza booking someone else.

1. **`/discover/care`** — pill row across the top (All / Walks / House sitting / Day care / Boarding / Appointment). **Talking point:** "Notice the section structure — Carers in your circle render above the broader marketplace, with distinct chrome. That's the community-first thesis literally implemented at the discovery layer."
2. Tap **Filters** floating button. Panel opens; pill row hides. **Talking point:** "Service type moves into a dropdown inside the panel — it teaches what each service actually means (whose home, day vs overnight). We just resolved the taxonomy today; previously 'sitting' was ambiguous."
3. Show the Pets row (her two dogs are real checkboxes now), the Nearby picker, the sub-services accordion, service-aware fields that reshape when you pick a different service.
4. Pick "Day care" → tap a provider card → land on their profile → Services tab → tap a service.
5. **InquiryFormModal** opens. Fill it in. Submit. **Talking point:** "Notice the live price estimate — same engine that powers the provider's quote on the other side. Both parties see the same number throughout."
6. Switch persona (profile dropdown). See **InquiryCard** in the provider's thread. Tap proposal CTA → **ProposalForm** with auto-priced quote + modifier line items (e.g., "Weekend rate +15%"). **Talking point:** "Providers configure pricing once, the engine takes inquiry data, quote is auto-generated. They can override with a reason, but the default is review-and-confirm — removes bargaining friction."
7. Submit proposal. Switch back to owner. **BookingProposalCard** appears. Tap **Review & sign**. SigningModal. Done. Booking lands in `/bookings`.

### D. After the booking — sessions + visit reports (3-4 min)

Use Daniel + Klára for this — their training booking is the cleanest example.

1. **`/bookings/booking-klara-daniel?as=daniel`** — owner view. Pet-as-protagonist hero (Bára's photo + name + 28px heading). Past sessions, upcoming sessions.
2. Tap a completed session → **visit report** with photos, notes, walk metrics, completion time. **Talking point:** "This closes the care loop. The trust that built up through community and pricing pays off here — a real artifact each session generates."
3. Switch to Klára (`?as=klara`). Same booking, provider side. Session check-in actions (Start → Complete). Active session sub-page if there's one in progress, with sticky Finish/Undo footer.
4. Mention: cross-app active-session presence — open `/bookings` and there's a slim "Active session — tap for live updates" card. Owner gets passive mid-session view with the latest photo + reassuring copy.

### E. Optional finishing flourishes (skip if running long)

- Inbox + notifications — show the bell. Lifecycle update pattern (one notification per session, updates in place rather than spamming).
- New User persona (`?as=new-user`) — the empty-state preview. Useful to demo what someone arriving cold actually sees.

---

## 3. Considerations for additions or later versions

Two flavors. Worth signposting so she sees the distinction.

### 3a. Booking-spec gaps — what we didn't build

**Worth flagging upfront: our booking flow is structurally a bit different from how she drew it.** Her spec has *Customer Request → Provider Confirm → Customer Pays → Confirmed*. Ours has *Customer Inquiry → Provider Proposal (an in-chat card with auto-priced quote + terms) → Customer Review & Sign → Booking*. The **proposal step** is the difference — it gives the provider control to set their own quote, suggest counters, and customize terms before the owner commits. Same end intent, more provider agency.

**Recommend demoing this from both sides explicitly in Section 2** so she sees it click together: send the inquiry as Tereza → switch to the provider, build the proposal → switch back to Tereza, sign. The in-chat cards (InquiryCard → BookingProposalCard) guide the whole flow visibly. I'd bet she'll like it once she sees it move — but name the structural difference rather than walking past it.

With that frame, here's what's missing vs. what's there:

**Built and matches her spec:**
- Search → filter → select provider
- Direct-book path (profile → service card → InquiryFormModal)
- Booking request as message to provider, notification triggers
- Pending status, provider Accept / Decline with reason
- Cancellation flow with reason required, notification to other party

**Built but goes deeper than her spec:**
- Auto-pricing engine with stackable modifiers (her spec doesn't specify pricing model)
- Counter-proposal — provider can suggest alternative dates/terms. Her spec said "for now we will not cover" — we have it.
- Visit reports + photos + active session + mid-session updates (post-booking experience is fleshed out)
- Per-occurrence cancellation for recurring arrangements

**Not built — gaps to discuss:**
- **In-chat Book button** (her path 1 — message first, then book in-chat). We don't have this. Today the inquiry entry point is the service card on profile only. Build estimate: ~half day.
- **Payment integration** (her flow has Confirm → PENDING PAYMENT → pay → BOOKING CONFIRMED). We treat sign-contract as booking-confirmed; no payment step. Most demo prototypes skip this — testers don't expect to enter card details — but worth her call.
- **2-day cancellation cutoff.** Cancellation requires a reason but doesn't gate on a time window. She said "open to discussion" in the spec — easy to wire if she wants it.
- **Alternative provider suggestions on decline/cancel.** Her spec wants the platform to suggest similar carers when a provider declines or cancels. We don't have this. Real feature if she wants it, ~couple days.

None of these are blocking the demo. Question is which she wants in the next phase vs. defers.

### 3b. Exploratory directions

Things that aren't in her spec but have come up. Not proposing, just surfacing.

- **Walks → public meet coupling.** Booking a paid walk could optionally route through a community meet — i.e., the carer attends a public meet with the owner's dog. Reinforces the community thesis at the service level. Light version is a sub-service label ("Public meet walk"). Heavy version is real coupling between Booking and Meet (its own phase).
- **Foster / shelter angle in Discover.** Dogs needing walks/foster surface alongside care results. Drives discovery + adoption. Big topic, ties into Section 4.

---

## 4. Trainers / foster angle + the larger positioning question

This is the actual strategic conversation. Concrete → abstract.

### The cold-start problem

Quick framing she'll get immediately:
- Community-first dog-care platforms have a chicken-and-egg problem: the product has no value until other dog people are on it. New visitors see an empty room and leave.
- The community thesis is right (trust → care is more defensible than a price-driven marketplace), but it needs paid bootstrapping to survive the first 6 months. Pure-organic community products historically have 1-2% conversion from "saw it" to "active."

### The playbook that's been emerging

Three threads that converged 2026-05-11 into one cold-start playbook:

**1. Paid trainer partnerships as the seed engine.** Partner with (or eventually hire) 2-5 trainers in Prague to lead public walks on the platform. The trainer always has a dog to walk — booked client, regular owner, or a shelter dog if neither. Walks generate photos, in-person interactions, lead generation for the trainer's services. Trainer's incentive aligns without platform-side cash flow.

**2. Shelter dogs as always-on inventory.** Partner with a shelter (e.g., Útulek Liběň). When a trainer has no client, they pick up a shelter dog. Solves the "empty Tuesday" problem AND creates an emotional engagement layer: dogs have profiles, stats ("4 days in kennel, last walked 3 days ago"), and people pick a *specific dog* to walk. Dog-as-unit, not shelter-as-unit. After N walks with the same dog, adoption becomes a natural endpoint.

**3. Doggo-as-credentialing-layer.** Prague's training market is fragmented and uncredentialed — 80-90% solo trainers, no chains, no legal cert requirement (unlike Germany or Austria). Owners can't easily verify trainer quality. Doggo could fill that gap with verified affiliations (LIMA methodology / Dobrá psí škola network, KYNOLOG.cz cert, Helppes alumni, methodology school memberships) + community-earned signals. **The credentialing gap may be the deepest moat opportunity.**

### The framing principle (worth surfacing)

If we go this direction, the trainer-led walks have to feel like *community walks where the host happens to be a trainer*, not *promo walks dressed up as community*. Same trainer, same walk, two different products depending on how the platform frames it. Things like "Sponsored Walk" badging or foregrounding "Book Klára" CTAs over the social context tip it the wrong direction.

### The larger positioning question

The cold-start playbook has a clear implication. Doing this means leaning hard toward **community-with-marketplace** — Strava-for-dog-people that happens to monetize through care — rather than **marketplace-with-community** — Czech Rover with a community layer for differentiation.

These look similar but they're different companies:

| | Community-with-marketplace | Marketplace-with-community |
|---|---|---|
| Core | Community engagement | Paid transactions |
| Differentiator | Care + trust come from network | Community is the moat that makes marketplace work |
| Comparison | Strava, ClassDojo, Nextdoor | Rover, Wag, TaskRabbit |
| Compounding | Slower, network effects | Faster, marketplace efficiency |
| Vulnerability | Slow to monetize, harder to fundraise on | Competitors can poach trainers with better economics |
| Investor pitch | "Defensible network" | "Better marketplace" |

The current direction (community-first thesis, meets→trust→care funnel, the cold-start playbook above) leans hard community-with-marketplace. That's a legitimate bet but it's a bigger company with a longer compound — needs to be a deliberate choice, not an accidental drift.

**This doesn't have to be decided today. But knowing the answer would clarify a lot of future decisions** — what the next phase is, which features feel essential, how to talk about the product to potential investors, what user testing should be designed to learn.

### What to ask her

Open question style, not yes/no:

- Does the cold-start playbook feel right? Anything she'd push back on or add?
- She's in Prague — does this look like something she could imagine recruiting trainers / shelters into?
- The positioning question — does she have a strong instinct on which one we are? Or want to see what testers say?

---

## 5. User testing + next steps

Her scenarios (booking walking, booking boarding, group creation, event creation) are well-supported by what's built. Worth adding 2-3 more that connect to the strategic question:

1. **First-time discoverability.** Drop a tester on `/` cold. "You're a Prague dog owner with a new puppy. Show me what you'd do." Tests whether the landing → Discover funnel works for someone who's never seen it.
2. **The community-first vs. marketplace question, directly.** Show two scenarios — bare marketplace ordering vs. our community-first ordering — and ask which they'd actually use. This is the most strategic answer a tester can give us.
3. **Trust signals.** Two carer cards side by side, one with rich badges, one bare. Which would they book? Tests whether the trust layer does the work we hope.
4. **Service taxonomy intuitiveness.** Can a tester correctly answer "where does my dog go for each of these services?" without explanation, just from the dropdown sublines? Tests today's work directly.

**Format suggestion:** 5-7 testers, moderated walkthroughs, 45-60 min each. Mix of Prague locals + expats. Use Tereza as primary persona, switch to Klára for any provider-side scenarios.

**Worth saying — not everything's done, but testing isn't blocked.**

A couple of phase boards still have open work, but none of it gates getting started with user testing:

- **Profiles Deep Pass — paused.** Trust signals, post composer, and post attribution shipped. Remaining: the Carer audience-setting toggle UI (the in-UI control for the `publicProfile` circle-vs-anyone dial). Today that setting is just a data field; testers won't see a self-serve toggle for it, but the *effect* of the setting (circle vs. open Carers rendering differently on Discover) is fully wired and demoable.
- **Onboarding & In-Product Communication — upcoming phase, after Cross-Cutting Flow Testing.** Covers the teaching moments (locked-profile lock card, Familiar asymmetry explainer, privacy mechanics, Carer pricing setup walkthrough, group visibility chip clarity). Today these mechanics work but aren't *taught* in-product — testers will either figure them out or surface "what is this?" questions, which is exactly the kind of feedback we'd want before this phase opens. **Their confusion is the input for that phase.**
- **Demo Presentation phase — partially shipped, partially deferred.** Landing redesign, `/demo` redesign, and the Tereza guided tour shipped in May. Logged-out flows (guest viewer state, AuthGate, logged-out community preview) are pending. Testers can still hit every surface as a persona; they just can't preview things as a logged-out visitor yet.

Bottom line for her: the project keeps building — these phases are queued and will land. But the prototype is at a state where moderated user testing produces real signal now, and tester input is what sharpens what those upcoming phases focus on. No reason to wait — long-term build continues, near-term testing starts.

**Before user testing:**
- The demo presentation walkthrough doc (`docs/phases/demo-presentation-walkthrough.md`) was last updated May 5 and predates the recent four phases. Needs an update pass.
- The Tereza guided tour (6 steps) needs verification against current surfaces.
- Decide on the spec-gap items in §3a — whichever we want testers to actually exercise.

**Next steps depending on what she says:**
- If she's into the playbook direction → start mapping the trainer + shelter conversations she could have in Prague
- If she wants to ship more first → next phase is either Cross-Cutting Flow Testing or filling spec gaps (§3a)
- Either way → walkthrough doc + tour need updating before user testing, ~half day

---

## Appendix A — Quick reference: surface URLs for the demo

In case you're navigating live and want to skip clicks:

- Landing: `/`
- Demo picker: `/demo`
- Tereza tour entry: `/home?as=tereza&tour=tereza&step=1`
- Tereza's neighbourhood group: `/communities/group-tereza-neighbourhood?as=tereza`
- Riegrovy morning meet: `/meets/meet-1?as=tereza`
- Tereza's profile: `/profile?as=tereza`
- Discover Care: `/discover/care?as=tereza`
- Daniel's booking with Klára (owner view): `/bookings/booking-klara-daniel?as=daniel`
- Same booking (provider view): `/bookings/booking-klara-daniel?as=klara`

## Appendix B — Strategic backstory (for your reference, not for the meeting)

If she asks something specific that touches recent work, the cheat sheet:

- **Carer-role collapse (2026-05-10).** Helper/Provider tier framing retired. Single Carer role with a `publicProfile` boolean (circle vs. anyone audience). Simpler model.
- **Community-first Discover ordering (2026-05-10).** `/discover/care` renders Carers in viewer's circle above broader marketplace with distinct chrome.
- **Vet retirement (2026-05-11).** `AppointmentCategory` is now `"grooming" | "training"`. Vet retired from the demo arc — not a likely user type for the platform. Lenka N. + PremiumVet group already repurposed as Mánesova Grooming Salon.
- **Care taxonomy (2026-05-11, today).** Four services: `walks_checkins` / `house_sitting` / `day_care` / `boarding`. Replaces drifted `inhome_sitting`.
- **Filter panel redesign (today).** Pets + Address functional + persisted; in-panel service-type dropdown with descriptive sublines; sub-services accordion; pill row hides while panel is open.
- **Trust transitions (2026-05-10).** Four-rule model: inquiry send → mutual Familiar; contract sign → mutual Connected; first message in non-Connected thread → mutual Familiar; declined doesn't roll back.
- **Auto-pricing engine (2026-05-05).** `computeQuote(config, inquiry, today)` takes carer config × inquiry → quote. Stackable modifiers. Same number visible at three surfaces.
- **Active session sub-route (2026-05-10).** `/bookings/[id]/active` is a real page. Cross-app presence indicator.
- **Visit reports (2026-05-08).** Photos, notes, structured care checks (dormant), walk metrics, completion timestamp. Pet-as-protagonist hero on Sessions tab.
- **Cold-Start Playbook (today).** Three threads: trainer partnerships, shelter angle, credentialing layer. Backed by Prague market research. Lives at `docs/strategy/Cold-Start Playbook.md`.

## Appendix C — Things to clean up before user testing

If user testing is in 1-2 weeks:

1. **Demo presentation walkthrough** (`docs/phases/demo-presentation-walkthrough.md`) — last reviewed 2026-05-05. Needs sweep to reflect Discover Refinement + Inbox & Notifications + Sessions & Service Execution + Care Catalog Taxonomy.
2. **Tereza guided tour** (`lib/tourSteps.ts`) — 6 steps. Needs verification against current surfaces.
3. **Landing page** — currently the "demo cover" version. The "real product landing" (Workstream E in Demo Presentation phase) was deferred pending Pricing & Proposals close (now closed) + PO's visual exploration in Claude Design.
4. **Logged-out flows** — Demo Presentation Workstream D1/D2/D3 still todo (isGuest viewer state + AuthGate + Vinohrady Morning Crew logged-out preview). D4-D6 deferred pending Pricing & Proposals close (now closed).
