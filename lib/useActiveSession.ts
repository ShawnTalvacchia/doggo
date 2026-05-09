"use client";

/**
 * useActiveSession — derive the first in-progress session involving the
 * viewer, plus presentation-ready strings (service-aware copy, elapsed
 * timer, pet thumbnail).
 *
 * Shared between `ActiveSessionBanner` (mobile floating banner) and
 * `SidebarActiveSessionLink` (desktop sidebar item). Both surfaces show
 * the same data; only chrome differs. Sessions & Service Execution A3,
 * 2026-05-05.
 */

import { useEffect, useState } from "react";
import { useBookings } from "@/contexts/BookingsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import type { Booking, BookingSession, ServiceType } from "@/lib/types";

export interface ActiveSessionInfo {
  booking: Booking;
  session: BookingSession;
  isProvider: boolean;
  /** Service-aware status copy. Provider sees the action verb ("Walking
   *  Bára"), owner sees the dog-centered framing ("Bára is on a walk"). */
  copy: string;
  /** Elapsed time as "NN min" / "Hh Mm". null when service doesn't
   *  warrant a timer (boarding / sitting). */
  elapsed: string | null;
  /** Pet image URL (null when not resolvable from the dog lookup). */
  petImage: string | null;
  /** Route the surface should link to. */
  href: string;
}

function formatElapsed(checkedInAt: string | undefined, now: number): string | null {
  if (!checkedInAt) return null;
  const startMs = new Date(checkedInAt).getTime();
  const elapsedMin = Math.max(0, Math.floor((now - startMs) / 60000));
  if (elapsedMin < 60) return `${elapsedMin} min`;
  const h = Math.floor(elapsedMin / 60);
  const m = elapsedMin % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function copyFor(
  booking: Booking,
  isProvider: boolean,
  petText: string,
  providerFirst: string,
): string {
  if (booking.serviceType === "walk_checkin") {
    return isProvider ? `Walking ${petText}` : `${petText} is on a walk`;
  }
  if (booking.serviceType === "boarding") {
    return isProvider ? `Hosting ${petText}` : `${petText} is at ${providerFirst}'s`;
  }
  // inhome_sitting
  return isProvider ? `Sitting ${petText}` : `${petText} is with ${providerFirst}`;
}

function showsTimer(serviceType: ServiceType): boolean {
  // Walks have a contract-defined duration (30/45/60 min); a stopwatch
  // is meaningful. Sitting and boarding last hours-to-days; a stopwatch
  // reads as anxiety, not status.
  return serviceType === "walk_checkin";
}

export function useActiveSession(): ActiveSessionInfo | null {
  const { bookings } = useBookings();
  const currentUser = useCurrentUserId();
  // Tick once per minute so the elapsed timer updates without a router
  // round-trip. The hook re-renders any subscribed component on each tick.
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  let active: { booking: Booking; session: BookingSession; isProvider: boolean } | null = null;
  for (const b of bookings) {
    const isProvider = b.carerId === currentUser;
    const isOwner = b.ownerId === currentUser;
    if (!isProvider && !isOwner) continue;
    const inProgress = (b.sessions ?? []).find((s) => s.status === "in_progress");
    if (inProgress) {
      active = { booking: b, session: inProgress, isProvider };
      break;
    }
  }

  if (!active) return null;

  const { booking, session, isProvider } = active;
  const petText = booking.pets[0] ?? "your dog";
  const providerFirst = (isProvider ? booking.ownerName : booking.carerName).split(" ")[0];
  const elapsed = showsTimer(booking.serviceType) ? formatElapsed(session.checkedInAt, now) : null;
  const copy = copyFor(booking, isProvider, petText, providerFirst);

  const owner = getUserById(booking.ownerId);
  const pet = owner?.pets.find(
    (p) => p.name.toLowerCase() === (booking.pets[0] ?? "").toLowerCase(),
  );
  const petImage = pet?.imageUrl ?? null;

  return {
    booking,
    session,
    isProvider,
    copy,
    elapsed,
    petImage,
    // Cross-app banner taps route directly to the focused
    // active-session sub-page. Same surface the slim "Active session"
    // card on the parent's Sessions tab links into. 2026-05-08.
    href: `/bookings/${booking.id}/active`,
  };
}
