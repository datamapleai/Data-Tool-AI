"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Get CSRF token
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      // 2. Submit credentials — don't follow redirect automatically
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          password,
          csrfToken,
          callbackUrl: "/resources",
          json: "true",
        }),
        redirect: "manual",
      });

      // 3. Handle the response
      if (res.status === 0 || res.type === "opaqueredirect") {
        // Opaque redirect — navigate manually
        window.location.href = "/resources";
        return;
      }

      if (res.status === 200) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        if (data.error) {
          setError("Email ou senha inválidos");
          return;
        }
      }

      // Fallback — try navigating to /resources
      window.location.href = "/resources";
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface rounded-[--radius-lg] p-8 shadow-sm border border-canvas-border">
          <h1 className="text-2xl font-mono font-bold text-canvas-text mb-1">
            Data Tool AI
          </h1>
          <p className="text-canvas-text-dim text-sm mb-6">
            Sign in to your catalog
          </p>

          {error && (
            <div className="mb-4 p-3 bg-danger/10 text-danger rounded-[--radius-sm] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 bg-canvas-input border border-canvas-border rounded-[--radius-sm] text-canvas-text focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-accent hover:bg-accent-strong text-white rounded-[--radius-md] font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
