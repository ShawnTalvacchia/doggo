---
category: strategy
status: active
last-reviewed: 2026-06-12
tags: [users, personas, trust, funnels]
review-trigger: "when designing user-facing flows or onboarding"
---

# Doggo – User Archetypes (v2)

These archetypes describe **behavioral patterns**, not demographics.
They exist to help reason about trust, motivation, and product decisions — especially for agents generating flows, copy, and features.

---

## Dog-First, Social by Design

Doggo is promoted and positioned around **dog ownership**. Every feature, every screen, every piece of copy leads with the dog — their health, their socialization, their care. The social connections between owners are a natural byproduct, not the pitch.

This is deliberate. People who want to meet other people are often wary of platforms that say "meet people." The dog provides shared context that makes showing up feel natural rather than forced. Users who join "for their dog" and end up making friends are the highest-retention users — the social reward is strong precisely because it wasn't the sales pitch.

Some users *are* primarily motivated by human connection (see **The Social Seeker** below). The product serves them well — but through the dog-first frame, not despite it.

---

## The Two Ramps

Doggo's user journey follows two ramps. Ramp 1 is the main path — most users live here permanently, and that's success. Ramp 2 is a dial that any active user can turn, not a career change or a separate product.

### Ramp 1: Curious → Active (Engagement)

This is the journey from "I downloaded this dog app" to "I'm a regular — I go to Tuesday walks, I know people, I coordinate through Doggo."

**Curious** — Downloaded the app, browsing. Hasn't committed to anything. Looking at meets nearby, maybe reading profiles. Motivation: "Is this useful for my dog?"

**Participant** — Joined a meet or two. Still observing more than engaging. Starting to recognise faces (human and canine). May have marked someone as Familiar. Motivation: "My dog enjoyed that. Maybe I'll go again."

**Regular** — Recurring attendance, has Familiar and Connected relationships. Uses the app to coordinate, not just discover. Part of a group or two. Motivation: "This is part of our routine now."

**Connector** — Organizes meets, invites people, anchors the local community. May run a private group. Others look to them for coordination. Motivation: "I want this community to thrive."

Most users settle at **Participant** or **Regular** and never need to go further. A healthy community has far more regulars than connectors. The product should never pressure users to advance — each stage is a valid, complete experience.

### Ramp 2: The Carer Dial

This is not a career decision. It's a dial that any active user can turn up or down at any time. As your audience widens, you remain the same role — a Carer — just reaching further.

At **zero**, you're an owner. You use Doggo for your dog's social life and your own community.

**Turned slightly** — You set yourself as a carer for your Connected circle. Your Connected network can see you'd be willing to lend a hand. Maybe you grab a friend's dog on the way to the park because you're going anyway.

**Turned more** — You listed a service with a price. Walking, or sitting, or both. You set your own constraints — neighbourhood, availability, group size. Audience setting is "circle" — Connected viewers only can act. Maybe your listing is deliberately narrow and you rarely get requests. That's fine.

**Turned high** — You've opened your services to anyone. Multiple services, set availability, reviews from past arrangements. You appear in `/discover/care`. Dog care is meaningful income for you, part-time or full-time.

The key insight: **the dial can be turned back down at any time**. Someone who opened to anyone last month can narrow back to circle (or remove services) this month. There's no commitment, no "Provider account" that's separate from their Carer account. It's all one profile with more or less visible.

The product should make each position on the dial feel equally valid. The person who walks one extra dog on Saturdays and the person who runs a full dog-walking business both use the same tools — just different amounts of them.

Most users never touch the dial. Some barely turn it. Few go all in. All of these are success.

### Bridge to the role model

The Carer dial maps onto a single role with an audience setting (no separate "Provider tier" — the earlier three-tier framing collapsed during Discover Refinement, 2026-05-10):

- **Owner** (dial at zero — no `carerProfile`)
- **Carer with circle audience** (dial turned slightly — `carerProfile.publicProfile === false`; services visible only to Connected viewers)
- **Carer with anyone audience** (dial turned more or high — `carerProfile.publicProfile === true`; services visible to everyone, appears in `/discover/care`)

The archetypes below describe *behavioural patterns*; the dial position describes *what audience reaches the Carer's services*. The Casual Carer archetype lives at the circle-audience setting; the Aspiring and Professional Carer archetypes are gradations toward the anyone-audience setting (and the comfort of appearing publicly).

---

## Archetypes

These are recurring behavioral profiles that appear across the two ramps. Users may identify with more than one, and will shift between them over time.

### The Routine Owner

*Ramp 1 — typically at Regular stage*

**Who they are**
A consistent dog owner with regular walking times and familiar routes. Same parks, same streets, same hours.

**Primary goals**

- Keep their dog healthy and socialized
- Maintain predictable routines
- Avoid unnecessary hassle

**Primary fears**

- Letting a stranger disrupt their routine
- Unsafe or chaotic interactions
- Over-commitment

**Trust threshold**

- Moderate
  Trust increases through repeated visibility and shared routines, not credentials.

**What success feels like**

- Their dog has familiar faces (human and canine)
- They recognise people before needing help
- Help feels available without being transactional

**Product behaviour**
Joins the same recurring meet every week. Rarely creates meets but reliably attends. Has a small, stable Connected list. Uses the app for coordination, not exploration.

---

### The Occasional-Need Owner

*Ramp 1 — can appear at any stage*

**Who they are**
An owner who is usually self-sufficient but occasionally needs help — travel, long workdays, emergencies.

**Primary goals**

- Find reliable help when needed
- Minimize stress and risk
- Feel confident leaving their dog with someone else

**Primary fears**

- Making the wrong choice under pressure
- Hidden risks or misrepresentation
- Feeling judged for needing help

**Trust threshold**

- High
  Needs clear signals of reliability and familiarity before acting.

**What success feels like**

- Having a short list of "known" people they trust with their dog
- Feeling calm when plans change
- Trusting the platform to reduce uncertainty

**Product behaviour**
May be inactive for weeks, then highly engaged when they need care. Their engagement pattern is spiky. The community features (meets, connections) give them a trust network to draw on when the need arises — this is the community-to-care bridge in action.

---

### The Marketplace Owner

*Ramp 1 — moved through Curious → Participant, settled into a care-led usage pattern*

**Who they are**
An owner who joined Doggo to find a trusted carer, used the community thread to scout (a few meets, a handful of Familiar marks, group memberships in their neighbourhood) and now mostly uses the app for care management. They're not socially absent — they have connections, they're in groups, they have a meet history — but their week-to-week engagement is the booking thread with their carer, not new community participation. The community served its job (build enough trust to hire someone); the care thread is the ongoing relationship.

This archetype is "graduated to care," not "skipped community." That distinction matters: the funnel worked exactly as designed, and most successful Doggo users will end up here.

**Primary goals**

- Reliable, professional care for their dog
- Minimal ongoing coordination overhead — the app should make booking easy and then quietly stay in the background
- Optional re-engagement on their terms (a meet here and there if it's convenient, no pressure)

**Primary fears**

- Feeling pressured to keep up community participation they've moved past
- The app shaming them (subtly or explicitly) for "outsourcing" their dog's social life
- Losing access to the carer relationship if the platform tilts too far toward community-only signals

**Trust threshold**

- Platform-mediated with community-seeded trust
  Their trust in their *current carer* came from community signals (mutuals, group co-membership, observed behaviour at past meets). Their ongoing trust is platform-mediated (contracts, visit reports, the booking flow). They no longer need the community for due diligence on their existing relationship.

**What success feels like**

- Their dog comes home tired and happy after every walk
- The booking thread covers everything: schedule, photos, occasional schedule changes
- The app surfaces relevant community moments lightly — a banner, a notification — without insisting

**Product behaviour**
Multiple group memberships (their neighbourhood + the group their carer hosts). A small Connected/Familiar set from earlier community participation. Active recurring booking with their primary carer. Zero or near-zero *future* meet RSVPs — they don't actively scout for new meets even though they still technically could. Heavy usage of `/bookings` and the booking-detail chat thread. Light usage of `/communities` and `/home` feed (they scroll occasionally). Near-zero usage of `/discover/meets`. The DiscoveryBanner on `/home` ("your week is empty — meets in your circle") is built for exactly this rhythm: polite, low-pressure, surfaces the community thread when it might be useful without insisting on participation.

---

### The Social Seeker

*Ramp 1 — enters at Curious, high potential to reach Regular or Connector*

**Who they are**
Someone genuinely motivated by wanting to meet people in their neighbourhood — but jaded or unsatisfied with existing platforms. Meetup feels forced. Bumble BFF feels desperate. Local Facebook groups are stale. They'd never sign up for "a social app," but they'll sign up for a dog app and be quietly delighted when they make friends.

**Primary goals**

- Meet people in a natural, low-pressure context
- Build a local social circle that doesn't feel manufactured
- Give their dog a better social life (real, but also the comfortable framing)

**Primary fears**

- The app feeling like another forced social platform
- Interactions that feel transactional or performative
- Being "too visible" before they're ready

**Trust threshold**

- Moderate to high
  Wants to observe before engaging. The Locked → Familiar → Connected model is exactly right for them — they control the pace.

**What success feels like**

- Recognising people at the park and being recognised back
- Group chats that feel like friend groups, not platform features
- Social connections that started through the app but feel organic

**Product behaviour**
High engagement with meets and group features. Likely to become a Regular quickly if early experiences are good. May become a Connector — the social reward motivates them to organise. Rarely enters Ramp 2 because their motivation isn't care-related, but may casually help Connected friends.

---

### The Anxious New Owner

*Ramp 1 — enters at Curious, the most training-driven entry pattern*

**Who they are**
A first-time owner (or a newcomer to Prague with a dog who's lived elsewhere) who feels under-equipped to handle their dog in public. Often expat — over-represented in international neighbourhoods where dog ownership is high and family-network help is low. Their dog may be reactive, fearful, untrained, or just unknown to them as a personality. They downloaded Doggo because they need help, not because they want to socialise.

This archetype is where the training-demand signal lives. Per Roman's user interviews (2026-06-02), training is the most-needed and most-appealing service for this segment — they're paying attention to professionals before they're paying attention to peers.

**Primary goals**

- Get their dog to a level where public outings aren't a crisis
- Learn what they're supposed to be doing (technique, calm body language, leash handling)
- Find a professional they can trust *before* trying to make friends
- Eventually, have their dog belong somewhere — but the training comes first

**Primary fears**

- Their dog embarrassing or hurting someone at a meet
- Being judged for their dog's behaviour by experienced owners
- Booking someone unqualified and making things worse
- Group settings before they're ready — the wrong meet at the wrong time could set them back

**Trust threshold**

- High for paid services (they're investing in expertise)
- Low for community participation (they want to observe, not be seen)
  The trust gradient (Locked → Familiar → Connected) fits them well — they engage on their own pace, and the community side feels safe because it doesn't demand their visibility.

**What success feels like**

- A trainer they trust who knows their dog by name
- A measurable change in their dog's behaviour they can feel weekly
- A first walk that doesn't end in apology or panic
- The realisation, months in, that they belong to a community they didn't notice forming

**Product behaviour**
Locked profile by default. Joins one or two care groups (specifically the trainer's group, not park groups) before joining any community-driven group. RSVPs to the trainer's free public walk as a low-stakes way to evaluate them. Heavy `/discover/care` usage with a training filter. Their first booking is almost always a 1-on-1 training session, not a recurring walker. Mid-engagement, they may start attending the trainer's group walks regularly and slowly drift into Participant behaviour. Daniel is the canonical persona for this archetype.

---

### The Neighborhood Hub Member

*Ramp 1 — settled at Connector, narrow-and-deep*

**Who they are**
A socially comfortable owner whose primary engagement on Doggo is **one tight private group** — usually around a dozen neighbours from their block, building, or street. They probably anchor or admin that group. They know everyone in it by name, dog, and routine. Outside that group their footprint is small: maybe one or two open park groups they peek into, a handful of Familiar marks at the wider neighbourhood level, and that's it. They don't browse Discover. They don't go to events outside their crew. They have no need for the broader marketplace because their crew handles it among themselves.

This archetype is what Doggo looks like as a **WhatsApp replacement for a single dense neighbour group** — and that's the entire pitch for them. The platform's value isn't "find new people"; it's "coordinate the people you already trust, with structure that informal chats lack."

**Primary goals**

- Keep the group active without it becoming high-effort
- Coordinate quick logistics (walks tonight? someone going to the vet? need a dog-sitter Saturday?)
- Have the structure for occasional peer-care arrangements without the friend-favour math

**Primary fears**

- The platform pressuring them outward (algorithmic recommendations, "people you may know," prompts to join more groups)
- Their group becoming visible to non-members or outgrowing its tight character
- The care side of the platform tilting toward strangers when they only ever wanted neighbour-help

**Trust threshold**

- Low within the group, high outside it
  Their crew is already trusted (real-world neighbours). Anyone outside it gets the full ramp from scratch.

**What success feels like**

- The group is the first place they open the app
- Quick exchanges land cleanly — "Žofka could use company tomorrow" gets two replies in five minutes
- Booking a neighbour for the night feels as light as asking the favour, with the receipts that protect the friendship

**Product behaviour**
Open or locked profile (varies — many Hub Members are socially comfortable enough to keep their profile open, especially since their group already vouches for them). Anchors one private neighbour group, ~6–15 members. Heavy in-group posting — short coordination messages, photos, occasional "anyone around?" requests. Light-to-moderate Familiar marks across the wider neighbourhood from incidental park encounters. Possibly a Casual Carer (dial barely turned, circle audience) — they'd take a neighbour's dog for the night, but it isn't a service they list publicly. Near-zero `/discover/care` usage. Light `/discover/meets` usage (only to find their crew's events). Zero or near-zero attendance at events outside their group.

---

### The Casual Carer

*Ramp 2 — dial barely turned (audience: circle)*

**Who they are**
An active community member who'd help with someone's dog if it's convenient — but doesn't think of themselves as a Carer. They're going to the park anyway. They're home all day and wouldn't mind a second dog around. It's a favour that happens to be facilitated by the platform.

**Primary goals**

- Be useful without obligation
- Help within their comfort zone
- Maybe earn a bit of extra money, but that's not the point

**Primary fears**

- Being treated like a service worker
- Hidden expectations or escalating commitment
- Liability or awkward situations

**Trust threshold**

- Low to moderate
  They trust through personal interaction more than platform guarantees. They help people they know.

**What success feels like**

- Helping feels casual and appreciated
- Boundaries are clear and respected
- Participation remains entirely optional

**Product behaviour**
Set as a carer with audience "Connected circle only" on the profile care-offering picker. May or may not have a listed service with a price. If they do, the constraints are narrow — their neighbourhood, a few hours, dogs they already know. They might accept one or two arrangements a month, or none. The platform makes this feel as lightweight as it actually is.

---

### The Aspiring Carer

*Ramp 2 — dial mid-range (audience moving from circle toward anyone)*

**Who they are**
Someone interested in offering dog-related services more regularly. Could be building toward side income, testing whether this could be a real thing, or just enjoys the work and wants to do more of it.

**Primary goals**

- Build credibility over time
- Earn trust without being a stranger
- Find out if this is something they want to do seriously

**Primary fears**

- Being lumped in with unverified strangers
- Over-regulation before they've had a chance to prove themselves
- The platform feeling like a gig-economy job board

**Trust threshold**

- Moderate
  They trust the platform if progression feels fair and organic — their community reputation should carry weight.

**What success feels like**

- Steady, manageable demand from people they know
- Clear trust signals that reflect real behaviour
- Income that grows naturally alongside reputation

**Product behaviour**
Has listed one or more services. Active profile with availability. May have started through the Casual Carer stage and found they enjoyed it. Building reviews and care history. Audience setting may still be "circle" (testing the waters with people they know) or freshly opened to "anyone" (just appearing in `/discover/care`). Still primarily an owner — their own dog is their main reason for being on the platform.

---

### The Shelter Walker

*Different door, same destination — enters Doggo without a dog of their own*

**Who they are**
Someone who joined Doggo to walk shelter dogs, not to manage their own pet. Probably has volunteer energy, time on weekends, an apartment that won't allow a dog (or won't allow another one), or is rebuilding a relationship with dogs after losing one. Particularly relevant for expat-heavy Prague neighbourhoods where dog ownership is lower but volunteer energy is high.

**Primary goals**

- Spend time around dogs without the commitment of owning one
- Help dogs who need it most
- Feel competent — accumulate the standing to handle more dogs, more situations, over time
- (Often unstated) Build a real-world social circle through the shelter community

**Primary fears**

- Being treated as undifferentiated free labor
- Getting matched with a dog who's beyond their handling ability
- Long-stayer dogs they grow attached to never finding homes
- The platform turning their volunteering into a scoreboard

**Trust threshold**

- They trust the shelter's vouching gate (intro visit before the first walk). They trust the platform if it surfaces honest information about each dog (handling notes, recent behaviour) without flattening it into a "Book Now" funnel.

**What success feels like**

- Walking the same dog regularly enough to know their quirks
- Earning the next tier (Vetted → Experienced → Trusted) through documented work, not gaming
- A long-stayer they walked finally getting adopted, with the walker knowing they were part of why
- Recognising other walkers in the park and at the shelter

**Product behaviour**
Enters via the shelter page (`/shelters/[id]`) rather than the owner-side flow. Profile may or may not have a dog (the dog isn't the entry point). Heavy engagement on a small set of specific dog profiles (`/dogs/[id]`). May develop into a Connector at the shelter community level — running walking sessions, mentoring new walkers, advocating for specific dogs. Some will eventually open their own care services if a dog enters their life. The Shelter Walker is the cold-start engine's natural complement to the Trainer-led Walks playbook — both seed real community participation without requiring dog ownership as the entry token. See [[Cold-Start Playbook]] → "Walker credentialing as a shelter trust layer" and [[features/shelters]].

---

### The Adoption-Curious Explorer

*Different door, same destination — walking shelter dogs to decide whether to adopt (Adoption-Curious Journey, 2026-06-12)*

**Who they are**
Someone who doesn't own a dog but is seriously considering it — and wants to find out before committing. Often a first-time-owner-to-be: grew up with a dog, has wanted one for years, but isn't sure their flat, hours, or life can give a dog what it deserves. Distinct from the Shelter Walker (who walks *instead of* owning) and the Anxious New Owner (who already took the leap): the Explorer is mid-decision, using low-stakes shelter walking as the way through it. Demo persona: **Eliška** (Žižkov, no dog yet).

**Primary goals**

- Find out what owning a dog actually asks of them, in reality rather than imagination
- Spend real time with dogs without the pressure of a commitment they're not ready to make
- Help while they're deciding — the walking is genuinely useful even if they never adopt
- (Often unstated) Meet the dog that changes "should I?" into "this one."

**Primary fears**

- That walking a shelter dog *is* a commitment to adopt it — the single most-documented friction in this journey (see [[Competitive Research - Adoption-Curious Journeys]]). If entry copy doesn't say "no obligation," they don't start.
- Getting it wrong — adopting a dog they can't actually care for, then having to return it
- Walking into a shelter cold and not knowing the process
- Being judged for exploring rather than committing

**Trust threshold**

- They trust a warm, social on-ramp (a group walk with people who'll show them how it works) far more than a cold solo shelter visit. They trust the shelter to be the honest curator of whether a given dog — and ownership at all — is right for them. The "explore before you commit" framing is what lets them in the door.

**What success feels like**

- A graceful path with no wrong exits: walk → walk again → maybe a sleepover/foster → adopt, each step a fine place to stop
- Becoming an advocate for a dog they walked — the recap they shared is *why* it got adopted, even if the adopter was someone else
- Arriving at a confident decision either way: the right dog at the right time, or "not yet" without guilt

**Product behaviour**
Enters via the adoption-curious doorway (`/discover/help-a-dog`, tuned "explore before you commit") and the group shelter walk (a Meet sourcing shelter dogs) rather than a cold solo visit. Starts as a shelter Supporter, converts through mentored walks to a vouched Walker, bonds with a specific long-stayer (`/dogs/[id]`), and shares walk recaps that feed the **advocacy loop** — the proven adoption engine (a walker surfaces the dog to *other* adopters). The journey's endpoint is open: the network adopts the dog (primary, ~5×/14× lift) or the Explorer does (secondary). Either way they often graduate into a Shelter Walker, a Connector, or — if a dog enters their life — an owner. See [[features/shelters]] and `docs/phases/adoption-curious-journey.md`.

---

### The Professional Carer

*Ramp 2 — dial turned high (audience: anyone)*

**Who they are**
A professional or semi-professional dog walker, sitter, or carer. Dog care is meaningful income — part-time or full-time.

**Primary goals**

- Consistent, predictable work
- Clear expectations and professional tools
- Reputation protection

**Primary fears**

- Being undercut by unqualified helpers
- Platform instability or unclear rules
- Losing reputation to factors outside their control

**Trust threshold**

- Platform-based
  They trust systems, policies, and structure. They want the platform to reflect their professionalism.

**What success feels like**

- Predictable demand and a manageable schedule
- Respect for their professionalism and experience
- Fair visibility and matching

**Product behaviour**
Full Carer profile with audience set to "anyone," set schedule, multiple services. Surfaces in `/discover/care`. Uses scheduling and booking tools heavily. May also be a community Regular or Connector — many professional Carers are deeply embedded in local dog communities. The community participation reinforces their credibility.

---

## Archetype Notes

- **All users start as owners.** There is no separate "Carer signup." The Carer dial exists within the same profile.
- **Movement between archetypes is expected and encouraged.** A Routine Owner might become a Social Seeker after a life change. A Casual Carer might turn the dial up or back down.
- **Trust is built through participation and proximity**, not labels or self-declared roles.
- **The product should never force a user to adopt an archetype.** No "what type of user are you?" screens. The product observes behaviour and adapts.
- **The ramps describe product design intent**, not user-facing language. Users don't see "Ramp 1" or "Ramp 2." They see features that naturally support their current motivation.
- **Dog-first framing applies everywhere.** Even the Social Seeker's journey is framed around their dog. The human connection is the reward; the dog is the reason.
