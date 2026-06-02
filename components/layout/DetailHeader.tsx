"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";

interface DetailHeaderProps {
  /** Fixed back destination. Preferred over `onBack` and `router.back()`.
   *  Pages should set this to the up-a-level route (back-as-hierarchy);
   *  detail pages always sit under a parent surface, so back should walk
   *  the tree, not the navigation history. */
  backHref?: string;
  /** Custom back handler. Used when the parent route is conditional
   *  (e.g. tour mode wants to step backward, not jump up a level).
   *  Takes precedence over the default `router.back()` fallback when
   *  `backHref` isn't set. */
  onBack?: () => void;
  /** Label shown next to back arrow. Defaults to "Back" */
  backLabel?: string;
  /** Page title shown next to the back arrow (optional) */
  title?: string;
  /** Optional right-side action element */
  rightAction?: React.ReactNode;
  /** Optional avatar/icon rendered between the back caret and the title.
   *  Used on profile pages to show the subject's avatar inline with their name. */
  leadingAvatar?: React.ReactNode;
}

export function DetailHeader({
  backHref,
  onBack,
  backLabel = "Back",
  title,
  rightAction,
  leadingAvatar,
}: DetailHeaderProps) {
  const router = useRouter();

  // router.back() is the last-resort fallback. Prefer `backHref` (up
  // the tree) or `onBack` (custom hierarchy logic) on every page.
  const handleBack = onBack ?? (() => router.back());

  // Arrow + (optional avatar) + label/title are all one click target
  const backContent = (
    <>
      <CaretLeft size={16} weight="bold" />
      {leadingAvatar && (
        <span className="page-detail-header-avatar">{leadingAvatar}</span>
      )}
      {title ? (
        <span className="page-detail-header-title">{title}</span>
      ) : (
        <span>{backLabel}</span>
      )}
    </>
  );

  return (
    <div className="page-detail-header">
      <div className="page-detail-header-left">
        {backHref ? (
          <Link href={backHref} className="page-detail-header-back">
            {backContent}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="page-detail-header-back"
          >
            {backContent}
          </button>
        )}
      </div>

      <div className="page-detail-header-right">
        {rightAction ?? null}
      </div>
    </div>
  );
}
