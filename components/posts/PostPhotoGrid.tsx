"use client";

interface PostPhotoGridProps {
  photos: string[];
  /** When true, removes rounded corners for full-bleed in feed cards */
  fullBleed?: boolean;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23e8e8e8'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%23999'%3EPhoto%3C/text%3E%3C/svg%3E";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = PLACEHOLDER;
}

/**
 * Photo grid using flex-wrap layout (matches Figma card-post content-card).
 * Photos use flex: 1 0 0 with min-width constraints to auto-wrap into rows.
 * - 1 photo: full width
 * - 2 photos: side by side (min-width 238px each)
 * - 3-4 photos: 2-col wrapping (min-width 178px each)
 */
export function PostPhotoGrid({ photos, fullBleed = false }: PostPhotoGridProps) {
  if (photos.length === 0) return null;

  const radius = fullBleed ? undefined : "var(--radius-panel)";
  const minW = photos.length <= 2 ? 238 : 178;

  return (
    <div
      className="flex flex-wrap overflow-hidden"
      style={{ gap: 2, borderRadius: radius }}
    >
      {photos.slice(0, 4).map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          onError={handleImgError}
          style={{
            flex: "1 0 0",
            minWidth: minW,
            minHeight: 178,
            objectFit: "cover",
            display: "block",
          }}
        />
      ))}
    </div>
  );
}
