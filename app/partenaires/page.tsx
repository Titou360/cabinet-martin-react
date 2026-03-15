"use client";

import { useRef } from "react";
import { useIsDark } from "../hooks/useIsDark";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/app/lib/gsapClient";
import { motion } from "motion/react";
import {
  FaHandshake,
  FaLightbulb,
  FaFileAlt,
  FaCheckCircle,
  FaUserTie,
  FaChartLine,
  FaSearch,
  FaFolderOpen,
  FaShieldAlt,
  FaClipboardList,
} from "react-icons/fa";
import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { GoldButton } from "../components/ui/Buttons/Buttons";

import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

// ─── Tokens light / dark ─────────────────────────────────────────────────────
function useTokens() {
  const isDark = useIsDark();

  return {
    isDark,
    bg:          isDark ? "var(--overlay)"                 : "var(--bg)",
    text:        isDark ? "var(--overlayText)"             : "var(--text)",
    subtitle:    isDark ? "rgba(249,245,236,0.72)"         : "var(--muted)",
    cardBg:      isDark ? "rgba(249,245,236,0.04)"         : "var(--card-bg)",
    cardBorder:  isDark ? "rgba(249,245,236,0.12)"         : "var(--card-border)",
    cardHoverBg: isDark ? "rgba(249,245,236,0.06)"         : "rgba(27,42,71,0.06)",
    titleText:   isDark ? "rgba(249,245,236,0.95)"         : "var(--text)",
    muteText:    isDark ? "rgba(249,245,236,0.72)"         : "var(--muted)",
    iconColor:   "var(--color-brand-100)",
    checkColor:  "var(--color-brand-100)",
  };
}

// ─── CollaborationCard ────────────────────────────────────────────────────────
type CollaborationCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  t: ReturnType<typeof useTokens>;
};

const CollaborationCard = ({ icon, title, description, features, t }: CollaborationCardProps) => (
  <motion.div
    className="collaboration-card h-full rounded-2xl p-6 sm:p-8 border transition-all duration-300"
    style={{ background: t.cardBg, borderColor: t.cardBorder }}
    whileHover={{ y: -8 }}
  >
    <div className="flex flex-col h-full">
      <div className="text-4xl sm:text-5xl mb-4" style={{ color: t.iconColor }}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: t.titleText }}>
        {title}
      </h3>
      <p className="text-sm sm:text-base mb-6 leading-relaxed" style={{ color: t.muteText }}>
        {description}
      </p>
      <ul className="space-y-3 mt-auto">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <FaCheckCircle className="shrink-0 mt-1" style={{ color: t.checkColor }} />
            <span className="text-sm" style={{ color: t.muteText }}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// ─── SplitItem ────────────────────────────────────────────────────────────────
type SplitItemProps = {
  icon: React.ReactNode;
  text: string;
  t: ReturnType<typeof useTokens>;
};

const SplitItem = ({ icon, text, t }: SplitItemProps) => (
  <motion.div
    className="flex items-start gap-3 p-4 rounded-lg border transition-colors duration-300"
    style={{ background: t.cardBg, borderColor: t.cardBorder }}
    whileHover={{ x: 5 }}
  >
    <div className="text-xl shrink-0 mt-0.5" style={{ color: t.iconColor }}>
      {icon}
    </div>
    <p className="text-sm sm:text-base" style={{ color: t.muteText }}>
      {text}
    </p>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const TravaillezAvecNous = () => {
  const t = useTokens();

  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef   = useRef<HTMLDivElement | null>(null);
  const splitRef   = useRef<HTMLDivElement | null>(null);
  const cardsRef   = useRef<HTMLDivElement | null>(null);
  const ctaRef     = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const section = sectionRef.current;
      const introEl = introRef.current;
      const splitEl = splitRef.current;
      const cardsEl = cardsRef.current;
      const ctaEl   = ctaRef.current;

      if (!section || !introEl || !splitEl || !cardsEl || !ctaEl) return;

      let killed = false;
      const isMobile = window.innerWidth < 768;

      if (reduce) {
        gsap.set([introEl, splitEl, cardsEl, ctaEl], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      // Animation texte intro mot par mot
      (async () => {
        const mod = await import("splitting");
        const Splitting = mod.default;
        if (killed) return;

        const targets = Array.from(introEl.querySelectorAll<HTMLElement>("[data-splitting]"));
        const toSplit = targets.filter((t) => !t.classList.contains("splitting"));
        if (toSplit.length) Splitting({ target: toSplit, by: "words" });
        if (killed) return;

        const words = Array.from(introEl.querySelectorAll<HTMLElement>(".word"));
        if (!words.length) { requestAnimationFrame(() => ScrollTrigger.refresh()); return; }

        gsap.set(words, { opacity: 0.15, willChange: "opacity, color" });
        gsap.to(words, {
          opacity: 1,
          duration: 1,
          ease: "none",
          stagger: { amount: 1, from: "start" },
          scrollTrigger: { trigger: introEl, start: "top 80%", end: "bottom 60%", scrub: true },
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
      })();

      // SplitItems
      const splitItems = splitEl.querySelectorAll(".split-item");
      gsap.fromTo(splitItems, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1,
        scrollTrigger: { trigger: splitEl, start: "top 75%", toggleActions: "play none none none" },
      });

      // Cards
      const cards = cardsEl.querySelectorAll(".collaboration-card");
      if (isMobile) {
        cards.forEach((card) => {
          gsap.fromTo(card, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%", end: "top 65%", toggleActions: "play none none none" },
          });
        });
      } else {
        gsap.fromTo(cards, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.15,
          scrollTrigger: { trigger: cardsEl, start: "top 75%", toggleActions: "play none none none" },
        });
      }

      // CTA
      gsap.fromTo(ctaEl, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ctaEl, start: "top 85%", toggleActions: "play none none none" },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        killed = true;
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: sectionRef },
  );

  const collaborationModes = [
    {
      icon: <FaHandshake />,
      title: "Accompagnement ponctuel",
      description: "Pour un dossier spécifique ou une opportunité identifiée. Intervention ciblée sur un projet défini.",
      features: ["Montage d'un dossier unique", "Audit d'éligibilité express", "Support jusqu'au versement"],
    },
    {
      icon: <FaLightbulb />,
      title: "Partenariat récurrent",
      description: "Collaboration continue pour maximiser vos opportunités de financement tout au long de l'année.",
      features: ["Veille permanente sur les dispositifs", "Plusieurs dossiers par an", "Relation de confiance durable"],
    },
    {
      icon: <FaFileAlt />,
      title: "Formation & autonomie",
      description: "Nous vous transférons notre savoir-faire pour que vous puissiez gérer vos dossiers en interne.",
      features: ["Formation de vos équipes", "Documentation complète", "Support ponctuel si besoin"],
    },
  ];

  return (
    <section
      id="travailler-avec-nous"
      ref={sectionRef}
      className="relative border-b overflow-hidden min-h-screen transition-colors duration-500"
      style={{
        background: t.bg,
        color: t.text,
        borderColor: t.isDark ? "rgba(249,245,236,0.1)" : "var(--card-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">

        {/* 1. Intro */}
        <CustomTitle
          title="Travailler avec nous"
          offset={30}
          className={t.isDark ? "text-(--overlayText)" : "text-(--text)"}
        />

        <div ref={introRef} className="max-w-4xl mt-4">
          <p
            data-splitting
            className="text-lg sm:text-xl leading-relaxed"
            style={{ color: t.subtitle }}
          >
            Parce que votre temps est précieux et que chaque euro compte. Nous
            gérons la complexité administrative pendant que vous vous concentrez
            sur votre cœur de métier. Un partenariat gagnant-gagnant où chacun
            joue son rôle.
          </p>
        </div>

        {/* 2. Split — Vous gardez / Nous prenons */}
        <div
          ref={splitRef}
          className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* VOUS */}
          <div className="split-item">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <FaUserTie className="text-3xl" style={{ color: t.iconColor }} />
                <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: t.titleText }}>
                  Vous gardez
                </h3>
              </div>
              <p className="text-sm sm:text-base mb-6" style={{ color: t.muteText }}>
                Concentrez-vous sur l&apos;essentiel de votre activité
              </p>
            </div>
            <div className="space-y-3">
              <SplitItem t={t} icon={<FaChartLine />} text="La relation client et la vision stratégique" />
              <SplitItem t={t} icon={<FaLightbulb />} text="Le pilotage opérationnel de votre projet" />
              <SplitItem t={t} icon={<FaUserTie />}   text="Les décisions finales et la gouvernance" />
            </div>
          </div>

          {/* NOUS */}
          <div className="split-item">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <FaHandshake className="text-3xl" style={{ color: t.iconColor }} />
                <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: t.titleText }}>
                  Nous prenons
                </h3>
              </div>
              <p className="text-sm sm:text-base mb-6" style={{ color: t.muteText }}>
                Toute la complexité administrative et réglementaire
              </p>
            </div>
            <div className="space-y-3">
              <SplitItem t={t} icon={<FaSearch />}        text="La veille quotidienne sur les dispositifs" />
              <SplitItem t={t} icon={<FaFolderOpen />}    text="Le montage complet des dossiers" />
              <SplitItem t={t} icon={<FaShieldAlt />}     text="La conformité et la sécurisation juridique" />
              <SplitItem t={t} icon={<FaClipboardList />} text="Le suivi jusqu'au versement effectif" />
            </div>
          </div>
        </div>

        {/* 3. Modes de collaboration */}
        <div className="mt-20 sm:mt-24 md:mt-28">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: t.titleText }}>
              3 modes de collaboration
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: t.muteText }}>
              Choisissez la formule qui correspond à vos besoins et à votre situation
            </p>
          </div>

          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {collaborationModes.map((mode, i) => (
              <CollaborationCard key={i} t={t} {...mode} />
            ))}
          </div>
        </div>

        {/* 4. CTA */}
        <div
          ref={ctaRef}
          className="mt-20 sm:mt-24 md:mt-28 rounded-2xl p-8 sm:p-12 text-center border transition-colors duration-500"
          style={{
            background: t.isDark ? "rgba(249,245,236,0.04)" : "rgba(27,42,71,0.03)",
            borderColor: t.isDark ? "rgba(174,137,74,0.25)" : "rgba(174,137,74,0.3)",
          }}
        >
          {/* Accent line */}
          <div className="mx-auto mb-6 h-px w-16 bg-linear-to-r from-transparent via-(--color-brand-100) to-transparent" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: t.titleText }}>
            Prêt à démarrer ?
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8" style={{ color: t.muteText }}>
            Échangeons 30 minutes pour comprendre vos besoins et identifier les
            opportunités de financement adaptées à votre projet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <GoldButton href="/prendre-rdv" text="Échanger 30 min" />
            <motion.a
              href="/plaquette.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300"
              style={{
                color: t.muteText,
                borderColor: t.isDark ? "rgba(249,245,236,0.2)" : "rgba(27,42,71,0.18)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileAlt />
              Recevoir la plaquette PDF
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravaillezAvecNous;
