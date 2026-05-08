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
 *
 * Info-only mode: pass `actions={[]}` to suppress ALL action affordances
 * (right-side Connect/Message buttons + inline Familiar toggle pill). Pending
 * pill still renders (status, not action). Used by surfaces that gate action
 * by context — e.g. People tab when the viewer didn't attend the meet, Group
 * Members tab when there's no shared meet history. Single gating rule
 * (`viewerSharedMeetWith`) applied app-wide; see Community & Groups Deep Pass
 * board + `Trust & Connection Model.md` → "Meet participant visibility rules".
 */

import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { TierBadge } from "@/components/people/TierBadge";
import { OwnerDogAvatar } from "@/components/people/OwnerDogAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useConnections } from "@/contexts/ConnectionsContext";
import {
  resolvePersonActions,
  type PersonAction,
} from "@/lib/personActions";
import type { ConnectionState } from "@/lib/types";

/**
 * Format a dog name list for the secondary text line below the owner name.
 *
 *   0 dogs → empty (caller hides the line)
 *   1 dog  → "Bára"
 *   2 dogs → "Bára and Eda"
 *   3+     → "Bára, +N more"  (where N = total − 1; matches the Figma mock)
 *
 * Differs from `PostMeetReviewSheet`'s formatDogNames (which uses
 * "Bára, Eda + 2") — the People-tab pattern emphasises the first dog and
 * collapses the rest into a "+N more" suffix, paired visually with the
 * "+N" chip in the OwnerDogAvatar's dog cluster.
 */
function formatPetsLine(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, +${names.length - 1} more`;
}

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
  /**
   * Care tier badge — derived from `UserProfile.carerProfile.publicProfile`
   * by the consumer. Helper-tier visibility is the consumer's job to gate:
   * pass `"helper"` only when the viewer is Connected to the subject (or
   * is the subject themselves), otherwise pass `undefined`. Provider tier
   * has no privacy gate. See `docs/implementation/badges.md`.
   */
  careTier?: "helper" | "provider";
  messagePreview?: string;       // inbox-conversation only
  /** Type of the previewed message — used to style system messages
   *  (inquiry / proposal / contract) distinctly from chat text. Defaults
   *  to "text". Discover & Care G6, 2026-05-02 (closes P46-2 within
   *  service-thread scope). */
  messagePreviewKind?: "text" | "inquiry" | "proposal" | "payment";
  timeAgo?: string;              // inbox-conversation only
  unreadDot?: boolean;           // inbox-conversation only
  /**
   * Booking context label (e.g. "Reactive dog session", "Recall training").
   * Renders inline next to the dog name on inbox rows. Inbox-conversation
   * only; ignored on other variants. Undefined for direct/social threads
   * (no booking attached) — row falls back to dog name only.
   */
  serviceLabel?: string;

  // Actions
  /**
   * Default `"auto"` resolves via `resolvePersonActions` (the matrix).
   * Pass an array to override. Pass `[]` (empty array) for info-only mode
   * — suppresses the action button. The Pending status pill still renders.
   */
  actions?: PersonAction[] | "auto";

  /**
   * Session mark — when set, indicates the viewer has just marked the
   * subject in this session. Drives the body button's ladder progression
   * AND the footer rendering. Mirrors the post-meet review's `AttendeeActionCard`
   * pattern. State managed by the consumer (e.g. `MembersTab` keeps a
   * `Record<userId, "familiar" | "connect">`); session-scoped — lost on
   * navigation away. Cross-surface persistence is Mock World Building scope.
   *
   * Ladder semantics (matches post-meet review):
   *   - `null` (no mark) + matrix permits familiar(off) → button shows "+ Familiar"
   *   - `"familiar"` + matrix permits connect → button shows "Connect" (escalation)
   *   - `"familiar"` + no connect available → button hidden (footer carries state)
   *   - `"connect"` → button shows "Connect ✓" (committed; tap downgrades to familiar)
   * Footer renders when mark !== null with "✓ Familiar | Undo".
   */
  mark?: "familiar" | "connect" | null;
  /** Advance the mark one step up the ladder. */
  onAdvance?: () => void;
  /** Clear the mark entirely (back to null) — wired to footer Undo. */
  onUndoMark?: () => void;
  /** Downgrade from connect → familiar (tap on "Connect ✓" button). */
  onDowngradeMark?: () => void;

  onConnect?: () => void;
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
 * Pill rendering rule (post-meet-review-aligned, single inline action):
 *
 * - `connected`             → no pill. The Message button on the right side
 *                             carries the signal.
 * - `pending`               → display-only pill in the name area. Status,
 *                             not action — renders regardless of whether
 *                             actions are suppressed.
 * - All other states (Familiar / None / etc.) → no name-area pill. The
 *                             single right-side action button carries
 *                             everything (Familiar toggle, "+ Familiar"
 *                             on-ramp, Connect, Message). Aligns with the
 *                             post-meet review's `AttendeeActionCard`
 *                             pattern — one inline action affordance per
 *                             row, adapts to relationship state.
 *
 * Info-only mode: pass `actions={[]}` (an empty array) to suppress the
 * right-side action button. Pending status pill still renders (it's
 * status, not action). Used by surfaces that gate action by context —
 * e.g. the People tab when the viewer didn't attend the meet.
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
    careTier,
    mark = null,
    onAdvance,
    onUndoMark,
    onDowngradeMark,
    messagePreview,
    messagePreviewKind = "text",
    timeAgo,
    unreadDot = false,
    serviceLabel,
    actions = "auto",
    onConnect,
    onMessage,
    selectMode = false,
    selected = false,
    onToggleSelect,
    href,
    onClick,
  } = props;

  const viewer = useCurrentUser();
  // Default Familiar mutation handlers — fall back to ConnectionsContext
  // when the consumer doesn't pass `onAdvance`/`onUndoMark`. This makes
  // PersonRow self-sufficient: surfaces like ParticipantList that don't
  // track their own session marks (no undo footer needed) still get a
  // working "+ Familiar" / "Familiar ✓" toggle. Consumers that DO pass
  // explicit handlers (MembersTab, post-meet review) keep their behaviour.
  const { markFamiliar, unmarkFamiliar } = useConnections();
  const defaultMark = () => markFamiliar(viewer.id, userId);
  const defaultUnmark = () => unmarkFamiliar(viewer.id, userId);

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

  const isInbox = variant === "inbox-conversation";
  // Inbox stays denser (44px owner, no dog avatars) — chat-list shape.
  // Non-inbox variants use OwnerDogAvatar (64px owner + 32px dogs overlapping
  // the bottom-right) — dogs are siblings of the owner inside the combo, so
  // the identity column sits AFTER the entire avatar cluster. The owner
  // name is naturally offset to the right of the dog cluster; that's
  // the intended layout per the Figma reference.
  const inboxOwnerSize = 44;

  // Build the secondary text line (used in the identity column under the
  // name). Non-inbox variants render dog images via `OwnerDogAvatar` in the
  // avatar slot and use this text line as the dog name caption ("Bára and
  // Eda" / "Bára, +N more"). Inbox compresses to a concatenated text line
  // with a paw icon (chat-list shape, no per-dog avatars).
  const dogNames = (pets ?? []).map((p) => p.name);
  const petsLine = isInbox ? dogNames.join(", ") : formatPetsLine(dogNames);

  // Status pill (display-only) — only renders for Pending state. Familiar
  // and None states render no name-area pill; the single right-side action
  // button carries those affordances.
  const pillRender = DISPLAY_PILL[connectionState] ?? null;

  // Single inline action — adapts to the relationship state AND the
  // session mark (set by the consumer). Ladder progression:
  //
  //   mark === null:
  //     - matrix has familiar(off) → "+ Familiar" (advance to mark="familiar")
  //     - matrix has connect (open viewer) → "Connect" (advance to mark="connect")
  //     - state === "connected" → "Message"
  //   mark === "familiar":
  //     - matrix has connect → "Connect" (advance to mark="connect")
  //     - else → no body button (footer carries the mark state)
  //   mark === "connect":
  //     - "Connect ✓" committed (tap downgrades to mark="familiar")
  //
  // Inbox suppresses entirely (whole-row click is the affordance).
  const familiarOff = resolvedActions.find(
    (a): a is { kind: "familiar"; state: "off" } =>
      a.kind === "familiar" && a.state === "off",
  );
  const messageAction = resolvedActions.find((a) => a.kind === "message");
  const connectAction = resolvedActions.find((a) => a.kind === "connect");

  // After marking Familiar (state="familiar") on a Locked subject the matrix
  // returns familiar(on) only — no Connect path available. The row used to
  // render with no inline action in that case, leaving the user no way to
  // unmark from the row. Adding "familiar-on" surfaces a "Familiar ✓" toggle
  // pill that calls unmarkFamiliar (or `onUndoMark` if the consumer wired
  // their own). Mock World Building 2026-04-30.
  const familiarOn = resolvedActions.find(
    (a): a is { kind: "familiar"; state: "on" } =>
      a.kind === "familiar" && a.state === "on",
  );

  type SingleAction =
    | { kind: "familiar-off"; onClick: () => void }
    | { kind: "familiar-on"; onClick: () => void }
    | { kind: "connect"; onClick: () => void }
    | { kind: "connect-committed"; onClick: () => void }
    | { kind: "message"; onClick?: () => void };

  const singleAction: SingleAction | null = (() => {
    if (isSelf || isInbox || selectMode) return null;
    if (mark === "connect") {
      return { kind: "connect-committed", onClick: onDowngradeMark ?? (() => {}) };
    }
    if (mark === "familiar") {
      // After marking Familiar — body button offers escalation when matrix permits.
      // If no connect available (e.g., locked-locked viewer-subject), body is empty;
      // footer carries the mark state.
      if (connectAction) return { kind: "connect", onClick: onAdvance ?? defaultMark };
      return null;
    }
    // mark === null — drive from matrix
    if (messageAction) return { kind: "message", onClick: onMessage };
    if (familiarOff) return { kind: "familiar-off", onClick: onAdvance ?? defaultMark };
    if (connectAction) return { kind: "connect", onClick: onAdvance ?? defaultMark };
    // Locked-locked + state="familiar" lands here — render the toggle so
    // the user can unmark inline without navigating to the profile page.
    if (familiarOn) return { kind: "familiar-on", onClick: onUndoMark ?? defaultUnmark };
    return null;
  })();

  // Footer renders when mark !== null OR singleAction is present (the row's
  // card chrome wraps both). Body row always shows; footer is conditional.
  const showActions = singleAction !== null;
  const showFooter = !isInbox && !selectMode && mark !== null;

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

      {/* Avatar — inbox uses 44px circle (chat-list shape); other variants
          use OwnerDogAvatar (64px owner + 32px dogs overlapping bottom-right).
          Dogs are siblings of the owner inside the combo, so the identity
          column starts AFTER the full cluster. */}
      {isInbox ? (
        <span className="person-row-avatar relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="rounded-full object-cover"
              style={{ width: inboxOwnerSize, height: inboxOwnerSize }}
            />
          ) : (
            <DefaultAvatar name={name} size={inboxOwnerSize} />
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
        <Link
          href={targetHref}
          className="person-row-avatar shrink-0 block h-16"
          aria-label={name}
        >
          <OwnerDogAvatar
            userId={userId}
            name={name}
            avatarUrl={avatarUrl}
            dogNames={dogNames}
          />
        </Link>
      )}

      {/* Identity column. For non-inbox variants:
          - Parent column locked to 64px so it matches the avatar height
            for clean flex-centering by the row container.
          - name-row is 32px tall with `marginLeft: -16px` — pulled LEFT
            into the empty space above the dog cluster (dogs sit at the
            bottom-right of the owner avatar, so the upper-right area is
            free for the name to extend into).
          - Pet text uses `leading-8` (32px line-height) and stays in
            its natural position. The horizontal offset on the name
            creates visual asymmetry — name juts leftward toward the
            owner, pet text holds the standard column position. That
            asymmetry gives consecutive cards distinction instead of
            blurring into a uniform two-row rhythm. */}
      <div
        className={`person-row-identity flex flex-col flex-1 min-w-0 ${
          isInbox ? "gap-sm" : "h-16"
        }`}
      >
        <div
          className={`person-row-name-row flex items-center gap-xs min-w-0 ${
            isInbox ? "" : "h-8 -ml-3"
          }`}
        >
          {isInbox ? (
            <span
              className={`person-row-name text-sm text-fg-primary truncate ${
                unreadDot ? "font-semibold" : "font-medium"
              }`}
            >
              {name}
              {isSelf && <span className="font-normal text-fg-tertiary"> (you)</span>}
            </span>
          ) : (
            <Link
              href={targetHref}
              className="person-row-name text-sm font-semibold text-fg-primary no-underline hover:underline truncate leading-8"
            >
              {name}
              {isSelf && <span className="font-normal text-fg-tertiary"> (you)</span>}
            </Link>
          )}
          {/* Inbox: dog name(s) + booking-service context inline with owner
              name (chat-list shape). Owner stays prominent; dog + service
              drop to muted. Service label only renders for booking
              conversations (`serviceLabel` undefined for direct/social
              threads). The whole cluster truncates if too long so the
              timestamp on the right is never pushed off. */}
          {isInbox && (petsLine || serviceLabel) && (
            <span className="person-row-pets-inline flex items-center gap-xs text-xs text-fg-tertiary min-w-0 truncate">
              <PawPrint size={11} weight="light" className="shrink-0" />
              <span className="truncate">
                {petsLine}
                {petsLine && serviceLabel && " · "}
                {serviceLabel}
              </span>
            </span>
          )}
          {pillRender && (
            <span className={pillRender.className}>{pillRender.label}</span>
          )}
          {isAdmin && variant === "group-member" && (
            <span className="person-row-pill person-row-pill--admin">Admin</span>
          )}
          {careTier === "provider" && (variant === "meet-attendee" || variant === "group-member") && (
            <TierBadge tier="provider" subjectName={name} />
          )}
          {careTier === "helper" && (variant === "meet-attendee" || variant === "group-member") && (
            <TierBadge tier="helper" subjectName={name} />
          )}
          {isInbox && timeAgo && (
            <span className="person-row-time text-xs text-fg-tertiary shrink-0 ml-auto">
              {timeAgo}
            </span>
          )}
        </div>

        {/* Pets line — non-inbox variants only. Renders below the name with
            `formatPetsLine` ("Bára" / "Bára and Eda" / "Bára, +N more")
            paired with the dog avatars in OwnerDogAvatar. Inbox folds the
            dog name(s) inline next to the owner name above. */}
        {!isInbox && petsLine && (
          <span className="text-sub text-fg-tertiary truncate leading-8">{petsLine}</span>
        )}

        {/* Inbox preview row — third line, takes the row's bold-on-unread cue.
            System-message previews (inquiry, proposal, contract, payment)
            render with a leading icon glyph so they don't read as draft text.
            G6 / closes P46-2 within service-thread scope. */}
        {isInbox && messagePreview && (
          <span
            className={`person-row-preview person-row-preview--${messagePreviewKind} text-sm leading-snug truncate ${
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

      {/* Action area — single inline button per row, adapts to relationship
          state + session mark. See `singleAction` resolution above for the
          ladder priority. */}
      {showActions && singleAction && (
        <div className="person-row-actions flex items-center gap-xs shrink-0">
          {renderSingleAction(singleAction, name)}
        </div>
      )}
    </>
  );

  // The footer appears below the body row when a session mark exists.
  // Mirrors the post-meet review's `AttendeeActionCard` footer pattern —
  // confirms what's just been marked + provides Undo. Session-scoped:
  // disappears when the consumer clears its mark state (e.g. on nav away).
  const footer = showFooter ? (
    <div className="person-row-footer">
      <span className="person-row-footer-confirm">
        ✓ Familiar
      </span>
      <button
        type="button"
        className="person-row-footer-undo"
        onClick={onUndoMark ?? (() => {})}
        aria-label={`Undo Familiar mark on ${name}`}
      >
        Undo
      </button>
    </div>
  ) : null;

  // Layout: the outer `.person-row` wraps a body row + optional footer.
  // When there's no footer (most surfaces, most rows), the body row IS
  // the row. The body class drives the inline flex layout for inbox vs
  // non-inbox; `.person-row` provides the panel chrome (border, background,
  // padding, radius) and a flex-col when a footer renders.
  if (wrapAsLink) {
    return (
      <Link href={targetHref} onClick={onClick} className={rowClassName}>
        <div className="person-row-body">{rowChildren}</div>
        {footer}
      </Link>
    );
  }
  return (
    <div className={rowClassName}>
      <div className="person-row-body">{rowChildren}</div>
      {footer}
    </div>
  );
}

/**
 * Render the single inline action button per the resolved `singleAction`.
 * Variant rules (Doggo convention):
 *   - Message (Connected) — primary filled, brand color celebrates the
 *     committed state.
 *   - Connect ✓ (committed via session mark, tap downgrades to familiar)
 *     — primary brand fill with check.
 *   - Connect — secondary outlined, pre-commitment ask (escalation from
 *     familiar OR open-viewer matrix path).
 *   - + Familiar — outline (low-key), the on-ramp for marking.
 */
function renderSingleAction(
  action:
    | { kind: "familiar-off"; onClick: () => void }
    | { kind: "familiar-on"; onClick: () => void }
    | { kind: "connect"; onClick: () => void }
    | { kind: "connect-committed"; onClick: () => void }
    | { kind: "message"; onClick?: () => void },
  name: string,
) {
  if (action.kind === "familiar-on") {
    return (
      <button
        type="button"
        onClick={action.onClick}
        className="person-row-pill person-row-pill--familiar person-row-pill--toggle"
        aria-pressed
        aria-label={`Remove Familiar from ${name}`}
      >
        Familiar ✓
      </button>
    );
  }
  if (action.kind === "message") {
    return (
      <ButtonAction variant="primary" size="sm" cta onClick={action.onClick}>
        Message
      </ButtonAction>
    );
  }
  if (action.kind === "connect-committed") {
    return (
      <ButtonAction
        variant="primary"
        size="sm"
        cta
        onClick={action.onClick}
        aria-label={`Undo Connect for ${name}`}
      >
        Connect ✓
      </ButtonAction>
    );
  }
  if (action.kind === "connect") {
    return (
      <ButtonAction variant="secondary" size="sm" cta onClick={action.onClick}>
        Connect
      </ButtonAction>
    );
  }
  // familiar-off
  return (
    <ButtonAction
      variant="outline"
      size="sm"
      cta
      onClick={action.onClick}
      aria-label={`Mark ${name} as Familiar`}
    >
      + Familiar
    </ButtonAction>
  );
}
