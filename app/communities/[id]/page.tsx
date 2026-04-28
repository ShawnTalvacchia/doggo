"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { AddPostIcon } from "@/components/icons/AddPostIcon";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { LayoutList } from "@/components/layout/LayoutList";
import {
  MapPin,
  UsersThree,
  Lock,
  ShieldCheck,
  CaretDown,
  Check,
  UserPlus,
  Camera,
  CameraSlash,
  Prohibit,
  Plus,
  Storefront,
  MapPinLine,
  Images,
  CalendarBlank,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardMeet } from "@/components/meets/CardMeet";
import { PersonRow } from "@/components/people/PersonRow";
import { getGroupById, getGroupMeets } from "@/lib/mockGroups";
import { getPostsByGroup } from "@/lib/mockPosts";
import { getConnectionState } from "@/lib/mockConnections";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useMeetComposer } from "@/contexts/MeetComposerContext";

/* ── Tab config per group type ─────────────────────────────────── */

/**
 * Build the tab list for a group's detail page.
 *
 * Care groups follow `group.careConfig` — Events shows iff `eventsEnabled`,
 * Services shows iff `serviceListingsVisible`. The defaults (in
 * `mockGroups.ts → CARE_CONFIG_DEFAULTS`) are split by category so
 * event-driven providers (training, walking, venue) get Events but no
 * Services (each meet IS the service offering — would otherwise duplicate
 * the same content), and appointment-driven providers (grooming, rehab)
 * get Services but no Events (booking is a 1-on-1 time slot, not a
 * scheduled group event). Boarding shows both — meet-and-greets + stays.
 *
 * Updated 2026-04-27 — care groups previously showed both tabs always,
 * which created two surfaces selling the same thing for trainers and
 * walkers. The flags existed in `careConfig` but the UI ignored them.
 */
function getTabsForGroup(group: Group, hasPhotos: boolean) {
  const base = (() => {
    switch (group.groupType) {
      case "park":
        return [
          { key: "feed", label: "Feed" },
          { key: "meets", label: "Meets" },
          { key: "members", label: "Members" },
        ];
      case "care": {
        const cfg = group.careConfig;
        const tabs = [{ key: "feed", label: "Feed" }];
        if (cfg?.eventsEnabled !== false) tabs.push({ key: "events", label: "Events" });
        if (cfg?.serviceListingsVisible !== false) tabs.push({ key: "services", label: "Services" });
        tabs.push({ key: "members", label: "Members" });
        return tabs;
      }
      default: // neighbor, interest
        return [
          { key: "feed", label: "Feed" },
          { key: "meets", label: "Meets" },
          { key: "members", label: "Members" },
        ];
    }
  })();

  if (hasPhotos) {
    base.push({ key: "gallery", label: "Gallery" });
  }

  return base;
}

/** Care category display labels */
const CARE_CATEGORY_LABELS: Record<string, string> = {
  training: "Dog Trainer",
  walking: "Dog Walker",
  grooming: "Grooming Salon",
  boarding: "Boarding & Daycare",
  rehab: "Canine Rehabilitation",
  venue: "Dog-Friendly Venue",
  vet: "Vet Clinic",
  other: "Care Provider",
};

/* ── Page (with Suspense boundary for useSearchParams) ─────────── */

export default function GroupDetailPage() {
  return (
    <Suspense>
      <GroupDetailInner />
    </Suspense>
  );
}

function GroupDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawActiveTab = searchParams.get("tab") || "feed";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const { openComposer } = usePostComposer();
  const { openComposer: openMeetComposer } = useMeetComposer();
  const currentUserId = useCurrentUserId();

  const group = getGroupById(params.id as string);
  const [joinRequested, setJoinRequested] = useState(false);
  const [leaveMenuOpen, setLeaveMenuOpen] = useState(false);

  // Close leave menu on outside click + Escape (mirrors the meet RSVP menu)
  useEffect(() => {
    if (!leaveMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLeaveMenuOpen(false);
    }
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".group-leave-menu-wrap")) setLeaveMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [leaveMenuOpen]);

  if (!group) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Community not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/communities")}>
          Back to Communities
        </ButtonAction>
      </div>
    );
  }

  const groupMeets = getGroupMeets(group.id);
  const groupPosts = getPostsByGroup(group.id);
  const isMember = group.members.some((m) => m.userId === currentUserId);
  const isAdmin = group.members.some((m) => m.userId === currentUserId && m.role === "admin");
  const totalDogs = group.members.reduce((sum, m) => sum + m.dogNames.length, 0);
  const isCare = group.groupType === "care";
  const tabs = getTabsForGroup(group, group.photos.length > 0);
  // Fall back to the first available tab if the URL points to one that's
  // hidden by careConfig (e.g., a stale link to ?tab=services on a
  // training group, where Services is now suppressed). Otherwise the
  // TabBar would show no highlighted tab and the render switch would
  // skip every branch — orphan view.
  const visibleKeys = new Set(tabs.map((t) => t.key));
  const activeTab = visibleKeys.has(rawActiveTab) ? rawActiveTab : tabs[0]?.key ?? "feed";

  // Right action changes per tab
  const headerAction = isMember ? (() => {
    switch (activeTab) {
      case "meets":
      case "events":
        return (
          <ButtonAction variant="primary" size="sm" cta leftIcon={<Plus size={14} weight="bold" />} onClick={() => openMeetComposer({ groupId: group.id })}>
            Create
          </ButtonAction>
        );
      case "members":
        return (
          <ButtonAction variant="primary" size="sm" cta leftIcon={<UserPlus size={14} weight="bold" />}>
            Invite
          </ButtonAction>
        );
      default:
        return group.photoPolicy !== "none" ? (
          <ButtonIcon label="Create post" onClick={() => openComposer(group.id)}>
            <AddPostIcon size={28} />
          </ButtonIcon>
        ) : undefined;
    }
  })() : undefined;

  // Feed detail header into AppNav on mobile
  useEffect(() => {
    setDetailHeader(group.name, () => router.push("/home"), headerAction);
    return () => clearDetailHeader();
  }, [group.name, activeTab, isMember]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace(`/communities/${group.id}`, { scroll: false });
    } else {
      router.replace(`/communities/${group.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="group-detail-page">
      {/* ── Header (above panel on desktop, becomes mobile top bar) ── */}
      <DetailHeader backLabel="Back" title={group.name} rightAction={headerAction} />

      {/* ── Panel (rounded card container) ── */}
      <div className="group-detail-panel">

      {/* ── Scrollable tab content (tabs sticky inside for glassmorphism) ── */}
      <div className="group-detail-body">
        <div className="detail-tabs detail-tabs--scroll">
          <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
        </div>
        {activeTab === "feed" && (
          <FeedTab
            groupPosts={groupPosts}
            group={group}
            isMember={isMember}
            isAdmin={isAdmin}
            isCare={isCare}
            totalDogs={totalDogs}
            joinRequested={joinRequested}
            onJoinRequest={() => setJoinRequested(true)}
            leaveMenuOpen={leaveMenuOpen}
            onLeaveMenuToggle={() => setLeaveMenuOpen((v) => !v)}
            onLeave={() => setLeaveMenuOpen(false)}
          />
        )}

        {(activeTab === "meets" || activeTab === "events") && (
          <MeetsTab group={group} groupMeets={groupMeets} isCare={isCare} />
        )}

        {activeTab === "services" && isCare && (
          <ServicesTab group={group} />
        )}

        {activeTab === "members" && (
          <MembersTab group={group} />
        )}

        {activeTab === "gallery" && (
          <GalleryTab group={group} />
        )}

        <Spacer />
      </div>

      </div>{/* end group-detail-panel */}
    </div>
  );
}

/* ── Feed tab ──────────────────────────────────────────────────── */

import type { Group, Meet } from "@/lib/types";

interface FeedTabProps {
  groupPosts: ReturnType<typeof getPostsByGroup>;
  group: Group;
  isMember: boolean;
  isAdmin: boolean;
  isCare: boolean;
  totalDogs: number;
  joinRequested: boolean;
  onJoinRequest: () => void;
  /** Membership-action menu (Joined → ▾): open state + toggle callback. */
  leaveMenuOpen: boolean;
  onLeaveMenuToggle: () => void;
  /** Stub for now — closes the menu. Real "leave community" mutation lives
   *  in the future when membership state is mutable. */
  onLeave: () => void;
}

function FeedTab({ groupPosts, group, isMember, isAdmin, isCare, totalDogs, joinRequested, onJoinRequest, leaveMenuOpen, onLeaveMenuToggle, onLeave }: FeedTabProps) {
  return (
    <>
      {/* ── Banner + info (only in Feed tab) ── */}
      <div
        className="group-detail-banner"
        style={{ backgroundImage: `url(${group.coverPhotoUrl})` }}
      />

      <div className="group-detail-info">
        {/* Group name + badges */}
        <div className="flex items-center gap-sm flex-wrap">
          <h1 className="font-heading text-2xl font-medium text-fg-primary m-0">
            {group.name}
          </h1>
          {group.visibility !== "open" && (
            <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-base text-fg-secondary">
              {group.visibility === "private" ? (
                <><Lock size={10} weight="fill" /> Private</>
              ) : (
                <><ShieldCheck size={10} weight="fill" /> Approval required</>
              )}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-fg-secondary m-0">{group.description}</p>

        {/* Hosted by — care groups only */}
        {isCare && group.hostedByName && (
          <div className="flex items-center gap-md rounded-panel bg-surface-top p-md shadow-xs">
            <img
              src={group.hostedByAvatarUrl || group.members.find(m => m.userId === group.hostedBy)?.avatarUrl || ""}
              alt={group.hostedByName}
              className="rounded-full shrink-0 w-10 h-10 object-cover"
            />
            <div className="flex flex-col gap-xs flex-1">
              <div className="flex items-center gap-xs">
                <Storefront size={14} weight="fill" className="text-brand-main" />
                <span className="text-xs font-medium text-fg-tertiary">Hosted by</span>
              </div>
              <span className="text-sm font-semibold text-fg-primary">{group.hostedByName}</span>
              {group.careCategory && (
                <span className="text-xs text-fg-secondary">
                  {CARE_CATEGORY_LABELS[group.careCategory] || group.careCategory}
                </span>
              )}
            </div>
            <ButtonAction variant="outline" size="sm" href={`/profile/${group.hostedBy}`}>
              View profile
            </ButtonAction>
          </div>
        )}

        {/* Fixed location — care groups with address */}
        {isCare && group.locationFixed && (
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <MapPinLine size={14} weight="light" />
            {group.locationFixed}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-lg text-sm text-fg-tertiary flex-wrap">
          <span className="flex items-center gap-xs">
            <MapPin size={14} weight="light" />
            {group.neighbourhood}
          </span>
          <span className="flex items-center gap-xs">
            <UsersThree size={14} weight="light" />
            {group.members.length} members · {totalDogs} dogs
          </span>
          <span className="flex items-center gap-xs">
            {group.photoPolicy === "encouraged" ? (
              <><Camera size={14} weight="light" /> Photos encouraged</>
            ) : group.photoPolicy === "none" ? (
              <><Prohibit size={14} weight="light" /> No photos</>
            ) : (
              <><CameraSlash size={14} weight="light" /> Photos optional</>
            )}
          </span>
        </div>

        {/* Actions — full-width buttons.
            Variant matrix mirrors the meet detail page so meet + group
            actions speak the same visual vocabulary across the app:
            - committed state (Joined / Admin) → secondary (brand outline)
            - soft committed (Request sent) → neutral (filled, no border)
            - inactive entry action (Request to join / Join community) → primary
            - Invite (constant secondary) → outline (neutral border)
            See `app/meets/[id]/page.tsx` action row for the parallel. */}
        <div className="group-action-buttons">
          {isMember ? (
            <div className="group-leave-menu-wrap">
              <ButtonAction
                // Active membership state — brand-subtle (FB-style toggle).
                // Inactive (Join community / Request to join) uses primary
                // brand-fill below. Admin is also brand-subtle for parity
                // but disabled (admins can't trivially leave their group).
                variant="brand-subtle"
                size="md"
                cta
                leftIcon={isAdmin ? <ShieldCheck size={16} weight="fill" /> : <Check size={16} weight="bold" />}
                rightIcon={isAdmin ? undefined : <CaretDown size={12} weight="bold" />}
                onClick={isAdmin ? undefined : onLeaveMenuToggle}
                disabled={isAdmin}
              >
                {isAdmin ? "Admin" : "Joined"}
              </ButtonAction>
              {leaveMenuOpen && !isAdmin && (
                <div className="group-leave-menu" role="menu">
                  <button type="button" className="group-leave-menu-item" onClick={onLeave}>
                    Leave community
                  </button>
                </div>
              )}
            </div>
          ) : group.visibility === "approval" ? (
            <ButtonAction
              // Request sent → brand-subtle (active: your committed state,
              // awaiting acceptance). Request to join → neutral (inactive,
              // quiet — brand presence is reserved for the active state).
              variant={joinRequested ? "brand-subtle" : "neutral"}
              size="md"
              cta
              onClick={joinRequested ? undefined : onJoinRequest}
              disabled={joinRequested}
            >
              {joinRequested ? "Request sent" : "Request to join"}
            </ButtonAction>
          ) : (
            <ButtonAction variant="neutral" size="md" cta>
              Join community
            </ButtonAction>
          )}
          <ButtonAction variant="outline" size="md" cta leftIcon={<UserPlus size={16} weight="bold" />}>
            Invite
          </ButtonAction>
        </div>
      </div>

      {/* ── Posts ── */}
      {group.photoPolicy !== "none" && groupPosts.length > 0 ? (
        <div className="group-feed-list">
          {groupPosts.map((post) => (
            <MomentCardFromPost key={post.id} post={post} />
          ))}
        </div>
      ) : group.photoPolicy === "none" ? null : (
        <LayoutSection>
          <div className="flex flex-col items-center gap-md p-lg text-center">
            <p className="text-sm text-fg-secondary m-0">
              No posts yet. {isMember ? "Share a moment with the community!" : "Join to see and create posts."}
            </p>
          </div>
        </LayoutSection>
      )}
    </>
  );
}

/* ── Meets / Events tab ───────────────────────────────────────── */

function MeetsTab({ group, groupMeets, isCare }: { group: Group; groupMeets: Meet[]; isCare: boolean }) {
  const { openComposer: openMeetComposer } = useMeetComposer();
  const noun = isCare ? "events" : "meets";
  const nounSingular = isCare ? "event" : "meet";

  return (
    <div className="flex flex-col">
      {groupMeets.length > 0 ? (
        <LayoutList>
          {groupMeets.map((meet) => (
            <CardMeet key={meet.id} meet={meet} variant="group" />
          ))}
        </LayoutList>
      ) : (
        <LayoutSection>
          <EmptyState
            icon={<CalendarBlank size={48} weight="light" />}
            title={`No upcoming ${noun}`}
            subtitle={`Create one for the community!`}
            action={
              <ButtonAction variant="primary" size="sm" onClick={() => openMeetComposer({ groupId: group.id })}>
                Create {nounSingular}
              </ButtonAction>
            }
          />
        </LayoutSection>
      )}
    </div>
  );
}

/* ── Members tab ───────────────────────────────────────────────── */

function MembersTab({ group }: { group: Group }) {
  const currentUserId = useCurrentUserId();
  return (
    <LayoutSection>
      <div className="flex flex-col gap-sm">
        {group.members.map((member) => {
          const isYou = member.userId === currentUserId;
          const conn = getConnectionState(member.userId, currentUserId);
          const connectionState = conn?.state ?? "none";
          // Fallback context line for members with no dogs — keeps the row's
          // vertical proportions consistent with dog-having members. "Joined"
          // is more useful than nothing at all.
          const fallbackContext =
            member.dogNames.length === 0 && member.joinedAt
              ? `Joined ${new Date(member.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`
              : undefined;

          return (
            <PersonRow
              key={member.userId}
              variant="group-member"
              userId={member.userId}
              name={member.userName}
              avatarUrl={member.avatarUrl}
              isSelf={isYou}
              isAdmin={member.role === "admin"}
              pets={member.dogNames.map((name) => ({ name }))}
              contextLine={fallbackContext}
              connectionState={connectionState}
              theyMarkedFamiliar={conn?.theyMarkedFamiliar}
              profileOpen={conn?.profileOpen}
            />
          );
        })}
      </div>
    </LayoutSection>
  );
}

/* ── Services tab (care groups) ───────────────────────────────── */

function ServicesTab({ group }: { group: Group }) {
  const listings = group.serviceListings || [];

  if (listings.length === 0) {
    return (
      <LayoutSection>
        <EmptyState
          icon={<Storefront size={48} weight="light" />}
          title="No services listed yet"
          subtitle="This provider hasn't added their service menu."
        />
      </LayoutSection>
    );
  }

  return (
    <LayoutSection>
      <div className="flex flex-col gap-md">
        <h3 className="font-heading text-xs font-medium text-fg-secondary m-0">
          Services
        </h3>
        {listings.filter(s => s.active).map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-sm rounded-panel bg-surface-top p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-md">
              <div className="flex flex-col gap-xs flex-1">
                <span className="text-sm font-semibold text-fg-primary">{service.title}</span>
                <span className="text-xs text-fg-secondary">{service.description}</span>
              </div>
              <div className="flex flex-col items-end gap-xs shrink-0">
                <span className="text-sm font-semibold text-fg-primary">
                  {service.priceFrom} Kč
                </span>
                <span className="text-xs text-fg-tertiary">{service.priceUnit}</span>
              </div>
            </div>
            {service.bookingHref && (
              <ButtonAction variant="primary" size="sm" href={service.bookingHref}>
                Book
              </ButtonAction>
            )}
          </div>
        ))}
      </div>
    </LayoutSection>
  );
}

/* ── Gallery tab (care groups) ───────────────────────────────── */

function GalleryTab({ group }: { group: Group }) {
  const photos = group.photos || [];
  const mode = group.galleryMode || "standard";

  if (photos.length === 0) {
    return (
      <LayoutSection>
        <EmptyState
          icon={<Images size={48} weight="light" />}
          title="No photos yet"
          subtitle="Photos from events and updates will appear here."
        />
      </LayoutSection>
    );
  }

  return (
    <LayoutSection>
      <div className="flex flex-col gap-md">
        {mode === "portfolio" ? (
          /* Portfolio mode: 2-column before/after style grid */
          <div className="grid grid-cols-2 gap-sm">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-panel overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                {i % 2 === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-pill bg-black/60 text-white text-xs px-sm py-xs">
                    Before
                  </span>
                )}
                {i % 2 === 1 && (
                  <span className="absolute bottom-1 left-1 rounded-pill bg-brand-main text-white text-xs px-sm py-xs">
                    After
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : mode === "updates" ? (
          /* Updates mode: date-grouped chronological feed */
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-sm">
              <span className="text-xs font-medium text-fg-tertiary">Today</span>
              <div className="grid grid-cols-3 gap-xs">
                {photos.slice(0, Math.min(3, photos.length)).map((photo, i) => (
                  <div key={i} className="aspect-square rounded-sm overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            {photos.length > 3 && (
              <div className="flex flex-col gap-sm">
                <span className="text-xs font-medium text-fg-tertiary">Earlier this week</span>
                <div className="grid grid-cols-3 gap-xs">
                  {photos.slice(3).map((photo, i) => (
                    <div key={i} className="aspect-square rounded-sm overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard mode: simple grid */
          <div className="grid grid-cols-3 gap-xs">
            {photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-sm overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutSection>
  );
}

