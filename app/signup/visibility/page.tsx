"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Eye } from "@phosphor-icons/react";
import { FormFooter } from "@/components/layout/FormFooter";
import { FormHeader } from "@/components/layout/FormHeader";
import { useSignupDraft } from "@/contexts/SignupContext";

export default function SignupVisibilityPage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();

  const options = [
    {
      value: false,
      label: "Locked",
      icon: <ShieldCheck size={32} weight="light" />,
      description:
        "Only your first name, dog, and neighbourhood are visible. No one can message you unless you connect first.",
      detail: "Best if you want to attend meets and connect at your own pace.",
    },
    {
      value: true,
      label: "Open",
      icon: <Eye size={32} weight="light" />,
      description:
        "Your full profile is visible to nearby owners. People can send you message requests.",
      detail: "Best if you want to be discoverable and are open to meeting new people.",
    },
  ];

  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Choose Your Visibility"
          subtitle="You control who sees your profile. You can change this anytime in settings."
        />
        <section className="form-body">
          <div className="flex flex-col gap-md">
            {options.map((opt) => {
              const isSelected = draft.publicProfile === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => updateDraft({ publicProfile: opt.value })}
                  className="flex items-start gap-md rounded-panel p-lg text-left transition-colors"
                  style={{
                    background: isSelected ? "var(--brand-subtle)" : "var(--surface-top)",
                    border: `2px solid ${isSelected ? "var(--brand-main)" : "var(--border-regular)"}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="shrink-0 mt-xs"
                    style={{ color: isSelected ? "var(--brand-main)" : "var(--text-tertiary)" }}
                  >
                    {opt.icon}
                  </span>
                  <div className="flex flex-col gap-xs">
                    <span
                      className="font-semibold text-md"
                      style={{ color: isSelected ? "var(--brand-main)" : "var(--text-primary)" }}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm text-fg-secondary">{opt.description}</span>
                    <span className="text-xs text-fg-tertiary" style={{ fontStyle: "italic" }}>
                      {opt.detail}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="mt-lg rounded-panel p-md text-sm text-fg-secondary"
            style={{ background: "var(--surface-base)" }}
          >
            <strong>How trust works on Doggo:</strong> Everyone starts with basic visibility. As you
            attend meets and connect with people, you can mark individuals as{" "}
            <strong>Familiar</strong> or <strong>Connected</strong> — giving them more access to your
            profile and unlocking direct messaging. You&apos;re always in control.
          </div>
        </section>
        <FormFooter
          onBack={() => router.push("/signup/pet")}
          onContinue={() => router.push("/signup/success")}
          disableContinue={false}
        />
      </div>
    </main>
  );
}
