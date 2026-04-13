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
        background: "var(--surface-top)",
        border: "1px solid var(--border-light)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Camera size={18} weight="light" style={{ color: "var(--brand-main)" }} />
      <span className="text-sm text-fg-tertiary flex-1">Share a moment...</span>
    </button>
  );
}
