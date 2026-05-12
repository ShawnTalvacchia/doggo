"use client";

/**
 * OwnerDogAvatar — owner-forward avatar primitive.
 *
 * 64px owner avatar (circle) with up to 2 dog images (32px, 12px-rounded
 * squares) overlapping the bottom-right. When the owner has 3+ dogs, the
 * second slot is replaced by a "+N" chip showing how many additional dogs
 * weren't surfaced. Internal dog-image lookup via `getDogImageByOwnerAndName`;
 * dogs whose images can't be resolved are filtered out and counted toward
 * the +N chip implicitly.
 *
 * Originally lived inside `PostMeetReviewSheet`; extracted during the
 * Community & Groups Deep Pass (Workstream A4) so the People tab and the
 * Group Members tab can adopt the same pattern. The dog-forward layout
 * (small dog avatars, dog name primary) stays on the meet card hero
 * anatomy where the dog IS the social-proof unit; this owner-forward
 * primitive is for *list contexts* where rows represent people.
 *
 * Sizing is fixed by design (64+32) — it's the post-meet review's tested
 * scale and matches `PersonRow`'s non-inbox avatar slot. Inbox rows stay
 * denser (44px owner, no dog avatars — chat-list shape) and don't use
 * this primitive.
 */

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";

export interface OwnerDogAvatarProps {
  /** Owner's user ID — used to resolve dog images via the lookup. */
  userId: string;
  /** Owner display name — used by `DefaultAvatar` when `avatarUrl` is missing. */
  name: string;
  /** Owner avatar URL. If absent, falls back to the initials avatar. */
  avatarUrl?: string;
  /** Dog names belonging to this owner. Up to 2 surface visually; the rest collapse into a +N chip. */
  dogNames: string[];
}

export function OwnerDogAvatar({ userId, name, avatarUrl, dogNames }: OwnerDogAvatarProps) {
  // Resolve dog images — null entries (lookup miss) get filtered out
  // and counted toward the +N chip implicitly.
  const dogImages = dogNames
    .map((dogName) => ({ name: dogName, url: getDogImageByOwnerAndName(userId, dogName) }))
    .filter((d): d is { name: string; url: string } => Boolean(d.url));

  // Cap dog slots at 2 max (avatar + optional chip). Most owners have 1–2
  // dogs, so the common case is fully shown. When there are 3+ dogs, show
  // the first dog as an avatar and collapse the rest into a "+N" chip —
  // 1 visible avatar + 1 chip = 2 slots used. Cleaner than 2 avatars + chip
  // (3 slots), which crowds the row.
  const totalDogCount = dogNames.length;
  const showChip = totalDogCount >= 3;
  const visibleDogs = showChip ? dogImages.slice(0, 1) : dogImages.slice(0, 2);
  const extraDogCount = showChip ? totalDogCount - 1 : 0;

  // Dog avatar size — single-slot rendering gets a slightly larger 36px
  // so the lone dog reads with more presence. Two-slot rendering (2 dogs,
  // OR 1 dog + chip) shrinks each to 32px so the cluster fits within the
  // 44px slot in `.person-avatar-dogs`.
  const totalSlots = visibleDogs.length + (showChip ? 1 : 0);
  const dogSize = totalSlots === 1 ? 36 : 32;

  return (
    <div className="person-avatar-combo">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="person-avatar-owner" />
      ) : (
        <DefaultAvatar name={name} size={64} />
      )}
      {/* Always render the dog slot so the combo's total width stays
          constant (64px owner + 44px dog slot - 16px overlap = 92px)
          regardless of pet count. Without this, dogless owners (e.g.
          Nikola) collapse the cluster to 64px and the row's `-ml-3` on
          the name pulls them visibly further left than rows with pets,
          breaking the name-column alignment across the list. */}
      <div className="person-avatar-dogs" aria-hidden={visibleDogs.length === 0 && extraDogCount === 0}>
        {visibleDogs.map((d) => (
          <img
            key={d.name}
            src={d.url}
            alt={`${d.name} (${name}'s dog)`}
            className="person-avatar-dog"
            style={{ width: dogSize, height: dogSize }}
          />
        ))}
        {extraDogCount > 0 && (
          <span
            className="person-avatar-more"
            style={{ width: dogSize, height: dogSize }}
            aria-label={`${extraDogCount} more dogs`}
          >
            +{extraDogCount}
          </span>
        )}
      </div>
    </div>
  );
}
