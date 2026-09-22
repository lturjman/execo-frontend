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

export function eventDayKeys(dateValue, endDateValue) {
  const startKey = toDayKey(dateValue);
  const endKey = endDateValue ? toDayKey(endDateValue) : null;
  const start = parseDayKey(startKey);
  const end = endKey && endKey > startKey ? parseDayKey(endKey) : start;
  if (!start.year || !start.month || !start.day) return [];

  const keys = [];
  const cursor = new Date(start.year, start.month - 1, start.day);
  const last = new Date(end.year, end.month - 1, end.day);

  while (cursor <= last) {
    keys.push(
      `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`,
    );
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export function isYearlyEvent(event) {
  return event?.type === "anniversaire";
}

export function yearlyEventKeys(dateValue, endDateValue, year) {
  const start = parseDayKey(toDayKey(dateValue));
  const end = endDateValue ? parseDayKey(toDayKey(endDateValue)) : start;
  if (!start.month || !start.day) return [];

  const cursor = new Date(year, start.month - 1, start.day);
  if (
    cursor.getFullYear() !== year ||
    cursor.getMonth() !== start.month - 1 ||
    cursor.getDate() !== start.day
  ) {
    return [];
  }

  const last = new Date(year, end.month - 1, end.day);
  if (last < cursor) return [];

  const keys = [];
  const day = new Date(cursor);
  while (day <= last) {
    keys.push(
      `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`,
    );
    day.setDate(day.getDate() + 1);
  }
  return keys;
}

export function eventDayKeysInYear(event, year) {
  if (isYearlyEvent(event)) {
    return yearlyEventKeys(event.date, event.endDate, year);
  }
  return eventDayKeys(event.date, event.endDate);
}

export function eventCoversDayKey(event, dayKey) {
  if (isYearlyEvent(event)) {
    const { year } = parseDayKey(dayKey);
    if (!year) return false;
    return yearlyEventKeys(event.date, event.endDate, year).includes(dayKey);
  }
  return eventDayKeys(event.date, event.endDate).includes(dayKey);
}