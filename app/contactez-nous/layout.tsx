import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-nous",
  description:
    "Contactez Cabinet Martin M&A pour toute question sur nos services de financement et subventions CEE. Réponse sous 24h. Basé dans les Landes, intervenons France entière.",
  alternates: { canonical: "/contactez-nous" },
  openGraph: {
    title: "Contactez Cabinet Martin M&A",
    description:
      "Une question sur vos projets de financement ? Écrivez-nous ou appelez directement Mylène ou Alexandre. Réponse sous 24h.",
    url: "/contactez-nous",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Contactez Cabinet Martin M&A",
    description:
      "Une question sur vos subventions CEE ? Contactez-nous, réponse sous 24h.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
