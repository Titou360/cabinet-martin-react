"use client";

import CustomTitle from "../ui/CustomTitle/CustomTitle";
import Image from "next/image";

import { useRef } from "react";
import { useIsDark } from "@/app/hooks/useIsDark";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";

import { FaLinkedinIn } from "react-icons/fa";
import { motion } from "motion/react";

type Member = {
  name: string;
  role: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  imgSrc: string;
  linkedin: string;
};

const TEAM: Member[] = [
  {
    name: "Mylène",
    role: "Associée",
    phoneDisplay: "06 24 70 24 62",
    phoneHref: "tel:+33624702462",
    email: "mylene@cabinetmartin-ma.fr",
    imgSrc: "/img/team/mylene.jpg",
    linkedin: "#",
  },
  {
    name: "Alexandre",
    role: "Associé",
    phoneDisplay: "06 45 65 37 61",
    phoneHref: "tel:+33645653761",
    email: "alexandre@cabinetmartin-ma.fr",
    imgSrc: "/img/team/alexandre.jpg",
    linkedin: "#",
  },
];

// ─── Tokens light / dark ─────────────────────────────────────────────────────
type Tokens = {
  isDark: boolean;
  sectionBg: string;
  text: string;
  muted: string;
  cardBg: string;
  cardBorder: string;
  btnBg: string;
};

function useTokens(): Tokens {
  const isDark = useIsDark();

  return isDark
    ? {
        isDark: true,
        sectionBg:  "var(--overlay)",
        text:       "var(--overlayText)",
        muted:      "rgba(249,245,236,0.6)",
        cardBg:     "rgba(249,245,236,0.04)",
        cardBorder: "rgba(249,245,236,0.12)",
        btnBg:      "rgba(249,245,236,0.08)",
      }
    : {
        isDark: false,
        sectionBg:  "var(--bg)",
        text:       "var(--text)",
        muted:      "rgba(27,42,71,0.55)",
        cardBg:     "var(--card-bg)",
        cardBorder: "var(--card-border)",
        btnBg:      "var(--bg)",
      };
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────
function TeamCard({ m, tk }: { m: Member; tk: Tokens }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = cardRef.current;
      if (!el) return;

      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });

      const q = gsap.utils.selector(el);
      const photo = q(".team-photo");
      const name  = q(".team-name");
      const meta  = q(".team-meta");
      const li    = q(".team-li");

      if (reduce) {
        gsap.set([photo, name, meta, li], { clearProps: "all" });
        return;
      }

      gsap.set(photo, { autoAlpha: 0, scale: 1.04 });
      gsap.set(name,  { autoAlpha: 0, y: 12 });
      gsap.set(meta,  { autoAlpha: 0, y: 12 });
      gsap.set(li,    { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      tl.to(photo, { autoAlpha: 1, scale: 1, duration: 0.5 })
        .to(name,  { autoAlpha: 1, y: 0, duration: 0.28 }, "-=0.15")
        .to(meta,  { autoAlpha: 1, y: 0, duration: 0.28 }, "-=0.10")
        .to(li,    { autoAlpha: 1, y: 0, duration: 0.2  }, "-=0.08");

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className={[
        "group rounded-3xl border p-5 sm:p-6 backdrop-blur",
        "transition-[border-color,box-shadow,background,transform] duration-300",
        "hover:-translate-y-0.5",
        "hover:border-[rgba(174,137,74,0.45)]",
        "hover:shadow-[0_0_0_1px_rgba(174,137,74,0.18),0_0_26px_rgba(174,137,74,0.12)]",
      ].join(" ")}
      style={{ background: tk.cardBg, borderColor: tk.cardBorder }}
    >
      {/* Photo */}
      <div className="team-photo relative overflow-hidden rounded-2xl">
        <div className="relative aspect-4/3">
          <Image
            src={m.imgSrc}
            alt={m.name}
            fill
            className={[
              "object-cover transition-transform duration-500 ease-out",
              "group-hover:scale-[1.04]",
              m.name === "Alexandre" ? "object-[50%_80%]" : "object-[50%_40%]",
            ].join(" ")}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Nom + rôle + LinkedIn */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="team-name min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em]" style={{ color: tk.muted }}>
            {m.role.toUpperCase()}
          </p>
          <h3 className="mt-1 truncate text-xl font-semibold tracking-[-0.01em]" style={{ color: tk.text }}>
            {m.name}
          </h3>
        </div>

        <motion.button
          type="button"
          aria-label={`LinkedIn ${m.name}`}
          className="team-li inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-300"
          style={{ background: tk.btnBg, borderColor: tk.cardBorder, color: tk.text }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "tween", duration: 0.08 }}
          onClick={() => {
            if (m.linkedin !== "#") window.open(m.linkedin, "_blank", "noopener,noreferrer");
          }}
        >
          <FaLinkedinIn className="text-lg" />
        </motion.button>
      </div>

      {/* Contacts */}
      <div className="team-meta mt-5 space-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-[0.18em]" style={{ color: tk.muted }}>
            TÉLÉPHONE
          </span>
          <a
            href={m.phoneHref}
            className="text-sm font-light tracking-wide hover:opacity-80 transition-opacity"
            style={{ color: tk.text }}
          >
            {m.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-[0.18em]" style={{ color: tk.muted }}>
            EMAIL
          </span>
          <a
            href={`mailto:${m.email}`}
            className="break-all text-sm font-light tracking-wide hover:opacity-80 transition-opacity"
            style={{ color: tk.text }}
          >
            {m.email}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Equipe() {
  const tk = useTokens();

  return (
    <section
      id="equipe"
      className="transition-colors duration-500"
      style={{ background: tk.sectionBg, color: tk.text }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="max-w-2xl">
          <CustomTitle
            title="Les associés"
            offset={30}
            className={tk.isDark ? "text-(--overlayText)" : "text-(--text)"}
          />
          <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: tk.muted }}>
            Une équipe resserrée, un pilotage clair et un accompagnement orienté résultat.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {TEAM.map((m) => (
            <TeamCard key={m.email} m={m} tk={tk} />
          ))}
        </div>
      </div>
    </section>
  );
}
