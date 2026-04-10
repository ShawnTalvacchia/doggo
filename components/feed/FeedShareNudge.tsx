"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "@phosphor-icons/react";
import type { FeedShareNudgeItem } from "@/lib/types";

export function FeedShareNudge({ item }: { item: FeedShareNudgeItem }) {
  return (
    <Link
      href={`/meets/${item.meet.id}`}
      className="feed-card flex items-center gap-md p-md no-underline"
      style={{
        background: "var(--status-info-light)",
        border: "1px solid var(--status-info-main)",
        flexDirection: "row",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 36, height: 36, background: "var(--status-info-main)" }}
      >
        <Camera size={18} weight="fill" style={{ color: "white" }} />
      </div>
      <div className="flex flex-col gap-xs flex-1">
        <span className="text-sm font-medium text-fg-primary">
          Share your photos from {item.meet.title}
        </span>
        <span className="text-xs text-fg-tertiary">
          Your fellow attendees would love to see your moments.
        </span>
      </div>
      <ArrowRight size={18} weight="light" className="text-fg-tertiary shrink-0" />
    </Link>
  );
}
