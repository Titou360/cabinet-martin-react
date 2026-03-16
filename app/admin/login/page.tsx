"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/admin/blog");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1b2a47" }}>
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#f9f5ec] rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-[#1b2a47] tracking-tight">Cabinet Martin</h1>
            <p className="text-sm text-[#1b2a47]/50 mt-1">Accès administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1b2a47]/70 mb-1.5 tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 focus:border-[#ae894a] transition"
                placeholder="admin@cabinetmartin.fr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b2a47]/70 mb-1.5 tracking-wide uppercase">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 focus:border-[#ae894a] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60"
              style={{ background: "#ae894a" }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-5 pt-5 border-t border-[#1b2a47]/10 flex flex-col items-center gap-2">
            <Link
              href="/admin/forgot-password"
              className="text-xs text-[#1b2a47]/40 hover:text-[#ae894a] transition-colors duration-150"
            >
              Mot de passe oublié ?
            </Link>
            <Link
              href="/"
              className="text-xs text-[#1b2a47]/40 hover:text-[#ae894a] transition-colors duration-150"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
