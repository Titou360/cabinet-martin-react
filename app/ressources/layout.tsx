import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Téléchargez les logos officiels, la plaquette commerciale et les guides pratiques de Cabinet Martin M&A. Kit presse disponible pour journalistes et partenaires.",
  alternates: { canonical: "/ressources" },
  robots: { index: false, follow: false }, // page utilitaire, pas prioritaire pour l'indexation
  openGraph: {
    title: "Ressources & Kit presse — Cabinet Martin M&A",
    description:
      "Logos, plaquette PDF, charte graphique et guides pratiques sur les subventions CEE en téléchargement libre.",
    url: "/ressources",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RessourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
