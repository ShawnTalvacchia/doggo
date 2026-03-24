"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  PawPrint,
  MapPin,
  CalendarDots,
  Handshake,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { TrustSignalBadges } from "@/components/profile/TrustSignalBadges";
import { PostsTab } from "@/components/profile/PostsTab";
import { getConnectionState, getCommunityCarers } from "@/lib/mockConnections";
import { providers } from "@/lib/mockData";
import { SERVICE_LABELS } from "@/lib/constants/services";

type ProfileTab = "about" | "posts" | "services";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<ProfileTab>("about");

  // Find user data from connections + providers
  const connection = getConnectionState(userId);
  const provider = providers.find((p) => p.id === userId);
  const communityCarer = getCommunityCarers().find((c) => c.userId === userId);

  const name = connection?.userName ?? provider?.name ?? userId;
  const avatarUrl = connection?.avatarUrl ?? provider?.avatarUrl ?? "";
  const location = connection?.location ?? provider?.district ?? "";
  const dogs = connection?.dogNames ?? [];
  const connState = connection?.state ?? "none";

  const offersCare = !!provider || !!communityCarer;

  const tabs: { key: ProfileTab; label: string; show: boolean }[] = [
    { key: "about", label: "About", show: true },
    { key: "posts", label: "Posts", show: true },
    { key: "services", label: "Services", show: offersCare },
  ];

  return (
    <main className="profile-page-shell">
      <section className="profile-page-panel" style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Back nav */}
        <div className="flex items-center gap-sm p-md" style={{ borderBottom: "1px solid var(--border-light)" }}>
          <Link href="/home" className="flex items-center gap-xs text-sm text-fg-secondary" style={{ textDecoration: "none" }}>
            <ArrowLeft size={16} weight="light" /> Back
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-md p-lg text-center">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={name}
              className="rounded-full"
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          )}
          <div>
            <h1 className="font-heading text-xl font-semibold text-fg-primary m-0">{name}</h1>
            {location && (
              <p className="flex items-center justify-center gap-xs text-sm text-fg-secondary mt-xs">
                <MapPin size={14} weight="light" /> {location}
              </p>
            )}
            {dogs.length > 0 && (
              <p className="flex items-center justify-center gap-xs text-sm text-fg-tertiary mt-xs">
                <PawPrint size={14} weight="light" /> {dogs.join(", ")}
              </p>
            )}
          </div>

          {/* Connection state + trust context */}
          <div className="flex items-center gap-sm flex-wrap justify-center">
            {connState === "connected" && (
              <span className="flex items-center gap-xs rounded-pill px-md py-xs text-xs font-medium"
                style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}>
                <Handshake size={14} weight="fill" /> Connected
              </span>
            )}
            {connState === "familiar" && (
              <span className="flex items-center gap-xs rounded-pill px-md py-xs text-xs font-medium"
                style={{ background: "var(--surface-gray)", color: "var(--text-secondary)" }}>
                Familiar
              </span>
            )}
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

          {/* Trust signal badges */}
          {connection && <TrustSignalBadges connection={connection} />}

          {/* CTA */}
          <div className="flex items-center gap-sm">
            {connState === "connected" && (
              <>
                <ButtonAction variant="primary" size="md" href={`/inbox`}
                  leftIcon={<ChatCircleDots size={16} weight="light" />}>
                  Message {name.split(" ")[0]}
                </ButtonAction>
                {offersCare && (
                  <ButtonAction variant="secondary" size="md" href={`/inbox`}
                    leftIcon={<CalendarDots size={16} weight="light" />}>
                    Book care
                  </ButtonAction>
                )}
              </>
            )}
            {connState === "familiar" && (
              <ButtonAction variant="primary" size="md">
                Connect with {name.split(" ")[0]}
              </ButtonAction>
            )}
            {connState === "pending" && (
              <ButtonAction variant="outline" size="md" disabled>
                Request sent
              </ButtonAction>
            )}
            {connState === "none" && (
              <ButtonAction variant="secondary" size="md" disabled>
                Meet {name.split(" ")[0]} first
              </ButtonAction>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs" role="tablist" aria-label="Profile sections">
          {tabs.filter((t) => t.show).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`profile-tab${activeTab === key ? " profile-tab--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-lg">
          {activeTab === "about" && (
            <div className="flex flex-col gap-lg">
              {provider?.blurb && (
                <section className="profile-info-card">
                  <h3 className="profile-card-subtitle">About</h3>
                  <p className="profile-card-copy">{provider.blurb}</p>
                </section>
              )}
              {!provider?.blurb && connection && (
                <section className="profile-info-card">
                  <h3 className="profile-card-subtitle">About</h3>
                  <p className="profile-card-copy text-fg-secondary">
                    {name} is a dog owner in {location}.
                  </p>
                </section>
              )}
              {provider && (
                <section className="profile-info-card">
                  <div className="flex items-center gap-sm">
                    <span className="text-sm text-fg-secondary">
                      {provider.rating} ★ · {provider.reviewCount} reviews
                    </span>
                    {provider.distanceKm && (
                      <span className="text-sm text-fg-tertiary">
                        · {provider.distanceKm} km away
                      </span>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === "services" && provider && (
            <div className="flex flex-col gap-lg">
              <section className="profile-info-card">
                <div className="flex items-center gap-sm">
                  <span className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
                    style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}>
                    <PawPrint size={16} weight="fill" /> Open to helping
                  </span>
                </div>
              </section>
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">Services</h3>
                <div className="profile-services-list">
                  {provider.services.map((svcType) => (
                    <div key={svcType} className="profile-service-card">
                      <div className="profile-service-top">
                        <span className="profile-service-name">{SERVICE_LABELS[svcType]}</span>
                        <div className="profile-service-price-wrap">
                          <span className="profile-service-price">
                            from {provider.priceFrom.toLocaleString()} Kč
                            <span className="profile-service-unit">
                              {" "}/ {provider.priceUnit === "per_visit" ? "visit" : provider.priceUnit === "per_walk" ? "walk" : "night"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "services" && !provider && communityCarer && (
            <div className="flex flex-col gap-lg">
              <section className="profile-info-card">
                <div className="flex items-center gap-sm">
                  <span className="flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium"
                    style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}>
                    <PawPrint size={16} weight="fill" /> Open to helping
                  </span>
                </div>
              </section>
              <section className="profile-info-card">
                <h3 className="profile-card-subtitle">Services</h3>
                <div className="profile-services-list">
                  {communityCarer.services.map((svcType) => (
                    <div key={svcType} className="profile-service-card">
                      <div className="profile-service-top">
                        <span className="profile-service-name">{SERVICE_LABELS[svcType]}</span>
                        <div className="profile-service-price-wrap">
                          <span className="profile-service-price">
                            from {communityCarer.priceFrom} Kč
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "posts" && (
            <PostsTab userId={userId} />
          )}
        </div>
      </section>
    </main>
  );
}
