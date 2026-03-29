"use client";

import Link from "next/link";
import { PawPrint, User, UsersThree, MapPin } from "@phosphor-icons/react";
import type { PostTag } from "@/lib/types";

const TAG_ICONS = {
  dog: PawPrint,
  person: User,
  community: UsersThree,
  place: MapPin,
} as const;

const TAG_HREFS: Record<string, string | null> = {
  dog: "/profile",
  person: "/profile",
  community: "/communities",
  place: null,
};

export function TagPill({ tag }: { tag: PostTag }) {
  const Icon = TAG_ICONS[tag.type];
  const hrefPrefix = TAG_HREFS[tag.type];

  const content = (
    <span
      className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
      style={{
        background: "var(--surface-base)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-regular)",
      }}
    >
      <Icon size={12} weight="light" />
      {tag.label}
    </span>
  );

  if (hrefPrefix) {
    return (
      <Link
        href={`${hrefPrefix}/${tag.id}`}
        style={{ textDecoration: "none" }}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function TagPillRow({ tags }: { tags: PostTag[] }) {
  if (tags.length === 0) return null;
  return (
    <>
      {tags.map((tag) => (
        <TagPill key={`${tag.type}-${tag.id}`} tag={tag} />
      ))}
    </>
  );
}
