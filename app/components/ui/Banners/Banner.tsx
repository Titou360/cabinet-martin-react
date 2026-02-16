"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";

export default function Banner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const priceRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const reveals = q(".banner-reveal") as HTMLElement[];

      // ✅ kill uniquement CE banner (évite de casser le reste)
      ScrollTrigger.getById("banner-in")?.kill();
      gsap.killTweensOf([...reveals, priceRef.current].filter(Boolean) as HTMLElement[]);

      // ✅ Reduced motion: tout visible
      if (reduce) {
        gsap.set(reveals, { clearProps: "all" });
        gsap.set(priceRef.current, { clearProps: "all" });
        gsap.set(reveals, { autoAlpha: 1, y: 0 });
        gsap.set(priceRef.current, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      // États init
      gsap.set(priceRef.current, { autoAlpha: 0, scale: 0.92, y: 10 });
      gsap.set(reveals, { autoAlpha: 0, y: 36 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          id: "banner-in",
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      tl.to(
        reveals,
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 },
        0.12,
      ).to(
        priceRef.current,
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 },
        ">-0.05",
      );

      // Important si d’autres sections pin/split changent la height
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="banner" className="bg-(--color-brand-200)">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
        <div className={["flex items-start gap-10", "flex-col", "md:flex-row", "md:items-center"].join(" ")}>
          <div className="order-1 w-full md:order-0 md:w-1/4">
            <span
              ref={priceRef}
              className="block text-(--color-brand-100) font-bold leading-none text-[clamp(4rem,12vw,7rem)] md:text-9xl md:text-center"
            >
              0 €
            </span>
          </div>

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
                Le client ne débourse rien en frais de conseil si le financement n&apos;est pas sécurisé
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
