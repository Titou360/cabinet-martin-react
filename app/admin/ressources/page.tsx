"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TiPlus, TiTrash, TiEdit, TiTick, TiCancel, TiDocumentText } from "react-icons/ti";
import Tooltip from "../_components/Tooltip";
import DeleteModal from "../_components/DeleteModal";

// ── Types ──
interface Logo { id: string; name: string; file: string; format?: string | null; }
interface Brochure { id: string; name: string; file: string; }
interface Guide { id: string; title: string; description?: string | null; file?: string | null; status: string; }
interface PressContact { id: string; name: string; email: string; phone?: string | null; notes?: string | null; }

const inp = "w-full px-3 py-2 text-sm rounded-lg border border-[#1b2a47]/15 text-[#1b2a47] placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition bg-white";

export default function RessourcesPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [pressContact, setPressContact] = useState<PressContact | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingGuide, setUploadingGuide] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const brochureRef = useRef<HTMLInputElement>(null);
  const guideFileRef = useRef<HTMLInputElement>(null);

  const [newLogoName, setNewLogoName] = useState("");
  const [newBrochureName, setNewBrochureName] = useState("");
  const [newGuide, setNewGuide] = useState({ title: "", description: "", status: "available" });

  const [editGuideId, setEditGuideId] = useState<string | null>(null);
  const [editGuideForm, setEditGuideForm] = useState({ title: "", description: "", status: "available" });

  const [pressForm, setPressForm]   = useState({ name: "", email: "", phone: "", notes: "" });
  const [editingPress, setEditingPress] = useState(false);
  const [savingPress, setSavingPress]   = useState(false);

  // Suppression générique
  const [deleteTarget, setDeleteTarget] = useState<{ name: string; onConfirm: () => Promise<void> } | null>(null);

  const reload = useCallback(async () => {
    const [l, b, g, p] = await Promise.all([
      fetch("/api/admin/ressources/logos").then(r => r.json()),
      fetch("/api/admin/ressources/brochures").then(r => r.json()),
      fetch("/api/admin/ressources/guides").then(r => r.json()),
      fetch("/api/admin/ressources/press-contact").then(r => r.json()),
    ]);
    setLogos(l ?? []);
    setBrochures(b ?? []);
    setGuides(g ?? []);
    setPressContact(p);
    if (p) setPressForm({ name: p.name, email: p.email, phone: p.phone ?? "", notes: p.notes ?? "" });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Logo upload ──
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !newLogoName.trim()) { alert("Entrez d'abord un nom pour le logo."); return; }
    if (file.size > 300 * 1024) { alert("Le fichier doit faire moins de 300 Ko."); return; }
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "img/logos");
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    if (!upData.url) { setUploadingLogo(false); alert(upData.error ?? "Erreur upload"); return; }
    await fetch("/api/admin/ressources/logos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newLogoName, file: upData.url, format: file.name.split(".").pop()?.toUpperCase() }),
    });
    setNewLogoName("");
    if (logoRef.current) logoRef.current.value = "";
    setUploadingLogo(false);
    reload();
  }

  // ── Brochure upload ──
  async function handleBrochureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !newBrochureName.trim()) { alert("Entrez d'abord un nom pour la plaquette."); return; }
    setUploadingBrochure(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "docs");
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    if (!upData.url) { setUploadingBrochure(false); alert(upData.error ?? "Erreur upload"); return; }
    await fetch("/api/admin/ressources/brochures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrochureName, file: upData.url }),
    });
    setNewBrochureName("");
    if (brochureRef.current) brochureRef.current.value = "";
    setUploadingBrochure(false);
    reload();
  }

  // ── Guide upload (file optional) ──
  async function handleGuideFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGuide(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "docs/guides");
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    setUploadingGuide(false);
    if (upData.url) setNewGuide(g => ({ ...g, _file: upData.url } as typeof g & { _file: string }));
    else alert(upData.error ?? "Erreur upload");
  }

  async function addGuide() {
    if (!newGuide.title.trim()) return;
    const guideData: { title: string; description?: string; file?: string; status: string } = {
      title: newGuide.title,
      description: newGuide.description || undefined,
      status: newGuide.status,
    };
    // @ts-ignore
    if ((newGuide as Record<string, string>)._file) guideData.file = (newGuide as Record<string, string>)._file;
    await fetch("/api/admin/ressources/guides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guideData),
    });
    setNewGuide({ title: "", description: "", status: "available" });
    if (guideFileRef.current) guideFileRef.current.value = "";
    reload();
  }

  async function updateGuide() {
    if (!editGuideId) return;
    await fetch(`/api/admin/ressources/guides/${editGuideId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGuideForm),
    });
    setEditGuideId(null);
    reload();
  }

  async function savePress() {
    setSavingPress(true);
    await fetch("/api/admin/ressources/press-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pressForm),
    });
    setSavingPress(false);
    setEditingPress(false);
    reload();
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Ressources</h1>

      {/* ── LOGOS ── */}
      <Section title="Logos officiels">
        <div className="flex items-end gap-3 mb-4">
          <div className="flex-1">
            <input placeholder="Nom du logo (ex: Logo horizontal PNG)" value={newLogoName}
              onChange={e => setNewLogoName(e.target.value)} className={inp} />
          </div>
          <input ref={logoRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={handleLogoUpload} className="hidden" />
          <button onClick={() => logoRef.current?.click()} disabled={uploadingLogo || !newLogoName.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 whitespace-nowrap"
            style={{ background: "#ae894a" }}>
            <TiPlus className="inline mr-1" />{uploadingLogo ? "Chargement…" : "Ajouter"}
          </button>
        </div>
        <div className="space-y-2">
          {logos.map(logo => (
            <div key={logo.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#1b2a47]/8">
              <Image src={logo.file} alt={logo.name} width={48} height={48} className="object-contain rounded" style={{ width: 48, height: 48 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1b2a47]">{logo.name}</p>
                {logo.format && <p className="text-xs text-[#1b2a47]/40">{logo.format}</p>}
              </div>
              <Tooltip label="Supprimer">
                <button onClick={() => setDeleteTarget({ name: logo.name, onConfirm: async () => { await fetch(`/api/admin/ressources/logos/${logo.id}`, { method: "DELETE" }); reload(); } })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition">
                  <TiTrash className="text-base" />
                </button>
              </Tooltip>
            </div>
          ))}
          {logos.length === 0 && <p className="text-sm text-[#1b2a47]/30 py-4 text-center">Aucun logo ajouté.</p>}
        </div>
      </Section>

      {/* ── PLAQUETTES ── */}
      <Section title="Plaquettes commerciales">
        <div className="flex items-end gap-3 mb-4">
          <div className="flex-1">
            <input placeholder="Nom de la plaquette" value={newBrochureName}
              onChange={e => setNewBrochureName(e.target.value)} className={inp} />
          </div>
          <input ref={brochureRef} type="file" accept=".pdf" onChange={handleBrochureUpload} className="hidden" />
          <button onClick={() => brochureRef.current?.click()} disabled={uploadingBrochure || !newBrochureName.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 whitespace-nowrap"
            style={{ background: "#ae894a" }}>
            <TiPlus className="inline mr-1" />{uploadingBrochure ? "Chargement…" : "Ajouter PDF"}
          </button>
        </div>
        <div className="space-y-2">
          {brochures.map(b => (
            <div key={b.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#1b2a47]/8">
              <TiDocumentText className="text-2xl text-[#ae894a] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1b2a47]">{b.name}</p>
                <a href={b.file} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ae894a] hover:underline">Voir le PDF</a>
              </div>
              <Tooltip label="Supprimer">
                <button onClick={() => setDeleteTarget({ name: b.name, onConfirm: async () => { await fetch(`/api/admin/ressources/brochures/${b.id}`, { method: "DELETE" }); reload(); } })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition">
                  <TiTrash className="text-base" />
                </button>
              </Tooltip>
            </div>
          ))}
          {brochures.length === 0 && <p className="text-sm text-[#1b2a47]/30 py-4 text-center">Aucune plaquette ajoutée.</p>}
        </div>
      </Section>

      {/* ── GUIDES ── */}
      <Section title="Guides pratiques">
        {/* Add form */}
        <div className="bg-[#f9f5ec] rounded-xl p-4 border border-[#ae894a]/15 mb-4 space-y-2.5">
          <p className="text-xs font-semibold text-[#1b2a47]/60 uppercase tracking-wide">Nouveau guide</p>
          <input placeholder="Titre du guide *" value={newGuide.title}
            onChange={e => setNewGuide(g => ({ ...g, title: e.target.value }))} className={inp} />
          <input placeholder="Description (optionnel)" value={newGuide.description}
            onChange={e => setNewGuide(g => ({ ...g, description: e.target.value }))} className={inp} />
          {/* Availability radio */}
          <div className="flex items-center gap-6">
            <p className="text-xs font-semibold text-[#1b2a47]/60">Disponibilité :</p>
            {[["available", "Disponible"], ["coming-soon", "Bientôt disponible"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="guideStatus" value={val}
                  checked={newGuide.status === val}
                  onChange={() => setNewGuide(g => ({ ...g, status: val }))}
                  className="accent-[#ae894a]"
                />
                <span className="text-sm text-[#1b2a47]/70">{label}</span>
              </label>
            ))}
          </div>
          {/* File (only if available) */}
          {newGuide.status === "available" && (
            <>
              <input ref={guideFileRef} type="file" accept=".pdf" onChange={handleGuideFileUpload} className="hidden" />
              <button onClick={() => guideFileRef.current?.click()} disabled={uploadingGuide}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1b2a47]/15 text-[#1b2a47]/60 hover:border-[#ae894a] hover:text-[#ae894a] transition disabled:opacity-50">
                {uploadingGuide ? "Chargement…" : "Attacher un PDF (optionnel)"}
              </button>
            </>
          )}
          <div>
            <button onClick={addGuide} disabled={!newGuide.title.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
              style={{ background: "#ae894a" }}>
              <TiTick /> Ajouter le guide
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {guides.map(g => editGuideId === g.id ? (
            <div key={g.id} className="bg-[#f9f5ec] rounded-xl p-4 border border-[#ae894a]/15 space-y-2.5">
              <input value={editGuideForm.title} onChange={e => setEditGuideForm(f => ({ ...f, title: e.target.value }))} className={inp} />
              <input value={editGuideForm.description} onChange={e => setEditGuideForm(f => ({ ...f, description: e.target.value }))} className={inp} />
              <div className="flex items-center gap-6">
                {[["available", "Disponible"], ["coming-soon", "Bientôt disponible"]].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="editGuideStatus" value={val}
                      checked={editGuideForm.status === val}
                      onChange={() => setEditGuideForm(f => ({ ...f, status: val }))}
                      className="accent-[#ae894a]"
                    />
                    <span className="text-sm text-[#1b2a47]/70">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={updateGuide} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#ae894a" }}>
                  <TiTick /> Enregistrer
                </button>
                <button onClick={() => setEditGuideId(null)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] transition">
                  <TiCancel /> Annuler
                </button>
              </div>
            </div>
          ) : (
            <div key={g.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#1b2a47]/8">
              <TiDocumentText className="text-xl text-[#ae894a] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1b2a47]">{g.title}</p>
                  {g.status === "coming-soon" && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#1b2a47]/8 text-[#1b2a47]/40">Bientôt dispo</span>
                  )}
                </div>
                {g.description && <p className="text-xs text-[#1b2a47]/50 mt-0.5">{g.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Tooltip label="Modifier">
                  <button onClick={() => { setEditGuideId(g.id); setEditGuideForm({ title: g.title, description: g.description ?? "", status: g.status }); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition">
                    <TiEdit className="text-base" />
                  </button>
                </Tooltip>
                <Tooltip label="Supprimer">
                  <button onClick={() => setDeleteTarget({ name: g.title, onConfirm: async () => { await fetch(`/api/admin/ressources/guides/${g.id}`, { method: "DELETE" }); reload(); } })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition">
                    <TiTrash className="text-base" />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
          {guides.length === 0 && <p className="text-sm text-[#1b2a47]/30 py-4 text-center">Aucun guide ajouté.</p>}
        </div>
      </Section>

      {/* ── CONTACT PRESSE ── */}
      <Section title="Contact presse / médias">
        {editingPress ? (
          <div className="bg-[#f9f5ec] rounded-xl p-5 border border-[#ae894a]/15 space-y-2.5">
            <input placeholder="Nom du contact *" value={pressForm.name} onChange={e => setPressForm(f => ({ ...f, name: e.target.value }))} className={inp} />
            <input type="email" placeholder="Email *" value={pressForm.email} onChange={e => setPressForm(f => ({ ...f, email: e.target.value }))} className={inp} />
            <input type="tel" placeholder="Téléphone (optionnel)" value={pressForm.phone} onChange={e => setPressForm(f => ({ ...f, phone: e.target.value }))} className={inp} />
            <textarea placeholder="Notes (optionnel)" rows={3} value={pressForm.notes} onChange={e => setPressForm(f => ({ ...f, notes: e.target.value }))} className={inp} />
            <div className="flex gap-2">
              <button onClick={savePress} disabled={savingPress} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ background: "#ae894a" }}>
                <TiTick /> {savingPress ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button onClick={() => setEditingPress(false)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] transition">
                <TiCancel /> Annuler
              </button>
            </div>
          </div>
        ) : pressContact ? (
          <div className="bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1b2a47]">{pressContact.name}</p>
                <p className="text-sm text-[#ae894a]">{pressContact.email}</p>
                {pressContact.phone && <p className="text-xs text-[#1b2a47]/50 mt-0.5">{pressContact.phone}</p>}
                {pressContact.notes && <p className="text-xs text-[#1b2a47]/40 mt-1">{pressContact.notes}</p>}
              </div>
              <Tooltip label="Modifier">
                <button onClick={() => setEditingPress(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition">
                  <TiEdit className="text-base" />
                </button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditingPress(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#ae894a" }}>
            <TiPlus className="text-base" />
            Ajouter un contact presse
          </button>
        )}
      </Section>

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          confirmText="Je supprime"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => { await deleteTarget.onConfirm(); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[#1b2a47] mb-4 pb-2 border-b border-[#1b2a47]/8">{title}</h2>
      {children}
    </div>
  );
}
