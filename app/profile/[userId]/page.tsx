"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import {
  PawPrint,
  MapPin,
  CalendarDots,
  ChatCircleDots,
  LockSimple,
  UsersThree,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { Spacer } from "@/components/layout/Spacer";
import { ConnectionIcon } from "@/components/ui/ConnectionIcon";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { TrustSignalBadges } from "@/components/profile/TrustSignalBadges";
import { PetCard } from "@/components/profile/PetCard";
import { PostsTab } from "@/components/profile/PostsTab";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { providers } from "@/lib/mockData";
import { getUserById } from "@/lib/mockUsers";
import { SERVICE_LABELS } from "@/lib/constants/services";

/* ── Page ── */

function UserProfileInner() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "about";

  const handleTabChange = useCallback((key: string) => {
    if (key === "about") {
      router.replace(`/profile/${userId}`, { scroll: false });
    } else {
      router.replace(`/profile/${userId}?tab=${key}`, { scroll: false });
    }
  }, [router, userId]);

  // Resolve user data from multiple sources
  const connection = getConnectionState(userId);
  const userProfile = getUserById(userId);
  const provider = providers.find((p) => p.id === userId || p.userId === userId);
  const communityCarer = getCommunityCarers().find((c) => c.userId === userId);

  const name = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : connection?.userName ?? provider?.name ?? userId;
  const firstName = userProfile?.firstName ?? name.split(" ")[0];
  const avatarUrl = userProfile?.avatarUrl ?? connection?.avatarUrl ?? provider?.avatarUrl ?? "";
  const location = userProfile?.location ?? connection?.location ?? provider?.district ?? "";
  const dogs = userProfile?.pets ?? [];
  const dogNames = connection?.dogNames ?? dogs.map((d) => d.name);
  const connState = connection?.state ?? "none";
  const isProfileOpen = connection?.profileOpen ?? false;
  const sharedGroups = connection?.sharedGroups ?? [];

  const hasCare = !!userProfile?.carerProfile || !!provider || !!communityCarer;
  const isLocked = !isProfileOpen && connState === "none";

  const tabs = [
    { key: "about", label: "About" },
    { key: "posts", label: "Posts" },
    ...(hasCare ? [{ key: "services", label: "Services" }] : []),
  ];

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader title={name} />}>
      <div className="page-column-panel-body">

        {/* Tabs — hidden for locked profiles */}
        {!isLocked && (
          <div className="page-column-panel-tabs">
            <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        )}

        {/* ── Locked profile state ── */}
        {isLocked && (
          <div className="flex flex-col items-center gap-lg" style={{ padding: "var(--space-xl) var(--space-lg)" }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="rounded-full object-cover"
                style={{ width: 96, height: 96, filter: "brightness(0.6) blur(1px)" }}
              />
            ) : (
              <DefaultAvatar name={name} size={96} />
            )}
            <h1 className="font-heading text-xl font-semibold text-fg-primary m-0">{name}</h1>

            <div className="flex flex-col items-center gap-sm rounded-panel p-lg bg-surface-inset w-full" style={{ maxWidth: 360 }}>
              <LockSimple size={28} weight="light" className="text-fg-tertiary" />
              <p className="text-sm text-fg-secondary m-0 text-center">
                {name} has a private profile. Connect with them at a meet or community to see more.
              </p>
              {sharedGroups.length > 0 && (
                <p className="text-xs text-fg-tertiary m-0 flex items-center gap-xs">
                  <UsersThree size={14} weight="light" />
                  You&apos;re both in {sharedGroups[0]}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── About tab ── */}
        {!isLocked && activeTab === "about" && (
          <div className="flex flex-col gap-lg" style={{ padding: "var(--space-lg)" }}>

            {/* Hero section */}
            <div className="flex flex-col items-center gap-md" style={{ paddingBottom: "var(--space-md)" }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="rounded-full object-cover"
                  style={{ width: 96, height: 96 }}
                />
              ) : (
                <DefaultAvatar name={name} size={96} />
              )}
              <div className="flex flex-col items-center gap-xs text-center">
                <h1 className="font-heading text-xl font-semibold text-fg-primary m-0">{name}</h1>
                {location && (
                  <span className="flex items-center gap-xs text-sm text-fg-secondary">
                    <MapPin size={13} weight="fill" className="shrink-0" /> {location}
                  </span>
                )}
                {dogNames.length > 0 && (
                  <span className="flex items-center gap-xs text-sm text-fg-tertiary">
                    <PawPrint size={13} weight="light" className="shrink-0" />
                    {dogNames.join(", ")}
                    {connection?.dogBreed && ` · ${connection.dogBreed}`}
                  </span>
                )}
              </div>

              {/* Connection state */}
              <div className="flex items-center gap-sm flex-wrap justify-center">
                <ConnectionIcon
                  state={connState}
                  theyMarkedFamiliar={connection?.theyMarkedFamiliar}
                  profileOpen={isProfileOpen}
                  size={16}
                  showLabel
                />
                {communityCarer && communityCarer.meetsShared > 0 && (
                  <span className="text-xs text-fg-tertiary">
                    {communityCarer.meetsShared} meets together
                  </span>
                )}
                {provider?.mutualConnections && provider.mutualConnections > 0 && (
                  <span className="text-xs text-fg-tertiary">
                    {provider.mutualConnections} mutual connections
                  </span>
                )}
              </div>

              {connection && <TrustSignalBadges connection={connection} />}

              {/* CTA buttons */}
              <div className="flex gap-sm w-full" style={{ maxWidth: 400 }}>
                {connState === "connected" && (
                  <>
                    <ButtonAction variant="primary" size="md" cta className="flex-1"
                      leftIcon={<ChatCircleDots size={16} weight="fill" />}
                      href="/inbox">
                      Message
                    </ButtonAction>
                    {hasCare && (
                      <ButtonAction variant="outline" size="md" cta className="flex-1"
                        leftIcon={<CalendarDots size={16} weight="light" />}
                        href="/inbox">
                        Book care
                      </ButtonAction>
                    )}
                  </>
                )}
                {connState === "familiar" && (
                  <ButtonAction variant="primary" size="md" cta className="flex-1">
                    Connect with {firstName}
                  </ButtonAction>
                )}
                {connState === "pending" && (
                  <ButtonAction variant="outline" size="md" cta className="flex-1" disabled>
                    Request sent
                  </ButtonAction>
                )}
              </div>
            </div>

            {/* About section */}
            {(provider?.blurb || userProfile?.bio || connection) && (
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">About</h3>
                <p className="profile-card-copy">
                  {provider?.blurb ?? userProfile?.bio ?? `${name} is a dog owner in ${location}.`}
                </p>
              </section>
            )}

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

            {/* Dogs — PetCards with collapsed default for other users */}
            {dogs.length > 0 && (
              <section className="flex flex-col gap-md">
                <h3 className="profile-card-subtitle" style={{ padding: "0 var(--space-lg)" }}>
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
        {!isLocked && activeTab === "services" && (
          <div className="flex flex-col gap-lg" style={{ padding: "var(--space-lg)" }}>
            {/* Open to helping badge */}
            <section className="profile-info-card">
              <span className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
                style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)", display: "inline-flex" }}>
                <PawPrint size={16} weight="fill" /> Open to helping
              </span>
            </section>

            {/* Service cards — from provider catalog or community carer data */}
            <section className="profile-info-card">
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="profile-services-list">
                {(provider?.services ?? communityCarer?.services ?? []).map((svcType) => (
                  <div key={svcType} className="profile-service-card">
                    <div className="profile-service-top">
                      <span className="profile-service-name">{SERVICE_LABELS[svcType]}</span>
                      <div className="profile-service-price-wrap">
                        <span className="profile-service-price">
                          from {(provider?.priceFrom ?? communityCarer?.priceFrom ?? 0).toLocaleString()} Kč
                          {provider?.priceUnit && (
                            <span className="profile-service-unit">
                              {" "}/ {provider.priceUnit === "per_visit" ? "visit" : provider.priceUnit === "per_walk" ? "walk" : "night"}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        <Spacer />
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
