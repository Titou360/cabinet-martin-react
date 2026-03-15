"use client";

import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { useIsDark } from "../hooks/useIsDark";

function useTokens() {
  const isDark = useIsDark();
  return {
    isDark,
    bg:          isDark ? "var(--overlay)"         : "var(--bg)",
    text:        isDark ? "var(--overlayText)"      : "var(--text)",
    muted:       isDark ? "rgba(249,245,236,0.65)"  : "rgba(27,42,71,0.65)",
    heading:     isDark ? "rgba(249,245,236,0.92)"  : "var(--text)",
    divider:     isDark ? "rgba(249,245,236,0.1)"   : "rgba(27,42,71,0.1)",
    cardBg:      isDark ? "rgba(249,245,236,0.04)"  : "var(--card-bg)",
    cardBorder:  isDark ? "rgba(249,245,236,0.12)"  : "var(--card-border)",
    badgeBg:     isDark ? "rgba(249,245,236,0.08)"  : "rgba(27,42,71,0.06)",
    badgeText:   isDark ? "rgba(249,245,236,0.55)"  : "rgba(27,42,71,0.5)",
    titleClass:  isDark ? "text-(--overlayText)"    : "text-(--text)",
  };
}

function Section({ title, children, t }: { title: string; children: React.ReactNode; t: ReturnType<typeof useTokens> }) {
  return (
    <div className="pt-10 border-t" style={{ borderColor: t.divider }}>
      <h2 className="text-lg font-semibold tracking-[-0.01em] mb-4" style={{ color: t.heading }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: t.muted }}>
        {children}
      </div>
    </div>
  );
}

type CookieRow = { name: string; provider: string; purpose: string; duration: string; category: string };

const COOKIE_TABLE: CookieRow[] = [
  { name: "cc_cookie",  provider: "cabinetmartin-ma.fr", purpose: "Mémorise vos préférences de consentement aux cookies.",       duration: "6 mois",    category: "Nécessaire" },
  { name: "_ga",        provider: "Google",                                    purpose: "Distingue les utilisateurs pour Google Analytics.",           duration: "2 ans",     category: "Analytique" },
  { name: "_ga_*",      provider: "Google",                                    purpose: "Mémorise l'état de session Google Analytics 4.",              duration: "2 ans",     category: "Analytique" },
  { name: "_gid",       provider: "Google",                                    purpose: "Distingue les utilisateurs pour Google Analytics.",           duration: "24 heures", category: "Analytique" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Nécessaire":  "rgba(27,42,71,0.1)",
  "Analytique":  "rgba(174,137,74,0.15)",
};
const CATEGORY_TEXT: Record<string, string> = {
  "Nécessaire":  "rgba(27,42,71,0.65)",
  "Analytique":  "#ae894a",
};

function CookieTable({ t }: { t: ReturnType<typeof useTokens> }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border" style={{ borderColor: t.cardBorder }}>
      <table className="w-full text-sm min-w-140">
        <thead>
          <tr style={{ background: t.cardBg, borderBottom: `1px solid ${t.cardBorder}` }}>
            {["Nom", "Fournisseur", "Finalité", "Durée", "Catégorie"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide" style={{ color: t.muted }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COOKIE_TABLE.map((row, i) => (
            <tr
              key={row.name}
              style={{
                background: i % 2 === 0 ? "transparent" : t.cardBg,
                borderBottom: i < COOKIE_TABLE.length - 1 ? `1px solid ${t.cardBorder}` : undefined,
              }}
            >
              <td className="px-4 py-3 font-mono text-xs" style={{ color: t.heading }}>{row.name}</td>
              <td className="px-4 py-3" style={{ color: t.muted }}>{row.provider}</td>
              <td className="px-4 py-3" style={{ color: t.muted }}>{row.purpose}</td>
              <td className="px-4 py-3 whitespace-nowrap" style={{ color: t.muted }}>{row.duration}</td>
              <td className="px-4 py-3">
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: t.isDark ? "rgba(249,245,236,0.08)" : CATEGORY_COLORS[row.category],
                    color: t.isDark ? "rgba(249,245,236,0.6)" : CATEGORY_TEXT[row.category],
                  }}
                >
                  {row.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Cookies() {
  const t = useTokens();

  const openPreferences = async () => {
    const { showPreferences } = await import("vanilla-cookieconsent");
    showPreferences();
  };

  return (
    <section className="min-h-screen transition-colors duration-500" style={{ background: t.bg }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <CustomTitle title="Politique de cookies" offset={30} className={t.titleClass} />

        <p className="mt-4 text-sm leading-relaxed" style={{ color: t.muted }}>
          Ce site utilise des cookies et des technologies similaires. La
          présente politique vous explique ce que sont les cookies, lesquels
          nous utilisons et comment vous pouvez gérer vos préférences.
        </p>

        <div className="mt-10 space-y-10">

          <Section title="1. Qu'est-ce qu'un cookie ?" t={t}>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal
              (ordinateur, smartphone, tablette) lors de votre visite sur un
              site web. Il permet au site de mémoriser des informations sur
              votre visite afin de faciliter votre navigation ou de mesurer
              l&apos;audience du site.
            </p>
            <p>
              Les cookies ont une durée de vie limitée et peuvent être
              supprimés à tout moment depuis les paramètres de votre navigateur.
            </p>
          </Section>

          <Section title="2. Les cookies que nous utilisons" t={t}>
            <p>Nous utilisons trois catégories de cookies :</p>

            <div className="mt-4 space-y-4">
              {[
                {
                  label: "Cookies strictement nécessaires",
                  desc: "Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés. Ils n'enregistrent aucune information personnellement identifiable.",
                  badge: "Toujours actifs",
                  badgeGold: false,
                },
                {
                  label: "Cookies analytiques",
                  desc: "Nous permettent de mesurer l'audience du site (pages visitées, durée des sessions, provenance du trafic) pour améliorer nos contenus. Utilisés uniquement avec votre consentement.",
                  badge: "Consentement requis",
                  badgeGold: true,
                },
                {
                  label: "Cookies marketing",
                  desc: "Utilisés pour vous proposer des contenus publicitaires pertinents et mesurer l'efficacité de nos campagnes. Utilisés uniquement avec votre consentement.",
                  badge: "Consentement requis",
                  badgeGold: true,
                },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="rounded-xl border p-4"
                  style={{ background: t.cardBg, borderColor: t.cardBorder }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: t.heading }}>{cat.label}</p>
                    <span
                      className="inline-block shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        background: cat.badgeGold ? "rgba(174,137,74,0.12)" : t.badgeBg,
                        color: cat.badgeGold ? "var(--color-brand-100)" : t.badgeText,
                      }}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-sm mt-2" style={{ color: t.muted }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="3. Liste détaillée des cookies" t={t}>
            <p>Voici la liste des cookies actuellement utilisés sur ce site :</p>
            <CookieTable t={t} />
          </Section>

          <Section title="4. Gérer vos préférences" t={t}>
            <p>
              Vous pouvez à tout moment modifier vos préférences en matière de
              cookies via notre panneau de gestion :
            </p>
            <div className="mt-4">
              <button
                onClick={openPreferences}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-95"
                style={{ background: "var(--color-brand-100)", color: "#fff" }}
              >
                Gérer mes préférences
              </button>
            </div>
            <p className="mt-4">
              Vous pouvez également désactiver les cookies directement depuis
              les paramètres de votre navigateur :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {[
                { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                { name: "Mozilla Firefox", url: "https://support.mozilla.org/fr/kb/activer-desactiver-cookies" },
                { name: "Safari", url: "https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" },
                { name: "Microsoft Edge", url: "https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
              ].map((b) => (
                <li key={b.name}>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Notez que la désactivation de certains cookies peut affecter le
              bon fonctionnement du site.
            </p>
          </Section>

          <Section title="5. Contact" t={t}>
            <p>
              Pour toute question relative à notre politique de cookies,
              contactez-nous à{" "}
              <a href="mailto:contact@cabinetmartin-ma.fr" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                contact@cabinetmartin-ma.fr
              </a>
              .
            </p>
          </Section>

          <p className="pt-6 text-xs" style={{ color: t.muted }}>
            Dernière mise à jour : mars 2025
          </p>

        </div>
      </div>
    </section>
  );
}
