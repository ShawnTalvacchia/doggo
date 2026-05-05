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

import type { UserProfile } from "./types";

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
   JOURNEY USERS (4)
   ═══════════════════════════════════════════════════════════════════════════ */

export const tereza: UserProfile = {
  id: "tereza",
  firstName: "Tereza",
  lastName: "Nováková",
  email: "tereza.novakova@email.cz",
  avatarUrl: AV.tereza,
  bio: "Vinohrady regular with my beagle Franta. We do Riegrovy sady every morning and I run the Vinohrady Evening Walkers. Happy to dog-sit for friends in the neighbourhood.",
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
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 150,
        priceUnit: "per_visit",
        subServices: ["Day sitting"],
        notes: "Small/medium dogs only. My flat, or yours if nearby.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 80 },
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
  bio: "New-ish owner figuring things out with my rescue Bára. She's reactive with unfamiliar dogs, so we take things slow. The reactive dog support group has been a lifeline.",
  location: "Prague 5, Czech Republic",
  neighbourhood: "Smíchov",
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
      notes: "Working on leash reactivity with a trainer (Klára). Improving steadily.",
    },
  ],
};

export const klara: UserProfile = {
  id: "klara",
  firstName: "Klára",
  lastName: "Horáčková",
  email: "klara.horackova@email.cz",
  avatarUrl: AV.klara,
  bio: "Certified dog trainer based in Holešovice. I run group training sessions at Stromovka and 1-on-1 sessions for reactive and anxious dogs. Also just a dog mum — Eda and I do the Saturday park walks like everyone else.",
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
    },
  ],
  carerProfile: {
    bio: "Professional trainer with 8 years experience. Specialising in recall, reactivity, and socialisation. I work outdoors at Stromovka and Letná, or at your location for 1-on-1 sessions.",
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
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 300,
        priceUnit: "per_visit",
        subServices: ["Group walk", "Training walk"],
        notes: "Training walks — structured walk with obedience practice. Max 4 dogs per group.",
      },
      // Meet-type training catalogue (Discover & Care A4, 2026-05-02). The
      // previous junk-drawer "inhome_sitting" entry held three training
      // offerings as subServices strings; they're now first-class Meet-type
      // entries — see [[Groups & Care Model]] → Services as Catalog.
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
        seriesMeetId: "meet-care-1",
      },
      {
        kind: "meet",
        id: "klara-1on1",
        title: "1-on-1 training session",
        enabled: true,
        pricePerSession: 800,
        format: "one_on_one",
        cadence: "ad_hoc",
        durationMinutes: 60,
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
        seriesMeetId: "meet-care-workshop-1",
      },
      {
        kind: "meet",
        id: "klara-puppy-basics",
        title: "Puppy basics",
        enabled: true,
        pricePerSession: 400,
        format: "small_group",
        cadence: "ad_hoc",
        durationMinutes: 45,
        notes: "Foundations course for puppies under 6 months — handling, recall, socialisation.",
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
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   SUPPORTING CAST (15)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Vinohrady / Riegrovy Sady Cluster ─────────────────────────────────── */

export const marek: UserProfile = {
  id: "marek",
  firstName: "Marek",
  lastName: "Dvořák",
  email: "marek.dvorak@email.cz",
  avatarUrl: AV.marek,
  bio: "Morning walker at Riegrovy sady with Benny. Connected with Tereza through the Thursday walks.",
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
  bio: "Casual Riegrovy visitor with Aron. We come when the weather's good.",
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
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 120,
        priceUnit: "per_visit",
        subServices: ["Day sitting", "Overnight"],
        notes: "My flat in Karlín. Fenced balcony. Max 2 dogs at a time.",
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
  bio: "Saturday morning regular at Stromovka with Charlie. Also pop over to Letná during the week.",
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
      notes: "Needs a LOT of exercise. Recall is improving thanks to training.",
    },
  ],
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
        subServices: ["Home boarding", "Day care"],
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
  bio: "Molly's mum. We live near Letná and she needs regular walks when I'm working.",
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
        vaccinationsUpToDate: true,
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
        vaccinationsUpToDate: true,
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
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 280,
        priceUnit: "per_visit",
        subServices: ["Solo walk", "Group walk"],
        notes: "45–60 min walks around Riegrovy sady and Vítkov park. Max 3 dogs.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 100 },
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
   Minimal vet profile to prove the Appointment offering shape renders.
   Added 2026-05-02 (Discover & Care C3). Not in the demo arc; not on the
   persona switcher. Co-provider on the PremiumVet care group, which seeds
   multi-provider data for the B3 hero variant.
   ═══════════════════════════════════════════════════════════════════════════ */

export const lenkaVet: UserProfile = {
  id: "lenka-vet",
  firstName: "Lenka",
  lastName: "Nováková",
  email: "lenka.novakova@premiumvet.cz",
  avatarUrl: AV.zuzana,
  bio: "Small-animal vet at PremiumVet Vinohrady. 8 years in practice; special interest in dermatology and gentle handling for anxious pets.",
  location: "Prague 2, Czech Republic",
  neighbourhood: "Vinohrady",
  memberSince: "2025-09",
  profileVisibility: "open",
  tagApproval: "approve",
  pets: [],
  openToHelping: true,
  carerProfile: {
    bio: "Vinohrady-based vet, 8 years in small-animal practice. Same-day appointments for established clients; new clients seen within the week.",
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
        id: "lenka-vet-checkup",
        title: "Annual checkup",
        enabled: true,
        pricePerAppointment: 1200,
        durationMinutes: 30,
        appointmentCategory: "vet",
        notes: "Physical exam, vaccination review, weight + dental check.",
      },
      {
        kind: "appointment",
        id: "lenka-vet-skin",
        title: "Skin & coat consult",
        enabled: true,
        pricePerAppointment: 900,
        durationMinutes: 25,
        appointmentCategory: "vet",
        notes: "Dermatology consult — itching, allergies, hot spots. Diagnostics quoted at consult.",
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
    credentials: {
      yearsExperience: 8,
      certifications: ["Veterinary degree (UVPS Brno)"],
      firstAidTrained: true,
      insured: true,
      identityVerified: true,
    },
    repeatClients: 6,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROMOTED DIRECTORY CARERS
   Bridged from `mockData.ts` ProviderCards (`olga-m`, `marketa-h`) to full
   UserProfiles with proper carerProfile.services arrays. Pricing & Proposals
   walkthrough A5, 2026-05-04 — every provider in `/discover/care` should be
   a real user; bare cards were a data gap, not a design distinction. Both
   are Provider-tier (`publicProfile: true`); not on the persona switcher,
   not in the demo arc — just complete enough that their cards render with
   sub-services + notes + Book CTA like Petra/Nikola.
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
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 390,
        priceUnit: "per_visit",
        subServices: ["Solo walk", "Drop-in"],
        notes: "45–60 min walks around Smíchovský park or Petřín. Solo walks only.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 100 },
        ],
      },
      {
        kind: "care",
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 500,
        priceUnit: "per_visit",
        subServices: ["Day sitting"],
        notes: "Day sitting at my flat. Small/medium dogs only. Max 2 dogs at a time.",
        modifiers: [
          { kind: "weekend", enabled: true, pct: 15 },
        ],
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
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 600,
        priceUnit: "per_visit",
        subServices: ["Solo walk", "Adventure walk"],
        notes: "60–90 min walks across Vltava paths and Petřín. Solo or pair walks only.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "weekend", enabled: true, pct: 15 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 150 },
        ],
      },
      {
        kind: "care",
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 700,
        priceUnit: "per_visit",
        subServices: ["Day sitting", "Overnight"],
        notes: "Day sitting or overnight at my home. Quiet flat, calm routine, photo updates throughout.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 25 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 200 },
        ],
      },
      {
        kind: "care",
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 850,
        priceUnit: "per_night",
        subServices: ["Home boarding"],
        notes: "Multi-night boarding at my home. Two daily walks, photo updates, consistent feeding schedule.",
        modifiers: [
          { kind: "holiday", enabled: true, pct: 30 },
          { kind: "multi_pet", enabled: true, flatPerExtra: 250 },
          { kind: "last_minute", enabled: true, pct: 15, thresholdDays: 7 },
        ],
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

/* ═══════════════════════════════════════════════════════════════════════════
   REGISTRY & HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

export const allUsers: UserProfile[] = [
  tereza, daniel, klara, tomas,
  marek, lucie, jakub, zuzana,
  petra, ondrej, adela,
  martin, eva, filip,
  hana, vitek, anezka,
  jana, nikola, marie,
  shawn,
  lenkaVet,
  olgaM, marketaH,
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
  // `openToHelping: false` here intentionally: directory-only ProviderCards
  // are by definition Provider-tier (they're listed in `/discover/care`,
  // which is the Provider-tier surface). Defaulting to `openToHelping: true`
  // wrongly read them as Helper-tier and surfaced the "Open to helping"
  // casual badge on full Provider profiles. Pricing & Proposals, 2026-05-04.
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
