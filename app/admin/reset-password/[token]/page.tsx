"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Minimum 8 caractères."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2500);
    } else {
      setError(data.error ?? "Une erreur est survenue.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1b2a47" }}>
      <div className="w-full max-w-sm">
        <div className="bg-[#f9f5ec] rounded-2xl p-8 shadow-2xl">
          {done ? (
            <div className="text-center space-y-3">
              <div className="text-3xl">✓</div>
              <h2 className="text-base font-semibold text-[#1b2a47]">Mot de passe mis à jour</h2>
              <p className="text-xs text-[#1b2a47]/50">Redirection vers la connexion…</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-semibold text-[#1b2a47] tracking-tight">Nouveau mot de passe</h1>
                <p className="text-sm text-[#1b2a47]/50 mt-1">Minimum 8 caractères</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b2a47]/70 mb-1.5 tracking-wide uppercase">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b2a47]/70 mb-1.5 tracking-wide uppercase">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition"
                  style={{ background: "#ae894a" }}
                >
                  {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
                </button>
              </form>
            </>
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
