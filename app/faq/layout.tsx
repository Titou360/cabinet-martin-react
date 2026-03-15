import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur nos services d'accompagnement aux subventions CEE : coût, délais, éligibilité, garanties. Toutes les réponses en un seul endroit.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Questions fréquentes · Cabinet Martin M&A",
    description:
      "Vous avez des questions sur l'obtention de subventions CEE ? Délais, tarifs, éligibilité… trouvez toutes les réponses dans notre FAQ.",
    url: "/faq",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    title: "FAQ — Cabinet Martin M&A",
    description:
      "Tout ce que vous voulez savoir sur nos services de financement CEE.",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
