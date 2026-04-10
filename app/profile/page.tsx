"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { ProfileHeaderOwn } from "@/components/profile/ProfileHeaderOwn";
import { ProfileAboutTab } from "@/components/profile/ProfileAboutTab";
import { ProfileServicesTab } from "@/components/profile/ProfileServicesTab";
import { PostsTab } from "@/components/profile/PostsTab";
import type {
  PetProfile,
  CarerServiceConfig,
  UserProfile,
  CarerAvailabilitySlot,
  TagApproval,
} from "@/lib/types";
import { mockUser } from "@/lib/mockUser";

// ── Types ────────────────────────────────────────────────────────────────────

type ProfileTab = "about" | "posts" | "services";

// ── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onTabChange,
  variant,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  variant?: "desktop";
}) {
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "about", label: "About" },
    { key: "posts", label: "Posts" },
    { key: "services", label: "Services" },
  ];
  return (
    <div
      className={`profile-tabs${variant === "desktop" ? " profile-tabs-desktop" : ""}`}
      role="tablist"
      aria-label="Profile sections"
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeTab === key}
          className={`profile-tab${activeTab === key ? " active" : ""}`}
          onClick={() => onTabChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <main className="profile-page-shell">
      <section className="profile-page-panel">
        <div className="profile-fixed-top">
          <div className="flex gap-sm p-md">
            <div
              className="skeleton skeleton-circle shrink-0"
              style={{ width: 64, height: 64 }}
            />
            <div className="flex-1 grid gap-xs content-center">
              <div
                className="skeleton skeleton-text"
                style={{ width: "60%", height: 18 }}
              />
              <div
                className="skeleton skeleton-text"
                style={{ width: "40%", height: 14 }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Main profile page ─────────────────────────────────────────────────────────

function ProfileInner() {
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as ProfileTab) ?? "about";
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [editing, setEditing] = useState(false);

  // Editable state (local, resets on refresh — prototype only)
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [editBio, setEditBio] = useState(user.bio);
  const [editPets, setEditPets] = useState<PetProfile[]>(user.pets);
  const [editVisibility, setEditVisibility] = useState(
    user.carerProfile?.publicProfile ?? false
  );
  const [editOpenToHelping, setEditOpenToHelping] = useState(
    user.openToHelping ?? false
  );
  const [editServices, setEditServices] = useState<CarerServiceConfig[]>(
    user.carerProfile?.services ?? []
  );
  const [editAvailability, setEditAvailability] = useState<CarerAvailabilitySlot[]>(
    user.carerProfile?.availability ?? []
  );
  const [editCarerBio, setEditCarerBio] = useState(
    user.carerProfile?.bio ?? ""
  );
  const [tagApproval, setTagApproval] = useState<TagApproval>(
    user.tagApproval ?? "auto"
  );


  function startEditing() {
    setEditBio(user.bio);
    setEditPets(user.pets.map((p) => ({ ...p })));
    setEditVisibility(user.carerProfile?.publicProfile ?? false);
    setEditOpenToHelping(user.openToHelping ?? false);
    setEditServices(user.carerProfile?.services.map((s) => ({ ...s })) ?? []);
    setEditAvailability(user.carerProfile?.availability.map((a) => ({ ...a, slots: [...a.slots] })) ?? []);
    setEditCarerBio(user.carerProfile?.bio ?? "");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveEditing() {
    setUser((prev) => ({
      ...prev,
      bio: editBio,
      pets: editPets,
      openToHelping: editOpenToHelping,
      carerProfile: editOpenToHelping
        ? {
            bio: editCarerBio,
            location: prev.carerProfile?.location ?? prev.location,
            availability: editAvailability,
            services: editServices,
            publicProfile: editVisibility,
          }
        : prev.carerProfile
          ? { ...prev.carerProfile, publicProfile: editVisibility }
          : undefined,
    }));
    setEditing(false);
  }

  const activeContent =
    activeTab === "about" ? (
      <ProfileAboutTab
        user={user}
        editing={editing}
        editState={{ bio: editBio, pets: editPets }}
        onEditChange={(updates) => {
          if (updates.bio !== undefined) setEditBio(updates.bio);
          if (updates.pets !== undefined) setEditPets(updates.pets);
        }}
        tagApproval={tagApproval}
        onTagApprovalChange={setTagApproval}
      />
    ) : activeTab === "posts" ? (
      <PostsTab userId="shawn" isOwnProfile />
    ) : (
      <>
        <ProfileServicesTab
          user={user}
          editing={editing}
          visibility={
            editing ? editVisibility : (user.carerProfile?.publicProfile ?? false)
          }
          onToggleVisibility={() => setEditVisibility((v) => !v)}
          openToHelping={editing ? editOpenToHelping : (user.openToHelping ?? false)}
          onToggleOpenToHelping={(v) => setEditOpenToHelping(v)}
          editServices={editServices}
          onEditServices={setEditServices}
          editAvailability={editAvailability}
          onEditAvailability={setEditAvailability}
          editCarerBio={editCarerBio}
          onEditCarerBio={setEditCarerBio}
        />
        {/* Reviews section — merged into services tab */}
        <div className="profile-content-width profile-section-stack" style={{ marginTop: "var(--space-xl)" }}>
          <section className="profile-info-card">
            <h3 className="profile-card-subtitle">Reviews</h3>
            <p className="profile-card-copy text-fg-secondary">
              No reviews yet. Reviews will appear here once you complete bookings.
            </p>
          </section>
        </div>
      </>
    );

  return (
    <PageColumn hideHeader>
      <div className="page-column-panel-body">
        <ProfileHeaderOwn
          user={user}
          state="expanded"
          editing={editing}
          onEdit={startEditing}
          onSave={saveEditing}
          onCancel={cancelEditing}
        />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeContent}
      </div>
    </PageColumn>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileInner />
    </Suspense>
  );
}
