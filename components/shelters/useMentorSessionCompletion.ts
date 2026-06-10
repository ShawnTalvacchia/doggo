"use client";

/**
 * useMentorSessionCompletion — shared handler for the "Complete mentor
 * session (demo)" hidden affordance (Cross-Shelter Mentor Network B4,
 * 2026-06-09). Used by the shelter action row AND the dog-page Walk
 * dropdown so the mentee's arc advances from wherever they are.
 *
 * One tap does three things:
 *  1. increments `mentorship.sessionsCompleted` on the application —
 *     the context auto-vouches at the shelter's minimum (accepting
 *     shelters only, D2);
 *  2. completes the earliest upcoming mentor Booking at this shelter
 *     (status + session + a short sealed report) so /bookings tells the
 *     same story;
 *  3. on graduation, lands the mentor's vouch message in the mentee's
 *     conversation — the payoff beat.
 */

import { useCallback } from "react";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import type { ShelterProfile } from "@/lib/types";

export function useMentorSessionCompletion(shelter: ShelterProfile | undefined) {
  const currentUserId = useCurrentUserId();
  const { getApplication, completeMentorSession } = useWalkerApplications();
  const { bookings, updateStatus, updateSession } = useBookings();
  const { getOrCreateDirectConversation, addMessage } = useConversations();
  const { markConnected } = useConnections();

  return useCallback(() => {
    if (!shelter || !currentUserId) return;
    const application = getApplication(currentUserId, shelter.id);
    if (!application?.mentorship) return;

    // A completed mentor session → mutual Connected (O1 follow-up,
    // 2026-06-10). Hours of supervised in-person dog handling is a
    // stronger trust event than the contract-sign that triggers
    // Connected on other paid flows — and with no sign step here, this
    // is the flow's Connected moment. Idempotent across sessions.
    markConnected(currentUserId, application.mentorship.mentorId);
    markConnected(application.mentorship.mentorId, currentUserId);

    const minimum = shelter.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;
    const graduates =
      shelter.policy.acceptsMentorVouches &&
      application.state !== "vouched" &&
      application.mentorship.sessionsCompleted + 1 >= minimum;

    completeMentorSession(currentUserId, shelter.id, {
      acceptsMentorVouches: shelter.policy.acceptsMentorVouches,
      minimum,
    });

    const upcoming = bookings
      .filter(
        (b) =>
          b.ownerId === currentUserId &&
          b.mentorSession?.shelterId === shelter.id &&
          b.status === "upcoming",
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    if (upcoming) {
      updateStatus(upcoming.id, "completed");
      const session = upcoming.sessions?.[0];
      if (session) {
        updateSession(upcoming.id, session.id, {
          status: "completed",
          report: {
            photos: [],
            notes: `Mentored walk at ${shelter.name} — handling basics, kennel routine, meet-and-greet protocol.`,
            completedAt: new Date().toISOString(),
          },
        });
      }
    }

    if (graduates) {
      const mentor = getUserById(application.mentorship.mentorId);
      if (mentor) {
        const convId = getOrCreateDirectConversation({
          id: mentor.id,
          name: `${mentor.firstName} ${mentor.lastName}`.trim(),
          avatarUrl: mentor.avatarUrl ?? "",
        });
        addMessage(convId, {
          id: `msg-${Date.now()}-graduation`,
          conversationId: convId,
          sender: "provider",
          type: "text",
          text: `That's ${minimum} sessions — I've vouched for you at ${shelter.name}. You can book solo walks with their dogs now. 🎉`,
          sentAt: new Date().toISOString(),
          read: false,
        });
      }
    }
  }, [
    shelter,
    currentUserId,
    getApplication,
    completeMentorSession,
    bookings,
    updateStatus,
    updateSession,
    getOrCreateDirectConversation,
    addMessage,
    markConnected,
  ]);
}
