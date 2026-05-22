"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { Toggle } from "@/components/ui/Toggle";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { LayoutList } from "@/components/layout/LayoutList";
import {
  MapPin,
  UsersThree,
  ShieldCheck,
  CaretDown,
  Check,
  Lock,
  ArrowRight,
  UserPlus,
  Camera,
  CameraSlash,
  Prohibit,
  Plus,
  Storefront,
  MapPinLine,
  Images,
  CalendarBlank,
  CalendarPlus,
  CaretRight,
} from "@phosphor-icons/react";
import { CameraPlusFill } from "@/components/icons/CameraPlusFill";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardMeet } from "@/components/meets/CardMeet";
import { PersonRow } from "@/components/people/PersonRow";
import {
  SectionHeader,
  MetaDivider,
} from "@/components/people/PersonSections";
import { PrivateProfileRow } from "@/components/people/PrivateProfileRow";
import { GroupVisibilityChip } from "@/components/groups/GroupVisibilityChip";
import { RequestToJoinModal } from "@/components/groups/RequestToJoinModal";
import { GroupInviteSheet } from "@/components/groups/GroupInviteSheet";
import { getGroupById, getGroupMeets } from "@/lib/mockGroups";
import { getPostsByGroup } from "@/lib/mockPosts";
import { getConnectionState } from "@/lib/mockConnections";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { getUserById } from "@/lib/mockUsers";
import { getCarerIdentity, type CarerIdentity } from "@/lib/identityBadges";
import { useCurrentUserId, useIsGuest } from "@/hooks/useCurrentUser";
import { useAuthGate } from "@/contexts/AuthGateContext";
import type { ConnectionState, GroupMember } from "@/lib/types";
import type { PersonAction } from "@/lib/personActions";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useMeetComposer } from "@/contexts/MeetComposerContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { isFireOffPostHidden } from "@/lib/walkthroughBeats";

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
        if (cfg?.eventsEnabled !== false) tabs.push({ key: "meets", label: "Meets" });
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

/** Truncate a bio to its first two sentences. Splits on `. ` so periods
 *  inside abbreviations don't create false sentence boundaries — close
 *  enough for prose. Returns the original string if it has ≤2 sentences. */
function firstTwoSentences(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const parts = text.split(/(?<=\.)\s+/);
  if (parts.length <= 2) return text;
  return parts.slice(0, 2).join(" ");
}

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
  const isGuest = useIsGuest();
  const { requireAuth } = useAuthGate();
  const { addNotification, notifications } = useNotifications();
  const wt = useWalkthrough();

  const group = getGroupById(params.id as string);
  const [joinRequested, setJoinRequested] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [leaveMenuOpen, setLeaveMenuOpen] = useState(false);
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [invitedUserIds, setInvitedUserIds] = useState<Set<string>>(new Set());

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

  const groupMeets = getGroupMeets(group.id, currentUserId);
  // Hide any walkthrough fire-off post the tester hasn't "Shared" yet — so
  // the post a fire-off card is about to share isn't already in the feed.
  // Only gates during an active walkthrough; free-explore shows the seeded
  // post normally. 2026-05-22.
  const groupPosts = getPostsByGroup(group.id).filter(
    (p) => !isFireOffPostHidden(p.id, wt.active, wt.sharedPostIds),
  );

  // Invite a connection to this group: record it for the row's "Invited"
  // state and fire a `group_invite` notification to them. Deterministic
  // notification id so re-inviting the same person upserts rather than
  // stacking duplicate rows.
  const handleInvite = (userId: string) => {
    setInvitedUserIds((prev) => new Set(prev).add(userId));
    const inviter = getUserById(currentUserId);
    addNotification({
      id: `notif-ginvite-${group.id}-${userId}`,
      recipientId: userId,
      type: "group_invite",
      actorId: currentUserId,
      title: `${inviter?.firstName ?? "Someone"} invited you to ${group.name}`,
      body: "Tap to see the group and join.",
      avatarUrl: inviter?.avatarUrl,
      href: `/communities/${group.id}`,
    });
  };
  // Guests have no membership identity — even if `currentUserId` resolves to
  // Tereza (the read-only display fallback), a guest visitor isn't actually
  // her, so they aren't a member or admin of any group. Forcing both flags
  // false is what makes the FeedTab render the "Join community" action row
  // (with a guest-mode AuthGate trigger) and the MembersTab fall to the
  // public-info view. Demo Presentation D3, 2026-05-05.
  // Optimistic open-group join — flips local state so "Join community"
  // doesn't feel like a dead-end in the prototype. Approval-only groups
  // route through `joinRequested` + the request-to-join modal; open
  // groups have no approval step, so a single state flip is enough.
  // Pre-existing gap — wired during CCFT E4.4 verification (2026-05-11).
  const [joinedOpenOptimistic, setJoinedOpenOptimistic] = useState(false);
  const isMember = !isGuest && (group.members.some((m) => m.userId === currentUserId) || joinedOpenOptimistic);
  const isAdmin = !isGuest && group.members.some((m) => m.userId === currentUserId && m.role === "admin");
  // Private groups are invite-only. The viewer counts as invited iff they
  // hold a group_invite notification for this group (`notifications` is
  // already filtered to the current viewer). Gates the Join CTA: invited →
  // enabled "Join community"; not invited → locked "Invite only". For
  // open/approval groups this is irrelevant (their own CTAs apply). During
  // the walkthrough, Daniel's invite fires before he reaches the group, so
  // he's invited; in free-explore a non-invited viewer sees the lock. 2026-05-22.
  const isInvitedToThisGroup = notifications.some(
    (n) => n.type === "group_invite" && n.href === `/communities/${group.id}`,
  );
  // First-admin lookup for the join-request modal copy ("[Admin] will
  // review your request"). Falls back to "the admin" so the modal still
  // reads coherently when no admin is seeded (system-generated park
  // groups). 2026-05-11 join-flow redesign.
  const primaryAdmin = group.members.find((m) => m.role === "admin");
  const adminName = primaryAdmin?.userName ?? "the admin";
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

  // Right action changes per tab. Guests see no header action — the
  // primary "Sign up to join" CTA in the action-buttons row is the single
  // entry point; cluttering the header with a gated icon would dilute it.
  //
  // Header-action convention (2026-05-11, Cross-Cutting Flow Testing):
  // outline + sm + leftIcon + text, no `cta` (rectangular). Reserves
  // brand-filled pills for row CTAs (Message, Connect, Join) so the
  // hierarchy reads clearly. See `design-system.md` → "Header actions."
  // Per-tab leftIcon (CCFT E4 follow-up, 2026-05-11). The earlier
  // implementation used `<Plus>` everywhere — Feed and Meets read
  // identically on mobile (where the CSS strips chrome + text and renders
  // icon-only), even though the actions diverge. Domain-specific icons:
  // camera+ for Feed (matches /home Feed precedent), calendar+ for Meets,
  // user+ for Members. Width forced to 14px to match the existing Plus
  // sizing; mobile CSS scales the svg to 28px regardless.
  const headerAction = (isMember && !isGuest) ? (() => {
    switch (activeTab) {
      case "meets":
        return (
          <ButtonAction variant="outline" size="sm" leftIcon={<CalendarPlus size={14} weight="bold" />} onClick={() => openMeetComposer({ groupId: group.id })}>
            Create
          </ButtonAction>
        );
      case "members":
        return (
          <ButtonAction variant="outline" size="sm" leftIcon={<UserPlus size={14} weight="bold" />} onClick={() => setInviteSheetOpen(true)}>
            Invite
          </ButtonAction>
        );
      default:
        return group.photoPolicy !== "none" ? (
          <ButtonAction variant="outline" size="sm" leftIcon={<CameraPlusFill size={14} />} onClick={() => openComposer({ groupId: group.id })}>
            Post
          </ButtonAction>
        ) : undefined;
    }
  })() : undefined;

  // Feed detail header into AppNav on mobile. Guests don't have a /home
  // surface to fall back to — back goes to the landing page. When a tour is
  // active, defer to browser history so the user lands back at the previous
  // tour step (with overlay still active) instead of being silently kicked
  // out of the tour by a hardcoded /home navigation. PO note 2026-05-05.
  useEffect(() => {
    setDetailHeader(
      group.name,
      () => {
        if (typeof window !== "undefined" && window.location.search.includes("tour=")) {
          router.back();
          return;
        }
        router.push(isGuest ? "/" : "/home");
      },
      headerAction,
    );
    return () => clearDetailHeader();
  }, [group.name, activeTab, isMember, isGuest]); // eslint-disable-line react-hooks/exhaustive-deps

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
            isInvited={isInvitedToThisGroup}
            adminName={adminName}
            onJoinRequest={() => {
              // Visibility-aware dispatch:
              //   guest        → AuthGate (cross-visibility)
              //   approval     → request-to-join modal (captures optional
              //                  context note for the admin)
              //   open         → flip `joinedOpenOptimistic` → isMember=true
              //                  (one-tap, no approval step)
              //   private      → flip to member too. Private groups are
              //                  reachable only via invite, so a viewer on
              //                  this page already has one; "Join community"
              //                  accepts it. (Previously set `joinRequested`,
              //                  which had no visible effect for private — the
              //                  button is "Join community", not "Request" —
              //                  so the click looked dead. 2026-05-22.)
              // Join-flow redesign 2026-05-11; open-group flip added CCFT
              // E4.4 walkthrough iteration.
              if (isGuest) return requireAuth("join this community");
              if (group.visibility === "approval") return setJoinModalOpen(true);
              setJoinedOpenOptimistic(true);
            }}
            leaveMenuOpen={leaveMenuOpen}
            onLeaveMenuToggle={() => setLeaveMenuOpen((v) => !v)}
            onLeave={() => setLeaveMenuOpen(false)}
            onOpenInvite={() => setInviteSheetOpen(true)}
            isGuest={isGuest}
            onGuestAction={requireAuth}
          />
        )}

        {activeTab === "meets" && (
          <MeetsTab group={group} groupMeets={groupMeets} isGuest={isGuest} onGuestAction={requireAuth} />
        )}

        {activeTab === "services" && isCare && (
          <ServicesTab group={group} />
        )}

        {activeTab === "members" && (
          <MembersTab group={group} isGuest={isGuest} isMember={isMember} />
        )}

        {activeTab === "gallery" && (
          <GalleryTab group={group} />
        )}

        <Spacer />
      </div>

      </div>{/* end group-detail-panel */}

      {/* Request-to-join modal — approval-only groups. The helper line under
          the Join CTA teaches the system passively; this modal captures an
          optional context note when the user commits, so the admin sees more
          than a blind request. Mock-only: clicking Send flips `joinRequested`
          locally; admin-side notification + approval queue is filed as
          follow-up work in `features/community.md`. */}
      <RequestToJoinModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        groupName={group.name}
        adminName={adminName}
        onSubmit={() => {
          // Note text is captured by the modal's state but not persisted
          // anywhere yet — the demo doesn't have an admin-side queue to
          // surface it on. The note shape lives in the modal for when that
          // pipeline lands.
          setJoinRequested(true);
          setJoinModalOpen(false);
        }}
      />

      {/* Invite sheet — opened from either Invite affordance (Members-tab
          header action + the hero action row). Lists the viewer's
          connections; inviting one fires a group_invite notification. */}
      <GroupInviteSheet
        open={inviteSheetOpen}
        onClose={() => setInviteSheetOpen(false)}
        group={group}
        viewerId={currentUserId}
        invitedUserIds={invitedUserIds}
        onInvite={handleInvite}
      />
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
  /** Whether the current viewer holds an invite to this (private) group.
   *  Gates the Join CTA between enabled "Join community" and locked
   *  "Invite only". 2026-05-22. */
  isInvited: boolean;
  /** First admin's display name. Powers the join-flow helper line + the
   *  request-to-join modal copy. Resolves to "the admin" when no admin
   *  is seeded (system-generated park groups). 2026-05-11. */
  adminName: string;
  onJoinRequest: () => void;
  /** Membership-action menu (Joined → ▾): open state + toggle callback. */
  leaveMenuOpen: boolean;
  onLeaveMenuToggle: () => void;
  /** Stub for now — closes the menu. Real "leave community" mutation lives
   *  in the future when membership state is mutable. */
  onLeave: () => void;
  /** Open the group invite sheet (non-guest viewers). */
  onOpenInvite: () => void;
  /** True iff the viewer is a logged-out guest. Demo Presentation D3, 2026-05-05. */
  isGuest: boolean;
  /** Open the AuthGate prompt with a contextual action label. */
  onGuestAction: (label: string) => void;
}

/**
 * Resolve the join-flow helper line beneath the action button row.
 *
 * Pairs with `GroupVisibilityChip` in the hero — the chip describes the
 * group's privacy state at a glance; this line teaches the *behaviour* of
 * the Join CTA in context (or, for members, gives ambient privacy
 * reassurance about what the group means). Empty string skips the line.
 *
 * 2026-05-11 join-flow redesign. See `features/community.md` →
 * "Join flow + privacy disclosure."
 */
function getJoinHelperText(args: {
  visibility: Group["visibility"];
  isMember: boolean;
  isAdmin: boolean;
  joinRequested: boolean;
  isInvited: boolean;
  adminName: string;
}): string {
  const { visibility, isMember, isAdmin, joinRequested, isInvited, adminName } = args;
  if (isAdmin) {
    if (visibility === "open") return "";
    if (visibility === "approval") return "New members reviewed by you";
    return "Members-only — content stays in the group";
  }
  if (isMember) {
    if (visibility === "open") return "";
    if (visibility === "approval") return "New members reviewed by admin";
    return "Members-only — content stays in the group";
  }
  if (visibility === "open") return "Anyone can join — no approval needed";
  if (visibility === "approval") {
    return joinRequested
      ? `Awaiting ${adminName}'s response`
      : `${adminName} will review your request`;
  }
  // Private + non-member: gated on whether the viewer holds an invite.
  if (isInvited) return "You've been invited — join anytime";
  return "Private group — members join by invite";
}

function FeedTab({ groupPosts, group, isMember, isAdmin, isCare, totalDogs, joinRequested, isInvited, adminName, onJoinRequest, leaveMenuOpen, onLeaveMenuToggle, onLeave, onOpenInvite, isGuest, onGuestAction }: FeedTabProps) {
  const joinHelperText = getJoinHelperText({
    visibility: group.visibility,
    isMember,
    isAdmin,
    joinRequested,
    isInvited,
    adminName,
  });
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
          <GroupVisibilityChip visibility={group.visibility} />
        </div>

        {/* Description */}
        <p className="text-sm text-fg-secondary m-0">{group.description}</p>

        {/* Provider hero — care groups only. Single-provider: avatar + name +
            category + tagline. Multi-provider: avatar stack + combined name +
            category, tagline omitted (one bio doesn't represent the team).
            Discover & Care B1/B3, 2026-05-02. See [[Groups & Care Model]] →
            Care Group Admin Model → Group hero anatomy. */}
        {isCare && group.providers && group.providers.length > 0 && (() => {
          const primary = group.providers[0];
          const provider = getUserById(primary.userId);
          const isMulti = group.providers.length > 1;
          const tagline = isMulti ? null : firstTwoSentences(provider?.carerProfile?.bio);
          const categoryLabel = group.careCategory
            ? CARE_CATEGORY_LABELS[group.careCategory] || group.careCategory
            : null;
          const visibleStack = group.providers.slice(0, 3);
          const overflow = group.providers.length - visibleStack.length;
          const nameLine = (() => {
            if (group.providers.length === 1) return primary.name;
            if (group.providers.length === 2) return `${primary.name}, ${group.providers[1].name}`;
            return `${primary.name} + ${group.providers.length - 1} others`;
          })();
          return (
            <div className="provider-hero">
              <div className="provider-hero-body">
                {isMulti ? (
                  <div className="flex shrink-0 -space-x-sm">
                    {visibleStack.map((p) => (
                      <img
                        key={p.userId}
                        src={p.avatarUrl || group.members.find(m => m.userId === p.userId)?.avatarUrl || ""}
                        alt={p.name}
                        className="rounded-full w-10 h-10 object-cover border-2 border-surface-base"
                      />
                    ))}
                    {overflow > 0 && (
                      <div className="rounded-full w-10 h-10 bg-surface-inset border-2 border-surface-base flex items-center justify-center text-xs font-semibold text-fg-secondary">
                        +{overflow}
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={primary.avatarUrl || group.members.find(m => m.userId === primary.userId)?.avatarUrl || ""}
                    alt={primary.name}
                    className="rounded-full shrink-0 w-12 h-12 object-cover"
                  />
                )}
                <div className="flex flex-col gap-xs flex-1 min-w-0">
                  <div className="flex items-center gap-sm flex-wrap">
                    <span className="text-sm font-semibold text-fg-primary">
                      {nameLine}
                    </span>
                    {categoryLabel && (
                      <span className="feed-card-provider-badge">
                        <Storefront size={11} weight="fill" />
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                  {tagline && (
                    <p className="text-sm text-fg-secondary m-0" style={{ lineHeight: 1.4 }}>
                      {tagline}
                    </p>
                  )}
                </div>
              </div>
              <ButtonAction
                variant="tertiary"
                size="sm"
                href={`/profile/${primary.userId}`}
                rightIcon={<CaretRight size={14} weight="bold" />}
                className="provider-hero-cta"
              >
                View profile
              </ButtonAction>
            </div>
          );
        })()}

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
          ) : group.visibility === "private" && !isInvited ? (
            // Private + no invite: locked, no join path. Private groups are
            // invite-only; without an invite there's nothing to act on.
            <ButtonAction
              variant="neutral"
              size="md"
              cta
              disabled
              leftIcon={<Lock size={15} weight="bold" />}
            >
              Invite only
            </ButtonAction>
          ) : (
            <ButtonAction
              variant="neutral"
              size="md"
              cta
              onClick={isGuest ? () => onGuestAction("join this community") : onJoinRequest}
            >
              Join community
            </ButtonAction>
          )}
          <ButtonAction
            variant="outline"
            size="md"
            cta
            leftIcon={<UserPlus size={16} weight="bold" />}
            onClick={isGuest ? () => onGuestAction("invite friends") : onOpenInvite}
          >
            Invite
          </ButtonAction>
        </div>

        {/* Join-flow helper line — teaches the system at the moment of action.
            Pairs with GroupVisibilityChip in the hero: the chip names the
            privacy state; this line explains what the Join CTA will do (or,
            for members, gives ambient privacy reassurance about what the
            group is). Empty string skips the line entirely so open groups
            with members don't carry a redundant cue. 2026-05-11. */}
        {joinHelperText && (
          <p
            className="text-xs text-fg-tertiary m-0"
            style={{ marginTop: "var(--space-xs)" }}
          >
            {joinHelperText}
          </p>
        )}
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

/* ── Meets tab ───────────────────────────────────────── */

function MeetsTab({
  group,
  groupMeets,
  isGuest,
  onGuestAction,
}: {
  group: Group;
  groupMeets: Meet[];
  isGuest: boolean;
  onGuestAction: (label: string) => void;
}) {
  const { openComposer: openMeetComposer } = useMeetComposer();
  // Unified "meets" terminology app-wide 2026-04-27 — care groups
  // previously used "events" framing for tab + copy, but the data
  // model is `Meet` everywhere and the dual naming created drift.
  // Care providers can still use formal language in their meet titles.
  const noun = "meets";
  const nounSingular = "meet";

  const handleCreate = isGuest
    ? () => onGuestAction(`create a ${nounSingular}`)
    : () => openMeetComposer({ groupId: group.id });

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
              <ButtonAction variant="primary" size="sm" onClick={handleCreate}>
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

/**
 * Group Members tab — section-grouped by role + relationship state, mirroring
 * the People tab pattern (`ParticipantList`):
 *
 *   ADMINS (all role==="admin", regardless of connection state)
 *   ── MetaDivider ──
 *   CONNECTED (non-admin, viewer pinned to top)
 *   FAMILIAR (non-admin, outbound state)
 *   [other tier-1/2 non-admin, unlabeled — preserves deniability for inbound
 *     theyMarkedFamiliar marks]
 *   PRIVATE PROFILES chip list (non-admin tier-3)
 *
 * Action availability: Members tab does NOT gate on past meet attendance.
 * Group co-membership is the context signal — users recognise each other
 * from real-world meetings or from group context itself. Each row gets
 * matrix-resolved actions ("auto"); the row's pill renders one inline CTA
 * adapted to the relationship state (no right-side action buttons —
 * `PersonRow`'s `group-member` variant suppresses them). The People tab
 * still gates on attendance (warm-moment context); Members tab is the
 * softer, persistent action surface. See `Trust & Connection Model.md` →
 * Meet participant visibility rules for the full split.
 */

interface TieredMember extends GroupMember {
  tier: 1 | 2 | 3;
  connectionState: ConnectionState;
  theyMarkedFamiliar?: boolean;
  profileOpen?: boolean;
  rowActions: PersonAction[] | "auto";
  /** Carer identity badge — info-blue pill, two variants (open / circle).
   *  Resolved per-viewer; circle variant is Connected-only by privacy
   *  rule. Discover Refinement walkthrough decision, 2026-05-10. */
  carerBadge?: CarerIdentity;
}

/** Headline service summary for a member who offers care — powers the
 *  Members-tab service footer (gated behind the "Show members' services"
 *  toggle). Returns the first enabled bookable service (care or appointment)
 *  as a label + from-price, or null if the member offers none. Meet-type
 *  services (sessions) are skipped — they aren't a "book a slot" shape.
 *  2026-05-22. */
function getMemberServiceSummary(
  userId: string,
): { label: string; price: number; count: number } | null {
  const services = getUserById(userId)?.carerProfile?.services ?? [];
  // Total enabled services — drives "See all N services" so the footer hints
  // there's more than the one headline service shown.
  const count = services.filter((s) => s.enabled).length;
  for (const s of services) {
    if (s.kind === "care" && s.enabled) {
      const price =
        s.deliveryOptions && s.deliveryOptions.length > 0
          ? Math.min(...s.deliveryOptions.map((o) => o.price))
          : s.pricePerUnit;
      return { label: SERVICE_LABELS[s.serviceType], price, count };
    }
    if (s.kind === "appointment" && s.enabled) {
      return { label: s.title, price: s.pricePerAppointment, count };
    }
  }
  return null;
}

function MembersTab({ group, isGuest, isMember }: { group: Group; isGuest: boolean; isMember: boolean }) {
  const viewerId = useCurrentUserId();
  const {
    getConnection: getConnectionFromContext,
    markFamiliar,
    unmarkFamiliar,
  } = useConnections();
  // Local session marks — drive the per-row "✓ Familiar | Undo" footer for
  // marks just made on this page visit. Declared above the guest-mode early
  // return so hook order stays stable when isGuest flips. Resets on remount
  // (navigation away and back). Actual relationship persists via
  // ConnectionsContext separately. Mock World Building 2026-04-30.
  const [localMarks, setLocalMarks] = useState<Record<string, "familiar" | "connect">>({});
  // "Show members' services" toggle — default off so the roster reads as a
  // member list, not a marketplace. When on, members who offer care get a
  // service footer on their card. Members-only (co-membership is the
  // visibility grant); resets on remount. 2026-05-22.
  const [showServices, setShowServices] = useState(false);

  // Guests see a flat list — no sectioning by relationship state, no row
  // actions. Members visibility is open content; relationship-tier UI would
  // wrongly imply the guest has connections to compute against. Demo
  // Presentation D3, 2026-05-05.
  if (isGuest) {
    return (
      <LayoutSection>
        <section className="flex flex-col gap-md">
          <SectionHeader label={`${group.members.length} members`} />
          <div className="flex flex-col gap-sm">
            {group.members.map((m) => (
              <PersonRow
                key={m.userId}
                variant="group-member"
                userId={m.userId}
                name={m.userName}
                avatarUrl={m.avatarUrl}
                pets={m.dogNames.map((name) => ({ name }))}
                connectionState="none"
                actions={[]}
              />
            ))}
          </div>
        </section>
      </LayoutSection>
    );
  }

  const handleAdvance = (memberId: string) => {
    setLocalMarks((prev) => {
      const current = prev[memberId];
      const next = current === "familiar" ? "connect" : "familiar";
      // When advancing TO Familiar (no current mark), persist via context.
      // The Connect step is wired separately when that flow is built.
      if (!current) markFamiliar(viewerId, memberId);
      return { ...prev, [memberId]: next };
    });
  };

  const handleDowngrade = (memberId: string) => {
    setLocalMarks((prev) => ({ ...prev, [memberId]: "familiar" }));
  };

  const handleUndoMark = (memberId: string) => {
    setLocalMarks((prev) => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });
    // Reverse the persisted mark too — Undo means undo, not just clear the footer.
    unmarkFamiliar(viewerId, memberId);
  };

  // Resolve tier + action gating per member. Same shape as
  // ParticipantList's tier() — duplicated rather than extracted because the
  // member shape differs slightly (Group.members vs Meet.attendees) and the
  // logic is small.
  const tier = (m: GroupMember): TieredMember => {
    const isSelf = m.userId === viewerId;
    // Pull connection from the context — overlays session overrides on the
    // static `mockConnections` lookup so marks made via this tab (or any
    // other surface that drives ConnectionsContext) reflect immediately.
    const conn = getConnectionFromContext(m.userId, viewerId);
    const baseState: ConnectionState = isSelf ? "connected" : (conn?.state ?? "none");
    // Apply session marks — local Familiar/Connect ladder state overrides
    // the underlying connection state when present. PersonRow's mark prop
    // separately drives the body button label + footer; this state is so
    // the matrix correctly resolves the next-step actions (e.g. Connect
    // becomes available once Familiar is marked).
    const localMark = localMarks[m.userId];
    const state: ConnectionState =
      localMark && baseState === "none" ? "familiar" : baseState;
    const theyMarkedFamiliar = conn?.theyMarkedFamiliar;
    // `profileOpen` falls back to the subject's UserProfile.profileVisibility
    // when the connection record doesn't carry it. Without this fallback,
    // viewers with no prior connection record (e.g. Daniel viewing Shawn,
    // who they've never interacted with) get profileOpen=undefined → matrix
    // defaults false → Connect path never surfaces even when the subject is
    // openly discoverable.
    const subject = getUserById(m.userId);
    const profileOpen =
      conn?.profileOpen ?? subject?.profileVisibility === "open";

    // Tier rules: self = tier 1; Connected = tier 1; Pending / inbound
    // theyMarkedFamiliar / Open subject = tier 2; everything else = tier 3.
    //
    // **Outbound state="familiar" alone does NOT promote.** The viewer
    // marking a subject Familiar is an outbound grant — the marker opens up
    // to the marked person, but the viewer's view of the SUBJECT is
    // unchanged. So a Locked subject the viewer marked Familiar stays
    // tier 3 (still appears in PRIVATE PROFILES with a "Familiar ✓" pill,
    // not promoted to a full card). See `Trust & Connection Model.md` →
    // "What the Familiar mark does (and does not do)".
    let memberTier: 1 | 2 | 3;
    if (isSelf || state === "connected") {
      memberTier = 1;
    } else if (state === "pending" || theyMarkedFamiliar || profileOpen) {
      memberTier = 2;
    } else {
      memberTier = 3;
    }

    // Group co-membership IS the context signal — Members tab doesn't gate
    // on past meet attendance. Reasoning: users recognise each other from
    // real-world meetings (outside the platform) or from group context
    // itself, and gating on platform attendance is overly strict. The
    // People tab still gates (warm-moment context); Members tab is a
    // softer, persistent action surface. Self-row always info-only.
    const rowActions: PersonAction[] | "auto" = isSelf ? [] : "auto";

    // Carer identity badge — info-blue pill ("Carer") with two variants.
    // Open variant (publicProfile: true) shows to everyone; circle variant
    // (publicProfile: false) only renders when viewer is Connected (or is
    // self) per the privacy rule. Replaces the retired Helper/Provider
    // tier pill with a single noun + audience-encoding visual.
    // Discover Refinement walkthrough decision, 2026-05-10.
    const viewerIsConnected = isSelf || state === "connected";
    const carerBadge = getCarerIdentity(subject, viewerIsConnected);

    return {
      ...m,
      tier: memberTier,
      connectionState: state,
      theyMarkedFamiliar,
      profileOpen,
      rowActions,
      carerBadge,
    };
  };

  const tiered = group.members.map(tier);

  // Admins go in their own section regardless of connection state — role is
  // its own grouping axis. Non-admins partition by tier + connection state.
  const admins = tiered.filter((m) => m.role === "admin");
  const nonAdmins = tiered.filter((m) => m.role !== "admin");

  const connected = nonAdmins.filter((m) => m.connectionState === "connected");
  // FAMILIAR section is for outbound marks where the subject is also visible
  // to the viewer (tier !== 3). A locked member the viewer marked Familiar
  // but who hasn't reciprocated stays in PRIVATE PROFILES (their content is
  // still locked) — the "Familiar ✓" pill in the compact row is the visual
  // confirmation that the mark took effect. Mock World Building 2026-04-30.
  const familiarOutbound = nonAdmins.filter(
    (m) => m.connectionState === "familiar" && m.tier !== 3,
  );
  const otherTier12 = nonAdmins.filter(
    (m) =>
      m.tier !== 3 &&
      m.connectionState !== "connected" &&
      m.connectionState !== "familiar",
  );
  const locked = nonAdmins.filter((m) => m.tier === 3);

  // Pin viewer to top of the connected subsection.
  connected.sort((a, b) => {
    if (a.userId === viewerId) return -1;
    if (b.userId === viewerId) return 1;
    return 0;
  });

  const renderRow = (m: TieredMember) => {
    const fallbackContext =
      m.dogNames.length === 0 && m.joinedAt
        ? `Joined ${new Date(m.joinedAt).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          })}`
        : undefined;
    // Service footer (toggle-gated): a fellow member who offers care gets a
    // headline-service + from-price bar rendered INSIDE their card via
    // PersonRow's `footer` slot (not a nested card), with a link into their
    // profile's Services tab where the booking happens. Self is excluded.
    // 2026-05-22.
    const serviceSummary =
      showServices && m.userId !== viewerId
        ? getMemberServiceSummary(m.userId)
        : null;
    return (
      <PersonRow
        key={m.userId}
        variant="group-member"
        userId={m.userId}
        name={m.userName}
        avatarUrl={m.avatarUrl}
        isSelf={m.userId === viewerId}
        // `isAdmin` intentionally omitted — admins always render under the
        // ADMINS section header in this view, so a per-card pill is
        // redundant. The PersonRow `isAdmin` prop stays available for
        // surfaces that don't section-group.
        pets={m.dogNames.map((name) => ({ name }))}
        contextLine={fallbackContext}
        connectionState={m.connectionState}
        theyMarkedFamiliar={m.theyMarkedFamiliar}
        profileOpen={m.profileOpen}
        carerBadge={m.carerBadge}
        actions={m.rowActions}
        mark={localMarks[m.userId] ?? null}
        onAdvance={() => handleAdvance(m.userId)}
        onDowngradeMark={() => handleDowngrade(m.userId)}
        onUndoMark={() => handleUndoMark(m.userId)}
        footerClassName="person-row-footer--service"
        footer={
          serviceSummary ? (
            <>
              <span className="text-sm text-fg-secondary">
                {serviceSummary.label} · from {serviceSummary.price.toLocaleString()} Kč
              </span>
              <Link
                href={`/profile/${m.userId}?tab=services`}
                className="inline-flex items-center gap-tiny text-sm font-semibold text-info-strong shrink-0"
              >
                {serviceSummary.count > 1
                  ? `See all ${serviceSummary.count} services`
                  : "See services"}
                <ArrowRight size={13} weight="bold" aria-hidden="true" />
              </Link>
            </>
          ) : undefined
        }
      />
    );
  };

  // Any fellow member offering care? Gates the "Show members' services"
  // toggle — no point showing it for a circle where nobody offers anything.
  const hasAnyMemberServices = group.members.some(
    (m) => m.userId !== viewerId && getMemberServiceSummary(m.userId) !== null,
  );

  const showAdmins = admins.length > 0;
  const showConnected = connected.length > 0;
  const showFamiliar = familiarOutbound.length > 0;
  const showOther = otherTier12.length > 0;
  const showLocked = locked.length > 0;

  // MetaDivider between Admins and the rest if both groups have content —
  // signals "different grouping axis" (role vs relationship).
  const showAdminsDivider =
    showAdmins && (showConnected || showFamiliar || showOther || showLocked);

  return (
    <LayoutSection>
      <section className="flex flex-col gap-md">
        {/* Members-only service reveal. Default off so the roster reads as a
            member list; on, member cards gain a service footer. Co-membership
            is the visibility grant, so it's gated on `isMember`. Wrapped in a
            slim banner so the control reads as deliberate without competing
            with the member cards. 2026-05-22. */}
        {isMember && hasAnyMemberServices && (
          <div className="rounded-panel border border-edge-regular bg-surface-inset px-md py-sm">
            <Toggle
              label="Show members' services"
              checked={showServices}
              onChange={setShowServices}
              size="sm"
            />
          </div>
        )}
        {showAdmins && <SectionHeader label="Admins" />}
        {showAdmins && (
          <div className="flex flex-col gap-sm">{admins.map(renderRow)}</div>
        )}

        {showAdminsDivider && <MetaDivider />}

        {showConnected && <SectionHeader label="Connected" />}
        {showConnected && (
          <div className="flex flex-col gap-sm">{connected.map(renderRow)}</div>
        )}

        {showFamiliar && <SectionHeader label="Familiar" />}
        {showFamiliar && (
          <div className="flex flex-col gap-sm">
            {familiarOutbound.map(renderRow)}
          </div>
        )}

        {showOther && (
          // Header is neutral — "Other members" doesn't reveal *why*
          // anyone is in this group (open profile vs inbound
          // theyMarkedFamiliar both land here). Section labels are
          // private to the viewer's render, so labeling leaks nothing
          // about marks. Mock World Building 2026-04-30.
          <div className="flex flex-col gap-sm">
            <SectionHeader label="Other members" />
            {otherTier12.map(renderRow)}
          </div>
        )}

        {showLocked && (
          <div className="flex flex-col gap-sm">
            <SectionHeader label="Private profiles" />
            {locked.map((m) => (
              <PrivateProfileRow
                key={m.userId}
                userId={m.userId}
                name={m.userName}
                avatarUrl={m.avatarUrl}
                dogNames={m.dogNames}
                canAct={true}
              />
            ))}
          </div>
        )}
      </section>
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

