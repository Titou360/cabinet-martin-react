"use client";

import { useEffect, useRef } from "react";
import { FaFileContract, FaClipboardCheck, FaTools } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomTitle from "../ui/CustomTitle/CustomTitle";
import { GoldButton } from "../ui/Buttons/Buttons";

gsap.registerPlugin(ScrollTrigger);

type PostFinancalCardProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

function PostFinancalCard({ title, desc, icon }: PostFinancalCardProps) {
  return (
    <div className="post-financial-card bg-[rgba(249,245,236,0.06)] border border[--overlay] rounded-2xl p-6 hover:bg-[rgba(249,245,236,0.08)] transition-colors duration-300 h-full">
      <div className="flex flex-col items-start gap-4">
        <div className="text-3xl sm:text-4xl text[--overlay]">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text[--overlay]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text[--overlay]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

const PostFinancement = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current || !buttonRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".post-financial-card");
    const button = buttonRef.current;
    const isMobile = window.innerWidth < 768;

    // Init button caché
    gsap.set(button, {
      opacity: 0,
      y: 30,
    });

    if (isMobile) {
      // Animation au scroll sur mobile
      cards.forEach((card) => {
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
          },
        );
      });

      // Bouton apparaît après la dernière card
      gsap.to(button, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cards[cards.length - 1], // Dernière card
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    } else {
      // Animation séquentielle sur desktop/tablet
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
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1, // 100ms entre chaque card
        },
      ).to(
        button,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "+=0.2", // 200ms après la fin des cards
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="post-financement"
      className="relative overflow-hidden bg-(--overlayText) text-(--overlay) min-h-screen"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">
        <CustomTitle title="Post Financement" offset={30} />
        <p className="text-base sm:text-lg font-semibold tracking-[-0.01em] text[--overlay] max-w-3xl">
          On ne s&apos;arrête pas à l&apos;accord. On sécurise le versement, la
          conformité et on peut continuer à vous accompagner pour la suite de
          votre projet.
        </p>

        <div
          ref={cardsRef}
          className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          <PostFinancalCard
            icon={<FaFileContract />}
            title="Convention"
            desc="Suivi des étapes clés et accompagnement à l'élaboration des bilans."
          />
          <PostFinancalCard
            icon={<FaClipboardCheck />}
            title="Conformité garantie"
            desc="Accompagnement à la sécurisation des justificatifs et aide à la préparation aux audits."
          />
          <PostFinancalCard
            icon={<FaTools />}
            title="Outils"
            desc="Proposition de mise en place divers outils : tableaux de bord personnalisés pour le suivi..."
          />
        </div>
        <div 
          ref={buttonRef}
          className="w-full mx-auto flex justify-center mt-10 items-center"
        >
          <GoldButton
            href="/contactez-nous"
            text="Contactez-nous pour en savoir plus"
          />
        </div>
      </div>
    </section>
  );
};

export default PostFinancement;