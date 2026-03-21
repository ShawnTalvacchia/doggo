"use client";

import { useRouter } from "next/navigation";
import { ButtonAction } from "@/components/ui/ButtonAction";

export default function SignupSuccessPage() {
  const router = useRouter();

  return (
    <main className="success-shell">
      <div className="success-content">
        <div className="success-main">
          <h1 className="success-heading">You&apos;re in!</h1>
          <p className="success-body-text">
            Your profile is ready. Find meets near you, connect with other dog owners, and build your community.
          </p>
          <div className="success-btn-row">
            <ButtonAction
              variant="primary"
              size="lg"
              cta
              onClick={() => router.push("/home")}
            >
              Go to Home
            </ButtonAction>
            <ButtonAction
              variant="secondary"
              size="lg"
              cta
              onClick={() => router.push("/meets")}
            >
              Browse Meets
            </ButtonAction>
          </div>

          <div className="success-offer-card">
            <div>
              <p className="success-offer-title">Want to offer care?</p>
              <p className="success-body-text">
                As you build connections through meets, you can start offering walking, sitting, or boarding to people you know.
              </p>
            </div>
            <ButtonAction
              variant="secondary"
              size="md"
              onClick={() => router.push("/profile")}
            >
              Set up later in Profile
            </ButtonAction>
          </div>
        </div>
      </div>
    </main>
  );
}
