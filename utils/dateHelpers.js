export function todayInputDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function toInputDate(value) {
  if (!value) return todayInputDate();
  return new Date(value).toISOString().slice(0, 10);
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR");
}
