---
category: strategy
status: active
last-reviewed: 2026-04-08
tags: [groups, community, providers, care, navigation, demo]
review-trigger: "when touching group features, Community tab, provider groups, care model, or demo planning"
---

# Groups & Care Model

Groups are the connective tissue of Doggo. They're where strangers become regulars, where trust is built through showing up, and where care arrangements emerge from real relationships.

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
| **Rehab** | Specialized niche, referral-driven, premium | Recovery progress + exercise tips + Q&A | Standard |
| **Venue** | Dog-friendly cafés, growing segment | Event hosting + cross-promotion with park groups | Standard |
| **Vet** | Range of practices, high authority | Health tips + seasonal alerts + community Q&A | Standard |

### Configuration Model

Care groups get a set of configuration toggles. Platform suggests defaults based on provider category.

| Option | Description |
|--------|------------|
| **Category** | Training / Walking / Grooming / Boarding / Rehab / Venue / Vet / Other |
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
| Rehab | Optional | Yes | Active | Standard | Fixed |
| Venue | Yes | Optional | Light | Standard | Fixed |
| Vet | Optional | Optional | Active | Standard | Fixed |

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

**To providers creating a Care group:** "Build your client community. A group gives your clients a place to see your work, follow your schedule, and book when they're ready."

**To new users:** "Your dog's community starts here. Groups are where you meet people, find walks, and build trust."

---

## Open Questions

1. **Can community groups have optional service CTAs?** If a Casual Helper in a neighborhood group starts offering sitting, can they attach a service CTA to a meet? Risk: blurring community/commercial line. Benefit: natural progression for the Tereza journey.

2. **Group-to-group crossover meets.** A trainer co-hosting a workshop between their care group and the reactive dog support group — how does this work? Dual-listed? Shared event?

3. **Park group scaling.** What happens when a park group has 500 members? Sub-groups? Or does the meet system handle it naturally?

4. **Neighborhood group seeding.** Can they be auto-suggested based on user density? ("3 others live nearby — start a neighborhood group?")

5. **Care group discovery path.** Care groups appear in the Care tab if you're a member — but how do new users find them? Discover > Groups > Care? Provider profiles? Both?

6. **Cross-category groups.** A trainer running sessions at a specific park — Care or Parks? Care (provider-hosted), but should it surface in Parks search too?

7. **Provider group creation gate.** Should creating a Care group require having services listed first?

---

## Related Docs

- [[Product Vision]] — community-first thesis, business model
- [[Trust & Connection Model]] — connection states, profile visibility
- [[Content Visibility Model]] — who sees what content and why
- [[User Archetypes]] — behavioral profiles, two ramps
- [[profiles]] — profile structure, provider dial
- [[meets]] — meet structure, attendee lists
