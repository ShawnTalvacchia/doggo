import type { Group } from "./types";
import { mockMeets } from "./mockMeets";

export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Vinohrady Morning Crew",
    description:
      "We meet every week for a morning walk through Riegrovy sady. Chill pace, all dogs welcome. Come as you are — the dogs set the agenda.",
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
