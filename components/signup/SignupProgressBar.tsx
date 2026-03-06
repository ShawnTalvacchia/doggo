"use client";

import { useEffect, useRef } from "react";
import { useSignupDraft } from "@/contexts/SignupContext";
import { getStepInfo } from "@/lib/signupSteps";

type Props = { slug: string; showMeta?: boolean };

export function SignupProgressBar({ slug, showMeta = true }: Props) {
  const { draft } = useSignupDraft();
  const info = getStepInfo(slug, draft.roles);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = stripRef.current;
    if (!node) return;

    const updateHeightVar = () => {
      const height = Math.ceil(node.getBoundingClientRect().height);
      document.body.style.setProperty("--signup-progress-height", `${height}px`);
    };

    updateHeightVar();
    const observer = new ResizeObserver(updateHeightVar);
    observer.observe(node);
    window.addEventListener("resize", updateHeightVar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeightVar);
      document.body.style.removeProperty("--signup-progress-height");
    };
  }, []);

  if (!info) return null;

  const pct = Math.round((info.step / info.totalSteps) * 100);

  return (
    <div ref={stripRef} className="signup-progress-strip">
      <div className="signup-progress-inner">
        {showMeta && (
          <p className="signup-progress-meta">
            Step {info.step} of {info.totalSteps}
          </p>
        )}
        <div className="signup-progress-track">
          <div className="signup-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
