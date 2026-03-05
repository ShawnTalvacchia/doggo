import Link from "next/link";

/** Variants when CTA is false (full set) */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "disabled"
  | "destructive";

/** Variants when CTA is true (subset) */
export type CTAButtonVariant = "primary" | "secondary" | "tertiary" | "disabled";

type ButtonActionProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Variant: primary | secondary | tertiary | outline | disabled | destructive. When cta=true, use primary | secondary | tertiary | disabled. */
  variant?: ButtonVariant | CTAButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Interactive disabled state (dimmed, non-clickable) */
  disabled?: boolean;
  /** CTA mode: pill shape; use with variant primary | secondary | tertiary | disabled */
  cta?: boolean;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

export function ButtonAction({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  cta = false,
  href,
  leftIcon,
  rightIcon,
  className,
}: ButtonActionProps) {
  const normalizedVariant = variant as ButtonVariant;

  const classes = [
    "btn",
    "btn-action",
    normalizedVariant === "primary" ? "btn-primary" : "",
    normalizedVariant === "secondary" ? "btn-secondary" : "",
    normalizedVariant === "tertiary" ? "btn-tertiary" : "",
    normalizedVariant === "outline" ? "btn-outline" : "",
    normalizedVariant === "disabled" ? "btn-disabled-variant" : "",
    normalizedVariant === "destructive" ? "btn-destructive" : "",
    cta ? "btn-cta" : "",
    size === "sm" ? "btn-sm" : "",
    size === "md" ? "btn-md" : "",
    size === "lg" ? "btn-lg" : "",
    leftIcon ? "btn-has-left-icon" : "",
    rightIcon ? "btn-has-right-icon" : "",
    disabled ? "btn-disabled-state" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // CTA spacer: a 0-width flex item on the opposite side from the icon.
  // In the flex row it consumes one gap-width of space, balancing the text visually.
  const spacer = cta ? <span className="btn-spacer" aria-hidden /> : null;

  const content = (
    <>
      {leftIcon ? (
        <span className="btn-icon" aria-hidden>
          {leftIcon}
        </span>
      ) : null}
      {cta && rightIcon && !leftIcon ? spacer : null}
      {children}
      {cta && leftIcon && !rightIcon ? spacer : null}
      {rightIcon ? (
        <span className="btn-icon" aria-hidden>
          {rightIcon}
        </span>
      ) : null}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (href && disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
