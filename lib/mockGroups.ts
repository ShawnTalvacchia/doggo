import type { Group } from "./types";
import { mockMeets } from "./mockMeets";

export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Vinohrady Morning Crew",
    description:
      "We meet every week for a morning walk through Riegrovy sady. Chill pace, all dogs welcome. Come as you are — the dogs set the agenda.",
    groupType: "community",
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
        dogNames: ["Bella"],
        role: "member",
        joinedAt: "2025-12-03",
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
    groupType: "community",
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
    ],
    meetIds: ["meet-2"],
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
    groupType: "community",
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
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bella"],
        role: "member",
        joinedAt: "2026-01-08",
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
    groupType: "service",
    visibility: "open",
    hostedBy: "eva",
    hostedByName: "Eva",
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
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bella"],
        role: "member",
        joinedAt: "2026-02-05",
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
    groupType: "community",
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
    groupType: "community",
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
      { userId: "marek", userName: "Marek", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", dogNames: ["Aron"], role: "member", joinedAt: "2026-02-04" },
    ],
    meetIds: [],
    photos: ["/images/generated/evening-walk-group.jpeg"],
    photoPolicy: "optional",
    createdAt: "2026-02-01T18:00:00Z",
  },
  {
    id: "group-reactive-dogs",
    name: "Prague Reactive Dog Support",
    description:
      "A safe space for owners of reactive dogs in Prague. Share tips, organise small-group meets in quiet parks, and learn together. Approval required — write a short note about your dog when you request to join.",
    groupType: "community",
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
    ],
    meetIds: [],
    photos: ["/images/generated/goldie-leash.jpeg"],
    photoPolicy: "optional",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "group-klara-training",
    name: "Klára's Calm Dog Sessions",
    description:
      "Small-group training sessions focused on calm behaviour, recall, and socialisation. Hosted by Klára, a certified dog trainer. Open to all — check upcoming sessions and book your spot.",
    groupType: "service",
    visibility: "open",
    hostedBy: "klara",
    hostedByName: "Klára",
    neighbourhood: "Holešovice",
    location: "Stromovka, Prague 7",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    creatorId: "klara",
    creatorName: "Klára",
    members: [
      { userId: "klara", userName: "Klára", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", dogNames: ["Eda"], role: "admin", joinedAt: "2026-01-05" },
      { userId: "daniel", userName: "Daniel", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bára"], role: "member", joinedAt: "2026-02-10" },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bella"], role: "member", joinedAt: "2026-02-15" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], role: "member", joinedAt: "2026-03-01" },
    ],
    meetIds: [],
    photos: ["/images/generated/training-session.jpeg"],
    photoPolicy: "encouraged",
    createdAt: "2026-01-05T09:00:00Z",
  },
  {
    id: "group-karlin-neighbours",
    name: "Karlín Dog Neighbors",
    description:
      "A private group for dog owners in Karlín. Walk together, share recommendations, help each other out. Small, local, and trusted.",
    groupType: "community",
    visibility: "private",
    neighbourhood: "Karlín",
    location: "Karlín, Prague 8",
    coverPhotoUrl: "/images/generated/community-cover-vinohrady.jpeg",
    creatorId: "petra",
    creatorName: "Petra",
    members: [
      { userId: "petra", userName: "Petra", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", dogNames: ["Suki"], role: "admin", joinedAt: "2026-01-20" },
      { userId: "tomas_k", userName: "Tomáš K.", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80", dogNames: ["Hugo"], role: "member", joinedAt: "2026-02-20" },
    ],
    meetIds: [],
    photos: [],
    photoPolicy: "optional",
    createdAt: "2026-01-20T14:00:00Z",
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
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bella"], role: "member", joinedAt: "2025-11-05" },
      { userId: "martin", userName: "Martin", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80", dogNames: ["Charlie"], role: "member", joinedAt: "2025-11-08" },
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
      { userId: "tomas", userName: "Tomáš", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", dogNames: ["Bella"], role: "member", joinedAt: "2025-10-20" },
    ],
    meetIds: ["meet-1"],
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
    ],
    meetIds: [],
    photos: [],
    photoPolicy: "encouraged",
    createdAt: "2025-10-01T00:00:00Z",
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
