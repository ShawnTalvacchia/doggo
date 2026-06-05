import type { CarerSpecialization, UserProfile } from "./types";
import { mockGroups } from "./mockGroups";

/**
 * Identity badges — what someone IS / DOES, surfaced as a small inline
 * pill on PersonRow + Profile hero. Distinct from Trust signals (earned
 * decision-helpers — see `lib/trustBadges.ts`) and Role badges (surface-
 * specific — Admin / Host).
 *
 * Discover Refinement walkthrough decision, 2026-05-10. Replaces the
 * retired Helper/Provider tier pill with a single Carer identity that
 * carries an optional sub-specialization (Dog Trainer, Vet, etc.) when
 * the carer has one configured. See `docs/implementation/badges.md` →
 * Identity badges for the full taxonomy.
 *
 * **Visual treatment is uniform** — light info-blue fill, dark info-blue
 * text. The audience setting (`publicProfile`) is encoded by the badge's
 * VISIBILITY (privacy gate hides circle-Carers from non-Connected viewers),
 * not by intensity. If you can see the pill, you can act on the services.
 *
 * **Sub-spec resolution priority:**
 *   1. `carerProfile.specializations` — direct user-set field (P60, 2026-06-03).
 *      Takes the FIRST entry when multiple are set; multi-spec rendering
 *      ("Trainer + Walker") is a future enhancement.
 *   2. Care group `careCategory` — when the carer runs or co-runs a Care
 *      group, the group's category becomes the sub-spec ("training" → "Dog
 *      Trainer", "grooming" → "Groomer", etc.). This is how Klára gets "Dog Trainer."
 *   3. Credential cert string match — `/train/i` → "Dog Trainer", `/groom/i`
 *      → "Groomer". Catches credentialed carers who don't run a Care group
 *      (e.g. Tomáš B.).
 *   4. Fallback to plain "Carer" when no sub-spec resolves.
 */

/** Care category → display label. Mirrors `CARE_CATEGORY_LABELS` in
 *  `app/communities/[id]/page.tsx`; kept aligned so the same Carer reads
 *  the same way on a group hero and on a person row. */
const CARE_CATEGORY_LABELS: Record<string, string> = {
  training: "Dog Trainer",
  walking: "Dog Walker",
  grooming: "Grooming Salon",
  boarding: "Boarding & Daycare",
  rehab: "Canine Rehabilitation",
  venue: "Dog-Friendly Venue",
  vet: "Vet Clinic",
  other: "Carer",
};

/** `CarerSpecialization` → singular display label for the badge sub-spec.
 *  Distinct from `CARE_CATEGORY_LABELS` (group-shaped, e.g. "Grooming
 *  Salon") — these are individual-shaped ("Groomer"). P60, 2026-06-03. */
const SPECIALIZATION_LABELS: Record<CarerSpecialization, string> = {
  trainer: "Dog Trainer",
  walker: "Dog Walker",
  sitter: "Pet Sitter",
  boarder: "Boarder",
  daycare: "Day Care",
  groomer: "Groomer",
};

export interface CarerIdentity {
  /** `"open"` = `publicProfile === true` (public to anyone).
   *  `"circle"` = `publicProfile === false` AND viewer is Connected
   *               (visible only to Connected viewers per the privacy
   *               rule; the resolver returns `undefined` otherwise).
   *  Kept on the type even though the visual treatment is uniform —
   *  consumers may still want to know which audience they're rendering
   *  for. */
  kind: "open" | "circle";
  /** Display label for the pill — "Carer" by default, or a sub-spec
   *  ("Dog Trainer", "Vet Clinic", etc.) when one resolves. */
  label: string;
}

/** Find the most specific sub-spec label for a carer, or undefined when
 *  none resolves (caller falls back to "Carer"). */
function resolveCarerSubSpec(
  subjectUserId: string,
  subject: UserProfile,
): string | undefined {
  // 1. Direct specialization field (P60, 2026-06-03) — highest priority
  //    because it's the user's explicit choice. Takes the first entry
  //    when multiple specs are set; "Trainer + Walker" multi-spec
  //    rendering is filed as a future enhancement.
  const specs = subject.carerProfile?.specializations ?? [];
  if (specs.length > 0) {
    return SPECIALIZATION_LABELS[specs[0]!];
  }

  // 2. Care group careCategory — carer runs or co-runs a Care group.
  const group = mockGroups.find(
    (g) =>
      g.groupType === "care" &&
      (g.creatorId === subjectUserId ||
        (g.providers ?? []).some((p) => p.userId === subjectUserId)),
  );
  if (group?.careCategory && CARE_CATEGORY_LABELS[group.careCategory]) {
    return CARE_CATEGORY_LABELS[group.careCategory];
  }

  // 3. Credential cert string match.
  const certs = subject.carerProfile?.credentials?.certifications ?? [];
  if (certs.some((c) => /train/i.test(c))) return "Dog Trainer";
  if (certs.some((c) => /\bvet\b|veterinary|dvm/i.test(c))) return "Vet";

  return undefined;
}

/**
 * Resolve the Carer identity badge for `subject` from `viewer`'s perspective.
 * Returns `undefined` when:
 *   - subject has no `carerProfile` (they're an Owner, not a Carer)
 *   - subject is a circle-Carer AND the viewer isn't Connected to them
 *     (privacy gate — same rule as the retired Helper-tier pill)
 *
 * `viewerIsConnected` is the caller's responsibility — pass `true` when
 * the connection state from viewer→subject is `"connected"` OR when the
 * row IS the viewer themselves (self-render always shows your own
 * classification).
 */
export function getCarerIdentity(
  subject: UserProfile | undefined,
  viewerIsConnected: boolean,
): CarerIdentity | undefined {
  if (!subject?.carerProfile) return undefined;
  const isOpen = subject.carerProfile.publicProfile;
  // Circle-only — gated on Connected status.
  if (!isOpen && !viewerIsConnected) return undefined;
  const label = resolveCarerSubSpec(subject.id, subject) ?? "Carer";
  return { kind: isOpen ? "open" : "circle", label };
}
