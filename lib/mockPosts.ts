import type { Post } from "./types";

export const mockPosts: Post[] = [
  // Personal posts (no groupId)
  {
    id: "post-1",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "/images/generated/shawn-profile.jpg",
    photos: [
      "/images/generated/spot-park-walk.jpeg",
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
    comments: [],
  },
  {
    id: "post-2",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    photos: [
      "/images/generated/rex-portrait.jpeg",
      "/images/generated/meet-greeting.jpeg",
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
    comments: [],
  },
  {
    id: "post-3",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    photos: [
      "/images/generated/luna-portrait.jpeg",
      "/images/generated/max-portrait.jpeg",
      "/images/generated/post-dog-park-sunset.jpeg",
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
    comments: [],
  },
  {
    id: "post-4",
    authorId: "martin",
    authorName: "Martin",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    photos: [
      "/images/generated/charlie-portrait.jpeg",
    ],
    tags: [
      { type: "dog", id: "charlie", label: "Charlie" },
    ],
    createdAt: "2026-03-19T16:20:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
    ],
    comments: [],
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
      "/images/generated/group-walk-stromovka.jpeg",
      "/images/generated/spot-portrait.jpeg",
      "/images/generated/park-hangout-riegrovy.jpeg",
      "/images/generated/goldie-playing.jpeg",
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
    comments: [
      {
        id: "comment-1",
        authorId: "shawn",
        authorName: "Shawn",
        authorAvatarUrl: "/images/generated/shawn-profile.jpg",
        text: "Spot was so well behaved today! Proud dog dad moment.",
        createdAt: "2026-03-22T10:15:00Z",
      },
      {
        id: "comment-2",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        text: "Luna loved it too. Same time tomorrow?",
        createdAt: "2026-03-22T10:22:00Z",
      },
      {
        id: "comment-3",
        authorId: "tomas",
        authorName: "Tomáš",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "Bella says yes 🐾",
        createdAt: "2026-03-22T10:30:00Z",
      },
    ],
  },
  {
    id: "post-6",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "/images/generated/shawn-profile.jpg",
    groupId: "group-2",
    groupName: "Stromovka Off-Leash Club",
    photos: [
      "/images/generated/spot-portrait.jpeg",
      "/images/generated/playdate-small-group.jpeg",
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
    comments: [
      {
        id: "comment-4",
        authorId: "jana",
        authorName: "Jana",
        authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        text: "Finally! Rex could learn a thing or two from Spot 😂",
        createdAt: "2026-03-21T12:00:00Z",
      },
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
      "/images/generated/training-session.jpeg",
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
    comments: [
      {
        id: "comment-5",
        authorId: "tomas",
        authorName: "Tomáš",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "30m?! We're stuck at 5m. Any tips?",
        createdAt: "2026-03-20T15:20:00Z",
      },
      {
        id: "comment-6",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        text: "High-value treats and patience! We started with just 3m in the garden.",
        createdAt: "2026-03-20T15:35:00Z",
      },
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
      "/images/generated/bella-portrait.jpeg",
      "/images/generated/post-new-trick.jpeg",
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
    comments: [],
  },
  // A personal post with 4 photos
  {
    id: "post-9",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    photos: [
      "/images/generated/post-adoption-anniversary.jpeg",
      "/images/generated/rex-portrait.jpeg",
      "/images/generated/post-first-swim.jpeg",
      "/images/generated/post-matching-outfits.jpeg",
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
    comments: [],
  },
  // A minimal post — no caption, single tag
  {
    id: "post-10",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl:
      "/images/generated/shawn-profile.jpg",
    photos: [
      "/images/generated/post-sleepy-dogjpeg.jpeg",
    ],
    tags: [
      { type: "dog", id: "goldie", label: "Goldie" },
    ],
    createdAt: "2026-03-17T18:00:00Z",
    reactions: [],
    comments: [],
  },

  // ── Additional community posts for content fill ──────────────────

  // group-tereza-neighbourhood (Vinohrady Evening Walkers)
  {
    id: "post-11",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: ["/images/generated/post-dog-park-sunset.jpeg"],
    caption: "Perfect evening for a walk. Franta found every puddle.",
    tags: [
      { type: "dog", id: "franta", label: "Franta" },
      { type: "community", id: "group-tereza-neighbourhood", label: "Vinohrady Evening Walkers" },
    ],
    createdAt: "2026-03-21T18:45:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-11a",
        authorId: "shawn",
        authorName: "Shawn",
        authorAvatarUrl: "/images/generated/shawn-profile.jpg",
        text: "Spot would have been right there with him!",
        createdAt: "2026-03-21T19:00:00Z",
      },
    ],
  },
  {
    id: "post-12",
    authorId: "shawn",
    authorName: "Shawn",
    authorAvatarUrl: "/images/generated/shawn-profile.jpg",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: ["/images/generated/spot-park-walk.jpeg", "/images/generated/meet-greeting.jpeg"],
    caption: "Ran into Martin and Charlie on Mánesova. Impromptu playdate in the park.",
    tags: [
      { type: "dog", id: "spot", label: "Spot" },
      { type: "person", id: "martin", label: "Martin" },
      { type: "community", id: "group-tereza-neighbourhood", label: "Vinohrady Evening Walkers" },
    ],
    createdAt: "2026-03-19T19:15:00Z",
    reactions: [
      { userId: "tereza", userName: "Tereza" },
      { userId: "martin", userName: "Martin" },
      { userId: "jana", userName: "Jana" },
    ],
    comments: [
      {
        id: "comment-12a",
        authorId: "martin",
        authorName: "Martin",
        authorAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        text: "Charlie was so tired after! Best kind of evening.",
        createdAt: "2026-03-19T20:00:00Z",
      },
      {
        id: "comment-12b",
        authorId: "tereza",
        authorName: "Tereza",
        authorAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        text: "Wish we'd been there! Next time text the group 😊",
        createdAt: "2026-03-19T20:15:00Z",
      },
    ],
  },

  // group-3 (Reactive Dog Support)
  {
    id: "post-13",
    authorId: "petra",
    authorName: "Petra",
    authorAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    groupId: "group-3",
    groupName: "Reactive Dog Support",
    photos: ["/images/generated/training-session.jpeg"],
    caption: "Maxi walked past two dogs today without barking. Small wins. We've been working on this for months.",
    tags: [
      { type: "dog", id: "maxi", label: "Maxi" },
      { type: "community", id: "group-3", label: "Reactive Dog Support" },
    ],
    createdAt: "2026-03-22T11:00:00Z",
    reactions: [
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "jana", userName: "Jana" },
      { userId: "martin", userName: "Martin" },
      { userId: "kate", userName: "Kate" },
    ],
    comments: [
      {
        id: "comment-13a",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        text: "That's huge! Luna was the same way. It gets easier.",
        createdAt: "2026-03-22T11:20:00Z",
      },
      {
        id: "comment-13b",
        authorId: "kate",
        authorName: "Kate",
        authorAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        text: "Months of work and it's so worth it. Well done Maxi!",
        createdAt: "2026-03-22T11:40:00Z",
      },
    ],
  },
  {
    id: "post-14",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    groupId: "group-3",
    groupName: "Reactive Dog Support",
    photos: ["/images/generated/luna-portrait.jpeg"],
    caption: "Anyone tried the BAT 2.0 protocol? Our trainer recommended it and I want to hear real experiences before we start.",
    tags: [
      { type: "dog", id: "luna", label: "Luna" },
      { type: "community", id: "group-3", label: "Reactive Dog Support" },
    ],
    createdAt: "2026-03-20T14:00:00Z",
    reactions: [
      { userId: "petra", userName: "Petra" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-14a",
        authorId: "tomas",
        authorName: "Tomáš",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "We did it with Bella. Really helped with her leash reactivity. Happy to chat about it if you want.",
        createdAt: "2026-03-20T14:30:00Z",
      },
    ],
  },

  // group-5 (Žižkov Dog Parents)
  {
    id: "post-15",
    authorId: "martin",
    authorName: "Martin",
    authorAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    groupId: "group-5",
    groupName: "Žižkov Dog Parents",
    photos: ["/images/generated/charlie-portrait.jpeg"],
    caption: "PSA: the water bowl outside Café Letka is back! Charlie approves.",
    tags: [
      { type: "dog", id: "charlie", label: "Charlie" },
      { type: "place", id: "zizkov", label: "Žižkov" },
      { type: "community", id: "group-5", label: "Žižkov Dog Parents" },
    ],
    createdAt: "2026-03-22T08:30:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "petra", userName: "Petra" },
    ],
    comments: [
      {
        id: "comment-15a",
        authorId: "jana",
        authorName: "Jana",
        authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        text: "The best news. Rex has been parched on our walks past there.",
        createdAt: "2026-03-22T08:50:00Z",
      },
    ],
  },

  // group-doodle-owners (Prague Doodle Owners — shawn is a member)
  {
    id: "post-16",
    authorId: "jana",
    authorName: "Jana",
    authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    groupId: "group-doodle-owners",
    groupName: "Prague Doodle Owners",
    photos: ["/images/generated/rex-portrait.jpeg", "/images/generated/goldie-playing.jpeg"],
    caption: "Grooming day results! Rex went in looking like a sheep, came out looking like a poodle. Worth every crown.",
    tags: [
      { type: "dog", id: "rex", label: "Rex" },
      { type: "community", id: "group-doodle-owners", label: "Prague Doodle Owners" },
    ],
    createdAt: "2026-03-21T16:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "eva", userName: "Eva" },
      { userId: "kate", userName: "Kate" },
    ],
    comments: [
      {
        id: "comment-16a",
        authorId: "shawn",
        authorName: "Shawn",
        authorAvatarUrl: "/images/generated/shawn-profile.jpg",
        text: "Where did you go? Goldie is overdue for a trim.",
        createdAt: "2026-03-21T16:20:00Z",
      },
      {
        id: "comment-16b",
        authorId: "jana",
        authorName: "Jana",
        authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        text: "Dognut on Vinohradská! They're great with curly coats.",
        createdAt: "2026-03-21T16:35:00Z",
      },
    ],
  },

  // group-klara-training (Klára's Calm Dog Sessions — care group, shawn is member)
  {
    id: "post-17",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/training-session.jpeg"],
    caption: "Next session is Thursday 10am at Letná. We'll work on loose-leash walking and impulse control. Bring high-value treats!",
    tags: [
      { type: "community", id: "group-klara-training", label: "Klára's Calm Dog Sessions" },
      { type: "place", id: "letna", label: "Letná" },
    ],
    createdAt: "2026-03-22T09:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "daniel", userName: "Daniel" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-17a",
        authorId: "daniel",
        authorName: "Daniel",
        authorAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        text: "Bára and I will be there! She's been pulling like crazy lately.",
        createdAt: "2026-03-22T09:15:00Z",
      },
      {
        id: "comment-17b",
        authorId: "shawn",
        authorName: "Shawn",
        authorAvatarUrl: "/images/generated/shawn-profile.jpg",
        text: "See you there. Spot needs the impulse control work badly 😅",
        createdAt: "2026-03-22T09:30:00Z",
      },
    ],
  },
  {
    id: "post-18",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/post-new-trick.jpeg"],
    caption: "Quick tip: if your dog won't focus outdoors, start with a 'watch me' cue in a quiet hallway before graduating to the park.",
    tags: [
      { type: "community", id: "group-klara-training", label: "Klára's Calm Dog Sessions" },
    ],
    createdAt: "2026-03-18T10:00:00Z",
    reactions: [
      { userId: "tomas", userName: "Tomáš" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "daniel", userName: "Daniel" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [],
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
