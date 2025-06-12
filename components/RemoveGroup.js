"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function RemoveGroup({ group, onClose }) {
  const router = useRouter();

  const handleRemoveGroup = async () => {
    const response = await fetch(`http://localhost:3000/groups/${group._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du groupe");
    }
    router.push("/groups");
  };

  return (
    <div className="space-y-4">
      <h2 className="block font-bold text-xl">
        Êtes vous sûr de vouloir supprimer le groupe ?
      </h2>
      <div>
        Pour rappel, cette action est irréversible et toutes les dépenses seront
        perdues
      </div>
      <div className="flex gap-4 ">
        <Button onClick={handleRemoveGroup} className=" bg-red-400">
          Oui, Supprimer
        </Button>

        <Button className="bg-gray-400" onClick={onClose}>
          Non, Annuler
        </Button>
      </div>
    </div>
  );
}
