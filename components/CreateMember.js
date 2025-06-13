"use client";

import Button from "@/components/Button";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CreateMember({ groupId }) {
  // const router = useRouter();
  const [member, setMember] = useState({
    name: "",
    monthlyRevenue: null,
    monthlyCharges: null,
    share: 0,
  });

  const handleCreateMember = async () => {
    const response = await fetch(
      `http://localhost:3000/groups/${groupId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ member }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la création du membre");
    }

    const responseBody = await response.json();
    // const createdMember = responseBody.data;
    // router.push(`groups/${groupId}/members/${createdMember._id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouveau membre :</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>
      <div>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Nom"
          onChange={(e) => setMember({ ...member, name: e.target.value })}
        />

        <input
          type="number"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Revenus"
          onChange={(e) =>
            setMember({ ...member, monthlyRevenue: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Charges personnelles fixes"
          onChange={(e) =>
            setMember({ ...member, monthlyCharges: Number(e.target.value) })
          }
        />
        <div>Part : {member.share}%</div>
        <CloseButton as={Button} onClick={handleCreateMember} className="my-4">
          Ajouter au groupe
        </CloseButton>
      </div>
    </div>
  );
}
