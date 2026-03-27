import Link from "next/link";
import {
  Footprints,
  Tree,
  PawPrint,
  Student,
  CalendarDots,
  Users,
} from "@phosphor-icons/react";
import type { Meet, MeetType } from "@/lib/types";

const TYPE_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <Footprints size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Student size={14} weight="light" />,
};

const TYPE_LABELS: Record<MeetType, string> = {
  walk: "Walk",
  park_hangout: "Hangout",
  playdate: "Playdate",
  training: "Training",
};

interface MeetCardCompactProps {
  meet: Meet;
}

export function MeetCardCompact({ meet }: MeetCardCompactProps) {
  const dateObj = new Date(`${meet.date}T${meet.time}`);
  const dateStr = dateObj.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const timeStr = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <Link
      href={`/meets/${meet.id}`}
      className="w-[200px] shrink-0 rounded-panel bg-surface-top p-sm shadow-xs flex flex-col gap-xs no-underline border border-edge-light"
    >
      <div className="flex items-center gap-xs">
        <span className="text-brand-main">{TYPE_ICONS[meet.type]}</span>
        <span className="text-xs font-medium text-fg-secondary">{TYPE_LABELS[meet.type]}</span>
      </div>
      <span className="text-sm font-medium text-fg-primary truncate">{meet.title}</span>
      <div className="flex items-center gap-xs text-xs text-fg-tertiary">
        <CalendarDots size={12} weight="light" />
        {dateStr} · {timeStr}
      </div>
      <div className="flex items-center gap-xs text-xs text-fg-tertiary">
        <Users size={12} weight="light" />
        {meet.attendees.length}/{meet.maxAttendees}
      </div>
    </Link>
  );
}
