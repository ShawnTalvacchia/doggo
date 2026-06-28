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
  PawPrint,
  Users,
} from "@phosphor-icons/react";
import type { Booking, BookingSession, PetProfile, ShelterProfile, WalkerTier } from "@/lib/types";
import { useBookings } from "@/contexts/BookingsContext";
import { getMeetById } from "@/lib/mockMeets";
import { getUserById } from "@/lib/mockUsers";
import { daysFromNow } from "@/lib/mockDate";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { WalkerTierPill } from "@/components/shelters/WalkerTierPill";
import { formatSlotTime } from "@/components/shelters/WalkerHandoverModal";

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

export function ShelterHandoverBoard({
  shelter,
  onOpenWalker,
}: {
  shelter: ShelterProfile;
  onOpenWalker?: (b: Booking) => void;
}) {
  const { bookings, updateSession } = useBookings();

  // The handover board is the LIVE/today view — walks dated today, plus any
  // still-out straggler from a prior day (released, not yet returned). Future
  // walks live in Upcoming; past completed (returned) walks live in History.
  const today = daysFromNow(0);
  const walks = useMemo(
    () =>
      bookings.filter((b) => {
        if (b.ownerKind !== "shelter" || b.ownerId !== shelter.id) return false;
        const s = b.sessions?.[0];
        const date = s?.date ?? today;
        return date === today || (!s?.returnedAt && date < today);
      }),
    [bookings, shelter.id, today],
  );

  // Resolve a walker's earned tier from the shelter roster (for the credential
  // pill on each row — vouched progression made visible on the board).
  const tierFor = (userId: string): WalkerTier | undefined =>
    shelter.walkers.find((w) => w.userId === userId)?.tier;

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
      {/* Glance summary — the "how little work this is" read at a glance.
          Numbers are neutral; the labels carry the meaning (kept restrained
          on colour per design review). */}
      <div className="grid grid-cols-3 divide-x divide-edge-regular rounded-panel border border-edge-regular bg-surface-top py-sm">
        <SummaryStat
          value={
            dueSolo.length +
            groupBatches
              .flatMap(([, b]) => b)
              .filter((b) => handoverState(b.sessions?.[0]) === "due").length
          }
          label="to collect"
        />
        <SummaryStat value={outCount} label="out now" />
        <SummaryStat value={backSolo.length} label="back safe" />
      </div>

      {/* Group walk batch(es) — the multi-dog release proposal. */}
      {groupBatches.map(([meetId, batch]) => (
        <GroupBatchCard
          key={meetId}
          meetId={meetId}
          batch={batch}
          dogByName={dogByName}
          tierFor={tierFor}
          onOpenWalker={onOpenWalker}
          onCheckOut={checkOut}
          onCheckOutBatch={() => checkOutBatch(batch)}
          onCheckIn={checkIn}
        />
      ))}

      {dueSolo.length > 0 && (
        <Section title="Due to collect">
          {dueSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} tier={tierFor(b.carerId)} onOpenWalker={() => onOpenWalker?.(b)} onCheckOut={() => checkOut(b)} />
          ))}
        </Section>
      )}

      {outSolo.length > 0 && (
        <Section title="Out now">
          {outSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} tier={tierFor(b.carerId)} onOpenWalker={() => onOpenWalker?.(b)} onCheckIn={() => checkIn(b)} />
          ))}
        </Section>
      )}

      {backSolo.length > 0 && (
        <Section title="Back safe today">
          {backSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} tier={tierFor(b.carerId)} onOpenWalker={() => onOpenWalker?.(b)} />
          ))}
        </Section>
      )}
    </div>
  );
}

function SummaryStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-semibold leading-none text-fg-primary">{value}</span>
      <span className="mt-tiny text-xs text-fg-tertiary">{label}</span>
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
  tier,
  bare,
  onOpenWalker,
  onCheckOut,
  onCheckIn,
}: {
  booking: Booking;
  dog?: PetProfile;
  tier?: WalkerTier;
  /** Chromeless variant — drops the card border/fill/padding so the row sits
   *  inside another card (the group-walk card), keeping every size identical
   *  to the standalone card. */
  bare?: boolean;
  /** Open the walker hand-off check (clicking the walker). */
  onOpenWalker?: () => void;
  onCheckOut?: () => void;
  onCheckIn?: () => void;
}) {
  const s = booking.sessions?.[0];
  const state = handoverState(s);
  const finishedAt = s?.report?.completedAt;
  const slot = formatSlotTime(s?.startTime);

  // The dog + time, on one secondary line. The shelter knows the dog, so it's
  // context — the walker (who they're handing the dog to) is the protagonist.
  let detail = "";
  if (state === "due") detail = slot ? `· ${slot}` : "";
  else if (state === "out")
    detail = finishedAt ? `· walk done ${fmtTime(finishedAt)}` : `· out since ${fmtTime(s?.releasedAt)}`;

  const container = bare
    ? "flex flex-wrap items-center gap-md py-md"
    : "flex flex-wrap items-center gap-md rounded-panel border border-edge-regular bg-surface-top p-md";

  return (
    <div className={container}>
      {/* Walker avatar — circle (Avatar Rule B: a person), 56px, the
          protagonist on the shelter's side. Clickable → hand-off check. */}
      <button
        type="button"
        onClick={onOpenWalker}
        className="flex-shrink-0 rounded-full"
        aria-label={`Check ${booking.carerName}`}
      >
        <img src={booking.carerAvatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-xs">
        <button
          type="button"
          onClick={onOpenWalker}
          className="flex items-center gap-xs text-left"
        >
          <span className="truncate text-base font-semibold text-fg-primary hover:underline">
            {booking.carerName}
          </span>
          {tier && <WalkerTierPill tier={tier} />}
        </button>
        {/* Secondary: the dog (small thumb + name) + the time / live status.
            Dog avatar uses a % radius so the rounding looks the same at every
            size (Avatar Rule B — dogs are rounded squares). */}
        <span className="flex items-center gap-xs truncate text-xs text-fg-secondary">
          {dog?.imageUrl && (
            <img src={dog.imageUrl} alt="" className="h-5 w-5 flex-shrink-0 rounded-dog object-cover" />
          )}
          <span className="truncate">
            {booking.pets[0]}
            {detail ? ` ${detail}` : ""}
          </span>
        </span>
      </div>

      {/* Action — wraps to its own full-width row on mobile so it never crowds
          the content; inline on desktop. "Back" shows the confirmed marker. */}
      <div className="flex w-full flex-col gap-tiny sm:w-auto sm:items-end">
        {onCheckOut && (
          <ButtonAction
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={<DoorOpen size={14} weight="bold" />}
            onClick={onCheckOut}
          >
            Check out
          </ButtonAction>
        )}
        {onCheckIn && (
          <ButtonAction
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={<ShieldCheck size={14} weight="bold" />}
            onClick={onCheckIn}
          >
            Back safe
          </ButtonAction>
        )}
        {state === "back" && (
          <span className="flex items-center gap-tiny text-xs text-success">
            <CheckCircle size={12} weight="fill" /> Back safe {fmtTime(s?.returnedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Group walk batch card (FC18 multi-dog release proposal) ───────────── */

function GroupBatchCard({
  meetId,
  batch,
  dogByName,
  tierFor,
  onOpenWalker,
  onCheckOut,
  onCheckOutBatch,
  onCheckIn,
}: {
  meetId: string;
  batch: Booking[];
  dogByName: (name: string) => PetProfile | undefined;
  tierFor: (userId: string) => WalkerTier | undefined;
  onOpenWalker?: (b: Booking) => void;
  onCheckOut: (b: Booking) => void;
  onCheckOutBatch: () => void;
  onCheckIn: (b: Booking) => void;
}) {
  const meet = getMeetById(meetId);
  const host = meet ? getUserById(meet.creatorId) : undefined;
  const hostName = host ? `${host.firstName} ${host.lastName}`.trim() : meet?.creatorName;

  const dueCount = batch.filter((b) => handoverState(b.sessions?.[0]) === "due").length;

  // Brand circle marks this as a community meet (Avatar Rule B — a meet is a
  // circle); sized to match the dog avatars in the rows below.
  const avatar = (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brand-light bg-brand-subtle text-brand-strong">
      <Users size={24} weight="light" />
    </div>
  );

  return (
    <div className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-top p-md">
      {/* Header. The avatar + title both link to the meet (one big target, like
          the walker rows) so it reads as clickable; the batch action sits on
          the right (matching the per-row action placement), wrapping to its own
          full-width row on mobile. */}
      <div className="flex flex-wrap items-center gap-md">
        {meet ? (
          <Link href={`/meets/${meet.id}`} className="flex-shrink-0">
            {avatar}
          </Link>
        ) : (
          avatar
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-tiny">
          {meet ? (
            <Link
              href={`/meets/${meet.id}`}
              className="truncate text-base font-semibold text-fg-primary hover:underline"
            >
              {meet.title}
            </Link>
          ) : (
            <span className="text-base font-semibold text-fg-primary">Group walk</span>
          )}
          <span className="text-xs text-fg-secondary">
            {batch.length} dogs{hostName ? ` · led by ${hostName}` : ""}
          </span>
        </div>
        {dueCount > 0 && (
          <div className="w-full sm:w-auto">
            <ButtonAction
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              leftIcon={<DoorOpen size={14} weight="bold" />}
              onClick={onCheckOutBatch}
            >
              Check out all · {dueCount} dogs
            </ButtonAction>
          </div>
        )}
      </div>

      {/* Dogs in the batch — the SAME row as the solo cards (bare variant), so
          every size matches. Each can be checked out individually (a no-show
          doesn't block the rest) on top of the batch action below. */}
      <div className="flex flex-col divide-y divide-edge-regular border-y border-edge-regular">
        {batch.map((b) => {
          const state = handoverState(b.sessions?.[0]);
          return (
            <HandoverRow
              key={b.id}
              bare
              booking={b}
              dog={dogByName(b.pets[0])}
              tier={tierFor(b.carerId)}
              onOpenWalker={() => onOpenWalker?.(b)}
              onCheckOut={state === "due" ? () => onCheckOut(b) : undefined}
              onCheckIn={state === "out" ? () => onCheckIn(b) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
