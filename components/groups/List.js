"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "@/lib/store/slices/groups";
import Button from "@/components/Button";
import CreateGroup from "@/components/groups/Create";
import GroupCard from "@/components/groups/Card";
import { useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CloseButton } from "@headlessui/react";
import Link from "next/link";

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
    <div className="p-4 space-y-6">
      {/* Message de bienvenue */}

      {groups.length === 0 ? (
        // Cas où il n'y a aucun groupe
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-6 text-white space-y-8 ">
          <h1 className="text-3xl font-extrabold text-center">
            Bienvenue sur Execo !
          </h1>

          <p className="max-w-2xl text-center text-lg leading-relaxed text-white/90">
            Execo est une application qui permet de partager les dépenses en
            fonction des moyens financiers de chacun de manière équitable.
          </p>

          <ul className="bg-white/90 text-zinc-800 rounded-xl shadow-md px-8 py-6 text-base w-full max-w-xl">
            <li className="text-lg font-semibold mb-2">Pour bien démarrer :</li>
            <li className="flex">
              <div className=" font-bold  text-purple-400 ">1</div>{" "}
              <div className="ml-5 ">Créez un groupe</div>
            </li>
            <li className="flex">
              <div className=" font-bold text-purple-400 ">2</div>{" "}
              <div className="ml-5 ">
                Ajoutez des membres, leurs revenus et charges fixes
              </div>
            </li>
            <li className="flex">
              <div className=" font-bold text-purple-400 ">3</div>{" "}
              <div className="ml-5 ">Saisissez les dépenses partagées</div>
            </li>
          </ul>

          {/* <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition-transform hover:scale-102 duration-300 ease-in-out"
          >
            <div className="flex flex-col items-center justify-center w-64 aspect-video border-2 border-dashed border-white/60 backdrop-blur-md rounded-xl text-white hover:border-purple-400 hover:text-purple-200 p-6 shadow-inner">
              <PlusIcon className="w-10 h-10" />
              <span className="mt-3 font-medium text-lg">
                Ajouter un groupe
              </span>
            </div>
          </div> */}
          <Link href="/groups/new">
            <div className="cursor-pointer transition-transform hover:scale-102 duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center w-64 aspect-video border-2 border-dashed border-white/60 backdrop-blur-md rounded-xl text-white hover:border-purple-400 hover:text-purple-200 p-6 shadow-inner">
                <PlusIcon className="w-10 h-10" />
                <span className="mt-3 font-medium text-lg">
                  Ajouter un groupe
                </span>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        // Cas où il y a des groupes
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}

            {/* Carte d'ajout en fin de liste */}
            <Link href="/groups/new">
              <div className="hidden sm:flex h-full w-full max-w-sm cursor-pointer transition-transform hover:scale-105 duration-300 ease-in-out flex-col items-center justify-center border-2 border-dashed border-white/60 backdrop-blur-md rounded-xl text-white hover:border-purple-400 hover:text-purple-200 p-6 shadow-inner">
                <PlusIcon className="w-10 h-10" />
                <span className="mt-3 font-medium text-lg text-center">
                  Ajouter un groupe
                </span>
              </div>
            </Link>
            {/* <Link href="/groups/new">
              <Button className="w-24 h-24 shadow-md">
                <PlusIcon className="size-9"></PlusIcon>
              </Button>
            </Link> */}
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <div className="sm:hidden fixed bottom-6 right-6">
        <Link href="/groups/new">
          <Button className="w-24 h-24 shadow-md">
            <PlusIcon className="size-9"></PlusIcon>
          </Button>
        </Link>
        {/* <Button onClick={() => setIsOpen(true)} className="w-24 h-24 shadow-md">
          <PlusIcon className="size-9"></PlusIcon>
        </Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          transition
          className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30 " />{" "}
          <div className="fixed p-4 w-full flex justify-center">
            <DialogPanel className=" bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4 max-w-md w-full space-y-4 dark:bg-zinc-800">
              <div className="flex justify-between items-center">
                <DialogTitle className="block font-bold text-xl">
                  Nouveau Groupe
                </DialogTitle>
                <CloseButton as={Button} rounded={true} className="bg-zinc-400">
                  <XMarkIcon className="size-6" />
                </CloseButton>
              </div>

              <CreateGroup
                onGroupCreated={fetchGroups}
                onClose={() => setIsOpen(false)}
              ></CreateGroup>
            </DialogPanel>
          </div>
        </Dialog> */}
      </div>
    </div>
  );
}
