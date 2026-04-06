"use client";

import Image from "next/image";
import Link from "next/link";
import { GoldButton, HeroButton } from "../ui/Buttons/Buttons";

const WORDS = [
  "Subventions CEE",
  "Paiement à la réussite",
  "Montage de dossier",
  "France entière",
  "Conformité",
  "Réactivité",
  "Accompagnement premium",
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-x-hidden">
      {/* Background image */}
      <Image
        src="/img/hero.jpg"
        alt="Cabinet Martin M&A"
        fill
        priority
        className="object-cover"
      />

      {/* Gradient overlay — plus directionnel, met en valeur le contenu gauche */}
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/20" />
      {/* Vignette bas */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/50 to-transparent" />

      {/* Content wrapper */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="min-h-svh pt-24 pb-44 md:min-h-[92vh] md:pt-28 md:pb-32">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-10">

            {/* ── Colonne gauche ─────────────────────────────────────── */}
            <div className="min-w-0 md:col-span-7 text-white">
              {/* Eyebrow */}
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-6 bg-(--color-brand-100)"
                />
                Cabinet Martin M&amp;A
              </p>

              {/* Headline */}
              <h1 className="mt-5 text-[clamp(2.1rem,5.5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.025em] wrap-break-word">
                Accélérez vos projets<br className="hidden sm:block" />
                <span className="text-(--color-brand-100)"> grâce aux subventions.</span>
              </h1>

              {/* Sous-titre */}
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
                Audit, montage et pilotage de dossiers. Une approche claire,
                rapide et orientée résultat pour maximiser vos chances d&apos;aboutir.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <GoldButton href="/prendre-rdv" text="Prendre RDV" />
                <HeroButton href="/contactez-nous" text="Nous contacter" />
              </div>

              {/* Stats minimalistes */}
              <div className="mt-10 flex items-center gap-8 border-t border-white/15 pt-6">
                <div>
                  <p className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-tight text-(--color-brand-100)">
                    +2,3 M€
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">Subventions obtenues</p>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <p className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-tight text-(--color-brand-100)">
                    0 €
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">Risque initial</p>
                </div>
                <div className="h-8 w-px bg-white/15" />
                <div>
                  <p className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-tight text-(--color-brand-100)">
                    100%
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">Paiement au succès</p>
                </div>
              </div>
            </div>

            {/* ── Colonne droite — carte CTA ──────────────────────────── */}
            <div className="min-w-0 md:col-span-5 md:justify-self-end">
              <div className={[
                "w-full max-w-130 mx-auto md:mx-0 md:max-w-none",
                "relative rounded-3xl bg-white/96 p-6 shadow-2xl backdrop-blur",
                /* Ligne dorée en haut */
                "before:absolute before:inset-x-6 before:top-0 before:h-px before:rounded-full",
                "before:bg-linear-to-r before:from-transparent before:via-(--color-brand-100) before:to-transparent",
              ].join(" ")}>

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-black/45 uppercase">
                      En 3 étapes
                    </p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.01em] text-black/90 sm:text-xl">
                      Une démarche cadrée,<br />efficace et sans risque.
                    </h2>
                  </div>

                  <Link
                    href="/prendre-rdv"
                    aria-label="Prendre rendez-vous"
                    className="group inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-(--color-brand-100) shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  >
                    <svg
                      className="size-4 text-black/80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-black/65">
                  Vous restez concentré sur l&apos;opérationnel. Nous structurons le
                  dossier, sécurisons les pièces et pilotons jusqu&apos;à la réussite.
                </p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Audit d'éligibilité et cadrage rapide",
                    "Montage du dossier, conformité, suivi",
                    "Paiement à la réussite (selon conditions)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-black/75">
                      <span className="mt-1.25 flex size-4 shrink-0 items-center justify-center rounded-full bg-(--color-brand-100)/15">
                        <span className="size-1.5 rounded-full bg-(--color-brand-100)" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-black/8 pt-5">
                  <Link
                    href="/prendre-rdv"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  >
                    Réserver un échange de 30 min
                    <svg className="size-4 opacity-60" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
          <div className="ticker mask-fade">
            <div className="ticker__track">
              <div className="ticker__group">
                {WORDS.map((w) => (
                  <span key={`a-${w}`} className="ticker__item">
                    {w}
                    <span className="ticker__diamond" aria-hidden="true" />
                  </span>
                ))}
              </div>
              <div className="ticker__group" aria-hidden="true">
                {WORDS.map((w) => (
                  <span key={`b-${w}`} className="ticker__item">
                    {w}
                    <span className="ticker__diamond" aria-hidden="true" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
