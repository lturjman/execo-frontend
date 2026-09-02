"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import CreateMember from "./Create";
import UpdateMember from "./Update";

import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "@/lib/store/slices/members";

export default function MembersList({ groupId }) {
  const [displayAddMember, setDisplayAddMember] = useState(false);
  const [editMember, setEditMember] = useState();

  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.items);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMembers({ groupId }));
    }
  }, [dispatch, groupId]);

  function onMemberCreated() {
    setDisplayAddMember(false);
    dispatch(fetchMembers({ groupId }));
  }
  function onMemberUpdatedOrDeleted() {
    setEditMember();
    dispatch(fetchMembers({ groupId }));
  }

  if (displayAddMember) {
    return (
      <CreateMember
        groupId={groupId}
        onClose={() => setDisplayAddMember(false)}
        onMemberCreated={onMemberCreated}
      />
    );
  }

  if (editMember) {
    return (
      <UpdateMember
        groupId={groupId}
        member={editMember}
        onClose={setEditMember}
        onMemberUpdatedOrDeleted={onMemberUpdatedOrDeleted}
      />
    );
  }

  return (
    <div className="space-y-4 ">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-zinc-700 space-y-2">
        <p className="font-bold text-base">
          Comment sont calculées les parts ? 💛
        </p>
        <p>
          Les parts de chaque membre sont calculées automatiquement en fonction
          de leur reste à vivre. Pour modifier vos informations, rendez-vous
          directement dans votre{" "}
          <Link
            href="/profile"
            className="underline font-semibold hover:text-yellow-600"
          >
            Espace utilisateur
          </Link>
          .
        </p>
        <p>
          Si un membre n'a pas encore renseigné toutes ses informations, les
          dépenses sont réparties à parts égales entre tous, jusqu'à ce que
          chacun ait complété son profil.
        </p>
      </div>
      {members.map((member, index) => (
        <div key={index}>
          <div className="flex gap-4 items-center">
            <div className="font-bold w-1/3">
              {member.nickname} :
              <span
                className={`block text-xs font-normal mt-0.5 ${member.owner ? "text-purple-600" : "text-zinc-400"}`}
              >
                {member.owner ? "Administrateur" : "Utilisateur"}
              </span>
            </div>
            <div className="text-right w-1/3">
              Part: {(member.share * 100).toFixed(2) + "%"}
            </div>
            <div className="w-1/3 flex justify-end">
              <Button onClick={() => setEditMember(member)} rounded="true">
                <PencilIcon className="size-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <Button
          onClick={() => setDisplayAddMember(true)}
          className="gap-2 max-w-xl mx-auto mt-6"
        >
          <UserPlusIcon className="size-5 text-white" /> Ajouter un membre
        </Button>

        <Button
          className="bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 max-w-xl mx-auto "
          href={`/groups/${groupId}`}
        >
          Retour au groupe
        </Button>
      </div>
    </div>
  );
}
