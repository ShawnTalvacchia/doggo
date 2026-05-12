"use client";

import { Camera } from "@phosphor-icons/react";
import { usePostComposer } from "@/contexts/PostComposerContext";

export function ShareMomentBar() {
  const { openComposer } = usePostComposer();

  return (
    <button
      type="button"
      onClick={() => openComposer()}
      className="flex items-center gap-sm rounded-pill px-md py-sm w-full"
      style={{
        // Sunken-input treatment — reads as the affordance inside a
        // host strip/section (e.g. profile Posts tab strip on
        // `--surface-top`). Was `--surface-top`/`--border-light`; bumped
        // to inset + regular-weight border so the input contrasts with
        // its container and the border weight matches the post-card
        // separators in the feed. 2026-05-11.
        background: "var(--surface-inset)",
        border: "1px solid var(--border-regular)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Camera size={18} weight="light" style={{ color: "var(--brand-main)" }} />
      <span className="text-sm text-fg-tertiary flex-1">Share a moment...</span>
    </button>
  );
}
