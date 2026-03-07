"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, ImageSquare } from "@phosphor-icons/react";
import { FormFooter } from "@/components/ui/FormFooter";
import { FormHeader } from "@/components/ui/FormHeader";
import { InputField } from "@/components/ui/InputField";
import { useSignupDraft } from "@/contexts/SignupContext";
export default function SignupProfilePage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const [locationTouched, setLocationTouched] = useState(false);
  const canContinue = Boolean(draft.location.trim());
  const locationError =
    locationTouched && !draft.location.trim() ? "Location is required" : undefined;
  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Build Your Profile"
          subtitle="Share a few details so caregivers and nearby owners can connect with confidence."
        />
        <section className="form-body">
          {/* Personal info row */}
          <div className="form-row">
            {/* Profile photo */}
            <div className="form-col">
              <div className="input-block">
                <label className="label">
                  <span className="label-primary-group">
                    <span>Profile Photo</span>
                    <span className="required">*</span>
                  </span>
                </label>
                <div className="photo-upload-area">
                  <button
                    className="photo-upload-circle"
                    type="button"
                    aria-label="Upload profile photo"
                  >
                    <ImageSquare size={40} weight="light" />
                    <span>
                      Upload or
                      <br />
                      drag here
                    </span>
                  </button>
                  <p className="photo-upload-hint">
                    A clear photo helps dog owners and caregivers feel confident connecting with you
                  </p>
                </div>
              </div>
            </div>
            {/* Name + bio */}
            <div className="form-col" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <InputField
                id="display-name"
                label="Name"
                value={draft.firstName}
                onChange={() => undefined}
              />
              <div className="input-block">
                <label className="label" htmlFor="bio">
                  <span className="label-primary-group">
                    <span>Short bio</span>
                    <span className="label-secondary">(Optional)</span>
                  </span>
                </label>
                <textarea
                  id="bio"
                  className="textarea"
                  placeholder="Introduce yourself in a few words so others know who they're connecting with"
                  value={draft.bio}
                  onChange={(e) => updateDraft({ bio: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Location row */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Location</p>
              <p className="form-row-hint">
                Used to match you with nearby services.
                <br />
                Your exact address stays private.
              </p>
            </div>
            <div className="form-col">
              <div className="input-block">
                <label className="label" htmlFor="location">
                  <span className="label-primary-group">
                    <span>Where are you based?</span>
                    <span className="required">*</span>
                  </span>
                </label>
                <div className="input-with-icon">
                  <input
                    id="location"
                    className={`input${locationError ? " input-invalid" : ""}`}
                    placeholder="Search your district or area"
                    value={draft.location}
                    onChange={(e) => updateDraft({ location: e.target.value })}
                    onBlur={() => setLocationTouched(true)}
                    aria-invalid={locationError ? "true" : undefined}
                    aria-describedby={locationError ? "location-error" : undefined}
                  />
                  <span className="input-trailing-icon">
                    <MagnifyingGlass size={20} weight="light" />
                  </span>
                </div>
                {locationError && (
                  <div id="location-error" className="input-error-msg" role="alert">
                    {locationError}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-section-divider" />
          {/* Visibility row */}
          <div className="form-row">
            <div className="form-col">
              <p className="form-section-label">Visibility</p>
              <p className="form-row-hint">
                Public profiles can appear to nearby owners for playdates and meetups. If disabled,
                only caregivers you hire will see your profile.
                <br />
                <br />
                You can adjust that at anytime.
              </p>
            </div>
            <div className="form-col">
              <div className="toggle-row">
                <span className="label" style={{ margin: 0 }}>
                  Public Profile
                </span>
                <button
                  type="button"
                  className={`toggle-track${draft.publicProfile ? " on" : ""}`}
                  onClick={() => updateDraft({ publicProfile: !draft.publicProfile })}
                  aria-label="Toggle public profile"
                  aria-pressed={draft.publicProfile}
                >
                  <div className="toggle-knob" />
                </button>
              </div>
            </div>
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/signup/role")}
          onContinue={() => {
            const hasService = draft.roles.includes("walker") || draft.roles.includes("host");
            if (hasService) return router.push("/signup/care-preferences");
            if (draft.roles.includes("owner")) return router.push("/signup/pet");
            return router.push("/signup/success");
          }}
          disableContinue={!canContinue}
        />
      </div>
    </main>
  );
}
