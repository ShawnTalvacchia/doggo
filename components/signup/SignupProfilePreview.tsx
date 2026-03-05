"use client";

/**
 * SignupProfilePreview
 *
 * A compact, read-only preview of a provider's public profile,
 * built from the in-progress SignupDraft via draftToProfile().
 *
 * Shown on the signup/success page so providers can see exactly
 * what owners will see before the account is finalised.
 */

import { useState } from "react";
import { PawPrint, Star } from "@phosphor-icons/react";
import { useSignupDraft } from "@/contexts/SignupContext";
import { draftToProfile } from "@/lib/draftToProfile";
import { ProviderProfileContent } from "@/lib/types";

type PreviewTab = "info" | "services";

function formatUnit(unit: string) {
  if (unit === "per_visit") return "per visit";
  if (unit === "per_night") return "per night";
  return "per walk";
}

function ChipList({ items, emptyNote }: { items: string[]; emptyNote: string }) {
  if (!items.length) {
    return <p className="profile-card-copy signup-preview-empty-note">{emptyNote}</p>;
  }
  return (
    <div className="profile-care-list">
      {items.map((item) => (
        <div key={item} className="profile-care-item">
          <PawPrint size={16} weight="regular" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function InfoTab({ content }: { content: ProviderProfileContent }) {
  return (
    <div className="profile-section-stack signup-preview-info-stack">
      {/* About */}
      <section className="profile-info-card">
        <h3 className="profile-card-title signup-preview-about-title">{content.aboutTitle}</h3>
        <h4 className="profile-card-subtitle signup-preview-about-heading">
          {content.aboutHeading}
        </h4>
        <p className="profile-card-copy">{content.aboutBody}</p>
      </section>

      {/* Care experience */}
      {content.careExperience.length > 0 && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Care Experience</h3>
          <ChipList items={content.careExperience} emptyNote="No care preferences set yet." />
        </section>
      )}

      {/* Home environment */}
      {content.homeEnvironment.length > 0 && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Home Environment</h3>
          <ChipList items={content.homeEnvironment} emptyNote="No home details set yet." />
        </section>
      )}

      {/* Pets */}
      {content.pets.length > 0 && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">My Pets</h3>
          <div className="profile-care-list">
            {content.pets.map((pet) => (
              <div key={pet.id} className="profile-care-item">
                <PawPrint size={16} weight="regular" />
                <span>
                  {pet.name} · {pet.breed} · {pet.ageLabel}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ServicesTab({ content }: { content: ProviderProfileContent }) {
  if (!content.services.length) {
    return <div className="signup-preview-empty-services">No services set up yet.</div>;
  }
  return (
    <div className="profile-section-stack signup-preview-info-stack">
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Your Services</h3>
        <ul className="profile-list signup-preview-service-list">
          {content.services.map((service) => (
            <li key={service.id} className="signup-preview-service-item">
              <div className="signup-preview-service-copy">
                <strong>{service.title}</strong>
                <div className="signup-preview-service-desc">{service.shortDescription}</div>
              </div>
              <div className="signup-preview-service-price">
                <div className="signup-preview-service-from">from</div>
                <div className="signup-preview-service-amount">{service.priceFrom} Kč</div>
                <div className="signup-preview-service-unit">{formatUnit(service.priceUnit)}</div>
              </div>
            </li>
          ))}
        </ul>
        <p className="signup-preview-pricing-note">
          Prices are placeholders — you'll set your real rates after sign-up.
        </p>
      </section>
    </div>
  );
}

export function SignupProfilePreview() {
  const { draft } = useSignupDraft();
  const [activeTab, setActiveTab] = useState<PreviewTab>("info");
  const content = draftToProfile(draft);

  const isCaregiver = draft.roles.includes("walker") || draft.roles.includes("host");

  if (!isCaregiver) return null;

  return (
    <div className="signup-preview-shell">
      {/* Header */}
      <div className="signup-preview-header">
        <div className="signup-preview-avatar">
          <span className="signup-preview-avatar-glyph">🐾</span>
        </div>
        <div className="signup-preview-identity">
          <div className="signup-preview-name">{draft.firstName || "Your name"}</div>
          <div className="signup-preview-location">{draft.location || "Your location"}</div>
          <div className="signup-preview-rating">
            <Star size={12} weight="fill" className="result-star" />
            <span className="signup-preview-rating-copy">New provider · 0 reviews</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs signup-preview-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "info"}
          className={`profile-tab${activeTab === "info" ? " active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Info
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "services"}
          className={`profile-tab${activeTab === "services" ? " active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
      </div>

      {/* Tab content */}
      <div className="signup-preview-body">
        {activeTab === "info" ? <InfoTab content={content} /> : <ServicesTab content={content} />}
      </div>
    </div>
  );
}
