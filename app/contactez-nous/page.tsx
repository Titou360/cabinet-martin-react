"use client";

import { useRef, useState } from "react";
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

// ✅ EmailJS
const EMAILJS_SERVICE_ID = "service_7q2onth";
const EMAILJS_TEMPLATE_ID = "template_te9ly4m";
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "YOUR_PUBLIC_KEY";

export default function ContactPage() {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<Status>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Animations d’entrée (safe + clean en dev/StrictMode)
  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scope = scopeRef.current;
      if (!scope) return;

      const q = gsap.utils.selector(scope);
      const title = q("[data-anim='title']");
      const cards = q("[data-anim='card']");

      // états init
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus("");

    try {
      // ✅ évite “fausse config” silencieuse
      if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        console.error(
          "EmailJS public key manquante. Mets NEXT_PUBLIC_EMAILJS_PUBLIC_KEY dans ton .env",
        );
        setStatus("error");
        return;
      }

      // ✅ import dynamique = safe si un jour EmailJS touche window/document au load
      const mod = await import("@emailjs/browser");
      const emailjs = mod.default;

      await emailjs.send(
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

      console.log("EMAILJS_PUBLIC_KEY =", EMAILJS_PUBLIC_KEY);

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      // petit “pop” de succès
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

  return (
    <main ref={scopeRef} className="bg-linear-to-br from-slate-950 dark:from-slate-white via-slate-900 to-slate-800 relative overflow-hidden">
       <div
      className="min-h-screen mx-auto max-w-6xl px-4 py-20 md:py-28"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <CustomTitle title="Parlons-en" offset={30} className="text-(--color-brand-300)" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Title Section */}
        <div data-anim="title" className="text-center mb-16">
          <p
            className="text-(--color-brand-300) text-xl max-w-2xl mx-auto"
          >
            Une question ? Un projet ? Laissez-nous un message et nous vous répondrons dans
            les plus brefs délais.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            data-anim="card"
            className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="jean@exemple.fr"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={[
                  "w-full py-4 px-6 rounded-xl font-bold text-lg transition-all text-white shadow-lg shadow-violet-500/25",
                  isSubmitting
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center"
                  >
                    ✓ Message envoyé avec succès ! <br/>
                    On revient vers vous rapidement...
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                  >
                    ✗ Erreur lors de l&apos;envoi. Vérifie ta clé EmailJS et réessaye.
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div
              data-anim="card"
              className="bg-linear-to-br from-violet-500/10 to-cyan-500/10 backdrop-blur-xl p-8 rounded-3xl border border-violet-500/20 group hover:border-violet-500/40 transition-all"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-500/20 rounded-2xl group-hover:bg-violet-500/30 transition-all">
                  <svg className="w-7 h-7 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-1">Email</h3>
                  <a href="mailto:contact@exemple.fr" className="text-slate-400 hover:text-violet-400 transition-colors">
                    contact@exemple.fr
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              data-anim="card"
              className="bg-linear-to-br from-cyan-500/10 to-violet-500/10 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/20 group hover:border-cyan-500/40 transition-all"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-2xl group-hover:bg-cyan-500/30 transition-all">
                  <svg className="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-1">Téléphone</h3>
                  <a href="tel:+33612345678" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    +33 6 12 34 56 78
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              data-anim="card"
              className="bg-linear-to-br from-violet-500/10 to-cyan-500/10 backdrop-blur-xl p-8 rounded-3xl border border-violet-500/20 group hover:border-violet-500/40 transition-all"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-500/20 rounded-2xl group-hover:bg-violet-500/30 transition-all">
                  <svg className="w-7 h-7 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-1">Adresse</h3>
                  <p className="text-slate-400">
                     3 rue de Pion
                    <br />
                    40465 Pontonx Sur l&apos;Adour, France
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              data-anim="card"
              className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-slate-200 mb-4">Suivez-nous</h3>
              <SocialBar />
            </motion.div>
          </div>
        </div>
                <Link
          href="/"
          className="block text-center mt-8 mb-16 text-(--color-brand-300) hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div> </main>
    
  );
}
