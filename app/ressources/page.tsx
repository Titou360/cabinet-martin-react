"use client";

import { useState } from "react";
import Image from "next/image";
import { FaDownload, FaCopy, FaCheck, FaEnvelope, FaFilePdf } from "react-icons/fa";
import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { useIsDark } from "../hooks/useIsDark";

// ─── Tokens light / dark ─────────────────────────────────────────────────────
function useTokens() {
  const isDark = useIsDark();

  return {
    isDark,
    bg:          isDark ? "var(--overlay)"          : "var(--bg)",
    text:        isDark ? "var(--overlayText)"       : "var(--text)",
    muted:       isDark ? "rgba(249,245,236,0.65)"   : "rgba(27,42,71,0.6)",
    cardBg:      isDark ? "rgba(249,245,236,0.04)"   : "var(--card-bg)",
    cardBorder:  isDark ? "rgba(249,245,236,0.12)"   : "var(--card-border)",
    previewBg:   isDark ? "rgba(249,245,236,0.06)"   : "rgba(27,42,71,0.04)",
    divider:     isDark ? "rgba(249,245,236,0.1)"    : "rgba(27,42,71,0.1)",
    titleClass:  isDark ? "text-(--overlayText)"     : "text-(--text)",
    badgeBg:     isDark ? "rgba(249,245,236,0.08)"   : "rgba(27,42,71,0.06)",
    badgeText:   isDark ? "rgba(249,245,236,0.55)"   : "rgba(27,42,71,0.5)",
  };
}

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BRAND_COLORS = [
  { name: "Navy",        hex: "#1B2A47", label: "Bleu principal" },
  { name: "Gold",        hex: "#AE894A", label: "Or accent" },
  { name: "Floral White",hex: "#F9F5EC", label: "Fond clair" },
  { name: "Jet Black",   hex: "#333A3F", label: "Texte" },
  { name: "White Smoke", hex: "#F2F2F2", label: "Fond page" },
];

// ─── Logo assets ──────────────────────────────────────────────────────────────
const LOGOS = [
  { label: "Logo 128 × 128 px", size: "128 × 128 px", format: "PNG", src: "/img/logo/logo-cabinet-martin-ma-128x128.png", file: "logo-cabinet-martin-ma-128x128.png" },
  { label: "Logo 256 × 256 px", size: "256 × 256 px", format: "PNG", src: "/img/logo/logo-cabinet-martin-ma-256x256.png", file: "logo-cabinet-martin-ma-256x256.png" },
  { label: "Logo 512 × 512 px", size: "512 × 512 px", format: "PNG", src: "/img/logo/logo-cabinet-martin-ma-512x512.png", file: "logo-cabinet-martin-ma-512x512.png" },
];

// ─── Guides (placeholders) ────────────────────────────────────────────────────
const GUIDES = [
  { title: "Comment fonctionne un CEE ?",       desc: "Comprendre les Certificats d'Économie d'Énergie en 5 minutes.", available: false },
  { title: "Checklist dossier de financement",  desc: "Les pièces indispensables pour constituer un dossier solide.",  available: false },
  { title: "Les dispositifs 2025",              desc: "Tour d'horizon des aides disponibles cette année.",             available: false },
];

// ─── ColorSwatch ──────────────────────────────────────────────────────────────
function ColorSwatch({ color, t }: { color: typeof BRAND_COLORS[0]; t: ReturnType<typeof useTokens> }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className="group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:border-[rgba(174,137,74,0.4)] text-left w-full"
      style={{ background: t.cardBg, borderColor: t.cardBorder }}
      title={`Copier ${color.hex}`}
    >
      <div
        className="h-16 w-full transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: color.hex }}
      />
      <div className="p-3">
        <p className="text-xs font-semibold" style={{ color: t.text }}>{color.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: t.muted }}>{color.label}</p>
        <div className="mt-2 flex items-center justify-between">
          <code className="text-[11px] tracking-wide font-mono" style={{ color: t.muted }}>
            {color.hex}
          </code>
          <span style={{ color: "var(--color-brand-100)" }}>
            {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Ressources() {
  const t = useTokens();

  return (
    <section
      className="min-h-screen transition-colors duration-500"
      style={{ background: t.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">

        {/* En-tête */}
        <div className="max-w-2xl">
          <CustomTitle title="Ressources" offset={30} className={t.titleClass} />
          <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: t.muted }}>
            Retrouvez ici les éléments de marque, documents et guides mis à
            disposition pour les journalistes, partenaires et clients du Cabinet
            Martin M&amp;A.
          </p>
        </div>

        {/* ── 1. Logos ───────────────────────────────────────────────────── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: t.divider }}>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: t.text }}>
            Logos officiels
          </h2>
          <p className="text-sm mb-8" style={{ color: t.muted }}>
            Formats PNG disponibles au téléchargement. Merci de ne pas déformer,
            recolorer ou modifier les logos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {LOGOS.map((logo) => (
              <div
                key={logo.file}
                className="rounded-2xl border overflow-hidden transition-all duration-300 hover:border-[rgba(174,137,74,0.4)] hover:shadow-[0_0_0_1px_rgba(174,137,74,0.12),0_4px_20px_rgba(27,42,71,0.08)]"
                style={{ background: t.cardBg, borderColor: t.cardBorder }}
              >
                {/* Aperçu */}
                <div
                  className="flex items-center justify-center p-8"
                  style={{ background: t.previewBg }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.label}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>

                {/* Infos + bouton */}
                <div className="p-4">
                  <p className="text-sm font-semibold" style={{ color: t.text }}>{logo.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
                      style={{ background: t.badgeBg, color: t.badgeText }}
                    >
                      {logo.format}
                    </span>
                    <span className="text-[11px]" style={{ color: t.muted }}>{logo.size}</span>
                  </div>
                  <a
                    href={logo.src}
                    download={logo.file}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-[rgba(174,137,74,0.5)] hover:text-(--color-brand-100)"
                    style={{ borderColor: t.cardBorder, color: t.text }}
                  >
                    <FaDownload className="text-xs" />
                    Télécharger
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. Charte couleurs ─────────────────────────────────────────── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: t.divider }}>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: t.text }}>
            Charte couleurs
          </h2>
          <p className="text-sm mb-8" style={{ color: t.muted }}>
            Cliquez sur une couleur pour copier son code hexadécimal.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BRAND_COLORS.map((color) => (
              <ColorSwatch key={color.hex} color={color} t={t} />
            ))}
          </div>
        </div>

        {/* ── 3. Plaquette commerciale ───────────────────────────────────── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: t.divider }}>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: t.text }}>
            Plaquette commerciale
          </h2>
          <p className="text-sm mb-8" style={{ color: t.muted }}>
            Présentation complète de nos services, notre approche et nos
            modalités de collaboration.
          </p>

          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border p-6 sm:p-8 transition-all duration-300"
            style={{ background: t.cardBg, borderColor: t.cardBorder }}
          >
            <div className="flex items-start gap-4">
              <div
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(174,137,74,0.12)" }}
              >
                <FaFilePdf className="text-xl" style={{ color: "var(--color-brand-100)" }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: t.text }}>
                  Cabinet Martin M&amp;A — Plaquette 2025
                </p>
                <p className="text-sm mt-1" style={{ color: t.muted }}>
                  Format PDF · [Information à compléter — taille du fichier]
                </p>
              </div>
            </div>
            <a
              href="/plaquette.pdf"
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-95"
              style={{
                background: "var(--color-brand-100)",
                color: "#fff",
              }}
            >
              <FaDownload className="text-xs" />
              Télécharger
            </a>
          </div>
        </div>

        {/* ── 4. Guides pratiques ────────────────────────────────────────── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: t.divider }}>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: t.text }}>
            Guides pratiques
          </h2>
          <p className="text-sm mb-8" style={{ color: t.muted }}>
            Des ressources pédagogiques pour comprendre les dispositifs de
            financement. Prochainement disponibles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {GUIDES.map((guide) => (
              <div
                key={guide.title}
                className="rounded-2xl border p-6 opacity-60"
                style={{ background: t.cardBg, borderColor: t.cardBorder }}
              >
                <div
                  className="inline-flex size-10 items-center justify-center rounded-xl mb-4"
                  style={{ background: "rgba(174,137,74,0.1)" }}
                >
                  <FaFilePdf className="text-base" style={{ color: "var(--color-brand-100)" }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: t.text }}>{guide.title}</p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: t.muted }}>{guide.desc}</p>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
                  style={{ background: t.badgeBg, color: t.badgeText }}
                >
                  Bientôt disponible
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Contact presse ──────────────────────────────────────────── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: t.divider }}>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2" style={{ color: t.text }}>
            Contact presse
          </h2>
          <p className="text-sm mb-8" style={{ color: t.muted }}>
            Journaliste ou média ? Nous sommes disponibles pour toute demande
            d&apos;interview, témoignage ou contribution éditoriale.
          </p>

          <div
            className="rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-300 hover:border-[rgba(174,137,74,0.35)]"
            style={{ background: t.cardBg, borderColor: t.cardBorder }}
          >
            <div className="flex items-start gap-4 flex-1">
              <div
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(174,137,74,0.1)" }}
              >
                <FaEnvelope className="text-xl" style={{ color: "var(--color-brand-100)" }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: t.text }}>Cabinet Martin M&amp;A</p>
                <p className="text-sm mt-1" style={{ color: t.muted }}>
                  Mylène &amp; Alexandre Martin · Landes · Nouvelle-Aquitaine
                </p>
                <a
                  href="mailto:contact@cabinetmartin-ma.fr"
                  className="mt-1 inline-block text-sm font-medium hover:text-(--color-brand-100) transition-colors"
                  style={{ color: t.text }}
                >
                  mylene@cabinetmartin-ma.fr
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
