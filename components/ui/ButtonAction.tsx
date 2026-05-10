import Link from "next/link";

/** Variants — same set whether `cta` (pill shape) is on or off. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "neutral"
  | "soft"
  | "brand-subtle"
  | "white"
  | "outline-white";

/** @deprecated alias kept for callers that imported the CTA-subset name. Same set as ButtonVariant. */
export type CTAButtonVariant = ButtonVariant;

type ButtonActionProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Visual variant. Combine with the `destructive` modifier for red treatments. */
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Interactive disabled state (dimmed, non-clickable) */
  disabled?: boolean;
  /** CTA mode: pill shape. Composes with any variant. */
  cta?: boolean;
  /**
   * Destructive modifier — recolors the chosen variant with the error palette.
   * Composes with primary / secondary / tertiary / outline (loud → quiet).
   * Use with the *quietest* variant that still reads as the destructive path
   * — e.g. tertiary/outline for inline "Decline", primary for the commit
   * action of a Cancel-confirmation modal.
   */
  destructive?: boolean;
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
  destructive = false,
  href,
  leftIcon,
  rightIcon,
  className,
  style,
}: ButtonActionProps) {
  const classes = [
    "btn",
    "btn-action",
    variant === "primary" ? "btn-primary" : "",
    variant === "secondary" ? "btn-secondary" : "",
    variant === "tertiary" ? "btn-tertiary" : "",
    variant === "outline" ? "btn-outline" : "",
    variant === "neutral" ? "btn-neutral" : "",
    variant === "soft" ? "btn-soft" : "",
    variant === "brand-subtle" ? "btn-brand-subtle" : "",
    variant === "white" ? "btn-white" : "",
    variant === "outline-white" ? "btn-outline-white" : "",
    cta ? "btn-cta" : "",
    destructive ? "btn-is-destructive" : "",
    size === "sm" ? "btn-sm" : "",
    size === "md" ? "btn-md" : "",
    size === "lg" ? "btn-lg" : "",
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
