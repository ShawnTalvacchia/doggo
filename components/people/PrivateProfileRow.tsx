"use client";

/**
 * PrivateProfileRow — compact row for tier-3 (Private + no relationship)
 * subjects on context-rich surfaces (People tab when viewer attended,
 * Members tab when viewer is a member, locked profile page when shared
 * context exists).
 *
 * Why this exists separately from PersonRow:
 *   - Visual is intentionally smaller (32px avatar, single line) so Private
 *     profiles read distinctly from Open tier-2 cards (which are full-size
 *     owner+dog combos).
 *   - Action set is constrained — only Familiar (off / on toggle). Connect
 *     is never available because the subject is still Locked; per the trust
 *     model Connect requires the subject to have given some opening signal.
 *   - Avoids adding a "compact" branch to PersonRow's already-nuanced
 *     variant logic.
 *
 * Built during Mock World Building (2026-04-30) when we discovered the
 * earlier chip-list-only treatment for Private profiles meant there was
 * literally no surface where a viewer could mark a Private subject Familiar
 * — closing the unlock loop.
 */

import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getShelterDogByName } from "@/lib/mockShelters";

interface PrivateProfileRowProps {
  userId: string;
  name: string;
  avatarUrl?: string;
  /** Dog names for the secondary line. Shown as comma-joined "Bára, Sam". */
  dogNames?: string[];
  /**
   * Whether the viewer can take action on this row. When false, render
   * info-only (avatar + name + dog, no pill). Mirrors PersonRow's
   * `actions={[]}` info-only mode.
   */
  canAct: boolean;
  /** Mixed shelter walk (FC18): a dog name that resolves on this shelter's
   *  roster is highlighted as a shelter dog. Walk-level info, shown even on
   *  a private row (it's about the walk, not the person). */
  shelterWalkId?: string;
}

export function PrivateProfileRow({
  userId,
  name,
  avatarUrl,
  dogNames = [],
  canAct,
  shelterWalkId,
}: PrivateProfileRowProps) {
  const viewerId = useCurrentUserId();
  const { getConnection, markFamiliar, unmarkFamiliar } = useConnections();
  const connection = getConnection(userId, viewerId);
  const isMarked = connection?.state === "familiar";

  return (
    <div className="private-profile-row">
      <Link
        href={`/profile/${userId}`}
        className="private-profile-row-identity"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="private-profile-row-avatar"
          />
        ) : (
          <DefaultAvatar name={name} size={32} />
        )}
        <span className="private-profile-row-name">{name}</span>
        {dogNames.length > 0 && (
          <span className="private-profile-row-dogs">
            <PawPrint size={12} weight="light" />
            {dogNames.map((dogName, i) => {
              const isShelterDog = !!shelterWalkId && !!getShelterDogByName(shelterWalkId, dogName);
              return (
                <span key={dogName}>
                  {i > 0 && ", "}
                  {dogName}
                  {isShelterDog && (
                    <span className="text-info-strong font-semibold"> · shelter dog</span>
                  )}
                </span>
              );
            })}
          </span>
        )}
      </Link>
      {canAct && (
        <button
          type="button"
          onClick={() =>
            isMarked
              ? unmarkFamiliar(viewerId, userId)
              : markFamiliar(viewerId, userId)
          }
          className={`private-profile-row-pill${isMarked ? " is-marked" : ""}`}
          aria-pressed={isMarked}
          aria-label={
            isMarked ? `Remove Familiar from ${name}` : `Mark ${name} as Familiar`
          }
        >
          {isMarked ? "Familiar ✓" : "+ Familiar"}
        </button>
      )}
    </div>
  );
}
