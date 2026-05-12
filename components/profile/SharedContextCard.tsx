"use client";

/**
 * SharedContextCard — warmth signal on a viewer-vs-subject surface
 * (currently the locked-profile page on `/profile/[userId]`).
 *
 * Lists everything viewer and subject have in common: shared group
 * memberships today, with room for shared past meet attendance and
 * mutual connections in future iterations. Pulled out of the lock card
 * during the Cross-Cutting Flow Testing walkthrough (2026-05-11) so
 * "warmth / what you have together" reads independently of "what's
 * gated." The trust gradient on a locked profile becomes:
 *
 *   Familiar CTA  →  SharedContextCard (warmth)  →  Lock card (explainer)
 *
 * Renders nothing when there's no shared context — caller can use
 * `getSharedGroupNames(viewerId, subjectId).length > 0` to gate the
 * mount, or just always render and let the empty state collapse to null.
 *
 * **Future expansion:** when `getSharedMeetsBetween(viewerId, subjectId)`
 * lands as a list-returning helper (today's `viewerSharedMeetWith` is
 * boolean-only), add a "You attended N meets together" line. Filed as a
 * follow-up in `phases/punch-list.md`.
 */

import { UsersThree } from "@phosphor-icons/react";

interface SharedContextCardProps {
  /** Display name of the subject for first-person framing ("You and {firstName}…"). */
  firstName: string;
  /** Names of groups both viewer and subject belong to. From `getSharedGroupNames`. */
  sharedGroupNames: string[];
}

export function SharedContextCard({
  firstName,
  sharedGroupNames,
}: SharedContextCardProps) {
  if (sharedGroupNames.length === 0) return null;

  // Full-width card, no fill, regular border. Differentiates from the
  // lock card below (which uses inset fill for the "this is gated"
  // muted treatment). The hierarchy "warmth = clean, gate = muted"
  // reads cleanly. Max-width removed during CCFT 2026-05-11 so the
  // card stretches to the page width like the panel-anchored cards
  // elsewhere on the locked profile.
  return (
    <div
      className="flex flex-col gap-sm rounded-panel w-full"
      style={{
        border: "1px solid var(--border-regular)",
        padding: "var(--space-lg)",
      }}
    >
      <div className="flex items-center gap-sm">
        <UsersThree size={18} weight="light" className="text-fg-secondary shrink-0" />
        <h4
          className="font-heading font-medium text-fg-primary m-0"
          style={{ fontSize: "var(--text-sm)" }}
        >
          You and {firstName}
        </h4>
      </div>
      <p className="text-sm text-fg-secondary m-0" style={{ lineHeight: 1.5 }}>
        {sharedGroupNames.length === 1 ? (
          <>You&apos;re both in <strong className="text-fg-primary">{sharedGroupNames[0]}</strong>.</>
        ) : (
          <>
            You&apos;re both in{" "}
            {sharedGroupNames.slice(0, -1).map((name, i) => (
              <span key={name}>
                <strong className="text-fg-primary">{name}</strong>
                {i < sharedGroupNames.length - 2 ? ", " : ""}
              </span>
            ))}
            {" and "}
            <strong className="text-fg-primary">
              {sharedGroupNames[sharedGroupNames.length - 1]}
            </strong>
            .
          </>
        )}
      </p>
    </div>
  );
}
