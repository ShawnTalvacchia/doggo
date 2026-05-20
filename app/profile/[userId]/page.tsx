"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  PawPrint,
  MapPin,
  Calendar,
  CalendarDots,
  CalendarBlank,
  ChatCircleDots,
  LockSimple,
  UsersThree,
  Plus,
  Check,
  House,
  Tree,
  Dog,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
import { ConnectionIcon } from "@/components/ui/ConnectionIcon";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { TrustSignalBadges } from "@/components/profile/TrustSignalBadges";
import { SharedContextCard } from "@/components/profile/SharedContextCard";
import { TrustBadgeStrip } from "@/components/badges/TrustBadgeStrip";
import { getTrustBadges, userProfileToTrustSubject } from "@/lib/trustBadges";
import { getCarerIdentity } from "@/lib/identityBadges";
import { PetCard } from "@/components/profile/PetCard";
import { PostsTab } from "@/components/profile/PostsTab";
import { ProfileChatTab } from "@/components/profile/ProfileChatTab";
import { AvailabilityGrid } from "@/components/profile/AvailabilityGrid";
import { InquiryFormModal } from "@/components/messaging/InquiryFormModal";
import { BookSessionSheet } from "@/components/meets/BookSessionSheet";
import type { ServiceType, CarerMeetServiceConfig } from "@/lib/types";
import { getCommunityCarers, getMutualConnectedUserIds } from "@/lib/mockConnections";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { viewerSharedMeetWith, mockMeets } from "@/lib/mockMeets";
import { meetScheduleSummary } from "@/lib/meetUtils";
import { viewerSharedGroupWith, getSharedGroupNames } from "@/lib/mockGroups";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUser, useCurrentUserId, useIsGuest, useIsHydrated } from "@/hooks/useCurrentUser";
import { useAuthGate } from "@/contexts/AuthGateContext";
import { resolvePersonActions } from "@/lib/personActions";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { providers } from "@/lib/mockData";
import { getUserOrProvider, getUserById } from "@/lib/mockUsers";
import { SERVICE_LABELS } from "@/lib/constants/services";

/* ── Mutual connections section (other-user profiles) ──────────────────────
 *
 * Surfaces Connected mutuals between the viewer and the subject. Compact
 * row in the About tab body (avatar stack of up to 5 + count + tap-target)
 * that opens a ModalSheet with the full list. Renders nothing when there
 * are zero mutuals.
 *
 * **Privacy:** Connected-only. Familiar marks are excluded — surfacing them
 * would break the deniability principle. See [[Trust & Connection Model]]
 * → Familiar privacy. 2026-05-11.
 */
function MutualConnectionsSection({
  viewerId,
  subjectId,
}: {
  viewerId: string;
  subjectId: string;
}) {
  const [open, setOpen] = useState(false);
  const mutualIds = getMutualConnectedUserIds(viewerId, subjectId);
  if (mutualIds.length === 0) return null;

  const users = mutualIds
    .map((id) => getUserById(id))
    .filter((u): u is NonNullable<ReturnType<typeof getUserById>> => Boolean(u));
  const previewCount = 5;
  const preview = users.slice(0, previewCount);
  const overflow = Math.max(0, users.length - previewCount);

  return (
    <>
      <section>
        <h3 className="profile-card-subtitle">Mutual connections</h3>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-md w-full text-left rounded-panel"
          style={{
            background: "var(--surface-top)",
            border: "1px solid var(--border-regular)",
            padding: "var(--space-md)",
            cursor: "pointer",
          }}
        >
          <div className="flex items-center shrink-0">
            {preview.map((u, i) => (
              <img
                key={u.id}
                src={u.avatarUrl}
                alt={`${u.firstName} ${u.lastName}`}
                className="rounded-full border-2 border-surface-top object-cover"
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: i > 0 ? -8 : 0,
                }}
              />
            ))}
            {overflow > 0 && (
              <span
                className="flex items-center justify-center rounded-full text-xs font-medium"
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: -8,
                  background: "var(--surface-gray)",
                  color: "var(--text-secondary)",
                  border: "2px solid var(--surface-top)",
                }}
              >
                +{overflow}
              </span>
            )}
          </div>
          <span className="text-sm text-fg-primary flex-1">
            {users.length === 1
              ? "1 mutual connection"
              : `${users.length} mutual connections`}
          </span>
          <span className="text-xs text-fg-tertiary">View →</span>
        </button>
      </section>

      <ModalSheet
        open={open}
        onClose={() => setOpen(false)}
        title={`You both know · ${users.length}`}
      >
        <div className="flex flex-col gap-sm" style={{ padding: "var(--space-md)" }}>
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/profile/${u.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-md rounded-panel"
              style={{
                background: "var(--surface-top)",
                border: "1px solid var(--border-regular)",
                padding: "var(--space-sm) var(--space-md)",
                textDecoration: "none",
              }}
            >
              <img
                src={u.avatarUrl}
                alt={`${u.firstName} ${u.lastName}`}
                className="rounded-full object-cover shrink-0"
                style={{ width: 40, height: 40 }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-fg-primary">
                  {u.firstName} {u.lastName}
                </span>
                <span className="text-xs text-fg-tertiary">
                  {u.location}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </ModalSheet>
    </>
  );
}

/* ── Page ── */

function UserProfileInner() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "about";
  // Appointment-context entry — when the user lands here from an
  // "Ask about this" CTA on an appointment-type service card, pre-fill
  // the chat input with a templated opener so they don't have to start
  // from scratch. Discover & Care 2026-05-04.
  const appointmentParam = searchParams.get("appointment");

  const handleTabChange = useCallback((key: string) => {
    if (key === "about") {
      router.replace(`/profile/${userId}`, { scroll: false });
    } else {
      router.replace(`/profile/${userId}?tab=${key}`, { scroll: false });
    }
  }, [router, userId]);

  const currentUserId = useCurrentUserId();
  const currentUser = useCurrentUser();
  const isGuest = useIsGuest();
  const { requireAuth } = useAuthGate();
  // A guest's fallback `currentUserId` is Tereza — but a guest visiting their
  // own profile (Tereza→Tereza) shouldn't get the self-edit affordance. Force
  // isSelf false for guests so the action row renders properly. D6 2026-05-11.
  //
  // Also gated on `isHydrated`: pre-hydration, `currentUserId` resolves to
  // the Tereza fallback regardless of who's actually logged in. Without the
  // gate, Tomáš visiting `/profile/tereza` evaluates `isSelf` as
  // `tereza === tereza` on first render — fires the redirect below, bounces
  // the viewer back to `/profile` (which is Tomáš's own profile after
  // hydration). Gating `isSelf` itself (rather than just the redirect)
  // also prevents the `if (isSelf) return null` branch from flashing blank
  // pre-hydration. 2026-05-13 (PDP C11 bugfix).
  const isHydrated = useIsHydrated();
  const isSelf = isHydrated && !isGuest && userId === currentUserId;

  // Viewing your own profile via the URL (e.g. typing `/profile/daniel`
  // while logged in as Daniel) should bounce to `/profile`. Without this
  // the page applies the viewer-vs-subject gate to yourself — locked
  // personas end up seeing "this profile is private" about their own
  // profile. Own-profile rendering lives at `/profile` and carries the
  // right affordances (Edit slot, no connection actions, persona
  // dropdown). Tab param is preserved only for tabs that exist on the
  // own-profile route. 2026-05-11 (walkthrough B1).
  useEffect(() => {
    if (!isSelf) return;
    const ownTabs = new Set(["about", "posts", "services"]);
    const tab = ownTabs.has(activeTab) && activeTab !== "about" ? `?tab=${activeTab}` : "";
    router.replace(`/profile${tab}`);
  }, [isSelf, activeTab, router]);

  // Resolve user data via the unified bridge — handles directory-only
  // providers (`olga-m`, `jana-k`, etc.) by synthesizing a minimal profile
  // from the `ProviderCard`. See `mockUsers.ts` → `getUserOrProvider`.
  // Connection comes from the session-aware context so Familiar marks
  // taken on this page (or anywhere else that uses the context) reflect
  // immediately. Static `mockConnections` is the fallback inside the
  // context's `getConnection` helper.
  const { getConnection, markFamiliar, unmarkFamiliar } = useConnections();
  const connection = getConnection(userId, currentUserId);
  const userProfile = getUserOrProvider(userId);
  const provider = providers.find((p) => p.id === userId || p.userId === userId);
  const communityCarer = getCommunityCarers(currentUserId).find((c) => c.userId === userId);

  const name = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
    : connection?.userName ?? provider?.name ?? userId;
  const firstName = userProfile?.firstName ?? name.split(" ")[0];
  const avatarUrl = userProfile?.avatarUrl ?? connection?.avatarUrl ?? provider?.avatarUrl ?? "";
  const location = userProfile?.location ?? connection?.location ?? provider?.district ?? "";
  const dogs = userProfile?.pets ?? [];
  const dogNames = connection?.dogNames ?? dogs.map((d) => d.name);
  const connState = connection?.state ?? "none";
  // Profile is "open" (public) when EITHER the user's own visibility setting
  // is "open", OR the viewer's connection record carries an open hint.
  // Without the userProfile fallback, Public users render as Private to any
  // viewer who has no connection record with them — which broke the demo for
  // Public anchors like Jana / Eva when viewed from non-connected personas.
  const isProfileOpen =
    userProfile?.profileVisibility === "open" || connection?.profileOpen === true;
  const sharedGroups = connection?.sharedGroups ?? [];

  const hasCare = !!userProfile?.carerProfile || !!provider || !!communityCarer;
  // Locked = subject's profile content is hidden from the viewer.
  //
  // **What unlocks the subject's content for the viewer:**
  //   - Subject is Open (publicly visible to anyone), OR
  //   - Subject has marked the viewer Familiar (`theyMarkedFamiliar`),
  //     i.e. the SUBJECT chose to open up to the viewer, OR
  //   - The two are Connected (mutual) or Pending (one side has asked).
  //
  // **What does NOT unlock the subject's content for the viewer:**
  //   - The viewer marking the subject Familiar (`connState === "familiar"`).
  //     Familiar is an outbound grant — the marker opens themselves up to
  //     the marked person, but that's the marker's content opening up,
  //     not the marked person's content opening up to the marker.
  //
  // This caught us out 2026-04-30 — earlier `isLocked` excluded outbound
  // state="familiar" from "locked," which incorrectly unlocked the
  // subject's profile when the viewer marked them. The trust model says
  // unlocking is the SUBJECT's choice, not the marker's.
  const isLocked =
    !isProfileOpen &&
    !connection?.theyMarkedFamiliar &&
    connState !== "connected" &&
    connState !== "pending";

  // Chat tab visibility — three reasons it shows:
  //   1. Connected viewer (social chat is allowed by the trust model)
  //   2. Existing thread (continue an in-progress conversation)
  //   3. Provider-tier carer (anyone can inquire on a publicly-bookable
  //      service per [[Groups & Care Model]] → Provider Tiers — and the
  //      "Book a session" CTA needs a destination on stranger profiles).
  // Helper-tier services stay gated on Connection — non-connected viewers
  // see neither the CTA nor the Chat tab. Discover & Care G1, 2026-05-02.
  const { getConversationForUser } = useConversations();
  const existingConv = getConversationForUser(userId);
  const isProviderTier = userProfile?.carerProfile?.publicProfile === true;
  // Guests have no real identity, so no chat tab — the conversation lookup
  // would resolve to Tereza's existing thread (if any) and leak it. D6 2026-05-11.
  const showChatTab = !isGuest && (connState === "connected" || !!existingConv || isProviderTier);

  // Inquiry modal — opened from a service card "Book a session" CTA.
  // Stays on Services tab; modal posts the InquiryCard message to the
  // (owner, provider) thread on submit. Discover & Care 2026-05-03 refactor.
  const [inquiryTarget, setInquiryTarget] = useState<
    { service: ServiceType; subService: string | null } | null
  >(null);
  // Service ↔ Meet Linkage C5 — the Meet-type service whose Book CTA was
  // tapped on the Services tab. Drives the BookSessionSheet.
  const [bookingService, setBookingService] = useState<CarerMeetServiceConfig | null>(null);

  const tabs = [
    { key: "about", label: "About" },
    { key: "posts", label: "Posts" },
    ...(hasCare ? [{ key: "services", label: "Services" }] : []),
    ...(showChatTab ? [{ key: "chat", label: "Chat" }] : []),
  ];

  // Mobile nav: show name + avatar with back button, hide bottom nav.
  // Locked profiles only show firstName (privacy — last name is identity
  // and shouldn't leak before the viewer earns visibility).
  const headerName = isLocked ? firstName : name;
  const headerAvatar = avatarUrl ? (
    <img src={avatarUrl} alt="" />
  ) : (
    <DefaultAvatar name={firstName} size={28} />
  );
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  useEffect(() => {
    setDetailHeader(
      headerName,
      () => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        // Guests don't have a /home to fall back to.
        router.replace(isGuest ? "/" : "/home");
      },
      undefined,
      headerAvatar,
    );
    document.body.classList.add("profile-subpage");
    return () => {
      clearDetailHeader();
      document.body.classList.remove("profile-subpage");
    };
  }, [headerName, avatarUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Don't paint the viewer-vs-subject UI for a brief frame while the
  // self-redirect resolves — render nothing.
  if (isSelf) return null;

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader title={headerName} leadingAvatar={headerAvatar} />}>
      <div className={`page-column-panel-body${activeTab === "chat" ? " page-column-panel-body--no-scroll" : ""}`}>

        {/* Tabs — hidden for locked profiles */}
        {!isLocked && (
          <div className="page-column-panel-tabs">
            <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        )}

        {/* ── Locked profile state ── */}
        {/* firstName only (privacy — last name is identity, shouldn't leak
            before the viewer has earned visibility). Generous gap between
            avatar / name / lock card so the page doesn't feel cramped.

            When the viewer has shared context with the subject (mutual
            groups or shared meets recorded on the connection), surface a
            Familiar pill below the lock card. Connect deliberately stays
            absent — Connect requires the subject to have given some
            opening signal (Open profile or theyMarkedFamiliar), which
            isn't the case here. Mock World Building 2026-04-30. */}
        {isLocked && (() => {
          // Shared context = co-membership in any group OR shared past meet
          // attendance. Computed against the actual mockGroups + mockMeets
          // data, not just the connection record (which only exists for
          // explicitly seeded relationships — Daniel and Marek share the
          // Reactive Dog Support group but have no connection record, so
          // the connection-record check would falsely return no context).
          const sharedGroupNames = getSharedGroupNames(currentUserId, userId);
          const hasSharedContext =
            sharedGroupNames.length > 0 ||
            viewerSharedMeetWith(currentUserId, userId) ||
            viewerSharedGroupWith(currentUserId, userId) ||
            (connection?.meetsShared ?? 0) > 0;
          const isMarked = connection?.state === "familiar";
          return (
            <div
              className="flex flex-col"
              style={{
                padding: "var(--space-lg)",
                gap: "var(--space-xxl)",
              }}
            >
              {/* Hero — mirrors the unlocked-profile hero shape exactly so
                  locked vs unlocked feel like the same surface in different
                  states. Same wrapper (`gap-md` + paddingBottom), same
                  identity row (`flex-col sm:flex-row gap-lg sm:items-center`),
                  same 200px avatar + 12px padding wrapper, same right-column
                  rhythm (`gap-xs` for stacked meta, action wrapped with
                  `marginTop: var(--space-md)` for breathing room).
                  Aligned 2026-05-11 (CCFT walkthrough). */}
              <div className="flex flex-col gap-md" style={{ paddingBottom: "var(--space-md)" }}>
                <div className="flex flex-col sm:flex-row gap-lg sm:items-center">
                  {/* Avatar wrapper — same 12px breathing room as unlocked;
                      locked-treatment filter (slight darken + tiny blur) is
                      the only difference. */}
                  <div className="self-center sm:self-auto shrink-0" style={{ padding: 12 }}>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={firstName}
                        className="rounded-full object-cover"
                        style={{ width: 200, height: 200, filter: "brightness(0.6) blur(1px)" }}
                      />
                    ) : (
                      <DefaultAvatar name={firstName} size={200} />
                    )}
                  </div>
                  <div className="w-full sm:flex-1 flex flex-col gap-xs min-w-0 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-sm flex-wrap justify-center sm:justify-start">
                      <h1 className="font-heading text-2xl font-medium text-fg-primary m-0">
                        {firstName}
                      </h1>
                    </div>

                    {/* Familiar action — outline pill (original aesthetic),
                        bumped to the `--lg` variant for hero presence. The
                        `marginTop: var(--space-md)` mirrors how the unlocked
                        action row sits set apart from the meta lines above. */}
                    {hasSharedContext && (
                      <div
                        className="flex flex-col gap-sm items-center sm:items-start w-full"
                        style={{ marginTop: "var(--space-md)" }}
                      >
                        <p className="text-sm text-fg-secondary m-0">
                          {isMarked
                            ? `${firstName} can now see your profile and tags from shared contexts.`
                            : `Have you met ${firstName}? Mark them familiar to let them see your profile.`}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (isGuest) {
                              requireAuth(`recognise ${firstName}`);
                              return;
                            }
                            isMarked
                              ? unmarkFamiliar(currentUserId, userId)
                              : markFamiliar(currentUserId, userId);
                          }}
                          className={`private-profile-row-pill private-profile-row-pill--lg${isMarked ? " is-marked" : ""}`}
                          aria-pressed={isMarked}
                          aria-label={
                            isMarked ? `Remove Familiar from ${firstName}` : `Mark ${firstName} as Familiar`
                          }
                        >
                          {isMarked ? "Familiar ✓" : "+ Familiar"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shared context — warmth signal, full-width below the hero.
                  Lists every shared group (not just the first). Card chrome
                  is now no-fill + border so it reads lighter than the lock
                  card below (which keeps its muted inset fill — the
                  hierarchy is "warmth = clean, gate = muted"). Future-
                  state: shared past meets when `getSharedMeetsBetween`
                  lands (P66). */}
              <SharedContextCard
                firstName={firstName}
                sharedGroupNames={sharedGroupNames}
              />

              {/* Lock card — full-width, privacy explainer + inline
                  "Learn how privacy works" link. Keeps the inset-fill
                  chrome (muted "this is gated" treatment). CCFT 2026-05-11. */}
              <div
                className="flex flex-col items-center gap-sm rounded-panel bg-surface-inset w-full"
                style={{ padding: "var(--space-xl) var(--space-lg)" }}
              >
                <LockSimple size={28} weight="light" className="text-fg-tertiary" />
                <p className="text-sm text-fg-secondary m-0 text-center">
                  {firstName} keeps their profile private. People typically see more after meeting at a walk or community.
                </p>
                <Link
                  href="/help/privacy"
                  className="text-sm font-semibold text-fg-primary hover:text-brand-main"
                  style={{
                    marginTop: "var(--space-xs)",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  }}
                >
                  Learn how privacy works
                </Link>
              </div>
            </div>
          );
        })()}

        {/* ── About tab ── */}
        {!isLocked && activeTab === "about" && (
          <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>

            {/* Hero — compact horizontal layout. Identity row pairs avatar
                left + name/location/dog right; trust badges below; CTAs span
                the panel width; relationship signals wrap below the CTAs.
                Discover & Care 2026-05-04 visual refactor. */}
            <div className="flex flex-col gap-md" style={{ paddingBottom: "var(--space-md)" }}>
              {/* Identity row — avatar + name/location/dog + relationship
                  signals stacked in the right column. Stacks vertically on
                  narrow viewports (avatar centered above text, content
                  centered); flips to horizontal layout at sm breakpoint
                  and above. Signals get a small top margin and slightly
                  muted color to set them apart from the dog row above
                  without needing a divider line. */}
              <div className="flex flex-col sm:flex-row gap-lg sm:items-center">
                {/* Avatar wrapper — 12px padding gives the photo breathing
                    room inside its own bounding box, soft frame effect. */}
                <div className="self-center sm:self-auto shrink-0" style={{ padding: 12 }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="rounded-full object-cover"
                      style={{ width: 200, height: 200 }}
                    />
                  ) : (
                    <DefaultAvatar name={name} size={200} />
                  )}
                </div>
                <div className="w-full sm:flex-1 flex flex-col gap-xs min-w-0 items-center sm:items-start text-center sm:text-left">
                  <h1 className="font-heading text-2xl font-medium text-fg-primary m-0">{name}</h1>
                  {/* Carer identity chip — light info-blue chip with the
                   *  Carer's sub-spec label ("Dog Trainer", "Vet Clinic",
                   *  etc.) when one resolves; "Carer" otherwise. Audience
                   *  signal is encoded by visibility — circle-Carers'
                   *  chip only renders to Connected viewers (or self) per
                   *  the privacy rule. Sits on its own row UNDER the name
                   *  (mirrors the own-profile hero shape).
                   *
                   *  Chip chrome matches ProfileVisibilityChip's (12px
                   *  font, px-sm py-xs, rounded-pill) — own-profile hero
                   *  shows visibility + carer as a sibling pair, so the
                   *  sizes have to match there; mirroring the same chrome
                   *  here keeps the carer chip looking the same on both
                   *  surfaces. Sized larger than PersonRow's
                   *  `.person-row-pill--carer` treatment (which is tuned
                   *  for compact 36px rows). 2026-05-13 (PDP). */}
                  {(() => {
                    const viewerIsConnected =
                      userId === currentUserId || connState === "connected";
                    const carerBadge = getCarerIdentity(userProfile, viewerIsConnected);
                    if (!carerBadge) return null;
                    return (
                      <div className="flex items-center gap-sm justify-center sm:justify-start">
                        <span
                          className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
                          style={{
                            background: "var(--status-info-light)",
                            color: "var(--status-info-strong)",
                          }}
                        >
                          {carerBadge.label}
                        </span>
                      </div>
                    );
                  })()}

                  {location && (
                    <span className="flex items-center gap-xs text-sm text-fg-secondary">
                      <MapPin size={13} weight="fill" className="shrink-0" /> {location}
                    </span>
                  )}
                  {dogNames.length > 0 && (
                    <span className="flex items-center gap-xs text-sm text-fg-secondary">
                      <PawPrint size={13} weight="light" className="shrink-0" />
                      {dogNames.join(", ")}
                      {connection?.dogBreed && ` · ${connection.dogBreed}`}
                    </span>
                  )}
                  {connection && (
                    <div className="text-fg-tertiary" style={{ marginTop: "var(--space-xs)" }}>
                      <TrustSignalBadges connection={connection} />
                    </div>
                  )}

                  {/* Relationship + action row — two slots side by side.
                   *  Left slot: relationship state (Mark Familiar / Familiar /
                   *    Connected). Familiar stays a quick toggle; Connected is
                   *    a placeholder for a future dropdown (unconnect / block
                   *    / report). See punch list.
                   *  Right slot: primary action — tier-aware. Provider tier
                   *    gets "Book care" (routes to Services tab where the
                   *    per-service Book a session CTAs live); Helper tier
                   *    gets "Connect with X" (relationship deepening).
                   *    Connected → "Message" both tiers. Pending → "Request
                   *    sent" disabled.
                   *  Pricing & Proposals walkthrough 2026-05-05. */}
                  {/* Guest viewers see a single brand-fill "Connect with X"
                      pill — the trust matrix doesn't apply (no real identity),
                      and every nuanced state (familiar/pending/connected)
                      collapses to the same AuthGate prompt. D6 2026-05-11. */}
                  {!isSelf && isGuest && (
                    <div className="flex flex-wrap gap-sm w-full" style={{ marginTop: "var(--space-md)" }}>
                      <ButtonAction
                        variant="primary"
                        size="md"
                        cta
                        className="grow basis-[140px]"
                        leftIcon={<ChatCircleDots size={16} weight="fill" />}
                        onClick={() => requireAuth(`connect with ${firstName}`)}
                      >
                        Connect with {firstName}
                      </ButtonAction>
                    </div>
                  )}
                  {!isSelf && !isGuest && (() => {
                    const matrix = resolvePersonActions(
                      { userId: currentUserId, profileOpen: currentUser.profileVisibility === "open" },
                      {
                        userId,
                        connectionState: connState,
                        theyMarkedFamiliar: connection?.theyMarkedFamiliar,
                        profileOpen: isProfileOpen,
                      },
                    );
                    const familiarAction = matrix.find((a) => a.kind === "familiar");

                    // Left slot — relationship state
                    type LeftSlot = "connected" | "familiar_marked" | "mark_familiar" | null;
                    const leftSlot: LeftSlot =
                      connState === "connected"
                        ? "connected"
                        : connState === "familiar"
                          ? "familiar_marked"
                          : connState === "none" && familiarAction?.kind === "familiar" && familiarAction.state === "off"
                            ? "mark_familiar"
                            : null;

                    // Right slot — tier-aware primary action
                    type RightSlot = "message" | "book_care" | "connect" | "request_sent" | null;
                    const rightSlot: RightSlot =
                      connState === "connected"
                        ? "message"
                        : connState === "pending"
                          ? "request_sent"
                          : isProviderTier
                            ? "book_care"
                            : matrix.find((a) => a.kind === "connect")
                              ? "connect"
                              : null;

                    if (!leftSlot && !rightSlot) return null;

                    return (
                      // Row uses `flex-wrap` + `grow basis-[140px]` per
                      // button so the pair shares the row equally when
                      // there's space (each grows to ~50% from its 140px
                      // basis), and wraps to stacked full-width when the
                      // panel is too narrow to fit both labels side by
                      // side (e.g. iPhone SE / 320px). `.btn` carries
                      // `white-space: nowrap` so flex-1 alone couldn't
                      // shrink the buttons below content width — they'd
                      // overflow the panel horizontally. 2026-05-13 (PDP).
                      <div className="flex flex-wrap gap-sm w-full" style={{ marginTop: "var(--space-md)" }}>
                        {leftSlot === "mark_familiar" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            leftIcon={<Plus size={14} weight="bold" />}
                            onClick={() => markFamiliar(currentUserId, userId)}
                            aria-label={`Mark ${firstName} as Familiar`}
                          >
                            Mark Familiar
                          </ButtonAction>
                        )}
                        {leftSlot === "familiar_marked" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            leftIcon={<Check size={14} weight="bold" />}
                            onClick={() => unmarkFamiliar(currentUserId, userId)}
                            aria-pressed
                            aria-label={`Remove Familiar from ${firstName}`}
                          >
                            Familiar
                          </ButtonAction>
                        )}
                        {leftSlot === "connected" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            leftIcon={<Check size={14} weight="bold" />}
                            aria-label={`You're connected with ${firstName}`}
                          >
                            Connected
                          </ButtonAction>
                        )}
                        {rightSlot === "message" && (
                          <ButtonAction
                            variant="primary"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            leftIcon={<ChatCircleDots size={16} weight="fill" />}
                            onClick={() => handleTabChange("chat")}
                          >
                            Message
                          </ButtonAction>
                        )}
                        {rightSlot === "book_care" && (
                          <ButtonAction
                            variant="primary"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            leftIcon={<CalendarDots size={16} weight="light" />}
                            onClick={() => handleTabChange("services")}
                          >
                            Book care
                          </ButtonAction>
                        )}
                        {rightSlot === "connect" && (
                          <ButtonAction
                            variant="primary"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                          >
                            Connect with {firstName}
                          </ButtonAction>
                        )}
                        {rightSlot === "request_sent" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="grow basis-[140px]"
                            disabled
                          >
                            Request sent
                          </ButtonAction>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              {isSelf && (
                <div className="flex items-center gap-sm flex-wrap">
                  <ConnectionIcon state={connState} profileOpen={isProfileOpen} size={16} showLabel />
                </div>
              )}

            </div>

            {/* About section. Trust badges (credentials / community-earned /
                platform) live here as supporting context for the bio — moved
                out of the hero in the 2026-05-04 visual refactor so the hero
                stays focused on identity + action. */}
            <section>
              <h3 className="profile-card-subtitle">About</h3>
              <p className="profile-card-copy">
                {userProfile?.bio ?? provider?.blurb ?? `${name} is a dog owner in ${location}.`}
              </p>
              {userProfile?.carerProfile && (() => {
                const badges = getTrustBadges(userProfileToTrustSubject(userProfile), currentUserId);
                if (badges.length === 0) return null;
                return (
                  <div style={{ marginTop: "var(--space-md)" }}>
                    <TrustBadgeStrip badges={badges} />
                  </div>
                );
              })()}
              {userProfile?.memberSince && (
                <p className="flex items-center gap-xs text-xs text-fg-tertiary m-0" style={{ marginTop: "var(--space-lg)" }}>
                  <Calendar size={12} weight="light" />
                  Member since {new Date(userProfile.memberSince + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </p>
              )}
            </section>

            {/* Provider stats */}
            {provider && (
              <section className="profile-info-card">
                <div className="flex items-center gap-sm text-sm text-fg-secondary">
                  <span>{provider.rating} ★ · {provider.reviewCount} reviews</span>
                  {provider.distanceKm && (
                    <span className="text-fg-tertiary">· {provider.distanceKm} km away</span>
                  )}
                </div>
              </section>
            )}

            {/* Carer bio — shown when user has carerProfile but isn't in provider catalog */}
            {!provider && userProfile?.carerProfile?.bio && (
              <section>
                <h3 className="profile-card-subtitle">About their care services</h3>
                <p className="profile-card-copy">{userProfile.carerProfile.bio}</p>
              </section>
            )}

            {/* Dogs — PetCards with collapsed default for other users */}
            {dogs.length > 0 && (
              <section className="flex flex-col gap-md">
                <h3 className="profile-card-subtitle" style={{ marginBottom: 0 }}>
                  {firstName}&apos;s Dogs
                </h3>
                {dogs.map((pet) => (
                  <PetCard key={pet.id} pet={pet} defaultExpanded={false} />
                ))}
              </section>
            )}

            {/* Mutual connections — Connected-only mutuals between viewer
                and subject. Renders nothing when there are no mutuals.
                Deniability-safe: Familiar marks excluded. 2026-05-11. */}
            <MutualConnectionsSection viewerId={currentUserId} subjectId={userId} />
          </div>
        )}

        {/* ── Posts tab ── */}
        {!isLocked && activeTab === "posts" && (
          <PostsTab userId={userId} />
        )}

        {/* ── Services tab ── */}
        {!isLocked && activeTab === "services" && (() => {
          // Circle-only carer explainer — surfaces on viewers' views when
          // the subject offers care but their audience is `circle` (not
          // public Discover). Communicates that the services on this
          // profile are visible to the viewer because they're in the
          // carer's Connected circle. Hidden for public carers
          // (`publicProfile: true`) because the broader Discover audience
          // doesn't need the "you're seeing this because…" caveat. Tier
          // check is structural; the older `hasListedServices` heuristic
          // missed directory-only carers (Olga, Markéta) whose services
          // come from the ProviderCard fallback path. Reframed 2026-05-11
          // (walkthrough C6) — dropped "Open to helping" / "Helper-tier"
          // labels with the broader copy sweep.
          const isPublicCarer = userProfile?.carerProfile?.publicProfile === true;
          const isDirectoryProvider = !!provider; // listed in `/discover/care`
          const showCircleCarerExplainer =
            (userProfile?.openToHelping ?? false) && !isPublicCarer && !isDirectoryProvider;
          return (
            <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
              {/* Circle-only carer explainer. Sets viewer expectations:
                  "this person is a carer for their Connected circle, and
                  you're seeing this because you're in that circle."
                  Future: Onboarding & In-Product Communication phase may
                  layer a "what does this mean?" tooltip on top to teach
                  the broader trust model. */}
              {showCircleCarerExplainer && (
                <section
                  className="flex items-start gap-md rounded-panel p-md border border-edge-regular"
                  style={{ background: "var(--brand-subtle)" }}
                >
                  <UsersThree
                    size={20}
                    weight="fill"
                    className="shrink-0"
                    style={{ color: "var(--brand-strong)", marginTop: 2 }}
                  />
                  <div className="flex flex-col gap-xs">
                    <p className="text-sm font-semibold text-fg-primary m-0">
                      Carer · Connected circle
                    </p>
                    <p className="text-sm text-fg-secondary m-0 leading-snug">
                      {firstName} offers care to people they&apos;re Connected with — you&apos;re seeing this because you&apos;re in their circle.
                    </p>
                  </div>
                </section>
              )}

              {/* About my home — surfaces the home-setting fields a carer
                  configures on their sitting/boarding service config (D3
                  service-aware fields: homeType, hasOwnDogs, hasYard,
                  maxDogs). Renders only when the carer has any of those set
                  — so walks-only carers don't get a misleading empty
                  section. Home is a person-attribute (one home per carer);
                  resolves from the first sitting/boarding Care service we
                  find that carries any home field. Discover Refinement
                  walkthrough decision, 2026-05-10 (B4) — surfaces D3 data
                  that was previously filter-only. */}
            {(() => {
              const services = userProfile?.carerProfile?.services ?? [];
              const careWithHome = services.find(
                (s): s is import("@/lib/types").CarerCareServiceConfig =>
                  s.kind === "care" &&
                  (s.serviceType === "day_care" || s.serviceType === "boarding") &&
                  (s.homeType !== undefined ||
                    s.hasOwnDogs !== undefined ||
                    s.hasYard !== undefined ||
                    s.maxDogs !== undefined),
              );
              if (!careWithHome) return null;

              const HOME_TYPE_LABEL: Record<string, string> = {
                flat: "Flat",
                house: "House",
                ground_floor_with_garden: "Ground floor + garden",
              };

              return (
                <section>
                  <h3 className="profile-card-subtitle">About {firstName}&rsquo;s home</h3>
                  <ul className="flex flex-col gap-sm m-0 p-0 list-none text-sm text-fg-secondary">
                    {careWithHome.homeType && (
                      <li className="flex items-center gap-sm">
                        <House size={16} weight="light" className="shrink-0 text-fg-tertiary" />
                        <span>{HOME_TYPE_LABEL[careWithHome.homeType]}</span>
                      </li>
                    )}
                    {careWithHome.hasYard === true && (
                      <li className="flex items-center gap-sm">
                        <Tree size={16} weight="light" className="shrink-0 text-fg-tertiary" />
                        <span>Yard / outdoor space</span>
                      </li>
                    )}
                    {careWithHome.hasOwnDogs !== undefined && (
                      <li className="flex items-center gap-sm">
                        <Dog size={16} weight="light" className="shrink-0 text-fg-tertiary" />
                        <span>{careWithHome.hasOwnDogs ? "Has their own dog(s)" : "No own dogs"}</span>
                      </li>
                    )}
                    {careWithHome.maxDogs !== undefined && (
                      <li className="flex items-center gap-sm">
                        <UsersThree size={16} weight="light" className="shrink-0 text-fg-tertiary" />
                        <span>
                          {careWithHome.maxDogs === 1
                            ? "Hosts one dog at a time"
                            : `Hosts up to ${careWithHome.maxDogs} dogs at once`}
                        </span>
                      </li>
                    )}
                  </ul>
                </section>
              );
            })()}

              {/* Service cards — single comprehensive catalogue.
                  Care-type cards render first (drop-off services), then Meet-type
                  cards (sessions the owner signs up for). Tap routing differs
                  by kind: Care → request-booking flow (chat); Meet → upcoming
                  sessions on the linked series. See [[Groups & Care Model]]
                  → Services as Catalog. */}
            <section>
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="profile-services-list">
                {userProfile?.carerProfile?.services
                  ? <>
                    {/* Care-type services — "I take the dog" shape (Walking,
                        Sitting, Day care, Boarding). Booking produces a
                        Booking record. Walks carry an additional delivery
                        axis (pickup vs drop-off — `deliveryOptions[]`)
                        surfaced below the price; that axis is *who travels*,
                        not the offering shape. Walk Service Delivery,
                        2026-05-20. */}
                    {userProfile.carerProfile.services
                      .filter((s): s is import("@/lib/types").CarerCareServiceConfig => s.kind === "care" && s.enabled)
                      .map((svc) => {
                        const deliveryOpts = svc.deliveryOptions ?? [];
                        const hasMultipleDelivery = deliveryOpts.length > 1;
                        // Catalogue price reads from the cheapest delivery
                        // option when present (so the user sees the floor),
                        // with a "From" prefix to telegraph the range.
                        const priceFromDelivery = hasMultipleDelivery
                          ? Math.min(...deliveryOpts.map((o) => o.price))
                          : svc.pricePerUnit;
                        const showFromPrefix =
                          (svc.modifiers ?? []).some((m) => m.enabled) ||
                          hasMultipleDelivery;
                        return (
                    <div key={svc.serviceType} className="profile-service-card">
                      <div className="profile-service-top">
                        <span className="profile-service-name">{SERVICE_LABELS[svc.serviceType]}</span>
                        <div className="profile-service-price-wrap">
                          <span className="profile-service-price">
                            {/* "From" telegraphs that the final quote depends
                                on inquiry specifics (multi-pet, holiday,
                                delivery method, etc.) — surfaced in the
                                proposal, not the catalogue. Pricing &
                                Proposals 2026-05-04; delivery axis added by
                                Walk Service Delivery 2026-05-20. */}
                            {showFromPrefix && (
                              <span className="profile-service-price-from">From </span>
                            )}
                            {priceFromDelivery.toLocaleString()} Kč
                            <span className="profile-service-unit">
                              {" "}/ {svc.priceUnit === "per_visit" ? "visit" : "night"}
                            </span>
                          </span>
                        </div>
                      </div>
                      {svc.subServices.length > 0 && (
                        <div className="profile-service-subs">
                          {svc.subServices.map((sub) => (
                            <span
                              key={sub}
                              className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      {hasMultipleDelivery && (
                        <div className="flex flex-col gap-tiny text-xs">
                          {deliveryOpts
                            .slice()
                            .sort((a, b) =>
                              a.method === b.method ? 0 : a.method === "pickup" ? -1 : 1,
                            )
                            .map((opt) => (
                              <span
                                key={opt.method}
                                className="flex items-center justify-between gap-xs text-fg-secondary"
                              >
                                <span>
                                  {opt.method === "pickup"
                                    ? `Pickup — ${firstName} comes to you`
                                    : "Drop-off — meet at the start"}
                                </span>
                                <span className="font-semibold text-fg-primary">
                                  {opt.price.toLocaleString()} Kč
                                </span>
                              </span>
                            ))}
                        </div>
                      )}
                      {svc.notes && (
                        <p className="profile-service-notes">{svc.notes}</p>
                      )}
                      {!isSelf && (
                        <ButtonAction
                          variant="secondary"
                          size="sm"
                          cta
                          className="self-start"
                          onClick={() => {
                            if (isGuest) {
                              requireAuth(`book ${firstName}'s service`);
                              return;
                            }
                            setInquiryTarget({
                              service: svc.serviceType,
                              subService: svc.subServices[0] ?? null,
                            });
                          }}
                        >
                          Book a session
                        </ButtonAction>
                      )}
                    </div>
                        );
                      })}
                    {/* Meet-type — sessions the owner signs up for. Tap routes
                        to the linked series so the viewer can pick a date. */}
                    {userProfile.carerProfile.services
                      .filter((s): s is import("@/lib/types").CarerMeetServiceConfig => s.kind === "meet" && s.enabled)
                      .map((svc) => {
                        const formatLabel: Record<string, string> = {
                          one_on_one: "1-on-1",
                          small_group: "Small group",
                          workshop: "Workshop",
                        };
                        const cadenceLabel: Record<string, string> = {
                          weekly: "Weekly",
                          biweekly: "Every 2 weeks",
                          monthly: "Monthly",
                          ad_hoc: "By arrangement",
                        };
                        // Service ↔ Meet Linkage, 2026-05-13. One-to-many
                        // cardinality: a Meet service can run on N meets.
                        // B7 surfaces every linked meet's schedule below;
                        // C5 routes the Book CTA through `BookSessionSheet`
                        // (real Booking + roster entry) with a session
                        // picker across all linked meets.
                        const linkedMeets = svc.linkedMeetIds.flatMap((id) => {
                          const m = mockMeets.find((meet) => meet.id === id);
                          return m ? [m] : [];
                        });
                        const bookable = linkedMeets.length > 0;
                        return (
                          <div key={svc.id} className="profile-service-card">
                            <div className="profile-service-top">
                              <span className="profile-service-name">{svc.title}</span>
                              <div className="profile-service-price-wrap">
                                <span className="profile-service-price">
                                  {svc.pricePerSession.toLocaleString()} Kč
                                  <span className="profile-service-unit">{" "}/ session</span>
                                </span>
                              </div>
                            </div>
                            <div className="profile-service-subs">
                              <span className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary">
                                {formatLabel[svc.format] ?? svc.format}
                              </span>
                              <span className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary">
                                {cadenceLabel[svc.cadence] ?? svc.cadence}
                              </span>
                              <span className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary">
                                {svc.durationMinutes} min
                              </span>
                            </div>
                            {/* B7 — linked-meet schedule grounding: when and
                                where the sessions actually run. */}
                            {linkedMeets.length > 0 && (
                              <div className="flex flex-col gap-xs" style={{ marginTop: 4 }}>
                                {linkedMeets.map((meet) => (
                                  <span
                                    key={meet.id}
                                    className="flex items-center gap-xs text-xs text-fg-tertiary"
                                  >
                                    <CalendarBlank size={13} weight="light" className="shrink-0" />
                                    <span>
                                      {meetScheduleSummary(meet)} · {meet.location}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}
                            {svc.notes && (
                              <p className="profile-service-notes">{svc.notes}</p>
                            )}
                            {!isSelf && (
                              bookable ? (
                                <ButtonAction
                                  variant="secondary"
                                  size="sm"
                                  cta
                                  className="self-start"
                                  onClick={() =>
                                    isGuest
                                      ? requireAuth(`book ${firstName}'s session`)
                                      : setBookingService(svc)
                                  }
                                >
                                  Book a session
                                </ButtonAction>
                              ) : (
                                <ButtonAction
                                  variant="secondary"
                                  size="sm"
                                  cta
                                  className="self-start"
                                  {...(isGuest
                                    ? { onClick: () => requireAuth(`book ${firstName}'s service`) }
                                    : { href: `/profile/${userId}?tab=chat` })}
                                >
                                  Ask about this
                                </ButtonAction>
                              )
                            )}
                          </div>
                        );
                      })}
                    {/* Appointment-type — vet / grooming. Specific time slot,
                        no roster. Tap routes to chat with service context so
                        the inquiry form pre-fills with the appointment kind. */}
                    {userProfile.carerProfile.services
                      .filter((s): s is import("@/lib/types").CarerAppointmentServiceConfig => s.kind === "appointment" && s.enabled)
                      .map((svc) => (
                        <div key={svc.id} className="profile-service-card">
                          <div className="profile-service-top">
                            <span className="profile-service-name">{svc.title}</span>
                            <div className="profile-service-price-wrap">
                              <span className="profile-service-price">
                                {svc.pricePerAppointment.toLocaleString()} Kč
                                <span className="profile-service-unit">{" "}/ appointment</span>
                              </span>
                            </div>
                          </div>
                          <div className="profile-service-subs">
                            <span className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary">
                              {svc.appointmentCategory === "training" ? "Training visit" : "Grooming"}
                            </span>
                            <span className="rounded-pill px-sm py-xs text-xs bg-surface-popout border border-edge-regular text-fg-secondary">
                              {svc.durationMinutes} min
                            </span>
                          </div>
                          {svc.notes && (
                            <p className="profile-service-notes">{svc.notes}</p>
                          )}
                          {!isSelf && (
                            <ButtonAction
                              variant="secondary"
                              size="sm"
                              cta
                              className="self-start"
                              {...(isGuest
                                ? { onClick: () => requireAuth(`ask about ${firstName}'s appointment`) }
                                : { href: `/profile/${userId}?tab=chat&appointment=${svc.id}` })}
                            >
                              Ask about this
                            </ButtonAction>
                          )}
                        </div>
                      ))}
                  </>
                  : (provider?.services ?? communityCarer?.services ?? []).map((svcType) => {
                    // Directory-only carers carry a single `priceUnit` that
                    // applies to every service in their catalogue, which is
                    // wrong when the catalogue mixes service types. Map per
                    // service type instead — sitting/walks render in their
                    // natural unit, boarding always per night. Pricing &
                    // Proposals walkthrough 2026-05-04.
                    const unitWord =
                      svcType === "boarding"
                        ? "night"
                        : svcType === "day_care" || svcType === "house_sitting"
                          ? "visit"
                          : "walk";
                    return (
                      <div key={svcType} className="profile-service-card">
                        <div className="profile-service-top">
                          <span className="profile-service-name">{SERVICE_LABELS[svcType]}</span>
                          <div className="profile-service-price-wrap">
                            <span className="profile-service-price">
                              <span className="profile-service-price-from">From </span>
                              {(provider?.priceFrom ?? communityCarer?.priceFrom ?? 0).toLocaleString()} Kč
                              <span className="profile-service-unit">{" "}/ {unitWord}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </section>

              {/* Availability — shared `AvailabilityGrid` component with
                  full Mon–Sun + muted inactive slots. */}
              {userProfile?.carerProfile?.availability && userProfile.carerProfile.availability.length > 0 && (
                <section>
                  <h3 className="profile-card-subtitle">Availability</h3>
                  <AvailabilityGrid availability={userProfile.carerProfile.availability} />
                </section>
              )}
            </div>
          );
        })()}

        {/* ── Chat tab ── */}
        {!isLocked && activeTab === "chat" && showChatTab && (() => {
          // If we arrived via an appointment-card CTA, look up the title
          // and pre-fill the chat input with a templated opener. Skips the
          // "Say hello" empty state — the owner has clear intent already.
          const appointmentService = appointmentParam
            ? userProfile?.carerProfile?.services.find(
                (s) => s.kind === "appointment" && s.id === appointmentParam,
              )
            : undefined;
          const initialDraft =
            appointmentService?.kind === "appointment"
              ? `Hi ${firstName}, I'd like to book the ${appointmentService.title}. When works for you?`
              : undefined;
          return (
            <ProfileChatTab
              userId={userId}
              userName={name}
              avatarUrl={avatarUrl}
              initialDraft={initialDraft}
            />
          );
        })()}

        {/* InquiryFormModal — opens from a Care service card "Book a session"
            CTA on the Services tab. Renders here so it sits above the
            page content and is mountable from any tab. */}
        {inquiryTarget && (
          <InquiryFormModal
            open={!!inquiryTarget}
            onClose={() => setInquiryTarget(null)}
            provider={{ id: userId, name, avatarUrl }}
            service={inquiryTarget.service}
            subService={inquiryTarget.subService}
          />
        )}

        {/* BookSessionSheet — opens from a Meet-type service card's "Book a
            session" CTA (Service ↔ Meet Linkage C5). Session picker spans
            all of the service's linked meets. */}
        {bookingService && (
          <BookSessionSheet
            open
            onClose={() => setBookingService(null)}
            service={bookingService}
            carer={{ id: userId, name, avatarUrl }}
          />
        )}

        {activeTab !== "chat" && <Spacer />}
      </div>
    </PageColumn>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div />}>
      <UserProfileInner />
    </Suspense>
  );
}
