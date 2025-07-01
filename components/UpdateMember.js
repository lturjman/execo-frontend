"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { CloseButton } from "@headlessui/react";
import RemoveMember from "./RemoveMember";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useDispatch } from "react-redux";
import { updateMember } from "../lib/store/slices/members";

export default function UpdateMember({ member, groupId, onClose }) {
  const dispatch = useDispatch();

  const [editableMember, setEditableMember] = useState({ ...member });
  let [displayRemoveMember, setDisplayRemoveMember] = useState(false);

  useEffect(() => {
    if (member) {
      setEditableMember({ ...member });
    }
  }, [member]);

  const handleUpdateMember = async () => {
    const action = await dispatch(
      updateMember({ groupId: member.group, member: editableMember })
    );
    if (updateMember.fulfilled.match(action)) {
      await dispatch(fetchMembers({ groupId }));
      onClose();
    }
  };

  if (displayRemoveMember)
    return (
      <RemoveMember
        groupId={groupId}
        member={member}
        onClose={() => onClose()}
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
        <label htmlFor="name">Nom du membre</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 mb-4 rounded bg-gray-100"
          placeholder="Nom"
          value={editableMember.name}
          onChange={(e) =>
            setEditableMember({ ...editableMember, name: e.target.value })
          }
        />

        <label htmlFor="monthlyRevenue">Revenus mensuels</label>
        <input
          type="number"
          name="monthlyRevenue"
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

        <label htmlFor="monthlyCharges">Charges personnelles fixes</label>
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
