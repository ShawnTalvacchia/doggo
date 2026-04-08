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
 */

import type { UserProfile } from "./types";

/* ── Avatar URLs (Unsplash, cropped 400×400) ──────────────────────────────── */

const AV = {
  tereza:  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  daniel:  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  klara:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  tomas:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  marek:   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  lucie:   "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  jakub:   "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  zuzana:  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  petra:   "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
  ondrej:  "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80",
  adela:   "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  martin:  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  eva:     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  filip:   "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  hana:    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
  vitek:   "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
  anezka:  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  jana:    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  nikola:  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  marie:   "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
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
  pets: [
    {
      id: "franta",
      name: "Franta",
      breed: "Beagle",
      weightLabel: "12 kg",
      ageLabel: "5 years",
      imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80",
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
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 150,
        priceUnit: "per_visit",
        subServices: ["Day sitting"],
        notes: "Small/medium dogs only. My flat, or yours if nearby.",
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
  pets: [
    {
      id: "bara",
      name: "Bára",
      breed: "Mixed breed rescue",
      weightLabel: "15 kg",
      ageLabel: "3 years",
      imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=400&q=80",
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
  pets: [
    {
      id: "eda",
      name: "Eda",
      breed: "Border Collie",
      weightLabel: "20 kg",
      ageLabel: "6 years",
      imageUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=400&q=80",
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
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 300,
        priceUnit: "per_visit",
        subServices: ["Group walk", "Training walk"],
        notes: "Training walks — structured walk with obedience practice. Max 4 dogs per group.",
      },
      {
        serviceType: "inhome_sitting",
        enabled: false,
        pricePerUnit: 600,
        priceUnit: "per_visit",
        subServices: ["1-on-1 training session", "Reactive dog session", "Puppy basics"],
        notes: "1-on-1 training at your location or Stromovka. 60-minute sessions. Behaviour assessment included in first session.",
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
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
  pets: [
    {
      id: "hugo",
      name: "Hugo",
      breed: "Labrador Retriever",
      weightLabel: "32 kg",
      ageLabel: "2 years",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "benny",
      name: "Benny",
      breed: "Cocker Spaniel",
      weightLabel: "14 kg",
      ageLabel: "4 years",
      imageUrl: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=400&q=80",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "pepik",
      name: "Pepík",
      breed: "Dachshund",
      weightLabel: "7 kg",
      ageLabel: "6 years",
      imageUrl: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1583337130417-13104dec14a3?auto=format&fit=crop&w=400&q=80",
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
        serviceType: "inhome_sitting",
        enabled: true,
        pricePerUnit: 120,
        priceUnit: "per_visit",
        subServices: ["Day sitting", "Overnight"],
        notes: "My flat in Karlín. Fenced balcony. Max 2 dogs at a time.",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "rocky",
      name: "Rocky",
      breed: "Staffordshire Bull Terrier mix",
      weightLabel: "22 kg",
      ageLabel: "4 years",
      imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?auto=format&fit=crop&w=400&q=80",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "charlie",
      name: "Charlie",
      breed: "French Bulldog",
      weightLabel: "12 kg",
      ageLabel: "4 years",
      imageUrl: "https://images.unsplash.com/photo-1583337130417-13104dec14a3?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1579213838058-4815d1da7b8d?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1587559070757-f72a388edbba?auto=format&fit=crop&w=400&q=80",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "runa",
      name: "Runa",
      breed: "Husky mix",
      weightLabel: "24 kg",
      ageLabel: "5 years",
      imageUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80",
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
  profileVisibility: "open",
  tagApproval: "auto",
  pets: [
    {
      id: "nela",
      name: "Nela",
      breed: "German Shepherd",
      weightLabel: "30 kg",
      ageLabel: "5 years",
      imageUrl: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=400&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?auto=format&fit=crop&w=400&q=80",
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
        serviceType: "boarding",
        enabled: true,
        pricePerUnit: 480,
        priceUnit: "per_night",
        subServices: ["Home boarding", "Day care"],
        notes: "Garden access. Daily walks in Letenské sady. Photo updates.",
      },
    ],
    publicProfile: true,
    visibility: "open",
    acceptingBookings: true,
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
   REGISTRY & HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/** All non-Shawn users. Shawn lives in mockUser.ts and is imported separately. */
export const allUsers: UserProfile[] = [
  tereza, daniel, klara, tomas,
  marek, lucie, jakub, zuzana,
  petra, ondrej, adela,
  martin, eva, filip,
  hana, vitek, anezka,
  jana, nikola, marie,
];

/** Quick lookup by user ID. */
const userMap = new Map<string, UserProfile>(allUsers.map((u) => [u.id, u]));

export function getUserById(id: string): UserProfile | undefined {
  return userMap.get(id);
}

/** Get display name for any user ID (falls back to ID if unknown). */
export function getUserName(id: string): string {
  if (id === "shawn") return "Shawn";
  const u = userMap.get(id);
  return u ? u.firstName : id;
}

/** Get avatar URL for any user ID. */
export function getUserAvatar(id: string): string {
  if (id === "shawn") return AV.shawn;
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
