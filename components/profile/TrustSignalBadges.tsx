"use client";

import { Footprints, Calendar, MapPin } from "@phosphor-icons/react";
import type { Connection } from "@/lib/types";
import { mockMeets } from "@/lib/mockMeets";

function formatMonthYear(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function TrustSignalBadges({ connection }: { connection: Connection }) {
  const badges: { icon: React.ReactNode; text: string }[] = [];

  if (connection.meetsShared && connection.meetsShared > 0) {
    badges.push({
      icon: <Footprints size={12} weight="light" />,
      text: `Walked together ${connection.meetsShared} times`,
    });
  }

  if (connection.firstMetDate) {
    badges.push({
      icon: <Calendar size={12} weight="light" />,
      text: `Known since ${formatMonthYear(connection.firstMetDate)}`,
    });
  }

  if (connection.metAt) {
    const meet = mockMeets.find((m) => m.id === connection.metAt);
    if (meet) {
      badges.push({
        icon: <MapPin size={12} weight="light" />,
        text: `Met at ${meet.title}`,
      });
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-xs flex-wrap">
      {badges.map((badge, i) => (
        <span
          key={i}
          className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs text-fg-secondary"
          style={{ background: "var(--surface-gray)" }}
        >
          {badge.icon}
          {badge.text}
        </span>
      ))}
    </div>
  );
}
