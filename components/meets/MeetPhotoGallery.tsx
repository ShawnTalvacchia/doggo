"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, CaretLeft, CaretRight, X, Plus } from "@phosphor-icons/react";

/**
 * MeetPhotoGallery — completed meet photo display.
 *
 * Layout adapts to photo count:
 *   1 photo   → single hero
 *   2 photos  → 2-col split
 *   3 photos  → hero + 2 side thumbs
 *   4+ photos → hero + 3 thumbs; 5th shows "+N more" overlay
 *
 * Tapping any tile opens a fullscreen lightbox with prev/next navigation.
 */
export function MeetPhotoGallery({ photos }: { photos: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  return (
    <>
      <GalleryGrid photos={photos} onOpen={open} />

      {/* Add your photos affordance — subtle, below grid */}
      <button
        type="button"
        className="flex items-center gap-sm rounded-pill px-md py-sm mt-md bg-surface-inset border border-edge-light self-start cursor-pointer"
        style={{ border: "1px dashed var(--border-regular)" }}
      >
        <Camera size={16} weight="light" className="text-fg-tertiary" />
        <span className="text-xs text-fg-secondary">Add your photos</span>
      </button>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={close}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}

/* ── Grid layout ──────────────────────────────────────────────────────────── */

function GalleryGrid({
  photos,
  onOpen,
}: {
  photos: string[];
  onOpen: (i: number) => void;
}) {
  const count = photos.length;

  // Single photo — full-width hero
  if (count === 1) {
    return (
      <div
        className="rounded-panel overflow-hidden cursor-pointer"
        style={{ aspectRatio: "16/10" }}
        onClick={() => onOpen(0)}
      >
        <img
          src={photos[0]}
          alt="Meet photo 1"
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  // Two photos — equal split
  if (count === 2) {
    return (
      <div className="grid gap-xs" style={{ gridTemplateColumns: "1fr 1fr", aspectRatio: "16/9" }}>
        {photos.map((url, i) => (
          <Tile key={i} url={url} index={i} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  // 3+ photos — hero on left, thumbs in a column/grid on right
  const thumbs = photos.slice(1, 5); // up to 4 thumbs visible
  const overflow = Math.max(0, count - 5);

  return (
    <div
      className="grid gap-xs"
      style={{
        gridTemplateColumns: "2fr 1fr",
        aspectRatio: "16/9",
      }}
    >
      {/* Hero */}
      <div
        className="rounded-panel overflow-hidden cursor-pointer"
        style={{ gridRow: `span ${Math.min(thumbs.length, 2)}` }}
        onClick={() => onOpen(0)}
      >
        <img
          src={photos[0]}
          alt="Meet photo 1"
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Thumbs stack */}
      <div
        className="grid gap-xs"
        style={{
          gridTemplateRows: thumbs.length === 1 ? "1fr" : "1fr 1fr",
          gridTemplateColumns: thumbs.length > 2 ? "1fr 1fr" : "1fr",
        }}
      >
        {thumbs.map((url, i) => {
          const realIndex = i + 1;
          const isLast = i === thumbs.length - 1 && overflow > 0;
          return (
            <div
              key={realIndex}
              className="rounded-panel overflow-hidden cursor-pointer relative"
              onClick={() => onOpen(realIndex)}
            >
              <img
                src={url}
                alt={`Meet photo ${realIndex + 1}`}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
              />
              {isLast && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  <span className="flex items-center gap-xs text-white text-base font-semibold">
                    <Plus size={16} weight="bold" />
                    {overflow}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tile({
  url,
  index,
  onOpen,
}: {
  url: string;
  index: number;
  onOpen: (i: number) => void;
}) {
  return (
    <div
      className="rounded-panel overflow-hidden cursor-pointer"
      onClick={() => onOpen(index)}
    >
      <img
        src={url}
        alt={`Meet photo ${index + 1}`}
        className="w-full h-full"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

/* ── Lightbox ─────────────────────────────────────────────────────────────── */

function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const prev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange],
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange],
  );

  // Keyboard nav + scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-label="Photo viewer"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.92)",
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
        style={{
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          background: "rgba(255,255,255,0.12)",
          color: "white",
        }}
      >
        <X size={20} weight="bold" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous photo"
          className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{
            left: 16,
            width: 44,
            height: 44,
            background: "rgba(255,255,255,0.12)",
            color: "white",
          }}
        >
          <CaretLeft size={22} weight="bold" />
        </button>
      )}

      {/* Image */}
      <img
        src={photos[index]}
        alt={`Meet photo ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "86vh",
          objectFit: "contain",
          borderRadius: "var(--radius-panel)",
        }}
      />

      {/* Next */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next photo"
          className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{
            right: 16,
            width: 44,
            height: 44,
            background: "rgba(255,255,255,0.12)",
            color: "white",
          }}
        >
          <CaretRight size={22} weight="bold" />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <div
          className="absolute text-white text-sm"
          style={{
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.12)",
            padding: "6px 12px",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {index + 1} / {photos.length}
        </div>
      )}
    </div>,
    document.body,
  );
}
