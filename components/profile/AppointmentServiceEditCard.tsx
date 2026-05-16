"use client";

import { Trash, Clock, ArrowCounterClockwise } from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import type {
  CarerAppointmentServiceConfig,
  AppointmentCategory,
} from "@/lib/types";

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
}: AppointmentServiceEditCardProps) {
  // ── Soft-archived state — slim muted strip with Undo ──
  if (service.softDeletedAt) {
    return (
      <div
        className="profile-service-card flex items-center justify-between gap-md"
        style={{ opacity: 0.7 }}
      >
        <div className="flex flex-col gap-xxs">
          <span className="text-sm font-semibold text-fg-secondary">
            {service.title || "Untitled appointment"}
          </span>
          <span className="text-xs text-fg-tertiary">
            Archived — existing bookings keep running.
          </span>
        </div>
        <button
          type="button"
          onClick={onUndoArchive}
          className="flex items-center gap-xs text-sm text-brand-strong"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <ArrowCounterClockwise size={15} weight="bold" />
          Undo
        </button>
      </div>
    );
  }

  function patch(updates: Partial<CarerAppointmentServiceConfig>) {
    onChange({ ...service, ...updates });
  }

  return (
    <div className="profile-service-card">
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

      <InputField
        id={`appt-price-${service.id}`}
        label="Price"
        type="number"
        value={service.pricePerAppointment.toString()}
        onChange={(val) => patch({ pricePerAppointment: parseInt(val) || 0 })}
        trailing="Kč / appointment"
      />

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
              className={`pill${service.appointmentCategory === opt.key ? " active" : ""}`}
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

      <div className="input-block">
        <label className="label" htmlFor={`appt-notes-${service.id}`}>
          <span className="label-primary-group">
            <span>Notes</span>
          </span>
        </label>
        <textarea
          id={`appt-notes-${service.id}`}
          className="textarea"
          rows={2}
          value={service.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="e.g. Private session at your location or Stromovka."
          style={{ minHeight: 56 }}
        />
      </div>

      {/* Enabled toggle */}
      <div className="flex flex-col gap-xxs">
        <Toggle
          label="Show on your profile"
          checked={service.enabled}
          onChange={(checked) => patch({ enabled: checked })}
        />
        <span className="text-xs text-fg-tertiary">
          Off keeps the service saved but hidden from owners.
        </span>
      </div>
    </div>
  );
}
