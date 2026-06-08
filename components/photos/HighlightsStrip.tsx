"use client";

import { useMemo, useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { usePostDetail } from "@/contexts/PostDetailContext";
import { mockPosts } from "@/lib/mockPosts";
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
}

interface ResolvedHighlight {
  url: string;
  post: Post | null;
  photoIndex: number;
}

/**
 * Highlights strip — owner-curated photos pinned above the auto-album
 * on `/dogs/[id]` AND above the Posts tab on `/profile/[id]`. Horizontal
 * scroll on overflow; first 5 visible before "See all" opens a full
 * grid modal.
 *
 * Tapping a thumbnail opens the lightbox at that exact photo. The
 * lightbox's cross-post carousel scopes to the **Highlights themselves**
 * (each resolved to its source post): tapping highlight #3 opens
 * highlight #3 and ←/→ moves through the other highlights in order.
 * This generalizes cleanly across the cases where a highlight points
 * to a photo from a post the subject didn't author (a friend's pic of
 * your dog, a walker's post pinned to a shelter dog), since the
 * carousel is anchored to the curated set itself, not to whichever
 * collection backs the surface.
 *
 * Resolution scans `mockPosts` globally — Highlights URLs that don't
 * resolve to any post (rare; possible if seed data ever inserts an
 * orphan URL) render as non-clickable thumbs.
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
}: HighlightsStripProps) {
  const [seeAllOpen, setSeeAllOpen] = useState(false);
  const { openPost } = usePostDetail();

  // Resolve every highlight URL → its source post + photo index. Done
  // once for the whole strip; the resolved set IS the lightbox
  // collection when a thumb is tapped. Posts may come from any author.
  const resolved: ResolvedHighlight[] = useMemo(() => {
    return highlights.map((url) => {
      for (const post of mockPosts) {
        const idx = post.photos.indexOf(url);
        if (idx !== -1) return { url, post, photoIndex: idx };
      }
      return { url, post: null, photoIndex: 0 };
    });
  }, [highlights]);

  if (highlights.length === 0) return null;

  const VISIBLE_CAP = 5;
  const visible = resolved.slice(0, VISIBLE_CAP);
  const hiddenCount = Math.max(0, resolved.length - VISIBLE_CAP);

  const wrapperClass =
    variant === "section" ? "dog-profile-section" : "highlights-bare";

  // Collection for the lightbox = the resolvable highlight posts, in
  // highlight order. Skips unresolved entries so the carousel doesn't
  // try to render them. Parallel `photoIndices` array carries each
  // highlight's specific photo position within its source post — the
  // lightbox uses this on cross-highlight navigation so ←/→ lands on
  // the right photo for each curated entry, not photo 0.
  const resolvedItems = resolved.filter(
    (r): r is ResolvedHighlight & { post: Post } => r.post !== null,
  );
  const collection: Post[] = resolvedItems.map((r) => r.post);
  const photoIndices: number[] = resolvedItems.map((r) => r.photoIndex);

  const handleTap = (item: ResolvedHighlight) => {
    if (!item.post) return;
    openPost(item.post.id, {
      collection,
      photoIndices,
      photoIndex: item.photoIndex,
      // Highlights are curated single photos — ← → moves between
      // highlights, not within a post. Hide the within-post chrome
      // (small arrows + "1/4" counter) since it doesn't apply.
      withinPostNav: false,
    });
    setSeeAllOpen(false);
  };

  const renderThumb = (item: ResolvedHighlight, i: number, className: string) => {
    const img = (
      <img
        src={item.url}
        alt={`${subjectLabel} highlight ${i + 1}`}
        loading="lazy"
      />
    );
    if (item.post) {
      return (
        <button
          key={`${item.url}-${i}`}
          type="button"
          className={`${className} highlights-thumb-button`}
          onClick={() => handleTap(item)}
          aria-label={`Open highlight ${i + 1}`}
        >
          {img}
        </button>
      );
    }
    return (
      <div key={`${item.url}-${i}`} className={className}>
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
        {visible.map((item, i) => renderThumb(item, i, "highlights-thumb"))}
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
          {resolved.map((item, i) => renderThumb(item, i, "photo-grid-tile"))}
        </div>
      </ModalSheet>
    </div>
  );
}
