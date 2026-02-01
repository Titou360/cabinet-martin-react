"use client";

import Image from "next/image";
import Link from "next/link";

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

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content wrapper */}
      <div className="relative mx-auto max-w-7xl px-4">
        {/* On réserve de la place en bas pour le ticker */}
        <div className="min-h-svh pt-24 pb-44 md:min-h-[92vh] md:pt-28 md:pb-32">
          {/* ✅ Mobile: 1 colonne | ✅ Desktop: 12 colonnes */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-10">
            {/* LEFT */}
            <div className="min-w-0 md:col-span-7 text-white">
              <p className="text-xl font-semibold tracking-[0.18em] text-white/80">
                CABINET MARTIN M&amp;A
              </p>

              <h1 className="mt-4 text-[clamp(2rem,6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] wrap-break-word">
                Accélérez vos projets grâce aux subventions CEE.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Audit, montage et pilotage de dossiers. Une approche claire, rapide, et orientée résultat
                pour sécuriser vos démarches et maximiser vos chances d’aboutir.
              </p>

              {/* ✅ CTA responsive (pile en mobile, ligne dès sm) */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/#contact"
                  className="inline-flex w-full items-center justify-center rounded-full bg-(--color-brand-100) px-5 py-3 text-sm font-semibold text-black/90 shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto"
                >
                  Nous contacter
                </Link>

                <Link
                  href="/#services"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto"
                >
                  Nos services
                </Link>
              </div>
            </div>

            {/* RIGHT CARD CTA */}
            <div className="min-w-0 md:col-span-5 md:justify-self-end">
              <div
                className={[
                  "w-full max-w-130 mx-auto md:mx-0 md:max-w-none",
                  "rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.14em] text-black/55">
                      EN 3 POINTS
                    </p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.01em] text-black/90 sm:text-xl">
                      Une démarche cadrée, efficace.
                    </h2>
                  </div>

                  <Link
                    href="/prendre-rdv"
                    aria-label="Prendre rendez-vous"
                    className="group inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  >
                    <svg
                      className="size-5 text-black/80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 17L17 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-black/70">
                  Vous restez concentré sur l’opérationnel. Nous structurons le dossier, sécurisons les
                  pièces, et pilotons les échanges jusqu’à la réussite.
                </p>

                <ul className="mt-5 space-y-2 text-sm text-black/75">
                  <li className="flex gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--color-brand-100)" />
                    Audit d’éligibilité et cadrage rapide
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--color-brand-100)" />
                    Montage du dossier, conformité, suivi
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--color-brand-100)" />
                    Paiement à la réussite (selon conditions)
                  </li>
                </ul>

                <div className="mt-6">
                  <Link
                    href="/prendre-rdv"
                    className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  >
                    Prendre RDV
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/25 backdrop-blur">
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
