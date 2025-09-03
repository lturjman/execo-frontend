import { twMerge } from "tailwind-merge";
import Link from "next/link";

export default function Button({
  children,
  onClick,
  rounded,
  className,
  href,
}) {
  function getClassName() {
    return twMerge(
      "top-4 left-4 rounded-full size-8 flex items-center justify-center bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 cursor-pointer",
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
    <button onClick={onClick} className={getClassName()}>
      {children}
    </button>
  );
}
