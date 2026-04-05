"use client";

import Link from "next/link";
import { MapPin, Users, Lightning } from "@phosphor-icons/react";
import type { Group } from "@/lib/types";

export function GroupCard({ group }: { group: Group }) {
  // Count weekly events (mock: use meetIds length or default)
  const weeklyEvents = group.meetIds.length || 0;

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
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <Users size={16} weight="light" className="shrink-0" />
          <span>{group.members.length} members</span>
        </div>
        {weeklyEvents > 0 && (
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <Lightning size={16} weight="light" className="shrink-0" />
            <span>{weeklyEvents} Weekly {weeklyEvents === 1 ? "Event" : "Events"}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
