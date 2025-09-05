import Image from "next/image";
import Button from "../Button";

export default function GroupCard({ group }) {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-[1.02] duration-200 dark:bg-zinc-600">
      {/* Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <Image
          src={group.imageUrl || "/images/group1.jpg"}
          alt={`Image de groupe ${group.name}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-grow items-center justify-between p-4 gap-4 text-center">
        <h2 className="text-lg font-semibold truncate w-full">{group.name}</h2>

        <Button href={`/groups/${group._id}`} className="w-full">
          Voir le groupe
        </Button>
      </div>
    </div>
  );
}
