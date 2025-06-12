"use client";

import Button from "@/components/Button";
import { useState } from "react";

export default function CreateGroup({ onGroupCreated }) {
  const [group, setGroup] = useState({
    name: "",
  });

  const handleCreateGroup = async () => {
    const response = await fetch("http://localhost:3000/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création du groupe");
    }

    const data = await response.json();
    console.log("Réponse du serveur :", data);

    if (onGroupCreated) {
      onGroupCreated();
    }
  };

  return (
    <div className="relative">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
        <h2 className="text-xl font-bold mb-4">Nouveau Groupe</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Nom du groupe"
          value={group.name}
          onChange={(e) => setGroup({ ...group, name: e.target.value })}
        />
        <Button onClick={handleCreateGroup} className="my-4">
          Créer le groupe
        </Button>
      </div>
    </div>
  );
}
