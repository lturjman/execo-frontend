"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { CloseButton } from "@headlessui/react";
import RemoveMember from "./RemoveMember";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function UpdateMember({ member, groupId, onClose }) {
  const [editableMember, setEditableMember] = useState({ ...member });
  let [displayRemoveMember, setDisplayRemoveMember] = useState(false);

  useEffect(() => {
    if (member) {
      setEditableMember({ ...member });
    }
  }, [member]);

  const handleUpdateMember = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${groupId}/members/${member._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ member: editableMember }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la modification du membre");
    }

    const data = await response.json();
    if (onClose) onClose();
  };

  if (displayRemoveMember)
    return (
      <RemoveMember
        groupId={groupId}
        member={member}
        onClose={() => setDisplayRemoveMember(false)}
      ></RemoveMember>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block mb-2 font-bold text-xl"> Modifier membre :</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>
      <div>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Nom"
          value={editableMember.name}
          onChange={(e) =>
            setEditableMember({ ...editableMember, name: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Revenus"
          value={editableMember.monthlyRevenue}
          onChange={(e) =>
            setEditableMember({
              ...editableMember,
              monthlyRevenue: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Charges personnelles fixes"
          value={editableMember.monthlyCharges}
          onChange={(e) =>
            setEditableMember({
              ...editableMember,
              monthlyCharges: Number(e.target.value),
            })
          }
        />
        <div>Part : {editableMember.share}%</div>
        <CloseButton as={Button} className="my-4" onClick={handleUpdateMember}>
          Valider les modifications
        </CloseButton>
      </div>
      <hr className="my-2"></hr>
      <label className="block mb-2 font-bold"> Supprimer le membre :</label>
      <div>
        Attention, le membre sera supprimé définitivement et les dépenses seront
        réparties entre les autres membres du groupe
      </div>
      <Button
        onClick={() => setDisplayRemoveMember(true)}
        className="my-4 bg-red-400"
      >
        Supprimer le membre
      </Button>
    </div>
  );
}
