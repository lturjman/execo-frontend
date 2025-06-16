import Image from "next/image";
import Button from "./Button";

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
        <Button href={`/groups/${group._id}`}>voir le groupe</Button>
      </div>
    </div>
  );
}
