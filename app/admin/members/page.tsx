"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TiPlus, TiEdit, TiTrash, TiTick, TiCancel, TiCamera } from "react-icons/ti";
import Tooltip from "../_components/Tooltip";
import DeleteModal from "../_components/DeleteModal";

interface Member { id: string; name: string; role: string; bio?: string | null; photo?: string | null; linkedin?: string | null; }

const emptyMember = { name: "", role: "", bio: "", photo: "", linkedin: "" };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyMember);
  const [showNew, setShowNew]           = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch_ = useCallback(async () => {
    const res = await fetch("/api/admin/members");
    setMembers(await res.json());
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) { alert("La photo doit faire moins de 300 Ko."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "img/equipe");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm(f => ({ ...f, photo: data.url }));
  }

  async function save() {
    const payload = { ...form, photo: form.photo || null, bio: form.bio || null, linkedin: form.linkedin || null };
    if (editId) {
      await fetch(`/api/admin/members/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setEditId(null);
    } else {
      await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setShowNew(false);
    }
    setForm(emptyMember);
    fetch_();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/members/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetch_();
  }

  function startEdit(m: Member) {
    setEditId(m.id);
    setForm({ name: m.name, role: m.role, bio: m.bio ?? "", photo: m.photo ?? "", linkedin: m.linkedin ?? "" });
    setShowNew(false);
  }

  const inp = "w-full px-3 py-2 text-sm rounded-lg border border-[#1b2a47]/15 text-[#1b2a47] placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-2 focus:ring-[#ae894a]/40 transition";

  function MemberForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    return (
      <div className="bg-[#f9f5ec] rounded-xl p-5 border border-[#ae894a]/20 mb-3">
        <div className="space-y-2.5">
          {/* Photo */}
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={uploadPhoto} className="hidden" />
          <div className="flex items-center gap-3">
            {form.photo
              ? <Image src={form.photo} alt="" width={56} height={56} className="rounded-full object-cover border border-[#1b2a47]/15" style={{ width: 56, height: 56 }} />
              : <div className="w-14 h-14 rounded-full bg-[#1b2a47]/8 flex items-center justify-center text-[#1b2a47]/30"><TiCamera className="text-xl" /></div>
            }
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1b2a47]/15 text-[#1b2a47]/60 hover:border-[#ae894a] hover:text-[#ae894a] transition disabled:opacity-50">
              {uploading ? "Chargement…" : "Choisir une photo"}
            </button>
          </div>
          <input required placeholder="Prénom Nom *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inp} />
          <input required placeholder="Fonction / Rôle *" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inp} />
          <textarea placeholder="Biographie (optionnel)" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className={inp} />
          <input type="url" placeholder="URL LinkedIn (optionnel)" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} className={inp} />
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

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Membres</h1>
          <p className="text-sm text-[#1b2a47]/50 mt-0.5">{members.length} membre{members.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditId(null); setForm(emptyMember); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#ae894a" }}>
          <TiPlus className="text-base" />
          Ajouter
        </button>
      </div>

      {showNew && <MemberForm onSave={save} onCancel={() => { setShowNew(false); setForm(emptyMember); }} />}

      <div className="space-y-3">
        {members.map((m) => editId === m.id ? (
          <MemberForm key={m.id} onSave={save} onCancel={() => { setEditId(null); setForm(emptyMember); }} />
        ) : (
          <div key={m.id} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8">
            {m.photo
              ? <Image src={m.photo} alt={m.name} width={44} height={44} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
              : <div className="w-11 h-11 rounded-full bg-[#1b2a47]/8 shrink-0 flex items-center justify-center text-[#1b2a47]/30 text-sm font-semibold">{m.name[0]}</div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1b2a47]">{m.name}</p>
              <p className="text-xs text-[#1b2a47]/50">{m.role}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Tooltip label="Modifier">
                <button onClick={() => startEdit(m)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition">
                  <TiEdit className="text-base" />
                </button>
              </Tooltip>
              <Tooltip label="Supprimer">
                <button onClick={() => setDeleteTarget(m)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1b2a47]/40 hover:text-red-500 hover:bg-red-50 transition">
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
          confirmText="Je supprime le membre"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
