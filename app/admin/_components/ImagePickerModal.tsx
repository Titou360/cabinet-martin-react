"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TiPlus, TiTrash } from "react-icons/ti";
import DeleteModal from "./DeleteModal";

interface MediaFile { name: string; url: string; }

interface ImagePickerModalProps {
  folder: "img/blog" | "img/avis";
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImagePickerModal({ folder, onSelect, onClose }: ImagePickerModalProps) {
  const [files, setFiles]           = useState<MediaFile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [copied, setCopied]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const fileRef                     = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/admin/media?folder=${folder}`);
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [folder]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) { alert("Max 300 Ko."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    await loadFiles();
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleDelete(file: MediaFile, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteTarget(file);
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

  const folderLabel = folder === "img/blog" ? "Blog" : "Avis";

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ background: "rgba(27,42,71,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2a47]/8 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-[#1b2a47]">Médiathèque — {folderLabel}</h2>
            <p className="text-xs text-[#1b2a47]/40 mt-0.5">
              {files.length} image{files.length !== 1 ? "s" : ""} · Cliquez pour sélectionner
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition"
              style={{ background: "#ae894a" }}
            >
              <TiPlus /> {uploading ? "Chargement…" : "Ajouter"}
            </button>
            <button onClick={onClose} className="text-[#1b2a47]/30 hover:text-[#1b2a47] transition ml-1">
              <IoClose className="text-lg" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-[#1b2a47]/40 text-center py-10">Chargement…</p>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-[#1b2a47]/30">
              <p className="text-sm mb-2">Aucune image dans ce dossier.</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-[#ae894a] hover:underline"
              >
                Ajouter une image →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map(file => (
                <div
                  key={file.url}
                  onClick={() => { setCopied(file.url); onSelect(file.url); }}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#ae894a] cursor-pointer transition-all duration-150"
                >
                  <Image src={file.url} alt={file.name} fill className="object-cover" sizes="180px" />

                  {/* Bouton supprimer */}
                  <button
                    onClick={e => handleDelete(file, e)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    <TiTrash className="text-xs" />
                  </button>

                  {/* Nom au survol */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    <p className="text-[10px] text-white truncate">{file.name}</p>
                  </div>

                  {/* Flash "Copié" */}
                  {copied === file.url && (
                    <div className="absolute inset-0 bg-[#ae894a]/80 flex items-center justify-center rounded-xl">
                      <span className="text-xs font-semibold text-white">Sélectionné ✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
