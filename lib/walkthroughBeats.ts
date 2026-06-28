/**
 * walkthroughBeats.ts — the Guided Walkthrough's spine (Demo Narrative V2).
 *
 * Single source of truth for the demo's guided stories. Mirrors
 * `docs/strategy/Demo Narrative.md` — keep the two in sync. Consumed by:
 *   - `contexts/WalkthroughContext.tsx` — the beat + step sequencer
 *   - `components/walkthrough/WalkthroughInterstitial.tsx` — the persona
 *     handoff, the mid-beat interstitials, and the closing screen
 *   - `components/walkthrough/WalkthroughCard.tsx` — the on-surface step card
 *   - `app/page.tsx` — the launcher doors (one per WALKTHROUGH_LIST entry)
 *
 * REGISTRY (Multi-Path Demo, 2026-06-22): walkthroughs are named entries in
 * `WALKTHROUGH_LIST`, each `{ id, displayName, thesis, interviewee, closing,
 * beats }`; the sequencer runs one by id. Phase 1 ships `new-owner` (the
 * shipped V2 Daniel→Klára→Daniel spine, transitional home); `trainer` and
 * `shelter` join as Workstreams D/E land.
 *
 * Two-level structure:
 *   - A **beat** is one persona's segment. It opens with a full-screen
 *     persona-handoff interstitial (scene only — `context`) and lands on
 *     `startUrl`.
 *   - Within a beat, an ordered list of **steps**. Each step is one of:
 *       · `kind: "card"`         — shown on the on-surface card. A nav step
 *                                  (carries `advanceOn`), an action step, or
 *                                  a fire-off step (`fireOff` set).
 *       · `kind: "interstitial"` — a mid-beat full-screen interstitial
 *                                  (time-passage or explainer). The card
 *                                  hides; the interstitial screen shows.
 *
 * FORWARD REFERENCES — Workstream W4: Beat 1/2 nav steps point at two mock
 * records W4 still has to seed — the free walk meet `meet-klara-stromovka`
 * and the drop-off booking `booking-klara-toby`. W4 must create them with
 * exactly these ids; until then the walkthrough's nav to those routes 404s.
 */

export type WalkthroughStep =
  | {
      /** A step shown on the on-surface WalkthroughCard. */
      kind: "card";
      /** What the tester does — short, imperative. `**bold**` marks UI labels. */
      instruction: string;
      /** Optional supporting context — the "why", or what to notice. */
      detail?: string;
      /**
       * Navigation steps: the pathname the step sends the tester to. On
       * arrival the card auto-advances, so a "go here" step never sits
       * stale. Omit for action / fire-off steps (they advance on Next).
       */
      advanceOn?: string;
      /**
       * When set, the card renders NO "Next" button — the step advances
       * only when the tester performs the in-app action and the resulting
       * navigation reaches `advanceOn`. Use for an action with a side
       * effect that a plain Next would skip: e.g. "Start the session"
       * both routes to the active page AND flips the session in-progress;
       * routing straight there via Next leaves the walkthrough out of sync
       * with app state. Requires `advanceOn`.
       */
      awaitAction?: boolean;
      /**
       * Named-action advance: the step renders NO "Next" button and advances
       * when product code fires `signalAction(key)` with this exact key. For an
       * action that opens a MODAL (no navigation), so the URL-based `advanceOn`
       * can't fire — e.g. picking a mentor opens the booking sheet. The signal
       * is a no-op outside the walkthrough / off this step, so the product call
       * is safe to make unconditionally. Like `awaitAction`, a Continue button
       * still surfaces if the tester backs into the step (already performed it).
       */
      advanceOnAction?: string;
      /**
       * Fire-off steps surface pre-written content for a one-tap commit.
       * When set, the card renders the image + caption as a post preview and
       * the primary action reads "Share". The matching post is seeded in
       * `mockPosts.ts` but HIDDEN from the group feed until the tester taps
       * Share (the card calls `sharePost(postId)`, which reveals it) — so the
       * post the card is about to share isn't already sitting in the feed.
       * `postId` links the card to that seeded post. 2026-05-22 (was a pure
       * narrated commit before; the post used to be pre-visible).
       */
      fireOff?: { imageUrl: string; caption: string; postId: string };
      /**
       * Notification ids to fire when this card step becomes active. Same
       * deferred-notification mechanism as the interstitial variant below, but
       * for card steps — used after the "a couple of days later" interstitial
       * was removed (2026-05-22): Magda's reach-out now fires as the "Open
       * Notifications" step activates. Payloads live in `deferredNotifications`
       * (`lib/mockNotifications.ts`); fired in `WalkthroughCard`. Idempotent.
       */
      fireNotifications?: string[];
    }
  | {
      /** A mid-beat full-screen interstitial — the card hides while it shows. */
      kind: "interstitial";
      /**
       * `time-passage` (move the clock) · `explainer` (unpack a concept) ·
       * `probe` (an assumption checkpoint — pose the interview question to the
       * viewer/room; rendered with a left accent bar so it reads as "ask this").
       * The probe mode is the "guided demo IS the interview" mechanism (FC17).
       */
      mode: "time-passage" | "explainer" | "probe";
      /** Small muted label — a time cue, "How this works", or "For the room". */
      eyebrow: string;
      heading: string;
      body: string;
      /**
       * Walkthrough A2 pre-staging: when set, tapping Continue on this
       * (time-passage) interstitial fast-forwards the walker to mentor-vouched
       * at the named shelter (via `vouchViaMentor`). Lets the `shelter` arc
       * narrate "a few good walks later, you're vouched" without the tester
       * grinding the per-session demo toggle. Idempotent. Fired in
       * `WalkthroughInterstitial`.
       */
      fireWalkerVouch?: {
        userId: string;
        shelterId: string;
        mentor: { id: string; name: string };
      };
      /**
       * Notification ids to fire (via `addNotification`) when the tester taps
       * Continue on this interstitial. Used by time-passage steps to defer
       * narrative notifications until the story's time has actually passed —
       * e.g. Magda's connection request + group invite must not appear in
       * Daniel's bell until Beat 3's "a couple of days later", or they're
       * visible (and impossible) at the beat's opening notifications screen.
       * Payloads live in `deferredNotifications` (`lib/mockNotifications.ts`),
       * deliberately kept OUT of the always-on stream. Firing is idempotent
       * (upsert by id). Fired in `WalkthroughInterstitial`.
       */
      fireNotifications?: string[];
    };

export type WalkthroughBeat = {
  /** 1-based beat number, for display ("Beat 1 of 3"). */
  n: number;
  /** Short orienting beat title (chip-sized) shown on the on-surface step card,
   *  so the tester can see which beat they're in once past the interstitial. */
  title: string;
  /** Persona to switch to when this beat begins. Must exist in `lib/personas.ts`. */
  personaId: string;
  /** Time-of-day eyebrow. */
  when: string;
  /** Situational context — the persona-handoff interstitial. Scene-setting only. */
  context: string;
  /** Short one-liner describing the beat (one-per-beat synopsis). */
  summary: string;
  /** The surface the beat opens on (after the handoff interstitial's Continue). */
  startUrl: string;
  /** Ordered steps — card steps and mid-beat interstitials, interleaved. */
  steps: WalkthroughStep[];
};

/** Phase-1 walkthrough ids (the three community Worlds). Reconciled from
 *  FC17's four feature-paths: `neighbour-care` absorbs into `new-owner`; the
 *  two shelter flows combine into `shelter`. The shelter *operator* view is
 *  Phase 2, not a walkthrough id here. */
export type WalkthroughId = "new-owner" | "trainer" | "shelter";

export type Walkthrough = {
  /** Stable id — persisted in run state, used by the launcher doors. */
  id: WalkthroughId;
  /** Launcher door label. */
  displayName: string;
  /** Short owner-facing line shown on the launcher door (one sentence). */
  blurb: string;
  /** One-line thesis — what this path proves (interview framing, internal). */
  thesis: string;
  /** Who to show it to. The guided demo IS the interview (FC17). */
  interviewee: string;
  /** Closing-screen copy, shown after the final beat. */
  closing: { heading: string; body: string };
  /** Ordered beats. */
  beats: WalkthroughBeat[];
};

// ── new-owner ("Find your community") ────────────────────────────────────────
// Phase-1 transitional home for the shipped V2 Daniel→Klára→Daniel spine. Its
// Daniel beats + the neighbour-care absorption (Beat 3) are exactly W1's
// starting point; Workstreams C1/D1 split Beat 2's Klára POV into the standalone
// `trainer` walkthrough and refine what stays here.
const NEW_OWNER_BEATS: WalkthroughBeat[] = [
  // ── Beat 1 — Daniel: time to get Bára out ────────────────────────────────
  {
    n: 1,
    title: "Finding a walk",
    personaId: "daniel",
    when: "Earlier this week",
    context:
      "Daniel is still finding his feet in Prague. He adopted Bára a few months ago, a rescue who came to him nervous, quick to startle and slow to settle in. Since then it's mostly been the two of them and the apartment. He'd like her to have more than that: a walk she looks forward to, a few familiar dogs, somewhere she feels okay.",
    summary: "A newcomer finds a walk for his anxious dog.",
    startUrl: "/discover",
    steps: [
      {
        kind: "card",
        instruction:
          "In **Discover**, tap **Meets** to see what's happening nearby.",
        detail: "Daniel wants a walk where Bára can meet other dogs at her own pace.",
        advanceOn: "/discover/meets",
      },
      {
        kind: "card",
        instruction:
          "Open Klára's free **Stromovka morning walk**. It's near the top, under **Meets from your circle**.",
        detail: "It shows up there because Daniel already joined Klára's group.",
        advanceOn: "/meets/meet-klara-stromovka",
      },
      {
        kind: "card",
        instruction:
          "It's free, open to everyone, and Klára's note welcomes nervous dogs. Tap **Join** on the next session, then **Next**.",
        detail: "The first outing Daniel was hoping to find for Bára.",
      },
    ],
  },
  // ── Beat 2 — Daniel: review, convert, belong ─────────────────────────────
  // Same persona as Beat 1 (the walk happened in between). The interstitial
  // renders this as a time-passage continuation (no "You're now Daniel"
  // re-intro) because prevBeat.personaId === this beat's personaId.
  {
    n: 2,
    title: "After the walk",
    personaId: "daniel",
    when: "Later that day",
    context:
      "The walk's done. Bára started out nervous and settled in by the end, a real first step. Doggo just nudged Daniel to look back on the morning — and he keeps thinking about the people he met along the way.",
    summary: "From one walk: a trainer, a neighbour, a community.",
    startUrl: "/notifications",
    steps: [
      {
        kind: "card",
        instruction:
          "Tap the **Stromovka walk** notification to revisit the morning.",
        detail:
          "After a meet, Doggo nudges you to look back at who came.",
        // The notification's href carries `?tab=people`, so tapping it lands
        // Daniel straight on the walk's People tab. advanceOn is the bare
        // pathname (query ignored) so the card auto-advances on arrival —
        // no separate "open the People tab" step needed.
        advanceOn: "/meets/meet-klara-stromovka",
      },
      {
        kind: "card",
        instruction:
          "Daniel got talking to **Magda** on the walk, a neighbour from his own street. Find her on the **People** tab and mark her **Familiar**, then tap **Next**.",
        detail:
          "Everyone who came this morning is here, grouped by who Daniel already knows.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "What “Familiar” means",
        body:
          "Daniel's profile is private. Other people can't see his content or send him a message. Marking Magda Familiar opens his profile to her. It isn't a friend request: Magda is never notified, and it commits Daniel to nothing. It's the first step from stranger to familiar face.",
      },
      {
        kind: "card",
        instruction:
          "Daniel keeps thinking about how Klára handled the nervous dogs. Tap **Next** to open her **Services**.",
        detail: "A group walk is a great start, but Bára needs focused, one-on-one help.",
        advanceOn: "/profile/klara?tab=services",
      },
      {
        kind: "card",
        instruction:
          "Tap **Book a session** on the **1-on-1 training session**. Pick a date for Bára, check the **800 Kč** price, and send the request.",
        detail:
          "Choose the details, see the price up front, send. Klára replies with a proposal right away.",
        // Completes when the sheet's "Review the proposal" routes Daniel to
        // the chat thread where Klára's auto-proposal is waiting.
        advanceOn: "/profile/klara?tab=chat",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Klára sent a **proposal** straight back. Tap **Review & sign**, confirm the booking, then tap **Next**.",
        detail:
          "The free walk is what led Daniel here. Now he's investing in something bigger: the confident dog Bára could become.",
      },
      {
        kind: "card",
        instruction:
          "The next day, Magda's been in touch. Open Daniel's **Notifications**.",
        // Her connection request fires as this step becomes active (replacing
        // the removed "a couple of days later" interstitial), so it's waiting
        // when Daniel opens the bell — but not before he marked her Familiar
        // earlier in the beat. The group invite is deferred to the invite step
        // below (after he accepts), so it reads as sent once they're connected.
        // Fired in WalkthroughCard; idempotent.
        fireNotifications: ["notif-magda-connect-daniel"],
        advanceOn: "/notifications",
      },
      {
        kind: "card",
        instruction:
          "Magda has sent a **connection request**. **Accept** it, then tap **Next**.",
        detail:
          "Accepting connects them for real: now they can message each other and arrange care.",
      },
      {
        kind: "card",
        instruction:
          "Now that they're connected, Magda invites Daniel to her private group, **Holešovice Dog Block**. Open the invite.",
        detail: "Daniel's local circle is starting to take shape.",
        // The group invite fires HERE (not with the connection request), so it
        // arrives only after Daniel accepted — Magda invites a connection into
        // her private group, not a stranger. It pops into the notifications
        // list live as this step lands. Fired in WalkthroughCard; idempotent.
        fireNotifications: ["notif-ginvite-group-holesovice-block-daniel"],
        // Tapping the invite (or the card's Next) routes to the group, so the
        // tester lands there before the private-groups interstitial — no
        // separate "open the group" step needed afterwards.
        advanceOn: "/communities/group-holesovice-block",
      },
      {
        kind: "card",
        instruction:
          "Have a look around the feed, then tap **Join community** to become a member. Then tap **Next**.",
        detail: "A tight crew of Holešovice neighbours, and Daniel's one of them now.",
      },
      {
        kind: "card",
        instruction:
          "Open the **Members** tab and switch on **Show members' services**. See that **Veronika** offers walks to the circle, right on her card. Then tap **Next**.",
        detail:
          "Care from a neighbour, there whenever Daniel needs it. Booking her works just like Klára's, so no need to repeat it.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "Private groups, and mutual care",
        body:
          "A private group is a closed circle of neighbours, invite-only, not a marketplace of strangers. Inside it, anyone can offer care to the circle, you don't have to be a trainer or a business. A neighbour like Veronika just walks dogs, at a clear price that keeps it fair and easy.",
      },
    ],
  },
];

// ── trainer ("Meet your trainer") ────────────────────────────────────────────
// W2 — the walker-trainer's own POV: the walk IS the business. Split out of the
// V2 spine's Klára beat (D1, 2026-06-22). Single beat for now — the morning's
// work (run the linked-care session, seal the report) plus the walk post as
// lead-gen. The meet→booking *conversion* from Klára's side is the next
// enrichment (needs a pre-staged incoming inquiry — A2); the closing carries it
// as the payoff line until then. See the phase walkthrough O-items.
const TRAINER_BEATS: WalkthroughBeat[] = [
  {
    n: 1,
    title: "The morning walk",
    personaId: "klara",
    when: "Morning",
    context:
      "Klára is a walker-trainer in Holešovice. Every week she hosts a free walk at Stromovka. It's how the neighbourhood's dogs get out, and it's how she meets her training clients. To her, the walk isn't a sideline. It's the business: demonstration, lead generation, and content, all at once. First, though, she's got a dog to pick up.",
    summary: "The walk is the work, and the work is the funnel.",
    startUrl: "/schedule",
    steps: [
      {
        kind: "card",
        instruction:
          "This is Klára's **My Schedule**. It holds the Stromovka walk she hosts and a paid walk for Toby, whom she picks up on the way. Tap **Start session** on Toby's booking.",
        detail:
          "The walk is free for everyone. Klára earns through the dogs she's booked to bring, like Toby.",
        advanceOn: "/bookings/booking-klara-toby/active",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Toby's session is live. An **active session** banner now rides along on every screen, so Klára can jump back anytime. Tap **Next**.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "A free walk, a growing business",
        body:
          "The walk is free and open to everyone, part exercise, part crew, part coaching. It's also Klára's shopfront: owners see how she works, the nervous dogs settle, and trust builds in the open. That trust is what turns a walk into a booked training client.",
      },
      {
        kind: "interstitial",
        mode: "probe",
        eyebrow: "For the room",
        heading: "Would you run a walk like this?",
        body:
          "For a walker or trainer watching: would you host a free public walk as your shopfront, knowing it's where clients come from? And would you take on newer walkers as paid mentees, the way Klára does? At what price would that be worth your time?",
      },
      {
        kind: "card",
        instruction:
          "The walk's done. Back on the active session, tap **Finish session** and seal the **visit report**. Photos and notes are optional.",
        detail:
          "Filip booked a walk for Toby; the report is how he knows it happened.",
        advanceOn: "/bookings/booking-klara-toby",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Head to the **Groups** tab on the Community page. Select **Klára's Calm Dog Sessions**.",
        detail:
          "After a walk wraps, this is where she shares the moment with the crew.",
        advanceOn: "/communities/group-klara-training",
      },
      {
        kind: "card",
        fireOff: {
          imageUrl: "/images/generated/post-stromovka-walk.jpeg",
          caption:
            "Some new faces on the morning walk. Look at these good boys. 🐾",
          postId: "post-klara-stromovka-walk",
        },
        instruction:
          "Klára's walk post is ready for the group. Tap **Share** to post it.",
      },
      {
        kind: "card",
        instruction:
          "Klára's post is live in the group feed. Take a look, then tap **Next**.",
        detail:
          "The crew sees it first, but the next owner with a nervous dog, scrolling Holešovice's groups, finds it too. That's how a walk becomes a client.",
      },
    ],
  },
];

// ── shelter ("Help a shelter dog") ───────────────────────────────────────────
// W3 — the shelter arc. Phase 2 "The Shelter's Side" (2026-06-24) revised the
// back half: where the Phase-1 cut NARRATED the shelter's side ("described, not
// shown"), it now SWITCHES POV to the shelter operator and DEMONSTRATES the real
// operator surfaces this phase built. Beats 1–2 are the walker (Eliška, focal
// dog Nora) getting in safely (discovery → mentored first walk → vouched).
// Beats 3–4 switch to the shelter-operator persona: the handover board +
// application queue + walker-pool control (Beat 3), then the adoption-interest
// landing + the public wall (Beat 4). Desirability-first and question-light: no
// per-beat probes (the full A1–A10 feasibility set lives in the interview kit,
// driven in conversation). The soft close lives in the registry `closing`
// screen and addresses the shelter with three light open questions. Full kit:
// `strategy/Shelter Feasibility Interview Kit.md`; beat source +
// `strategy/mentor-network-shelter-demo.md` (the live-interview script).
const SHELTER_BEATS: WalkthroughBeat[] = [
  // ── Beat 1 — Discovery: how a walker finds your dogs ──────────────────────────────────
  {
    n: 1,
    title: "Finding a dog",
    personaId: "eliska",
    when: "A quiet Saturday",
    context:
      "You're new to the city, considering adopting a dog one day, and curious about volunteering in the meantime. You signed up to Doggo to explore the shelters nearby.",
    summary: "How a would-be walker discovers a shelter's dogs.",
    startUrl: "/discover",
    steps: [
      {
        kind: "card",
        instruction:
          "This is **Discover**, where you find what's near you on Doggo. Tap **Help a Dog**.",
        detail:
          "Parks and groups, local care, and shelter dogs who need walks. It's how a shelter's dogs get found in the first place.",
        advanceOn: "/discover/help-a-dog",
      },
      {
        kind: "card",
        instruction:
          "Nearby shelters and the dogs who need a walk. Open **Nora**, a long-stayer at Útulek.",
        detail:
          "No adoption obligation, just a walk. For an overlooked dog, getting out is her best shot at being noticed.",
        advanceOn: "/dogs/shelter-dog-nora",
      },
      {
        kind: "card",
        instruction:
          "Tap **Walk Nora**, choose **Walk with a mentor**, and pick **Klára**.",
        detail:
          "Klára's a trusted Super Volunteer here. New walkers go out supervised first, so the shelter never has to vet a stranger cold.",
        advanceOnAction: "pick-mentor",
      },
    ],
  },
  // ── Beat 2 — A new walker gets in, safely ───────────────
  {
    n: 2,
    title: "Setting up the walk",
    personaId: "eliska",
    when: "Setting up the walk",
    context:
      "Now to set up the mentored walk with Klára. First the waivers, then the walk. Whichever way Eliška goes out, it counts the same toward walking on her own.",
    summary: "A brand-new walker books a mentored first walk with a trusted Super Volunteer.",
    startUrl: "/dogs/shelter-dog-nora",
    steps: [
      {
        kind: "card",
        instruction:
          "Agree to the waivers, pick **Klára's group walk**, and **Sign up**. Then tap **Next**.",
        detail:
          "A paid, supervised first walk with the trainer alongside. The safe way in.",
        // FC18 in-sheet sign-up (MentorSessionBookingSheet): creates the
        // meet-linked shelter-walk booking + begins the mentorship. The
        // credentialing detail (waiver layers, session count) is deliberately
        // dropped from the guided flow — it lives in the Phase-2 interview kit.
      },
      {
        // Time-passage: the vouch lands here (end of Eliška's arc) so Beat 3
        // can open straight onto the shelter's side with a vetted walker
        // already in the pool. Firing it on Continue keeps her walker state in
        // sync with the caption.
        kind: "interstitial",
        mode: "time-passage",
        eyebrow: "A few walks later",
        heading: "You're a vouched walker.",
        body:
          "Three supervised walks in, Klára vouched for you. You can walk Útulek's dogs on your own now, and the shelter never had to run an intake on a stranger.",
        fireWalkerVouch: {
          userId: "eliska",
          shelterId: "utulek-liben",
          mentor: { id: "klara", name: "Klára Horáčková" },
        },
      },
    ],
  },
  // ── Beat 3 — Your side (operator POV) ──────────────────────────────────────
  {
    n: 3,
    title: "Your side",
    personaId: "op-utulek-liben",
    when: "From the shelter's side",
    context:
      "Now switch seats. You're Útulek. A stranger just became a walker you can trust. So what did any of it actually ask of you?",
    summary: "The operator's side: a logged handover trail, an application you control, every veto kept.",
    startUrl: "/schedule",
    steps: [
      {
        kind: "card",
        instruction:
          "This is your side. **Schedule** opens on today's **handover board** — every dog out, due back, and back safe, with who has them.",
        detail:
          "Nobody on staff set this up. It fills in as walkers check dogs out and back. The logged trail an incident would need, without asking anything of you.",
      },
      {
        kind: "card",
        instruction:
          "Open **Applications** in the nav. People waiting to walk for you, each with a note. Eliška arrived mentor-recommended.",
        detail:
          "You invite, then vouch, when you're ready. The mentor's vouch is a recommendation, never a bypass. Saying no still routes through you.",
        advanceOn: "/bookings",
      },
      {
        kind: "card",
        instruction:
          "Open your shelter, then **Walkers**. Each carries a tier they earned by walking, and a kebab menu to promote or demote.",
        detail:
          "Your call always overrides the walk-count math, both directions. Demote someone and their access goes with it. You keep every veto, all the way up.",
        advanceOn: "/shelters/utulek-liben?op=walkers",
      },
    ],
  },
  // ── Beat 4 — The payoff (operator POV) ────────────────────────────────
  {
    n: 4,
    title: "The payoff",
    personaId: "op-utulek-liben",
    when: "Weeks on",
    context:
      "Same seat, weeks on. Look at what the walks have added up to, on your own side.",
    summary: "The adoption-interest landing fills, and the public wall shows where it came from.",
    startUrl: "/bookings?tab=adoptions",
    steps: [
      {
        kind: "card",
        instruction:
          "Back to **Applications**, now the **Adoptions** tab. People who saw a walk recap are asking about your dogs, Nora among them.",
        detail:
          "Applications gathers everyone reaching toward your dogs (walks, stays, adoptions). The walkers didn't adopt. They surfaced these dogs to people who would. That is the loop: dogs that get out get seen, and seen dogs get homes.",
      },
      {
        kind: "card",
        instruction:
          "Open your shelter's **Feed** to see where that interest comes from. Walk posts, your dogs out and happy.",
        detail:
          "You never ran a social account. Your walkers do it for you, each post quietly advertising a dog who needs a home.",
        // Pathname-only: from the Applications page the natural hop back is the
        // home-nav (→ bare hub URL, which defaults to Feed), so don't require
        // the `?op=feed` param the old in-hub tab-click used to set.
        advanceOn: "/shelters/utulek-liben",
      },
    ],
  },
];

// ── Registry ─────────────────────────────────────────────────────────────────
// Named walkthroughs. The launcher reads WALKTHROUGH_LIST for its doors; the
// sequencer (WalkthroughContext) runs one by id. Phase 1 ships all three
// community Worlds: `new-owner`, `trainer`, `shelter`.

const NEW_OWNER: Walkthrough = {
  id: "new-owner",
  displayName: "Find your community",
  blurb:
    "Follow an anxious new owner from a first nervous walk to a trainer, a neighbour, and a community his dog belongs to.",
  thesis:
    "A nervous newcomer lands in a community, finds trust, and the community→trust→care funnel turns — a pro to teach, a neighbour to lean on.",
  interviewee:
    "A new, recent, or anxious dog owner (especially first-time / expat).",
  closing: {
    heading: "End of walkthrough.",
    body:
      "One free walk at Stromovka. From it, Daniel found a trainer for nervous Bára, a neighbour to lean on, and a community to belong to. The community came first; the care followed. Want to keep exploring?",
  },
  beats: NEW_OWNER_BEATS,
};

const TRAINER: Walkthrough = {
  id: "trainer",
  displayName: "Build community, and a living",
  blurb:
    "See a walker-trainer's free public walk for what it really is: her demonstration, her lead generation, and her livelihood.",
  thesis:
    "The supply side is real: a pro builds a following and earns from the same community walk that grows the network. The walk IS the funnel.",
  interviewee:
    "A Prague walker, trainer, or sitter (the cold-start engine to recruit).",
  closing: {
    heading: "End of walkthrough.",
    body:
      "One free walk, and for Klára it was the whole business at once: a sealed visit report for a paying client, and a post that tomorrow's nervous-dog owner scrolls past and books her from. Community and livelihood, the same morning. Want to keep exploring?",
  },
  beats: TRAINER_BEATS,
};

const SHELTER: Walkthrough = {
  id: "shelter",
  displayName: "Help a shelter dog",
  blurb:
    "Watch a shelter safely open walking to a brand-new volunteer, and turn those walks into an adoption engine.",
  thesis:
    "Vetted community walkers + the advocacy loop turn a shelter's dogs into an adoption engine, easing vetting and coordination without more work or risk.",
  interviewee:
    "A shelter or rescue coordinator (the World-3 partner to win over).",
  closing: {
    heading: "If you run a shelter, this part's for you.",
    body:
      "You just saw both sides: a stranger becoming a walker you can trust, and your own side staying in control, with a logged trail and nothing asked of your staff. We'd love your read. Could a system like this earn enough of your trust to open walking to new volunteers? What would you need to see, or keep control over, to feel comfortable? And is your walker count limited more by people applying, or by what it costs to vet them?",
  },
  beats: SHELTER_BEATS,
};

/** Ordered for the launcher doors — the three community Worlds. */
export const WALKTHROUGH_LIST: Walkthrough[] = [NEW_OWNER, TRAINER, SHELTER];

/** Lookup by id (the persisted run-state id). Undefined-safe. */
export function getWalkthrough(id: string | undefined): Walkthrough | undefined {
  return WALKTHROUGH_LIST.find((w) => w.id === id);
}

/** A walkthrough's beat by 0-based index. Undefined past the end (the closing interstitial). */
export function getBeat(
  walkthroughId: string | undefined,
  index: number,
): WalkthroughBeat | undefined {
  return getWalkthrough(walkthroughId)?.beats[index];
}

/** A walkthrough's beat count (0 if the id is unknown). */
export function getBeatCount(walkthroughId: string | undefined): number {
  return getWalkthrough(walkthroughId)?.beats.length ?? 0;
}

/**
 * Fire-off post ids across ALL walkthroughs — seeded in `mockPosts.ts` but kept
 * HIDDEN from feeds until the tester "Shares" them on the matching fire-off step
 * (tracked in `WalkthroughContext.sharedPostIds`). Aggregated across the
 * registry so any walkthrough's fire-off post stays hidden until shared,
 * regardless of which one is active. 2026-05-22 (registry-sourced 2026-06-22).
 */
export const WALKTHROUGH_FIREOFF_POST_IDS: Set<string> = new Set(
  WALKTHROUGH_LIST.flatMap((w) =>
    w.beats.flatMap((b) =>
      b.steps.flatMap((s) =>
        s.kind === "card" && s.fireOff ? [s.fireOff.postId] : [],
      ),
    ),
  ),
);

/**
 * Should this post be hidden from feeds right now? True when a walkthrough is
 * active, the post is a fire-off post, and the tester hasn't "Shared" it yet —
 * so the post a fire-off card is about to share isn't already sitting in any
 * feed (group feed, Community/Home feed). Outside a walkthrough this is always
 * false, so free-explore shows the seeded post normally. Shared across every
 * feed surface that reads `mockPosts`. 2026-05-22.
 */
export function isFireOffPostHidden(
  postId: string,
  walkthroughActive: boolean,
  sharedPostIds: string[],
): boolean {
  return (
    walkthroughActive &&
    WALKTHROUGH_FIREOFF_POST_IDS.has(postId) &&
    !sharedPostIds.includes(postId)
  );
}

/**
 * Meet ids whose "Coming up" feed card should be hidden while a walkthrough is
 * active. The Stromovka walk is run during Beat 2 (Klára's morning), and its
 * occurrence is dated today — so it would otherwise sit in Klára's feed as
 * "Coming up" even after she's just finished it, which contradicts the story.
 * Hidden only during the walkthrough; free-explore shows it normally (a
 * recurring weekly walk legitimately has an upcoming occurrence). 2026-05-22.
 */
export const WALKTHROUGH_HIDDEN_FEED_MEET_IDS: Set<string> = new Set([
  "meet-klara-stromovka",
]);

/** Should this meet's feed card be hidden right now (walkthrough-only)? */
export function isWalkthroughHiddenMeet(
  meetId: string,
  walkthroughActive: boolean,
): boolean {
  return walkthroughActive && WALKTHROUGH_HIDDEN_FEED_MEET_IDS.has(meetId);
}
