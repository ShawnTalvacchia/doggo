"use client";
import { useRouter } from "next/navigation";
import { FormFooter } from "@/components/ui/FormFooter";
import { FormHeader } from "@/components/ui/FormHeader";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { useSignupDraft } from "@/contexts/SignupContext";
import { type Role } from "@/lib/types";
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIMES = ["6am–11am", "11am–3pm", "3pm–10pm"];

function nextStep(roles: Role[]): string {
  if (roles.includes("host")) return "/signup/hosting";
  return "/signup/pricing";
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}
export default function SignupWalkingPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const canContinue = draft.walkingDays.length > 0;
  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Set Up Your Walking Services"
          subtitle="Share when, where, and how you offer walks so owners can find the right fit."
        />
        <section className="form-body">
          {/* Service Area */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Service Area</p>
              <p
                className="form-row-hint"
              >
                Help local owners find you within a comfortable walking radius.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label" htmlFor="walking-radius">
                  <span className="label-primary-group">
                    <span>Where can you offer walks? (km)</span>
                  </span>
                </label>
                <div className="slider-block">
                  <div className="slider-row">
                    <RangeSlider
                      id="walking-radius"
                      min={1}
                      max={40}
                      step={1}
                      value={draft.walkingRadius}
                      onChange={(value) => updateDraft({ walkingRadius: value })}
                    />
                    <div className="slider-value-box">{draft.walkingRadius}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Availability */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Availability</p>
              <p
                className="form-row-hint"
              >
                Choose the time windows and days you&apos;re available.
              </p>
            </div>
            <div className="form-col">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Days */}
                <div className="input-block">
                  <label className="label">
                    <span className="label-primary-group">
                      <span>When can you offer walks?</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <MultiSelectSegmentBar
                    ariaLabel="Walk days"
                    options={DAYS.map((day) => ({ value: day, label: day }))}
                    selectedValues={draft.walkingDays}
                    onToggle={(value) =>
                      updateDraft({ walkingDays: toggle(draft.walkingDays, value) })
                    }
                  />
                </div>
                {/* Time slots */}
                <MultiSelectSegmentBar
                  ariaLabel="Walk times"
                  options={TIMES.map((time) => ({ value: time, label: time }))}
                  selectedValues={draft.walkingTimes}
                  onToggle={(value) =>
                    updateDraft({ walkingTimes: toggle(draft.walkingTimes, value) })
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/signup/care-preferences")}
          onContinue={() => router.push(nextStep(draft.roles))}
          disableContinue={!canContinue}
        />
      </div>
    </main>
  );
}
