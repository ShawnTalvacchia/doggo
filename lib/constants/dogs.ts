import type { PersonalityTag } from "@/lib/types";

/**
 * Human-readable labels for the `PersonalityTag` controlled vocabulary
 * (FC8, Dog Profile phase 2026-06-02). Used by every chip surface that
 * renders personality tags (dog profile, PetCard, PetEditCard picker).
 *
 * To add a new tag: extend `PersonalityTag` in `lib/types.ts`, add the
 * label here, and update the vocabulary section in [[features/shelters]] →
 * "Dog profile tag taxonomy."
 */
export const PERSONALITY_TAG_LABELS: Record<PersonalityTag, string> = {
  affectionate: "Affectionate",
  calm: "Calm",
  smart: "Smart",
  shy: "Shy",
  playful: "Playful",
  independent: "Independent",
  gentle: "Gentle",
  "loves-walks": "Loves walks",
  "good-with-strangers": "Good with strangers",
  "good-with-kids": "Good with kids",
  "good-with-dogs": "Good with dogs",
  "selective-with-dogs": "Selective with dogs",
  "reactive-on-leash": "Reactive on leash",
  "wary-of-strangers": "Wary of strangers",
  "needs-basics": "Needs basics",
  senior: "Senior",
  puppy: "Puppy",
};

/**
 * Display order for the PetEditCard picker — looser grouping by theme
 * (warmth → temperament → social → training). Render surfaces that want a
 * specific dog's tags use the order they appear in `personalityTags[]`
 * (preserved from how the owner picked them).
 */
export const PERSONALITY_TAG_PICKER_ORDER: PersonalityTag[] = [
  "affectionate",
  "playful",
  "gentle",
  "calm",
  "shy",
  "independent",
  "smart",
  "loves-walks",
  "good-with-strangers",
  "good-with-kids",
  "good-with-dogs",
  "selective-with-dogs",
  "reactive-on-leash",
  "wary-of-strangers",
  "needs-basics",
  "senior",
  "puppy",
];
