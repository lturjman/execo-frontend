import Image from "next/image";
import InfoModal from "@/components/InfoModal";
import LoginButton from "@/components/auth/LoginButton";
import RegisterButton from "@/components/auth/RegisterButton";

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
            selon ses possibilités, en fonction de son <InfoModal label="reste à vivre" title="Votre reste à vivre 💛">C'est ce qu'il vous reste chaque mois après avoir déduit vos charges fixes incompressibles de vos revenus. Il permet de mieux refléter les possibilités de chacun pour partager les dépenses communes.</InfoModal>. Vos
            revenus et charges servent uniquement à calculer cette répartition
            et restent au sein de vos groupes.{" "}
            <strong>
              Une expérimentation pour imaginer ensemble une autre façon de
              vivre, partager et contribuer 💜
            </strong>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <LoginButton />
          <RegisterButton />
        </div>
      </div>
    </div>
  );
}
