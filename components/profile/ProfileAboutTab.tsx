"use client";

import Link from "next/link";
import {
  Plus,
  MagnifyingGlass,
  Sparkle,
  CaretRight,
  Eye,
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PetCard } from "./PetCard";
import { PetEditCard } from "./PetEditCard";
import { TagApprovalSetting } from "./TagApprovalSetting";
import { getConnectionsForViewer, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import type { PetProfile, UserProfile, TagApproval } from "@/lib/types";

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

// ── Edit chrome (form actions while editing) ────────────────────────────────
//
// Renders only during edit mode — Save + Cancel are form-level actions tied
// to the section being edited, so they live inside the tab body. The
// "Edit Profile" entry-point button lives in the page hero alongside
// "Share Profile" (page-level actions cluster). When not editing, this
// block renders nothing.

function EditChrome({
  editing,
  onCancel,
  onSave,
}: {
  editing: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (!editing) return null;
  return (
    <div className="flex justify-end gap-sm">
      <ButtonAction
        variant="outline"
        size="md"
        leftIcon={<X size={14} weight="bold" />}
        onClick={onCancel}
      >
        Cancel
      </ButtonAction>
      <ButtonAction
        variant="primary"
        size="md"
        leftIcon={<Check size={14} weight="bold" />}
        onClick={onSave}
      >
        Save
      </ButtonAction>
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ProfileAboutTabProps {
  user: UserProfile;
  editing: boolean;
  onCancel: () => void;
  onSave: () => void;
  editState: { bio: string; pets: PetProfile[] };
  onEditChange: (updates: Partial<{ bio: string; pets: PetProfile[] }>) => void;
  tagApproval: TagApproval;
  onTagApprovalChange: (value: TagApproval) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileAboutTab({
  user,
  editing,
  onCancel,
  onSave,
  editState,
  onEditChange,
  tagApproval,
  onTagApprovalChange,
}: ProfileAboutTabProps) {
  return (
    <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
      <EditChrome
        editing={editing}
        onCancel={onCancel}
        onSave={onSave}
      />

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
