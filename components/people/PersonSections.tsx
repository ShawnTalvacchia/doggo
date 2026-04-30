"use client";

/**
 * Shared section primitives for person-row surfaces (People tab,
 * Group Members tab, anywhere else a list of people gets grouped).
 *
 * - `SectionHeader` — small uppercase label between row groups (CONNECTED,
 *   FAMILIAR, ADMINS, etc.).
 * - `MetaDivider` — hairline rule + margin separating meta-sections (Going
 *   block from Interested, Admins block from connection-grouped members).
 * - `LockedChipList` — chip list for tier-3 rows that don't render as cards.
 *
 * Originally local to `ParticipantList`. Lifted to a shared component when
 * `MembersTab` needed the same primitives — avoids duplication and keeps
 * the pattern consistent across surfaces.
 */

import { Lock } from "@phosphor-icons/react";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";

/** Quiet section label — uppercase tracking-wider, fg-tertiary. */
export function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-xs text-xs font-semibold uppercase tracking-wider text-fg-tertiary pt-sm">
      {label}
    </div>
  );
}

/**
 * Meta-section divider — hairline rule + `mt-md` for breathing room.
 * Used to separate higher-level groupings (Going block vs Interested,
 * Admins block vs the rest of the membership) from in-block sub-section
 * boundaries (Connected → Familiar within a single group).
 */
export function MetaDivider() {
  return <div className="border-t border-edge-regular mt-md" aria-hidden />;
}

/**
 * Chip list of locked-profile rows. Tier-3 people whose card-form
 * affordances would be empty render here as chips: small avatar +
 * name only, no action area. Counted in the chip-list header.
 */
export interface LockedChipListEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
}

export function LockedChipList({ entries }: { entries: LockedChipListEntry[] }) {
  return (
    <div className="flex flex-col gap-sm pt-sm">
      <div className="flex items-center gap-xs text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
        <Lock size={12} weight="light" />
        Locked profiles ({entries.length})
      </div>
      <ul className="flex flex-wrap gap-sm list-none p-0 m-0">
        {entries.map((e) => (
          <li
            key={e.userId}
            className="flex items-center gap-xs rounded-panel px-sm py-xs bg-surface-inset"
          >
            {e.avatarUrl ? (
              <img
                src={e.avatarUrl}
                alt={e.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <DefaultAvatar name={e.name} size={24} />
            )}
            <span className="text-sm text-fg-secondary">{e.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
