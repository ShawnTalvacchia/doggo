import Link from "next/link";

/** Variants when CTA is false (full set) */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "disabled"
  | "destructive"
  | "white"
  | "outline-white";

/** Variants when CTA is true (subset — pill shape) */
export type CTAButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "white"
  | "outline-white"
  | "disabled";

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
  /** Inline style for one-off overrides (e.g. color on an outline button in a specific context). */
  style?: React.CSSProperties;
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
  style,
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
    normalizedVariant === "white" ? "btn-white" : "",
    normalizedVariant === "outline-white" ? "btn-outline-white" : "",
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
      <Link href={href} className={classes} style={style}>
        {content}
      </Link>
    );
  }

  if (href && disabled) {
    return (
      <span className={classes} aria-disabled="true" style={style}>
        {content}
      </span>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} style={style}>
      {content}
    </button>
  );
}
