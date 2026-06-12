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
 * The detail header's back arrow goes UP one level to the parent
 * booking (NOT browser-history back). Cross-app banner, Schedule
 * quick-start, and the slim "Active session" card on the parent's
 * Sessions tab all route directly here. Finish / Undo route OUT to
 * `/bookings/[id]?tab=sessions`.
 *
 * Page chrome: warning-25 surface tint + 4px left amber accent stripe
 * — mirrors the schedule card's live treatment. The page IS the active
 * surface; ActiveSessionPanel within renders content only (no card
 * chrome of its own).
 *
 * Sticky action footer — Finish + Undo are pinned to the bottom of the
 * scroll viewport via `position: sticky; bottom: 0` so the primary
 * action stays reachable while content scrolls.
 *
 * Stale-URL guard: if there's no in-progress session for this booking
 * (already finished, never started, cancelled), the page redirects
 * automatically to the parent so we don't show a broken empty state.
 *
 * 2026-05-08 walkthrough — promoted from a query-state branch on the
 * parent (`?view=active`) to a real sub-route, then refined to a
 * page-level frame + sticky footer.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";
import {
  ActiveSessionPanel,
  isActiveSessionEmpty,
} from "@/components/bookings/ActiveSessionPanel";
import { SessionsPetHeader } from "@/components/bookings/SessionsPetHeader";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { useBookings } from "@/contexts/BookingsContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import { getShelterDogByName } from "@/lib/mockShelters";
import { buildSessionCompletedNotification } from "@/lib/notificationBuilders";
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

  // Detail header — session-anchored title + back-up to parent.
  useEffect(() => {
    if (!booking) return;
    const petName = booking.pets[0] ?? null;
    const title = petName ? `${petName} · Live session` : "Live session";
    setDetailHeader(title, () =>
      router.push(`/bookings/${booking.id}?tab=sessions`),
    );
    return () => clearDetailHeader();
  }, [booking?.id, booking?.pets]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stale-URL guard — redirect to the parent if no in-progress session.
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
    return <PageColumn title="Live session"><div className="page-column-panel-body" /></PageColumn>;
  }

  const owner = getUserById(booking.ownerId);
  const petsForBooking = (owner?.pets ?? []).filter((p) =>
    booking.pets.includes(p.name),
  );

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
    // non-event.
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
    addNotification(buildSessionCompletedNotification(booking!, s));
    // Advocacy loop (Adoption-Curious Journey, 2026-06-12): finishing a
    // shelter walk lands on the DOG's page with a "Share a moment" prompt,
    // not the booking summary — the recap is what helps the dog find a
    // home, so the dog (not the paid-booking record) is the right next
    // surface. Paid-care walks keep the sessions-tab summary.
    if (booking!.ownerKind === "shelter") {
      const dog = getShelterDogByName(booking!.ownerId, booking!.pets[0] ?? "");
      if (dog) {
        router.push(`/dogs/${dog.id}?finished=1`);
        return;
      }
    }
    router.push(`/bookings/${booking!.id}?tab=sessions`);
  }

  function handleUndoStart(s: BookingSession) {
    updateSession(booking!.id, s.id, {
      status: "upcoming",
      checkedInAt: undefined,
    });
    router.push(`/bookings/${booking!.id}?tab=sessions`);
  }

  const showUndo = isProvider && isActiveSessionEmpty(activeSession);

  // Header title — "{petName} · Live session" carries who-this-is-for
  // alongside session state. Same shape as the mobile AppNav header
  // (set via setDetailHeader above). Back goes UP one level to the
  // parent's Sessions tab (NOT browser-history back) — same hierarchy
  // pattern as `/bookings/[id]` → `/bookings`.
  const petName = booking.pets[0] ?? null;
  const headerTitle = petName ? `${petName} · Live session` : "Live session";

  return (
    <PageColumn
      hideHeader
      abovePanel={
        <DetailHeader
          backHref={`/bookings/${booking.id}?tab=sessions`}
          title={headerTitle}
        />
      }
    >
      <div className="page-column-panel-body">
        {/* Page-level frame — the warning-25 tint + 4px left amber
            accent stripe make THIS PAGE the active element (mirrors
            schedule card live treatment). min-height 100% so the
            accent extends full viewport height even when content is
            short. ActiveSessionPanel within renders content only —
            no card chrome of its own. */}
        <div className="active-session-frame">
          <div className="active-session-frame-content">
            {petsForBooking.length > 0 && (
              <SessionsPetHeader pets={petsForBooking} />
            )}
            <ActiveSessionPanel
              session={activeSession}
              // serviceType is always defined here — a Meet-service booking
              // has no BookingSession / active-session lifecycle.
              serviceType={booking.serviceType!}
              isProvider={isProvider}
              onUpdateReport={handleUpdateReport}
            />
          </div>

          {/* Sticky action footer — provider's primary action. Pinned
              to the bottom of the scroll viewport via position: sticky
              so it's always reachable. Owner side has no actions, so
              the footer only renders for the provider. */}
          {isProvider && (
            <div className="active-session-action-footer">
              <ButtonAction
                variant="primary"
                size="md"
                leftIcon={<CheckCircle size={16} weight="fill" />}
                onClick={() => handleFinish(activeSession)}
                className="w-full"
              >
                Finish session
              </ButtonAction>
              {showUndo && (
                <button
                  type="button"
                  onClick={() => handleUndoStart(activeSession)}
                  className="w-full text-center text-xs text-fg-tertiary underline underline-offset-2 cursor-pointer hover:text-fg-secondary transition-colors"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "var(--space-xs) 0",
                  }}
                >
                  Started by accident? Undo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageColumn>
  );
}
