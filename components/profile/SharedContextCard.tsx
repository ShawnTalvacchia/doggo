"use client";

/**
 * SharedContextCard — warmth signal on a viewer-vs-subject surface
 * (currently the locked-profile page on `/profile/[userId]`).
 *
 * Lists everything viewer and subject have in common: shared group
 * memberships AND shared past meet attendance. Pulled out of the lock
 * card during the Cross-Cutting Flow Testing walkthrough (2026-05-11) so
 * "warmth / what you have together" reads independently of "what's
 * gated." The trust gradient on a locked profile becomes:
 *
 *   Familiar CTA  →  SharedContextCard (warmth)  →  Lock card (explainer)
 *
 * Renders nothing when there's no shared context (no groups AND no
 * meets) — caller can pass empties to let the card collapse.
 *
 * **Shared meets** (P66, 2026-06-02). Backed by `getSharedMeetsBetween`
 * which returns the past (meet, date) occurrences both viewer and
 * subject attended, most recent first. The line names the most recent
 * meet as social proof — "You've also been at 3 meets together, most
 * recently *Stromovka morning walk* on 4 May 2026."
 */

import { UsersThree } from "@phosphor-icons/react";
import type { MeetOccurrence } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";

interface SharedContextCardProps {
  /** Display name of the subject for first-person framing ("You and {firstName}…"). */
  firstName: string;
  /** Names of groups both viewer and subject belong to. From `getSharedGroupNames`. */
  sharedGroupNames: string[];
  /** Past (meet, date) occurrences both attended, most recent first.
   *  From `getSharedMeetsBetween`. Optional — omit when not on a surface
   *  that wants to surface past attendance. */
  sharedMeets?: MeetOccurrence[];
}

export function SharedContextCard({
  firstName,
  sharedGroupNames,
  sharedMeets = [],
}: SharedContextCardProps) {
  if (sharedGroupNames.length === 0 && sharedMeets.length === 0) return null;

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
      {sharedGroupNames.length > 0 && (
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
      )}
      {sharedMeets.length > 0 && (
        <p className="text-sm text-fg-secondary m-0" style={{ lineHeight: 1.5 }}>
          {sharedMeets.length === 1 ? (
            <>
              You were both at{" "}
              <strong className="text-fg-primary">{sharedMeets[0]!.meet.title}</strong>
              {" on "}
              {formatShortDate(sharedMeets[0]!.date)}.
            </>
          ) : (
            <>
              You&apos;ve attended{" "}
              <strong className="text-fg-primary">{sharedMeets.length} meets</strong>
              {" together — most recently "}
              <strong className="text-fg-primary">{sharedMeets[0]!.meet.title}</strong>
              {" on "}
              {formatShortDate(sharedMeets[0]!.date)}.
            </>
          )}
        </p>
      )}
    </div>
  );
}
