"use client";

import { Trophy } from "@phosphor-icons/react";
import type { FeedMilestoneItem } from "@/lib/types";

export function FeedMilestone({ item }: { item: FeedMilestoneItem }) {
  return (
    <article
      className="feed-card flex items-center gap-md p-md"
      style={{
        background: "var(--brand-subtle)",
        border: "1px solid var(--brand-main)",
        flexDirection: "row",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 36, height: 36, background: "var(--brand-main)" }}
      >
        <Trophy size={18} weight="fill" style={{ color: "white" }} />
      </div>
      <div className="flex flex-col gap-xs flex-1">
        <span className="text-sm font-medium text-fg-primary">{item.text}</span>
        {item.subtext && (
          <span className="text-xs text-fg-tertiary">{item.subtext}</span>
        )}
      </div>
    </article>
  );
}
