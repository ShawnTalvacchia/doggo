"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { useMeetComposer } from "@/contexts/MeetComposerContext";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { ButtonAction } from "@/components/ui/ButtonAction";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  Globe,
  UsersThree,
  Lock,
  Camera,
  UploadSimple,
  X,
  CaretDown,
  ShareNetwork,
  Check,
} from "@phosphor-icons/react";
import type {
  MeetType,
  MeetVisibility,
  LeashRule,
  DogSizeFilter,
  MeetEnergyLevel,
  WalkPace,
  WalkDistance,
  WalkTerrain,
  ParkAmenity,
  PlaydateAgeRange,
  MeetPlayStyle,
  TrainingSkill,
  TrainingExperienceLevel,
  TrainerType,
  Group,
  GroupType,
} from "@/lib/types";
import {
  PACE_LABELS,
  DISTANCE_LABELS,
  TERRAIN_LABELS,
  AMENITY_LABELS,
  AGE_RANGE_LABELS,
  PLAY_STYLE_LABELS,
  SKILL_LABELS,
  EXPERIENCE_LABELS,
  TRAINER_TYPE_LABELS,
} from "@/lib/mockMeets";
import { getGroupsUserCanPostMeetsIn, getGroupById } from "@/lib/mockGroups";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { PillToggle } from "@/components/ui/PillToggle";

/* ── Constants ────────────────────────────────────────────────── */

const MEET_TYPES: { value: MeetType; label: string; icon: React.ReactNode }[] = [
  { value: "walk", label: "Walk", icon: <PersonSimpleWalk size={20} weight="light" /> },
  { value: "park_hangout", label: "Park hangout", icon: <Tree size={20} weight="light" /> },
  { value: "playdate", label: "Playdate", icon: <PawPrint size={20} weight="light" /> },
  { value: "training", label: "Training", icon: <Target size={20} weight="light" /> },
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

/** Ordered group-type labels for the group picker <optgroup>s */
const GROUP_TYPE_ORDER: GroupType[] = ["park", "neighbor", "interest", "care"];
const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  park: "Parks",
  neighbor: "Neighborhoods",
  interest: "Interest groups",
  care: "Care groups",
};

/** Meet cadence — always visible in the When section as a single dropdown.
 *  `one_off` is the default; anything else makes the meet recurring and
 *  reveals the optional End date field below. Form-only today — not persisted.
 */
type Cadence = "one_off" | "weekly" | "biweekly" | "monthly";

const CADENCE_OPTIONS: { value: Cadence; label: string }[] = [
  { value: "one_off", label: "One off" },
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Every month" },
];

/** Stock cover photos shown as one-tap fallbacks once a meet type is picked. */
const COVER_FALLBACKS: Record<MeetType, string[]> = {
  walk: [
    "/images/generated/group-walk-stromovka.jpeg",
    "/images/generated/evening-walk-group.jpeg",
    "/images/generated/spot-park-walk.jpeg",
    "/images/generated/community-cover-vinohrady.jpeg",
  ],
  park_hangout: [
    "/images/generated/park-hangout-riegrovy.jpeg",
    "/images/generated/community-cover-stromovka.jpeg",
    "/images/generated/meet-greeting.jpeg",
    "/images/generated/community-cover-letna.jpeg",
  ],
  playdate: [
    "/images/generated/playdate-small-group.jpeg",
    "/images/generated/puppy-socialization.jpeg",
    "/images/generated/goldie-playing.jpeg",
    "/images/generated/community-cover-puppy-owners.jpeg",
  ],
  training: [
    "/images/generated/training-session.jpeg",
    "/images/generated/community-cover-training.jpeg",
    "/images/generated/community-cover-reactive.jpeg",
    "/images/generated/spot-park-walk.jpeg",
  ],
};

/* ── Reusable sub-components ──────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="form-section-label">{children}</p>;
}

/** Button that collapses / expands a progressive-disclosure section. */
function ExpanderToggle({
  open,
  openLabel,
  closedLabel,
  onToggle,
  ariaControls,
}: {
  open: boolean;
  openLabel: string;
  closedLabel: string;
  onToggle: () => void;
  ariaControls: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={ariaControls}
      className="flex items-center justify-between w-full py-sm px-md rounded-panel bg-surface-inset border border-edge-regular text-sm font-semibold text-fg-primary cursor-pointer"
    >
      <span>{open ? openLabel : closedLabel}</span>
      <CaretDown
        size={16}
        weight="bold"
        className="text-fg-tertiary"
        style={{
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 150ms ease",
        }}
      />
    </button>
  );
}

/* ── Main composer (mounted once at app-layout level) ── */

export function MeetComposer() {
  const { isOpen, preselectedGroupId, closeComposer } = useMeetComposer();
  const currentUserId = useCurrentUserId();

  // ── Group + visibility (new — the parent container for every meet) ──
  const userGroups = useMemo(
    () => getGroupsUserCanPostMeetsIn(currentUserId),
    [currentUserId]
  );
  const [groupId, setGroupId] = useState<string | null>(null);

  // Sync preselected group from the context exactly once per open cycle.
  // Using a ref prevents re-firing if the user changes the group mid-flow.
  const hasSetPreselected = useRef(false);
  useEffect(() => {
    if (isOpen && preselectedGroupId && !hasSetPreselected.current) {
      if (userGroups.some((g) => g.id === preselectedGroupId)) {
        setGroupId(preselectedGroupId);
      }
      hasSetPreselected.current = true;
    }
    if (!isOpen) hasSetPreselected.current = false;
  }, [isOpen, preselectedGroupId, userGroups]);
  const selectedGroup = groupId ? getGroupById(groupId) ?? null : null;
  const [visibility, setVisibility] = useState<MeetVisibility>("public");

  // Keep visibility aligned with the selected group's rules.
  // Private/approval groups force "group_only"; open groups default to "public" on first select.
  useEffect(() => {
    if (!selectedGroup) return;
    if (selectedGroup.visibility !== "open" && visibility !== "group_only") {
      setVisibility("group_only");
    }
  }, [selectedGroup, visibility]);

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
  const [cadence, setCadence] = useState<Cadence>("one_off");
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const isRecurring = cadence !== "one_off";

  // ── Shared enhancement fields ──
  const [energyLevel, setEnergyLevel] = useState<MeetEnergyLevel>("any");
  const [whatToBring, setWhatToBring] = useState("");
  const [accessibilityNotes, setAccessibilityNotes] = useState("");

  // ── Walk fields ──
  const [walkPace, setWalkPace] = useState<WalkPace>("moderate");
  const [walkDistance, setWalkDistance] = useState<WalkDistance>("medium");
  const [walkTerrain, setWalkTerrain] = useState<WalkTerrain>("mixed");

  // ── Park Hangout fields ──
  // Park hangouts are casual drop-in windows by definition — `dropIn` and
  // `vibe` state removed 2026-04-25 (always true / always "casual" in the
  // output shape if we eventually persist a Meet here).
  const [endTime, setEndTime] = useState("");
  const [amenities, setAmenities] = useState<ParkAmenity[]>([]);

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

  // ── Cover photo ──
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string>("");

  // ── UI state ──
  // Progressive disclosure — most meets only need the essentials. Two separate
  // expanders split the "nice to have" fields:
  //   - showDetails → description, cover photo, duration, recurring
  //     (narrative + visual + cadence — "what's this meet about")
  //   - showRules → leash, dog size, energy, max attendees, bring, accessibility
  //     (constraints + guidance for attendees — "who should come")
  // Both closed by default so the sheet fits a single mobile scroll.
  const [showDetails, setShowDetails] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // ── Submission / success state ──
  const [created, setCreated] = useState(false);

  const canCreate =
    groupId &&
    type &&
    title.trim() &&
    location.trim() &&
    date &&
    time;

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

  function handleCreate() {
    setCreated(true);
  }

  function resetForm({ keepGroup = true }: { keepGroup?: boolean } = {}) {
    setCreated(false);
    setShowDetails(false);
    setShowRules(false);
    // Keep the group + visibility selected by default — a common case is posting
    // several meets to the same group in a session. Pass keepGroup=false on full close.
    if (!keepGroup) {
      setGroupId(null);
      setVisibility("public");
    }
    setType(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setDate("");
    setTime("");
    setDuration("60");
    setMaxAttendees("8");
    setLeashRule("mixed");
    setDogSize("any");
    setCadence("one_off");
    setRecurringEndDate("");
    setEnergyLevel("any");
    setWhatToBring("");
    setAccessibilityNotes("");
    setCoverPhotoUrl("");
    // Type-specific resets
    setWalkPace("moderate");
    setWalkDistance("medium");
    setWalkTerrain("mixed");
    setEndTime("");
    setAmenities([]);
    setAgeRange("any");
    setPlayStyle("mixed");
    setFencedArea(false);
    setMaxDogsPerPerson("2");
    setSkillFocus([]);
    setExperienceLevel("all_levels");
    setLedBy("peer");
    setTrainerName("");
    setEquipmentNeeded("");
  }

  // Full close — dismiss the sheet and reset every field.
  // Used by both the sheet's X/overlay-click and the Cancel button.
  // Declared after resetForm so the lint rule for access-before-declaration is satisfied.
  const handleClose = useCallback(() => {
    closeComposer();
    resetForm({ keepGroup: false });
  }, [closeComposer]);

  const footer = created ? undefined : (
    <div className="flex items-center justify-between w-full gap-sm">
      <ButtonAction variant="tertiary" size="md" onClick={handleClose}>
        Cancel
      </ButtonAction>
      <ButtonAction
        variant="primary"
        size="md"
        cta
        onClick={handleCreate}
        disabled={!canCreate}
      >
        Create meet
      </ButtonAction>
    </div>
  );

  return (
    <ModalSheet
      open={isOpen}
      onClose={handleClose}
      title={created ? "Your meet is live" : "Create a meet"}
      footer={footer}
    >
      {created ? (
        <CreatedSuccessView
          title={title}
          type={type}
          coverPhotoUrl={coverPhotoUrl}
          date={date}
          time={time}
          location={location}
          visibility={visibility}
          selectedGroup={selectedGroup}
          onCreateAnother={() => resetForm({ keepGroup: true })}
          onDone={handleClose}
        />
      ) : (
        <div className="flex flex-col gap-lg meet-composer-body p-lg">
          {/* ── Group + visibility ── */}
          <GroupVisibilitySection
            userGroups={userGroups}
            groupId={groupId}
            preselectedGroupId={preselectedGroupId ?? null}
            onGroupIdChange={setGroupId}
            selectedGroup={selectedGroup}
            visibility={visibility}
            onVisibilityChange={setVisibility}
          />

          {userGroups.length > 0 && <div className="form-section-divider" />}

          {/* ── Meet type selection — compact 2×2 grid ── */}
          <div className="flex flex-col gap-sm">
            <SectionLabel>What kind of meet?</SectionLabel>
            <div className="grid grid-cols-2 gap-sm" role="radiogroup">
              {MEET_TYPES.map((mt) => {
                const isSelected = type === mt.value;
                return (
                  <button
                    key={mt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setType(mt.value)}
                    className={`flex items-center gap-sm rounded-panel p-sm text-left cursor-pointer border-2 ${
                      isSelected
                        ? "bg-brand-subtle border-brand-main"
                        : "bg-surface-top border-edge-regular"
                    }`}
                  >
                    <span className={isSelected ? "text-brand-main" : "text-fg-tertiary"}>
                      {mt.icon}
                    </span>
                    <span
                      className={`font-semibold text-sm ${
                        isSelected ? "text-brand-main" : "text-fg-primary"
                      }`}
                    >
                      {mt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-section-divider" />

          {/* ── Essentials: title + location ── */}
          <div className="flex flex-col gap-md">
            <InputField
              id="meet-title"
              label="Title"
              required
              value={title}
              onChange={setTitle}
              placeholder="e.g. Morning walk — Riegrovy sady"
            />

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
              />}
              {type === "park_hangout" && <ParkHangoutSection
                endTime={endTime} setEndTime={setEndTime}
                amenities={amenities} toggleAmenity={toggleAmenity}
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

          {/* ── Essentials: When ──
              2×2 grid (Date | Cadence / Time | Duration) + a conditional
              End date row below. Recurring cadence is always visible via the
              Cadence dropdown — "One off" is the default; anything else
              reveals the End date field. */}
          <div className="flex flex-col gap-md">
            <SectionLabel>When</SectionLabel>

            {/* Row 1: Date | Cadence.
                `grid gap-md md:grid-cols-2` keeps the mobile vertical gap
                identical to the parent's `gap-md` so stacking feels even;
                on desktop it promotes to a 2-col row. Same pattern used for
                Row 2 below — avoids the `.two-col` class which hardcodes a
                24px gap that over-stacks vertical rhythm on mobile. */}
            <div className="grid gap-md md:grid-cols-2">
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
                <label className="label" htmlFor="meet-cadence">
                  <span className="label-primary-group">
                    <span>Cadence</span>
                  </span>
                </label>
                <select
                  id="meet-cadence"
                  className="input select"
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value as Cadence)}
                >
                  {CADENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Time | Duration */}
            <div className="grid gap-md md:grid-cols-2">
              <div className="input-block">
                <label className="label" htmlFor="meet-time">
                  <span className="label-primary-group">
                    <span>{type === "park_hangout" ? "Start time" : "Time"}</span>
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="meet-time"
                  type="time"
                  step={900}
                  className="input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label className="label" htmlFor="meet-duration">
                  <span className="label-primary-group">
                    <span>Duration</span>
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
            </div>

            {/* Conditional: End date + series preview when recurring */}
            {isRecurring && (
              <>
                <div className="input-block">
                  <label className="label" htmlFor="meet-end-date">
                    <span className="label-primary-group">
                      <span>Ends on</span>
                      <span className="label-secondary">(Optional)</span>
                    </span>
                  </label>
                  <input
                    id="meet-end-date"
                    type="date"
                    className="input"
                    value={recurringEndDate}
                    min={date || undefined}
                    onChange={(e) => setRecurringEndDate(e.target.value)}
                  />
                </div>
                <p className="text-sm text-fg-secondary m-0">
                  {buildSeriesPreview({ date, time, cadence, endDate: recurringEndDate }) ??
                    "Pick a date and time above to preview the series."}
                </p>
              </>
            )}
          </div>

          {/* ── "Add details" expander — description + cover photo ── */}
          <ExpanderToggle
            open={showDetails}
            openLabel="Hide details"
            closedLabel="Add details"
            onToggle={() => setShowDetails((v) => !v)}
            ariaControls="meet-details-section"
          />

          {showDetails && (
            <div id="meet-details-section" className="flex flex-col gap-lg">
              {/* ── Description ── */}
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

              <div className="form-section-divider" />

              {/* ── Cover photo ── */}
              <CoverPhotoSection
                meetType={type}
                coverPhotoUrl={coverPhotoUrl}
                onChange={setCoverPhotoUrl}
              />
            </div>
          )}

          {/* ── "Rules & preferences" expander — filters + guidance for attendees ── */}
          <ExpanderToggle
            open={showRules}
            openLabel="Hide rules & preferences"
            closedLabel="Rules & preferences"
            onToggle={() => setShowRules((v) => !v)}
            ariaControls="meet-rules-section"
          />

          {showRules && (
            <div id="meet-rules-section" className="flex flex-col gap-md">
              <div className="grid gap-md md:grid-cols-2">
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

              <div className="grid gap-md md:grid-cols-2">
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
          )}
        </div>
      )}
    </ModalSheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Type-specific form sections
   ═══════════════════════════════════════════════════════════════ */

function WalkSection({
  pace, setPace, distance, setDistance, terrain, setTerrain,
}: {
  pace: WalkPace; setPace: (v: WalkPace) => void;
  distance: WalkDistance; setDistance: (v: WalkDistance) => void;
  terrain: WalkTerrain; setTerrain: (v: WalkTerrain) => void;
}) {
  // Route-notes field removed 2026-04-25 — it duplicated the universal
  // Description field in "Add details." Walks describe their route through
  // Description; this section stays focused on the structured pace/distance/
  // terrain pills.
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
    </div>
  );
}

function ParkHangoutSection({
  endTime, setEndTime,
  amenities, toggleAmenity,
}: {
  endTime: string; setEndTime: (v: string) => void;
  amenities: string[]; toggleAmenity: (v: string) => void;
}) {
  // Park Hangout is a casual drop-in window by definition (an "organised
  // meetup" is really a Walk or Playdate). Dropped the drop-in checkbox and
  // the Vibe selector as redundant — see walkthrough discussion 2026-04-25.
  return (
    <div className="flex flex-col gap-md">
      <SectionLabel>Hangout details</SectionLabel>

      <p className="text-sm text-fg-secondary m-0">
        A park hangout is a drop-in window — people show up anytime between the
        start and end time, no fixed arrival.
      </p>

      <div className="input-block" style={{ maxWidth: 200 }}>
        <label className="label" htmlFor="park-endtime">
          <span className="label-primary-group">
            <span>Ends at</span>
          </span>
        </label>
        <input
          id="park-endtime"
          type="time"
          step={900}
          className="input"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
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

/* ═══════════════════════════════════════════════════════════════
   Group + visibility section
   Every meet belongs to a group. The parent group's visibility
   constrains per-meet visibility: only open groups allow "public".
   ═══════════════════════════════════════════════════════════════ */

function GroupVisibilitySection({
  userGroups,
  groupId,
  preselectedGroupId,
  onGroupIdChange,
  selectedGroup,
  visibility,
  onVisibilityChange,
}: {
  userGroups: Group[];
  groupId: string | null;
  /** Set when the composer was launched from a group context — that group gets locked by default. */
  preselectedGroupId: string | null;
  onGroupIdChange: (id: string | null) => void;
  selectedGroup: Group | null;
  visibility: MeetVisibility;
  onVisibilityChange: (v: MeetVisibility) => void;
}) {
  // Group the user's groups by type, preserving the canonical order.
  const groupsByType = useMemo(() => {
    const map: Record<GroupType, Group[]> = { park: [], neighbor: [], interest: [], care: [] };
    for (const g of userGroups) map[g.groupType].push(g);
    return map;
  }, [userGroups]);

  // When the composer was launched from a group, lock the picker to that
  // group by default — the user said "post a meet HERE," not "let me shop."
  // Click "Change" to unlock and reveal the full picker. Unlock persists for
  // the life of this sheet (resets on close via unmount).
  const [userUnlockedPicker, setUserUnlockedPicker] = useState(false);
  const isLocked = Boolean(
    preselectedGroupId &&
    groupId === preselectedGroupId &&
    !userUnlockedPicker
  );

  if (userGroups.length === 0) {
    return (
      <div className="flex flex-col gap-sm">
        <SectionLabel>Where is this meet?</SectionLabel>
        <div className="flex flex-col gap-sm rounded-panel p-md bg-surface-inset border border-edge-regular">
          <p className="text-sm text-fg-primary font-medium">
            You need to join a group first
          </p>
          <p className="text-sm text-fg-secondary">
            Every meet belongs to a group — a park, neighborhood, interest, or care group. Join
            one or create your own, then come back to post a meet.
          </p>
          <div className="flex gap-xs mt-xs">
            <ButtonAction variant="primary" size="sm" href="/discover/groups">
              Browse groups
            </ButtonAction>
            <ButtonAction variant="secondary" size="sm" href="/communities/create">
              Create a group
            </ButtonAction>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <SectionLabel>Where is this meet?</SectionLabel>
        {!isLocked && (
          <p className="text-sm text-fg-secondary">
            Every meet belongs to a group. Choose which one this meet is for.
          </p>
        )}
      </div>

      {isLocked && selectedGroup ? (
        <div className="flex items-center justify-between gap-sm rounded-panel pl-md pr-sm py-sm bg-surface-inset border border-edge-regular">
          <div className="flex items-center gap-sm min-w-0">
            <UsersThree
              size={16}
              weight="light"
              className="shrink-0 text-fg-tertiary"
            />
            <div className="flex flex-col gap-xs min-w-0">
              <span className="text-xs text-fg-tertiary">Posting to</span>
              <span className="text-sm font-semibold text-fg-primary truncate">
                {selectedGroup.name}
                {selectedGroup.visibility !== "open" && (
                  <span className="text-xs font-normal text-fg-tertiary"> · private</span>
                )}
              </span>
            </div>
          </div>
          <ButtonAction
            variant="tertiary"
            size="sm"
            onClick={() => setUserUnlockedPicker(true)}
          >
            Change
          </ButtonAction>
        </div>
      ) : (
        <div className="input-block">
          <label className="label" htmlFor="meet-group">
            <span className="label-primary-group">
              <span>Group</span>
              <span className="required">*</span>
            </span>
          </label>
          <select
            id="meet-group"
            className="input select"
            value={groupId ?? ""}
            onChange={(e) => onGroupIdChange(e.target.value || null)}
          >
            <option value="" disabled>
              Choose a group…
            </option>
            {GROUP_TYPE_ORDER.map((gt) =>
              groupsByType[gt].length > 0 ? (
                <optgroup key={gt} label={GROUP_TYPE_LABELS[gt]}>
                  {groupsByType[gt].map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                      {g.visibility !== "open" ? " (private)" : ""}
                    </option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
        </div>
      )}

      {selectedGroup && (
        <VisibilityChoice
          group={selectedGroup}
          visibility={visibility}
          onChange={onVisibilityChange}
        />
      )}
    </div>
  );
}

/**
 * Visibility control for a meet. If the parent group is open, the user can
 * choose between public (anyone) and group_only (members only). If the parent
 * group is approval/private, meets are forced to group_only and the control
 * renders as a locked notice.
 */
function VisibilityChoice({
  group,
  visibility,
  onChange,
}: {
  group: Group;
  visibility: MeetVisibility;
  onChange: (v: MeetVisibility) => void;
}) {
  const canBePublic = group.visibility === "open";

  if (!canBePublic) {
    return (
      <div className="flex flex-col gap-xs rounded-panel p-md bg-surface-inset border border-edge-regular">
        <div className="flex items-center gap-xs">
          <Lock size={16} weight="light" className="text-fg-tertiary shrink-0" />
          <span className="text-sm font-medium text-fg-primary">Group members only</span>
        </div>
        <p className="text-xs text-fg-secondary m-0">
          Only members of {group.name} can see this meet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      <span className="text-sm font-medium text-fg-primary">Who can see this meet?</span>
      <div className="grid grid-cols-2 gap-sm" role="radiogroup">
        <VisibilityOption
          icon={<Globe size={16} weight="light" />}
          label="Anyone"
          selected={visibility === "public"}
          onClick={() => onChange("public")}
        />
        <VisibilityOption
          icon={<UsersThree size={16} weight="light" />}
          label="Members only"
          selected={visibility === "group_only"}
          onClick={() => onChange("group_only")}
        />
      </div>
    </div>
  );
}

function VisibilityOption({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex items-center gap-sm rounded-panel p-sm text-left cursor-pointer border-2 ${
        selected ? "bg-brand-subtle border-brand-main" : "bg-surface-top border-edge-regular"
      }`}
    >
      <span className={`shrink-0 ${selected ? "text-brand-main" : "text-fg-tertiary"}`}>
        {icon}
      </span>
      <span
        className={`font-semibold text-sm ${selected ? "text-brand-main" : "text-fg-primary"}`}
      >
        {label}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Cover photo section
   Upload a photo (mock, in-memory data URL) or pick a type-matched
   starter image. Fallbacks only appear once a meet type is chosen.
   ═══════════════════════════════════════════════════════════════ */

function CoverPhotoSection({
  meetType,
  coverPhotoUrl,
  onChange,
}: {
  meetType: MeetType | null;
  coverPhotoUrl: string;
  onChange: (url: string) => void;
}) {
  const fallbacks = meetType ? COVER_FALLBACKS[meetType] : [];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
    // Reset so selecting the same file twice still fires onChange
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <SectionLabel>Cover photo</SectionLabel>
        <p className="text-sm text-fg-secondary">
          {coverPhotoUrl
            ? "This will be the hero image on the meet card and detail page."
            : "Optional — add a hero image so your meet stands out in feeds."}
        </p>
      </div>

      {coverPhotoUrl ? (
        <div className="flex flex-col gap-sm">
          <div className="relative overflow-hidden rounded-panel bg-surface-inset aspect-video">
            <img
              src={coverPhotoUrl}
              alt="Meet cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove cover photo"
              className="absolute top-xs right-xs w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-white bg-[color:var(--transparent-dark-40)] hover:bg-[color:var(--transparent-dark-64)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <label className="flex items-center justify-center gap-xs rounded-panel p-sm text-sm font-medium cursor-pointer bg-surface-top border border-edge-regular text-fg-secondary">
            <Camera size={16} weight="light" />
            Change photo
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <label className="flex items-center justify-center gap-xs rounded-panel p-md text-sm font-medium cursor-pointer bg-surface-top border border-dashed border-edge-regular text-fg-secondary">
            <UploadSimple size={18} weight="light" />
            Upload a photo
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>

          {fallbacks.length > 0 ? (
            <div className="flex flex-col gap-xs">
              <span className="text-xs text-fg-tertiary">
                Or pick a starter image
              </span>
              <div className="grid grid-cols-4 gap-xs">
                {fallbacks.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => onChange(url)}
                    aria-label="Use this starter image"
                    className="relative overflow-hidden rounded-md cursor-pointer bg-surface-inset border border-edge-regular aspect-square"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-fg-tertiary">
              Pick a meet type above to see starter images.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Plain-English series preview for the When section. Returns null when we
 *  don't have enough info yet (no date/time, or one-off). */
function buildSeriesPreview({
  date,
  time,
  cadence,
  endDate,
}: {
  date: string;
  time: string;
  cadence: Cadence;
  endDate: string;
}): string | null {
  if (cadence === "one_off") return null;
  if (!date || !time) return null;
  const start = new Date(`${date}T${time}`);
  if (Number.isNaN(start.getTime())) return null;

  const weekday = start.toLocaleDateString(undefined, { weekday: "long" });
  const timeLabel = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const phrase =
    cadence === "weekly"
      ? `Every ${weekday}`
      : cadence === "biweekly"
      ? `Every other ${weekday}`
      : `Monthly on the first ${weekday}`;

  if (endDate) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime())) {
      const endLabel = end.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      return `${phrase} at ${timeLabel}, through ${endLabel}.`;
    }
  }
  return `${phrase} at ${timeLabel}, ongoing.`;
}

/* ═══════════════════════════════════════════════════════════════
   Created success view
   Shown after Create Meet is pressed. Summarises the new meet,
   offers share/invite actions, and lets the user post another.
   In the mock, no real meet is persisted — these actions are
   demo-quality and assume the parent group exists.
   ═══════════════════════════════════════════════════════════════ */

function CreatedSuccessView({
  title,
  type,
  coverPhotoUrl,
  date,
  time,
  location,
  visibility,
  selectedGroup,
  onCreateAnother,
  onDone,
}: {
  title: string;
  type: MeetType | null;
  coverPhotoUrl: string;
  date: string;
  time: string;
  location: string;
  visibility: MeetVisibility;
  selectedGroup: Group | null;
  onCreateAnother: () => void;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const typeLabel = type ? MEET_TYPES.find((t) => t.value === type)?.label ?? type : "Meet";

  const whenLabel = useMemo(() => {
    if (!date || !time) return "";
    const d = new Date(`${date}T${time}`);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) + " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }, [date, time]);

  const visibilityLabel =
    visibility === "public"
      ? "Visible to anyone browsing"
      : selectedGroup
      ? `Only members of ${selectedGroup.name} can see this`
      : "Members only";

  async function handleShare() {
    // Mock share URL — the meet doesn't exist yet in the prototype.
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/meets/new-${Date.now()}`
        : "/meets/new";
    const shareText = `${title || "A meet"}${selectedGroup ? ` — ${selectedGroup.name}` : ""}`;

    // Prefer the native share sheet on mobile. Fall back to clipboard + "Copied!" flash
    // on desktop / unsupported browsers.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: shareText, url });
        return;
      } catch {
        // User dismissed the share sheet, or share failed — fall through to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // noop
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className="flex flex-col p-xl"
      style={{ minHeight: "100%", gap: "var(--space-xl)" }}
    >
      {/* Meet preview card */}
      <div className="flex flex-col gap-sm rounded-panel overflow-hidden border border-edge-regular bg-surface-top">
        {coverPhotoUrl ? (
          <div className="relative overflow-hidden bg-surface-inset aspect-video">
            <img
              src={coverPhotoUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-xs p-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            {typeLabel}
            {selectedGroup ? ` · ${selectedGroup.name}` : ""}
          </span>
          <h2 className="font-heading text-lg font-semibold text-fg-primary m-0">
            {title || "Untitled meet"}
          </h2>
          {whenLabel && (
            <p className="text-sm text-fg-secondary m-0">{whenLabel}</p>
          )}
          {location && (
            <p className="text-sm text-fg-secondary m-0">{location}</p>
          )}
          <p className="text-xs text-fg-tertiary mt-xs flex items-center gap-xs">
            {visibility === "public" ? (
              <Globe size={14} weight="light" />
            ) : (
              <UsersThree size={14} weight="light" />
            )}
            {visibilityLabel}
          </p>
        </div>
      </div>

      {/* Actions — stacked full-width top-to-bottom: Share (primary, the
          action we want to encourage), View in group (secondary, same pill
          treatment for visual continuity), Create another (tertiary text
          button). Stacked instead of 2-col: tap-friendlier on mobile, clearer
          hierarchy, and gracefully handles the "no selected group" edge. */}
      <div className="flex flex-col gap-sm">
        <ButtonAction
          variant="primary"
          size="md"
          cta
          onClick={handleShare}
          leftIcon={<ShareNetwork size={16} weight="bold" />}
          className="w-full"
        >
          {copied ? "Copied!" : "Share meet"}
        </ButtonAction>
        {selectedGroup && (
          <ButtonAction
            variant="secondary"
            size="md"
            cta
            href={`/communities/${selectedGroup.id}`}
            onClick={onDone}
            className="w-full"
          >
            View in group
          </ButtonAction>
        )}
        <ButtonAction
          variant="tertiary"
          size="md"
          onClick={onCreateAnother}
          className="w-full"
        >
          Create another
        </ButtonAction>
      </div>

      {/* "What happens next" — pushed to the bottom of the sheet via mt-auto
          so the button group gets breathing room above it. Small visual
          divider above, generous internal spacing + padding below so the
          section reads as a distinct closing beat. */}
      <div className="flex flex-col gap-md pt-lg pb-md border-t border-edge-regular mt-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
          What happens next
        </span>
        <ul className="flex flex-col gap-sm list-none p-0 m-0">
          <li className="flex items-start gap-sm text-sm text-fg-secondary">
            <Check size={16} weight="bold" className="text-brand-main shrink-0 mt-xs" />
            <span>
              {selectedGroup
                ? `${selectedGroup.name} members will see it in their feed`
                : "Members of the group will see it in their feed"}
            </span>
          </li>
          <li className="flex items-start gap-sm text-sm text-fg-secondary">
            <Check size={16} weight="bold" className="text-brand-main shrink-0 mt-xs" />
            <span>RSVPs come through to your notifications</span>
          </li>
          <li className="flex items-start gap-sm text-sm text-fg-secondary">
            <Check size={16} weight="bold" className="text-brand-main shrink-0 mt-xs" />
            <span>You can edit or cancel anytime from the meet page</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
