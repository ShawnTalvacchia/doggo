"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  CalendarBlank,
  PencilSimple,
  Check,
  X,
  ShareNetwork,
  CopySimple,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
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

const TABS = [
  { key: "about", label: "About" },
  { key: "posts", label: "Posts" },
  { key: "services", label: "Services" },
];

/* ── Helpers ── */

function formatMemberSince(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function ShareProfileButton({ shareCode }: { shareCode: string }) {
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
      leftIcon={copied ? <CopySimple size={14} weight="bold" /> : <ShareNetwork size={14} weight="light" />}
      onClick={handleCopy}
    >
      {copied ? "Copied!" : "Share Profile"}
    </ButtonAction>
  );
}

/* ── Page ── */

function ProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "about";

  const handleTabChange = useCallback((key: string) => {
    if (key === "about") {
      router.replace("/profile", { scroll: false });
    } else {
      router.replace(`/profile?tab=${key}`, { scroll: false });
    }
  }, [router]);

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

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <PageColumn title="Profile">
      <div className="page-column-panel-body">
        <div className="page-column-panel-tabs">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        {activeTab === "about" && (
          <>
            {/* Hero section — avatar, name, location, actions */}
            <div className="flex flex-col items-center gap-md" style={{ padding: "var(--space-xl) var(--space-lg) var(--space-md)" }}>
              <img
                src={user.avatarUrl}
                alt={fullName}
                className="rounded-full object-cover"
                style={{ width: 96, height: 96 }}
              />
              <div className="flex flex-col items-center gap-xs text-center">
                <h1 className="font-heading text-xl font-semibold text-fg-primary m-0">{fullName}</h1>
                <span className="flex items-center gap-xs text-sm text-fg-secondary">
                  <MapPin size={13} weight="fill" className="shrink-0" />
                  {user.location}
                </span>
                <span className="flex items-center gap-xs text-xs text-fg-tertiary">
                  <CalendarBlank size={13} weight="regular" className="shrink-0" />
                  Member since {formatMemberSince(user.memberSince)}
                </span>
              </div>

              {/* Edit / Save / Cancel */}
              <div className="flex gap-sm">
                {editing ? (
                  <>
                    <ButtonAction variant="outline" size="md"
                      leftIcon={<X size={14} weight="bold" />}
                      onClick={cancelEditing}>
                      Cancel
                    </ButtonAction>
                    <ButtonAction variant="primary" size="md"
                      leftIcon={<Check size={14} weight="bold" />}
                      onClick={saveEditing}>
                      Save
                    </ButtonAction>
                  </>
                ) : (
                  <>
                    <ButtonAction variant="outline" size="md"
                      leftIcon={<PencilSimple size={14} weight="bold" />}
                      onClick={startEditing}>
                      Edit Profile
                    </ButtonAction>
                    {user.shareCode && <ShareProfileButton shareCode={user.shareCode} />}
                  </>
                )}
              </div>
            </div>

            {/* About tab content — bio, pets, connections, tagging */}
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
          </>
        )}

        {activeTab === "posts" && (
          <PostsTab userId="shawn" isOwnProfile />
        )}

        {activeTab === "services" && (
          <>
            <ProfileServicesTab
              user={user}
              editing={editing}
              visibility={editing ? editVisibility : (user.carerProfile?.publicProfile ?? false)}
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
            <div className="profile-content-width profile-section-stack" style={{ marginTop: "var(--space-xl)" }}>
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">Reviews</h3>
                <p className="profile-card-copy text-fg-secondary">
                  No reviews yet. Reviews will appear here once you complete bookings.
                </p>
              </section>
            </div>
          </>
        )}

        <Spacer />
      </div>
    </PageColumn>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div />}>
      <ProfileInner />
    </Suspense>
  );
}
