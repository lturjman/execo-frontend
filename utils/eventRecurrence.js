export const RECURRENCE_OPTIONS = [
  { value: "day", label: "Tous les jours" },
  { value: "week", label: "Toutes les semaines" },
  { value: "two-weeks", label: "Toutes les deux semaines" },
  { value: "month", label: "Tous les mois" },
  { value: "three-months", label: "Tous les 3 mois" },
  { value: "six-months", label: "Tous les 6 mois" },
  { value: "year", label: "Tous les ans" },
];

const RECURRENCE_FREQUENCIES = new Set(
  RECURRENCE_OPTIONS.map(({ value }) => value),
);

export function isRecurrenceFrequency(value) {
  return RECURRENCE_FREQUENCIES.has(value);
}

export function getEventRecurrenceFrequency(event) {
  return isRecurrenceFrequency(event?.recurrenceFrequency)
    ? event.recurrenceFrequency
    : null;
}

export function getRecurrenceLabel(value) {
  return RECURRENCE_OPTIONS.find((option) => option.value === value)?.label || "";
}
