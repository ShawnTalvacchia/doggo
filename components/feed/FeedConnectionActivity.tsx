"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { FeedCard } from "./FeedCard";
import type { FeedConnectionActivityItem } from "@/lib/types";

export function FeedConnectionActivity({ item }: { item: FeedConnectionActivityItem }) {
  return (
    <FeedCard timestamp={item.timestamp}>
      <div className="flex items-center gap-md">
        <img
          src={item.avatarUrl}
          alt={item.userName}
          className="rounded-full shrink-0"
          style={{ width: 36, height: 36, objectFit: "cover" }}
        />
        <div className="flex flex-col flex-1 gap-xs">
          <span className="text-sm text-fg-primary">
            <Link
              href={`/profile/${item.userId}`}
              className="font-medium text-fg-primary"
              style={{ textDecoration: "none" }}
            >
              {item.userName}
            </Link>
            {" "}{item.activity}
          </span>
          {item.connectionContext && (
            <span className="text-xs text-fg-tertiary">{item.connectionContext}</span>
          )}
        </div>
        <Link
          href={`/profile/${item.userId}`}
          className="text-brand-main"
          style={{ textDecoration: "none" }}
        >
          <ArrowRight size={16} weight="light" />
        </Link>
      </div>
    </FeedCard>
  );
}
