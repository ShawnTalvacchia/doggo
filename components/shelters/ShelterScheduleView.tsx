"use client";

/**
 * ShelterScheduleView — the operator's Schedule (Phase 2 "The Shelter's Side").
 * Mirrors the consumer Schedule's tabbed shape, tuned for a shelter:
 *   - Today    — the live handover board (larger cards, check-out / back-safe
 *                actions). Hides to an empty state when nothing's on today.
 *   - Upcoming — future walks, smaller cards, no actions, grouped by day, with
 *                a date jump to look further ahead.
 *   - History  — a concise record of past walks (back-safe confirmations).
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarBlank, PawPrint, CheckCircle } from "@phosphor-icons/react";
import type { Booking, PetProfile, ShelterProfile, WalkerTier } from "@/lib/types";
import { useBookings } from "@/contexts/BookingsContext";
import { daysFromNow } from "@/lib/mockDate";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShelterHandoverBoard } from "./ShelterHandoverBoard";
import { WalkerTierPill } from "./WalkerTierPill";

type ScheduleTab = "today" | "upcoming" | "history";

function dateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (d.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export function ShelterScheduleView({ shelter }: { shelter: ShelterProfile }) {
  const { bookings } = useBookings();
  const [tab, setTab] = useState<ScheduleTab>("today");
  const today = daysFromNow(0);

  const shelterWalks = useMemo(
    () => bookings.filter((b) => b.ownerKind === "shelter" && b.ownerId === shelter.id),
    [bookings, shelter.id],
  );

  const dogByName = (name: string): PetProfile | undefined =>
    shelter.dogs.find((d) => d.name === name);
  const tierFor = (userId: string) => shelter.walkers.find((w) => w.userId === userId)?.tier;

  const TABS = [
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "history", label: "History" },
  ];

  return (
    <>
      <div className="page-column-panel-tabs">
        <TabBar tabs={TABS} activeKey={tab} onChange={(k) => setTab(k as ScheduleTab)} />
      </div>

      {tab === "today" && <ShelterHandoverBoard shelter={shelter} />}
      {tab === "upcoming" && (
        <UpcomingTab
          walks={shelterWalks.filter((b) => (b.sessions?.[0]?.date ?? "") > today)}
          dogByName={dogByName}
          tierFor={tierFor}
        />
      )}
      {tab === "history" && (
        <HistoryTab
          walks={shelterWalks.filter(
            (b) => b.sessions?.[0]?.returnedAt && (b.sessions?.[0]?.date ?? "") < today,
          )}
          dogByName={dogByName}
          tierFor={tierFor}
        />
      )}
    </>
  );
}

/* ── Upcoming ─────────────────────────────────────────────────────────── */

function UpcomingTab({
  walks,
  dogByName,
  tierFor,
}: {
  walks: Booking[];
  dogByName: (name: string) => PetProfile | undefined;
  tierFor: (userId: string) => WalkerTier | undefined;
}) {
  const [from, setFrom] = useState<string>("");

  const sorted = [...walks].sort((a, b) =>
    (a.sessions?.[0]?.date ?? "").localeCompare(b.sessions?.[0]?.date ?? ""),
  );
  const filtered = from ? sorted.filter((b) => (b.sessions?.[0]?.date ?? "") >= from) : sorted;

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of filtered) {
      const d = b.sessions?.[0]?.date ?? "";
      const arr = map.get(d) ?? [];
      arr.push(b);
      map.set(d, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="flex flex-col gap-md p-md">
      {/* Date jump — look further ahead at a specific day's reservations. */}
      <label className="flex items-center gap-sm text-xs text-fg-tertiary">
        <span>Jump to</span>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-form border border-edge-regular bg-surface-base px-sm py-tiny text-xs text-fg-primary"
        />
        {from && (
          <button type="button" onClick={() => setFrom("")} className="text-volunteer-strong">
            Clear
          </button>
        )}
      </label>

      {grouped.length === 0 ? (
        <EmptyState
          icon={<CalendarBlank size={32} weight="light" />}
          title="No upcoming walks"
          subtitle="Walks booked for future days show up here."
        />
      ) : (
        grouped.map(([date, rows]) => (
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
                  className="flex items-center gap-sm rounded-panel border border-edge-regular bg-surface-base p-sm"
                >
                  {dog?.imageUrl ? (
                    <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
                      <img src={dog.imageUrl} alt="" className="h-9 w-9 rounded-md object-cover" />
                    </Link>
                  ) : (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-surface-inset">
                      <PawPrint size={16} weight="light" className="text-fg-tertiary" />
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
        ))
      )}
    </div>
  );
}

/* ── History ──────────────────────────────────────────────────────────── */

function HistoryTab({
  walks,
  dogByName,
  tierFor,
}: {
  walks: Booking[];
  dogByName: (name: string) => PetProfile | undefined;
  tierFor: (userId: string) => WalkerTier | undefined;
}) {
  // Most-recent first.
  const sorted = [...walks].sort((a, b) =>
    (b.sessions?.[0]?.returnedAt ?? "").localeCompare(a.sessions?.[0]?.returnedAt ?? ""),
  );

  if (sorted.length === 0) {
    return (
      <div className="px-lg py-xl">
        <EmptyState
          icon={<CheckCircle size={32} weight="light" />}
          title="No past walks yet"
          subtitle="Completed walks, back safe and logged, will keep a record here."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-md">
      <p className="m-0 pb-sm text-xs text-fg-tertiary">
        A concise record of completed walks. Fuller reporting and exports come with the full build.
      </p>
      <div className="flex flex-col divide-y divide-edge-regular border-y border-edge-regular">
        {sorted.map((b) => {
          const dog = dogByName(b.pets[0]);
          const date = b.sessions?.[0]?.date ?? "";
          const tier = tierFor(b.carerId);
          return (
            <div key={b.id} className="flex items-center gap-sm py-sm">
              {dog?.imageUrl ? (
                <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
                  <img src={dog.imageUrl} alt="" className="h-8 w-8 rounded-md object-cover" />
                </Link>
              ) : (
                <div className="h-8 w-8 flex-shrink-0 rounded-md bg-surface-inset" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-xs text-sm text-fg-primary">
                  <span className="truncate font-semibold">{b.pets[0]}</span>
                  <span className="truncate font-normal text-fg-secondary">· {b.carerName}</span>
                  {tier && <WalkerTierPill tier={tier} />}
                </span>
                <span className="text-xs text-fg-tertiary">{dateLabel(date)}</span>
              </div>
              <span className="flex flex-shrink-0 items-center gap-tiny text-xs text-success">
                <CheckCircle size={13} weight="fill" /> Back safe
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
