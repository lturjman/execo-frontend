"use client";

import Button from "@/components/Button";
import { useState } from "react";

export default function UpdateMember({}) {
  const [member, setMember] = useState({});
  return (
    <div>
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4">
        <label className="block mb-2 font-bold"> Modifier membre :</label>
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
            onClick={() => alert("Le membre a été modifié !")}
            className="my-4"
          >
            Valider les modifications
          </Button>
        </div>
        <hr className="my-2"></hr>
        <label className="block mb-2 font-bold"> Supprimer le membre :</label>
        <div>
          Attention, le membre sera supprimé définitivement et les dépenses
          seront réparties entre les autres membres du groupe
        </div>
        <Button
          onClick={() => alert("Le membre a été surrpimé du groupe !")}
          className="my-4 bg-red-400"
        >
          Supprimer le membre
        </Button>
      </div>
    </div>
  );
}
