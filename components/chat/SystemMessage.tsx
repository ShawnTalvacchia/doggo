import {
  UserPlus,
  CalendarPlus,
  UsersThree,
} from "@phosphor-icons/react";
import type { GroupActivityType } from "@/lib/types";

const ACTIVITY_ICONS: Record<GroupActivityType, React.ReactNode> = {
  member_joined: <UserPlus size={12} weight="light" />,
  meet_posted: <CalendarPlus size={12} weight="light" />,
  rsvp_milestone: <UsersThree size={12} weight="light" />,
};

interface SystemMessageProps {
  text: string;
  activityType?: GroupActivityType;
}

export function SystemMessage({ text, activityType }: SystemMessageProps) {
  return (
    <div className="flex items-center justify-center gap-xs py-sm">
      {activityType && (
        <span className="text-fg-tertiary">{ACTIVITY_ICONS[activityType]}</span>
      )}
      <span className="text-xs text-fg-tertiary">{text}</span>
    </div>
  );
}
