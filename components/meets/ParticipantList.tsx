"use client";

import { Users } from "@phosphor-icons/react";
import { ParticipantCard } from "./ParticipantCard";
import { getConnectionState } from "@/lib/mockConnections";
import { getRelationshipSignals } from "@/lib/relationshipContext";
import { getCommunityCarers } from "@/lib/mockConnections";
import type { MeetAttendee, RsvpStatus } from "@/lib/types";

interface ParticipantListProps {
  attendees: MeetAttendee[];
  /** Current user ID */
  currentUserId?: string;
  /** Whether this meet is completed (affects display) */
  isCompleted?: boolean;
}

interface TieredAttendee extends MeetAttendee {
  tier: 1 | 2 | 3;
  connectionState: "none" | "familiar" | "pending" | "connected";
  theyMarkedFamiliar?: boolean;
  signals: string[];
  isCareProvider: boolean;
}

/**
 * Tiered participant list — sorts attendees by relationship proximity:
 *
 * Tier 1: Connected users (full cards with context)
 * Tier 2: Familiar / Open profiles (actionable cards)
 * Tier 3: Locked + None (collapsed count)
 */
export function ParticipantList({
  attendees,
  currentUserId = "shawn",
  isCompleted = false,
}: ParticipantListProps) {
  const communityCarerIds = new Set(getCommunityCarers().map((c) => c.userId));

  // Classify each attendee into tiers
  const tiered: TieredAttendee[] = attendees.map((a) => {
    if (a.userId === currentUserId) {
      return {
        ...a,
        tier: 1 as const,
        connectionState: "connected" as const,
        signals: [],
        isCareProvider: false,
      };
    }

    const conn = getConnectionState(a.userId);
    const state = conn?.state ?? "none";
    const signals = conn ? getRelationshipSignals(conn) : [];
    const isCareProvider = communityCarerIds.has(a.userId);
    const isOpen = a.profileOpen ?? conn?.profileOpen ?? false;
    const theyMarkedFamiliar = conn?.theyMarkedFamiliar;

    let tier: 1 | 2 | 3;
    if (state === "connected") {
      tier = 1;
    } else if (state === "familiar" || state === "pending" || isOpen) {
      tier = 2;
    } else {
      tier = 3;
    }

    return {
      ...a,
      tier,
      connectionState: state,
      theyMarkedFamiliar,
      signals,
      isCareProvider,
    };
  });

  // Sort: tier 1 first, then tier 2, current user at top of tier 1
  const visible = tiered
    .filter((a) => a.tier <= 2)
    .sort((a, b) => {
      if (a.userId === currentUserId) return -1;
      if (b.userId === currentUserId) return 1;
      if (a.tier !== b.tier) return a.tier - b.tier;
      return 0;
    });

  const hidden = tiered.filter((a) => a.tier === 3);

  // Split visible into going and interested
  const goingVisible = visible.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedVisible = visible.filter((a) => a.rsvpStatus === "interested");
  const goingHidden = hidden.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedHidden = hidden.filter((a) => a.rsvpStatus === "interested");

  const totalHidden = goingHidden.length + interestedHidden.length;

  return (
    <section className="flex flex-col gap-md">
      {/* Going section */}
      <h2 className="font-heading text-lg font-semibold text-fg-primary">
        {isCompleted ? "Who attended" : "Who\u2019s going"} ({goingVisible.length + goingHidden.length})
      </h2>

      <div className="flex flex-col gap-sm">
        {goingVisible.map((a) => (
          <ParticipantCard
            key={a.userId}
            userId={a.userId}
            userName={a.userName}
            avatarUrl={a.avatarUrl}
            dogNames={a.dogNames}
            dogBreed={a.dogBreed}
            neighbourhood={a.neighbourhood}
            connectionState={a.connectionState}
            theyMarkedFamiliar={a.theyMarkedFamiliar}
            profileOpen={a.profileOpen}
            signals={a.signals}
            isYou={a.userId === currentUserId}
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
              <ParticipantCard
                key={a.userId}
                userId={a.userId}
                userName={a.userName}
                avatarUrl={a.avatarUrl}
                dogNames={a.dogNames}
                dogBreed={a.dogBreed}
                neighbourhood={a.neighbourhood}
                connectionState={a.connectionState}
                theyMarkedFamiliar={a.theyMarkedFamiliar}
                profileOpen={a.profileOpen}
                signals={a.signals}
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
