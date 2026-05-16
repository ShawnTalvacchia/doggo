"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  Sparkle,
  CaretRight,
  Eye,
  MapPin,
  CalendarBlank,
  PawPrint,
  ShareNetwork,
  CopySimple,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { PetCard } from "./PetCard";
import { PetEditCard } from "./PetEditCard";
import { SectionHeader } from "./SectionHeader";
import { TagApprovalSetting } from "./TagApprovalSetting";
import { ProfileNameDropdown } from "./ProfileNameDropdown";
import { ProfileVisibilityChip } from "./ProfileVisibilityChip";
import { ProfileVisibilitySetting } from "./ProfileVisibilitySetting";
import { getCarerIdentity } from "@/lib/identityBadges";
import { getConnectionsForViewer } from "@/lib/mockConnections";
import { PersonRow } from "@/components/people/PersonRow";
import { SectionHeader as PersonSectionHeader } from "@/components/people/PersonSections";
import type { PetProfile, UserProfile, TagApproval, ProfileVisibility } from "@/lib/types";

// ── Helpers (used by ProfileHero below) ──────────────────────────────────────

function formatMemberSince(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function ShareProfileButton({ shareCode }: { shareCode: string }) {
  // Every persona gets a shareable link; if the persona profile doesn't define
  // an explicit shareCode, fall back to the user ID as the slug.
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/connect/${shareCode}`;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <ButtonAction
      variant="outline"
      size="sm"
      leftIcon={
        copied ? (
          <CopySimple size={14} weight="bold" />
        ) : (
          <ShareNetwork size={14} weight="light" />
        )
      }
      onClick={handleCopy}
    >
      {copied ? "Copied!" : "Share Profile"}
    </ButtonAction>
  );
}

// ── ProfileHero (own profile) ────────────────────────────────────────────────
//
// Mirrors the horizontal hero used on `/profile/[userId]` for visual
// parity between own-profile and other-profile views. Avatar left +
// name/location/dogs/member-since/share button on the right; stacks
// vertically on narrow viewports. The persona dropdown (demo-only) sits
// in the name slot; the Carer identity badge surfaces alongside it when
// the viewer has a `carerProfile`. 2026-05-11 (walkthrough B1).

function ProfileHero({ user }: { user: UserProfile }) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const dogNames = user.pets.map((p) => p.name);
  // Self-view is always "connected" to itself for visibility — surface
  // the Carer badge unconditionally when carerProfile exists.
  const carerBadge = getCarerIdentity(user, true);

  return (
    <div
      className="flex flex-col gap-md"
      style={{ paddingBottom: "var(--space-md)" }}
    >
      <div className="flex flex-col sm:flex-row gap-lg sm:items-center">
        <div
          className="self-center sm:self-auto shrink-0"
          style={{ padding: 12 }}
        >
          <img
            src={user.avatarUrl}
            alt={fullName}
            className="rounded-full object-cover"
            style={{ width: 200, height: 200 }}
          />
        </div>
        <div className="w-full sm:flex-1 flex flex-col gap-xs min-w-0 items-center sm:items-start text-center sm:text-left">
          <ProfileNameDropdown name={fullName} />
          {/* Pills row — Profile visibility chip + Carer identity chip
              nest UNDER the name (was inline alongside the name). Lets
              the name carry the heading weight without competing chrome;
              chips line up as supporting metadata on their own row.
              Visibility chip leads — it's the more structural fact
              (always present, defaults to "Private") and the privacy
              state modifies the noun "profile"; Carer role is
              conditional supplementary metadata. No `flex-wrap` — chip
              widths fit even on a 280px viewport.

              Carer chip uses the same chip chrome as ProfileVisibilityChip
              (12px font, px-sm py-xs, rounded-pill) — colors stay
              distinct (info-blue vs neutral surface; different meanings
              deserve different colors) but physical size matches so the
              row reads as a clean sibling pair. Sized smaller than the
              PersonRow `.person-row-pill--carer` treatment (which is
              tuned for compact 36px rows). 2026-05-13 (PDP). */}
          <div className="flex items-center gap-sm justify-center sm:justify-start">
            <ProfileVisibilityChip
              visibility={user.profileVisibility ?? "locked"}
            />
            {carerBadge && (
              <span
                className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
                style={{
                  background: "var(--status-info-light)",
                  color: "var(--status-info-strong)",
                }}
              >
                {carerBadge.label}
              </span>
            )}
          </div>
          {user.location && (
            <span className="flex items-center gap-xs text-sm text-fg-secondary">
              <MapPin size={13} weight="fill" className="shrink-0" />
              {user.location}
            </span>
          )}
          {dogNames.length > 0 && (
            <span className="flex items-center gap-xs text-sm text-fg-secondary">
              <PawPrint size={13} weight="light" className="shrink-0" />
              {dogNames.join(", ")}
            </span>
          )}
          <span className="flex items-center gap-xs text-xs text-fg-tertiary">
            <CalendarBlank size={13} weight="regular" className="shrink-0" />
            Member since {formatMemberSince(user.memberSince)}
          </span>
          <div className="flex gap-sm" style={{ marginTop: "var(--space-md)" }}>
            <ShareProfileButton shareCode={user.shareCode ?? user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Connections list (internal) ──────────────────────────────────────────────

// Avatar stack cap on the in-tab summary cards. Overflow rolls into a
// "+N" chip; full lists live in the ModalSheet behind "View all".
// 2026-05-11.
const CONNECTION_AVATAR_CAP = 5;

// Modal-only — renders the uncapped grouped list inside the ModalSheet.
// The in-tab summary uses `ConnectionGroupCard` (below) instead.
//
// Uses the shared `SectionHeader` + `PersonRow` primitives so the modal
// matches the meet member-list pattern across the app — bigger entries
// with owner+dog avatars + identity badge support, semibold uppercase
// section dividers. The per-row state pill that the old `ConnectionRow`
// carried is dropped: the section header already says what state these
// rows are. Actions left at default `"auto"` (resolvePersonActions
// matrix) — Connected rows surface a Message button; Familiar rows
// surface a Connect button (escalation up the ladder); Pending rows
// render the inline status pill. Same self-wiring pattern the meet
// member list uses. 2026-05-13.
function ConnectionGroup({
  label,
  items,
}: {
  label: string;
  items: ReturnType<typeof getConnectionsForViewer>;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <PersonSectionHeader label={label} />
      {items.map((conn) => (
        <PersonRow
          key={conn.id}
          userId={conn.userId}
          name={conn.userName}
          avatarUrl={conn.avatarUrl}
          variant="default"
          pets={conn.dogNames.map((name) => ({ name }))}
          connectionState={conn.state}
          theyMarkedFamiliar={conn.theyMarkedFamiliar}
          href={`/profile/${conn.userId}`}
        />
      ))}
    </div>
  );
}

// In-tab summary card — one per state (Connected / Familiar / Pending).
// Avatar stack on the left, label + count on the right. Non-interactive;
// the "View all" button below the row of cards opens the full modal.
// 2026-05-11.
function ConnectionGroupCard({
  label,
  items,
}: {
  label: string;
  items: ReturnType<typeof getConnectionsForViewer>;
}) {
  const preview = items.slice(0, CONNECTION_AVATAR_CAP);
  const overflow = Math.max(0, items.length - CONNECTION_AVATAR_CAP);
  return (
    <div
      className="flex items-center gap-md rounded-form"
      style={{
        padding: "var(--space-md)",
        background: "var(--surface-top)",
        border: "1px solid var(--border-regular)",
      }}
    >
      <div className="flex items-center shrink-0">
        {preview.map((conn, i) => (
          <img
            key={conn.id}
            src={conn.avatarUrl}
            alt={conn.userName}
            className="rounded-full border-2 border-surface-top object-cover"
            style={{
              width: 32,
              height: 32,
              marginLeft: i > 0 ? -8 : 0,
            }}
          />
        ))}
        {overflow > 0 && (
          <span
            className="flex items-center justify-center rounded-full text-xs font-medium"
            style={{
              width: 32,
              height: 32,
              marginLeft: -8,
              background: "var(--surface-gray)",
              color: "var(--text-secondary)",
              border: "2px solid var(--surface-top)",
            }}
          >
            +{overflow}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg-primary m-0">{label}</p>
        <p className="text-xs text-fg-tertiary m-0">
          {items.length} {items.length === 1 ? "person" : "people"}
        </p>
      </div>
    </div>
  );
}

function ConnectionsList({ viewerId }: { viewerId: string }) {
  const [showAll, setShowAll] = useState(false);

  const myConnections = getConnectionsForViewer(viewerId);
  const connected = myConnections.filter((c) => c.state === "connected");
  const familiar = myConnections.filter((c) => c.state === "familiar");
  const pending = myConnections.filter((c) => c.state === "pending");
  const total = connected.length + familiar.length + pending.length;

  if (total === 0) {
    // Header + description bundled in a single wrapper div so they stack
    // tight (natural text rhythm, no `gap-md` from the section flex
    // between them). Button sits as its own section child so the
    // section's `gap-md` provides the breathing room from description
    // to CTA. Mirrors the Profile visibility / Tagging preferences
    // bundle pattern used elsewhere on this tab. 2026-05-13.
    return (
      <>
        <div>
          <SectionHeader title="Connections" />
          <p className="text-sm text-fg-secondary m-0">
            No connections yet. Attend a meet to start building your community.
          </p>
        </div>
        <div className="flex items-start">
          <ButtonAction variant="outline" size="sm" href="/discover/meets">
            Browse Meets
          </ButtonAction>
        </div>
      </>
    );
  }

  // States with zero connections are hidden — keeps the summary tight.
  const groups = [
    { label: "Connected", items: connected },
    { label: "Familiar", items: familiar },
    { label: "Pending", items: pending },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <SectionHeader
        title="Connections"
        action={
          <ButtonAction
            variant="tertiary"
            size="sm"
            onClick={() => setShowAll(true)}
          >
            View all ({total})
          </ButtonAction>
        }
      />
      <div className="flex flex-col gap-sm">
        {groups.map((group) => (
          <ConnectionGroupCard
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </div>

      <ModalSheet
        open={showAll}
        onClose={() => setShowAll(false)}
        title={`Connections · ${total}`}
      >
        <div className="flex flex-col gap-md" style={{ padding: "var(--space-md)" }}>
          {groups.map((group) => (
            <ConnectionGroup
              key={group.label}
              label={group.label}
              items={group.items}
            />
          ))}
        </div>
      </ModalSheet>
    </>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ProfileAboutTabProps {
  user: UserProfile;
  editing: boolean;
  editState: { bio: string; pets: PetProfile[] };
  onEditChange: (updates: Partial<{ bio: string; pets: PetProfile[] }>) => void;
  tagApproval: TagApproval;
  onTagApprovalChange: (value: TagApproval) => void;
  /** Current profile visibility setting. Drives both the hero chip
   *  (read-only signal) and the Privacy section's selected option
   *  (the editable control). 2026-05-11 CCFT. */
  profileVisibility: ProfileVisibility;
  onProfileVisibilityChange: (value: ProfileVisibility) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileAboutTab({
  user,
  editing,
  editState,
  onEditChange,
  tagApproval,
  onTagApprovalChange,
  profileVisibility,
  onProfileVisibilityChange,
}: ProfileAboutTabProps) {
  return (
    <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
      {/* Hero — horizontal layout for parity with /profile/[userId]. */}
      <ProfileHero user={user} />

      {/* Bio */}
      <section>
        <SectionHeader title="About me" />
        {editing ? (
          <textarea
            className="textarea"
            value={editState.bio}
            onChange={(e) => onEditChange({ bio: e.target.value })}
            placeholder="Tell people about yourself..."
            style={{ minHeight: 80 }}
          />
        ) : (
          <p className="profile-card-copy">{user.bio}</p>
        )}
      </section>

      {/* Dogs — bare or with-button via SectionHeader; section's
          flex-column gap (from `.profile-tab-stack > section`) handles
          header → cards spacing. 2026-05-11. */}
      <section>
        <SectionHeader
          title="My dogs"
          action={
            editing ? (
              <ButtonAction
                variant="tertiary"
                size="sm"
                leftIcon={<Plus size={13} weight="bold" />}
                onClick={() => {
                  const newPet: PetProfile = {
                    id: `pet-${Date.now()}`,
                    name: "",
                    breed: "",
                    weightLabel: "",
                    ageLabel: "",
                    imageUrl: "",
                    notes: "",
                  };
                  onEditChange({ pets: [...editState.pets, newPet] });
                }}
              >
                Add dog
              </ButtonAction>
            ) : undefined
          }
        />
        {editing ? (
          <div className="flex flex-col gap-md">
            {editState.pets.map((pet, i) => {
              // Newly added pets (only in editState, not yet in user.pets)
              // auto-expand so the user can fill them in. Existing pets
              // stay collapsed by default — two dogs would otherwise push
              // Profile visibility well below the fold. 2026-05-11 (C7b).
              const isNew = !user.pets.some((p) => p.id === pet.id);
              return (
                <PetEditCard
                  key={pet.id}
                  pet={pet}
                  defaultExpanded={isNew}
                  onChange={(updated) => {
                    const next = [...editState.pets];
                    next[i] = updated;
                    onEditChange({ pets: next });
                  }}
                  onDelete={() => {
                    onEditChange({
                      pets: editState.pets.filter((_, j) => j !== i),
                    });
                  }}
                />
              );
            })}
          </div>
        ) : user.pets.length > 0 ? (
          <div className="flex flex-col gap-md">
            {user.pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <p
            className="profile-card-copy text-fg-tertiary"
            style={{ marginTop: 8 }}
          >
            No dogs added yet.
          </p>
        )}
      </section>

      {/* Privacy + Tagging surface ABOVE the Connections list so settings
          don't sit below a scroll-heavy roster (Cross-Cutting Flow Testing
          tactical reorder, 2026-05-11). The deeper question — does the
          Connections list belong on the About tab at all? — is filed as
          Profiles Deep Pass E4 and decided there. */}

      {/* Profile visibility — view mode shows a compact summary card;
          edit mode reveals the full picker with descriptive helper text.
          Walked back from always-editable 2026-05-11 (C-extension) so
          the About tab feels compact in view mode and full options only
          appear when the user enters edit. Companion read-only signal
          lives on the hero (ProfileVisibilityChip).

          For Private profiles, the "About marking people Familiar"
          explainer card nests inside this section — Familiar is the
          mechanism for selectively opening a private profile, so it
          belongs with the visibility setting. Hidden for Public profiles
          per Action matrix v3 (2026-04-27): "Open viewers skip Familiar
          entirely (it's redundant)." */}
      <section>
        {/* Header + subheader bundle — stacked tight (no gap between
            them); subheader has its own height (24px) so it doesn't
            feel crammed against the h3. The section's flex-col gap
            (12px) provides spacing from this bundle to the picker
            below. 2026-05-11. */}
        <div>
          <SectionHeader title="Profile visibility" />
          {editing && (
            <p
              className="text-xs text-fg-tertiary"
              style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              Control who can see your full profile, posts, and dogs
            </p>
          )}
        </div>
        <ProfileVisibilitySetting
          value={profileVisibility}
          onChange={onProfileVisibilityChange}
          editing={editing}
        />

        {/* Familiar asymmetry explainer — persistent, low-key card teaching
            the most-misunderstood mechanic in the trust model: marking
            Familiar opens YOUR profile to them, not the other way around.
            Deniability-safe (only the actor sees this on their own
            profile). Moved here from the Connections section 2026-05-11
            since Familiar IS the visibility mechanism for Private
            profiles; gated on `profileVisibility === "locked"` so Public
            owners don't see explanation for a mechanic that doesn't apply
            to them. Onboarding & In-Product Communication phase will
            layer richer teaching. */}
        {profileVisibility === "locked" && (
          <div
            className="flex flex-col gap-sm rounded-panel"
            style={{
              background: "var(--surface-inset)",
              padding: "var(--space-lg)",
            }}
          >
            <div className="flex items-center gap-sm">
              <Eye size={18} weight="light" className="text-fg-secondary shrink-0" />
              <h4
                className="font-heading font-medium text-fg-primary m-0"
                style={{ fontSize: "var(--text-sm)" }}
              >
                About marking people Familiar
              </h4>
            </div>
            <p
              className="text-sm text-fg-secondary m-0"
              style={{ lineHeight: 1.5 }}
            >
              Marking someone Familiar opens <strong>your</strong> profile to
              them — not the other way around. They can see more of you next
              time they visit. It&apos;s silent — they&apos;re never told who
              marked them.
            </p>
            <Link
              href="/help/privacy#familiar"
              className="text-sm font-semibold text-fg-primary hover:text-brand-main"
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                alignSelf: "flex-start",
              }}
            >
              Learn more about how privacy works →
            </Link>
          </div>
        )}
      </section>

      {/* Tagging preferences — same view/edit split as Profile visibility. */}
      <section>
        <div>
          <SectionHeader title="Tagging preferences" />
          {editing && (
            <p
              className="text-xs text-fg-tertiary"
              style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              Control how others can tag you and your dogs in posts
            </p>
          )}
        </div>
        <TagApprovalSetting
          value={tagApproval}
          onChange={onTagApprovalChange}
          editing={editing}
        />
      </section>

      {/* Connections — Familiar explainer moved out 2026-05-11 to nest
          inside Profile visibility (Familiar IS the visibility mechanism;
          the teaching belongs with the setting). */}
      <section>
        <ConnectionsList viewerId={user.id} />
      </section>

      {/* Care CTAs — short row of paired actions. Description line under the
          header anchors the section purpose; buttons share the outline
          variant so they read as parallel choices, not primary-vs-link.
          Each button takes `flex-1` so the pair splits the row evenly;
          flex-wrap drops them to full-width on narrow viewports.
          Reframed 2026-05-11 (CCFT walkthrough). */}
      <section>
        <SectionHeader title="Care" />
        <p
          className="text-xs text-fg-tertiary"
          style={{
            marginTop: "-8px",
            marginBottom: "var(--space-lg)",
          }}
        >
          Find care for your dog from people you know, or set up your own.
        </p>
        {/* `grow basis-[140px]` over `flex-1` so the pair wraps to stacked
            full-width on tiny viewports (iPhone SE / 320px). With
            `flex-1` (basis 0%) + `.btn`'s `white-space: nowrap`, the
            buttons would compete for grow space + overflow the panel
            horizontally instead of wrapping. 2026-05-13 (PDP). */}
        <div className="flex flex-wrap gap-sm">
          <ButtonAction
            variant="secondary"
            size="md"
            href="/discover?tab=care"
            leftIcon={<MagnifyingGlass size={16} weight="light" />}
            className="grow basis-[140px]"
          >
            Find care
          </ButtonAction>
          {!user.openToHelping && (
            <ButtonAction
              variant="outline"
              size="md"
              href="/profile?tab=services"
              leftIcon={<Sparkle size={16} weight="light" />}
              className="grow basis-[140px]"
            >
              Offer care
            </ButtonAction>
          )}
          {user.openToHelping && (
            <ButtonAction
              variant="outline"
              size="md"
              href="/profile?tab=services"
              leftIcon={<CaretRight size={16} weight="light" />}
              className="grow basis-[140px]"
            >
              Manage your services
            </ButtonAction>
          )}
        </div>
      </section>
    </div>
  );
}
