"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TiPlus, TiEdit, TiTrash, TiEye, TiEyeOutline } from "react-icons/ti";
import DeleteModal from "../_components/DeleteModal";
import Tooltip from "../_components/Tooltip";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  published: boolean;
  tags: string;
}

export default function BlogAdminPage() {
  const [articles, setArticles]         = useState<Article[]>([]);
  const [loading, setLoading]           = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const fetchArticles = useCallback(async () => {
    const res  = await fetch("/api/admin/blog");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  async function togglePublished(id: string, current: boolean) {
    await fetch(`/api/admin/blog/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ published: !current }),
    });
    fetchArticles();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetchArticles();
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1b2a47] tracking-tight">Articles</h1>
          <p className="text-sm text-[#1b2a47]/50 mt-0.5">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "#ae894a" }}
        >
          <TiPlus className="text-base" />
          Nouvel article
        </Link>
      </div>

      {loading ? (
        <div className="text-[#1b2a47]/40 text-sm">Chargement…</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-[#1b2a47]/40">
          <p className="text-base mb-3">Aucun article pour le moment.</p>
          <Link href="/admin/blog/new" className="text-[#ae894a] font-medium hover:underline text-sm">
            Créer le premier article →
          </Link>
        </div>
      ) : (
        <>
          {/* Légende */}
          <div className="flex items-center justify-end gap-4 mb-3 px-1">
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiEye className="text-base" /> Publié
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiEyeOutline className="text-base" /> Brouillon
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiEdit className="text-base" /> Modifier
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#1b2a47]/40">
              <TiTrash className="text-base" /> Supprimer
            </span>
          </div>

          <div className="space-y-3">
            {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#1b2a47]/8 hover:border-[#1b2a47]/15 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                    style={{ background: "rgba(174,137,74,0.12)", color: "#ae894a" }}
                  >
                    {article.category}
                  </span>
                  {!article.published && (
                    <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#1b2a47]/8 text-[#1b2a47]/40">
                      Brouillon
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[#1b2a47] truncate">{article.title}</h3>
                <p className="text-xs text-[#1b2a47]/40 mt-0.5">{article.date}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Tooltip label={article.published ? "Publié" : "Non visible"}>
                  <button
                    onClick={() => togglePublished(article.id, article.published)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
                  >
                    {article.published
                      ? <TiEye className="text-xl" />
                      : <TiEyeOutline className="text-xl" />}
                  </button>
                </Tooltip>
                <Tooltip label="Modifier">
                  <Link
                    href={`/admin/blog/${article.id}`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#1b2a47]/40 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
                  >
                    <TiEdit className="text-xl" />
                  </Link>
                </Tooltip>
                <Tooltip label="Supprimer">
                  <button
                    onClick={() => setDeleteTarget(article)}
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

      {/* Modale de suppression */}
      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.title}
          confirmText="Je supprime l'article"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
