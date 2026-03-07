"use client";
import { useRouter } from "next/navigation";
import { FormFooter } from "@/components/ui/FormFooter";
import { FormHeader } from "@/components/ui/FormHeader";
import { useSignupDraft } from "@/contexts/SignupContext";
import { Role } from "@/lib/types";
import { PawPrint, PersonSimpleWalk, House, Check } from "@phosphor-icons/react";
const roleCards: {
  id: Role;
  icon: React.ReactNode;
  title: string;
  desc: string;
  checkLabel: string;
}[] = [
  {
    id: "owner",
    icon: <PawPrint size={24} weight="light" />,
    title: "Pet Owner",
    desc: "Share your pets and connect with trusted walkers and other owners.\nPlan walks, playdates, and share updates about your dogs.",
    checkLabel: "I have pets and may need care",
  },
  {
    id: "walker",
    icon: <PersonSimpleWalk size={24} weight="light" />,
    title: "Offer dog walking",
    desc: "Offer dog walking or in-home sitting for local owners.\nBuild your reputation, share walk updates, and grow your network.",
    checkLabel: "I offer walking or sitting services",
  },
  {
    id: "host",
    icon: <House size={24} weight="light" />,
    title: "Host",
    desc: "Welcome pets into your home for boarding or daycare.\nShare details about your space and connect with owners seeking trusted care.",
    checkLabel: "I host pets at my home",
  },
];
export default function SignupRolePage() {
  const router = useRouter();
  const { draft, updateDraft } = useSignupDraft();
  const toggleRole = (role: Role) => {
    const hasRole = draft.roles.includes(role);
    if (hasRole) {
      updateDraft({ roles: draft.roles.filter((r) => r !== role) });
    } else {
      updateDraft({ roles: [...draft.roles, role] });
    }
  };
  return (
    <main className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Welcome to DOGGO!"
          subtitle="You can select one or more and update your roles anytime."
        />
        <section className="form-body">
          {roleCards.map((card) => {
            const active = draft.roles.includes(card.id);
            return (
              <button
                key={card.id}
                className={`role-card${active ? " active" : ""}`}
                onClick={() => toggleRole(card.id)}
              >
                <div>
                  <div className="role-card-header">
                    {card.icon}
                    <span className="role-card-title">{card.title}</span>
                  </div>
                  <p className="role-card-desc">
                    {card.desc.split("\n").map((line, i) => (
                      <span key={i}>
                        {line} {i < 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="role-card-checkbox">
                  <span className="role-card-check-icon">
                    {active && <Check size={14} weight="bold" color="white" />}
                  </span>
                  <span>{card.checkLabel}</span>
                </div>
              </button>
            );
          })}
        </section>
        <FormFooter
          onBack={() => router.push("/signup/start")}
          onContinue={() => router.push("/signup/profile")}
          disableContinue={draft.roles.length === 0}
        />
      </div>
    </main>
  );
}
