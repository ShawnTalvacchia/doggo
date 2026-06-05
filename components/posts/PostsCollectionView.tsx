"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GridFour, ListBullets } from "@phosphor-icons/react";
import { FeedCommunityPost } from "@/components/feed/FeedCommunityPost";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { TagFilterPill } from "@/components/profile/TagFilterPill";
import type { Post, PostTagType } from "@/lib/types";

/**
 * "shelter" excluded — the shelter tag type is reserved infrastructure
 * (per shelters.md); composer doesn't surface a shelter picker so few
 * posts carry it and the pill would usually have <2 options.
 */
export type FilterableTagType = Exclude<PostTagType, "shelter">;
export type FilterState = Partial<Record<FilterableTagType, string[]>>;

const ALL_FILTER_TYPES: FilterableTagType[] = [
  "dog",
  "person",
  "place",
  "community",
  "meet",
];

const TAG_TYPE_LABELS: Record<FilterableTagType, string> = {
  dog: "Dog",
  person: "Person",
  place: "Place",
  community: "Community",
  meet: "Meet",
};

interface PostsCollectionViewProps {
  /** The posts to surface — already filtered for visibility by the caller
   *  (use `isPostVisibleTo` + collection-specific scope like `getPostsByDog`
   *  or `getPostsByUser`). */
  posts: Post[];
  /** Subject name used in alt text for grid tiles (dog name or user first
   *  name). */
  subjectLabel: string;
  /** Base URL for filter / view state — `/profile`, `/profile/[id]`,
   *  `/dogs/[id]`. URL state is preserved on filter/view changes. */
  urlBase: string;
  /** Tag types whose filter pill should be hidden — used when a filter
   *  would be redundant (e.g. the dog page already scopes to one dog,
   *  so the Dog pill is suppressed). */
  excludeFilterTypes?: FilterableTagType[];
  /** Rendered above the list/grid when the collection has zero posts
   *  (after viewer-visibility filtering, BEFORE filter pill scoping).
   *  When the collection has posts but a filter narrows them to zero,
   *  a "No posts match this filter" placeholder shows instead. */
  emptyState?: React.ReactNode;
  /** Card variant for list view — `community` includes the in-{group}
   *  header context; `moment` is the plain MomentCard. Defaults to
   *  `community` (the owner-profile shape). */
  listCardVariant?: "community" | "moment";
}

/**
 * Shared posts surface — filter pills + List ⇄ Grid view toggle +
 * list/grid render + empty states.
 *
 * Used by:
 *  - Owner profile Posts tab (`PostsTab`): collection = author's posts.
 *  - Dog profile `/dogs/[id]`: collection = posts tagging this dog.
 *
 * Filter pills + view state persist in the URL (`?view=grid`,
 * `?f_<type>=<id,id,...>`). The caller is responsible for the visibility
 * gate on `posts`; this component handles only the filter/view UI on
 * top of the already-visible set.
 *
 * Photos & Galleries phase, 2026-06-04 (unification of the
 * owner-profile and dog-profile patterns).
 */
export function PostsCollectionView({
  posts,
  subjectLabel,
  urlBase,
  excludeFilterTypes = [],
  emptyState,
  listCardVariant = "community",
}: PostsCollectionViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGrid = searchParams.get("view") === "grid";

  const filterTypes = useMemo(
    () => ALL_FILTER_TYPES.filter((t) => !excludeFilterTypes.includes(t)),
    [excludeFilterTypes],
  );

  const filterState: FilterState = useMemo(() => {
    const out: FilterState = {};
    for (const type of filterTypes) {
      const v = searchParams.get(`f_${type}`);
      if (v) out[type] = v.split(",").filter(Boolean);
    }
    return out;
  }, [searchParams, filterTypes]);

  // Per-type option lists, derived from the (already-visible) post set.
  const optionsByType: Record<FilterableTagType, { id: string; label: string }[]> = useMemo(() => {
    const acc: Record<FilterableTagType, Map<string, string>> = {
      dog: new Map(),
      person: new Map(),
      place: new Map(),
      community: new Map(),
      meet: new Map(),
    };
    for (const post of posts) {
      for (const tag of post.tags) {
        if (tag.type === "shelter") continue;
        const map = acc[tag.type as FilterableTagType];
        if (map && !map.has(tag.id)) map.set(tag.id, tag.label);
      }
    }
    const out = {} as Record<FilterableTagType, { id: string; label: string }[]>;
    for (const type of ALL_FILTER_TYPES) {
      out[type] = [...acc[type].entries()]
        .map(([id, label]) => ({ id, label }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return out;
  }, [posts]);

  // Apply active filters: across types AND, within type OR.
  const filteredPosts = useMemo(() => {
    const activeEntries = (Object.entries(filterState) as [FilterableTagType, string[]][])
      .filter(([, ids]) => ids.length > 0);
    if (activeEntries.length === 0) return posts;
    return posts.filter((post) =>
      activeEntries.every(([type, ids]) =>
        post.tags.some((t) => t.type === type && ids.includes(t.id)),
      ),
    );
  }, [posts, filterState]);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${urlBase}?${qs}` : urlBase, { scroll: false });
    },
    [searchParams, router, urlBase],
  );

  const setView = (next: "list" | "grid") =>
    setParam("view", next === "grid" ? "grid" : null);
  const setTagFilter = (type: FilterableTagType, ids: string[]) =>
    setParam(`f_${type}`, ids.length === 0 ? null : ids.join(","));

  if (posts.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  const hasAnyFilterableType = filterTypes.some((t) => optionsByType[t].length > 0);

  return (
    <div className="posts-collection-view">
      <div className="posts-tab-controls">
        {hasAnyFilterableType && (
          <div className="posts-tab-filter-pills">
            {filterTypes.map((type) => (
              <TagFilterPill
                key={type}
                label={TAG_TYPE_LABELS[type]}
                options={optionsByType[type]}
                selectedIds={filterState[type] ?? []}
                onChange={(next) => setTagFilter(type, next)}
              />
            ))}
          </div>
        )}
        <div className="posts-tab-view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`posts-tab-view-btn ${!isGrid ? "is-active" : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={!isGrid}
          >
            <ListBullets size={16} weight="light" />
          </button>
          <button
            type="button"
            className={`posts-tab-view-btn ${isGrid ? "is-active" : ""}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={isGrid}
          >
            <GridFour size={16} weight="light" />
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-fg-secondary text-center" style={{ padding: "var(--space-xl)" }}>
          No posts match this filter.
        </p>
      ) : isGrid ? (
        <PhotoGrid posts={filteredPosts} subjectLabel={subjectLabel} />
      ) : (
        <div className="flex flex-col">
          {filteredPosts.map((post) =>
            listCardVariant === "moment" ? (
              <MomentCardFromPost key={post.id} post={post} />
            ) : (
              <FeedCommunityPost key={post.id} post={post} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
