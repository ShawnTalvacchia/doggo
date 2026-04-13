"use client";

import { Plus } from "@phosphor-icons/react";
import { usePostComposer } from "@/contexts/PostComposerContext";

export function HomeFAB() {
  const { openComposer } = usePostComposer();

  return (
    <button
      type="button"
      onClick={() => openComposer()}
      className="flex items-center justify-center rounded-full shadow-lg"
      style={{
        position: "fixed",
        bottom: 80, // above bottom nav
        right: 20,
        width: 52,
        height: 52,
        background: "var(--brand-main)",
        color: "white",
        zIndex: 50,
        border: "none",
        cursor: "pointer",
      }}
      aria-label="Share a moment"
    >
      <Plus size={24} weight="bold" />
    </button>
  );
}
