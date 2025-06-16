"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import Button from "@/components/Button";
import Image from "next/image";
import CreateGroup from "@/components/CreateGroup";
import GroupCard from "@/components/GroupCard";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [groups, setGroups] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  const fetchGroups = () => {
    fetch(`http://localhost:3000/groups`)
      .then((response) => response.json())
      .then((response) => {
        setGroups(response.data);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Logo Execo */}
      <div className="mb-4">
        <Image
          src="/images/execoLogo01.png"
          alt="Logo Execo"
          width={100}
          height={50}
        />
      </div>

      {/* Message de bienvenue */}
      <h1 className="text-xl font-bold mb-6">Hello, User !</h1>

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
          <DialogBackdrop className="fixed inset-0 bg-black/30" />{" "}
          <div className="fixed p-4 w-full flex justify-center">
            <DialogPanel className=" bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4 max-w-md w-full">
              <DialogTitle className="text-xl font-bold mb-4">
                Nouveau Groupe
              </DialogTitle>
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
