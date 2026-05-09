"use client";

/**
 * ActiveSessionPanel — the engagement surface for an in-progress care
 * session. Provider gets composition affordances (notes, photos, GPS
 * stub on walks, single-tap Finish, Undo on empty start). Owner gets a
 * calmer "we'll send a report when it wraps up" view with the latest
 * mid-session photo + GPS readout.
 *
 * Lives as a shared component since 2026-05-08 — used by both the
 * (now-historical) inline render on the booking-detail Sessions tab AND
 * the focused active-session sub-route at `/bookings/[id]/active`.
 *
 * Sessions & Service Execution A3, 2026-05-05; extracted 2026-05-08.
 */

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  NotePencil,
  Ruler,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { BookingSession, ServiceType, VisitReport } from "@/lib/types";
import { formatShortDate } from "@/lib/dateUtils";

export function ActiveSessionPanel({
  session,
  serviceType,
  isProvider,
  onUpdateReport,
  onFinish,
  onUndoStart,
}: {
  session: BookingSession;
  serviceType: ServiceType;
  isProvider: boolean;
  /** Apply a partial update to the session's report. Lazy-creates the
   *  report object on first edit so callers don't have to manage
   *  null-vs-existing branching. */
  onUpdateReport: (session: BookingSession, partial: Partial<VisitReport>) => void;
  /** Seal the visit report and flip status to completed. Single-tap
   *  Finish — no preview modal. GPS auto-stops on Finish (simulated
   *  metrics seal into walkDistanceKm / walkDurationMin) so the
   *  provider doesn't have to remember to tap Stop first. */
  onFinish: (session: BookingSession) => void;
  /** Revert an accidental Start tap — flips status back to upcoming and
   *  clears `checkedInAt`. Different from cancel-this-session (which marks
   *  it dead with a reason and notifies the owner); undo is a soft reset
   *  for "oops, didn't mean to tap that." Provider-only. */
  onUndoStart: (session: BookingSession) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notesOpen, setNotesOpen] = useState<boolean>(
    !!session.report?.notes && session.report.notes.length > 0,
  );
  // Per-minute tick to refresh the GPS-sim readout (km / min). Cheap;
  // only runs while the panel is mounted (i.e. while a session is active).
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

  const isEmpty =
    photos.length === 0 &&
    notes.trim().length === 0 &&
    !gpsStartedAt;

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
      // Stop tracking — only seal metrics if the provider actually
      // tracked something meaningful (≥1 min). Sub-minute Start→Stop
      // is a non-event.
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
    <div
      className="flex flex-col rounded-panel bg-surface-base"
      style={{
        padding: "var(--space-lg)",
        gap: "var(--space-lg)",
        border: "1px solid var(--border-regular)",
        borderLeft: "4px solid var(--status-warning-main)",
      }}
    >
      {/* Header row — Live pill + when-it-started + date. Wraps on
          narrow viewports rather than word-wrapping. */}
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
          <span className="text-sm text-fg-tertiary whitespace-nowrap">started {startedAt}</span>
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
              style={{ background: "var(--surface-inset)", color: "var(--text-secondary)" }}
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

      {/* Provider side — quick-add layout. */}
      {isProvider && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

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

          {/* GPS state row — three states share the same slot. */}
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

          {/* Updates — quick-add affordances grouped under one header. */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
              Updates
            </span>
            <div className="flex flex-wrap gap-xs">
              {!notesOpen && (
                <ButtonAction
                  variant="soft"
                  size="sm"
                  leftIcon={<NotePencil size={14} weight="light" />}
                  onClick={() => setNotesOpen(true)}
                  className="flex-1"
                >
                  Add a note
                </ButtonAction>
              )}
              <ButtonAction
                variant="soft"
                size="sm"
                leftIcon={<Camera size={14} weight="light" />}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                {latestPhoto ? "Add another photo" : "Send a photo update"}
              </ButtonAction>
              {isWalk && !gpsStartedAt && !hasRecordedWalkMetrics && (
                <ButtonAction
                  variant="soft"
                  size="sm"
                  leftIcon={<MapPin size={14} weight="light" />}
                  onClick={toggleGps}
                  className="flex-1"
                >
                  Log route with GPS
                </ButtonAction>
              )}
            </div>
          </div>

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

          {/* Action footer */}
          <div className="flex flex-col gap-sm">
            <ButtonAction
              variant="primary"
              size="md"
              leftIcon={<CheckCircle size={16} weight="fill" />}
              onClick={() => onFinish(session)}
            >
              Finish session
            </ButtonAction>
            {isEmpty && (
              <button
                type="button"
                onClick={() => onUndoStart(session)}
                className="w-full text-left text-xs text-fg-tertiary underline underline-offset-2 cursor-pointer hover:text-fg-secondary transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  height: 24,
                  lineHeight: "24px",
                }}
              >
                Started by accident? Undo
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
