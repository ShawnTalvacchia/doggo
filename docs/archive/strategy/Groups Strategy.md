---
category: strategy
status: draft
last-reviewed: 2026-04-09
tags: [groups, communities, strategy, onboarding, providers]
review-trigger: "when touching group features, community types, provider groups, or onboarding flows"
---

# Doggo — Groups Strategy

Groups are the connective tissue of Doggo. They're where strangers become regulars, where trust is built through showing up, and where care arrangements emerge from real relationships. This document defines the group model, explains the three group archetypes, establishes privacy rules for content within groups, and walks through four user journeys that show how different people experience the platform through groups.

Depends on: [[Trust & Connection Model]], [[Content Visibility Model]], [[User Archetypes]], [[profiles]]

---

## Three Ways In

Users don't need to understand group taxonomy. They need to understand what groups do for them. The platform presents three framings, each answering a different motivation:

### Find Your Park

**What it is:** Large, open, auto-generated groups anchored to known dog parks and walking spots. "Letná Dog Walks," "Stromovka Morning Crew," "Ladronka Off-Leash."

**Who it's for:** Everyone, but especially new users and the Curious/Participant stages of Ramp 1. This is the lowest-commitment entry point on the platform.

**How it works:**

- Auto-generated for known parks in each city (seeded at launch, expanded as demand warrants)
- Open by default — anyone can join, anyone can browse content
- No designated admin or owner — any member can post a meet
- Moderation is community-flagged (report → review queue), not admin-gated
- Content is publicly visible (open group rules from Content Visibility Model)

**What it feels like:** A public bulletin board at the park entrance. "Here's who's walking when. Show up if you want."

**Why it matters for launch:** These groups provide instant utility before the platform has critical mass. Even with 10 users, if 3 of them are in "Riegrovy Sady Dog Walks" and one posts a Thursday evening walk, the app has delivered value. Auto-generation means no one has to take the initiative to create the first group.

---

### Find Your People

**What it is:** Smaller, user-created groups built around proximity, shared interests, or both. This is the broadest category and the one where Doggo's community thesis lives.

**Who it's for:** Users moving from Participant to Regular on Ramp 1. People who've shown up to a few park meets and want something more consistent and personal.

**The spectrum within "your people":**

This framing intentionally covers a range, because the underlying group mechanics are the same — it's the organizing principle that varies:

**Neighborhood circles** — "Vinohrady Dog Owners," "Karlín Block 4 Walks." Organized around where you live, not where you go. The use case is hyperlocal mutual aid: a handful of people on nearby streets who walk similar schedules and become each other's default backup. These groups may be tiny (5-15 people) and that's perfect. They're high-trust, high-utility, low-content. Someone in this group might never post a photo — they just need to say "can anyone grab Luna at 3pm tomorrow?" and know someone will see it.

**Interest/breed groups** — "Prague Doodle Owners," "Reactive Dog Support Prague," "Senior Dogs & Slow Walks." Organized around a shared characteristic or need. These attract people across neighborhoods who share a specific concern. They tend to be medium-sized and more discussion-oriented.

**Activity groups** — "Vltava Trail Runners + Dogs," "Weekend Hiking Pack." Organized around a shared activity beyond routine walks. These often have more structured, less frequent meets.

**How it works:**

- User-created, with the creator as initial admin
- Default to private (request or invite to join) — but can be set to open
- Content visible only to members (private group rules from Content Visibility Model)
- Admin can set group to open or private, manage join requests
- Members can post meets, share moments, coordinate

**What it feels like:** A group chat that actually leads to showing up in person. Small enough to know everyone. Trusted enough to ask for help.

**The neighborhood angle is the lead example** in onboarding and empty states because it has the most immediate, tangible value proposition: "Meet the dog owners on your block. Walk together. Help each other out." It bridges directly to the care conversation (more on this below).

---

### Find Your Help

**What it is:** Groups created and run by care providers — dog walkers, trainers, daycares — as a community-wrapped service channel.

**Who it's for:** Professional and Aspiring Providers (Ramp 2, dial mid-to-high) who want to build a client community, and owners looking for ongoing care relationships rather than one-off bookings.

**How it works:**

- Created by a user who has care services listed on their profile
- Group has a "Hosted by" section linking to the provider's profile and services
- Individual meets within the group can have an optional **service attachment**: a CTA that links to the provider's booking flow ("This walk includes pickup/dropoff — book here," "Training session — 3 spots left, reserve yours")
- Can be open (anyone can join and see the schedule) or private (clients only)
- The provider is the admin by default, but can add co-admins (for teams/businesses)

**What it feels like:** Following your dog walker's schedule and community. You see when the next group walk is, who else is coming, photos from last week's outing. Booking is one tap away, embedded in the context where you already see the value.

**Service CTAs within meets:**

Meets in provider groups can include:

- A service description ("Group walk with pickup from Vinohrady, max 6 dogs")
- Pricing (pulled from the provider's listed services)
- A "Book" button that routes to the provider's care booking flow
- Available spots / capacity indicator

This keeps the group feeling like a community with a clear commercial layer, rather than a storefront pretending to be a community. The meet is real — dogs go to the park, photos get shared — the booking is just how you get your dog included.

**Why this matters:** Provider groups solve a real problem for small, local dog care businesses. They have no great way to build an ongoing client community. Social media is noisy. Dedicated booking platforms are transactional. Doggo gives them a space where their service is embedded in a community context — clients see the walks happening, see the dogs having fun, and booking feels natural rather than commercial.

---

## The Friendship-Meets-Contract Problem

One of Doggo's most important strategic insights lives at the intersection of "Find Your People" and "Find Your Help."

When neighbors become friends through their dogs, informal care naturally follows. "Can you grab Max on your way to the park?" "Could Luna stay with you this weekend while I'm away?" This is beautiful and exactly what the platform is designed to enable. But it creates a tension: **informal favors are hard to keep balanced, and the awkwardness of raising that imbalance can poison the friendship.**

One person ends up doing more. The other feels guilty but doesn't know how to address it. Nobody wants to put a price on something that started as kindness. This is a well-documented dynamic in neighborly relationships and it's the #1 reason informal care arrangements fall apart.

**Doggo's answer: the platform normalizes transactional clarity between friends.**

When anyone can list a service with a rate — even a low, "just covering my time" rate — and anyone can book through the app, the platform provides social cover for being clear about expectations. It's not "I'm hiring my neighbor." It's "I'm booking through Doggo because that's how we do things here." The booking system protects the friendship:

- No one's counting favors
- No one feels taken advantage of
- Expectations are explicit (times, duration, needs)
- Payment is handled cleanly
- Both people have a record of what was arranged

**This is a key messaging angle for the product:** "You trust each other more because the arrangement is clear, not less." The pitch isn't "monetize your friendships" — it's "keep your friendships healthy by keeping care arrangements simple."

The neighborhood group is where this story plays out most naturally. You met at the park group. You joined a smaller neighborhood circle. You walk together regularly. When you need someone to watch your dog for the weekend, you don't need to ask a favor — you just book Sarah, who lives two streets over, already knows your dog by name, has her rates posted, and is happy to help. Simple.

---

## Tagging Privacy Within Groups

Groups are shared spaces, but individual privacy still applies. The content visibility model (see [[Content Visibility Model]]) governs what photos you can see. Tagging adds a layer on top of that.

### Rules

**Who can tag whom:**

| Tagger's relationship to tagged person | Can tag? |
|---|---|
| Connected | Yes (sends approval request to tagged person) |
| Familiar (tagger marked tagged as Familiar) | No — one-sided, doesn't grant tagging rights |
| Familiar (tagged marked tagger as Familiar) | Yes (sends approval request) — tagged person trusts tagger |
| Familiar (mutual) | Yes (sends approval request) |
| None | No |

**Who can see tags:**

Tags on a photo are filtered per viewer. You only see tags for people you have visibility access to (per the relationship gate in Content Visibility Model). This means:

- In a group photo, Connected users see each other's tags
- A Locked user's tag is invisible to group members who have no relationship with them
- The photo itself is visible to all group members (context gate), but the identity tags are individually filtered (relationship gate)

**Why this matters:** This prevents tags from being used to surface locked users' identities to people they haven't granted access to. The photo is communal; the identity metadata is personal.

### Example

User A and User B are Connected. User A has marked User C as Familiar. User C is Locked to all.

All three attend a meet in a shared group. User A posts a photo from the meet.

- **User B** sees the photo (context gate: group member). Sees User A's tag (Connected). Does not see User C's tag (no relationship with User C, and User C is Locked).
- **User C** sees the photo (context gate: group member). Sees User A's tag (User C marked User A as Familiar, so has visibility). Does not see User B's tag unless they have a relationship.
- **User A** sees all tags they added (their own photo).

User B cannot add a tag for User C (no relationship). User A can add a tag for User C (Familiar relationship, direction: User C trusts User A), but User C must approve the tag.

---

## Four User Journeys

These journeys illustrate how different archetypes experience the platform through groups. Each journey follows a different person through the same city, showing how the group types serve different needs while the underlying mechanics remain consistent.

### Journey 1: Tereza — The Routine Owner Who Becomes a Neighborhood Anchor

**Archetype:** Routine Owner → Regular → edges toward Connector
**Provider dial:** Zero → barely turned

**Month 1:** Tereza downloads Doggo because she saw a flyer at Riegrovy Sady. She joins the auto-generated "Riegrovy Sady Dog Walks" park group. She sees there's a Thursday evening walk posted. She shows up with her beagle, Franta. Four other people are there. She marks two of them as Familiar afterward.

**Month 2:** She's been to three Thursday walks. She recognizes the regulars. One of them, Marek, sends her a connect request. She accepts. She notices that some of the regulars live in her neighborhood (Vinohrady) and creates a private group: "Vinohrady Evening Walkers." She invites five people she's met at the park. Three join.

**Month 3:** The Vinohrady group has grown to eight people through word of mouth. They walk together most evenings. Tereza doesn't think of herself as a "community leader" — she just posted the first meet and now it's self-sustaining. One evening, Marek mentions he's going away for a weekend and asks if anyone could check on his dog. Tereza says she can. She looks up Marek's profile, sees he doesn't have any listed rates for sitting, and just offers to help as a favor.

**Month 4:** Marek returns the favor when Tereza has a vet appointment. Then another neighbor asks. Tereza starts to realize she's becoming the default dog-sitter on her block. She turns the provider dial slightly — lists dog sitting with a modest rate. Not because she wants to make money, but because **having a rate posted makes it clear and fair for everyone.** She doesn't feel taken advantage of, and her neighbors don't feel like they're imposing.

**What this shows:** The journey from park group → neighborhood group → casual care. The platform didn't push Tereza to become a provider. The social dynamics within a small group naturally led there, and the booking system made it sustainable.

---

### Journey 2: Daniel — The Anxious New Owner Who Finds His Crew

**Archetype:** Occasional-Need Owner → Social Seeker (latent) → Regular
**Provider dial:** Zero (stays there)

**Month 1:** Daniel just adopted a reactive rescue dog, Bára. He's overwhelmed and doesn't know anyone with dogs in Prague. He downloads Doggo and searches for groups. The auto-generated park groups feel too big and unpredictable for a reactive dog. He finds a private group: "Prague Reactive Dog Support" — interest-based, requires approval to join. He requests to join and writes a short note about Bára. He's accepted.

**Month 2:** Daniel lurks in the group for two weeks, reading other members' posts about their experiences. He sees photos from a small meet at a quiet park — four dogs, plenty of space, everyone understanding. He signs up for the next one. It goes well. Bára does okay. He marks two attendees as Familiar.

**Month 3:** Daniel is now attending the group's bi-weekly meets regularly. He's Connected with three members. He starts sharing photos from walks — always to the group, never to his profile (he's Locked and prefers the privacy of the group context). The group feels like a support network. He's learning training techniques from other members. Bára is improving.

**Month 4:** One of his Connected friends in the group, Klára, also happens to be a dog trainer. She runs a service group: "Klára's Calm Dog Sessions." Daniel joins it and books a spot in a small-group park training session through the service CTA on the meet. The booking feels natural because he already knows and trusts Klára from the reactive dog group.

**What this shows:** The journey from interest group → trust → care booking through a provider group. Daniel never used a park group. He never became a provider. His entire experience was built around a specific need (reactive dog support), and the care transaction emerged from a relationship built inside a private group.

---

### Journey 3: Klára — The Trainer Who Builds a Practice Through Community

**Archetype:** Professional Provider (Ramp 2, dial high)
**Engagement ramp:** Regular → Connector

**Month 1:** Klára is a certified dog trainer who's been doing 1-on-1 sessions around Prague. She joins Doggo and creates a service group: "Klára's Calm Dog Sessions." It's open — anyone can join and see the schedule. She posts her first meet: a small-group training session at Stromovka, Saturday morning, 4 spots, 350 Kč per dog. The meet has a service CTA with her booking link and a clear description.

She also joins the auto-generated "Stromovka Dog Walks" park group as a regular member (not a provider context — she's there with her own dog, Eda). She attends the casual walks, meets people, builds connections. She never promotes her services in the park group — she's just a dog owner there.

**Month 2:** Three people from the Stromovka park group have Connected with Klára. When they visit her profile, they see her training services listed. Two of them join her service group and book sessions. One of them is Daniel (from Journey 2), who found her through the reactive dog support group.

**Month 3:** Klára's service group has 15 members. She runs two sessions a week. Members share photos from the training meets — dogs practicing recall, doing exercises in the park. The photos serve as social proof: new visitors to the group see real dogs in real sessions and can book immediately. Klára also starts co-hosting a monthly "Reactive Dog Workshop" meet with the Prague Reactive Dog Support group — a crossover event that brings her expertise to an existing community.

**Month 4:** Klára turns the provider dial higher — she adds dog walking as a service, hires an assistant, and creates a second group for her walking clients. Her service groups have become her primary client acquisition channel, but they don't feel like advertising because the community activity is real. Clients stay because they like the group, not just the service.

**What this shows:** How a professional provider uses groups as a community-wrapped business channel. The service group has real meets, real photos, real community — the booking CTAs are just the commercial layer on top. Klára also participates in park groups and interest groups as a regular owner, and the organic connections she builds there feed her service practice.

---

### Journey 4: Tomáš — The Newcomer Who Just Needs to Find His Bearings

**Archetype:** Social Seeker (primary) + Occasional-Need Owner
**Provider dial:** Zero

**Month 1:** Tomáš just moved to Prague from Brno with his labrador, Hugo. He doesn't know the neighborhoods, the parks, or anyone with a dog. He downloads Doggo and sees a map of auto-generated park groups near his new apartment in Karlín. He joins "Karlín Walks" and "Vítkov Park Dogs." He browses upcoming meets — there's one tomorrow morning at Vítkov. He goes.

**Month 2:** Tomáš has been to six meets across two park groups. He's used the Discover tab to find a vet (care search) and a groomer. He's starting to recognize regulars at Vítkov. He gets a connection request from one of them, Petra, and accepts. Petra invites him to a small private group: "Karlín Dog Neighbors." He joins.

**Month 3:** The Karlín Dog Neighbors group has become Tomáš's anchor. He knows everyone. Hugo has regular playmates. When Tomáš needs to fly back to Brno for a family emergency, he posts in the group: "Can anyone take Hugo for two days?" Two people respond within an hour. He books one of them — Petra, who has sitting listed at a casual rate — through the app. Hugo stays with someone who already knows him, and the booking is clean and clear.

**Month 4:** Tomáš feels settled. He's a Regular in two park groups, an active member of the neighborhood group, and Connected with a dozen people. He's never posted a photo to his profile. He's never turned the provider dial. His entire relationship with Doggo is: find walks, show up, know people, get help when he needs it. That's a complete, successful experience.

**What this shows:** The journey from "brand new to a city" to "embedded in a local network" through groups alone. Park groups for discovery, neighborhood group for belonging, care booking for emergencies. Tomáš uses Doggo purely as a utility and coordination tool — no content creation, no provider aspirations — and gets enormous value from it.

---

## Empty States & User-Facing Messaging

### Onboarding / Landing Page

Frame the three group types as answers to user motivations, not technical categories:

**"Find your park"** — "See who's walking at parks near you. Join a walk, or start one — it's as simple as picking a time."

**"Find your people"** — "Meet the dog owners in your neighborhood. Start a small group for your block, your breed, or your morning route. Walk together. Help each other out."

**"Find your help"** — "Local trainers and walkers run groups you can join. See their schedule, meet the dogs, and book when you're ready."

### Empty State: No Groups Near You

*Primary CTA:* "Start a walk at your nearest park" — auto-suggests the closest known park, pre-fills a group name, asks for a day/time for the first meet. Framed as starting a walk, not creating a group.

*Secondary CTA:* "Start a neighborhood group" — asks for your street/block, creates a small private group with a suggested name ("Karlín Dog Neighbors"). Framed as finding your neighbors, not building a community.

### Empty State: Group With No Meets

"No walks scheduled yet. Be the first — pick a time and others will see it." One-tap meet creation with the group's park pre-filled as location.

### Empty State: Group With No Photos

"Photos from walks show up here. After your next meet, share a moment and it'll appear in the group." This only shows after the group has had at least one meet — no pressure to post content before there's anything to post about.

---

## Group Properties Summary

> **Note:** This table reflects the expanded four-type taxonomy shipped in Phase 30. See [[Community & Provider Groups Evolution]] for full details on the Care type and provider configuration.

| Property | Park | Neighbor | Interest | Care |
|---|---|---|---|---|
| Created by | Auto-generated | Any user | Any user | User with care services listed |
| Default visibility | Open | Private | Open or Private | Open or Private (provider chooses) |
| Admin | None (community-moderated) | Creator + appointed | Creator + appointed | Provider + appointed |
| Who can post meets | Any member | Any member | Any member | Provider (and co-admins) |
| Service CTAs on meets | No | No | No | Yes (linked to provider's services) |
| "Hosted by" section | No | No | No | Yes (provider profile link) |
| Content visibility | Public | Members only | Follows visibility setting | Follows visibility setting |
| Typical size | Large (50+) | Small (5–20) | Medium (10–100+) | Medium (10–50) |
| Primary value | Discovery, coordination | Mutual aid, trust | Shared interest, knowledge | Service delivery, client community |
| Maps to user archetype | All (entry point) | Routine Owner, Social Seeker | Social Seeker, Occasional-Need | Professional/Aspiring Provider |

---

## Open Questions

1. **Can community groups have optional service CTAs?** If a Casual Helper in a neighborhood group starts offering sitting, should they be able to attach a service CTA to a meet they organize? Or should that be reserved for dedicated service groups? (Risk: blurring the community/commercial line in peer groups. Benefit: natural progression for the Tereza journey.)

2. **Group-to-group crossover meets.** Klára's reactive dog workshop co-hosted between her service group and the reactive dog support group — how does this work mechanically? Dual-listed meet? Shared event? Needs design thinking.

3. **Park group scaling.** What happens when "Stromovka Dog Walks" has 500 members? Does it need sub-groups (time-based, area-based)? Or does the meet system handle it naturally (people join specific walks, not the group as a whole)?

4. **Neighborhood group seeding.** Park groups are auto-generated from known parks. Can neighborhood groups be auto-suggested based on user density? ("3 other Doggo users live in your area — start a neighborhood group?")

---

---

## Evolution Notice (April 2026)

This document remains the foundation for group mechanics, privacy rules, tagging, and user journeys. However, the group taxonomy and navigation structure are being evolved in [[Community & Provider Groups Evolution]]. Key changes:

- **Home → Community.** The Home tab is being renamed to Community, with groups as the organizing principle.
- **"Find Your People" splits into Neighbors + Interest.** Neighborhood mutual-aid groups and interest/breed/activity groups serve different motivations and are now separate categories.
- **"Find Your Help" becomes Care** with expanded provider type mapping based on Prague market research (trainers, walkers, groomers, boarding, rehab, venues, vets).
- **Community tab uses MasterDetailShell** with category tabs (All / Parks / Neighbors / Interest / Care) filtering the left panel list and the right panel feed.

See [[Community & Provider Groups Evolution]] for the full updated strategy.

---

## Related Docs

- [[Community & Provider Groups Evolution]] — expanded group taxonomy, provider mapping, Community tab
- [[Content Visibility Model]] — who sees what content and why
- [[Trust & Connection Model]] — connection states, profile visibility
- [[User Archetypes]] — behavioral profiles, two ramps
- [[Product Vision]] — community-first thesis, business model
- [[profiles]] — profile structure, provider dial
- [[meets]] — meet structure, attendee lists
