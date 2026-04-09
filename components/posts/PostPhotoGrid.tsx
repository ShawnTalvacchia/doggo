"use client";

interface PostPhotoGridProps {
  photos: string[];
  /** Legacy prop — ignored */
  fullBleed?: boolean;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23e8e8e8'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%23999'%3EPhoto%3C/text%3E%3C/svg%3E";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = PLACEHOLDER;
}

/**
 * Threads-style photo grid.
 * Single horizontal row, each image individually rounded.
 * Shorter/wider proportions with visible gap.
 */
export function PostPhotoGrid({ photos }: PostPhotoGridProps) {
  if (photos.length === 0) return null;

  const count = Math.min(photos.length, 4);
  const height = count === 1 ? 320 : 220;

  return (
    <div className="post-photo-grid">
      {photos.slice(0, 4).map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          className="post-photo-grid-img"
          onError={handleImgError}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            height,
          }}
        />
      ))}
    </div>
  );
}
