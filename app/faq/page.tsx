"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";
import * as Accordion from "@radix-ui/react-accordion";
import { FaChevronDown } from "react-icons/fa";
import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { motion } from "motion/react";

import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "Quels types de financements pouvez-vous m'aider à obtenir ?",
    answer:
      "Nous vous accompagnons sur l'ensemble des dispositifs de financement public et privé : subventions européennes, nationales et régionales, certificats d'économie d'énergie (CEE), crédits d'impôt, prêts bonifiés, et financements de fondations. Notre expertise couvre tous les secteurs d'activité.",
  },
  {
    id: "faq-2",
    question: "Combien coûtent vos services ?",
    answer:
      "Notre modèle est basé sur le succès : vous ne payez que si votre dossier aboutit. Nos honoraires sont calculés en pourcentage du montant obtenu, selon des conditions définies en amont. Pas de frais cachés, pas de mauvaise surprise.",
  },
  {
    id: "faq-3",
    question: "Combien de temps prend le processus de demande de financement ?",
    answer:
      "Les délais varient selon le type de financement (de 2 à 12 mois en moyenne). Nous vous accompagnons à chaque étape pour optimiser les chances de succès et respecter les échéances imposées par les organismes financeurs.",
  },
  {
    id: "faq-4",
    question: "Dois-je être une grande entreprise pour bénéficier de vos services ?",
    answer:
      "Absolument pas ! Nous accompagnons aussi bien les TPE/PME que les grandes entreprises, les associations, les collectivités et les porteurs de projets. Chaque projet mérite un financement adapté, quelle que soit sa taille.",
  },
  {
    id: "faq-5",
    question: "Garantissez-vous l'obtention du financement ?",
    answer:
      "Nous maximisons vos chances de succès grâce à notre expertise et notre connaissance approfondie des dispositifs, mais nous ne pouvons garantir à 100% l'obtention. Les décisions finales appartiennent aux organismes financeurs. Notre taux de réussite est cependant très élevé.",
  },
  {
    id: "faq-6",
    question: "Puis-je gérer mon dossier seul après votre intervention ?",
    answer:
      "Oui, tout à fait. Nous vous formons et vous transférons toutes les compétences nécessaires pour gérer vos futurs dossiers en autonomie si vous le souhaitez. Nous restons également disponibles pour un accompagnement ponctuel.",
  },
];

const FAQAccordion = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const accordionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      const section = sectionRef.current;
      const introEl = introRef.current;
      const accordionEl = accordionRef.current;

      if (!section || !introEl || !accordionEl) return;

      let killed = false;
      const isMobile = window.innerWidth < 768;

      if (reduce) {
        gsap.set([introEl, accordionEl], {
          clearProps: "all",
          autoAlpha: 1,
        });
        return;
      }

      // Animation du texte d'intro mot par mot
      (async () => {
        const mod = await import("splitting");
        const Splitting = mod.default;
        if (killed) return;

        const targets = Array.from(
          introEl.querySelectorAll<HTMLElement>("[data-splitting]")
        );
        const toSplit = targets.filter((t) => !t.classList.contains("splitting"));

        if (toSplit.length) {
          Splitting({ target: toSplit, by: "words" });
        }

        if (killed) return;

        const words = Array.from(
          introEl.querySelectorAll<HTMLElement>(".word")
        );
        if (!words.length) {
          requestAnimationFrame(() => ScrollTrigger.refresh());
          return;
        }

        gsap.set(words, {
          opacity: 0.15,
          color: "rgba(249,245,236,0.35)",
          willChange: "opacity, color",
        });

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
            trigger: introEl,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      })();

      // Animation des items FAQ
      const faqItems =
        accordionEl.querySelectorAll(".faq-accordion-item");

      if (isMobile) {
        // Mobile: chaque item s'anime individuellement
        faqItems.forEach((item) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "top 65%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      } else {
        // Desktop/Tablet: animation séquentielle
        gsap.fromTo(
          faqItems,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: accordionEl,
              start: "top 75%",
              end: "top 45%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        killed = true;
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="border-b relative overflow-hidden bg-(--overlay) text-(--overlayText) min-h-screen"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">
        <CustomTitle title="Questions Fréquentes" offset={30} />

        <div ref={introRef}>
          <p
            data-splitting
            className="text-base sm:text-lg leading-relaxed text-[rgba(249,245,236,0.92)] max-w-3xl"
          >
            Vous avez des questions ? Nous avons les réponses. Découvrez les
            informations essentielles sur nos services d&apos;accompagnement au
            financement.
          </p>
        </div>

        <div ref={accordionRef} className="mt-10 sm:mt-12 md:mt-14">
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {faqData.map((item) => (
              <Accordion.Item
                key={item.id}
                value={item.id}
                className="faq-accordion-item bg-[rgba(249,245,236,0.04)] border border-[rgba(249,245,236,0.12)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[rgba(174,137,74,0.35)] hover:bg-[rgba(249,245,236,0.06)]"
              >
                <Accordion.Trigger className="group w-full flex items-center justify-between px-6 py-5 text-left transition-all">
                  <span className="text-base sm:text-lg font-semibold text-[rgba(249,245,236,0.92)] pr-4 group-hover:text-[rgba(174,137,74,1)]">
                    {item.question}
                  </span>
                  <motion.div
                    className="shrink-0 text-[rgba(249,245,236,0.72)] group-hover:text-[rgba(174,137,74,1)]"
                    animate={{ rotate: 0 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </motion.div>
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                  <div className="px-6 pb-5 pt-2 text-sm sm:text-base leading-relaxed text-[rgba(249,245,236,0.72)]">
                    {item.answer}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;