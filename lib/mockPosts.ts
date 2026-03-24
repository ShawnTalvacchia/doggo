import type { Post } from "./types";

export const mockPosts: Post[] = [
  // Personal posts (no groupId)
  {
    id: "post-1",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Spot discovered snow for the first time. Complete chaos.",
    tags: [
      { type: "dog", id: "spot", label: "Spot" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy Sady" },
    ],
    createdAt: "2026-03-22T09:15:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "martin", userName: "Martin" },
      { userId: "petra", userName: "Petra" },
    ],
  },
  {
    id: "post-2",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Rex made a friend at the park today 🐾",
    tags: [
      { type: "dog", id: "rex", label: "Rex" },
      { type: "person", id: "shawn", label: "Shawn" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: "2026-03-21T14:30:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "eva", userName: "Eva" },
      { userId: "martin", userName: "Martin" },
    ],
  },
  {
    id: "post-3",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534361960057-19f4434a6b65?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Luna and Max's favourite bench. They sit here every morning like little sentinels.",
    tags: [
      { type: "dog", id: "luna", label: "Luna" },
      { type: "dog", id: "max", label: "Max" },
      { type: "place", id: "havlickovy-sady", label: "Havlíčkovy Sady" },
    ],
    createdAt: "2026-03-20T08:45:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "jana", userName: "Jana" },
    ],
  },
  {
    id: "post-4",
    authorId: "martin",
    authorName: "Martin",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
    ],
    tags: [
      { type: "dog", id: "charlie", label: "Charlie" },
    ],
    createdAt: "2026-03-19T16:20:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
    ],
  },

  // Community posts (with groupId)
  {
    id: "post-5",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    groupId: "group-1",
    groupName: "Vinohrady Morning Crew",
    photos: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Great turnout at this morning's walk! 6 dogs, zero drama.",
    tags: [
      { type: "community", id: "group-1", label: "Vinohrady Morning Crew" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy Sady" },
      { type: "dog", id: "rex", label: "Rex" },
      { type: "dog", id: "spot", label: "Spot" },
    ],
    createdAt: "2026-03-22T10:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "martin", userName: "Martin" },
      { userId: "petra", userName: "Petra" },
      { userId: "lukas", userName: "Lukáš" },
      { userId: "kate", userName: "Kate" },
    ],
  },
  {
    id: "post-6",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    groupId: "group-2",
    groupName: "Stromovka Off-Leash Club",
    photos: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534361960057-19f4434a6b65?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Spot finally learned to share the ball. Progress!",
    tags: [
      { type: "dog", id: "spot", label: "Spot" },
      { type: "community", id: "group-2", label: "Stromovka Off-Leash Club" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: "2026-03-21T11:30:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
      { userId: "eva", userName: "Eva" },
    ],
  },
  {
    id: "post-7",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    groupId: "group-4",
    groupName: "Letná Recall Training",
    photos: [
      "https://images.unsplash.com/photo-1612774412771-005ed8e861d2?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Luna nailed the 30m recall today. Treats are powerful motivators.",
    tags: [
      { type: "dog", id: "luna", label: "Luna" },
      { type: "community", id: "group-4", label: "Letná Recall Training" },
    ],
    createdAt: "2026-03-20T15:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "jana", userName: "Jana" },
      { userId: "martin", userName: "Martin" },
    ],
  },
  {
    id: "post-8",
    authorId: "tomas",
    authorName: "Tomáš",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    groupId: "group-1",
    groupName: "Vinohrady Morning Crew",
    photos: [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Bella showing off at the morning walk. She thinks she runs this crew.",
    tags: [
      { type: "dog", id: "bella", label: "Bella" },
      { type: "person", id: "shawn", label: "Shawn" },
      { type: "community", id: "group-1", label: "Vinohrady Morning Crew" },
    ],
    createdAt: "2026-03-19T09:30:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "jana", userName: "Jana" },
      { userId: "eva", userName: "Eva" },
    ],
  },
  // A personal post with 4 photos
  {
    id: "post-9",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1612774412771-005ed8e861d2?auto=format&fit=crop&w=600&q=80",
    ],
    caption: "Rex's adoption anniversary! One year of morning walks, stolen socks, and unconditional love.",
    tags: [
      { type: "dog", id: "rex", label: "Rex" },
    ],
    createdAt: "2026-03-18T12:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "martin", userName: "Martin" },
      { userId: "petra", userName: "Petra" },
      { userId: "lukas", userName: "Lukáš" },
      { userId: "kate", userName: "Kate" },
      { userId: "ondrej", userName: "Ondřej" },
      { userId: "hana", userName: "Hana" },
      { userId: "david", userName: "David" },
      { userId: "klara", userName: "Klára" },
      { userId: "filip", userName: "Filip" },
    ],
  },
  // A minimal post — no caption, single tag
  {
    id: "post-10",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    photos: [
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80",
    ],
    tags: [
      { type: "dog", id: "goldie", label: "Goldie" },
    ],
    createdAt: "2026-03-17T18:00:00Z",
    reactions: [],
  },
];

/** Get posts by a specific user */
export function getPostsByUser(userId: string): Post[] {
  return mockPosts
    .filter((p) => p.authorId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Get posts for a specific community */
export function getPostsByGroup(groupId: string): Post[] {
  return mockPosts
    .filter((p) => p.groupId === groupId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Get recent posts (most recent first) */
export function getRecentPosts(limit = 10): Post[] {
  return [...mockPosts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/** Get a single post by ID */
export function getPostById(id: string): Post | undefined {
  return mockPosts.find((p) => p.id === id);
}
