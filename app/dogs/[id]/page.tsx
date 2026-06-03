"use client";

import { Fragment, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  PawPrint,
  ShieldCheck,
  Lock,
  CaretRight,
  Syringe,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getShelterDog, getDogPosts } from "@/lib/mockShelters";
import { getOwnedDogWithOwner } from "@/lib/mockUsers";
import {
  VACCINATION_LABELS,
  deriveAutoTags,
  derivePolicyChips,
  formatVaccinationDate,
  sortVaccinations,
} from "@/lib/petUtils";
import { PERSONALITY_TAG_LABELS } from "@/lib/constants/dogs";
import type {
  PetProfile,
  Post,
  ShelterProfile,
  UserProfile,
  VetInfo,
} from "@/lib/types";

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
  const currentUserId = useCurrentUserId();
  const { getConnection } = useConnections();

  const dogId = params.id as string;

  // Resolve in two passes: shelter dogs first, then owned dogs. The two
  // share the rendering spine (hero + tags + health + posts); the
  // surrounding sections differ — shelter has care-stats / recent walkers
  // / shelter backlink; owned has owner backlink only.
  const shelterResolved = getShelterDog(dogId);
  const ownedResolved = !shelterResolved ? getOwnedDogWithOwner(dogId) : null;

  // Visibility gate for owned dogs (A7). The dog profile inherits the
  // owner's profile visibility. Open owner → public dog profile. Locked
  // owner → only Familiar/Connected/Pending viewers (matches the
  // `/profile/[userId]` lock logic — unlocking is the SUBJECT's choice,
  // so viewer-marked Familiar does NOT unlock).
  const ownedVisible = (() => {
    if (!ownedResolved) return false;
    const owner = ownedResolved.owner;
    if (owner.profileVisibility === "open") return true;
    if (owner.id === currentUserId) return true; // own dog
    const connection = getConnection(owner.id, currentUserId);
    if (connection?.theyMarkedFamiliar) return true;
    const state = connection?.state ?? "none";
    return state === "connected" || state === "pending";
  })();

  // Back-nav target. Shelter dogs go up to their shelter's Dogs tab
  // (tree-hierarchy). Owned dogs go to the owner's profile (or `/profile`
  // for self). Unknown dogs use source-aware nav memory.
  const parentHref = (() => {
    if (shelterResolved) return `/shelters/${shelterResolved.shelter.id}?tab=dogs`;
    if (ownedResolved) {
      if (ownedResolved.owner.id === currentUserId) return "/profile";
      return `/profile/${ownedResolved.owner.id}`;
    }
    return lastListPath ?? "/home";
  })();

  const dogName =
    shelterResolved?.dog.name ?? ownedResolved?.dog.name ?? "Dog";

  useEffect(() => {
    setDetailHeader(dogName, () => router.push(parentHref));
    return () => clearDetailHeader();
  }, [dogName, parentHref]); // eslint-disable-line react-hooks/exhaustive-deps

  // Owned dog gated by the owner's lock — render a locked-style empty
  // state. The owner action button is the connection path: the dog's
  // lock derives from the owner's lock, so "meet the owner" is the only
  // way through. Routing to the owner's profile lands on their own
  // locked-profile preview (with its Connect CTA) when relevant — no
  // additional privacy leak vs. what a meet-attendee row already shows.
  if (ownedResolved && !ownedVisible) {
    return (
      <div className="dog-profile-page">
        <DetailHeader backLabel="Back" title={ownedResolved.dog.name} backHref={parentHref} />
        <div className="dog-profile-panel">
          <div className="dog-profile-body">
            <div className="px-lg py-xl">
              <EmptyState
                icon={<Lock size={32} weight="light" />}
                title={`${ownedResolved.dog.name}'s profile is private`}
                subtitle={`Connect with ${ownedResolved.owner.firstName} at a meet to see ${ownedResolved.dog.name}'s profile.`}
                action={
                  <ButtonAction
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/profile/${ownedResolved.owner.id}`)}
                  >
                    View {ownedResolved.owner.firstName}'s profile
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

  // Truly unknown dog — neither a shelter dog nor an owned dog. NOT a
  // 404; the route is real, the id just doesn't resolve.
  if (!shelterResolved && !ownedResolved) {
    return (
      <div className="dog-profile-page">
        <DetailHeader backLabel="Back" title="Dog" backHref={parentHref} />
        <div className="dog-profile-panel">
          <div className="dog-profile-body">
            <div className="px-lg py-xl">
              <EmptyState
                icon={<PawPrint size={32} weight="light" />}
                title="Dog profile not found"
                subtitle="This dog isn't in the directory. Try the Útulek Liběň shelter roster."
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

  const dog = (shelterResolved?.dog ?? ownedResolved?.dog) as PetProfile;
  const shelter = shelterResolved?.shelter;
  const owner = ownedResolved?.owner;
  const posts = getDogPosts(dog.id);
  // Shelter-care stats (In care, Last walked) only render while the dog
  // is actively being cared for at the shelter. Once adopted, the dog
  // has gone home and those numbers stop being meaningful. Owned dogs
  // never show them — daysInKennel + lastWalkedAt are shelter-only.
  const showCareStats =
    !!shelter && dog.adoptionStatus !== "adopted";
  // Tag taxonomy (FC8 formalization, 2026-06-02): auto-derived chips
  // (Adoption pending / New arrival / Long-stayer / energy) come from
  // `deriveAutoTags`; personality tags come from the typed
  // `PersonalityTag` vocabulary; policy chips render separately because
  // they gate handler eligibility, not disposition.
  const autoTags = deriveAutoTags(dog, new Date());
  const personalityTags = dog.personalityTags ?? [];
  const policyChips = derivePolicyChips(dog);
  // Acknowledger label for the Health section caption. Shelter dogs:
  // the shelter. Owned dogs: the owner's first name.
  const acknowledgerLabel = shelter?.name ?? owner?.firstName ?? "Owner";

  return (
    <div className="dog-profile-page">
      <DetailHeader backLabel="Back" title={dog.name} backHref={parentHref} />
      <div className="dog-profile-panel">
        <div className="dog-profile-body">
          {/* Hero — side-by-side card pattern (refactored 2026-06-03).
              Rounded-square photo (Avatar Rule B — dogs are squares) +
              name/meta beside it. Same shape across shelter + owned
              dogs; "Adoption pending" pill sits next to the name when
              applicable (shelter-only). The earlier full-bleed 4:3 hero
              was retired because square-source pet portraits stretched
              awkwardly across surfaces. */}
          <div className="dog-profile-hero">
            <div className="dog-profile-hero-photo-wrap">
              <img
                src={dog.imageUrl}
                alt={dog.name}
                className="dog-profile-hero-photo"
              />
            </div>
            <div className="dog-profile-hero-content">
              <div className="dog-profile-hero-name-row">
                <h1 className="dog-profile-name">{dog.name}</h1>
                {dog.adoptionStatus === "pending" && (
                  <span className="dog-profile-status-pill">Adoption pending</span>
                )}
              </div>
              <div className="dog-profile-line">
                {[
                  dog.breed,
                  dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : null,
                  dog.ageLabel,
                  dog.weightLabel,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>

              {/* Tag row lives inside the hero (moved from the next
                  section, 2026-06-03). Putting auto + personality tags
                  beside the photo gives the dog identity upfront — the
                  card reads "this is who Franta is" at first glance.
                  Policy chips stay below (operational, not identity). */}
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
            </div>
          </div>

          {/* "About + operational" section. Suppresses entirely when
              empty (owned dogs with no backstory get no orphan padding).
              Tags moved into the hero — this section now carries the
              shelter-care stats, the optional backstory paragraph, and
              the policy strip. */}
          {(dog.backstory || showCareStats || policyChips.length > 0) && (
            <div className="dog-profile-section">
              {/* Backstory — works for both shelter dogs (shelter-authored)
                  and owned dogs (owner-authored "About {Dog}"). */}
              {dog.backstory && (
                <p className="dog-profile-backstory">{dog.backstory}</p>
              )}

              {/* Shelter-care stats. Only render while the dog is actively
                  in shelter care (pre-adopted). Owned dogs hide this row
                  entirely — those numbers don't exist outside the shelter
                  context. */}
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
                  />
                  <DogStatTile
                    icon={<PawPrint size={12} weight="light" />}
                    label="Last walked"
                    value={dog.lastWalkedAt ? formatRelativeDay(dog.lastWalkedAt) : "Not yet"}
                  />
                </div>
              )}

              {/* Handling policy chips — solo-only, experienced handlers
                  only. Operational (about who can walk the dog) — stays
                  below the hero, not co-mingled with identity tags.
                  Shelter dogs only; owned dogs never carry these fields. */}
              {policyChips.length > 0 && (
                <div className="dog-profile-policy">
                  <ShieldCheck size={14} weight="light" />
                  <span>
                    {policyChips.map((c) => c.label).join(" · ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Standing preferences (likes / dislikes / triggers / play).
              Per-pet baseline that anyone who books sees — eliminates the
              "tell every new carer what they need to know" tax. Per-booking
              overrides are deferred (see [[features/explore-and-care]]
              Key Decision #8). */}
          <DogPreferencesSection
            dogName={dog.name}
            preferences={dog.preferences}
          />

          {/* Health & vaccinations (Vaccines V1, 2026-06-02). Owner /
              shelter self-declared; verification belongs to V2 (Open
              Q §15 + §16). Acknowledger label = shelter name (shelter
              dogs) or owner first name (owned dogs). */}
          <DogHealthSection
            vet={dog.vetInfo}
            acknowledgerLabel={acknowledgerLabel}
          />

          {/* Recent walkers — shelter dogs only. Walker journey + richer
              per-dog walker history land with the credentialing-moat
              phase. */}
          {shelter && <RecentWalkers shelter={shelter} dogId={dog.id} />}

          {/* Photos landing slot (Dog Profile phase, 2026-06-02). Reserves
              the surface for the Photos & Galleries phase, which will
              populate an auto-album from tagged posts. V1 surfaces only
              the existing curated `photoGallery` field; the auto-album +
              owner moderation + Highlights pinning belong to the next
              phase. See [[phases/photos-and-galleries]] (draft). */}
          <DogPhotoGallerySection dog={dog} />

          {/* Posts about this dog. Works identically for owned + shelter
              dogs — `getDogPosts(id)` matches posts tagging the dog id. */}
          <DogPostsSection dog={dog} posts={posts} />

          {/* Backlink: shelter (shelter dog) or owner (owned dog). */}
          {shelter && <ShelterBacklink shelter={shelter} />}
          {owner && <OwnerBacklink owner={owner} isSelf={owner.id === currentUserId} />}

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
 * Standing preferences section — "How {Dog} likes to be cared for."
 * Four sub-groups (Likes / Dislikes / Triggers / Play) rendered as chip
 * rows under a sub-label. Skips empty groups. Hidden entirely when no
 * preferences are authored. Visible to anyone who can see the profile
 * AND to carers on the booking detail Info tab.
 */
function DogPreferencesSection({
  dogName,
  preferences,
}: {
  dogName: string;
  preferences: PetProfile["preferences"];
}) {
  const groups: Array<{ key: string; label: string; items?: string[] }> = [
    { key: "likes", label: "Likes", items: preferences?.likes },
    { key: "dislikes", label: "Dislikes", items: preferences?.dislikes },
    { key: "triggers", label: "Triggers", items: preferences?.triggers },
    {
      key: "playPreferences",
      label: "Play",
      items: preferences?.playPreferences,
    },
  ];
  const nonEmpty = groups.filter((g) => g.items && g.items.length > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <div className="dog-profile-section">
      <h2 className="dog-profile-section-title">How {dogName} likes to be cared for</h2>
      <div className="dog-profile-prefs">
        {nonEmpty.map((g) => (
          <Fragment key={g.key}>
            <span className="dog-profile-prefs-label">{g.label}</span>
            <span className="dog-profile-prefs-items">{g.items!.join(" · ")}</span>
          </Fragment>
        ))}
      </div>
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
                className="dog-profile-tag dog-profile-tag--vaccine"
                title={`${VACCINATION_LABELS[r.type]} — last given ${r.lastGivenAt}`}
              >
                <Syringe size={11} weight="fill" />
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

/**
 * Photos landing slot (Dog Profile phase, 2026-06-02). Renders the
 * existing curated `photoGallery` thumbnails in a 3-column grid. The
 * Photos & Galleries phase will replace this with an auto-album drawn
 * from posts tagged with the dog id, plus owner moderation + Highlights
 * pinning. V1 reserves the surface so testers see the section structure.
 *
 * Always renders the header so the upcoming auto-album feels in-place;
 * the body shows thumbs if seeded, an empty caption otherwise.
 */
function DogPhotoGallerySection({ dog }: { dog: PetProfile }) {
  const photos = dog.photoGallery ?? [];
  return (
    <div className="dog-profile-section">
      <h2 className="dog-profile-section-title">Photos</h2>
      <p className="text-xs text-fg-tertiary">
        Coming soon — photos from posts tagging {dog.name} will surface here.
      </p>
      {photos.length > 0 ? (
        <div
          className="grid gap-xs"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: "var(--space-sm)" }}
        >
          {photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${dog.name} photo ${i + 1}`}
              className="rounded-sm"
              style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
            />
          ))}
        </div>
      ) : null}
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

/**
 * Owned-dog backlink — mirrors the shelter backlink visually so the two
 * sit in the same slot at the bottom of the profile. Avatar Rule B:
 * owner is a person → circle (using the same shelter-backlink-logo class
 * which is round). Routes to `/profile` for self, `/profile/<id>` for
 * others.
 */
function OwnerBacklink({ owner, isSelf }: { owner: UserProfile; isSelf: boolean }) {
  const href = isSelf ? "/profile" : `/profile/${owner.id}`;
  const ownerName = `${owner.firstName} ${owner.lastName}`.trim();

  return (
    <Link
      href={href}
      className="dog-profile-shelter-backlink"
      style={{ textDecoration: "none" }}
    >
      {owner.avatarUrl ? (
        <img
          src={owner.avatarUrl}
          alt={ownerName}
          className="dog-profile-shelter-backlink-logo"
        />
      ) : (
        <DefaultAvatar name={ownerName} size={40} />
      )}
      <div className="flex flex-col gap-tiny flex-1 min-w-0">
        <span className="text-xs text-fg-tertiary">{isSelf ? "Your dog" : "Lives with"}</span>
        <span className="text-sm font-semibold text-fg-primary">
          {isSelf ? "You" : ownerName}
        </span>
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
