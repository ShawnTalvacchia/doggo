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

export function PostPhotoGrid({ photos, fullBleed = false }: PostPhotoGridProps) {
  if (photos.length === 0) return null;

  const radius = fullBleed ? undefined : "var(--radius-panel)";

  if (photos.length === 1) {
    return (
      <div className="overflow-hidden" style={{ borderRadius: radius }}>
        <img
          src={photos[0]}
          alt=""
          onError={handleImgError}
          className="w-full"
          style={{ height: 320, objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  if (photos.length === 2) {
    return (
      <div className="grid overflow-hidden" style={{ gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: radius }}>
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            onError={handleImgError}
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
        ))}
      </div>
    );
  }

  if (photos.length === 3) {
    return (
      <div className="grid overflow-hidden" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2, borderRadius: radius }}>
        <img
          src={photos[0]}
          alt=""
          onError={handleImgError}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", gridRow: "1 / 3" }}
        />
        <img
          src={photos[1]}
          alt=""
          onError={handleImgError}
          style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
        />
        <img
          src={photos[2]}
          alt=""
          onError={handleImgError}
          style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  // 4 photos: 2×2 grid
  return (
    <div className="grid overflow-hidden" style={{ gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: radius }}>
      {photos.slice(0, 4).map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          onError={handleImgError}
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
        />
      ))}
    </div>
  );
}
