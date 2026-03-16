"use client";

import { useState, useEffect, useCallback } from "react";
import { TiPlus, TiEdit, TiTrash, TiTick, TiCancel } from "react-icons/ti";
import Tooltip from "../_components/Tooltip";
import DeleteModal from "../_components/DeleteModal";

interface Reference { id: string; name: string; description?: string | null; url?: string | null; }

const emptyRef = { name: "", description: "", url: "" };

const formatFR = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/\u202F|\u00A0/g, "\u00A0");

export default function ReferencesPage() {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRef);
  const [showNew, setShowNew]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Reference | null>(null);

  // Subventions total
  const [total, setTotal]         = useState<number | null>(null);
  const [totalInput, setTotalInput] = useState("");
  const [editingTotal, setEditingTotal] = useState(false);
  const [savingTotal, setSavingTotal]   = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { setTotal(d.totalSubventions); setTotalInput(String(d.totalSubventions)); });
  }, []);

  async function saveTotal() {
    setSavingTotal(true);
    const res  = await fetch("/api/admin/settings", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ totalSubventions: totalInput }),
    });
    const data = await res.json();
    setSavingTotal(false);
    if (!data.error) { setTotal(data.totalSubventions); setEditingTotal(false); }
  }

  const fetch_ = useCallback(async () => {
    const res = await fetch("/api/admin/references");
    setRefs(await res.json());
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);

  async function save() {
    if (editId) {
      await fetch(`/api/admin/references/${editId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/admin/references", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      setShowNew(false);
    }
    setForm(emptyRef);
    fetch_();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/references/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetch_();
  }

  function startEdit(ref: Reference) {
    setEditId(ref.id);
    setForm({ name: ref.name, description: ref.description ?? "", url: ref.url ?? "" });
    setShowNew(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Références</h1>
          <p className="text-sm text-[#1b2a47]/50 mt-0.5">{refs.length} référence{refs.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setEditId(null); setForm(emptyRef); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#ae894a" }}
        >
          <TiPlus className="text-base" />
          Ajouter
        </button>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-end gap-4 mb-3 px-1">
        <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
          <TiEdit className="text-base" /> Modifier
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
          <TiTrash className="text-base" /> Supprimer
        </span>
      </div>

      {/* ── Subventions totales ── */}
      <div className="bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8 mb-8">
        <p className="text-xs font-semibold text-[#1b2a47]/50 uppercase tracking-wide mb-3">
          Subventions totales obtenues
        </p>
        {editingTotal ? (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <input
                autoFocus
                type="number"
                min="0"
                value={totalInput}
                onChange={e => setTotalInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveTotal(); if (e.key === "Escape") setEditingTotal(false); }}
                className="w-full px-3.5 py-2 rounded-lg border border-[#1b2a47]/15 text-sm text-[#1b2a47] focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1b2a47]/40">€</span>
            </div>
            <button
              onClick={saveTotal}
              disabled={savingTotal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition"
              style={{ background: "#ae894a" }}
            >
              <TiTick /> {savingTotal ? "…" : "Enregistrer"}
            </button>
            <button
              onClick={() => { setEditingTotal(false); setTotalInput(String(total ?? "")); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] transition"
            >
              <TiCancel /> Annuler
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold text-[#1b2a47] tracking-tight">
              {total !== null ? `${formatFR(total)}\u00A0€` : "—"}
            </p>
            <Tooltip label="Modifier">
              <button
                onClick={() => setEditingTotal(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
              >
                <TiEdit className="text-base" />
              </button>
            </Tooltip>
          </div>
        )}
        <p className="text-xs text-[#1b2a47]/40 mt-2">
          Affiché sur la page d&rsquo;accueil dans la section &laquo;&thinsp;Réalisations&thinsp;&raquo;.
        </p>
      </div>

      {/* Inline form for new */}
      {showNew && (
        <InlineForm
          form={form}
          onChange={setForm}
          onSave={save}
          onCancel={() => { setShowNew(false); setForm(emptyRef); }}
          title="Nouvelle référence"
        />
      )}

      <div className="space-y-3">
        {refs.map((ref) => editId === ref.id ? (
          <InlineForm
            key={ref.id}
            form={form}
            onChange={setForm}
            onSave={save}
            onCancel={() => { setEditId(null); setForm(emptyRef); }}
            title="Modifier"
          />
        ) : (
          <div key={ref.id} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1b2a47]">{ref.name}</p>
              {ref.description && <p className="text-xs text-[#1b2a47]/50 mt-0.5 truncate">{ref.description}</p>}
              {ref.url && <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ae894a] hover:underline">{ref.url}</a>}
            </div>
            <div className="flex gap-1 shrink-0">
              <Tooltip label="Modifier">
                <button onClick={() => startEdit(ref)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition">
                  <TiEdit className="text-base" />
                </button>
              </Tooltip>
              <Tooltip label="Supprimer">
                <button onClick={() => setDeleteTarget(ref)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition">
                  <TiTrash className="text-base" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.name}
          confirmText="Je supprime la référence"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function InlineForm({
  form, onChange, onSave, onCancel, title
}: {
  form: { name: string; description: string; url: string };
  onChange: (f: { name: string; description: string; url: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}) {
  const inp = "w-full px-3 py-2 text-sm rounded-lg border border-[#1b2a47]/15 text-[#1b2a47] placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition";
  return (
    <div className="bg-[#f9f5ec] rounded-xl p-5 border border-[#ae894a]/20 mb-3">
      <p className="text-xs font-semibold text-[#1b2a47]/60 uppercase tracking-wide mb-3">{title}</p>
      <div className="space-y-2.5">
        <input required placeholder="Nom de la référence *" value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} className={inp} />
        <input placeholder="Description (optionnel)" value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} className={inp} />
        <input type="url" placeholder="URL (optionnel)" value={form.url} onChange={e => onChange({ ...form, url: e.target.value })} className={inp} />
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={onSave} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#ae894a" }}>
          <TiTick /> Enregistrer
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] transition">
          <TiCancel /> Annuler
        </button>
      </div>
    </div>
  );
}
