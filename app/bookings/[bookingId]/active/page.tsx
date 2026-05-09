"use client";

/**
 * Active session sub-page — `/bookings/[bookingId]/active`.
 *
 * A focused, full-bleed surface for the in-progress care session. Sits
 * one level deeper than the booking detail (`/bookings/[id]`):
 *
 *   /bookings           ← list
 *   /bookings/[id]      ← detail (Info / Sessions tabs)
 *   /bookings/[id]/active  ← THIS PAGE (no tabs; pet hero + ActivePanel)
 *
 * The detail header's back arrow goes UP one level to the parent booking
 * (NOT browser-history back). Cross-app banner / Schedule quick-start /
 * the slim "Active session" card on the parent's Sessions tab all route
 * directly here. Active panel's Finish / Undo route OUT to
 * `/bookings/[id]?tab=sessions`.
 *
 * Stale-URL guard: if there's no in-progress session for this booking
 * (already finished, never started, cancelled), the page redirects
 * automatically to the parent so we don't show a broken empty state.
 *
 * 2026-05-08 walkthrough — promoted from a query-state branch on the
 * parent (`?view=active`) to a real sub-route.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActiveSessionPanel } from "@/components/bookings/ActiveSessionPanel";
import { SessionsPetHeader } from "@/components/bookings/SessionsPetHeader";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { useBookings } from "@/contexts/BookingsContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import {
  buildSessionStartedNotification,
  buildSessionCompletedNotification,
} from "@/lib/notificationBuilders";
import type { BookingSession } from "@/lib/types";

export default function ActiveSessionPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { bookings, updateSession } = useBookings();
  const { addNotification } = useNotifications();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const CURRENT_USER = useCurrentUserId();

  const booking = bookings.find((b) => b.id === bookingId);
  const isProvider = booking?.carerId === CURRENT_USER;
  const activeSession = (booking?.sessions ?? []).find(
    (s) => s.status === "in_progress",
  );

  // Detail header: session-anchored title + back-up to the booking's
  // Sessions tab (NOT browser-history back). Up-a-level navigation is
  // the standard sub-page pattern (iOS / Android).
  useEffect(() => {
    if (!booking) return;
    const petName = booking.pets[0] ?? null;
    const title = petName ? `${petName} · Live session` : "Live session";
    setDetailHeader(title, () =>
      router.push(`/bookings/${booking.id}?tab=sessions`),
    );
    return () => clearDetailHeader();
  }, [booking?.id, booking?.pets]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stale-URL guard. If the user navigated here but there's no
  // in-progress session (already finished, never started, cancelled),
  // redirect to the parent so we don't render a broken empty state.
  useEffect(() => {
    if (!booking) return;
    const stillActive =
      booking.status !== "cancelled" && !!activeSession;
    if (!stillActive) {
      router.replace(`/bookings/${booking.id}?tab=sessions`);
    }
  }, [booking?.id, booking?.status, activeSession?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!booking) {
    return (
      <PageColumn title="Live session">
        <div className="page-column-panel-body">
          <div className="flex flex-col items-center gap-md p-xl text-center">
            <p className="text-fg-secondary m-0">Booking not found.</p>
          </div>
        </div>
      </PageColumn>
    );
  }
  if (!activeSession || booking.status === "cancelled") {
    // Render nothing while the redirect kicks in to avoid flashing an
    // empty hero. The redirect effect above handles the navigation.
    return <PageColumn title="Live session"><div className="page-column-panel-body" /></PageColumn>;
  }

  // Pet profiles for the hero — pulled from the owner's user profile.
  const owner = getUserById(booking.ownerId);
  const petsForBooking = (owner?.pets ?? []).filter((p) =>
    booking.pets.includes(p.name),
  );

  // Handlers — funnels through to BookingsContext.updateSession with
  // the same logic as the parent booking-detail page (notification fire
  // on completed → upserts the session_started entry; route OUT on
  // Finish / Undo so the user lands on the chronicle view).
  function handleUpdateReport(
    s: BookingSession,
    partial: Partial<NonNullable<BookingSession["report"]>>,
  ) {
    updateSession(booking!.id, s.id, {
      report: {
        photos: s.report?.photos ?? [],
        ...s.report,
        ...partial,
      },
    });
  }

  function handleFinish(s: BookingSession) {
    // Single-tap seal. If GPS is tracking, auto-stop + simulate the
    // metrics so the report carries them. Sub-minute tracking is a
    // non-event (skip the seal so we don't print "0 km · 0 min").
    const existingReport = s.report ?? { photos: [] };
    let walkDistanceKm = existingReport.walkDistanceKm;
    let walkDurationMin = existingReport.walkDurationMin;
    if (existingReport.gpsStartedAt) {
      const elapsedMin = Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(existingReport.gpsStartedAt).getTime()) / 60_000,
        ),
      );
      if (elapsedMin > 0) {
        walkDistanceKm = Math.round(elapsedMin * 0.06 * 10) / 10;
        walkDurationMin = elapsedMin;
      }
    }
    updateSession(booking!.id, s.id, {
      status: "completed",
      report: {
        ...existingReport,
        ...(walkDistanceKm !== undefined ? { walkDistanceKm } : {}),
        ...(walkDurationMin !== undefined ? { walkDurationMin } : {}),
        gpsStartedAt: undefined,
        completedAt: new Date().toISOString(),
      },
    });
    // Owner-facing notification — same deterministic id as the
    // session_started fire so the bell shows one evolving row, not
    // two duplicates.
    addNotification(buildSessionCompletedNotification(booking!, s));
    // Route OUT to the booking's Sessions tab. The chronicle view
    // shows the just-completed session at the top of the past list.
    router.push(`/bookings/${booking!.id}?tab=sessions`);
  }

  function handleUndoStart(s: BookingSession) {
    updateSession(booking!.id, s.id, {
      status: "upcoming",
      checkedInAt: undefined,
    });
    router.push(`/bookings/${booking!.id}?tab=sessions`);
  }

  return (
    <PageColumn title="Live session">
      <div
        className="page-column-panel-body flex flex-col gap-lg"
        style={{ padding: "var(--space-lg)" }}
      >
        {petsForBooking.length > 0 && (
          <SessionsPetHeader pets={petsForBooking} />
        )}
        <ActiveSessionPanel
          session={activeSession}
          serviceType={booking.serviceType}
          isProvider={isProvider}
          onUpdateReport={handleUpdateReport}
          onFinish={handleFinish}
          onUndoStart={handleUndoStart}
        />
        <Spacer />
      </div>
    </PageColumn>
  );
}
