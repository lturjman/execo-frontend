"use client";

import RemoveGroup from "./RemoveGroup";
import { CloseButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

export default function GroupParameters({ onGroupUpdated, onClose, group }) {
  const [editableGroup, setEditableGroup] = useState({ ...group });
  let [displayRemoveGroup, setDisplayRemoveGroup] = useState(false);

  useEffect(() => {
    if (group) {
      setEditableGroup({ ...group });
    }
  }, [group]);

  const handleUpdateGroup = async () => {
    const response = await fetch(`http://localhost:3000/groups/${group._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group: editableGroup }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la modification du groupe");
    }

    const data = await response.json();
    if (onGroupUpdated) onGroupUpdated();
    if (onClose) onClose();
  };

  if (displayRemoveGroup)
    return (
      <RemoveGroup
        group={group}
        onClose={() => setDisplayRemoveGroup(false)}
      ></RemoveGroup>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl">Paramètres du groupe</h2>
        <CloseButton as={Button} rounded={true}>
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-100"
        placeholder="Nom du groupe"
        value={editableGroup.name}
        onChange={(e) =>
          setEditableGroup({ ...editableGroup, name: e.target.value })
        }
      />
      <Button onClick={handleUpdateGroup}>Valider les modifications</Button>

      <hr className="my-6 border-gray-400"></hr>
      <h2 className="block font-bold text-xl"> Supprimer le groupe :</h2>
      <div>
        Attention, le groupe sera supprimé définitivement et toutes les dépenses
        seront perdues.
      </div>
      <div>
        <Button
          onClick={() => setDisplayRemoveGroup(true)}
          className=" bg-red-400"
        >
          Supprimer le groupe
        </Button>
      </div>
    </div>
  );
}
