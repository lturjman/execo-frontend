"use client";

import { useDispatch } from "react-redux";
import { fetchGroups } from "@/lib/store/slices/groups";
import CreateGroup from "@/components/groups/Create";
import Button from "@/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function NewGroupPage() {
  const dispatch = useDispatch();

  return (
    <div className="p-6 max-w-4xl mx-auto my-[10vh]">
      <Button href={`/groups`} rounded="true" className="absolute">
        <ArrowLeftIcon className="size-5 text-white" />
      </Button>
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau Groupe</h1>

      <CreateGroup onGroupCreated={() => dispatch(fetchGroups())} />
    </div>
  );
}
