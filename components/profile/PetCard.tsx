"use client";

import { Fragment, useState } from "react";
import {
  Lightning,
  Heart,
  FirstAidKit,
  ShieldCheck,
  Camera,
  CaretDown,
} from "@phosphor-icons/react";
import type { PetProfile, EnergyLevel, PlayStyle } from "@/lib/types";
import {
  VACCINATION_LABELS,
  formatVaccinationDate,
  sortVaccinations,
} from "@/lib/petUtils";

// ── Constants ──────────────────────────────────────────────────────────────────

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "Low energy",
  moderate: "Moderate",
  high: "High energy",
  very_high: "Very high energy",
};

// Energy pill palette — `bg`/`fg`/`border` per level. Previously the
// pill used `*-25` backgrounds with `*-500` text, which read fine in
// isolation but blended into the `--surface-base` (#f4f4f4) PetCard
// background. Bumped backgrounds to `*-50` for clearer pill silhouette,
// text to `*-600` for stronger contrast on the tinted bg, and added a
// 1px border at the same `*-600` colour to define the edge against the
// card. Scoped to the PetCard energy pill — does not affect the
// app-wide `--status-*` tokens. 2026-05-11 (A5b).
export const ENERGY_COLORS: Record<
  EnergyLevel,
  { bg: string; fg: string; border: string }
> = {
  low: {
    bg: "var(--info-50)",
    fg: "var(--info-600)",
    border: "var(--info-600)",
  },
  moderate: {
    bg: "var(--success-50)",
    fg: "var(--success-600)",
    border: "var(--success-600)",
  },
  high: {
    bg: "var(--warning-50)",
    fg: "var(--warning-600)",
    border: "var(--warning-600)",
  },
  very_high: {
    bg: "var(--error-50)",
    fg: "var(--error-600)",
    border: "var(--error-600)",
  },
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
  defaultExpanded?: boolean;
}

export function PetCard({ pet, defaultExpanded = true }: PetCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const hasDetails = pet.energyLevel || pet.playStyles?.length || pet.notes || pet.socialisationNotes || pet.vetInfo || pet.highlights?.length;

  return (
    <div className="pet-profile-card">
      {/* Header: photo + identity — always visible, tappable to toggle */}
      <button
        type="button"
        className="pet-profile-header"
        onClick={hasDetails ? () => setExpanded((v) => !v) : undefined}
        style={{ cursor: hasDetails ? "pointer" : "default", background: "none", border: "none", padding: 0, textAlign: "left", width: "100%" }}
      >
        <div className="pet-profile-avatar-wrap">
          <img src={pet.imageUrl} alt={pet.name} className="pet-profile-avatar" />
          {pet.highlights && pet.highlights.length > 0 && (
            <span className="pet-profile-photo-count">
              <Camera size={11} weight="fill" />
              {pet.highlights.length + 1}
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
        {hasDetails && (
          <CaretDown
            size={16}
            weight="bold"
            className="text-fg-tertiary shrink-0"
            style={{
              alignSelf: "center",
              marginLeft: "auto",
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.15s ease",
            }}
          />
        )}
      </button>

      {/* Expandable detail content */}
      {expanded && (
        <>
          {/* Badges row: energy + play styles */}
          {(pet.energyLevel || (pet.playStyles && pet.playStyles.length > 0)) && (
            <div className="pet-profile-badges">
              {pet.energyLevel && (
                <span
                  className="pet-profile-energy-pill"
                  style={{
                    background: ENERGY_COLORS[pet.energyLevel].bg,
                    color: ENERGY_COLORS[pet.energyLevel].fg,
                    border: `1px solid ${ENERGY_COLORS[pet.energyLevel].border}`,
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

          {/* Standing preferences (Dog Profile phase, 2026-06-02). Four
              chip groups visible to anyone who can see the dog — the
              same data also surfaces on the dog profile + booking detail
              Info tab so a carer doesn't need it re-explained. */}
          <PetPreferences pet={pet} />

          {/* Vet / Health summary */}
          {pet.vetInfo && (
            <div className="pet-profile-section">
              <div className="pet-profile-section-header">
                <FirstAidKit size={14} weight="fill" className="text-brand-main" />
                <span>Health & vet</span>
              </div>
              {/* Vaccinations — structured per-vaccine chips (Vaccines V1,
                  Dog Profile phase). Replaces the prior single
                  "Vaccinations up to date" check with per-vaccine records
                  + owner acknowledgement caption. */}
              {pet.vetInfo.vaccinations && pet.vetInfo.vaccinations.length > 0 ? (
                <div className="flex flex-col gap-xs">
                  <span className="pet-profile-health-check">
                    <ShieldCheck size={13} weight="fill" /> Vaccinations
                  </span>
                  <div className="flex flex-wrap gap-tiny">
                    {sortVaccinations(pet.vetInfo.vaccinations).map((v) => (
                      <span key={v.type} className="pet-profile-vet-pill">
                        {VACCINATION_LABELS[v.type]} · {formatVaccinationDate(v.lastGivenAt)}
                      </span>
                    ))}
                  </div>
                  {pet.vetInfo.vaccinationsAcknowledgedAt && (
                    <span className="text-xs text-fg-tertiary">
                      Confirmed {formatVaccinationDate(pet.vetInfo.vaccinationsAcknowledgedAt)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-fg-tertiary italic">
                  No vaccination records on file
                </span>
              )}
              {/* Spayed / neutered — icon + colored text inline, no pill chrome.
                  The pill treatment was too heavy for "yes this is a thing"
                  affirmations; icon-and-text reads as a check at a glance.
                  2026-05-11. */}
              {pet.vetInfo.spayedNeutered && (
                <div className="pet-profile-health-checks">
                  <span className="pet-profile-health-check">
                    <ShieldCheck size={13} weight="fill" /> Spayed / neutered
                  </span>
                </div>
              )}
              {/* Conditions — plain text. Pill styling was wrong here; the
                  content is long and open-ended ("Mild leash reactivity. No
                  food allergies. Sensitive stomach with novel proteins.")
                  and reads better as body copy. 2026-05-11. */}
              {pet.vetInfo.conditions && (
                <p className="pet-profile-conditions">{pet.vetInfo.conditions}</p>
              )}
              {pet.vetInfo.clinicName && (
                <p className="pet-profile-vet-line">
                  {/* Vet clinic — neutral pill. Future: when the directory
                      of vet contacts is wired, this becomes a link to the
                      vet's contact page. 2026-05-11. */}
                  <span className="pet-profile-vet-pill">
                    {pet.vetInfo.clinicName}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Photo gallery thumbnails */}
          {pet.highlights && pet.highlights.length > 0 && (
            <div className="pet-profile-gallery">
              {[pet.imageUrl, ...pet.highlights].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${pet.name} photo ${i + 1}`}
                  className="pet-profile-gallery-thumb"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Per-pet standing preferences chip groups (Dog Profile phase). Owner
 * authors once; visible everywhere the pet is shown to anyone who can
 * see the profile. Same display block as the dog profile +
 * booking-detail Info tab — kept inline because the rendering is small
 * and the surfaces have slightly different chrome (header style varies).
 */
function PetPreferences({ pet }: { pet: PetProfile }) {
  const groups: Array<{ key: string; label: string; items?: string[] }> = [
    { key: "likes", label: "Likes", items: pet.preferences?.likes },
    { key: "dislikes", label: "Dislikes", items: pet.preferences?.dislikes },
    { key: "triggers", label: "Triggers", items: pet.preferences?.triggers },
    {
      key: "playPreferences",
      label: "Play",
      items: pet.preferences?.playPreferences,
    },
  ];
  const nonEmpty = groups.filter((g) => g.items && g.items.length > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <div className="pet-profile-section">
      <div className="pet-profile-section-header">
        <Heart size={14} weight="fill" className="text-brand-main" />
        <span>How {pet.name} likes to be cared for</span>
      </div>
      {/* Label + text-with-separator. Pills were retired 2026-06-03 —
          they implied a controlled vocabulary the field isn't backed
          by. Same shape as the dog profile + booking detail
          (`.dog-profile-prefs-*` family). */}
      <div className="dog-profile-prefs">
        {nonEmpty.map((g) => (
          <Fragment key={g.key}>
            <span className="dog-profile-prefs-label">{g.label}</span>
            <span className="dog-profile-prefs-items">{g.items!.join(" · ")}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
