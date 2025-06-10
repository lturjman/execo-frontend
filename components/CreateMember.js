"use client";

import Button from "@/components/Button";

import { useState } from "react";

export default function CreateMember({}) {
  const [member, setMember] = useState({
    name: "",
    monthlyRevenue: null,
    monthlyCharges: null,
    share: 0,
  });

  return (
    <div>
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
        <label className="block mb-2 font-bold"> Nouveau membre :</label>
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
          <Button
            onClick={() => alert("Le membre a été ajouté au groupe !")}
            className="my-4"
          >
            Ajouter au groupe
          </Button>
        </div>
      </div>
    </div>
  );
}
