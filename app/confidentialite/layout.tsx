import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Cabinet Martin M&A — collecte, utilisation et protection de vos données personnelles conformément au RGPD.",
  alternates: { canonical: "/confidentialite" },
  robots: { index: false, follow: false },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
