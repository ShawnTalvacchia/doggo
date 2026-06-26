---
category: strategy
status: draft
last-reviewed: 2026-06-25
tags: [cold-start, trainers, shelter, foster, community, account-types, credentialing, future]
review-trigger: "before any phase touching cold-start, monetization, account types, or category strategy"
---

# Cold-Start Playbook

> **Status.** Mixed. The **shelter angle** has graduated from exploration into active product work — the Shelter Foundation phase opened 2026-06-01 and lands Útulek Liběň in the demo. The **trainer-led walks playbook** and the **credentialing moat** threads remain pre-roadmap exploration pending real conversations in Prague; both will be carried forward by the merged Carer Portfolio + Shelter Walker Credentialing phase when it opens.

**TL;DR.** Doggo has a chicken-and-egg problem: a community-first dog-care platform has no value until other dog people are on it. Three threads — paid trainer partnerships, shelter dog walks, and Doggo-as-credentialing-layer — converge on a single playbook: **seed activity with paid trainers leading public walks (with shelter dogs as always-on inventory), use those walks to onboard organic users into hosting their own meets, and accrue trust infrastructure that becomes the platform's moat in a market with no existing credentialing layer.** The shelter side is now in the demo; the trainer and credentialing threads still need real Prague conversations — partnerships with 2-3 anchor trainers + 1-2 shelter orgs — before further product commitments.

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

> **Shipped:** the mentor-vouching mechanism (this playbook's "Mentor-vouching as the scalable trust mechanism" thread) landed in the Cross-Shelter Mentor Network phase (2026-06-12). The live-driven, assumption-flagged pitch for shelter-coordinator interviews lives in [[mentor-network-shelter-demo]]; the built feature is in [[features/shelters]] → "Shelter-walking journey & mentor network."

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

### Mentor-vouching as the scalable trust mechanism

Surfaced 2026-06-09 during walkthrough discussion of V4 (walker journey end-to-end). Direct extension of the credentialing-as-trust-layer thesis above — specific *mechanism* for how the platform produces walkers shelters can trust without the shelter doing the assessment work themselves.

**The thesis.** There's more latent demand to walk shelter dogs (and ultimately adopt) than current shelter intake captures. Útulek Liběň's "1×/week, 3-month minimum, weekdays 9am–5pm" filter isn't a measure of what walking shelter dogs actually requires — it's a measure of what the shelter can afford to coordinate given today's tools. People with 9-to-5 jobs, people curious about dog ownership before committing, people who'd happily walk on weekends — all get filtered out. Doggo's job is to reduce the friction without sacrificing trust.

**The mechanism: trusted walkers as the conduit.** A Super Volunteer (high tier, real engagement history) can offer paid "mentor sessions" — a Carer service type that runs them taking a new walker to a participating shelter for a supervised first walk. After N mentor sessions (per-shelter policy, typically 3–5), the mentee graduates to solo walker status at that shelter. The shelter accepts the mentor's vouch + the platform's tier resolution + the supervised-session count as substitutes for their own multi-month assessment.

**Why this works as an unlock:**

- **Shelter admin burden drops massively.** Today every new walker requires staff time for intake, orientation, supervised first walks. The mentor model offloads orientation + supervised-first-walks to external mentors (paid by the mentee, free to the shelter).
- **Higher-quality walker pool through the fee filter.** People who pay for mentor sessions are committed. The fee filters out dabblers without the shelter using admin time on screening.
- **Larger walker pool through schedule flexibility.** The mentor + platform credentials substitute for the long-commitment screening. Shelters can accept Saturday/Sunday/evening walkers because the mentor handles the orientation and the platform tracks reliability.
- **Pre-vetted credibility.** Shelter sees a new applicant: "Super Volunteer at Útulek · 87 walks · vouched by Klára H. & Pavel D." Strong signal arriving for free.
- **Cross-shelter network effects.** Walker earned through Útulek can route to Pes v nouzi without losing credibility (per the platform-level Super Volunteer tier — see "Cross-shelter recognition" below).

**Why this works for the trainer-walker archetype (the platform's keystone persona):**

- New revenue stream beyond paid care + community-builds-paid-training. "Mentor session" is a third Carer service type.
- Aligns with their existing public-and-promoting profile shape — same architecture, new offering.
- Compounds their community credibility — being chosen as a mentor reinforces their Super Volunteer status.
- Voluntary — they opt in if they want this scope; they don't have to.

**Why this works for the adoption-curious / pre-adopter persona:**

This opens a doorway Doggo hasn't designed for yet. Someone considering ownership — anxious-new-owner archetype like Daniel, or pre-adoption-explorers who've never owned a dog — can walk shelter dogs in a low-stakes mentored context BEFORE committing to ownership. Adoption becomes a natural endpoint to the volunteer journey instead of an abstract goal. This is also where the "pay-to-volunteer" framing stops feeling odd: the mentee is paying for supervised dog-handling training that leads to credentialed access — a normal apprenticeship pattern (parallels: scuba instructor cert, beekeeping mentorship, wilderness guide apprenticeship).

**Pricing model:** mentor sets the per-session price (matches existing Carer service config architecture). Platform offers recommended range as a default. Shelter doesn't pay anyone — mentee pays mentor, platform takes a marketplace cut.

**Requirements model — three layers:**
1. **Platform-wide baseline (Doggo sets):** verified identity, emergency contact, general dog-handling liability acknowledgment, age 18+. Signed ONCE; profile carries it across shelters.
2. **Shelter-specific waiver (each shelter sets):** their specific liability language, bite-history disclosure rules, medication protocols. Signed per-shelter; lives in profile's shelter-affiliations section.
3. **Mentor session minimum (platform-suggested, per-shelter overridable):** Doggo suggests baseline (e.g. 3 sessions before graduation); each shelter overrides up or down.

**Cross-shelter recognition.** Super Volunteer is a **platform-level tier** (earned through real walks at any participating shelter + ≥2 trainer vouches), recognized at every shelter that participates. Profile shows "Super Volunteer · Útulek 87 walks · vouched by Klára H., Pavel D." A new shelter accepts the tier signal but still requires their own waiver + their own orientation walk for their specific dogs. Shelter-internal honorific roles ("Útulek Trusted," "head walker") can exist as a separate tagging layer above the platform tier if shelters want it.

**Without this**, "Super Volunteer" becomes per-shelter status — every shelter is its own walled garden, the platform's just hosting separate logbooks, the credentialing moat collapses.

**Bootstrapping problem.** At launch no walker has the walk count to be a Super Volunteer. Solution: shelter admins can credit historical real-world walks ("Pavel has been walking at Útulek 4×/week for 3 years") into the platform tier resolution. Shelter has reputational skin in the game (won't vouch for fake counts). Platform marks "shelter-credited" walks distinctly from "platform-logged" walks so the audit trail stays clean. Util becomes the bootstrap node for early Super Volunteer pool; those credentials then enable the mentor-vouching loop for the next wave of walkers.

**Two paths in steady state:**
1. **Self-directed apply** — experienced dog handlers self-apply at a shelter; shelter does the assessment; standard pathway. Still exists.
2. **Mentor-vouched apply** — beginners come in through paid mentorship; mentor + platform credentials substitute for shelter's screening; new pathway, dominant case for new-to-volunteering users.

Both coexist. The mentor path doesn't replace the direct path; it adds a doorway for users who'd otherwise never apply.

**Strategic positioning this implies.** Doggo isn't just a coordination layer for the dog community — Doggo is the place where **trust gets BUILT in the dog community**. Trainer-walkers are the keystone (community credibility + professional expertise); the platform's value is enabling THEM to extend trust to others; the credentialing accumulates across shelters; the network effects compound. The cold-start unlock is finally clear: trainer-walkers (already self-interested in growing their training clientele) become the engine that grows the volunteer pool that grows the adoption pipeline. Everything routes through the people we've already identified as the keystone archetype.

This needs real shelter conversations to validate, but it's the most concrete strategic mechanism the playbook now has for closing the credentialing-gap moat.

### Assumptions to validate

The mentor-vouching model above is built from first principles + competitive research + market observation — not from shelter-coordinator interviews. The Cross-Shelter Mentor Network phase ships with these assumptions baked in; each one needs validation before going beyond demo state. Before each PO interview, scan this section and pick the highest-impact items to test; after the interview, edit entries IN PLACE — confirmed assumptions promote into the playbook proper, refuted ones trigger feature-doc updates in the surfaces they affect.

**Format per entry:** claim · confidence · affected surfaces · what would refute it.

1. **Shelter coordinators will accept a mentor's vouch + platform tier resolution as substitutes for their own assessment.** Confidence: **medium-low** — this is the load-bearing assumption of the whole model. Affected surfaces: the entire vouching state machine; `acceptsMentorVouches?: boolean` on `ShelterPolicy`; the walker journey end-to-end. Refuted if: shelter coordinators say "we have to do our own walk-throughs regardless of who vouches" — in which case the mentor session becomes a credibility booster but NOT a substitute, and the shelter's existing process still gates.

2. **A platform-wide baseline waiver (identity + emergency contact + general liability) is acceptable to most shelters.** Confidence: **medium-low** — Czech liability law and shelter-specific policies may force per-shelter waivers from scratch. Affected surfaces: profile's shelter-affiliations section; the "sign once, carry across shelters" experience. Refuted if: shelters say their lawyers require their specific language at minimum, no shared baseline — in which case the three-layer model collapses to two layers (no platform baseline; shelter waiver per affiliation; mentor minimum still works).

3. **Super Volunteer should be a platform-level tier that ports across shelters.** Confidence: **medium** — strategically necessary for the network effects, but shelter operators may insist on per-shelter earning ("the dogs are different here"). Affected surfaces: cross-shelter affiliation rendering on profiles; Discover Help a Dog elevation; the Mentor Network's value prop. Refuted if: shelters reject the portability framing — fallback is platform-recognized tier with per-shelter override (shelter can decline to recognize incoming Super Volunteers and require fresh earning).

4. **Paid mentor sessions filter for committed walkers without filtering out serious-but-budget-constrained ones.** Confidence: **low** — fee filter is a double-edged sword. Affected surfaces: pricing model; mentor-session pricing range defaults; Multi-Path Demo's adoption-curious persona affordability. Refuted if: target walker population is income-constrained and even modest fees price them out — fallback options include shelter-subsidized mentor sessions, sliding-scale pricing, or shelter-funded "first mentor session free" credits.

5. **Trainer-walkers want to be mentors as a third service line.** Confidence: **medium** — the keystone-archetype thesis depends on it; some trainers may see mentor work as low-margin coordinator work below their professional rate. Affected surfaces: mentor-session as a Carer service config kind; profile rendering of mentor offerings; the entire "trainer-walker as engine" framing. Refuted if: trainers consistently price mentor sessions out of reach OR decline to offer them — fallback: dedicate "Senior Volunteer mentor" role (Super Volunteers who aren't paid trainers) as the primary mentor pool, and trainer mentorship becomes a niche subset.

6. **3–5 mentor sessions is a reasonable graduation threshold.** Confidence: **low** (it's a guess). Affected surfaces: `mentorSessionMinimum` per-shelter default; user-facing copy ("X sessions to walk solo"); financial commitment for mentees. Refuted if: shelters say "5 is way too few" or "1 is plenty if the mentor signs off" — easy fix per `ShelterPolicy` override; the demo just needs to land at a defensible default.

7. **Shelter coordinators will do the work to credit historical real-world walks for bootstrap.** Confidence: **medium** — they have reputational skin in the game and want the network effects, but it's still admin work they may not prioritize. Affected surfaces: the bootstrap affordance on shelter admin surface (stubbed in demo); initial seeded Super Volunteer count; the Mentor Network's launchability. Refuted if: shelters won't allocate time — fallback: Doggo-side concierge service for the first 3–5 shelters (Doggo's team does the data entry from shelter-provided lists during the rollout window).

8. **The fundamental demand thesis holds.** Confidence: **medium-high** — the latent-demand argument (people who'd walk shelter dogs on weekends but not Mon–Fri 9–5) feels strong intuitively, but the assumption that current shelter intake friction is the BINDING CONSTRAINT (vs other factors like fear of dog-handling, time scarcity, transportation, dog allergies) isn't established. Affected surfaces: the existence of the entire Multi-Path Demo phase, the adoption-curious doorway, the model's expected adoption rate. Refuted if: shelter coordinators report that current intake reflects actual capacity and demand IS the binding constraint (not friction) — fallback: smaller-scope value prop (better tooling for existing walkers, not new walker acquisition).

9. **Adoption is a natural endpoint to the volunteer journey at meaningful scale.** Confidence: **medium** — there's anecdotal evidence (shelters report volunteer-to-adopter conversion), but the rate matters. Affected surfaces: Multi-Path Demo's adoption-curious narrative; pitch framing to shelters ("we'll grow your adoptions"); the volunteer→adoption funnel as a strategic anchor. Refuted if: shelter conversion data shows volunteer-to-adopter is rare (< 5% over a year) — the funnel framing loosens to "volunteers as community-builders" without the adoption-anchor.

10. **Shelters' resistance is about trust, not control.** Confidence: **medium-low** — the playbook assumes the binding constraint is "we don't trust unknown walkers" so a credentialing layer solves it. Alternative: the binding constraint is "we want to control who handles our dogs as an exercise of organizational identity" — in which case credentialing changes nothing because it bypasses the felt-need for control. Affected surfaces: the value prop framing to shelters; whether Mentor Network reads as helpful or threatening. Refuted if: shelter coordinators frame their friction in terms of "our culture" / "our way of doing things" rather than "we have to be careful who we trust" — fallback: position Doggo as a tool shelters configure, not a layer they delegate to.

---

## The vet angle

> **Status: pre-roadmap exploration, separate research doc.** Added 2026-06-02 after Roman's user interviews flagged structured vaccination records (and gating) as a real owner need. The full strategic framing — multi-sided value loop, entity model options, tier breakdown, decisions for PO — lives in [[strategy/research/Vets as a Credentialing Layer]]. Open Question §16 tracks whether the thread graduates.

The shape mirrors the shelter angle: vets become an institutional partner type whose presence on the platform produces verified credential signals (vet-confirmed vaccinations). Same playbook structure:

- **Partner type** with strong professional networks, highly local, owner-facing acquisition pain
- **Multi-sided value** (owners get peace of mind; vets get patient acquisition + billing; platform gets verified data; public good: more dogs vaccinated)
- **Cold-start partnership pattern** — 1-2 anchor partnerships (one large clinic, one expat-leaning) before product commitment
- **Trigger to graduate from research → phase** — PO has a real Prague vet conversation

What's different from shelters: the owner-facing motivation is quieter (record-keeping isn't a public-good story owners rally behind the way they rally behind homeless dogs), and the rule we'd want to maintain is that **vets stay a credentialing layer, NOT a Care service category** (vet-as-Carer was retired in OQ §6 — we don't want to un-do that stabilisation by accident).

See the research doc for the full breakdown before any phase-shaped commitment.

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
