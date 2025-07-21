"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import RemoveMember from "./Remove";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useDispatch } from "react-redux";
import { updateMember } from "../../lib/store/slices/members";

import { validateMember } from "../../utils/validateMember";

export default function UpdateMember({
  member,
  groupId,
  onClose,
  onMemberUpdatedOrDeleted,
}) {
  const dispatch = useDispatch();

  const [editableMember, setEditableMember] = useState({ ...member });
  let [displayRemoveMember, setDisplayRemoveMember] = useState(false);

  useEffect(() => {
    if (member) {
      setEditableMember({ ...member });
    }
  }, [member]);

  const [errors, setErrors] = useState({});

  const handleUpdateMember = async () => {
    if (validateMember(editableMember, setErrors)) {
      const action = await dispatch(
        updateMember({ groupId: member.group, member: editableMember })
      );

      if (updateMember.fulfilled.match(action)) {
        onMemberUpdatedOrDeleted();
      }
    }
  };

  if (displayRemoveMember)
    return (
      <RemoveMember
        groupId={groupId}
        member={member}
        onClose={() => setDisplayRemoveMember(false)}
        onMemberDeleted={onMemberUpdatedOrDeleted}
      ></RemoveMember>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block mb-2 font-bold text-xl"> Modifier membre :</h2>
        <Button
          onClick={() => onClose()}
          rounded={true}
          className="bg-zinc-400"
        >
          <XMarkIcon className="size-6" />
        </Button>
      </div>
      <div>
        <label htmlFor="name">Nom du membre</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 mb-4 rounded bg-zinc-100 dark:bg-zinc-600 dark:text-zinc-200"
          placeholder="Nom"
          value={editableMember.name}
          onChange={(e) =>
            setEditableMember({ ...editableMember, name: e.target.value })
          }
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>
        )}

        <label htmlFor="monthlyRevenue">Revenus mensuels</label>
        <input
          type="number"
          name="monthlyRevenue"
          className="w-full p-2 mb-4 rounded bg-zinc-100 dark:bg-zinc-600 dark:text-zinc-200"
          placeholder="Revenus"
          value={editableMember.monthlyRevenue}
          onChange={(e) =>
            setEditableMember({
              ...editableMember,
              monthlyRevenue: Number(e.target.value),
            })
          }
        />
        {errors.monthlyRevenue && (
          <p className="text-red-500 text-sm mb-2">{errors.monthlyRevenue}</p>
        )}

        <label htmlFor="monthlyCharges">Charges personnelles fixes</label>
        <input
          type="number"
          className="w-full p-2 mb-4 rounded bg-zinc-100 dark:bg-zinc-600 dark:text-zinc-200"
          placeholder="Charges personnelles fixes"
          value={editableMember.monthlyCharges}
          onChange={(e) =>
            setEditableMember({
              ...editableMember,
              monthlyCharges: Number(e.target.value),
            })
          }
        />
        {errors.monthlyCharges && (
          <p className="text-red-500 text-sm mb-2">{errors.monthlyCharges}</p>
        )}
        <div>Part : {(member.share * 100).toFixed(2) + "%"}</div>
        <Button className="my-4" onClick={handleUpdateMember}>
          Valider les modifications
        </Button>
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
