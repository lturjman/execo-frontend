"use client";
import { useDispatch, useSelector } from "react-redux";
import { createMember } from "@/lib/store/slices/members";
import Button from "@/components/Button";
import { useState } from "react";
import { validateMember } from "../../utils/validateMember";

export default function CreateMember({ onMemberCreated, onClose, groupId }) {
  const loading = useSelector((state) => state.members.loading);

  const dispatch = useDispatch();

  const [member, setMember] = useState({
    nickname: "",
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
    <div className=" space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Nouveau membre :</h2>
      </div>
      <label htmlFor="nickname">Nom du membre</label>
      <input
        type="text"
        id="nickname"
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        placeholder="John Doe"
        onChange={(e) => setMember({ ...member, nickname: e.target.value })}
      />
      {errors.nickname && (
        <p className="text-red-500 text-sm mb-2">{errors.nickname}</p>
      )}

      <Button onClick={handleCreateMember} loading={loading} className="mt-4">
        Ajouter au groupe
      </Button>
      <Button
        onClick={onClose}
        className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600"
      >
        Annuler
      </Button>
    </div>
  );
}
