// Typography tokens — sourced from globals.css
// Heading/body size tokens are responsive: desktop defaults in :root,
// mobile overrides in @media (max-width: 767px)

type HeadingStep = { token: string; desktop: string; mobile: string; label: string };
type BodyStep = { token: string; desktop: string; mobile?: string; label: string };
type WeightStep = { token: string; value: number; label: string };
type LeadingStep = { token: string; value: string; usage: string };
type TrackingStep = { token: string; value: string; usage: string };

const headingScale: HeadingStep[] = [
  { token: "--font-size-h1", desktop: "48px", mobile: "32px", label: "Heading 1" },
  { token: "--font-size-h2", desktop: "32px", mobile: "24px", label: "Heading 2" },
  { token: "--font-size-h3", desktop: "24px", mobile: "20px", label: "Heading 3" },
  { token: "--font-size-h4", desktop: "20px", mobile: "18px", label: "Heading 4" },
  { token: "--font-size-h5", desktop: "18px", mobile: "16px", label: "Heading 5" },
  { token: "--font-size-tagline", desktop: "16px", mobile: "14px", label: "Tagline" },
  { token: "--font-size-calendar", desktop: "16px", mobile: "13px", label: "Calendar" },
];

const bodyScale: BodyStep[] = [
  { token: "--font-size-body-xxl", desktop: "32px", mobile: "28px", label: "Body XXL" },
  { token: "--font-size-body-xl", desktop: "24px", mobile: "20px", label: "Body XL" },
  { token: "--font-size-body-lg", desktop: "18px", mobile: "16px", label: "Body LG" },
  { token: "--font-size-body-md", desktop: "16px", mobile: "15px", label: "Body MD" },
  { token: "--font-size-body-reg", desktop: "14px", label: "Body REG" },
  { token: "--font-size-body-sm", desktop: "12px", label: "Body SM" },
  { token: "--font-size-body-xs", desktop: "10px", label: "Body XS" },
];

const weights: WeightStep[] = [
  { token: "--weight-light", value: 300, label: "Light" },
  { token: "--weight-regular", value: 400, label: "Regular" },
  { token: "--weight-semibold", value: 600, label: "SemiBold" },
  { token: "--weight-bold", value: 700, label: "Bold" },
  { token: "--weight-extrabold", value: 800, label: "ExtraBold" },
];

const leading: LeadingStep[] = [
  { token: "--leading-tight", value: "1.2", usage: "Headings" },
  { token: "--leading-normal", value: "1.35", usage: "UI text, labels, buttons" },
  { token: "--leading-relaxed", value: "1.5", usage: "Long-form body text" },
];

const tracking: TrackingStep[] = [
  { token: "--tracking-tight", value: "-0.01em", usage: "Large display type" },
  { token: "--tracking-normal", value: "0em", usage: "Body text" },
  { token: "--tracking-wide", value: "0.04em", usage: "Labels, tags, nav" },
  { token: "--tracking-wider", value: "0.05em", usage: "Section titles, caps" },
];

export default function TypographyPage() {
  return (
    <main className="sg-content">
      {/* ---- Font families ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Font Families</h2>
        <div className="sg-token-table sg-font-family-table">
          <div className="sg-font-family-row">
            <div className="sg-type-token">--font-heading</div>
            <div className="sg-font-family-sample" style={{ fontFamily: "var(--font-heading)" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "var(--weight-semibold)" as never,
                  lineHeight: 1.2,
                }}
              >
                Heading - Poppins
              </div>
              <div className="sg-font-family-glyphs">
                <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                <span>abcdefghijklmnopqrstuvwxyz</span>
                <span>0123456789</span>
              </div>
            </div>
          </div>

          <div className="sg-font-family-row">
            <div className="sg-type-token">--font-body</div>
            <div className="sg-font-family-sample" style={{ fontFamily: "var(--font-body)" }}>
              <div style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.35 }}>
                Body - Open Sans
              </div>
              <div className="sg-font-family-glyphs">
                <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                <span>abcdefghijklmnopqrstuvwxyz</span>
                <span>0123456789</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Heading scale ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Heading Scale — Poppins SemiBold</h2>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--text-tertiary)" }}>
          Responsive — mobile values shown in the Mobile column. Sizes unchanged below body-reg.
        </p>
        <div className="sg-token-table sg-type-scale-table">
          <div className="sg-type-scale-row sg-type-scale-header">
            <div className="sg-type-scale-meta">
              <span className="sg-token-name" style={{ color: "var(--text-tertiary)" }}>
                Token
              </span>
              <span className="sg-token-value">Desktop</span>
              <span className="sg-token-value">Mobile</span>
            </div>
            <span className="sg-type-scale-sample-label" aria-hidden>
              Sample
            </span>
          </div>
          {headingScale.map(({ token, desktop, mobile, label }) => (
            <div key={token} className="sg-type-scale-row">
              <div className="sg-type-scale-meta">
                <span className="sg-token-name">{token}</span>
                <span className="sg-token-value">{desktop}</span>
                <span className="sg-token-value">{mobile ?? "—"}</span>
              </div>
              <span
                className="sg-type-scale-sample"
                style={{
                  fontSize: `var(${token})`,
                  lineHeight: "var(--leading-tight)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "var(--weight-semibold)" as never,
                }}
              >
                {label} — The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Body scale ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Body Scale — Open Sans</h2>
        <div className="sg-token-table sg-type-scale-table">
          <div className="sg-type-scale-row sg-type-scale-header">
            <div className="sg-type-scale-meta">
              <span className="sg-token-name" style={{ color: "var(--text-tertiary)" }}>
                Token
              </span>
              <span className="sg-token-value">Desktop</span>
              <span className="sg-token-value">Mobile</span>
            </div>
            <span className="sg-type-scale-sample-label" aria-hidden>
              Sample
            </span>
          </div>
          {bodyScale.map(({ token, desktop, mobile, label }) => (
            <div key={token} className="sg-type-scale-row">
              <div className="sg-type-scale-meta">
                <span className="sg-token-name">{token}</span>
                <span className="sg-token-value">{desktop}</span>
                <span className="sg-token-value">{mobile ?? "—"}</span>
              </div>
              <span
                className="sg-type-scale-sample"
                style={{
                  fontSize: `var(${token})`,
                  lineHeight: "var(--leading-normal)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {label} — The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Weights + Line heights ---- */}
      <div className="sg-two-col">
        <section className="sg-section">
          <h2 className="sg-section-title">Font Weights</h2>
          <div className="sg-token-table">
            {weights.map(({ token, value, label }) => (
              <div key={token} className="sg-type-row">
                <div className="sg-type-row-meta">
                  <span className="sg-type-token">{token}</span>
                  <span className="sg-type-size">{value}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: value, fontFamily: "var(--font-body)" }}>
                  {label} — The quick brown fox
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="sg-section">
          <h2 className="sg-section-title">Line Heights</h2>
          <div className="sg-token-table">
            {leading.map(({ token, value, usage }) => (
              <div key={token} className="sg-type-row">
                <div className="sg-type-row-meta">
                  <span className="sg-type-token">{token}</span>
                  <span className="sg-type-size">{value}</span>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{usage}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Letter spacing ---- */}
      <section className="sg-section">
        <h2 className="sg-section-title">Letter Spacing</h2>
        <div className="sg-token-table">
          {tracking.map(({ token, value, usage }) => (
            <div key={token} className="sg-token-row">
              <span className="sg-token-name">{token}</span>
              <span className="sg-token-value">{value}</span>
              <span className="sg-token-preview">
                <span
                  style={{ fontSize: 13, letterSpacing: value, color: "var(--text-secondary)" }}
                >
                  DOGGO — {usage}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
