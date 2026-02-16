"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";
import CustomTitle from "../ui/CustomTitle/CustomTitle";

import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

type ServiceCardProps = {
  title: string;
  desc: string;
  badge: string;
};

function ServiceCard({ title, desc, badge }: ServiceCardProps) {
  return (
    <div
      className={[
        "h-full rounded-2xl border p-6 backdrop-blur",
        "border-[rgba(249,245,236,0.18)] bg-[rgba(249,245,236,0.06)]",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-0.5",
        "hover:border-[rgba(174,137,74,0.55)]",
        "hover:shadow-[0_0_0_1px_rgba(174,137,74,0.22),0_0_28px_rgba(174,137,74,0.14)]",
      ].join(" ")}
    >
      <div className="mb-3 inline-flex items-center rounded-full border border-[rgba(249,245,236,0.18)] px-3 py-1 text-xs text-[rgba(249,245,236,0.8)]">
        {badge}
      </div>
      <h3 className="text-lg font-semibold text-[rgba(249,245,236,0.95)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[rgba(249,245,236,0.72)]">
        {desc}
      </p>
    </div>
  );
}

export default function NosServices() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  const left1Ref = useRef<HTMLDivElement | null>(null);
  const right1Ref = useRef<HTMLDivElement | null>(null);
  const left2Ref = useRef<HTMLDivElement | null>(null);
  const right2Ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const section = sectionRef.current;
      const copyEl = copyRef.current;

      if (!section || !copyEl) return;

      let killed = false;
      const isMobile = window.innerWidth < 768;

      const CLIP_SHOW = "inset(0% 0% 0% 0%)";
      const CLIP_HIDE_LEFT = "inset(0% 100% 0% 0%)";
      const CLIP_HIDE_RIGHT = "inset(0% 0% 0% 100%)";

      // Reduced motion: tout visible
      if (reduce) {
        gsap.set([left1Ref.current, right1Ref.current, left2Ref.current, right2Ref.current], {
          clearProps: "all",
          autoAlpha: 1,
          x: 0,
          y: 0,
          clipPath: CLIP_SHOW,
        });
        return;
      }

      // ✅ MODE DESKTOP/TABLET : Pin + Timeline
      if (!isMobile) {
        // INIT cards immédiatement
        gsap.set([left1Ref.current, left2Ref.current], {
          autoAlpha: 0,
          x: -80,
          clipPath: CLIP_HIDE_LEFT,
          willChange: "transform, clip-path, opacity",
        });

        gsap.set([right1Ref.current, right2Ref.current], {
          autoAlpha: 0,
          x: 80,
          clipPath: CLIP_HIDE_RIGHT,
          willChange: "transform, clip-path, opacity",
        });

        // Timeline + PIN
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            id: "services-pin",
            trigger: section,
            start: "top top",
            end: "+=1800",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        });

        // Fenêtres de scroll
        const TEXT_START = 0.08;
        const TEXT_WINDOW = 0.95;
        const CARD_GAP = 0.12;
        const CARDS_1_AT = TEXT_START + TEXT_WINDOW + CARD_GAP;
        const PAUSE = 0.12;
        const CARDS_2_AT = CARDS_1_AT + 0.35 + PAUSE;

        // Cards après le texte
        tl.to(left1Ref.current, { autoAlpha: 1, x: 0, clipPath: CLIP_SHOW, duration: 0.35 }, CARDS_1_AT)
          .to(right1Ref.current, { autoAlpha: 1, x: 0, clipPath: CLIP_SHOW, duration: 0.35 }, CARDS_1_AT)
          .to({}, { duration: PAUSE })
          .to(left2Ref.current, { autoAlpha: 1, x: 0, clipPath: CLIP_SHOW, duration: 0.35 }, CARDS_2_AT)
          .to(right2Ref.current, { autoAlpha: 1, x: 0, clipPath: CLIP_SHOW, duration: 0.35 }, CARDS_2_AT);

        // Import dynamique Splitting
        (async () => {
          const mod = await import("splitting");
          const Splitting = mod.default;
          if (killed) return;

          const targets = Array.from(copyEl.querySelectorAll<HTMLElement>("[data-splitting]"));
          const toSplit = targets.filter((t) => !t.classList.contains("splitting"));

          if (toSplit.length) {
            Splitting({ target: toSplit, by: "words" });
          }

          if (killed) return;

          const words = Array.from(copyEl.querySelectorAll<HTMLElement>(".word"));
          if (!words.length) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
            return;
          }

          // init words
          gsap.set(words, {
            opacity: 0.15,
            color: "rgba(249,245,236,0.35)",
            willChange: "opacity, color",
          });

          // reveal mot par mot (inséré dans la timeline déjà pin)
          tl.to(
            words,
            {
              opacity: 1,
              color: "rgba(249,245,236,0.92)",
              duration: TEXT_WINDOW,
              ease: "none",
              stagger: { amount: TEXT_WINDOW, from: "start" },
            },
            TEXT_START,
          );

          requestAnimationFrame(() => ScrollTrigger.refresh());
        })();

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          killed = true;
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }

      // ✅ MODE MOBILE : Animation au scroll sans pin
      else {
        // Animation du texte mot par mot
        (async () => {
          const mod = await import("splitting");
          const Splitting = mod.default;
          if (killed) return;

          const targets = Array.from(copyEl.querySelectorAll<HTMLElement>("[data-splitting]"));
          const toSplit = targets.filter((t) => !t.classList.contains("splitting"));

          if (toSplit.length) {
            Splitting({ target: toSplit, by: "words" });
          }

          if (killed) return;

          const words = Array.from(copyEl.querySelectorAll<HTMLElement>(".word"));
          if (!words.length) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
            return;
          }

          // init words
          gsap.set(words, {
            opacity: 0.15,
            color: "rgba(249,245,236,0.35)",
            willChange: "opacity, color",
          });

          // reveal mot par mot au scroll
          gsap.to(words, {
            opacity: 1,
            color: "rgba(249,245,236,0.92)",
            duration: 1,
            ease: "none",
            stagger: {
              amount: 1,
              from: "start",
            },
            scrollTrigger: {
              trigger: copyEl,
              start: "top 80%",
              end: "bottom 60%",
              scrub: true,
            },
          });

          requestAnimationFrame(() => ScrollTrigger.refresh());
        })();

        // Animation des cards individuellement
        const cards = [left1Ref.current, right1Ref.current, left2Ref.current, right2Ref.current];

        cards.forEach((card) => {
          if (!card) return;

          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 50,
            },
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
            }
          );
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          killed = true;
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-(--overlay) text-(--overlayText) min-h-screen"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <CustomTitle title="Nos Services" offset={30} />

        <div ref={copyRef} className="mt-1 max-w-6xl">
          <p data-splitting className="text-2xl leading-relaxed">
            Dans un environnement économique en constante évolution, l&apos;accès aux financements
            publics et privés est devenu un levier essentiel. Cependant, le processus de recherche
            et d&apos;obtention représente un défi de gestion de projet et de compétence réglementaire
            pour de nombreuses organisations.
          </p>

          <ul className="mt-5 space-y-3 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="shrink-0 text-[rgba(249,245,236,0.35)]">•</span>
              <span data-splitting>
                Multiplicité des Sources de Financement : Des milliers de dispositifs existent,
                émanant de l&apos;Europe, de l&apos;État, des Régions, des Départements, des Collectivités
                Territoriales, ainsi que d&apos;organismes spécifiques (ADEME, Bpifrance, CEE,
                Fondations, etc.).
              </span>
            </li>

            <li className="flex gap-3">
              <span className="shrink-0 text-[rgba(249,245,236,0.35)]">•</span>
              <span data-splitting>
                Évolution Constante et Spécificité : Les critères d&apos;éligibilité, les dates limites et
                les cahiers des charges changent fréquemment et sont spécifiques à chaque appel à
                projets.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="shrink-0 text-[rgba(249,245,236,0.35)]">•</span>
              <span data-splitting>
                Exigence des Dossiers : La constitution des dossiers requiert une technicité
                financière et rédactionnelle spécialisée, rendant l&apos;optimisation des chances de
                succès délicate sans un savoir-faire dédié.
              </span>
            </li>
          </ul>
        </div>

        {/* Cards */}
        <div className="relative z-10 mt-12 space-y-8">
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <div ref={left1Ref} className="h-full">
              <ServiceCard
                badge="01"
                title="Audit d'éligibilité"
                desc="Analyse rapide de votre situation et cadrage des leviers mobilisables (CEE, critères, calendrier)."
              />
            </div>

            <div ref={right1Ref} className="h-full">
              <ServiceCard
                badge="02"
                title="Montage du dossier"
                desc="Constitution, structuration et sécurisation des pièces. Objectif : un dossier fluide et conforme."
              />
            </div>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <div ref={left2Ref} className="h-full">
              <ServiceCard
                badge="03"
                title="Pilotage & échanges"
                desc="Coordination, relances, réponses. Vous restez concentré sur l'opérationnel."
              />
            </div>

            <div ref={right2Ref} className="h-full">
              <ServiceCard
                badge="04"
                title="Paiement à la réussite"
                desc="Rémunération alignée : vous payez quand le projet aboutit (selon conditions définies)."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}