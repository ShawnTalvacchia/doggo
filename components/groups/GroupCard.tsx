"use client";

import Link from "next/link";
import { MapPin, Users, Lightning, Tree, UsersFour, Wrench, Dog } from "@phosphor-icons/react";
import type { Group, GroupType } from "@/lib/types";

const TYPE_CONFIG: Record<GroupType, { label: string; icon: typeof Tree }> = {
  park: { label: "Park", icon: Tree },
  community: { label: "Community", icon: UsersFour },
  service: { label: "Hosted", icon: Wrench },
};

export function GroupCard({ group }: { group: Group }) {
  const weeklyEvents = group.meetIds.length || 0;
  const dogCount = group.members.reduce((sum, m) => sum + m.dogNames.length, 0);
  const typeInfo = TYPE_CONFIG[group.groupType];

  return (
    <Link
      href={`/communities/${group.id}`}
      className="bg-surface-popout flex flex-col gap-sm"
      style={{
        textDecoration: "none",
        padding: "var(--space-lg)",
        borderBottom: "1px solid var(--border-regular)",
      }}
    >
      {/* Top row: type badge */}
      <div className="flex items-center gap-md">
        <span
          className="flex items-center gap-xs text-xs font-semibold rounded-pill"
          style={{
            padding: "2px 8px",
            background: "var(--surface-inset)",
            color: "var(--text-secondary)",
          }}
        >
          <typeInfo.icon size={12} weight="regular" />
          {typeInfo.label}
        </span>
        {group.visibility === "approval" && (
          <span
            className="text-xs font-semibold rounded-pill"
            style={{
              padding: "2px 8px",
              background: "var(--brand-subtle)",
              color: "var(--brand-main)",
            }}
          >
            Approval
          </span>
        )}
      </div>

      {/* Name row: circular cover + bold name */}
      <div className="flex items-center gap-md">
        <img
          src={group.coverPhotoUrl}
          alt={group.name}
          className="rounded-full object-cover shrink-0"
          style={{ width: 48, height: 48 }}
        />
        <span className="font-body text-md font-bold text-fg-primary">
          {group.name}
        </span>
      </div>

      {/* Metadata rows */}
      <div className="flex flex-col gap-sm">
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <MapPin size={16} weight="light" className="shrink-0" />
          <span>{group.location || group.neighbourhood}</span>
        </div>
        <div className="flex items-center gap-xl">
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <Users size={16} weight="light" className="shrink-0" />
            <span>{group.members.length} members</span>
          </div>
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <Dog size={16} weight="light" className="shrink-0" />
            <span>{dogCount} dogs</span>
          </div>
        </div>
        {weeklyEvents > 0 && (
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <Lightning size={16} weight="light" className="shrink-0" />
            <span>{weeklyEvents} upcoming {weeklyEvents === 1 ? "event" : "events"}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
