"use client";

import {
  Plus,
  MagnifyingGlass,
  Sparkle,
  CaretRight,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PetCard } from "./PetCard";
import { PetEditCard } from "./PetEditCard";
import { TagApprovalSetting } from "./TagApprovalSetting";
import { mockConnections, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import type { PetProfile, UserProfile, TagApproval } from "@/lib/types";

// ── Connections list (internal) ──────────────────────────────────────────────

function ConnectionsList() {
  const connected = mockConnections.filter((c) => c.state === "connected");
  const familiar = mockConnections.filter((c) => c.state === "familiar");
  const pending = mockConnections.filter((c) => c.state === "pending");

  if (connected.length === 0 && familiar.length === 0 && pending.length === 0) {
    return (
      <div className="flex flex-col items-center gap-sm p-lg text-center">
        <p className="text-sm text-fg-secondary">
          No connections yet. Attend a meet to start building your community.
        </p>
        <ButtonAction variant="primary" size="sm" cta href="/activity">
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
    <div className="profile-content-width profile-section-stack">
      {/* Bio */}
      <section className="profile-info-card">
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
      <section className="profile-info-card">
        <div className="flex items-center justify-between" style={{ marginBottom: editing ? 16 : 0 }}>
          <h3 className="profile-card-subtitle m-0">
            My dogs
          </h3>
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
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Connections</h3>
        <ConnectionsList />
      </section>

      {/* Tagging preferences */}
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Tagging preferences</h3>
        <p className="text-xs text-fg-tertiary" style={{ marginBottom: "var(--space-sm)" }}>
          Control how others can tag you and your dogs in posts
        </p>
        <TagApprovalSetting value={tagApproval} onChange={onTagApprovalChange} />
      </section>

      {/* Care CTAs */}
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Care</h3>
        <div className="flex flex-col gap-sm">
          <ButtonAction
            variant="outline"
            size="sm"
            href="/explore/results"
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
