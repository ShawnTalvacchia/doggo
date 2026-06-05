"use client";

import { useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";

interface HighlightsStripProps {
  /** Curated photo URLs. On dog pages this comes from `PetProfile.highlights`;
   *  on owner profile pages it comes from `UserProfile.highlights`. */
  highlights: string[];
  /** Subject name (dog name or user first name) — used in alt text + modal title. */
  subjectLabel: string;
  /** When true, surfaces an Edit affordance and the strip respects
   *  owner-only interactions (open Edit modal). */
  isOwnerView: boolean;
  /** Edit-flow callback (Workstream C4). When provided AND
   *  `isOwnerView`, an Edit pencil renders next to the strip title. */
  onEdit?: () => void;
  /**
   * Chrome variant. Default `"section"` wraps the strip in
   * `.dog-profile-section` (popout bg + padding + border-bottom) for
   * the dog page. `"bare"` renders flat with only horizontal +
   * vertical padding — used on owner profile Posts tab so the strip
   * shares the panel's flat surface with the Posts collection below.
   */
  variant?: "section" | "bare";
}

/**
 * Highlights strip — owner-curated photos pinned above the auto-album
 * on `/dogs/[id]` AND above the Posts tab on `/profile/[id]`. Horizontal
 * scroll on overflow; first 5 visible before "See all" opens a full
 * grid modal.
 *
 * Hidden entirely when `highlights` is empty. Owners populate Highlights
 * via long-press → "Pin to Highlights" on auto-album photos (Workstream C3).
 *
 * Photos & Galleries phase (2026-06-04). Generalized 2026-06-04 from
 * dog-only to dog OR user subject when the Posts/Photos pattern unified.
 */
export function HighlightsStrip({
  highlights,
  subjectLabel,
  isOwnerView,
  onEdit,
  variant = "section",
}: HighlightsStripProps) {
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  if (highlights.length === 0) return null;

  const VISIBLE_CAP = 5;
  const visible = highlights.slice(0, VISIBLE_CAP);
  const hiddenCount = Math.max(0, highlights.length - VISIBLE_CAP);

  const wrapperClass =
    variant === "section" ? "dog-profile-section" : "highlights-bare";

  return (
    <div className={wrapperClass}>
      <div className="flex items-center justify-between">
        <h2 className="dog-profile-section-title">Highlights</h2>
        {isOwnerView && onEdit && (
          <button
            type="button"
            className="highlights-edit-btn"
            onClick={onEdit}
            aria-label="Edit Highlights"
          >
            <Pencil size={14} weight="light" />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="highlights-strip">
        {visible.map((url, i) => (
          <div key={`${url}-${i}`} className="highlights-thumb">
            <img
              src={url}
              alt={`${subjectLabel} highlight ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="highlights-see-all"
            onClick={() => setSeeAllOpen(true)}
            aria-label={`See all ${highlights.length} highlights`}
          >
            <span>See all</span>
            <span className="highlights-see-all-count">+{hiddenCount}</span>
          </button>
        )}
      </div>

      <ModalSheet
        open={seeAllOpen}
        onClose={() => setSeeAllOpen(false)}
        title={`${subjectLabel}'s Highlights`}
      >
        <div className="photo-grid">
          {highlights.map((url, i) => (
            <div key={`${url}-${i}`} className="photo-grid-tile">
              <img
                src={url}
                alt={`${subjectLabel} highlight ${i + 1}`}
                className="photo-grid-tile-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </ModalSheet>
    </div>
  );
}
