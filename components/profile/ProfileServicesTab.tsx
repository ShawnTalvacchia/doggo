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
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { InputField } from "@/components/ui/InputField";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { defaultModifiers } from "@/lib/pricing";
import type {
  UserProfile,
  CarerProfile,
  CarerCareServiceConfig,
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
  // Edit UI is Care-only — Meet-type offerings are added through a separate
  // flow (see Onboarding & In-Product Communication phase). The save handler
  // in `app/profile/page.tsx` preserves any existing Meet entries.
  editServices: CarerCareServiceConfig[];
  onEditServices: (s: CarerCareServiceConfig[]) => void;
  editAvailability: CarerAvailabilitySlot[];
  onEditAvailability: (a: CarerAvailabilitySlot[]) => void;
  editCarerBio: string;
  onEditCarerBio: (b: string) => void;
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
  editAvailability,
  onEditAvailability,
  editCarerBio,
  onEditCarerBio,
}: ProfileServicesTabProps) {
  const carer = user.carerProfile;
  const showCareContent = editing
    ? openToHelping
    : carer !== undefined && (user.openToHelping ?? false);

  // ── Helpers for editing services ──
  function updateService(idx: number, updates: Partial<CarerCareServiceConfig>) {
    const next = editServices.map((s, i) => (i === idx ? { ...s, ...updates } : s));
    onEditServices(next);
  }

  function removeService(idx: number) {
    onEditServices(editServices.filter((_, i) => i !== idx));
  }

  function addService() {
    const usedTypes = editServices.map((s) => s.serviceType);
    const available: ServiceType[] = SERVICE_TYPE_ORDER.filter(
      (t) => !usedTypes.includes(t),
    );
    if (available.length === 0) return;
    onEditServices([
      ...editServices,
      {
        kind: "care",
        serviceType: available[0],
        enabled: true,
        pricePerUnit: 0,
        priceUnit: available[0] === "walks_checkins" ? "per_visit" : "per_night",
        subServices: [],
        modifiers: defaultModifiers(),
      },
    ]);
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
          {/* Directional hint — pushed down with deliberate gap so it
              reads as a separate "next step" pointer rather than part of
              the description. 2026-05-11 (empty-state airiness pass). */}
          <p
            className="text-sm text-fg-tertiary m-0"
            style={{ marginTop: "var(--space-xxl)" }}
          >
            Tap &ldquo;Edit&rdquo; above to get started.
          </p>
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
          <h3 className="profile-card-subtitle">Offering care</h3>
          <p
            className="text-sm text-fg-secondary m-0"
            style={{ marginBottom: 12 }}
          >
            How do you want to offer care to your community?
          </p>
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

            {/* Services */}
            <section>
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="flex flex-col gap-md">
                {editServices.map((svc, idx) => {
                  // Available service types for this row = already-selected types
                  // elsewhere are excluded so the same service isn't listed twice.
                  const otherUsedTypes = editServices
                    .filter((_, i) => i !== idx)
                    .map((s) => s.serviceType);
                  const typeOptions = SERVICE_TYPE_ORDER.filter(
                    (t) => !otherUsedTypes.includes(t),
                  ).map((t) => ({ value: t, label: SERVICE_LABELS[t] }));

                  return (
                    <div
                      key={idx}
                      className="rounded-panel border border-edge-regular p-md flex flex-col gap-sm relative"
                    >
                      <div
                        className="absolute"
                        style={{ top: 8, right: 8 }}
                      >
                        <ButtonIcon
                          label="Remove service"
                          onClick={() => removeService(idx)}
                        >
                          <Trash size={18} weight="light" />
                        </ButtonIcon>
                      </div>
                      <div style={{ paddingRight: 40 }}>
                        <Select
                          id={`service-type-${idx}`}
                          label="Service type"
                          value={svc.serviceType}
                          onChange={(val) =>
                            updateService(idx, {
                              serviceType: val as ServiceType,
                              priceUnit:
                                val === "walks_checkins" ? "per_visit" : "per_night",
                            })
                          }
                          options={typeOptions}
                        />
                      </div>
                      <InputField
                        id={`price-${idx}`}
                        label="Price"
                        type="number"
                        value={svc.pricePerUnit.toString()}
                        onChange={(val) =>
                          updateService(idx, { pricePerUnit: parseInt(val) || 0 })
                        }
                        trailing={`Kč / ${svc.priceUnit === "per_visit" ? "visit" : "night"}`}
                      />
                      <InputField
                        id={`notes-${idx}`}
                        label="Notes"
                        value={svc.notes ?? ""}
                        onChange={(val) => updateService(idx, { notes: val })}
                        helper="e.g. Max 3 dogs, 45-60 min walks"
                      />
                      <PricingModifiersEditor
                        modifiers={svc.modifiers ?? []}
                        onChange={(m) => updateService(idx, { modifiers: m })}
                      />
                    </div>
                  );
                })}
                {editServices.length < 3 && (
                  <ButtonAction
                    variant="tertiary"
                    size="sm"
                    leftIcon={<Plus size={14} weight="bold" />}
                    onClick={addService}
                  >
                    Add a service
                  </ButtonAction>
                )}
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

      {/* Services — comprehensive catalogue (Care + Meet). View mode on the
          user's OWN profile is informational; tap routing for booking lives
          on /profile/[userId] where viewers act. */}
      {carer && carer.services.length > 0 && (
        <section>
          <h3 className="profile-card-subtitle">Services</h3>
          <div className="profile-services-list">
            {carer.services
              .filter((s): s is CarerCareServiceConfig => s.kind === "care")
              .map((svc) => (
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
            {carer.services
              .filter((s) => s.kind === "meet")
              .map((svc) => {
                const formatLabel: Record<string, string> = {
                  one_on_one: "1-on-1",
                  small_group: "Small group",
                  workshop: "Workshop",
                };
                const cadenceLabel: Record<string, string> = {
                  weekly: "Weekly",
                  biweekly: "Every 2 weeks",
                  monthly: "Monthly",
                  ad_hoc: "By arrangement",
                };
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
                      <span className="chip">{formatLabel[svc.format] ?? svc.format}</span>
                      <span className="chip">{cadenceLabel[svc.cadence] ?? svc.cadence}</span>
                      <span className="chip">{svc.durationMinutes} min</span>
                    </div>
                    {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
                  </div>
                );
              })}
          </div>
        </section>
      )}

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
