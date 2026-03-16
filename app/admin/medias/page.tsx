"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { TiPlus, TiTrash } from "react-icons/ti";
import DeleteModal from "../_components/DeleteModal";

interface MediaFile { name: string; url: string; }

const TABS = [
  { key: "img/blog", label: "Blog" },
  { key: "img/avis", label: "Avis" },
] as const;

type Folder = (typeof TABS)[number]["key"];

export default function MediasPage() {
  const [tab, setTab]             = useState<Folder>("img/blog");
  const [files, setFiles]         = useState<MediaFile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [flash, setFlash]               = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const fileRef                         = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/admin/media?folder=${tab}`);
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [tab]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) { alert("Max 300 Ko."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", tab);
    await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    await loadFiles();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch("/api/admin/media", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ filePath: deleteTarget.url }),
    });
    setDeleteTarget(null);
    await loadFiles();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setFlash(url);
    setTimeout(() => setFlash(null), 1500);
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Médiathèque</h1>
          <p className="text-sm text-[#1b2a47]/50 mt-0.5">
            {files.length} image{files.length !== 1 ? "s" : ""} · {TABS.find(t => t.key === tab)?.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition"
            style={{ background: "#ae894a" }}
          >
            <TiPlus className="text-base" />
            {uploading ? "Chargement…" : "Ajouter une image"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1b2a47]/6 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "px-5 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.key
                ? "bg-white text-[#1b2a47] shadow-sm"
                : "text-[#1b2a47]/50 hover:text-[#1b2a47]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-sm text-[#1b2a47]/40">Chargement…</div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-[#1b2a47]/30">
          <p className="text-base mb-3">Aucune image dans ce dossier.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-sm text-[#ae894a] hover:underline"
          >
            Ajouter la première image →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map(file => (
            <div key={file.url} className="group relative">
              {/* Image */}
              <div
                onClick={() => copyUrl(file.url)}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#ae894a] cursor-pointer transition-all duration-150"
              >
                <Image src={file.url} alt={file.name} fill className="object-cover" sizes="220px" />

                {/* Overlay "Copié" */}
                {flash === file.url && (
                  <div className="absolute inset-0 bg-[#ae894a]/80 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">URL copiée ✓</span>
                  </div>
                )}

                {/* Overlay hover */}
                {flash !== file.url && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-end transition-all duration-150">
                    <div className="w-full px-2 py-1.5 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-[10px] text-white truncate drop-shadow">{file.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => setDeleteTarget(file)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[#1b2a47]/10 text-[#1b2a47]/40 hover:text-red-500 hover:border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
              >
                <TiTrash className="text-sm" />
              </button>

              {/* Nom */}
              <p className="mt-1.5 text-xs text-[#1b2a47]/50 truncate px-0.5">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-[#1b2a47]/30">
        Cliquez sur une image pour copier son URL · Survolez pour supprimer
      </p>

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          confirmText="Je supprime l'image"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
