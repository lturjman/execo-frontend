import Image from "next/image";

export default function GroupCard({ group }) {
  return (
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

      {/* Texte */}
      <div className="p-4">
        <h2 className="text-lg font-bold">{group.name}</h2>
      </div>

      {/* Bouton */}
      <div className="px-4 pb-4">
        <button className="w-full bg-purple-400 text-white font-semibold py-2 rounded-full">
          voir le groupe
        </button>
      </div>
    </div>
  );
}
