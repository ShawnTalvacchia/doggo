"use client";

import { useState } from "react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { CheckOptionRow } from "@/components/ui/CheckOptionRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { DualRangeSlider } from "@/components/ui/DualRangeSlider";
import { RangeSlider } from "@/components/ui/RangeSlider";
import {
  Bell,
  CalendarDots,
  CaretLeft,
  ChatCircleDots,
  MagnifyingGlass,
  Sparkle,
  Trash,
  ArrowRight,
} from "@phosphor-icons/react";

function DemoCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sg-demo-card">
      <div className="sg-demo-card-header">
        {title}
        {subtitle && (
          <span
            style={{
              fontWeight: "var(--weight-regular)" as never,
              color: "var(--text-tertiary)",
              marginLeft: 8,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      <div className="sg-demo-card-body">{children}</div>
    </div>
  );
}

export default function ComponentsPage() {
  const [inputVal, setInputVal] = useState("");
  const [checked, setChecked] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);
  const [priceMin, setPriceMin] = useState(250);
  const [priceMax, setPriceMax] = useState(900);
  const [accordionServices, setAccordionServices] = useState<string[]>(["Walking"]);
  const [segAge, setSegAge] = useState<string[]>(["Adult"]);
  const [segDays, setSegDays] = useState<string[]>(["Mo", "We"]);

  const DOG_AGES = [
    { label: "Puppy", sub: "0–1 yr" },
    { label: "Adult", sub: "1–7 yrs" },
    { label: "Senior", sub: "7+ yrs" },
  ];

  return (
    <main className="sg-content">
      <section className="sg-section">
        <h2 className="sg-section-title">Button / Action</h2>
        <p
          style={{
            margin: "0 0 16px",
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.45,
            maxWidth: "56ch",
          }}
        >
          <strong>Variants</strong> (6): primary, secondary, tertiary, outline, disabled,
          destructive.
          <strong style={{ marginLeft: 6 }}>CTA mode</strong> (<code>cta</code>): pill shape; use
          with variant <code>primary</code>, <code>secondary</code>, <code>tertiary</code>, or{" "}
          <code>disabled</code>. Example: form footer "Back" = <code>cta variant="tertiary"</code>{" "}
          with <code>leftIcon</code>.
        </p>
        <div style={{ display: "grid", gap: 16 }}>
          <DemoCard
            title="Variants"
            subtitle="primary · secondary · tertiary · outline · disabled · destructive"
          >
            <ButtonAction variant="primary" size="md">
              Primary
            </ButtonAction>
            <ButtonAction variant="secondary" size="md">
              Secondary
            </ButtonAction>
            <ButtonAction variant="tertiary" size="md">
              Tertiary
            </ButtonAction>
            <ButtonAction variant="outline" size="md">
              Outline
            </ButtonAction>
            <ButtonAction variant="disabled" size="md">
              Disabled
            </ButtonAction>
            <ButtonAction variant="destructive" size="md">
              Destructive
            </ButtonAction>
          </DemoCard>

          <DemoCard
            title="CTA Mode"
            subtitle="pill shape · primary · secondary · tertiary · disabled"
          >
            <ButtonAction cta variant="primary" size="md">
              CTA Primary
            </ButtonAction>
            <ButtonAction cta variant="secondary" size="md">
              CTA Secondary
            </ButtonAction>
            <ButtonAction cta variant="tertiary" size="md">
              CTA Tertiary
            </ButtonAction>
            <ButtonAction cta variant="disabled" size="md">
              CTA Disabled
            </ButtonAction>
          </DemoCard>

          <DemoCard title="Sizes" subtitle="sm · md · lg">
            <ButtonAction variant="primary" size="sm">
              Small
            </ButtonAction>
            <ButtonAction variant="primary" size="md">
              Medium
            </ButtonAction>
            <ButtonAction variant="primary" size="lg">
              Large
            </ButtonAction>
          </DemoCard>

          <DemoCard title="With Icons">
            <ButtonAction
              variant="primary"
              size="md"
              leftIcon={<MagnifyingGlass size={20} weight="light" />}
            >
              Leading icon
            </ButtonAction>
            <ButtonAction
              variant="outline"
              size="md"
              rightIcon={<ArrowRight size={20} weight="light" />}
            >
              Trailing icon
            </ButtonAction>
            <ButtonAction
              cta
              variant="tertiary"
              size="md"
              leftIcon={<CaretLeft size={16} weight="bold" />}
            >
              Back
            </ButtonAction>
            <ButtonAction
              variant="secondary"
              size="md"
              leftIcon={<MagnifyingGlass size={20} weight="light" />}
              rightIcon={<Trash size={20} weight="light" />}
            >
              Both icons
            </ButtonAction>
          </DemoCard>

          <DemoCard title="Disabled (prop)" subtitle="dimmed, non-clickable">
            <ButtonAction variant="primary" size="md" disabled>
              Primary disabled
            </ButtonAction>
            <ButtonAction variant="outline" size="md" disabled>
              Outline disabled
            </ButtonAction>
            <ButtonAction variant="destructive" size="md" disabled>
              Destructive disabled
            </ButtonAction>
          </DemoCard>
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Button / Icon</h2>
        <DemoCard
          title="Navbar Icons"
          subtitle="Phosphor weight:light · 32px glyph · 40px touch target"
        >
          <span className="button-icon">
            <span className="button-icon-glyph">
              <Bell size={32} weight="light" />
            </span>
          </span>
          <span className="button-icon">
            <span className="button-icon-glyph">
              <ChatCircleDots size={32} weight="light" />
            </span>
          </span>
          <span className="button-icon">
            <span className="button-icon-glyph">
              <CalendarDots size={32} weight="light" />
            </span>
          </span>
          <span className="button-icon">
            <span className="button-icon-glyph">
              <Sparkle size={32} weight="light" />
            </span>
          </span>
        </DemoCard>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Form Elements</h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-tertiary)" }}>
          Shared controls should map 1:1 to product usage. Segment controls are multi-select only,
          checkbox rows expose two visual variants for different information density, and sliders
          share one visual language.
        </p>
        <div style={{ display: "grid", gap: 16 }}>
          <DemoCard title="InputField">
            <div style={{ width: "100%", maxWidth: 400 }}>
              <InputField
                id="demo-input"
                label="Full name"
                value={inputVal}
                onChange={setInputVal}
                placeholder="e.g. Alex Johnson"
                required
                helper="Used for your public profile"
              />
            </div>
          </DemoCard>

          <DemoCard title="Checkbox Controls" subtitle="CheckboxRow (care-preferences flow)">
            <div
              style={{
                width: "100%",
                maxWidth: 560,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <CheckboxRow id="demo-check-1" checked={checked} onChange={setChecked}>
                Aggressive toward dogs
              </CheckboxRow>
              <CheckboxRow id="demo-check-2" checked={true} onChange={() => {}}>
                Reactive (barks/lunges on leash)
              </CheckboxRow>
            </div>
          </DemoCard>

          <DemoCard title="CheckOptionRow" subtitle="Explore filter accordion row">
            <div className="left-accordion-stack" style={{ width: "100%", maxWidth: 560 }}>
              <div className="left-accordion">
                <button type="button" className="left-accordion-btn">
                  Services
                </button>
                <div className="left-accordion-body open">
                  {["Drop-in visit", "Group walk", "Solo walk", "Walking"].map((option) => (
                    <CheckOptionRow
                      key={option}
                      label={option}
                      checked={accordionServices.includes(option)}
                      onChange={() =>
                        setAccordionServices((prev) =>
                          prev.includes(option)
                            ? prev.filter((value) => value !== option)
                            : [...prev, option],
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Toggle" subtitle="toggle-track · toggle-knob · .on modifier">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="toggle-row">
                <span className="label" style={{ margin: 0 }}>
                  Public Profile
                </span>
                <button
                  type="button"
                  className={`toggle-track${toggleOn ? " on" : ""}`}
                  onClick={() => setToggleOn((v) => !v)}
                  aria-label="Toggle public profile"
                  aria-pressed={toggleOn}
                >
                  <div className="toggle-knob" />
                </button>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                State: <code>{toggleOn ? "on" : "off"}</code> — click to toggle
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Segment Controls" subtitle="base labels + sublabel variant">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Walk days</span>
                  </span>
                </label>
                <MultiSelectSegmentBar
                  ariaLabel="Walk days"
                  options={["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => ({
                    value: day,
                    label: day,
                  }))}
                  selectedValues={segDays}
                  onToggle={(value) =>
                    setSegDays((prev) =>
                      prev.includes(value) ? prev.filter((existing) => existing !== value) : [...prev, value],
                    )
                  }
                />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Dog age</span>
                  </span>
                </label>
                <MultiSelectSegmentBar
                  ariaLabel="Dog age"
                  options={DOG_AGES.map(({ label, sub }) => ({
                    value: label,
                    label,
                    subLabel: sub,
                  }))}
                  selectedValues={segAge}
                  onToggle={(value) =>
                    setSegAge((prev) =>
                      prev.includes(value)
                        ? prev.filter((existing) => existing !== value)
                        : [...prev, value],
                    )
                  }
                />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Days: <code>{segDays.length ? segDays.join(", ") : "none"}</code> · Age:{" "}
                <code>{segAge.length ? segAge.join(", ") : "none"}</code>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Sliders" subtitle="Walking + Explore rate controls">
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Where can you offer walks? (km)</span>
                  </span>
                </label>
                <div className="slider-row">
                  <RangeSlider min={1} max={40} step={1} value={radiusKm} onChange={setRadiusKm} />
                  <div className="slider-value-box">{radiusKm}</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Rate per visit</span>
                  </span>
                </label>
                <div className="left-range-labels">
                  <span>{priceMin} Kč</span>
                  <span>{priceMax} Kč</span>
                </div>
                <DualRangeSlider
                  min={150}
                  max={1200}
                  step={50}
                  minValue={priceMin}
                  maxValue={priceMax}
                  onMinChange={setPriceMin}
                  onMaxChange={setPriceMax}
                />
              </div>
            </div>
          </DemoCard>
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Landing CTA Buttons</h2>
        <p
          style={{
            margin: "0 0 16px",
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.45,
            maxWidth: "60ch",
          }}
        >
          CSS-only classes applied to <code>&lt;Link&gt;</code> elements on the landing page. These
          are <strong>not</strong> <code>ButtonAction</code> instances — they are larger, always
          pill-shaped, and tuned for marketing contexts. Do not use in app flows; use{" "}
          <code>ButtonAction</code> there instead.
        </p>
        <div style={{ display: "grid", gap: 16 }}>
          <DemoCard title="On light background" subtitle=".landing-btn-primary · .landing-btn-outline">
            <a href="#" className="landing-btn-primary" onClick={(e) => e.preventDefault()}>
              Find care nearby
            </a>
            <a href="#" className="landing-btn-outline" onClick={(e) => e.preventDefault()}>
              Earn on the side
            </a>
          </DemoCard>

          <DemoCard title="On brand/dark background" subtitle=".landing-btn-white · .landing-btn-outline-white">
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                background: "var(--brand-main)",
                padding: "20px 24px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <a href="#" className="landing-btn-white" onClick={(e) => e.preventDefault()}>
                Start searching
              </a>
              <a href="#" className="landing-btn-outline-white" onClick={(e) => e.preventDefault()}>
                Earn on the side
              </a>
            </div>
          </DemoCard>
        </div>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Nav Link Variants</h2>
        <p
          style={{
            margin: "0 0 16px",
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.45,
            maxWidth: "60ch",
          }}
        >
          Used in <code>AppNav</code> guest mode only. The primary variant is a teal pill (Sign Up).
          The dev trigger is intentionally muted — it is a prototype tool, not a product element.
          Logged mode uses <code>ButtonAction variant="tertiary"</code> instead of these classes.
        </p>
        <DemoCard title="Guest Nav Links" subtitle=".app-nav-link · .app-nav-link--primary · .app-nav-dev-trigger">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="#" className="app-nav-link" onClick={(e) => e.preventDefault()}>
              Sign In
            </a>
            <a href="#" className="app-nav-link app-nav-link--primary" onClick={(e) => e.preventDefault()}>
              Sign Up
            </a>
            <span className="app-nav-dev-trigger" title="Dev navigation">···</span>
          </div>
        </DemoCard>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Pill / Tag</h2>
        <DemoCard title="Filter Pills" subtitle="active · inactive">
          <div className="pill-group">
            <button className="pill active">Dog Walking</button>
            <button className="pill">Pet Sitting</button>
            <button className="pill">Boarding</button>
            <button className="pill active">Grooming</button>
            <button className="pill">Training</button>
          </div>
        </DemoCard>
      </section>

      <section className="sg-section">
        <h2 className="sg-section-title">Shared Component Inventory</h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-tertiary)" }}>
          Keep this list aligned with reusable building blocks in active product flows.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
          }}
        >
          {[
            "FormHeader",
            "FormFooter",
            "MultiSelectSegmentBar",
            "DualRangeSlider",
            "RangeSlider",
            "CheckboxRow",
            "CheckOptionRow",
            "CardExploreResult",
            "ExploreFilterPanelDesktop",
            "ExploreFilterPanelMobile",
            "ProviderHeaderState",
            "AppNav",
            "BottomNav",
            "SignupProfilePreview",
            "MapView (Leaflet, SSR-safe)",
            "LandingPage / HeroVisual",
            "LandingPage / FeaturedCard",
            "LandingPage / ServiceCard",
            "LandingPage / Step",
            "SignIn (mock auth form)",
          ].map((name) => (
            <div
              key={name}
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: "var(--text-secondary)",
                background: "var(--surface-top)",
                fontFamily: "var(--font-body)",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
