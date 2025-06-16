"use client";

import Button from "@/components/Button";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function MembersList({}) {
  const [members, setMembers] = useState([
    { name: "Laura", monthlyRevenue: 1200, monthlyCharges: 100, share: 40 },
    { name: "Lucas", monthlyRevenue: 4000, monthlyCharges: 800, share: 60 },
  ]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 space-y-4">
      <label className="block mb-2 font-bold text-center">
        {" "}
        Gestion des membres :
      </label>

      {members.map((member, index) => (
        <div key={index}>
          <div className="flex gap-4 items-center justify-between">
            <div className="font-bold">{member.name} :</div>
            <div>Part : {member.share}%</div>
            <Button rounded="true">
              <PencilIcon className="size-4 text-white" />
            </Button>
          </div>
        </div>
      ))}

      <Button className="gap-2">
        <UserPlusIcon className="size-5 text-white" /> Ajouter un membre
      </Button>
    </div>
  );
}
