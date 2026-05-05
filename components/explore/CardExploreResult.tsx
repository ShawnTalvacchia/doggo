"use client";

import Link from "next/link";
import { Handshake, MapPin, PawPrint, Star, Users } from "@phosphor-icons/react";
import { ProviderCard, ServiceType, CarerCareServiceConfig } from "@/lib/types";
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

/**
 * Per-service price resolution. When a specific service filter is active,
 * try to surface the matching base rate — first from `provider.pricesByService`
 * if seeded, then from the bridged UserProfile's care services (so we don't
 * have to duplicate rate data on the directory card), and finally fall back
 * to the legacy single `priceFrom` + `priceUnit`. Pricing & Proposals,
 * 2026-05-04 (Open Q §4 last entry, item 3).
 */
function resolveDisplayPrice(
  provider: ProviderCard,
  activeService: ServiceType | null | undefined,
): { priceFrom: number; priceUnit: ProviderCard["priceUnit"] } {
  if (!activeService) {
    return { priceFrom: provider.priceFrom, priceUnit: provider.priceUnit };
  }
  const seeded = provider.pricesByService?.[activeService];
  if (seeded) return seeded;
  if (provider.userId) {
    const user = getUserById(provider.userId);
    const match = user?.carerProfile?.services?.find(
      (s): s is CarerCareServiceConfig =>
        s.kind === "care" && s.serviceType === activeService,
    );
    if (match) {
      // priceUnit on CarerCareServiceConfig is "per_visit" | "per_night";
      // ProviderCard.priceUnit also accepts "per_walk" for legacy directory
      // entries. Map straight through — both shapes overlap on the values
      // we care about here.
      return { priceFrom: match.pricePerUnit, priceUnit: match.priceUnit };
    }
  }
  return { priceFrom: provider.priceFrom, priceUnit: provider.priceUnit };
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

  // Per-service price resolution — see helper. Falls back gracefully.
  const displayPrice = resolveDisplayPrice(provider, activeService);

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
          <div className="result-price">{`${displayPrice.priceFrom} Kč`}</div>
          <div className="result-price-unit">{formatUnit(displayPrice.priceUnit)}</div>
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

      {/* Service-tag row — hide when a specific service filter is active
          (the context is implied by the filter; showing it again is just
          noise). Pricing & Proposals, 2026-05-04. */}
      {provider.services.length > 0 && !activeService && (
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
