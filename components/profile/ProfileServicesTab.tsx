"use client";

import { useState } from "react";
import {
  Plus,
  Trash,
  Sparkle,
  Info,
  CaretDown,
  CaretUp,
  UsersThree,
  Globe,
  CalendarBlank,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import { MeetServiceEditCard } from "@/components/profile/MeetServiceEditCard";
import { AppointmentServiceEditCard } from "@/components/profile/AppointmentServiceEditCard";
import { SERVICE_LABELS, SUB_SERVICES } from "@/lib/constants/services";
import { defaultModifiers } from "@/lib/pricing";
import { mockMeets, getHostedMeets } from "@/lib/mockMeets";
import { meetScheduleSummary } from "@/lib/meetUtils";
import type {
  UserProfile,
  CarerProfile,
  CarerServiceConfig,
  CarerCareServiceConfig,
  CarerMeetServiceConfig,
  CarerAppointmentServiceConfig,
  CarerAvailabilitySlot,
  ServiceType,
  TimeSlot,
  DayOfWeek,
  PricingModifier,
} from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS: { key: TimeSlot; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

// ── Care-offering picker ──────────────────────────────────────────────────────
//
// The "are you a Carer, and to whom?" decision is genuinely three states:
//   - off    → not a carer (`openToHelping = false`)
//   - circle → carer, Connected-only audience (`openToHelping + !publicProfile`)
//   - anyone → carer, public audience (`openToHelping + publicProfile`)
//
// Previously this was modelled as two flat Toggles ("Open to helping" +
// "Open to anyone") which hid the hierarchy and made the relationship
// between them invisible. The new picker surfaces the trichotomy
// explicitly. 2026-05-11 (walkthrough C6).

type CareOption = "off" | "circle" | "anyone";

const CARE_OPTIONS: { key: CareOption; title: string; desc: string }[] = [
  {
    key: "off",
    title: "Not offering care",
    desc: "I'm not a carer right now.",
  },
  {
    key: "circle",
    title: "Connected circle only",
    desc: "Visible only to people you're Connected with. Build trust through shared meets first.",
  },
  {
    key: "anyone",
    title: "Open to anyone",
    desc: "Discoverable by anyone in Prague through Discover. Most carers start here once they're ready.",
  },
];

function deriveCareOption(openToHelping: boolean, visibility: boolean): CareOption {
  if (!openToHelping) return "off";
  return visibility ? "anyone" : "circle";
}

const SERVICE_TYPE_ORDER: ServiceType[] = [
  "walks_checkins",
  "house_sitting",
  "day_care",
  "boarding",
];

// Edit-list display order — Care cards first, then Meet, then Appointment.
// Service ↔ Meet Linkage B6, 2026-05-13. The array index stays the source of
// truth for update/delete; this only reorders the rendered cards.
const SERVICE_KIND_RANK: Record<CarerServiceConfig["kind"], number> = {
  care: 0,
  meet: 1,
  appointment: 2,
};

const APPOINTMENT_CATEGORY_LABEL: Record<string, string> = {
  training: "Training visit",
  grooming: "Grooming",
};

const MEET_FORMAT_LABEL: Record<string, string> = {
  one_on_one: "1-on-1",
  small_group: "Small group",
  workshop: "Workshop",
};

const MEET_CADENCE_LABEL: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  ad_hoc: "By arrangement",
};

const MODIFIER_LABEL: Record<PricingModifier["kind"], string> = {
  holiday: "Holiday surcharge",
  weekend: "Weekend rate",
  multi_pet: "Multi-pet",
  last_minute: "Last-minute",
};

const MODIFIER_HINT: Record<PricingModifier["kind"], string> = {
  holiday: "Czech public holidays in the booking dates",
  weekend: "When the booking includes Sat or Sun",
  multi_pet: "Per extra pet beyond the first",
  last_minute: "Booking starts soon",
};

// ── PricingModifiersEditor ───────────────────────────────────────────────────
//
// Per-service modifier config UI. Default-collapsed accordion to keep the
// Services edit form scannable. Inside: one row per modifier kind with a
// Toggle + the param input(s) revealed once the toggle is on.
// Pricing & Proposals, 2026-05-04.

function PricingModifiersEditor({
  modifiers,
  onChange,
}: {
  modifiers: PricingModifier[];
  onChange: (m: PricingModifier[]) => void;
}) {
  const [open, setOpen] = useState(false);

  // Merge the seeded modifiers with the full defaults set, so the editor
  // always renders all four kinds. A carer who's only configured 2 of the 4
  // (e.g. Tereza with weekend + multi-pet) still sees holiday + last-minute
  // toggles in the off state — they just need to flip them on if they want
  // them.
  const merged: PricingModifier[] = defaultModifiers().map((def) => {
    const existing = modifiers.find((m) => m.kind === def.kind);
    return existing ?? def;
  });

  const enabledCount = merged.filter((m) => m.enabled).length;

  function updateModifier(idx: number, patch: Partial<PricingModifier>) {
    const next = merged.map((m, i) =>
      i === idx ? ({ ...m, ...patch } as PricingModifier) : m,
    );
    onChange(next);
  }

  return (
    <div className="profile-modifiers">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="profile-modifiers-toggle"
      >
        <span className="profile-modifiers-toggle-label">
          Pricing modifiers
          {enabledCount > 0 && (
            <span className="profile-modifiers-count">{enabledCount} on</span>
          )}
        </span>
        {open ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
      </button>
      {open && (
        <div className="profile-modifiers-body">
          {merged.map((mod, idx) => (
            <div key={mod.kind} className="profile-modifier-row">
              <div className="profile-modifier-head">
                <div className="profile-modifier-label-col">
                  <span className="profile-modifier-label">{MODIFIER_LABEL[mod.kind]}</span>
                  <span className="profile-modifier-hint">{MODIFIER_HINT[mod.kind]}</span>
                </div>
                <Toggle
                  label={MODIFIER_LABEL[mod.kind]}
                  checked={mod.enabled}
                  onChange={(checked) => updateModifier(idx, { enabled: checked })}
                />
              </div>
              {mod.enabled && (
                <div className="profile-modifier-params">
                  {mod.kind === "holiday" && (
                    <label className="profile-modifier-param">
                      <span className="profile-modifier-param-label">Surcharge</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          min={0}
                          className="profile-modifier-input"
                          value={mod.pct}
                          onChange={(e) =>
                            updateModifier(idx, {
                              pct: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                        <span className="profile-modifier-input-unit">%</span>
                      </span>
                    </label>
                  )}
                  {mod.kind === "weekend" && (
                    <label className="profile-modifier-param">
                      <span className="profile-modifier-param-label">Surcharge</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          min={0}
                          className="profile-modifier-input"
                          value={mod.pct}
                          onChange={(e) =>
                            updateModifier(idx, {
                              pct: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                        <span className="profile-modifier-input-unit">%</span>
                      </span>
                    </label>
                  )}
                  {mod.kind === "multi_pet" && (
                    <label className="profile-modifier-param">
                      <span className="profile-modifier-param-label">Per extra pet</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          min={0}
                          className="profile-modifier-input"
                          value={mod.flatPerExtra}
                          onChange={(e) =>
                            updateModifier(idx, {
                              flatPerExtra: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                        <span className="profile-modifier-input-unit">Kč</span>
                      </span>
                    </label>
                  )}
                  {mod.kind === "last_minute" && (
                    <>
                      <label className="profile-modifier-param">
                        <span className="profile-modifier-param-label">Surcharge</span>
                        <span className="profile-modifier-input-wrap">
                          <input
                            type="number"
                            min={0}
                            className="profile-modifier-input"
                            value={mod.pct}
                            onChange={(e) =>
                              updateModifier(idx, {
                                pct: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                          />
                          <span className="profile-modifier-input-unit">%</span>
                        </span>
                      </label>
                      <label className="profile-modifier-param">
                        <span className="profile-modifier-param-label">Within</span>
                        <span className="profile-modifier-input-wrap">
                          <input
                            type="number"
                            min={0}
                            className="profile-modifier-input"
                            value={mod.thresholdDays}
                            onChange={(e) =>
                              updateModifier(idx, {
                                thresholdDays: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                          />
                          <span className="profile-modifier-input-unit">days</span>
                        </span>
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Availability grid (view mode) ────────────────────────────────────────────

function AvailabilityGrid({ carer }: { carer: CarerProfile }) {
  return (
    <div className="profile-avail-grid">
      {ALL_DAYS.map((day) => {
        const dayData = carer.availability.find((a) => a.day === day);
        const activeSlots = dayData?.slots ?? [];
        return (
          <div key={day} className="profile-avail-row">
            <span className="profile-avail-day">{day}</span>
            <div className="pill-group profile-avail-slots">
              {TIME_SLOTS.map(({ key, label }) => (
                <span
                  key={key}
                  className={`pill${activeSlots.includes(key) ? " active" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ProfileServicesTabProps {
  user: UserProfile;
  editing: boolean;
  visibility: boolean;
  onToggleVisibility: (v: boolean) => void;
  openToHelping: boolean;
  onToggleOpenToHelping: (v: boolean) => void;
  /** Flips the viewer's `profileVisibility` from "locked" → "open".
   *  Wired from the locked-provider banner CTA. The banner only renders
   *  when the viewer is locked AND has services, so unlocking makes the
   *  banner go away. */
  onUnlockProfile: () => void;
  // The Services edit authors the whole catalogue — Care, Meet, and
  // Appointment services in one place (Service ↔ Meet Linkage, Workstream B).
  editServices: CarerServiceConfig[];
  onEditServices: (s: CarerServiceConfig[]) => void;
  /** Companion edit state for the per-link `required` flag, which lives on
   *  the Meet (`Meet.linkedServices[].required`) not the service. Keyed
   *  `${serviceId}::${meetId}`. Flushed to `mockMeets` on Save by the
   *  profile page; dropped on Cancel. */
  editMeetLinks: Record<string, boolean>;
  onEditMeetLinks: (m: Record<string, boolean>) => void;
  editAvailability: CarerAvailabilitySlot[];
  onEditAvailability: (a: CarerAvailabilitySlot[]) => void;
  editCarerBio: string;
  onEditCarerBio: (b: string) => void;
  /** Flips the page into edit mode from the empty-state CTA. Wired to
   *  the parent's `startServicesEdit` callback (same trigger as the
   *  header Edit button). Lets the empty-state surface invite users
   *  directly without forcing a "tap Edit above" pointer. 2026-05-11. */
  onStartEdit: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileServicesTab({
  user,
  editing,
  visibility,
  onToggleVisibility,
  openToHelping,
  onToggleOpenToHelping,
  onUnlockProfile,
  editServices,
  onEditServices,
  editMeetLinks,
  onEditMeetLinks,
  editAvailability,
  onEditAvailability,
  editCarerBio,
  onEditCarerBio,
  onStartEdit,
}: ProfileServicesTabProps) {
  const carer = user.carerProfile;
  const showCareContent = editing
    ? openToHelping
    : carer !== undefined && (user.openToHelping ?? false);

  // Meets the carer hosts — the linkable options for the Meet-service editor's
  // linked-meets picker (Service ↔ Meet Linkage, Workstream B2).
  const hostedMeets = getHostedMeets(user.id);

  // ── Helpers for editing services ──
  //
  // `editServices` is the comprehensive catalogue (Care + Meet + Appointment).
  // The array index is the stable handle for update / delete. `updateServiceAt`
  // replaces a whole entry; `updateCareService` is a Care-typed convenience
  // for the inline Care card (the cast is safe — the Care branch only renders
  // for `kind === "care"`).

  function updateServiceAt(idx: number, updated: CarerServiceConfig) {
    onEditServices(editServices.map((s, i) => (i === idx ? updated : s)));
  }

  function updateCareService(idx: number, updates: Partial<CarerCareServiceConfig>) {
    onEditServices(
      editServices.map((s, i) =>
        i === idx ? { ...(s as CarerCareServiceConfig), ...updates } : s,
      ),
    );
  }

  function hardRemoveAt(idx: number) {
    onEditServices(editServices.filter((_, i) => i !== idx));
  }

  function addService(type: ServiceType) {
    const usedTypes = editServices
      .filter((s): s is CarerCareServiceConfig => s.kind === "care")
      .map((s) => s.serviceType);
    if (usedTypes.includes(type)) return;
    onEditServices([
      ...editServices,
      {
        kind: "care",
        serviceType: type,
        enabled: true,
        pricePerUnit: 0,
        priceUnit: type === "walks_checkins" ? "per_visit" : "per_night",
        subServices: [],
        modifiers: defaultModifiers(),
      },
    ]);
  }

  function addMeetService() {
    const newSvc: CarerMeetServiceConfig = {
      kind: "meet",
      id: `svc-meet-${Date.now()}`,
      title: "",
      enabled: true,
      pricePerSession: 0,
      format: "small_group",
      cadence: "weekly",
      durationMinutes: 60,
      linkedMeetIds: [],
    };
    onEditServices([...editServices, newSvc]);
  }

  function addAppointmentService() {
    const newSvc: CarerAppointmentServiceConfig = {
      kind: "appointment",
      id: `svc-appt-${Date.now()}`,
      title: "",
      enabled: true,
      pricePerAppointment: 0,
      durationMinutes: 60,
      appointmentCategory: "training",
    };
    onEditServices([...editServices, newSvc]);
  }

  // ── B5 delete decision — soft-archive vs hard-delete ──
  //
  // Care: hard-delete (unchanged from prior behavior — Care delete is out of
  // this phase's scope). Meet / Appointment: a service *added this session*
  // (no id in the un-edited `user` snapshot) never had time to accrue
  // bookings → hard-delete. A pre-existing Meet service soft-archives when a
  // linked meet has a roster (the roster IS the booking record for Meet-type
  // — `Booking` carries no `serviceId` back-reference). A pre-existing
  // Appointment soft-archives unconditionally — appointments have no roster
  // and no detectable booking signal, so the safe assumption is "may have
  // bookings."
  function meetServiceHasRoster(svc: CarerMeetServiceConfig): boolean {
    return svc.linkedMeetIds.some((meetId) => {
      const meet = mockMeets.find((m) => m.id === meetId);
      if (!meet) return false;
      const lists = [meet.attendees, ...Object.values(meet.attendeesByDate ?? {})];
      return lists.some((list) => list.some((a) => a.userId !== meet.creatorId));
    });
  }

  function wasPreExisting(id: string): boolean {
    return (user.carerProfile?.services ?? []).some(
      (s) => (s.kind === "meet" || s.kind === "appointment") && s.id === id,
    );
  }

  function deleteServiceAt(idx: number) {
    const svc = editServices[idx];
    if (svc.kind === "care") {
      hardRemoveAt(idx);
      return;
    }
    const fresh = !wasPreExisting(svc.id);
    const softArchive =
      !fresh &&
      (svc.kind === "appointment" || meetServiceHasRoster(svc));
    if (softArchive) {
      updateServiceAt(idx, {
        ...svc,
        enabled: false,
        softDeletedAt: new Date().toISOString(),
      });
    } else {
      hardRemoveAt(idx);
    }
  }

  function undoArchiveAt(idx: number) {
    const svc = editServices[idx];
    if (svc.kind === "care") return;
    updateServiceAt(idx, { ...svc, enabled: true, softDeletedAt: undefined });
  }

  // ── Linked-meet `required` flag plumbing (companion edit state) ──
  function requiredByMeetFor(serviceId: string): Record<string, boolean> {
    const out: Record<string, boolean> = {};
    const prefix = `${serviceId}::`;
    for (const [key, val] of Object.entries(editMeetLinks)) {
      if (key.startsWith(prefix)) out[key.slice(prefix.length)] = val;
    }
    return out;
  }

  function setRequiredLink(serviceId: string, meetId: string, required: boolean) {
    onEditMeetLinks({ ...editMeetLinks, [`${serviceId}::${meetId}`]: required });
  }

  function toggleAvailSlot(day: DayOfWeek, slot: TimeSlot) {
    const existing = editAvailability.find((a) => a.day === day);
    if (existing) {
      const hasSlot = existing.slots.includes(slot);
      const newSlots = hasSlot
        ? existing.slots.filter((s) => s !== slot)
        : [...existing.slots, slot];
      if (newSlots.length === 0) {
        onEditAvailability(editAvailability.filter((a) => a.day !== day));
      } else {
        onEditAvailability(
          editAvailability.map((a) =>
            a.day === day ? { ...a, slots: newSlots } : a,
          ),
        );
      }
    } else {
      onEditAvailability([...editAvailability, { day, slots: [slot] }]);
    }
  }

  // ── Empty state: not offering care and not editing ──
  if (!showCareContent && !editing) {
    return (
      <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
        <section
          className="flex flex-col items-center gap-md text-center"
          style={{ padding: "var(--space-jumbo-1) var(--space-xl)" }}
        >
          <Sparkle size={44} weight="light" className="text-fg-tertiary" />
          <h2 className="font-heading text-lg font-semibold text-fg-primary m-0">
            Want to offer care?
          </h2>
          <p className="profile-card-copy text-fg-secondary m-0">
            Set yourself up as a carer for your community. Walks, sitting, boarding — you set the terms.
          </p>
          {/* Get started CTA — replaces the earlier "Tap Edit above" pointer.
              Same callback as the header Edit button so the empty state
              invites without inventing a second affordance; the header
              Edit stays as the persistent re-entry once a user has been
              here before. 2026-05-11 walkthrough B4.3 fix. */}
          <div style={{ marginTop: "var(--space-xl)" }}>
            <ButtonAction variant="primary" size="md" cta onClick={onStartEdit}>
              Get started
            </ButtonAction>
          </div>
        </section>
      </div>
    );
  }

  // ── Edit mode ──
  if (editing) {
    const careOption = deriveCareOption(openToHelping, visibility);

    function handleCareOptionSelect(key: CareOption) {
      switch (key) {
        case "off":
          onToggleOpenToHelping(false);
          break;
        case "circle":
          onToggleOpenToHelping(true);
          onToggleVisibility(false);
          break;
        case "anyone":
          onToggleOpenToHelping(true);
          onToggleVisibility(true);
          break;
      }
    }

    return (
      <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
        {/* Offering care — three explicit states (off / circle / anyone).
            Replaced the previous two-Toggle pattern that hid the
            hierarchy. 2026-05-11 (C6). */}
        <section>
          {/* Header + subheader bundle — stacked tight (no gap between
              them); subheader has its own height (28px since text-sm is
              14px) so it doesn't feel crammed against the h3. Section's
              flex-col gap (12px) handles spacing to the picker below.
              2026-05-11. */}
          <div>
            <h3 className="profile-card-subtitle">Offering care</h3>
            <p
              className="text-sm text-fg-secondary"
              style={{
                height: 28,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              How do you want to offer care to your community?
            </p>
          </div>
          <div className="care-offering-picker">
            {CARE_OPTIONS.map((opt) => {
              const selected = careOption === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleCareOptionSelect(opt.key)}
                  className={`care-offering-option${selected ? " care-offering-option--selected" : ""}`}
                  aria-pressed={selected}
                >
                  <span className="care-offering-radio" aria-hidden="true">
                    {selected && <span className="care-offering-radio-dot" />}
                  </span>
                  <span className="care-offering-text">
                    <span className="care-offering-title">{opt.title}</span>
                    <span className="care-offering-desc">{opt.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {openToHelping && (
          <>
            {/* Carer bio */}
            <section>
              <h3 className="profile-card-subtitle">Care bio</h3>
              <textarea
                className="textarea"
                rows={3}
                value={editCarerBio}
                onChange={(e) => onEditCarerBio(e.target.value)}
                placeholder="Tell owners about your experience and approach..."
              />
            </section>

            {/* Services — comprehensive catalogue authored in one place:
                Care, Meet-type (training sessions, workshops, paid group
                walks), and Appointment-type (solo scheduled visits). Care
                cards render inline; Meet and Appointment delegate to their
                own edit-card components. Cards group by kind (Care → Meet →
                Appointment) for scanability; the array index stays the
                update/delete handle. Service ↔ Meet Linkage, Workstream B
                (2026-05-13) — replaced the Care-only list and the dishonest
                "managed separately" footnote that pointed at a surface that
                was never built. */}
            <section>
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="flex flex-col gap-md">
                {editServices
                  .map((svc, idx) => ({ svc, idx }))
                  .sort(
                    (a, b) =>
                      SERVICE_KIND_RANK[a.svc.kind] - SERVICE_KIND_RANK[b.svc.kind],
                  )
                  .map(({ svc, idx }) => {
                    if (svc.kind === "meet") {
                      return (
                        <MeetServiceEditCard
                          key={svc.id}
                          service={svc}
                          onChange={(next) => updateServiceAt(idx, next)}
                          onDelete={() => deleteServiceAt(idx)}
                          onUndoArchive={() => undoArchiveAt(idx)}
                          hostedMeets={hostedMeets}
                          requiredByMeet={requiredByMeetFor(svc.id)}
                          onChangeRequired={(meetId, req) =>
                            setRequiredLink(svc.id, meetId, req)
                          }
                        />
                      );
                    }
                    if (svc.kind === "appointment") {
                      return (
                        <AppointmentServiceEditCard
                          key={svc.id}
                          service={svc}
                          onChange={(next) => updateServiceAt(idx, next)}
                          onDelete={() => deleteServiceAt(idx)}
                          onUndoArchive={() => undoArchiveAt(idx)}
                        />
                      );
                    }
                    // Care service — inline card (PetEditCard-style: header
                    // with the fixed service-type label + red trash, then
                    // full-width body fields).
                    const subServiceOptions =
                      SUB_SERVICES[svc.serviceType] ?? [];
                    return (
                      <div
                        key={`care-${svc.serviceType}`}
                        className="profile-service-card"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="profile-card-subtitle m-0">
                            {SERVICE_LABELS[svc.serviceType]}
                          </h3>
                          <button
                            type="button"
                            onClick={() => deleteServiceAt(idx)}
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
                          id={`price-${idx}`}
                          label="Price"
                          type="number"
                          value={svc.pricePerUnit.toString()}
                          onChange={(val) =>
                            updateCareService(idx, {
                              pricePerUnit: parseInt(val) || 0,
                            })
                          }
                          trailing={`Kč / ${svc.priceUnit === "per_visit" ? "visit" : "night"}`}
                        />

                        {subServiceOptions.length > 0 && (
                          <div className="input-block">
                            <label className="label">
                              <span className="label-primary-group">
                                <span>Includes</span>
                              </span>
                            </label>
                            <div
                              className="pill-group"
                              style={{ flexWrap: "wrap" }}
                            >
                              {subServiceOptions.map((sub) => {
                                const active = svc.subServices.includes(sub);
                                return (
                                  <button
                                    key={sub}
                                    type="button"
                                    className={`pill pill-sm${active ? " active" : ""}`}
                                    onClick={() => {
                                      const next = active
                                        ? svc.subServices.filter(
                                            (s) => s !== sub,
                                          )
                                        : [...svc.subServices, sub];
                                      updateCareService(idx, {
                                        subServices: next,
                                      });
                                    }}
                                  >
                                    {sub}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="input-block">
                          <label
                            className="label"
                            htmlFor={`notes-${idx}`}
                          >
                            <span className="label-primary-group">
                              <span>Notes</span>
                            </span>
                          </label>
                          <textarea
                            id={`notes-${idx}`}
                            className="textarea"
                            rows={2}
                            value={svc.notes ?? ""}
                            onChange={(e) =>
                              updateCareService(idx, {
                                notes: e.target.value,
                              })
                            }
                            placeholder="e.g. Max 3 dogs, 45-60 min walks"
                            style={{ minHeight: 56 }}
                          />
                        </div>

                        <PricingModifiersEditor
                          modifiers={svc.modifiers ?? []}
                          onChange={(m) =>
                            updateCareService(idx, { modifiers: m })
                          }
                        />
                      </div>
                    );
                  })}

                {/* Add Care services — one button per type not yet
                    configured. Hides once all four Care types exist. */}
                {(() => {
                  const usedTypes = new Set(
                    editServices
                      .filter(
                        (s): s is CarerCareServiceConfig => s.kind === "care",
                      )
                      .map((s) => s.serviceType),
                  );
                  const remaining = SERVICE_TYPE_ORDER.filter(
                    (t) => !usedTypes.has(t),
                  );
                  if (remaining.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-sm">
                      {remaining.map((t) => (
                        <ButtonAction
                          key={t}
                          variant="tertiary"
                          size="sm"
                          leftIcon={<Plus size={14} weight="bold" />}
                          onClick={() => addService(t)}
                        >
                          {SERVICE_LABELS[t]}
                        </ButtonAction>
                      ))}
                    </div>
                  );
                })()}

                {/* Add Meet-type / Appointment-type services. A session
                    offering links to the carer's hosted meets (Service ↔
                    Meet Linkage); an appointment is a solo scheduled visit
                    with no roster. */}
                <div className="flex flex-wrap gap-sm">
                  <ButtonAction
                    variant="tertiary"
                    size="sm"
                    leftIcon={<Plus size={14} weight="bold" />}
                    onClick={addMeetService}
                  >
                    Session offering
                  </ButtonAction>
                  <ButtonAction
                    variant="tertiary"
                    size="sm"
                    leftIcon={<Plus size={14} weight="bold" />}
                    onClick={addAppointmentService}
                  >
                    Appointment
                  </ButtonAction>
                </div>
              </div>
            </section>

            {/* Availability */}
            <section>
              <h3 className="profile-card-subtitle">Availability</h3>
              <div className="profile-avail-grid">
                {ALL_DAYS.map((day) => {
                  const dayData = editAvailability.find((a) => a.day === day);
                  const activeSlots = dayData?.slots ?? [];
                  return (
                    <div key={day} className="profile-avail-row">
                      <span className="profile-avail-day">{day}</span>
                      <div className="pill-group profile-avail-slots">
                        {TIME_SLOTS.map(({ key, label }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleAvailSlot(day, key)}
                            className={`pill${activeSlots.includes(key) ? " active" : ""}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </>
        )}
      </div>
    );
  }

  // ── View mode (has carer profile) ──
  const isProfileLocked = (user.profileVisibility ?? "locked") === "locked";
  const hasServices = carer && carer.services.length > 0;

  return (
    <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
      {/* Locked provider banner */}
      {isProfileLocked && hasServices && (
        <section
          className="flex items-start gap-md rounded-panel p-md border border-edge-regular"
          style={{ background: "var(--warning-subtle, var(--surface-inset))" }}
        >
          <Info size={20} weight="light" className="text-fg-secondary shrink-0 mt-xs" />
          <div className="flex flex-col gap-xs flex-1">
            <p className="text-sm text-fg-primary m-0">
              Your profile is private — only people you&apos;ve marked as Familiar or Connected with can see your services.
            </p>
            <ButtonAction
              variant="outline"
              size="sm"
              onClick={onUnlockProfile}
            >
              Make profile public
            </ButtonAction>
          </div>
        </section>
      )}

      {/* Care offering — view-mode summary card.
          Surfaces the current audience state (circle vs anyone) so an
          owner can see their setting at a glance without entering edit
          mode. The "Open to helping" pill that previously lived here
          was removed in the C6 sweep (2026-05-11); the Carer Identity
          badge on the hero carries the role + audience signal in the
          page-level chrome, but that's far from the services context —
          this card pairs the audience state with its descriptive
          consequence right above the carer bio.

          Icon: UsersThree for circle (mirrors the explainer card on
          `/profile/[userId]` services for the same state); Globe for
          public/discoverable. */}
      <section>
        <h3 className="profile-card-subtitle">Offering care</h3>
        <div
          className="flex items-start gap-md rounded-form"
          style={{
            padding: "var(--space-md)",
            background: "var(--surface-top)",
            border: "1px solid var(--border-regular)",
          }}
        >
          {visibility ? (
            <Globe
              size={20}
              weight="fill"
              className="shrink-0"
              style={{ color: "var(--brand-strong)", marginTop: 2 }}
            />
          ) : (
            <UsersThree
              size={20}
              weight="fill"
              className="shrink-0"
              style={{ color: "var(--brand-strong)", marginTop: 2 }}
            />
          )}
          <div className="flex flex-col gap-xxs">
            <p className="text-sm font-semibold text-fg-primary m-0">
              {visibility ? "Open to anyone" : "Connected circle only"}
            </p>
            <p className="text-sm text-fg-secondary m-0 leading-snug">
              {visibility
                ? "Your services are discoverable in Discover by anyone in Prague."
                : "Only people you're Connected with can see and book your services."}
            </p>
          </div>
        </div>
      </section>

      {/* Carer bio */}
      {carer?.bio && (
        <section>
          <h3 className="profile-card-subtitle">Care bio</h3>
          <p className="profile-card-copy">{carer.bio}</p>
        </section>
      )}

      {/* Services — comprehensive catalogue (Care + Meet + Appointment). View
          mode is the "what owners see" preview: disabled / soft-archived
          services are hidden. Tap routing for booking lives on
          /profile/[userId] where viewers act. */}
      {(() => {
        const liveServices = (carer?.services ?? []).filter((s) => s.enabled);
        if (!carer || liveServices.length === 0) return null;
        const careServices = liveServices.filter(
          (s): s is CarerCareServiceConfig => s.kind === "care",
        );
        const meetServices = liveServices.filter(
          (s): s is CarerMeetServiceConfig => s.kind === "meet",
        );
        const appointmentServices = liveServices.filter(
          (s): s is CarerAppointmentServiceConfig => s.kind === "appointment",
        );
        return (
          <section>
            <h3 className="profile-card-subtitle">Services</h3>
            <div className="profile-services-list">
              {careServices.map((svc) => (
                <div key={svc.serviceType} className="profile-service-card">
                  <div className="profile-service-top">
                    <span className="profile-service-name">
                      {SERVICE_LABELS[svc.serviceType]}
                    </span>
                    <div className="profile-service-price-wrap">
                      <span className="profile-service-price">
                        {svc.pricePerUnit.toLocaleString()} Kč
                        <span className="profile-service-unit">
                          {" "}/ {svc.priceUnit === "per_visit" ? "visit" : "night"}
                        </span>
                      </span>
                    </div>
                  </div>
                  {svc.subServices.length > 0 && (
                    <div className="profile-service-subs">
                      {svc.subServices.map((sub) => (
                        <span key={sub} className="chip">{sub}</span>
                      ))}
                    </div>
                  )}
                  {svc.notes && (
                    <p className="profile-service-notes">{svc.notes}</p>
                  )}
                </div>
              ))}
              {meetServices.map((svc) => {
                // B7 — linked-meet schedule grounding. Without this the card
                // shows only format / cadence chips with no scheduled-time
                // anchor; resolving `linkedMeetIds` surfaces when and where.
                const linkedMeets = svc.linkedMeetIds.flatMap((id) => {
                  const m = mockMeets.find((meet) => meet.id === id);
                  return m ? [m] : [];
                });
                return (
                  <div key={svc.id} className="profile-service-card">
                    <div className="profile-service-top">
                      <span className="profile-service-name">{svc.title}</span>
                      <div className="profile-service-price-wrap">
                        <span className="profile-service-price">
                          {svc.pricePerSession.toLocaleString()} Kč
                          <span className="profile-service-unit">{" "}/ session</span>
                        </span>
                      </div>
                    </div>
                    <div className="profile-service-subs">
                      <span className="chip">
                        {MEET_FORMAT_LABEL[svc.format] ?? svc.format}
                      </span>
                      <span className="chip">
                        {MEET_CADENCE_LABEL[svc.cadence] ?? svc.cadence}
                      </span>
                      <span className="chip">{svc.durationMinutes} min</span>
                    </div>
                    {linkedMeets.length > 0 && (
                      <div
                        className="flex flex-col gap-xxs"
                        style={{ marginTop: 4 }}
                      >
                        {linkedMeets.map((meet) => (
                          <span
                            key={meet.id}
                            className="flex items-center gap-xs text-xs text-fg-tertiary"
                          >
                            <CalendarBlank
                              size={13}
                              weight="light"
                              className="shrink-0"
                            />
                            <span>
                              {meetScheduleSummary(meet)} · {meet.location}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                    {svc.notes && (
                      <p className="profile-service-notes">{svc.notes}</p>
                    )}
                  </div>
                );
              })}
              {appointmentServices.map((svc) => (
                <div key={svc.id} className="profile-service-card">
                  <div className="profile-service-top">
                    <span className="profile-service-name">{svc.title}</span>
                    <div className="profile-service-price-wrap">
                      <span className="profile-service-price">
                        {svc.pricePerAppointment.toLocaleString()} Kč
                        <span className="profile-service-unit">
                          {" "}/ appointment
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="profile-service-subs">
                    <span className="chip">
                      {APPOINTMENT_CATEGORY_LABEL[svc.appointmentCategory] ??
                        svc.appointmentCategory}
                    </span>
                    <span className="chip">{svc.durationMinutes} min</span>
                  </div>
                  {svc.notes && (
                    <p className="profile-service-notes">{svc.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Availability */}
      {carer && (
        <section>
          <h3 className="profile-card-subtitle">Availability</h3>
          <AvailabilityGrid carer={carer} />
        </section>
      )}

      {/* Reviews — placeholder until the booking-review loop wires up. Lives
          inside the Services tab because reviews are about service quality. */}
      <section>
        <h3 className="profile-card-subtitle">Reviews</h3>
        <p className="profile-card-copy text-fg-secondary">
          No reviews yet. Reviews will appear here once you complete bookings.
        </p>
      </section>
    </div>
  );
}
