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
import {
  VACCINATION_LABELS,
  deriveAutoTags,
  derivePolicyChips,
  formatVaccinationDate,
  sortVaccinations,
} from "@/lib/petUtils";
import { PERSONALITY_TAG_LABELS } from "@/lib/constants/dogs";
import type { PetProfile, Post, ShelterProfile, VetInfo } from "@/lib/types";

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
  // Shelter-care stats (In care, Last walked) only render while the dog
  // is actively being cared for at the shelter. Once adopted, the dog
  // has gone home and those numbers stop being meaningful.
  const showCareStats = dog.adoptionStatus !== "adopted";
  // Tag taxonomy (FC8 formalization, 2026-06-02): auto-derived chips
  // (Adoption pending / New arrival / Long-stayer / energy) come from
  // `deriveAutoTags`; personality tags come from the typed
  // `PersonalityTag` vocabulary; policy chips render separately because
  // they gate handler eligibility, not disposition.
  const autoTags = deriveAutoTags(dog, new Date());
  const personalityTags = dog.personalityTags ?? [];
  const policyChips = derivePolicyChips(dog);

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

            {/* Tags row. Three categories rendered in order:
                1. Auto-derived chips (Adoption pending > New arrival >
                   Long-stayer > energy) via `deriveAutoTags`.
                2. Curated personality tags from the typed
                   `PersonalityTag` vocabulary.
                See [[features/shelters]] → "Dog profile tag taxonomy"
                for the formalization (FC8). */}
            {(autoTags.length > 0 || personalityTags.length > 0) && (
              <div className="dog-profile-tags">
                {autoTags.map((t) => (
                  <span
                    key={t.kind}
                    className={`dog-profile-tag dog-profile-tag--${t.tone}`}
                  >
                    {t.label}
                  </span>
                ))}
                {personalityTags.map((tag) => (
                  <span key={tag} className="dog-profile-tag">
                    {PERSONALITY_TAG_LABELS[tag]}
                  </span>
                ))}
              </div>
            )}

            {/* Handling policy chips — solo-only, experienced handlers
                only. Visually separate from personality tags because
                these gate walker eligibility. Shelter dogs only;
                derived via `derivePolicyChips`. */}
            {policyChips.length > 0 && (
              <div className="dog-profile-policy">
                <ShieldCheck size={14} weight="light" />
                <span>
                  {policyChips.map((c) => c.label).join(" · ")}
                </span>
              </div>
            )}
          </div>

          {/* Health & vaccinations (Vaccines V1, 2026-06-02). Owner /
              shelter self-declared; verification belongs to V2 (Open
              Q §15 + §16). The acknowledger label is shelter-side here;
              the owned-dog branch in Workstream A uses the owner. */}
          <DogHealthSection
            vet={dog.vetInfo}
            acknowledgerLabel={shelter.name}
          />

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

/**
 * Health & vaccinations section. Renders Vaccines V1 records as chips with
 * an acknowledgement caption. Owner self-declared — no platform verification
 * in V1 (Open Q §15 + §16 carry the V2 + V3 paths). Hidden entirely when
 * there's no vet info at all (the page surface should not advertise empty
 * health data — that reads worse than absence).
 */
function DogHealthSection({
  vet,
  acknowledgerLabel,
}: {
  vet: VetInfo | undefined;
  acknowledgerLabel: string;
}) {
  const records = vet?.vaccinations ?? [];
  const hasAnyHealthData = !!vet && (records.length > 0 || vet.spayedNeutered);

  if (!hasAnyHealthData) return null;

  const sorted = sortVaccinations(records);

  return (
    <div className="dog-profile-section">
      <h2 className="dog-profile-section-title">Health</h2>
      {records.length > 0 ? (
        <>
          <div className="dog-profile-tags">
            {sorted.map((r) => (
              <span
                key={r.type}
                className="dog-profile-tag"
                title={`${VACCINATION_LABELS[r.type]} — last given ${r.lastGivenAt}`}
              >
                {VACCINATION_LABELS[r.type]} · {formatVaccinationDate(r.lastGivenAt)}
              </span>
            ))}
          </div>
          {vet?.vaccinationsAcknowledgedAt && (
            <p className="text-xs text-fg-tertiary mt-xs">
              Confirmed by {acknowledgerLabel} on{" "}
              {formatVaccinationDate(vet.vaccinationsAcknowledgedAt)}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-fg-tertiary">No vaccination records on file.</p>
      )}
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
