"use client";

import { useRef } from "react";
import { FaFileContract, FaClipboardCheck, FaTools } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";
import CustomTitle from "../ui/CustomTitle/CustomTitle";
import { GoldButton } from "../ui/Buttons/Buttons";

type PostFinancalCardProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

function PostFinancalCard({ title, desc, icon }: PostFinancalCardProps) {
  return (
    <div className={[
      "post-financial-card h-full rounded-2xl border p-6 transition-all duration-300",
      "bg-[rgba(27,42,71,0.04)] border-[rgba(27,42,71,0.12)]",
      "hover:border-[rgba(174,137,74,0.45)] hover:bg-[rgba(27,42,71,0.06)]",
      "hover:shadow-[0_0_0_1px_rgba(174,137,74,0.18),0_8px_24px_rgba(27,42,71,0.08)]",
    ].join(" ")}>
      <div className="flex flex-col gap-5 h-full">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[rgba(174,137,74,0.1)]">
          <span className="text-2xl text-(--color-brand-100)">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-(--overlay)">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(27,42,71,0.65)" }}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

const PostFinancement = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!cardsRef.current || !buttonRef.current) return;

      const cards = cardsRef.current.querySelectorAll(".post-financial-card");
      const button = buttonRef.current;
      const isMobile = window.innerWidth < 768;

      gsap.set(button, { autoAlpha: 0, y: 24 });

      if (reduce) {
        gsap.set(cards, { clearProps: "all" });
        gsap.set(button, { autoAlpha: 1, y: 0, clearProps: "transform" });
        return;
      }

      if (isMobile) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 65%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        gsap.to(button, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[cards.length - 1],
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            end: "top 45%",
            toggleActions: "play none none none",
          },
        });

        tl.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
        ).to(
          button,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "+=0.1",
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="post-financement"
      className="relative overflow-hidden bg-(--overlayText) text-(--overlay)"
    >
      {/* Accent line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--color-brand-100)/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <CustomTitle title="Post Financement" offset={30} />
          <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "rgba(27,42,71,0.65)" }}>
            On ne s&apos;arrête pas à l&apos;accord. On sécurise le versement, la
            conformité et on peut continuer à vous accompagner pour la suite de
            votre projet.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          <PostFinancalCard
            icon={<FaFileContract />}
            title="Convention"
            desc="Suivi des étapes clés et accompagnement à l'élaboration des bilans intermédiaires et finaux."
          />
          <PostFinancalCard
            icon={<FaClipboardCheck />}
            title="Conformité garantie"
            desc="Sécurisation des justificatifs et aide à la préparation aux audits pour une conformité sans faille."
          />
          <PostFinancalCard
            icon={<FaTools />}
            title="Outils sur-mesure"
            desc="Mise en place de tableaux de bord personnalisés pour un suivi précis et transparent de votre projet."
          />
        </div>

        <div
          ref={buttonRef}
          className="mt-12 flex justify-center"
        >
          <GoldButton href="/partenaires" text="Travaillez avec nous →" />
        </div>
      </div>
    </section>
  );
};

export default PostFinancement;
