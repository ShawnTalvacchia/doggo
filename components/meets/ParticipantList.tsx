"use client";

import { Users } from "@phosphor-icons/react";
import { PersonRow } from "@/components/people/PersonRow";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { getAttendeeTier } from "@/lib/meetUtils";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { ConnectionState, MeetAttendee } from "@/lib/types";

interface ParticipantListProps {
  attendees: MeetAttendee[];
  /** Current user ID. If omitted, resolved from CurrentUserContext. */
  currentUserId?: string;
  /** Whether this meet is completed (affects display) */
  isCompleted?: boolean;
}

interface TieredAttendee extends MeetAttendee {
  tier: 1 | 2 | 3;
  connectionState: ConnectionState;
  theyMarkedFamiliar?: boolean;
  isCareProvider: boolean;
}

/**
 * Tiered participant list — sorts attendees by relationship proximity and renders
 * each via the canonical `PersonRow`.
 *
 *   Tier 1: Connected (full cards, current user pinned to top)
 *   Tier 2: Familiar (either direction), Pending, Open profiles (full cards)
 *   Tier 3: Locked + None (collapsed into "+ N other attendees" footer)
 *
 * Tier classification is delegated to `getAttendeeTier` (`lib/meetUtils.ts`) — the
 * canonical implementation that also drives the meet detail summary card. Don't
 * reimplement tier rules here.
 */
export function ParticipantList({
  attendees,
  currentUserId,
  isCompleted = false,
}: ParticipantListProps) {
  // Fall back to the active persona when caller doesn't pass an explicit ID.
  const hookUserId = useCurrentUserId();
  const viewerId = currentUserId ?? hookUserId;
  const communityCarerIds = new Set(getCommunityCarers(viewerId).map((c) => c.userId));

  const tiered: TieredAttendee[] = attendees.map((a) => {
    if (a.userId === viewerId) {
      return {
        ...a,
        tier: 1 as const,
        connectionState: "connected" as const,
        isCareProvider: false,
      };
    }

    const conn = getConnectionState(a.userId, viewerId);
    const state = conn?.state ?? "none";
    const theyMarkedFamiliar = conn?.theyMarkedFamiliar;
    const isCareProvider = communityCarerIds.has(a.userId);
    const tier = getAttendeeTier(a, viewerId);

    return {
      ...a,
      tier,
      connectionState: state,
      theyMarkedFamiliar,
      isCareProvider,
    };
  });

  // Visible: tier 1 + 2, current user pinned to top of tier 1.
  const visible = tiered
    .filter((a) => a.tier <= 2)
    .sort((a, b) => {
      if (a.userId === viewerId) return -1;
      if (b.userId === viewerId) return 1;
      if (a.tier !== b.tier) return a.tier - b.tier;
      return 0;
    });

  const hidden = tiered.filter((a) => a.tier === 3);

  const goingVisible = visible.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedVisible = visible.filter((a) => a.rsvpStatus === "interested");
  const goingHidden = hidden.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedHidden = hidden.filter((a) => a.rsvpStatus === "interested");

  const totalHidden = goingHidden.length + interestedHidden.length;

  return (
    <section className="flex flex-col gap-md">
      {/* Going section */}
      <h2 className="font-heading text-lg font-semibold text-fg-primary">
        {isCompleted ? "Who attended" : "Who’s going"} ({goingVisible.length + goingHidden.length})
      </h2>

      <div className="flex flex-col gap-sm">
        {goingVisible.map((a) => (
          <PersonRow
            key={a.userId}
            variant="meet-attendee"
            userId={a.userId}
            name={a.userName}
            avatarUrl={a.avatarUrl}
            isSelf={a.userId === viewerId}
            pets={(a.dogNames ?? []).map((name) => ({ name, breed: a.dogBreed }))}
            connectionState={a.connectionState}
            theyMarkedFamiliar={a.theyMarkedFamiliar}
            profileOpen={a.profileOpen}
            isCareProvider={a.isCareProvider}
          />
        ))}
      </div>

      {/* Interested section */}
      {interestedVisible.length + interestedHidden.length > 0 && (
        <>
          <h3 className="font-heading text-base font-semibold text-fg-secondary mt-sm">
            Interested ({interestedVisible.length + interestedHidden.length})
          </h3>
          <div className="flex flex-col gap-sm">
            {interestedVisible.map((a) => (
              <PersonRow
                key={a.userId}
                variant="meet-attendee"
                userId={a.userId}
                name={a.userName}
                avatarUrl={a.avatarUrl}
                isSelf={a.userId === viewerId}
                pets={(a.dogNames ?? []).map((name) => ({ name, breed: a.dogBreed }))}
                connectionState={a.connectionState}
                theyMarkedFamiliar={a.theyMarkedFamiliar}
                profileOpen={a.profileOpen}
                isCareProvider={a.isCareProvider}
              />
            ))}
          </div>
        </>
      )}

      {/* Hidden attendees count */}
      {totalHidden > 0 && (
        <div className="flex items-center gap-sm rounded-panel p-md bg-surface-inset text-fg-tertiary">
          <Users size={18} weight="light" />
          <span className="text-sm">
            {totalHidden} other {totalHidden === 1 ? "attendee" : "attendees"}
          </span>
        </div>
      )}
    </section>
  );
}
