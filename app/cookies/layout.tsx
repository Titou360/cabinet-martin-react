import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies de Cabinet Martin M&A — liste des cookies utilisés, leurs finalités et comment gérer vos préférences.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: false },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
