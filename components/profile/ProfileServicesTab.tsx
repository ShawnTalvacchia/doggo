"use client";

import { useState } from "react";
import {
  Plus,
  Trash,
  Sparkle,
  PawPrint,
  Info,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { defaultModifiers } from "@/lib/pricing";
import { AvailabilityGrid } from "@/components/profile/AvailabilityGrid";
import type {
  UserProfile,
  CarerProfile,
  CarerServiceConfig,
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
  // them. Without this merge, the editor only shows what's already saved
  // and the provider can't enable a modifier that wasn't on the seed.
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
                  {(mod.kind === "holiday" ||
                    mod.kind === "weekend" ||
                    mod.kind === "last_minute") && (
                    <label className="profile-modifier-param">
                      <span>Surcharge</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          value={mod.pct}
                          onChange={(e) =>
                            updateModifier(idx, {
                              pct: Math.max(0, parseInt(e.target.value) || 0),
                            } as Partial<PricingModifier>)
                          }
                          min={0}
                          max={100}
                        />
                        <span className="profile-modifier-input-unit">%</span>
                      </span>
                    </label>
                  )}
                  {mod.kind === "multi_pet" && (
                    <label className="profile-modifier-param">
                      <span>Per extra pet</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          value={mod.flatPerExtra}
                          onChange={(e) =>
                            updateModifier(idx, {
                              flatPerExtra: Math.max(0, parseInt(e.target.value) || 0),
                            } as Partial<PricingModifier>)
                          }
                          min={0}
                        />
                        <span className="profile-modifier-input-unit">Kč</span>
                      </span>
                    </label>
                  )}
                  {mod.kind === "last_minute" && (
                    <label className="profile-modifier-param">
                      <span>Within</span>
                      <span className="profile-modifier-input-wrap">
                        <input
                          type="number"
                          value={mod.thresholdDays}
                          onChange={(e) =>
                            updateModifier(idx, {
                              thresholdDays: Math.max(1, parseInt(e.target.value) || 1),
                            } as Partial<PricingModifier>)
                          }
                          min={1}
                          max={30}
                        />
                        <span className="profile-modifier-input-unit">days</span>
                      </span>
                    </label>
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


// AvailabilityGrid (view mode) extracted to its own component — shared
// between own-profile and the public viewer profile. See
// `components/profile/AvailabilityGrid.tsx`.

// ── Props ────────────────────────────────────────────────────────────────────

interface ProfileServicesTabProps {
  user: UserProfile;
  editing: boolean;
  visibility: boolean;
  onToggleVisibility: () => void;
  openToHelping: boolean;
  onToggleOpenToHelping: (v: boolean) => void;
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
  editServices,
  onEditServices,
  editAvailability,
  onEditAvailability,
  editCarerBio,
  onEditCarerBio,
}: ProfileServicesTabProps) {
  const carer = user.carerProfile;
  const showCareContent = editing ? openToHelping : (carer !== undefined && (user.openToHelping ?? false));

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
    const available: ServiceType[] = (["walk_checkin", "inhome_sitting", "boarding"] as ServiceType[]).filter(
      (t) => !usedTypes.includes(t)
    );
    if (available.length === 0) return;
    onEditServices([
      ...editServices,
      {
        kind: "care",
        serviceType: available[0],
        enabled: true,
        pricePerUnit: 0,
        priceUnit: available[0] === "walk_checkin" ? "per_visit" : "per_night",
        subServices: [],
        modifiers: defaultModifiers(),
      },
    ]);
  }

  function toggleAvailSlot(day: DayOfWeek, slot: TimeSlot) {
    const existing = editAvailability.find((a) => a.day === day);
    if (existing) {
      const hasSlot = existing.slots.includes(slot);
      const newSlots = hasSlot ? existing.slots.filter((s) => s !== slot) : [...existing.slots, slot];
      if (newSlots.length === 0) {
        onEditAvailability(editAvailability.filter((a) => a.day !== day));
      } else {
        onEditAvailability(editAvailability.map((a) => (a.day === day ? { ...a, slots: newSlots } : a)));
      }
    } else {
      onEditAvailability([...editAvailability, { day, slots: [slot] }]);
    }
  }

  // ── Empty state: not offering care and not editing ──
  if (!showCareContent && !editing) {
    return (
      <div className="profile-content-width profile-section-stack">
        <section className="profile-info-card">
          <div className="flex flex-col items-center gap-md p-xl text-center">
            <Sparkle size={44} weight="light" className="text-fg-tertiary" />
            <h2 className="font-heading text-lg font-semibold text-fg-primary m-0">
              Open to helping?
            </h2>
            <p className="profile-card-copy text-fg-secondary">
              Turn on care offerings from your profile to help dogs in your community. Walks, sitting, boarding — you set the terms.
            </p>
            <p className="text-sm text-fg-tertiary">
              Tap &ldquo;Edit&rdquo; to get started.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ── Edit mode ──
  if (editing) {
    return (
      <div className="profile-content-width profile-section-stack">
        {/* Open to helping toggle */}
        <section className="profile-info-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="profile-visibility-label">Open to helping</p>
              <p className="profile-visibility-sub">
                {openToHelping
                  ? "Your connections can see you offer care."
                  : "You\u2019re not currently offering care."}
              </p>
            </div>
            <Toggle
              label="Open to helping"
              checked={openToHelping}
              onChange={onToggleOpenToHelping}
            />
          </div>
        </section>

        {openToHelping && (
          <>
            {/* Carer bio */}
            <section className="profile-info-card">
              <h3 className="profile-card-subtitle">Care bio</h3>
              <textarea
                className="w-full rounded-form border border-edge-regular bg-surface-base p-sm text-sm text-fg-primary"
                rows={3}
                value={editCarerBio}
                onChange={(e) => onEditCarerBio(e.target.value)}
                placeholder="Tell owners about your experience and approach..."
              />
            </section>

            {/* Services */}
            <section className="profile-info-card">
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="flex flex-col gap-md">
                {editServices.map((svc, idx) => (
                  <div key={idx} className="rounded-panel border border-edge-regular p-md flex flex-col gap-sm">
                    <div className="flex items-center justify-between gap-sm">
                      <select
                        className="flex-1 rounded-form border border-edge-regular bg-surface-base p-xs text-sm"
                        value={svc.serviceType}
                        onChange={(e) => updateService(idx, { serviceType: e.target.value as ServiceType, priceUnit: e.target.value === "walk_checkin" ? "per_visit" : "per_night" })}
                      >
                        {(["walk_checkin", "inhome_sitting", "boarding"] as ServiceType[]).map((t) => (
                          <option key={t} value={t}>{SERVICE_LABELS[t]}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeService(idx)}
                        className="text-fg-tertiary p-xs"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        aria-label="Remove service"
                      >
                        <Trash size={18} weight="light" />
                      </button>
                    </div>
                    <div className="flex items-center gap-sm">
                      <InputField
                        id={`price-${idx}`}
                        label="Price"
                        type="number"
                        value={svc.pricePerUnit.toString()}
                        onChange={(val) =>
                          updateService(idx, {
                            // Clamp to 0+ — negative base rate makes no
                            // sense. Pricing & Proposals walkthrough
                            // 2026-05-05.
                            pricePerUnit: Math.max(0, parseInt(val) || 0),
                          })
                        }
                      />
                      <span className="text-sm text-fg-secondary whitespace-nowrap" style={{ paddingTop: 20 }}>
                        Kč / {svc.priceUnit === "per_visit" ? "visit" : "night"}
                      </span>
                    </div>
                    <InputField
                      id={`notes-${idx}`}
                      label="Notes"
                      value={svc.notes ?? ""}
                      onChange={(val) => updateService(idx, { notes: val })}
                      helper="e.g. Max 3 dogs, 45-60 min walks"
                    />
                    <PricingModifiersEditor
                      modifiers={svc.modifiers ?? defaultModifiers()}
                      onChange={(mods) => updateService(idx, { modifiers: mods })}
                    />
                  </div>
                ))}
                {editServices.length < 3 && (
                  <button
                    onClick={addService}
                    className="flex items-center gap-xs text-sm font-medium text-brand-main"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
                  >
                    <Plus size={16} weight="bold" /> Add a service
                  </button>
                )}
              </div>
            </section>

            {/* Availability */}
            <section className="profile-info-card">
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

            {/* Visibility */}
            <section className="profile-info-card">
              <div className="profile-visibility-row">
                <div>
                  <p className="profile-visibility-label">Search visibility</p>
                  <p className="profile-visibility-sub">
                    {visibility
                      ? "Your profile appears in Explore search results."
                      : "Only your connections can see you offer care."}
                  </p>
                </div>
                <button
                  onClick={onToggleVisibility}
                  className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
                  style={{
                    background: visibility ? "var(--brand-subtle)" : "var(--surface-gray)",
                    color: visibility ? "var(--brand-strong)" : "var(--text-secondary)",
                    border: `1px solid ${visibility ? "var(--brand-main)" : "var(--border-regular)"}`,
                    cursor: "pointer",
                  }}
                >
                  {visibility ? "Public" : "Connections only"}
                </button>
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
    <div className="profile-content-width profile-section-stack">
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
              onClick={() => {
                /* In a real app, this would open the visibility toggle */
              }}
            >
              Make profile public
            </ButtonAction>
          </div>
        </section>
      )}

      {/* Open to helping badge */}
      <section className="profile-info-card">
        <div className="flex items-center gap-sm">
          <span className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
            style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}>
            <PawPrint size={16} weight="fill" /> Open to helping
          </span>
          <span className="text-sm text-fg-tertiary">
            {visibility ? "Visible on Explore" : "Connections only"}
          </span>
        </div>
      </section>

      {/* Carer bio */}
      {carer?.bio && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Care bio</h3>
          <p className="profile-card-copy">{carer.bio}</p>
        </section>
      )}

      {/* Services — comprehensive catalogue (Care + Meet). View mode on the
          user's OWN profile is informational; tap routing for booking lives
          on /profile/[userId] where viewers act. */}
      {carer && carer.services.length > 0 && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Services</h3>
          <div className="profile-services-list">
            {carer.services.filter((s): s is CarerCareServiceConfig => s.kind === "care").map((svc) => (
              <div key={svc.serviceType} className="profile-service-card">
                <div className="profile-service-top">
                  <span className="profile-service-name">
                    {SERVICE_LABELS[svc.serviceType]}
                  </span>
                  <div className="profile-service-price-wrap">
                    <span className="profile-service-price">
                      {/* "From" prefix when modifiers may bump the quote.
                          Modifier specifics surface in the proposal, not on
                          the catalogue card. Pricing & Proposals, 2026-05-04. */}
                      {(svc.modifiers ?? []).some((m) => m.enabled) && (
                        <span className="profile-service-price-from">From </span>
                      )}
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
            {carer.services.filter((s) => s.kind === "meet").map((svc) => {
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
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Availability</h3>
          <AvailabilityGrid availability={carer.availability} />
        </section>
      )}
    </div>
  );
}
