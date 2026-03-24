"use client";

import { Camera } from "@phosphor-icons/react";

export function MeetPhotoGallery({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="flex flex-col gap-sm">
      <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
        Photos from the meet
      </h3>
      <div
        className="grid gap-xs"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        }}
      >
        {photos.map((url, i) => (
          <div
            key={i}
            className="rounded-sm overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={url}
              alt={`Meet photo ${i + 1}`}
              className="w-full h-full"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
        {/* Add your photos placeholder */}
        <div
          className="flex flex-col items-center justify-center gap-xs rounded-sm"
          style={{
            aspectRatio: "4/3",
            border: "2px dashed var(--border-light)",
            background: "var(--surface-inset)",
            cursor: "pointer",
          }}
        >
          <Camera size={24} weight="light" className="text-fg-tertiary" />
          <span className="text-xs text-fg-tertiary">Add yours</span>
        </div>
      </div>
    </section>
  );
}
