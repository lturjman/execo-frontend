import Button from "@/components/Button";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import Parameters from "@/components/groups/CardParameters";

import MembersGroupClient from "@/components/members/MembersGroupClient";

import Notes from "@/components/notes/Notes";
import Lists from "@/components/lists/Lists";

export default async function GroupPage({ params }) {
  const { groupId } = await params;

  return (
    <div className="p-4  bg-zinc-200 w-full min-h-screen dark:bg-zinc-600">
      <div className="max-w-5xl mx-auto mt-10 md:mt-0 flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-6">
          <div className=" bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Retour */}
            <Button href="/groups" rounded="true" className="absolute">
              <ArrowLeftIcon className="size-5 text-white" />
            </Button>

            <Parameters />
          </div>

          <MembersGroupClient groupId={groupId} />
        </div>

        <aside className="w-full md:w-1/3 shrink-0 space-y-4">
          <Notes groupId={groupId} />
          <Lists groupId={groupId} />
        </aside>
      </div>
    </div>
  );
}
