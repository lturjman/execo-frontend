"use client";

import RemoveGroup from "./Remove";

import Button from "@/components/Button";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateGroup } from "@/lib/store/slices/groups";

import { validateGroup } from "@/utils/validateGroup";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

export default function GroupParameters({ onClose, groupId }) {
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups.items?.find((group) => group._id === groupId)
  );

  const [editableGroup, setEditableGroup] = useState({ ...group });
  let [displayRemoveGroup, setDisplayRemoveGroup] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (group) setEditableGroup(group);
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
    <div className="space-y-4 p-2">
      <label htmlFor="name">Nom du groupe</label>
      <input
        type="text"
        name="name"
        className="appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200"
        placeholder="Famille, Coloc, ..."
        value={editableGroup.name}
        onChange={(e) =>
          setEditableGroup({ ...editableGroup, name: e.target.value })
        }
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <Button onClick={handleUpdateGroup}>Valider les modifications</Button>

      <hr className="my-6 border-zinc-400"></hr>
      <h2 className="block font-bold text-2xl"> Supprimer le groupe :</h2>
      <div>
        Attention, le groupe sera supprimé définitivement et toutes les dépenses
        seront perdues.
      </div>
      <div>
        <Button
          onClick={() => setDisplayRemoveGroup(true)}
          className=" bg-red-400 hover:bg-red-500 active:bg-red-600"
        >
          Supprimer le groupe
        </Button>
      </div>

      <Dialog
        open={displayRemoveGroup}
        onClose={() => setDisplayRemoveGroup(false)}
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70 p-4 z-50"
      >
        <DialogBackdrop className="fixed inset-0" />
        <div className="fixed p-4 w-full flex justify-center">
          <DialogPanel className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 dark:bg-zinc-700">
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
