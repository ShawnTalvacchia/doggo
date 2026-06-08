---
category: implementation
status: active
last-reviewed: 2026-06-07
tags: [mock-data, demo, prototype, data-model]
review-trigger: "before creating or modifying mock data files"
---

# Mock Data — Reference

This document started as the planning artifact for **Mock World Building** (closed 2026-05-02). The plan is shipped; the doc now serves as a reference snapshot of the cast, groups, meets, bookings, and content that populate the prototype. Sections below were originally framed as "Target State" — they are now the actual state.

For the original execution records, see archived phase boards (`docs/archive/phases/persona-wiring.md`, `docs/archive/phases/mock-world-building.md`).

**Approach:** Mock data only (no Supabase schema changes). Four journey users (Tereza / Daniel / Klára / Tomáš) as the narrative spine, plus a supporting cast that populates their world. Persona switching shipped during Persona Wiring; per-persona content shipped during Mock World Building.

Depends on: [[Groups & Care Model]], [[Content Visibility Model]], [[Trust & Connection Model]], [[User Archetypes]]

---

## Current State (as of 2026-05-14)

| Entity | Count | Notes |
|--------|-------|-------|
| Users (UserProfile) | 25 | 6 viewer personas (Tereza, Daniel, Klára, Tomáš, Lena, Magda) + Shawn + ~18 supporting cast (Vinohrady, Karlín, Holešovice, Reactive support, Letná clusters) |
| Providers (ProviderCard) | 10 | Directory entries in `mockData.ts`; some bridged to UserProfile via `userId` field, others directory-only (see P4 + bridge contract documented in `mockData.ts`) |
| Connections | per-persona | Shawn 12, Tereza 8, Daniel 5, Klára 10, Tomáš 6, Lena 3, Magda 5, Veronika 3, New User 0 (intentional empty state). P69 still open: most supporting-cast personas don't have inverse rosters. Indexed via `mockConnectionsByViewer` |
| Meets | 44 | Mix of completed + upcoming, recurring + one-off, free + paid. All 4 group types represented. |
| Groups | 25 | Park, Neighbour, Interest, Care types; canonical demo example for each. Holešovice Dog Block added 2026-05-14 (Demo Narrative & Personas) — private neighbour group anchored by Magda. |
| Bookings | 12 | Active recurring (Daniel↔Klára training, Klára↔Hana training, Olga↔Tereza walks), active one-off (Shawn↔Marie), completed (Tomáš↔Petra emergency, Klára↔Filip training, Tereza↔Marek sitting + walks, Shawn↔Tomáš), plus Olga↔Shawn ongoing walks. Tereza is the only dual-role persona — both owner-side (Olga walks Franta) and carer-side (Marek's Benny). |
| Posts | 53 | Authorship spread: Klára 10, Shawn 9, Jana 9, Eva 8, Tomáš 7, Tereza 6, Daniel 6, plus supporting cast |
| Reviews | 13 | Anchored on Klára (training), Petra (sitting), Olga / Nikola (existing providers), Tereza (one warm review from Marek) |
| Conversations | 13 | Per-persona threads — booking + direct/social mix |

**Quality bar:** all four journey personas have populated home feeds, inboxes, profiles, schedules, and bookings. Tap any persona and their world reads as a real account. Profile-visibility distribution sits at ~67% locked / 33% open per the community-first thesis (P36 rebalance).

### Date strategy: relative dates for live-feeling demo

**Sessions & Service Execution refresh, 2026-05-08.** Mock data that needs to track "today" uses the helpers in `lib/mockDate.ts`:

- `daysAgo(n)` for things that should always look recently past (review-eligible meets, recently-completed sessions, fresh chat timestamps)
- `daysFromNow(n)` for things that should always look soon (upcoming meets, scheduled care sessions, upcoming bookings)
- `daysAgoIso(n, time?)` / `daysFromNowIso(n, time?)` for full ISO datetime variants (notification `createdAt`, visit-report `completedAt`, etc.)

Why: hardcoded dates ("2026-04-09") drift out of useful windows over time — meets fall off the schedule, completed sessions age past the review-recent window, "new visit report" indicators stop firing, notifications disappear off the visible recency cutoff. Relative dates keep the same day-zero state coherent every time someone opens the demo.

Use sparingly — only data that needs to track today. Static deeper history (long-term context, profile member-since dates, reviewable past events) is fine. Module-level evaluation means values stabilize for the page session; route-level mounting refreshes them.

**Currently relative:**
- `klaraTrainingDaniel` sessions kd-1 through kd-5 (weekly back from today) + kd-5 visit report
- `klaraTrainingHana` sessions
- `olgaBooking` sessions
- `olgaWalksTereza` sessions
- `shawnCarerActiveBooking`, `terezaWalksMarek` (and other ongoing bookings) upcoming sessions
- All `mockConversations` `sentAt` timestamps (61 strings across all threads). Per-conversation latest ages range 1d (active proposals / fresh threads) → 12d (completed bookings) so the inbox always reads as live activity, not a frozen snapshot. Inbox & Notifications, 2026-05-08.

**Should remain static:** historical milestones (signed dates), long-completed bookings used for archival demonstration, posts with anchored timestamps in story copy.

---

## Realism standards

Conventions that have accreted across phases. Read this before seeding any new persona, group, meet, booking, or content. Captured here 2026-05-14 (Demo Narrative & Personas, W3.5) so future seeding stops drifting.

### People + dog naming

- **Czech first names + last names** for all Prague-resident personas, with diacritics rendered correctly (`Tereza Nováková`, `Klára Horáčková`, `Vondráková`, `Krásná`). Avoid English transliterations.
- **Dog names** mix Czech (`Pepík`, `Číča`, `Franta`, `Žofka`, `Bára`, `Kuba`) and international (`Hugo`, `Luna`, `Max`, `Charlie`, `Eda`, `Toby`). Both feel realistic for the city; favor Czech for older personas + internationals for younger / expat-leaning personas.
- **Avatar reuse is acceptable** for new minor personas — follow the Lena precedent (`anezka-profile.jpeg`) and Pawel precedent (`marek-profile.jpeg`). Document the reuse in the persona's docstring. Avoid reuse-collision in shared surfaces (don't put two users sharing an avatar on the same group / meet roster).
- **Pet portrait reuse** follows the same rule. Match approximate breed shape so the visual stand-in isn't jarring (a Schnauzer-mix portrait can stand in for similar small terrier-ish dogs; reusing a Husky for a Chihuahua reads wrong).

### Neighbourhoods

Personas live in real Prague neighbourhoods, mapped by district (see Prague Authenticity Checklist below for the full list). Each cluster has a recurring set of regulars + at least one Carer + ideally one social anchor (open profile, cross-cluster ties).

| District | Neighbourhood | Anchor cluster |
|---|---|---|
| Prague 2 | Vinohrady | Tereza, Marek, Lucie, Jakub, Zuzana, Shawn (anchor: Tereza/Jana) |
| Prague 3 | Žižkov | Martin (lighter cluster) |
| Prague 5 | Smíchov | Daniel, Vítek (lighter — reactive-dog focus) |
| Prague 7 | Holešovice | Klára, Eva, Filip, Hana, Magda, Veronika, Martin Horák (anchor: Eva/Magda) |
| Prague 7 | Letná | Lena, Pawel, Marie, Nikola |
| Prague 8 | Karlín | Tomáš, Petra, Ondřej, Adéla |

When seeding a new persona, place them in an existing cluster + add at least one same-neighbourhood Familiar/Connected relationship.

### Profile visibility distribution

Per the community-first thesis (P36 rebalance, MWB B1):

- **Default to `locked`.** Open is the exception, not the rule.
- **Open is reserved for:** (1) Carers whose service visibility depends on it (Tereza, Klára, Petra, Nikola, Pawel, Veronika); (2) social anchors at most one per neighbourhood (Eva for Holešovice, Jana for Vinohrady); (3) Hub Members and other "narrow-and-deep" Connectors who are socially comfortable enough to keep their profile open (Magda).
- Aim for ~55/45 Locked/Open at the supporting-cast level. Bridged providers tilt the ratio toward Open by necessity.

### Connection density per persona

Targets from MWB + ongoing seeding:

| Persona | Connections | Notes |
|---|---|---|
| Shawn | 12 | Original full roster. |
| Tereza | 8 | Vinohrady-anchored, cross-cluster ties to Jana + Klára. |
| Daniel | 5 | Sparse by design — anxious new owner archetype. |
| Klára | 10 | Trainer with broad professional network. |
| Tomáš | 6 | Karlín-anchored, smaller social circle. |
| Lena | 3 | Marketplace-Owner archetype — graduated to care, light community footprint. |
| Magda | 5 | Hub Member archetype — narrow-and-deep, all in Holešovice cluster. |
| Veronika | 3 | Casual Carer archetype — content within the block. |
| New User | 0 | Intentional empty state. |

When seeding a new persona, target a connection count that matches their archetype:
- **Connectors** (anchor-heavy): 8–12, with cross-cluster ties.
- **Regulars** (routine-anchored): 5–8, mostly within their cluster.
- **Casual Carers / Hub Members**: 3–5, narrow-and-deep within one cluster.
- **Marketplace Owners / Utility users**: 2–4, anchored on a Carer + a few residual community ties.
- **New / Empty**: 0–2.

P69 (close pending): supporting-cast personas without seeded rosters need inverses of every entry pointing at them. Demo-narrative personas (Magda, Veronika) have rosters; the broader sweep is partial — see [phases/punch-list.md](../phases/punch-list.md) → P69 for the canonical list.

### Pricing realism

Czech crown (Kč), realistic for Prague 2026:
- **Walks / drop-in visits**: 120–330 Kč per visit. Casual peer rate ~150–200; professional ~250–350.
- **Day care**: 150–400 Kč per visit.
- **Boarding**: 480–700 Kč per night.
- **House sitting**: 180–400 Kč per visit.
- **Group training**: 300–400 Kč per session.
- **1-on-1 training (mobile)**: 600–1000 Kč per session.
- **Behaviour consultation**: 800–1500 Kč.

When seeding a Carer, price within these bands and let `computeQuote` handle modifiers (weekend, holiday, multi-pet, last-minute) on top.

### Bridged provider contract

`ProviderCard` directory entries may exist as either:
- **Directory-only** — no `userId`, no `UserProfile`. `getUserOrProvider` synthesises a minimal profile.
- **Bridged** — `userId` field links to a `UserProfile` in `mockUsers.ts`. Profile renders fully; service edits write through.

When seeding a new Carer:
- If they need a real profile (services tab, posts, full About), seed as `UserProfile` AND add a bridged `ProviderCard` with matching `userId`.
- If they're directory-fill only (background carer name in Discover), `ProviderCard`-only is fine.

See `mockData.ts` top-of-file for the full bridge contract.

### Date strategy

Already covered above ("Date strategy: relative dates for live-feeling demo"). The summary rule:
- **Track-today data** uses `daysAgo`, `daysFromNow`, `daysAgoIso`, `daysFromNowIso` from `lib/mockDate.ts`.
- **Static historical data** (signed dates, milestones, deeper backstory) stays as ISO strings.

### Veterinary records on dogs

Pet `vetInfo` is for owner record-keeping (clinic name, vet phone, last checkup, vaccinations, medications, conditions). It is NOT a platform service — vets retired from `AppointmentCategory` + `CareCategory` 2026-05-11 (Care Catalog Taxonomy). Seed `vetInfo` with realistic Prague-area clinic names (`Veterina Vinohrady`, `Letná Veterinary Centre`, etc.) but don't expose vets as a Carer service type.

### Service taxonomy

Four canonical Care services (Care Catalog Taxonomy, 2026-05-11):
- `walks_checkins` — drop-in visits + walks (carer goes to owner)
- `house_sitting` — owner's home, finite duration
- `day_care` — carer's home, daytime
- `boarding` — carer's home, overnight

Plus Meet-type and Appointment-type service shapes (Discover & Care, 2026-05-04 + Care Catalog Taxonomy, 2026-05-11). Use `SUB_SERVICES` from `lib/constants/services.ts` — never invent free-form sub-service strings.

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
| **Magda Vondráková** *(viewer persona, added 2026-05-14)* | Žofka (Schnauzer mix) | Holešovice Dog Block (admin), Klára training meets | Neighborhood Hub Member archetype. Anchors a tight private neighbour group of ~12. Carries Beat 3 of the demo narrative — connects with Daniel post-meet, invites him to her group, arranges peer care. Open profile, narrow-and-deep network. |
| **Veronika Krásná** *(supporting cast, added 2026-05-14)* | Kuba (Cocker Spaniel, 12y) | Holešovice Dog Block | Casual Carer archetype. Works from home — flexible. `publicProfile: false` (circle audience only). Magda's go-to peer carer; receives the inquiry → proposal → contract booking in Beat 3 of the demo. |
| **Martin Horák** | Charlie (French Bulldog) | Stromovka DW, Letná Dog Walks, Holešovice Dog Block | Regular at Klára's Stromovka morning walk. Connected with Klára. |
| **Eva Součková** | Luna (Border Collie mix), Max (Labrador mix) | Stromovka DW, Letná Dog Walks, Reactive Dog Support, Holešovice Dog Block | Two dogs, very active. Helps with recall training. |
| **Filip Novotný** | Toby (Jack Russell) | Stromovka DW, Klára's Calm Dog Sessions, Holešovice Dog Block | Client of Klára's. Booked 3 training sessions. |

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

## Cleanup: Resolved

All six items from the original cleanup list shipped during Persona Wiring + Mock World Building.

1. ~~Nikola booking payment status~~ — fixed (Persona Wiring).
2. ~~Orphan dogs in conversations~~ — fixed; conversation text now references cast dogs only.
3. ~~"Tomáš" name collision~~ — resolved; canonical Tomáš Kovář is the journey persona, supporting cast renamed.
4. ~~Hardcoded March 2026 dates~~ — `lib/mockDate.ts` provides `MOCK_NOW` + `daysAgo` / `daysFromNow` helpers; all dynamic date fields migrated.
5. ~~`mockFeed.ts` hardcoded "today"~~ — uses `MOCK_NOW` now. Plus a Mock-World-Building C4 fix removed a hardcoded `userNeighbourhood = "Vinohrady"` that made every persona's discovery gate behave like Tereza's.
6. ~~Provider / user overlap~~ — bridge contract documented in `mockData.ts`; `userId` field on `ProviderCard` links bridged providers to UserProfile entries; `getUserOrProvider` synthesises minimal profiles for directory-only providers (Olga, Jana, etc.).

**Subsequent issues surfaced and fixed during Mock World Building:**
- P4 (provider-userId bridge contract) — A1 / 2026-04-30
- P21 (Group↔Meet relationship duplication) — A2 / 2026-04-30
- P28 (`MeetAttendee.profileOpen` auto-derive helper) — A3 / 2026-04-30
- P36 (profile-visibility distribution) — B1 / 2026-04-30
- P35 (inbox name + dog format normalization + dog-fallback) — C5 / 2026-04-30

**Outstanding** (not blocking demo, deferred to future passes):
- P44 (Services-as-Catalog code follow-ups — `Meet.visibility = "participants_only"`, `CarerServiceConfig` Meet-type variant, profile Services-tab Meet rendering)
- P47 (mock-world edge-case seeding — D1–D4 deferred from Mock World Building)

---

## Implementation Order — completed 2026-05-02

All four phases (A: Foundation, B: Interactions, C: Content, D: Polish) shipped during Persona Wiring + Mock World Building. The breakdown above is preserved as historical context. Future mock-data work should hang off the punch-list (P44, P47, plus any new items) rather than re-creating planning phases.

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

1. ~~**Shawn's role in the demo.**~~ **Resolved (2026-04-26):** Persona switching shipped. Five personas in the picker (Tereza / Daniel / Klára / Tomáš / New User); Shawn was removed from the picker but still exists in mock-world data as a Vinohrady regular. Default is Tereza. Switcher surfaces: profile-page name dropdown, `/demo` route, `?as=<personaId>` URL param. See `docs/features/demo-mode.md`.

2. ~~**Photo assets.**~~ **Resolved (during Mock World Building):** generated dog and persona photos in place (`/images/generated/`). Per phase scope, no further image generation in this phase; future image work is its own pass.

3. ~~**Provider list alignment.**~~ **Resolved (P4 / 2026-04-30):** bridge contract documented at top of `providers` array in `mockData.ts`. Providers may exist as directory-only entries (no UserProfile) or bridged via `userId`. `getUserOrProvider` synthesises minimal profiles for directory-only providers. No backfill required. Tereza and Petra both surface in care search via the bridge.

4. ~~**Date strategy.**~~ **Resolved:** `lib/mockDate.ts` provides `MOCK_NOW` + relative-date helpers (`daysAgo`, `daysFromNow`, `daysAgoIso`). Most dynamic date fields migrated; deeper-history dates (Jan/Feb/March 2026) left static intentionally as "older" content.

---

## Related Docs

- [[Groups Strategy]] — Group archetypes and user journeys
- [[Content Visibility Model]] — Two-gate system governing feed and profiles
- [[Trust & Connection Model]] — Connection states and trust signals
- [[User Archetypes]] — Behavioral profiles and ramps
- [[Product Vision]] — Business model and principles
