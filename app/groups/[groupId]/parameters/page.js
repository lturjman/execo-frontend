import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import GroupParameters from "@/components/groups/Parameters";

export default function ParametersPage({ params }) {
  const groupId = params.groupId;

  return (
    <div className="min-h-screen bg-zinc-200 dark:bg-zinc-600 p-4 flex flex-col items-center relative">
      <Button
        href={`/groups/${groupId}`}
        rounded="true"
        className="absolute left-4 top-4"
      >
        <ArrowLeftIcon className="size-5 text-white" />
      </Button>

      <h1 className="font-bold text-3xl md:text-4xl text-center mt-20 md:mt-10 ">
        Paramètres du groupe
      </h1>

      <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden p-6 mt-12">
        <GroupParameters group={{ _id: groupId }} />
      </div>
    </div>
  );
}
