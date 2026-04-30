"use client";

import { PersonRow } from "@/components/people/PersonRow";
import {
  SectionHeader,
  MetaDivider,
  LockedChipList,
} from "@/components/people/PersonSections";
import { getConnectionState } from "@/lib/mockConnections";
import { getAttendeeTier, viewerCanAct } from "@/lib/meetUtils";
import { getUserById } from "@/lib/mockUsers";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
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
  /**
   * Care tier for the badge. `"provider"` shows to all viewers (services are
   * public). `"helper"` only shows when viewer is Connected to subject (or
   * is the subject) — services are private to Connected users, so the badge
   * follows the same rule. `undefined` = no badge. See
   * `docs/implementation/badges.md`.
   */
  careTier?: "helper" | "provider";
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
 * (Familiar / Connect / Message pills) only render when the viewer attended
 * a past occurrence of this meet (`viewerCanAct`). The "earned reward" for
 * showing up is the deepening, not the visibility. See
 * `Trust & Connection Model.md` → Meet participant visibility rules.
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

  // Single attendance gate: applies to every row in this list. Empty array
  // = info-only mode (PersonRow suppresses all action affordances).
  const rowActions: PersonAction[] | "auto" = viewerCanAct(meet, viewerId)
    ? "auto"
    : [];

  /**
   * Resolve the care tier badge per the visibility rules in
   * `docs/implementation/badges.md`:
   * - No `carerProfile` → no badge.
   * - `publicProfile === true` → "provider" (visible to anyone).
   * - `publicProfile === false` → "helper" (Connected-only privacy gate;
   *   suppress when viewer is not Connected to subject).
   * - Self-render: tier always shows on the viewer's own row.
   */
  function resolveCareTier(
    subjectUserId: string,
    connectionState: ConnectionState,
  ): "helper" | "provider" | undefined {
    const subject = getUserById(subjectUserId);
    if (!subject?.carerProfile) return undefined;
    if (subject.carerProfile.publicProfile) return "provider";
    // Helper tier — privacy rule: only visible to Connected viewers (or self).
    const isSelf = subjectUserId === viewerId;
    if (isSelf || connectionState === "connected") return "helper";
    return undefined;
  }

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

  const tier = (a: MeetAttendee): TieredAttendee => {
    if (a.userId === viewerId) {
      return {
        ...a,
        profileOpen: resolveProfileOpen(a.profileOpen, a.userId),
        tier: 1 as const,
        connectionState: "connected" as const,
        careTier: resolveCareTier(a.userId, "connected"),
      };
    }

    const conn = getConnectionState(a.userId, viewerId);
    const state = conn?.state ?? "none";
    const theyMarkedFamiliar = conn?.theyMarkedFamiliar;
    const t = getAttendeeTier(a, viewerId);

    return {
      ...a,
      profileOpen: resolveProfileOpen(a.profileOpen, a.userId),
      tier: t,
      connectionState: state,
      theyMarkedFamiliar,
      careTier: resolveCareTier(a.userId, state),
    };
  };

  const tiered: TieredAttendee[] = attendees.map(tier);
  const tieredFollowers: TieredAttendee[] = followers.map(tier);

  const going = tiered.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interested = tiered.filter((a) => a.rsvpStatus === "interested");

  // Locked chip list combines locked attendees + locked followers — both are
  // "you can see they exist but no card affordance." Dedup on userId so a
  // user who both attended and follows doesn't appear twice.
  const lockedSet = new Map<string, TieredAttendee>();
  for (const a of tiered) if (a.tier === 3) lockedSet.set(a.userId, a);
  for (const f of tieredFollowers) if (f.tier === 3) lockedSet.set(f.userId, f);
  const locked = Array.from(lockedSet.values());

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
      />

      {locked.length > 0 && (
        <LockedChipList
          entries={locked.map((a) => ({
            userId: a.userId,
            name: a.userName,
            avatarUrl: a.avatarUrl,
          }))}
        />
      )}

      {showInterested && (
        <>
          <MetaDivider />
          <PeopleSection
            title="Interested"
            attendees={interested}
            viewerId={viewerId}
            rowActions={rowActions}
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
}: {
  title: string;
  attendees: TieredAttendee[];
  viewerId: string;
  rowActions: PersonAction[] | "auto";
  subdued?: boolean;
}) {
  // Connected first (with viewer pinned to top of that subsection),
  // then Familiar (outbound only — labeled), then everything else flat
  // (Pending / Open / inbound theyMarkedFamiliar — unlabeled to preserve
  // deniability for inbound Familiar marks). Locked (tier 3) attendees
  // are NOT rendered as cards here — they're surfaced as a chip list at
  // the bottom of the parent (`LockedChipList`).
  const connected = attendees.filter((a) => a.connectionState === "connected");
  const familiarOutbound = attendees.filter((a) => a.connectionState === "familiar");
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
        <div className="flex flex-col gap-sm">
          {connected.map((a) => (
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
              careTier={a.careTier}
              actions={rowActions}
            />
          ))}
        </div>
      )}

      {familiarOutbound.length > 0 && <SectionHeader label="Familiar" />}
      {familiarOutbound.length > 0 && (
        <div className="flex flex-col gap-sm">
          {familiarOutbound.map((a) => (
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
              careTier={a.careTier}
              actions={rowActions}
            />
          ))}
        </div>
      )}

      {other.length > 0 && (
        <div className="flex flex-col gap-sm">
          {other.map((a) => (
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
              careTier={a.careTier}
              actions={rowActions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Section primitives (SectionHeader, MetaDivider, LockedChipList) live in
   `components/people/PersonSections.tsx` — shared with MembersTab so the
   pattern stays consistent across person-row surfaces. */
