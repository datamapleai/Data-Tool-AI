"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "welcome" | "admin" | "provider" | "done";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create admin");
      }

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-lg">
        {step === "welcome" && (
          <div className="bg-surface rounded-[--radius-lg] p-8 shadow-sm border border-canvas-border">
            <h1 className="text-2xl font-mono font-bold text-canvas-text mb-2">
              Data Tool AI
            </h1>
            <p className="text-canvas-text-dim mb-6">
              Welcome! Let&apos;s set up your personal bookmark catalog.
            </p>
            <div className="space-y-3 mb-6 text-sm text-canvas-text-dim">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-status/20 text-status flex items-center justify-center text-xs">
                  1
                </span>
                Create your admin account
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-canvas-border text-canvas-text-dim flex items-center justify-center text-xs">
                  2
                </span>
                Configure AI provider (optional)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-canvas-border text-canvas-text-dim flex items-center justify-center text-xs">
                  3
                </span>
                Start cataloging!
              </div>
            </div>
            <button
              onClick={() => setStep("admin")}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {step === "admin" && (
          <div className="bg-surface rounded-[--radius-lg] p-8 shadow-sm border border-canvas-border">
            <h2 className="text-xl font-mono font-bold text-canvas-text mb-1">
              Create Admin Account
            </h2>
            <p className="text-canvas-text-dim text-sm mb-6">
              This will be the owner of this instance.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 text-danger rounded-[--radius-sm] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-canvas-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-canvas-text mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-canvas-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <p className="text-xs text-canvas-text-dim mt-1">
                  Minimum 8 characters
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("welcome")}
                  className="px-4 py-2 border border-canvas-border rounded-[--radius-sm] text-canvas-text-dim hover:bg-surface-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "provider" && (
          <div className="bg-surface rounded-[--radius-lg] p-8 shadow-sm border border-canvas-border">
            <h2 className="text-xl font-mono font-bold text-canvas-text mb-1">
              AI Provider (Optional)
            </h2>
            <p className="text-canvas-text-dim text-sm mb-6">
              Configure your AI provider to enable smart features. You can do
              this later in Settings.
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="bg-surface rounded-[--radius-lg] p-8 shadow-sm border border-canvas-border text-center">
            <div className="w-16 h-16 rounded-full bg-status/20 text-status flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-mono font-bold text-canvas-text mb-2">
              All Set!
            </h2>
            <p className="text-canvas-text-dim mb-6">
              Your Data Tool AI instance is ready. Start adding bookmarks!
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
