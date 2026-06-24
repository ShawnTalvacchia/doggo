"use client";

/**
 * ShelterHandoverBoard — the operator's "today's walks" board (Phase 2 "The
 * Shelter's Side", 2026-06-24). The hero of the operator view: the surface
 * that makes the shelter pitch concrete — "here's how little work this is."
 *
 * It tracks the shelter's CUSTODY of each dog around a walk: check-out
 * (release the dog to the walker) → back-safe check-in (confirm the dog
 * returned). These are the shelter's actions, distinct from the walker's own
 * session rails (check-in / finish / visit report). The check-out/check-in
 * trail is the logged accountability + the "back safe" reassurance from the
 * positioning four axes (visibility / accountability / competence / control).
 *
 * Reads shelter-walk Bookings (`ownerKind === "shelter"`) for this shelter;
 * writes `session.releasedAt` / `session.returnedAt` via `updateSession`.
 *
 * Group walks (bookings sharing a `dropoffMeetId`) are grouped so the
 * operator can release the batch at once — the FC18 multi-dog checkout
 * question, shown as a PROPOSAL (the mentor signs out the group as the
 * responsible party), not a committed model.
 */

import { useMemo } from "react";
import Link from "next/link";
import {
  DoorOpen,
  CheckCircle,
  ShieldCheck,
  Camera,
  PawPrint,
  ArrowsOut,
} from "@phosphor-icons/react";
import type { Booking, BookingSession, PetProfile, ShelterProfile } from "@/lib/types";
import { useBookings } from "@/contexts/BookingsContext";
import { getMeetById } from "@/lib/mockMeets";
import { getUserById } from "@/lib/mockUsers";
import { EmptyState } from "@/components/ui/EmptyState";

/* ── Handover lifecycle ───────────────────────────────────────────────── */

type HandoverState = "due" | "out" | "back";

function handoverState(s: BookingSession | undefined): HandoverState {
  if (!s) return "due";
  if (s.returnedAt) return "back";
  if (s.releasedAt) return "out";
  return "due";
}

function fmtTime(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

/* ── Board ────────────────────────────────────────────────────────────── */

export function ShelterHandoverBoard({ shelter }: { shelter: ShelterProfile }) {
  const { bookings, updateSession } = useBookings();

  const walks = useMemo(
    () =>
      bookings.filter(
        (b) => b.ownerKind === "shelter" && b.ownerId === shelter.id,
      ),
    [bookings, shelter.id],
  );

  // Split solo vs group (group = shares a dropoffMeetId). Group walks get
  // batched into one card per meet so the operator releases them together.
  const soloWalks = walks.filter((b) => !b.dropoffMeetId);
  const groupBatches = useMemo(() => {
    const byMeet = new Map<string, Booking[]>();
    for (const b of walks) {
      if (!b.dropoffMeetId) continue;
      const arr = byMeet.get(b.dropoffMeetId) ?? [];
      arr.push(b);
      byMeet.set(b.dropoffMeetId, arr);
    }
    return [...byMeet.entries()];
  }, [walks]);

  const dueSolo = soloWalks.filter((b) => handoverState(b.sessions?.[0]) === "due");
  const outSolo = soloWalks.filter((b) => handoverState(b.sessions?.[0]) === "out");
  const backSolo = soloWalks.filter((b) => handoverState(b.sessions?.[0]) === "back");

  const checkOut = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { releasedAt: nowIso() });
  };
  const checkIn = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { returnedAt: nowIso(), status: "completed" });
  };
  const checkOutBatch = (batch: Booking[]) => {
    for (const b of batch) {
      const s = b.sessions?.[0];
      if (s && !s.releasedAt) updateSession(b.id, s.id, { releasedAt: nowIso() });
    }
  };

  const dogByName = (name: string): PetProfile | undefined =>
    shelter.dogs.find((d) => d.name === name);

  const total = walks.length;
  const outCount = outSolo.length + groupBatches.flatMap(([, b]) => b).filter((b) => handoverState(b.sessions?.[0]) === "out").length;

  if (total === 0) {
    return (
      <div className="px-lg py-xl">
        <EmptyState
          icon={<PawPrint size={32} weight="light" />}
          title="No walks scheduled today"
          subtitle="When a walker books one of your dogs, it lands here to check out and back in."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg p-md">
      {/* Glance summary — the "how little work this is" read at a glance. */}
      <div className="flex items-center gap-lg rounded-panel border border-edge-regular bg-surface-base px-md py-sm">
        <SummaryStat value={dueSolo.length + groupBatches.flatMap(([, b]) => b).filter((b) => handoverState(b.sessions?.[0]) === "due").length} label="to collect" />
        <span className="h-7 w-px bg-edge-regular" aria-hidden />
        <SummaryStat value={outCount} label="out now" tone="volunteer" />
        <span className="h-7 w-px bg-edge-regular" aria-hidden />
        <SummaryStat value={backSolo.length} label="back safe" tone="success" />
      </div>

      {/* Group walk batch(es) — the multi-dog release proposal. */}
      {groupBatches.map(([meetId, batch]) => (
        <GroupBatchCard
          key={meetId}
          meetId={meetId}
          batch={batch}
          dogByName={dogByName}
          onCheckOutBatch={() => checkOutBatch(batch)}
          onCheckIn={checkIn}
        />
      ))}

      {dueSolo.length > 0 && (
        <Section title="Due to collect">
          {dueSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} onCheckOut={() => checkOut(b)} />
          ))}
        </Section>
      )}

      {outSolo.length > 0 && (
        <Section title="Out now">
          {outSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} onCheckIn={() => checkIn(b)} />
          ))}
        </Section>
      )}

      {backSolo.length > 0 && (
        <Section title="Back safe today">
          {backSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} />
          ))}
        </Section>
      )}
    </div>
  );
}

function SummaryStat({ value, label, tone }: { value: number; label: string; tone?: "volunteer" | "success" }) {
  const color =
    tone === "volunteer" ? "text-volunteer" : tone === "success" ? "text-success" : "text-fg-primary";
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-semibold leading-none ${color}`}>{value}</span>
      <span className="text-xs text-fg-tertiary mt-tiny">{label}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-sm">
      <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-fg-tertiary">{title}</h3>
      <div className="flex flex-col gap-sm">{children}</div>
    </div>
  );
}

/* ── Solo handover row ────────────────────────────────────────────────── */

function HandoverRow({
  booking,
  dog,
  onCheckOut,
  onCheckIn,
}: {
  booking: Booking;
  dog?: PetProfile;
  onCheckOut?: () => void;
  onCheckIn?: () => void;
}) {
  const s = booking.sessions?.[0];
  const state = handoverState(s);
  const finishedAt = s?.report?.completedAt;

  let statusLine: string;
  if (state === "due") {
    statusLine = "Waiting to be collected";
  } else if (state === "out") {
    statusLine = finishedAt
      ? `Walk finished ${fmtTime(finishedAt)} · confirm back safe`
      : s?.checkedInAt
        ? `Out since ${fmtTime(s.releasedAt)} · walking`
        : `Released ${fmtTime(s?.releasedAt)}`;
  } else {
    statusLine = `Back safe ${fmtTime(s?.returnedAt)}`;
  }

  return (
    <div className="flex items-center gap-md rounded-panel border border-edge-regular bg-surface-base p-sm">
      {/* Dog avatar — rounded-square (Avatar Rule B). */}
      {dog?.imageUrl ? (
        <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
          <img src={dog.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
        </Link>
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-surface-inset">
          <PawPrint size={20} weight="light" className="text-fg-tertiary" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-tiny">
        <span className="truncate text-sm font-semibold text-fg-primary">{booking.pets[0]}</span>
        <span className="flex items-center gap-xs truncate text-xs text-fg-secondary">
          <img src={booking.carerAvatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
          {booking.carerName}
        </span>
        <span
          className={`flex items-center gap-tiny text-xs ${
            state === "out" && finishedAt
              ? "text-volunteer-strong"
              : state === "back"
                ? "text-success"
                : "text-fg-tertiary"
          }`}
        >
          {state === "back" && <CheckCircle size={12} weight="fill" />}
          {state === "out" && finishedAt && <Camera size={12} weight="light" />}
          {statusLine}
        </span>
      </div>

      {onCheckOut && (
        <button
          type="button"
          onClick={onCheckOut}
          className="flex flex-shrink-0 items-center gap-xs rounded-pill bg-volunteer px-md py-xs text-xs font-semibold text-volunteer-soft"
        >
          <DoorOpen size={14} weight="bold" />
          Check out
        </button>
      )}
      {onCheckIn && (
        <button
          type="button"
          onClick={onCheckIn}
          className="flex flex-shrink-0 items-center gap-xs rounded-pill border border-volunteer-border bg-volunteer-light px-md py-xs text-xs font-semibold text-volunteer-strong"
        >
          <ShieldCheck size={14} weight="bold" />
          Back safe
        </button>
      )}
    </div>
  );
}

/* ── Group walk batch card (FC18 multi-dog release proposal) ───────────── */

function GroupBatchCard({
  meetId,
  batch,
  dogByName,
  onCheckOutBatch,
  onCheckIn,
}: {
  meetId: string;
  batch: Booking[];
  dogByName: (name: string) => PetProfile | undefined;
  onCheckOutBatch: () => void;
  onCheckIn: (b: Booking) => void;
}) {
  const meet = getMeetById(meetId);
  const host = meet ? getUserById(meet.creatorId) : undefined;
  const hostName = host ? `${host.firstName} ${host.lastName}`.trim() : meet?.creatorName;

  const allDue = batch.every((b) => handoverState(b.sessions?.[0]) === "due");
  const anyOut = batch.some((b) => handoverState(b.sessions?.[0]) === "out");

  return (
    <div className="flex flex-col gap-sm rounded-panel border border-volunteer-border bg-volunteer-light/40 p-md">
      <div className="flex items-start gap-sm">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-volunteer-light text-volunteer-strong">
          <ArrowsOut size={18} weight="light" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-tiny">
          <span className="text-sm font-semibold text-fg-primary">
            {meet?.title ?? "Group walk"}
          </span>
          <span className="text-xs text-fg-secondary">
            {batch.length} dogs{hostName ? ` · led by ${hostName}` : ""}
          </span>
        </div>
        {meet && (
          <Link href={`/meets/${meet.id}`} className="flex-shrink-0 text-xs font-medium text-volunteer-strong">
            View walk
          </Link>
        )}
      </div>

      {/* The dogs in the batch. */}
      <div className="flex flex-col gap-xs">
        {batch.map((b) => {
          const dog = dogByName(b.pets[0]);
          const state = handoverState(b.sessions?.[0]);
          return (
            <div key={b.id} className="flex items-center gap-sm rounded-md bg-surface-base px-sm py-xs">
              {dog?.imageUrl ? (
                <img src={dog.imageUrl} alt="" className="h-8 w-8 flex-shrink-0 rounded-md object-cover" />
              ) : (
                <div className="h-8 w-8 flex-shrink-0 rounded-md bg-surface-inset" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-fg-primary">{b.pets[0]}</span>
                <span className="truncate text-xs text-fg-tertiary">{b.carerName}</span>
              </div>
              {state === "back" ? (
                <span className="flex items-center gap-tiny text-xs text-success">
                  <CheckCircle size={12} weight="fill" /> Back safe
                </span>
              ) : state === "out" ? (
                <button
                  type="button"
                  onClick={() => onCheckIn(b)}
                  className="rounded-pill border border-volunteer-border bg-volunteer-light px-sm py-tiny text-xs font-semibold text-volunteer-strong"
                >
                  Back safe
                </button>
              ) : (
                <span className="text-xs text-fg-tertiary">Ready</span>
              )}
            </div>
          );
        })}
      </div>

      {/* The proposal: who is the responsible party for a batch release. */}
      <p className="m-0 rounded-md bg-surface-base px-sm py-xs text-xs text-fg-tertiary">
        Proposal: {hostName ?? "the host"} signs out the group as the responsible walker — one
        check-out for the batch, not one per dog. Does that match how you&rsquo;d hand off several
        dogs at once?
      </p>

      {allDue && (
        <button
          type="button"
          onClick={onCheckOutBatch}
          className="flex items-center justify-center gap-xs rounded-pill bg-volunteer px-md py-sm text-sm font-semibold text-volunteer-soft"
        >
          <DoorOpen size={16} weight="bold" />
          Check out all · {batch.length} dogs
        </button>
      )}
      {anyOut && !allDue && (
        <span className="text-center text-xs text-fg-tertiary">Group is out — confirm each back safe on return.</span>
      )}
    </div>
  );
}
