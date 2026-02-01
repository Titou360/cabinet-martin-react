"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type CustomTitleProps = {
  title: string;
  className?: string;
  parallax?: boolean;     // activé par défaut
  offset?: number;        // intensité du parallax
};

export default function CustomTitle({
  title,
  className = "",
  parallax = true,
  offset = 22,
}: CustomTitleProps) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      if (!titleRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // ✅ état initial (facultatif mais propre)
      gsap.set(titleRef.current, { y: 0 });

      // ✅ parallax lié au scroll
      if (parallax) {
        gsap.to(titleRef.current, {
          y: -offset,
          ease: "none",
          scrollTrigger: {
            trigger: titleRef.current,     // ou le parent section si tu préfères
            start: "top bottom",           // quand le titre entre dans l'écran
            end: "bottom top",             // quand il sort
            scrub: true,                   // suit le scroll (parallax)
          },
        });
      }
    },
    { scope: titleRef } // ✅ scope GSAP propre
  );

  return (
    <h2
      ref={titleRef}
      className={[
        "text-3xl font-semibold tracking-tight md:text-5xl text-overlayText",
        className,
      ].join(" ")}
      style={{ fontFamily: "var(--font-primary), sans-serif" }}
    >
      {title}
    </h2>
  );
}
