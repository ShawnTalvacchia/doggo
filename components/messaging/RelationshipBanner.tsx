"use client";

import { ShieldCheck } from "@phosphor-icons/react";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { useCurrentUserId } from "@/hooks/useCurrentUser";

export function RelationshipBanner({
  otherUserId,
  otherName,
}: {
  otherUserId: string;
  otherName: string;
}) {
  const currentUserId = useCurrentUserId();
  const conn = getConnectionState(otherUserId, currentUserId);
  const communityCarer = getCommunityCarers(currentUserId).find((c) => c.userId === otherUserId);
  if (!conn || conn.state === "none") return null;

  const signals: string[] = [];
  if (conn.state === "connected") signals.push(`You and ${otherName} are Connected`);
  // `state === "familiar"` is outbound (the viewer marked the other person).
  // Phrase it from the viewer's own action — describing one's own action is
  // fine and clearer; the deniability guardrail (Trust & Visibility D2) only
  // applies to revealing OTHER people's actions to the viewer.
  if (conn.state === "familiar") signals.push(`You've marked ${otherName} as Familiar`);
  if (communityCarer && communityCarer.meetsShared > 0) {
    signals.push(`${communityCarer.meetsShared} meets together`);
  }
  if (conn.metAt) signals.push("Met through a Doggo meet");

  if (signals.length === 0) return null;

  return (
    <div className="flex items-start gap-sm rounded-panel bg-brand-subtle border border-brand-light p-sm mx-md mt-sm mb-xs">
      <ShieldCheck size={18} weight="light" className="shrink-0 mt-px text-brand-main" />
      <div className="flex flex-col gap-xs">
        {signals.map((s, i) => (
          <span key={i} className="text-xs text-brand-strong">{s}</span>
        ))}
      </div>
    </div>
  );
}
