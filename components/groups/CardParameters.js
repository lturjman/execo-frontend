"use client";

import { Cog8ToothIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import Image from "next/image";

import { fetchGroup } from "@/lib/store/slices/groups";

import { useRouter } from "next/navigation";
export default function groupParameters() {
  const router = useRouter();

  const params = useParams();
  const id = params.groupId;

  const group = useSelector((state) =>
    state.groups.items.find((g) => g && g._id === id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroup(id));
  }, [dispatch, id]);

  return (
    <div className=" dark:bg-zinc-800 bg-white rounded-2xl shadow-lg space-y-4">
      <div>
        <div className=" flex h-[25vh] overflow-hidden justify-center">
          <Image
            src={group.imageUrl || "/images/group1.jpg"}
            alt={`Image de groupe ${group.name}`}
            width={1000}
            height={500}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-between p-4 space-x-2">
          <h1 className="text-xl font-semibold grow">{group?.name}</h1>

          <Button
            rounded="true"
            onClick={() => router.push(`/groups/${id}/members`)}
          >
            <UsersIcon className="size-5 text-white" />
          </Button>

          <Button
            rounded="true"
            onClick={() => router.push(`/groups/${id}/parameters`)}
          >
            <Cog8ToothIcon className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
