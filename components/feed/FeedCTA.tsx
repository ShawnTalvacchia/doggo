"use client";

import { Camera } from "@phosphor-icons/react";
import { usePostComposer } from "@/contexts/PostComposerContext";

interface FeedCTAProps {
  dogPhotos?: string[];
}

/**
 * "Want to share a moment?" CTA bar at the top of the home feed.
 * Matches Figma card-home-cta: white bg, 64px height, dog avatar stack,
 * tertiary prompt text, outlined Post button.
 */
export function FeedCTA({ dogPhotos = [] }: FeedCTAProps) {
  const { openComposer } = usePostComposer();
  const photos = dogPhotos.slice(0, 2);

  return (
    <button
      type="button"
      onClick={() => openComposer()}
      className="bg-surface-top border border-edge-regular flex items-center gap-md w-full"
      style={{
        height: 64,
        padding: "0 var(--padding-small)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Dog avatar stack */}
      {photos.length > 0 && (
        <div className="flex items-center shrink-0" style={{ width: 64, height: 44, justifyContent: "center" }}>
          <img
            src={photos[0]}
            alt=""
            className="rounded-full object-cover shrink-0"
            style={{ width: 36, height: 36, border: "2px solid #f8f8f8" }}
          />
          {photos[1] && (
            <img
              src={photos[1]}
              alt=""
              className="rounded-full object-cover shrink-0"
              style={{ width: 36, height: 36, border: "2px solid #f8f8f8", marginLeft: -10 }}
            />
          )}
        </div>
      )}

      {/* Prompt text */}
      <span className="flex-1 text-sm text-fg-tertiary">
        Want to share a moment?
      </span>

      {/* Post button */}
      <span
        className="inline-flex items-center gap-xs font-semibold text-sm shrink-0"
        style={{
          background: "var(--surface-popout)",
          border: "1px solid var(--brand-strong)",
          borderRadius: "var(--radius-circle)",
          height: 32,
          padding: "0 var(--space-md)",
          color: "var(--brand-strong)",
        }}
      >
        <Camera size={16} weight="light" />
        Post
      </span>
    </button>
  );
}
