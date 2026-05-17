---
category: strategy
status: draft
last-reviewed: 2026-05-16
tags: [cold-start, trainers, shelter, foster, community, account-types, credentialing, future]
review-trigger: "before any phase touching cold-start, monetization, account types, or category strategy"
---

# Cold-Start Playbook

> **Status.** Pre-roadmap exploration. Not active product work; not part of the demo. Documents the strategic threads that would inform a future cold-start phase, pending real conversations with Prague trainers and shelters before any product commitments.

**TL;DR.** Doggo has a chicken-and-egg problem: a community-first dog-care platform has no value until other dog people are on it. Three threads — paid trainer partnerships, shelter dog walks, and Doggo-as-credentialing-layer — converge on a single playbook: **seed activity with paid trainers leading public walks (with shelter dogs as always-on inventory), use those walks to onboard organic users into hosting their own meets, and accrue trust infrastructure that becomes the platform's moat in a market with no existing credentialing layer.** Not for the demo. The next concrete step is real conversations in Prague — partnerships with 2-3 anchor trainers + 1-2 shelter orgs.

---

## The bootstrap problem

Dog-care platforms have brutal cold-start dynamics:

- **The product has no value until other users are on it.** No meets to join, no neighbours marked Familiar, no Carers to book. New visitors see an empty room and leave.
- **The addressable market in any single city is finite.** Prague has ~150-200k dog-owning households. The platform needs to capture meaningful density in specific neighbourhoods (Vinohrady, Letná, Karlín, Stromovka) before organic word-of-mouth carries it.
- **The community-first thesis trades faster monetization for stronger defensibility** — but only if you survive the bootstrap. Pure-organic community products historically have brutal activation curves (1-2% conversion from "saw it" to "active user") without paid bootstrapping.

The question isn't whether to seed activity. It's *how* — in a way that:

1. Survives the first 6 months,
2. Doesn't lock the platform into a different product than the one we're aiming at,
3. Compounds into community moat over time rather than evaporating when paid pumping stops.

---

## The trainer-led walks playbook

The approach: **partner with (or eventually hire) 2-5 trainers in Prague to lead public walks on the platform.** Mechanics:

- **Trainers always have a dog to walk.** Either a booked client, a regular owner who's tagging along, or — when neither — a shelter dog picked up from a partner org. No empty Tuesdays.
- **Walks are framed as community walks, not promo walks.** Same trainer, same walk, two completely different products depending on framing. The platform's job is to make the community-shaped version the natural one. (See *The framing principle* below.)
- **Trainer's incentive aligns without platform-side cash flow.** Every walk is in-person marketing for their paid services. Lead generation, content (photos), social proof through visible attendance — these are payment in kind. The platform doesn't need to fund trainer wages directly to make the arrangement work.
- **Photo content fills the platform's feed from day one.** New users arriving don't see an empty room — they see a feed already in motion, with dogs they recognize from their neighbourhood.

This isn't theoretical — it's the closest thing to a Founders Fund / a16z "do things that don't scale" play that maps cleanly onto Doggo's existing surfaces (Care groups, public meets, visit reports, post-meet review).

### The framing principle

Trainer-led walks must feel like *community walks where the host happens to be a trainer*, not *promo walks dressed up as community*. The difference isn't logistical — it's design and tone.

**Signals that get this wrong:**
- "Sponsored walk" or "Featured" badging on trainer-led meets
- The walk's detail page foregrounding "Book Klára" CTAs above the social context
- Trainer attendance reading as a service shift rather than as a person being there

**Signals that get this right:**
- Trainer-led meets look identical to neighbour-led meets in the listing — the trainer's Carer badge tells you who they are, but the walk is just a walk
- The walk page leads with "Who's going, recent photos, what dog joined from the shelter today" — service stuff is one tap further in
- Klára introducing herself at the walk: "I'm a trainer, happy to chat about any dog issues you're working on" reads as community-with-expertise, not sales-pitch-with-walk

This is a design + operations constraint, not just a label call. Worth knowing now so we don't accidentally build "Featured Walk" treatment when the time comes.

### The success metric

**Ratio of community-led activity to trainer-led activity over time.** The bootstrap is supposed to disappear.

- 90% trainer-led after 12 months: bootstrap failed; you've built a small marketplace of paid trainers, not a community
- ~50/50: the bootstrap is working — trainers seeded the conditions for community members to host their own meets
- Trending toward community-majority: the moat is compounding

The trainer-led walks are the on-ramp. Real users showing up, becoming Familiar with each other, and hosting their *own* meets — that's the success state. Instrument this from day one. Even a crude "% of meets last month hosted by non-Carer accounts" is the right kind of metric to track.

### Two failure modes for paid pumping

- **Pump-and-pray:** Paid activity drives user signups but doesn't seed organic activity. When you turn the pump off, everyone leaves.
- **Pump-and-seed:** Paid activity creates the social conditions for organic activity to ignite. The first community-led meet happens because three users met each other at a trainer-led one.

The difference is whether the paid users actively try to onboard the organic users into community behaviors. Trainer partnerships should be **explicitly briefed**: it's not just "lead a walk." It's "lead a walk and convert 1-2 attendees into future hosts." That's the actual job description.

---

## The Prague training market

This shapes the trainer-partnership playbook directly. Key findings:

**Market structure: fragmented and uncredentialed.**
- **80-90% solo trainers, no chains.** Firmy.cz lists 53 dog-training businesses in Prague 5 alone, overwhelmingly sole-trader. Closest analogue to a chain is **Dobrá psí škola** — ~40 affiliated centers across CZ + Slovakia using LIMA methodology (positive-reinforcement / Least Intrusive, Minimally Aversive). It's a methodology network, not a corporate chain.
- **Notable players worth knowing:**
  - **Helppes** — large Prague assistance/therapy-dog non-profit, own facility, public courses, high credibility halo
  - **Psí škola K9** — group + individual courses, indoor facility (950 Kč/60min for individual at hall)
  - **goDog** (Veleslavín/Džbán) — facility-based, 600 Kč indoor / 700-1000 Kč mobile
  - **PsiTrenink.cz** (Robert Zlocha) — own facility in Stodůlky
  - **Dogitory** (Prague 6) — expat-focused, English-speaking
  - **Rocky and Skipper Pet Services** — positive-reinforcement training + daycare, expat-focused
- **KYNOLOG.cz** runs the closest thing to a respected Czech training cert (~95 trainers graduated), paired with the Dobrá psí škola network.

**Facility vs. mobile:**
- **Mobile is modal.** Most trainers travel to owner's home or run group classes at a rented patch of field.
- Facility-based solo training exists but is the minority case. Psí škola K9, Canikenny, goDog offer indoor 1-on-1.
- **Vet-clinic-attached training is rare.** Searched MetropoleVet, AA-Vet, Pet Care Clinic, etc. — no on-site training surfaced.
- **Implication for `AppointmentCategory: "training"`:** the shape exists, mostly mobile.

**Certification: messy.**
- A national qualification exists on paper (Národní soustava kvalifikací code 41-089-M, NQF Level 4) but **is not legally required**.
- Unlike Germany's §11 TierSchG (mandatory cert to operate as a trainer) or Austria's structured Hundeflo academy, Prague has no de facto gatekeeper.
- International certs (CCPDT, Karen Pryor, IAABC) essentially absent from the Prague pet-trainer landscape.
- **Verdict:** anyone can call themselves a trainer. Owners can't easily verify quality. The field is *de facto* messy.

**Pricing benchmarks (Kč):**
- Group class: ~390 / 50min
- 1-on-1 at trainer's facility: ~450-600 / hr
- 1-on-1 mobile at owner's home: 370-1000 / hr (wide range)
- Behaviorist consultation: ~1500 / 2hr

**Compared to Berlin / Vienna:** less mature on the certification axis specifically. Similar in market structure (fragmented independents). Couldn't get reliable Amsterdam data.

---

## The credentialing-gap moat

Prague's training market is **fragmented + uncredentialed**. There's no gatekeeper to negotiate with, no licensing body to badge against, no chain operator to partner with — and crucially, **no trust infrastructure for owners to verify which trainers are actually good.**

That gap is an opportunity. Doggo can become the credentialing layer that doesn't otherwise exist:

- **Trainer affiliations** — LIMA-network membership (via Dobrá psí škola), KYNOLOG.cz cert, Helppes alumni, methodology-school affiliations rendered as verified badges
- **Community-earned signals** — repeat clients, post-meet reviews, photo gallery from actual walks, attendance counts at recurring meets
- **Tiered credential reads** — "LIMA-network trainer" reads differently from "Self-described trainer" reads differently from "Certified Trainer (Karen Pryor Academy)" — the badge layer should reflect that gradient honestly rather than flattening to a single "Certified" pill

This is the **strongest version of the moat in the trainer-led-walks scenario.** If Doggo ends up predominantly trainer-led activity but also becomes the place owners go to verify trainer quality, that's not a failed bootstrap — that's a credentialing-layer business with adjacent community features. Different shape than the original community-with-marketplace pitch, but a legitimate company.

The deeper play: **trust signals on the platform likely outrank any single credential a trainer can show** because owners themselves can't easily verify one credential against another in this market. Community-earned trust badges + reviews probably matter more than displayed certifications. The platform's job is to surface what owners actually use to decide.

---

## The shelter angle

Still active, positioned as the **supply side of trainer-led walks** (always-on inventory when no client is booked) rather than as a standalone product.

**The institutional layer is real but constrained.** 300+ registered shelters in Czech Republic. In Prague: Pes v nouzi, Útulek Liběň, BedForPet, Cool Critters, Psi bez hranic. Most run on volunteer labor and donations, coordinating through email, phone, and Facebook.

**There's a coordination gap that maps onto what we're already building.** Útulek Liběň recruits volunteer dog walkers — their current ask is restrictive ("1x/week, 3-month minimum, weekdays 9am–5pm"), probably because email-based coordination forces them to filter heavily rather than because they need that commitment level.

**There's a Czech/expat split.** Most rescue org websites are Czech-first. The expat dog community lives in English Facebook groups. A bilingual coordination layer is unusually valuable.

### Dog-as-unit framing

The right framing for the shelter angle is **dog-as-unit, not shelter-as-unit:**

- Each shelter dog has a profile, stats ("4 days in kennel, last walked 3 days ago"), and people pick a *specific dog* to walk
- A dog who develops 8 regular walkers over 6 weeks is a dog who gets adopted — and every walker is a Doggo user with a felt connection to the shelter community
- "Bára hasn't been walked in 4 days. Take her out?" is way more clickable than "Útulek Liběň needs volunteers"

This is what gets people hooked, and what makes adoption a natural endpoint instead of an abstract goal.

### Loops the shelter layer adds (in priority order)

1. **Discover loop:** See a dog → tap → read their story → schedule a walk
2. **Relationship loop:** Walk Bára → photos auto-share to her shelter profile + your feed → next time you open the app, "Bára has been walked 12 times by 6 people — see how she's doing" → you walk her again
3. **Social loop:** Walk Bára → meet other walkers at the shelter or in the park → those walkers become Familiar marks on your profile → community grows
4. **Adoption loop:** After N walks with the same dog → "Are you thinking about adopting Bára? Here's what that looks like" → connects to shelter's actual adoption flow
5. **Public-meet loop:** "Bára joins the Vinohrady Evening Walkers tonight — bring her along?" Couples shelter dogs into existing meets (the Walks → public meet thread)
6. **Sponsorship loop** (for people who can't physically walk): Follow Bára's progress, donate, get updates — keeps non-walkers engaged + adds a possible revenue/donation surface

### How it folds into Discover

Three shapes considered, recommendation noted:

1. **Fourth door alongside Meets / Groups / Dog Care.** "Help a Dog" or "Shelter Dogs." Top-level entry. Pros: discoverable; doesn't dilute paid Care. Cons: adds visual weight to the Discover hub.
2. **Layered into Meets + Care.** Some Meets flagged "Includes shelter dogs from {shelter}." Some Care entries are "Walk Bára (Útulek Liběň)" alongside paid carers. Pros: reinforces community-first thesis; no new surface. Cons: muddles paid/free distinction in Care results.
3. **Dogs-Near-You feed.** Dedicated feed-style surface — vertically scrolling cards of shelter dogs near the viewer, with photos, stats, "Take Bára out today" CTAs. Pros: leans into emotional hook explicitly. Cons: distinct UX pattern, more design work.

**Recommended hybrid:** Shape 1 with Shape 3 inside it. Fourth door labelled "Help a Dog" → tapping lands on a feed of shelter dogs near you, each card with the stats hook and a "Take out today" action. Discoverable + emotionally hooked.

### Risks worth flagging

1. **The vouching gap.** Shelters won't release dogs to strangers off an app. Doggo needs a vouching layer: in-person check-in at the shelter for first-time walkers, verified ID, maybe a "trained by {shelter}" badge. Real institutional design work.

2. **Dilution of paid funnel.** If shelter walks become the dominant activity, you've trained users that "this is the free version of dog-care." Asking them later to pay for sitting feels different. Mitigation: keep the surfaces parallel and visibly distinct. "Help a Dog" is a different door from "Find Care" even if the underlying mechanics share infrastructure.

3. **Non-owned-dog data model.** Today, every dog has an owner (`PetProfile` lives on a `UserProfile`). Shelter dogs would need a non-owner shape — `shelter: ShelterRef` instead of `ownerId`. Real engineering: profiles, schedule, meet rosters all need to handle this.

4. **The "I'll do it" psychology.** Shelters know that 80% of sign-ups ghost. Doggo could help with social proof ("Bára has 4 confirmed walkers this week") and commitment-light entry, but the platform can't manufacture follow-through.

5. **Bilingual coordination.** Útulek Liběň's coordination is in Czech, the expat dog community is English-first. Real for any shelter integration.

### Walker credentialing as a shelter trust layer

The "no other dogs" rule across most Prague shelters that *do* permit public walking (Voříškov, Útulek Liběň, and others) exists because shelters can't verify what's true about either side of the encounter — the walker's competence with reactive dogs, or the specific shelter dog's reactivity to other dogs. The rule is a blunt instrument because no better instrument is available.

That gap is the same one the credentialing-moat thread describes for the training market: a domain with high stakes, no trusted gatekeeper, no infrastructure for differential trust. The platform's job in the training case is to surface trainer quality so owners can make informed choices. In the shelter-walker case, it's to surface walker quality so shelters can relax their blanket conservatism for verified handlers — and let some shelter dogs participate in group walks. That has real value beyond convenience: socialization is what gets shelter dogs adopted, and right now most of them are denied it by default.

The architecture is mostly already in place. Visit reports document dog behavior and walker observations. Trust badges accumulate across three tiers — community-earned, credential, platform. Post-meet review already produces walker → subject documentation. What's new isn't the mechanic; it's the redirect: applying these existing patterns to shelter-walker engagements, with reputation accruing in both directions (shelters review walkers, walkers document the dogs they walk).

The strategic shape this implies is **graduated walker permissions, gated by shelter-level policy.** Tier 1 — solo walks only (the default entry point; no group walks regardless of badge count). Tier 2 — group walks with dogs vetted for sociability. Tier 3 — group walks with reactive or unknown dogs. Tier movement is earned via documented engagement history; tier permissions are *also* gated per-shelter (some shelters will never permit group walks regardless of walker tier, and the system has to accommodate that as a first-class case). Per-dog overrides exist independently — a specific shelter dog can be flagged "solo only" no matter what tier walker handles them. Badges and gamification could meaningfully reinforce this (visible accumulation of documented engagements, recognized milestones, peer visibility within a shelter's walker pool) without turning the trust layer into a scoreboard.

This opens a new persona ramp that doesn't exist in the current archetypes. People who enter Doggo as shelter walkers, accumulate dog-handling reputation through documented engagements, and become community anchors through that work rather than through owning a dog. Different door, same destination — particularly relevant for expat-heavy neighbourhoods where dog ownership is lower but volunteer energy is high.

Risks specific to this thread:

1. **Liability sits above the platform's current shape.** A Doggo-credentialed walker takes a shelter dog to a group meet; the dog bites a passerby. Reputational and legal exposure could land on the platform regardless of waivers. Shelters today carry the blanket rule precisely because they can't underwrite that risk. For Doggo to enable group walks, *someone* has to. That's insurance, legal counsel, possibly indemnification language — real operational work, not product design.

2. **Reputation graphs work in aggregate, fail individuals.** Bad days happen to good walkers. Individual failures here are high-stakes (a child, another dog, a passerby). Designed-for-graceful-failure has to be a first principle — which is why graduated tiering plus per-dog overrides aren't optional, and why a "trust" badge can never function as a green light for any dog with any walker.

3. **Shelter heterogeneity is permanent.** Even with perfect verification, some shelters' policy stances won't relax. The architecture has to make "this shelter doesn't permit group walks, period" a first-class case, not a fallback.

4. **Strategic shape question.** Building this pulls Doggo deeper into being a *credentialing body* than the current "coordination layer" framing implies. Not necessarily bad — credentialing layers can be very defensible businesses — but a shape choice worth naming. The trainer-credentialing thread implies the same shift. Both together would make "Doggo as the trust infrastructure for Prague's dog-care ecosystem" a more accurate description of the business than "coordination platform."

Unbuilt and pre-validation. Belongs in the same conversational territory as the trainer-credentialing thread — both wait on real shelter conversations before they become anything more concrete.

---

## How the threads connect

The trainer-led-walks playbook, the shelter angle, and the credentialing moat aren't separate ideas — they reinforce each other:

- **Trainers are the labor pool** who lead public walks
- **Shelter dogs are the always-on inventory** so trainers aren't idle when client demand is sparse
- **The platform is the credentialing + coordination layer** that makes the whole thing trustable

The walks themselves become a **demonstration surface**: paying owners see the trainer handling dogs in social environments before booking 1-on-1 services. Shelter dogs see new humans every week, accumulating walker counts that drive adoption. The platform accrues trust signals (verified affiliations, community-earned badges, repeat-client counts) that compound into moat.

**The pipeline:** community walks (free, social, trainer-led) → users meet each other + the trainers → trust accrues → paid bookings happen → community members start hosting their own meets without a trainer present → flywheel.

---

## Strategic positioning the playbook implies

There's a fork in the road worth naming because the playbook leans hard one way:

- **Marketplace-with-community:** Paid transactions are the core; community is the differentiator. Closer to a Czech Rover with better defensibility.
- **Community-with-marketplace:** Community engagement is the core; paid care is one of many activities. Closer to a Strava-for-dog-people that happens to monetize through care.

The cold-start playbook **leans community-with-marketplace**. The shelter angle, the meets-first funnel, the "trainer-led walks should feel like community walks" framing — all point that direction. That's a legitimate and bigger bet — community businesses are durable when they work, but they take longer to compound. The Rover-shaped marketplace-with-community version monetizes faster but is more vulnerable to competition.

This fork is unresolved (Open Questions log §7) and shouldn't be settled in this doc. But it's worth knowing the playbook here implies a direction.

---

## Validation prerequisites

Roughly in priority order. None are blocking; all are exploratory.

1. **Real conversations in Prague.** With 2-3 anchor trainers (Klára-shaped: positive-reinforcement, expat-bilingual, comfortable with community visibility) and 1-2 shelter orgs (Útulek Liběň + one other). Validate the pitch. Understand the pain points they actually have.
2. **Approach Dobrá psí škola** as a potential network deal. 40+ centers, shared methodology, already loosely organized. A platform that helps them coordinate + promote is value-add for them, not threat.
3. **Investigate KYNOLOG.cz** as a credentialing partner. ~95 trainers graduated; the closest thing to a respected Czech mark.
4. **Investigate Helppes** as a credibility-halo partner. Featuring Helppes-affiliated trainers (if any are commercially active in the pet-training space) gives Doggo institutional gravitas from day one.
5. **Map the Prague shelter landscape in person.** Walk into 2-3 shelters, see how coordination actually works on the ground, understand the vouching/release process.

These conversations happen before any product work, and shape what the product work would even look like. The platform's design follows what the supply side actually needs.
