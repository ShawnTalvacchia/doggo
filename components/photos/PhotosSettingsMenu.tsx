"use client";

import { useState } from "react";
import Link from "next/link";
import { Gear, Eye, Trash, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PhotoGrid } from "./PhotoGrid";
import type { Post, TagApproval } from "@/lib/types";

interface PhotosSettingsMenuProps {
  dogName: string;
  hiddenPosts: Post[];
  highlightsCount: number;
  /** Owner's current tag approval setting — surfaced read-only with a
   *  link to /profile?tab=about to edit. Per-dog override is V2+
   *  (Open Q §12 — settings inherit from owner). */
  ownerTagApproval: TagApproval | undefined;
  onUnhide: (postId: string) => void;
  onClearHighlights: () => void;
}

const APPROVAL_LABELS: Record<TagApproval, string> = {
  auto: "Auto-approve",
  approve: "Review before approving",
  none: "Don't allow",
};

/**
 * Per-dog Photos-tab settings gear (Photos & Galleries D3). Owner-only.
 * Surfaces:
 *
 *  - **Tag approval** — read-only mirror of the owner's
 *    `UserProfile.tagApproval` setting + link to edit on /profile.
 *    Per §12 (2026-06-01), tag approval inherits from owner; per-dog
 *    override is V2+.
 *  - **View hidden photos** — list of posts the owner has hidden via
 *    long-press → "Hide from album". Each row has an "Unhide" action
 *    that returns the post to the auto-album.
 *  - **Clear pinned Highlights** — destructive (with confirm) reset
 *    of the Highlights strip back to empty.
 */
export function PhotosSettingsMenu({
  dogName,
  hiddenPosts,
  highlightsCount,
  ownerTagApproval,
  onUnhide,
  onClearHighlights,
}: PhotosSettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const approvalLabel = ownerTagApproval
    ? APPROVAL_LABELS[ownerTagApproval]
    : APPROVAL_LABELS.auto;

  return (
    <>
      <button
        type="button"
        className="photos-settings-btn"
        onClick={() => setOpen(true)}
        aria-label={`${dogName} Photos settings`}
      >
        <Gear size={16} weight="light" />
      </button>

      <ModalSheet
        open={open}
        onClose={() => setOpen(false)}
        title={`${dogName}'s Photos settings`}
        compact
      >
        <div className="flex flex-col gap-md">
          <section className="flex flex-col gap-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-fg-primary">
                Tag approval
              </span>
              <span className="text-sm text-fg-secondary">{approvalLabel}</span>
            </div>
            <p className="text-xs text-fg-tertiary m-0">
              Inherits from your overall tagging preference.{" "}
              <Link
                href="/profile?tab=about"
                className="text-info-strong"
                style={{ textDecoration: "underline" }}
                onClick={() => setOpen(false)}
              >
                Edit on your profile
              </Link>
              .
            </p>
          </section>

          <button
            type="button"
            className="album-action-row"
            onClick={() => {
              setOpen(false);
              setShowHidden(true);
            }}
            disabled={hiddenPosts.length === 0}
            style={hiddenPosts.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          >
            <Eye size={18} weight="light" />
            <span>
              View hidden photos
              {hiddenPosts.length > 0 && ` (${hiddenPosts.length})`}
            </span>
          </button>

          <button
            type="button"
            className="album-action-row"
            onClick={() => {
              setOpen(false);
              setConfirmClear(true);
            }}
            disabled={highlightsCount === 0}
            style={highlightsCount === 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          >
            <Trash size={18} weight="light" />
            <span>
              Clear pinned Highlights
              {highlightsCount > 0 && ` (${highlightsCount})`}
            </span>
          </button>
        </div>
      </ModalSheet>

      <ModalSheet
        open={showHidden}
        onClose={() => setShowHidden(false)}
        title={`${dogName}'s hidden photos`}
      >
        {hiddenPosts.length === 0 ? (
          <p className="text-sm text-fg-secondary text-center" style={{ padding: "var(--space-xl) 0" }}>
            Nothing hidden.
          </p>
        ) : (
          <>
            <p className="text-xs text-fg-tertiary" style={{ marginBottom: "var(--space-md)" }}>
              Tap a tile's restore icon to return it to the album.
            </p>
            <PhotoGrid
              posts={hiddenPosts}
              subjectLabel={dogName}
              renderTileMenu={(post) => (
                <button
                  type="button"
                  className="photo-grid-tile-overlay-btn"
                  onClick={() => onUnhide(post.id)}
                  aria-label="Restore to album"
                  title="Restore"
                >
                  <ArrowCounterClockwise size={14} weight="bold" />
                </button>
              )}
            />
          </>
        )}
      </ModalSheet>

      <ModalSheet
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear Highlights?"
        compact
        footer={
          <div className="flex justify-end gap-sm">
            <ButtonAction
              variant="outline"
              size="md"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </ButtonAction>
            <ButtonAction
              variant="primary"
              size="md"
              leftIcon={<Check size={14} weight="bold" />}
              onClick={() => {
                onClearHighlights();
                setConfirmClear(false);
              }}
            >
              Clear all
            </ButtonAction>
          </div>
        }
      >
        <p className="text-sm text-fg-secondary">
          This removes all pinned Highlights for {dogName}. The original
          photos in posts remain.
        </p>
      </ModalSheet>
    </>
  );
}
