"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { SaturateIconMark } from "@/components/SaturateIconMark";
import { SaturateLogo } from "@/components/SaturateLogo";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Check your email for the sign-in link.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#000000] text-[var(--foreground)]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-1">
          <SaturateLogo href="/login" priority />
          <SaturateHueLine width={88} />
        </div>

        <div className="cb-panel p-8">
          <h1 className="text-xl font-light text-[var(--foreground)] mb-1 tracking-wide">
            Sign in
          </h1>
          <p className="text-[var(--muted)] text-sm mb-6 font-light">
            Enter your email and we’ll send you a magic link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-light uppercase tracking-[0.12em] text-[var(--muted)] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={status === "loading" || status === "success"}
                autoComplete="email"
                className="w-full border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm font-light text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-white/40 disabled:opacity-60"
              />
            </div>

            {message && (
              <p
                role="alert"
                className={`text-sm font-light ${
                  status === "error"
                    ? "text-red-400"
                    : "text-[var(--muted)]"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full cb-btn cb-btn-primary disabled:cursor-not-allowed disabled:opacity-60 justify-center"
            >
              {status === "loading"
                ? "Sending…"
                : status === "success"
                  ? "Check your email"
                  : (
                    <>
                      <span>Send magic link</span>
                      <SaturateIconMark size={14} />
                    </>
                  )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#000000] text-[var(--foreground)]">
        <div className="w-full max-w-md space-y-6 animate-pulse">
          <div className="h-8 w-40 bg-white/10 mx-auto" />
          <div className="cb-panel p-8">
            <div className="h-8 w-28 bg-white/10 mb-4" />
            <div className="h-4 w-64 bg-white/10 mb-8" />
            <div className="h-12 w-full bg-white/10 mb-5" />
            <div className="h-10 w-full bg-white/10" />
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
