type ButtonIconProps = {
  label: string;
  children: React.ReactNode;
  showBadge?: boolean;
  onClick?: () => void;
};

export function ButtonIcon({ label, children, showBadge, onClick }: ButtonIconProps) {
  return (
    <button className="button-icon" aria-label={label} type="button" onClick={onClick}>
      <span className="button-icon-glyph">{children}</span>
      {showBadge ? <span className="button-icon-badge">1</span> : null}
    </button>
  );
}
