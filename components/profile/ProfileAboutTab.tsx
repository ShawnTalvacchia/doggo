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
import { PetCard } from "./PetCard";
import { PetEditCard } from "./PetEditCard";
import { TagApprovalSetting } from "./TagApprovalSetting";
import { ProfileNameDropdown } from "./ProfileNameDropdown";
import { getCarerIdentity } from "@/lib/identityBadges";
import { getConnectionsForViewer, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import type { PetProfile, UserProfile, TagApproval } from "@/lib/types";

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

function ConnectionsList({ viewerId }: { viewerId: string }) {
  const myConnections = getConnectionsForViewer(viewerId);
  const connected = myConnections.filter((c) => c.state === "connected");
  const familiar = myConnections.filter((c) => c.state === "familiar");
  const pending = myConnections.filter((c) => c.state === "pending");

  if (connected.length === 0 && familiar.length === 0 && pending.length === 0) {
    return (
      <div className="flex flex-col items-center gap-sm p-lg text-center">
        <p className="text-sm text-fg-secondary">
          No connections yet. Attend a meet to start building your community.
        </p>
        <ButtonAction variant="primary" size="sm" cta href="/discover/meets">
          Browse Meets
        </ButtonAction>
      </div>
    );
  }

  const groups = [
    { label: "Connected", items: connected },
    { label: "Familiar", items: familiar },
    { label: "Pending", items: pending },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-md">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-xs">
          <span
            className="text-xs font-medium text-fg-tertiary uppercase"
            style={{ letterSpacing: "0.05em" }}
          >
            {group.label} ({group.items.length})
          </span>
          {group.items.map((conn) => (
            <div
              key={conn.id}
              className="flex items-center gap-md rounded-panel bg-surface-top p-sm"
            >
              <img
                src={conn.avatarUrl}
                alt={conn.userName}
                className="rounded-full shrink-0"
                style={{ width: 36, height: 36, objectFit: "cover" }}
              />
              <div className="flex flex-col flex-1">
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
          ))}
        </div>
      ))}
    </div>
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
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileAboutTab({
  user,
  editing,
  editState,
  onEditChange,
  tagApproval,
  onTagApprovalChange,
}: ProfileAboutTabProps) {
  return (
    <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
      {/* Hero — horizontal layout for parity with /profile/[userId]. */}
      <ProfileHero user={user} />

      {/* Bio */}
      <section>
        <h3 className="profile-card-subtitle">About me</h3>
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

      {/* Dogs */}
      <section>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: editing ? 16 : 0 }}
        >
          <h3 className="profile-card-subtitle m-0">My dogs</h3>
          {editing && (
            <ButtonAction
              variant="outline"
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
          )}
        </div>
        {editing ? (
          <div className="flex flex-col gap-md">
            {editState.pets.map((pet, i) => (
              <PetEditCard
                key={pet.id}
                pet={pet}
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
            ))}
          </div>
        ) : user.pets.length > 0 ? (
          <div className="flex flex-col gap-md" style={{ marginTop: 12 }}>
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

      {/* Connections */}
      <section>
        <h3 className="profile-card-subtitle">Connections</h3>
        <ConnectionsList viewerId={user.id} />
      </section>

      {/* Familiar asymmetry explainer — persistent, low-key card on the
          own-profile About tab. Teaches the most-misunderstood mechanic in
          the trust model: marking Familiar opens YOUR profile to them, not
          the other way around. Deniability-safe (only the actor sees this
          on their own profile). Onboarding & In-Product Communication
          phase, 2026-05-04. See [[Trust & Connection Model]] →
          "Connection States" → Familiar. */}
      <section className="profile-info-card">
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
      </section>

      {/* Tagging preferences */}
      <section>
        <h3 className="profile-card-subtitle">Tagging preferences</h3>
        <p
          className="text-xs text-fg-tertiary"
          style={{ marginBottom: "var(--space-sm)" }}
        >
          Control how others can tag you and your dogs in posts
        </p>
        <TagApprovalSetting value={tagApproval} onChange={onTagApprovalChange} />
      </section>

      {/* Care CTAs */}
      <section>
        <h3 className="profile-card-subtitle">Care</h3>
        <div className="flex flex-col gap-sm">
          <ButtonAction
            variant="outline"
            size="sm"
            href="/discover?tab=care"
            leftIcon={<MagnifyingGlass size={14} weight="light" />}
          >
            Find care from your network
          </ButtonAction>
          {!user.openToHelping && (
            <ButtonAction
              variant="tertiary"
              size="sm"
              href="/profile?tab=services"
              leftIcon={<Sparkle size={14} weight="light" />}
            >
              Want to help your neighbours? Set up care services
            </ButtonAction>
          )}
          {user.openToHelping && (
            <ButtonAction
              variant="tertiary"
              size="sm"
              href="/profile?tab=services"
              leftIcon={<CaretRight size={14} weight="light" />}
            >
              Manage your services
            </ButtonAction>
          )}
        </div>
      </section>
    </div>
  );
}
