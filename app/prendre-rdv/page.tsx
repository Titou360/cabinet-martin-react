"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import Link from "next/link";

function PrendreRdv() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#000000" } },
      });
    })();
  }, []);

  return (
    <main className="bg-(--bg) text-(--text) transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <CustomTitle title="Prendre rendez-vous - Cabinet Martin" offset={30} />
        <Cal
          calLink="clement-felices-9psfon/30min"
          style={{
            width: "100%",
            height: "100%",
            overflow: "scroll",
            minHeight: "80vh",
          }}
          config={{
            layout: "month_view",
            theme: "light",
          }}
        />

        <Link
          href="/"
          className="block text-center mt-8 mb-16 text-(--primary) hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

export default PrendreRdv;
