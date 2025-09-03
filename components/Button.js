import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default function Button({
  children,
  onClick,
  rounded,
  className,
  href,
  disabled,
}) {
  function getClassName() {
    return twMerge(
      "top-4 left-4 rounded-full size-8 flex items-center justify-center bg-purple-400 hover:bg-purple-500 active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-semibold py-2 cursor-pointer",
      rounded ? "size-8" : "w-full",
      className
    );
  }

  if (href) {
    return (
      <Link href={href} className={getClassName()}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={getClassName()} disabled={disabled}>
      {disabled && <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
}
