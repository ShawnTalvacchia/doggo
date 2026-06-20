"use client";

import { useEffect, useState } from "react";
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
import { PricedToggleRow } from "@/components/ui/PricedToggleRow";
import { AvailabilityGrid } from "@/components/profile/AvailabilityGrid";
import { MeetServiceEditCard } from "@/components/profile/MeetServiceEditCard";
import { AppointmentServiceEditCard } from "@/components/profile/AppointmentServiceEditCard";
import { DeleteServiceModal } from "@/components/profile/DeleteServiceModal";
import { ArchivedServiceStrip } from "@/components/profile/ArchivedServiceStrip";
import { SERVICE_LABELS, SUB_SERVICES } from "@/lib/constants/services";
import { defaultModifiers } from "@/lib/pricing";
import { mockMeets, getHostedMeets } from "@/lib/mockMeets";
import { meetScheduleSummary } from "@/lib/meetUtils";
import { getShelterById } from "@/lib/mockShelters";
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
  WalkDeliveryOption,
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
  mentor_session: 3,
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

// View-mode availability grid lives in `components/profile/AvailabilityGrid`
// (imported above). Was a local duplicate that drifted from the shared
// component — own profile rendered `.pill`/`.pill.active`, other-user
// profile rendered `.profile-avail-slot`. Unified 2026-06-08 so both
// surfaces look identical. Edit mode still uses an inline render below
// (interactive togglable buttons — distinct contract from view).

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

  // ── "Just added" feedback (walkthrough B6, 2026-05-16) ──
  // Cards render sorted by kind (Care → Meet → Appointment), so a card added
  // via "+ Session offering" / "+ Appointment" can land *above* the button
  // that created it — looking, at a glance, like nothing happened. Track the
  // newest card's DOM id, scroll it into view, and flash it (CSS animation).
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!justAddedId) return;
    const el = document.getElementById(justAddedId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [justAddedId]);

  // ── Delete-confirmation modal (walkthrough B6, 2026-05-16) ──
  // Each service card carries its own red trash, packed close together — a
  // confirm step lets the carer double-check they tapped the right one before
  // anything is removed. Holds the `editServices` index of the pending delete.
  const [pendingDeleteIdx, setPendingDeleteIdx] = useState<number | null>(null);

  // Bottom "Archived services" accordion — collapsed by default. Holds
  // services archived in a *prior* edit session (walkthrough B6, 2026-05-16).
  const [archivedOpen, setArchivedOpen] = useState(false);

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
    setJustAddedId(`svc-card-care-${type}`);
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
    setJustAddedId(`svc-card-${newSvc.id}`);
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
    setJustAddedId(`svc-card-${newSvc.id}`);
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
      (s) => s.kind !== "care" && s.id === id,
    );
  }

  // True when a service was *already archived* in the saved snapshot — i.e.
  // archived in a prior edit session, not just now. These collapse into the
  // bottom "Archived services" accordion; a service archived *this* session
  // stays inline (with its Undo) so the just-done action stays recoverable.
  function wasArchivedBefore(id: string): boolean {
    return (user.carerProfile?.services ?? []).some(
      (s) => s.kind !== "care" && s.id === id && !!s.softDeletedAt,
    );
  }

  function isPreviouslyArchived(svc: CarerServiceConfig): boolean {
    if (svc.kind === "care") return false;
    return !!svc.softDeletedAt && wasArchivedBefore(svc.id);
  }

  // Display name for a service across all four kinds.
  function serviceDisplayTitle(svc: CarerServiceConfig): string {
    if (svc.kind === "care") return SERVICE_LABELS[svc.serviceType];
    if (svc.kind === "appointment") return svc.title || "Untitled appointment";
    if (svc.kind === "mentor_session") return svc.title || "Mentored shelter walk";
    return svc.title || "Untitled session";
  }

  // True when removing `svc` soft-archives it (keeps it restorable, existing
  // bookings keep running) rather than hard-deleting. Care never archives;
  // a service added this session has no bookings → hard-delete.
  function willSoftArchive(svc: CarerServiceConfig): boolean {
    if (svc.kind === "care") return false;
    const fresh = !wasPreExisting(svc.id);
    if (fresh) return false;
    if (svc.kind === "meet") return meetServiceHasRoster(svc);
    // Appointment + mentor-session bookings reference the service id, so
    // a pre-existing entry archives rather than hard-deletes.
    return true;
  }

  function deleteServiceAt(idx: number) {
    const svc = editServices[idx];
    if (willSoftArchive(svc) && svc.kind !== "care") {
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
                  // Previously-archived services drop to the bottom accordion;
                  // active + freshly-archived ones stay in the main list.
                  .filter(({ svc }) => !isPreviouslyArchived(svc))
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
                          onDelete={() => setPendingDeleteIdx(idx)}
                          onUndoArchive={() => undoArchiveAt(idx)}
                          hostedMeets={hostedMeets}
                          requiredByMeet={requiredByMeetFor(svc.id)}
                          onChangeRequired={(meetId, req) =>
                            setRequiredLink(svc.id, meetId, req)
                          }
                          isNew={justAddedId === `svc-card-${svc.id}`}
                        />
                      );
                    }
                    if (svc.kind === "appointment") {
                      return (
                        <AppointmentServiceEditCard
                          key={svc.id}
                          service={svc}
                          onChange={(next) => updateServiceAt(idx, next)}
                          onDelete={() => setPendingDeleteIdx(idx)}
                          onUndoArchive={() => undoArchiveAt(idx)}
                          isNew={justAddedId === `svc-card-${svc.id}`}
                        />
                      );
                    }
                    if (svc.kind === "mentor_session") {
                      // Mentor offerings are read-only in edit mode —
                      // authoring UI is deferred (Cross-Shelter Mentor
                      // Network: eligibility gates on platform Super
                      // Volunteer status + per-shelter participation,
                      // which the self-serve editor doesn't model yet).
                      return (
                        <div key={svc.id} className="profile-service-card">
                          <div className="flex items-center justify-between">
                            <h3 className="profile-card-subtitle m-0">{svc.title}</h3>
                            <span className="text-xs text-fg-tertiary">
                              {svc.pricePerSession.toLocaleString()} Kč / session
                            </span>
                          </div>
                          <p className="text-xs text-fg-tertiary m-0">
                            Mentor offering — managed with the shelters you mentor
                            at. Editing arrives with the mentor tools.
                          </p>
                        </div>
                      );
                    }
                    // Care service — inline card (PetEditCard-style: header
                    // with the fixed service-type label + red trash, then
                    // full-width body fields).
                    const subServiceOptions =
                      SUB_SERVICES[svc.serviceType] ?? [];
                    // Day-care half-day opt-in (Workstream A4). When the carer
                    // offers a half_day option the pricing engine resolves it
                    // via `durationOptions`; absent, day_care stays single-rate
                    // on `pricePerUnit` (the legacy shape).
                    const halfDayEnabled =
                      svc.serviceType === "day_care" &&
                      (svc.durationOptions?.some(
                        (o) => o.duration === "half_day",
                      ) ?? false);
                    const halfDayOption = svc.durationOptions?.find(
                      (o) => o.duration === "half_day",
                    );
                    // Walk delivery-options editor (Workstream A4, O1). Carer
                    // offers drop-off, pickup, or both — each priced. Legacy
                    // walks (no deliveryOptions) read as a single drop-off at
                    // pricePerUnit. The standalone Price field is replaced by
                    // these rows for walks so there's no double-price confusion.
                    const isWalk = svc.serviceType === "walks_checkins";
                    const dropoffOpt = svc.deliveryOptions?.find(
                      (o) => o.method === "dropoff",
                    );
                    const pickupOpt = svc.deliveryOptions?.find(
                      (o) => o.method === "pickup",
                    );
                    const dropoffEnabled = svc.deliveryOptions
                      ? !!dropoffOpt
                      : true; // legacy fallback = single drop-off
                    const pickupEnabled = !!pickupOpt;
                    const dropoffPrice = dropoffOpt?.price ?? svc.pricePerUnit;
                    const pickupPrice =
                      pickupOpt?.price ?? Math.round(dropoffPrice * 1.2);
                    // Rebuild deliveryOptions + keep pricePerUnit pointed at the
                    // base (drop-off if offered, else pickup) so fallback
                    // surfaces still have a sane single rate.
                    const applyDelivery = (
                      dropOn: boolean,
                      dropPrice: number,
                      pickOn: boolean,
                      pickPrice: number,
                    ) => {
                      const opts: WalkDeliveryOption[] = [];
                      if (dropOn) opts.push({ method: "dropoff", price: dropPrice });
                      if (pickOn) opts.push({ method: "pickup", price: pickPrice });
                      updateCareService(idx, {
                        deliveryOptions: opts,
                        pricePerUnit: dropOn ? dropPrice : pickPrice,
                      });
                    };
                    return (
                      <div
                        key={`care-${svc.serviceType}`}
                        id={`svc-card-care-${svc.serviceType}`}
                        className={`profile-service-card${
                          justAddedId === `svc-card-care-${svc.serviceType}`
                            ? " profile-service-card--new"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="profile-card-subtitle m-0">
                            {SERVICE_LABELS[svc.serviceType]}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteIdx(idx)}
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

                        {isWalk ? (
                          <div className="flex flex-col gap-md">
                            <div className="flex flex-col gap-xs">
                              <label className="label">
                                <span className="label-primary-group">
                                  <span>Delivery &amp; pricing</span>
                                </span>
                              </label>
                              <p className="text-xs text-fg-tertiary m-0">
                                Offer one or both. Pickup usually costs more,
                                since you travel to the owner.
                              </p>
                            </div>
                            <PricedToggleRow
                              label="Drop-off"
                              description="Owner brings the dog"
                              checked={dropoffEnabled}
                              onToggle={(on) => {
                                // Keep at least one method enabled.
                                if (!on && !pickupEnabled) return;
                                applyDelivery(
                                  on,
                                  dropoffPrice,
                                  pickupEnabled,
                                  pickupPrice,
                                );
                              }}
                              price={dropoffPrice}
                              onPriceChange={(n) =>
                                applyDelivery(true, n, pickupEnabled, pickupPrice)
                              }
                              unitLabel="Kč / visit"
                              inputId={`dropoff-${idx}`}
                            />
                            <PricedToggleRow
                              label="Pickup"
                              description="You collect from the owner"
                              checked={pickupEnabled}
                              onToggle={(on) => {
                                if (!on && !dropoffEnabled) return;
                                applyDelivery(
                                  dropoffEnabled,
                                  dropoffPrice,
                                  on,
                                  // Seed pickup to a 20% travel surcharge over
                                  // drop-off when first enabled; carer tunes.
                                  on
                                    ? (pickupOpt?.price ??
                                      Math.round(dropoffPrice * 1.2))
                                    : pickupPrice,
                                );
                              }}
                              price={pickupPrice}
                              onPriceChange={(n) =>
                                applyDelivery(dropoffEnabled, dropoffPrice, true, n)
                              }
                              unitLabel="Kč / visit"
                              inputId={`pickup-${idx}`}
                            />
                          </div>
                        ) : (
                          <InputField
                            id={`price-${idx}`}
                            label={halfDayEnabled ? "Full-day price" : "Price"}
                            type="number"
                            value={svc.pricePerUnit.toString()}
                            onChange={(val) => {
                              const next = parseInt(val) || 0;
                              const updates: Partial<CarerCareServiceConfig> = {
                                pricePerUnit: next,
                              };
                              // Keep the full_day duration option in lockstep
                              // with the base rate so the pricing engine (which
                              // reads durationOptions when present) doesn't drift.
                              if (
                                svc.serviceType === "day_care" &&
                                svc.durationOptions?.length
                              ) {
                                updates.durationOptions =
                                  svc.durationOptions.map((o) =>
                                    o.duration === "full_day"
                                      ? { ...o, price: next }
                                      : o,
                                  );
                              }
                              updateCareService(idx, updates);
                            }}
                            trailing={`Kč / ${svc.priceUnit === "per_visit" ? "visit" : "night"}`}
                          />
                        )}

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

                        {svc.serviceType === "day_care" && (
                          <div className="flex flex-col gap-sm">
                            <Toggle
                              label="Offer a half-day rate"
                              size="sm"
                              checked={halfDayEnabled}
                              onChange={(on) => {
                                if (on) {
                                  updateCareService(idx, {
                                    durationOptions: [
                                      {
                                        duration: "full_day",
                                        price: svc.pricePerUnit,
                                      },
                                      {
                                        duration: "half_day",
                                        // Sensible starting point: 60% of the
                                        // full-day rate (carer tunes below).
                                        price: Math.round(
                                          svc.pricePerUnit * 0.6,
                                        ),
                                      },
                                    ],
                                  });
                                } else {
                                  // Drop duration options — day_care falls back
                                  // to the single full-day rate via pricePerUnit.
                                  updateCareService(idx, {
                                    durationOptions: undefined,
                                  });
                                }
                              }}
                            />
                            {halfDayEnabled && (
                              <InputField
                                id={`halfday-${idx}`}
                                label="Half-day price"
                                type="number"
                                value={(halfDayOption?.price ?? 0).toString()}
                                onChange={(val) => {
                                  const price = parseInt(val) || 0;
                                  updateCareService(idx, {
                                    durationOptions: (
                                      svc.durationOptions ?? []
                                    ).map((o) =>
                                      o.duration === "half_day"
                                        ? { ...o, price }
                                        : o,
                                    ),
                                  });
                                }}
                                trailing="Kč / half day"
                              />
                            )}
                            <p className="text-xs text-fg-tertiary m-0">
                              {halfDayEnabled
                                ? "Owners pick full or half day when they book."
                                : "Owners book a full day at your standard rate."}
                            </p>
                          </div>
                        )}

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

                {/* Archived services — collapsed bin (closed by default) for
                    services archived in a prior edit session. Services
                    archived *this* session stay inline above with their
                    Undo. Walkthrough B6, 2026-05-16. */}
                {(() => {
                  const archived = editServices
                    .map((svc, idx) => ({ svc, idx }))
                    .filter(({ svc }) => isPreviouslyArchived(svc));
                  if (archived.length === 0) return null;
                  return (
                    <div
                      className="flex flex-col gap-sm"
                      style={{
                        borderTop: "1px solid var(--border-subtle)",
                        paddingTop: "var(--space-md)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setArchivedOpen((v) => !v)}
                        className="flex items-center justify-between gap-sm text-sm font-semibold text-fg-secondary hover:text-brand-main"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "var(--space-xs) 0",
                        }}
                        aria-expanded={archivedOpen}
                      >
                        <span className="inline-flex items-center gap-xs">
                          Archived services
                          <span
                            className="inline-flex items-center rounded-pill bg-surface-inset text-fg-tertiary text-xs font-semibold"
                            style={{ padding: "1px var(--space-xs)" }}
                          >
                            {archived.length}
                          </span>
                        </span>
                        {archivedOpen ? (
                          <CaretUp size={14} weight="bold" />
                        ) : (
                          <CaretDown size={14} weight="bold" />
                        )}
                      </button>
                      {archivedOpen && (
                        <div className="flex flex-col gap-sm">
                          {archived.map(({ svc, idx }) => (
                            <ArchivedServiceStrip
                              key={svc.kind === "care" ? `care-${idx}` : svc.id}
                              title={serviceDisplayTitle(svc)}
                              onUndo={() => undoArchiveAt(idx)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
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

        {/* Delete-confirmation modal — names the exact service so the carer
            can verify they tapped the right trash, and surfaces the
            archive-vs-delete distinction. Walkthrough B6, 2026-05-16. */}
        {pendingDeleteIdx !== null &&
          editServices[pendingDeleteIdx] &&
          (() => {
            const svc = editServices[pendingDeleteIdx];
            const serviceLabel = serviceDisplayTitle(svc);
            const kindLabel =
              svc.kind === "care"
                ? "Care service"
                : svc.kind === "meet"
                  ? "Session offering"
                  : "Appointment";
            return (
              <DeleteServiceModal
                open
                onClose={() => setPendingDeleteIdx(null)}
                onConfirm={() => {
                  deleteServiceAt(pendingDeleteIdx);
                  setPendingDeleteIdx(null);
                }}
                serviceLabel={serviceLabel}
                kindLabel={kindLabel}
                willArchive={willSoftArchive(svc)}
              />
            );
          })()}
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
          <div className="flex flex-col gap-xs">
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
        const mentorServices = liveServices.filter(
          (s): s is import("@/lib/types").CarerMentorSessionServiceConfig =>
            s.kind === "mentor_session",
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
                        <span
                          key={sub}
                          className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary"
                        >
                          {sub}
                        </span>
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
                        className="flex flex-col gap-xs"
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
              {/* Mentor-session offerings — supervised first walks at
                  participating shelters (Cross-Shelter Mentor Network).
                  Shelter chips link the offering to where it runs. */}
              {mentorServices.map((svc) => (
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
                    <span className="chip">Shelter mentoring</span>
                    <span className="chip">{svc.durationMinutes} min</span>
                    {svc.shelterIds.map((sid) => {
                      const shelter = getShelterById(sid);
                      return shelter ? (
                        <span key={sid} className="chip">{shelter.name}</span>
                      ) : null;
                    })}
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
          <AvailabilityGrid availability={carer.availability} />
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
