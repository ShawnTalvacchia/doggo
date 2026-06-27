"use client";

/**
 * WalkerHandoverModal — the "is this person cleared to take this dog?" check the
 * shelter operator wants at hand-off (Phase 2 "The Shelter's Side"). Opened by
 * clicking the walker on a handover/schedule row. FIRST CUT — surfaces the
 * shelter-relevant facts we can support illustratively; the exact contents are
 * still being refined with the PO.
 *
 * Identity + standing: avatar, name, tier, vouched-since, walks here, last
 * walked. Clearance: identity + waivers (derived from vouch date for seeded
 * roster walkers — clearly representative until the real e-sign surface, FC16)
 * + eligibility for the specific dog (tier vs the dog's policy). Optional link
 * to the full profile when the walker bridges to a UserProfile.
 */

import Link from "next/link";
import { CheckCircle, Warning, ArrowRight } from "@phosphor-icons/react";
import type { Booking, ShelterProfile } from "@/lib/types";
import { getUserById } from "@/lib/mockUsers";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { WalkerTierPill } from "./WalkerTierPill";

/** "09:30" → "9:30 AM". Empty string for missing/invalid input. */
export function formatSlotTime(hhmm?: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return "";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m ?? 0).padStart(2, "0")} ${ampm}`;
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function fmtMonthYear(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function ClearanceRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-sm text-sm text-fg-secondary">
      {ok ? (
        <CheckCircle size={18} weight="fill" className="flex-shrink-0 text-success" />
      ) : (
        <Warning size={18} weight="fill" className="flex-shrink-0 text-warning" />
      )}
      <span>{label}</span>
    </li>
  );
}

export function WalkerHandoverModal({
  booking,
  shelter,
  onClose,
}: {
  booking: Booking | null;
  shelter: ShelterProfile;
  onClose: () => void;
}) {
  if (!booking) return null;

  const walker = shelter.walkers.find((w) => w.userId === booking.carerId);
  const user = getUserById(booking.carerId);
  const tier = walker?.tier;
  const name = booking.carerName;
  const avatarUrl = walker?.avatarUrl ?? booking.carerAvatarUrl;
  const vouchedAt = walker?.vouchedAt;
  const dog = shelter.dogs.find((d) => d.name === booking.pets[0]);
  const slot = formatSlotTime(booking.sessions?.[0]?.startTime);

  // Eligibility for THIS dog — tier vs the dog's policy (strictest wins).
  const needsExperienced = !!dog?.experiencedHandlersOnly;
  const eligible = !(needsExperienced && tier === "vetted");

  return (
    <ModalSheet open onClose={onClose} title="Walker check">
      <div className="flex flex-col gap-lg p-md">
        {/* Identity + standing. */}
        <div className="flex items-center gap-md">
          <img src={avatarUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-full object-cover" />
          <div className="flex min-w-0 flex-col gap-tiny">
            <span className="text-lg font-semibold text-fg-primary">{name}</span>
            <div className="flex flex-wrap items-center gap-xs">
              {tier && <WalkerTierPill tier={tier} />}
              {vouchedAt && (
                <span className="text-xs text-fg-tertiary">Vouched since {fmtMonthYear(vouchedAt)}</span>
              )}
            </div>
          </div>
        </div>

        {/* What they're here for today. */}
        {dog && (
          <div className="flex items-center gap-sm rounded-panel bg-surface-inset px-md py-sm">
            <img src={dog.imageUrl} alt="" className="h-9 w-9 flex-shrink-0 rounded-[22%] object-cover" />
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold text-fg-primary">Walking {dog.name}</span>
              {slot && <span className="text-xs text-fg-tertiary">Booked for {slot}</span>}
            </div>
          </div>
        )}

        {/* Clearance — the hand-off question. */}
        <div className="flex flex-col gap-sm">
          <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-fg-tertiary">Clearance</h3>
          <ul className="m-0 flex list-none flex-col gap-xs p-0">
            <ClearanceRow ok label="Identity verified" />
            <ClearanceRow ok label={`Platform waiver signed${vouchedAt ? ` · ${fmtDate(vouchedAt)}` : ""}`} />
            <ClearanceRow ok label={`${shelter.name} waiver signed${vouchedAt ? ` · ${fmtDate(vouchedAt)}` : ""}`} />
            <ClearanceRow
              ok={eligible}
              label={
                eligible
                  ? `Cleared to walk ${dog?.name ?? "this dog"}`
                  : `${dog?.name ?? "This dog"} needs an experienced handler`
              }
            />
          </ul>
        </div>

        {/* Record. */}
        {walker && (
          <div className="flex flex-col gap-tiny">
            <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-fg-tertiary">Record</h3>
            <span className="text-sm text-fg-secondary">
              {walker.walkCount} {walker.walkCount === 1 ? "walk" : "walks"} here
              {walker.lastWalkedAt ? ` · last walked ${fmtDate(walker.lastWalkedAt)}` : ""}
            </span>
          </div>
        )}

        {user && (
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center gap-xs text-sm font-medium text-volunteer-strong"
          >
            View full profile <ArrowRight size={14} weight="bold" />
          </Link>
        )}
      </div>
    </ModalSheet>
  );
}
