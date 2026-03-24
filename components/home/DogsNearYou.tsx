"use client";

import { Dog } from "@phosphor-icons/react";
import { mockMeets } from "@/lib/mockMeets";
import { mockUser } from "@/lib/mockUser";
import { getNeighbourhoodStats } from "@/lib/mockNeighbourhoodStats";

/** Deduplicated list of dogs from all meet attendees (excluding current user). */
function getNeighbourhoodDogs() {
  const seen = new Set<string>();
  const dogs: { userId: string; userName: string; avatarUrl: string; dogName: string }[] = [];

  for (const meet of mockMeets) {
    for (const attendee of meet.attendees) {
      if (attendee.userId === mockUser.id) continue;
      for (const dogName of attendee.dogNames) {
        const key = `${attendee.userId}-${dogName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        dogs.push({
          userId: attendee.userId,
          userName: attendee.userName,
          avatarUrl: attendee.avatarUrl,
          dogName,
        });
      }
    }
  }
  return dogs;
}

export function DogsNearYou() {
  const dogs = getNeighbourhoodDogs();
  const stats = getNeighbourhoodStats();

  if (dogs.length === 0) return null;

  return (
    <section className="flex flex-col gap-md">
      <h2 className="font-heading text-xl font-semibold text-fg-primary flex items-center gap-sm">
        <Dog size={22} weight="light" className="text-brand-main" />
        {stats.activeDogs} dogs in {stats.neighbourhood}
      </h2>
      <div
        className="flex gap-md pb-sm"
        style={{ overflowX: "auto", scrollSnapType: "x mandatory" }}
      >
        {dogs.map((dog, i) => (
          <div
            key={`${dog.userId}-${dog.dogName}`}
            className="flex flex-col items-center gap-xs flex-shrink-0"
            style={{ scrollSnapAlign: "start", width: 72 }}
          >
            <img
              src={dog.avatarUrl}
              alt={dog.dogName}
              className="rounded-full"
              style={{
                width: 48,
                height: 48,
                objectFit: "cover",
                border: "2px solid var(--border-light)",
              }}
            />
            <span className="text-xs text-fg-secondary text-center" style={{ lineHeight: 1.2 }}>
              {dog.dogName}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
