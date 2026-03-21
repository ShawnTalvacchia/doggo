"use client";

import {
  Handshake,
  MagnifyingGlass,
  PawPrint,
  CalendarDots,
  Plus,
  ArrowRight,
  Dog,
  MapPin,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MeetCard } from "@/components/meets/MeetCard";
import { getUpcomingMeets, mockMeets } from "@/lib/mockMeets";
import { mockUser } from "@/lib/mockUser";

export default function HomePage() {
  const upcomingMeets = getUpcomingMeets().slice(0, 3);
  const completedMeet = mockMeets.find((m) => m.status === "completed");

  const suggestedConnections = completedMeet
    ? completedMeet.attendees.filter((a) => a.userId !== "shawn")
    : [];

  const petNames = mockUser.pets.map((p) => p.name);
  const greetingDogLine =
    petNames.length === 1
      ? `How's ${petNames[0]} doing today?`
      : petNames.length === 2
        ? `How are ${petNames[0]} and ${petNames[1]} doing today?`
        : `How are your pups doing today?`;

  return (
    <div
      className="flex flex-col gap-xl p-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      {/* Hero greeting */}
      <header className="home-hero">
        <div className="home-hero-text">
          <h1 className="font-heading text-4xl font-semibold text-fg-primary">
            Hey, {mockUser.firstName}!
          </h1>
          <p className="text-base text-fg-secondary">{greetingDogLine}</p>
          <p className="text-sm text-fg-tertiary flex items-center gap-xs mt-xs">
            <MapPin size={14} weight="light" />
            {mockUser.location}
          </p>
        </div>
        <div className="home-hero-dogs">
          {mockUser.pets.slice(0, 2).map((pet) => (
            <div key={pet.id} className="home-hero-dog-bubble">
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="home-hero-dog-img"
              />
              <span className="text-xs font-medium text-fg-primary">{pet.name}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Quick actions */}
      <div className="home-quick-actions">
        <ButtonAction
          variant="primary"
          size="md"
          href="/meets/create"
          leftIcon={<Plus size={18} weight="bold" />}
          className="flex-1"
        >
          Create Meet
        </ButtonAction>
        <ButtonAction
          variant="secondary"
          size="md"
          href="/explore/results"
          leftIcon={<MagnifyingGlass size={18} weight="light" />}
          className="flex-1"
        >
          Find Care
        </ButtonAction>
      </div>

      {/* Nearby Meets */}
      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-fg-primary flex items-center gap-sm">
            <CalendarDots size={22} weight="light" className="text-brand-main" />
            Upcoming meets
          </h2>
          <ButtonAction variant="tertiary" size="sm" href="/meets">
            See all
          </ButtonAction>
        </div>
        <div className="flex flex-col gap-md">
          {upcomingMeets.map((meet) => (
            <MeetCard key={meet.id} meet={meet} />
          ))}
        </div>
      </section>

      {/* Suggested Connections */}
      <section className="flex flex-col gap-md">
        <h2 className="font-heading text-xl font-semibold text-fg-primary flex items-center gap-sm">
          <Handshake size={22} weight="light" className="text-brand-main" />
          People you&apos;ve met
        </h2>
        {suggestedConnections.length > 0 ? (
          <>
            <p className="text-sm text-fg-tertiary">
              From your recent walk at {completedMeet?.location}
            </p>
            <div className="home-connections-grid">
              {suggestedConnections.map((person) => (
                <div key={person.userId} className="home-connection-card">
                  <img
                    src={person.avatarUrl}
                    alt={person.userName}
                    className="home-connection-avatar"
                  />
                  <div className="flex flex-col flex-1 gap-xs">
                    <span className="text-sm font-medium text-fg-primary">
                      {person.userName}
                    </span>
                    <span className="text-xs text-fg-tertiary flex items-center gap-xs">
                      <Dog size={12} weight="light" />
                      {person.dogNames.join(", ")}
                    </span>
                  </div>
                  <ButtonAction variant="outline" size="sm">
                    Connect
                  </ButtonAction>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-md rounded-panel bg-surface-top p-xl shadow-sm">
            <Handshake size={48} weight="light" className="text-fg-tertiary" />
            <p className="text-sm text-fg-secondary text-center">
              Attend a meet to discover dog owners in your area.
            </p>
          </div>
        )}
      </section>

      {/* Community Highlights */}
      <section className="flex flex-col gap-md">
        <h2 className="font-heading text-xl font-semibold text-fg-primary flex items-center gap-sm">
          <PawPrint size={22} weight="light" className="text-brand-main" />
          Your neighbourhood
        </h2>
        <div className="home-highlights-grid">
          {completedMeet && (
            <div className="home-highlight-card">
              <div className="home-highlight-icon">
                <CalendarDots size={20} weight="light" />
              </div>
              <div className="flex flex-col gap-xs flex-1">
                <span className="text-sm font-medium text-fg-primary">
                  {completedMeet.title}
                </span>
                <span className="text-xs text-fg-tertiary">
                  {completedMeet.attendees.length} people attended with{" "}
                  {completedMeet.attendees.reduce(
                    (s, a) => s + a.dogNames.length,
                    0,
                  )}{" "}
                  dogs
                </span>
              </div>
            </div>
          )}
          <div className="home-highlight-card">
            <div className="home-highlight-icon">
              <PawPrint size={20} weight="light" />
            </div>
            <div className="flex flex-col gap-xs flex-1">
              <span className="text-sm font-medium text-fg-primary">
                +12 meets this week in Prague
              </span>
              <span className="text-xs text-fg-tertiary">
                Your neighbourhood is getting active!
              </span>
            </div>
          </div>
          <div className="home-highlight-card home-highlight-card--cta">
            <div className="flex flex-col gap-xs flex-1">
              <span className="text-sm font-medium text-fg-primary">
                Want to offer care?
              </span>
              <span className="text-xs text-fg-tertiary">
                Add services to your profile and your connected neighbours will see them.
              </span>
            </div>
            <ButtonAction
              variant="tertiary"
              size="sm"
              href="/profile"
              rightIcon={<ArrowRight size={14} weight="bold" />}
            >
              Set up
            </ButtonAction>
          </div>
        </div>
      </section>
    </div>
  );
}
