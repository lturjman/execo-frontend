import { parseDayKey, toDayKey } from "@/utils/eventDates";
import {
  getEventRecurrenceFrequency,
  getRecurrenceLabel,
} from "@/utils/eventRecurrence";

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatLongDate(key) {
  const { year, month, day } = parseDayKey(key);
  if (!year) return "";
  return new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(event) {
  if (event.startTime && event.endTime) {
    return `${event.startTime} – ${event.endTime}`;
  }
  return event.startTime || event.endTime || "";
}

export function formatRecurrence(event) {
  const frequency = getEventRecurrenceFrequency(event);
  if (!frequency) return "";
  const label = getRecurrenceLabel(frequency);
  if (!event.recurrenceEndDate) return label;

  const { year, month, day } = parseDayKey(toDayKey(event.recurrenceEndDate));
  if (!year || !month || !day) return label;
  const endDate = new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${label} jusqu’au ${endDate}`;
}

export function formatEventRange(event) {
  if (!event.endDate) return "";
  const startKey = toDayKey(event.date);
  const endKey = toDayKey(event.endDate);
  if (endKey <= startKey) return "";
  const { year, month, day } = parseDayKey(startKey);
  const end = parseDayKey(endKey);
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(end.year, end.month - 1, end.day);
  return `${startDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  })} – ${endDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}