"use client";

import { useEffect, useState } from "react";

export default function InfoModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open && !closing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, closing]);

  const closeInfo = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="underline cursor-pointer"
      >
        reste à vivre
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${
            closing
              ? "animate-[fadeOut_0.2s_ease-in]"
              : "animate-[fadeIn_0.2s_ease-out]"
          }`}
          onClick={closeInfo}
        >
          <div
            className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 max-w-sm text-left ${
              closing
                ? "animate-[scaleOut_0.2s_ease-in]"
                : "animate-[scaleIn_0.25s_ease-out]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-bold">Votre reste à vivre 💛</div>
              <button
                type="button"
                onClick={closeInfo}
                className="text-zinc-400 hover:text-zinc-600 text-xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="text-sm">
              C’est ce qu’il vous reste chaque mois après avoir déduit vos
              charges fixes incompressibles de vos revenus. Il permet de mieux
              refléter les possibilités de chacun pour partager les dépenses
              communes.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
