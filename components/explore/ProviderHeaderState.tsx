import { ProviderCard, ProviderHeaderState as HeaderState } from "@/lib/types";
import { ChatCircleDots, MapPin, Users } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";

type ProviderHeaderStateProps = {
  provider: ProviderCard;
  state: HeaderState;
};

export function ProviderHeaderState({ provider, state }: ProviderHeaderStateProps) {
  const firstName = provider.name.split(" ")[0];
  const isCondensed = state === "condensed";

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
            {!isCondensed &&
              (provider.distanceKm !== undefined || !!provider.mutualConnections) && (
                <div className="profile-trust">
                  {provider.distanceKm !== undefined && (
                    <span
                      className={`profile-trust-item${provider.neighbourhoodMatch ? " profile-trust-item--match" : ""}`}
                    >
                      <MapPin size={12} weight="fill" aria-hidden />
                      {provider.neighbourhoodMatch
                        ? "Your neighbourhood"
                        : `${provider.distanceKm} km away`}
                    </span>
                  )}
                  {!!provider.mutualConnections && (
                    <span className="profile-trust-item">
                      <Users size={12} weight="fill" aria-hidden />
                      {provider.mutualConnections} mutual{" "}
                      {provider.mutualConnections === 1 ? "owner" : "owners"}
                    </span>
                  )}
                </div>
              )}
          </div>

          <ButtonAction
            variant="primary"
            cta
            size={isCondensed ? "sm" : "md"}
            className="profile-contact-btn"
            rightIcon={<ChatCircleDots size={16} weight="fill" />}
          >
            {isCondensed ? "Contact" : `Contact ${firstName}`}
          </ButtonAction>
        </div>
      </div>
    </header>
  );
}
