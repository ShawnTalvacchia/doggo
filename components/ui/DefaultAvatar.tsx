"use client";

interface DefaultAvatarProps {
  /** User's display name (initials derived from this) */
  name: string;
  /** Size in pixels (default: 40) */
  size?: number;
  /** Optional className for the outer element */
  className?: string;
}

/**
 * Generates a consistent colour from a string (user name or ID).
 * Returns an HSL colour with good contrast against white text.
 */
function getColourFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function DefaultAvatar({ name, size = 40, className = "" }: DefaultAvatarProps) {
  const bg = getColourFromString(name);
  const initials = getInitials(name);
  const fontSize = Math.max(12, Math.round(size * 0.4));

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: "#fff",
        fontSize,
        fontWeight: 600,
        lineHeight: 1,
        userSelect: "none",
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
