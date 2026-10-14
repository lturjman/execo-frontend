export const EXPENSE_CATEGORIES = [
  "🛏️ Logement",
  "🎤 Divertissement",
  "🛒 Courses",
  "🦷 Santé",
  "🧯 Assurance",
  "🏠 Loyer & charges",
  "🍔 Restaurant & bar",
  "🛍️ Shopping",
  "🚕 Transport",
  "⚙️ Autre",
];

export const CUSTOM_CATEGORY_VALUE = "__custom__";
export const DEFAULT_CUSTOM_EMOJI = "🏷️";

const EMOJI_PREFIX = /^(\p{Extended_Pictographic}[^\p{L}\p{N}]*)\s*(.*)$/u;

export function isPresetCategory(category) {
  return EXPENSE_CATEGORIES.includes(category);
}

export function parseCustomCategory(category) {
  if (!category || isPresetCategory(category)) {
    return { emoji: DEFAULT_CUSTOM_EMOJI, label: "" };
  }

  const match = category.match(EMOJI_PREFIX);
  if (match) {
    return {
      emoji: match[1].trim() || DEFAULT_CUSTOM_EMOJI,
      label: match[2].trim(),
    };
  }

  return { emoji: DEFAULT_CUSTOM_EMOJI, label: category.trim() };
}

export function buildCustomCategory(emoji, label) {
  const trimmedLabel = (label || "").trim();
  if (!trimmedLabel) return "";

  return `${emoji || DEFAULT_CUSTOM_EMOJI} ${trimmedLabel}`;
}
