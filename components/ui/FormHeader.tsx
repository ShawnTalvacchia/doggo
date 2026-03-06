"use client";

import { usePathname } from "next/navigation";
import { SignupProgressBar } from "@/components/signup/SignupProgressBar";

type FormHeaderProps = {
  title: string;
  subtitle: string;
  // step/totalSteps are no longer used here — progress is handled by SignupProgressBar
  step?: number;
  totalSteps?: number;
};

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  const pathname = usePathname();
  const isSignupRoute = pathname.startsWith("/signup");
  const slug = isSignupRoute ? pathname.split("/").pop() || "start" : "";

  return (
    <header className="form-header">
      <h1 className="heading" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
        {title}
      </h1>
      <p className="subheading">{subtitle}</p>
      {isSignupRoute && <SignupProgressBar slug={slug} showMeta={false} />}
    </header>
  );
}
