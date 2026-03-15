"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  CalendarBlank,
  Sparkle,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { PetProfile, CarerProfile, UserProfile, TimeSlot, DayOfWeek } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { mockUser } from "@/lib/mockUser";

// ── Constants ──────────────────────────────────────────────────────────────────

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS: { key: TimeSlot; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

type ProfileTab = "about" | "offering";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatMemberSince(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// ── About tab ─────────────────────────────────────────────────────────────────

function PetCard({ pet }: { pet: PetProfile }) {
  return (
    <div className="profile-pet-card">
      <img src={pet.imageUrl} alt={pet.name} className="profile-pet-img" />
      <div className="profile-pet-info">
        <p className="profile-pet-name">{pet.name}</p>
        <p className="profile-pet-breed">{pet.breed}</p>
        <p className="profile-pet-meta">
          {pet.weightLabel} · {pet.ageLabel}
        </p>
        {pet.notes && <p className="profile-pet-notes">{pet.notes}</p>}
      </div>
    </div>
  );
}

function AboutTab({ user }: { user: UserProfile }) {
  return (
    <div className="profile-tab-content">
      <div className="profile-section">
        <h2 className="profile-section-title">About me</h2>
        <p className="profile-bio">{user.bio}</p>
      </div>

      {user.pets.length > 0 && (
        <div className="profile-section">
          <h2 className="profile-section-title">My dogs</h2>
          <div className="profile-pets-grid">
            {user.pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Offering tab ──────────────────────────────────────────────────────────────

function AvailabilityGrid({ carer }: { carer: CarerProfile }) {
  return (
    <div className="profile-avail-grid">
      {ALL_DAYS.map((day) => {
        const dayData = carer.availability.find((a) => a.day === day);
        const activeSlots = dayData?.slots ?? [];
        return (
          <div key={day} className="profile-avail-row">
            <span className="profile-avail-day">{day}</span>
            <div className="pill-group profile-avail-slots">
              {TIME_SLOTS.map(({ key, label }) => (
                <span
                  key={key}
                  className={`pill${activeSlots.includes(key) ? " active" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OfferingTab({ user }: { user: UserProfile }) {
  const carer = user.carerProfile;

  if (!carer) {
    return (
      <div className="profile-offering-empty">
        <Sparkle size={44} weight="light" className="profile-offering-empty-icon" />
        <h2 className="profile-offering-empty-title">Set up your carer profile</h2>
        <p className="profile-offering-empty-body">
          Start accepting bookings for walks, drop-in visits, and boarding.
        </p>
        <ButtonAction href="/signup/start" variant="primary" size="md">
          Get started
        </ButtonAction>
      </div>
    );
  }

  return (
    <div className="profile-tab-content">
      {/* Carer bio */}
      {carer.bio && (
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Bio</h2>
            <ButtonAction
              variant="outline"
              size="sm"
              leftIcon={<PencilSimple size={13} weight="bold" />}
            >
              Edit
            </ButtonAction>
          </div>
          <p className="profile-bio">{carer.bio}</p>
        </div>
      )}

      {/* Services */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Services</h2>
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<Plus size={13} weight="bold" />}
          >
            Add
          </ButtonAction>
        </div>
        <div className="profile-services-list">
          {carer.services.map((svc) => (
            <div key={svc.serviceType} className="profile-service-card">
              <div className="profile-service-top">
                <span className="profile-service-name">
                  {SERVICE_LABELS[svc.serviceType]}
                </span>
                <div className="profile-service-price-wrap">
                  <span className="profile-service-price">
                    {svc.pricePerUnit.toLocaleString()} Kč
                    <span className="profile-service-unit">
                      {" "}/ {svc.priceUnit === "per_visit" ? "visit" : "night"}
                    </span>
                  </span>
                  <ButtonAction
                    variant="outline"
                    size="sm"
                    leftIcon={<PencilSimple size={13} weight="bold" />}
                  >
                    Edit
                  </ButtonAction>
                </div>
              </div>
              {svc.subServices.length > 0 && (
                <div className="profile-service-subs">
                  {svc.subServices.map((sub) => (
                    <span key={sub} className="chip">
                      {sub}
                    </span>
                  ))}
                </div>
              )}
              {svc.notes && <p className="profile-service-notes">{svc.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">Availability</h2>
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<PencilSimple size={13} weight="bold" />}
          >
            Edit
          </ButtonAction>
        </div>
        <AvailabilityGrid carer={carer} />
      </div>

      {/* Visibility */}
      <div className="profile-section profile-section--visibility">
        <div className="profile-visibility-row">
          <div>
            <p className="profile-visibility-label">Profile visibility</p>
            <p className="profile-visibility-sub">
              {carer.publicProfile
                ? "Your profile is visible to pet owners on Explore."
                : "Your profile is hidden from search results."}
            </p>
          </div>
          <span
            className={`profile-visibility-badge${
              carer.publicProfile ? " profile-visibility-badge--public" : ""
            }`}
          >
            {carer.publicProfile ? "Public" : "Hidden"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main profile page ─────────────────────────────────────────────────────────

function ProfileInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ProfileTab) ?? "about";
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const user = mockUser;

  return (
    <main className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <img
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="profile-header-avatar"
        />
        <div className="profile-header-info">
          <h1 className="profile-name">
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-location">
            <MapPin size={13} weight="fill" className="profile-meta-icon" />
            {user.location}
          </p>
          <p className="profile-since">
            <CalendarBlank size={13} weight="regular" className="profile-meta-icon" />
            Member since {formatMemberSince(user.memberSince)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "about"}
          className={`profile-tab${activeTab === "about" ? " active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "offering"}
          className={`profile-tab${activeTab === "offering" ? " active" : ""}`}
          onClick={() => setActiveTab("offering")}
        >
          Offering
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "about" ? (
        <AboutTab user={user} />
      ) : (
        <OfferingTab user={user} />
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileInner />
    </Suspense>
  );
}
