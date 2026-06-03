"use client";

import { useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Buildings,
  Clock,
  PawPrint,
  ShieldCheck,
  Users,
  Heart,
  ArrowRight,
  CaretRight,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import { getShelterDog, getDogPosts } from "@/lib/mockShelters";
import type { PetProfile, Post, ShelterProfile } from "@/lib/types";

/* ── Page wrapper ──────────────────────────────────────────────────── */

export default function DogProfilePage() {
  return (
    <Suspense>
      <DogProfileInner />
    </Suspense>
  );
}

function DogProfileInner() {
  const params = useParams();
  const router = useRouter();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const { lastListPath } = useNavigationMemory();

  const dogId = params.id as string;
  const resolved = getShelterDog(dogId);

  // Shelter dogs always go up to their shelter's Dogs tab (tree-hierarchy
  // — the dog belongs to the shelter regardless of how the viewer
  // arrived). Unknown / future owned-dog cases are source-aware (last
  // list page, fallback /home).
  const parentHref = resolved
    ? `/shelters/${resolved.shelter.id}?tab=dogs`
    : lastListPath ?? "/home";

  useEffect(() => {
    setDetailHeader(resolved?.dog.name ?? "Dog", () => router.push(parentHref));
    return () => clearDetailHeader();
  }, [resolved?.dog.name, parentHref]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unknown dog — gracefully degrades for owned-dog tags whose profile
  // route doesn't ship until the Dog Profile phase. NOT a 404 — the route
  // is real, the content just hasn't landed yet.
  if (!resolved) {
    return (
      <div className="dog-profile-page">
        <DetailHeader backLabel="Back" title="Dog" backHref={parentHref} />
        <div className="dog-profile-panel">
          <div className="dog-profile-body">
            <div className="px-lg py-xl">
              <EmptyState
                icon={<PawPrint size={32} weight="light" />}
                title="Dog profile coming soon"
                subtitle="Owned-dog profiles arrive with the Dog Profile phase. Shelter dogs are already live. Try the Útulek Liběň roster."
                action={
                  <ButtonAction
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push("/shelters/utulek-liben?tab=dogs")}
                  >
                    Browse shelter dogs
                  </ButtonAction>
                }
              />
            </div>
            <Spacer />
          </div>
        </div>
      </div>
    );
  }

  const { dog, shelter } = resolved;
  const posts = getDogPosts(dog.id);
  const isLongStayer = (dog.daysInKennel ?? 0) >= 30;
  // Shelter-care stats (In care, Last walked) only render while the dog
  // is actively being cared for at the shelter. Once adopted, the dog
  // has gone home and those numbers stop being meaningful.
  const showCareStats = dog.adoptionStatus !== "adopted";
  const energyLabel = formatEnergy(dog.energyLevel);
  // Manual tags can duplicate auto-derivable labels (older seeds set
  // "Calm" or "High energy" manually alongside `energyLevel`). Dedupe
  // when rendering so the user doesn't see the same chip twice. Energy
  // gets its own chip first; matching manual tags get filtered.
  const energyDedupe = energyLabel ? new Set([energyLabel.toLowerCase()]) : new Set<string>();
  const manualTags = (dog.tags ?? []).filter(
    (t) => !energyDedupe.has(t.toLowerCase()),
  );

  return (
    <div className="dog-profile-page">
      <DetailHeader backLabel="Back" title={dog.name} backHref={parentHref} />
      <div className="dog-profile-panel">
        <div className="dog-profile-body">
          {/* Pet-as-protagonist hero — full-width photo, name overlay.
              Hero meta line carries the universal dog stats: breed,
              age, sex, weight. Status-y data (In care, Last walked,
              energy, tags) lives in the body below. */}
          <div
            className="dog-profile-hero"
            style={{ backgroundImage: `url(${dog.imageUrl})` }}
          >
            <div className="dog-profile-hero-overlay">
              <h1 className="dog-profile-name">{dog.name}</h1>
              <div className="dog-profile-line">
                {[
                  dog.breed,
                  dog.ageLabel,
                  dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : null,
                  dog.weightLabel,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            {dog.adoptionStatus === "pending" && (
              <span className="dog-profile-status-pill">Adoption pending</span>
            )}
          </div>

          <div className="dog-profile-section">
            {/* Backstory */}
            {dog.backstory && (
              <p className="dog-profile-backstory">{dog.backstory}</p>
            )}

            {/* Shelter-care stats. Only render while the dog is actively
                in shelter care (pre-adopted). Owned dogs and adopted
                shelter dogs hide this row entirely. */}
            {showCareStats && (
              <div className="dog-profile-stats">
                <DogStatTile
                  icon={<Clock size={12} weight="light" />}
                  label="In care"
                  value={
                    dog.daysInKennel != null
                      ? `${dog.daysInKennel} ${dog.daysInKennel === 1 ? "day" : "days"}`
                      : "Just arrived"
                  }
                  /* Long-stayer subline removed — it duplicated the
                     "Long-stayer" chip in the tag row below. Keep both
                     stat columns at two rows for visual parity. */
                />
                <DogStatTile
                  icon={<PawPrint size={12} weight="light" />}
                  label="Last walked"
                  value={dog.lastWalkedAt ? formatRelativeDay(dog.lastWalkedAt) : "Not yet"}
                />
              </div>
            )}

            {/* Tags row. Energy chip first (auto-derived from
                `energyLevel`), then auto Long-stayer (auto-derived from
                `daysInKennel`), then manually-set personality tags.
                Tag taxonomy is intentional but not yet formalized — see
                FC8 in Future Considerations. */}
            {(energyLabel || isLongStayer || manualTags.length > 0) && (
              <div className="dog-profile-tags">
                {energyLabel && (
                  <span className="dog-profile-tag dog-profile-tag--energy">
                    {energyLabel}
                  </span>
                )}
                {isLongStayer && !dog.tags?.includes("Long-stayer") && (
                  <span className="dog-profile-tag dog-profile-tag--long">Long-stayer</span>
                )}
                {manualTags.map((tag) => (
                  <span key={tag} className="dog-profile-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Handling policy notes — solo only, experienced handlers
                only. Visually separate from personality tags because
                these gate walker eligibility. Shelter dogs only. */}
            {(dog.soloOnly || dog.experiencedHandlersOnly) && (
              <div className="dog-profile-policy">
                <ShieldCheck size={14} weight="light" />
                <span>
                  {dog.soloOnly && "Solo walks only"}
                  {dog.soloOnly && dog.experiencedHandlersOnly && " · "}
                  {dog.experiencedHandlersOnly && "Experienced handlers only"}
                </span>
              </div>
            )}
          </div>

          {/* Recent walkers — avatar stack only this phase; walker journey
              and richer per-dog walker history land with credentialing-moat. */}
          <RecentWalkers shelter={shelter} dogId={dog.id} />

          {/* Posts about this dog */}
          <DogPostsSection dog={dog} posts={posts} />

          {/* Backlink to shelter */}
          <ShelterBacklink shelter={shelter} />

          <Spacer />
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function DogStatTile({
  icon,
  label,
  value,
  subline,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subline?: string;
}) {
  return (
    <div className="dog-profile-stat">
      <div className="dog-profile-stat-header">
        <span className="dog-profile-stat-icon" aria-hidden="true">{icon}</span>
        <span className="dog-profile-stat-label">{label}</span>
      </div>
      <div className="dog-profile-stat-value">{value}</div>
      {subline && <div className="dog-profile-stat-subline">{subline}</div>}
    </div>
  );
}

function RecentWalkers({ shelter, dogId }: { shelter: ShelterProfile; dogId: string }) {
  // Surface walkers via the dog's tagged posts — anyone who authored a
  // post tagging this dog AND is also a walker at the shelter counts as
  // "recent walker." A real visit-report ledger lands with credentialing-moat.
  const posts = getDogPosts(dogId);
  const walkerIds = new Set(shelter.walkers.map((w) => w.userId));
  const recentByAuthor = new Map<string, { displayName: string; avatarUrl?: string }>();
  for (const post of posts) {
    if (walkerIds.has(post.authorId) && !recentByAuthor.has(post.authorId)) {
      const walker = shelter.walkers.find((w) => w.userId === post.authorId);
      if (walker) {
        recentByAuthor.set(post.authorId, {
          displayName: walker.displayName,
          avatarUrl: walker.avatarUrl,
        });
      }
    }
  }
  const recent = [...recentByAuthor.values()].slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="dog-profile-section">
      <h2 className="dog-profile-section-title">Recent walkers</h2>
      <div className="dog-profile-walkers">
        {recent.map((w) => (
          <div key={w.displayName} className="dog-profile-walker">
            {w.avatarUrl ? (
              <img src={w.avatarUrl} alt={w.displayName} className="dog-profile-walker-avatar" />
            ) : (
              <DefaultAvatar name={w.displayName} size={36} />
            )}
            <span className="text-xs text-fg-secondary text-center">{w.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DogPostsSection({ dog, posts }: { dog: PetProfile; posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="dog-profile-section">
        <h2 className="dog-profile-section-title">Posts about {dog.name}</h2>
        <EmptyState
          icon={<PawPrint size={28} weight="light" />}
          title={`No posts about ${dog.name} yet`}
          subtitle="Walks and updates from her shelter and walkers will appear here."
        />
      </div>
    );
  }
  return (
    <div className="dog-profile-section">
      <h2 className="dog-profile-section-title">Posts about {dog.name}</h2>
      <div className="dog-profile-posts">
        {posts.map((post) => (
          <MomentCardFromPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function ShelterBacklink({ shelter }: { shelter: ShelterProfile }) {
  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="dog-profile-shelter-backlink"
      style={{ textDecoration: "none" }}
    >
      <img src={shelter.logoUrl} alt={shelter.name} className="dog-profile-shelter-backlink-logo" />
      <div className="flex flex-col gap-tiny flex-1 min-w-0">
        <span className="text-xs text-fg-tertiary">Cared for by</span>
        <span className="text-sm font-semibold text-fg-primary">{shelter.name}</span>
      </div>
      <CaretRight size={14} weight="bold" className="text-fg-tertiary" />
    </Link>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatRelativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/** Translate the raw `energyLevel` enum to a human-readable chip label.
 *  Returns `null` when the field is missing so the chip is skipped
 *  entirely (no "Unknown energy" placeholder). */
function formatEnergy(level: string | undefined): string | null {
  switch (level) {
    case "low":
      return "Calm";
    case "moderate":
      return "Easygoing";
    case "high":
      return "Active";
    case "very_high":
      return "High energy";
    default:
      return null;
  }
}
