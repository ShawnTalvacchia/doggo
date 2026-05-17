"use client";

/**
 * GroupInviteSheet — invite people you're connected with into a group.
 *
 * Opened from either Invite affordance on the group detail page (the
 * Members-tab header action + the hero action row). Lists the viewer's
 * connections: those already in the group render disabled ("In this
 * group"); the rest get an Invite button that, on tap, fires a
 * `group_invite` notification to the invitee and flips to "Invited".
 *
 * Connections are resolved through `ConnectionsContext.getConnection` so
 * a connection made earlier in the same session (e.g. accepting a request
 * on the notifications page) is included — not just the static roster.
 *
 * Built for the Guided Walkthrough's Beat 3 (Magda invites Daniel to
 * Holešovice Dog Block). Spec: `docs/features/demo-mode.md`.
 */

import { useMemo } from "react";
import { Check, PawPrint } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { useConnections } from "@/contexts/ConnectionsContext";
import { allUsers } from "@/lib/mockUsers";
import type { Group } from "@/lib/types";

export type GroupInviteSheetProps = {
  open: boolean;
  onClose: () => void;
  group: Group;
  /** The inviting viewer. */
  viewerId: string;
  /** User IDs already invited this visit — drives the per-row "Invited" state. */
  invitedUserIds: Set<string>;
  /** Send an invite to `userId` (the parent fires the notification). */
  onInvite: (userId: string) => void;
};

export function GroupInviteSheet({
  open,
  onClose,
  group,
  viewerId,
  invitedUserIds,
  onInvite,
}: GroupInviteSheetProps) {
  const { getConnection } = useConnections();

  const memberIds = useMemo(
    () => new Set(group.members.map((m) => m.userId)),
    [group.members],
  );

  // Candidates = the viewer's connections. Members render disabled ("In
  // this group"); everyone else is invitable. Non-members sort first so
  // there's always an actionable row at the top.
  const candidates = useMemo(
    () =>
      allUsers
        .filter(
          (u) =>
            u.id !== viewerId &&
            getConnection(u.id, viewerId)?.state === "connected",
        )
        .sort(
          (a, b) => Number(memberIds.has(a.id)) - Number(memberIds.has(b.id)),
        ),
    [viewerId, memberIds, getConnection],
  );

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={`Invite to ${group.name}`}
      compact
      footer={
        <ButtonAction
          variant="primary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Done
        </ButtonAction>
      }
    >
      {candidates.length === 0 ? (
        <p className="text-sm text-fg-tertiary text-center px-lg py-xl">
          You don&rsquo;t have any connections to invite yet. Connect with
          people from your meets and groups first.
        </p>
      ) : (
        <ul className="flex flex-col px-lg py-sm">
          {candidates.map((u) => {
            const isMember = memberIds.has(u.id);
            const invited = invitedUserIds.has(u.id);
            const dogs = u.pets.map((p) => p.name).join(", ");
            return (
              <li key={u.id} className="flex items-center gap-md py-sm">
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <DefaultAvatar name={u.firstName} size={40} />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-fg-primary truncate">
                    {u.firstName} {u.lastName}
                  </span>
                  {dogs && (
                    <span className="flex items-center gap-xs text-xs text-fg-tertiary truncate">
                      <PawPrint size={11} weight="light" className="shrink-0" />
                      {dogs}
                    </span>
                  )}
                </div>
                {isMember ? (
                  <span className="text-xs text-fg-tertiary shrink-0">
                    In this group
                  </span>
                ) : invited ? (
                  <span className="flex items-center gap-xs text-sm font-semibold text-brand-main shrink-0">
                    <Check size={14} weight="bold" aria-hidden="true" />
                    Invited
                  </span>
                ) : (
                  <ButtonAction
                    variant="outline"
                    size="sm"
                    onClick={() => onInvite(u.id)}
                  >
                    Invite
                  </ButtonAction>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ModalSheet>
  );
}
