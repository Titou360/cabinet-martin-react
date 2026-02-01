"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

type NavItem = { n: string; label: string; href: string };

const PhoneLink = ({
  number,
  display,
}: {
  number: string;
  display: string;
}) => (
  <a
    className="hover:text-(--color-brand-100) transition-colors"
    href={`tel:${number}`}
  >
    {display}
  </a>
);

const NAV: NavItem[] = [
  { n: "01", label: "Accueil", href: "/#top" },
  { n: "02", label: "Services", href: "/#services" },
  { n: "03", label: "Réalisations", href: "/#realisations" },
  { n: "04", label: "Contact", href: "/#contact" },
  { n: "05", label: "F.A.Q", href: "/faq" },
  { n: "06", label: "Ressources", href: "/ressources" },
];

export default function Header() {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const brandRef = useRef<HTMLAnchorElement | null>(null);
  const toggleTopRef = useRef<HTMLButtonElement | null>(null);

  const burgerBtnRef = useRef<HTMLButtonElement | null>(null);
  const burgerTopRef = useRef<HTMLSpanElement | null>(null);
  const burgerMidRef = useRef<HTMLSpanElement | null>(null);
  const burgerBotRef = useRef<HTMLSpanElement | null>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Theme init
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferredDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const nextTheme = saved ?? (preferredDark ? "dark" : "light");
    document.documentElement.dataset.theme = nextTheme;
    queueMicrotask(() => setTheme(nextTheme));
  }, []);

  const toggleTheme = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // ✅ Press animation (premium tap)
  const pressBurger = () => {
    const btn = burgerBtnRef.current;
    if (!btn) return;

    gsap.killTweensOf(btn);

    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .to(btn, { scale: 0.94, duration: 0.08 }, 0)
      .to(btn, { scale: 1, duration: 0.16 }, 0.08);
  };

  // ✅ Click handler (press + toggle)
  const onBurgerClick = () => {
    pressBurger();
    setIsOpen((v) => !v);
  };

  // GSAP timeline
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const overlay = overlayRef.current;
      if (!overlay) return;

      const q = gsap.utils.selector(overlay);

      gsap.set(overlay, {
        yPercent: -100,
        autoAlpha: 0,
        pointerEvents: "none",
      });
      gsap.set(q(".menu-num"), { autoAlpha: 0 });
      gsap.set(q(".menu-label"), { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
        smoothChildTiming: true,
      });

      // ✅ On décale le burger->X pour que, au reverse, le X->burger se fasse plus tôt
      const BURGER_AT = 0.22;

      tl.to(
        burgerTopRef.current,
        { y: 6, rotate: 45, duration: reduce ? 0 : 0.14 },
        BURGER_AT,
      )
        .to(
          burgerMidRef.current,
          { autoAlpha: 0, duration: reduce ? 0 : 0.1 },
          BURGER_AT,
        )
        .to(
          burgerBotRef.current,
          { y: -6, rotate: -45, duration: reduce ? 0 : 0.14 },
          BURGER_AT,
        );

      // Fade logo + toggle
      tl.to(
        brandRef.current,
        { autoAlpha: 0, y: -6, duration: reduce ? 0 : 0.16 },
        0,
      ).to(
        toggleTopRef.current,
        { autoAlpha: 0, duration: reduce ? 0 : 0.16 },
        0,
      );

      // Header devient “invisible” mais reste au-dessus (pour la croix)
      tl.to(
        headerRef.current,
        {
          backgroundColor: "rgba(0,0,0,0)",
          borderBottomColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          duration: reduce ? 0 : 0.16,
        },
        0,
      );

      // Overlay descend (derrière le header)
      tl.to(
        overlay,
        { autoAlpha: 1, pointerEvents: "auto", duration: 0 },
        0.1,
      ).to(overlay, { yPercent: 0, duration: reduce ? 0 : 0.5 }, 0.1);

      // Items
      tl.to(
        q(".menu-num"),
        { autoAlpha: 1, duration: reduce ? 0 : 0.22, stagger: 0.08 },
        0.32,
      ).to(
        q(".menu-label"),
        { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.32, stagger: 0.08 },
        0.32,
      );

      tlRef.current = tl;
    },
    { scope: scopeRef },
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.timeScale(1);
      tl.play();
    } else {
      tl.timeScale(1.15);
      tl.reverse();
    }
  }, [isOpen]);

  const onNavClick = () => setIsOpen(false);

  return (
    <div ref={scopeRef}>
      {/* HEADER: au-dessus de l’overlay */}
      <header
        ref={headerRef}
        className={[
          "sticky top-0 z-100 border-b border-[rgba(27,42,71,0.12)] bg-(--header) backdrop-blur",
          isOpen ? "pointer-events-none" : "pointer-events-auto",
        ].join(" ")}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link
            ref={brandRef}
            href="/"
            className="flex min-w-0 items-center gap-2 pointer-events-auto"
          >
            <span
              className="inline-flex size-18 shrink-0 items-center justify-center bg-[rgba(27,42,71,0.08)]"
            >
              <Image
                src="/img/logo/logo-cabinet-martin-ma-128x128.png"
                className="object-contain"
                width={64}
                height={64}
                alt="Logo Cabinet Martin M&A"
              />
            </span>
            <span className="truncate text-sm font-semibold tracking-wide text-(--color-brand-200)">
              Cabinet Martin M&amp;A
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Toggle top (desktop) */}
            <button
              ref={toggleTopRef}
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-full border border-[rgba(27,42,71,0.18)] px-3 py-2 text-xs font-semibold text-[rgba(27,42,71,0.85)] hover:border-[rgba(27,42,71,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-100) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) sm:inline-flex pointer-events-auto"
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>

            {/* Burger: reste visible + cliquable */}
            <button
              ref={burgerBtnRef}
              type="button"
              onClick={onBurgerClick}
              className={[
                "relative inline-flex size-11 items-center justify-center rounded-full border transition pointer-events-auto",
                isOpen
                  ? "border-white/40 text-white"
                  : "border-[rgba(27,42,71,0.18)] text-(--color-brand-200) hover:border-[rgba(27,42,71,0.28)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-100) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)",
              ].join(" ")}
              aria-expanded={isOpen}
              aria-controls="fullmenu"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span className="absolute flex flex-col gap-1">
                <span
                  ref={burgerTopRef}
                  className="block h-0.5 w-5 rounded bg-current"
                />
                <span
                  ref={burgerMidRef}
                  className="block h-0.5 w-5 rounded bg-current"
                />
                <span
                  ref={burgerBotRef}
                  className="block h-0.5 w-5 rounded bg-current"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY: derrière le header */}
      <div
        ref={overlayRef}
        id="fullmenu"
        aria-hidden={!isOpen}
        className="fixed inset-0 z-90 overflow-y-auto bg-(--color-brand-900) text-(--overlayText)"
      >
        <div className="mx-auto grid min-h-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2 md:gap-0 md:px-6">
          {/* MENU */}
          <div className="min-w-0 md:border-l md:border-[rgba(249,245,236,0.25)] md:pl-10">
            <nav aria-label="Menu principal" className="pt-4 md:pt-10">
              <ul className="space-y-7">
                {NAV.map((item) => (
                  <li key={item.href} className="group">
                    <div className="flex items-center gap-3">
                      <span className="menu-num text-xs font-semibold tracking-wide text-[rgba(249,245,236,0.65)]">
                        {item.n}
                      </span>
                      <span className="menu-dash h-px w-10 bg-(--menuDash) transition-transform duration-500 group-hover:scale-x-[2.2]" />
                    </div>

                    <Link
                      href={item.href}
                      onClick={onNavClick}
                      className="menu-label mt-2 inline-block max-w-full wrap-break-word text-[clamp(2rem,6vw,3.6rem)] leading-[1.02] tracking-[-0.01em] text-[rgba(249,245,236,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-100) focus-visible:ring-offset-4 focus-visible:ring-offset-(--overlay)"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Toggle bottom */}
            <div className="mt-10">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex rounded-full border border-[rgba(249,245,236,0.22)] px-3 py-2 text-xs font-semibold text-[rgba(249,245,236,0.85)] hover:border-[rgba(249,245,236,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-100) focus-visible:ring-offset-4 focus-visible:ring-offset-(--overlay)"
                aria-pressed={theme === "dark"}
              >
                {theme === "dark" ? "Dark" : "Light"}
              </button>
            </div>
          </div>

          {/* COORDONNÉES */}
          <div className="min-w-0 md:flex md:items-end md:justify-end">
            <div className="text-left text-sm leading-relaxed text-[rgba(249,245,236,0.72)] md:pb-2 md:text-right">
              <p className="font-semibold text-[rgba(249,245,236,0.92)]">
                Cabinet Martin M&amp;A
              </p>
              <p>3 rue de Pion, 40465 Pontonx Sur l&apos;Adour</p>
              <p className="mt-2">
                <a
                  className="text-[rgba(249,245,236,0.92)] hover:text-(--color-brand-100)"
                  href="mailto:contact@domaine.fr"
                >
                  contact@cabinetmartin-ma.fr
                </a>
              </p>
              <p className="flex flex-row gap-4 items-end justify-end mt-2">
                <PhoneLink number="+33645653761" display="06 45 65 37 61" />
                <span className="font-semibold text-[rgba(249,245,236,0.92)]">
                  ou
                </span>
                <PhoneLink number="+33624702462" display="06 24 70 24 62" />
              </p>

              {/* ✅ Réseaux sociaux = vrais liens */}
              <div className="mt-3 flex flex-row items-center gap-4 text-xl text-[rgba(249,245,236,0.70)] md:justify-end">
                <a
                  href="#"
                  aria-label="Facebook"
                  rel="noopener noreferrer"
                  className="hover:text-(--color-brand-100)"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  target="_blank"
                  aria-label="Instagram"
                  rel="noopener noreferrer"
                  className="hover:text-(--color-brand-100)"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  target="_blank"
                  aria-label="LinkedIn"
                  rel="noopener noreferrer"
                  className="hover:text-(--color-brand-100)"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="#"
                  target="_blank"
                  aria-label="Google"
                  rel="noopener noreferrer"
                  className="hover:text-(--color-brand-100)"
                >
                  <FaGoogle />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
