"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";
import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import Link from "next/link";

const CAL_LINK =
  process.env.NEXT_PUBLIC_CALCOM_LINK ??
  "mylene-et-alexandre-cabinet-martin-ma-jgi62s/30min";

function PrendreRdv() {
  const [calError, setCalError] = useState(false);
  const [calTheme, setCalTheme] = useState<"light" | "dark">("light");

  // Détecte le thème courant du site (attribut data-theme sur <html>)
  useEffect(() => {
    const getTheme = (): "light" | "dark" =>
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    setCalTheme(getTheme());

    const observer = new MutationObserver(() => setCalTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Réinitialise l'UI Cal.com quand le thème change
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        cal("ui", {
          theme: calTheme,
          styles: { branding: { brandColor: "#ae894a" } },
        });
      } catch {
        setCalError(true);
      }
    })();
  }, [calTheme]);

  const isDark = calTheme === "dark";

  return (
    <main
      className="transition-colors duration-500"
      style={{
        background: isDark ? "var(--overlay)" : "var(--bg)",
        color: isDark ? "var(--overlayText)" : "var(--text)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <CustomTitle
          title="Prendre rendez-vous"
          offset={30}
          as="h1"
          className={isDark ? "text-(--overlayText)" : ""}
        />

        <p
          className="mt-4 mb-10 text-base sm:text-lg max-w-xl transition-colors duration-500"
          style={{ color: isDark ? "rgba(249,245,236,0.72)" : "var(--muted)" }}
        >
          Choisissez un créneau directement dans notre agenda. L&apos;échange
          dure 30 minutes et est sans engagement.
        </p>

        {calError ? (
          <div
            className="mt-4 rounded-2xl p-10 text-center border transition-colors duration-500"
            style={{
              background: isDark ? "rgba(249,245,236,0.04)" : "var(--card-bg)",
              borderColor: isDark ? "rgba(249,245,236,0.12)" : "var(--card-border)",
            }}
          >
            <p className="text-lg mb-4">
              Le calendrier de prise de rendez-vous n&apos;a pas pu se charger.
            </p>
            <p
              className="mb-6"
              style={{ color: isDark ? "rgba(249,245,236,0.72)" : "var(--muted)" }}
            >
              Vous pouvez nous contacter directement via le formulaire de contact.
            </p>
            <Link
              href="/contactez-nous"
              className="inline-block px-6 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{
                background: isDark ? "rgba(249,245,236,0.1)" : "var(--overlay)",
                color: isDark ? "var(--overlayText)" : "var(--overlayText)",
                border: isDark ? "1px solid rgba(249,245,236,0.2)" : "none",
              }}
            >
              Nous contacter
            </Link>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden border transition-colors duration-500"
            style={{
              borderColor: isDark
                ? "rgba(249,245,236,0.12)"
                : "var(--card-border)",
              background: isDark
                ? "rgba(249,245,236,0.03)"
                : "var(--card-bg)",
            }}
          >
            <Cal
              calLink={CAL_LINK}
              style={{
                width: "100%",
                height: "100%",
                overflow: "scroll",
                minHeight: "80vh",
              }}
              config={{
                layout: "month_view",
                theme: calTheme,
              }}
            />
          </div>
        )}

        <Link
          href="/"
          className="block text-center mt-8 mb-16 transition-colors hover:underline"
          style={{ color: isDark ? "rgba(249,245,236,0.55)" : "var(--muted)" }}
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

export default PrendreRdv;
