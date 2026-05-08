import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

async function getTotalSubventions(): Promise<number> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    return settings?.totalSubventions ?? 2300000;
  } catch {
    return 2300000;
  }
}

function formatMillions(amount: number): string {
  const millions = amount / 1_000_000;
  return millions % 1 === 0
    ? `${millions} M€`
    : `${millions.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M€`;
}

export const metadata: Metadata = {
  title: "Services pour professionnels",
  description:
    "CEE entreprises, subventions publiques, fonds européens. Cabinet Martin M&A accompagne TPE, PME, associations et collectivités dans l'obtention de financements.",
  alternates: { canonical: "https://www.cabinetmartin-ma.fr/professionnels" },
};

const SERVICES = [
  {
    badge: "01",
    title: "Certificats d'Économie d'Énergie (CEE)",
    desc: "Mécanisme réglementaire obligeant les fournisseurs d'énergie à financer vos projets d'efficacité énergétique. Nous auditons votre éligibilité, structurons le dossier et pilotez jusqu'au versement.",
  },
  {
    badge: "02",
    title: "Subventions publiques",
    desc: "ADEME, Bpifrance, Régions, Départements, Collectivités… Nous cartographions les dispositifs adaptés à votre projet et maximisons le montant obtenu.",
  },
  {
    badge: "03",
    title: "Fonds européens",
    desc: "FEDER, FSE+, FEADER — des enveloppes significatives mais des dossiers complexes. Nous gérons la structuration, la conformité et le suivi jusqu'à la certification des dépenses.",
  },
  {
    badge: "04",
    title: "Transition écologique",
    desc: "Réduction de l'empreinte carbone, mobilité durable, efficacité énergétique industrielle. Nous identifions les aides disponibles pour vos projets de transition.",
  },
];

export default async function ProfessionnelsPage() {
  const totalSubventions = await getTotalSubventions();
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
            <span className="text-[rgba(174,137,74,0.9)]">professionnels</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[rgba(249,245,236,0.68)]">
            TPE, PME, associations, collectivités — nous vous accompagnons dans l&apos;accès aux
            financements publics et privés. Audit, montage, pilotage : nous gérons la complexité
            réglementaire pendant que vous pilotez votre activité.
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

          {/* Réalisations highlight */}
          <div className="mt-16 rounded-2xl border border-(--color-brand-200)/15 bg-(--overlay)/5 p-8">
            <p className="text-xs tracking-widest uppercase text-(--color-brand-200)/60 mb-4">Résultats</p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-[rgba(174,137,74,0.9)]">{formatMillions(totalSubventions)}</p>
                <p className="text-xs text-(--text)/60 mt-1">Subventions obtenues</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[rgba(174,137,74,0.9)]">0 €</p>
                <p className="text-xs text-(--text)/60 mt-1">Risque initial</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[rgba(174,137,74,0.9)]">100 %</p>
                <p className="text-xs text-(--text)/60 mt-1">Paiement au succès</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-(--overlay) text-(--overlayText)">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-[rgba(249,245,236,0.92)] mb-4">
            Un projet à financer ?
          </h2>
          <p className="text-[rgba(249,245,236,0.65)] mb-8 max-w-xl mx-auto">
            Audit d&apos;éligibilité gratuit — nous vous répondons sous 48h avec une première
            estimation des financements mobilisables.
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
