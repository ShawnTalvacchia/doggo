import { ShieldCheck } from "@phosphor-icons/react";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";

export function RelationshipBanner({
  otherUserId,
  otherName,
}: {
  otherUserId: string;
  otherName: string;
}) {
  const conn = getConnectionState(otherUserId);
  const communityCarer = getCommunityCarers().find((c) => c.userId === otherUserId);
  if (!conn || conn.state === "none") return null;

  const signals: string[] = [];
  if (conn.state === "connected") signals.push(`You and ${otherName} are Connected`);
  if (conn.state === "familiar") signals.push(`${otherName} is marked as Familiar`);
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
