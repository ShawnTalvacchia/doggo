"use client";
import { useRouter } from "next/navigation";
import { FormFooter } from "@/components/ui/FormFooter";
import { FormHeader } from "@/components/ui/FormHeader";
import { useSignupDraft } from "@/contexts/SignupContext";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { type Role } from "@/lib/types";
const DOG_SIZES = ["0–5", "5–10", "10–25", "25–45", "45+"];
const DOG_AGES = [
  { label: "Puppy", sub: "0–1 yr" },
  { label: "Adult", sub: "1–7 yrs" },
  { label: "Senior", sub: "7+ yrs" },
];
const TEMPERAMENTS = [
  "Aggressive toward dogs",
  "Aggressive toward people",
  "Reactive (barks/lunges on leash)",
  "Resource guarding",
  "Separation anxiety",
  "Escape-prone (bolts/jumps fences)",
  "Unpredictable behavior",
];
function nextStep(roles: Role[]): string {
  if (roles.includes("walker")) return "/signup/walking";
  if (roles.includes("host")) return "/signup/hosting";
  if (roles.includes("owner")) return "/signup/pet";
  return "/signup/success";
}
function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}
export default function SignupCarePreferencesPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const canContinue = draft.dogSizes.length > 0 && draft.dogAges.length > 0;
  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Dogs You Can Care For"
          subtitle="Tell us what types of dogs you can care for to ensure good matches for walking or hosting."
        />
        <section className="form-body">
          {/* Dog Size */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Dog Size</p>
              <p
                className="form-row-hint"
              >
                Choose the types of dogs you can safely care for.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label">
                  <span className="label-primary-group">
                    <span>Select sizes (kg)</span>
                  </span>
                </label>
                <MultiSelectSegmentBar
                  ariaLabel="Dog sizes"
                  options={DOG_SIZES.map((size) => ({ value: size, label: size }))}
                  selectedValues={draft.dogSizes}
                  onToggle={(value) => updateDraft({ dogSizes: toggle(draft.dogSizes, value) })}
                />
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Dog Age */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Dog Age</p>
              <p
                className="form-row-hint"
              >
                Let owners know which age groups you can confidently care for. Puppies and seniors
                may require additional handling.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label">
                  <span className="label-primary-group">
                    <span>Select ages you accept</span>
                  </span>
                </label>
                <MultiSelectSegmentBar
                  ariaLabel="Dog ages"
                  options={DOG_AGES.map(({ label, sub }) => ({
                    value: label,
                    label,
                    subLabel: sub,
                  }))}
                  selectedValues={draft.dogAges}
                  onToggle={(value) => updateDraft({ dogAges: toggle(draft.dogAges, value) })}
                />
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Temperaments excluded */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Dogs I&apos;m not able to accept</p>
              <p
                className="form-row-hint"
              >
                Let owners know if there are any dog behaviors you<em>cannot</em>care for. These
                help keep pets safe by matching you with the right dogs.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label">
                  <span className="label-primary-group">
                    <span>Select temperaments you cannot accept</span>
                  </span>
                </label>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {TEMPERAMENTS.map((t) => (
                    <CheckboxRow
                      key={t}
                      id={`temp-${t}`}
                      checked={draft.dogTemperamentsExcluded.includes(t)}
                      onChange={() =>
                        updateDraft({
                          dogTemperamentsExcluded: toggle(draft.dogTemperamentsExcluded, t),
                        })
                      }
                    >
                      {t}
                    </CheckboxRow>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Special considerations */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Special Considerations</p>
              <p
                className="form-row-hint"
              >
                Some caregivers cannot accept certain cases due to safety, space, or experience. Let
                owners know upfront.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label" htmlFor="dog-special-notes">
                  <span className="label-primary-group">
                    <span>Are there any dogs you cannot care for?</span>
                  </span>
                  <span className="label-secondary">(Optional)</span>
                </label>
                <textarea
                  id="dog-special-notes"
                  className="textarea"
                  placeholder="e.g., no aggressive dogs, no dogs with separation anxiety, no intact males, etc."
                  value={draft.dogSpecialNotes}
                  onChange={(e) => updateDraft({ dogSpecialNotes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/signup/profile")}
          onContinue={() => router.push(nextStep(draft.roles))}
          disableContinue={!canContinue}
        />
      </div>
    </main>
  );
}
