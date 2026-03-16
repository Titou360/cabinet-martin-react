"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      setResetLink(`${window.location.origin}/admin/reset-password/${data.token}`);
    } else {
      // No user found — show generic message anyway
      setError("Si cet email existe, un lien de réinitialisation a été généré.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1b2a47" }}>
      <div className="w-full max-w-sm">
        <div className="bg-[#f9f5ec] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-[#1b2a47] tracking-tight">Mot de passe oublié</h1>
            <p className="text-sm text-[#1b2a47]/50 mt-1">Entrez votre email administrateur</p>
          </div>

          {resetLink ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#ae894a]/30 bg-[#ae894a]/6">
                <p className="text-xs font-semibold text-[#ae894a] uppercase tracking-wide mb-2">
                  Lien de réinitialisation (valable 1h)
                </p>
                <p className="text-xs text-[#1b2a47]/70 break-all leading-relaxed">{resetLink}</p>
              </div>
              <a
                href={resetLink}
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white text-center transition-all"
                style={{ background: "#ae894a" }}
              >
                Réinitialiser maintenant →
              </a>
              <p className="text-[11px] text-[#1b2a47]/40 text-center">
                Ce lien ne peut être utilisé qu&apos;une seule fois.
              </p>
            </div>
          ) : (
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition"
                  placeholder="admin@cabinetmartin.fr"
                />
              </div>
              {error && <p className="text-[#1b2a47]/50 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition"
                style={{ background: "#ae894a" }}
              >
                {loading ? "Génération…" : "Générer le lien"}
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-[#1b2a47]/10 text-center">
            <Link href="/admin/login" className="text-xs text-[#1b2a47]/40 hover:text-[#ae894a] transition-colors">
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
