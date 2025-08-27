"use client";
import GroupParameters from "@/components/groups/Parameters";
import MembersList from "@/components/members/List";

import { Cog8ToothIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { fetchGroup } from "@/lib/store/slices/groups";

export default function groupParameters() {
  const params = useParams();
  const id = params.groupId;

  const group = useSelector((state) =>
    state.groups.items.find((g) => g && g._id === id)
  );

  let [groupIsOpen, setGroupIsOpen] = useState(false);
  let [memberIsOpen, setMemberIsOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroup(id));
  }, [dispatch, id]);

  console.log(group);
  return (
    <div className="p-4 space-y-2 dark:bg-zinc-800">
      <div className="flex gap-2 ">
        <h1 className="text-xl font-semibold grow">{group?.name}</h1>

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
            <DialogBackdrop className="fixed inset-0 " />
            <div className="fixed p-4 w-full flex justify-center">
              <DialogPanel className="w-full max-w-[70vh]  bg-white rounded-2xl shadow-lg overflow-hidden p-4 dark:bg-zinc-800">
                <MembersList
                  groupId={group?._id}
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
            <DialogBackdrop className="fixed inset-0" />
            <div className="fixed p-4 w-full flex justify-center">
              <DialogPanel className="w-full max-w-[70vh]  bg-white rounded-2xl shadow-lg overflow-hidden p-4 dark:bg-zinc-800">
                <GroupParameters
                  group={group}
                  onClose={() => setGroupIsOpen(false)}
                ></GroupParameters>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
