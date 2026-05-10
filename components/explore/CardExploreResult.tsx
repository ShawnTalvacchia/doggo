"use client";

import Link from "next/link";
import { MapPin, PawPrint, Star, Users } from "@phosphor-icons/react";
import {
  ProviderCard,
  ServiceType,
  CarerCareServiceConfig,
  CarerAppointmentServiceConfig,
  AppointmentCategory,
} from "@/lib/types";
import { getConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";
import { getTrustBadges, userProfileToTrustSubject } from "@/lib/trustBadges";
import { TrustBadgeStrip } from "@/components/badges/TrustBadgeStrip";
import { useCurrentUserId } from "@/hooks/useCurrentUser";

type CardExploreResultProps = {
  provider: ProviderCard;
  activeService?: ServiceType | null;
  /**
   * Non-ServiceType filter category (currently only `"appointment"`). Used
   * for the Appointment filter pill — drives display-price resolution to
   * the bridged appointment offering and suppresses the service chip row
   * the same way `activeService` does. Discover Refinement D1, 2026-05-10.
   */
  activeFilterCategory?: "appointment" | null;
  /** Full query string from the results page (e.g. "service=walk_checkin&minRate=200") */
  returnQuery?: string;
  /**
   * Visual variant. `"marketplace"` (default) renders the standard discover
   * card with rating + review count. `"in-circle"` renders softer chrome —
   * no platform-style rating row, subtle brand accent — for cards in the
   * "Carers in your circle" section on Discover Care. Discover Refinement
   * C2, 2026-05-10. The variant is purely a visual toggle; the card still
   * links to the same profile route and resolves the same trust badges.
   */
  variant?: "marketplace" | "in-circle";
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
 *
 * Appointment-flavor pricing (Discover Refinement D1, 2026-05-10): when the
 * Appointment filter pill is active, prefer the cheapest bridged appointment
 * offering on the carer's UserProfile — that's the "from" price we want to
 * advertise. Falls back to the legacy single price.
 */
function resolveDisplayPrice(
  provider: ProviderCard,
  activeService: ServiceType | null | undefined,
  activeFilterCategory: "appointment" | null | undefined,
): { priceFrom: number; priceUnit: ProviderCard["priceUnit"] } {
  if (activeFilterCategory === "appointment" && provider.userId) {
    const user = getUserById(provider.userId);
    const apts = user?.carerProfile?.services?.filter(
      (s): s is CarerAppointmentServiceConfig => s.kind === "appointment" && s.enabled,
    ) ?? [];
    if (apts.length > 0) {
      const cheapest = apts.reduce(
        (lo, s) => (s.pricePerAppointment < lo ? s.pricePerAppointment : lo),
        apts[0]!.pricePerAppointment,
      );
      return { priceFrom: cheapest, priceUnit: "per_visit" };
    }
  }
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

const appointmentLabels: Record<AppointmentCategory, string> = {
  vet: "Vet",
  grooming: "Grooming",
};

/**
 * Display name for Discover Care cards: first name + last initial.
 * Privacy-favoring default — full surname lives on the profile page (after
 * tap), not on the card. Handles three input shapes:
 *   - "Klára Horáčková"     → "Klára H."
 *   - "Nikola R."           → "Nikola R."  (already short, unchanged)
 *   - "Lenka Nováková"      → "Lenka N."
 *   - "Dr. Foo Bar"         → "Dr. Foo B." (title preserved)
 *
 * Does NOT rename underlying `firstName`/`lastName` data — those stay
 * full for surfaces that need them (profile hero, booking confirmations,
 * inbox threads). This is purely a card-level display rule.
 *
 * Discover Refinement walkthrough decision, 2026-05-10 (C3) — matches the
 * Rover / Care.com / Airbnb-for-pets convention and Doggo's own locked-
 * profile name-privacy rule.
 */
function shortenForCard(displayName: string): string {
  const titleMatch = displayName.match(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/);
  const title = titleMatch ? titleMatch[0] : "";
  const rest = displayName.slice(title.length).trim();
  const parts = rest.split(/\s+/);
  if (parts.length === 1) return `${title}${parts[0]}`;
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  // Already a single-letter initial like "R." or "M." → keep as-is.
  if (/^[A-Za-zÀ-ž]\.?$/.test(last)) return `${title}${first} ${last}`;
  return `${title}${first} ${last[0]}.`;
}

export function CardExploreResult({
  provider,
  activeService,
  activeFilterCategory,
  returnQuery,
  variant = "marketplace",
}: CardExploreResultProps) {
  const isInCircle = variant === "in-circle";
  const hasActiveFilter = activeService !== null && activeService !== undefined
    || activeFilterCategory !== null && activeFilterCategory !== undefined;
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
  const displayPrice = resolveDisplayPrice(provider, activeService, activeFilterCategory);

  // Carry the full filter state into the profile URL so back navigation can restore it.
  const profileHref = returnQuery
    ? `/profile/${profileId}?${returnQuery}`
    : activeService
      ? `/profile/${profileId}?service=${activeService}`
      : `/profile/${profileId}`;

  return (
    <Link
      href={profileHref}
      className={`result-card${isInCircle ? " result-card--in-circle" : ""}`}
    >
      <div className="result-head">
        <img
          src={provider.avatarUrl}
          alt={provider.name}
          className={`avatar${conn?.state === "connected" ? " avatar-connected" : conn?.state === "familiar" ? " avatar-familiar" : ""}`}
        />
        <div className="result-main">
          <div className="result-name">
            <span>{shortenForCard(provider.name)}</span>
            {connBadge && (
              <span className="inline-flex items-center gap-xs rounded-pill font-medium"
                style={{
                  // Pattern: parallel chip shapes; color carries the
                  // intensity. Connected = brand fill (the strong moment),
                  // Familiar = neutral fill (the soft acknowledgement).
                  // Same padding / font / shape so the chips read as
                  // siblings rather than escalating noise. Discover & Care
                  // 2026-05-04. Icons removed during walkthrough C1
                  // (2026-05-10) — the cards are already icon-heavy with
                  // trust badges + connection-signal row, and the labels
                  // alone are clear enough.
                  background: conn?.state === "connected" ? "var(--brand-subtle)" : "var(--surface-inset)",
                  color: conn?.state === "connected" ? "var(--brand-strong)" : "var(--text-secondary)",
                  fontSize: 10,
                  padding: "1px 6px",
                  verticalAlign: "middle",
                }}
              >
                {connBadge}
              </span>
            )}
          </div>
          <div className="result-location">
            {provider.district}, {provider.neighborhood}
          </div>
          {/* Rating + review count render on every card regardless of
              variant. Originally suppressed on in-circle cards (C2, 2026-05-10)
              on the theory that "the relationship IS the trust signal" — but
              walkthrough C3 reverted it: ratings are useful info even for
              known carers, and the absence read as missing data rather than
              as intentional softer chrome. The card chrome differential (left
              stripe + section header) carries the in-circle treatment without
              removing data the viewer wants. */}
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

      {/* Service-tag row — hide when any specific filter is active (the
          context is implied by the filter; showing it again is just
          noise). Renders Care service tags + Appointment subtype tags
          (vet / grooming) in one row. Pricing & Proposals 2026-05-04 +
          Discover Refinement D1, 2026-05-10. */}
      {(provider.services.length > 0 || (provider.appointmentTypes?.length ?? 0) > 0) && !hasActiveFilter && (
        <div className="result-services">
          {provider.services.map((s) => (
            <span key={s} className="tag">
              {serviceLabels[s]}
            </span>
          ))}
          {provider.appointmentTypes?.map((c) => (
            <span key={c} className="tag">
              {appointmentLabels[c]}
            </span>
          ))}
        </div>
      )}

      <div className="result-blurb">&ldquo;{provider.blurb}&rdquo;</div>
    </Link>
  );
}
