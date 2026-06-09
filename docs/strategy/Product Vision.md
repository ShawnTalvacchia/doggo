---
category: strategy
status: active
last-reviewed: 2026-06-08
tags: [vision, principles, strategy, monetization]
review-trigger: "before any major feature decision or strategic discussion"
---

# Doggo — Product Vision

Doggo is a community-first platform in Prague for people whose lives revolve around dogs — owners, people offering care, and anyone drawn to the dog community. Dogs are the shared context: walks, meetups, and everyday routines bring people together, and the community that forms makes giving and getting care feel approachable, trustworthy, and fun.

---

## The Thesis

Doggo is a dog ecosystem platform — community and care surfaces are inseparable, and the credentialing layer is what makes both trustworthy. Organic growth comes from owners and dog-lovers connecting with each other; paid care, business profiles, and bookings become natural extensions of an already-engaged user base. Institutional credentials (shelter vouching, methodology affiliations, professional certifications) compose with community-built reputation (post-meet reviews, repeat clients, mutual connections) to make every kind of trust legible.

**Meets build trust. Trust enables care. Care is booked and tracked.**

This isn't community-with-marketplace or marketplace-with-community. Doggo is both at once, by design. When community and marketplace decisions surface real tension, those are the most strategically important calls and get careful case-by-case deliberation — not pre-committed rules. See [[Open Questions & Assumptions Log]] §7.

### Ways In

Groups are the connective tissue. Doors expand as the platform grows; here are the established and planned ones:

| Door | What it is | Barrier | Examples |
|------|-----------|---------|----------|
| **Find Your Park** | Auto-generated groups for major dog parks. Open, no admin, anyone posts a walk. | Lowest — just show up | "Riegrovy Sady Dog Walks", "Letná Off-Leash" |
| **Find Your People** | Neighbourhood circles, breed groups, activity crews. Small, trusted, high-utility. Where mutual aid lives. | Medium — request to join | "Vinohrady Evening Walkers", "Prague Reactive Dog Support" |
| **Find Your Help** | Provider-run groups with booking CTAs on meets. Your walker's schedule, your trainer's sessions. Community-wrapped service. | Low-Medium — join or book | "Klára's Calm Dog Sessions", "Olga's Walking Group" |
| **Help a Dog** | Shelter dogs available to walk. Institutional accounts (`ShelterProfile`) parallel to UserProfile. Non-ownership entry point: walkers earn institutional credentials at vetted shelters and become community anchors through documented dog-handling. Discover door at `/discover/help-a-dog` (Dogs/Shelters pill split) shipped 2026-06-08. | Low to browse + become a Supporter; vouching at the shelter to walk | "Útulek Liběň", "Pes v nouzi", "Druhá šance" |

All doors lead to the same place: a network of people who know each other and each other's dogs. The booking system exists to protect the friendships that form — clear rates, clear records, no scorekeeping. See [[Open Questions & Assumptions Log]] §14 for the full shelter design.

### The Key Insight

*Good fences make good neighbours.* When neighbours become friends through their dogs, informal care naturally follows. But informal favours are hard to keep balanced. The booking system removes the awkwardness: rates are posted, bookings are tracked, nobody's keeping score.

---

## Dog-First Positioning

Dogs are the gateway, not the destination. Most features start from a dog — how they socialise, what care they need, who they play with. But the real payoff is the network of people and relationships that forms around that shared care: neighbourhood friendships, reliable carers, trusted service providers, and the informal economy of "watch my dog while I'm away" that makes city living with a pet actually workable.

This is deliberate. People wary of "social apps" will happily join something organised around their dog. Users who join "for their dog" and end up making friends, finding a reliable walker, or starting to offer care themselves are the highest-retention users — the social and professional rewards land harder because they weren't sold to them.

This framing welcomes non-owners too. Some users join because they love dogs and want to help, not because they have one. Dog-lovers looking for gig work, hobbyists, small service providers, and shelter walkers — they enter through the community, earn trust the same way anyone does, and offer their services as part of the same fabric. The **shelter-walker ramp** is a particular case worth naming: someone whose entry point is "I want to walk shelter dogs" earns institutional credentials through documented dog-handling at vetted shelters and becomes a community anchor without ever owning a pet — different door, same destination. The platform is a community for dog people. Dog ownership is one way in, not the only one.

---

## Trainer-Led Walks & the Training Value Proposition

> **Draft note — added 2026-05-18 during Demo Narrative V2; to be expanded at that phase's strategic review.** A positioning thread that needs fuller treatment than this placeholder.

The walker-trainer hybrid is Doggo's cold-start engine — 80–90% of Prague's paid dog professionals (see [[Cold-Start Playbook]], [[meetings/po-briefing-2026-05-15]]). Three points to formalize:

- **A trainer's value to owners is teaching, not just exercise.** Dogs spend most of the day home alone; getting them out, social, and well-mannered lifts the dog's quality of life and the owner's ability to communicate with them. Dogs need to learn social, leash, and listening skills — and a good trainer teaches the *owner* as much as the dog.
- **Controlled group walks are the method and the outcome.** A trainer helps an anxious or untrained dog build the skills to enjoy other dogs' company; once ready, the dog belongs to the community. Training is the on-ramp to belonging, not a side service. The pattern Doggo argues against is avoidance — a reactive dog that simply never gets near another dog, until one day it gets too close and there's a clash. *Resolve it, don't avoid it.*
- **The trainer-led public walk is both funnel and mission.** Every walk is demonstration and lead-gen for the trainer's paid services — and it's the trainer doing real, visible vocational work. The platform should let trainers market that.

Expand at the strategic review: how this lands across product surfaces, the landing page, and onboarding. The trainer-led walks playbook is one of two streams (alongside shelter walks) that feed the cold-start engine; both rely on the credentialing-layer thesis ([[Open Questions & Assumptions Log]] §7 — credentialing as deliberate strategic moat) to compose institutional credentials with community-built reputation.

---

## Product Principles

These guide judgment, prevent drift, and align everyone around the same intent.

### 1. Prague First

Doggo is designed for Prague's specific context — cultural expectations, neighbourhood density, how locals use shared spaces. Global patterns are a reference, not a requirement.

### 2. Everyone Starts the Same Way

There is no separate "provider signup" or "provider account" — and no separate "owner signup" either. Everyone goes through the same onboarding. Add a dog if you have one, offer care if you want to, or just participate in the community. Offering care is a dial you turn up from your existing profile — toggle visibility, add services, set constraints. Owners, non-owner carers, and full-time service providers all exist in the same social fabric; the platform blurs the line between "community member who helps" and "service provider" intentionally.

### 3. Real-World Proximity Beats Abstract Matching

Shared places, routines, and repeated encounters create stronger trust than algorithmic similarity. Location and physical context are first-class signals.

### 4. Low-Pressure Participation by Default

Users should be able to explore, observe, and participate without commitment. Actions feel reversible, optional, and safe. No one is pressured into visibility, roles, or transactions they aren't ready for.

### 5. The Product Facilitates — It Does Not Force

Doggo creates opportunities for connection, trust, and help. It does not pressure users into transactions, roles, or visibility. The user controls the pace at every stage.

### 6. Trust is Earned Through Participation, Not Claims

Trust is built through real-world interaction — attending meets, being a reliable presence, helping when asked. Profile claims and self-descriptions are context, not credentials. The platform's job is to make genuine trust signals visible, composing community-built reputation (post-meet reviews, repeat clients, mutual connections) with institutional credentials (shelter vouching, methodology affiliations, professional certifications) so each kind of trust earns its visual weight. See [[Trust & Connection Model]] and [[Open Questions & Assumptions Log]] §7 (credentialing as deliberate moat) for details.

### 7. Community Signals Over Vanity Metrics

Consistency, presence, and familiarity matter more than scores or rankings. No public leaderboards. Trust signals are contextual ("shared 5 morning walks") not numeric ("trust score: 47"). Reviews exist for care transactions, where accountability matters — but community participation is never scored.

### 8. Invisible Infrastructure

The product should feel social, not transactional. Features that feel like "platform mechanics" (points, levels, streaks, gamification) are a signal something has gone wrong. The best version of Doggo feels like your neighbourhood, not an app.

---

## Business Model

Revenue comes from platform-mediated care between people who already trust each other.

### Revenue priority stack

1. **Transaction fee on care arrangements (10–15%)** — the core. Only works because community built the trust first. The platform offers clear records, cancellation handling, care history, and payment without the social awkwardness of paying a friend directly.
2. **Business profiles (freemium directory)** — supplemental. Local pet businesses (groomers, vets, pet shops) get community-embedded profiles. Enhanced listings, not ads.
3. **Premium owner features (later, careful)** — advanced group tools, expanded gallery storage, priority visibility. Community features remain free — no paywalls on core social functionality.

### Why on-platform beats side conversations

People could Venmo each other and skip the platform. But the platform offers:

- **Clear record** — dates, price, pet details, confirmed in writing
- **Cancellation and change handling** — structured beats awkward texts
- **Care history** — "Petra has watched 4 dogs from this group with no issues"
- **Insurance/liability** (eventually) — coverage while in care through Doggo
- **Payment without the awkward** — paying through the app normalises paying a friend

---

## Navigation Structure

### Mobile (bottom tabs + header)

```
Community  |  Discover  |  My Schedule  |  Bookings  |  Profile
```

- **Community** (formerly Home) — MasterDetailShell. Left panel: category tabs (All / Parks / Neighbors / Interest / Care) filter the group list. Right panel: aggregated feed (default) or selected group detail. Posts from connections appear in the "All" feed even if not posted to a group. See [[Groups & Care Model]] for full spec.
- **Discover** — three-door hub: Meets, Groups, Dog Care. Each door links to a sub-page with browse/filter UI. Not a tabbed layout — cards with illustrations.
- **My Schedule** — Upcoming/History toggle with unified timeline of meets + bookings. "What am I committed to?" Sub-pills on Upcoming (All / Meets / Care) filter by item type. **Soft-interest (followed series, group-meets without RSVPs) does NOT live here** — that lives on Discover Meets via the "Meets from your circle" section. Schedule is commitments + past only (2026-05-11 IA refresh).
- **Bookings** — two tabs: My Care (owner bookings) and My Services (provider dashboard). "What care am I managing?"
- **Profile** — your profile, dogs, settings, provider dial.

**Mobile header** (hub pages only):
```
[DOGGO logo]        [Create +] [Notifications 🔔] [Inbox 💬]
```
Create (+) opens the post composer. Notifications bell links to `/notifications`. Inbox icon links to `/inbox`. Header hidden on detail pages, replaced by `DetailHeader` with back button.

### Desktop (sidebar nav)

```
DOGGO logo
Community
Discover
My Schedule
Bookings
Inbox
Notifications
Profile
```

Desktop uses a left sidebar (200px). 7 items — same top-level destinations as mobile bottom nav, plus Inbox and Notifications (which live in the mobile header instead).

### Schedule + Discover IA

Three surfaces split by viewer relationship to events:

| Surface | Job | Soft-interest treatment |
|---|---|---|
| **Home** | Passive feed + occasional discovery nudge | `DiscoveryBanner` interleaved at index 2 when viewer is in groups but under-engaged on RSVPs |
| **Discover Meets** | Active exploration + elevated "your circle" section | **"Meets from your circle"** section at top (followed series + group-member meets), broader marketplace below. Mirrors `/discover/care`'s "Carers in your circle" pattern — same card shape, distinct section header. |
| **My Schedule** | Personal calendar of commitments | Going + booked + completed only. No Interested concept here. |

### Care discovery

Provider search lives within Discover hub > Dog Care card. Also accessible via "Find Care" CTAs on the Community feed and through the Care tab in the Community left panel. Care groups (provider-hosted) also surface in the Community > Care tab. See [[explore-and-care]] for the full flow and [[Groups & Care Model]] for provider group types.

### Detail pages

Detail pages (meet detail, group detail, booking detail, provider profile, user profile, etc.) hide both the bottom nav and mobile header, replacing them with a `DetailHeader` component showing a back button + page title.

---

## Brand Voice & Positioning

Key copy decisions that define how Doggo communicates its value. These emerged from landing page iteration (March 2026) and should be referenced when writing any user-facing copy.

### Tagline
**"Your dog's neighbourhood crew."** — Dog-first, local, warm. Avoids "platform" or "marketplace" language. Positions Doggo as something the dog has, not something the owner subscribes to.

### Emotional hook
**"Does your dog have a community?"** — Question format engages without being answerable with "me!" (unlike "Who's your dog's best friend?"). Creates a gentle gap ("...not really") that the product fills.

### Tone principles
- **Dog-first:** Lead with the dog's experience, not the platform's features. "Dogs are social — they want to get out, play with dogs they know" over "Connect with dog owners near you."
- **Warm, not corporate:** "Crew" over "network." "Familiar faces" over "verified profiles." "Your neighbourhood" over "your area."
- **Show the spectrum:** Three archetype personas (Regular, Connector, Organiser) show there's no "correct" level of engagement. Reinforces the dial-not-switch principle.
- **Care as outcome, not product:** Care is always framed as something that emerges from community ("Care from people you already know") rather than a standalone service.

### Landing page narrative arc
Emotional hook → what you can do → how it works → who it's for → care as outcome → social proof → CTA. See [[landing-page]] for full spec.

---

## Related Docs

- [[User Archetypes]] — who we're building for (ramps, behavioral profiles)
- [[Trust & Connection Model]] — how trust and relationships work
- [[Groups & Care Model]] — group taxonomy, provider tiers, services-as-catalog
- [[Content Visibility Model]] — who sees what content and why
- [[Open Questions & Assumptions Log]] — unresolved strategic questions
