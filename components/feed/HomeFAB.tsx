"use client";

import Link from "next/link";
import { Plus } from "@phosphor-icons/react";

export function HomeFAB() {
  return (
    <Link
      href="/posts/create"
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
        textDecoration: "none",
      }}
      aria-label="Share a moment"
    >
      <Plus size={24} weight="bold" />
    </Link>
  );
}
