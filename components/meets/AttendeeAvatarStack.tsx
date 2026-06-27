"use client";

/**
 * AttendeeAvatarStack — dog-forward avatar row for meet cards and attendee
 * summaries. Per the meet-card anatomy (see `docs/features/meets.md` → Meet-card
 * anatomy), cards lead with dog photos, not owner avatars.
 *
 * For each attendee we take their first dog (via `getDogImageByOwnerAndName`)
 * and render its photo. When a dog photo can't be resolved (mock data gap,
 * unknown dog), we fall back to the owner's avatar in the same slot so the
 * stack stays visually full. The count line below reports the true totals.
 */

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { MeetAttendee } from "@/lib/types";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";

interface Props {
  /** Attendees to render — callers filter to the set they want (e.g. "going"). */
  attendees: MeetAttendee[];
  /** Maximum avatar circles before collapsing into "+N". Default 5. */
  maxAvatars?: number;
  /** Avatar diameter in px. Default 28. */
  size?: number;
  /** Overlap between adjacent avatars in px (negative left margin). Default 8. */
  overlap?: number;
  /** Dim the stack slightly (e.g. history / completed contexts). */
  muted?: boolean;
  /** Hide the "N people · M dogs" line. Default false. */
  hideCountLine?: boolean;
  /** Optional suffix slotted on the same line as the count (e.g. "· 3 spots left"). */
  countSuffix?: React.ReactNode;
}

export function AttendeeAvatarStack({
  attendees,
  maxAvatars = 5,
  size = 28,
  overlap = 8,
  muted = false,
  hideCountLine = false,
  countSuffix,
}: Props) {
  const peopleCount = attendees.length;
  const dogCount = attendees.reduce((sum, a) => sum + a.dogNames.length, 0);

  // Resolve the image for each slot. Prefer the attendee's first dog; fall
  // back to the owner avatar so the stack doesn't collapse on missing data.
  // No Familiar ring here — that's a Discover-surface affordance only
  // (Discover & Care 2026-05-04). On meet/group surfaces the relationship is
  // already signaled by sections, labels, and CTAs.
  const slots = attendees.slice(0, maxAvatars).map((a) => {
    const primaryDog = a.dogNames[0];
    const dogImg = primaryDog ? getDogImageByOwnerAndName(a.userId, primaryDog) : undefined;
    return {
      key: a.userId,
      altLabel: primaryDog ? `${primaryDog} (${a.userName}'s dog)` : a.userName,
      imageUrl: dogImg ?? a.avatarUrl,
      ownerName: a.userName,
      isDogImage: Boolean(dogImg),
    };
  });

  const overflow = Math.max(0, attendees.length - maxAvatars);
  const opacity = muted ? 0.6 : 1;

  return (
    <div className="flex items-center gap-sm flex-wrap">
      <div className="flex items-center shrink-0">
        {slots.map((slot, i) =>
          slot.imageUrl ? (
            <img
              key={slot.key}
              src={slot.imageUrl}
              alt={slot.altLabel}
              // Rule B: dogs render as rounded squares, people as circles.
              // The slot may resolve to either depending on whether
              // `getDogImageByOwnerAndName` returned a dog photo (preferred)
              // or fell back to the owner avatar. Discover Refinement F
              // sweep, 2026-05-10.
              className={`border-2 border-surface-top object-cover ${slot.isDogImage ? "rounded-dog" : "rounded-full"}`}
              style={{
                width: size,
                height: size,
                marginLeft: i > 0 ? -overlap : 0,
                opacity,
              }}
            />
          ) : (
            <span key={slot.key} style={{ marginLeft: i > 0 ? -overlap : 0, opacity }}>
              <DefaultAvatar
                name={slot.ownerName}
                size={size}
                className="border-2 border-surface-top"
              />
            </span>
          )
        )}
        {overflow > 0 && (
          <span
            className="flex items-center justify-center rounded-full text-xs font-medium"
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              background: "var(--surface-gray)",
              color: "var(--text-secondary)",
              opacity,
            }}
          >
            +{overflow}
          </span>
        )}
      </div>

      {!hideCountLine && (peopleCount > 0 || dogCount > 0) && (
        <span className="text-xs text-fg-tertiary">
          {peopleCount} {peopleCount === 1 ? "person" : "people"}
          {dogCount > 0 && ` · ${dogCount} ${dogCount === 1 ? "dog" : "dogs"}`}
          {countSuffix}
        </span>
      )}
    </div>
  );
}
