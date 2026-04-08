"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";

interface FeedUpdateProps {
  avatarUrl: string;
  title: string;
  subtitle?: string;
  href?: string;
}

/**
 * Compact activity update card (matches Figma card-update).
 * Avatar + title/subtitle + optional arrow link.
 */
export function FeedUpdate({ avatarUrl, title, subtitle, href }: FeedUpdateProps) {
  const content = (
    <div
      className="feed-card flex items-center gap-md"
      style={{ padding: "var(--padding-small)" }}
    >
      <img
        src={avatarUrl}
        alt=""
        className="rounded-full object-cover shrink-0"
        style={{ width: 36, height: 36 }}
      />
      <div className="flex flex-col gap-xs flex-1 min-w-0">
        <span className="text-sm font-semibold text-fg-primary">{title}</span>
        {subtitle && (
          <span className="text-xs text-fg-tertiary">{subtitle}</span>
        )}
      </div>
      {href && (
        <CaretRight size={16} weight="light" className="text-fg-tertiary shrink-0" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return content;
}
