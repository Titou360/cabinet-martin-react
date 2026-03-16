"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import TagInput from "./TagInput";
import ImagePickerModal from "./ImagePickerModal";
import { TiArrowLeft, TiCamera } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

const ALL_TAGS = ["CEE", "Insertion professionnelle", "Mobilité", "Association", "Rénovation", "Entreprise", "Tertiaire", "Industrie"];

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title: string;
    subtitle: string;
    category: string;
    image?: string | null;
    imageAlt?: string | null;
    content: object;
    readTime: string;
    date: string;
    published: boolean;
    linkedinUrl?: string | null;
    tags: string[];
  };
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Réussite client");
  const [image, setImage] = useState<string | null>(initialData?.image ?? null);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt ?? "");
  const [content, setContent] = useState<object>(initialData?.content ?? {});
  const [readTime, setReadTime] = useState(initialData?.readTime ?? "3 min");
  const [date, setDate] = useState(initialData?.date ?? String(new Date().getFullYear()));
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) {
      setUploadError("La photo doit faire moins de 300 Ko.");
      return;
    }
    setUploadError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "img/blog");
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (data.url) setImage(data.url);
    else setUploadError(data.error ?? "Erreur upload");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title, subtitle, category, image, imageAlt: imageAlt || null,
      content, readTime, date, published,
      linkedinUrl: linkedinUrl || null,
      tags,
    };
    const res = await fetch(
      isEdit ? `/api/admin/blog/${initialData!.id}` : "/api/admin/blog",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);
    if (res.ok) router.push("/admin/blog");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#1b2a47]/15 text-[#1b2a47]/50 hover:text-[#1b2a47] hover:border-[#1b2a47]/25 transition"
        >
          <TiArrowLeft className="text-lg" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#1b2a47] tracking-tight">
            {isEdit ? "Modifier l&apos;article" : "Nouvel article"}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Photo */}
        <div>
          <label className="block text-xs font-semibold text-[#1b2a47]/60 mb-2 uppercase tracking-wide">Photo de l&apos;article <span className="font-normal normal-case">(jpg, png, webp — max 300 Ko)</span></label>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} className="hidden" />
          {showPicker && (
            <ImagePickerModal
              folder="img/blog"
              onSelect={url => { setImage(url); setShowPicker(false); }}
              onClose={() => setShowPicker(false)}
            />
          )}
          {image ? (
            <div className="relative inline-block">
              <Image src={image} alt={imageAlt || "Preview"} width={320} height={180} className="rounded-lg object-cover border border-[#1b2a47]/15" style={{ width: 320, height: 180 }} />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#1b2a47]/15 text-[#1b2a47]/60 hover:text-red-500 transition"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex flex-col items-center justify-center w-36 h-36 rounded-xl border-2 border-dashed border-[#1b2a47]/20 text-[#1b2a47]/40 hover:border-[#ae894a]/40 hover:text-[#ae894a] transition cursor-pointer disabled:opacity-50"
              >
                <TiCamera className="text-2xl mb-1" />
                <span className="text-xs text-center leading-tight">{uploading ? "Chargement…" : "Uploader"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="flex flex-col items-center justify-center w-36 h-36 rounded-xl border-2 border-dashed border-[#1b2a47]/20 text-[#1b2a47]/40 hover:border-[#ae894a]/40 hover:text-[#ae894a] transition cursor-pointer"
              >
                <span className="text-2xl mb-1">🖼</span>
                <span className="text-xs text-center leading-tight">Médiathèque</span>
              </button>
            </div>
          )}
          {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
          {image && (
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Texte alternatif (description de la photo)"
              className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-[#1b2a47]/15 text-[#1b2a47] placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition"
            />
          )}
        </div>

        {/* Titre */}
        <Field label="Titre">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Titre de l'article"
            className={inputCls}
          />
        </Field>

        {/* Sous-titre */}
        <Field label="Sous-titre">
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            rows={2}
            placeholder="Accroche courte de l'article"
            className={inputCls}
          />
        </Field>

        {/* Catégorie + Lecture + Date */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Catégorie">
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Temps de lecture">
            <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="3 min" className={inputCls} />
          </Field>
          <Field label="Année / Date">
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2025" className={inputCls} />
          </Field>
        </div>

        {/* Contenu */}
        <Field label="Contenu de l'article">
          <TiptapEditor content={Object.keys(content).length > 0 ? content : null} onChange={setContent} />
        </Field>

        {/* Tags */}
        <Field label="Tags">
          <TagInput tags={tags} onChange={setTags} existingTags={ALL_TAGS} />
        </Field>

        {/* LinkedIn */}
        <Field label="URL du post LinkedIn (optionnel)">
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/…"
            className={inputCls}
          />
        </Field>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className={[
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
              published ? "bg-[#ae894a]" : "bg-[#1b2a47]/20",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
                published ? "translate-x-4" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
          <span className="text-sm text-[#1b2a47]/60">
            {published ? "Publié" : "Brouillon"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#1b2a47]/8">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition"
          style={{ background: "#ae894a" }}
        >
          {saving ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#1b2a47]/60 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 bg-white text-[#1b2a47] text-sm placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 focus:border-[#ae894a] transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#1b2a47]/60 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
