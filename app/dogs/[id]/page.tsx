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
  CameraPlus,
  GenderMale,
  GenderFemale,
  Footprints,
  HandHeart,
  CaretDown,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { PostsCollectionView, PostsViewToggle } from "@/components/posts/PostsCollectionView";
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
import {
  useWalkerApplications,
  deriveWalkerTier,
  tierOverrideKey,
} from "@/contexts/WalkerApplicationsContext";
import { useBookings } from "@/contexts/BookingsContext";
import { WalkApplicationSheet } from "@/components/shelters/WalkApplicationSheet";
import { WalkEntrySheet } from "@/components/shelters/WalkEntrySheet";
import { WalkBookingSheet } from "@/components/shelters/WalkBookingSheet";
import { AdoptInquirySheet } from "@/components/shelters/AdoptInquirySheet";
import { useAdoptionStore } from "@/lib/useAdoptionStore";
import { MentorSessionBookingSheet } from "@/components/shelters/MentorSessionBookingSheet";
import { MentorListSheet } from "@/components/shelters/MentorListSheet";
import { useMentorSessionCompletion } from "@/components/shelters/useMentorSessionCompletion";
import {
  countCompletedShelterWalks,
  getMentorsForShelter,
  getMentorshipHistory,
  getPlatformVolunteerTier,
} from "@/lib/volunteerTier";
import { getMentorGroupWalks } from "@/lib/mockMeets";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import {
  VACCINATION_LABELS,
  deriveAutoTags,
  derivePolicyChips,
  formatVaccinationDate,
  sortVaccinations,
} from "@/lib/petUtils";
import { PERSONALITY_TAG_LABELS } from "@/lib/constants/dogs";
import type {
  CarerMentorSessionServiceConfig,
  PetProfile,
  Post,
  PostTag,
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
  // Adoption capstone (Workstream E): demo override of adoption stage, read
  // here so the hero pill + celebration + care-stats reflect a demo-advanced
  // pending/adopted without seed edits. getStage is a stable callback —
  // called below once `dog` resolves (this hook must precede early returns).
  const { getStage: getAdoptionStage } = useAdoptionStore();

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
  // Effective adoption status folds the demo override on top of the seed.
  const adoptionEntry = getAdoptionStage(dog.id);
  const effectiveAdoptionStatus =
    adoptionEntry?.stage === "adopted"
      ? "adopted"
      : adoptionEntry?.stage === "pending"
        ? "pending"
        : dog.adoptionStatus;
  const isAdopted = effectiveAdoptionStatus === "adopted";
  const showCareStats = !!shelter && !isAdopted;
  // Tag taxonomy (FC8 formalization, 2026-06-02): auto-derived chips
  // (Adoption pending / New arrival / Long-stayer / energy) come from
  // `deriveAutoTags`; personality tags come from the typed
  // `PersonalityTag` vocabulary; policy chips render separately because
  // they gate handler eligibility, not disposition.
  // Once adopted, the shelter-context chips (Long-stayer / New arrival /
  // Adoption pending) no longer apply — they're derived from kennel data that
  // stops being meaningful at home. Keep only the enduring energy chip. The
  // "Adopted" status pill sits by the name instead.
  const autoTags = deriveAutoTags(dog, new Date()).filter(
    // Drop the "Adoption pending" auto-chip here — the hero status pill is the
    // single source for that state on the dog page (avoids the duplicate).
    // Once adopted, the other shelter-context chips no longer apply either;
    // keep only the enduring energy chip.
    (t) => t.kind !== "adoption-pending" && (!isAdopted || t.kind === "energy"),
  );
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
          {/* Adoption capstone: "Happy endings" celebration when the dog has
              been adopted (DR7 — celebration + archived state; the literal
              PetProfile → new-owner migration stays deferred). */}
          {shelter && isAdopted && (
            <div className="flex flex-col gap-xs rounded-panel border border-edge-regular bg-surface-top p-md mb-md">
              <p className="text-base font-semibold text-fg-primary m-0">
                {dog.name} found a home 🎉
              </p>
              <p className="text-sm text-fg-secondary m-0">
                After {dog.daysInKennel ?? "many"} days waiting, {dog.name} has
                been adopted
                {adoptionEntry?.adopterName ? ` by ${adoptionEntry.adopterName}` : ""}.
                Thank you to everyone who walked her and shared her story — this
                is what it's all for. The walkers who knew her keep her in their
                gallery.
              </p>
            </div>
          )}

          {/* Advocacy loop: post-walk "Share a moment" prompt (shelter dogs
              only; renders when arriving via ?finished=1 from a finished
              shelter walk). Suppressed once adopted. */}
          {shelter && !isAdopted && <WalkFinishedBanner dog={dog} shelter={shelter} />}
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
                {effectiveAdoptionStatus === "pending" && (
                  <span className="dog-profile-status-pill dog-profile-status-pill--pending">
                    Adoption pending
                  </span>
                )}
                {effectiveAdoptionStatus === "adopted" && (
                  <span className="dog-profile-status-pill dog-profile-status-pill--adopted">
                    Adopted
                  </span>
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
            exerciseNeeds={dog.exerciseNeeds}
            isShelterDog={!!shelter}
          />

          {/* Health & vaccinations (Vaccines V1, 2026-06-02). Owner /
              shelter self-declared; verification belongs to V2 (Open
              Q §15 + §16). Acknowledger label = shelter name (shelter
              dogs) or owner first name (owned dogs). */}
          <DogHealthSection
            vet={dog.vetInfo}
            acknowledgerLabel={acknowledgerLabel}
            microchipNumber={dog.microchipNumber}
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
  exerciseNeeds,
  isShelterDog = false,
}: {
  dogName: string;
  preferences: PetProfile["preferences"];
  exerciseNeeds?: string;
  /** Shelter-managed dogs show a neutral "No care notes yet." instead of
   *  hiding the section (owned dogs hide). Copy stays neutral because every
   *  viewer sees it — the staff-facing "add notes" prompt belongs in the
   *  operator view (FC16), not the public page. Workstream D3 / Q5c. */
  isShelterDog?: boolean;
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
  const hasExercise = !!exerciseNeeds?.trim();

  // Owned dogs hide when empty; shelter dogs show a prompt to fill it in.
  if (nonEmpty.length === 0 && !hasExercise) {
    if (!isShelterDog) return null;
    return (
      <div className="dog-profile-section">
        <h2 className="dog-profile-section-title">
          How {dogName} likes to be cared for
        </h2>
        <p className="text-sm text-fg-tertiary">No care notes yet.</p>
      </div>
    );
  }

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
        {/* Exercise needs — the prescription, alongside the care prefs
            (Workstream D2). Distinct from energyLevel (the level). */}
        {hasExercise && (
          <Fragment key="exercise">
            <span className="dog-profile-prefs-label">Exercise</span>
            <span className="dog-profile-prefs-items">{exerciseNeeds}</span>
          </Fragment>
        )}
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
  microchipNumber,
}: {
  vet: VetInfo | undefined;
  acknowledgerLabel: string;
  /** Quiet identity line under Health (Workstream D1). */
  microchipNumber?: string;
}) {
  const records = vet?.vaccinations ?? [];
  const hasAnyHealthData =
    (!!vet && (records.length > 0 || vet.spayedNeutered || !!vet.conditions)) ||
    !!microchipNumber;

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
      {/* Spayed / neutered + conditions — surface existing health data that
          previously only rendered on the owner-profile PetCard, not here
          (Workstream D3, "surface what exists"). */}
      {vet?.spayedNeutered && (
        <p className="flex items-center gap-tiny text-sm text-fg-secondary mt-xs">
          <ShieldCheck size={13} weight="fill" className="text-brand-main" />
          Spayed / neutered
        </p>
      )}
      {vet?.conditions && (
        <p className="text-sm text-fg-secondary mt-xs">{vet.conditions}</p>
      )}
      {/* Microchip — quiet identity line under Health (Workstream D1). */}
      {microchipNumber && (
        <p className="text-xs text-fg-tertiary mt-xs">
          Microchip · {microchipNumber}
        </p>
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
          <div className="flex items-center gap-xs">
            {surfacedPosts.length > 0 && (
              <PostsViewToggle urlBase={`/dogs/${dog.id}`} />
            )}
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
          <div className="flex items-center gap-xs">
            {surfacedPosts.length > 0 && (
              <PostsViewToggle urlBase={`/dogs/${dog.id}`} />
            )}
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
 * Cross-Shelter Mentor Network G (2026-06-10) made "Walk {dog}" real for
 * vouched walkers: it opens the WalkBookingSheet and the walk lands as
 * an `ownerKind: "shelter"` Booking. P77 both halves fixed here: `Leave
 * shelter` dropped (relationship-level action — lives on the shelter
 * page), and the silent `Log walk (demo)` no-op replaced by the booking
 * flow (the demo toggle remains on the shelter action row for
 * walkthrough speed). Mentor-path applications get "Complete mentor
 * session (demo)" instead of the shelter-intake "Advance state".
 */
/**
 * The advocacy loop's first-class "Share a moment" prompt (Adoption-Curious
 * Journey, 2026-06-12). Finishing a shelter walk routes here with `?finished=1`;
 * this celebration banner invites the walker to share a photo + a few words.
 * The walk recap IS the adoption ad — community exposure is the proven engine
 * (~5×/14× lift), not the walker adopting (see Competitive Research —
 * Adoption-Curious Journeys). Opening the composer pre-tags the dog + shelter
 * so the recap routes into the shelter feed and the network. No pressure: a
 * quiet "Maybe later" dismisses; sharing is encouraged, never required.
 */
function WalkFinishedBanner({ dog, shelter }: { dog: PetProfile; shelter: ShelterProfile }) {
  const searchParams = useSearchParams();
  const { openComposer } = usePostComposer();
  const [dismissed, setDismissed] = useState(false);

  if (searchParams.get("finished") !== "1" || dismissed) return null;

  const tags: PostTag[] = [
    { type: "dog", id: dog.id, label: dog.name },
    { type: "shelter", id: shelter.id, label: shelter.name },
  ];

  return (
    <div className="flex flex-col gap-sm rounded-panel border border-edge-regular bg-surface-top p-md mb-md">
      <p className="text-base font-semibold text-fg-primary m-0">
        Great walk with {dog.name}! 🎉
      </p>
      <p className="text-sm text-fg-secondary m-0">
        Share a moment from today — a photo and a few words is how {dog.name}{" "}
        finds a home. Your walk story reaches people who might be looking for
        exactly this dog.
      </p>
      <div className="flex items-center gap-sm">
        <ButtonAction
          variant="primary"
          size="sm"
          leftIcon={<CameraPlus size={16} weight="bold" />}
          onClick={() => openComposer({ initialTags: tags })}
        >
          Share a moment
        </ButtonAction>
        <ButtonAction variant="tertiary" size="sm" onClick={() => setDismissed(true)}>
          Maybe later
        </ButtonAction>
      </div>
    </div>
  );
}

function WalkAffordance({ shelter, dog }: { shelter: ShelterProfile; dog: PetProfile }) {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { applications, getApplication, apply, advance, withdraw, tierOverrides } =
    useWalkerApplications();
  const { bookings } = useBookings();
  const completeMentorSessionHere = useMentorSessionCompletion(shelter);
  const application = currentUserId ? getApplication(currentUserId, shelter.id) : undefined;
  // Static-roster fallback (coherence fix, 2026-06-10): seeded walkers
  // (Klára at Útulek) have no WalkerApplication record but ARE vouched —
  // treat a static roster entry as the vouched state so they can book
  // walks like any dynamic walker.
  const staticEntry = currentUserId
    ? shelter.walkers.find((w) => w.userId === currentUserId)
    : undefined;
  const state = application?.state ?? (staticEntry ? "vouched" : undefined);
  const inMentorship = !!application?.mentorship && state !== "vouched";
  // Walk count combines the seeded roster count OR the demo toggle +
  // shelter credits, plus completed shelter-walk Bookings (real walks
  // feed tier escalation, G3).
  const walkCount =
    (application?.walkCount ?? staticEntry?.walkCount ?? 0) +
    (currentUserId ? countCompletedShelterWalks(currentUserId, shelter.id, bookings) : 0);
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);
  const [walkEntryOpen, setWalkEntryOpen] = useState(false);
  const [walkBookingOpen, setWalkBookingOpen] = useState(false);
  const [adoptOpen, setAdoptOpen] = useState(false);
  const [walkMenuOpen, setWalkMenuOpen] = useState(false);
  const { getStage: getAdoptionStage } = useAdoptionStore();
  const adoptionStage = getAdoptionStage(dog.id)?.stage;
  // Effective status folds the demo override on top of the seed (mirrors the
  // page-level resolver) so a seed-pending dog like Káťa pauses correctly
  // even with no demo toggle in play.
  const effectiveStatus =
    adoptionStage === "adopted"
      ? "adopted"
      : adoptionStage === "pending"
        ? "pending"
        : dog.adoptionStatus;
  const [mentorListOpen, setMentorListOpen] = useState(false);
  const [mentorSheetTarget, setMentorSheetTarget] = useState<
    { mentor: UserProfile; service: CarerMentorSessionServiceConfig } | null
  >(null);
  const wt = useWalkthrough();

  // Adopted dogs have gone home — no walk/adopt actions apply. The hero
  // "Adopted" pill + the "Happy endings" celebration banner carry the state.
  if (effectiveStatus === "adopted") return null;

  // Adoption pending — the dog is spoken for, so new walks AND adoption
  // inquiries pause while the match settles. The violet hero pill carries the
  // state; this quiet line explains why the action buttons are gone (and keeps
  // the hero from reading as broken/empty).
  if (effectiveStatus === "pending") {
    return (
      <p
        className="text-sm text-fg-secondary m-0"
        style={{ marginTop: "var(--space-sm)" }}
      >
        Adoption in progress — {dog.name} is getting to know their family-to-be.
      </p>
    );
  }

  // Mentor-path door (B2; list-first since 2026-06-11): when the shelter
  // accepts mentor vouching and mentors serve it, not-yet-vouched viewers
  // get the mentored way in — via the neutral mentor LIST, never a named
  // mentor (framing principle). Self excluded.
  const mentors = getMentorsForShelter(shelter.id, applications, tierOverrides).filter(
    (m) => m.mentor.id !== currentUserId,
  );
  const minimum = shelter.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;

  // Per-dog eligibility: experiencedHandlersOnly requires tier ≥
  // experienced. Tier = the shelter's explicit promote/demote call when
  // one exists (O4), else seeded static tier, else walk-count derivation.
  const override = currentUserId
    ? tierOverrides[tierOverrideKey(shelter.id, currentUserId)]
    : undefined;
  const tier =
    state === "vouched"
      ? override ?? staticEntry?.tier ?? deriveWalkerTier(walkCount)
      : null;
  const eligibleForDog = (() => {
    if (state !== "vouched") return false;
    if (dog.experiencedHandlersOnly && tier === "vetted") return false;
    return true;
  })();

  // Optional context line below the buttons — surfaces application
  // state when relevant; suppressed entirely for the default case.
  const statusLine = (() => {
    if (inMentorship && shelter.policy.acceptsMentorVouches)
      return `${application!.mentorship!.sessionsCompleted} of ${minimum} mentor sessions — keep going to walk solo`;
    if (state === "applied") return `Application sent — ${shelter.name} will be in touch`;
    if (state === "invited") return `Invited to visit — meet the team at ${shelter.name}`;
    if (state === "vouched" && !eligibleForDog) return `${dog.name} needs an experienced walker (10+ walks)`;
    if (state === "vouched" && eligibleForDog) return `You walk at ${shelter.name}`;
    return null;
  })();

  // Walk button click — state-aware single entry (2026-06-11). No
  // application → the routing sheet (mentor path or direct apply), so
  // there's never a competing CTA. Vouched + eligible → the REAL action:
  // book the walk (no paragraph). Anything else with an application →
  // the demo affordance dropdown.
  const onWalkClick = () => {
    if (!state) {
      setWalkEntryOpen(true);
      return;
    }
    if (state === "vouched" && eligibleForDog) {
      setWalkBookingOpen(true);
      return;
    }
    setWalkMenuOpen((v) => !v);
  };

  const onAdoptClick = () => setAdoptOpen(true);
  const showMenuCaret = !!state && !(state === "vouched" && eligibleForDog);

  return (
    <>
      <div className="flex flex-col gap-xs" style={{ marginTop: "var(--space-sm)" }}>
        <div className="grid grid-cols-2 gap-sm">
          <div className="dropdown-menu-wrap walk-affordance-menu-wrap min-w-0">
            <ButtonAction
              // Volunteer action → violet (2026-06-11).
              variant="volunteer"
              size="sm"
              cta
              className="w-full"
              leftIcon={<Footprints size={16} weight="fill" />}
              rightIcon={showMenuCaret ? <CaretDown size={12} weight="bold" /> : undefined}
              onClick={onWalkClick}
              disabled={state === "vouched" && !eligibleForDog}
            >
              Walk {dog.name}
            </ButtonAction>
            {walkMenuOpen && state && (
              <div className="dropdown-menu" role="menu">
                {inMentorship && (
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      completeMentorSessionHere();
                      setWalkMenuOpen(false);
                    }}
                  >
                    <Check size={16} weight="light" />
                    Complete mentor session (demo)
                  </button>
                )}
                {!inMentorship && state !== "vouched" && (
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      if (currentUserId) advance(currentUserId, shelter.id);
                      setWalkMenuOpen(false);
                    }}
                  >
                    <Check size={16} weight="light" />
                    Advance state (demo)
                  </button>
                )}
                {state !== "vouched" && (
                  <button
                    type="button"
                    className="dropdown-menu-item dropdown-menu-item--destructive"
                    onClick={() => {
                      if (currentUserId) withdraw(currentUserId, shelter.id);
                      setWalkMenuOpen(false);
                    }}
                  >
                    <X size={16} weight="light" />
                    Withdraw application
                  </button>
                )}
              </div>
            )}
          </div>
          <ButtonAction
            variant="outline"
            size="sm"
            cta
            className="w-full min-w-0"
            leftIcon={<HandHeart size={16} weight="regular" />}
            onClick={onAdoptClick}
          >
            {adoptionStage === "pending"
              ? "Adoption pending"
              : adoptionStage === "interested"
                ? "Interest sent"
                : `Adopt ${dog.name}`}
          </ButtonAction>
        </div>
        {statusLine && (
          <span className="text-xs text-fg-tertiary">
            {statusLine}
          </span>
        )}
      </div>
      {/* Single smart entry: tapping "Walk {dog}" when not verified opens
          the routing sheet (mentor path or direct apply), anchored to
          this dog as motivation. Replaces the old competing upsell link
          + bare application sheet (2026-06-11). */}
      <WalkEntrySheet
        open={walkEntryOpen}
        shelter={shelter}
        dogName={dog.name}
        onClose={() => setWalkEntryOpen(false)}
        showMentorOption={mentors.length > 0 && shelter.policy.acceptsMentorVouches}
        fromPrice={mentors.length > 0 ? Math.min(...mentors.map((m) => m.service.pricePerSession)) : undefined}
        onChooseMentor={() => {
          setWalkEntryOpen(false);
          setMentorListOpen(true);
        }}
        onChooseApply={() => {
          setWalkEntryOpen(false);
          setWalkSheetOpen(true);
        }}
      />
      <WalkApplicationSheet
        open={walkSheetOpen}
        shelter={shelter}
        onClose={() => setWalkSheetOpen(false)}
        onConfirm={(message) => {
          if (currentUserId) apply(currentUserId, shelter.id, message);
          setWalkSheetOpen(false);
        }}
        mentorshipHistory={
          currentUserId ? getMentorshipHistory(currentUserId, applications) : undefined
        }
        isSuperVolunteer={
          currentUserId
            ? getPlatformVolunteerTier(currentUserId, applications, bookings, tierOverrides)
                .isSuperVolunteer
            : false
        }
      />
      <WalkBookingSheet
        open={walkBookingOpen}
        onClose={() => setWalkBookingOpen(false)}
        shelter={shelter}
        dog={dog}
      />
      <AdoptInquirySheet
        open={adoptOpen}
        onClose={() => setAdoptOpen(false)}
        shelter={shelter}
        dog={dog}
      />
      <MentorListSheet
        open={mentorListOpen}
        onClose={() => setMentorListOpen(false)}
        shelter={shelter}
        mentors={mentors}
        dogName={dog.name}
        onPick={(entry) => {
          setMentorListOpen(false);
          setMentorSheetTarget(entry);
          // Auto-advance the walkthrough's "pick a mentor" step — but only for a
          // mentor who runs a group walk, so Beat 2's group-walk flow is coherent.
          // No-op outside the walkthrough / off that step.
          if (getMentorGroupWalks(entry.mentor.id, shelter.id).length > 0) {
            wt.signalAction("pick-mentor");
          }
        }}
      />
      {mentorSheetTarget && (
        <MentorSessionBookingSheet
          open
          onClose={() => setMentorSheetTarget(null)}
          mentor={{
            id: mentorSheetTarget.mentor.id,
            name: `${mentorSheetTarget.mentor.firstName} ${mentorSheetTarget.mentor.lastName}`.trim(),
            avatarUrl: mentorSheetTarget.mentor.avatarUrl ?? "",
          }}
          service={mentorSheetTarget.service}
          defaultShelterId={shelter.id}
          lockShelter
          dog={dog}
        />
      )}
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
