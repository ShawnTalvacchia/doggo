"use client";

import {
  Lightning,
  Heart,
  Stethoscope,
  ShieldCheck,
  Camera,
} from "@phosphor-icons/react";
import type { PetProfile, EnergyLevel, PlayStyle } from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "Low energy",
  moderate: "Moderate",
  high: "High energy",
  very_high: "Very high energy",
};

export const ENERGY_COLORS: Record<EnergyLevel, { bg: string; fg: string }> = {
  low: { bg: "var(--status-info-light)", fg: "var(--status-info-main)" },
  moderate: { bg: "var(--status-success-light)", fg: "var(--status-success-main)" },
  high: { bg: "var(--status-warning-light)", fg: "var(--status-warning-main)" },
  very_high: { bg: "var(--status-error-light)", fg: "var(--status-error-main)" },
};

export const PLAY_STYLE_LABELS: Record<PlayStyle, string> = {
  fetch: "Fetch lover",
  tug: "Tug-of-war",
  chase: "Chase games",
  wrestling: "Play wrestling",
  gentle: "Gentle player",
  independent: "Independent",
  sniffing: "Sniff explorer",
};

// ── Component ──────────────────────────────────────────────────────────────────

interface PetCardProps {
  pet: PetProfile;
  onExpand?: () => void;
}

export function PetCard({ pet, onExpand }: PetCardProps) {
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
