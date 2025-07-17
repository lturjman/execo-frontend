"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../lib/store/slices/groups";
import Button from "@/components/Button";
import CreateGroup from "@/components/CreateGroup";
import GroupCard from "@/components/GroupCard";
import { useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CloseButton } from "@headlessui/react";

export default function groupsList() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.items);
  const loading = useSelector((state) => state.groups.loading);

  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (loading) return <div>Chargement...</div>;
  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Message de bienvenue */}
      <h1 className="text-xl font-bold mb-6">Hello !</h1>

      <div className="grid grid-cols-2 gap-4 ">
        {groups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>

      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsOpen(true)} className="w-16 h-16">
          <PlusIcon className="size-7"></PlusIcon>
        </Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          transition
          className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30 " />{" "}
          <div className="fixed p-4 w-full flex justify-center">
            <DialogPanel className=" bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4 max-w-md w-full space-y-4">
              <div className="flex justify-between items-center">
                <DialogTitle className="block font-bold text-xl">
                  Nouveau Groupe
                </DialogTitle>
                <CloseButton as={Button} rounded={true} className="bg-gray-400">
                  <XMarkIcon className="size-6" />
                </CloseButton>
              </div>

              <CreateGroup
                onGroupCreated={fetchGroups}
                onClose={() => setIsOpen(false)}
              ></CreateGroup>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
