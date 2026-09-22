export default function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 dark:text-red-400">{message}</p>;
}