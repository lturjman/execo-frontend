import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import InfoModal from "@/components/InfoModal";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-zinc-50 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: "url('/images/bg-3.jpg')",
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
        <div className=" bg-white flex flex-col rounded-2xl shadow-lg overflow-hidden text-center p-5 dark:bg-zinc-800">
          <div className="text-xl font-bold">Bienvenur sur Execo ! 👋 </div>
          <br />
          <div className=" ">
            Et si on <strong>partageait autrement</strong> ? Faire une moyenne
            des dépenses quand la vie n’est pas à parts égales ?{" "}
            <strong>Avec Execo chacun contribue selon ses moyens réels.</strong>
          </div>{" "}
          <br />
          <div className="">
            Coliving, couples, amis, colocs, dépenses de vacances, familles
            recomposées, familles aidantes : enfin un partage qui respecte votre
            réalité. <strong>Pas de 50/50 par défaut</strong> : chacun contribue
            selon ses possibilités, en fonction de son <InfoModal />. Vos
            revenus et charges servent uniquement à calculer cette répartition
            et restent au sein de vos groupes.{" "}
            <strong>
              Une expérimentation pour imaginer ensemble une autre façon de
              vivre, partager et contribuer 💜
            </strong>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/auth/login">
            <Button className="p-5 text-xl bg-zinc-800 hover:bg-zinc-700 dark:bg-white hover:dark:bg-zinc-100 dark:text-zinc-800">
              Se connecter
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="p-5 text-xl text-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white">
              Créer un compte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
