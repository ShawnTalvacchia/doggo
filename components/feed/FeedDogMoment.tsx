"use client";

import { PawPrint } from "@phosphor-icons/react";
import { FeedCard } from "./FeedCard";
import type { FeedDogMomentItem } from "@/lib/types";

export function FeedDogMoment({ item }: { item: FeedDogMomentItem }) {
  return (
    <FeedCard timestamp={item.timestamp}>
      <div className="flex items-center gap-md">
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 40, height: 40, background: "var(--brand-subtle)" }}
        >
          <PawPrint size={20} weight="fill" style={{ color: "var(--brand-main)" }} />
        </div>
        <div className="flex flex-col gap-xs flex-1">
          <span className="text-sm text-fg-primary">
            <span className="font-medium">{item.dogName}</span> {item.momentText}
          </span>
          <span className="text-sm text-fg-tertiary">
            {item.ownerName}&apos;s dog
          </span>
        </div>
      </div>
    </FeedCard>
  );
}
