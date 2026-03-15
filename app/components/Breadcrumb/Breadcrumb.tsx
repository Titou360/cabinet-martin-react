"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TiChevronRight } from "react-icons/ti";
import { TiHome } from "react-icons/ti";
import { useIsDark } from "@/app/hooks/useIsDark";

// ─── Labels des routes ────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  "faq":             "FAQ",
  "partenaires":     "Travailler avec nous",
  "prendre-rdv":     "Prendre RDV",
  "contactez-nous":  "Contactez-nous",
  "mentions-legales":"Mentions légales",
  "confidentialite": "Confidentialité",
  "cookies":         "Cookies",
  "ressources":      "Ressources",
};

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
export default function Breadcrumb() {
  const pathname = usePathname();
  const isDark   = useIsDark();

  // Pas de breadcrumb sur la homepage
  if (!pathname || pathname === "/") return null;

  // Construction des segments
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg,
    href:  "/" + segments.slice(0, i + 1).join("/"),
  }));

  // Couleurs selon le thème
  const bg        = isDark ? "rgba(27,42,71,0.6)"         : "rgba(249,245,236,0.7)";
  const border    = isDark ? "rgba(249,245,236,0.08)"     : "rgba(27,42,71,0.08)";
  const linkColor = isDark ? "rgba(249,245,236,0.45)"     : "rgba(27,42,71,0.45)";
  const chevColor = isDark ? "rgba(249,245,236,0.22)"     : "rgba(27,42,71,0.22)";
  const activeColor = isDark ? "rgba(249,245,236,0.85)"   : "rgba(27,42,71,0.85)";

  return (
    <nav
      aria-label="Fil d'Ariane"
      style={{
        background:  bg,
        borderBottom: `1px solid ${border}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <ol
          className="flex items-center gap-1 py-2.5 text-[11px] font-medium tracking-wide"
          style={{ color: linkColor }}
        >
          {/* Home */}
          <li className="flex items-center shrink-0">
            <Link
              href="/"
              aria-label="Accueil"
              className="inline-flex items-center transition-colors duration-150 hover:text-(--color-brand-100)"
              style={{ color: linkColor }}
            >
              <TiHome className="text-base" />
            </Link>
          </li>

          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1 min-w-0">
                {/* Séparateur */}
                <TiChevronRight
                  className="shrink-0 text-sm"
                  style={{ color: chevColor }}
                  aria-hidden="true"
                />

                {/* Lien ou texte courant */}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate"
                    style={{ color: activeColor }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate transition-colors duration-150 hover:text-(--color-brand-100)"
                    style={{ color: linkColor }}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
