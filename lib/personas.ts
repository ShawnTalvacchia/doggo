/**
 * Persona registry for the demo-mode "View as…" picker.
 *
 * Ordered list of users that the picker exposes for runtime persona switching.
 * Tereza is first (the default — selecting her is equivalent to exiting demo
 * mode), as the routine-owner / community-anchor archetype best represents
 * the happy path. The remaining journey users follow in narrative order
 * from `docs/strategy/User Journeys.pptx` and `docs/implementation/mock-data-plan.md`.
 * Magda was added 2026-05-14 (Demo Narrative & Personas, W2.7) as the
 * Neighborhood Hub Member archetype — she carries Beat 3 of the demo
 * narrative (private group + peer care).
 * "New User" sits at the end as a deliberately empty profile so reviewers can
 * see what brand-new-account states look like across every surface.
 *
 * Shawn was removed from the picker 2026-04-26 — the actual developer's name
 * shouldn't double as a demo character. He still exists in mock-world data as
 * a Vinohrady regular; just no longer a "view as" option.
 *
 * Each entry pairs a UserProfile with the framing copy reviewers see when
 * deciding whose perspective to drop into. Keep `tagline` short (≈8 words);
 * keep `archetype` aligned with `docs/strategy/User Archetypes.md`.
 */

import type { UserProfile } from "@/lib/types";
import { tereza, daniel, klara, tomas, lena, magda } from "@/lib/mockUsers";

/** ID for the empty-state persona. Surfaces that gate on "new account?" check this. */
export const NEW_USER_ID = "new-user";

/**
 * Inline SVG placeholder avatar — a generic head-and-shoulders silhouette in
 * neutral grey. Inlined so we don't depend on a public asset that may not
 * exist; data URI works everywhere `<img src=...>` is used.
 */
const NEW_USER_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <rect width='64' height='64' fill='#e5e7eb'/>
      <circle cx='32' cy='26' r='10' fill='#9ca3af'/>
      <path d='M12 60c0-11 9-20 20-20s20 9 20 20' fill='#9ca3af'/>
    </svg>`
  );

/**
 * Brand-new-user persona — no pets, no bio, no carer profile, no groups, no
 * connections. Used to preview empty/onboarding states across every surface.
 */
export const newUserPersona: UserProfile = {
  id: NEW_USER_ID,
  firstName: "New",
  lastName: "User",
  email: "newuser@example.com",
  avatarUrl: NEW_USER_AVATAR,
  bio: "",
  location: "",
  neighbourhood: undefined,
  memberSince: new Date().toISOString().slice(0, 7),
  pets: [],
  openToHelping: false,
  profileVisibility: "locked",
  tagApproval: "approve",
};

export type PersonaOption = {
  user: UserProfile;
  /** Behavioural archetype label — matches User Archetypes.md vocabulary. */
  archetype: string;
  /** One-line framing for the picker card. */
  tagline: string;
  /** True for the canonical default (Tereza). The picker styles + labels this differently. */
  isDefault?: boolean;
};

export const personas: PersonaOption[] = [
  {
    user: tereza,
    archetype: "Routine Owner / Connector",
    tagline: "Vinohrady regular. Anchors the morning crew.",
    isDefault: true,
  },
  {
    user: daniel,
    archetype: "Anxious New Owner",
    tagline: "Reactive rescue. Private profile. Few connections.",
  },
  {
    user: klara,
    archetype: "Professional Provider",
    tagline: "Trainer with a Care group of regulars.",
  },
  {
    user: tomas,
    archetype: "Busy Professional",
    tagline: "Karlín commuter. Leans on care help.",
  },
  {
    user: lena,
    archetype: "Marketplace Owner",
    tagline: "Letná tech worker. Pure care customer.",
  },
  {
    user: magda,
    archetype: "Neighborhood Hub Member",
    tagline: "Holešovice. Anchors a tight private block.",
  },
  {
    user: newUserPersona,
    archetype: "Just signed up",
    tagline: "Empty profile. See onboarding + empty states.",
  },
];

/** Look up a persona by user ID. */
export function getPersona(userId: string): PersonaOption | undefined {
  return personas.find((p) => p.user.id === userId);
}

/** The default persona (Tereza). */
export const defaultPersona: PersonaOption = personas[0];

/** True if the given persona ID is the brand-new-user state. */
export function isNewUser(userId: string): boolean {
  return userId === NEW_USER_ID;
}
