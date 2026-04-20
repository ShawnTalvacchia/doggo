"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./unlock.css";

function UnlockForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") || "/pages";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        setError("Incorrect password");
        setBusy(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="unlock-page">
      <form className="unlock-card" onSubmit={onSubmit} autoComplete="off">
        <div className="unlock-brand">DOGGO</div>
        <h1 className="unlock-title">Prototype preview</h1>
        <p className="unlock-subtitle">
          This is a private work-in-progress. Enter the password to continue.
        </p>

        <label className="unlock-field">
          <span className="unlock-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={busy}
          />
        </label>

        {error && <p className="unlock-error">{error}</p>}

        <button
          type="submit"
          className="unlock-submit"
          disabled={!password || busy}
        >
          {busy ? "Unlocking…" : "Unlock"}
        </button>

        <p className="unlock-footnote">
          The landing page and signup flow are publicly shareable without this
          gate.
        </p>
      </form>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={null}>
      <UnlockForm />
    </Suspense>
  );
}
