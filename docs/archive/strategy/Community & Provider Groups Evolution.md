---
category: strategy
status: draft
last-reviewed: 2026-04-08
tags: [groups, community, providers, navigation, demo, dummy-data]
review-trigger: "when touching group features, Community tab, provider groups, or demo planning"
---

# Community & Provider Groups Evolution

This document expands the original Groups Strategy based on Prague market research (April 2026) and evolving product direction. It reframes the Home tab as "Community," introduces subcategory tabs, maps professional provider types to group archetypes, defines configuration options per group type, and scaffolds the demo dummy data plan.

Depends on: [[Groups Strategy]], [[Product Vision]], [[User Archetypes]], [[Trust & Connection Model]], [[Content Visibility Model]]

---

## Strategic Shift

The original Groups Strategy defined three archetypes: Park, People, Help. This was sound, but two insights have emerged:

1. **"People" groups serve two very different motivations.** Neighborhood mutual-aid circles ("Vinohrady Evening Walkers") and interest-based communities ("Prague Reactive Dog Support") attract different users for different reasons. Splitting them makes discovery clearer and helps users find what they're actually looking for.

2. **Professional providers aren't one thing.** Prague market research revealed that dog trainers, walkers, groomers, boarding facilities, rehab clinics, and dog-friendly cafés all have different relationships with "community." A solo trainer thrives running a group with events and discussion. A grooming salon needs a showcase with before/after photos and booking. A boarding facility needs a transparency channel — daily updates for anxious owners. The "Help" archetype needs to flex for all of these.

Additionally: **Home is being renamed to Community.** Groups are the organizing principle of the platform, and the tab name should say so directly. The feed (posts from connections and groups) lives within Community as the default view, not as a separate concept.

---

## Community Tab Structure

### MasterDetailShell Pattern

The Community tab follows the same left-panel list / right-panel detail pattern used throughout the app.

**Left panel:** Tabs across the top filter the group list below.
**Right panel:** Shows either the aggregated feed (default, no group selected) or the selected group's detail page.

### Tabs

| Tab | Left panel shows | Right panel default (nothing selected) |
|-----|-----------------|---------------------------------------|
| **All** | All groups you belong to, sorted by recent activity | Feed: posts from all your groups + connection posts |
| **Parks** | Park groups near you (auto-generated) | Feed: filtered to park group content |
| **Neighbors** | Neighborhood/local groups you belong to | Feed: filtered to neighbor group content |
| **Interest** | Interest/breed/activity groups you belong to | Feed: filtered to interest group content |
| **Care** | Provider/service groups you follow or belong to | Feed: filtered to care group content |

**Selecting a group** from the left panel always replaces the right panel with that group's detail view, regardless of which tab is active.

**Group detail view** has its own internal tabs (Discussion, Events, Members, Photos, Services — varies by group type). This is the existing group detail pattern, extended for new group types.

### Sorting in "All"

Groups sorted by a blend of:
- Most recent activity (post, event, new member)
- Your own engagement frequency (groups you interact with most float up)
- Pinned groups (user can pin favorites to top)

### Empty State (Community Tab)

When a user has no groups, the Community tab empty state explains the concept and directs to action:

> **Your dog's community starts here.**
>
> Groups are where you meet people, find walks, and build the kind of trust that makes caring for each other's dogs easy.
>
> **Start your own** — gather a few neighbors or friends to coordinate walks and help each other out.
>
> **Or explore what's nearby** — park groups, local communities, and care providers are all in Discover.
>
> [Create a Group] [Explore →]

The CTA to Discover leverages the existing Discover page (Groups door) rather than duplicating browse functionality.

---

## Expanded Group Taxonomy

### Parks (formerly "Find Your Park")

No changes from original Groups Strategy. Auto-generated, open, no admin, community-moderated. The lowest-friction entry point.

**User-facing language:** "Park groups" or just "Parks"
**Tagline:** "See who's at your park."

### Neighbors (split from "Find Your People")

Small, hyperlocal groups organized around where you live. The primary use case is mutual aid: a handful of nearby people who walk similar schedules and become each other's backup.

**User-facing language:** "Neighborhood groups" or "Neighbors"
**Tagline:** "Meet the dog owners on your block."

**Key characteristics:**
- User-created, creator is admin
- Default private (invite/request to join)
- Typically small (5–20 people)
- High trust, high utility, low content volume
- The natural birthplace of casual care arrangements (the Tereza journey)

**What makes this different from Interest:** The organizing principle is proximity, not shared characteristic. You don't need to have anything in common except living nearby and having dogs.

### Interest (split from "Find Your People")

Groups organized around a shared characteristic, activity, or need that crosses neighborhood boundaries.

**User-facing language:** "Interest groups" or "Communities"
**Tagline:** "Find your people."

**Subtypes:**
- **Breed/type groups** — "Prague Doodle Owners," "Senior Dogs & Slow Walks"
- **Need-based groups** — "Reactive Dog Support Prague," "First-Time Owners"
- **Activity groups** — "Vltava Trail Runners + Dogs," "Weekend Hiking Pack," "Dog Agility Prague"

**Key characteristics:**
- User-created, creator is admin
- Can be open or private (creator chooses)
- Medium-sized (10–100+)
- More discussion-oriented than neighborhood groups
- Often where specialist knowledge is shared

### Care (evolved from "Find Your Help")

Groups created by care providers — professionals, businesses, or community members who offer dog-related services. This is where the Prague research drives the most significant evolution.

**User-facing language:** "Care groups" or "Care providers"
**Tagline:** "Care from people you can see in action."

---

## Provider Types & How They Use Groups

Prague market research identified distinct provider categories, each with a different relationship to community. Rather than forcing all providers into one group template, the Care group type supports different configurations.

### Dog Trainers

**Market context:** Mostly solo freelancers in Prague. ~800 CZK/session. No dominant aggregation platform — rely on Google, word-of-mouth, personal websites. Strong personal brand dependency.

**How they use a group:**
- Schedule of upcoming classes/sessions (group events with booking CTAs)
- Discussion: training tips, Q&A, member progress
- Photo/video gallery: dogs in training, success stories
- The group IS their community and primary client channel

**Group configuration:**
- Events with booking CTAs: Yes
- Discussion: Active
- Gallery: Active (social proof)
- Service listings visible: Yes
- "Hosted by" provider badge: Yes

**Why Doggo works for them:** Trainers lack discovery and trust-building channels. A Doggo group gives them both — potential clients see real interactions, real dogs, real results before booking. The community IS the marketing.

**Example group:** "Klára's Calm Dog Sessions" — open group, weekly park training sessions, puppy socialization meets, behavioral Q&A discussion

### Dog Walkers

**Market context:** Mix of freelancers and small services. Most digitized segment (Hlídačky.cz, Pawz). ~755 CZK/day. GPS tracking and photo updates already expected by some platforms.

**How they use a group:**
- Daily/weekly photo updates: "Here's today's pack at Stromovka"
- Schedule: which days, which routes, which dogs
- Capacity signals: "2 spots open for Thursday afternoon"
- Lighter discussion (more broadcast than conversation)

**Group configuration:**
- Events with booking CTAs: Yes (recurring walks)
- Discussion: Light (mostly walker posting updates)
- Gallery: Very active (daily photos = trust + transparency)
- Service listings visible: Yes
- "Hosted by" provider badge: Yes

**Why Doggo works for them:** Walkers on pure marketplaces are interchangeable. A Doggo group lets clients see the walking pack, the routes, the vibe — building loyalty that pure booking platforms can't match.

**Example group:** "Pawel's Prague Pack" — open group, daily walk photos, weekly schedule, max 6 dogs per walk

### Grooming Salons

**Market context:** 43+ salons in Prague, mostly owner-operated brick-and-mortar. Some chain attempts (Dogs Club). Portfolio-driven — before/after photos matter.

**How they use a group:**
- Before/after photo gallery (the primary content)
- Availability/booking for appointments
- Seasonal tips, coat care advice
- Less event-driven, more showcase-driven

**Group configuration:**
- Events with booking CTAs: Optional (could do "grooming day" events)
- Discussion: Light
- Gallery: Primary feature (portfolio showcase)
- Service listings visible: Yes (menu of services + pricing)
- "Hosted by" provider badge: Yes
- Location: Fixed (salon address prominent)

**Why Doggo works for them:** Groomers currently rely on Google reviews and Instagram. A Doggo group embeds them in the local dog community — their portfolio lives alongside the parks and neighborhoods their clients already use.

**Example group:** "Dognut Grooming Prague" — open group, weekly before/after posts, online booking link, coat care tips

### Boarding & Daycare

**Market context:** 58+ facilities in Prague. Mix of purpose-built and home-based. 250–1,400 CZK/day. Trust is the #1 barrier — owners are anxious leaving their dog.

**How they use a group:**
- Daily photo/video updates while dogs are in care (THE killer feature)
- Facility showcase: spaces, play areas, routines
- Reviews and testimonials from members
- Booking for stays and daycare spots

**Group configuration:**
- Events with booking CTAs: Yes (daycare days, holiday boarding)
- Discussion: Moderate (owners asking questions, sharing experiences)
- Gallery: Very active (daily updates = anxiety reduction)
- Service listings visible: Yes
- "Hosted by" provider badge: Yes
- Location: Fixed (facility address)
- Capacity indicators: Yes (spots available)

**Why Doggo works for them:** The daily photo update transforms boarding from "I hope my dog is okay" to "I can see my dog playing right now." This is the single most powerful trust mechanism for boarding facilities, and a community group is the natural home for it.

**Example group:** "VIP Pets Dog Hotel" — members-only (clients), daily photo updates, booking for holiday stays, virtual tour gallery

### Canine Rehabilitation & Physiotherapy

**Market context:** Specialized niche. PhysioDOG is the standout in Prague. Referral-driven, premium pricing. High expertise, high trust requirements.

**How they use a group:**
- Recovery progress stories (with owner permission)
- Exercise tips and home care guidance
- Educational content about injury prevention
- Appointment booking

**Group configuration:**
- Events with booking CTAs: Optional (workshops, group exercises)
- Discussion: Active (Q&A, progress sharing)
- Gallery: Active (progress documentation, facility)
- Service listings visible: Yes
- "Hosted by" provider badge: Yes
- Specialist credentials: Visible (certifications matter here)

**Why Doggo works for them:** Rehab is relationship-intensive and referral-driven. A group becomes a long-term support community for clients — they don't just book a session, they join a recovery community. Vets can refer owners to the group, not just a phone number.

**Example group:** "PhysioDOG Recovery Community" — private group, progress stories, exercise resources, specialist Q&A

### Dog-Friendly Cafés & Venues

**Market context:** Prague is among Europe's most pet-friendly capitals. Growing number of dog-welcome cafés. "Better City for Pets" initiative expanding.

**How they use a group:**
- Event hosting: "Bring your dog Saturday brunch," "Puppy social hour"
- Dog-friendly menu/treats announcements
- Venue for park group meetups (post-walk coffee)
- Cross-promotion with other local groups

**Group configuration:**
- Events with booking CTAs: Optional (reservations for events)
- Discussion: Light
- Gallery: Moderate (event photos, dogs at the café)
- Service listings: Light (it's a venue, not a dog service per se)
- "Hosted by" badge: Yes (business badge rather than provider badge)
- Location: Fixed

**Why Doggo works for them:** Dog-friendly venues want foot traffic from dog owners. Being embedded in the local Doggo community means park groups naturally spill into their café. The group is a low-effort marketing channel that drives real visits.

**Example group:** "Café Letka Dog Corner" — open group, weekly puppy social hour, dog treat menu, event photos

### Vet Clinics

**Market context:** Range from large 24/7 operations to small practices. High authority, referral-important. Not traditionally "community" oriented.

**How they use a group:**
- Health tips, seasonal alerts (tick season, heat warnings)
- Q&A / ask-a-vet (light, not replacing consultations)
- Vaccination reminders, wellness programs
- Community health education

**Group configuration:**
- Events with booking CTAs: Optional (vaccination drives, wellness checks)
- Discussion: Moderate (Q&A, health tips)
- Gallery: Light
- Service listings visible: Optional
- "Hosted by" badge: Yes (clinic badge)
- Authority/credential signals: High

**Why Doggo works for them:** Vets are trusted authorities. A Doggo group lets them serve that role in the community — health tips, seasonal alerts, Q&A. It builds loyalty and positions them as the neighborhood vet, not just a clinic listing.

**Example group:** "PremiumVet Prague Community" — open group, monthly health tips, seasonal alerts, vaccination event scheduling

---

## Group Configuration Model

Rather than hardcoding behavior per provider type, Care groups get a set of configuration toggles that providers set during creation. The platform can suggest defaults based on the provider's service category.

### Configuration Options

| Option | Description | Who sets it |
|--------|------------|-------------|
| **Category** | Training, Walking, Grooming, Boarding, Rehab, Venue, Vet, Other | Provider (during creation) |
| **Visibility** | Open / Private (request to join) | Provider |
| **Events enabled** | Can the group host events/meets? | Provider (default: yes) |
| **Booking CTAs on events** | Can events link to provider's booking flow? | Provider (default: yes for Care groups) |
| **Discussion enabled** | Is there a discussion/post feed? | Provider (default: yes) |
| **Service listings visible** | Show provider's service menu in the group? | Provider (default: yes) |
| **Location** | Fixed address / Area-based / Mobile | Provider |
| **Capacity indicators** | Show available spots on events/services? | Provider |
| **Gallery mode** | Standard / Portfolio (before-after layout) / Updates (chronological, date-grouped) | Provider |
| **"Hosted by" badge** | Links to provider profile | Automatic for Care groups |
| **Co-admins** | Additional admins (for teams/businesses) | Provider |

### Suggested Defaults by Category

| Category | Visibility | Events | Booking | Discussion | Gallery mode | Location |
|----------|-----------|--------|---------|------------|-------------|----------|
| Training | Open | Yes | Yes | Active | Standard | Mobile |
| Walking | Open | Yes | Yes | Light | Updates | Mobile |
| Grooming | Open | Optional | Yes | Light | Portfolio | Fixed |
| Boarding | Private | Yes | Yes | Active | Updates | Fixed |
| Rehab | Private | Optional | Yes | Active | Standard | Fixed |
| Venue | Open | Yes | Optional | Light | Standard | Fixed |
| Vet | Open | Optional | Optional | Active | Standard | Fixed |

---

## Language & Presentation

### How we talk about groups to users

**Never use the word "archetype" or "taxonomy."** Users see groups, not categories.

| Internal term | User-facing language | Where it appears |
|--------------|---------------------|-----------------|
| Park group | "Park group" or just the park name | Tab label: "Parks" |
| Neighbor group | "Neighborhood group" | Tab label: "Neighbors" |
| Interest group | "Community" or the group's topic | Tab label: "Interest" |
| Care group | Provider/business name | Tab label: "Care" |
| Community tab | "Community" | Bottom nav / sidebar |

### How we talk about groups to providers

Providers creating a Care group see language like:

> **Build your client community.**
> A group gives your clients a place to see your work, follow your schedule, and book when they're ready. It's not a listing — it's your community.

Not: "Create a business profile" or "Set up your storefront."

### How we explain groups to new users

The Community tab empty state (above) covers this. Additionally, the Discover > Groups page should present the categories as questions:

- **Near a park?** → Parks tab / browse park groups
- **Want to know your neighbors?** → Neighbors tab / create a neighborhood group
- **Looking for your people?** → Interest tab / browse interest groups
- **Need care for your dog?** → Care tab / browse care providers

---

## Impact on Existing Strategy Docs

This document introduces changes that affect:

| Doc | What changes |
|-----|-------------|
| **Product Vision** | Nav: "Home" → "Community" in both mobile and desktop nav |
| **Groups Strategy** | "Find Your People" splits into Neighbors + Interest. "Find Your Help" becomes "Care" with expanded provider type mapping. Group Properties Summary table needs updating. |
| ~~**MVP Scope Boundaries**~~ | Archived (April 2026). Business profiles partially addressed by Care groups. |
| **Content Visibility Model** | No structural changes — the two-gate model still applies. Care groups follow the same open/private rules. |
| **User Archetypes** | No changes to archetypes themselves, but the Professional Provider archetype now has clearer group tooling mapped to their needs. |

---

## Demo Planning: User Types & Dummy Data Scaffold

This section is a living scaffold. It will grow as we flesh out the demo.

### Demo Entry Page Concept

A simple page with a short header/subheader giving context, then links to enter the app as different user types:

1. **Landing page** — the public marketing page
2. **New user** — empty state, onboarding, first-time experience
3. **Active community member** — the Tereza type: in park groups, a neighborhood group, connected with regulars, no provider activity
4. **Solo dog trainer** — the Klára type: runs a training group, participates in park groups as owner, has bookings
5. **Professional walker** — runs a walking pack group, daily updates, recurring bookings
6. **Anxious new owner** — the Daniel type: in a reactive dog support group, few connections, exploring
7. **Newcomer to Prague** — the Tomáš type: just joined, exploring park groups, building first connections

### Group Inventory for Demo

Each demo user type should have groups visible that tell a coherent story.

**Park Groups (auto-generated, seeded):**
- Riegrovy Sady Dog Walks
- Stromovka Morning Crew
- Letná Dog Walks
- Ladronka Off-Leash
- Vítkov Park Dogs
- Karlín Walks
- Havlíčkovy Sady Evening Pack

**Neighborhood Groups:**
- Vinohrady Evening Walkers (Tereza's group, ~12 members)
- Karlín Dog Neighbors (~8 members)
- Žižkov Block Walks (~6 members)
- Dejvice Morning Pack (~10 members)

**Interest Groups:**
- Prague Reactive Dog Support (~45 members, private)
- Prague Doodle Owners (~30 members, open)
- Senior Dogs & Slow Walks Prague (~20 members, open)
- Vltava Trail Runners + Dogs (~25 members, open)
- Puppy Parents Prague (~60 members, open)
- Dog Agility Prague (~35 members, open)

**Care Groups:**
- Klára's Calm Dog Sessions (trainer, open, ~25 members)
- Pawel's Prague Pack (walker, open, ~15 client members)
- Dognut Grooming Prague (groomer, open, ~40 followers)
- Happy Tails Boarding (boarding, private/clients, ~30 members)
- PhysioDOG Recovery Community (rehab, private, ~20 members)
- Café Letka Dog Corner (venue, open, ~50 members)
- PremiumVet Prague Community (vet, open, ~80 members)

### Dummy Data Dimensions (to flesh out later)

For each demo user, we'll eventually need:
- Profile details (name, dog(s), neighborhood, bio)
- Connection list (who they know, connection state)
- Group memberships
- Recent activity (posts, event attendance, photos)
- Booking history (if applicable)
- Provider details (if applicable: services, rates, reviews)

For each group, we'll eventually need:
- Member list with roles
- Recent posts/discussion
- Upcoming and past events
- Photo gallery content
- Service listings (Care groups)

This section will grow as we plan each demo scenario in detail.

---

## Open Questions

1. **Tab count on mobile.** Five tabs (All / Parks / Neighbors / Interest / Care) may be tight on small screens. Consider: collapsible tabs, horizontal scroll, or combining Neighbors + Interest back into "People" on mobile only?

2. **"All" tab sorting.** Recent activity is the obvious default, but does "your engagement frequency" create filter bubbles? Should less-active groups occasionally surface to prevent abandonment?

3. **Care group discovery.** Care groups appear in the Care tab if you're already a member — but how do new users find them? Through Discover > Groups > Care filter? Through provider profiles? Both?

4. **Can a user's group change category?** A neighborhood group that starts offering dog-sitting — does it stay in Neighbors or shift to Care? Probably stays in Neighbors (it's not a provider group), but the line could blur.

5. **Cross-category groups.** A trainer who runs sessions at a specific park — is their group in Care or in Parks? Care (it's provider-hosted), but should it surface in Parks search too?

6. **Provider group creation flow.** Should creating a Care group require having services listed first? The current Groups Strategy says "Created by a user who has care services listed on their profile." Is that still the right gate?

---

## Related Docs

- [[Groups Strategy]] — original three-archetype model (being evolved by this doc)
- [[Product Vision]] — product strategy, nav structure (being updated)
- [[User Archetypes]] — behavioral profiles (unchanged)
- [[Trust & Connection Model]] — connection states (unchanged)
- [[Content Visibility Model]] — visibility rules (unchanged, still applies)
- ~~[[MVP Scope Boundaries]]~~ — archived April 2026, moved to `docs/archive/`
