import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { fontPrimary } from "./fonts"


import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SmoothScroll from "./providers/SmoothScroll";
import GSAPProvider from "./providers/GSAPProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabinet Martin M&A - Expert en financement et subventions",
  description:
    "Cabinet Martin M&A vous accompagne dans l'obtention de subventions, financements publics et privés. Experts en CEE, crédits d'impôt et dossiers de financement pour TPE, PME, associations et collectivités.",
  openGraph: {
    title: "Cabinet Martin M&A - Expert en financement et subventions",
    description:
      "Accompagnement sur-mesure pour l'obtention de subventions européennes, nationales et régionales, CEE, crédits d'impôt et prêts bonifiés.",
    url: "https://www.cabinet-martin-ma.fr",
    siteName: "Cabinet Martin M&A",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://www.cabinet-martin-ma.fr/img/logo/logo-cabinet-martin-ma-512x512.png",
        width: 512,
        height: 512,
        alt: "Logo Cabinet Martin M&A",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cabinet Martin M&A - Expert en financement et subventions",
    description:
      "Accompagnement sur-mesure pour l'obtention de subventions et financements publics pour TPE, PME et associations.",
    images: ["https://www.cabinet-martin-ma.fr/img/logo/logo-cabinet-martin-ma-512x512.png"],
  },
  metadataBase: new URL("https://www.cabinet-martin-ma.fr"),
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${fontPrimary.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll />
        <GSAPProvider />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
