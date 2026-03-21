import { type Role } from "@/lib/types";

/**
 * Returns the ordered list of signup step slugs.
 * Everyone follows the same path: start → profile → pet → visibility → success
 *
 * Role selection and provider-specific steps (care-preferences, walking,
 * hosting, pricing) have been removed — everyone starts as an owner,
 * and offering care is configured from the profile later.
 */
export function getSignupSteps(_roles: Role[]): string[] {
  return ["start", "profile", "pet", "visibility"];
}

/**
 * Returns { step, totalSteps } for a given page slug.
 * Returns undefined for pages where step count is not meaningful (e.g. success).
 */
export function getStepInfo(
  slug: string,
  roles: Role[],
): { step: number; totalSteps: number } | undefined {
  const steps = getSignupSteps(roles);
  const index = steps.indexOf(slug);
  if (index === -1) return undefined;
  return { step: index + 1, totalSteps: steps.length };
}
