"use client";

import { usePathname } from "next/navigation";
import { SignupProgressBar } from "@/components/signup/SignupProgressBar";

type FormHeaderProps = {
  title: string;
  subtitle: string;
  /**
   * Whether to show the signup progress bar below the heading.
   * Defaults to auto-detect from the current route (/signup/*).
   * Pass explicitly to override: showProgress={true} or showProgress={false}.
   */
  showProgress?: boolean;
};

export function FormHeader({ title, subtitle, showProgress }: FormHeaderProps) {
  const pathname = usePathname();
  const isSignupRoute = pathname.startsWith("/signup");
  const slug = isSignupRoute ? pathname.split("/").pop() || "start" : "";

  // Explicit prop wins; fall back to route detection.
  const shouldShowProgress = showProgress ?? isSignupRoute;

  return (
    <header className="form-header">
      <h1 className="heading">{title}</h1>
      <p className="subheading">{subtitle}</p>
      {shouldShowProgress && slug && <SignupProgressBar slug={slug} showMeta={false} />}
    </header>
  );
}
