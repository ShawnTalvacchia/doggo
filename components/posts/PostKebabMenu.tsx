"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DotsThree,
  TagSimple,
  Flag,
  Prohibit,
  Star,
  EyeSlash,
  Eye,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUntagStore } from "@/lib/useUntagStore";
import { usePhotoAlbumOverrides } from "@/lib/usePhotoAlbumOverrides";
import { getDogById } from "@/lib/mockUsers";
import { useStubNotice } from "@/contexts/StubFeatureContext";
import type { Post } from "@/lib/types";

interface PostKebabMenuProps {
  post: Post;
}

/**
 * Three-dot menu on every post — the unified per-post action surface
 * (Photos & Galleries D1; expanded + consolidated 2026-06-04). Long-
 * press affordance retired in the same pass.
 *
 * Renders as a **floating popover** (`.dropdown-menu` pattern, same
 * one used by Follow / RSVP / Sort menus). Anchored to the kebab
 * button top-right of each post card; positioned right-aligned so it
 * doesn't overflow the viewport. Click-outside to close. 2026-06-04
 * refactor — previously a ModalSheet.
 *
 * **Context-aware Highlights destination.** "Pin to Highlights" routes
 * to ONE destination based on the surface where the menu is opened:
 *   - On `/dogs/[id]` for a dog the viewer owns → that dog's Highlights.
 *   - Anywhere else (feed, owner profile, etc.) → viewer's own Highlights.
 *
 * Items adapt to viewer × post × surface:
 *
 * **Own post:**
 *   - Pin / Unpin to Highlights (1 row, context-aware destination) — REAL
 *   - Hide / Show in album (1 row, only when on a dog-page context) — REAL
 *   - Edit post — STUB (toast via StubFeatureContext, FC13)
 *   - Delete post — STUB (same)
 *
 * **Other-user post:**
 *   - Untag {Dog} (one row per owned dog the post tags) — REAL
 *   - Report — STUB
 *   - Block {Author} — STUB
 */
export function PostKebabMenu({ post }: PostKebabMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewer = useCurrentUser();
  const untagStore = useUntagStore(viewer.id);
  const pathname = usePathname();
  const stub = useStubNotice();

  // Click-outside to close. Mousedown rather than click so the menu
  // closes before the underlying element receives the press.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isAuthor = post.authorId === viewer.id;
  const firstPhoto = post.photos[0];

  // Surface context → Highlights/Hide destination.
  const dogContext = useDogContext(pathname, viewer);

  const highlightsSubjectId = dogContext?.id ?? viewer.id;
  const highlightsSubjectLabel = dogContext ? `${dogContext.name}'s` : "your";
  const seededHighlights = dogContext
    ? (viewer.pets?.find((p) => p.id === dogContext.id)?.highlights ?? [])
    : (viewer.highlights ?? []);
  const overrides = usePhotoAlbumOverrides(highlightsSubjectId, seededHighlights);

  const isPinned = firstPhoto ? overrides.pinnedUrls.has(firstPhoto) : false;
  const isHidden = dogContext ? overrides.hiddenPostIds.has(post.id) : false;

  // Non-author actions
  const ownedDogIds = new Set((viewer.pets ?? []).map((p) => p.id));
  const untaggableDogs = post.tags
    .filter((t) => t.type === "dog" && ownedDogIds.has(t.id))
    .filter((t) => !untagStore.isUntagged(post.id, t.id));

  const close = () => setOpen(false);

  const togglePin = () => {
    if (!firstPhoto) return;
    if (isPinned) overrides.unpinHighlight(firstPhoto);
    else overrides.pinHighlight(firstPhoto);
    close();
  };

  const toggleHide = () => {
    if (!dogContext) return;
    if (isHidden) overrides.unhidePost(post.id);
    else overrides.hidePost(post.id);
    close();
  };

  const stubAction = (feature: string, note?: string) => () => {
    close();
    stub.notify({ feature, note });
  };

  return (
    <div ref={wrapRef} className="post-kebab-wrap dropdown-menu-wrap">
      <button
        type="button"
        className="post-kebab-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Post options"
      >
        <DotsThree size={18} weight="bold" />
      </button>

      {open && (
        <div className="dropdown-menu post-kebab-menu" role="menu">
          {isAuthor ? (
            <>
              {firstPhoto && (
                <button
                  type="button"
                  role="menuitem"
                  className="dropdown-menu-item"
                  onClick={togglePin}
                >
                  <Star size={16} weight={isPinned ? "fill" : "light"} />
                  <span>
                    {isPinned ? "Unpin from " : "Pin to "}
                    {highlightsSubjectLabel} Highlights
                  </span>
                </button>
              )}
              {dogContext && (
                <button
                  type="button"
                  role="menuitem"
                  className="dropdown-menu-item"
                  onClick={toggleHide}
                >
                  {isHidden ? (
                    <Eye size={16} weight="light" />
                  ) : (
                    <EyeSlash size={16} weight="light" />
                  )}
                  <span>
                    {isHidden ? "Show in " : "Hide from "}
                    {dogContext.name}'s album
                  </span>
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                className="dropdown-menu-item"
                onClick={stubAction(
                  "Edit post",
                  "We'll wire this up when the editable-post store lands (see Future Considerations FC13).",
                )}
              >
                <PencilSimple size={16} weight="light" />
                <span>Edit post</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className="dropdown-menu-item dropdown-menu-item--destructive"
                onClick={stubAction(
                  "Delete post",
                  "Wires up alongside the editable-post store (FC13).",
                )}
              >
                <Trash size={16} weight="light" />
                <span>Delete post</span>
              </button>
            </>
          ) : (
            <>
              {untaggableDogs.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  role="menuitem"
                  className="dropdown-menu-item"
                  onClick={() => {
                    untagStore.untagDog(post.id, tag.id);
                    close();
                  }}
                >
                  <TagSimple size={16} weight="light" />
                  <span>Untag {tag.label}</span>
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                className="dropdown-menu-item"
                onClick={stubAction(
                  "Report",
                  "Wires up when the moderation backend lands.",
                )}
              >
                <Flag size={16} weight="light" />
                <span>Report</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className="dropdown-menu-item dropdown-menu-item--destructive"
                onClick={stubAction(
                  `Block ${post.authorName}`,
                  "Wires up alongside the moderation backend.",
                )}
              >
                <Prohibit size={16} weight="light" />
                <span>Block {post.authorName}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function useDogContext(
  pathname: string | null,
  viewer: ReturnType<typeof useCurrentUser>,
): { id: string; name: string } | null {
  if (!pathname) return null;
  const match = pathname.match(/^\/dogs\/([^/?#]+)/);
  if (!match) return null;
  const dogId = match[1];
  const ownedIds = new Set((viewer.pets ?? []).map((p) => p.id));
  if (!ownedIds.has(dogId)) return null;
  const dog = getDogById(dogId);
  if (!dog) return null;
  return { id: dog.id, name: dog.name };
}
