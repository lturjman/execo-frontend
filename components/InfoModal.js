"use client";

import { useEffect, useState } from "react";

export default function InfoModal({
  title,
  children,
  label,
  variant = "link",
}) {
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

  const triggerClassName =
    variant === "icon"
      ? "inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-400 hover:bg-purple-400 text-white text-xs font-bold cursor-pointer ml-1 align-middle"
      : "underline cursor-pointer";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {label}
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
              <div className="text-lg font-bold">{title}</div>
              <button
                type="button"
                onClick={closeInfo}
                className="text-zinc-400 hover:text-zinc-600 text-xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="text-sm">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
