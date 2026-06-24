"use client";

/**
 * ShelterApplicationsPanel — the operator's walker-application queue (Phase 2
 * "The Shelter's Side", 2026-06-24). Brings the existing applied→invited→
 * vouched state machine (WalkerApplicationsContext) to illustrative parity as
 * a real queue the operator works: each pending applicant with their note, an
 * Invite/Vouch advance, and a decline. Mentor-recommended applicants carry a
 * credibility line (the mentor did supervised sessions).
 *
 * This is the same `advance` / `withdraw` machine the walker side drives — the
 * operator view just gives it a coordinator-facing surface instead of the
 * hidden demo dropdown.
 */

import { UserCircle, Check, X, GraduationCap } from "@phosphor-icons/react";
import type { ShelterProfile, WalkerApplication } from "@/lib/types";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { getUserById } from "@/lib/mockUsers";
import { EmptyState } from "@/components/ui/EmptyState";

function applicantDisplay(a: WalkerApplication): { name: string; avatarUrl?: string } {
  if (a.applicantName) return { name: a.applicantName, avatarUrl: a.applicantAvatarUrl };
  const u = getUserById(a.userId);
  return {
    name: u ? `${u.firstName} ${u.lastName}`.trim() : a.userId,
    avatarUrl: u?.avatarUrl,
  };
}

function daysSince(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
  } catch {
    return "";
  }
}

export function ShelterApplicationsPanel({ shelter }: { shelter: ShelterProfile }) {
  const { applications, advance, withdraw } = useWalkerApplications();

  // Pending queue = applied + invited at this shelter. Vouched walkers live
  // on the Walkers tab; this surface is "who's waiting on us."
  const pending = applications
    .filter((a) => a.shelterId === shelter.id && (a.state === "applied" || a.state === "invited"))
    .sort((a, b) => a.appliedAt.localeCompare(b.appliedAt)); // oldest first — fairness

  if (pending.length === 0) {
    return (
      <div className="px-lg py-xl">
        <EmptyState
          icon={<UserCircle size={32} weight="light" />}
          title="No applications waiting"
          subtitle="When someone applies to walk your dogs, they land here for you to invite and vouch."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md p-md">
      <p className="m-0 text-xs text-fg-tertiary">
        {pending.length} {pending.length === 1 ? "person is" : "people are"} waiting. Invite them for
        a quick intro visit, then vouch once you&rsquo;re comfortable.
      </p>
      {pending.map((a) => {
        const { name, avatarUrl } = applicantDisplay(a);
        const mentor = a.mentorship;
        return (
          <div
            key={a.id}
            className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-base p-md"
          >
            <div className="flex items-center gap-sm">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
              ) : (
                <UserCircle size={40} weight="light" className="flex-shrink-0 text-fg-tertiary" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-fg-primary">{name}</span>
                <span className="text-xs text-fg-tertiary">
                  Applied {daysSince(a.appliedAt)}
                  {a.state === "invited" ? " · invited" : ""}
                </span>
              </div>
              {a.state === "invited" ? (
                <span className="flex-shrink-0 rounded-pill bg-volunteer-light px-sm py-tiny text-xs font-medium text-volunteer-strong">
                  Invited
                </span>
              ) : (
                <span className="flex-shrink-0 rounded-pill bg-surface-inset px-sm py-tiny text-xs font-medium text-fg-secondary">
                  New
                </span>
              )}
            </div>

            {a.message && (
              <p className="m-0 rounded-md bg-surface-inset px-sm py-xs text-xs text-fg-secondary">
                &ldquo;{a.message}&rdquo;
              </p>
            )}

            {mentor && (
              <p className="m-0 flex items-center gap-xs text-xs text-volunteer-strong">
                <GraduationCap size={14} weight="light" />
                Mentor-recommended · {mentor.sessionsCompleted}{" "}
                {mentor.sessionsCompleted === 1 ? "session" : "sessions"} with {mentor.mentorName}
              </p>
            )}

            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={() => advance(a.userId, shelter.id)}
                className="flex flex-1 items-center justify-center gap-xs rounded-pill bg-volunteer px-md py-xs text-xs font-semibold text-volunteer-soft"
              >
                <Check size={14} weight="bold" />
                {a.state === "applied" ? "Invite to visit" : "Vouch as walker"}
              </button>
              <button
                type="button"
                onClick={() => withdraw(a.userId, shelter.id)}
                className="flex items-center justify-center gap-xs rounded-pill border border-edge-regular px-md py-xs text-xs font-medium text-fg-secondary"
              >
                <X size={14} weight="bold" />
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
