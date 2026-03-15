import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travailler avec nous",
  description:
    "Devenez partenaire de Cabinet Martin M&A. 3 modes de collaboration : accompagnement ponctuel, partenariat récurrent ou formation à l'autonomie. Paiement à la réussite.",
  alternates: { canonical: "/partenaires" },
  openGraph: {
    title: "Travailler avec nous — Cabinet Martin M&A",
    description:
      "Découvrez nos 3 modes de collaboration pour obtenir des subventions CEE. Accompagnement ponctuel, partenariat récurrent ou formation. Paiement à la réussite.",
    url: "/partenaires",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Travaillez avec Cabinet Martin M&A",
    description:
      "3 modes de collaboration pour maximiser vos subventions CEE.",
  },
};

export default function PartenairesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
