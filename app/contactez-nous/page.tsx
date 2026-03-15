"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import CustomTitle from '../components/ui/CustomTitle/CustomTitle';
import Link from "next/link";

import SocialBar from "../components/ui/SocialBar/SocialBar";
import { gsap, ensureGSAP } from "@/app/lib/gsapClient";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type Status = "" | "success" | "error";

const EMAILJS_SERVICE_ID = "service_dt2pm2p";
const EMAILJS_TEMPLATE_ID = "template_nxroukc";
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "YOUR_PUBLIC_KEY";

export default function ContactPage() {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", phone: "", message: "",
  });
  const [status, setStatus] = useState<Status>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Suit le thème du site en temps réel
  useEffect(() => {
    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") === "dark";

    setIsDark(getTheme());

    const observer = new MutationObserver(() => setIsDark(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      ensureGSAP();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scope = scopeRef.current;
      if (!scope) return;

      const q = gsap.utils.selector(scope);
      const title = q("[data-anim='title']");
      const cards = q("[data-anim='card']");

      gsap.set(title, { autoAlpha: 0, y: -24 });
      gsap.set(cards, { autoAlpha: 0, y: 22 });

      if (reduce) {
        gsap.set(title, { autoAlpha: 1, y: 0, clearProps: "transform" });
        gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.9 }, 0)
        .to(cards, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 0.2);
    },
    { scope: scopeRef },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        console.error("EmailJS public key manquante. Mets NEXT_PUBLIC_EMAILJS_PUBLIC_KEY dans ton .env");
        setStatus("error");
        return;
      }

      const mod = await import("@emailjs/browser");
      await mod.default.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
          to_name: "Votre Nom",
        },
        EMAILJS_PUBLIC_KEY,
      );

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { scale: 1 },
          { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" },
        );
      }
    } catch (err) {
      console.error("Erreur EmailJS:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Tokens selon le thème ───────────────────────────────────────────────
  const tokens = {
    bg:          isDark ? "var(--overlay)"                      : "var(--bg)",
    text:        isDark ? "var(--overlayText)"                  : "var(--text)",
    subtitle:    isDark ? "rgba(249,245,236,0.72)"              : "var(--muted)",
    cardBg:      isDark ? "rgba(249,245,236,0.04)"              : "var(--card-bg)",
    cardBorder:  isDark ? "rgba(249,245,236,0.12)"              : "var(--card-border)",
    cardHover:   isDark ? "rgba(249,245,236,0.06)"              : "rgba(27,42,71,0.06)",
    borderHover: isDark ? "rgba(174,137,74,0.35)"               : "rgba(174,137,74,0.45)",
    label:       isDark ? "rgba(249,245,236,0.72)"              : "rgba(27,42,71,0.7)",
    inputBg:     isDark ? "rgba(249,245,236,0.05)"              : "rgba(27,42,71,0.04)",
    inputBorder: isDark ? "rgba(249,245,236,0.12)"              : "rgba(27,42,71,0.14)",
    inputText:   isDark ? "rgba(249,245,236,0.92)"              : "var(--text)",
    placeholder: isDark ? "rgba(249,245,236,0.3)"               : "rgba(27,42,71,0.35)",
    iconBg:      isDark ? "rgba(174,137,74,0.15)"               : "rgba(174,137,74,0.12)",
    infoText:    isDark ? "rgba(249,245,236,0.72)"              : "var(--muted)",
    linkHover:   isDark ? "rgba(249,245,236,0.72)"              : "var(--text)",
    disabledBtn: isDark ? "rgba(249,245,236,0.12)"              : "rgba(27,42,71,0.1)",
    disabledTxt: isDark ? "rgba(249,245,236,0.35)"              : "rgba(27,42,71,0.35)",
  };

  const inputStyle = {
    background: tokens.inputBg,
    borderColor: tokens.inputBorder,
    color: tokens.inputText,
  };

  return (
    <main
      ref={scopeRef}
      className="relative overflow-hidden transition-colors duration-500"
      style={{ background: tokens.bg, color: tokens.text }}
    >
      <div className="min-h-screen mx-auto max-w-6xl px-4 py-20 md:py-28">

        <CustomTitle
          title="Parlons-en"
          offset={30}
          as="h1"
          className={isDark ? "text-(--overlayText)" : "text-(--text)"}
        />

        <div data-anim="title" className="mt-4 mb-16">
          <p className="text-lg sm:text-xl max-w-2xl" style={{ color: tokens.subtitle }}>
            Une question ? Un projet ? Laissez-nous un message et nous vous
            répondrons dans les plus brefs délais.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* ── Formulaire ───────────────────────────────────────────────── */}
          <motion.div
            data-anim="card"
            className="rounded-2xl p-8 border transition-all duration-500"
            style={{ background: tokens.cardBg, borderColor: tokens.cardBorder }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

              {(["name", "email", "phone", "message"] as const).map((field) => {
                const config = {
                  name:    { label: "Nom complet",   type: "text",     placeholder: "Jean Dupont",                         rows: undefined },
                  email:   { label: "Email",         type: "email",    placeholder: "jean@exemple.fr",                     rows: undefined },
                  phone:   { label: "Téléphone",     type: "tel",      placeholder: "06 12 34 56 78",                      rows: undefined },
                  message: { label: "Message",       type: "textarea", placeholder: "Décrivez votre projet ou demande...", rows: 5 },
                }[field];

                return (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-semibold mb-2"
                      style={{ color: tokens.label }}
                    >
                      {config.label}
                    </label>
                    {config.type === "textarea" ? (
                      <textarea
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        rows={config.rows}
                        placeholder={config.placeholder}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[rgba(174,137,74,0.6)] focus:border-transparent transition-all resize-none"
                        style={inputStyle}
                      />
                    ) : (
                      <input
                        type={config.type}
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== "phone"}
                        placeholder={config.placeholder}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[rgba(174,137,74,0.6)] focus:border-transparent transition-all"
                        style={inputStyle}
                      />
                    )}
                  </div>
                );
              })}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? {} : { scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all"
                style={
                  isSubmitting
                    ? { background: tokens.disabledBtn, color: tokens.disabledTxt, cursor: "not-allowed" }
                    : { background: "var(--color-brand-100)", color: "var(--overlay)" }
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  "Envoyer le message"
                )}
              </motion.button>

              <div aria-live="polite">
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: "rgba(174,137,74,0.12)",
                      border: "1px solid rgba(174,137,74,0.3)",
                      color: "var(--color-brand-100)",
                    }}
                  >
                    ✓ Message envoyé avec succès !<br />On revient vers vous rapidement...
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: tokens.cardBg,
                      border: `1px solid ${tokens.cardBorder}`,
                      color: tokens.infoText,
                    }}
                  >
                    ✗ Erreur lors de l&apos;envoi. Veuillez réessayer.
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>

          {/* ── Infos de contact ─────────────────────────────────────────── */}
          <div className="space-y-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" style={{ color: "var(--color-brand-100)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email",
                content: <a href="mailto:contact@exemple.fr" className="transition-colors hover:underline" style={{ color: tokens.infoText }}>contact@exemple.fr</a>,
              },
              {
                icon: (
                  <svg className="w-6 h-6" style={{ color: "var(--color-brand-100)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: "Téléphone",
                content: <a href="tel:+33612345678" className="transition-colors hover:underline" style={{ color: tokens.infoText }}>+33 6 12 34 56 78</a>,
              },
              {
                icon: (
                  <svg className="w-6 h-6" style={{ color: "var(--color-brand-100)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                label: "Adresse",
                content: <p style={{ color: tokens.infoText }}>3 rue de Pion<br />40465 Pontonx Sur l&apos;Adour, France</p>,
              },
            ].map(({ icon, label, content }) => (
              <motion.div
                key={label}
                data-anim="card"
                className="rounded-2xl p-6 border transition-all duration-300"
                style={{ background: tokens.cardBg, borderColor: tokens.cardBorder }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl shrink-0" style={{ background: tokens.iconBg }}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1" style={{ color: tokens.text }}>
                      {label}
                    </h3>
                    {content}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Réseaux */}
            <motion.div
              data-anim="card"
              className="rounded-2xl p-6 border transition-all duration-300"
              style={{ background: tokens.cardBg, borderColor: tokens.cardBorder }}
            >
              <h3 className="text-base font-bold mb-4" style={{ color: tokens.text }}>
                Suivez-nous
              </h3>
              <SocialBar />
            </motion.div>
          </div>
        </div>

        <Link
          href="/"
          className="block text-center mt-10 mb-8 transition-colors hover:underline"
          style={{ color: tokens.subtitle }}
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
