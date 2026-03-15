"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";

export default function SmoothScroll() {
  useEffect(() => {
    ensureGSAP();

    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pause/resume depuis n'importe quel composant (ex: Header menu ouvert)
    const onPause = () => lenis.stop();
    const onResume = () => lenis.start();
    window.addEventListener("lenis:pause", onPause);
    window.addEventListener("lenis:resume", onResume);

    // Refresh utile quand images/fonts/split modifient les hauteurs
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("lenis:pause", onPause);
      window.removeEventListener("lenis:resume", onResume);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
