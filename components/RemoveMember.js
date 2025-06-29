"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { deleteMember } from "../lib/store/slices/members";

export default function RemoveMember({ onClose, groupId, member }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const handleDeleteMember = async () => {
    const action = await dispatch(deleteMember({ groupId, member }));
    if (deleteMember.fulfilled.match(action)) {
      onClose();
    } else {
      console.error("Échec suppression :", action.error);
      alert("Erreur lors de la suppression");
    }
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
        <Button onClick={handleDeleteMember} className="my-4 bg-red-400">
          Oui, Supprimer
        </Button>

        <Button className="bg-gray-400" onClick={onClose}>
          Non, Annuler
        </Button>
      </div>
    </div>
  );
}
