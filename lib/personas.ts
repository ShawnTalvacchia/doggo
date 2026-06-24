/**
 * Persona registry for the demo-mode "View as…" picker.
 *
 * Ordered list of the personas the picker exposes for *free-roam* switching.
 * This is a deliberately CURATED subset, not every character in the mock
 * world — the picker is for the distinct, useful vantages a demo viewer
 * would want to roam in, kept small so the dropdown stays scannable.
 *
 * Picker membership ≠ switchability. Any mock-world user can still be
 * switched to (guided walkthroughs do this, e.g. Magda in the new-owner
 * walkthrough) — `CurrentUserContext.setUserById` falls back to
 * `getUserById` for ids not in this list, and `?as=<id>` works for anyone.
 * So a character can be dropped from the picker without vanishing from the
 * world or breaking a walkthrough that switches to them.
 *
 * Roster trim (Phase 2 "The Shelter's Side," 2026-06-24, PO call): the
 * picker was carrying too many. Dropped from free-roam — Tomáš (overlaps
 * Eliška's shelter-mentee vantage; retained as Phase-2 interview material),
 * Lena (pure care customer, no walkthrough use), Magda (neighbour-hub;
 * overlaps Tereza, still driven by the new-owner walkthrough). All three
 * remain full mock-world users.
 *
 * Tereza is first (the default — selecting her exits demo mode), as the
 * routine-owner / community anchor best represents the happy path. Daniel
 * (anxious new owner, locked profile), Klára (trainer/mentor), and Eliška
 * (adoption-curious shelter walker) are the three distinct owner/walker
 * vantages. The **shelter operator** entry (Phase 2) drops the viewer into
 * the shelter's OWN side — "here's how little work this is." "New User"
 * sits last as a deliberately empty profile for onboarding/empty states.
 *
 * Shawn was removed from the picker 2026-04-26 — the actual developer's name
 * shouldn't double as a demo character. He still exists in mock-world data.
 *
 * Each entry pairs a UserProfile with the framing copy reviewers see when
 * deciding whose perspective to drop into. Keep `tagline` short (≈8 words);
 * keep `archetype` aligned with `docs/strategy/User Archetypes.md`.
 */

import type { UserProfile } from "@/lib/types";
import { tereza, daniel, klara, eliska } from "@/lib/mockUsers";

/** ID for the empty-state persona. Surfaces that gate on "new account?" check this. */
export const NEW_USER_ID = "new-user";

/**
 * Shelter the operator persona acts as. Útulek Liběň is the full-featured
 * demo shelter; the operator entry drops the viewer into ITS operator view.
 */
export const OPERATOR_SHELTER_ID = "utulek-liben";

/** ID for the shelter-operator persona (institutional shared-login account). */
export const OPERATOR_USER_ID = "op-utulek-liben";

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

/**
 * Shelter-operator persona — an institutional shared-login account, NOT a
 * UserProfile-backed person (shelters are a parallel entity; see
 * features/shelters.md → Account model). Modeled AS a minimal UserProfile so
 * it flows through the existing persona machinery (`useCurrentUser`, the
 * switcher), carrying the shelter logo as its avatar. Selecting it turns on
 * the shelter's operator view (see `getOperatorShelterId`). Other surfaces
 * render it as a sparse locked account — acceptable; the operator's natural
 * home is the shelter page, which the picker routes to on select.
 */
export const operatorPersona: UserProfile = {
  id: OPERATOR_USER_ID,
  firstName: "Útulek Liběň",
  lastName: "",
  email: "team@utulekliben.cz",
  // Shelter logo (Avatar Rule B — institutional entity renders as a circle,
  // same as the shelter page). Kept in sync with mockShelters' utulek-liben.
  avatarUrl: "/images/generated/shelter-utulek-liben-logo.jpeg",
  bio: "",
  location: "Libeň, Prague 8",
  neighbourhood: undefined,
  memberSince: "2007-01",
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
  /**
   * Set on the shelter-operator entry — the shelter whose operator view this
   * persona drops into. Surfaces read it via `getOperatorShelterId`; the
   * picker routes here to `/shelters/<id>` (not `/home`) on select.
   */
  operatorShelterId?: string;
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
    tagline: "Walker-trainer. Runs a free weekly Stromovka walk.",
  },
  {
    user: eliska,
    archetype: "Adoption-Curious Explorer",
    // The non-owner doorway: walks shelter dogs to decide whether to adopt.
    // Spine of the Adoption-Curious Journey phase (2026-06-12).
    tagline: "Žižkov. No dog yet — walking shelter dogs to find out.",
  },
  {
    user: operatorPersona,
    archetype: "Shelter operator",
    // Phase 2 "The Shelter's Side" — the other half of the shelter pitch.
    tagline: "Útulek Liběň. See the shelter's own side.",
    operatorShelterId: OPERATOR_SHELTER_ID,
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

/**
 * The shelter id whose operator view this persona drops into, or undefined
 * for any non-operator persona. Surfaces (the shelter page) turn on the
 * operator view when this matches the shelter being viewed.
 */
export function getOperatorShelterId(userId: string): string | undefined {
  return personas.find((p) => p.user.id === userId)?.operatorShelterId;
}

/** The default persona (Tereza). */
export const defaultPersona: PersonaOption = personas[0];

/** True if the given persona ID is the brand-new-user state. */
export function isNewUser(userId: string): boolean {
  return userId === NEW_USER_ID;
}
