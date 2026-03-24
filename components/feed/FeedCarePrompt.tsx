"use client";

import { PawPrint, Sparkle } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { FeedCarePromptItem } from "@/lib/types";

export function FeedCarePrompt({ item }: { item: FeedCarePromptItem }) {
  const isOffer = item.type === "offer_care_prompt";

  return (
    <article
      className="feed-card flex items-center gap-md p-md"
      style={{
        background: "var(--brand-main)",
        border: "none",
        flexDirection: "row",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)" }}
      >
        {isOffer ? (
          <Sparkle size={18} weight="fill" style={{ color: "white" }} />
        ) : (
          <PawPrint size={18} weight="fill" style={{ color: "white" }} />
        )}
      </div>
      <span className="text-sm font-medium flex-1" style={{ color: "white" }}>
        {item.text}
      </span>
      <ButtonAction variant="white" size="sm" cta href={item.ctaHref}>
        {item.ctaLabel}
      </ButtonAction>
    </article>
  );
}
