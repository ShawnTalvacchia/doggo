"use client";

import { useRouter } from "next/navigation";
import { FormFooter } from "@/components/ui/FormFooter";
import { FormHeader } from "@/components/ui/FormHeader";
import { useSignupDraft } from "@/contexts/SignupContext";
import { getStepInfo } from "@/lib/signupSteps";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIMES = ["6am–11am", "11am–3pm", "3pm–10pm"];

const HOME_TYPES = ["Apartment", "House", "Studio", "Townhouse", "Farm / Rural property"];

const OUTDOOR_SPACES = [
  "Private fenced garden",
  "Shared garden (unfenced)",
  "Balcony only",
  "No outdoor space",
];

function nextStep(): string {
  // Pricing step always follows the last service setup step
  return "/signup/pricing";
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function SignupHostingPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();

  const canContinue =
    draft.hostDays.length > 0 && Boolean(draft.homeType) && Boolean(draft.outdoorSpace);
  const stepInfo = getStepInfo("hosting", draft.roles);

  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Set Up Your Hosting Space"
          subtitle="Tell owners about your home and environment so they can book with confidence."
          step={stepInfo?.step}
          totalSteps={stepInfo?.totalSteps}
        />

        <section className="form-body">
          {/* Availability */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Availability</p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-tertiary)",
                  lineHeight: "20px",
                  marginTop: 8,
                }}
              >
                Choose when you&apos;re available to welcome dogs into your home.
              </p>
            </div>
            <div className="form-col">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Days */}
                <div className="input-block">
                  <label className="label">
                    <span className="label-primary-group">
                      <span>Days you accept bookings</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <div className="segment-bar">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`segment-btn${draft.hostDays.includes(day) ? " active" : ""}`}
                        onClick={() => updateDraft({ hostDays: toggle(draft.hostDays, day) })}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div className="input-block">
                  <label className="label">
                    <span className="label-primary-group">
                      <span>Drop-off / pickup windows</span>
                    </span>
                  </label>
                  <div className="segment-bar">
                    {TIMES.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`segment-btn${draft.hostTimes.includes(time) ? " active" : ""}`}
                        onClick={() => updateDraft({ hostTimes: toggle(draft.hostTimes, time) })}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section-divider" />

          {/* Home Type */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Home Type</p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-tertiary)",
                  lineHeight: "20px",
                  marginTop: 8,
                }}
              >
                Describe the space where you host pets so owners know what to expect.
              </p>
            </div>
            <div className="form-col">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Home type dropdown */}
                <div className="input-block">
                  <label className="label" htmlFor="home-type">
                    <span className="label-primary-group">
                      <span>What type of home do you have?</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <select
                    id="home-type"
                    className="select-input"
                    value={draft.homeType}
                    onChange={(e) => updateDraft({ homeType: e.target.value })}
                  >
                    <option value="">Select your home type</option>
                    {HOME_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Outdoor space dropdown */}
                <div className="input-block">
                  <label className="label" htmlFor="outdoor-space">
                    <span className="label-primary-group">
                      <span>Outdoor Space</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <select
                    id="outdoor-space"
                    className="select-input"
                    value={draft.outdoorSpace}
                    onChange={(e) => updateDraft({ outdoorSpace: e.target.value })}
                  >
                    <option value="">Select an option</option>
                    {OUTDOOR_SPACES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dog stay area textarea */}
                <div className="input-block">
                  <label className="label" htmlFor="dog-stay-area">
                    <span className="label-primary-group">
                      <span>Where will dogs stay in your home?</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <textarea
                    id="dog-stay-area"
                    className="textarea"
                    placeholder="Free roam except kitchen; sleeps in crate."
                    value={draft.dogStayArea}
                    onChange={(e) => updateDraft({ dogStayArea: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <FormFooter
          onBack={() =>
            draft.roles.includes("walker")
              ? router.push("/signup/walking")
              : router.push("/signup/care-preferences")
          }
          onContinue={() => router.push(nextStep())}
          disableContinue={!canContinue}
        />
      </div>
    </main>
  );
}
