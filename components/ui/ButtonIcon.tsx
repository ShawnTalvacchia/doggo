import Link from "next/link";

type ButtonIconProps = {
  label: string;
  children: React.ReactNode;
  showBadge?: boolean;
  badgeCount?: number;
  onClick?: () => void;
  href?: string;
};

export function ButtonIcon({ label, children, showBadge, badgeCount, onClick, href }: ButtonIconProps) {
  const inner = (
    <>
      <span className="button-icon-glyph">{children}</span>
      {showBadge ? (
        <span className="button-icon-badge">
          {badgeCount != null && badgeCount > 0 ? (badgeCount > 9 ? "9+" : badgeCount) : ""}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="button-icon" aria-label={label}>
        {inner}
      </Link>
    );
  }

  return (
    <button className="button-icon" aria-label={label} type="button" onClick={onClick}>
      {inner}
    </button>
  );
}
