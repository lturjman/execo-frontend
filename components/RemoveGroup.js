"use client";

import Button from "@/components/Button";

export default function RemoveGroup({ groupId }) {
  const handleRemoveGroup = async () => {
    const response = await fetch(`http://localhost:3000/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du groupe");
    }

    const data = await response.json();
    alert("Groupe supprimé avec succès !");
    console.log("Réponse du serveur :", data);
  };

  return (
    <div>
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
        <label className="block mb-2 font-bold">
          {" "}
          Êtes vous sûr de vouloir supprimer le groupe ?
        </label>
        <div>
          Pour rappel, cette action est irréversible et toutes les dépenses
          seront perdues
        </div>
        <div>
          <Button onClick={handleRemoveGroup} className="my-4 bg-red-400">
            Oui, Supprimer
          </Button>

          <Button
            onClick={() => alert("Annulé !")}
            className="my-4 bg-gray-400"
          >
            Non, Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
