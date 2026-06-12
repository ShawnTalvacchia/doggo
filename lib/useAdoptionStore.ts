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
 * Demo override store for adoption stage, keyed by dogId. Persisted in
 * localStorage; resets with the demo reset. The shelter-side advances
 * (arrange meet-and-greet, finalise) are honest demo state-toggles — the
 * real operator surface is FC16.
 */
export function useAdoptionStore() {
  const [map, setMap] = usePersistedState<AdoptionMap>("doggo-adoption", {});

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
