"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import Image from "next/image";
import Button from "@/components/Button";
import {
  ArrowLeftIcon,
  PencilIcon,
  Cog8ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import CreateMember from "@/components/CreateMember";
import UpdateMember from "@/components/UpdateMember";
import RemoveMember from "@/components/RemoveMember";
import GroupParameters from "@/components/GroupParameters";
import MembersList from "@/components/MembersList";
import { useState, useEffect, use } from "react";

export default function GroupPage({ params }) {
  const { id } = use(params);
  const [group, setGroup] = useState({});
  let [groupIsOpen, setGroupIsOpen] = useState(false);

  const [member, setMember] = useState({});
  let [memberIsOpen, setMemberIsOpen] = useState(false);

  const fetchGroup = () => {
    fetch(`http://localhost:3000/groups/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setGroup(data.data);
      });
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-gray-200 min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden ">
        <div className="relative">
          <Image
            src="/images/groupImg.png"
            alt="Image de groupe"
            width={200}
            height={100}
            className="object-cover w-full h-full"
          />
          {/* Retour */}
          <Button href="/groups" rounded="true" className="absolute">
            <ArrowLeftIcon className="size-5 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex gap-2 ">
            <h1 className="text-xl font-semibold grow">{group.name}</h1>

            {/* Member parameters */}
            <div>
              <Button rounded="true" className="">
                <UsersIcon
                  onClick={() => setMemberIsOpen(true)}
                  className="size-5 text-white"
                />
              </Button>
              <Dialog
                open={memberIsOpen}
                onClose={() => setMemberIsOpen(false)}
                transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed p-4 w-full flex justify-center">
                  <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                    <MembersList
                      groupId={group._id}
                      onClose={() => setMemberIsOpen(false)}
                    ></MembersList>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>

            {/* Group parameters */}
            <div>
              <Button
                rounded="true"
                className=""
                onClick={() => setGroupIsOpen(true)}
              >
                <Cog8ToothIcon className="size-5 text-white" />
              </Button>
              <Dialog
                open={groupIsOpen}
                onClose={() => setGroupIsOpen(false)}
                transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed p-4 w-full flex justify-center">
                  <DialogPanel className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4">
                    <GroupParameters
                      group={group}
                      onGroupUpdated={fetchGroup}
                      onClose={() => setGroupIsOpen(false)}
                    ></GroupParameters>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des dettes */}
      <section className="space-y-2">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Laura</span>
          <span>doit</span>
          <span className="font-semibold">2,38€</span>
          <span>à</span>
          <span className="font-semibold">Sherpa</span>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex justify-center space-x-2">
          <span className="font-semibold">Lucas</span>
          <span>doit</span>
          <span className="font-semibold">11,05€</span>
          <span>à</span>
          <span className="font-semibold">Laura</span>
        </div>
      </section>

      {/* Ajouter une dépense */}
      <section className="flex justify-center">
        <Button>Ajouter une dépense</Button>
      </section>

      {/* Tableau des dépenses */}
      <section className="w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-1">Dépenses</th>
              <th className="py-1">Membres</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2">15,68€</td>
              <td>Laura</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">22,10€</td>
              <td>Lucas</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2">7,32€</td>
              <td>Sherpa</td>
              <td>
                <button>
                  <PencilIcon className="size-5 text-purple-400" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
