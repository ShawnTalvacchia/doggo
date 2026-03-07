"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "owners" | "sitters";

const STEPS: Record<TabId, { n: string; title: string; body: string }[]> = {
  owners: [
    {
      n: "01",
      title: "Browse sitters",
      body: "Search by service, neighbourhood, and price. Every profile shows real rates, experience, and reviews.",
    },
    {
      n: "02",
      title: "Message first",
      body: "Send a message, ask questions, and get to know your sitter before committing to anything.",
    },
    {
      n: "03",
      title: "Arrange directly",
      body: "Agree on dates, details, and payment directly with your sitter. No platform in the middle.",
    },
  ],
  sitters: [
    {
      n: "01",
      title: "Create your profile",
      body: "Tell owners about your home, your experience, and the kinds of dogs you love to care for.",
    },
    {
      n: "02",
      title: "Set your prices",
      body: "You decide what to charge. No platform fees, no commissions — keep everything you earn.",
    },
    {
      n: "03",
      title: "Choose who you help",
      body: "Owners message you first. Accept the dogs that are the right fit for you.",
    },
  ],
};

const CTAS: Record<TabId, { label: string; href: string }> = {
  owners: { label: "Find a sitter →", href: "/explore/results" },
  sitters: { label: "Start earning →", href: "/signup/start" },
};

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="landing-step">
      <span className="landing-step-n">{n}</span>
      <div className="landing-step-body">
        <strong className="landing-step-title">{title}</strong>
        <p className="landing-step-text">{body}</p>
      </div>
    </div>
  );
}

export function HowItWorksTabs() {
  const [tab, setTab] = useState<TabId>("owners");
  const cta = CTAS[tab];

  return (
    <div className="landing-how-tab-wrap">
      {/* Tab switcher */}
      <div className="landing-tab-row" role="tablist" aria-label="How it works">
        <button
          role="tab"
          aria-selected={tab === "owners"}
          className={`landing-tab-btn${tab === "owners" ? " active" : ""}`}
          onClick={() => setTab("owners")}
        >
          For Dog Owners
        </button>
        <button
          role="tab"
          aria-selected={tab === "sitters"}
          className={`landing-tab-btn${tab === "sitters" ? " active" : ""}`}
          onClick={() => setTab("sitters")}
        >
          For Dog Sitters
        </button>
      </div>

      {/* Steps */}
      <div className="landing-how-tab-content" role="tabpanel" key={tab}>
        <div className="landing-steps">
          {STEPS[tab].map((step) => (
            <Step key={step.n} {...step} />
          ))}
        </div>
        <Link href={cta.href} className="landing-how-cta">
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
