"use client";

import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from "react";
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
  CarerServiceConfig,
  CarerMeetServiceConfig,
  UserProfile,
  CarerAvailabilitySlot,
  TagApproval,
} from "@/lib/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { mockMeets, syncMeetLinksForService } from "@/lib/mockMeets";

const TABS = [
  { key: "about", label: "About" },
  { key: "posts", label: "Posts" },
  { key: "services", label: "Services" },
];

/**
 * Snapshot the meet-side `linkedServices[].required` flags into a flat map
 * keyed `${serviceId}::${meetId}`. The per-link `required` flag lives on the
 * Meet (not the service), so the Services-tab editor carries it as companion
 * edit state — see `editMeetLinks`. Service ↔ Meet Linkage, Workstream B.
 */
function buildMeetLinks(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const meet of mockMeets) {
    for (const link of meet.linkedServices ?? []) {
      map[`${link.serviceId}::${meet.id}`] = link.required;
    }
  }
  return map;
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
  // All carer service kinds (Care / Meet / Appointment) are editable in one
  // place — the Services tab edit. Service ↔ Meet Linkage, Workstream B
  // (2026-05-13). Previously this held Care only; Meet entries were a
  // pass-through on save and Appointment entries were silently dropped.
  const [editServices, setEditServices] = useState<CarerServiceConfig[]>(
    user.carerProfile?.services ?? [],
  );
  // Companion edit state for the per-link `required` flag, which lives on the
  // Meet (`Meet.linkedServices[].required`), not the service. Keyed
  // `${serviceId}::${meetId}`. Flushed to `mockMeets` on Save via
  // `syncMeetLinksForService`; dropped (no flush) on Cancel.
  const [editMeetLinks, setEditMeetLinks] = useState<Record<string, boolean>>(
    buildMeetLinks,
  );
  // Meet-type service ids present when the edit session started — lets Save
  // reconcile meet links for services that were hard-deleted mid-edit (their
  // id is gone from `editServices` but their stale `linkedServices` entries
  // on meets still need clearing).
  const meetServiceIdsAtEditStart = useRef<string[]>([]);
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
    setEditServices(currentUser.carerProfile?.services ?? []);
    setEditMeetLinks(buildMeetLinks());
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
    setEditServices((user.carerProfile?.services ?? []).map((s) => ({ ...s })));
    setEditMeetLinks(buildMeetLinks());
    meetServiceIdsAtEditStart.current = (user.carerProfile?.services ?? [])
      .filter((s) => s.kind === "meet")
      .map((s) => s.id);
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
    // Drop completely-empty Meet / Appointment cards — a "+ Session offering"
    // or "+ Appointment" added this session that the carer never filled in
    // (no title, no price, no notes, no linked meets) shouldn't persist as a
    // service. A card with *any* content entered is kept. 2026-05-17.
    const cleanedServices = editServices.filter((svc) => {
      if (svc.kind === "meet") {
        const empty =
          !svc.title.trim() &&
          svc.pricePerSession === 0 &&
          !(svc.notes ?? "").trim() &&
          svc.linkedMeetIds.length === 0;
        return !empty;
      }
      if (svc.kind === "appointment") {
        const empty =
          !svc.title.trim() &&
          svc.pricePerAppointment === 0 &&
          !(svc.notes ?? "").trim();
        return !empty;
      }
      return true;
    });

    // Flush the two-sided Service ↔ Meet linkage into `mockMeets`. The service
    // owns `linkedMeetIds`; the Meet owns the per-link `required` flag. Sync
    // every Meet-type service touched this edit session:
    //  - live service        → mirror its `linkedMeetIds` + required flags
    //  - soft-archived        → drop all meet links (service stays for
    //                           booking resolution but advertises nowhere)
    //  - hard-deleted mid-edit → drop all meet links (id no longer in
    //                           `editServices`; recovered via the snapshot)
    const liveMeetServices = new Map<string, CarerMeetServiceConfig>();
    for (const svc of cleanedServices) {
      if (svc.kind === "meet") liveMeetServices.set(svc.id, svc);
    }
    const touchedMeetServiceIds = new Set<string>([
      ...meetServiceIdsAtEditStart.current,
      ...liveMeetServices.keys(),
    ]);
    for (const svcId of touchedMeetServiceIds) {
      const svc = liveMeetServices.get(svcId);
      if (svc && !svc.softDeletedAt) {
        const requiredByMeet: Record<string, boolean> = {};
        for (const meetId of svc.linkedMeetIds) {
          requiredByMeet[meetId] =
            editMeetLinks[`${svcId}::${meetId}`] ?? false;
        }
        syncMeetLinksForService(svcId, svc.linkedMeetIds, requiredByMeet);
      } else {
        syncMeetLinksForService(svcId, [], {});
      }
    }
    setUser((prev) => ({
      ...prev,
      openToHelping: editOpenToHelping,
      carerProfile: editOpenToHelping
        ? {
            bio: editCarerBio,
            location: prev.carerProfile?.location ?? prev.location,
            availability: editAvailability,
            // Comprehensive catalogue — Care, Meet, and Appointment entries
            // all authored in one place now (Service ↔ Meet Linkage B).
            // Empty never-filled Meet/Appointment cards dropped above.
            services: cleanedServices,
            publicProfile: editVisibility,
          }
        : prev.carerProfile
          ? { ...prev.carerProfile, publicProfile: editVisibility }
          : undefined,
    }));
    setServicesEditing(false);
  }, [editOpenToHelping, editCarerBio, editAvailability, editServices, editMeetLinks, editVisibility]);

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
            editMeetLinks={editMeetLinks}
            onEditMeetLinks={setEditMeetLinks}
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
