"use client";

import RemoveGroup from "./Remove";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { updateGroup } from "@/lib/store/slices/groups";

import { validateGroup } from "@/utils/validateGroup";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

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

  return (
    <div className="space-y-4 ">
      <h2 className="block font-bold text-xl">Paramètres du groupe</h2>

      <label htmlFor="name">Nom du groupe</label>
      <input
        type="text"
        name="name"
        className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-600 dark:text-zinc-200"
        placeholder="Famille, Coloc, ..."
        value={editableGroup.name}
        onChange={(e) =>
          setEditableGroup({ ...editableGroup, name: e.target.value })
        }
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <Button onClick={handleUpdateGroup}>Valider les modifications</Button>

      <hr className="my-6 border-zinc-400"></hr>
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

      <Dialog
        open={displayRemoveGroup}
        onClose={() => setDisplayRemoveGroup(false)}
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 z-50"
      >
        <DialogBackdrop className="fixed inset-0" />
        <div className="fixed p-4 w-full flex justify-center">
          <DialogPanel className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 dark:bg-zinc-800">
            <RemoveGroup
              group={group}
              onClose={() => setDisplayRemoveGroup(false)}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
