"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function RemoveMember({ onClose, groupId, member }) {
  const router = useRouter();

  const handleRemoveMember = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${groupId}/members/${member._id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du membre");
    }
    router.push(`/groups/${groupId}`);
  };

  return (
    <div>
      <h2 className="block mb-2 font-bold text-xl text-center">
        Êtes vous sûr de vouloir supprimer le membre ?
      </h2>

      <div>
        Pour rappel, cette action est irréversible et les dépenses en cours
        seront reréparties entre les autres membres du groupe
      </div>
      <div>
        <Button onClick={handleRemoveMember} className="my-4 bg-red-400">
          Oui, Supprimer
        </Button>

        <Button className="bg-gray-400" onClick={onClose}>
          Non, Annuler
        </Button>
      </div>
    </div>
  );
}
