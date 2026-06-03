"use client";

import { useState } from "react";
import {
  Trash,
  ImageSquare,
  MagnifyingGlass,
  PencilSimple,
  Heart,
  FirstAidKit,
  CaretDown,
  Dog,
} from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import type {
  PetProfile,
  EnergyLevel,
  PlayStyle,
  VetInfo,
  VaccinationType,
} from "@/lib/types";
import { VACCINATION_LABELS, VACCINATION_ORDER } from "@/lib/petUtils";
import { ENERGY_LABELS, PLAY_STYLE_LABELS } from "./PetCard";

// ── Constants ──────────────────────────────────────────────────────────────────

export const ALL_PLAY_STYLES: PlayStyle[] = [
  "fetch", "tug", "chase", "wrestling", "gentle", "independent", "sniffing",
];

export const ENERGY_OPTIONS: EnergyLevel[] = ["low", "moderate", "high", "very_high"];

export const SIZE_OPTIONS = [
  "Toy (under 5kg)",
  "Small (5–10kg)",
  "Medium (10–25kg)",
  "Large (25–45kg)",
  "Giant (45kg+)",
];

// ── Section header (edit-mode specific) ────────────────────────────────────────
//
// Bigger than view-mode's `.pet-profile-section-header` (15px vs 13px) so
// the section hierarchy reads in a form context. Optional icon + label on
// the left, optional right-slot for accordion caret or section action
// (e.g. the per-section delete button on "Basic info"). 2026-05-11 (C3).

function EditSectionHeader({
  icon,
  label,
  rightSlot,
  onClick,
  expanded,
}: {
  icon?: React.ReactNode;
  label: string;
  rightSlot?: React.ReactNode;
  /** If provided, the header is a button — used for the Health & vet accordion. */
  onClick?: () => void;
  expanded?: boolean;
}) {
  const content = (
    <>
      {icon && <span className="text-brand-main">{icon}</span>}
      <span style={{ fontSize: 15, fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>
        {label}
      </span>
      {onClick && (
        <CaretDown
          size={14}
          weight="bold"
          className="text-fg-tertiary"
          style={{
            marginLeft: "auto",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        />
      )}
      {rightSlot && <span style={{ marginLeft: "auto" }}>{rightSlot}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={expanded}
        className="flex items-center gap-sm"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-sm" style={{ width: "100%" }}>
      {content}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

interface PetEditCardProps {
  pet: PetProfile;
  onChange: (updated: PetProfile) => void;
  onDelete: () => void;
  /** Whether the card starts expanded. Existing pets collapse by default
   *  (the edit list can grow tall fast — two pets pushes Profile
   *  visibility well below the fold); newly added pets auto-expand so the
   *  user can fill them in without an extra click. 2026-05-11 (C7b). */
  defaultExpanded?: boolean;
}

/**
 * Edit form for a single pet. Structured as four distinct sections —
 * each with its own header + visual divider — to give the form a clear
 * hierarchy and to mirror the view-mode PetCard's section pattern.
 *
 *   0. Compact summary row (always visible) — photo thumb + name + breed
 *      + caret toggle + delete. Tapping the toggle expands/collapses the
 *      form body below. Newly added pets auto-expand via
 *      `defaultExpanded`. 2026-05-11 (C7b).
 *   1. Basic info — name / breed / photo / size / age / energy.
 *   2. Personality — play style pills + general notes.
 *   3. Socialisation — Heart icon + textarea.
 *   4. Health & vet — FirstAidKit icon + collapsible body (collapsed by
 *      default for new pets; auto-expanded for pets with existing data).
 *
 * Field-level icons are deliberately absent — icons live on section
 * headers only, matching view-mode treatment. 2026-05-11 (walkthrough C3).
 */
export function PetEditCard({
  pet,
  onChange,
  onDelete,
  defaultExpanded = false,
}: PetEditCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const hasVetData = !!(
    pet.vetInfo &&
    (pet.vetInfo.clinicName ||
      pet.vetInfo.vetPhone ||
      (pet.vetInfo.vaccinations && pet.vetInfo.vaccinations.length > 0) ||
      pet.vetInfo.spayedNeutered ||
      pet.vetInfo.medications ||
      pet.vetInfo.conditions)
  );
  const [vetOpen, setVetOpen] = useState(hasVetData);

  const vetInfo = pet.vetInfo ?? {
    clinicName: "",
    vetPhone: "",
    spayedNeutered: false,
    medications: "",
    conditions: "",
  };

  function updateVet(updates: Partial<VetInfo>) {
    onChange({ ...pet, vetInfo: { ...vetInfo, ...updates } });
  }

  // Per-type read/write helpers for the structured vaccination list (V1).
  // Empty date = omit from the array; non-empty = upsert by type. Keeps the
  // 5 standard types as a fixed presence in the UI without forcing the
  // owner to "add" each row — most dogs have all five or none.
  function getVaccinationDateFor(type: VaccinationType): string {
    return vetInfo.vaccinations?.find((v) => v.type === type)?.lastGivenAt ?? "";
  }

  function setVaccinationDateFor(type: VaccinationType, iso: string) {
    const others = (vetInfo.vaccinations ?? []).filter((v) => v.type !== type);
    if (!iso) {
      updateVet({ vaccinations: others.length > 0 ? others : undefined });
      return;
    }
    updateVet({
      vaccinations: [...others, { type, lastGivenAt: iso, confidence: "self-declared" }],
    });
  }

  const isAcknowledged = !!vetInfo.vaccinationsAcknowledgedAt;

  function toggleAcknowledged(next: boolean) {
    if (next) {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      updateVet({ vaccinationsAcknowledgedAt: today });
    } else {
      updateVet({ vaccinationsAcknowledgedAt: undefined });
    }
  }

  const hasPhoto = !!(pet.imageUrl && !pet.imageUrl.includes("placeholder"));

  return (
    <div className="pet-card">
      {/* ── Always-visible compact summary row ────────────────────────
          Carries identity (photo + name + breed) + expand toggle +
          delete. Toggle area is the button; delete sits outside so it
          doesn't double as an expand trigger. 2026-05-11 (C7b). */}
      <div className="pet-edit-summary-row">
        <button
          type="button"
          className="pet-edit-summary-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse pet details" : "Expand pet details"}
        >
          {hasPhoto ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="pet-edit-summary-thumb"
            />
          ) : (
            <span
              className="pet-edit-summary-thumb pet-edit-summary-thumb--empty"
              aria-hidden="true"
            >
              <Dog size={20} weight="light" />
            </span>
          )}
          <div className="flex flex-col flex-1 min-w-0 text-left">
            <span
              className="text-base font-semibold text-fg-primary truncate"
              style={{ lineHeight: 1.3 }}
            >
              {pet.name || "New dog"}
            </span>
            {pet.breed && (
              <span
                className="text-sm text-fg-secondary truncate"
                style={{ lineHeight: 1.3 }}
              >
                {pet.breed}
              </span>
            )}
          </div>
          <CaretDown
            size={16}
            weight="bold"
            className="text-fg-tertiary shrink-0"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.15s ease",
            }}
          />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="pet-edit-summary-delete"
          aria-label="Remove pet"
          title="Remove pet"
        >
          <Trash size={18} weight="light" />
        </button>
      </div>

      {!expanded ? null : (
      <>
      {/* ── Section 1: Basic info ──────────────────────────────────────
          Top divider preserved (no `--first` modifier) so it reads as a
          form body distinct from the always-visible summary row above.
          2026-05-11 (C7b). */}
      <section className="pet-edit-section">
        <EditSectionHeader label="Basic info" />

        {/* Name + Breed row */}
        <div className="two-col">
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

        {/* Photo (left, 50%) + Size/Age/Energy stack (right, 50%) */}
        <div className="two-col">
          <div className="input-block">
            <label className="label">
              <span className="label-primary-group">
                <span>Pet Photo</span>
              </span>
            </label>
            <button
              type="button"
              className="pet-photo-edit-trigger"
              aria-label={hasPhoto ? "Change pet photo" : "Upload pet photo"}
            >
              {hasPhoto ? (
                <img src={pet.imageUrl} alt={pet.name} />
              ) : (
                <span className="pet-photo-edit-placeholder">
                  <ImageSquare size={48} weight="light" />
                  <span>Upload photo</span>
                </span>
              )}
              <span className="pet-photo-edit-overlay" aria-hidden="true">
                <PencilSimple size={14} weight="bold" />
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-md">
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

            <div className="input-block">
              <label className="label" htmlFor={`pet-energy-${pet.id}`}>
                <span className="label-primary-group">
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
          </div>
        </div>
      </section>

      {/* ── Section 2: Personality ────────────────────────────────────── */}
      <section className="pet-edit-section">
        <EditSectionHeader
          icon={<Dog size={16} weight="fill" />}
          label="Personality"
        />

        <div className="input-block">
          <label className="label">
            <span className="label-primary-group">
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
      </section>

      {/* ── Section 3: Socialisation ──────────────────────────────────── */}
      <section className="pet-edit-section">
        <EditSectionHeader
          icon={<Heart size={16} weight="fill" />}
          label="Socialisation"
        />
        <textarea
          id={`pet-social-${pet.id}`}
          className="textarea"
          placeholder="How they are with other dogs, people, and kids"
          value={pet.socialisationNotes || ""}
          onChange={(e) => onChange({ ...pet, socialisationNotes: e.target.value })}
          style={{ minHeight: 60 }}
          aria-label="Socialisation notes"
        />
      </section>

      {/* ── Section 4: Health & vet (collapsible) ─────────────────────── */}
      <section className="pet-edit-section">
        <EditSectionHeader
          icon={<FirstAidKit size={16} weight="fill" />}
          label="Health & vet info"
          onClick={() => setVetOpen((v) => !v)}
          expanded={vetOpen}
        />

        {vetOpen && (
          <div className="flex flex-col gap-lg">
            <div className="two-col">
              <InputField
                id={`pet-vet-clinic-${pet.id}`}
                label="Vet clinic"
                value={vetInfo.clinicName || ""}
                onChange={(v) => updateVet({ clinicName: v })}
                placeholder="e.g. Veterina Vinohrady"
              />
              <InputField
                id={`pet-vet-phone-${pet.id}`}
                label="Vet phone"
                value={vetInfo.vetPhone || ""}
                onChange={(v) => updateVet({ vetPhone: v })}
                placeholder="+420 ..."
              />
            </div>

            {/* Vaccinations V1 — per-vaccine date inputs + single
                per-dog acknowledgement checkbox. The 5 standard CZ types
                are always shown as rows; leaving a date empty omits that
                record from the array. Owner self-declared; verification
                belongs to V2 (Open Q §15 + §16). */}
            <div className="input-block">
              <label className="label">
                <span className="label-primary-group">
                  <span>Vaccinations</span>
                </span>
              </label>
              <div className="flex flex-col gap-sm">
                {VACCINATION_ORDER.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-md"
                    style={{ minHeight: 32 }}
                  >
                    <label
                      htmlFor={`pet-vax-${pet.id}-${type}`}
                      className="text-sm text-fg-primary"
                      style={{ flex: "0 0 120px" }}
                    >
                      {VACCINATION_LABELS[type]}
                    </label>
                    <input
                      id={`pet-vax-${pet.id}-${type}`}
                      type="date"
                      className="input"
                      value={getVaccinationDateFor(type)}
                      onChange={(e) => setVaccinationDateFor(type, e.target.value)}
                      style={{ flex: 1, minWidth: 0 }}
                      aria-label={`${VACCINATION_LABELS[type]} last given date`}
                    />
                  </div>
                ))}
              </div>
              <CheckboxRow
                id={`pet-vax-ack-${pet.id}`}
                label={`I confirm ${pet.name || "this dog"}'s vaccination record is accurate as of today`}
                checked={isAcknowledged}
                onChange={toggleAcknowledged}
              />
              {isAcknowledged && vetInfo.vaccinationsAcknowledgedAt && (
                <p className="text-xs text-fg-tertiary">
                  Confirmed {vetInfo.vaccinationsAcknowledgedAt}
                </p>
              )}
            </div>

            <div className="pet-edit-checkbox-row">
              <CheckboxRow
                id={`pet-spay-${pet.id}`}
                label="Spayed / neutered"
                checked={vetInfo.spayedNeutered}
                onChange={(v) => updateVet({ spayedNeutered: v })}
              />
            </div>

            <div className="input-block">
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

            <div className="input-block">
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
          </div>
        )}
      </section>
      </>
      )}
    </div>
  );
}
