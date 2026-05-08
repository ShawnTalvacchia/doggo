"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  CalendarBlank,
  ShareNetwork,
  CopySimple,
  PencilSimple,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
import { ProfileAboutTab } from "@/components/profile/ProfileAboutTab";
import { ProfileServicesTab } from "@/components/profile/ProfileServicesTab";
import { PostsTab } from "@/components/profile/PostsTab";
import { ProfileNameDropdown } from "@/components/profile/ProfileNameDropdown";
import type {
  PetProfile,
  CarerCareServiceConfig,
  UserProfile,
  CarerAvailabilitySlot,
  TagApproval,
} from "@/lib/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  // Every persona gets a shareable link; if the persona profile doesn't define
  // an explicit shareCode, fall back to the user ID as the slug. Mock World
  // Building can swap in nicer codes per persona later (`tereza-r4m2` etc.).
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

  // Edit state is per-tab so Save/Cancel can sit adjacent to the section being
  // edited (in the tab content) rather than in the hero. About and Services
  // edit independently — switching tabs does not auto-save.
  const [aboutEditing, setAboutEditing] = useState(false);
  const [servicesEditing, setServicesEditing] = useState(false);
  const currentUser = useCurrentUser();

  // Editable state (local, resets on refresh — prototype only)
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [editBio, setEditBio] = useState(user.bio);
  const [editPets, setEditPets] = useState<PetProfile[]>(user.pets);
  const [editVisibility, setEditVisibility] = useState(
    user.carerProfile?.publicProfile ?? false
  );
  const [editOpenToHelping, setEditOpenToHelping] = useState(
    user.openToHelping ?? false
  );
  // Edit UI is Care-only; Meet entries pass through unchanged on save.
  const [editServices, setEditServices] = useState<CarerCareServiceConfig[]>(
    (user.carerProfile?.services ?? []).filter(
      (s): s is CarerCareServiceConfig => s.kind === "care",
    ),
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

  // When the active persona changes (via the name dropdown or /demo), reset
  // the local editable state to the new user. Edits don't persist across
  // persona swaps in the prototype.
  useEffect(() => {
    setUser(currentUser);
    setEditBio(currentUser.bio);
    setEditPets(currentUser.pets);
    setEditVisibility(currentUser.carerProfile?.publicProfile ?? false);
    setEditOpenToHelping(currentUser.openToHelping ?? false);
    setEditServices(
      (currentUser.carerProfile?.services ?? []).filter(
        (s): s is CarerCareServiceConfig => s.kind === "care",
      ),
    );
    setEditAvailability(currentUser.carerProfile?.availability ?? []);
    setEditCarerBio(currentUser.carerProfile?.bio ?? "");
    setTagApproval(currentUser.tagApproval ?? "auto");
    setAboutEditing(false);
    setServicesEditing(false);
  }, [currentUser.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── About edit lifecycle ──
  function startAboutEdit() {
    setEditBio(user.bio);
    setEditPets(user.pets.map((p) => ({ ...p })));
    setAboutEditing(true);
  }
  function cancelAboutEdit() {
    setAboutEditing(false);
  }
  function saveAboutEdit() {
    setUser((prev) => ({
      ...prev,
      bio: editBio,
      pets: editPets,
    }));
    setAboutEditing(false);
  }

  // ── Services edit lifecycle ──
  function startServicesEdit() {
    setEditVisibility(user.carerProfile?.publicProfile ?? false);
    setEditOpenToHelping(user.openToHelping ?? false);
    setEditServices(
      (user.carerProfile?.services ?? [])
        .filter((s): s is CarerCareServiceConfig => s.kind === "care")
        .map((s) => ({ ...s })),
    );
    setEditAvailability(
      user.carerProfile?.availability.map((a) => ({ ...a, slots: [...a.slots] })) ?? [],
    );
    setEditCarerBio(user.carerProfile?.bio ?? "");
    setServicesEditing(true);
  }
  function cancelServicesEdit() {
    setServicesEditing(false);
  }
  function saveServicesEdit() {
    setUser((prev) => ({
      ...prev,
      openToHelping: editOpenToHelping,
      carerProfile: editOpenToHelping
        ? {
            bio: editCarerBio,
            location: prev.carerProfile?.location ?? prev.location,
            availability: editAvailability,
            // Care entries from the edit UI + any existing Meet entries
            // (managed elsewhere — see ProfileServicesTab comment).
            services: [
              ...editServices,
              ...(prev.carerProfile?.services ?? []).filter(
                (s) => s.kind === "meet",
              ),
            ],
            publicProfile: editVisibility,
          }
        : prev.carerProfile
          ? { ...prev.carerProfile, publicProfile: editVisibility }
          : undefined,
    }));
    setServicesEditing(false);
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
            {/* Hero section — identity only (avatar, name, location, share).
                Edit / Save / Cancel live inside each tab adjacent to the
                content being edited. */}
            <div
              className="flex flex-col items-center gap-md"
              style={{ padding: "var(--space-xl) var(--space-lg) var(--space-md)" }}
            >
              <img
                src={user.avatarUrl}
                alt={fullName}
                className="rounded-full object-cover"
                style={{ width: 96, height: 96 }}
              />
              <div className="flex flex-col items-center gap-xs text-center">
                {/* Demo-only persona switcher: tap the name to swap perspectives.
                    Wouldn't ship in the real product. */}
                <ProfileNameDropdown name={fullName} />
                <span className="flex items-center gap-xs text-sm text-fg-secondary">
                  <MapPin size={13} weight="fill" className="shrink-0" />
                  {user.location}
                </span>
                <span className="flex items-center gap-xs text-xs text-fg-tertiary">
                  <CalendarBlank size={13} weight="regular" className="shrink-0" />
                  Member since {formatMemberSince(user.memberSince)}
                </span>
              </div>

              {/* Page-level actions — Share + Edit are paired side-by-side
                  as the two things you can do with this profile from the
                  hero. Edit is hidden during the editing flow (Save /
                  Cancel take its place inside the tab body). */}
              <div className="flex flex-wrap items-center justify-center gap-sm">
                <ShareProfileButton shareCode={user.shareCode ?? user.id} />
                {!aboutEditing && (
                  <ButtonAction
                    variant="outline"
                    size="md"
                    leftIcon={<PencilSimple size={14} weight="bold" />}
                    onClick={startAboutEdit}
                  >
                    Edit Profile
                  </ButtonAction>
                )}
              </div>
            </div>

            {/* About tab content — bio, pets, connections, tagging */}
            <ProfileAboutTab
              user={user}
              editing={aboutEditing}
              onCancel={cancelAboutEdit}
              onSave={saveAboutEdit}
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
          <PostsTab userId={currentUser.id} isOwnProfile />
        )}

        {activeTab === "services" && (
          <ProfileServicesTab
            user={user}
            editing={servicesEditing}
            onStartEdit={startServicesEdit}
            onCancel={cancelServicesEdit}
            onSave={saveServicesEdit}
            visibility={
              servicesEditing ? editVisibility : (user.carerProfile?.publicProfile ?? false)
            }
            onToggleVisibility={() => setEditVisibility((v) => !v)}
            openToHelping={
              servicesEditing ? editOpenToHelping : (user.openToHelping ?? false)
            }
            onToggleOpenToHelping={(v) => setEditOpenToHelping(v)}
            editServices={editServices}
            onEditServices={setEditServices}
            editAvailability={editAvailability}
            onEditAvailability={setEditAvailability}
            editCarerBio={editCarerBio}
            onEditCarerBio={setEditCarerBio}
          />
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
