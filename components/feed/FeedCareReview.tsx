"use client";

import { Star } from "@phosphor-icons/react";
import { FeedCard } from "./FeedCard";
import type { FeedCareReviewItem } from "@/lib/types";

export function FeedCareReview({ item }: { item: FeedCareReviewItem }) {
  return (
    <FeedCard timestamp={item.timestamp}>
      <div className="flex items-start gap-md">
        <div className="flex items-center" style={{ marginTop: 2 }}>
          <img
            src={item.reviewerAvatarUrl}
            alt={item.reviewerName}
            className="rounded-full"
            style={{ width: 28, height: 28, objectFit: "cover", border: "2px solid var(--surface-top)" }}
          />
          <img
            src={item.carerAvatarUrl}
            alt={item.carerName}
            className="rounded-full"
            style={{ width: 28, height: 28, objectFit: "cover", marginLeft: -8, border: "2px solid var(--surface-top)" }}
          />
        </div>
        <div className="flex flex-col gap-xs flex-1">
          <span className="text-sm text-fg-primary">
            <span className="font-medium">{item.reviewerName}</span> left a review for{" "}
            <span className="font-medium">{item.carerName}</span>
          </span>
          <div className="flex items-center gap-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                weight={i < item.rating ? "fill" : "light"}
                style={{ color: i < item.rating ? "var(--status-warning-main)" : "var(--text-tertiary)" }}
              />
            ))}
          </div>
          {item.snippet && (
            <p className="text-xs text-fg-secondary m-0" style={{ fontStyle: "italic" }}>
              &ldquo;{item.snippet}&rdquo;
            </p>
          )}
        </div>
      </div>
    </FeedCard>
  );
}
