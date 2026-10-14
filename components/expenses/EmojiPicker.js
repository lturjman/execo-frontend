"use client";

import { useEffect, useRef, useState } from "react";

const EMOJI_CHOICES = [
  "🏠",
  "🛏️",
  "🛒",
  "🍔",
  "🍕",
  "☕",
  "🍺",
  "🍷",
  "🚕",
  "🚗",
  "🚌",
  "🚲",
  "✈️",
  "🚆",
  "🅿️",
  "💊",
  "🦷",
  "🩺",
  "🏋️",
  "⚽",
  "🎾",
  "🧘",
  "💅",
  "🛍️",
  "👕",
  "👟",
  "💄",
  "🕶️",
  "💍",
  "🎤",
  "🎬",
  "🎮",
  "🎵",
  "🎧",
  "🎉",
  "🎁",
  "📷",
  "📚",
  "🎓",
  "💻",
  "📱",
  "🖨️",
  "📚",
  "✏️",
  "👶",
  "🐾",
  "🐶",
  "🐱",
  "🌱",
  "🌸",
  "🌿",
  "🧸",
  "🪴",
  "🐠",
  "💡",
  "📶",
  "💳",
  "💰",
  "📈",
  "🧹",
  "🪑",
  "🖼️",
  "🧼",
  "🪩",
  "⚙️",
  "✨",
  "🏷️",
  "📦",
  "🔧",
  "🌶️",
  "💸",
  "❤️",
];

export default function EmojiPicker({ value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Choisir un émoji"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex h-10 w-12 items-center justify-center rounded-md bg-zinc-100 text-xl hover:bg-zinc-200 dark:bg-zinc-600 dark:hover:bg-zinc-500"
      >
        {value || "🏷️"}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 grid max-h-56 w-64 grid-cols-8 gap-1 overflow-y-auto rounded-md border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-600 dark:bg-zinc-700">
          {EMOJI_CHOICES.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              type="button"
              onClick={() => {
                onSelect(emoji);
                setIsOpen(false);
              }}
              className="flex size-7 items-center justify-center rounded text-lg hover:bg-zinc-100 dark:hover:bg-zinc-600"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
