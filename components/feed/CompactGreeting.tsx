"use client";

import { MapPin, Camera } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { UserProfile } from "@/lib/types";

export function CompactGreeting({ user }: { user: UserProfile }) {
  const petNames = user.pets.map((p) => p.name);
  const dogLine =
    petNames.length === 1
      ? `How's ${petNames[0]} doing today?`
      : petNames.length === 2
        ? `How are ${petNames[0]} and ${petNames[1]} doing today?`
        : `How are your pups doing today?`;

  return (
    <div className="feed-greeting">
      <div className="feed-greeting-info">
        {/* Dog avatars */}
        <div className="flex items-center shrink-0">
          {user.pets.slice(0, 2).map((pet, i) => (
            <img
              key={pet.id}
              src={pet.imageUrl}
              alt={pet.name}
              className="rounded-full border-2"
              style={{
                width: 36,
                height: 36,
                objectFit: "cover",
                borderColor: "var(--surface-base)",
                marginLeft: i > 0 ? -10 : 0,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-heading text-lg font-semibold text-fg-primary">
            Hey, {user.firstName}!
          </span>
          <span className="text-xs text-fg-tertiary flex items-center gap-xs">
            {dogLine}
            <span className="flex items-center gap-xs" style={{ marginLeft: 4 }}>
              <MapPin size={10} weight="light" />
              {user.neighbourhood || user.location}
            </span>
          </span>
        </div>
      </div>

      <div className="feed-greeting-action">
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          href="/posts/create"
          leftIcon={<Camera size={16} weight="bold" />}
        >
          Add Post
        </ButtonAction>
      </div>
    </div>
  );
}
