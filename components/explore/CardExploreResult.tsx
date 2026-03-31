import Link from "next/link";
import { Handshake, MapPin, Star, Users } from "@phosphor-icons/react";
import { ProviderCard, ServiceType } from "@/lib/types";
import { getConnectionState } from "@/lib/mockConnections";

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
  const conn = getConnectionState(provider.id);
  const connBadge = conn?.state === "connected" ? "Connected" : conn?.state === "familiar" ? "Familiar" : null;

  // Carry the full filter state into the profile URL so back navigation can restore it.
  const profileHref = returnQuery
    ? `/discover/profile/${provider.id}?${returnQuery}`
    : activeService
      ? `/discover/profile/${provider.id}?service=${activeService}`
      : `/discover/profile/${provider.id}`;

  return (
    <Link href={profileHref} className="result-card">
      <div className="result-head">
        <img src={provider.avatarUrl} alt={provider.name} className="avatar" />
        <div className="result-main">
          <div className="result-name">
            {provider.name}
            {connBadge && (
              <span className="inline-flex items-center gap-xs ml-xs rounded-pill px-xs text-xs font-medium"
                style={{
                  background: conn?.state === "connected" ? "var(--brand-subtle)" : "var(--surface-gray)",
                  color: conn?.state === "connected" ? "var(--brand-strong)" : "var(--text-secondary)",
                  fontSize: 10,
                  padding: "1px 6px",
                  verticalAlign: "middle",
                }}>
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

      {(provider.distanceKm !== undefined || !!provider.mutualConnections) && (
        <div className="trust-row">
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
          {!!provider.mutualConnections && (
            <span className="trust-item">
              <Users size={12} weight="fill" aria-hidden />
              {provider.mutualConnections} mutual{" "}
              {provider.mutualConnections === 1 ? "owner" : "owners"}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
