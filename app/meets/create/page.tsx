"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormHeader } from "@/components/layout/FormHeader";
import { FormFooter } from "@/components/layout/FormFooter";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  Info,
} from "@phosphor-icons/react";
import type {
  MeetType,
  LeashRule,
  DogSizeFilter,
  MeetEnergyLevel,
  WalkPace,
  WalkDistance,
  WalkTerrain,
  ParkAmenity,
  ParkVibe,
  PlaydateAgeRange,
  MeetPlayStyle,
  TrainingSkill,
  TrainingExperienceLevel,
  TrainerType,
} from "@/lib/types";
import {
  PACE_LABELS,
  DISTANCE_LABELS,
  TERRAIN_LABELS,
  AMENITY_LABELS,
  VIBE_LABELS,
  AGE_RANGE_LABELS,
  PLAY_STYLE_LABELS,
  SKILL_LABELS,
  EXPERIENCE_LABELS,
  TRAINER_TYPE_LABELS,
  ENERGY_LABELS,
} from "@/lib/mockMeets";

/* ── Constants ────────────────────────────────────────────────── */

const MEET_TYPES: { value: MeetType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "walk",
    label: "Walk",
    icon: <PersonSimpleWalk size={28} weight="light" />,
    description: "A structured route through a park or neighbourhood",
  },
  {
    value: "park_hangout",
    label: "Park Hangout",
    icon: <Tree size={28} weight="light" />,
    description: "Casual drop-in session at a local spot",
  },
  {
    value: "playdate",
    label: "Playdate",
    icon: <PawPrint size={28} weight="light" />,
    description: "Supervised play for dogs that need socialisation",
  },
  {
    value: "training",
    label: "Training",
    icon: <Target size={28} weight="light" />,
    description: "Practice recall, leash manners, or other skills",
  },
];

const LEASH_OPTIONS: { value: LeashRule; label: string }[] = [
  { value: "on_leash", label: "On leash" },
  { value: "off_leash", label: "Off leash" },
  { value: "mixed", label: "Mixed" },
];

const SIZE_OPTIONS: { value: DogSizeFilter; label: string }[] = [
  { value: "any", label: "All sizes" },
  { value: "small", label: "Small dogs only" },
  { value: "medium", label: "Medium dogs only" },
  { value: "large", label: "Large dogs only" },
];

const ENERGY_OPTIONS: { value: MeetEnergyLevel; label: string }[] = [
  { value: "any", label: "Any energy level" },
  { value: "calm", label: "Calm" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High energy" },
];

/* ── Reusable sub-components ──────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="form-section-label">{children}</p>;
}

function PillToggle({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: { value: string; label: string }[];
  selected: string | string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}) {
  const isSelected = (v: string) =>
    multi ? (selected as string[]).includes(v) : selected === v;

  return (
    <div className="flex flex-wrap gap-xs">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onToggle(o.value)}
          className="pill"
          style={{
            background: isSelected(o.value) ? "var(--brand-subtle)" : "var(--surface-top)",
            color: isSelected(o.value) ? "var(--brand-strong)" : "var(--text-secondary)",
            border: `1.5px solid ${isSelected(o.value) ? "var(--brand-main)" : "var(--border-regular)"}`,
            cursor: "pointer",
            fontWeight: isSelected(o.value) ? 600 : 400,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function CreateMeetPage() {
  const router = useRouter();

  // ── Core fields ──
  const [type, setType] = useState<MeetType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [maxAttendees, setMaxAttendees] = useState("8");
  const [leashRule, setLeashRule] = useState<LeashRule>("mixed");
  const [dogSize, setDogSize] = useState<DogSizeFilter>("any");
  const [recurring, setRecurring] = useState(false);

  // ── Shared enhancement fields ──
  const [energyLevel, setEnergyLevel] = useState<MeetEnergyLevel>("any");
  const [whatToBring, setWhatToBring] = useState("");
  const [accessibilityNotes, setAccessibilityNotes] = useState("");

  // ── Walk fields ──
  const [walkPace, setWalkPace] = useState<WalkPace>("moderate");
  const [walkDistance, setWalkDistance] = useState<WalkDistance>("medium");
  const [walkTerrain, setWalkTerrain] = useState<WalkTerrain>("mixed");
  const [routeNotes, setRouteNotes] = useState("");

  // ── Park Hangout fields ──
  const [dropIn, setDropIn] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [amenities, setAmenities] = useState<ParkAmenity[]>([]);
  const [vibe, setVibe] = useState<ParkVibe>("casual");

  // ── Playdate fields ──
  const [ageRange, setAgeRange] = useState<PlaydateAgeRange>("any");
  const [playStyle, setPlayStyle] = useState<MeetPlayStyle>("mixed");
  const [fencedArea, setFencedArea] = useState(false);
  const [maxDogsPerPerson, setMaxDogsPerPerson] = useState("2");

  // ── Training fields ──
  const [skillFocus, setSkillFocus] = useState<TrainingSkill[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<TrainingExperienceLevel>("all_levels");
  const [ledBy, setLedBy] = useState<TrainerType>("peer");
  const [trainerName, setTrainerName] = useState("");
  const [equipmentNeeded, setEquipmentNeeded] = useState("");

  const canCreate = type && title.trim() && location.trim() && date && time;

  function toggleAmenity(a: string) {
    setAmenities((prev) =>
      prev.includes(a as ParkAmenity)
        ? prev.filter((x) => x !== a)
        : [...prev, a as ParkAmenity]
    );
  }

  function toggleSkill(s: string) {
    setSkillFocus((prev) =>
      prev.includes(s as TrainingSkill)
        ? prev.filter((x) => x !== s)
        : [...prev, s as TrainingSkill]
    );
  }

  return (
    <main className="page-shell page-shell--flat">
      <div className="form-shell form-shell--flat">
        <FormHeader
          title="Create a Meet"
          subtitle="Organise a walk, hangout, playdate, or training session for your neighbourhood."
        />
        <section className="form-body">
          {/* ── Meet type selection ── */}
          <div className="flex flex-col gap-sm">
            <SectionLabel>What kind of meet?</SectionLabel>
            <div className="flex flex-col gap-sm">
              {MEET_TYPES.map((mt) => {
                const isSelected = type === mt.value;
                return (
                  <button
                    key={mt.value}
                    type="button"
                    onClick={() => setType(mt.value)}
                    className="flex items-start gap-md rounded-panel p-md text-left"
                    style={{
                      background: isSelected ? "var(--brand-subtle)" : "var(--surface-top)",
                      border: `2px solid ${isSelected ? "var(--brand-main)" : "var(--border-regular)"}`,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="shrink-0 mt-xs"
                      style={{ color: isSelected ? "var(--brand-main)" : "var(--text-tertiary)" }}
                    >
                      {mt.icon}
                    </span>
                    <div className="flex flex-col gap-xs">
                      <span
                        className="font-semibold text-md"
                        style={{ color: isSelected ? "var(--brand-main)" : "var(--text-primary)" }}
                      >
                        {mt.label}
                      </span>
                      <span className="text-sm text-fg-secondary">{mt.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-section-divider" />

          {/* ── Details ── */}
          <div className="flex flex-col gap-md">
            <InputField
              id="meet-title"
              label="Title"
              required
              value={title}
              onChange={setTitle}
              placeholder="e.g. Morning walk — Riegrovy sady"
            />

            <div className="input-block">
              <label className="label" htmlFor="meet-description">
                <span className="label-primary-group">
                  <span>Description</span>
                  <span className="label-secondary">(Optional)</span>
                </span>
              </label>
              <textarea
                id="meet-description"
                className="textarea"
                placeholder="Tell people what to expect — route, pace, vibe"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <InputField
              id="meet-location"
              label="Location"
              required
              value={location}
              onChange={setLocation}
              placeholder="e.g. Riegrovy sady, Prague 2"
            />
          </div>

          {/* ── Type-specific fields (conditional) ── */}
          {type && (
            <>
              <div className="form-section-divider" />
              {type === "walk" && <WalkSection
                pace={walkPace} setPace={setWalkPace}
                distance={walkDistance} setDistance={setWalkDistance}
                terrain={walkTerrain} setTerrain={setWalkTerrain}
                routeNotes={routeNotes} setRouteNotes={setRouteNotes}
              />}
              {type === "park_hangout" && <ParkHangoutSection
                dropIn={dropIn} setDropIn={setDropIn}
                endTime={endTime} setEndTime={setEndTime}
                amenities={amenities} toggleAmenity={toggleAmenity}
                vibe={vibe} setVibe={setVibe}
              />}
              {type === "playdate" && <PlaydateSection
                ageRange={ageRange} setAgeRange={setAgeRange}
                playStyle={playStyle} setPlayStyle={setPlayStyle}
                fencedArea={fencedArea} setFencedArea={setFencedArea}
                maxDogsPerPerson={maxDogsPerPerson} setMaxDogsPerPerson={setMaxDogsPerPerson}
              />}
              {type === "training" && <TrainingSection
                skillFocus={skillFocus} toggleSkill={toggleSkill}
                experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}
                ledBy={ledBy} setLedBy={setLedBy}
                trainerName={trainerName} setTrainerName={setTrainerName}
                equipmentNeeded={equipmentNeeded} setEquipmentNeeded={setEquipmentNeeded}
              />}
            </>
          )}

          <div className="form-section-divider" />

          {/* ── Date & time ── */}
          <div className="flex flex-col gap-md">
            <SectionLabel>When</SectionLabel>
            <div className="two-col">
              <div className="input-block">
                <label className="label" htmlFor="meet-date">
                  <span className="label-primary-group">
                    <span>Date</span>
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="meet-date"
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label className="label" htmlFor="meet-time">
                  <span className="label-primary-group">
                    <span>{type === "park_hangout" && dropIn ? "Start time" : "Time"}</span>
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="meet-time"
                  type="time"
                  className="input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="two-col">
              <div className="input-block">
                <label className="label" htmlFor="meet-duration">
                  <span className="label-primary-group">
                    <span>Duration (minutes)</span>
                  </span>
                </label>
                <select
                  id="meet-duration"
                  className="input select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="input-block">
                <label className="label" htmlFor="meet-max">
                  <span className="label-primary-group">
                    <span>Max attendees</span>
                  </span>
                </label>
                <select
                  id="meet-max"
                  className="input select"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                >
                  {[3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                    <option key={n} value={String(n)}>
                      {n} people
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <CheckboxRow
              id="meet-recurring"
              label="Repeat weekly on the same day"
              checked={recurring}
              onChange={setRecurring}
            />
          </div>

          <div className="form-section-divider" />

          {/* ── Rules & preferences ── */}
          <div className="flex flex-col gap-md">
            <SectionLabel>Rules & preferences</SectionLabel>
            <div className="two-col">
              <div className="input-block">
                <label className="label" htmlFor="meet-leash">
                  <span className="label-primary-group">
                    <span>Leash policy</span>
                  </span>
                </label>
                <select
                  id="meet-leash"
                  className="input select"
                  value={leashRule}
                  onChange={(e) => setLeashRule(e.target.value as LeashRule)}
                >
                  {LEASH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-block">
                <label className="label" htmlFor="meet-size">
                  <span className="label-primary-group">
                    <span>Dog size</span>
                  </span>
                </label>
                <select
                  id="meet-size"
                  className="input select"
                  value={dogSize}
                  onChange={(e) => setDogSize(e.target.value as DogSizeFilter)}
                >
                  {SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-block">
              <label className="label" htmlFor="meet-energy">
                <span className="label-primary-group">
                  <span>Energy level</span>
                </span>
              </label>
              <select
                id="meet-energy"
                className="input select"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as MeetEnergyLevel)}
              >
                {ENERGY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              id="meet-bring"
              label="What to bring"
              secondaryLabel="(comma-separated)"
              value={whatToBring}
              onChange={setWhatToBring}
              placeholder="e.g. Water bottle, Treats, Long lead"
            />

            <InputField
              id="meet-accessibility"
              label="Accessibility notes"
              secondaryLabel="(Optional)"
              value={accessibilityNotes}
              onChange={setAccessibilityNotes}
              placeholder="e.g. Paved paths, stroller-friendly, some steep sections"
            />
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/activity")}
          onContinue={() => {
            // Demo: just navigate to meets page as if created
            router.push("/activity");
          }}
          disableContinue={!canCreate}
          continueLabel="Create Meet"
        />
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Type-specific form sections
   ═══════════════════════════════════════════════════════════════ */

function WalkSection({
  pace, setPace, distance, setDistance, terrain, setTerrain, routeNotes, setRouteNotes,
}: {
  pace: WalkPace; setPace: (v: WalkPace) => void;
  distance: WalkDistance; setDistance: (v: WalkDistance) => void;
  terrain: WalkTerrain; setTerrain: (v: WalkTerrain) => void;
  routeNotes: string; setRouteNotes: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <SectionLabel>Walk details</SectionLabel>
      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Pace</span>
        <PillToggle
          options={Object.entries(PACE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={pace}
          onToggle={(v) => setPace(v as WalkPace)}
        />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Distance</span>
        <PillToggle
          options={Object.entries(DISTANCE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={distance}
          onToggle={(v) => setDistance(v as WalkDistance)}
        />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Terrain</span>
        <PillToggle
          options={Object.entries(TERRAIN_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={terrain}
          onToggle={(v) => setTerrain(v as WalkTerrain)}
        />
      </div>
      <div className="input-block">
        <label className="label" htmlFor="walk-route">
          <span className="label-primary-group">
            <span>Route notes</span>
            <span className="label-secondary">(Optional)</span>
          </span>
        </label>
        <textarea
          id="walk-route"
          className="textarea"
          placeholder="Where to meet, which way you go, landmarks along the way"
          value={routeNotes}
          onChange={(e) => setRouteNotes(e.target.value)}
        />
      </div>
    </div>
  );
}

function ParkHangoutSection({
  dropIn, setDropIn, endTime, setEndTime,
  amenities, toggleAmenity, vibe, setVibe,
}: {
  dropIn: boolean; setDropIn: (v: boolean) => void;
  endTime: string; setEndTime: (v: string) => void;
  amenities: string[]; toggleAmenity: (v: string) => void;
  vibe: ParkVibe; setVibe: (v: ParkVibe) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <SectionLabel>Hangout details</SectionLabel>

      <CheckboxRow
        id="park-dropin"
        label="This is a drop-in window (come anytime)"
        checked={dropIn}
        onChange={setDropIn}
      />

      {dropIn && (
        <div className="input-block" style={{ maxWidth: 200 }}>
          <label className="label" htmlFor="park-endtime">
            <span className="label-primary-group">
              <span>Window ends at</span>
            </span>
          </label>
          <input
            id="park-endtime"
            type="time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      )}

      {dropIn && (
        <div className="flex items-start gap-xs rounded-panel p-sm bg-brand-subtle">
          <Info size={16} weight="light" className="text-brand-main shrink-0 mt-xs" />
          <span className="text-xs text-brand-strong">
            People can show up anytime during the window — no fixed start time.
          </span>
        </div>
      )}

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Vibe</span>
        <PillToggle
          options={Object.entries(VIBE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={vibe}
          onToggle={(v) => setVibe(v as ParkVibe)}
        />
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Amenities at the spot</span>
        <PillToggle
          options={Object.entries(AMENITY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={amenities}
          onToggle={toggleAmenity}
          multi
        />
      </div>
    </div>
  );
}

function PlaydateSection({
  ageRange, setAgeRange, playStyle, setPlayStyle,
  fencedArea, setFencedArea, maxDogsPerPerson, setMaxDogsPerPerson,
}: {
  ageRange: PlaydateAgeRange; setAgeRange: (v: PlaydateAgeRange) => void;
  playStyle: MeetPlayStyle; setPlayStyle: (v: MeetPlayStyle) => void;
  fencedArea: boolean; setFencedArea: (v: boolean) => void;
  maxDogsPerPerson: string; setMaxDogsPerPerson: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <SectionLabel>Playdate details</SectionLabel>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Dog age range</span>
        <PillToggle
          options={Object.entries(AGE_RANGE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={ageRange}
          onToggle={(v) => setAgeRange(v as PlaydateAgeRange)}
        />
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Play style</span>
        <PillToggle
          options={Object.entries(PLAY_STYLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={playStyle}
          onToggle={(v) => setPlayStyle(v as MeetPlayStyle)}
        />
      </div>

      <CheckboxRow
        id="playdate-fenced"
        label="Fenced area (dogs can be off-leash safely)"
        checked={fencedArea}
        onChange={setFencedArea}
      />

      <div className="input-block" style={{ maxWidth: 200 }}>
        <label className="label" htmlFor="playdate-max-dogs">
          <span className="label-primary-group">
            <span>Max dogs per person</span>
          </span>
        </label>
        <select
          id="playdate-max-dogs"
          className="input select"
          value={maxDogsPerPerson}
          onChange={(e) => setMaxDogsPerPerson(e.target.value)}
        >
          <option value="1">1 dog</option>
          <option value="2">2 dogs</option>
          <option value="0">No limit</option>
        </select>
      </div>
    </div>
  );
}

function TrainingSection({
  skillFocus, toggleSkill, experienceLevel, setExperienceLevel,
  ledBy, setLedBy, trainerName, setTrainerName,
  equipmentNeeded, setEquipmentNeeded,
}: {
  skillFocus: TrainingSkill[]; toggleSkill: (v: string) => void;
  experienceLevel: TrainingExperienceLevel; setExperienceLevel: (v: TrainingExperienceLevel) => void;
  ledBy: TrainerType; setLedBy: (v: TrainerType) => void;
  trainerName: string; setTrainerName: (v: string) => void;
  equipmentNeeded: string; setEquipmentNeeded: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <SectionLabel>Training details</SectionLabel>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Skill focus (select all that apply)</span>
        <PillToggle
          options={Object.entries(SKILL_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={skillFocus}
          onToggle={toggleSkill}
          multi
        />
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Experience level</span>
        <PillToggle
          options={Object.entries(EXPERIENCE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={experienceLevel}
          onToggle={(v) => setExperienceLevel(v as TrainingExperienceLevel)}
        />
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-sm font-medium text-fg-primary">Led by</span>
        <PillToggle
          options={Object.entries(TRAINER_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          selected={ledBy}
          onToggle={(v) => setLedBy(v as TrainerType)}
        />
      </div>

      {ledBy === "professional" && (
        <InputField
          id="training-trainer"
          label="Trainer name"
          secondaryLabel="(Optional)"
          value={trainerName}
          onChange={setTrainerName}
          placeholder="e.g. Kateřina Nováková"
        />
      )}

      <InputField
        id="training-equipment"
        label="Equipment needed"
        secondaryLabel="(comma-separated)"
        value={equipmentNeeded}
        onChange={setEquipmentNeeded}
        placeholder="e.g. High-value treats, Long lead, Clicker"
      />
    </div>
  );
}
