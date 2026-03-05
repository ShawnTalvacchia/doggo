"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  CaretLeft,
  CaretRight,
  Cat,
  Dog,
  House,
  Info,
  PawPrint,
  PersonSimpleWalk,
  Star,
  X,
} from "@phosphor-icons/react";
import { ProviderHeaderState } from "@/components/explore/ProviderHeaderState";
import { ContactModal } from "@/components/ui/ContactModal";
import { DEFAULT_ABOUT_BANNER_URL } from "@/lib/data/providerContent";

/** Default first image in the Photos section (dog only). Kept separate from the About banner. */
const DEFAULT_PHOTOS_MAIN_URL =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80";
import { fetchProviderById, fetchProviderContentById } from "@/lib/data/providersClient";
import {
  ProviderCard,
  ProviderProfileContent,
  ProviderReview,
  ProviderServiceOffering,
  ServiceType,
  ServiceWeightBand,
} from "@/lib/types";

// Demo photo collection shared across all provider galleries
const GALLERY_PHOTOS = [
  "1548199973-03cce0bbc87b",
  "1587300003388-59208cc962cb",
  "1543466835-00a7907e9de1",
  "1507146426996-ef05306b995a",
  "1534361960057-19f4434a6b65",
  "1601979031925-424e53b6caaa",
  "1552053045-66e57cc31ce8",
  "1517849845537-4d257902454a",
  "1583511655826-05700d52f4d9",
  "1569466896818-335b1bedfcce",
  "1558788353-f76d92427f16",
  "1477884213360-b387b4fb1f35",
].map((id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=70`);

function formatReviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function ReviewCard({ review }: { review: ProviderReview }) {
  const initial = review.authorName.trim().charAt(0).toUpperCase();
  const stars = Math.min(5, Math.max(0, Math.round(review.rating)));
  return (
    <article className="profile-info-card review-card">
      <div className="review-header">
        <div className="review-avatar" aria-hidden>
          <span className="review-avatar-initial">{initial}</span>
        </div>
        <div className="review-meta">
          <span className="review-author">{review.authorName}</span>
          <span className="review-date">{formatReviewDate(review.createdAt)}</span>
        </div>
      </div>
      <div className="review-stars" aria-label={`${stars} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={13}
            weight={n <= stars ? "fill" : "regular"}
            className={n <= stars ? "review-star--filled" : "review-star--empty"}
          />
        ))}
      </div>
      <p className="review-body">{review.reviewText}</p>
    </article>
  );
}

function formatPriceUnit(unit: ProviderCard["priceUnit"]) {
  if (unit === "per_visit") return "per visit";
  if (unit === "per_night") return "per night";
  return "per walk";
}

function ServiceIcon({ type }: { type: ServiceType }) {
  if (type === "inhome_sitting") return <House size={22} weight="duotone" />;
  if (type === "boarding") return <PawPrint size={22} weight="duotone" />;
  return <PersonSimpleWalk size={22} weight="duotone" />;
}

function WeightIcon({ size }: { size: ServiceWeightBand["size"] }) {
  if (size === "cat") return <Cat size={20} weight="fill" />;
  const dogSize = size === "tiny" ? 14 : size === "small" ? 17 : size === "large" ? 24 : 20;
  return <Dog size={dogSize} weight="fill" />;
}

function ServiceBlock({ service, isLast }: { service: ProviderServiceOffering; isLast: boolean }) {
  return (
    <div className={`svc-block${isLast ? "" : " svc-block--divided"}`}>
      {/* Header row: icon + title/subtitle | base price */}
      <div className="svc-header-row">
        <div className="svc-icon">
          <ServiceIcon type={service.serviceType} />
        </div>
        <div className="svc-header-copy">
          <span className="svc-title">{service.title}</span>
          <span className="svc-subtitle">{service.subtitle ?? service.shortDescription}</span>
        </div>
        <div className="svc-base-price">
          <span className="svc-price-amount">{service.priceFrom} Kč</span>
          <span className="svc-price-unit">{formatPriceUnit(service.priceUnit)}</span>
        </div>
      </div>

      {/* Rate rows */}
      {(service.rates ?? []).map((rate) => (
        <div key={rate.label} className="svc-rate-row">
          <span className="svc-rate-label">
            {rate.label}
            {rate.hasTooltip && (
              <Info size={13} weight="fill" className="svc-rate-info" aria-label="More info" />
            )}
          </span>
          <div className="svc-rate-price">
            <span className="svc-rate-amount">{rate.price}</span>
            <span className="svc-rate-unit">{rate.unit}</span>
          </div>
        </div>
      ))}

      {/* Accepted weight bands */}
      {(service.acceptedWeightBands ?? []).length > 0 && (
        <div className="svc-weight-row">
          {(service.acceptedWeightBands ?? []).map((band) => (
            <div key={band.label} className="svc-weight-chip">
              <WeightIcon size={band.size} />
              <span className="svc-weight-label">{band.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="profile-page-shell">
      <section className="profile-page-panel">
        <div className="profile-fixed-top">
          <div className="profile-back-row">
            <div className="skeleton skeleton-text" style={{ width: 100, height: 16 }} />
          </div>
          {/* Avatar + name block */}
          <div style={{ display: "flex", gap: 12, padding: "16px 16px 12px" }}>
            <div
              className="skeleton skeleton-circle"
              style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: "grid", gap: 8, alignContent: "center" }}>
              <div className="skeleton skeleton-text" style={{ width: "60%", height: 18 }} />
              <div className="skeleton skeleton-text" style={{ width: "40%", height: 14 }} />
              <div className="skeleton skeleton-text" style={{ width: "30%", height: 14 }} />
            </div>
          </div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, padding: "0 16px 12px" }}>
            {[80, 70, 70].map((w, i) => (
              <div
                key={i}
                className="skeleton skeleton-text"
                style={{ width: w, height: 32, borderRadius: 6 }}
              />
            ))}
          </div>
        </div>
        <div className="profile-scroll-body">
          <div className="profile-content-width" style={{ display: "grid", gap: 16, padding: 16 }}>
            {/* Banner image */}
            <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: 12 }} />
            {/* Text lines */}
            {[100, 75, 90, 65, 80].map((pct, i) => (
              <div
                key={i}
                className="skeleton skeleton-text"
                style={{ width: `${pct}%`, height: 14 }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const backLabels: Record<string, string> = {
  walk_checkin: "Dog Walkers",
  inhome_sitting: "In-home Sitters",
  boarding: "Boarders",
};

function ExploreProfileContent() {
  const params = useParams<{ providerId: string }>();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const backLabel = (service && backLabels[service]) ?? "Dog Walkers";

  // Reconstruct the full filter URL so "back" restores price, time, and service filters.
  const backHref = (() => {
    const p = new URLSearchParams();
    (["service", "minRate", "maxRate", "times"] as const).forEach((key) => {
      const val = searchParams.get(key);
      if (val) p.set(key, val);
    });
    const q = p.toString();
    return q ? `/explore/results?${q}` : "/explore/results";
  })();

  const [activeTab, setActiveTab] = useState<"info" | "services" | "reviews">("info");
  const [isDesktop, setIsDesktop] = useState(false);
  const [provider, setProvider] = useState<ProviderCard | null>(null);
  const [content, setContent] = useState<ProviderProfileContent | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProvider = async () => {
      setIsLoadingProvider(true);
      try {
        const [providerData, contentData] = await Promise.all([
          fetchProviderById(params.providerId),
          fetchProviderContentById(params.providerId),
        ]);
        if (!cancelled) {
          setProvider(providerData);
          setContent(contentData);
        }
      } catch {
        if (!cancelled) {
          setProvider(null);
          setContent(null);
        }
      } finally {
        if (!cancelled) setIsLoadingProvider(false);
      }
    };

    loadProvider();
    return () => {
      cancelled = true;
    };
  }, [params.providerId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 621px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const infoContent = provider ? (
    <div className="profile-content-width profile-section-stack">
      <section className="profile-info-card profile-about-card">
        <img
          className="profile-about-banner"
          src={content?.photoMainUrl || DEFAULT_ABOUT_BANNER_URL}
          alt={`${provider.name} with a dog outdoors`}
        />
        <div className="profile-about-content">
          <h2 className="profile-card-title">
            {content?.aboutTitle || "Home full-time with lots of Love!!"}
          </h2>
          <h3 className="profile-card-subtitle">
            {content?.aboutHeading || `About ${provider.name.split(" ")[0]}`}
          </h3>
          <p className="profile-card-copy">{content?.aboutBody || provider.blurb}</p>
          <button type="button" className="profile-read-more">
            Read all
          </button>
        </div>
      </section>

      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Photos</h3>
        <div className="profile-photo-grid">
          <img
            className="profile-photo-main"
            src={DEFAULT_PHOTOS_MAIN_URL}
            alt="Dog lying on floor"
          />
          <img
            className="profile-photo-side"
            src={
              content?.photoSideUrl ||
              "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80"
            }
            alt="Dog closeup"
          />
          <button type="button" className="profile-photo-more" onClick={() => setGalleryOpen(true)}>
            <span>View More</span>
            <span>{content?.photoCountLabel || "(127 photos)"}</span>
          </button>
        </div>
      </section>

      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Care Experience</h3>
        <div className="profile-care-list">
          {(content?.careExperience || []).map((item) => (
            <div key={item} className="profile-care-item">
              <PawPrint size={18} weight="regular" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Medical & Special Care</h3>
        <div className="profile-care-list">
          {(content?.medicalCare || []).map((item) => (
            <div key={item} className="profile-care-item">
              <PawPrint size={18} weight="regular" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Home Environment</h3>
        <div className="profile-care-list">
          {(content?.homeEnvironment || []).map((item) => (
            <div key={item} className="profile-care-item">
              <PawPrint size={18} weight="regular" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {!!content?.pets.length && (
        <section className="profile-info-card">
          <h3 className="profile-card-subtitle">Pets</h3>
          <div className="profile-care-list">
            {content.pets.map((pet) => (
              <div key={pet.id} className="profile-care-item">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  style={{ width: 28, height: 28, borderRadius: "999px", objectFit: "cover" }}
                />
                <span>
                  {pet.name} · {pet.breed} · {pet.weightLabel} · {pet.ageLabel}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  ) : null;

  const servicesContent = provider ? (
    <div className="profile-content-width profile-section-stack">
      <section className="profile-info-card">
        <h3 className="profile-card-subtitle">Services</h3>
        {(content?.services ?? []).length > 0 ? (
          <div className="svc-list">
            {(content?.services ?? []).map((svc, i, arr) => (
              <ServiceBlock key={svc.id} service={svc} isLast={i === arr.length - 1} />
            ))}
          </div>
        ) : (
          <p className="profile-card-copy" style={{ color: "var(--text-secondary)" }}>
            No services listed yet.
          </p>
        )}
      </section>
    </div>
  ) : null;

  const reviewsContent = provider ? (
    <div className="profile-content-width profile-section-stack">
      {!!content?.reviews.length ? (
        content.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      ) : (
        <div className="profile-info-card">
          <p className="profile-card-copy">No reviews yet for this provider.</p>
        </div>
      )}
    </div>
  ) : null;

  const activeContent =
    activeTab === "info"
      ? infoContent
      : activeTab === "services"
        ? servicesContent
        : reviewsContent;

  if (isLoadingProvider) {
    return <ProfileSkeleton />;
  }

  if (!provider) {
    return (
      <main className="profile-page-shell">
        <section className="profile-page-panel">
          <div className="profile-scroll-body">
            <div
              className="profile-content-width"
              style={{ padding: 16, color: "var(--text-secondary)" }}
            >
              Provider not found.
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Gallery view — stays within profile chrome, gallery bar replaces tabs ──
  if (galleryOpen) {
    const firstName = provider.name.split(" ")[0];
    return (
      <main className="profile-page-shell">
        <section className="profile-page-panel">
          <div className="profile-fixed-top">
            <div className="profile-back-row">
              <Link href={backHref} className="profile-back-link">
                <CaretLeft size={16} weight="bold" />
                {backLabel}
              </Link>
            </div>
            <ProviderHeaderState provider={provider} state="condensed" onContact={() => setContactOpen(true)} />
            <div className="profile-gallery-bar">
              <h2 className="profile-gallery-bar-title">
                Photos{" "}
                <span className="profile-gallery-bar-count">
                  {content?.photoCountLabel ?? "(127 photos)"}
                </span>
              </h2>
              <button
                type="button"
                className="profile-gallery-bar-close"
                aria-label="Close gallery"
                onClick={() => setGalleryOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="profile-scroll-body">
            <div className="profile-gallery-body">
              <div className="photo-gallery-grid">
                {GALLERY_PHOTOS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    className="gallery-thumb-btn"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open photo ${i + 1}`}
                  >
                    <img src={url} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox — position:fixed, renders on top of gallery view */}
        {lightboxIndex !== null && (
          <div className="lightbox-overlay" role="dialog" aria-modal aria-label="Photo viewer">
            <div className="lightbox-bar">
              <button
                type="button"
                className="lightbox-back-btn"
                onClick={() => setLightboxIndex(null)}
              >
                <CaretLeft size={16} weight="bold" />
                {firstName}&apos;s Photos
              </button>
            </div>
            <div className="lightbox-body">
              <button
                type="button"
                className="lightbox-nav lightbox-nav--prev"
                onClick={() => setLightboxIndex((i) => Math.max(0, (i ?? 1) - 1))}
                disabled={lightboxIndex === 0}
                aria-label="Previous photo"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <img
                className="lightbox-img"
                src={GALLERY_PHOTOS[lightboxIndex].replace("w=400&h=400", "w=1200&h=900")}
                alt=""
              />
              <button
                type="button"
                className="lightbox-nav lightbox-nav--next"
                onClick={() =>
                  setLightboxIndex((i) => Math.min(GALLERY_PHOTOS.length - 1, (i ?? 0) + 1))
                }
                disabled={lightboxIndex === GALLERY_PHOTOS.length - 1}
                aria-label="Next photo"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="profile-page-shell">
      {isDesktop ? (
        <section className="profile-desktop-layout">
          <aside className="profile-desktop-left-col">
            <div className="profile-desktop-back-row">
              <Link href={backHref} className="profile-desktop-back-link">
                <CaretLeft size={16} weight="bold" />
                {backLabel}
              </Link>
            </div>
            <div className="profile-desktop-profile">
              <ProviderHeaderState provider={provider} state="expanded" onContact={() => setContactOpen(true)} />
            </div>
          </aside>

          <section className="profile-desktop-right-col">
            <div className="profile-desktop-tabs-wrap">
              <div
                className="profile-tabs profile-tabs-desktop"
                role="tablist"
                aria-label="Profile sections"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "info"}
                  className={`profile-tab ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  Info
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "services"}
                  className={`profile-tab ${activeTab === "services" ? "active" : ""}`}
                  onClick={() => setActiveTab("services")}
                >
                  Services
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "reviews"}
                  className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </div>
            </div>
            {activeContent}
          </section>
        </section>
      ) : (
        <section className="profile-page-panel">
          <div className="profile-fixed-top">
            <div className="profile-back-row">
              <Link href={backHref} className="profile-back-link">
                <CaretLeft size={16} weight="bold" />
                {backLabel}
              </Link>
            </div>
            <ProviderHeaderState provider={provider} state="condensed" onContact={() => setContactOpen(true)} />
            <div className="profile-tabs" role="tablist" aria-label="Profile sections">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "info"}
                className={`profile-tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                Info
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "services"}
                className={`profile-tab ${activeTab === "services" ? "active" : ""}`}
                onClick={() => setActiveTab("services")}
              >
                Services
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "reviews"}
                className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>
          </div>

          <div className="profile-scroll-body">{activeContent}</div>
        </section>
      )}

      {provider && (
        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          providerName={provider.name}
          service={service as ServiceType | null}
        />
      )}
    </main>
  );
}

export default function ExploreProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ExploreProfileContent />
    </Suspense>
  );
}
