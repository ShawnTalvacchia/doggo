"use client";

/**
 * PostMeetReviewSheet — the warm-but-private "how was your walk?" moment.
 *
 * A stepped ModalSheet (welcome → photos → make connections) that replaces
 * the old `/meets/[id]/connect` page route. Opened via `usePostMeetReview()`
 * from schedule cards and (eventually) notifications. Mounted once at the
 * app layout level so any surface can trigger it without routing.
 *
 * Design direction is non-obvious — see memory note
 * `project_doggo_post_meet_flow.md` for the "stepped, not Tinder, photos
 * and members separate" intent.
 *
 * MVP scope (tracked in phase board D-tasks):
 *  - Attendee side only. Host view deferred (D5).
 *  - Photos step = add one photo with caption (no tag-people flow).
 *  - Marks are sheet-local state — they don't propagate to
 *    `mockConnections`, so cross-surface reactivity is out of scope for
 *    this pass. Flag as known limitation.
 */

import { useMemo, useState } from "react";
import {
  CalendarDots,
  MapPin,
  UsersThree,
  UploadSimple,
  X,
  Camera,
  CaretLeft,
  Globe,
  Lock,
  Check,
  UserPlus,
  ChatCircleDots,
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
} from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { usePostMeetReview } from "@/contexts/PostMeetReviewContext";
import { mockMeets, MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { getGroupById } from "@/lib/mockGroups";
import { formatMeetDateTime } from "@/lib/dateUtils";
import { getAttendeeTier } from "@/lib/meetUtils";
import { OwnerDogAvatar } from "@/components/people/OwnerDogAvatar";
import { getConnectionState } from "@/lib/mockConnections";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { resolvePersonActions } from "@/lib/personActions";
import type { Meet, MeetAttendee, MeetType } from "@/lib/types";

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={14} weight="light" />,
  park_hangout: <Tree size={14} weight="light" />,
  playdate: <PawPrint size={14} weight="light" />,
  training: <Target size={14} weight="light" />,
};

type Step = 1 | 2;
// "skip" was dropped 2026-04-27 — the new state-grouped section layout
// (Not Familiar / Familiar / Connected / Locked) carries the "I'm not
// acting on this person right now" meaning via section position.
// Untouched cards in the top section default to no action; the user
// just hits Done to finish.
type AttendeeAction = "familiar" | "connect" | null;

export function PostMeetReviewSheet() {
  const { isOpen, meetId, closeReview } = usePostMeetReview();
  const meet = meetId ? mockMeets.find((m) => m.id === meetId) ?? null : null;

  const [step, setStep] = useState<Step>(1);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [marks, setMarks] = useState<Record<string, AttendeeAction>>({});

  function handleClose() {
    closeReview();
    setStep(1);
    setPhotoUrl("");
    setCaption("");
    setMarks({});
  }

  if (!meet) {
    return (
      <ModalSheet open={isOpen} onClose={handleClose} title="Post-meet review">
        <p className="text-sm text-fg-tertiary p-md">No meet selected.</p>
      </ModalSheet>
    );
  }

  const title = step === 1 ? "Your meet" : "Make connections";

  return (
    <ModalSheet
      open={isOpen}
      onClose={handleClose}
      title={title}
      footer={
        <StepFooter
          step={step}
          onBack={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
          onNext={() => setStep((s) => (s < 2 ? ((s + 1) as Step) : s))}
          onClose={handleClose}
        />
      }
    >
      <div className="flex flex-col gap-xl p-lg">
        <StepIndicator step={step} />
        {step === 1 && (
          <ReflectStep
            meet={meet}
            photoUrl={photoUrl}
            onPhotoChange={setPhotoUrl}
            caption={caption}
            onCaptionChange={setCaption}
          />
        )}
        {step === 2 && (
          <MakeConnectionsStep
            meet={meet}
            marks={marks}
            onMarksChange={setMarks}
          />
        )}
      </div>
    </ModalSheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Step indicator — "1 · 2 · 3" dot row
   ═══════════════════════════════════════════════════════════════ */

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-xs" aria-hidden>
      {[1, 2].map((s) => (
        <span
          key={s}
          className="rounded-full"
          style={{
            width: s === step ? 24 : 8,
            height: 8,
            background: s <= step ? "var(--brand-main)" : "var(--border-regular)",
            transition: "width 150ms ease, background 150ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Step 1: Reflect — meet recap + photos + caption (merged)
   Replaces the prior Welcome + Photos two-step. Existing photos
   from the meet render at the top; the upload UI sits below as
   "Add a photo" / "Add another photo." Caption applies to the new
   photo being added in this session.
   ═══════════════════════════════════════════════════════════════ */

function ReflectStep({
  meet,
  photoUrl,
  onPhotoChange,
  caption,
  onCaptionChange,
}: {
  meet: Meet;
  photoUrl: string;
  onPhotoChange: (url: string) => void;
  caption: string;
  onCaptionChange: (v: string) => void;
}) {
  const group = meet.groupId ? getGroupById(meet.groupId) : null;
  const peopleCount = meet.attendees.length;
  const dogCount = meet.attendees.reduce((n, a) => n + a.dogNames.length, 0);
  const existingPhotos = meet.photos ?? [];
  const hasExisting = existingPhotos.length > 0;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onPhotoChange(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <h2 className="font-heading text-xl font-semibold text-fg-primary m-0">
          How was your {MEET_TYPE_LABELS[meet.type].toLowerCase()}?
        </h2>
        <p className="text-sm text-fg-secondary">
          Take a moment to reflect — add a photo, remember who you met.
        </p>
      </div>

      {/* Recap card */}
      <div className="flex flex-col gap-sm rounded-panel p-md bg-surface-base border border-edge-regular">
        <div className="flex items-center gap-xs">
          <span className="card-schedule-chip card-schedule-chip--primary">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
        </div>
        <h3 className="font-heading text-md font-semibold text-fg-primary m-0">
          {meet.title}
        </h3>
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <CalendarDots size={14} weight="light" />
          {formatMeetDateTime(meet.date, meet.time)}
        </div>
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <MapPin size={14} weight="light" />
          {meet.location}
        </div>
        {group && (
          <div className="flex items-center gap-xs text-sm">
            <UsersThree
              size={14}
              weight="light"
              className="shrink-0"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            />
            <span
              className="font-medium"
              style={{ color: "var(--status-info-600, #4e63b8)" }}
            >
              {group.name}
            </span>
          </div>
        )}
        <p className="text-sm text-fg-tertiary m-0">
          You walked with {peopleCount} {peopleCount === 1 ? "person" : "people"}
          {dogCount > 0 && ` and ${dogCount} ${dogCount === 1 ? "dog" : "dogs"}`}.
        </p>
      </div>

      {/* Photos block — existing photos as a grid with an inline Add cell
          as the first square. Two display modes:
          - When there are existing photos AND no new selection: grid
            with Add as first cell, no separate full-width prompt below.
            Keeps the action visible without scroll past the grid.
          - When there are NO existing photos AND no new selection: a
            full-width dashed prompt (the action gets primary attention
            since there's nothing else to fill the space).
          When the user has selected a new photo, the 16:9 preview takes
          the prominent spot (existing pattern) and the Add affordance
          collapses to a "Change photo" button. */}
      <div className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-fg-primary">
            {hasExisting ? `Photos (${existingPhotos.length})` : "Photos"}
          </span>
          {hasExisting && (
            <span className="text-xs text-fg-tertiary">From the meet</span>
          )}
        </div>

        {/* Grid: Add cell + existing photos. Only renders when there
            are existing photos OR a new photo was just added (in which
            case the existing grid still shows, no Add cell since the
            preview below is the active "new photo" slot). */}
        {hasExisting && (
          <div className="grid grid-cols-3 gap-xs">
            {/* Add-cell-as-first-square. Suppressed when the user has
                already selected a new photo (the 16:9 preview below
                handles change-vs-remove there). */}
            {!photoUrl && (
              <label
                className="relative overflow-hidden rounded-md bg-surface-base border-2 border-dashed border-edge-strong flex flex-col items-center justify-center gap-xs cursor-pointer text-fg-secondary"
                style={{ aspectRatio: "1 / 1" }}
              >
                <UploadSimple size={28} weight="light" />
                <span className="text-sm font-semibold">Add</span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            )}
            {existingPhotos.slice(0, 6).map((url, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-md bg-surface-inset"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {photoUrl ? (
          <div className="flex flex-col gap-sm">
            <div className="relative overflow-hidden rounded-panel bg-surface-inset aspect-video">
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoChange("")}
                aria-label="Remove photo"
                className="absolute top-xs right-xs w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-white bg-[color:var(--transparent-dark-40)] hover:bg-[color:var(--transparent-dark-64)]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <label className="flex items-center justify-center gap-xs rounded-panel p-sm text-sm font-medium cursor-pointer bg-surface-top border border-edge-regular text-fg-secondary">
              <Camera size={16} weight="light" />
              Change photo
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>
        ) : !hasExisting ? (
          // No existing photos: full-width dashed prompt remains the
          // primary CTA — there's no grid to nest the Add cell into.
          <label className="flex flex-col items-center justify-center gap-xs rounded-panel p-lg text-sm font-medium cursor-pointer bg-surface-top border border-dashed border-edge-regular text-fg-secondary">
            <UploadSimple size={24} weight="light" />
            <span>Add a photo</span>
            <span className="text-xs text-fg-tertiary">JPG or PNG</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        ) : null}

        {photoUrl && (
          <div className="input-block">
            <label className="label" htmlFor="post-meet-caption">
              <span className="label-primary-group">
                <span>Caption</span>
                <span className="label-secondary">(Optional)</span>
              </span>
            </label>
            <textarea
              id="post-meet-caption"
              className="textarea"
              placeholder="A quick thought about the walk — what was nice, who was there"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Step 3: Make connections — dog-forward attendee review
   Tier 1/2 get full cards with actions. Tier 3 (locked) get a
   quiet "also there" list with name + avatar only.
   ═══════════════════════════════════════════════════════════════ */

function MakeConnectionsStep({
  meet,
  marks,
  onMarksChange,
}: {
  meet: Meet;
  marks: Record<string, AttendeeAction>;
  onMarksChange: (m: Record<string, AttendeeAction>) => void;
}) {
  const viewer = useCurrentUser();
  const currentUserId = viewer.id;

  // State-grouped sections (replaced 2026-04-27 the prior actionable/
  // alsoThere split). Surfacing attendees by relationship state lets the
  // user scan top-down: people they can act on first, then already-known
  // tiers, then the quiet locked list at the bottom. Section position
  // also carries the "I'm not acting on this person right now" meaning
  // — no Skip button needed, just leave a card untouched.
  //
  // Buckets:
  //   notFamiliar — tier 1/2 + connectionState === "none". Action(s)
  //                 from the matrix (typically just Familiar; both
  //                 Familiar + Connect when subject is open or has
  //                 marked the viewer Familiar).
  //   familiar    — connectionState === "familiar". Matrix returns
  //                 Connect (when subject visible to viewer); the
  //                 already-on Familiar mark is suppressed.
  //   connected   — connectionState === "connected". No card actions —
  //                 the row is informational ("you already know each
  //                 other"); message action is reserved for chat
  //                 surfaces, not the post-meet review.
  //   locked      — tier 3 attendees. Quiet bottom list, name+avatar
  //                 only, no actions.
  const { notFamiliar, familiar, connected, locked, familiarApplicable } = useMemo(() => {
    const others = meet.attendees.filter((a) => a.userId !== currentUserId);
    const notFamiliar: MeetAttendee[] = [];
    const familiar: MeetAttendee[] = [];
    const connected: MeetAttendee[] = [];
    const locked: MeetAttendee[] = [];
    // Subset of notFamiliar where Familiar is a meaningful action — used
    // by the bulk "Mark everyone familiar" button so it doesn't promise
    // to do something for cards that don't have the affordance.
    const familiarApplicable = new Set<string>();

    for (const a of others) {
      const tier = getAttendeeTier(a, currentUserId);
      if (tier === 3) {
        locked.push(a);
        continue;
      }
      const conn = getConnectionState(a.userId, currentUserId);
      const state = conn?.state ?? "none";
      if (state === "connected") {
        connected.push(a);
        continue;
      }
      if (state === "familiar") {
        familiar.push(a);
        continue;
      }
      // state === "none" or "pending" — both land in the top notFamiliar
      // bucket. Pending is rare and the matrix returns no actions for it,
      // so the card renders as info-only in the top section.
      notFamiliar.push(a);
      const matrix = resolvePersonActions(
        { userId: currentUserId, profileOpen: viewer.profileVisibility === "open" },
        {
          userId: a.userId,
          connectionState: state,
          theyMarkedFamiliar: conn?.theyMarkedFamiliar,
          profileOpen: a.profileOpen ?? conn?.profileOpen ?? false,
        },
      );
      const offFamiliar = matrix.find(
        (m) => m.kind === "familiar" && m.state === "off",
      );
      if (offFamiliar) familiarApplicable.add(a.userId);
    }
    return { notFamiliar, familiar, connected, locked, familiarApplicable };
  }, [meet.attendees, currentUserId, viewer.profileVisibility]);

  function setMark(userId: string, action: AttendeeAction) {
    onMarksChange({ ...marks, [userId]: action });
  }

  function markAllFamiliar() {
    const next: Record<string, AttendeeAction> = { ...marks };
    for (const a of notFamiliar) {
      if (!next[a.userId] && familiarApplicable.has(a.userId)) {
        next[a.userId] = "familiar";
      }
    }
    onMarksChange(next);
  }

  const hasUnmarked = notFamiliar.some(
    (a) => !marks[a.userId] && familiarApplicable.has(a.userId),
  );
  // Soft inline confirmation count — shows after "Mark all" runs (or as
  // the user marks individuals). Counts only Familiar marks within the
  // notFamiliar bucket (the only bucket where Familiar is an active
  // affordance).
  const familiarMarkCount = notFamiliar.reduce(
    (n, a) => (marks[a.userId] === "familiar" ? n + 1 : n),
    0,
  );

  const totalActionable = notFamiliar.length + familiar.length + connected.length;

  // Profile-state-aware explainer. The two states have different
  // affordances on the attendee cards (open viewers don't see Familiar
  // — see resolvePersonActions for the matrix), so the explainer text
  // differs too. Locked users get the longer "what does Familiar do"
  // primer because that's the conceptually new action; open users get
  // the simpler "Connect is the only path forward" line.
  const viewerOpen = viewer.profileVisibility === "open";
  // Personalize the locked-profile copy with the viewer's first dog
  // name when present — concrete-name framing reads more naturally
  // than abstract "your dog." Falls back to "your name and avatar"
  // when the viewer has no dogs (rare for testers, common for the
  // brand-new-user persona).
  const primaryDogName = viewer.pets?.[0]?.name;

  return (
    <div className="flex flex-col gap-md">
      <h2 className="font-heading text-xl font-semibold text-fg-primary m-0">
        Did you meet anyone new?
      </h2>

      {/* Privacy + actions explainer. Surface-base background + small
          inline icon header reads as "informational, not alarming." */}
      <div className="flex flex-col gap-sm rounded-panel bg-surface-base p-md">
        {viewerOpen ? (
          <>
            <span className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary">
              <Globe size={14} weight="fill" />
              Your profile is open
            </span>
            <p className="text-sm text-fg-secondary m-0">
              These people could already see your profile when they met you.
              {" "}
              <strong>Connect</strong> sends a mutual request — they&apos;ll need to confirm.
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary">
              <Lock size={14} weight="fill" />
              Your profile is locked
            </span>
            <p className="text-sm text-fg-secondary m-0">
              People who don&apos;t know you only see {primaryDogName ? `your name and ${primaryDogName}` : "your name and avatar"}.
            </p>
            <ul className="flex flex-col gap-xs text-sm text-fg-secondary m-0 list-none p-0">
              <li>
                <strong>Familiar</strong> quietly grants access to your profile (no notification).
              </li>
              <li>
                <strong>Connect</strong> sends a mutual request — both sides confirm.
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Bulk action area — morphs in place between two states with the
          same visual envelope (height, padding, surface, border) so the
          transition feels stable. Hides when there are no familiar-
          applicable attendees in the not-yet-familiar bucket. */}
      {notFamiliar.length > 0 && hasUnmarked && (
        <button
          type="button"
          onClick={markAllFamiliar}
          className="flex items-center justify-center gap-xs w-full rounded-panel p-sm bg-surface-inset border border-edge-regular text-sm font-medium text-fg-primary cursor-pointer"
        >
          <Check size={16} weight="bold" className="text-brand-main" />
          Mark everyone familiar
        </button>
      )}

      {notFamiliar.length > 0 && !hasUnmarked && familiarMarkCount > 0 && (
        <div className="flex items-center justify-between gap-sm w-full rounded-panel p-sm bg-surface-inset border border-edge-regular">
          <span className="flex items-center gap-xs text-sm font-medium text-fg-primary">
            <Check size={16} weight="bold" className="text-brand-main" />
            {familiarMarkCount} marked Familiar
          </span>
          <button
            type="button"
            onClick={() => {
              // Undo clears all marks in the notFamiliar bucket — both
              // Familiar and Connect (Connect implies Familiar, so a
              // half-undo would be confusing). Predictable "I want to
              // start over" semantics; the user can re-mark individuals
              // after.
              const next: Record<string, AttendeeAction> = { ...marks };
              for (const a of notFamiliar) {
                if (next[a.userId]) next[a.userId] = null;
              }
              onMarksChange(next);
            }}
            className="text-sm font-semibold text-fg-tertiary uppercase tracking-wide underline underline-offset-2 cursor-pointer hover:text-fg-primary transition-colors"
          >
            Undo
          </button>
        </div>
      )}

      {/* Top section — Not yet Familiar (unlabeled, the default). Most
          cards live here on a typical post-meet review. Cards have a
          footer that evolves: "Mark as familiar" prompt → split
          [Familiar ✓ | Connect →] when marked. */}
      {notFamiliar.length > 0 && (
        <ul className="flex flex-col gap-sm list-none p-0 m-0">
          {notFamiliar.map((a) => (
            <AttendeeActionCard
              key={a.userId}
              attendee={a}
              mark={marks[a.userId] ?? null}
              onMark={(action) => setMark(a.userId, action)}
              section="not-familiar"
            />
          ))}
        </ul>
      )}

      {/* Familiar section — already marked Familiar in a previous
          session. Cards have an inline secondary Connect pill (the
          only escalation left). No footer — to undo the prior Familiar
          mark, the user goes elsewhere (member detail / profile). */}
      {familiar.length > 0 && (
        <SectionHeader label="Familiar" />
      )}
      {familiar.length > 0 && (
        <ul className="flex flex-col gap-sm list-none p-0 m-0">
          {familiar.map((a) => (
            <AttendeeActionCard
              key={a.userId}
              attendee={a}
              mark={marks[a.userId] ?? null}
              onMark={(action) => setMark(a.userId, action)}
              section="familiar"
            />
          ))}
        </ul>
      )}

      {/* Connected section — already mutual. Cards have an inline
          primary Message pill (the active conversation channel). */}
      {connected.length > 0 && (
        <SectionHeader label="Connected" />
      )}
      {connected.length > 0 && (
        <ul className="flex flex-col gap-sm list-none p-0 m-0">
          {connected.map((a) => (
            <AttendeeActionCard
              key={a.userId}
              attendee={a}
              mark={marks[a.userId] ?? null}
              onMark={(action) => setMark(a.userId, action)}
              section="connected"
            />
          ))}
        </ul>
      )}

      {/* Empty-state when nobody is in any actionable bucket. Locked
          attendees may still appear below — they're not "actionable" in
          the connect sense. */}
      {totalActionable === 0 && (
        <p className="text-sm text-fg-tertiary">
          No one new to connect with this time — all the folks who came are
          already in your circle.
        </p>
      )}

      {/* Private profiles section — quiet bottom list. Tier 3 attendees
          who don't have enough shared context to surface as actionable. */}
      {locked.length > 0 && (
        <div className="flex flex-col gap-sm pt-md border-t border-edge-regular">
          <div className="flex items-center gap-xs text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            <Lock size={12} weight="light" />
            Private profiles
          </div>
          <ul className="flex flex-wrap gap-sm list-none p-0 m-0">
            {locked.map((a) => (
              <li key={a.userId} className="flex items-center gap-xs rounded-panel px-sm py-xs bg-surface-inset">
                {a.avatarUrl ? (
                  <img
                    src={a.avatarUrl}
                    alt={a.userName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <DefaultAvatar name={a.userName} size={24} />
                )}
                <span className="text-sm text-fg-secondary">{a.userName}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-fg-tertiary">
            These attendees have locked profiles — you can see they were there,
            but there&apos;s not enough shared context yet to connect.
          </p>
        </div>
      )}
    </div>
  );
}

/** Quiet section header — labels for Familiar / Connected sections. The
 *  top "Not yet Familiar" section deliberately has no header (it's the
 *  default; adding a label would compete with the action cards). */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-xs text-xs font-semibold uppercase tracking-wider text-fg-tertiary pt-sm">
      {label}
    </div>
  );
}

/** Format a dog list for the secondary line.
 *  - 0 dogs: empty string (caller hides the line)
 *  - 1 dog:  "Bára"
 *  - 2 dogs: "Bára and Eda"
 *  - 3+:     "Bára, Eda + 2"
 */
function formatDogNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  const extra = names.length - 2;
  return `${names[0]}, ${names[1]} + ${extra}`;
}

/** One attendee card in the Make Connections list. Section-aware:
 *
 *  - **not-familiar:** body has an inline pill that EVOLVES with the
 *    mark — `Familiar` (initial) → `Connect` (after marking Familiar)
 *    → `Connect ✓` (after marking Connect, brand-fill selected). When
 *    marked (Familiar OR Connect), a quieter footer line appears below
 *    showing `✓ Familiar` + `UNDO` (one-tap reverse, cascade for
 *    Connect since Connect implies Familiar).
 *
 *  - **familiar:** body + inline secondary Connect pill (no footer).
 *    User has already marked Familiar in a previous session; only
 *    escalation available. To undo prior Familiar, user goes elsewhere
 *    (member detail / profile).
 *
 *  - **connected:** body + inline primary Message pill. Active
 *    conversation channel; tapping navigates to chat (no-op in demo).
 *
 *  Card body uses `align-items: center` — text content centers
 *  vertically against the 64px owner avatar. The "name peeks above
 *  the dogs" effect comes from the avatar combo's internal layout
 *  (dogs bottom-aligned to owner) rather than from row alignment.
 */
function AttendeeActionCard({
  attendee,
  mark,
  onMark,
  section,
}: {
  attendee: MeetAttendee;
  mark: AttendeeAction;
  onMark: (action: AttendeeAction) => void;
  section: "not-familiar" | "familiar" | "connected";
}) {
  const dogLine = formatDogNames(attendee.dogNames);

  // Not-familiar inline pill evolves with the mark. The pill always
  // surfaces the next available action so the user's tap target is
  // clear and the gradient (Familiar before Connect) is reinforced
  // visually. The brand-fill on the Connect pill at "marked Connect"
  // state is the "you committed to this" affordance — tap again to
  // downgrade back to marked Familiar.
  function renderNotFamiliarPill() {
    if (mark === null) {
      // Outline variant — neutral until hover. The Familiar action is
      // available but not the page's primary focus (most users will
      // batch-tap many; the brand-tinted secondary variant is reserved
      // for "next step from a marked state" like the Connect pill).
      return (
        <ButtonAction
          variant="outline"
          size="sm"
          cta
          leftIcon={<Check size={14} weight="bold" />}
          onClick={() => onMark("familiar")}
          className="shrink-0"
        >
          Familiar
        </ButtonAction>
      );
    }
    if (mark === "familiar") {
      return (
        <ButtonAction
          variant="secondary"
          size="sm"
          cta
          leftIcon={<UserPlus size={14} weight="bold" />}
          onClick={() => onMark("connect")}
          className="shrink-0"
        >
          Connect
        </ButtonAction>
      );
    }
    // mark === "connect" — committed state, brand-fill, tap to downgrade
    return (
      <ButtonAction
        variant="primary"
        size="sm"
        cta
        leftIcon={<Check size={14} weight="bold" />}
        onClick={() => onMark("familiar")}
        className="shrink-0"
      >
        Connect
      </ButtonAction>
    );
  }

  return (
    <li className="pmr-card">
      <div className="pmr-card-body">
        <OwnerDogAvatar
          userId={attendee.userId}
          name={attendee.userName}
          avatarUrl={attendee.avatarUrl}
          dogNames={attendee.dogNames}
        />

        <div className="flex flex-col gap-xs flex-1 min-w-0">
          <span className="font-semibold text-base text-fg-primary truncate">
            {attendee.userName}
          </span>
          {dogLine && (
            <span className="text-sm text-fg-secondary truncate">{dogLine}</span>
          )}
        </div>

        {section === "not-familiar" && renderNotFamiliarPill()}
        {section === "familiar" && (
          <ButtonAction
            variant={mark === "connect" ? "primary" : "secondary"}
            size="sm"
            cta
            leftIcon={<UserPlus size={14} weight="bold" />}
            onClick={() => onMark(mark === "connect" ? null : "connect")}
            className="shrink-0"
          >
            Connect
          </ButtonAction>
        )}
        {section === "connected" && (
          <ButtonAction
            variant="primary"
            size="sm"
            cta
            leftIcon={<ChatCircleDots size={14} weight="bold" />}
            onClick={() => {
              /* TODO: route to inbox thread when chat plumbing supports
                 per-user routing from this surface */
            }}
            className="shrink-0"
          >
            Message
          </ButtonAction>
        )}
      </div>

      {/* Footer — only for not-familiar section when marked. Quiet
          confirmation of the prior step (Familiar) + a one-tap UNDO
          that cascades (clears both Familiar AND Connect marks since
          Connect implies Familiar). */}
      {section === "not-familiar" && mark !== null && (
        <div className="pmr-card-footer">
          <span className="pmr-card-footer-label">
            <Check size={14} weight="bold" />
            Familiar
          </span>
          <button
            type="button"
            className="pmr-card-footer-undo"
            onClick={() => onMark(null)}
          >
            Undo
          </button>
        </div>
      )}
    </li>
  );
}

/* `ActionPill` was removed 2026-04-27 — section-aware AttendeeActionCard
   uses ButtonAction (familiar/connected sections) and footer buttons
   (not-familiar section) instead of the prior generic pill. */

/* ═══════════════════════════════════════════════════════════════
   Footer — back/skip/next/done per step
   ═══════════════════════════════════════════════════════════════ */

function StepFooter({
  step,
  onBack,
  onNext,
  onClose,
}: {
  step: Step;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  // Footer buttons use the system-primary pattern (`primary` variant,
  // NO `cta` modifier) — dark fill + white text, small radius, no
  // pill. Process-oriented footers shouldn't be CTA/brand-infused;
  // mixing CTA pill shapes (Continue/Done) with non-CTA small-radius
  // shapes (Maybe later/Back) on the same row read as inconsistent.
  // Body actions (the brand-colored pills on attendee cards) keep the
  // CTA/brand treatment because they're the actual decisions.
  if (step === 1) {
    return (
      <div className="flex items-center justify-between w-full gap-sm">
        <ButtonAction variant="tertiary" size="md" onClick={onClose}>
          Maybe later
        </ButtonAction>
        <ButtonAction variant="primary" size="md" onClick={onNext}>
          Continue
        </ButtonAction>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between w-full gap-sm">
      <ButtonAction variant="tertiary" size="md" onClick={onBack} leftIcon={<CaretLeft size={14} weight="bold" />}>
        Back
      </ButtonAction>
      <ButtonAction variant="primary" size="md" onClick={onClose}>
        Done
      </ButtonAction>
    </div>
  );
}
