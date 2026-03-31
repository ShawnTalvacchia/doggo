"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";

interface DetailHeaderProps {
  /** Fixed back destination. If omitted, uses router.back() */
  backHref?: string;
  /** Label shown next to back arrow. Defaults to "Back" */
  backLabel?: string;
  /** Page title shown in the centre (optional) */
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

  const backContent = (
    <>
      <CaretLeft size={16} weight="bold" />
      <span>{backLabel}</span>
    </>
  );

  return (
    <div className="page-detail-header">
      {backHref ? (
        <Link href={backHref} className="page-detail-header-back">
          {backContent}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          className="page-detail-header-back"
        >
          {backContent}
        </button>
      )}

      {title && <span className="page-detail-header-title">{title}</span>}

      <div className="page-detail-header-right">
        {rightAction ?? null}
      </div>
    </div>
  );
}
