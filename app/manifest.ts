import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cabinet Martin M&A",
    short_name: "Cabinet Martin",
    description:
      "Expert en financement et subventions CEE. Audit, montage et pilotage de dossiers. Paiement à la réussite.",
    start_url: "/",
    display: "browser",
    background_color: "#F9F5EC",
    theme_color: "#1B2A47",
    lang: "fr",
    icons: [
      {
        src: "/img/logo/logo-cabinet-martin-ma-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/img/logo/logo-cabinet-martin-ma-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/img/logo/logo-cabinet-martin-ma-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
