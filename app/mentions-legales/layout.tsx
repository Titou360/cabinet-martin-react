import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Cabinet Martin M&A — éditeur, hébergeur, propriété intellectuelle et données personnelles.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: false },
};

export default function MentionsLegalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
