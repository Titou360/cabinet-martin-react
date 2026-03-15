import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez un échange de 30 minutes avec Mylène et Alexandre Martin. Gratuit, sans engagement. Nous analysons votre éligibilité aux subventions CEE et identifions vos opportunités.",
  alternates: { canonical: "/prendre-rdv" },
  openGraph: {
    title: "Prendre rendez-vous — Cabinet Martin M&A",
    description:
      "30 minutes pour identifier vos opportunités de financement CEE. Gratuit, sans engagement. Réservez directement en ligne.",
    url: "/prendre-rdv",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Prenez RDV avec Cabinet Martin M&A",
    description:
      "30 minutes pour identifier vos opportunités de subventions CEE. Gratuit, sans engagement.",
  },
};

export default function PrendreRdvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
