"use client";

import { Trash, Clock } from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { PricedToggleRow } from "@/components/ui/PricedToggleRow";
import { ArchivedServiceStrip } from "@/components/profile/ArchivedServiceStrip";
import type {
  CarerAppointmentServiceConfig,
  AppointmentCategory,
  AppointmentLocationKind,
} from "@/lib/types";
import {
  APPOINTMENT_LOCATION_META,
  APPOINTMENT_LOCATION_ORDER,
} from "@/lib/constants/services";

// ── Option table ─────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS: { key: AppointmentCategory; label: string }[] = [
  { key: "training", label: "Training visit" },
  { key: "grooming", label: "Grooming" },
];

// ── Props ────────────────────────────────────────────────────────────────────

interface AppointmentServiceEditCardProps {
  service: CarerAppointmentServiceConfig;
  onChange: (next: CarerAppointmentServiceConfig) => void;
  /** Delete request — the parent decides soft-archive vs hard-delete. */
  onDelete: () => void;
  /** Undo a soft-archive. Only invoked when `service.softDeletedAt` is set. */
  onUndoArchive: () => void;
  /** True for a card just added this session — triggers the scroll-into-view
   *  + flash highlight so the new card is obvious despite the kind sort. */
  isNew?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Edit card for an Appointment-type service — a solo, scheduled visit with no
 * roster (1-on-1 training, grooming). Lighter than the Meet card: no linked
 * meets, no format/cadence (there's no shared session). Mirrors the Care /
 * Meet edit card chrome — kicker header + red trash + fields below.
 *
 * Service ↔ Meet Linkage, Workstream B, 2026-05-13 (built alongside the Meet
 * card so `klara-1on1` — reclassified Meet → Appointment in A4 — is fully
 * editable; the carer's catalogue is coherent across all three service kinds).
 */
export function AppointmentServiceEditCard({
  service,
  onChange,
  onDelete,
  onUndoArchive,
  isNew = false,
}: AppointmentServiceEditCardProps) {
  // ── Soft-archived state — slim muted strip with Undo ──
  if (service.softDeletedAt) {
    return (
      <ArchivedServiceStrip
        title={service.title || "Untitled appointment"}
        onUndo={onUndoArchive}
      />
    );
  }

  function patch(updates: Partial<CarerAppointmentServiceConfig>) {
    onChange({ ...service, ...updates });
  }

  // ── Meeting-location options (Workstream B3) ──
  const locations = service.appointmentLocations ?? [];
  const hasLocations = locations.length > 0;

  // Toggle a location on/off. Keep `pricePerAppointment` pointed at the first
  // offered option so the flat fallback (and `computeAppointmentQuote`) stays
  // sane. Empty array → drop the field entirely (back to single flat rate).
  function toggleLocation(kind: AppointmentLocationKind, on: boolean) {
    const next = on
      ? [
          ...locations,
          {
            kind,
            // Seed a new option to the existing base (or the first option's
            // price); the carer tunes it immediately.
            price: locations[0]?.price ?? service.pricePerAppointment,
          },
        ]
      : locations.filter((l) => l.kind !== kind);
    patch({
      appointmentLocations: next.length > 0 ? next : undefined,
      pricePerAppointment: next[0]?.price ?? service.pricePerAppointment,
    });
  }

  function setLocationPrice(kind: AppointmentLocationKind, price: number) {
    const next = locations.map((l) =>
      l.kind === kind ? { ...l, price } : l,
    );
    patch({
      appointmentLocations: next,
      pricePerAppointment: next[0]?.price ?? service.pricePerAppointment,
    });
  }

  return (
    <div
      id={`svc-card-${service.id}`}
      className={`profile-service-card${isNew ? " profile-service-card--new" : ""}`}
    >
      {/* Kicker header — appointment kind marker; title is editable below. */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-xs text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
          <Clock size={14} weight="bold" />
          Appointment
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--status-error-main)",
            padding: 4,
          }}
          aria-label="Remove service"
          title="Remove service"
        >
          <Trash size={18} weight="light" />
        </button>
      </div>

      <InputField
        id={`appt-title-${service.id}`}
        label="Appointment name"
        value={service.title}
        onChange={(val) => patch({ title: val })}
        placeholder="e.g. 1-on-1 training session"
      />

      {/* Description — the single free-text field (reuses `notes`). Replaced
          the separate Training-focus + Notes inputs (2026-06-16 walkthrough):
          the carer explains what it is and who it's for in their own words. */}
      <div className="input-block">
        <label className="label" htmlFor={`appt-desc-${service.id}`}>
          <span className="label-primary-group">
            <span>Description</span>
          </span>
        </label>
        <textarea
          id={`appt-desc-${service.id}`}
          className="textarea"
          rows={3}
          value={service.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="What it is and who it's for. e.g. Behaviour-focused 1-on-1 for reactive or anxious dogs, with an assessment on the first session."
          style={{ minHeight: 72 }}
        />
      </div>

      {/* Flat price — only when the carer hasn't set per-location prices.
          With locations on, each option carries its own price below. */}
      {!hasLocations && (
        <InputField
          id={`appt-price-${service.id}`}
          label="Price"
          type="number"
          value={service.pricePerAppointment.toString()}
          onChange={(val) => patch({ pricePerAppointment: parseInt(val) || 0 })}
          trailing="Kč / appointment"
        />
      )}

      {/* Category */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <span>Type</span>
          </span>
        </label>
        <div className="pill-group" style={{ flexWrap: "wrap" }}>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`pill pill-sm${service.appointmentCategory === opt.key ? " active" : ""}`}
              onClick={() => patch({ appointmentCategory: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <InputField
        id={`appt-duration-${service.id}`}
        label="Appointment length"
        type="number"
        value={service.durationMinutes.toString()}
        onChange={(val) => patch({ durationMinutes: parseInt(val) || 0 })}
        trailing="min"
      />

      {/* Where do you meet — curated location tuples, each priced (Workstream
          B3). Optional: leave all off for a single flat rate (above). With one
          on, the owner sees a read-only line at booking; with more than one,
          the owner picks. */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <span>Where do you meet?</span>
          </span>
        </label>
        <p className="text-xs text-fg-tertiary m-0">
          {hasLocations
            ? "Owners pick where the session happens when they book."
            : "Leave all off to charge one flat rate. Turn options on to price by where you meet."}
        </p>
        <div className="flex flex-col gap-md">
          {APPOINTMENT_LOCATION_ORDER.map((kind) => {
            const opt = locations.find((l) => l.kind === kind);
            return (
              <PricedToggleRow
                key={kind}
                label={APPOINTMENT_LOCATION_META[kind].label}
                description={APPOINTMENT_LOCATION_META[kind].carerHint}
                checked={!!opt}
                onToggle={(next) => toggleLocation(kind, next)}
                price={opt?.price ?? service.pricePerAppointment}
                onPriceChange={(n) => setLocationPrice(kind, n)}
                unitLabel="Kč / appointment"
                inputId={`appt-loc-${service.id}-${kind}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
