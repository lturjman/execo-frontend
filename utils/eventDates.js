import { getEventRecurrenceFrequency } from "@/utils/eventRecurrence";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function pad(value) {
  return String(value).padStart(2, "0");
}

export function toDayKey(dateValue) {
  return String(dateValue).slice(0, 10);
}

export function parseDayKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return { year, month, day };
}

function dayKeyToTimestamp(key) {
  const { year, month, day } = parseDayKey(key);
  if (!year || !month || !day) return null;
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return timestamp;
}

function timestampToDayKey(timestamp) {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;
}

function addDaysToKey(key, amount) {
  return timestampToDayKey(dayKeyToTimestamp(key) + amount * DAY_IN_MS);
}

function daysBetween(startKey, endKey) {
  return Math.round(
    (dayKeyToTimestamp(endKey) - dayKeyToTimestamp(startKey)) / DAY_IN_MS,
  );
}

function getEventDurationDays(event) {
  if (!event.endDate) return 0;
  const startKey = toDayKey(event.date);
  const endKey = toDayKey(event.endDate);
  if (dayKeyToTimestamp(startKey) === null || dayKeyToTimestamp(endKey) === null) {
    return 0;
  }
  return Math.max(0, daysBetween(startKey, endKey));
}

function getMonthDateKey(anchor, monthIndex) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(anchor.day, lastDay);
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function getMonthIndex(key) {
  const { year, month } = parseDayKey(key);
  return year * 12 + month - 1;
}

function getFixedDayStartKeys(event, rangeStart, rangeEnd) {
  const frequencySteps = {
    day: 1,
    week: 7,
    "two-weeks": 14,
  };
  const step = frequencySteps[event.recurrenceFrequency];
  const startKey = toDayKey(event.date);
  const firstIndex = Math.max(
    0,
    Math.ceil(daysBetween(startKey, rangeStart) / step),
  );
  const keys = [];

  for (let index = firstIndex; ; index += 1) {
    const occurrence = addDaysToKey(startKey, index * step);
    if (occurrence > rangeEnd) break;
    keys.push(occurrence);
  }
  return keys;
}

function getYearlyStartKeys(event, rangeStart, rangeEnd, durationDays) {
  const start = parseDayKey(toDayKey(event.date));
  const earliestYear = Math.max(
    start.year,
    parseDayKey(rangeEnd).year - Math.ceil(durationDays / 365) - 1,
  );
  const keys = [];

  for (let year = earliestYear; ; year += 1) {
    const lastDay = new Date(Date.UTC(year, start.month, 0)).getUTCDate();
    const occurrence = `${year}-${pad(start.month)}-${pad(
      Math.min(start.day, lastDay),
    )}`;
    if (occurrence > rangeEnd) break;
    if (occurrence >= rangeStart) keys.push(occurrence);
  }
  return keys;
}

function getRecurringStartKeys(event, year, durationDays) {
  const startKey = toDayKey(event.date);
  const endKey = event.recurrenceEndDate
    ? toDayKey(event.recurrenceEndDate)
    : null;
  if (!dayKeyToTimestamp(startKey)) return [];
  if (endKey && (!dayKeyToTimestamp(endKey) || endKey < startKey)) return [];

  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const rangeStart = addDaysToKey(yearStart, -durationDays);
  const rangeEnd = endKey && endKey < yearEnd ? endKey : yearEnd;
  if (rangeStart > rangeEnd || startKey > rangeEnd) return [];

  if (["day", "week", "two-weeks"].includes(event.recurrenceFrequency)) {
    return getFixedDayStartKeys(event, rangeStart, rangeEnd);
  }
  if (["month", "three-months", "six-months"].includes(event.recurrenceFrequency)) {
    const monthStep = {
      month: 1,
      "three-months": 3,
      "six-months": 6,
    }[event.recurrenceFrequency];
    const firstIndex = Math.max(
      0,
      Math.floor(
        (getMonthIndex(rangeStart) - getMonthIndex(startKey)) / monthStep,
      ) * monthStep,
    );
    return getMonthlyStartKeys(
      event,
      rangeStart,
      rangeEnd,
      durationDays,
      monthStep,
      firstIndex,
    );
  }
  return getYearlyStartKeys(event, rangeStart, rangeEnd, durationDays);
}

function getMonthlyStartKeys(
  event,
  rangeStart,
  rangeEnd,
  durationDays,
  monthStep,
  firstIndex,
) {
  const anchor = parseDayKey(toDayKey(event.date));
  const earliestIndex = Math.max(
    getMonthIndex(toDayKey(event.date)),
    firstIndex - Math.ceil(durationDays / (30 * monthStep)),
  );
  const keys = [];

  for (let index = earliestIndex; ; index += monthStep) {
    const occurrence = getMonthDateKey(anchor, index);
    if (occurrence > rangeEnd) break;
    if (occurrence >= rangeStart) keys.push(occurrence);
  }
  return keys;
}

export function eventDayKeys(dateValue, endDateValue) {
  const startKey = toDayKey(dateValue);
  const endKey = endDateValue ? toDayKey(endDateValue) : null;
  const startTimestamp = dayKeyToTimestamp(startKey);
  if (startTimestamp === null) return [];
  const endTimestamp = endDateValue
    ? dayKeyToTimestamp(endKey)
    : startTimestamp;
  if (endTimestamp === null || endTimestamp < startTimestamp) {
    return eventDayKeys(dateValue);
  }

  const keys = [];
  for (let timestamp = startTimestamp; timestamp <= endTimestamp; timestamp += DAY_IN_MS) {
    keys.push(timestampToDayKey(timestamp));
  }
  return keys;
}

export function eventDayKeysInYear(event, year) {
  const frequency = getEventRecurrenceFrequency(event);
  if (!frequency) {
    return eventDayKeys(event.date, event.endDate).filter((key) =>
      key.startsWith(`${year}-`),
    );
  }

  const durationDays = getEventDurationDays(event);
  const starts = getRecurringStartKeys(
    { ...event, recurrenceFrequency: frequency },
    year,
    durationDays,
  );
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const keys = new Set();

  for (const start of starts) {
    const occurrenceEnd = addDaysToKey(start, durationDays);
    const visibleStart = start > yearStart ? start : yearStart;
    const visibleEnd = occurrenceEnd < yearEnd ? occurrenceEnd : yearEnd;
    if (visibleStart > visibleEnd) continue;
    for (const key of eventDayKeys(visibleStart, visibleEnd)) {
      keys.add(key);
    }
  }
  return [...keys].sort();
}

export function eventCoversDayKey(event, dayKey) {
  const { year } = parseDayKey(dayKey);
  if (!year) return false;
  return eventDayKeysInYear(event, year).includes(dayKey);
}
