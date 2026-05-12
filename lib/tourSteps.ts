/**
 * Tour step definitions for the demo-presentation guided walks.
 *
 * Today only Tereza has a tour — the routine-owner / community-anchor
 * archetype is the cleanest read of the community→trust→care funnel. Other
 * personas remain free-exploration with the highlight reels in
 * `docs/features/demo-mode.md`.
 *
 * Steps are URL-driven. The TourOverlay reads `?tour=tereza&step=N` from
 * search params; advancing or going back rewrites the URL. Each step's
 * `href` is the destination page (without tour params — the overlay appends
 * them so they persist across navigation). Persona is preserved via `as`.
 *
 * To add another persona's tour later: add a new key to `tours`, define
 * its step list, and (optionally) wire a launcher URL into /demo or the
 * landing page. The TourOverlay handles all rendering generically.
 */

export type TourStep = {
  /** Display title shown in the overlay card. */
  title: string;
  /** 1–2 sentences explaining what to look for on this surface. */
  body: string;
  /** Destination path (without query params). The overlay appends `?as` + tour params. */
  path: string;
  /** Extra query params to merge into the URL beyond `as` + tour ones (e.g. `tab=services`). */
  query?: Record<string, string>;
};

export type TourId = "tereza";

export const tours: Record<TourId, TourStep[]> = {
  tereza: [
    {
      title: "Tereza's neighbourhood feed",
      body:
        "You're seeing what Tereza sees when she opens Doggo: posts from her Vinohrady morning crew, her evening walking group, and Riegrovy regulars. Community is the home surface — not a marketplace.",
      path: "/home",
    },
    {
      title: "Vinohrady Morning Crew",
      body:
        "An open neighbourhood group. Tereza is one of the regulars. Notice the recurring meets, the familiar faces in the member list, and the easy posting cadence — this is where trust accrues.",
      path: "/communities/group-1",
    },
    {
      title: "Riegrovy morning walk",
      body:
        "Recurring meets are the trust-building unit. Same dogs, same people, same hour. The People tab shows who's coming — relationships build because the same names show up week after week.",
      path: "/meets/meet-1",
    },
    {
      title: "Tereza's profile",
      body:
        "An Open profile (anyone can see) with her two dogs — Franta and Bella — and a Carer offering for neighbours. The same profile holds her social identity AND her care offering — no separate provider account.",
      path: "/profile",
    },
    {
      title: "Her Carer services",
      body:
        "Tereza offers three services — day care, house sitting, and casual walks. Her audience is set to circle (Connected viewers only), not the open marketplace. Auto-pricing modifiers (weekend, multi-pet) replace haggling.",
      path: "/profile",
      query: { tab: "services" },
    },
    {
      title: "Care that emerged from community",
      body:
        "Bookings is the payoff. Care arrangements that wouldn't have happened without months of morning walks together. The funnel — community → trust → care — is the whole product.",
      path: "/bookings",
    },
  ],
};

/** Return total step count for a tour, or 0 if unknown. */
export function tourLength(tourId: string): number {
  return tours[tourId as TourId]?.length ?? 0;
}

/** Get a single step (1-indexed). Returns undefined if out of range. */
export function getTourStep(tourId: string, step: number): TourStep | undefined {
  const list = tours[tourId as TourId];
  if (!list) return undefined;
  if (step < 1 || step > list.length) return undefined;
  return list[step - 1];
}
