import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-gray-50 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url('/images/bg-3.jpg')`,
      }}
    >
      <div className="mt-10">
        <Image
          src="/images/LOGO05.png"
          alt="Logo Execo"
          width={300}
          height={100}
        />
      </div>

      <div className="w-full max-w-[70vh] space-y-4">
        <div className=" bg-white flex flex-col rounded-2xl shadow-lg overflow-hidden text-center p-5">
          <div className="text-xl font-bold">Bienvenue !</div>
          <div className=" ">
            Faire une moyenne des dépenses quand la vie n’est pas à parts égales
            ? Avec Execo chacun contribue selon ses moyens réels.
          </div>
          <div className="">
            Coliving, Couples, amis, colocs, dépenses de vacances, familles
            recomposées, Familles aidantes : enfin un partage qui respecte votre
            réalité.
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/auth/login">
            <Button className="p-5 text-xl bg-gray-800">Se connecter</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="p-5 text-xl  bg-white text-gray-800">
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
