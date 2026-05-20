/**
 * walkthroughBeats.ts — the Guided Walkthrough's spine (Demo Narrative V2).
 *
 * Single source of truth for the demo's guided story. Mirrors
 * `docs/strategy/Demo Narrative.md` — keep the two in sync. Consumed by:
 *   - `contexts/WalkthroughContext.tsx` — the beat + step sequencer
 *   - `components/walkthrough/WalkthroughInterstitial.tsx` — the persona
 *     handoff, the mid-beat interstitials, and the closing screen
 *   - `components/walkthrough/WalkthroughCard.tsx` — the on-surface step card
 *
 * V2 structure (re-authored 2026-05-18): 3 beats, 2 personas — Daniel's
 * journey is the spine, with one cut to Klára's POV (Beat 2).
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
       * Fire-off steps surface pre-written content for a one-tap commit.
       * When set, the card renders the image + caption as a post preview and
       * the primary action reads "Share" (the post is pre-seeded in
       * `mockPosts.ts`; "Share" is the narrated commit). Option 1, 2026-05-18.
       */
      fireOff?: { imageUrl: string; caption: string };
    }
  | {
      /** A mid-beat full-screen interstitial — the card hides while it shows. */
      kind: "interstitial";
      mode: "time-passage" | "explainer";
      /** Small muted label — a time cue, or "How this works" for explainers. */
      eyebrow: string;
      heading: string;
      body: string;
    };

export type WalkthroughBeat = {
  /** 1-based beat number, for display ("Beat 1 of 3"). */
  n: number;
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

export const WALKTHROUGH_BEATS: WalkthroughBeat[] = [
  // ── Beat 1 — Daniel: time to get Bára out ────────────────────────────────
  {
    n: 1,
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
          "**Discover** has three doors. Tap **Meets** to see what's happening nearby.",
        detail: "Daniel's after a walk where Bára can meet other dogs gently.",
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
          "Read the walk. It's free, open to everyone, and Klára's note welcomes nervous dogs. Tap **Next** when you've had a look.",
        detail: "This is the gentle first outing Daniel was hoping to find for Bára.",
      },
      {
        kind: "card",
        instruction: "Tap **Join** to RSVP, then tap **Next**.",
        detail:
          "A free, low-pressure first step. Daniel's committed Bára to her first group walk.",
      },
    ],
  },
  // ── Beat 2 — Klára: the walk is the work ─────────────────────────────────
  {
    n: 2,
    personaId: "klara",
    when: "Morning",
    context:
      "Klára runs a free walk at Stromovka every week. It's how the neighbourhood's dogs get out, and it's how she meets her training clients. First, though, she's got a dog to pick up.",
    summary: "Run the morning. The walk is the work.",
    startUrl: "/schedule",
    steps: [
      {
        kind: "card",
        instruction:
          "This is Klára's **My Schedule**. Today holds the Stromovka walk she hosts, and a booked walk for Filip's dog Toby, who she picks up on the way.",
        detail:
          "My Schedule is Klára's day at a glance: every commitment in time order, and whatever's ready to start now.",
      },
      {
        kind: "card",
        instruction:
          "Find today's session with **Toby** and tap **Start session**.",
        detail:
          "The walk is free for everyone. What Klára earns comes from the dogs she's booked to bring, today Toby, plus her own dog Eda for company.",
        advanceOn: "/bookings/booking-klara-toby/active",
        // No card "Next" — the schedule's quick-start is what advances this
        // step: tapping Start flips the session in-progress and routes to
        // the active page, so the walkthrough can't reach Finish with an
        // unstarted session.
        awaitAction: true,
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "More than a walk",
        body:
          "A Klára walk is part exercise, part training, part crew. As the group moves, she coaches: leash skills, reading other dogs, owners learning to handle their own. Not everyone's there for the training. Some regulars come for the company, and their dogs are already happy to see each other. For a nervous dog it's a calm, controlled first taste of all that, and it's how a dog that used to avoid the park slowly becomes one that belongs in the group.",
      },
      {
        kind: "card",
        instruction:
          "The walk's done. Back on the active session, tap **Finish session** and seal the **visit report**. Photos and notes are optional.",
        detail:
          "Filip gets the report afterwards, photos and all. He booked a walk; this is how he knows it happened.",
        // Finish session routes to `/bookings/<id>?tab=sessions` — the
        // pathname is `/bookings/<id>` (query string is excluded from
        // `usePathname`), which is the advanceOn target. `awaitAction`
        // hides the Next button so the tester must actually finish the
        // session (the action this step is about) rather than skip past.
        advanceOn: "/bookings/booking-klara-toby",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Head to the **Groups** tab on the Community page. Select **Klára's Calm Dog Sessions**.",
        detail:
          "After a walk wraps, this is where Klára shares the moment with the crew. Her group, her people, her client funnel.",
        advanceOn: "/communities/group-klara-training",
      },
      {
        kind: "card",
        fireOff: {
          imageUrl: "/images/generated/post-stromovka-walk.jpeg",
          caption:
            "Some new faces on the morning walk. Look at these good boys. 🐾",
        },
        instruction:
          "Klára's walk post is ready for the group. Tap **Share** to post it.",
      },
      {
        kind: "card",
        instruction:
          "Klára's post is live in the group feed. Take a look, then tap **Next**.",
        detail:
          "Same crew sees it first — regulars who'll like and chime in. But the next nervous-dog owner scrolling Holešovice's groups will find it too. The walk grows from posts like this.",
      },
    ],
  },
  // ── Beat 3 — Daniel: review, convert, belong ─────────────────────────────
  {
    n: 3,
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
          "After a meet, Doggo prompts attendees to look back: who came, and who Daniel might want to know.",
        advanceOn: "/meets/meet-klara-stromovka",
      },
      {
        kind: "card",
        instruction:
          "Open the Stromovka walk's **People** tab.",
        detail:
          "Everyone who came along this morning is here, grouped by who Daniel already knows. Most are new faces.",
        // Tab switch updates the URL's query param. The walkthrough's
        // auto-advance matches on pathname + query when the advanceOn
        // includes one, so this fires only when the People tab is open.
        advanceOn: "/meets/meet-klara-stromovka?tab=people",
        awaitAction: true,
      },
      {
        kind: "card",
        instruction:
          "Daniel got talking to **Magda** on the walk, a neighbour from his own street. Mark her **Familiar**, then tap **Next**.",
        detail: "The quietest possible way of saying, I'd like to know you.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "What “Familiar” means",
        body:
          "Daniel's profile is private. Other people can't see his content or send him a message. Marking Magda Familiar opens his profile to her. It isn't a friend request: Magda is never notified, and it commits Daniel to nothing. It's the first step from stranger toward neighbour.",
      },
      {
        kind: "card",
        instruction:
          "Daniel keeps thinking about how calmly Klára handled the nervous dogs. Open **Klára's profile** and go to her **Services**.",
        detail: "A group walk is a great start, but Bára needs focused, one-on-one help to really get there.",
        advanceOn: "/profile/klara",
      },
      {
        kind: "card",
        instruction:
          "**Book Klára's 1-on-1 training** for Bára. Confirm the booking, then tap **Next**.",
        detail:
          "The free walk is what led Daniel here. Now he's investing in something bigger: the confident dog Bára could become.",
      },
      {
        kind: "interstitial",
        mode: "time-passage",
        eyebrow: "A couple of days later",
        heading: "Daniel's settled in.",
        body: "The training with Klára is underway, and Magda has been in touch.",
      },
      {
        kind: "card",
        instruction: "Open Daniel's **Notifications**.",
        detail: "Magda has reached out, with a connection request and a message.",
        advanceOn: "/notifications",
      },
      {
        kind: "card",
        instruction: "**Accept** Magda's connection request, then tap **Next**.",
        detail:
          "They each marked the other Familiar at the walk. Accepting makes it mutual, and the two of them are properly connected now.",
      },
      {
        kind: "card",
        instruction:
          "Open Magda's **invite** to her private neighbourhood group, **Holešovice Dog Block**. Tap **Next**.",
        detail: "Daniel's local circle is starting to take shape.",
      },
      {
        kind: "interstitial",
        mode: "explainer",
        eyebrow: "How this works",
        heading: "Private groups, and mutual care",
        body:
          "A private group is a closed circle of neighbours. It's invite-only, and it isn't a marketplace of strangers. Inside it, people look out for each other and each other's dogs, and some offer care to the circle at neighbourly rates.",
      },
      {
        kind: "card",
        instruction:
          "Open **Holešovice Dog Block** and have a look around: the feed, the members. Then tap **Next**.",
        detail: "A tight crew of Holešovice neighbours, and Daniel's one of them now.",
        advanceOn: "/communities/group-holesovice-block",
      },
      {
        kind: "card",
        instruction:
          "Open the **Members** tab. Under **Care from neighbours**, **Veronika** offers drop-in walks to people in the group. **Book her** for Bára, then tap **Next**.",
        detail:
          "Booking Veronika works just like booking Klára, but Veronika's a neighbour, inside a circle he trusts. A pro to teach Bára, a neighbour to lean on.",
      },
    ],
  },
];

/** Total beat count. */
export const WALKTHROUGH_BEAT_COUNT = WALKTHROUGH_BEATS.length;

/** Get a beat by 0-based index. Returns undefined past the end (the closing interstitial). */
export function getBeat(index: number): WalkthroughBeat | undefined {
  return WALKTHROUGH_BEATS[index];
}
