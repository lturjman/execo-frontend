"use client";

import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { createGroup } from "@/lib/store/slices/groups";

import Button from "@/components/Button";
import { useState } from "react";

import { validateGroup } from "@/utils/validateGroup";

const groupImages = [
  "/images/group1.jpg",
  "/images/group2.jpg",
  "/images/group3.jpg",
  "/images/group4.jpg",
  "/images/group5.jpg",
  "/images/group6.jpg",
];

export default function CreateGroup({}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [group, setGroup] = useState({
    name: "",
    imageUrl: groupImages[0],
  });
  const [errors, setErrors] = useState({});

  const handleCreateGroup = async () => {
    const isValid = await validateGroup(group, setErrors);
    if (isValid) {
      const action = await dispatch(createGroup(group));
      if (createGroup.fulfilled.match(action)) {
        router.push(`/groups/${action.payload._id}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="name">Nom du groupe</label>
      <input
        type="text"
        name="name"
        className=" mt-2 appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        placeholder="Nom du groupe"
        value={group.name}
        onChange={(e) => setGroup({ ...group, name: e.target.value })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mb-4">{errors.name}</p>
      )}

      <label className="block mb-2">Choisir une image de groupe :</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {groupImages.map((img) => (
          <button
            type="button"
            key={img}
            onClick={() => setGroup({ ...group, imageUrl: img })}
            className={`relative rounded-lg overflow-hidden border-2 transition 
              ${
                group.imageUrl === img
                  ? "border-purple-400 shadow-lg shadow-zinc-300"
                  : "border-transparent"
              }`}
          >
            <img
              src={img}
              alt="Option de groupe"
              className="w-full h-[15vh] md:h-[20vh] object-cover"
            />
          </button>
        ))}
      </div>

      <Button onClick={handleCreateGroup} className="my-4">
        Créer le groupe
      </Button>
    </div>
  );
}
