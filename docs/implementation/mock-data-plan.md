---
category: implementation
status: draft
last-reviewed: 2026-04-05
tags: [mock-data, demo, prototype, data-model]
review-trigger: "before creating or modifying mock data files"
---

# Mock Data Plan — Demo-Quality Dataset

This document defines the plan for building a rich, Prague-authentic mock data system that brings Doggo's demo to life. The goal: anyone clicking through the prototype should feel the "neighbourhood crew" energy — real people, real dogs, real places, real interactions.

**Approach:** Mock data only (no Supabase schema changes). Four journey users as the narrative spine, plus a supporting cast that populates their world.

Depends on: [[Groups Strategy]], [[Content Visibility Model]], [[Trust & Connection Model]], [[User Archetypes]]

---

## Current State: What Exists

| Entity | Count | Quality | Notes |
|--------|-------|---------|-------|
| Primary user (Shawn) | 1 | Good | Full profile, 2 dogs, carer profile, connections |
| Providers | 10 | Good | Full profiles in Supabase seed + mockData |
| Connections | 7 | Decent | Mix of states, but small network |
| Meets | 6 | Good | 4 types, real parks, but few |
| Groups | 14 | Decent | 5 community, 4 journey stubs, 5 park. Thin membership. |
| Bookings | 5 | Good | Full lifecycle examples |
| Conversations | 5 | Good | Natural booking inquiry flow |
| Posts | 10 | Decent | Personal + community, but limited |
| Reviews | 1 | Stub | Needs many more |
| Notifications | 4 | Stub | Needs more variety |

**Key problems:**
1. Only one "real" user (Shawn). Demo can't show the platform from other perspectives.
2. Groups have 2-4 members each. Park groups should feel busy.
3. No meet attendance history — can't show trust signals like "attended 5 meets together."
4. Journey users (Tereza, Daniel, Klára, Tomáš) exist as group stubs but have no profiles, dogs, or interaction history.
5. Inconsistencies: Nikola booking marked unpaid but notification says "confirmed." Dogs mentioned in conversations (Mochi, Pepper, Bruno, Molly) have no profiles.

---

## Target State: The Cast

### The Four Journey Users

These are the demo's storytelling backbone. Each has a full profile, dog(s), group memberships, connections, and interaction history that matches their journey in the strategy docs.

#### Tereza Nováková
- **Archetype:** Routine Owner → Connector
- **Location:** Prague 2, Vinohrady (near Riegrovy sady)
- **Dog:** Franta (Beagle, male, 5 years, moderate energy, friendly)
- **Provider dial:** Barely turned — dog sitting, 150 Kč/visit, connected-only
- **Groups:** Riegrovy Sady Dog Walks (park), Vinohrady Evening Walkers (creator/admin)
- **Key connections:** Marek (connected), Jana (connected), Shawn (familiar), 2-3 neighborhood regulars
- **Story beats in data:**
  - 8+ meets attended at Riegrovy sady (trust signal depth)
  - Created Vinohrady Evening Walkers in month 2
  - One completed booking as carer (watched Marek's dog)
  - Posts: group photos from walks, one personal post about Franta
- **Profile visibility:** Open

#### Daniel Procházka
- **Archetype:** Occasional-Need Owner → Regular
- **Location:** Prague 5, Smíchov
- **Dog:** Bára (mixed breed rescue, female, 3 years, moderate energy, reactive/nervous with new dogs)
- **Provider dial:** Zero
- **Groups:** Prague Reactive Dog Support (member), Klára's Calm Dog Sessions (member)
- **Key connections:** Klára (connected), 2 reactive dog group members (connected), 1 (familiar)
- **Story beats in data:**
  - Lurked in reactive dog group for 2 weeks (joined Jan, first meet attendance late Jan)
  - 4 meets attended in reactive dog group (small, calm ones)
  - 1 booking: training session with Klára
  - Posts: only to reactive dog group (never personal — he's Locked)
  - No park group membership
- **Profile visibility:** Locked

#### Klára Horáčková
- **Archetype:** Professional Provider
- **Location:** Prague 7, Holešovice (near Stromovka)
- **Dog:** Eda (Border Collie, male, 6 years, high energy, extremely well-trained)
- **Provider dial:** High — certified trainer, group sessions + 1-on-1
- **Services:** Group training (350 Kč/session), 1-on-1 training (600 Kč/hour), dog walking (300 Kč/walk)
- **Groups:** Klára's Calm Dog Sessions (creator/admin, service group), Stromovka Dog Walks (park, regular member), Prague Reactive Dog Support (member)
- **Key connections:** Daniel (connected), 4-5 service group clients (connected), Stromovka park regulars (mixed)
- **Story beats in data:**
  - Service group has 15 members, 2 sessions/week
  - Meets in service group have booking CTAs (350 Kč, 4 spots)
  - Also attends Stromovka park walks as regular owner (no provider hat)
  - Co-hosted 1 reactive dog workshop with Daniel's support group
  - Reviews: 6+ reviews on her training sessions
  - Posts: training session photos (social proof), personal Eda photos
- **Profile visibility:** Open

#### Tomáš Kovář
- **Archetype:** Social Seeker → Regular
- **Location:** Prague 8, Karlín
- **Dog:** Hugo (Labrador, male, 2 years, very high energy, friendly with everyone)
- **Provider dial:** Zero
- **Groups:** Karlín Walks (park), Vítkov Park Dogs (park), Karlín Dog Neighbors (member)
- **Key connections:** Petra (connected — his go-to sitter), 3-4 Karlín regulars (connected/familiar)
- **Story beats in data:**
  - Joined 2 months ago (newer user)
  - 6 meets attended across 2 park groups
  - 1 emergency booking: Petra watched Hugo for 2 days
  - Never posted a photo to his profile
  - Posts: none personal, minimal group interaction
  - Pure utility user
- **Profile visibility:** Locked

---

### Supporting Cast (15-20 characters)

These populate the groups, attend meets, and create the feeling of a living community. Each needs: name, neighborhood, dog(s), 1-2 group memberships, and a connection state with at least one journey user.

#### Vinohrady / Riegrovy Sady Cluster
| Name | Dog(s) | Groups | Role in story |
|------|--------|--------|---------------|
| **Marek Dvořák** | Benny (Cocker Spaniel) | Riegrovy Sady DW, Vinohrady Evening Walkers | Tereza's first connection. She watched his dog. |
| **Lucie Černá** | Pepík (Dachshund) | Riegrovy Sady DW, Vinohrady Evening Walkers | Thursday morning regular. Connected with Tereza. |
| **Jakub Šťastný** | Aron (German Shepherd) | Riegrovy Sady DW | Casual attendee. Familiar with Tereza, no deeper connection. |
| **Zuzana Králová** | Mia (Miniature Poodle) | Vinohrady Evening Walkers | Newest member. Invited by Lucie. Pending with Tereza. |

#### Karlín / Žižkov Cluster
| Name | Dog(s) | Groups | Role in story |
|------|--------|--------|---------------|
| **Petra Veselá** | Daisy (Cavalier King Charles) | Karlín Walks, Karlín Dog Neighbors (creator) | Tomáš's go-to sitter. Low-key casual helper, 120 Kč/visit. |
| **Ondřej Malý** | Rocky (Staffie mix) | Karlín Walks, Karlín Dog Neighbors | Regular at Karlín park. Connected with Petra and Tomáš. |
| **Adéla Fišerová** | Číča (Shiba Inu) | Vítkov Park Dogs, Karlín Dog Neighbors | Responded to Tomáš's emergency care request. |

#### Holešovice / Stromovka Cluster
| Name | Dog(s) | Groups | Role in story |
|------|--------|--------|---------------|
| **Martin Horák** | Charlie (French Bulldog) | Stromovka DW, Letná Dog Walks | Regular at Saturday Stromovka walks. Connected with Klára. |
| **Eva Součková** | Luna (Border Collie mix), Max (Labrador mix) | Stromovka DW, Letná Dog Walks, Reactive Dog Support | Two dogs, very active. Helps with recall training. |
| **Filip Novotný** | Toby (Jack Russell) | Stromovka DW, Klára's Calm Dog Sessions | Client of Klára's. Booked 3 training sessions. |

#### Reactive Dog Support Members
| Name | Dog(s) | Groups | Role in story |
|------|--------|--------|---------------|
| **Hana Pokorná** | Runa (Husky mix, reactive) | Reactive Dog Support, Klára's Calm Dog Sessions | Daniel's first connection in the group. Recommended Klára. |
| **Vítek Bartoš** | Sam (mixed breed, fearful) | Reactive Dog Support | Lurker turned regular. Similar journey to Daniel. |
| **Anežka Veselá** | Nela (German Shepherd, leash-reactive) | Reactive Dog Support | Active poster. Shares tips. Connected with Daniel. |

#### Additional Supporting Characters
| Name | Dog(s) | Groups | Role in story |
|------|--------|--------|---------------|
| **Jana Krejčí** | Rex (Labrador) | Vinohrady MC, Stromovka OLC | Cross-cluster connector. (Already exists in mock data.) |
| **Nikola Rada** | — (no dog, professional boarder) | — | Provider only. Existing in mock data. |
| **Marie Nováková** | Molly (Labrador) | Letná Dog Walks | Potential client for Shawn-as-carer. (Exists in conversations.) |

---

## Groups: Full Roster

### Auto-Generated Park Groups (7)

These should feel busy — 15-40 members implied, with 5-10 shown as "active" (attending recent meets).

| Group ID | Name | Location | Active Members | Meets/Week |
|----------|------|----------|----------------|------------|
| park-riegrovy | Riegrovy Sady Dog Walks | Riegrovy sady, Prague 2 | 8-10 shown | 3-4 |
| park-stromovka | Stromovka Dog Walks | Stromovka, Prague 7 | 8-10 shown | 2-3 |
| park-letna | Letná Dog Walks | Letenské sady, Prague 7 | 5-6 shown | 2 |
| park-vitkov | Vítkov Park Dogs | Vítkov, Prague 3 | 4-5 shown | 2 |
| park-karlin | Karlín Walks | Karlín, Prague 8 | 5-6 shown | 2-3 |
| park-ladronka | Ladronka Off-Leash | Ladronka, Prague 6 | 3-4 shown | 1-2 |
| park-kampa | Kampa Island Walks | Kampa, Prague 1 | 3-4 shown | 1 |

### Community Groups (6)

| Group ID | Name | Type | Visibility | Creator | Active Members |
|----------|------|------|------------|---------|----------------|
| grp-vinohrady-eve | Vinohrady Evening Walkers | Community | Private | Tereza | 8 |
| grp-karlin-dogs | Karlín Dog Neighbors | Community | Private | Petra | 6 |
| grp-reactive | Prague Reactive Dog Support | Community | Approval | Eva/Daniel | 8 |
| grp-zizkov-parents | Žižkov Dog Parents | Community | Approval | Martin | 5 |
| grp-stromovka-offleash | Stromovka Off-Leash Club | Community | Open | Jana | 10 |
| grp-doodles-prague | Prague Doodle Owners | Community | Open | Lucie | 4 |

### Service Groups (2)

| Group ID | Name | Provider | Visibility | Members |
|----------|------|----------|------------|---------|
| svc-klara-training | Klára's Calm Dog Sessions | Klára | Open | 15 |
| svc-nikola-boarding | Nikola's Home Boarding | Nikola | Private | 6 |

---

## Meets: Full Calendar

### Target: 20-25 meets total
- 8-10 completed (with photos, attendance records — trust signal depth)
- 8-10 upcoming (demo browse experience)
- 3-4 recurring patterns visible

### Meet Types Distribution
| Type | Count | Parks/Locations |
|------|-------|-----------------|
| Walk | 12 | Riegrovy sady, Stromovka, Vítkov, Karlín riverfront, Letná |
| Park Hangout | 4 | Stromovka open field, Ladronka, Kampa |
| Playdate | 3 | Havlíčkovy sady (fenced), Riegrovy sady lower |
| Training | 4 | Letná (recall), Stromovka (Klára's sessions) |

### Key Meets With Narrative Value

**Completed (trust signal fuel):**
1. Tereza's first Thursday walk at Riegrovy (where she met Marek) — 8 weeks ago
2. Daniel's first reactive dog meet — 6 weeks ago, 4 dogs, quiet park
3. Klára's group training session — photos showing real dogs training
4. Stromovka Saturday walk (recurring) — 4 past instances with photos
5. Karlín morning walk where Tomáš met Petra

**Upcoming (demo browse):**
1. Thursday morning walk — Riegrovy sady (Tereza's recurring)
2. Saturday Stromovka Off-Leash (recurring)
3. Klára's next training session — 3/4 spots filled, booking CTA
4. Reactive dog small-group walk — private, approval-only
5. Karlín evening walk — Tomáš attending
6. Puppy socialisation — Havlíčkovy sady

---

## Connections: Relationship Web

### Connection Density Targets

| User | Connected | Familiar | Pending | Total |
|------|-----------|----------|---------|-------|
| Shawn | 4-5 | 3-4 | 1-2 | 8-10 |
| Tereza | 5-6 | 2-3 | 1 | 8-10 |
| Daniel | 3-4 | 2 | 0-1 | 5-6 |
| Klára | 8-10 | 3-4 | 2-3 | 13-15 |
| Tomáš | 3-4 | 2-3 | 1 | 6-8 |

### Cross-Journey Connections
- Daniel ↔ Klára: **Connected** (she's his trainer)
- Tereza ↔ Shawn: **Familiar** (both attend Riegrovy sady walks)
- Klára ↔ Martin: **Connected** (Stromovka regulars)
- Tomáš ↔ Petra: **Connected** (she sat Hugo in emergency)
- Shawn ↔ Klára: **Connected** (member of her service group)

### Trust Signals for Key Pairs
| Pair | Shared Meets | Mutual Connections | Shared Groups |
|------|-------------|-------------------|---------------|
| Tereza ↔ Marek | 8 | 3 (Lucie, Jana, Shawn) | 2 (park + neighborhood) |
| Daniel ↔ Klára | 4 | 2 (Hana, Eva) | 2 (reactive + service) |
| Tomáš ↔ Petra | 6 | 2 (Ondřej, Adéla) | 2 (park + neighborhood) |
| Shawn ↔ Jana | 5 | 2 (Tereza, Eva) | 3 (park + community) |

---

## Posts & Feed Content

### Target: 30-40 posts

**Distribution by origin:**
| Origin | Count | Purpose |
|--------|-------|---------|
| Park group posts | 10-12 | Show active park communities with photos from walks |
| Community group posts | 6-8 | Neighborhood coordination, reactive dog tips, breed chat |
| Service group posts | 3-4 | Klára's training session recaps (social proof) |
| Personal posts (Open users) | 5-6 | Profile gallery content for Tereza, Klára, Jana |
| Meet recap posts | 4-5 | Auto-generated post-meet photo collections |

**Content types:**
- Photo moments from walks (most common — "Franta found a stick bigger than him")
- Meet coordination ("Thursday walk is on, rain forecast — still going?")
- Help requests in neighborhood groups ("Can anyone grab Luna tomorrow 3pm?")
- Training session recaps with progress photos
- Dog milestone posts ("Rex's adoption anniversary — 2 years!")

### Tags & Visibility Examples

The mock data should demonstrate the two-gate visibility model:

| Post | Context Gate | Relationship Gate | Who Sees It |
|------|-------------|------------------|-------------|
| Tereza posts in Vinohrady Evening Walkers | Private group → members only | N/A (context gate handles it) | 8 group members |
| Klára posts training photo to service group | Open group → anyone can browse | N/A | Anyone (discovery feed) |
| Daniel posts in Reactive Dog Support | Approval group → members only | N/A | 8 group members |
| Tereza posts to her personal profile (Open) | Profile origin | Open profile → visible to all | Anyone |
| Daniel posts to his profile (Locked) | Profile origin | Locked → connected + familiar-by-author only | 4-5 people |

### Dog Tags on Photos
- Tereza tags Franta + Marek's Benny in a group walk photo → Both visible to group members
- Klára tags 3 dogs in a training photo → Tags visible per-viewer based on connection state
- Daniel never tags anyone (privacy-conscious)

---

## Bookings & Care History

### Target: 10-12 bookings across the cast

| Booking | Owner | Carer | Type | Status | Price | Story Value |
|---------|-------|-------|------|--------|-------|-------------|
| Tereza → watched Marek's Benny | Marek | Tereza | One-off sitting | Completed | 150 Kč/day × 2 | Friendship-to-care transition |
| Marek → watched Franta | Tereza | Marek | One-off sitting | Completed | (favor, no charge) | Reciprocity before the dial turned |
| Daniel → Klára training | Daniel | Klára | Recurring training | Active | 350 Kč/session | Trust-based service booking |
| Filip → Klára training | Filip | Klára | One-off training | Completed | 600 Kč/hour | Service group client |
| Tomáš → Petra sat Hugo | Tomáš | Petra | Emergency sitting | Completed | 120 Kč/visit × 4 | Emergency care from known person |
| Shawn → Olga walks | Shawn | Olga | Recurring walks | Active | 330 Kč/session | (Existing) |
| Shawn → Nikola boarding | Shawn | Nikola | One-off boarding | Upcoming | 480 Kč/night | (Existing, fix payment status) |
| Shawn → Klára training | Shawn | Klára | One-off training | Completed | 350 Kč/session | Cross-journey touchpoint |
| Marie → Shawn walks | Marie | Shawn | Recurring walks | Active | 280 Kč/walk | Shawn as casual provider |
| Hana → Klára training | Hana | Klára | Recurring training | Active | 350 Kč/session | Reactive dog client |

---

## Reviews

### Target: 12-15 reviews

**Distribution:**
- Klára (as trainer): 6 reviews (4.8 avg) — most reviewed, social proof
- Olga (walks): 3 reviews (4.8 avg) — existing provider
- Petra (sitting): 2 reviews (5.0 avg) — neighborhood helper
- Tereza (sitting): 1 review from Marek (5.0) — personal, warm
- Shawn (walks): 1 review from Marie (4.5) — new provider, first review
- Nikola (boarding): 2 reviews (4.9 avg) — existing provider

---

## Conversations & Messages

### Target: 8-10 conversation threads

**Existing (keep/update):**
1. Shawn ↔ Olga (booking coordination)
2. Shawn ↔ Nikola (boarding planning)
3. Shawn ↔ Jana (booking proposal)
4. Shawn ↔ Marie (walk inquiry, Shawn as carer)
5. Shawn ↔ Eva (new connection)

**New:**
6. Daniel ↔ Klára (training booking discussion — shows trust arc)
7. Tomáš ↔ Petra (emergency care request — shows urgency + trust)
8. Tereza ↔ Marek (casual care coordination — shows friendship dynamic)

### Group Message Threads
Keep existing group messages for Vinohrady MC and Stromovka OLC, but expand:
- Reactive Dog Support: 5-6 messages showing tips/support dynamic
- Karlín Dog Neighbors: Tomáš's emergency request + responses
- Klára's Calm Dog Sessions: Session recap + next session planning

---

## Notifications

### Target: 8-10 notifications showing variety

| Type | Content | For User |
|------|---------|----------|
| session_completed | "Olga completed Spot's morning walk" | Shawn |
| booking_proposal | "Klára sent a training session proposal" | Shawn |
| new_message | "Tereza: Are you coming Thursday?" | Shawn |
| meet_reminder | "Morning walk at Riegrovy starts in 1 hour" | Shawn |
| connection_request | "Zuzana wants to connect" | Shawn |
| group_join | "Jakub joined Riegrovy Sady Dog Walks" | Shawn |
| meet_photo | "Jana shared 3 photos from Sunday walk" | Shawn |
| booking_confirmed | "Daniel confirmed training session for Thursday" | Klára |

---

## Prague Authenticity Checklist

### Real Parks & Locations
- **Riegrovy sady** — Vinohrady's main dog park, beer garden, upper/lower sections
- **Stromovka** — Large park in Holešovice, open fields, good off-leash areas
- **Letenské sady (Letná)** — Hilltop park, panoramic views, popular dog walking
- **Vítkov** — Žižkov hill, steep sections, monument area
- **Havlíčkovy sady (Havlíčkák)** — Vinohrady, has fenced areas, grotto
- **Ladronka** — Břevnov, large open space, very popular for dogs
- **Kampa** — Island park, scenic but small, on-leash areas
- **Karlín riverfront** — Along Vltava, flat walking paths, newer development area

### Real Neighbourhoods (mapped to characters)
| District | Neighbourhood | Characters |
|----------|--------------|------------|
| Prague 2 | Vinohrady | Tereza, Shawn, Lucie, Jakub, Zuzana |
| Prague 3 | Žižkov | Martin |
| Prague 5 | Smíchov | Daniel |
| Prague 7 | Holešovice | Klára, Eva, Filip |
| Prague 8 | Karlín | Tomáš, Petra, Ondřej, Adéla |
| Prague 7 | Letná | (park group, no residents assigned) |

### Czech Dog Culture Details
- **Pricing:** 120-600 Kč range (realistic for Prague 2026)
- **Names:** All Czech names with proper diacritics (háčky, čárky)
- **Dog names:** Mix of Czech (Pepík, Číča, Franta) and international (Hugo, Luna, Max, Charlie)
- **Breeds:** Mix popular in Czech Republic (Dachshunds, German Shepherds, Beagles, Labs, mixed breeds)
- **Vet clinics:** Use generic but believable names ("VetClinic Praha 2", "Veterina Holešovice")
- **Currency:** Always Kč, never EUR
- **Language in app:** English (product is English-first for the prototype)

---

## File Organization

### Current Structure (keep)
```
lib/
  mockData.ts          — Provider cards + explore defaults
  mockUser.ts          — Current user (Shawn)
  mockBookings.ts      — Booking objects
  mockMeets.ts         — Meet events
  mockGroups.ts        — Group definitions
  mockConnections.ts   — Connection states
  mockConversations.ts — Chat threads
  mockPosts.ts         — Feed posts
  mockFeed.ts          — Feed assembly logic
  mockNotifications.ts — Notification items
  mockReviews.ts       — Review objects
  mockGroupMessages.ts — Group chat threads
  mockMeetMessages.ts  — Meet chat threads
  mockNeighbourhoodStats.ts — Stats widgets
  mockUserState.ts     — Demo mode flags
```

### Proposed Additions
```
lib/
  mockUsers.ts         — NEW: All user profiles (journey users + supporting cast)
  mockDogs.ts          — NEW: All dog profiles (extracted from users for reuse)
  mockAttendance.ts    — NEW: Meet attendance records (trust signal data)
```

### Key Principle: Single Source of Truth
- **Users** defined once in `mockUsers.ts`, referenced by ID everywhere
- **Dogs** defined once in `mockDogs.ts`, referenced by ID in users/meets/bookings
- **Groups** reference user IDs for membership, not inline objects
- **Meets** reference group IDs and user IDs for attendees
- **Feed logic** in `mockFeed.ts` assembles from all sources using the visibility model

---

## Cleanup: Known Issues to Fix

1. ~~**Nikola booking payment status**~~ — `booking-nikola-boarding` has `paymentStatus: "unpaid"` but notification says "confirmed." Fix: change notification to "booking_upcoming" or change payment status to "deposit_paid."

2. **Orphan dogs** — Conversations mention Mochi, Pepper, Bruno, Molly with no profiles. Fix: either add profiles or update conversation text to use dogs from the cast.

3. **Name collision** — Existing mock has a "Tomáš" in connections + meets. The journey user is also "Tomáš Kovář." Fix: existing Tomáš becomes a different character or merge them.

4. **Hardcoded dates** — Most mock data is pinned to March 2026. Fix: use relative dates ("2 days ago", "next Thursday") or a `MOCK_NOW` constant all files reference.

5. **Feed date context** — `mockFeed.ts` hardcodes "2026-03-07" as today. Fix: use `MOCK_NOW` constant.

6. **Provider/user overlap** — Providers in `mockData.ts` (Olga, Nikola, Jana, etc.) exist separately from mock users. Some should be unified: Klára should appear in both providers list and mockUsers with consistent data.

---

## Implementation Order

### Phase A: Foundation (do first)
1. Create `mockUsers.ts` — All 4 journey users + 15 supporting cast with full profiles
2. Create `mockDogs.ts` — All dogs, referenced by user ID
3. Clean up `mockGroups.ts` — Consolidate duplicates, add full membership rosters
4. Fix known inconsistencies (above)

### Phase B: Interactions
5. Expand `mockMeets.ts` — 20-25 meets with proper attendee lists
6. Create `mockAttendance.ts` — Historical attendance for trust signal calculation
7. Expand `mockConnections.ts` — Full relationship web across cast
8. Expand `mockBookings.ts` — 10-12 bookings showing care network

### Phase C: Content
9. Expand `mockPosts.ts` — 30-40 posts from various origins/contexts
10. Expand `mockReviews.ts` — 12-15 reviews
11. Expand `mockConversations.ts` + `mockGroupMessages.ts` — New threads
12. Expand `mockNotifications.ts` — More variety

### Phase D: Polish
13. Update `mockFeed.ts` — Ensure feed logic handles expanded data
14. Update `mockNeighbourhoodStats.ts` — Reflect actual data counts
15. Verify all cross-references (user IDs, dog IDs, group IDs) are consistent
16. Test: click through every page and verify data appears correctly

---

## Post Composer — Contextual Suggestion Pills (Wire During Persona/Flow Building)

The post composer's tag accordion rows can show suggestion pills in the header for one-tap adding. Currently:
- **Location**: suggests 1 (single-select)
- **Pets**: suggests all owned pets
- **People**: suggests up to 3 connections
- **Community**: no suggestions (needs context)
- **Meet**: no suggestions (needs context)

**Future contextual logic to wire:**
- **Community & Meet**: Only suggest if the user is currently at / recently attended a meet, or is posting from within a group. The `preselectedGroupId` already handles the "posting from a group" case. For meets, detect if there's an active/recent meet (within last 2 hours?) and auto-suggest it + its associated group + its location.
- **Pets during care**: If the user (as a care provider) is currently in an active booking, suggest the client's dog instead of their own.
- **Location**: Could auto-suggest based on the meet location or the user's current neighbourhood.
- **People**: Could prioritize people who were at the same recent meet.

This would make the composer feel context-aware: finish a walk with Vinohrady Morning Crew at Riegrovy Sady → open composer → location, community, and meet are all pre-suggested. One tap each.

---

## Open Questions

1. **Shawn's role in the demo.** Is Shawn always the logged-in user? Or should we support switching perspective to see the app as Tereza, Daniel, or Klára? (Affects how many "my bookings / my groups / my feed" views we need to populate.)

2. **Photo assets.** Mock data references image paths (`/images/generated/...`). Do we need actual placeholder images, or is the data structure enough for now? If we want the demo to feel alive, we'll need dog photos and user avatars.

3. **Provider list alignment.** The 10 providers in `mockData.ts` + Supabase seed are from an earlier phase. Should Klára replace one of them? Should Tereza and Petra appear in the care search results?

4. **Date strategy.** Pin everything to a specific "demo date" (e.g., March 20, 2026) or use relative dates that stay fresh? Pinned is simpler; relative requires a helper function.

---

## Related Docs

- [[Groups Strategy]] — Group archetypes and user journeys
- [[Content Visibility Model]] — Two-gate system governing feed and profiles
- [[Trust & Connection Model]] — Connection states and trust signals
- [[User Archetypes]] — Behavioral profiles and ramps
- [[Product Vision]] — Business model and principles
