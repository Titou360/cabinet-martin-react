"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";
import SocialBar from "../ui/SocialBar/SocialBar";

import { FooterButton, GoldButton } from "../ui/Buttons/Buttons";

export default function Footer() {
  const scopeRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      ensureGSAP();

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const scope = scopeRef.current;
      if (!scope) return;

      // ✅ kill d'éventuels anciens triggers liés à ce footer
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === scope) st.kill();
      });

      if (reduce) return;

      const q = gsap.utils.selector(scope);

      const top = q('[data-fx="top"]');
      const ctas = q('[data-fx="cta"]');
      const cols = q('[data-fx="col"]');
      const bottom = q('[data-fx="bottom"]');

      const all = [...top, ...ctas, ...cols, ...bottom];
      gsap.set(all, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: scope,
          start: "top 88%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      tl.to(top, { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(
          ctas,
          { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 },
          "-=0.20",
        )
        .to(
          cols,
          { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.1 },
          "-=0.10",
        )
        .to(bottom, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.05");

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: scopeRef },
  );

  return (
    <footer
      ref={scopeRef}
      className="bg-(--color-brand-900) text-(--overlayText)"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-8">
        <div
          data-fx="top"
          className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-18 shrink-0 items-center justify-center bg-[rgba(27,42,71,0.08)]">
                <Image
                  src="/img/logo/logo-cabinet-martin-ma-128x128.png"
                  className="object-contain"
                  width={64}
                  height={64}
                  alt="Logo Cabinet Martin M&A"
                />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-wide">
                  Cabinet Martin M&amp;A
                </p>
                <p className="text-xs text-white/65">
                  Landes · Nouvelle-Aquitaine · France entière
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Accompagnement à la recherche et à l’obtention de subventions
              (CEE). Une démarche structurée, rapide et conforme, avec une
              logique de rémunération alignée sur la réussite.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-70">
            <GoldButton href="/prendre-rdv" text="Prendre RDV" data-fx="cta" />

            <FooterButton href="/contactez-nous" text="Contactez-nous" data-fx="cta" />
          </div>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-12">
          <div data-fx="col" className="md:col-span-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">
              NAVIGATION
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <Link className="hover:text-(--color-brand-100)" href="/#top">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/#services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/#realisations"
                >
                  Réalisations
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/#contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-(--color-brand-100)" href="/faq">
                  F.A.Q
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/ressources"
                >
                  Ressources
                </Link>
              </li>
            </ul>
          </div>

          <div data-fx="col" className="md:col-span-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">
              CONTACT
            </p>

            <div className="mt-4 space-y-3 text-sm text-white/80">
              <p>Landes · Nouvelle-Aquitaine · France entière</p>

              <p>
                <a
                  className="hover:text-(--color-brand-100)"
                  href="mailto:contact@cabinetmartin-ma.fr"
                >
                  contact@cabinetmartin-ma.fr
                </a>
              </p>

              <p>
                <a
                  className="hover:text-(--color-brand-100)"
                  href="tel:+33000000000"
                >
                  +33 0 00 00 00 00
                </a>
              </p>

              <SocialBar />

            </div>
          </div>

          <div data-fx="col" className="md:col-span-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">
              LÉGAL
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/mentions-legales"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/confidentialite"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-(--color-brand-100)"
                  href="/cookies"
                >
                  Cookies
                </Link>
              </li>
            </ul>

            <p className="mt-6 text-xs leading-relaxed text-white/55">
              Cabinet Martin M&amp;A, SARL. Paiement à la réussite selon
              conditions et éligibilité du projet.
            </p>
          </div>
        </div>

        <div
          data-fx="bottom"
          className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between"
        >
          <p>
            © {new Date().getFullYear()} Cabinet Martin M&amp;A. Tous droits
            réservés.
          </p>
          <p className="text-white/45">
            Conçu par{" "}
            <a
              className="hover:text-(--color-brand-100)"
              href="https://www.nemosolutions.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐙 NemoSolutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
