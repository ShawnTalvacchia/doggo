import type { Connection, ServiceType } from "./types";
import { getUserById } from "./mockUsers";

export const CONNECTION_STATE_LABELS: Record<string, string> = {
  none: "Not connected",
  familiar: "Familiar",
  pending: "Request sent",
  connected: "Connected",
};

/**
 * Per-viewer connection rosters.
 *
 * Each top-level key is a viewer's user ID; the value is the list of
 * connections from that viewer's perspective. Restructured during Mock
 * World Building (2026-04-26) — was previously a flat `Connection[]` from
 * Shawn's perspective only.
 *
 * Authoring conventions:
 * - One entry per (viewer, otherUser) relationship.
 * - `state` is what the *viewer* sees — "I know X as connected/familiar/pending/none".
 * - `theyMarkedFamiliar` flips meaning per viewer: from Shawn's side it means
 *   "they marked Shawn as Familiar"; from Tereza's side it means "they marked
 *   Tereza as Familiar."
 * - `mutualConnections` is the viewer's other connections that intersect the
 *   target user's network. Shorthand by name (display string).
 * - `meetsShared` counts events where both attended; same number from either
 *   side of a real symmetric relationship.
 *
 * **Symmetry policy** (Mock World Building A7):
 *
 *  - **Connected** is mutual by definition — both rosters MUST show `state:
 *    "connected"`. Per-viewer `meetsShared`, `firstMetDate`, `lastMetDate`,
 *    `metAt` should also match for the shared events.
 *  - **Familiar** can be asymmetric. If A marked B as Familiar, A's view
 *    shows `state: "familiar"` (their own action). B's view of A shows
 *    `theyMarkedFamiliar: true` to signal "this person opened up to you" —
 *    B can choose to mark A back, in which case both views show `familiar`
 *    + `theyMarkedFamiliar: true` (mutual silent familiarity).
 *  - **Pending** appears on both sides as `state: "pending"`. The data model
 *    doesn't currently distinguish "I sent" vs "they sent" at the entry level.
 *    UI can disambiguate from context (e.g. profile origin).
 *  - **None** is the default — typically no entry exists. Visible-but-None
 *    entries are explicit "I've seen this person around but no relationship
 *    yet" markers.
 *  - `mutualConnections` is per-viewer — depends on the viewer's own network,
 *    not symmetric.
 *
 * When seeding a new persona's roster, mirror the existing Shawn-side
 * entries that involve them (so e.g. Tereza's view of Shawn lines up with
 * Shawn's view of Tereza on shared metadata).
 */
export const mockConnectionsByViewer: Record<string, Connection[]> = {
  /* ═══════════════════════════════════════════════════════════════════════
     SHAWN — the original roster (19 entries, last seeded pre-2026-04-26)
     ═══════════════════════════════════════════════════════════════════════ */
  shawn: [
    /* ─── CONNECTED ──────────────────────────────────────────────── */
    {
      id: "conn-shawn-jana",
      userId: "jana",
      userName: "Jana",
      avatarUrl: "/images/generated/jana-profile.jpeg",
      dogNames: ["Rex"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-1",
      updatedAt: "2026-03-16T10:00:00Z",
      meetsShared: 5,
      firstMetDate: "2025-11-10",
      lastMetDate: "2026-03-16",
      mutualConnections: ["Eva", "Tereza"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
      dogBreed: "Labrador Retriever",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-shawn-klara",
      userId: "klara",
      userName: "Klára",
      avatarUrl: "/images/generated/klara-profile.jpeg",
      dogNames: ["Eda"],
      location: "Prague 7",
      state: "connected",
      metAt: "meet-11",
      updatedAt: "2026-03-01T09:00:00Z",
      meetsShared: 3,
      firstMetDate: "2026-02-15",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Jana", "Eva"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Stromovka Off-Leash Club"],
      dogBreed: "Border Collie",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-shawn-marek",
      userId: "marek",
      userName: "Marek",
      avatarUrl: "/images/generated/marek-profile.jpeg",
      dogNames: ["Benny"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-7",
      updatedAt: "2026-02-20T08:30:00Z",
      meetsShared: 4,
      firstMetDate: "2026-01-22",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Tereza", "Jana", "Lucie"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
      dogBreed: "Cocker Spaniel",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-shawn-nikola",
      userId: "nikola",
      userName: "Nikola",
      avatarUrl: "/images/generated/nikola-profile.jpeg",
      dogNames: [],
      location: "Prague 7",
      state: "connected",
      updatedAt: "2026-01-15T10:00:00Z",
      mutualConnections: ["Jana"],
      sharedGroups: [],
      neighbourhood: "Letná",
      profileOpen: true,
    },

    /* ─── FAMILIAR ───────────────────────────────────────────────── */
    // P68 hygiene 2026-05-11: Shawn is Open — outbound Familiar is a
    // no-op (Familiar's purpose is to open a Locked profile; Shawn's is
    // already public). Entries below converted to `state: "none"`,
    // preserving interaction metadata (meetsShared, sharedGroups, etc.).
    // `theyMarkedFamiliar` flags dropped when the other side is also
    // Open (their mark would be no-op too); preserved when the other
    // side is Locked (their mark is meaningful — they're opening up).
    // Per Action matrix v3 in CLAUDE.md.
    {
      id: "conn-shawn-tereza",
      userId: "tereza",
      userName: "Tereza",
      avatarUrl: "/images/generated/tereza-profile.jpeg",
      dogNames: ["Franta"],
      location: "Prague 2",
      state: "none",
      metAt: "meet-7",
      updatedAt: "2026-02-10T18:00:00Z",
      meetsShared: 4,
      firstMetDate: "2026-01-22",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Jana", "Marek"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
      dogBreed: "Beagle",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-shawn-eva",
      userId: "eva",
      userName: "Eva",
      avatarUrl: "/images/generated/eva-profile.jpeg",
      dogNames: ["Luna", "Max"],
      location: "Prague 7",
      state: "none",
      metAt: "meet-9",
      updatedAt: "2026-03-16T10:00:00Z",
      meetsShared: 3,
      firstMetDate: "2026-01-15",
      lastMetDate: "2026-03-16",
      mutualConnections: ["Jana", "Klára"],
      sharedGroups: ["Stromovka Off-Leash Club", "Prague Reactive Dog Support"],
      dogBreed: "Border Collie mix",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-shawn-lucie",
      userId: "lucie",
      userName: "Lucie",
      avatarUrl: "/images/generated/lucie-profile.jpeg",
      dogNames: ["Pepík"],
      location: "Prague 2",
      state: "none",
      metAt: "meet-7",
      updatedAt: "2026-02-05T08:30:00Z",
      meetsShared: 3,
      firstMetDate: "2026-01-22",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Tereza", "Marek"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
      dogBreed: "Dachshund",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-shawn-martin",
      userId: "martin",
      userName: "Martin",
      avatarUrl: "/images/generated/martin-profile.jpeg",
      dogNames: ["Charlie"],
      location: "Prague 7",
      state: "none",
      updatedAt: "2026-03-14T09:00:00Z",
      meetsShared: 1,
      sharedGroups: ["Žižkov Dog Parents"],
      dogBreed: "French Bulldog",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },

    /* ─── PENDING ────────────────────────────────────────────────── */
    {
      id: "conn-shawn-tomas",
      userId: "tomas",
      userName: "Tomáš",
      avatarUrl: "/images/generated/tomas-profile.jpeg",
      dogNames: ["Hugo"],
      location: "Prague 8",
      state: "pending",
      metAt: "meet-1",
      updatedAt: "2026-03-15T14:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-02-20",
      lastMetDate: "2026-03-18",
      sharedGroups: ["Vinohrady Morning Crew"],
      dogBreed: "Labrador Retriever",
      neighbourhood: "Karlín",
      profileOpen: false,
    },
    {
      id: "conn-shawn-zuzana",
      userId: "zuzana",
      userName: "Zuzana",
      avatarUrl: "/images/generated/zuzana-profile.jpeg",
      dogNames: ["Mia"],
      location: "Prague 2",
      state: "pending",
      updatedAt: "2026-03-20T15:00:00Z",
      meetsShared: 0,
      sharedGroups: ["Vinohrady Evening Walkers"],
      dogBreed: "Miniature Poodle",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },

    /* ─── NONE (visible in explore/meet context) ────────────────── */
    {
      id: "conn-shawn-daniel",
      userId: "daniel",
      userName: "Daniel",
      avatarUrl: "/images/generated/daniel-profile.jpeg",
      dogNames: ["Bára"],
      location: "Prague 5",
      state: "none",
      updatedAt: "2026-03-14T09:00:00Z",
      meetsShared: 1,
      sharedGroups: ["Prague Reactive Dog Support", "Klára's Calm Dog Sessions"],
      dogBreed: "Mixed breed rescue",
      neighbourhood: "Smíchov",
      profileOpen: false,
    },
    {
      id: "conn-shawn-filip",
      userId: "filip",
      userName: "Filip",
      avatarUrl: "/images/generated/filip-profile.jpeg",
      dogNames: ["Toby"],
      location: "Prague 7",
      state: "none",
      updatedAt: "2026-03-14T09:00:00Z",
      sharedGroups: ["Klára's Calm Dog Sessions"],
      dogBreed: "Jack Russell Terrier",
      neighbourhood: "Holešovice",
      profileOpen: false,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     TEREZA — Routine Owner / Connector. Built her network at Riegrovy sady;
     created the Vinohrady Evening Walkers group. Open profile, so she
     attracts Familiar marks easily — her own roster reflects an organiser's
     deep, mostly-warm network.
     ═══════════════════════════════════════════════════════════════════════ */
  tereza: [
    /* ─── CONNECTED ──────────────────────────────────────────────── */
    {
      id: "conn-tereza-marek",
      userId: "marek",
      userName: "Marek",
      avatarUrl: "/images/generated/marek-profile.jpeg",
      dogNames: ["Benny"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-7",
      updatedAt: "2026-03-14T08:00:00Z",
      meetsShared: 8,
      firstMetDate: "2025-09-12",
      lastMetDate: "2026-03-14",
      mutualConnections: ["Lucie", "Jana", "Shawn"],
      sharedGroups: ["Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
      dogBreed: "Cocker Spaniel",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-tereza-lucie",
      userId: "lucie",
      userName: "Lucie",
      avatarUrl: "/images/generated/lucie-profile.jpeg",
      dogNames: ["Pepík"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-7",
      updatedAt: "2026-03-12T08:30:00Z",
      meetsShared: 6,
      firstMetDate: "2025-10-18",
      lastMetDate: "2026-03-12",
      mutualConnections: ["Marek", "Jana"],
      sharedGroups: ["Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
      dogBreed: "Dachshund",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-tereza-jana",
      userId: "jana",
      userName: "Jana",
      avatarUrl: "/images/generated/jana-profile.jpeg",
      dogNames: ["Rex"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-1",
      updatedAt: "2026-03-16T10:00:00Z",
      meetsShared: 7,
      firstMetDate: "2025-09-30",
      lastMetDate: "2026-03-16",
      mutualConnections: ["Marek", "Lucie", "Eva", "Shawn"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
      dogBreed: "Labrador Retriever",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    /* ─── INBOUND-ONLY FAMILIAR + INTERACTION-METADATA ENTRIES ──────
     * P68 hygiene 2026-05-11: Tereza is Open — outbound Familiar marks
     * are no-ops. Entries below preserve meet/group interaction
     * metadata but carry `state: "none"`. For other Open users (Klára,
     * Shawn, Eva) the `theyMarkedFamiliar` flag drops too (no-op in
     * both directions). For Locked others (Zuzana) the flag stays
     * because their mark IS meaningful (they're opening up to Tereza).
     */
    {
      id: "conn-tereza-klara",
      userId: "klara",
      userName: "Klára",
      avatarUrl: "/images/generated/klara-profile.jpeg",
      dogNames: ["Eda"],
      location: "Prague 7",
      state: "none",
      updatedAt: "2026-03-08T09:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-01-10",
      lastMetDate: "2026-03-08",
      mutualConnections: ["Jana"],
      sharedGroups: ["Klára's Calm Dog Sessions"],
      dogBreed: "Border Collie",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-tereza-shawn",
      userId: "shawn",
      userName: "Shawn",
      avatarUrl: "/images/generated/shawn-profile.jpg",
      dogNames: ["Spot", "Goldie"],
      location: "Prague 2",
      state: "none",
      metAt: "meet-7",
      updatedAt: "2026-02-10T18:00:00Z",
      meetsShared: 4,
      firstMetDate: "2026-01-22",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Jana", "Marek"],
      sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
      dogBreed: "Dalmatian Mix",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-tereza-eva",
      userId: "eva",
      userName: "Eva",
      avatarUrl: "/images/generated/eva-profile.jpeg",
      dogNames: ["Luna", "Max"],
      location: "Prague 7",
      state: "none",
      updatedAt: "2026-02-22T10:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-01-15",
      lastMetDate: "2026-02-22",
      mutualConnections: ["Jana", "Klára"],
      sharedGroups: ["Stromovka Off-Leash Club"],
      dogBreed: "Border Collie mix",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-tereza-zuzana",
      userId: "zuzana",
      userName: "Zuzana",
      avatarUrl: "/images/generated/zuzana-profile.jpeg",
      dogNames: ["Mia"],
      location: "Prague 2",
      state: "none",
      updatedAt: "2026-03-20T15:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-03-05",
      lastMetDate: "2026-03-18",
      sharedGroups: ["Vinohrady Evening Walkers"],
      theyMarkedFamiliar: true,
      dogBreed: "Miniature Poodle",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },

    /* ─── PENDING ────────────────────────────────────────────────── */
    {
      id: "conn-tereza-jakub",
      userId: "jakub",
      userName: "Jakub",
      avatarUrl: "/images/generated/jakub-profile.jpeg",
      dogNames: ["Aron"],
      location: "Prague 2",
      state: "pending",
      updatedAt: "2026-03-22T07:00:00Z",
      meetsShared: 1,
      sharedGroups: ["Riegrovy Sady Dog Walks"],
      dogBreed: "German Shepherd",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },

    /* ─── INBOUND-ONLY FAMILIAR (state: "none" + theyMarkedFamiliar) ─── */
    // Cross-Cutting Flow Testing D2 (2026-05-11) — deniability path:
    // Filip marked Tereza Familiar; Tereza has not marked back. Her view
    // shows state="none" so no outbound pill renders, but `theyMarkedFamiliar`
    // promotes Filip to tier 2 on Tereza's meet People tab (and elsewhere).
    // The UI never explains WHY Filip's row got promoted — that's the
    // privacy guardrail. See `Trust & Connection Model.md` → deniability.
    {
      id: "conn-tereza-filip",
      userId: "filip",
      userName: "Filip",
      avatarUrl: "/images/generated/filip-profile.jpeg",
      dogNames: ["Toby"],
      location: "Prague 7",
      state: "none",
      updatedAt: "2026-04-22T18:00:00Z",
      meetsShared: 1,
      sharedGroups: ["Klára's Calm Dog Sessions"],
      theyMarkedFamiliar: true,
      dogBreed: "Jack Russell Terrier",
      neighbourhood: "Holešovice",
      profileOpen: false,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     DANIEL — Anxious New Owner. Private profile. Built trust slowly through
     the reactive dog support group; Klára-the-trainer was his payoff (his
     first Connected outside the group). Roster is small + recent — a
     deliberately thin network that demonstrates the cautious-user path.
     ═══════════════════════════════════════════════════════════════════════ */
  daniel: [
    /* ─── CONNECTED ──────────────────────────────────────────────── */
    {
      id: "conn-daniel-klara",
      userId: "klara",
      userName: "Klára",
      avatarUrl: "/images/generated/klara-profile.jpeg",
      dogNames: ["Eda"],
      location: "Prague 7",
      state: "connected",
      metAt: "meet-care-1",
      updatedAt: "2026-03-15T11:00:00Z",
      meetsShared: 4,
      firstMetDate: "2026-02-12",
      lastMetDate: "2026-03-15",
      mutualConnections: ["Hana"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Prague Reactive Dog Support"],
      dogBreed: "Border Collie",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-daniel-hana",
      userId: "hana",
      userName: "Hana",
      avatarUrl: "/images/generated/hana-profile.jpeg",
      dogNames: ["Runa"],
      location: "Prague 3",
      state: "connected",
      metAt: "meet-13",
      updatedAt: "2026-03-10T19:00:00Z",
      meetsShared: 5,
      firstMetDate: "2026-01-25",
      lastMetDate: "2026-03-10",
      mutualConnections: ["Klára", "Anežka"],
      sharedGroups: ["Prague Reactive Dog Support", "Klára's Calm Dog Sessions"],
      dogBreed: "Husky mix",
      neighbourhood: "Žižkov",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },
    {
      id: "conn-daniel-anezka",
      userId: "anezka",
      userName: "Anežka",
      avatarUrl: "/images/generated/anezka-profile.jpeg",
      dogNames: ["Nela"],
      location: "Prague 3",
      state: "connected",
      metAt: "meet-13",
      updatedAt: "2026-03-09T18:00:00Z",
      meetsShared: 3,
      firstMetDate: "2026-02-05",
      lastMetDate: "2026-03-09",
      mutualConnections: ["Hana"],
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "German Shepherd",
      neighbourhood: "Žižkov",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },

    /* ─── FAMILIAR ───────────────────────────────────────────────── */
    {
      id: "conn-daniel-vitek",
      userId: "vitek",
      userName: "Vítek",
      avatarUrl: "/images/generated/vitek-profile.jpeg",
      dogNames: ["Sam"],
      location: "Prague 5",
      state: "familiar",
      updatedAt: "2026-03-05T17:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-02-19",
      lastMetDate: "2026-03-05",
      mutualConnections: ["Hana"],
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "Mixed breed",
      neighbourhood: "Smíchov",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },
    {
      id: "conn-daniel-eva",
      userId: "eva",
      userName: "Eva",
      avatarUrl: "/images/generated/eva-profile.jpeg",
      dogNames: ["Luna", "Max"],
      location: "Prague 7",
      state: "familiar",
      updatedAt: "2026-02-28T10:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-02-19",
      lastMetDate: "2026-02-19",
      mutualConnections: ["Klára", "Hana"],
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "Border Collie mix",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    // Care-side Familiar mark — Daniel cautiously dipping into the carer
    // network. Nikola is a Letná boarder (no dog of her own); Daniel met her
    // at a community walk in Stromovka. Narratively in-character for an
    // anxious new owner: a low-stakes acknowledgement, not a Connection.
    // Also gives `/discover/care` a visible positive case for the soft
    // Familiar avatar ring (E2). Discover & Care 2026-05-04.
    {
      id: "conn-daniel-nikola",
      userId: "nikola",
      userName: "Nikola",
      avatarUrl: "/images/generated/nikola-profile.jpeg",
      dogNames: [],
      location: "Prague 7",
      state: "familiar",
      updatedAt: "2026-04-18T15:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-04-12",
      lastMetDate: "2026-04-12",
      mutualConnections: ["Klára"],
      sharedGroups: [],
      neighbourhood: "Letná",
      profileOpen: true,
    },

    /* ─── PENDING ────────────────────────────────────────────────── */
    // Cross-Cutting Flow Testing D3 (2026-05-11) — Pending pill verification.
    // Daniel sent Lucie a connection request after a recent Reactive Dog Support
    // walk; awaiting Lucie's response.
    {
      id: "conn-daniel-lucie",
      userId: "lucie",
      userName: "Lucie",
      avatarUrl: "/images/generated/lucie-profile.jpeg",
      dogNames: ["Pepík"],
      location: "Prague 2",
      state: "pending",
      updatedAt: "2026-05-04T18:00:00Z",
      meetsShared: 1,
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "Dachshund",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },

    /* ─── INBOUND-ONLY FAMILIAR (state: "none" + theyMarkedFamiliar) ─── */
    // Cross-Cutting Flow Testing D2 (2026-05-11) — deniability path:
    // Marek marked Daniel Familiar after a community walk; Daniel hasn't
    // marked back. theyMarkedFamiliar=true promotes Marek to tier 2 with
    // no outbound pill — the UI never reveals why.
    {
      id: "conn-daniel-marek",
      userId: "marek",
      userName: "Marek",
      avatarUrl: "/images/generated/marek-profile.jpeg",
      dogNames: ["Benny"],
      location: "Prague 2",
      state: "none",
      updatedAt: "2026-04-25T08:00:00Z",
      meetsShared: 1,
      sharedGroups: [],
      theyMarkedFamiliar: true,
      dogBreed: "Cocker Spaniel",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     KLÁRA — Professional Provider. Open profile. Densest network in the cast,
     reflecting her cross-cluster role: training clients (Daniel, Filip, Hana),
     reactive dog group regulars, Stromovka park crew, and a few cross-pollinator
     connections (Tereza, Shawn) from broader community work.
     ═══════════════════════════════════════════════════════════════════════ */
  klara: [
    /* ─── CONNECTED ──────────────────────────────────────────────── */
    {
      id: "conn-klara-daniel",
      userId: "daniel",
      userName: "Daniel",
      avatarUrl: "/images/generated/daniel-profile.jpeg",
      dogNames: ["Bára"],
      location: "Prague 5",
      state: "connected",
      metAt: "meet-care-1",
      updatedAt: "2026-03-15T11:00:00Z",
      meetsShared: 4,
      firstMetDate: "2026-02-12",
      lastMetDate: "2026-03-15",
      mutualConnections: ["Hana"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Prague Reactive Dog Support"],
      dogBreed: "Mixed breed rescue",
      neighbourhood: "Smíchov",
      profileOpen: false,
    },
    {
      id: "conn-klara-filip",
      userId: "filip",
      userName: "Filip",
      avatarUrl: "/images/generated/filip-profile.jpeg",
      dogNames: ["Toby"],
      location: "Prague 7",
      state: "connected",
      metAt: "meet-care-2",
      updatedAt: "2026-03-12T11:00:00Z",
      meetsShared: 5,
      firstMetDate: "2025-12-08",
      lastMetDate: "2026-03-12",
      mutualConnections: ["Martin"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Stromovka Off-Leash Club"],
      dogBreed: "Jack Russell Terrier",
      neighbourhood: "Holešovice",
      profileOpen: false,
    },
    {
      id: "conn-klara-hana",
      userId: "hana",
      userName: "Hana",
      avatarUrl: "/images/generated/hana-profile.jpeg",
      dogNames: ["Runa"],
      location: "Prague 3",
      state: "connected",
      metAt: "meet-care-1",
      updatedAt: "2026-03-08T11:00:00Z",
      meetsShared: 6,
      firstMetDate: "2025-11-20",
      lastMetDate: "2026-03-08",
      mutualConnections: ["Daniel", "Anežka"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Prague Reactive Dog Support"],
      dogBreed: "Husky mix",
      neighbourhood: "Žižkov",
      profileOpen: false,
    },
    {
      id: "conn-klara-eva",
      userId: "eva",
      userName: "Eva",
      avatarUrl: "/images/generated/eva-profile.jpeg",
      dogNames: ["Luna", "Max"],
      location: "Prague 7",
      state: "connected",
      metAt: "meet-9",
      updatedAt: "2026-03-16T10:00:00Z",
      meetsShared: 5,
      firstMetDate: "2025-10-15",
      lastMetDate: "2026-03-16",
      mutualConnections: ["Martin", "Hana"],
      sharedGroups: ["Stromovka Off-Leash Club", "Prague Reactive Dog Support"],
      dogBreed: "Border Collie mix",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-klara-martin",
      userId: "martin",
      userName: "Martin",
      avatarUrl: "/images/generated/martin-profile.jpeg",
      dogNames: ["Charlie"],
      location: "Prague 7",
      state: "connected",
      metAt: "meet-9",
      updatedAt: "2026-03-14T09:00:00Z",
      meetsShared: 4,
      firstMetDate: "2025-12-02",
      lastMetDate: "2026-03-14",
      mutualConnections: ["Eva", "Filip"],
      sharedGroups: ["Stromovka Off-Leash Club"],
      dogBreed: "French Bulldog",
      neighbourhood: "Holešovice",
      profileOpen: true,
    },
    {
      id: "conn-klara-shawn",
      userId: "shawn",
      userName: "Shawn",
      avatarUrl: "/images/generated/shawn-profile.jpg",
      dogNames: ["Spot", "Goldie"],
      location: "Prague 2",
      state: "connected",
      metAt: "meet-11",
      updatedAt: "2026-03-01T09:00:00Z",
      meetsShared: 3,
      firstMetDate: "2026-02-15",
      lastMetDate: "2026-03-01",
      mutualConnections: ["Jana", "Eva"],
      sharedGroups: ["Klára's Calm Dog Sessions", "Stromovka Off-Leash Club"],
      dogBreed: "Dalmatian Mix",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },

    /* ─── INBOUND-ONLY FAMILIAR + INTERACTION-METADATA ENTRIES ──────
     * P68 hygiene 2026-05-11: Klára is Open — outbound Familiar is a
     * no-op (her profile is already public). All entries below
     * converted to `state: "none"`. For other Open users (Tereza,
     * Pavel-D) the `theyMarkedFamiliar` flag drops too. For Locked
     * users (Anežka, Vítek) the flag stays — their mark is meaningful
     * (they're opening up to Klára).
     */
    {
      id: "conn-klara-tereza",
      userId: "tereza",
      userName: "Tereza",
      avatarUrl: "/images/generated/tereza-profile.jpeg",
      dogNames: ["Franta"],
      location: "Prague 2",
      state: "none",
      updatedAt: "2026-03-08T09:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-01-10",
      lastMetDate: "2026-03-08",
      mutualConnections: ["Jana"],
      sharedGroups: ["Klára's Calm Dog Sessions"],
      dogBreed: "Beagle",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },
    {
      id: "conn-klara-anezka",
      userId: "anezka",
      userName: "Anežka",
      avatarUrl: "/images/generated/anezka-profile.jpeg",
      dogNames: ["Nela"],
      location: "Prague 3",
      state: "none",
      updatedAt: "2026-03-05T18:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-02-05",
      lastMetDate: "2026-03-05",
      mutualConnections: ["Hana", "Daniel"],
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "German Shepherd",
      neighbourhood: "Žižkov",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },
    {
      id: "conn-klara-vitek",
      userId: "vitek",
      userName: "Vítek",
      avatarUrl: "/images/generated/vitek-profile.jpeg",
      dogNames: ["Sam"],
      location: "Prague 5",
      state: "none",
      updatedAt: "2026-02-28T17:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-02-19",
      lastMetDate: "2026-02-19",
      mutualConnections: ["Daniel", "Hana"],
      sharedGroups: ["Prague Reactive Dog Support"],
      dogBreed: "Mixed breed",
      neighbourhood: "Smíchov",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },
    // Care-side relationship — Pavel D. is a Karlín family-home boarder Klára
    // has crossed paths with at Stromovka community walks. `userId: "pavel-d"`
    // matches the directory ProviderCard ID directly (no UserProfile bridge —
    // Pavel is directory-only). Gives `/discover/care` a connection signal
    // (mutualConnections etc.) without the outbound Familiar that earlier
    // seeded here as a soft-ring case — that was a P68 hygiene gap: both
    // Klára AND Pavel-D are Open, so the mark was a no-op.
    {
      id: "conn-klara-pavel",
      userId: "pavel-d",
      userName: "Pavel D.",
      avatarUrl: "/images/generated/daniel-profile.jpeg",
      dogNames: [],
      location: "Prague 8",
      state: "none",
      updatedAt: "2026-03-22T12:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-03-08",
      lastMetDate: "2026-03-08",
      mutualConnections: [],
      sharedGroups: [],
      neighbourhood: "Karlín",
    },

    /* ─── PENDING ────────────────────────────────────────────────── */
    {
      id: "conn-klara-jana",
      userId: "jana",
      userName: "Jana",
      avatarUrl: "/images/generated/jana-profile.jpeg",
      dogNames: ["Rex"],
      location: "Prague 2",
      state: "pending",
      updatedAt: "2026-03-19T08:00:00Z",
      meetsShared: 1,
      sharedGroups: [],
      dogBreed: "Labrador Retriever",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },

    /* ─── INBOUND-ONLY FAMILIAR (state: "none" + theyMarkedFamiliar) ─── */
    // Cross-Cutting Flow Testing D2 (2026-05-11) — deniability path:
    // Jakub marked Klára Familiar after attending one of her training sessions.
    // Klára hasn't marked back. theyMarkedFamiliar=true promotes him to tier 2;
    // no outbound pill renders.
    {
      id: "conn-klara-jakub",
      userId: "jakub",
      userName: "Jakub",
      avatarUrl: "/images/generated/jakub-profile.jpeg",
      dogNames: ["Aron"],
      location: "Prague 2",
      state: "none",
      updatedAt: "2026-04-20T11:00:00Z",
      meetsShared: 1,
      sharedGroups: [],
      theyMarkedFamiliar: true,
      dogBreed: "German Shepherd",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     TOMÁŠ — Busy Professional, Karlín. Private profile. Smaller network than
     Tereza or Klára but warm where it matters: Petra is his go-to sitter
     (booking history exists), and a couple of Karlín regulars he sees on
     morning walks. Pending request from Shawn (mirrors Shawn-side data).
     ═══════════════════════════════════════════════════════════════════════ */
  tomas: [
    /* ─── CONNECTED ──────────────────────────────────────────────── */
    {
      id: "conn-tomas-petra",
      userId: "petra",
      userName: "Petra",
      avatarUrl: "/images/generated/petra-profile.jpeg",
      dogNames: ["Daisy"],
      location: "Prague 8",
      state: "connected",
      metAt: "meet-15",
      updatedAt: "2026-03-18T12:00:00Z",
      meetsShared: 6,
      firstMetDate: "2025-11-08",
      lastMetDate: "2026-03-18",
      mutualConnections: ["Ondřej", "Adéla"],
      sharedGroups: ["Karlín Walks", "Karlín Dog Neighbors"],
      dogBreed: "Cavalier King Charles",
      neighbourhood: "Karlín",
      profileOpen: true,
    },
    {
      id: "conn-tomas-ondrej",
      userId: "ondrej",
      userName: "Ondřej",
      avatarUrl: "/images/generated/ondrej-profile.jpeg",
      dogNames: ["Rocky"],
      location: "Prague 8",
      state: "connected",
      metAt: "meet-15",
      updatedAt: "2026-03-15T07:30:00Z",
      meetsShared: 5,
      firstMetDate: "2025-12-14",
      lastMetDate: "2026-03-15",
      mutualConnections: ["Petra", "Adéla"],
      sharedGroups: ["Karlín Walks", "Karlín Dog Neighbors"],
      dogBreed: "Staffie mix",
      neighbourhood: "Karlín",
      profileOpen: true,
    },
    {
      id: "conn-tomas-adela",
      userId: "adela",
      userName: "Adéla",
      avatarUrl: "/images/generated/adela-profile.jpeg",
      dogNames: ["Číča"],
      location: "Prague 8",
      state: "connected",
      metAt: "meet-15",
      updatedAt: "2026-03-12T08:00:00Z",
      meetsShared: 3,
      firstMetDate: "2026-01-18",
      lastMetDate: "2026-03-12",
      mutualConnections: ["Petra", "Ondřej"],
      sharedGroups: ["Vítkov Park Dogs", "Karlín Dog Neighbors"],
      dogBreed: "Shiba Inu",
      neighbourhood: "Karlín",
      profileOpen: false,
      theyMarkedFamiliar: true,
    },

    /* ─── FAMILIAR ───────────────────────────────────────────────── */
    {
      id: "conn-tomas-jakub",
      userId: "jakub",
      userName: "Jakub",
      avatarUrl: "/images/generated/jakub-profile.jpeg",
      dogNames: ["Aron"],
      location: "Prague 2",
      state: "familiar",
      updatedAt: "2026-02-28T08:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-02-20",
      lastMetDate: "2026-02-20",
      sharedGroups: ["Vinohrady Morning Crew"],
      dogBreed: "German Shepherd",
      neighbourhood: "Vinohrady",
      profileOpen: false,
    },
    {
      id: "conn-tomas-marek",
      userId: "marek",
      userName: "Marek",
      avatarUrl: "/images/generated/marek-profile.jpeg",
      dogNames: ["Benny"],
      location: "Prague 2",
      state: "familiar",
      updatedAt: "2026-02-20T08:00:00Z",
      meetsShared: 1,
      firstMetDate: "2026-02-20",
      lastMetDate: "2026-02-20",
      sharedGroups: ["Vinohrady Morning Crew"],
      dogBreed: "Cocker Spaniel",
      neighbourhood: "Vinohrady",
      profileOpen: true,
      theyMarkedFamiliar: true,
    },

    /* ─── PENDING ────────────────────────────────────────────────── */
    {
      id: "conn-tomas-shawn",
      userId: "shawn",
      userName: "Shawn",
      avatarUrl: "/images/generated/shawn-profile.jpg",
      dogNames: ["Spot", "Goldie"],
      location: "Prague 2",
      state: "pending",
      metAt: "meet-1",
      updatedAt: "2026-03-15T14:00:00Z",
      meetsShared: 2,
      firstMetDate: "2026-02-20",
      lastMetDate: "2026-03-18",
      sharedGroups: ["Vinohrady Morning Crew"],
      dogBreed: "Dalmatian Mix",
      neighbourhood: "Vinohrady",
      profileOpen: true,
    },

    /* ─── INBOUND-ONLY FAMILIAR (state: "none" + theyMarkedFamiliar) ─── */
    // Cross-Cutting Flow Testing D2 (2026-05-11) — deniability path:
    // Vítek marked Tomáš Familiar after a Karlín hangout; Tomáš hasn't
    // marked back. theyMarkedFamiliar=true → tier 2, no outbound pill.
    {
      id: "conn-tomas-vitek",
      userId: "vitek",
      userName: "Vítek",
      avatarUrl: "/images/generated/vitek-profile.jpeg",
      dogNames: ["Sam"],
      location: "Prague 5",
      state: "none",
      updatedAt: "2026-04-28T09:00:00Z",
      meetsShared: 1,
      sharedGroups: [],
      theyMarkedFamiliar: true,
      dogBreed: "Mixed breed",
      neighbourhood: "Smíchov",
      profileOpen: false,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     NEW USER — empty by design. Every "Connect" / "Familiar" surface should
     render its empty state gracefully when this is the active viewer.
     ═══════════════════════════════════════════════════════════════════════ */
  "new-user": [],
};

/** Community carers — providers offering care. Directory, not viewer-relative. */
export interface CommunityCarer {
  userId: string;
  services: ServiceType[];
  priceFrom: number;
  priceUnit: "per_visit" | "per_night";
  meetsShared: number;
}

export const communityCarers: CommunityCarer[] = [
  {
    userId: "jana",
    services: ["walks_checkins"],
    priceFrom: 240,
    priceUnit: "per_visit",
    meetsShared: 8,
  },
  {
    userId: "klara",
    services: ["walks_checkins"],
    priceFrom: 300,
    priceUnit: "per_visit",
    meetsShared: 3,
  },
  {
    userId: "tereza",
    services: ["walks_checkins", "house_sitting", "day_care"],
    priceFrom: 150,
    priceUnit: "per_visit",
    meetsShared: 4,
  },
  {
    userId: "nikola",
    services: ["boarding"],
    priceFrom: 480,
    priceUnit: "per_night",
    meetsShared: 0,
  },
  {
    userId: "petra",
    services: ["day_care", "boarding"],
    priceFrom: 120,
    priceUnit: "per_visit",
    meetsShared: 0,
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */

/** All connections from a viewer's perspective. Empty array if none seeded. */
export function getConnectionsForViewer(viewerId: string): Connection[] {
  return mockConnectionsByViewer[viewerId] ?? [];
}

/**
 * Get connection state for a specific user, from a viewer's perspective.
 *
 * `viewerId` defaults to Shawn so pre-Persona-Wiring callsites that haven't
 * been migrated still work. New code should always pass the active persona
 * explicitly (`useCurrentUserId()`).
 *
 * Returns `undefined` when no relationship is recorded — downstream code
 * should treat that as `state: "none"`.
 */
export function getConnectionState(
  userId: string,
  viewerId: string = "shawn",
): Connection | undefined {
  // Direct lookup — viewer has an outbound record for the target.
  const direct = getConnectionsForViewer(viewerId).find((c) => c.userId === userId);
  if (direct) return direct;

  // Symmetric fallback — the seeded `mockConnectionsByViewer` only stores
  // each pair from one perspective (typically the demo personas: Shawn,
  // Tereza, Daniel, Klára, Tomáš). When a non-picker carer (Petra, Shawn,
  // Nikola, etc.) views one of those personas, the direct lookup returns
  // nothing — even when there's an obvious mutual relationship (a seeded
  // booking, a Connected entry from the other side). Without this
  // fallback, Petra viewing Tomáš sees him as a stranger, so his profile
  // shows as Locked even though they have a long-running booking history.
  //
  // Connected is mutual by definition, so we propagate it both ways.
  // Familiar is one-sided — if (viewer, target) is Familiar from the
  // INVERSE record, that means the inverse-viewer marked us; from our
  // perspective that's `theyMarkedFamiliar = true` (unlocks their profile
  // to us per the trust model) but our outbound state stays "none."
  // Pending is symmetric awareness on both sides.
  // Pricing & Proposals walkthrough 2026-05-05.
  const inverse = getConnectionsForViewer(userId).find((c) => c.userId === viewerId);
  if (!inverse) return undefined;

  // Re-key the inverse record so `userId` (target) and `userName` etc
  // refer to the *target* of this lookup, not the inverse-viewer.
  const targetUser = getUserById(userId);
  const synthesized: Connection = {
    id: `inv-${viewerId}-${userId}`,
    userId,
    userName: targetUser?.firstName ?? inverse.userName.split(" ")[0],
    avatarUrl: targetUser?.avatarUrl ?? "",
    dogNames: targetUser?.pets.map((p) => p.name) ?? [],
    location: targetUser?.location ?? "",
    state:
      inverse.state === "connected"
        ? "connected"
        : inverse.state === "pending"
          ? "pending"
          : "none",
    updatedAt: inverse.updatedAt,
    profileOpen: targetUser?.profileVisibility === "open",
    neighbourhood: targetUser?.neighbourhood,
    // `theyMarkedFamiliar` reflects whether the target marked the viewer
    // Familiar. If the inverse record's outbound state IS familiar, that's
    // the target marking us → set this true. (Inbound Familiar from a
    // Connected/Pending record is irrelevant; those carry their own state.)
    theyMarkedFamiliar:
      inverse.state === "familiar" ? true : inverse.theyMarkedFamiliar,
    // Bidirectional signals — same value from either perspective.
    meetsShared: inverse.meetsShared,
    sharedGroups: inverse.sharedGroups,
    mutualConnections: inverse.mutualConnections,
    dogBreed: targetUser?.pets[0]?.breed ?? inverse.dogBreed,
  };
  return synthesized;
}

/** Get all of a viewer's connections in a given state. */
export function getConnectionsByState(
  state: string,
  viewerId: string = "shawn",
): Connection[] {
  return getConnectionsForViewer(viewerId).filter((c) => c.state === state);
}

/**
 * Mutual Connected users between a viewer and a subject.
 *
 * Returns the user IDs of people who are Connected to BOTH the viewer
 * and the subject. Used to surface a "Mutual connections" section on
 * other-user profiles.
 *
 * **Privacy:** Connected-only. Familiar marks are deliberately
 * excluded — surfacing them would break the deniability principle
 * (viewers must never infer who marked whom Familiar). Connected is
 * mutual + acknowledged, safe to expose. Pending is one-sided and
 * also excluded.
 *
 * Self-mutuals are filtered (a viewer is not their own mutual).
 */
export function getMutualConnectedUserIds(
  viewerId: string,
  subjectId: string,
): string[] {
  if (viewerId === subjectId) return [];
  const viewerConnected = getConnectionsByState("connected", viewerId)
    .map((c) => c.userId)
    .filter((id) => id !== subjectId);
  const subjectConnected = new Set(
    getConnectionsByState("connected", subjectId)
      .map((c) => c.userId)
      .filter((id) => id !== viewerId),
  );
  return viewerConnected.filter((id) => subjectConnected.has(id));
}

/**
 * Get the connections of a viewer who also offer care services. Used by
 * "people you know who can help" surfaces — the Inbox People section, the
 * Discover Care "from your network" tile, etc.
 *
 * Returns empty when the viewer has no connections (e.g. New User, or any
 * persona whose roster hasn't been seeded yet).
 */
export function getCommunityCarers(
  viewerId: string = "shawn",
): (Connection & CommunityCarer)[] {
  return communityCarers
    .map((cc) => {
      const conn = getConnectionState(cc.userId, viewerId);
      if (!conn) return null;
      return { ...conn, ...cc };
    })
    .filter(Boolean) as (Connection & CommunityCarer)[];
}
