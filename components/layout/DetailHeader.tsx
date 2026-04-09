"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";

interface DetailHeaderProps {
  /** Fixed back destination. If omitted, uses router.back() */
  backHref?: string;
  /** Label shown next to back arrow. Defaults to "Back" */
  backLabel?: string;
  /** Page title shown next to the back arrow (optional) */
  title?: string;
  /** Optional right-side action element */
  rightAction?: React.ReactNode;
}

export function DetailHeader({
  backHref,
  backLabel = "Back",
  title,
  rightAction,
}: DetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <div className="page-detail-header">
      <div className="page-detail-header-left">
        {backHref ? (
          <Link href={backHref} className="page-detail-header-back">
            <CaretLeft size={16} weight="bold" />
            {!title && <span>{backLabel}</span>}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="page-detail-header-back"
          >
            <CaretLeft size={16} weight="bold" />
            {!title && <span>{backLabel}</span>}
          </button>
        )}
        {title && <span className="page-detail-header-title">{title}</span>}
      </div>

      <div className="page-detail-header-right">
        {rightAction ?? null}
      </div>
    </div>
  );
}
