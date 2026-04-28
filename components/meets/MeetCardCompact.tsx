import Link from "next/link";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  CalendarDots,
  MapPin,
  UsersThree,
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { getDisplayDate, isRecurring } from "@/lib/meetUtils";

/**
 * MeetCardCompact — 200px-wide meet summary used in horizontal-scroll strips
 * (e.g. group-detail chat context). Follows the shared meet-card anatomy
 * (see `docs/features/meets.md` → Meet-card anatomy) but truncated for the
 * narrow container: type pill, title, date/time, location, and a dog count
 * in lieu of the full avatar stack (no room).
 */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

interface MeetCardCompactProps {
  meet: Meet;
}

export function MeetCardCompact({ meet }: MeetCardCompactProps) {
  // Recurring meets show their next upcoming occurrence rather than the
  // series anchor (see `getDisplayDate` rationale in `lib/meetUtils.ts`).
  const displayDate = getDisplayDate(meet);
  const dateObj = new Date(`${displayDate}T${meet.time}`);
  const dateStr = dateObj.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const timeStr = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const datePrefix = isRecurring(meet) ? "Next: " : "";
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const goingCount = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  ).length;
  const dogCount = meet.attendees.reduce((sum, a) => sum + a.dogNames.length, 0);

  return (
    <Link
      href={`/meets/${meet.id}`}
      className="w-[200px] shrink-0 rounded-panel bg-surface-top p-sm shadow-xs flex flex-col gap-xs no-underline border border-edge-light"
    >
      {/* Type pill */}
      <span
        className="card-schedule-chip card-schedule-chip--primary self-start"
        style={{ width: "fit-content" }}
      >
        {MEET_ICONS[meet.type]}
        {MEET_TYPE_LABELS[meet.type]}
      </span>

      {/* Title */}
      <span className="text-sm font-semibold text-fg-primary truncate">{meet.title}</span>

      {/* Date + time */}
      <div className="flex items-center gap-xs text-xs text-fg-tertiary">
        <CalendarDots size={12} weight="light" className="shrink-0" />
        <span className="truncate">{datePrefix}{dateStr} · {timeStr}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-xs text-xs text-fg-tertiary">
        <MapPin size={12} weight="light" className="shrink-0" />
        <span className="truncate">{meet.location}</span>
      </div>

      {/* Group chip (when meet belongs to a group) */}
      {group && (
        <div className="flex items-center gap-xs text-xs">
          <UsersThree size={12} weight="light" className="shrink-0" style={{ color: "var(--status-info-600, #4e63b8)" }} />
          <span className="font-medium truncate" style={{ color: "var(--status-info-600, #4e63b8)" }}>
            {group.name}
          </span>
        </div>
      )}

      {/* People + dog count */}
      <div className="text-xs text-fg-tertiary">
        {goingCount} {goingCount === 1 ? "person" : "people"}
        {dogCount > 0 && ` · ${dogCount} ${dogCount === 1 ? "dog" : "dogs"}`}
      </div>
    </Link>
  );
}
