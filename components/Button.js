import { twMerge } from "tailwind-merge";

export default function Button({ children, onClick, rounded, className }) {
  function getClassName() {
    return twMerge(
      "top-4 left-4 rounded-full size-8 flex items-center justify-center bg-purple-400 text-white font-semibold py-2",
      rounded ? "size-8" : "w-full",
      className
    );
  }

  return (
    <button onClick={onClick} className={getClassName()}>
      {children}
    </button>
  );
}
