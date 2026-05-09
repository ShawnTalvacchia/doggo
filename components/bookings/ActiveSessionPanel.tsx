"use client";

/**
 * ActiveSessionPanel — content body of the active session sub-page.
 *
 * Renders the session-state strip + provider composition affordances
 * (photos, notes, GPS) OR owner-side calm "session in progress" view.
 *
 * **No outer card chrome** — the active sub-page provides the page-level
 * frame (warning-25 surface + left amber accent stripe). This component
 * is content only.
 *
 * **No action footer** — Finish session + Undo Start are rendered as a
 * sticky footer at the page level so they're always reachable while
 * the content scrolls. Provider clicks Finish on the sub-page wrapper,
 * not in here.
 *
 * Sessions & Service Execution A3, 2026-05-05; refactored to
 * content-only + lifted action footer 2026-05-08 alongside the
 * sub-route promotion.
 */

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle,
  MapPin,
  NotePencil,
  X,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { BookingSession, ServiceType, VisitReport } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";

export function ActiveSessionPanel({
  session,
  serviceType,
  isProvider,
  onUpdateReport,
}: {
  session: BookingSession;
  serviceType: ServiceType;
  isProvider: boolean;
  /** Apply a partial update to the session's report. Lazy-creates the
   *  report object on first edit so callers don't have to manage
   *  null-vs-existing branching. */
  onUpdateReport: (session: BookingSession, partial: Partial<VisitReport>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notesOpen, setNotesOpen] = useState<boolean>(
    !!session.report?.notes && session.report.notes.length > 0,
  );
  // Per-minute tick to refresh the GPS-sim readout (km / min).
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const startedAt = session.checkedInAt
    ? new Date(session.checkedInAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const photos = session.report?.photos ?? [];
  const latestPhoto = photos[photos.length - 1] ?? null;
  const notes = session.report?.notes ?? "";
  const gpsStartedAt = session.report?.gpsStartedAt;
  const isWalk = serviceType === "walk_checkin";
  const hasRecordedWalkMetrics = !!(
    session.report?.walkDistanceKm || session.report?.walkDurationMin
  );

  const gpsElapsedMin = gpsStartedAt
    ? Math.max(0, Math.floor((now - new Date(gpsStartedAt).getTime()) / 60_000))
    : 0;
  const gpsDistanceKm = gpsStartedAt
    ? Math.round(gpsElapsedMin * 0.06 * 10) / 10
    : 0;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateReport(session, { photos: [...photos, reader.result] });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function toggleGps() {
    if (gpsStartedAt) {
      // Stop tracking — only seal metrics if ≥1 min tracked.
      if (gpsElapsedMin > 0) {
        onUpdateReport(session, {
          gpsStartedAt: undefined,
          walkDistanceKm: gpsDistanceKm,
          walkDurationMin: gpsElapsedMin,
        });
      } else {
        onUpdateReport(session, { gpsStartedAt: undefined });
      }
    } else {
      onUpdateReport(session, { gpsStartedAt: new Date().toISOString() });
    }
  }

  return (
    // Outer xl gap separates the Live strip from the action group below
    // (mirrors the airy rhythm between pet hero / name+meta / live strip
    // at the page level). Inside the action group, gap shrinks to md so
    // photo / note / GPS sit close together rather than scattering down
    // the page. 2026-05-08 walkthrough.
    <div className="flex flex-col gap-xl">
      {/* Session-state strip — Live pill + when-it-started + date.
          Flat row, no container — the page chrome already provides
          "this is active" context; double-containerizing reads as
          redundant. */}
      <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
        <span
          className="inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
          style={{
            background: "var(--status-warning-main)",
            color: "var(--warning-850)",
            ["--live-pulse-color" as string]: "var(--warning-850)",
            ["--live-pulse-size" as string]: "8px",
          } as React.CSSProperties}
        >
          <span className="live-pulse-dot" role="img" aria-label="Live" />
          Live
        </span>
        {startedAt && (
          <span className="text-sm text-fg-secondary whitespace-nowrap">started {startedAt}</span>
        )}
        <span className="text-sm text-fg-tertiary whitespace-nowrap ml-auto">
          {formatShortDate(session.date)}
        </span>
      </div>

      {/* Owner side — calm reassurance, no composition affordances. */}
      {!isProvider && (
        <>
          {latestPhoto && (
            <div
              className="relative overflow-hidden rounded-md bg-surface-inset"
              style={{ aspectRatio: "16 / 9", maxHeight: 200 }}
            >
              <img src={latestPhoto} alt="" className="w-full h-full object-cover" />
              {photos.length > 1 && (
                <span
                  className="absolute bottom-1 right-1 inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
                  style={{ background: "var(--transparent-dark-64)", color: "white" }}
                >
                  {photos.length} photos
                </span>
              )}
            </div>
          )}
          {gpsStartedAt && (
            <div
              className="inline-flex items-center gap-xs self-start px-sm py-xs text-sm rounded-pill"
              style={{ background: "var(--surface-top)", color: "var(--text-secondary)" }}
            >
              <MapPin size={14} weight="fill" />
              On the move · {gpsDistanceKm} km · {gpsElapsedMin} min
            </div>
          )}
          <p className="text-sm text-fg-secondary m-0">
            {latestPhoto
              ? "The session is in progress. You'll get the full visit report when it wraps up."
              : "The session is in progress. You'll get a visit report when it wraps up."}
          </p>
        </>
      )}

      {/* Provider side — full composition. Wrapped in its own flex
          column with a tighter gap-md so the action stack reads as a
          coherent group separated from the Live strip above (which has
          the parent's airy gap-xl). */}
      {isProvider && (
        <div className="flex flex-col gap-md">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          {/* Photo grid — locked at 320px tall regardless of count so
              the section doesn't jump in height as photos are added.
              1 photo → full-width × 320, 2+ → 240×320 horizontally
              scrollable. Each tile shows an X-on-hover button to
              remove (touch devices show it always via @media). Custom
              over PostPhotoGrid because the active-session use case
              wants stable height + remove affordance — posts don't.
              2026-05-08 walkthrough. */}
          {photos.length > 0 && (
            <div
              className={`active-session-photo-grid${
                photos.length === 1 ? " active-session-photo-grid--single" : ""
              }`}
            >
              {photos.map((url, i) => (
                <div key={i} className="active-session-photo-grid-item">
                  <img
                    src={url}
                    alt=""
                    className="active-session-photo-grid-img"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateReport(session, {
                        photos: photos.filter((_, idx) => idx !== i),
                      })
                    }
                    className="active-session-photo-remove"
                    aria-label="Remove photo"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dashed-border photo tile — two states.
              No photos: 320px-tall vertical tile (strong visual nudge,
                fills the same vertical real estate the photos would).
              With photos: collapses to a btn-md-height row with icon
                on the left ("Add another photo"); the photo grid
                above carries the visual weight at 240–320px tall.
              2026-05-08 walkthrough. */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`active-session-add-photo-tile${
              photos.length > 0 ? " active-session-add-photo-tile--compact" : ""
            }`}
          >
            <Camera size={photos.length > 0 ? 16 : 24} weight="light" />
            <span>
              {photos.length === 0 ? "Add a photo" : "Add another photo"}
            </span>
          </button>

          {/* GPS state row — three states share the same slot:
              tracking active, tracking stopped + recorded, idle (button
              renders separately below). */}
          {isWalk && gpsStartedAt && (
            <div
              className="flex items-center gap-sm rounded-panel"
              style={{
                padding: "var(--space-md)",
                background: "var(--warning-25)",
                border: "1px solid var(--warning-100)",
              }}
            >
              <MapPin size={16} weight="fill" style={{ color: "var(--status-warning-strong)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--warning-850)" }}>
                Tracking route
              </span>
              <span className="text-sm" style={{ color: "var(--warning-850)" }}>
                · {gpsDistanceKm} km · {gpsElapsedMin} min
              </span>
              <span className="flex-1" />
              <button
                type="button"
                onClick={toggleGps}
                className="text-xs font-semibold uppercase tracking-wide cursor-pointer rounded-pill transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "var(--space-xs) var(--space-sm)",
                  color: "var(--warning-850)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--warning-100)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Stop
              </button>
            </div>
          )}
          {isWalk && !gpsStartedAt && hasRecordedWalkMetrics && (
            <div
              className="flex items-center gap-sm rounded-panel"
              style={{
                padding: "var(--space-md)",
                background: "var(--success-25)",
                border: "1px solid var(--success-100)",
              }}
            >
              <CheckCircle size={16} weight="fill" style={{ color: "var(--status-success-strong)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--success-850)" }}>
                Walk recorded
              </span>
              <span className="text-sm" style={{ color: "var(--success-850)" }}>
                · {session.report?.walkDistanceKm ?? 0} km · {session.report?.walkDurationMin ?? 0} min
              </span>
            </div>
          )}

          {/* Add a note — full-width on its own. */}
          {!notesOpen && (
            <ButtonAction
              variant="soft"
              size="md"
              leftIcon={<NotePencil size={16} weight="light" />}
              onClick={() => setNotesOpen(true)}
              className="w-full"
            >
              Add a note
            </ButtonAction>
          )}

          {/* GPS log button — only when applicable + idle. */}
          {isWalk && !gpsStartedAt && !hasRecordedWalkMetrics && (
            <ButtonAction
              variant="soft"
              size="md"
              leftIcon={<MapPin size={16} weight="light" />}
              onClick={toggleGps}
              className="w-full"
            >
              Log route with GPS
            </ButtonAction>
          )}

          {notesOpen && (
            <div className="input-block">
              <label className="label" htmlFor="active-session-notes">
                <span className="label-primary-group">
                  <span>Notes</span>
                </span>
              </label>
              <textarea
                id="active-session-notes"
                className="textarea"
                placeholder="Anything the owner should know."
                value={notes}
                onChange={(e) => onUpdateReport(session, { notes: e.target.value })}
                rows={3}
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Whether the session has no provider-composed content yet. Used by
 *  callers (the active sub-page) to decide whether to surface the
 *  "Started by accident? Undo" link in the sticky action footer. */
export function isActiveSessionEmpty(session: BookingSession): boolean {
  const photos = session.report?.photos ?? [];
  const notes = session.report?.notes ?? "";
  const gpsStartedAt = session.report?.gpsStartedAt;
  return (
    photos.length === 0 &&
    notes.trim().length === 0 &&
    !gpsStartedAt
  );
}
