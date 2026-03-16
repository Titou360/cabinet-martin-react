"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FaLinkedin } from "react-icons/fa";
import { TiArrowRight } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CustomTitle from "../ui/CustomTitle/CustomTitle";
import { useIsDark } from "@/app/hooks/useIsDark";

// ─── Types ────────────────────────────────────────────────────────────────────
type Article = {
  id:          string;
  image:       string | null;
  imageAlt:    string | null;
  category:    string;
  title:       string;
  subtitle:    string;
  date:        string;
  readTime:    string;
  linkedinUrl: string | null;
  tags:        string; // JSON stringified array
  content:     string; // Tiptap JSON stringified
};

// Extensions used to parse Tiptap JSON → HTML
const TIPTAP_EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [2, 3] } }),
  Underline,
  Link.configure({ openOnClick: false }),
];

function renderContent(contentJson: string): string {
  try {
    return generateHTML(JSON.parse(contentJson), TIPTAP_EXTENSIONS);
  } catch {
    return contentJson;
  }
}

// ─── Tokens ───────────────────────────────────────────────────────────────────
function useTokens() {
  const isDark = useIsDark();
  return {
    isDark,
    bg:           isDark ? "var(--overlay)"         : "var(--bg)",
    text:         isDark ? "var(--overlayText)"      : "var(--text)",
    muted:        isDark ? "rgba(249,245,236,0.6)"   : "rgba(27,42,71,0.6)",
    cardBg:       isDark ? "rgba(249,245,236,0.04)"  : "var(--card-bg)",
    cardBorder:   isDark ? "rgba(249,245,236,0.1)"   : "var(--card-border)",
    modalBg:      isDark ? "var(--overlay)"          : "#f9f5ec",
    modalBorder:  isDark ? "rgba(249,245,236,0.1)"   : "rgba(27,42,71,0.1)",
    overlayBg:    isDark ? "rgba(0,0,0,0.75)"        : "rgba(27,42,71,0.55)",
    badgeBg:      isDark ? "rgba(174,137,74,0.18)"   : "rgba(174,137,74,0.12)",
    titleClass:   isDark ? "text-(--overlayText)"    : "text-(--text)",
  };
}

// ─── BlogCard ─────────────────────────────────────────────────────────────────
function BlogCard({
  article,
  t,
  onOpen,
}: {
  article: Article;
  t: ReturnType<typeof useTokens>;
  onOpen: () => void;
}) {
  const tags: string[] = JSON.parse(article.tags || "[]");

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:border-[rgba(174,137,74,0.4)] hover:shadow-[0_0_0_1px_rgba(174,137,74,0.12),0_8px_32px_rgba(27,42,71,0.1)] cursor-pointer"
      style={{ background: t.cardBg, borderColor: t.cardBorder }}
      whileHover={{ y: -4 }}
      transition={{ type: "tween", duration: 0.2 }}
      onClick={onOpen}
    >
      {/* Image */}
      {article.image && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Badge catégorie */}
          <span
            className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{ background: "var(--color-brand-100)", color: "#fff" }}
          >
            {article.category}
          </span>
        </div>
      )}

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] tracking-wide" style={{ color: t.muted }}>{article.date}</span>
          <span style={{ color: t.muted }}>·</span>
          <span className="text-[11px] tracking-wide" style={{ color: t.muted }}>{article.readTime} de lecture</span>
        </div>

        <h3
          className="text-lg font-semibold leading-snug tracking-[-0.01em] mb-2 line-clamp-2 group-hover:text-(--color-brand-100) transition-colors duration-200"
          style={{ color: t.text }}
        >
          {article.title}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: t.muted }}
        >
          {article.subtitle}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                style={{ background: t.badgeBg, color: "var(--color-brand-100)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-5 flex items-center gap-2">
          <span
            className="text-sm font-semibold group-hover:text-(--color-brand-100) transition-colors duration-200"
            style={{ color: "var(--color-brand-100)" }}
          >
            Lire plus
          </span>
          <TiArrowRight
            className="text-base transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: "var(--color-brand-100)" }}
          />
        </div>
      </div>
    </motion.article>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-300 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-5xl w-full max-h-[90vh]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ maxHeight: "85vh" }}>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto object-contain rounded-xl"
            style={{ maxHeight: "85vh" }}
          />
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer la photo"
          className="absolute -top-3 -right-3 inline-flex size-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
        >
          <IoClose className="text-lg" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ArticleModal({
  article,
  t,
  onClose,
}: {
  article: Article;
  t: ReturnType<typeof useTokens>;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const tags: string[] = JSON.parse(article.tags || "[]");
  const bodyHtml = renderContent(article.content);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("lenis:pause"));
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("lenis:resume"));
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="article-modal"
          className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: t.overlayBg, backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}` }}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image + bouton fermer */}
            {article.image && (
              <div
                className="relative h-52 sm:h-64 shrink-0 overflow-hidden cursor-zoom-in"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                title="Voir en plein écran"
              >
                <Image
                  src={article.image}
                  alt={article.imageAlt ?? article.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span
                  className="absolute bottom-4 left-5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm"
                  style={{ background: "rgba(174,137,74,0.85)", color: "#fff" }}
                >
                  {article.category}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  aria-label="Fermer l'article"
                  className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60 hover:border-white/60"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
            )}

            {/* Contenu scrollable */}
            <div ref={scrollRef} data-lenis-prevent className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
              {/* Bouton fermer si pas d'image */}
              {!article.image && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={onClose}
                    aria-label="Fermer l'article"
                    className="inline-flex size-8 items-center justify-center rounded-full border text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
                    style={{ borderColor: t.modalBorder }}
                  >
                    <IoClose className="text-base" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] tracking-wide" style={{ color: t.muted }}>{article.date}</span>
                <span style={{ color: t.muted }}>·</span>
                <span className="text-[11px] tracking-wide" style={{ color: t.muted }}>{article.readTime} de lecture</span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.02em] mb-3"
                style={{ color: t.text }}
              >
                {article.title}
              </h2>
              <p
                className="text-base leading-relaxed mb-6 pb-6 border-b"
                style={{ color: t.muted, borderColor: t.modalBorder }}
              >
                {article.subtitle}
              </p>

              {/* Corps — rendu depuis Tiptap JSON */}
              <div
                className="article-body text-sm sm:text-base leading-relaxed space-y-4"
                style={{ color: t.muted }}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t" style={{ borderColor: t.modalBorder }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
                      style={{ background: t.badgeBg, color: "var(--color-brand-100)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* LinkedIn */}
              {article.linkedinUrl && !article.linkedinUrl.startsWith("TODO") && (
                <a
                  href={article.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-[#0077b5] hover:text-[#0077b5]"
                  style={{ borderColor: t.cardBorder, color: t.muted }}
                >
                  <FaLinkedin className="text-base" />
                  Voir le post original sur LinkedIn
                </a>
              )}

              <div className="h-2" />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && article.image && (
          <Lightbox
            key="lightbox"
            src={article.image}
            alt={article.imageAlt ?? article.title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────
const PAGE_SIZE = 3;

export default function BlogSection() {
  const t = useTokens();
  const [articles, setArticles]       = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openId, setOpenId]           = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  const openArticle = articles.find((a) => a.id === openId) ?? null;
  const visible     = articles.slice(0, visibleCount);
  const hasMore     = visibleCount < articles.length;

  if (articles.length === 0) return null;

  return (
    <>
      <section
        className="transition-colors duration-500"
        style={{ background: t.bg }}
      >
        <div className="h-px bg-linear-to-r from-transparent via-(--color-brand-100)/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24">
          <div className="max-w-2xl mb-10">
            <CustomTitle
              title="Nos réussites"
              offset={30}
              className={t.titleClass}
            />
            <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: t.muted }}>
              Des projets concrets, des financements obtenus, des impacts réels.
              Découvrez comment nos clients ont transformé leurs ambitions grâce aux CEE.
            </p>
          </div>

          {/* Grille centrée */}
          <div className="flex flex-wrap justify-center gap-6">
            {visible.map((article) => (
              <div
                key={article.id}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <BlogCard
                  article={article}
                  t={t}
                  onOpen={() => setOpenId(article.id)}
                />
              </div>
            ))}
          </div>

          {/* Voir plus */}
          {hasMore && (
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-200 hover:border-[rgba(174,137,74,0.5)] hover:text-(--color-brand-100)"
                style={{ borderColor: "rgba(174,137,74,0.25)", color: "var(--color-brand-100)" }}
              >
                Voir plus
                <TiArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {openArticle && (
        <ArticleModal
          article={openArticle}
          t={t}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}
