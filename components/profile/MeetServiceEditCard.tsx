"use client";

import { useState } from "react";
import {
  Trash,
  CalendarBlank,
  ArrowCounterClockwise,
  Plus,
  X,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import { meetScheduleSummary } from "@/lib/meetUtils";
import type {
  CarerMeetServiceConfig,
  MeetServiceFormat,
  MeetServiceCadence,
  Meet,
} from "@/lib/types";

// ── Option tables ────────────────────────────────────────────────────────────

const FORMAT_OPTIONS: { key: MeetServiceFormat; label: string }[] = [
  { key: "one_on_one", label: "1-on-1" },
  { key: "small_group", label: "Small group" },
  { key: "workshop", label: "Workshop" },
];

const CADENCE_OPTIONS: { key: MeetServiceCadence; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "biweekly", label: "Every 2 weeks" },
  { key: "monthly", label: "Monthly" },
  { key: "ad_hoc", label: "By arrangement" },
];

// ── Props ────────────────────────────────────────────────────────────────────

interface MeetServiceEditCardProps {
  service: CarerMeetServiceConfig;
  onChange: (next: CarerMeetServiceConfig) => void;
  /** Delete request — the parent decides soft-archive vs hard-delete. */
  onDelete: () => void;
  /** Undo a soft-archive. Only invoked when `service.softDeletedAt` is set. */
  onUndoArchive: () => void;
  /** The carer's hosted meets — the linkable options for the picker. */
  hostedMeets: Meet[];
  /** Per-link `required` flags for this service, keyed by meetId. */
  requiredByMeet: Record<string, boolean>;
  /** Toggle the `required` flag for a (this service, meet) link. */
  onChangeRequired: (meetId: string, required: boolean) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Edit card for a Meet-type service (training sessions, workshops, paid group
 * walks). Mirrors the Care service edit card pattern — kicker header + red
 * trash + fields below — with Meet-specific fields plus the linked-meets
 * picker (B2) and per-link required toggle (B3).
 *
 * The picker is a search-and-add pattern, not a list-all: only the *linked*
 * meets show by default (usually 0–1), with a "Link a meet" search to add
 * more. A carer hosting many meets would otherwise get the full list
 * repeated on every session-type service card. (Walkthrough refinement,
 * 2026-05-16.)
 *
 * Service ↔ Meet Linkage, Workstream B1–B3, 2026-05-13.
 */
export function MeetServiceEditCard({
  service,
  onChange,
  onDelete,
  onUndoArchive,
  hostedMeets,
  requiredByMeet,
  onChangeRequired,
}: MeetServiceEditCardProps) {
  // Linked-meets picker state — hooks must run before any early return.
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  // ── Soft-archived state — slim muted strip with Undo ──
  if (service.softDeletedAt) {
    return (
      <div
        className="profile-service-card flex items-center justify-between gap-md"
        style={{ opacity: 0.7 }}
      >
        <div className="flex flex-col gap-xxs">
          <span className="text-sm font-semibold text-fg-secondary">
            {service.title || "Untitled session"}
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

  function patch(updates: Partial<CarerMeetServiceConfig>) {
    onChange({ ...service, ...updates });
  }

  function linkMeet(meetId: string) {
    if (service.linkedMeetIds.includes(meetId)) return;
    patch({ linkedMeetIds: [...service.linkedMeetIds, meetId] });
  }

  function unlinkMeet(meetId: string) {
    patch({
      linkedMeetIds: service.linkedMeetIds.filter((id) => id !== meetId),
    });
  }

  // Linked meets (rendered as rows) and the unlinked pool (search-to-add).
  const linkedMeets = hostedMeets.filter((m) =>
    service.linkedMeetIds.includes(m.id),
  );
  const unlinkedMeets = hostedMeets.filter(
    (m) => !service.linkedMeetIds.includes(m.id),
  );
  const q = search.trim().toLowerCase();
  const searchResults = q
    ? unlinkedMeets.filter((m) => m.title.toLowerCase().includes(q))
    : unlinkedMeets;

  return (
    <div className="profile-service-card">
      {/* Kicker header — distinguishes a Meet card from a Care card (whose
          header is the fixed service-type label). The title is editable
          below, so the header carries a kind kicker, not the name. */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-xs text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
          <CalendarBlank size={14} weight="bold" />
          Session offering
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
        id={`meet-title-${service.id}`}
        label="Session name"
        value={service.title}
        onChange={(val) => patch({ title: val })}
        placeholder="e.g. Group training session"
      />

      <InputField
        id={`meet-price-${service.id}`}
        label="Price"
        type="number"
        value={service.pricePerSession.toString()}
        onChange={(val) => patch({ pricePerSession: parseInt(val) || 0 })}
        trailing="Kč / session"
      />

      {/* Format */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <span>Format</span>
          </span>
        </label>
        <div className="pill-group" style={{ flexWrap: "wrap" }}>
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`pill${service.format === opt.key ? " active" : ""}`}
              onClick={() => patch({ format: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cadence */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <span>Cadence</span>
          </span>
        </label>
        <div className="pill-group" style={{ flexWrap: "wrap" }}>
          {CADENCE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`pill${service.cadence === opt.key ? " active" : ""}`}
              onClick={() => patch({ cadence: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <InputField
        id={`meet-duration-${service.id}`}
        label="Session length"
        type="number"
        value={service.durationMinutes.toString()}
        onChange={(val) => patch({ durationMinutes: parseInt(val) || 0 })}
        trailing="min"
      />

      <div className="input-block">
        <label className="label" htmlFor={`meet-notes-${service.id}`}>
          <span className="label-primary-group">
            <span>Notes</span>
          </span>
        </label>
        <textarea
          id={`meet-notes-${service.id}`}
          className="textarea"
          rows={2}
          value={service.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="e.g. Calm focus and recall practice. All levels welcome."
          style={{ minHeight: 56 }}
        />
      </div>

      {/* ── Linked meets picker (B2) + per-link required toggle (B3) ──
          Search-and-add: linked meets show as rows; "Link a meet" reveals a
          searchable list of the carer's other hosted meets. */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <span>Offered on these meets</span>
          </span>
        </label>

        {hostedMeets.length === 0 ? (
          <p className="text-xs text-fg-tertiary m-0" style={{ lineHeight: 1.5 }}>
            You&apos;re not hosting any meets yet. Create one from Communities —
            meets you host appear here so you can link this service to
            scheduled sessions.
          </p>
        ) : (
          <div className="flex flex-col gap-xs">
            {/* Linked meets */}
            {linkedMeets.length === 0 && (
              <p className="text-xs text-fg-tertiary m-0">
                Not linked to a meet yet — link one below so owners can book
                sessions.
              </p>
            )}
            {linkedMeets.map((meet) => (
              <div key={meet.id} className="flex flex-col gap-xs">
                <div
                  className="flex items-start gap-sm rounded-form border border-edge-regular"
                  style={{ padding: "var(--space-sm) var(--space-md)" }}
                >
                  <span className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm text-fg-primary">{meet.title}</span>
                    <span className="text-xs text-fg-tertiary">
                      {meetScheduleSummary(meet)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => unlinkMeet(meet.id)}
                    className="flex items-center justify-center shrink-0"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-tertiary)",
                      padding: 2,
                    }}
                    aria-label={`Unlink ${meet.title}`}
                    title="Unlink this meet"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
                {/* Per-link required toggle — indented under its meet. */}
                <div
                  className="flex flex-col gap-xxs rounded-sm"
                  style={{
                    marginLeft: "var(--space-sm)",
                    padding: "var(--space-xs) var(--space-md)",
                    background: "var(--surface-inset)",
                  }}
                >
                  <Toggle
                    label="Booking required to RSVP"
                    checked={requiredByMeet[meet.id] ?? false}
                    onChange={(checked) => onChangeRequired(meet.id, checked)}
                  />
                  <span className="text-xs text-fg-tertiary">
                    {requiredByMeet[meet.id]
                      ? "Only paid bookings — no free RSVP for this meet."
                      : "Free to join; booking this service is optional."}
                  </span>
                </div>
              </div>
            ))}

            {/* Add control — collapsed "Link a meet", or an expanded
                searchable list of the carer's other hosted meets. */}
            {unlinkedMeets.length > 0 &&
              (!adding ? (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-xs text-sm text-brand-strong self-start"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
                >
                  <Plus size={14} weight="bold" />
                  Link a meet
                </button>
              ) : (
                <div className="flex flex-col gap-xs">
                  <div className="input-with-trailing">
                    <input
                      className="input"
                      placeholder="Search your meets…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <span className="input-trailing-text" aria-hidden="true">
                      <MagnifyingGlass size={15} weight="light" />
                    </span>
                  </div>
                  {searchResults.length === 0 ? (
                    <p className="text-xs text-fg-tertiary m-0">
                      No meets match &ldquo;{search}&rdquo;.
                    </p>
                  ) : (
                    searchResults.map((meet) => (
                      <button
                        key={meet.id}
                        type="button"
                        onClick={() => {
                          linkMeet(meet.id);
                          setSearch("");
                        }}
                        className="flex items-center gap-sm rounded-form border border-edge-regular text-left"
                        style={{
                          padding: "var(--space-sm) var(--space-md)",
                          background: "var(--surface-top)",
                          cursor: "pointer",
                        }}
                      >
                        <span className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm text-fg-primary">
                            {meet.title}
                          </span>
                          <span className="text-xs text-fg-tertiary">
                            {meetScheduleSummary(meet)}
                          </span>
                        </span>
                        <Plus
                          size={16}
                          weight="bold"
                          className="text-brand-strong shrink-0"
                        />
                      </button>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(false);
                      setSearch("");
                    }}
                    className="flex items-center text-sm text-fg-secondary self-start"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
                  >
                    Done
                  </button>
                </div>
              ))}
          </div>
        )}
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
