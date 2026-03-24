// Semantic token data — mirrors globals.css :root semantic section

type AliasToken = { token: string; maps: string; hex: string };
type SpaceToken = { token: string; value: string; px: number };
type RadiusToken = { token: string; value: string; px: number };
type ShadowToken = { token: string; value: string; label: string };

const surfaceAliases: AliasToken[] = [
  { token: "--surface-top", maps: "--neutral-white", hex: "#ffffff" },
  { token: "--surface-popout", maps: "--neutral-12", hex: "#fcfcfc" },
  { token: "--surface-base", maps: "--neutral-25", hex: "#F8F8F8" },
  { token: "--surface-inset", maps: "--neutral-50", hex: "#F4F4F4" },
  { token: "--surface-gray", maps: "--neutral-200", hex: "#cbcbcb" },
  { token: "--surface-disabled", maps: "--neutral-300", hex: "#b0b2b2" },
  { token: "--surface-base-inverse", maps: "--neutral-800", hex: "#323232" },
  { token: "--surface-neutral-dark", maps: "--neutral-900", hex: "#191919" },
];

const brandAliases: AliasToken[] = [
  { token: "--brand-faint", maps: "--brand-4", hex: "#fbffff" },
  { token: "--brand-subtle", maps: "--brand-12", hex: "#e5f4f4" },
  { token: "--brand-light", maps: "--brand-400", hex: "#229b94" },
  { token: "--brand-main", maps: "--brand-600", hex: "#006862" },
  { token: "--brand-strong", maps: "--brand-700", hex: "#004e49" },
];

const textAliases: AliasToken[] = [
  { token: "--text-primary", maps: "--neutral-850", hex: "#252626" },
  { token: "--text-secondary", maps: "--neutral-700", hex: "#4a4c4c" },
  { token: "--text-tertiary", maps: "--neutral-500", hex: "#656666" },
  { token: "--text-light", maps: "--neutral-300", hex: "#b0b2b2" },
  { token: "--text-inverse", maps: "--neutral-12", hex: "#fcfcfc" },
  { token: "--text-white", maps: "--neutral-white", hex: "#ffffff" },
  { token: "--text-black", maps: "--neutral-950", hex: "#0c0d0d" },
];

const borderAliases: AliasToken[] = [
  { token: "--border-lightest", maps: "--neutral-white", hex: "#ffffff" },
  { token: "--border-light", maps: "--neutral-25", hex: "#F8F8F8" },
  { token: "--border-regular", maps: "--neutral-50", hex: "#F4F4F4" },
  { token: "--border-strong", maps: "--neutral-100", hex: "#e5e5e5" },
  { token: "--border-stronger", maps: "--neutral-150", hex: "#d8d8d8" },
  { token: "--border-strongest", maps: "--neutral-400", hex: "#969898" },
];

const interactionAliases: AliasToken[] = [
  {
    token: "--interaction-hover-lighten",
    maps: "--transparent-light-16",
    hex: "rgba(255,255,255, 0.161)",
  },
  { token: "--interaction-hover-darken", maps: "--transparent-dark-8", hex: "rgba(0,0,0, 0.078)" },
  { token: "--interaction-hover-subtle", maps: "--transparent-dark-4", hex: "rgba(0,0,0, 0.039)" },
];

const statusAliases: AliasToken[] = [
  { token: "--status-success-light", maps: "--success-25", hex: "#defff1" },
  { token: "--status-success-main", maps: "--success-500", hex: "#069d5c" },
  { token: "--status-success-strong", maps: "--success-600", hex: "#057e4a" },
  { token: "--status-warning-light", maps: "--warning-25", hex: "#fff7e1" },
  { token: "--status-warning-main", maps: "--warning-500", hex: "#ffc936" },
  { token: "--status-warning-strong", maps: "--warning-600", hex: "#deab26" },
  { token: "--status-error-light", maps: "--error-25", hex: "#fcedec" },
  { token: "--status-error-main", maps: "--error-500", hex: "#e2473c" },
  { token: "--status-error-strong", maps: "--error-600", hex: "#b53930" },
  { token: "--status-error-surface", maps: "--status-error-light", hex: "#fcedec" },
  { token: "--status-error-border", maps: "--status-error-main", hex: "#e2473c" },
  { token: "--status-error-text", maps: "--status-error-strong", hex: "#b53930" },
  { token: "--status-info-light", maps: "--info-25", hex: "#eff2fc" },
  { token: "--status-info-main", maps: "--info-500", hex: "#607ae1" },
  { token: "--status-info-strong", maps: "--info-600", hex: "#4e63b8" },
];

// Figma-named spacing scale (primary) + legacy numeric aliases noted inline
const spacingTokens: SpaceToken[] = [
  { token: "--space-tiny", value: "2px", px: 2 },
  { token: "--space-xs", value: "6px", px: 6 },
  { token: "--space-sm", value: "8px", px: 8 },
  { token: "--space-md", value: "12px", px: 12 },
  { token: "--space-lg", value: "16px", px: 16 },
  { token: "--space-xl", value: "20px", px: 20 },
  { token: "--space-xxl", value: "24px", px: 24 },
  { token: "--space-xxxl", value: "32px", px: 32 },
  { token: "--space-jumbo-1", value: "40px", px: 40 },
  { token: "--space-jumbo-2", value: "64px", px: 64 },
  { token: "--space-jumbo-3", value: "80px", px: 80 },
];

const radiusTokens: RadiusToken[] = [
  { token: "--radius-none", value: "0px", px: 0 },
  { token: "--radius-tiny", value: "2px", px: 2 },
  { token: "--radius-xxs", value: "4px", px: 4 },
  { token: "--radius-xs", value: "6px", px: 6 },
  { token: "--radius-sm", value: "8px", px: 8 },
  { token: "--radius-md", value: "12px", px: 12 },
  { token: "--radius-lg", value: "16px", px: 16 },
  { token: "--radius-xl", value: "24px", px: 24 },
  { token: "--radius-circle", value: "9999px", px: 9999 },
];

const radiusAliases = [
  { alias: "--radius-panel", maps: "--radius-sm" },
  { alias: "--radius-form", maps: "--radius-xl" },
  { alias: "--radius-pill", maps: "--radius-circle" },
  { alias: "--radius-full", maps: "--radius-circle" },
];

const shadowTokens: ShadowToken[] = [
  { token: "--shadow-xs", value: "0 1px 2px rgba(0,0,0,0.05)", label: "XS — subtle lift (tags, chips)" },
  { token: "--shadow-sm", value: "0 2px 8px rgba(0,0,0,0.06)", label: "SM — cards, panels" },
  { token: "--shadow-md", value: "0 4px 16px rgba(0,0,0,0.08)", label: "MD — dropdowns, popovers" },
  { token: "--shadow-lg", value: "0 8px 24px rgba(0,0,0,0.10)", label: "LG — elevated panels" },
  { token: "--shadow-xl", value: "0 16px 48px rgba(0,0,0,0.12)", label: "XL — hero cards, overlays" },
  { token: "--shadow-modal", value: "0 4px 20px rgba(0,0,0,0.10)", label: "Modal — dialogs, sheets" },
  { token: "--shadow-footer", value: "0 -3px 12px rgba(188,188,188,0.06)", label: "Footer — sticky footers, bottom nav" },
];

// Border width tokens
type BorderWidthToken = { token: string; value: string; px: number; usage: string };

const borderWidthTokens: BorderWidthToken[] = [
  { token: "--border-width-reg", value: "1px", px: 1, usage: "Default borders, dividers" },
  { token: "--border-width-lg", value: "2px", px: 2, usage: "Active states, emphasis" },
  { token: "--border-width-xl", value: "3px", px: 3, usage: "Strong emphasis, selected tabs" },
  { token: "--border-width-xxl", value: "4px", px: 4, usage: "Heavy accents, focus rings" },
];

// Layout tokens
type LayoutToken = { token: string; value: string; description: string };

const layoutTokens: LayoutToken[] = [
  { token: "--nav-height", value: "65px (desktop) / 56px (mobile)", description: "Top nav bar height — used for sticky offsets and viewport calculations" },
  { token: "--app-page-max-width", value: "768px", description: "Max content width — matches the 768px breakpoint" },
];

// Convenience aliases
type ConvenienceAlias = { token: string; maps: string; description: string };

const convenienceAliases: ConvenienceAlias[] = [
  { token: "--surface-page", maps: "--surface-top", description: "White background for nav bars, sticky headers" },
  { token: "--surface-hover", maps: "--interaction-hover-darken", description: "Subtle hover on light surfaces" },
  { token: "--border-subtle", maps: "--border-strong", description: "Light dividers (#e5e5e5)" },
  { token: "--border-default", maps: "--border-stronger", description: "Standard visible borders (#d8d8d8)" },
  { token: "--text-muted", maps: "--text-tertiary", description: "De-emphasised text (#656666)" },
  { token: "--success", maps: "--status-success-main", description: "Legacy shorthand" },
  { token: "--error", maps: "--status-error-main", description: "Legacy shorthand" },
  { token: "--on-hover-lighten", maps: "--interaction-hover-lighten", description: "Deprecated — use --interaction-hover-lighten" },
  { token: "--on-hover-darken", maps: "--interaction-hover-darken", description: "Deprecated — use --interaction-hover-darken" },
];

// ---- Shared row components ----

function AliasRow({ token, maps, hex }: AliasToken) {
  return (
    <div className="sg-token-row">
      <span className="sg-token-name">{token}</span>
      <span className="sg-token-value">→ {maps}</span>
      <span className="sg-token-preview">
        <span className="sg-alias-swatch" style={{ background: `var(${token})` }} />
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-tertiary)" }}>
          {hex}
        </span>
      </span>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="sg-content">
      {/* ---- Surface ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Surface</h2>
        <div className="sg-token-table">
          {surfaceAliases.map((a) => (
            <AliasRow key={a.token} {...a} />
          ))}
        </div>
      </section>

      {/* ---- Brand + Text side-by-side ---- */}
      <div className="sg-two-col">
        <section className="sg-section">
          <h2 className="sg-section-title">Brand</h2>
          <div className="sg-token-table">
            {brandAliases.map((a) => (
              <AliasRow key={a.token} {...a} />
            ))}
          </div>
        </section>
        <section className="sg-section">
          <h2 className="sg-section-title">Text</h2>
          <div className="sg-token-table">
            {textAliases.map((a) => (
              <AliasRow key={a.token} {...a} />
            ))}
          </div>
        </section>
      </div>

      {/* ---- Border + Interaction side-by-side ---- */}
      <div className="sg-two-col">
        <section className="sg-section">
          <h2 className="sg-section-title">Border</h2>
          <div className="sg-token-table">
            {borderAliases.map((a) => (
              <AliasRow key={a.token} {...a} />
            ))}
          </div>
        </section>
        <section className="sg-section">
          <h2 className="sg-section-title">Interaction</h2>
          <div className="sg-token-table">
            {interactionAliases.map((a) => (
              <AliasRow key={a.token} {...a} />
            ))}
          </div>
        </section>
      </div>

      {/* ---- Status ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Status</h2>
        <div className="sg-token-table">
          {statusAliases.map((a) => (
            <AliasRow key={a.token} {...a} />
          ))}
        </div>
      </section>

      {/* ---- Spacing ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Spacing</h2>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--text-tertiary)" }}>
          Legacy numeric aliases (--space-1 → --space-16) are also available in globals.css for
          backwards compat. <strong>Deprecated</strong> — use named tokens (--space-tiny through
          --space-jumbo-3) in new code.
        </p>
        <div className="sg-token-table">
          {spacingTokens.map(({ token, value, px }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value">{value}</span>
              <span className="sg-token-preview">
                <span className="sg-space-bar" style={{ width: Math.min(px * 2.5, 280) }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Radius ---- */}
      <div className="sg-two-col">
        <section className="sg-section">
          <h2 className="sg-section-title">Radius Scale</h2>
          <div className="sg-token-table">
            {radiusTokens.map(({ token, value, px }) => (
              <div key={token} className="sg-token-row">
                <span className="sg-token-name">{token}</span>
                <span className="sg-token-value">{value}</span>
                <span className="sg-token-preview">
                  <span className="sg-radius-box" style={{ borderRadius: Math.min(px, 24) }} />
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="sg-section">
          <h2 className="sg-section-title">Radius Aliases</h2>
          <div className="sg-token-table">
            {radiusAliases.map(({ alias, maps }) => (
              <div key={alias} className="sg-token-row">
                <span className="sg-token-name">{alias}</span>
                <span className="sg-token-value">→ {maps}</span>
                <span className="sg-token-preview">
                  <span className="sg-radius-box" style={{ borderRadius: `var(${alias})` }} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Shadows ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Shadows</h2>
        <div className="sg-token-table">
          {shadowTokens.map(({ token, value, label }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value" style={{ fontSize: 10 }}>
                {value}
              </span>
              <span className="sg-token-preview">
                <span className="sg-shadow-card" style={{ boxShadow: `var(${token})` }}>
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Border Widths ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Border Widths</h2>
        <div className="sg-token-table">
          {borderWidthTokens.map(({ token, value, px, usage }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value">{value}</span>
              <span className="sg-token-preview" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 80,
                    height: 0,
                    borderTop: `${px}px solid var(--text-primary)`,
                  }}
                />
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-tertiary)" }}>
                  {usage}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Layout Tokens ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Layout</h2>
        <div className="sg-token-table">
          {layoutTokens.map(({ token, value, description }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value">{value}</span>
              <span className="sg-token-preview">
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-tertiary)" }}>
                  {description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Convenience Aliases ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Convenience Aliases</h2>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--text-tertiary)" }}>
          Shorthand tokens that map to semantic tokens. Use these for common patterns.
        </p>
        <div className="sg-token-table">
          {convenienceAliases.map(({ token, maps, description }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value">→ {maps}</span>
              <span className="sg-token-preview">
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-tertiary)" }}>
                  {description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Interaction Guidance ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Interaction Tokens — Usage Guide</h2>
        <div className="sg-token-table">
          <div className="sg-token-row">
            <span className="sg-token-name">--interaction-hover-lighten</span>
            <span className="sg-token-value" style={{ fontSize: 11 }}>white @ 16%</span>
            <span className="sg-token-preview">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 32,
                  borderRadius: "var(--radius-xs)",
                  background: "var(--brand-main)",
                  color: "var(--text-white)",
                  fontSize: 11,
                  fontFamily: "monospace",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    background: "var(--interaction-hover-lighten)",
                  }}
                />
                <span style={{ position: "relative" }}>dark bg hover</span>
              </span>
            </span>
          </div>
          <div className="sg-token-row">
            <span className="sg-token-name">--interaction-hover-darken</span>
            <span className="sg-token-value" style={{ fontSize: 11 }}>black @ 8%</span>
            <span className="sg-token-preview">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 32,
                  borderRadius: "var(--radius-xs)",
                  background: "var(--interaction-hover-darken)",
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "var(--text-secondary)",
                }}
              >
                light bg hover
              </span>
            </span>
          </div>
          <div className="sg-token-row">
            <span className="sg-token-name">--interaction-hover-subtle</span>
            <span className="sg-token-value" style={{ fontSize: 11 }}>black @ 4%</span>
            <span className="sg-token-preview">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 32,
                  borderRadius: "var(--radius-xs)",
                  background: "var(--interaction-hover-subtle)",
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "var(--text-secondary)",
                }}
              >
                ghost hover
              </span>
            </span>
          </div>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--text-tertiary)" }}>
          <strong>lighten</strong> → hover on dark/brand backgrounds (white overlay).{" "}
          <strong>darken</strong> → hover on light/white backgrounds (standard).{" "}
          <strong>subtle</strong> → ghost buttons, nav links, minimal hover.
        </p>
      </section>
    </main>
  );
}
