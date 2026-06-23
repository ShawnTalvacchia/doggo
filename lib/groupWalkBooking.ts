import { getDisplayDate } from "@/lib/meetUtils";
import type { Booking, Meet, ShelterProfile, UserProfile } from "@/lib/types";

/**
 * buildGroupWalkBookingInput — the single source of truth for the Booking
 * created when someone signs up to walk a shelter dog ON a trainer-led group
 * walk (FC18, WS-G). Shared by the meet-page `GroupWalkSignupSheet` and the
 * mentor-sheet `MentorSessionBookingSheet` so the two entry points can't drift.
 *
 * A free volunteer walk (`ownerKind: "shelter"`, no charge) linked to the meet
 * occurrence via `dropoffMeetId` (config-#2 linkage) so it rides the existing
 * Sessions / Visit-Report rails and is captured for the advocacy loop.
 *
 * `subService` doubles as the mentored-vs-not marker: an un-vouched walker's
 * group walk is their "Mentored first walk" (counts toward the vouch — see
 * MentorSessionBookingSheet's committedSessions), a vouched walker's is a plain
 * "Group walk".
 *
 * Pricing: the SHELTER WALK is volunteer (free to the shelter), but a MENTORED
 * first walk is a paid mentor session — the mentee pays the host trainer their
 * per-session fee, exactly as in a 1-on-1; the group format just means several
 * mentees can pay at once (the trainer's incentive to run it). So an un-vouched
 * sign-up carries the mentor's fee; a vouched walker's plain group walk is free.
 */
export function buildGroupWalkBookingInput(params: {
  meet: Meet;
  shelter: ShelterProfile;
  user: UserProfile;
  dogName: string;
  isVouched: boolean;
  /** The host trainer's per-session fee + name. Applied when the sign-up is a
   *  mentored first walk (un-vouched). Omitted / vouched → a free volunteer walk. */
  mentorFee?: { amount: number; mentorName: string };
}): Omit<Booking, "id" | "signedAt"> {
  const { meet, shelter, user, dogName, isVouched, mentorFee } = params;
  const occurrenceDate = getDisplayDate(meet);
  const paidMentorship = !isVouched && !!mentorFee && mentorFee.amount > 0;
  return {
    conversationId: null,
    ownerKind: "shelter",
    ownerId: shelter.id,
    ownerName: shelter.name,
    ownerAvatarUrl: shelter.logoUrl,
    carerId: user.id,
    carerName: `${user.firstName} ${user.lastName}`.trim(),
    carerAvatarUrl: user.avatarUrl ?? "",
    type: "one_off",
    serviceType: "walks_checkins",
    subService: isVouched ? "Group walk" : "Mentored first walk",
    pets: [dogName],
    startDate: occurrenceDate,
    endDate: occurrenceDate,
    // Links the walk to the group-walk occurrence (config-#2 linkage).
    dropoffMeetId: meet.id,
    price: paidMentorship
      ? {
          lineItems: [
            {
              label: `Mentored walk · ${mentorFee!.mentorName}`,
              amount: mentorFee!.amount,
              unit: "per session",
            },
          ],
          total: mentorFee!.amount,
          currency: "Kč",
          billingCycle: "per_session",
        }
      : {
          lineItems: [{ label: `Volunteer walk · ${dogName}`, amount: 0, unit: "volunteer" }],
          total: 0,
          currency: "Kč",
          billingCycle: "total",
        },
    status: "upcoming",
    sessions: [{ id: `group-walk-${Date.now()}`, date: occurrenceDate, status: "upcoming" }],
  };
}
