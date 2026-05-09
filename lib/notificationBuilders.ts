import type { Booking, ServiceType } from "@/lib/types";
import type { NewNotification } from "@/contexts/NotificationsContext";

/** Service-aware action phrases, lower-case so they slot into a sentence
 *  starting with the carer's name (`Klára started Bára's walk`). Adding
 *  Appointment-type later means extending this switch — keeping the helper
 *  here so notification copy lives in one place. */
function actionPhrases(
  serviceType: ServiceType,
  petName: string,
): { started: string; finished: string } {
  switch (serviceType) {
    case "walk_checkin":
      return {
        started: `started ${petName}'s walk`,
        finished: `finished ${petName}'s walk`,
      };
    case "inhome_sitting":
      return {
        started: `started sitting with ${petName}`,
        finished: `finished sitting with ${petName}`,
      };
    case "boarding":
      return {
        started: `started ${petName}'s boarding stay`,
        finished: `finished ${petName}'s boarding stay`,
      };
  }
}

/** Multi-pet booking treatment is deferred (Open Q §4). For now the
 *  single-pet canonical case names the pet directly; multi-pet uses
 *  `Bára +N` as a temporary tail until the pattern lands properly. */
function petLabel(booking: Booking): string {
  const pets = booking.pets;
  if (pets.length === 0) return "your dog";
  if (pets.length === 1) return pets[0];
  return `${pets[0]} +${pets.length - 1}`;
}

/** Owner-facing notification — fired when the carer flips a session from
 *  upcoming → in_progress. Recipient is the booking's owner: the carer
 *  triggered the event, the owner is the audience. Without the explicit
 *  recipient field the carer would also see "{carer} started Bára's
 *  walk" in their own bell, which makes no sense. */
export function buildSessionStartedNotification(booking: Booking): NewNotification {
  const { started } = actionPhrases(booking.serviceType, petLabel(booking));
  return {
    type: "session_started",
    recipientId: booking.ownerId,
    title: `${booking.carerName} ${started}`,
    body: "Tap to follow along — see photos and updates as they come in.",
    avatarUrl: booking.carerAvatarUrl,
    href: `/bookings/${booking.id}?tab=sessions`,
  };
}

/** Owner-facing notification — fired when the carer seals the visit
 *  report (in_progress → completed). Body carries the review prompt;
 *  href routes to Sessions tab where the report renders inline (G3 adds
 *  the inline Leave-a-review CTA). */
export function buildSessionCompletedNotification(booking: Booking): NewNotification {
  const { finished } = actionPhrases(booking.serviceType, petLabel(booking));
  return {
    type: "session_completed",
    recipientId: booking.ownerId,
    title: `${booking.carerName} ${finished}`,
    body: "Tap to view the visit report and leave a review.",
    avatarUrl: booking.carerAvatarUrl,
    href: `/bookings/${booking.id}?tab=sessions`,
  };
}
