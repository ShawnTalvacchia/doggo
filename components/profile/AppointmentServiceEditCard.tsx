"use client";

import { Trash, Clock } from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { ArchivedServiceStrip } from "@/components/profile/ArchivedServiceStrip";
import type {
  CarerAppointmentServiceConfig,
  AppointmentCategory,
  TrainingType,
} from "@/lib/types";
import { TRAINING_TYPE_LABELS, TRAINING_TYPE_PICKER_ORDER } from "@/lib/constants/services";

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
              className={`pill pill-sm${service.appointmentCategory === opt.key ? " active" : ""}`}
              onClick={() => {
                // Switching category clears `trainingType` — it's only
                // meaningful in the training branch. Otherwise an old
                // training selection would silently follow a grooming
                // service it doesn't apply to.
                if (opt.key === "training") {
                  patch({ appointmentCategory: opt.key });
                } else {
                  patch({ appointmentCategory: opt.key, trainingType: undefined });
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Training sub-type — only shown when this Appointment is training.
          Single-select for V1 (one type per service entry); a trainer who
          offers multiple types creates multiple service entries. P73. */}
      {service.appointmentCategory === "training" && (
        <div className="input-block">
          <label className="label">
            <span className="label-primary-group">
              <span>Training focus</span>
            </span>
          </label>
          <div className="pill-group" style={{ flexWrap: "wrap" }}>
            {TRAINING_TYPE_PICKER_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                className={`pill pill-sm${service.trainingType === key ? " active" : ""}`}
                onClick={() =>
                  patch({
                    // Tap the active one to clear — lets a trainer leave
                    // the focus unset if their visit is general-purpose.
                    trainingType:
                      service.trainingType === key ? undefined : (key as TrainingType),
                  })
                }
              >
                {TRAINING_TYPE_LABELS[key as TrainingType]}
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}
