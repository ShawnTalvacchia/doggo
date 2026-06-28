"use client";

/**
 * ShelterApplicationsPanel — the operator's walker-application queue (Phase 2
 * "The Shelter's Side"). Reframed from a flat list into a decision queue:
 *   - grouped by what needs action ("New — needs a reply" vs "Invited —
 *     awaiting their intro visit"),
 *   - compact triage rows surfacing the key vetting signals (availability,
 *     matches-need, mentor-recommended) as scannable chips,
 *   - the full picture, the private note, and Decline live in an
 *     ApplicantDetailModal (opened by tapping the applicant), mirroring the
 *     hand-off modal pattern.
 *
 * Invite → vouch → decline drive the real WalkerApplicationsContext machine.
 * Advancing is undoable: a transient undo bar steps the application back one
 * state (revertState) — cheap insurance against a misclick, and it earns its
 * keep on Vouch, where the applicant otherwise leaves the queue silently.
 */

import { useState } from "react";
import { UserCircle, Clock, Sparkle, GraduationCap, Check } from "@phosphor-icons/react";
import type { ShelterProfile, WalkerApplication } from "@/lib/types";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { UndoBar } from "@/components/ui/UndoBar";
import {
  ApplicantDetailModal,
  applicantDisplay,
  appliedAgo,
} from "@/components/shelters/ApplicantDetailModal";

type UndoState = { userId: string; name: string; verb: string } | null;

export function ShelterApplicationsPanel({ shelter }: { shelter: ShelterProfile }) {
  const { applications, advance, revertState, withdraw } = useWalkerApplications();
  // Track the open applicant by id (not a snapshot) so the modal always
  // reflects live store changes — e.g. a note saved mid-view.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = applications.find((a) => a.id === selectedId) ?? null;
  const [undo, setUndo] = useState<UndoState>(null);

  // Advancing captures an undo target — verb reflects the state BEFORE the
  // step (applied → "invited", invited → "vouched as a walker").
  const handleAdvance = (a: WalkerApplication) => {
    const { name } = applicantDisplay(a);
    advance(a.userId, shelter.id);
    setUndo({
      userId: a.userId,
      name,
      verb: a.state === "applied" ? "invited" : "vouched as a walker",
    });
  };

  const forShelter = applications
    .filter((a) => a.shelterId === shelter.id && (a.state === "applied" || a.state === "invited"))
    .sort((a, b) => a.appliedAt.localeCompare(b.appliedAt)); // oldest first — fairness
  const newApps = forShelter.filter((a) => a.state === "applied");
  const invitedApps = forShelter.filter((a) => a.state === "invited");

  return (
    <div className="flex flex-col gap-lg p-md">
      {/* Undo lives above the queue so it survives an emptied list — vouching
          the last applicant still leaves an undo handle. */}
      {undo && (
        <UndoBar
          token={undo}
          message={
            <>
              <span className="font-semibold text-fg-primary">{undo.name}</span> {undo.verb}.
            </>
          }
          onUndo={() => {
            revertState(undo.userId, shelter.id);
            setUndo(null);
          }}
          onDismiss={() => setUndo(null)}
        />
      )}

      {forShelter.length === 0 && (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<UserCircle size={32} weight="light" />}
            title="No applications waiting"
            subtitle="When someone applies to walk your dogs, they land here for you to invite and vouch."
          />
        </div>
      )}

      {newApps.length > 0 && (
        <Section title="New — needs a reply">
          {newApps.map((a) => (
            <ApplicantRow
              key={a.id}
              application={a}
              onOpen={() => setSelectedId(a.id)}
              onAdvance={() => handleAdvance(a)}
            />
          ))}
        </Section>
      )}

      {invitedApps.length > 0 && (
        <Section title="Invited — awaiting their intro visit">
          {invitedApps.map((a) => (
            <ApplicantRow
              key={a.id}
              application={a}
              onOpen={() => setSelectedId(a.id)}
              onAdvance={() => handleAdvance(a)}
            />
          ))}
        </Section>
      )}

      <ApplicantDetailModal
        application={selected}
        onAdvance={() => selected && handleAdvance(selected)}
        onDecline={() => selected && withdraw(selected.userId, shelter.id)}
        onClose={() => setSelectedId(null)}
      />
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

/* ── Compact triage row ───────────────────────────────────────────────── */

function ApplicantRow({
  application: a,
  onOpen,
  onAdvance,
}: {
  application: WalkerApplication;
  onOpen: () => void;
  onAdvance: () => void;
}) {
  const { name, avatarUrl } = applicantDisplay(a);
  const isInvited = a.state === "invited";

  return (
    <div className="flex flex-wrap items-center gap-md rounded-panel border border-edge-regular bg-surface-top p-md">
      <button type="button" onClick={onOpen} className="flex-shrink-0 cursor-pointer rounded-full" aria-label={name}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <UserCircle size={44} weight="light" className="text-fg-tertiary" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-tiny">
        <button
          type="button"
          onClick={onOpen}
          className="flex cursor-pointer items-center gap-xs text-left"
        >
          <span className="truncate text-sm font-semibold text-fg-primary hover:underline">{name}</span>
        </button>
        <span className="flex items-center gap-xs text-xs text-fg-tertiary">
          Applied {appliedAgo(a.appliedAt)}
          {a.availability && (
            <>
              <span aria-hidden>·</span>
              <Clock size={12} weight="light" />
              {a.availability}
            </>
          )}
        </span>
        {(a.matchesNeed || a.mentorship) && (
          <div className="flex flex-wrap items-center gap-xs">
            {a.matchesNeed && (
              <span className="flex items-center gap-tiny rounded-pill bg-brand-subtle px-sm py-tiny text-xs font-medium text-brand-strong">
                <Sparkle size={11} weight="fill" /> {a.matchesNeed}
              </span>
            )}
            {a.mentorship && (
              <span className="flex items-center gap-tiny rounded-pill bg-volunteer-light px-sm py-tiny text-xs font-medium text-volunteer-strong">
                <GraduationCap size={11} weight="light" /> Mentor-recommended
              </span>
            )}
          </div>
        )}
      </div>

      {/* One obvious action; the rest (Decline, notes) live in the detail. */}
      <div className="w-full sm:w-auto">
        <ButtonAction
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto"
          leftIcon={<Check size={14} weight="bold" />}
          onClick={onAdvance}
        >
          {isInvited ? "Vouch as walker" : "Invite to visit"}
        </ButtonAction>
      </div>
    </div>
  );
}
