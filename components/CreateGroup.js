"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useState } from "react";

export default function CreateGroup({}) {
  const router = useRouter();
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

    const responseBody = await response.json();
    const createdGroup = responseBody.data;
    router.push(`/groups/${createdGroup._id}`);
  };

  return (
    <div>
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
  );
}
