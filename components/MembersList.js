"use client";

import Button from "@/components/Button";
import { PencilIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import CreateMember from "./CreateMember";
import UpdateMember from "./UpdateMember";
import { CloseButton } from "@headlessui/react";

export default function MembersList({ groupId }) {
  const [members, setMembers] = useState([]);

  let [displayAddMember, setDisplayAddMember] = useState(false);
  let [editMember, setEditMember] = useState();

  const fetchMembers = () => {
    fetch(`http://localhost:3000/groups/${groupId}/members/`)
      .then((response) => response.json())
      .then((data) => {
        setMembers(data.data);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (displayAddMember)
    return (
      <CreateMember
        groupId={groupId}
        onClose={() => setDisplayAddMember(false)}
      ></CreateMember>
    );

  if (editMember)
    return (
      <UpdateMember
        groupId={groupId}
        member={editMember}
        onClose={() => setEditMember()}
      ></UpdateMember>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="block font-bold text-xl"> Gestion des membres :</h2>
        <CloseButton as={Button} rounded={true} className="bg-gray-400">
          <XMarkIcon className="size-6" />
        </CloseButton>
      </div>

      {members.map((member, index) => (
        <div key={index}>
          <div className="flex gap-4 items-center justify-between">
            <div className="font-bold">{member.name} :</div>
            <div>Part : {member.share}%</div>
            <Button onClick={() => setEditMember(member)} rounded="true">
              <PencilIcon className="size-4 text-white" />
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={() => setDisplayAddMember(true)} className="gap-2">
        <UserPlusIcon className="size-5 text-white" /> Ajouter un membre
      </Button>
    </div>
  );
}
