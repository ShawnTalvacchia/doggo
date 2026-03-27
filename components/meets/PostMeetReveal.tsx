"use client";

import { useState } from "react";
import {
  Handshake,
  Eye,
  X,
  CheckCircle,
  UsersThree,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { MeetAttendee } from "@/lib/types";

interface PostMeetRevealProps {
  /** Meet title for context */
  meetTitle: string;
  /** Attendees who were hidden (Tier 3) during the meet */
  hiddenAttendees: MeetAttendee[];
}

type RevealAction = "familiar" | "connect" | "skip";

/**
 * Post-meet participant reveal — surfaces hidden (Tier 3) attendees
 * after a meet ends, with Familiar / Connect / Skip actions.
 */
export function PostMeetReveal({ meetTitle, hiddenAttendees }: PostMeetRevealProps) {
  const [actions, setActions] = useState<Record<string, RevealAction>>({});

  if (hiddenAttendees.length === 0) return null;

  const unresolvedCount = hiddenAttendees.filter((a) => !actions[a.userId]).length;

  function setAction(userId: string, action: RevealAction) {
    setActions((prev) => ({ ...prev, [userId]: action }));
  }

  function markAllFamiliar() {
    const next: Record<string, RevealAction> = { ...actions };
    hiddenAttendees.forEach((a) => {
      if (!next[a.userId]) next[a.userId] = "familiar";
    });
    setActions(next);
  }

  return (
    <section className="flex flex-col gap-md rounded-panel p-lg bg-surface-top border border-edge-light">
      <div className="flex items-center gap-sm">
        <UsersThree size={24} weight="light" className="text-brand-main" />
        <div>
          <h3 className="font-heading text-base font-semibold text-fg-primary m-0">
            You met {hiddenAttendees.length} new {hiddenAttendees.length === 1 ? "person" : "people"}
          </h3>
          <p className="text-xs text-fg-tertiary m-0">
            at {meetTitle}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        {hiddenAttendees.map((a) => {
          const action = actions[a.userId];
          return (
            <div
              key={a.userId}
              className={`flex items-center gap-md rounded-panel p-sm ${
                action ? "bg-surface-base" : "bg-surface-popout"
              }`}
              style={{ opacity: action === "skip" ? 0.5 : 1 }}
            >
              {a.avatarUrl ? (
                <img
                  src={a.avatarUrl}
                  alt={a.userName}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <DefaultAvatar name={a.userName} size={40} />
              )}

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-fg-primary truncate">
                  {a.userName}
                </span>
                <span className="text-xs text-fg-tertiary">
                  {a.dogNames.join(", ")}
                  {a.neighbourhood ? ` · ${a.neighbourhood}` : ""}
                </span>
              </div>

              {action ? (
                <span className="flex items-center gap-xs text-xs text-fg-secondary">
                  <CheckCircle size={14} weight="fill" className="text-brand-main" />
                  {action === "familiar"
                    ? "Marked Familiar"
                    : action === "connect"
                    ? "Request sent"
                    : "Skipped"}
                </span>
              ) : (
                <div className="flex gap-xs shrink-0">
                  <button
                    onClick={() => setAction(a.userId, "familiar")}
                    className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-secondary border-none cursor-pointer"
                    title="Mark as Familiar"
                  >
                    <Eye size={14} weight="light" />
                  </button>
                  <button
                    onClick={() => setAction(a.userId, "connect")}
                    className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong border-none cursor-pointer"
                    title="Send connect request"
                  >
                    <Handshake size={14} weight="light" />
                  </button>
                  <button
                    onClick={() => setAction(a.userId, "skip")}
                    className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-gray text-fg-tertiary border-none cursor-pointer"
                    title="Skip"
                  >
                    <X size={14} weight="light" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bulk action */}
      {unresolvedCount > 1 && (
        <ButtonAction
          variant="outline"
          size="sm"
          leftIcon={<Eye size={14} weight="light" />}
          onClick={markAllFamiliar}
        >
          Mark all as Familiar
        </ButtonAction>
      )}
    </section>
  );
}
