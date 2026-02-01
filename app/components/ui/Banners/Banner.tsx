"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Banner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const priceRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);

      // états init
      gsap.set(priceRef.current, { autoAlpha: 0, scale: 0.92, y: 10 });
      gsap.set(q(".banner-reveal"), { autoAlpha: 0, y: 36 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          // ✅ pas de reverse
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: "power3.out" },
        markers: true,
      });

      // le texte glisse bas -> haut
      tl.to(
        q(".banner-reveal"),
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 },
        0.12
      );

      // puis le 0€ s'affiche
      tl.to(priceRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.75, delay:0.1 });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="banner"
      className="bg-(--color-brand-200)"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
        <div
          className={[
            "flex items-start gap-10",
            "flex-col",          // mobile: stack
            "md:flex-row",       // tablette/desktop: ligne
            "md:items-center",
          ].join(" ")}
        >
          {/* 0€ */}
          <div className="order-1 w-full md:order-0 md:w-1/4">
            <span
              ref={priceRef}
              className="block text-(--color-brand-100) font-bold leading-none text-[clamp(4rem,12vw,7rem)] md:text-9xl md:text-center"
            >
              0 €
            </span>
          </div>

          {/* Texte */}
          <div className="order-2 w-full md:w-3/4">
            <div className="border-b border-white/25 pb-6 mb-6">
              <span className="banner-reveal block text-(--color-brand-300) font-semibold text-[clamp(1.7rem,5.5vw,3.2rem)]">
                Risque Financier Initial
              </span>
              <p className="banner-reveal mt-2 text-(--color-brand-300) text-[clamp(1.05rem,4.2vw,2rem)] leading-snug opacity-90">
                Notre modèle est basé sur le succès.
              </p>
            </div>

            <div>
              <span className="banner-reveal block text-(--color-brand-300) font-semibold text-[clamp(1.7rem,5.5vw,3.2rem)]">
                Rémunération uniquement à l&apos;obtention
              </span>
              <p className="banner-reveal mt-2 text-(--color-brand-300) text-[clamp(1.05rem,4.2vw,2rem)] leading-snug opacity-90">
                Le client ne débourse rien en frais de conseil si le financement
                n&apos;est pas sécurisé
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
