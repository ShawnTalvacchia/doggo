"use client";

import {
  Plus,
  Trash,
  Sparkle,
  PawPrint,
} from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type {
  UserProfile,
  CarerProfile,
  CarerServiceConfig,
  CarerAvailabilitySlot,
  ServiceType,
  TimeSlot,
  DayOfWeek,
} from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS: { key: TimeSlot; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

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
  onToggleVisibility: () => void;
  openToHelping: boolean;
  onToggleOpenToHelping: (v: boolean) => void;
  editServices: CarerServiceConfig[];
  onEditServices: (s: CarerServiceConfig[]) => void;
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
  function updateService(idx: number, updates: Partial<CarerServiceConfig>) {
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
        serviceType: available[0],
        enabled: true,
        pricePerUnit: 0,
        priceUnit: available[0] === "walk_checkin" ? "per_visit" : "per_night",
        subServices: [],
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
                        onChange={(val) => updateService(idx, { pricePerUnit: parseInt(val) || 0 })}
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
  return (
    <div className="profile-content-width profile-section-stack">
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

      {/* Services */}
      {carer && carer.services.length > 0 && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Services</h3>
          <div className="profile-services-list">
            {carer.services.map((svc) => (
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
          </div>
        </section>
      )}

      {/* Availability */}
      {carer && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Availability</h3>
          <AvailabilityGrid carer={carer} />
        </section>
      )}
    </div>
  );
}
