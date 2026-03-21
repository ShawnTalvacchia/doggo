"use client";

import {
  MapPin,
  CalendarBlank,
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { UserProfile, ProviderHeaderState as HeaderState } from "@/lib/types";

type ProfileHeaderOwnProps = {
  user: UserProfile;
  state: HeaderState;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

function formatMemberSince(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function ProfileHeaderOwn({
  user,
  state,
  editing,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeaderOwnProps) {
  const isCondensed = state === "condensed";
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <header className={`profile-header-state ${state}`}>
      <div className="profile-identity">
        <img
          src={user.avatarUrl}
          alt={fullName}
          className="profile-avatar"
        />

        <div className={`profile-main ${isCondensed ? "condensed" : "expanded"}`}>
          <div className="profile-title-wrap">
            <h1 className="profile-name">{fullName}</h1>
            <div className="profile-location">
              <MapPin size={13} weight="fill" style={{ flexShrink: 0 }} />
              {user.location}
            </div>
            {!isCondensed && (
              <div className="profile-member-since">
                <CalendarBlank size={13} weight="regular" style={{ flexShrink: 0 }} />
                Member since {formatMemberSince(user.memberSince)}
              </div>
            )}
          </div>

          {/* Edit / Save / Cancel actions */}
          <div className="profile-edit-actions">
            {editing ? (
              <div className="flex gap-sm">
                <ButtonAction
                  variant="outline"
                  size="sm"
                  leftIcon={<X size={14} weight="bold" />}
                  onClick={onCancel}
                >
                  Cancel
                </ButtonAction>
                <ButtonAction
                  variant="primary"
                  size="sm"
                  leftIcon={<Check size={14} weight="bold" />}
                  onClick={onSave}
                >
                  Save
                </ButtonAction>
              </div>
            ) : (
              <ButtonAction
                variant="outline"
                size={isCondensed ? "sm" : "md"}
                leftIcon={<PencilSimple size={14} weight="bold" />}
                onClick={onEdit}
              >
                Edit Profile
              </ButtonAction>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
