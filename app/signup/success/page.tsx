"use client";

import { useRouter } from "next/navigation";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { SignupProfilePreview } from "@/components/signup/SignupProfilePreview";
import { useSignupDraft } from "@/contexts/SignupContext";

export default function SignupSuccessPage() {
  const router = useRouter();
  const { draft } = useSignupDraft();

  const isCaregiver = draft.roles.includes("walker") || draft.roles.includes("host");

  return (
    <main className="success-shell">
      <div className={`success-content${isCaregiver ? " success-content--with-preview" : ""}`}>
        {/* ── Left: Main CTA ── */}
        <div className="success-main">
          <h1 className="success-heading">🎉 You&apos;re all set!</h1>
          <p className="success-body-text">Your profile is ready. You can edit it anytime.</p>
          <div className="success-btn-row">
            <ButtonAction
              variant="primary"
              size="lg"
              cta
              onClick={() => router.push("/explore/results")}
            >
              Start Exploring
            </ButtonAction>
            <ButtonAction
              variant="secondary"
              size="lg"
              cta
              onClick={() => router.push("/explore/results")}
            >
              Find clients
            </ButtonAction>
          </div>

          {/* Offer care upsell — only shown for owners who haven't added caregiver role */}
          {!isCaregiver && (
            <div className="success-offer-card">
              <div>
                <p className="success-offer-title">Want to offer care too?</p>
                <p className="success-body-text">
                  Offer walking, sitting, or boarding whenever you&apos;re ready.
                </p>
              </div>
              <ButtonAction
                variant="secondary"
                size="md"
                onClick={() => router.push("/signup/role")}
              >
                Add Another Role
              </ButtonAction>
            </div>
          )}
        </div>

        {/* ── Right: Profile preview (caregiver roles only) ── */}
        {isCaregiver && (
          <div className="success-preview-col">
            <p className="success-preview-label">Your public profile preview</p>
            <SignupProfilePreview />
          </div>
        )}
      </div>
    </main>
  );
}
