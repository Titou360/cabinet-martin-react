import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { fontPrimary } from "./fonts"


import SmoothScroll from "./providers/SmoothScroll";
import GSAPProvider from "./providers/GSAPProvider";
import CookieConsentProvider from "./providers/CookieConsentProvider";
import JsonLd from "./components/JsonLd/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema } from "./lib/schemas";
import AdminAwareShell from "./components/AdminAwareShell/AdminAwareShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.cabinetmartin-ma.fr"; // TODO : confirmer l'URL définitive

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Cabinet Martin M&A — Expert en subventions CEE",
    template: "%s — Cabinet Martin M&A",
  },
  description:
    "Cabinet de conseil spécialisé dans l'obtention de subventions et CEE. Audit d'éligibilité, montage de dossier, pilotage jusqu'au versement. Paiement à la réussite. France entière.",

  // ── Indexation ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  // ── Auteur / éditeur ────────────────────────────────────────────────────────
  authors: [
    { name: "Mylène Martin",    url: BASE_URL },
    { name: "Alexandre Martin", url: BASE_URL },
  ],
  creator:   "Cabinet Martin M&A",
  publisher: "Cabinet Martin M&A",

  // ── Langue & localisation ───────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: { "fr-FR": BASE_URL },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type:        "website",
    locale:      "fr_FR",
    url:         BASE_URL,
    siteName:    "Cabinet Martin M&A",
    title:       "Cabinet Martin M&A — Expert en subventions CEE",
    description: "Audit, montage et pilotage de dossiers CEE. Paiement à la réussite. Nous nous occupons de toute la complexité administrative pendant que vous pilotez votre projet.",
    images: [
      {
        url:    "/opengraph-image",   // image générée par app/opengraph-image.tsx
        width:  1200,
        height: 630,
        alt:    "Cabinet Martin M&A — Expert en financement et subventions CEE",
        type:   "image/png",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    site:        "@CabinetMartinMA", // TODO : handle Twitter/X si applicable
    creator:     "@CabinetMartinMA", // TODO
    title:       "Cabinet Martin M&A — Expert en subventions CEE",
    description: "Audit, montage et pilotage de dossiers CEE. Paiement à la réussite. France entière.",
    images: [
      {
        url:    "/opengraph-image",
        width:  1200,
        height: 630,
        alt:    "Cabinet Martin M&A — Expert en financement et subventions CEE",
      },
    ],
  },

  // ── Icônes ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/img/logo/logo-cabinet-martin-ma-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/img/logo/logo-cabinet-martin-ma-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    apple:   "/img/logo/logo-cabinet-martin-ma-256x256.png",
    shortcut:"/img/logo/logo-cabinet-martin-ma-128x128.png",
  },

  // ── Manifest / couleur ──────────────────────────────────────────────────────
  manifest: "/manifest.webmanifest",
  themeColor: "#1B2A47",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <JsonLd schema={[buildOrganizationSchema(), buildWebSiteSchema()]} />
      </head>
      <body
        className={`${fontPrimary.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll />
        <GSAPProvider />
        <CookieConsentProvider />
        <AdminAwareShell>
          {children}
        </AdminAwareShell>
      </body>
    </html>
  );
}
