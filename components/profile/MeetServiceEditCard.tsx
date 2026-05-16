"use client";

import { useEffect, useRef, useState } from "react";
import { Trash, CalendarBlank, Plus, X, MagnifyingGlass } from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import { ArchivedServiceStrip } from "@/components/profile/ArchivedServiceStrip";
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
  /** True for a card just added this session — triggers the scroll-into-view
   *  + flash highlight so the new card is obvious despite the kind sort. */
  isNew?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Edit card for a Meet-type service (training sessions, workshops, paid group
 * walks). Mirrors the Care service edit card pattern — kicker header + red
 * trash + fields below — with Meet-specific fields plus the linked-meets
 * picker (B2) and per-link required toggle (B3).
 *
 * The picker is a popover, not a list-all: only the *linked* meets show as
 * rows (usually 0–1); a "Link a meet" trigger opens a floating menu with a
 * search field over the carer's other hosted meets. The menu scrolls when the
 * list is long and closes on outside-click / Escape / after a pick — so a
 * carer hosting many meets never gets the full list dumped inline on every
 * session-type service card. (Walkthrough refinement, 2026-05-16.)
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
  isNew = false,
}: MeetServiceEditCardProps) {
  // Linked-meets picker state — hooks must run before any early return.
  // The picker is a popover anchored to the "Link a meet" trigger. It opens
  // by default for a fresh card (a Meet-service needs a linked meet to be
  // bookable) and closes on outside-click / Escape / after a pick.
  const [pickerOpen, setPickerOpen] = useState(
    service.linkedMeetIds.length === 0,
  );
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker popover on outside-click / Escape (mirrors the
  // ProfileNameDropdown pattern).
  useEffect(() => {
    if (!pickerOpen) return;
    function onClick(e: MouseEvent) {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPickerOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  // ── Soft-archived state — slim muted strip with Undo ──
  if (service.softDeletedAt) {
    return (
      <ArchivedServiceStrip
        title={service.title || "Untitled session"}
        onUndo={onUndoArchive}
      />
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
    <div
      id={`svc-card-${service.id}`}
      className={`profile-service-card${isNew ? " profile-service-card--new" : ""}`}
    >
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
              className={`pill pill-sm${service.format === opt.key ? " active" : ""}`}
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
              className={`pill pill-sm${service.cadence === opt.key ? " active" : ""}`}
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
          <div className="flex flex-col gap-md">
            {/* Linked meets */}
            {linkedMeets.length === 0 && (
              <p className="text-xs text-fg-tertiary m-0">
                Not linked to a meet yet — link one below so owners can book
                sessions.
              </p>
            )}
            {linkedMeets.map((meet) => (
              <div
                key={meet.id}
                className="flex flex-col rounded-sm"
                style={{
                  background: "var(--surface-popout)",
                  border: "1px solid var(--border-stronger)",
                  overflow: "hidden",
                }}
              >
                {/* Meet info */}
                <div
                  className="flex items-start gap-sm"
                  style={{ padding: "var(--space-md)" }}
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
                {/* Per-link required toggle — one line, no divider. */}
                <div style={{ padding: "var(--space-md)" }}>
                  <Toggle
                    label="Booking required to RSVP"
                    checked={requiredByMeet[meet.id] ?? false}
                    onChange={(checked) => onChangeRequired(meet.id, checked)}
                    size="sm"
                  />
                </div>
              </div>
            ))}

            {/* Add control — a "Link a meet" trigger that opens a floating
                popover menu (search + scrollable results). The menu closes
                on outside-click / Escape / after a pick. */}
            {unlinkedMeets.length > 0 && (
              <div className="relative self-start w-full" ref={pickerRef}>
                <button
                  type="button"
                  onClick={() => setPickerOpen((o) => !o)}
                  className="flex items-center gap-xs text-sm text-brand-strong"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                >
                  <Plus size={14} weight="bold" />
                  {linkedMeets.length > 0 ? "Link another meet" : "Link a meet"}
                </button>

                {pickerOpen && (
                  <div
                    className="absolute left-0 right-0 z-50 flex flex-col overflow-hidden bg-surface-top border border-edge-regular rounded-panel shadow-md"
                    style={{ top: "calc(100% + 4px)" }}
                    role="listbox"
                  >
                    {/* Search — fixed header of the menu */}
                    <div
                      style={{
                        padding: "var(--space-sm)",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
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
                    </div>

                    {/* Results — scrolls when the list is long */}
                    <div
                      className="flex flex-col gap-xs"
                      style={{
                        padding: "var(--space-sm)",
                        maxHeight: 240,
                        overflowY: "auto",
                      }}
                    >
                      {searchResults.length === 0 ? (
                        <p
                          className="text-xs text-fg-tertiary m-0"
                          style={{ padding: "var(--space-xs) var(--space-sm)" }}
                        >
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
                              setPickerOpen(false);
                            }}
                            className="flex items-center gap-sm rounded-form text-left hover:bg-surface-base"
                            style={{
                              padding: "var(--space-sm) var(--space-md)",
                              background: "transparent",
                              border: "none",
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
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
