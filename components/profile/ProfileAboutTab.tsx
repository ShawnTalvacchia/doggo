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
import { getConnectionsForViewer, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
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
      size="md"
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
          <div className="flex items-center gap-sm flex-wrap justify-center sm:justify-start">
            <ProfileNameDropdown name={fullName} />
            {carerBadge && (
              <span className="person-row-pill person-row-pill--carer">
                {carerBadge.label}
              </span>
            )}
            {/* Profile visibility chip — self-view only, mirrors the
                GroupVisibilityChip pattern so the privacy-disclosure
                language stays consistent across the app. Defaults to
                Locked when `profileVisibility` is undefined (the spec
                default). Cross-Cutting Flow Testing 2026-05-11. */}
            <ProfileVisibilityChip
              visibility={user.profileVisibility ?? "locked"}
            />
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

function ConnectionRow({
  conn,
}: {
  conn: ReturnType<typeof getConnectionsForViewer>[number];
}) {
  return (
    <div className="flex items-center gap-md rounded-panel bg-surface-top p-sm">
      <img
        src={conn.avatarUrl}
        alt={conn.userName}
        className="rounded-full shrink-0"
        style={{ width: 36, height: 36, objectFit: "cover" }}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-fg-primary">
          {conn.userName}
        </span>
        <span className="text-xs text-fg-tertiary">
          {conn.dogNames.join(", ")} · {conn.location}
        </span>
      </div>
      <span
        className="text-xs font-medium rounded-pill px-sm py-xs"
        style={{
          background:
            conn.state === "connected"
              ? "var(--brand-subtle)"
              : "var(--surface-gray)",
          color:
            conn.state === "connected"
              ? "var(--brand-strong)"
              : "var(--text-secondary)",
        }}
      >
        {CONNECTION_STATE_LABELS[conn.state]}
      </span>
    </div>
  );
}

// Modal-only — used inside the ModalSheet to render the uncapped grouped
// list. The in-tab summary uses `ConnectionGroupCard` (below) instead.
function ConnectionGroup({
  label,
  items,
}: {
  label: string;
  items: ReturnType<typeof getConnectionsForViewer>;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <span
        className="text-xs font-medium text-fg-tertiary uppercase"
        style={{ letterSpacing: "0.05em" }}
      >
        {label} ({items.length})
      </span>
      {items.map((conn) => (
        <ConnectionRow key={conn.id} conn={conn} />
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
    return (
      <>
        <SectionHeader title="Connections" />
        <div className="flex flex-col items-start gap-sm">
          <p className="text-sm text-fg-secondary m-0">
            No connections yet. Attend a meet to start building your community.
          </p>
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
        <div className="flex flex-wrap gap-sm">
          <ButtonAction
            variant="secondary"
            size="md"
            href="/discover?tab=care"
            leftIcon={<MagnifyingGlass size={16} weight="light" />}
            className="flex-1"
          >
            Find care
          </ButtonAction>
          {!user.openToHelping && (
            <ButtonAction
              variant="outline"
              size="md"
              href="/profile?tab=services"
              leftIcon={<Sparkle size={16} weight="light" />}
              className="flex-1"
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
              className="flex-1"
            >
              Manage your services
            </ButtonAction>
          )}
        </div>
      </section>
    </div>
  );
}
