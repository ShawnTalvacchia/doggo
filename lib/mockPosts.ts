import type { Post } from "./types";
import { daysAgoIso, daysFromNowIso } from "./mockDate";

export const mockPosts: Post[] = [
  // Provider post in community group — demonstrates care provider badge
  {
    id: "post-klara-community",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl:
      "/images/generated/klara-profile.jpeg",
    groupId: "group-1",
    groupName: "Vinohrady Morning Crew",
    photos: ["/images/generated/park-hangout-riegrovy.jpeg"],
    caption:
      "Great session this morning! If anyone's interested in recall training, I'm running a small group next Thursday at Riegrovy sady. DM me for details.",
    tags: [
      { type: "place", id: "riegrovy-sady", label: "Riegrovy sady" },
      { type: "community", id: "group-1", label: "Vinohrady Morning Crew" },
    ],
    // Caption says "this morning" → keep this post fresh so the wording
    // reads coherently regardless of when the demo is opened. Cross-Cutting
    // Flow Testing P20 sweep 2026-05-11.
    createdAt: daysAgoIso(0, "10:30"),
    reactions: [
      { userId: "shawn", userName: "Shawn" },
      { userId: "jana", userName: "Jana" },
      { userId: "tereza", userName: "Tereza" },
    ],
    comments: [
      {
        id: "comment-klara-1",
        authorId: "shawn",
        authorName: "Shawn",
        authorAvatarUrl: "/images/generated/shawn-profile.jpg",
        text: "Spot could use some recall help — count us in!",
        createdAt: daysAgoIso(0, "11:00"),
      },
    ],
  },
  // Demo Narrative V2 — Klára's walk post, fired off by the viewer in Beat 2's
  // fire-off step. Pre-seeded so it's real feed content; the walkthrough card
  // surfaces it for a one-tap Share. Image is W2.5 (to be generated).
  {
    id: "post-klara-stromovka-walk",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    // Posted to Klára's care group — Beat 2 navigates the tester here
    // and shows the post landing in the group's feed.
    groupId: "group-klara-training",
    photos: ["/images/generated/post-stromovka-walk.jpeg"],
    // Caption must match the walkthrough's fire-off card preview
    // (`fireOff.caption` for Beat 2's Share step in walkthroughBeats.ts)
    // — Beat 2 step 6 shows this post landing in the feed right after the
    // tester "shares" it, so the two have to read identically.
    caption: "Some new faces on the morning walk. Look at these good boys. 🐾",
    tags: [
      { type: "place", id: "stromovka", label: "Stromovka" },
      { type: "meet", id: "meet-klara-stromovka", label: "Stromovka morning walk" },
    ],
    createdAt: daysAgoIso(0, "13:00"),
    reactions: [
      { userId: "magda", userName: "Magda" },
      { userId: "hana", userName: "Hana" },
      { userId: "filip", userName: "Filip" },
    ],
    comments: [],
  },
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
      "/images/generated/jana-profile.jpeg",
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
      "/images/generated/eva-profile.jpeg",
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
      "/images/generated/martin-profile.jpeg",
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
      "/images/generated/jana-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/eva-profile.jpeg",
        text: "Luna loved it too. Same time tomorrow?",
        createdAt: "2026-03-22T10:22:00Z",
      },
      {
        id: "comment-3",
        authorId: "tomas",
        authorName: "Tomáš",
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/jana-profile.jpeg",
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
      "/images/generated/eva-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
        text: "30m?! We're stuck at 5m. Any tips?",
        createdAt: "2026-03-20T15:20:00Z",
      },
      {
        id: "comment-6",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "/images/generated/eva-profile.jpeg",
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
      "/images/generated/tomas-profile.jpeg",
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
      "/images/generated/jana-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: ["/images/generated/post-franta-stick.jpeg"],
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
        authorAvatarUrl: "/images/generated/martin-profile.jpeg",
        text: "Charlie was so tired after! Best kind of evening.",
        createdAt: "2026-03-19T20:00:00Z",
      },
      {
        id: "comment-12b",
        authorId: "tereza",
        authorName: "Tereza",
        authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/zuzana-profile.jpeg",
    groupId: "group-3",
    groupName: "Reactive Dog Support",
    photos: ["/images/generated/post-reactive-walk.jpeg"],
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
        authorAvatarUrl: "/images/generated/eva-profile.jpeg",
        text: "That's huge! Luna was the same way. It gets easier.",
        createdAt: "2026-03-22T11:20:00Z",
      },
      {
        id: "comment-13b",
        authorId: "lucie",
        authorName: "Lucie",
        authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
        text: "Months of work and it's so worth it. Well done Maxi!",
        createdAt: "2026-03-22T11:40:00Z",
      },
    ],
  },
  {
    id: "post-14",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl: "/images/generated/eva-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/martin-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/jana-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/jana-profile.jpeg",
    groupId: "group-doodle-owners",
    groupName: "Prague Doodle Owners",
    photos: ["/images/generated/rex-portrait.jpeg", "/images/generated/post-dognut-grooming.jpeg"],
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
        authorAvatarUrl: "/images/generated/jana-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/care-klara-training.jpeg"],
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
        authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/ondrej-profile.jpeg",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/community-cover-reactive.jpeg"],
    caption: "Best advice I got: reactive doesn't mean aggressive. It means your dog is communicating fear. Patience and distance work miracles.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: daysAgoIso(21, "10:30"),
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
        authorAvatarUrl: "/images/generated/zuzana-profile.jpeg",
        text: "This exactly. Maxi is not trying to be bad — he's just scared. Changed everything when I reframed it.",
        createdAt: daysAgoIso(21, "10:50"),
      },
    ],
  },
  {
    id: "post-20",
    authorId: "lucie",
    authorName: "Lucie",
    authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/post-training-recall.jpeg"],
    caption: "Posted this for anyone new to the group: BAT (Behaviour Adjustment Training), Look at Me protocol, and desensitization. Three approaches that actually work. Happy to discuss what's worked for your pup.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: daysAgoIso(24, "14:15"),
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
        authorAvatarUrl: "/images/generated/eva-profile.jpeg",
        text: "BAT has been a game-changer for Luna. Thanks for putting this together.",
        createdAt: daysAgoIso(24, "14:40"),
      },
    ],
  },
  {
    id: "post-21",
    authorId: "petra",
    authorName: "Petra",
    authorAvatarUrl: "/images/generated/zuzana-profile.jpeg",
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
        authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
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
    authorAvatarUrl: "/images/generated/hana-profile.jpeg",
    groupId: "park-3",
    groupName: "Riegrovy Sady Dog Walks",
    photos: ["/images/generated/park-hangout-riegrovy.jpeg"],
    caption: "Sunday walk was perfect. All the dogs were so chill. Even found a puppy party by accident!",
    tags: [
      { type: "community", id: "park-3", label: "Riegrovy Sady Dog Walks" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy Sady" },
    ],
    createdAt: daysAgoIso(20, "10:45"),
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
        authorAvatarUrl: "/images/generated/jana-profile.jpeg",
        text: "We were there! Rex was so happy. What a vibe!",
        createdAt: daysAgoIso(20, "11:10"),
      },
    ],
  },
  {
    id: "post-23",
    authorId: "lucie",
    authorName: "Lucie",
    authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
    groupId: "park-3",
    groupName: "Riegrovy Sady Dog Walks",
    photos: ["/images/generated/post-stromovka-saturday.jpeg", "/images/generated/post-dog-park-sunset.jpeg"],
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
    authorAvatarUrl: "/images/generated/anezka-profile.jpeg",
    groupId: "park-2",
    groupName: "Stromovka Morning Crew",
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    caption: "The best part of my day. 6:30am walks with this crew is pure magic. Tomáš and Bella were in top form today!",
    tags: [
      { type: "person", id: "tomas", label: "Tomáš" },
      { type: "community", id: "park-2", label: "Stromovka Morning Crew" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: daysAgoIso(18, "07:00"),
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
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
        text: "Bella was flying! She loves Anežka 😊",
        createdAt: daysAgoIso(18, "07:30"),
      },
    ],
  },
  {
    id: "post-25",
    authorId: "jakub",
    authorName: "Jakub",
    authorAvatarUrl: "/images/generated/jakub-profile.jpeg",
    groupId: "park-2",
    groupName: "Stromovka Morning Crew",
    photos: ["/images/generated/meet-greeting.jpeg"],
    caption: "Saturday mornings with the crew. This is what community looks like. Same time next week? ☀️",
    tags: [
      { type: "community", id: "park-2", label: "Stromovka Morning Crew" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: daysAgoIso(21, "08:30"),
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
        authorAvatarUrl: "/images/generated/anezka-profile.jpeg",
        text: "Always! This is the highlight of my week honestly.",
        createdAt: daysAgoIso(21, "08:50"),
      },
    ],
  },

  // park-karlin (Karlín Riverside Walks)
  {
    id: "post-26",
    authorId: "filip",
    authorName: "Filip",
    authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    groupId: "park-karlin",
    groupName: "Karlín Riverside Walks",
    photos: ["/images/generated/spot-park-walk.jpeg"],
    caption: "6am riverside stroll. The city is quiet, the air is fresh, and the dogs are all zen. Nothing beats it.",
    tags: [
      { type: "community", id: "park-karlin", label: "Karlín Riverside Walks" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: daysAgoIso(19, "06:15"),
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
    authorAvatarUrl: "/images/generated/adela-profile.jpeg",
    groupId: "park-karlin",
    groupName: "Karlín Riverside Walks",
    photos: ["/images/generated/post-karlin-morning.jpeg", "/images/generated/community-cover-karlin.jpeg"],
    caption: "The riverside in spring is unbeatable. Sunny morning, good dogs, good company. This is what life should be.",
    tags: [
      { type: "community", id: "park-karlin", label: "Karlín Riverside Walks" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: daysAgoIso(22, "07:45"),
    reactions: [
      { userId: "filip", userName: "Filip" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-27a",
        authorId: "filip",
        authorName: "Filip",
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
        text: "Spring hits different out there. See you tomorrow morning!",
        createdAt: daysAgoIso(22, "08:10"),
      },
    ],
  },

  // group-karlin-neighbours (Karlín Dog Neighbors)
  {
    id: "post-28",
    authorId: "filip",
    authorName: "Filip",
    authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/meet-greeting.jpeg"],
    caption: "Anyone around Kukulova/Sladkovského on weekends? Looking for some dog walking buddies in the neighborhood. Toby is friendly but gets lonely when I'm at work.",
    tags: [
      { type: "community", id: "group-karlin-neighbours", label: "Karlín Dog Neighbors" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: daysAgoIso(20, "19:30"),
    reactions: [
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [
      {
        id: "comment-28a",
        authorId: "adela",
        authorName: "Adéla",
        authorAvatarUrl: "/images/generated/adela-profile.jpeg",
        text: "I'm right there! Sunny mornings work best for me. Want to coordinate?",
        createdAt: daysAgoIso(20, "19:50"),
      },
    ],
  },
  {
    id: "post-29",
    authorId: "adela",
    authorName: "Adéla",
    authorAvatarUrl: "/images/generated/adela-profile.jpeg",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    caption: "Setting up a standing Saturday playdate for our neighborhood dogs. 10am at the small park by the river. Bring your pups! All ages/sizes welcome.",
    tags: [
      { type: "community", id: "group-karlin-neighbours", label: "Karlín Dog Neighbors" },
      { type: "place", id: "karlin", label: "Karlín" },
    ],
    createdAt: daysAgoIso(25, "18:00"),
    reactions: [
      { userId: "filip", userName: "Filip" },
    ],
    comments: [
      {
        id: "comment-29a",
        authorId: "filip",
        authorName: "Filip",
        authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
        text: "Perfect! Toby and I will be there for sure.",
        createdAt: daysAgoIso(25, "18:20"),
      },
    ],
  },

  // park-1 (Letná Dog Walks)
  {
    id: "post-30",
    authorId: "marek",
    authorName: "Marek",
    authorAvatarUrl: "/images/generated/marek-profile.jpeg",
    groupId: "park-1",
    groupName: "Letná Dog Walks",
    photos: ["/images/generated/post-sunset-vitkov.jpeg"],
    caption: "The view from Letná never gets old. Oscar loves the hilltop. We come here every Sunday.",
    tags: [
      { type: "dog", id: "oscar", label: "Oscar" },
      { type: "community", id: "park-1", label: "Letná Dog Walks" },
      { type: "place", id: "letna", label: "Letná" },
    ],
    createdAt: daysAgoIso(20, "16:30"),
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
    authorAvatarUrl: "/images/generated/ondrej-profile.jpeg",
    groupId: "park-5",
    groupName: "Vítkov Park Dogs",
    photos: ["/images/generated/rocky-portrait.jpeg"],
    caption: "Hill walk at Vítkov with the crew. Rocky doesn't care about the incline, just the company. 🐾",
    tags: [
      { type: "dog", id: "rocky", label: "Rocky" },
      { type: "community", id: "park-5", label: "Vítkov Park Dogs" },
      { type: "place", id: "vitkov", label: "Vítkov" },
    ],
    createdAt: daysAgoIso(23, "17:00"),
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
    authorAvatarUrl: "/images/generated/adela-profile.jpeg",
    groupId: "group-senior-dogs",
    groupName: "Senior Dogs & Slow Walks",
    photos: ["/images/generated/spot-portrait.jpeg"],
    caption: "Sunny afternoon. No rush. Biscuit and I took our time through the neighborhood. This pace suits us both perfectly.",
    tags: [
      { type: "dog", id: "biscuit", label: "Biscuit" },
      { type: "community", id: "group-senior-dogs", label: "Senior Dogs & Slow Walks" },
    ],
    createdAt: daysAgoIso(21, "14:30"),
    reactions: [
      { userId: "eva", userName: "Eva" },
      { userId: "tomas", userName: "Tomáš" },
    ],
    comments: [
      {
        id: "comment-32a",
        authorId: "eva",
        authorName: "Eva",
        authorAvatarUrl: "/images/generated/eva-profile.jpeg",
        text: "Luna and I are cheering for Biscuit. The slow pace hits different at this stage of life.",
        createdAt: daysAgoIso(21, "14:50"),
      },
    ],
  },

  // Personal posts (no groupId)
  {
    id: "post-33",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    photos: ["/images/generated/post-adoption-anniversary.jpeg"],
    caption: "Franta's half-birthday! Hard to believe it's been 6 months. He's gone from scared rescue to absolute goofball. Worth every moment.",
    tags: [
      { type: "dog", id: "franta", label: "Franta" },
    ],
    createdAt: daysAgoIso(24, "12:00"),
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
        authorAvatarUrl: "/images/generated/martin-profile.jpeg",
        text: "What a transformation! Franta's the happiest guy now.",
        createdAt: daysAgoIso(24, "12:30"),
      },
    ],
  },
  {
    id: "post-34",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    photos: ["/images/generated/training-session.jpeg", "/images/generated/post-puppy-class.jpeg"],
    caption: "One of my students' dogs just passed his CGC exam! Watching this journey from a total handful to a well-mannered pup has been amazing. Proud trainer moment. 💚",
    tags: [
      { type: "place", id: "letna", label: "Letná" },
    ],
    createdAt: daysAgoIso(19, "16:45"),
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
        authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
        text: "That's incredible! Which dog? Bára and I want to know who we're celebrating!",
        createdAt: daysAgoIso(19, "17:15"),
      },
    ],
  },
  {
    id: "post-35",
    authorId: "daniel",
    authorName: "Daniel",
    authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    photos: ["/images/generated/post-first-swim.jpeg"],
    caption: "Bára took her first swim of the season today! Moments like this are why I got her. Pure joy. 🏊",
    tags: [
      { type: "dog", id: "bara", label: "Bára" },
    ],
    createdAt: daysAgoIso(18, "15:20"),
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
        authorAvatarUrl: "/images/generated/klara-profile.jpeg",
        text: "That smile! Bára's living her best life with you.",
        createdAt: daysAgoIso(18, "15:40"),
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════
     Mock World Building C1–C4 — persona post backfill (2026-04-26).
     Lightweight in-character posts so each persona's home feed has visible
     content authored by them + posts visible via Gate-2 (their connections).
     ════════════════════════════════════════════════════════════════════════ */

  // ── DANIEL (3) ──────────────────────────────────────────────────────────────
  {
    id: "post-daniel-reactive-1",
    authorId: "daniel",
    authorName: "Daniel",
    authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: ["/images/generated/post-reactive-walk.jpeg"],
    caption:
      "Bára held it together for an entire 30-minute walk in Smíchov today. Two dogs across the road, one barking at us — she looked, then looked back at me. I almost cried.",
    tags: [
      { type: "dog", id: "bara", label: "Bára" },
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: daysAgoIso(17, "18:20"),
    reactions: [
      { userId: "hana", userName: "Hana" },
      { userId: "anezka", userName: "Anežka" },
      { userId: "klara", userName: "Klára" },
      { userId: "vitek", userName: "Vítek" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [
      {
        id: "comment-daniel-r1-a",
        authorId: "hana",
        authorName: "Hana",
        authorAvatarUrl: "/images/generated/hana-profile.jpeg",
        text: "This is huge. Months of work showing up. So proud of both of you.",
        createdAt: daysAgoIso(17, "19:15"),
      },
      {
        id: "comment-daniel-r1-b",
        authorId: "klara",
        authorName: "Klára",
        authorAvatarUrl: "/images/generated/klara-profile.jpeg",
        text: "The look-back is the magic moment. Keep doing what you're doing.",
        createdAt: daysAgoIso(17, "20:02"),
      },
    ],
  },
  {
    id: "post-daniel-reactive-2",
    authorId: "daniel",
    authorName: "Daniel",
    authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: [],
    caption:
      "Question for the group — Bára's been better with leash reactivity but still freezes when delivery riders come past on bikes. Anyone found something that helps with sudden-fast-movers? Treat-and-retreat works for stationary dogs but not for things that whoosh past us.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: daysAgoIso(24, "21:10"),
    reactions: [
      { userId: "hana", userName: "Hana" },
      { userId: "vitek", userName: "Vítek" },
      { userId: "anezka", userName: "Anežka" },
    ],
    comments: [
      {
        id: "comment-daniel-r2-a",
        authorId: "anezka",
        authorName: "Anežka",
        authorAvatarUrl: "/images/generated/anezka-profile.jpeg",
        text: "Nela was the same. What helped: predict it before she sees it (ears go up first). The instant her ears swivel, treat scatter on the ground. Trains her to look down before she looks up.",
        createdAt: daysAgoIso(24, "21:45"),
      },
      {
        id: "comment-daniel-r2-b",
        authorId: "klara",
        authorName: "Klára",
        authorAvatarUrl: "/images/generated/klara-profile.jpeg",
        text: "What Anežka said. We can drill the scatter cue on Wednesday.",
        createdAt: daysAgoIso(24, "22:08"),
      },
    ],
  },
  {
    id: "post-daniel-klara-session",
    authorId: "daniel",
    authorName: "Daniel",
    authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/bara-portrait.jpeg"],
    caption: "Tired-Bára after another good Wednesday. Eda is the GOAT.",
    tags: [
      { type: "dog", id: "bara", label: "Bára" },
      { type: "person", id: "klara", label: "Klára" },
      { type: "community", id: "group-klara-training", label: "Klára's Calm Dog Sessions" },
    ],
    createdAt: "2026-03-26T13:40:00Z",
    reactions: [
      { userId: "klara", userName: "Klára" },
      { userId: "hana", userName: "Hana" },
      { userId: "filip", userName: "Filip" },
    ],
    comments: [
      {
        id: "comment-daniel-ks-a",
        authorId: "klara",
        authorName: "Klára",
        authorAvatarUrl: "/images/generated/klara-profile.jpeg",
        text: "She earned that nap.",
        createdAt: "2026-03-26T14:00:00Z",
      },
    ],
  },

  // ── TEREZA (3) ──────────────────────────────────────────────────────────────
  {
    id: "post-tereza-evening-walkers",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: ["/images/generated/evening-walk-group.jpeg"],
    caption:
      "Beautiful walk tonight, eight of us out + dogs. Lucie's idea to loop around the back of the park was much better — way fewer crowds. Same time next Thursday, all welcome.",
    tags: [
      { type: "place", id: "riegrovy-sady", label: "Riegrovy sady" },
      { type: "person", id: "lucie", label: "Lucie" },
      { type: "community", id: "group-tereza-neighbourhood", label: "Vinohrady Evening Walkers" },
    ],
    createdAt: daysAgoIso(16, "20:30"),
    reactions: [
      { userId: "marek", userName: "Marek" },
      { userId: "lucie", userName: "Lucie" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "jana", userName: "Jana" },
      { userId: "zuzana", userName: "Zuzana" },
    ],
    comments: [
      {
        id: "comment-tereza-ew-a",
        authorId: "marek",
        authorName: "Marek",
        authorAvatarUrl: "/images/generated/marek-profile.jpeg",
        text: "Benny is still passed out. Good walk.",
        createdAt: daysAgoIso(16, "21:05"),
      },
    ],
  },
  {
    id: "post-tereza-riegrovy",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    groupId: "park-3",
    groupName: "Riegrovy Sady Dog Walks",
    photos: ["/images/generated/post-franta-stick.jpeg"],
    caption: "Franta found the world's largest stick. Tried to bring it home. We are not bringing it home.",
    tags: [
      { type: "dog", id: "franta", label: "Franta" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy sady" },
    ],
    createdAt: daysAgoIso(21, "11:15"),
    reactions: [
      { userId: "marek", userName: "Marek" },
      { userId: "jana", userName: "Jana" },
      { userId: "lucie", userName: "Lucie" },
      { userId: "shawn", userName: "Shawn" },
    ],
    comments: [
      {
        id: "comment-tereza-rs-a",
        authorId: "lucie",
        authorName: "Lucie",
        authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
        text: "That's not a stick, that's a small tree.",
        createdAt: daysAgoIso(21, "12:00"),
      },
    ],
  },
  {
    id: "post-tereza-personal",
    authorId: "tereza",
    authorName: "Tereza",
    authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    photos: ["/images/generated/franta-portrait.jpeg"],
    caption: "Five years with this nose-led potato today. Best decision I ever made.",
    tags: [{ type: "dog", id: "franta", label: "Franta" }],
    createdAt: "2026-03-28T08:00:00Z",
    reactions: [
      { userId: "marek", userName: "Marek" },
      { userId: "lucie", userName: "Lucie" },
      { userId: "jana", userName: "Jana" },
      { userId: "klara", userName: "Klára" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [
      {
        id: "comment-tereza-p-a",
        authorId: "jana",
        authorName: "Jana",
        authorAvatarUrl: "/images/generated/jana-profile.jpeg",
        text: "Happy adoption day Franta! 🎉",
        createdAt: "2026-03-28T08:30:00Z",
      },
    ],
  },

  // ── KLÁRA (2) ───────────────────────────────────────────────────────────────
  {
    id: "post-klara-session-recap",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/post-puppy-class.jpeg"],
    caption:
      "Wednesday group session — five dogs, all under threshold for the full 45 minutes. We're seeing real progress. New 6-week block starts in May, two spots open. DM if interested.",
    tags: [
      { type: "place", id: "stromovka", label: "Stromovka" },
      { type: "community", id: "group-klara-training", label: "Klára's Calm Dog Sessions" },
    ],
    createdAt: daysAgoIso(17, "15:00"),
    reactions: [
      { userId: "daniel", userName: "Daniel" },
      { userId: "hana", userName: "Hana" },
      { userId: "filip", userName: "Filip" },
      { userId: "tereza", userName: "Tereza" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "martin", userName: "Martin" },
    ],
    comments: [
      {
        id: "comment-klara-sr-a",
        authorId: "hana",
        authorName: "Hana",
        authorAvatarUrl: "/images/generated/hana-profile.jpeg",
        text: "Runa won't shut up about it.",
        createdAt: daysAgoIso(17, "16:00"),
      },
    ],
  },
  {
    id: "post-klara-personal",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    photos: ["/images/generated/eda-portrait.jpeg"],
    caption:
      "People assume Eda is calm because he's a Border Collie. Eda is calm because he is six and has been deeply, professionally bored by every dog in Holešovice.",
    tags: [{ type: "dog", id: "eda", label: "Eda" }],
    createdAt: daysAgoIso(22, "19:30"),
    reactions: [
      { userId: "daniel", userName: "Daniel" },
      { userId: "hana", userName: "Hana" },
      { userId: "tereza", userName: "Tereza" },
      { userId: "martin", userName: "Martin" },
      { userId: "shawn", userName: "Shawn" },
      { userId: "filip", userName: "Filip" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [],
  },

  // ── TOMÁŠ (2) ───────────────────────────────────────────────────────────────
  {
    id: "post-tomas-karlin-morning",
    authorId: "tomas",
    authorName: "Tomáš",
    authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    groupId: "park-karlin",
    groupName: "Karlín Walks",
    photos: ["/images/generated/post-karlin-morning.jpeg"],
    caption: "First properly warm morning. Hugo lasted about ten minutes before becoming a puddle.",
    tags: [
      { type: "dog", id: "hugo", label: "Hugo" },
      { type: "place", id: "karlin-riverfront", label: "Karlín riverfront" },
    ],
    createdAt: daysAgoIso(18, "07:45"),
    reactions: [
      { userId: "petra", userName: "Petra" },
      { userId: "ondrej", userName: "Ondřej" },
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [
      {
        id: "comment-tomas-km-a",
        authorId: "petra",
        authorName: "Petra",
        authorAvatarUrl: "/images/generated/petra-profile.jpeg",
        text: "Same energy as Daisy by 9am 😂",
        createdAt: daysAgoIso(18, "08:30"),
      },
    ],
  },
  {
    id: "post-tomas-neighbours",
    authorId: "tomas",
    authorName: "Tomáš",
    authorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/post-sleepy-dogjpeg.jpeg"],
    caption: "Hugo, after one (1) Vítkov hill loop with Petra. Worth every Kč.",
    tags: [
      { type: "dog", id: "hugo", label: "Hugo" },
      { type: "person", id: "petra", label: "Petra" },
    ],
    createdAt: "2026-03-29T14:20:00Z",
    reactions: [
      { userId: "petra", userName: "Petra" },
      { userId: "ondrej", userName: "Ondřej" },
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [],
  },
  // ── C1 backfill (Mock World Building, 2026-04-30) ─────────────────
  // Per-persona group feed depth — adds authors beyond the persona+1
  // pattern so each canonical group reads as a real community.
  // Vinohrady Evening Walkers (Tereza's neighbourhood) +2 posts.
  {
    id: "post-lucie-vinohrady-evening",
    authorId: "lucie",
    authorName: "Lucie",
    authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: ["/images/generated/evening-walk-group.jpeg"],
    caption: "Thursday's loop felt extra calm tonight. Pepík slept the whole way home.",
    tags: [
      { type: "dog", id: "pepik", label: "Pepík" },
      { type: "place", id: "riegrovy-sady", label: "Riegrovy sady" },
    ],
    createdAt: daysAgoIso(4, "21:10"),
    reactions: [
      { userId: "tereza", userName: "Tereza" },
      { userId: "marek", userName: "Marek" },
      { userId: "jana", userName: "Jana" },
    ],
    comments: [
      {
        id: "comment-lucie-vinohrady-1",
        authorId: "tereza",
        authorName: "Tereza",
        authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
        text: "Glad you came! Same time next week?",
        createdAt: daysAgoIso(4, "21:30"),
      },
    ],
  },
  {
    id: "post-marek-vinohrady-evening",
    authorId: "marek",
    authorName: "Marek",
    authorAvatarUrl: "/images/generated/marek-profile.jpeg",
    groupId: "group-tereza-neighbourhood",
    groupName: "Vinohrady Evening Walkers",
    photos: [],
    caption: "Anyone up for a slightly earlier start tomorrow? 6:30pm if the rain stays off. Benny will be insufferable if we skip.",
    tags: [
      { type: "community", id: "group-tereza-neighbourhood", label: "Vinohrady Evening Walkers" },
    ],
    createdAt: daysAgoIso(2, "13:45"),
    reactions: [
      { userId: "tereza", userName: "Tereza" },
      { userId: "lucie", userName: "Lucie" },
    ],
    comments: [
      {
        id: "comment-marek-vinohrady-1",
        authorId: "lucie",
        authorName: "Lucie",
        authorAvatarUrl: "/images/generated/lucie-profile.jpeg",
        text: "Yes please. Pepík will show up rain or shine but I will not.",
        createdAt: daysAgoIso(2, "14:20"),
      },
      {
        id: "comment-marek-vinohrady-2",
        authorId: "tereza",
        authorName: "Tereza",
        authorAvatarUrl: "/images/generated/tereza-profile.jpeg",
        text: "6:30 works — I'll be there.",
        createdAt: daysAgoIso(2, "15:02"),
      },
    ],
  },
  // Karlín Dog Neighbors (Tomáš's neighbourhood) +2 posts.
  {
    id: "post-petra-karlin-admin",
    authorId: "petra",
    authorName: "Petra",
    authorAvatarUrl: "/images/generated/petra-profile.jpeg",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/post-karlin-morning.jpeg"],
    caption: "Reminder: Karlín riverside is closed for resurfacing on Saturday morning. Easy detour through Vítkov instead — meet at the usual spot 9am.",
    tags: [
      { type: "place", id: "vitkov", label: "Vítkov" },
      { type: "community", id: "group-karlin-neighbours", label: "Karlín Dog Neighbors" },
    ],
    createdAt: daysAgoIso(5, "08:00"),
    reactions: [
      { userId: "tomas", userName: "Tomáš" },
      { userId: "ondrej", userName: "Ondřej" },
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [
      {
        id: "comment-petra-karlin-1",
        authorId: "ondrej",
        authorName: "Ondřej",
        authorAvatarUrl: "/images/generated/ondrej-profile.jpeg",
        text: "See you at 9 — Rocky's been waiting all week.",
        createdAt: daysAgoIso(5, "08:35"),
      },
    ],
  },
  {
    id: "post-ondrej-karlin",
    authorId: "ondrej",
    authorName: "Ondřej",
    authorAvatarUrl: "/images/generated/ondrej-profile.jpeg",
    groupId: "group-karlin-neighbours",
    groupName: "Karlín Dog Neighbors",
    photos: ["/images/generated/rocky-portrait.jpeg"],
    caption: "Rocky finally figured out the new harness. Five attempts, three treats, one confused dog.",
    tags: [
      { type: "dog", id: "rocky", label: "Rocky" },
    ],
    createdAt: daysAgoIso(7, "19:15"),
    reactions: [
      { userId: "petra", userName: "Petra" },
      { userId: "tomas", userName: "Tomáš" },
      { userId: "adela", userName: "Adéla" },
    ],
    comments: [],
  },
  // Reactive Dog Support — Eva (admin) posts in her own group.
  {
    id: "post-eva-reactive-tips",
    authorId: "eva",
    authorName: "Eva",
    authorAvatarUrl: "/images/generated/eva-profile.jpeg",
    groupId: "group-reactive-dogs",
    groupName: "Prague Reactive Dog Support",
    photos: [],
    caption: "Quick tip from this week's session — if your dog escalates faster on cold mornings, it's not in your head. The cold air carries scent further and the body's primed to startle. Shorter loops, more breaks, less guilt. We'll work on it together.",
    tags: [
      { type: "community", id: "group-reactive-dogs", label: "Prague Reactive Dog Support" },
    ],
    createdAt: daysAgoIso(3, "10:00"),
    reactions: [
      { userId: "daniel", userName: "Daniel" },
      { userId: "hana", userName: "Hana" },
      { userId: "vitek", userName: "Vítek" },
      { userId: "anezka", userName: "Anežka" },
    ],
    comments: [
      {
        id: "comment-eva-reactive-1",
        authorId: "daniel",
        authorName: "Daniel",
        authorAvatarUrl: "/images/generated/daniel-profile.jpeg",
        text: "This explains so much. Bára's been worse all week and I thought I'd undone weeks of work.",
        createdAt: daysAgoIso(3, "10:45"),
      },
      {
        id: "comment-eva-reactive-2",
        authorId: "hana",
        authorName: "Hana",
        authorAvatarUrl: "/images/generated/hana-profile.jpeg",
        text: "Thank you for naming it. Runa and I are in the same boat.",
        createdAt: daysAgoIso(3, "11:20"),
      },
    ],
  },
  // Klára's Calm Dog Sessions — +1 client voice + 1 more Klára recap.
  {
    id: "post-hana-klara-training",
    authorId: "hana",
    authorName: "Hana",
    authorAvatarUrl: "/images/generated/hana-profile.jpeg",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/runa-portrait.jpeg"],
    caption: "Six sessions in. Runa walked past a barking Husky on Letenská this morning without losing the plot. I cried a little. Thank you Klára.",
    tags: [
      { type: "dog", id: "runa", label: "Runa" },
      { type: "person", id: "klara", label: "Klára" },
    ],
    createdAt: daysAgoIso(6, "12:30"),
    reactions: [
      { userId: "klara", userName: "Klára" },
      { userId: "daniel", userName: "Daniel" },
      { userId: "filip", userName: "Filip" },
      { userId: "eva", userName: "Eva" },
    ],
    comments: [
      {
        id: "comment-hana-klara-1",
        authorId: "klara",
        authorName: "Klára",
        authorAvatarUrl: "/images/generated/klara-profile.jpeg",
        text: "That's huge. Runa's done all the work — you've just been a steady partner. Onwards.",
        createdAt: daysAgoIso(6, "13:00"),
      },
    ],
  },
  {
    id: "post-klara-training-recap",
    authorId: "klara",
    authorName: "Klára",
    authorAvatarUrl: "/images/generated/klara-profile.jpeg",
    groupId: "group-klara-training",
    groupName: "Klára's Calm Dog Sessions",
    photos: ["/images/generated/post-training-recall.jpeg"],
    caption: "This week's group at Stromovka — three dogs, three different recall paces, all of them better than where they started. Eda's job today was to be calm and ignore everything, which he did with theatrical patience.",
    tags: [
      { type: "dog", id: "eda", label: "Eda" },
      { type: "place", id: "stromovka", label: "Stromovka" },
      { type: "community", id: "group-klara-training", label: "Klára's Calm Dog Sessions" },
    ],
    createdAt: daysAgoIso(9, "16:45"),
    reactions: [
      { userId: "filip", userName: "Filip" },
      { userId: "daniel", userName: "Daniel" },
      { userId: "hana", userName: "Hana" },
      { userId: "shawn", userName: "Shawn" },
    ],
    comments: [
      {
        id: "comment-klara-training-1",
        authorId: "filip",
        authorName: "Filip",
        authorAvatarUrl: "/images/generated/filip-profile.jpeg",
        text: "Toby's still bragging.",
        createdAt: daysAgoIso(9, "17:30"),
      },
    ],
  },

  /* ── Útulek Liběň feed — shelter-authored + walker-authored posts ──── */
  // Posts about shelter dogs share the same `Post` shape as everything else.
  // Shelter-authored posts set `authorId` to the shelter's id ("utulek-liben");
  // the shelter feed query (`getShelterFeed`) resolves both shelter-authored
  // posts AND walker-authored posts that tag any shelter dog. See
  // `lib/mockShelters.ts` and [[features/shelters]].

  // Shelter-authored — Theo arrival celebration
  {
    id: "post-shelter-theo-arrival",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/toby-portrait.jpeg"],
    caption:
      "Meet Theo. Five months old, just arrived with two siblings. He's a goofball already. Walkers — he'll be ready for short outings once he's settled.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-theo", label: "Theo" },
    ],
    createdAt: daysAgoIso(3, "09:00"),
    reactions: [
      { userId: "walker-marie-b", userName: "Marie B." },
      { userId: "walker-helena-s", userName: "Helena S." },
      { userId: "supporter-alena-t", userName: "Alena T." },
      { userId: "supporter-stepan-m", userName: "Štěpán M." },
    ],
    comments: [
      {
        id: "comment-shelter-theo-1",
        authorId: "walker-helena-s",
        authorName: "Helena S.",
        authorAvatarUrl: "",
        text: "Looking forward to meeting him!",
        createdAt: daysAgoIso(3, "10:15"),
      },
    ],
  },

  // Shelter-authored — Berta long-stayer call
  {
    id: "post-shelter-berta-needs-home",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/daisy-portrait.jpeg"],
    caption:
      "Berta has been with us for four months. She's wary, she's careful, and she's been completely overlooked. Looking for someone who understands that some dogs need a slow start. No other pets, no kids — just a quiet sofa and a steady person.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-berta", label: "Berta" },
    ],
    createdAt: daysAgoIso(6, "14:30"),
    reactions: [
      { userId: "supporter-andrea-k", userName: "Andrea K." },
      { userId: "supporter-marta-r", userName: "Marta R." },
      { userId: "supporter-vojta-l", userName: "Vojtěch L." },
      { userId: "walker-pavel-d", userName: "Pavel D." },
    ],
    comments: [],
  },

  // Shelter-authored — Šimon spotlight
  {
    id: "post-shelter-simon-spotlight",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/eda-portrait.jpeg"],
    caption:
      "Šimon. Eight years old, deeply gentle, and very tired of waiting. He's not flashy and he doesn't need a job — he just needs a person. Please share if you know someone with a soft spot for older boys.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-simon", label: "Šimon" },
    ],
    createdAt: daysAgoIso(9, "11:00"),
    reactions: [
      { userId: "supporter-iveta-p", userName: "Iveta P." },
      { userId: "supporter-radek-s", userName: "Radek S." },
      { userId: "walker-pavel-d", userName: "Pavel D." },
      { userId: "walker-marie-b", userName: "Marie B." },
    ],
    comments: [
      {
        id: "comment-shelter-simon-1",
        authorId: "supporter-iveta-p",
        authorName: "Iveta P.",
        authorAvatarUrl: "",
        text: "Sharing — he's such a sweet face.",
        createdAt: daysAgoIso(9, "12:45"),
      },
    ],
  },

  // Shelter-authored — Líza's brother adopted
  {
    id: "post-shelter-liza-brother-adopted",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/post-dog-park-sunset.jpeg"],
    caption:
      "Good news: Líza's brother went to his new home this weekend! He's settling in beautifully with a family in Holešovice. Líza is still here looking for her own person — she's bubbly, full of love, and ready when you are.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-liza", label: "Líza" },
    ],
    createdAt: daysAgoIso(12, "16:00"),
    reactions: [
      { userId: "supporter-nela-d", userName: "Nela D." },
      { userId: "supporter-michal-h", userName: "Michal H." },
      { userId: "walker-anna-k", userName: "Anna K." },
    ],
    comments: [],
  },

  // Shelter-authored — Walker recruit
  {
    id: "post-shelter-walker-recruit",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/group-walk-stromovka.jpeg"],
    caption:
      "We're a small team and our dogs need walks every day. If you can spare an hour a week, we'd love to meet you. First-time walkers come in for a 30-minute intro visit — we'll match you with a dog who fits your pace. Czech or English, both fine.",
    tags: [{ type: "shelter", id: "utulek-liben", label: "Útulek Liběň" }],
    createdAt: daysAgoIso(16, "10:00"),
    reactions: [
      { userId: "supporter-eva-z", userName: "Eva Ž." },
      { userId: "supporter-david-c", userName: "David Č." },
      { userId: "supporter-katerina-v", userName: "Kateřina V." },
    ],
    comments: [
      {
        id: "comment-shelter-walker-recruit-1",
        authorId: "supporter-katerina-v",
        authorName: "Kateřina V.",
        authorAvatarUrl: "",
        text: "Coming by Saturday — what's the best time?",
        createdAt: daysAgoIso(16, "13:20"),
      },
    ],
  },

  // Shelter-authored — General shelter day update
  {
    id: "post-shelter-general-day",
    authorId: "utulek-liben",
    authorName: "Útulek Liběň",
    authorAvatarUrl: "/images/generated/community-cover-karlin.jpeg",
    photos: ["/images/generated/dogs-cafe-terrace.jpeg"],
    caption:
      "Slow Sunday at the shelter. Everyone walked, everyone fed, everyone snoring in the afternoon sun. Thank you to today's walkers — Pavel, Marie, Anna. We see you.",
    tags: [{ type: "shelter", id: "utulek-liben", label: "Útulek Liběň" }],
    createdAt: daysAgoIso(20, "18:30"),
    reactions: [
      { userId: "walker-pavel-d", userName: "Pavel D." },
      { userId: "walker-marie-b", userName: "Marie B." },
      { userId: "walker-anna-k", userName: "Anna K." },
      { userId: "supporter-marta-r", userName: "Marta R." },
    ],
    comments: [],
  },

  /* ── Walker-authored posts tagging shelter dogs ──────────────────────── */

  // Walker-authored — Anna K. walks Tonda
  {
    id: "post-walker-anna-tonda",
    authorId: "walker-anna-k",
    authorName: "Anna K.",
    authorAvatarUrl: "",
    photos: ["/images/generated/max-portrait.jpeg"],
    caption:
      "Walked Tonda today — what a goof. Marched up to every dog we passed like he was greeting royalty. Beautiful soft autumn light at Stromovka.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-tonda", label: "Tonda" },
      { type: "place", id: "stromovka", label: "Stromovka" },
    ],
    createdAt: daysAgoIso(5, "11:00"),
    reactions: [
      { userId: "supporter-andrea-k", userName: "Andrea K." },
      { userId: "supporter-iveta-p", userName: "Iveta P." },
      { userId: "walker-marie-b", userName: "Marie B." },
    ],
    comments: [],
  },

  // Walker-authored — Pavel D. walks Šimon
  {
    id: "post-walker-pavel-simon",
    authorId: "walker-pavel-d",
    authorName: "Pavel D.",
    authorAvatarUrl: "",
    photos: ["/images/generated/eda-portrait.jpeg"],
    caption:
      "Šimon and I had our usual loop this morning. He stops at the same bench every time, sits, looks around for about a minute, then we keep going. Old man habits. Wonderful walk.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-simon", label: "Šimon" },
    ],
    createdAt: daysAgoIso(1, "09:45"),
    reactions: [
      { userId: "walker-marie-b", userName: "Marie B." },
      { userId: "walker-helena-s", userName: "Helena S." },
      { userId: "supporter-vojta-l", userName: "Vojtěch L." },
    ],
    comments: [
      {
        id: "comment-walker-pavel-simon-1",
        authorId: "walker-marie-b",
        authorName: "Marie B.",
        authorAvatarUrl: "",
        text: "He does this with me too! Same bench!",
        createdAt: daysAgoIso(1, "11:00"),
      },
    ],
  },

  // Walker-authored — Marie B. walks Maja
  {
    id: "post-walker-marie-maja",
    authorId: "walker-marie-b",
    authorName: "Marie B.",
    authorAvatarUrl: "",
    photos: ["/images/generated/luna-portrait.jpeg"],
    caption:
      "Maja knows her stuff. Solid recall on a long line, sits at every crossing without being asked. Whoever takes her home is getting a really sharp dog.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-maja", label: "Maja" },
    ],
    createdAt: daysAgoIso(3, "16:30"),
    reactions: [
      { userId: "walker-pavel-d", userName: "Pavel D." },
      { userId: "supporter-radek-s", userName: "Radek S." },
    ],
    comments: [],
  },

  // Walker-authored — Helena S. walks Theo
  {
    id: "post-walker-helena-theo",
    authorId: "walker-helena-s",
    authorName: "Helena S.",
    authorAvatarUrl: "",
    photos: ["/images/generated/toby-portrait.jpeg"],
    caption:
      "First walk with Theo today. Five months of pure spaghetti legs. We made it about 200 metres before he had to sit down and think about it. Going to be a star.",
    tags: [
      { type: "shelter", id: "utulek-liben", label: "Útulek Liběň" },
      { type: "dog", id: "shelter-dog-theo", label: "Theo" },
    ],
    createdAt: daysAgoIso(0, "11:30"),
    reactions: [
      { userId: "supporter-alena-t", userName: "Alena T." },
      { userId: "walker-anna-k", userName: "Anna K." },
      { userId: "supporter-stepan-m", userName: "Štěpán M." },
    ],
    comments: [
      {
        id: "comment-walker-helena-theo-1",
        authorId: "supporter-alena-t",
        authorName: "Alena T.",
        authorAvatarUrl: "",
        text: "🥺",
        createdAt: daysAgoIso(0, "12:00"),
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
