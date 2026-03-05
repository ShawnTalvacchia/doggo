import Link from "next/link";
import { MapPin, Star, Users } from "@phosphor-icons/react";
import { ProviderCard, ServiceType } from "@/lib/types";

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
  // Carry the full filter state into the profile URL so back navigation can restore it.
  const profileHref = returnQuery
    ? `/explore/profile/${provider.id}?${returnQuery}`
    : activeService
      ? `/explore/profile/${provider.id}?service=${activeService}`
      : `/explore/profile/${provider.id}`;

  return (
    <Link href={profileHref} className="result-card">
      <div className="result-head">
        <img src={provider.avatarUrl} alt={provider.name} className="avatar" />
        <div className="result-main">
          <div className="result-name">{provider.name}</div>
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
            <span key={s} className="result-service-tag">
              {serviceLabels[s]}
            </span>
          ))}
        </div>
      )}

      <div className="result-blurb">&ldquo;{provider.blurb}&rdquo;</div>

      {(provider.distanceKm !== undefined || !!provider.mutualConnections) && (
        <div className="result-trust">
          {provider.distanceKm !== undefined && (
            <span
              className={`result-trust-item${provider.neighbourhoodMatch ? " result-trust-item--match" : ""}`}
            >
              <MapPin size={12} weight="fill" aria-hidden />
              {provider.neighbourhoodMatch
                ? "Your neighbourhood"
                : `${provider.distanceKm} km away`}
            </span>
          )}
          {!!provider.mutualConnections && (
            <span className="result-trust-item">
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
