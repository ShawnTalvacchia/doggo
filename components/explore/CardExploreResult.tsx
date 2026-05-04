"use client";

import Link from "next/link";
import { Handshake, MapPin, PawPrint, Star, Users } from "@phosphor-icons/react";
import { ProviderCard, ServiceType } from "@/lib/types";
import { getConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";
import { getTrustBadges, userProfileToTrustSubject } from "@/lib/trustBadges";
import { TrustBadgeStrip } from "@/components/badges/TrustBadgeStrip";
import { useCurrentUserId } from "@/hooks/useCurrentUser";

type CardExploreResultProps = {
  provider: ProviderCard;
  activeService?: ServiceType | null;
  /** Full query string from the results page (e.g. "service=walk_checkin&minRate=200") */
  returnQuery?: string;
};

function formatUnit(unit: ProviderCard["priceUnit"]) {
  if (unit === "per_visit") return "per visit";
  if (unit === "per_night") return "per night";
  return "per walk";
}

const serviceLabels: Record<ServiceType, string> = {
  walk_checkin: "Walks",
  inhome_sitting: "Home sitting",
  boarding: "Boarding",
};

export function CardExploreResult({
  provider,
  activeService,
  returnQuery,
}: CardExploreResultProps) {
  const currentUserId = useCurrentUserId();
  const profileId = provider.userId ?? provider.id;
  const conn = getConnectionState(profileId, currentUserId);
  const connBadge = conn?.state === "connected" ? "Connected" : conn?.state === "familiar" ? "Familiar" : null;

  // Trust signals — community-first framing for Discover & Care D2.
  // Prefer dynamic per-viewer counts from the connection record; fall back
  // to the static `provider.mutualConnections` for directory-only providers
  // who don't appear in any persona's roster.
  const meetsShared = conn?.meetsShared ?? 0;
  const networkOverlap = conn?.mutualConnections?.length ?? provider.mutualConnections ?? 0;

  // Trust badges — Discover & Care D6. Top 2 most relevant per the
  // priority rule (community-earned > credential > platform). When the
  // provider has a UserProfile (via `userId` bridge), pull credentials
  // from there; otherwise read directly from the ProviderCard fields
  // (directory-only providers carry their own credential data).
  const subjectUser = getUserById(profileId);
  const trustSubject = subjectUser
    ? userProfileToTrustSubject(subjectUser)
    : {
        id: profileId,
        firstName: provider.name.split(" ")[0] ?? "",
        credentials: provider.credentials,
        repeatClients: provider.repeatClients,
      };
  const trustBadges = getTrustBadges(trustSubject, currentUserId).slice(0, 2);

  // Carry the full filter state into the profile URL so back navigation can restore it.
  const profileHref = returnQuery
    ? `/profile/${profileId}?${returnQuery}`
    : activeService
      ? `/profile/${profileId}?service=${activeService}`
      : `/profile/${profileId}`;

  return (
    <Link href={profileHref} className="result-card">
      <div className="result-head">
        <img
          src={provider.avatarUrl}
          alt={provider.name}
          className={`avatar${conn?.state === "connected" ? " avatar-connected" : conn?.state === "familiar" ? " avatar-familiar" : ""}`}
        />
        <div className="result-main">
          <div className="result-name">
            <span>{provider.name}</span>
            {connBadge && (
              <span className="inline-flex items-center gap-xs rounded-pill font-medium"
                style={{
                  // Pattern: parallel chip shapes; color carries the
                  // intensity. Connected = brand fill (the strong moment,
                  // gets the Handshake icon); Familiar = neutral fill (the
                  // soft acknowledgement, no icon). Same padding / font /
                  // shape so the chips read as siblings rather than
                  // escalating noise. Discover & Care 2026-05-04.
                  background: conn?.state === "connected" ? "var(--brand-subtle)" : "var(--surface-inset)",
                  color: conn?.state === "connected" ? "var(--brand-strong)" : "var(--text-secondary)",
                  fontSize: 10,
                  padding: "1px 6px",
                  verticalAlign: "middle",
                }}
              >
                {conn?.state === "connected" && <Handshake size={10} weight="fill" />}
                {connBadge}
              </span>
            )}
          </div>
          <div className="result-location">
            {provider.district}, {provider.neighborhood}
          </div>
          <div className="result-rating">
            <Star size={13} weight="fill" className="result-star" />
            <span>{provider.rating.toFixed(1)}</span>
            <span className="result-review-count">({provider.reviewCount})</span>
          </div>
        </div>
        <div className="result-price-col">
          <div className="result-price-from">from</div>
          <div className="result-price">{`${provider.priceFrom} Kč`}</div>
          <div className="result-price-unit">{formatUnit(provider.priceUnit)}</div>
        </div>
      </div>

      {/* Trust badges + connection signals share a single flex-wrap row so
          they sit side-by-side on wider viewports and stack on narrow ones —
          fewer vertical "bands" in the card. Discover & Care 2026-05-04. */}
      <div className="result-trust-stack">
        {trustBadges.length > 0 && (
          <TrustBadgeStrip badges={trustBadges} variant="compact" />
        )}
        {(provider.distanceKm !== undefined || meetsShared > 0 || networkOverlap > 0) && (
          <div className="trust-row">
            {meetsShared > 0 && (
              <span className="trust-item trust-item--match">
                <PawPrint size={12} weight="fill" aria-hidden />
                Met at {meetsShared} {meetsShared === 1 ? "walk" : "walks"}
              </span>
            )}
            {networkOverlap > 0 && (
              <span className="trust-item">
                <Users size={12} weight="fill" aria-hidden />
                {networkOverlap} in your circle
              </span>
            )}
            {provider.distanceKm !== undefined && (
              <span
                className={`trust-item${provider.neighbourhoodMatch ? " trust-item--match" : ""}`}
              >
                <MapPin size={12} weight="fill" aria-hidden />
                {provider.neighbourhoodMatch
                  ? "Your neighbourhood"
                  : `${provider.distanceKm} km away`}
              </span>
            )}
          </div>
        )}
      </div>

      {provider.services.length > 0 && (
        <div className="result-services">
          {provider.services.map((s) => (
            <span key={s} className="tag">
              {serviceLabels[s]}
            </span>
          ))}
        </div>
      )}

      <div className="result-blurb">&ldquo;{provider.blurb}&rdquo;</div>
    </Link>
  );
}
