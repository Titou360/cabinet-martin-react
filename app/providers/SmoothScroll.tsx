"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Sync Lenis -> ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // RAF loop (requestAnimationFrame donne déjà des millisecondes ✅)
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Quand ScrollTrigger refresh (resize, pin, fonts...), Lenis doit recalculer
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Refresh “intelligent” (fonts + images + load)
    const refresh = () => ScrollTrigger.refresh();

    const t = window.setTimeout(refresh, 0);
    window.addEventListener("load", refresh);

    // si dispo (Chrome/modern)
    (document as Document & { fonts?: { ready?: Promise<void> } }).fonts?.ready?.then(refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);

      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
