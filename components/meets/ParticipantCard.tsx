"use client";

import Link from "next/link";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ConnectionIcon } from "@/components/ui/ConnectionIcon";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import type { ConnectionState } from "@/lib/types";

interface ParticipantCardProps {
  userId: string;
  userName: string;
  avatarUrl: string;
  dogNames: string[];
  dogBreed?: string;
  neighbourhood?: string;
  /** Connection state with this user */
  connectionState: ConnectionState;
  /** Whether they marked us as Familiar */
  theyMarkedFamiliar?: boolean;
  /** Whether this user's profile is open */
  profileOpen?: boolean;
  /** Relationship context signals (e.g. "Connected since January") */
  signals?: string[];
  /** Whether this is the current user */
  isYou?: boolean;
  /** Whether to show care provider indicator */
  isCareProvider?: boolean;
}

export function ParticipantCard({
  userId,
  userName,
  avatarUrl,
  dogNames,
  dogBreed,
  neighbourhood,
  connectionState,
  theyMarkedFamiliar,
  profileOpen,
  signals = [],
  isYou,
  isCareProvider,
}: ParticipantCardProps) {
  const showConnectAction =
    connectionState !== "connected" &&
    connectionState !== "pending" &&
    !isYou;

  const dogLine = dogBreed
    ? `${dogNames.join(", ")} · ${dogBreed}`
    : dogNames.join(", ");

  return (
    <div className="flex items-start gap-md rounded-panel p-md bg-surface-top border border-edge-light">
      {/* Avatar */}
      <Link href={isYou ? "/profile" : `/profile/${userId}`} className="shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="rounded-full object-cover"
            style={{ width: 44, height: 44 }}
          />
        ) : (
          <DefaultAvatar name={userName} size={44} />
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-xs min-w-0">
        <div className="flex items-center gap-xs">
          <Link
            href={isYou ? "/profile" : `/profile/${userId}`}
            className="text-sm font-medium text-fg-primary no-underline hover:underline truncate"
          >
            {userName}
            {isYou && <span className="text-fg-tertiary"> (you)</span>}
          </Link>
          <ConnectionIcon
            state={connectionState}
            theyMarkedFamiliar={theyMarkedFamiliar}
            profileOpen={profileOpen}
            size={14}
          />
          {isCareProvider && (
            <span
              className="text-xs rounded-pill px-xs py-0 font-medium"
              style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)", fontSize: 10 }}
            >
              Care
            </span>
          )}
        </div>

        {dogLine && (
          <span className="text-xs text-fg-secondary truncate">{dogLine}</span>
        )}

        {neighbourhood && (
          <span className="text-xs text-fg-tertiary">{neighbourhood}</span>
        )}

        {/* Context signals */}
        {signals.length > 0 && (
          <span className="text-xs text-fg-tertiary italic">
            {signals[0]}
          </span>
        )}
      </div>

      {/* Connect action */}
      {showConnectAction && (
        <ButtonAction variant="outline" size="sm">
          Connect
        </ButtonAction>
      )}
    </div>
  );
}
