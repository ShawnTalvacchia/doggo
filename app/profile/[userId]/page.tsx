"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import {
  PawPrint,
  MapPin,
  Calendar,
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
import { ProfileChatTab } from "@/components/profile/ProfileChatTab";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
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

  // Show Chat tab when connected or when there's an existing conversation
  const { getConversationForUser } = useConversations();
  const existingConv = getConversationForUser(userId);
  const showChatTab = connState === "connected" || !!existingConv;

  const tabs = [
    { key: "about", label: "About" },
    { key: "posts", label: "Posts" },
    ...(hasCare ? [{ key: "services", label: "Services" }] : []),
    ...(showChatTab ? [{ key: "chat", label: "Chat" }] : []),
  ];

  // Mobile nav: show name with back button, hide bottom nav
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  useEffect(() => {
    setDetailHeader(name, () => router.back());
    document.body.classList.add("profile-subpage");
    return () => {
      clearDetailHeader();
      document.body.classList.remove("profile-subpage");
    };
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader title={name} />}>
      <div className={`page-column-panel-body${activeTab === "chat" ? " page-column-panel-body--no-scroll" : ""}`}>

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
                      onClick={() => handleTabChange("chat")}>
                      Message
                    </ButtonAction>
                    {hasCare && (
                      <ButtonAction variant="outline" size="md" cta className="flex-1"
                        leftIcon={<CalendarDots size={16} weight="light" />}
                        onClick={() => handleTabChange("chat")}>
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
            <section className="profile-info-card">
              <h3 className="profile-card-subtitle">About</h3>
              <p className="profile-card-copy">
                {userProfile?.bio ?? provider?.blurb ?? `${name} is a dog owner in ${location}.`}
              </p>
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
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">About their care services</h3>
                <p className="profile-card-copy">{userProfile.carerProfile.bio}</p>
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

            {/* Service cards — prefer carerProfile (richer), fallback to provider catalog */}
            <section className="profile-info-card">
              <h3 className="profile-card-subtitle">Services</h3>
              <div className="profile-services-list">
                {userProfile?.carerProfile?.services
                  ? userProfile.carerProfile.services.filter(s => s.enabled).map((svc) => (
                    <div key={svc.serviceType} className="profile-service-card">
                      <div className="profile-service-top">
                        <span className="profile-service-name">{SERVICE_LABELS[svc.serviceType]}</span>
                        <div className="profile-service-price-wrap">
                          <span className="profile-service-price">
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
                            <span key={sub} className="rounded-pill px-sm py-xs text-xs bg-surface-inset text-fg-secondary">{sub}</span>
                          ))}
                        </div>
                      )}
                      {svc.notes && (
                        <p className="profile-service-notes">{svc.notes}</p>
                      )}
                    </div>
                  ))
                  : (provider?.services ?? communityCarer?.services ?? []).map((svcType) => (
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
                  ))
                }
              </div>
            </section>

            {/* Availability */}
            {userProfile?.carerProfile?.availability && userProfile.carerProfile.availability.length > 0 && (
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">Availability</h3>
                <div className="profile-avail-grid">
                  {userProfile.carerProfile.availability.map((slot) => (
                    <div key={slot.day} className="profile-avail-row">
                      <span className="profile-avail-day">{slot.day.charAt(0).toUpperCase() + slot.day.slice(1, 3)}</span>
                      <div className="profile-avail-slots">
                        {slot.slots.map((s) => (
                          <span key={s} className="rounded-pill px-sm py-xs text-xs bg-brand-subtle text-brand-strong">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── Chat tab ── */}
        {!isLocked && activeTab === "chat" && showChatTab && (
          <ProfileChatTab userId={userId} userName={name} avatarUrl={avatarUrl} />
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
