// Primitive token hex values — sourced from globals.css (_prefix tokens)

const neutralTokens = [
  { step: "white", hex: "#ffffff" },
  { step: "12", hex: "#fcfcfc" },
  { step: "25", hex: "#f4f4f4" },
  { step: "50", hex: "#e8e8e8" },
  { step: "100", hex: "#e5e5e5" },
  { step: "150", hex: "#d8d8d8" },
  { step: "200", hex: "#cbcbcb" },
  { step: "300", hex: "#b0b2b2" },
  { step: "400", hex: "#969898" },
  { step: "500", hex: "#656666" },
  // no /600 in Figma
  { step: "700", hex: "#4a4c4c" },
  { step: "800", hex: "#323232" },
  { step: "850", hex: "#252626" },
  { step: "900", hex: "#191919" },
  { step: "950", hex: "#0c0d0d" },
  { step: "black", hex: "#000000" },
];

const brandTokens = [
  { step: "4", hex: "#fbffff" },
  { step: "12", hex: "#e5f4f4" },
  { step: "25", hex: "#c4f4f1" },
  { step: "50", hex: "#b1f3f0" },
  { step: "100", hex: "#89e6e0" },
  { step: "150", hex: "#78d9d4" },
  { step: "200", hex: "#67cdc7" },
  { step: "300", hex: "#44b4ad" },
  { step: "400", hex: "#229b94" },
  { step: "500", hex: "#00827a" },
  { step: "600", hex: "#006862" },
  { step: "700", hex: "#004e49" },
  { step: "800", hex: "#003431" },
  { step: "900", hex: "#001716" },
  { step: "950", hex: "#001513" },
];

const statusGroups = [
  {
    label: "Success",
    prefix: "success",
    tokens: [
      { step: "25", hex: "#defff1" },
      { step: "50", hex: "#baf3db" },
      { step: "100", hex: "#a6eacd" },
      { step: "300", hex: "#56c394" },
      { step: "500", hex: "#069d5c" },
      { step: "600", hex: "#057e4a" },
      { step: "850", hex: "#022f1c" },
    ],
  },
  {
    label: "Warning",
    prefix: "warning",
    tokens: [
      { step: "25", hex: "#fff7e1" },
      { step: "50", hex: "#f8eccb" },
      { step: "100", hex: "#f1e0b4" },
      { step: "300", hex: "#eac86c" },
      { step: "500", hex: "#ffc936" },
      { step: "600", hex: "#deab26" },
      { step: "850", hex: "#372800" },
    ],
  },
  {
    label: "Error",
    prefix: "error",
    tokens: [
      { step: "25", hex: "#fcedec" },
      { step: "50", hex: "#f9dad8" },
      { step: "100", hex: "#f6c8c5" },
      { step: "300", hex: "#ee918a" },
      { step: "500", hex: "#e2473c" },
      { step: "600", hex: "#b53930" },
      { step: "850", hex: "#441512" },
    ],
  },
  {
    label: "Info",
    prefix: "info",
    tokens: [
      { step: "25", hex: "#eff2fc" },
      { step: "50", hex: "#dfe4f9" },
      { step: "100", hex: "#cfd7f6" },
      { step: "300", hex: "#a0afed" },
      { step: "500", hex: "#607ae1" },
      { step: "600", hex: "#4e63b8" },
      { step: "850", hex: "#202a52" },
    ],
  },
];

// Opacity steps with actual alpha values from globals.css
const alphaSteps: Record<string, number> = {
  "0": 0,
  "4": 0.039,
  "8": 0.078,
  "16": 0.161,
  "24": 0.239,
  "32": 0.322,
  "40": 0.4,
  "64": 0.639,
  "80": 0.8,
};

const transparentGroups = [
  {
    label: "Dark",
    prefix: "transparent-dark",
    base: "0,0,0",
    steps: ["0", "4", "8", "16", "24", "32", "40", "64", "80"],
  },
  {
    label: "Light",
    prefix: "transparent-light",
    base: "255,255,255",
    steps: ["4", "8", "16", "32", "40", "64", "80"],
  },
  {
    label: "Gray",
    prefix: "transparent-gray",
    base: "237,237,237",
    steps: ["4", "8", "16", "24", "40", "64", "80"],
  },
];

function SwatchRow({ cssVar, label, hex }: { cssVar: string; label: string; hex: string }) {
  return (
    <div className="sg-swatch-row">
      <span className="sg-swatch" style={{ background: `var(${cssVar})` }} />
      <div>
        <div className="sg-swatch-name">{label}</div>
        <div className="sg-swatch-meta" style={{ fontFamily: "monospace" }}>
          {hex}
        </div>
      </div>
    </div>
  );
}

function TransparentSwatchRow({
  cssVar,
  step,
  base,
}: {
  cssVar: string;
  step: string;
  base: string;
}) {
  const alpha = alphaSteps[step] ?? parseFloat(step) / 100;
  const hex = `rgba(${base}, ${alpha})`;
  return (
    <div className="sg-swatch-row">
      <span
        className="sg-swatch"
        style={{
          background: `var(${cssVar})`,
          // Checkered pattern shows transparency clearly
          backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
        }}
      >
        <span
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: `var(${cssVar})`,
            borderRadius: "inherit",
          }}
        />
      </span>
      <div>
        <div className="sg-swatch-name">{step}%</div>
        <div className="sg-swatch-meta" style={{ fontFamily: "monospace" }}>
          {hex}
        </div>
      </div>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <main className="sg-content">
      <section className="sg-section">
        <h2 className="sg-section-title">Usage Rules</h2>
        <p className="profile-card-copy">
          Prefer semantic tokens and class-based styling in product code. Static inline styles
          should be moved into shared classes. See <code>docs/frontend-style.md</code> for the full
          standard.
        </p>
        <div className="sg-token-table">
          <div className="sg-token-row">
            <span className="sg-token-name">Do</span>
            <span className="sg-token-value">Use semantic tokens</span>
            <span className="sg-token-preview">
              `--text-secondary`, `--surface-popout`, `--border-strong`
            </span>
          </div>
          <div className="sg-token-row">
            <span className="sg-token-name">Do</span>
            <span className="sg-token-value">Use semantic class names</span>
            <span className="sg-token-preview">`explore-*`, `signup-*`, `profile-*`, `sg-*`</span>
          </div>
          <div className="sg-token-row">
            <span className="sg-token-name">Don't</span>
            <span className="sg-token-value">Hardcode static styles inline</span>
            <span className="sg-token-preview">
              Avoid static style props with hardcoded color and layout declarations
            </span>
          </div>
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Migration Notes</h2>
        <p className="profile-card-copy">
          Current focus is product flows first (`explore`, `signup`), then styleguide/demo cleanup.
          Compatibility aliases are documented when legacy token names remain in use.
        </p>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Neutral &amp; Brand</h2>
        <div className="sg-color-columns">
          <div className="sg-color-column">
            <p className="sg-subsection-title">_Neutral</p>
            {neutralTokens.map(({ step, hex }) => (
              <SwatchRow
                key={step}
                cssVar={`--neutral-${step}`}
                label={`--neutral-${step}`}
                hex={hex}
              />
            ))}
          </div>
          <div className="sg-color-column">
            <p className="sg-subsection-title">_Brand</p>
            {brandTokens.map(({ step, hex }) => (
              <SwatchRow
                key={step}
                cssVar={`--brand-${step}`}
                label={`--brand-${step}`}
                hex={hex}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Status</h2>
        <div className="sg-color-columns">
          {statusGroups.map(({ label, prefix, tokens }) => (
            <div key={prefix} className="sg-color-column">
              <p className="sg-subsection-title">{label}</p>
              {tokens.map(({ step, hex }) => (
                <SwatchRow
                  key={step}
                  cssVar={`--${prefix}-${step}`}
                  label={`--${prefix}-${step}`}
                  hex={hex}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Transparent Overlays</h2>
        <div className="sg-color-columns">
          {transparentGroups.map(({ label, prefix, base, steps }) => (
            <div key={prefix} className="sg-color-column">
              <p className="sg-subsection-title">
                {label} — rgba({base})
              </p>
              {steps.map((step) => (
                <TransparentSwatchRow
                  key={step}
                  cssVar={`--${prefix}-${step}`}
                  step={step}
                  base={base}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
