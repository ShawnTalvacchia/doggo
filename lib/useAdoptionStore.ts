import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";

/**
 * Adoption stage along the escalation ladder (Adoption-Curious Journey,
 * Workstream E, 2026-06-12). Models adoption as a state machine with
 * non-failure off-ramps, not a binary commit:
 *
 *   available → interested → pending (meet-and-greet) → adopted
 *
 * - `interested` — the walker/network member expressed interest. The shelter
 *   curates from here (no auto-match). Flips the dog-page Adopt CTA to a
 *   "we'll be in touch" status; the dog stays publicly "available".
 * - `pending` — the shelter arranged a meet-and-greet. Surfaces the existing
 *   "Adoption pending" hero pill (maps to PetProfile.adoptionStatus "pending").
 * - `adopted` — finalised. Celebration + archived "Happy endings" treatment.
 *   The literal PetProfile → new-owner migration stays deferred (DR7).
 *
 * Off-ramps (return / try fostering / walk again) are graceful exits, not
 * failures (see Competitive Research — Adoption-Curious Journeys): clearing
 * the stage drops the dog back to available with no penalty framing.
 */
export type AdoptionStage = "interested" | "pending" | "adopted";

interface AdoptionEntry {
  stage: AdoptionStage;
  /** Who's adopting — used for the celebration line. Omitted for an
   *  unnamed network adopter ("found a home"). */
  adopterName?: string;
}

type AdoptionMap = Record<string, AdoptionEntry>; // dogId → entry

/**
 * Seeded adoption interest (Phase 2 "The Shelter's Side", 2026-06-24) —
 * illustrative content for the operator's adoption-interest landing. Three
 * Útulek dogs carry interest that came from the advocacy loop (a network
 * member saw a walk recap and reached out); Nora is the guided shelter
 * walkthrough's focal dog, so her interest shows on the operator Adoptions
 * tab when that demo reaches "the payoff." Káťa stays statically `pending`
 * via her `PetProfile.adoptionStatus`, so the panel shows a spread across the
 * funnel (interested → pending). `interested` keeps a dog walkable (only
 * `pending` suppresses Walk/Adopt), so seeding Nora doesn't block Beat 1's
 * "Walk Nora."
 */
const SEED_ADOPTIONS: AdoptionMap = {
  "shelter-dog-nora": { stage: "interested", adopterName: "Jana V." },
  "shelter-dog-maja": { stage: "interested", adopterName: "Tomáš K." },
  "shelter-dog-theo": { stage: "interested", adopterName: "Petra M." },
};
const ADOPTION_SEED_VERSION = 2;

/**
 * Demo override store for adoption stage, keyed by dogId. Persisted in
 * localStorage; resets with the demo reset. The shelter-side advances
 * (arrange meet-and-greet, finalise) are honest demo state-toggles — the
 * real operator surface is the adoption-interest landing (Phase 2).
 */
export function useAdoptionStore() {
  const [map, setMap] = usePersistedState<AdoptionMap>("doggo-adoption", SEED_ADOPTIONS, {
    seedVersion: ADOPTION_SEED_VERSION,
  });

  const getStage = useCallback(
    (dogId: string): AdoptionEntry | undefined => map[dogId],
    [map],
  );

  const setStage = useCallback(
    (dogId: string, stage: AdoptionStage, adopterName?: string) => {
      setMap((prev) => ({ ...prev, [dogId]: { stage, adopterName } }));
    },
    [setMap],
  );

  const clearStage = useCallback(
    (dogId: string) => {
      setMap((prev) => {
        if (!prev[dogId]) return prev;
        const out = { ...prev };
        delete out[dogId];
        return out;
      });
    },
    [setMap],
  );

  return { getStage, setStage, clearStage };
}
