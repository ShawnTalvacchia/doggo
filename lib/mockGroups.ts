import type { Group, CareCategory, CareGroupConfig } from "./types";
import { mockMeets } from "./mockMeets";

/** Default care group configuration by provider category */
export const CARE_CONFIG_DEFAULTS: Record<CareCategory, CareGroupConfig> = {
  training:  { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "mobile", capacityEnabled: true,  galleryMode: "standard" },
  walking:   { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: false, serviceListingsVisible: true,  locationType: "mobile", capacityEnabled: true,  galleryMode: "updates" },
  grooming:  { eventsEnabled: false, bookingCTAsEnabled: true,  discussionEnabled: false, serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: false, galleryMode: "portfolio" },
  boarding:  { eventsEnabled: true,  bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: true,  galleryMode: "updates" },
  rehab:     { eventsEnabled: false, bookingCTAsEnabled: true,  discussionEnabled: true,  serviceListingsVisible: true,  locationType: "fixed",  capacityEnabled: false, galleryMode: "standard" },
  venue:     { eventsEnabled: true,  bookingCTAsEnabled: false, discussionEnabled: false, serviceListingsVisible: false, locationType: "fixed",  capacityEnabled: false, galleryMode: "standard" },
  vet:       { eventsEnabled: false, bookingCTAsEnabled: false, discussionEnabled: true,  serviceListingsVisible: false, locationType: "fixed",  capacityEnabled: false, galleryMode: "standard" },
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
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Rex"],
        role: "member",
        joinedAt: "2025-11-12",
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Hugo"],
        role: "member",
        joinedAt: "2025-12-03",
      },
      {
        userId: "tereza",
        userName: "Tereza",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Franta"],
        role: "member",
        joinedAt: "2025-11-15",
      },
      {
        userId: "marek",
        userName: "Marek",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Benny"],
        role: "member",
        joinedAt: "2025-11-20",
      },
      {
        userId: "lucie",
        userName: "Lucie",
        avatarUrl:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Pepík"],
        role: "member",
        joinedAt: "2025-12-01",
      },
    ],
    meetIds: ["meet-1"],
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
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    creatorId: "jana",
    creatorName: "Jana",
    members: [
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
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
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna", "Max"],
        role: "member",
        joinedAt: "2025-12-08",
      },
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Charlie"],
        role: "member",
        joinedAt: "2026-01-10",
      },
      {
        userId: "klara",
        userName: "Klára",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Eda"],
        role: "member",
        joinedAt: "2026-01-15",
      },
      {
        userId: "filip",
        userName: "Filip",
        avatarUrl:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Toby"],
        role: "member",
        joinedAt: "2026-01-20",
      },
    ],
    meetIds: ["meet-2", "meet-9", "meet-16", "meet-21"],
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
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna"],
        role: "admin",
        joinedAt: "2026-01-05",
      },
      {
        userId: "daniel",
        userName: "Daniel",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bára"],
        role: "member",
        joinedAt: "2026-01-08",
      },
      {
        userId: "hana",
        userName: "Hana",
        avatarUrl:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Runa"],
        role: "member",
        joinedAt: "2026-01-10",
      },
      {
        userId: "anezka",
        userName: "Anežka",
        avatarUrl:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Nela"],
        role: "member",
        joinedAt: "2026-01-12",
      },
      {
        userId: "vitek",
        userName: "Vítek",
        avatarUrl:
          "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Sam"],
        role: "member",
        joinedAt: "2026-01-20",
      },
    ],
    meetIds: [],
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
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    creatorId: "eva",
    creatorName: "Eva",
    members: [
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna"],
        role: "admin",
        joinedAt: "2026-02-01",
      },
      {
        userId: "klara",
        userName: "Klára",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Eda"],
        role: "member",
        joinedAt: "2026-02-03",
      },
      {
        userId: "filip",
        userName: "Filip",
        avatarUrl:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
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
    ],
    meetIds: ["meet-3"],
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
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Charlie"],
        role: "admin",
        joinedAt: "2026-02-15",
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Rex"],
        role: "member",
        joinedAt: "2026-02-18",
      },
      {
        userId: "anezka",
        userName: "Anežka",
        avatarUrl:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
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
    meetIds: [],
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
      "A small group of neighbours who walk together most evenings around Vinohrady. Casual, consistent, and dog-friendly. Created by Tereza after meeting regulars at Riegrovy Sady.",
    groupType: "neighbor",
    visibility: "private",
    neighbourhood: "Vinohrady",
    location: "Vinohrady, Prague 2",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    creatorId: "tereza",
    creatorName: "Tereza",
    members: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "admin", joinedAt: "2026-02-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-02-03" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2026-02-05" },
      { userId: "marek", userName: "Marek", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", dogNames: ["Benny"], role: "member", joinedAt: "2026-02-04" },
      { userId: "lucie", userName: "Lucie", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", dogNames: ["Pepík"], role: "member", joinedAt: "2026-02-06" },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", dogNames: ["Mia"], role: "member", joinedAt: "2026-03-10" },
    ],
    meetIds: ["meet-13", "meet-20"],
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
    creatorId: "daniel",
    creatorName: "Daniel",
    members: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bára"], role: "admin", joinedAt: "2026-01-10" },
      { userId: "klara", userName: "Klára", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", dogNames: ["Eda"], role: "member", joinedAt: "2026-01-12" },
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2026-01-15" },
      { userId: "hana", userName: "Hana", avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80", dogNames: ["Runa"], role: "member", joinedAt: "2026-01-14" },
      { userId: "anezka", userName: "Anežka", avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80", dogNames: ["Nela"], role: "member", joinedAt: "2026-01-16" },
      { userId: "vitek", userName: "Vítek", avatarUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80", dogNames: ["Sam"], role: "member", joinedAt: "2026-01-25" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna"], role: "member", joinedAt: "2026-01-18" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-02-01" },
    ],
    meetIds: ["meet-10", "meet-17"],
    photos: ["/images/generated/goldie-leash.jpeg"],
    photoPolicy: "optional",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "group-klara-training",
    name: "Klára's Calm Dog Sessions",
    description:
      "Small-group training sessions focused on calm behaviour, recall, and socialisation. Hosted by Klára, a certified dog trainer. Open to all — check upcoming sessions and book your spot.",
    groupType: "care",
    careCategory: "training",
    visibility: "open",
    hostedBy: "klara",
    hostedByName: "Klára",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    neighbourhood: "Holešovice",
    location: "Stromovka, Prague 7",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    creatorId: "klara",
    creatorName: "Klára",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.training,
    serviceListings: [
      { id: "svc-klara-1", title: "Group Training Session", description: "Small-group park session (max 6 dogs). Focus on recall, loose-leash walking, and calm greetings.", priceFrom: 350, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-klara-2", title: "Puppy Socialisation Class", description: "Structured socialisation for puppies 3–6 months. Safe introductions, confidence building, basic cues.", priceFrom: 400, priceUnit: "per session", bookingHref: "/bookings", active: true },
      { id: "svc-klara-3", title: "1-on-1 Behaviour Consultation", description: "Private session for reactive dogs, anxiety, or specific behaviour challenges. Includes follow-up plan.", priceFrom: 800, priceUnit: "per session", bookingHref: "/bookings", active: true },
    ],
    meetIds: ["meet-care-1", "meet-11", "meet-18"],
    members: [
      { userId: "klara", userName: "Klára", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", dogNames: ["Eda"], role: "admin", joinedAt: "2026-01-05" },
      { userId: "daniel", userName: "Daniel", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bára"], role: "member", joinedAt: "2026-02-10" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-03-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2026-03-05" },
      { userId: "filip", userName: "Filip", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", dogNames: ["Toby"], role: "member", joinedAt: "2026-03-08" },
      { userId: "hana", userName: "Hana", avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80", dogNames: ["Runa"], role: "member", joinedAt: "2026-02-20" },
    ],
    photos: [
      "/images/generated/training-session.jpeg",
      "/images/generated/goldie-leash.jpeg",
      "/images/generated/post-new-trick.jpeg",
      "/images/generated/spot-park-walk.jpeg",
      "/images/generated/meet-greeting.jpeg",
      "/images/generated/park-hangout-riegrovy.jpeg",
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
    coverPhotoUrl: "/images/generated/community-cover-vinohrady.jpeg",
    creatorId: "petra",
    creatorName: "Petra",
    members: [
      { userId: "petra", userName: "Petra", avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80", dogNames: ["Daisy"], role: "admin", joinedAt: "2026-01-20" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-20" },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80", dogNames: ["Rocky"], role: "member", joinedAt: "2026-02-22" },
      { userId: "adela", userName: "Adéla", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", dogNames: ["Číča"], role: "member", joinedAt: "2026-02-25" },
    ],
    meetIds: [],
    photos: [],
    photoPolicy: "optional",
    createdAt: "2026-01-20T14:00:00Z",
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
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "admin", joinedAt: "2026-01-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna"], role: "member", joinedAt: "2026-01-20" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"], role: "member", joinedAt: "2026-02-01" },
    ],
    meetIds: [],
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
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "admin", joinedAt: "2026-02-10" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-15" },
    ],
    meetIds: [],
    photos: ["/images/generated/spot-resting.jpeg"],
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
    hostedBy: "pawel",
    hostedByName: "Pawel",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
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
      { userId: "pawel", userName: "Pawel", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-12-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-01-10" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2026-01-15" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2026-02-01" },
    ],
    meetIds: ["meet-care-2"],
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
    hostedBy: "dognut",
    hostedByName: "Dognut Grooming",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
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
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-10" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2026-01-05" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"], role: "member", joinedAt: "2026-02-01" },
    ],
    meetIds: [],
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
    hostedBy: "happy_tails",
    hostedByName: "Markéta",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
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
      { userId: "happy_tails", userName: "Markéta", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", dogNames: ["Mia"], role: "admin", joinedAt: "2025-10-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2025-11-15" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-01-10" },
    ],
    meetIds: [],
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
    hostedBy: "physiodog",
    hostedByName: "Dr. Novotná",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
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
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-10-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Max"], role: "member", joinedAt: "2025-11-01" },
    ],
    meetIds: [],
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
    hostedBy: "cafe_letka",
    hostedByName: "Café Letka",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    neighbourhood: "Letná",
    location: "Letná, Prague 7",
    locationFixed: "Letenské náměstí 3, Prague 7",
    coverPhotoUrl: "/images/generated/community-cover-vinohrady.jpeg",
    creatorId: "cafe_letka",
    creatorName: "Café Letka",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.venue,
    serviceListings: [],
    members: [
      { userId: "cafe_letka", userName: "Café Letka", avatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-10-01" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-11-15" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2025-12-01" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna"], role: "member", joinedAt: "2026-01-10" },
    ],
    meetIds: ["meet-care-3"],
    photos: ["/images/generated/community-cover-vinohrady.jpeg", "/images/generated/park-hangout-riegrovy.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T12:00:00Z",
  },
  {
    id: "group-premiumvet",
    name: "PremiumVet Prague Community",
    description:
      "Health tips, seasonal alerts, and Q&A from PremiumVet's team. Join for vaccination reminders, tick-season warnings, and community wellness events. Your neighbourhood vet, online.",
    groupType: "care",
    careCategory: "vet",
    visibility: "open",
    hostedBy: "premiumvet",
    hostedByName: "PremiumVet",
    hostedByAvatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    neighbourhood: "Vinohrady",
    location: "Vinohrady, Prague 2",
    locationFixed: "Mánesova 67, Prague 2",
    coverPhotoUrl: "/images/generated/spot-portrait.jpeg",
    creatorId: "premiumvet",
    creatorName: "PremiumVet",
    galleryMode: "standard",
    careConfig: CARE_CONFIG_DEFAULTS.vet,
    serviceListings: [],
    members: [
      { userId: "premiumvet", userName: "PremiumVet", avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "admin", joinedAt: "2025-09-01" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot", "Goldie"], role: "member", joinedAt: "2025-10-01" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2025-10-15" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-01" },
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-15" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-12-01" },
    ],
    meetIds: [],
    photos: ["/images/generated/spot-portrait.jpeg"],
    photoPolicy: "optional",
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
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-11-01" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2025-11-05" },
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-08" },
      { userId: "klara", userName: "Klára", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", dogNames: ["Eda"], role: "member", joinedAt: "2025-11-10" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-11-12" },
      { userId: "nikola", userName: "Nikola", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", dogNames: [], role: "member", joinedAt: "2025-11-15" },
    ],
    meetIds: ["meet-3"],
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
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-10-15" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-11-20" },
      { userId: "klara", userName: "Klára", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", dogNames: ["Eda"], role: "member", joinedAt: "2025-10-20" },
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-01" },
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna", "Max"], role: "member", joinedAt: "2025-11-05" },
      { userId: "filip", userName: "Filip", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", dogNames: ["Toby"], role: "member", joinedAt: "2025-12-01" },
    ],
    meetIds: [],
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
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-10-12" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2025-10-20" },
      { userId: "tereza", userName: "Tereza", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", dogNames: ["Franta"], role: "member", joinedAt: "2025-10-05" },
      { userId: "marek", userName: "Marek", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", dogNames: ["Benny"], role: "member", joinedAt: "2025-10-08" },
      { userId: "lucie", userName: "Lucie", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", dogNames: ["Pepík"], role: "member", joinedAt: "2025-10-15" },
      { userId: "jakub", userName: "Jakub", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80", dogNames: ["Aron"], role: "member", joinedAt: "2025-12-01" },
    ],
    meetIds: ["meet-1", "meet-7", "meet-8", "meet-14", "meet-15"],
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
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-01" },
    ],
    meetIds: [],
    photos: ["/images/generated/evening-walk-group.jpeg"],
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
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-10" },
      { userId: "jana", userName: "Jana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", dogNames: ["Rex"], role: "member", joinedAt: "2025-12-01" },
      { userId: "adela", userName: "Adéla", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", dogNames: ["Číča"], role: "member", joinedAt: "2025-12-05" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2025-12-10" },
      { userId: "anezka", userName: "Anežka", avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80", dogNames: ["Nela"], role: "member", joinedAt: "2026-01-05" },
    ],
    meetIds: [],
    photos: [],
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
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    creatorId: "system",
    creatorName: "Doggo",
    members: [
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-15" },
      { userId: "petra", userName: "Petra", avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80", dogNames: ["Daisy"], role: "member", joinedAt: "2026-02-16" },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80", dogNames: ["Rocky"], role: "member", joinedAt: "2026-02-18" },
      { userId: "adela", userName: "Adéla", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", dogNames: ["Číča"], role: "member", joinedAt: "2026-02-20" },
    ],
    meetIds: ["meet-12", "meet-19"],
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
      { userId: "eva", userName: "Eva", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", dogNames: ["Luna"], role: "member", joinedAt: "2025-12-15" },
    ],
    meetIds: [],
    photos: [],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
  },
];

/** Get groups the current user belongs to */
export function getUserGroups(userId: string): Group[] {
  return mockGroups.filter((g) => g.members.some((m) => m.userId === userId));
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

/** Get upcoming meets for a group */
export function getGroupMeets(groupId: string) {
  const group = getGroupById(groupId);
  if (!group) return [];
  return mockMeets.filter(
    (m) => group.meetIds.includes(m.id) && m.status === "upcoming"
  );
}

/** Get the next upcoming meet for a group (for card display) */
export function getNextGroupMeet(groupId: string) {
  const meets = getGroupMeets(groupId);
  if (meets.length === 0) return null;
  return meets.sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  )[0];
}
