"use client";

/**
 * ShelterScheduleView — the operator's Schedule (Phase 2 "The Shelter's Side").
 * Replaces the consumer `/schedule` when the operator persona is active. Two
 * parts: today's **handover board** (the live check-out / back-safe surface)
 * and an **Upcoming** list of future-dated walks. "Schedule, not just Today" —
 * the operator sees what's coming, not only the current moment.
 */

import { useMemo } from "react";
import Link from "next/link";
import { CalendarBlank, PawPrint } from "@phosphor-icons/react";
import type { Booking, PetProfile, ShelterProfile } from "@/lib/types";
import { useBookings } from "@/contexts/BookingsContext";
import { daysFromNow } from "@/lib/mockDate";
import { ShelterHandoverBoard } from "./ShelterHandoverBoard";
import { WalkerTierPill } from "./WalkerTierPill";

function dateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export function ShelterScheduleView({ shelter }: { shelter: ShelterProfile }) {
  const { bookings } = useBookings();
  const today = daysFromNow(0);

  const upcoming = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            b.ownerKind === "shelter" &&
            b.ownerId === shelter.id &&
            (b.sessions?.[0]?.date ?? "") > today,
        )
        .sort((a, b) =>
          (a.sessions?.[0]?.date ?? "").localeCompare(b.sessions?.[0]?.date ?? ""),
        ),
    [bookings, shelter.id, today],
  );

  // Group upcoming by date.
  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of upcoming) {
      const d = b.sessions?.[0]?.date ?? "";
      const arr = map.get(d) ?? [];
      arr.push(b);
      map.set(d, arr);
    }
    return [...map.entries()];
  }, [upcoming]);

  const dogByName = (name: string): PetProfile | undefined =>
    shelter.dogs.find((d) => d.name === name);
  const tierFor = (userId: string) => shelter.walkers.find((w) => w.userId === userId)?.tier;

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex flex-col gap-sm">
        <h2 className="m-0 px-md pt-md text-sm font-semibold text-fg-secondary">Today</h2>
        <ShelterHandoverBoard shelter={shelter} />
      </section>

      <section className="flex flex-col gap-sm">
        <h2 className="m-0 px-md text-sm font-semibold text-fg-secondary">Upcoming</h2>
        {grouped.length === 0 ? (
          <p className="px-md text-xs text-fg-tertiary">No walks booked beyond today yet.</p>
        ) : (
          <div className="flex flex-col gap-md px-md">
            {grouped.map(([date, rows]) => (
              <div key={date} className="flex flex-col gap-xs">
                <h3 className="m-0 flex items-center gap-xs text-xs font-medium text-fg-tertiary">
                  <CalendarBlank size={13} weight="light" />
                  {dateLabel(date)}
                </h3>
                {rows.map((b) => {
                  const dog = dogByName(b.pets[0]);
                  const tier = tierFor(b.carerId);
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-md rounded-panel border border-edge-regular bg-surface-base p-sm"
                    >
                      {dog?.imageUrl ? (
                        <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
                          <img src={dog.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
                        </Link>
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface-inset">
                          <PawPrint size={18} weight="light" className="text-fg-tertiary" />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-tiny">
                        <span className="truncate text-sm font-semibold text-fg-primary">{b.pets[0]}</span>
                        <span className="flex items-center gap-xs text-xs text-fg-secondary">
                          <img src={b.carerAvatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                          <span className="truncate">{b.carerName}</span>
                          {tier && <WalkerTierPill tier={tier} />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
