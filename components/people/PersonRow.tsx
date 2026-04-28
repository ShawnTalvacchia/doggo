"use client";

/**
 * PersonRow — canonical row for rendering a person across the app.
 *
 * Variants:
 *   - meet-attendee   → Meet detail People tab + post-meet review (overrides actions)
 *   - group-member    → Group detail Members tab
 *   - inbox-conversation → Inbox conversation list (no action buttons; row click is the affordance)
 *   - default         → Generic surfaces
 *
 * Action affordances are resolved by `resolvePersonActions` (lib/personActions.ts)
 * unless the caller passes an explicit `actions` array. See the A1 spec on the
 * Trust & Visibility Pass phase board for the full API contract.
 */

import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";
import {
  resolvePersonActions,
  type PersonAction,
} from "@/lib/personActions";
import type { ConnectionState } from "@/lib/types";

export type PersonRowVariant =
  | "meet-attendee"
  | "group-member"
  | "inbox-conversation"
  | "default";

export interface PersonRowProps {
  // Identity
  userId: string;
  name: string;
  avatarUrl?: string;
  isSelf?: boolean;

  // Variant
  variant: PersonRowVariant;

  // Pets — owner-keyed; lookup happens internally
  pets?: { name: string; breed?: string }[];

  // Relationship state
  connectionState: ConnectionState;
  theyMarkedFamiliar?: boolean;
  profileOpen?: boolean;

  // Variant extras
  contextLine?: string;          // e.g. "Joining Saturday's walk"
  isAdmin?: boolean;             // group-member only
  isCareProvider?: boolean;      // meet-attendee + group-member: small "Care" badge
  messagePreview?: string;       // inbox-conversation only
  timeAgo?: string;              // inbox-conversation only
  unreadDot?: boolean;           // inbox-conversation only

  // Actions
  /** Default `"auto"` resolves via the matrix. Pass an array to override. */
  actions?: PersonAction[] | "auto";
  onConnect?: () => void;
  onMarkFamiliar?: () => void;
  onUnmarkFamiliar?: () => void;
  onMessage?: () => void;

  // Selection mode (Workstream E3/E4)
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;

  // Navigation
  href?: string;
  onClick?: () => void;
}

/**
 * Pill rendering rule (Trust & Visibility deniability + de-emphasis pass):
 *
 * - `connected`             → no pill. The Message CTA exclusively appears for
 *                             Connected users, so a "Connected" pill would just
 *                             duplicate what the CTA already signals.
 * - `pending`               → display-only pill (no other affordance signals
 *                             the in-flight state, so the pill earns its keep).
 * - `familiar` (outbound)   → "Familiar ✓" pill that toggles off on tap. The
 *                             pill IS the affordance — no separate button.
 * - `none` + matrix has familiar(off) → "+ Familiar" outlined pill, taps to
 *                             mark Familiar. Quieter than a button by design;
 *                             the action is the on-ramp, not the headline CTA.
 *                             Renders identically whether or not the subject
 *                             marked the viewer Familiar (deniability — no
 *                             per-row variation by direction).
 *
 * Net effect: non-Connected rows draw attention (via their pill); Connected
 * rows are visually quiet (just identity + CTA). The right-side action area
 * only ever holds Connect or Message — primary CTA always far-right.
 */
const DISPLAY_PILL: Partial<Record<ConnectionState, { label: string; className: string }>> = {
  pending: {
    label: "Pending",
    className: "person-row-pill person-row-pill--pending",
  },
};

export function PersonRow(props: PersonRowProps) {
  const {
    userId,
    name,
    avatarUrl,
    isSelf = false,
    variant,
    pets,
    connectionState,
    theyMarkedFamiliar = false,
    profileOpen = false,
    contextLine,
    isAdmin = false,
    isCareProvider = false,
    messagePreview,
    timeAgo,
    unreadDot = false,
    actions = "auto",
    onConnect,
    onMarkFamiliar,
    onUnmarkFamiliar,
    onMessage,
    selectMode = false,
    selected = false,
    onToggleSelect,
    href,
    onClick,
  } = props;

  const viewer = useCurrentUser();

  // Resolve action set
  const resolvedActions: PersonAction[] =
    isSelf
      ? []
      : actions === "auto"
        ? resolvePersonActions(
            { userId: viewer.id, profileOpen: viewer.profileVisibility === "open" },
            { userId, connectionState, theyMarkedFamiliar, profileOpen },
          )
        : actions;

  // Default href per variant
  const defaultHref =
    variant === "inbox-conversation"
      ? `/profile/${userId}?tab=chat`
      : `/profile/${userId}`;
  const targetHref = href ?? (isSelf ? "/profile" : defaultHref);

  // Resolve dog avatars internally
  const petsWithImage = (pets ?? []).map((p) => ({
    ...p,
    imageUrl: getDogImageByOwnerAndName(userId, p.name),
  }));
  const petsLine = petsWithImage.map((p) => p.name).join(", ");

  const isInbox = variant === "inbox-conversation";
  // Inbox stays denser (44px owner) — chat-list shape. Other surfaces use 64px
  // owner / 38px dog. Owner stays a circle (humans = circles); dogs use
  // rounded-md (12px) for visual differentiation between the two roles.
  const ownerAvatarSize = isInbox ? 44 : 64;
  const dogAvatarSize = 38;

  // Pill rendering — see DISPLAY_PILL doc-comment above for the full rule.
  // The Familiar pill is the toggle; the right-side action area only carries
  // Connect / Message.
  const familiarMatrixAction = resolvedActions.find((a) => a.kind === "familiar");
  type PillRender =
    | { kind: "display"; label: string; className: string }
    | { kind: "toggle-on"; label: string; className: string; onClick: () => void }
    | { kind: "toggle-off"; label: string; className: string; onClick: () => void };

  const pillRender: PillRender | null = (() => {
    if (isSelf) return null;
    const display = DISPLAY_PILL[connectionState];
    if (display) return { kind: "display", ...display };
    if (connectionState === "familiar") {
      return {
        kind: "toggle-on",
        label: "Familiar ✓",
        className: "person-row-pill person-row-pill--familiar",
        onClick: onUnmarkFamiliar ?? (() => {}),
      };
    }
    if (
      connectionState === "none" &&
      familiarMatrixAction?.kind === "familiar" &&
      familiarMatrixAction.state === "off"
    ) {
      return {
        kind: "toggle-off",
        label: "+ Familiar",
        className: "person-row-pill person-row-pill--familiar-off",
        onClick: onMarkFamiliar ?? (() => {}),
      };
    }
    return null;
  })();

  // Right-side action area: only Connect / Message (Familiar lives in the pill).
  const rightActions = resolvedActions.filter(
    (a) => a.kind === "connect" || a.kind === "message",
  );
  const showActions = !selectMode && rightActions.length > 0;

  // Inbox-conversation wraps the whole row in a Link (no action buttons compete).
  // Other variants keep the row as a div with avatar+name as inner Links.
  const wrapAsLink = isInbox && !selectMode;
  const rowClassName = `person-row person-row--${variant}${selected ? " is-selected" : ""}${
    wrapAsLink ? " no-underline" : ""
  }`;

  const rowChildren = (
    <>
      {selectMode && (
        <button
          type="button"
          className="person-row-checkbox"
          onClick={onToggleSelect}
          aria-pressed={selected}
          aria-label={selected ? `Deselect ${name}` : `Select ${name}`}
        >
          <span
            className={`person-row-checkbox-box${selected ? " is-checked" : ""}`}
            aria-hidden
          />
        </button>
      )}

      {/* Avatar — owner stays a circle (humans = circles convention) */}
      {isInbox ? (
        <span className="person-row-avatar relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="rounded-full object-cover"
              style={{ width: ownerAvatarSize, height: ownerAvatarSize }}
            />
          ) : (
            <DefaultAvatar name={name} size={ownerAvatarSize} />
          )}
          {unreadDot && (
            <span
              className="person-row-unread-dot"
              aria-label="Unread"
              role="status"
            />
          )}
        </span>
      ) : (
        <Link href={targetHref} className="person-row-avatar shrink-0" aria-label={name}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="rounded-full object-cover"
              style={{ width: ownerAvatarSize, height: ownerAvatarSize }}
            />
          ) : (
            <DefaultAvatar name={name} size={ownerAvatarSize} />
          )}
        </Link>
      )}

      {/* Identity column */}
      <div className="person-row-identity flex flex-col gap-xs flex-1 min-w-0">
        <div className="person-row-name-row flex items-center gap-xs min-w-0">
          {isInbox ? (
            <span
              className={`person-row-name text-sm text-fg-primary truncate flex-1 ${
                unreadDot ? "font-semibold" : "font-medium"
              }`}
            >
              {name}
              {isSelf && <span className="font-normal text-fg-tertiary"> (you)</span>}
            </span>
          ) : (
            <Link
              href={targetHref}
              className="person-row-name text-sm font-medium text-fg-primary no-underline hover:underline truncate"
            >
              {name}
              {isSelf && <span className="text-fg-tertiary"> (you)</span>}
            </Link>
          )}
          {pillRender && (
            pillRender.kind === "display" ? (
              <span className={pillRender.className}>{pillRender.label}</span>
            ) : (
              <button
                type="button"
                className={`${pillRender.className} person-row-pill--toggle`}
                onClick={pillRender.onClick}
                aria-pressed={pillRender.kind === "toggle-on"}
                aria-label={
                  pillRender.kind === "toggle-on"
                    ? `Remove Familiar from ${name}`
                    : `Mark ${name} as Familiar`
                }
              >
                {pillRender.label}
              </button>
            )
          )}
          {isAdmin && variant === "group-member" && (
            <span className="person-row-pill person-row-pill--admin">Admin</span>
          )}
          {isCareProvider && (variant === "meet-attendee" || variant === "group-member") && (
            <span className="person-row-pill person-row-pill--care">Care</span>
          )}
          {isInbox && timeAgo && (
            <span className="person-row-time text-xs text-fg-tertiary shrink-0 ml-auto">
              {timeAgo}
            </span>
          )}
        </div>

        {/* Pets row — text-only with paw icon for inbox; with dog avatars for others */}
        {petsLine && (
          isInbox ? (
            <span className="person-row-pets-text-only flex items-center gap-xs text-xs text-fg-tertiary truncate">
              <PawPrint size={11} weight="light" className="shrink-0" />
              {petsLine}
            </span>
          ) : (
            <div className="person-row-pets-row flex items-center gap-sm min-w-0">
              {petsWithImage.map((p, i) =>
                p.imageUrl ? (
                  <img
                    key={`${p.name}-${i}`}
                    src={p.imageUrl}
                    alt=""
                    className="person-row-pet-avatar rounded-md object-cover"
                    style={{ width: dogAvatarSize, height: dogAvatarSize }}
                  />
                ) : null,
              )}
              <span className="text-sm text-fg-secondary truncate">{petsLine}</span>
            </div>
          )
        )}

        {/* Inbox preview row — third line, takes the row's bold-on-unread cue */}
        {isInbox && messagePreview && (
          <span
            className={`person-row-preview text-sm leading-snug truncate ${
              unreadDot ? "text-fg-secondary font-medium" : "text-fg-tertiary"
            }`}
          >
            {messagePreview}
          </span>
        )}

        {contextLine && (
          <span className="person-row-context text-xs text-fg-tertiary truncate">
            {contextLine}
          </span>
        )}
      </div>

      {/* Action area — only Connect / Message live here. Familiar is the pill. */}
      {showActions && (
        <div className="person-row-actions flex items-center gap-xs shrink-0">
          {rightActions.map((action, i) =>
            renderAction(action, i, { onConnect, onMessage }),
          )}
        </div>
      )}
    </>
  );

  return wrapAsLink ? (
    <Link href={targetHref} onClick={onClick} className={rowClassName}>
      {rowChildren}
    </Link>
  ) : (
    <div className={rowClassName}>{rowChildren}</div>
  );
}

function renderAction(
  action: PersonAction,
  i: number,
  handlers: {
    onConnect?: () => void;
    onMessage?: () => void;
  },
) {
  // Variant rule (Doggo design-system convention):
  //   Message = primary filled — brand color celebrates the committed state
  //             (you're already Connected; this is the steady-state affordance).
  //   Connect = secondary outlined — pre-commitment; the outline asks for the
  //             action without claiming the brand-celebrated treatment yet.
  if (action.kind === "connect") {
    return (
      <ButtonAction
        key={`connect-${i}`}
        variant="secondary"
        size="sm"
        cta
        onClick={handlers.onConnect}
      >
        Connect
      </ButtonAction>
    );
  }
  if (action.kind === "message") {
    return (
      <ButtonAction
        key={`message-${i}`}
        variant="primary"
        size="sm"
        cta
        onClick={handlers.onMessage}
      >
        Message
      </ButtonAction>
    );
  }
  return null;
}
