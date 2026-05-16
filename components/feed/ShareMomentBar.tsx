"use client";

import { Camera, PawPrint, MapPin, UsersThree } from "@phosphor-icons/react";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * ShareMomentBar — the inviting post-creation affordance shown at the top
 * of post-bearing surfaces (own-profile Posts tab + community feed).
 *
 * Shape: full-width strip with three parts —
 *   1. Avatar (current user, 40px circle) — establishes card grammar so
 *      the bar reads as a precursor to the posts it produces.
 *   2. Input prompt ("Share a moment...") — sunken pill, primary tap
 *      target. Opens the PostComposer modal.
 *   3. Shortcut row (Photo · Dog · Location · Group) — light tertiary
 *      buttons with Phosphor icons. Each opens the composer; the
 *      tagged ones (Dog / Location / Group) drop the user directly
 *      into the relevant tag picker via `initialTagPicker`. Photo
 *      opens the composer with no picker active so the user can use
 *      the prominent "add photo" affordance inside.
 *
 * Strip chrome is self-contained — `--surface-top` background with
 * top + bottom borders so it reads as its own block before the post
 * list. Works the same in both consumer contexts (profile Posts tab
 * + home feed). 2026-05-13.
 */

function ShortcutButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-xs text-xs font-medium text-fg-secondary"
      style={{
        background: "transparent",
        border: "none",
        padding: "4px 0",
        cursor: "pointer",
      }}
    >
      <span style={{ color: "var(--text-secondary)" }}>{icon}</span>
      {label}
    </button>
  );
}

export function ShareMomentBar() {
  const { openComposer } = usePostComposer();
  const user = useCurrentUser();

  return (
    <div
      className="px-md py-md"
      style={{
        background: "var(--surface-top)",
        borderTop: "1px solid var(--border-regular)",
        borderBottom: "1px solid var(--border-regular)",
      }}
    >
      <div className="flex items-start gap-sm">
        <img
          src={user.avatarUrl}
          alt={user.firstName}
          className="rounded-full object-cover shrink-0"
          style={{ width: 40, height: 40 }}
        />
        <div className="flex flex-col gap-sm flex-1 min-w-0">
          <button
            type="button"
            onClick={() => openComposer()}
            className="rounded-pill px-md py-sm w-full text-left text-sm text-fg-tertiary"
            style={{
              background: "var(--surface-inset)",
              border: "1px solid var(--border-regular)",
              cursor: "pointer",
            }}
          >
            Share a moment...
          </button>
          <div className="flex items-center gap-lg flex-wrap">
            <ShortcutButton
              icon={<Camera size={16} weight="light" />}
              label="Photo"
              onClick={() => openComposer()}
            />
            <ShortcutButton
              icon={<PawPrint size={16} weight="light" />}
              label="Dog"
              onClick={() => openComposer({ initialTagPicker: "dog" })}
            />
            <ShortcutButton
              icon={<MapPin size={16} weight="light" />}
              label="Location"
              onClick={() => openComposer({ initialTagPicker: "place" })}
            />
            <ShortcutButton
              icon={<UsersThree size={16} weight="light" />}
              label="Group"
              onClick={() => openComposer({ initialTagPicker: "community" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
