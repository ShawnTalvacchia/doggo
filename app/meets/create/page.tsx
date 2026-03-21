"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormHeader } from "@/components/layout/FormHeader";
import { FormFooter } from "@/components/layout/FormFooter";
import { InputField } from "@/components/ui/InputField";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
} from "@phosphor-icons/react";
import type { MeetType, LeashRule, DogSizeFilter } from "@/lib/types";

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

export default function CreateMeetPage() {
  const router = useRouter();
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

  const canCreate = type && title.trim() && location.trim() && date && time;

  return (
    <main className="page-shell page-shell--flat">
      <div className="form-shell form-shell--flat">
        <FormHeader
          title="Create a Meet"
          subtitle="Organise a walk, hangout, playdate, or training session for your neighbourhood."
        />
        <section className="form-body">
          {/* Meet type selection */}
          <div className="flex flex-col gap-sm">
            <p className="form-section-label">What kind of meet?</p>
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

          {/* Details */}
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

          <div className="form-section-divider" />

          {/* Date & time */}
          <div className="flex flex-col gap-md">
            <p className="form-section-label">When</p>
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
                    <span>Time</span>
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

            <div className="input-block">
              <label className="flex items-center gap-sm" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--brand-main)" }}
                />
                <span className="text-sm font-medium text-fg-primary">
                  Repeat weekly on the same day
                </span>
              </label>
            </div>
          </div>

          <div className="form-section-divider" />

          {/* Rules */}
          <div className="flex flex-col gap-md">
            <p className="form-section-label">Rules</p>
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
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/meets")}
          onContinue={() => {
            // Demo: just navigate to meets page as if created
            router.push("/meets");
          }}
          disableContinue={!canCreate}
          continueLabel="Create Meet"
        />
      </div>
    </main>
  );
}
