"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap, ensureGSAP } from "@/app/lib/gsapClient";
import CustomTitle from "../ui/CustomTitle/CustomTitle";

type RealItem = {
  client: string;
  category: string;
  amount: string;
};

const DATA: RealItem[] = [
  { client: "SCI JABALI", category: "Action Logement / ANAH", amount: "600 000 €" },
  { client: "SIAE", category: "Fonds Européens", amount: "600 000 €" },
  { client: "SIAE", category: "Fonds Région Nouvelle-Aquitaine", amount: "400 000 €" },
  { client: "SAS MADONNA", category: "CEE (Certificats d’Économie d’Énergie)", amount: "268 000 €" },
  { client: "SAS GASCOGNE", category: "Fonds Européens", amount: "220 000 €" },
  { client: "SCI CALADORES", category: "CEE (Certificats d’Économie d’Énergie)", amount: "120 000 €" },
  { client: "SCI JABALI", category: "CEE (Certificats d’Économie d’Énergie)", amount: "98 000 €" },
  { client: "SCI LASSIESO", category: "CEE (Certificats d’Économie d’Énergie)", amount: "85 000 €" },
];

function ResultCard({ item }: { item: RealItem }) {
  return (
    <div
      className={[
        "w-full max-w-md",
        "rounded-2xl border p-6 backdrop-blur-sm",
        "border-[rgba(249,245,236,0.18)] bg-[rgba(249,245,236,0.06)]",
      ].join(" ")}
    >
      <p className="text-lg font-semibold tracking-[-0.01em] text-[rgba(249,245,236,0.92)]">
        {item.client}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-[rgba(249,245,236,0.72)]">
        {item.category}
      </p>

      <p className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-(--color-brand-100)">
        {item.amount}
      </p>
    </div>
  );
}

function Bullet({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "relative z-10 flex size-4 items-center justify-center rounded-full border",
        "border-[rgba(249,245,236,0.45)] bg-(--color-brand-900)",
        className,
      ].join(" ")}
    >
      <span className="size-1.5 rounded-full bg-(--color-brand-100)" />
    </span>
  );
}

export default function Realisations() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);

  const finalBoxRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const wrap = wrapRef.current;
      const fill = fillRef.current;
      const finalBox = finalBoxRef.current;

      if (!wrap || !fill) return;

      const TARGET = 2300000;

      const formatFR = (n: number) =>
        new Intl.NumberFormat("fr-FR")
          .format(Math.round(n))
          .replace(/\u202F|\u00A0/g, " ");

      const setAmount = (v: number) => {
        if (!amountRef.current) return;
        amountRef.current.textContent = `${formatFR(v)} €`;
      };

      // ✅ Reduced motion = tout visible
      if (reduce) {
        gsap.set(fill, { scaleY: 1, transformOrigin: "top" });
        gsap.set(wrap.querySelectorAll("[data-card]"), {
          clearProps: "all",
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
        setAmount(TARGET);
        return;
      }

      // ✅ On encapsule TOUT dans un context GSAP => cleanup auto au unmount
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // Mesure recalculable (important avec Lenis / resize)
        const measureFractions = (bullets: HTMLElement[]) => {
          const wrapRect = wrap.getBoundingClientRect();
          const wrapH = wrapRect.height || 1;

          return bullets.map((b) => {
            const r = b.getBoundingClientRect();
            const centerY = r.top - wrapRect.top + r.height / 2;
            return gsap.utils.clamp(0, 1, centerY / wrapH);
          });
        };

        const build = (opts: { bulletSel: string; cardSel: string }) => {
          const bullets = Array.from(wrap.querySelectorAll<HTMLElement>(opts.bulletSel));
          const cards = Array.from(wrap.querySelectorAll<HTMLElement>(opts.cardSel));
          if (!bullets.length || !cards.length) return;

          // init fill
          gsap.set(fill, {
            scaleY: 0,
            transformOrigin: "top",
            willChange: "transform",
          });

          // init cards
          cards.forEach((card) => {
            const side = card.dataset.side;
            gsap.set(card, {
              autoAlpha: 0,
              y: 18,
              x: side === "left" ? -46 : 46,
              willChange: "transform, opacity",
            });
          });

          let fractions = measureFractions(bullets);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrap,
              start: "top 75%",
              end: "bottom 75%",
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: () => {
                fractions = measureFractions(bullets);
              },
            },
          });

          // Ligne blanche qui se remplit
          tl.to(fill, { scaleY: 1, duration: 1 }, 0);

          // Cards après passage de la progress à leur bullet
          cards.forEach((card, i) => {
            const at = fractions[i] ?? i / cards.length;
            tl.to(
              card,
              { autoAlpha: 1, x: 0, y: 0, duration: 0.12, ease: "power2.out" },
              gsap.utils.clamp(0, 1, at + 0.03),
            );
          });

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        };

        mm.add("(min-width: 768px)", () =>
          build({
            bulletSel: "[data-bullet='desktop']",
            cardSel: "[data-card='desktop']",
          }),
        );

        mm.add("(max-width: 767px)", () =>
          build({
            bulletSel: "[data-bullet='mobile']",
            cardSel: "[data-card='mobile']",
          }),
        );

        // ✅ Counter final (pas de reverse)
        if (finalBox) {
          const counter = { val: 0 };

          gsap.fromTo(
            counter,
            { val: 0 },
            {
              val: TARGET,
              duration: 0.9,
              ease: "power2.out",
              immediateRender: false,
              onStart: () => setAmount(0),
              onUpdate: () => setAmount(counter.val),
              scrollTrigger: {
                trigger: finalBox,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
            },
          );
        }

        // cleanup matchMedia via context revert
        return () => mm.revert();
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      id="realisations"
      className="bg-(--color-brand-900) text-(--overlayText)"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
        {/* Header */}
        <div className="max-w-3xl">
          <CustomTitle title="Nos résultats et références clés" offset={30} />
          <p className="text-lg font-semibold tracking-[-0.01em] text-[rgba(249,245,236,0.92)]">
            Notre méthodologie rigoureuse est validée par des résultats concrets.
          </p>
        </div>

        <div className="relative mt-12">
          {/* Timeline wrapper: la ligne s’arrête à la fin des cards */}
          <div ref={wrapRef} className="relative">
            {/* Ligne grise */}
            <span
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-y-0 w-px",
                "bg-[rgba(249,245,236,0.22)]",
                "left-3.5",
                "md:left-1/2 md:-translate-x-1/2",
              ].join(" ")}
            />

            {/* Ligne blanche progress */}
            <span
              ref={fillRef}
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-y-0 w-px",
                "bg-[rgba(249,245,236,0.92)]",
                "left-3.5",
                "md:left-1/2 md:-translate-x-1/2",
                "origin-top",
              ].join(" ")}
              style={{ transform: "scaleY(0)" }}
            />

            <ol className="relative">
              {DATA.map((item, idx) => {
                const isLeft = idx % 2 === 0;

                return (
                  <li key={`${item.client}-${idx}`} className="py-7 md:py-10">
                    {/* MOBILE */}
                    <div className="grid grid-cols-[28px_1fr] items-stretch gap-x-5 md:hidden">
                      <div
                        className="flex self-stretch items-center justify-center"
                        data-bullet="mobile"
                      >
                        <Bullet />
                      </div>

                      <div className="min-w-0" data-card="mobile" data-side="right">
                        <ResultCard item={item} />
                      </div>
                    </div>

                    {/* DESKTOP / TABLET */}
                    <div className="hidden w-full md:flex md:items-center md:justify-center md:gap-x-10">
                      <div className="flex-1">
                        {isLeft ? (
                          <div className="flex justify-end" data-card="desktop" data-side="left">
                            <ResultCard item={item} />
                          </div>
                        ) : (
                          <div aria-hidden="true" />
                        )}
                      </div>

                      <div className="w-20 flex items-center justify-center">
                        <span data-bullet="desktop">
                          <Bullet />
                        </span>
                      </div>

                      <div className="flex-1">
                        {!isLeft ? (
                          <div className="flex justify-start" data-card="desktop" data-side="right">
                            <ResultCard item={item} />
                          </div>
                        ) : (
                          <div aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Final box OUTSIDE wrapRef => la ligne s’arrête avant */}
          <div className="relative z-10 mt-14 flex justify-center">
            <div
              ref={finalBoxRef}
              className={[
                "w-full max-w-xl rounded-2xl border p-6 text-center backdrop-blur-sm",
                "border-[rgba(249,245,236,0.18)] bg-[rgba(249,245,236,0.06)]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold tracking-[0.14em] text-[rgba(249,245,236,0.70)]">
                + DE
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-(--color-brand-100) md:text-4xl">
                <span ref={amountRef}>2 300 000 €</span>
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[rgba(249,245,236,0.72)] md:text-base">
                de subventions obtenues pour nos clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
