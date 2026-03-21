import { ProviderCard, ProviderHeaderState as HeaderState } from "@/lib/types";
import { ChatCircleDots, Handshake, MapPin, PaperPlaneTilt, UserPlus, Users } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { getConnectionState, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";

type ProfileHeaderProps = {
  provider: ProviderCard;
  state: HeaderState;
  /** Called when the Contact button is tapped — opens the contact modal */
  onContact?: () => void;
};

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  connected: { bg: "var(--brand-subtle)", color: "var(--brand-strong)" },
  familiar: { bg: "var(--transparent-light-6)", color: "var(--text-secondary)" },
  pending: { bg: "var(--surface-gray)", color: "var(--text-tertiary)" },
  none: { bg: "var(--surface-gray)", color: "var(--text-tertiary)" },
};

export function ProfileHeader({ provider, state, onContact }: ProfileHeaderProps) {
  const firstName = provider.name.split(" ")[0];
  const isCondensed = state === "condensed";
  const connection = getConnectionState(provider.id);
  const connState = connection?.state ?? "none";
  const isConnected = connState === "connected";
  const isFamiliar = connState === "familiar";

  // Determine CTA text and icon based on connection state
  let ctaLabel: string;
  let ctaIcon: React.ReactNode;
  if (isConnected) {
    ctaLabel = isCondensed ? "Message" : `Message ${firstName}`;
    ctaIcon = <PaperPlaneTilt size={16} weight="fill" />;
  } else if (isFamiliar) {
    ctaLabel = isCondensed ? "Connect" : `Connect with ${firstName}`;
    ctaIcon = <UserPlus size={16} weight="fill" />;
  } else {
    ctaLabel = isCondensed ? "Contact" : `Contact ${firstName}`;
    ctaIcon = <ChatCircleDots size={16} weight="fill" />;
  }

  const badgeStyle = BADGE_STYLES[connState] ?? BADGE_STYLES.none;

  return (
    <header className={`profile-header-state ${state}`}>
      <div className="profile-identity">
        <img src={provider.avatarUrl} alt={provider.name} className="profile-avatar" />

        <div className={`profile-main ${isCondensed ? "condensed" : "expanded"}`}>
          <div className="profile-title-wrap">
            <h1 className="profile-name">{provider.name}</h1>
            <div className="profile-location">
              {provider.district} • {provider.neighborhood}
            </div>
            {!isCondensed && (
              <div className="profile-rating">
                <span aria-hidden>⭐</span> {provider.rating} • {provider.reviewCount} reviews
              </div>
            )}
            {!isCondensed && (
              <div className="trust-row">
                {/* Connection status badge */}
                <span
                  className="trust-item"
                  style={{
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                    fontWeight: "var(--weight-semibold)",
                  }}
                >
                  <Handshake size={12} weight="fill" aria-hidden />
                  {CONNECTION_STATE_LABELS[connState]}
                </span>

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
          </div>

          <div className="flex flex-col gap-xs" style={{ alignSelf: isCondensed ? "center" : "flex-start" }}>
            <ButtonAction
              variant="primary"
              cta
              size={isCondensed ? "sm" : "md"}
              className="profile-contact-btn"
              rightIcon={ctaIcon}
              onClick={onContact}
            >
              {ctaLabel}
            </ButtonAction>
            {/* Show "Book care" CTA if connected and viewing a provider */}
            {!isCondensed && isConnected && (
              <ButtonAction
                variant="outline"
                size="sm"
                className="profile-contact-btn"
                onClick={onContact}
              >
                Book care
              </ButtonAction>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
