"use client";

/**
 * ApplicantDetailModal — the "who is this person?" view a coordinator wants
 * before admitting a stranger (Phase 2 "The Shelter's Side"). Mirrors the
 * WalkerHandoverModal pattern (ModalSheet + identity header + sections), one
 * step earlier in the journey: vetting an applicant rather than clearing a
 * vouched walker. The list row stays a scannable triage; this is the full
 * picture + the actions.
 *
 * Wired vs illustrative:
 *  - Invite / Vouch / Decline drive the real WalkerApplicationsContext machine.
 *  - The private coordinator note is real-ish: it persists locally (same store
 *    as the rest), demonstrating the capability; fuller team-shared notes come
 *    with the operator build (FC16).
 *  - Structured signals (availability / experience / proximity / matches-need)
 *    are seeded — a richer intake form would capture them (interview fodder).
 *  - Messaging is intentionally NOT a button here: per "chat lives on profiles,"
 *    the avatar + name link to the applicant's profile, where the Chat tab is.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  GraduationCap,
  CheckCircle,
  Sparkle,
  Check,
  X,
  NotePencil,
} from "@phosphor-icons/react";
import type { WalkerApplication } from "@/lib/types";
import { getUserById } from "@/lib/mockUsers";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

/* ── Shared helpers (also used by the list) ───────────────────────────── */

export function applicantDisplay(a: WalkerApplication): { name: string; avatarUrl?: string } {
  if (a.applicantName) return { name: a.applicantName, avatarUrl: a.applicantAvatarUrl };
  const u = getUserById(a.userId);
  return {
    name: u ? `${u.firstName} ${u.lastName}`.trim() : a.userId,
    avatarUrl: u?.avatarUrl,
  };
}

export function appliedAgo(iso: string): string {
  try {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
  } catch {
    return "";
  }
}

/* ── Signal row ───────────────────────────────────────────────────────── */

function Signal({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-sm text-sm text-fg-secondary">
      <span className="flex-shrink-0 text-fg-tertiary">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

export function ApplicantDetailModal({
  application,
  onAdvance,
  onDecline,
  onClose,
}: {
  application: WalkerApplication | null;
  onAdvance: () => void;
  onDecline: () => void;
  onClose: () => void;
}) {
  const { setNote } = useWalkerApplications();
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState("");

  // Reset the note editor when the modal swaps to a different applicant.
  useEffect(() => {
    setEditingNote(false);
    setDraftNote(application?.coordinatorNote ?? "");
  }, [application?.id, application?.coordinatorNote]);

  if (!application) return null;

  const a = application;
  const { name, avatarUrl } = applicantDisplay(a);
  const user = getUserById(a.userId);
  const profileHref = user ? `/profile/${user.id}` : null;
  const isInvited = a.state === "invited";
  const mentor = a.mentorship;

  const avatarImg = avatarUrl ? (
    <img src={avatarUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-full object-cover" />
  ) : (
    <div className="h-16 w-16 flex-shrink-0 rounded-full bg-surface-inset" />
  );

  const saveNote = () => {
    setNote(a.userId, a.shelterId, draftNote);
    setEditingNote(false);
  };

  return (
    <ModalSheet open onClose={onClose} title="Applicant">
      <div className="flex flex-col gap-lg p-md">
        {/* Identity. Avatar + name link to the profile — also the way to
            message them (chat lives on profiles). */}
        <div className="flex items-center gap-md">
          {profileHref ? (
            <Link href={profileHref} className="flex-shrink-0">
              {avatarImg}
            </Link>
          ) : (
            avatarImg
          )}
          <div className="flex min-w-0 flex-col gap-tiny">
            {profileHref ? (
              <Link
                href={profileHref}
                className="text-lg font-semibold text-fg-primary hover:underline"
              >
                {name}
              </Link>
            ) : (
              <span className="text-lg font-semibold text-fg-primary">{name}</span>
            )}
            <span className="text-xs text-fg-tertiary">
              Applied {appliedAgo(a.appliedAt)}
              {isInvited ? " · invited for an intro visit" : ""}
            </span>
          </div>
        </div>

        {/* The "act on this" signal — fills a gap the shelter has. */}
        {a.matchesNeed && (
          <div className="flex items-center gap-sm rounded-panel border border-brand-light bg-brand-subtle px-md py-sm text-sm text-brand-strong">
            <Sparkle size={16} weight="fill" className="flex-shrink-0" />
            {a.matchesNeed}
          </div>
        )}

        {/* Vetting signals. */}
        <div className="flex flex-col gap-sm">
          <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-fg-tertiary">
            At a glance
          </h3>
          <ul className="m-0 flex list-none flex-col gap-xs p-0">
            {a.availability && <Signal icon={<Clock size={18} weight="light" />}>{a.availability}</Signal>}
            {a.experience && (
              <Signal icon={<CheckCircle size={18} weight="light" />}>{a.experience}</Signal>
            )}
            {a.nearby && <Signal icon={<MapPin size={18} weight="light" />}>Lives nearby</Signal>}
            {mentor && (
              <Signal icon={<GraduationCap size={18} weight="light" />}>
                Mentor-recommended · {mentor.sessionsCompleted}{" "}
                {mentor.sessionsCompleted === 1 ? "session" : "sessions"} with {mentor.mentorName}
              </Signal>
            )}
          </ul>
        </div>

        {/* Their own words — the authentic voice the apply form captures. */}
        {a.message && (
          <div className="flex flex-col gap-sm">
            <h3 className="m-0 text-xs font-semibold uppercase tracking-wide text-fg-tertiary">
              In their words
            </h3>
            <p className="m-0 rounded-sm border border-edge-regular bg-surface-base px-md py-sm text-sm text-fg-secondary">
              &ldquo;{a.message}&rdquo;
            </p>
          </div>
        )}

        {/* Private coordinator note — persists locally; never shown to the
            applicant. */}
        <div className="flex flex-col gap-sm">
          <h3 className="m-0 flex items-center gap-xs text-xs font-semibold uppercase tracking-wide text-fg-tertiary">
            <NotePencil size={13} weight="light" /> Your note
            <span className="font-normal normal-case tracking-normal text-fg-tertiary">· private</span>
          </h3>
          {editingNote ? (
            <div className="flex flex-col gap-sm">
              <textarea
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                rows={3}
                autoFocus
                placeholder="e.g. Called, sounds great with reactive dogs. Booked the intro for Saturday."
                className="w-full resize-none rounded-md border border-edge-regular bg-surface-base px-md py-sm text-sm text-fg-primary placeholder:text-fg-tertiary focus:border-edge-strong focus:outline-none"
              />
              <div className="flex items-center gap-sm">
                <ButtonAction variant="secondary" size="sm" onClick={saveNote}>
                  Save note
                </ButtonAction>
                <button
                  type="button"
                  onClick={() => {
                    setDraftNote(a.coordinatorNote ?? "");
                    setEditingNote(false);
                  }}
                  className="cursor-pointer text-xs font-medium text-fg-tertiary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : a.coordinatorNote ? (
            <button
              type="button"
              onClick={() => setEditingNote(true)}
              className="group flex w-full items-start gap-sm rounded-md bg-surface-inset px-md py-sm text-left"
            >
              <span className="flex-1 text-sm text-fg-secondary">{a.coordinatorNote}</span>
              <span className="flex-shrink-0 text-xs font-medium text-fg-tertiary group-hover:underline">
                Edit
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditingNote(true)}
              className="flex items-center gap-xs self-start text-xs font-medium text-fg-tertiary hover:underline"
            >
              <NotePencil size={14} weight="light" /> Add a note
            </button>
          )}
        </div>

        {/* Actions. Invite/Vouch + Decline are real. */}
        <div className="flex items-center gap-sm">
          <div className="flex-1">
            <ButtonAction
              variant="secondary"
              size="sm"
              className="w-full"
              leftIcon={<Check size={14} weight="bold" />}
              onClick={() => {
                onAdvance();
                onClose();
              }}
            >
              {isInvited ? "Vouch as walker" : "Invite to visit"}
            </ButtonAction>
          </div>
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<X size={14} weight="bold" />}
            onClick={() => {
              onDecline();
              onClose();
            }}
          >
            Decline
          </ButtonAction>
        </div>
      </div>
    </ModalSheet>
  );
}
