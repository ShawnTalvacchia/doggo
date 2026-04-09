"use client";

import { Dog } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FeedCard } from "./FeedCard";
import type { FeedConnectionNudgeItem } from "@/lib/types";

export function FeedConnectionNudge({ item }: { item: FeedConnectionNudgeItem }) {
  return (
    <FeedCard>
      <div className="flex items-center gap-md">
        <img
          src={item.avatarUrl}
          alt={item.userName}
          className="rounded-full shrink-0"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
        <div className="flex flex-col flex-1 gap-xs">
          <span className="text-sm font-medium text-fg-primary">{item.userName}</span>
          <span className="text-sm text-fg-tertiary">
            {item.sharedMeets} meets together
            {item.dogNames.length > 0 && (
              <>
                {" · "}
                <Dog size={12} weight="light" style={{ display: "inline", verticalAlign: "middle" }} />
                {" "}{item.dogNames.join(", ")}
              </>
            )}
          </span>
        </div>
        <ButtonAction variant="outline" size="sm">
          Say hi
        </ButtonAction>
      </div>
    </FeedCard>
  );
}
