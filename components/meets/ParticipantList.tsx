"use client";

import { useState } from "react";
import { PersonRow } from "@/components/people/PersonRow";
import { PrivateProfileRow } from "@/components/people/PrivateProfileRow";
import {
  SectionHeader,
  MetaDivider,
} from "@/components/people/PersonSections";
import { getAttendeeTier, viewerCanAct } from "@/lib/meetUtils";
import { getUserById } from "@/lib/mockUsers";
import { getCarerIdentity, type CarerIdentity } from "@/lib/identityBadges";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useConnections } from "@/contexts/ConnectionsContext";
import type { ConnectionState, Meet, MeetAttendee } from "@/lib/types";
import type { PersonAction } from "@/lib/personActions";

interface ParticipantListProps {
  meet: Meet;
  attendees: MeetAttendee[];
  /** Current user ID. If omitted, resolved from CurrentUserContext. */
  currentUserId?: string;
  /** Whether this meet is completed (affects display) */
  isCompleted?: boolean;
  /**
   * Optional series-level followers (people Interested in the recurring
   * series without being committed to any specific date). When non-empty,
   * a "Following this series" subsection renders between Interested and the
   * Locked chip list. Only meaningful for the People tab "All" lens on
   * recurring meets — pass `[]` or omit for one-off meets and per-date
   * lenses. See `lib/mockMeets.ts:getSeriesFollowers`.
   */
  followers?: MeetAttendee[];
  /**
   * Override the section heading. Defaults: "Who's going" / "Who attended"
   * (based on `isCompleted`). Override for lens-specific labels like
   * "Series community" on the All lens.
   */
  headingOverride?: string;
}

interface TieredAttendee extends MeetAttendee {
  tier: 1 | 2 | 3;
  connectionState: ConnectionState;
  theyMarkedFamiliar?: boolean;
  /** Carer identity badge — info-blue pill, two variants (open / circle).
   *  Resolved per-viewer; circle variant is Connected-only by privacy
   *  rule. Discover Refinement walkthrough decision, 2026-05-10. */
  carerBadge?: CarerIdentity;
}

/**
 * People-tab participant list — owner-forward + section-grouped per the
 * Community & Groups Deep Pass disclosure model:
 *
 *   Going section header
 *     ├─ Connected (top, unlabeled — viewer pinned to first slot)
 *     ├─ Familiar (subsection header)
 *     └─ Other tier-2 attendees (Pending / Open / inbound theyMarkedFamiliar
 *        — flat list, no header. Inbound theyMarkedFamiliar people land here
 *        silently per the deniability guardrail; a labeled section would
 *        leak that the subject marked the viewer Familiar.)
 *   Interested section (if any)
 *     └─ same structure, lighter
 *   Locked attendees (chip list at bottom — names + small avatar pills,
 *     no row affordance, matching the post-meet review's locked treatment)
 *
 * Tier classification is delegated to `getAttendeeTier` (`lib/meetUtils.ts`).
 *
 * Action gating: information is open to any viewer; action affordances
 * (Familiar / Connect / Message pills) render when the viewer has
 * meet-level engagement — creator, any RSVP (past or future, going or
 * interested), or series follower. Resolved this way during P32
 * (Cross-Cutting Flow Testing, 2026-05-11): meet RSVP is opt-in to "be
 * in this group of people," analogous to group co-membership, which
 * already grants action affordances on the Members tab. Random Discover
 * viewers with no commitment are still filtered out by `viewerCanAct`.
 * See `Trust & Connection Model.md` → Meet participant visibility rules.
 */
export function ParticipantList({
  meet,
  attendees,
  currentUserId,
  isCompleted = false,
  followers = [],
  headingOverride,
}: ParticipantListProps) {
  // Fall back to the active persona when caller doesn't pass an explicit ID.
  const hookUserId = useCurrentUserId();
  const viewerId = currentUserId ?? hookUserId;

  // Connection reads + mutations route through ConnectionsContext so a
  // Familiar / Connect mark made on a row reflects immediately — the static
  // `mockConnections` lookup can't see session overrides. `localMarks`
  // drives the per-row mark ladder (+ "✓ Familiar | Undo" footer) for marks
  // made on this visit. Mirrors the group Members tab pattern (Mock World
  // Building 2026-04-30); the People tab adopted it 2026-05-17 — before
  // that, tapping "+ Familiar" here was a silent no-op.
  const { getConnection, markFamiliar, unmarkFamiliar } = useConnections();
  const [localMarks, setLocalMarks] = useState<
    Record<string, "familiar" | "connect">
  >({});

  const handleAdvance = (memberId: string) => {
    setLocalMarks((prev) => {
      const current = prev[memberId];
      const next = current === "familiar" ? "connect" : "familiar";
      // First step (no current mark) → persist the Familiar grant via
      // context. The Connect step stays session-local for now.
      if (!current) markFamiliar(viewerId, memberId);
      return { ...prev, [memberId]: next };
    });
  };

  const handleDowngrade = (memberId: string) => {
    setLocalMarks((prev) => ({ ...prev, [memberId]: "familiar" }));
  };

  const handleUndoMark = (memberId: string) => {
    setLocalMarks((prev) => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });
    // Undo means undo — reverse the persisted mark too, not just the footer.
    unmarkFamiliar(viewerId, memberId);
  };

  // Single attendance gate: applies to every row in this list. Empty array
  // = info-only mode (PersonRow suppresses all action affordances).
  const rowActions: PersonAction[] | "auto" = viewerCanAct(meet, viewerId)
    ? "auto"
    : [];

  // Fall back to UserProfile.profileVisibility when an attendee record
  // doesn't carry `profileOpen`. Without this, attendees seeded without
  // `profileOpen: true` (most of mock data — see punch-list P28) appear
  // locked-to-the-viewer even when their actual profile is open. This
  // lets the matrix surface the Connect path correctly when the viewer
  // marks the subject Familiar.
  const resolveProfileOpen = (
    attendeeProfileOpen: boolean | undefined,
    userId: string,
  ): boolean => {
    if (attendeeProfileOpen !== undefined) return attendeeProfileOpen;
    return getUserById(userId)?.profileVisibility === "open";
  };

  /** Resolve the Carer identity badge for a row, with the privacy gate
   *  baked in: circle-Carers (publicProfile: false) only render their
   *  badge when the viewer is Connected to them OR is the subject. Open
   *  Carers render their badge to everyone. Discover Refinement
   *  walkthrough decision, 2026-05-10. */
  const resolveCarerBadge = (
    subjectUserId: string,
    connectionState: ConnectionState,
  ): CarerIdentity | undefined => {
    const subject = getUserById(subjectUserId);
    const isSelf = subjectUserId === viewerId;
    const viewerIsConnected = isSelf || connectionState === "connected";
    return getCarerIdentity(subject, viewerIsConnected);
  };

  const tier = (a: MeetAttendee): TieredAttendee => {
    if (a.userId === viewerId) {
      return {
        ...a,
        profileOpen: resolveProfileOpen(a.profileOpen, a.userId),
        tier: 1 as const,
        connectionState: "connected" as const,
        carerBadge: resolveCarerBadge(a.userId, "connected"),
      };
    }

    // Context-aware connection — overlays session Familiar/Connected marks
    // on the static lookup so a mark made on this tab reflects right away.
    const conn = getConnection(a.userId, viewerId);
    const baseState = conn?.state ?? "none";
    // A session mark made on this visit promotes "none" → "familiar" so the
    // matrix surfaces the Connect step (and the row moves to the Familiar
    // subsection). Mirrors the Members tab's localMark application.
    const localMark = localMarks[a.userId];
    const state: ConnectionState =
      localMark && baseState === "none" ? "familiar" : baseState;
    const theyMarkedFamiliar = conn?.theyMarkedFamiliar;
    const t = getAttendeeTier(a, viewerId);

    return {
      ...a,
      profileOpen: resolveProfileOpen(a.profileOpen, a.userId),
      tier: t,
      connectionState: state,
      theyMarkedFamiliar,
      carerBadge: resolveCarerBadge(a.userId, state),
    };
  };

  const tiered: TieredAttendee[] = attendees.map(tier);
  const tieredFollowers: TieredAttendee[] = followers.map(tier);

  const going = tiered.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interested = tiered.filter((a) => a.rsvpStatus === "interested");

  // Private (tier 3) attendees + followers — render as compact PrivateProfileRow
  // (smaller than tier-1/2 cards but still actionable when the viewer can act).
  // Dedup on userId so someone who both attended and follows doesn't double up.
  // Mock World Building 2026-04-30: replaced the chip-list-only treatment with
  // small actionable rows so Private subjects can be marked Familiar from
  // surfaces where the viewer has shared context (the meet itself IS context).
  const lockedSet = new Map<string, TieredAttendee>();
  for (const a of tiered) if (a.tier === 3) lockedSet.set(a.userId, a);
  for (const f of tieredFollowers) if (f.tier === 3) lockedSet.set(f.userId, f);
  const locked = Array.from(lockedSet.values());
  const canActOnRows = rowActions === "auto";

  // Followers subsection renders only tier 1/2 — locked followers fall to the
  // chip list above. Dedup against attendees so someone who both follows and
  // is RSVP'd doesn't appear in two places (attendee section wins).
  const attendeeIds = new Set(tiered.map((a) => a.userId));
  const followersVisible = tieredFollowers.filter(
    (f) => f.tier !== 3 && !attendeeIds.has(f.userId),
  );

  const goingHeading =
    headingOverride ?? (isCompleted ? "Who attended" : "Who’s going");

  // Meta-section ordering: Going block (Connected/Familiar/Other + Locked
  // chips) → MetaDivider → Interested → MetaDivider → Following this series.
  // The divider + larger gap signal that we're crossing from one meta-section
  // to another (different RSVP commitment levels), versus the smaller
  // SectionHeader/in-block boundaries within a section.
  const showInterested = interested.length > 0;
  const showFollowers = followersVisible.length > 0;

  return (
    <section className="flex flex-col gap-md">
      <PeopleSection
        title={goingHeading}
        attendees={going}
        viewerId={viewerId}
        rowActions={rowActions}
        marks={localMarks}
        onAdvance={handleAdvance}
        onDowngrade={handleDowngrade}
        onUndoMark={handleUndoMark}
      />

      {locked.length > 0 && (
        <div className="flex flex-col gap-sm">
          <SectionHeader label="Private profiles" />
          {locked.map((a) => (
            <PrivateProfileRow
              key={a.userId}
              userId={a.userId}
              name={a.userName}
              avatarUrl={a.avatarUrl}
              dogNames={a.dogNames}
              canAct={canActOnRows}
            />
          ))}
        </div>
      )}

      {showInterested && (
        <>
          <MetaDivider />
          <PeopleSection
            title="Interested"
            attendees={interested}
            viewerId={viewerId}
            rowActions={rowActions}
            marks={localMarks}
            onAdvance={handleAdvance}
            onDowngrade={handleDowngrade}
            onUndoMark={handleUndoMark}
            subdued
          />
        </>
      )}

      {showFollowers && (
        <>
          <MetaDivider />
          <PeopleSection
            title="Following this series"
            attendees={followersVisible}
            viewerId={viewerId}
            rowActions={rowActions}
            marks={localMarks}
            onAdvance={handleAdvance}
            onDowngrade={handleDowngrade}
            onUndoMark={handleUndoMark}
            subdued
          />
        </>
      )}
    </section>
  );
}

/* ── Section: Going / Interested ────────────────────────────────────────── */

function PeopleSection({
  title,
  attendees,
  viewerId,
  rowActions,
  subdued = false,
  marks,
  onAdvance,
  onDowngrade,
  onUndoMark,
}: {
  title: string;
  attendees: TieredAttendee[];
  viewerId: string;
  rowActions: PersonAction[] | "auto";
  subdued?: boolean;
  marks: Record<string, "familiar" | "connect">;
  onAdvance: (userId: string) => void;
  onDowngrade: (userId: string) => void;
  onUndoMark: (userId: string) => void;
}) {
  // Connected first (with viewer pinned to top of that subsection),
  // then Familiar (outbound only — labeled), then everything else flat
  // (Pending / Open / inbound theyMarkedFamiliar — unlabeled to preserve
  // deniability for inbound Familiar marks). Locked (tier 3) attendees
  // are NOT rendered as cards here — they're surfaced as a chip list at
  // the bottom of the parent (`LockedChipList`).
  const connected = attendees.filter((a) => a.connectionState === "connected");
  // FAMILIAR section is for outbound marks where the subject is also visible
  // to the viewer (tier !== 3). A locked subject the viewer marked Familiar
  // but who hasn't reciprocated stays in PRIVATE PROFILES (their content is
  // still locked) — the "Familiar ✓" pill in the compact row is the visual
  // confirmation that the mark took effect. Mock World Building 2026-04-30.
  const familiarOutbound = attendees.filter(
    (a) => a.connectionState === "familiar" && a.tier !== 3,
  );
  const other = attendees.filter(
    (a) =>
      a.tier !== 3 &&
      a.connectionState !== "connected" &&
      a.connectionState !== "familiar",
  );

  // Pin viewer to top of the connected subsection.
  connected.sort((a, b) => {
    if (a.userId === viewerId) return -1;
    if (b.userId === viewerId) return 1;
    return 0;
  });

  // Count = total attendance (including locked). Information is open per
  // the disclosure model — the headline reflects actual meet attendance,
  // not just the cards rendered above. Locked attendees are visible to the
  // viewer in the chip list below, just not as card-form rows.
  const total = attendees.length;

  // One row renderer for all three subsections — threads the session-mark
  // ladder (mark + advance/downgrade/undo) through to every PersonRow so
  // "+ Familiar" → "Connect" → "Connect ✓" works consistently.
  const renderRow = (a: TieredAttendee) => (
    <PersonRow
      key={a.userId}
      variant="meet-attendee"
      userId={a.userId}
      name={a.userName}
      avatarUrl={a.avatarUrl}
      isSelf={a.userId === viewerId}
      pets={(a.dogNames ?? []).map((name) => ({ name, breed: a.dogBreed }))}
      connectionState={a.connectionState}
      theyMarkedFamiliar={a.theyMarkedFamiliar}
      profileOpen={a.profileOpen}
      carerBadge={a.carerBadge}
      actions={rowActions}
      mark={marks[a.userId] ?? null}
      onAdvance={() => onAdvance(a.userId)}
      onDowngradeMark={() => onDowngrade(a.userId)}
      onUndoMark={() => onUndoMark(a.userId)}
    />
  );

  return (
    <div className="flex flex-col gap-sm">
      <h2
        className={`font-heading text-base font-semibold text-fg-${subdued ? "secondary" : "primary"}${
          subdued ? " mt-sm" : ""
        }`}
      >
        {title} ({total})
      </h2>

      {connected.length > 0 && <SectionHeader label="Connected" />}
      {connected.length > 0 && (
        <div className="flex flex-col gap-sm">{connected.map(renderRow)}</div>
      )}

      {familiarOutbound.length > 0 && <SectionHeader label="Familiar" />}
      {familiarOutbound.length > 0 && (
        <div className="flex flex-col gap-sm">
          {familiarOutbound.map(renderRow)}
        </div>
      )}

      {other.length > 0 && (
        // Header is neutral — "Other attendees" doesn't reveal *why* anyone
        // is in this group (open profile vs inbound theyMarkedFamiliar
        // both land here). Earlier this was unlabeled for "deniability",
        // but section labels are private to the viewer's render — the
        // receiver can't see Daniel's view, so labeling here leaks nothing.
        // Keeping it neutral preserves that property regardless. Mock
        // World Building 2026-04-30.
        <div className="flex flex-col gap-sm">
          <SectionHeader label="Other attendees" />
          {other.map(renderRow)}
        </div>
      )}
    </div>
  );
}

/* Section primitives (SectionHeader, MetaDivider, LockedChipList) live in
   `components/people/PersonSections.tsx` — shared with MembersTab so the
   pattern stays consistent across person-row surfaces. */
