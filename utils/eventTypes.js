export const EVENT_TYPES = [
  {
    id: "événement",
    label: "Événement",
    dot: "bg-purple-500",
    chip: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    card: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
  },
  {
    id: "rendez-vous",
    label: "Rendez-vous",
    dot: "bg-sky-500",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
    card: "bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-700",
  },
  {
    id: "échéance",
    label: "Échéance",
    dot: "bg-rose-500",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
    card: "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-700",
  },
  {
    id: "anniversaire",
    label: "Anniversaire",
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    card: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700",
  },
  {
    id: "absence",
    label: "Absence",
    dot: "bg-zinc-500",
    chip: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
    card: "bg-zinc-50 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600",
  },
  {
    id: "autre",
    label: "Autre",
    dot: "bg-teal-500",
    chip: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
    card: "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-700",
  },
];

export function getEventType(typeId) {
  return (
    EVENT_TYPES.find((type) => type.id === typeId) || EVENT_TYPES[0]
  );
}