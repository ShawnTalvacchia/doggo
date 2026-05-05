"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  PawPrint,
  MapPin,
  Calendar,
  CalendarDots,
  ChatCircleDots,
  LockSimple,
  UsersThree,
  Plus,
  Check,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
import { ConnectionIcon } from "@/components/ui/ConnectionIcon";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { TrustSignalBadges } from "@/components/profile/TrustSignalBadges";
import { TrustBadgeStrip } from "@/components/badges/TrustBadgeStrip";
import { getTrustBadges, userProfileToTrustSubject } from "@/lib/trustBadges";
import { PetCard } from "@/components/profile/PetCard";
import { PostsTab } from "@/components/profile/PostsTab";
import { ProfileChatTab } from "@/components/profile/ProfileChatTab";
import { AvailabilityGrid } from "@/components/profile/AvailabilityGrid";
import { InquiryFormModal } from "@/components/messaging/InquiryFormModal";
import type { ServiceType } from "@/lib/types";
import { getCommunityCarers } from "@/lib/mockConnections";
import { viewerSharedMeetWith } from "@/lib/mockMeets";
import { viewerSharedGroupWith, getSharedGroupNames } from "@/lib/mockGroups";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUser, useCurrentUserId } from "@/hooks/useCurrentUser";
import { resolvePersonActions } from "@/lib/personActions";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { providers } from "@/lib/mockData";
import { getUserOrProvider } from "@/lib/mockUsers";
import { SERVICE_LABELS } from "@/lib/constants/services";

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
  const isSelf = userId === currentUserId;

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
  const showChatTab = connState === "connected" || !!existingConv || isProviderTier;

  // Inquiry modal — opened from a service card "Book a session" CTA.
  // Stays on Services tab; modal posts the InquiryCard message to the
  // (owner, provider) thread on submit. Discover & Care 2026-05-03 refactor.
  const [inquiryTarget, setInquiryTarget] = useState<
    { service: ServiceType; subService: string | null } | null
  >(null);

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
        router.replace("/home");
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
              className="flex flex-col items-center"
              style={{
                padding: "var(--space-jumbo-1) var(--space-lg) var(--space-xxxl)",
                gap: "var(--space-xxl)",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={firstName}
                  className="rounded-full object-cover"
                  style={{ width: 96, height: 96, filter: "brightness(0.6) blur(1px)" }}
                />
              ) : (
                <DefaultAvatar name={firstName} size={96} />
              )}
              <h1 className="font-heading text-2xl font-medium text-fg-primary m-0">{firstName}</h1>

              {/* Familiar action surface — placed ABOVE the lock card so the
                  call-to-action reads first and the privacy state reads as
                  context. Pre-tap copy invites recognition; post-tap copy
                  explains the asymmetric grant ("they can see more of YOU").
                  Both copy variants are intentionally short and scoped to
                  the action's effect — the deeper explainer is the
                  "Learn how privacy works" link below the lock card.
                  Mock World Building 2026-04-30. */}
              {hasSharedContext && (
                <div className="flex flex-col items-center gap-sm">
                  <p
                    className="text-sm text-fg-secondary m-0 text-center"
                    style={{ maxWidth: 360 }}
                  >
                    {isMarked
                      ? `${firstName} can now see your profile and tags from shared contexts.`
                      : `Have you met ${firstName}? Mark them familiar to let them see your profile.`}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      isMarked
                        ? unmarkFamiliar(currentUserId, userId)
                        : markFamiliar(currentUserId, userId)
                    }
                    className={`private-profile-row-pill${isMarked ? " is-marked" : ""}`}
                    aria-pressed={isMarked}
                    aria-label={
                      isMarked ? `Remove Familiar from ${firstName}` : `Mark ${firstName} as Familiar`
                    }
                  >
                    {isMarked ? "Familiar ✓" : "+ Familiar"}
                  </button>
                </div>
              )}

              <div
                className="flex flex-col items-center gap-sm rounded-panel bg-surface-inset w-full"
                style={{ maxWidth: 360, padding: "var(--space-xl) var(--space-lg)" }}
              >
                <LockSimple size={28} weight="light" className="text-fg-tertiary" />
                <p className="text-sm text-fg-secondary m-0 text-center">
                  {firstName} keeps their profile private. People typically see more after meeting at a walk or community.
                </p>
                {sharedGroupNames.length > 0 && (
                  <p className="text-xs text-fg-tertiary m-0 flex items-center gap-xs">
                    <UsersThree size={14} weight="light" />
                    You&apos;re both in {sharedGroupNames[0]}
                  </p>
                )}
              </div>
              {/* Privacy explainer link — routes to /help/privacy.
                  Inline `text-decoration: underline` overrides the global
                  `a { text-decoration: none }` rule in globals.css. */}
              <Link
                href="/help/privacy"
                className="text-sm font-semibold text-fg-primary hover:text-brand-main"
                style={{
                  marginTop: "var(--space-lg)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Learn how privacy works
              </Link>
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
                  {!isSelf && (() => {
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
                      <div className="flex gap-sm w-full" style={{ marginTop: "var(--space-md)" }}>
                        {leftSlot === "mark_familiar" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="flex-1"
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
                            className="flex-1"
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
                            className="flex-1"
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
                            className="flex-1"
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
                            className="flex-1"
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
                            className="flex-1"
                          >
                            Connect with {firstName}
                          </ButtonAction>
                        )}
                        {rightSlot === "request_sent" && (
                          <ButtonAction
                            variant="outline"
                            size="md"
                            cta
                            className="flex-1"
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
                <p className="flex items-center gap-xs text-xs text-fg-tertiary m-0" style={{ marginTop: "var(--space-sm)" }}>
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
          </div>
        )}

        {/* ── Posts tab ── */}
        {!isLocked && activeTab === "posts" && (
          <PostsTab userId={userId} />
        )}

        {/* ── Services tab ── */}
        {!isLocked && activeTab === "services" && (() => {
          // "Open to helping" is the **Helper-tier** signal — for users who
          // casually offer care to their network without being publicly
          // discoverable. Hide it for Provider-tier users (publicProfile:
          // true) — they're a different tier on the same dial, the badge
          // is redundant and reads as inconsistent on a public-Provider
          // surface. Tier check is structural; the older `hasListedServices`
          // heuristic missed directory-only Providers (Olga, Markéta) whose
          // services come from the ProviderCard fallback path, not from
          // `carerProfile.services`. Pricing & Proposals, 2026-05-04.
          const isProviderTier = userProfile?.carerProfile?.publicProfile === true;
          const isDirectoryProvider = !!provider; // listed in `/discover/care`
          const showHelpingBadge =
            (userProfile?.openToHelping ?? false) && !isProviderTier && !isDirectoryProvider;
          return (
            <div className="profile-tab-stack" style={{ padding: "var(--space-lg)" }}>
              {/* Helper-tier explainer — communicates that the services on
                  this profile are gated to the carer's connections (not a
                  public Provider). The small inline badge previously here
                  surfaced "Open to helping" without explaining what that
                  meant — the explainer card now sets expectations clearly.
                  Pricing & Proposals walkthrough 2026-05-05. Future:
                  Onboarding & In-Product Communication phase may layer a
                  "what does this mean?" tooltip on top to teach the broader
                  trust model (Helper vs Provider tier). */}
              {showHelpingBadge && (
                <section
                  className="flex items-start gap-md rounded-panel p-md border border-edge-regular"
                  style={{ background: "var(--brand-subtle)" }}
                >
                  <PawPrint
                    size={20}
                    weight="fill"
                    className="shrink-0"
                    style={{ color: "var(--brand-strong)", marginTop: 2 }}
                  />
                  <div className="flex flex-col gap-xxs">
                    <p className="text-sm font-semibold text-fg-primary m-0">
                      Open to helping
                    </p>
                    <p className="text-sm text-fg-secondary m-0 leading-snug">
                      {firstName} offers care to their connections — people they&apos;ve met through the community.
                    </p>
                  </div>
                </section>
              )}

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
                    {/* Care-type — drop-off (Walking, Sitting, Boarding) */}
                    {userProfile.carerProfile.services
                      .filter((s): s is import("@/lib/types").CarerCareServiceConfig => s.kind === "care" && s.enabled)
                      .map((svc) => (
                    <div key={svc.serviceType} className="profile-service-card">
                      <div className="profile-service-top">
                        <span className="profile-service-name">{SERVICE_LABELS[svc.serviceType]}</span>
                        <div className="profile-service-price-wrap">
                          <span className="profile-service-price">
                            {/* "From" telegraphs that the final quote depends
                                on inquiry specifics (multi-pet, holiday, etc.)
                                — surfaced in the proposal, not the catalogue.
                                Pricing & Proposals, 2026-05-04. */}
                            {(svc.modifiers ?? []).some((m) => m.enabled) && (
                              <span className="profile-service-price-from">From </span>
                            )}
                            {svc.pricePerUnit.toLocaleString()} Kč
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
                      {svc.notes && (
                        <p className="profile-service-notes">{svc.notes}</p>
                      )}
                      {!isSelf && (
                        <ButtonAction
                          variant="secondary"
                          size="sm"
                          cta
                          className="self-start"
                          onClick={() => setInquiryTarget({
                            service: svc.serviceType,
                            subService: svc.subServices[0] ?? null,
                          })}
                        >
                          Book a session
                        </ButtonAction>
                      )}
                    </div>
                  ))}
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
                        const ctaHref = svc.seriesMeetId
                          ? `/meets/${svc.seriesMeetId}`
                          : `/profile/${userId}?tab=chat`;
                        const ctaLabel = svc.seriesMeetId ? "See upcoming sessions" : "Ask about this";
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
                            {svc.notes && (
                              <p className="profile-service-notes">{svc.notes}</p>
                            )}
                            {!isSelf && (
                              <ButtonAction
                                variant="secondary"
                                size="sm"
                                cta
                                className="self-start"
                                href={ctaHref}
                              >
                                {ctaLabel}
                              </ButtonAction>
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
                              {svc.appointmentCategory === "vet" ? "Vet" : "Grooming"}
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
                              href={`/profile/${userId}?tab=chat&appointment=${svc.id}`}
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
                        : svcType === "inhome_sitting"
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

        {/* InquiryFormModal — opens from a service card "Book a session"
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
