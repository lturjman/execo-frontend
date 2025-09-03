"use client";

import Button from "@/components/Button";
import { PencilIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import CreateMember from "./Create";
import UpdateMember from "./Update";

import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "@/lib/store/slices/members";

export default function MembersList({ groupId }) {
  let [displayAddMember, setDisplayAddMember] = useState(false);
  let [editMember, setEditMember] = useState();

  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.items);
  const loading = useSelector((state) => state.members.loading);

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

  if (loading) return <div>Chargement...</div>;

  if (displayAddMember)
    return (
      <CreateMember
        groupId={groupId}
        onClose={() => setDisplayAddMember(false)}
        onMemberCreated={onMemberCreated}
      ></CreateMember>
    );

  if (editMember)
    return (
      <UpdateMember
        groupId={groupId}
        member={editMember}
        onClose={setEditMember}
        onMemberUpdatedOrDeleted={onMemberUpdatedOrDeleted}
      ></UpdateMember>
    );

  return (
    <div className="space-y-4 ">
      {members.map((member, index) => (
        <div key={index}>
          <div className="flex gap-4 items-center">
            <div className="font-bold w-1/3">{member.name} :</div>
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

      <Button
        onClick={() => setDisplayAddMember(true)}
        className="gap-2 max-w-xl mx-auto mt-6"
      >
        <UserPlusIcon className="size-5 text-white" /> Ajouter un membre
      </Button>
    </div>
  );
}
