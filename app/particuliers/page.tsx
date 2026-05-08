import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services pour particuliers",
  description:
    "MaPrime Rénov', CEE particuliers, panneaux photovoltaïques, rénovation énergétique de l'habitat, aide à l'autoconsommation. Cabinet Martin M&A vous accompagne de A à Z.",
  alternates: { canonical: "https://www.cabinetmartin-ma.fr/particuliers" },
};

const SERVICES = [
  {
    badge: "01",
    title: "MaPrime Rénov'",
    desc: "Aide de l'État pour financer vos travaux de rénovation énergétique. Nous montons votre dossier et gérons les démarches administratives jusqu'au versement.",
  },
  {
    badge: "02",
    title: "Prime CEE particuliers",
    desc: "Les Certificats d'Économie d'Énergie vous ouvrent droit à des primes versées par les fournisseurs d'énergie. Nous identifions les meilleures offres et pilotez le dossier.",
  },
  {
    badge: "03",
    title: "Panneaux photovoltaïques",
    desc: "Installation de panneaux solaires : audit d'éligibilité aux aides, optimisation du plan de financement et accompagnement jusqu'à la mise en service.",
  },
  {
    badge: "04",
    title: "Rénovation énergétique de l'habitat",
    desc: "Isolation, chauffage, fenêtres… Nous cartographions l'ensemble des dispositifs mobilisables pour votre projet de rénovation et maximisons le montant obtenu.",
  },
  {
    badge: "05",
    title: "Aide à l'autoconsommation",
    desc: "Produire et consommer sa propre énergie solaire. Nous vous guidons dans les aides disponibles et les démarches pour optimiser votre installation.",
  },
];

export default function ParticuliersPage() {
  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* Hero */}
      <section className="bg-(--overlay) text-(--overlayText) py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[rgba(174,137,74,0.8)]" />
            <span className="text-xs tracking-widest uppercase text-[rgba(249,245,236,0.55)]">
              Cabinet Martin M&amp;A
            </span>
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-[rgba(249,245,236,0.95)]">
            Services pour{" "}
            <span className="text-[rgba(174,137,74,0.9)]">particuliers</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[rgba(249,245,236,0.68)]">
            Vous souhaitez rénover votre logement, installer des panneaux solaires ou réduire votre
            facture énergétique ? Nous identifions les aides auxquelles vous avez droit et nous
            gérons toute la complexité administrative à votre place.
          </p>
          <p className="mt-3 text-sm font-medium text-[rgba(174,137,74,0.85)]">
            Paiement uniquement à la réussite — aucun frais si le dossier n&apos;aboutit pas.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight text-(--color-brand-200) mb-12">
            Nos accompagnements
          </h2>
          <div className="space-y-6">
            {SERVICES.map((s) => (
              <div
                key={s.badge}
                className="flex gap-6 rounded-2xl border border-(--color-brand-200)/15 bg-(--bg) p-6 shadow-sm"
              >
                <span className="shrink-0 text-xs font-semibold tracking-wide text-[rgba(174,137,74,0.7)] pt-0.5">
                  {s.badge}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-(--color-brand-200)">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--text)/75">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-(--overlay) text-(--overlayText)">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-[rgba(249,245,236,0.92)] mb-4">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-[rgba(249,245,236,0.65)] mb-8 max-w-xl mx-auto">
            Un audit d&apos;éligibilité gratuit pour savoir en 48h quelles aides vous pouvez obtenir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/prendre-rdv"
              className="inline-flex items-center justify-center rounded-full bg-[rgba(174,137,74,0.9)] px-8 py-3 text-sm font-semibold text-[#F9F5EC] transition-all hover:bg-[rgba(174,137,74,1)] hover:-translate-y-0.5"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/contactez-nous"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(249,245,236,0.25)] px-8 py-3 text-sm font-semibold text-[rgba(249,245,236,0.85)] transition-all hover:border-[rgba(249,245,236,0.45)] hover:-translate-y-0.5"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
