"use client";
import { useDispatch } from "react-redux";
import { createMember } from "@/lib/store/slices/members";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateMember } from "../utils/validateMember";

export default function CreateMember({ onMemberCreated, onClose, groupId }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const [member, setMember] = useState({
    name: "",
    monthlyRevenue: null,
    monthlyCharges: null,
    share: 0,
  });

  const [errors, setErrors] = useState({});

  const handleCreateMember = async () => {
    if (validateMember(member, setErrors)) {
      const action = await dispatch(createMember({ groupId, member }));

      if (createMember.fulfilled.match(action)) {
        if (onMemberCreated) onMemberCreated();
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouveau membre :</h2>
      </div>
      <label htmlFor="name">Nom du membre</label>
      <input
        type="text"
        name="name"
        className="w-full p-2 mb-4 rounded bg-gray-100"
        placeholder="Nom"
        onChange={(e) => setMember({ ...member, name: e.target.value })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mb-2">{errors.name}</p>
      )}

      <label htmlFor="monthlyRevenue">Revenus mensuels</label>
      <input
        type="number"
        name="monthlyRevenue"
        className="w-full p-2 mb-4 rounded bg-gray-100"
        placeholder="Revenus"
        onChange={(e) =>
          setMember({ ...member, monthlyRevenue: Number(e.target.value) })
        }
      />
      {errors.monthlyRevenue && (
        <p className="text-red-500 text-sm mb-2">{errors.monthlyRevenue}</p>
      )}

      <label htmlFor="monthlyCharges">Charges personnelles fixes</label>
      <input
        type="number"
        name="monthlyCharges"
        className="w-full p-2 mb-4 rounded bg-gray-100"
        placeholder="Charges personnelles fixes"
        onChange={(e) =>
          setMember({ ...member, monthlyCharges: Number(e.target.value) })
        }
      />
      {errors.monthlyCharges && (
        <p className="text-red-500 text-sm mb-2">{errors.monthlyCharges}</p>
      )}
      <div>Part : {member.share}%</div>
      <Button onClick={handleCreateMember}>Ajouter au groupe</Button>
      <Button onClick={onClose} className="bg-gray-400">
        Annuler
      </Button>
    </div>
  );
}
