/**
 * mockUsers.ts — Central user registry for all demo personas.
 *
 * The logged-in user (Shawn) lives in mockUser.ts.
 * This file defines the 4 journey users + 15 supporting cast that populate
 * groups, meets, bookings, conversations, and the feed.
 *
 * Every other mock file should reference users by ID from this registry.
 * Helper functions at the bottom let you look up avatars/names by ID
 * without importing the full object.
 *
 * **Profile-visibility distribution rule** (Mock World Building B1, 2026-04-30
 * — closes punch list P36):
 *
 * Doggo's privacy model defaults to Locked. The mock world should reflect
 * that — keep ~70% of users Locked, ~30% Open. Open users are:
 *
 *   1. **Carer-tier users** (Helper or Provider — anyone with a `carerProfile`
 *      whose service visibility depends on profile openness): Tereza, Klára,
 *      Petra, Nikola, Shawn.
 *   2. **Social anchors** — at most one per neighbourhood, picked because
 *      their cross-cluster ties or active posting carry the network: Jana
 *      (Vinohrady cross-cluster connector), Eva (Holešovice + Reactive Dog
 *      Support multi-group anchor).
 *
 * Everyone else stays Locked. When seeding a new user, default to Locked
 * and only switch to Open if the user is in one of the two categories above.
 *
 * **Knock-on effect:** `MeetAttendee.profileOpen` should mirror the user's
 * visibility — see `buildMeetAttendee()` in `mockMeets.ts` (Mock World
 * Building A3, P28). Existing inline attendee literals were swept on
 * 2026-04-30 to match this distribution.
 */

import type { UserProfile, CarerServiceConfig } from "./types";

/* ── Avatar URLs (Unsplash, cropped 400×400) ──────────────────────────────── */

const AV = {
  tereza:  "/images/generated/tereza-profile.jpeg",
  daniel:  "/images/generated/daniel-profile.jpeg",
  klara:   "/images/generated/klara-profile.jpeg",
  tomas:   "/images/generated/tomas-profile.jpeg",
  marek:   "/images/generated/marek-profile.jpeg",
  lucie:   "/images/generated/lucie-profile.jpeg",
  jakub:   "/images/generated/jakub-profile.jpeg",
  zuzana:  "/images/generated/zuzana-profile.jpeg",
  petra:   "/images/generated/petra-profile.jpeg",
  ondrej:  "/images/generated/ondrej-profile.jpeg",
  adela:   "/images/generated/adela-profile.jpeg",
  martin:  "/images/generated/martin-profile.jpeg",
  eva:     "/images/generated/eva-profile.jpeg",
  filip:   "/images/generated/filip-profile.jpeg",
  hana:    "/images/generated/hana-profile.jpeg",
  vitek:   "/images/generated/vitek-profile.jpeg",
  anezka:  "/images/generated/anezka-profile.jpeg",
  jana:    "/images/generated/jana-profile.jpeg",
  nikola:  "/images/generated/nikola-profile.jpeg",
  marie:   "/images/generated/marie-profile.jpeg",
  shawn:   "/images/generated/shawn-profile.jpg",
} as const;

export { AV as AVATARS };

/* ═══════════════════════════════════════════════════════════════════════════
   JOURNEY USERS (5)
   ═══════════════════════════════════════════════════════════════════════════ */

export const tereza: UserProfile = {
  id: "tereza",
  firstName: "Tereza",
  lastName: "Nováková",
  email: "tereza.novakova@email.cz",
  avatarUrl: AV.tereza,
  bio: "Vinohrady regular with my beagle Franta and rescue Bella. We do Riegrovy sady every morning and I run the Vinohrady Evening Walkers. Happy to dog-sit for friends in the neighbourhood.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-08",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  shareCode: "tereza-r4m2",
  pets: [
    {
      id: "franta",
      name: "Franta",
      breed: "Beagle",
      weightLabel: "12 kg",
      ageLabel: "5 years",
      imageUrl: "/images/generated/franta-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["sniffing", "chase"],
      socialisationNotes: "Friendly with all dogs. Nose-first — will follow a scent over a recall. Does well in groups of any size.",
      notes: "Reliable recall except when scent-tracking. Loves treats.",
      vetInfo: {
        clinicName: "Veterina Vinohrady",
        vetPhone: "+420 222 514 730",
        lastCheckup: "2026-01-22",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-08-15", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-08-15", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-08-15", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-08-15", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-08-15", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-04-20",
        spayedNeutered: true,
        conditions: "None. Tendency to overeat — measured portions only.",
      },
    },
    {
      id: "bella",
      name: "Bella",
      breed: "Border Collie mix",
      weightLabel: "16 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/bella-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["chase", "fetch"],
      socialisationNotes: "Adopted from a rural shelter early 2026. Bonding well with Franta — he showed her the Vinohrady ropes. Still slow to warm up to strangers; great once she knows you. Calm with other dogs, alert with new people.",
      notes: "Working on confidence around city sounds. Off-leash recall is solid in parks she knows; we keep her leashed in unfamiliar spots.",
      vetInfo: {
        clinicName: "Veterina Vinohrady",
        vetPhone: "+420 222 514 730",
        lastCheckup: "2026-02-04",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2026-02-04", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2026-02-04", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2026-02-04", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2026-02-04", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2026-02-04", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-04-20",
        spayedNeutered: true,
        conditions: "Healthy. Some startle response to loud noises (still settling post-adoption).",
      },
    },
  ],
  carerProfile: {
    bio: "I can watch your dog at my flat in Vinohrady. Franta loves company. Familiar dogs only.",
    location: "Prague 2 – Vinohrady",
    availability: [
      { day: "Sat", slots: ["morning", "afternoon"] },
      { day: "Sun", slots: ["morning", "afternoon"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 150,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Small/medium dogs only at my flat in Vinohrady. Familiar dogs only.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 80 },
        ],
      },
      {
        kind: "care",
        serviceType: "house_sitting",
        enabled: true,
        pricePerUnit: 180,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit", "Special feeding", "Medication"],
        notes: "I can come to your home for drop-ins or longer sits — Vinohrady neighbours only.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
      },
      {
        kind: "care",
        // Meet-linked (config #2): `meet-15` advertises this drop-off walk
        // via `meet-15.linkedServices` (meet-authoritative — the link lives
        // on the meet side; this `id` is how `getServiceById` resolves it).
        id: "tereza-walks",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 200,
        priceUnit: "per_visit",
        // "Group walk" is a linked-care walk (owner doesn't attend) — a
        // Walks & Check-ins sub-service, not a Meet-type service. The prior
        // `tereza-group-walk` Meet-type entry was a miscategorisation
        // (Service ↔ Meet Linkage remodel, 2026-05-17 — see Open Q §13).
        subServices: ["Solo walk", "Group walk"],
        notes: "Casual walks for neighbours' dogs — solo or in a small group. I usually do Riegrovy sady or Havlíčkovy sady. Familiar dogs only.",
        modifiers: [],
        // Walk Service Delivery, 2026-05-20. Neighbourhood-scale carer —
        // pickup and drop-off are both easy when everyone's on the same
        // block. Modest pickup uplift (220 vs 200) preserves the casual rate.
        deliveryOptions: [
          { method: "dropoff", price: 200 },
          { method: "pickup", price: 220 },
        ],
      },
    ],
    publicProfile: false,
    visibility: "connected_only",
    acceptingBookings: true,
  },
};

export const daniel: UserProfile = {
  id: "daniel",
  firstName: "Daniel",
  lastName: "Procházka",
  email: "daniel.prochazka@email.cz",
  avatarUrl: AV.daniel,
  bio: "New to Prague, finding our footing with my rescue Bára. She's reactive with unfamiliar dogs, so we take things slow — I'm trying to get her out more and meet other owners. The reactive dog support group has been a lifeline.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2026-01",
  profileVisibility: "locked",
  tagApproval: "approve",
  openToHelping: false,
  shareCode: "daniel-w9k7",
  pets: [
    {
      id: "bara",
      name: "Bára",
      breed: "Mixed breed rescue",
      weightLabel: "15 kg",
      ageLabel: "3 years",
      imageUrl: "/images/generated/bara-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["sniffing", "fetch"],
      socialisationNotes: "Reactive with unfamiliar dogs — needs slow, controlled introductions. Fine once she knows them. Nervous in large groups. Best with 1-2 calm dogs.",
      notes: "Working on her leash reactivity — slow and steady. Looking for the right training help.",
      vetInfo: {
        clinicName: "Veterina Smíchov",
        vetPhone: "+420 257 311 458",
        lastCheckup: "2026-02-12",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-11-08", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-11-08", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-11-08", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-11-08", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-11-08", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-05-10",
        spayedNeutered: true,
        medications: "Half a Trazodone before high-stimulus walks. Otherwise none.",
        conditions: "Mild leash reactivity. No food allergies. Sensitive stomach with novel proteins.",
      },
    },
  ],
};

export const klara: UserProfile = {
  id: "klara",
  firstName: "Klára",
  lastName: "Horáčková",
  email: "klara.horackova@email.cz",
  avatarUrl: AV.klara,
  bio: "Dog trainer and walker in Holešovice — eight years helping dogs and their people feel easier in the world. I host a free weekly walk at Stromovka for the whole neighbourhood, run small-group training sessions, and work 1-on-1 with reactive and anxious dogs. My own dog Eda comes along to most of it. The best part of the job is watching a nervous dog go from avoiding the park to being part of the crew.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-06",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  shareCode: "klara-p3n8",
  pets: [
    {
      id: "eda",
      name: "Eda",
      breed: "Border Collie",
      weightLabel: "20 kg",
      ageLabel: "6 years",
      imageUrl: "/images/generated/eda-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["fetch", "chase", "tug"],
      socialisationNotes: "Extremely well-trained. Calm around reactive dogs — often used as a demo dog in training sessions. Excellent recall, great with all sizes.",
      notes: "Responds to Czech and English commands. Certified therapy dog.",
      vetInfo: {
        clinicName: "Veterina Holešovice",
        vetPhone: "+420 233 374 191",
        lastCheckup: "2026-02-28",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-09-04", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-09-04", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-09-04", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-09-04", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-09-04", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-03-15",
        spayedNeutered: true,
        conditions: "Healthy. Annual hip check given the breed — clear so far.",
      },
    },
  ],
  carerProfile: {
    bio: "Walker-trainer, eight years in. I run a free community walk at Stromovka and paid training — small-group sessions and 1-on-1 work for reactive and anxious dogs. My approach is force-free, and I coach owners as much as dogs: leash skills, reading other dogs, the confidence to enjoy company instead of avoiding it.",
    location: "Prague 7 – Holešovice / Stromovka",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning", "afternoon"] },
      { day: "Wed", slots: ["morning"] },
      { day: "Thu", slots: ["morning", "afternoon"] },
      { day: "Fri", slots: ["morning"] },
      { day: "Sat", slots: ["morning"] },
    ],
    services: [
      {
        kind: "care",
        // `id` set because this Care service is meet-linked (config #2) — it's
        // the drop-off service advertised on the free Stromovka walk
        // (`meet-klara-stromovka.linkedServices`). Service ↔ Meet Linkage.
        id: "klara-walks",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 300,
        priceUnit: "per_visit",
        // Walk Service Delivery, 2026-05-20. Drop-off matches the linked
        // Stromovka walk's meeting point (300 Kč, the existing rate); pickup
        // adds the Holešovice-pickup-route value-add (380 Kč). Beat 2's Toby
        // booking is a pickup — Filip lives in Holešovice on Klára's way.
        deliveryOptions: [
          { method: "dropoff", price: 300 },
          { method: "pickup", price: 380 },
        ],
        subServices: ["Group walk"],
        notes: "Training walks — structured walk with obedience practice. Max 4 dogs per group.",
      },
      // Meet-type training catalogue (Discover & Care A4, 2026-05-02). The
      // previous junk-drawer "day_care" entry held three training
      // offerings as subServices strings; they're now first-class Meet-type
      // entries — see [[Groups & Care Model]] → Services as Catalog.
      //
      // Service ↔ Meet Linkage (A1 + A4, 2026-05-13): `seriesMeetId?: string`
      // migrated to `linkedMeetIds: string[]` (one-to-many). `klara-1on1`
      // reclassified Meet → Appointment (training) — solo + scheduled + no
      // roster = Appointment per the §13 roster test, not Meet.
      {
        kind: "meet",
        id: "klara-group-training",
        title: "Group training session",
        enabled: true,
        pricePerSession: 350,
        format: "small_group",
        cadence: "weekly",
        durationMinutes: 60,
        notes: "Open weekly group session — calm focus and recall practice.",
        linkedMeetIds: ["meet-care-1"],
      },
      {
        kind: "appointment",
        id: "klara-1on1",
        title: "1-on-1 training session",
        enabled: true,
        pricePerAppointment: 800,
        durationMinutes: 60,
        appointmentCategory: "training",
        notes: "Private session at your location or Stromovka. Behaviour assessment included on the first session.",
      },
      {
        kind: "meet",
        id: "klara-reactive",
        title: "Reactive dog session",
        enabled: true,
        pricePerSession: 600,
        format: "small_group",
        cadence: "ad_hoc",
        durationMinutes: 90,
        notes: "Workshops and small-group sessions for reactive dogs. Threshold work, redirection, owner coaching.",
        linkedMeetIds: ["meet-care-workshop-1"],
      },
      {
        kind: "meet",
        id: "klara-puppy-basics",
        title: "Puppy basics",
        enabled: true,
        pricePerSession: 400,
        format: "small_group",
        cadence: "weekly",
        durationMinutes: 45,
        notes: "Foundations course for puppies under 6 months — handling, recall, socialisation.",
        linkedMeetIds: ["meet-care-puppy-basics"],
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 8,
      methodology: "Force-free, positive reinforcement",
      firstAidTrained: true,
      certifications: ["Národní kvalifikace — Dog Trainer", "Certified Trainer"],
      insured: true,
      identityVerified: true,
    },
    repeatClients: 12,
  },
};

export const tomas: UserProfile = {
  id: "tomas",
  firstName: "Tomáš",
  lastName: "Kovář",
  email: "tomas.kovar@email.cz",
  avatarUrl: AV.tomas,
  bio: "Karlín resident, Hugo's human. We do the morning riverside walk most days. Still fairly new to the app but Hugo has already made more friends than me.",
  location: "Prague 8, Czech Republic",
  neighbourhood: "Karlín",
  memberSince: "2026-02",
  profileVisibility: "locked",
  tagApproval: "auto",
  openToHelping: false,
  shareCode: "tomas-x6q4",
  pets: [
    {
      id: "hugo",
      name: "Hugo",
      breed: "Labrador Retriever",
      weightLabel: "32 kg",
      ageLabel: "2 years",
      imageUrl: "/images/generated/hugo-portrait.jpeg",
      energyLevel: "very_high",
      playStyles: ["fetch", "wrestling", "chase"],
      socialisationNotes: "Loves every dog and every person. Zero reactivity. Can be too enthusiastic greeting small dogs — working on impulse control.",
      notes: "Pulls on leash. Eats everything. Absolute sweetheart.",
      vetInfo: {
        clinicName: "Karlín Veterinary Clinic",
        vetPhone: "+420 224 815 003",
        lastCheckup: "2026-03-05",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-10-12", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-10-12", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-10-12", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-10-12", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-10-12", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-04-02",
        spayedNeutered: true,
        conditions: "None. Watch food intake — will eat anything not nailed down.",
      },
    },
  ],
};

/**
 * Lena Marešová — The Marketplace Owner archetype (CCFT 2026-05-13).
 *
 * Software engineer in Letná. Joined Doggo a few months ago when she
 * adopted Asha, attended some meets to scout for a walker (that's how
 * she found Pawel), and has since settled into a pure-care relationship:
 * recurring weekday walks through Pawel's pack, the occasional Letná
 * meet she's stayed marked Interested in but rarely attends. She has
 * group memberships and connections from that earlier scouting phase —
 * she's not socially isolated, just not currently engaged. The
 * community thread served its purpose (find a trusted carer); the care
 * thread is her ongoing relationship with the app.
 *
 * Why she exists: pressure-tests the community-first thesis. Doggo's
 * pitch is "trust through community → care." Lena demonstrates the
 * funnel *working all the way through* — past meet attendance, current
 * care booking, no future meet engagement. The DiscoveryBanner on
 * `/home` is the polite "have you seen this week's meets?" nudge for
 * exactly her shape of usage — graduated, not absent. See User
 * Archetypes → "The Marketplace Owner."
 */
export const lena: UserProfile = {
  id: "lena",
  firstName: "Lena",
  lastName: "Marešová",
  email: "lena.maresova@email.cz",
  avatarUrl: "/images/generated/anezka-profile.jpeg",
  bio: "Software engineer in Letná. Adopted Asha last year — found Pawel through a recall-training meet and never looked back. Mostly heads-down at work these days; Asha gets her social life through Pawel's pack.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Letná",
  memberSince: "2026-01",
  profileVisibility: "locked",
  tagApproval: "approve",
  openToHelping: false,
  shareCode: "lena-9pt7",
  pets: [
    {
      id: "asha",
      name: "Asha",
      breed: "Vizsla mix",
      weightLabel: "22 kg",
      ageLabel: "3 years",
      imageUrl: "/images/generated/sam-portrait.jpeg",
      energyLevel: "very_high",
      playStyles: ["fetch", "chase"],
      socialisationNotes: "Friendly with everyone but high-strung — needs movement, not chaos. Best with calm, focused walks.",
      notes: "Rescue from a hunting kennel. Needs 90+ minutes of real exercise daily or she'll redecorate the apartment.",
      vetInfo: {
        clinicName: "Letná Veterinary Centre",
        vetPhone: "+420 222 942 318",
        lastCheckup: "2026-03-22",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-07-18", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-07-18", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-07-18", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-07-18", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-07-18", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-03-22",
        spayedNeutered: true,
        conditions: "None.",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   SUPPORTING CAST (15+)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Vinohrady / Riegrovy Sady Cluster ─────────────────────────────────── */

/**
 * Pawel Kowalski — professional group-walker, Vinohrady. Runs the open
 * care group `group-pawel-walks` ("Pawel's Prague Pack"). Promoted from
 * a provider-only reference to a full `UserProfile` 2026-05-13 (CCFT
 * Marketplace-Owner persona work) so Lena's booking + conversation
 * bridges have a real user record to resolve. No own dog seeded — he
 * walks 30+ dogs a week, that's the lifestyle.
 */
export const pawel: UserProfile = {
  id: "pawel",
  firstName: "Pawel",
  lastName: "Kowalski",
  email: "pawel@pragueprack.cz",
  avatarUrl: "/images/generated/marek-profile.jpeg",
  bio: "Group walks across Prague's best parks. Six dogs max, GPS tracking, photo updates every walk. Booked solid most weeks — that's how I know it's working.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-12",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  shareCode: "pawel-walks",
  pets: [],
};

export const marek: UserProfile = {
  id: "marek",
  firstName: "Marek",
  lastName: "Dvořák",
  email: "marek.dvorak@email.cz",
  avatarUrl: AV.marek,
  bio: "Mornings at Riegrovy with Benny before work — same loop, same bench, same six dogs. Tereza pulled me into the Thursday walkers crew a year ago and I haven't missed many since. Quiet guy, but Benny knows everyone.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-09",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "benny",
      name: "Benny",
      breed: "Cocker Spaniel",
      weightLabel: "14 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/benny-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["sniffing", "fetch"],
      notes: "Gentle and sociable. Gets along with Franta perfectly.",
    },
  ],
};

export const lucie: UserProfile = {
  id: "lucie",
  firstName: "Lucie",
  lastName: "Černá",
  email: "lucie.cerna@email.cz",
  avatarUrl: AV.lucie,
  bio: "Thursday morning regular at Riegrovy. Pepík is small but thinks he's big.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-10",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "pepik",
      name: "Pepík",
      breed: "Dachshund",
      weightLabel: "7 kg",
      ageLabel: "6 years",
      imageUrl: "/images/generated/pepik-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["sniffing", "chase"],
      notes: "Confident little guy. Barks at dogs 3× his size, then plays with them.",
    },
  ],
};

export const jakub: UserProfile = {
  id: "jakub",
  firstName: "Jakub",
  lastName: "Šťastný",
  email: "jakub.stastny@email.cz",
  avatarUrl: AV.jakub,
  bio: "Aron and I are weekend regulars at Riegrovy when the weather's reasonable. Big German Shepherd with a working-dog brain — he picks his friends carefully but is loyal once you're in. We tend to keep to ourselves but he's always up for a polite hello.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-12",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "aron",
      name: "Aron",
      breed: "German Shepherd",
      weightLabel: "34 kg",
      ageLabel: "3 years",
      imageUrl: "/images/generated/aron-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["fetch", "tug", "chase"],
      notes: "Well-trained but needs space. Selective with dog friends.",
    },
  ],
};

export const zuzana: UserProfile = {
  id: "zuzana",
  firstName: "Zuzana",
  lastName: "Králová",
  email: "zuzana.kralova@email.cz",
  avatarUrl: AV.zuzana,
  bio: "Just moved to Vinohrady. Lucie invited me to the evening walkers group and Mia has already found her crew.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2026-03",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "mia",
      name: "Mia",
      breed: "Miniature Poodle",
      weightLabel: "5 kg",
      ageLabel: "2 years",
      imageUrl: "/images/generated/mia-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["chase", "sniffing"],
      notes: "Tiny but brave. Loves other small dogs.",
    },
  ],
};

/* ── Karlín / Žižkov Cluster ───────────────────────────────────────────── */

export const petra: UserProfile = {
  id: "petra",
  firstName: "Petra",
  lastName: "Veselá",
  email: "petra.vesela@email.cz",
  avatarUrl: AV.petra,
  bio: "Karlín local. Started the Dog Neighbors group so we could coordinate walks and help each other out. I do occasional sitting for people I know.",
  location: "Prague 8, Czech Republic",
  neighbourhood: "Karlín",
  memberSince: "2025-07",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  pets: [
    {
      id: "daisy",
      name: "Daisy",
      breed: "Cavalier King Charles Spaniel",
      weightLabel: "8 kg",
      ageLabel: "5 years",
      imageUrl: "/images/generated/daisy-portrait.jpeg",
      energyLevel: "low",
      playStyles: ["sniffing"],
      notes: "Gentle soul. Great with puppies and nervous dogs.",
    },
  ],
  carerProfile: {
    bio: "Happy to watch your dog at my place in Karlín. Small dogs preferred. I know most of the regulars here.",
    location: "Prague 8 – Karlín",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 120,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my flat in Karlín. Fenced balcony. Max 2 dogs at a time.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 20 },
          { kind: "last_minute", enabled: true, pct: 10, thresholdDays: 3 },
        ],
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 480,
        priceUnit: "per_night",
        subServices: ["Special feeding", "Medication"],
        notes: "Overnight stays at my flat. Fenced balcony. Max 2 dogs at a time. People I know first.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 20 },
          { kind: "last_minute", enabled: true, pct: 10, thresholdDays: 3 },
        ],
      },
    ],
    publicProfile: false,
    visibility: "connected_only",
    acceptingBookings: true,
  },
};

export const ondrej: UserProfile = {
  id: "ondrej",
  firstName: "Ondřej",
  lastName: "Malý",
  email: "ondrej.maly@email.cz",
  avatarUrl: AV.ondrej,
  bio: "Rocky and I are at the Karlín riverfront every morning. Staffie dad, proud of it.",
  location: "Prague 8, Czech Republic",
  neighbourhood: "Karlín",
  memberSince: "2025-11",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "rocky",
      name: "Rocky",
      breed: "Staffordshire Bull Terrier mix",
      weightLabel: "22 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/rocky-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["tug", "wrestling", "fetch"],
      notes: "Big softie. Loves kids and other dogs. Gets a bad rep for his breed but he's a marshmallow.",
    },
  ],
};

export const adela: UserProfile = {
  id: "adela",
  firstName: "Adéla",
  lastName: "Fišerová",
  email: "adela.fiserova@email.cz",
  avatarUrl: AV.adela,
  bio: "Číča and I explore Vítkov and Karlín. She's aloof, I'm friendly — we balance each other out.",
  location: "Prague 8, Czech Republic",
  neighbourhood: "Karlín",
  memberSince: "2026-01",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "cica",
      name: "Číča",
      breed: "Shiba Inu",
      weightLabel: "10 kg",
      ageLabel: "3 years",
      imageUrl: "/images/generated/cica-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["chase", "sniffing"],
      notes: "Independent. Selective about dog friends. Incredible side-eye.",
    },
  ],
};

/* ── Holešovice / Stromovka Cluster ────────────────────────────────────── */

export const martin: UserProfile = {
  id: "martin",
  firstName: "Martin",
  lastName: "Horák",
  email: "martin.horak@email.cz",
  avatarUrl: AV.martin,
  bio: "Regular at the Stromovka morning walk with Charlie. Also pop over to Letná during the week.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-09",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "charlie",
      name: "Charlie",
      breed: "French Bulldog",
      weightLabel: "12 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/charlie-portrait.jpeg",
      energyLevel: "low",
      playStyles: ["sniffing"],
      notes: "Low energy, big personality. Overheats easily in summer.",
    },
  ],
};

export const eva: UserProfile = {
  id: "eva",
  firstName: "Eva",
  lastName: "Součková",
  email: "eva.souckova@email.cz",
  avatarUrl: AV.eva,
  bio: "Two-dog household — Luna and Max keep me busy. Active in Stromovka walks and the reactive dog support group. Luna has some leash reactivity so I get it.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-08",
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "luna",
      name: "Luna",
      breed: "Border Collie mix",
      weightLabel: "18 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/luna-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["fetch", "chase", "tug"],
      notes: "Leash-reactive but fine off-leash. Great recall. Helps with training demos.",
    },
    {
      id: "max-dog",
      name: "Max",
      breed: "Labrador mix",
      weightLabel: "28 kg",
      ageLabel: "6 years",
      imageUrl: "/images/generated/max-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["fetch", "sniffing"],
      notes: "Calm old soul. Good influence on Luna.",
    },
  ],
};

export const filip: UserProfile = {
  id: "filip",
  firstName: "Filip",
  lastName: "Novotný",
  email: "filip.novotny@email.cz",
  avatarUrl: AV.filip,
  bio: "Toby is a tiny tornado. Klára's training sessions have been a game-changer for his recall.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-11",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "toby",
      name: "Toby",
      breed: "Jack Russell Terrier",
      weightLabel: "7 kg",
      ageLabel: "2 years",
      imageUrl: "/images/generated/toby-portrait.jpeg",
      energyLevel: "very_high",
      playStyles: ["chase", "tug", "fetch"],
      socialisationNotes: "Bombproof with other dogs — confident and friendly, plays well in a group. Just needs to burn energy.",
      notes: "Needs a LOT of exercise. Recall is improving thanks to training.",
    },
  ],
};

/**
 * Magda Vondráková — Neighborhood Hub Member archetype, added 2026-05-14.
 * Admin of "Holešovice Dog Block", a tight private neighbour group. Open
 * profile — socially comfortable. In Demo Narrative V2 she is a *supporting
 * character*, not a POV persona: Daniel meets her on Klára's Stromovka walk
 * and marks her Familiar; she sends him a connection request + a message
 * inviting him into her group. See [[Demo Narrative]] Beat 3.
 */
export const magda: UserProfile = {
  id: "magda",
  firstName: "Magda",
  lastName: "Vondráková",
  email: "magda.vondrakova@email.cz",
  avatarUrl: "/images/generated/magda-profile.jpeg",
  bio: "Holešovice for fifteen years. Žofka and I started our block's WhatsApp group, then moved it here when half the messages were dog logistics anyway. We're a small crew but we look out for each other and each other's dogs.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-09",
  profileVisibility: "open",
  tagApproval: "auto",
  shareCode: "magda-h7v9",
  pets: [
    {
      id: "zofka",
      name: "Žofka",
      breed: "Schnauzer mix",
      weightLabel: "11 kg",
      ageLabel: "6 years",
      imageUrl: "/images/generated/zofka-portrait.jpeg",
      energyLevel: "moderate",
      playStyles: ["sniffing", "fetch"],
      socialisationNotes: "Friendly with everyone, prefers calm dogs over rowdy ones. Knows half the dogs on the block by name (well — by smell).",
      notes: "Easy with kids and other dogs. Good around the flat — happy to nap if no walks are happening.",
      vetInfo: {
        clinicName: "Veterina Holešovice",
        vetPhone: "+420 220 879 432",
        lastCheckup: "2026-02-18",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-09-02", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-09-02", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-09-02", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-09-02", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-09-02", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-02-18",
        spayedNeutered: true,
        conditions: "Healthy. A bit of arthritis starting in the back left — easy walks only.",
      },
    },
  ],
};

/**
 * Veronika Krásná — Casual Carer archetype, added 2026-05-14. Holešovice
 * Dog Block member; works from home, so she has flexibility. Open profile,
 * Carer dial barely turned (`publicProfile: false` — circle audience only,
 * doesn't appear in `/discover/care`). In Demo Narrative V2 she is the
 * circle-care moment of Beat 3: Daniel, newly in the group, books her for a
 * routine neighbourhood walk — the "good fences make good neighbours"
 * thesis.
 */
export const veronika: UserProfile = {
  id: "veronika",
  firstName: "Veronika",
  lastName: "Krásná",
  email: "veronika.krasna@email.cz",
  avatarUrl: "/images/generated/veronika-profile.jpeg",
  bio: "Translator working from home in Holešovice. Kuba is twelve and very chill — happy to share my flat with calm dogs from the block when neighbours need a hand. I keep things small and informal.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-10",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  shareCode: "veronika-k4x2",
  pets: [
    {
      id: "kuba",
      name: "Kuba",
      breed: "Cocker Spaniel",
      weightLabel: "13 kg",
      ageLabel: "12 years",
      imageUrl: "/images/generated/kuba-portrait.jpeg",
      energyLevel: "low",
      playStyles: ["sniffing"],
      socialisationNotes: "Old gentleman. Calm with every dog he meets — the kind of dog you bring around an anxious puppy.",
      notes: "Twelve years young. Two short walks a day; otherwise a master napper.",
    },
  ],
  carerProfile: {
    bio: "Drop-ins and short walks for Holešovice Dog Block neighbours. I work from home so I can usually fit a same-day visit. Calm dogs only — Kuba's old and he sets the house tone.",
    location: "Prague 7 – Holešovice",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Tue", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Thu", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon", "evening"] },
      { day: "Sat", slots: ["afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 200,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit", "Solo walk"],
        notes: "Drop-in visits or short solo walks for neighbours' dogs. Holešovice Dog Block members only.",
        modifiers: [],
        // Walk Service Delivery, 2026-05-20. Neighbourhood-scale carer
        // (Holešovice Dog Block) — both methods, minimal pickup uplift.
        deliveryOptions: [
          { method: "dropoff", price: 200 },
          { method: "pickup", price: 220 },
        ],
      },
      {
        kind: "care",
        serviceType: "house_sitting",
        enabled: true,
        pricePerUnit: 220,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit"],
        notes: "I can come to your flat for an evening or overnight. Same-day is usually fine if I'm around.",
        modifiers: [],
      },
    ],
    publicProfile: false,
    visibility: "connected_only",
    acceptingBookings: true,
  },
};

/* ── Reactive Dog Support Members ──────────────────────────────────────── */

export const hana: UserProfile = {
  id: "hana",
  firstName: "Hana",
  lastName: "Pokorná",
  email: "hana.pokorna@email.cz",
  avatarUrl: AV.hana,
  bio: "Runa and I have been in the reactive dog group since the beginning. She recommended Klára's sessions to Daniel and it changed everything for Bára.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2025-10",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "runa",
      name: "Runa",
      breed: "Husky mix",
      weightLabel: "24 kg",
      ageLabel: "5 years",
      imageUrl: "/images/generated/runa-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["chase", "wrestling"],
      notes: "Reactive to small dogs. Fine with medium/large. Dramatic vocal range.",
    },
  ],
};

export const vitek: UserProfile = {
  id: "vitek",
  firstName: "Vítek",
  lastName: "Bartoš",
  email: "vitek.bartos@email.cz",
  avatarUrl: AV.vitek,
  bio: "Sam and I are lurkers turned regulars. The small-group walks changed everything for his confidence.",
  location: "Prague 5, Czech Republic",
  neighbourhood: "Smíchov",
  memberSince: "2026-01",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "sam",
      name: "Sam",
      breed: "Mixed breed",
      weightLabel: "16 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/sam-portrait.jpeg",
      energyLevel: "low",
      playStyles: ["sniffing"],
      notes: "Fearful of new dogs and loud noises. Improving with slow exposure.",
    },
  ],
};

export const anezka: UserProfile = {
  id: "anezka",
  firstName: "Anežka",
  lastName: "Veselá",
  email: "anezka.vesela@email.cz",
  avatarUrl: AV.anezka,
  bio: "Active in the reactive dog support group. Nela and I share what we've learned — it helps us both.",
  location: "Prague 3, Czech Republic",
  neighbourhood: "Žižkov",
  memberSince: "2025-11",
  profileVisibility: "locked",
  tagApproval: "auto",
  pets: [
    {
      id: "nela",
      name: "Nela",
      breed: "German Shepherd",
      weightLabel: "30 kg",
      ageLabel: "5 years",
      imageUrl: "/images/generated/nela-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["fetch", "tug"],
      notes: "Leash-reactive to other dogs. Off-leash is fine. Incredible with people and kids.",
    },
  ],
};

/* ── Additional Supporting Characters ──────────────────────────────────── */

export const jana: UserProfile = {
  id: "jana",
  firstName: "Jana",
  lastName: "Krejčí",
  email: "jana.krejci@email.cz",
  avatarUrl: AV.jana,
  bio: "Cross-neighbourhood walker — Rex and I do Vinohrady in the morning, Stromovka on weekends. I know everyone's dog.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-07",
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "rex",
      name: "Rex",
      breed: "Labrador Retriever",
      weightLabel: "30 kg",
      ageLabel: "3 years",
      imageUrl: "/images/generated/rex-portrait.jpeg",
      energyLevel: "high",
      playStyles: ["fetch", "tug", "wrestling"],
      notes: "Social butterfly. Will play with anyone.",
    },
  ],
};

export const nikola: UserProfile = {
  id: "nikola",
  firstName: "Nikola",
  lastName: "Rada",
  email: "nikola.rada@email.cz",
  avatarUrl: AV.nikola,
  bio: "Professional dog boarder. No dog of my own — I'm the one who takes care of yours. Spacious flat in Letná with a garden.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Letná",
  memberSince: "2025-05",
  profileVisibility: "open",
  tagApproval: "auto",
  openToHelping: true,
  pets: [],
  carerProfile: {
    bio: "Home boarding in Letná. Spacious flat with private garden. Max 3 dogs at a time. Daily photo updates. 8 years experience.",
    location: "Prague 7 – Letná",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Tue", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Thu", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon", "evening"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 480,
        priceUnit: "per_night",
        subServices: [],
        notes: "Garden access. Daily walks in Letenské sady. Photo updates.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 30 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
          { kind: "last_minute", enabled: true, pct: 15, thresholdDays: 5 },
        ],
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 5,
      firstAidTrained: true,
      insured: true,
    },
    repeatClients: 8,
  },
};

export const marie: UserProfile = {
  id: "marie",
  firstName: "Marie",
  lastName: "Nováková",
  email: "marie.novakova@email.cz",
  avatarUrl: AV.marie,
  bio: "Marie here — Molly's human. We're in Letná and I'm at the office most days, so I've been looking for someone reliable to walk her while I work. She's an easy lab, food-motivated, walks like a dream on leash. New to the app and figuring out who's around.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Letná",
  memberSince: "2026-01",
  profileVisibility: "locked",
  tagApproval: "approve",
  pets: [
    {
      id: "molly",
      name: "Molly",
      breed: "Labrador Retriever",
      weightLabel: "27 kg",
      ageLabel: "4 years",
      imageUrl: "https://images.unsplash.com/photo-1579213838058-4815d1da7b8d?auto=format&fit=crop&w=400&q=80",
      energyLevel: "moderate",
      playStyles: ["fetch", "sniffing"],
      notes: "Easy-going, food-motivated, good on leash.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   FORMER DEFAULT — Shawn (now a regular community member)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Shawn — formerly the default persona, removed from the persona switcher
 * 2026-04-26. The actual developer's name shouldn't double as a demo
 * character (confusing for testers), and Tereza better represents the
 * routine-owner happy path. Mock data references to "shawn" are intact —
 * he's still a Vinohrady regular in the world (organises walks, owns Spot
 * & Goldie, offers neighbourhood walks). Just no longer a "view as" option.
 */
export const shawn: UserProfile = {
  id: "shawn",
  firstName: "Shawn",
  lastName: "Talvacchia",
  email: "stalvacchia@gmail.com",
  avatarUrl: AV.shawn,
  bio: "Dog dad and remote worker based in Prague 2. I love exploring Vinohrady and Žižkov parks with my dogs and am always looking for reliable, caring people to help out when I'm busy or travelling.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-01",
  pets: [
    {
      id: "spot",
      name: "Spot",
      breed: "Dalmatian Mix",
      weightLabel: "18 kg",
      ageLabel: "4 years",
      imageUrl: "/images/generated/spot-portrait.jpeg",
      notes: "Friendly but can be nervous with new dogs. Loves fetch and long walks.",
      energyLevel: "high",
      playStyles: ["fetch", "chase", "sniffing"],
      socialisationNotes:
        "Great with people and kids. Can be nervous meeting new dogs — needs slow intros. Once comfortable, plays well in small groups. Does best with calm, confident dogs.",
      vetInfo: {
        clinicName: "VetClinic Praha 2",
        vetPhone: "+420 222 333 444",
        lastCheckup: "2026-01-15",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-06-20", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-06-20", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-06-20", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-06-20", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-06-20", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2025-12-10",
        spayedNeutered: true,
        medications: "",
        conditions: "Mild skin allergies (seasonal). Managed with diet.",
      },
      photoGallery: [
        "/images/generated/spot-park-walk.jpeg",
        "/images/generated/spot-resting.jpeg",
        "/images/generated/spot-portrait.jpeg",
      ],
    },
    {
      id: "goldie",
      name: "Goldie",
      breed: "Golden Retriever",
      weightLabel: "28 kg",
      ageLabel: "2 years",
      imageUrl: "/images/generated/goldie-portrait.jpeg",
      notes: "Very social, gets along with everyone. Still learning to walk nicely on leash.",
      energyLevel: "very_high",
      playStyles: ["fetch", "tug", "wrestling", "chase"],
      socialisationNotes:
        "Loves every dog and person she meets. Can be a bit over-enthusiastic with greetings — working on polite hellos. Excellent with children, very gentle indoors.",
      vetInfo: {
        clinicName: "VetClinic Praha 2",
        vetPhone: "+420 222 333 444",
        lastCheckup: "2026-02-20",
        vaccinations: [
          { type: "rabies", lastGivenAt: "2025-10-30", confidence: "self-declared" },
          { type: "parvovirus", lastGivenAt: "2025-10-30", confidence: "self-declared" },
          { type: "distemper", lastGivenAt: "2025-10-30", confidence: "self-declared" },
          { type: "hepatitis", lastGivenAt: "2025-10-30", confidence: "self-declared" },
          { type: "parainfluenza", lastGivenAt: "2025-10-30", confidence: "self-declared" },
        ],
        vaccinationsAcknowledgedAt: "2026-03-01",
        spayedNeutered: false,
        medications: "",
        conditions: "",
      },
      photoGallery: [
        "/images/generated/goldie-playing.jpeg",
        "/images/generated/goldie-leash.jpeg",
      ],
    },
  ],
  tagApproval: "auto",
  profileVisibility: "open",
  shareCode: "shawn-x7k9",
  openToHelping: true,
  carerProfile: {
    bio: "I offer daily dog walks in the Vinohrady and Žižkov area. I have experience with dogs of all sizes and genuinely enjoy spending time with them.",
    location: "Prague 2 – Vinohrady",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning"] },
      { day: "Wed", slots: ["morning", "afternoon"] },
      { day: "Thu", slots: ["morning"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 280,
        priceUnit: "per_visit",
        subServices: ["Solo walk", "Group walk"],
        notes: "45–60 min walks around Riegrovy sady and Vítkov park. Max 3 dogs.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 100 },
        ],
        // Walk Service Delivery, 2026-05-20.
        deliveryOptions: [
          { method: "dropoff", price: 280 },
          { method: "pickup", price: 340 },
        ],
      },
    ],
    publicProfile: true,
    visibility: "connected_only",
    acceptingBookings: true,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   APPOINTMENT-TYPE EXEMPLAR
   Minimal grooming-salon profile to prove the Appointment offering shape
   renders. Originally seeded as a vet (Discover & Care C3, 2026-05-02);
   repurposed as a groomer during Discover Refinement walkthrough (D1,
   2026-05-10) to align the demo with the Open Q §6 strategic call that
   vets are post-MVP at best (sticky existing PMS systems, less community-
   shaped relationship). The const name `lenkaVet` + ID `lenka-vet` are
   retained to avoid an invasive rename across every mock-data reference;
   the entity itself is now Lenka the groomer. Co-provider on the
   Mánesova Grooming Salon group, which seeds multi-provider data for the
   B3 hero variant.
   ═══════════════════════════════════════════════════════════════════════════ */

export const lenkaVet: UserProfile = {
  id: "lenka-vet",
  firstName: "Lenka",
  lastName: "Nováková",
  email: "lenka.novakova@manesova-grooming.cz",
  avatarUrl: AV.zuzana,
  bio: "Salon groomer in Vinohrady. 8 years working with anxious and reactive dogs — calm-handling and force-free methods, never restraints or muzzles.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-09",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Mánesova Grooming Salon, Vinohrady. I specialise in nervous dogs — long initial sessions, breaks whenever they need them, and no muzzling. Booking by appointment; same-week availability for established clients.",
    location: "Mánesova 67, Prague 2",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning", "afternoon"] },
      { day: "Wed", slots: ["morning"] },
      { day: "Thu", slots: ["morning", "afternoon"] },
      { day: "Fri", slots: ["morning"] },
    ],
    services: [
      {
        kind: "appointment",
        id: "lenka-grooming-full",
        title: "Full groom — small/medium breed",
        enabled: true,
        pricePerAppointment: 800,
        durationMinutes: 60,
        appointmentCategory: "grooming",
        notes: "Bath, brush-out, full clip, nails, ears. 60–75 min. Anxious dogs welcome — we go at their pace.",
      },
      {
        kind: "appointment",
        id: "lenka-grooming-bath",
        title: "Bath & brush",
        enabled: true,
        pricePerAppointment: 500,
        durationMinutes: 45,
        appointmentCategory: "grooming",
        notes: "Bath, blow-dry, brush-out, nails. Good for between-grooms maintenance or first-time visitors getting comfortable with the salon.",
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 8,
      certifications: ["Force-free grooming certification"],
      firstAidTrained: true,
      insured: true,
      identityVerified: true,
    },
    repeatClients: 6,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROMOTED DIRECTORY CARERS
   Bridged from `mockData.ts` ProviderCards to full UserProfiles with proper
   carerProfile.services arrays. Started with `olga-m` + `marketa-h` (Pricing
   & Proposals walkthrough A5, 2026-05-04). Discover Refinement B (2026-05-10)
   completed the bridge for the remaining seven (`jana-k`, `tomas-b`,
   `pavel-d`, `simona-v`, `martin-k`, `lenka-s`, `petr-v`).

   Bridge contract status: **every provider in `/discover/care` is now a real
   user.** `getUserOrProvider`'s synthesis fallback exists for safety (any
   future directory-only entry) but no live ProviderCard hits it. Future
   Supabase migration will collapse the two registries into one users table.

   All bridged carers are `publicProfile: true` (they're listed in
   `/discover/care`, which is the public-audience surface — there is no
   "Helper tier" distinction anymore; see Carer audience model in
   `docs/strategy/Groups & Care Model.md` → "Carers on Profiles"). They're
   not on the persona switcher and not in the demo arc — just complete
   enough that their cards render with sub-services + notes + Book CTA like
   Petra/Nikola.
   ═══════════════════════════════════════════════════════════════════════════ */

export const olgaM: UserProfile = {
  id: "olga-m",
  firstName: "Olga",
  lastName: "M.",
  email: "olga.marik@email.cz",
  avatarUrl: "/images/generated/lucie-profile.jpeg",
  bio: "Smíchov-based pet sitter, 4 years caring for dogs in my flat and walking neighbourhood regulars. Calm with anxious dogs.",
  location: "Prague 5, Czech Republic",
  neighbourhood: "Smíchov",
  memberSince: "2025-04",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Pet sitting and walks in Smíchov. My flat is small/medium dog friendly, with a fenced courtyard. I've cared for 30+ dogs across the last 4 years.",
    location: "Prague 5 – Smíchov",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning", "afternoon"] },
      { day: "Wed", slots: ["morning"] },
      { day: "Thu", slots: ["morning", "afternoon"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 390,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "45–60 min walks around Smíchovský park or Petřín. Solo walks only.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 100 },
        ],
        pace: "moderate",
        leashPolicy: "always",
        // Walk Service Delivery, 2026-05-20. Smíchov flat — both methods.
        deliveryOptions: [
          { method: "dropoff", price: 390 },
          { method: "pickup", price: 470 },
        ],
      },
      {
        kind: "care",
        serviceType: "house_sitting",
        enabled: true,
        pricePerUnit: 350,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit", "Special feeding", "Medication"],
        notes: "I can come to your home for drop-in visits. Smíchov / Anděl / Malá Strana.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
      },
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 500,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my flat. Small/medium dogs only. Max 2 dogs at a time.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 4,
      firstAidTrained: true,
      insured: true,
    },
    repeatClients: 6,
  },
};

export const marketaH: UserProfile = {
  id: "marketa-h",
  firstName: "Markéta",
  lastName: "H.",
  email: "marketa.h@email.cz",
  avatarUrl: "/images/generated/tereza-profile.jpeg",
  bio: "Premium full-service pet care in Old Town. 12 years experience across walking, sitting, and home boarding. ID-verified, insured, first-aid trained.",
  location: "Prague 1, Czech Republic",
  neighbourhood: "Staré Město",
  memberSince: "2024-08",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Full-service care in Old Town since 2014. I run a small operation — never more than 2 dogs at a time — with a focus on calm, structured days.",
    location: "Prague 1 – Staré Město",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Tue", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Thu", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon", "evening"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 600,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "60–90 min walks across Vltava paths and Petřín. Solo or pair walks only.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 150 },
        ],
        pace: "moderate",
        leashPolicy: "always",
        // Walk Service Delivery, 2026-05-20. Premium full-service in Old Town.
        deliveryOptions: [
          { method: "dropoff", price: 600 },
          { method: "pickup", price: 720 },
        ],
      },
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 700,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my home. Quiet flat, calm routine, photo updates throughout.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        maxDogs: 2,
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 850,
        priceUnit: "per_night",
        subServices: ["Special feeding", "Medication"],
        notes: "Multi-night boarding at my home. Two daily walks, photo updates, consistent feeding schedule.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 30 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 250 },
          { kind: "last_minute", enabled: true, pct: 15, thresholdDays: 7 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        hasYard: false,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 12,
      firstAidTrained: true,
      insured: true,
      identityVerified: true,
    },
    repeatClients: 18,
  },
};

export const janaK: UserProfile = {
  id: "jana-k",
  firstName: "Jana",
  lastName: "K.",
  email: "jana.k@email.cz",
  avatarUrl: "/images/generated/eva-profile.jpeg",
  bio: "Patient pet care for shy and senior dogs in Dejvice. Six years of force-free, calm-handling experience.",
  location: "Prague 6, Czech Republic",
  neighbourhood: "Dejvice",
  memberSince: "2024-09",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Walks, drop-in visits, and home boarding for dogs who need a calmer setting. I've worked with anxious rescues and seniors for six years; my flat is quiet and on a residential street near Stromovka.",
    location: "Prague 6 – Dejvice",
    availability: [
      { day: "Mon", slots: ["morning", "evening"] },
      { day: "Tue", slots: ["morning", "evening"] },
      { day: "Wed", slots: ["morning", "evening"] },
      { day: "Thu", slots: ["morning", "evening"] },
      { day: "Fri", slots: ["morning", "evening"] },
      { day: "Sat", slots: ["morning", "evening"] },
      { day: "Sun", slots: ["morning"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 330,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "45 min solo walks. Great fit for shy or senior dogs who need patience.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
        ],
        pace: "leisurely",
        leashPolicy: "always",
        // Walk Service Delivery, 2026-05-20. Dejvice-based; both methods.
        deliveryOptions: [
          { method: "dropoff", price: 330 },
          { method: "pickup", price: 390 },
        ],
      },
      {
        kind: "care",
        serviceType: "house_sitting",
        enabled: true,
        pricePerUnit: 330,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit", "Special feeding", "Medication"],
        notes: "I come to your home for drop-ins or longer sits. Patient with shy and senior dogs.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
        ],
      },
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 430,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my flat — small/medium dogs only. Max 2 at once.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        maxDogs: 2,
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 700,
        priceUnit: "per_night",
        subServices: [],
        notes: "Multi-night boarding at my home. Quiet flat, two daily walks, photo updates throughout.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 150 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        hasYard: false,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 6,
      methodology: "Force-free, calm-handling",
      certifications: ["Certified Trainer"],
      firstAidTrained: true,
    },
    repeatClients: 4,
  },
};

export const tomasB: UserProfile = {
  id: "tomas-b",
  firstName: "Tomáš",
  lastName: "B.",
  email: "tomas.b@email.cz",
  avatarUrl: "/images/generated/shawn-profile.jpg",
  bio: "Solo walks with a trainer's touch. Žižkov-based, three years in.",
  location: "Prague 3, Czech Republic",
  neighbourhood: "Žižkov",
  memberSince: "2025-02",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Solo walks only — I work on loose-leash and recall during the walk so your dog comes back calmer than they left. Žižkov, Vinohrady, and Riegrovy Sady are my regular routes.",
    location: "Prague 3 – Žižkov",
    availability: [
      { day: "Mon", slots: ["morning", "evening"] },
      { day: "Tue", slots: ["morning", "evening"] },
      { day: "Wed", slots: ["morning", "evening"] },
      { day: "Thu", slots: ["morning", "evening"] },
      { day: "Fri", slots: ["morning", "evening"] },
      { day: "Sat", slots: ["morning"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 520,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "60 min solo walks with light training reinforcement (loose leash, recall). One dog per walk.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
        pace: "moderate",
        leashPolicy: "case_by_case",
        // Walk Service Delivery, 2026-05-20. Žižkov-based; both methods.
        deliveryOptions: [
          { method: "dropoff", price: 520 },
          { method: "pickup", price: 620 },
        ],
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 3,
      certifications: ["Certified Trainer"],
    },
    repeatClients: 3,
  },
};

export const pavelD: UserProfile = {
  id: "pavel-d",
  firstName: "Pavel",
  lastName: "D.",
  email: "pavel.d@email.cz",
  avatarUrl: "/images/generated/daniel-profile.jpeg",
  bio: "Family home in Karlín — sociable dogs always welcome. Five years of walks and weekend boarding.",
  location: "Prague 8, Czech Republic",
  neighbourhood: "Karlín",
  memberSince: "2024-11",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Walks around Karlín and weekend boarding at our family home. We have a small fenced garden and our own well-socialised dog, so guests need to be friendly with other dogs.",
    location: "Prague 8 – Karlín",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning", "afternoon"] },
      { day: "Wed", slots: ["morning", "afternoon"] },
      { day: "Thu", slots: ["morning", "afternoon"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 440,
        priceUnit: "per_visit",
        subServices: ["Group walk", "Solo walk"],
        notes: "45–60 min walks. Group walks (max 3 dogs) preferred — your dog should be friendly with others.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
        pace: "moderate",
        leashPolicy: "always",
        // Walk Service Delivery, 2026-05-20. Karlín-based; both methods.
        deliveryOptions: [
          { method: "dropoff", price: 440 },
          { method: "pickup", price: 520 },
        ],
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 720,
        priceUnit: "per_night",
        subServices: [],
        notes: "Weekend or multi-night boarding at our family home. Sociable dogs only — we have our own dog. Garden access.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 30 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
          { kind: "last_minute", enabled: true, pct: 15, thresholdDays: 5 },
        ],
        homeType: "house",
        hasOwnDogs: true,
        hasYard: true,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 5,
      insured: true,
    },
    repeatClients: 5,
  },
};

export const simonaV: UserProfile = {
  id: "simona-v",
  firstName: "Simona",
  lastName: "V.",
  email: "simona.v@email.cz",
  avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
  bio: "Calm, attentive home sitter in Nusle. Seven years, ID-verified, first-aid trained.",
  location: "Prague 4, Czech Republic",
  neighbourhood: "Nusle",
  memberSince: "2023-06",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Day sitting and overnight boarding at my Nusle flat. I work from home so dogs are rarely alone. Calm routine, photo updates throughout the day.",
    location: "Prague 4 – Nusle",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Tue", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Thu", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon", "evening"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 350,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my flat — calm, low-traffic environment. Small to medium dogs only.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 100 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        maxDogs: 2,
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 620,
        priceUnit: "per_night",
        subServices: [],
        notes: "Overnight or multi-night boarding. Two daily walks in Folimanka park. Detailed photo updates.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 180 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        hasYard: false,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 7,
      firstAidTrained: true,
      identityVerified: true,
    },
    repeatClients: 9,
  },
};

export const martinK: UserProfile = {
  id: "martin-k",
  firstName: "Martin",
  lastName: "K.",
  email: "martin.k@email.cz",
  avatarUrl: "/images/generated/martin-profile.jpeg",
  bio: "Active walks and reliable boarding by the river — Holešovice based. Four years, insured.",
  location: "Prague 7, Czech Republic",
  neighbourhood: "Holešovice",
  memberSince: "2024-12",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Long walks around Stromovka and the Vltava embankment, plus weekend boarding at my flat near Letná. Active dogs welcome — I run.",
    location: "Prague 7 – Holešovice",
    availability: [
      { day: "Mon", slots: ["morning", "evening"] },
      { day: "Tue", slots: ["morning", "evening"] },
      { day: "Wed", slots: ["morning", "evening"] },
      { day: "Thu", slots: ["morning", "evening"] },
      { day: "Fri", slots: ["morning", "evening"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 480,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "60–90 min active walks. Stromovka or Vltava paths. I can bring your dog on my own runs (consult first).",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
        pace: "brisk",
        leashPolicy: "off_leash_areas",
        // Walk Service Delivery, 2026-05-20. Holešovice-based; both methods.
        deliveryOptions: [
          { method: "dropoff", price: 480 },
          { method: "pickup", price: 570 },
        ],
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 750,
        priceUnit: "per_night",
        subServices: [],
        notes: "Weekend or multi-night boarding. Two long walks daily, river access. Active dogs preferred.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        hasYard: false,
        maxDogs: 2,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 4,
      insured: true,
    },
    repeatClients: 4,
  },
};

export const lenkaS: UserProfile = {
  id: "lenka-s",
  firstName: "Lenka",
  lastName: "S.",
  email: "lenka.s@email.cz",
  avatarUrl: "/images/generated/jana-profile.jpeg",
  bio: "Affordable care for all dogs in Vršovice — walks and overnight stays. Three years.",
  location: "Prague 10, Czech Republic",
  neighbourhood: "Vršovice",
  memberSince: "2025-03",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Walks, day sitting, and overnight boarding in Vršovice. I'm a student so I have flexible afternoons. Modest rates, all sizes welcome.",
    location: "Prague 10 – Vršovice",
    availability: [
      { day: "Mon", slots: ["afternoon"] },
      { day: "Tue", slots: ["afternoon"] },
      { day: "Wed", slots: ["morning", "afternoon"] },
      { day: "Thu", slots: ["afternoon"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "walks_checkins",
        enabled: true,
        pricePerUnit: 310,
        priceUnit: "per_visit",
        subServices: ["Solo walk"],
        notes: "45 min walks around Heroldovy sady or Bohemians stadium area.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
        ],
        pace: "leisurely",
        leashPolicy: "always",
        // Walk Service Delivery, 2026-05-20. Vršovice-based; both methods.
        deliveryOptions: [
          { method: "dropoff", price: 310 },
          { method: "pickup", price: 370 },
        ],
      },
      {
        kind: "care",
        serviceType: "house_sitting",
        enabled: true,
        pricePerUnit: 310,
        priceUnit: "per_visit",
        subServices: ["Drop-in visit", "Special feeding", "Medication"],
        notes: "Drop-in visits at your home — Vršovice and Vinohrady. Quiet handling.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 10 },
        ],
      },
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 410,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my flat. Cosy and quiet — I study from home.",
        modifiers: [],
        homeType: "flat",
        hasOwnDogs: false,
        maxDogs: 1,
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 640,
        priceUnit: "per_night",
        subServices: ["Special feeding", "Medication"],
        notes: "Overnight stays at my flat. Mostly student schedule so dogs get plenty of attention.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 20 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 130 },
        ],
        homeType: "flat",
        hasOwnDogs: false,
        hasYard: false,
        maxDogs: 1,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 3,
    },
    repeatClients: 3,
  },
};

export const petrV: UserProfile = {
  id: "petr-v",
  firstName: "Petr",
  lastName: "V.",
  email: "petr.v@email.cz",
  avatarUrl: "/images/generated/tomas-profile.jpeg",
  bio: "Home away from home in Vysočany — sitting and boarding only. Eight years, ID-verified, insured, first-aid trained.",
  location: "Prague 9, Czech Republic",
  neighbourhood: "Vysočany",
  memberSince: "2022-11",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Day sitting and overnight boarding at my house in Vysočany — fenced garden, quiet residential street. Eight years of experience; I treat each booking like the dog is family.",
    location: "Prague 9 – Vysočany",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon", "evening"] },
      { day: "Tue", slots: ["morning", "afternoon", "evening"] },
      { day: "Wed", slots: ["morning", "afternoon", "evening"] },
      { day: "Thu", slots: ["morning", "afternoon", "evening"] },
      { day: "Fri", slots: ["morning", "afternoon", "evening"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning", "afternoon", "evening"] },
    ],
    services: [
      {
        kind: "care",
        serviceType: "day_care",
        enabled: true,
        pricePerUnit: 480,
        priceUnit: "per_visit",
        subServices: ["Special feeding", "Medication"],
        notes: "Daytime care at my house. Garden access, my own dog is friendly with all sizes.",
        modifiers: [
          { kind: "multi_pet", enabled: true, flatPerExtra: 150 },
        ],
        homeType: "house",
        hasOwnDogs: true,
        maxDogs: 3,
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 720,
        priceUnit: "per_night",
        subServices: [],
        notes: "Multi-night home boarding. Garden access, two daily walks, video updates each evening.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 30 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
          { kind: "last_minute", enabled: true, pct: 20, thresholdDays: 7 },
        ],
        homeType: "house",
        hasOwnDogs: true,
        hasYard: true,
        maxDogs: 3,
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 8,
      firstAidTrained: true,
      insured: true,
      identityVerified: true,
    },
    repeatClients: 7,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   REGISTRY & HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

export const allUsers: UserProfile[] = [
  tereza, daniel, klara, tomas, lena,
  pawel,
  marek, lucie, jakub, zuzana,
  petra, ondrej, adela,
  martin, eva, filip,
  magda, veronika,
  hana, vitek, anezka,
  jana, nikola, marie,
  shawn,
  lenkaVet,
  olgaM, marketaH,
  janaK, tomasB, pavelD, simonaV, martinK, lenkaS, petrV,
];

/** Quick lookup by user ID. */
const userMap = new Map<string, UserProfile>(allUsers.map((u) => [u.id, u]));

/**
 * Look up a full UserProfile by ID.
 *
 * Returns `undefined` for IDs that don't have a `UserProfile` in this
 * registry — most commonly providers from `mockData.ts` (`olga-m`, `jana-k`,
 * `marketa-h`, etc.) that exist as `ProviderCard` directory entries without
 * a full user profile. See `getUserOrProvider()` for the lookup that bridges
 * both registries (Mock World Building A1, 2026-04-30).
 *
 * Callers that only display a name + avatar should use the snapshot fields
 * already on the surrounding object (e.g. `Booking.carerName` /
 * `Booking.carerAvatarUrl`) rather than re-resolving the user — those
 * snapshots survive directory-only providers.
 */
export function getUserById(id: string): UserProfile | undefined {
  return userMap.get(id);
}

/**
 * Resolve a service `id` to the service config + its owning carer, scanning
 * every carer's catalogue. Used to resolve `Meet.linkedServices[].serviceId`
 * back to a service — works for Meet, Appointment, and (config #2) Care
 * services. Care services only carry an `id` when they're meet-linked, so
 * this finds exactly the linked ones. Service ↔ Meet Linkage, config #2.
 */
export function getServiceById(
  serviceId: string,
): { service: CarerServiceConfig; carer: UserProfile } | undefined {
  for (const u of allUsers) {
    const service = u.carerProfile?.services.find((s) => s.id === serviceId);
    if (service) return { service, carer: u };
  }
  return undefined;
}

/** Get display name for any user ID (falls back to ID if unknown). */
export function getUserName(id: string): string {
  const u = userMap.get(id);
  return u ? u.firstName : id;
}

/** Get avatar URL for any user ID. */
export function getUserAvatar(id: string): string {
  const u = userMap.get(id);
  return u?.avatarUrl ?? "";
}

/** Get all dogs across all users (excluding Shawn). */
export function getAllDogs() {
  return allUsers.flatMap((u) => u.pets.map((p) => ({ ...p, ownerId: u.id, ownerName: u.firstName })));
}

/** Get dog by ID across all users. */
export function getDogById(dogId: string) {
  for (const u of allUsers) {
    const dog = u.pets.find((p) => p.id === dogId);
    if (dog) return { ...dog, ownerId: u.id, ownerName: u.firstName };
  }
  return undefined;
}

/* ─── Provider bridge (Mock World Building D4) ───────────────────────────────
 * Some `ProviderCard` entries in `lib/mockData.ts` (`olga-m`, `jana-k`,
 * `marketa-h`, etc.) don't have full `UserProfile` entries here — they're
 * directory-only. `getUserOrProvider()` bridges the two registries for
 * callers that want a unified lookup.
 *
 * Resolution order:
 *   1. Match the ID in this `mockUsers` registry.
 *   2. Match a provider's `id` in `providers`, **or** a provider's `userId`
 *      bridge field if set (e.g. `nikola-r` bridges to user `nikola`).
 *   3. Synthesize a minimal `UserProfile` from the `ProviderCard` so the
 *      caller still gets a `firstName`/`avatarUrl`/`location` to render.
 *      Synthesized profiles have `pets: []`, no `bio`, no `carerProfile`.
 *
 * Returns `undefined` only when no match in either registry.
 */
import { providers as providerCards } from "./mockData";

export function getUserOrProvider(id: string): UserProfile | undefined {
  const direct = userMap.get(id);
  if (direct) return direct;

  // Match either the provider's own ID or its `userId` bridge field.
  const providerCard = providerCards.find(
    (p) => p.id === id || p.userId === id,
  );
  if (!providerCard) return undefined;

  // If the provider bridges to a real user, prefer that.
  if (providerCard.userId) {
    const bridged = userMap.get(providerCard.userId);
    if (bridged) return bridged;
  }

  // Synthesize a minimal UserProfile from ProviderCard data so callers can
  // render avatar/name/location without crashing.
  //
  // Discover Refinement (2026-05-10) bridged every live ProviderCard to a
  // real UserProfile, so this synthesis path is now defensive — kept in
  // case any future ProviderCard ships without a userId bridge.
  // `openToHelping: false` because the synthesis intentionally produces a
  // bare profile (no carerProfile, no services); a bare profile shouldn't
  // claim it's open to helping.
  const [firstName, ...rest] = providerCard.name.split(" ");
  return {
    id: providerCard.id,
    firstName: firstName ?? providerCard.name,
    lastName: rest.join(" "),
    email: "",
    avatarUrl: providerCard.avatarUrl,
    bio: providerCard.blurb ?? "",
    location: providerCard.district,
    neighbourhood: providerCard.neighborhood,
    memberSince: "",
    pets: [],
    profileVisibility: "open",
    tagApproval: "auto",
    openToHelping: false,
  };
}
