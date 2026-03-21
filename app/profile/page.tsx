"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  ListBullets,
  Sparkle,
  Trash,
  ImageSquare,
  MagnifyingGlass,
  PawPrint,
  Lightning,
  Heart,
  Stethoscope,
  Camera,
  ShieldCheck,
  CaretRight,
  Dog,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { ProfileHeaderOwn } from "@/components/profile/ProfileHeaderOwn";
import type {
  PetProfile,
  CarerProfile,
  UserProfile,
  TimeSlot,
  DayOfWeek,
  EnergyLevel,
  PlayStyle,
  VetInfo,
} from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { mockUser } from "@/lib/mockUser";
import { mockConnections, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";

// ── Constants ──────────────────────────────────────────────────────────────────

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS: { key: TimeSlot; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

type ProfileTab = "about" | "services" | "reviews";

const SIZE_OPTIONS = [
  "Toy (under 5kg)",
  "Small (5–10kg)",
  "Medium (10–25kg)",
  "Large (25–45kg)",
  "Giant (45kg+)",
];

const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "Low energy",
  moderate: "Moderate",
  high: "High energy",
  very_high: "Very high energy",
};

const ENERGY_COLORS: Record<EnergyLevel, { bg: string; fg: string }> = {
  low: { bg: "var(--status-info-light)", fg: "var(--status-info-main)" },
  moderate: { bg: "var(--status-success-light)", fg: "var(--status-success-main)" },
  high: { bg: "var(--status-warning-light)", fg: "var(--status-warning-main)" },
  very_high: { bg: "var(--status-error-light)", fg: "var(--status-error-main)" },
};

const PLAY_STYLE_LABELS: Record<PlayStyle, string> = {
  fetch: "Fetch lover",
  tug: "Tug-of-war",
  chase: "Chase games",
  wrestling: "Play wrestling",
  gentle: "Gentle player",
  independent: "Independent",
  sniffing: "Sniff explorer",
};

const ALL_PLAY_STYLES: PlayStyle[] = [
  "fetch", "tug", "chase", "wrestling", "gentle", "independent", "sniffing",
];

const ENERGY_OPTIONS: EnergyLevel[] = ["low", "moderate", "high", "very_high"];

// ── Pet card (view) ──────────────────────────────────────────────────────────

function PetCard({ pet, onExpand }: { pet: PetProfile; onExpand?: () => void }) {
  return (
    <div className="pet-profile-card">
      {/* Header: photo + identity */}
      <div className="pet-profile-header">
        <div className="pet-profile-avatar-wrap">
          <img src={pet.imageUrl} alt={pet.name} className="pet-profile-avatar" />
          {pet.photoGallery && pet.photoGallery.length > 0 && (
            <span className="pet-profile-photo-count">
              <Camera size={11} weight="fill" />
              {pet.photoGallery.length + 1}
            </span>
          )}
        </div>
        <div className="pet-profile-identity">
          <h4 className="pet-profile-name">{pet.name}</h4>
          <p className="pet-profile-breed">{pet.breed}</p>
          <p className="pet-profile-meta">
            {pet.weightLabel} · {pet.ageLabel}
          </p>
        </div>
      </div>

      {/* Badges row: energy + play styles */}
      {(pet.energyLevel || (pet.playStyles && pet.playStyles.length > 0)) && (
        <div className="pet-profile-badges">
          {pet.energyLevel && (
            <span
              className="pet-profile-energy-pill"
              style={{
                background: ENERGY_COLORS[pet.energyLevel].bg,
                color: ENERGY_COLORS[pet.energyLevel].fg,
              }}
            >
              <Lightning size={12} weight="fill" />
              {ENERGY_LABELS[pet.energyLevel]}
            </span>
          )}
          {pet.playStyles?.map((ps) => (
            <span key={ps} className="pet-profile-play-pill">
              {PLAY_STYLE_LABELS[ps]}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {pet.notes && <p className="pet-profile-notes">{pet.notes}</p>}

      {/* Socialisation */}
      {pet.socialisationNotes && (
        <div className="pet-profile-section">
          <div className="pet-profile-section-header">
            <Heart size={14} weight="fill" className="text-brand-main" />
            <span>Socialisation</span>
          </div>
          <p className="pet-profile-section-text">{pet.socialisationNotes}</p>
        </div>
      )}

      {/* Vet / Health summary */}
      {pet.vetInfo && (
        <div className="pet-profile-section">
          <div className="pet-profile-section-header">
            <Stethoscope size={14} weight="fill" className="text-brand-main" />
            <span>Health & vet</span>
          </div>
          <div className="pet-profile-health-grid">
            {pet.vetInfo.vaccinationsUpToDate && (
              <span className="pet-profile-health-tag pet-profile-health-tag--good">
                <ShieldCheck size={13} weight="fill" /> Vaccinations up to date
              </span>
            )}
            {pet.vetInfo.spayedNeutered && (
              <span className="pet-profile-health-tag pet-profile-health-tag--good">
                <ShieldCheck size={13} weight="fill" /> Spayed / neutered
              </span>
            )}
            {pet.vetInfo.conditions && (
              <span className="pet-profile-health-tag pet-profile-health-tag--note">
                {pet.vetInfo.conditions}
              </span>
            )}
          </div>
          {pet.vetInfo.clinicName && (
            <p className="pet-profile-vet-line">
              {pet.vetInfo.clinicName}
              {pet.vetInfo.lastCheckup && (
                <> · Last visit {new Date(pet.vetInfo.lastCheckup).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</>
              )}
            </p>
          )}
        </div>
      )}

      {/* Photo gallery thumbnails */}
      {pet.photoGallery && pet.photoGallery.length > 0 && (
        <div className="pet-profile-gallery">
          {[pet.imageUrl, ...pet.photoGallery].map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${pet.name} photo ${i + 1}`}
              className="pet-profile-gallery-thumb"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pet edit card (matches signup flow style) ───────────────────────────────

function PetEditCard({
  pet,
  onChange,
  onDelete,
}: {
  pet: PetProfile;
  onChange: (updated: PetProfile) => void;
  onDelete: () => void;
}) {
  const vetInfo = pet.vetInfo ?? {
    clinicName: "",
    vetPhone: "",
    lastCheckup: "",
    vaccinationsUpToDate: false,
    spayedNeutered: false,
    medications: "",
    conditions: "",
  };

  function updateVet(updates: Partial<VetInfo>) {
    onChange({ ...pet, vetInfo: { ...vetInfo, ...updates } });
  }

  return (
    <div className="pet-card" style={{ position: "relative" }}>
      {/* Top row: photo + name/breed */}
      <div className="form-row">
        <div className="form-col-sm">
          <div className="input-block">
            <label className="label">
              <span className="label-primary-group">
                <span>Pet Photo</span>
              </span>
            </label>
            {pet.imageUrl && !pet.imageUrl.includes("placeholder") ? (
              <img
                src={pet.imageUrl}
                alt={pet.name}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            ) : (
              <button
                className="pet-photo-upload"
                type="button"
                aria-label="Upload pet photo"
              >
                <ImageSquare size={56} weight="light" />
                <span>Upload or drag here</span>
              </button>
            )}
          </div>
        </div>
        <div
          className="form-col"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <InputField
            id={`pet-name-${pet.id}`}
            label="Dog's name"
            value={pet.name}
            onChange={(v) => onChange({ ...pet, name: v })}
            placeholder="e.g. Luna"
          />
          <div className="input-block">
            <label className="label" htmlFor={`pet-breed-${pet.id}`}>
              <span className="label-primary-group">
                <span>Breed</span>
              </span>
            </label>
            <div className="input-with-icon">
              <input
                id={`pet-breed-${pet.id}`}
                className="input"
                placeholder="e.g. Corgi + Mix"
                value={pet.breed}
                onChange={(e) => onChange({ ...pet, breed: e.target.value })}
              />
              <span className="input-trailing-icon">
                <MagnifyingGlass size={20} weight="light" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Size + Age */}
      <div className="two-col">
        <div className="input-block">
          <label className="label" htmlFor={`pet-size-${pet.id}`}>
            <span className="label-primary-group">
              <span>Size</span>
            </span>
          </label>
          <select
            id={`pet-size-${pet.id}`}
            className="input select"
            value={pet.weightLabel || ""}
            onChange={(e) => onChange({ ...pet, weightLabel: e.target.value })}
          >
            <option value="">Select size</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <InputField
          id={`pet-age-${pet.id}`}
          label="Age"
          value={pet.ageLabel}
          onChange={(v) => onChange({ ...pet, ageLabel: v })}
          placeholder="e.g. 4 years"
        />
      </div>

      {/* Energy level + Play style */}
      <div className="two-col">
        <div className="input-block">
          <label className="label" htmlFor={`pet-energy-${pet.id}`}>
            <span className="label-primary-group">
              <Lightning size={14} weight="light" />
              <span>Energy level</span>
            </span>
          </label>
          <select
            id={`pet-energy-${pet.id}`}
            className="input select"
            value={pet.energyLevel || ""}
            onChange={(e) =>
              onChange({ ...pet, energyLevel: (e.target.value || undefined) as EnergyLevel | undefined })
            }
          >
            <option value="">Select level</option>
            {ENERGY_OPTIONS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {ENERGY_LABELS[lvl]}
              </option>
            ))}
          </select>
        </div>
        <div /> {/* spacer for alignment */}
      </div>

      {/* Play styles (multi-select pills) */}
      <div className="input-block">
        <label className="label">
          <span className="label-primary-group">
            <Dog size={14} weight="light" />
            <span>Play style</span>
          </span>
        </label>
        <div className="pill-group" style={{ flexWrap: "wrap" }}>
          {ALL_PLAY_STYLES.map((ps) => {
            const active = pet.playStyles?.includes(ps);
            return (
              <button
                key={ps}
                type="button"
                className={`pill${active ? " active" : ""}`}
                onClick={() => {
                  const current = pet.playStyles ?? [];
                  const next = active
                    ? current.filter((s) => s !== ps)
                    : [...current, ps];
                  onChange({ ...pet, playStyles: next });
                }}
              >
                {PLAY_STYLE_LABELS[ps]}
              </button>
            );
          })}
        </div>
      </div>

      {/* General notes */}
      <div className="input-block">
        <label className="label" htmlFor={`pet-notes-${pet.id}`}>
          <span className="label-primary-group">
            <span>General notes</span>
          </span>
        </label>
        <textarea
          id={`pet-notes-${pet.id}`}
          className="textarea"
          placeholder="Temperament, habits, or anything carers should know"
          value={pet.notes || ""}
          onChange={(e) => onChange({ ...pet, notes: e.target.value })}
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Socialisation notes */}
      <div className="input-block">
        <label className="label" htmlFor={`pet-social-${pet.id}`}>
          <span className="label-primary-group">
            <Heart size={14} weight="light" />
            <span>Socialisation notes</span>
          </span>
        </label>
        <textarea
          id={`pet-social-${pet.id}`}
          className="textarea"
          placeholder="How they are with other dogs, people, and kids"
          value={pet.socialisationNotes || ""}
          onChange={(e) => onChange({ ...pet, socialisationNotes: e.target.value })}
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Vet / Health section */}
      <fieldset
        className="pet-edit-health-fieldset"
        style={{
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 14px 14px",
          margin: 0,
        }}
      >
        <legend
          className="flex items-center gap-xs text-sm font-medium text-fg-primary"
          style={{ padding: "0 6px" }}
        >
          <Stethoscope size={14} weight="light" />
          Health & vet info
        </legend>

        <div className="two-col" style={{ marginTop: 8 }}>
          <InputField
            id={`pet-vet-clinic-${pet.id}`}
            label="Vet clinic"
            value={vetInfo.clinicName || ""}
            onChange={(v) => updateVet({ clinicName: v })}
            placeholder="e.g. VetClinic Praha 2"
          />
          <InputField
            id={`pet-vet-phone-${pet.id}`}
            label="Vet phone"
            value={vetInfo.vetPhone || ""}
            onChange={(v) => updateVet({ vetPhone: v })}
            placeholder="+420 ..."
          />
        </div>

        <div className="two-col">
          <InputField
            id={`pet-vet-checkup-${pet.id}`}
            label="Last checkup"
            value={vetInfo.lastCheckup || ""}
            onChange={(v) => updateVet({ lastCheckup: v })}
            placeholder="YYYY-MM-DD"
          />
          <div /> {/* spacer */}
        </div>

        <div className="flex flex-col gap-xs" style={{ marginTop: 4 }}>
          <CheckboxRow
            id={`pet-vax-${pet.id}`}
            label="Vaccinations up to date"
            checked={vetInfo.vaccinationsUpToDate}
            onChange={(v) => updateVet({ vaccinationsUpToDate: v })}
          />
          <CheckboxRow
            id={`pet-spay-${pet.id}`}
            label="Spayed / neutered"
            checked={vetInfo.spayedNeutered}
            onChange={(v) => updateVet({ spayedNeutered: v })}
          />
        </div>

        <div className="input-block" style={{ marginTop: 8 }}>
          <label className="label" htmlFor={`pet-meds-${pet.id}`}>
            <span className="label-primary-group">
              <span>Medications</span>
            </span>
          </label>
          <textarea
            id={`pet-meds-${pet.id}`}
            className="textarea"
            placeholder="Current medications (if any)"
            value={vetInfo.medications || ""}
            onChange={(e) => updateVet({ medications: e.target.value })}
            style={{ minHeight: 48 }}
          />
        </div>

        <div className="input-block" style={{ marginTop: 8 }}>
          <label className="label" htmlFor={`pet-conditions-${pet.id}`}>
            <span className="label-primary-group">
              <span>Known conditions</span>
            </span>
          </label>
          <textarea
            id={`pet-conditions-${pet.id}`}
            className="textarea"
            placeholder="Allergies, conditions, or special care needs"
            value={vetInfo.conditions || ""}
            onChange={(e) => updateVet({ conditions: e.target.value })}
            style={{ minHeight: 48 }}
          />
        </div>
      </fieldset>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="flex items-center justify-center"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--status-error-main)",
          padding: 4,
        }}
        title="Remove pet"
      >
        <Trash size={18} weight="light" />
      </button>
    </div>
  );
}

// ── Connections list ──────────────────────────────────────────────────────────

function ConnectionsList() {
  const connected = mockConnections.filter((c) => c.state === "connected");
  const familiar = mockConnections.filter((c) => c.state === "familiar");
  const pending = mockConnections.filter((c) => c.state === "pending");

  if (connected.length === 0 && familiar.length === 0 && pending.length === 0) {
    return (
      <div className="flex flex-col items-center gap-sm p-lg text-center">
        <p className="text-sm text-fg-secondary">
          No connections yet. Attend a meet to start building your community.
        </p>
        <ButtonAction variant="primary" size="sm" cta href="/meets">
          Browse Meets
        </ButtonAction>
      </div>
    );
  }

  const groups = [
    { label: "Connected", items: connected },
    { label: "Familiar", items: familiar },
    { label: "Pending", items: pending },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-md">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-xs">
          <span
            className="text-xs font-medium text-fg-tertiary"
            style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            {group.label} ({group.items.length})
          </span>
          {group.items.map((conn) => (
            <div
              key={conn.id}
              className="flex items-center gap-md rounded-panel bg-surface-top p-sm"
            >
              <img
                src={conn.avatarUrl}
                alt={conn.userName}
                className="rounded-full shrink-0"
                style={{ width: 36, height: 36, objectFit: "cover" }}
              />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-fg-primary">
                  {conn.userName}
                </span>
                <span className="text-xs text-fg-tertiary">
                  {conn.dogNames.join(", ")} · {conn.location}
                </span>
              </div>
              <span
                className="text-xs font-medium rounded-pill px-sm py-xs"
                style={{
                  background:
                    conn.state === "connected"
                      ? "var(--brand-subtle)"
                      : "var(--surface-gray)",
                  color:
                    conn.state === "connected"
                      ? "var(--brand-strong)"
                      : "var(--text-secondary)",
                }}
              >
                {CONNECTION_STATE_LABELS[conn.state]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── About tab ────────────────────────────────────────────────────────────────

function AboutTab({
  user,
  editing,
  editState,
  onEditChange,
}: {
  user: UserProfile;
  editing: boolean;
  editState: { bio: string; pets: PetProfile[] };
  onEditChange: (updates: Partial<{ bio: string; pets: PetProfile[] }>) => void;
}) {
  return (
    <div className="profile-content-width profile-section-stack">
      {/* Bio */}
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">About me</h3>
        {editing ? (
          <textarea
            className="textarea"
            value={editState.bio}
            onChange={(e) => onEditChange({ bio: e.target.value })}
            placeholder="Tell people about yourself..."
            style={{ minHeight: 80 }}
          />
        ) : (
          <p className="profile-card-copy">{user.bio}</p>
        )}
      </section>

      {/* Dogs */}
      <section className="profile-info-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: editing ? 16 : 0,
          }}
        >
          <h3 className="profile-card-subtitle" style={{ marginBottom: 0 }}>
            My dogs
          </h3>
          {editing && (
            <ButtonAction
              variant="outline"
              size="sm"
              leftIcon={<Plus size={13} weight="bold" />}
              onClick={() => {
                const newPet: PetProfile = {
                  id: `pet-${Date.now()}`,
                  name: "",
                  breed: "",
                  weightLabel: "",
                  ageLabel: "",
                  imageUrl: "",
                  notes: "",
                };
                onEditChange({ pets: [...editState.pets, newPet] });
              }}
            >
              Add dog
            </ButtonAction>
          )}
        </div>
        {editing ? (
          <div className="flex flex-col gap-md">
            {editState.pets.map((pet, i) => (
              <PetEditCard
                key={pet.id}
                pet={pet}
                onChange={(updated) => {
                  const next = [...editState.pets];
                  next[i] = updated;
                  onEditChange({ pets: next });
                }}
                onDelete={() => {
                  onEditChange({
                    pets: editState.pets.filter((_, j) => j !== i),
                  });
                }}
              />
            ))}
          </div>
        ) : user.pets.length > 0 ? (
          <div className="flex flex-col gap-md" style={{ marginTop: 12 }}>
            {user.pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <p
            className="profile-card-copy"
            style={{ color: "var(--text-tertiary)", marginTop: 8 }}
          >
            No dogs added yet.
          </p>
        )}
      </section>

      {/* Connections */}
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Connections</h3>
        <ConnectionsList />
      </section>
    </div>
  );
}

// ── Services tab ──────────────────────────────────────────────────────────────

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

function ServicesTab({
  user,
  editing,
  visibility,
  onToggleVisibility,
}: {
  user: UserProfile;
  editing: boolean;
  visibility: boolean;
  onToggleVisibility: () => void;
}) {
  const carer = user.carerProfile;

  if (!carer) {
    return (
      <div className="profile-content-width profile-section-stack">
        <section className="profile-info-card">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "32px 16px",
              textAlign: "center",
            }}
          >
            <Sparkle
              size={44}
              weight="light"
              style={{ color: "var(--text-tertiary)" }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: "var(--font-size-h4)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
              }}
            >
              Set up your carer profile
            </h2>
            <p
              className="profile-card-copy"
              style={{ color: "var(--text-secondary)" }}
            >
              Start accepting bookings for walks, drop-in visits, and boarding.
            </p>
            <ButtonAction href="/signup/start" variant="primary" size="md">
              Get started
            </ButtonAction>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="profile-content-width profile-section-stack">
      {/* Carer bio */}
      {carer.bio && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Bio</h3>
          <p className="profile-card-copy">{carer.bio}</p>
        </section>
      )}

      {/* Services */}
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
                      {" "}
                      / {svc.priceUnit === "per_visit" ? "visit" : "night"}
                    </span>
                  </span>
                </div>
              </div>
              {svc.subServices.length > 0 && (
                <div className="profile-service-subs">
                  {svc.subServices.map((sub) => (
                    <span key={sub} className="chip">
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
        </div>
      </section>

      {/* Availability */}
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Availability</h3>
        <AvailabilityGrid carer={carer} />
      </section>

      {/* Visibility */}
      <section className="profile-info-card">
        <div className="profile-visibility-row">
          <div>
            <p className="profile-visibility-label">Profile visibility</p>
            <p className="profile-visibility-sub">
              {visibility
                ? "Your profile is visible to pet owners on Explore."
                : "Your profile is hidden from search results."}
            </p>
          </div>
          {editing ? (
            <button
              onClick={onToggleVisibility}
              className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
              style={{
                background: visibility
                  ? "var(--brand-subtle)"
                  : "var(--surface-gray)",
                color: visibility
                  ? "var(--brand-strong)"
                  : "var(--text-secondary)",
                border: `1px solid ${
                  visibility ? "var(--brand-main)" : "var(--border-regular)"
                }`,
                cursor: "pointer",
              }}
            >
              {visibility ? "Public" : "Hidden"}
            </button>
          ) : (
            <span
              className={`profile-visibility-badge${
                visibility ? " profile-visibility-badge--public" : ""
              }`}
            >
              {visibility ? "Public" : "Hidden"}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

// ── Reviews tab (placeholder) ────────────────────────────────────────────────

function ReviewsTab() {
  return (
    <div className="profile-content-width profile-section-stack">
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Reviews</h3>
        <p
          className="profile-card-copy"
          style={{ color: "var(--text-secondary)" }}
        >
          No reviews yet. Reviews will appear here once you complete bookings.
        </p>
      </section>
    </div>
  );
}

// ── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
  variant,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  variant?: "desktop";
}) {
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
    { key: "reviews", label: "Reviews" },
  ];
  return (
    <div
      className={`profile-tabs${variant === "desktop" ? " profile-tabs-desktop" : ""}`}
      role="tablist"
      aria-label="Profile sections"
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeTab === key}
          className={`profile-tab${activeTab === key ? " active" : ""}`}
          onClick={() => onTabChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <main className="profile-page-shell">
      <section className="profile-page-panel">
        <div className="profile-fixed-top">
          <div style={{ display: "flex", gap: 12, padding: "16px 16px 12px" }}>
            <div
              className="skeleton skeleton-circle"
              style={{ width: 64, height: 64, flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                display: "grid",
                gap: 8,
                alignContent: "center",
              }}
            >
              <div
                className="skeleton skeleton-text"
                style={{ width: "60%", height: 18 }}
              />
              <div
                className="skeleton skeleton-text"
                style={{ width: "40%", height: 14 }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Main profile page ─────────────────────────────────────────────────────────

function ProfileInner() {
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as ProfileTab) ?? "about";
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [editing, setEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Editable state (local, resets on refresh — prototype only)
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [editBio, setEditBio] = useState(user.bio);
  const [editPets, setEditPets] = useState<PetProfile[]>(user.pets);
  const [editVisibility, setEditVisibility] = useState(
    user.carerProfile?.publicProfile ?? false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 621px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function startEditing() {
    setEditBio(user.bio);
    setEditPets(user.pets.map((p) => ({ ...p })));
    setEditVisibility(user.carerProfile?.publicProfile ?? false);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveEditing() {
    setUser((prev) => ({
      ...prev,
      bio: editBio,
      pets: editPets,
      carerProfile: prev.carerProfile
        ? { ...prev.carerProfile, publicProfile: editVisibility }
        : undefined,
    }));
    setEditing(false);
  }

  const activeContent =
    activeTab === "about" ? (
      <AboutTab
        user={user}
        editing={editing}
        editState={{ bio: editBio, pets: editPets }}
        onEditChange={(updates) => {
          if (updates.bio !== undefined) setEditBio(updates.bio);
          if (updates.pets !== undefined) setEditPets(updates.pets);
        }}
      />
    ) : activeTab === "services" ? (
      <ServicesTab
        user={user}
        editing={editing}
        visibility={
          editing ? editVisibility : (user.carerProfile?.publicProfile ?? false)
        }
        onToggleVisibility={() => setEditVisibility((v) => !v)}
      />
    ) : (
      <ReviewsTab />
    );

  // ── Desktop layout ─────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <main className="profile-page-shell">
        <section className="profile-desktop-layout">
          <aside className="profile-desktop-left-col">
            {/* Demo nav link */}
            <div className="profile-desktop-back-row">
              <Link href="/pages" className="profile-desktop-back-link">
                <ListBullets size={16} weight="light" />
                Prototype Overview
              </Link>
            </div>
            <div className="profile-desktop-profile">
              <ProfileHeaderOwn
                user={user}
                state="expanded"
                editing={editing}
                onEdit={startEditing}
                onSave={saveEditing}
                onCancel={cancelEditing}
              />
            </div>
          </aside>

          <section className="profile-desktop-right-col">
            <div className="profile-desktop-tabs-wrap">
              <TabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="desktop"
              />
            </div>
            <div className="profile-desktop-right-scroll">{activeContent}</div>
          </section>
        </section>
      </main>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────

  return (
    <main className="profile-page-shell">
      <section className="profile-page-panel">
        <div className="profile-fixed-top">
          {/* Demo nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "var(--surface-inset)",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <ButtonAction
              variant="secondary"
              size="sm"
              href="/pages"
              leftIcon={<ListBullets size={16} weight="light" />}
            >
              Prototype Overview
            </ButtonAction>
          </div>

          <ProfileHeaderOwn
            user={user}
            state="condensed"
            editing={editing}
            onEdit={startEditing}
            onSave={saveEditing}
            onCancel={cancelEditing}
          />

          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="profile-scroll-body">{activeContent}</div>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileInner />
    </Suspense>
  );
}
