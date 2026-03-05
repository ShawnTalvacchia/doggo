"use client";

import { useState } from "react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
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
  const [sliderVal, setSliderVal] = useState(10);
  const [segSize, setSegSize] = useState<string[]>([]);
  const [segAge, setSegAge] = useState<string>("Adult");

  function toggleSeg(arr: string[], val: string) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  }

  const DOG_SIZES = ["0–5", "5–10", "10–25", "25–45", "45+"];
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

          <DemoCard title="CheckboxRow">
            <div style={{ display: "grid", gap: 8, width: "100%" }}>
              <CheckboxRow id="demo-check-1" checked={checked} onChange={setChecked}>
                I agree to the terms and conditions
              </CheckboxRow>
              <CheckboxRow id="demo-check-2" checked={true} onChange={() => {}}>
                Email me about booking updates
              </CheckboxRow>
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

          <DemoCard
            title="Segment Bar (single-select)"
            subtitle="segment-bar · segment-btn · .active modifier + .seg-sub"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Dog age</span>
                  </span>
                </label>
                <div className="segment-bar">
                  {DOG_AGES.map(({ label, sub }) => (
                    <button
                      key={label}
                      type="button"
                      className={`segment-btn${segAge === label ? " active" : ""}`}
                      onClick={() => setSegAge(label)}
                    >
                      {label}
                      <span className="seg-sub">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Selected: <code>{segAge}</code>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Segment Bar (multi-select)" subtitle="multiple .active items allowed">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">
                  <span className="label-primary-group">
                    <span>Dog size (kg)</span>
                  </span>
                </label>
                <div className="segment-bar">
                  {DOG_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`segment-btn${segSize.includes(size) ? " active" : ""}`}
                      onClick={() => setSegSize((prev) => toggleSeg(prev, size))}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Selected: <code>{segSize.length ? segSize.join(", ") : "none"}</code>
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Slider" subtitle="slider-block · slider-row · slider-value-box">
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div className="input-block">
                <label className="label" htmlFor="demo-slider">
                  <span className="label-primary-group">
                    <span>Walking radius (km)</span>
                  </span>
                </label>
                <div className="slider-block">
                  <div className="slider-row">
                    <input
                      id="demo-slider"
                      type="range"
                      min={1}
                      max={40}
                      step={1}
                      value={sliderVal}
                      onChange={(e) => setSliderVal(Number(e.target.value))}
                    />
                    <div className="slider-value-box">{sliderVal}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Value: <code>{sliderVal} km</code>
              </div>
            </div>
          </DemoCard>
        </div>
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
        <h2 className="sg-section-title">Inventory — Not Yet Previewed</h2>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-tertiary)" }}>
          These components exist and are in active use — full interactive demos not yet added to the
          styleguide.
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
            "CardExploreResult",
            "ExploreFilterPanelDesktop",
            "ExploreFilterPanelMobile",
            "ProviderHeaderState",
            "AppNav",
            "BottomNav",
            "SignupProfilePreview",
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
