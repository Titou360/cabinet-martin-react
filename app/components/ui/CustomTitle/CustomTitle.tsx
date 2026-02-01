"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ensureGSAP } from "@/app/lib/gsapClient";

type CustomTitleProps = {
  title: string;
  className?: string;
  parallax?: boolean;
  offset?: number;
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
      ensureGSAP();

      const el = titleRef.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !parallax) return;

      // ✅ kill uniquement CE title (évite accumulation en dev)
      const id = `ct-${title}`;
      ScrollTrigger.getById(id)?.kill();

      gsap.set(el, { y: 0 });

      const tween = gsap.to(el, {
        y: -offset,
        ease: "none",
        scrollTrigger: {
          id,
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: titleRef },
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
