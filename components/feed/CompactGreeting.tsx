"use client";

import { MapPin, Camera, MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { UserProfile } from "@/lib/types";

export function CompactGreeting({ user }: { user: UserProfile }) {
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
        <div className="flex flex-col gap-xxs flex-1">
          <span className="font-semibold text-fg-primary text-lg leading-normal">
            Hey, {user.firstName}!
          </span>
          <span className="flex items-center gap-xs text-xs text-fg-tertiary">
            <MapPin size={12} weight="light" />
            {user.neighbourhood || user.location}
          </span>
        </div>
      </div>

      {/* Action buttons — side by side on mobile, just Add Post on desktop */}
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
        <ButtonAction
          variant="outline"
          size="sm"
          cta
          href="/explore/results"
          leftIcon={<MagnifyingGlass size={16} weight="light" />}
          className="feed-greeting-find-care"
        >
          Find Care
        </ButtonAction>
      </div>
    </div>
  );
}
