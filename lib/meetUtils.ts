import type { Meet } from "@/lib/types";
import type { MeetRole } from "@/components/meets/CardMeet";

/**
 * Determine the current user's role in a meet.
 */
export function getMeetRole(meet: Meet, userId: string): MeetRole {
  if (meet.creatorId === userId) return "hosting";
  const attendee = meet.attendees.find((a) => a.userId === userId);
  if (attendee?.rsvpStatus === "interested") return "interested";
  return "joining";
}
