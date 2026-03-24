"use client";

import Link from "next/link";
import { Camera } from "@phosphor-icons/react";

export function ShareMomentBar() {
  return (
    <Link
      href="/posts/create"
      className="flex items-center gap-sm rounded-pill px-md py-sm"
      style={{
        background: "var(--surface-top)",
        border: "1px solid var(--border-light)",
        textDecoration: "none",
      }}
    >
      <Camera size={18} weight="light" style={{ color: "var(--brand-main)" }} />
      <span className="text-sm text-fg-tertiary flex-1">Share a moment...</span>
    </Link>
  );
}
