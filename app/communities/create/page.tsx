"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CameraSlash, Globe, Lock, Prohibit, ShieldCheck } from "@phosphor-icons/react";
import { FormHeader } from "@/components/layout/FormHeader";
import { FormFooter } from "@/components/layout/FormFooter";
import { InputField } from "@/components/ui/InputField";
import type { GroupVisibility, PhotoPolicy } from "@/lib/types";

type Visibility = GroupVisibility;

const NEIGHBOURHOODS = ["Vinohrady", "Holešovice", "Letná", "Žižkov", "Vršovice", "Smíchov"];

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("open");
  const [photoPolicy, setPhotoPolicy] = useState<PhotoPolicy>("encouraged");
  const [touched, setTouched] = useState(false);

  const nameError = touched && !name.trim() ? "Community name is required" : undefined;

  return (
    <div className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Create a Community"
          subtitle="Start a persistent community for your regular crew."
        />

        <div className="form-body">
          {/* Name */}
          <InputField
            id="group-name"
            label="Community name"
            value={name}
            onChange={(v) => setName(v)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. Vinohrady Morning Crew"
            error={nameError}
            required
          />

          {/* Description */}
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-medium text-fg-primary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this community about? Who should join?"
              rows={3}
              className="rounded-form px-md py-sm text-sm"
              style={{
                border: "1px solid var(--border-regular)",
                background: "var(--surface-base)",
                resize: "vertical",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Neighbourhood */}
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-medium text-fg-primary">Neighbourhood</label>
            <select
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
              className="rounded-form px-md py-sm text-sm"
              style={{
                border: "1px solid var(--border-regular)",
                background: "var(--surface-base)",
                fontFamily: "var(--font-body)",
              }}
            >
              <option value="">Select a neighbourhood</option>
              {NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-sm">
            <label className="text-sm font-medium text-fg-primary">Visibility</label>
            <div className="flex gap-md">
              {([
                {
                  key: "open" as Visibility,
                  icon: <Globe size={24} weight="light" />,
                  label: "Open",
                  desc: "Anyone can find and join",
                },
                {
                  key: "approval" as Visibility,
                  icon: <ShieldCheck size={24} weight="light" />,
                  label: "Public",
                  desc: "Anyone can find, admin approves joins",
                },
                {
                  key: "private" as Visibility,
                  icon: <Lock size={24} weight="light" />,
                  label: "Private",
                  desc: "Invite only, hidden from browse",
                },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setVisibility(opt.key)}
                  className="flex flex-col items-center gap-sm rounded-panel p-md flex-1"
                  style={{
                    border: `2px solid ${visibility === opt.key ? "var(--brand-main)" : "var(--border-light)"}`,
                    background: visibility === opt.key ? "var(--brand-subtle)" : "var(--surface-base)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: visibility === opt.key ? "var(--brand-main)" : "var(--text-secondary)" }}>
                    {opt.icon}
                  </span>
                  <span className="text-sm font-medium text-fg-primary">{opt.label}</span>
                  <span className="text-xs text-fg-tertiary">{opt.desc}</span>
                </button>
              ))}
            </div>
            <span className="text-xs text-fg-tertiary" style={{ marginTop: "var(--space-xs)" }}>
              This can&apos;t be changed after creation
            </span>
          </div>

          {/* Photo policy */}
          <div className="flex flex-col gap-sm">
            <label className="text-sm font-medium text-fg-primary">Photo culture</label>
            <div className="flex gap-md">
              {([
                {
                  key: "encouraged" as PhotoPolicy,
                  icon: <Camera size={24} weight="light" />,
                  label: "Encouraged",
                  desc: "Photos are part of the culture",
                },
                {
                  key: "optional" as PhotoPolicy,
                  icon: <CameraSlash size={24} weight="light" />,
                  label: "Optional",
                  desc: "Photos welcome but not expected",
                },
                {
                  key: "none" as PhotoPolicy,
                  icon: <Prohibit size={24} weight="light" />,
                  label: "No photos",
                  desc: "Photo posting disabled",
                },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPhotoPolicy(opt.key)}
                  className="flex flex-col items-center gap-sm rounded-panel p-md flex-1"
                  style={{
                    border: `2px solid ${photoPolicy === opt.key ? "var(--brand-main)" : "var(--border-light)"}`,
                    background: photoPolicy === opt.key ? "var(--brand-subtle)" : "var(--surface-base)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: photoPolicy === opt.key ? "var(--brand-main)" : "var(--text-secondary)" }}>
                    {opt.icon}
                  </span>
                  <span className="text-sm font-medium text-fg-primary">{opt.label}</span>
                  <span className="text-xs text-fg-tertiary">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cover photo placeholder */}
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-medium text-fg-primary">Cover photo</label>
            <div
              className="flex flex-col items-center justify-center gap-sm rounded-panel"
              style={{
                height: 120,
                border: "2px dashed var(--border-light)",
                background: "var(--surface-inset)",
                cursor: "pointer",
              }}
            >
              <Camera size={28} weight="light" className="text-fg-tertiary" />
              <span className="text-sm text-fg-tertiary">Add a cover photo</span>
            </div>
          </div>
        </div>

        <FormFooter
          onBack={() => router.push("/communities")}
          onContinue={() => router.push("/communities")}
          continueLabel="Create Community"
          disableContinue={!name.trim()}
        />
      </div>
    </div>
  );
}
