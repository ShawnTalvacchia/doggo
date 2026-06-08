"use client";

import { useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { usePostDetail } from "@/contexts/PostDetailContext";
import type { Post } from "@/lib/types";

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
  /**
   * Posts collection the highlights live within. Used to resolve each
   * pinned URL back to its parent post so tapping a thumbnail opens
   * the lightbox at that exact photo, with cross-post nav scoped to
   * the main collection (NOT a "highlights-only" carousel). Without
   * a collection, thumbnails fall back to non-interactive (legacy
   * behavior). 2026-06-04.
   */
  collection?: Post[];
}

/**
 * Highlights strip — owner-curated photos pinned above the auto-album
 * on `/dogs/[id]` AND above the Posts tab on `/profile/[id]`. Horizontal
 * scroll on overflow; first 5 visible before "See all" opens a full
 * grid modal.
 *
 * Tapping a thumbnail opens the post it was pinned from in the global
 * lightbox, positioned at that exact photo. Cross-post navigation is
 * scoped to the underlying collection (the dog's posts, or the user's
 * posts) — matches what tapping the same photo from the grid does. We
 * deliberately don't run a "highlights-only" carousel because
 * highlights are pointers, not a distinct collection.
 *
 * Hidden entirely when `highlights` is empty. Owners populate Highlights
 * via the per-post kebab → "Pin to Highlights" (Photos & Galleries 2026-06-04).
 */
export function HighlightsStrip({
  highlights,
  subjectLabel,
  isOwnerView,
  onEdit,
  variant = "section",
  collection,
}: HighlightsStripProps) {
  const [seeAllOpen, setSeeAllOpen] = useState(false);
  const { openPost } = usePostDetail();

  if (highlights.length === 0) return null;

  const VISIBLE_CAP = 5;
  const visible = highlights.slice(0, VISIBLE_CAP);
  const hiddenCount = Math.max(0, highlights.length - VISIBLE_CAP);

  const wrapperClass =
    variant === "section" ? "dog-profile-section" : "highlights-bare";

  /**
   * Find the post (and photo index within it) that contains this URL.
   * If multiple posts include the URL, the first match wins.
   */
  const resolveTap = (url: string): { postId: string; photoIndex: number } | null => {
    if (!collection) return null;
    for (const post of collection) {
      const idx = post.photos.indexOf(url);
      if (idx !== -1) return { postId: post.id, photoIndex: idx };
    }
    return null;
  };

  const handleThumbTap = (url: string) => {
    const target = resolveTap(url);
    if (!target) return;
    openPost(target.postId, {
      collection,
      photoIndex: target.photoIndex,
    });
    setSeeAllOpen(false);
  };

  const renderThumb = (url: string, i: number, className: string) => {
    const target = resolveTap(url);
    const img = (
      <img
        src={url}
        alt={`${subjectLabel} highlight ${i + 1}`}
        loading="lazy"
      />
    );
    if (target) {
      return (
        <button
          key={`${url}-${i}`}
          type="button"
          className={`${className} highlights-thumb-button`}
          onClick={() => handleThumbTap(url)}
          aria-label={`Open highlight ${i + 1}`}
        >
          {img}
        </button>
      );
    }
    return (
      <div key={`${url}-${i}`} className={className}>
        {img}
      </div>
    );
  };

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
        {visible.map((url, i) => renderThumb(url, i, "highlights-thumb"))}
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
          {highlights.map((url, i) => renderThumb(url, i, "photo-grid-tile"))}
        </div>
      </ModalSheet>
    </div>
  );
}
