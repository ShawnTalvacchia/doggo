"use client";

import { Dog } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockUser } from "@/lib/mockUser";

export function HomeWelcome() {
  const petNames = mockUser.pets.map((p) => p.name);
  const dogsPhrase =
    petNames.length === 1
      ? petNames[0]
      : petNames.length === 2
        ? `${petNames[0]} and ${petNames[1]}`
        : "your pups";
  const neighbourhood = mockUser.neighbourhood || "your area";

  return (
    <section className="flex flex-col items-center gap-lg rounded-panel bg-surface-top p-xl shadow-sm text-center">
      {/* Dog avatars */}
      <div className="flex items-center justify-center gap-md">
        {mockUser.pets.slice(0, 2).map((pet) => (
          <div key={pet.id} className="flex flex-col items-center gap-xs">
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="rounded-full"
              style={{ width: 64, height: 64, objectFit: "cover", border: "3px solid var(--brand-subtle)" }}
            />
            <span className="text-xs font-medium text-fg-primary">{pet.name}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-sm">
        <h2 className="font-heading text-2xl font-semibold text-fg-primary">
          Welcome to Doggo, {mockUser.firstName}!
        </h2>
        <p className="text-sm text-fg-secondary">
          Let&apos;s find {dogsPhrase} some friends in {neighbourhood}
        </p>
      </div>

      <div className="flex gap-sm w-full" style={{ maxWidth: 400 }}>
        <ButtonAction variant="primary" size="md" href="/activity" className="flex-1">
          Find meets near you
        </ButtonAction>
        <ButtonAction variant="secondary" size="md" href="/meets/create" className="flex-1">
          Create a meet
        </ButtonAction>
      </div>
    </section>
  );
}
