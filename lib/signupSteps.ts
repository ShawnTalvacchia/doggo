import { type Role } from "@/lib/types";

/**
 * Returns the ordered list of signup step slugs for a given role set.
 * The list is used to compute step X of Y indicators in FormHeader.
 *
 * Steps that are always present: start, role, profile
 * Conditional: care-preferences, walking, hosting, pricing (only if walker/host role)
 * Conditional: pet (only if owner role)
 */
export function getSignupSteps(roles: Role[]): string[] {
  const steps: string[] = ["start", "role", "profile"];
  const hasService = roles.includes("walker") || roles.includes("host");
  if (hasService) {
    steps.push("care-preferences");
    if (roles.includes("walker")) steps.push("walking");
    if (roles.includes("host")) steps.push("hosting");
    steps.push("pricing"); // always last service step, before pet/success
  }
  if (roles.includes("owner") || roles.length === 0) steps.push("pet");
  return steps;
}

/**
 * Returns { step, totalSteps } for a given page slug and role set.
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
