import type { ConnectionState } from "@/lib/types";

/**
 * Action affordances surfaced on a `PersonRow`. Resolved by `resolvePersonActions`
 * per the Trust & Visibility action matrix
 * (see `docs/phases/trust-visibility-pass.md` → Action Matrix).
 *
 * - `connect`  — sends a connection request. Always primary.
 * - `familiar` — toggles the silent grant. Secondary; carries `state: "off" | "on"`.
 *                "on" means the viewer has already marked the subject Familiar and
 *                tapping the action reverses the mark.
 * - `message`  — opens the conversation thread. Only available between Connected users.
 *
 * `skip` is intentionally absent — it's a post-meet-review-specific action that
 * callers pass via the `actions` override on `PersonRow`, not through the matrix.
 */
export type PersonAction =
  | { kind: "connect" }
  | { kind: "familiar"; state: "off" | "on" }
  | { kind: "message" };

export type PersonActionViewer = {
  userId: string;
  /** Viewer's profile is publicly visible. */
  profileOpen: boolean;
};

export type PersonActionSubject = {
  userId: string;
  /** Connection state from viewer→subject. `"familiar"` = viewer marked subject. */
  connectionState: ConnectionState;
  /**
   * Subject marked viewer Familiar (inbound). Per the Trust & Connection Model
   * (Familiar either direction = Tier 2), this grants the viewer visibility into
   * the subject and is treated as a "signal" by the matrix.
   */
  theyMarkedFamiliar?: boolean;
  /** Subject's profile is publicly visible. */
  profileOpen?: boolean;
};

/**
 * Resolve the action set for a row showing `subject` from `viewer`'s perspective.
 *
 * **Familiar gates Connect** (locked viewers, app-wide as of 2026-04-27).
 * The trust model intends Familiar as the gateway to Connect — "I
 * acknowledge you exist" must precede "I want a mutual relationship."
 * The UI now enforces that gradient: locked viewers cannot see Connect
 * until they've already marked the subject Familiar. Even if the
 * subject's profile is open OR they marked the viewer Familiar, the
 * viewer must mark them back before Connect appears. This is stricter
 * than the previous "any signal exposes Connect" rule but consistent
 * with the trust model's intent and reduces the cognitive load of
 * seeing two actions on every card.
 *
 * **Open-profile viewers** (`viewer.profileOpen`): Familiar is redundant
 * (their profile is already public). They get only Connect — they're
 * effectively past the Familiar step by default since anyone can see
 * them. The "open viewers skip Familiar" rule preserves the gradient
 * principle: by being open, they've already done the work of "I'm
 * open to being known."
 *
 * Matrix — locked viewers:
 *
 * `connectionState === "none"`:
 *   - **always [familiar(off)]** — gating means no Connect path until
 *     the viewer has marked Familiar, regardless of subject visibility
 *
 * `connectionState === "familiar"` (viewer marked subject):
 *   - subject visible to me (`subject.profileOpen || subject.theyMarkedFamiliar`)
 *                       → [connect, familiar(on)]
 *   - subject locked-to-me → [familiar(on)]
 *
 * `connected`           → [message]
 * `pending`             → []   (caller renders the "Pending" pill)
 * self                  → []
 *
 * The function is pure — no side effects, no I/O. `onClick` handlers are wired by
 * the consumer at the call site so this stays trivially testable.
 */
export function resolvePersonActions(
  viewer: PersonActionViewer,
  subject: PersonActionSubject,
): PersonAction[] {
  if (viewer.userId === subject.userId) return [];

  const {
    connectionState,
    theyMarkedFamiliar = false,
    profileOpen: subjectOpen = false,
  } = subject;

  if (connectionState === "connected") {
    return [{ kind: "message" }];
  }

  if (connectionState === "pending") {
    return [];
  }

  // Open viewers skip Familiar entirely — their profile is already
  // public so the silent grant has nothing to grant. The gradient
  // principle still holds: by being open they've effectively done
  // the Familiar step by default.
  if (viewer.profileOpen) {
    return [{ kind: "connect" }];
  }

  if (connectionState === "familiar") {
    const subjectVisibleToMe = subjectOpen || theyMarkedFamiliar;
    return subjectVisibleToMe
      ? [{ kind: "connect" }, { kind: "familiar", state: "on" }]
      : [{ kind: "familiar", state: "on" }];
  }

  // connectionState === "none" — locked viewer must mark Familiar
  // first. No Connect path until then, even if subject is open or has
  // marked the viewer Familiar. Subject visibility no longer matters
  // for the action set in this state.
  return [{ kind: "familiar", state: "off" }];
}
