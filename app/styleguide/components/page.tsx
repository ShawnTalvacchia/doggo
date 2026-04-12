"use client";

import { useState } from "react";
import { ButtonAction, type ButtonVariant } from "@/components/ui/ButtonAction";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { Toggle } from "@/components/ui/Toggle";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { DatePicker, DateTrigger, type DateRange } from "@/components/ui/DatePicker";
import { RecurringSchedulePicker } from "@/components/ui/RecurringSchedulePicker";
import { BookingModal } from "@/components/overlays/BookingModal";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { FilterBody } from "@/components/explore/FilterBody";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import type { ProviderCard, ProviderServiceOffering, RecurringSchedule, ExploreFilters } from "@/lib/types";
import { defaultExploreFilters } from "@/lib/mockData";
import {
  Bell,
  CalendarDots,
  CaretLeft,
  CaretRight,
  ChatCircleDots,
  MagnifyingGlass,
  Sparkle,
  ArrowRight,
  UserCircle,
  DotsThree,
} from "@phosphor-icons/react";

// ── Demo primitives ────────────────────────────────────────────────────────────

function Demo({
  label,
  note,
  canvas = "default",
  children,
}: {
  label: string;
  note?: string;
  canvas?: "default" | "stack" | "inset" | "dark" | "narrow" | "wide";
  children: React.ReactNode;
}) {
  return (
    <div className="sg-demo">
      <div className="sg-demo-label">
        {label}
        {note && <span className="sg-demo-note">{note}</span>}
      </div>
      <div className={`sg-demo-canvas${canvas !== "default" ? ` sg-demo-canvas--${canvas}` : ""}`}>
        {children}
      </div>
    </div>
  );
}

function PropRow({ name, type, note }: { name: string; type: string; note?: string }) {
  return (
    <div className="sg-token-row" style={{ gridTemplateColumns: "160px 1fr 1fr" }}>
      <span className="sg-token-name"><code>{name}</code></span>
      <span className="sg-token-value" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>{type}</span>
      {note && <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{note}</span>}
    </div>
  );
}

function PropTable({ children }: { children: React.ReactNode }) {
  return <div className="sg-token-table">{children}</div>;
}

// ── Page ───────────────────────────────────────────────────────────────────────

// ── ButtonAction playground ────────────────────────────────────────────────────

const BTN_VARIANTS: ButtonVariant[] = [
  "primary", "secondary", "tertiary", "outline", "destructive",
];
const BTN_SIZES = ["sm", "md", "lg"] as const;
const BTN_ICONS = { none: null, left: <MagnifyingGlass size={20} weight="light" />, right: <ArrowRight size={20} weight="light" /> };

function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [cta, setCta] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [icon, setIcon] = useState<keyof typeof BTN_ICONS>("none");

  const leftIcon = icon === "left" ? BTN_ICONS.left : undefined;
  const rightIcon = icon === "right" ? BTN_ICONS.right : undefined;

  return (
    <div className="sg-btn-playground">
      <div className={`sg-btn-playground-preview${onDark ? " sg-btn-playground-preview--dark" : ""}`}>
        <ButtonAction variant={variant} size={size} cta={cta} leftIcon={leftIcon} rightIcon={rightIcon}>
          Button label
        </ButtonAction>
      </div>
      <div className="sg-btn-playground-controls">
        <div className="sg-btn-ctrl-group">
          <span className="sg-btn-ctrl-label">variant</span>
          <div className="sg-btn-ctrl-pills">
            {BTN_VARIANTS.map((v) => (
              <button key={v} type="button" className={`sg-btn-ctrl-pill${variant === v ? " active" : ""}`} onClick={() => setVariant(v)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="sg-btn-ctrl-group">
          <span className="sg-btn-ctrl-label">size</span>
          <div className="sg-btn-ctrl-pills">
            {BTN_SIZES.map((s) => (
              <button key={s} type="button" className={`sg-btn-ctrl-pill${size === s ? " active" : ""}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="sg-btn-ctrl-group">
          <span className="sg-btn-ctrl-label">icon</span>
          <div className="sg-btn-ctrl-pills">
            {(Object.keys(BTN_ICONS) as Array<keyof typeof BTN_ICONS>).map((k) => (
              <button key={k} type="button" className={`sg-btn-ctrl-pill${icon === k ? " active" : ""}`} onClick={() => setIcon(k)}>{k}</button>
            ))}
          </div>
        </div>
        <div className="sg-btn-ctrl-group">
          <span className="sg-btn-ctrl-label">modifiers</span>
          <div className="sg-btn-ctrl-pills">
            <button type="button" className={`sg-btn-ctrl-pill${cta ? " active" : ""}`} onClick={() => setCta((v) => !v)}>cta</button>
            <button type="button" className={`sg-btn-ctrl-pill${onDark ? " active" : ""}`} onClick={() => setOnDark((v) => !v)}>onDark</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Demo mock data ─────────────────────────────────────────────────────────────

const DEMO_PROVIDER: ProviderCard = {
  id: "demo-provider",
  name: "Lucie Nováková",
  district: "Praha 6",
  neighborhood: "Dejvice",
  rating: 4.9,
  reviewCount: 38,
  priceFrom: 350,
  priceUnit: "per_visit",
  blurb: "Professional dog walker with 5 years of experience. Your dog's happiness is my priority.",
  avatarUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=200&q=80",
  services: ["walk_checkin", "boarding"],
  distanceKm: 1.2,
  neighbourhoodMatch: true,
  mutualConnections: 2,
};

const DEMO_SERVICES: ProviderServiceOffering[] = [
  {
    id: "svc-1",
    providerId: "demo-provider",
    serviceType: "walk_checkin",
    title: "Walks & Check-ins",
    shortDescription: "Daily walks and drop-in visits at your home.",
    priceFrom: 350,
    priceUnit: "per_visit",
  },
  {
    id: "svc-2",
    providerId: "demo-provider",
    serviceType: "boarding",
    title: "Overnight Boarding",
    shortDescription: "Your dog stays comfortably at my home.",
    priceFrom: 650,
    priceUnit: "per_night",
  },
];

// ── Accordion pattern demo ─────────────────────────────────────────────────────

function AccordionDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-accordion" style={{ width: "100%", maxWidth: 400 }}>
      <button
        type="button"
        className={`filter-accordion-btn${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Size preferences</span>
        <svg className="accordion-caret" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`filter-accordion-body${open ? " open" : ""}`}>
        <p style={{ margin: "0 0 8px", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Content collapses/expands with CSS max-height transition. Used in FilterBody to group sub-filter sections.
        </p>
        <div className="filter-field">
          <label className="filter-inline-check"><input type="checkbox" defaultChecked /> Small (under 10 kg)</label>
          <label className="filter-inline-check"><input type="checkbox" defaultChecked /> Medium (10–25 kg)</label>
          <label className="filter-inline-check"><input type="checkbox" /> Large (25 kg+)</label>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

// ── Component groups ───────────────────────────────────────────────────────────

type GroupKey = "all" | "primitives" | "forms" | "layout" | "overlays" | "explore";

const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "all",        label: "All" },
  { key: "primitives", label: "Primitives" },
  { key: "forms",      label: "Forms" },
  { key: "layout",     label: "Layout" },
  { key: "overlays",   label: "Overlays" },
  { key: "explore",    label: "Explore" },
];

// Renders children only when the active group matches (or "all" is selected)
function GroupSection({
  group,
  activeGroup,
  children,
}: {
  group: GroupKey;
  activeGroup: GroupKey;
  children: React.ReactNode;
}) {
  if (activeGroup !== "all" && activeGroup !== group) return null;
  return <>{children}</>;
}

// ── Page component ─────────────────────────────────────────────────────────────

export default function ComponentsPage() {
  const [activeGroup, setActiveGroup] = useState<GroupKey>("all");

  const [inputVal, setInputVal] = useState("");

  const [chkLeft1, setChkLeft1] = useState(false);
  const [chkLeft2, setChkLeft2] = useState(true);
  const [chkRight1, setChkRight1] = useState(false);
  const [chkRight2, setChkRight2] = useState(false);

  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);

  const [segDays, setSegDays] = useState<string[]>(["Mo", "We"]);
  const [segAge, setSegAge] = useState<string[]>(["Adult"]);
  const [segFormDogs, setSegFormDogs] = useState<string[]>(["1"]);

  const [radiusKm, setRadiusKm] = useState(10);
  const [priceMin, setPriceMin] = useState(250);
  const [priceMax, setPriceMax] = useState(900);

  const [activePills, setActivePills] = useState<string[]>(["Morning", "Evening"]);
  const PILLS = ["Morning", "Midday", "Afternoon", "Evening", "Overnight"];
  const [activeSgPills, setActiveSgPills] = useState<string[]>(["Boarding"]);
  const SG_PILLS = ["Dog Walking", "Boarding", "Pet Sitting", "Grooming"];

  const [modalOpen, setModalOpen] = useState(false);

  // DatePicker demos
  const [dateSingle, setDateSingle] = useState<string | null>(null);
  const [singlePickerOpen, setSinglePickerOpen] = useState(false);
  const [dateRangeDemo, setDateRangeDemo] = useState<DateRange>({ start: null, end: null });
  const [rangePickerOpen, setRangePickerOpen] = useState(false);

  // RecurringSchedulePicker demo
  const [schedule, setSchedule] = useState<RecurringSchedule>({
    days: ["Mon", "Wed", "Fri"],
    time: "08:00",
    timeLabel: "8:00–9:00am",
  });

  // BookingModal demo
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // FilterBody demo
  const [filterState, setFilterState] = useState<ExploreFilters>({
    ...defaultExploreFilters,
    service: "walk_checkin",
  });

  const DOG_AGES = [
    { label: "Puppy", sub: "0–1 yr" },
    { label: "Adult", sub: "1–7 yrs" },
    { label: "Senior", sub: "7+ yrs" },
  ];

  return (
    <main className="sg-content">

      {/* ── Group nav ─────────────────────────────────────────────────────────── */}
      <nav className="sg-group-nav" aria-label="Component groups">
        {GROUPS.map(({ key, label }) => (
          <button
            key={key}
            className={`sg-group-pill${activeGroup === key ? " sg-group-pill--active" : ""}`}
            onClick={() => setActiveGroup(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── ButtonAction ─────────────────────────────────────────────────────── */}
      <GroupSection group="primitives" activeGroup={activeGroup}>
      <section className="sg-section">
        <h2 className="sg-section-title">ButtonAction</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          The single action component for all clickable UI. Renders as <code>&lt;button&gt;</code>,{" "}
          <code>&lt;Link&gt;</code> (when <code>href</code> is set), or{" "}
          <code>&lt;span aria-disabled&gt;</code> (when <code>href + disabled</code>).
          Add <code>cta</code> for pill shape — used in hero sections and form footers.
          White variants are for dark or brand-coloured surfaces only.
        </p>
        <PropTable>
          <PropRow name="variant" type="primary | secondary | tertiary | outline | destructive | white | outline-white | disabled" note="white/outline-white: dark backgrounds only." />
          <PropRow name="size" type="sm | md | lg" note="lg for marketing. md for in-app. sm for condensed contexts." />
          <PropRow name="cta" type="boolean" note="Pill shape. Available variants: primary, secondary, tertiary, outline, white, outline-white, disabled." />
          <PropRow name="href" type="string?" note="Renders as <Link>. href + disabled renders as <span aria-disabled>." />
          <PropRow name="leftIcon / rightIcon" type="ReactNode?" note="Phosphor icon. CTA mode auto-balances spacing with a spacer element." />
          <PropRow name="disabled" type="boolean?" note="Functional disabled state. Separate from variant='disabled' which is visual only." />
        </PropTable>
        <ButtonPlayground />
      </section>

      {/* ── ButtonIcon ───────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">ButtonIcon</h2>
        <p className="sg-body-copy" style={{ maxWidth: "60ch" }}>
          40px touch-target icon button. Used in AppNav icon row and wherever an icon action needs
          no text label. Pass <code>href</code> to render as a <code>&lt;Link&gt;</code>.
          Icon spec: Phosphor <code>weight="light"</code>, <code>size=&#123;32&#125;</code>.
        </p>
        <PropTable>
          <PropRow name="label" type="string" note="Required — becomes aria-label." />
          <PropRow name="showBadge" type="boolean?" note="Notification dot." />
          <PropRow name="badgeCount" type="number?" note="Shown inside badge if > 0; capped at '9+'." />
          <PropRow name="href" type="string?" note="Renders as <Link> instead of <button>." />
        </PropTable>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="Default">
            <ButtonIcon label="Notifications"><Bell size={32} weight="light" /></ButtonIcon>
            <ButtonIcon label="Messages" href="/inbox"><ChatCircleDots size={32} weight="light" /></ButtonIcon>
            <ButtonIcon label="Bookings" href="/bookings"><CalendarDots size={32} weight="light" /></ButtonIcon>
            <ButtonIcon label="Sparkle"><Sparkle size={32} weight="light" /></ButtonIcon>
          </Demo>
          <Demo label="With badge" note="showBadge · badgeCount · capped at 9+">
            <ButtonIcon label="No count" showBadge><Bell size={32} weight="light" /></ButtonIcon>
            <ButtonIcon label="3 messages" showBadge badgeCount={3}><ChatCircleDots size={32} weight="light" /></ButtonIcon>
            <ButtonIcon label="12+ items" showBadge badgeCount={12}><Bell size={32} weight="light" /></ButtonIcon>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="forms" activeGroup={activeGroup}>
      {/* ── InputField ───────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">InputField</h2>
        <p className="sg-body-copy" style={{ maxWidth: "60ch" }}>
          Standard text input with label, helper text, and error state. Handles aria-invalid and
          aria-describedby automatically. Always use this instead of a raw{" "}
          <code>&lt;input&gt;</code>.
        </p>
        <PropTable>
          <PropRow name="id" type="string" note="Required — ties label to input for accessibility." />
          <PropRow name="label" type="string" note="" />
          <PropRow name="required" type="boolean?" note="Shows * indicator; turns green when filled." />
          <PropRow name="secondaryLabel" type="string?" note="Right-aligned label (e.g. 'Optional')." />
          <PropRow name="helper" type="string?" note="Shown below input when no error." />
          <PropRow name="error" type="string?" note="Replaces helper. Triggers .input-invalid style." />
          <PropRow name="type" type="string?" note="Defaults to 'text'." />
        </PropTable>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="Default" canvas="narrow">
            <div style={{ width: "100%" }}>
              <InputField id="sg-default" label="Full name" value={inputVal} onChange={setInputVal} placeholder="e.g. Alex Johnson" required helper="Used for your public profile" />
            </div>
          </Demo>
          <Demo label="Error state" canvas="narrow">
            <div style={{ width: "100%" }}>
              <InputField id="sg-error" label="Email" value="" onChange={() => {}} error="Please enter a valid email address" required />
            </div>
          </Demo>
          <Demo label="With secondary label" canvas="narrow">
            <div style={{ width: "100%" }}>
              <InputField id="sg-secondary" label="Bio" secondaryLabel="Optional" value="" onChange={() => {}} placeholder="Tell owners about yourself" />
            </div>
          </Demo>
        </div>
      </section>

      {/* ── CheckboxRow ─────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">CheckboxRow</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Unified checkbox for both layout directions. The visual box is 24×24px (Phosphor{" "}
          <code>Check</code> icon, <code>size=12 weight="bold"</code>) centred inside a 48×48px
          touch-target container (<code>.checkbox-row-indicator</code>). The container's padding
          naturally separates the box from the label — no explicit gap needed.
        </p>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          DOM order is always <em>indicator → label</em>. The reversed layout is a pure CSS
          utility — <code>.checkbox-row--reverse</code> (or <code>placement="right"</code>) applies{" "}
          <code>flex-direction: row-reverse</code>. Since the label has <code>flex: 1</code> it
          fills all available width and the indicator is pushed to the far edge automatically.
        </p>
        <PropTable>
          <PropRow name="label" type="ReactNode" note="String or inline JSX (e.g. <>I agree to <strong>ToS</strong></>)." />
          <PropRow name="checked" type="boolean" note="" />
          <PropRow name="onChange" type="(checked: boolean) => void" note="" />
          <PropRow name="placement" type='"left" | "right"' note='"left" (default): indicator left. "right": maps to .checkbox-row--reverse — indicator right, label fills width.' />
          <PropRow name="id" type="string?" note="Optional — implicit label wrapping handles accessibility without it." />
        </PropTable>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label='placement="left"' note="default · signup flows, consent, pet selection" canvas="stack">
            <CheckboxRow label="Aggressive toward dogs" checked={chkLeft1} onChange={setChkLeft1} />
            <CheckboxRow label="Reactive (barks/lunges on leash)" checked={chkLeft2} onChange={setChkLeft2} />
          </Demo>
          <Demo label='placement="right" · .checkbox-row--reverse' note="filter lists, option rows, settings" canvas="stack">
            <CheckboxRow label="Drop-in visit" checked={chkRight1} onChange={setChkRight1} placement="right" />
            <CheckboxRow label="Group walk" checked={chkRight2} onChange={setChkRight2} placement="right" />
          </Demo>
        </div>
      </section>

      {/* ── Toggle ───────────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Toggle</h2>
        <p className="sg-body-copy" style={{ maxWidth: "60ch" }}>
          Binary on/off toggle. Use for settings where the change takes effect immediately
          (e.g. Public Profile visibility). For multi-option selections, use{" "}
          <code>CheckboxRow</code> or <code>MultiSelectSegmentBar</code> instead.
        </p>
        <PropTable>
          <PropRow name="label" type="string" note="Displayed alongside the toggle. Also becomes aria-label." />
          <PropRow name="checked" type="boolean" note="" />
          <PropRow name="onChange" type="(checked: boolean) => void" note="" />
          <PropRow name="labelPlacement" type='"left" | "right"' note="Default: left." />
        </PropTable>
        <div className="sg-demo-group">
          <Demo label="Off / On" note="click to toggle" canvas="stack">
            <div style={{ padding: "4px 0" }}>
              <Toggle label="Public Profile" checked={toggle1} onChange={setToggle1} />
            </div>
            <div style={{ padding: "4px 0" }}>
              <Toggle label="Email notifications" checked={toggle2} onChange={setToggle2} />
            </div>
          </Demo>
        </div>
      </section>

      {/* ── MultiSelectSegmentBar ────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">MultiSelectSegmentBar</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Segmented control — multi-select only. Used for days of week, dog age bands, available
          time windows. Add <code>subLabel</code> to an option for two-line display.
        </p>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          The <code>variant</code> prop controls the active-state color treatment based on
          selection context:
        </p>
        <ul className="sg-body-copy" style={{ maxWidth: "64ch", paddingLeft: "1.5em" }}>
          <li>
            <strong>
              <code>variant="filter"</code>
            </strong>{" "}
            — brand accent (tinted bg + brand border). Use in explore/search filters where
            selections feel exploratory and reversible.
          </li>
          <li>
            <strong>
              <code>variant="form"</code>
            </strong>{" "}
            (default) — neutral filled (elevated surface + strong border). Use in signup flows,
            preference setup, and profile settings where selections feel committed.
          </li>
        </ul>
        <PropTable>
          <PropRow name="options" type="{ value, label, subLabel? }[]" note="subLabel enables two-line option cell." />
          <PropRow name="selectedValues" type="string[]" note="" />
          <PropRow name="onToggle" type="(value: string) => void" note="" />
          <PropRow name="ariaLabel" type="string" note="Accessible label for the control group." />
          <PropRow name="variant" type='"form" | "filter"' note='Default "form". "filter" uses brand-accent active state.' />
        </PropTable>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label='variant="filter"' note="explore panel — days of week">
            <div style={{ width: "100%" }}>
              <MultiSelectSegmentBar
                ariaLabel="Walk days"
                options={["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => ({ value: d, label: d }))}
                selectedValues={segDays}
                onToggle={(v) => setSegDays((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v])}
                variant="filter"
              />
            </div>
          </Demo>
          <Demo label='variant="form"' note="signup flow — number of dogs">
            <div style={{ width: "100%" }}>
              <MultiSelectSegmentBar
                ariaLabel="Number of dogs"
                options={["1", "2", "3", "4+"].map((n) => ({ value: n, label: n }))}
                selectedValues={segFormDogs}
                onToggle={(v) => setSegFormDogs((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v])}
                variant="form"
              />
            </div>
          </Demo>
          <Demo label="With subLabel" note="dog age bands · variant=&quot;filter&quot;">
            <div style={{ width: "100%" }}>
              <MultiSelectSegmentBar
                ariaLabel="Dog age"
                options={DOG_AGES.map(({ label, sub }) => ({ value: label, label, subLabel: sub }))}
                selectedValues={segAge}
                onToggle={(v) => setSegAge((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v])}
                variant="filter"
              />
            </div>
          </Demo>
        </div>
      </section>

      {/* ── Sliders ──────────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Slider</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Single component for both single-thumb and dual-thumb range inputs. Add{" "}
          <code>dual</code> for a min/max pair. Pair with <code>.slider-row</code> and{" "}
          <code>.slider-value-box</code> for the value readout layout.
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="Slider" note="single thumb · walk radius, distance" canvas="narrow">
            <div style={{ width: "100%", display: "grid", gap: 8 }}>
              <label className="label">
                <span className="label-primary-group"><span>Walk radius (km)</span></span>
              </label>
              <div className="slider-row">
                <Slider min={1} max={40} step={1} value={radiusKm} onChange={setRadiusKm} />
                <div className="slider-value-box">{radiusKm}</div>
              </div>
            </div>
          </Demo>
          <Demo label="Slider dual" note="two thumbs · price range" canvas="narrow">
            <div style={{ width: "100%", display: "grid", gap: 8 }}>
              <label className="label">
                <span className="label-primary-group"><span>Rate per visit</span></span>
              </label>
              <div className="filter-range-labels">
                <span>{priceMin} Kč</span>
                <span>{priceMax} Kč</span>
              </div>
              <Slider
                dual
                min={150} max={1200} step={50}
                minValue={priceMin} maxValue={priceMax}
                onMinChange={setPriceMin} onMaxChange={setPriceMax}
              />
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="primitives" activeGroup={activeGroup}>
      {/* ── Pills ────────────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Pill</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Two interactive pill variants, both always <code>&lt;button&gt;</code> elements.
          Active state across both: <code>surface-top</code> fill, <code>brand-strong</code> border
          (bumped to 1.5px), and <code>brand-strong</code> text — no tinted background.
        </p>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          <strong>.pill</strong> — thin border (1px), for content multi-select: availability time
          slots, service type tags. Used in profile availability and booking flows.{" "}
          <strong>.sg-group-pill</strong> — medium border (1.5px), <code>font-weight: medium</code>,
          for primary navigation groups. The category bar above this section uses this pattern.
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label=".pill" note="content multi-select · availability time slots">
            <div className="pill-group">
              {PILLS.map((p) => (
                <button
                  key={p}
                  className={`pill${activePills.includes(p) ? " active" : ""}`}
                  onClick={() => setActivePills((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
                >
                  {p}
                </button>
              ))}
            </div>
          </Demo>
          <Demo label=".sg-group-pill" note="navigation groups · category filter, tab groups">
            <div className="pill-group">
              {SG_PILLS.map((p) => (
                <button
                  key={p}
                  className={`sg-group-pill${activeSgPills.includes(p) ? " sg-group-pill--active" : ""}`}
                  onClick={() => setActiveSgPills((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
                >
                  {p}
                </button>
              ))}
            </div>
          </Demo>
        </div>
      </section>

      {/* ── Tags ─────────────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Tag · Chip</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Two canonical read-only display tokens. Use <code>.tag</code> for compact flat labels
          (service types in search results, status metadata). Use <code>.chip</code> for richer
          pill-shaped badges that can carry an icon (weight bands, booking attributes).
          Never use these as buttons — use <code>.pill</code> or <code>ButtonAction</code> for
          interactive elements.
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label=".tag" note="flat · 4px radius · fine text · service labels, compact metadata">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="tag">Dog Walking</span>
              <span className="tag">Pet Sitting</span>
              <span className="tag">Boarding</span>
              <span className="tag">Grooming</span>
            </div>
          </Demo>
          <Demo label=".chip" note="pill radius · 12px · can carry icon · weight, capacity, attributes">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="chip">Small (0–10 kg)</span>
              <span className="chip">Medium (10–25 kg)</span>
              <span className="chip">Large (25–45 kg)</span>
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="layout" activeGroup={activeGroup}>
      {/* ── FormHeader + FormFooter ──────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">FormHeader · FormFooter</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Paired layout components for multi-step forms. <code>FormHeader</code> renders the
          heading and optionally the <code>SignupProgressBar</code> (auto-detected on{" "}
          <code>/signup/*</code>, or override with the <code>showProgress</code> prop).{" "}
          <code>FormFooter</code> is the sticky back + continue nav bar.
        </p>
        <PropTable>
          <PropRow name="FormHeader: title" type="string" note="Renders as <h1 className='heading'>." />
          <PropRow name="FormHeader: subtitle" type="string" note="Renders as <p className='subheading'>." />
          <PropRow name="FormHeader: showProgress" type="boolean?" note="Explicit override. Defaults to auto-detect from /signup/* route." />
          <PropRow name="FormFooter: onBack / onContinue" type="() => void" note="" />
          <PropRow name="FormFooter: disableContinue" type="boolean?" note="" />
          <PropRow name="FormFooter: continueLabel" type="string?" note="Defaults to 'Save & Continue'." />
        </PropTable>
        <div className="sg-demo-group">
          <Demo label="FormFooter" note="back + continue navigation — sticky in production">
            <div style={{ width: "100%" }}>
              <div className="form-footer">
                <div className="form-footer-inner">
                  <ButtonAction variant="tertiary" size="md" cta leftIcon={<CaretLeft size={16} weight="bold" />}>Back</ButtonAction>
                  <ButtonAction variant="primary" size="md" cta rightIcon={<CaretRight size={20} weight="bold" />}>Save & Continue</ButtonAction>
                </div>
              </div>
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="primitives" activeGroup={activeGroup}>
      {/* ── StatusBadge ─────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">StatusBadge</h2>
        <p className="sg-body-copy" style={{ maxWidth: "60ch" }}>
          Five contract lifecycle states, each mapped to a semantic status token pair (strong text +
          light background). Extracted from inline definitions in{" "}
          <code>/app/bookings</code> — now lives in{" "}
          <code>components/ui/StatusBadge.tsx</code>.
        </p>
        <PropTable>
          <PropRow name="status" type='"upcoming" | "active" | "completed" | "cancelled" | "paused"' note="Maps to .booking-status-badge--{status} CSS modifier." />
        </PropTable>
        <div className="sg-demo-group">
          <Demo label="All states">
            <StatusBadge status="active" />
            <StatusBadge status="upcoming" />
            <StatusBadge status="completed" />
            <StatusBadge status="cancelled" />
            <StatusBadge status="paused" />
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="overlays" activeGroup={activeGroup}>
      {/* ── ModalSheet ───────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">ModalSheet</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Single overlay component for all modal/sheet needs. At desktop (&gt;804px) it renders as a
          centered card with a blurred backdrop. At mobile (&lt;804px) it slides up as a bottom
          sheet. Used by DatePicker, RecurringSchedulePicker, BookingModal, and NotificationsPanel.
          Click the backdrop or the × button to close. Body scroll is locked while open.
        </p>
        <PropTable>
          <PropRow name="open" type="boolean" note="Controls visibility. Render the trigger separately; ModalSheet handles mounting via portal." />
          <PropRow name="onClose" type="() => void" note="Called by backdrop click and × button." />
          <PropRow name="title" type="string" note="Header title + aria-label for the dialog." />
          <PropRow name="footer" type="ReactNode?" note="Optional sticky footer — rendered below the scrollable body. Use for action buttons." />
          <PropRow name="children" type="ReactNode" note="Scrollable body content." />
        </PropTable>
        <div className="sg-demo-group">
          <Demo label="Trigger + sheet">
            <ButtonAction variant="outline" size="md" onClick={() => setModalOpen(true)}>
              Open ModalSheet
            </ButtonAction>
          </Demo>
        </div>
        <ModalSheet
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Sheet"
          footer={
            <ButtonAction variant="primary" size="md" cta onClick={() => setModalOpen(false)}>
              Confirm
            </ButtonAction>
          }
        >
          <div style={{ padding: "8px 0", display: "grid", gap: 12 }}>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--font-size-body-reg)", lineHeight: 1.6 }}>
              This is the scrollable body area. Place any content here — form fields, date pickers,
              filter lists, etc. The footer stays pinned at the bottom.
            </p>
            <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: "var(--font-size-sub)", lineHeight: 1.6 }}>
              Resize to &lt;804px viewport width to see the bottom sheet version.
            </p>
          </div>
        </ModalSheet>
      </section>
      </GroupSection>

      <GroupSection group="layout" activeGroup={activeGroup}>
      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Navigation</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Two navigation components. <code>AppNav</code> is the top bar — it detects the current
          route and renders one of three link sets. <code>BottomNav</code> is the mobile tab bar,
          visible only on logged-in routes at narrow viewports.
        </p>

        {/* AppNav modes */}
        <div style={{ marginBottom: 24 }}>
          <div className="sg-demo-label" style={{ marginBottom: 12 }}>AppNav — three modes (route-driven)</div>
          <PropTable>
            <PropRow name="guest" type="/  /signin  /pages  etc." note="Logo + Sign In (hidden on mobile) + Sign Up pill + ··· dev trigger." />
            <PropRow name="signup / styleguide" type="/signup/*  /styleguide/*" note="Logo only + ··· dev trigger. Contained width, no distractions." />
            <PropRow name="logged" type="/explore/*  /inbox/*  /bookings/*  /profile/*" note="Logo + Search + Offer Care text buttons + icon row (Bell / Messages / Bookings / Avatar)." />
          </PropTable>
        </div>

        {/* AppNav visual mocks */}
        <div className="sg-demo-group sg-demo-group--row" style={{ marginBottom: 24 }}>
          <Demo label="Guest mode">
            <div className="app-nav-shell" style={{ position: "static", borderBottom: "1px solid var(--border-strong)" }}>
              <nav className="app-nav app-nav--contained" style={{ pointerEvents: "none" }}>
                <div className="app-nav-inner">
                  <div className="app-nav-brand-wrap">
                    <span className="app-nav-brand">DOGGO</span>
                  </div>
                  <div className="app-nav-mode">
                    <div className="app-nav-right" aria-label="Guest navigation">
                      <span className="app-nav-link app-nav-link--hide-mobile">Sign In</span>
                      <span className="app-nav-link app-nav-link--primary">Sign Up</span>
                      <span className="app-nav-dev-trigger">···</span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </Demo>
          <Demo label="Signup / styleguide mode">
            <div className="app-nav-shell app-nav-shell--signup" style={{ position: "static", borderBottom: "1px solid var(--border-strong)" }}>
              <nav className="app-nav app-nav--contained" style={{ pointerEvents: "none" }}>
                <div className="app-nav-inner">
                  <div className="app-nav-brand-wrap">
                    <span className="app-nav-brand">DOGGO</span>
                  </div>
                  <div className="app-nav-mode">
                    <div className="app-nav-right" aria-label="Signup navigation">
                      <span className="app-nav-dev-trigger"><DotsThree size={24} weight="bold" /></span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </Demo>
          <Demo label="Logged mode">
            <div className="app-nav-shell" style={{ position: "static", borderBottom: "1px solid var(--border-strong)" }}>
              <nav className="app-nav app-nav--logged" style={{ pointerEvents: "none" }}>
                <div className="app-nav-brand-wrap">
                  <span className="app-nav-brand">DOGGO</span>
                </div>
                <div className="app-nav-mode">
                  <div className="app-nav-logged" aria-label="Logged-in navigation">
                    <div className="app-nav-main-links">
                      <span className="app-nav-action-btn"><MagnifyingGlass size={24} weight="light" style={{ marginRight: 6 }} />Search</span>
                      <span className="app-nav-action-btn"><Sparkle size={24} weight="light" style={{ marginRight: 6 }} />Offer Care</span>
                    </div>
                    <div className="app-nav-icon-row">
                      <ButtonIcon label="Notifications"><Bell size={32} weight="light" /></ButtonIcon>
                      <ButtonIcon label="Messages"><ChatCircleDots size={32} weight="light" /></ButtonIcon>
                      <ButtonIcon label="Bookings"><CalendarDots size={32} weight="light" /></ButtonIcon>
                      <span className="app-nav-avatar-trigger">
                        <img className="app-nav-avatar-img" src="/images/generated/shawn-profile.jpg" alt="Avatar" />
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </Demo>
        </div>

        {/* BottomNav */}
        <div className="sg-demo-label" style={{ marginBottom: 12 }}>BottomNav — mobile logged routes only</div>
        <p className="sg-body-copy" style={{ maxWidth: "60ch", marginBottom: 16 }}>
          Fixed 4-tab bar at bottom of viewport. Only visible on <code>/explore/*</code>,{" "}
          <code>/bookings/*</code>, <code>/inbox/*</code>, <code>/profile</code>. Hidden on provider
          profile, individual inbox threads, and when a service filter is active on explore results.
          Active tab uses <code>weight="fill"</code> icon.
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="BottomNav — Explore active">
            <div style={{ width: "100%", position: "relative", height: 64 }}>
              <nav className="bottom-nav" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} aria-label="Main navigation">
                {[
                  { label: "Explore", Icon: MagnifyingGlass, active: true },
                  { label: "Bookings", Icon: CalendarDots, active: false },
                  { label: "Inbox", Icon: ChatCircleDots, active: false },
                  { label: "Profile", Icon: UserCircle, active: false },
                ].map(({ label, Icon, active }) => (
                  <span key={label} className={`bottom-nav-tab${active ? " active" : ""}`} style={{ pointerEvents: "none" }}>
                    <Icon size={24} weight={active ? "fill" : "regular"} />
                    <span className="bottom-nav-label">{label}</span>
                  </span>
                ))}
              </nav>
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="explore" activeGroup={activeGroup}>
      {/* ── CardExploreResult ────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">CardExploreResult</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          The primary provider result card. Renders as a full <code>&lt;Link&gt;</code> — the entire
          card is tappable. The <code>returnQuery</code> prop carries the full filter state into the
          profile URL so back navigation can restore results.
        </p>
        <PropTable>
          <PropRow name="provider" type="ProviderCard" note="id, name, district, neighborhood, rating, reviewCount, priceFrom, priceUnit, blurb, avatarUrl, services[]." />
          <PropRow name="activeService" type="ServiceType?" note="Highlighted service context from the filter state." />
          <PropRow name="returnQuery" type="string?" note="Full query string (e.g. 'service=walk_checkin&minRate=200') — preserves filter state in back nav." />
        </PropTable>
        <PropTable>
          <PropRow name="distanceKm" type="number?" note="Shows distance chip if set." />
          <PropRow name="neighbourhoodMatch" type="boolean?" note="Replaces distance with 'Your neighbourhood' trust signal." />
          <PropRow name="mutualConnections" type="number?" note="Shows mutual owners count if set." />
        </PropTable>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="Default" note="services + blurb + distance">
            <div style={{ width: "100%", maxWidth: 400 }}>
              <CardExploreResult
                provider={{
                  id: "sg-1",
                  name: "Karolína Nová",
                  district: "Praha 6",
                  neighborhood: "Dejvice",
                  rating: 4.9,
                  reviewCount: 38,
                  priceFrom: 290,
                  priceUnit: "per_walk",
                  blurb: "Experienced with reactive dogs and large breeds. Daily updates with photos.",
                  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
                  services: ["walk_checkin", "inhome_sitting"],
                  distanceKm: 1.4,
                }}
              />
            </div>
          </Demo>
          <Demo label="Neighbourhood match + mutual connections">
            <div style={{ width: "100%", maxWidth: 400 }}>
              <CardExploreResult
                provider={{
                  id: "sg-2",
                  name: "Tomáš Marek",
                  district: "Praha 7",
                  neighborhood: "Holešovice",
                  rating: 4.7,
                  reviewCount: 12,
                  priceFrom: 450,
                  priceUnit: "per_night",
                  blurb: "Big garden, two resident dogs. Boarding only — calm environment.",
                  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                  services: ["boarding"],
                  neighbourhoodMatch: true,
                  mutualConnections: 3,
                }}
              />
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      <GroupSection group="forms" activeGroup={activeGroup}>
      {/* ── DatePicker ───────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">DatePicker · DateTrigger</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Two exports that work together. <code>DateTrigger</code> is the read-only button that shows
          the current value and fires <code>onClick</code> to open the picker.{" "}
          <code>DatePicker</code> renders inside a <code>ModalSheet</code> and handles the calendar.
          Supports <code>mode="single"</code> (one date) and <code>mode="range"</code> (start + end).
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="mode=&quot;single&quot;" note="Used for recurring anchor date">
            <div style={{ display: "grid", gap: 8, width: "100%" }}>
              <DateTrigger
                label="Select date"
                value={dateSingle}
                onClick={() => setSinglePickerOpen(true)}
              />
              <DatePicker
                mode="single"
                open={singlePickerOpen}
                onClose={() => setSinglePickerOpen(false)}
                value={dateSingle}
                onChange={(v) => { setDateSingle(v); setSinglePickerOpen(false); }}
                title="Select date"
              />
            </div>
          </Demo>
          <Demo label="mode=&quot;range&quot;" note="Used for one-off bookings">
            <div style={{ display: "grid", gap: 8, width: "100%" }}>
              <DateTrigger
                label="Select dates"
                value={dateRangeDemo}
                onClick={() => setRangePickerOpen(true)}
              />
              <DatePicker
                mode="range"
                open={rangePickerOpen}
                onClose={() => setRangePickerOpen(false)}
                value={dateRangeDemo}
                onChange={(v) => { setDateRangeDemo(v); setRangePickerOpen(false); }}
                title="Dates"
              />
            </div>
          </Demo>
        </div>
        <PropTable>
          <PropRow name="mode" type='"single" | "range"' />
          <PropRow name="open" type="boolean" />
          <PropRow name="onClose" type="() => void" />
          <PropRow name="value" type='string | null (single) · DateRange (range)' />
          <PropRow name="onChange" type="fn" />
          <PropRow name="title" type="string" note="ModalSheet header" />
        </PropTable>
      </section>

      {/* ── RecurringSchedulePicker ───────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">RecurringSchedulePicker</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Inline picker for a recurring walk schedule: days of the week + time window. Renders
          fully inline (no modal). Used inside <code>InquiryForm</code> when the user selects
          "Ongoing" booking type. Value is a <code>RecurringSchedule</code> object.
        </p>
        <Demo label="RecurringSchedulePicker" canvas="inset">
          <RecurringSchedulePicker value={schedule} onChange={setSchedule} />
        </Demo>
        <PropTable>
          <PropRow name="value" type="RecurringSchedule" note="{ days: DayOfWeek[], time: string, timeLabel: string }" />
          <PropRow name="onChange" type="(value: RecurringSchedule) => void" />
        </PropTable>
      </section>
      </GroupSection>

      <GroupSection group="overlays" activeGroup={activeGroup}>
      {/* ── BookingModal ─────────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">BookingModal</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          Full booking flow modal. Two steps: form (service selector, dates, message) → success
          confirmation. Wraps <code>ModalSheet</code> and <code>DatePicker</code> internally.
          Opened from the provider profile page via "Book [Name]" button.
        </p>
        <Demo label="BookingModal" note="Click to open">
          <button
            className="btn btn-primary btn-cta btn-md"
            onClick={() => setBookingModalOpen(true)}
          >
            Open BookingModal
          </button>
          <BookingModal
            open={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            provider={DEMO_PROVIDER}
            services={DEMO_SERVICES}
            defaultService="walk_checkin"
          />
        </Demo>
        <PropTable>
          <PropRow name="open" type="boolean" />
          <PropRow name="onClose" type="() => void" />
          <PropRow name="provider" type="ProviderCard" />
          <PropRow name="services" type="ProviderServiceOffering[]" note="Full offerings for service picker + pricing" />
          <PropRow name="defaultService" type="ServiceType?" note="Pre-selects on open" />
        </PropTable>
      </section>
      </GroupSection>

      <GroupSection group="explore" activeGroup={activeGroup}>

      {/* ── FilterBody accordion ─────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">FilterBody · Accordion pattern</h2>
        <p className="sg-body-copy" style={{ maxWidth: "64ch" }}>
          <code>FilterBody</code> is the shared filter content rendered inside both{" "}
          <code>FilterPanelDesktop</code> and <code>FilterPanelMobile</code>. It contains an
          inline <code>Accordion</code> sub-component that groups sub-filter sections.
          The accordion uses CSS <code>max-height</code> transition — no library needed.
          Classes: <code>.filter-accordion</code>, <code>.filter-accordion-btn</code>,{" "}
          <code>.filter-accordion-body</code>.
        </p>
        <div className="sg-demo-group sg-demo-group--row">
          <Demo label="Accordion pattern" note="filter-accordion CSS pattern · click to toggle">
            <AccordionDemo />
          </Demo>
          <Demo label="FilterBody (walk_checkin)" note="Full filter body — live controlled" canvas="inset">
            <div style={{ height: 420, overflow: "auto", width: "100%" }}>
              <FilterBody
                filters={filterState}
                onMinRateChange={(v) => setFilterState((f) => ({ ...f, minRate: v }))}
                onMaxRateChange={(v) => setFilterState((f) => ({ ...f, maxRate: v }))}
                onTimeToggle={(v) => setFilterState((f) => ({
                  ...f,
                  times: f.times.includes(v) ? f.times.filter((t) => t !== v) : [...f.times, v],
                }))}
                onDateRangeChange={(r) => setFilterState((f) => ({ ...f, startDate: r.start, endDate: r.end }))}
                onStartDateChange={(iso) => setFilterState((f) => ({ ...f, startDate: iso }))}
                dualSlider={false}
              />
            </div>
          </Demo>
        </div>
      </section>
      </GroupSection>

      {/* ── Full Inventory ───────────────────────────────────────────────────── */}
      <section className="sg-section">
        <h2 className="sg-section-title">Full Component Inventory</h2>
        <p className="sg-body-copy">
          All components currently in the codebase. See{" "}
          <code>docs/component-inventory.md</code> for props, usage rules, and Figma alignment
          status. 🔶 = defined inline in a page file, not yet extracted.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {[
            "ButtonAction", "ButtonIcon", "InputField",
            "CheckboxRow (unified)", "Toggle",
            "MultiSelectSegmentBar", "Slider",
            "ModalSheet", "DatePicker + DateTrigger", "RecurringSchedulePicker",
            "NotificationsPanel", "BookingModal",
            "FormHeader", "FormFooter",
            "AppNav (guest / signup / logged)", "BottomNav",
            "CardExploreResult",
            "FilterPanelDesktop", "FilterPanelMobile",
            "FilterBody", "MapView (Leaflet)",
            "SignupProgressBar", "SignupProfilePreview",
            "HowItWorksTabs", "GuestLayout",
            "StatusBadge", "BookingRow 🔶",
            "InquiryForm 🔶", "InquiryChips 🔶", "BookingProposalCard 🔶",
          ].map((name) => (
            <div
              key={name}
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: name.includes("🔶") || name.includes("⚠") ? "var(--text-tertiary)" : "var(--text-secondary)",
                background: "var(--surface-top)",
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
