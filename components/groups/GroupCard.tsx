"use client";

import Link from "next/link";
import { UsersThree, Lock, ShieldCheck, MapPin, CalendarDots } from "@phosphor-icons/react";
import type { Group } from "@/lib/types";
import { getNextGroupMeet } from "@/lib/mockGroups";

function formatMeetDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${day} ${month}, ${time}`;
}

export function GroupCard({ group }: { group: Group }) {
  const nextMeet = getNextGroupMeet(group.id);
  const totalDogs = group.members.reduce((sum, m) => sum + m.dogNames.length, 0);

  return (
    <Link
      href={`/communities/${group.id}`}
      className="flex flex-col rounded-panel bg-surface-top shadow-sm overflow-hidden"
      style={{ textDecoration: "none" }}
    >
      {/* Cover photo stripe */}
      <div
        className="w-full"
        style={{
          height: 80,
          backgroundImage: `url(${group.coverPhotoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="flex flex-col gap-sm p-md">
        {/* Name + badges */}
        <div className="flex items-center gap-xs flex-wrap">
          <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
            {group.name}
          </h3>
          {group.visibility !== "open" && (
            <span
              className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
              style={{ background: "var(--surface-gray)", color: "var(--text-secondary)" }}
            >
              {group.visibility === "private" ? (
                <><Lock size={10} weight="fill" /> Private</>
              ) : (
                <><ShieldCheck size={10} weight="fill" /> Approval</>
              )}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-xs text-sm text-fg-secondary">
          <span className="flex items-center gap-xs">
            <MapPin size={14} weight="light" />
            {group.neighbourhood}
          </span>
          <span className="flex items-center gap-xs">
            <UsersThree size={14} weight="light" />
            {group.members.length} {group.members.length === 1 ? "member" : "members"} · {totalDogs} {totalDogs === 1 ? "dog" : "dogs"}
          </span>
        </div>

        {/* Member avatars */}
        <div className="flex items-center">
          {group.members.slice(0, 5).map((m, i) => (
            <img
              key={m.userId}
              src={m.avatarUrl}
              alt={m.userName}
              className="rounded-full border-2"
              style={{
                width: 28,
                height: 28,
                objectFit: "cover",
                borderColor: "var(--surface-top)",
                marginLeft: i > 0 ? -8 : 0,
              }}
            />
          ))}
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

        {/* Next meet */}
        {nextMeet && (
          <div
            className="flex items-center gap-xs rounded-sm px-sm py-xs text-xs text-fg-secondary"
            style={{ background: "var(--surface-inset)" }}
          >
            <CalendarDots size={12} weight="light" />
            Next: {formatMeetDate(nextMeet.date, nextMeet.time)}
          </div>
        )}
      </div>
    </Link>
  );
}
