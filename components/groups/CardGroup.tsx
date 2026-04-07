"use client";

import Link from "next/link";
import {
  MapPin,
  UsersThree,
  Tree,
  UsersFour,
  Storefront,
  Dog,
  CalendarDots,
  Check,
} from "@phosphor-icons/react";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { Group, GroupType } from "@/lib/types";

/* ── Constants ─────────────────────────────────────────────────── */

const TYPE_CONFIG: Record<GroupType, { label: string; Icon: typeof Tree }> = {
  park: { label: "Park", Icon: Tree },
  community: { label: "Community", Icon: UsersFour },
  service: { label: "Hosted", Icon: Storefront },
};

/* ── Types ──────────────────────────────────────────────────────── */

interface CardGroupProps {
  group: Group;
  /** "discover" = browsing public groups; "my-groups" = user's own groups list. */
  variant?: "discover" | "my-groups";
  /** Whether the current user is a member (shows "Joined" chip in discover). */
  isMember?: boolean;
}

/* ── Component ──────────────────────────────────────────────────── */

export function CardGroup({ group, variant = "my-groups", isMember = false }: CardGroupProps) {
  const dogCount = group.members.reduce((sum, m) => sum + m.dogNames.length, 0);
  const upcomingEvents = group.meetIds.length || 0;
  const typeInfo = TYPE_CONFIG[group.groupType];
  const visibleMembers = group.members.slice(0, 5);

  return (
    <Link
      href={`/communities/${group.id}`}
      className="card-schedule-meet"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Type pill + visibility + joined status */}
      <div className="flex flex-wrap items-center gap-xs">
        <span className="card-schedule-chip card-schedule-chip--primary">
          <typeInfo.Icon size={14} weight="light" />
          {typeInfo.label}
        </span>

        {group.visibility === "approval" && (
          <span className="card-schedule-chip">
            Approval required
          </span>
        )}

        {variant === "discover" && isMember && (
          <>
            <span className="flex-1" />
            <span
              className="card-schedule-chip"
              style={{
                background: "var(--surface-subtle)",
                borderColor: "var(--surface-subtle)",
                color: "var(--brand-main)",
              }}
            >
              <Check size={13} weight="bold" />
              Joined
            </span>
          </>
        )}
      </div>

      {/* Row 2: Cover photo + name */}
      <div className="flex items-center gap-md">
        <img
          src={group.coverPhotoUrl}
          alt={group.name}
          className="rounded-full object-cover shrink-0"
          style={{ width: 44, height: 44 }}
        />
        <h3
          className="font-heading"
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "24px",
            margin: 0,
            color: "var(--text-primary)",
          }}
        >
          {group.name}
        </h3>
      </div>

      {/* Row 3: Location */}
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <MapPin size={16} weight="light" className="shrink-0" />
          {group.location || group.neighbourhood}
        </div>

        {/* Row 4: Members + dogs */}
        <div className="flex items-center gap-xs text-sm text-fg-tertiary">
          <UsersThree size={16} weight="light" className="shrink-0" />
          {group.members.length} members · {dogCount} {dogCount === 1 ? "dog" : "dogs"}
          {upcomingEvents > 0 && (
            <>
              <span style={{ padding: "0 2px" }}>·</span>
              {upcomingEvents} upcoming {upcomingEvents === 1 ? "event" : "events"}
            </>
          )}
        </div>
      </div>

      {/* Row 5: Member avatars */}
      <div className="flex items-center">
        {visibleMembers.map((m, i) =>
          m.avatarUrl ? (
            <img
              key={m.userId}
              src={m.avatarUrl}
              alt={m.userName}
              className="rounded-full border-2 border-surface-top"
              style={{
                width: 28,
                height: 28,
                objectFit: "cover",
                marginLeft: i > 0 ? -8 : 0,
              }}
            />
          ) : (
            <span key={m.userId} style={{ marginLeft: i > 0 ? -8 : 0 }}>
              <DefaultAvatar
                name={m.userName}
                size={28}
                className="border-2 border-surface-top"
              />
            </span>
          )
        )}
        {group.members.length > 5 && (
          <span
            className="flex items-center justify-center rounded-full text-xs font-medium"
            style={{
              width: 28,
              height: 28,
              marginLeft: -8,
              background: "var(--surface-gray)",
              color: "var(--text-secondary)",
            }}
          >
            +{group.members.length - 5}
          </span>
        )}
      </div>
    </Link>
  );
}
