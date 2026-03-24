"use client";

import { ShieldCheck, Handshake, Clock, CalendarDots } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { ConnectionState } from "@/lib/types";

interface TrustGateBannerProps {
  connectionState: ConnectionState;
  userName: string;
  meetsShared?: number;
}

export function TrustGateBanner({ connectionState, userName, meetsShared }: TrustGateBannerProps) {
  if (connectionState === "connected") return null;

  const firstName = userName.split(" ")[0];

  if (connectionState === "none") {
    return (
      <div
        className="flex items-start gap-md rounded-panel p-md"
        style={{ background: "var(--surface-inset)", border: "1px solid var(--border-light)" }}
      >
        <CalendarDots size={24} weight="light" className="shrink-0" style={{ color: "var(--text-tertiary)", marginTop: 2 }} />
        <div className="flex flex-col gap-xs flex-1">
          <span className="text-sm font-medium text-fg-primary">
            Attend a meet with {firstName} to connect
          </span>
          <span className="text-xs text-fg-tertiary">
            Doggo builds trust through real-world encounters. Join a meet where {firstName} is going, or invite them to one of yours.
          </span>
        </div>
      </div>
    );
  }

  if (connectionState === "familiar") {
    return (
      <div
        className="flex items-start gap-md rounded-panel p-md"
        style={{ background: "var(--brand-subtle)", border: "1px solid var(--brand-main)" }}
      >
        <Handshake size={24} weight="light" className="shrink-0" style={{ color: "var(--brand-main)", marginTop: 2 }} />
        <div className="flex flex-col gap-sm flex-1">
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-medium text-fg-primary">
              You&apos;ve met {firstName}{meetsShared ? ` at ${meetsShared} meet${meetsShared > 1 ? "s" : ""}` : ""} — connect to book care
            </span>
            <span className="text-xs text-fg-tertiary">
              Send a connection request to unlock messaging and care booking.
            </span>
          </div>
          <ButtonAction variant="primary" size="sm">
            Connect with {firstName}
          </ButtonAction>
        </div>
      </div>
    );
  }

  if (connectionState === "pending") {
    return (
      <div
        className="flex items-center gap-md rounded-panel p-md"
        style={{ background: "var(--surface-inset)", border: "1px solid var(--border-light)" }}
      >
        <Clock size={20} weight="light" style={{ color: "var(--text-tertiary)" }} />
        <span className="text-sm text-fg-secondary">
          Connection request sent to {firstName}. You&apos;ll be able to book care once they accept.
        </span>
      </div>
    );
  }

  return null;
}
