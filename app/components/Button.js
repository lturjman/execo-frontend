export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full mx-6 bg-purple-400 text-white font-semibold py-2 rounded-full"
    >
      {text}
    </button>
  );
}
