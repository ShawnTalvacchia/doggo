"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageSquare, MagnifyingGlass } from "@phosphor-icons/react";
import { FormFooter } from "@/components/layout/FormFooter";
import { FormHeader } from "@/components/layout/FormHeader";
import { InputField } from "@/components/ui/InputField";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { useSignupDraft } from "@/contexts/SignupContext";
import { type Role } from "@/lib/types";
function petBackStep(roles: Role[]): string {
  if (roles.includes("host")) return "/signup/hosting";
  if (roles.includes("walker")) return "/signup/walking";
  return "/signup/profile";
}
const sizeOptions = [
  "Toy (under 5kg)",
  "Small (5–10kg)",
  "Medium (10–25kg)",
  "Large (25–45kg)",
  "Giant (45kg+)",
];
export default function SignupPetPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const pet = draft.pet;
  const setPet = (fields: Partial<typeof pet>) => updateDraft({ pet: { ...pet, ...fields } });
  const [nameTouched, setNameTouched] = useState(false);
  const [sizeTouched, setSizeTouched] = useState(false);
  const canContinue = Boolean(pet.name.trim() && pet.size);
  const nameError = nameTouched && !pet.name.trim() ? "Dog's name is required" : undefined;
  const sizeError = sizeTouched && !pet.size ? "Please select a size" : undefined;
  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Add Your Pet"
          subtitle="Tell us about your dog so we can match you with the right walkers and hosts."
        />
        <section className="form-body">
          <p className="form-section-label">Your Pets</p>
          <div className="pet-card">
            {/* Top row: photo + name/breed */}
            <div className="form-row">
              {/* Pet photo */}
              <div className="form-col-sm">
                <div className="input-block">
                  <label className="label">
                    <span className="label-primary-group">
                      <span>Pet Photo</span>
                      <span className="required">*</span>
                    </span>
                  </label>
                  <button className="pet-photo-upload" type="button" aria-label="Upload pet photo">
                    <ImageSquare size={56} weight="light" />
                    <span>Upload or drag here</span>
                  </button>
                </div>
              </div>
              {/* Name + breed */}
              <div
                className="form-col"
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <InputField
                  id="dog-name"
                  label="Dog's name"
                  required
                  value={pet.name}
                  onChange={(name) => setPet({ name })}
                  onBlur={() => setNameTouched(true)}
                  placeholder="e.g. Luna"
                  error={nameError}
                />
                <div className="input-block">
                  <label className="label" htmlFor="dog-breed">
                    <span className="label-primary-group">
                      <span>Select Breed</span>
                      <span className={`required${pet.breed.trim() ? " required-filled" : ""}`}>
                        *
                      </span>
                    </span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      id="dog-breed"
                      className="input"
                      placeholder="e.g. Corgi + Mix"
                      value={pet.breed}
                      onChange={(e) => setPet({ breed: e.target.value })}
                    />
                    <span className="input-trailing-icon">
                      <MagnifyingGlass size={20} weight="light" />
                    </span>
                  </div>
                  <p className="helper">
                    Select up to two. If your dog is a mix, use 'Mixed breed' or combine it with a
                    known breed.
                  </p>
                </div>
              </div>
            </div>
            {/* Size + Age */}
            <div className="two-col">
              <div className="input-block">
                <label className="label" htmlFor="dog-size">
                  <span className="label-primary-group">
                    <span>Size</span>
                    <span className={`required${pet.size ? " required-filled" : ""}`}>*</span>
                  </span>
                </label>
                <select
                  id="dog-size"
                  className={`input select${sizeError ? " input-invalid" : ""}`}
                  value={pet.size}
                  onChange={(e) => setPet({ size: e.target.value })}
                  onBlur={() => setSizeTouched(true)}
                  aria-invalid={sizeError ? "true" : undefined}
                  aria-describedby={sizeError ? "dog-size-error" : undefined}
                >
                  <option value="">Select your dog's size</option>
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {sizeError && (
                  <div id="dog-size-error" className="input-error-msg" role="alert">
                    {sizeError}
                  </div>
                )}
              </div>
              <InputField
                id="dog-age"
                label="Age"
                value={pet.age}
                onChange={(age) => setPet({ age })}
                placeholder="Enter approximate age in years"
              />
            </div>
            {/* Temperament + Good with */}
            <div className="two-col">
              <InputField
                id="dog-temperament"
                label="Temperament"
                value={pet.temperament}
                onChange={(temperament) => setPet({ temperament })}
                placeholder="e.g. Calm, playful, shy"
              />
              <div className="input-block">
                <span className="label" style={{ display: "block" }}>
                  Good with
                </span>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <CheckboxRow
                    id="good-with-dogs"
                    label="Other dogs"
                    checked={pet.goodWithDogs}
                    onChange={(goodWithDogs) => setPet({ goodWithDogs })}
                  />
                  <CheckboxRow
                    id="good-with-kids"
                    label="Children"
                    checked={pet.goodWithKids}
                    onChange={(goodWithKids) => setPet({ goodWithKids })}
                  />
                </div>
              </div>
            </div>
            {/* Health & notes */}
            <InputField
              id="health-notes"
              label="Health & notes"
              value={pet.healthNotes}
              onChange={(healthNotes) => setPet({ healthNotes })}
              placeholder="Add allergies, meds, or care tips"
            />
          </div>
        </section>
        <FormFooter
          onBack={() => router.push(petBackStep(draft.roles))}
          onContinue={() => router.push("/signup/success")}
          disableContinue={!canContinue}
        />
      </div>
    </main>
  );
}
