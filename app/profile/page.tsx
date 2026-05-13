"use client";

import { Suspense, useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
import { ProfileAboutTab } from "@/components/profile/ProfileAboutTab";
import { ProfileServicesTab } from "@/components/profile/ProfileServicesTab";
import { PostsTab } from "@/components/profile/PostsTab";
import { usePageHeader } from "@/contexts/PageHeaderContext";
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
  // edited (in the AppNav page-action slot) rather than in the hero or tab
  // body. About and Services edit independently — switching tabs while in
  // edit mode is prevented by hiding the TabBar (full lock-in until Save
  // or Cancel). 2026-05-11 (A6).
  const [aboutEditing, setAboutEditing] = useState(false);
  const [servicesEditing, setServicesEditing] = useState(false);
  const currentUser = useCurrentUser();
  const { setPageAction, clearPageAction } = usePageHeader();
  const isEditing = aboutEditing || servicesEditing;

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
  const startAboutEdit = useCallback(() => {
    setEditBio(user.bio);
    setEditPets(user.pets.map((p) => ({ ...p })));
    setAboutEditing(true);
  }, [user]);
  const cancelAboutEdit = useCallback(() => {
    setAboutEditing(false);
  }, []);
  const saveAboutEdit = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      bio: editBio,
      pets: editPets,
    }));
    setAboutEditing(false);
  }, [editBio, editPets]);

  // ── Services edit lifecycle ──
  const startServicesEdit = useCallback(() => {
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
  }, [user]);
  const cancelServicesEdit = useCallback(() => {
    setServicesEditing(false);
  }, []);
  const saveServicesEdit = useCallback(() => {
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
  }, [editOpenToHelping, editCarerBio, editAvailability, editServices, editVisibility]);

  // ── AppNav page-action slot ──
  //
  // Per tab + edit state, declares the contextual primary action shown
  // in the AppNav (in place of the default Camera+ create icon). When
  // editing, also flips navLockedIn so Bell + Inbox hide — the user
  // must Save or Cancel to leave the page. Posts tab suppresses the
  // create icon entirely since "+ New post" lives in-panel. 2026-05-11.
  const pageActionNode = useMemo(() => {
    if (activeTab === "posts") return null;
    const editing = activeTab === "about" ? aboutEditing : servicesEditing;
    const onStart = activeTab === "about" ? startAboutEdit : startServicesEdit;
    const onCancel = activeTab === "about" ? cancelAboutEdit : cancelServicesEdit;
    const onSave = activeTab === "about" ? saveAboutEdit : saveServicesEdit;
    if (editing) {
      return (
        <div className="flex items-center gap-sm">
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<X size={14} weight="bold" />}
            onClick={onCancel}
          >
            Cancel
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="sm"
            leftIcon={<Check size={14} weight="bold" />}
            onClick={onSave}
          >
            Save
          </ButtonAction>
        </div>
      );
    }
    return (
      <ButtonAction
        variant="outline"
        size="sm"
        leftIcon={<PencilSimple size={14} weight="bold" />}
        onClick={onStart}
      >
        Edit
      </ButtonAction>
    );
  }, [
    activeTab,
    aboutEditing,
    servicesEditing,
    startAboutEdit,
    cancelAboutEdit,
    saveAboutEdit,
    startServicesEdit,
    cancelServicesEdit,
    saveServicesEdit,
  ]);

  useEffect(() => {
    if (activeTab === "posts") {
      setPageAction(null, { suppressCreate: true });
    } else {
      setPageAction(pageActionNode, { navLockedIn: isEditing });
    }
    return () => clearPageAction();
  }, [activeTab, isEditing, pageActionNode, setPageAction, clearPageAction]);

  return (
    <PageColumn title="Profile" headerAction={pageActionNode}>
      <div className="page-column-panel-body">
        {/* TabBar hides during edit mode — pairs with AppNav navLockedIn
            so the user can't tab-switch or escape mid-edit (full lock-in
            until Save or Cancel commits). 2026-05-11 (A6). */}
        {!isEditing && (
          <div className="page-column-panel-tabs">
            <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        )}

        {activeTab === "about" && (
          /* About tab content — hero (avatar, name, location, member-since,
             share button) leads the body, then bio + pets + connections +
             tagging + care section. Hero moved into ProfileAboutTab
             2026-05-11 (walkthrough B1) for layout parity with
             `/profile/[userId]`. */
          <ProfileAboutTab
            user={user}
            editing={aboutEditing}
            editState={{ bio: editBio, pets: editPets }}
            onEditChange={(updates) => {
              if (updates.bio !== undefined) setEditBio(updates.bio);
              if (updates.pets !== undefined) setEditPets(updates.pets);
            }}
            tagApproval={tagApproval}
            onTagApprovalChange={setTagApproval}
            profileVisibility={user.profileVisibility ?? "locked"}
            onProfileVisibilityChange={(v) =>
              setUser((prev) => ({ ...prev, profileVisibility: v }))
            }
          />
        )}

        {activeTab === "posts" && (
          <PostsTab userId={currentUser.id} isOwnProfile />
        )}

        {activeTab === "services" && (
          <ProfileServicesTab
            user={user}
            editing={servicesEditing}
            visibility={
              servicesEditing ? editVisibility : (user.carerProfile?.publicProfile ?? false)
            }
            onToggleVisibility={(v) => setEditVisibility(v)}
            openToHelping={
              servicesEditing ? editOpenToHelping : (user.openToHelping ?? false)
            }
            onToggleOpenToHelping={(v) => setEditOpenToHelping(v)}
            onUnlockProfile={() =>
              setUser((prev) => ({ ...prev, profileVisibility: "open" }))
            }
            editServices={editServices}
            onEditServices={setEditServices}
            editAvailability={editAvailability}
            onEditAvailability={setEditAvailability}
            editCarerBio={editCarerBio}
            onEditCarerBio={setEditCarerBio}
            onStartEdit={startServicesEdit}
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
