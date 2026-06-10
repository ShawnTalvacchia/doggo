"use client";

import { Fragment, useCallback, useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  PawPrint,
  ShieldCheck,
  Lock,
  CaretRight,
  Syringe,
  PencilSimple,
  X,
  Check,
  Camera,
  GenderMale,
  GenderFemale,
  Footprints,
  HandHeart,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { PostsCollectionView } from "@/components/posts/PostsCollectionView";
import { PetEditCard } from "@/components/profile/PetEditCard";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getShelterDog, getDogPosts } from "@/lib/mockShelters";
import { getOwnedDogWithOwner } from "@/lib/mockUsers";
import { getPostsByDog } from "@/lib/dogPosts";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { HighlightsStrip } from "@/components/photos/HighlightsStrip";
import { EditHighlightsModal } from "@/components/photos/EditHighlightsModal";
import { PhotosSettingsMenu } from "@/components/photos/PhotosSettingsMenu";
import { usePhotoAlbumOverrides } from "@/lib/usePhotoAlbumOverrides";
import { useUntagStore } from "@/lib/useUntagStore";
import { usePendingTagsStore } from "@/lib/usePendingTagsStore";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useWalkerApplications, deriveWalkerTier } from "@/contexts/WalkerApplicationsContext";
import { WalkApplicationSheet } from "@/components/shelters/WalkApplicationSheet";
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
  TagApproval,
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
  const searchParams = useSearchParams();
  const { setDetailHeader, clearDetailHeader, setPageAction, clearPageAction } =
    usePageHeader();
  const { lastListPath, previousPath } = useNavigationMemory();
  const currentUserId = useCurrentUserId();
  const { getConnection } = useConnections();

  const dogId = params.id as string;

  // Owner-side edit lifecycle (Workstream G, 2026-06-03). Edit lives on
  // /dogs/[id] instead of inline on /profile — the dog page is the
  // canonical surface for everything about a dog, including authoring.
  // `?edit=1` URL param auto-enters edit mode (used by /profile's Add
  // Dog flow: create blank pet → route here in edit mode → fill in).
  // PROTOTYPE NOTE: Save currently exits edit mode without persisting
  // changes app-wide — matches the rest of the prototype's stub-state
  // mutation pattern. Real persistence wires up when a user-state
  // context lands.
  const startInEditMode = searchParams.get("edit") === "1";
  const [editing, setEditing] = useState(startInEditMode);
  const [editDraft, setEditDraft] = useState<PetProfile | null>(null);

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

  // Back-nav target. Shelter dogs default to their shelter's Dogs tab
  // (tree-hierarchy), but prefer source-aware nav memory when the viewer
  // came directly from a Discover surface — the Help a Dog door
  // (2026-06-08) and any future Discover entry that surfaces shelter dogs
  // directly. If the viewer traversed a shelter detail page on the way to
  // the dog (Discover → shelter → dog), the tree-hierarchy default wins
  // because that shelter Dogs tab is what the viewer was just browsing.
  // `previousPath` disambiguates: `lastListPath` stays at the Discover URL
  // through detail-page hops, so it alone can't tell the two flows apart.
  // Owned dogs go to the owner's profile (or `/profile` for self). Unknown
  // dogs fall through to the list-level memory.
  const parentHref = (() => {
    if (shelterResolved) {
      const shelterDogsTab = `/shelters/${shelterResolved.shelter.id}?tab=dogs`;
      // Came via a shelter detail → tree-hierarchy wins regardless of the
      // earlier Discover entry. Match on any /shelters/* path so it covers
      // the Feed / Members / Gallery tabs too.
      if (previousPath && previousPath.startsWith("/shelters/")) {
        return shelterDogsTab;
      }
      // Direct arrival from a Discover surface → source-aware.
      if (lastListPath && lastListPath.startsWith("/discover/")) {
        return lastListPath;
      }
      return shelterDogsTab;
    }
    if (ownedResolved) {
      if (ownedResolved.owner.id === currentUserId) return "/profile";
      return `/profile/${ownedResolved.owner.id}`;
    }
    return lastListPath ?? "/home";
  })();

  const dogName =
    shelterResolved?.dog.name ?? ownedResolved?.dog.name ?? "Dog";

  // Header title (Workstream G, 2026-06-03):
  // - Shelter dogs → the dog's name (current Shelter Foundation behavior).
  // - Owned dogs → "{firstName}'s Dogs" — attributes the dog to its
  //   owner and frames the page as part of that owner's territory.
  //   Sibling tab strip below the header (when owner has >1 dog) lets
  //   visitors switch between the owner's dogs without back-and-forth
  //   through the owner's profile.
  const headerTitle = ownedResolved
    ? `${ownedResolved.owner.firstName}'s Dogs`
    : dogName;

  // Resolved values that ALL downstream hooks read. Possibly-undefined
  // when neither shelter nor owned resolves — guarded inside each hook
  // so they call unconditionally (Rules of Hooks: every hook must run
  // in the same order on every render, including the empty-state
  // returns below). 2026-06-03 fix for a hook-order violation.
  const maybeDog: PetProfile | undefined =
    shelterResolved?.dog ?? ownedResolved?.dog;
  const owner = ownedResolved?.owner;
  const isOwnerView = !!owner && owner.id === currentUserId;

  // Effects + callbacks — declared above any conditional return.

  const startEdit = useCallback(() => setEditing(true), []);
  const cancelEdit = useCallback(() => {
    setEditing(false);
    // Strip ?edit=1 from the URL so a refresh doesn't re-enter edit
    if (searchParams.get("edit") === "1") {
      router.replace(`/dogs/${dogId}`);
    }
  }, [dogId, router, searchParams]);
  const saveEdit = useCallback(() => {
    // PROTOTYPE: real persistence is a follow-up. Exit edit mode and
    // strip the URL param. The PetEditCard's onChange already mutates
    // the local editDraft; without an EditablePetsContext those
    // changes don't propagate back to /profile.
    setEditing(false);
    if (searchParams.get("edit") === "1") {
      router.replace(`/dogs/${dogId}`);
    }
  }, [dogId, router, searchParams]);

  // Owner edit affordance — Edit / Cancel+Save chrome. Hoisted via
  // useMemo so the SAME node passes to both the `<DetailHeader>`
  // component (desktop in-page header) and `setDetailHeader` (mobile
  // AppNav detail-header slot). The convention across detail pages
  // (meets, communities, shelters) is to pass `rightAction` through
  // both surfaces — the AppNav detail-header is mobile-only via
  // `.app-nav-mode--detail { display: none }`, and the in-page
  // `<DetailHeader>` shows on desktop.
  const ownerHeaderAction: React.ReactNode = useMemo(() => {
    if (!isOwnerView) return null;
    if (editing) {
      return (
        <div className="flex items-center gap-sm">
          <ButtonAction
            variant="outline"
            size="sm"
            leftIcon={<X size={14} weight="bold" />}
            onClick={cancelEdit}
          >
            Cancel
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="sm"
            leftIcon={<Check size={14} weight="bold" />}
            onClick={saveEdit}
          >
            Save
          </ButtonAction>
        </div>
      );
    }
    return (
      <ButtonAction
        variant="outline"
        size="sm"
        leftIcon={<PencilSimple size={14} weight="bold" />}
        onClick={startEdit}
      >
        Edit
      </ButtonAction>
    );
  }, [isOwnerView, editing, startEdit, cancelEdit, saveEdit]);

  useEffect(() => {
    setDetailHeader(headerTitle, () => router.push(parentHref), ownerHeaderAction);
    return () => clearDetailHeader();
  }, [headerTitle, parentHref, ownerHeaderAction]); // eslint-disable-line react-hooks/exhaustive-deps

  // Seed the edit draft when entering edit mode (or when the URL flips
  // to ?edit=1 on first load via Add Dog flow). Cancel discards the
  // draft; Save (currently) just exits edit mode.
  useEffect(() => {
    if (!maybeDog) return;
    if (editing && !editDraft) {
      setEditDraft({ ...maybeDog });
    }
    if (!editing && editDraft) {
      setEditDraft(null);
    }
  }, [editing, maybeDog, editDraft]);

  // Nav lock-in during edit — hides Bell + Inbox so the owner has to
  // explicitly Save or Cancel before leaving the dog page. Detail-page
  // convention puts the action chrome in the DetailHeader rightAction
  // slot (see the setDetailHeader effect above); this effect carries
  // ONLY the navLockedIn signal, not the action node.
  useEffect(() => {
    if (!isOwnerView) {
      clearPageAction();
      return;
    }
    setPageAction(null, { navLockedIn: editing, suppressCreate: editing });
    return () => clearPageAction();
  }, [isOwnerView, editing, setPageAction, clearPageAction]);

  // ────────────────────────────────────────────────────────────────────
  // Early returns. All hooks above this line so call order stays stable.
  // ────────────────────────────────────────────────────────────────────

  // Owned dog gated by the owner's lock — render a locked-style empty
  // state. The owner action button is the connection path: the dog's
  // lock derives from the owner's lock, so "meet the owner" is the only
  // way through. Routing to the owner's profile lands on their own
  // locked-profile preview (with its Connect CTA) when relevant — no
  // additional privacy leak vs. what a meet-attendee row already shows.
  if (ownedResolved && !ownedVisible) {
    return (
      <div className="dog-profile-page">
        <DetailHeader backLabel="Back" title={headerTitle} backHref={parentHref} />
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

  // From here on, dog is guaranteed non-undefined (the two early
  // returns above handle the no-dog cases). Re-cast for the render
  // block below so JSX can deref freely.
  const dog = maybeDog as PetProfile;
  const shelter = shelterResolved?.shelter;
  // Viewer-aware: owner sees ALL tagged posts on their own dog; other
  // viewers see only posts that pass the two-gate Content Visibility
  // Model. The previous ungated `getDogPosts` is reserved for the
  // RecentWalkers component (walker activity is public-ish surface).
  const posts = getPostsByDog(dog.id, currentUserId);
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

  // Sibling tab strip — multi-dog owners get a Franta | Bella tabbar
  // below the DetailHeader so visitors can switch between an owner's
  // dogs without going back through the owner profile. Single-dog
  // owners and shelter dogs render no strip (saves vertical space).
  // Suppressed in edit mode (Cancel/Save committed before nav).
  const siblingDogs = !editing && ownedResolved && ownedResolved.owner.pets.length > 1
    ? ownedResolved.owner.pets
    : null;

  // Edit-mode body — owners only. Renders PetEditCard for the single
  // dog as the entire body, skipping hero / sections / posts. Delete
  // (handled inside PetEditCard) navigates back to /profile.
  if (editing && editDraft && isOwnerView) {
    return (
      <div className="dog-profile-page">
        <DetailHeader backLabel="Back" title={headerTitle} backHref={parentHref} rightAction={ownerHeaderAction} />
        <div className="dog-profile-panel">
          <div className="dog-profile-body">
            <PetEditCard
              pet={editDraft}
              onChange={(updated) => setEditDraft(updated)}
              onDelete={() => {
                // PROTOTYPE: real delete is a follow-up. Production
                // version needs (a) a confirmation modal — removing a
                // dog is destructive and irreversible from the
                // owner's POV; (b) actual mutation of the user's pets
                // list via the editable-pets context that's also
                // pending; (c) cleanup of references (post tags,
                // bookings, etc.) — open question for the persistence
                // pass. For now, exit edit and route back to /profile
                // so the owner doesn't sit on a "deleted" dog page.
                setEditing(false);
                router.push("/profile");
              }}
            />
            <Spacer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dog-profile-page">
      <DetailHeader backLabel="Back" title={headerTitle} backHref={parentHref} rightAction={ownerHeaderAction} />
      <div className="dog-profile-panel">
        <div className="dog-profile-body">
          {/* Sibling tab strip — sticks at top of the scrollable body
              so visitors can switch between an owner's dogs without
              scrolling back. Mirrors the shelter / community detail
              tab pattern (`.detail-tabs detail-tabs--fill` wrapper). */}
          {siblingDogs && (
            <div className="detail-tabs detail-tabs--fill">
              <TabBar
                tabs={siblingDogs.map((p) => ({ key: p.id, label: p.name || "New dog" }))}
                activeKey={dog.id}
                onChange={(key) => router.push(`/dogs/${key}`)}
              />
            </div>
          )}
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
                <DogMetaLine dog={dog} />
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

              {/* Walker / Adopt actions — shelter dogs only. Inlined
                  into the hero content column 2026-06-09 (matches the
                  user-profile hero pattern: ButtonAction sm pair as
                  the primary action surface). Replaces the earlier
                  card-style affordance and resolves the
                  double-border issue created by the standalone CTA
                  section. State-aware status line surfaces below the
                  buttons when an application is in progress / not
                  yet eligible / vouched. */}
              {shelter && <WalkAffordance shelter={shelter} dog={dog} />}
            </div>
          </div>

          {/* Shelter-care stats band — facts row, sits between the
              hero and the about/story section so the rhythm is
              hero → CTA → facts → story (CTA inserted 2026-06-09).
              Only renders while the dog is actively in shelter care
              (pre-adopted). Owned dogs hide it entirely. */}
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

          {/* Story section — backstory + policy strip flow together
              with no divider between them (they're both "about who
              this dog is"); stats moved out above so the facts get
              their own banded treatment. Suppresses entirely when
              both are absent. */}
          {(dog.backstory || policyChips.length > 0) && (
            <div className="dog-profile-section">
              {/* Backstory — works for both shelter dogs (shelter-authored)
                  and owned dogs (owner-authored "About {Dog}"). */}
              {dog.backstory && (
                <p className="dog-profile-backstory">{dog.backstory}</p>
              )}

              {/* Handling policy chips — solo-only, experienced handlers
                  only. Operational (about who can walk the dog) — flows
                  directly from the backstory ("she needs a quiet home with
                  no other dogs" → "solo walks only" reads as natural
                  continuation). Shelter dogs only; owned dogs never carry
                  these fields. */}
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

          {/* Highlights + Posts surface — symmetric with the owner
              profile Posts tab. Highlights strip on top, then the
              shared `PostsCollectionView` (filter pills + List ⇄ Grid
              toggle + the rendered set). Pre-2026-06-04 this was split
              into Photos + Posts-about sections; the unification keeps
              the dog page and owner profile reading the same. */}
          <DogPhotosBundle
            dog={dog}
            posts={posts}
            isOwnerView={isOwnerView}
            ownerTagApproval={owner?.tagApproval}
          />

          {/* WalkAffordance relocated up to immediately after the hero
              (see comment block by the hero). The old bottom placement
              left it as the visual "page footer" instead of the primary
              action. */}

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

/**
 * Hero meta line — mirrors `PetSummaryCard`'s order + sex-icon treatment
 * so the dog reads the same way across the owner profile card and the
 * dog profile page hero. Breed · age · sex-icon+letter · weight; each
 * field is optional and only renders when present. 2026-06-04.
 */
function DogMetaLine({ dog }: { dog: PetProfile }) {
  const SexIcon =
    dog.sex === "male" ? GenderMale : dog.sex === "female" ? GenderFemale : null;
  const sexLetter = dog.sex === "male" ? "M" : dog.sex === "female" ? "F" : "";
  const sexAria = dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : "";

  return (
    <span className="dog-profile-meta-row">
      {dog.breed && <span>{dog.breed}</span>}
      {dog.ageLabel && (
        <>
          <span aria-hidden="true">·</span>
          <span>{dog.ageLabel}</span>
        </>
      )}
      {SexIcon && (
        <>
          <span aria-hidden="true">·</span>
          <span className="dog-profile-meta-sex" aria-label={sexAria}>
            <SexIcon size={14} weight="bold" />
            {sexLetter}
          </span>
        </>
      )}
      {dog.weightLabel && (
        <>
          <span aria-hidden="true">·</span>
          <span>{dog.weightLabel}</span>
        </>
      )}
    </span>
  );
}

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
 * Photos bundle (Photos & Galleries phase, 2026-06-04). Composes:
 *
 *  1. **Highlights strip** — owner-curated photo URLs above the grid.
 *  2. **Auto-album grid** — viewer-gated post-tagged photos. Tap → post
 *     modal. Long-press (owner only) → Pin / Hide action sheet.
 *  3. **Edit Highlights modal** — reorder + unpin from a single screen.
 *
 * All three surfaces share `usePhotoAlbumOverrides` so Pin / Hide /
 * reorder all flow through one persisted state per dog.
 *
 * Owner sees ALL tagged posts on their own dog (owner is the dog's
 * authority — Open Q §12). Other viewers see only posts that pass the
 * Content Visibility Model two-gate (already enforced by
 * `getPostsByDog`). Hide-from-album filter is owner-side and only
 * applies for the owner's own view.
 *
 * Empty state: own-dog gets a "Post your first photo" CTA opening the
 * composer with the dog tag picker pre-active. Non-owner viewers with
 * zero visible posts see nothing — the bundle returns null.
 */
function DogPhotosBundle({
  dog,
  posts,
  isOwnerView,
  ownerTagApproval,
}: {
  dog: PetProfile;
  posts: Post[];
  isOwnerView: boolean;
  ownerTagApproval?: TagApproval;
}) {
  const { openComposer } = usePostComposer();
  const overrides = usePhotoAlbumOverrides(dog.id, dog.highlights ?? []);
  const viewerId = useCurrentUserId();
  const untagStore = useUntagStore(viewerId);
  const pendingStore = usePendingTagsStore(viewerId);
  const [editOpen, setEditOpen] = useState(false);

  // Apply owner-side filters (only on owner view — all three filter
  // lists are per-owner per-dog state):
  //   1. Hide-from-album (long-press → "Hide from album")
  //   2. Untag-this-dog (per-post kebab → "Untag {Dog}")
  //   3. Pending-or-rejected approval (when owner.tagApproval === "approve")
  // Any of the three exclude the post from the auto-album surface.
  //
  // Approval rule (2026-06-04 fix): pending stays pending forever until
  // the owner decides. No aging out. Pre-existing dog-tag pairs default
  // to approved (grandfathered) via `usePendingTagsStore` — only the
  // explicit `DEMO_PENDING_TAGS` carve-out flips to pending.
  const approvalMode = ownerTagApproval === "approve";
  const surfacedPosts = isOwnerView
    ? posts.filter((p) => {
        if (overrides.hiddenPostIds.has(p.id)) return false;
        if (untagStore.isUntagged(p.id, dog.id)) return false;
        if (approvalMode) {
          const decision = pendingStore.getDecision(p.id, dog.id);
          if (decision === "pending" || decision === "rejected") return false;
        }
        return true;
      })
    : posts;

  // Non-owner viewers see nothing when there are no visible posts AND
  // no Highlights to show. Owners always see the surface so they can
  // post / edit.
  const hasAnything = surfacedPosts.length > 0 || overrides.highlights.length > 0;
  if (!hasAnything && !isOwnerView) return null;

  const emptyState =
    surfacedPosts.length === 0 ? (
      <div className="dog-profile-section">
        <div className="flex items-center justify-between">
          <h2 className="dog-profile-section-title">Posts</h2>
          {isOwnerView && (
            <PhotosSettingsMenu
              dogName={dog.name}
              hiddenPosts={posts.filter((p) => overrides.hiddenPostIds.has(p.id))}
              highlightsCount={overrides.highlights.length}
              ownerTagApproval={ownerTagApproval}
              onUnhide={overrides.unhidePost}
              onClearHighlights={overrides.clearHighlights}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-md text-center" style={{ padding: "var(--space-lg) 0" }}>
          <Camera size={32} weight="light" className="text-fg-tertiary" />
          <p className="text-sm text-fg-secondary m-0">
            No posts about {dog.name} yet.
          </p>
          {isOwnerView && (
            <ButtonAction
              variant="secondary"
              size="sm"
              onClick={() => openComposer({ initialTagPicker: "dog" })}
              leftIcon={<Camera size={14} weight="light" />}
            >
              Post your first photo
            </ButtonAction>
          )}
        </div>
      </div>
    ) : null;

  return (
    <>
      <HighlightsStrip
        highlights={overrides.highlights}
        subjectLabel={dog.name}
        isOwnerView={isOwnerView}
        onEdit={() => setEditOpen(true)}
      />

      <div className="dog-profile-section">
        <div className="flex items-center justify-between">
          <h2 className="dog-profile-section-title">Posts</h2>
          {isOwnerView && (
            <PhotosSettingsMenu
              dogName={dog.name}
              hiddenPosts={posts.filter((p) => overrides.hiddenPostIds.has(p.id))}
              highlightsCount={overrides.highlights.length}
              ownerTagApproval={ownerTagApproval}
              onUnhide={overrides.unhidePost}
              onClearHighlights={overrides.clearHighlights}
            />
          )}
        </div>
        <PostsCollectionView
          posts={surfacedPosts}
          subjectLabel={dog.name}
          urlBase={`/dogs/${dog.id}`}
          // The Dog filter would always be redundant (the page already
          // scopes to one dog). Suppress its pill.
          excludeFilterTypes={["dog"]}
          listCardVariant="moment"
          emptyState={emptyState}
        />
      </div>

      <EditHighlightsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        subjectLabel={dog.name}
        highlights={overrides.highlights}
        onReorder={overrides.reorderHighlights}
        onUnpin={overrides.unpinHighlight}
      />
    </>
  );
}

/**
 * Walker affordance (J) — eligibility-gated CTA on shelter dog profiles.
 *
 * Three-axis composition per D8:
 *   1. Walker tier (vouched or not, derived from WalkerApplications)
 *   2. Per-shelter policy (ShelterPolicy.groupWalksPermitted —
 *      surfaces in the booking flow, not this gate)
 *   3. Per-dog policy overrides (soloOnly, experiencedHandlersOnly —
 *      gates which tier can walk this specific dog)
 *
 * V1 surfaces: state-aware copy + apply CTA for non-walkers; the
 * actual "Book a walk" booking flow is deferred until shelter-walk
 * Bookings carry the `ownerKind: "shelter"` discriminator end-to-end.
 */
function WalkAffordance({ shelter, dog }: { shelter: ShelterProfile; dog: PetProfile }) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { getApplication, apply } = useWalkerApplications();
  const application = currentUserId ? getApplication(currentUserId, shelter.id) : undefined;
  const state = application?.state;
  const walkCount = application?.walkCount ?? 0;
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);

  // Per-dog eligibility: experiencedHandlersOnly requires tier ≥ experienced.
  const tier = state === "vouched" ? deriveWalkerTier(walkCount) : null;
  const eligibleForDog = (() => {
    if (state !== "vouched") return false;
    if (dog.experiencedHandlersOnly && tier === "vetted") return false;
    return true;
  })();

  // Optional context line below the buttons — surfaces application
  // state when relevant; suppressed entirely for the default case.
  const statusLine = (() => {
    if (state === "applied") return `Application sent — ${shelter.name} will be in touch`;
    if (state === "invited") return `Invited to visit — meet the team at ${shelter.name}`;
    if (state === "vouched" && !eligibleForDog) return `${dog.name} needs an experienced walker (10+ walks)`;
    if (state === "vouched" && eligibleForDog) return `You walk at ${shelter.name} · booking flow ships in follow-up`;
    return null;
  })();

  // Walk button click — state-aware. No application → open the
  // application sheet right here (no shelter-page detour). Applied/
  // invited → no-op (status line below carries the context). Vouched +
  // eligible → would open the booking flow (deferred to follow-up).
  const onWalkClick = () => {
    if (!state) {
      setWalkSheetOpen(true);
      return;
    }
    // For now, applied/invited/vouched states are no-op from this
    // button; status line carries the message. Vouched booking flow
    // lights up when the shelter-walk Booking discriminator wires
    // end-to-end (Mentor Network phase territory).
  };

  // Adopt button click — stub navigation to the shelter for now.
  // The adoption inquiry flow ships in a follow-up phase (likely
  // alongside the Mentor Network adoption-curious doorway).
  const onAdoptClick = () => router.push(`/shelters/${shelter.id}`);

  return (
    <>
      <div className="flex flex-col gap-xs" style={{ marginTop: "var(--space-sm)" }}>
        <div className="flex gap-sm flex-wrap">
          <ButtonAction
            variant="primary"
            size="sm"
            cta
            className="grow basis-[140px]"
            leftIcon={<Footprints size={16} weight="fill" />}
            onClick={onWalkClick}
          >
            Walk {dog.name}
          </ButtonAction>
          <ButtonAction
            variant="outline"
            size="sm"
            cta
            className="grow basis-[140px]"
            leftIcon={<HandHeart size={16} weight="regular" />}
            onClick={onAdoptClick}
          >
            Adopt {dog.name}
          </ButtonAction>
        </div>
        {statusLine && (
          <span className="text-xs text-fg-tertiary">
            {statusLine}
          </span>
        )}
      </div>
      <WalkApplicationSheet
        open={walkSheetOpen}
        shelter={shelter}
        onClose={() => setWalkSheetOpen(false)}
        onConfirm={(message) => {
          if (currentUserId) apply(currentUserId, shelter.id, message);
          setWalkSheetOpen(false);
        }}
      />
    </>
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
