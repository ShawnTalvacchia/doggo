"use client";

import { useParams } from "next/navigation";
import {
  MapPin,
  PawPrint,
  Handshake,
  ArrowLeft,
  ShareNetwork,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockUser } from "@/lib/mockUser";

/**
 * Share profile link page — `/connect/[code]`
 *
 * Shows a basic profile with a Connect CTA.
 * The link itself is the trust signal — it bypasses discovery gates.
 *
 * For the prototype, we only resolve the current user's share code.
 */
export default function ShareProfilePage() {
  const { code } = useParams<{ code: string }>();

  // Prototype: only resolve our own user's share code
  const user = code === mockUser.shareCode ? mockUser : null;

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center gap-lg p-xl" style={{ minHeight: "60vh" }}>
        <ShareNetwork size={48} weight="light" className="text-fg-tertiary" />
        <h1 className="font-heading text-3xl font-medium text-fg-primary">Profile not found</h1>
        <p className="text-sm text-fg-secondary text-center" style={{ maxWidth: 320 }}>
          This link may have expired or doesn&apos;t exist. Ask your friend to share their profile again.
        </p>
        <ButtonAction variant="secondary" size="md" href="/">
          Go to Doggo
        </ButtonAction>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center gap-xl p-xl mx-auto"
      style={{ maxWidth: 480, minHeight: "60vh" }}
    >
      {/* Back */}
      <div className="self-start">
        <Link
          href="/"
          className="flex items-center gap-xs text-sm text-fg-secondary"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={16} weight="light" /> Home
        </Link>
      </div>

      {/* Profile card */}
      <div className="flex flex-col items-center gap-lg w-full rounded-panel p-xl bg-surface-top border border-edge-light text-center">
        {/* Avatar */}
        <img
          src={user.avatarUrl}
          alt={user.firstName}
          className="rounded-full object-cover"
          style={{ width: 96, height: 96 }}
        />

        {/* Name */}
        <div>
          <h1 className="font-heading text-3xl font-medium text-fg-primary m-0">
            {user.firstName}
          </h1>
          {user.neighbourhood && (
            <p className="flex items-center justify-center gap-xs text-sm text-fg-secondary mt-xs">
              <MapPin size={14} weight="light" /> {user.neighbourhood}
            </p>
          )}
        </div>

        {/* Dogs */}
        {user.pets.length > 0 && (
          <div className="flex flex-col gap-sm w-full">
            {user.pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center gap-md rounded-panel p-md bg-surface-base"
              >
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-fg-primary">
                    <PawPrint size={14} weight="light" className="inline mr-xs" />
                    {pet.name}
                  </span>
                  <span className="text-xs text-fg-secondary">
                    {pet.breed} · {pet.ageLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connect CTA */}
        <div className="flex flex-col gap-sm w-full mt-md">
          <ButtonAction
            variant="primary"
            size="lg"
            cta
            leftIcon={<Handshake size={20} weight="light" />}
          >
            Connect with {user.firstName}
          </ButtonAction>
          <p className="text-xs text-fg-tertiary">
            {user.firstName} shared this link with you. Connecting lets you message each other and see full profiles.
          </p>
        </div>
      </div>
    </main>
  );
}
