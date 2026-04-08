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
        authorId: "lucie",
        authorName: "Lucie",
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

  // group-reactive-dogs (Prague Reactive Dog Support)
  {
    id: "post-19",
    authorId: "ondrej",
    authorName: "Ondřej",
    authorAvatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/community-cover-reactive.jpeg"],
    caption: "Best advice I got: reactive doesn't mean aggressive. It means your dog is communicating fear. Patience and distance work miracles.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: "2026-04-05T10:30:00Z",
    reactions: [
      { userId: "petra", userName: "Petra" },
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "kate", userName: "Kate" },
    ],
    comments: [
      {
        id: "comment-19a",
        authorId: "petra",
        authorName: "Petra",
        authorAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        text: "This exactly. Maxi is not trying to be bad — he's just scared. Changed everything when I reframed it.",
        createdAt: "2026-04-05T10:50:00Z",
      },
    ],
  },
  {
    id: "post-20",
    authorId: "lucie",
    authorName: "Lucie",
    authorAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/training-session.jpeg"],
    caption: "Posted this for anyone new to the group: BAT (Behaviour Adjustment Training), Look at Me protocol, and desensitization. Three approaches that actually work. Happy to discuss what's worked for your pup.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: "2026-04-02T14:15:00Z",
    reactions: [
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "ondrej", userName: "Ondřej" },
    ],
    comments: [
      {
        id: "comment-20a",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        text: "BAT has been a game-changer for Luna. Thanks for putting this together.",
        createdAt: "2026-04-02T14:40:00Z",
      },
    ],
  },
  {
    id: "post-21",
    authorId: "petra",
    authorName: "Petra",
    authorAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/spot-portrait.jpeg"],
    caption: "Maxi had a breakthrough at the vet today. Didn't even need the muzzle. I think I'm more proud than he is. 🐾",
    tags: [
      { type: "dog", id: "maxi", label: "Maxi" },
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: "2026-03-28T16:00:00Z",
    reactions: [
      { userId: "eva", userName: "Eva" },
      { userId: "kate", userName: "Kate" },
      { userId: "ondrej", userName: "Ondřej" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-21a",
        authorId: "lucie",
        authorName: "Lucie",
        authorAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        text: "That's HUGE! You've put so much work in. Well done 💚",
        createdAt: "2026-03-28T16:20:00Z",
      },
    ],
  },

  // park-3 (Riegrovy Sady Dog Walks)
  {
    id: "post-22",
    authorId: "hana",
    authorName: "Hana",
    authorAvatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    groupId: "park-3",
    groupName: "Riegrovy Sady Dog Walks",
    photos: ["/images/generated/park-hangout-riegrovy.jpeg"],
    caption: "Sunday walk was perfect. All the dogs were so chill. Even found a puppy party by accident!",
    tags: [
      { type: "community", id: "park-3", label: "Riegrovy Sady Dog Walks" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy Sady" },
    ],
    createdAt: "2026-04-06T10:45:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-22a",
        authorId: "jana",
        authorName: "Jana",
        authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        text: "We were there! Rex was so happy. What a vibe!",
        createdAt: "2026-04-06T11:10:00Z",
      },
    ],
  },
  {
    id: "post-23",
    authorId: "lucie",
    authorName: "Lucie",
    authorAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    groupId: "park-3",
    groupName: "Riegrovy Sady Dog Walks",
    photos: ["/images/generated/goldie-playing.jpeg", "/images/generated/post-dog-park-sunset.jpeg"],
    caption: "The light at 6pm is unreal lately. Stella and Max had a proper play session. Tired pups = happy evening.",
    tags: [
      { type: "dog", id: "stella", label: "Stella" },
      { type: "community", id: "park-3", label: "Riegrovy Sady Dog Walks" },
    ],
    createdAt: "2026-03-31T18:15:00Z",
    reactions: [
      { userId: "hana", userName: "Hana" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [],
  },

  // park-2 (Stromovka Morning Crew)
  {
    id: "post-24",
    authorId: "anezka",
    authorName: "Anežka",
    authorAvatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    groupId: "park-2",
    groupName: "Stromovka Morning Crew",
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    caption: "The best part of my day. 6:30am walks with this crew is pure magic. Tomáš and Bella were in top form today!",
    tags: [
      { type: "person", id: "tomas", label: "Tomáš" },
      { type: "community", id: "park-2", label: "Stromovka Morning Crew" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: "2026-04-08T07:00:00Z",
    reactions: [
      { userId: "tomas", userName: "Tomáš" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "jana", userName: "Jana" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [
      {
        id: "comment-24a",
        authorId: "tomas",
        authorName: "Tomáš",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "Bella was flying! She loves Anežka 😊",
        createdAt: "2026-04-08T07:30:00Z",
      },
    ],
  },
  {
    id: "post-25",
    authorId: "jakub",
    authorName: "Jakub",
    authorAvatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    groupId: "park-2",
    groupName: "Stromovka Morning Crew",
    photos: ["/images/generated/meet-greeting.jpeg"],
    caption: "Saturday mornings with the crew. This is what community looks like. Same time next week? ☀️",
    tags: [
      { type: "community", id: "park-2", label: "Stromovka Morning Crew" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: "2026-04-05T08:30:00Z",
    reactions: [
      { userId: "anezka", userName: "Anežka" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [
      {
        id: "comment-25a",
        authorId: "anezka",
        authorName: "Anežka",
        authorAvatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
        text: "Always! This is the highlight of my week honestly.",
        createdAt: "2026-04-05T08:50:00Z",
      },
    ],
  },

  // park-karlin (Karlín Riverside Walks)
  {
    id: "post-26",
    authorId: "filip",
    authorName: "Filip",
    authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    groupId: "park-karlin",
    groupName: "Karlín Riverside Walks",
    photos: ["/images/generated/spot-park-walk.jpeg"],
    caption: "6am riverside stroll. The city is quiet, the air is fresh, and the dogs are all zen. Nothing beats it.",
    tags: [
      { type: "community", id: "park-karlin", label: "Karlín Riverside Walks" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: "2026-04-07T06:15:00Z",
    reactions: [
      { userId: "adela", userName: "Adéla" },
      { userId: "jana", userName: "Jana" },
    ],
    comments: [],
  },
  {
    id: "post-27",
    authorId: "adela",
    authorName: "Adéla",
    authorAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    groupId: "park-karlin",
    groupName: "Karlín Riverside Walks",
    photos: ["/images/generated/post-dog-park-sunset.jpeg", "/images/generated/goldie-playing.jpeg"],
    caption: "The riverside in spring is unbeatable. Sunny morning, good dogs, good company. This is what life should be.",
    tags: [
      { type: "community", id: "park-karlin", label: "Karlín Riverside Walks" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: "2026-04-04T07:45:00Z",
    reactions: [
      { userId: "filip", userName: "Filip" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-27a",
        authorId: "filip",
        authorName: "Filip",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "Spring hits different out there. See you tomorrow morning!",
        createdAt: "2026-04-04T08:10:00Z",
      },
    ],
  },

  // group-karlin-neighbours (Karlín Dog Neighbors)
  {
    id: "post-28",
    authorId: "filip",
    authorName: "Filip",
    authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/meet-greeting.jpeg"],
    caption: "Anyone around Kukulova/Sladkovského on weekends? Looking for some dog walking buddies in the neighborhood. Toby is friendly but gets lonely when I'm at work.",
    tags: [
      { type: "community", id: "group-karlin-neighbours", label: "Karlín Dog Neighbors" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: "2026-04-06T19:30:00Z",
    reactions: [
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [
      {
        id: "comment-28a",
        authorId: "adela",
        authorName: "Adéla",
        authorAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        text: "I'm right there! Sunny mornings work best for me. Want to coordinate?",
        createdAt: "2026-04-06T19:50:00Z",
      },
    ],
  },
  {
    id: "post-29",
    authorId: "adela",
    authorName: "Adéla",
    authorAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    caption: "Setting up a standing Saturday playdate for our neighborhood dogs. 10am at the small park by the river. Bring your pups! All ages/sizes welcome.",
    tags: [
      { type: "community", id: "group-karlin-neighbours", label: "Karlín Dog Neighbors" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: "2026-04-01T18:00:00Z",
    reactions: [
      { userId: "filip", userName: "Filip" },
    ],
    comments: [
      {
        id: "comment-29a",
        authorId: "filip",
        authorName: "Filip",
        authorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        text: "Perfect! Toby and I will be there for sure.",
        createdAt: "2026-04-01T18:20:00Z",
      },
    ],
  },

  // park-1 (Letná Dog Walks)
  {
    id: "post-30",
    authorId: "marek",
    authorName: "Marek",
    authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    groupId: "park-1",
    groupName: "Letná Dog Walks",
    photos: ["/images/generated/post-dog-park-sunset.jpeg"],
    caption: "The view from Letná never gets old. Oscar loves the hilltop. We come here every Sunday.",
    tags: [
      { type: "dog", id: "oscar", label: "Oscar" },
      { type: "community", id: "park-1", label: "Letná Dog Walks" },
      { type: "place", id: "letna", label: "Letná" },
    ],
    createdAt: "2026-04-06T16:30:00Z",
    reactions: [
      { userId: "jana", userName: "Jana" },
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [],
  },

  // park-5 (Vítkov Park Dogs)
  {
    id: "post-31",
    authorId: "ondrej",
    authorName: "Ondřej",
    authorAvatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80",
    groupId: "park-5",
    groupName: "Vítkov Park Dogs",
    photos: ["/images/generated/goldie-playing.jpeg"],
    caption: "Hill walk at Vítkov with the crew. Rocky doesn't care about the incline, just the company. 🐾",
    tags: [
      { type: "dog", id: "rocky", label: "Rocky" },
      { type: "community", id: "park-5", label: "Vítkov Park Dogs" },
      { type: "place", id: "vitkov", label: "Vítkov" },
    ],
    createdAt: "2026-04-03T17:00:00Z",
    reactions: [
      { userId: "martin", userName: "Martin" },
      { userId: "jana", userName: "Jana" },
    ],
    comments: [],
  },

  // group-senior-dogs (Senior Dogs & Slow Walks)
  {
    id: "post-32",
    authorId: "adela",
    authorName: "Adéla",
    authorAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    groupId: "group-senior-dogs",
    groupName: "Senior Dogs & Slow Walks",
    photos: ["/images/generated/spot-portrait.jpeg"],
    caption: "Sunny afternoon. No rush. Biscuit and I took our time through the neighborhood. This pace suits us both perfectly.",
    tags: [
      { type: "dog", id: "biscuit", label: "Biscuit" },
      { type: "community", id: "group-senior-dogs", label: "Senior Dogs & Slow Walks" },
    ],
    createdAt: "2026-04-05T14:30:00Z",
    reactions: [
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-32a",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        text: "Luna and I are cheering for Biscuit. The slow pace hits different at this stage of life.",
        createdAt: "2026-04-05T14:50:00Z",
      },
    ],
  },

  // Personal posts (no groupId)
  {
    id: "post-33",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    photos: ["/images/generated/post-adoption-anniversary.jpeg"],
    caption: "Franta's half-birthday! Hard to believe it's been 6 months. He's gone from scared rescue to absolute goofball. Worth every moment.",
    tags: [
      { type: "dog", id: "franta", label: "Franta" },
    ],
    createdAt: "2026-04-02T12:00:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "martin", userName: "Martin" },
      { userId: "eva", userName: "Eva" },
      { userId: "jana", userName: "Jana" },
    ],
    comments: [
      {
        id: "comment-33a",
        authorId: "martin",
        authorName: "Martin",
        authorAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        text: "What a transformation! Franta's the happiest guy now.",
        createdAt: "2026-04-02T12:30:00Z",
      },
    ],
  },
  {
    id: "post-34",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    photos: ["/images/generated/training-session.jpeg", "/images/generated/post-new-trick.jpeg"],
    caption: "One of my students' dogs just passed his CGC exam! Watching this journey from a total handful to a well-mannered pup has been amazing. Proud trainer moment. 💚",
    tags: [
      { type: "place", id: "letna", label: "Letná" },
    ],
    createdAt: "2026-04-07T16:45:00Z",
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "daniel", userName: "Daniel" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "eva", userName: "Eva" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-34a",
        authorId: "daniel",
        authorName: "Daniel",
        authorAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        text: "That's incredible! Which dog? Bára and I want to know who we're celebrating!",
        createdAt: "2026-04-07T17:15:00Z",
      },
    ],
  },
  {
    id: "post-35",
    authorId: "daniel",
    authorName: "Daniel",
    authorAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    photos: ["/images/generated/post-first-swim.jpeg"],
    caption: "Bára took her first swim of the season today! Moments like this are why I got her. Pure joy. 🏊",
    tags: [
      { type: "dog", id: "bara", label: "Bára" },
    ],
    createdAt: "2026-04-08T15:20:00Z",
    reactions: [
      { userId: "klara", userName: "Klára" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-35a",
        authorId: "klara",
        authorName: "Klára",
        authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        text: "That smile! Bára's living her best life with you.",
        createdAt: "2026-04-08T15:40:00Z",
      },
    ],
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
