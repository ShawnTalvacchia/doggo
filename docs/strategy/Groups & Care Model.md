---
category: strategy
status: active
last-reviewed: 2026-04-29
tags: [groups, community, providers, care, navigation, demo]
review-trigger: "when touching group features, Community tab, provider groups, care model, or demo planning"
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

## Provider Tiers on Profiles

The "provider dial" lives on profiles, not on groups. Every user starts as an Owner and can progress as their comfort with offering care grows. Progression is always visible, never transactional — copy never frames care as "earning income" or "becoming a provider."

### Lock and Tier — orthogonal axes

Provider Tier is the **action** dial — controls who can act on services (book / inquire / transact). It's independent from the **Lock** setting, which is the visibility dial — controls who can see the profile at all. These two compose:

- **Lock = visibility.** Open profile = visible to anyone. Locked = only Familiar/Connected viewers see expanded content. Privacy axis. Lives on the profile globally; not service-specific.
- **Tier = action.** Owner / Helper / Provider — defines who can act on the user's services. Action axis. Lives on the carer profile.

A Locked + Provider user is unusual but valid — services exist publicly in the model (Provider tier), but the profile they live on is gated (Lock). The platform shows a soft banner advising Open profile for Provider-tier carers since discoverability narrows otherwise. See `features/profiles.md` → Lock and Tier — orthogonal axes for the full composition matrix.

### Three tiers

| Tier | Who can act on services | Appears in Discover > Dog Care? | Commits to |
|---|---|---|---|
| **Owner** (default) | Nobody | No | Nothing. Full community participation. |
| **Helper** | Connected users only | No | Lightweight — a rate, basic availability. Informal, between friends. |
| **Provider** | Anyone (subject to Lock visibility — Locked + Provider narrows to Familiar/Connected viewers) | Yes (when Open) | Published prices, response-time expectation, cancellation policy, intro-session option. |

### Individual Providers and Care groups are both first-class

Neither requires the other.

- **Individual Provider.** Services live on the profile. Appears in Dog Care search on their own merit. No group required. (Tereza's journey: sits for neighbours at a modest rate, no group.)
- **Care group.** A team or small-service-business container. Group appears in Dog Care search and in Groups. Individual member-providers are surfaced through the group — see Care Group Admin Model below. (Pawz: team of trainers. Klára could run her solo practice as a Care group if she wants a community-wrapped channel — but she doesn't have to.)

A Provider can be both — services on their profile *and* membership/admin of a Care group. The two surfaces reinforce each other.

### Copy rules

- **Never:** "Become a Provider." "Start earning." "List your services."
- **Instead:** "Offer to walk for friends?" "Ready to open this to your neighbourhood?"
- The progression is always framed as opening the circle wider — from nobody, to network, to neighbourhood. Commitment scales with reach.
- **Narrative and copy are a living discipline, not a one-time exercise.** Every phase includes a pass on the language of its surfaces. We move toward copy that sounds natural, specific, and un-transactional — and revisit existing copy as the model sharpens.

---

## Care Group Admin Model

A Care group is a community-wrapped container for a team or small service business. The admin curates the group's context; they do not run members' individual practices.

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

**Visual pattern matches the People tab.** Same `PersonRow` rendering — inline Familiar/Pending pill + tier badges on the left, Connect/Message buttons on the right. The only difference between People tab and Members tab is the gating rule (People: attendance-based; Members: always-available); the visual treatment is unified so users learn one pattern across surfaces.

**Trade-off acknowledged:** Members tab IS less restrictive than People tab. The community-first thesis (meets build trust) is preserved at the meet level — meets remain the canonical Familiar trigger via the post-meet review sheet. The Members tab is a secondary path for users who recognise someone from real life or group context.

**Helper / Provider tier badges** propagate from `UserProfile.carerProfile.publicProfile`: Provider tier renders for all viewers; Helper tier only renders when the viewer is Connected to the subject (or is the subject) — privacy rule per `docs/implementation/badges.md`.

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
