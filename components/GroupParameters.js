"use client";

import Button from "@/components/Button";

export default function GroupParameters({}) {
  return (
    <div>
      <div className="relative">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
          <h2 className="font-bold mb-4">Paramètres du groupe</h2>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-100"
            placeholder="Nom du groupe"
          />
          <Button onClick={() => alert("Groupe créé !")} className="my-4">
            Valider les modifications
          </Button>

          <hr className="my-2"></hr>
          <label className="block mb-2 font-bold"> Supprimer le groupe :</label>
          <div>
            Attention, le groupe sera supprimé définitivement et toutes les
            dépenses seront perdues.
          </div>
          <Button
            onClick={() => alert("Le groupe a été surrpimé !")}
            className="my-4 bg-red-400"
          >
            Supprimer le groupe
          </Button>
        </div>
      </div>
    </div>
  );
}
