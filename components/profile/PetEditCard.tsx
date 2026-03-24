"use client";

import {
  Trash,
  ImageSquare,
  MagnifyingGlass,
  Lightning,
  Heart,
  Stethoscope,
  Dog,
} from "@phosphor-icons/react";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import type { PetProfile, EnergyLevel, PlayStyle, VetInfo } from "@/lib/types";
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

// ── Component ──────────────────────────────────────────────────────────────────

interface PetEditCardProps {
  pet: PetProfile;
  onChange: (updated: PetProfile) => void;
  onDelete: () => void;
}

export function PetEditCard({ pet, onChange, onDelete }: PetEditCardProps) {
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
    <div className="pet-card relative">
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
                className="w-full rounded-form border border-edge-subtle"
                style={{ aspectRatio: "1", objectFit: "cover" }}
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
        <div className="form-col flex flex-col gap-md">
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
        className="pet-edit-health-fieldset rounded-form border border-edge-light p-sm"
        style={{ margin: 0 }}
      >
        <legend
          className="flex items-center gap-xs text-sm font-medium text-fg-primary px-xs"
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
        className="flex items-center justify-center absolute"
        style={{
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
