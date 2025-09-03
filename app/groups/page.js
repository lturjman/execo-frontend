import Image from "next/image";
import Link from "next/link";
import { UserIcon, Bars3Icon } from "@heroicons/react/24/solid";
import List from "@/components/groups/List";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div
      className="min-h-screen items-center p-4 space-y-6 bg-zinc-50 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/images/bg-5.jpg')`,
      }}
    >
      {/* Bouton flottant en haut à droite */}
      <Button
        href="/profile"
        rounded="true"
        className="fixed top-4 right-4 z-50  p-2 shadow-lg lg:hidden transition"
      >
        <UserIcon className="h-6 w-6" />
      </Button>

      {/* Bouton retour en desktop */}
      <Button
        href="/profile"
        className="hidden lg:flex fixed top-4 right-4 z-40 p-2 shadow-lg lg: w-[20vw] space-x-2 transition"
      >
        <UserIcon className="h-5 w-5" />
        <div>Espace utilisateur</div>
      </Button>

      {/* Logo Execo */}
      <div className="my-4">
        <Image
          src="/images/LOGO02.png"
          alt="Logo Execo"
          className="mx-auto"
          width={100}
          height={100}
        />
      </div>

      <List />
    </div>
  );
}
