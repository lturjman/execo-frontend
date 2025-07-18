"use client";

import RemoveGroup from "./Remove";
import { CloseButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { updateGroup } from "@/lib/store/slices/groups";

import { validateGroup } from "@/utils/validateGroup";

export default function GroupParameters({ onClose, group }) {
  const dispatch = useDispatch();

  const [editableGroup, setEditableGroup] = useState(group);
  let [displayRemoveGroup, setDisplayRemoveGroup] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditableGroup(group);
  }, [group]);

  const handleUpdateGroup = async () => {
    const isValid = await validateGroup(editableGroup, setErrors);
    if (isValid) {
      const action = await dispatch(updateGroup(editableGroup));
      if (updateGroup.fulfilled.match(action)) {
        if (onClose) onClose();
      }
    }
  };

  if (displayRemoveGroup)
    return (
      <RemoveGroup
        group={group}
        onClose={() => setDisplayRemoveGroup(false)}
      ></RemoveGroup>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl">Paramètres du groupe</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>

      <label htmlFor="name">Nom du groupe</label>
      <input
        type="text"
        name="name"
        className="w-full p-2 rounded bg-gray-100"
        placeholder="Famille, Coloc, ..."
        value={editableGroup.name}
        onChange={(e) =>
          setEditableGroup({ ...editableGroup, name: e.target.value })
        }
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <Button onClick={handleUpdateGroup}>Valider les modifications</Button>

      <hr className="my-6 border-gray-400"></hr>
      <h2 className="block font-bold text-xl"> Supprimer le groupe :</h2>
      <div>
        Attention, le groupe sera supprimé définitivement et toutes les dépenses
        seront perdues.
      </div>
      <div>
        <Button
          onClick={() => setDisplayRemoveGroup(true)}
          className=" bg-red-400"
        >
          Supprimer le groupe
        </Button>
      </div>
    </div>
  );
}
