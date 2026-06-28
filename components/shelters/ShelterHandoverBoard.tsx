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
  ArrowCounterClockwise,
  NotePencil,
} from "@phosphor-icons/react";
import type { Booking, BookingSession, PetProfile, ShelterProfile, WalkerTier } from "@/lib/types";
import { useBookings } from "@/contexts/BookingsContext";
import { getMeetById } from "@/lib/mockMeets";
import { getUserById } from "@/lib/mockUsers";
import { daysFromNow } from "@/lib/mockDate";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useStubNotice } from "@/contexts/StubFeatureContext";
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

  // Check-out / back-safe and their inverses. Undo is a per-row affordance
  // (not a top alert) so any earlier action stays reversible during a busy
  // run — checking out several dogs then fixing one from three rows back.
  const checkOut = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { releasedAt: nowIso() });
  };
  const undoCheckOut = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { releasedAt: undefined });
  };
  const checkIn = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { returnedAt: nowIso(), status: "completed" });
  };
  const undoCheckIn = (b: Booking) => {
    const s = b.sessions?.[0];
    if (!s) return;
    updateSession(b.id, s.id, { returnedAt: undefined, status: "in_progress" });
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
          onUndoCheckOut={undoCheckOut}
          onUndoCheckIn={undoCheckIn}
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
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} tier={tierFor(b.carerId)} onOpenWalker={() => onOpenWalker?.(b)} onCheckIn={() => checkIn(b)} onUndoCheckOut={() => undoCheckOut(b)} />
          ))}
        </Section>
      )}

      {backSolo.length > 0 && (
        <Section title="Back safe today">
          {backSolo.map((b) => (
            <HandoverRow key={b.id} booking={b} dog={dogByName(b.pets[0])} tier={tierFor(b.carerId)} onOpenWalker={() => onOpenWalker?.(b)} onUndoCheckIn={() => undoCheckIn(b)} />
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

/** A flat footer action — slim, fills its share of the footer, divided from
 *  its neighbour (mirrors the schedule review card's Skip / Review footer).
 *  `primary` = the main action (stronger neutral). Neutral throughout — undo is
 *  a utility action, not the volunteer violet. */
function FooterAction({
  onClick,
  icon,
  children,
  primary,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const base = "flex flex-1 items-center justify-center gap-xs px-md py-sm text-xs font-semibold";
  return (
    <button
      type="button"
      onClick={onClick}
      // Darken on hover (the canonical interaction overlay, matching the
      // schedule review card) — a translucent tint never blends with the card
      // the way lightening to white did, so the action keeps its shape.
      className={`${base} cursor-pointer transition-colors hover:bg-[var(--interaction-hover-darken)] ${primary ? "text-fg-primary" : "text-fg-tertiary"}`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ── Solo handover row ────────────────────────────────────────────────── */

function HandoverRow({
  booking,
  dog,
  tier,
  nested,
  onOpenWalker,
  onCheckOut,
  onCheckIn,
  onUndoCheckOut,
  onUndoCheckIn,
}: {
  booking: Booking;
  dog?: PetProfile;
  tier?: WalkerTier;
  /** Inside the group card: render as a full-width ROW (no own card chrome) so
   *  there's no card-in-card. The group card supplies the outer border; rows
   *  are delineated by dividers + their grey footer bands. */
  nested?: boolean;
  /** Open the walker hand-off check (clicking the walker). */
  onOpenWalker?: () => void;
  onCheckOut?: () => void;
  onCheckIn?: () => void;
  /** Per-row undo: reverse a check-out (out → due) or back-safe (back → out).
   *  Inline so any row stays reversible, not just the most recent action. */
  onUndoCheckOut?: () => void;
  onUndoCheckIn?: () => void;
}) {
  const { notify: notifyStub } = useStubNotice();
  const s = booking.sessions?.[0];
  const state = handoverState(s);
  const finishedAt = s?.report?.completedAt;
  const slot = formatSlotTime(s?.startTime);

  // Dog sub-label: the status/time for this walk — scheduled time (due), live
  // status (out), or the back-safe confirmation (back). A label, not an action;
  // the footer stays purely actions.
  let dogLabelNode: React.ReactNode = null;
  if (state === "due" && slot) {
    dogLabelNode = <span className="truncate text-xs text-fg-tertiary">{slot}</span>;
  } else if (state === "out") {
    dogLabelNode = (
      <span className="truncate text-xs text-fg-tertiary">
        {finishedAt ? `Walk done ${fmtTime(finishedAt)}` : `Out since ${fmtTime(s?.releasedAt)}`}
      </span>
    );
  } else if (state === "back") {
    dogLabelNode = (
      <span className="flex items-center gap-tiny truncate text-xs font-medium text-success">
        <CheckCircle size={12} weight="fill" className="flex-shrink-0" /> Back safe {fmtTime(s?.returnedAt)}
      </span>
    );
  }

  // A hand-off is a PAIRING — two side-by-side mini-profiles: the WALKER (left,
  // clickable → the hand-off check, the person to identify/clear) and the DOG
  // (which dog is going out, now legible instead of a tiny thumb). Avatar Rule
  // B: walker = circle, dog = rounded square.
  const walkerBlock = (
    <div className="flex min-w-0 items-center gap-sm sm:flex-1">
      <button
        type="button"
        onClick={onOpenWalker}
        className="flex-shrink-0 cursor-pointer rounded-full"
        aria-label={`Check ${booking.carerName}`}
      >
        <img src={booking.carerAvatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
      </button>
      <div className="flex min-w-0 flex-col gap-tiny">
        <button type="button" onClick={onOpenWalker} className="cursor-pointer text-left">
          <span className="truncate text-sm font-semibold text-fg-primary hover:underline">
            {booking.carerName}
          </span>
        </button>
        {tier && <WalkerTierPill tier={tier} />}
      </div>
    </div>
  );

  const dogBlock = (
    <div className="flex min-w-0 items-center gap-sm sm:flex-1">
      {dog?.imageUrl ? (
        <Link href={`/dogs/${dog.id}`} className="flex-shrink-0">
          <img src={dog.imageUrl} alt="" className="h-14 w-14 rounded-dog object-cover" />
        </Link>
      ) : (
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-dog bg-surface-inset">
          <PawPrint size={20} weight="light" className="text-fg-tertiary" />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-tiny">
        <span className="truncate text-sm font-semibold text-fg-primary">{booking.pets[0]}</span>
        {dogLabelNode}
      </div>
    </div>
  );

  // Flat footer actions — slim, divided, mirroring the
  // schedule review card's Skip / Review footer (no chunky button-in-a-bar).
  const footerActions: React.ReactNode[] = [];
  if (state === "due" && onCheckOut) {
    footerActions.push(
      <FooterAction key="co" primary icon={<DoorOpen size={13} weight="bold" />} onClick={onCheckOut}>
        Check out
      </FooterAction>,
    );
  } else if (state === "out") {
    if (onUndoCheckOut) {
      footerActions.push(
        <FooterAction key="undo" icon={<ArrowCounterClockwise size={13} weight="bold" />} onClick={onUndoCheckOut}>
          Undo check-out
        </FooterAction>,
      );
    }
    if (onCheckIn) {
      footerActions.push(
        <FooterAction key="bs" primary icon={<ShieldCheck size={13} weight="bold" />} onClick={onCheckIn}>
          Back safe
        </FooterAction>,
      );
    }
  } else if (state === "back") {
    // Undo stays on the LEFT (quiet recovery); the post-walk action is on the
    // right. "Add note" is an illustrative stub for now (note how the dog did /
    // flag anything) — gives the completed row a forward action, not just undo.
    if (onUndoCheckIn) {
      footerActions.push(
        <FooterAction key="undo" icon={<ArrowCounterClockwise size={13} weight="bold" />} onClick={onUndoCheckIn}>
          Undo
        </FooterAction>,
      );
    }
    footerActions.push(
      <FooterAction
        key="note"
        primary
        icon={<NotePencil size={13} weight="bold" />}
        onClick={() =>
          notifyStub({
            feature: "Walk note",
            note: "Notes on a finished walk (how the dog did, anything to flag) land with the operator build.",
          })
        }
      >
        Add note
      </FooterAction>,
    );
  }

  // Content body (walker + dog blocks) + a slim, flat footer action row.
  // Solo → own card chrome; nested (group) → a bare full-width row (the group
  // card is the container). Same content + footer either way — parity.
  return (
    <div
      className={
        nested ? "" : "overflow-hidden rounded-panel border border-edge-regular bg-surface-top"
      }
    >
      <div className="flex items-center gap-lg p-md">
        {walkerBlock}
        {dogBlock}
      </div>
      {footerActions.length > 0 && (
        <div
          className={`flex items-stretch divide-x divide-edge-stronger bg-surface-base${
            // Solo card: a top border divides content from its action. Nested
            // (group) rows drop it so the action fuses to the dog above it —
            // then the only lines are BETWEEN dogs, making ownership clear.
            nested ? "" : " border-t border-edge-regular"
          }`}
        >
          {footerActions}
        </div>
      )}
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
  onUndoCheckOut,
  onUndoCheckIn,
}: {
  meetId: string;
  batch: Booking[];
  dogByName: (name: string) => PetProfile | undefined;
  tierFor: (userId: string) => WalkerTier | undefined;
  onOpenWalker?: (b: Booking) => void;
  onCheckOut: (b: Booking) => void;
  onCheckOutBatch: () => void;
  onCheckIn: (b: Booking) => void;
  onUndoCheckOut: (b: Booking) => void;
  onUndoCheckIn: (b: Booking) => void;
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
    <div className="overflow-hidden rounded-panel border border-edge-regular bg-surface-top">
      {/* Header. The avatar + title both link to the meet (one big target, like
          the walker rows) so it reads as clickable; the batch action sits on
          the right (matching the per-row action placement), wrapping to its own
          full-width row on mobile. */}
      <div className="flex flex-wrap items-center gap-md p-md">
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
              Check out all
            </ButtonAction>
          </div>
        )}
      </div>

      {/* Dogs in the batch — full-width ROWS (not nested cards), divided by
          lines, each with the same content + grey footer as a solo card. No
          card-in-card, so the white group card reads cleanly against the grey
          page and the footer bands separate the dogs. Per-dog actions sit on
          top of the header's batch "Check out all". */}
      <div className="divide-y divide-edge-regular border-t border-edge-regular">
        {batch.map((b) => {
          const state = handoverState(b.sessions?.[0]);
          return (
            <HandoverRow
              key={b.id}
              nested
              booking={b}
              dog={dogByName(b.pets[0])}
              tier={tierFor(b.carerId)}
              onOpenWalker={() => onOpenWalker?.(b)}
              onCheckOut={state === "due" ? () => onCheckOut(b) : undefined}
              onCheckIn={state === "out" ? () => onCheckIn(b) : undefined}
              onUndoCheckOut={state === "out" ? () => onUndoCheckOut(b) : undefined}
              onUndoCheckIn={state === "back" ? () => onUndoCheckIn(b) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
