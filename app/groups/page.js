import Image from "next/image";
import CreateGroup from "@/components/CreateGroup";

export default function Home() {
  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Logo Execo */}
      <div className="mb-4">
        <Image
          src="/images/execoLogo01.png"
          alt="Logo Execo"
          width={100}
          height={50}
        />
      </div>

      {/* Message de bienvenue */}
      <h1 className="text-xl font-bold mb-6">Hello, User !</h1>

      {/* Grille des cartes */}
      <div className="grid grid-cols-2 gap-4 ">
        {/* Carte 1 */}
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center">
          <div>
            <Image
              src="/images/groupImg.png"
              alt="Image de groupe"
              width={200}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Carte 1 - Texte */}
          <div className="p-4">
            <h2 className="text-lg font-bold">Nom du groupe</h2>
          </div>

          {/* Carte 1 - Bouton */}
          <div className="px-4 pb-4">
            <button className="w-full bg-purple-400 text-white font-semibold py-2 rounded-full">
              voir le groupe
            </button>
          </div>
        </div>

        {/* Carte 2 */}
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center">
          <div>
            <Image
              src="/images/groupImg.png"
              alt="Image de groupe"
              width={200}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Carte 2 - Texte */}
          <div className="p-4">
            <h2 className="text-lg font-bold">Nom du groupe</h2>
          </div>

          {/* Carte 2 - Bouton */}
          <div className="px-4 pb-4">
            <button className="w-full bg-purple-400 text-white font-semibold py-2 rounded-full">
              voir le groupe
            </button>
          </div>
        </div>
      </div>

      <CreateGroup></CreateGroup>

      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6">
        <button className="w-16 h-16 rounded-full bg-purple-400 text-white flex items-center justify-center text-2xl">
          +
        </button>
      </div>
    </div>
  );
}
