"use client";

import { useState } from "react";
import { TiWarning } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

interface DeleteModalProps {
  /** Nom affiché de l'élément à supprimer */
  itemName: string;
  /** Texte exact que l'utilisateur doit saisir pour valider (étape 1) */
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  itemName,
  confirmText = "Je supprime",
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  const [step, setStep]   = useState<1 | 2>(1);
  const [typed, setTyped] = useState("");

  const match = typed.trim().toLowerCase() === confirmText.toLowerCase();

  return (
    <div
      className="fixed inset-0 z-500 flex items-center justify-center p-4"
      style={{ background: "rgba(27,42,71,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-[#f9f5ec] rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 shrink-0">
              <TiWarning className="text-lg" />
            </span>
            <h2 className="text-sm font-semibold text-[#1b2a47]">
              {step === 1 ? "Confirmer la suppression" : "Êtes-vous sûr ?"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-[#1b2a47]/30 hover:text-[#1b2a47] transition ml-2 shrink-0"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {step === 1 ? (
          <>
            <p className="text-sm text-[#1b2a47]/60 mb-1 leading-relaxed">
              Vous allez supprimer <span className="font-semibold text-[#1b2a47]">&ldquo;{itemName}&rdquo;</span>.
            </p>
            <p className="text-sm text-[#1b2a47]/60 mb-4 leading-relaxed">
              Pour confirmer, tapez exactement :{" "}
              <span className="font-mono font-semibold text-[#1b2a47]">{confirmText}</span>
            </p>

            <input
              autoFocus
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && match) setStep(2); }}
              placeholder={confirmText}
              className="w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm text-[#1b2a47] placeholder:text-[#1b2a47]/25 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition mb-4"
              style={{ borderColor: match ? "#ef4444" : "rgba(27,42,71,0.15)" }}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                disabled={!match}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Continuer →
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
              >
                Annuler
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-[#1b2a47]/60 mb-6 leading-relaxed">
              Cette action est <span className="font-semibold text-red-500">irréversible</span>.
              La suppression sera définitive.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition"
              >
                Supprimer définitivement
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#1b2a47]/50 hover:text-[#1b2a47] hover:bg-[#1b2a47]/6 transition"
              >
                Annuler
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
