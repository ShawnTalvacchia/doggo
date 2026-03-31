"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "community" | "care" | "provide";

const STEPS: Record<TabId, { n: string; title: string; body: string }[]> = {
  community: [
    {
      n: "01",
      title: "Find a meet near you",
      body: "Browse walks, park hangouts, and playdates happening in your neighbourhood. Join one that fits your dog's style.",
    },
    {
      n: "02",
      title: "Show up with your dog",
      body: "Meet other owners and dogs in person. No pressure — just dogs being dogs and people getting to know each other.",
    },
    {
      n: "03",
      title: "Build your circle",
      body: "Connect with owners you click with. Your familiar list grows naturally, and so does your support network.",
    },
  ],
  care: [
    {
      n: "01",
      title: "Know before you book",
      body: "Need a sitter? You already know people from meets. Browse connected owners or search for trusted carers nearby.",
    },
    {
      n: "02",
      title: "Message and arrange",
      body: "Chat with your carer, agree on details, and feel confident because you've already met in person.",
    },
    {
      n: "03",
      title: "Book and track",
      body: "Confirm dates and pricing. Get updates during care. Leave a review when it's done.",
    },
  ],
  provide: [
    {
      n: "01",
      title: "Add care to your profile",
      body: "Toggle on the services you're happy to offer — walking, sitting, or both. Set your own availability and constraints. No separate signup.",
    },
    {
      n: "02",
      title: "Choose who sees it",
      body: "Share your care offerings with just your connections, a private neighbourhood group, or open it up to everyone looking for help.",
    },
    {
      n: "03",
      title: "Do as much or as little as you like",
      body: "Walk one neighbour's dog on Saturdays, or build a full care schedule — it's a dial, not a switch. Start small, scale up if you want, and dial it back whenever you need to.",
    },
  ],
};

const CTAS: Record<TabId, { label: string; href: string }> = {
  community: { label: "Browse meets →", href: "/activity" },
  care: { label: "Find care →", href: "/discover?tab=care" },
  provide: { label: "Learn more →", href: "/signup/start" },
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
  const [tab, setTab] = useState<TabId>("community");
  const cta = CTAS[tab];

  return (
    <div className="landing-how-tab-wrap">
      {/* Tab switcher */}
      <div className="landing-tab-row" role="tablist" aria-label="How it works">
        <button
          role="tab"
          aria-selected={tab === "community"}
          className={`landing-tab-btn${tab === "community" ? " active" : ""}`}
          onClick={() => setTab("community")}
        >
          Join the Community
        </button>
        <button
          role="tab"
          aria-selected={tab === "care"}
          className={`landing-tab-btn${tab === "care" ? " active" : ""}`}
          onClick={() => setTab("care")}
        >
          Find Care
        </button>
        <button
          role="tab"
          aria-selected={tab === "provide"}
          className={`landing-tab-btn${tab === "provide" ? " active" : ""}`}
          onClick={() => setTab("provide")}
        >
          Provide Care
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
