"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TiPlus, TiEdit, TiTrash, TiLink, TiCamera } from "react-icons/ti";
import { FaLinkedin, FaGoogle, FaFacebook } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import { IoClose } from "react-icons/io5";
import Tooltip from "../_components/Tooltip";
import DeleteModal from "../_components/DeleteModal";
import ImagePickerModal from "../_components/ImagePickerModal";

interface Review {
  id: string;
  photo?: string | null;
  firstName: string;
  lastName: string;
  content: string;
  linkUrl?: string | null;
  realisationTitle?: string | null;
  realisationMonth?: string | null;
  realisationYear?: string | null;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const emptyForm = {
  photo: "", firstName: "", lastName: "", content: "",
  linkUrl: "", realisationTitle: "", realisationMonth: "", realisationYear: "",
};

function detectLinkType(url: string) {
  if (!url) return null;
  const u = url.toLowerCase();
  if (u.includes("linkedin.com"))                                    return "linkedin";
  if (u.includes("google.com") || u.includes("g.co") || u.includes("maps.app")) return "google";
  if (u.includes("trustpilot.com"))                                  return "trustpilot";
  if (u.includes("facebook.com") || u.includes("fb.com"))            return "facebook";
  return "other";
}

function LinkIcon({ url, className = "text-lg" }: { url: string; className?: string }) {
  const type = detectLinkType(url);
  if (type === "linkedin")   return <FaLinkedin   className={`${className} text-[#0A66C2]`} />;
  if (type === "google")     return <FaGoogle     className={`${className} text-[#4285F4]`} />;
  if (type === "trustpilot") return <SiTrustpilot className={`${className} text-[#00B67A]`} />;
  if (type === "facebook")   return <FaFacebook   className={`${className} text-[#1877F2]`} />;
  if (type === "other")      return <TiLink       className={`${className} text-[#ae894a]`} />;
  return null;
}

export default function AvisPage() {
  const [reviews, setReviews]           = useState<Review[]>([]);
  const [loading, setLoading]           = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [modalMode, setModalMode]       = useState<"new" | "edit" | null>(null);
  const [editTarget, setEditTarget]     = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    const res  = await fetch("/api/admin/avis");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleSave(data: typeof emptyForm) {
    const payload = {
      photo:            data.photo            || null,
      firstName:        data.firstName,
      lastName:         data.lastName,
      content:          data.content,
      linkUrl:          data.linkUrl          || null,
      realisationTitle: data.realisationTitle || null,
      realisationMonth: data.realisationMonth || null,
      realisationYear:  data.realisationYear  || null,
    };
    if (modalMode === "edit" && editTarget) {
      await fetch(`/api/admin/avis/${editTarget.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/avis", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    }
    setModalMode(null);
    setEditTarget(null);
    fetchReviews();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/avis/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetchReviews();
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Avis</h1>
          <p className="text-sm text-[#1b2a47]/50 mt-0.5">
            {reviews.length} avis{reviews.length !== 1 ? "" : ""}
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalMode("new"); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "#ae894a" }}
        >
          <TiPlus className="text-base" />
          Nouvel avis
        </button>
      </div>

      {loading ? (
        <div className="text-[#1b2a47]/40 text-sm">Chargement…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-[#1b2a47]/40">
          <p className="text-base mb-3">Aucun avis pour le moment.</p>
          <button
            onClick={() => setModalMode("new")}
            className="text-[#ae894a] font-medium hover:underline text-sm"
          >
            Ajouter le premier avis →
          </button>
        </div>
      ) : (
        <>
          {/* Légende */}
          <div className="flex items-center justify-end gap-4 mb-3 px-1">
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiEdit className="text-base" /> Modifier
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiTrash className="text-base" /> Supprimer
            </span>
          </div>

          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8 hover:border-[#1b2a47]/15 transition"
              >
                {/* Avatar */}
                {review.photo ? (
                  <Image
                    src={review.photo} alt={review.firstName}
                    width={44} height={44}
                    className="rounded-full object-cover shrink-0"
                    style={{ width: 44, height: 44 }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#1b2a47]/8 shrink-0 flex items-center justify-center text-[#1b2a47]/40 text-sm font-semibold">
                    {review.firstName[0]}{review.lastName[0]}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Nom + icone source */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[#1b2a47]">
                      {review.firstName} {review.lastName}
                    </p>
                    {review.linkUrl && (
                      <a
                        href={review.linkUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center text-base opacity-70 hover:opacity-100 transition"
                      >
                        <LinkIcon url={review.linkUrl} />
                      </a>
                    )}
                  </div>

                  {/* Extrait de l'avis */}
                  <p className="text-xs text-[#1b2a47]/60 truncate">{review.content}</p>

                  {/* Réalisation + date */}
                  {(review.realisationTitle || review.realisationMonth || review.realisationYear) && (
                    <p className="text-xs text-[#ae894a] mt-0.5 truncate">
                      {[
                        review.realisationTitle,
                        [review.realisationMonth, review.realisationYear].filter(Boolean).join(" "),
                      ].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Tooltip label="Modifier">
                    <button
                      onClick={() => { setEditTarget(review); setModalMode("edit"); }}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
                    >
                      <TiEdit className="text-xl" />
                    </button>
                  </Tooltip>
                  <Tooltip label="Supprimer">
                    <button
                      onClick={() => setDeleteTarget(review)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <TiTrash className="text-xl" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal création / édition */}
      {modalMode && (
        <ReviewModal
          title={modalMode === "edit" ? "Modifier l'avis" : "Nouvel avis"}
          initial={
            modalMode === "edit" && editTarget
              ? {
                  photo:            editTarget.photo            ?? "",
                  firstName:        editTarget.firstName,
                  lastName:         editTarget.lastName,
                  content:          editTarget.content,
                  linkUrl:          editTarget.linkUrl          ?? "",
                  realisationTitle: editTarget.realisationTitle ?? "",
                  realisationMonth: editTarget.realisationMonth ?? "",
                  realisationYear:  editTarget.realisationYear  ?? "",
                }
              : emptyForm
          }
          onSave={handleSave}
          onCancel={() => { setModalMode(null); setEditTarget(null); }}
        />
      )}

      {/* Modale suppression */}
      {deleteTarget && (
        <DeleteModal
          itemName={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          confirmText="Je supprime l'avis"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// ─── Modal formulaire ────────────────────────────────────────────────────────

function ReviewModal({
  title,
  initial,
  onSave,
  onCancel,
}: {
  title: string;
  initial: typeof emptyForm;
  onSave: (data: typeof emptyForm) => void;
  onCancel: () => void;
}) {
  const [form, setForm]           = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const inp = "w-full px-3.5 py-2.5 rounded-lg border border-[#1b2a47]/15 text-sm text-[#1b2a47] placeholder:text-[#1b2a47]/25 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition bg-white";

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) { alert("La photo doit faire moins de 300 Ko."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "img/avis");
    const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm(f => ({ ...f, photo: data.url }));
  }

  const linkType = detectLinkType(form.linkUrl);
  const canSave  = form.firstName.trim() && form.lastName.trim() && form.content.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(27,42,71,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg bg-[#f9f5ec] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[#1b2a47]">{title}</h2>
          <button onClick={onCancel} className="text-[#1b2a47]/30 hover:text-[#1b2a47] transition">
            <IoClose className="text-lg" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Photo */}
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={uploadPhoto} className="hidden" />
          {showPicker && (
            <ImagePickerModal
              folder="img/avis"
              onSelect={url => { setForm(f => ({ ...f, photo: url })); setShowPicker(false); }}
              onClose={() => setShowPicker(false)}
            />
          )}
          <div className="flex items-center gap-3">
            {form.photo ? (
              <Image
                src={form.photo} alt=""
                width={56} height={56}
                className="rounded-full object-cover border border-[#1b2a47]/15 shrink-0"
                style={{ width: 56, height: 56 }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1b2a47]/8 shrink-0 flex items-center justify-center text-[#1b2a47]/30">
                <TiCamera className="text-xl" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1b2a47]/15 text-[#1b2a47]/60 hover:border-[#ae894a] hover:text-[#ae894a] transition disabled:opacity-50"
              >
                {uploading ? "Chargement…" : "Uploader une photo"}
              </button>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1b2a47]/15 text-[#1b2a47]/60 hover:border-[#ae894a] hover:text-[#ae894a] transition"
              >
                Médiathèque →
              </button>
            </div>
          </div>

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Prénom *"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              className={inp}
            />
            <input
              placeholder="Nom *"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              className={inp}
            />
          </div>

          {/* Contenu de l'avis */}
          <textarea
            placeholder="Avis *"
            rows={4}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className={inp}
          />

          {/* Lien avec détection d'icône */}
          <div className="relative">
            <input
              type="url"
              placeholder="Lien vers l'avis (optionnel)"
              value={form.linkUrl}
              onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))}
              className={`${inp} ${form.linkUrl ? "pr-10" : ""}`}
            />
            {form.linkUrl && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <LinkIcon url={form.linkUrl} className="text-lg" />
              </span>
            )}
          </div>

          {/* Réalisation */}
          <div className="border-t border-[#1b2a47]/8 pt-3">
            <p className="text-[11px] font-semibold text-[#1b2a47]/50 uppercase tracking-wide mb-2.5">
              Réalisation associée
            </p>
            <input
              placeholder="Réalisation effectuée (ex : Obtention de 120 000 € CEE)"
              value={form.realisationTitle}
              onChange={e => setForm(f => ({ ...f, realisationTitle: e.target.value }))}
              className={inp}
            />
          </div>

          {/* Mois + Année */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.realisationMonth}
              onChange={e => setForm(f => ({ ...f, realisationMonth: e.target.value }))}
              className={inp}
            >
              <option value="">Mois (optionnel)</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              type="number"
              placeholder="Année (ex : 2024)"
              min="2000"
              max="2099"
              value={form.realisationYear}
              onChange={e => setForm(f => ({ ...f, realisationYear: e.target.value }))}
              className={inp}
            />
          </div>
        </div>

        {/* Pied de modal */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => onSave(form)}
            disabled={!canSave}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            style={{ background: "#ae894a" }}
          >
            Enregistrer
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
