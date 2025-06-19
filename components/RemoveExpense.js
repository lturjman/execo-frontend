"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function RemoveExpense({ onClose, expense }) {
  const router = useRouter();

  const handleRemoveExpense = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${expense.group}/expenses/${expense._id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la dépense");
    }
    router.push(`/groups/${expense.group}`);
  };

  return (
    <div>
      <h2 className="block mb-2 font-bold text-xl text-center">
        Êtes vous sûr de vouloir supprimer la dépense ?
      </h2>

      <div>
        Pour rappel, cette action est irréversible et les dépenses en cours
        seront reréparties entre les autres membres du groupe
      </div>
      <div>
        <Button onClick={handleRemoveExpense} className="my-4 bg-red-400">
          Oui, Supprimer
        </Button>

        <Button className="bg-gray-400" onClick={onClose}>
          Non, Annuler
        </Button>
      </div>
    </div>
  );
}
