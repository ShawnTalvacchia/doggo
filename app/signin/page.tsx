"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setError(null);
    setLoading(true);

    // Prototype: simulate a short delay then navigate to explore
    setTimeout(() => {
      router.push("/explore/results");
    }, 800);
  }

  return (
    <main className="signin-page">
      <div className="signin-card">
        {/* Header */}
        <div className="signin-header">
          <Link href="/" className="signin-logo">
            DOGGO
          </Link>
          <h1 className="signin-heading">Welcome back</h1>
          <p className="signin-sub">Sign in to your Doggo account</p>
        </div>

        {/* Form */}
        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="signin-error" role="alert">
              {error}
            </div>
          )}

          <div className="signin-field">
            <label className="signin-label" htmlFor="signin-email">
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="signin-field">
            <div className="signin-label-row">
              <label className="signin-label" htmlFor="signin-password">
                Password
              </label>
              <button type="button" className="signin-forgot" onClick={() => {}} tabIndex={-1}>
                Forgot password?
              </button>
            </div>
            <div className="signin-input-wrap">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                className="signin-input signin-input--password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="signin-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlash size={18} weight="light" />
                ) : (
                  <Eye size={18} weight="light" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="signin-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Footer links */}
        <div className="signin-footer">
          <p className="signin-footer-text">
            New to Doggo?{" "}
            <Link href="/signup/start" className="signin-footer-link">
              Create a free account
            </Link>
          </p>
          <p className="signin-footer-text">
            <Link href="/explore/results" className="signin-footer-link">
              Browse carers without signing in →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
