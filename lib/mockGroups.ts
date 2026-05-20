import type {
  Group,
  GroupProviderRef,
  CareCategory,
  CareGroupConfig,
  CarerServiceConfig,
} from "./types";
import { mockMeets } from "./mockMeets";
import { isMeetVisibleTo } from "./meetUtils";
import { getUserById } from "./mockUsers";

/** Default care group configuration by provider category */
export const CARE_CONFIG_DEFAULTS: Record<CareCategory, CareGroupConfig> = {
  // Event-driven categories (training, walking, venue): events ARE the
  // service offerings — each meet carries its own price + booking flow,
  // so a separate Services tab would duplicate the same content. The
  // group-detail UI honors `serviceListingsVisible` to hide the tab; the
  // `serviceListings` data field stays populated (used by `CardGroup`
  // for the Discover-card pricing snippet, and by the provider profile
  // for any future on-demand 1-on-1 booking surface).
  training:  { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: false, locationType: "mobile", capacityEnabled: true,  galleryMode: "standard" },
  walking:   { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: false, serviceListingsVisible: false, locationType: "mobile", capacityEnabled: true,  galleryMode: "updates" },
  grooming:  { eventsEnabled: false, bookingCTAsEnabled: true,  discussionEnabled: false, serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: false, galleryMode: "portfolio" },
  boarding:  { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: true,  galleryMode: "updates" },
  rehab:     { eventsEnabled: false, bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: false, galleryMode: "standard" },
  venue:     { eventsEnabled: true,  bookingCTAsEnabled: false, discussionEnabled: false, serviceListingsVisible: false, locationType: "fixed",  capacityEnabled: false, galleryMode: "standard" },
  other:     { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "mobile", capacityEnabled: false, galleryMode: "standard" },
};

export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Vinohrady Morning Crew",
    description:
      "We meet every week for a morning walk through Riegrovy sady. Chill pace, all dogs welcome. Come as you are — the dogs set the agenda.",
    groupType: "neighbor",
    visibility: "open",
    neighbourhood: "Vinohrady",
    location: "Riegrovy sady, Prague 2",
    coverPhotoUrl: "/images/generated/community-cover-vinohrady.jpeg",
    creatorId: "shawn",
    creatorName: "Shawn",
    members: [
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Spot", "Goldie"],
        role: "admin",
        joinedAt: "2025-11-10",
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
        role: "member",
        joinedAt: "2025-11-12",
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "/images/generated/tomas-profile.jpeg",
        dogNames: ["Hugo"],
        role: "member",
        joinedAt: "2025-12-03",
      },
      {
        userId: "tereza",
        userName: "Tereza",
        avatarUrl:
          "/images/generated/tereza-profile.jpeg",
        dogNames: ["Franta"],
        role: "member",
        joinedAt: "2025-11-15",
      },
      {
        userId: "marek",
        userName: "Marek",
        avatarUrl:
          "/images/generated/marek-profile.jpeg",
        dogNames: ["Benny"],
        role: "member",
        joinedAt: "2025-11-20",
      },
      {
        userId: "lucie",
        userName: "Lucie",
        avatarUrl:
          "/images/generated/lucie-profile.jpeg",
        dogNames: ["Pepík"],
        role: "member",
        joinedAt: "2025-12-01",
      },
    ],
    photos: [
      "/images/generated/community-cover-vinohrady.jpeg",
      "/images/generated/spot-portrait.jpeg",
      "/images/generated/park-hangout-riegrovy.jpeg",
      "/images/generated/goldie-playing.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-11-10T08:00:00Z",
  },
  {
    id: "group-2",
    name: "Stromovka Off-Leash Club",
    description:
      "Weekend off-leash play sessions in Stromovka park. Bring a ball, bring treats. Dogs run free, owners relax.",
    groupType: "interest",
    visibility: "open",
    neighbourhood: "Holešovice",
    location: "Stromovka, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-stromovka.jpeg",
    creatorId: "jana",
    creatorName: "Jana",
    members: [
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
        role: "admin",
        joinedAt: "2025-12-01",
      },
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Spot"],
        role: "member",
        joinedAt: "2025-12-05",
      },
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna", "Max"],
        role: "member",
        joinedAt: "2025-12-08",
      },
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "/images/generated/martin-profile.jpeg",
        dogNames: ["Charlie"],
        role: "member",
        joinedAt: "2026-01-10",
      },
      {
        userId: "klara",
        userName: "Klára",
        avatarUrl:
          "/images/generated/klara-profile.jpeg",
        dogNames: ["Eda"],
        role: "member",
        joinedAt: "2026-01-15",
      },
      {
        userId: "filip",
        userName: "Filip",
        avatarUrl:
          "/images/generated/filip-profile.jpeg",
        dogNames: ["Toby"],
        role: "member",
        joinedAt: "2026-01-20",
      },
    ],
    photos: [
      "/images/generated/group-walk-stromovka.jpeg",
      "/images/generated/evening-walk-group.jpeg",
      "/images/generated/spot-resting.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "group-3",
    name: "Reactive Dog Support",
    description:
      "A safe, private space for owners of reactive dogs. We share tips, coordinate small-group walks, and support each other. No judgement.",
    groupType: "interest",
    visibility: "private",
    neighbourhood: "Vinohrady",
    location: "Prague 2",
    coverPhotoUrl: "/images/generated/community-cover-reactive.jpeg",
    creatorId: "eva",
    creatorName: "Eva",
    members: [
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna"],
        role: "admin",
        joinedAt: "2026-01-05",
      },
      {
        userId: "hana",
        userName: "Hana",
        avatarUrl:
          "/images/generated/hana-profile.jpeg",
        dogNames: ["Runa"],
        role: "member",
        joinedAt: "2026-01-10",
      },
      {
        userId: "anezka",
        userName: "Anežka",
        avatarUrl:
          "/images/generated/anezka-profile.jpeg",
        dogNames: ["Nela"],
        role: "member",
        joinedAt: "2026-01-12",
      },
      {
        userId: "vitek",
        userName: "Vítek",
        avatarUrl:
          "/images/generated/vitek-profile.jpeg",
        dogNames: ["Sam"],
        role: "member",
        joinedAt: "2026-01-20",
      },
    ],
    photos: [],
    photoPolicy: "none",
    createdAt: "2026-01-05T12:00:00Z",
  },
  {
    id: "group-4",
    name: "Letná Recall Training",
    description:
      "Small-group recall practice at Letenské sady. Ideal for dogs that need work on coming back when called. Bring high-value treats!",
    groupType: "interest",
    visibility: "open",
    neighbourhood: "Letná",
    location: "Letenské sady, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-letna.jpeg",
    creatorId: "eva",
    creatorName: "Eva",
    members: [
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna"],
        role: "admin",
        joinedAt: "2026-02-01",
      },
      {
        userId: "klara",
        userName: "Klára",
        avatarUrl:
          "/images/generated/klara-profile.jpeg",
        dogNames: ["Eda"],
        role: "member",
        joinedAt: "2026-02-03",
      },
      {
        userId: "filip",
        userName: "Filip",
        avatarUrl:
          "/images/generated/filip-profile.jpeg",
        dogNames: ["Toby"],
        role: "member",
        joinedAt: "2026-02-05",
      },
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Goldie"],
        role: "member",
        joinedAt: "2026-02-08",
      },
      {
        userId: "lena",
        userName: "Lena",
        avatarUrl:
          "/images/generated/anezka-profile.jpeg",
        dogNames: ["Asha"],
        role: "member",
        joinedAt: "2026-02-12",
      },
    ],
    photos: [
      "/images/generated/goldie-leash.jpeg",
      "/images/generated/training-session.jpeg",
    ],
    photoPolicy: "optional",
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "group-5",
    name: "Žižkov Dog Parents",
    description:
      "A neighbourhood group for Žižkov dog owners. Share tips, organise walks, and find dog-sitting help from people nearby. New members need approval — we like to keep it local.",
    groupType: "neighbor",
    visibility: "approval",
    neighbourhood: "Žižkov",
    location: "Žižkov, Prague 3",
    coverPhotoUrl: "/images/generated/community-cover-zizkov.jpeg",
    creatorId: "martin",
    creatorName: "Martin",
    members: [
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "/images/generated/martin-profile.jpeg",
        dogNames: ["Charlie"],
        role: "admin",
        joinedAt: "2026-02-15",
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
        role: "member",
        joinedAt: "2026-02-18",
      },
      {
        userId: "anezka",
        userName: "Anežka",
        avatarUrl:
          "/images/generated/anezka-profile.jpeg",
        dogNames: ["Nela"],
        role: "member",
        joinedAt: "2026-02-20",
      },
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Spot"],
        role: "member",
        joinedAt: "2026-03-01",
      },
    ],
    photos: [
      "/images/generated/community-cover-zizkov.jpeg",
    ],
    photoPolicy: "optional",
    createdAt: "2026-02-15T11:00:00Z",
  },

  // ── Journey mock data: groups for Tereza, Daniel, Klára, Tomáš ─────────────

  {
    id: "group-tereza-neighbourhood",
    name: "Vinohrady Evening Walkers",
    description:
      "A few of us walk together most evenings around Vinohrady — casual pace, friendly dogs, easy chat. Started this after I kept seeing the same crew at Riegrovy Sady and we wanted a way to coordinate. Drop in any night.",
    groupType: "neighbor",
    visibility: "private",
    neighbourhood: "Vinohrady",
    location: "Vinohrady, Prague 2",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    creatorId: "tereza",
    creatorName: "Tereza",
    members: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "admin", joinedAt: "2026-02-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-02-03" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2026-02-05" },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"], role: "member", joinedAt: "2026-02-04" },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"], role: "member", joinedAt: "2026-02-06" },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"], role: "member", joinedAt: "2026-03-10" },
    ],
    photos: ["/images/generated/evening-walk-group.jpeg"],
    photoPolicy: "optional",
    createdAt: "2026-02-01T18:00:00Z",
  },
  {
    id: "group-reactive-dogs",
    name: "Prague Reactive Dog Support",
    description:
      "A safe space for owners of reactive dogs in Prague. Share tips, organise small-group meets in quiet parks, and learn together. Approval required — write a short note about your dog when you request to join.",
    groupType: "interest",
    visibility: "approval",
    neighbourhood: "Prague-wide",
    location: "Various quiet parks",
    coverPhotoUrl: "/images/generated/goldie-leash.jpeg",
    creatorId: "eva",
    creatorName: "Eva",
    members: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"], role: "member", joinedAt: "2026-01-10" },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"], role: "member", joinedAt: "2026-01-12" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2026-01-15" },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"], role: "member", joinedAt: "2026-01-14" },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"], role: "member", joinedAt: "2026-01-16" },
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"], role: "member", joinedAt: "2026-01-25" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"], role: "admin", joinedAt: "2026-01-18" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-02-01" },
    ],
    photos: ["/images/generated/goldie-leash.jpeg", "/images/generated/care-petra-sitting.jpeg"],
    photoPolicy: "optional",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "group-klara-training",
    name: "Klára's Calm Dog Sessions",
    description:
      "Walks and training at Stromovka with Klára, a certified trainer (8 years). Start with the free Saturday community walk, step up to small-group training, or book a 1-on-1 for a reactive or anxious dog. It's all about getting dogs social, settled, and part of the neighbourhood.",
    groupType: "care",
    careCategory: "training",
    visibility: "open",
    providers: [{ userId: "klara", name: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg" }],
    neighbourhood: "Holešovice",
    location: "Stromovka, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-training.jpeg",
    creatorId: "klara",
    creatorName: "Klára",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.training,
    serviceListings: [
      { id: "svc-klara-1", title: "Group Training Session", description: "Small-group park session (max 6 dogs). Focus on recall, loose-leash walking, and calm greetings.", priceFrom: 350, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-klara-2", title: "Puppy Socialisation Class", description: "Structured socialisation for puppies 3–6 months. Safe introductions, confidence building, basic cues.", priceFrom: 400, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-klara-3", title: "1-on-1 Behaviour Consultation", description: "Private session for reactive dogs, anxiety, or specific behaviour challenges. Includes follow-up plan.", priceFrom: 800, priceUnit: "per session", bookingHref: "/bookings", active: true },
    ],
    members: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"], role: "admin", joinedAt: "2026-01-05" },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"], role: "member", joinedAt: "2026-02-10" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-03-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2026-03-05" },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"], role: "member", joinedAt: "2026-03-08" },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"], role: "member", joinedAt: "2026-02-20" },
    ],
    photos: [
      "/images/generated/care-klara-training.jpeg",
      "/images/generated/training-session.jpeg",
      "/images/generated/post-training-recall.jpeg",
      "/images/generated/goldie-leash.jpeg",
      "/images/generated/post-new-trick.jpeg",
      "/images/generated/spot-park-walk.jpeg",
      "/images/generated/meet-greeting.jpeg",
      "/images/generated/bella-portrait.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2026-01-05T09:00:00Z",
  },
  {
    id: "group-karlin-neighbours",
    name: "Karlín Dog Neighbors",
    description:
      "A private group for dog owners in Karlín. Walk together, share recommendations, help each other out. Small, local, and trusted.",
    groupType: "neighbor",
    visibility: "private",
    neighbourhood: "Karlín",
    location: "Karlín, Prague 8",
    coverPhotoUrl: "/images/generated/community-cover-karlin.jpeg",
    creatorId: "petra",
    creatorName: "Petra",
    members: [
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"], role: "admin", joinedAt: "2026-01-20" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-20" },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"], role: "member", joinedAt: "2026-02-22" },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"], role: "member", joinedAt: "2026-02-25" },
    ],
    photos: [],
    photoPolicy: "optional",
    createdAt: "2026-01-20T14:00:00Z",
  },
  /*
   * Holešovice Dog Block — private neighbour group, added 2026-05-14.
   * Magda Vondráková admin. 7 seeded members of the Holešovice cluster:
   * Magda, Veronika, Eva, Martin, Filip, Hana, Daniel. Carries the *Find
   * Your People* door on Demo Narrative V2's Beat 3 — the walkthrough
   * narrates Magda inviting Daniel after Klára's walk, but he's seeded as
   * a member so the private group's surfaces work; from inside it he books
   * Veronika's circle-scoped care via the "Care from neighbours" section.
   */
  {
    id: "group-holesovice-block",
    name: "Holešovice Dog Block",
    description:
      "Our block's dog crew. Started as a WhatsApp thread, moved here when half the messages were dog logistics. We coordinate walks, swap recommendations, watch each other's dogs when one of us is out. Small, neighbourly, no drama. Request to join — we like to know who's on the block.",
    groupType: "neighbor",
    visibility: "private",
    neighbourhood: "Holešovice",
    location: "Holešovice, Prague 7",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    creatorId: "magda",
    creatorName: "Magda",
    members: [
      { userId: "magda", userName: "Magda", avatarUrl: "/images/generated/magda-profile.jpeg", dogNames: ["Žofka"], role: "admin", joinedAt: "2025-09-15" },
      { userId: "veronika", userName: "Veronika", avatarUrl: "/images/generated/veronika-profile.jpeg", dogNames: ["Kuba"], role: "member", joinedAt: "2025-10-08" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-10-22" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-04" },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"], role: "member", joinedAt: "2025-11-19" },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"], role: "member", joinedAt: "2026-01-12" },
    ],
    photos: [],
    photoPolicy: "optional",
    createdAt: "2025-09-15T10:00:00Z",
  },

  // ── Additional interest groups ─────────────────────────────────────────────
  {
    id: "group-doodle-owners",
    name: "Prague Doodle Owners",
    description:
      "Labradoodles, goldendoodles, bernedoodles — if your dog ends in -oodle, you're one of us. Grooming tips, playdate coordination, and lots of curly dog photos.",
    groupType: "interest",
    visibility: "open",
    neighbourhood: "Prague-wide",
    location: "Various parks, Prague",
    coverPhotoUrl: "/images/generated/goldie-playing.jpeg",
    creatorId: "jana",
    creatorName: "Jana",
    members: [
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "admin", joinedAt: "2026-01-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"], role: "member", joinedAt: "2026-01-20" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"], role: "member", joinedAt: "2026-02-01" },
    ],
    photos: ["/images/generated/goldie-playing.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "group-senior-dogs",
    name: "Senior Dogs & Slow Walks",
    description:
      "For dogs who prefer a gentle pace and owners who enjoy the calm. Short walks, soft trails, and no rush. Age is just a number — but we respect the joints.",
    groupType: "interest",
    visibility: "open",
    neighbourhood: "Prague-wide",
    location: "Various calm parks, Prague",
    coverPhotoUrl: "/images/generated/spot-resting.jpeg",
    creatorId: "martin",
    creatorName: "Martin",
    members: [
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "admin", joinedAt: "2026-02-10" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-15" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2026-02-18" },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"], role: "member", joinedAt: "2026-02-20" },
      { userId: "marie", userName: "Marie", avatarUrl: "/images/generated/marie-profile.jpeg", dogNames: ["Molly"], role: "member", joinedAt: "2026-03-01" },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"], role: "member", joinedAt: "2026-03-10" },
    ],
    photos: ["/images/generated/spot-resting.jpeg", "/images/generated/park-hangout-riegrovy.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2026-02-10T09:00:00Z",
  },

  // ── Additional care groups ────────────────────────────────────────────────
  {
    id: "group-pawel-walks",
    name: "Pawel's Prague Pack",
    description:
      "Daily group walks through Prague's best parks. Max 6 dogs per walk, GPS tracking, photo updates every walk. Your dog's favourite part of the day.",
    groupType: "care",
    careCategory: "walking",
    visibility: "open",
    providers: [{ userId: "pawel", name: "Pawel", avatarUrl: "/images/generated/marek-profile.jpeg" }],
    neighbourhood: "Vinohrady",
    location: "Various parks, Prague 2–3",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    creatorId: "pawel",
    creatorName: "Pawel",
    galleryMode: "updates",
    careConfig: CARE_CONFIG_DEFAULTS.walking,
    serviceListings: [
      { id: "svc-pawel-1", title: "Group Walk", description: "Morning or afternoon group walk, max 6 dogs. Pickup available in Vinohrady and Žižkov.", priceFrom: 250, priceUnit: "per walk", bookingHref: "/bookings", active: true },
      { id: "svc-pawel-2", title: "Solo Walk", description: "One-on-one walk for dogs who need individual attention or are still socialising.", priceFrom: 350, priceUnit: "per walk", bookingHref: "/bookings", active: true },
      { id: "svc-pawel-3", title: "Puppy Walk", description: "Gentle, short walks for puppies under 6 months. Focus on exposure and confidence.", priceFrom: 300, priceUnit: "per walk", bookingHref: "/bookings", active: true },
    ],
    members: [
      { userId: "pawel", userName: "Pawel", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: [], role: "admin", joinedAt: "2025-12-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-01-10" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2026-01-15" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2026-02-01" },
      { userId: "lena", userName: "Lena", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Asha"], role: "member", joinedAt: "2026-02-10" },
    ],
    photos: [
      "/images/generated/group-walk-stromovka.jpeg",
      "/images/generated/evening-walk-group.jpeg",
      "/images/generated/care-dog-walking.jpeg",
      "/images/generated/spot-park-walk.jpeg",
      "/images/generated/post-dog-park-sunset.jpeg",
      "/images/generated/playdate-small-group.jpeg",
      "/images/generated/rex-portrait.jpeg",
      "/images/generated/goldie-playing.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-12-01T08:00:00Z",
  },
  {
    id: "group-dognut-grooming",
    name: "Dognut Grooming Prague",
    description:
      "Prague's friendliest grooming salon. Before & after transformations, coat care tips, and easy online booking. Your dog leaves happy (and smelling great).",
    groupType: "care",
    careCategory: "grooming",
    visibility: "open",
    providers: [{ userId: "dognut", name: "Dognut Grooming", avatarUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80" }],
    neighbourhood: "Holešovice",
    location: "Holešovice, Prague 7",
    locationFixed: "Komunardů 32, Prague 7",
    coverPhotoUrl: "/images/generated/goldie-playing.jpeg",
    creatorId: "dognut",
    creatorName: "Dognut Grooming",
    galleryMode: "portfolio",
    careConfig: CARE_CONFIG_DEFAULTS.grooming,
    serviceListings: [
      { id: "svc-dognut-1", title: "Full Groom", description: "Bath, dry, haircut, nail trim, ear clean. All breeds welcome.", priceFrom: 800, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-dognut-2", title: "Bath & Brush", description: "Wash, blow-dry, and brush-out. Great for short-haired breeds between grooms.", priceFrom: 450, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-dognut-3", title: "Nail Trim", description: "Quick nail trim. Walk-ins welcome, no appointment needed.", priceFrom: 150, priceUnit: "per visit", active: true },
      { id: "svc-dognut-4", title: "De-shedding Treatment", description: "Deep brush and de-shedding treatment for double-coated breeds.", priceFrom: 600, priceUnit: "per session", bookingHref: "/bookings", active: true },
    ],
    members: [
      { userId: "dognut", userName: "Dognut Grooming", avatarUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-11-01" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-10" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2026-01-05" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"], role: "member", joinedAt: "2026-02-01" },
    ],
    photos: [
      "/images/generated/goldie-playing.jpeg",
      "/images/generated/spot-portrait.jpeg",
      "/images/generated/rex-portrait.jpeg",
      "/images/generated/bella-portrait.jpeg",
      "/images/generated/luna-portrait.jpeg",
      "/images/generated/charlie-portrait.jpeg",
      "/images/generated/goldie-portrait.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-11-01T10:00:00Z",
  },

  // ── New care groups (Phase 31) ─────────────────────────────────────────────
  {
    id: "group-happy-tails",
    name: "Happy Tails Boarding",
    description:
      "A small, home-based boarding facility in Dejvice. Daily photo updates so you never have to wonder how your dog is doing. Max 8 dogs at a time — every dog gets personal attention.",
    groupType: "care",
    careCategory: "boarding",
    visibility: "approval",
    providers: [{ userId: "happy_tails", name: "Markéta", avatarUrl: "/images/generated/zuzana-profile.jpeg" }],
    neighbourhood: "Dejvice",
    location: "Dejvice, Prague 6",
    locationFixed: "Na Hutích 12, Prague 6",
    coverPhotoUrl: "/images/generated/spot-resting.jpeg",
    creatorId: "happy_tails",
    creatorName: "Markéta",
    galleryMode: "updates",
    capacityEnabled: true,
    careConfig: CARE_CONFIG_DEFAULTS.boarding,
    serviceListings: [
      { id: "svc-ht-1", title: "Overnight Boarding", description: "Home-style overnight stay with garden access. Includes morning and evening walks.", priceFrom: 550, priceUnit: "per night", bookingHref: "/bookings", active: true },
      { id: "svc-ht-2", title: "Daycare", description: "Full-day care from 7am to 7pm. Structured play sessions and rest time.", priceFrom: 350, priceUnit: "per day", bookingHref: "/bookings", active: true },
      { id: "svc-ht-3", title: "Holiday Boarding", description: "Extended stays (3+ nights) with daily photo updates and video calls on request.", priceFrom: 500, priceUnit: "per night", bookingHref: "/bookings", active: true },
    ],
    members: [
      { userId: "happy_tails", userName: "Markéta", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"], role: "admin", joinedAt: "2025-10-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2025-11-15" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-01-10" },
    ],
    photos: ["/images/generated/spot-resting.jpeg", "/images/generated/goldie-playing.jpeg", "/images/generated/park-hangout-riegrovy.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "group-physiodog",
    name: "PhysioDOG Recovery Community",
    description:
      "A supportive community for dogs in rehabilitation and their owners. Recovery progress stories, exercise tips, and specialist Q&A. Membership is for current and former clients.",
    groupType: "care",
    careCategory: "rehab",
    visibility: "private",
    providers: [{ userId: "physiodog", name: "Dr. Novotná", avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80" }],
    neighbourhood: "Smíchov",
    location: "Smíchov, Prague 5",
    locationFixed: "Plzeňská 98, Prague 5",
    coverPhotoUrl: "/images/generated/goldie-leash.jpeg",
    creatorId: "physiodog",
    creatorName: "Dr. Novotná",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.rehab,
    serviceListings: [
      { id: "svc-pd-1", title: "Initial Assessment", description: "Full mobility assessment and personalised recovery plan. 60 minutes.", priceFrom: 1200, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-pd-2", title: "Physiotherapy Session", description: "Hands-on rehab session: hydrotherapy, massage, laser therapy, exercises.", priceFrom: 900, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-pd-3", title: "Group Hydrotherapy", description: "Small-group underwater treadmill session. Great for post-surgery recovery and senior dogs.", priceFrom: 600, priceUnit: "per session", bookingHref: "/bookings", active: true },
    ],
    members: [
      { userId: "physiodog", userName: "Dr. Novotná", avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-09-01" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-10-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Max"], role: "member", joinedAt: "2025-11-01" },
    ],
    photos: ["/images/generated/goldie-leash.jpeg"],
    photoPolicy: "optional",
    createdAt: "2025-09-01T10:00:00Z",
  },
  {
    id: "group-cafe-letka",
    name: "Café Letka Dog Corner",
    description:
      "Letná's favourite dog-friendly café. Weekly puppy social hours, dog treat menu, and a warm welcome for four-legged guests. The perfect post-walk stop.",
    groupType: "care",
    careCategory: "venue",
    visibility: "open",
    providers: [{ userId: "cafe_letka", name: "Café Letka", avatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80" }],
    neighbourhood: "Letná",
    location: "Letná, Prague 7",
    locationFixed: "Letenské náměstí 3, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-letna.jpeg",
    creatorId: "cafe_letka",
    creatorName: "Café Letka",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.venue,
    serviceListings: [],
    members: [
      { userId: "cafe_letka", userName: "Café Letka", avatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-10-01" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-11-15" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2025-12-01" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"], role: "member", joinedAt: "2026-01-10" },
    ],
    photos: ["/images/generated/community-cover-letna.jpeg", "/images/generated/dogs-cafe-terrace.jpeg", "/images/generated/post-karlin-morning.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T12:00:00Z",
  },
  {
    // Originally "group-premiumvet" — repurposed as a grooming salon
    // during Discover Refinement walkthrough D1 (2026-05-10) to align
    // with the strategic call (Open Q §6) that vets are post-MVP. The
    // group ID is retained to avoid an invasive rename across every
    // mock-data reference; the entity itself is now Mánesova Grooming.
    id: "group-premiumvet",
    name: "Mánesova Grooming Salon",
    description:
      "Vinohrady-based grooming salon with three groomers, all trained in calm-handling and force-free methods. Anxious dogs welcome — we book longer first visits and never use restraints. Community space for grooming questions, brush-out tips, and seasonal coat changes.",
    groupType: "care",
    careCategory: "grooming",
    visibility: "open",
    providers: [
      { userId: "premiumvet", name: "Mánesova Grooming", avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80" },
      { userId: "lenka-vet", name: "Lenka Nováková", avatarUrl: "/images/generated/zuzana-profile.jpeg" },
      { userId: "vet-stepanek", name: "Pavel Štěpánek", avatarUrl: "/images/generated/jakub-profile.jpeg" },
    ],
    neighbourhood: "Vinohrady",
    location: "Vinohrady, Prague 2",
    locationFixed: "Mánesova 67, Prague 2",
    coverPhotoUrl: "/images/generated/spot-portrait.jpeg",
    creatorId: "premiumvet",
    creatorName: "Mánesova Grooming",
    galleryMode: "portfolio",
    careConfig: CARE_CONFIG_DEFAULTS.grooming,
    serviceListings: [],
    members: [
      { userId: "premiumvet", userName: "Mánesova Grooming", avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-09-01" },
      { userId: "lenka-vet", userName: "Lenka Nováková", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: [], role: "admin", joinedAt: "2025-09-01" },
      { userId: "vet-stepanek", userName: "Pavel Štěpánek", avatarUrl: "/images/generated/jakub-profile.jpeg", dogNames: [], role: "admin", joinedAt: "2025-09-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot", "Goldie"], role: "member", joinedAt: "2025-10-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2025-10-15" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-01" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-12-01" },
    ],
    photos: ["/images/generated/spot-portrait.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-09-01T08:00:00Z",
  },

  // ── Auto-generated park groups ──────────────────────────────────────────────
  {
    id: "park-1",
    name: "Letná Dog Walks",
    description: "Auto-generated group for dog walkers at Letenské sady. Open to everyone — just show up!",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Letná",
    location: "Letenské sady, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-letna.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-11-01" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2025-11-05" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-08" },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"], role: "member", joinedAt: "2025-11-10" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-12" },
      { userId: "nikola", userName: "Nikola", avatarUrl: "/images/generated/nikola-profile.jpeg", dogNames: [], role: "member", joinedAt: "2025-11-15" },
    ],
    photos: ["/images/generated/training-session.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "park-2",
    name: "Stromovka Morning Crew",
    description: "Early morning walks through Stromovka. Fresh air, happy dogs, good people.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Holešovice",
    location: "Stromovka, Prague 7",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-10-15" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-11-20" },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"], role: "member", joinedAt: "2025-10-20" },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-01" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-11-05" },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"], role: "member", joinedAt: "2025-12-01" },
    ],
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "park-3",
    name: "Riegrovy Sady Dog Walks",
    description: "The park at the heart of Vinohrady. Join any time — regulars and newcomers alike.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Vinohrady",
    location: "Riegrovy sady, Prague 2",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot", "Goldie"], role: "member", joinedAt: "2025-10-10" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-10-12" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2025-10-20" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"], role: "member", joinedAt: "2025-10-05" },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"], role: "member", joinedAt: "2025-10-08" },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"], role: "member", joinedAt: "2025-10-15" },
      { userId: "jakub", userName: "Jakub", avatarUrl: "/images/generated/jakub-profile.jpeg", dogNames: ["Aron"], role: "member", joinedAt: "2025-12-01" },
    ],
    photos: ["/images/generated/park-hangout-riegrovy.jpeg", "/images/generated/community-cover-vinohrady.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "park-4",
    name: "Ladronka Off-Leash",
    description: "Wide open spaces at Ladronka. Perfect for dogs that need room to run.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Břevnov",
    location: "Ladronka, Prague 6",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-01" },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"], role: "member", joinedAt: "2025-11-15" },
      { userId: "jakub", userName: "Jakub", avatarUrl: "/images/generated/jakub-profile.jpeg", dogNames: ["Aron"], role: "member", joinedAt: "2025-12-01" },
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"], role: "member", joinedAt: "2025-12-10" },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"], role: "member", joinedAt: "2026-01-05" },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"], role: "member", joinedAt: "2026-01-20" },
    ],
    photos: [
      "/images/generated/evening-walk-group.jpeg",
      "/images/generated/group-walk-stromovka.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "park-5",
    name: "Vítkov Park Dogs",
    description: "Dog walks with a view. Meet at the hilltop and explore the trails together.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Žižkov",
    location: "Vítkov, Prague 3",
    coverPhotoUrl: "/images/generated/community-cover-zizkov.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-10" },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-01" },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"], role: "member", joinedAt: "2025-12-05" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-12-10" },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"], role: "member", joinedAt: "2026-01-05" },
    ],
    photos: [
      "/images/generated/community-cover-zizkov.jpeg",
      "/images/generated/post-sunset-vitkov.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "park-karlin",
    name: "Karlín Riverside Walks",
    description: "Morning walks along the Karlín riverfront. Flat paths, great for dogs of all ages.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Karlín",
    location: "Karlín riverfront, Prague 8",
    coverPhotoUrl: "/images/generated/community-cover-karlin.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-15" },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"], role: "member", joinedAt: "2026-02-16" },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"], role: "member", joinedAt: "2026-02-18" },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"], role: "member", joinedAt: "2026-02-20" },
    ],
    photos: ["/images/generated/evening-walk-group.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "park-6",
    name: "Kampa Island Walks",
    description: "Scenic walks around Kampa Island. A calm spot for dogs and owners who prefer a quieter pace.",
    groupType: "park",
    visibility: "open",
    neighbourhood: "Malá Strana",
    location: "Kampa Island, Prague 1",
    coverPhotoUrl: "/images/generated/spot-resting.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"], role: "member", joinedAt: "2025-12-15" },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"], role: "member", joinedAt: "2026-01-10" },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"], role: "member", joinedAt: "2026-01-20" },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"], role: "member", joinedAt: "2026-02-05" },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"], role: "member", joinedAt: "2026-03-01" },
    ],
    photos: [
      "/images/generated/park-hangout-riegrovy.jpeg",
      "/images/generated/spot-park-walk.jpeg",
    ],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
];

/** Get groups the current user belongs to */
export function getUserGroups(userId: string): Group[] {
  return mockGroups.filter((g) => g.members.some((m) => m.userId === userId));
}

/**
 * Get groups the user can post meets/events to.
 * Park / Neighbor / Interest: any member can post. Care: admins (providers) only.
 */
export function getGroupsUserCanPostMeetsIn(userId: string): Group[] {
  return mockGroups.filter((g) => {
    const membership = g.members.find((m) => m.userId === userId);
    if (!membership) return false;
    if (g.groupType === "care" && membership.role !== "admin") return false;
    return true;
  });
}

/** Get a group by ID */
export function getGroupById(id: string): Group | undefined {
  return mockGroups.find((g) => g.id === id);
}

/** Get all discoverable groups (open + approval — excludes private) */
export function getAllPublicGroups(): Group[] {
  return mockGroups.filter((g) => g.visibility !== "private");
}

/** Get groups by type */
export function getGroupsByType(type: Group["groupType"]): Group[] {
  return mockGroups.filter((g) => g.groupType === type);
}

/** Get care groups by sub-category */
export function getGroupsByCareCategory(category: CareCategory): Group[] {
  return mockGroups.filter((g) => g.groupType === "care" && g.careCategory === category);
}

/** Get park groups near a neighbourhood */
export function getParkGroupsNear(neighbourhood: string): Group[] {
  return mockGroups.filter((g) => g.groupType === "park" && g.neighbourhood === neighbourhood);
}

/**
 * Get upcoming meets for a group, filtered to what `viewerId` is allowed to see.
 *
 * `Meet.groupId` is the single source of truth for the group↔meet relationship
 * (Mock World Building A2, 2026-04-30). The previous `Group.meetIds` array was
 * removed because the two paths drifted — see archived punch list P21.
 *
 * Visibility filter: `participants_only` meets (contracted/package-booked
 * instances) are stripped unless `viewerId` is the creator or on the roster.
 * See `lib/meetUtils.ts:isMeetVisibleTo`.
 */
export function getGroupMeets(groupId: string, viewerId?: string | null) {
  const group = getGroupById(groupId);
  if (!group) return [];
  return mockMeets
    .filter((m) => m.groupId === groupId && m.status === "upcoming")
    .filter((m) => isMeetVisibleTo(m, viewerId))
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    );
}

/** Count of upcoming meets belonging to this group. Card-friendly.
 * Viewer-aware: package/contracted meets are excluded for non-roster viewers
 * so the count matches what they'll see on the group's Meets tab. */
export function getGroupMeetCount(groupId: string, viewerId?: string | null): number {
  return mockMeets.filter(
    (m) =>
      m.groupId === groupId &&
      m.status === "upcoming" &&
      isMeetVisibleTo(m, viewerId),
  ).length;
}

/** Get the next upcoming meet for a group (for card display) */
export function getNextGroupMeet(groupId: string, viewerId?: string | null) {
  const meets = getGroupMeets(groupId, viewerId);
  if (meets.length === 0) return null;
  return meets.sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  )[0];
}

/**
 * Whether `viewer` and `subject` are co-members of any group. The mirror of
 * `viewerSharedMeetWith` for group membership.
 *
 * Used by surfaces that gate action affordances on shared context — e.g.
 * the locked profile page surfaces a Familiar pill when this returns true.
 * Group co-membership counts as shared context regardless of whether the
 * two have ever attended a meet together.
 *
 * Returns false when viewer === subject.
 */
export function viewerSharedGroupWith(viewerId: string, subjectId: string): boolean {
  if (viewerId === subjectId) return false;
  for (const group of mockGroups) {
    const memberIds = new Set(group.members.map((m) => m.userId));
    if (memberIds.has(viewerId) && memberIds.has(subjectId)) return true;
  }
  return false;
}

/** Names of groups both viewer and subject are members of. Used for the
 *  "You're both in [Group]" line on locked profile pages. */
export function getSharedGroupNames(viewerId: string, subjectId: string): string[] {
  if (viewerId === subjectId) return [];
  const out: string[] = [];
  for (const group of mockGroups) {
    const memberIds = new Set(group.members.map((m) => m.userId));
    if (memberIds.has(viewerId) && memberIds.has(subjectId)) out.push(group.name);
  }
  return out;
}

/**
 * Service-intersection rule for Care groups.
 *
 * A Care group surfaces the intersection of (a) services offered by its
 * provider members on their individual profiles and (b) services matching
 * the group's context (location / category / methodology). See
 * [[Groups & Care Model]] → Care Group Admin Model → Service intersection
 * rule.
 *
 * Today this returns *all* enabled services from each provider — services
 * don't carry location or methodology metadata yet, so there's nothing to
 * filter on. The function is the canonical entry point for any future
 * Care-group "Services from our team" rendering surface; when location
 * metadata lands on `CarerServiceConfig`, the filter below activates.
 *
 * Discover & Care B4, 2026-05-02.
 */
export function getCareGroupServices(group: Group): {
  provider: GroupProviderRef;
  service: CarerServiceConfig;
}[] {
  if (group.groupType !== "care" || !group.providers) return [];
  const out: { provider: GroupProviderRef; service: CarerServiceConfig }[] = [];
  for (const provider of group.providers) {
    const user = getUserById(provider.userId);
    const services = user?.carerProfile?.services ?? [];
    for (const service of services) {
      if (!service.enabled) continue;
      // Future filters (gated on data that doesn't exist yet):
      //   - service.locationContext intersect group.location/neighbourhood
      //   - service.methodology intersect group.config.methodology
      out.push({ provider, service });
    }
  }
  return out;
}
