"use client";

import Button from "@/components/Button";

export default function CreateGroup({}) {
  return (
    <div className="relative">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
        <h2 className="text-xl font-bold mb-4">Nouveau Groupe</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Nom du groupe"
        />
        <Button onClick={() => alert("Groupe créé !")} className="my-4">
          Créer le groupe
        </Button>
      </div>
    </div>
  );
}
