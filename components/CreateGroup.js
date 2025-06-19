"use client";

import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { createGroup } from "../lib/store/slices/groups";

import Button from "@/components/Button";
import { useState } from "react";

export default function CreateGroup({}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [group, setGroup] = useState({
    name: "",
  });

  const handleCreateGroup = async () => {
    const action = await dispatch(createGroup(group));
    if (createGroup.fulfilled.match(action)) {
      router.push(`/groups/${action.payload._id}`);
    }
  };

  return (
    <div>
      <label htmlFor="name">Nom du groupe</label>
      <input
        type="text"
        name="name"
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
